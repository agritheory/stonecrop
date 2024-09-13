<template>
	<div id="scan_input"></div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import onScan from 'onscan.js'
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
	scanHandler: (barcode: string, qty: number) => void
}>()

onMounted(() => {
	onScan.attachTo(window, { onScan: props.scanHandler })
})

onUnmounted(() => {
	onScan.detachFrom(window)
})
</script>
