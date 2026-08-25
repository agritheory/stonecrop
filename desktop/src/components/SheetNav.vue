<template>
	<footer>
		<ul class="tabs">
			<li class="hidebreadcrumbs" @click="toggleBreadcrumbs" @keydown.enter="toggleBreadcrumbs">
				<a tabindex="0"><div :class="rotateHideTabIcon">×</div></a>
			</li>
			<li
				class="hometab"
				:style="{ display: breadcrumbsVisibile ? 'block' : 'none' }"
				@click="navigateHome"
				@keydown.enter="navigateHome">
				<router-link to="/" tabindex="0">
					<svg class="icon" aria-label="Home" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M3 12l9-9 9 9" />
						<path d="M9 21V12h6v9" />
					</svg>
				</router-link>
			</li>
			<li
				:class="['searchtab', { 'search-active': searchVisible }]"
				:style="{ display: breadcrumbsVisibile ? 'block' : 'none' }">
				<a tabindex="0">
					<svg
						v-show="!searchVisible"
						class="icon search-icon"
						role="button"
						aria-label="Search"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						@click="toggleSearch"
						@keydown.enter="toggleSearch">
						<circle cx="11" cy="11" r="7" />
						<path d="M21 21l-4.35-4.35" />
					</svg>
					<input
						v-show="searchVisible"
						ref="searchinput"
						v-model="searchText"
						type="text"
						placeholder="Search..."
						@click.stop
						@input="handleSearchInput($event)"
						@blur="handleSearch($event)"
						@keydown.enter="handleSearch($event)"
						@keydown.escape="toggleSearch" />
				</a>
			</li>
			<li
				v-for="breadcrumb in breadcrumbs"
				:key="breadcrumb.title"
				:style="{ display: breadcrumbsVisibile ? 'block' : 'none' }">
				<router-link tabindex="0" :to="breadcrumb.to"> {{ breadcrumb.title }} </router-link>
			</li>
		</ul>
	</footer>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue'

const { breadcrumbs = [] } = defineProps<{ breadcrumbs?: { title: string; to: string }[] }>()

const breadcrumbsVisibile = ref(true)
const searchVisible = ref(false)
const searchText = ref('')
const inputRef = useTemplateRef<HTMLInputElement>('searchinput')

const rotateHideTabIcon = computed(() => {
	return breadcrumbsVisibile.value ? 'unrotated' : 'rotated'
})

const toggleBreadcrumbs = () => {
	breadcrumbsVisibile.value = !breadcrumbsVisibile.value
}

const toggleSearch = async () => {
	searchVisible.value = !searchVisible.value
	await nextTick(() => {
		inputRef.value?.focus()
	})
}

const handleSearchInput = (event: Event | MouseEvent) => {
	event.preventDefault()
	event.stopPropagation()
}

const handleSearch = async (event: FocusEvent | KeyboardEvent) => {
	event.preventDefault()
	event.stopPropagation()
	await toggleSearch()
}

const navigateHome = (/* event: MouseEvent | KeyboardEvent */) => {
	// navigate home
}
</script>

<style scoped>
footer {
	position: fixed;
	bottom: 0px;
	width: 100%;
	background-color: transparent;
	height: auto;
	min-height: 2.4rem;
	z-index: 100;
	text-align: left;
	font-size: 100%;
	display: flex;
	justify-content: right;
	padding: 0 0.75rem 0 0;
	box-sizing: border-box;
}
ul {
	display: flex;
	flex-direction: row-reverse;
	margin: 0;
	padding: 0;
	list-style: none;
}

.tabs li {
	float: left;
	list-style-type: none;
	position: relative;
	margin-left: -1px;
}

/* Base tab styling */
.tabs a {
	float: left;
	padding: 0.5rem 1rem;
	height: 2.4rem;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	color: var(--sc-gray-60);
	background: var(--sc-btn-color);
	border: 1px solid var(--sc-btn-border);
	font-size: 0.85rem;
	font-family: var(--sc-font-family);
	transition: all 0.15s ease;

	/* Minimal ornamentation - subtle top radius only */
	border-top-left-radius: 2px;
	border-top-right-radius: 2px;
}

.tabs a:hover {
	background: var(--sc-btn-hover);
}

.tabs .router-link-active {
	z-index: 3;
	background: var(--sc-primary-color) !important;
	border-color: var(--sc-primary-color) !important;
	color: var(--sc-primary-text-color) !important;
}

/* Pseudo-elements removed - minimal ornamentation style */

/* Hide breadcrumbs tab */
.hidebreadcrumbs a {
	min-width: 2.4rem;
	width: 2.4rem;
	height: 2.4rem;
	padding: 0.5rem;
	background: var(--sc-btn-color);
	border: 1px solid var(--sc-btn-border);
	color: var(--sc-gray-60);
}

.hidebreadcrumbs a div {
	font-size: 1.2rem;
}

.rotated {
	transform: rotate(45deg);
	-webkit-transform: rotate(45deg);
	-moz-transform: rotate(45deg);
	-ms-transform: rotate(45deg);
	-o-transform: rotate(45deg);
	transition: transform 250ms ease;
}
.unrotated {
	transform: rotate(0deg);
	-webkit-transform: rotate(0deg);
	-moz-transform: rotate(0deg);
	-ms-transform: rotate(0deg);
	-o-transform: rotate(0deg);
	transition: transform 250ms ease;
}

li:active,
li:hover,
li:focus,
li > a:active,
li > a:hover,
li > a:focus {
	z-index: 3;
}

a:active,
a:hover,
a:focus {
	outline: 2px solid var(--sc-input-active-border-color);
	z-index: 3;
}

/* Home tab */
.hometab a {
	min-width: 2.4rem;
	width: 2.4rem;
	height: 2.4rem;
	padding: 0.5rem;
	background: var(--sc-btn-color);
	border: 1px solid var(--sc-btn-border);
	color: var(--sc-gray-60);
}

/* SVG icon styling */
.icon {
	width: 1rem;
	height: 1rem;
	stroke: currentColor;
	flex-shrink: 0;
}

/* Search tab with animation */
.searchtab {
	overflow: hidden;
}

.searchtab a {
	min-width: 2.4rem;
	height: 2.4rem;
	padding: 0.5rem;
	background: var(--sc-btn-color);
	border: 1px solid var(--sc-btn-border);
	color: var(--sc-gray-60);
	overflow: hidden;
	/* Animation for smooth expand/collapse */
	max-width: 2.4rem;
	transition:
		max-width 0.35s ease-in-out,
		padding 0.35s ease-in-out,
		background 0.2s ease;
}

.searchtab .search-icon {
	cursor: pointer;
}

.searchtab input {
	outline: none;
	border: 1px solid var(--sc-input-border-color);
	border-radius: 0.25rem;
	background-color: var(--sc-form-background);
	color: var(--sc-gray-80);
	text-align: left;
	font-size: 0.875rem;
	padding: 0.25rem 0.5rem;
	width: 180px;
	height: 1.5rem;
	flex-shrink: 0;
	opacity: 0;
	transition: opacity 0.2s ease-in-out;
	transition-delay: 0s;
}

.searchtab input:focus {
	border-color: var(--sc-input-active-border-color);
	outline: none;
}

.searchtab input::placeholder {
	color: var(--sc-input-label-color);
}

/* Search active state - expanded with animation */
.searchtab.search-active a {
	max-width: 200px;
	min-width: auto;
	width: auto;
	padding: 0.5rem 0.75rem;
}

.searchtab.search-active input {
	opacity: 1;
	transition-delay: 0.15s;
}
</style>
