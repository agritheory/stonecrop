import { App } from 'vue'

import { defaultKeypressHandlers, useKeyboardNav } from './composables/keyboard'
export { useArithmeticInput, type ArithmeticInputOptions } from './composables/arithmeticInput'
import { fromISODate } from './dates'
import { compareSemver, isSemver, isSemverPrefix } from './semver'
export type * from './types'

/**
 * Install all utility components
 * @param _app - Vue app instance
 * @public
 */
function install(_app: App /* options */) {}

export {
	arithmeticEntryPattern,
	evaluateArithmetic,
	isArithmeticKey,
	roundToPrecision,
	type NumberSeparators,
} from './arithmetic'
export {
	currencyAmountEntryPattern,
	currencyAmountSeparators,
	currencyInputFractionDigits,
	formatCurrencyAmountInput,
	parseCurrencyAmountInput,
} from './currencyAmountFormat'
export { formatCurrencyAmount, formatCurrencyCell, formatCurrencySymbol, formatQuantityCell } from './denominatedFormat'
export { compareSemver, defaultKeypressHandlers, fromISODate, install, isSemver, isSemverPrefix, useKeyboardNav }
