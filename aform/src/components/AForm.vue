<template>
	<form>
		<component
			v-for="(componentObj, key) in modelValue"
			:is="componentObj.component"
			:key="key"
			:schema="componentObj"
			v-model="childModels[key].value"
			:data="formData[componentObj.fieldname]"
			v-bind="componentProps(componentObj)">
		</component>
	</form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import { SchemaTypes } from 'types'

const props = defineProps<{
	modelValue: SchemaTypes[]
	schema: SchemaTypes[]
	data: Record<string, any>
}>()

const emit = defineEmits(['update:modelValue'])

const formData = ref(props.data || {})

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
		return props.modelValue.map((val, i) => {
			return computed({
				get() {
					return val.value
				},
				set: newValue => {
					// Find the component in modelValue and update it
					props.modelValue[i].value = newValue
					emit('update:modelValue', props.modelValue)
				},
			})
		})
	},
	set: newValue => {
		//emit('update:modelValue', '')
	},
})
</script>

<style scoped>
form {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: baseline;
}
</style>
