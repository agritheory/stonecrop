// src/server.js
import { createServer, Model, Response } from 'miragejs'

export function makeServer({ environment = 'development' } = {}) {
	let server = createServer({
		environment,

		models: {
			'Sales Order': Model.extend(),
			'Sales Invoice': Model.extend(),
			meta: Model.extend(),
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
					return doctypeMeta.attrs
				} else {
					return new Response(400, { some: 'Not Found' }, { errors: ['Metadata for Doctype not found'] })
				}
			})
		},
	})
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
	})
	return server
}
