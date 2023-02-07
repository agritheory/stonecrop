<template>
	<ATextInput :label="label" :readOnly="readOnly" :uuid="uuid" :validation="validation" v-model="amount" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
	defineProps<{
		label: string
		modelValue: any
		required?: boolean
		readOnly?: boolean
		uuid?: string
		validation?: Record<string, any>
	}>(),
	{
		validation: () => ({ errorMessage: '&nbsp;' }),
	}
)
const emit = defineEmits(['update:modelValue'])
const amount = computed({
	get: () => {
		return props.modelValue
	},
	set: newValue => {
		emit('update:modelValue', newValue)
	},
})
</script>
