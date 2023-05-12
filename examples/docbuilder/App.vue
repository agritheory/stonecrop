<template>
	<SheetNav />
	<router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { SheetNav } from '@agritheory/desktop'
import { useStonecrop } from '@agritheory/stonecrop'

const data = ref({})
const schema = ref({})
const { stonecrop } = useStonecrop()

onMounted(async () => {
	const response = await fetch('/schema')
	schema.value = await response.json()
	data.value = await stonecrop.getMeta('Issue')
})
</script>

<style scoped>
footer {
	position: fixed;
	bottom: 0.75rem;
	background-color: transparent;
	height: 2rem;
	z-index: 100;
	text-align: left;
	font-size: 100%;
	display: flex;
	justify-content: right;
	padding-bottom: 0.2rem;
	margin-right: 1ch;
}
</style>
