<template>
	<template v-if="mode === 'display' || mode === 'read'">
		<span class="aform_display-value">{{ date ? new Date(date).toLocaleDateString() : '' }}</span>
		<label v-if="label">{{ label }}</label>
		<p v-show="errorText" :id="errorId" class="aform_error" role="alert">{{ errorText }}</p>
	</template>
	<template v-else>
		<div ref="datepicker" class="adatepicker">
			<table role="grid" :aria-label="label || 'Calendar'" @mousedown="preventCellSelection">
				<tbody>
					<tr>
						<td>
							<button
								id="previous-month-btn"
								type="button"
								class="month-nav-btn"
								aria-label="Previous month"
								@click="previousMonth">
								&lt;
							</button>
						</td>
						<th colspan="5">{{ monthAndYear }}</th>
						<td>
							<button
								id="next-month-btn"
								type="button"
								class="month-nav-btn"
								aria-label="Next month"
								@click="nextMonth">
								&gt;
							</button>
						</td>
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
					<tr v-for="rowNo in numberOfRows" :key="rowNo" role="row">
						<td
							v-for="colNo in numberOfColumns"
							ref="celldate"
							:key="getCurrentCell(rowNo, colNo)"
							role="gridcell"
							class="date-cell"
							:contenteditable="false"
							:spellcheck="false"
							:tabindex="cellTabindex(rowNo, colNo)"
							:aria-selected="isSelectedDate(getCurrentDate(rowNo, colNo))"
							:class="{
								todaysDate: isTodaysDate(getCurrentDate(rowNo, colNo)),
								selectedDate: isSelectedDate(getCurrentDate(rowNo, colNo)),
								withinRange: selectRange ? isInDateRange(getCurrentDate(rowNo, colNo)) : false,
								startDate: selectRange ? isStartDate(getCurrentDate(rowNo, colNo)) : false,
								endDate: selectRange ? isEndDate(getCurrentDate(rowNo, colNo)) : false,
								'prev-date': isOutsideCurrentMonth(getCurrentDate(rowNo, colNo)),
							}"
							@click.prevent.stop="selectDate(getCurrentCell(rowNo, colNo))"
							@keydown="onCellKeydown($event, getCurrentCell(rowNo, colNo))"
							@focus="focusedCellIndex = getCurrentCell(rowNo, colNo)"
							@mouseover="hoverDate(getCurrentCell(rowNo, colNo))">
							{{ new Date(getCurrentDate(rowNo, colNo)).getDate() }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p v-show="errorText" :id="errorId" class="aform_error" role="alert">{{ errorText }}</p>
	</template>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

import { fieldErrorA11y } from '../../composables/fieldErrorA11y'
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

const { mode, label, selectRange = false, errors, validation = { errorMessage: '' }, uuid } = props
const rangeStart = computed(() => props.rangeStart ?? null)
const rangeEnd = computed(() => props.rangeEnd ?? null)

const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))
const { errorId } = fieldErrorA11y(uuid, errorText)

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
const focusedCellIndex = ref(0)
const cellRefs = useTemplateRef<HTMLTableCellElement[]>('celldate')

const hoveredDate = ref(new Date())
const start_date = ref<Date | null>(toDate(rangeStart.value))
const end_date = ref<Date | null>(toDate(rangeEnd.value))
const startDateInput = useTemplateRef<HTMLInputElement>('start-date-input')
const endDateInput = useTemplateRef<HTMLInputElement>('end-date-input')

const emit = defineEmits<{
	'get-date': [{ start: Date | null; end: Date | null; selected: Date | null }]
}>()

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

const isOutsideCurrentMonth = (day: string | number | Date) => {
	return new Date(day).getMonth() !== currentMonth.value
}

const getCurrentCell = (rowNo: number, colNo: number) => {
	return (rowNo - 1) * numberOfColumns + colNo
}

const cellTabindex = (rowNo: number, colNo: number) => {
	return getCurrentCell(rowNo, colNo) === focusedCellIndex.value ? 0 : -1
}

const findFocusIndex = (): number => {
	if (selectedDate.value) {
		const idx = currentDates.value.findIndex(d => new Date(d).toDateString() === selectedDate.value!.toDateString())
		if (idx >= 0) return idx
	}
	const today = new Date()
	const todayIdx = currentDates.value.findIndex(d => new Date(d).toDateString() === today.toDateString())
	if (todayIdx >= 0) return todayIdx
	return 0
}

const focusCell = (index: number) => {
	const clamped = Math.max(0, Math.min(currentDates.value.length - 1, index))
	focusedCellIndex.value = clamped
	nextTick(() => {
		const cells = cellRefs.value
		if (Array.isArray(cells)) {
			cells[clamped]?.focus()
		}
	})
}

const isInDateRange = (day: string | number | Date) => {
	const start = start_date.value
	if (!validateDate(start)) return false
	const this_date = new Date(day)

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

	for (const dayIndex of Array(43).keys()) {
		currentDates.value.push(calendarStartDay + dayIndex * 86400000)
	}
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

const onCellKeydown = (event: KeyboardEvent, cellIndex: number) => {
	const navigationKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Enter', ' ']
	if (!navigationKeys.includes(event.key)) return

	event.stopPropagation()

	switch (event.key) {
		case 'ArrowLeft':
			event.preventDefault()
			focusCell(cellIndex - 1)
			break
		case 'ArrowRight':
			event.preventDefault()
			focusCell(cellIndex + 1)
			break
		case 'ArrowUp':
			event.preventDefault()
			focusCell(cellIndex - numberOfColumns)
			break
		case 'ArrowDown':
			event.preventDefault()
			focusCell(cellIndex + numberOfColumns)
			break
		case 'PageUp':
			event.preventDefault()
			if (event.shiftKey) previousYear()
			else previousMonth()
			break
		case 'PageDown':
			event.preventDefault()
			if (event.shiftKey) nextYear()
			else nextMonth()
			break
		case 'Enter':
		case ' ':
			event.preventDefault()
			selectDate(cellIndex)
			break
	}
}

const selectDate = (currentIndex: number) => {
	date.value = selectedDate.value = new Date(currentDates.value[currentIndex])
	focusedCellIndex.value = currentIndex

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

onMounted(() => {
	populateMonth()
	focusedCellIndex.value = findFocusIndex()
})

watch([currentMonth, currentYear], () => {
	populateMonth()
	nextTick(() => {
		focusedCellIndex.value = findFocusIndex()
	})
})

watch(
	incomingDate,
	parsed => {
		selectedDate.value = parsed
		if (!parsed) return
		const visible = currentDates.value.some(d => new Date(d).toDateString() === parsed.toDateString())
		if (!visible) {
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
}

.adatepicker > table {
	width: 100%;
	border-collapse: collapse;
	margin-bottom: 10px;
}

.adatepicker tr {
	text-align: center;
	vertical-align: middle;
}

.adatepicker td {
	border: 2px solid transparent;
	min-width: 24px;
	min-height: 24px;
	cursor: pointer;
}

.adatepicker td.date-cell:hover {
	background: var(--sc-gray-10);
}

.adatepicker td.date-cell:focus {
	outline: 2px solid var(--sc-focus-cell-outline);
	outline-offset: -2px;
}

.month-nav-btn {
	border: none;
	background: transparent;
	color: var(--sc-cell-text-color);
	cursor: pointer;
	font: inherit;
	padding: 0.25rem 0.5rem;
	min-width: 24px;
	min-height: 24px;
}

.month-nav-btn:focus-visible {
	outline: 2px solid var(--sc-focus-cell-outline);
	outline-offset: -2px;
}

.adatepicker .selectedDate,
.adatepicker .startDate,
.adatepicker .endDate {
	background: var(--sc-gray-20);
	font-weight: bolder;
}

.adatepicker .startDate {
	border-left: 1px solid var(--sc-gray-50);
	background: var(--sc-gray-20) !important;
}

.adatepicker .endDate {
	border-right: 1px solid var(--sc-gray-50);
	background: var(--sc-gray-20) !important;
}

.adatepicker .withinRange {
	background: var(--sc-gray-5);
}

.adatepicker .todaysDate {
	font-weight: bolder;
	color: var(--sc-cell-text-color);
}

.days-header > td {
	font-weight: bold;
}

.prev-date {
	color: var(--sc-gray-50);
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

p.aform_error {
	position: static;
	display: block;
	color: var(--sc-brand-danger);
	font-size: 0.7rem;
	margin: 0.25rem 0 0;
}
</style>
