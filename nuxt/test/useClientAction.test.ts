// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'

// `vi.mock`/`vi.hoisted` below are hoisted above this import at runtime, so the composable
// still loads with the mocked `useStonecrop`/`useRouter`.
import { useClientAction } from '../src/runtime/app/composables/useClientAction'
import { Doctype } from '@stonecrop/stonecrop'
import type { DoctypeField } from '@stonecrop/schema'

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
	// actually registers.
	const doctype = Doctype.fromObject({
		name: 'User',
		fields: opts.fields ?? ID_FIELDS,
		workflow: { states: ['active', 'assigned'], actions: opts.actions ?? {} },
	})
	return {
		_doctype: doctype,
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

// Desktop's "New Record" navigates to a synthetic `new-<timestamp>` id and the backend assigns
// the real one when the Save creates the record. Writing the result back under the dispatched id
// would leave the record under a key nothing can fetch, the route pointing at a spent id, and the
// next Save creating a second record.
describe('useClientAction record identity', { tags: ['unit'] }, () => {
	it('stores a created record under the id the server assigned, and follows the route to it', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { save: {} },
			dispatch: vi.fn(async () => ({ success: true, data: { id: '7', title: 'drafted' }, error: null })),
		})

		await useClientAction().run({
			name: 'save',
			doctype: 'user',
			recordId: 'new-1700000000000',
			data: { title: 'drafted' },
		})

		expect(mocks.sc.addRecord).toHaveBeenCalledWith('user', '7', { id: '7', title: 'drafted' })
		expect(mocks.sc.addRecord).not.toHaveBeenCalledWith('user', 'new-1700000000000', expect.anything())
		expect(mocks.sc.removeRecord).toHaveBeenCalledWith('user', 'new-1700000000000')
		// `replace`, not `push` — Back onto a spent `new-` id would offer a form that creates again.
		expect(mocks.router.replace).toHaveBeenCalledWith('/user/7')
		expect(mocks.router.push).not.toHaveBeenCalled()
	})

	it('leaves an updated record where it is', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({ actions: { save: {} } })

		await useClientAction().run(payload('save'))

		expect(mocks.sc.addRecord).toHaveBeenCalledWith('user', 'r1', { id: 'r1', status: 'assigned' })
		expect(mocks.sc.removeRecord).not.toHaveBeenCalled()
		expect(mocks.router.replace).not.toHaveBeenCalled()
	})

	it('follows a natural key the action rewrote', async () => {
		mocks.router = makeRouter()
		mocks.sc = makeSc({
			actions: { rename: {} },
			fields: USERNAME_FIELDS,
			dispatch: vi.fn(async () => ({ success: true, data: { username: 'robert', id: '7' }, error: null })),
		})

		await useClientAction().run({ name: 'rename', doctype: 'user', recordId: 'bob', data: { username: 'robert' } })

		// The declared key wins over the surrogate `id`, matching what the adapter looks up by.
		expect(mocks.sc.addRecord).toHaveBeenCalledWith('user', 'robert', { username: 'robert', id: '7' })
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
			// cannot resolve.
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
