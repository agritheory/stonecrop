<template>
  <thead v-if="columns.length">
	<tr tabindex="-1">
	  <th
		v-if="TableData.zeroColumn"
		:style="{'min-width': TableData.numberedRowWidth}"
	  />
	  <th
		v-for="(column, colKey) in columns"
		:key="colKey"
		tabindex="-1"
		:style="{
		  'text-align': column.align !== undefined ? column.align.toLowerCase() : 'center',
		  'min-width': column.width !== undefined ? column.width : '40ch',
		}"
	  >
		<slot>{{ column.label !== undefined ? column.label : String.fromCharCode(colKey + 97).toUpperCase() }}</slot>
	  </th>
	</tr>
  </thead>
</template>
<script>
import { defineComponent, inject } from 'vue'

export default defineComponent({
	name: "ATableHeader",
	props: {
		"columns": {
			type: Array,
			required: true,
		},
		"config": {
			type: Object,
			default: () => {return {}}
		},
		"tableid": {
			type: String,
			required: true,
			default: () => {return undefined}
		}
	},
	setup(props, context) {
		const TableData = inject(props.tableid)
		return { TableData }
	}
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
th:focus{
	outline: none;
}
</style>