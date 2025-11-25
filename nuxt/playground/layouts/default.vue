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

	// Navigation dropdown (always available except on home)
	if (!isHome.value) {
		elements.push({
			type: 'dropdown',
			label: 'Navigate',
			actions: [
				{ label: 'Home', action: () => router.push('/') },
				{ label: 'Users', action: () => router.push('/users') },
				{ label: 'Roles', action: () => router.push('/roles') },
				{ label: 'Profiles', action: () => router.push('/role-profiles') },
				{ label: 'Rules', action: () => router.push('/ability-rules') },
				{ label: 'DocTypes', action: () => router.push('/doctypes') },
			],
		})
	}

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
	<div class="app-layout" :class="{ 'is-home': isHome }">
		<main class="app-main">
			<slot />
		</main>

		<!-- SheetNav Footer (hidden on home page) - client-only to avoid hydration issues -->
		<ClientOnly v-if="!isHome && breadcrumbs.length > 0">
			<SheetNav :breadcrumbs="breadcrumbs" />
			<template #fallback>
				<div class="sheetnav-placeholder" />
			</template>
		</ClientOnly>

		<!-- ActionSet Floating Controls (hidden on home page) -->
		<ActionSet
			v-if="!isHome && actionSetElements.length > 0"
			:elements="actionSetElements"
			@action-click="handleActionClick" />
	</div>
</template>

<style>
* {
	box-sizing: border-box;
}

body {
	margin: 0;
	font-family: var(--sc-font-family);
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background: var(--sc-gray-5);
}

#__nuxt {
	min-height: 100vh;
}
</style>

<style scoped>
.app-layout {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background: var(--sc-gray-5);
}

.app-layout.is-home {
	background: var(--sc-brand-color);
}

.app-main {
	flex: 1;
	padding: 2rem;
}

/* Remove padding when app-main contains a sidebar layout to prevent overflow */
.app-main:has(> .page-container-with-sidebar) {
	padding: 0;
}

/* Apply container background to non-home pages (skip pages with sidebar layouts) */
.app-layout:not(.is-home) .app-main > :deep(*:first-child:not(.page-container-with-sidebar)) {
	background: var(--sc-form-background);
	border-radius: 0.25rem;
	padding: 2rem;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	border: 1px solid var(--sc-form-border);
}

/* For pages with sidebar, remove outer padding to prevent overflow */
.app-layout:not(.is-home) .app-main > :deep(.page-container-with-sidebar) {
	background: transparent;
	border: none;
	box-shadow: none;
}

/* Home page styling */
.app-layout.is-home {
	color: var(--sc-primary-text-color);
}

/* SheetNav placeholder for SSR */
.sheetnav-placeholder {
	position: fixed;
	bottom: 0;
	right: 0;
	height: 2.6rem;
	width: 200px;
	background: transparent;
}

/* ActionSet styles using Stonecrop theme */
.app-layout :deep(.action-set) {
	background: var(--sc-form-background);
	border: 1px solid var(--sc-form-border);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	padding: 20px 20px 20px 20px !important;
}

.app-layout :deep(.action-set.collapse),
.app-layout :deep(.action-set.collapse.hovered-and-closed:hover) {
	max-width: 60px !important;
	padding: 20px 20px 20px 20px !important;
}

.app-layout :deep(.action-set.collapse:hover),
.app-layout :deep(.action-set.collapse.open-set) {
	max-width: 600px !important;
}

.app-layout :deep(.action-menu-icon svg) {
	fill: var(--sc-gray-80);
}

.app-layout :deep(.button-default) {
	background: var(--sc-btn-color);
	color: var(--sc-btn-label-color);
	border: 1px solid var(--sc-btn-border);
	transition: all 0.2s ease;
	/* Ensure consistent height for all buttons regardless of content */
	height: 27px;
	line-height: 1;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.app-layout :deep(.button-default:hover) {
	background: var(--sc-btn-hover);
}

.app-layout :deep(.button-default:disabled) {
	background: var(--sc-input-field-disabled-background);
	color: var(--sc-gray-50);
	border-color: var(--sc-gray-20);
	opacity: 0.6;
}

.app-layout :deep(.button-default:disabled:hover) {
	transform: none;
}

.app-layout :deep(.dropdown) {
	background: var(--sc-form-background);
	border: 1px solid var(--sc-form-border);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.app-layout :deep(.dropdown-item) {
	background: var(--sc-form-background);
	color: var(--sc-gray-80);
	transition: all 0.2s ease;
}

.app-layout :deep(.dropdown-item:hover) {
	background: var(--sc-btn-hover);
}

/* Global Table Styling using Stonecrop theme */
.app-layout :deep(.atable) {
	background: var(--sc-form-background);
	border-radius: 0.25rem;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	border: 1px solid var(--sc-form-border);
}

.app-layout :deep(.atable tbody tr) {
	cursor: pointer;
	transition: background-color 0.15s ease;
}

.app-layout :deep(.atable tbody tr:hover) {
	background: var(--sc-gray-5);
}

.app-layout :deep(.atable th) {
	background: var(--sc-gray-10);
	color: var(--sc-gray-80);
	font-weight: 600;
	padding: 1rem;
}

.app-layout :deep(.atable td) {
	padding: 1rem;
	color: var(--sc-cell-text-color);
}
</style>
