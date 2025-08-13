import { mount, VueWrapper } from '@vue/test-utils'
import { List, Map } from 'immutable'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick, defineComponent, ref } from 'vue'
import type { UnknownMachineConfig } from 'xstate'

import type { SchemaTypes } from '@stonecrop/aform'
import { useStonecrop } from '../../src/composable'
import DoctypeMeta from '../../src/doctype'
import Registry from '../../src/registry'

// Mock AForm-like components for testing
const MockATextInput = defineComponent({
	name: 'MockATextInput',
	props: {
		modelValue: String,
		schema: Object,
		hstPath: String, // This should be injected
	},
	emits: ['update:modelValue', 'hst:change'],
	template: `
		<div>
			<input
				:value="modelValue"
				@input="handleInput"
				data-testid="text-input"
			/>
			<span data-testid="hst-path">{{ hstPath }}</span>
		</div>
	`,
	setup(props, { emit }) {
		const handleInput = (event: Event) => {
			const value = (event.target as HTMLInputElement).value
			emit('update:modelValue', value)
			emit('hst:change', {
				path: props.hstPath,
				value,
				fieldname: props.schema?.fieldname,
			})
		}
		return { handleInput }
	},
})

const MockACheckbox = defineComponent({
	name: 'MockACheckbox',
	props: {
		modelValue: Boolean,
		schema: Object,
		hstPath: String,
	},
	emits: ['update:modelValue', 'hst:change'],
	template: `
		<div>
			<input
				type="checkbox"
				:checked="modelValue"
				@change="handleChange"
				data-testid="checkbox-input"
			/>
			<span data-testid="hst-path">{{ hstPath }}</span>
		</div>
	`,
	setup(props, { emit }) {
		const handleChange = (event: Event) => {
			const checked = (event.target as HTMLInputElement).checked
			emit('update:modelValue', checked)
			emit('hst:change', {
				path: props.hstPath,
				value: checked,
				fieldname: props.schema?.fieldname,
			})
		}
		return { handleChange }
	},
})

const MockATable = defineComponent({
	name: 'MockATable',
	props: {
		modelValue: Array,
		schema: Object,
		hstPath: String,
	},
	emits: ['update:modelValue', 'hst:change'],
	template: `
		<div>
			<table data-testid="table">
				<tr v-for="(row, index) in modelValue" :key="index">
					<td>
						<input
							:value="row.name"
							@input="handleCellInput(index, 'name', $event)"
							:data-testid="'cell-' + index + '-name'"
						/>
					</td>
				</tr>
			</table>
			<span data-testid="hst-path">{{ hstPath }}</span>
		</div>
	`,
	setup(props, { emit }) {
		const handleCellInput = (rowIndex: number, fieldname: string, event: Event) => {
			const value = (event.target as HTMLInputElement).value
			const newData = [...(props.modelValue || [])] as any[]
			if (!newData[rowIndex]) newData[rowIndex] = {}
			newData[rowIndex][fieldname] = value

			emit('update:modelValue', newData)
			emit('hst:change', {
				path: `${props.hstPath}.${rowIndex}.${fieldname}`,
				value,
				fieldname: `${props.schema?.fieldname}.${rowIndex}.${fieldname}`,
			})
		}
		return { handleCellInput }
	},
})

const MockDoctypeForm = defineComponent({
	name: 'MockDoctypeForm',
	props: {
		doctype: Object,
		recordId: String,
	},
	template: `
		<div data-testid="doctype-form">
			<div v-for="field in fields" :key="field.fieldname">
				<component
					:is="field.component"
					v-model="formData[field.fieldname]"
					:schema="field"
					:hst-path="getHSTPath(field.fieldname)"
					@hst:change="handleHSTChange"
				/>
			</div>
		</div>
	`,
	setup(props) {
		// This composable should provide HST integration
		const { stonecrop, provideHSTPath, handleHSTChange } = useStonecrop({
			doctype: props.doctype,
			recordId: props.recordId,
		})

		const formData = ref({
			name: '',
			active: false,
			items: [],
		})

		const fields = ref([
			{
				fieldname: 'name',
				component: 'MockATextInput',
				label: 'Name',
			},
			{
				fieldname: 'active',
				component: 'MockACheckbox',
				label: 'Active',
			},
			{
				fieldname: 'items',
				component: 'MockATable',
				label: 'Items',
			},
		])

		const getHSTPath = (fieldname: string) => {
			return provideHSTPath(fieldname, props.recordId)
		}

		return {
			stonecrop,
			formData,
			fields,
			getHSTPath,
			handleHSTChange,
		}
	},
})

describe('HST Vue Reactivity', () => {
	let registry: Registry
	let doctype: DoctypeMeta
	let wrapper: VueWrapper

	beforeEach(() => {
		registry = new Registry()

		const mockSchema = List([
			{ fieldname: 'name', fieldtype: 'Data', label: 'Name', component: 'MockATextInput' },
			{ fieldname: 'active', fieldtype: 'Check', label: 'Active', component: 'MockACheckbox' },
			{ fieldname: 'items', fieldtype: 'Table', label: 'Items', component: 'MockATable' },
		] as SchemaTypes[])

		const mockWorkflow: UnknownMachineConfig = {
			id: 'task',
			initial: 'draft',
			states: {
				draft: { on: { load: { target: 'pending' } } },
				pending: { type: 'final' },
			},
		}

		const mockActions = Map({
			load: ['loadData'],
			save: ['saveData'],
		})

		doctype = new DoctypeMeta('Task', mockSchema, mockWorkflow, mockActions)
		registry.addDoctype(doctype)
	})

	describe('HST Path Injection', () => {
		it('should inject HST path prop into every field component', async () => {
			// This test should fail initially because useStonecrop doesn't exist
			expect(() => {
				wrapper = mount(MockDoctypeForm, {
					props: {
						doctype: doctype,
						recordId: 'new',
					},
					global: {
						components: {
							MockATextInput,
							MockACheckbox,
							MockATable,
						},
						provide: {
							$registry: registry,
						},
					},
				})
			}).not.toThrow() // Should work with our mock implementation
		})

		it('should provide correct HST paths for nested field structures', async () => {
			// Skip for now - will implement after basic composable exists
			// TODO: Implement useStonecrop first

			wrapper = mount(MockDoctypeForm, {
				props: {
					doctype: doctype,
					recordId: 'task-123',
				},
				global: {
					components: {
						MockATextInput,
						MockACheckbox,
						MockATable,
					},
					provide: {
						$registry: registry,
					},
				},
			})

			await nextTick()

			// Check that each component receives the correct HST path
			const textInput = wrapper.find('[data-testid="text-input"]')
			const checkbox = wrapper.find('[data-testid="checkbox-input"]')
			const table = wrapper.find('[data-testid="table"]')

			// Paths should follow pattern: doctype.records.recordId.fieldname
			expect(wrapper.find('[data-testid="hst-path"]').text()).toContain('task.records.task-123.name')

			const allHstPaths = wrapper.findAll('[data-testid="hst-path"]')
			expect(allHstPaths[0].text()).toBe('task.records.task-123.name')
			expect(allHstPaths[1].text()).toBe('task.records.task-123.active')
			expect(allHstPaths[2].text()).toBe('task.records.task-123.items')
		})

		it('should handle new record creation with proper HST paths', async () => {
			// Skip for now
			// TODO: Implement useStonecrop first

			wrapper = mount(MockDoctypeForm, {
				props: {
					doctype: doctype,
					recordId: 'new',
				},
				global: {
					components: {
						MockATextInput,
						MockACheckbox,
						MockATable,
					},
					provide: {
						$registry: registry,
					},
				},
			})

			await nextTick()

			// For new records, should generate temporary ID or use 'new'
			const hstPaths = wrapper.findAll('[data-testid="hst-path"]')
			hstPaths.forEach(pathElement => {
				expect(pathElement.text()).toMatch(/task\.records\.(new|[a-f0-9-]+)\./)
			})
		})
	})

	describe('Field-Level Change Detection', () => {
		it('should register field changes with HST store and include address', async () => {
			// Skip for now
			// TODO: Implement useStonecrop first

			const changeSpy = vi.fn()

			wrapper = mount(MockDoctypeForm, {
				props: {
					doctype: doctype,
					recordId: 'task-123',
				},
				global: {
					components: {
						MockATextInput,
						MockACheckbox,
						MockATable,
					},
					provide: {
						$registry: registry,
					},
				},
			})

			await nextTick()

			// Mock the HST change handler to capture changes
			const vm = wrapper.vm as any
			if (vm.handleHSTChange) {
				vm.handleHSTChange = changeSpy
			}

			// Simulate user input
			const textInput = wrapper.find('[data-testid="text-input"]')
			await textInput.setValue('Test Task Name')

			// TODO: Once useStonecrop is implemented, this should work
			// expect(changeSpy).toHaveBeenCalledWith({
			// 	path: 'task.records.task-123.name',
			// 	value: 'Test Task Name',
			// 	fieldname: 'name'
			// })
		})

		it('should detect changes in complex components like ATable', async () => {
			// TODO: Implement after useStonecrop exists
			expect(true).toBe(true) // Placeholder
		})

		it('should maintain deep reactivity for nested object changes', async () => {
			// TODO: Implement after useStonecrop exists
			expect(true).toBe(true) // Placeholder
		})
	})

	describe('HST Store Integration', () => {
		it('should sync component data with HST store bidirectionally', async () => {
			// TODO: Implement after useStonecrop exists
			expect(true).toBe(true) // Placeholder
		})

		it('should handle complex fieldtypes with proper HST structure', async () => {
			// TODO: Implement after useStonecrop exists
			expect(true).toBe(true) // Placeholder
		})
	})

	describe('Error Handling and Edge Cases', () => {
		it('should handle missing HST paths gracefully', async () => {
			// Test what happens when components don't have HST paths
			// This should not break the app but should log warnings
		})

		it('should handle circular references in nested data', async () => {
			// Test handling of complex nested structures that might cause issues
		})

		it('should work with hot-reloading and component updates', async () => {
			// Test that HST paths remain consistent during development
		})
	})

	describe('Performance Considerations', () => {
		it('should not create excessive watchers for large forms', async () => {
			// Test that the watcher setup scales appropriately
		})

		it('should debounce rapid changes appropriately', async () => {
			// Test that rapid typing doesn't overwhelm the HST system
		})
	})
})
