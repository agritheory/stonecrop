import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { createTableStore } from '../src/stores/table'
import type { TableColumn } from '../src/types'

describe('getFormattedValue badge descriptors', { tags: ['component'] }, () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('returns a BadgeDescriptor when format returns one', () => {
		const columns: TableColumn[] = [
			{
				name: 'status',
				component: 'ADropdown',
				format: () => ({
					label: 'Overdue',
					variant: 'danger' as const,
				}),
			},
		]
		const store = createTableStore({
			columns,
			rows: [{ status: 'Open' }],
		})
		const result = store.getFormattedValue(0, 0, 'Open')
		expect(result).toEqual({ label: 'Overdue', variant: 'danger' })
	})
})
