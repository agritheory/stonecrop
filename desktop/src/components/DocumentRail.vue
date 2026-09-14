<template>
	<div
		class="document-rail"
		:class="{
			'document-rail--expanded': isExpanded,
			'document-rail--drawer-open': drawerOpen,
		}">
		<div class="document-rail__tile">
			<button
				type="button"
				class="document-rail__toggle"
				:class="{ 'document-rail__toggle--expanded': isExpanded }"
				aria-label="Toggle menu"
				@click="onToggle">
				+
			</button>

			<template v-if="isExpanded && !drawerOpen">
				<button
					v-for="tab in allTabs"
					:key="tab.id"
					type="button"
					class="document-rail__item"
					:aria-label="tab.label"
					:title="tab.label"
					@click="onTileClick(tab.id)">
					<component :is="tab.icon" v-if="tab.icon" class="document-rail__item-icon" />
					<span v-else class="document-rail__item-fallback" aria-hidden="true">{{ slotFallback(tab.label) }}</span>
					<span v-if="tabBadge(tab) > 0" class="document-rail__item-badge">{{ tabBadge(tab) }}</span>
				</button>
			</template>
		</div>

		<aside v-if="drawerOpen" class="document-rail__drawer" role="dialog" :aria-label="activeTab?.label ?? 'Panel'">
			<header class="document-rail__drawer-header">
				<div class="document-rail__tabs" role="tablist">
					<button
						v-for="tab in allTabs"
						:key="tab.id"
						type="button"
						class="document-rail__tab"
						:class="{ 'document-rail__tab--active': activeTabId === tab.id }"
						role="tab"
						:aria-selected="activeTabId === tab.id"
						:aria-label="tab.label"
						:title="tab.label"
						@click="onTabClick(tab.id)">
						<component :is="tab.icon" v-if="tab.icon" class="document-rail__item-icon" />
						<span v-else class="document-rail__item-fallback" aria-hidden="true">{{ slotFallback(tab.label) }}</span>
						<span v-if="tabBadge(tab) > 0" class="document-rail__item-badge">{{ tabBadge(tab) }}</span>
					</button>
				</div>
				<button type="button" class="document-rail__drawer-close" aria-label="Close drawer" @click="onCloseDrawer">
					×
				</button>
			</header>
			<div class="document-rail__drawer-body">
				<template v-if="activeTabId === ACTIONS_TAB_ID">
					<div class="document-rail__actions-list">
						<template v-for="el in elements" :key="el.label">
							<button
								v-if="el.type === 'button'"
								type="button"
								class="document-rail__actions-list-item"
								:disabled="el.disabled"
								@click="onActionClick(el)">
								{{ el.label }}
							</button>
							<template v-else-if="el.type === 'dropdown'">
								<div class="document-rail__actions-group">
									<div class="document-rail__actions-group-label">{{ el.label }}</div>
									<button
										v-for="item in el.actions"
										:key="item.label"
										type="button"
										class="document-rail__actions-list-item document-rail__actions-list-item--nested"
										@click="onDropdownItemClick(item)">
										{{ item.label }}
									</button>
								</div>
							</template>
						</template>
						<p v-if="elements.length === 0" class="document-rail__actions-empty">No actions available</p>
					</div>
				</template>
				<template v-else-if="activeSlot">
					<component :is="activeSlot.component" v-if="activeSlot.component" :key="activeSlot.id" />
					<div v-else class="document-rail__drawer-empty"></div>
				</template>
			</div>
		</aside>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, unref, type Component } from 'vue'

import type { DocumentRailController } from '../composables/useDocumentRail'
import type { ActionElements, DocumentRailSlot, DocumentRailSlotId } from '../types'

const ACTIONS_TAB_ID = '__actions__'

type Tab = {
	id: string
	label: string
	icon?: Component
	badge?: number
}

const {
	slots = [],
	elements = [],
	rail,
} = defineProps<{
	slots?: DocumentRailSlot[]
	elements?: ActionElements[]
	rail: DocumentRailController
}>()

const emit = defineEmits<{
	actionClick: [label: string, action: (() => void | Promise<void>) | undefined]
	drawerChange: [open: boolean]
}>()

const isExpanded = ref(true)
const actionsTabOpen = ref(false)

const activeSlotId = computed(() => rail.activeSlotId.value)
const activeSlot = computed(() => slots.find(slot => slot.id === activeSlotId.value) ?? null)
const hasActions = computed(() => elements.length > 0)

const activeTabId = computed(() => {
	if (actionsTabOpen.value) return ACTIONS_TAB_ID
	return activeSlotId.value
})

const drawerOpen = computed(() => activeTabId.value !== null)

const allTabs = computed<Tab[]>(() => {
	const tabs: Tab[] = slots.map(slot => ({
		id: slot.id,
		label: slot.label,
		icon: slot.icon,
		badge: slot.badge !== undefined ? unref(slot.badge) : undefined,
	}))

	if (hasActions.value) {
		tabs.push({
			id: ACTIONS_TAB_ID,
			label: 'Actions',
			badge: undefined,
		})
	}

	return tabs
})

const activeTab = computed(() => allTabs.value.find(t => t.id === activeTabId.value) ?? null)

function slotFallback(label: string): string {
	return label.trim().charAt(0).toUpperCase() || '?'
}

function tabBadge(tab: Tab): number {
	const count = tab.badge
	return typeof count === 'number' && count > 0 ? count : 0
}

function onToggle() {
	isExpanded.value = !isExpanded.value
}

function onTileClick(tabId: string) {
	if (tabId === ACTIONS_TAB_ID) {
		actionsTabOpen.value = true
		emit('drawerChange', true)
	} else {
		actionsTabOpen.value = false
		rail.toggleSlot(tabId as DocumentRailSlotId)
	}
}

function onTabClick(tabId: string) {
	if (tabId === ACTIONS_TAB_ID) {
		actionsTabOpen.value = true
		rail.close()
		emit('drawerChange', true)
	} else {
		actionsTabOpen.value = false
		rail.openSlot(tabId as DocumentRailSlotId)
	}
}

function onCloseDrawer() {
	actionsTabOpen.value = false
	rail.close()
	emit('drawerChange', false)
}

function onActionClick(el: ActionElements) {
	if (el.type === 'button' && el.action) {
		emit('actionClick', el.label, el.action)
	}
}

function onDropdownItemClick(item: { label: string; action?: () => void }) {
	if (item.action) {
		emit('actionClick', item.label, item.action)
	}
}
</script>

<style scoped>
.document-rail {
	position: fixed;
	top: 300px;
	right: 10px;
	z-index: 1001;
	display: flex;
	flex-direction: row-reverse;
	align-items: flex-start;
	gap: 0;
}

.document-rail__tile {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 8px;
	background: var(--sc-form-background);
	border: 1px solid var(--sc-gray-20);
	border-left: 4px solid var(--sc-gray-20);
}

.document-rail__toggle {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2rem;
	height: 2rem;
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

.document-rail__toggle--expanded {
	transform: rotate(45deg);
}

.document-rail__item {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.4rem;
	height: 2.4rem;
	margin-top: 8px;
	padding: 0;
	border: 1px solid var(--sc-gray-20);
	background: transparent;
	cursor: pointer;
	font-family: var(--sc-font-family);
	color: var(--sc-gray-80);
}

.document-rail__item:hover,
.document-rail__item--active {
	background: var(--sc-btn-hover, #f2f2f2);
}

.document-rail__item-icon {
	width: 1rem;
	height: 1rem;
}

.document-rail__item-fallback {
	font-size: 0.85rem;
	font-weight: 600;
	line-height: 1;
}

.document-rail__item-badge {
	position: absolute;
	top: 2px;
	right: 2px;
	min-width: 14px;
	height: 14px;
	padding: 0 3px;
	border-radius: 7px;
	background: var(--sc-danger-color, #e03636);
	color: #fff;
	font-size: 9px;
	font-weight: 600;
	line-height: 14px;
	text-align: center;
	pointer-events: none;
}

.document-rail__drawer {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	width: var(--sc-rail-drawer-width, 380px);
	background: var(--sc-form-background);
	border-left: 1px solid var(--sc-gray-20);
	display: flex;
	flex-direction: column;
	z-index: 1000;
}

.document-rail__drawer-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 0 16px;
	height: 48px;
	border-bottom: 1px solid var(--sc-gray-20);
	flex-shrink: 0;
}

.document-rail__tabs {
	display: flex;
	align-items: center;
	gap: 4px;
	flex: 1;
	min-width: 0;
	overflow-x: auto;
}

.document-rail__tab {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.4rem;
	height: 2.4rem;
	padding: 0;
	border: none;
	border-radius: 6px;
	background: transparent;
	cursor: pointer;
	font-family: var(--sc-font-family);
	color: var(--sc-gray-80);
	opacity: 0.65;
	transition:
		opacity 0.15s,
		background-color 0.15s;
}

.document-rail__tab:hover {
	opacity: 1;
	background: var(--sc-btn-hover, #f2f2f2);
}

.document-rail__tab--active {
	opacity: 1;
	background: var(--sc-btn-hover, rgba(0, 0, 0, 0.08));
}

.document-rail__drawer-close {
	flex-shrink: 0;
	border: none;
	background: transparent;
	font-size: 1.25rem;
	line-height: 1;
	cursor: pointer;
	color: var(--sc-gray-60);
	padding: 0 4px;
}

.document-rail__drawer-body {
	flex: 1;
	min-height: 0;
	overflow: auto;
}

.document-rail__drawer-empty {
	min-height: 120px;
}

/* Actions list in drawer body */
.document-rail__actions-list {
	padding: 8px;
}

.document-rail__actions-list-item {
	display: block;
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
	cursor: pointer;
}

.document-rail__actions-list-item:hover {
	background: var(--sc-btn-hover, #f2f2f2);
}

.document-rail__actions-list-item:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.document-rail__actions-list-item--nested {
	margin-left: 16px;
	width: calc(100% - 16px);
	font-weight: 400;
}

.document-rail__actions-group {
	margin-bottom: 8px;
}

.document-rail__actions-group-label {
	padding: 8px 12px 4px;
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: var(--sc-gray-60);
}

.document-rail__actions-empty {
	padding: 16px 12px;
	margin: 0;
	color: var(--sc-gray-60);
	font-style: italic;
}
</style>
