<script setup lang="ts">
import SheetNav from '../../../desktop/src/components/SheetNav.vue'
import ActionSet from '../../../desktop/src/components/ActionSet.vue'
import type { ActionElements } from '../../../desktop/src/types'

const route = useRoute()
const router = useRouter()

const isHome = computed(() => route.path === '/')

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
		if (i === parts.length - 1 && (segment.match(/^[0-9a-f-]+$/i) || !isNaN(Number(segment)))) {
			const parent = parts[i - 1]
			if (parent === 'users') title = `User: ${segment.slice(0, 8)}`
			else if (parent === 'roles') title = `Role: ${segment.slice(0, 8)}`
			else if (parent === 'role-profiles') title = `Profile: ${segment.slice(0, 8)}`
			else if (parent === 'ability-rules') title = `Rule: ${segment.slice(0, 8)}`
			else if (parent === 'doctypes') title = `DocType: ${segment}`
			else if (parent === 'builder') title = `Builder: ${segment}`
		}

		crumbs.push({ title, to: currentPath })
	}

	return crumbs
})

// ActionSet elements - enhanced with navigation links
const actionSetElements = computed<ActionElements[]>(() => {
	const elements: ActionElements[] = []

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

		<!-- SheetNav Footer (hidden on home page) -->
		<SheetNav v-if="!isHome && breadcrumbs.length > 0" :breadcrumbs="breadcrumbs" />

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
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background: #f3f4f6;
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
	background: linear-gradient(135deg, #020420 0%, #0f0f23 100%);
}

.app-layout.is-home {
	background: linear-gradient(135deg, #020420 0%, #0f0f23 100%);
}

.app-main {
	flex: 1;
	padding: 2rem;
}

/* Don't apply white background to home page content */
.app-layout:not(.is-home) .app-main > :deep(*:first-child) {
	background: rgba(255, 255, 255, 0.98);
	backdrop-filter: blur(10px);
	border-radius: 1rem;
	padding: 2rem;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(0, 220, 130, 0.1);
}

/* Home page should have proper text color */
.app-layout.is-home {
	color: white;
}

/* Override SheetNav styles for Nuxt theme */
.app-layout :deep(footer) {
	padding: 0 1rem 0 0;
}

.app-layout :deep(.tabs a) {
	color: #0a1f1a;
	background: rgba(0, 220, 130, 0.5);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(0, 220, 130, 0.6);
	outline: 1px solid rgba(0, 220, 130, 0.4);
	transition: all 0.2s ease;
	font-weight: 600;
}

.app-layout :deep(.tabs a:hover) {
	background: rgba(0, 220, 130, 0.7);
	transform: translateY(-2px);
	border-color: rgba(0, 220, 130, 0.8);
	color: #051410;
}

.app-layout :deep(.router-link-active) {
	background: rgba(0, 220, 130, 0.8) !important;
	border-color: #00dc82 !important;
	color: #051410 !important;
}

.app-layout :deep(.hidebreadcrumbs a),
.app-layout :deep(.hometab a),
.app-layout :deep(.searchtab a) {
	background: rgba(0, 220, 130, 0.5);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(0, 220, 130, 0.6);
	color: #0a1f1a;
	font-weight: 600;
}

.app-layout :deep(.hidebreadcrumbs a:hover),
.app-layout :deep(.hometab a:hover),
.app-layout :deep(.searchtab a:hover) {
	background: rgba(0, 220, 130, 0.7);
	color: #051410;
}

.app-layout :deep(.hometab svg path),
.app-layout :deep(.searchtab svg path) {
	fill: #0a1f1a;
}

.app-layout :deep(.searchtab input) {
	border-bottom-color: rgba(0, 220, 130, 0.8);
	color: #0a1f1a;
	font-weight: 600;
}

.app-layout :deep(.searchtab input::placeholder) {
	color: rgba(10, 31, 26, 0.6);
}

/* Override ActionSet styles for Nuxt theme */
.app-layout :deep(.action-set) {
	background: rgba(0, 220, 130, 0.5);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(0, 220, 130, 0.6);
	box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
	padding: 20px 20px 20px 20px !important;
}

.app-layout :deep(.action-set.collapse),
.app-layout :deep(.action-set.collapse.hovered-and-closed:hover) {
	max-width: 60px !important;
	padding: 20px 20px 20px 20px !important;
}

.app-layout :deep(.action-set.collapse:hover),
.app-layout :deep(.action-set.collapse.open-set) {
	max-width: 500px !important;
}

.app-layout :deep(.action-menu-icon svg) {
	fill: #0a1f1a;
}

.app-layout :deep(.button-default) {
	background: rgba(0, 220, 130, 0.4);
	color: #0a1f1a;
	border: 1px solid rgba(0, 220, 130, 0.6);
	backdrop-filter: blur(5px);
	transition: all 0.2s ease;
	font-weight: 600;
}

.app-layout :deep(.button-default:hover) {
	background: rgba(0, 220, 130, 0.7);
	color: #051410;
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 220, 130, 0.5);
}

.app-layout :deep(.button-default:disabled) {
	background: rgba(255, 255, 255, 0.05);
	color: rgba(255, 255, 255, 0.3);
	border-color: rgba(255, 255, 255, 0.1);
}

.app-layout :deep(.button-default:disabled:hover) {
	transform: none;
}

.app-layout :deep(.dropdown) {
	background: rgba(0, 220, 130, 0.6);
	backdrop-filter: blur(15px);
	border: 1px solid rgba(0, 220, 130, 0.7);
	box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
}

.app-layout :deep(.dropdown-item) {
	background: rgba(255, 255, 255, 0.1);
	color: #0a1f1a;
	transition: all 0.2s ease;
	font-weight: 600;
}

.app-layout :deep(.dropdown-item:hover) {
	background: rgba(255, 255, 255, 0.25);
	color: #051410;
	transform: translateX(-2px);
}

/* Global Table Styling */
.app-layout :deep(.atable) {
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10px);
	border-radius: 1rem;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	border: 1px solid rgba(0, 0, 0, 0.05);
}

.app-layout :deep(.atable tbody tr) {
	cursor: pointer;
	transition: background-color 0.15s ease;
}

.app-layout :deep(.atable tbody tr:hover) {
	background: rgba(0, 220, 130, 0.05);
}

.app-layout :deep(.atable th) {
	background: rgba(0, 220, 130, 0.1);
	color: #1a202c;
	font-weight: 600;
	padding: 1rem;
}

.app-layout :deep(.atable td) {
	padding: 1rem;
	color: #2d3748;
}
</style>
