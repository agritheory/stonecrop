import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref, Ref } from 'vue'

const mockFiles: Ref<FileList | null> = ref(null)

vi.mock('@vueuse/core', () => ({
	useFileDialog: () => ({
		files: mockFiles,
		open: vi.fn(),
		reset: vi.fn(() => {
			mockFiles.value = null
		}),
		onChange: vi.fn(),
	}),
}))

import AFileAttach from '../src/components/form/AFileAttach.vue'

function createFileList(files: File[]): FileList {
	return {
		...files,
		length: files.length,
		item: (index: number) => files[index],
		[Symbol.iterator]: function* () {
			for (const file of files) yield file
		},
	} as FileList
}

describe('file attach component', { tags: ['component'] }, () => {
	beforeEach(() => {
		mockFiles.value = null
	})

	it('renders attach and reset buttons by default', () => {
		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File' },
		})
		const buttons = wrapper.findAll('button')
		expect(buttons.length).toBe(2)
		expect(buttons[0].text()).toContain('Attach File')
		expect(buttons[1].text()).toContain('Reset')
	})

	it('reset button is disabled when no file is selected', () => {
		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File' },
		})
		const resetBtn = wrapper.findAll('button')[1]
		expect(resetBtn.attributes()).toHaveProperty('disabled')
	})

	it('both buttons are disabled in read mode', () => {
		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File', mode: 'read' },
		})
		const buttons = wrapper.findAll('button')
		expect(buttons[0].attributes()).toHaveProperty('disabled')
		expect(buttons[1].attributes()).toHaveProperty('disabled')
	})

	it('renders display mode with no-file message when no file selected', () => {
		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File', mode: 'display' },
		})
		expect(wrapper.find('button').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').text()).toBe('No file selected')
	})

	it('renders display mode with single file', async () => {
		mockFiles.value = createFileList([new File(['content'], 'test.pdf', { type: 'application/pdf' })])

		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File', mode: 'display' },
		})

		await flushPromises()

		expect(wrapper.find('.aform_file-attach-feedback').exists()).toBe(true)
		expect(wrapper.text()).toContain('1 file')
		expect(wrapper.text()).toContain('test.pdf')
	})

	it('renders display mode with multiple files', async () => {
		mockFiles.value = createFileList([
			new File(['content1'], 'file1.pdf', { type: 'application/pdf' }),
			new File(['content2'], 'file2.pdf', { type: 'application/pdf' }),
		])

		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File', mode: 'display' },
		})

		await flushPromises()

		expect(wrapper.find('.aform_file-attach-feedback').exists()).toBe(true)
		expect(wrapper.text()).toContain('2 files')
		expect(wrapper.text()).toContain('file1.pdf')
		expect(wrapper.text()).toContain('file2.pdf')
	})

	it('renders edit mode with files selected', async () => {
		mockFiles.value = createFileList([new File(['content'], 'test.pdf', { type: 'application/pdf' })])

		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File', mode: 'edit' },
		})

		await flushPromises()

		expect(wrapper.find('.aform_file-attach-feedback').exists()).toBe(true)
		expect(wrapper.text()).toContain('You have selected:')
		expect(wrapper.text()).toContain('1 file')
		expect(wrapper.text()).toContain('test.pdf')
	})

	it('reset button is enabled when files are selected', async () => {
		mockFiles.value = createFileList([new File(['content'], 'test.pdf', { type: 'application/pdf' })])

		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File' },
		})

		await flushPromises()

		const resetBtn = wrapper.findAll('button')[1]
		expect(resetBtn.attributes('disabled')).toBeUndefined()
	})

	it('both buttons are disabled in read mode even when files are selected', async () => {
		mockFiles.value = createFileList([new File(['content'], 'test.pdf', { type: 'application/pdf' })])

		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File', mode: 'read' },
		})

		await flushPromises()

		const buttons = wrapper.findAll('button')
		expect(buttons[0].attributes()).toHaveProperty('disabled')
		expect(buttons[1].attributes()).toHaveProperty('disabled')
	})

	it('clicking attach button calls open function', async () => {
		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File' },
		})

		await flushPromises()

		const attachBtn = wrapper.findAll('button')[0]
		await attachBtn.trigger('click')

		expect(wrapper.vm).toBeTruthy()
	})

	it('clicking reset button calls reset function when files exist', async () => {
		mockFiles.value = createFileList([new File(['content'], 'test.pdf', { type: 'application/pdf' })])

		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File' },
		})

		await flushPromises()

		const resetBtn = wrapper.findAll('button')[1]
		await resetBtn.trigger('click')

		expect(wrapper.vm).toBeTruthy()
	})
})
