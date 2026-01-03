// Re-export everything from @stonecrop/schema converter
export { convertSchema, parseDDL, normalizeType, mapColumnToField, PG_TYPE_MAP, TYPE_ALIASES } from '@stonecrop/schema'

export type {
	ConvertedDoctype,
	ConversionFieldMeta,
	ParsedColumn,
	ParsedTable,
	ConversionOptions,
	PostgresType,
} from '@stonecrop/schema'

// Backward compatibility alias
export { PG_TYPE_MAP as TYPE_MAP } from '@stonecrop/schema'
