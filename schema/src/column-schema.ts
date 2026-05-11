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
	 * Semantic field type (e.g. `'Data'`, `'Int'`, `'Date'`, `'Check'`). Fields without a
	 * `fieldtype` are treated as non-scalar (nested table or fieldset) and excluded by
	 * `schemaToColumns`.
	 */
	fieldtype?: string

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
	 * @defaultValue 'left'
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
	 * The type of filter control to render. When absent, a default is derived from `fieldtype`
	 * (`Check` → `checkbox`, `Date` → `date`, `Datetime` → `dateRange`, `Select` → `select`,
	 * numeric types → `number`, everything else → `text`).
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
	 * Serialized function string used to format the cell value for display. Deserialized at
	 * render time by the table store's `getFormattedValue`. `TableColumn.format` widens this
	 * to also accept a live function directly.
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
