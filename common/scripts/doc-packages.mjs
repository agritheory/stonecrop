/**
 * The packages whose `api.md` becomes a page under the docs site's reference section.
 *
 * Read by both the aggregation script and the aggregation task's `dependsOn`. Two copies would
 * disagree the first time a package is added: the task would aggregate before the new package
 * built, and the drift gate would then fail on a page nobody edited.
 */
export const docPackages = [
	{ folder: 'aform', name: 'aform', title: 'AForm', description: 'Schema-driven form components' },
	{ folder: 'atable', name: 'atable', title: 'ATable', description: 'Advanced table with tree and Gantt views' },
	{ folder: 'beam', name: 'beam', title: 'Beam', description: 'Mobile-first scanning and MQTT' },
	{ folder: 'desktop', name: 'desktop', title: 'Desktop', description: 'Desktop navigation and command palette' },
	{
		folder: 'stonecrop',
		name: 'stonecrop',
		title: 'Stonecrop',
		description: 'Core orchestration with Registry, HST, and composables',
	},
	{ folder: 'schema', name: 'schema', title: 'Schema', description: 'Doctype schema definitions and validation' },
	{
		folder: 'graphql_client',
		name: 'graphql-client',
		title: 'GraphQL Client',
		description: 'GraphQL client utilities',
	},
	{
		folder: 'graphql_middleware',
		name: 'graphql-middleware',
		title: 'GraphQL Middleware',
		description: 'PostGraphile middleware for Stonecrop',
	},
	{
		folder: 'casl_middleware',
		name: 'casl-middleware',
		title: 'CASL Middleware',
		description: 'CASL authorization for GraphQL',
	},
	{ folder: 'rockfoil', name: 'rockfoil', title: 'Rockfoil', description: 'Server-side utilities' },
	{ folder: 'node_editor', name: 'node-editor', title: 'Node Editor', description: 'Visual FSM workflow editor' },
	{ folder: 'code_editor', name: 'code-editor', title: 'Code Editor', description: 'Monaco-based code editor' },
	{ folder: 'utilities', name: 'utilities', title: 'Utilities', description: 'Shared utility functions' },
	{ folder: 'nuxt', name: 'nuxt', title: 'Nuxt', description: 'Nuxt module for Stonecrop integration' },
	{
		folder: 'nuxt_grafserv',
		name: 'nuxt-grafserv',
		title: 'Nuxt Grafserv',
		description: 'Pluggable Grafserv GraphQL server as Nuxt Module',
	},
]
