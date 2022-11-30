// export install() that is plugin compatible

import NodeEditor from './components/NodeEditor.vue'

function install(app, options) {
	app.component('NodeEditor', NodeEditor)
}

export default {
	install,
}
