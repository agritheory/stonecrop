import type Doctype from '../doctype'

/**
 * Context passed to defaults functions at document or field level.
 * @public
 */
export type DefaultsContext = {
	doctype: Doctype
	record: Record<string, unknown>
	fieldname?: string
}

/**
 * A value inside a defaults document.
 * @public
 */
export type DefaultsValue =
	| string
	| number
	| boolean
	| null
	| DefaultsDocument
	| DefaultsValue[]
	| ((ctx: DefaultsContext) => DefaultsValue | Promise<DefaultsValue>)

/**
 * Nested object in the same shape as a composed record (HST / formData).
 * @public
 */
export type DefaultsDocument = {
	[field: string]: DefaultsValue
}

/**
 * Static document or a function that returns one (sync blocks, promise loads).
 * @public
 */
export type DefaultsSource = DefaultsDocument | ((ctx: DefaultsContext) => DefaultsDocument | Promise<DefaultsDocument>)

/**
 * Lazy loader for defaults that are not on the doctype JSON.
 * @public
 */
export type DefaultsLoader = (slug: string) => DefaultsSource | undefined | Promise<DefaultsSource | undefined>
