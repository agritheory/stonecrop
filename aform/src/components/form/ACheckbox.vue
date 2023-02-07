<template>
	<div>
		<span>
			<input v-model="checkbox" type="checkbox" :id="uuid" :disabled="readOnly" :required="required" @input="update" />
			<output name="output" :for="uuid"> {{ checkbox }} </output>
		</span>
		<label :for="uuid">{{ label }}</label>
		<p v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
import { InputHTMLAttributes, ref } from 'vue'

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

// let checked = ref()
const checkbox = ref(props.value)

const emit = defineEmits(['update:value'])
const update = (event: InputEvent) => {
	const value = (event.target as HTMLInputElement).value
	emit('update:value', value)
}
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

span {
	display: inline-block;
	min-width: calc(100% - 1ch);
	outline: 1px solid transparent;
	border: 1px solid var(--input-border-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	height: 1.15rem;
	border-radius: 0.25rem;
}

/* output {
	width: calc(100% - 1ch);
} */

/* input[type='checkbox'] {
  display:none;
}

input[type='checkbox'] + span:after {
  content:"⬡";
	padding: 1ch 0.5ch 0.5ch 1ch;
	font-size: 120%;
}
input[type='checkbox']:checked + span:after {
  content:"⬣";
	padding: 1ch 0.5ch 0.5ch 1ch;
	font-size: 120%;
} */

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

span:hover {
	border: 1px solid var(--input-active-border-color);
}

span:hover + label {
	color: var(--input-active-label-color);
}
</style>
