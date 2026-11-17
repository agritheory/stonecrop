<template>
	<div class="adate_time" :class="{ 'aform_form-element': label }">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayValue }}</span>
		</template>
		<div v-else class="adate_time_fields">
			<input
				:id="uuid"
				v-model="timeData.hours"
				type="text"
				inputmode="numeric"
				:disabled="mode === 'read'"
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
				:disabled="mode === 'read'"
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
				:disabled="mode === 'read'"
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
				:disabled="mode === 'read'"
				@change="confirmTime">
				<option value="AM">AM</option>
				<option value="PM">PM</option>
			</select>
		</div>
		<label v-if="label" class="aform_field-label" :for="mode === 'display' ? undefined : uuid">{{ label }}</label>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, useTemplateRef, watch, onMounted } from 'vue'

const {
	allowMilitaryTime = false,
	defaultHours = 12,
	defaultMinutes = 0,
	defaultSeconds = 0,
	defaultMeridiem = 'AM',
	useSeconds = true,
	label,
	mode = 'edit',
	uuid,
	'onUpdate:modelValue': updateListener,
} = defineProps<{
	allowMilitaryTime?: boolean
	defaultHours?: number
	defaultMinutes?: number
	defaultSeconds?: number
	defaultMeridiem?: string
	useSeconds?: boolean
	/** The field's label, shown when the widget is a form field */
	label?: string
	mode?: 'edit' | 'read' | 'display' | string
	/** Ties the label to the hours input */
	uuid?: string
	/** The caller's `update:modelValue` listener. With one, the widget holds the caller's time, empty included. */
	'onUpdate:modelValue'?: (value: string | null) => void
}>()

// Whether the widget holds a caller's time, as a form field's does. A bound widget shows an empty time
// as empty boxes and writes nothing until someone types; an unbound one, inside ADateSelection, starts
// at its `default*` time as it always has. Read from the declared listener, never from a value arriving.
const bound = computed(() => Boolean(updateListener))

// The time a form field holds, as a time of day: `HH:MM:SS`, or `HH:MM` without seconds. `HH:MM`,
// `HH:MM:SS` and Postgres' `HH:MM:SS.ffffff` are all read. Written only on a user's edit that changes
// the time, so mounting the widget, or leaving it unchanged, never marks the record as edited.
const modelValue = defineModel<string | null>()

// `get-time` carries the widget's CURRENT VALUE, not a commit: it fires once as the widget
// mounts and again on every blur, Enter, arrow key and meridiem change — five times during one
// ordinary edit. `source` is what lets a parent tell the start-up announcement apart from a real
// user edit; without it a parent has nothing to key on and must guess from the value alone.
const emit = defineEmits<{
	'get-time': [
		{
			hours: number
			minutes: number
			seconds: number
			meridiem: string
			militaryTime: number
			source: 'init' | 'user'
		},
	]
}>()

const meridiemSelector = useTemplateRef<HTMLSelectElement>('meridiem-selector')

const timeData = reactive({
	hours: String(defaultHours).padStart(2, '0'),
	minutes: String(defaultMinutes).padStart(2, '0'),
	seconds: String(defaultSeconds).padStart(2, '0'),
})

const meridiem = ref(defaultMeridiem == 'AM' ? 'AM' : 'PM')

const parseTime = (value: unknown): { hours: number; minutes: number; seconds: number } | undefined => {
	if (typeof value !== 'string') return undefined
	const match = /^\s*(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(value)
	if (!match) return undefined
	const hours = Number(match[1])
	const minutes = Number(match[2])
	const seconds = Number(match[3] ?? 0)
	if (hours > 23 || minutes > 59 || seconds > 59) return undefined
	return { hours, minutes, seconds }
}

const pad = (n: number) => String(n).padStart(2, '0')

// Shows the record's time in the widget's own clock.
const showTime = (time: { hours: number; minutes: number; seconds: number }) => {
	if (allowMilitaryTime) {
		timeData.hours = pad(time.hours)
	} else {
		meridiem.value = time.hours >= 12 ? 'PM' : 'AM'
		timeData.hours = pad(time.hours % 12 === 0 ? 12 : time.hours % 12)
	}
	timeData.minutes = pad(time.minutes)
	timeData.seconds = pad(time.seconds)
}

// A bound widget with no time to show, its record's emptied or another record's come in without one.
const clearTime = () => {
	timeData.hours = ''
	timeData.minutes = ''
	timeData.seconds = ''
	meridiem.value = 'AM'
}

const isEmpty = () => timeData.hours === '' && timeData.minutes === '' && timeData.seconds === ''

watch(
	modelValue,
	value => {
		const time = parseTime(value)
		if (time) showTime(time)
		else if (bound.value) clearTime()
	},
	{ immediate: true }
)

const displayValue = computed(() => {
	if (!parseTime(modelValue.value)) return bound.value ? '' : (modelValue.value ?? '')
	const time = [timeData.hours, timeData.minutes, ...(useSeconds ? [timeData.seconds] : [])].join(':')
	return allowMilitaryTime ? time : `${time} ${meridiem.value}`
})

const writeModel = (militaryTime: number) => {
	const minutes = Number(timeData.minutes)
	const seconds = useSeconds ? Number(timeData.seconds) : 0
	const held = parseTime(modelValue.value)
	if (held && held.hours === militaryTime && held.minutes === minutes && (!useSeconds || held.seconds === seconds)) {
		return
	}
	const time = [pad(militaryTime), pad(minutes), ...(useSeconds ? [pad(seconds)] : [])].join(':')
	modelValue.value = time
}

onMounted(() => {
	emitTime('init')
})

const confirmTime = () => {
	// Leaving a bound widget's empty boxes is not an edit: there is no time to write.
	if (bound.value && isEmpty()) return

	const maxHours = allowMilitaryTime ? 23 : 12
	const minHours = allowMilitaryTime ? 0 : 1
	// A bound widget's box left empty beside one that was typed in is the start of its unit: 12 AM, :00.
	// An unbound widget's empty box is the end of its unit, as it always has been.
	if (bound.value) {
		if (timeData.hours === '') timeData.hours = allowMilitaryTime ? '00' : '12'
		if (timeData.minutes === '') timeData.minutes = '00'
		if (timeData.seconds === '') timeData.seconds = '00'
	}
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

	emitTime('user')
}

const emitTime = (source: 'init' | 'user') => {
	const hours = Number(timeData.hours)
	const minutes = Number(timeData.minutes)
	const seconds = Number(timeData.seconds)
	const militaryTime = allowMilitaryTime
		? hours
		: meridiem.value === 'PM'
			? hours === 12
				? 12
				: hours + 12
			: hours % 12
	emit('get-time', {
		hours,
		minutes,
		seconds,
		source,
		meridiem: meridiem.value,
		militaryTime,
	})
	if (source === 'user') writeModel(militaryTime)
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
	const startMeridiem = meridiem.value

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

	// Crossing noon or midnight is a new time of day, reported only once every box has wrapped:
	// reported as the meridiem flips, it would carry 11:60 as 12:60.
	if (meridiem.value !== startMeridiem) emitTime('user')
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
	background: var(--sc-input-field-background);
}
/* A form field's label straddles its boxes' top border, as every field's label straddles its input's:
   the boxes start at the label's offset, not below the widget's own padding. */
.adate_time.aform_form-element {
	padding: var(--sc-form-label-offset) 0 0;
	background: none;
}
.adate_time_fields {
	display: flex;
	align-items: stretch;
	gap: 5px;
	justify-content: flex-start;
}
.adate_time_fields > input {
	width: 2.5rem;
	min-width: 2.5rem;
	flex: 0 0 auto;
	padding: 0.25rem 0.15rem;
	text-align: center;
	background: var(--sc-input-field-background);
	border: 1px solid var(--sc-input-border-color);
	color: var(--sc-cell-text-color);
	border-radius: var(--sc-border-radius);
}
.adate_time_fields > input:focus,
.meridiem-selector:focus {
	outline: 1px solid var(--sc-input-active-border-color);
	outline-offset: -1px;
}
.meridiem-selector {
	flex: 0 0 auto;
	width: auto;
	min-width: 5.5rem;
	margin-left: 6px;
	padding: 0.25rem 1.75rem 0.25rem 0.5rem;
	cursor: pointer;
	user-select: none;
	background: var(--sc-input-field-background);
	border: 1px solid var(--sc-input-border-color);
	color: var(--sc-cell-text-color);
	border-radius: var(--sc-border-radius);
	font-size: 1rem;
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
	box-sizing: border-box;
	min-height: auto;
}
</style>
