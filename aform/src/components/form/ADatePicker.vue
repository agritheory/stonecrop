<template>
	<div class="adatepicker" tabindex="0" ref="adatepicker">
		<table>
			<tr>
				<td @click="previousMonth" :tabindex="-1">&lt;</td>
				<th colspan="5">{{ monthAndYear }}</th>
				<td @click="nextMonth" :tabindex="-1">&gt;</td>
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
				<td
					v-for="colNo in numberOfColumns"
					:key="getCurrentCell(rowNo, colNo)"
					:contenteditable="false"
					:spellcheck="false"
					:tabindex="0"
					@click.prevent.stop="selectDate(getCurrentCell(rowNo, colNo))"
					@keydown.enter="selectDate(getCurrentCell(rowNo, colNo))"
					:class="{
						todaysDate: isTodaysDate(getCurrentDate(rowNo, colNo)),
						selectedDate: isSelectedDate(getCurrentDate(rowNo, colNo)),
					}">
					{{ new Date(getCurrentDate(rowNo, colNo)).getDate() }}
				</td>
			</tr>
		</table>
	</div>
</template>

<script setup lang="ts">
import { defaultKeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const numberOfRows = 6
const numberOfColumns = 7

const date = defineModel<number | Date>({ default: new Date() })
const selectedDate = ref(new Date(date.value))
const currentMonth = ref<number>(selectedDate.value.getMonth())
const currentYear = ref<number>(selectedDate.value.getFullYear())
const currentDates = ref<number[]>([])

onMounted(async () => {
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

const getCurrentCell = (rowNo: number, colNo: number) => {
	return (rowNo - 1) * numberOfColumns + colNo
}

const getCurrentDate = (rowNo: number, colNo: number) => {
	return currentDates.value[getCurrentCell(rowNo, colNo)]
}

const selectDate = (currentIndex: number) => {
	date.value = selectedDate.value = new Date(currentDates.value[currentIndex])
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
				// TODO: this is a hack to override the stonecrop enter handler;
				// store context inside the component so that handlers can be setup consistently
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				'keydown.enter': () => {}, // select this date
			},
		},
	},
])
</script>

<style>
@import url('@stonecrop/themes/default/default.css');
@import url('@/theme/adate.css');
@import url('@/theme/aform.css');
</style>
