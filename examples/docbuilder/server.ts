// src/server.js
import { createServer, Model, Response } from 'miragejs'
import type { WorkflowMeta } from '@stonecrop/schema'

export function makeServer({ environment = 'development' } = {}) {
	let server = createServer({
		environment,

		models: {
			action: Model,
			assignment: Model,
			doctype: Model,
			hook: Model,
			issue: Model,
			meta: Model,
			stateMachine: Model,
		},

		seeds(server) {
			server.db.loadData({
				doctypes: [{ name: 'Issue' }, { name: 'Assignment' }, { name: 'User' }],
				stateMachines: [
					{
						name: 'issue',
						machine: {
							states: ['New', 'Draft', 'Assigned', 'Resolved', 'Closed'],
							actions: {
								Save: { label: 'Save', handler: '', allowedStates: ['New'], nextState: 'Draft' },
								Assign: { label: 'Assign', handler: '', allowedStates: ['Draft'], nextState: 'Assigned' },
								Resolve: { label: 'Resolve', handler: '', allowedStates: ['Draft', 'Assigned'], nextState: 'Resolved' },
								Close: { label: 'Close', handler: '', allowedStates: ['Resolved'], nextState: 'Closed' },
								Reopen: { label: 'Reopen', handler: '', allowedStates: ['Closed'], nextState: 'Draft' },
							},
						} as WorkflowMeta,
						layout: {
							New: {
								position: { x: 50, y: 0 },
							},
							Draft: {
								position: { x: 300, y: 50 },
								targetPosition: 'top',
							},
							Assigned: {
								position: { x: 550, y: 150 },
							},
							Resolved: {
								position: { x: 800, y: 100 },
							},
							Closed: {
								position: { x: 1050, y: 50 },
								sourcePosition: 'top',
							},
						},
					},
					{
						name: 'assignment',
						machine: {
							states: ['New', 'Draft', 'Completed', 'Cancelled'],
							actions: {
								SAVE: { label: 'SAVE', handler: '', allowedStates: ['New'], nextState: 'Draft' },
								COMPLETE: { label: 'COMPLETE', handler: '', allowedStates: ['Draft'], nextState: 'Completed' },
								CANCEL: { label: 'CANCEL', handler: '', allowedStates: ['Completed'], nextState: 'Cancelled' },
							},
						} as WorkflowMeta,
						layout: {
							New: {
								position: { x: 50, y: 50 },
							},
							Draft: {
								position: { x: 300, y: 50 },
							},
							Completed: {
								position: { x: 550, y: 50 },
							},
							Cancelled: {
								position: { x: 800, y: 50 },
							},
						},
					},
					{
						name: 'user',
						machine: {
							states: ['Active', 'Inactive'],
							actions: {
								Deactivate: { label: 'Deactivate', handler: '', allowedStates: ['Active'], nextState: 'Inactive' },
								'Re-Activate': { label: 'Re-Activate', handler: '', allowedStates: ['Inactive'], nextState: 'Active' },
							},
						} as WorkflowMeta,
						layout: {
							Active: {
								position: { x: 50, y: 0 },
								sourcePosition: 'top',
								targetPosition: 'bottom',
							},
							Inactive: {
								position: { x: 300, y: 25 },
								targetPosition: 'top',
								sourcePosition: 'bottom',
							},
						},
					},
				],
				meta: [
					{
						name: 'issue',
						fields: [
							{
								fieldname: 'subject',
								label: 'Subject',
								fieldtype: 'Data',
								required: true,
							},
							{
								fieldname: 'description',
								label: 'Description',
								fieldtype: 'Long Text',
								required: true,
							},
							{
								fieldname: 'reported_date',
								label: 'Report Date',
								fieldtype: 'Date',
								readonly: true,
							},
							{
								fieldname: 'assigned_date',
								label: 'Assigned Date',
								fieldtype: 'Date',
								readonly: true,
							},
							{
								fieldname: 'assigned_to',
								label: 'Assigned To',
								fieldtype: 'AutocompleteMultiSelect',
							},
							{
								fieldname: 'resolved_date',
								label: 'Resolved Date',
								fieldtype: 'Date',
								readonly: true,
							},
							{
								fieldname: 'closed_date',
								label: 'Closed Date',
								fieldtype: 'Date',
								readonly: true,
							},
							{
								fieldname: 'resolution',
								label: 'Resolution',
								fieldtype: 'Long Text',
							},
						],
					},
					{
						name: 'assignment',
						fields: [
							{
								fieldname: 'user',
								label: 'User',
								fieldtype: 'Autocomplete',
								required: true,
							},
							{
								fieldname: 'issue',
								label: 'Issue',
								fieldtype: 'Autocomplete',
								required: true,
							},
							{
								fieldname: 'due_date',
								label: 'Due Date',
								fieldtype: 'Date',
							},
							{
								fieldname: 'assigned_date',
								label: 'Assigned Date',
								fieldtype: 'Date',
								readonly: true,
							},
							{
								fieldname: 'assigned_by',
								label: 'Assigned By',
								fieldtype: 'Autocomplete',
							},
							{
								fieldname: 'completed_date',
								label: 'Completed Date',
								fieldtype: 'Date',
								readonly: true,
							},
						],
					},
					{
						name: 'user',
						fields: [
							{
								fieldname: 'username',
								label: 'Username',
								fieldtype: 'Data',
								required: true,
							},
							{
								fieldname: 'first_name',
								label: 'First Name',
								fieldtype: 'Data',
								required: true,
							},
							{
								fieldname: 'last_name',
								label: 'Last Name',
								fieldtype: 'Data',
							},
							{
								fieldname: 'email',
								label: 'Email Address',
								fieldtype: 'Data',
								required: true,
							},
						],
					},
				],
				actions: [
					{
						name: 'issue',
						actions: [
							{
								event_name: 'LOAD',
								callback: [
									(() => {
										console.log('load issue')
									}).toString(),
									(() => {
										console.log('load issue side effect')
									}).toString(),
								],
							},
							{
								event_name: 'SAVE',
								callback: [
									(() => {
										console.log('save issue')
									}).toString(),
									(() => {
										console.log('after save issue')
									}).toString(),
								],
							},
						],
					},
					{
						name: 'assignment',
						actions: [
							{
								event_name: 'LOAD',
								callback: [
									(() => {
										console.log('load todo')
									}).toString(),
									(() => {
										console.log('load todo side effect')
									}).toString(),
								],
							},
							{
								event_name: 'SAVE',
								callback: [
									(() => {
										console.log('save todo')
									}).toString(),
									(() => {
										console.log('after save todo')
									}).toString(),
								],
							},
						],
					},
					{
						name: 'user',
						actions: [
							{
								event_name: 'LOAD',
								callback: [
									(() => {
										console.log('load user')
									}).toString(),
									(() => {
										console.log('load user side effect')
									}).toString(),
								],
							},
							{
								event_name: 'SAVE',
								callback: [
									(() => {
										console.log('save user')
									}).toString(),
									(() => {
										console.log('after save user')
									}).toString(),
								],
							},
						],
					},
				],
			})
		},

		routes() {
			this.namespace = 'api'

			this.get('/doctypes', schema => {
				return schema.all('doctype')
			})

			this.get('/issue', schema => {
				return schema.all('issue')
			})

			this.get('/assignment', schema => {
				return schema.all('assignment')
			})

			this.get('/user', schema => {
				return schema.all('user')
			})

			this.get('/load_state_machine', (schema, request) => {
				const doctype = request.queryParams.doctype?.toString().toLowerCase()
				const machine = schema.db.stateMachines.findBy({ name: doctype })
				return machine
					? machine
					: new Response(400, { some: 'Not Found' }, { errors: ['StateMachine for Doctype not found'] })
			})

			this.get('/load_meta', (schema, request) => {
				const doctype = request.queryParams.doctype?.toString().toLowerCase()
				const meta = schema.db.meta.findBy({ name: doctype })
				return meta
					? meta.fields
					: new Response(400, { some: 'Not Found' }, { errors: ['Metadata for Doctype not found'] })
			})

			this.get('/load_actions', (schema, request) => {
				const doctype = request.queryParams.doctype?.toString().toLowerCase()
				const actions = schema.db.actions.findBy({ name: doctype })
				return actions
					? actions.actions
					: new Response(400, { some: 'Not Found' }, { errors: ['Actions for Doctype not found'] })
			})

			this.get('/load_layout', (schema, request) => {
				const doctype = request.queryParams.doctype?.toString().toLowerCase()
				const machine = schema.db.stateMachines.findBy({ name: doctype })
				return machine
					? machine.layout
					: new Response(400, { some: 'Not Found' }, { errors: ['Layout for Doctype not found'] })
			})

			this.patch('/save_machine', (schema, request) => {
				const { doctype, machine } = JSON.parse(request.requestBody)
				const existing = schema.db.stateMachines.findBy({ name: doctype?.toString().toLowerCase() })
				if (!existing) {
					return new Response(400, {}, { errors: ['StateMachine for Doctype not found'] })
				}
				schema.db.stateMachines.update(existing.id, { machine })
				return new Response(200)
			})

			this.post('/save_layout', (schema, request) => {
				const { doctype, layout } = JSON.parse(request.requestBody)
				const machine = schema.db.stateMachines.findBy({ name: doctype?.toString().toLowerCase() })
				if (!machine) {
					return new Response(400, {}, { errors: ['StateMachine for Doctype not found'] })
				}
				schema.db.stateMachines.update(machine.id, { layout })
				return new Response(200)
			})
		},
	})

	return server
}
