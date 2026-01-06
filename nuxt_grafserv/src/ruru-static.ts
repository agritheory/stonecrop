import { defineEventHandler, type H3Event } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'
import type { ModuleOptions } from './types'

// Import grafserv instance getter
import { getGrafservInstance } from './handler'

/**
 * Handler for Ruru static assets (CSS, JS files)
 */
export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig()
	const options = config.grafserv as ModuleOptions

	try {
		// Get grafserv instance
		const serv = await getGrafservInstance(options)

		// Use grafserv's static asset handler
		return serv.handleGraphiqlStaticEvent(event)
	} catch (error) {
		console.error('[@stonecrop/nuxt-grafserv] Error serving Ruru static assets:', error)
		throw error
	}
})
