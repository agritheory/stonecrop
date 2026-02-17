/**
 * GraphQL Scalar Type Mappings
 *
 * Maps standard GraphQL scalars and well-known custom scalars to Stonecrop field types.
 * Source-agnostic — covers scalars commonly emitted by PostGraphile, Hasura, Apollo, etc.
 *
 * Users can extend these via the `customScalars` option in `GraphQLConversionOptions`.
 *
 * @packageDocumentation
 */

import type { FieldTemplate } from '../fieldtype'

/**
 * Mapping from standard GraphQL scalar types to Stonecrop field types.
 * These are defined by the GraphQL specification and are always available.
 *
 * @public
 */
export const GQL_SCALAR_MAP: Record<string, FieldTemplate> = {
	String: { component: 'ATextInput', fieldtype: 'Data' },
	Int: { component: 'ANumericInput', fieldtype: 'Int' },
	Float: { component: 'ANumericInput', fieldtype: 'Float' },
	Boolean: { component: 'ACheckbox', fieldtype: 'Check' },
	ID: { component: 'ATextInput', fieldtype: 'Data' },
}

/**
 * Mapping from well-known custom GraphQL scalars to Stonecrop field types.
 * These cover scalars commonly used across GraphQL servers (PostGraphile, Hasura, etc.)
 * without baking in knowledge of any specific server.
 *
 * Entries here have lower precedence than `customScalars` from options, but higher
 * precedence than unknown/unmapped scalars.
 *
 * @public
 */
export const WELL_KNOWN_SCALARS: Record<string, FieldTemplate> = {
	// Arbitrary precision / large numbers
	BigFloat: { component: 'ADecimalInput', fieldtype: 'Decimal' },
	BigDecimal: { component: 'ADecimalInput', fieldtype: 'Decimal' },
	Decimal: { component: 'ADecimalInput', fieldtype: 'Decimal' },
	BigInt: { component: 'ANumericInput', fieldtype: 'Int' },
	Long: { component: 'ANumericInput', fieldtype: 'Int' },

	// Identifiers
	UUID: { component: 'ATextInput', fieldtype: 'Data' },

	// Date / Time
	DateTime: { component: 'ADatetimePicker', fieldtype: 'Datetime' },
	Datetime: { component: 'ADatetimePicker', fieldtype: 'Datetime' },
	Date: { component: 'ADatePicker', fieldtype: 'Date' },
	Time: { component: 'ATimeInput', fieldtype: 'Time' },
	Interval: { component: 'ADurationInput', fieldtype: 'Duration' },
	Duration: { component: 'ADurationInput', fieldtype: 'Duration' },

	// Structured data
	JSON: { component: 'ACodeEditor', fieldtype: 'JSON' },
	JSONObject: { component: 'ACodeEditor', fieldtype: 'JSON' },
	JsonNode: { component: 'ACodeEditor', fieldtype: 'JSON' },
}

/**
 * Set of scalar type names that are internal to GraphQL servers and should be skipped
 * during field conversion (they don't represent meaningful data fields).
 *
 * @public
 */
export const INTERNAL_SCALARS = new Set(['Cursor'])

/**
 * Build a merged scalar map from the built-in maps and user-provided custom scalars.
 * Precedence (highest to lowest): customScalars → GQL_SCALAR_MAP → WELL_KNOWN_SCALARS
 *
 * @param customScalars - User-provided scalar overrides
 * @returns Merged scalar map
 * @internal
 */
export function buildScalarMap(customScalars?: Record<string, Partial<FieldTemplate>>): Record<string, FieldTemplate> {
	const merged: Record<string, FieldTemplate> = { ...WELL_KNOWN_SCALARS }

	// Standard scalars override well-known
	for (const [key, value] of Object.entries(GQL_SCALAR_MAP)) {
		merged[key] = value
	}

	// Custom scalars override everything
	if (customScalars) {
		for (const [key, value] of Object.entries(customScalars)) {
			merged[key] = {
				component: value.component ?? 'ATextInput',
				fieldtype: value.fieldtype ?? 'Data',
			}
		}
	}

	return merged
}
