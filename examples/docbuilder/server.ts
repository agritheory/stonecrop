// src/server.js
import { createServer, Model, Response } from 'miragejs'

export function makeServer({ environment = 'development' } = {}) {
	let server = createServer({
		environment,

		models: {
			hook: Model,
			meta: Model,
			'Sales Order': Model,
			'Sales Invoice': Model,
		},

		seeds(server) {
			server.db.loadData({
				meta: [
					{
						name: 'Sales Order',
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
						name: 'Sales Invoice',
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
						name: 'Sales Order',
						side_effects: [
							{
								event_name: 'LOAD',
								callback: [
									(() => {
										console.log('load event')
									}).toString(),
									(() => {
										console.log('load event side effect')
									}).toString(),
								],
							},
							{
								event_name: 'SAVE',
								callback: [
									(() => {
										console.log('save event')
									}).toString(),
									(() => {
										console.log('after save event')
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

			this.get('/Sales Order', schema => {
				return schema['Sales Order'].all()
			})

			this.get('/Sales Invoice', schema => {
				return schema['Sales Invoice'].all()
			})

			this.get('/load_meta', (schema, request) => {
				let doctypeMeta = schema.meta.findBy({ name: request.queryParams.doctype })
				if (doctypeMeta) {
					return doctypeMeta.attrs.fields
				} else {
					return new Response(400, { some: 'Not Found' }, { errors: ['Metadata for Doctype not found'] })
				}
			})

			this.get('/load_side_effects', (schema, request) => {
				let doctypeHooks = schema.hooks.findBy({ name: request.queryParams.doctype })
				if (doctypeHooks) {
					return doctypeHooks.attrs.side_effects
				} else {
					return new Response(400, { some: 'Not Found' }, { errors: ['Hooks for Doctype not found'] })
				}
			})
		},
	})

	return server
}
