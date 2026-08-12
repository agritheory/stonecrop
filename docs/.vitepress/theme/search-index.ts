/**
 * Static page index for DocsSearch. Kept hand-written (rather than VitePress's
 * `createContentLoader`, which errors when imported from an always-mounted theme component
 * instead of a per-page markdown import) — fine for a page count that doesn't change daily;
 * add an entry here alongside adding a page.
 */
export interface SearchEntry {
	title: string
	description: string
	url: string
}

export const searchIndex: SearchEntry[] = [
	{ title: 'Stonecrop', description: 'Schema-driven UI framework for business applications', url: '/' },

	{ title: 'Tutorials', description: 'Learning-oriented guides to help you get started with Stonecrop', url: '/tutorials/' },

	{ title: 'Guides', description: 'Task-oriented how-to guides for solving specific problems', url: '/guides/' },
	{
		title: 'Setting Up the GraphQL Middleware',
		description: 'How to configure @stonecrop/graphql-middleware in a Nuxt or Node application',
		url: '/guides/graphql-middleware-setup.html',
	},
	{
		title: 'HST Data Patterns',
		description: 'Common patterns for working with the Hierarchical State Tree (HST) in Stonecrop',
		url: '/guides/hst-patterns.html',
	},
	{
		title: 'Integrating Desktop in a Host Application',
		description: 'How to wire up @stonecrop/desktop in a Nuxt or custom Vue app',
		url: '/guides/desktop-integration.html',
	},
	{
		title: 'Custom Fetch Handlers',
		description: 'How to implement and register FetchHandler callbacks for the custom fetch strategy',
		url: '/guides/custom-fetch-handlers.html',
	},

	{ title: 'API Reference', description: 'Technical API documentation for all Stonecrop packages', url: '/reference/' },
	{
		title: 'Stonecrop API Reference',
		description: 'Core orchestration with Registry, HST, and composables',
		url: '/reference/stonecrop.html',
	},
	{ title: 'AForm API Reference', description: 'Schema-driven form components', url: '/reference/aform.html' },
	{
		title: 'ATable API Reference',
		description: 'Advanced table with tree and Gantt views',
		url: '/reference/atable.html',
	},
	{ title: 'Beam API Reference', description: 'Mobile-first scanning and MQTT', url: '/reference/beam.html' },
	{
		title: 'Desktop API Reference',
		description: 'Desktop navigation and command palette',
		url: '/reference/desktop.html',
	},
	{
		title: 'Node Editor API Reference',
		description: 'Visual FSM workflow editor',
		url: '/reference/node-editor.html',
	},
	{
		title: 'Code Editor API Reference',
		description: 'Monaco-based code editor',
		url: '/reference/code-editor.html',
	},
	{
		title: 'Schema API Reference',
		description: 'Doctype schema definitions and validation',
		url: '/reference/schema.html',
	},
	{
		title: 'GraphQL Client API Reference',
		description: 'GraphQL client utilities',
		url: '/reference/graphql-client.html',
	},
	{
		title: 'GraphQL Middleware API Reference',
		description: 'PostGraphile middleware for Stonecrop',
		url: '/reference/graphql-middleware.html',
	},
	{
		title: 'CASL Middleware API Reference',
		description: 'CASL authorization for GraphQL',
		url: '/reference/casl-middleware.html',
	},
	{ title: 'Rockfoil API Reference', description: 'Server-side utilities', url: '/reference/rockfoil.html' },
	{
		title: 'Utilities API Reference',
		description: 'Shared utility functions',
		url: '/reference/utilities.html',
	},
	{ title: 'Themes', description: 'CSS theming system for Stonecrop', url: '/reference/themes.html' },
	{
		title: 'Nuxt API Reference',
		description: 'Nuxt module for Stonecrop integration',
		url: '/reference/nuxt.html',
	},
	{
		title: 'Nuxt Grafserv API Reference',
		description: 'Pluggable Grafserv GraphQL server as Nuxt Module',
		url: '/reference/nuxt-grafserv.html',
	},

	{
		title: 'Explanation',
		description: 'Understanding-oriented discussions of Stonecrop architecture and design',
		url: '/explanation/',
	},
	{
		title: 'Core Concepts',
		description: "Foundational concepts in Stonecrop's architecture",
		url: '/explanation/core-concepts.html',
	},
	{ title: 'Doctypes', description: "Understanding Stonecrop's document type system", url: '/explanation/doctype.html' },
	{
		title: 'GraphQL Middleware',
		description: 'Architecture and design of @stonecrop/graphql-middleware',
		url: '/explanation/graphql-middleware.html',
	},
	{
		title: 'Design Philosophy',
		description: 'Design principles for business software interfaces',
		url: '/explanation/philosophy.html',
	},

	{
		title: 'Components',
		description: "Live, interactive documentation for Stonecrop's Vue components",
		url: '/components/',
	},
	{
		title: 'Checkbox',
		description: 'A boolean input rendered from an AForm schema field',
		url: '/components/checkbox.html',
	},
	{
		title: 'Currency',
		description: 'A currency amount input with automatic base-currency conversion',
		url: '/components/currency.html',
	},
	{
		title: 'Date',
		description: 'A single-date field with a text input and an inline calendar picker',
		url: '/components/date.html',
	},
	{
		title: 'Date Range',
		description: 'A start/end date range field with a single input and an inline range picker',
		url: '/components/date-range.html',
	},
	{
		title: 'Date Time',
		description: 'A standalone hours:minutes:seconds time-of-day input with a 12-hour AM/PM or 24-hour toggle',
		url: '/components/date-time.html',
	},
	{
		title: 'Date Selection',
		description: 'A combined calendar and time-of-day picker for selecting a single date or range',
		url: '/components/date-selection.html',
	},
	{
		title: 'Date Picker',
		description: 'A calendar-grid date input with single-date and range selection',
		url: '/components/date-picker.html',
	},
	{
		title: 'Duration',
		description: 'A start/end date-time range picker that derives an elapsed duration in milliseconds',
		url: '/components/duration.html',
	},
	{
		title: 'Fieldset',
		description: 'A collapsible container that groups a set of nested fields under a legend',
		url: '/components/fieldset.html',
	},
	{
		title: 'Dropdown',
		description: 'A filterable autocomplete text input backed by a list of string options',
		url: '/components/dropdown.html',
	},
	{
		title: 'File Attach',
		description: 'A button that opens the native file picker and lists the selected files',
		url: '/components/file-attach.html',
	},
	{
		title: 'Form Link',
		description: 'An autocomplete input for selecting a linked (foreign-key) record',
		url: '/components/form-link.html',
	},
	{
		title: 'Numeric Input',
		description: 'A plain numeric input rendered from an AForm schema field',
		url: '/components/numeric-input.html',
	},
	{
		title: 'Quantity Input',
		description: 'A quantity input with unit-of-measure conversion to a stock unit',
		url: '/components/quantity-input.html',
	},
	{
		title: 'Text Input',
		description: 'A single-line text input rendered from an AForm schema field',
		url: '/components/text-input.html',
	},
	{
		title: 'Textbox Input',
		description: 'A multi-line textarea input rendered from an AForm schema field',
		url: '/components/textbox-input.html',
	},
	{
		title: 'AForm',
		description: 'The schema-driven form orchestrator that resolves and renders Stonecrop field components together',
		url: '/components/form.html',
	},
	{
		title: 'Form Loading',
		description: "A loading-state placeholder shown while a form's data is being fetched or resolved",
		url: '/components/form-loading.html',
	},
	{ title: 'Login', description: 'A standalone email/password login form', url: '/components/login.html' },
	{
		title: 'Collapse Button',
		description: "The rotating toggle glyph used by AFieldset's collapsible fieldsets",
		url: '/components/collapse-button.html',
	},

	{ title: 'Examples', description: 'Live component stories and sandboxes', url: '/stories/' },
]
