<!-- This serves as a wrapper component for ADatePicker and ADateTimeInput in one component -->

<template>
	<div class="adate-selection">
		<ADatePicker
			v-if="showDate"
			:model-value="selectedDate"
			:select-range="selectRange"
			:range-start="start"
			:range-end="end"
			@get-date="handleDate" />

		<ADateTimeInput
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
			<ADateTimeInput
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
import { computed, provide, ref } from 'vue'
import ADatePicker from './ADatePicker.vue'
import ADateTimeInput from './ADateTimeInput.vue'
import { toDate, readTableDate, writeTableDate, type TableDateStore } from '../../utils/calendar-date'

const props = defineProps<{
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
	selected?: Date | string | number | null
	modelValue?: Date | string | number | null
	start?: Date | string | null
	end?: Date | string | null
	store?: TableDateStore
	colIndex?: number
	rowIndex?: number
}>()

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
	start = null,
	end = null,
} = props

const selectedDate = computed(() => {
	return (
		toDate(props.selected) ??
		toDate(props.modelValue) ??
		(props.store != null && props.colIndex != null && props.rowIndex != null
			? readTableDate(props.store, props.colIndex, props.rowIndex)
			: null)
	)
})

// `source` is forwarded from ADateTimeInput, which declares it on every `get-time`. It is
// optional here only because a host or a test may emit these events by hand, and doing so always
// means a user action — `'init'` is the one case that has to be marked, because it is the widget
// announcing its start value as it mounts rather than anything the user did.
const emit = defineEmits<{
	'get-date': [{ selected: Date; start?: Date | null; end?: Date | null }]
	'get-time': [{ hours: number; minutes: number; seconds: number; meridiem: string; source?: 'init' | 'user' }]
	'get-range': [{ start: Date; end: Date; source?: 'init' | 'user' }]
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

const tryEmitRange = (source: 'init' | 'user') => {
	if (!selectRange || !showTime || !showEndTime) return
	emit('get-range', {
		start: mergeDateTime(pickerStart.value, startTimeMs.value),
		end: mergeDateTime(pickerEnd.value, endTimeMs.value),
		source,
	})
}

const handleDate = (data: { start: Date | null; end: Date | null; selected: Date }) => {
	emit('get-date', data)
	if (selectRange) {
		pickerStart.value = data.start ?? data.selected
		pickerEnd.value = data.end ?? data.selected
		// Picking a day on the calendar is unambiguously a user action.
		tryEmitRange('user')
	}
	if (props.store != null && props.colIndex != null && props.rowIndex != null && data.selected) {
		writeTableDate(props.store, props.colIndex, props.rowIndex, data.selected)
	}
}

const handleStartTime = (data: {
	hours: number
	minutes: number
	seconds: number
	meridiem: string
	militaryTime?: number
	source?: 'init' | 'user'
}) => {
	startTimeMs.value = timePayloadToMs(data)
	if (showEndTime) {
		tryEmitRange(data.source ?? 'user')
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
	source?: 'init' | 'user'
}) => {
	endTimeMs.value = timePayloadToMs(data)
	tryEmitRange(data.source ?? 'user')
}
</script>

<style scoped>
.adate-selection {
	display: inline-block;
	width: max-content;
	max-width: 100%;
	box-sizing: border-box;
	border: 1px solid var(--sc-input-border-color);
	padding: 10px;
	background: var(--sc-input-field-background);
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
	color: var(--sc-input-label-color);
	padding: 10px;
	text-align: center;
	border: 1px solid var(--sc-input-border-color);
}
</style>
