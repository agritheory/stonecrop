import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import ACell from '../src/components/ACell.vue'
import { createTableStore } from '../src/stores/table'
import type { TableColumn } from '../src/types'

// ACell renders ABadge by global registration (it lives in @stonecrop/aform, which atable
// cannot import). A stub stands in so these tests pin what ACell *passes*, independent of
// how aform paints it.
const ABadgeStub = defineComponent({
	props: {
		presentation: { type: String, required: true },
		label: { type: String, default: undefined },
		variant: { type: String, default: undefined },
		value: { type: null, default: undefined },
		options: { type: null, default: undefined },
	},
	template: `<span class="badge-stub" :data-presentation="presentation" :data-variant="variant"
		:data-label="label" :data-value="value">{{ label ?? value }}</span>`,
})

const mountCell = (columns: TableColumn[], rows: Record<string, unknown>[]) =>
	mount(ACell, {
		props: { colIndex: 0, rowIndex: 0, store: createTableStore({ columns, rows }) },
		global: { components: { ABadge: ABadgeStub } },
	})

describe('ACell badge rendering', { tags: ['component'] }, () => {
	beforeEach(() => setActivePinia(createPinia()))

	const badgeOptions = { choices: ['Open', 'Closed'], badges: { Open: 'warning', Closed: 'success' } }

	it('renders a cell-fill badge from a badge map on options', () => {
		const wrapper = mountCell([{ name: 'status', component: 'ADropdown', options: badgeOptions }], [{ status: 'Open' }])
		const badge = wrapper.find('.badge-stub')
		expect(badge.exists()).toBe(true)
		expect(badge.attributes('data-presentation')).toBe('cell-fill')
		expect(badge.attributes('data-value')).toBe('Open')
	})

	it('renders a cell-fill badge for ASegmentedControl columns with badge options', () => {
		const wrapper = mountCell(
			[{ name: 'status', component: 'ASegmentedControl', options: badgeOptions }],
			[{ status: 'Closed' }]
		)
		const badge = wrapper.find('.badge-stub')
		expect(badge.exists()).toBe(true)
		expect(badge.attributes('data-presentation')).toBe('cell-fill')
		expect(badge.attributes('data-value')).toBe('Closed')
	})

	it('passes the raw stored value, not the formatted text, for options lookup', () => {
		const wrapper = mountCell(
			[{ name: 'status', component: 'ADropdown', options: badgeOptions, format: (v: any) => `<${String(v)}>` }],
			[{ status: 'Closed' }]
		)
		// format returns a plain string here, so the options branch still owns the lookup and
		// must key off the stored value.
		expect(wrapper.find('.badge-stub').attributes('data-value')).toBe('Closed')
	})

	it('renders a descriptor returned by format in preference to the options map', () => {
		const wrapper = mountCell(
			[
				{
					name: 'status',
					component: 'ADropdown',
					options: badgeOptions,
					format: () => ({ label: 'Overdue', variant: 'danger' as const }),
				},
			],
			[{ status: 'Open' }]
		)
		const badge = wrapper.find('.badge-stub')
		expect(badge.attributes('data-label')).toBe('Overdue')
		expect(badge.attributes('data-variant')).toBe('danger')
		expect(badge.attributes('data-presentation')).toBe('cell-fill')
	})

	it('leaves a plain string[] select as text, with no badge', () => {
		const wrapper = mountCell(
			[{ name: 'status', component: 'ADropdown', options: ['Open', 'Closed'] }],
			[{ status: 'Open' }]
		)
		expect(wrapper.find('.badge-stub').exists()).toBe(false)
		expect(wrapper.text()).toBe('Open')
	})

	it('leaves a column with no options as text, with no badge', () => {
		const wrapper = mountCell([{ name: 'note', component: 'ATextInput' }], [{ note: 'hello' }])
		expect(wrapper.find('.badge-stub').exists()).toBe(false)
		expect(wrapper.text()).toBe('hello')
	})
})
