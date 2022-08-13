<template>
	<form>
		<component
			v-for="(component, key) in schema"
			:is="deriveComponent(component)"
			:key="key"
			:schema="component"
			v-bind="componentProps(component)"
			:value="formData[component.fieldname]">
		</component>
	</form>
</template>
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'AForm',
	props: ['data', 'schema', 'key'],
	setup(props, context) {
		const formData = ref(props.data || {})
		function deriveComponent(schema) {
			if (schema.component) {
				return schema.component
			}
			if (schema.fieldtype) {
				return schema.fieldtype
			}
		}
		function componentProps(component) {
			let propsToPass = {}
			for (const [key, value] of Object.entries(component)) {
				if (key != 'component' && key != 'fieldtype') {
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
