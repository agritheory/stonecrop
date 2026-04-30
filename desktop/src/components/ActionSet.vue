<template>
	<div :class="{ collapsed: !isOpen }" class="action-set">
		<div class="action-menu-icon">
			<div id="cross" @click="onClick" :class="{ rotated: isOpen }">×</div>
		</div>
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
					<div @click="toggleDropdown(index)" class="cross" :class="{ rotated: dropdownOpen[index] }">×</div>
					<button class="button-default dropdown-title" @click="toggleDropdown(index)">
						{{ el.label }}
					</button>
				</div>
				<div v-show="dropdownStates[index]" class="dropdown-container">
					<div class="dropdown">
						<div v-for="(item, itemIndex) in el.actions" :key="item.label">
							<button v-if="item.action != null" class="dropdown-item" @click="handleClick(item.action, item.label)">
								{{ item.label }}
							</button>
							<a v-else-if="item.link != null" :href="item.link"
								><button class="dropdown-item">{{ item.label }}</button></a
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import type { ActionElements } from '../types'

const { elements = [] } = defineProps<{ elements?: ActionElements[] }>()
const emit = defineEmits<{
	actionClick: [label: string, action: (() => void | Promise<void>) | undefined]
}>()

// Track dropdown open state separately (index -> boolean)
const dropdownStates = ref<Record<number, boolean>>({})

const isOpen = ref(true)
const timeoutId = ref<number>(-1)
const hover = ref(false)
const closeClicked = ref(false)
const dropdownOpen = ref([])

onMounted(() => {
	closeDropdowns()
})

const closeDropdowns = () => {
	dropdownStates.value = {}
	dropdownOpen.value = []
}

const onClick = () => {
	isOpen.value = !isOpen.value
}

const toggleDropdown = (index: number) => {
	const showDropdown = !dropdownStates.value[index]
	closeDropdowns()
	if (showDropdown) {
		dropdownStates.value[index] = true
		dropdownOpen.value[index] = true
	}
}

const handleClick = (action: (() => void | Promise<void>) | undefined, label: string) => {
	// Emit event to parent - parent will handle execution
	emit('actionClick', label, action)
}
</script>

<style scoped>
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
#cross svg {
	width: 1.5em;
	height: 1.5em;
}

.action-set {
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
	z-index: 1001; /* Above SheetNav (100) and operation log button (999) */
	-webkit-transition: all 0.5s ease-in-out;
	-moz-transition: all 0.5s ease-in-out;
	-o-transition: all 0.5s ease-in-out;
	transition: all 0.5s ease-in-out;
}
.action-menu-icon {
	position: relative;
	font-size: 2rem;
	display: inline-block;
	color: var(--sc-gray-60, #666);
	transition: all 0.2s ease-in-out;
}
.action-set.collapsed {
	max-width: 46px;
	max-height: 40px;
	overflow: hidden;
}
.action-set.collapsed .action-element {
	opacity: 0;
	-webkit-transition: opacity 0.25s ease-in-out;
	-moz-transition: opacity 0.25s ease-in-out;
	-o-transition: opacity 0.25s ease-in-out;
	transition: opacity 0.25s ease-in-out;
}

.action-element {
	width: 100%;
	text-align: right;
	border: 1px solid var(--sc-gray-20);
	background: none;
	font-size: 1.5rem;
	font-family: var(--sc-font-family);
	font-weight: 600;
	margin-top: 10px;
	position: relative; /* Make this the positioning context for absolute children */
}
.action-element-header {
	display: flex;
	justify-content: end;
}
button.button-default {
	background-color: transparent;
	padding: 5px 12px;
	border-radius: 0px;
	box-shadow: none;
	border: none;
	cursor: pointer;
	white-space: nowrap;
	font-weight: bold;
	font-size: 1rem;
	text-align: right;
	color: var(--sc-gray-80);
	padding-left: 50px;
	font-family: var(--sc-font-family);
}
.dropdown-header:hover button.button-default,
.dropdown-header:hover,
.action-element-header:hover {
	background-color: #f2f2f2;
}

.dropdown-title {
	position: relative;
}
.dropdown-header {
	display: flex;
	align-items: center;
}
.cross {
	pointer-events: all;
	margin-left: 5px;
	font-family: var(--sc-font-family);
	color: var(--sc-gray-60, #666);
	cursor: pointer;
	transform: rotate(45deg);
	user-select: none;
	transition: all 0.2s ease-in-out;
	line-height: 1rem;
}

button.dropdown-item {
	width: 100%;
	padding: 5px 12px;
	text-align: right;
	border: none;
	background-color: #ffffff;
	cursor: pointer;
	border-radius: 5px;
	font-size: 1rem;
}

button.dropdown-item:hover {
	background-color: #f2f2f2;
}
</style>
