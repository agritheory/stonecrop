<template>
	<table class="atable">
		<slot name="tableheader">
			<ATableHeader :columns="tableData.columns" :config="tableData.config" :tableid="tableData.id" />
		</slot>
		<tbody>
			<ARow
				v-for="(row, rowIndex) in tableData.rows"
				:key="row.id || v4()"
				:row="row"
				:rowIndex="rowIndex"
				:tableid="tableData.id">
				<ACell
					v-for="(col, colIndex) in tableData.columns"
					:key="colIndex"
					:tableid="tableData.id"
					:col="col"
					tabindex="0"
					spellcheck="false"
					:rowIndex="rowIndex"
					:colIndex="colIndex + (tableData.zeroColumn ? 0 : -1)"
					:style="{
						textAlign: col?.align?.toLowerCase() || 'center',
						minWidth: col?.width || '40ch',
					}" />
			</ARow>
		</tbody>
		<slot name="footer" />
		<ATableModal
			:colIndex="tableData.modal.colIndex"
			:rowIndex="tableData.modal.rowIndex"
			:tableid="tableData.id"
			v-show="tableData.modal.visible"
			:style="{
				left: tableData.modal.left + 'px',
				top: tableData.modal.top + 'px',
				maxWidth: tableData.modal.width + 'px',
			}">
			<component
				:is="tableData.modal.component"
				:colIndex="tableData.modal.colIndex"
				:rowIndex="tableData.modal.rowIndex"
				:tableid="tableData.id" />
		</ATableModal>
	</table>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, nextTick, PropType, provide } from 'vue'

import { TableColumn, TableConfig, TableRow } from 'types'
import TableDataStore from '.'
import ACell from '@/components/ACell.vue'
import ARow from '@/components/ARow.vue'
import ATableHeader from '@/components/ATableHeader.vue'
import ATableModal from '@/components/ATableModal.vue'

export default defineComponent({
	name: 'ATable',
	components: {
		ACell,
		ARow,
		ATableHeader,
		ATableModal,
	},
	props: {
		id: {
			type: String,
		},
		columns: {
			type: Array as PropType<TableColumn[]>,
			required: true,
		},
		rows: {
			type: Array as PropType<TableRow[]>,
			default: () => [],
		},
		config: {
			type: Object as PropType<TableConfig>,
			default: () => new Object(),
		},
		tableid: {
			type: String,
		},
	},
	setup(props) {
		let tableData = new TableDataStore(props.id, props.columns, props.rows, props.config)

		provide(tableData.id, tableData)

		const formatCell = (event?: KeyboardEvent, column?: TableColumn, cellData?: any) => {
			let colIndex: number
			const target = event?.target as HTMLTableCellElement
			if (event) {
				colIndex = target.cellIndex + (tableData.zeroColumn ? -1 : 0)
			} else if (column && cellData) {
				colIndex = tableData.columns.indexOf(column)
			}

			if (!column && 'format' in tableData.columns[colIndex]) {
				// TODO: (utils) create helper to extract format from string
				const format = tableData.columns[colIndex].format
				if (typeof format === 'function') {
					return format(target.innerHTML)
				} else if (typeof format === 'string') {
					// parse format function from string
					// eslint-disable-next-line @typescript-eslint/no-implied-eval
					const formatFn: (args: any) => any = Function(`"use strict";return (${format})`)()
					return formatFn(target.innerHTML)
				} else {
					return target.innerHTML
				}
			} else if (cellData && 'format' in column) {
				const format = column.format
				if (typeof format === 'function') {
					return format(cellData)
				} else if (typeof format === 'string') {
					// parse format function from string
					// eslint-disable-next-line @typescript-eslint/no-implied-eval
					const formatFn: (args: any) => any = Function(`"use strict";return (${format})`)()
					return formatFn(cellData)
				} else {
					return cellData
				}
			} else if (cellData && column.type.toLowerCase() in ['int', 'decimal', 'float', 'number', 'percent']) {
				return cellData
				// TODO: number formatting
			} else {
				return cellData
			}
		}

		const getIndent = (colKey: number, indent: number) => {
			if (indent && colKey === 0 && indent > 0) {
				return `${indent}ch`
			} else {
				return null
			}
		}

		const enterNav = async (event: KeyboardEvent) => {
			event.preventDefault()
			event.stopPropagation()
			event.shiftKey ? await upCell(event) : await downCell(event)
		}

		const tabNav = async (event: KeyboardEvent) => {
			event.preventDefault()
			event.stopPropagation()
			event.shiftKey ? await prevCell(event) : await nextCell(event)
		}

		const downArrowNav = async (event: KeyboardEvent) => {
			if (!event.shiftKey) {
				event.preventDefault()
				event.stopPropagation()
				await downCell(event)
			}
		}

		const upArrowNav = async (event: KeyboardEvent) => {
			if (!event.shiftKey) {
				event.preventDefault()
				event.stopPropagation()
				await upCell(event)
			}
		}

		const leftArrowNav = async (event: KeyboardEvent) => {
			if (!event.shiftKey) {
				event.preventDefault()
				event.stopPropagation()
				await prevCell(event)
			}
		}

		const rightArrowNav = async (event: KeyboardEvent) => {
			if (!event.shiftKey) {
				event.preventDefault()
				event.stopPropagation()
				await nextCell(event)
			}
		}

		const endNav = (event: KeyboardEvent) => {
			const $cell = event.target as HTMLTableCellElement
			const cellIndex = $cell.cellIndex
			const $row = $cell.parentElement as HTMLTableRowElement
			const rowIndex = $row.rowIndex
			const $table = $row.parentElement as HTMLTableElement

			const $lastRow = $table.rows[rowIndex - 1]
			if ($lastRow.cells.length - 1 !== cellIndex) {
				// last column
				const $nextCell = $lastRow.cells[tableData.columns.length - (tableData.zeroColumn ? 0 : 1)] // last cell
				$nextCell.focus()
			}
		}

		const homeNav = (event: KeyboardEvent) => {
			const $cell = event.target as HTMLTableCellElement
			const cellIndex = $cell.cellIndex
			const $row = $cell.parentElement as HTMLTableRowElement
			const rowIndex = $row.rowIndex
			const $table = $row.parentElement as HTMLTableElement

			const $lastRow = $table.rows[rowIndex - 1]
			if (cellIndex !== (tableData.config.numberedRows ? 1 : 0)) {
				// TODO: zeroColumn // first column
				const $nextCell = $lastRow.cells[tableData.zeroColumn ? 1 : 0] // last cell
				$nextCell.focus()
			}
		}

		const downCell = async (event: KeyboardEvent) => {
			const $cell = event.target as HTMLTableCellElement
			const cellIndex = $cell.cellIndex
			const $row = $cell.parentElement as HTMLTableRowElement
			const rowIndex = $row.rowIndex
			const $table = $row.parentElement as HTMLTableElement

			let $nextCell = event.target as HTMLTableCellElement
			if ($table.rows.length !== rowIndex) {
				// not bottom row
				$nextCell = $table.rows[rowIndex].cells[cellIndex]
				if (tableData.config.treeView && !tableData.display[rowIndex].open) {
					// toggleRowExpand(event, rowIndex - 1)
					tableData.toggleRowExpand(rowIndex - 1)
				}
			}

			await nextTick()
			$nextCell.focus()
		}

		const upCell = async (event: KeyboardEvent) => {
			const $cell = event.target as HTMLTableCellElement
			const cellIndex = $cell.cellIndex
			const $row = $cell.parentElement as HTMLTableRowElement
			const rowIndex = $row.rowIndex
			const $table = $row.parentElement as HTMLTableElement

			let $nextCell = event.target as HTMLTableCellElement
			if (rowIndex !== 1) {
				// not top row, exclude headers
				$nextCell = $table.rows[rowIndex - 2].cells[cellIndex]
				if (tableData.config.treeView && !tableData.display[rowIndex - 2].open) {
					tableData.toggleRowExpand(tableData.display[rowIndex - 2].parent)
				}
			}

			await nextTick()
			$nextCell.focus()
		}

		const nextCell = async (event: KeyboardEvent) => {
			const $cell = event.target as HTMLTableCellElement
			const cellIndex = $cell.cellIndex
			const $row = $cell.parentElement as HTMLTableRowElement
			const rowIndex = $row.rowIndex
			const $table = $row.parentElement as HTMLTableElement

			let $nextCell: HTMLTableCellElement
			const $lastRow = $table.rows[rowIndex - 1]
			if ($lastRow.cells.length - 1 === cellIndex) {
				// last column
				if ($table.rows.length === rowIndex) {
					$nextCell = $table.rows[0].cells[tableData.zeroColumn ? 1 : 0] // go to top left cell
					// if row is hidden, expand
				} else {
					// focus on first cell of next row
					$nextCell = $table.rows[rowIndex].cells[tableData.zeroColumn ? 1 : 0]
					if (tableData.config.treeView && !tableData.display[rowIndex].open) {
						tableData.toggleRowExpand(rowIndex - 1)
					}
				}
			} else {
				$nextCell = $lastRow.cells[cellIndex + 1] // next cell
			}

			await nextTick()
			$nextCell.focus()
		}

		const prevCell = async (event: KeyboardEvent) => {
			const $cell = event.target as HTMLTableCellElement
			const cellIndex = $cell.cellIndex
			const $row = $cell.parentElement as HTMLTableRowElement
			const rowIndex = $row.rowIndex
			const $table = $row.parentElement as HTMLTableElement

			let $prevCell: HTMLTableCellElement
			const $lastRow = $table.rows[rowIndex - 1]
			const $secondLastRow = $table.rows[rowIndex - 2]
			if (cellIndex === (tableData.zeroColumn ? 1 : 0)) {
				// first column
				if (rowIndex !== 1) {
					// not top row, exclude headers
					$prevCell = $secondLastRow.cells[$secondLastRow.cells.length - 1]
					// toggleRowExpand(event, rowIndex - 2)
					tableData.toggleRowExpand(rowIndex - 2)
				} else {
					// top row, stay trapped in top left cell
					return
				}
			} else {
				$prevCell = $lastRow.cells[cellIndex - 1] // previous cell
			}

			await nextTick()
			$prevCell.focus()
		}

		const moveCursorToEnd = (target: HTMLElement) => {
			target.focus()
			document.execCommand('selectAll', false, null)
			document.getSelection().collapseToEnd()
		}

		const clickOutside = (event: MouseEvent) => {
			if (!tableData.modal.parent?.contains(event.target as HTMLElement)) {
				if (tableData.modal.visible) {
					// call set data
					tableData.modal.visible = false
				}
			}
		}

		window.addEventListener('click', clickOutside)

		return {
			downArrowNav,
			downCell,
			endNav,
			enterNav,
			formatCell,
			getIndent,
			homeNav,
			leftArrowNav,
			moveCursorToEnd,
			nextCell,
			prevCell,
			rightArrowNav,
			tableData,
			tabNav,
			upArrowNav,
			upCell,
			v4,
		}
	},
})
</script>

<style scoped>
table {
	display: table;
	border-collapse: var(--border-collapsed);
	caret-color: var(--brand-color);
}

th {
	box-sizing: border-box;
	background-color: var(--brand-color);
	border-width: 1px;
	border-style: solid;
	border-color: var(--header-border-color);
	border-radius: 0px;
	color: var(--header-text-color);
}

tr {
	background-color: var(--row-color-zebra-light);
	outline: none;
}

tr:nth-child(even) {
	background-color: var(--row-color-zebra-dark);
}
</style>
