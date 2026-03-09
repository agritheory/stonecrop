import type { DoctypeMeta } from '@stonecrop/schema'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { registerWriteHandlers } from '../src/plugin/postgraphile'
import { clearHandlers, hasHandler, getHandler, registerHandler } from '../src/registry/actions'
import type { ActionHandler } from '../src/types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const scalarOnlyMeta: DoctypeMeta = {
	name: 'Resource',
	tableName: 'resources',
	fields: [
		{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
		{ fieldname: 'name', fieldtype: 'Data', label: 'Name' },
		{ fieldname: 'quantity', fieldtype: 'Int', label: 'Quantity' },
		{ fieldname: 'is_active', fieldtype: 'Check', label: 'Active' },
	],
}

// ===========================================================================
// registerWriteHandlers
// ===========================================================================

describe('registerWriteHandlers', () => {
	beforeEach(() => {
		clearHandlers()
	})

	it('registers create, update, and delete handlers', () => {
		registerWriteHandlers()
		expect(hasHandler('create')).toBe(true)
		expect(hasHandler('update')).toBe(true)
		expect(hasHandler('delete')).toBe(true)
	})

	it('does not register handlers for other action names', () => {
		registerWriteHandlers()
		expect(hasHandler('submit')).toBe(false)
		expect(hasHandler('approve')).toBe(false)
	})

	it('registered create handler is callable', async () => {
		registerWriteHandlers()
		const handler = getHandler('create')
		expect(handler).toBeDefined()
		expect(typeof handler).toBe('function')
	})

	it('registered update handler is callable', async () => {
		registerWriteHandlers()
		const handler = getHandler('update')
		expect(handler).toBeDefined()
		expect(typeof handler).toBe('function')
	})

	it('registered delete handler is callable', async () => {
		registerWriteHandlers()
		const handler = getHandler('delete')
		expect(handler).toBeDefined()
		expect(typeof handler).toBe('function')
	})

	it('re-registers handlers on repeated calls without error', () => {
		registerWriteHandlers()
		expect(() => registerWriteHandlers()).not.toThrow()
		expect(hasHandler('create')).toBe(true)
	})
})

// ===========================================================================
// Custom handler patterns
// ===========================================================================

describe('overriding a built-in write handler', () => {
	beforeEach(() => {
		clearHandlers()
		registerWriteHandlers()
	})

	it('allows a custom handler to replace the built-in create handler', () => {
		const customCreate: ActionHandler = vi.fn().mockResolvedValue({ success: true, data: { id: '99' }, error: null })
		registerHandler('create', customCreate)
		const handler = getHandler('create')
		expect(handler).toBe(customCreate)
	})

	it('calls the custom handler instead of the built-in when the action runs', async () => {
		const customCreate: ActionHandler = vi.fn().mockResolvedValue({ success: true, data: { id: '99' }, error: null })
		registerHandler('create', customCreate)
		const handler = getHandler('create')!
		const mockExecutor = { query: vi.fn(), mutate: vi.fn() }
		const result = await handler([{ name: 'Override Test' }], { doctype: scalarOnlyMeta, executor: mockExecutor })
		expect(customCreate).toHaveBeenCalledWith([{ name: 'Override Test' }], {
			doctype: scalarOnlyMeta,
			executor: mockExecutor,
		})
		expect(result).toMatchObject({ success: true, data: { id: '99' } })
	})
})

describe('wrapping a built-in write handler', () => {
	beforeEach(() => {
		clearHandlers()
		registerWriteHandlers()
	})

	it('allows a wrapper to call through to the built-in handler', async () => {
		const original = getHandler('update')!
		const calls: string[] = []
		const mockExecutor = { query: vi.fn(), mutate: vi.fn().mockResolvedValue({}) }

		const wrapper: ActionHandler = vi.fn().mockImplementation(async (args, context) => {
			calls.push('before')
			const result = await original(args, context)
			calls.push('after')
			return result
		})

		registerHandler('update', wrapper)
		await wrapper(['1', { name: 'Wrapped' }], { doctype: scalarOnlyMeta, executor: mockExecutor })

		expect(calls).toContain('before')
	})

	it('receives the same arguments as the original handler', async () => {
		const original = getHandler('delete')!
		const spy = vi.fn().mockImplementation(original)
		registerHandler('delete', spy)

		const handler = getHandler('delete')!
		const mockExecutor = { query: vi.fn(), mutate: vi.fn().mockResolvedValue({}) }
		await handler(['rec-42'], { doctype: scalarOnlyMeta, executor: mockExecutor })

		expect(spy).toHaveBeenCalledWith(['rec-42'], { doctype: scalarOnlyMeta, executor: mockExecutor })
	})
})

describe('workflow action definition routes to a named custom handler', () => {
	beforeEach(() => {
		clearHandlers()
		registerWriteHandlers()
	})

	it('a named handler can be registered independently of built-in actions', () => {
		const approveHandler: ActionHandler = vi.fn().mockResolvedValue({ success: true, data: null, error: null })
		registerHandler('approve', approveHandler)
		expect(hasHandler('approve')).toBe(true)
		expect(getHandler('approve')).toBe(approveHandler)
	})

	it('a named handler is called with the correct arguments', async () => {
		const submitHandler: ActionHandler = vi
			.fn()
			.mockResolvedValue({ success: true, data: { status: 'submitted' }, error: null })
		registerHandler('submit', submitHandler)

		const handler = getHandler('submit')!
		const mockExecutor = { query: vi.fn(), mutate: vi.fn() }
		const result = await handler(['doc-1'], { doctype: scalarOnlyMeta, executor: mockExecutor })
		expect(submitHandler).toHaveBeenCalledWith(['doc-1'], { doctype: scalarOnlyMeta, executor: mockExecutor })
		expect(result).toMatchObject({ success: true, data: { status: 'submitted' } })
	})

	it('different workflow actions can have independent handlers', () => {
		const approveHandler: ActionHandler = vi.fn()
		const rejectHandler: ActionHandler = vi.fn()
		registerHandler('approve', approveHandler)
		registerHandler('reject', rejectHandler)

		expect(getHandler('approve')).toBe(approveHandler)
		expect(getHandler('reject')).toBe(rejectHandler)
		expect(getHandler('approve')).not.toBe(rejectHandler)
	})
})
