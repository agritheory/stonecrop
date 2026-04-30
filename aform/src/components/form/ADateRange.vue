<template>
	<div class="adaterange">
		<!-- display mode -->
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayValue }}</span>
			<label>{{ label }}</label>
		</template>

		<!-- edit / read mode -->
		<template v-else>
			<div class="adaterange__inputs">
				<!-- Start date input -->
				<div class="adaterange__field">
					<input
						:id="`${uuid}-start`"
						class="adate-input aform_input-field"
						type="text"
						placeholder="mm/dd/yyyy"
						:value="startInputDisplay"
						:disabled="mode === 'read'"
						@blur="handleStartInput"
						@keydown.enter="handleStartInput"
						@click="openStartPicker" />
					<label :for="`${uuid}-start`">Start Date</label>
				</div>

				<span class="adaterange__separator">—</span>

				<!-- End date input -->
				<div class="adaterange__field">
					<input
						:id="`${uuid}-end`"
						class="adate-input aform_input-field"
						type="text"
						placeholder="mm/dd/yyyy"
						:value="endInputDisplay"
						:disabled="mode === 'read'"
						@blur="handleEndInput"
						@keydown.enter="handleEndInput"
						@click="openEndPicker" />
					<label :for="`${uuid}-end`">End Date</label>
				</div>
			</div>

			<p v-show="validation.errorMessage" v-html="validation.errorMessage"></p>

			<!-- Calendar popup — range mode -->
			<ADateSelection
				v-if="showPicker"
				ref="pickerRef"
				class="picker"
				:class="activeField === 'end' ? 'picker--end' : 'picker--start'"
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

/* ── props ──────────────────────────────────────────────────────────── */
const {
	label = 'Date Range',
	required,
	mode,
	uuid,
	validation = { errorMessage: '&nbsp;' },
} = defineProps<ComponentProps>()

/* ── v-model: { start_date, end_date } ──────────────────────────────── */
export interface DateRangeValue {
	start_date: string | null
	end_date: string | null
}

const modelValue = defineModel<DateRangeValue>({
	default: () => ({ start_date: null, end_date: null }),
})

/* ── internal state ─────────────────────────────────────────────────── */
const startDate = ref<Date | null>(modelValue.value.start_date ? new Date(modelValue.value.start_date) : null)
const endDate = ref<Date | null>(modelValue.value.end_date ? new Date(modelValue.value.end_date) : null)

// Tracks which field (start or end) triggered the picker open
const activeField = ref<'start' | 'end'>('start')

/* ── picker pop-up ───────────────────────────────────────────────────── */
const showPicker = ref(false)
const pickerRef = ref(null)
onClickOutside(pickerRef, () => (showPicker.value = false))

const openStartPicker = () => {
	activeField.value = 'start'
	showPicker.value = true
}

const openEndPicker = () => {
	activeField.value = 'end'
	showPicker.value = true
}

/* ── display strings for text inputs ────────────────────────────────── */
const formatDate = (d: Date | null): string => {
	if (!d) return ''
	return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}

const startInputDisplay = computed(() => formatDate(startDate.value))
const endInputDisplay = computed(() => formatDate(endDate.value))

/* ── auto-swap ───────────────────────────────────────────────────────── */
const ensureOrder = () => {
	const s = startDate.value
	const e = endDate.value
	if (s && e && e.getTime() < s.getTime()) {
		;[startDate.value, endDate.value] = [e, s]
	}
}

/* ── emit v-model ────────────────────────────────────────────────────── */
const toISODate = (d: Date | null): string | null => (d ? d.toISOString().split('T')[0] : null)

const emitModel = () => {
	modelValue.value = {
		start_date: toISODate(startDate.value),
		end_date: toISODate(endDate.value),
	}
}

/* ── typed / pasted input handlers ──────────────────────────────────── */
const handleStartInput = (e: Event) => {
	const val = (e.target as HTMLInputElement).value
	const parsed = val ? new Date(val) : null
	if (parsed && !isNaN(parsed.getTime())) {
		startDate.value = parsed
		ensureOrder()
		emitModel()
	}
}

const handleEndInput = (e: Event) => {
	const val = (e.target as HTMLInputElement).value
	const parsed = val ? new Date(val) : null
	if (parsed && !isNaN(parsed.getTime())) {
		endDate.value = parsed
		ensureOrder()
		emitModel()
	}
}

/* ── calendar picker handler ─────────────────────────────────────────── */
const handlePickerDate = (data: { selected: Date; start?: Date | null; end?: Date | null }) => {
	if (activeField.value === 'start') {
		startDate.value = data.selected
		// if existing end date is now before the new start, clear it
		if (endDate.value && endDate.value < data.selected) {
			endDate.value = null
		}
	} else {
		endDate.value = data.selected
		ensureOrder()
	}

	// close picker once both dates are confirmed
	if (startDate.value && endDate.value) {
		showPicker.value = false
	}

	emitModel()
}

/* ── display mode value ──────────────────────────────────────────────── */
const displayValue = computed(() => {
	const s = modelValue.value.start_date
	const e = modelValue.value.end_date
	if (!s && !e) return ''
	const fmt = (d: string) => new Date(d).toLocaleDateString()
	if (s && e) return `${fmt(s)} — ${fmt(e)}`
	if (s) return `From ${fmt(s)}`
	return `Until ${fmt(e!)}`
})

/* ── keep in sync when parent updates modelValue externally ─────────── */
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
	position: relative;
	padding: 0;
	margin: 0;
	border: 1px solid transparent;
	overflow: visible;
}

.adaterange__inputs {
	display: flex;
	align-items: flex-end;
	gap: 0.5rem;
	width: 100%;
}

.adaterange__field {
	position: relative;
	flex: 1;
}

.adaterange__separator {
	padding-bottom: 0.6rem;
	color: var(--sc-input-label-color);
	flex-shrink: 0;
}

.adate-input {
	width: 100%;
	box-sizing: border-box;
	outline: 1px solid transparent;
	border: 1px solid var(--sc-input-border-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	min-height: 1.15rem;
	border-radius: 0.25rem;
	font-size: 1rem;
}

.adate-input:focus {
	border: 1px solid var(--sc-input-active-border-color);
}

.adate-input:focus + label {
	color: var(--sc-input-active-label-color);
}

label {
	color: var(--sc-input-label-color);
	display: block;
	font-size: 80%;
	position: absolute;
	background: white;
	margin: calc(-1.5rem - calc(2.15rem / 2)) 0 0 1ch;
	padding: 0 0.25ch;
	z-index: 0;
	min-height: 1.15rem;
	border: 1px solid transparent;
	box-sizing: border-box;
}

p {
	width: 100%;
	color: red;
	font-size: 85%;
	box-sizing: border-box;
	display: block;
	min-height: 1.15rem;
	padding: 0;
	margin: 0;
	border: 1px solid transparent;
	margin-bottom: 0.25rem;
}

.picker {
	position: absolute;
	top: 60px;
	z-index: 1000;
}

.picker--start {
	left: 0;
}

.picker--end {
	right: 0;
}
</style>
