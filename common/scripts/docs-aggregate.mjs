#!/usr/bin/env node

/**
 * API Documentation Aggregation Script
 *
 * Copies api.md files from package directories to docs/reference/
 * and adds VitePress frontmatter for proper rendering.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = join(__dirname, '../..')
const referenceDir = join(rootDir, 'docs/reference')

// Package configurations
const packages = [
	{ folder: 'aform', name: 'aform', title: 'AForm', description: 'Schema-driven form components' },
	{ folder: 'atable', name: 'atable', title: 'ATable', description: 'Advanced table with tree and Gantt views' },
	{ folder: 'beam', name: 'beam', title: 'Beam', description: 'Mobile-first scanning and MQTT' },
	{ folder: 'desktop', name: 'desktop', title: 'Desktop', description: 'Desktop navigation and command palette' },
	{
		folder: 'stonecrop',
		name: 'stonecrop',
		title: 'Stonecrop',
		description: 'Core orchestration with Registry, HST, and composables',
	},
	{ folder: 'schema', name: 'schema', title: 'Schema', description: 'Doctype schema definitions and validation' },
	{
		folder: 'graphql_client',
		name: 'graphql-client',
		title: 'GraphQL Client',
		description: 'GraphQL client utilities',
	},
	{
		folder: 'graphql_middleware',
		name: 'graphql-middleware',
		title: 'GraphQL Middleware',
		description: 'PostGraphile middleware for Stonecrop',
	},
	{
		folder: 'casl_middleware',
		name: 'casl-middleware',
		title: 'CASL Middleware',
		description: 'CASL authorization for GraphQL',
	},
	{ folder: 'rockfoil', name: 'rockfoil', title: 'Rockfoil', description: 'Server-side utilities' },
	{ folder: 'node_editor', name: 'node-editor', title: 'Node Editor', description: 'Visual FSM workflow editor' },
	{ folder: 'code_editor', name: 'code-editor', title: 'Code Editor', description: 'Monaco-based code editor' },
	{ folder: 'utilities', name: 'utilities', title: 'Utilities', description: 'Shared utility functions' },
	{ folder: 'nuxt', name: 'nuxt', title: 'Nuxt', description: 'Nuxt module for Stonecrop integration' },
	{
		folder: 'nuxt_grafserv',
		name: 'nuxt-grafserv',
		title: 'Nuxt Grafserv',
		description: 'Pluggable Grafserv GraphQL server as Nuxt Module',
	},
]

// Ensure reference directory exists
if (!existsSync(referenceDir)) {
	mkdirSync(referenceDir, { recursive: true })
}

console.log('📚 Aggregating API documentation...\n')

let processed = 0
let skipped = 0

for (const pkg of packages) {
	const sourcePath = join(rootDir, pkg.folder, 'api.md')
	const destPath = join(referenceDir, `${pkg.name}.md`)

	if (!existsSync(sourcePath)) {
		console.log(`⏭️  ${pkg.title}: No api.md found, creating placeholder`)

		// Create a placeholder for packages without API docs yet
		const placeholder = `---
title: ${pkg.title} API Reference
description: ${pkg.description}
---

# ${pkg.title} API Reference

> API documentation for \`@stonecrop/${pkg.name}\` is not yet available.

This package may not export public APIs, or documentation hasn't been generated yet.

## Package Information

- **Package**: \`@stonecrop/${pkg.name}\`
- **Source**: [GitHub](https://github.com/agritheory/stonecrop/tree/development/${pkg.folder})

To generate API documentation, ensure the package has been built:

\`\`\`bash
cd ${pkg.folder}
node --run build
\`\`\`
`

		writeFileSync(destPath, placeholder, 'utf8')
		skipped++
		continue
	}

	try {
		// Read the source API markdown
		let content = readFileSync(sourcePath, 'utf8')

		// Add VitePress frontmatter if not already present
		if (!content.startsWith('---')) {
			const frontmatter = `---
title: ${pkg.title} API Reference
description: ${pkg.description}
---

`
			content = frontmatter + content
		}

		// Write to reference directory
		writeFileSync(destPath, content, 'utf8')
		console.log(`✅ ${pkg.title}: Copied to docs/reference/${pkg.name}.md`)
		processed++
	} catch (error) {
		console.error(`❌ Error processing ${pkg.title}:`, error.message)
		skipped++
	}
}

console.log(`\n📊 Summary:`)
console.log(`   ✅ Processed: ${processed}`)
console.log(`   ⏭️  Skipped: ${skipped}`)
console.log(`   📁 Total: ${packages.length}`)
console.log(`\n✨ API documentation aggregation complete!`)
