import { App } from 'vue'

import { defaultKeypressHandlers, useKeyboardNav } from './composables/keyboard'
import { fromISODate } from './dates'
export type * from './types'

/**
 * Install all utility components
 * @param _app - Vue app instance
 * @public
 */
function install(_app: App /* options */) {}

export {
	currencyAmountEntryPattern,
	currencyInputFractionDigits,
	currencyInputLocale,
	formatCurrencyAmountInput,
	parseCurrencyAmountInput,
} from './currencyAmountFormat'
export { formatCurrencyAmount, formatCurrencyCell, formatQuantityCell } from './denominatedFormat'
export { defaultKeypressHandlers, fromISODate, install, useKeyboardNav }
