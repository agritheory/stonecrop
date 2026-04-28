<!-- This serves as a wrapper component for ADatePicker and ADateTime in one component -->

<template>
	<div class="adate-selection">
		<ADatePicker v-if="showDate" :select-range="selectRange" @get-date="handleDate" />

		<!-- Start time -->
		<ADateTime
			v-if="showTime"
			:allow-military-time="allowMilitaryTime"
			:default-hours="defaultHours"
			:default-minutes="defaultMinutes"
			:default-seconds="defaultSeconds"
			:default-meridiem="defaultMeridiem"
			:use-seconds="useSeconds"
			@get-time="handleStartTime" />

		<!-- End time: only when range + time + showEndTime are all true -->
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
	'get-date': [{ selected: Date }]
	'get-time': [{ hours: number; minutes: number; seconds: number; meridiem: string }]
	'get-range': [{ start: Date; end: Date }]
}>()

provide('select-range', selectRange)

// Internal state: calendar dates and time offsets (ms since midnight)
const pickerStart = ref<Date | null>(null)
const pickerEnd = ref<Date | null>(null)
const startTimeMs = ref<number>(0)
const endTimeMs = ref<number>(0)

// Merge a calendar date with a millisecond time offset
const mergeDateTime = (date: Date, timeMs: number): Date => {
	const d = new Date(date)
	d.setHours(0, 0, 0, 0)
	return new Date(d.getTime() + timeMs)
}

// Convert ADateTime emit payload → ms since midnight
const timePayloadToMs = (payload: {
	hours: number
	minutes: number
	seconds: number
	meridiem: string
	militaryTime?: number
}): number => {
	const h = payload.militaryTime ?? payload.hours
	return (h * 3600 + payload.minutes * 60 + payload.seconds) * 1000
}

const tryEmitRange = () => {
	if (!selectRange || !showTime || !showEndTime) return
	if (!pickerStart.value || !pickerEnd.value) return
	emit('get-range', {
		start: mergeDateTime(pickerStart.value, startTimeMs.value),
		end: mergeDateTime(pickerEnd.value, endTimeMs.value),
	})
}

const handleDate = (data: { start: Date | null; end: Date | null; selected: Date }) => {
	// Forward the full payload unchanged — matches original contract
	emit('get-date', { selected: data.selected })

	if (selectRange) {
		pickerStart.value = data.start ?? data.selected
		pickerEnd.value = data.end ?? null
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
