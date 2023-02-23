<template>
	<div>
		<AForm v-if="stonecrop" :key="stonecropKey" class="aform-main" v-model="schema" :data="stonecrop?.data" />
	</div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { AForm } from '@agritheory/aform'
import { Registry, useStonecrop } from '@agritheory/stonecrop'
import type { SchemaTypes } from '@agritheory/aform/types'

const route = useRoute()
const registry = inject<Registry>('$registry')
const { stonecrop } = useStonecrop(route, registry)
let schema = ref<SchemaTypes[]>([])
let stonecropKey = 0

watch(stonecrop, (newVal, oldVal) => {
	if (newVal !== oldVal) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		schema.value = newVal.schema.schema.toArray()
		stonecropKey++
	}
})

// const saveRecord = () => {
// 	// handle the save action

// 	// run 'SAVE' hooks after handling the save action
// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
// 	const hookEvents: string[] = stonecrop.value.hooks.get('SAVE')
// 	if (hookEvents.length > 0) {
// 		hookEvents.forEach(hook => {
// 			// eslint-disable-next-line @typescript-eslint/no-implied-eval
// 			const hookFn = new Function(hook)
// 			hookFn()
// 		})
// 	}
// }
</script>
