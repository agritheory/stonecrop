import type { ColumnSchema, FieldValidation, TableViewConfig, ValueField } from '@stonecrop/schema'

// ---------------------------------------------------------------------------
// InteractionMode — canonical home is @stonecrop/schema
// ---------------------------------------------------------------------------

/**
 * Controls the level of user interaction for a field, container, or table.
 * `'edit'` — interactive; `'read'` — non-interactive with form chrome;
 * `'display'` — non-interactive plain-text rendering.
 * @public
 */
export type { InteractionMode } from '@stonecrop/schema'

// ---------------------------------------------------------------------------
// ResolvedField — the output-space type that AForm consumes
//
// Usually produced by resolveSchema() from an authoring-space DoctypeField[].
// It may also be hand-authored, for view chrome that has no backing doctype
// (see Desktop.vue's doctype list) — annotate such literals with `satisfies
// ResolvedTable`/`satisfies ResolvedField` so they stay checked.
//
// Authoring space and output space are NOT interchangeable. The trap is tables:
// an authoring TableField carries its columns under `columns`, while resolveSchema
// renames that key to `schema` (registry.ts) because `schema` is the ATable prop
// that runs schemaToColumns(). Hand-authoring `columns` here — or feeding an
// authoring-space field straight to AForm — produces a field AForm does not
// recognise as a table.
// ---------------------------------------------------------------------------

/**
 * A resolved scalar field. Derived from ValueField with `cardinality` omitted
 * (consumed by resolveSchema) and an optional `doctype` added for unresolved Link fields.
 * @public
 */
export type ResolvedScalar = Omit<ValueField, 'cardinality'> & {
	/** Doctype slug for unresolved Link fields — added by resolveSchema when AFormLink is available */
	doctype?: string
}

/**
 * A resolved Link field with cardinality `one` or `atMostOne` — embedded as a nested form.
 * @public
 */
export interface ResolvedLink {
	/** Discriminator */
	kind: 'link'
	/** Field identifier */
	fieldname: string
	/** Component to render; defaults to `'AForm'` */
	component: string
	/** Human-readable label */
	label?: string
	/** Interaction mode */
	mode?: import('@stonecrop/schema').InteractionMode
	/** Resolved child fields */
	schema: ResolvedField[]
	/** Preserved from the original ValueField */
	required?: boolean
	/** Preserved from the original ValueField */
	readOnly?: boolean
	/** Preserved from the original ValueField */
	hidden?: boolean
	/** Preserved from the original ValueField */
	default?: unknown
	/** Preserved from the original ValueField */
	validation?: FieldValidation
}

/**
 * A resolved table — either from a Link with `noneOrMany`/`atLeastOne` cardinality,
 * or from an inline TableField. ATable receives columns via `:schema` (ColumnSchema[])
 * and row data via `:rows` from formData at render time.
 *
 * Note the key rename: an authoring `TableField` declares its columns under `columns`;
 * `resolveSchema` moves them to `schema` here, because `schema` is the ATable prop that
 * runs `schemaToColumns()` (ATable's own `columns` prop means already-converted
 * `TableColumn[]`). A hand-authored table must therefore use `schema`, not `columns`.
 *
 * Rows are never part of the schema. AForm sources them from the data model at
 * `dataModel[fieldname]`, so a `rows` key placed on this object is ignored.
 * @public
 */
export interface ResolvedTable {
	/** Discriminator */
	kind: 'table'
	/** Field identifier */
	fieldname: string
	/** Component to render; defaults to `'ATable'` */
	component: string
	/** Human-readable label */
	label?: string
	/** Interaction mode for all cells */
	mode?: import('@stonecrop/schema').InteractionMode
	/** Column definitions — passed to ATable's `:schema` prop */
	schema: ColumnSchema[]
	/** View configuration — always present; defaults to `{ view: 'list' }` */
	config: TableViewConfig
	/** Preserved from the original ValueField or TableField */
	required?: boolean
	/** Preserved from the original ValueField or TableField */
	readOnly?: boolean
	/** Preserved from the original ValueField or TableField */
	hidden?: boolean
	/** Preserved from the original ValueField or TableField */
	default?: unknown
	/** Preserved from the original ValueField or TableField */
	validation?: FieldValidation
}

/**
 * A resolved fieldset — groups child fields inside an AFieldset component.
 * @public
 */
export interface ResolvedFieldset {
	/** Discriminator */
	kind: 'fieldset'
	/** Field identifier */
	fieldname: string
	/** Component to render; defaults to `'AFieldset'` */
	component?: string
	/** Human-readable label for the legend */
	label?: string
	/** Whether the fieldset can be collapsed */
	collapsible?: boolean
	/** Interaction mode for all children */
	mode?: import('@stonecrop/schema').InteractionMode
	/** Resolved child fields */
	schema: ResolvedField[]
}

/**
 * The discriminated union of all resolved field types — what AForm consumes,
 * usually after `resolveSchema()` has transformed the authoring `DoctypeField[]`,
 * but also valid hand-authored for view chrome with no backing doctype.
 * Narrowed by `kind`: `'field'` | `'link'` | `'table'` | `'fieldset'`.
 *
 * `kind` is required — AForm dispatches on it alone and does not infer a field's
 * type from its structure.
 * @public
 */
export type ResolvedField = ResolvedScalar | ResolvedLink | ResolvedTable | ResolvedFieldset

// ---------------------------------------------------------------------------
// Utility types
// ---------------------------------------------------------------------------

/**
 * Defined props for AForm components
 * @public
 */
export type ComponentProps = {
	/**
	 * The schema object to pass to the component
	 * @public
	 */
	schema?: ResolvedField

	/**
	 * The label to display in the component
	 * @public
	 */
	label?: string

	// TODO: add docstring
	selectRange?: boolean

	/**
	 * The mask to apply to inputs inside the component. Accepts either a plain
	 * mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that
	 * receives `locale` and returns a mask string
	 * (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`).
	 * @public
	 */
	mask?: string

	/**
	 * Indicate whether input is required for text and/or select elements inside the component
	 * @public
	 */
	required?: boolean

	/**
	 * The rendering mode for the component
	 * @public
	 */
	mode?: import('@stonecrop/schema').InteractionMode

	/**
	 * Set a unique identifier for elements inside the component
	 * @public
	 */
	uuid?: string

	/**
	 * Validation options for elements inside the component
	 * @public
	 */
	validation?: {
		/**
		 * The error message to display when validation fails
		 * @public
		 */
		errorMessage: string

		[key: string]: any
	}

	/**
	 * Inline validation error messages to display on this field. Fed by the host
	 * (e.g. mapped from the core validation store) — the renderer stays dumb and just
	 * shows what it is given. Takes precedence over the static `validation.errorMessage`.
	 * @public
	 */
	errors?: string[]
}

/**
 * The value shape for AFormLink — a linked document reference with optional display text
 * @public
 */
export interface AFormLinkValue {
	/** The FK/linked document ID. `id: 0` is a valid ID. */
	id: string | number
	/** Display text shown in the input. Falls back to `String(id)` if omitted. */
	displayText?: string
	/** Additional properties passed through to the underlying input component */
	[extra: string]: any
}

/**
 * Navigation contract for AFormLink. Provide via `provide('aformLinkNavigator', ...)` in the app plugin.
 * @public
 */
export interface AFormLinkNavigator {
	/** Navigate to the linked document. Implementation is app-defined. */
	navigate(doctype: string, id: string | number): void
}
