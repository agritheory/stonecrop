import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Map, List } from 'immutable'
import { createHST, HST, HSTProxy } from '../../src/stores/hst' // Adjust path as needed

describe('HST Tree Navigation', () => {
	describe('Basic Tree Structure', () => {
		let testData: any
		let hst: any

		beforeEach(() => {
			testData = {
				user: {
					name: 'John',
					profile: {
						age: 30,
						settings: {
							theme: 'dark',
							notifications: {
								email: true,
								push: false,
							},
						},
					},
				},
				config: {
					app: {
						version: '1.0.0',
					},
				},
			}
			hst = createHST(testData, 'TestDoc')
		})

		it('should navigate to nested properties and maintain tree structure', () => {
			const userNode = hst.getNode('user')
			const profileNode = hst.getNode('user.profile')
			const settingsNode = hst.getNode('user.profile.settings')

			expect(userNode.getPath()).toBe('user')
			expect(profileNode.getPath()).toBe('user.profile')
			expect(settingsNode.getPath()).toBe('user.profile.settings')
		})

		it('should get raw values with get() method', () => {
			expect(hst.get('user')).toEqual(testData.user)
			expect(hst.get('user.name')).toBe('John')
			expect(hst.get('user.profile.age')).toBe(30)
		})

		it('should return tree nodes with getNode() method', () => {
			const userNode = hst.getNode('user')
			expect(userNode.getPath()).toBe('user')
			expect(typeof userNode.getParent).toBe('function')
		})

		it('should return correct parent nodes', () => {
			const settingsNode = hst.getNode('user.profile.settings')
			const profileNode = settingsNode.getParent()
			const userNode = profileNode?.getParent()
			const rootNode = userNode?.getParent()

			expect(profileNode?.getPath()).toBe('user.profile')
			expect(userNode?.getPath()).toBe('user')
			expect(rootNode?.getPath()).toBe('')
		})

		it('should return null parent for root node', () => {
			expect(hst.getParent()).toBeNull()
		})

		it('should always return the same root node', () => {
			const deepNode = hst.getNode('user.profile.settings.notifications')
			const rootFromDeep = deepNode.getRoot()
			const rootFromShallow = hst.getNode('user').getRoot()

			expect(rootFromDeep).toBe(rootFromShallow)
			expect(rootFromDeep.getPath()).toBe('')
		})

		it('should calculate correct depth', () => {
			expect(hst.getDepth()).toBe(0)
			expect(hst.getNode('user').getDepth()).toBe(1)
			expect(hst.getNode('user.profile').getDepth()).toBe(2)
			expect(hst.getNode('user.profile.settings').getDepth()).toBe(3)
			expect(hst.getNode('user.profile.settings.notifications').getDepth()).toBe(4)
		})

		it('should generate correct breadcrumbs', () => {
			expect(hst.getBreadcrumbs()).toEqual([])
			expect(hst.getNode('user').getBreadcrumbs()).toEqual(['user'])
			expect(hst.getNode('user.profile').getBreadcrumbs()).toEqual(['user', 'profile'])
			expect(hst.getNode('user.profile.settings').getBreadcrumbs()).toEqual(['user', 'profile', 'settings'])
			expect(hst.getNode('user.profile.settings.notifications').getBreadcrumbs()).toEqual([
				'user',
				'profile',
				'settings',
				'notifications',
			])
		})
	})

	describe('Tree Navigation with Different Store Types', () => {
		let mixedData: any
		let hst: any

		beforeEach(() => {
			mixedData = {
				plainObject: {
					nested: {
						value: 'plain',
					},
				},
				reactiveObject: {
					__v_isReactive: true,
					nested: {
						__v_isReactive: true,
						value: 'reactive',
					},
				},
				piniaStore: {
					$id: 'test-store',
					$state: {
						nested: {
							value: 'pinia',
						},
					},
					$patch: vi.fn(),
				},
				immutableMap: Map({
					nested: Map({
						value: 'immutable',
					}),
				}),
			}
			hst = createHST(mixedData, 'MixedDoc')
		})

		it('should maintain tree structure across different store types', () => {
			const plainNested = hst.getNode('plainObject.nested')
			const reactiveNested = hst.getNode('reactiveObject.nested')
			const piniaNested = hst.getNode('piniaStore.nested')
			const immutableNested = hst.getNode('immutableMap.nested')

			expect(plainNested.getPath()).toBe('plainObject.nested')
			expect(reactiveNested.getPath()).toBe('reactiveObject.nested')
			expect(piniaNested.getPath()).toBe('piniaStore.nested')
			expect(immutableNested.getPath()).toBe('immutableMap.nested')
		})

		it('should navigate back to parents correctly for different store types', () => {
			const plainNested = hst.getNode('plainObject.nested')
			const reactiveNested = hst.getNode('reactiveObject.nested')
			const piniaNested = hst.getNode('piniaStore.nested')
			const immutableNested = hst.getNode('immutableMap.nested')

			expect(plainNested.getParent()?.getPath()).toBe('plainObject')
			expect(reactiveNested.getParent()?.getPath()).toBe('reactiveObject')
			expect(piniaNested.getParent()?.getPath()).toBe('piniaStore')
			expect(immutableNested.getParent()?.getPath()).toBe('immutableMap')
		})

		it('should access root from any nested node in mixed stores', () => {
			const deepNodes = [
				hst.getNode('plainObject.nested'),
				hst.getNode('reactiveObject.nested'),
				hst.getNode('piniaStore.nested'),
				hst.getNode('immutableMap.nested'),
			]

			deepNodes.forEach(node => {
				const root = node.getRoot()
				expect(root.getPath()).toBe('')
				expect(root).toStrictEqual(hst) // Use toStrictEqual for object comparison
			})
		})
	})

	describe('HST Singleton', () => {
		it('should return the same HST instance', () => {
			const hst1 = HST.getInstance()
			const hst2 = HST.getInstance()
			expect(hst1).toBe(hst2)
		})

		it('should access registry from HST singleton', () => {
			const hst = HST.getInstance()
			// Mock Registry._root for testing
			const mockRegistry = { registry: { TestDoc: { doctype: 'TestDoc' } } }
			;(global as any).Registry = { _root: mockRegistry }

			expect(hst.getRegistry()).toBe(mockRegistry)
		})

		it('should get doctype metadata', () => {
			const hst = HST.getInstance()
			const mockMeta = { doctype: 'TestDoc', schema: {} }
			const mockRegistry = { registry: { TestDoc: mockMeta } }
			;(global as any).Registry = { _root: mockRegistry }

			expect(hst.getDoctypeMeta('TestDoc')).toBe(mockMeta)
		})
	})

	describe('Proxy Behavior', () => {
		let testData: any
		let hst: any

		beforeEach(() => {
			testData = {
				user: {
					name: 'John',
					age: 30,
				},
			}
			hst = createHST(testData, 'TestDoc')
		})

		it('should allow direct property access through proxy', () => {
			// Proxy access returns tree nodes for navigation
			expect(hst.user.getPath()).toBe('user')
			expect(hst.user.name.getPath()).toBe('user.name')
		})

		it('should allow direct property setting through proxy', () => {
			hst.user.name = 'Jane'
			expect(testData.user.name).toBe('Jane')
		})

		it('should maintain tree methods even with proxy access', () => {
			const userNode = hst.user
			expect(userNode.getPath()).toBe('user')

			// Compare paths instead of object identity since getParent creates new instances
			const parent = userNode.getParent()
			expect(parent?.getPath()).toBe('')
		})

		it('should get raw values vs tree nodes', () => {
			// get() returns raw values
			expect(hst.get('user.name')).toBe('John')
			// proxy access returns tree nodes
			expect(hst.user.name.getPath()).toBe('user.name')
		})
	})

	describe('Edge Cases', () => {
		let hst: any

		beforeEach(() => {
			const testData = {
				nullValue: null,
				undefinedValue: undefined,
				emptyObject: {},
				arrayValue: [{ name: 'item1' }, { name: 'item2' }],
			}
			hst = createHST(testData, 'EdgeCaseDoc')
		})

		it('should handle null and undefined values in tree navigation', () => {
			expect(hst.has('nullValue')).toBe(true)
			expect(hst.has('undefinedValue')).toBe(true)
			expect(hst.get('nullValue')).toBeNull()
			expect(hst.get('undefinedValue')).toBeUndefined()
		})

		it('should handle empty objects', () => {
			const emptyNode = hst.getNode('emptyObject')
			expect(emptyNode.getPath()).toBe('emptyObject')
			expect(emptyNode.getParent()).toStrictEqual(hst)
		})

		it('should handle array access with tree navigation', () => {
			const arrayNode = hst.getNode('arrayValue')
			const firstItem = arrayNode.getNode('0')

			expect(arrayNode.getPath()).toBe('arrayValue')
			expect(firstItem.getPath()).toBe('arrayValue.0')
			expect(firstItem.getParent()?.getPath()).toBe('arrayValue')
		})

		it('should throw error when setting on empty path', () => {
			expect(() => hst.set('', 'value')).toThrow('Cannot set value on empty path')
		})

		it('should handle deeply nested parent navigation', () => {
			const testData = { a: { b: { c: { d: { e: 'deep' } } } } }
			const deepHst = createHST(testData, 'DeepDoc')

			const deepNode = deepHst.getNode('a.b.c.d.e')
			let current = deepNode
			const pathsUpward = []

			// Navigate up the tree
			while (current && current.getParent()) {
				current = current.getParent()
				pathsUpward.push(current?.getPath())
			}

			expect(pathsUpward).toEqual(['a.b.c.d', 'a.b.c', 'a.b', 'a', ''])
		})
	})

	describe('Doctype Integration', () => {
		it('should create HST with doctype information', () => {
			const testData = { name: 'test' }
			const hst = createHST(testData, 'User', 'Organization')

			// Access private properties for testing
			const proxy = hst as any
			expect(proxy.doctype).toBe('User')
			expect(proxy.parentDoctype).toBe('Organization')
		})

		it('should propagate doctype to child nodes', () => {
			const testData = { user: { profile: { settings: {} } } }
			const hst = createHST(testData, 'User')

			const childNode = hst.getNode('user.profile')
			const proxy = childNode as any
			expect(proxy.doctype).toBe('User')
		})
	})
})
