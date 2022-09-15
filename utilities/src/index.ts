import { App } from 'vue'

import { defaultKeypressHandlers, useKeyboardNav } from './composables/keyboard'

function install(app: App /* options */) {}

export { defaultKeypressHandlers, install, useKeyboardNav }
