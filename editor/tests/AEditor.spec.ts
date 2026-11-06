import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { createApp } from 'vue'

import AEditor from '../src/components/AEditor.vue'
import { install } from '../src/index'

type Block = { type: string; data: Record<string, unknown> }
type Config = { holder: HTMLElement; data?: { blocks: Block[] }; onChange: (api: unknown) => Promise<void> }

const { FakeEditor, loadEditor } = vi.hoisted(() => {
	class Fake {
		static instances: Fake[] = []
		blocks: Block[]
		isReady = Promise.resolve()
		destroyed = false
		rendered: unknown[] = []
		constructor(public config: Config) {
			this.blocks = config.data?.blocks ?? []
			Fake.instances.push(this)
		}
		save() {
			return Promise.resolve({ time: Date.now(), blocks: structuredClone(this.blocks), version: 'test' })
		}
		render(data: { blocks: Block[] }) {
			this.rendered.push(data)
			this.blocks = data.blocks
			return Promise.resolve()
		}
		clear() {
			this.blocks = []
		}
		destroy() {
			this.destroyed = true
		}
		/** What Editor.js does on a change: the blocks are already new when onChange fires. */
		change(blocks: Block[]) {
			this.blocks = blocks
			return this.config.onChange({ saver: { save: () => this.save() } })
		}
	}
	return { FakeEditor: Fake, loadEditor: vi.fn(() => Promise.resolve({ EditorJS: Fake, tools: {} })) }
})

vi.mock('../src/utils/load', () => ({ loadEditor }))

const paragraph = (text: string): Block => ({ type: 'paragraph', data: { text } })
const doc = (...blocks: Block[]) => ({ time: 1, blocks, version: '2.31.7' })

const mountEditor = (props: Record<string, unknown>) =>
	mount(AEditor, {
		props: { label: 'Notes', uuid: 'notes', ...props },
		attachTo: document.body,
	})

describe('AEditor', { tags: ['component'] }, () => {
	beforeEach(() => {
		FakeEditor.instances = []
		loadEditor.mockClear()
	})

	it('renders the saved blocks as static HTML outside edit mode, without loading Editor.js', async () => {
		const wrapper = mountEditor({ mode: 'display', modelValue: doc(paragraph('Hello <b>there</b>')) })
		await flushPromises()

		expect(wrapper.find('.a-editor__static').html()).toContain('<p>Hello <b>there</b></p>')
		expect(wrapper.find('.a-editor__holder').exists()).toBe(false)
		expect(loadEditor).not.toHaveBeenCalled()
	})

	it('shows read mode with the field outline', async () => {
		const wrapper = mountEditor({ mode: 'read', modelValue: doc(paragraph('x')) })
		expect(wrapper.find('.a-editor__static').classes()).toContain('aform_input-field')
	})

	it('mounts Editor.js in edit mode, on a copy of the bound value', async () => {
		const value = doc(paragraph('Hi'))
		mountEditor({ mode: 'edit', modelValue: value })
		await flushPromises()

		expect(FakeEditor.instances).toHaveLength(1)
		const { config } = FakeEditor.instances[0]
		expect(config.data).toEqual(value)
		expect(config.data).not.toBe(value)
		expect(config.data?.blocks[0]).not.toBe(value.blocks[0])
	})

	it('emits the object save() returns for each edit, a new one every time', async () => {
		const wrapper = mountEditor({ mode: 'edit', modelValue: null })
		await flushPromises()
		const instance = FakeEditor.instances[0]

		await instance.change([paragraph('a')])
		await wrapper.setProps({ modelValue: wrapper.emitted('update:modelValue')![0][0] })
		await instance.change([paragraph('ab')])

		const emitted = wrapper.emitted('update:modelValue')!.map(([value]) => value)
		expect(emitted).toHaveLength(2)
		expect(emitted[0]).toMatchObject({ blocks: [paragraph('a')] })
		expect(emitted[1]).toMatchObject({ blocks: [paragraph('ab')] })
		expect(emitted[0]).not.toBe(emitted[1])
	})

	it('leaves a field the user has not edited null', async () => {
		const wrapper = mountEditor({ mode: 'edit', modelValue: null })
		await flushPromises()

		// Editor.js reports a change on focus or render too, with the blocks unchanged.
		await FakeEditor.instances[0].change([])
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})

	it('does not render its own emitted value back into the editor', async () => {
		const wrapper = mountEditor({ mode: 'edit', modelValue: null })
		await flushPromises()
		const instance = FakeEditor.instances[0]

		await instance.change([paragraph('typed')])
		await wrapper.setProps({ modelValue: wrapper.emitted('update:modelValue')![0][0] })
		await flushPromises()
		expect(instance.rendered).toEqual([])
	})

	it('renders a value set from outside, such as an undo', async () => {
		const wrapper = mountEditor({ mode: 'edit', modelValue: doc(paragraph('new')) })
		await flushPromises()
		const instance = FakeEditor.instances[0]

		const previous = doc(paragraph('old'))
		await wrapper.setProps({ modelValue: previous })
		await flushPromises()
		expect(instance.rendered).toEqual([previous])
		expect(instance.rendered[0]).not.toBe(previous)

		await wrapper.setProps({ modelValue: null })
		await flushPromises()
		expect(instance.blocks).toEqual([])
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})

	it('mounts the editor when the field turns editable, and tears it down when it stops', async () => {
		const wrapper = mountEditor({ mode: 'display', modelValue: doc(paragraph('x')) })
		await flushPromises()
		expect(FakeEditor.instances).toHaveLength(0)

		await wrapper.setProps({ mode: 'edit' })
		await flushPromises()
		expect(FakeEditor.instances).toHaveLength(1)
		expect(FakeEditor.instances[0].config.holder).toBe(wrapper.find('.a-editor__holder').element)

		await wrapper.setProps({ mode: 'read' })
		await flushPromises()
		expect(FakeEditor.instances[0].destroyed).toBe(true)
		expect(wrapper.find('.a-editor__static').exists()).toBe(true)
	})

	it('tears the editor down on unmount', async () => {
		const wrapper = mountEditor({ mode: 'edit', modelValue: null })
		await flushPromises()
		wrapper.unmount()
		await flushPromises()
		expect(FakeEditor.instances[0].destroyed).toBe(true)
	})

	it('ties its label and errors to the editor', async () => {
		const wrapper = mountEditor({ mode: 'edit', modelValue: null, errors: ['Required'] })
		const holder = wrapper.find('.a-editor__holder')
		expect(holder.attributes('aria-labelledby')).toBe('notes-label')
		expect(holder.attributes('aria-invalid')).toBe('true')
		expect(holder.attributes('aria-describedby')).toBe('notes-error')
		expect(wrapper.find('#notes-error').text()).toBe('Required')
	})
})

describe('install', { tags: ['unit'] }, () => {
	it('registers AEditor', () => {
		const app = createApp({})
		install(app)
		expect(app.component('AEditor')).toBeDefined()
	})
})
