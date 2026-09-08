<template>
	<div class="document-rail">
		<div :class="{ collapsed: !isOpen }" class="document-rail__handle action-set">
			<div class="action-menu-icon">
				<div id="cross" :class="{ rotated: isOpen }" @click="toggleCollapse">×</div>
			</div>

			<button
				v-for="slot in slots"
				:key="slot.id"
				type="button"
				class="document-rail__slot-trigger"
				:class="{ 'document-rail__slot-trigger--active': activeSlotId === slot.id }"
				:aria-label="slot.label"
				:title="slot.label"
				@click="onSlotClick(slot.id)">
				<component :is="slot.icon" v-if="slot.icon" class="document-rail__slot-icon" />
				<span v-else class="document-rail__slot-fallback" aria-hidden="true">{{ slotFallback(slot.label) }}</span>
				<span v-if="slotBadge(slot) > 0" class="document-rail__slot-badge">{{ slotBadge(slot) }}</span>
			</button>

			<div v-show="isOpen" class="document-rail__actions">
				<div style="margin-right: 30px"></div>
				<div v-for="(el, index) in elements" :key="el.label" class="action-element">
					<div class="action-element-header">
						<button
							v-if="el.type == 'button'"
							:disabled="el.disabled"
							class="button-default"
							@click="handleClick(el.action, el.label)">
							{{ el.label }}
						</button>
					</div>
					<div v-if="el.type == 'dropdown'">
						<div class="dropdown-header">
							<div class="cross" :class="{ rotated: dropdownOpen[index] }" @click="toggleDropdown(index)">×</div>
							<button class="button-default dropdown-title" @click="toggleDropdown(index)">
								{{ el.label }}
							</button>
						</div>
						<div v-show="dropdownStates[index]" class="dropdown-container">
							<div class="dropdown">
								<div v-for="item in el.actions" :key="item.label">
									<button
										v-if="item.action != null"
										class="dropdown-item"
										@click="handleClick(item.action, item.label)">
										{{ item.label }}
									</button>
									<a v-else-if="item.link != null" :href="item.link">
										<button class="dropdown-item">{{ item.label }}</button>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<aside v-if="activeSlotId && activeSlot" class="document-rail__drawer" role="dialog" :aria-label="activeSlot.label">
			<header class="document-rail__drawer-header">
				<h2 class="document-rail__drawer-title">{{ activeSlot.label }}</h2>
				<button type="button" class="document-rail__drawer-close" aria-label="Close drawer" @click="onCloseDrawer">
					×
				</button>
			</header>
			<div class="document-rail__drawer-body">
				<component :is="activeSlot.component" v-if="activeSlot.component" :key="activeSlot.id" />
				<div v-else class="document-rail__drawer-empty"></div>
			</div>
		</aside>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, unref } from 'vue'

import type { ActionElements, DocumentRailSlot, DocumentRailSlotId } from '../types'
import type { DocumentRailController } from '../composables/useDocumentRail'

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
}>()

const isOpen = ref(true)
const dropdownStates = ref<Record<number, boolean>>({})
const dropdownOpen = ref<boolean[]>([])

const activeSlotId = computed(() => rail.activeSlotId.value)

const activeSlot = computed(() => slots.find(slot => slot.id === activeSlotId.value) ?? null)

onMounted(() => {
	closeDropdowns()
})

function slotFallback(label: string): string {
	return label.trim().charAt(0).toUpperCase() || '?'
}

function slotBadge(slot: DocumentRailSlot): number {
	if (slot.badge === undefined) {
		return 0
	}
	const count = unref(slot.badge)
	return typeof count === 'number' && count > 0 ? count : 0
}

function closeDropdowns() {
	dropdownStates.value = {}
	dropdownOpen.value = []
}

function toggleCollapse() {
	isOpen.value = !isOpen.value
}

function onSlotClick(slotId: DocumentRailSlotId) {
	rail.toggleSlot(slotId)
}

function onCloseDrawer() {
	rail.close()
}

function toggleDropdown(index: number) {
	const showDropdown = !dropdownStates.value[index]
	closeDropdowns()
	if (showDropdown) {
		dropdownStates.value[index] = true
		dropdownOpen.value[index] = true
	}
}

function handleClick(action: (() => void | Promise<void>) | undefined, label: string) {
	emit('actionClick', label, action)
}
</script>

<style scoped>
.document-rail__handle {
	position: fixed;
	top: 300px;
	right: 10px;
	padding: 10px;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	background: var(--sc-form-background);
	border: 1px solid var(--sc-gray-20);
	border-left: 4px solid var(--sc-gray-20);
	border-radius: 0;
	overflow: hidden;
	z-index: 1001;
	transition: all 0.5s ease-in-out;
}

.document-rail__handle.collapsed {
	max-width: 46px;
	max-height: 40px;
	overflow: hidden;
}

.document-rail__handle.collapsed .document-rail__actions {
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.25s ease-in-out;
}

.document-rail__slot-trigger {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	min-width: 36px;
	margin-top: 8px;
	padding: 0;
	border: 1px solid var(--sc-gray-20);
	background: transparent;
	cursor: pointer;
	font-family: var(--sc-font-family);
	color: var(--sc-gray-80);
}

.document-rail__slot-trigger:hover,
.document-rail__slot-trigger--active {
	background: #f2f2f2;
}

.document-rail__slot-icon {
	width: 1.1rem;
	height: 1.1rem;
}

.document-rail__slot-fallback {
	font-size: 0.875rem;
	font-weight: 600;
	line-height: 1;
}

.document-rail__slot-badge {
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
}

.document-rail__actions {
	width: 100%;
}

.document-rail__drawer {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	width: var(--sc-rail-drawer-width, 380px);
	background: var(--sc-form-background);
	border-left: 1px solid var(--sc-gray-20);
	box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
	z-index: 1000;
	display: flex;
	flex-direction: column;
}

.document-rail__drawer-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 16px;
	height: 48px;
	border-bottom: 1px solid var(--sc-gray-20);
	flex-shrink: 0;
}

.document-rail__drawer-title {
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
	font-family: var(--sc-font-family);
	color: var(--sc-gray-80);
}

.document-rail__drawer-close {
	border: none;
	background: transparent;
	font-size: 1.5rem;
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

/* ActionSet action styles (shared visual language) */
#cross {
	position: relative;
	transform: rotate(45deg);
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	user-select: none;
	line-height: 1rem;
}

#cross.rotated,
.cross.rotated {
	transform: rotate(0deg);
}

.action-menu-icon {
	position: relative;
	font-size: 2rem;
	display: inline-block;
	color: var(--sc-gray-60);
	transition: all 0.2s ease-in-out;
}

.action-element {
	width: 100%;
	text-align: right;
	border: 1px solid var(--sc-gray-20);
	background: none;
	font-size: 0.875rem;
	font-family: var(--sc-font-family);
	font-weight: 600;
	margin-top: 8px;
	position: relative;
}

.action-element-header {
	display: flex;
	justify-content: end;
}

button.button-default {
	background-color: transparent;
	padding: 4px 10px;
	border-radius: 0;
	box-shadow: none;
	border: none;
	cursor: pointer;
	white-space: nowrap;
	font-weight: 600;
	font-size: 0.8125rem;
	text-align: right;
	color: var(--sc-gray-80);
	padding-left: 12px;
	font-family: var(--sc-font-family);
}

.dropdown-header:hover button.button-default,
.dropdown-header:hover,
.action-element-header:hover {
	background-color: #f2f2f2;
}

.dropdown-header {
	display: flex;
	align-items: center;
}

.cross {
	pointer-events: all;
	margin-left: 5px;
	font-family: var(--sc-font-family);
	color: var(--sc-gray-60);
	cursor: pointer;
	transform: rotate(45deg);
	user-select: none;
	transition: all 0.2s ease-in-out;
	line-height: 1rem;
}

button.dropdown-item {
	width: 100%;
	padding: 4px 10px;
	text-align: right;
	border: none;
	background-color: #ffffff;
	cursor: pointer;
	border-radius: 5px;
	font-size: 0.8125rem;
}

button.dropdown-item:hover {
	background-color: #f2f2f2;
}
</style>
