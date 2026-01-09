<script setup lang="ts">
// Home page for fullstack demo
// Layout follows F-pattern: critical info in top-left triangle,
// navigation cards below for efficient scanning
</script>

<template>
	<div class="home-page">
		<!-- Primary content in F-pattern upper area -->
		<section class="intro-section">
			<h1>Stonecrop Fullstack</h1>
			<p class="lead">
				A demonstration of Stonecrop's integrated frontend and backend capabilities for building data-intensive business
				applications.
			</p>
			<ul class="feature-list">
				<li>
					<strong>@stonecrop/nuxt</strong>
					<span>Frontend components, state management, and form handling</span>
				</li>
				<li>
					<strong>@stonecrop/nuxt-grafserv</strong>
					<span>GraphQL server with Grafast for efficient data access</span>
				</li>
			</ul>
		</section>

		<!-- Navigation cards - scannable from left edge per F-pattern -->
		<section class="nav-section">
			<h2>Modules</h2>
			<div class="nav-cards">
				<NuxtLink to="/user" class="nav-card">
					<h3>Users</h3>
					<p>Manage users with workflow states and role-based access control</p>
				</NuxtLink>
				<NuxtLink to="/order" class="nav-card">
					<h3>Orders</h3>
					<p>Order management with state machine transitions and audit trails</p>
				</NuxtLink>
				<NuxtLink to="/docbuilder" class="nav-card">
					<h3>DocBuilder</h3>
					<p>Visual editor for creating and modifying doctype schemas</p>
				</NuxtLink>
				<a href="/graphql/" target="_blank" class="nav-card">
					<h3>GraphiQL</h3>
					<p>Explore and test the GraphQL API directly in the browser</p>
				</a>
			</div>
		</section>

		<!-- Secondary info - lower priority per F-pattern -->
		<section class="info-section">
			<h2>Design Principles</h2>
			<div class="principle-grid">
				<div class="principle">
					<h4>F-Pattern Layout</h4>
					<p>
						Critical information placed where eyes naturally travel: top-left to top-right, then down the left edge.
					</p>
				</div>
				<div class="principle">
					<h4>Tables as Default</h4>
					<p>Tabular data maximizes visible information and enables row-by-row comparison without hidden content.</p>
				</div>
				<div class="principle">
					<h4>Gray-on-Gray</h4>
					<p>
						Reduced contrast minimizes eye strain. Color is reserved for semantic meaning: errors, warnings, success.
					</p>
				</div>
				<div class="principle">
					<h4>Minimal Ornamentation</h4>
					<p>Low border-radius, neutral typography, and clean letterforms communicate professional authority.</p>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped>
.home-page {
	max-width: 1000px;
	margin: 0 auto;
}

/* Intro section - F-pattern primary focus area */
.intro-section {
	margin-bottom: 3rem;
}

.intro-section h1 {
	color: var(--sc-gray-80);
	margin: 0 0 0.75rem 0;
	font-size: 2rem;
	font-weight: 600;
	letter-spacing: -0.02em;
}

.lead {
	color: var(--sc-gray-60);
	font-size: 1.1rem;
	margin: 0 0 1.5rem 0;
	line-height: 1.5;
}

.feature-list {
	list-style: none;
	padding: 0;
	margin: 0;
}

.feature-list li {
	display: flex;
	align-items: baseline;
	gap: 0.75rem;
	margin-bottom: 0.5rem;
	color: var(--sc-gray-60);
}

.feature-list strong {
	color: var(--sc-gray-80);
	font-family: var(--sc-font-family);
	background: var(--sc-gray-5);
	padding: 0.15em 0.4em;
	border: 1px solid var(--sc-gray-20);
	font-size: 0.9rem;
}

.feature-list span {
	color: var(--sc-gray-60);
}

/* Navigation section */
.nav-section {
	margin-bottom: 3rem;
}

.nav-section h2 {
	color: var(--sc-gray-60);
	font-size: 0.85rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	margin: 0 0 1rem 0;
	padding-bottom: 0.5rem;
	border-bottom: 1px solid var(--sc-gray-10);
}

.nav-cards {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 1rem;
}

/* Nav cards - minimal ornamentation, clear visual hierarchy */
.nav-card {
	display: block;
	padding: 1.25rem 1.5rem;
	background: var(--sc-form-background);
	border: 1px solid var(--sc-gray-20);
	border-left: 4px solid var(--sc-gray-50);
	border-radius: 0;
	text-decoration: none;
	color: inherit;
	transition: border-left-color 0.15s ease, background-color 0.15s ease;
}

.nav-card:hover {
	background: var(--sc-gray-5);
	border-left-color: var(--sc-primary-color);
}

.nav-card h3 {
	margin: 0 0 0.5rem 0;
	color: var(--sc-gray-80);
	font-size: 1.1rem;
	font-weight: 600;
}

.nav-card p {
	margin: 0;
	font-size: 0.9rem;
	color: var(--sc-gray-60);
	line-height: 1.4;
}

/* Info section - secondary content area */
.info-section h2 {
	color: var(--sc-gray-60);
	font-size: 0.85rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	margin: 0 0 1rem 0;
	padding-bottom: 0.5rem;
	border-bottom: 1px solid var(--sc-gray-10);
}

.principle-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 1rem;
}

.principle-grid .principle {
	border: 1px solid var(--sc-gray-10);
	border-left: 3px solid var(--sc-gray-50);
}

.principle {
	padding: 1rem 1.25rem;
	background: var(--sc-form-background);
	border: 1px solid var(--sc-gray-20);
	border-left: 3px solid var(--sc-gray-50);
	border-radius: 0;
}

.principle h4 {
	margin: 0 0 0.5rem 0;
	color: var(--sc-gray-80);
	font-size: 0.95rem;
	font-weight: 600;
}

.principle p {
	margin: 0;
	font-size: 0.85rem;
	color: var(--sc-gray-60);
	line-height: 1.5;
}
</style>
