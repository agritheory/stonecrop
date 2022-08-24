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
				<td @click="previousMonth" tabindex="-1">&lt;</td>
				<th colspan="5">{{ monthAndYear }}</th>
				<td @click="nextMonth" tabindex="-1">&gt;</td>
			</tr>
			<tr v-for="rowNo in numberOfRows" :key="rowNo">
				<td
					v-for="colNo in numberOfColumns"
					:key="(rowNo - 1) * numberOfColumns + colNo"
					:class="{
						todaysdate: today(currentDates[(rowNo - 1) * numberOfColumns + colNo]),
						selecteddate: isSelectedDate(currentDates[(rowNo - 1) * numberOfColumns + colNo]),
					}"
					@click="selectDate($event, (rowNo - 1) * numberOfColumns + colNo)">
					{{ new Date(currentDates[(rowNo - 1) * numberOfColumns + colNo]).getDate() }}
				</td>
			</tr>
		</table>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref, watch } from 'vue'

import { TableDataStore } from '@sedum/atable'

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
			let todaysDate = new Date().setUTCHours(0, 0, 0, 0)
			if (currentMonth.value !== new Date(todaysDate).getMonth()) {
				return
			}
			return new Date(todaysDate).toDateString() === new Date(day).toDateString()
		}

		const isSelectedDate = function (day: string | number | Date) {
			return new Date(day).toDateString() === new Date(selectedDate.value).toDateString()
		}

		const selectDate = function (event: Event, currentIndex: number) {
			selectedDate.value = currentDates.value[currentIndex]
			updateData()
			event.preventDefault()
			event.stopPropagation()
			// TODO: (typing) figure out a way to close datepicker
			// context.refs.adatepicker.destroy()
		}

		const updateData = function () {
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

		watch(currentMonth, () => {
			currentDates.value = []
			renderMonth()
		})

		watch(currentYear, () => {
			currentDates.value = []
			renderMonth()
		})

		return {
			currentDates,
			currentMonth,
			currentYear,
			dayWidth,
			handlePageDown,
			handlePageUp,
			isSelectedDate,
			monthAndYear,
			nextMonth,
			numberOfRows,
			numberOfColumns,
			previousMonth,
			selectDate,
			selectedDate,
			tableData,
			today,
			updateData,
			width,
		}
	},
})
</script>

<style scoped>
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
