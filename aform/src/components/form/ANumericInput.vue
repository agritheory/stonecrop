<template>
	<ATextInput :label="label" :readOnly="readOnly" :uuid="uuid" :validation="validation" v-model="amount" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'ANumericInput',
	props: {
		value: { required: false },
		required: {
			type: Boolean,
		},
		label: {
			type: String,
			required: true,
		},
		readOnly: {
			type: Boolean,
		},
		uuid: {
			type: String,
		},
		validation: {
			type: Object,
			default: () => ({ errorMessage: '&nbsp;' }),
		},
	},
	setup(props, context) {
		const amount = ref('')

		const update = (event: InputEvent) => {
			const value = (event.target as HTMLInputElement).value
			context.emit('update:value', value)
		}

		return { amount, update }
	},
})
</script>
