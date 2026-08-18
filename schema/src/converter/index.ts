/**
 * GraphQL Introspection to Stonecrop Schema Converter
 *
 * Converts a standard GraphQL introspection result (or SDL string) into
 * Stonecrop doctype schemas. Source-agnostic — works with any GraphQL server.
 *
 * @packageDocumentation
 */

import { buildClientSchema, buildSchema, isObjectType, type GraphQLSchema } from 'graphql'

import type { LinkDeclaration } from '../doctype'
import { toSlug } from '../naming'
import type { IntrospectionSource, GraphQLConversionOptions, ConvertedGraphQLDoctype } from './types'
import type { ValueField } from '../field'
import { defaultIsEntityType, defaultIsEntityField, classifyFieldType } from './heuristics'

/**
 * Convert a GraphQL schema to Stonecrop doctype schemas.
 *
 * Accepts either an `IntrospectionQuery` result object or an SDL string.
 * Entity types are identified using heuristics (or a custom `isEntityType` function)
 * and converted to `DoctypeMeta`-compatible JSON objects.
 *
 * @param source - GraphQL introspection result or SDL string
 * @param options - Conversion options for controlling output format and behavior
 * @returns Array of converted Stonecrop doctype definitions
 *
 * @example
 * ```typescript
 * // From introspection result (fetched from any GraphQL server)
 * const introspection = await fetchIntrospection('http://localhost:5000/graphql')
 * const doctypes = convertGraphQLSchema(introspection)
 *
 * // From SDL string
 * const sdl = fs.readFileSync('schema.graphql', 'utf-8')
 * const doctypes = convertGraphQLSchema(sdl)
 *
 * // With PostGraphile custom scalars
 * const doctypes = convertGraphQLSchema(introspection, {
 *   customScalars: {
 *     BigFloat: { component: 'ANumericInput' }
 *   }
 * })
 * ```
 *
 * @public
 */
export function convertGraphQLSchema(
	source: IntrospectionSource,
	options: GraphQLConversionOptions = {}
): ConvertedGraphQLDoctype[] {
	const schema = buildGraphQLSchema(source)
	const typeMap = schema.getTypeMap()

	// Determine the root operation type names to exclude
	const rootTypeNames = new Set<string>()
	const queryType = schema.getQueryType()
	const mutationType = schema.getMutationType()
	const subscriptionType = schema.getSubscriptionType()
	if (queryType) rootTypeNames.add(queryType.name)
	if (mutationType) rootTypeNames.add(mutationType.name)
	if (subscriptionType) rootTypeNames.add(subscriptionType.name)

	// Use custom or default entity type detector
	const isEntityType = options.isEntityType ?? defaultIsEntityType

	// Phase 1: Identify all entity types
	const entityTypes = new Set<string>()
	for (const [typeName, type] of Object.entries(typeMap)) {
		if (!isObjectType(type)) continue

		// Always skip root operation types (even if custom isEntityType doesn't)
		if (rootTypeNames.has(typeName)) continue

		if (isEntityType(typeName, type)) {
			entityTypes.add(typeName)
		}
	}

	// Phase 2: Apply include/exclude filters
	let filteredEntityTypes = entityTypes

	if (options.include) {
		const includeSet = new Set(options.include)
		filteredEntityTypes = new Set([...entityTypes].filter(t => includeSet.has(t)))
	}

	if (options.exclude) {
		const excludeSet = new Set(options.exclude)
		filteredEntityTypes = new Set([...filteredEntityTypes].filter(t => !excludeSet.has(t)))
	}

	// Phase 3: Convert each entity type to a doctype
	const isEntityField = options.isEntityField ?? defaultIsEntityField

	const doctypes: ConvertedGraphQLDoctype[] = []

	for (const typeName of filteredEntityTypes) {
		const type = typeMap[typeName]
		if (!isObjectType(type)) continue

		const fields = type.getFields()

		// A type carrying BOTH `id` and `rowId` is PostGraphile Amber with its default inflection:
		// the Relay global identifier has taken `id`, displacing the real column to `rowId`. Neither
		// name can be emitted as-is — `id` is an opaque node id, and `rowId` does not name a column.
		// Refuse to guess: drop the Relay field and tell the caller to fix it at the inflector, where
		// it belongs. Normalizing here would bake a database fact into the doctype.
		const isUnnormalizedPostGraphile = 'id' in fields && 'rowId' in fields
		if (isUnnormalizedPostGraphile) {
			options.onWarning?.(
				`${typeName}: schema exposes both 'id' (Relay identifier) and 'rowId' (the real column). ` +
					`Skipping 'id' and emitting 'rowId' verbatim — no primary key can be derived. ` +
					`Override the '_attributeName' and 'nodeIdFieldName' inflectors so the column keeps its own name.`
			)
		}

		const entityFields = Object.entries(fields).filter(
			([fieldName, field]) =>
				isEntityField(fieldName, field, type) && !(isUnnormalizedPostGraphile && fieldName === 'id')
		)

		// oxlint-disable-next-line oxc/no-map-spread -- ...custom spread required; Object.assign cannot preserve the metadata-carrying inferred union type from classifyField
		const allClassifiedFields = entityFields.map(([fieldName, field]) => {
			// Check for full custom classification first
			if (options.classifyField) {
				const custom = options.classifyField(fieldName, field, type)
				if (custom !== null && custom !== undefined) {
					return {
						kind: 'field' as const,
						fieldname: fieldName,
						label: custom.label ?? fieldName,
						component: custom.component ?? 'ATextInput',
						...custom,
					}
				}
			}

			// Default classification
			return classifyFieldType(fieldName, field, entityTypes, options)
		})

		// Derive the primary key, but only for the one case SDL actually settles: a non-null `id`
		// that is a plain scalar. A natural key is typically a UNIQUE constraint indistinguishable
		// from any other column here, and a table may carry several — so anything else is left for
		// the author to declare. Emitting a guess would be worse than emitting nothing, because the
		// middleware builds its identity predicate from this and the client keys records by it.
		const primaryKeyFieldname = allClassifiedFields.find(
			field => field.fieldname === 'id' && field.required && !field.doctype && !field._isLink
		)?.fieldname

		// Separate scalar fields from link fields
		const links: Record<string, LinkDeclaration> = {}
		const convertedFields = allClassifiedFields
			.filter(field => {
				if (field._isLink && field.doctype && field.cardinality) {
					links[field.fieldname] = {
						target: field.doctype,
						cardinality: field.cardinality,
					}
					return false
				}
				return true
			})
			// Clean up internal metadata unless requested, and stamp identity + provenance.
			// Stamped last so every classification path (default, classifyField) carries the marker —
			// the docbuilder's identity lock keys off it, and no classifier may unset it.
			.map(field => {
				const identity = field.fieldname === primaryKeyFieldname ? { primaryKey: true as const } : {}
				if (!options.includeUnmappedMeta) {
					const { _graphqlType, _unmapped, _isLink, ...clean } = field
					return Object.assign(clean, identity, { source: 'introspected' as const })
				}
				const { _isLink, ...rest } = field
				return Object.assign(rest, identity, { source: 'introspected' as const })
			})

		const doctypeName = options.doctypeNames?.[typeName] ?? typeName
		const doctype: ConvertedGraphQLDoctype = {
			name: doctypeName,
			slug: toSlug(doctypeName),
			fields: convertedFields as ValueField[],
		}

		if (Object.keys(links).length > 0) {
			doctype.links = links
		}

		if (options.includeUnmappedMeta) {
			doctype._graphqlTypeName = typeName
		}

		doctypes.push(doctype)
	}

	return doctypes
}

/**
 * Build a GraphQLSchema from either an introspection result or SDL string.
 *
 * @param source - IntrospectionQuery object or SDL string
 * @returns A complete GraphQLSchema
 * @internal
 */
function buildGraphQLSchema(source: IntrospectionSource): GraphQLSchema {
	if (typeof source === 'string') {
		// SDL string
		return buildSchema(source)
	}

	// IntrospectionQuery result
	return buildClientSchema(source)
}

// ═══════════════════════════════════════════════════════════════
// Re-exports
// ═══════════════════════════════════════════════════════════════

// Main converter (this file)
export { convertGraphQLSchema as default }

// Types
export type {
	IntrospectionSource,
	GraphQLConversionOptions,
	GraphQLConversionFieldMeta,
	ConvertedGraphQLDoctype,
} from './types'

// Scalar maps
export { GQL_SCALAR_MAP, WELL_KNOWN_SCALARS, INTERNAL_SCALARS, buildScalarMap } from './scalars'

// Heuristics
export { defaultIsEntityType, defaultIsEntityField, classifyFieldType } from './heuristics'

// Aggregate — the collection-view doctype derived from an entity, emitted as its own file
export { aggregateDoctypeName, buildAggregateDoctype, planGeneration, AGGREGATE_NAME_SUFFIX } from './aggregate'
export type { GenerationPlanEntry, GenerationPlanOptions } from './aggregate'

// Merge — verifies an authored doctype against the schema and stamps provenance
export { mergeIntrospectedDoctype, formatDoctypeDrift } from './merge'
export type { AuthoredDoctype, DoctypeDrift, MergeOptions, MergeResult } from './merge'

// Naming utilities
export { toSlug, toPascalCase, pascalToSnake, snakeToCamel, camelToSnake, snakeToLabel, camelToLabel } from '../naming'
