import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, relative, resolve } from 'node:path'

import type ts from 'typescript'

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
 * Flatten an `exports` map into `[label, target]` pairs.
 *
 * Wildcard subpaths are dropped: the target is a pattern rather than a path, so `existsSync` on the
 * literal string reports a miss for a directory that is present.
 */
export function collectExportTargets(packageDir: string): { label: string; target: string }[] {
	const found: { label: string; target: string }[] = []

	const walk = (node: unknown, label: string): void => {
		if (typeof node === 'string') {
			if (!node.includes('*')) found.push({ label, target: node })
			return
		}
		if (node && typeof node === 'object') {
			for (const [condition, child] of Object.entries(node)) walk(child, `${label} [${condition}]`)
		}
	}

	for (const [subpath, node] of Object.entries(readManifest(packageDir).exports ?? {})) {
		if (!subpath.includes('*')) walk(node, subpath)
	}

	return found
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
 * The diagnostic codes that mean a public export silently loses its type.
 *
 * - **2307** — the declarations import a module the tarball does not contain. Every export whose
 *   type comes through that module becomes `any`.
 * - **2304** — the declarations reference a name they never declare, which has the same effect.
 *
 * Deliberately not every diagnostic. A stylesheet side-effect import that does not resolve (2882)
 * and a dependency that ships no typings (7016) both fire under `skipLibCheck: false`, but neither
 * changes the type of anything this package exports, so gating on them would fail the build for a
 * reason no consumer can observe through the public API.
 */
export const TYPE_ERASING_CODES: ReadonlySet<number> = new Set([2307, 2304])

/** A diagnostic raised inside the package's own shipped declarations. */
export interface TypesDefect {
	/** Package-relative path of the declaration file the diagnostic points at. */
	file: string
	/** TypeScript's numeric code, e.g. 2307 for an unresolvable module. */
	code: number
	message: string
}

/**
 * Typecheck the declarations a consumer actually resolves, as a consumer resolves them.
 *
 * This is the check that was missing while every component in six packages shipped as `any`. The
 * build was green throughout: `tsc -b` read each SFC through the ambient `*.vue` shim, emitted no
 * declaration for it, and the rollup imported `./components/…/X.vue` paths that are not in the
 * tarball. A consumer on the common `skipLibCheck: true` saw no error and got `any`; one without it
 * got 24 unresolvable modules. Nothing in the build, the unit tests or the API report could see it,
 * because none of them reads the published entry the way an installing consumer does.
 *
 * Two diagnostic classes matter and both are returned:
 *
 * - **2307**, a module the declarations import but the package does not ship;
 * - **2304**, a name they reference but never declare — which is what an API Extractor rollup
 *   produces from a component with a scoped slot, by keeping the emitted `typeof __VLS_6` while
 *   dropping the `declare var __VLS_6` that vue-tsc emitted beside it.
 *
 * Diagnostics from `node_modules` are dropped: a third-party package's own declaration errors are
 * not this package's contract, and including them makes the check fail for unrelated reasons.
 *
 * Returns every diagnostic found in the package's own declarations; callers gate on
 * {@link TYPE_ERASING_CODES}, so a new class of defect shows up in the failure message rather than
 * being filtered out before anyone sees it.
 */
export function readTypesDefects(packageDir: string): TypesDefect[] {
	const entries = collectExportTargets(packageDir)
		.filter(({ label, target }) => label.includes('[types]') || target.endsWith('.d.ts'))
		.map(({ target }) => resolve(packageDir, target))
		.filter(existsSync)

	if (entries.length === 0) return []

	// Resolved from the package rather than imported at the top: `common/test-support/` is a bare
	// folder, not a workspace member, so it has no node_modules of its own to resolve from. Taking it
	// from the package under test also means the check runs on the compiler that package builds with.
	const compiler: typeof ts = createRequire(resolve(packageDir, 'package.json'))('typescript')

	const program = compiler.createProgram([...new Set(entries)], {
		noEmit: true,
		// The point of the check: `true` is what hides an unresolvable module in a .d.ts.
		skipLibCheck: false,
		strict: true,
		target: compiler.ScriptTarget.ESNext,
		module: compiler.ModuleKind.ESNext,
		moduleResolution: compiler.ModuleResolutionKind.Bundler,
		// A consumer's DOM globals are theirs, not this package's contract; without these, third-party
		// declarations report missing DOM names that say nothing about what is shipped here.
		lib: ['lib.esnext.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
	})

	const distDir = resolve(packageDir, 'dist')
	return compiler
		.getPreEmitDiagnostics(program)
		.filter(diagnostic => {
			const file = diagnostic.file?.fileName
			if (!file) return false
			return file.startsWith(distDir) && !file.includes('node_modules')
		})
		.map(diagnostic => ({
			file: relative(packageDir, diagnostic.file!.fileName),
			code: diagnostic.code,
			message: compiler.flattenDiagnosticMessageText(diagnostic.messageText, ' '),
		}))
}
