<template>
	<div class="input-group">
		<input v-model="quantity" type="number" :id="uuid" :disabled="readonly" :required="required" />
		<label :for="uuid">{{ label }}</label>
		<p v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
		<div class="input-group-append"><span>cm</span></div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		label: string
		modelValue?: number
		required?: boolean
		readonly?: boolean
		uuid?: string
		validation?: Record<string, any>
	}>(),
	{
		validation: () => ({ errorMessage: '&nbsp;' }),
	}
)

const emit = defineEmits(['update:modelValue'])
const quantity = computed({
	get: () => {
		return props.modelValue
	},
	set: newValue => {
		emit('update:modelValue', newValue)
	},
})
</script>

<style scoped>
.input-group {
	display: table;
	border-collapse: collapse;
}

.input-group-append {
	position: relative;
	top: -45px;
	left: 310px;
}

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
