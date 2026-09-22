// @stonecrop/nuxt documentation site
// Nuxt + @nuxt/content proof-of-migration app (ported from the VitePress site in docs/)
import { createRequire } from 'node:module'

import { contentRoutes, indexTrailingSlashRouteRules } from './content-routes'

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

	app: {
		head: {
			htmlAttrs: { lang: 'en' },
			titleTemplate: '%s | Stonecrop',
			link: [{ rel: 'icon', type: 'image/svg+xml', href: '/assets/stonecrop-logo-solid.svg' }],
		},
	},

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
			// Avoids a native better-sqlite3 dependency in the workspace; Node >= 22.5 ships this built in.
			sqliteConnector: 'native',
		},
		build: {
			markdown: {
				highlight: {
					// Supplying this REPLACES the default language set rather than extending it, so the
					// defaults are repeated here. Dropping one silently unhighlights every fence using it,
					// which is how the graphql blocks in the middleware guide lost their colours.
					langs: ['js', 'jsx', 'json', 'ts', 'tsx', 'vue', 'css', 'html', 'bash', 'md', 'mdc', 'yaml', 'graphql'],
				},
			},
		},
	},

	// The token floor comes first: it declares every --sc-* the component sheets below read, and
	// its own declarations sit in a cascade layer, so this site's unlayered rules still win.
	css: [
		'@stonecrop/themes/default.css',
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

	nitro: {
		prerender: {
			routes: contentRoutes(),
		},
		routeRules: indexTrailingSlashRouteRules(),
	},

	// Without optimizeDeps.include, Vite's pre-bundling doesn't dedupe @stonecrop/*'s own `vue`
	// resolution against Nuxt's, producing a duplicate-module bundle and a client-side crash that
	// silently breaks all hydration — demos never mount. Vite keys its optimize cache on dep
	// version, not dist content, so rebuilding a workspace package would leave the server on a
	// stale pre-bundle (e.g. ASemverInput missing). Force a fresh re-optimize each dev start.
	vite: {
		optimizeDeps: {
			force: true,
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
