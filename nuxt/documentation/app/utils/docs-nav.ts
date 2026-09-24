export type DocsNavLink = { text: string; to: string }
export type DocsNavGroup = { title: string; links: DocsNavLink[] }
export type DocsNavSection = { prefix: string; groups: DocsNavGroup[] }

export const docsNavSections: DocsNavSection[] = [
	{
		prefix: '/components/',
		groups: [
			{ title: 'Components', links: [{ text: 'Overview', to: '/components/' }] },
			{
				title: 'Form',
				links: [
					{ text: 'Form', to: '/components/form' },
					{ text: 'Form Loading', to: '/components/form-loading' },
					{ text: 'Fieldset', to: '/components/fieldset' },
					{ text: 'Checkbox', to: '/components/checkbox' },
					{ text: 'Badge', to: '/components/badge' },
					{ text: 'Text Input', to: '/components/text-input' },
					{ text: 'Textbox Input', to: '/components/textbox-input' },
					{ text: 'Numeric Input', to: '/components/numeric-input' },
					{ text: 'Dropdown', to: '/components/dropdown' },
					{ text: 'File Attach', to: '/components/file-attach' },
					{ text: 'Date', to: '/components/date' },
					{ text: 'Date Range', to: '/components/date-range' },
					{ text: 'Date Time', to: '/components/date-time' },
					{ text: 'Date Selection', to: '/components/date-selection' },
					{ text: 'Date Picker', to: '/components/date-picker' },
					{ text: 'Duration', to: '/components/duration' },
					{ text: 'Form Link', to: '/components/form-link' },
					{ text: 'Currency', to: '/components/currency' },
					{ text: 'Quantity Input', to: '/components/quantity-input' },
					{ text: 'Login', to: '/components/login' },
					{ text: 'Collapse Button', to: '/components/collapse-button' },
				],
			},
			{
				title: 'Tables',
				links: [
					{ text: 'Table', to: '/components/table' },
					{ text: 'Table Loading', to: '/components/table-loading' },
				],
			},
			{
				title: 'Desktop',
				links: [
					{ text: 'Command Palette', to: '/components/command-palette' },
					{ text: 'Action Set', to: '/components/action-set' },
				],
			},
			{
				title: 'Editors',
				links: [
					{ text: 'Code Editor', to: '/components/code-editor' },
					{ text: 'Node Editor', to: '/components/node-editor' },
				],
			},
		],
	},
	{
		prefix: '/tutorials/',
		groups: [{ title: 'Tutorials', links: [{ text: 'Overview', to: '/tutorials/' }] }],
	},
	{
		prefix: '/guides/',
		groups: [
			{
				title: 'Guides',
				links: [
					{ text: 'Overview', to: '/guides/' },
					{ text: 'Desktop Integration', to: '/guides/desktop-integration' },
					{ text: 'GraphQL Middleware Setup', to: '/guides/graphql-middleware-setup' },
					{ text: 'CASL Middleware Setup', to: '/guides/casl-middleware-setup' },
					{ text: 'Custom Fetch Handlers', to: '/guides/custom-fetch-handlers' },
					{ text: 'HST Data Patterns', to: '/guides/hst-patterns' },
				],
			},
			{
				title: 'Examples',
				links: [
					{ text: 'App Examples', to: '/guides/app-examples' },
					{ text: 'Playground', to: '/playground' },
				],
			},
		],
	},
	{
		prefix: '/reference/',
		groups: [
			{ title: 'Introduction', links: [{ text: 'Overview', to: '/reference/' }] },
			{ title: 'Components', links: [{ text: 'Live component docs', to: '/components/' }] },
			{ title: 'Core Packages', links: [{ text: 'stonecrop', to: '/reference/stonecrop' }] },
			{
				title: 'UI Components',
				links: [
					{ text: 'aform', to: '/reference/aform' },
					{ text: 'atable', to: '/reference/atable' },
					{ text: 'beam', to: '/reference/beam' },
					{ text: 'desktop', to: '/reference/desktop' },
					{ text: 'node-editor', to: '/reference/node-editor' },
					{ text: 'code-editor', to: '/reference/code-editor' },
				],
			},
			{
				title: 'Backend / Middleware',
				links: [
					{ text: 'schema', to: '/reference/schema' },
					{ text: 'graphql-client', to: '/reference/graphql-client' },
					{ text: 'graphql-middleware', to: '/reference/graphql-middleware' },
					{ text: 'casl-middleware', to: '/reference/casl-middleware' },
					{ text: 'rockfoil', to: '/reference/rockfoil' },
				],
			},
			{
				title: 'Utilities',
				links: [
					{ text: 'utilities', to: '/reference/utilities' },
					{ text: 'themes', to: '/reference/themes' },
				],
			},
			{
				title: 'Nuxt Integration',
				links: [
					{ text: 'nuxt', to: '/reference/nuxt' },
					{ text: 'nuxt-grafserv', to: '/reference/nuxt-grafserv' },
				],
			},
		],
	},
	{
		prefix: '/explanation/',
		groups: [
			{
				title: 'Introduction',
				links: [
					{ text: 'Overview', to: '/explanation/' },
					{ text: 'Core Concepts', to: '/explanation/core-concepts' },
					{ text: 'Doctypes', to: '/explanation/doctype' },
				],
			},
			{ title: 'Design', links: [{ text: 'Design Philosophy', to: '/explanation/philosophy' }] },
			{
				title: 'Middleware',
				links: [
					{ text: 'GraphQL Middleware', to: '/explanation/graphql-middleware' },
					{ text: 'CASL Middleware', to: '/explanation/casl-middleware' },
				],
			},
		],
	},
]

export const docsHomeNavGroups: DocsNavGroup[] = [
	{
		title: 'Documentation',
		links: [
			{ text: 'Home', to: '/' },
			{ text: 'Playground', to: '/playground' },
			{ text: 'Tutorials', to: '/tutorials/' },
			{ text: 'Guides', to: '/guides/' },
			{ text: 'Reference', to: '/reference/' },
			{ text: 'Explanation', to: '/explanation/' },
		],
	},
]

export function docsNavGroupsForPath(path: string): DocsNavGroup[] {
	const section = docsNavSections.find(entry => path.startsWith(entry.prefix))
	return section ? section.groups : docsHomeNavGroups
}

export function docsNavTitleMap(): Map<string, string> {
	const titles = new Map<string, string>()
	const register = (to: string, text: string) => {
		titles.set(to.replace(/\/$/, '') || '/', text)
		if (!to.endsWith('/')) titles.set(`${to}/`, text)
	}
	for (const section of docsNavSections) {
		for (const group of section.groups) {
			for (const link of group.links) register(link.to, link.text)
		}
	}
	for (const group of docsHomeNavGroups) {
		for (const link of group.links) register(link.to, link.text)
	}
	return titles
}
