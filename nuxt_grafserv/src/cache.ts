import { defineEventHandler, getQuery, createError } from 'h3'
import { invalidateCache } from './handler'

/**
 * Cache management endpoint for the Grafserv module.
 *
 * Actions:
 * - clear: Invalidate the Grafserv instance cache (will reload on next request)
 * - status: Get cache status information
 */
export default defineEventHandler(async event => {
	// Allow cache management in development only by default
	const allowCacheApi = process.env.NODE_ENV === 'development'

	if (!allowCacheApi) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Cache API is disabled in production',
		})
	}

	const query = getQuery(event)
	const action = query.action as string

	switch (action) {
		case 'clear':
			invalidateCache()
			return { success: true, message: 'Grafserv cache invalidated, will reload on next request' }

		case 'status':
			return {
				success: true,
				data: {
					message: 'Grafserv cache status - schema and server instance cached in memory',
				},
			}

		default:
			return {
				success: false,
				message: 'Invalid action',
				availableActions: ['clear', 'status'],
			}
	}
})
