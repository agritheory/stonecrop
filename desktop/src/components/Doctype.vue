<template>
	<div>
		<AForm
			:key="stonecrop.data"
			class="aform-main"
			:schema="stonecrop.schema.schema.toArray()"
			:data="stonecrop.data" />
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useRoute } from 'vue-router'

import { AForm } from '@agritheory/aform'
import { Registry, useStonecrop } from '@agritheory/stonecrop'

const route = useRoute()
const registry = inject<Registry>('$registry')
const { state } = useStonecrop(route, registry)
const stonecrop = state().stonecrop

const saveRecord = () => {
	// handle the save action

	// run 'SAVE' hooks after handling the save action
	const hookEvents: string[] = hooks.value.get('SAVE')
	if (hookEvents.length > 0) {
		hookEvents.forEach(hook => {
			// eslint-disable-next-line @typescript-eslint/no-implied-eval
			const hookFn = new Function(hook)
			hookFn()
		})
	}
}
</script>
