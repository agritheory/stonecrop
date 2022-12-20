import { App } from 'vue'

import AEditor from '@/components/AEditor.vue'

function install(app: App /* options */) {
	app.component('AEditor', AEditor)
}

export { install, AEditor }
