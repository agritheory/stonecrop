import { parse, toSql } from 'pgsql-ast-parser'
import type {
	Statement,
	CreateTableStatement,
	CreateColumnDef,
	ColumnConstraint,
	DataTypeDef,
	BasicDataTypeDef,
	ArrayDataTypeDef,
	ColumnConstraintReference,
	ColumnConstraintDefault,
} from 'pgsql-ast-parser'

import type { ParsedTable, ParsedColumn } from './postgres-types'
import { normalizeType } from './type-map'

/**
 * Parse PostgreSQL DDL and extract table definitions
 * @public
 */
export function parseDDL(sql: string): ParsedTable[] {
	const statements = parse(sql, { locationTracking: false })
	const tables: ParsedTable[] = []

	for (const stmt of statements) {
		if (isCreateTable(stmt)) {
			try {
				tables.push(parseCreateTable(stmt))
			} catch (err) {
				// Log but continue parsing other tables
				console.warn(`Failed to parse table ${stmt.name?.name}: ${err}`)
			}
		}
	}

	return tables
}

/**
 * Type guard for CREATE TABLE statements
 */
function isCreateTable(stmt: Statement): stmt is CreateTableStatement {
	return stmt.type === 'create table'
}

/**
 * Parse a CREATE TABLE statement into ParsedTable
 */
function parseCreateTable(stmt: CreateTableStatement): ParsedTable {
	const columns: ParsedColumn[] = []

	for (const col of stmt.columns ?? []) {
		// Skip LIKE TABLE entries
		if (col.kind === 'like table') {
			continue
		}

		if (col.kind === 'column') {
			columns.push(parseColumn(col))
		}
	}

	return {
		name: stmt.name.name,
		schema: stmt.name.schema,
		columns,
		inherits: stmt.inherits?.map(t => t.name),
	}
}

/**
 * Parse a column definition
 */
function parseColumn(col: CreateColumnDef): ParsedColumn {
	const constraints = col.constraints ?? []
	const { rawType, arrayDimensions, precision, scale, length } = parseDataType(col.dataType)

	return {
		name: col.name.name,
		dataType: rawType,
		normalizedType: normalizeType(rawType),
		nullable: !hasConstraint(constraints, 'not null'),
		isGenerated: hasGeneratedConstraint(constraints),
		defaultValue: extractDefault(constraints),
		arrayDimensions,
		reference: extractReference(constraints),
		precision,
		scale,
		length,
	}
}

/**
 * Parse data type, handling arrays and type parameters
 */
function parseDataType(dataType: DataTypeDef): {
	rawType: string
	arrayDimensions: number
	precision?: number
	scale?: number
	length?: number
} {
	let arrayDimensions = 0
	let current: DataTypeDef = dataType

	// Unwrap array types
	while (current.kind === 'array') {
		arrayDimensions++
		current = (current as ArrayDataTypeDef).arrayOf
	}

	const basicType = current as BasicDataTypeDef
	const rawType = basicType.name

	// Extract type parameters
	const config = basicType.config ?? []
	let precision: number | undefined
	let scale: number | undefined
	let length: number | undefined

	if (config.length > 0) {
		// For numeric(p, s) or varchar(n)
		if (rawType === 'numeric' || rawType === 'decimal') {
			precision = config[0]
			scale = config[1]
		} else if (
			rawType === 'varchar' ||
			rawType === 'char' ||
			rawType === 'character varying' ||
			rawType === 'character'
		) {
			length = config[0]
		} else if (rawType === 'bit' || rawType === 'varbit' || rawType === 'bit varying') {
			length = config[0]
		}
	}

	return { rawType, arrayDimensions, precision, scale, length }
}

/**
 * Check if a constraint type exists
 */
function hasConstraint(constraints: ColumnConstraint[], type: string): boolean {
	return constraints.some(c => c.type === type)
}

/**
 * Check for GENERATED constraint
 */
function hasGeneratedConstraint(constraints: ColumnConstraint[]): boolean {
	return constraints.some(c => c.type === 'add generated')
}

/**
 * Extract default value from constraints
 */
function extractDefault(constraints: ColumnConstraint[]): string | undefined {
	const defaultConstraint = constraints.find(c => c.type === 'default') as ColumnConstraintDefault | undefined
	if (!defaultConstraint?.default) {
		return undefined
	}

	// Convert the expression back to SQL string
	try {
		return toSql.expr(defaultConstraint.default)
	} catch {
		return undefined
	}
}

/**
 * Extract foreign key reference from constraints
 */
function extractReference(constraints: ColumnConstraint[]): ParsedColumn['reference'] | undefined {
	const refConstraint = constraints.find(c => c.type === 'reference') as ColumnConstraintReference | undefined
	if (!refConstraint) {
		return undefined
	}

	const foreignTable = refConstraint.foreignTable
	const foreignColumns = refConstraint.foreignColumns ?? []

	return {
		schema: foreignTable.schema,
		table: foreignTable.name,
		column: foreignColumns[0]?.name ?? 'id',
		onDelete: refConstraint.onDelete as 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | undefined,
	}
}
