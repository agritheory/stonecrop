/**
 * @file This file contains all the types that are used in the application.
 * @public
 */

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
