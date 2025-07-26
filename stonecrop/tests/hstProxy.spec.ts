import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Map, List } from 'immutable'
import { createHST, HSTProxy } from '../src/stores/hst'

describe('HST Core Get/Set Operations', () => {
	describe('Plain Objects', () => {
		let plainObject: any
		let hst: any

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
			hst = createHST(plainObject)
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

			hst.set('settings.theme', 'light')
			expect(plainObject.settings.theme).toBe('light')
		})

		it('should handle has() correctly', () => {
			expect(hst.has('user')).toBe(true)
			expect(hst.has('user.name')).toBe(true)
			expect(hst.has('user.profile.address.city')).toBe(true)
			expect(hst.has('nonexistent')).toBe(false)
			expect(hst.has('user.nonexistent')).toBe(false)
		})

		it('should handle empty and invalid paths', () => {
			expect(hst.get('')).toEqual(plainObject)
			expect(hst.has('')).toBe(true)
			expect(() => hst.set('', 'value')).toThrow()
		})
	})

	describe('Vue Reactive Objects', () => {
		let reactiveObject: any
		let hst: any

		beforeEach(() => {
			// Mock Vue reactive object
			reactiveObject = {
				__v_isReactive: true,
				count: 0,
				user: {
					__v_isReactive: true,
					name: 'Vue User',
				},
			}
			hst = createHST(reactiveObject)
		})

		it('should detect Vue reactive objects', () => {
			const proxy = new HSTProxy(reactiveObject)
			expect(proxy['isVueReactive'](reactiveObject)).toBe(true)
		})

		it('should get properties from Vue reactive objects', () => {
			expect(hst.get('count')).toBe(0)
			expect(hst.get('user.name')).toBe('Vue User')
		})

		it('should set properties on Vue reactive objects', () => {
			hst.set('count', 5)
			expect(reactiveObject.count).toBe(5)

			hst.set('user.name', 'Updated Vue User')
			expect(reactiveObject.user.name).toBe('Updated Vue User')
		})
	})

	describe('Pinia Store Objects', () => {
		let piniaStore: any
		let hst: any

		beforeEach(() => {
			// Mock Pinia store
			const mockPatch = vi.fn()
			piniaStore = {
				$id: 'test-store',
				$state: {
					count: 0,
					user: {
						name: 'Pinia User',
					},
				},
				$patch: mockPatch,
				// Some stores might have getters at root level
				doubledCount: 0,
			}
			hst = createHST(piniaStore)
		})

		it('should detect Pinia store objects', () => {
			const proxy = new HSTProxy(piniaStore)
			expect(proxy['isPiniaStore'](piniaStore)).toBe(true)
		})

		it('should get properties from Pinia state', () => {
			expect(hst.get('count')).toBe(0)
			expect(hst.get('user.name')).toBe('Pinia User')
		})

		it('should get root-level properties (getters)', () => {
			expect(hst.get('doubledCount')).toBe(0)
		})

		it('should use $patch for setting properties', () => {
			hst.set('count', 10)
			expect(piniaStore.$patch).toHaveBeenCalledWith({ count: 10 })
		})

		it('should handle nested Pinia state updates', () => {
			// For nested updates, we need to navigate to the parent first
			hst.set('user.name', 'Updated Pinia User')
			// This should update the nested object directly
			expect(piniaStore.$state.user.name).toBe('Updated Pinia User')
		})
	})

	describe('Immutable Objects', () => {
		let immutableMap: any
		let immutableList: any
		let hst: any

		beforeEach(() => {
			immutableMap = Map({
				user: Map({
					name: 'Immutable User',
					profile: Map({
						age: 25,
						settings: List(['dark', 'compact']),
					}),
				}),
				count: 42,
			})
			hst = createHST(immutableMap)

			immutableList = List([Map({ id: 1, name: 'Item 1' }), Map({ id: 2, name: 'Item 2' }), 'plain string'])
		})

		it('should detect Immutable objects', () => {
			const proxy = new HSTProxy(immutableMap)
			expect(proxy['isImmutable'](immutableMap)).toBe(true)
			expect(proxy['isImmutable'](immutableList)).toBe(true)
		})

		it('should get properties from Immutable Map', () => {
			expect(hst.get('count')).toBe(42)
			expect(hst.get('user.name')).toBe('Immutable User')
			expect(hst.get('user.profile.age')).toBe(25)
		})

		it('should get properties from nested Immutable structures', () => {
			expect(hst.get('user.profile.settings.0')).toBe('dark')
			expect(hst.get('user.profile.settings.1')).toBe('compact')
		})

		it('should handle has() correctly for Immutable objects', () => {
			expect(hst.has('user')).toBe(true)
			expect(hst.has('user.name')).toBe(true)
			expect(hst.has('user.profile.age')).toBe(true)
			expect(hst.has('user.profile.settings')).toBe(true)
			expect(hst.has('nonexistent')).toBe(false)
			expect(hst.has('user.nonexistent')).toBe(false)
		})

		it('should handle Immutable List access', () => {
			const listHst = createHST(immutableList)
			expect(listHst.get('0.name')).toBe('Item 1')
			expect(listHst.get('1.id')).toBe(2)
			expect(listHst.get('2')).toBe('plain string')
			expect(listHst.has('0')).toBe(true)
			expect(listHst.has('1.name')).toBe(true)
			expect(listHst.has('3')).toBe(false)
		})

		it('should throw error when trying to set on Immutable objects', () => {
			expect(() => hst.set('count', 100)).toThrow('Cannot directly mutate immutable objects')
			expect(() => hst.set('user.name', 'New Name')).toThrow('Cannot directly mutate immutable objects')
		})

		it('should return undefined for non-existent paths in Immutable objects', () => {
			expect(hst.get('nonexistent')).toBeUndefined()
			expect(hst.get('user.nonexistent')).toBeUndefined()
			expect(hst.get('user.profile.nonexistent.deep')).toBeUndefined()
		})
	})

	describe('Mixed Store Types', () => {
		let mixedObject: any
		let hst: any

		beforeEach(() => {
			const mockPatch = vi.fn()
			mixedObject = {
				// Plain object
				plainData: {
					value: 'plain',
				},
				// Vue reactive
				reactive: {
					__v_isReactive: true,
					value: 'reactive',
				},
				// Pinia store
				store: {
					$id: 'nested-store',
					$state: {
						value: 'pinia',
					},
					$patch: mockPatch,
				},
				// Immutable Map
				immutableMap: Map({
					value: 'immutable-map',
					nested: Map({
						deep: 'deep-value',
					}),
				}),
				// Immutable List
				immutableList: List(['first', 'second', Map({ item: 'third' })]),
			}
			hst = createHST(mixedObject)
		})

		it('should handle mixed object types correctly', () => {
			expect(hst.get('plainData.value')).toBe('plain')
			expect(hst.get('reactive.value')).toBe('reactive')
			expect(hst.get('store.value')).toBe('pinia')
			expect(hst.get('immutableMap.value')).toBe('immutable-map')
			expect(hst.get('immutableMap.nested.deep')).toBe('deep-value')
			expect(hst.get('immutableList.0')).toBe('first')
			expect(hst.get('immutableList.2.item')).toBe('third')
		})

		it('should handle has() correctly for mixed types', () => {
			expect(hst.has('plainData.value')).toBe(true)
			expect(hst.has('reactive.value')).toBe(true)
			expect(hst.has('store.value')).toBe(true)
			expect(hst.has('immutableMap.value')).toBe(true)
			expect(hst.has('immutableMap.nested.deep')).toBe(true)
			expect(hst.has('immutableList.0')).toBe(true)
			expect(hst.has('immutableList.2.item')).toBe(true)
			expect(hst.has('immutableList.3')).toBe(false)
		})

		it('should set values correctly based on object type', () => {
			hst.set('plainData.value', 'updated-plain')
			expect(mixedObject.plainData.value).toBe('updated-plain')

			hst.set('reactive.value', 'updated-reactive')
			expect(mixedObject.reactive.value).toBe('updated-reactive')

			hst.set('store.value', 'updated-pinia')
			expect(mixedObject.store.$patch).toHaveBeenCalledWith({ value: 'updated-pinia' })

			// Immutable objects should throw errors
			expect(() => hst.set('immutableMap.value', 'updated-immutable')).toThrow()
			expect(() => hst.set('immutableList.0', 'updated-list-item')).toThrow()
		})

		it('should handle complex mixed nested structures', () => {
			// Add a complex nested structure with all types
			mixedObject.complex = {
				plain: {
					immutable: Map({
						reactive: {
							__v_isReactive: true,
							store: {
								$id: 'deep-store',
								$state: { deepValue: 'very-deep' },
								$patch: vi.fn(),
							},
						},
					}),
				},
			}

			expect(hst.get('complex.plain.immutable.reactive.store.deepValue')).toBe('very-deep')
			expect(hst.has('complex.plain.immutable.reactive.store.deepValue')).toBe(true)

			// Should be able to set on the store part
			hst.set('complex.plain.immutable.reactive.store.deepValue', 'updated-deep')
			expect(mixedObject.complex.plain.immutable.get('reactive').store.$patch).toHaveBeenCalledWith({
				deepValue: 'updated-deep',
			})
		})
	})

	describe('Edge Cases', () => {
		let hst: any

		beforeEach(() => {
			const testObject = {
				nullValue: null,
				undefinedValue: undefined,
				emptyObject: {},
				arrayValue: [1, 2, { nested: 'value' }],
				immutableWithNull: Map({
					nullProp: null,
					undefinedProp: undefined,
				}),
			}
			hst = createHST(testObject)
		})

		it('should handle null and undefined values', () => {
			expect(hst.get('nullValue')).toBeNull()
			expect(hst.get('undefinedValue')).toBeUndefined()
			expect(hst.has('nullValue')).toBe(true) // null is a valid value
			expect(hst.has('undefinedValue')).toBe(true) // undefined exists as property
		})

		it('should handle null and undefined in Immutable objects', () => {
			expect(hst.get('immutableWithNull.nullProp')).toBeNull()
			expect(hst.get('immutableWithNull.undefinedProp')).toBeUndefined()
			expect(hst.has('immutableWithNull.nullProp')).toBe(true)
			expect(hst.has('immutableWithNull.undefinedProp')).toBe(true)
		})

		it('should handle empty objects', () => {
			expect(hst.get('emptyObject')).toEqual({})
			expect(hst.has('emptyObject')).toBe(true)
			expect(hst.has('emptyObject.nonexistent')).toBe(false)
		})

		it('should handle array access', () => {
			expect(hst.get('arrayValue.0')).toBe(1)
			expect(hst.get('arrayValue.2.nested')).toBe('value')
		})

		it('should throw error when setting on null/undefined path', () => {
			expect(() => hst.set('nullValue.something', 'value')).toThrow()
			expect(() => hst.set('undefinedValue.something', 'value')).toThrow()
		})

		it('should handle empty Immutable objects', () => {
			const emptyMap = Map()
			const emptyList = List()
			const emptyHst = createHST({ emptyMap, emptyList })

			expect(emptyHst.has('emptyMap')).toBe(true)
			expect(emptyHst.has('emptyList')).toBe(true)
			expect(emptyHst.has('emptyMap.anything')).toBe(false)
			expect(emptyHst.has('emptyList.0')).toBe(false)
		})
	})
})
