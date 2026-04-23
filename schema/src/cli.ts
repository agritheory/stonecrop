#!/usr/bin/env node
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

import { convertGraphQLSchema } from './converter/index'
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

	const json = (await response.json()) as {
		data?: IntrospectionQuery
		errors?: Array<{ message: string }>
	}

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
			overrides: { type: 'string' },
			'custom-scalars': { type: 'string' },
			'include-unmapped': { type: 'boolean', default: false },
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

	if (values.overrides) {
		const overridesPath = resolve(values.overrides)
		const overridesContent = readFileSync(overridesPath, 'utf-8')
		options.typeOverrides = JSON.parse(overridesContent)
	}

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

	for (const doctype of doctypes) {
		const fileName = `${doctype.slug}.json`
		const filePath = join(outputDir, fileName)
		const json = JSON.stringify(doctype, null, '\t')

		writeFileSync(filePath, json + '\n', 'utf-8')

		// Validate the output
		const validation = validateDoctype(doctype)
		if (!validation.success) {
			errors++
			console.error(`  ERROR: ${fileName} failed validation:`)
			for (const err of validation.errors) {
				console.error(`    ${err.path.join('.')}: ${err.message}`)
			}
		} else {
			// Check for unmapped fields
			const unmappedFields = doctype.fields.filter((f: any) => f._unmapped)
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

	console.log(
		`\nGenerated ${doctypes.length} doctype(s) in ${outputDir}` +
			(warnings ? ` (${warnings} with warnings)` : '') +
			(errors ? ` (${errors} with errors)` : '')
	)

	if (errors > 0) {
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
  --overrides <file>           JSON file with per-type field overrides
  --custom-scalars <file>      JSON file mapping custom scalar names to field templates
  --include-unmapped           Include _graphqlType metadata on unmapped fields
  --help, -h                   Show this help message

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
