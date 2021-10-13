<template>
  <tr
    v-show="rowVisible()"
  >
    <td 
      v-if="TableData.config.numberedRows"
      :style="{
        'width': 'TableData.numberedRowWidth',
        'text-align': 'center',
        'background-color': 'var(--brand-color)',
        'color': 'var(--header-text-color)',
        'font-weight': 'bold',
        'border-color': 'var(--header-border-color)',
        'user-select': 'none'
      }"
    >
      {{ rowIndex + 1 }}
    </td>
    <td
      v-if="TableData.config.treeView"
      :style="{
        'width': '2ch',
        'text-align': 'center',
        'background-color': 'var(--brand-color)',
        'color': 'var(--header-text-color)',
        'font-weight': 'bold',
        'border-color': 'var(--header-border-color)',
        'user-select': 'none'
      }"
      @click="toggleRowExpand(rowIndex)"
    >
      {{ getRowExpandSymbol() }}
    </td>
    <slot
      v-if="!TableData.config.numberedRows && !TableData.config.treeView"
      name="indexCell"
    />
    <slot />
  </tr>
</template>
<script>
import { defineComponent, inject, computed, watch } from 'vue'

export default defineComponent({
	name: "ARow",
	props: {
		"row": {
			type: Object,
			required: true,
			default: () => { return {}}
		},
		"rowIndex": {
			type: Number,
			required: true,
			default: 0
		},
		"tableid": {
			type: String,
			required: true,
			default: () => {return undefined}
		}
	},
	setup(props, context) {
		const TableData = inject(props.tableid)

		function getRowExpandSymbol() {
			if(!TableData.config.treeView){
				return ""
			}


			if(TableData.display[props.rowIndex].isRoot && !TableData.display[props.rowIndex].childrenOpen){
				return "+"
			}
			if(TableData.display[props.rowIndex].isRoot && TableData.display[props.rowIndex].childrenOpen){
				return "-"
			}
			if(TableData.display[props.rowIndex].isParent && !TableData.display[props.rowIndex].childrenOpen){
				return "+"
			} else if(TableData.display[props.rowIndex].isParent && TableData.display[props.rowIndex].childrenOpen){
				return "-"
			} else {
				return ""
			}
		}

		function rowVisible(){
			if(!TableData.config.treeView){
				return true
			}
			if(TableData.display[props.rowIndex].isRoot){
				return true
			} else {
				return TableData.display[props.rowIndex].open
			}
		}

		function toggleRowExpand(rowIndex){
			TableData.toggleRowExpand(rowIndex)
		}

		return { TableData, getRowExpandSymbol, toggleRowExpand, rowVisible }
	}
})
</script>