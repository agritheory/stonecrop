<template>
	<fieldset :disabled="loading || undefined">
		<legend v-if="label || collapsible" @click="toggleCollapse" @submit="toggleCollapse">
			{{ label }}
			<CollapseButton v-if="collapsible" :collapsed="collapsed" />
		</legend>
		<slot :collapsed="collapsed">
			<AForm v-show="!collapsed" v-model:data="formData" :schema="formSchema" :mode="mode" :loading="loading" />
		</slot>

		<!-- Animated loading bar — only rendered while loading is true -->
		<div v-if="loading" class="afieldset-loading-bar"></div>
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
	loading = false,
} = defineProps<{
	schema: ResolvedField[]
	label?: string
	collapsible?: boolean
	data?: Record<string, any>
	mode?: InteractionMode
	loading?: boolean
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
	position: relative;
	overflow: hidden;
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

.afieldset-loading-bar {
	width: 50%;
	height: 3px;
	position: absolute;
	left: -50%;
	bottom: 0;
	background: var(--sc-row-border-color, #999);
	animation: bar-left 2s infinite;
	z-index: 1;
}

@keyframes bar-left {
	0% {
		left: -50%;
	}
	100% {
		left: 100%;
	}
}
</style>
