/* eslint-disable no-console */
import type { MutableDoctype } from '@stonecrop/stonecrop'
import { createServer, Model } from 'miragejs'

const doctypeActions: MutableDoctype['actions'] = {
	LOAD: [
		(() => {
			console.log('load event')
		}).toString(),
		(() => {
			console.log('load event side effect')
		}).toString(),
	],
	SAVE: [
		(() => {
			console.log('save event')
		}).toString(),
		(() => {
			console.log('after save event')
		}).toString(),
	],
}

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
				// Updated doctypes list with separate list and form types
				doctypes: [
					{
						id: 'todo-list',
						name: 'Todo List',
						slug: 'todo-list',
						description: 'View and manage todo items',
						actions: 'View',
					},
					{
						id: 'todo-form',
						name: 'Todo Form',
						slug: 'todo-form',
						description: 'Create and edit todo items',
						actions: 'View',
					},
					{
						id: 'issue-list',
						name: 'Issue List',
						slug: 'issue-list',
						description: 'View and manage issues',
						actions: 'View',
					},
					{
						id: 'issue-form',
						name: 'Issue Form',
						slug: 'issue-form',
						description: 'Create and edit issues',
						actions: 'View',
					},
				],

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

				// Todo metadata (existing)
				todoMeta: {
					schema: [
						{
							name: 'first_name',
							fieldname: 'first_name',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'First Name',
						},
						{
							name: 'last_name',
							fieldname: 'last_name',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'Last Name',
						},
						{
							name: 'phone',
							fieldname: 'phone',
							fieldtype: 'Phone',
							component: 'ATextInput',
							label: 'Phone',
							mask: "(locale) => { if (locale === 'en-US') { return '(###) ###-####' } else if (locale === 'en-IN') { return '####-######'} }",
						},
					] as MutableDoctype['schema'],
					workflow: {
						id: 'todo',
						initial: 'created',
						states: {
							created: { on: { LOAD: 'loaded' } },
							loaded: { on: { SAVE: 'saved' } },
							saved: {},
						},
					} /* as MutableDoctype['workflow'] */,
					actions: doctypeActions,
				},
				todos: [
					{ id: '1', first_name: 'Luke', last_name: 'Skywalker', phone: '+1 123 456 7890' },
					{ id: '2', first_name: 'Leia', last_name: 'Skywalker', phone: '+1 123 456 7890' },
					{ id: '3', first_name: 'Anakin', last_name: 'Skywalker', phone: '+1 123 456 7890' },
				],

				// Issue metadata (existing)
				issueMeta: {
					schema: [
						{
							name: 'subject',
							fieldname: 'subject',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'Subject',
						},
						{
							name: 'date',
							fieldname: 'date',
							fieldtype: 'Date',
							component: 'ADate',
							label: 'Date',
						},
					] as MutableDoctype['schema'],
					workflow: {
						id: 'issue',
						initial: 'created',
						states: {
							created: { on: { LOAD: 'loaded' } },
							loaded: { on: { SAVE: 'saved' } },
							saved: {},
						},
					} /* as MutableDoctype['workflow'] */,
					actions: doctypeActions,
				},
				issues: [
					{ id: '1', subject: 'First Issue', date: '2022-01-01', status: 'Open', priority: 'High' },
					{ id: '2', subject: 'Second Issue', date: '2022-01-02', status: 'In Progress', priority: 'Medium' },
					{ id: '3', subject: 'Third Issue', date: '2022-01-03', status: 'Resolved', priority: 'Low' },
				],
			})
		},

		routes() {
			// View-specific meta endpoints
			this.get('/api/:doctype/meta', (schema, request) => {
				const doctype = request.params.doctype
				console.log(`[MirageJS] Getting meta for doctype: ${doctype}`)

				// Handle new separate doctypes with hyphenated names
				const metaKey = `${doctype}Meta`
				const meta = schema.db[metaKey] as any

				if (meta) {
					console.log(`[MirageJS] Returning ${metaKey}:`, meta)
					return meta
				}

				// Legacy fallback for view-specific schemas
				if (request.queryParams.view) {
					const view = Array.isArray(request.queryParams.view) ? request.queryParams.view[0] : request.queryParams.view
					const legacyMetaKey = `${doctype}${view.charAt(0).toUpperCase() + view.slice(1)}Meta`
					const legacyMeta = schema.db[legacyMetaKey] as any

					if (legacyMeta) {
						console.log(`[MirageJS] Returning legacy ${legacyMetaKey}:`, legacyMeta)
						return legacyMeta
					}
				}

				console.log(`[MirageJS] No meta found for ${doctype}`)
				return {}
			})

			// Data endpoints
			this.get('/api/:doctype', (schema, request) => {
				const doctype = request.params.doctype
				console.log(`[MirageJS] Getting data for doctype: ${doctype}`)

				// Handle new separate doctypes with hyphenated names
				const dataKey = `${doctype}s`
				const records = schema.db[dataKey] as any[]

				if (records) {
					console.log(`[MirageJS] Returning ${dataKey}:`, records)
					return records
				}

				console.log(`[MirageJS] No data found for ${doctype}`)
				return []
			})

			// Record endpoints
			this.get('/api/:doctype/:id', (schema, request) => {
				const doctype = request.params.doctype
				const id = request.params.id
				console.log(`[MirageJS] Getting record ${id} for doctype: ${doctype}`)

				const dataKey = `${doctype}s`
				const records = schema.db[dataKey] as any[]

				if (records) {
					const record = records.find((r: any) => r.id === id)
					console.log(`[MirageJS] Returning ${doctype} record ${id}:`, record)
					return record
				}

				console.log(`[MirageJS] No record found for ${doctype}:${id}`)
				return {}
			})

			// allow other same-domain and external requests to passthrough normally
			this.passthrough()
			this.passthrough('https://cdn.jsdelivr.net/**')
		},
	})

	return server
}
