<template>
	<div
		class="action-set"
		:class="{
			'action-set--expanded': isExpanded,
			'action-set--drawer-open': drawerOpen,
		}">
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
				<template v-if="activeTabId === ACTIONS_TAB_ID">
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
	</div>
</template>

<script setup lang="ts">
import { computed, markRaw, nextTick, ref, unref, watch, type Component } from 'vue'

import type { ActionSetController } from '../composables/useActionSet'
import { ActionSetIconActions, ActionSetIconSearch } from '../icons'
import type { ActionElements, ActionSetSlot } from '../types'

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
} = defineProps<{
	slots?: ActionSetSlot[]
	elements?: ActionElements[]
	controller: ActionSetController
}>()

const emit = defineEmits<{
	actionClick: [label: string, action: (() => void | Promise<void>) | undefined]
	search: []
}>()

const isExpanded = ref(true)
const drawerEl = ref<HTMLElement | null>(null)
const lastFocusedBeforeDrawer = ref<HTMLElement | null>(null)

const activeSlot = computed(() => slots.find(slot => slot.id === controller.activeSlotId.value) ?? null)
const hasActions = computed(() => elements.length > 0)
const activeTabId = computed(() => (controller.isActionsOpen.value ? ACTIONS_TAB_ID : controller.activeSlotId.value))
const drawerOpen = computed(() => controller.isDrawerOpen.value)

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

function onToggle() {
	isExpanded.value = !isExpanded.value
}

function onTileClick(tabId: string) {
	if (tabId === SEARCH_TAB_ID) {
		emit('search')
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
	if (open) {
		lastFocusedBeforeDrawer.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
		await nextTick()
		drawerEl.value?.querySelector<HTMLElement>('button:not([disabled]), [href], input, select, textarea')?.focus()
		return
	}
	lastFocusedBeforeDrawer.value?.focus()
	lastFocusedBeforeDrawer.value = null
})
</script>

<style scoped>
.action-set {
	/* Right offset + tile column width + gap: the strip the drawer keeps clear for the tile column. */
	--action-set-rail-inset: calc(10px + 2.75rem + 18px + 8px);
	position: fixed;
	top: var(--sc-action-set-offset-top);
	right: 10px;
	z-index: 1001;
	display: flex;
	flex-direction: row-reverse;
	align-items: flex-start;
	gap: 0;
}

/* Positioned above the drawer, which is a later sibling in the same stacking context. */
.action-set__tile {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 8px;
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
	margin-top: 8px;
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

.action-set__drawer {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	box-sizing: border-box;
	width: var(--sc-action-set-drawer-width);
	padding-right: var(--action-set-rail-inset);
	background: var(--sc-form-background);
	border-left: 1px solid var(--sc-gray-20);
	display: flex;
	flex-direction: column;
	z-index: 0;
}

.action-set__drawer-header {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: 8px 12px;
	flex-shrink: 0;
}

.action-set__drawer-close {
	flex-shrink: 0;
	border: none;
	background: transparent;
	font-size: 1.25rem;
	line-height: 1;
	cursor: pointer;
	color: var(--sc-gray-60);
	padding: 0.5rem;
	min-width: 2.75rem;
	min-height: 2.75rem;
}

.action-set__drawer-body {
	flex: 1;
	min-height: 0;
	overflow: auto;
}

.action-set__drawer-empty {
	padding: 16px 12px;
	margin: 0;
	color: var(--sc-gray-60);
	font-style: italic;
}

.action-set__actions-list {
	padding: 8px;
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
