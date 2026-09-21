<template>
	<div class="aform_form-element" @focusout="closeWhenFocusLeaves" @keydown="closeOnEscape">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayValue }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<!-- `.prevent` and the calendar's keys keep the browser's own calendar shut: aform's is the only one this field opens.
			     A date input cannot take the combobox role, and `aria-expanded` is not allowed on it. -->
			<input
				:id="uuid"
				ref="date"
				v-model="boxDay"
				class="aform_input-field"
				type="date"
				aria-haspopup="dialog"
				:aria-controls="showPicker ? calendarId : undefined"
				:disabled="mode === 'read'"
				:required="required"
				@click.prevent="openPicker"
				@keydown="openFromKey" />
			<label class="aform_field-label" :for="uuid">{{ label }}</label>
			<p v-show="errorText" class="aform_error" v-html="errorText"></p>
			<ADateSelection
				v-if="showPicker"
				:id="calendarId"
				ref="picker"
				class="adate-picker"
				role="dialog"
				:aria-label="label"
				:default-date="modelValue || undefined"
				:select-range="false"
				:show-time="false"
				@get-date="handleDate" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, useTemplateRef, computed } from 'vue'
import { fromISODate } from '@stonecrop/utilities'

import ADateSelection from './ADateSelection.vue'
import type { ComponentProps } from '../../types'
import { dayFromBox } from '../../utils/emptiedBox'
import { useFieldCalendar } from '../../utils/fieldCalendar'

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

// The field holds a `YYYY-MM-DD` day, which is also the date input's own value; a Date would be an instant.
const modelValue = defineModel<string | null>()

const boxDay = computed({
	get: () => modelValue.value,
	set: (text: string) => (modelValue.value = dayFromBox(text)),
})

const displayValue = computed(() =>
	modelValue.value ? (fromISODate(modelValue.value)?.toLocaleString() ?? 'Invalid Date') : ''
)

const { showPicker, calendarId, closePicker, openFromKey, closeOnEscape, closeWhenFocusLeaves } = useFieldCalendar(
	useTemplateRef<HTMLInputElement>('date'),
	useTemplateRef<ComponentPublicInstance>('picker'),
	uuid
)

const openPicker = () => {
	if (mode !== 'read') showPicker.value = !showPicker.value
}

const handleDate = (data: { selected: string }) => {
	modelValue.value = data.selected
	closePicker()
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
