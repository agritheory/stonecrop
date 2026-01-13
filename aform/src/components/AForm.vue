<template>
	<form class="aform">
		<component
			:is="componentObj.component"
			v-for="(componentObj, key) in modelValue"
			:key="key"
			v-model="childModels[key].value"
			:schema="componentObj"
			:data="formData[componentObj.fieldname]"
			:readOnly="readOnly"
			v-bind="componentProps(componentObj)">
		</component>
	</form>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

import type { SchemaTypes } from '../types'

const emit = defineEmits(['update:modelValue'])
const { modelValue, data, readOnly } = defineProps<{
	modelValue: SchemaTypes[]
	data: Record<string, any>
	readOnly?: boolean
}>()

const formData = ref(data || {})

// Sync data values into schema immediately and on changes
watchEffect(() => {
	if (data) {
		formData.value = data
		// Sync data values into schema
		modelValue.forEach(field => {
			if (field.fieldname && data[field.fieldname] !== undefined) {
				// eslint-disable-next-line vue/no-mutating-props
				field.value = data[field.fieldname]
			}
		})
	}
})

const componentProps = (componentObj: SchemaTypes) => {
	let propsToPass = {}
	for (const [key, value] of Object.entries(componentObj)) {
		if (!['component', 'fieldtype'].includes(key)) {
			propsToPass[key] = value
		}

		// handle ATable data formats in case the table is nested under an AFormm;
		// TODO: there's probably a better way to do this
		if (key === 'rows') {
			if (value && (value as any[]).length === 0) {
				propsToPass['rows'] = formData.value[componentObj.fieldname]
			}
		}
	}
	return propsToPass
}

const childModels = computed({
	get: () => {
		return modelValue.map((val, i) => {
			return computed({
				get() {
					return val.value
				},
				set: newValue => {
					// Find the component in modelValue and update it
					// eslint-disable-next-line vue/no-mutating-props
					modelValue[i].value = newValue
					emit('update:modelValue', modelValue)
				},
			})
		})
	},
	set: (/* newValue */) => {
		//emit('update:modelValue', '')
	},
})
</script>

<style>
/* global styles for aform */
.aform_form-element {
	padding: 0;
	margin: 0;
	position: relative;
	box-sizing: border-box;
	flex-grow: 1;
	min-width: 20ch;
	margin-bottom: 1rem;
}
.aform_input-field {
	outline: 1px solid var(--sc-input-border-color);
	outline-offset: -1px;
	font-size: 1rem;
	padding: 0.5rem;
	margin: 0 0 0 0;
	border-radius: 0;
	box-sizing: border-box;
	width: 100%;
	min-height: auto;
	position: relative;
	color: var(--sc-cell-text-color);
	background: var(--sc-input-field-background);
}
.aform_input-field:focus {
	outline: 1px solid var(--sc-input-active-border-color);
}

.aform_input-field:focus + .aform_field-label {
	color: var(--sc-input-active-label-color);
}

.aform_field-label {
	color: var(--sc-input-label-color);
	display: inline-block;
	position: absolute;
	padding: 0 0.25rem;
	margin: 0rem;
	z-index: 2;
	font-size: 0.7rem;
	font-weight: 300;
	letter-spacing: 0.05rem;
	background: linear-gradient(var(--sc-form-background) 50%, var(--sc-input-field-background) 50%);
	width: auto;
	box-sizing: border-box;
	background: white;
	margin: 0;
	grid-row: 1;
	top: 0;
	left: 10px;
	border: none;
	line-height: 0;
	transform: translateY(-50%);
}
.aform_input-field:disabled {
	background: var(--sc-input-field-disabled-background);
}
.aform_input-field:disabled + .aform_field-label {
	background: linear-gradient(var(--sc-form-background) 50%, var(--sc-input-field-disabled-background) 50%);
}
.aform_input-field:disabled ~ p.aform_error {
	background: linear-gradient(var(--sc-form-background) 50%, var(--sc-input-field-disabled-background) 50%);
}
.aform_field-label::after {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	content: '';
	line-height: normal;
}
p.aform_error {
	display: block;
	display: inline-block;
	display: none;
	background: linear-gradient(var(--sc-form-background) 50%, var(--sc-input-field-background) 50%);
	padding: 0 0.25rem;
	margin: 0rem;
	width: auto;
	color: var(--sc-brand-danger);
	font-size: 0.7rem;
	position: absolute;
	right: 0;
	top: 0;
	line-height: 0;
	background: white;
	padding: 0.25rem;
	transform: translate(-1rem, -50%);
	margin: 0;
}
</style>

<style scoped>
/* @import url('@stonecrop/themes/default.css'); */
.aform {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	padding: 1rem;
	border: 1px solid var(--sc-form-border);
	border-left: 4px solid var(--sc-form-border);
	margin-bottom: 1rem;
	max-width: 100%;
}
@media screen and (max-width: 400px) {
	.aform {
		flex-direction: column;
	}
}
</style>
