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
					<span class="icon-placeholder" aria-label="Home">🏠</span>
				</router-link>
			</li>
			<li
				:class="['searchtab', { 'search-active': searchVisible }]"
				:style="{ display: breadcrumbsVisibile ? 'block' : 'none' }">
				<a tabindex="0">
					<span
						v-show="!searchVisible"
						class="search-icon"
						role="button"
						aria-label="Search"
						@click="toggleSearch"
						@keydown.enter="toggleSearch"
						>🔍</span
					>
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
	min-height: 2rem;
	z-index: 100;
	text-align: left;
	font-size: 100%;
	display: flex;
	justify-content: right;
	padding: 0 1rem 0 0;
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

/* Base tab styling - 15% larger for easier interaction */
.tabs a {
	float: left;
	padding: 0.575rem 1.725rem;
	height: 2.6rem;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	color: var(--sc-gray-80, #333);
	background: var(--sc-btn-color, #ffffff);
	border: 1px solid var(--sc-btn-border, #ccc);
	font-size: 1.15rem;
	transition: all 0.2s ease;

	/* Only round the top corners */
	-webkit-border-top-left-radius: 15px;
	-webkit-border-top-right-radius: 15px;
	-moz-border-radius-topleft: 15px;
	-moz-border-radius-topright: 15px;
	border-top-left-radius: 15px;
	border-top-right-radius: 15px;
}

.tabs a:hover {
	background: var(--sc-btn-hover, #f2f2f2);
}

.tabs .router-link-active {
	z-index: 3;
	background: var(--sc-primary-color, #827553) !important;
	border-color: var(--sc-primary-color, #827553) !important;
	color: var(--sc-primary-text-color, #fff) !important;
}

.tabs li:before,
.tabs li:after,
.tabs li a:before,
.tabs li a:after {
	position: absolute;
	bottom: 0;
}

.tabs li:last-child:after,
.tabs li:last-child a:after,
.tabs li:first-child:before,
.tabs li:first-child a:before,
.tabs .router-link-active:after,
.tabs .router-link-active:before,
.tabs .router-link-active a:after,
.tabs .router-link-active a:before {
	content: '';
}

.tabs .router-link-active:before,
.tabs .router-link-active:after {
	background: transparent;
	z-index: 1;
}

/* Squares */
.tabs li:before,
.tabs li:after {
	background: transparent;
	width: 10px;
	height: 10px;
}
.tabs li:before {
	left: -10px;
}
.tabs li:after {
	right: -10px;
}

/* Circles */
.tabs li a:after,
.tabs li a:before {
	width: 20px;
	height: 20px;
	-webkit-border-radius: 10px;
	-moz-border-radius: 10px;
	border-radius: 10px;
	background: transparent;
	z-index: 2;
}
.tabs .router-link-active a:after,
.tabs .router-link-active a:before {
	background: transparent;
}
.tabs li:first-child.router-link-active a:before,
.tabs li:last-child.router-link-active a:after {
	background: transparent;
}
.tabs li a:before {
	left: -20px;
}
.tabs li a:after {
	right: -20px;
}

/* Hide breadcrumbs tab - 15% larger */
.hidebreadcrumbs a {
	min-width: 2.875rem;
	width: 2.875rem;
	height: 2.6rem;
	padding: 0.575rem;
	background: var(--sc-btn-color, #ffffff);
	border: 1px solid var(--sc-btn-border, #ccc);
	color: var(--sc-gray-80, #333);
}

.hidebreadcrumbs a div {
	font-size: 1.45rem;
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
	outline: 2px solid var(--sc-input-active-border-color, black);
	z-index: 3;
}

/* Home tab - 15% larger */
.hometab a {
	min-width: 2.875rem;
	width: 2.875rem;
	height: 2.6rem;
	padding: 0.575rem;
	background: var(--sc-btn-color, #ffffff);
	border: 1px solid var(--sc-btn-border, #ccc);
	color: var(--sc-gray-80, #333);
}

.hometab .icon-placeholder {
	font-size: 1.15rem;
	line-height: 1;
}

/* Search tab with animation - similar to ActionSet expand/collapse */
.searchtab {
	overflow: hidden;
}

.searchtab a {
	min-width: 2.875rem;
	height: 2.6rem;
	padding: 0.575rem;
	background: var(--sc-btn-color, #ffffff);
	border: 1px solid var(--sc-btn-border, #ccc);
	color: var(--sc-gray-80, #333);
	overflow: hidden;
	/* Animation for smooth expand/collapse */
	max-width: 2.875rem;
	transition: max-width 0.35s ease-in-out, padding 0.35s ease-in-out, background 0.2s ease;
}

.searchtab .search-icon {
	font-size: 1.15rem;
	width: 1.15rem;
	height: 1.15rem;
	line-height: 1;
	cursor: pointer;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.searchtab input {
	outline: none;
	border: 1px solid var(--sc-input-border-color, #ccc);
	border-radius: 0.25rem;
	background-color: var(--sc-form-background, #ffffff);
	color: var(--sc-gray-80, #333);
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
	border-color: var(--sc-input-active-border-color, #4f46e5);
	outline: none;
}

.searchtab input::placeholder {
	color: var(--sc-input-label-color, #999);
}

/* Search active state - expanded with animation */
.searchtab.search-active a {
	max-width: 220px;
	min-width: auto;
	width: auto;
	padding: 0.575rem 0.75rem;
}

.searchtab.search-active input {
	opacity: 1;
	transition-delay: 0.15s;
}
</style>
