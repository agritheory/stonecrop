<template>
	<form class="aform">
		<template v-for="(componentObj, key) in schema" :key="key">
			<!-- Nested Doctype field - automatically rendered -->
			<div
				v-if="(componentObj as any).fieldtype === 'Doctype' && nestedSchemas[componentObj.fieldname]"
				class="aform-nested-section">
				<h4 v-if="(componentObj as any).label" class="aform-nested-label">
					{{ (componentObj as any).label }}
				</h4>
				<AForm
					v-model:data="nestedData[componentObj.fieldname]"
					:schema="nestedSchemas[componentObj.fieldname]"
					:read-only="readOnly || (componentObj as any).readOnly" />
			</div>

			<!-- Regular field (non-Doctype) -->
			<component
				:is="componentObj.component"
				v-else
				v-model="childModels[key].value"
				:schema="componentObj"
				:data="dataModel[componentObj.fieldname]"
				:read-only="readOnly"
				v-bind="componentProps(componentObj)">
			</component>
		</template>
	</form>
</template>

<script setup lang="ts">
import { computed, watchEffect, ref, inject } from 'vue'
import type { FormSchema, SchemaTypes } from '../types'

// Import types from stonecrop for registry
interface SchemaRegistry {
	registry: Record<string, { doctype: string; slug: string; schema?: SchemaTypes[] }>
}

const emit = defineEmits(['update:schema', 'update:data'])
const dataModel = defineModel<Record<string, any>>('data', { required: true })
const { schema, readOnly } = defineProps<{
	schema: SchemaTypes[]
	readOnly?: boolean
}>()

// Inject registry for nested schema loading (optional)
const registry = inject<SchemaRegistry | undefined>('$registry', undefined)

// Load nested schemas for Doctype fields
const nestedSchemas = ref<Record<string, SchemaTypes[]>>({})
const nestedData = ref<Record<string, any>>({})

// Helper function to check if field has a property
function hasProperty<K extends string>(obj: any, key: K): obj is Record<K, any> {
	return obj && key in obj
}

// Initialize nested schemas and data when component mounts or schema changes
watchEffect(() => {
	if (!registry || !schema) return

	schema.forEach(field => {
		// Check if this is a Doctype field (using duck typing)
		if (
			hasProperty(field, 'fieldtype') &&
			field.fieldtype === 'Doctype' &&
			hasProperty(field, 'options') &&
			typeof field.options === 'string'
		) {
			const doctypeSlug = field.options
			const doctype = registry.registry[doctypeSlug]

			if (doctype && doctype.schema) {
				// Convert schema if it's an Iterable (Immutable.List)
				const schemaArray: SchemaTypes[] = Array.isArray(doctype.schema) ? doctype.schema : Array.from(doctype.schema)
				nestedSchemas.value[field.fieldname] = schemaArray

				// Initialize nested data if it doesn't exist
				if (!dataModel.value[field.fieldname]) {
					dataModel.value[field.fieldname] = initializeNestedRecord(schemaArray)
				}
				nestedData.value[field.fieldname] = dataModel.value[field.fieldname]
			}
		}
	})
})

// Sync nested data changes back to main data model
watchEffect(() => {
	Object.keys(nestedData.value).forEach(fieldname => {
		if (dataModel.value && nestedData.value[fieldname] !== dataModel.value[fieldname]) {
			dataModel.value[fieldname] = nestedData.value[fieldname]
			emit('update:data', dataModel.value)
		}
	})
})

// Initialize a nested record with default values based on schema
function initializeNestedRecord(schema: FormSchema[]): Record<string, any> {
	const record: Record<string, any> = {}
	schema.forEach(field => {
		const fieldtype = field.fieldtype || 'Data'
		switch (fieldtype) {
			case 'Data':
			case 'Text':
				record[field.fieldname] = ''
				break
			case 'Check':
				record[field.fieldname] = false
				break
			case 'Int':
			case 'Float':
				record[field.fieldname] = 0
				break
			case 'Table':
				record[field.fieldname] = []
				break
			case 'JSON':
			case 'Doctype':
				record[field.fieldname] = {}
				break
			default:
				record[field.fieldname] = null
		}
	})
	return record
}

// Sync data values into schema immediately and on changes
watchEffect(() => {
	if (dataModel.value && schema) {
		// Sync data values into schema
		schema.forEach(field => {
			if (field.fieldname && dataModel.value[field.fieldname] !== undefined) {
				field.value = dataModel.value[field.fieldname]
			}
		})
	}
})

const componentProps = (componentObj: SchemaTypes) => {
	const propsToPass: Record<string, any> = {}
	for (const [key, value] of Object.entries(componentObj)) {
		if (!['component', 'fieldtype'].includes(key)) {
			propsToPass[key] = value
		}

		// handle ATable data formats in case the table is nested under an AForm;
		// TODO: there's probably a better way to do this
		if (key === 'rows') {
			if (value && (value as any[]).length === 0) {
				propsToPass['rows'] = dataModel.value[componentObj.fieldname]
			}
		}
	}
	return propsToPass
}

// Create stable computed refs array to avoid recreation on every access
const childModelsCache = ref<ReturnType<typeof computed>[]>([])

// Watch for schema changes and update cache (avoiding side effects in computed)
watchEffect(() => {
	if (!schema) return

	// Recreate cache only if length changed
	if (childModelsCache.value.length !== schema.length) {
		childModelsCache.value = schema.map((val, i) => {
			return computed({
				get() {
					return val.value
				},
				set: newValue => {
					const fieldname = schema[i].fieldname
					// Find the component in schema and update it
					// eslint-disable-next-line vue/no-mutating-props
					schema[i].value = newValue
					// Also sync to data model for two-way binding
					if (fieldname && dataModel.value) {
						dataModel.value[fieldname] = newValue
						// Manually emit to trigger parent's update:data handler
						emit('update:data', dataModel.value)
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

.aform_input-field:focus + .aform_field-label {
	color: var(--sc-input-active-label-color);
}

.aform_field-label {
	color: var(--sc-input-label-color);
	display: inline-block;
	position: absolute;
	padding: 0 0.25rem;
	margin: 0rem;
	z-index: 2;
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
/* @import url('@stonecrop/themes/default.css'); */
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
