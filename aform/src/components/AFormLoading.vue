<template>
	<div class="aform-loading" :class="{ 'aform-loading--fieldset': isFieldset }">
		<div v-if="isFieldset" class="aform-loading__legend">
			<div class="aform-loading__legend-text"></div>
		</div>
		<div class="aform-loading__fields">
			<div v-for="n in fieldCount" :key="n" class="aform-loading__field" :style="fieldStyle(n)">
				<div class="aform-loading__input">
					<div class="aform-loading__label"></div>
				</div>
			</div>
		</div>
		<div class="aform-loading__bar"></div>
	</div>
</template>

<script setup lang="ts">
/**
 * AFormLoading
 *
 * A skeleton loading component for AForm and AFieldset.
 * Mirrors the layout of the real form — empty read-only fields with an
 * animated border bar that sweeps across the bottom, matching the style
 * of ATableLoadingBar.
 *
 * Props:
 *   fieldCount   – number of skeleton field slots to render (default: 4)
 *   isFieldset   – render as a fieldset skeleton with legend (default: false)
 *   message      – optional loading message shown as slot text
 */

const { fieldCount = 4, isFieldset = false } = defineProps<{
	fieldCount?: number
	isFieldset?: boolean
}>()

/**
 * Vary field widths slightly so the skeleton looks natural.
 * Fields at even positions get full width; odd ones alternate between
 * ~50 % and ~75 % to simulate real form layouts.
 */
function fieldStyle(index: number): Record<string, string> {
	const widths = ['100%', '48%', '73%', '48%', '100%', '60%', '48%', '73%']
	const w = widths[(index - 1) % widths.length]
	return { flexBasis: w, width: w }
}
</script>

<style scoped>
/* ------------------------------------------------------------------ */
/* Container                                                            */
/* ------------------------------------------------------------------ */
.aform-loading {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	padding: 1rem;
	border: 1px solid var(--sc-form-border, #ccc);
	border-left: 4px solid var(--sc-form-border, #ccc);
	margin-bottom: 1rem;
	max-width: 100%;
	position: relative;
	overflow: hidden;
	background: var(--sc-form-background, #fff);
}

/* Fieldset variant — matches <fieldset> styling from AFieldset */
.aform-loading--fieldset {
	border: 1px solid transparent;
	border-left: none;
	border-bottom: 1px solid var(--sc-gray-50, #e5e5e5);
	padding-top: 1.5rem; /* room for the legend */
}

/* ------------------------------------------------------------------ */
/* Legend skeleton (fieldset only)                                      */
/* ------------------------------------------------------------------ */
.aform-loading__legend {
	position: absolute;
	top: 0.4rem;
	left: 1rem;
	width: 100%;
}

.aform-loading__legend-text {
	width: 8rem;
	height: 0.85rem;
	background: var(--sc-skeleton-color, rgba(0, 0, 0, 0.08));
	border-radius: 2px;
	animation: pulse 1.6s ease-in-out infinite;
}

/* ------------------------------------------------------------------ */
/* Field skeletons                                                      */
/* ------------------------------------------------------------------ */
.aform-loading__fields {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	width: 100%;
}

.aform-loading__field {
	/* mirrors .aform_form-element */
	position: relative;
	box-sizing: border-box;
	flex-grow: 1;
	min-width: 20ch;
	margin-bottom: 0;
}

/* Input placeholder — outline box matching the real input */
.aform-loading__input {
	outline: 1px solid var(--sc-input-border-color, #ccc);
	outline-offset: -1px;
	height: 2.25rem; /* matches typical aform_input-field height */
	width: 100%;
	box-sizing: border-box;
	background: var(--sc-input-field-background, #fff);
	position: relative;
}

/* Floating label placeholder */
.aform-loading__label {
	position: absolute;
	top: 0;
	left: 10px;
	transform: translateY(-50%);
	width: 5rem;
	height: 0.6rem;
	background: var(--sc-skeleton-color, rgba(0, 0, 0, 0.08));
	border-radius: 2px;
	animation: pulse 1.6s ease-in-out infinite;
}

/* Stagger the pulse slightly per field so they don't all blink together */
.aform-loading__field:nth-child(2) .aform-loading__label {
	animation-delay: 0.15s;
}
.aform-loading__field:nth-child(3) .aform-loading__label {
	animation-delay: 0.3s;
}
.aform-loading__field:nth-child(4) .aform-loading__label {
	animation-delay: 0.45s;
}
.aform-loading__field:nth-child(5) .aform-loading__label {
	animation-delay: 0.6s;
}
.aform-loading__field:nth-child(6) .aform-loading__label {
	animation-delay: 0.75s;
}

/* ------------------------------------------------------------------ */
/* Animated loading bar — sweeps across the bottom border              */
/* Mirrors ATableLoadingBar exactly (bottom, 3 px, bar-left keyframe)  */
/* ------------------------------------------------------------------ */
.aform-loading__bar {
	width: 50%;
	height: 3px;
	position: absolute;
	left: -50%;
	bottom: 0;
	background: var(--sc-row-border-color, #999);
	animation: bar-left 2s infinite;
	z-index: 0;
}

/* ------------------------------------------------------------------ */
/* Keyframes                                                            */
/* ------------------------------------------------------------------ */
@keyframes bar-left {
	0% {
		left: -50%;
	}
	100% {
		left: 100%;
	}
}

@keyframes pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.4;
	}
}

/* ------------------------------------------------------------------ */
/* Responsive                                                           */
/* ------------------------------------------------------------------ */
@media screen and (max-width: 400px) {
	.aform-loading__fields {
		flex-direction: column;
	}
	.aform-loading__field {
		width: 100% !important;
		flex-basis: 100% !important;
	}
}
</style>
