// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { DoctypeField } from '@stonecrop/schema'

// `vi.mock`/`vi.hoisted` below are hoisted above this import at runtime, so the composable
// still loads with the mocked `useStonecrop`/`useRouter`.
import { useClientAction } from '../../src/client-action'
import Doctype from '../../src/doctype'

// Shared holders the mocks read from; set per-test.
const { mocks } = vi.hoisted(() => ({ mocks: { sc: null as any, router: null as any } }))

// Keep the real module (so nothing else that imports it is disturbed) and override only
// `useStonecrop` to hand back our fake instance.
vi.mock('../../src/composables/stonecrop', async importOriginal => {
	const actual = await importOriginal<typeof import('../../src/composables/stonecrop')>()
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

/** A surrogate-keyed doctype: nothing declares `primaryKey`, so identity falls back to `id`. */
const ID_FIELDS: DoctypeField[] = [
	{ kind: 'field', fieldname: 'id', component: 'ATextInput' },
	{ kind: 'field', fieldname: 'title', component: 'ATextInput' },
]

/** A natural-keyed doctype that ALSO carries a surrogate `id` — the shape the strict check exists for. */
const USERNAME_FIELDS: DoctypeField[] = [
	{ kind: 'field', fieldname: 'username', component: 'ATextInput', primaryKey: true },
	{ kind: 'field', fieldname: 'id', component: 'ATextInput' },
]

function makeSc(
	opts: {
		actions?: Actions
		fields?: DoctypeField[]
		record?: Record<string, unknown>
		client?: unknown
		dispatch?: any
	} = {}
) {
	// The real Doctype, not a stand-in: the identity rule under test lives in `getRecordId` and
	// `recordIdField`, and a hand-rolled object would be free to disagree with the class the app
	// actually registers. `label` is required on a declared action, so the cases below name only
	// what they are testing and the action's own key stands in for it.
	const actions = Object.fromEntries(
		Object.entries(opts.actions ?? {}).map(([name, action]) => [name, { label: name, ...action }])
	)
	const doctype = Doctype.fromObject({
		name: 'User',
		fields: opts.fields ?? ID_FIELDS,
		workflow: { states: ['active', 'assigned'], actions },
	})
	return {
		registeredDoctype: doctype,
		registry: { getDoctype: vi.fn(() => doctype) },
		dispatchAction:
			opts.dispatch ?? vi.fn(async () => ({ success: true, data: { id: 'r1', status: 'assigned' }, error: null })),
		addRecord: vi.fn(),
		removeRecord: vi.fn(),
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

// `dispatchAction` is mocked throughout this file, so it cannot observe the store write that now
// lives inside it. That half is covered against a real `Stonecrop` in stonecrop.spec.ts
// ("dispatchAction files the returned record..."). What is asserted here is everything the
// composable still owns: the argument envelope, clientHandler supersede, the stale-key removal
// and route-follow (both need the *dispatched* id, which `dispatchAction` never sees), and the
// fallback write for a result that states no identity of its own.
describe('useClientAction', { tags: ['unit'] }, () => {
	it('dispatches to the server handler with the [{id,data}] envelope when no clientHandler', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({ actions: { Activate: {} } })

		await useClientAction().run(payload('Activate'))

		expect(mocks.sc.dispatchAction).toHaveBeenCalledTimes(1)
		expect(mocks.sc.dispatchAction).toHaveBeenCalledWith(mocks.sc.registeredDoctype, 'Activate', [
			{ id: 'r1', data: { id: 'r1', title: 'x' } },
		])
		// The result states its own identity, so filing it was `dispatchAction`'s job and the
		// composable must not write it a second time.
		expect(mocks.sc.addRecord).not.toHaveBeenCalled()
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
		expect(mocks.sc.dispatchAction).toHaveBeenCalledWith(mocks.sc.registeredDoctype, 'Assign', [
			{ id: 'r1', data: { id: 'r1', title: 'x' }, priority: 'high' },
		])
	})

	it('injects the live HST record into the clientHandler', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { Tag: { clientHandler: "await runAction('Assign', { who: record.owner })" } },
			record: { owner: 'alice' },
		})

		await useClientAction().run(payload('Tag'))

		expect(mocks.sc.dispatchAction).toHaveBeenCalledWith(mocks.sc.registeredDoctype, 'Assign', [
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
		expect(mocks.sc.removeRecord).not.toHaveBeenCalled()
		expect(errorSpy).toHaveBeenCalledWith('Action failed:', 'Handler not registered')
		errorSpy.mockRestore()
	})
})

// A host with its own notification system must be able to take the failure surface over. Without
// this, converging a host onto `useClientAction` newly imposes a blocking alert on its users.
describe('useClientAction onError', { tags: ['unit'] }, () => {
	it('routes a refused dispatch to onError with the action context, and replaces the default', async () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
		const onError = vi.fn()
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { Activate: {} },
			dispatch: vi.fn(async () => ({ success: false, data: null, error: 'Handler not registered' })),
		})

		await useClientAction({ onError }).run(payload('Activate'))

		expect(onError).toHaveBeenCalledWith({
			message: 'Handler not registered',
			action: 'Activate',
			doctype: 'user',
			recordId: 'r1',
		})
		// Full replacement, console log included — the host owns the surface.
		expect(errorSpy).not.toHaveBeenCalled()
		errorSpy.mockRestore()
	})

	it('routes a clientHandler throw to onError and carries the thrown value as cause', async () => {
		const onError = vi.fn()
		mocks.router = makeRouter()
		mocks.sc = makeSc({ actions: { Boom: { clientHandler: "throw new Error('handler exploded')" } } })

		await useClientAction({ onError }).run(payload('Boom'))

		expect(onError).toHaveBeenCalledTimes(1)
		const failure = onError.mock.calls[0]?.[0]
		expect(failure).toMatchObject({ message: 'handler exploded', action: 'Boom', doctype: 'user', recordId: 'r1' })
		// `cause` is what separates a throw from a refused dispatch, and what a host forwards to Sentry.
		expect(failure.cause).toBeInstanceOf(Error)
	})

	it('names the action when the server refuses without a message', async () => {
		const onError = vi.fn()
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { Activate: {} },
			dispatch: vi.fn(async () => ({ success: false, data: null, error: null })),
		})

		await useClientAction({ onError }).run(payload('Activate'))

		expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Action "Activate" failed' }))
	})
})

// Desktop's "New Record" routes to `/{doctype}/new` and the backend assigns the identity when the
// Save creates the record. Leaving the route on the draft segment would offer a form that creates
// a second record, and the stale key would leave a row nothing can fetch.
describe('useClientAction record identity', { tags: ['unit'] }, () => {
	it('dispatches a draft with no id at all, which is what the write path reads as create', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { save: {} },
			dispatch: vi.fn(async () => ({ success: true, data: { id: '7', title: 'drafted' }, error: null })),
		})

		await useClientAction().run({ name: 'save', doctype: 'user', recordId: 'new', data: { title: 'drafted' } })

		expect(mocks.sc.dispatchAction).toHaveBeenCalledWith(mocks.sc.registeredDoctype, 'save', [
			{ data: { title: 'drafted' } },
		])
		const [[, , args]] = mocks.sc.dispatchAction.mock.calls
		expect('id' in args[0]).toBe(false)
	})

	it('follows the route to the identity the server assigned a created record', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { save: {} },
			dispatch: vi.fn(async () => ({ success: true, data: { id: '7', title: 'drafted' }, error: null })),
		})

		await useClientAction().run({ name: 'save', doctype: 'user', recordId: 'new', data: { title: 'drafted' } })

		// `replace`, not `push` — Back onto the draft route would offer a form that creates again.
		expect(mocks.router.replace).toHaveBeenCalledWith('/user/7')
		expect(mocks.router.push).not.toHaveBeenCalled()
		// Never under the route segment: `getRecords` lists every key under the doctype node.
		expect(mocks.sc.addRecord).not.toHaveBeenCalledWith('user', 'new', expect.anything())
	})

	it('stores nothing when a draft action returns no identity', async () => {
		// Filing this under `new` would put a record named `new` in the list view.
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { validate: {} },
			dispatch: vi.fn(async () => ({ success: true, data: { state: 'checked' }, error: null })),
		})

		await useClientAction().run({ name: 'validate', doctype: 'user', recordId: 'new', data: { title: 'x' } })

		expect(mocks.sc.addRecord).not.toHaveBeenCalled()
		expect(mocks.router.replace).not.toHaveBeenCalled()
	})

	it('leaves an updated record where it is', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({ actions: { save: {} } })

		await useClientAction().run(payload('save'))

		expect(mocks.sc.removeRecord).not.toHaveBeenCalled()
		expect(mocks.router.replace).not.toHaveBeenCalled()
	})

	it('follows a natural key the action rewrote, and drops the stale key', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { rename: {} },
			fields: USERNAME_FIELDS,
			dispatch: vi.fn(async () => ({ success: true, data: { username: 'robert', id: '7' }, error: null })),
		})

		await useClientAction().run({ name: 'rename', doctype: 'user', recordId: 'bob', data: { username: 'robert' } })

		// The declared key wins over the surrogate `id`, matching what the adapter looks up by.
		expect(mocks.sc.removeRecord).toHaveBeenCalledWith('user', 'bob')
		expect(mocks.router.replace).toHaveBeenCalledWith('/user/robert')
	})

	it('does not relocate a natural-keyed record when the result omits its key', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { recalculate: {} },
			fields: USERNAME_FIELDS,
			// A registered effect returning a partial row. `getRecordId` alone would fall back to
			// `id` and move the record to /user/7, which the adapter — looking up by `username` —
			// cannot resolve. `dispatchAction` declines it for the same reason, so the composable
			// is what files it, under the id that was dispatched.
			dispatch: vi.fn(async () => ({ success: true, data: { id: '7', total: 75 }, error: null })),
		})

		await useClientAction().run({ name: 'recalculate', doctype: 'user', recordId: 'bob', data: {} })

		expect(mocks.sc.addRecord).toHaveBeenCalledWith('user', 'bob', { id: '7', total: 75 })
		expect(mocks.sc.removeRecord).not.toHaveBeenCalled()
		expect(mocks.router.replace).not.toHaveBeenCalled()
	})

	it('leaves the record in place when the result states no identity at all', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { approve: {} },
			// The dispatcher's `{ state: nextState }` outcome, returned when nothing wrote data.
			dispatch: vi.fn(async () => ({ success: true, data: { state: 'assigned' }, error: null })),
		})

		await useClientAction().run(payload('approve'))

		expect(mocks.sc.addRecord).toHaveBeenCalledWith('user', 'r1', { state: 'assigned' })
		expect(mocks.sc.removeRecord).not.toHaveBeenCalled()
		expect(mocks.router.replace).not.toHaveBeenCalled()
	})
})

// The three things a host may legitimately need to change. Identity resolution and HST keying are
// deliberately absent from the options object: that is the rule the adapter re-derives server-side,
// and every host that re-derived it client-side got it wrong.
describe('useClientAction host overrides', { tags: ['unit'] }, () => {
	it('buildArgs replaces the envelope, and the result is still keyed off the returned record', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { save: {} },
			dispatch: vi.fn(async () => ({ success: true, data: { state: 'assigned' }, error: null })),
		})

		// The positional shape a backend that does not take the default envelope uses end to end.
		await useClientAction({ buildArgs: ({ recordId, data }) => [recordId, data] }).run(payload('save'))

		expect(mocks.sc.dispatchAction).toHaveBeenCalledWith(mocks.sc.registeredDoctype, 'save', [
			'r1',
			{ id: 'r1', title: 'x' },
		])
		// Changing what was *sent* must not change how the answer is stored.
		expect(mocks.sc.addRecord).toHaveBeenCalledWith('user', 'r1', { state: 'assigned' })
	})

	it('buildArgs is told when the record is a draft, so it can omit the id its own way', async () => {
		const buildArgs = vi.fn(() => [{ payload: 'custom' }])
		mocks.router = makeRouter()
		mocks.sc = makeSc({ actions: { save: {} } })

		await useClientAction({ buildArgs }).run({
			name: 'save',
			doctype: 'user',
			recordId: 'new',
			data: { title: 'drafted' },
		})

		expect(buildArgs).toHaveBeenCalledWith({
			doctype: 'user',
			action: 'save',
			recordId: 'new',
			isDraft: true,
			data: { title: 'drafted' },
			extra: undefined,
		})
	})

	it('followRecord replaces the default navigation and is told both identities', async () => {
		const followRecord = vi.fn()
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { save: {} },
			dispatch: vi.fn(async () => ({ success: true, data: { id: '7', title: 'drafted' }, error: null })),
		})

		await useClientAction({ followRecord }).run({
			name: 'save',
			doctype: 'user',
			recordId: 'new',
			data: { title: 'drafted' },
		})

		expect(followRecord).toHaveBeenCalledWith({ doctype: 'user', recordId: '7', previousRecordId: 'new' })
		// The default is fully replaced — a host staying on the page must not also be navigated.
		expect(mocks.router.replace).not.toHaveBeenCalled()
	})
})
