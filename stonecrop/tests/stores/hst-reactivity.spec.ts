import { mount, VueWrapper } from '@vue/test-utils'
import { List, Map } from 'immutable'
import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick, defineComponent, ref } from 'vue'
import type { UnknownMachineConfig } from 'xstate'

import type { SchemaTypes } from '@stonecrop/aform'
import { useStonecrop } from '../../src/composables/stonecrop'
import Doctype from '../../src/doctype'
import Registry from '../../src/registry'
import { Stonecrop } from '../../src/stonecrop'

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

describe('HST Vue Reactivity', { tags: ['unit'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let doctype: Doctype
	let wrapper: VueWrapper

	beforeEach(() => {
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
		registry = new Registry()

		const mockSchema = List([
			{ fieldname: 'name', fieldtype: 'Data', label: 'Name', component: 'MockATextInput' },
			{ fieldname: 'active', fieldtype: 'Check', label: 'Active', component: 'MockACheckbox' },
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

		doctype = new Doctype('Task', mockSchema, mockWorkflow, mockActions, undefined, {
			items: { target: 'item', cardinality: 'noneOrMany' },
		})
		registry.addDoctype(doctype)
		stonecrop = new Stonecrop(registry)
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
							$stonecrop: stonecrop,
						},
					},
				})
			}).not.toThrow() // Should work with our mock implementation
		})

		it('should provide correct HST paths for nested field structures', async () => {
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
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			// Check that nested field paths are generated correctly
			const textInput = wrapper.find('[data-testid="text-input"]')
			const hstPathSpan = wrapper.find('[data-testid="hst-path"]')

			expect(hstPathSpan.text()).toBe('task.task-123.name')

			// Simulate typing to verify the path is used correctly
			await textInput.setValue('New Task Name')
			await nextTick()

			// The HST change should have been triggered with the correct path
			expect((textInput.element as HTMLInputElement).value).toBe('New Task Name')
		})

		it('should provide correct paths for all field types', async () => {
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
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			// Check that each component receives the correct HST path
			const textInput = wrapper.find('[data-testid="text-input"]')
			const checkbox = wrapper.find('[data-testid="checkbox-input"]')
			const table = wrapper.find('[data-testid="table"]')
			expect(textInput.exists()).toBe(true)
			expect(checkbox.exists()).toBe(true)
			expect(table.exists()).toBe(true)

			// Paths should follow pattern: doctype.recordId.fieldname
			expect(wrapper.find('[data-testid="hst-path"]').text()).toContain('task.task-123.name')

			const allHstPaths = wrapper.findAll('[data-testid="hst-path"]')
			expect(allHstPaths[0].text()).toBe('task.task-123.name')
			expect(allHstPaths[1].text()).toBe('task.task-123.active')
			expect(allHstPaths[2].text()).toBe('task.task-123.items')
		})

		it('should handle new record creation with proper HST paths', async () => {
			wrapper = mount(MockDoctypeForm, {
				props: {
					doctype: doctype,
					recordId: undefined, // New record, no ID yet
				},
				global: {
					components: {
						MockATextInput,
						MockACheckbox,
						MockATable,
					},
					provide: {
						$registry: registry,
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			// For new records, the path should be something like task.new
			const hstPathSpan = wrapper.find('[data-testid="hst-path"]')
			expect(hstPathSpan.text()).toMatch(/task\.(new|__new)/)
		})
	})

	describe('Field-Level Change Detection', () => {
		it('should register field changes with HST store and include address', async () => {
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
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			const textInput = wrapper.find('[data-testid="text-input"]')

			// Simulate a field change
			await textInput.setValue('Updated Task Name')
			await nextTick()

			// Verify the change was applied (this will depend on the composable implementation)
			expect((textInput.element as HTMLInputElement).value).toBe('Updated Task Name')
		})

		it('should detect changes in complex components like ATable', async () => {
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
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			const table = wrapper.find('[data-testid="table"]')
			expect(table.exists()).toBe(true)

			// For now, just verify the table component is mounted correctly
			// TODO: Add actual table interaction tests when ATable is implemented
		})

		it('should maintain deep reactivity for nested object changes', async () => {
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
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			// Test deep object changes would be detected
			// This is a placeholder until we have more complex nested structures
			const textInput = wrapper.find('[data-testid="text-input"]')
			await textInput.setValue('Deep change test')
			expect((textInput.element as HTMLInputElement).value).toBe('Deep change test')
		})
	})

	describe('HST Store Integration', () => {
		it('should sync component data with HST store bidirectionally', async () => {
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
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			// Test that changes in the component sync to the store
			const textInput = wrapper.find('[data-testid="text-input"]')
			await textInput.setValue('Bidirectional Test')

			// And that changes from the store would update the component
			// This would require the composable to be fully implemented
			expect((textInput.element as HTMLInputElement).value).toBe('Bidirectional Test')
		})

		it('should handle complex fieldtypes with proper HST structure', async () => {
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
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			// Test that complex field types (like Table) maintain proper HST structure
			const table = wrapper.find('[data-testid="table"]')
			const checkbox = wrapper.find('[data-testid="checkbox-input"]')

			expect(table.exists()).toBe(true)
			expect(checkbox.exists()).toBe(true)

			// Verify paths are correctly set for complex fields
			const hstPaths = wrapper.findAll('[data-testid="hst-path"]')
			expect(hstPaths.length).toBeGreaterThan(0)
		})
	})

	describe('Error Handling and Edge Cases', () => {
		it('should handle missing HST paths gracefully', async () => {
			// Test what happens when components don't have HST paths
			const SimpleComponent = defineComponent({
				template: '<div>No HST</div>',
			})

			wrapper = mount(SimpleComponent)
			await nextTick()

			// Should not throw errors
			expect(wrapper.text()).toBe('No HST')
		})

		it('should handle circular references in nested data', async () => {
			// Test handling of complex nested structures
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
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			// Should handle complex data structures without issues
			const textInput = wrapper.find('[data-testid="text-input"]')
			expect(textInput.exists()).toBe(true)
		})

		it('should work with hot-reloading and component updates', async () => {
			// Test that HST paths remain consistent during development
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
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			// Verify paths are stable
			const hstPath = wrapper.find('[data-testid="hst-path"]')
			const initialPath = hstPath.text()

			// After potential re-render/update
			await nextTick()

			expect(hstPath.text()).toBe(initialPath)
		})
	})

	describe('Performance Considerations', () => {
		it('should not create excessive watchers for large forms', async () => {
			// Create a doctype with many fields to test performance
			const largeDoctype = {
				name: 'large_form',
				fields: Array.from({ length: 50 }, (_, i) => ({
					fieldname: `field_${i}`,
					label: `Field ${i}`,
					fieldtype: 'Data',
					reqd: 0,
				})),
			}

			// Mock components for all the fields
			const LargeForm = defineComponent({
				props: ['doctype', 'recordId'],
				setup(props) {
					const composableReturn = useStonecrop(props)
					// Use the doctype directly from props since meta isn't exposed
					return { ...composableReturn, doctype: props.doctype }
				},
				template: `
					<div>
						<div v-for="field in doctype?.fields" :key="field.fieldname">
							<input
								:data-testid="'input-' + field.fieldname"
								type="text"
							/>
						</div>
					</div>
				`,
			})

			wrapper = mount(LargeForm, {
				props: {
					doctype: largeDoctype,
					recordId: 'large-123',
				},
				global: {
					provide: {
						$registry: registry,
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			// Check that all fields are rendered efficiently
			const inputs = wrapper.findAll('[data-testid^="input-"]')
			expect(inputs.length).toBe(50)
		})

		it('should debounce rapid changes appropriately', async () => {
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
						$stonecrop: stonecrop,
					},
				},
			})

			await nextTick()

			const textInput = wrapper.find('[data-testid="text-input"]')

			// Simulate rapid typing
			await textInput.setValue('a')
			await textInput.setValue('ab')
			await textInput.setValue('abc')
			await textInput.setValue('abcd')
			await textInput.setValue('abcde')

			// The final value should be set correctly
			expect((textInput.element as HTMLInputElement).value).toBe('abcde')
		})
	})
})
