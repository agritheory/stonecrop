/**
 * Minimal field shape representing the intersection of form field properties
 * (fieldname, hidden, etc.) and table column properties (cellComponent, pinned, format, etc.)
 * so that a doctype's fields array can be passed directly to table components without
 * requiring callers to pre-build TableColumn objects.
 *
 * Notes on specific properties:
 * - `align` uses an explicit string union rather than CanvasTextAlign — this
 *   package is used server-side by the CLI where browser DOM types are absent.
 * - `format` is a serialized function string; the table store's getFormattedValue
 *   already handles typeof format === 'string' via Function(...).
 * - `mask` is intentionally omitted — ACell has mask commented out as a TODO
 *   and TableColumn.mask is function-typed only; including it here would create
 *   an incompatible type.
 * - `modalComponent` is string-only (no function variant) — functions cannot
 *   appear in schema JSON.
 *
 * @public
 */
export interface ColumnSchema {
	/** Unique identifier for the field within its doctype. Maps to `name` on `TableColumn`. */
	fieldname: string
	/** Semantic field type (e.g. `'Data'`, `'Int'`, `'Date'`, `'Check'`). Fields without a `fieldtype` are treated as non-scalar (nested table/fieldset) and excluded by `schemaToColumns`. */
	fieldtype?: string
	/** Human-readable column header. */
	label?: string
	/** When `true`, the field is excluded from the derived columns by `schemaToColumns`. */
	hidden?: boolean
	/** Horizontal text alignment for the column cell and header. */
	align?: 'left' | 'right' | 'center' | 'start' | 'end'
	/** Whether the column cell is editable in the table. */
	edit?: boolean
	/** CSS width of the column (e.g. `'20ch'`, `'200px'`). */
	width?: string
	/** When `true`, the column is pinned to the left side of the table. */
	pinned?: boolean
	/** When `true`, the column can be resized by dragging the header edge. */
	resizable?: boolean
	/** When `true`, clicking the column header sorts the table by this column. */
	sortable?: boolean
	/** When `true`, a filter control is rendered in the column header. */
	filterable?: boolean
	/** The type of filter control to render. Defaults are derived from `fieldtype` when absent. */
	filterType?: 'text' | 'select' | 'number' | 'date' | 'dateRange' | 'checkbox' | 'component'
	/** Static option list for `filterType: 'select'`. When absent, options are derived from unique row values. */
	filterOptions?: any[]
	/** Registered component name used when `filterType` is `'component'`. */
	filterComponent?: string
	/** Registered component name rendered inside the table cell instead of the default display. */
	cellComponent?: string
	/** Props passed to `cellComponent`. */
	cellComponentProps?: Record<string, any>
	/** Registered component name rendered in the cell's modal editor. String-only — functions cannot appear in schema JSON. */
	modalComponent?: string
	/** Extra props passed to `modalComponent` in addition to the standard cell props. */
	modalComponentExtraProps?: Record<string, any>
	/** Serialized function string used to format the cell value for display. Deserialized at render time by the table store's `getFormattedValue`. */
	format?: string
	/** When `true`, this column is treated as a Gantt bar column. */
	isGantt?: boolean
	/** Registered component name used to render Gantt bars in this column. */
	ganttComponent?: string
	/** Number of columns this cell spans in the table layout. */
	colspan?: number
}
