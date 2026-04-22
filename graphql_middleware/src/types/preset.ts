/**
 * Field name casing convention for generated GraphQL field names.
 * @public
 */
export type FieldCasing = 'camel' | 'pascal'

/**
 * Options for configuring a StonecropPreset.
 * @public
 */
export interface StonecropPresetOptions {
	/**
	 * Field name casing convention for generated GraphQL field names.
	 * `'camel'` (default) produces names like `createdAt`, `taskTitle`.
	 * `'pascal'` produces names like `CreatedAt`, `TaskTitle`.
	 */
	fieldCasing?: FieldCasing
}
