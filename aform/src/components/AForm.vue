<template>
	<form class="aform">
		<template v-for="(componentObj, key) in schema" :key="key">
			<!-- A linked record: its form binds the link's own value -->
			<div v-if="isLinkSection(componentObj)" class="aform-nested-section">
				<h4 v-if="componentObj.label" class="aform-nested-label">
					{{ componentObj.label }}
				</h4>
				<component
					:is="componentObj.component ?? 'AForm'"
					:data="nestedData[componentObj.fieldname]"
					:mode="resolvedMode(componentObj)"
					:schema="componentObj.schema"
					:label="componentObj.label"
					:errors="errors"
					@update:data="(val: any) => updateNestedData(componentObj.fieldname, val)" />
			</div>

			<!-- A fieldset is layout: its fields are this record's own, so it binds this record.
				 No h4, since AFieldset renders its own legend. -->
			<div v-else-if="isFieldsetSection(componentObj)" class="aform-nested-section">
				<component
					:is="componentObj.component ?? 'AFieldset'"
					:data="dataModel"
					:mode="resolvedMode(componentObj)"
					:schema="componentObj.schema"
					:label="componentObj.label"
					:collapsible="componentObj.collapsible"
					:errors="errors"
					@update:data="updateFieldsetData" />
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
				:errors="errors?.[componentObj.fieldname]"
				v-bind="componentProps(componentObj)">
				<template v-if="isListExpansionTable(componentObj)" #content="{ row, rowIndex }">
					<AForm
						class="aform-table-expansion"
						:data="row"
						:schema="tableExpansionSchema(componentObj)"
						:mode="resolvedMode(componentObj)"
						@update:data="val => updateTableRow(componentObj.fieldname, rowIndex, val)" />
				</template>
			</component>
		</template>
	</form>
</template>

<script setup lang="ts">
import { computed, watchEffect, watch, ref, useId } from 'vue'

import type { ResolvedField, ResolvedLink, ResolvedFieldset, ResolvedTable } from '../types'
import type { ColumnSchema, InteractionMode } from '@stonecrop/schema'

const emit = defineEmits(['update:schema', 'update:data'])
const dataModel = defineModel<Record<string, any>>('data', { required: true })
const {
	schema,
	mode = 'edit',
	errors,
} = defineProps<{
	schema: ResolvedField[]
	mode?: InteractionMode
	/** Inline validation errors keyed by fieldname. Fed by the host; the form stays store-agnostic. */
	errors?: Record<string, string[]>
}>()

const hasChildSchema = (componentObj: ResolvedField) =>
	'schema' in componentObj && Array.isArray(componentObj.schema) && componentObj.schema.length > 0

const isLinkSection = (componentObj: ResolvedField): componentObj is ResolvedLink =>
	componentObj.kind === 'link' && hasChildSchema(componentObj)

const isFieldsetSection = (componentObj: ResolvedField): componentObj is ResolvedFieldset =>
	componentObj.kind === 'fieldset' && hasChildSchema(componentObj)

// Reactive nested data refs for two-way binding with the forms of linked records
const nestedData = ref<Record<string, any>>({})

// Sync external dataModel changes into nestedData (one-way, no emit back).
// Uses a shallow watch so only top-level object replacement (e.g. parent reset)
// triggers a sync — property mutations from within are handled by updateNestedData.
watch(
	() => dataModel.value,
	newData => {
		if (!schema || !newData) return
		schema.forEach(field => {
			if (isLinkSection(field)) {
				nestedData.value[field.fieldname] = newData[field.fieldname] ?? {}
			}
		})
	},
	{ immediate: true }
)

// A nested form's edits: updates nestedData locally and propagates upward in one step,
// avoiding the watchEffect feedback loop that occurred with v-model.
const updateNestedData = (fieldname: string, val: any) => {
	nestedData.value[fieldname] = val
	if (dataModel.value) {
		dataModel.value[fieldname] = val
		emit('update:data', { ...dataModel.value })
	}
}

// A fieldset's edits. Its form holds this record, so its edits are this record's.
const updateFieldsetData = (val: Record<string, any>) => {
	if (dataModel.value) {
		Object.assign(dataModel.value, val)
		emit('update:data', { ...dataModel.value })
	}
}

const isListExpansionTable = (componentObj: ResolvedField): componentObj is ResolvedTable =>
	componentObj.kind === 'table' && componentObj.config?.view === 'list-expansion'

const tableExpansionSchema = (table: ResolvedTable): ResolvedField[] =>
	table.schema
		.filter((col): col is ColumnSchema & { component: string } => Boolean(col.component))
		.map(({ fieldname, component, ...rest }) => Object.assign(rest, { kind: 'field' as const, fieldname, component }))

const updateTableRows = (fieldname: string, rows: Record<string, unknown>[]) => {
	if (dataModel.value) {
		dataModel.value[fieldname] = rows
		emit('update:data', { ...dataModel.value })
	}
}

const updateTableRow = (fieldname: string, rowIndex: number, val: Record<string, unknown>) => {
	const rows = Array.isArray(dataModel.value?.[fieldname]) ? [...dataModel.value[fieldname]] : []
	rows[rowIndex] = { ...rows[rowIndex], ...val }
	updateTableRows(fieldname, rows)
}

// Each field's `uuid` ties its label and error message to its input; one id per form keeps them
// unique when several forms, or a fieldset's nested form, share a page.
const formId = useId()

const componentProps = (componentObj: ResolvedField) => {
	const propsToPass: Record<string, any> = {}
	for (const [key, value] of Object.entries(componentObj)) {
		// 'mode' is excluded here because it is handled by resolvedMode()
		// and passed explicitly via :mode to avoid conflicting with the form-level defaults.
		if (!['component', 'primaryKey', 'computed', 'language', 'hidden', 'mode', 'width', 'height'].includes(key)) {
			propsToPass[key] = value
		}
	}
	propsToPass['uuid'] ??= `${formId}-${componentObj.fieldname}`

	// A table sources its rows from the data model, never from the schema, and its edits come back
	// through `update:rows`. `kind` is the only check: every path into AForm sets it (Zod's
	// injectKind, Doctype.fromObject's normalizeFieldKind, and the registry), and hand-built
	// ResolvedTable literals declare it.
	if (componentObj.kind === 'table') {
		propsToPass['rows'] = dataModel.value[componentObj.fieldname] || []
		propsToPass['onUpdate:rows'] = (rows: Record<string, unknown>[]) => updateTableRows(componentObj.fieldname, rows)
	}

	return propsToPass
}

const fieldStyle = (componentObj: ResolvedField): Record<string, string> => {
	if (componentObj.kind !== 'field') return {}
	const style: Record<string, string> = {}
	if (componentObj.width) {
		style.flexBasis = componentObj.width
		style.width = componentObj.width
	}
	if (componentObj.height) {
		style.height = componentObj.height
		style.minHeight = '0'
		style.flexGrow = '1'
		style.alignSelf = 'stretch'
	}
	return style
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
.aform input {
	font-family: var(--sc-font-family);
	border: none;
}
.aform_form-element {
	padding: var(--sc-form-label-offset) 0 0;
	margin: 0;
	position: relative;
	box-sizing: border-box;
	flex-grow: 1;
	min-width: 20ch;
	max-width: var(--sc-form-field-max-width);
	/* margin-bottom: 1rem; */
}
.aform__grid--full {
	flex-basis: 100%;
	width: 100%;
}
.aform_input-field {
	border: none;
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
	font-family: var(--sc-font-family);
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

/* A label darkens while anything beside it holds focus, wherever it sits in its field's markup. */
:focus-within > .aform_field-label {
	color: var(--sc-input-active-label-color);
}

.aform_field-label {
	color: var(--sc-input-label-color);
	display: inline-block;
	position: absolute;
	user-select: none;
	padding: 0 0.25rem;
	margin: 0rem;
	z-index: 1;
	font-size: 0.7rem;
	font-weight: 300;
	letter-spacing: 0.05rem;
	/* The form colour masks the field's top border behind the text; below it the field shows
	   through. Never paint a colour there: it can match only one of the surfaces a field shows. */
	background: linear-gradient(var(--sc-form-background) calc(50% + 1px), transparent calc(50% + 1px));
	width: auto;
	box-sizing: border-box;
	margin: 0;
	grid-row: 1;
	top: 0;
	left: 10px;
	border: none;
	line-height: 0;
	transform: translateY(-50%);
}
.aform_form-element > .aform_field-label {
	top: var(--sc-form-label-offset);
}

.aform_input-field:disabled,
.aform_checkbox-container:has(.aform_checkbox:disabled) {
	background: var(--sc-input-field-disabled-background);
}
.aform_field-label::after {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	content: '';
	line-height: normal;
}
p.aform_error {
	/* v-show toggles visibility per field; base display must be visible (was stuck at `none`,
	   which overrode v-show and left every field error dormant). */
	display: inline-block;
	/* Straddles the border like .aform_field-label, and paints the same way. */
	background: linear-gradient(var(--sc-form-background) calc(50% + 1px), transparent calc(50% + 1px));
	padding: 0 0.25rem;
	margin: 0rem;
	width: auto;
	color: var(--sc-brand-danger);
	font-size: 0.7rem;
	position: absolute;
	right: 0;
	top: var(--sc-form-label-offset);
	line-height: 0;
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
	background: var(--sc-form-background);
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
	color: var(--sc-input-label-color);
}

.aform-nested-section .aform {
	border-left-width: 2px;
	margin-left: 0.5rem;
}

.aform-table-expansion {
	margin-bottom: 0;
	border: none;
	border-left: none;
	padding: 0;
}
</style>
