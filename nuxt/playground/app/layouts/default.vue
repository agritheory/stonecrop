<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div class="app-shell">
		<nav class="app-nav">
			<NuxtLink to="/" :class="{ 'app-nav-active': isSection('/') }">Home</NuxtLink>
			<NuxtLink to="/country" :class="{ 'app-nav-active': isSection('/country') }">Countries</NuxtLink>
			<NuxtLink to="/continent" :class="{ 'app-nav-active': isSection('/continent') }">Continents</NuxtLink>
			<NuxtLink to="/language" :class="{ 'app-nav-active': isSection('/language') }">Languages</NuxtLink>
			<NuxtLink to="/docbuilder" :class="{ 'app-nav-active': isSection('/docbuilder') }">DocBuilder</NuxtLink>
		</nav>
		<main class="app-main">
			<slot />
		</main>
	</div>
</template>

<script setup lang="ts">
// Nav section highlighting: a link stays lit while you're anywhere under its path
// (e.g. Countries stays active on /country/US). Home ('/') matches only the exact root.
const route = useRoute()
const isSection = (base: string) =>
	base === '/' ? route.path === '/' : route.path === base || route.path.startsWith(`${base}/`)
</script>

<style scoped>
.app-shell {
	min-height: 100vh;
	color: var(--sc-gray-80);
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
	padding: 1.5rem 2rem;
}
</style>
