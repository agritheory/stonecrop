import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
	registerFetchHandler,
	getFetchHandler,
	clearFetchHandlers,
	type FetchHandler,
} from '../src/registry/fetchHandlers'
import { clearHandlers } from '../src/registry/actions'

describe('fetch handler registry', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => {
		clearFetchHandlers()
	})

	afterEach(() => {
		clearFetchHandlers()
	})

	it('returns undefined for an unregistered name', () => {
		expect(getFetchHandler('nonexistent')).toBeUndefined()
	})

	it('stores and retrieves a handler by name', () => {
		const handler: FetchHandler = async () => []
		registerFetchHandler('myHandler', handler)
		expect(getFetchHandler('myHandler')).toBe(handler)
	})

	it('overwrites an existing handler with the same name', () => {
		const first: FetchHandler = async () => []
		const second: FetchHandler = async () => ({ id: '1' })
		registerFetchHandler('dupe', first)
		registerFetchHandler('dupe', second)
		expect(getFetchHandler('dupe')).toBe(second)
	})

	it('stores multiple handlers under distinct names without conflict', () => {
		const a: FetchHandler = async () => []
		const b: FetchHandler = async () => []
		registerFetchHandler('handlerA', a)
		registerFetchHandler('handlerB', b)
		expect(getFetchHandler('handlerA')).toBe(a)
		expect(getFetchHandler('handlerB')).toBe(b)
	})

	it('does not share entries with the action handler registry', () => {
		const handler: FetchHandler = async () => []
		registerFetchHandler('sharedName', handler)
		// clearHandlers wipes only the action registry — fetch registry is unaffected
		clearHandlers()
		expect(getFetchHandler('sharedName')).toBe(handler)
	})

	it('clearFetchHandlers removes all entries', () => {
		registerFetchHandler('x', async () => [])
		registerFetchHandler('y', async () => [])
		clearFetchHandlers()
		expect(getFetchHandler('x')).toBeUndefined()
		expect(getFetchHandler('y')).toBeUndefined()
	})
})
