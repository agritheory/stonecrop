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
			aside: false,
			// Four sections, matching the Diátaxis framework (https://diataxis.fr/) exactly:
			// Tutorials (learning-oriented), Guides (task-oriented), Reference (information-oriented),
			// Explanation (understanding-oriented). Components and Examples aren't Diátaxis categories
			// of their own — Components is information-oriented (props/API lookup), so it's reachable
			// from Reference; Examples/stories are task-oriented demonstrations, so they're reachable
			// from Guides. Both keep their existing URLs and sidebars, just aren't top-level anymore.
			nav: [
				{ text: 'Tutorials', link: '/tutorials/' },
				{ text: 'Guides', link: '/guides/' },
				{ text: 'Reference', link: '/reference/' },
				{ text: 'Explanation', link: '/explanation/' },
			],

			sidebar: {
				'/': [
					{
						items: [
							{ text: 'Home', link: '/' },
							{ text: 'Tutorials', link: '/tutorials/' },
							{ text: 'Guides', link: '/guides/' },
							{ text: 'Reference', link: '/reference/' },
							{ text: 'Explanation', link: '/explanation/' },
						],
					},
					{
						items: [{ text: 'GitHub', link: 'https://github.com/agritheory/stonecrop' }],
					},
				],
				'/components/': [
					{
						text: 'Components',
						items: [{ text: 'Overview', link: '/components/' }],
					},
					{
						text: 'Inputs',
						items: [
							{ text: 'Form', link: '/components/form' },
							{ text: 'Form Loading', link: '/components/form-loading' },
							{ text: 'Fieldset', link: '/components/fieldset' },
							{ text: 'Checkbox', link: '/components/checkbox' },
							{ text: 'Text Input', link: '/components/text-input' },
							{ text: 'Textbox Input', link: '/components/textbox-input' },
							{ text: 'Numeric Input', link: '/components/numeric-input' },
							{ text: 'Dropdown', link: '/components/dropdown' },
							{ text: 'File Attach', link: '/components/file-attach' },
							{ text: 'Date', link: '/components/date' },
							{ text: 'Date Range', link: '/components/date-range' },
							{ text: 'Date Time', link: '/components/date-time' },
							{ text: 'Date Selection', link: '/components/date-selection' },
							{ text: 'Date Picker', link: '/components/date-picker' },
							{ text: 'Duration', link: '/components/duration' },
							{ text: 'Form Link', link: '/components/form-link' },
							{ text: 'Currency', link: '/components/currency' },
							{ text: 'Quantity Input', link: '/components/quantity-input' },
							{ text: 'Login', link: '/components/login' },
							{ text: 'Collapse Button', link: '/components/collapse-button' },
						],
					},
				],
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
					{
						text: 'Examples',
						items: [{ text: 'Live component stories', link: '/stories/' }],
					},
				],
				'/reference/': [
					{
						text: 'Introduction',
						items: [{ text: 'Overview', link: '/reference/' }],
					},
					{
						text: 'Components',
						items: [{ text: 'Live component docs', link: '/components/' }],
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

			// VitePress's own search box is replaced by @stonecrop/desktop's CommandPalette,
			// injected via the Layout override in theme/index.ts — leaving `search` unset makes
			// VPNavBarSearch render nothing, freeing up the nav slot it would otherwise occupy.

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
