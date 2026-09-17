import { App } from 'vue'

import { defaultKeypressHandlers, useKeyboardNav } from './composables/keyboard'
import { fromISODate, toISODate } from './dates'
export type * from './types'

/**
 * Install all utility components
 * @param _app - Vue app instance
 * @public
 */
function install(_app: App /* options */) {}

export { defaultKeypressHandlers, fromISODate, install, toISODate, useKeyboardNav }
