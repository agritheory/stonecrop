<script setup lang="ts">
// Fullstack playground demonstrating @stonecrop/nuxt + nuxt-grafserv
import SheetNav from '../../desktop/src/components/SheetNav.vue'
import ActionSet from '../../desktop/src/components/ActionSet.vue'
import type { ActionElements } from '../../desktop/src/types'

const route = useRoute()
const router = useRouter()

// Breadcrumbs based on current route
const breadcrumbs = computed(() => {
	const path = route.path
	const parts = path.split('/').filter(Boolean)
	const crumbs: Array<{ title: string; to: string }> = []

	if (parts.length === 0) return crumbs

	let currentPath = ''
	for (let i = 0; i < parts.length; i++) {
		currentPath += `/${parts[i]}`
		const segment = parts[i]

		let title = segment
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')

		crumbs.push({ title, to: currentPath })
	}

	return crumbs
})

// ActionSet elements - navigation actions
const actionSetElements = computed<ActionElements[]>(() => {
	const elements: ActionElements[] = []

	// Navigation dropdown
	const navActions = [
		{ label: 'Users', action: () => router.push('/user') },
		{ label: 'Orders', action: () => router.push('/order') },
		{ label: 'DocBuilder', action: () => router.push('/docbuilder') },
		{ label: 'GraphiQL', action: () => window.open('/graphql/', '_blank') },
	]

	if (route.path !== '/') {
		navActions.unshift({ label: 'Home', action: () => router.push('/') })
	}

	elements.push({
		type: 'dropdown',
		label: 'Navigate',
		actions: navActions,
	})

	// Back button when not on home or list pages
	if (route.path !== '/' && route.path !== '/user' && route.path !== '/order' && route.path !== '/docbuilder') {
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
	<div class="fullstack-app">
		<main class="app-main">
			<NuxtPage />
		</main>

		<!-- SheetNav Footer - desktop navigation -->
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
/* Global styles following Stonecrop design principles:
 * - Gray-on-gray for reduced eye strain during extended use
 * - Minimal ornamentation (low/no border-radius)
 * - Sans-serif typography for clarity
 * - Color reserved for semantic meaning (errors, warnings, success)
 */
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
.fullstack-app {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	font-family: var(--sc-font-family);
	background: var(--sc-form-background);
}

.app-main {
	flex: 1;
	padding: 2rem;
	background: var(--sc-form-background);
}

/* Placeholder for SheetNav during SSR */
.sheetnav-placeholder {
	position: fixed;
	bottom: 0;
	right: 0;
	height: 2.4rem;
	width: 180px;
}
</style>
