// @stonecrop/nuxt documentation site
// Nuxt + @nuxt/content docs with integrated public playground (grafserv + DocBuilder)
import { readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import NuxtGrafserv, { type ModuleOptions as GrafservOptions } from '@stonecrop/nuxt-grafserv'

import NuxtStonecrop from '../src/module'

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

// Prerendering is otherwise driven entirely by link crawling, so a page nothing links to never
// reaches the static output and resolves only through the client-side fallback: a direct hit or a
// search result lands on a 404 from the CDN. Enumerating the collection is what makes the built
// site independent of whether the sidebar happens to mention a page.
const contentRoot = fileURLToPath(new URL('./content', import.meta.url))

function contentRoutes(directory: string = contentRoot): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
		const fullPath = join(directory, entry.name)
		if (entry.isDirectory()) {
			return contentRoutes(fullPath)
		}
		if (!entry.name.endsWith('.md')) {
			return []
		}
		const slug = relative(contentRoot, fullPath).slice(0, -'.md'.length).split(sep).join('/')
		// The trailing slash on a directory index is load-bearing: content pages link to siblings
		// as `./name`, which resolves against the parent when the current URL lacks one, turning
		// every such link into a 404 at prerender time.
		return [`/${slug.replace(/(^|\/)index$/, '$1')}`]
	})
}

export default defineNuxtConfig({
	compatibilityDate: '2026-01-01',

	modules: ['@nuxt/content', NuxtStonecrop, NuxtGrafserv, 'nuxt-graphql-middleware'],

	stonecrop: {
		docbuilder: true,
		docbuilderPublic: true,
		doctypesDir: 'doctypes',
	},

	grafserv: {
		type: 'schema' as const,
		schema: './server/schema.graphql',
		resolvers: './server/resolvers.ts',
		url: '/graphql/',
		graphiql: true,
	} as GrafservOptions,

	graphqlMiddleware: {
		graphqlEndpoint: 'https://countries.trevorblades.com/graphql',
		downloadSchema: 'dev-only',
		autoImportPatterns: ['./app/graphql/**/*.graphql'],
	},

	app: {
		head: {
			htmlAttrs: { lang: 'en' },
			titleTemplate: '%s | Stonecrop',
			link: [{ rel: 'icon', type: 'image/svg+xml', href: '/assets/stonecrop-logo-solid.svg' }],
		},
	},

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
			sqliteConnector: 'native',
		},
		build: {
			markdown: {
				highlight: {
					langs: ['js', 'jsx', 'json', 'ts', 'tsx', 'vue', 'css', 'html', 'bash', 'md', 'mdc', 'yaml', 'graphql'],
				},
			},
		},
	},

	css: [
		'@stonecrop/themes/default.css',
		fileURLToPath(new URL('../example-host.css', import.meta.url)),
		'@stonecrop/desktop/styles',
		'@stonecrop/atable/styles',
		'@stonecrop/node-editor/styles',
		'~/assets/css/main.css',
		'~/assets/css/playground-common.css',
	],

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
		routeRules: {
			'/playground/**': { ssr: true, prerender: false },
			'/docbuilder/**': { ssr: true, prerender: false },
			'/graphql/**': { ssr: true, prerender: false },
			'/api/_stonecrop/**': { ssr: true, prerender: false },
		},
		storage: {
			cache: {
				driver: 'memory',
			},
		},
		externals: {
			external: ['grafast', 'grafserv', 'grafserv/h3/v1', 'graphile-config', 'debug'],
		},
	},

	vite: {
		optimizeDeps: {
			include: [
				'pinia',
				'@stonecrop/aform',
				'@stonecrop/schema',
				'@stonecrop/desktop',
				'@stonecrop/stonecrop',
				'@stonecrop/utilities',
				'@stonecrop/atable',
				'@stonecrop/code-editor',
				'@stonecrop/node-editor',
			],
		},
		resolve: {
			dedupe: ['vue'],
			alias: mdcDepAliases,
		},
	},

	typescript: { strict: true },
})
