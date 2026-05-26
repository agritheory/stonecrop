import { describe, it, expect, vi, afterEach } from 'vitest'

// Capture the rules object that createDebugPlugin passes to wrapPlans so we can
// invoke the plan wrappers directly and verify console.log + return-value behaviour.
vi.mock('postgraphile/utils', () => ({
	wrapPlans: (rules: Record<string, Record<string, { plan: (plan: () => unknown) => unknown }>>) => ({
		__rules: rules,
	}),
}))

import { createDebugPlugin } from '../src/debug'

function getPlanWrapper(
	options: Parameters<typeof createDebugPlugin>[0],
	typeName: string,
	fieldName: string
): (plan: () => unknown) => unknown {
	const plugin = createDebugPlugin(options) as any
	return plugin.__rules[typeName][fieldName].plan
}

describe('createDebugPlugin', { tags: ['unit', 'graphql'] }, () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	// ---------------------------------------------------------------------------
	// Plugin structure
	// ---------------------------------------------------------------------------

	it('wraps all expected Stonecrop query fields', () => {
		const plugin = createDebugPlugin() as any
		expect(plugin.__rules.Query.stonecropRecord).toBeDefined()
		expect(plugin.__rules.Query.stonecropRecords).toBeDefined()
		expect(plugin.__rules.Query.stonecropMeta).toBeDefined()
		expect(plugin.__rules.Query.stonecropAllMeta).toBeDefined()
	})

	it('wraps the stonecropAction mutation field', () => {
		const plugin = createDebugPlugin() as any
		expect(plugin.__rules.Mutation.stonecropAction).toBeDefined()
	})

	// ---------------------------------------------------------------------------
	// logPlans behaviour (default: true)
	// ---------------------------------------------------------------------------

	it('logs a plan-building message when logPlans is true (default)', () => {
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
		const wrapper = getPlanWrapper({}, 'Query', 'stonecropRecord')
		wrapper(() => 'x')
		expect(spy).toHaveBeenCalledOnce()
		expect(spy.mock.calls[0][0]).toMatch(/Building plan for Query\.stonecropRecord/)
	})

	it('log message includes the [@stonecrop/graphql-middleware] prefix', () => {
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
		const wrapper = getPlanWrapper({}, 'Query', 'stonecropRecord')
		wrapper(() => 'x')
		expect(spy.mock.calls[0][0]).toContain('[@stonecrop/graphql-middleware]')
	})

	it('does not call console.log when logPlans is false', () => {
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
		const wrapper = getPlanWrapper({ logPlans: false }, 'Query', 'stonecropRecord')
		wrapper(() => 'x')
		expect(spy).not.toHaveBeenCalled()
	})

	it('includes the correct field name in the log message', () => {
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
		const wrapper = getPlanWrapper({}, 'Mutation', 'stonecropAction')
		wrapper(() => 'x')
		expect(spy.mock.calls[0][0]).toContain('stonecropAction')
		expect(spy.mock.calls[0][0]).toContain('Mutation')
	})

	// ---------------------------------------------------------------------------
	// Plan callback invocation and return value
	// ---------------------------------------------------------------------------

	it('invokes the plan callback exactly once', () => {
		const mockPlan = vi.fn(() => 'sentinel')
		const wrapper = getPlanWrapper({ logPlans: false }, 'Query', 'stonecropRecord')
		wrapper(mockPlan)
		expect(mockPlan).toHaveBeenCalledOnce()
	})

	it('returns the value produced by the plan callback', () => {
		const expected = { step: true }
		const wrapper = getPlanWrapper({ logPlans: false }, 'Query', 'stonecropRecord')
		const result = wrapper(() => expected)
		expect(result).toBe(expected)
	})

	// ---------------------------------------------------------------------------
	// logTiming behaviour (default: false)
	// ---------------------------------------------------------------------------

	it('does not log a second timing message when logTiming is false (default)', () => {
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
		const wrapper = getPlanWrapper({}, 'Query', 'stonecropRecord')
		wrapper(() => 'x')
		expect(spy).toHaveBeenCalledOnce()
	})

	it('logs a timing message after the plan when logTiming is true', () => {
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
		const wrapper = getPlanWrapper({ logTiming: true }, 'Query', 'stonecropRecord')
		wrapper(() => 'x')
		expect(spy).toHaveBeenCalledTimes(2)
		expect(spy.mock.calls[1][0]).toMatch(/Plan built for Query\.stonecropRecord in \d+ms/)
	})

	it('timing message includes the [@stonecrop/graphql-middleware] prefix', () => {
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
		const wrapper = getPlanWrapper({ logTiming: true }, 'Query', 'stonecropRecord')
		wrapper(() => 'x')
		expect(spy.mock.calls[1][0]).toContain('[@stonecrop/graphql-middleware]')
	})

	it('logs nothing at all when both logPlans and logTiming are false', () => {
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
		const wrapper = getPlanWrapper({ logPlans: false, logTiming: false }, 'Query', 'stonecropRecord')
		wrapper(() => 'x')
		expect(spy).not.toHaveBeenCalled()
	})

	it('still returns the plan result when logTiming is true', () => {
		vi.spyOn(console, 'log').mockImplementation(() => {})
		const expected = { step: true }
		const wrapper = getPlanWrapper({ logTiming: true }, 'Query', 'stonecropRecord')
		const result = wrapper(() => expected)
		expect(result).toBe(expected)
	})
})
