import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { type Component, defineComponent, h } from 'vue'
// The theme every host gets from the module. Its tokens size the cells and draw the borders: a rule reading
// an unset token is dropped whole, which leaves a cell with no padding and a box with no border.
import '@stonecrop/themes/default.css'

import DocBuilderActionsPanel from '../src/runtime/app/components/DocBuilderActionsPanel.vue'
import DocBuilderFieldsPanel from '../src/runtime/app/components/DocBuilderFieldsPanel.vue'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

const mountInHost = (component: Component, modelValue: unknown) => {
	const Host = defineComponent({
		setup: () => () => h('div', { style: 'width: 900px' }, [h(component, { modelValue })]),
	})
	wrapper = mount(Host, { attachTo: document.body, global: { plugins: [createPinia()] } })
}

const textBoxes = () => [...document.querySelectorAll<HTMLInputElement>('td input[type="text"]')]

const expectInsideItsCell = (input: HTMLInputElement) => {
	const cell = input.closest('td')!
	const style = getComputedStyle(cell)
	const edges = cell.getBoundingClientRect()
	const box = input.getBoundingClientRect()
	const inset = (side: 'Left' | 'Right') =>
		Number.parseFloat(style[`border${side}Width`]) + Number.parseFloat(style[`padding${side}`])
	expect(box.left).toBeCloseTo(edges.left + inset('Left'), 0)
	expect(box.right).toBeCloseTo(edges.right - inset('Right'), 0)
}

// Each column that has a filter: the filter box, and what the first row holds under it.
const columnsUnderFilters = () => {
	const filterCells = [...document.querySelectorAll('.atable-filters-row > th')]
	const rowCells = [...document.querySelector('tbody .atable-row')!.children]
	return filterCells.flatMap((filterCell, index) => {
		const filter = filterCell.querySelector('input, select')
		const content = rowCells[index]?.querySelector<HTMLElement>('input[type="text"], .badge')
		return filter && content ? [{ filter: filter.getBoundingClientRect(), content }] : []
	})
}

const expectUnderItsFilter = ({ filter, content }: ReturnType<typeof columnsUnderFilters>[number]) => {
	const box = content.getBoundingClientRect()
	expect(box.left).toBeCloseTo(filter.left, 0)
	// A text box also spans its column as the filter box does; a badge is only as wide as its words.
	if (content instanceof HTMLInputElement) expect(box.right).toBeCloseTo(filter.right, 0)
}

const fields = [
	{ fieldname: 'name', label: 'Name', component: 'ATextInput' },
	{ fieldname: 'email', label: 'Email', component: 'ATextInput' },
]

const workflow = {
	states: ['Draft'],
	actions: { email: { label: 'Email', stateless: true } },
	triggers: {
		dateOrder: { label: 'Date order', on: ['createdAt'], clientHandler: "setError('createdAt', 'bad')" },
	},
}

// Needs real layout: a text box's width is what the browser computes from its padding and border.
describe('a DocBuilder row lines up under the filter row above it', { tags: ['component'] }, () => {
	it('in the fields table: the ID and component boxes span their filter boxes, the source badge starts under its', () => {
		mountInHost(DocBuilderFieldsPanel, fields)

		expect(columnsUnderFilters()).toHaveLength(3)
		columnsUnderFilters().forEach(expectUnderItsFilter)
	})

	it('in the actions table: the type badge starts under its filter box', () => {
		mountInHost(DocBuilderActionsPanel, workflow)

		expect(columnsUnderFilters()).toHaveLength(1)
		columnsUnderFilters().forEach(expectUnderItsFilter)
	})
})

describe('a DocBuilder text box spans exactly its table cell', { tags: ['component'] }, () => {
	it('in the fields table', () => {
		mountInHost(DocBuilderFieldsPanel, fields)

		expect(textBoxes()).toHaveLength(6)
		textBoxes().forEach(expectInsideItsCell)
	})

	it('in the actions table', () => {
		mountInHost(DocBuilderActionsPanel, workflow)

		expect(textBoxes()).toHaveLength(2)
		textBoxes().forEach(expectInsideItsCell)
	})
})
