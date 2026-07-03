<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div>
		<nav style="padding: 1rem; border-bottom: 1px solid #333; display: flex; gap: 1.5rem">
			<NuxtLink to="/">Home</NuxtLink>
			<NuxtLink to="/country">Countries</NuxtLink>
			<NuxtLink to="/continent">Continents</NuxtLink>
			<NuxtLink to="/language">Languages</NuxtLink>
			<NuxtLink to="/docbuilder">DocBuilder</NuxtLink>
		</nav>
		<main style="padding: 1.5rem">
			<slot />
		</main>
	</div>
</template>
