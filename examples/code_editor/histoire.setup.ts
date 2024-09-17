import { defineSetupVue3 } from '@histoire/plugin-vue'
import { install as CodeEditor } from '@stonecrop/code-editor'

export const setupVue3 = defineSetupVue3(({ app }) => {
	app.use(CodeEditor)
})
