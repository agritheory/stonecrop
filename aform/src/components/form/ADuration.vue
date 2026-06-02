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
					<span class="aduration__ms">({{ modelValue ?? 0 }} ms)</span>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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

const modelValue = defineModel<number>()

const startDatetime = ref<Date | null>(null)
const endDatetime = ref<Date | null>(null)

const duration = computed<number>(() => {
	if (!startDatetime.value || !endDatetime.value) return 0
	const ms = endDatetime.value.getTime() - startDatetime.value.getTime()
	return ms > 0 ? ms : 0
})

watch(duration, newMs => {
	modelValue.value = newMs
})

const handleRange = (data: { start: Date; end: Date }) => {
	startDatetime.value = data.start
	endDatetime.value = data.end
	modelValue.value = duration.value
}

const humanDuration = computed(() => {
	const ms = duration.value
	if (ms === 0) return '0s'
	const s = Math.floor(ms / 1000) % 60
	const m = Math.floor(ms / 60000) % 60
	const h = Math.floor(ms / 3600000) % 24
	const d = Math.floor(ms / 86400000)
	return [d && `${d}d`, h && `${h}h`, m && `${m}m`, s && `${s}s`].filter(Boolean).join(' ') || '0s'
})

const displayValue = computed(() => {
	const ms = modelValue.value
	if (!ms) return '—'
	const s = Math.floor(ms / 1000) % 60
	const m = Math.floor(ms / 60000) % 60
	const h = Math.floor(ms / 3600000) % 24
	const d = Math.floor(ms / 86400000)
	return [d && `${d}d`, h && `${h}h`, m && `${m}m`, s && `${s}s`].filter(Boolean).join(' ') || '0s'
})
</script>

<style scoped>
.aduration {
	position: relative;
	min-width: 40ch;
	width: 100%;
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
	color: var(--sc-input-active-label-color, #555);
}

.aduration__value {
	color: var(--sc-cell-text-color, #000);
}

.aduration__ms {
	color: var(--sc-gray-50, #888);
	font-size: 0.85em;
}

.aduration__footer {
	margin-top: 8px;
}
</style>
