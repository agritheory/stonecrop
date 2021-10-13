<template>
  <td
		ref="colIndex + ':' + rowIndex"
    :contenteditable="TableData.columns[colIndex].edit === true ? true : false"
    :tabindex="0"
    :spellcheck="false"
    :style="{
      'text-align': textAlign,
      'width': cellWidth,
			'background-color': cellModified === false ? 'inherit' : 'var(--cell-modified-color)',
			'font-weight': cellModified === false ? 'inherit' : 'bold',
			'padding-left': getIndent(colIndex, TableData.display[rowIndex]?.indent),
    }"
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
    v-html="displayValue"
  />
</template>
<script>
import {ref, defineComponent, inject, computed, watch, resolveDynamicComponent } from 'vue'

export default defineComponent({
	name: "ACell",
	props: {
		"colIndex": {
			type: Number,
			required: true,
			default: 0
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
		
		let cellModified = ref(false)

		const displayValue = computed(() => { 
			if(TableData.columns[props.colIndex].format !== undefined){
				return TableData.columns[props.colIndex].format(TableData.cellData(props.rowIndex, props.colIndex))
			} else {
				return TableData.cellData(props.rowIndex, props.colIndex)
			}
		})

		const handleInput = function(event){
			if(TableData.columns[props.colIndex].mask !== undefined){
				console.log('masking function')
				// TableData.columns[props.colIndex].mask(event)
			}
			if(TableData.columns[props.colIndex].hasOwnProperty('component')){
				if(resolveDynamicComponent(TableData.columns[props.colIndex].component)){
					TableData.modal.component = this.$root.$.appContext.components[TableData.columns[props.colIndex].component]
					TableData.modal.visible = true
					TableData.modal.colIndex = props.colIndex
					TableData.modal.rowIndex = props.rowIndex
					TableData.modal.event = event
					TableData.modal.parent = this
				}
			}
			return event
		}

		const updateData = function(event){
			if(event){
				// custom components need to handle their own updateData, this is the default
				if(TableData.columns[props.colIndex].component === undefined){
					TableData.setCellData(props.rowIndex, props.colIndex, event.target.innerHTML)
				}
				cellModified = true
				// console.log('cellmodified', cellModified)
			}
		}

		const textAlign = computed(() => {
			return TableData.columns[props.colIndex].align !== undefined ? TableData.columns[props.colIndex].align.toLowerCase() : 'center'
		})

		const cellWidth = computed(() => {
			return TableData.columns[props.colIndex].width !== undefined ? TableData.columns[props.colIndex].width : '40ch'
		})

		let currentData = ''
		// const cellRef = ref(props.colIndex + ':' + props.rowIndex)
		
		const onFocus = function(event){
			currentData = event.target.innerText
			// console.log(currentData)
		}
		const onChange = function(event){
			if(event.target.innerHTML !== currentData){
				currentData = event.target.innerText
				event.target.dispatchEvent(new Event("change"))
				cellModified = true
			}
			console.log(cellModified)
		}

		const getIndent = function(colKey, indent){
			if(indent && colKey === 0 && indent > 0){ 
				return (indent * 1) + 'ch'
			} else {
				return 'inherit'
			}
		}

		watch(cellModified, () => { console.log(currentData)})

		return { TableData, updateData, displayValue, handleInput, cellModified, textAlign, cellWidth, onFocus, onChange, getIndent}
	}
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
