<template>
	<span v-if="displayLabel" :class="classes" :style="styleVars">{{ displayLabel }}</span>
</template>

<script setup lang="ts">
import type { BadgeDescriptor, BadgePresentation, BadgeVariant, FieldOptions } from '@stonecrop/schema'
import { lookupBadge } from '@stonecrop/schema'
import { computed, type CSSProperties } from 'vue'

const props = defineProps<
	Partial<BadgeDescriptor> & {
		presentation: BadgePresentation
		/** Stored field value — used with `options` when `label` is omitted. */
		value?: unknown
		options?: FieldOptions
	}
>()

const resolved = computed((): BadgeDescriptor | undefined => {
	if (props.label?.trim()) {
		return {
			label: props.label.trim(),
			variant: props.variant,
			color: props.color,
		}
	}
	if (props.value === null || props.value === undefined || props.value === '') return undefined
	const key = typeof props.value === 'string' ? props.value : String(props.value)
	return lookupBadge(props.options, key)
})

const displayLabel = computed(() => resolved.value?.label?.trim() ?? '')

const activeVariant = computed((): BadgeVariant => resolved.value?.variant ?? props.variant ?? 'neutral')

const activeColor = computed(() => resolved.value?.color ?? props.color)

const classes = computed(() => ['abadge', `abadge--${props.presentation}`, `abadge--${activeVariant.value}`])

const styleVars = computed((): CSSProperties => {
	const color = activeColor.value
	if (!color) return {}
	return {
		'--sc-badge-bg': color,
		'--sc-badge-text': color,
		'--sc-badge-accent': color,
	} as CSSProperties
})

export type { BadgePresentation, BadgeVariant }
</script>

<style scoped>
.abadge {
	display: block;
	box-sizing: border-box;
	font: inherit;
	line-height: inherit;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.abadge--cell-fill {
	display: block;
	box-sizing: border-box;
	width: 100%;
	min-height: calc(var(--sc-atable-row-height, 1.5em) + 2 * var(--sc-atable-row-padding, 0.125rem));
	line-height: calc(var(--sc-atable-row-height, 1.5em) + 2 * var(--sc-atable-row-padding, 0.125rem));
	margin: 0;
	padding: 0 0.5ch;
	border-radius: 0;
	text-align: inherit;
	background: var(--sc-badge-bg);
	color: var(--sc-badge-text);
}

.abadge--cell-fill.abadge--neutral {
	--sc-badge-bg: var(--sc-badge-neutral-bg);
	--sc-badge-text: var(--sc-badge-neutral-text);
}

.abadge--cell-fill.abadge--success {
	--sc-badge-bg: var(--sc-badge-success-bg);
	--sc-badge-text: var(--sc-badge-success-text);
}

.abadge--cell-fill.abadge--warning {
	--sc-badge-bg: var(--sc-badge-warning-bg);
	--sc-badge-text: var(--sc-badge-warning-text);
}

.abadge--cell-fill.abadge--danger {
	--sc-badge-bg: var(--sc-badge-danger-bg);
	--sc-badge-text: var(--sc-badge-danger-text);
}

.abadge--cell-fill.abadge--brand {
	--sc-badge-bg: var(--sc-badge-brand-bg);
	--sc-badge-text: var(--sc-badge-brand-text);
}

.abadge--input-accent {
	background: var(--sc-input-field-background, #ffffff);
	color: inherit;
	border-left: 4px solid var(--sc-badge-accent);
	padding-left: calc(1ch - 4px);
}

.abadge--input-accent.abadge--neutral {
	--sc-badge-accent: var(--sc-badge-neutral-accent);
}

.abadge--input-accent.abadge--success {
	--sc-badge-accent: var(--sc-badge-success-accent);
}

.abadge--input-accent.abadge--warning {
	--sc-badge-accent: var(--sc-badge-warning-accent);
}

.abadge--input-accent.abadge--danger {
	--sc-badge-accent: var(--sc-badge-danger-accent);
}

.abadge--input-accent.abadge--brand {
	--sc-badge-accent: var(--sc-badge-brand-accent);
}
</style>
