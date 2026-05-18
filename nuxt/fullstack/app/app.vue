<script setup lang="ts">
// Fullstack playground demonstrating @stonecrop/nuxt + nuxt-grafserv
import SheetNav from '../../../desktop/src/components/SheetNav.vue'
import ActionSet from '../../../desktop/src/components/ActionSet.vue'
import type { ActionElements } from '../../../desktop/src/types'

const route = useRoute()
const router = useRouter()

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

const actionSetElements = computed(() => {
	const elements: ActionElements[] = []

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

		<ClientOnly>
			<SheetNav :breadcrumbs="breadcrumbs" />
			<template #fallback>
				<div class="sheetnav-placeholder" />
			</template>
		</ClientOnly>

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

.sheetnav-placeholder {
	position: fixed;
	bottom: 0;
	right: 0;
	height: 2.4rem;
	width: 180px;
}
</style>
