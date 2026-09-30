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
 * A fixed starting value, as a doctype file can hold it: plain data, nested like the record.
 * @public
 */
export type DefaultsData = string | number | boolean | null | DefaultsData[] | { [field: string]: DefaultsData }

/**
 * A doctype's own starting values for a new record: fixed data in the shape of the record. Anything worked out when
 * a record is made (today's date, a value looked up for the user's company) is registered on the registry instead.
 * @public
 */
export type DoctypeDefaults = { [field: string]: DefaultsData }

/**
 * A value inside a registered defaults document.
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
 * Options for composing a new record.
 * @public
 */
export type ComposeNewRecordOptions = {
	/** The moment `"now"` resolves to. Defaults to the time of the call. */
	now?: Date
	/** How long to wait for starting values that have not arrived, in milliseconds. */
	timeoutMs?: number
}

/**
 * A composed new record, complete: every starting value that arrived in time is in it.
 * @public
 */
export type ComposeNewRecordResult = {
	record: Record<string, unknown>
}
