/* eslint-disable no-console */
import type { MutableDoctype } from '@stonecrop/stonecrop'
import { createServer, Model } from 'miragejs'

export function makeServer() {
	const server = createServer({
		models: {
			'issue-form': Model,
			'issue-formMeta': Model,
			'issue-list': Model,
			'issue-listMeta': Model,
			'todo-form': Model,
			'todo-formMeta': Model,
			'todo-list': Model,
			'todo-listMeta': Model,
		},

		seeds(server) {
			server.db.loadData({
				// doctypes list
				// Updated doctypes list with simplified route structure
				doctypes: [
					{
						id: 'todo',
						name: 'Todo',
						slug: 'todo',
						description: 'Task management - /todo/ (list), /todo/1 (form)',
						actions: 'View',
					},
					{
						id: 'issue',
						name: 'Issue',
						slug: 'issue',
						description: 'Issue tracking - /issue/ (list), /issue/1 (form)',
						actions: 'View',
					},
				],

				// Doctype hierarchy configuration
				doctypeHierarchy: {
					todo: {
						route: '/todo',
						currentDoctype: 'todo-list', // Default doctype for this route
						descendantDoctypes: ['todo-list', 'todo-form'],
						routePatterns: {
							list: {
								pattern: '/todo',
								doctype: 'todo-list',
								component: 'View',
								meta: { title: 'Todo List', type: 'list' },
							},
							form: {
								pattern: '/todo/:recordId',
								doctype: 'todo-form',
								component: 'View',
								meta: { title: 'Todo Form', type: 'form' },
							},
						},
					},
					issue: {
						route: '/issue',
						currentDoctype: 'issue-list', // Default doctype for this route
						descendantDoctypes: ['issue-list', 'issue-form'],
						routePatterns: {
							list: {
								pattern: '/issue',
								doctype: 'issue-list',
								component: 'View',
								meta: { title: 'Issue List', type: 'list' },
							},
							form: {
								pattern: '/issue/:recordId',
								doctype: 'issue-form',
								component: 'View',
								meta: { title: 'Issue Form', type: 'form' },
							},
						},
					},
				},

				// Todo List doctype metadata
				'todo-listMeta': {
					schema: [
						{
							fieldname: 'header',
							fieldtype: 'HTML',
							component: 'div',
							label: 'Todo List',
							value: '<h1>Todo List</h1><p>Manage your tasks</p>',
						},
						{
							fieldname: 'todos_table',
							fieldtype: 'Table',
							component: 'ATable',
							label: 'Tasks',
							columns: [
								{ fieldname: 'id', label: 'ID', fieldtype: 'Data' },
								{ fieldname: 'first_name', label: 'First Name', fieldtype: 'Data' },
								{ fieldname: 'last_name', label: 'Last Name', fieldtype: 'Data' },
								{ fieldname: 'phone', label: 'Phone', fieldtype: 'Phone' },
								{ fieldname: 'actions', label: 'Actions', fieldtype: 'Button' },
							],
						},
					] as MutableDoctype['schema'],
					workflow: {
						id: 'todoList',
						initial: 'loaded',
						states: {
							loaded: { on: { CREATE: 'creating' } },
							creating: { on: { SAVE: 'loaded', CANCEL: 'loaded' } },
						},
					},
					actions: {
						CREATE: ['() => console.log("Creating new todo")'],
						EDIT: ['() => console.log("Editing todo")'],
						DELETE: ['() => console.log("Deleting todo")'],
					},
				},
				'todo-lists': [
					{ id: '1', first_name: 'Luke', last_name: 'Skywalker', phone: '+1 123 456 7890' },
					{ id: '2', first_name: 'Leia', last_name: 'Skywalker', phone: '+1 123 456 7890' },
					{ id: '3', first_name: 'Anakin', last_name: 'Skywalker', phone: '+1 123 456 7890' },
				],

				// Todo Form doctype metadata
				'todo-formMeta': {
					schema: [
						{
							fieldname: 'header',
							fieldtype: 'HTML',
							component: 'div',
							label: 'Todo Details',
							value: '<h1>Todo Details</h1><p>Edit task information</p>',
						},
						{
							fieldname: 'first_name',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'First Name',
							required: true,
						},
						{
							fieldname: 'last_name',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'Last Name',
							required: true,
						},
						{
							fieldname: 'phone',
							fieldtype: 'Phone',
							component: 'ATextInput',
							label: 'Phone',
							mask: "(locale) => { if (locale === 'en-US') { return '(###) ###-####' } else if (locale === 'en-IN') { return '####-######'} }",
						},
					] as MutableDoctype['schema'],
					workflow: {
						id: 'todoForm',
						initial: 'editing',
						states: {
							editing: {
								on: {
									SAVE: 'saved',
									CANCEL: 'cancelled',
									DELETE: 'deleted',
								},
							},
							saved: { on: { EDIT: 'editing' } },
							cancelled: {},
							deleted: {},
						},
					},
					actions: {
						SAVE: ['() => console.log("Saving todo")'],
						CANCEL: ['() => console.log("Cancelling todo edit")'],
						DELETE: ['() => console.log("Deleting todo")'],
					},
				},
				'todo-forms': [
					{ id: '1', first_name: 'Luke', last_name: 'Skywalker', phone: '+1 123 456 7890' },
					{ id: '2', first_name: 'Leia', last_name: 'Skywalker', phone: '+1 123 456 7890' },
					{ id: '3', first_name: 'Anakin', last_name: 'Skywalker', phone: '+1 123 456 7890' },
				],

				// Issue List doctype metadata
				'issue-listMeta': {
					schema: [
						{
							fieldname: 'header',
							fieldtype: 'HTML',
							component: 'div',
							label: 'Issue List',
							value: '<h1>Issue List</h1><p>Track and manage issues</p>',
						},
						{
							fieldname: 'issues_table',
							fieldtype: 'Table',
							component: 'ATable',
							label: 'Issues',
							columns: [
								{ fieldname: 'id', label: 'ID', fieldtype: 'Data' },
								{ fieldname: 'subject', label: 'Subject', fieldtype: 'Data' },
								{ fieldname: 'date', label: 'Date', fieldtype: 'Date' },
								{ fieldname: 'status', label: 'Status', fieldtype: 'Select' },
								{ fieldname: 'actions', label: 'Actions', fieldtype: 'Button' },
							],
						},
					] as MutableDoctype['schema'],
					workflow: {
						id: 'issueList',
						initial: 'loaded',
						states: {
							loaded: { on: { CREATE: 'creating' } },
							creating: { on: { SAVE: 'loaded', CANCEL: 'loaded' } },
						},
					},
					actions: {
						CREATE: ['() => console.log("Creating new issue")'],
						EDIT: ['() => console.log("Editing issue")'],
						DELETE: ['() => console.log("Deleting issue")'],
					},
				},
				'issue-lists': [
					{ id: '1', subject: 'First Issue', date: '2022-01-01', status: 'Open', priority: 'High' },
					{ id: '2', subject: 'Second Issue', date: '2022-01-02', status: 'In Progress', priority: 'Medium' },
					{ id: '3', subject: 'Third Issue', date: '2022-01-03', status: 'Resolved', priority: 'Low' },
				],

				// Issue Form doctype metadata
				'issue-formMeta': {
					schema: [
						{
							fieldname: 'header',
							fieldtype: 'HTML',
							component: 'div',
							label: 'Issue Details',
							value: '<h1>Issue Details</h1><p>Edit issue information</p>',
						},
						{
							fieldname: 'subject',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'Subject',
							required: true,
						},
						{
							fieldname: 'date',
							fieldtype: 'Date',
							component: 'ADate',
							label: 'Date',
							required: true,
						},
						{
							fieldname: 'description',
							fieldtype: 'Text',
							component: 'ATextarea',
							label: 'Description',
						},
						{
							fieldname: 'status',
							fieldtype: 'Select',
							component: 'ASelect',
							label: 'Status',
							options: ['Open', 'In Progress', 'Resolved', 'Closed'],
						},
						{
							fieldname: 'priority',
							fieldtype: 'Select',
							component: 'ASelect',
							label: 'Priority',
							options: ['Low', 'Medium', 'High', 'Critical'],
						},
					] as MutableDoctype['schema'],
					workflow: {
						id: 'issueForm',
						initial: 'editing',
						states: {
							editing: {
								on: {
									SAVE: 'saved',
									CANCEL: 'cancelled',
									DELETE: 'deleted',
								},
							},
							saved: { on: { EDIT: 'editing' } },
							cancelled: {},
							deleted: {},
						},
					},
					actions: {
						SAVE: ['() => console.log("Saving issue")'],
						CANCEL: ['() => console.log("Cancelling issue edit")'],
						DELETE: ['() => console.log("Deleting issue")'],
					},
				},
				'issue-forms': [
					{ id: '1', subject: 'First Issue', date: '2022-01-01', status: 'Open', priority: 'High' },
					{ id: '2', subject: 'Second Issue', date: '2022-01-02', status: 'In Progress', priority: 'Medium' },
					{ id: '3', subject: 'Third Issue', date: '2022-01-03', status: 'Resolved', priority: 'Low' },
				],
			})
		},

		routes() {
			// Route resolution endpoint - determines doctype from route path
			this.get('/api/resolve-route', (schema, request) => {
				const path = request.queryParams.path as string
				if (!path) {
					return { error: 'Path parameter is required' }
				}

				console.log(`[MirageJS] Resolving route: ${path}`)

				// Access the raw seed data directly
				const hierarchy = schema.db.doctypeHierarchy

				// If hierarchy is an array (MirageJS converts objects to arrays), get the first item
				let hierarchyData = hierarchy
				if (Array.isArray(hierarchy) && hierarchy.length > 0) {
					hierarchyData = hierarchy[0]
				}

				// Find matching route pattern in hierarchy
				for (const [doctypeKey, config] of Object.entries(hierarchyData)) {
					const doctypeConfig = config as any

					if (!doctypeConfig.routePatterns) {
						console.warn(`[MirageJS] No routePatterns found for doctype: ${doctypeKey}`)
						continue
					}

					// Check each route pattern for this doctype
					for (const [patternKey, pattern] of Object.entries(doctypeConfig.routePatterns)) {
						const routePattern = (pattern as any).pattern

						// Convert Vue route pattern to regex for matching
						// e.g., '/todo/:recordId' becomes /^\/todo\/([^\/]+)$/
						const regexPattern = routePattern
							.replace(/:[^\/]+/g, '([^/]+)') // Replace :param with capture group
							.replace(/\//g, '\\/') // Escape slashes

						const regex = new RegExp(`^${regexPattern}$`)

						if (regex.test(path)) {
							const result = {
								doctype: doctypeKey,
								actualDoctype: (pattern as any).doctype,
								routeType: (pattern as any).meta.type,
								routeName: `${doctypeKey}-${patternKey}`,
								matchedPattern: routePattern,
								...((pattern as any).meta || {}),
							}

							// Extract route parameters if this is a form route
							if ((pattern as any).meta.type === 'form') {
								const matches = path.match(regex)
								if (matches && matches[1]) {
									result.recordId = matches[1]
								}
							}

							console.log(`[MirageJS] Route ${path} resolved to:`, result)
							return result
						}
					}
				}

				console.log(`[MirageJS] No route pattern found for path: ${path}`)
				return { error: 'Route not found', path }
			})

			// Doctype hierarchy endpoint
			this.get('/api/doctype-hierarchy', schema => {
				let hierarchy = schema.db.doctypeHierarchy as any

				// If hierarchy is an array (MirageJS converts objects to arrays), get the first item
				if (Array.isArray(hierarchy) && hierarchy.length > 0) {
					hierarchy = hierarchy[0]
				}

				console.log(`[MirageJS] Returning doctype hierarchy:`, hierarchy)
				return hierarchy
			})

			// Specific doctype hierarchy endpoint
			this.get('/api/doctype-hierarchy/:doctype', (schema, request) => {
				const doctype = request.params.doctype
				let hierarchy = schema.db.doctypeHierarchy as any

				// If hierarchy is an array (MirageJS converts objects to arrays), get the first item
				if (Array.isArray(hierarchy) && hierarchy.length > 0) {
					hierarchy = hierarchy[0]
				}

				const doctypeHierarchy = hierarchy[doctype]

				if (doctypeHierarchy) {
					console.log(`[MirageJS] Returning hierarchy for ${doctype}:`, doctypeHierarchy)
					return doctypeHierarchy
				}

				console.log(`[MirageJS] No hierarchy found for ${doctype}`)
				return {}
			})

			// View-specific meta endpoints
			this.get('/api/:doctype/meta', (schema, request) => {
				const doctype = request.params.doctype

				// Map simplified routes to specific doctypes
				let actualDoctype = doctype
				if (doctype === 'todo') {
					// For /todo/ route, use todo-list doctype
					actualDoctype = 'todo-list'
				} else if (doctype === 'issue') {
					// For /issue/ route, use issue-list doctype
					actualDoctype = 'issue-list'
				}

				// Handle mapped doctypes
				const metaKey = `${actualDoctype}Meta`
				const meta = schema.db[metaKey] as any
				return meta || {}
			})

			// Data endpoints
			this.get('/api/:doctype', (schema, request) => {
				const doctype = request.params.doctype

				// Map simplified routes to specific doctypes
				let actualDoctype = doctype
				if (doctype === 'todo') {
					actualDoctype = 'todo-list'
				} else if (doctype === 'issue') {
					actualDoctype = 'issue-list'
				}

				// Handle mapped doctypes
				const dataKey = `${actualDoctype}s`
				const records = schema.db[dataKey] as any[]
				return records || []
			})

			// Meta endpoint for record forms (to get form-specific metadata)
			this.get('/api/:doctype/:id/meta', (schema, request) => {
				const doctype = request.params.doctype

				// Map simplified routes to form doctypes
				let actualDoctype = doctype
				if (doctype === 'todo') {
					actualDoctype = 'todo-form'
				} else if (doctype === 'issue') {
					actualDoctype = 'issue-form'
				}

				const metaKey = `${actualDoctype}Meta`
				const meta = schema.db[metaKey] as any
				return meta || {}
			})

			// Record endpoints
			this.get('/api/:doctype/:id', (schema, request) => {
				const doctype = request.params.doctype
				const id = request.params.id

				// Map simplified routes to specific doctypes for forms
				let actualDoctype = doctype
				if (doctype === 'todo') {
					actualDoctype = 'todo-form'
				} else if (doctype === 'issue') {
					actualDoctype = 'issue-form'
				}

				const dataKey = `${actualDoctype}s`
				const records = schema.db[dataKey] as any[]

				if (records) {
					const record = records.find((r: any) => r.id === id)
					return record
				}

				return {}
			})

			// allow other same-domain and external requests to passthrough normally
			this.passthrough()
			this.passthrough('https://cdn.jsdelivr.net/**')
		},
	})

	return server
}
