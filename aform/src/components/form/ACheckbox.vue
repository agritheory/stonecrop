<template>
	<div>
		<label id="checkbox-container">
			<input v-model="checkbox" type="checkbox" :id="uuid" class="checkbox" :readonly="readOnly" :required="required" />
			<span id="custom-checkbox">{{ checkbox }}</span>
		</label>
		<label :for="uuid" id="checkbox-label">{{ label }}</label>
		<p v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
import { computed, InputHTMLAttributes } from 'vue'

import { FormSchema } from 'types'

const props = withDefaults(
	defineProps<{
		schema: FormSchema
		label: string
		value?: InputHTMLAttributes['checked']
		required?: boolean
		readOnly?: boolean
		uuid?: string
		validation?: Record<string, any>
	}>(),
	{
		validation: () => ({ errorMessage: '&nbsp;' }),
	}
)

const emit = defineEmits<{
	(e: 'update:value', value: InputHTMLAttributes['checked']): void
}>()

const checkbox = computed({
	get() {
		return props.value
	},
	set(value) {
		emit('update:value', value)
	},
})
</script>

<style scoped>
div {
	display: inline-block;
	min-width: 40ch;
	border: 1px solid transparent;
	padding: 0rem;
	margin: 0rem;
	margin-right: 1ch;
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

.checkbox {
	visibility: hidden;
}

.checkbox + #custom-checkbox:after {
	content: '⬡';
	padding: 1ch 0 0.5ch 0;
	font-size: 120%;
	cursor: pointer;
	position: relative;
	left: -18px;
}

.checkbox:checked + #custom-checkbox:after {
	content: '⬣';
	padding: 1ch 0 0.5ch 0;
	font-size: 120%;
	cursor: pointer;
	position: relative;
	left: -18px;
}

#custom-checkbox {
	display: inline-block;
}

#checkbox-container {
	display: inline-block;
	min-width: calc(100% - 1ch);
	outline: 1px solid transparent;
	border: 1px solid var(--input-border-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	height: 1.15rem;
	border-radius: 0.25rem;
}

#checkbox-container:hover {
	border: 1px solid var(--input-active-border-color);
}

#checkbox-container:hover + label {
	color: var(--input-active-label-color);
}

#checkbox-label {
	z-index: 2;
	font-size: 80%;
	position: absolute;
	background: white;
	margin: calc(-1.5rem - calc(2.15rem / 2)) 0 0 1ch;
	padding: 0 0.25ch 0 0.25ch;
}
</style>
