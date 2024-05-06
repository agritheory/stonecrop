<template>
	<div>
		<input
			ref="dateRef"
			type="date"
			:id="uuid"
			:disabled="readonly"
			:required="required"
			:value="inputDate"
			@click="showPicker" />
		<label :for="uuid">{{ label }}</label>
		<p v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
	defineProps<{
		label: string
		required?: boolean
		readonly?: boolean
		uuid?: string
		validation?: Record<string, any>
	}>(),
	{
		validation: () => ({ errorMessage: '&nbsp;' }),
	}
)

const inputDate = defineModel<string | number | Date>()
const dateRef = ref<HTMLInputElement | null>(null)

const showPicker = () => {
	if (dateRef.value) {
		dateRef.value.showPicker()
	}
}
</script>

<style scoped>
div {
	min-width: 40ch;
	border: 1px solid transparent;
	padding: 0rem;
	margin: 0rem;
	margin-right: 1ch;
}

input {
	width: calc(100% - 1ch);
	outline: 1px solid transparent;
	border: 1px solid var(--input-border-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	min-height: 1.15rem;
	border-radius: 0.25rem;
}

p,
label {
	color: var(--input-label-color);
	display: block;
	min-height: 1.15rem;
	padding: 0rem;
	margin: 0rem;
	border: 1px solid transparent;
	margin-bottom: 0.25rem;
}

p {
	width: 100%;
	color: red;
	font-size: 85%;
}

label {
	z-index: 2;
	font-size: 80%;
	position: absolute;
	background: white;
	margin: calc(-1.5rem - calc(2.15rem / 2)) 0 0 1ch;
	padding: 0 0.25ch 0 0.25ch;
}

input:focus {
	border: 1px solid var(--input-active-border-color);
}

input:focus + label {
	color: var(--input-active-label-color);
}
</style>
