<template>
	<div class="input-group">
		<input
			v-model="values.quantity"
			type="number"
			:id="uuid"
			:disabled="readonly"
			:required="required"
			v-bind="values" />
		<label :for="uuid">{{ label }}</label>

		<div v-if="values.uom" class="input-group-append">
			<span>{{ values.uom }}</span>
		</div>

		<!-- <ADropdown v-model="values.uom" label="" :items="values.uoms" class="input-group-append"></ADropdown> -->

		<p v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Quantity } from 'types/quantity'
import ADropdown from './ADropdown.vue'

const props = withDefaults(
	defineProps<{
		label: string
		modelValue: Quantity
		required?: boolean
		readonly?: boolean
		uuid?: string
		validation?: Record<string, any>
	}>(),
	{
		modelValue: () => ({ quantity: 0 }),
		validation: () => ({ errorMessage: '' }),
	}
)
const emit = defineEmits(['update:modelValue'])

const stockQty = computed(() => {
	return props.modelValue.quantity * props.modelValue.conversionFactor
})

const values = computed({
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
	display: flex;
	flex-direction: row;
	align-items: baseline;
}

/* .input-group-append {
	padding: calc(1rem / 2);
	border: 1px solid var(--input-border-color);
	border-radius: 0.25rem;
	background-color: #e9ecef;
} */

div {
	min-width: 40ch;
	border: 1px solid transparent;
	padding: 0rem;
	margin: 0rem;
	margin-right: 1ch;
}

input {
	width: 100%;
	outline: 1px solid transparent;
	border: 1px solid var(--input-border-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	min-height: 1.15rem;
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
	margin-left: 1ch;
	padding: 0 0.25ch 0 0.25ch;
}

input:focus {
	border: 1px solid var(--input-active-border-color);
}

input:focus + label {
	color: var(--input-active-label-color);
}
</style>
