import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
	defineConfig({
		vite: {
			plugins: [
				// Plugin to rewrite /stories/ to /stories/index.html
				{
					name: 'stories-rewrite',
					configureServer(server) {
						server.middlewares.use((req, res, next) => {
							if (req.url === '/stories' || req.url === '/stories/') {
								req.url = '/stories/index.html'
							}
							next()
						})
					},
				},
			],
			optimizeDeps: {
				include: ['mermaid', 'dayjs'],
			},
			ssr: {
				noExternal: ['mermaid'],
			},
		},

		title: 'Stonecrop',
		description: 'Schema-driven UI framework for business applications',
		head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/images/logo.svg' }]],

		themeConfig: {
			logo: './assets/stonecrop-logo-solid.svg',
			nav: [
				{ text: 'Explanation', link: '/explanation/' },
				{ text: 'Guides', link: '/guides/' },
				{ text: 'Tutorials', link: '/tutorials/' },
				{ text: 'Reference', link: '/reference/' },
				{ text: 'Examples', link: '/stories/', target: '_self' },
			],

			sidebar: {
				'/tutorials/': [
					{
						text: 'Tutorials',
						items: [{ text: 'Overview', link: '/tutorials/' }],
					},
				],
				'/guides/': [
					{
						text: 'Guides',
						items: [{ text: 'Overview', link: '/guides/' }],
					},
				],
				'/reference/': [
					{
						text: 'Introduction',
						items: [{ text: 'Overview', link: '/reference/' }],
					},
					{
						text: 'Core Packages',
						items: [
							{ text: 'stonecrop', link: '/reference/stonecrop' },
							{ text: 'aform', link: '/reference/aform' },
							{ text: 'atable', link: '/reference/atable' },
						],
					},
					{
						text: 'UI Components',
						items: [
							{ text: 'beam', link: '/reference/beam' },
							{ text: 'desktop', link: '/reference/desktop' },
							{ text: 'node-editor', link: '/reference/node-editor' },
							{ text: 'code-editor', link: '/reference/code-editor' },
						],
					},
					{
						text: 'Backend / Middleware',
						items: [
							{ text: 'schema', link: '/reference/schema' },
							{ text: 'graphql-client', link: '/reference/graphql-client' },
							{ text: 'graphql-middleware', link: '/reference/graphql-middleware' },
							{ text: 'casl-middleware', link: '/reference/casl-middleware' },
							{ text: 'rockfoil', link: '/reference/rockfoil' },
						],
					},
					{
						text: 'Utilities',
						items: [
							{ text: 'utilities', link: '/reference/utilities' },
							{ text: 'themes', link: '/reference/themes' },
						],
					},
					{
						text: 'Nuxt Integration',
						items: [
							{ text: 'nuxt', link: '/reference/nuxt' },
							{ text: 'nuxt-grafserv', link: '/reference/nuxt-grafserv' },
						],
					},
				],
				'/explanation/': [
					{
						text: 'Introduction',
						items: [
							{ text: 'Overview', link: '/explanation/' },
							{ text: 'Core Concepts', link: '/explanation/core-concepts' },
							{ text: 'Doctypes', link: '/explanation/doctype' },
						],
					},
					{
						text: 'Design',
						items: [{ text: 'Design Philosophy', link: '/explanation/philosophy' }],
					},
				],
			},

			socialLinks: [{ icon: 'github', link: 'https://github.com/agritheory/stonecrop' }],

			search: {
				provider: 'local',
			},

			footer: {
				message: 'Released under the MIT License.',
				copyright: 'Copyright © 2026 AgriTheory',
			},
		},

		// Mermaid configuration
		mermaid: {
			theme: 'dark',
		},
	})
)
