<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ dateDisplay }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<input
				:id="uuid"
				ref="date-input"
				class="aform_input-field"
				type="text"
				:value="inputText"
				placeholder="Select date"
				:disabled="mode === 'read'"
				:required="required"
				@click="openPicker"
				@input="onInput"
				@blur="commitTypedDate"
				@keydown.enter.prevent="commitTypedDate"
				@keydown.escape="showPicker = false" />
			<label class="aform_field-label" :for="uuid">{{ label }}</label>
			<p v-show="errorText" class="aform_error" v-html="errorText"></p>
			<ADateSelection
				v-if="showPicker"
				ref="picker"
				class="adate-picker"
				:select-range="false"
				:show-time="false"
				@get-date="handleDate" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { useTemplateRef, ref, computed, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

import ADateSelection from './ADateSelection.vue'
import type { ComponentProps } from '../../types'
import { parseCalendarDate, toCalendarDateString } from '../../utils/calendar-date'

const {
	label = 'Date',
	required,
	mode,
	uuid,
	errors,
	validation = { errorMessage: '' },
} = defineProps<ComponentProps>()

// Dynamic trigger errors take precedence over a static schema errorMessage; empty means the slot hides.
const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))

const modelValue = defineModel<string | Date>()

const currentDate = ref(parseCalendarDate(modelValue.value) ?? new Date())

const dateDisplay = computed(() => {
	if (!modelValue.value) return ''
	return currentDate.value.toLocaleDateString()
})

const inputText = ref(dateDisplay.value)

const toISODate = (d: Date) => toCalendarDateString(d)

const parseTypedDate = (value: string) => parseCalendarDate(value)

const pickerRef = useTemplateRef<HTMLDivElement>('picker')
const dateInputRef = useTemplateRef<HTMLInputElement>('date-input')
const showPicker = ref(false)

onClickOutside(pickerRef, () => (showPicker.value = false), { ignore: [dateInputRef] })

const openPicker = () => {
	if (mode !== 'read') showPicker.value = true
}

const onInput = (event: Event) => {
	const target = event.target
	if (target instanceof HTMLInputElement) inputText.value = target.value
}

const commitTypedDate = () => {
	if (!inputText.value.trim()) {
		modelValue.value = undefined
		inputText.value = ''
		return
	}
	const parsed = parseTypedDate(inputText.value)
	if (!parsed) {
		inputText.value = dateDisplay.value
		return
	}
	currentDate.value = parsed
	modelValue.value = toISODate(parsed)
	inputText.value = parsed.toLocaleDateString()
}

watch(
	() => modelValue.value,
	newValue => {
		if (newValue) {
			currentDate.value = parseCalendarDate(newValue) ?? new Date(newValue)
			inputText.value = currentDate.value.toLocaleDateString()
		} else {
			inputText.value = ''
		}
	}
)

const handleDate = (data: { selected: Date }) => {
	currentDate.value = data.selected
	modelValue.value = toISODate(data.selected)
	inputText.value = data.selected.toLocaleDateString()
	showPicker.value = false
}
</script>

<style scoped>
.adate-picker {
	position: absolute;
	top: 100%;
	left: 0;
	z-index: 1000;
	margin-top: 0.25rem;
}
</style>
