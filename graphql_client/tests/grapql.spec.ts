import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import { makeServer } from './server'

describe('query definition', () => {
	let server: ReturnType<typeof makeServer>

	beforeEach(() => {
		server = makeServer()
	})

	afterEach(() => {
		server.shutdown()
	})

	// TODO: test the query definition
})
