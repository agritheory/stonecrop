import { describe, it, expect, vi } from 'vitest'

import { executeClientHandler } from '../../src/client-handler'

describe('executeClientHandler', { tags: ['unit'] }, () => {
	it('executes a plain body and returns its value', async () => {
		await expect(executeClientHandler('return 1 + 2')).resolves.toBe(3)
	})

	it('runs with no api map', async () => {
		await expect(executeClientHandler('return 42')).resolves.toBe(42)
	})

	it('binds each api key as a named parameter', async () => {
		await expect(executeClientHandler('return foo + bar', { foo: 2, bar: 3 })).resolves.toBe(5)
	})

	it('awaits async work inside the body', async () => {
		const order: string[] = []
		const slow = async () => {
			order.push('ran')
			return 'value'
		}
		const result = await executeClientHandler("const v = await slow(); order.push('after'); return v", {
			slow,
			order,
		})
		expect(result).toBe('value')
		expect(order).toEqual(['ran', 'after'])
	})

	it('injects runAction and forwards author-supplied args (the dispatch example)', async () => {
		const runAction = vi.fn(async () => {})
		await executeClientHandler("await runAction('Assign', [record.id])", {
			runAction,
			record: { id: 'r1' },
		})
		expect(runAction).toHaveBeenCalledWith('Assign', ['r1'])
	})

	it('injects router and runs a navigation handler (the navigation example)', async () => {
		const push = vi.fn()
		await executeClientHandler("router.push('/users')", { router: { push } })
		expect(push).toHaveBeenCalledWith('/users')
	})

	it('rejects when the body throws at runtime', async () => {
		await expect(executeClientHandler("throw new Error('boom')")).rejects.toThrow('boom')
	})

	it('rejects (does not synchronously throw) on a syntax error', async () => {
		await expect(executeClientHandler('return 1 +')).rejects.toBeInstanceOf(SyntaxError)
	})
})
