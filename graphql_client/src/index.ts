import { request } from 'graphql-request'
import type { App } from 'vue'

import type { InstallOptions } from 'types/index'
import { DoctypeMeta, useStonecrop } from '@agritheory/stonecrop'
import { queries } from './queries'

const StonecropGraphQl = {
	install: (app: App, options: InstallOptions) => {
		if (!options.url) {
			throw new Error('Please provide a URL for the GraphQL client')
		}

		const { stonecrop } = useStonecrop()
		if (!(stonecrop.value || stonecrop.value.registry)) {
			throw new Error('Please setup Stonecrop before the GraphQL client')
		}

		Object.assign(stonecrop.value, {
			getMeta: async (doctype: string) => {
				const data = await request(options.url, queries.getMeta, { doctype })
				return data
			},
		})
	},
}

export { StonecropGraphQl }
