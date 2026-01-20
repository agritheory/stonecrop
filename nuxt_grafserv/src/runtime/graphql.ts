import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

import { getGrafservInstance } from './handler'
import type { ModuleOptions } from '../types'

/**
 * GraphQL operations handler
 * Handles POST requests with GraphQL queries, mutations, and subscriptions
 */
export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const options = config.grafserv as ModuleOptions

	const serv = await getGrafservInstance(options)
	return serv.handleGraphQLEvent(event)
})
