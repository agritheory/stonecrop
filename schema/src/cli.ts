#!/usr/bin/env node
/* oxlint-disable no-console */

/**
 * Stonecrop Schema CLI
 *
 * Converts GraphQL introspection results to Stonecrop doctype JSON schemas.
 *
 * Usage:
 *   stonecrop-schema generate --endpoint <url> --output <dir>
 *   stonecrop-schema generate --introspection <file.json> --output <dir>
 *   stonecrop-schema generate --sdl <file.graphql> --output <dir>
 *
 * @packageDocumentation
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { parseArgs } from 'node:util'
import { getIntrospectionQuery, type IntrospectionQuery } from 'graphql'

import { convertGraphQLSchema, formatDoctypeDrift, mergeIntrospectedDoctype } from './converter/index'
import { validateDoctype } from './validation'
import type { GraphQLConversionOptions } from './converter/types'

/**
 * Fetch an introspection result from a live GraphQL endpoint.
 *
 * @param endpoint - The GraphQL endpoint URL
 * @param headers - Optional HTTP headers
 * @returns The introspection query result
 */
async function fetchIntrospection(endpoint: string, headers?: Record<string, string>): Promise<IntrospectionQuery> {
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
		body: JSON.stringify({
			query: getIntrospectionQuery(),
		}),
	})

	if (!response.ok) {
		throw new Error(`Failed to fetch introspection: ${response.status} ${response.statusText}`)
	}

	const json: { data?: IntrospectionQuery; errors?: Array<{ message: string }> } = await response.json()

	if (json.errors?.length) {
		throw new Error(`GraphQL errors: ${json.errors.map(e => e.message).join(', ')}`)
	}

	if (!json.data) {
		throw new Error('No data in introspection response')
	}

	return json.data
}

async function main(): Promise<void> {
	const { values, positionals } = parseArgs({
		allowPositionals: true,
		options: {
			endpoint: { type: 'string', short: 'e' },
			introspection: { type: 'string', short: 'i' },
			sdl: { type: 'string', short: 's' },
			output: { type: 'string', short: 'o' },
			include: { type: 'string' },
			exclude: { type: 'string' },
			names: { type: 'string' },
			'custom-scalars': { type: 'string' },
			'include-unmapped': { type: 'boolean', default: false },
			check: { type: 'boolean', default: false },
			help: { type: 'boolean', short: 'h' },
		},
	})

	const command = positionals[0]

	if (values.help || !command) {
		printHelp()
		process.exit(command ? 0 : 1)
	}

	if (command !== 'generate') {
		console.error(`Unknown command: ${command}`)
		console.error('Available commands: generate')
		process.exit(1)
	}

	// Determine source
	const sourceCount = [values.endpoint, values.introspection, values.sdl].filter(Boolean).length
	if (sourceCount !== 1) {
		console.error('Exactly one of --endpoint, --introspection, or --sdl must be provided')
		process.exit(1)
	}

	if (!values.output) {
		console.error('--output <dir> is required')
		process.exit(1)
	}

	const outputDir = resolve(values.output)

	// Build conversion options
	const options: GraphQLConversionOptions = {
		includeUnmappedMeta: values['include-unmapped'],
	}

	if (values.include) {
		options.include = values.include.split(',').map(s => s.trim())
	}

	if (values.exclude) {
		options.exclude = values.exclude.split(',').map(s => s.trim())
	}

	if (values.names) {
		const namesPath = resolve(values.names)
		options.doctypeNames = JSON.parse(readFileSync(namesPath, 'utf-8'))
	}

	options.onWarning = message => console.warn(`  WARN: ${message}`)

	if (values['custom-scalars']) {
		const scalarsPath = resolve(values['custom-scalars'])
		const scalarsContent = readFileSync(scalarsPath, 'utf-8')
		options.customScalars = JSON.parse(scalarsContent)
	}

	// Resolve source
	let source: IntrospectionQuery | string

	if (values.endpoint) {
		console.log(`Fetching introspection from ${values.endpoint}...`)
		source = await fetchIntrospection(values.endpoint)
	} else if (values.introspection) {
		const filePath = resolve(values.introspection)
		const content = readFileSync(filePath, 'utf-8')
		const parsed = JSON.parse(content)
		// Handle both { data: { __schema: ... } } and { __schema: ... } formats
		source = parsed.data ?? parsed
	} else {
		const filePath = resolve(values.sdl!)
		source = readFileSync(filePath, 'utf-8')
	}

	// Convert
	const doctypes = convertGraphQLSchema(source, options)

	if (doctypes.length === 0) {
		console.warn('No entity types found in the schema. Check your include/exclude filters.')
		process.exit(0)
	}

	// Write output
	if (!existsSync(outputDir)) {
		mkdirSync(outputDir, { recursive: true })
	}

	let warnings = 0
	let errors = 0
	let changed = 0
	const driftLines: string[] = []

	for (const generated of doctypes) {
		const fileName = `${generated.slug}.json`
		const filePath = join(outputDir, fileName)

		// When a doctype already exists it is the source of truth: generation confirms it and adds
		// provenance markers, and reports anything it disagrees with rather than applying it. A
		// doctype legitimately declares identity the schema cannot express — most often a natural
		// key that is a UNIQUE constraint, not the table's PRIMARY KEY — and overwriting that would
		// silently re-key the doctype on every run. A first generation has nothing to merge into,
		// so converter output is written verbatim.
		let output: object = generated
		if (existsSync(filePath)) {
			const { doctype: merged, drift } = mergeIntrospectedDoctype(
				JSON.parse(readFileSync(filePath, 'utf-8')),
				generated
			)
			output = merged
			driftLines.push(...formatDoctypeDrift(drift))
		}

		// Serialize the merged object directly. Never round-trip it through the Zod parser first:
		// that runs in strip mode and would silently drop every key this package does not model,
		// `handler` on an action being the one consumers actually rely on.
		const json = JSON.stringify(output, null, '\t') + '\n'
		const unchanged = existsSync(filePath) && readFileSync(filePath, 'utf-8') === json
		if (!unchanged) changed++

		if (!values.check && !unchanged) {
			writeFileSync(filePath, json, 'utf-8')
		}

		// Validate the output
		const validation = validateDoctype(output)
		if (!validation.success) {
			errors++
			console.error(`  ERROR: ${fileName} failed validation:`)
			for (const err of validation.errors) {
				console.error(`    ${err.path.join('.')}: ${err.message}`)
			}
		} else {
			// Check for unmapped fields
			const unmappedFields = generated.fields.filter((f: any) => f._unmapped)
			if (unmappedFields.length > 0) {
				warnings++
				console.warn(
					`  WARN: ${fileName} has ${unmappedFields.length} unmapped field(s): ${unmappedFields
						.map((f: any) => f.fieldname)
						.join(', ')}`
				)
			}
		}
	}

	if (driftLines.length > 0) {
		console.log('\nDrift between the authored doctypes and the schema (reported, not applied):')
		for (const line of driftLines) console.log(line)
	}

	console.log(
		`\n${values.check ? 'Checked' : 'Generated'} ${doctypes.length} doctype(s) in ${outputDir}` +
			(changed ? ` (${changed} ${values.check ? 'would change' : 'written'})` : ' (all up to date)') +
			(warnings ? ` (${warnings} with warnings)` : '') +
			(errors ? ` (${errors} with errors)` : '')
	)

	if (errors > 0 || (values.check && changed > 0)) {
		process.exit(1)
	}
}

function printHelp(): void {
	console.log(`
stonecrop-schema - Convert GraphQL schemas to Stonecrop doctypes

USAGE:
  stonecrop-schema generate [options]

SOURCE (exactly one required):
  --endpoint, -e <url>         Fetch introspection from a live GraphQL endpoint
  --introspection, -i <file>   Read from a saved introspection JSON file
  --sdl, -s <file>             Read from a GraphQL SDL (.graphql) file

OUTPUT:
  --output, -o <dir>           Directory to write doctype JSON files (required)

OPTIONS:
  --include <types>            Comma-separated list of type names to include
  --exclude <types>            Comma-separated list of type names to exclude
  --names <file>               JSON file mapping GraphQL type name to doctype name
  --custom-scalars <file>      JSON file mapping custom scalar names to field templates
  --include-unmapped           Include _graphqlType metadata on unmapped fields
  --check                      Report drift and exit non-zero if anything would change; write nothing
  --help, -h                   Show this help message

NOTE: an existing doctype file is the source of truth. Regeneration verifies it against the
schema and adds 'source: introspected' markers; it reports disagreements rather than
overwriting them, so hand-curation survives. Use --check in CI.

EXAMPLES:
  # From a live PostGraphile server
  stonecrop-schema generate -e http://localhost:5000/graphql -o ./schemas

  # From a saved introspection result
  stonecrop-schema generate -i introspection.json -o ./schemas

  # From an SDL file with custom scalars
  stonecrop-schema generate -s schema.graphql -o ./schemas \\
    --custom-scalars custom-scalars.json

  # Only convert specific types
  stonecrop-schema generate -e http://localhost:5000/graphql -o ./schemas \\
    --include "User,Post,Comment"
`)
}

main().catch(err => {
	console.error('Error:', err.message)
	process.exit(1)
})
