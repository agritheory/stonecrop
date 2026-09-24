<template>
	<div class="aform_form-element" @focusout="closeWhenFocusLeaves" @keydown="closeOnEscape">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayValue }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>

		<template v-else>
			<input
				:id="uuid"
				ref="box"
				class="aform_input-field"
				type="text"
				role="combobox"
				aria-haspopup="dialog"
				:aria-expanded="showPicker"
				:aria-controls="showPicker ? calendarId : undefined"
				:value="rangeDisplay"
				placeholder="Select date range"
				:disabled="mode === 'read'"
				readonly
				:aria-invalid="invalid"
				:aria-describedby="describedBy"
				@click="openPicker"
				@keydown="openFromKey" />
			<label class="aform_field-label" :for="uuid">{{ label }}</label>

			<p v-show="errorText" :id="errorId" class="aform_error" role="alert">{{ errorText }}</p>

			<ADateSelection
				v-if="showPicker"
				:id="calendarId"
				ref="picker"
				class="adaterange-picker"
				role="dialog"
				:aria-label="label"
				:select-range="true"
				:show-time="false"
				@get-date="handlePickerDate" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, ref, computed, useTemplateRef, watch } from 'vue'
import { fromISODate } from '@stonecrop/utilities'
import { Temporal } from 'temporal-polyfill'
import ADateSelection from './ADateSelection.vue'
import { fieldErrorA11y } from '../../composables/fieldErrorA11y'
import type { ComponentProps } from '../../types'
import { useFieldCalendar } from '../../utils/fieldCalendar'

const fmt = (d: string) => fromISODate(d)?.toLocaleString() ?? 'Invalid Date'

const { label = 'Date Range', mode, uuid, errors, validation = { errorMessage: '' } } = defineProps<ComponentProps>()

// Dynamic trigger errors take precedence over a static schema errorMessage; empty means the slot hides.
const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))
const { errorId, describedBy, invalid } = fieldErrorA11y(uuid, errorText)

export interface DateRangeValue {
	start_date: string | null
	end_date: string | null
}

const modelValue = defineModel<DateRangeValue | null>({
	default: () => ({ start_date: null, end_date: null }),
})

const readDay = (day: string | null | undefined) => (day ? (fromISODate(day) ?? null) : null)

const startDate = ref<Temporal.PlainDate | null>(readDay(modelValue.value?.start_date))
const endDate = ref<Temporal.PlainDate | null>(readDay(modelValue.value?.end_date))

const { showPicker, calendarId, closePicker, openFromKey, closeOnEscape, closeWhenFocusLeaves } = useFieldCalendar(
	useTemplateRef<HTMLInputElement>('box'),
	useTemplateRef<ComponentPublicInstance>('picker'),
	uuid
)

const openPicker = () => {
	if (mode !== 'read') showPicker.value = true
}

const formatDate = (d: Temporal.PlainDate | null): string => d?.toLocaleString() ?? ''

const rangeDisplay = computed(() => {
	const s = formatDate(startDate.value)
	const e = formatDate(endDate.value)
	if (s && e) return `${s} — ${e}`
	if (s) return `${s} — ...`
	return ''
})

const displayValue = computed(() => {
	const s = modelValue.value?.start_date
	const e = modelValue.value?.end_date
	if (!s && !e) return ''
	if (s && e) return `${fmt(s)} — ${fmt(e)}`
	if (s) return `From ${fmt(s)}`
	return `Until ${fmt(e!)}`
})

const ensureOrder = () => {
	const s = startDate.value
	const e = endDate.value
	if (s && e && Temporal.PlainDate.compare(e, s) < 0) {
		;[startDate.value, endDate.value] = [e, s]
	}
}

const emitModel = () => {
	modelValue.value = {
		start_date: startDate.value?.toString() ?? null,
		end_date: endDate.value?.toString() ?? null,
	}
}

const handlePickerDate = (data: { selected: string; start?: string | null; end?: string | null }) => {
	if (data.start) startDate.value = readDay(data.start)
	if (data.end) {
		endDate.value = readDay(data.end)
		ensureOrder()
		closePicker()
	}
	emitModel()
}

watch(
	() => modelValue.value,
	newVal => {
		startDate.value = readDay(newVal?.start_date)
		endDate.value = readDay(newVal?.end_date)
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
