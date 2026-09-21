<template>
	<template v-if="mode === 'display' || mode === 'read'">
		<span class="aform_display-value">{{ displayValue }}</span>
		<label v-if="label">{{ label }}</label>
		<p v-show="errorText" class="aform_error" v-html="errorText"></p>
	</template>
	<template v-else>
		<div ref="datepicker" class="adatepicker" tabindex="0">
			<table @mousedown="preventCellSelection">
				<tbody>
					<tr>
						<td id="previous-month-btn" :tabindex="-1" @click="previousMonth">&lt;</td>
						<th colspan="5" :tabindex="-1">{{ monthAndYear }}</th>
						<td id="next-month-btn" :tabindex="-1" @click="nextMonth">&gt;</td>
					</tr>
					<tr v-if="selectRange">
						<td colspan="7" class="range-inputs">
							<div class="date-input">
								<input
									ref="start-date-input"
									:value="getStartDate"
									class="date-input-start aform_input-field"
									type="text"
									placeholder="start date"
									@blur="enterInputDate()"
									@keydown="enterDate" />
								<div>-</div>
								<input
									ref="end-date-input"
									:value="getEndDate"
									class="date-input-end aform_input-field"
									type="text"
									placeholder="end date"
									@blur="enterInputDate()"
									@keydown="enterDate" />
							</div>
							<!-- {{ formattedDateRange }} -->
						</td>
					</tr>
					<tr class="days-header">
						<td v-for="(letter, weekdayIndex) in weekdayLetters" :key="weekdayIndex">{{ letter }}</td>
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
							{{ getCurrentDate(rowNo, colNo).day }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p v-show="errorText" class="aform_error" v-html="errorText"></p>
	</template>
</template>

<script setup lang="ts">
/* removed keyboard nav temportarily since it interfered with user experience navigating input fields */
// import { defaultKeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'
import { fromISODate } from '@stonecrop/utilities'
import { Temporal } from 'temporal-polyfill'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

import type { ComponentProps } from '../../types'
import { readTypedDay, writeTypedDay } from '../../utils/typedDay'

const numberOfRows = 6
const numberOfColumns = 7

const { mode, label, selectRange = false, errors, validation = { errorMessage: '' } } = defineProps<ComponentProps>()

// Dynamic trigger errors take precedence over a static schema errorMessage; empty means the slot hides.
const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))

// The calendar holds a `YYYY-MM-DD` day, and opens on today when it holds none it can read. No default
// value: picking today on an empty calendar must still set it, and a model only reports a change.
const date = defineModel<string | null>()
const selectedDate = ref<Temporal.PlainDate>(fromISODate(date.value ?? '') ?? Temporal.Now.plainDateISO())
// 0 for January.
const currentMonth = ref<number>(selectedDate.value.month - 1)
const currentYear = ref<number>(selectedDate.value.year)
const currentDates = ref<Temporal.PlainDate[]>([])

/* needed for keyboard navigation. uncomment if implementing */
// const datepickerRef = useTemplateRef<HTMLDivElement>('datepicker')

const hoveredDate = ref<Temporal.PlainDate>(selectedDate.value)
const start_date = ref<Temporal.PlainDate | null>(null)
const end_date = ref<Temporal.PlainDate | null>(null)
const startDateInput = useTemplateRef<HTMLInputElement>('start-date-input')
const endDateInput = useTemplateRef<HTMLInputElement>('end-date-input')

/*******************
Emits
*******************/

const emit = defineEmits<{
	'get-date': [{ start: string | null; end: string | null; selected: string }]
}>()

/*******************
Computed
*******************/

const displayValue = computed(() => (date.value ? (fromISODate(date.value)?.toLocaleString() ?? 'Invalid Date') : ''))

const firstOfMonth = computed(() =>
	Temporal.PlainDate.from({ year: currentYear.value, month: currentMonth.value + 1, day: 1 })
)

// Not a `PlainYearMonth`: its `toLocaleString` throws for the ISO calendar.
const monthAndYear = computed(() => firstOfMonth.value.toLocaleString(undefined, { year: 'numeric', month: 'long' }))

// The grid's first week, so the letters follow its Monday start.
const weekdayLetters = computed(() =>
	currentDates.value.slice(0, numberOfColumns).map(day => day.toLocaleString(undefined, { weekday: 'narrow' }))
)

const getStartDate = computed(() => boxText(start_date.value))

const getEndDate = computed(() => boxText(end_date.value))

/*******************
Functions
*******************/

const boxText = (day: Temporal.PlainDate | null) => (day ? writeTypedDay(day) : '')

const isTodaysDate = (day: Temporal.PlainDate): boolean => {
	const today = Temporal.Now.plainDateISO()
	if (currentMonth.value !== today.month - 1) return false
	return day.equals(today)
}

const isSelectedDate = (day: Temporal.PlainDate) => {
	return day.equals(selectedDate.value)
}

const isStartDate = (day: Temporal.PlainDate) => {
	return start_date.value !== null && day.equals(start_date.value)
}

const isEndDate = (day: Temporal.PlainDate) => {
	return end_date.value !== null && day.equals(end_date.value)
}

const getCurrentCell = (rowNo: number, colNo: number) => {
	return (rowNo - 1) * numberOfColumns + colNo - 1
}

const isInDateRange = (day: Temporal.PlainDate) => {
	const start = start_date.value
	if (!start) return false

	//the end is either the selected end date or wherever the user is hovering
	const end = end_date.value ?? hoveredDate.value

	return Temporal.PlainDate.compare(day, start) > 0 && Temporal.PlainDate.compare(day, end) < 0
}

const getCurrentDate = (rowNo: number, colNo: number) => {
	return currentDates.value[getCurrentCell(rowNo, colNo)]
}

const hoverDate = (currentIndex: number) => {
	hoveredDate.value = currentDates.value[currentIndex]
}

// browsers (notably Firefox) allow drag-selecting text across table cells even with
// `user-select: none` on the cells; blocking mousedown is the reliable cross-browser fix.
// the start/end-date inputs must keep native mousedown behavior so they stay focusable/typable.
const preventCellSelection = (event: MouseEvent) => {
	if ((event.target as HTMLElement)?.tagName !== 'INPUT') {
		event.preventDefault()
	}
}

const populateMonth = () => {
	// The grid starts on the Monday on or before the 1st, matching the header's first column.
	const gridStart = firstOfMonth.value.subtract({ days: firstOfMonth.value.dayOfWeek - 1 })
	currentDates.value = Array.from({ length: numberOfRows * numberOfColumns }, (_, cellIndex) =>
		gridStart.add({ days: cellIndex })
	)
}
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

const enterDate = (event: KeyboardEvent) => {
	if (event.key === 'Enter') enterInputDate()
}

// useKeyboardNav([
// 	{
// 		parent: datepickerRef,
// 		selectors: 'td',
// 		handlers: {
// 			...defaultKeypressHandlers,
// 			...{
// 				'keydown.pageup': previousMonth,
// 				'keydown.shift.pageup': previousYear,
// 				'keydown.pagedown': nextMonth,
// 				'keydown.shift.pagedown': nextYear,
// 				// TODO: this is a hack to override the stonecrop enter handler;
// 				// store context inside the component so that handlers can be setup consistently
// 				// eslint-disable-next-line @typescript-eslint/no-empty-function
// 				'keydown.enter': () => {}, // select this date
// 			},
// 		},
// 	},
// ])

const selectDate = (currentIndex: number) => {
	const picked = currentDates.value[currentIndex]
	selectedDate.value = picked
	date.value = picked.toString()

	if (selectRange) {
		const start = start_date.value
		if (start == null || end_date.value != null) {
			start_date.value = picked
			end_date.value = null
		} else if (Temporal.PlainDate.compare(picked, start) < 0) {
			end_date.value = null
			start_date.value = picked
		} else {
			end_date.value = picked
		}
		if (startDateInput.value) startDateInput.value.value = boxText(start_date.value)
		if (endDateInput.value) endDateInput.value.value = boxText(end_date.value)
	}
	emitData()
}

const testDateOrder = () => {
	const start = start_date.value
	const end = end_date.value
	if (start && end && Temporal.PlainDate.compare(end, start) < 0) [start_date.value, end_date.value] = [end, start]
}

const enterInputDate = () => {
	if (startDateInput.value?.value == '') {
		start_date.value = null
	} else if (startDateInput.value) {
		start_date.value = readTypedDay(startDateInput.value.value) ?? null
	}

	if (endDateInput.value?.value == '') {
		end_date.value = null
	} else if (endDateInput.value) {
		end_date.value = readTypedDay(endDateInput.value.value) ?? null
	}

	if (start_date.value) {
		if (end_date.value) testDateOrder()
		selectedDate.value = start_date.value
	}

	emitData()
}

const emitData = () => {
	emit('get-date', {
		start: selectRange ? (start_date.value?.toString() ?? null) : null,
		end: selectRange ? (end_date.value?.toString() ?? null) : null,
		selected: selectedDate.value.toString(),
	})
}

/*******************
Hooks
*******************/

populateMonth()

onMounted(async () => {
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

// setup keyboard navigation
// useKeyboardNav([
// 	{
// 		parent: datepickerRef,
// 		selectors: 'td',
// 		handlers: {
// 			...defaultKeypressHandlers,
// 			'keydown.pageup': previousMonth,
// 			'keydown.shift.pageup': previousYear,
// 			'keydown.pagedown': nextMonth,
// 			'keydown.shift.pagedown': nextYear,
// 			// TODO: this is a hack to override the stonecrop enter handler;
// 			// store context inside the component so that handlers can be setup consistently

// 			'keydown.enter': () => {}, // select this date
// 		},
// 	},
// ])

/*******************
Watchers
*******************/

watch([currentMonth, currentYear], populateMonth)

/*******************
Expose
*******************/

defineExpose({ currentMonth, currentYear, selectedDate: computed(() => selectedDate.value.toString()) })
</script>

<style scoped>
.adatepicker,
.adatepicker table,
.adatepicker tr,
.adatepicker td,
.adatepicker th {
	-webkit-user-select: none;
	-moz-user-select: none;
	user-select: none;
}

.adatepicker {
	font-size: var(--sc-table-font-size);
	display: inline-table;
	color: var(--sc-cell-text-color);
	outline: none;
	border-collapse: collapse;
	margin-bottom: 10px;
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
/* The boxes' row widens the calendar past its 3ch day columns, so each box fits a day such as `04/09/2026`. */
.adatepicker td.range-inputs {
	max-width: none;
}
.adatepicker .date-input > input {
	flex: none;
	width: 11ch;
	box-sizing: border-box;
	padding: 2px;
}

/* Keep the field error in-flow below the calendar. The shared .aform_error is absolutely
   positioned against a .aform_form-element anchor, which this grid component does not use. */
p.aform_error {
	position: static;
	display: block;
	color: var(--sc-brand-danger);
	font-size: 0.7rem;
	margin: 0.25rem 0 0;
}
</style>
