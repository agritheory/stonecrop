/**
 * Static page index for DocsSearch. Ported from docs/.vitepress/theme/search-index.ts —
 * kept hand-written rather than generated from the content collection, same rationale as the
 * VitePress version: fine for a page count that doesn't change daily; add an entry here
 * alongside adding a page. URLs updated to this site's routes (no trailing `.html`).
 */
export interface SearchEntry {
	title: string
	description: string
	url: string
}

export const searchIndex: SearchEntry[] = [
	{ title: 'Stonecrop', description: 'Schema-driven UI framework for business applications', url: '/' },

	{
		title: 'Tutorials',
		description: 'Learning-oriented guides to help you get started with Stonecrop',
		url: '/tutorials/',
	},

	{ title: 'Guides', description: 'Task-oriented how-to guides for solving specific problems', url: '/guides/' },
	{
		title: 'Setting Up the GraphQL Middleware',
		description: 'How to configure @stonecrop/graphql-middleware in a Nuxt or Node application',
		url: '/guides/graphql-middleware-setup',
	},
	{
		title: 'Setting Up the CASL Middleware',
		description: 'How to configure @stonecrop/casl-middleware for GraphQL authorization',
		url: '/guides/casl-middleware-setup',
	},
	{
		title: 'HST Data Patterns',
		description: 'Common patterns for working with the Hierarchical State Tree (HST) in Stonecrop',
		url: '/guides/hst-patterns',
	},
	{
		title: 'Integrating Desktop in a Host Application',
		description: 'How to wire up @stonecrop/desktop in a Nuxt or custom Vue app',
		url: '/guides/desktop-integration',
	},
	{
		title: 'Custom Fetch Handlers',
		description: 'How to implement and register FetchHandler callbacks for the custom fetch strategy',
		url: '/guides/custom-fetch-handlers',
	},

	{ title: 'API Reference', description: 'Technical API documentation for all Stonecrop packages', url: '/reference/' },
	{
		title: 'Stonecrop API Reference',
		description: 'Core orchestration with Registry, HST, and composables',
		url: '/reference/stonecrop',
	},
	{ title: 'AForm API Reference', description: 'Schema-driven form components', url: '/reference/aform' },
	{
		title: 'ATable API Reference',
		description: 'Advanced table with tree and Gantt views',
		url: '/reference/atable',
	},
	{ title: 'Beam API Reference', description: 'Mobile-first scanning and MQTT', url: '/reference/beam' },
	{
		title: 'Desktop API Reference',
		description: 'Desktop navigation and command palette',
		url: '/reference/desktop',
	},
	{
		title: 'Node Editor API Reference',
		description: 'Visual FSM workflow editor',
		url: '/reference/node-editor',
	},
	{
		title: 'Code Editor API Reference',
		description: 'Monaco-based code editor',
		url: '/reference/code-editor',
	},
	{
		title: 'Schema API Reference',
		description: 'Doctype schema definitions and validation',
		url: '/reference/schema',
	},
	{
		title: 'GraphQL Client API Reference',
		description: 'GraphQL client utilities',
		url: '/reference/graphql-client',
	},
	{
		title: 'GraphQL Middleware API Reference',
		description: 'PostGraphile middleware for Stonecrop',
		url: '/reference/graphql-middleware',
	},
	{
		title: 'CASL Middleware API Reference',
		description: 'CASL authorization for GraphQL',
		url: '/reference/casl-middleware',
	},
	{ title: 'Rockfoil API Reference', description: 'Server-side utilities', url: '/reference/rockfoil' },
	{
		title: 'Utilities API Reference',
		description: 'Shared utility functions',
		url: '/reference/utilities',
	},
	{ title: 'Themes', description: 'CSS theming system for Stonecrop', url: '/reference/themes' },
	{
		title: 'Nuxt API Reference',
		description: 'Nuxt module for Stonecrop integration',
		url: '/reference/nuxt',
	},
	{
		title: 'Nuxt Grafserv API Reference',
		description: 'Pluggable Grafserv GraphQL server as Nuxt Module',
		url: '/reference/nuxt-grafserv',
	},

	{
		title: 'Explanation',
		description: 'Understanding-oriented discussions of Stonecrop architecture and design',
		url: '/explanation/',
	},
	{
		title: 'Core Concepts',
		description: "Foundational concepts in Stonecrop's architecture",
		url: '/explanation/core-concepts',
	},
	{ title: 'Doctypes', description: "Understanding Stonecrop's document type system", url: '/explanation/doctype' },
	{
		title: 'GraphQL Middleware',
		description: 'Architecture and design of @stonecrop/graphql-middleware',
		url: '/explanation/graphql-middleware',
	},
	{
		title: 'CASL Middleware',
		description: 'Architecture and design of @stonecrop/casl-middleware',
		url: '/explanation/casl-middleware',
	},
	{
		title: 'Design Philosophy',
		description: 'Design principles for business software interfaces',
		url: '/explanation/philosophy',
	},

	{
		title: 'Components',
		description: "Live, interactive documentation for Stonecrop's Vue components",
		url: '/components/',
	},
	{
		title: 'Checkbox',
		description: 'A boolean input rendered from an AForm schema field',
		url: '/components/checkbox',
	},
	{
		title: 'Currency',
		description: 'A currency amount input with automatic base-currency conversion',
		url: '/components/currency',
	},
	{
		title: 'Date',
		description: 'A single-date field with a text input and an inline calendar picker',
		url: '/components/date',
	},
	{
		title: 'Date Range',
		description: 'A start/end date range field with a single input and an inline range picker',
		url: '/components/date-range',
	},
	{
		title: 'Date Time',
		description: 'A standalone hours:minutes:seconds time-of-day input with a 12-hour AM/PM or 24-hour toggle',
		url: '/components/date-time',
	},
	{
		title: 'Date Selection',
		description: 'A combined calendar and time-of-day picker for selecting a single date or range',
		url: '/components/date-selection',
	},
	{
		title: 'Date Picker',
		description: 'A calendar-grid date input with single-date and range selection',
		url: '/components/date-picker',
	},
	{
		title: 'Duration',
		description: 'A start/end date-time range picker that derives an elapsed duration in milliseconds',
		url: '/components/duration',
	},
	{
		title: 'Fieldset',
		description: 'A collapsible container that groups a set of nested fields under a legend',
		url: '/components/fieldset',
	},
	{
		title: 'Dropdown',
		description: 'A filterable autocomplete text input backed by a list of string options',
		url: '/components/dropdown',
	},
	{
		title: 'File Attach',
		description: 'A button that opens the native file picker and lists the selected files',
		url: '/components/file-attach',
	},
	{
		title: 'Form Link',
		description: 'An autocomplete input for selecting a linked (foreign-key) record',
		url: '/components/form-link',
	},
	{
		title: 'Numeric Input',
		description: 'A plain numeric input rendered from an AForm schema field',
		url: '/components/numeric-input',
	},
	{
		title: 'Quantity Input',
		description: 'A quantity input with unit-of-measure conversion to a stock unit',
		url: '/components/quantity-input',
	},
	{
		title: 'Text Input',
		description: 'A single-line text input rendered from an AForm schema field',
		url: '/components/text-input',
	},
	{
		title: 'Textbox Input',
		description: 'A multi-line textarea input rendered from an AForm schema field',
		url: '/components/textbox-input',
	},
	{
		title: 'AForm',
		description: 'The schema-driven form orchestrator that resolves and renders Stonecrop field components together',
		url: '/components/form',
	},
	{
		title: 'Form Loading',
		description: "A loading-state placeholder shown while a form's data is being fetched or resolved",
		url: '/components/form-loading',
	},
	{ title: 'Login', description: 'A standalone email/password login form', url: '/components/login' },
	{
		title: 'Collapse Button',
		description: "The rotating toggle glyph used by AFieldset's collapsible fieldsets",
		url: '/components/collapse-button',
	},

	{
		title: 'Table',
		description: 'A schema-driven data grid with list, tree, and Gantt views',
		url: '/components/table',
	},
	{
		title: 'Table Loading',
		description: "Loading-state placeholders shown while a table's data is being fetched",
		url: '/components/table-loading',
	},
	{
		title: 'Command Palette',
		description: 'A generic keyboard-navigable search overlay for locating and jumping to items',
		url: '/components/command-palette',
	},
	{
		title: 'Action Set',
		description: 'A floating panel of button and dropdown actions',
		url: '/components/action-set',
	},
	{
		title: 'Code Editor',
		description: 'A Monaco-based code editor with language, theming, and read-only support',
		url: '/components/code-editor',
	},
	{
		title: 'Node Editor',
		description: 'A visual, drag-and-drop editor for finite-state-machine workflows',
		url: '/components/node-editor',
	},

	{
		title: 'App Examples',
		description: 'Full working Nuxt applications demonstrating Stonecrop end-to-end',
		url: '/guides/app-examples',
	},
]
