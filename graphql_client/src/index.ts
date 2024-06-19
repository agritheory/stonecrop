import { request } from 'graphql-request'

import { queries } from './queries'

/**
 * Get meta information for a doctype
 * @param doctype - The doctype to get meta information for
 * @param url - The URL to send the request to
 * @returns The meta information for the doctype
 * @public
 */
export const methods = {
	getMeta: async (doctype: string, url?: string) => {
		const data: any = await request(url || '/graphql', queries.getMeta, { doctype })
		return data
	},
}
