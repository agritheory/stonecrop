import { App } from 'vue'

import AEditor from './components/AEditor.vue'
import { renderBlocks } from './utils/render'
export type * from './types'

/**
 * Install all Editor components
 * @param app - Vue app instance
 * @public
 */
function install(app: App) {
	app.component('AEditor', AEditor)
}

export { install, AEditor, renderBlocks }
