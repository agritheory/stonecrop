<script setup lang="ts">
const navigationItems = [
	{
		title: 'Core Entities',
		items: [
			{ name: 'Users', path: '/users', description: 'Manage user accounts and permissions' },
			{ name: 'Roles', path: '/roles', description: 'Define roles and role hierarchies' },
			{ name: 'Role Profiles', path: '/role-profiles', description: 'Group multiple roles into profiles' },
			{ name: 'Ability Rules', path: '/ability-rules', description: 'Configure permission rules for roles' },
		],
	},
	{
		title: 'System Configuration',
		items: [{ name: 'DocTypes', path: '/doctypes', description: 'Manage document type definitions' }],
	},
	{
		title: 'DocBuilder',
		items: [
			{
				name: 'DocBuilder',
				path: '/docbuilder',
				description: 'Visual builder for doctypes — fields, workflow, and actions',
			},
		],
	},
	{
		title: 'Sample DocTypes',
		items: [
			{
				name: 'Issue',
				path: '/docbuilder/issue',
				description: 'Branching workflow — Resolve merges Draft + Assigned; Reopen returns Closed → Draft',
			},
			{
				name: 'Assignment',
				path: '/docbuilder/assignment',
				description: 'Task assignment — New → Draft → Completed → Cancelled',
			},
		],
	},
]
</script>

<template>
	<div class="home-container">
		<header class="home-header">
			<h1>Stonecrop Nuxt Playground</h1>
			<p class="subtitle">
				Example showcasing Stonecrop integration with Nuxt 4, featuring permission management, DocTypes, and state
				machines
			</p>
		</header>

		<div class="home-content">
			<section v-for="section in navigationItems" :key="section.title" class="nav-section">
				<h2>{{ section.title }}</h2>
				<div class="nav-grid">
					<NuxtLink v-for="item in section.items" :key="item.path" :to="item.path" class="nav-card">
						<h3>{{ item.name }}</h3>
						<p>{{ item.description }}</p>
						<span class="nav-arrow">→</span>
					</NuxtLink>
				</div>
			</section>

			<section class="features-section">
				<h2>Features Demonstrated</h2>
				<div class="features-grid">
					<div class="feature-card">
						<h3>Table Views (ATable)</h3>
						<p>Editable tables with Excel-like navigation for listing records</p>
					</div>
					<div class="feature-card">
						<h3>Form Views (AForm)</h3>
						<p>Schema-driven forms with HST integration for editing records</p>
					</div>
					<div class="feature-card">
						<h3>Effective Permissions</h3>
						<p>Custom component displaying computed permissions from orpin SQL functions</p>
					</div>
					<div class="feature-card">
						<h3>DocBuilder</h3>
						<p>Visual builder for DocTypes with ability rules and workflows</p>
					</div>
					<div class="feature-card">
						<h3>Workflows</h3>
						<p>XState-powered FSM workflow integration with DocTypes</p>
					</div>
					<div class="feature-card">
						<h3>HST Integration</h3>
						<p>Hierarchical State Tree for advanced state management</p>
					</div>
				</div>
			</section>

			<section class="tech-stack">
				<h2>Technology Stack</h2>
				<ul>
					<li><strong>Nuxt 4:</strong> Latest Nuxt framework with auto-imports and file-based routing</li>
					<li><strong>Stonecrop:</strong> Schema-driven UI framework with HST state management</li>
					<li><strong>AForm & ATable:</strong> Powerful form and table components</li>
					<li><strong>XState:</strong> Finite state machine workflow engine</li>
					<li><strong>PostgreSQL:</strong> Orpin schema for RBAC and state machines</li>
				</ul>
			</section>
		</div>
	</div>
</template>

<style scoped>
.home-container {
	min-height: 100vh;
	font-family: var(--sc-font-family);
	background: var(--sc-form-background);
}

.home-header {
	padding: 4rem 2rem 2rem;
	text-align: center;
	max-width: 1200px;
	margin: 0 auto;
}

.home-header h1 {
	font-size: 3rem;
	margin: 0 0 1rem 0;
	font-weight: 700;
	color: var(--sc-gray-80);
}

.subtitle {
	font-size: 1.25rem;
	max-width: 800px;
	margin: 0 auto;
	line-height: 1.6;
	color: var(--sc-gray-60);
}

.home-content {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
}

.nav-section {
	margin-bottom: 3rem;
}

.nav-section h2 {
	font-size: 1.75rem;
	margin-bottom: 1.5rem;
	font-weight: 600;
	color: var(--sc-gray-80);
}

.nav-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 1.5rem;
}

.nav-card {
	position: relative;
	display: block;
	padding: 2rem;
	background: var(--sc-form-background);
	border: 1px solid var(--sc-gray-20);
	border-left: 4px solid var(--sc-gray-20);
	border-radius: 0;
	text-decoration: none;
	color: var(--sc-gray-80);
}

.nav-card:hover {
	background: var(--sc-gray-5);
}

.nav-card h3 {
	margin: 0 0 0.5rem 0;
	font-size: 1.5rem;
	font-weight: 600;
}

.nav-card p {
	margin: 0;
	color: var(--sc-gray-60);
	line-height: 1.5;
}

.nav-arrow {
	position: absolute;
	right: 2rem;
	top: 50%;
	transform: translateY(-50%);
	font-size: 2rem;
	color: var(--sc-gray-50);
}

.nav-card:hover .nav-arrow {
	color: var(--sc-primary-color);
}

.features-section,
.tech-stack {
	margin-top: 4rem;
	padding: 2rem;
	background: var(--sc-form-background);
	border: 1px solid var(--sc-gray-20);
	border-left: 4px solid var(--sc-gray-20);
	border-radius: 0;
}

.features-section h2,
.tech-stack h2 {
	font-size: 1.75rem;
	margin-bottom: 2rem;
	font-weight: 600;
	color: var(--sc-gray-80);
}

.features-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 1.5rem;
}

.feature-card {
	padding: 1.5rem;
	background: var(--sc-gray-5);
	border: 1px solid var(--sc-gray-10);
	border-left: 4px solid var(--sc-gray-20);
	border-radius: 0;
}

.feature-card h3 {
	margin: 0 0 0.5rem 0;
	font-size: 1.25rem;
	font-weight: 600;
	color: var(--sc-gray-80);
}

.feature-card p {
	margin: 0;
	color: var(--sc-gray-60);
	font-size: 0.9rem;
	line-height: 1.5;
}

.tech-stack ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.tech-stack li {
	padding: 0.75rem 0;
	border-bottom: 1px solid var(--sc-gray-10);
	line-height: 1.6;
	color: var(--sc-gray-80);
}

.tech-stack li:last-child {
	border-bottom: none;
}

.tech-stack strong {
	color: var(--sc-primary-color);
}
</style>
