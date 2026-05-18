import { describe, it, expect, vi, beforeEach } from 'vitest'
import { markRaw } from 'vue'
import { mount } from '@vue/test-utils'
import ATableColumnFilter from '../src/components/ATableColumnFilter.vue'
import type { TableColumn } from '../src/types'

describe('Column Filter Component', { tags: ['component'] }, () => {
	let mockStore: any
	let baseColumn: TableColumn

	beforeEach(() => {
		mockStore = {
			rows: [
				{ id: 1, name: 'Alice', age: 30, status: 'active' },
				{ id: 2, name: 'Bob', age: 25, status: 'inactive' },
				{ id: 3, name: 'Charlie', age: 35, status: 'active' },
			],
			setFilter: vi.fn(),
			clearFilter: vi.fn(),
		}

		baseColumn = {
			name: 'name',
			label: 'Name',
			fieldtype: 'Data',
		}
	})

	describe('Conditional rendering by filterType', () => {
		it('renders text input when filterType is "text"', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'text' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const textInput = wrapper.find('input[type="text"]')
			expect(textInput.exists()).toBe(true)
		})

		it('renders text input when filterType is undefined (default)', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: baseColumn,
					colIndex: 0,
					store: mockStore,
				},
			})

			const textInput = wrapper.find('input[type="text"]')
			expect(textInput.exists()).toBe(true)
		})

		it('renders number input when filterType is "number"', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'number' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const numberInput = wrapper.find('input[type="number"]')
			expect(numberInput.exists()).toBe(true)
		})

		it('renders select when filterType is "select"', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: {
						...baseColumn,
						filterType: 'select',
						filterOptions: [
							{ label: 'Option 1', value: 'opt1' },
							{ label: 'Option 2', value: 'opt2' },
						],
					},
					colIndex: 0,
					store: mockStore,
				},
			})

			const select = wrapper.find('select')
			expect(select.exists()).toBe(true)
			expect(select.findAll('option').length).toBe(3) // "All" + 2 options
		})

		it('renders date input when filterType is "date"', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'date' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const dateInput = wrapper.find('input[type="date"]')
			expect(dateInput.exists()).toBe(true)
		})

		it('renders two date inputs when filterType is "dateRange"', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'dateRange' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const dateInputs = wrapper.findAll('input[type="date"]')
			expect(dateInputs.length).toBe(2)
			expect(wrapper.find('.date-separator').text()).toBe('-')
		})

		it('renders checkbox when filterType is "checkbox"', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'checkbox' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const checkbox = wrapper.find('input[type="checkbox"]')
			expect(checkbox.exists()).toBe(true)
			expect(wrapper.find('.checkbox-filter').exists()).toBe(true)
		})

		it('renders custom component when filterType is "component"', () => {
			const CustomComponent = markRaw({
				name: 'CustomFilter',
				template: '<div class="custom-filter">Custom</div>',
				props: ['value', 'column', 'colIndex', 'store'],
			})

			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: {
						...baseColumn,
						filterType: 'component',
						filterComponent: CustomComponent as any,
					},
					colIndex: 0,
					store: mockStore,
				},
				global: {
					components: {
						CustomFilter: CustomComponent,
					},
				},
			})

			expect(wrapper.find('.custom-filter').exists()).toBe(true)
		})
	})

	describe('Filter functionality', () => {
		it('updateFilter() calls store.setFilter() with correct value', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'text' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const input = wrapper.find('input[type="text"]')
			await input.setValue('test value')
			await input.trigger('input')

			expect(mockStore.setFilter).toHaveBeenCalledWith(0, { value: 'test value' })
		})

		it('updateFilter() calls store.clearFilter() when value is empty', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'text' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const input = wrapper.find('input[type="text"]')
			await input.setValue('')
			await input.trigger('input')

			expect(mockStore.clearFilter).toHaveBeenCalledWith(0)
		})

		it('updateFilter() does NOT clear filter for checkbox when value is false', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'checkbox' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const checkbox = wrapper.find('input[type="checkbox"]')
			await checkbox.setValue(false)
			await checkbox.trigger('change')

			expect(mockStore.setFilter).toHaveBeenCalledWith(0, { value: false })
			expect(mockStore.clearFilter).not.toHaveBeenCalled()
		})

		it('updateDateRangeFilter() updates startValue correctly', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'dateRange' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const dateInputs = wrapper.findAll('input[type="date"]')
			await dateInputs[0].setValue('2025-01-01')
			await dateInputs[0].trigger('change')

			expect(mockStore.setFilter).toHaveBeenCalledWith(0, {
				value: null,
				startValue: '2025-01-01',
				endValue: '',
			})
		})

		it('updateDateRangeFilter() updates endValue correctly', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'dateRange' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const dateInputs = wrapper.findAll('input[type="date"]')
			await dateInputs[1].setValue('2025-12-31')
			await dateInputs[1].trigger('change')

			expect(mockStore.setFilter).toHaveBeenCalledWith(0, {
				value: null,
				startValue: '',
				endValue: '2025-12-31',
			})
		})

		it('updateDateRangeFilter() calls clearFilter when both values are empty', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'dateRange' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const dateInputs = wrapper.findAll('input[type="date"]')
			// Set a value first
			await dateInputs[0].setValue('2025-01-01')
			await dateInputs[0].trigger('change')

			// Then clear it
			await dateInputs[0].setValue('')
			await dateInputs[0].trigger('change')

			expect(mockStore.clearFilter).toHaveBeenCalledWith(0)
		})

		it('clearFilter() resets all values and calls store.clearFilter()', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'text' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const input = wrapper.find('input[type="text"]')
			await input.setValue('test')
			await input.trigger('input')

			// Clear button should appear
			const clearBtn = wrapper.find('.clear-btn')
			await clearBtn.trigger('click')

			expect(mockStore.clearFilter).toHaveBeenCalledWith(0)
			expect((input.element as HTMLInputElement).value).toBe('')
		})
	})

	describe('Auto-generated select options', () => {
		it('getSelectOptions() returns column.filterOptions if it exists', () => {
			const filterOptions = [
				{ label: 'Active', value: 'active' },
				{ label: 'Inactive', value: 'inactive' },
			]

			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: {
						...baseColumn,
						filterType: 'select',
						filterOptions,
					},
					colIndex: 0,
					store: mockStore,
				},
			})

			const options = wrapper.findAll('option')
			// "All" + 2 custom options
			expect(options.length).toBe(3)
			expect(options[1].text()).toBe('Active')
			expect(options[2].text()).toBe('Inactive')
		})

		it('getSelectOptions() generates unique options from store.rows', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: {
						...baseColumn,
						name: 'status',
						filterType: 'select',
						// No filterOptions provided
					},
					colIndex: 0,
					store: mockStore,
				},
			})

			const options = wrapper.findAll('option')
			// "All" + 2 unique values (active, inactive)
			expect(options.length).toBe(3)
			expect(options[1].text()).toBe('active')
			expect(options[2].text()).toBe('inactive')
		})

		it('"All" option appears as first option in select', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: {
						...baseColumn,
						filterType: 'select',
					},
					colIndex: 0,
					store: mockStore,
				},
			})

			const firstOption = wrapper.find('option')
			expect(firstOption.text()).toBe('All')
			expect(firstOption.element.value).toBe('')
		})

		it('ignores null, undefined and empty values when generating options', () => {
			const storeWithNulls = {
				...mockStore,
				rows: [
					{ id: 1, status: 'active' },
					{ id: 2, status: null },
					{ id: 3, status: undefined },
					{ id: 4, status: '' },
					{ id: 5, status: 'inactive' },
				],
			}

			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: {
						...baseColumn,
						name: 'status',
						filterType: 'select',
					},
					colIndex: 0,
					store: storeWithNulls,
				},
			})

			const options = wrapper.findAll('option')
			// "All" + 2 valid values (active, inactive)
			expect(options.length).toBe(3)
		})
	})

	describe('Clear filter button', () => {
		it('"×" button only appears when hasActiveFilter is true', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'text' },
					colIndex: 0,
					store: mockStore,
				},
			})

			// Initially no clear button
			expect(wrapper.find('.clear-btn').exists()).toBe(false)

			// Type something
			const input = wrapper.find('input[type="text"]')
			await input.setValue('test')
			await input.trigger('input')

			// Clear button should appear
			expect(wrapper.find('.clear-btn').exists()).toBe(true)
		})

		it('button appears for dateRange when any value exists', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'dateRange' },
					colIndex: 0,
					store: mockStore,
				},
			})

			expect(wrapper.find('.clear-btn').exists()).toBe(false)

			const dateInputs = wrapper.findAll('input[type="date"]')
			await dateInputs[0].setValue('2025-01-01')
			await dateInputs[0].trigger('change')

			expect(wrapper.find('.clear-btn').exists()).toBe(true)
		})

		it('clicking button calls clearFilter()', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'text' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const input = wrapper.find('input[type="text"]')
			await input.setValue('test')
			await input.trigger('input')

			const clearBtn = wrapper.find('.clear-btn')
			await clearBtn.trigger('click')

			expect(mockStore.clearFilter).toHaveBeenCalledWith(0)
		})
	})

	describe('Change vs input events', () => {
		it('text input uses @input event', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'text' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const input = wrapper.find('input[type="text"]')
			await input.setValue('test')
			await input.trigger('input')

			expect(mockStore.setFilter).toHaveBeenCalled()
		})

		it('date input uses @change event', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'date' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const input = wrapper.find('input[type="date"]')
			await input.setValue('2025-01-01')
			await input.trigger('change')

			expect(mockStore.setFilter).toHaveBeenCalledWith(0, { value: '2025-01-01' })
		})

		it('select uses @change event', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: {
						...baseColumn,
						filterType: 'select',
						filterOptions: [{ label: 'Test', value: 'test' }],
					},
					colIndex: 0,
					store: mockStore,
				},
			})

			const select = wrapper.find('select')
			await select.setValue('test')
			await select.trigger('change')

			expect(mockStore.setFilter).toHaveBeenCalledWith(0, { value: 'test' })
		})

		it('checkbox uses @change event', async () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { ...baseColumn, filterType: 'checkbox' },
					colIndex: 0,
					store: mockStore,
				},
			})

			const checkbox = wrapper.find('input[type="checkbox"]')
			await checkbox.setValue(true)
			await checkbox.trigger('change')

			expect(mockStore.setFilter).toHaveBeenCalledWith(0, { value: true })
		})
	})

	describe('fieldtype-based filterType derivation', () => {
		it('renders checkbox when fieldtype is Check and filterType is absent', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { name: 'active', label: 'Active', fieldtype: 'Check' },
					colIndex: 0,
					store: mockStore,
				},
			})
			expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
		})

		it('renders date input when fieldtype is Date and filterType is absent', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { name: 'created', label: 'Created', fieldtype: 'Date' },
					colIndex: 0,
					store: mockStore,
				},
			})
			expect(wrapper.find('input[type="date"]').exists()).toBe(true)
		})

		it('renders two date inputs (dateRange) when fieldtype is Datetime and filterType is absent', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { name: 'created_at', label: 'Created At', fieldtype: 'Datetime' },
					colIndex: 0,
					store: mockStore,
				},
			})
			expect(wrapper.findAll('input[type="date"]')).toHaveLength(2)
		})

		it('renders number input when fieldtype is Int and filterType is absent', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { name: 'qty', label: 'Qty', fieldtype: 'Int' },
					colIndex: 0,
					store: mockStore,
				},
			})
			expect(wrapper.find('input[type="number"]').exists()).toBe(true)
		})

		it('renders number input when fieldtype is Float, Currency, Decimal, or Quantity and filterType is absent', () => {
			for (const fieldtype of ['Float', 'Currency', 'Decimal', 'Quantity']) {
				const wrapper = mount(ATableColumnFilter, {
					props: {
						column: { name: 'amount', label: 'Amount', fieldtype },
						colIndex: 0,
						store: mockStore,
					},
				})
				expect(wrapper.find('input[type="number"]').exists()).toBe(true)
			}
		})

		it('renders select when fieldtype is Select and filterType is absent', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { name: 'status', label: 'Status', fieldtype: 'Select' },
					colIndex: 0,
					store: mockStore,
				},
			})
			expect(wrapper.find('select').exists()).toBe(true)
		})

		it('explicit filterType takes precedence over fieldtype', () => {
			// fieldtype says Check (→ checkbox) but explicit filterType overrides to text
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { name: 'active', label: 'Active', fieldtype: 'Check', filterType: 'text' },
					colIndex: 0,
					store: mockStore,
				},
			})
			expect(wrapper.find('input[type="text"]').exists()).toBe(true)
			expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false)
		})

		it('falls back to text for unknown fieldtype', () => {
			const wrapper = mount(ATableColumnFilter, {
				props: {
					column: { name: 'misc', label: 'Misc', fieldtype: 'UnknownType' },
					colIndex: 0,
					store: mockStore,
				},
			})
			expect(wrapper.find('input[type="text"]').exists()).toBe(true)
		})
	})
})
