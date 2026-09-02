import { existsSync, readFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'

/**
 * The part of a built package that a bundler swap can silently change.
 *
 * Vite 8 replaces Rollup with Rolldown (`vite@7` depends on `rollup`, `vite@8` on `rolldown`), so
 * every library build in this repo changes bundler. Chunk hashes and byte output change by design,
 * which makes a `dist/` byte comparison useless as an oracle — it reports a diff whether or not
 * anything broke. What must NOT change is the contract this module reads:
 *
 * - which bare specifiers stay external, because a dependency that gets inlined instead still
 *   builds, still passes every unit test, and only surfaces as a duplicated Vue or Pinia instance
 *   in a consumer's app;
 * - whether the entry side-effect-imports its stylesheet, which is the entire job of
 *   `vite-plugin-lib-inject-css` and whose peer range is `vite: "*"`, so nothing blocks an install
 *   against a Vite it cannot drive.
 *
 * Both failures are green-while-wrong, which is what makes them worth a test at all.
 *
 * @remarks
 * Scope is deliberately Vite's output only. A package's `dist/` also holds unbundled `dist/src/**`
 * emitted by the TypeScript step, which no bundler swap touches; walking the relative-import
 * closure from the declared `exports` targets reaches exactly Vite's chunks and nothing else.
 */
export interface DistContract {
	/** Declared export targets the walk started from, package-relative. */
	seeds: string[]
	/** Number of chunk files reached. A drop to zero means the walk found nothing to assert on. */
	chunks: number
	/** Sorted bare specifiers left external across the whole closure. */
	bare: string[]
	/** Sorted relative stylesheet imports, i.e. what `libInjectCss` injected. */
	css: string[]
}

/**
 * Match an import/export statement's specifier.
 *
 * Anchored to a statement boundary rather than a line start. Bundled output puts real statements
 * after a newline, a `;` or a `}`, while a bare `/import .*from/` also matches string literals in
 * the bundle body — `code_editor` embeds a Monaco theme whose contents parse as an import that way.
 * The boundary must include `;` and `}` because the emitted side-effect import for a stylesheet is
 * followed by code on the same line (`import './assets/index.css';function le(e) {`), which a
 * line-anchored pattern misses — silently, and identically before and after the bump.
 */
const FROM = /(?<=[\n;}])[ \t]*(?:import|export)\b[^\n;]*?\bfrom[ \t]*(['"])([^'"]+)\1/g
const SIDE = /(?<=[\n;}])[ \t]*import[ \t]*(['"])([^'"]+)\1[ \t]*(?=[;\n])/g

/** Every specifier a single built file imports or re-exports. */
function specifiersOf(file: string): string[] {
	// Prefixed so a statement on the first line still sits after a boundary character.
	const source = `\n${readFileSync(file, 'utf8')}`
	const found = new Set<string>()

	for (const pattern of [FROM, SIDE]) {
		pattern.lastIndex = 0
		let match: RegExpExecArray | null
		while ((match = pattern.exec(source)) !== null) {
			found.add(match[2])
		}
	}

	return [...found]
}

/** Read a package manifest, throwing rather than reporting an empty contract for a missing one. */
function readManifest(packageDir: string): { exports?: Record<string, unknown> } {
	return JSON.parse(readFileSync(resolve(packageDir, 'package.json'), 'utf8'))
}

/**
 * Walk the relative-import closure of a built package, starting from its declared JS exports.
 *
 * Reads `dist/`, so it fails on an unbuilt checkout. That is deliberate, and the same call this
 * repo already makes in `rockfoil/tests/package-exports.test.ts`: a check that skipped itself when
 * `dist` was absent would pass in exactly the case it exists to catch.
 */
export function readDistContract(packageDir: string): DistContract {
	const seeds: string[] = []
	const walk = (node: unknown): void => {
		if (typeof node === 'string') {
			if (node.endsWith('.js')) seeds.push(node)
			return
		}
		if (node && typeof node === 'object') Object.values(node).forEach(walk)
	}
	for (const [subpath, node] of Object.entries(readManifest(packageDir).exports ?? {})) {
		if (!subpath.includes('*')) walk(node)
	}

	const seen = new Set<string>()
	const bare = new Set<string>()
	const css = new Set<string>()

	const queue = seeds.map(seed => resolve(packageDir, seed)).filter(existsSync)
	const seeded = [...new Set(queue)].map(file => relative(packageDir, file))

	while (queue.length > 0) {
		const file = queue.shift() as string
		if (seen.has(file)) continue
		seen.add(file)

		for (const specifier of specifiersOf(file)) {
			if (!specifier.startsWith('.')) {
				bare.add(specifier)
				continue
			}
			if (specifier.endsWith('.css')) {
				css.add(specifier)
				continue
			}
			const target = resolve(dirname(file), specifier)
			for (const candidate of [target, `${target}.js`]) {
				if (existsSync(candidate) && !seen.has(candidate)) queue.push(candidate)
			}
		}
	}

	return { seeds: seeded, chunks: seen.size, bare: [...bare].sort(), css: [...css].sort() }
}

/**
 * The declaration typechecker that stood here resolved as a bundler only and missed two node16
 * failures attw catches. attw runs repo-wide from `check:publish`; do not reinstate a copy here.
 */
