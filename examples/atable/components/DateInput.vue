<template>
	<ADate v-model="date" v-bind="rest" />
</template>

<script setup lang="ts">
import { ADate } from '@stonecrop/aform'
import { createTableStore } from '@stonecrop/atable'
import { ref, watch } from 'vue'

const { colIndex, rowIndex, store, ...rest } = defineProps<{
	colIndex: number
	rowIndex: number
	store: ReturnType<typeof createTableStore>
	[key: string]: any
}>()

const date = ref(store.getCellData<number>(colIndex, rowIndex))

watch(date, newDate => store.setCellData(colIndex, rowIndex, newDate))
</script>
