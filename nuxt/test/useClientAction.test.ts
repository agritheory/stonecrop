// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'

// `vi.mock`/`vi.hoisted` below are hoisted above this import at runtime, so the composable
// still loads with the mocked `useStonecrop`/`useRouter`.
import { useClientAction } from '../src/runtime/app/composables/useClientAction'

// Shared holders the mocks read from; set per-test.
const { mocks } = vi.hoisted(() => ({ mocks: { sc: null as any, router: null as any } }))

// Keep the real module (so the REAL `executeClientHandler` runs the authored handler
// string) and override only `useStonecrop` to hand back our fake instance.
vi.mock('@stonecrop/stonecrop', async importOriginal => {
	const actual = await importOriginal<typeof import('@stonecrop/stonecrop')>()
	return { ...actual, useStonecrop: () => ({ stonecrop: { value: mocks.sc } }) }
})
// Keep real vue-router; override only `useRouter` (the composable's `router` capability).
vi.mock('vue-router', async importOriginal => {
	const actual = await importOriginal<typeof import('vue-router')>()
	return { ...actual, useRouter: () => mocks.router }
})

type Actions = Record<string, { clientHandler?: string }>

function makeRouter() {
	return { push: vi.fn(), replace: vi.fn(), back: vi.fn(), forward: vi.fn() }
}

function makeSc(opts: { actions?: Actions; record?: Record<string, unknown>; client?: unknown; dispatch?: any } = {}) {
	const doctype = {
		name: 'User',
		slug: 'user',
		workflow: { states: ['active', 'assigned'], actions: opts.actions ?? {} },
	}
	return {
		_doctype: doctype,
		registry: { getDoctype: vi.fn(() => doctype) },
		dispatchAction:
			opts.dispatch ?? vi.fn(async () => ({ success: true, data: { id: 'r1', status: 'assigned' }, error: null })),
		addRecord: vi.fn(),
		getRecordById: vi.fn(() => ({ get: () => opts.record ?? {} })),
		getClient: vi.fn(() => opts.client),
	}
}

const payload = (name: string) => ({ name, doctype: 'user', recordId: 'r1', data: { id: 'r1', title: 'x' } })

afterEach(() => {
	vi.clearAllMocks()
	mocks.sc = null
	mocks.router = null
})

describe('useClientAction', { tags: ['unit'] }, () => {
	it('dispatches to the server handler and writes the result back to HST when no clientHandler', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({ actions: { Activate: {} } })

		await useClientAction().run(payload('Activate'))

		expect(mocks.sc.dispatchAction).toHaveBeenCalledTimes(1)
		expect(mocks.sc.dispatchAction).toHaveBeenCalledWith(mocks.sc._doctype, 'Activate', [
			{ id: 'r1', data: { id: 'r1', title: 'x' } },
		])
		expect(mocks.sc.addRecord).toHaveBeenCalledWith('user', 'r1', { id: 'r1', status: 'assigned' })
	})

	it('runs a navigation clientHandler and does NOT dispatch (supersede)', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({ actions: { Goto: { clientHandler: "router.push('/users')" } } })

		await useClientAction().run(payload('Goto'))

		expect(mocks.router.push).toHaveBeenCalledWith('/users')
		expect(mocks.sc.dispatchAction).not.toHaveBeenCalled()
		expect(mocks.sc.addRecord).not.toHaveBeenCalled()
	})

	it('clientHandler runAction dispatches with the [{id,data}] envelope and merges extra args', async () => {
		mocks.router = makeRouter()
		// Clicked action is 'Process' but the handler dispatches 'Assign' — proves supersede:
		// only the handler's dispatch fires, the clicked action is not auto-dispatched.
		mocks.sc = makeSc({ actions: { Process: { clientHandler: "await runAction('Assign', { priority: 'high' })" } } })

		await useClientAction().run(payload('Process'))

		expect(mocks.sc.dispatchAction).toHaveBeenCalledTimes(1)
		expect(mocks.sc.dispatchAction).toHaveBeenCalledWith(mocks.sc._doctype, 'Assign', [
			{ id: 'r1', data: { id: 'r1', title: 'x' }, priority: 'high' },
		])
		expect(mocks.sc.addRecord).toHaveBeenCalledWith('user', 'r1', { id: 'r1', status: 'assigned' })
	})

	it('injects the live HST record into the clientHandler', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { Tag: { clientHandler: "await runAction('Assign', { who: record.owner })" } },
			record: { owner: 'alice' },
		})

		await useClientAction().run(payload('Tag'))

		expect(mocks.sc.dispatchAction).toHaveBeenCalledWith(mocks.sc._doctype, 'Assign', [
			{ id: 'r1', data: { id: 'r1', title: 'x' }, who: 'alice' },
		])
	})

	it('injects read-only graphql.query backed by the data client', async () => {
		const query = vi.fn(async () => ({ me: 1 }))
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { Load: { clientHandler: "await graphql.query('{ me }', { x: 1 })" } },
			client: { query },
		})

		await useClientAction().run(payload('Load'))

		expect(query).toHaveBeenCalledWith('{ me }', { x: 1 })
	})

	it('does not write back when the dispatch fails, and surfaces the error', async () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { Activate: {} },
			dispatch: vi.fn(async () => ({ success: false, data: null, error: 'Handler not registered' })),
		})

		await useClientAction().run(payload('Activate'))

		expect(mocks.sc.dispatchAction).toHaveBeenCalledTimes(1)
		expect(mocks.sc.addRecord).not.toHaveBeenCalled()
		expect(errorSpy).toHaveBeenCalledWith('Action failed:', 'Handler not registered')
		errorSpy.mockRestore()
	})
})
