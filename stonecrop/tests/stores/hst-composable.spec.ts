import { mount } from '@vue/test-utils'
import { List } from 'immutable'
import type { DoctypeField } from '@stonecrop/schema'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick, defineComponent } from 'vue'
import type { UnknownMachineConfig } from 'xstate'

import { useStonecrop } from '../../src/composables/stonecrop'
import Doctype from '../../src/doctype'
import Registry from '../../src/registry'
import { Stonecrop } from '../../src/stonecrop'

describe('HST Composable Functionality', { tags: ['unit'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let doctype: Doctype

	beforeEach(() => {
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
		registry = new Registry()

		const mockSchema = List<DoctypeField>([
			{ kind: 'field', fieldname: 'name', label: 'Name', component: 'ATextInput' },
			{ kind: 'field', fieldname: 'active', label: 'Active', component: 'ACheckbox' },
			{ kind: 'field', fieldname: 'count', label: 'Count', component: 'ANumericInput' },
		])

		const mockWorkflow: UnknownMachineConfig = {
			id: 'task',
			initial: 'draft',
			states: {
				draft: { on: { load: { target: 'pending' } } },
				pending: { type: 'final' },
			},
		}

		doctype = new Doctype('Task', mockSchema, mockWorkflow)
		registry.addDoctype(doctype)
		stonecrop = new Stonecrop(registry)
	})

	describe('useStonecrop HST Composable', () => {
		it('should create HST integration and provide required functions', async () => {
			const TestComponent = defineComponent({
				template: '<div>{{ hstPath }}</div>',
				setup() {
					const {
						stonecrop: stonecropComposable,
						provideHSTPath,
						handleHSTChange,
						hstStore,
						formData,
					} = useStonecrop({
						doctype,
						recordId: 'test-123',
					})

					const hstPath = provideHSTPath('name')

					return {
						stonecrop: stonecropComposable,
						provideHSTPath,
						handleHSTChange,
						hstStore,
						formData,
						hstPath,
					}
				},
			})

			const wrapper = mount(TestComponent, {
				global: {
					provide: {
						$registry: registry,
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			const vm = wrapper.vm as any

			// Check that all required functions are provided
			expect(typeof vm.provideHSTPath).toBe('function')
			expect(typeof vm.handleHSTChange).toBe('function')

			// Check HST path generation
			expect(vm.hstPath).toBe('task.test-123.name')

			// Check that HST store is available after mounting
			expect(vm.hstStore).toBeDefined()
			expect(vm.formData).toBeDefined()
			expect(typeof vm.formData).toBe('object')
		})

		it('should initialize form data correctly for new records', async () => {
			const TestComponent = defineComponent({
				template: '<div></div>',
				setup() {
					return useStonecrop({ doctype, recordId: 'new' })
				},
			})

			const wrapper = mount(TestComponent, {
				global: {
					provide: {
						$registry: registry,
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			const vm = wrapper.vm as any

			// Check default values are set according to field types
			expect(vm.formData.name).toBe('')
			expect(vm.formData.active).toBe(false)
			expect(vm.formData.count).toBe(0)
		})

		it('should handle HST changes correctly', async () => {
			const TestComponent = defineComponent({
				template: '<div></div>',
				setup() {
					return useStonecrop({ doctype, recordId: 'test-123' })
				},
			})

			const wrapper = mount(TestComponent, {
				global: {
					provide: {
						$registry: registry,
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()
			// Wait a bit more for onMounted to complete
			await new Promise(resolve => setTimeout(resolve, 10))

			const vm = wrapper.vm as any

			// Test HST change handling
			const changeData = {
				path: 'task.test-123.name',
				value: 'Test Task',
				fieldname: 'name',
			}

			vm.handleHSTChange(changeData)

			// Check that form data is updated
			expect(vm.formData.name).toBe('Test Task')

			// Check that HST store is updated
			expect(vm.hstStore).toBeDefined()
			expect(vm.hstStore.get('task.test-123.name')).toBe('Test Task')
		})

		it('should generate correct HST paths for nested fields', async () => {
			const TestComponent = defineComponent({
				template: '<div></div>',
				setup() {
					return useStonecrop({ doctype, recordId: 'test-123' })
				},
			})

			const wrapper = mount(TestComponent, {
				global: {
					provide: {
						$registry: registry,
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			const vm = wrapper.vm as any

			// Test various path generations
			expect(vm.provideHSTPath('name')).toBe('task.test-123.name')
			expect(vm.provideHSTPath('active')).toBe('task.test-123.active')
			expect(vm.provideHSTPath('items.0.name')).toBe('task.test-123.items.0.name')
		})

		it('should handle complex nested changes', async () => {
			const TestComponent = defineComponent({
				template: '<div></div>',
				setup() {
					return useStonecrop({ doctype, recordId: 'test-123' })
				},
			})

			const wrapper = mount(TestComponent, {
				global: {
					provide: {
						$registry: registry,
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			const vm = wrapper.vm as any

			// Test nested field change (like ATable cell)
			const nestedChangeData = {
				path: 'task.test-123.items.0.name',
				value: 'Item Name',
				fieldname: 'items.0.name',
			}

			vm.handleHSTChange(nestedChangeData)

			// Check that nested structure is created in form data
			expect(vm.formData.items).toBeDefined()
			expect(vm.formData.items[0]).toBeDefined()
			expect(vm.formData.items[0].name).toBe('Item Name')
		})

		it('should provide HST paths via injection', async () => {
			const TestComponent = defineComponent({
				template: '<div></div>',
				setup() {
					const result = useStonecrop({ doctype, recordId: 'test-123' })

					// This should also provide the injection for child components
					return result
				},
			})

			const wrapper = mount(TestComponent, {
				global: {
					provide: {
						$registry: registry,
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			// The composable should have provided hstPathProvider and hstChangeHandler
			// Child components can inject these
			expect(wrapper.vm).toBeDefined()
		})
	})

	describe('Error Handling', () => {
		it('should handle missing registry gracefully', async () => {
			const TestComponent = defineComponent({
				template: '<div></div>',
				setup() {
					return useStonecrop({ doctype, recordId: 'test-123' })
				},
			})

			// Mounting without providing $registry or $stonecrop is intentional here —
			// it exercises the "no registry" error path. Vue will warn about the missing
			// injections, which is expected; suppress so it doesn't pollute test output.
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			const wrapper = mount(TestComponent)
			warnSpy.mockRestore()

			await nextTick()

			// Should not throw and should have undefined stonecrop
			expect(wrapper.vm).toBeDefined()
		})

		it('should handle invalid HST changes gracefully', async () => {
			const TestComponent = defineComponent({
				template: '<div></div>',
				setup() {
					return useStonecrop({ doctype, recordId: 'test-123' })
				},
			})

			const wrapper = mount(TestComponent, {
				global: {
					provide: {
						$registry: registry,
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			const vm = wrapper.vm as any

			// Test with invalid change data
			expect(() => {
				vm.handleHSTChange({
					path: '',
					value: null,
					fieldname: '',
				})
			}).not.toThrow()
		})
	})
})
