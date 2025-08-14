import { mount } from '@vue/test-utils'
import { List, Map } from 'immutable'
import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick, defineComponent, computed, ref } from 'vue'
import type { UnknownMachineConfig } from 'xstate'

import AForm from '../../../aform/src/components/AForm.vue'
import ATextInput from '../../../aform/src/components/form/ATextInput.vue'
import ANumericInput from '../../../aform/src/components/form/ANumericInput.vue'
import ACheckbox from '../../../aform/src/components/form/ACheckbox.vue'
import ADate from '../../../aform/src/components/form/ADate.vue'
import AComboBox from '../../../aform/src/components/form/AComboBox.vue'
import ADropdown from '../../../aform/src/components/form/ADropdown.vue'
import type { SchemaTypes } from '../../../aform/src/types'
import { useStonecrop } from '../../src/composable'
import DoctypeMeta from '../../src/doctype'
import Registry from '../../src/registry'

describe('HST Real Component Integration', () => {
	let registry: Registry
	let doctype: DoctypeMeta

	beforeEach(() => {
		registry = new Registry()

		// Complete schema with all major field types
		const completeSchema = List([
			// Text fields
			{ fieldname: 'name', fieldtype: 'Data', label: 'Task Name', component: 'ATextInput', required: true },
			{ fieldname: 'description', fieldtype: 'Text', label: 'Description', component: 'ATextInput' },

			// Numeric fields
			{ fieldname: 'priority', fieldtype: 'Int', label: 'Priority', component: 'ANumericInput', min: 1, max: 5 },
			{ fieldname: 'progress', fieldtype: 'Float', label: 'Progress %', component: 'ANumericInput', min: 0, max: 100 },

			// Boolean field
			{ fieldname: 'active', fieldtype: 'Check', label: 'Active', component: 'ACheckbox' },
			{ fieldname: 'urgent', fieldtype: 'Check', label: 'Urgent', component: 'ACheckbox' },

			// Date fields
			{ fieldname: 'due_date', fieldtype: 'Date', label: 'Due Date', component: 'ADate' },
			{ fieldname: 'created_at', fieldtype: 'Datetime', label: 'Created At', component: 'ADate' },

			// Selection fields
			{
				fieldname: 'status',
				fieldtype: 'Select',
				label: 'Status',
				component: 'ADropdown',
				options: ['Draft', 'In Progress', 'Completed', 'Cancelled'],
			},
			{
				fieldname: 'category',
				fieldtype: 'Select',
				label: 'Category',
				component: 'AComboBox',
				options: ['Development', 'Testing', 'Documentation', 'Support'],
			},

			// JSON field for complex data
			{ fieldname: 'metadata', fieldtype: 'JSON', label: 'Metadata', component: 'ATextInput' },

			// Table field for related items
			{ fieldname: 'subtasks', fieldtype: 'Table', label: 'Subtasks', component: 'ATable' },
		] as SchemaTypes[])

		const mockWorkflow: UnknownMachineConfig = {
			id: 'task',
			initial: 'draft',
			states: {
				draft: { on: { submit: { target: 'review' } } },
				review: { on: { approve: { target: 'active' }, reject: { target: 'draft' } } },
				active: { on: { complete: { target: 'completed' }, cancel: { target: 'cancelled' } } },
				completed: { type: 'final' },
				cancelled: { type: 'final' },
			},
		}

		const mockActions = Map({
			load: ['loadTask'],
			save: ['saveTask'],
			submit: ['submitForReview'],
			approve: ['approveTask'],
			reject: ['rejectTask'],
			complete: ['completeTask'],
			cancel: ['cancelTask'],
		})

		doctype = new DoctypeMeta('Task', completeSchema, mockWorkflow, mockActions)
		registry.addDoctype(doctype)
	})

	describe('Real AForm Integration with HST', () => {
		it('should integrate HST with real AForm component for all field types', async () => {
			const FormWithHST = defineComponent({
				components: {
					AForm,
					ATextInput,
					ANumericInput,
					ACheckbox,
					ADate,
					AComboBox,
					ADropdown,
				},
				template: `
					<div>
						<AForm
							v-model="formSchema"
							:data="formData"
							@update:modelValue="handleFormUpdate"
						/>
						<div class="debug-info">
							<div>HST Data: {{ JSON.stringify(hstFormData) }}</div>
							<div>Form Data: {{ JSON.stringify(formData) }}</div>
						</div>
					</div>
				`,
				setup() {
					const { formData, handleHSTChange, provideHSTPath, hstStore } = useStonecrop({
						doctype,
						recordId: 'test-task',
					})

					// Create form schema that uses HST paths
					const formSchema = ref(
						doctype.schema?.toArray().map(field => ({
							...field,
							value: formData.value[field.fieldname] || getDefaultValue(field.fieldtype),
						}))
					)

					const handleFormUpdate = (updatedSchema: SchemaTypes[]) => {
						// Handle form updates by propagating to HST
						updatedSchema.forEach(field => {
							if (field.value !== undefined) {
								const hstPath = provideHSTPath(field.fieldname)
								handleHSTChange({
									path: hstPath,
									value: field.value,
									fieldname: field.fieldname,
								})
							}
						})
					}

					return {
						formSchema,
						formData,
						hstFormData: formData,
						handleFormUpdate,
						hstStore,
					}
				},
			})

			const wrapper = mount(FormWithHST, {
				global: {
					provide: {
						$registry: registry,
					},
				},
			})

			await nextTick()
			await new Promise(resolve => setTimeout(resolve, 50)) // Allow onMounted to complete

			const vm = wrapper.vm as any

			// Test that HST integration is working
			expect(vm.hstStore).toBeDefined()
			expect(vm.formData).toBeDefined()
			expect(vm.hstFormData).toBeDefined()

			// Test initial form data structure matches schema
			expect(vm.formData.name).toBeDefined()
			expect(vm.formData.priority).toBeDefined()
			expect(vm.formData.active).toBeDefined()
			expect(vm.formData.due_date).toBeDefined()
			expect(vm.formData.status).toBeDefined()
		})

		it('should handle field updates through real ATextInput component', async () => {
			const FormWithHSTField = defineComponent({
				components: { ATextInput },
				template: `
					<ATextInput
						v-model="fieldValue"
						:schema="fieldSchema"
						@update:modelValue="handleFieldChange"
					/>
				`,
				setup() {
					const { formData, handleHSTChange, provideHSTPath } = useStonecrop({ doctype, recordId: 'test-task' })

					const fieldSchema = {
						fieldname: 'name',
						fieldtype: 'Data',
						label: 'Task Name',
						component: 'ATextInput',
					}

					const fieldValue = computed({
						get: () => formData.value.name || '',
						set: value => {
							const hstPath = provideHSTPath('name')
							handleHSTChange({
								path: hstPath,
								value,
								fieldname: 'name',
							})
						},
					})

					const handleFieldChange = (newValue: string) => {
						fieldValue.value = newValue
					}

					return {
						fieldValue,
						fieldSchema,
						handleFieldChange,
						formData,
					}
				},
			})

			const wrapper = mount(FormWithHSTField, {
				global: {
					provide: {
						$registry: registry,
					},
				},
			})

			await nextTick()
			await new Promise(resolve => setTimeout(resolve, 50))

			const vm = wrapper.vm as any
			const input = wrapper.find('input')

			// Test initial state
			expect(input.element.value).toBe('')
			expect(vm.formData.name).toBe('')

			// Test field update
			await input.setValue('My Task Name')
			await nextTick()

			// Verify HST integration
			expect(vm.formData.name).toBe('My Task Name')
		})

		it('should handle all numeric field types with real ANumericInput', async () => {
			const NumericFieldTest = defineComponent({
				components: { ANumericInput },
				template: `
					<div>
						<ANumericInput
							v-model="priorityValue"
							:schema="prioritySchema"
							@update:modelValue="handlePriorityChange"
						/>
						<ANumericInput
							v-model="progressValue"
							:schema="progressSchema"
							@update:modelValue="handleProgressChange"
						/>
					</div>
				`,
				setup() {
					const { formData, handleHSTChange, provideHSTPath } = useStonecrop({ doctype, recordId: 'test-task' })

					const priorityValue = computed({
						get: () => formData.value.priority || 1,
						set: value => {
							handleHSTChange({
								path: provideHSTPath('priority'),
								value: Number(value),
								fieldname: 'priority',
							})
						},
					})

					const progressValue = computed({
						get: () => formData.value.progress || 0,
						set: value => {
							handleHSTChange({
								path: provideHSTPath('progress'),
								value: Number(value),
								fieldname: 'progress',
							})
						},
					})

					return {
						priorityValue,
						progressValue,
						prioritySchema: { fieldname: 'priority', fieldtype: 'Int', label: 'Priority' },
						progressSchema: { fieldname: 'progress', fieldtype: 'Float', label: 'Progress' },
						handlePriorityChange: (val: number) => {
							priorityValue.value = val
						},
						handleProgressChange: (val: number) => {
							progressValue.value = val
						},
						formData,
					}
				},
			})

			const wrapper = mount(NumericFieldTest, {
				global: {
					provide: {
						$registry: registry,
					},
				},
			})

			await nextTick()
			await new Promise(resolve => setTimeout(resolve, 50))

			const vm = wrapper.vm as any
			const inputs = wrapper.findAll('input')

			// Test priority field (integer)
			await inputs[0].setValue('5')
			await nextTick()
			expect(vm.formData.priority).toBe(5)

			// Test progress field (float)
			await inputs[1].setValue('75.5')
			await nextTick()
			expect(vm.formData.progress).toBe(75.5)
		})

		it('should handle boolean fields with real ACheckbox', async () => {
			const CheckboxFieldTest = defineComponent({
				components: { ACheckbox },
				template: `
					<div>
						<ACheckbox
							v-model="activeValue"
							:schema="activeSchema"
							@update:modelValue="handleActiveChange"
						/>
						<ACheckbox
							v-model="urgentValue"
							:schema="urgentSchema"
							@update:modelValue="handleUrgentChange"
						/>
					</div>
				`,
				setup() {
					const { formData, handleHSTChange, provideHSTPath } = useStonecrop({ doctype, recordId: 'test-task' })

					const activeValue = computed({
						get: () => formData.value.active || false,
						set: value => {
							handleHSTChange({
								path: provideHSTPath('active'),
								value: Boolean(value),
								fieldname: 'active',
							})
						},
					})

					const urgentValue = computed({
						get: () => formData.value.urgent || false,
						set: value => {
							handleHSTChange({
								path: provideHSTPath('urgent'),
								value: Boolean(value),
								fieldname: 'urgent',
							})
						},
					})

					return {
						activeValue,
						urgentValue,
						activeSchema: { fieldname: 'active', fieldtype: 'Check', label: 'Active' },
						urgentSchema: { fieldname: 'urgent', fieldtype: 'Check', label: 'Urgent' },
						handleActiveChange: (val: boolean) => {
							activeValue.value = val
						},
						handleUrgentChange: (val: boolean) => {
							urgentValue.value = val
						},
						formData,
					}
				},
			})

			const wrapper = mount(CheckboxFieldTest, {
				global: {
					provide: {
						$registry: registry,
					},
				},
			})

			await nextTick()
			await new Promise(resolve => setTimeout(resolve, 50))

			const vm = wrapper.vm as any
			const checkboxes = wrapper.findAll('input[type="checkbox"]')

			// Test active checkbox
			await checkboxes[0].setValue(true)
			await nextTick()
			expect(vm.formData.active).toBe(true)

			// Test urgent checkbox
			await checkboxes[1].setValue(true)
			await nextTick()
			expect(vm.formData.urgent).toBe(true)
		})

		it('should handle complex nested data structures', async () => {
			const NestedDataTest = defineComponent({
				components: { ATextInput },
				template: `
					<div>
						<ATextInput
							v-model="metadataValue"
							:schema="metadataSchema"
							@update:modelValue="handleMetadataChange"
						/>
					</div>
				`,
				setup() {
					const { formData, handleHSTChange, provideHSTPath } = useStonecrop({ doctype, recordId: 'test-task' })

					const metadataValue = computed({
						get: () => {
							const metadata = formData.value.metadata
							return typeof metadata === 'object' ? JSON.stringify(metadata) : metadata || ''
						},
						set: value => {
							try {
								const parsedValue = JSON.parse(value)
								handleHSTChange({
									path: provideHSTPath('metadata'),
									value: parsedValue,
									fieldname: 'metadata',
								})
							} catch {
								// Invalid JSON, store as string
								handleHSTChange({
									path: provideHSTPath('metadata'),
									value,
									fieldname: 'metadata',
								})
							}
						},
					})

					return {
						metadataValue,
						metadataSchema: { fieldname: 'metadata', fieldtype: 'JSON', label: 'Metadata' },
						handleMetadataChange: (val: string) => {
							metadataValue.value = val
						},
						formData,
					}
				},
			})

			const wrapper = mount(NestedDataTest, {
				global: {
					provide: {
						$registry: registry,
					},
				},
			})

			await nextTick()
			await new Promise(resolve => setTimeout(resolve, 50))

			const vm = wrapper.vm as any
			const input = wrapper.find('input')

			// Test JSON data handling
			const testMetadata = { tags: ['urgent', 'backend'], estimatedHours: 8 }
			await input.setValue(JSON.stringify(testMetadata))
			await nextTick()

			expect(vm.formData.metadata).toEqual(testMetadata)
		})

		it('should maintain HST-Vue reactivity sync across multiple field updates', async () => {
			const MultiFieldTest = defineComponent({
				components: { ATextInput, ANumericInput, ACheckbox },
				template: `
					<div>
						<ATextInput v-model="nameValue" @update:modelValue="handleNameChange" />
						<ANumericInput v-model="priorityValue" @update:modelValue="handlePriorityChange" />
						<ACheckbox v-model="activeValue" @update:modelValue="handleActiveChange" />
					</div>
				`,
				setup() {
					const { formData, handleHSTChange, provideHSTPath, hstStore } = useStonecrop({
						doctype,
						recordId: 'multi-test',
					})

					// Create reactive bindings for each field
					const nameValue = computed({
						get: () => formData.value.name || '',
						set: value =>
							handleHSTChange({
								path: provideHSTPath('name'),
								value,
								fieldname: 'name',
							}),
					})

					const priorityValue = computed({
						get: () => formData.value.priority || 1,
						set: value =>
							handleHSTChange({
								path: provideHSTPath('priority'),
								value: Number(value),
								fieldname: 'priority',
							}),
					})

					const activeValue = computed({
						get: () => formData.value.active || false,
						set: value =>
							handleHSTChange({
								path: provideHSTPath('active'),
								value: Boolean(value),
								fieldname: 'active',
							}),
					})

					return {
						nameValue,
						priorityValue,
						activeValue,
						handleNameChange: (val: string) => {
							nameValue.value = val
						},
						handlePriorityChange: (val: number) => {
							priorityValue.value = val
						},
						handleActiveChange: (val: boolean) => {
							activeValue.value = val
						},
						formData,
						hstStore,
					}
				},
			})

			const wrapper = mount(MultiFieldTest, {
				global: {
					provide: {
						$registry: registry,
					},
				},
			})

			await nextTick()
			await new Promise(resolve => setTimeout(resolve, 50))

			const vm = wrapper.vm as any
			const inputs = wrapper.findAll('input')

			// Test multiple rapid updates
			await inputs[0].setValue('Task Name') // text input
			await inputs[1].setValue('3') // numeric input
			await inputs[2].setValue(true) // checkbox
			await nextTick()

			// Verify all values are synced
			expect(vm.formData.name).toBe('Task Name')
			expect(vm.formData.priority).toBe(3)
			expect(vm.formData.active).toBe(true)

			// Verify HST store has the data
			if (vm.hstStore) {
				expect(vm.hstStore.get('task.records.multi-test.name')).toBe('Task Name')
				expect(vm.hstStore.get('task.records.multi-test.priority')).toBe(3)
				expect(vm.hstStore.get('task.records.multi-test.active')).toBe(true)
			}
		})
	})
})

/**
 * Helper function to get default values for different field types
 */
function getDefaultValue(fieldtype?: string): any {
	switch (fieldtype) {
		case 'Data':
		case 'Text':
			return ''
		case 'Int':
		case 'Float':
			return 0
		case 'Check':
			return false
		case 'Date':
		case 'Datetime':
			return null
		case 'Select':
			return ''
		case 'JSON':
			return {}
		case 'Table':
			return []
		default:
			return null
	}
}
