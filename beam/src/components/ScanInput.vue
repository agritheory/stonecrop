<template>
	<div id="scan_input"></div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import onScan from 'onscan.js'
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
	scanInstance: [instance: onScan]
}>()

const props = defineProps<{
	scanHandler: (barcode: string, qty: number) => void
}>()

onMounted(() => {
	const instance = onScan.attachTo(window, { onScan: props.scanHandler })
	emit('scanInstance', instance)
})

onUnmounted(() => {
	onScan.detachFrom(window)
})
</script>
