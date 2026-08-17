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
				:value="rangeDisplay"
				placeholder="Select date range"
				:disabled="mode === 'read'"
				readonly
				@click="openPicker" />
			<label class="aform_field-label" :for="uuid">{{ label }}</label>

			<p v-show="errorText" class="aform_error" v-html="errorText"></p>

			<ADateSelection
				v-if="showPicker"
				ref="pickerRef"
				class="adaterange-picker"
				:select-range="true"
				:show-time="false"
				@get-date="handlePickerDate" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import ADateSelection from './ADateSelection.vue'
import type { ComponentProps } from '../../types'
import { parseCalendarDate, toCalendarDateString } from '../../utils/calendar-date'

const fmt = (d: string) => {
	const parsed = parseCalendarDate(d)
	return parsed ? parsed.toLocaleDateString() : ''
}

const { label = 'Date Range', mode, uuid, errors, validation = { errorMessage: '' } } = defineProps<ComponentProps>()

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

const showPicker = ref(false)
const pickerRef = ref(null)
onClickOutside(pickerRef, () => (showPicker.value = false))

const openPicker = () => {
	if (mode !== 'read') showPicker.value = true
}

const formatDate = (d: Date | null): string => {
	if (!d) return ''
	return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}

const rangeDisplay = computed(() => {
	const s = formatDate(startDate.value)
	const e = formatDate(endDate.value)
	if (s && e) return `${s} — ${e}`
	if (s) return `${s} — ...`
	return ''
})

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

const handlePickerDate = (data: { selected: Date; start?: Date | null; end?: Date | null }) => {
	if (data.start) startDate.value = data.start
	if (data.end) {
		endDate.value = data.end
		ensureOrder()
		showPicker.value = false
	}
	emitModel()
}

watch(
	() => modelValue.value,
	newVal => {
		startDate.value = parseCalendarDate(newVal.start_date)
		endDate.value = parseCalendarDate(newVal.end_date)
	},
	{ deep: true }
)
</script>

<style scoped>
.adaterange-picker {
	position: absolute;
	top: 100%;
	left: 0;
	z-index: 1000;
	margin-top: 0.25rem;
}
</style>
