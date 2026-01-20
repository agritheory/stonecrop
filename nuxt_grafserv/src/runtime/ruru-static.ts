import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

import { getGrafservInstance } from './handler'
import type { ModuleOptions } from '../types'

/**
 * Ruru/GraphiQL static assets handler
 * Serves CSS, JavaScript, and other static files for the GraphQL IDE
 */
export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const options = config.grafserv as ModuleOptions

	const serv = await getGrafservInstance(options)
	return serv.handleGraphiqlStaticEvent(event)
})
