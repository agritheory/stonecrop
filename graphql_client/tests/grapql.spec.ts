import { gql, request } from 'graphql-request'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import { Query } from '../src/index'
import { makeServer } from './server'

describe('query definition', () => {
	let server: ReturnType<typeof makeServer>

	beforeEach(() => {
		server = makeServer()
	})

	afterEach(() => {
		server.shutdown()
	})

	it('query is defined', async () => {
		const data = await Query()
		expect(data).toBeDefined()
	})

	it('example query', async () => {
		const query = gql`
			query Doctype($id: id) {
				doctype(id: $id) {
					id
					name
					workflow
					schema
					actions
				}
			}
		`

		const id = 'Issue'
		const data = await request('/graphql', query, { id })
		console.log('data', data)
	})
})
