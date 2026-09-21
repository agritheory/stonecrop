<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayValue }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>

		<template v-else>
			<input
				:id="uuid"
				class="aform_input-field"
				type="text"
				:value="datetimeDisplay"
				placeholder="Select date and time"
				:disabled="mode === 'read'"
				readonly
				@click="openPicker" />
			<label class="aform_field-label" :for="uuid">{{ label }}</label>

			<p v-show="errorText" class="aform_error" v-html="errorText"></p>

			<ADateSelection
				v-if="showPicker"
				ref="pickerRef"
				class="adatetime-picker"
				:select-range="false"
				:show-date="true"
				:show-time="true"
				:default-date="currentDateTime?.toPlainDate().toString()"
				:default-hours="pickerDefaults.hours"
				:default-minutes="pickerDefaults.minutes"
				:default-seconds="pickerDefaults.seconds"
				:default-meridiem="pickerDefaults.meridiem"
				:allow-military-time="allowMilitaryTime"
				:use-seconds="useSeconds"
				@get-date="handleDate"
				@get-time="handleTime" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { fromISODate } from '@stonecrop/utilities'
import { Temporal } from 'temporal-polyfill'
import ADateSelection from './ADateSelection.vue'
import type { ComponentProps } from '../../types'

const {
	label = 'Date & Time',
	mode,
	uuid,
	errors,
	validation = { errorMessage: '' },
	allowMilitaryTime = false,
	useSeconds = true,
} = defineProps<
	ComponentProps & {
		allowMilitaryTime?: boolean
		useSeconds?: boolean
	}
>()

const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))

const modelValue = defineModel<string | Date>()

/** Now, cut down to the smallest unit the picker shows, so a pick that leaves the time alone saves the time shown. */
const now = () =>
	Temporal.Now.zonedDateTimeISO().round({ smallestUnit: useSeconds ? 'second' : 'minute', roundingMode: 'trunc' })

/** The field's moment on the user's clock, or null when the value names no moment. */
const readMoment = (value: string | Date): Temporal.ZonedDateTime | null => {
	const epochMilliseconds = new Date(value).getTime()
	if (isNaN(epochMilliseconds)) return null
	return Temporal.Instant.fromEpochMilliseconds(epochMilliseconds).toZonedDateTimeISO(Temporal.Now.timeZoneId())
}

/** What the field holds for a value: its moment, or now for an empty field, where the picker starts. */
const heldMoment = (value: string | Date | null | undefined) => (value ? readMoment(value) : now())

const currentDateTime = ref<Temporal.ZonedDateTime | null>(heldMoment(modelValue.value))

const showPicker = ref(false)
const pickerRef = ref(null)
onClickOutside(pickerRef, () => (showPicker.value = false))

const openPicker = () => {
	if (mode !== 'read') showPicker.value = true
}

// A date and time as `toLocaleString` writes one by default, less the seconds.
const WITHOUT_SECONDS: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
}

const displayValue = computed(() => {
	if (!modelValue.value) return ''
	// The wall-clock time alone: a `ZonedDateTime`'s own `toLocaleString` also names the zone.
	const format = useSeconds ? undefined : WITHOUT_SECONDS
	return currentDateTime.value?.toPlainDateTime().toLocaleString(undefined, format) ?? 'Invalid Date'
})

const datetimeDisplay = computed(() => displayValue.value)

const pickerDefaults = computed(() => {
	const d = currentDateTime.value ?? now()
	const hours24 = d.hour
	const meridiem = hours24 >= 12 ? 'PM' : 'AM'
	const hours12 = hours24 % 12 || 12
	return {
		hours: allowMilitaryTime ? hours24 : hours12,
		minutes: d.minute,
		seconds: d.second,
		meridiem,
	}
})

const setMoment = (moment: Temporal.ZonedDateTime) => {
	currentDateTime.value = moment
	modelValue.value = moment.toInstant().toString({ fractionalSecondDigits: 3 })
}

const handleDate = (data: { selected: string }) => {
	const day = fromISODate(data.selected)
	if (!day) return
	setMoment((currentDateTime.value ?? now()).with({ year: day.year, month: day.month, day: day.day }))
}

const handleTime = (data: {
	hours: number
	minutes: number
	seconds: number
	meridiem: string
	militaryTime?: number
	source?: 'init' | 'user'
}) => {
	// The widget announces its own starting value as it mounts, and those defaults come from
	// `pickerDefaults` — i.e. straight back out of this component. Writing that echo to the model
	// meant one click on an empty field silently filled it with the current date and time.
	if (data.source === 'init') return

	const hours = data.militaryTime ?? data.hours
	setMoment(
		(currentDateTime.value ?? now()).with({
			hour: hours,
			minute: data.minutes,
			second: useSeconds ? data.seconds : 0,
			millisecond: 0,
			microsecond: 0,
			nanosecond: 0,
		})
	)
	// Deliberately does NOT close the picker. `get-time` is the widget's current value, not a
	// commit — it fires on every blur, arrow key and meridiem change — so closing here shut the
	// picker as soon as the user tabbed out of the hours field. Dismissal is the click-outside
	// handler above; closing on `get-date` instead would strand the time half of a datetime.
}

// An empty value resets it too: skipping one kept the cleared moment, which the next pick wrote back.
watch(
	() => modelValue.value,
	newValue => (currentDateTime.value = heldMoment(newValue))
)
</script>

<style scoped>
.adatetime-picker {
	position: absolute;
	top: 100%;
	left: 0;
	z-index: 1000;
	margin-top: 0.25rem;
}
</style>
