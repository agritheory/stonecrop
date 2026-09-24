<script setup lang="ts">
definePageMeta({
	layout: 'playground',
})
</script>

<template>
	<div class="playground-hub-scroll">
		<div class="playground-hub">
			<h1>Playground</h1>
			<p>
				Live Desktop specimens over two backends: session-scoped grafserv data for workflow demos, and the public
				<a href="https://countries.trevorblades.com/graphql" target="_blank" rel="noopener">countries GraphQL API</a>
				for introspected doctypes.
			</p>

			<section>
				<h2>Workflow (local grafserv)</h2>
				<p>Orders and users with guarded transitions, rail panels on order records, and public DocBuilder.</p>
				<ul>
					<li><NuxtLink to="/playground/user">Users</NuxtLink></li>
					<li><NuxtLink to="/playground/order">Orders</NuxtLink></li>
				</ul>
			</section>

			<section>
				<h2>Countries (live GraphQL API)</h2>
				<ul>
					<li>
						<NuxtLink to="/playground/country">Countries</NuxtLink> — open a record (e.g.
						<NuxtLink to="/playground/country/US">/playground/country/US</NuxtLink>) for the SheetNav toolbar specimen
					</li>
					<li><NuxtLink to="/playground/continent">Continents</NuxtLink></li>
					<li><NuxtLink to="/playground/language">Languages</NuxtLink></li>
				</ul>
			</section>

			<section>
				<h2>DocBuilder</h2>
				<ul>
					<li><NuxtLink to="/docbuilder">All doctypes</NuxtLink></li>
					<li><NuxtLink to="/docbuilder/country">country</NuxtLink> — introspected fields are locked (provenance)</li>
					<li><NuxtLink to="/docbuilder/issue">issue</NuxtLink> — workflow graph fixture</li>
					<li><NuxtLink to="/docbuilder/assignment">assignment</NuxtLink></li>
				</ul>
			</section>

			<section>
				<h2>Tools</h2>
				<ul>
					<li><a href="/graphql/" target="_blank" rel="noopener">GraphiQL</a> — local grafserv schema</li>
				</ul>
			</section>
		</div>
	</div>
</template>

<style scoped>
.playground-hub-scroll {
	flex: 1;
	min-height: 0;
	overflow: auto;
}

.playground-hub {
	box-sizing: border-box;
	max-width: 1440px;
	margin: 0 auto;
	padding: 2rem 3rem 4.5rem;
}

.playground-hub section {
	margin-top: 2rem;
}

.playground-hub h2 {
	margin: 0 0 0.5rem;
	font-size: 1.1rem;
	color: var(--sc-gray-80);
}

.playground-hub p {
	color: var(--sc-gray-60);
	line-height: 1.5;
}

.playground-hub ul {
	margin: 0.5rem 0;
	padding-left: 1.25rem;
	line-height: 1.8;
	color: var(--sc-gray-60);
}

.playground-hub a {
	color: var(--sc-primary-color);
}
</style>
