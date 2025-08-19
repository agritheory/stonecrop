<template>
	<pre>Route Info: {{ route }}</pre>

	<!-- elements -->
	<ActionSet id="desktop-action-set" :elements="elements" />
	<SheetNav id="desktop-sheet-nav" :breadcrumbs="breadcrumbs" />

	<!-- content -->
	<AForm id="desktop-content" v-model="formSchema" :data="formData" />

	<!-- modals -->
	<CommandPalette
		id="desktop-command-palette"
		v-if="search"
		:search="search"
		:is-open="isCommandPaletteOpen"
		:placeholder="placeholder"
		:max-results="maxResults"
		@select="$emit('select', $event)"
		@close="$emit('close')">
		<template #title="{ result }">
			<slot name="searchTitle" :result="result" />
		</template>
		<template #content="{ result }">
			<slot name="searchContent" :result="result" />
		</template>
		<template #empty>
			<slot name="searchEmpty" />
		</template>
	</CommandPalette>
</template>

<script setup lang="ts" generic="T">
import { AForm, SchemaTypes } from '@stonecrop/aform'
import { RouteLocationNormalizedLoaded } from 'vue-router'

import ActionSet from './ActionSet.vue'
import CommandPalette from './CommandPalette.vue'
import SheetNav from './SheetNav.vue'
import { ActionElements } from '../types'

type DesktopProps = {
	// route information passed from parent
	route: RouteLocationNormalizedLoaded
}

type ActionSetProps = {
	// action elements to display in the action set
	elements?: ActionElements[]
}

type SheetNavProps = {
	// breadcrumbs for navigation
	breadcrumbs?: { title: string; to: string }[]
}

type CommandPaletteProps = {
	search?: (query: string) => T[]
	isCommandPaletteOpen?: boolean
	placeholder?: string
	maxResults?: number
}

type Slots = { searchTitle?: { result: T }; searchContent?: { result: T }; searchEmpty?: null }
type Props = DesktopProps & ActionSetProps & SheetNavProps & CommandPaletteProps
type Emits = { select: [T]; close: [] }

defineSlots<Slots>()
defineProps<Props>()
defineEmits<Emits>()

const formSchema = defineModel<SchemaTypes[]>('schema', { default: () => [] })
const formData = defineModel<Record<string, any>>('data', { default: () => ({}) })
</script>
