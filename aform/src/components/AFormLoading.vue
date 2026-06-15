<template>
	<div class="aform-loading" :class="{ 'aform-loading--fieldset': isFieldset }">
		<div v-if="isFieldset" class="aform-loading__legend">
			<!-- Render legend label text if provided, otherwise use skeleton bar -->
			<span v-if="legend" class="aform-loading__legend-label">{{ legend }}</span>
			<div v-else class="aform-loading__legend-text"></div>
		</div>
		<div class="aform-loading__fields">
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
						<input type="text" disabled :aria-label="field.label" class="aform-loading__real-input" tabindex="-1" />
					</div>
				</div>
			</template>
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

function fieldStyle(index: number): Record<string, string> {
	const widths = ['100%', '48%', '73%', '48%', '100%', '60%', '48%', '73%']
	const w = widths[(index - 1) % widths.length]
	return { flexBasis: w, width: w }
}
</script>

<style scoped>
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

.aform-loading--fieldset {
	border: 1px solid transparent;
	border-left: none;
	border-bottom: 1px solid var(--sc-gray-50, #e5e5e5);
	padding-top: 2rem;
}

.aform-loading__legend {
	position: absolute;
	top: 0.25rem;
	left: 0;
	width: 100%;
	z-index: 2;
}

.aform-loading__legend-text {
	width: 8rem;
	height: 0.85rem;
	background: var(--sc-skeleton-color, rgba(0, 0, 0, 0.08));
	border-radius: 2px;
	animation: pulse 1.6s ease-in-out infinite;
}

.aform-loading__legend-label {
	font-size: 110%;
	font-weight: 600;
	color: inherit;
	text-transform: none;
	letter-spacing: normal;
	padding-bottom: 0.5rem;
}

.aform-loading__fields {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	width: 100%;
}

.aform-loading__field {
	position: relative;
	box-sizing: border-box;
	flex-grow: 1;
	min-width: 20ch;
	margin-bottom: 0;
}

.aform-loading__input {
	outline: 1px solid var(--sc-input-border-color, #ccc);
	outline-offset: -1px;
	height: 2.25rem;
	width: 100%;
	box-sizing: border-box;
	background: var(--sc-input-field-background, #fff);
	position: relative;
}

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

.aform-loading__input--disabled {
	background: var(--sc-input-field-disabled-background, #f5f5f5);
	outline-color: var(--sc-input-border-color, #ccc);
	position: relative;
	height: 2.25rem;
	width: 100%;
	box-sizing: border-box;
}

.aform-loading__label-text {
	position: absolute;
	top: 0;
	left: 10px;
	transform: translateY(-50%);
	font-size: 0.7rem;
	font-weight: 300;
	letter-spacing: 0.05rem;
	color: var(--sc-input-label-color, #555);
	background: white;
	padding: 0 0.25rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: calc(100% - 1rem);
	line-height: normal;
	z-index: 1;
}

.aform-loading__real-input {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	border: none;
	outline: none;
	background: transparent;
	cursor: not-allowed;
	color: var(--sc-input-disabled-color, #aaa);
	font-size: 1rem;
	padding: 0.5rem;
	box-sizing: border-box;
}

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
