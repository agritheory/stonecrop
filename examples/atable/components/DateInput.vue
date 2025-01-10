<template>
	<ADate v-model="date" v-bind="rest" />
</template>

<script setup lang="ts">
import type { TableModalProps } from '@stonecrop/atable'
import { ref, watch } from 'vue'

const { colIndex, rowIndex, store, ...rest } = defineProps<TableModalProps>()
const date = ref(store.getCellData<string | number | Date>(colIndex, rowIndex))
watch(date, newDate => store.setCellData(colIndex, rowIndex, newDate))

store.$onAction(({ name, args, after }) => {
	if (name === 'setCellText') {
		const [colIndex, rowIndex, value] = args

		after(() => {
			const dateObj = new Date(value)
			const dateTime = dateObj.getTime()
			const dateOffset = dateObj.getTimezoneOffset() * 60000
			if (isNaN(dateTime - dateOffset)) return
			const newDate = new Date(dateTime - dateOffset).toISOString().split('T')[0]
			date.value = newDate
		})
	}
})
</script>
