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
			'font-weight': cellModified === false ? 'inherit' : 'bold'
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
import {ref, defineComponent, inject, computed, watch, resolveDynamicComponent, h, render } from 'vue'

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

		const displayValue = computed((initialData) => { 
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
					// // this.$root.$.appContext.components[TableData.columns[props.colIndex].component]
					// // render component as vNode and mount i					
						// this.$root.$.appContext.components[TableData.columns[props.colIndex].component],
						// {
						// 	props: {
						// 		event: event, 
						// 		rowIndex: props.rowIndex,
						// 		colIndex: props.colIndex,
						// 		parent: this,
						// 		tableid: props.tableid
						// 	},
						// 	app: this.$root.$
						// }
					// event.target.appendChild(el?.childNodes[0])
				}
			}
			return event
		}

// function renderSomething(event, rowIndex, colIndex, parent, tableid){
// 	const DatePicker = app.extend(ADate)
// 	let dateModal = new DatePicker({
// 		parent: parent,
// 		propsData: { event, rowIndex, colIndex, tableid }
// 	}).$mount()
// 	event.target.appendChild(dateModal.$el)
// }




// 	function dynamicMount(component, { props, children, element, app } = {}){
// 		let el = element
// 		let vNode = h(component, props, children)

// 		if(app && app._context){
// 			vNode.appContext = app._context
// 		}
// 		if(el){
// 			render(vNode, el)
// 		}	else if(typeof document !== 'undefined' ){
// 			render(vNode, el = document.createElement('div'))
// 		}

// 		const destroy = () => {
// 			if (el){
// 				render(null, el)
// 			}
// 			el = null
// 			vNode = null
// 		}

// 		return { vNode, destroy, el }
// 	}


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

		// watch(
		// 	() => { TableData.display[props.colIndex + ":" + props.rowIndex].modified},
		// 	() => { cellModified = } 
		// )
		// let cellModified = function() { return TableData.display[props.colIndex + ":" + props.rowIndex].modified }

		// const cellModified = function(colIndex, rowIndex) {
		// 	if(TableData.display[colIndex + ":" + rowIndex].modified === true){
		// 		return 'var(--cell-modified-background)'
		// 	} else {
		// 		return 'inherit'
		// 	}
		// }

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
			// console.log(cellModified)
		}

		watch(cellModified, () => { console.log(currentData)})

		// watch((cellModified) => {

		// })

		// watchEffect((cellModified))

		return { TableData, updateData, displayValue, handleInput, cellModified, textAlign, cellWidth, onFocus, onChange}
	}
})

</script>
<style scoped>
</style>

