import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import ACodeEditor from '../src/components/ACodeEditor.vue'

// vi.mock is hoisted above module-level declarations — vi.hoisted() ensures
// mockEditorInstance and mockMonaco are defined before the factory runs.
const { mockEditorInstance, mockMonaco } = vi.hoisted(() => {
	const mockEditorInstance = {
		getValue: vi.fn(() => ''),
		setValue: vi.fn(),
		updateOptions: vi.fn(),
		onDidChangeModelContent: vi.fn(_cb => ({ dispose: vi.fn() })),
		dispose: vi.fn(),
	}
	const mockMonaco = {
		editor: {
			create: vi.fn(() => mockEditorInstance),
			defineTheme: vi.fn(),
			setTheme: vi.fn(),
		},
	}
	return { mockEditorInstance, mockMonaco }
})

vi.mock('@monaco-editor/loader', () => ({
	default: { init: vi.fn(() => Promise.resolve(mockMonaco)) },
}))

describe('ACodeEditor', { tag: 'component' }, () => {
	beforeEach(() => {
		vi.clearAllMocks()
		// Re-establish return values that individual tests may have overridden via mockReturnValue
		// (clearAllMocks clears call history but not mockReturnValue overrides)
		mockEditorInstance.getValue.mockReturnValue('')
		mockEditorInstance.onDidChangeModelContent.mockImplementation(_cb => ({ dispose: vi.fn() }))
		mockMonaco.editor.create.mockReturnValue(mockEditorInstance)
	})

	it('initializes the editor with the correct value and language', async () => {
		mount(ACodeEditor, {
			props: { modelValue: 'console.log("hello")', schema: { fieldtype: 'Code' } },
		})
		await flushPromises()
		expect(mockMonaco.editor.create).toHaveBeenCalledWith(
			expect.any(HTMLElement),
			expect.objectContaining({ value: 'console.log("hello")', language: 'typescript' })
		)
	})

	it('coerces an object modelValue to formatted JSON on init', async () => {
		mount(ACodeEditor, {
			props: {
				modelValue: { foo: 'bar' } as unknown as string,
				schema: { fieldtype: 'JSON' },
			},
		})
		await flushPromises()
		expect(mockMonaco.editor.create).toHaveBeenCalledWith(
			expect.any(HTMLElement),
			expect.objectContaining({ value: '{\n  "foo": "bar"\n}', language: 'json' })
		)
	})

	it('defines and applies the theme before creating the editor', async () => {
		mount(ACodeEditor)
		await flushPromises()
		expect(mockMonaco.editor.defineTheme).toHaveBeenCalledWith('agritheory', expect.any(Object))
		expect(mockMonaco.editor.setTheme).toHaveBeenCalledWith('agritheory')
		expect(mockMonaco.editor.create).toHaveBeenCalled()
		const defineOrder = mockMonaco.editor.defineTheme.mock.invocationCallOrder[0]
		const setOrder = mockMonaco.editor.setTheme.mock.invocationCallOrder[0]
		const createOrder = mockMonaco.editor.create.mock.invocationCallOrder[0]
		expect(defineOrder).toBeLessThan(createOrder)
		expect(setOrder).toBeLessThan(createOrder)
	})

	it('emits update:modelValue when editor content changes', async () => {
		const wrapper = mount(ACodeEditor, { props: { modelValue: '' } })
		await flushPromises()
		// The callback registered with onDidChangeModelContent is captured in mock.calls[0][0]
		const [contentChangeCb] = mockEditorInstance.onDidChangeModelContent.mock.calls[0]
		mockEditorInstance.getValue.mockReturnValue('new content')
		contentChangeCb()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new content'])
	})

	it('calls setValue when modelValue changes externally', async () => {
		const wrapper = mount(ACodeEditor, { props: { modelValue: 'initial' } })
		await flushPromises()
		mockEditorInstance.getValue.mockReturnValue('initial')
		await wrapper.setProps({ modelValue: 'externally updated' })
		expect(mockEditorInstance.setValue).toHaveBeenCalledWith('externally updated')
	})

	it('does not call setValue when the change originates from the editor itself', async () => {
		const wrapper = mount(ACodeEditor, { props: { modelValue: 'initial' } })
		await flushPromises()
		// Clear the post-init sync call (getValue returns '' so setValue('initial') was already called once)
		mockEditorInstance.setValue.mockClear()
		const [contentChangeCb] = mockEditorInstance.onDidChangeModelContent.mock.calls[0]
		// Simulate user typing — editor value is now 'user typed this'
		mockEditorInstance.getValue.mockReturnValue('user typed this')
		contentChangeCb()
		// Parent echoes the same value back via v-model; the guard should prevent a setValue loop
		await wrapper.setProps({ modelValue: 'user typed this' })
		expect(mockEditorInstance.setValue).not.toHaveBeenCalled()
	})

	it('sets readOnly: true when mode is read', async () => {
		mount(ACodeEditor, { props: { mode: 'read' } })
		await flushPromises()
		expect(mockMonaco.editor.create).toHaveBeenCalledWith(
			expect.any(HTMLElement),
			expect.objectContaining({ readOnly: true })
		)
	})

	it('sets readOnly: true when mode is display', async () => {
		mount(ACodeEditor, { props: { mode: 'display' } })
		await flushPromises()
		expect(mockMonaco.editor.create).toHaveBeenCalledWith(
			expect.any(HTMLElement),
			expect.objectContaining({ readOnly: true })
		)
	})

	it('disposes the editor instance on unmount', async () => {
		const wrapper = mount(ACodeEditor)
		await flushPromises()
		wrapper.unmount()
		expect(mockEditorInstance.dispose).toHaveBeenCalledOnce()
	})
})
