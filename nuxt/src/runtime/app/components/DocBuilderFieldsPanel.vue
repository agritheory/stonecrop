<template>
	<div class="fields-panel">
		<table v-if="hasFields" class="fields-table">
			<thead>
				<tr>
					<th class="expand-col" />
					<th>ID</th>
					<th>Label</th>
					<th>Fieldtype</th>
					<th>Required</th>
					<th>Source</th>
					<th class="actions-col">Actions</th>
				</tr>
			</thead>
			<tbody>
				<template v-for="row in valueFieldRows" :key="row.realIndex">
					<AExpansionRow :row-index="row.rowIndex" :store="fieldStore">
						<template #row>
							<td>
								<input
									type="text"
									:value="str(row.field.fieldname)"
									:disabled="isLocked(row.field)"
									:class="{ locked: isLocked(row.field) }"
									@input="update(row.realIndex, 'fieldname', value($event))" />
							</td>
							<td>
								<input
									type="text"
									:value="str(row.field.label)"
									@input="update(row.realIndex, 'label', value($event) || undefined)" />
							</td>
							<td>
								<select
									:value="str(row.field.fieldtype)"
									:disabled="isLocked(row.field)"
									:class="{ locked: isLocked(row.field) }"
									@change="update(row.realIndex, 'fieldtype', value($event))">
									<option v-for="t in FIELD_TYPES" :key="t" :value="t">{{ t }}</option>
								</select>
							</td>
							<td class="center">
								<input
									type="checkbox"
									:checked="bool(row.field.required)"
									:disabled="isLocked(row.field)"
									@change="update(row.realIndex, 'required', checked($event) || undefined)" />
							</td>
							<td>
								<span class="badge" :class="isLocked(row.field) ? 'badge-introspected' : 'badge-manual'">
									{{ isLocked(row.field) ? 'introspected' : 'manual' }}
								</span>
							</td>
							<td class="row-actions">
								<button
									type="button"
									title="Move up"
									:disabled="row.rowIndex === 0"
									@click="moveField(row.realIndex, -1)">
									↑
								</button>
								<button
									type="button"
									title="Move down"
									:disabled="row.rowIndex === valueFieldRows.length - 1"
									@click="moveField(row.realIndex, 1)">
									↓
								</button>
								<button type="button" title="Duplicate" @click="duplicateField(row.realIndex)">⧉</button>
								<button type="button" title="Delete" class="danger" @click="removeField(row.realIndex)">✕</button>
							</td>
						</template>
						<template #content>
							<div class="field-detail">
								<label v-for="p in TEXT_PROPS" :key="p.key" class="field-prop">
									<span>{{ p.label }}</span>
									<input
										type="text"
										:value="str(row.field[p.key])"
										:disabled="!!p.identity && isLocked(row.field)"
										@input="update(row.realIndex, p.key, value($event) || undefined)" />
								</label>
								<label v-for="p in SELECT_PROPS" :key="p.key" class="field-prop">
									<span>{{ p.label }}</span>
									<select
										:value="str(row.field[p.key])"
										:disabled="!!p.identity && isLocked(row.field)"
										@change="update(row.realIndex, p.key, value($event) || undefined)">
										<option value="">—</option>
										<option v-for="o in p.options" :key="o" :value="o">{{ o }}</option>
									</select>
								</label>
								<label v-for="p in BOOL_PROPS" :key="p.key" class="field-prop field-prop-inline">
									<input
										type="checkbox"
										:checked="bool(row.field[p.key])"
										@change="update(row.realIndex, p.key, checked($event) || undefined)" />
									<span>{{ p.label }}</span>
								</label>
								<label v-for="p in JSON_PROPS" :key="p.key" class="field-prop field-prop-wide">
									<span>{{ p.label }} <em>(JSON — smart controls pending)</em></span>
									<input
										type="text"
										:value="jsonStr(row.field[p.key])"
										:disabled="!!p.identity && isLocked(row.field)"
										:class="{ 'json-invalid': jsonErrors[`${row.realIndex}:${p.key}`] }"
										@change="updateJson(row.realIndex, p.key, value($event))" />
								</label>
								<label class="field-prop field-prop-wide">
									<span>Validation message</span>
									<input
										type="text"
										:value="str(validationMessage(row.field))"
										@input="updateValidation(row.realIndex, value($event))" />
								</label>
							</div>
							<div v-if="isLocked(row.field)" class="field-detail-actions">
								<span class="locked-note">
									Identity (id, type, required, options, cardinality) is read-only — this field mirrors a database
									column.
								</span>
							</div>
						</template>
					</AExpansionRow>
				</template>
			</tbody>
		</table>
		<p v-else class="fields-empty">No fields yet.</p>
		<div class="fields-add">
			<button class="btn-add" type="button" @click="addField">+ Add field</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { AExpansionRow, createTableStore } from '@stonecrop/atable'
import type { TableColumn } from '@stonecrop/atable'
import { BUILTIN_FIELD_TYPES } from '@stonecrop/schema'
import { computed, ref, watch } from 'vue'

// Fields are edited as loose objects: the doctype JSON carries keys the builder doesn't display
// (and may carry future ones), so the editor must spread-preserve every field rather than rebuild it.
type Field = Record<string, unknown>

interface PropDef {
	key: string
	label: string
	/** Part of the DB-derived identity set — frozen when the field is introspected. */
	identity?: boolean
}
interface SelectPropDef extends PropDef {
	options: string[]
}

const FIELD_TYPES = BUILTIN_FIELD_TYPES

const TEXT_PROPS: PropDef[] = [
	{ key: 'component', label: 'Component' },
	{ key: 'width', label: 'Width' },
	{ key: 'mask', label: 'Mask' },
]
const SELECT_PROPS: SelectPropDef[] = [
	{ key: 'align', label: 'Align', options: ['left', 'center', 'right', 'start', 'end'] },
	{ key: 'mode', label: 'Mode', options: ['edit', 'read', 'display'] },
	{
		key: 'cardinality',
		label: 'Cardinality',
		options: ['atMostOne', 'one', 'noneOrMany', 'atLeastOne'],
		identity: true,
	},
]
const BOOL_PROPS: PropDef[] = [
	{ key: 'readOnly', label: 'Read only' },
	{ key: 'hidden', label: 'Hidden' },
	{ key: 'edit', label: 'Editable in table' },
]
const JSON_PROPS: PropDef[] = [
	{ key: 'options', label: 'Options', identity: true },
	{ key: 'default', label: 'Default' },
]

const FIELD_COLUMNS: TableColumn[] = [
	{ name: 'fieldname' },
	{ name: 'label' },
	{ name: 'fieldtype' },
	{ name: 'required' },
	{ name: 'source' },
]

const props = defineProps<{ modelValue: Field[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: Field[]] }>()

// A value field is `kind: 'field'`, or — when `kind` is omitted — anything that is not a
// fieldset (`schema`) or inline table (`columns`). Nested kinds are never rendered, only preserved.
function isValueField(f: Field): boolean {
	if (typeof f.kind === 'string') return f.kind === 'field'
	return !('schema' in f) && !('columns' in f)
}
function isLocked(f: Field): boolean {
	return f.source === 'introspected'
}

const valueFieldRows = computed(() => {
	const out: { field: Field; realIndex: number; rowIndex: number }[] = []
	props.modelValue.forEach((f, realIndex) => {
		if (isValueField(f)) out.push({ field: f, realIndex, rowIndex: out.length })
	})
	return out
})
const hasFields = computed(() => valueFieldRows.value.length > 0)

const fieldStore = createTableStore({
	columns: FIELD_COLUMNS,
	rows: valueFieldRows.value.map(r => r.field),
	config: { view: 'list-expansion' },
})
watch(valueFieldRows, rows => fieldStore.updateRows(rows.map(r => r.field)))

// Every mutation rebuilds the FULL array by real index — nested fields at other indices are
// untouched, and order is preserved. This is the field-level "spread, never enumerate" rule.
function update(realIndex: number, key: string, val: unknown) {
	emit(
		'update:modelValue',
		props.modelValue.map((f, i) => (i === realIndex ? setOrDelete(f, key, val) : f))
	)
}
function setOrDelete(field: Field, key: string, val: unknown): Field {
	if (val === undefined) {
		const { [key]: _omit, ...rest } = field
		return rest
	}
	return { ...field, [key]: val }
}

const jsonErrors = ref<Record<string, boolean>>({})
function jsonStr(v: unknown): string {
	return v === undefined ? '' : JSON.stringify(v)
}
function updateJson(realIndex: number, key: string, raw: string) {
	const errKey = `${realIndex}:${key}`
	if (raw.trim() === '') {
		jsonErrors.value[errKey] = false
		update(realIndex, key, undefined)
		return
	}
	try {
		const parsed: unknown = JSON.parse(raw)
		jsonErrors.value[errKey] = false
		update(realIndex, key, parsed)
	} catch {
		jsonErrors.value[errKey] = true
	}
}

function validationMessage(field: Field): string {
	const v = field.validation
	if (v && typeof v === 'object' && 'errorMessage' in v)
		return String((v as Record<string, unknown>).errorMessage ?? '')
	return ''
}
function updateValidation(realIndex: number, message: string) {
	update(realIndex, 'validation', message ? { errorMessage: message } : undefined)
}

function addField() {
	const base: Field = { kind: 'field', fieldname: uniqueName(), fieldtype: 'Data', label: 'New Field' }
	emit('update:modelValue', [...props.modelValue, base])
}
function uniqueName(): string {
	const existing = new Set(props.modelValue.map(f => String(f.fieldname ?? '')))
	let name = 'new_field'
	let n = 1
	while (existing.has(name)) name = `new_field_${++n}`
	return name
}
function removeField(realIndex: number) {
	emit(
		'update:modelValue',
		props.modelValue.filter((_, i) => i !== realIndex)
	)
}

// A duplicate is a brand-new manual field: drop `source` so an introspected row's copy isn't
// frozen (only the converter ever stamps provenance), and uniquify the fieldname.
function duplicateField(realIndex: number) {
	const { source: _source, ...rest } = props.modelValue[realIndex]
	const existing = new Set(props.modelValue.map(f => String(f.fieldname ?? '')))
	const baseName = `${String(rest.fieldname ?? 'field')}_copy`
	let fieldname = baseName
	let n = 1
	while (existing.has(fieldname)) fieldname = `${baseName}_${++n}`
	const clone: Field = { ...rest, fieldname }
	const next = props.modelValue.slice()
	next.splice(realIndex + 1, 0, clone)
	emit('update:modelValue', next)
}
// Reorder by swapping the two value fields' REAL positions. Any nested fieldset/table sitting
// between them in the array stays put — the field-level "spread, never enumerate" invariant.
function moveField(realIndex: number, dir: -1 | 1) {
	const rows = valueFieldRows.value
	const pos = rows.findIndex(r => r.realIndex === realIndex)
	const target = rows[pos + dir]
	if (!target) return
	const next = props.modelValue.slice()
	;[next[realIndex], next[target.realIndex]] = [next[target.realIndex], next[realIndex]]
	emit('update:modelValue', next)
}

function value(e: Event): string {
	return (e.target as HTMLInputElement | HTMLSelectElement).value
}
function checked(e: Event): boolean {
	return (e.target as HTMLInputElement).checked
}
function str(v: unknown): string {
	return v == null ? '' : String(v)
}
function bool(v: unknown): boolean {
	return v === true
}
</script>

<style scoped>
.fields-panel {
	padding: 0.5em 1em;
}

.fields-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.875rem;
}

.fields-table th {
	text-align: left;
	padding: 0.5em 0.75em;
	border-bottom: 2px solid var(--sc-gray-20, #e5e7eb);
	font-weight: 600;
	white-space: nowrap;
}

.expand-col {
	width: 2ch;
}

.fields-table :deep(td) {
	padding: 0.375em 0.75em;
	vertical-align: middle;
}

.fields-table input[type='text'],
.fields-table select {
	width: 100%;
	border: 1px solid var(--sc-gray-20, #d1d5db);
	border-radius: 3px;
	padding: 0.25em 0.5em;
	font-size: inherit;
	font-family: inherit;
}

.fields-table input.locked,
.fields-table select.locked {
	background: var(--sc-gray-10, #f3f4f6);
	color: #6b7280;
	cursor: not-allowed;
}

.fields-table input.json-invalid {
	border-color: #f87171;
	background: #fef2f2;
}

.center {
	text-align: center;
}

.badge {
	display: inline-block;
	padding: 0.125em 0.5em;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 500;
}

.badge-manual {
	background: #dcfce7;
	color: #166534;
}

.badge-introspected {
	background: #e0e7ff;
	color: #3730a3;
}

.field-detail {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
	gap: 0.75rem 1rem;
	padding: 0.75rem 1rem;
}

.field-prop {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	font-size: 0.75rem;
	color: var(--sc-header-text-color, #374151);
}

.field-prop-inline {
	flex-direction: row;
	align-items: center;
	gap: 0.5rem;
}

.field-prop-wide {
	grid-column: 1 / -1;
}

.field-detail-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 0 1rem 0.75rem;
}

.locked-note {
	font-size: 0.75rem;
	color: #6b7280;
	font-style: italic;
}

.btn-danger {
	background: none;
	border: 1px solid #ef4444;
	color: #b91c1c;
	border-radius: 4px;
	padding: 0.25em 0.75em;
	cursor: pointer;
	font-size: 0.75rem;
}

.row-actions {
	white-space: nowrap;
}
.row-actions button {
	border: 1px solid var(--sc-gray-20, #d1d5db);
	background: none;
	border-radius: 3px;
	padding: 0.1em 0.4em;
	margin: 0 0.1em;
	cursor: pointer;
	font-size: 0.8rem;
	line-height: 1;
}
.row-actions button:disabled {
	opacity: 0.35;
	cursor: not-allowed;
}
.row-actions button.danger {
	border-color: #ef4444;
	color: #b91c1c;
}
.actions-col {
	width: 1%;
}

.btn-add {
	background: none;
	border: 1px dashed var(--sc-gray-20, #d1d5db);
	color: var(--sc-blue-40, #2563eb);
	border-radius: 4px;
	padding: 0.4em 1em;
	cursor: pointer;
	font-size: 0.875rem;
	margin-top: 0.5rem;
}

.fields-empty {
	color: #9ca3af;
	font-style: italic;
	padding: 1rem 0;
}
</style>
