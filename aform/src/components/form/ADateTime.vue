<template>
	<div class="adate_time">
		<div class="adate_time_fields">
			<input
				v-model="timeData.hours"
				type="text"
				inputmode="numeric"
				@paste="pasteInput($event, true)"
				@focus="focusInput"
				@blur="confirmTime"
				@keydown.enter.prevent="confirmTime"
				@keydown.up.prevent="tick('hours')"
				@keydown.down.prevent="tick('hours', -1)" />
			<span class="colon">:</span>
			<input
				v-model="timeData.minutes"
				type="text"
				inputmode="numeric"
				@paste="pasteInput"
				@focus="focusInput"
				@blur="confirmTime"
				@keydown.enter.prevent="confirmTime"
				@keydown.up.prevent="tick('minutes')"
				@keydown.down.prevent="tick('minutes', -1)" />
			<span v-if="useSeconds" class="colon">:</span>
			<input
				v-if="useSeconds"
				v-model="timeData.seconds"
				type="text"
				inputmode="numeric"
				@paste="pasteInput"
				@focus="focusInput"
				@blur="confirmTime"
				@keydown.enter.prevent="confirmTime"
				@keydown.up.prevent="tick('seconds')"
				@keydown.down.prevent="tick('seconds', -1)" />
			<select
				v-if="!allowMilitaryTime"
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

const {
	allowMilitaryTime = false,
	defaultHours = 12,
	defaultMinutes = 0,
	defaultSeconds = 0,
	defaultMeridiem = 'AM',
	useSeconds = true,
} = defineProps<{
	allowMilitaryTime?: boolean
	defaultHours?: number
	defaultMinutes?: number
	defaultSeconds?: number
	defaultMeridiem?: string
	useSeconds?: boolean
}>()

const emit = defineEmits<{
	'get-time': [{ hours: number; minutes: number; seconds: number; meridiem: string; militaryTime: number }]
}>()

const meridiemSelector = useTemplateRef<HTMLSelectElement>('meridiem-selector')

const timeData = reactive({
	hours: String(defaultHours).padStart(2, '0'),
	minutes: String(defaultMinutes).padStart(2, '0'),
	seconds: String(defaultSeconds).padStart(2, '0'),
})

const meridiem = ref(defaultMeridiem == 'AM' ? 'AM' : 'PM')

onMounted(() => {
	emitTime()
})

const confirmTime = () => {
	const maxHours = allowMilitaryTime ? 23 : 12
	const minHours = allowMilitaryTime ? 0 : 1
	let hours = Number(timeData.hours)
	let minutes = Number(timeData.minutes)
	let seconds = Number(timeData.seconds)

	if (isNaN(hours) || timeData.hours === '' || hours > maxHours) hours = maxHours
	if (!allowMilitaryTime && hours < minHours) hours = minHours
	if (isNaN(minutes) || timeData.minutes === '' || minutes > 59) minutes = 59
	if (isNaN(seconds) || timeData.seconds === '' || seconds > 59) seconds = 59

	timeData.hours = String(hours).padStart(2, '0')
	timeData.minutes = String(minutes).padStart(2, '0')
	timeData.seconds = String(seconds).padStart(2, '0')

	emitTime()
}

const emitTime = () => {
	const hours = Number(timeData.hours)
	const minutes = Number(timeData.minutes)
	const seconds = Number(timeData.seconds)
	emit('get-time', {
		hours,
		minutes,
		seconds,
		meridiem: meridiem.value,
		militaryTime: allowMilitaryTime ? hours : meridiem.value === 'PM' ? (hours === 12 ? 12 : hours + 12) : hours % 12,
	})
}

const focusInput = (event: FocusEvent) => {
	const target = event.target
	if (target instanceof HTMLInputElement) {
		target.select()
	}
}

const tick = (target: 'hours' | 'minutes' | 'seconds', amount = 1) => {
	const maxHours = allowMilitaryTime ? 23 : 12
	const minHours = allowMilitaryTime ? 0 : 1

	if (target == 'hours') {
		const oldHours = Number(timeData.hours)
		timeData.hours = String(oldHours + amount)
		if ((oldHours == 11 && Number(timeData.hours) == 12) || (oldHours == 12 && Number(timeData.hours) == 11)) {
			changeMeridiem()
		}
	} else if (target == 'minutes') {
		timeData.minutes = String(Number(timeData.minutes) + amount)
	} else if (target == 'seconds') {
		timeData.seconds = String(Number(timeData.seconds) + amount)
	}

	const prevHours = Number(timeData.hours)

	if (Number(timeData.seconds) < 0) timeData.minutes = String(Number(timeData.minutes) - 1)
	else if (Number(timeData.seconds) > 59) timeData.minutes = String(Number(timeData.minutes) + 1)

	if (Number(timeData.minutes) < 0) timeData.hours = String(prevHours - 1)
	else if (Number(timeData.minutes) > 59) timeData.hours = String(prevHours + 1)

	const newRawHours = Number(timeData.hours)
	if (!allowMilitaryTime && newRawHours !== prevHours) {
		if ((prevHours === 11 && newRawHours === 12) || (prevHours === 12 && newRawHours === 11)) {
			changeMeridiem()
		}
	}

	timeData.hours = String(formatTime(Number(timeData.hours), minHours, maxHours)).padStart(2, '0')
	timeData.minutes = String(formatTime(Number(timeData.minutes), 0, 59)).padStart(2, '0')
	timeData.seconds = String(formatTime(Number(timeData.seconds), 0, 59)).padStart(2, '0')
}

watch(
	() => timeData.hours,
	(newVal, oldVal) => {
		timeData.hours = Number(newVal) > 99 ? oldVal : newVal
	}
)
watch(
	() => timeData.minutes,
	(newVal, oldVal) => {
		timeData.minutes = Number(newVal) > 99 ? oldVal : newVal
	}
)
watch(
	() => timeData.seconds,
	(newVal, oldVal) => {
		timeData.seconds = Number(newVal) > 99 ? oldVal : newVal
	}
)

const formatTime = (target: number, min: number, max: number): number => {
	if (target > max) return min
	else if (target < min) return max
	return target
}

const changeMeridiem = () => {
	meridiem.value = meridiem.value == 'PM' ? 'AM' : 'PM'
	emitTime()
}

const pasteInput = (event: ClipboardEvent, pasteAllFields = false) => {
	event.stopPropagation()
	event.preventDefault()

	const clipboardData = event.clipboardData
	if (!clipboardData) return
	let pastedData: string = clipboardData.getData('Text')

	pastedData = pastedData.replace(/[^0-9]/g, '')

	if (pasteAllFields) {
		if (pastedData.length % 2 != 0) pastedData = '0' + pastedData
		if (pastedData.length < 3) pastedData += '00'
		if (pastedData.length < 5) pastedData += '00'

		const timeUnits = pastedData.match(/(..?)/g)
		if (!timeUnits || timeUnits.length < 3) return

		timeData.seconds = timeUnits[2]
		timeData.minutes = timeUnits[1]
		timeData.hours = timeUnits[0]
		confirmTime()
		if (!allowMilitaryTime) meridiemSelector.value?.focus()
	} else {
		if (pastedData.length > 2) pastedData = pastedData.slice(0, 2)
		const target = event.target
		if (target instanceof HTMLInputElement) {
			target.value = pastedData
			target.dispatchEvent(new Event('input'))
		}
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
</style>
