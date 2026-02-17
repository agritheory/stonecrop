/**
 * Types for the GraphQL introspection to Stonecrop schema converter.
 * Source-agnostic — works with any GraphQL server (PostGraphile, Hasura, Apollo, etc.)
 * @packageDocumentation
 */

import type { IntrospectionQuery } from 'graphql'
import type { GraphQLObjectType, GraphQLField } from 'graphql'

import type { FieldMeta } from '../field'
import type { FieldTemplate } from '../fieldtype'

/**
 * Input source for the GraphQL schema converter.
 * Accepts either a standard GraphQL introspection result or an SDL string.
 *
 * - `IntrospectionQuery`: The raw result of a GraphQL introspection query (from any server)
 * - `string`: An SDL (Schema Definition Language) string
 *
 * Note: URL fetching is intentionally not supported in the library API.
 * Use the CLI (`stonecrop-schema generate --endpoint <url>`) for endpoint fetching,
 * or fetch the introspection result yourself and pass it in.
 *
 * @public
 */
export type IntrospectionSource = IntrospectionQuery | string

/**
 * Options for converting a GraphQL schema to Stonecrop doctype schemas.
 * All hooks are optional — sensible defaults are provided for common GraphQL patterns.
 *
 * @public
 */
export interface GraphQLConversionOptions {
	/**
	 * GraphQL type names to exclude from conversion.
	 * Applied after `isEntityType` filtering.
	 */
	exclude?: string[]

	/**
	 * Whitelist of GraphQL type names to convert.
	 * When provided, only these types are considered (after `isEntityType` filtering).
	 */
	include?: string[]

	/**
	 * Per-type, per-field overrides for the converted field definitions.
	 * Outer key is the GraphQL type name, inner key is the field name.
	 *
	 * @example
	 * ```typescript
	 * {
	 *   SalesOrder: {
	 *     totalAmount: { fieldtype: 'Currency', component: 'ACurrencyInput' }
	 *   }
	 * }
	 * ```
	 */
	typeOverrides?: Record<string, Record<string, Partial<FieldMeta>>>

	/**
	 * Map custom or non-standard GraphQL scalar types to Stonecrop field types.
	 * Merged with the built-in scalar maps (GQL_SCALAR_MAP + WELL_KNOWN_SCALARS).
	 * User-provided entries take highest precedence.
	 *
	 * @example
	 * ```typescript
	 * {
	 *   MyCustomMoney: { component: 'ACurrencyInput', fieldtype: 'Currency' },
	 *   PostGISPoint: { component: 'ATextInput', fieldtype: 'Data' }
	 * }
	 * ```
	 */
	customScalars?: Record<string, Partial<FieldTemplate>>

	/**
	 * Custom function to determine if a GraphQL object type represents an entity (→ doctype).
	 * When provided, replaces the default heuristic entirely.
	 *
	 * The default heuristic excludes types matching synthetic patterns:
	 * `*Connection`, `*Edge`, `*Input`, `*Patch`, `*Payload`, `*Condition`,
	 * `*Filter`, `*OrderBy`, `*Aggregate`, `Query`, `Mutation`, `Subscription`, `__*`.
	 *
	 * @param typeName - The GraphQL type name
	 * @param type - The full GraphQL object type definition
	 * @returns `true` if this type should become a Stonecrop doctype
	 */
	isEntityType?: (typeName: string, type: GraphQLObjectType) => boolean

	/**
	 * Custom function to filter which fields on an entity type are included.
	 * When provided, replaces the default field filter.
	 *
	 * The default filter excludes `nodeId`, `__typename`, and `clientMutationId`.
	 *
	 * @param fieldName - The GraphQL field name
	 * @param field - The full GraphQL field definition
	 * @param parentType - The parent entity type
	 * @returns `true` if this field should be included
	 */
	isEntityField?: (fieldName: string, field: GraphQLField<unknown, unknown>, parentType: GraphQLObjectType) => boolean

	/**
	 * Escape hatch: fully override the classification of a specific field.
	 * When this returns a non-null value, it is used as the field definition
	 * (merged with the field name). Return `null` to fall through to default classification.
	 *
	 * @param fieldName - The GraphQL field name
	 * @param field - The full GraphQL field definition
	 * @param parentType - The parent entity type
	 * @returns Partial field meta to use, or `null` for default behavior
	 */
	classifyField?: (
		fieldName: string,
		field: GraphQLField<unknown, unknown>,
		parentType: GraphQLObjectType
	) => Partial<FieldMeta> | null

	/**
	 * Custom function to derive the database table name from a GraphQL type name.
	 * The default converts PascalCase to snake_case (e.g., `SalesOrder` → `sales_order`).
	 *
	 * Return `undefined` to omit `tableName` from the output.
	 *
	 * @param typeName - The GraphQL type name
	 * @returns The derived table name, or `undefined`
	 */
	deriveTableName?: (typeName: string) => string | undefined

	/**
	 * Include `_graphqlType` and `_unmapped` metadata on converted fields.
	 * Useful for debugging conversions. Defaults to `false`.
	 */
	includeUnmappedMeta?: boolean
}

/**
 * Extended field metadata with optional GraphQL conversion metadata.
 * Only present when `includeUnmappedMeta` is enabled.
 *
 * @public
 */
export interface GraphQLConversionFieldMeta extends FieldMeta {
	/** Original GraphQL type name (for debugging/reference) */
	_graphqlType?: string
	/** Marks fields that couldn't be automatically mapped */
	_unmapped?: boolean
}

/**
 * Output of GraphQL schema conversion — one per entity type.
 *
 * @public
 */
export interface ConvertedGraphQLDoctype extends Omit<DoctypeMeta, 'fields'> {
	/** Field definitions with optional GraphQL conversion metadata */
	fields: GraphQLConversionFieldMeta[]
	/** Original GraphQL type name (for debugging/reference) */
	_graphqlTypeName?: string
}

// Re-import DoctypeMeta for the extends clause
import type { DoctypeMeta } from '../doctype'
