// src/server.js
import { createServer, Model, Response } from 'miragejs'
import type { AnyStateNodeConfig } from 'xstate'

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
							id: 'Issue',
							initial: 'New',
							context: {
								retries: 0,
							},
							states: {
								New: {
									on: {
										Save: 'Draft',
									},
								},
								Draft: {
									on: {
										Assign: {
											target: 'Assigned',
										},
										Resolve: {
											target: 'Resolved',
										},
									},
								},
								Assigned: {
									on: {
										Resolve: {
											target: 'Resolved',
										},
									},
								},
								Resolved: {
									on: {
										Close: {
											target: 'Closed',
										},
									},
								},
								Closed: {
									on: {
										Reopen: {
											target: 'Draft',
										},
									},
								},
							},
						} as AnyStateNodeConfig,
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
							id: 'Assignment',
							initial: 'New',
							context: {
								retries: 0,
							},
							states: {
								New: {
									on: {
										SAVE: 'Draft',
									},
								},
								Draft: {
									on: {
										COMPLETE: 'Completed',
									},
								},
								Completed: {
									on: {
										CANCEL: 'Cancelled',
									},
								},
								Cancelled: {
									type: 'final',
								},
							},
						} as AnyStateNodeConfig,
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
							id: 'User',
							initial: 'Active',
							states: {
								Active: {
									on: {
										Deactivate: {
											target: 'Inactive',
										},
									},
								},
								Inactive: {
									on: {
										'Re-Activate': {
											target: 'Active',
										},
									},
								},
							},
						} as AnyStateNodeConfig,
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
								id: 'subject',
								label: 'Subject',
								fieldtype: 'Data',
								required: true,
							},
							{
								id: 'description',
								label: 'Description',
								fieldtype: 'Long Text',
								required: true,
							},
							{
								id: 'reported_date',
								label: 'Report Date',
								fieldtype: 'Date',
								read_only: true,
							},
							{
								id: 'assigned_date',
								label: 'Assigned Date',
								fieldtype: 'Date',
								read_only: true,
							},
							{
								id: 'assigned_to',
								label: 'Assigned To',
								fieldtype: 'AutocompleteMultiSelect',
							},
							{
								id: 'resolved_date',
								label: 'Resolved Date',
								fieldtype: 'Date',
								read_only: true,
							},
							{
								id: 'closed_date',
								label: 'Closed Date',
								fieldtype: 'Date',
								read_only: true,
							},
							{
								id: 'resolution',
								label: 'Resolution',
								fieldtype: 'Long Text',
							},
						],
					},
					{
						name: 'assignment',
						fields: [
							{
								id: 'user',
								label: 'User',
								fieldtype: 'Autocomplete',
								required: true,
							},
							{
								id: 'issue',
								label: 'Issue',
								fieldtype: 'Autocomplete',
								required: true,
							},
							{
								id: 'due_date',
								label: 'Due Date',
								fieldtype: 'Date',
							},
							{
								id: 'assigned_date',
								label: 'Assigned Date',
								fieldtype: 'Date',
								read_only: true,
							},
							{
								id: 'assigned_by',
								label: 'Assigned By',
								fieldtype: 'Autocomplete',
							},
							{
								id: 'completed_date',
								label: 'Completed Date',
								fieldtype: 'Date',
								read_only: true,
							},
						],
					},
					{
						name: 'user',
						fields: [
							{
								id: 'username',
								label: 'Username',
								fieldtype: 'Data',
								required: true,
							},
							{
								id: 'first_name',
								label: 'First Name',
								fieldtype: 'Data',
								required: true,
							},
							{
								id: 'last_name',
								label: 'Last Name',
								fieldtype: 'Data',
							},
							{
								id: 'email',
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
				const machine = schema.stateMachines.findBy({ name: doctype })
				return machine
					? machine.attrs
					: new Response(400, { some: 'Not Found' }, { errors: ['StateMachine for Doctype not found'] })
			})

			this.get('/load_meta', (schema, request) => {
				const doctype = request.queryParams.doctype?.toString().toLowerCase()
				const meta = schema.meta.findBy({ name: doctype })
				return meta
					? meta.attrs.fields
					: new Response(400, { some: 'Not Found' }, { errors: ['Metadata for Doctype not found'] })
			})

			this.get('/load_actions', (schema, request) => {
				const doctype = request.queryParams.doctype?.toString().toLowerCase()
				const actions = schema.actions.findBy({ name: doctype })
				return actions
					? actions.attrs.actions
					: new Response(400, { some: 'Not Found' }, { errors: ['Actions for Doctype not found'] })
			})
		},
	})

	return server
}
