import type { DoctypeField } from '@stonecrop/schema'
import { createServer, Model } from 'miragejs'
import DbCollection from 'miragejs/db-collection'

export function makeServer() {
	const server = createServer({
		models: {
			'category-listMeta': Model,
			'category-formMeta': Model,
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

				// Category lookup doctype — used by todo category_id Link field
				'category-listMeta': {
					name: 'category',
					schema: [
						{ kind: 'field', fieldname: 'id', label: 'ID', hidden: true, component: 'ATextInput' },
						{ kind: 'field', fieldname: 'name', label: 'Name', component: 'ATextInput' },
					] as DoctypeField[],
					workflow: { id: 'category', initial: 'active', states: { active: {} } },
					actions: {},
				},
				'category-formMeta': {
					name: 'category-form',
					schema: [
						{ kind: 'field', fieldname: 'id', label: 'ID', hidden: true, component: 'ATextInput' },
						{
							kind: 'field',
							fieldname: 'name',
							component: 'ATextInput',
							label: 'Name',
							required: true,
						},
					] as DoctypeField[],
					workflow: {
						id: 'categoryForm',
						initial: 'editing',
						states: {
							editing: { on: { SAVE: 'saved' } },
							saved: { on: { EDIT: 'editing' } },
						},
					},
					actions: { SAVE: ['SAVE'] },
				},
				categories: [
					{ id: '1', name: 'Personal' },
					{ id: '2', name: 'Work' },
					{ id: '3', name: 'Urgent' },
				],

				// Todo List doctype
				'todo-listMeta': {
					name: 'todo-list',
					schema: [
						{ kind: 'field', fieldname: 'id', label: 'ID', hidden: true, component: 'ATextInput' },
						{ kind: 'field', fieldname: 'first_name', label: 'First Name', component: 'ATextInput' },
						{ kind: 'field', fieldname: 'last_name', label: 'Last Name', component: 'ATextInput' },
						{ kind: 'field', fieldname: 'phone', label: 'Phone', component: 'ATextInput' },
						{ kind: 'field', fieldname: 'category_id', label: 'Category', component: 'AFormLink', doctype: 'category' },
					] as DoctypeField[],
					workflow: {
						id: 'todoList',
						initial: 'loaded',
						states: {
							loaded: { on: { CREATE: 'creating' } },
							creating: { on: { SAVE: 'loaded' } },
						},
					},
					actions: {
						// XState transition actions (uppercase convention)
						CREATE: 'CREATE', // Triggers XState transition action
						// Field triggers - automatically executed when fields change
						first_name: ['validateName', 'updateFullName'],
						last_name: ['validateName', 'updateFullName'],
						phone: ['validatePhoneFormat', 'notifyPhoneChange'],
					},
				},
				'todo-lists': [
					{ id: '1', first_name: 'Luke', last_name: 'Skywalker', phone: '+1 123 456 7890', category_id: '1' },
					{ id: '2', first_name: 'Leia', last_name: 'Skywalker', phone: '+1 123 456 7890', category_id: '2' },
					{ id: '3', first_name: 'Anakin', last_name: 'Skywalker', phone: '+1 123 456 7890', category_id: '3' },
				],

				// Todo Form doctype
				'todo-formMeta': {
					name: 'todo-form',
					schema: [
						{
							kind: 'field',
							fieldname: 'header',
							component: 'div',
							label: 'Todo Details',
							value:
								'<h1>Todo Details</h1><p>Edit task information</p><div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 12px; margin: 16px 0;"><strong>🔄 Field Trigger Demo:</strong> As you edit fields below, watch for real-time notifications in the top-right corner!</div>',
						},
						{
							kind: 'field',
							fieldname: 'first_name',
							component: 'ATextInput',
							label: 'First Name',
							required: true,
						},
						{
							kind: 'field',
							fieldname: 'last_name',
							component: 'ATextInput',
							label: 'Last Name',
							required: true,
						},
						{
							kind: 'field',
							fieldname: 'phone',
							component: 'ATextInput',
							label: 'Phone',
							mask: "(locale) => { if (locale === 'en-US') { return '(###) ###-####' } else if (locale === 'en-IN') { return '####-######'} }",
						},
						{
							kind: 'field',
							fieldname: 'email',
							component: 'ATextInput',
							label: 'Email',
							placeholder: 'user@example.com',
						},
						{
							kind: 'field',
							fieldname: 'notes',
							component: 'ATextboxInput',
							label: 'Notes',
							placeholder: 'Additional notes about this todo...',
						},
						{
							kind: 'field',
							fieldname: 'category_id',
							component: 'AFormLink',
							label: 'Category',
							doctype: 'category',
						},
					] as DoctypeField[],
					workflow: {
						id: 'todoForm',
						initial: 'editing',
						states: {
							editing: {
								on: {
									SAVE: 'saved',
									DELETE: 'deleted',
								},
							},
							saved: { on: { EDIT: 'editing' } },
							deleted: {},
						},
					},
					actions: {
						// XState transition actions (uppercase convention)
						SAVE: ['SAVE'],
						DELETE: ['DELETE'],
						// Field triggers - automatically executed when fields change
						first_name: ['validateName', 'updateFullName', 'logFieldChange'],
						last_name: ['validateName', 'updateFullName', 'logFieldChange'],
						phone: ['validatePhoneFormat', 'notifyPhoneChange', 'logFieldChange'],
						email: ['validateEmailFormat', 'logFieldChange'],
						notes: ['validateNotes', 'logFieldChange'],
					},
				},
				'todo-forms': [
					{
						id: '1',
						first_name: 'Luke',
						last_name: 'Skywalker',
						phone: '+1 123 456 7890',
						email: 'luke@jedi.org',
						notes: 'A young farm boy from Tatooine',
						category_id: '1',
					},
					{
						id: '2',
						first_name: 'Leia',
						last_name: 'Skywalker',
						phone: '+1 123 456 7890',
						email: 'leia@rebellion.org',
						notes: 'Princess and leader of the Rebellion',
						category_id: '2',
					},
					{
						id: '3',
						first_name: 'Anakin',
						last_name: 'Skywalker',
						phone: '+1 123 456 7890',
						email: 'anakin@empire.gov',
						notes: 'Former Jedi Knight',
						category_id: '3',
					},
				],

				// Issue List doctype
				'issue-listMeta': {
					name: 'issue-list',
					schema: [
						{ kind: 'field', fieldname: 'id', label: 'ID', hidden: true, component: 'ATextInput' },
						{ kind: 'field', fieldname: 'subject', label: 'Subject', component: 'ATextInput' },
						{ kind: 'field', fieldname: 'date', label: 'Date', component: 'ADate' },
						{ kind: 'field', fieldname: 'status', label: 'Status', component: 'ADropdown' },
					] as DoctypeField[],
					workflow: {
						id: 'issueList',
						initial: 'loaded',
						states: {
							loaded: { on: { CREATE: 'creating' } },
							creating: { on: { SAVE: 'loaded' } },
						},
					},
					actions: {
						// XState transition actions (uppercase convention)
						CREATE: 'CREATE',
						// Field triggers - automatically executed when fields change
						subject: ['validateSubject', 'logFieldChange'],
						status: ['onStatusChange', 'updateTimestamp', 'logFieldChange'],
						priority: ['onPriorityChange', 'logFieldChange'],
						description: ['validateDescription', 'logFieldChange'],
					},
				},
				'issue-lists': [
					{ id: '1', subject: 'First Issue', date: '2022-01-01', status: 'Open', priority: 'High' },
					{ id: '2', subject: 'Second Issue', date: '2022-01-02', status: 'In Progress', priority: 'Medium' },
					{ id: '3', subject: 'Third Issue', date: '2022-01-03', status: 'Resolved', priority: 'Low' },
				],

				// Issue Form doctype
				'issue-formMeta': {
					name: 'issue-form',
					schema: [
						{
							kind: 'field',
							fieldname: 'header',
							component: 'div',
							label: 'Issue Details',
							value:
								'<h1>Issue Details</h1><p>Edit issue information</p><div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 12px; margin: 16px 0;"><strong>🔄 Field Trigger Demo:</strong> Try changing the status to "Resolved" or priority to "Critical" to see special notifications!</div>',
						},
						{
							kind: 'field',
							fieldname: 'subject',
							component: 'ATextInput',
							label: 'Subject',
							required: true,
						},
						{
							kind: 'field',
							fieldname: 'date',
							component: 'ADate',
							label: 'Date',
							required: true,
						},
						{
							kind: 'field',
							fieldname: 'description',
							component: 'ATextboxInput',
							label: 'Description',
						},
						{
							kind: 'field',
							fieldname: 'status',
							component: 'ASelect',
							label: 'Status',
							options: ['Open', 'In Progress', 'Resolved', 'Closed'],
						},
						{
							kind: 'field',
							fieldname: 'priority',
							component: 'ASelect',
							label: 'Priority',
							options: ['Low', 'Medium', 'High', 'Critical'],
						},
					] as DoctypeField[],
					workflow: {
						id: 'issueForm',
						initial: 'editing',
						states: {
							editing: {
								on: {
									SAVE: 'saved',
									DELETE: 'deleted',
								},
							},
							saved: { on: { EDIT: 'editing' } },
							deleted: {},
						},
					},
					actions: {
						// XState transition actions (uppercase convention)
						SAVE: ['SAVE'],
						DELETE: ['DELETE'],
						// Field triggers - automatically executed when fields change
						subject: ['validateSubject', 'logFieldChange'],
						status: ['onStatusChange', 'updateTimestamp', 'logFieldChange'],
						priority: ['onPriorityChange', 'validatePriorityStatus', 'logFieldChange'],
						description: ['validateDescription', 'logFieldChange'],
						date: ['validateFutureDate', 'logFieldChange'],
					},
				},
				'issue-forms': [
					{
						id: '1',
						subject: 'First Issue',
						date: '2022-01-01',
						status: 'Open',
						priority: 'High',
						description: 'This is a detailed description of the first issue.',
					},
					{
						id: '2',
						subject: 'Second Issue',
						date: '2022-01-02',
						status: 'In Progress',
						priority: 'Medium',
						description: 'This is a detailed description of the second issue.',
					},
					{
						id: '3',
						subject: 'Third Issue',
						date: '2022-01-03',
						status: 'Resolved',
						priority: 'Low',
						description: 'This is a detailed description of the third issue.',
					},
				],
			})
		},

		routes() {
			// Route-based meta endpoint that determines doctype from route path
			this.get('/api/meta', (schema, request) => {
				const route = request.queryParams.route as string

				if (!route) {
					return { error: 'Route parameter is required' }
				}

				// Parse the route to determine doctype and type
				const pathSegments = route.split('/').filter(segment => segment.length > 0)

				if (pathSegments.length === 0) {
					return { error: 'Invalid route format' }
				}

				const doctype = pathSegments[0]
				let actualDoctype: string

				if (pathSegments.length === 1) {
					// List route: /todo -> todo-list
					actualDoctype = `${doctype}-list`
				} else if (pathSegments.length === 2) {
					// Form route: /todo/1 -> todo-form
					actualDoctype = `${doctype}-form`
				} else {
					return { error: 'Unsupported route format' }
				}

				// Get the metadata
				const metaKey = `${actualDoctype}Meta`
				const meta = schema.db[metaKey] as any

				// MirageJS stores data as arrays, so get the first item if it's an array
				if (Array.isArray(meta) && meta.length > 0) {
					return meta[0]
				}

				return meta || { error: 'Metadata not found' }
			})

			// Category lookup endpoint (explicit route needed — 'categories' != 'categorys')
			this.get('/api/category', schema => {
				return (schema.db['categories'] as any[]) || []
			})

			// Category record endpoint (explicit route needed — 'categories' != 'categorys')
			this.get('/api/category/:id', (schema, request) => {
				const id = request.params.id
				// @ts-expect-error mismatch between mirage types
				const records = schema.db['categories'] as DbCollection
				return records ? records.find(id) || {} : {}
			})

			// category-form slug also reads from the categories collection
			this.get('/api/category-form/:id', (schema, request) => {
				const id = request.params.id
				// @ts-expect-error mismatch between mirage types
				const records = schema.db['categories'] as DbCollection
				return records ? records.find(id) || {} : {}
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
				// @ts-expect-error mismatch between mirage types
				const records = schema.db[dataKey] as DbCollection

				if (records) {
					const record = records.find(id)
					return record || {}
				}

				return {}
			})

			// Action endpoints (SAVE / DELETE)
			this.post('/api/:doctype/:id', (schema, request) => {
				const doctype = request.params.doctype
				const id = request.params.id
				const body = JSON.parse(request.requestBody) as Record<string, unknown>
				const action = body.action as string

				let actualDoctype = doctype
				if (doctype === 'todo') actualDoctype = 'todo-form'
				else if (doctype === 'issue') actualDoctype = 'issue-form'

				// category and category-form both write to the categories collection
				const dataKey =
					actualDoctype === 'category' || actualDoctype === 'category-form' ? 'categories' : `${actualDoctype}s`
				// @ts-expect-error mismatch between mirage types
				const records = schema.db[dataKey] as DbCollection
				if (!records) return { success: false, data: null, error: 'Collection not found' }

				if (action === 'DELETE') {
					records.remove(id)
					return { success: true, data: null, error: null }
				}

				if (action === 'SAVE') {
					const { action: _action, ...attrs } = body
					records.update(id, attrs)
					return { success: true, data: records.find(id) || null, error: null }
				}

				return { success: false, data: null, error: `Unknown action: ${action}` }
			})

			// allow other same-domain and external requests to passthrough normally
			this.passthrough()
			this.passthrough('https://cdn.jsdelivr.net/**')
		},
	})

	return server
}
