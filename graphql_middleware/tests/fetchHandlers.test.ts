import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
	registerFetchHandler,
	getFetchHandler,
	clearFetchHandlers,
	type FetchHandler,
} from '../src/registry/fetchHandlers'

const handlerStoresAndRetrieves: FetchHandler = async () => []
const firstHandler: FetchHandler = async () => []
const secondHandler: FetchHandler = async () => ({ id: '1' })
const handlerA: FetchHandler = async () => []
const handlerB: FetchHandler = async () => []

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
		registerFetchHandler('myHandler', handlerStoresAndRetrieves)
		expect(getFetchHandler('myHandler')).toBe(handlerStoresAndRetrieves)
	})

	it('overwrites an existing handler with the same name', () => {
		registerFetchHandler('dupe', firstHandler)
		registerFetchHandler('dupe', secondHandler)
		expect(getFetchHandler('dupe')).toBe(secondHandler)
	})

	it('stores multiple handlers under distinct names without conflict', () => {
		registerFetchHandler('handlerA', handlerA)
		registerFetchHandler('handlerB', handlerB)
		expect(getFetchHandler('handlerA')).toBe(handlerA)
		expect(getFetchHandler('handlerB')).toBe(handlerB)
	})

	it('clearFetchHandlers removes all entries', () => {
		registerFetchHandler('x', async () => [])
		registerFetchHandler('y', async () => [])
		clearFetchHandlers()
		expect(getFetchHandler('x')).toBeUndefined()
		expect(getFetchHandler('y')).toBeUndefined()
	})
})
