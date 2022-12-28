// src/server.js
import { createServer, Model, Response } from 'miragejs'

export function makeServer({ environment = 'development' } = {}) {
	let server = createServer({
		environment,

		models: {
			doctype: Model,
			hook: Model,
			meta: Model,
			issue: Model,
			todo: Model,
			stateMachine: Model,
		},

		seeds(server) {
			server.db.loadData({
				doctypes: [{ name: 'Issue' }, { name: 'Todo' }],
				stateMachines: [
					{
						name: 'Issue',
						machine: {
							id: 'Issue',
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
										SUBMIT: 'Submitted',
									},
								},
								Submitted: {
									on: {
										CANCEL: 'Cancelled',
									},
								},
								Cancelled: {
									type: 'final',
								},
							},
						},
						layout: {
							New: {
								position: { x: 50, y: 50 },
							},
							Draft: {
								position: { x: 300, y: 50 },
							},
							Submitted: {
								position: { x: 550, y: 50 },
							},
							Cancelled: {
								position: { x: 800, y: 50 },
							},
						},
					},
					{
						name: 'Todo',
						machine: {
							id: 'Todo',
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
										SUBMIT: 'Submitted',
									},
								},
								Submitted: {
									on: {
										CANCEL: 'Cancelled',
									},
								},
								Cancelled: {
									type: 'final',
								},
							},
						},
						layout: {
							New: {
								position: { x: 50, y: 50 },
							},
							Draft: {
								position: { x: 300, y: 50 },
							},
							Submitted: {
								position: { x: 550, y: 50 },
							},
							Cancelled: {
								position: { x: 800, y: 50 },
							},
						},
					},
				],
				meta: [
					{
						name: 'Issue',
						fields: [
							{
								id: 'status',
								label: 'Status',
								type: 'Select',
							},
							{
								id: 'subject',
								label: 'Subject',
								type: 'Data',
							},
							{
								id: 'description',
								label: 'Description',
								type: 'Long Text',
							},
						],
					},
					{
						name: 'Todo',
						fields: [
							{
								id: 'password',
								label: 'Enter a new password',
								type: 'password',
							},
							{
								id: 'password_confirm',
								label: 'Confirm your password',
								type: 'password',
							},
							{
								label: 'Change password',
								type: 'submit',
							},
						],
					},
				],
				hooks: [
					{
						name: 'Issue',
						side_effects: [
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
						name: 'Todo',
						side_effects: [
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

			this.get('/todo', schema => {
				return schema.all('todo')
			})

			this.get('/load_state_machine', (schema, request) => {
				let machine = schema.stateMachines.findBy({ name: request.queryParams.doctype })
				return machine
					? machine.attrs
					: new Response(400, { some: 'Not Found' }, { errors: ['StateMachine for Doctype not found'] })
			})

			this.get('/load_meta', (schema, request) => {
				let meta = schema.meta.findBy({ name: request.queryParams.doctype })
				return meta
					? meta.attrs.fields
					: new Response(400, { some: 'Not Found' }, { errors: ['Metadata for Doctype not found'] })
			})

			this.get('/load_side_effects', (schema, request) => {
				let hooks = schema.hooks.findBy({ name: request.queryParams.doctype })
				return hooks
					? hooks.attrs.side_effects
					: new Response(400, { some: 'Not Found' }, { errors: ['Hooks for Doctype not found'] })
			})
		},
	})

	return server
}
