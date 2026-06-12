<template>
	<div class="aform-loading" :class="{ 'aform-loading--fieldset': isFieldset }">
		<div v-if="isFieldset" class="aform-loading__legend">
			<!-- Render legend label text if provided, otherwise use skeleton bar -->
			<span v-if="legend" class="aform-loading__legend-label">{{ legend }}</span>
			<div v-else class="aform-loading__legend-text"></div>
		</div>
		<div class="aform-loading__fields">
			<!--
        If a fields schema is provided, render real labels + disabled inputs.
        Labels are derived from the schema and visible immediately, independently
        of the data being loaded. All inputs are disabled until data arrives.
      -->
			<template v-if="fields && fields.length">
				<div
					v-for="(field, index) in fields"
					:key="field.fieldname ?? index"
					class="aform-loading__field"
					:style="fieldStyle(index + 1)">
					<div class="aform-loading__input aform-loading__input--disabled">
						<label class="aform-loading__label-text">
							{{ field.label }}
						</label>
						<input type="text" disabled aria-label="field.label" class="aform-loading__real-input" tabindex="-1" />
					</div>
				</div>
			</template>

			<!--
        Fallback: no schema available — render N skeleton slots with animated
        placeholder bars (original behaviour).
      -->
			<template v-else>
				<div v-for="n in fieldCount" :key="n" class="aform-loading__field" :style="fieldStyle(n)">
					<div class="aform-loading__input">
						<div class="aform-loading__label"></div>
					</div>
				</div>
			</template>
		</div>
		<div class="aform-loading__bar"></div>
	</div>
</template>

<script setup lang="ts">
/**
 * AFormLoading
 *
 * A loading component for AForm and AFieldset.
 *
 * When a `fields` schema is provided, labels are rendered immediately and
 * independently of the data payload. All inputs are rendered as disabled
 * (aria-disabled, HTML disabled) until the parent swaps this component out
 * for the real form once data has loaded.
 *
 * When no `fields` schema is available, the original skeleton behaviour is
 * used: N animated placeholder slots are rendered instead.
 *
 * Props:
 *   fields     – optional array of field descriptors from the schema.
 *                Each entry must have at least a `label` string. A `fieldname`
 *                string is used as the loop key when present.
 *   fieldCount – number of skeleton slots to render when no `fields` are
 *                provided (default: 4). Ignored when `fields` is supplied.
 *   isFieldset – render as a fieldset skeleton with a legend (default: false).
 *   legend     – optional text for the fieldset legend. When omitted, a
 *                skeleton bar is shown in its place.
 */

export interface FieldDescriptor {
	label: string
	fieldname?: string
}

defineOptions({ name: 'AFormLoading' })

const {
	fields,
	fieldCount = 4,
	isFieldset = false,
	legend,
} = defineProps<{
	fields?: FieldDescriptor[]
	fieldCount?: number
	isFieldset?: boolean
	legend?: string
}>()

/**
 * Vary field widths slightly so the layout looks natural.
 * Fields at even positions get full width; odd ones alternate between
 * ~50 % and ~75 % to simulate typical form layouts.
 */
function fieldStyle(index: number): Record<string, string> {
	const widths = ['100%', '48%', '73%', '48%', '100%', '60%', '48%', '73%']
	const w = widths[(index - 1) % widths.length]
	return { flexBasis: w, width: w }
}
</script>

<style scoped>
/* ------------------------------------------------------------------ */
/* Container                                                           */
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
/* Legend (fieldset only)                                              */
/* ------------------------------------------------------------------ */
.aform-loading__legend {
	position: absolute;
	top: 0.4rem;
	left: 1rem;
	width: 100%;
}

/* Skeleton legend bar (no legend text provided) */
.aform-loading__legend-text {
	width: 8rem;
	height: 0.85rem;
	background: var(--sc-skeleton-color, rgba(0, 0, 0, 0.08));
	border-radius: 2px;
	animation: pulse 1.6s ease-in-out infinite;
}

/* Real legend label (legend prop provided) */
.aform-loading__legend-label {
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--sc-label-color, #555);
	text-transform: uppercase;
	letter-spacing: 0.03em;
}

/* ------------------------------------------------------------------ */
/* Field slots                                                         */
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

/* ------------------------------------------------------------------ */
/* Input placeholder — skeleton variant                                */
/* ------------------------------------------------------------------ */
.aform-loading__input {
	outline: 1px solid var(--sc-input-border-color, #ccc);
	outline-offset: -1px;
	height: 2.25rem;
	width: 100%;
	box-sizing: border-box;
	background: var(--sc-input-field-background, #fff);
	position: relative;
}

/* Skeleton label bar (no schema) */
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

/* ------------------------------------------------------------------ */
/* Disabled input variant (schema-driven)                              */
/* ------------------------------------------------------------------ */
.aform-loading__input--disabled {
	/* Slightly muted background signals "not yet interactive" */
	background: var(--sc-input-disabled-background, #f5f5f5);
	outline-color: var(--sc-input-border-color, #ccc);
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 0.5rem;
	height: auto;
	min-height: 2.25rem;
	padding-top: 1.1rem; /* room for the floating label */
}

/* Real label text shown above the disabled input */
.aform-loading__label-text {
	position: absolute;
	top: 0;
	left: 10px;
	transform: translateY(-50%);
	font-size: 0.7rem;
	font-weight: 500;
	color: var(--sc-label-color, #555);
	background: var(--sc-input-disabled-background, #f5f5f5);
	padding: 0 2px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: calc(100% - 1rem);
	/* Not animated — labels are independent of data, visible immediately */
}

/* The actual disabled <input> rendered inside the slot */
.aform-loading__real-input {
	width: 100%;
	border: none;
	outline: none;
	background: transparent;
	cursor: not-allowed;
	color: var(--sc-input-disabled-color, #aaa);
	font-size: 0.875rem;
	padding: 0;
	height: 1.5rem;
}

/* Stagger the pulse slightly per skeleton field */
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
/* Animated loading bar — sweeps across the bottom border             */
/* Mirrors ATableLoadingBar exactly (bottom, 3 px, bar-left keyframe) */
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
/* Keyframes                                                           */
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
/* Responsive                                                          */
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
