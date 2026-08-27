#!/usr/bin/env node

'use strict'

/**
 * Component surface extraction for the packages that export Vue SFCs.
 *
 * API Extractor reads `.d.ts` files, and a component's declaration is a single `DefineComponent<…>`
 * alias — so the doc model carries the name and nothing else. Props, emits, slots and exposes are
 * invisible to it. `vue-component-meta` is the Vue language tooling's own answer to that question,
 * and it is what the docs and the component API report are generated from.
 */

const { existsSync, readFileSync } = require('fs')
const { dirname, join, relative, resolve } = require('path')
const ts = require('typescript')

/**
 * Resolve every component the entry point re-exports, as `exportedName -> absolute .vue path`.
 *
 * The binding between a name and a file is something the author writes (`import ABadge from
 * './components/form/ABadge.vue'`), so it is read back off the emitted entry declaration rather than
 * guessed from the filename — a component whose export name differs from its file, or which is
 * defined but deliberately not exported, both come out right.
 */
function resolveExportedComponents(packageDir) {
	const entryDeclaration = join(packageDir, 'dist/src/index.d.ts')
	if (!existsSync(entryDeclaration)) return new Map()

	const source = ts.createSourceFile(
		entryDeclaration,
		readFileSync(entryDeclaration, 'utf8'),
		ts.ScriptTarget.Latest,
		/* setParentNodes */ false
	)

	// `./components/ABadge.vue` is relative to dist/src/, and the SFC it names lives at the matching
	// path under src/. Nothing emits a .vue file into dist, so the declaration's own folder is not
	// where the source is.
	const sourceRoot = join(packageDir, 'src')
	const localToFile = new Map()
	const exported = new Set()

	for (const statement of source.statements) {
		if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
			const specifier = statement.moduleSpecifier.text
			const defaultImport = statement.importClause?.name
			if (!defaultImport || !specifier.endsWith('.vue')) continue
			localToFile.set(defaultImport.text, resolve(sourceRoot, specifier))
			continue
		}

		if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
			// A re-export (`export { x } from './y'`) names a module, so it cannot be a local .vue
			// import; only a bare `export { … }` can be.
			if (statement.moduleSpecifier) continue
			for (const element of statement.exportClause.elements) {
				if (statement.isTypeOnly || element.isTypeOnly) continue
				exported.add({ exportedAs: element.name.text, local: (element.propertyName ?? element.name).text })
			}
		}
	}

	const components = new Map()
	for (const { exportedAs, local } of exported) {
		const file = localToFile.get(local)
		if (file && existsSync(file)) components.set(exportedAs, file)
	}
	return components
}

/**
 * Every name the entry point exports, as `name -> module it came from`.
 *
 * The doc model only carries what a package *declares*; a name it re-exports from a sibling reaches
 * consumers just the same but has no member to render. The old generator caught a few of these by
 * accident, by matching `export { Name }` in the report — which is why `ActionEventPayload` and
 * `InteractionMode` were documented as Vue components. Listing them explicitly means a re-export
 * cannot silently drop out of the docs.
 *
 * A relative `export * from './x'` is followed into the module it names, because that is how a name
 * declared in `src/types/` reaches the entry point. A bare-specifier star (`export type * from
 * '@stonecrop/atable/types'`) is not: it names another package, which documents those exports
 * itself, and enumerating them here would restate a definition that lives elsewhere.
 */
function resolveExportedNames(packageDir) {
	const exported = new Map()
	const visited = new Set()

	const readDeclaration = specifier => {
		for (const candidate of [`${specifier}.d.ts`, join(specifier, 'index.d.ts')]) {
			if (existsSync(candidate)) return candidate
		}
		return null
	}

	const walk = declarationPath => {
		if (visited.has(declarationPath)) return
		visited.add(declarationPath)

		const source = ts.createSourceFile(
			declarationPath,
			readFileSync(declarationPath, 'utf8'),
			ts.ScriptTarget.Latest,
			/* setParentNodes */ false
		)
		const declarationDir = dirname(declarationPath)
		const localToModule = new Map()

		for (const statement of source.statements) {
			if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue
			const specifier = statement.moduleSpecifier.text
			if (statement.importClause?.name) localToModule.set(statement.importClause.name.text, specifier)
			const bindings = statement.importClause?.namedBindings
			if (bindings && ts.isNamedImports(bindings)) {
				for (const element of bindings.elements) localToModule.set(element.name.text, specifier)
			}
		}

		for (const statement of source.statements) {
			if (!ts.isExportDeclaration(statement)) continue
			const specifier =
				statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)
					? statement.moduleSpecifier.text
					: null

			if (!statement.exportClause) {
				if (!specifier || !specifier.startsWith('.')) continue
				const target = readDeclaration(resolve(declarationDir, specifier))
				if (target) walk(target)
				continue
			}

			if (!ts.isNamedExports(statement.exportClause)) continue
			for (const element of statement.exportClause.elements) {
				const local = (element.propertyName ?? element.name).text
				exported.set(element.name.text, specifier ?? localToModule.get(local) ?? null)
			}
		}
	}

	const entryDeclaration = join(packageDir, 'dist/src/index.d.ts')
	if (existsSync(entryDeclaration)) walk(entryDeclaration)
	return exported
}

function normalizeCell(text) {
	if (text === undefined || text === null) return ''
	return String(text).replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim()
}

/**
 * `global: true` marks the props every Vue component accepts (`class`, `style`, every DOM event
 * handler). Including them would bury the component's own surface under several hundred rows.
 */
function ownProps(props) {
	return props
		.filter(prop => !prop.global)
		.map(prop => ({
			name: prop.name,
			type: prop.type,
			required: prop.required === true,
			default: prop.default,
			description: prop.description || '',
		}))
}

/**
 * Extract the public component surface for a package.
 *
 * Returns `[]` for a package that exports no SFC, which is what makes this safe to call for all 16 —
 * the caller does not need its own list of which packages are component libraries.
 */
function collectComponents(packageDir) {
	const exportedComponents = resolveExportedComponents(packageDir)
	if (exportedComponents.size === 0) return []

	const tsconfig = join(packageDir, 'tsconfig.json')
	if (!existsSync(tsconfig)) return []

	// Required, or vue-component-meta resolves the type of a prop declared in TypeScript to `any`.
	const { createChecker } = require('vue-component-meta')
	const checker = createChecker(tsconfig, { forceUseTs: true, printer: { newLine: 1 } })

	const components = []
	for (const [name, file] of exportedComponents) {
		let meta
		try {
			meta = checker.getComponentMeta(file)
		} catch (error) {
			// One unreadable component must not drop the other twenty-three from the report.
			console.warn(`⚠️  ${name}: component metadata unavailable (${error.message})`)
			continue
		}

		components.push({
			name,
			file: relative(packageDir, file),
			description: meta.description || '',
			props: ownProps(meta.props),
			events: meta.events.map(event => ({
				name: event.name,
				type: event.type,
				description: event.description || '',
			})),
			slots: meta.slots.map(slot => ({
				name: slot.name,
				type: slot.type,
				description: slot.description || '',
			})),
			exposed: meta.exposed.map(item => ({ name: item.name, type: item.type })),
		})
	}

	components.sort((a, b) => a.name.localeCompare(b.name))
	return components
}

/**
 * Render the component surface as the tables that go into `<package>/api.md`.
 */
function renderComponentDocs(components, packageName) {
	let markdown = '## Vue Components\n\n'

	for (const component of components) {
		markdown += `### ${component.name}\n\n`
		markdown += component.description
			? `${component.description}\n\n`
			: `Vue component exported from @stonecrop/${packageName}.\n\n`
		markdown += '```typescript\n'
		markdown += `import { ${component.name} } from '@stonecrop/${packageName}'\n`
		markdown += '```\n\n'

		if (component.props.length > 0) {
			markdown += '**Props:**\n\n'
			markdown += '| Prop | Type | Required | Default | Description |\n'
			markdown += '|------|------|----------|---------|-------------|\n'
			for (const prop of component.props) {
				const fallback = prop.default === undefined ? '' : `\`${normalizeCell(prop.default)}\``
				markdown += `| ${prop.name} | \`${normalizeCell(prop.type)}\` | ${prop.required ? 'yes' : 'no'} | ${fallback} | ${normalizeCell(prop.description)} |\n`
			}
			markdown += '\n'
		}

		if (component.events.length > 0) {
			markdown += '**Events:**\n\n'
			markdown += '| Event | Payload | Description |\n'
			markdown += '|-------|---------|-------------|\n'
			for (const event of component.events) {
				markdown += `| ${event.name} | \`${normalizeCell(event.type)}\` | ${normalizeCell(event.description)} |\n`
			}
			markdown += '\n'
		}

		if (component.slots.length > 0) {
			markdown += '**Slots:**\n\n'
			markdown += '| Slot | Props | Description |\n'
			markdown += '|------|-------|-------------|\n'
			for (const slot of component.slots) {
				markdown += `| ${slot.name} | \`${normalizeCell(slot.type)}\` | ${normalizeCell(slot.description)} |\n`
			}
			markdown += '\n'
		}

		if (component.exposed.length > 0) {
			markdown += '**Exposed:**\n\n'
			markdown += '| Name | Type |\n'
			markdown += '|------|------|\n'
			for (const item of component.exposed) {
				markdown += `| ${item.name} | \`${normalizeCell(item.type)}\` |\n`
			}
			markdown += '\n'
		}
	}

	return markdown
}

/**
 * Render the component surface as a review report, alongside the one API Extractor writes.
 *
 * Tracked in git and covered by the same `git diff --exit-code` gate, so a changed prop type or a
 * removed emit shows up as a diff on the pull request that causes it — which is the one thing the
 * API Extractor report could never do for a component.
 */
function renderComponentReport(components, packageName) {
	let markdown = `## Component API Report for "@stonecrop/${packageName}"\n\n`
	markdown += '> Do not edit this file. It is generated from the components by vue-component-meta.\n\n'

	for (const component of components) {
		markdown += `### ${component.name}\n\n`
		markdown += '```ts\n'
		markdown += `// ${component.file}\n`

		markdown += component.props.length > 0 ? 'props: {\n' : 'props: {}\n'
		for (const prop of component.props) {
			markdown += `  ${prop.name}${prop.required ? '' : '?'}: ${normalizeCell(prop.type)}\n`
		}
		if (component.props.length > 0) markdown += '}\n'

		markdown += component.events.length > 0 ? 'emits: {\n' : 'emits: {}\n'
		for (const event of component.events) {
			markdown += `  ${event.name}: ${normalizeCell(event.type)}\n`
		}
		if (component.events.length > 0) markdown += '}\n'

		markdown += component.slots.length > 0 ? 'slots: {\n' : 'slots: {}\n'
		for (const slot of component.slots) {
			markdown += `  ${slot.name}: ${normalizeCell(slot.type)}\n`
		}
		if (component.slots.length > 0) markdown += '}\n'

		if (component.exposed.length > 0) {
			markdown += 'exposed: {\n'
			for (const item of component.exposed) {
				markdown += `  ${item.name}: ${normalizeCell(item.type)}\n`
			}
			markdown += '}\n'
		}

		markdown += '```\n\n'
	}

	return markdown
}

/**
 * Render the exports that reach consumers through this package but are declared in another.
 */
function renderReExports(reExports) {
	let markdown = '## Re-exported\n\n'
	markdown += 'Declared elsewhere and re-exported by this package.\n\n'
	markdown += '| Name | From |\n'
	markdown += '|------|------|\n'
	for (const { name, from } of reExports) {
		markdown += `| ${name} | ${from ? `\`${normalizeCell(from)}\`` : ''} |\n`
	}
	return markdown + '\n'
}

module.exports = {
	collectComponents,
	renderComponentDocs,
	renderComponentReport,
	renderReExports,
	resolveExportedNames,
}
