// Interaction mode
export type { InteractionMode } from './mode'

// Table authoring types
export { TableViewConfig } from './table'

// Component → semantic category — the single source of "what kind of value does this component render"
export {
	CANONICAL_COMPONENTS,
	COMPONENT_CATEGORY,
	COMPONENT_LINK_EXPANSION,
	componentCategory,
	componentLinkExpansion,
	resolveLinkRenderMode,
	type ComponentCategory,
	type LinkExpansion,
	type LinkRenderMode,
} from './component-meta'

// Field schema
export type { DoctypeField, FieldOptions, FieldValidation, FieldsetField, TableField, ValueField } from './field'
export {
	DoctypeFieldSchema,
	FieldsetFieldSchema,
	getPrimaryKeyField,
	getRecordIdentity,
	getRecordIdField,
	INTROSPECTED_IDENTITY_PROPS,
	normalizeFieldKind,
	TableFieldSchema,
	ValueFieldSchema,
} from './field'

// Doctype schema
// ActionDefinition and WorkflowMeta are exported as values (Zod schemas) so consumers can use
// .safeParse(), .shape, etc. at runtime. TypeScript types are inferred from the same exports.
export { ActionDefinition, TriggerDefinition, WorkflowLayout, WorkflowMeta, isActionAllowedInState } from './doctype'
export type {
	Cardinality,
	CustomFetch,
	DataClient,
	DoctypeContext,
	DoctypeMeta,
	DoctypeRef,
	FetchStrategy,
	GetRecordOptions,
	GetRecordResult,
	GetRecordsOptions,
	GetRecordsResult,
	LazyFetch,
	LinkDeclaration,
	SerializedFunction,
	SyncFetch,
} from './doctype'

// Validation helpers
export {
	parseDoctype,
	parseField,
	validateDoctype,
	validateField,
	type ValidationError,
	type ValidationResult,
} from './validation'

// GraphQL to Doctype conversion
export {
	buildScalarMap,
	classifyFieldType,
	convertGraphQLSchema,
	defaultIsEntityField,
	defaultIsEntityType,
	formatDoctypeDrift,
	GQL_SCALAR_MAP,
	INTERNAL_SCALARS,
	mergeIntrospectedDoctype,
	WELL_KNOWN_SCALARS,
	type AuthoredDoctype,
	type ConvertedGraphQLDoctype,
	type DoctypeDrift,
	type GraphQLConversionFieldMeta,
	type GraphQLConversionOptions,
	type IntrospectionSource,
	type MergeResult,
} from './converter'

// Naming utilities
export { toSlug, toPascalCase, pascalToSnake, snakeToCamel, camelToSnake, snakeToLabel, camelToLabel } from './naming'

// Schema-to-column field shape
export type { ColumnSchema } from './column-schema'
