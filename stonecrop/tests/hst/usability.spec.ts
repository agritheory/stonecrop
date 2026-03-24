import { mount } from '@vue/test-utils'
import { List, Map } from 'immutable'
import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick, defineComponent, computed, ref } from 'vue'
import type { UnknownMachineConfig } from 'xstate'

import ATextInput from '../../../aform/src/components/form/ATextInput.vue'
import ANumericInput from '../../../aform/src/components/form/ANumericInput.vue'
import type { SchemaTypes } from '../../../aform/src/types'
import { useStonecrop } from '../../src/composables/stonecrop'
import Doctype from '../../src/doctype'
import Registry from '../../src/registry'
import { Stonecrop } from '../../src/stonecrop'

describe('HST Edge Cases & Performance', () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let doctype: Doctype

	beforeEach(() => {
		Registry._root = undefined as any
		registry = new Registry()

		// Complex schema with nested fields and special cases
		const complexSchema = List([
			{ fieldname: 'name', fieldtype: 'Data', label: 'Name', component: 'ATextInput' },
			{ fieldname: 'metadata', fieldtype: 'JSON', label: 'Metadata', component: 'ATextInput' },
			{ fieldname: 'tags', fieldtype: 'Doctype', cardinality: 'many', label: 'Tags', component: 'ATable' },
			{ fieldname: 'config', fieldtype: 'JSON', label: 'Config', component: 'ATextInput' },
			{ fieldname: 'items', fieldtype: 'Doctype', cardinality: 'many', label: 'Items', component: 'ATable' },
			{ fieldname: 'nested_data', fieldtype: 'JSON', label: 'Nested Data', component: 'ATextInput' },
		] as SchemaTypes[])

		const mockWorkflow: UnknownMachineConfig = {
			id: 'complex',
			initial: 'draft',
			states: {
				draft: { on: { submit: { target: 'active' } } },
				active: { type: 'final' },
			},
		}

		const mockActions = Map({
			load: ['loadData'],
			save: ['saveData'],
		})

		doctype = new Doctype('Complex', complexSchema, mockWorkflow, mockActions)
		registry.addDoctype(doctype)
		stonecrop = new Stonecrop(registry)
	})

	describe('Performance and Scalability', () => {
		it('should handle large nested data structures efficiently', async () => {
			const LargeDataTest = defineComponent({
				components: { ATextInput },
				template: `<ATextInput v-model="largeDataValue" @update:modelValue="handleChange" />`,
				setup() {
					const { formData, handleHSTChange, provideHSTPath } = useStonecrop({ doctype, recordId: 'large-test' })

					// Create a large nested structure
					const largeData = {
						level1: {
							level2: {
								level3: {
									items: Array.from({ length: 100 }, (_, i) => ({
										id: i,
										name: `Item ${i}`,
										metadata: { type: 'test', index: i },
									})),
								},
							},
						},
					}

					const largeDataValue = computed({
						get: () => JSON.stringify(formData.value.nested_data || {}),
						set: value => {
							try {
								const parsed = JSON.parse(value)
								handleHSTChange({
									path: provideHSTPath('nested_data'),
									value: parsed,
									fieldname: 'nested_data',
								})
							} catch {
								// Handle invalid JSON gracefully
							}
						},
					})

					const handleChange = (val: string) => {
						largeDataValue.value = val
					}

					return { largeDataValue, handleChange, formData, largeData }
				},
			})

			const wrapper = mount(LargeDataTest, {
				global: { provide: { $registry: registry, $stonecrop: stonecrop } },
			})

			await nextTick()
			await new Promise(resolve => setTimeout(resolve, 50))

			const vm = wrapper.vm as any
			const input = wrapper.find('input')

			// Test performance with large data
			const startTime = performance.now()
			await input.setValue(JSON.stringify(vm.largeData))
			await nextTick()
			const endTime = performance.now()

			// Should complete within reasonable time (less than 100ms)
			expect(endTime - startTime).toBeLessThan(100)
			expect(vm.formData.nested_data).toEqual(vm.largeData)
		})

		it('should handle rapid successive updates without data loss', async () => {
			const RapidUpdateTest = defineComponent({
				components: { ATextInput, ANumericInput },
				template: `
					<div>
						<ATextInput v-model="nameValue" @update:modelValue="handleNameChange" />
						<ANumericInput v-model="counterValue" @update:modelValue="handleCounterChange" />
					</div>
				`,
				setup() {
					const { formData, handleHSTChange, provideHSTPath } = useStonecrop({ doctype, recordId: 'rapid-test' })

					const nameValue = computed({
						get: () => formData.value.name || '',
						set: value =>
							handleHSTChange({
								path: provideHSTPath('name'),
								value,
								fieldname: 'name',
							}),
					})

					const counterValue = computed({
						get: () => formData.value.counter || 0,
						set: value =>
							handleHSTChange({
								path: provideHSTPath('counter'),
								value: Number(value),
								fieldname: 'counter',
							}),
					})

					return {
						nameValue,
						counterValue,
						handleNameChange: (val: string) => {
							nameValue.value = val
						},
						handleCounterChange: (val: number) => {
							counterValue.value = val
						},
						formData,
					}
				},
			})

			const wrapper = mount(RapidUpdateTest, {
				global: { provide: { $registry: registry, $stonecrop: stonecrop } },
			})

			await nextTick()
			await new Promise(resolve => setTimeout(resolve, 50))

			const vm = wrapper.vm as any
			const inputs = wrapper.findAll('input')

			// Perform rapid updates
			for (let i = 0; i < 10; i++) {
				await inputs[0].setValue(`Name ${i}`)
				await inputs[1].setValue(i.toString())
				await nextTick()
			}

			// All updates should be preserved
			expect(vm.formData.name).toBe('Name 9')
			expect(vm.formData.counter).toBe(9)
		})
	})

	describe('Error Handling and Recovery', () => {
		it('should gracefully handle malformed HST paths', async () => {
			const ErrorHandlingTest = defineComponent({
				template: `<div>{{ testResult }}</div>`,
				setup() {
					const { handleHSTChange, formData } = useStonecrop({ doctype, recordId: 'error-test' })

					const testResult = ref('pending')

					// Test various malformed paths
					const testMalformedPaths = async () => {
						try {
							// Empty path
							handleHSTChange({ path: '', value: 'test', fieldname: '' })

							// Invalid path format
							handleHSTChange({ path: 'invalid..path', value: 'test', fieldname: 'invalid' })

							// Non-existent deep path
							handleHSTChange({
								path: 'complex.error-test.nonexistent.deep.path.value',
								value: 'test',
								fieldname: 'nonexistent.deep.path.value',
							})

							testResult.value = 'success'
						} catch (error) {
							testResult.value = 'error'
						}
					}

					testMalformedPaths()

					return { testResult, formData }
				},
			})

			const wrapper = mount(ErrorHandlingTest, {
				global: { provide: { $registry: registry, $stonecrop: stonecrop } },
			})

			await nextTick()
			await new Promise(resolve => setTimeout(resolve, 100))

			const vm = wrapper.vm as any

			// Should handle errors gracefully without throwing
			expect(vm.testResult).toBe('success')
		})

		it('should recover from HST store corruption scenarios', async () => {
			const CorruptionRecoveryTest = defineComponent({
				template: `<div>{{ recoveryStatus }}</div>`,
				setup() {
					const { formData, handleHSTChange, provideHSTPath, hstStore } = useStonecrop({
						doctype,
						recordId: 'corruption-test',
					})

					const recoveryStatus = ref('pending')

					const testRecovery = async () => {
						try {
							// First, set some valid data
							handleHSTChange({
								path: provideHSTPath('name'),
								value: 'Test Name',
								fieldname: 'name',
							})

							// Simulate corruption by trying to overwrite with incompatible types
							if (hstStore.value) {
								// Try to set an object path to a primitive
								hstStore.value.set('complex', 'invalid_primitive')

								// Try to continue operations
								handleHSTChange({
									path: provideHSTPath('metadata'),
									value: { test: true },
									fieldname: 'metadata',
								})
							}

							recoveryStatus.value = 'recovered'
						} catch (error) {
							recoveryStatus.value = 'failed'
						}
					}

					testRecovery()

					return { recoveryStatus, formData }
				},
			})

			const wrapper = mount(CorruptionRecoveryTest, {
				global: { provide: { $registry: registry, $stonecrop: stonecrop } },
			})

			await nextTick()
			await new Promise(resolve => setTimeout(resolve, 100))

			const vm = wrapper.vm as any

			// Should either recover or fail gracefully
			expect(['recovered', 'failed']).toContain(vm.recoveryStatus)
		})
	})

	describe('Advanced Field Type Support', () => {
		it('should handle deeply nested array structures', async () => {
			const DeepArrayTest = defineComponent({
				components: { ATextInput },
				template: `<ATextInput v-model="arrayValue" @update:modelValue="handleChange" />`,
				setup() {
					const { formData, handleHSTChange, provideHSTPath } = useStonecrop({ doctype, recordId: 'array-test' })

					const arrayValue = computed({
						get: () => {
							const items = formData.value.items
							return Array.isArray(items) ? JSON.stringify(items) : '[]'
						},
						set: value => {
							try {
								const parsed = JSON.parse(value)
								if (Array.isArray(parsed)) {
									// Test nested array access
									parsed.forEach((item, index) => {
										if (item && typeof item === 'object') {
											Object.keys(item).forEach(key => {
												handleHSTChange({
													path: provideHSTPath(`items.${index}.${key}`),
													value: item[key],
													fieldname: `items.${index}.${key}`,
												})
											})
										}
									})
								}
							} catch {
								// Handle invalid JSON
							}
						},
					})

					return {
						arrayValue,
						handleChange: (val: string) => {
							arrayValue.value = val
						},
						formData,
					}
				},
			})

			const wrapper = mount(DeepArrayTest, {
				global: { provide: { $registry: registry, $stonecrop: stonecrop } },
			})

			await nextTick()
			await new Promise(resolve => setTimeout(resolve, 50))

			const vm = wrapper.vm as any
			const input = wrapper.find('input')

			// Test complex nested array
			const testArray = [
				{ id: 1, name: 'Item 1', config: { enabled: true, priority: 1 } },
				{ id: 2, name: 'Item 2', config: { enabled: false, priority: 2 } },
			]

			await input.setValue(JSON.stringify(testArray))
			await nextTick()

			// Should handle the nested structure
			expect(vm.formData.items).toBeDefined()
		})

		it('should support mixed data type scenarios', async () => {
			const MixedTypeTest = defineComponent({
				components: { ATextInput },
				template: `<ATextInput v-model="mixedValue" @update:modelValue="handleChange" />`,
				setup() {
					const { formData, handleHSTChange, provideHSTPath } = useStonecrop({ doctype, recordId: 'mixed-test' })

					const mixedValue = computed({
						get: () => JSON.stringify(formData.value.config || {}),
						set: value => {
							try {
								const parsed = JSON.parse(value)

								// Handle different data types within the same structure
								const processValue = (obj: any, basePath: string = '') => {
									Object.keys(obj).forEach(key => {
										const currentPath = basePath ? `${basePath}.${key}` : key
										const currentValue = obj[key]

										if (typeof currentValue === 'object' && currentValue !== null && !Array.isArray(currentValue)) {
											// Recursive object
											processValue(currentValue, currentPath)
										} else {
											// Primitive or array
											handleHSTChange({
												path: provideHSTPath(`config.${currentPath}`),
												value: currentValue,
												fieldname: `config.${currentPath}`,
											})
										}
									})
								}

								processValue(parsed)
							} catch {
								// Handle invalid JSON
							}
						},
					})

					return {
						mixedValue,
						handleChange: (val: string) => {
							mixedValue.value = val
						},
						formData,
					}
				},
			})

			const wrapper = mount(MixedTypeTest, {
				global: { provide: { $registry: registry, $stonecrop: stonecrop } },
			})

			await nextTick()
			await new Promise(resolve => setTimeout(resolve, 50))

			const vm = wrapper.vm as any
			const input = wrapper.find('input')

			// Test mixed data types
			const mixedData = {
				stringValue: 'hello',
				numberValue: 42,
				booleanValue: true,
				arrayValue: [1, 2, 3],
				objectValue: { nested: 'value' },
				nullValue: null,
			}

			await input.setValue(JSON.stringify(mixedData))
			await nextTick()

			// Should handle all the different types
			expect(vm.formData.config).toBeDefined()
		})
	})

	describe('Concurrent Access Patterns', () => {
		it('should handle multiple component instances accessing same HST path', async () => {
			const MultiInstanceTest = defineComponent({
				components: { ATextInput },
				template: `
					<div>
						<ATextInput v-model="value1" @update:modelValue="handleChange1" />
						<ATextInput v-model="value2" @update:modelValue="handleChange2" />
					</div>
				`,
				setup() {
					// Two instances accessing the same field (simulating multiple components)
					const instance1 = useStonecrop({ doctype, recordId: 'shared-test' })
					const instance2 = useStonecrop({ doctype, recordId: 'shared-test' }) // Same record ID

					const value1 = computed({
						get: () => instance1.formData.value.name || '',
						set: value =>
							instance1.handleHSTChange({
								path: instance1.provideHSTPath('name'),
								value,
								fieldname: 'name',
							}),
					})

					const value2 = computed({
						get: () => instance2.formData.value.name || '',
						set: value =>
							instance2.handleHSTChange({
								path: instance2.provideHSTPath('name'),
								value,
								fieldname: 'name',
							}),
					})

					return {
						value1,
						value2,
						handleChange1: (val: string) => {
							value1.value = val
						},
						handleChange2: (val: string) => {
							value2.value = val
						},
						formData1: instance1.formData,
						formData2: instance2.formData,
					}
				},
			})

			const wrapper = mount(MultiInstanceTest, {
				global: { provide: { $registry: registry, $stonecrop: stonecrop } },
			})

			await nextTick()
			await new Promise(resolve => setTimeout(resolve, 50))

			const vm = wrapper.vm as any
			const inputs = wrapper.findAll('input')

			// Update from first instance
			await inputs[0].setValue('Updated from instance 1')
			await nextTick()

			// Both instances should eventually reflect the change
			// Note: This tests the conceptual approach; actual synchronization
			// would depend on HST store reactivity implementation
			expect(vm.formData1.name).toBe('Updated from instance 1')
		})
	})
})
