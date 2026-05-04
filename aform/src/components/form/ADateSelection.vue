<!-- This serves as a wrapper component for ADatePicker and ADateTime in one component -->

<template>
	<div class="adate-selection">
		<ADatePicker v-if="showDate" :select-range="selectRange" @get-date="handleDate" />

		<ADateTime
			v-if="showTime"
			:allow-military-time="allowMilitaryTime"
			:default-hours="defaultHours"
			:default-minutes="defaultMinutes"
			:default-seconds="defaultSeconds"
			:default-meridiem="defaultMeridiem"
			:use-seconds="useSeconds"
			@get-time="handleStartTime" />

		<template v-if="selectRange && showTime && showEndTime">
			<div class="adate-selection__end-label">End time</div>
			<ADateTime
				:allow-military-time="allowMilitaryTime"
				:default-hours="defaultHours"
				:default-minutes="defaultMinutes"
				:default-seconds="defaultSeconds"
				:default-meridiem="defaultMeridiem"
				:use-seconds="useSeconds"
				@get-time="handleEndTime" />
		</template>

		<p v-if="!showTime && !showDate" class="empty">empty</p>
	</div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import ADatePicker from './ADatePicker.vue'
import ADateTime from './ADateTime.vue'

const {
	showDate = true,
	showTime = true,
	selectRange = true,
	showEndTime = false,
	allowMilitaryTime = false,
	defaultHours = 12,
	defaultMinutes = 0,
	defaultSeconds = 0,
	defaultMeridiem = 'AM',
	useSeconds = true,
} = defineProps<{
	showDate?: boolean
	showTime?: boolean
	selectRange?: boolean
	showEndTime?: boolean
	allowMilitaryTime?: boolean
	defaultHours?: number
	defaultMinutes?: number
	defaultSeconds?: number
	defaultMeridiem?: string
	useSeconds?: boolean
}>()

const emit = defineEmits<{
	'get-date': [{ selected: Date; start?: Date | null; end?: Date | null }]
	'get-time': [{ hours: number; minutes: number; seconds: number; meridiem: string }]
	'get-range': [{ start: Date; end: Date }]
}>()

provide('select-range', selectRange)

const today = new Date()
const pickerStart = ref<Date>(today)
const pickerEnd = ref<Date>(today)
const startTimeMs = ref<number>(0)
const endTimeMs = ref<number>(0)

const mergeDateTime = (date: Date, timeMs: number): Date => {
	const d = new Date(date)
	d.setHours(0, 0, 0, 0)
	return new Date(d.getTime() + timeMs)
}

const timePayloadToMs = (payload: {
	hours: number
	minutes: number
	seconds: number
	meridiem: string
	militaryTime?: number
}): number => {
	let h: number
	if (payload.militaryTime !== undefined) {
		h = payload.militaryTime
	} else {
		const hrs = payload.hours % 12
		h = payload.meridiem === 'PM' ? hrs + 12 : hrs
	}
	return (h * 3600 + payload.minutes * 60 + (payload.seconds ?? 0)) * 1000
}

const tryEmitRange = () => {
	if (!selectRange || !showTime || !showEndTime) return
	emit('get-range', {
		start: mergeDateTime(pickerStart.value, startTimeMs.value),
		end: mergeDateTime(pickerEnd.value, endTimeMs.value),
	})
}

const handleDate = (data: { start: Date | null; end: Date | null; selected: Date }) => {
	emit('get-date', data)
	if (selectRange) {
		pickerStart.value = data.start ?? data.selected
		pickerEnd.value = data.end ?? data.selected
		tryEmitRange()
	}
}

const handleStartTime = (data: {
	hours: number
	minutes: number
	seconds: number
	meridiem: string
	militaryTime?: number
}) => {
	startTimeMs.value = timePayloadToMs(data)
	if (showEndTime) {
		tryEmitRange()
	} else {
		emit('get-time', data)
	}
}

const handleEndTime = (data: {
	hours: number
	minutes: number
	seconds: number
	meridiem: string
	militaryTime?: number
}) => {
	endTimeMs.value = timePayloadToMs(data)
	tryEmitRange()
}
</script>

<style scoped>
.adate-selection {
	display: inline-block;
	border: 1px solid var(--sc-gray-80);
	padding: 10px;
	background: var(--sc-form-background);
}

.adate-selection__end-label {
	font-size: 0.8em;
	font-weight: bold;
	color: var(--sc-input-active-label-color, #555);
	margin-top: 8px;
	margin-bottom: 2px;
	padding-left: 2px;
}

.empty {
	color: #ccc;
	padding: 10px;
	text-align: center;
	border: 1px solid #ccc;
}
</style>
