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
		},

		seeds(server) {
			server.db.loadData({
				doctypes: [{ name: 'Issue' }, { name: 'Todo' }],
				meta: [
					{
						name: 'Issue',
						fields: [
							{
								type: 'submit',
								label: 'Change password',
							},
							{
								type: 'password',
								name: 'password_confirm',
								label: 'Confirm your password',
								validation: '^required|confirm:password',
								validationName: 'Password confirmation',
							},
							{
								type: 'password',
								name: 'password',
								label: 'Enter a new password',
								validation: 'required',
							},
						],
					},
					{
						name: 'Todo',
						fields: [
							{
								type: 'password',
								name: 'password',
								label: 'Enter a new password',
								validation: 'required',
							},
							{
								type: 'password',
								name: 'password_confirm',
								label: 'Confirm your password',
								validation: '^required|confirm:password',
								validationName: 'Password confirmation',
							},
							{
								type: 'submit',
								label: 'Change password',
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