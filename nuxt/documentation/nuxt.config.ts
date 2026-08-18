// @stonecrop/nuxt documentation site
// Nuxt + @nuxt/content proof-of-migration app (ported from the VitePress site in docs/)
export default defineNuxtConfig({
	compatibilityDate: '2026-01-01',

	modules: ['@nuxt/content'],

	content: {
		experimental: {
			// Avoids a native better-sqlite3 dependency in the Rush/pnpm workspace; Node >= 22.5 ships this built in.
			sqliteConnector: 'native',
		},
	},

	css: ['@stonecrop/desktop/styles', '~/assets/css/main.css'],

	// `global: true` makes these resolvable as bare `:component-name` MDC tags inside markdown
	// content (@nuxt/content's ContentRenderer only resolves components registered globally).
	components: [{ path: '~/components', global: true }],

	devtools: { enabled: true },

	devServer: {
		port: 3002,
		host: 'localhost',
	},

	// Without this, Vite's dependency pre-bundling doesn't dedupe @stonecrop/aform's own
	// `vue` resolution against Nuxt's, producing a duplicate-module bundle and a client-side
	// crash ("Identifier 'h' has already been declared") that silently breaks all hydration —
	// demos never mount and DemoPanel's own toggle button stops working too. Mirrors the same
	// workaround already in nuxt/fullstack/nuxt.config.ts and nuxt/playground/nuxt.config.ts.
	vite: {
		optimizeDeps: {
			include: ['pinia', '@stonecrop/aform', '@stonecrop/schema', '@stonecrop/desktop'],
		},
	},
})
