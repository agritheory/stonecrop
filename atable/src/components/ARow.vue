<template>
	<tr v-show="rowVisible()">
		<td v-if="tableData.config.numberedRows" :style="numberedRowStyle">
			{{ rowIndex + 1 }}
		</td>
		<td v-if="tableData.config.treeView" :style="treeRowStyle" @click="toggleRowExpand(rowIndex)">
			{{ getRowExpandSymbol() }}
		</td>
		<slot v-if="!tableData.config.numberedRows && !tableData.config.treeView" name="indexCell" />
		<slot />
	</tr>
</template>

<script lang="ts">
import { CSSProperties, defineComponent, inject } from 'vue'

import TableDataStore from '.'

export default defineComponent({
	name: 'ARow',
	props: {
		row: {
			type: Object,
			required: true,
			default: () => {
				return {}
			},
		},
		rowIndex: {
			type: Number,
			required: true,
			default: 0,
		},
		tableid: {
			type: String,
			required: true,
			default: () => {
				return undefined
			},
		},
	},
	setup(props) {
		const tableData = inject<TableDataStore>(props.tableid)

		const numberedRowStyle: CSSProperties = {
			backgroundColor: 'var(--brand-color)',
			borderColor: 'var(--header-border-color)',
			color: 'var(--header-text-color)',
			fontWeight: 'bold',
			textAlign: 'center',
			userSelect: 'none',
			width: tableData.numberedRowWidth.value,
		}

		const treeRowStyle: CSSProperties = {
			backgroundColor: 'var(--brand-color)',
			borderColor: 'var(--header-border-color)',
			color: 'var(--header-text-color)',
			fontWeight: 'bold',
			textAlign: 'center',
			userSelect: 'none',
			width: '2ch',
		}

		const getRowExpandSymbol = () => {
			if (!tableData.config.treeView) {
				return ''
			}

			if (tableData.display[props.rowIndex].isRoot) {
				if (tableData.display[props.rowIndex].childrenOpen) {
					return '-'
				} else {
					return '+'
				}
			}

			if (tableData.display[props.rowIndex].isParent) {
				if (tableData.display[props.rowIndex].childrenOpen) {
					return '-'
				} else {
					return '+'
				}
			} else {
				return ''
			}
		}

		const rowVisible = () => {
			if (!tableData.config.treeView) {
				return true
			}

			return tableData.display[props.rowIndex].isRoot || tableData.display[props.rowIndex].open
		}

		const toggleRowExpand = (rowIndex: number) => {
			tableData.toggleRowExpand(rowIndex)
		}

		return { getRowExpandSymbol, numberedRowStyle, rowVisible, tableData, toggleRowExpand, treeRowStyle }
	},
})
</script>
