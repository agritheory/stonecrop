import { App } from 'vue'

import ACodeEditor from '@/components/ACodeEditor.vue'

function install(app: App /* options */) {
	app.component('ACodeEditor', ACodeEditor)
}

export { install, ACodeEditor }
