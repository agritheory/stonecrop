<template>
	<fieldset>
		<legend @click="toggleCollapse" @submit="toggleCollapse">
			{{ label }}
			<CollapseButton v-if="collapsible" :collapsed="collapsed" />
		</legend>
		<slot :collapsed="collapsed">
			<AForm v-show="!collapsed" :schema="schema" :data="formData" />
		</slot>
	</fieldset>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import CollapseButton from '@/components/base/CollapseButton.vue'
import AForm from '@/components/AForm.vue'
import { SchemaTypes } from 'types/index'

const props = defineProps<{
	schema: SchemaTypes[]
	label: string
	collapsible?: boolean
	data?: any
}>()

const formData = ref(props.data || [])
let collapsed = ref(false)
let collapsible = ref(props.collapsible)

function toggleCollapse(event: Event) {
	event.preventDefault()
	if (!collapsible.value) {
		return
	}
	collapsed.value = !collapsed.value
}
</script>

<style scoped>
fieldset {
	max-width: 100%;
	width: 100%;
	margin-right: 2ch;
	border: 1px solid transparent;
	border-bottom: 1px solid var(--gray-50);
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
