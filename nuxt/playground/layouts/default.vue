<script setup lang="ts">
const route = useRoute()

const isHome = computed(() => route.path === '/')
</script>

<template>
	<div class="app-layout" :class="{ 'is-home': isHome }">
		<nav v-if="!isHome" class="app-nav">
			<div class="nav-container">
				<NuxtLink to="/" class="nav-brand">
					<span class="brand-text">Stonecrop</span>
				</NuxtLink>
				<div class="nav-links">
					<NuxtLink to="/users" class="nav-link">Users</NuxtLink>
					<NuxtLink to="/roles" class="nav-link">Roles</NuxtLink>
					<NuxtLink to="/role-profiles" class="nav-link">Profiles</NuxtLink>
					<NuxtLink to="/ability-rules" class="nav-link">Rules</NuxtLink>
					<NuxtLink to="/doctypes" class="nav-link">DocTypes</NuxtLink>
				</div>
			</div>
		</nav>
		<main class="app-main">
			<slot />
		</main>
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
}

.app-layout.is-home {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-nav {
	background: white;
	border-bottom: 1px solid #e5e7eb;
	box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.nav-container {
	max-width: 1400px;
	margin: 0 auto;
	padding: 0 2rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 4rem;
}

.nav-brand {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	text-decoration: none;
	color: #111827;
	font-weight: 700;
	font-size: 1.25rem;
}

.nav-links {
	display: flex;
	gap: 2rem;
}

.nav-link {
	text-decoration: none;
	color: #6b7280;
	font-weight: 500;
	transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
	color: #4f46e5;
}

.app-main {
	flex: 1;
}
</style>
