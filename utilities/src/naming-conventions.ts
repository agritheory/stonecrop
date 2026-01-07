/**
 * Naming Convention Utilities
 * Converts between SQL snake_case and JavaScript camelCase naming conventions
 * @packageDocumentation
 */

/**
 * Result of name conversion
 * @public
 */
export interface NameConversion {
	/** Converted fieldname (camelCase) */
	fieldname: string
	/** Human-readable label */
	label: string
	/** Original SQL name */
	originalName: string
}

/**
 * Converts snake_case to camelCase
 * @param snakeCase - Snake case string
 * @returns Camel case string
 * @public
 * @example
 * ```typescript
 * snakeToCamel('user_email') // 'userEmail'
 * snakeToCamel('created_at') // 'createdAt'
 * snakeToCamel('user_id') // 'userId'
 * ```
 */
export function snakeToCamel(snakeCase: string): string {
	return snakeCase.replace(/_([a-z])/g, (_: string, letter: string) => letter.toUpperCase())
}

/**
 * Converts camelCase to snake_case
 * @param camelCase - Camel case string
 * @returns Snake case string
 * @public
 * @example
 * ```typescript
 * camelToSnake('userEmail') // 'user_email'
 * camelToSnake('createdAt') // 'created_at'
 * camelToSnake('userId') // 'user_id'
 * ```
 */
export function camelToSnake(camelCase: string): string {
	return camelCase.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

/**
 * Converts snake_case to Title Case label
 * @param snakeCase - Snake case string
 * @returns Title case label
 * @public
 * @example
 * ```typescript
 * snakeToLabel('user_email') // 'User Email'
 * snakeToLabel('first_name') // 'First Name'
 * snakeToLabel('created_at') // 'Created At'
 * ```
 */
export function snakeToLabel(snakeCase: string): string {
	return snakeCase
		.split('_')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ')
}

/**
 * Converts camelCase to Title Case label
 * @param camelCase - Camel case string
 * @returns Title case label
 * @public
 * @example
 * ```typescript
 * camelToLabel('userEmail') // 'User Email'
 * camelToLabel('firstName') // 'First Name'
 * camelToLabel('createdAt') // 'Created At'
 * ```
 */
export function camelToLabel(camelCase: string): string {
	// Insert space before capital letters and capitalize first letter
	const withSpaces = camelCase.replace(/([A-Z])/g, ' $1').trim()
	return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

/**
 * Converts SQL column name to Stonecrop field naming convention
 * Handles special cases like ID suffixes
 * @param sqlName - SQL column name (snake_case)
 * @returns Field name and label
 * @public
 * @example
 * ```typescript
 * convertSQLName('user_email')
 * // { fieldname: 'userEmail', label: 'User Email', originalName: 'user_email' }
 *
 * convertSQLName('user_id')
 * // { fieldname: 'userId', label: 'User', originalName: 'user_id' }
 *
 * convertSQLName('created_at')
 * // { fieldname: 'createdAt', label: 'Created At', originalName: 'created_at' }
 * ```
 */
export function convertSQLName(sqlName: string): NameConversion {
	const fieldname = snakeToCamel(sqlName)

	// Generate label - special handling for _id suffix
	let label: string
	if (sqlName.endsWith('_id')) {
		// Remove _id suffix for label: user_id -> User
		const withoutId = sqlName.slice(0, -3)
		label = snakeToLabel(withoutId)
	} else {
		label = snakeToLabel(sqlName)
	}

	return {
		fieldname,
		label,
		originalName: sqlName,
	}
}

/**
 * Batch converts multiple SQL column names
 * @param sqlNames - Array of SQL column names
 * @returns Array of name conversions
 * @public
 */
export function convertSQLNames(sqlNames: string[]): NameConversion[] {
	return sqlNames.map(convertSQLName)
}

/**
 * Creates a bidirectional mapping between SQL and Stonecrop names
 * @param sqlNames - Array of SQL column names
 * @returns Mapping object with both directions
 * @public
 */
export function createNameMapping(sqlNames: string[]): {
	sqlToFieldname: Map<string, string>
	fieldnameToSQL: Map<string, string>
	conversions: NameConversion[]
} {
	const conversions = convertSQLNames(sqlNames)
	const sqlToFieldname = new Map<string, string>()
	const fieldnameToSQL = new Map<string, string>()

	for (const conversion of conversions) {
		sqlToFieldname.set(conversion.originalName, conversion.fieldname)
		fieldnameToSQL.set(conversion.fieldname, conversion.originalName)
	}

	return {
		sqlToFieldname,
		fieldnameToSQL,
		conversions,
	}
}
