import { Decimal } from 'decimal.js'
import { GraphQLClient } from 'graphql-request'

import { queries } from '@/queries'
import type { Meta, MetaParser, MetaResponse } from './types'

/**
 * Parse the response from the GraphQL server. Converts the stringified JSON to JSON and converts the stringified numbers to Decimal.
 * @param obj - The response from the GraphQL server
 * @returns The parsed response
 * @example
 * const response = '{"data":{"getMeta":{"id":"Issue","name":"Issue","workflow":"{\"machineId\":null,\"name\":\"save\",\"id\":\"1\"}","schema":"[{\"label\":\"Subject\",\"id\":\"1\"}]","actions":"[{\"eventName\":\"save\",\"id\":\"1\"}]"}}}'
 * const parsedResponse = metaParser(response)
 * console.log(parsedResponse)
 * /* Output: {"id": "Issue", "name": "Issue", "workflow": { "machineId": null, "name": "save", "id": "1" }, "schema": [{ "label": "Subject", "id": "1" }], "actions": [{ "eventName": "save", "id": "1" }]}
 */
const metaParser = (obj: string): MetaParser => {
	return JSON.parse(obj, (key, value) => {
		if (typeof value === 'string') {
			try {
				return JSON.parse(value, (key, value) => {
					if (typeof value === 'string' && !isNaN(Number(value))) {
						return new Decimal(value)
					}

					return value
				})
			} catch (error) {
				// if the value is not a stringified JSON, return as it is
				return value
			}
		} else if (!isNaN(Number(value))) {
			return new Decimal(value)
		}
		return value
	})
}

/**
 * Get meta information for a doctype
 * @param doctype - The doctype to get meta information for
 * @param url - The URL to send the request to
 * @returns The meta information for the doctype
 * @public
 */
export const methods = {
	getMeta: async (doctype: string, url?: string): Promise<MetaResponse> => {
		const client = new GraphQLClient(url || '/graphql', {
			jsonSerializer: {
				stringify: obj => JSON.stringify(obj), // process the request object before sending; leave as default JSON
				parse: metaParser, // process the response meta object
			},
		})

		const { getMeta } = await client.request<Meta['response'], Meta['variables']>({
			document: queries.getMeta,
			variables: { doctype },
		})

		return getMeta
	},
}

export { Meta, MetaParser, MetaResponse }
