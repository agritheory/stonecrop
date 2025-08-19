<template>
	<div id="home">
		<pre>Stonecrop: {{ stonecropInfo }}</pre>
		<Desktop :elements="actionElements" :route="$route" />
	</div>
</template>

<script setup lang="ts">
import { useStonecrop } from '@stonecrop/stonecrop'
import { computed } from 'vue'

import { actionElements } from './mocks/elements'

const { stonecrop } = useStonecrop()

const stonecropInfo = computed(() => {
	if (!stonecrop.value) {
		return 'Stonecrop not initialized'
	}

	// Get store info without circular references
	const store = stonecrop.value.getStore()

	// Try to get store keys safely without triggering circular ref issues
	try {
		// Get just the top-level keys of the store structure
		const storeData = store.get('')
		const storeKeys = typeof storeData === 'object' && storeData !== null ? Object.keys(storeData) : []

		return {
			initialized: !!stonecrop.value,
			storeKeys,
			message: 'Stonecrop with HST initialized successfully',
		}
	} catch (error) {
		return {
			initialized: !!stonecrop.value,
			error: 'Error accessing store data',
			message: 'Stonecrop initialized but store data not accessible',
		}
	}
})
</script>
