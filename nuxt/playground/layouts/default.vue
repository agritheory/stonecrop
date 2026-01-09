<script setup lang="ts">
import SheetNav from '../../../desktop/src/components/SheetNav.vue'
import ActionSet from '../../../desktop/src/components/ActionSet.vue'
import type { ActionElements } from '../../../desktop/src/types'

const route = useRoute()
const router = useRouter()

// Use route.path to check if we're on home page
// Default to false (non-home) to prevent flash of home styles on other pages
const isHome = computed(() => {
	return route.path === '/'
})

// Form actions from pages
const { getActionSetElements } = useFormActions()

// Breadcrumbs based on current route
const breadcrumbs = computed(() => {
	const path = route.path
	const parts = path.split('/').filter(Boolean)
	const crumbs: Array<{ title: string; to: string }> = []

	if (parts.length === 0) return crumbs

	// Build breadcrumbs from path segments
	let currentPath = ''
	for (let i = 0; i < parts.length; i++) {
		currentPath += `/${parts[i]}`
		const segment = parts[i]

		// Format the title
		let title = segment
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')

		// Special cases
		if (segment === 'role-profiles') title = 'Profiles'
		if (segment === 'ability-rules') title = 'Rules'
		if (segment === 'doctypes') title = 'DocTypes'

		// If it's an ID segment (UUID or number), use a more descriptive title
		if (i === parts.length - 1 && (segment.match(/^[0-9a-f-]+$/i) || !Number.isNaN(Number(segment)))) {
			const parent = parts[i - 1]
			if (parent === 'users') title = `User: ${segment.slice(0, 8)}`
			else if (parent === 'roles') title = `Role: ${segment.slice(0, 8)}`
			else if (parent === 'role-profiles') title = `Profile: ${segment.slice(0, 8)}`
			else if (parent === 'ability-rules') title = `Ability Rule: ${segment.slice(0, 8)}`
			else if (parent === 'doctypes') title = `DocType: ${segment}`
			else if (parent === 'builder') title = `Builder: ${segment}`
		}

		crumbs.push({ title, to: currentPath })
	}

	return crumbs
})

// ActionSet elements - enhanced with navigation links and form actions
const actionSetElements = computed<ActionElements[]>(() => {
	const elements: ActionElements[] = []

	// Add form actions first (Undo, Redo, Cancel, Save)
	elements.push(...getActionSetElements())

	// Navigation dropdown (always available)
	const navActions = [
		{ label: 'Users', action: () => router.push('/users') },
		{ label: 'Roles', action: () => router.push('/roles') },
		{ label: 'Profiles', action: () => router.push('/role-profiles') },
		{ label: 'Rules', action: () => router.push('/ability-rules') },
		{ label: 'DocTypes', action: () => router.push('/doctypes') },
	]

	if (!isHome.value) {
		navActions.unshift({ label: 'Home', action: () => router.push('/') })
	}

	elements.push({
		type: 'dropdown',
		label: 'Navigate',
		actions: navActions,
	})

	// Back button (when not on index pages)
	const path = route.path
	if (path !== '/' && !path.match(/\/(users|roles|role-profiles|ability-rules|doctypes|builder)$/)) {
		elements.push({
			type: 'button',
			label: 'Back',
			action: () => router.back(),
		})
	}

	return elements
})

const handleActionClick = async (label: string, action?: () => void | Promise<void>) => {
	if (action) {
		await action()
	}
}
</script>

<template>
	<div class="app-layout">
		<main class="app-main">
			<slot />
		</main>

		<!-- SheetNav Footer - client-only to avoid hydration issues -->
		<ClientOnly>
			<SheetNav :breadcrumbs="breadcrumbs" />
			<template #fallback>
				<div class="sheetnav-placeholder" />
			</template>
		</ClientOnly>

		<!-- ActionSet Floating Controls -->
		<ActionSet v-if="actionSetElements.length > 0" :elements="actionSetElements" @action-click="handleActionClick" />
	</div>
</template>

<style>
* {
	box-sizing: border-box;
}

body {
	margin: 0;
	font-family: var(--sc-font-family);
	background: var(--sc-gray-5);
}
</style>

<style scoped>
.app-layout {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background: var(--sc-form-background);
}

.app-main {
	flex: 1;
	padding: 2rem;
}

.app-main:has(> .page-container-with-sidebar) {
	padding: 0;
}

.app-layout .app-main > :deep(*:first-child:not(.page-container-with-sidebar):not(.home-container)) {
	background: var(--sc-form-background);
	border-radius: 0;
	padding: 2rem;
	border-left: 4px solid var(--sc-gray-20);
}

.sheetnav-placeholder {
	position: fixed;
	bottom: 0;
	right: 0;
	height: 2.6rem;
	width: 200px;
}
</style>
