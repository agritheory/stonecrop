import { componentCategory, type ComponentCategory } from '@stonecrop/schema'

import type { TableColumn } from './types'

/** Filter widget type derived from a component's semantic category. */
export type ResolvedFilterType = 'text' | 'select' | 'number' | 'date' | 'dateRange' | 'checkbox' | 'component'

const CATEGORY_FILTER: Record<ComponentCategory, Exclude<ResolvedFilterType, 'component'>> = {
	text: 'text',
	number: 'number',
	boolean: 'checkbox',
	date: 'date',
	datetime: 'dateRange',
	select: 'select',
	code: 'text',
	link: 'text',
	attach: 'text',
	quantity: 'number',
	currency: 'number',
}

/**
 * Resolve the filter widget and filter logic type for a column.
 * Explicit `filterType` wins; otherwise derive from the component category.
 * @public
 */
export function resolveFilterType(column: Pick<TableColumn, 'filterType' | 'component'>): ResolvedFilterType {
	if (column.filterType) return column.filterType
	const category = componentCategory(column.component)
	if (category) return CATEGORY_FILTER[category]
	return 'text'
}
