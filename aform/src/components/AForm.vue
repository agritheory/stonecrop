<template>
	<form>
		<component
			v-for="(componentObj, key) in schema"
			:is="deriveComponent(componentObj)"
			:key="key"
			:schema="componentObj"
			v-bind="componentProps(componentObj)"
			:value="formData[componentObj.fieldname]">
		</component>
	</form>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

import { SchemaTypes } from 'types'

export default defineComponent({
	name: 'AForm',
	props: {
		schema: {
			type: Array as PropType<SchemaTypes[]>,
			required: true,
		},
		data: {
			type: Array,
			required: true,
		},
		formId: {
			type: Number,
		},
	},
	setup(props) {
		const formData = ref(props.data || {})

		const deriveComponent = (componentObj: SchemaTypes) => {
			return componentObj.component || componentObj.fieldtype
		}

		const componentProps = (componentObj: SchemaTypes) => {
			let propsToPass = {}
			for (const [key, value] of Object.entries(componentObj)) {
				if (!['component', 'fieldtype'].includes(key)) {
					propsToPass[key] = value
				}
			}
			return propsToPass
		}

		return { deriveComponent, formData, componentProps }
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
