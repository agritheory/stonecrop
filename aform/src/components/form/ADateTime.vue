<template>
	<div class="adate_time">
		<div class="adate_time_fields">
			<input
				@paste="pasteInput"
				@input="validateInput"
				@keydown="getKeyInput($event, 'hours')"
				@blur="setHour"
				@keyup.enter="setHour"
				ref="hours-field"
				class="aform_input-field hours"
				maxLength="2"
				:value="getHour()" />
			<span class="colon">:</span>
			<input
				@input="validateInput"
				@keydown="getKeyInput($event, 'minutes')"
				@blur="setMinutes"
				@keyup.enter="setMinutes"
				ref="minutes-field"
				class="aform_input-field minutes"
				maxLength="2"
				:value="getMinutes()" />
			<span class="colon">:</span>
			<input
				@input="validateInput"
				@keydown="getKeyInput($event, 'seconds')"
				@blur="setSeconds"
				@keyup.enter="setSeconds"
				ref="seconds-field"
				class="aform_input-field seconds"
				maxLength="2"
				:value="getSeconds()" />
			<select class="aform-select meridiem-selector" ref="meridiem-selector" v-model="time.meridiem">
				<option value="AM">AM</option>
				<option value="PM">PM</option>
			</select>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, computed, useTemplateRef, defineProps, watch } from 'vue'

const meridiemSelector = useTemplateRef('meridiem-selector')

const props = defineProps({
	allowMilitaryTime: {
		type: Boolean,
		default: false,
	},
})

const time = reactive({
	hours: 12,
	minutes: 0,
	seconds: 0,
	meridiem: 'AM',
})

watch(
	() => time.hours,
	(oldVal, newVal) => {
		if ((oldVal == 11 && newVal == 12) || (oldVal == 12 && newVal == 11)) changeMeridiem()
	}
)

watch(time, () => {
	if (time.seconds > 59) {
		time.seconds = 0
		time.minutes++
	} else if (time.seconds < 0) {
		time.seconds = 59
		time.minutes--
	}
	//MINUTES
	if (time.minutes > 59) {
		time.minutes = 0
		time.hours++
	} else if (time.minutes < 0) {
		time.minutes = 59
		time.hours--
	}
	//HOURS
	if (time.hours > 12) {
		time.hours = 1
	} else if (time.hours < 1) {
		time.hours = 12
	}
})
const pasteInput = event => {
	let clipboardData, pastedData

	event.stopPropagation()
	event.preventDefault()

	clipboardData = event.clipboardData
	pastedData = clipboardData.getData('Text')

	pastedData = pastedData.replace(/[^0-9]/g, '')

	//Pad the pasted data with 0's depending on string length, to resemble format 00:00:00
	if (pastedData.length % 2 != 0) {
		//pad the start with a 0
		pastedData = '0' + pastedData
	}

	if (pastedData.length < 3) {
		// no minutes, pad 0's
		pastedData += '00'
	}
	if (pastedData.length < 5) {
		//no seconds, pad 0's
		pastedData += '00'
	}

	const time_units = pastedData.match(/(..?)/g)

	time.seconds = Number(time_units[2])
	time.minutes = Number(time_units[1])
	time.hours = Number(time_units[0])
	console.log(time.hours)

	meridiemSelector.value.focus()
}

const getKeyInput = (event, unit) => {
	if (!time.hasOwnProperty(unit)) return

	if (event.key == 'ArrowUp') {
		event.preventDefault()
		time[unit]++
	} else if (event.key == 'ArrowDown') {
		event.preventDefault()
		time[unit]--
	} else if (event.key == 'Enter') {
		event.preventDefault()
	}
}

// const getHour = computed(()=>{
//   console.log(time.hours)
//   return time.hours>9?String(time.hours):"0"+String(time.hours)
// })
const getHour = () => {
	console.log(time.hours)
	return time.hours > 9 ? String(time.hours) : '0' + String(time.hours)
}
const getMinutes = () => {
	return time.minutes > 9 ? String(time.minutes) : '0' + String(time.minutes)
}
const getSeconds = () => {
	return time.seconds > 9 ? String(time.seconds) : '0' + String(time.seconds)
}

const setHour = event => {
	time.hours = Number(event.target.value)
	if (time.hours >= 12) time.hours = 12
	else if (time.hours <= 1) time.hours = 1
}
const setMinutes = event => {
	let val = Number(event.target.value)
	if (val >= 59) {
		val = 59
	} else if (val <= 0) {
		val = 0
	}
	time.minutes = val
}
const setSeconds = event => {
	let val = Number(event.target.value)
	if (val >= 59) {
		val = 59
	} else if (val <= 0) {
		val = 0
	}
	time.seconds = val
}
const validateInput = event => {
	//make sure only numbers are entered
	event.target.value = event.target.value.replace(/[^0-9]/g, '')
}

const changeMeridiem = () => {
	time.meridiem = time.meridiem == 'PM' ? 'AM' : 'PM'
}
const formatTime = computed(() => {
	return time.hours + ':' + time.minutes + ':' + time.seconds
})

defineExpose({ time })
</script>

<style scoped>
.adate_time {
	width: 100%;
}
.adate_time_fields {
	display: flex;
	align-items: normal;
	max-width: 300px;
	gap: 5px;
}
.adate_time_fields > input {
	width: 40px;
	padding: 2px;
	text-align: center;
	display: inline-block;
}
.meridiem-selection {
	cursor: pointer;
	display: inline-block;
	flex-basis: 0;
	padding: 5px;
	user-select: none;
}
.adate_time_segment {
	display: flex;
	flex-direction: column;
	width: 40px;
}
.colon {
	display: flex;
	align-items: center;
}
.aform_form-btn {
	cursor: pointer;
}
.aform-select {
	border-radius: 0px;
	border: 2px solid rgb(118, 118, 118);
	outline: 1px solid var(--sc-input-border-color);
	outline-offset: -1px;
	font-size: 1rem;
	padding: 0.5rem;
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
</style>
