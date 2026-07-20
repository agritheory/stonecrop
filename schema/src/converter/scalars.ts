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

import type { FieldTemplate } from './types'

/**
 * Mapping from standard GraphQL scalar types to Stonecrop field types.
 * These are defined by the GraphQL specification and are always available.
 *
 * @public
 */
export const GQL_SCALAR_MAP: Record<string, FieldTemplate> = {
	String: { component: 'ATextInput' },
	Int: { component: 'ANumericInput' },
	Float: { component: 'ANumericInput' },
	Boolean: { component: 'ACheckbox' },
	ID: { component: 'ATextInput' },
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
	// Arbitrary precision / large numbers — all numeric variants render with ANumericInput.
	BigFloat: { component: 'ANumericInput' },
	BigDecimal: { component: 'ANumericInput' },
	Decimal: { component: 'ANumericInput' },
	BigInt: { component: 'ANumericInput' },
	Long: { component: 'ANumericInput' },

	// Identifiers
	UUID: { component: 'ATextInput' },

	// Date / Time — no dedicated Time SFC exists; Time falls back to a plain text input.
	DateTime: { component: 'ADateTime' },
	Datetime: { component: 'ADateTime' },
	Date: { component: 'ADate' },
	Time: { component: 'ATextInput' },
	Interval: { component: 'ADuration' },
	Duration: { component: 'ADuration' },

	// Structured data
	JSON: { component: 'ACodeEditor' },
	JSONObject: { component: 'ACodeEditor' },
	JsonNode: { component: 'ACodeEditor' },
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
 * @public
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
			merged[key] = { component: value.component ?? 'ATextInput' }
		}
	}

	return merged
}
