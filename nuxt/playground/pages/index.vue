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
				name: 'User Builder',
				path: '/builder/user',
				description: 'Visual builder for User doctype with state machines',
			},
			{
				name: 'Role Builder',
				path: '/builder/role',
				description: 'Visual builder for Role doctype with state machines',
			},
			{
				name: 'Profile Builder',
				path: '/builder/role-profile',
				description: 'Visual builder for Role Profile doctype',
			},
			{ name: 'Rule Builder', path: '/builder/ability-rule', description: 'Visual builder for Ability Rule doctype' },
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
						<div class="feature-icon">📊</div>
						<h3>Table Views (ATable)</h3>
						<p>Editable tables with Excel-like navigation for listing records</p>
					</div>
					<div class="feature-card">
						<div class="feature-icon">📝</div>
						<h3>Form Views (AForm)</h3>
						<p>Schema-driven forms with HST integration for editing records</p>
					</div>
					<div class="feature-card">
						<div class="feature-icon">🔐</div>
						<h3>Effective Permissions</h3>
						<p>Custom component displaying computed permissions from orpin SQL functions</p>
					</div>
					<div class="feature-card">
						<div class="feature-icon">🔧</div>
						<h3>DocBuilder</h3>
						<p>Visual builder for DocTypes with ability rules and state machines</p>
					</div>
					<div class="feature-card">
						<div class="feature-icon">🔄</div>
						<h3>State Machines</h3>
						<p>XState-powered FSM workflow integration with DocTypes</p>
					</div>
					<div class="feature-card">
						<div class="feature-icon">🌳</div>
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
	background: var(--sc-brand-color);
	color: var(--sc-primary-text-color);
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
}

.subtitle {
	font-size: 1.25rem;
	opacity: 0.9;
	max-width: 800px;
	margin: 0 auto;
	line-height: 1.6;
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
	background: rgba(255, 255, 255, 0.05);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 0.5rem;
	text-decoration: none;
	color: var(--sc-primary-text-color);
	transition: all 0.3s ease;
}

.nav-card:hover {
	background: rgba(255, 255, 255, 0.1);
	transform: translateY(-4px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	border-color: var(--sc-primary-color);
}

.nav-card h3 {
	margin: 0 0 0.5rem 0;
	font-size: 1.5rem;
	font-weight: 600;
}

.nav-card p {
	margin: 0;
	opacity: 0.9;
	line-height: 1.5;
}

.nav-arrow {
	position: absolute;
	right: 2rem;
	top: 50%;
	transform: translateY(-50%);
	font-size: 2rem;
	opacity: 0.5;
	transition: all 0.3s ease;
}

.nav-card:hover .nav-arrow {
	opacity: 1;
	transform: translateY(-50%) translateX(0.5rem);
}

.features-section,
.tech-stack {
	margin-top: 4rem;
	padding: 2rem;
	background: rgba(255, 255, 255, 0.05);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 0.5rem;
}

.features-section h2,
.tech-stack h2 {
	font-size: 1.75rem;
	margin-bottom: 2rem;
	font-weight: 600;
}

.features-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 1.5rem;
}

.feature-card {
	padding: 1.5rem;
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 0.5rem;
}

.feature-icon {
	font-size: 2.5rem;
	margin-bottom: 1rem;
}

.feature-card h3 {
	margin: 0 0 0.5rem 0;
	font-size: 1.25rem;
	font-weight: 600;
}

.feature-card p {
	margin: 0;
	opacity: 0.9;
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
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	line-height: 1.6;
}

.tech-stack li:last-child {
	border-bottom: none;
}

.tech-stack strong {
	color: var(--sc-primary-color);
}
</style>
