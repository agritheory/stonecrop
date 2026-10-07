import type { FieldOptions } from './field'

/**
 * Authoring contract for doctype field declarations that can be rendered as table columns.
 * Pass a `ColumnSchema[]` array to ATable's `:schema` prop; `schemaToColumns` converts it
 * to `TableColumn[]` internally — callers working from a doctype schema never need to
 * construct `TableColumn` directly.
 *
 * Notes on specific properties:
 * - `align` uses an explicit string union rather than `CanvasTextAlign` — this package is
 *   used server-side by the CLI where browser DOM types are absent. The values are identical.
 * - `format` is a serialized function string; the table store's `getFormattedValue` deserializes
 *   it via `Function(...)`. `TableColumn.format` widens this to also accept a live function.
 * - `mask` is absent — it is function-typed only and cannot be serialized to JSON. It lives
 *   exclusively on `TableColumn`.
 * - `modalComponent` is string-only — functions cannot appear in schema JSON. `TableColumn`
 *   widens this to also accept a factory function.
 *
 * @public
 */
export interface ColumnSchema {
	/** Unique identifier for the field within its doctype. Maps to `name` on `TableColumn`. */
	fieldname: string

	/**
	 * Rendering component (e.g. `'ATextInput'`, `'ANumericInput'`, `'ADate'`). Default cell
	 * formatting and filter widgets derive from its {@link ComponentCategory}.
	 *
	 * Optional here, unlike `ValueField.component`: absence is what marks an entry as non-scalar
	 * (a nested table or fieldset), which `schemaToColumns` excludes — it has no column equivalent.
	 */
	component?: string

	/**
	 * Target doctype slug — marks this column as a link. When set and no `cellComponent` is given,
	 * `schemaToColumns` copies it to `TableColumn.linkDoctype`, which ACell uses to resolve a bare
	 * id to display text.
	 */
	doctype?: string

	/**
	 * Human-readable column header. When absent, ATable assigns labels alphabetically
	 * (A, B, C, …).
	 */
	label?: string

	/** When `true`, the field is excluded from the derived columns by `schemaToColumns`. */
	hidden?: boolean

	/**
	 * Horizontal text alignment for the column cell and header.
	 *
	 * @defaultValue 'center'
	 */
	align?: 'left' | 'right' | 'center' | 'start' | 'end'

	/**
	 * Whether the column cell is editable in the table.
	 *
	 * @defaultValue false
	 */
	edit?: boolean

	/**
	 * CSS width of the column (e.g. `'20ch'`, `'200px'`).
	 *
	 * @defaultValue '40ch'
	 */
	width?: string

	/**
	 * When `true`, the column is pinned to the left side of the table.
	 *
	 * @defaultValue false
	 */
	pinned?: boolean

	/**
	 * When `true`, the column can be resized by dragging the header edge.
	 *
	 * @defaultValue false
	 */
	resizable?: boolean

	/**
	 * When `true`, clicking the column header sorts the table by this column.
	 *
	 * @defaultValue true
	 */
	sortable?: boolean

	/**
	 * When `true`, a filter control is rendered in the column header.
	 *
	 * @defaultValue true
	 */
	filterable?: boolean

	/**
	 * The type of filter control to render. When absent, a default is derived from the
	 * `component`'s {@link ComponentCategory} (`boolean` → `checkbox`, `date` → `date`,
	 * `datetime` → `dateRange`, `select` → `select`, `number` → `number`, everything else
	 * — including an unknown component — → `text`).
	 */
	filterType?: 'text' | 'select' | 'number' | 'date' | 'dateRange' | 'checkbox' | 'component'

	/**
	 * Static option list for `filterType: 'select'`. When absent, options are derived from
	 * the unique values present in the column's rows.
	 */
	filterOptions?: any[]

	/** Registered component name used when `filterType` is `'component'`. */
	filterComponent?: string

	/**
	 * Registered component name rendered inside the table cell instead of the default display.
	 * When absent, the table renders the value as plain text in a `<td>`.
	 */
	cellComponent?: string

	/**
	 * Additional props passed to `cellComponent`.
	 *
	 * Only applicable when `cellComponent` is set.
	 */
	cellComponentProps?: Record<string, any>

	/**
	 * Registered component name rendered in the cell's modal editor. String-only — functions
	 * cannot appear in schema JSON. `TableColumn.modalComponent` widens this to also accept a
	 * factory function.
	 *
	 * The following props are automatically passed to the modal component:
	 * - `colIndex` — the column index of the current cell
	 * - `rowIndex` — the row index of the current cell
	 * - `store` — the table data store
	 */
	modalComponent?: string

	/**
	 * Extra props passed to `modalComponent` in addition to the standard cell props.
	 *
	 * Only applicable when `modalComponent` is set.
	 */
	modalComponentExtraProps?: Record<string, any>

	/**
	 * Type-specific field options — Select choices, badge maps, quantity/currency config, etc.
	 * Spreads through `schemaToColumns` to `TableColumn`.
	 */
	options?: FieldOptions

	/**
	 * Serialized function string used to format the cell value for display. Deserialized at
	 * render time by the table store's `getFormattedValue`. May return a plain string, HTML, or a
	 * {@link BadgeDescriptor}. `TableColumn.format` widens this to also accept a live function.
	 */
	format?: string

	/**
	 * When `true`, this column is treated as a Gantt bar column.
	 *
	 * Only applicable for Gantt tables.
	 *
	 * @defaultValue false
	 */
	isGantt?: boolean

	/**
	 * Registered component name used to render Gantt bars in this column.
	 *
	 * Only applicable for Gantt tables.
	 *
	 * @defaultValue 'AGanttCell'
	 */
	ganttComponent?: string

	/**
	 * Number of columns this Gantt bar spans across. When absent, the bar stretches to cover
	 * all non-pinned columns in the table.
	 *
	 * Only applicable for Gantt tables.
	 */
	colspan?: number
}
