/**
 * @file This file contains all the types that are used in the application.
 * @public
 */

import type { GetRecordResult as SchemaGetRecordResult } from '@stonecrop/schema'

/**
 * Result from getRecord - includes the record data and any unknown links requested
 * @public
 */
export interface GetRecordResult extends SchemaGetRecordResult {
	/** Link names that were requested but don't exist in the doctype schema */
	unknownLinks?: string[]
}

/**
 * The type of the response from the `getMeta` query.
 * @public
 */
export type Meta = {
	variables: {
		doctype: string
	}

	response: {
		getMeta: MetaResponse
	}
}

/**
 * The type of the response from the `getRecords` query.
 * @public
 */
export type MetaResponse = {
	id: string
	name: string
	workflow: {
		id: string
		name: string
		machineId?: string
	}
	schema: {
		id: string
		label: string
	}[]
	actions: {
		id: string
		eventName: string
	}[]
}

/**
 * The type of the response from the `getMeta` query.
 * @public
 */
export type MetaParser = {
	data: Meta['response']
}
