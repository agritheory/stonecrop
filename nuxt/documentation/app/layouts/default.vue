<script setup lang="ts">
import { SheetNav } from '@stonecrop/desktop'

const route = useRoute()

// Breadcrumb trail for SheetNav's bottom bar — same path-segment-title-casing logic already
// established in nuxt/fullstack/app/app.vue for the same component.
const breadcrumbs = computed(() => {
	const parts = route.path.split('/').filter(Boolean)
	const crumbs: Array<{ title: string; to: string }> = []

	let currentPath = ''
	for (const segment of parts) {
		currentPath += `/${segment}`
		const title = segment
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
		crumbs.push({ title, to: currentPath })
	}

	return crumbs
})

// Ported from docs/.vitepress/config.ts's `themeConfig.sidebar` — same four Diátaxis
// sections (Tutorials/Guides/Reference/Explanation), Components folded into Reference.
const sidebarSections = [
	{
		prefix: '/components/',
		groups: [
			{ title: 'Components', links: [{ text: 'Overview', to: '/components/' }] },
			{
				title: 'Form',
				links: [
					{ text: 'Form', to: '/components/form' },
					{ text: 'Form Loading', to: '/components/form-loading' },
					{ text: 'Fieldset', to: '/components/fieldset' },
					{ text: 'Checkbox', to: '/components/checkbox' },
					{ text: 'Badge', to: '/components/badge' },
					{ text: 'Text Input', to: '/components/text-input' },
					{ text: 'Textbox Input', to: '/components/textbox-input' },
					{ text: 'Numeric Input', to: '/components/numeric-input' },
					{ text: 'Dropdown', to: '/components/dropdown' },
					{ text: 'File Attach', to: '/components/file-attach' },
					{ text: 'Date', to: '/components/date' },
					{ text: 'Date Range', to: '/components/date-range' },
					{ text: 'Date Time', to: '/components/date-time' },
					{ text: 'Date Selection', to: '/components/date-selection' },
					{ text: 'Date Picker', to: '/components/date-picker' },
					{ text: 'Duration', to: '/components/duration' },
					{ text: 'Form Link', to: '/components/form-link' },
					{ text: 'Currency', to: '/components/currency' },
					{ text: 'Quantity Input', to: '/components/quantity-input' },
					{ text: 'Login', to: '/components/login' },
					{ text: 'Collapse Button', to: '/components/collapse-button' },
				],
			},
			{
				title: 'Tables',
				links: [
					{ text: 'Table', to: '/components/table' },
					{ text: 'Table Loading', to: '/components/table-loading' },
				],
			},
			{
				title: 'Desktop',
				links: [
					{ text: 'Command Palette', to: '/components/command-palette' },
					{ text: 'Action Set', to: '/components/action-set' },
				],
			},
			{
				title: 'Editors',
				links: [
					{ text: 'Code Editor', to: '/components/code-editor' },
					{ text: 'Node Editor', to: '/components/node-editor' },
				],
			},
		],
	},
	{
		prefix: '/tutorials/',
		groups: [{ title: 'Tutorials', links: [{ text: 'Overview', to: '/tutorials/' }] }],
	},
	{
		prefix: '/guides/',
		groups: [
			{
				title: 'Guides',
				links: [
					{ text: 'Overview', to: '/guides/' },
					{ text: 'Desktop Integration', to: '/guides/desktop-integration' },
					{ text: 'GraphQL Middleware Setup', to: '/guides/graphql-middleware-setup' },
					{ text: 'CASL Middleware Setup', to: '/guides/casl-middleware-setup' },
					{ text: 'Custom Fetch Handlers', to: '/guides/custom-fetch-handlers' },
				],
			},
			{
				title: 'Examples',
				links: [{ text: 'App Examples', to: '/guides/app-examples' }],
			},
		],
	},
	{
		prefix: '/reference/',
		groups: [
			{ title: 'Introduction', links: [{ text: 'Overview', to: '/reference/' }] },
			{ title: 'Components', links: [{ text: 'Live component docs', to: '/components/' }] },
			{
				title: 'Core Packages',
				links: [
					{ text: 'stonecrop', to: '/reference/stonecrop' },
					{ text: 'aform', to: '/reference/aform' },
					{ text: 'atable', to: '/reference/atable' },
				],
			},
			{
				title: 'UI Components',
				links: [
					{ text: 'beam', to: '/reference/beam' },
					{ text: 'desktop', to: '/reference/desktop' },
					{ text: 'node-editor', to: '/reference/node-editor' },
					{ text: 'code-editor', to: '/reference/code-editor' },
				],
			},
			{
				title: 'Backend / Middleware',
				links: [
					{ text: 'schema', to: '/reference/schema' },
					{ text: 'graphql-client', to: '/reference/graphql-client' },
					{ text: 'graphql-middleware', to: '/reference/graphql-middleware' },
					{ text: 'casl-middleware', to: '/reference/casl-middleware' },
					{ text: 'rockfoil', to: '/reference/rockfoil' },
				],
			},
			{
				title: 'Utilities',
				links: [
					{ text: 'utilities', to: '/reference/utilities' },
					{ text: 'themes', to: '/reference/themes' },
				],
			},
			{
				title: 'Nuxt Integration',
				links: [
					{ text: 'nuxt', to: '/reference/nuxt' },
					{ text: 'nuxt-grafserv', to: '/reference/nuxt-grafserv' },
				],
			},
		],
	},
	{
		prefix: '/explanation/',
		groups: [
			{
				title: 'Introduction',
				links: [
					{ text: 'Overview', to: '/explanation/' },
					{ text: 'Core Concepts', to: '/explanation/core-concepts' },
					{ text: 'Doctypes', to: '/explanation/doctype' },
				],
			},
			{ title: 'Design', links: [{ text: 'Design Philosophy', to: '/explanation/philosophy' }] },
			{
				title: 'Middleware',
				links: [
					{ text: 'GraphQL Middleware', to: '/explanation/graphql-middleware' },
					{ text: 'CASL Middleware', to: '/explanation/casl-middleware' },
				],
			},
		],
	},
]

const defaultGroups = [
	{
		title: '',
		links: [
			{ text: 'Home', to: '/' },
			{ text: 'Tutorials', to: '/tutorials/' },
			{ text: 'Guides', to: '/guides/' },
			{ text: 'Reference', to: '/reference/' },
			{ text: 'Explanation', to: '/explanation/' },
		],
	},
]

const sidebarGroups = computed(() => {
	const section = sidebarSections.find(s => route.path.startsWith(s.prefix))
	return section ? section.groups : defaultGroups
})
</script>

<template>
	<div class="doc-shell">
		<nav class="doc-nav">
			<NuxtLink to="/" class="doc-nav__logo">Stonecrop</NuxtLink>
			<div class="doc-nav__links">
				<NuxtLink to="/tutorials/">Tutorials</NuxtLink>
				<NuxtLink to="/guides/">Guides</NuxtLink>
				<NuxtLink to="/reference/">Reference</NuxtLink>
				<NuxtLink to="/explanation/">Explanation</NuxtLink>
			</div>
			<DocsSearch />
		</nav>

		<div class="doc-layout">
			<main class="doc-main">
				<div class="doc-content">
					<slot />
				</div>
			</main>

			<aside class="doc-sidebar">
				<div v-for="group in sidebarGroups" :key="group.title" class="doc-sidebar__group">
					<p v-if="group.title" class="doc-sidebar__group-title">{{ group.title }}</p>
					<ul>
						<li v-for="link in group.links" :key="link.to">
							<NuxtLink :to="link.to">{{ link.text }}</NuxtLink>
						</li>
					</ul>
				</div>
			</aside>
		</div>

		<ClientOnly>
			<SheetNav :breadcrumbs="breadcrumbs" />
		</ClientOnly>
	</div>
</template>
