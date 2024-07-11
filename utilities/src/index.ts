import { App } from 'vue'

import { defaultKeypressHandlers, useKeyboardNav } from '@/composables/keyboard'
export type { KeypressHandlers, KeyboardNavigationOptions } from '@/types'

/**
 * Install all utility components
 * @param app - Vue app instance
 * @public
 */
function install(app: App /* options */) {}

export { defaultKeypressHandlers, install, useKeyboardNav }
