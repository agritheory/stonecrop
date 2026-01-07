/**
 * SQL Schema Introspection Utilities
 * Parses PostgreSQL DDL and converts to Stonecrop schema format
 * @packageDocumentation
 */

/**
 * Represents a parsed SQL column with metadata
 * @public
 */
export interface SQLColumn {
	/** Column name from SQL */
	name: string
	/** PostgreSQL data type */
	sqlType: string
	/** Whether column is NOT NULL */
	notNull: boolean
	/** Whether column is PRIMARY KEY */
	primaryKey: boolean
	/** Whether column is UNIQUE */
	unique: boolean
	/** Default value expression */
	defaultValue?: string
	/** Foreign key reference (table.column) */
	foreignKey?: { table: string; column: string }
	/** CHECK constraint expression */
	checkConstraint?: string
	/** Enum values for ENUM types */
	enumValues?: string[]
}

/**
 * Represents a parsed SQL table
 * @public
 */
export interface SQLTable {
	/** Table name */
	name: string
	/** List of columns */
	columns: SQLColumn[]
	/** Schema name (default: public) */
	schema?: string
}

/**
 * Stonecrop field type
 * @public
 */
export type StonecropFieldType =
	| 'Data'
	| 'Text'
	| 'Int'
	| 'Float'
	| 'Check'
	| 'Datetime'
	| 'Date'
	| 'Time'
	| 'Select'
	| 'Link'
	| 'Table'
	| 'Code'
	| 'Phone'
	| 'Currency'

/**
 * Maps PostgreSQL data types to Stonecrop field types
 * @param sqlType - PostgreSQL data type
 * @param enumValues - Enum values if type is ENUM
 * @returns Corresponding Stonecrop field type
 * @public
 */
export function mapSQLTypeToFieldType(sqlType: string, enumValues?: string[]): StonecropFieldType {
	const normalizedType = sqlType.toLowerCase().trim()

	// Handle parameterized types (e.g., varchar(255) -> varchar)
	const baseType = normalizedType.split('(')[0].trim()

	// Enum types become Select fields
	if (enumValues && enumValues.length > 0) {
		return 'Select'
	}

	// Type mapping based on PostgreSQL types
	const typeMap: Record<string, StonecropFieldType> = {
		// Text types
		varchar: 'Data',
		character: 'Data',
		char: 'Data',
		text: 'Text',

		// Numeric types
		integer: 'Int',
		int: 'Int',
		int2: 'Int',
		int4: 'Int',
		int8: 'Int',
		smallint: 'Int',
		bigint: 'Int',
		serial: 'Int',
		bigserial: 'Int',

		// Float types
		numeric: 'Float',
		decimal: 'Float',
		real: 'Float',
		float: 'Float',
		float4: 'Float',
		float8: 'Float',
		double: 'Float',
		money: 'Currency',

		// Boolean
		boolean: 'Check',
		bool: 'Check',

		// Date/Time types
		timestamp: 'Datetime',
		timestamptz: 'Datetime',
		date: 'Date',
		time: 'Time',
		timetz: 'Time',

		// JSON types (use Code for now)
		json: 'Code',
		jsonb: 'Code',
		xml: 'Code',

		// Array types (use Text for serialization)
		array: 'Text',
	}

	return typeMap[baseType] || 'Data'
}

/**
 * Parses a PostgreSQL CREATE TABLE statement
 * @param ddl - SQL DDL string
 * @returns Array of parsed tables
 * @public
 */
export function parseDDL(ddl: string): SQLTable[] {
	const tables: SQLTable[] = []

	// Split by CREATE TABLE statements
	const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:(\w+)\.)?(\w+)\s*\(([\s\S]*?)\);/gi

	let match: RegExpExecArray | null
	while ((match = createTableRegex.exec(ddl)) !== null) {
		const schema = match[1]
		const tableName = match[2]
		const columnsDef = match[3]

		const table: SQLTable = {
			name: tableName,
			columns: [],
			schema: schema || 'public',
		}

		// Parse columns and constraints
		const lines = columnsDef.split(',').map(l => l.trim())

		const primaryKeys: string[] = []
		const foreignKeys: Map<string, { table: string; column: string }> = new Map()
		const uniqueColumns: Set<string> = new Set()

		for (const line of lines) {
			// Skip empty lines
			if (!line) continue

			// Handle PRIMARY KEY constraint
			if (/PRIMARY\s+KEY/i.test(line)) {
				const pkMatch = line.match(/PRIMARY\s+KEY\s*\(([^)]+)\)/i)
				if (pkMatch) {
					const cols = pkMatch[1].split(',').map(c => c.trim().replace(/"/g, ''))
					primaryKeys.push(...cols)
				}
				continue
			}

			// Handle FOREIGN KEY constraint
			if (/FOREIGN\s+KEY/i.test(line)) {
				const fkMatch = line.match(/FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+(\w+)\s*\(([^)]+)\)/i)
				if (fkMatch) {
					const localCol = fkMatch[1].trim().replace(/"/g, '')
					const refTable = fkMatch[2].trim()
					const refCol = fkMatch[3].trim().replace(/"/g, '')
					foreignKeys.set(localCol, { table: refTable, column: refCol })
				}
				continue
			}

			// Handle UNIQUE constraint
			if (/UNIQUE/i.test(line) && /UNIQUE\s*\(/i.test(line)) {
				const uniqueMatch = line.match(/UNIQUE\s*\(([^)]+)\)/i)
				if (uniqueMatch) {
					const cols = uniqueMatch[1].split(',').map(c => c.trim().replace(/"/g, ''))
					cols.forEach(c => uniqueColumns.add(c))
				}
				continue
			}

			// Parse column definition
			const columnMatch = line.match(/^(\w+)\s+([A-Za-z0-9_()]+)(.*)$/i)
			if (columnMatch) {
				const columnName = columnMatch[1]
				const dataType = columnMatch[2]
				const modifiers = columnMatch[3] || ''

				const column: SQLColumn = {
					name: columnName,
					sqlType: dataType,
					notNull: /NOT\s+NULL/i.test(modifiers),
					primaryKey: false,
					unique: /UNIQUE/i.test(modifiers),
				}

				// Extract enum values
				if (/^ENUM/i.test(dataType)) {
					const enumMatch = dataType.match(/ENUM\s*\(([^)]+)\)/i)
					if (enumMatch) {
						column.enumValues = enumMatch[1].split(',').map(v => v.trim().replace(/^'|'$/g, ''))
					}
				}

				// Extract default value
				const defaultMatch = modifiers.match(/DEFAULT\s+([^,\s]+)/i)
				if (defaultMatch) {
					column.defaultValue = defaultMatch[1]
				}

				// Extract CHECK constraint
				const checkMatch = modifiers.match(/CHECK\s*\(([^)]+)\)/i)
				if (checkMatch) {
					column.checkConstraint = checkMatch[1]
				}

				// Check for inline REFERENCES (foreign key)
				const refMatch = modifiers.match(/REFERENCES\s+(\w+)\s*\(([^)]+)\)/i)
				if (refMatch) {
					column.foreignKey = {
						table: refMatch[1],
						column: refMatch[2].trim().replace(/"/g, ''),
					}
				}

				table.columns.push(column)
			}
		}

		// Apply primary keys
		primaryKeys.forEach(pk => {
			const col = table.columns.find(c => c.name === pk)
			if (col) {
				col.primaryKey = true
				col.notNull = true // PKs are always NOT NULL
			}
		})

		// Apply foreign keys
		foreignKeys.forEach((fk, colName) => {
			const col = table.columns.find(c => c.name === colName)
			if (col) {
				col.foreignKey = fk
			}
		})

		// Apply unique constraints
		uniqueColumns.forEach(colName => {
			const col = table.columns.find(c => c.name === colName)
			if (col) {
				col.unique = true
			}
		})

		tables.push(table)
	}

	return tables
}

/**
 * Result of SQL to Stonecrop conversion
 * @public
 */
export interface ConversionResult {
	/** Doctype name (from table name) */
	doctype: string
	/** Stonecrop schema fields */
	schema: Array<{
		fieldname: string
		label: string
		fieldtype: StonecropFieldType
		required?: boolean
		readonly?: boolean
		options?: string
		default?: any
	}>
	/** Detected relationships */
	relationships: Array<{
		fieldname: string
		targetDoctype: string
		targetField: string
	}>
}

/**
 * Converts SQL table to Stonecrop schema format
 * @param table - Parsed SQL table
 * @param namingConverter - Function to convert field names
 * @returns Conversion result with schema and relationships
 * @public
 */
export function convertTableToSchema(
	table: SQLTable,
	namingConverter?: (sqlName: string) => { fieldname: string; label: string }
): ConversionResult {
	const result: ConversionResult = {
		doctype: table.name,
		schema: [],
		relationships: [],
	}

	for (const column of table.columns) {
		const { fieldname, label } = namingConverter
			? namingConverter(column.name)
			: { fieldname: column.name, label: column.name }

		const fieldtype = column.foreignKey ? 'Link' : mapSQLTypeToFieldType(column.sqlType, column.enumValues)

		const field: ConversionResult['schema'][0] = {
			fieldname,
			label,
			fieldtype,
		}

		// Add required flag for NOT NULL columns (except PKs which are readonly)
		if (column.notNull && !column.primaryKey) {
			field.required = true
		}

		// Make primary keys readonly
		if (column.primaryKey) {
			field.readonly = true
		}

		// Handle foreign keys (Link fields)
		if (column.foreignKey) {
			field.options = column.foreignKey.table
			result.relationships.push({
				fieldname,
				targetDoctype: column.foreignKey.table,
				targetField: column.foreignKey.column,
			})
		}

		// Handle enum values (Select fields)
		if (column.enumValues && column.enumValues.length > 0) {
			field.options = column.enumValues.join('\n')
		}

		// Handle default values
		if (column.defaultValue) {
			// Clean up default value (remove quotes, casts, etc.)
			let defaultVal: number | string | boolean = column.defaultValue.replace(/^'|'$/g, '')
			if (fieldtype === 'Int' || fieldtype === 'Float') {
				defaultVal = parseFloat(defaultVal)
			} else if (fieldtype === 'Check') {
				defaultVal = defaultVal === 'true' || defaultVal === 't'
			}
			field.default = defaultVal
		}

		result.schema.push(field)
	}

	return result
}

/**
 * Introspects SQL DDL and converts all tables to Stonecrop schemas
 * @param ddl - PostgreSQL DDL string
 * @param namingConverter - Optional function to convert field names
 * @returns Array of conversion results
 * @public
 */
export function introspectSQL(
	ddl: string,
	namingConverter?: (sqlName: string) => { fieldname: string; label: string }
): ConversionResult[] {
	const tables = parseDDL(ddl)
	return tables.map(table => convertTableToSchema(table, namingConverter))
}
