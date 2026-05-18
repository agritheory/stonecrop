import { describe, it, expect } from 'vitest'

import { NotImplementedError } from '../../src/exceptions'

describe('NotImplementedError', { tags: ['unit'] }, () => {
	it('creates an error with custom message', () => {
		const message = 'Test method not implemented'
		const error = new (NotImplementedError as any)(message)

		expect(error.message).toBe(message)
		expect(error.name).toBe('NotImplemented')
	})

	it('creates an error with empty message when none provided', () => {
		const error = new (NotImplementedError as any)()

		expect(error.message).toBe('')
		expect(error.name).toBe('NotImplemented')
	})

	it('creates an error with undefined message', () => {
		const error = new (NotImplementedError as any)(undefined)

		expect(error.message).toBe('')
		expect(error.name).toBe('NotImplemented')
	})

	it('has proper prototype chain', () => {
		const error = new (NotImplementedError as any)('test')

		expect(error).toBeInstanceOf(Error)
		expect(error.constructor).toBe(NotImplementedError)
	})

	it('has stack trace', () => {
		const error = new (NotImplementedError as any)('test')

		expect(error.stack).toBeDefined()
		expect(typeof error.stack).toBe('string')
	})
})
