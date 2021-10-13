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
        :key="row.id || v4()"
        :row="row"
        :rowIndex="rowIndex"
        :tableid="TableData.id"
      >
        <ACell
          v-for="(col, colIndex) in TableData.columns"
          :key="colIndex"
          :tableid="TableData.id"
          :col="col"
          tabindex="0"
          spellcheck="false"
          :rowIndex="rowIndex"
          :colIndex="colIndex + Number(TableData.zeroColumn === true ? 0 : -1)"
          :style="{
            'text-align': col.align !== undefined ? col.align.toLowerCase() : 'center',
            'min-width': col.width !== undefined ? col.width : '40ch',
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
import { v4 } from "uuid"
import { defineComponent, ref, provide, nextTick } from 'vue'

import TableDataStore from './index.js'
import ARow from "./ARow.vue"
import ACell from "./ACell.vue"
import ATableHeader from "./ATableHeader.vue"
import ATableModal from "./ATableModal.vue"

export default defineComponent({
	name: "ATable",
	components: {
		ATableModal, ARow, ATableHeader, ACell
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
		let TableData = new TableDataStore(props.id, props.columns, props.rows, props.config)
		
		provide(TableData.id, TableData)

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
				return null
			}
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
				if (TableData.config.treeView === true && TableData.display[rowIndex].open === false) {
					// toggleRowExpand(event, rowIndex - 1)
					TableData.toggleRowExpand(rowIndex - 1)
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
				if (TableData.config.treeView === true && TableData.display[rowIndex - 2].open === false) {
					TableData.toggleRowExpand(TableData.display[rowIndex - 2].parent)
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
					if (TableData.config.treeView === true && TableData.display[rowIndex].open === false) {
						TableData.toggleRowExpand(rowIndex - 1)
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
					// toggleRowExpand(event, rowIndex - 2)
					TableData.toggleRowExpand(rowIndex - 2)
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
			v4,
			formatCell,
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
		}
	}
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