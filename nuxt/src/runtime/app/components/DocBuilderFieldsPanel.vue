<template>
	<div class="fields-panel">
		<!-- Shared by every row's component input; the id is instance-scoped so two mounted panels
			 cannot collide. -->
		<datalist :id="componentListId">
			<option v-for="c in CANONICAL_COMPONENTS" :key="c" :value="c" />
		</datalist>
		<!--
			ATable owns the frame (header, filter row, list-expansion chrome). We override #body to
			keep the per-row #content property form and to bind every cell straight to the source via
			update() — ATable never calls setCellData/handleRowAction, so it never mutates the
			projection. After a structural edit (add/delete/move/duplicate) we collapse all rows via
			the exposed store, so ATable's index-keyed expand state can't outlive a reorder — without
			remounting, which would also drop the active filter.
		-->
		<ATable v-if="hasFields" ref="tableRef" :columns="FIELD_COLUMNS" :rows="fieldProjection" :config="FIELD_CONFIG">
			<template #body="{ data: store }">
				<ARow
					v-for="row in store.filteredRows"
					:key="row.__realIndex"
					:row-index="row.originalIndex"
					:store="store"
					@row:action="onRowAction">
					<template #default>
						<td>
							<input
								type="text"
								:value="row.fieldname"
								:disabled="isLocked(row.__field)"
								:class="{ locked: isLocked(row.__field) }"
								@input="update(row.__realIndex, 'fieldname', value($event))" />
						</td>
						<td>
							<input
								type="text"
								:value="row.label"
								@input="update(row.__realIndex, 'label', value($event) || undefined)" />
						</td>
						<td>
							<!--
								`component` is an open axis — naming a custom component is how an app renders a
								field Stonecrop ships no widget for — so this suggests the canonical set rather
								than restricting to it. A <select> would show a blank box for any custom
								component and make new ones unauthorable. Not frozen for introspected fields:
								the widget is an authoring choice, not a database fact (see ValueField.source).
							-->
							<input
								type="text"
								:value="row.component"
								:list="componentListId"
								@input="update(row.__realIndex, 'component', value($event) || undefined)" />
						</td>
						<td class="center">
							<input
								type="checkbox"
								:checked="bool(row.required)"
								:disabled="isLocked(row.__field)"
								@change="update(row.__realIndex, 'required', checked($event) || undefined)" />
						</td>
						<td>
							<span class="badge" :class="isLocked(row.__field) ? 'badge-introspected' : 'badge-manual'">
								{{ isLocked(row.__field) ? 'introspected' : 'manual' }}
							</span>
						</td>
					</template>
					<template #content>
						<div class="field-detail">
							<label v-for="p in TEXT_PROPS" :key="p.key" class="field-prop">
								<span>{{ p.label }}</span>
								<input
									type="text"
									:value="str(row.__field[p.key])"
									:disabled="isIdentity(p.key) && isLocked(row.__field)"
									@input="update(row.__realIndex, p.key, value($event) || undefined)" />
							</label>
							<label v-for="p in SELECT_PROPS" :key="p.key" class="field-prop">
								<span>{{ p.label }}</span>
								<select
									:value="str(row.__field[p.key])"
									:disabled="isIdentity(p.key) && isLocked(row.__field)"
									@change="update(row.__realIndex, p.key, value($event) || undefined)">
									<option value="">—</option>
									<option v-for="o in p.options" :key="o" :value="o">{{ o }}</option>
								</select>
							</label>
							<label v-for="p in BOOL_PROPS" :key="p.key" class="field-prop field-prop-inline">
								<input
									type="checkbox"
									:checked="bool(row.__field[p.key])"
									:disabled="isIdentity(p.key) && isLocked(row.__field)"
									@change="update(row.__realIndex, p.key, checked($event) || undefined)" />
								<span>{{ p.label }}</span>
							</label>
							<label v-for="p in JSON_PROPS" :key="p.key" class="field-prop field-prop-wide">
								<span>{{ p.label }} <em>(JSON — smart controls pending)</em></span>
								<input
									type="text"
									:value="jsonStr(row.__field[p.key])"
									:disabled="isIdentity(p.key) && isLocked(row.__field)"
									:class="{ 'json-invalid': jsonErrors[`${row.__realIndex}:${p.key}`] }"
									@change="updateJson(row.__realIndex, p.key, value($event))" />
							</label>
							<label class="field-prop field-prop-wide">
								<span>Validation message</span>
								<input
									type="text"
									:value="str(validationMessage(row.__field))"
									@input="updateValidation(row.__realIndex, value($event))" />
							</label>
						</div>
						<div v-if="isLocked(row.__field)" class="field-detail-actions">
							<span class="locked-note">
								Identity (id, primary key, required, options, cardinality, link target) is read-only — this field
								mirrors a database column. Component is yours to choose.
							</span>
						</div>
					</template>
				</ARow>
			</template>
		</ATable>
		<p v-else class="fields-empty">No fields yet.</p>
		<div class="fields-add">
			<button class="btn-add" type="button" @click="addField">+ Add field</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ATable, ARow } from '@stonecrop/atable'
import type { TableColumn, TableConfig } from '@stonecrop/atable'
import { CANONICAL_COMPONENTS, INTROSPECTED_IDENTITY_PROPS } from '@stonecrop/schema'
import { computed, nextTick, ref, useId } from 'vue'

// Fields are edited as loose objects: the doctype JSON carries keys the builder doesn't display
// (and may carry future ones), so the editor must spread-preserve every field rather than rebuild it.
// The write helpers live in ./docbuilderFields so that rule is unit-tested rather than only asserted
// here — see `nuxt/test/docbuilderFields.test.ts`.
import { updateFieldAt, type Field } from './docbuilderFields'

interface PropDef {
	key: string
	label: string
}

interface SelectPropDef extends PropDef {
	options: string[]
}

// Which props the database owns is decided once, in @stonecrop/schema, and read here. The
// converter's merge reads the same constant, so the panel cannot grey a different set than
// regeneration refuses to overwrite.
const IDENTITY_PROPS = new Set<string>(INTROSPECTED_IDENTITY_PROPS)
const isIdentity = (key: string) => IDENTITY_PROPS.has(key)

const componentListId = useId()

// `doctype` is what makes a field a link, and it names the target — so it is a plain text input,
// not a JSON one. As `options` (the legacy carrier) a link target had to be typed *with quotes*
// or the JSON parse failed and the value was silently dropped.
const TEXT_PROPS: PropDef[] = [
	{ key: 'doctype', label: 'Link target' },
	{ key: 'width', label: 'Width' },
	{ key: 'mask', label: 'Mask' },
	{ key: 'format', label: 'Format' },
	{ key: 'language', label: 'Code language' },
]
const SELECT_PROPS: SelectPropDef[] = [
	{ key: 'align', label: 'Align', options: ['left', 'center', 'right', 'start', 'end'] },
	{ key: 'mode', label: 'Mode', options: ['edit', 'read', 'display'] },
	{
		key: 'cardinality',
		label: 'Cardinality',
		options: ['atMostOne', 'one', 'noneOrMany', 'atLeastOne'],
	},
]
const BOOL_PROPS: PropDef[] = [
	{ key: 'readOnly', label: 'Read only' },
	{ key: 'hidden', label: 'Hidden' },
	{ key: 'edit', label: 'Editable in table' },
	{ key: 'primaryKey', label: 'Primary key' },
	{ key: 'computed', label: 'Computed (no DB column)' },
]
const JSON_PROPS: PropDef[] = [
	{ key: 'options', label: 'Options' },
	{ key: 'default', label: 'Default' },
]

// `sortable: false` suppresses the click-to-sort affordance (row order here is the field array's
// order, not a view concern). The enumerable columns (component, source) use `filterType: 'select'`
// so the header filter is a dropdown auto-populated from the values in use, not a free-text box.
const FIELD_COLUMNS: TableColumn[] = [
	{ name: 'fieldname', label: 'ID', sortable: false, filterable: true },
	{ name: 'label', label: 'Label', sortable: false },
	{ name: 'component', label: 'Component', sortable: false, filterable: true, filterType: 'select' },
	{ name: 'required', label: 'Required', sortable: false, align: 'center' },
	{ name: 'source', label: 'Source', sortable: false, filterable: true, filterType: 'select' },
]

// Every row action lives in the start-of-row `⋮` menu (forceDropdown). ATable's per-row `disabled`
// predicate greys move-at-the-ends and delete-for-introspected — the per-row state the global config
// couldn't express. ATable wires these to its own handleRowAction, but we override #body, so
// `@row:action` routes to onRowAction below and ATable never mutates the projection.
const FIELD_CONFIG = {
	view: 'list-expansion',
	fullWidth: true,
	rowActions: {
		enabled: true,
		forceDropdown: true,
		position: 'before-index',
		actions: {
			moveUp: { enabled: true, label: 'Move up', disabled: rowIndex => rowIndex === 0 },
			moveDown: {
				enabled: true,
				label: 'Move down',
				disabled: (rowIndex, store) => rowIndex === store.rows.length - 1,
			},
			duplicate: { enabled: true, label: 'Duplicate' },
			insertAbove: { enabled: true, label: 'Insert above' },
			insertBelow: { enabled: true, label: 'Insert below' },
			delete: {
				enabled: true,
				label: 'Delete',
				disabled: (rowIndex, store) => isLocked(store.rows[rowIndex]?.__field ?? {}),
			},
		},
	},
} satisfies TableConfig

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

// One-way projection of the value fields into ATable rows. Column-named scalars drive the header
// filters and rendered cells; `__realIndex`/`__field` are backrefs the cells + property form write
// through. `source` is projected as its display label so a Source filter matches the badge text.
const fieldProjection = computed(() =>
	valueFieldRows.value.map(r => ({
		fieldname: str(r.field.fieldname),
		label: str(r.field.label),
		component: str(r.field.component),
		required: r.field.required === true,
		source: isLocked(r.field) ? 'introspected' : 'manual',
		__realIndex: r.realIndex,
		__field: r.field,
	}))
)

// ATable exposes its internal store; we reach in only to collapse expanded rows after a structural
// edit (the expand map is index-keyed, so a reorder/delete would otherwise leave the wrong row open).
// Filter state lives on the same store and is deliberately left untouched.
type ATableExpose = {
	store?: { display: { expanded?: boolean }[]; toggleRowExpand: (rowIndex: number) => void }
}
const tableRef = ref<ATableExpose>()

function collapseAllRows() {
	const store = tableRef.value?.store
	if (!store) return
	store.display.forEach((d, i) => {
		if (d.expanded) store.toggleRowExpand(i)
	})
}

// Every mutation rebuilds the FULL array by real index — nested fields at other indices are
// untouched, and order is preserved. This is the field-level "spread, never enumerate" rule.
function update(realIndex: number, key: string, val: unknown) {
	emit('update:modelValue', updateFieldAt(props.modelValue, realIndex, key, val))
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
	const base: Field = { kind: 'field', fieldname: uniqueName(), component: 'ATextInput', label: 'New Field' }
	emit('update:modelValue', [...props.modelValue, base])
	void nextTick(collapseAllRows)
}
// Insert a blank field at a real-array position (menu insert-above/below). Splices, so nested
// fieldsets at other indices are untouched.
function insertField(at: number) {
	const base: Field = { kind: 'field', fieldname: uniqueName(), component: 'ATextInput', label: 'New Field' }
	const next = props.modelValue.slice()
	next.splice(at, 0, base)
	emit('update:modelValue', next)
	void nextTick(collapseAllRows)
}
// Row context-menu (⋮) actions. rowIndex is the projection index (originalIndex); map it to the
// real-array index, then route to the existing mutators. up/down are NOT here — they stay inline.
function onRowAction(type: string, rowIndex: number) {
	const realIndex = fieldProjection.value[rowIndex]?.__realIndex
	if (realIndex === undefined) return
	if (type === 'moveUp') moveField(realIndex, -1)
	else if (type === 'moveDown') moveField(realIndex, 1)
	else if (type === 'duplicate') duplicateField(realIndex)
	else if (type === 'delete') removeField(realIndex)
	else if (type === 'insertAbove') insertField(realIndex)
	else if (type === 'insertBelow') insertField(realIndex + 1)
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
	void nextTick(collapseAllRows)
}

// A duplicate is a brand-new manual field: drop `source` so an introspected row's copy isn't
// frozen (only the converter ever stamps provenance), and uniquify the fieldname.
function duplicateField(realIndex: number) {
	const original = props.modelValue[realIndex]
	if (!original) return
	const { source: _source, ...rest } = original
	const existing = new Set(props.modelValue.map(f => String(f.fieldname ?? '')))
	const baseName = `${String(rest.fieldname ?? 'field')}_copy`
	let fieldname = baseName
	let n = 1
	while (existing.has(fieldname)) fieldname = `${baseName}_${++n}`
	const clone: Field = { ...rest, fieldname }
	const next = props.modelValue.slice()
	next.splice(realIndex + 1, 0, clone)
	emit('update:modelValue', next)
	void nextTick(collapseAllRows)
}
// Reorder by swapping the two value fields' REAL positions. Any nested fieldset/table sitting
// between them in the array stays put — the field-level "spread, never enumerate" invariant.
function moveField(realIndex: number, dir: -1 | 1) {
	const rows = valueFieldRows.value
	const pos = rows.findIndex(r => r.realIndex === realIndex)
	const target = rows[pos + dir]
	if (!target) return
	const next = props.modelValue.slice()
	const a = next[realIndex]
	const b = next[target.realIndex]
	if (a === undefined || b === undefined) return
	next[realIndex] = b
	next[target.realIndex] = a
	emit('update:modelValue', next)
	void nextTick(collapseAllRows)
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

/* The body cells are our own <td>s (not ACell), so reproduce ATable's row separator
   (ACell's only gridline is a top border) and its padding. */
.fields-panel :deep(.atable-row > td) {
	padding: var(--sc-atable-row-padding, 0.125rem) 0.75em;
	vertical-align: middle;
	border-top: 1px solid var(--sc-row-border-color, #e5e7eb);
}

.fields-panel :deep(input[type='text']),
.fields-panel :deep(select) {
	width: 100%;
	border: 1px solid var(--sc-gray-20, #d1d5db);
	border-radius: 3px;
	padding: 0.25em 0.5em;
	font-size: inherit;
	font-family: inherit;
}

.fields-panel :deep(input.locked),
.fields-panel :deep(select.locked) {
	background: var(--sc-gray-10, #f3f4f6);
	color: #6b7280;
	cursor: not-allowed;
}

.fields-panel :deep(input.json-invalid) {
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
