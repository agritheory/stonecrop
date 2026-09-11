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
								@input="update(row.__realIndex, 'label', value($event) || void 0)" />
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
								@input="update(row.__realIndex, 'component', value($event) || void 0)" />
						</td>
						<td class="center">
							<input
								type="checkbox"
								:checked="bool(row.required)"
								:disabled="isLocked(row.__field)"
								@change="update(row.__realIndex, 'required', checked($event) || void 0)" />
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
									@input="update(row.__realIndex, p.key, value($event) || void 0)" />
							</label>
							<label v-for="p in SELECT_PROPS" :key="p.key" class="field-prop">
								<span>{{ p.label }}</span>
								<select
									:value="str(row.__field[p.key])"
									:disabled="isIdentity(p.key) && isLocked(row.__field)"
									@change="update(row.__realIndex, p.key, value($event) || void 0)">
									<option value="">—</option>
									<option v-for="o in p.options" :key="o" :value="o">{{ o }}</option>
								</select>
							</label>
							<label v-for="p in BOOL_PROPS" :key="p.key" class="field-prop field-prop-inline">
								<input
									type="checkbox"
									:checked="bool(row.__field[p.key])"
									:disabled="isIdentity(p.key) && isLocked(row.__field)"
									@change="update(row.__realIndex, p.key, checked($event) || void 0)" />
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

<script setup>
import { ATable, ARow } from '@stonecrop/atable'
import { CANONICAL_COMPONENTS, INTROSPECTED_IDENTITY_PROPS } from '@stonecrop/schema'
import { computed, nextTick, ref, useId } from 'vue'
import { isValueField, updateFieldAt } from './docbuilderFields'
const IDENTITY_PROPS = new Set(INTROSPECTED_IDENTITY_PROPS)
const isIdentity = key => IDENTITY_PROPS.has(key)
const componentListId = useId()
const TEXT_PROPS = [
	{ key: 'doctype', label: 'Link target' },
	{ key: 'width', label: 'Width' },
	{ key: 'mask', label: 'Mask' },
	{ key: 'format', label: 'Format' },
	{ key: 'language', label: 'Code language' },
]
const SELECT_PROPS = [
	{ key: 'align', label: 'Align', options: ['left', 'center', 'right', 'start', 'end'] },
	{ key: 'mode', label: 'Mode', options: ['edit', 'read', 'display'] },
	{
		key: 'cardinality',
		label: 'Cardinality',
		options: ['atMostOne', 'one', 'noneOrMany', 'atLeastOne'],
	},
]
const BOOL_PROPS = [
	{ key: 'readOnly', label: 'Read only' },
	{ key: 'hidden', label: 'Hidden' },
	{ key: 'edit', label: 'Editable in table' },
	{ key: 'primaryKey', label: 'Primary key' },
	{ key: 'computed', label: 'Computed (no DB column)' },
]
const JSON_PROPS = [
	{ key: 'options', label: 'Options' },
	{ key: 'default', label: 'Default' },
]
const FIELD_COLUMNS = [
	{ name: 'fieldname', label: 'ID', sortable: false, filterable: true },
	{ name: 'label', label: 'Label', sortable: false },
	{ name: 'component', label: 'Component', sortable: false, filterable: true, filterType: 'select' },
	{ name: 'required', label: 'Required', sortable: false, align: 'center' },
	{ name: 'source', label: 'Source', sortable: false, filterable: true, filterType: 'select' },
]
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
}
const props = defineProps({
	modelValue: { type: Array, required: true },
})
const emit = defineEmits(['update:modelValue'])
function isLocked(f) {
	return f.source === 'introspected'
}
const valueFieldRows = computed(() => {
	const out = []
	props.modelValue.forEach((f, realIndex) => {
		if (isValueField(f)) out.push({ field: f, realIndex, rowIndex: out.length })
	})
	return out
})
const hasFields = computed(() => valueFieldRows.value.length > 0)
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
const tableRef = ref()
function collapseAllRows() {
	const store = tableRef.value?.store
	if (!store) return
	store.display.forEach((d, i) => {
		if (d.expanded) store.toggleRowExpand(i)
	})
}
function update(realIndex, key, val) {
	emit('update:modelValue', updateFieldAt(props.modelValue, realIndex, key, val))
}
const jsonErrors = ref({})
function jsonStr(v) {
	return v === void 0 ? '' : JSON.stringify(v)
}
function updateJson(realIndex, key, raw) {
	const errKey = `${realIndex}:${key}`
	if (raw.trim() === '') {
		jsonErrors.value[errKey] = false
		update(realIndex, key, void 0)
		return
	}
	try {
		const parsed = JSON.parse(raw)
		jsonErrors.value[errKey] = false
		update(realIndex, key, parsed)
	} catch {
		jsonErrors.value[errKey] = true
	}
}
function validationMessage(field) {
	const v = field.validation
	if (v && typeof v === 'object' && 'errorMessage' in v) return String(v.errorMessage ?? '')
	return ''
}
function updateValidation(realIndex, message) {
	update(realIndex, 'validation', message ? { errorMessage: message } : void 0)
}
function addField() {
	const base = { kind: 'field', fieldname: uniqueName(), component: 'ATextInput', label: 'New Field' }
	emit('update:modelValue', [...props.modelValue, base])
	void nextTick(collapseAllRows)
}
function insertField(at) {
	const base = { kind: 'field', fieldname: uniqueName(), component: 'ATextInput', label: 'New Field' }
	const next = props.modelValue.slice()
	next.splice(at, 0, base)
	emit('update:modelValue', next)
	void nextTick(collapseAllRows)
}
function onRowAction(type, rowIndex) {
	const realIndex = fieldProjection.value[rowIndex]?.__realIndex
	if (realIndex === void 0) return
	if (type === 'moveUp') moveField(realIndex, -1)
	else if (type === 'moveDown') moveField(realIndex, 1)
	else if (type === 'duplicate') duplicateField(realIndex)
	else if (type === 'delete') removeField(realIndex)
	else if (type === 'insertAbove') insertField(realIndex)
	else if (type === 'insertBelow') insertField(realIndex + 1)
}
function uniqueName() {
	const existing = new Set(props.modelValue.map(f => String(f.fieldname ?? '')))
	let name = 'new_field'
	let n = 1
	while (existing.has(name)) name = `new_field_${++n}`
	return name
}
function removeField(realIndex) {
	emit(
		'update:modelValue',
		props.modelValue.filter((_, i) => i !== realIndex)
	)
	void nextTick(collapseAllRows)
}
function duplicateField(realIndex) {
	const original = props.modelValue[realIndex]
	if (!original) return
	const { source: _source, ...rest } = original
	const existing = new Set(props.modelValue.map(f => String(f.fieldname ?? '')))
	const baseName = `${String(rest.fieldname ?? 'field')}_copy`
	let fieldname = baseName
	let n = 1
	while (existing.has(fieldname)) fieldname = `${baseName}_${++n}`
	const clone = { ...rest, fieldname }
	const next = props.modelValue.slice()
	next.splice(realIndex + 1, 0, clone)
	emit('update:modelValue', next)
	void nextTick(collapseAllRows)
}
function moveField(realIndex, dir) {
	const rows = valueFieldRows.value
	const pos = rows.findIndex(r => r.realIndex === realIndex)
	const target = rows[pos + dir]
	if (!target) return
	const next = props.modelValue.slice()
	const a = next[realIndex]
	const b = next[target.realIndex]
	if (a === void 0 || b === void 0) return
	next[realIndex] = b
	next[target.realIndex] = a
	emit('update:modelValue', next)
	void nextTick(collapseAllRows)
}
function value(e) {
	return e.target.value
}
function checked(e) {
	return e.target.checked
}
function str(v) {
	return v == null ? '' : String(v)
}
function bool(v) {
	return v === true
}
</script>

<style scoped>
.fields-panel {
	padding: 0.5em 1em;
}
.fields-panel :deep(.atable-row > td) {
	border-top: 1px solid var(--sc-row-border-color, #e5e7eb);
	padding: var(--sc-atable-row-padding, 0.125rem) 0.75em;
	vertical-align: middle;
}
.fields-panel :deep(input[type='text']),
.fields-panel :deep(select) {
	border: 1px solid var(--sc-gray-20, #d1d5db);
	border-radius: 3px;
	font-family: inherit;
	font-size: inherit;
	padding: 0.25em 0.5em;
	width: 100%;
}
.fields-panel :deep(input.locked),
.fields-panel :deep(select.locked) {
	background: var(--sc-gray-10, #f3f4f6);
	color: #6b7280;
	cursor: not-allowed;
}
.fields-panel :deep(input.json-invalid) {
	background: #fef2f2;
	border-color: #f87171;
}
.center {
	text-align: center;
}
.badge {
	border-radius: 9999px;
	display: inline-block;
	font-size: 0.75rem;
	font-weight: 500;
	padding: 0.125em 0.5em;
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
	gap: 0.75rem 1rem;
	grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
	padding: 0.75rem 1rem;
}
.field-prop {
	color: var(--sc-header-text-color, #374151);
	display: flex;
	flex-direction: column;
	font-size: 0.75rem;
	gap: 0.25rem;
}
.field-prop-inline {
	align-items: center;
	flex-direction: row;
	gap: 0.5rem;
}
.field-prop-wide {
	grid-column: 1/-1;
}
.field-detail-actions {
	align-items: center;
	display: flex;
	gap: 1rem;
	justify-content: space-between;
	padding: 0 1rem 0.75rem;
}
.locked-note {
	color: #6b7280;
	font-size: 0.75rem;
	font-style: italic;
}
.btn-add {
	background: none;
	border: 1px dashed var(--sc-gray-20, #d1d5db);
	border-radius: 4px;
	color: var(--sc-blue-40, #2563eb);
	cursor: pointer;
	font-size: 0.875rem;
	margin-top: 0.5rem;
	padding: 0.4em 1em;
}
.fields-empty {
	color: #9ca3af;
	font-style: italic;
	padding: 1rem 0;
}
</style>
