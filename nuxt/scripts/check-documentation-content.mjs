#!/usr/bin/env node
//
// Fails when a component's YAML props on a documentation page do not parse.
//
// remark-mdc reads a component's `---` block with `yaml`'s parseDocument and keeps whatever
// toJSON() returns, discarding the document's errors. A table row quoted wrongly therefore builds
// clean, renders the component with only the props that parsed, and surfaces only when `nuxi
// generate` prerenders the page: a 500 that names the route but not the file or line, and only in
// docs.yml, which runs after merge.
//
// The blocks are found by remark-mdc's own tokenizer and parsed by the `yaml` remark-mdc depends
// on, both resolved through @nuxt/content as documentation/nuxt.config.ts resolves them, so this
// reads what the site reads. It needs an install and nothing built.

import { readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const packageDir = fileURLToPath(new URL('..', import.meta.url))
const repoRoot = join(packageDir, '..')
const contentDir = join(packageDir, 'documentation', 'content')

const contentRequire = createRequire(createRequire(import.meta.url).resolve('@nuxt/content'))
const mdcRequire = createRequire(contentRequire.resolve('@nuxtjs/mdc'))
const remarkMdcPath = mdcRequire.resolve('remark-mdc')
const load = path => import(pathToFileURL(path).href)
const [{ unified }, { default: remarkParse }, { default: remarkMdc }, { visit }, { LineCounter, parseDocument }] =
	await Promise.all([
		load(mdcRequire.resolve('unified')),
		load(mdcRequire.resolve('remark-parse')),
		load(remarkMdcPath),
		load(mdcRequire.resolve('unist-util-visit')),
		load(createRequire(remarkMdcPath).resolve('yaml')),
	])

const processor = unified().use(remarkParse).use(remarkMdc)
const pages = readdirSync(contentDir, { recursive: true })
	.filter(path => path.endsWith('.md'))
	.sort()

const problems = []
let blocks = 0
for (const page of pages) {
	const file = relative(repoRoot, join(contentDir, page))
	const tree = processor.parse(readFileSync(join(contentDir, page), 'utf8'))
	// The node types and the test remark-mdc's own transformer applies before reading a block.
	visit(tree, ['textComponent', 'leafComponent', 'containerComponent'], node => {
		if (!node.rawData) return
		blocks++
		const lineCounter = new LineCounter()
		// What getNodeData hands the parser: the raw block, less the closing `---`.
		const document = parseDocument(node.rawData.replace(/\s-+$/, ''), { lineCounter, prettyErrors: false })
		for (const error of document.errors) {
			// The block opens on the line after the component's own, so its line n is that line plus n.
			const { line, col } = lineCounter.linePos(error.pos[0])
			const at = node.position.start.line + line
			problems.push({ file, line: at, col, message: `${node.name}: ${error.message}` })
		}
	})
}

// A tokenizer that stopped recognising components would find no block and pass every page.
if (blocks === 0) throw new Error(`found no component YAML in the ${pages.length} pages under ${contentDir}`)

if (problems.length === 0) {
	console.log(`All ${blocks} component YAML blocks across ${pages.length} documentation pages parse.`)
	process.exit(0)
}

for (const { file, line, col, message } of problems) {
	console.error(`::error file=${file},line=${line},col=${col}::${file}:${line}:${col} ${message}`)
}
console.error(
	`\n${problems.length} to fix. remark-mdc renders these with whatever parsed, so the page fails only once ` +
		`prerendered. A single-quoted cell ends at its first apostrophe: quote such a cell with double quotes.`
)
process.exit(1)
