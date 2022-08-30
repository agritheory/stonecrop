import { nextTick, onMounted, onUnmounted } from 'vue'

import { KeyboardNavigationOptions } from 'types'

export function useKeyboardNav(options: KeyboardNavigationOptions) {
	onMounted(() => {
		for (const [event, config] of Object.entries(options.handlers)) {
			if (config.default !== true) {
				if (!config.listener) {
					throw new Error(`Missing listener for event: '${event}'`)
				}

				const elements: Element[] = []
				if (Array.isArray(options.elements.value)) {
					for (const element of options.elements.value) {
						if (element instanceof Element) {
							elements.push(element)
						} else {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
							elements.push(element.$el)
						}
					}
				} else {
					elements.push(options.elements.value)
				}

				for (const element of elements) {
					element.addEventListener(event, config.listener, config.options)
				}
			} else {
				// TODO: add default event listeners
			}
		}
	})

	onUnmounted(() => {
		// TODO: copy onMounted logic once it's ready
	})
}

// export function useKeyboardNav(tableData: any) {
// 	const enterNav = async (event: KeyboardEvent) => {
// 		event.preventDefault()
// 		event.stopPropagation()
// 		event.shiftKey ? await upCell(event) : await downCell(event)
// 	}

// 	const tabNav = async (event: KeyboardEvent) => {
// 		event.preventDefault()
// 		event.stopPropagation()
// 		event.shiftKey ? await prevCell(event) : await nextCell(event)
// 	}

// 	const downArrowNav = async (event: KeyboardEvent) => {
// 		if (!event.shiftKey) {
// 			event.preventDefault()
// 			event.stopPropagation()
// 			await downCell(event)
// 		}
// 	}

// 	const upArrowNav = async (event: KeyboardEvent) => {
// 		if (!event.shiftKey) {
// 			event.preventDefault()
// 			event.stopPropagation()
// 			await upCell(event)
// 		}
// 	}

// 	const leftArrowNav = async (event: KeyboardEvent) => {
// 		if (!event.shiftKey) {
// 			event.preventDefault()
// 			event.stopPropagation()
// 			await prevCell(event)
// 		}
// 	}

// 	const rightArrowNav = async (event: KeyboardEvent) => {
// 		if (!event.shiftKey) {
// 			event.preventDefault()
// 			event.stopPropagation()
// 			await nextCell(event)
// 		}
// 	}

// 	const endNav = (event: KeyboardEvent) => {
// 		const $cell = event.target as HTMLTableCellElement
// 		const cellIndex = $cell.cellIndex
// 		const $row = $cell.parentElement as HTMLTableRowElement
// 		const rowIndex = $row.rowIndex
// 		const $table = $row.parentElement as HTMLTableElement

// 		const $lastRow = $table.rows[rowIndex - 1]
// 		if ($lastRow.cells.length - 1 !== cellIndex) {
// 			// last column
// 			const $nextCell = $lastRow.cells[tableData.columns.length - (tableData.zeroColumn ? 0 : 1)] // last cell
// 			$nextCell.focus()
// 		}
// 	}

// 	const homeNav = (event: KeyboardEvent) => {
// 		const $cell = event.target as HTMLTableCellElement
// 		const cellIndex = $cell.cellIndex
// 		const $row = $cell.parentElement as HTMLTableRowElement
// 		const rowIndex = $row.rowIndex
// 		const $table = $row.parentElement as HTMLTableElement

// 		const $lastRow = $table.rows[rowIndex - 1]
// 		if (cellIndex !== (tableData.config.numberedRows ? 1 : 0)) {
// 			// TODO: zeroColumn // first column
// 			const $nextCell = $lastRow.cells[tableData.zeroColumn ? 1 : 0] // last cell
// 			$nextCell.focus()
// 		}
// 	}

// 	const downCell = async (event: KeyboardEvent) => {
// 		const $cell = event.target as HTMLTableCellElement
// 		const cellIndex = $cell.cellIndex
// 		const $row = $cell.parentElement as HTMLTableRowElement
// 		const rowIndex = $row.rowIndex
// 		const $table = $row.parentElement as HTMLTableElement

// 		let $nextCell = event.target as HTMLTableCellElement
// 		if ($table.rows.length !== rowIndex) {
// 			// not bottom row
// 			$nextCell = $table.rows[rowIndex].cells[cellIndex]
// 			if (tableData.config.treeView && !tableData.display[rowIndex].open) {
// 				// toggleRowExpand(event, rowIndex - 1)
// 				tableData.toggleRowExpand(rowIndex - 1)
// 			}
// 		}

// 		await nextTick()
// 		$nextCell.focus()
// 	}

// 	const upCell = async (event: KeyboardEvent) => {
// 		const $cell = event.target as HTMLTableCellElement
// 		const cellIndex = $cell.cellIndex
// 		const $row = $cell.parentElement as HTMLTableRowElement
// 		const rowIndex = $row.rowIndex
// 		const $table = $row.parentElement as HTMLTableElement

// 		let $nextCell = event.target as HTMLTableCellElement
// 		if (rowIndex !== 1) {
// 			// not top row, exclude headers
// 			$nextCell = $table.rows[rowIndex - 2].cells[cellIndex]
// 			if (tableData.config.treeView && !tableData.display[rowIndex - 2].open) {
// 				tableData.toggleRowExpand(tableData.display[rowIndex - 2].parent)
// 			}
// 		}

// 		await nextTick()
// 		$nextCell.focus()
// 	}

// 	const nextCell = async (event: KeyboardEvent) => {
// 		const $cell = event.target as HTMLTableCellElement
// 		const cellIndex = $cell.cellIndex
// 		const $row = $cell.parentElement as HTMLTableRowElement
// 		const rowIndex = $row.rowIndex
// 		const $table = $row.parentElement as HTMLTableElement

// 		let $nextCell: HTMLTableCellElement
// 		const $lastRow = $table.rows[rowIndex - 1]
// 		if ($lastRow.cells.length - 1 === cellIndex) {
// 			// last column
// 			if ($table.rows.length === rowIndex) {
// 				$nextCell = $table.rows[0].cells[tableData.zeroColumn ? 1 : 0] // go to top left cell
// 				// if row is hidden, expand
// 			} else {
// 				// focus on first cell of next row
// 				$nextCell = $table.rows[rowIndex].cells[tableData.zeroColumn ? 1 : 0]
// 				if (tableData.config.treeView && !tableData.display[rowIndex].open) {
// 					tableData.toggleRowExpand(rowIndex - 1)
// 				}
// 			}
// 		} else {
// 			$nextCell = $lastRow.cells[cellIndex + 1] // next cell
// 		}

// 		await nextTick()
// 		$nextCell.focus()
// 	}

// 	const prevCell = async (event: KeyboardEvent) => {
// 		const $cell = event.target as HTMLTableCellElement
// 		const cellIndex = $cell.cellIndex
// 		const $row = $cell.parentElement as HTMLTableRowElement
// 		const rowIndex = $row.rowIndex
// 		const $table = $row.parentElement as HTMLTableElement

// 		let $prevCell: HTMLTableCellElement
// 		const $lastRow = $table.rows[rowIndex - 1]
// 		const $secondLastRow = $table.rows[rowIndex - 2]
// 		if (cellIndex === (tableData.zeroColumn ? 1 : 0)) {
// 			// first column
// 			if (rowIndex !== 1) {
// 				// not top row, exclude headers
// 				$prevCell = $secondLastRow.cells[$secondLastRow.cells.length - 1]
// 				// toggleRowExpand(event, rowIndex - 2)
// 				tableData.toggleRowExpand(rowIndex - 2)
// 			} else {
// 				// top row, stay trapped in top left cell
// 				return
// 			}
// 		} else {
// 			$prevCell = $lastRow.cells[cellIndex - 1] // previous cell
// 		}

// 		await nextTick()
// 		$prevCell.focus()
// 	}

// 	return {
// 		downArrowNav,
// 		downCell,
// 		endNav,
// 		enterNav,
// 		homeNav,
// 		leftArrowNav,
// 		nextCell,
// 		prevCell,
// 		rightArrowNav,
// 		tabNav,
// 		upArrowNav,
// 		upCell,
// 	}
// }
