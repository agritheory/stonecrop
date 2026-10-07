import { componentCategory } from '@stonecrop/schema'

import type { TableModal } from './types'

/** Modal body for table quantity tuple UOM pickers. */
export const TABLE_TUPLE_QUANTITY_PICKER = 'ATableTupleQuantityPicker'

/** Modal body for table currency tuple pickers. */
export const TABLE_TUPLE_CURRENCY_PICKER = 'ATableTupleCurrencyPicker'

export function isTableTuplePickerModal(modal: TableModal): boolean {
	if (!modal.visible) return false
	return modal.component === TABLE_TUPLE_QUANTITY_PICKER || modal.component === TABLE_TUPLE_CURRENCY_PICKER
}

export function tableTuplePickerModalComponent(columnComponent: string | undefined): string {
	return componentCategory(columnComponent) === 'currency' ? TABLE_TUPLE_CURRENCY_PICKER : TABLE_TUPLE_QUANTITY_PICKER
}
