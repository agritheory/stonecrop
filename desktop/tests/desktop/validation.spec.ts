import { mount, flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { List, Map } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'

import { AForm } from '@stonecrop/aform'
import { Doctype, Registry, Stonecrop, useValidationStore } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { makeStonecropPlugin } from './desktop.helpers'

// A booking doctype with a cross-field validation trigger: end date must not precede start date.
function buildBookingDoctype() {
	const fields = List([
		{ kind: 'field' as const, fieldname: 'start_date', label: 'Start', component: 'ATextInput' },
		{ kind: 'field' as const, fieldname: 'end_date', label: 'End', component: 'ATextInput' },
		{ kind: 'field' as const, fieldname: 'status', label: 'Status', component: 'ATextInput' },
	])
	const workflow = {
		states: ['draft'],
		triggers: {
			dateOrder: {
				on: ['start_date', 'end_date'],
				clientHandler: "if (record.end_date < record.start_date) setError('end_date', 'End before start')",
			},
		},
	}
	return new Doctype('booking', fields as any, workflow as any, Map({}))
}

const recordAdapter: RouteAdapter = {
	getCurrentDoctype: () => 'booking',
	getCurrentRecordId: () => 'rec-1',
	getCurrentView: () => 'record',
	navigate: async () => {},
}

describe('Desktop field-validation wiring', { tags: ['component'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let pinia: ReturnType<typeof createPinia>

	beforeEach(() => {
		pinia = createPinia()
		setActivePinia(pinia)

		registry = new Registry()
		stonecrop = new Stonecrop(registry)
		registry.addDoctype(buildBookingDoctype())
		stonecrop.addRecord('booking', 'rec-1', {
			id: 'rec-1',
			start_date: '2020-01-01',
			end_date: '2020-01-02',
			status: 'draft',
		})
	})

	afterEach(() => {
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
	})

	function mountDesktop() {
		return mount(Desktop, {
			props: { routeAdapter: recordAdapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), pinia],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})
	}

	it('drives validation on the edit path and records the error in the store', async () => {
		const wrapper = mountDesktop()
		await nextTick()

		// Simulate AForm editing the two dates into an invalid order (end before start).
		const aform = wrapper.findComponent(AForm)
		await aform.vm.$emit('update:data', { start_date: '2020-01-02', end_date: '2020-01-01' })
		await flushPromises()

		const validation = useValidationStore()
		expect(validation.isValid).toBe(false)
		expect(validation.errorsByField).toEqual({ end_date: ['End before start'] })
	})

	it('feeds the errors down to AForm via :errors', async () => {
		const wrapper = mountDesktop()
		await nextTick()

		const aform = wrapper.findComponent(AForm)
		await aform.vm.$emit('update:data', { start_date: '2020-01-02', end_date: '2020-01-01' })
		await flushPromises()
		await nextTick()

		expect(aform.props('errors')).toEqual({ end_date: ['End before start'] })
	})

	it('clears errors when a valid edit fixes the record', async () => {
		const wrapper = mountDesktop()
		await nextTick()
		const aform = wrapper.findComponent(AForm)

		await aform.vm.$emit('update:data', { start_date: '2020-01-02', end_date: '2020-01-01' })
		await flushPromises()
		expect(useValidationStore().isValid).toBe(false)

		// User fixes the end date back to a valid order.
		await aform.vm.$emit('update:data', { start_date: '2020-01-02', end_date: '2020-01-03' })
		await flushPromises()
		expect(useValidationStore().isValid).toBe(true)
	})
})
