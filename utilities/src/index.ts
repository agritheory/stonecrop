import { App } from 'vue'

import { defaultKeypressHandlers, useKeyboardNav } from './composables/keyboard'
import type { KeypressHandlers } from '../types'

function install(app: App /* options */) {}

export { KeypressHandlers, defaultKeypressHandlers, install, useKeyboardNav }
