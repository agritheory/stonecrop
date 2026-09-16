<template>
	<div
		:class="{
			collapsed: !isOpen,
			'action-set--embedded': embedded,
			'action-set--rail': hasRail,
		}"
		class="action-set">
		<div class="action-menu-icon">
			<div id="cross" :class="{ rotated: isOpen }" @click="onClick">×</div>
		</div>
		<div v-if="hasRail" class="action-set__rail">
			<slot name="rail" />
		</div>
		<div v-if="!embedded" style="margin-right: 30px"></div>
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
import { computed, onMounted, ref, useSlots } from 'vue'

import type { ActionElements } from '../types'

const { elements = [], embedded = false } = defineProps<{
	elements?: ActionElements[]
	embedded?: boolean
}>()
const emit = defineEmits<{
	actionClick: [label: string, action: (() => void | Promise<void>) | undefined]
}>()

const vueSlots = useSlots()
const hasRail = computed(() => typeof vueSlots.rail === 'function')

// Track dropdown open state separately (index -> boolean)
const dropdownStates = ref<Record<number, boolean>>({})

const isOpen = ref(true)
const dropdownOpen = ref<boolean[]>([])

onMounted(() => {
	closeDropdowns()
})

function closeDropdowns() {
	dropdownStates.value = {}
	dropdownOpen.value = []
}

function onClick() {
	isOpen.value = !isOpen.value
	closeDropdowns()
}

defineExpose({ closeDropdowns })

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
.action-set.action-set--embedded {
	position: relative;
	top: auto;
	right: auto;
	width: 100%;
	align-items: center;
	overflow: visible;
	z-index: auto;
}
.action-set.action-set--embedded:not(.collapsed) {
	min-width: max-content;
	align-items: flex-end;
}
.action-set__rail {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}
.action-menu-icon {
	position: relative;
	font-size: 2rem;
	display: inline-block;
	color: var(--sc-gray-60);
	transition: all 0.2s ease-in-out;
}
.action-set.action-set--embedded .action-menu-icon {
	font-size: 1.5rem;
}
.action-set.collapsed:not(.action-set--rail) {
	max-width: 46px;
	max-height: 40px;
	overflow: hidden;
}
.action-set.collapsed.action-set--rail {
	max-width: 100%;
	max-height: none;
	overflow: visible;
}
.action-set.collapsed .action-element {
	opacity: 0;
	-webkit-transition: opacity 0.25s ease-in-out;
	-moz-transition: opacity 0.25s ease-in-out;
	-o-transition: opacity 0.25s ease-in-out;
	transition: opacity 0.25s ease-in-out;
}
.action-set.collapsed.action-set--rail .action-element {
	display: none;
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
	color: var(--sc-gray-60);
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
