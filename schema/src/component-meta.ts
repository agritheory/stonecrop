/**
 * Semantic category for a rendering component.
 *
 * As `component` replaces `fieldtype` as the primary field axis, the runtime consumers that
 * used to branch on `fieldtype` (atable cell formatting / filter widgets, record-default init)
 * instead derive their behaviour from the component's category. This is the single source of
 * "what kind of value does this component render", keyed by the canonical registered component
 * names — each consumer maps the category to its own concern (filter widget, default value, …).
 *
 * @public
 */
export type ComponentCategory =
	'text' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' | 'code' | 'link' | 'attach'

/**
 * Canonical component → semantic category. Only the components Stonecrop ships with appear here;
 * custom/unknown component names have no category and consumers fall back to their default.
 * @public
 */
export const COMPONENT_CATEGORY: Record<string, ComponentCategory> = {
	ATextInput: 'text',
	ATextarea: 'text',
	ANumericInput: 'number',
	ACheckbox: 'boolean',
	ADate: 'date',
	ADateTime: 'datetime',
	ADuration: 'text',
	ADateRange: 'date',
	ADropdown: 'select',
	AComboBox: 'select',
	ACodeEditor: 'code',
	AFormLink: 'link',
	AFileAttach: 'attach',
}

/**
 * Resolve a component's semantic category, or `undefined` for an absent/unknown component
 * (so callers can fall back to a legacy `fieldtype`-based path during the migration).
 * @public
 */
export function componentCategory(component?: string): ComponentCategory | undefined {
	return component ? COMPONENT_CATEGORY[component] : undefined
}
