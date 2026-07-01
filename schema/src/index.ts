// Interaction mode
export type { InteractionMode } from './mode'

// Table authoring types
export { TableViewConfig } from './table'

// Field types
export {
	StonecropFieldType,
	BUILTIN_FIELD_TYPES,
	TYPE_MAP,
	getDefaultComponent,
	resolveComponent,
	isBuiltinFieldType,
	type BuiltinFieldType,
	type FieldTemplate,
} from './fieldtype'

// Field schema
export type { DoctypeField, FieldOptions, FieldValidation, FieldsetField, TableField, ValueField } from './field'
export { DoctypeFieldSchema, FieldsetFieldSchema, TableFieldSchema, ValueFieldSchema } from './field'

// Doctype schema
export type {
	ActionDefinition,
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
	LazyFetch,
	LinkDeclaration,
	SerializedFunction,
	SyncFetch,
	WorkflowMeta,
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
	GQL_SCALAR_MAP,
	INTERNAL_SCALARS,
	WELL_KNOWN_SCALARS,
	type ConvertedGraphQLDoctype,
	type GraphQLConversionFieldMeta,
	type GraphQLConversionOptions,
	type IntrospectionSource,
} from './converter'

// Naming utilities
export { toSlug, toPascalCase, pascalToSnake, snakeToCamel, camelToSnake, snakeToLabel, camelToLabel } from './naming'

// Schema-to-column field shape
export type { ColumnSchema } from './column-schema'
