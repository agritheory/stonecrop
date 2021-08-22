import { v4 } from "uuid"
import { computed, reactive, ref } from 'vue'

export default class TableDataStore {
	constructor(id = undefined, columns = [], rows = [], config = {}, table = undefined, display = undefined) {
		this.id = id === undefined ? v4() : id
		this.rows = rows
		this.columns = reactive(columns)
		this.config = reactive(config)
		this.table = table === undefined ? reactive(this.createTableObject(rows)) : table
		this.display = this.createDisplayObject(display)
		this.modal = reactive({
			visible: false,
			rowIndex: undefined,
			colIndex: undefined,
			event: undefined,
		})
	}

	createTableObject(rows){
		let table = {}
		this.columns.forEach((column, colIndex) => {
			rows.forEach((row, rowIndex) => {
				table[colIndex + ":" + rowIndex] = rows[rowIndex][this.columns[colIndex].name]
			})
		})
		return table
	}
	createDisplayObject(display){
		let defaultDisplay = {}
		if(this.config.treeView === true){
			defaultDisplay = {
				modified: ref(false),
				open: ref(false),
				isParent: false,
				isRoot: false,
			}
		} else {
			defaultDisplay = { modified: false }
		}
		if(display !== undefined && display.hasOwnProperty("0:0")){
			return display
		} else if(display !== undefined && display.hasOwnProperty("default")){
			 defaultDisplay = display.default
		}
		display = {}
		Object.keys(this.table).forEach((key) => {
			display[key] = defaultDisplay
		})
		return display
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

	cellData(rowIndex, colIndex) {
		return this.table[colIndex + ":" + rowIndex]
	}

	setCellData(rowIndex, colIndex, value) {
		if(this.table[colIndex + ":" + rowIndex] !== value){
			this.display[colIndex + ":" + rowIndex].modified = true
		}
		this.table[colIndex + ":" + rowIndex] = value
		return this.table[colIndex + ":" + rowIndex]
	}

	// modal(component, colIndex, rowIndex){

	// }
}
