import { componentCategory } from '@stonecrop/schema'

import type { TableModal } from './types'

/**
 * Modal body for table quantity tuple UOM pickers.
 * @public
 */
export const TABLE_TUPLE_QUANTITY_PICKER = 'ATableTupleQuantityPicker'

/**
 * Modal body for table currency tuple pickers.
 * @public
 */
export const TABLE_TUPLE_CURRENCY_PICKER = 'ATableTupleCurrencyPicker'

/**
 * Whether the table's open modal is one of the tuple pickers.
 * @public
 */
export function isTableTuplePickerModal(modal: TableModal): boolean {
	if (!modal.visible) return false
	return modal.component === TABLE_TUPLE_QUANTITY_PICKER || modal.component === TABLE_TUPLE_CURRENCY_PICKER
}

/**
 * The tuple picker a column opens: the currency picker for a currency column, the quantity picker
 * for any other.
 * @public
 */
export function tableTuplePickerModalComponent(columnComponent: string | undefined): string {
	return componentCategory(columnComponent) === 'currency' ? TABLE_TUPLE_CURRENCY_PICKER : TABLE_TUPLE_QUANTITY_PICKER
}
