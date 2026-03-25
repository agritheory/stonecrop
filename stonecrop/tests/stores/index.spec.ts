import { describe, it, expect, beforeEach } from 'vitest'
import { Map } from 'immutable'

import Doctype from '../../src/doctype.js'
import Registry from '../../src/registry.js'
import { Stonecrop } from '../../src/stonecrop.js'
import { hst, pinia as stonecropPinia } from '../../src/stores/index.js'
import { HST, HSTProxy, createHST } from '../../src/stores/hst.js'

describe('Stonecrop Stores', () => {
	let registry: Registry
	let stonecrop: Stonecrop

	beforeEach(() => {
		// Reset the singletons
		;(Registry as any)._root = undefined
		;(Stonecrop as any)._root = undefined

		registry = new Registry()
		stonecrop = new Stonecrop(registry)
	})

	describe('stores/index exports', () => {
		it('exports HST singleton instance', () => {
			expect(hst).toBeDefined()
			expect(hst).toBeInstanceOf(HST)
		})

		it('exports configured Pinia instance', () => {
			expect(stonecropPinia).toBeDefined()
			expect(typeof stonecropPinia.install).toBe('function')
			expect(typeof stonecropPinia.use).toBe('function')
		})

		it('HST instance is singleton', () => {
			const hst1 = HST.getInstance()
			const hst2 = HST.getInstance()
			expect(hst1).toBe(hst2)
			expect(hst).toBe(hst1)
		})
	})

	describe('HST singleton', () => {
		const mockDoctype = new Doctype('Task', undefined, undefined, Map())

		beforeEach(() => {
			registry.addDoctype(mockDoctype)
		})

		it('provides access to global registry', () => {
			const hstInstance = HST.getInstance()

			// Mock the global registry
			if (typeof globalThis !== 'undefined') {
				;(globalThis as any).Registry = { _root: registry }
			}

			const retrievedRegistry = hstInstance.getRegistry()
			expect(retrievedRegistry).toBeDefined()
		})

		it('returns undefined when no global registry', () => {
			const hstInstance = HST.getInstance()

			// Clear global registry
			if (typeof globalThis !== 'undefined') {
				delete (globalThis as any).Registry
			}

			const retrievedRegistry = hstInstance.getRegistry()
			expect(retrievedRegistry).toBeUndefined()
		})

		it('provides doctype access through global registry', () => {
			const hstInstance = HST.getInstance()

			// Mock the global registry with proper structure
			if (typeof globalThis !== 'undefined') {
				;(globalThis as any).Registry = {
					_root: {
						registry: { Task: mockDoctype },
					},
				}
			}

			const doctype = hstInstance.getDoctypeMeta('Task')
			expect(doctype).toBe(mockDoctype)
		})

		it('returns undefined for unknown doctype', () => {
			const hstInstance = HST.getInstance()

			if (typeof globalThis !== 'undefined') {
				;(globalThis as any).Registry = {
					_root: {
						registry: { Task: mockDoctype },
					},
				}
			}

			const doctype = hstInstance.getDoctypeMeta('Unknown')
			expect(doctype).toBeUndefined()
		})
	})

	describe('HSTProxy functionality', () => {
		it('creates HST proxy with required parameters', () => {
			const target = { name: 'Test', value: 42 }
			const proxy = new HSTProxy(target, 'TestDoctype')

			expect(proxy.get('name')).toBe('Test')
			expect(proxy.get('value')).toBe(42)
		})

		it('handles path-based navigation', () => {
			const target = {
				user: {
					profile: {
						name: 'John',
						settings: { theme: 'dark' },
					},
				},
			}

			const proxy = new HSTProxy(target, 'User')

			expect(proxy.get('user.profile.name')).toBe('John')
			expect(proxy.get('user.profile.settings.theme')).toBe('dark')
			expect(proxy.has('user.profile.name')).toBe(true)
			expect(proxy.has('user.nonexistent')).toBe(false)
		})

		it('supports setting values through paths', () => {
			const target = { user: { name: 'John' } }
			const proxy = new HSTProxy(target, 'User')

			proxy.set('user.name', 'Jane')
			expect(proxy.get('user.name')).toBe('Jane')
		})

		it('provides tree navigation capabilities', () => {
			const target = { level1: { level2: { level3: 'value' } } }
			const proxy = new HSTProxy(target, 'TestDoctype')

			const level2Node = proxy.getNode('level1.level2')
			expect(level2Node).toBeDefined()
			expect(level2Node?.get('level3')).toBe('value')

			const parent = level2Node?.getParent()
			expect(parent).toBeDefined()
			expect(parent?.getPath()).toBe('level1')
		})

		it('provides tree structure information', () => {
			const target = { a: { b: { c: { d: 'value' } } } }
			const proxy = new HSTProxy(target, 'TestDoctype', 'a.b')

			expect(proxy.getPath()).toBe('a.b')
			expect(proxy.getDepth()).toBe(2)
			expect(proxy.getBreadcrumbs()).toEqual(['a', 'b'])
		})
	})

	describe('createHST factory function', () => {
		it('creates HST node from target object', () => {
			const target = { name: 'Test', data: { value: 42 } }
			const hstNode = createHST(target, 'TestDoctype')

			expect(hstNode.get('name')).toBe('Test')
			expect(hstNode.get('data.value')).toBe(42)
		})

		it('supports parent doctype specification', () => {
			const target = { title: 'Subtask' }
			const hstNode = createHST(target, 'Task', 'Project')

			expect(hstNode.get('title')).toBe('Subtask')
		})

		it('provides tree navigation in created nodes', () => {
			const target = {
				project: {
					tasks: [{ title: 'Task 1' }, { title: 'Task 2' }],
				},
			}

			const hstNode = createHST(target, 'Project')
			const task = hstNode.getNode('project.tasks.0')

			expect(task).toBeDefined()
			expect(task?.get('title')).toBe('Task 1')
		})
	})

	describe('HST error handling', () => {
		it('handles invalid path access gracefully', () => {
			const target = { user: { name: 'John' } }
			const proxy = new HSTProxy(target, 'User')

			expect(proxy.get('nonexistent.path')).toBeUndefined()
			expect(proxy.has('nonexistent.path')).toBe(false)
		})

		it('handles edge cases in tree navigation', () => {
			const target = { data: null }
			const proxy = new HSTProxy(target, 'TestDoctype')

			expect(proxy.get('data')).toBe(null)
			expect(proxy.has('data')).toBe(true)
			expect(proxy.has('data.property')).toBe(false)
		})

		it('handles empty path correctly', () => {
			const target = { name: 'Test' }
			const proxy = new HSTProxy(target, 'TestDoctype')

			expect(proxy.get('')).toBe(target)
			expect(proxy.has('')).toBe(true)
		})

		it('throws error when setting empty path', () => {
			const target = {}
			const proxy = new HSTProxy(target, 'TestDoctype')

			expect(() => proxy.set('', 'value')).toThrow('Cannot set value on empty path')
		})
	})
})
