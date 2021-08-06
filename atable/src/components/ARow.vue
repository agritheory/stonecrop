<template>
  <tr
    v-show="!TableData.config.treeView || $parent.rowExpand(rowIndex)"
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
      @click="toggleRowExpand($event, rowIndex)"
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
import { ref, defineComponent, inject } from 'vue'

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
		"isParent": {
			type: Boolean,
			default: false
		},

		"tableid": {
			type: String,
			required: true,
			default: () => {return undefined}
		}
	},
	setup(props, context) {
		let open = ref(false)
		const TableData = inject(props.tableid)
		const getRowExpandSymbol = function(){
			if(this.isParent && !this.open){
				return "+"
			}if(this.isParent && this.open){
				return "-"
			} else {
				return ""
			}
		}
		const toggleRowExpand = function(event, rowIndex){
			if(this.open){
				this.$parent.toggleRowCollapseDeep(event, rowIndex)
			} else {
				this.$parent.toggleRowExpand(event, rowIndex)
			}
			this.open = !this.open
		}
		return {open, TableData, getRowExpandSymbol, toggleRowExpand}
	}
})
</script>