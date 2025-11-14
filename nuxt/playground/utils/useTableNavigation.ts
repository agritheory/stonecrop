import type { Ref } from 'vue'
import type { Router } from 'vue-router'

interface UseTableNavigationOptions<T> {
	data: Ref<T[] | null | undefined>
	router: Router
	basePath: string
	identifierField: string
	idField?: string
}

/**
 * Composable for handling table row click navigation
 * @param data - Reactive array of table data
 * @param router - Vue router instance
 * @param basePath - Base path for navigation (e.g., '/users', '/roles')
 * @param identifierField - Field name to match from first cell (e.g., 'username', 'role_name')
 * @param idField - Field name for the ID (defaults to 'id')
 */
export function useTableNavigation<T extends Record<string, any>>({
	data,
	router,
	basePath,
	identifierField,
	idField = 'id',
}: UseTableNavigationOptions<T>) {
	function handleTableClick(event: MouseEvent) {
		// Find the closest row element
		const target = event.target as HTMLElement
		const row = target.closest('tbody tr')

		if (row && data.value) {
			// Get the first cell to identify the row
			const firstCell = row.querySelector('td')
			if (firstCell) {
				const cellValue = firstCell.textContent?.trim()
				const item = data.value.find((item: T) => item[identifierField] === cellValue)
				if (item) {
					router.push(`${basePath}/${item[idField]}`)
				}
			}
		}
	}

	return {
		handleTableClick,
	}
}
