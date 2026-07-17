<template>
	<div class="adaterange">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayValue }}</span>
			<label>{{ label }}</label>
		</template>

		<template v-else>
			<input
				:id="uuid"
				class="adate-input aform_input-field"
				type="text"
				:value="rangeDisplay"
				placeholder="Select date range"
				:disabled="mode === 'read'"
				readonly
				@click="openPicker" />
			<label :for="uuid">{{ label }}</label>

			<p v-show="errorText" v-html="errorText"></p>

			<ADateSelection
				v-if="showPicker"
				ref="pickerRef"
				class="picker"
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

const fmt = (d: string) => new Date(d).toLocaleDateString()

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

const startDate = ref<Date | null>(modelValue.value.start_date ? new Date(modelValue.value.start_date) : null)
const endDate = ref<Date | null>(modelValue.value.end_date ? new Date(modelValue.value.end_date) : null)

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

const toISODate = (d: Date | null): string | null => (d ? d.toISOString().split('T')[0] : null)

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
		startDate.value = newVal.start_date ? new Date(newVal.start_date) : null
		endDate.value = newVal.end_date ? new Date(newVal.end_date) : null
	},
	{ deep: true }
)
</script>

<style scoped>
.adaterange {
	min-width: 40ch;
	width: 100%;
	box-sizing: border-box;
	border: 1px solid transparent;
	padding: 0;
	margin: 0;
	margin-right: 1ch;
	position: relative;
	overflow: visible;
}

.adate-input {
	width: calc(100% - 1ch);
	box-sizing: border-box;
	outline: 1px solid transparent;
	border: 1px solid var(--sc-input-border-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	min-height: 1.15rem;
	border-radius: 0.25rem;
	cursor: pointer;
	background: white;
	font-size: 1rem;
}

.adate-input:focus {
	border: 1px solid var(--sc-input-active-border-color);
}

.adate-input:focus + label {
	color: var(--sc-input-active-label-color);
}

p,
label {
	color: var(--sc-input-label-color);
	display: block;
	min-height: 1.15rem;
	padding: 0;
	margin: 0;
	border: 1px solid transparent;
	margin-bottom: 0.25rem;
	box-sizing: border-box;
}

p {
	width: 100%;
	color: red;
	font-size: 85%;
}

label {
	z-index: 0;
	font-size: 80%;
	position: absolute;
	background: white;
	margin: calc(-1.5rem - calc(2.15rem / 2)) 0 0 1ch;
	padding: 0 0.25ch 0 0.25ch;
	box-sizing: border-box;
}

.picker {
	position: absolute;
	top: 50px;
	left: 0;
	z-index: 1000;
}
</style>
