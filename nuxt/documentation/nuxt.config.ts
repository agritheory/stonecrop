// @stonecrop/nuxt documentation site
// Nuxt + @nuxt/content proof-of-migration app (ported from the VitePress site in docs/)
import { createRequire } from 'node:module'

// @nuxtjs/mdc's remark/rehype pipeline (behind @nuxt/content) depends on a chain of small CJS
// utilities — remark-gfm, remark-emoji, remark-mdc, remark-rehype, rehype-raw, parse5,
// unist-util-visit, unified, debug, extend — none of which are resolvable via normal Node
// resolution from this app root: pnpm's strict dependency isolation only lets a package
// require() its own declared dependencies, and these are transitive (nested several layers
// under @nuxtjs/mdc, itself nested under @nuxt/content). @nuxtjs/mdc hints Vite to pre-bundle
// them via a `pkg > dep` nested-path syntax, but that hint doesn't resolve under pnpm's
// symlinked layout either, so Vite falls back to serving them raw via `@fs` — which skips
// esbuild's CJS-to-ESM interop shim and breaks with "does not provide an export named 'default'"
// the first time any of the plain `import x from 'x'` usages inside them actually executes.
//
// Fixed by resolving each one's real path the same way Node itself would — by chaining
// createRequire through the actual dependency graph (@nuxt/content -> @nuxtjs/mdc -> the
// utility) — and aliasing the bare specifier directly to that resolved path. This walks the
// real, version-correct resolution Node already knows how to do, rather than guessing at a
// pnpm store path (which can have multiple versions of the same package, e.g. `debug`).
const localRequire = createRequire(import.meta.url)
const mdcRequire = createRequire(createRequire(localRequire.resolve('@nuxt/content')).resolve('@nuxtjs/mdc'))
const mdcTransitiveDeps = [
	'remark-gfm',
	'remark-emoji',
	'remark-mdc',
	'remark-rehype',
	'rehype-raw',
	'parse5',
	'unist-util-visit',
	'unified',
	'debug',
	'extend',
]
const mdcDepAliases = Object.fromEntries(mdcTransitiveDeps.map(name => [name, mdcRequire.resolve(name)]))

export default defineNuxtConfig({
	compatibilityDate: '2026-01-01',

	modules: ['@nuxt/content'],

	// Nuxt's auto-import transform excludes `node_modules` by checking for a literal
	// `node_modules` path segment — but pnpm workspace packages (this whole monorepo) resolve
	// to their real symlinked path, which has no such segment. So the transform was running on
	// @stonecrop/*'s own pre-built dist files and injecting a duplicate `import { h } from 'vue'`
	// into one (misreading an unrelated minified local variable also named `h`), producing a
	// hard "Identifier `h` has already been declared" build error. Excluding these dist/src
	// paths explicitly stops Nuxt from transforming code that isn't this app's own source.
	imports: {
		transform: {
			exclude: [
				/[\\/]node_modules[\\/]/,
				/[\\/](aform|atable|beam|desktop|schema|stonecrop|utilities|themes|rockfoil|casl_middleware|graphql_client|graphql_middleware|node_editor|code_editor)[\\/](dist|src)[\\/]/,
			],
		},
	},

	content: {
		experimental: {
			// Avoids a native better-sqlite3 dependency in the Rush/pnpm workspace; Node >= 22.5 ships this built in.
			sqliteConnector: 'native',
		},
	},

	css: [
		'@stonecrop/desktop/styles',
		'@stonecrop/atable/styles',
		'@stonecrop/node-editor/styles',
		'~/assets/css/main.css',
	],

	// `global: true` makes these resolvable as bare `:component-name` MDC tags inside markdown
	// content (@nuxt/content's ContentRenderer only resolves components registered globally).
	components: [{ path: '~/components', global: true }],

	devtools: { enabled: true },

	devServer: {
		port: 3002,
		host: 'localhost',
	},

	// /stories/ is a static prebuilt Histoire bundle served from public/stories/ (not a Nuxt
	// route) — Nitro's prerender link-crawler discovers it from guides pages' links and tries
	// to render it as an app route, 404ing and failing the whole generate. It's still copied
	// into .output/public/stories/ as a static asset regardless; just skip crawling it as a route.
	nitro: {
		prerender: {
			ignore: ['/stories/', '/stories'],
		},
	},

	// Without this, Vite's dependency pre-bundling doesn't dedupe @stonecrop/aform's own
	// `vue` resolution against Nuxt's, producing a duplicate-module bundle and a client-side
	// crash ("Identifier 'h' has already been declared") that silently breaks all hydration —
	// demos never mount and DemoPanel's own toggle button stops working too. Mirrors the same
	// workaround already in nuxt/fullstack/nuxt.config.ts and nuxt/playground/nuxt.config.ts.
	vite: {
		optimizeDeps: {
			include: [
				'pinia',
				'@stonecrop/aform',
				'@stonecrop/schema',
				'@stonecrop/desktop',
				'@stonecrop/utilities',
				'@stonecrop/atable',
				'@stonecrop/code-editor',
				'@stonecrop/node-editor',
			],
		},
		resolve: {
			// In this pnpm workspace, @stonecrop/* packages can each resolve their own `vue` copy
			// independently of Nuxt's — dev's esbuild pre-bundling tolerates that (worked around
			// above via optimizeDeps.include), but production's Rollup client build concatenates
			// modules into shared chunks and ends up with two `h` bindings in one scope, which is
			// a hard syntax error, not just a runtime duplicate. Forcing a single resolved `vue`
			// path fixes both dev and production the same way.
			dedupe: ['vue'],
			// See mdcDepAliases above — resolves @nuxtjs/mdc's own transitive deps to their real
			// paths, since they're not resolvable via plain Node resolution from this app root.
			alias: mdcDepAliases,
		},
	},
})
