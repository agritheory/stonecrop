import type { BadgeDescriptor, FieldOptions } from '@stonecrop/schema'
import { isBadgeDescriptor, lookupBadge } from '@stonecrop/schema'

import { deserializeFunction } from './deserialize'

/**
 * Row context passed to badge `format` functions in form fields.
 * @public
 */
export type BadgeFormatContext = {
	record?: Record<string, unknown>
	row?: Record<string, unknown>
}

/**
 * Badge-aware field `format` function signature.
 * @public
 */
export type BadgeFormatFn = (value: unknown, context: BadgeFormatContext) => string | BadgeDescriptor

/**
 * Resolve a field value to a badge descriptor using format (if present) then options map.
 * @public
 */
export function resolveFieldBadge(
	value: unknown,
	options: FieldOptions | undefined,
	format: string | BadgeFormatFn | undefined,
	context: BadgeFormatContext = {}
): BadgeDescriptor | undefined {
	if (format) {
		let formatted: unknown
		if (typeof format === 'function') {
			formatted = format(value, context)
		} else {
			const formatFn = deserializeFunction<BadgeFormatFn>(format)
			formatted = formatFn(value, context)
		}
		if (isBadgeDescriptor(formatted)) {
			const label = formatted.label.trim()
			return label ? formatted : undefined
		}
		if (typeof formatted === 'string' && formatted !== '') {
			return lookupBadge(options, formatted) ?? { label: formatted, variant: 'neutral' }
		}
	}

	const key = badgeLookupKey(value)
	if (key === undefined) return undefined
	return lookupBadge(options, key)
}

/**
 * Stored choice value as an options-map key. Only primitives can match a declared choice, so
 * anything else yields undefined rather than the '[object Object]' that String() would produce.
 */
function badgeLookupKey(value: unknown): string | undefined {
	switch (typeof value) {
		case 'string':
			return value === '' ? undefined : value
		case 'number':
		case 'boolean':
		case 'bigint':
			return String(value)
		default:
			return undefined
	}
}

const BADGE_VARIANTS = new Set<string>(['neutral', 'success', 'warning', 'danger', 'brand'])

/**
 * CSS custom properties for input-accent styling on a native input.
 * @public
 */
export function badgeInputAccentStyle(descriptor: BadgeDescriptor | undefined): Record<string, string> | undefined {
	if (!descriptor?.label?.trim()) return undefined
	const variant = descriptor.variant ?? 'neutral'
	if (descriptor.color) {
		return {
			borderLeftWidth: '4px',
			borderLeftStyle: 'solid',
			borderLeftColor: descriptor.color,
			paddingLeft: 'calc(1ch - 4px)',
		}
	}
	if (!BADGE_VARIANTS.has(variant)) return undefined
	return {
		borderLeftWidth: '4px',
		borderLeftStyle: 'solid',
		borderLeftColor: `var(--sc-badge-${variant}-accent)`,
		paddingLeft: 'calc(1ch - 4px)',
	}
}
