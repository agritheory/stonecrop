<template>
	<div>
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ modelValue ? new Date(inputDate).toLocaleDateString() : '' }}</span>
			<label>{{ label }}</label>
		</template>
		<template v-else>
			<input
				:id="uuid"
				ref="date"
				v-model="inputDate"
				class="adate-input"
				:value="inputDate"
				type="date"
				:disabled="mode === 'read'"
				:required="required"
				@click.prevent="
					() => {
						showPicker = !showPicker
					}
				" />
			<label :for="uuid">{{ label }}</label>
			<p v-show="errorText" v-html="errorText"></p>
			<ADateSelection
				v-if="showPicker"
				ref="picker"
				class="picker"
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
}
</script>

<style scoped>
.adate-input {
	overflow: auto;
}
div {
	min-width: 40ch;
	width: 100%;
	box-sizing: border-box;
	border: 1px solid transparent;
	padding: 0rem;
	margin: 0rem;
	margin-right: 1ch;
}

input {
	width: calc(100% - 1ch);
	box-sizing: border-box;
	outline: 1px solid transparent;
	border: 1px solid var(--sc-input-border-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	min-height: 1.15rem;
	border-radius: 0.25rem;
}

p,
label {
	color: var(--sc-input-label-color);
	display: block;
	min-height: 1.15rem;
	padding: 0rem;
	margin: 0rem;
	border: 1px solid transparent;
	margin-bottom: 0.25rem;
	box-sizing: border-box;
}

p {
	width: 100%;
	color: red;
	font-size: 85%;
	box-sizing: border-box;
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

input:focus {
	border: 1px solid var(--sc-input-active-border-color);
}

input:focus + label {
	color: var(--sc-input-active-label-color);
}
.picker {
	position: absolute;
	top: 50px;
}
</style>
