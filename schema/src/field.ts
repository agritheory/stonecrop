import { z } from 'zod'

import type { ColumnSchema } from './column-schema'
import { flattenFields } from './flatten'
import type { InteractionMode } from './mode'
import { TableViewConfig } from './table'

// Re-exported so callers already on this module keep one import; `flatten.ts` says why the
// definition itself sits off to the side.
export { flattenFields }

/**
 * Field options - flexible bag for type-specific configuration.
 *
 * Usage:
 * - Select: array of choices (["Draft", "Submitted", "Cancelled"])
 * - Select with badges: \{ choices: [...], badges: \{ Open: "warning", ... \} \} or bare map
 * - Decimal: config object (\{ precision: 10, scale: 2 \})
 * - Code: config object (\{ language: "python" \})
 *
 * Deliberately *not* a bare string: a string once meant "link target", which made the value's
 * shape encode its meaning. That job belongs to `ValueField.doctype`, leaving this a plain
 * choices-or-config bag.
 *
 * @public
 */
export const FieldOptions = z
	.union([
		z.array(z.string()), // Select choices: ["A", "B", "C"]
		z.record(z.string(), z.unknown()), // Config: \{ precision: 10, scale: 2 \}
	])
	.meta({
		title: 'FieldOptions',
		description: 'Field options - flexible bag for type-specific configuration',
	})

/**
 * Field options type inferred from Zod schema
 * @public
 */
export type FieldOptions = z.infer<typeof FieldOptions>

/**
 * Validation configuration for form fields
 * @public
 */
export const FieldValidation = z
	.looseObject({
		/** Error message to display when validation fails */
		errorMessage: z.string(),
	})
	.meta({
		title: 'FieldValidation',
		description: 'Validation configuration for form fields',
	})

/**
 * Field validation type inferred from Zod schema
 * @public
 */
export type FieldValidation = z.infer<typeof FieldValidation>

// ---------------------------------------------------------------------------
// DoctypeField — the discriminated union of authoring-time field variants
// ---------------------------------------------------------------------------

/**
 * A field that holds a scalar value, a link to another record, or a select choice.
 * The most common kind of field. `component` determines how it renders; the attributes below
 * carry everything else that is not a rendering concern.
 * @public
 */
export interface ValueField {
	/** Discriminator — identifies this as a value-holding field */
	kind: 'field'
	/** Unique identifier for this field within its doctype */
	fieldname: string
	/**
	 * Vue component that renders this field — the primary (and only) rendering axis. Required:
	 * there is nothing left to derive it from, and a field without one has nothing to render it.
	 * Any string is valid; naming a custom component is how an app renders a field Stonecrop
	 * ships no widget for. See `CANONICAL_COMPONENTS` for the set Stonecrop provides.
	 */
	component: string
	/** True for the field that identifies the record's primary-key column. */
	primaryKey?: boolean
	/** True for a computed/display field with no backing DB column — excluded from SQL SELECT. */
	computed?: boolean
	/** Editor language for code fields (e.g. `'json'`, `'typescript'`) — the only thing distinguishing
	 *  a JSON editor from a code editor, since both render with `ACodeEditor`. */
	language?: string
	/**
	 * Target doctype slug. Presence is what makes a field a link.
	 *
	 * How it renders is decided by `component`, not by this: `AFormLink` renders an
	 * inline id-picker, while `AForm`/`ATable` expand the target (see `linkRenderMode`). Expansion
	 * metadata — backlink, fetch strategy, authoritative cardinality — lives in the doctype's
	 * `links` map, which is additive and never required for a plain foreign key.
	 */
	doctype?: string
	/** Human-readable label */
	label?: string
	/** CSS width (e.g. `"40ch"`, `"200px"`) */
	width?: string
	/** CSS height (e.g. `"100%"`, `"40vh"`) — used by full-viewport fields such as Planner */
	height?: string
	/** Text alignment */
	align?: 'left' | 'center' | 'right' | 'start' | 'end'
	/** Whether the field is editable in table cell context */
	edit?: boolean
	/** Input mask pattern or serialized function */
	mask?: string
	/** Serialized display formatter — distinct from `mask` (input). Spreads through
	 *  `schemaToColumns` to `ColumnSchema.format`; deserialized at render time by ATable's
	 *  `getFormattedValue`. Returns a plain string, HTML, or a {@link BadgeDescriptor} for badge
	 *  cells. When a descriptor is returned it wins over any badge map on `options`. */
	format?: string
	/** Per-field interaction mode override */
	mode?: InteractionMode
	/** Type-specific options: Select choices, Decimal precision config, etc. A link's target is not
	 *  here — it is `doctype`. */
	options?: FieldOptions
	/** Whether the field is required */
	required?: boolean
	/** Whether the field is read-only */
	readOnly?: boolean
	/** Whether the field is hidden from the UI */
	hidden?: boolean
	/** Default value for new records */
	default?: unknown
	/** Validation configuration */
	validation?: FieldValidation
	/** Cardinality for Link fields — authoritative value on LinkDeclaration takes precedence */
	cardinality?: 'atMostOne' | 'one' | 'noneOrMany' | 'atLeastOne'
	/**
	 * Provenance marker — stamped only by the GraphQL converter; absence means hand-authored.
	 * When present, the docbuilder freezes the field's identity set (`fieldname`, `primaryKey`,
	 * `required`, `options`, `cardinality`, `doctype`), since `fieldname` is the GraphQL/column
	 * binding and `doctype` is the FK's target. `component` is deliberately **not** frozen: it
	 * chooses the widget, which is an authoring decision the database has no opinion about.
	 */
	source?: 'introspected'
}

/**
 * A layout container that groups other fields. Resolves to a nested AForm.
 * @public
 */
export interface FieldsetField {
	/** Discriminator — identifies this as a fieldset container */
	kind: 'fieldset'
	/** Unique identifier for this fieldset within its doctype */
	fieldname: string
	/** Vue component to render this fieldset. Defaults to `'AFieldset'` in resolveSchema. */
	component?: string
	/** Human-readable label for the fieldset legend */
	label?: string
	/** Whether the fieldset can be collapsed */
	collapsible?: boolean
	/** Interaction mode for all children inside this fieldset */
	mode?: InteractionMode
	/** Nested field definitions — resolved recursively by resolveSchema */
	schema: DoctypeField[]
}

/**
 * An inline table whose columns are defined directly in the schema (no linked doctype).
 * Use when the table data does not warrant a separate doctype.
 * @public
 */
export interface TableField {
	/** Discriminator — identifies this as an inline table */
	kind: 'table'
	/** Unique identifier for this table within its doctype */
	fieldname: string
	/** Vue component to render this table. Defaults to `'ATable'` in resolveSchema. */
	component?: string
	/** Human-readable label */
	label?: string
	/** Column definitions — use ColumnSchema (fieldname key) from \@stonecrop/schema */
	columns: ColumnSchema[]
	/** View configuration — defaults to `{ view: 'list' }` in resolveSchema when absent */
	config?: TableViewConfig
	/** Interaction mode for all cells inside this table */
	mode?: InteractionMode
}

/**
 * Union of all authoring-time field variants.
 * Use `kind` to discriminate: `'field'` | `'fieldset'` | `'table'`.
 * @public
 */
export type DoctypeField = ValueField | FieldsetField | TableField

// ---------------------------------------------------------------------------
// Zod runtime validation schemas
// ---------------------------------------------------------------------------

/**
 * Which of the three field shapes an entry has, read from the entry's own structure.
 *
 * The single definition of that question. It had three copies before this — the parser's
 * `injectKind`, {@link stripFieldKind}'s agreement check, and the docbuilder's own
 * `isValueField` in another package — each free to drift, and drift here re-types a field rather
 * than throwing: a value field read as a fieldset loses its column, a fieldset read as a value
 * field loses every child.
 *
 * Deliberately **shape-only**: a declared `kind` is ignored. Two callers depend on that. The
 * stripper compares this against the declaration to decide whether removing it is lossless, which
 * it cannot do if this honours it. The docbuilder reads raw JSON off disk and classifies entries to
 * decide which to render as editable rows — and `kind` is Stonecrop's own discriminant, not
 * something a doctype author writes, so a tool reading a file has no business consulting it.
 *
 * `injectKind` is the one place a declaration still wins, and only to leave an already-parsed
 * object untouched on its way back through.
 *
 * @param field - a field entry, authored or parsed
 * @returns the kind its shape implies
 * @public
 */
export function inferFieldKind(field: unknown): DoctypeField['kind'] {
	if (typeof field !== 'object' || field === null || Array.isArray(field)) return 'field'
	if ('schema' in field) return 'fieldset'
	if ('columns' in field) return 'table'
	return 'field'
}

/**
 * Infers the `kind` discriminant from the structural properties of a raw field
 * object, then injects it if absent. This allows authored JSON to omit `kind`
 * entirely — a `schema` key means fieldset, `columns` means table, anything else
 * is a value field.
 *
 * Rules (applied in order):
 *   has `schema`  → fieldset
 *   has `columns` → table
 *   otherwise     → field (value-holding scalar or link)
 *
 * Objects that already carry `kind` pass through unchanged (backward-compatible).
 *
 * Single-node only. Zod applies this at every level of the discriminated union (via the
 * `z.lazy` in the fieldset schema), so nested fieldset children are normalized during a
 * parse. Callers that bypass Zod — notably `Doctype.fromObject` — must use the exported
 * {@link normalizeFieldKind} instead, which replicates that recursion.
 */
function injectKind(data: unknown): unknown {
	if (typeof data !== 'object' || data === null || Array.isArray(data)) return data
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- safe: non-null, non-array object verified by guards above
	const obj = data as Record<string, unknown>
	// An explicit `kind` is left exactly as it was found: this is the one place a declaration still
	// beats the shape, and only so an already-parsed object survives a second pass unchanged.
	// Returning `data` itself rather than rebuilding it also preserves identity and key order.
	// Nothing outside this function shares that precedence — a reader classifying a file on disk
	// wants `inferFieldKind`, because `kind` is ours and no author writes it.
	if ('kind' in obj) return data
	return { kind: inferFieldKind(obj), ...obj }
}

/**
 * Recursively injects the `kind` discriminant into a raw field object and, for fieldsets,
 * into each of its nested `schema` children — mirroring exactly what Zod's `preprocess`
 * does at every level of the discriminated union.
 *
 * Table `columns` are {@link ColumnSchema} entries, not `DoctypeField`s, so they are left
 * untouched — the Zod table schema validates them with a plain passthrough and never injects
 * `kind` there either.
 *
 * Needed because `Doctype.fromObject` constructs a Doctype without running Zod, yet the
 * registry's `resolveFields` gates link and fieldset handling on `field.kind`. Without this,
 * a JSON-authored link resolves to a flat scalar and a fieldset's children are dropped.
 *
 * @public
 */
export function normalizeFieldKind(field: unknown): unknown {
	const injected = injectKind(field)
	if (typeof injected !== 'object' || injected === null) return injected
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- injectKind returns a non-null object for object input; guarded above
	const obj = injected as Record<string, unknown>
	if (obj.kind === 'fieldset' && Array.isArray(obj.schema)) {
		return { ...obj, schema: obj.schema.map(normalizeFieldKind) }
	}
	return injected
}

/**
 * Remove the `kind` discriminant from a field, recursing into a fieldset's children.
 *
 * The outbound half of the boundary {@link normalizeFieldKind} owns inbound. `kind` is a
 * discriminated-union tag the parser synthesizes, not something an author writes, so nothing that
 * *writes* a doctype should put it on disk — the generator and the docbuilder's save both call
 * this. Without it the two round-trip asymmetrically: every save adds a key the file never had.
 *
 * Strips only when `injectKind` would restore exactly what was removed. A fieldset carrying no
 * `schema` re-infers as a plain field, so its `kind` is kept rather than silently re-typing the
 * document; `DoctypeMeta` requires `schema` on a fieldset, so that shape is already invalid and
 * belongs to the load gate, not here.
 *
 * Table `columns` are {@link ColumnSchema} entries rather than `DoctypeField`s and never carry an
 * injected `kind`, so they are passed through untouched — the same asymmetry `injectKind` has.
 *
 * @param field - a field object, as held in memory after parsing
 * @returns the field without `kind`, safe to serialize
 * @public
 */
export function stripFieldKind(field: unknown): unknown {
	if (typeof field !== 'object' || field === null || Array.isArray(field)) return field
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- safe: non-null, non-array object verified by the guard above
	const obj = field as Record<string, unknown>

	if (obj.kind !== undefined && obj.kind !== inferFieldKind(obj)) return field

	const { kind: _kind, ...rest } = obj
	if (Array.isArray(rest.schema)) {
		return { ...rest, schema: rest.schema.map(stripFieldKind) }
	}
	return rest
}

/**
 * The field properties a `source: 'introspected'` marker freezes — the ones the database owns.
 *
 * This is the single definition of the identity set. The docbuilder greys these inputs on an
 * introspected field, and the converter's merge refuses to rewrite them. Stating it twice is how
 * the two drift, so both read this constant.
 *
 * Everything absent from this list is author-owned, `component` most importantly: it chooses the
 * widget, which is an authoring decision the database has no opinion about.
 *
 * @public
 */
export const INTROSPECTED_IDENTITY_PROPS = [
	'fieldname',
	'primaryKey',
	'required',
	'options',
	'cardinality',
	'doctype',
] as const

/**
 * Find the field a doctype marks as its primary key, or `undefined` when none is marked.
 *
 * This is the single definition of "which field identifies a record". Both sides depend on it:
 * the middleware builds the SQL identity predicate from it, and the client resolves a record's
 * route/store key from it. Call this; never re-derive the rule at the call site, or the two will
 * drift and the client will key records by a column the server never queried.
 *
 * Two deliberate rules, both matching the shape `primaryKey` actually has:
 * - Fieldset children are **included**, via {@link flattenFields}. A fieldset is layout, not
 *   scope: its children are fields of the doctype with columns of their own, which is why the
 *   adapter's SELECT already descends and why `getDisplayField` does too. Scanning top level only
 *   did not *refuse* a nested declaration — it ignored one, so an author marked identity and
 *   nothing honoured it and nothing said so.
 * - The **first** match in document order wins. Identity is single-valued by design — a doctype
 *   describes the API surface, and mapping a composite database key onto one identity there is the
 *   adapter's job — so a doctype declaring several is malformed rather than composite.
 *   `DoctypeMeta` rejects that at the load gate; this stays total for callers holding fields that
 *   never went through it.
 *
 * @param fields - the doctype's fields; fieldset children are descended into
 * @returns the primary-key field, or `undefined` for a PK-less doctype
 * @public
 */
export function getPrimaryKeyField(fields: readonly DoctypeField[]): ValueField | undefined {
	return flattenFields(fields).find((f): f is ValueField => f.kind === 'field' && Boolean(f.primaryKey))
}

/**
 * Resolve the field a doctype nominates as its display text, or `undefined` when the nomination
 * does not name a readable column.
 *
 * This is the single definition of "is this a usable `displayField`". Both sides depend on it:
 * `DoctypeMeta` refuses a bad nomination at the load gate, and the adapter builds a SELECT from
 * the field it returns. Call this; never re-derive the rule, or the gate and the query will
 * disagree about which nominations are legal — which they did, in both directions at once.
 *
 * Two things disqualify a nomination, and both are the doctype saying so itself:
 * - it names no field at all, fieldset children included
 * - it names a `computed` field, which is declared precisely to state it has no column, so a
 *   SELECT built from it would reference a column the database does not have
 *
 * @param fields - the doctype's top-level fields
 * @param displayField - the nominated fieldname
 * @returns the nominated field, or `undefined` when it is not a readable column
 * @public
 */
export function getDisplayField(
	fields: readonly DoctypeField[],
	displayField: string | undefined
): ValueField | undefined {
	if (!displayField) return undefined
	return flattenFields(fields).find(
		(f): f is ValueField => f.kind === 'field' && !f.computed && f.fieldname === displayField
	)
}

/**
 * The name of the field a record is identified by: the declared `primaryKey`, or `id` when the
 * doctype declares none.
 *
 * The `id` fallback is load-bearing, not defensive — a surrogate-key doctype carries an `id`
 * column and marks no primary key, so "nothing declared" means `id`, not "no identity".
 *
 * This exists because that one-line rule had been restated at four sites — the client's
 * `Doctype.recordIdField`, both nuxt hosts' `recordLookupField`, and the Postgres adapter — and
 * the fourth had omitted the fallback, so a doctype the client keyed by `id` was one the adapter
 * could not look up at all. Call this; a fifth restatement is how they diverge again.
 *
 * The returned name is not guaranteed to be a declared field: a doctype that declares no
 * `primaryKey` and no `id` yields `'id'` regardless. An adapter that must build a SQL predicate
 * from it has to confirm the field exists and say so when it does not, because selecting a column
 * the doctype never declared returns nothing rather than failing.
 *
 * @param fields - the doctype's top-level fields
 * @returns the identifying fieldname
 * @public
 */
export function getRecordIdField(fields: readonly DoctypeField[]): string {
	return getPrimaryKeyField(fields)?.fieldname ?? 'id'
}

/**
 * Resolve a record's identity value using the doctype's declared primary key.
 *
 * Falls back to `record.id` when the doctype declares no `primaryKey`. That fallback is
 * load-bearing, not defensive: surrogate-key doctypes carry an `id` column and never mark a
 * primary key, and PostGraphile renames a single-column `id` PK to `rowId` — so the declared
 * field and `id` are both real sources, in that order.
 *
 * @param fields - the doctype's top-level fields
 * @param record - the record to read the identity from
 * @returns the identity as a string, or `undefined` when neither source yields a usable value
 * @public
 */
export function getRecordIdentity(
	fields: readonly DoctypeField[],
	record: Record<string, unknown>
): string | undefined {
	const pkField = getPrimaryKeyField(fields)
	const candidates = pkField ? [record[pkField.fieldname], record.id] : [record.id]

	for (const value of candidates) {
		// Numbers are valid keys (a serial PK); 0 is a legitimate id, so test the type, not truthiness.
		if (typeof value === 'number') return String(value)
		if (typeof value === 'string' && value !== '') return value
	}
	return undefined
}

function createDoctypeFieldSchemas() {
	const ValueFieldSchema = z
		.object({
			kind: z.literal('field'),
			fieldname: z.string().min(1),
			component: z.string().min(1),
			primaryKey: z.boolean().optional(),
			computed: z.boolean().optional(),
			language: z.string().optional(),
			doctype: z.string().min(1).optional(),
			label: z.string().optional(),
			width: z.string().optional(),
			height: z.string().optional(),
			align: z.enum(['left', 'center', 'right', 'start', 'end']).optional(),
			edit: z.boolean().optional(),
			mask: z.string().optional(),
			format: z.string().optional(),
			mode: z.enum(['edit', 'read', 'display']).optional(),
			options: FieldOptions.optional(),
			required: z.boolean().optional(),
			readOnly: z.boolean().optional(),
			hidden: z.boolean().optional(),
			default: z.unknown().optional(),
			validation: FieldValidation.optional(),
			cardinality: z.enum(['atMostOne', 'one', 'noneOrMany', 'atLeastOne']).optional(),
			source: z.literal('introspected').optional(),
		})
		.meta({ title: 'ValueField' })

	const TableFieldSchema = z
		.object({
			kind: z.literal('table'),
			fieldname: z.string().min(1),
			component: z.string().optional(),
			label: z.string().optional(),
			// Validates that each column has fieldname; allows all other ColumnSchema properties
			columns: z.array(z.object({ fieldname: z.string().min(1) }).passthrough()),
			config: TableViewConfig.optional(),
			mode: z.enum(['edit', 'read', 'display']).optional(),
		})
		.meta({ title: 'TableField' })

	// DoctypeFieldSchema must be declared before FieldsetFieldSchema so the z.lazy
	// callback can close over it. The placeholder is overwritten below; the callback
	// only runs at parse time, after the real discriminated union is assigned.
	// See: https://zod.dev/api?id=discriminated-unions#discriminated-unions
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- required by Zod's recursive schema pattern; z.never() placeholder is overwritten before any parse call
	let DoctypeFieldSchema: z.ZodType<DoctypeField> = z.never() as unknown as z.ZodType<DoctypeField>

	// FieldsetFieldSchema stays as a plain ZodObject (not z.ZodType<T>) so that
	// z.discriminatedUnion can inspect its 'kind' discriminant property.
	const FieldsetFieldSchema = z
		.object({
			kind: z.literal('fieldset'),
			fieldname: z.string().min(1),
			component: z.string().optional(),
			label: z.string().optional(),
			collapsible: z.boolean().optional(),
			mode: z.enum(['edit', 'read', 'display']).optional(),
			schema: z.lazy(() => DoctypeFieldSchema.array()),
		})
		.meta({ title: 'FieldsetField' })

	const rawUnion = z.discriminatedUnion('kind', [ValueFieldSchema, FieldsetFieldSchema, TableFieldSchema])

	// Overwrite the placeholder with the preprocessed schema. Because z.lazy captures
	// DoctypeFieldSchema by closure reference, the lazy callback in FieldsetFieldSchema
	// will resolve to this preprocessed version — so nested fieldsets also inject `kind`.
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- ZodPipe output is DoctypeField; same pattern as the z.never() placeholder above
	DoctypeFieldSchema = z.preprocess(injectKind, rawUnion) as unknown as z.ZodType<DoctypeField>

	return { ValueFieldSchema, TableFieldSchema, FieldsetFieldSchema, DoctypeFieldSchema }
}

const schemas = createDoctypeFieldSchemas()

/**
 * Zod runtime validation schema for ValueField.
 * @public
 */
export const ValueFieldSchema = schemas.ValueFieldSchema

/**
 * Zod runtime validation schema for FieldsetField.
 * Recursive — FieldsetField.schema is validated against DoctypeFieldSchema.
 * @public
 */
export const FieldsetFieldSchema = schemas.FieldsetFieldSchema

/**
 * Zod runtime validation schema for TableField.
 * @public
 */
export const TableFieldSchema = schemas.TableFieldSchema

/**
 * Zod runtime validation schema for the DoctypeField discriminated union.
 * Validates all three field variants: `'field'`, `'fieldset'`, `'table'`.
 * @public
 */
export const DoctypeFieldSchema = schemas.DoctypeFieldSchema
