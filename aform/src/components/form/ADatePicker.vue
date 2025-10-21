<template>
	<div ref="datepicker" class="adatepicker" tabindex="0">
		<table>
			<tbody>
				<tr>
					<td id="previous-month-btn" :tabindex="-1" @click="previousMonth">&lt;</td>
					<th colspan="5" :tabindex="-1">{{ monthAndYear }}</th>
					<td id="next-month-btn" :tabindex="-1" @click="nextMonth">&gt;</td>
				</tr>
				<tr v-if="selectRange">
					<td colspan="7">
						<div class="date-input">
							<input
								v-model="startDateInput"
								class="date-input-start aform_input-field"
								type="text"
								placeholder="start date"
								@keydown="enterDate" />
							<div>-</div>
							<input
								v-model="endDateInput"
								class="date-input-end aform_input-field"
								type="text"
								placeholder="end date"
								@keydown="enterDate" />
							<button @click="applyDates" class="date-input-button">&check;</button>
						</div>
						<!-- {{ formattedDateRange }} -->
					</td>
				</tr>
				<tr class="days-header">
					<td>M</td>
					<td>T</td>
					<td>W</td>
					<td>T</td>
					<td>F</td>
					<td>S</td>
					<td>S</td>
				</tr>
				<tr v-for="rowNo in numberOfRows" :key="rowNo">
					<!-- the 'ref' key is currently only used for test references -->
					<td
						v-for="colNo in numberOfColumns"
						ref="celldate"
						:key="getCurrentCell(rowNo, colNo)"
						class="date-cell"
						:contenteditable="false"
						:spellcheck="false"
						:tabindex="0"
						:class="{
							todaysDate: isTodaysDate(getCurrentDate(rowNo, colNo)),
							selectedDate: isSelectedDate(getCurrentDate(rowNo, colNo)),
							withinRange: selectRange ? isInDateRange(getCurrentDate(rowNo, colNo)) : false,
							startDate: selectRange ? isStartDate(getCurrentDate(rowNo, colNo)) : false,
							endDate: selectRange ? isEndDate(getCurrentDate(rowNo, colNo)) : false,
						}"
						@click.prevent.stop="selectDate(getCurrentCell(rowNo, colNo))"
						@keydown.enter="selectDate(getCurrentCell(rowNo, colNo))"
						@mouseover="hoverDate(getCurrentCell(rowNo, colNo))">
						{{ new Date(getCurrentDate(rowNo, colNo)).getDate() }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
import { defaultKeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch, reactive } from 'vue'

const numberOfRows = 6
const numberOfColumns = 7

const date = defineModel<number | Date>({ default: new Date() })
const selectedDate = ref(new Date(date.value))
const currentMonth = ref<number>(selectedDate.value.getMonth())
const currentYear = ref<number>(selectedDate.value.getFullYear())
const currentDates = ref<number[]>([])
const datepickerRef = useTemplateRef<HTMLDivElement>('datepicker')
const hoveredDate = ref(new Date(date.value))

const startDateInput = ref(null)
const endDateInput = ref(null)

const selectedDateRange = reactive({
	start_date: new Date(),
	end_date: new Date(),
})

const props = defineProps({
	selectRange: {
		type: Boolean,
		default: false,
	},
})

onMounted(async () => {
	// datePickerStart.value.value =
	populateMonth()
	// required to allow the elements to be focused in the next step
	await nextTick()
	const $selectedDate = document.getElementsByClassName('selectedDate')
	if ($selectedDate.length > 0) {
		;($selectedDate[0] as HTMLElement).focus()
	} else {
		const $todaysDate = document.getElementsByClassName('todaysDate')
		if ($todaysDate.length > 0) {
			;($todaysDate[0] as HTMLElement).focus()
		}
	}
})

const populateMonth = () => {
	currentDates.value = []
	const firstOfMonth = new Date(currentYear.value, currentMonth.value, 1)
	const monthStartWeekday = firstOfMonth.getDay()
	const calendarStartDay = firstOfMonth.setDate(firstOfMonth.getDate() - monthStartWeekday)

	// assume midnight for all dates while building the calendar
	for (const dayIndex of Array(43).keys()) {
		currentDates.value.push(calendarStartDay + dayIndex * 86400000)
	}
}

watch([currentMonth, currentYear], populateMonth)
const previousYear = () => (currentYear.value -= 1)
const nextYear = () => (currentYear.value += 1)

const previousMonth = () => {
	if (currentMonth.value == 0) {
		currentMonth.value = 11
		previousYear()
	} else {
		currentMonth.value -= 1
	}
}

const nextMonth = () => {
	if (currentMonth.value == 11) {
		currentMonth.value = 0
		nextYear()
	} else {
		currentMonth.value += 1
	}
}

const applyDates = () => {
	//check the start and end dates
	let start_date = new Date(startDateInput.value)
	let end_date = new Date(endDateInput.value)

	if (start_date.getTime() > end_date.getTime() && end_date.getTime()) {
		//swap the dates if end date is before start date
		const temp_date = start_date
		const temp_value = startDateInput.value
		start_date = end_date
		end_date = temp_date
		startDateInput.value = endDateInput.value
		endDateInput.value = temp_value
	}
	if (start_date.getTime()) {
		selectedDateRange.start_date = start_date
		selectedDate.value = start_date
	} else {
		selectedDateRange.start_date = new Date()
		selectedDate.value = new Date()
	}
	if (end_date.getTime()) {
		selectedDateRange.end_date = end_date
	} else {
		selectedDateRange.end_date = new Date()
	}
}

const isTodaysDate = (day: string | number | Date) => {
	const todaysDate = new Date()
	if (currentMonth.value !== todaysDate.getMonth()) {
		return
	}
	return todaysDate.toDateString() === new Date(day).toDateString()
}

const isSelectedDate = (day: string | number | Date) => {
	return new Date(day).toDateString() === new Date(selectedDate.value).toDateString()
}
const isStartDate = (day: string | number | Date) => {
	return new Date(day).toDateString() === new Date(selectedDateRange.start_date).toDateString()
}
const isEndDate = (day: string | number | Date) => {
	return new Date(day).toDateString() === new Date(selectedDateRange.end_date).toDateString()
}

const getCurrentCell = (rowNo: number, colNo: number) => {
	return (rowNo - 1) * numberOfColumns + colNo
}

const isInDateRange = (day: string | number | Date) => {
	//apply the withinRange class to all days within the selected range
	const this_date = new Date(day)
	let start_date = new Date(selectedDateRange.start_date)
	let end_date = selectedDateRange.end_date != null ? new Date(selectedDateRange.end_date) : new Date(hoveredDate.value)

	if (start_date.getTime() > end_date.getTime()) [start_date, end_date] = [end_date, start_date]

	return this_date.getTime() > start_date.getTime() && this_date.getTime() < end_date.getTime()
}

const getCurrentDate = (rowNo: number, colNo: number) => {
	return currentDates.value[getCurrentCell(rowNo, colNo)]
}
const hoverDate = (currentIndex: number) => {
	hoveredDate.value = new Date(currentDates.value[currentIndex])
}
const selectDate = (currentIndex: number) => {
	date.value = selectedDate.value = new Date(currentDates.value[currentIndex])

	if (props.selectRange) {
		if (selectedDateRange.start_date == null || selectedDateRange.end_date != null) {
			selectedDateRange.start_date = date.value
			selectedDateRange.end_date = null
		} else if (selectedDate.value.getTime() < selectedDateRange.start_date.getTime()) {
			//set it as the start date and swap them
			selectedDateRange.end_date = selectedDateRange.start_date
			selectedDateRange.start_date = date.value
		} else {
			selectedDateRange.end_date = date.value
		}
	}

	startDateInput.value = parseDateToString(selectedDateRange.start_date)
	endDateInput.value = parseDateToString(selectedDateRange.end_date)
}

const parseDateToString = (date: Date) => {
	let date_string = ''
	if (date == null || !date.getTime()) {
		return ''
	}
	date_string += date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
	return date_string
}

const monthAndYear = computed(() => {
	return new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
	})
})
const enterDate = event => {
	if (event.key === 'Enter') applyDates()
}

// setup keyboard navigation
useKeyboardNav([
	{
		parent: datepickerRef,
		selectors: 'td',
		handlers: {
			...defaultKeypressHandlers,
			...{
				'keydown.pageup': previousMonth,
				'keydown.shift.pageup': previousYear,
				'keydown.pagedown': nextMonth,
				'keydown.shift.pagedown': nextYear,
				// TODO: this is a hack to override the stonecrop enter handler;
				// store context inside the component so that handlers can be setup consistently

				'keydown.enter': () => {}, // select this date
			},
		},
	},
])

defineExpose({ currentMonth, currentYear, selectedDate, selectedDateRange })
</script>

<style scoped>
/* @import url('@stonecrop/themes/default.css'); */
.adatepicker {
	font-size: var(--sc-table-font-size);
	display: inline-table;
	color: var(--sc-cell-text-color);
	outline: none;
	border-collapse: collapse;
	/* width: calc(100% - 4px); */
}

.adatepicker tr {
	height: 1.15rem;
	height: 1.15rem;
	text-align: center;
	vertical-align: middle;
}

.adatepicker td {
	border: 2px solid transparent;
	outline: 2px solid transparent;
	min-width: 3ch;
	max-width: 3ch;
	cursor: pointer;
}
.adatepicker td.date-cell:hover {
	background: var(--sc-gray-10);
}

.adatepicker td:focus,
.adatepicker td:focus-within {
	/* outline: 1px dashed black; */
	box-shadow: none;
	overflow: hidden;
	min-height: 1.15em;
	max-height: 1.15em;
	overflow: hidden;
}
.adatepicker .selectedDate,
.adatepicker .startDate,
.adatepicker .endDate {
	/* outline: 1px solid black; */
	background: var(--sc-gray-20);
	font-weight: bolder;
}
.adatepicker .startDate {
	/* border-radius: 5px 0px 0px 5px; */
	border-left: 1px solid var(--sc-gray-50);
	background: var(--sc-gray-20) !important;
}
.adatepicker .endDate {
	border-right: 1px solid var(--sc-gray-50);
	/* border-radius: 0px 5px 5px 0px; */
	background: var(--sc-gray-20) !important;
}
.adatepicker .withinRange {
	background: var(--sc-gray-5);
}

.adatepicker .todaysDate {
	font-weight: bolder;
	/* text-decoration: underline; */
	color: black;
}
.days-header > td {
	font-weight: bold;
}
.prev-date {
	color: var(--sc-gray-20);
}

.adatepicker .date-input {
	display: flex;
	width: 100%;
	gap: 5px;
	align-items: center;
}
.adatepicker .date-input > input {
	width: 50%;
	padding: 2px;
}
.date-input-button {
}
</style>
