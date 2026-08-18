<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayValue }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>

		<template v-else>
			<input
				:id="uuid"
				ref="range-input"
				class="aform_input-field"
				type="text"
				:value="inputText"
				placeholder="Select date range"
				:disabled="mode === 'read'"
				:required="required"
				@click="openPicker"
				@input="onInput"
				@blur="commitTypedRange"
				@keydown.enter.prevent="commitTypedRange"
				@keydown.escape="showPicker = false" />
			<label class="aform_field-label" :for="uuid">{{ label }}</label>

			<p v-show="errorText" class="aform_error" v-html="errorText"></p>

			<ADateSelection
				v-if="showPicker"
				ref="pickerRef"
				class="adaterange-picker"
				:selected="startDate"
				:start="startDate"
				:end="endDate"
				:select-range="true"
				:show-time="false"
				@get-date="handlePickerDate" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'
import ADateSelection from './ADateSelection.vue'
import type { ComponentProps } from '../../types'
import { parseCalendarDate, parseDateRange, toCalendarDateString } from '../../utils/calendar-date'

const fmt = (d: string) => {
	const parsed = parseCalendarDate(d)
	return parsed ? parsed.toLocaleDateString() : ''
}

const {
	label = 'Date Range',
	required,
	mode,
	uuid,
	errors,
	validation = { errorMessage: '' },
} = defineProps<ComponentProps>()

// Dynamic trigger errors take precedence over a static schema errorMessage; empty means the slot hides.
const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))

export interface DateRangeValue {
	start_date: string | null
	end_date: string | null
}

const modelValue = defineModel<DateRangeValue>({
	default: () => ({ start_date: null, end_date: null }),
})

const startDate = ref<Date | null>(parseCalendarDate(modelValue.value.start_date))
const endDate = ref<Date | null>(parseCalendarDate(modelValue.value.end_date))

const formatRange = (start: Date | null, end: Date | null) => {
	const startText = start ? start.toLocaleDateString() : ''
	const endText = end ? end.toLocaleDateString() : ''
	if (startText && endText) return `${startText} — ${endText}`
	if (startText) return `${startText} — ...`
	return ''
}

const inputText = ref(formatRange(startDate.value, endDate.value))

const showPicker = ref(false)
const pickerRef = ref(null)
const rangeInputRef = useTemplateRef<HTMLInputElement>('range-input')
onClickOutside(pickerRef, () => (showPicker.value = false), { ignore: [rangeInputRef] })

const openPicker = () => {
	if (mode !== 'read') showPicker.value = true
}

const onInput = (event: Event) => {
	const target = event.target
	if (target instanceof HTMLInputElement) inputText.value = target.value
}

const displayValue = computed(() => {
	const s = modelValue.value.start_date
	const e = modelValue.value.end_date
	if (!s && !e) return ''
	if (s && e) return `${fmt(s)} — ${fmt(e)}`
	if (s) return `From ${fmt(s)}`
	return `Until ${fmt(e!)}`
})

const ensureOrder = () => {
	const s = startDate.value
	const e = endDate.value
	if (s && e && e.getTime() < s.getTime()) {
		;[startDate.value, endDate.value] = [e, s]
	}
}

const toISODate = (d: Date | null): string | null => (d ? toCalendarDateString(d) : null)

const emitModel = () => {
	modelValue.value = {
		start_date: toISODate(startDate.value),
		end_date: toISODate(endDate.value),
	}
}

const commitTypedRange = () => {
	if (!inputText.value.trim()) {
		startDate.value = null
		endDate.value = null
		inputText.value = ''
		emitModel()
		return
	}
	const parsed = parseDateRange(inputText.value)
	if (!parsed) {
		inputText.value = formatRange(startDate.value, endDate.value)
		return
	}
	startDate.value = parsed.start
	endDate.value = parsed.end
	ensureOrder()
	emitModel()
	inputText.value = formatRange(startDate.value, endDate.value)
	if (parsed.start && parsed.end) showPicker.value = false
}

const handlePickerDate = (data: { selected: Date; start?: Date | null; end?: Date | null }) => {
	if (data.start) startDate.value = data.start
	if (data.end) {
		endDate.value = data.end
		ensureOrder()
		showPicker.value = false
	}
	emitModel()
	inputText.value = formatRange(startDate.value, endDate.value)
}

watch(
	() => modelValue.value,
	newVal => {
		startDate.value = parseCalendarDate(newVal.start_date)
		endDate.value = parseCalendarDate(newVal.end_date)
		inputText.value = formatRange(startDate.value, endDate.value)
	},
	{ deep: true }
)
</script>

<style scoped>
.adaterange-picker {
	position: absolute;
	top: 100%;
	left: 0;
	width: max-content;
	max-width: 100%;
	box-sizing: border-box;
	z-index: 100;
	margin-top: 0.25rem;
}
</style>
