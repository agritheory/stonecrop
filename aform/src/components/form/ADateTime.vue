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

const currentDateTime = ref<Date>(modelValue.value ? new Date(modelValue.value) : new Date())

const showPicker = ref(false)
const pickerRef = ref(null)
onClickOutside(pickerRef, () => (showPicker.value = false))

const openPicker = () => {
	if (mode !== 'read') showPicker.value = true
}

const displayValue = computed(() => {
	if (!modelValue.value) return ''
	return currentDateTime.value.toLocaleString()
})

const datetimeDisplay = computed(() => displayValue.value)

const pickerDefaults = computed(() => {
	const d = currentDateTime.value
	const hours24 = d.getHours()
	const meridiem = hours24 >= 12 ? 'PM' : 'AM'
	const hours12 = hours24 % 12 || 12
	return {
		hours: allowMilitaryTime ? hours24 : hours12,
		minutes: d.getMinutes(),
		seconds: d.getSeconds(),
		meridiem,
	}
})

const emitModel = () => {
	modelValue.value = currentDateTime.value.toISOString()
}

const handleDate = (data: { selected: Date }) => {
	const next = new Date(currentDateTime.value)
	next.setFullYear(data.selected.getFullYear(), data.selected.getMonth(), data.selected.getDate())
	currentDateTime.value = next
	emitModel()
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

	const next = new Date(currentDateTime.value)
	const hours = data.militaryTime ?? data.hours
	next.setHours(hours, data.minutes, useSeconds ? data.seconds : 0, 0)
	currentDateTime.value = next
	emitModel()
	// Deliberately does NOT close the picker. `get-time` is the widget's current value, not a
	// commit — it fires on every blur, arrow key and meridiem change — so closing here shut the
	// picker as soon as the user tabbed out of the hours field. Dismissal is the click-outside
	// handler above; closing on `get-date` instead would strand the time half of a datetime.
}

watch(
	() => modelValue.value,
	newValue => {
		if (newValue) {
			currentDateTime.value = new Date(newValue)
		}
	}
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
