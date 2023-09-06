<template>
	<div :event="event" class="adate" tabindex="0" ref="adatepicker">
		<table>
			<tr class="adate-header">
				<td @click="previousMonth" :tabindex="-1">&lt;</td>
				<th colspan="5">{{ monthAndYear }}</th>
				<td @click="nextMonth" :tabindex="-1">&gt;</td>
			</tr>
			<tr class="adate-header">
				<td>M</td>
				<td>T</td>
				<td>W</td>
				<td>T</td>
				<td>F</td>
				<td>S</td>
				<td>S</td>
			</tr>
			<tr v-for="rowNo in numberOfRows" :key="rowNo">
				<!-- TODO: (style) remove inline styling and replace with theme package -->
				<td
					v-for="colNo in numberOfColumns"
					:key="(rowNo - 1) * numberOfColumns + colNo"
					:contenteditable="false"
					:spellcheck="false"
					:tabindex="0"
					:style="{
						border: isSelectedDate(currentDates[(rowNo - 1) * numberOfColumns + colNo])
							? '2px solid var(--focus-cell-outline)'
							: 'none',
						borderBottomColor: isTodaysDate(currentDates[(rowNo - 1) * numberOfColumns + colNo])
							? 'var(--focus-cell-outline)'
							: 'none',
					}"
					@click.prevent.stop="selectDate($event, (rowNo - 1) * numberOfColumns + colNo)"
					:class="{
						todaysdate: isTodaysDate(currentDates[(rowNo - 1) * numberOfColumns + colNo]),
						selecteddate: isSelectedDate(currentDates[(rowNo - 1) * numberOfColumns + colNo]),
					}">
					{{ new Date(currentDates[(rowNo - 1) * numberOfColumns + colNo]).getDate() }}
				</td>
			</tr>
		</table>
	</div>
</template>

<script setup lang="ts">
import { computed, defineEmits, nextTick, onMounted, ref, watch } from 'vue'
import { defaultKeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'

const props = defineProps<{
	value?: Date
	event?: Event
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: Date): void
	(e: 'selectedDate', value: Date): void
}>()

const numberOfRows = 6
const numberOfColumns = 7
const todaysDate = new Date()

const selectedDate = ref<Date>(props.value || undefined)
const currentMonth = ref<number>()
const currentYear = ref<number>()
const currentDates = ref<number[]>([])

onMounted(async () => {
	let cellDate = new Date()
	if (cellDate) {
		selectedDate.value = cellDate
		currentMonth.value = selectedDate.value.getMonth()
		currentYear.value = selectedDate.value.getFullYear()
	} else {
		currentMonth.value = todaysDate.getMonth()
		currentYear.value = todaysDate.getFullYear()
	}

	renderMonth()
	await nextTick()

	const $selectedDate = document.getElementsByClassName('selecteddate')
	if ($selectedDate.length > 0) {
		;($selectedDate[0] as HTMLElement).focus()
	} else {
		const $todaysDate = document.getElementsByClassName('todaysdate')
		if ($todaysDate.length > 0) {
			;($todaysDate[0] as HTMLElement).focus()
		}
	}
})

watch([currentMonth, currentYear], () => {
	renderMonth()
})

const renderMonth = () => {
	currentDates.value = []
	const firstOfMonth = new Date(currentYear.value, currentMonth.value, 1)
	const monthStartWeekday = firstOfMonth.getDay()
	const calendarStartDay = firstOfMonth.setDate(firstOfMonth.getDate() - monthStartWeekday)
	for (let dayIndex of Array(43).keys()) {
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

const isTodaysDate = (day: string | number | Date) => {
	if (currentMonth.value !== todaysDate.getMonth()) {
		return
	}
	return todaysDate.toDateString() === new Date(day).toDateString()
}

const isSelectedDate = (day: string | number | Date) => {
	return new Date(day).toDateString() === new Date(selectedDate.value).toDateString()
}

computed({
	get: () => {
		return selectedDate.value
	},
	set: newValue => {
		emit('update:modelValue', newValue)
	},
})

const selectDate = (event: Event, currentIndex: number) => {
	selectedDate.value = new Date(currentDates.value[currentIndex])
	emit('selectedDate', selectedDate.value)
}

const monthAndYear = computed(() => {
	return new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
	})
})

// setup keyboard navigation
useKeyboardNav([
	{
		parent: 'table.adate',
		selectors: 'td',
		handlers: {
			...defaultKeypressHandlers,
			...{
				'keydown.pageup': previousMonth,
				'keydown.shift.pageup': previousYear,
				'keydown.pagedown': nextMonth,
				'keydown.shift.pagedown': nextYear,
			},
		},
	},
])
</script>

<style scoped>
@import '@/theme/aform.css';

:root {
	--focus-cell-outline: red;
}

.adate {
	border: 2px solid var(--focus-cell-outline);
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
	min-width: 3ch;
	max-width: 3ch;
	/* this doesn't zoom correctly */
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

.adate .todaysdate {
	border-bottom-color: var(--focus-cell-outline, black);
}

.adate .selecteddate {
	border: 2px solid var(--focus-cell-outline, black);
}
.adate-header td,
.adate-header th {
	border: 2px solid transparent;
	min-width: 2.25ch;
	max-width: 2.25ch;
}
</style>
