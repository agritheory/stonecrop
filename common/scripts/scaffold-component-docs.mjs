#!/usr/bin/env node
/**
 * Component Docs Scaffold Detector
 *
 * Finds Vue components that a package publicly exports but that have no page under
 * nuxt/documentation/content/components/, and scaffolds one — with the Props/Emits API
 * tables auto-extracted from the component's real `defineProps`/`defineEmits`/`defineModel`
 * calls (via the TypeScript compiler API), and TODO markers everywhere a human still has to
 * decide something: what the live demo looks like, what prose to write, what the honest
 * accessibility notes are. It does not write the demo or the prose — only structure and
 * whatever is mechanically true from the component's own source, which is the same split
 * this monorepo already draws between `rushx docs`-generated API reference pages (mechanical)
 * and the hand-authored component pages (judgment).
 *
 * Usage:
 *   node common/scripts/scaffold-component-docs.mjs            # dry run — report only
 *   node common/scripts/scaffold-component-docs.mjs --write     # actually create stub files
 */

import { createRequire } from 'node:module'
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '../..')
const WRITE = process.argv.includes('--write')
const ONLY = process.argv.find(a => a.startsWith('--only='))?.slice('--only='.length)

// Resolved from nuxt/'s own dependencies — this script has no package.json of its own, and
// pnpm's strict isolation means these aren't resolvable via plain `import` from common/scripts/.
const req = createRequire(join(rootDir, 'nuxt/package.json'))
const { parse: parseSFC } = req('vue/compiler-sfc')
const ts = req('typescript')

// Packages known to export public Vue components. Add a new package here once it has any —
// everything else is discovered automatically from its src/index.ts.
const PACKAGES = [
	{ folder: 'aform', name: '@stonecrop/aform' },
	{ folder: 'atable', name: '@stonecrop/atable' },
	{ folder: 'beam', name: '@stonecrop/beam' },
	{ folder: 'desktop', name: '@stonecrop/desktop' },
	{ folder: 'code_editor', name: '@stonecrop/code-editor' },
	{ folder: 'node_editor', name: '@stonecrop/node-editor' },
]

const contentComponentsDir = join(rootDir, 'nuxt/documentation/content/components')
const appComponentsDir = join(rootDir, 'nuxt/documentation/app/components')

// ---------------------------------------------------------------------------
// Step 1: find every component a package's src/index.ts genuinely re-exports (not just
// imports internally) — same distinction already drawn by hand for e.g. CollapseButton,
// which is imported by AFieldset but never appears in aform's own `export { ... }`.
// ---------------------------------------------------------------------------
function getPublicVueComponents(pkg) {
	const indexPath = join(rootDir, pkg.folder, 'src/index.ts')
	if (!existsSync(indexPath)) return []
	const source = readFileSync(indexPath, 'utf8')

	const importedFromVue = new Map() // name -> relative .vue path (relative to src/)
	for (const m of source.matchAll(/import\s+(\w+)\s+from\s+['"](\.[^'"]+\.vue)['"]/g)) {
		importedFromVue.set(m[1], m[2])
	}

	const exported = new Set()
	// `export type { ... }` blocks share the same brace shape — excluded by requiring no
	// `type` keyword between `export` and `{`.
	for (const m of source.matchAll(/export\s*\{([^}]+)\}/g)) {
		for (const raw of m[1].split(',')) {
			const name = raw.trim().split(/\s+as\s+/)[0].trim()
			if (name) exported.add(name)
		}
	}

	const components = []
	for (const [name, vuePath] of importedFromVue) {
		if (exported.has(name)) {
			components.push({ name, pkg, vueFile: join(rootDir, pkg.folder, 'src', vuePath) })
		}
	}
	return components
}

// ---------------------------------------------------------------------------
// Step 2: collect every component name already documented anywhere under content/components/,
// by scanning each page's real `## Import` code fence rather than assuming a 1:1
// filename-to-component mapping (several pages document more than one component, e.g.
// table-loading.md covers both ATableLoading and ATableLoadingBar).
// ---------------------------------------------------------------------------
function getDocumentedComponentNames() {
	const documented = new Set()
	if (!existsSync(contentComponentsDir)) return documented

	for (const file of readdirSync(contentComponentsDir)) {
		if (!file.endsWith('.md')) continue
		const content = readFileSync(join(contentComponentsDir, file), 'utf8')
		for (const m of content.matchAll(/import\s+(type\s+)?\{([^}]+)\}\s*from\s*['"]@stonecrop\/[\w-]+['"]/g)) {
			if (m[1]) continue // `import type { ... }` — a type, not a component
			for (const raw of m[2].split(',')) {
				const name = raw.trim().split(/\s+as\s+/)[0].trim()
				if (name) documented.add(name)
			}
		}
	}
	return documented
}

// ---------------------------------------------------------------------------
// Step 3: extract props/emits from a component's actual `<script setup>` via the TS AST —
// no cross-file type resolution (a prop typed `config?: TableConfig` is reported with type
// text `TableConfig` as-is, exactly what a human would also write by hand).
// ---------------------------------------------------------------------------
function leadingComment(sourceFile, node) {
	const ranges = ts.getLeadingCommentRanges(sourceFile.text, node.getFullStart())
	if (!ranges || ranges.length === 0) return ''
	const text = sourceFile.text.slice(ranges[ranges.length - 1].pos, ranges[ranges.length - 1].end)
	const stripped = text
		.replace(/^\/\*\*?/, '')
		.replace(/\*\/$/, '')
		.replace(/^\/\//, '')
		.replace(/^\s*\*\s?/gm, '')
		.trim()
	return stripped
		.split('\n')
		.map(l => l.trim())
		.filter(l => l && !l.startsWith('@'))
		.join(' ')
		.trim()
}

function propertyName(member, sourceFile) {
	if (ts.isStringLiteral(member.name)) return member.name.text
	return member.name.getText(sourceFile)
}

function extractTypeLiteralMembers(typeLiteral, sourceFile) {
	const members = []
	for (const member of typeLiteral.members) {
		if (!ts.isPropertySignature(member)) continue
		members.push({
			name: propertyName(member, sourceFile),
			optional: !!member.questionToken,
			type: member.type ? member.type.getText(sourceFile) : 'unknown',
			description: leadingComment(sourceFile, member),
		})
	}
	return members
}

// Handles `defineProps<{...}>()` directly, and `defineProps<Partial<X> & {...}>()` —a real,
// recurring pattern in this codebase (e.g. ABadge) — by extracting the inline literal's members
// and adding one note-row per non-literal piece (e.g. `Partial<BadgeDescriptor>`) rather than
// silently dropping it. Returns null (not []) when nothing at all is extractable, so callers can
// tell "genuinely no props" apart from "couldn't parse this type shape".
function extractPropsFromTypeNode(typeArg, sourceFile) {
	if (!typeArg) return null
	if (ts.isTypeLiteralNode(typeArg)) return extractTypeLiteralMembers(typeArg, sourceFile)

	if (ts.isIntersectionTypeNode(typeArg)) {
		const members = []
		let sawAnything = false
		for (const part of typeArg.types) {
			if (ts.isTypeLiteralNode(part)) {
				members.push(...extractTypeLiteralMembers(part, sourceFile))
				sawAnything = true
			} else {
				members.push({
					name: '—',
					optional: false,
					type: part.getText(sourceFile),
					description: 'Every field declared by this type (see its own definition).',
				})
				sawAnything = true
			}
		}
		return sawAnything ? members : null
	}

	return null
}

function findCalls(sourceFile, calleeName) {
	const results = []
	const visit = node => {
		if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === calleeName) {
			results.push(node)
		}
		ts.forEachChild(node, visit)
	}
	visit(sourceFile)
	return results
}

function findObjectLiteralDefaults(objectLiteral, sourceFile) {
	const defaults = new Map()
	if (!objectLiteral || !ts.isObjectLiteralExpression(objectLiteral)) return defaults
	for (const prop of objectLiteral.properties) {
		if (ts.isPropertyAssignment(prop)) {
			defaults.set(propertyName(prop, sourceFile), prop.initializer.getText(sourceFile))
		}
	}
	return defaults
}

function findDestructuredDefaults(sourceFile, definePropsCall) {
	const defaults = new Map()
	// Walk up to the enclosing VariableDeclaration, e.g.
	// `const { a, b = 1 } = defineProps<{...}>()` or `const { a } = withDefaults(defineProps...(), {...})`
	let node = definePropsCall.parent
	while (node && !ts.isVariableDeclaration(node)) node = node.parent
	if (!node || !ts.isObjectBindingPattern(node.name)) return defaults
	for (const el of node.name.elements) {
		if (ts.isBindingElement(el) && el.initializer) {
			const name = ts.isIdentifier(el.propertyName ?? el.name) ? (el.propertyName ?? el.name).text : null
			if (name) defaults.set(name, el.initializer.getText(sourceFile))
		}
	}
	return defaults
}

function extractComponentApi(vueFile) {
	const source = readFileSync(vueFile, 'utf8')
	const { descriptor } = parseSFC(source, { filename: vueFile })
	const scriptSetup = descriptor.scriptSetup
	if (!scriptSetup) return { props: null, emits: null, models: [], parsed: false }

	const sourceFile = ts.createSourceFile(vueFile, scriptSetup.content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

	let props = null
	const definePropsCalls = findCalls(sourceFile, 'defineProps')
	if (definePropsCalls.length > 0) {
		const call = definePropsCalls[0]
		const typeArg = call.typeArguments?.[0]
		props = extractPropsFromTypeNode(typeArg, sourceFile)

		if (props) {
			// Defaults from withDefaults(defineProps<...>(), {...}) ...
			let defaults = new Map()
			if (call.parent && ts.isCallExpression(call.parent) && ts.isIdentifier(call.parent.expression)) {
				if (call.parent.expression.text === 'withDefaults') {
					defaults = findObjectLiteralDefaults(call.parent.arguments[1], sourceFile)
				}
			}
			// ...or from destructuring: const { x = 1 } = defineProps...()
			if (defaults.size === 0) defaults = findDestructuredDefaults(sourceFile, call)

			for (const p of props) {
				if (defaults.has(p.name)) p.default = defaults.get(p.name)
			}
		}
	}

	let emits = null
	const defineEmitsCalls = findCalls(sourceFile, 'defineEmits')
	if (defineEmitsCalls.length > 0) {
		emits = extractPropsFromTypeNode(defineEmitsCalls[0].typeArguments?.[0], sourceFile)
	}

	const models = []
	for (const call of findCalls(sourceFile, 'defineModel')) {
		const typeArg = call.typeArguments?.[0]
		const firstArg = call.arguments[0]
		const name = firstArg && ts.isStringLiteral(firstArg) ? firstArg.text : null
		const optionsArg = name ? call.arguments[1] : firstArg
		const options = findObjectLiteralDefaults(optionsArg, sourceFile)
		models.push({
			name,
			type: typeArg ? typeArg.getText(sourceFile) : 'unknown',
			required: options.get('required') === 'true',
			default: options.get('default'),
		})
	}

	return { props, emits, models, parsed: true }
}

// ---------------------------------------------------------------------------
// Step 4: render the scaffold files.
// ---------------------------------------------------------------------------
function yamlStr(value) {
	return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function code(text) {
	return `\`${text}\``
}

function buildApiTableBlock(headers, rows) {
	if (rows.length === 0) return null
	const headerLine = `headers: [${headers.map(yamlStr).join(', ')}]`
	const rowLines = rows.map(row => `  - [${row.map(yamlStr).join(', ')}]`).join('\n')
	return `::api-data-table\n---\n${headerLine}\nrows:\n${rowLines}\n---\n::`
}

function kebabCase(name) {
	return name
		.replace(/^A(?=[A-Z])/, '') // drop the aform/atable "A" prefix convention (ACheckbox -> Checkbox)
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.toLowerCase()
}

function buildMarkdownStub({ name, pkg, vueFile, api }) {
	const kebab = kebabCase(name)
	const relPath = relative(rootDir, vueFile)

	let propsBlock = '<!-- TODO: could not auto-extract props (no `defineProps<{...}>()` with an inline type literal found) -->'
	if (api.props) {
		const rows = api.props.map(p => [
			code(p.name + (p.optional ? '?' : '')),
			code(p.type),
			p.default !== undefined ? code(p.default) : '—',
			p.description || 'TODO: describe this prop',
		])
		propsBlock = buildApiTableBlock(['Name', 'Type', 'Default', 'Description'], rows) ?? '_No props._'
	}

	let modelsSection = ''
	if (api.models.length > 0) {
		const rows = api.models.map(m => [
			code(m.name ? `v-model:${m.name}` : 'v-model'),
			code(m.type),
			m.default !== undefined ? code(m.default) : '—',
			m.required ? 'Required.' : 'TODO: describe this model',
		])
		modelsSection = `\n### v-model\n\n${buildApiTableBlock(['Name', 'Type', 'Default', 'Description'], rows)}\n`
	}

	let emitsSection = ''
	if (api.emits && api.emits.length > 0) {
		const rows = api.emits.map(e => [code(e.name), code(e.type), e.description || 'TODO: describe this event'])
		emitsSection = `\n### Emits\n\n${buildApiTableBlock(['Name', 'Payload', 'Description'], rows)}\n`
	}

	return `---
title: ${name}
description: TODO — one-line description
---

# ${name}

<!-- TODO: describe what this component does and when to use it -->

## Import

\`\`\`ts
import { ${name} } from '${pkg.name}'
\`\`\`

## Basic

<!-- TODO: write a demo component at app/components/${name}Demo.vue showing typical usage,
     then reference it here following the established pattern, e.g.:

::demo-panel
:::client-only
:${kebab}-demo
:::

#code
\`\`\`vue
(paste the finished demo component's source here)
\`\`\`
::
-->

## API Reference

### Props

${propsBlock}
${modelsSection}${emitsSection}
## Accessibility

<!-- TODO: read ${relPath} for aria-*/role attributes and describe honestly what's present or missing — don't assume. -->

Source: [\`${relPath}\`](https://github.com/agritheory/stonecrop/blob/development/${relPath})
`
}

function buildDemoStub({ name, pkg }) {
	return `<script setup lang="ts">
// TODO: replace with a real, working demo using realistic sample data
import { ${name} } from '${pkg.name}'
</script>

<template>
	<div class="stonecrop-demo">
		<!-- TODO: render ${name} -->
	</div>
</template>
`
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const documented = getDocumentedComponentNames()
const missing = []

for (const pkg of PACKAGES) {
	for (const component of getPublicVueComponents(pkg)) {
		if (ONLY && component.name !== ONLY) continue
		if (!documented.has(component.name)) missing.push(component)
	}
}

if (missing.length === 0) {
	console.log('✅ Every publicly exported component already has a docs page. Nothing to scaffold.')
	process.exit(0)
}

console.log(`Found ${missing.length} exported component(s) with no docs page:\n`)

for (const component of missing) {
	const { name, pkg, vueFile } = component
	const kebab = kebabCase(name)
	const mdPath = join(contentComponentsDir, `${kebab}.md`)
	const demoPath = join(appComponentsDir, `${name}Demo.vue`)

	console.log(`  ${pkg.name} → ${name}  (${relative(rootDir, vueFile)})`)
	console.log(`    would create: ${relative(rootDir, mdPath)}`)
	console.log(`    would create: ${relative(rootDir, demoPath)}`)

	if (!WRITE) continue

	if (existsSync(mdPath) || existsSync(demoPath)) {
		console.log('    ⏭️  skipped — a file already exists at one of those paths')
		continue
	}

	const api = extractComponentApi(vueFile)
	if (!api.parsed) console.log('    ⚠️  no <script setup> block found — scaffolding a bare stub')

	mkdirSync(contentComponentsDir, { recursive: true })
	mkdirSync(appComponentsDir, { recursive: true })
	writeFileSync(mdPath, buildMarkdownStub({ ...component, api }))
	writeFileSync(demoPath, buildDemoStub(component))
	console.log('    ✅ scaffolded')
}

console.log(
	WRITE
		? '\nDone. Every scaffolded page still needs, by hand: a real demo, prose, honest accessibility notes,\n' +
				'a sidebar entry in nuxt/documentation/app/layouts/default.vue, and a search-index.ts entry.'
		: '\nDry run — no files written. Re-run with --write to create the stubs above.'
)
