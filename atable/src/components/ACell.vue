<template>
	<td
		ref="colIndex + ':' + rowIndex"
		:contenteditable="tableData.columns[colIndex].edit"
		:tabindex="0"
		:spellcheck="false"
		:style="cellStyle"
		@focus="onFocus($event)"
		@paste="onChange($event)"
		@blur="onChange($event)"
		@input="onChange($event)"
		@keydown.enter="$parent.$parent.enterNav"
		@keydown.tab="$parent.$parent.tabNav"
		@keydown.end="$parent.$parent.endNav"
		@keydown.home="$parent.$parent.homeNav"
		@keydown.down="$parent.$parent.downArrowNav"
		@keydown.up="$parent.$parent.upArrowNav"
		@keydown.left="$parent.$parent.leftArrowNav"
		@keydown.right="$parent.$parent.rightArrowNav"
		@click="handleInput"
		v-html="displayValue" />
</template>

<script lang="ts">
import { computed, CSSProperties, defineComponent, inject, ref, resolveDynamicComponent } from 'vue'
import TableDataStore from '.'

export default defineComponent({
	name: 'ACell',
	props: {
		colIndex: {
			type: Number,
			required: true,
		},
		rowIndex: {
			type: Number,
			required: true,
		},
		tableid: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		const tableData = inject<TableDataStore>(props.tableid)

		let cellModified = ref(false)

		const displayValue = computed(() => {
			const data = tableData.cellData(props.colIndex, props.rowIndex)
			if (tableData.columns[props.colIndex].format) {
				return tableData.columns[props.colIndex].format(data)
			} else {
				return data
			}
		})

		const handleInput = (event: MouseEvent) => {
			if (tableData.columns[props.colIndex].mask) {
				// tableData.columns[props.colIndex].mask(event)
			}

			if (tableData.columns[props.colIndex].component) {
				if (resolveDynamicComponent(tableData.columns[props.colIndex].component)) {
					const target = event.target as HTMLElement
					const domRect = target.getBoundingClientRect()
					tableData.modal.visible = true
					tableData.modal.colIndex = props.colIndex
					tableData.modal.rowIndex = props.rowIndex
					tableData.modal.parent = target
					tableData.modal.top = domRect.top + domRect.height
					tableData.modal.left = domRect.left
					tableData.modal.width = cellWidth.value
					tableData.modal.component = tableData.columns[props.colIndex].component
				}
			}

			return event
		}

		const updateData = (event: Event) => {
			if (event) {
				// custom components need to handle their own updateData, this is the default
				if (!tableData.columns[props.colIndex].component) {
					const target = event.target as HTMLElement
					tableData.setCellData(props.rowIndex, props.colIndex, target.innerHTML)
				}
				cellModified.value = true
			}
		}

		const textAlign = computed(() => {
			return tableData.columns[props.colIndex].align || 'center'
		})

		const cellWidth = computed(() => {
			return tableData.columns[props.colIndex].width || '40ch'
		})

		let currentData = ''
		const onFocus = (event: FocusEvent) => {
			const target = event.target as HTMLElement
			currentData = target.innerText
		}

		const onChange = (event: ClipboardEvent | FocusEvent | Event) => {
			const target = event.target as HTMLElement
			if (target.innerHTML !== currentData) {
				currentData = target.innerText
				target.dispatchEvent(new Event('change'))
				cellModified.value = true // set display instead
			}
		}

		const getIndent = (colKey: number, indent: number) => {
			if (indent && colKey === 0 && indent > 0) {
				return indent * 1 + 'ch'
			} else {
				return 'inherit'
			}
		}

		const cellStyle: CSSProperties = {
			textAlign: textAlign.value,
			width: cellWidth.value,
			backgroundColor: !cellModified.value ? 'inherit' : 'var(--cell-modified-color)',
			fontWeight: !cellModified.value ? 'inherit' : 'bold',
			paddingLeft: getIndent(props.colIndex, tableData.display[props.rowIndex]?.indent),
		}

		return {
			cellModified,
			cellStyle,
			cellWidth,
			displayValue,
			getIndent,
			handleInput,
			onChange,
			onFocus,
			tableData,
			textAlign,
			updateData,
		}
	},
})
</script>

<style scoped>
td {
	border: 1px;
	border-style: solid;
	border-color: var(--cell-border-color);
	border-radius: 0px;
	box-sizing: border-box;
	margin: 0px;
	outline: none;
	box-shadow: none;
	color: var(--cell-text-color);
	text-overflow: ellipsis;
	overflow: hidden;
	padding-left: 0.5ch;
	padding-right: 0.5ch;
}

td:focus,
td:focus-within {
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
