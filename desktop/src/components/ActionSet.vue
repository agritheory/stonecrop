<template>
	<div class="action-set">
		<aside
			v-if="drawerOpen"
			ref="drawerEl"
			class="action-set__drawer"
			aria-label="Side panel"
			@keydown="onDrawerKeydown">
			<header class="action-set__drawer-header">
				<button type="button" class="action-set__drawer-close" aria-label="Close panel" @click="controller.close()">
					×
				</button>
			</header>
			<div class="action-set__drawer-body">
				<CommandSearch
					v-if="activeTabId === SEARCH_TAB_ID && search"
					ref="searchEl"
					:search="search"
					:placeholder="searchPlaceholder"
					embedded
					autofocus
					@select="onSearchSelect">
					<template #title="{ result }">
						<slot name="search-title" :result="result">
							{{ searchResultTitle(result) }}
						</slot>
					</template>
					<template #content="{ result }">
						<slot name="search-content" :result="result">
							{{ searchResultDescription(result) }}
						</slot>
					</template>
				</CommandSearch>
				<template v-else-if="activeTabId === ACTIONS_TAB_ID">
					<div class="action-set__actions-list">
						<template v-for="el in elements" :key="el.label">
							<div v-if="el.type === 'dropdown'" class="action-set__actions-group" role="group" :aria-label="el.label">
								<p class="action-set__actions-group-label" aria-hidden="true">{{ el.label }}</p>
								<template v-for="item in el.actions" :key="item.label">
									<button
										v-if="item.action"
										type="button"
										class="action-set__actions-list-item action-set__actions-list-item--nested"
										@click="onActionClick(item.label, item.action)">
										{{ item.label }}
									</button>
									<a
										v-else-if="item.link"
										:href="item.link"
										class="action-set__actions-list-item action-set__actions-list-item--nested">
										{{ item.label }}
									</a>
								</template>
							</div>
							<a v-else-if="!el.action && el.link" :href="el.link" class="action-set__actions-list-item">
								{{ el.label }}
							</a>
							<button
								v-else
								type="button"
								class="action-set__actions-list-item"
								:disabled="el.disabled"
								@click="onActionClick(el.label, el.action)">
								{{ el.label }}
							</button>
						</template>
						<p v-if="elements.length === 0" class="action-set__actions-empty">No actions available</p>
					</div>
				</template>
				<template v-else-if="activeSlot">
					<component :is="activeSlot.component" v-if="activeSlot.component" :key="activeSlot.id" />
					<p v-else class="action-set__drawer-empty">No content</p>
				</template>
			</div>
		</aside>

		<div
			ref="tileRail"
			class="action-set__rail"
			:class="{
				'action-set__rail--drawer-open': drawerOpen,
				'action-set__rail--layout-ready': railLayoutReady,
			}"
			:style="tileRailStyle"
			:aria-hidden="!railLayoutReady">
			<button
				ref="dragHandle"
				type="button"
				class="action-set__drag-handle"
				aria-label="Drag action set vertically"
				title="Drag vertically" />
			<div class="action-set__tile" role="presentation">
				<button
					type="button"
					class="action-set__toggle"
					:class="{ 'action-set__toggle--expanded': isExpanded }"
					aria-label="Toggle menu"
					:aria-expanded="isExpanded"
					@click="onToggle">
					+
				</button>

				<template v-if="isExpanded">
					<button
						v-for="tab in allTabs"
						:key="tab.id"
						type="button"
						class="action-set__item"
						:class="{ 'action-set__item--active': drawerOpen && activeTabId === tab.id }"
						:aria-label="tab.label"
						:aria-current="drawerOpen && activeTabId === tab.id ? 'page' : undefined"
						:title="tab.label"
						@click="onTileClick(tab.id)">
						<component :is="tab.icon" v-if="tab.icon" class="action-set__item-icon" />
						<span v-else class="action-set__item-fallback" aria-hidden="true">{{ slotFallback(tab.label) }}</span>
						<span v-if="tabBadge(tab) > 0" class="action-set__item-badge">{{ tabBadge(tab) }}</span>
					</button>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useDraggable, useEventListener } from '@vueuse/core'
import {
	computed,
	markRaw,
	nextTick,
	onMounted,
	onUnmounted,
	ref,
	unref,
	useTemplateRef,
	watch,
	type Component,
} from 'vue'

import {
	clampTileTop as clampTileTopPure,
	isAtLowerVerticalLimit as isAtLowerVerticalLimitPure,
	SHEET_NAV_CLUSTER_SELECTOR,
	type ActionSetLayoutBounds,
} from '../action-set-layout'
import { readActionSetLayoutSession, writeActionSetLayoutSession } from '../action-set-layout-session'
import CommandSearch from './CommandSearch.vue'
import type { ActionSetController } from '../composables/useActionSet'
import { ActionSetIconActions, ActionSetIconSearch } from '../icons'
import type { ActionElements, ActionSetSlot } from '../types'

let tileGapProbe: HTMLDivElement | null = null

const ACTIONS_TAB_ID = '__actions__'
const SEARCH_TAB_ID = '__search__'

type Tab = {
	id: string
	label: string
	icon?: Component
	badge?: number
}

const {
	slots = [],
	elements = [],
	controller,
	search,
	searchPlaceholder = 'Type a command or search...',
} = defineProps<{
	slots?: ActionSetSlot[]
	elements?: ActionElements[]
	controller: ActionSetController
	search?: (query: string) => unknown[]
	searchPlaceholder?: string
}>()

defineSlots<{
	'search-title'?: { result: unknown }
	'search-content'?: { result: unknown }
}>()

const emit = defineEmits<{
	actionClick: [label: string, action: (() => void | Promise<void>) | undefined]
	searchSelect: [result: unknown]
}>()

const isExpanded = ref(true)

function readInitialTileTopPx(): number {
	if (typeof window === 'undefined') {
		return 0
	}
	const saved = readActionSetLayoutSession()
	if (saved.tileTopPx !== null) {
		return saved.tileTopPx
	}
	return resolveOffsetTopPx()
}

const initialTileTopPx = readInitialTileTopPx()
const railLayoutReady = ref(false)
const drawerEl = ref<HTMLElement | null>(null)
const searchEl = ref<{ reset: () => void; focus: () => void } | null>(null)
const lastFocusedBeforeDrawer = ref<HTMLElement | null>(null)

const activeSlot = computed(() => slots.find(slot => slot.id === controller.activeSlotId.value) ?? null)
const hasActions = computed(() => elements.length > 0)
const activeTabId = computed(() => {
	if (controller.isSearchOpen.value) return SEARCH_TAB_ID
	if (controller.isActionsOpen.value) return ACTIONS_TAB_ID
	return controller.activeSlotId.value
})
const drawerOpen = computed(() => controller.isDrawerOpen.value)

const tileRail = useTemplateRef('tileRail')
const dragHandle = useTemplateRef('dragHandle')

function resolveTileGapPx(): number {
	if (typeof document === 'undefined') return 4
	if (!tileGapProbe) {
		tileGapProbe = document.createElement('div')
		tileGapProbe.style.cssText =
			'position:absolute;visibility:hidden;pointer-events:none;height:0;width:var(--sc-action-set-tile-gap);'
		document.body.append(tileGapProbe)
	}
	const px = Number.parseFloat(getComputedStyle(tileGapProbe).width)
	return Number.isFinite(px) && px > 0 ? px : 4
}

function resolveOffsetTopPx(): number {
	if (typeof document === 'undefined') return 0
	const raw = getComputedStyle(document.documentElement).getPropertyValue('--sc-action-set-offset-top').trim() || '35vh'
	if (raw.endsWith('vh')) {
		return (Number.parseFloat(raw) / 100) * window.innerHeight
	}
	if (raw.endsWith('px')) {
		return Number.parseFloat(raw)
	}
	return window.innerHeight * 0.35
}

function resolveSheetNavTopPx(): number | null {
	if (typeof document === 'undefined') return null
	const cluster = document.querySelector(SHEET_NAV_CLUSTER_SELECTOR)
	if (!cluster) return null
	const top = cluster.getBoundingClientRect().top
	return Number.isFinite(top) ? top : null
}

function layoutBounds(): ActionSetLayoutBounds {
	return {
		margin: resolveTileGapPx(),
		innerHeight: typeof window === 'undefined' ? 0 : window.innerHeight,
		sheetNavTop: resolveSheetNavTopPx(),
	}
}

function clampTileTop(top: number): number {
	if (typeof window === 'undefined') return top
	const railHeight = tileRail.value?.offsetHeight ?? 0
	return clampTileTopPure(top, railHeight, layoutBounds())
}

function isAtLowerVerticalLimit(): boolean {
	if (!tileRail.value) return false
	return isAtLowerVerticalLimitPure(tileTopPx.value, tileRail.value.offsetHeight, layoutBounds())
}

function applyVerticalLimits(): void {
	tileTopPx.value = clampTileTop(tileTopPx.value)
}

function persistLayoutSession(): void {
	writeActionSetLayoutSession({ tileTopPx: tileTopPx.value })
}

const { y: tileTopPx } = useDraggable(tileRail, {
	axis: 'y',
	handle: dragHandle,
	preventDefault: true,
	initialValue: { x: 0, y: initialTileTopPx },
	onMove: pos => {
		tileTopPx.value = clampTileTop(pos.y)
	},
	onEnd: () => {
		applyVerticalLimits()
		persistLayoutSession()
	},
})

onMounted(() => {
	nextTick(() => {
		applyVerticalLimits()
		persistLayoutSession()
		requestAnimationFrame(() => {
			applyVerticalLimits()
			railLayoutReady.value = true
		})
	})
})

watch(tileTopPx, () => {
	persistLayoutSession()
})

watch(isExpanded, () => {
	nextTick(() => {
		applyVerticalLimits()
	})
})

useEventListener(typeof window !== 'undefined' ? window : null, 'resize', () => {
	applyVerticalLimits()
})

let sheetNavResizeObserver: ResizeObserver | null = null

onMounted(() => {
	const cluster = document.querySelector(SHEET_NAV_CLUSTER_SELECTOR)
	if (!cluster || typeof ResizeObserver === 'undefined') return
	sheetNavResizeObserver = new ResizeObserver(() => {
		applyVerticalLimits()
	})
	sheetNavResizeObserver.observe(cluster)
})

onUnmounted(() => {
	sheetNavResizeObserver?.disconnect()
	sheetNavResizeObserver = null
})

const tileRailStyle = computed(() => ({
	top: `${tileTopPx.value}px`,
}))

const allTabs = computed<Tab[]>(() => {
	const tabs: Tab[] = [
		{
			id: SEARCH_TAB_ID,
			label: 'Search',
			icon: markRaw(ActionSetIconSearch),
		},
	]

	for (const slot of slots) {
		tabs.push({
			id: slot.id,
			label: slot.label,
			icon: slot.icon,
			badge: slot.badge !== undefined ? unref(slot.badge) : undefined,
		})
	}

	if (hasActions.value) {
		tabs.push({
			id: ACTIONS_TAB_ID,
			label: 'Actions',
			icon: markRaw(ActionSetIconActions),
		})
	}

	return tabs
})

function slotFallback(label: string): string {
	return label.trim().charAt(0).toUpperCase() || '?'
}

function tabBadge(tab: Tab): number {
	const count = tab.badge
	return typeof count === 'number' && count > 0 ? count : 0
}

// The drawer sits beside the page rather than over it, so Tab is left to the browser: trapping it
// would strand keyboard users away from the page and from a preview opened out of the drawer.
function onDrawerKeydown(event: KeyboardEvent) {
	if (event.key !== 'Escape') return
	event.preventDefault()
	event.stopPropagation()
	controller.close()
}

async function onToggle() {
	if (isExpanded.value) {
		isExpanded.value = false
		await nextTick()
		applyVerticalLimits()
		return
	}

	const atLowerLimit = isAtLowerVerticalLimit()
	const heightBefore = tileRail.value?.offsetHeight ?? 0
	isExpanded.value = true
	await nextTick()
	if (atLowerLimit && tileRail.value) {
		const heightAfter = tileRail.value.offsetHeight
		tileTopPx.value -= heightAfter - heightBefore
	}
	applyVerticalLimits()
}

function searchResultTitle(result: unknown): string {
	return typeof result === 'object' && result !== null && 'title' in result
		? String((result as { title: unknown }).title)
		: ''
}

function searchResultDescription(result: unknown): string {
	return typeof result === 'object' && result !== null && 'description' in result
		? String((result as { description: unknown }).description)
		: ''
}

function onSearchSelect(result: unknown) {
	emit('searchSelect', result)
}

function onTileClick(tabId: string) {
	if (tabId === SEARCH_TAB_ID) {
		if (drawerOpen.value && activeTabId.value === SEARCH_TAB_ID) {
			controller.close()
		} else {
			controller.openSearch()
		}
	} else if (drawerOpen.value && activeTabId.value === tabId) {
		controller.close()
	} else if (tabId === ACTIONS_TAB_ID) {
		controller.openActions()
	} else {
		controller.openSlot(tabId)
	}
}

function onActionClick(label: string, action: (() => void) | undefined) {
	if (action) {
		emit('actionClick', label, action)
	}
}

watch(drawerOpen, async open => {
	if (typeof document === 'undefined') return
	if (open) {
		lastFocusedBeforeDrawer.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
		await nextTick()
		if (controller.isSearchOpen.value) {
			searchEl.value?.focus()
			return
		}
		drawerEl.value?.querySelector<HTMLElement>('button:not([disabled]), [href], input, select, textarea')?.focus()
		return
	}
	lastFocusedBeforeDrawer.value?.focus()
	lastFocusedBeforeDrawer.value = null
})

watch(
	() => controller.isSearchOpen.value,
	async open => {
		if (!open) return
		await nextTick()
		searchEl.value?.reset()
		searchEl.value?.focus()
	}
)
</script>

<style scoped>
.action-set__rail {
	position: fixed;
	right: var(--sc-action-set-tile-gap);
	z-index: 1002;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	visibility: hidden;
	pointer-events: none;
}

.action-set__rail--layout-ready {
	visibility: visible;
	pointer-events: auto;
}

.action-set__rail--drawer-open {
	right: calc(var(--sc-action-set-drawer-width) + var(--sc-action-set-tile-gap));
}

.action-set__drag-handle {
	box-sizing: border-box;
	width: 100%;
	height: 10px;
	padding: 0;
	border: 1px solid var(--sc-gray-20);
	border-bottom: none;
	border-radius: 0;
	background: var(--sc-gray-5);
	cursor: ns-resize;
	flex-shrink: 0;
}

.action-set__drag-handle::before {
	content: '';
	display: block;
	width: 1.25rem;
	height: 2px;
	margin: 3px auto 0;
	background: var(--sc-gray-50);
	box-shadow: 0 4px 0 var(--sc-gray-50);
}

.action-set__drag-handle:focus-visible {
	outline: 2px solid var(--sc-primary-color);
	outline-offset: 1px;
}

.action-set__tile {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 4px;
	padding: 4px;
	background: var(--sc-form-background);
	border: 1px solid var(--sc-gray-20);
}

.action-set__toggle {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.75rem;
	height: 2.75rem;
	padding: 0;
	border: none;
	background: transparent;
	font-size: 1.5rem;
	font-weight: 300;
	line-height: 1;
	color: var(--sc-gray-60);
	cursor: pointer;
	transition: transform 0.2s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
	.action-set__toggle {
		transition: none;
	}
}

.action-set__toggle--expanded {
	transform: rotate(45deg);
}

.action-set__toggle:focus-visible,
.action-set__item:focus-visible,
.action-set__drawer-close:focus-visible,
.action-set__actions-list-item:focus-visible {
	outline: 2px solid var(--sc-primary-color);
	outline-offset: 2px;
}

.action-set__item {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.75rem;
	height: 2.75rem;
	padding: 0;
	border: 1px solid var(--sc-gray-20);
	background: transparent;
	cursor: pointer;
	font-family: var(--sc-font-family);
	color: var(--sc-gray-80);
}

.action-set__item:hover,
.action-set__item--active {
	background: var(--sc-btn-hover);
}

.action-set__item-icon {
	display: block;
	width: 1rem;
	height: 1rem;
	flex-shrink: 0;
}

.action-set__item-fallback {
	font-size: 0.85rem;
	font-weight: 600;
	line-height: 1;
}

.action-set__item-badge {
	position: absolute;
	top: 2px;
	right: 2px;
	min-width: 14px;
	height: 14px;
	padding: 0 3px;
	border-radius: 7px;
	background: var(--sc-badge-danger-accent);
	color: var(--sc-primary-text-color);
	font-size: 10px;
	font-weight: 600;
	line-height: 14px;
	text-align: center;
	pointer-events: none;
}

/* Drawer flush to viewport right; workspace margin is drawer width minus 1px overlap (see Desktop.vue). */
.action-set__drawer {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	box-sizing: border-box;
	width: var(--sc-action-set-drawer-width);
	border-left: none;
	box-shadow: none;
	/* Divider as background fill — inset box-shadow can read as a full-height lane beside the seam in Firefox. */
	background: linear-gradient(
		to right,
		var(--sc-gray-20) 0,
		var(--sc-gray-20) 1px,
		var(--sc-form-background) 1px,
		var(--sc-form-background) 100%
	);
	display: flex;
	flex-direction: column;
	z-index: 1001;
}

.action-set__drawer-header {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: 4px 8px;
	flex-shrink: 0;
}

.action-set__drawer-close {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	background: transparent;
	font-size: 1.25rem;
	line-height: 1;
	cursor: pointer;
	color: var(--sc-gray-60);
	padding: 0;
	width: 2.75rem;
	height: 2.75rem;
}

.action-set__drawer-body {
	flex: 1;
	min-height: 0;
	overflow: auto;
	display: flex;
	flex-direction: column;
}

.action-set__drawer-body:not(:has(.command-search)) {
	padding: 0 12px 16px;
}

.action-set__drawer-empty {
	padding: 16px 12px;
	margin: 0;
	color: var(--sc-gray-60);
	font-style: italic;
}

.action-set__actions-list {
	padding: 0;
}

.action-set__actions-list-item {
	display: block;
	box-sizing: border-box;
	width: 100%;
	padding: 10px 12px;
	margin-bottom: 4px;
	border: 1px solid var(--sc-gray-20);
	background: transparent;
	text-align: left;
	font-size: 0.9rem;
	font-family: var(--sc-font-family);
	font-weight: 500;
	color: var(--sc-gray-80);
	text-decoration: none;
	cursor: pointer;
}

.action-set__actions-list-item:hover {
	background: var(--sc-btn-hover);
}

.action-set__actions-list-item:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.action-set__actions-list-item--nested {
	margin-left: 0;
	width: 100%;
	font-weight: 400;
}

.action-set__actions-group {
	margin-bottom: 8px;
}

.action-set__actions-group-label {
	margin: 4px 0 6px;
	padding: 0 2px;
	font-family: var(--sc-font-family);
	font-size: 0.75rem;
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--sc-gray-60);
}

.action-set__actions-empty {
	padding: 16px 12px;
	margin: 0;
	color: var(--sc-gray-60);
	font-style: italic;
}
</style>
