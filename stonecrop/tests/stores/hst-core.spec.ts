import { Map, List } from 'immutable'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { createHST, HSTNode, HSTProxy } from '../../src/stores/hst'

describe('HST Core Functionality', () => {
	describe('Tree Navigation', () => {
		let testData: Record<string, any>
		let hst: HSTNode

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
			expect(typeof userNode.getAncestor).toBe('function')
		})

		it('should return correct ancestor nodes', () => {
			const settingsNode = hst.getNode('user.profile.settings')
			const profileNode = settingsNode.getAncestor()
			const userNode = profileNode?.getAncestor()
			const rootNode = userNode?.getAncestor()

			expect(profileNode?.getPath()).toBe('user.profile')
			expect(userNode?.getPath()).toBe('user')
			expect(rootNode?.getPath()).toBe('')
		})

		it('should return null ancestor for root node', () => {
			expect(hst.getAncestor()).toBeNull()
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

	describe('Get/Set Operations', () => {
		describe('Plain Objects', () => {
			let plainObject: any
			let hst: HSTNode

			beforeEach(() => {
				plainObject = {
					user: {
						name: 'John',
						profile: {
							age: 30,
							address: {
								city: 'New York',
							},
						},
					},
					settings: {
						theme: 'dark',
					},
				}
				hst = createHST(plainObject, 'PlainTest')
			})

			it('should get top-level properties', () => {
				expect(hst.get('user')).toEqual(plainObject.user)
				expect(hst.get('settings')).toEqual(plainObject.settings)
			})

			it('should get nested properties', () => {
				expect(hst.get('user.name')).toBe('John')
				expect(hst.get('user.profile.age')).toBe(30)
				expect(hst.get('user.profile.address.city')).toBe('New York')
				expect(hst.get('settings.theme')).toBe('dark')
			})

			it('should return undefined for non-existent paths', () => {
				expect(hst.get('nonexistent')).toBeUndefined()
				expect(hst.get('user.nonexistent')).toBeUndefined()
				expect(hst.get('user.profile.nonexistent.deep')).toBeUndefined()
			})

			it('should set top-level properties', () => {
				hst.set('newProp', 'newValue')
				expect(plainObject.newProp).toBe('newValue')
			})

			it('should set nested properties', () => {
				hst.set('user.name', 'Jane')
				expect(plainObject.user.name).toBe('Jane')

				hst.set('user.profile.age', 25)
				expect(plainObject.user.profile.age).toBe(25)
			})

			it('should handle nested property creation if path exists', () => {
				// First create the intermediate objects
				hst.set('user.profile', {})
				hst.set('user.profile.location', {})
				hst.set('user.profile.location.country', 'USA')
				expect(hst.get('user.profile.location.country')).toBe('USA')
			})

			it('should handle array indices', () => {
				plainObject.items = ['item1', 'item2']
				hst.set('items.0', 'updatedItem1')
				expect(plainObject.items[0]).toBe('updatedItem1')
			})

			it('should check existence with has()', () => {
				expect(hst.has('user')).toBe(true)
				expect(hst.has('user.name')).toBe(true)
				expect(hst.has('nonexistent')).toBe(false)
				expect(hst.has('user.nonexistent')).toBe(false)
			})
		})

		describe('Vue Reactive Objects', () => {
			let reactiveObject: any
			let hst: HSTNode

			beforeEach(() => {
				// Mock Vue reactive object
				reactiveObject = {
					user: {
						name: 'John',
						profile: {
							age: 30,
						},
					},
					__v_isReactive: true, // Vue reactive marker
				}
				hst = createHST(reactiveObject, 'ReactiveTest')
			})

			it('should work with Vue reactive objects', () => {
				expect(hst.get('user.name')).toBe('John')
				hst.set('user.name', 'Jane')
				expect(reactiveObject.user.name).toBe('Jane')
			})

			it('should preserve reactivity when setting values', () => {
				hst.set('user.profile.newField', 'newValue')
				expect(reactiveObject.user.profile.newField).toBe('newValue')
			})
		})

		describe('Immutable Objects', () => {
			let immutableObject: Map<string, any>
			let hst: HSTNode

			beforeEach(() => {
				immutableObject = Map({
					user: Map({
						name: 'John',
						profile: Map({
							age: 30,
						}),
					}),
					settings: Map({
						theme: 'dark',
					}),
				})
				hst = createHST(immutableObject, 'ImmutableTest')
			})

			it('should get from Immutable structures', () => {
				expect(hst.get('user.name')).toBe('John')
				expect(hst.get('user.profile.age')).toBe(30)
				expect(hst.get('settings.theme')).toBe('dark')
			})

			it('should prevent setting in Immutable structures (throws error)', () => {
				const originalName = hst.get('user.name')

				// Should throw an error when trying to set
				expect(() => hst.set('user.name', 'Jane')).toThrow('Cannot directly mutate immutable objects')

				// Original immutable object should remain unchanged
				expect(immutableObject.getIn(['user', 'name'])).toBe(originalName)
			})

			it('should prevent nested Immutable structure mutations', () => {
				expect(() => hst.set('user.profile.location', 'NYC')).toThrow('Cannot directly mutate immutable objects')
			})

			it('should prevent Immutable List mutations', () => {
				const listObject = Map({
					items: List(['item1', 'item2', 'item3']),
				})
				const listHST = createHST(listObject, 'ListTest')

				expect(listHST.get('items.0')).toBe('item1')
				expect(listHST.get('items.1')).toBe('item2')

				expect(() => listHST.set('items.1', 'updatedItem2')).toThrow('Cannot directly mutate immutable objects')
			})
		})

		describe('Mixed Object Types', () => {
			let mixedObject: any
			let hst: HSTNode

			beforeEach(() => {
				mixedObject = {
					plainData: {
						name: 'John',
					},
					immutableData: Map({
						settings: Map({
							theme: 'dark',
						}),
					}),
					arrayData: ['item1', 'item2'],
				}
				hst = createHST(mixedObject, 'MixedTest')
			})

			it('should handle mixed object types', () => {
				expect(hst.get('plainData.name')).toBe('John')
				expect(hst.get('immutableData.settings.theme')).toBe('dark')
				expect(hst.get('arrayData.0')).toBe('item1')
			})

			it('should handle mixed structures with proper error handling', () => {
				hst.set('plainData.name', 'Jane')
				expect(() => hst.set('immutableData.settings.theme', 'light')).toThrow(
					'Cannot directly mutate immutable objects'
				)
				hst.set('arrayData.0', 'updatedItem1')

				expect(mixedObject.plainData.name).toBe('Jane')
				expect(hst.get('immutableData.settings.theme')).toBe('dark') // Unchanged
				expect(mixedObject.arrayData[0]).toBe('updatedItem1')
			})
		})

		describe('Error Handling', () => {
			let hst: HSTNode

			beforeEach(() => {
				hst = createHST(
					{
						user: {
							name: 'John',
						},
					},
					'ErrorTest'
				)
			})

			it('should handle invalid paths gracefully', () => {
				expect(() => hst.get('')).not.toThrow()
				expect(() => hst.get('.')).not.toThrow()
				expect(() => hst.get('..')).not.toThrow()
			})

			it('should handle error paths as expected', () => {
				expect(() => hst.set('user.profile.settings.deep', 'value')).toThrow(
					'Cannot set property on null/undefined path'
				)
			})

			it('should handle malformed paths consistently', () => {
				// Current implementation may handle this differently
				expect(hst.get('user..name')).toBeDefined()
				expect(hst.get('user..name')).toBe('John')
				expect(() => hst.set('user..name', 'value')).not.toThrow()
			})
		})

		describe('Performance', () => {
			let largeObject: any
			let hst: HSTNode

			beforeEach(() => {
				// Create a large nested object for performance testing
				largeObject = {}
				for (let i = 0; i < 100; i++) {
					largeObject[`level1_${i}`] = {}
					for (let j = 0; j < 50; j++) {
						largeObject[`level1_${i}`][`level2_${j}`] = {
							value: `data_${i}_${j}`,
							metadata: {
								type: 'test',
								index: i * 50 + j,
							},
						}
					}
				}
				hst = createHST(largeObject, 'PerformanceTest')
			})

			it('should handle large objects efficiently', () => {
				const startTime = performance.now()

				// Perform multiple operations
				for (let i = 0; i < 10; i++) {
					hst.get(`level1_${i}.level2_${i}.value`)
					hst.set(`level1_${i}.level2_${i}.processed`, true)
				}

				const endTime = performance.now()
				expect(endTime - startTime).toBeLessThan(20) // Should complete within 10ms
			})

			it('should maintain performance with deep nesting', () => {
				const startTime = performance.now()

				// Access deeply nested paths
				for (let i = 0; i < 50; i++) {
					const path = `level1_${i}.level2_${i}.metadata.index`
					expect(hst.get(path)).toBe(i * 50 + i)
				}

				const endTime = performance.now()
				expect(endTime - startTime).toBeLessThan(20) // Should be fast
			})
		})
	})

	describe('HSTProxy Functionality', () => {
		let testStore: any
		let proxy: HSTProxy

		beforeEach(() => {
			testStore = {
				user: {
					name: 'John',
					age: 30,
				},
			}
			proxy = new HSTProxy(testStore, 'TestProxy', '')
		})

		it('should proxy get operations to underlying store', () => {
			expect(proxy.get('user.name')).toBe('John')
			expect(proxy.get('user.age')).toBe(30)
		})

		it('should proxy set operations to underlying store', () => {
			proxy.set('user.name', 'Jane')
			expect(testStore.user.name).toBe('Jane')
		})

		it('should provide tree navigation methods', () => {
			expect(typeof proxy.getAncestor).toBe('function')
			expect(typeof proxy.getRoot).toBe('function')
			expect(typeof proxy.getPath).toBe('function')
		})

		it('should work with different base paths', () => {
			const nestedData = { data: { user: { name: 'Test' } } }
			const rootProxy = new HSTProxy(nestedData, 'TestProxy', '')
			expect(rootProxy.get('data.user.name')).toBe('Test')
		})
	})
})
