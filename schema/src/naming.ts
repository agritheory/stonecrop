/**
 * Naming Convention Utilities
 * Converts between various naming conventions (snake_case, camelCase, PascalCase, kebab-case)
 * @packageDocumentation
 */

/**
 * Converts snake_case to camelCase
 * @param snakeCase - Snake case string
 * @returns Camel case string
 * @public
 * @example
 * ```typescript
 * snakeToCamel('user_email') // 'userEmail'
 * snakeToCamel('created_at') // 'createdAt'
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
 * ```
 */
export function camelToLabel(camelCase: string): string {
	const withSpaces = camelCase.replace(/([A-Z])/g, ' $1').trim()
	return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

/**
 * Convert table name to PascalCase doctype name
 * @param tableName - SQL table name (snake_case)
 * @returns PascalCase name
 * @public
 */
export function toPascalCase(tableName: string): string {
	return tableName
		.split(/[-_\s]+/)
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join('')
}

/**
 * Convert to kebab-case slug
 * @param name - Name to convert
 * @returns kebab-case slug
 * @public
 */
export function toSlug(name: string): string {
	return name
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase()
}

/**
 * Convert PascalCase to snake_case (e.g., for deriving table names from type names)
 * @param pascal - PascalCase string
 * @returns snake_case string
 * @public
 * @example
 * ```typescript
 * pascalToSnake('SalesOrder') // 'sales_order'
 * pascalToSnake('SalesOrderItem') // 'sales_order_item'
 * ```
 */
export function pascalToSnake(pascal: string): string {
	return pascal
		.replace(/([a-z])([A-Z])/g, '$1_$2')
		.replace(/[\s-]+/g, '_')
		.toLowerCase()
}
