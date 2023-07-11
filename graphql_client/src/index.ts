import { request } from 'graphql-request'

import { queries } from './queries'

export const methods = {
	getMeta: async (doctype: string, url?: string) => {
		const data: any = await request(url || '/graphql', queries.getMeta, { doctype })
		return data
	},
}
