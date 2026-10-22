import loader from '@monaco-editor/loader'
import { App } from 'vue'

import ACodeEditor from './components/ACodeEditor.vue'

/**
 * Options for {@link install}.
 * @public
 */
export type InstallOptions = {
	/**
	 * Where the app serves Monaco's AMD build (its `min/vs` folder), for every editor that does not set its own
	 * `vsPath`. Without it, Monaco loads from the jsDelivr CDN.
	 */
	vsPath?: string
}

/**
 * Install all Code Editor components
 * @param app - Vue app instance
 * @param options - Where the app serves Monaco from
 * @public
 */
function install(app: App, options: InstallOptions = {}) {
	app.component('ACodeEditor', ACodeEditor)
	if (options.vsPath) loader.config({ paths: { vs: options.vsPath } })
}

export { install, ACodeEditor }
