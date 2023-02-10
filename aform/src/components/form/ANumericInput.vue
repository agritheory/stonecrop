<template>
	<ATextInput :label="label" :readonly="readonly" :uuid="uuid" :validation="validation" v-model="amount" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
	defineProps<{
		label: string
		value?: any
		required?: boolean
		readonly?: boolean
		uuid?: string
		validation?: Record<string, any>
	}>(),
	{
		validation: () => ({ errorMessage: '&nbsp;' }),
	}
)

const amount = ref('')

// const emit = defineEmits(['update:value'])
// const update = (event: InputEvent) => {
// 	const value = (event.target as HTMLInputElement).value
// 	emit('update:value', value)
// }
</script>
