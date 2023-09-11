<template>
	<div :event="event" class="adatepicker" tabindex="0" ref="adatepicker">
		<table>
			<tr>
				<td @click="previousMonth" :tabindex="-1">&lt;</td>
				<th colspan="5">{{ monthAndYear }}</th>
				<td @click="nextMonth" :tabindex="-1">&gt;</td>
			</tr>
			<tr>
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
					@click.prevent.stop="selectDate($event, (rowNo - 1) * numberOfColumns + colNo)"
					:class="{
						todaysDate: isTodaysDate(currentDates[(rowNo - 1) * numberOfColumns + colNo]),
						selectedDate: isSelectedDate(currentDates[(rowNo - 1) * numberOfColumns + colNo]),
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
	modelValue?: Number
	event?: Event
}>()

const emit = defineEmits(['update:value'])

const numberOfRows = 6
const numberOfColumns = 7
const todaysDate = new Date()

const selectedDate = ref<Date>(props.modelValue || undefined)
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

const value = computed({
	get: () => {
		return modelValue.value
	},
	set: newValue => {
		selectDate(newValue)
	},
})

const selectDate = (currentIndex: number) => {
	selectedDate.value = new Date(currentDates.value[currentIndex])
	emit('modelValue', selectedDate.value.getTime())
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
				// 'keydown.tab': selectDate // select this date
				// 'keydown.enter': selectDate // select this date
				'keydown.shift.tab': () => {}, // disable - not working
				'keydown.shift.enter': () => {}, // disable - not working
			},
		},
	},
])
</script>

<style scoped>
@import '@/theme/aform.css';
@import url('@stonecrop/themes/default/default.css');

.adatepicker {
	font-size: var(--table-font-size);
	display: inline-table;
	color: var(--cell-text-color);
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
}

.adatepicker td:focus,
.adatepicker td:focus-within {
	outline-width: 2px;
	outline-style: solid;
	outline-color: var(--active-cell-outline);
	box-shadow: none;
	overflow: hidden;
	min-height: 1.15em;
	max-height: 1.15em;
	overflow: hidden;
}
.adatepicker .selectedDate {
	border: 2px solid var(--focus-cell-outline);
}

.adatepicker .todaysDate {
	border-bottom-color: var(--active-cell-outline);
}
</style>
