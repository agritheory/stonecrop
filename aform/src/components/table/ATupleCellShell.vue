<template>
	<div class="atable-tuple-shell" :class="{ 'atable-tuple-shell--active': active }">
		<button
			type="button"
			class="atable-tuple-shell__handle"
			:class="{ 'atable-tuple-shell__handle--visible': active }"
			tabindex="-1"
			:aria-label="pickerLabel"
			aria-haspopup="listbox"
			:aria-expanded="pickerOpen"
			:aria-hidden="!active"
			@mousedown.prevent
			@click.stop="emit('open-picker')">
			<span class="atable-tuple-shell__caret" aria-hidden="true" />
		</button>
		<span v-show="!active" class="atable-tuple-shell__display">{{ displayText }}</span>
		<slot v-if="active" />
	</div>
</template>

<script setup lang="ts">
defineProps<{
	active: boolean
	displayText: string
	pickerLabel: string
	pickerOpen: boolean
}>()

const emit = defineEmits<{
	'open-picker': []
}>()
</script>

<style scoped>
.atable-tuple-shell {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	min-width: 0;
	min-height: 1.25em;
	padding-left: 0;
}

.atable-tuple-shell--active {
	box-sizing: border-box;
	padding-left: 1rem;
}

.atable-tuple-shell__handle {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	width: 1rem;
	min-width: 1rem;
	padding: 0;
	margin: 0;
	border: none;
	background: transparent;
	color: var(--sc-cell-text-color);
	cursor: pointer;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.15s ease;
	-webkit-tap-highlight-color: transparent;
}

.atable-tuple-shell__handle--visible {
	opacity: 1;
	pointer-events: auto;
}

.atable-tuple-shell__caret {
	display: inline-block;
	width: 0;
	height: 0;
	border-left: 0.3em solid transparent;
	border-right: 0.3em solid transparent;
	border-top: 0.3em solid currentColor;
}

.atable-tuple-shell__display {
	display: block;
	width: 100%;
	min-width: 0;
	box-sizing: border-box;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
