<template>
	<div class="adate_time">
		<div class="adate_time_fields">
			<input
				v-model.number="time_data.hours"
				type="number"
				@paste="pasteInput($event, true)"
				@focus="focusInput"
				@blur="confirmTime"
				@keydown.enter.prevent="confirmTime"
				@keydown.up.prevent="tick('hours')"
				@keydown.down.prevent="tick('hours', -1)" />
			<span class="colon">:</span>
			<input
				v-model.number="time_data.minutes"
				type="number"
				@paste="pasteInput"
				@focus="focusInput"
				@blur="confirmTime"
				@keydown.enter.prevent="confirmTime"
				@keydown.up.prevent="tick('minutes')"
				@keydown.down.prevent="tick('minutes', -1)" />
			<span v-if="props.useSeconds" class="colon">:</span>
			<input
				v-if="props.useSeconds"
				v-model.number="time_data.seconds"
				type="number"
				@paste="pasteInput"
				@focus="focusInput"
				@blur="confirmTime"
				@keydown.enter.prevent="confirmTime"
				@keydown.up.prevent="tick('seconds')"
				@keydown.down.prevent="tick('seconds', -1)" />
			<select
				v-if="!props.allowMilitaryTime"
				ref="meridiem-selector"
				v-model="meridiem"
				class="aform-select meridiem-selector"
				@change="confirmTime">
				<option value="AM">AM</option>
				<option value="PM">PM</option>
			</select>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, useTemplateRef, watch, onMounted } from 'vue'

/* Props */
const props = defineProps({
	allowMilitaryTime: {
		type: Boolean,
		default: false,
	},
	defaultHours: {
		type: Number,
		default: 12,
	},
	defaultMinutes: {
		type: Number,
		default: 0,
	},
	defaultSeconds: {
		type: Number,
		default: 0,
	},
	defaultMeridiem: {
		type: String,
		default: 'AM',
	},
	useSeconds: {
		type: Boolean,
		default: true,
	},
})

/* Emits */
const emit = defineEmits<{
	'get-time': [{ hours: number; minutes: number; seconds: number; meridiem: string }]
}>()

/* Template Refs */
const meridiemSelector = useTemplateRef('meridiem-selector')

/* Actual time values held for each time unit */
const time_data = reactive({
	hours: props.defaultHours,
	minutes: props.defaultMinutes,
	seconds: props.defaultSeconds,
})

const meridiem = ref(props.defaultMeridiem == 'AM' ? 'AM' : 'PM')

onMounted(() => {
	//set all fields to default values
	confirmTime()
})

/* Sets the time_data to match the input fields, called on blur or Enter, can set sendEmit to false to prevent emiting the time data */
const confirmTime = (sendEmit = true) => {
	const maxHours = props.allowMilitaryTime ? 23 : 12
	if (time_data.hours > maxHours || time_data.hours == '') time_data.hours = maxHours
	if (time_data.minutes > 59 || time_data.minutes == '') time_data.minutes = 0
	if (time_data.seconds > 59 || time_data.seconds == '') time_data.seconds = 0
	padString()
	if (sendEmit) emitTime()
}

/* on emit, format the time_data to a generic object */
const emitTime = () => {
	emit('get-time', {
		hours: time_data.hours,
		minutes: time_data.minutes,
		seconds: time_data.seconds,
		meridiem: meridiem.value,
		militaryTime: meridiem.value == 'PM' && time_data.hours < 12 ? time_data.hours + 12 : time_data.hours,
	})
}

/* pad the time strings with leading 0's if they are less than 10 */
const padString = () => {
	for (let str in time_data) {
		time_data[str] = String(time_data[str]).padStart(2, '0')
	}
}

const focusInput = event => {
	event.target.select()
}

const tick = (target, amount = 1) => {
	const maxHours = props.allowMilitaryTime ? 23 : 12
	const minHours = props.allowMilitaryTime ? 0 : 1

	if (target == 'hours') time_data.hours = Number(time_data.hours) + amount
	else if (target == 'minutes') time_data.minutes = Number(time_data.minutes) + amount
	else if (target == 'seconds') time_data.seconds = Number(time_data.seconds) + amount

	if (time_data.seconds < 0) time_data.minutes--
	else if (time_data.seconds > 59) time_data.minutes++
	if (time_data.minutes < 0) time_data.hours--
	else if (time_data.minutes > 59) time_data.hours++

	time_data.hours = formatTime(time_data.hours, minHours, maxHours)
	time_data.minutes = formatTime(time_data.minutes, 0, 59)
	time_data.seconds = formatTime(time_data.seconds, 0, 59)

	padString()
}

/* Watchers */
watch(
	() => time_data.hours,
	(newVal, oldVal) => {
		if ((oldVal == 11 && newVal == 12) || (oldVal == 12 && newVal == 11)) changeMeridiem()
		time_data.hours = newVal > 99 ? oldVal : newVal
	}
)
watch(
	() => time_data.minutes,
	(newVal, oldVal) => {
		time_data.minutes = newVal > 99 ? oldVal : newVal
	}
)
watch(
	() => time_data.seconds,
	(newVal, oldVal) => {
		time_data.seconds = newVal > 99 ? oldVal : newVal
	}
)

const formatTime = (target, min, max) => {
	if (target > max) return min
	else if (target < min) return max
	return target
}

const changeMeridiem = () => {
	meridiem.value = meridiem.value == 'PM' ? 'AM' : 'PM'
	emitTime()
}

const pasteInput = (event, pasteAllFields = false) => {
	//pasteAllFields will apply the paste effect to all input fields, should only be used on the first field/hour

	let clipboardData, pastedData

	event.stopPropagation()
	event.preventDefault()

	clipboardData = event.clipboardData
	pastedData = clipboardData.getData('Text')

	pastedData = pastedData.replace(/[^0-9]/g, '')

	if (pasteAllFields) {
		//Pad the pasted data with 0's depending on string length, to resemble format 00:00:00, hours, minutes, seconds
		if (pastedData.length % 2 != 0) pastedData = '0' + pastedData
		if (pastedData.length < 3) pastedData += '00'
		if (pastedData.length < 5) pastedData += '00'

		const time_units = pastedData.match(/(..?)/g)

		time_data.seconds = Number(time_units[2])
		time_data.minutes = Number(time_units[1])
		time_data.hours = Number(time_units[0])
		confirmTime()
		if (!props.allowMilitaryTime) meridiemSelector.value.focus()
	} else {
		if (pastedData.length > 2) pastedData = pastedData.slice(0, 2)
		event.target.value = pastedData

		//manually call the input event to force v-model update
		event.target.dispatchEvent(new Event('input'))
	}
}
</script>

<style scoped>
.adate_time {
	width: auto;
	padding: 10px;
	box-sizing: border-box;
	font-size: 1rem;
	background: var(--sc-gray-10);
}
.adate_time_fields {
	display: flex;
	align-items: stretch;
	gap: 5px;
	justify-content: flex-start;
}
.adate_time_fields > input {
	min-width: 30px;
	padding: 2px;
	text-align: center;
	display: inline-block;
	flex-basis: 0;
}
.meridiem-selector {
	cursor: pointer;
	display: inline-block;
	flex-basis: 0;
	padding: 5px;
	user-select: none;
}
.meridiem-selector:focus {
	outline: 2px solid black;
	outline-offset: -2px;
}
.adate_time_segment {
	display: flex;
	flex-direction: column;
	width: 40px;
}
.colon {
	display: flex;
	align-items: normal;
}
.aform_form-btn {
	cursor: pointer;
}
.aform-select {
	border-radius: 0px;
	border: 1px solid rgb(118, 118, 118);
	font-size: 1rem;
	padding: 0rem;
	margin: 0;
	border-radius: 0;
	box-sizing: border-box;
	min-height: auto;
	position: relative;
	color: var(--sc-cell-text-color);
}
.meridiem-selector {
	margin-left: 6px;
}
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
input[type='number'] {
	-moz-appearance: textfield;
}
</style>
