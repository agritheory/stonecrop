import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ABadge from '../src/components/form/ABadge.vue'
import { badgeInputAccentStyle, resolveFieldBadge } from '../src/utils/badge'

describe('ABadge', { tags: ['component'] }, () => {
	it('renders nothing when label is empty', () => {
		const wrapper = mount(ABadge, {
			props: { label: '', presentation: 'cell-fill' },
		})
		expect(wrapper.find('.abadge').exists()).toBe(false)
	})

	it('renders cell-fill with variant class', () => {
		const wrapper = mount(ABadge, {
			props: { label: 'Open', variant: 'warning', presentation: 'cell-fill' },
		})
		expect(wrapper.text()).toBe('Open')
		expect(wrapper.classes()).toContain('abadge--cell-fill')
		expect(wrapper.classes()).toContain('abadge--warning')
	})

	it('renders input-accent presentation', () => {
		const wrapper = mount(ABadge, {
			props: { label: 'Submitted', variant: 'success', presentation: 'input-accent' },
		})
		expect(wrapper.classes()).toContain('abadge--input-accent')
		expect(wrapper.classes()).toContain('abadge--success')
	})

	it('resolves value and options when label is omitted', () => {
		const wrapper = mount(ABadge, {
			props: {
				value: 'Open',
				options: { Open: 'danger', Closed: 'success' },
				presentation: 'cell-fill',
			},
		})
		expect(wrapper.text()).toBe('Open')
		expect(wrapper.classes()).toContain('abadge--danger')
	})
})

describe('resolveFieldBadge', { tags: ['component'] }, () => {
	it('returns descriptor from format function', () => {
		const result = resolveFieldBadge(
			'Draft',
			['Draft', 'Submitted'],
			() => ({ label: 'To Bill', variant: 'warning' }),
			{ row: { per_billed: 0 } }
		)
		expect(result).toEqual({ label: 'To Bill', variant: 'warning' })
	})

	it('falls back to options map when format returns a string key', () => {
		const result = resolveFieldBadge('Open', { Open: 'warning' }, () => 'Open', {})
		expect(result).toEqual({ label: 'Open', variant: 'warning' })
	})

	it('looks up stored value when format is absent', () => {
		expect(resolveFieldBadge('Completed', { Completed: 'success' }, undefined, {})).toEqual({
			label: 'Completed',
			variant: 'success',
		})
	})
})

describe('badgeInputAccentStyle', { tags: ['component'] }, () => {
	it('returns border styles for a variant', () => {
		expect(badgeInputAccentStyle({ label: 'Open', variant: 'warning' })).toEqual({
			borderLeftWidth: '4px',
			borderLeftStyle: 'solid',
			borderLeftColor: 'var(--sc-badge-warning-accent)',
			paddingLeft: 'calc(1ch - 4px)',
		})
	})

	it('returns undefined when label is empty', () => {
		expect(badgeInputAccentStyle(undefined)).toBeUndefined()
	})
})
