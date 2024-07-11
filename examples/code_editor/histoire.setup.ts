import { defineSetupVue3 } from '@histoire/plugin-vue'
import { ACodeEditor } from '@stonecrop/code-editor'

export const setupVue3 = defineSetupVue3(({ app }) => {
	app.component('ACodeEditor', ACodeEditor)
})
