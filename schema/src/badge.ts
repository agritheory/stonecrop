import type { FieldOptions } from './field'

/**
 * Semantic badge variant. Maps to theme tokens `--sc-badge-{variant}-*`.
 * @public
 */
export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'brand'

/**
 * Where ABadge paints the same descriptor.
 * @public
 */
export type BadgePresentation = 'cell-fill' | 'input-accent'

/**
 * Per-choice badge configuration in a Select options map.
 * @public
 */
export interface BadgeSpecObject {
	variant?: BadgeVariant
	color?: string
	label?: string
}

/**
 * Value in a choice→badge map: shorthand variant or object form.
 * @public
 */
export type BadgeSpec = BadgeVariant | BadgeSpecObject

/**
 * Select field options when choices carry badge colors.
 * @public
 */
export interface SelectOptions extends Record<string, unknown> {
	choices: string[]
	badges?: Record<string, BadgeSpec>
}

/**
 * Resolved badge for rendering. Returned by `format` or built from an options map.
 * @public
 */
export interface BadgeDescriptor {
	label: string
	variant?: BadgeVariant
	color?: string
}

const BADGE_VARIANTS = new Set<string>(['neutral', 'success', 'warning', 'danger', 'brand'])

const BADGE_SPEC_OBJECT_KEYS = new Set(['variant', 'color', 'label'])

function isOptionsRecord(options: FieldOptions): options is Record<string, unknown> {
	return !Array.isArray(options)
}

function isBadgeVariant(value: unknown): value is BadgeVariant {
	return typeof value === 'string' && BADGE_VARIANTS.has(value)
}

function isBadgeSpecObject(value: unknown): value is BadgeSpecObject {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) return false
	for (const key of Object.keys(value)) {
		if (!BADGE_SPEC_OBJECT_KEYS.has(key)) return false
	}
	const obj = value as BadgeSpecObject
	if (obj.variant !== undefined && !isBadgeVariant(obj.variant)) return false
	if (obj.color !== undefined && typeof obj.color !== 'string') return false
	if (obj.label !== undefined && typeof obj.label !== 'string') return false
	return true
}

function isBadgeSpec(value: unknown): value is BadgeSpec {
	return isBadgeVariant(value) || isBadgeSpecObject(value)
}

/**
 * Narrows an options record to the structured `{ choices, badges }` form. A type predicate rather
 * than a cast: `SelectOptions` requires `choices`, so asserting into it trips `no-unsafe-type-assertion`.
 */
function isStructuredSelectOptions(options: Record<string, unknown>): options is SelectOptions {
	return Array.isArray(options.choices)
}

/**
 * True when `value` is a resolved badge descriptor for ACell / ADropdown.
 * @public
 */
export function isBadgeDescriptor(value: unknown): value is BadgeDescriptor {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) return false
	// Partial<> keeps this a widening assertion; asserting into BadgeDescriptor itself (required
	// `label`) narrows, which `no-unsafe-type-assertion` rejects.
	const obj = value as Partial<BadgeDescriptor>
	if (typeof obj.label !== 'string') return false
	if (obj.variant !== undefined && !isBadgeVariant(obj.variant)) return false
	if (obj.color !== undefined && typeof obj.color !== 'string') return false
	return true
}

/**
 * True when `options` is a Select choice map (`{ Open: "warning", ... }` or
 * `{ choices: [...], badges: {...} }`), not a quantity/currency/code config bag.
 * @public
 */
export function isSelectChoiceMap(options: FieldOptions | undefined): options is Record<string, BadgeSpec> {
	if (options === undefined || Array.isArray(options) || !isOptionsRecord(options)) return false
	if (isStructuredSelectOptions(options)) {
		const badges = options.badges
		if (badges === undefined) return false
		return Object.values(badges).every(isBadgeSpec)
	}
	const entries = Object.entries(options)
	if (entries.length === 0) return false
	return entries.every(([, value]) => isBadgeSpec(value))
}

/**
 * True when `options` uses the structured SelectOptions shape.
 * @public
 */
export function isSelectOptions(options: FieldOptions | undefined): options is SelectOptions {
	if (options === undefined || Array.isArray(options) || !isOptionsRecord(options)) return false
	return isStructuredSelectOptions(options)
}

/**
 * Dropdown / filter choice strings.
 * @public
 */
export function selectChoices(options: FieldOptions | undefined): string[] {
	if (options === undefined) return []
	if (Array.isArray(options)) return options
	if (!isOptionsRecord(options)) return []
	if (isStructuredSelectOptions(options)) return options.choices
	if (isSelectChoiceMap(options)) return Object.keys(options)
	return []
}

function normalizeBadgeSpec(spec: BadgeSpec, key: string): BadgeDescriptor {
	if (isBadgeVariant(spec)) {
		return { label: key, variant: spec }
	}
	return {
		label: spec.label ?? key,
		variant: spec.variant,
		color: spec.color,
	}
}

function lookupFromBareMap(map: Record<string, BadgeSpec>, key: string | undefined): BadgeDescriptor | undefined {
	if (key === undefined || key === '') return undefined
	if (!(key in map)) return undefined
	return normalizeBadgeSpec(map[key], key)
}

function lookupFromStructured(options: SelectOptions, key: string | undefined): BadgeDescriptor | undefined {
	if (key === undefined || key === '') return undefined
	const badges = options.badges
	if (!badges || !(key in badges)) return undefined
	return normalizeBadgeSpec(badges[key], key)
}

/**
 * Resolve a stored choice value to a badge descriptor using field options.
 * @public
 */
export function lookupBadge(options: FieldOptions | undefined, key: string | undefined): BadgeDescriptor | undefined {
	if (options === undefined || key === undefined || key === '') return undefined
	if (Array.isArray(options)) return undefined
	if (!isOptionsRecord(options)) return undefined
	if (isStructuredSelectOptions(options)) return lookupFromStructured(options, key)
	if (isSelectChoiceMap(options)) return lookupFromBareMap(options, key)
	return undefined
}

/**
 * Whether field options carry any badge mapping.
 * @public
 */
export function hasBadgeOptions(options: FieldOptions | undefined): boolean {
	if (options === undefined || Array.isArray(options)) return false
	if (!isOptionsRecord(options)) return false
	if (isStructuredSelectOptions(options)) return options.badges !== undefined && Object.keys(options.badges).length > 0
	return isSelectChoiceMap(options)
}
