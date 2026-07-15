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
 *     BigFloat: { component: 'ADecimalInput', fieldtype: 'Decimal' }
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
		const typeOverrides = options.typeOverrides?.[typeName]

		const entityFields = Object.entries(fields).filter(([fieldName, field]) => isEntityField(fieldName, field, type))

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
			const classified = classifyFieldType(fieldName, field, entityTypes, options)

			// Apply per-field overrides
			if (typeOverrides?.[fieldName]) {
				return Object.assign(classified, typeOverrides[fieldName])
			}

			return classified
		})

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
			// Clean up internal metadata unless requested, and stamp provenance.
			// Stamped last so every classification path (default, classifyField,
			// typeOverrides) carries the marker — the docbuilder's identity lock
			// keys off it, and an override must not be able to unset it.
			.map(field => {
				if (!options.includeUnmappedMeta) {
					const { _graphqlType, _unmapped, _isLink, ...clean } = field
					return Object.assign(clean, { source: 'introspected' as const })
				}
				const { _isLink, ...rest } = field
				return Object.assign(rest, { source: 'introspected' as const })
			})

		const doctype: ConvertedGraphQLDoctype = {
			name: typeName,
			slug: toSlug(typeName),
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

// Naming utilities
export { toSlug, toPascalCase, pascalToSnake, snakeToCamel, camelToSnake, snakeToLabel, camelToLabel } from '../naming'
