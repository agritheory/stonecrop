<template>
	<div class="aduration">
		<template v-if="mode === 'display' || mode === 'read'">
			<span class="aform_display-value">{{ displayValue }}</span>
			<label>{{ label }}</label>
		</template>

		<template v-else>
			<ADateSelection
				ref="selectionRef"
				:select-range="true"
				:show-time="true"
				:show-end-time="true"
				:allow-military-time="allowMilitaryTime"
				:use-seconds="useSeconds"
				@get-range="handleRange" />
			<div class="aduration__footer">
				<label>{{ label }}</label>
				<div v-if="startDatetime && endDatetime" class="aduration__summary">
					<span class="aduration__label">Duration:</span>
					<span class="aduration__value">{{ humanDuration }}</span>
					<span class="aduration__held">({{ modelValue }})</span>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import { ref, computed } from 'vue'
import ADateSelection from './ADateSelection.vue'

const {
	label = 'Duration',
	mode = 'edit',
	allowMilitaryTime = false,
	useSeconds = false,
} = defineProps<{
	label?: string
	mode?: string
	allowMilitaryTime?: boolean
	useSeconds?: boolean
}>()

// An ISO 8601 duration (`PT1H`), which Postgres and Temporal read natively and which, unlike a
// count of milliseconds, holds days and months apart from hours.
const modelValue = defineModel<string | null>()

const startDatetime = ref<Date | null>(null)
const endDatetime = ref<Date | null>(null)

// The time between two picks, counting a day as 24 hours; a pick before the start is no time at all.
const durationBetween = (start: Date, end: Date) =>
	Temporal.Duration.from({ milliseconds: Math.max(end.getTime() - start.getTime(), 0) })
		.round({ largestUnit: 'days' })
		.toString()

const handleRange = (data: { start: Date; end: Date; source?: 'init' | 'user' }) => {
	// Both time widgets announce their starting values as they mount, which ADateSelection turns
	// into a range. That is not a range the user picked: acting on it wrote a zero duration into the
	// model, and lit the summary strip, on first render.
	if (data.source === 'init') return

	startDatetime.value = data.start
	endDatetime.value = data.end
	modelValue.value = durationBetween(data.start, data.end)
}

const readDuration = (value: string) => {
	try {
		return Temporal.Duration.from(value)
	} catch {
		return undefined
	}
}

const UNIT_SUFFIXES = [
	['years', 'y'],
	['months', 'mo'],
	['weeks', 'w'],
	['days', 'd'],
	['hours', 'h'],
	['minutes', 'm'],
] as const

// The units the duration holds, as it holds them: `PT25H` is 25h, not 1d 1h.
const describeDuration = (duration: Temporal.Duration) => {
	const parts = UNIT_SUFFIXES.filter(([unit]) => duration[unit]).map(([unit, suffix]) => `${duration[unit]}${suffix}`)
	const seconds =
		duration.seconds + duration.milliseconds / 1e3 + duration.microseconds / 1e6 + duration.nanoseconds / 1e9
	if (seconds) parts.push(`${seconds}s`)
	return parts.join(' ') || '0s'
}

const heldDuration = computed(() => (modelValue.value ? readDuration(modelValue.value) : undefined))

const humanDuration = computed(() => (heldDuration.value ? describeDuration(heldDuration.value) : '0s'))

const displayValue = computed(() => {
	if (!modelValue.value) return '—'
	if (!heldDuration.value) return 'Invalid Duration'
	return heldDuration.value.blank ? '—' : describeDuration(heldDuration.value)
})
</script>

<style scoped>
.aduration {
	position: relative;
	width: max-content;
	max-width: 100%;
}

.aduration__summary {
	display: flex;
	gap: 6px;
	align-items: baseline;
	margin-top: 6px;
	font-size: 0.9em;
}

.aduration__label {
	font-weight: bold;
	color: var(--sc-input-active-label-color);
}

.aduration__value {
	color: var(--sc-cell-text-color);
}

.aduration__held {
	color: var(--sc-gray-50);
	font-size: 0.85em;
}

.aduration__footer {
	margin-top: 8px;
}
</style>
