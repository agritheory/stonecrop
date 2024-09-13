<template>
	<div id="scan_input"></div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { inject, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
	handler: (barcode: string, qty: number) => void
}>()

const onScan = inject<any>('onScan')

onMounted(() => {
	onScan?.setOptions(window, {
		onScan: (barcode: string, qty: number) => {
			props.handler(barcode, qty)
		},
	})
})

onUnmounted(() => {
	onScan?.detachFrom(window)
})
</script>
