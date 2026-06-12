import type { DoctypeMeta } from '@stonecrop/schema'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { clearHandlers, hasHandler, getHandler, registerHandler } from '../src/registry/actions'
import type { ActionHandler } from '../src/types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const scalarOnlyMeta: DoctypeMeta = {
	name: 'Resource',
	fields: [
		{ kind: 'field', fieldname: 'id', fieldtype: 'PrimaryKey', label: 'ID' },
		{ kind: 'field', fieldname: 'name', fieldtype: 'Data', label: 'Name' },
		{ kind: 'field', fieldname: 'quantity', fieldtype: 'Int', label: 'Quantity' },
		{ kind: 'field', fieldname: 'is_active', fieldtype: 'Check', label: 'Active' },
	],
}

// ===========================================================================
// handler registration
// ===========================================================================

describe('handler registration', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => {
		clearHandlers()
	})

	it('registers and retrieves a handler by name', () => {
		const handler: ActionHandler = vi.fn()
		registerHandler('submit', handler)
		expect(getHandler('submit')).toBe(handler)
	})

	it('hasHandler returns true after registration', () => {
		registerHandler('approve', vi.fn())
		expect(hasHandler('approve')).toBe(true)
	})

	it('hasHandler returns false for unregistered names', () => {
		expect(hasHandler('nonexistent')).toBe(false)
	})

	it('clearHandlers removes all registered handlers', () => {
		registerHandler('submit', vi.fn())
		registerHandler('approve', vi.fn())
		clearHandlers()
		expect(hasHandler('submit')).toBe(false)
		expect(hasHandler('approve')).toBe(false)
	})

	it('re-registering the same name replaces the previous handler', () => {
		const first: ActionHandler = vi.fn()
		const second: ActionHandler = vi.fn()
		registerHandler('submit', first)
		registerHandler('submit', second)
		expect(getHandler('submit')).toBe(second)
		expect(getHandler('submit')).not.toBe(first)
	})

	it('getHandler returns undefined for unregistered names', () => {
		expect(getHandler('nonexistent')).toBeUndefined()
	})
})

// ===========================================================================
// Custom handler patterns
// ===========================================================================

describe('overriding a registered handler', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => {
		clearHandlers()
		registerHandler('submit', vi.fn().mockResolvedValue({ success: true, data: null, error: null }))
	})

	it('allows a custom handler to replace an existing handler', () => {
		const customHandler: ActionHandler = vi.fn().mockResolvedValue({ success: true, data: { id: '99' }, error: null })
		registerHandler('submit', customHandler)
		const handler = getHandler('submit')
		expect(handler).toBe(customHandler)
	})

	it('calls the replacement handler instead of the original when the action runs', async () => {
		const override: ActionHandler = vi.fn().mockResolvedValue({ success: true, data: { id: '99' }, error: null })
		registerHandler('submit', override)
		const handler = getHandler('submit')!
		const mockExecutor = { query: vi.fn(), mutate: vi.fn() }
		const result = await handler([{ name: 'Override Test' }], { doctype: scalarOnlyMeta, executor: mockExecutor })
		expect(override).toHaveBeenCalledWith([{ name: 'Override Test' }], {
			doctype: scalarOnlyMeta,
			executor: mockExecutor,
		})
		expect(result).toMatchObject({ success: true, data: { id: '99' } })
	})
})

describe('wrapping a registered handler', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => {
		clearHandlers()
	})

	it('allows a wrapper to call through to the original handler', async () => {
		const original: ActionHandler = vi.fn().mockResolvedValue({ ok: true })
		registerHandler('approve', original)
		const capturedOriginal = getHandler('approve')!
		const calls: string[] = []
		const mockExecutor = { query: vi.fn(), mutate: vi.fn() }

		const wrapper: ActionHandler = vi.fn().mockImplementation(async (args, context) => {
			calls.push('before')
			const result = await capturedOriginal(args, context)
			calls.push('after')
			return result
		})

		registerHandler('approve', wrapper)
		await getHandler('approve')!(['arg1'], { doctype: scalarOnlyMeta, executor: mockExecutor })

		expect(calls).toContain('before')
	})

	it('receives the same arguments as the original handler', async () => {
		const original: ActionHandler = vi.fn().mockResolvedValue({ ok: true })
		registerHandler('process', original)
		const capturedOriginal = getHandler('process')!
		const spy = vi.fn().mockImplementation(capturedOriginal)
		registerHandler('process', spy)

		const handler = getHandler('process')!
		const mockExecutor = { query: vi.fn(), mutate: vi.fn() }
		await handler(['rec-42'], { doctype: scalarOnlyMeta, executor: mockExecutor })

		expect(spy).toHaveBeenCalledWith(['rec-42'], { doctype: scalarOnlyMeta, executor: mockExecutor })
	})
})

describe('workflow action definition routes to a named custom handler', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => {
		clearHandlers()
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
