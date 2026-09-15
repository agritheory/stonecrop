<template>
	<footer>
		<div class="sheetnav-footer-cluster">
			<div :id="SHEET_NAV_TOOLBAR_ID" class="sheetnav-toolbar">
				<slot name="toolbar" />
			</div>
			<ul class="tabs">
				<li class="hidebreadcrumbs">
					<button
						type="button"
						class="hidebreadcrumbs-btn"
						:aria-label="breadcrumbsVisibile ? 'Hide breadcrumbs' : 'Show breadcrumbs'"
						:aria-expanded="breadcrumbsVisibile"
						@click="toggleBreadcrumbs">
						<span :class="rotateHideTabIcon" aria-hidden="true">×</span>
					</button>
				</li>
				<li
					class="hometab"
					:style="{ display: breadcrumbsVisibile ? 'flex' : 'none' }"
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
					v-for="breadcrumb in breadcrumbs"
					:key="breadcrumb.title"
					:style="{ display: breadcrumbsVisibile ? 'flex' : 'none' }">
					<router-link tabindex="0" :to="breadcrumb.to"> {{ breadcrumb.title }} </router-link>
				</li>
			</ul>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { SHEET_NAV_TOOLBAR_ID, SHEET_NAV_TOOLBAR_SELECTOR } from '../sheet-nav-toolbar'

const { breadcrumbs = [] } = defineProps<{ breadcrumbs?: { title: string; to: string }[] }>()

onMounted(() => {
	if (document.querySelectorAll(SHEET_NAV_TOOLBAR_SELECTOR).length > 1) {
		console.warn(
			`More than one SheetNav is mounted: content teleported to ${SHEET_NAV_TOOLBAR_SELECTOR} lands in the first one only.`
		)
	}
})

const breadcrumbsVisibile = ref(true)

const rotateHideTabIcon = computed(() => {
	return breadcrumbsVisibile.value ? 'unrotated' : 'rotated'
})

const toggleBreadcrumbs = () => {
	breadcrumbsVisibile.value = !breadcrumbsVisibile.value
}

const navigateHome = (/* event: MouseEvent | KeyboardEvent */) => {
	// navigate home
}
</script>

<style scoped>
/* Pinned to both edges: without `left`, a fixed box takes its container's offset and overflows the
   viewport. Only the toolbar and the tabs take pointer events; the empty strip passes clicks through. */
footer {
	position: fixed;
	right: 0;
	bottom: 0;
	left: 0;
	pointer-events: none;
	background-color: transparent;
	z-index: 100;
	text-align: left;
	font-size: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
	padding: 0 1px 0 0;
	box-sizing: border-box;
}

/* When the toolbar and the tabs do not fit on one row, the toolbar wraps onto its own row above. */
.sheetnav-footer-cluster {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	align-items: flex-end;
	column-gap: 0.5rem;
	max-width: 100%;
	min-width: 0;
}

.sheetnav-toolbar {
	pointer-events: auto;
	min-width: 0;
	min-height: 2.4rem;
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	align-items: center;
}

.tabs {
	pointer-events: auto;
	flex: 0 0 auto;
	display: flex;
	flex-direction: row-reverse;
	align-items: stretch;
	height: 2.4rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.tabs li {
	display: flex;
	align-items: stretch;
	list-style-type: none;
	position: relative;
	margin-left: -1px;
}

.tabs a,
.hidebreadcrumbs-btn {
	height: 100%;
	min-height: 2.4rem;
	padding: 0 1rem;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	color: var(--sc-gray-60);
	background: var(--sc-btn-color);
	border: 1px solid var(--sc-form-border);
	border-radius: var(--sc-border-radius);
	font-size: 0.85rem;
	font-family: var(--sc-font-family);
	transition:
		background 0.15s ease,
		border-color 0.15s ease;
}

/* row-reverse: last visible li is the left edge of the strip. */
.tabs li:nth-last-child(1 of :not([style*='display: none'])) a,
.tabs li:nth-last-child(1 of :not([style*='display: none'])) .hidebreadcrumbs-btn {
	border-left-width: 4px;
}

.tabs a:hover,
.hidebreadcrumbs-btn:hover {
	background: var(--sc-btn-hover);
}

.tabs .router-link-exact-active {
	z-index: 3;
	background: var(--sc-gray-5);
	color: var(--sc-gray-80);
}

.hidebreadcrumbs-btn {
	min-width: 2.4rem;
	width: 2.4rem;
	padding: 0.5rem;
	cursor: pointer;
	font-size: 1.2rem;
	line-height: 1;
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
li > a:focus,
.hidebreadcrumbs-btn:hover,
.hidebreadcrumbs-btn:focus {
	z-index: 3;
}

a:focus,
.hidebreadcrumbs-btn:focus {
	outline: none;
}

a:focus-visible,
.hidebreadcrumbs-btn:focus-visible {
	outline: 1px solid var(--sc-input-active-border-color);
	outline-offset: -1px;
	z-index: 3;
}

.hometab a {
	min-width: 2.4rem;
	width: 2.4rem;
	padding: 0.5rem;
}

.icon {
	width: 1rem;
	height: 1rem;
	stroke: currentColor;
	flex-shrink: 0;
}
</style>
