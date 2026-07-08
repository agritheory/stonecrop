<template>
	<form class="aform">
		<template v-for="(componentObj, key) in schema" :key="key">
			<!-- Nested schema field (Doctype or any field with resolved schema) -->
			<div v-if="isNestedSection(componentObj)" class="aform-nested-section">
				<!-- Suppress h4 for fieldsets — they render their own legend inside AFieldset -->
				<h4 v-if="componentObj.label && componentObj.kind !== 'fieldset'" class="aform-nested-label">
					{{ componentObj.label }}
				</h4>
				<component
					:is="componentObj.component ?? 'AForm'"
					:data="nestedData[componentObj.fieldname]"
					:mode="resolvedMode(componentObj)"
					:schema="componentObj.schema"
					:label="componentObj.label"
					:collapsible="componentObj.kind === 'fieldset' ? componentObj.collapsible : undefined"
					@update:data="(val: any) => updateNestedData(componentObj.fieldname, val)" />
			</div>

			<!-- Regular field -->
			<component
				:is="componentObj.component"
				v-else-if="!componentObj.hidden"
				v-model="childModels[key].value"
				:style="fieldStyle(componentObj)"
				:schema="componentObj"
				:data="dataModel[componentObj.fieldname]"
				:mode="resolvedMode(componentObj)"
				v-bind="componentProps(componentObj)">
			</component>
		</template>
	</form>
</template>

<script setup lang="ts">
import { computed, watchEffect, watch, ref } from 'vue'

import type { ResolvedField, ResolvedLink, ResolvedFieldset } from '../types'
import type { InteractionMode } from '@stonecrop/schema'

const emit = defineEmits(['update:schema', 'update:data'])
const dataModel = defineModel<Record<string, any>>('data', { required: true })
const { schema, mode = 'edit' } = defineProps<{ schema: ResolvedField[]; mode?: InteractionMode }>()

const isNestedSection = (componentObj: ResolvedField): componentObj is ResolvedLink | ResolvedFieldset =>
	(componentObj.kind === 'link' || componentObj.kind === 'fieldset') &&
	'schema' in componentObj &&
	Array.isArray(componentObj.schema) &&
	componentObj.schema.length > 0

// Reactive nested data refs for two-way binding with nested AForm instances
const nestedData = ref<Record<string, any>>({})

// Sync external dataModel changes into nestedData (one-way, no emit back).
// Uses a shallow watch so only top-level object replacement (e.g. parent reset)
// triggers a sync — property mutations from within are handled by updateNestedData.
watch(
	() => dataModel.value,
	newData => {
		if (!schema || !newData) return
		schema.forEach(field => {
			if (isNestedSection(field)) {
				nestedData.value[field.fieldname] = newData[field.fieldname] ?? {}
			}
		})
	},
	{ immediate: true }
)

// Called by the nested <AForm>'s @update:data handler.
// Updates nestedData locally and propagates upward in one step,
// avoiding the watchEffect feedback loop that occurred with v-model.
const updateNestedData = (fieldname: string, val: any) => {
	nestedData.value[fieldname] = val
	if (dataModel.value) {
		dataModel.value[fieldname] = val
		emit('update:data', { ...dataModel.value })
	}
}

const componentProps = (componentObj: ResolvedField) => {
	const propsToPass: Record<string, any> = {}
	for (const [key, value] of Object.entries(componentObj)) {
		// 'mode' is excluded here because it is handled by resolvedMode()
		// and passed explicitly via :mode to avoid conflicting with the form-level defaults.
		if (!['component', 'fieldtype', 'hidden', 'mode', 'width'].includes(key)) {
			propsToPass[key] = value
		}
	}

	// kind: 'table' is the canonical check; 'columns' in componentObj is a structural fallback
	// for schemas passed directly to AForm without going through the registry.
	if (componentObj.kind === 'table' || 'columns' in componentObj) {
		propsToPass['rows'] = dataModel.value[componentObj.fieldname] || []
	}

	return propsToPass
}

const fieldStyle = (componentObj: ResolvedField): Record<string, string> => {
	if (componentObj.kind !== 'field') return {}
	const width = componentObj.width
	if (!width) return {}
	return { flexBasis: width, width }
}

const effectiveFormMode = computed(() => mode ?? 'edit')

// Resolve the effective mode for a schema field, allowing per-field overrides
function resolvedMode(componentObj: ResolvedField): InteractionMode {
	const fieldMode = componentObj.mode
	if (fieldMode) return fieldMode
	return effectiveFormMode.value
}

// Create stable computed refs array to avoid recreation on every access
const childModelsCache = ref<ReturnType<typeof computed>[]>([])

// Watch for schema changes and update cache (avoiding side effects in computed)
watchEffect(() => {
	if (!schema) return

	// Recreate cache only if length changed
	if (childModelsCache.value.length !== schema.length) {
		childModelsCache.value = schema.map((_val, i) => {
			return computed({
				get() {
					return dataModel.value?.[schema[i].fieldname]
				},
				set: newValue => {
					const fieldname = schema[i].fieldname
					if (fieldname && dataModel.value) {
						dataModel.value[fieldname] = newValue
						emit('update:data', { ...dataModel.value })
					}
					emit('update:schema', schema)
				},
			})
		})
	}
})

// Computed just returns the cached models (no side effects)
const childModels = computed(() => childModelsCache.value)
</script>

<style>
/* global styles for aform */
.aform_form-element {
	padding: 0;
	margin: 0;
	position: relative;
	box-sizing: border-box;
	flex-grow: 1;
	min-width: 20ch;
	margin-bottom: 1rem;
}
.aform__grid--full {
	flex-basis: 100%;
	width: 100%;
}
.aform_input-field {
	outline: 1px solid var(--sc-input-border-color);
	outline-offset: -1px;
	font-size: 1rem;
	padding: 0.5rem;
	margin: 0 0 0 0;
	border-radius: 0;
	box-sizing: border-box;
	width: 100%;
	min-height: auto;
	position: relative;
	color: var(--sc-cell-text-color);
	background: var(--sc-input-field-background);
}
.aform_input-field:focus {
	outline: 1px solid var(--sc-input-active-border-color);
}

.aform_display-value {
	display: block;
	padding: 0.5rem;
	min-height: 2rem;
	color: var(--sc-cell-text-color);
	word-break: break-word;
}

.aform_input-field:focus + .aform_field-label {
	color: var(--sc-input-active-label-color);
}

.aform_field-label {
	color: var(--sc-input-label-color);
	display: inline-block;
	position: absolute;
	padding: 0 0.25rem;
	margin: 0rem;
	z-index: 1;
	font-size: 0.7rem;
	font-weight: 300;
	letter-spacing: 0.05rem;
	background: linear-gradient(var(--sc-form-background) 50%, var(--sc-input-field-background) 50%);
	width: auto;
	box-sizing: border-box;
	background: white;
	margin: 0;
	grid-row: 1;
	top: 0;
	left: 10px;
	border: none;
	line-height: 0;
	transform: translateY(-50%);
}
.aform_input-field:disabled {
	background: var(--sc-input-field-disabled-background);
}
.aform_input-field:disabled + .aform_field-label {
	background: linear-gradient(var(--sc-form-background) 50%, var(--sc-input-field-disabled-background) 50%);
}
.aform_input-field:disabled ~ p.aform_error {
	background: linear-gradient(var(--sc-form-background) 50%, var(--sc-input-field-disabled-background) 50%);
}
.aform_field-label::after {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	content: '';
	line-height: normal;
}
p.aform_error {
	display: block;
	display: inline-block;
	display: none;
	background: linear-gradient(var(--sc-form-background) 50%, var(--sc-input-field-background) 50%);
	padding: 0 0.25rem;
	margin: 0rem;
	width: auto;
	color: var(--sc-brand-danger);
	font-size: 0.7rem;
	position: absolute;
	right: 0;
	top: 0;
	line-height: 0;
	background: white;
	padding: 0.25rem;
	transform: translate(-1rem, -50%);
	margin: 0;
}
</style>

<style scoped>
.aform {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	padding: 1rem;
	border: 1px solid var(--sc-form-border);
	border-left: 4px solid var(--sc-form-border);
	margin-bottom: 1rem;
	max-width: 100%;
}
@media screen and (max-width: 400px) {
	.aform {
		flex-direction: column;
	}
}

/* Nested form section */
.aform-nested-section {
	width: 100%;
	padding: 0.5rem 0;
}

.aform-nested-label {
	font-size: 0.9rem;
	font-weight: 600;
	margin: 0 0 0.5rem 0;
	color: var(--sc-input-label-color, #666);
}

.aform-nested-section .aform {
	border-left-width: 2px;
	margin-left: 0.5rem;
}
</style>
