<template>
	<template v-if="mode === 'display' || mode === 'read'">
		<span class="aform_display-value">{{ date ? new Date(date).toLocaleDateString() : '' }}</span>
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
						<td colspan="7">
							<div class="date-input">
								<input
									ref="start-date-input"
									:value="getStartDate"
									class="date-input-start aform_input-field"
									type="text"
									size="12"
									placeholder="start date"
									@blur="enterInputDate()"
									@keydown="enterDate" />
								<div>-</div>
								<input
									ref="end-date-input"
									:value="getEndDate"
									class="date-input-end aform_input-field"
									type="text"
									size="12"
									placeholder="end date"
									@blur="enterInputDate()"
									@keydown="enterDate" />
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
		<p v-show="errorText" class="aform_error" v-html="errorText"></p>
	</template>
</template>

<script setup lang="ts">
/* removed keyboard nav temportarily since it interfered with user experience navigating input fields */
// import { defaultKeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'

import type { ComponentProps } from '../../types'
import { readTableDate, toDate, writeTableDate, type TableDateStore } from '../../utils/calendar-date'

const numberOfRows = 6
const numberOfColumns = 7

const props = defineProps<
	ComponentProps & {
		rangeStart?: Date | string | null
		rangeEnd?: Date | string | null
		store?: TableDateStore
		colIndex?: number
		rowIndex?: number
	}
>()

const { mode, label, selectRange = false, errors, validation = { errorMessage: '' } } = props
const rangeStart = computed(() => props.rangeStart ?? null)
const rangeEnd = computed(() => props.rangeEnd ?? null)

const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))

const date = defineModel<number | Date | string | null>({ default: null })

const incomingDate = computed(() => {
	const fromModel = toDate(date.value)
	if (fromModel) return fromModel
	if (props.store != null && props.colIndex != null && props.rowIndex != null) {
		return readTableDate(props.store, props.colIndex, props.rowIndex)
	}
	return null
})

const selectedDate = ref<Date | null>(incomingDate.value)
const viewAnchor = selectedDate.value ?? new Date()
const currentMonth = ref<number>(viewAnchor.getMonth())
const currentYear = ref<number>(viewAnchor.getFullYear())
const currentDates = ref<number[]>([])

/* needed for keyboard navigation. uncomment if implementing */
// const datepickerRef = useTemplateRef<HTMLDivElement>('datepicker')

const hoveredDate = ref(new Date())
const start_date = ref<Date | null>(toDate(rangeStart.value))
const end_date = ref<Date | null>(toDate(rangeEnd.value))
const startDateInput = useTemplateRef<HTMLInputElement>('start-date-input')
const endDateInput = useTemplateRef<HTMLInputElement>('end-date-input')

/*******************
Emits
*******************/

const emit = defineEmits<{
	'get-date': [{ start: Date | null; end: Date | null; selected: Date }]
}>()

/*******************
Computed
*******************/

const monthAndYear = computed(() => {
	return new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
	})
})

const getStartDate = computed(() => {
	return start_date.value != null ? parseDateToString(start_date.value) : ''
})

const getEndDate = computed(() => {
	return end_date.value != null ? parseDateToString(end_date.value) : ''
})

/*******************
Functions
*******************/

const parseDateToString = (dateValue: Date | null) => {
	if (!validateDate(dateValue)) return ''
	return dateValue.getMonth() + 1 + '/' + dateValue.getDate() + '/' + dateValue.getFullYear()
}

const isTodaysDate = (day: string | number | Date): boolean => {
	const todaysDate = new Date()
	if (currentMonth.value !== todaysDate.getMonth()) return false
	return todaysDate.toDateString() === new Date(day).toDateString()
}

const isSelectedDate = (day: string | number | Date) => {
	if (!selectedDate.value) return false
	return new Date(day).toDateString() === selectedDate.value.toDateString()
}

const isStartDate = (day: string | number | Date) => {
	const start = start_date.value
	if (!validateDate(start)) return false
	return new Date(day).toDateString() === start.toDateString()
}

const isEndDate = (day: string | number | Date) => {
	const end = end_date.value
	if (!validateDate(end)) return false
	return new Date(day).toDateString() === end.toDateString()
}

const getCurrentCell = (rowNo: number, colNo: number) => {
	return (rowNo - 1) * numberOfColumns + colNo
}

const isInDateRange = (day: string | number | Date) => {
	const start = start_date.value
	if (!validateDate(start)) return false
	const this_date = new Date(day)

	//the end is either the selected end date or wherever the user is hovering
	const end = end_date.value
	const temp_end_date = validateDate(end) ? end : new Date(hoveredDate.value)

	return this_date.getTime() > start.getTime() && this_date.getTime() < temp_end_date.getTime()
}

const getCurrentDate = (rowNo: number, colNo: number) => {
	return currentDates.value[getCurrentCell(rowNo, colNo)]
}

const hoverDate = (currentIndex: number) => {
	hoveredDate.value = new Date(currentDates.value[currentIndex])
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
	currentDates.value = []
	const firstOfMonth = new Date(currentYear.value, currentMonth.value, 1)
	const monthStartWeekday = firstOfMonth.getDay()
	const calendarStartDay = firstOfMonth.setDate(firstOfMonth.getDate() - monthStartWeekday)

	// assume midnight for all dates while building the calendar
	for (const dayIndex of Array(43).keys()) {
		currentDates.value.push(calendarStartDay + dayIndex * 86400000)
	}
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
	date.value = selectedDate.value = new Date(currentDates.value[currentIndex])

	if (selectRange) {
		const start = start_date.value
		if (start == null || end_date.value != null) {
			start_date.value = date.value
			end_date.value = null
		} else if (validateDate(start) && selectedDate.value.getTime() < start.getTime()) {
			end_date.value = null
			start_date.value = date.value
		} else {
			end_date.value = date.value
		}
		if (startDateInput.value) startDateInput.value.value = parseDateToString(start_date.value) ?? ''
		if (endDateInput.value) endDateInput.value.value = parseDateToString(end_date.value) ?? ''
	}
	emitData()
	if (!selectRange && props.store != null && props.colIndex != null && props.rowIndex != null && selectedDate.value) {
		writeTableDate(props.store, props.colIndex, props.rowIndex, selectedDate.value)
	}
}

const testDateOrder = () => {
	const start = start_date.value
	const end = end_date.value
	if (validateDate(end) && validateDate(start) && end.getTime() < start.getTime())
		[start_date.value, end_date.value] = [end, start]
}

const validateDate = (dateValue: unknown): dateValue is Date => {
	return dateValue instanceof Date && !isNaN(dateValue.getTime())
}

const enterInputDate = () => {
	if (startDateInput.value?.value == '') {
		start_date.value = null
	} else if (startDateInput.value) {
		const start = new Date(startDateInput.value.value)
		start_date.value = validateDate(start) ? start : null
	}

	if (endDateInput.value?.value == '') {
		end_date.value = null
	} else if (endDateInput.value) {
		const end = new Date(endDateInput.value.value)
		end_date.value = validateDate(end) ? end : null
	}

	if (validateDate(start_date.value)) {
		if (validateDate(end_date.value)) testDateOrder()
		selectedDate.value = start_date.value
	}

	emitData()
}

const emitData = () => {
	emit('get-date', {
		start: selectRange ? start_date.value : null,
		end: selectRange ? end_date.value : null,
		selected: selectedDate.value,
	})
}

/*******************
Hooks
*******************/

onMounted(() => {
	populateMonth()
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

watch(
	incomingDate,
	parsed => {
		selectedDate.value = parsed
		if (parsed) {
			currentMonth.value = parsed.getMonth()
			currentYear.value = parsed.getFullYear()
		}
	},
	{ immediate: true }
)

watch(
	() => [rangeStart.value, rangeEnd.value] as const,
	([start, end]) => {
		start_date.value = toDate(start)
		end_date.value = toDate(end)
		const anchor = start_date.value ?? end_date.value
		if (anchor && !incomingDate.value) {
			currentMonth.value = anchor.getMonth()
			currentYear.value = anchor.getFullYear()
		}
	}
)

/*******************
Expose
*******************/

defineExpose({ currentMonth, currentYear, selectedDate })
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
	width: max-content;
	max-width: 100%;
	font-size: var(--sc-table-font-size);
	color: var(--sc-cell-text-color);
	outline: none;
}

.adatepicker > table {
	width: 100%;
	border-collapse: collapse;
	margin-bottom: 10px;
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
	min-width: 0;
	flex: 1 1 0;
	padding: 2px;
}

/* Keep the field error in-flow below the calendar. The shared .aform_error is absolutely
   positioned against a .aform_form-element anchor, which this grid component does not use. */
p.aform_error {
	position: static;
	display: block;
	color: var(--sc-brand-danger, red);
	font-size: 0.7rem;
	margin: 0.25rem 0 0;
}
</style>
