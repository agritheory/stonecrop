import { v4 } from "uuid"
import { computed, reactive, ref } from 'vue'

export default class TableDataStore {
	constructor(id = undefined, columns = [], rows = [], config = {}, table = undefined, display = undefined) {
		this.id = id === undefined ? v4() : id
		this.rows = rows
		this.columns = reactive(columns)
		this.config = reactive(config)
		this.table = table === undefined ? reactive(this.createTableObject()) : table
		this.display = this.createDisplayObject(display)
		this.modal = reactive({
			visible: false,
			rowIndex: undefined,
			colIndex: undefined,
			event: undefined,
		})
	}

	createTableObject(){
		let table = {}
		for (const [colIndex, column] of this.columns.entries()){
			for (const [rowIndex, row] of this.rows.entries()){
				table[`${colIndex}:${rowIndex}`] = row[column.name]
			}
		}
		return table
	}

	createDisplayObject(display){
		let defaultDisplay = { modified: false }
		if(display !== undefined && display.hasOwnProperty("0:0")){
			return display
		} else if(display !== undefined && display.hasOwnProperty("default")){
			defaultDisplay = display.default
		}
		
		let parents = new Set()
		for (let rowIndex = this.rows.length - 1; rowIndex >= 0; rowIndex--) {
			let row = this.rows[rowIndex]
			if(row.parent){
				parents.add(row.parent)
			}
			defaultDisplay[rowIndex] = {
				modified: false,
				open: (row.parent !== null && row.parent !== undefined) ? false : true,
				isParent: parents.has(rowIndex) ? true : false,
				parent: row.parent,
				isRoot: (row.parent !== null && row.parent !== undefined) ? false : true,
				indent: row.indent || null,
				childrenOpen: false
			}	
		}
		return reactive(defaultDisplay)
	}

	get zeroColumn() {
		if (this.config.numberedRows || this.config.treeView) {
			return true
		} else {
			return false
		}
	}

	get numberedRowWidth() {
		computed(() => {
			return String(Math.ceil(this.rows.length / 100) + 1) + 'ch';
		})
	}

	cellData(colIndex, rowIndex) {
		return this.table[`${colIndex}:${rowIndex}`]
	}

	setCellData(rowIndex, colIndex, value) {
		if(this.table[`${colIndex}:${rowIndex}`] !== value){
			this.display[`${colIndex}:${rowIndex}`].modified = true
		}
		this.table[`${colIndex}:${rowIndex}`] = value
		return this.table[`${colIndex}:${rowIndex}`]
	}
	
	toggleRowExpand(rowIndex){
		if(!this.config.treeView) { return }
		
		this.display[rowIndex].childrenOpen = !this.display[rowIndex].childrenOpen
		for (let index = this.rows.length - 1; index >= 0; index--) {
			if(this.display[index].parent === rowIndex){
				this.display[index].open = !this.display[index].open
				if(this.display[index].childrenOpen){
					this.toggleRowExpand(index)
				}
			}
		}
	}

}
