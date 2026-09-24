<script setup lang="ts">
const { navGroups } = useDocsNav()
</script>

<template>
	<nav class="doc-contents" aria-label="Section contents">
		<div v-for="group in navGroups" :key="group.title" class="doc-contents__group">
			<p v-if="group.title" class="doc-contents__group-title">{{ group.title }}</p>
			<ul>
				<li v-for="link in group.links" :key="link.to">
					<NuxtLink :to="link.to">{{ link.text }}</NuxtLink>
				</li>
			</ul>
		</div>
	</nav>
</template>

<style scoped>
.doc-contents__group {
	margin-bottom: 1.25rem;
}

.doc-contents__group-title {
	margin: 0 0 0.4rem;
	font-size: 0.7rem;
	font-weight: 600;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: var(--doc-c-text-3);
}

.doc-contents__group ul {
	list-style: none;
	margin: 0;
	padding: 0;
}

.doc-contents__group a {
	display: block;
	padding: 0.35rem 0;
	color: var(--doc-c-text-2);
	text-decoration: none;
	font-size: 0.9rem;
}

.doc-contents__group a:hover,
.doc-contents__group a.router-link-exact-active {
	color: var(--doc-c-brand-1);
}
</style>
