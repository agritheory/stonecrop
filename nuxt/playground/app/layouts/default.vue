<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div class="app-shell">
		<nav class="app-nav">
			<NuxtLink to="/" exact-active-class="app-nav-active">Home</NuxtLink>
			<NuxtLink to="/country" active-class="app-nav-active">Countries</NuxtLink>
			<NuxtLink to="/continent" active-class="app-nav-active">Continents</NuxtLink>
			<NuxtLink to="/language" active-class="app-nav-active">Languages</NuxtLink>
			<NuxtLink to="/docbuilder" active-class="app-nav-active">DocBuilder</NuxtLink>
		</nav>
		<main class="app-main">
			<slot />
		</main>
	</div>
</template>

<style scoped>
.app-shell {
	min-height: 100vh;
	font-family: var(--sc-font-family);
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
