<template>
	<form class="aform" :class="{ 'aform--loading': loading }">
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
					:loading="loading"
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
				:disabled="loading || undefined"
				v-bind="componentProps(componentObj)">
			</component>
		</template>

		<!-- Animated loading bar — only rendered while loading is true -->
		<div v-if="loading" class="aform-loading-bar"></div>
	</form>
</template>

<script setup lang="ts">
import { computed, watchEffect, watch, ref } from 'vue'

import type { ResolvedField, ResolvedLink, ResolvedFieldset } from '../types'
import type { InteractionMode } from '@stonecrop/schema'

const emit = defineEmits(['update:schema', 'update:data'])
const dataModel = defineModel<Record<string, any>>('data', { required: true })
const {
	schema,
	mode = 'edit',
	loading = false,
} = defineProps<{
	schema: ResolvedField[]
	mode?: InteractionMode
	loading?: boolean
}>()

const isNestedSection = (componentObj: ResolvedField): componentObj is ResolvedLink | ResolvedFieldset =>
	(componentObj.kind === 'link' || componentObj.kind === 'fieldset') &&
	'schema' in componentObj &&
	Array.isArray(componentObj.schema) &&
	componentObj.schema.length > 0

const nestedData = ref<Record<string, any>>({})

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
		if (!['component', 'fieldtype', 'hidden', 'mode', 'width'].includes(key)) {
			propsToPass[key] = value
		}
	}

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

function resolvedMode(componentObj: ResolvedField): InteractionMode {
	const fieldMode = componentObj.mode
	if (fieldMode) return fieldMode
	return effectiveFormMode.value
}

const childModelsCache = ref<ReturnType<typeof computed>[]>([])

watchEffect(() => {
	if (!schema) return

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

const childModels = computed(() => childModelsCache.value)
</script>

<style>
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
	position: relative;
	overflow: hidden;
}
@media screen and (max-width: 400px) {
	.aform {
		flex-direction: column;
	}
}

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

.aform--loading {
	pointer-events: none;
	user-select: none;
}

.aform-loading-bar {
	width: 50%;
	height: 3px;
	position: absolute;
	left: -50%;
	bottom: 0;
	background: var(--sc-row-border-color, #999);
	animation: bar-left 2s infinite;
	z-index: 1;
}

@keyframes bar-left {
	0% {
		left: -50%;
	}
	100% {
		left: 100%;
	}
}
</style>
