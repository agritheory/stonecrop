<template>
	<thead v-if="columns.length">
		<tr tabindex="-1">
			<th v-if="tableData.zeroColumn" :style="{ minWidth: tableData.numberedRowWidth.value }" />
			<th
				v-for="(column, colKey) in columns"
				:key="colKey"
				tabindex="-1"
				:style="{
					textAlign: column.align?.toLowerCase() || 'center',
					minWidth: column.width || '40ch',
				}">
				<slot>{{ column.label || String.fromCharCode(colKey + 97).toUpperCase() }}</slot>
			</th>
		</tr>
	</thead>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from 'vue'

import { TableColumn, TableConfig } from 'types'
import TableDataStore from '.'

export default defineComponent({
	name: 'ATableHeader',
	props: {
		columns: {
			type: Array as PropType<TableColumn[]>,
			required: true,
		},
		config: {
			type: Object as PropType<TableConfig>,
			default: {},
		},
		tableid: {
			type: String,
		},
	},
	setup(props) {
		const tableData = inject<TableDataStore>(props.tableid)
		return { tableData }
	},
})
</script>

<style scoped>
th {
	background-color: var(--brand-color);
	border-width: 0px;
	border-style: solid;
	border-color: var(--header-border-color);
	border-radius: 0px;
	color: var(--header-text-color);
	padding-left: 0.5ch;
	padding-right: 0.5ch;
}
th:focus {
	outline: none;
}
</style>
