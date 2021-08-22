<template>
  <table class="atable">
    <slot name="tableheader">
      <ATableHeader
        :columns="TableData.columns"
        :config="TableData.config"
        :tableid="TableData.id"
      />
    </slot>
    <tbody>
      <ARow
        v-for="(row, rowIndex) in TableData.rows" 
        :key="row.id"
        :row="row"
        :row-index="rowIndex"
        :is-parent="TableData.config.treeView === true ? displayRows[rowIndex].isParent : null"
        :is-open="TableData.config.treeView === true ? displayRows[rowIndex].open : null"
        :tableid="TableData.id"
      >
        <ACell
          v-for="(col, colIndex) in TableData.columns"
          :key="colIndex"
          :tableid="TableData.id"
          :col="col"
          tabindex="0"
          spellcheck="false"
          :row-index="rowIndex"
          :col-index="colIndex + Number(TableData.zeroColumn === true ? 0 : -1)"
          :style="{
            'text-align': col.align !== undefined ? col.align.toLowerCase() : 'center',
            'min-width': col.width !== undefined ? col.width : '40ch',
            'padding-left': getIndent(colIndex, TableData.rows[rowIndex].indent)
          }"
        />
      </ARow>
    </tbody>
    <slot name="footer" />
		<ATableModal
			:colIndex="TableData.modal.colIndex"
			:rowIndex="TableData.modal.rowIndex"
			:event="TableData.modal.event"
			:tableid="TableData.id"
			style="{border: 1px solid var(--brand-color);}"
		>
			<component
				:is="TableData.modal.component"	
				:colIndex="TableData.modal.colIndex"
				:rowIndex="TableData.modal.rowIndex"
				:event="TableData.modal.event"
				:tableid="TableData.id"
			/>
		</ATableModal>
  </table>
</template>
<script>
import { defineComponent, ref, provide, nextTick } from 'vue'

import TableDataStore from './index.js'
import ARow from "./ARow.vue"
import ACell from "./ACell.vue"
import ATableHeader from "./ATableHeader.vue"

export default defineComponent({
	name: "ATable",
	components: {
		ARow, ATableHeader, ACell
	},
	props: {
		"columns": {
			type: Array,
			required: true,
		},
		"rows": {
			type: Array,
			required: false,
			default: () => {return []}
		},
		"config": {
			type: Object,
			default: () => {return {}}
		},
		"tableid": {
			type: String,
			default: () => {return undefined}
		}
	},
	setup(props, context) {
		let displayRows = ref([])
		let TableData = new TableDataStore(props.id, props.columns, props.rows, props.config)
		if(TableData.config.treeView === true){
			TableData.rows.forEach((row, index) => {
				displayRows.push({
					open: false,
					isParent: false,
					isRoot: row.parent === null || row.parent === undefined
				})
				if(row.parent !== null && row.parent !== undefined){
					displayRows[row.parent].isParent = true
				}
			})
		}

		provide(TableData.id, TableData)
		// const TableData = inject(props.tableid)

		const formatCell = function(event = undefined, column = undefined, cellData = undefined){
			let colIndex = undefined
			if(event){
				colIndex = event.target.cellIndex + (TableData.zeroColumn === true ? -1 : 0)
			} else if (column && cellData) { 
				colIndex = TableData.columns.indexOf(column)
			}
			if(!column && 'format' in TableData.columns[colIndex]){
				event.target.innerHTML = TableData.columns[colIndex].format(event.target.innerHTML)
			} else if (cellData && 'format' in column){
				return column.format(cellData)
			} else if (cellData && column.type.toLowerCase() in ['int', 'decimal', 'float', 'number', 'percent']){
				return cellData
				// TODO: number formatting 
			} else {
				return cellData
			}
		}

		const getIndent = function(colKey, indent){
			if(indent && colKey === 0 && indent > 0){ 
				return (indent * 1) + 'ch'
			} else {
				return 'inherit'
			}
		}

		const toggleRowExpandDeep = function(event, rowIndex){
			toggleRowExpand(event, rowIndex)
		}

		const toggleRowCollapseDeep = function(event, rowIndex){
			if(!TableData.config.treeView) { return }
			TableData.rows.forEach((row, index) => {
				if(row.parent === rowIndex){
					if(displayRows[index].isParent){
						toggleRowCollapseDeep(event, index)
					}
					displayRows[index].open = false
				}
			})
		}
		
		const toggleRowExpand = function(event, rowIndex){
			TableData.rows.forEach((row, index) => {
				if(row.parent === rowIndex){
					displayRows[index].open = !displayRows[index].open
				}
			})
		}

		const rowExpand = function(rowIndex){
			return displayRows[rowIndex].isRoot || displayRows[rowIndex].open
		}

		function enterNav(event){
			event.preventDefault()
			event.stopPropagation()
			if (event.shiftKey === true) {
				upCell(event)
			} else { downCell(event) }
		}

		function tabNav(event){
			event.preventDefault()
			event.stopPropagation()
			if (event.shiftKey === true) {
				prevCell(event)
			} else { nextCell(event) }
		}

		function downArrowNav(event){
			if (event.shiftKey !== true) {
				event.preventDefault()
				event.stopPropagation()
				downCell(event)
			}
		}

		function upArrowNav(event){
			if (event.shiftKey !== true) {
				event.preventDefault()
				event.stopPropagation()
				upCell(event)
			}
		}

		function leftArrowNav(event){
			if (event.shiftKey !== true) {
				event.preventDefault()
				event.stopPropagation()
				prevCell(event)
			}
		}

		function rightArrowNav(event){
			if (event.shiftKey !== true) {
				event.preventDefault()
				event.stopPropagation()
				nextCell(event)
			}
		}

		function endNav(event){
			let nextCellEl = undefined
			const cellIndex = event.target.cellIndex
			const rowIndex = event.target.parentElement.rowIndex
			const tableEl = event.target.parentElement.parentElement
			if (tableEl.rows[rowIndex - 1].cells.length - 1 === cellIndex) { // last column
				return
			} else {
				nextCellEl = tableEl.rows[rowIndex - 1].cells[TableData.columns.length - (TableData.zeroColumn === true ? 0 : 1)] // last cell
			}
			nextCellEl.focus()
		}

		function homeNav(event){
			let nextCellEl = undefined
			const cellIndex = event.target.cellIndex
			const rowIndex = event.target.parentElement.rowIndex
			const tableEl = event.target.parentElement.parentElement
			if (cellIndex === (TableData.config.numberedRows === true ? 1 : 0)) { // TODO: zeroColumn // first column
				return
			} else {
				nextCellEl = tableEl.rows[rowIndex - 1].cells[TableData.zeroColumn === true ? 1 : 0] // last cell
			}
			nextCellEl.focus()
		}

		function downCell(event){
			const cellIndex = event.target.cellIndex
			const rowIndex = event.target.parentElement.rowIndex
			const tableEl = event.target.parentElement.parentElement
			let cell = undefined
			if (tableEl.rows.length !== rowIndex) { // not bottom row
				cell = tableEl.rows[rowIndex].cells[cellIndex]
				if (TableData.config.treeView === true && displayRows[rowIndex].open === false) {
					toggleRowExpand(event, rowIndex - 1)
				}
			} else {
				cell = event.target
			}
			nextTick(function () {
				cell.focus()
			})
		}

		function upCell(event){
			const cellIndex = event.target.cellIndex
			const rowIndex = event.target.parentElement.rowIndex
			const table = event.target.parentElement.parentElement
			let cell = undefined
			if (rowIndex !== 1) { // not top row, exclude headers
				cell = table.rows[rowIndex - 2].cells[cellIndex]
				if (TableData.config.treeView === true && displayRows[rowIndex - 2].open === false) {
					toggleRowExpand(event, TableData.rows[rowIndex - 2].parent)
				}
			} else {
				cell = event.target
			}
			nextTick(function () {
				cell.focus()
			})
		}

		function nextCell(event){
			let nextCellEl = undefined
			const cellIndex = event.target.cellIndex
			const rowIndex = event.target.parentElement.rowIndex
			const tableEl = event.target.parentElement.parentElement
			if (tableEl.rows[rowIndex - 1].cells.length - 1 === cellIndex) { // last column
				if (tableEl.rows.length === rowIndex) {
					nextCellEl = tableEl.rows[0].cells[TableData.zeroColumn === true ? 1 : 0] // go to top left cell
					// if row is hidden, expand
				} else {  // focus on first cell of next row
					nextCellEl = tableEl.rows[rowIndex].cells[TableData.zeroColumn === true ? 1 : 0]
					if (TableData.config.treeView === true && displayRows[rowIndex].open === false) {
						toggleRowExpand(event, rowIndex - 1)
					}
				}
			} else {
				nextCellEl = tableEl.rows[rowIndex - 1].cells[cellIndex + 1] // next cell
			}
			nextTick(function () {
				nextCellEl.focus()
			})
		}

		function prevCell(event){
			let prevCellEl = undefined
			const cellIndex = event.target.cellIndex
			const rowIndex = event.target.parentElement.rowIndex
			const tableEl = event.target.parentElement.parentElement
			if (cellIndex === (TableData.zeroColumn === true ? 1 : 0)) { // first column
				if (rowIndex !== 1) { // not top row, exclude headers
					prevCellEl = tableEl.rows[rowIndex - 2].cells[tableEl.rows[rowIndex - 2].cells.length - 1]
					toggleRowExpand(event, rowIndex - 2)
				} else { // top row, stay trapped in top left cell
					return
				}
			} else {
				prevCellEl = tableEl.rows[rowIndex - 1].cells[cellIndex - 1] // previous cell
			}
			prevCellEl.focus()
		}

		function moveCursorToEnd(target) {
			target.focus()
			document.execCommand('selectAll', false, null)
			document.getSelection().collapseToEnd()
		}

		var modal = ref({
			event: undefined,
			colIndex: undefined,
			rowIndex: undefined,
			component: '',
			tableid: TableData.id
		})

		function showModal(component, event, colIndex, rowIndex, tableid){
			modal.event = event
			modal.colIndex = colIndex
			modal.rowIndex = rowIndex
			modal.tableid = tableid
			modal.component = component
		}


		return {
			TableData,
			displayRows,
			// handleInput,
			formatCell,
			getIndent,
			rowExpand,
			toggleRowExpand,
			toggleRowExpandDeep,
			toggleRowCollapseDeep,
			enterNav,
			tabNav,
			downArrowNav,
			upArrowNav,
			leftArrowNav,
			rightArrowNav,
			homeNav,
			endNav,
			prevCell,
			nextCell,
			upCell,
			downCell,
			moveCursorToEnd,
			modal
			// updateData,
		}
	}
})

</script>
<style scoped>
table {
  display: table;
  border-collapse: var(--border-collapsed);
}
th {
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
td {
  border: 1px;
  border-style: solid;
  border-color: var(--cell-border-color);
  border-radius: 0px;
  margin: 0px;
  outline: none;
  box-shadow: none;
  color: var(--cell-text-color);
  text-overflow: ellipsis;
  overflow: hidden;
}
th:focus{
  outline: none;
}
td:focus, td:focus-within {
  background-color: var(--focus-cell-background);
  outline-width: 2px;
  outline-style: solid; 
  outline-color: var(--focus-cell-outline);
  box-shadow: none;
  overflow: hidden;
  min-height: 1.15em;
  max-height: 1.15em;
  overflow: hidden;
}
</style>