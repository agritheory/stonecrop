import { request } from 'graphql-request'
import { App } from 'vue'

import { StonecropClass } from '@agritheory/stonecrop'

import type { InstallOptions } from 'types/index'
import { queries } from '@/queries'

export default {
	install: (app: App, options: InstallOptions) => {
		if (!options.url) {
			throw new Error('Please provide a URL for the GraphQL client')
		}

		const stonecrop: StonecropClass = app.config.globalProperties.$stonecrop
		if (!(stonecrop || stonecrop?.registry)) {
			throw new Error('Please setup Stonecrop before the GraphQL client')
		}

		Object.assign(stonecrop, {
			getMeta: async (doctype: string) => {
				const data = await request(options.url, queries.getMeta, { doctype })
				return data
			},
		})
	},
}
