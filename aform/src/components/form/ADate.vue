<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ modelValue ? new Date(inputDate).toLocaleDateString() : '' }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<input
				:id="uuid"
				ref="date"
				v-model="inputDate"
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

const currentDate = ref(modelValue.value ? new Date(modelValue.value) : new Date())
const inputDate = computed({
	get: () => currentDate.value.toISOString().split('T')[0],
	set: (value: string) => {
		currentDate.value = new Date(value)
		modelValue.value = value
	},
})

const pickerRef = useTemplateRef<HTMLDivElement>('picker')
const showPicker = ref(false)

onClickOutside(pickerRef, () => (showPicker.value = false))

const openPicker = () => {
	if (mode !== 'read') showPicker.value = !showPicker.value
}

watch(
	() => modelValue.value,
	newValue => {
		if (newValue) {
			currentDate.value = new Date(newValue)
		}
	}
)

const handleDate = (data: { selected: Date }) => {
	currentDate.value = data.selected
	modelValue.value = inputDate.value
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
