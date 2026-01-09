import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
	defineConfig({
		vite: {
			optimizeDeps: {
				include: ['mermaid', 'dayjs'],
			},
			ssr: {
				noExternal: ['mermaid'],
			},
		},

		title: 'Stonecrop',
		description: 'Schema-driven UI framework for business applications',

		head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],

		themeConfig: {
			nav: [
				{ text: 'Explanation', link: '/explanation/' },
				{ text: 'Guides', link: '/guides/' },
				{ text: 'Tutorials', link: '/tutorials/' },
				{ text: 'Reference', link: '/reference/' },
				{ text: 'Examples', link: '/stories/index.html' },
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
						text: 'API Reference',
						items: [
							{ text: 'Overview', link: '/reference/' },
							{ text: 'aform', link: '/reference/aform' },
							{ text: 'atable', link: '/reference/atable' },
							{ text: 'beam', link: '/reference/beam' },
							{ text: 'desktop', link: '/reference/desktop' },
							{ text: 'stonecrop', link: '/reference/stonecrop' },
							{ text: 'schema', link: '/reference/schema' },
							{ text: 'graphql-client', link: '/reference/graphql-client' },
							{ text: 'graphql-middleware', link: '/reference/graphql-middleware' },
							{ text: 'casl-middleware', link: '/reference/casl-middleware' },
							{ text: 'rockfoil', link: '/reference/rockfoil' },
							{ text: 'node-editor', link: '/reference/node-editor' },
							{ text: 'code-editor', link: '/reference/code-editor' },
							{ text: 'utilities', link: '/reference/utilities' },
							{ text: 'nuxt', link: '/reference/nuxt' },
							{ text: 'nuxt-grafserv', link: '/reference/nuxt-grafserv' },
						],
					},
				],
				'/explanation/': [
					{
						text: 'Explanation',
						items: [
							{ text: 'Overview', link: '/explanation/' },
							{ text: 'Architecture', link: '/explanation/architecture' },
							{ text: 'HST Design', link: '/explanation/hst-design' },
							{ text: 'State Machines', link: '/explanation/state-machines' },
							{ text: 'Design Philosophy', link: '/explanation/philosophy' },
						],
					},
				],
			},

			socialLinks: [{ icon: 'github', link: 'https://github.com/agritheory/stonecrop' }],

			search: {
				provider: 'local',
			},

			footer: {
				message: 'Released under the MIT License.',
				copyright: 'Copyright © 2024 AgriTheory',
			},
		},

		// Mermaid configuration
		mermaid: {
			theme: 'dark',
		},
	})
)
