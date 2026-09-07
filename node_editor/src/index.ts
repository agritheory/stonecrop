import { App } from 'vue'

import NodeEditor from './components/NodeEditor.vue'
import StateEditor from './components/StateEditor.vue'
export type * from './types'

// `Layout` types its handle placement as this enum, so a consumer cannot fill that field without
// naming it. It is an enum rather than a string union, which makes the obvious `'left'` a type
// error, and @vue-flow/core is a transitive dependency a consumer should not have to add.
export { Position } from '@vue-flow/core'

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
