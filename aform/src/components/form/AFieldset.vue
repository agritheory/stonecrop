<template>
	<fieldset>
		<legend v-if="label || collapsible" @click="toggleCollapse" @submit="toggleCollapse">
			{{ label }}
			<CollapseButton v-if="collapsible" :collapsed="collapsed" />
		</legend>
		<slot :collapsed="collapsed">
			<AForm v-show="!collapsed" v-model:data="formData" :schema="schema" :mode="mode" :errors="errors" />
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
	mode = 'edit',
	errors = undefined,
} = defineProps<{
	schema: ResolvedField[]
	label?: string
	collapsible?: boolean
	/** Rendering mode forwarded to the inner AForm */
	mode?: InteractionMode
	/** Inline validation errors keyed by fieldname, forwarded to the inner AForm. */
	errors?: Record<string, string[]>
}>()

/** The record the fieldset's fields belong to: a fieldset is layout, so they are its own keys. */
const formData = defineModel<Record<string, any>>('data', { default: () => ({}) })

const collapsed = ref(false)

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
	/* Its padding and border sit inside the width, and no browser margin sits outside it: a fieldset
	   spans exactly the space it is given, so its border never crosses the form's. */
	box-sizing: border-box;
	max-width: 100%;
	width: 100%;
	margin: 0;
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
