<script setup lang="ts">
// Fullstack playground demonstrating @stonecrop/nuxt + nuxt-grafserv
import SheetNav from '../../../desktop/src/components/SheetNav.vue'

const route = useRoute()

// Nav section highlighting: a link stays lit while you're anywhere under its path
// (e.g. Orders stays active on /order/2). Home ('/') matches only the exact root.
const isSection = (base: string) =>
	base === '/' ? route.path === '/' : route.path === base || route.path.startsWith(`${base}/`)

const breadcrumbs = computed(() => {
	const path = route.path
	const parts = path.split('/').filter(Boolean)
	const crumbs: Array<{ title: string; to: string }> = []

	if (parts.length === 0) return crumbs

	let currentPath = ''
	for (const segment of parts) {
		currentPath += `/${segment}`

		const title = segment
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')

		crumbs.push({ title, to: currentPath })
	}

	return crumbs
})
</script>

<template>
	<div class="fullstack-app">
		<nav class="app-nav">
			<NuxtLink to="/" :class="{ 'app-nav-active': isSection('/') }">Home</NuxtLink>
			<NuxtLink to="/user" :class="{ 'app-nav-active': isSection('/user') }">Users</NuxtLink>
			<NuxtLink to="/order" :class="{ 'app-nav-active': isSection('/order') }">Orders</NuxtLink>
			<NuxtLink to="/docbuilder" :class="{ 'app-nav-active': isSection('/docbuilder') }">DocBuilder</NuxtLink>
			<a class="app-nav-external" href="/graphql/" target="_blank" rel="noopener">GraphiQL</a>
		</nav>

		<main class="app-main">
			<NuxtPage />
		</main>

		<ClientOnly>
			<SheetNav :breadcrumbs="breadcrumbs" />
			<template #fallback>
				<div class="sheetnav-placeholder" />
			</template>
		</ClientOnly>
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

.app-nav {
	display: flex;
	gap: 1.5rem;
	padding: 1rem 2rem;
	background: var(--sc-gray-5);
	border-bottom: 1px solid var(--sc-header-border-color);
}

.app-nav a {
	color: var(--sc-gray-60);
	text-decoration: none;
	font-weight: 500;
}

.app-nav a:hover,
.app-nav a.app-nav-active {
	color: var(--sc-primary-color);
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
