import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ATableLoading from '../src/components/ATableLoading.vue'
import ATableLoadingBar from '../src/components/ATableLoadingBar.vue'

const normalizeHtml = (html: string) => html.replace(/\s?data-v-[a-z0-9]+="[^"]*"/g, '')

describe('ATableLoading component', { tags: ['component'] }, () => {
	it('should render correctly', () => {
		const wrapper = mount(ATableLoading)

		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.aloading').exists()).toBe(true)
		expect(wrapper.find('.aloading-header').exists()).toBe(true)
		expect(wrapper.find('.aloading-bar').exists()).toBe(true)
	})

	it('should render slot content', () => {
		const wrapper = mount(ATableLoading, {
			slots: {
				default: 'Loading data...',
			},
		})

		expect(wrapper.find('.aloading-header').text()).toBe('Loading data...')
	})

	it('should render without slot content', () => {
		const wrapper = mount(ATableLoading)

		expect(wrapper.find('.aloading-header').text()).toBe('')
	})

	it('should have correct CSS classes', () => {
		const wrapper = mount(ATableLoading)

		const loadingDiv = wrapper.find('.aloading')
		expect(loadingDiv.exists()).toBe(true)

		const header = wrapper.find('.aloading-header')
		expect(header.exists()).toBe(true)

		const bar = wrapper.find('.aloading-bar')
		expect(bar.exists()).toBe(true)
	})
})

describe('ATableLoadingBar component', { tags: ['component'] }, () => {
	it('should render correctly', () => {
		const wrapper = mount(ATableLoadingBar)

		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.aloading').exists()).toBe(true)
		expect(wrapper.find('.aloading-header').exists()).toBe(true)
		expect(wrapper.find('.aloading-bar').exists()).toBe(true)
	})

	it('should render slot content', () => {
		const wrapper = mount(ATableLoadingBar, {
			slots: {
				default: 'Loading progress...',
			},
		})

		expect(wrapper.find('.aloading-header').text()).toBe('Loading progress...')
	})

	it('should render without slot content', () => {
		const wrapper = mount(ATableLoadingBar)

		expect(wrapper.find('.aloading-header').text()).toBe('')
	})

	it('should have correct CSS classes', () => {
		const wrapper = mount(ATableLoadingBar)

		const loadingDiv = wrapper.find('.aloading')
		expect(loadingDiv.exists()).toBe(true)

		const header = wrapper.find('.aloading-header')
		expect(header.exists()).toBe(true)

		const bar = wrapper.find('.aloading-bar')
		expect(bar.exists()).toBe(true)
	})

	it('should have the same structure as ATableLoading', () => {
		const loadingWrapper = mount(ATableLoading, {
			slots: { default: 'Test' },
		})
		const loadingBarWrapper = mount(ATableLoadingBar, {
			slots: { default: 'Test' },
		})

		expect(normalizeHtml(loadingWrapper.html())).toBe(normalizeHtml(loadingBarWrapper.html()))
	})
})
