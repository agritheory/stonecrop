#!/usr/bin/env node

/**
 * API Documentation Aggregation Script
 *
 * Copies api.md files from package directories to nuxt/documentation/content/reference/
 * and adds frontmatter (title/description) for proper rendering by @nuxt/content.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import { docPackages } from './doc-packages.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = join(__dirname, '../..')
const referenceDir = join(rootDir, 'nuxt/documentation/content/reference')

const packages = docPackages

// Ensure reference directory exists
if (!existsSync(referenceDir)) {
	mkdirSync(referenceDir, { recursive: true })
}

let processed = 0
const placeholders = []
const failures = []

for (const pkg of packages) {
	const sourcePath = join(rootDir, pkg.folder, 'api.md')
	const destPath = join(referenceDir, `${pkg.name}.md`)

	if (!existsSync(sourcePath)) {
		placeholders.push(pkg.title)

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
pnpm exec vp run build
\`\`\`
`

		writeFileSync(destPath, placeholder, 'utf8')
		continue
	}

	try {
		// Read the source API markdown
		let content = readFileSync(sourcePath, 'utf8')

		// Add frontmatter if not already present
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
		processed++
	} catch (error) {
		failures.push(`${pkg.title}: ${error.message}`)
	}
}

// A failure used to be counted alongside the placeholders and exit 0, which left the previous
// run's file in place for the drift gate to compare against and find unchanged.
if (failures.length > 0) {
	for (const failure of failures) {
		console.error(`aggregate failed for ${failure}`)
	}
	process.exit(1)
}

const placeholderNote = placeholders.length > 0 ? `, placeholders for ${placeholders.join(', ')}` : ''
console.log(`Aggregated ${processed} api.md into content/reference${placeholderNote}`)
