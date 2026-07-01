import type { Plugin } from 'graphql-yoga'

import { createAbility } from './ability'
import type { Context, MiddlewareOptions } from '../types'

const getLoggedInUser = () => {
	// Mock user for demonstration purposes
	return { id: '1', roles: ['editor'] }
}

export const yogaCaslPlugin: Plugin<Context> = {
	onContextBuilding: async ({ extendContext }) => {
		// Make this async
		const user = getLoggedInUser()
		const ability = await createAbility(user) // Await here
		extendContext({ ability, user })
	},
}

/**
 * Create a GraphQL Yoga plugin for CASL authorization
 * Note: This is a placeholder for future implementation
 *
 * @param options - CASL middleware configuration options
 * @returns Yoga plugin
 * @public
 */
export const createYogaPlugin = (_options: MiddlewareOptions = {}) => {
	return {
		onExecute: async (_: any) => {
			// TODO: Implement Yoga plugin via createCaslMiddleware(_options).
			// This would integrate with GraphQL Yoga's plugin system.
			console.warn('Yoga plugin not yet implemented')
		},
	}
}
