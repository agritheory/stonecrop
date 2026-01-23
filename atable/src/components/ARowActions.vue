<template>
	<td
		ref="actionsCell"
		class="atable-row-actions"
		:class="{ 'sticky-column': position === 'before-index', 'dropdown-active': dropdownOpen }">
		<!-- Dropdown mode -->
		<div v-if="showDropdown" class="row-actions-dropdown">
			<button
				ref="toggleButton"
				type="button"
				class="row-actions-toggle"
				:aria-expanded="dropdownOpen"
				aria-haspopup="true"
				@click.stop="toggleDropdown">
				<span class="dropdown-icon">⋮</span>
			</button>
			<div
				v-show="dropdownOpen"
				class="row-actions-menu"
				:class="{ 'menu-flipped': dropdownFlipped }"
				:style="menuStyle"
				role="menu">
				<button
					v-for="action in enabledActions"
					:key="action.type"
					type="button"
					class="row-action-menu-item"
					role="menuitem"
					@click.stop="executeAction(action.type)">
					<span class="action-icon" v-html="action.icon" />
					<span class="action-label">{{ action.label }}</span>
				</button>
			</div>
		</div>

		<!-- Icon mode -->
		<div v-else class="row-actions-icons">
			<button
				v-for="action in enabledActions"
				:key="action.type"
				type="button"
				class="row-action-btn"
				:title="action.label"
				:aria-label="action.label"
				@click.stop="executeAction(action.type)">
				<span class="action-icon" v-html="action.icon" />
			</button>
		</div>
	</td>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { computed, ref, useTemplateRef, onMounted, onUnmounted } from 'vue'

import { actionIcons } from '../icons'
import { createTableStore } from '../stores/table'
import type { RowActionsConfig, RowActionType, RowActionOptions } from '../types'

const props = defineProps<{
	rowIndex: number
	store: ReturnType<typeof createTableStore>
	config: RowActionsConfig
	position?: 'before-index' | 'after-index' | 'end'
}>()

const emit = defineEmits<{
	action: [type: RowActionType, rowIndex: number]
}>()

const actionsCellRef = useTemplateRef<HTMLTableCellElement>('actionsCell')
const toggleButtonRef = useTemplateRef<HTMLButtonElement>('toggleButton')
const cellWidth = ref(0)
const dropdownOpen = ref(false)
const dropdownFlipped = ref(false)
const menuPosition = ref({ top: 0, left: 0 })

// Default labels for actions
const defaultLabels: Record<RowActionType, string> = {
	add: 'Add Row',
	delete: 'Delete Row',
	duplicate: 'Duplicate Row',
	insertAbove: 'Insert Above',
	insertBelow: 'Insert Below',
	move: 'Move Row',
}

// Determine which actions are enabled
const enabledActions = computed(() => {
	const actions: Array<{ type: RowActionType; label: string; icon: string }> = []
	const configActions = props.config.actions || {}

	const actionTypes: RowActionType[] = ['add', 'delete', 'duplicate', 'insertAbove', 'insertBelow', 'move']

	for (const type of actionTypes) {
		const actionConfig = configActions[type]

		// Skip if explicitly disabled
		if (actionConfig === false) continue

		// Skip if not configured and we're being explicit
		if (actionConfig === undefined) continue

		let enabled = true
		let label = defaultLabels[type]
		let icon = actionIcons[type]

		if (typeof actionConfig === 'object') {
			const opts = actionConfig as RowActionOptions
			enabled = opts.enabled !== false
			label = opts.label || label
			icon = opts.icon || icon
		}

		if (enabled) {
			actions.push({ type, label, icon })
		}
	}

	return actions
})

// Determine if we should show dropdown mode
const showDropdown = computed(() => {
	if (props.config.forceDropdown) return true

	const threshold = props.config.dropdownThreshold ?? 150
	if (threshold === 0) return false

	return cellWidth.value > 0 && cellWidth.value < threshold
})

// Compute menu style for fixed positioning
const menuStyle = computed(() => {
	if (!dropdownOpen.value) return {}

	if (dropdownFlipped.value) {
		return {
			position: 'fixed' as const,
			bottom: `${window.innerHeight - menuPosition.value.top}px`,
			left: `${menuPosition.value.left}px`,
			top: 'auto',
		}
	}
	return {
		position: 'fixed' as const,
		top: `${menuPosition.value.top}px`,
		left: `${menuPosition.value.left}px`,
	}
})

// Track cell width for responsive behavior
useResizeObserver(actionsCellRef, entries => {
	const entry = entries[0]
	if (entry) {
		cellWidth.value = entry.contentRect.width
	}
})

// Toggle dropdown menu
const toggleDropdown = () => {
	if (!dropdownOpen.value) {
		// Opening - check if we need to flip
		checkDropdownPosition()
	}
	dropdownOpen.value = !dropdownOpen.value
}

// Check if dropdown should flip upward and calculate position
const checkDropdownPosition = () => {
	if (!toggleButtonRef.value) return

	const buttonRect = toggleButtonRef.value.getBoundingClientRect()
	const viewportHeight = window.innerHeight
	const estimatedMenuHeight = enabledActions.value.length * 40 + 16 // ~40px per item + padding

	// Check if menu would extend beyond viewport bottom
	const spaceBelow = viewportHeight - buttonRect.bottom
	const spaceAbove = buttonRect.top

	// Flip if not enough space below but enough space above
	dropdownFlipped.value = spaceBelow < estimatedMenuHeight && spaceAbove > estimatedMenuHeight

	// Calculate fixed position
	if (dropdownFlipped.value) {
		menuPosition.value = {
			top: buttonRect.top,
			left: buttonRect.left,
		}
	} else {
		menuPosition.value = {
			top: buttonRect.bottom,
			left: buttonRect.left,
		}
	}
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
	if (dropdownOpen.value && actionsCellRef.value && !actionsCellRef.value.contains(event.target as Node)) {
		dropdownOpen.value = false
	}
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
})

// Execute an action
const executeAction = (actionType: RowActionType) => {
	dropdownOpen.value = false

	// Check for custom handler
	const actionConfig = props.config.actions?.[actionType]
	if (typeof actionConfig === 'object' && actionConfig.handler) {
		const result = actionConfig.handler(props.rowIndex, props.store)
		if (result === false) {
			// Handler returned false, don't proceed with default behavior
			return
		}
	}

	// Emit the action event for parent to handle
	emit('action', actionType, props.rowIndex)
}
</script>

<style>
@import url('@stonecrop/themes/default.css');

.atable-row-actions {
	width: 2rem;
	min-width: 2rem;
	padding: 0 0.25rem;
	vertical-align: middle;
	white-space: nowrap;
	border-top: 1px solid var(--sc-row-border-color);
	background: white;
	user-select: none;
	position: relative;
}

.atable-row-actions.dropdown-active {
	z-index: 500;
}

.row-actions-icons {
	display: flex;
	gap: 0.25rem;
	align-items: center;
	justify-content: center;
}

.row-action-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.5rem;
	height: 1.5rem;
	padding: 0.125rem;
	border: none;
	background: transparent;
	cursor: pointer;
	border-radius: 0.25rem;
	transition: background-color 0.15s ease;
}

.row-action-btn:hover {
	background-color: var(--sc-gray-10, #e5e5e5);
}

.row-action-btn:focus {
	outline: 2px solid var(--sc-focus-cell-outline, #3b82f6);
	outline-offset: 1px;
}

.row-action-btn .action-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1rem;
	height: 1rem;
}

.row-action-btn .action-icon :deep(svg) {
	width: 100%;
	height: 100%;
}

/* Dropdown mode styles */
.row-actions-dropdown {
	position: relative;
	display: inline-block;
}

.row-actions-toggle {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.5rem;
	height: 1.5rem;
	padding: 0;
	border: none;
	background: transparent;
	cursor: pointer;
	border-radius: 0.25rem;
	font-size: 1rem;
	font-weight: bold;
	transition: background-color 0.15s ease;
}

.row-actions-toggle:hover {
	background-color: var(--sc-gray-10, #e5e5e5);
}

.row-actions-toggle:focus {
	outline: 2px solid var(--sc-focus-cell-outline, #3b82f6);
	outline-offset: 1px;
}

.dropdown-icon {
	line-height: 1;
}

.row-actions-menu {
	position: fixed;
	z-index: 9999;
	min-width: 10rem;
	padding: 0.25rem 0;
	background: white;
	border: 1px solid var(--sc-row-border-color);
	border-left: 4px solid var(--sc-row-border-color);
	border-radius: 0;
}

.row-actions-menu.menu-flipped {
	box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1);
}

.row-action-menu-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	width: 100%;
	padding: 0.5rem 0.75rem;
	border: none;
	background: transparent;
	cursor: pointer;
	text-align: left;
	font-size: 0.875rem;
	transition: background-color 0.15s ease;
}

.row-action-menu-item:hover {
	background-color: var(--sc-gray-10, #f5f5f5);
}

.row-action-menu-item:focus {
	outline: none;
	background-color: var(--sc-gray-10, #f5f5f5);
}

.row-action-menu-item .action-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1rem;
	height: 1rem;
	flex-shrink: 0;
}

.row-action-menu-item .action-icon :deep(svg) {
	width: 100%;
	height: 100%;
}

.row-action-menu-item .action-label {
	flex: 1;
}
</style>
