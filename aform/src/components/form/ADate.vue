<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ modelValue ? fromISODate(modelValue).toLocaleDateString() : '' }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<input
				:id="uuid"
				ref="date"
				v-model="modelValue"
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
				:default-date="modelValue ? fromISODate(modelValue) : undefined"
				:select-range="false"
				:show-time="false"
				@get-date="handleDate" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { useTemplateRef, ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { fromISODate, toISODate } from '@stonecrop/utilities'

import ADateSelection from './ADateSelection.vue'
import type { ComponentProps } from '../../types'

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
const modelValue = defineModel<string>()

const pickerRef = useTemplateRef<HTMLDivElement>('picker')
const showPicker = ref(false)

onClickOutside(pickerRef, () => (showPicker.value = false))

const openPicker = () => {
	if (mode !== 'read') showPicker.value = !showPicker.value
}

const handleDate = (data: { selected: Date }) => {
	modelValue.value = toISODate(data.selected)
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
