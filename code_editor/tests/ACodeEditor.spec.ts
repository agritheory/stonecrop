import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import ACodeEditor from '../src/components/ACodeEditor.vue'

// vi.mock is hoisted above module-level declarations — vi.hoisted() ensures these
// mocks are defined before the mock factory runs.
//
// NOTE ON SCOPE: these are unit tests against a fully mocked Monaco. They verify the
// contract the component controls — value normalization, language detection, the model's
// file extension (so the TS worker treats it as .ts/.json/.py/.js), and disposal. They
// deliberately do NOT assert the `file://` URI scheme: whether that scheme actually lets
// Monaco's TS worker run getSyntacticDiagnostics without "Could not find source file"
// (see ACodeEditor.vue) is a real-worker behavior a mock cannot prove. Proving it would
// need a browser-mode integration test, which is out of scope for these unit tests.
const { mockEditorInstance, mockModel, mockMonaco, mockLoader } = vi.hoisted(() => {
	const hoistedModel = { dispose: vi.fn() }
	const hoistedEditorInstance = {
		getValue: vi.fn(() => ''),
		setValue: vi.fn(),
		updateOptions: vi.fn(),
		getModel: vi.fn(() => hoistedModel),
		onDidChangeModelContent: vi.fn(_cb => ({ dispose: vi.fn() })),
		dispose: vi.fn(),
	}
	const hoistedMonaco = {
		Uri: { parse: vi.fn((uri: string) => uri) },
		editor: {
			create: vi.fn(() => hoistedEditorInstance),
			createModel: vi.fn(() => hoistedModel),
			defineTheme: vi.fn(),
			setTheme: vi.fn(),
		},
		languages: {
			typescript: {
				javascriptDefaults: {
					addExtraLib: vi.fn(),
					setCompilerOptions: vi.fn(),
				},
			},
		},
	}
	const hoistedLoader = {
		init: vi.fn(() => Promise.resolve(hoistedMonaco)),
		config: vi.fn(),
	}
	return {
		mockEditorInstance: hoistedEditorInstance,
		mockModel: hoistedModel,
		mockMonaco: hoistedMonaco,
		mockLoader: hoistedLoader,
	}
})

vi.mock('@monaco-editor/loader', () => ({ default: mockLoader }))

describe('ACodeEditor', { tag: 'component' }, () => {
	beforeEach(() => {
		vi.clearAllMocks()
		// clearAllMocks clears call history but not return-value overrides individual tests
		// install via mockReturnValue — re-establish the baselines so they don't leak.
		mockEditorInstance.getValue.mockReturnValue('')
		mockEditorInstance.getModel.mockReturnValue(mockModel)
		mockEditorInstance.onDidChangeModelContent.mockImplementation(_cb => ({ dispose: vi.fn() }))
		mockMonaco.editor.create.mockReturnValue(mockEditorInstance)
		mockMonaco.editor.createModel.mockReturnValue(mockModel)
		mockMonaco.Uri.parse.mockImplementation((uri: string) => uri)
		mockLoader.init.mockResolvedValue(mockMonaco)
	})

	it('creates the model with the correct value, language, and file extension', async () => {
		mount(ACodeEditor, {
			props: { modelValue: 'console.log("hello")', schema: { fieldtype: 'Code' } },
		})
		await flushPromises()
		// value + language + the .ts extension live on createModel now; create receives the model.
		expect(mockMonaco.editor.createModel).toHaveBeenCalledWith(
			'console.log("hello")',
			'typescript',
			expect.stringMatching(/\.ts$/)
		)
		expect(mockMonaco.editor.create).toHaveBeenCalledWith(
			expect.any(HTMLElement),
			expect.objectContaining({ model: mockModel })
		)
	})

	it('uses the json language and a .json model for the JSON fieldtype', async () => {
		mount(ACodeEditor, {
			props: { modelValue: '{ "foo": "bar" }', schema: { fieldtype: 'JSON' } },
		})
		await flushPromises()
		expect(mockMonaco.editor.createModel).toHaveBeenCalledWith(
			'{ "foo": "bar" }',
			'json',
			expect.stringMatching(/\.json$/)
		)
	})

	it('uses a .py model extension for python', async () => {
		mount(ACodeEditor, { props: { language: 'python' } })
		await flushPromises()
		expect(mockMonaco.editor.createModel).toHaveBeenCalledWith('', 'python', expect.stringMatching(/\.py$/))
	})

	it('falls back to a .js model extension for other languages', async () => {
		mount(ACodeEditor, { props: { language: 'javascript' } })
		await flushPromises()
		expect(mockMonaco.editor.createModel).toHaveBeenCalledWith('', 'javascript', expect.stringMatching(/\.js$/))
	})

	it('gives each concurrently-mounted editor a distinct model URI', async () => {
		// Regression: the URI counter was declared inside <script setup>, making it per-instance
		// (always 1). Two editors mounted at once both built `file:///stonecrop-editor-1.js`, so the
		// second's createModel threw "Cannot add model because it already exists!" and only one loaded.
		// The counter must be module-scoped so every instance gets a unique URI.
		mount(ACodeEditor, { props: { language: 'javascript' } })
		mount(ACodeEditor, { props: { language: 'javascript' } })
		await flushPromises()
		const uris = mockMonaco.editor.createModel.mock.calls.map(call => call[2])
		expect(uris).toHaveLength(2)
		expect(new Set(uris).size).toBe(2)
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

	it('configures the Monaco loader path when vsPath is provided', async () => {
		mount(ACodeEditor, { props: { vsPath: '/custom/vs' } })
		await flushPromises()
		expect(mockLoader.config).toHaveBeenCalledWith({ paths: { vs: '/custom/vs' } })
	})

	it('registers extra libs and enables JS type-checking when extraLibs is provided', async () => {
		const libs = 'declare const record: Record<string, unknown>'
		mount(ACodeEditor, { props: { extraLibs: libs, language: 'javascript' } })
		await flushPromises()
		const jsDefaults = mockMonaco.languages.typescript.javascriptDefaults
		expect(jsDefaults.addExtraLib).toHaveBeenCalledWith(libs, 'ts:stonecrop.d.ts')
		expect(jsDefaults.setCompilerOptions).toHaveBeenCalledWith(expect.objectContaining({ checkJs: true }))
	})

	it('emits update:modelValue when editor content changes', async () => {
		const wrapper = mount(ACodeEditor, { props: { modelValue: '' } })
		await flushPromises()
		// The callback registered with onDidChangeModelContent is captured in mock.calls[0][0]
		const contentChangeCb = mockEditorInstance.onDidChangeModelContent.mock.calls[0][0] as () => void
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
		const contentChangeCb = mockEditorInstance.onDidChangeModelContent.mock.calls[0][0] as () => void
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

	it('toggles readOnly when the mode prop changes after mount', async () => {
		const wrapper = mount(ACodeEditor, { props: { mode: 'edit' } })
		await flushPromises()
		await wrapper.setProps({ mode: 'read' })
		expect(mockEditorInstance.updateOptions).toHaveBeenCalledWith({ readOnly: true })
	})

	it('disposes the editor and its model on unmount', async () => {
		const wrapper = mount(ACodeEditor)
		await flushPromises()
		wrapper.unmount()
		expect(mockModel.dispose).toHaveBeenCalledOnce()
		expect(mockEditorInstance.dispose).toHaveBeenCalledOnce()
	})
})
