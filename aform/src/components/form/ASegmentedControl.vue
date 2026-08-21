<template>
	<div
		class="aform_form-element aform_segmented-control"
		:class="{
			'aform_segmented-control--xs': size === 'xs',
			'aform_segmented-control--sm': size === 'sm',
			'aform_segmented-control--equal': equal,
		}">
		<template v-if="mode === 'display'">
			<label class="aform_field-label" :class="{ 'aform_segmented-sr-label': hideLabel }">{{ label }}</label>
			<ABadge
				v-if="displayBadge"
				class="aform_display-value aform_segmented-display-badge"
				:value="displayBadgeValue"
				:options="options"
				presentation="input-accent" />
			<span v-else class="aform_display-value">{{ displayText }}</span>
		</template>
		<template v-else>
			<label :id="labelId" class="aform_field-label" :class="{ 'aform_segmented-sr-label': hideLabel }">
				{{ label }}
			</label>
			<div
				:role="multiple ? 'group' : 'radiogroup'"
				class="aform_segmented-track"
				:aria-labelledby="groupAriaLabel ? undefined : labelId"
				:aria-label="groupAriaLabel"
				:aria-busy="busy || undefined">
				<label
					v-for="choice in choices"
					:key="choice"
					class="aform_segmented-segment"
					:class="segmentClasses(choice)"
					:style="segmentStyle(choice)"
					:data-segment-value="choice">
					<input
						v-if="multiple"
						v-model="selectedMany"
						type="checkbox"
						class="aform_segmented-input"
						:name="groupName"
						:value="choice"
						:disabled="mode === 'read'" />
					<input
						v-else
						v-model="selected"
						type="radio"
						class="aform_segmented-input"
						:name="groupName"
						:value="choice"
						:disabled="mode === 'read'" />
					<span class="aform_segmented-label">{{ segmentLabel(choice) }}</span>
				</label>
			</div>
			<p v-show="errorText" class="aform_error" v-html="errorText"></p>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { BadgeVariant, FieldOptions } from '@stonecrop/schema'
import { hasBadgeOptions, lookupBadge, selectChoices } from '@stonecrop/schema'
import { computed, useId, type CSSProperties } from 'vue'

import type { ComponentProps } from '../../types'
import ABadge from './ABadge.vue'

const {
	label,
	options = undefined,
	mode,
	uuid,
	errors,
	validation = { errorMessage: '' },
	size = 'sm',
	equal = false,
	hideLabel = false,
	ariaLabel = undefined,
	busy = false,
	multiple = false,
} = defineProps<
	ComponentProps & {
		options?: FieldOptions
		size?: 'xs' | 'sm'
		equal?: boolean
		hideLabel?: boolean
		ariaLabel?: string
		busy?: boolean
		multiple?: boolean
	}
>()

const selected = defineModel<string | string[]>({ default: '' })

const selectedMany = computed({
	get: () => (Array.isArray(selected.value) ? selected.value : []),
	set: (value: string[]) => {
		selected.value = value
	},
})

const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))

const fallbackId = useId()
const groupName = computed(() => uuid ?? `aform-segmented-${fallbackId}`)
const labelId = computed(() => `${groupName.value}-label`)

// aria-labelledby outranks aria-label in the accessible-name algorithm, so the two are mutually
// exclusive here: emitting both would silently leave `ariaLabel` inert. It only applies while the
// label element is visually hidden — overriding a *visible* label would break WCAG 2.5.3.
const groupAriaLabel = computed(() => (hideLabel ? ariaLabel : undefined))

const choices = computed(() => selectChoices(options))
const badgeOptions = computed(() => hasBadgeOptions(options))

function segmentLabel(choice: string): string {
	return lookupBadge(options, choice)?.label ?? choice
}

function segmentVariant(choice: string): BadgeVariant {
	return lookupBadge(options, choice)?.variant ?? 'neutral'
}

function isChoiceSelected(choice: string): boolean {
	if (multiple) return selectedMany.value.includes(choice)
	return selected.value === choice
}

function segmentClasses(choice: string): Record<string, boolean> {
	if (!badgeOptions.value) return {}
	return {
		'aform_segmented-segment--badge': true,
		[`aform_segmented-segment--${segmentVariant(choice)}`]: isChoiceSelected(choice),
	}
}

function segmentStyle(choice: string): CSSProperties {
	if (!badgeOptions.value || !isChoiceSelected(choice)) return {}
	const color = lookupBadge(options, choice)?.color
	if (!color) return {}
	return {
		'--sc-badge-bg': color,
		'--sc-badge-text': color,
	} as CSSProperties
}

const displayText = computed(() => {
	if (multiple) {
		return selectedMany.value.map(segmentLabel).filter(Boolean).join(', ')
	}
	const value = selected.value
	if (typeof value !== 'string' || value === '') return ''
	return segmentLabel(value)
})

const displayBadge = computed(() => {
	if (!badgeOptions.value) return false
	if (multiple) return selectedMany.value.length === 1
	return typeof selected.value === 'string' && selected.value !== ''
})

const displayBadgeValue = computed(() => {
	if (multiple) return selectedMany.value[0] ?? ''
	return typeof selected.value === 'string' ? selected.value : ''
})
</script>

<style scoped>
.aform_segmented-control--xs.aform_form-element {
	min-width: 0;
	padding-top: 0;
	max-width: none;
}

.aform_segmented-control--xs:not(:has(.aform_segmented-sr-label)) {
	padding-top: 0.5rem;
}

.aform_segmented-sr-label {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

.aform_segmented-track {
	display: inline-flex;
	flex-wrap: wrap;
	align-items: stretch;
	gap: 0.125rem;
	padding: 0.125rem;
	width: auto;
	min-width: 0;
	min-height: 2rem;
	outline: 1px solid var(--sc-input-border-color);
	outline-offset: -1px;
	border-radius: 0;
	box-sizing: border-box;
	background: var(--sc-input-field-disabled-background);
	font-family: var(--sc-font-family);
}

.aform_segmented-control--xs .aform_segmented-track {
	min-height: 1.5rem;
	font-size: 0.875rem;
}

.aform_segmented-control--equal .aform_segmented-track {
	display: flex;
	width: 100%;
}

.aform_segmented-segment {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: none;
	margin: 0;
	padding: 0.125rem 0.5rem;
	min-height: 1.5rem;
	border-radius: 0;
	color: var(--sc-input-label-color);
	font-family: inherit;
	font-size: inherit;
	font-weight: 400;
	line-height: 1.25;
	cursor: pointer;
	user-select: none;
	box-sizing: border-box;
}

.aform_segmented-control--sm .aform_segmented-segment {
	min-height: 1.75rem;
	padding: 0.125rem 0.75rem;
	font-size: var(--sc-font-size);
}

.aform_segmented-control--equal .aform_segmented-segment {
	flex: 1 1 0;
}

.aform_segmented-input {
	position: absolute;
	inline-size: 1px;
	block-size: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

.aform_segmented-label {
	pointer-events: none;
}

.aform_segmented-segment:not(.aform_segmented-segment--badge):has(.aform_segmented-input:checked) {
	background: var(--sc-input-field-background);
	color: var(--sc-cell-text-color);
	font-weight: 500;
}

.aform_segmented-segment--badge:has(.aform_segmented-input:checked) {
	font-weight: 500;
}

.aform_segmented-segment--badge:has(.aform_segmented-input:checked).aform_segmented-segment--neutral {
	background: var(--sc-badge-neutral-bg);
	color: var(--sc-badge-neutral-text);
}

.aform_segmented-segment--badge:has(.aform_segmented-input:checked).aform_segmented-segment--success {
	background: var(--sc-badge-success-bg);
	color: var(--sc-badge-success-text);
}

.aform_segmented-segment--badge:has(.aform_segmented-input:checked).aform_segmented-segment--warning {
	background: var(--sc-badge-warning-bg);
	color: var(--sc-badge-warning-text);
}

.aform_segmented-segment--badge:has(.aform_segmented-input:checked).aform_segmented-segment--danger {
	background: var(--sc-badge-danger-bg);
	color: var(--sc-badge-danger-text);
}

.aform_segmented-segment--badge:has(.aform_segmented-input:checked).aform_segmented-segment--brand {
	background: var(--sc-badge-brand-bg);
	color: var(--sc-badge-brand-text);
}

.aform_segmented-segment--badge:has(.aform_segmented-input:checked)[style*='--sc-badge-bg'] {
	background: var(--sc-badge-bg);
	color: var(--sc-badge-text);
}

.aform_segmented-segment:has(.aform_segmented-input:focus-visible) {
	outline: 1px solid var(--sc-input-active-border-color);
	outline-offset: -1px;
}

.aform_segmented-segment:hover:has(.aform_segmented-input:not(:disabled):not(:checked)) {
	background: color-mix(in srgb, var(--sc-input-field-background) 50%, transparent);
}

.aform_segmented-segment:has(.aform_segmented-input:disabled) {
	cursor: not-allowed;
	opacity: 0.5;
}

.aform_segmented-track:has(.aform_segmented-input:focus-visible) {
	outline-color: var(--sc-input-active-border-color);
}

.aform_segmented-display-badge {
	display: block;
	padding: 0.5rem;
	min-height: 2rem;
	box-sizing: border-box;
}

@media (prefers-reduced-motion: no-preference) {
	.aform_segmented-segment {
		transition:
			background-color 0.1s ease-out,
			color 0.1s ease-out;
	}
}

@media (prefers-reduced-motion: reduce) {
	.aform_segmented-segment {
		transition: none;
	}
}
</style>
