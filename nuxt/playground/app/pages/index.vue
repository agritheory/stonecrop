<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div class="page-container">
		<div class="page-header">
			<h1>Stonecrop Playground</h1>
		</div>
		<p>
			The default <code>@stonecrop/nuxt</code> example: doctypes introspected from a public GraphQL API (<a
				href="https://countries.trevorblades.com/graphql"
				target="_blank"
				rel="noopener"
				>countries.trevorblades.com</a
			>), browsed through the Desktop shell, and refined in the DocBuilder.
		</p>

		<section>
			<h2>Browse (GraphQL-introspected doctypes)</h2>
			<ul>
				<li><NuxtLink to="/country">Countries</NuxtLink> — list + detail over the live API</li>
				<li><NuxtLink to="/continent">Continents</NuxtLink></li>
				<li><NuxtLink to="/language">Languages</NuxtLink></li>
			</ul>
		</section>

		<section>
			<h2>DocBuilder (dev mode only)</h2>
			<ul>
				<li>
					<NuxtLink to="/docbuilder">All doctypes</NuxtLink> — edit fields and workflows; saves to
					<code>doctypes/</code>
				</li>
				<li>
					<NuxtLink to="/docbuilder/country">country</NuxtLink> — introspected fields are locked (provenance), labels
					stay editable
				</li>
			</ul>
		</section>

		<section>
			<h2>Sample workflow doctypes</h2>
			<p>
				Hand-authored fixtures with workflow states — the countries API is read-only, so these exist to exercise the
				workflow graph and actions panel.
			</p>
			<ul>
				<li>
					<NuxtLink to="/docbuilder/issue">issue</NuxtLink> — branching workflow (multi-source transition + reopen loop)
				</li>
				<li><NuxtLink to="/docbuilder/assignment">assignment</NuxtLink></li>
			</ul>
		</section>
	</div>
</template>
