import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useLazyLink } from '../../src/composables/lazy-link'
import Registry from '../../src/registry'
import { Stonecrop } from '../../src/stonecrop'
import { HST } from '../../src/stores/hst'
import Doctype from '../../src/doctype'

/**
 * @vitest-environment jsdom
 */

const createTestDoctype = (name: string, links?: Record<string, any>): Doctype => {
	return new Doctype(name, [] as any, undefined, undefined, undefined, links)
}

describe('useLazyLink', { tags: ['unit'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop

	beforeEach(() => {
		setActivePinia(createPinia())

		Registry._root = undefined as any
		Stonecrop._root = undefined as any
		;(HST as any).instance = undefined

		registry = new Registry()
		stonecrop = new Stonecrop(registry)

		vi.clearAllMocks()
	})

	it('returns initial state with loading false, loaded false, error null', async () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany' },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		const state = useLazyLink(doctype, '123', 'tasks')

		expect(state.loading.value).toBe(false)
		expect(state.loaded.value).toBe(false)
		expect(state.error.value).toBe(null)
		expect(state.data.value).toBe(undefined)
	})

	it('loaded becomes true after successful reload', async () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany' },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		const mockClient = {
			getRecord: vi.fn().mockResolvedValue({
				record: { id: '123', title: 'Test Recipe', tasks: [{ id: 't1', name: 'Task 1' }] },
				unknownLinks: [],
			}),
		}
		stonecrop.setClient(mockClient as any)

		const state = useLazyLink(doctype, '123', 'tasks')

		await state.reload()

		expect(state.loading.value).toBe(false)
		expect(state.loaded.value).toBe(true)
		expect(state.error.value).toBe(null)
		expect(state.data.value).toEqual([{ id: 't1', name: 'Task 1' }])
	})

	it('error is set when reload fails', async () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany' },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		const mockClient = {
			getRecord: vi.fn().mockRejectedValue(new Error('Network error')),
		}
		stonecrop.setClient(mockClient as any)

		const state = useLazyLink(doctype, '123', 'tasks')

		await expect(state.reload()).rejects.toThrow('Network error')
		expect(state.loading.value).toBe(false)
		expect(state.loaded.value).toBe(false)
		expect(state.error.value).toBeInstanceOf(Error)
		expect(state.error.value?.message).toBe('Network error')
	})

	it('returns early if already loading', async () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany' },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		let resolvePromise: (value: any) => void
		const mockClient = {
			getRecord: vi.fn().mockImplementation(() => {
				return new Promise(resolve => {
					resolvePromise = resolve
				})
			}),
		}
		stonecrop.setClient(mockClient as any)

		const state = useLazyLink(doctype, '123', 'tasks')

		const firstReload = state.reload()
		expect(state.loading.value).toBe(true)

		const secondReload = state.reload()
		expect(state.loading.value).toBe(true)

		resolvePromise!({ record: { id: '123', title: 'Test' }, unknownLinks: [] })
		await firstReload

		expect(state.loaded.value).toBe(true)
		expect(state.loading.value).toBe(false)
	})

	it('invokes custom handler for custom fetch strategy', async () => {
		const customHandlerCode = `async function(stonecrop, path, hst) {
			hst.set(path, [{ id: 'custom-1', name: 'Custom Task' }], 'system')
			return [{ id: 'custom-1', name: 'Custom Task' }]
		}`

		const doctype = createTestDoctype('Recipe', {
			tasks: {
				target: 'recipe-task',
				cardinality: 'noneOrMany',
				fetch: { method: 'custom', handler: customHandlerCode },
			},
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		const state = useLazyLink(doctype, '123', 'tasks')

		await state.reload()

		expect(state.loaded.value).toBe(true)
		expect(state.data.value).toEqual([{ id: 'custom-1', name: 'Custom Task' }])
	})

	it('throws error when custom handler fails', async () => {
		const brokenHandlerCode = `function(stonecrop, path, hst) {
			throw new Error('Handler failed')
		}`

		const doctype = createTestDoctype('Recipe', {
			tasks: {
				target: 'recipe-task',
				cardinality: 'noneOrMany',
				fetch: { method: 'custom', handler: brokenHandlerCode },
			},
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		const state = useLazyLink(doctype, '123', 'tasks')

		await expect(state.reload()).rejects.toThrow('Handler failed')
		expect(state.loaded.value).toBe(false)
		expect(state.error.value?.message).toContain('Handler failed')
	})

	it('reload refreshes data on subsequent calls', async () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany' },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		let callCount = 0
		const mockClient = {
			getRecord: vi.fn().mockImplementation(() => {
				callCount++
				return {
					record: { id: '123', title: 'Test Recipe', tasks: [{ id: `task-${callCount}`, name: `Task ${callCount}` }] },
					unknownLinks: [],
				}
			}),
		}
		stonecrop.setClient(mockClient as any)

		const state = useLazyLink(doctype, '123', 'tasks')

		await state.reload()
		expect(state.data.value).toEqual([{ id: 'task-1', name: 'Task 1' }])

		await state.reload()
		expect(state.data.value).toEqual([{ id: 'task-2', name: 'Task 2' }])
	})

	it('handles sync fetch strategy via fetchNestedData', async () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: {
				target: 'recipe-task',
				cardinality: 'noneOrMany',
				fetch: { method: 'sync' },
			},
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		const mockClient = {
			getRecord: vi.fn().mockResolvedValue({
				record: { id: '123', title: 'Test Recipe', tasks: [{ id: 't1', name: 'Sync Task' }] },
				unknownLinks: [],
			}),
		}
		stonecrop.setClient(mockClient as any)

		const state = useLazyLink(doctype, '123', 'tasks')

		await state.reload()

		expect(state.loaded.value).toBe(true)
		expect(state.data.value).toEqual([{ id: 't1', name: 'Sync Task' }])
	})

	it('handles lazy fetch strategy via fetchNestedData', async () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: {
				target: 'recipe-task',
				cardinality: 'noneOrMany',
				fetch: { method: 'lazy' },
			},
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		const mockClient = {
			getRecord: vi.fn().mockResolvedValue({
				record: { id: '123', title: 'Test Recipe', tasks: [{ id: 't1', name: 'Lazy Task' }] },
				unknownLinks: [],
			}),
		}
		stonecrop.setClient(mockClient as any)

		const state = useLazyLink(doctype, '123', 'tasks')

		await state.reload()

		expect(state.loaded.value).toBe(true)
		expect(state.data.value).toEqual([{ id: 't1', name: 'Lazy Task' }])
	})
})

describe('blockWorkflows', { tags: ['unit'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop

	beforeEach(() => {
		setActivePinia(createPinia())

		Registry._root = undefined as any
		Stonecrop._root = undefined as any
		;(HST as any).instance = undefined

		registry = new Registry()
		stonecrop = new Stonecrop(registry)

		vi.clearAllMocks()
	})

	it('isWorkflowReady returns ready true when no links have blockWorkflows', () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'lazy' } },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		// No data loaded yet, but lazy links without blockWorkflows don't block
		const status = stonecrop.isWorkflowReady(doctype, '123')
		expect(status.ready).toBe(true)
	})

	it('isWorkflowReady returns ready false when sync link data not loaded', () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync' } },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		// sync links have implicit blockWorkflows: true
		const status = stonecrop.isWorkflowReady(doctype, '123')
		expect(status.ready).toBe(false)
		expect(status.blockedLinks).toContain('tasks')
	})

	it('isWorkflowReady returns ready true when sync link data is loaded', () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync' } },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		// Simulate loading data into HST - ensure parent path exists first
		stonecrop.getStore().set('recipe.123', {}, 'system')
		stonecrop.getStore().set('recipe.123.tasks', [{ id: 't1', name: 'Task 1' }], 'system')

		const status = stonecrop.isWorkflowReady(doctype, '123')
		expect(status.ready).toBe(true)
		expect(status.blockedLinks).toBeUndefined()
	})

	it('isWorkflowReady returns ready true when blockWorkflows explicitly false', () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync' }, blockWorkflows: false },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		// blockWorkflows: false means workflow is not blocked
		const status = stonecrop.isWorkflowReady(doctype, '123')
		expect(status.ready).toBe(true)
	})

	it('isWorkflowReady returns ready true for new record', () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync' } },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		// New records don't block workflows
		const status = stonecrop.isWorkflowReady(doctype, 'new')
		expect(status.ready).toBe(true)
	})

	it('runAction throws when workflow is blocked', () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync' } },
		})
		registry.addDoctype(doctype)
		registry.registry['recipe']?.actions?.set('submit', ['submitAction'])
		stonecrop.setup(doctype)

		// Attempting to run action when workflow is blocked should throw
		expect(() => stonecrop.runAction(doctype, 'submit', ['123'])).toThrow(/Workflow blocked/)
	})

	it('runAction succeeds when workflow is not blocked', () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync' }, blockWorkflows: false },
		})
		registry.addDoctype(doctype)
		registry.registry['recipe']?.actions?.set('submit', ['submitAction'])
		stonecrop.setup(doctype)

		// Should not throw
		expect(() => stonecrop.runAction(doctype, 'submit', ['123'])).not.toThrow()
	})

	it('blocks workflow when any blocking link is unloaded', () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync' } },
			ingredients: { target: 'ingredient', cardinality: 'noneOrMany', fetch: { method: 'sync' } },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		stonecrop.getStore().set('recipe.123', {}, 'system')
		stonecrop.getStore().set('recipe.123.tasks', [{ id: 't1' }], 'system')
		// ingredients not loaded yet

		const status = stonecrop.isWorkflowReady(doctype, '123')
		expect(status.ready).toBe(false)
		expect(status.blockedLinks).toContain('ingredients')
	})

	it('lazy link with blockWorkflows true blocks workflow until loaded', () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'lazy' }, blockWorkflows: true },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		// Lazy link without blockWorkflows would not block, but with blockWorkflows: true it should
		const status = stonecrop.isWorkflowReady(doctype, '123')
		expect(status.ready).toBe(false)
		expect(status.blockedLinks).toContain('tasks')
	})

	it('lazy link with blockWorkflows true becomes ready after data loaded', () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'lazy' }, blockWorkflows: true },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		stonecrop.getStore().set('recipe.123', {}, 'system')
		stonecrop.getStore().set('recipe.123.tasks', [{ id: 't1' }], 'system')

		const status = stonecrop.isWorkflowReady(doctype, '123')
		expect(status.ready).toBe(true)
	})

	it('multiple links where some block and some do not', () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync' } },
			notes: { target: 'note', cardinality: 'noneOrMany', fetch: { method: 'sync' }, blockWorkflows: false },
			metadata: { target: 'metadata', cardinality: 'atMostOne', fetch: { method: 'lazy' }, blockWorkflows: false },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		stonecrop.getStore().set('recipe.123', {}, 'system')
		stonecrop.getStore().set('recipe.123.tasks', [{ id: 't1' }], 'system')
		// notes has blockWorkflows: false so ignored
		// metadata is lazy with blockWorkflows: false so ignored

		const status = stonecrop.isWorkflowReady(doctype, '123')
		expect(status.ready).toBe(true)
	})

	it('isWorkflowReady returns all blocked link names', () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync' } },
			steps: { target: 'step', cardinality: 'noneOrMany', fetch: { method: 'sync' } },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		const status = stonecrop.isWorkflowReady(doctype, '123')
		expect(status.ready).toBe(false)
		expect(status.blockedLinks).toContain('tasks')
		expect(status.blockedLinks).toContain('steps')
	})

	it('blockWorkflows on atMostOne link blocks correctly', () => {
		const doctype = createTestDoctype('Recipe', {
			parent: { target: 'recipe', cardinality: 'atMostOne', fetch: { method: 'sync' } },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		const status = stonecrop.isWorkflowReady(doctype, '123')
		expect(status.ready).toBe(false)
		expect(status.blockedLinks).toContain('parent')
	})

	it('isWorkflowReady with record id that does not exist yet (new-ish)', () => {
		const doctype = createTestDoctype('Recipe', {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync' } },
		})
		registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		// Record exists in store but tasks not loaded
		stonecrop.getStore().set('recipe.456', { name: 'Test' }, 'system')
		// Do NOT set tasks

		const status = stonecrop.isWorkflowReady(doctype, '456')
		expect(status.ready).toBe(false)
	})
})
