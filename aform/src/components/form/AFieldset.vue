<template>
	<fieldset>
		<legend v-if="label || collapsible" @click="toggleCollapse" @submit="toggleCollapse">
			{{ label }}
			<CollapseButton v-if="collapsible" :collapsed="collapsed" />
		</legend>
		<slot :collapsed="collapsed">
			<AForm v-show="!collapsed" v-model:data="formData" :schema="formSchema" :mode="mode" />
		</slot>
	</fieldset>
</template>

<script setup lang="ts">
import type { InteractionMode } from '@stonecrop/schema'
import { ref } from 'vue'

import AForm from '../AForm.vue'
import CollapseButton from '../base/CollapseButton.vue'
import type { ResolvedField } from '../../types'

const {
	schema,
	label = undefined,
	collapsible,
	data = {},
	mode = 'edit',
} = defineProps<{
	schema: ResolvedField[]
	label?: string
	collapsible?: boolean
	data?: Record<string, any>
	/** Rendering mode forwarded to the inner AForm */
	mode?: InteractionMode
}>()

const collapsed = ref(false)
const formData = ref(data || [])
const formSchema = ref(schema)

const toggleCollapse = (event: Event) => {
	event.preventDefault()
	if (collapsible) {
		collapsed.value = !collapsed.value
	}
}

defineExpose({ collapsed })
</script>

<style scoped>
fieldset {
	max-width: 100%;
	width: 100%;
	margin-right: 2ch;
	border: 1px solid transparent;
	border-bottom: 1px solid var(--sc-gray-50);
}

legend {
	width: 100%;
	height: 1.15rem;
	border: 1px solid transparent;
	padding-bottom: 0.5rem;
	font-size: 110%;
	font-weight: 600;
	user-select: none;
}

.collapse-button {
	float: right;
}
</style>
