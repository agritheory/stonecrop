/**
 * Semantic category for a rendering component.
 *
 * `component` is the primary field axis, so the runtime consumers that need to know what a field
 * *means* (atable cell formatting / filter widgets, record-default init) derive it from here. This
 * is the single source of "what kind of value does this component render", keyed by the canonical
 * registered component names — each consumer maps the category to its own concern (filter widget,
 * default value, …).
 *
 * @public
 */
export type ComponentCategory =
	'text' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' | 'code' | 'link' | 'attach' | 'quantity'

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
	ADatePicker: 'date',
	ADateSelection: 'date',
	ADateTime: 'datetime',
	ADuration: 'text',
	ADateRange: 'date',
	ADropdown: 'select',
	ACodeEditor: 'code',
	AFormLink: 'link',
	AFileAttach: 'attach',
	AQuantityInput: 'quantity',
}

/**
 * Resolve a component's semantic category, or `undefined` for an unknown (custom) component —
 * callers treat that as "no opinion" and use their own default.
 * @public
 */
export function componentCategory(component?: string): ComponentCategory | undefined {
	return component ? COMPONENT_CATEGORY[component] : undefined
}

/**
 * Whether a link component expands its target doctype, or renders the link inline.
 *
 * This is the *only* axis the component decides. It deliberately does not choose between an
 * embedded record and an embedded table: `cardinality` states whether the value is a scalar or
 * an array, which is a fact about the data rather than a rendering preference, so a component
 * must not be able to override it (an `AForm` over a `noneOrMany` link would be handed an array
 * it cannot render). Component names encode both axes — `AFormLink`/`ATableLink` are the inline
 * pair, `AForm`/`ATable` the expanding pair — but only the inline/expand half is authoritative.
 *
 * @public
 */
export type LinkExpansion = 'inline' | 'expand'

/**
 * Canonical link component → expansion. Only components Stonecrop ships with appear here; an
 * unmapped (custom) component has none, and callers treat that as `expand` — the behaviour that
 * predates this map, so a custom component can never silently collapse a link to a picker.
 * @public
 */
export const COMPONENT_LINK_EXPANSION: Record<string, LinkExpansion> = {
	AFormLink: 'inline',
	AForm: 'expand',
	ATable: 'expand',
}

/**
 * Resolve a component's link expansion, or `undefined` for an absent/unmapped component.
 * @public
 */
export function componentLinkExpansion(component?: string): LinkExpansion | undefined {
	return component ? COMPONENT_LINK_EXPANSION[component] : undefined
}

/**
 * How a link field renders.
 *
 * - `inline` — a scalar id-picker; the target is *not* expanded (the field keeps its own value
 *   and carries a `doctype` prop for async display-text resolution and navigation).
 * - `record` — the target doctype is resolved and embedded as a nested form.
 * - `table` — the target doctype is resolved and embedded as a child table.
 *
 * @public
 */
export type LinkRenderMode = 'inline' | 'record' | 'table'

/**
 * Decide how a *declared* link (one with a `LinkDeclaration`) renders.
 *
 * Two independent axes: the **component** picks inline vs expand, and when expanding the
 * **cardinality** picks record vs table (many → table). The declaration's component wins over the
 * field's, matching the precedence the resolver already uses for the rendered component.
 *
 * This is the single definition of "does this link expand" — it is consumed by both the client
 * resolver (which builds the nested schema) and the server column builder (which must still
 * SELECT an `inline` link's FK column). Call it; never re-derive the rule at the call site, or
 * the two will drift and the client will render a table for a column the server never selected.
 *
 * @param link - the link declaration (only `component` and `cardinality` are consulted)
 * @param fieldComponent - the linked field's own `component`, used when the declaration names none
 * @public
 */
export function resolveLinkRenderMode(
	link: { component?: string; cardinality?: string },
	fieldComponent?: string
): LinkRenderMode {
	if (componentLinkExpansion(link.component ?? fieldComponent) === 'inline') return 'inline'
	return link.cardinality === 'noneOrMany' || link.cardinality === 'atLeastOne' ? 'table' : 'record'
}

/**
 * Every component Stonecrop ships with that can render a value field, sorted by name.
 *
 * The union of the two maps above is the definition, not a copy of it: a shipped component either
 * categorises a value ({@link COMPONENT_CATEGORY}) or is one of the link containers that has no
 * value of its own ({@link COMPONENT_LINK_EXPANSION}'s `AForm`/`ATable`). `AFieldset` is absent by
 * the same rule — it is a `kind: 'fieldset'` container, so it is never a value field's component.
 *
 * `component` is an **open** axis: any string is valid, and naming a custom component is how an app
 * renders a field Stonecrop ships no widget for. This list is therefore the set to *suggest* to an
 * author, and to check first-party data against — never a set to validate arbitrary input against.
 *
 * @public
 */
export const CANONICAL_COMPONENTS: readonly string[] = [
	...new Set([...Object.keys(COMPONENT_CATEGORY), ...Object.keys(COMPONENT_LINK_EXPANSION)]),
].toSorted()
