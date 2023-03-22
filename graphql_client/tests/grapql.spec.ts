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
})
