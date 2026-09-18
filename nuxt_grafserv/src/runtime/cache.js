import { defineEventHandler, getQuery, createError } from 'h3'
import { clearGrafservCache } from './handler.js'
export default defineEventHandler(async event => {
	const allowCacheApi = process.env.NODE_ENV === 'development'
	if (!allowCacheApi) {
		throw createError({
			status: 403,
			statusText: 'Cache API is disabled in production',
		})
	}
	const query = getQuery(event)
	const action = query.action
	switch (action) {
		case 'clear':
			await clearGrafservCache()
			return { success: true, message: 'Grafserv cache cleared' }
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
