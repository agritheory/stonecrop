import { defineSetupVue3 } from '@histoire/plugin-vue'

import AEditor from '@/components/AEditor.vue'

export const setupVue3 = defineSetupVue3(({ app }) => {
	app.component('AEditor', AEditor)

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	self.MonacoEnvironment = {
		getWorker: function (workerId, label) {
			const getWorkerModule = (moduleUrl, label) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
				return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl, label), {
					name: label,
					type: 'module',
				})
			}

			switch (label) {
				case 'json':
					return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label)
				case 'css':
				case 'scss':
				case 'less':
					return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label)
				case 'html':
				case 'handlebars':
				case 'razor':
					return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label)
				case 'typescript':
				case 'javascript':
					return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label)
				default:
					return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label)
			}
		},
	}
})
