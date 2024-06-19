import { App } from 'vue'

import NodeEditor from '@/components/NodeEditor.vue'
import StateEditor from '@/components/StateEditor.vue'
export type { EditorStates, FlowElement, FlowElements, Layout } from '@/types/index'

/**
 * Install all Node Editor components
 * @param app - Vue app instance
 * @public
 */
function install(app: App) {
	app.component('NodeEditor', NodeEditor)
	app.component('StateEditor', StateEditor)
}

export { install, NodeEditor, StateEditor }
