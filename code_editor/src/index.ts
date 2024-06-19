import { App } from 'vue'

import ACodeEditor from '@/components/ACodeEditor.vue'

/**
 * Install all Code Editor components
 * @param app - Vue app instance
 * @public
 */
function install(app: App /* options */) {
	app.component('ACodeEditor', ACodeEditor)
}

export { install, ACodeEditor }
