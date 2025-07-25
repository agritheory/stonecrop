import { describe, it, expect, beforeEach, vi } from 'vitest'
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
			}
			hst = createHST(mixedObject)
		})

		it('should handle mixed object types correctly', () => {
			expect(hst.get('plainData.value')).toBe('plain')
			expect(hst.get('reactive.value')).toBe('reactive')
			expect(hst.get('store.value')).toBe('pinia')
		})

		it('should set values correctly based on object type', () => {
			hst.set('plainData.value', 'updated-plain')
			expect(mixedObject.plainData.value).toBe('updated-plain')

			hst.set('reactive.value', 'updated-reactive')
			expect(mixedObject.reactive.value).toBe('updated-reactive')

			hst.set('store.value', 'updated-pinia')
			expect(mixedObject.store.$patch).toHaveBeenCalledWith({ value: 'updated-pinia' })
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
			}
			hst = createHST(testObject)
		})

		it('should handle null and undefined values', () => {
			expect(hst.get('nullValue')).toBeNull()
			expect(hst.get('undefinedValue')).toBeUndefined()
			expect(hst.has('nullValue')).toBe(true) // null is a valid value
			expect(hst.has('undefinedValue')).toBe(true) // undefined exists as property
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
	})
})
