import { config, flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'

vi.mock('@vueuse/core', () => ({
	// The real composable always returns all of these; omitting left/bottom made the mock a shape
	// the library never produces, which is how a TypeError in ACell's $patch went unnoticed.
	useElementBounding: vi.fn(() => ({
		left: { value: 10 },
		bottom: { value: 60 },
		width: { value: 200 },
		height: { value: 100 },
	})),
	useDebounceFn: vi.fn(fn => fn),
	useMutationObserver: vi.fn(),
}))

vi.mock('@vueuse/components', () => ({
	vResizeObserver: vi.fn(),
	vOnClickOutside: vi.fn(),
}))

import ACell from '../src/components/ACell.vue'
import ARow from '../src/components/ARow.vue'
import ATable from '../src/components/ATable.vue'
import type { TableColumn, TableConfig } from '../src/types'

describe('ATable linkResolver', { tags: ['component'] }, () => {
	config.global.components = { ACell, ARow }

	const cfg: TableConfig = { view: 'list' }

	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('resolves a bare Link ID to its display name when linkResolver is provided', async () => {
		const linkResolver = vi.fn().mockResolvedValue('Personal')

		const columns: TableColumn[] = [
			{ name: 'category_id', label: 'Category', fieldtype: 'Link', linkDoctype: 'category' },
		]

		const wrapper = mount(ATable, {
			props: {
				rows: [{ category_id: '1' }],
				columns,
				'onUpdate:rows': () => {},
				config: cfg,
				linkResolver,
			},
			global: { components: { ACell, ARow } },
		})

		await nextTick()
		await flushPromises()

		expect(linkResolver).toHaveBeenCalledWith('category', '1')
		expect(wrapper.find('td.atable-cell').text()).toBe('Personal')
	})

	it('falls back to the raw ID when linkResolver returns undefined', async () => {
		const linkResolver = vi.fn().mockResolvedValue(undefined)

		const columns: TableColumn[] = [
			{ name: 'category_id', label: 'Category', fieldtype: 'Link', linkDoctype: 'category' },
		]

		const wrapper = mount(ATable, {
			props: {
				rows: [{ category_id: '1' }],
				columns,
				'onUpdate:rows': () => {},
				config: cfg,
				linkResolver,
			},
			global: { components: { ACell, ARow } },
		})

		await nextTick()
		await flushPromises()

		expect(wrapper.find('td.atable-cell').text()).toBe('1')
	})

	it('does not call linkResolver for non-Link columns', async () => {
		const linkResolver = vi.fn().mockResolvedValue('ignored')

		const columns: TableColumn[] = [{ name: 'title', label: 'Title', fieldtype: 'Data' }]

		const wrapper = mount(ATable, {
			props: {
				rows: [{ title: 'Hello' }],
				columns,
				'onUpdate:rows': () => {},
				config: cfg,
				linkResolver,
			},
			global: { components: { ACell, ARow } },
		})

		await nextTick()
		await flushPromises()

		expect(linkResolver).not.toHaveBeenCalled()
		expect(wrapper.find('td.atable-cell').text()).toBe('Hello')
	})

	it('displays pre-resolved AFormLinkValue objects without calling linkResolver', async () => {
		const linkResolver = vi.fn()

		const columns: TableColumn[] = [
			{ name: 'category_id', label: 'Category', fieldtype: 'Link', linkDoctype: 'category' },
		]

		const wrapper = mount(ATable, {
			props: {
				rows: [{ category_id: { id: '1', displayText: 'Personal' } }],
				columns,
				'onUpdate:rows': () => {},
				config: cfg,
				linkResolver,
			},
			global: { components: { ACell, ARow } },
		})

		await nextTick()
		await flushPromises()

		expect(linkResolver).not.toHaveBeenCalled()
		expect(wrapper.find('td.atable-cell').text()).toBe('Personal')
	})

	it('resolves via injected aformLinkResolver when no prop is given', async () => {
		const injectedResolver = vi.fn().mockResolvedValue('Work')

		const columns: TableColumn[] = [
			{ name: 'category_id', label: 'Category', fieldtype: 'Link', linkDoctype: 'category' },
		]

		const wrapper = mount(ATable, {
			props: {
				rows: [{ category_id: '2' }],
				columns,
				'onUpdate:rows': () => {},
				config: cfg,
			},
			global: {
				components: { ACell, ARow },
				provide: { aformLinkResolver: injectedResolver },
			},
		})

		await nextTick()
		await flushPromises()

		expect(injectedResolver).toHaveBeenCalledWith('category', '2')
		expect(wrapper.find('td.atable-cell').text()).toBe('Work')
	})
})
