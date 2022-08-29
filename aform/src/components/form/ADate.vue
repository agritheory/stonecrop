<template>
	<div
		:event="event"
		:colIndex="colIndex"
		:rowIndex="rowIndex"
		:tableid="tableid"
		class="adate"
		tabindex="0"
		ref="adatepicker">
		<table @keydown.page-down="handlePageDown" @keydown.page-up="handlePageUp">
			<tr>
				<td @click="previousMonth" :tabindex="-1">&lt;</td>
				<th colspan="5">{{ monthAndYear }}</th>
				<td @click="nextMonth" :tabindex="-1">&gt;</td>
			</tr>
			<tr v-for="rowNo in numberOfRows" :key="rowNo">
				<!-- TODO: (style) remove inline styling and replace with theme package -->
				<td
					v-for="colNo in numberOfColumns"
					:key="(rowNo - 1) * numberOfColumns + colNo"
					:contenteditable="tableData.columns[colIndex].edit"
					:tabindex="0"
					:spellcheck="false"
					:style="{
						border: isSelectedDate(currentDates[(rowNo - 1) * numberOfColumns + colNo])
							? '2px solid var(--focus-cell-outline)'
							: 'none',
						borderBottomColor: today(currentDates[(rowNo - 1) * numberOfColumns + colNo])
							? 'var(--focus-cell-outline)'
							: 'none',
					}"
					@click.prevent.stop="selectDate($event, (rowNo - 1) * numberOfColumns + colNo)"
					@keydown.enter="enterNav"
					@keydown.tab="tabNav"
					@keydown.end="endNav"
					@keydown.home="homeNav"
					@keydown.down="downArrowNav"
					@keydown.up="upArrowNav"
					@keydown.left="leftArrowNav"
					@keydown.right="rightArrowNav"
					:class="{
						todaysdate: today(currentDates[(rowNo - 1) * numberOfColumns + colNo]),
						selecteddate: isSelectedDate(currentDates[(rowNo - 1) * numberOfColumns + colNo]),
					}">
					{{ new Date(currentDates[(rowNo - 1) * numberOfColumns + colNo]).getDate() }}
				</td>
			</tr>
		</table>
	</div>
</template>

<script lang="ts">
import { computed, CSSProperties, defineComponent, inject, onMounted, ref, watch } from 'vue'

import { TableDataStore } from '@sedum/atable'
import { useKeyboardNav } from '@sedum/utilities'

export default defineComponent({
	name: 'ADate',
	// components: { ATableModal },
	props: {
		colIndex: {
			type: Number,
			default: 0,
		},
		rowIndex: {
			type: Number,
			default: 0,
		},
		tableid: {
			type: String,
		},
		event: {
			type: Event,
		},
		indent: {
			type: Number,
			default: 0,
		},
	},
	setup(props /* context */) {
		const tableData = inject<TableDataStore>(props.tableid)

		// TODO: (state) figure out how to pass table data to nav composable
		const { enterNav, tabNav, endNav, homeNav, downArrowNav, upArrowNav, leftArrowNav, rightArrowNav } =
			useKeyboardNav(tableData)

		const numberOfRows = 6
		const numberOfColumns = 7

		const todaysDate = new Date()
		let currentMonth = ref(todaysDate.getMonth())
		let currentYear = ref(todaysDate.getFullYear())

		let selectedDate = ref(tableData.cellData<string | number | Date>(props.colIndex, props.rowIndex))
		let currentDates = ref<number[]>([])
		let width = ref('')

		const renderMonth = () => {
			const firstOfMonth = new Date(currentYear.value, currentMonth.value, 1)
			const monthStartWeekday = firstOfMonth.getDay()
			const calendarStartDay = firstOfMonth.setDate(firstOfMonth.getDate() - monthStartWeekday)
			for (let i of Array(43).keys()) {
				currentDates.value.push(calendarStartDay + i * 84000000)
			}
		}

		const handlePageDown = (event: KeyboardEvent) => {
			event.shiftKey ? previousYear() : previousMonth()
		}

		const handlePageUp = (event: KeyboardEvent) => {
			event.shiftKey ? nextYear() : nextMonth()
		}

		const previousYear = () => {
			currentYear.value -= 1
		}

		const nextYear = () => {
			currentYear.value += 1
		}

		const previousMonth = () => {
			if (currentMonth.value == 0) {
				currentMonth.value = 11
				currentYear.value -= 1
			} else {
				currentMonth.value -= 1
			}
		}

		const nextMonth = () => {
			if (currentMonth.value == 11) {
				currentMonth.value = 0
				currentYear.value += 1
			} else {
				currentMonth.value += 1
			}
		}

		const today = (day: string | number | Date) => {
			if (currentMonth.value !== todaysDate.getMonth()) {
				return
			}
			return todaysDate.toDateString() === new Date(day).toDateString()
		}

		const isSelectedDate = (day: string | number | Date) => {
			return new Date(day).toDateString() === new Date(selectedDate.value).toDateString()
		}

		const selectDate = (event: Event, currentIndex: number) => {
			selectedDate.value = currentDates.value[currentIndex]
			updateData()
			// TODO: (typing) figure out a way to close datepicker
			// context.refs.adatepicker.destroy()
		}

		const updateData = () => {
			tableData.setCellData(props.rowIndex, props.colIndex, selectedDate.value)
		}

		onMounted(() => {
			renderMonth()
		})

		const dayWidth = computed(() => {
			const widthValue = Number(width.value.replace('px', ''))
			return `${widthValue / (numberOfColumns - 1)}px`
		})

		const monthAndYear = computed(() => {
			return new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'long',
			})
		})

		const cellStyle: CSSProperties = {
			border: '2px solid var(--focus-cell-outline)',
		}

		watch(currentMonth, () => {
			currentDates.value = []
			renderMonth()
		})

		watch(currentYear, () => {
			currentDates.value = []
			renderMonth()
		})

		return {
			cellStyle,
			currentDates,
			currentMonth,
			currentYear,
			dayWidth,
			downArrowNav,
			endNav,
			enterNav,
			handlePageDown,
			handlePageUp,
			homeNav,
			isSelectedDate,
			leftArrowNav,
			monthAndYear,
			nextMonth,
			numberOfColumns,
			numberOfRows,
			previousMonth,
			rightArrowNav,
			selectDate,
			selectedDate,
			tableData,
			tabNav,
			today,
			upArrowNav,
			updateData,
			width,
		}
	},
})
</script>

<style scoped>
@import '@/theme/aform.css';

.adate {
	border: 2px solid var(--focus-cell-outline);
	position: absolute;
	z-index: 100;
	font-size: var(--table-font-size);
	display: inline-table;
	background-color: var(--row-color-zebra-light);
	color: var(--cell-text-color);
	outline: none;
	width: calc(100% - 4px);
}

.adate tr {
	height: 1.15rem;
	text-align: center;
	vertical-align: middle;
}

.adate td {
	border: 2px solid transparent;
	min-width: 2.25ch; /* this doesn't zoom correctly */
}

.adate td:hover {
	border: 2px solid var(--focus-cell-outline);
}

.adate td {
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

.adate td:focus,
.adate td:focus-within {
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

button {
	background-color: var(--row-color-zebra-light);
	border: none;
	padding: 0px;
	margin: 0px;
	color: var(--cell-text-color);
	outline: none;
	font-size: var(--table-font-size);
}

.dateheader {
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.adate .todaysdate {
	border-bottom-color: var(--focus-cell-outline);
}

.adate .selecteddate {
	border: 2px solid var(--focus-cell-outline);
}
</style>
