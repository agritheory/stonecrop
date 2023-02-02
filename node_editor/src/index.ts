import { App } from 'vue'

import NodeEditor from '@/components/NodeEditor.vue'
import StateEditor from '@/components/StateEditor.vue'

function install(app: App /* options */) {
	app.component('NodeEditor', NodeEditor)
	app.component('StateEditor', StateEditor)
}

export { install, NodeEditor, StateEditor }
