<template>
	<form>
		<component
			v-for="(componentObj, key) in schema"
			:is="componentObj.component"
			:key="key"
			:schema="componentObj"
			v-bind="componentProps(componentObj)"
			:data="formData">
		</component>
	</form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { SchemaTypes } from 'types'

const props = defineProps<{
	schema: SchemaTypes[]
	data: Record<string, any>
}>()

const formData = ref(props.data || {})

const componentProps = (componentObj: SchemaTypes) => {
	let propsToPass = {}
	for (const [key, value] of Object.entries(componentObj)) {
		if (!['component', 'fieldtype'].includes(key)) {
			propsToPass[key] = value
		}
	}
	return propsToPass
}
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
