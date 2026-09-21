<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayValue }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<input
				:id="uuid"
				ref="date"
				v-model="boxDay"
				class="aform_input-field"
				type="date"
				:disabled="mode === 'read'"
				:required="required"
				@click="openPicker" />
			<label class="aform_field-label" :for="uuid">{{ label }}</label>
			<p v-show="errorText" class="aform_error" v-html="errorText"></p>
			<ADateSelection
				v-if="showPicker"
				ref="picker"
				class="adate-picker"
				:default-date="modelValue || undefined"
				:select-range="false"
				:show-time="false"
				@get-date="handleDate" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { useTemplateRef, ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { fromISODate } from '@stonecrop/utilities'

import ADateSelection from './ADateSelection.vue'
import type { ComponentProps } from '../../types'
import { dayFromBox } from '../../utils/emptiedBox'

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

const pickerRef = useTemplateRef<HTMLDivElement>('picker')
const showPicker = ref(false)

onClickOutside(pickerRef, () => (showPicker.value = false))

const openPicker = () => {
	if (mode !== 'read') showPicker.value = !showPicker.value
}

const handleDate = (data: { selected: string }) => {
	modelValue.value = data.selected
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
