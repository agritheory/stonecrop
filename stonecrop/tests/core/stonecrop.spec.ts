import type { DoctypeField } from '@stonecrop/schema'
import { List } from 'immutable'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'

import Doctype from '../../src/doctype'
import { DRAFT_RECORD_ID } from '../../src/draft'
import Registry from '../../src/registry'
import { Stonecrop } from '../../src/stonecrop'
import type { StonecropOptions } from '../../src/types/stonecrop'
import { ImmutableDoctype } from '../../src/types'

// Mock fetch globally
globalThis.fetch = vi.fn() as unknown as typeof fetch

function createDoctype(name: string, fields?: DoctypeField[], links?: Record<string, any>) {
	const schema = List<DoctypeField>(
		fields || [{ kind: 'field', fieldname: 'title', component: 'ATextInput', label: 'Title' }]
	)
	return new Doctype(name, schema, undefined, undefined, links)
}

function createMockDoctype(name: string) {
	const mockSchema: ImmutableDoctype['schema'] = List<DoctypeField>([
		{ kind: 'field', fieldname: 'title', label: 'Title', component: 'ATextInput' },
		{ kind: 'field', fieldname: 'status', label: 'Status', component: 'ADropdown' },
	])

	const mockWorkflowConfig: ImmutableDoctype['workflow'] = {
		id: 'mockWorkflow',
		initial: 'draft',
		states: {
			draft: {
				on: {
					submit: { target: 'pending' },
				},
			},
			pending: {
				on: {
					approve: { target: 'completed' },
					reject: { target: 'draft' },
				},
			},
			completed: { type: 'final' },
		},
	}

	return new Doctype(name, mockSchema, mockWorkflowConfig)
}

describe('Stonecrop class with HST integration', { tags: ['unit'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let mockRouter: any

	beforeEach(() => {
		// Reset static instances
		Registry._root = undefined as any
		Stonecrop._root = undefined as any

		mockRouter = createRouter({
			history: createMemoryHistory(),
			routes: [],
		})

		registry = new Registry(mockRouter)
		stonecrop = new Stonecrop(registry)

		// Reset fetch mock
		vi.clearAllMocks()
	})

	describe('Initialization', () => {
		it('creates Stonecrop instance with HST integration', () => {
			expect(stonecrop).toBeInstanceOf(Stonecrop)
			expect(stonecrop.getStore).toBeDefined()
			expect(typeof stonecrop.getStore).toBe('function')
		})

		it('initializes HST store with existing Registry doctypes', () => {
			const mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)

			const newStonecrop = new Stonecrop(registry)
			const store = newStonecrop.getStore()

			expect(store.has('task')).toBe(true)
		})

		it('sets up automatic Registry sync', () => {
			const store = stonecrop.getStore()

			// Initially no doctype
			expect(store.has('task')).toBe(false)

			// Add doctype to registry
			const mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)

			// Should auto-create HST section
			expect(store.has('task')).toBe(true)
		})

		it('configures operation log store with provided config', () => {
			Registry._root = undefined as any
			Stonecrop._root = undefined as any

			const localRegistry = new Registry(mockRouter)
			const configOptions = { maxOperations: 500, enableCrossTabSync: true }
			const localStonecrop = new Stonecrop(localRegistry, configOptions)

			// The operation log store is lazily initialized
			// Config is stored and will be applied when getOperationLogStore is called
			expect((localStonecrop as any)._operationLogConfig).toEqual(configOptions)
		})
	})

	describe('HST Record Management', () => {
		let mockDoctype: Doctype

		beforeEach(() => {
			mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)
		})

		it('returns records hash as HST node', () => {
			const records = stonecrop.records('task')

			expect(records.getPath).toBeDefined()
			expect(records.getPath()).toBe('task')
			expect(records.getAncestor).toBeDefined()
		})

		it('returns records hash using Doctype object', () => {
			const records = stonecrop.records(mockDoctype)

			expect(records.getPath()).toBe('task')
		})

		it('adds record with proper HST wrapping', () => {
			const recordData = { id: '123', title: 'Test Task' }

			stonecrop.addRecord('task', '123', recordData)

			const record = stonecrop.getRecordById('task', '123')
			expect(record).toBeDefined()
			expect(record!.get('id')).toBe('123')
			expect(record!.get('title')).toBe('Test Task')

			// Should have tree navigation capabilities
			expect(record!.getPath).toBeDefined()
			expect(record!.getAncestor).toBeDefined()
		})

		it('adds record using Doctype object', () => {
			const recordData = { id: '123', title: 'Test Task' }

			stonecrop.addRecord(mockDoctype, '123', recordData)

			const record = stonecrop.getRecordById(mockDoctype, '123')
			expect(record).toBeDefined()
			expect(record!.get('title')).toBe('Test Task')
		})

		it('gets all record IDs', () => {
			stonecrop.addRecord('task', '123', { title: 'Task 1' })
			stonecrop.addRecord('task', '456', { title: 'Task 2' })

			const recordIds = stonecrop.getRecordIds('task')
			expect(recordIds).toEqual(['123', '456'])
		})

		it('returns empty array when doctype has no records', () => {
			registry.addDoctype(createMockDoctype('EmptyTask'))

			const recordIds = stonecrop.getRecordIds('emptytask')
			expect(recordIds).toEqual([])
		})

		it('returns empty array when doctype node is not an object', () => {
			// Manually set a non-object value in the store
			stonecrop.getStore().set('baddoctype', 'not-an-object')
			registry.addDoctype(createMockDoctype('BadDoctype'))

			const recordIds = stonecrop.getRecordIds('baddoctype')
			expect(recordIds).toEqual([])
		})

		it('removes record', () => {
			stonecrop.addRecord('task', '123', { id: '123', title: 'Test Task' })

			// Verify record exists
			expect(stonecrop.getRecordById('task', '123')).toBeDefined()

			// Remove record
			stonecrop.removeRecord('task', '123')

			// Should be gone
			expect(stonecrop.getRecordById('task', '123')).toBeUndefined()
		})

		it('clears all records for doctype', () => {
			stonecrop.addRecord('task', '123', { title: 'Task 1' })
			stonecrop.addRecord('task', '456', { title: 'Task 2' })

			stonecrop.clearRecords('task')

			expect(stonecrop.getRecordIds('task')).toEqual([])
		})

		it('ensures doctype exists when accessing records', () => {
			// Access records for non-existent doctype should create it
			const records = stonecrop.records('newdoctype')

			expect(records.getPath()).toBe('newdoctype')
			expect(stonecrop.getStore().has('newdoctype')).toBe(true)
		})
	})

	describe('Server Integration', () => {
		let mockDoctype: Doctype
		let mockClient: any

		beforeEach(() => {
			mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)

			// Create a mock client for server integration tests
			mockClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn(),
				getRecords: vi.fn(),
				runAction: vi.fn(),
			}
			stonecrop.setClient(mockClient)
		})

		it('getRecords fetches and stores records in HST', async () => {
			const mockRecords = [
				{ id: '1', title: 'Task 1' },
				{ id: '2', title: 'Task 2' },
			]
			mockClient.getRecords.mockResolvedValue({ data: mockRecords, hasMore: false })

			await stonecrop.getRecords(mockDoctype)

			expect(mockClient.getRecords).toHaveBeenCalledWith(mockDoctype, undefined)

			// Check that records are stored in HST with proper wrapping
			const recordIds = stonecrop.getRecordIds('task')
			expect(recordIds).toEqual(['1', '2'])

			const record1 = stonecrop.getRecordById('task', '1')
			expect(record1!.get('title')).toBe('Task 1')
			expect(record1!.getPath).toBeDefined()
		})

		it('getRecords keys natural-key records by their declared primaryKey', async () => {
			// Regression: this used to read `record.id` only, so a natural-keyed doctype — whose
			// rows carry no `id` column at all — had every row silently dropped before it reached
			// HST. The list then rendered empty and no downstream id-resolution could recover it.
			const uom = new Doctype(
				'Uom',
				List<DoctypeField>([
					{ kind: 'field', fieldname: 'name', label: 'Name', component: 'ATextInput', primaryKey: true },
					{ kind: 'field', fieldname: 'label', label: 'Label', component: 'ATextInput' },
				]),
				undefined
			)
			registry.addDoctype(uom)

			mockClient.getRecords.mockResolvedValue({
				hasMore: false,
				data: [
					{ name: 'EACH', label: 'Each' },
					{ name: 'BOX', label: 'Box' },
				],
			})

			await stonecrop.getRecords(uom)

			expect(stonecrop.getRecordIds('uom')).toEqual(['EACH', 'BOX'])
			expect(stonecrop.getRecordById('uom', 'EACH')!.get('label')).toBe('Each')
		})

		it('getRecords still falls back to id when no primaryKey is declared', async () => {
			// The surrogate-key path must keep working: those doctypes carry an `id` column and
			// never mark a primary key.
			mockClient.getRecords.mockResolvedValue({ data: [{ id: 'a1', title: 'Task A' }], hasMore: false })

			await stonecrop.getRecords(mockDoctype)

			expect(stonecrop.getRecordIds('task')).toEqual(['a1'])
		})

		it('getRecord fetches and stores single record', async () => {
			const mockRecord = { record: { id: '123', title: 'Test Task' }, unknownLinks: [] }
			mockClient.getRecord.mockResolvedValue(mockRecord)

			await stonecrop.getRecord(mockDoctype, '123')

			expect(mockClient.getRecord).toHaveBeenCalledWith(mockDoctype, '123', undefined)

			// Check that record.record (not the wrapper) is stored
			const record = stonecrop.getRecordById('task', '123')
			expect(record!.get('title')).toBe('Test Task')
			expect(record!.get('id')).toBe('123')
		})

		it('getRecord does not fetch a record already in HST', async () => {
			// The guard lives here rather than in each caller. It used to be Desktop's, which is why
			// a host handler and Desktop could both race past their own copies of it and fetch the
			// same record twice.
			stonecrop.addRecord(mockDoctype, '123', { id: '123', title: 'Already Here' })

			await stonecrop.getRecord(mockDoctype, '123')

			expect(mockClient.getRecord).not.toHaveBeenCalled()
			expect(stonecrop.getRecordById('task', '123')!.get('title')).toBe('Already Here')
		})

		it('getRecord does not fetch a draft, which has no server record to find', async () => {
			await stonecrop.getRecord(mockDoctype, DRAFT_RECORD_ID)

			expect(mockClient.getRecord).not.toHaveBeenCalled()
		})

		it('getRecord forwards options to the client', async () => {
			mockClient.getRecord.mockResolvedValue({ record: { id: '123' } })

			await stonecrop.getRecord(mockDoctype, '123', { includeNested: true })

			expect(mockClient.getRecord).toHaveBeenCalledWith(mockDoctype, '123', { includeNested: true })
		})

		it('getRecords forwards options to the client and invents no row limit', async () => {
			// A row cap is a statement about what the backend can afford, so nothing on this side
			// makes one up. An unqualified call must reach the client unqualified.
			mockClient.getRecords.mockResolvedValue({ data: [], hasMore: false })

			await stonecrop.getRecords(mockDoctype, { limit: 25, orderBy: 'TITLE_ASC' })
			expect(mockClient.getRecords).toHaveBeenCalledWith(mockDoctype, { limit: 25, orderBy: 'TITLE_ASC' })

			await stonecrop.getRecords(mockDoctype)
			expect(mockClient.getRecords).toHaveBeenLastCalledWith(mockDoctype, undefined)
		})

		it('getRecords refetches even when records are already in HST', async () => {
			// Deliberately unguarded, unlike getRecord: a list is a view of data that changes, so
			// revisiting one must re-read rather than serve whatever HST happens to hold.
			mockClient.getRecords.mockResolvedValue({ data: [{ id: '1', title: 'Fresh' }], hasMore: false })
			stonecrop.addRecord(mockDoctype, '1', { id: '1', title: 'Stale' })

			await stonecrop.getRecords(mockDoctype)

			expect(mockClient.getRecords).toHaveBeenCalledOnce()
			expect(stonecrop.getRecordById('task', '1')!.get('title')).toBe('Fresh')
		})

		it('getRecords at offset 0 replaces HST ids not in the new page', async () => {
			stonecrop.addRecord(mockDoctype, 'old', { id: 'old', title: 'Leftover' })
			mockClient.getRecords.mockResolvedValue({
				data: [{ id: '1', title: 'Only' }],
				hasMore: false,
			})

			await stonecrop.getRecords(mockDoctype)

			expect(stonecrop.getRecordIds('task')).toEqual(['1'])
			expect(stonecrop.getPageInfo('task')).toEqual({ hasMore: false, offset: 0, limit: 1 })
		})

		it('getRecords at offset greater than 0 appends without clearing prior pages', async () => {
			mockClient.getRecords.mockResolvedValueOnce({
				data: [{ id: '1', title: 'Page 1' }],
				hasMore: true,
			})
			await stonecrop.getRecords(mockDoctype)

			mockClient.getRecords.mockResolvedValueOnce({
				data: [{ id: '2', title: 'Page 2' }],
				hasMore: false,
			})
			await stonecrop.getRecords(mockDoctype, { offset: 1 })

			expect(stonecrop.getRecordIds('task')).toEqual(['1', '2'])
			expect(stonecrop.getPageInfo('task')).toEqual({ hasMore: false, offset: 1, limit: 1 })
		})

		it('getRecords records pageInfo offset and limit from the last fetch', async () => {
			mockClient.getRecords.mockResolvedValue({
				data: [
					{ id: 'a', title: 'A' },
					{ id: 'b', title: 'B' },
				],
				hasMore: true,
				count: 10,
			})

			await stonecrop.getRecords(mockDoctype, { offset: 4, includeTotal: true })

			expect(stonecrop.getPageInfo('task')).toEqual({
				hasMore: true,
				offset: 4,
				limit: 2,
				count: 10,
			})
		})
	})

	describe('DataClient integration', () => {
		let mockDoctype: Doctype

		beforeEach(() => {
			// Reset registry for each test
			Registry._root = undefined as any
			Stonecrop._root = undefined as any
			const localRouter = createRouter({ history: createMemoryHistory(), routes: [] })
			registry = new Registry(localRouter)
			mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)
		})

		it('getRecord delegates to client.getRecord when client provided', async () => {
			const mockRecord = { record: { id: 'abc', title: 'Client Task' }, unknownLinks: [] }
			const mockClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn().mockResolvedValue(mockRecord),
				getRecords: vi.fn(),
				runAction: vi.fn(),
			}

			const options: StonecropOptions = { client: mockClient }
			const localStonecrop = new Stonecrop(registry, undefined, options)

			await localStonecrop.getRecord(mockDoctype, 'abc')

			expect(mockClient.getRecord).toHaveBeenCalledOnce()
			expect(mockClient.getRecord).toHaveBeenCalledWith(mockDoctype, 'abc', undefined)
			expect(fetch).not.toHaveBeenCalled()

			const stored = localStonecrop.getRecordById('task', 'abc')
			expect(stored!.get('title')).toBe('Client Task')
		})

		it('getRecords delegates to client.getRecords when client provided', async () => {
			const mockRecords = [
				{ id: '1', title: 'Record A' },
				{ id: '2', title: 'Record B' },
			]
			const mockClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn(),
				getRecords: vi.fn().mockResolvedValue({ data: mockRecords, hasMore: false }),
				runAction: vi.fn(),
			}

			const options: StonecropOptions = { client: mockClient }
			const localStonecrop = new Stonecrop(registry, undefined, options)

			await localStonecrop.getRecords(mockDoctype)

			expect(mockClient.getRecords).toHaveBeenCalledOnce()
			expect(mockClient.getRecords).toHaveBeenCalledWith(mockDoctype, undefined)
			expect(fetch).not.toHaveBeenCalled()

			const ids = localStonecrop.getRecordIds('task')
			expect(ids).toEqual(['1', '2'])
		})

		it('getRecord throws error when no client configured', async () => {
			const localStonecrop = new Stonecrop(registry)

			await expect(localStonecrop.getRecord(mockDoctype, '42')).rejects.toThrow('No data client configured')
		})

		it('getRecords throws error when no client configured', async () => {
			const localStonecrop = new Stonecrop(registry)

			await expect(localStonecrop.getRecords(mockDoctype)).rejects.toThrow('No data client configured')
		})

		it('getRecord does not add record to HST when client returns null', async () => {
			const mockClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn().mockResolvedValue(null),
				getRecords: vi.fn(),
				runAction: vi.fn(),
			}
			const options: StonecropOptions = { client: mockClient }
			const localStonecrop = new Stonecrop(registry, undefined, options)

			await localStonecrop.getRecord(mockDoctype, 'missing-id')

			const stored = localStonecrop.getRecordById('task', 'missing-id')
			expect(stored).toBeUndefined()
		})

		it('setClient allows deferred client configuration', async () => {
			const mockRecord = { id: 'deferred', title: 'Deferred Task' }
			const mockClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn().mockResolvedValue(mockRecord),
				getRecords: vi.fn(),
				runAction: vi.fn(),
			}

			const localStonecrop = new Stonecrop(registry)

			// Client not set initially
			expect(localStonecrop.getClient()).toBeUndefined()

			// Set client after construction
			localStonecrop.setClient(mockClient)
			expect(localStonecrop.getClient()).toBe(mockClient)

			// Now getRecord should work
			await localStonecrop.getRecord(mockDoctype, 'deferred')
			expect(mockClient.getRecord).toHaveBeenCalledOnce()
		})

		it('dispatchAction delegates to client.runAction', async () => {
			const mockResult = { success: true, data: { id: '1', status: 'submitted' }, error: null }
			const mockClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn(),
				getRecords: vi.fn(),
				runAction: vi.fn().mockResolvedValue(mockResult),
			}

			const options: StonecropOptions = { client: mockClient }
			const localStonecrop = new Stonecrop(registry, undefined, options)

			const result = await localStonecrop.dispatchAction(mockDoctype, 'SUBMIT', ['1'])

			expect(mockClient.runAction).toHaveBeenCalledOnce()
			expect(mockClient.runAction).toHaveBeenCalledWith(mockDoctype, 'SUBMIT', ['1'])
			expect(result).toEqual(mockResult)
		})

		// The write half. It is here rather than in the composable because a host that never adopts
		// `useClientAction` still dispatches through this method, and filing a created record under
		// the id that was *sent* is the mistake every hand-rolled handler made — the record lands
		// under a key nothing can fetch and the next save creates a second one.
		describe('dispatchAction record writeback', () => {
			const idFields: DoctypeField[] = [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'title', component: 'ATextInput' },
			]
			const naturalFields: DoctypeField[] = [
				{ kind: 'field', fieldname: 'username', component: 'ATextInput', primaryKey: true },
				{ kind: 'field', fieldname: 'id', component: 'ATextInput' },
			]

			const withResult = (data: unknown, fields: DoctypeField[]) => {
				const doctype = Doctype.fromObject({ name: 'User', fields })
				const client = {
					getMeta: vi.fn(),
					getRecord: vi.fn(),
					getRecords: vi.fn(),
					runAction: vi.fn().mockResolvedValue({ success: true, data, error: null }),
				}
				return { doctype, sc: new Stonecrop(registry, undefined, { client } as StonecropOptions) }
			}

			it('files the returned record under the identity the server settled on, not the one dispatched', async () => {
				// The create case: a draft sends no id at all, and the server answers with `7`.
				const { doctype, sc } = withResult({ id: '7', title: 'drafted' }, idFields)

				await sc.dispatchAction(doctype, 'save', [{ data: { title: 'drafted' } }])

				expect(sc.getRecordById('user', '7')).toBeDefined()
				expect(sc.getRecordIds('user')).toEqual(['7'])
			})

			it('prefers the declared natural key over a surrogate id the record also carries', async () => {
				const { doctype, sc } = withResult({ username: 'robert', id: '7' }, naturalFields)

				await sc.dispatchAction(doctype, 'rename', [{ id: 'bob', data: { username: 'robert' } }])

				// `robert`, not `7` — the adapter looks records up by the declared key.
				expect(sc.getRecordIds('user')).toEqual(['robert'])
			})

			it('declines a partial record that omits its declared key, rather than guessing', async () => {
				// A registered effect returning `{ id, total }` for a natural-keyed doctype. Trusting
				// `getRecordId`'s `id` fallback here would relocate the record to a key the adapter
				// cannot resolve, which reads as a rename that never happened.
				const { doctype, sc } = withResult({ id: '7', total: 75 }, naturalFields)

				await sc.dispatchAction(doctype, 'recalculate', [{ id: 'bob', data: {} }])

				expect(sc.getRecordIds('user')).toEqual([])
			})

			it('writes nothing for a state-only outcome or a refused action', async () => {
				const { doctype, sc } = withResult({ state: 'APPROVED' }, idFields)
				await sc.dispatchAction(doctype, 'approve', [{ id: 'r1', data: {} }])
				expect(sc.getRecordIds('user')).toEqual([])

				const refused = Doctype.fromObject({ name: 'User', fields: idFields })
				const client = {
					getMeta: vi.fn(),
					getRecord: vi.fn(),
					getRecords: vi.fn(),
					runAction: vi.fn().mockResolvedValue({ success: false, data: { id: '7' }, error: 'refused' }),
				}
				const sc2 = new Stonecrop(registry, undefined, { client } as StonecropOptions)
				await sc2.dispatchAction(refused, 'save', [{ data: {} }])
				expect(sc2.getRecordIds('user')).toEqual([])
			})
		})

		it('dispatchAction throws error when no client configured', async () => {
			const localStonecrop = new Stonecrop(registry)

			await expect(localStonecrop.dispatchAction(mockDoctype, 'SUBMIT', ['1'])).rejects.toThrow(
				'No data client configured'
			)
		})

		it('getMeta throws error when no getMeta function provided', async () => {
			Registry._root = undefined as any
			Stonecrop._root = undefined as any

			// Create registry without getMeta function
			const localRegistry = new Registry(mockRouter)
			const localStonecrop = new Stonecrop(localRegistry)

			await expect(localStonecrop.getMeta({ path: '/task/123', segments: ['task', '123'] })).rejects.toThrow(
				'No getMeta function provided to Registry'
			)
		})
	})

	describe('getRecordState', () => {
		let mockDoctype: Doctype

		beforeEach(() => {
			mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)
		})

		it('returns the status field value when the record has a status', () => {
			stonecrop.addRecord('task', 'r-1', { id: 'r-1', status: 'pending' })

			const state = stonecrop.getRecordState('task', 'r-1')
			expect(state).toBe('pending')
		})

		it('falls back to the workflow initial state when the record has no status field', () => {
			stonecrop.addRecord('task', 'r-2', { id: 'r-2', title: 'No status here' })

			const state = stonecrop.getRecordState('task', 'r-2')
			expect(state).toBe('draft')
		})

		it('falls back to the workflow initial state when status is an empty string', () => {
			stonecrop.addRecord('task', 'r-3', { id: 'r-3', status: '' })

			const state = stonecrop.getRecordState('task', 'r-3')
			expect(state).toBe('draft')
		})

		it('returns empty string when the doctype has no workflow', () => {
			const noWorkflowDoctype = new Doctype('Bare', List<DoctypeField>([]), undefined as any)
			// Use a fresh registry to avoid singleton collision
			Registry._root = undefined as any
			Stonecrop._root = undefined as any
			const localRegistry = new Registry()
			localRegistry.addDoctype(noWorkflowDoctype)
			const localStonecrop = new Stonecrop(localRegistry)
			localStonecrop.addRecord('bare', 'r-4', { id: 'r-4' })

			const state = localStonecrop.getRecordState('bare', 'r-4')
			expect(state).toBe('')
		})

		it('accepts a Doctype instance instead of a string slug', () => {
			stonecrop.addRecord('task', 'r-5', { id: 'r-5', status: 'completed' })

			const state = stonecrop.getRecordState(mockDoctype, 'r-5')
			expect(state).toBe('completed')
		})

		it('falls back to initial state for a non-existent record', () => {
			// record 'ghost' was never added
			const state = stonecrop.getRecordState('task', 'ghost')
			expect(state).toBe('draft')
		})

		describe('WorkflowMeta format support', () => {
			it('returns first state as initial for WorkflowMeta format', () => {
				Registry._root = undefined as any
				Stonecrop._root = undefined as any
				const localRegistry = new Registry()
				const localStonecrop = new Stonecrop(localRegistry)

				const workflowMeta = {
					states: ['planning', 'review', 'approved'],
					actions: {
						submit: { label: 'Submit', handler: 'plan:submit', allowedStates: ['planning'] },
					},
				}
				const planDoctype = new Doctype('Plan', List<DoctypeField>([]), workflowMeta)
				localRegistry.addDoctype(planDoctype)
				localStonecrop.addRecord('plan', 'p-1', { id: 'p-1' })

				const state = localStonecrop.getRecordState('plan', 'p-1')
				expect(state).toBe('planning')
			})

			it('returns status field when present, regardless of workflow format', () => {
				Registry._root = undefined as any
				Stonecrop._root = undefined as any
				const localRegistry = new Registry()
				const localStonecrop = new Stonecrop(localRegistry)

				const workflowMeta = {
					states: ['planning', 'review', 'approved'],
					actions: {},
				}
				const planDoctype = new Doctype('Plan', List<DoctypeField>([]), workflowMeta)
				localRegistry.addDoctype(planDoctype)
				localStonecrop.addRecord('plan', 'p-2', { id: 'p-2', status: 'review' })

				const state = localStonecrop.getRecordState('plan', 'p-2')
				expect(state).toBe('review')
			})

			it('handles WorkflowMeta with empty states array', () => {
				Registry._root = undefined as any
				Stonecrop._root = undefined as any
				const localRegistry = new Registry()
				const localStonecrop = new Stonecrop(localRegistry)

				const emptyStatesMeta = {
					states: [],
					actions: {},
				}
				const doctype = new Doctype('Empty', List<DoctypeField>([]), emptyStatesMeta)
				localRegistry.addDoctype(doctype)
				localStonecrop.addRecord('empty', 'e-1', { id: 'e-1' })

				const state = localStonecrop.getRecordState('empty', 'e-1')
				expect(state).toBe('')
			})

			it('handles WorkflowMeta without states property', () => {
				Registry._root = undefined as any
				Stonecrop._root = undefined as any
				const localRegistry = new Registry()
				const localStonecrop = new Stonecrop(localRegistry)

				const noStatesMeta = {
					actions: { save: { label: 'Save', handler: 'save' } },
				}
				const doctype = new Doctype('NoStates', List<DoctypeField>([]), noStatesMeta)
				localRegistry.addDoctype(doctype)
				localStonecrop.addRecord('no-states', 'ns-1', { id: 'ns-1' })

				const state = localStonecrop.getRecordState('no-states', 'ns-1')
				expect(state).toBe('')
			})
		})
	})

	describe('Advanced HST Usage', () => {
		it('provides access to root HST store', () => {
			const store = stonecrop.getStore()

			expect(store.get).toBeDefined()
			expect(store.set).toBeDefined()
			expect(store.has).toBeDefined()
			expect(store.getPath).toBeDefined()
			expect(store.getPath()).toBe('')
		})

		it('supports tree navigation between records and store sections', () => {
			const mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)

			stonecrop.addRecord('task', '123', { id: '123', title: 'Test Task' })

			const _store = stonecrop.getStore()
			const record = stonecrop.getRecordById('task', '123')

			expect(record).toBeDefined()
			const doctypeSection = record!.getAncestor()
			const rootStore = doctypeSection?.getAncestor()

			expect(doctypeSection?.getPath()).toBe('task')
			expect(rootStore?.getPath()).toBe('')
		})

		it('supports nested record data with tree navigation', () => {
			const mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)

			const recordData = {
				id: '123',
				title: 'Test Task',
				details: {
					priority: 'high',
					assignee: {
						name: 'John Doe',
						email: 'john@example.com',
					},
				},
			}

			stonecrop.addRecord('task', '123', recordData)

			const record = stonecrop.getRecordById('task', '123')!
			const assignee = record.getNode('details.assignee')

			expect(assignee.get('name')).toBe('John Doe')
			expect(assignee.getAncestor()!.getPath()).toContain('details')
		})
	})

	describe('Singleton Pattern', () => {
		it('returns the same instance on subsequent constructor calls', () => {
			Registry._root = undefined as any
			Stonecrop._root = undefined as any

			const localRouter = createRouter({ history: createMemoryHistory(), routes: [] })
			const localRegistry = new Registry(localRouter)

			const first = new Stonecrop(localRegistry)
			const second = new Stonecrop(localRegistry)

			expect(second).toBe(first)
			expect(Stonecrop._root).toBe(first)
		})

		it('Stonecrop._root is set after construction', () => {
			Registry._root = undefined as any
			Stonecrop._root = undefined as any

			const localRouter = createRouter({ history: createMemoryHistory(), routes: [] })
			const localRegistry = new Registry(localRouter)

			expect(Stonecrop._root).toBeUndefined()

			const instance = new Stonecrop(localRegistry)

			expect(Stonecrop._root).toBe(instance)
		})

		it('singleton shares HST store - mutations visible via Stonecrop._root', () => {
			Registry._root = undefined as any
			Stonecrop._root = undefined as any

			const localRouter = createRouter({ history: createMemoryHistory(), routes: [] })
			const localRegistry = new Registry(localRouter)
			const mockDoctype = createMockDoctype('Task')
			localRegistry.addDoctype(mockDoctype)

			const first = new Stonecrop(localRegistry)
			first.addRecord('task', '123', { title: 'Test Task' })

			const second = new Stonecrop(localRegistry)

			const record = second.getRecordById('task', '123')
			expect(record).toBeDefined()
			expect(record!.get('title')).toBe('Test Task')
		})
	})

	describe('collectRecordPayload', () => {
		let localRegistry: Registry
		let localStonecrop: Stonecrop

		beforeEach(() => {
			Registry._root = undefined as any
			Stonecrop._root = undefined as any
			localRegistry = new Registry()
			localStonecrop = new Stonecrop(localRegistry)
		})

		it('collects flat record data from HST', () => {
			const taskDoctype = createDoctype('Task', [
				{ kind: 'field', fieldname: 'title', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'status', component: 'ATextInput' },
			])
			localRegistry.addDoctype(taskDoctype)

			localStonecrop.addRecord('task', 'task-1', { title: 'My Task', status: 'open' })

			const payload = localStonecrop.collectRecordPayload(taskDoctype, 'task-1')

			expect(payload.title).toBe('My Task')
			expect(payload.status).toBe('open')
		})

		// The payload leaves in the shape the store holds. Reducing an inline link to the id a
		// column takes is the adapter's job at dispatch, so a client-side reduction here would be
		// an opinion about storage this layer cannot see — and a second, drifting definition of it.
		it('hands an inline link over exactly as the store holds it', () => {
			const orderDoctype = createDoctype('Order', [
				{ kind: 'field', fieldname: 'title', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'agentId', component: 'AFormLink', doctype: 'party' },
			] as DoctypeField[])
			localRegistry.addDoctype(orderDoctype)

			localStonecrop.addRecord('order', 'order-9', {
				title: 'My Order',
				agentId: { id: 'p-2', displayText: 'Globex' },
			})

			expect(localStonecrop.collectRecordPayload(orderDoctype, 'order-9').agentId).toEqual({
				id: 'p-2',
				displayText: 'Globex',
			})
		})

		it('sends an expanded link whole — it is the record, not a reference to one', () => {
			const orderDoctype = createDoctype('Order', [
				{ kind: 'field', fieldname: 'title', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'customer', component: 'AForm', doctype: 'party' },
			] as DoctypeField[])
			localRegistry.addDoctype(orderDoctype)

			localStonecrop.addRecord('order', 'order-10', {
				title: 'My Order',
				customer: { id: 'p-1', partyName: 'Acme Corp' },
			})

			expect(localStonecrop.collectRecordPayload(orderDoctype, 'order-10').customer).toEqual({
				id: 'p-1',
				partyName: 'Acme Corp',
			})
		})

		it('collects array data for cardinality: many fields', () => {
			const itemDoctype = createDoctype('Item', [
				{ kind: 'field', fieldname: 'name', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'qty', component: 'ANumericInput' },
			])
			localRegistry.addDoctype(itemDoctype)

			const orderDoctype = createDoctype(
				'Order',
				[{ kind: 'field', fieldname: 'order_number', component: 'ATextInput' }],
				{ items: { target: 'item', cardinality: 'noneOrMany' } }
			)
			localRegistry.addDoctype(orderDoctype)

			localStonecrop.addRecord('order', 'order-1', { order_number: 'ORD-001' })
			localStonecrop.getStore().set('order.order-1.items', [
				{ name: 'Item 1', qty: 5 },
				{ name: 'Item 2', qty: 10 },
			])

			const payload = localStonecrop.collectRecordPayload(orderDoctype, 'order-1')

			expect(payload.order_number).toBe('ORD-001')
			expect(Array.isArray(payload.items)).toBe(true)
			expect(payload.items).toHaveLength(2)
			expect(payload.items[0].name).toBe('Item 1')
			expect(payload.items[1].qty).toBe(10)
		})

		it('collects nested 1:1 doctype fields', () => {
			const addressDoctype = createDoctype('Address', [
				{ kind: 'field', fieldname: 'street', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'city', component: 'ATextInput' },
			])
			localRegistry.addDoctype(addressDoctype)

			const customerDoctype = createDoctype(
				'Customer',
				[{ kind: 'field', fieldname: 'name', component: 'ATextInput' }],
				{ address: { target: 'address', cardinality: 'one' } }
			)
			localRegistry.addDoctype(customerDoctype)

			localStonecrop.addRecord('customer', 'cust-1', { name: 'John Doe' })
			localStonecrop.getStore().set('customer.cust-1.address', { street: '123 Oak St', city: 'Portland' })

			const payload = localStonecrop.collectRecordPayload(customerDoctype, 'cust-1')

			expect(payload.name).toBe('John Doe')
			expect(payload.address).toBeDefined()
			expect(payload.address.street).toBe('123 Oak St')
			expect(payload.address.city).toBe('Portland')
		})

		it('recursively collects 1:many inside nested 1:1', () => {
			const phoneDoctype = createDoctype('Phone', [{ kind: 'field', fieldname: 'number', component: 'ATextInput' }])
			localRegistry.addDoctype(phoneDoctype)

			const addressDoctype = createDoctype(
				'Address',
				[{ kind: 'field', fieldname: 'street', component: 'ATextInput' }],
				{ phones: { target: 'phone', cardinality: 'noneOrMany' } }
			)
			localRegistry.addDoctype(addressDoctype)

			const customerDoctype = createDoctype(
				'Customer',
				[{ kind: 'field', fieldname: 'name', component: 'ATextInput' }],
				{ address: { target: 'address', cardinality: 'one' } }
			)
			localRegistry.addDoctype(customerDoctype)

			localStonecrop.addRecord('customer', 'cust-2', { name: 'Jane Doe' })
			localStonecrop.getStore().set('customer.cust-2.address', { street: '456 Pine St' })
			localStonecrop.getStore().set('customer.cust-2.address.phones', [{ number: '555-1234' }, { number: '555-5678' }])

			const payload = localStonecrop.collectRecordPayload(customerDoctype, 'cust-2')

			expect(payload.name).toBe('Jane Doe')
			expect(payload.address.phones).toBeDefined()
			expect(Array.isArray(payload.address.phones)).toBe(true)
			expect(payload.address.phones).toHaveLength(2)
			expect(payload.address.phones[0].number).toBe('555-1234')
		})

		it('handles empty and missing records gracefully', () => {
			const taskDoctype = createDoctype('Task')
			localRegistry.addDoctype(taskDoctype)

			const payload = localStonecrop.collectRecordPayload(taskDoctype, 'nonexistent')

			expect(payload).toBeDefined()
			expect(Object.keys(payload)).toHaveLength(0)
		})
	})
})
