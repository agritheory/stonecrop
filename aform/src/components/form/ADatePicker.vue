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
								:value="getStartDate"
								ref="start-date-input"
								class="date-input-start aform_input-field"
								type="text"
								placeholder="start date"
								@blur="enterInputDate()"
								@keydown="enterDate" />
							<div>-</div>
							<input
								:value="getEndDate"
								ref="end-date-input"
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
/* removed keyboard nav temportarily since it interfered with user experience navigating input fields */
// import { defaultKeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

/*******************
Const
*******************/

const numberOfRows = 6
const numberOfColumns = 7
const date = defineModel<number | Date>({ default: new Date() })
const selectedDate = ref(new Date(date.value))
const currentMonth = ref<number>(selectedDate.value.getMonth())
const currentYear = ref<number>(selectedDate.value.getFullYear())
const currentDates = ref<number[]>([])
/* needed for keyboard navigation. uncomment if implementing */
//const datepickerRef = useTemplateRef<HTMLDivElement>('datepicker')
const hoveredDate = ref(new Date(date.value))
const start_date = ref(new Date())
const end_date = ref(new Date())
const startDateInput = useTemplateRef('start-date-input')
const endDateInput = useTemplateRef('end-date-input')

/*******************
Props
*******************/

const props = defineProps({
	selectRange: {
		type: Boolean,
		default: false,
	},
})

/*******************
Emits
*******************/

const emit = defineEmits(['get-date'])

/*******************
Computed
*******************/

const monthAndYear = computed(() => {
	return new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
	})
})
const getStartDate = computed(()=>{
	return (start_date.value!=''&& start_date.value!=null)?parseDateToString(start_date.value):''
})

const getEndDate = computed(()=>{
	return parseDateToString(end_date.value)
})

/*******************
Functions
*******************/

const parseDateToString = (date: Date) => {
	if(date!=null){
		let date_string = ''
		if (!validateDate(date))return ''
		date_string += date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
		return date_string
	}
}

const isTodaysDate = (day: string | number | Date) => {
	const todaysDate = new Date()
	if (currentMonth.value !== todaysDate.getMonth()) return
	return todaysDate.toDateString() === new Date(day).toDateString()
}

const isSelectedDate = (day: string | number | Date) => {
	return new Date(day).toDateString() === new Date(selectedDate.value).toDateString()
}

const isStartDate = (day: string | number | Date) => {
	if(!validateDate(start_date.value))return false
	return new Date(day).toDateString() === start_date.value.toDateString()
}

const isEndDate = (day: string | number | Date) => {
	if(!validateDate(end_date.value))return false
	return new Date(day).toDateString() === end_date.value.toDateString()
}

const getCurrentCell = (rowNo: number, colNo: number) => {
	return (rowNo - 1) * numberOfColumns + colNo
}

const isInDateRange = (day: string | number | Date) => {
	if(!validateDate(start_date.value))return false
	const this_date = new Date(day)

	//the end is either the selected end date or wherever the user is hovering
	let temp_end_date = end_date.value != null ? end_date.value : new Date(hoveredDate.value)

	return this_date.getTime() > start_date.value.getTime() && this_date.getTime() < temp_end_date.getTime()
}

const getCurrentDate = (rowNo: number, colNo: number) => {
	return currentDates.value[getCurrentCell(rowNo, colNo)]
}

const hoverDate = (currentIndex: number) => {
	hoveredDate.value = new Date(currentDates.value[currentIndex])
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

const enterDate = event => {
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

	if (props.selectRange) {
		if (start_date.value == null || end_date.value != null) {
			start_date.value = date.value
			end_date.value = null
		} else if (selectedDate.value.getTime() < start_date.value.getTime()) {
			end_date.value = null
			start_date.value = date.value
		} else {
			end_date.value = date.value
		}
		startDateInput.value.value = parseDateToString(start_date.value)
		endDateInput.value.value = parseDateToString(end_date.value)
	}
	emitData()
}

const testDateOrder = ()=>{
	if(end_date.value.getTime()<start_date.value.getTime())[start_date.value, end_date.value] = [end_date.value, start_date.value]
}

const validateDate = date=>{
	return date instanceof Date && !isNaN(date.getTime())
}

const enterInputDate = () => {
	if(startDateInput.value.value==''){
		start_date.value = null
	}else{
		const start = new Date(startDateInput.value.value)
		start_date.value = validateDate(start)?start:null
	}

	if(endDateInput.value.value==''){
		end_date.value = null
	}else{
		const end = new Date(endDateInput.value.value)
		end_date.value = validateDate(end)?end:null
	}

	if(validateDate(start_date.value)){
		if(validateDate(end_date.value))testDateOrder()
		selectedDate.value = start_date.value
	}

	emitData()
}

const emitData = ()=>{
	emit('get-date', {start:props.selectRange?start_date.value:null, end:props.selectRange?end_date.value:null, selected:selectedDate.value})
}


/*******************
Hooks
*******************/

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

// setup keyboard navigation
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

// 				'keydown.enter': () => {}, // select this date
// 			},
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

defineExpose({ currentMonth, currentYear, selectedDate })

</script>

<style scoped>
/* @import url('@stonecrop/themes/default.css'); */
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
.adatepicker .date-input > input {
	width: 50%;
	padding: 2px;
}
</style>
