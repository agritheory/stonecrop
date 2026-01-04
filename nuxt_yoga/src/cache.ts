import { defineEventHandler, getQuery, createError } from 'h3'
import { useStorage } from 'nitropack/runtime'

const CACHE_PREFIX = 'yoga:cache:'

async function clearAllCaches() {
	const storage = useStorage()
	const keys = await storage.getKeys()
	const yogaKeys = keys.filter(key => key.startsWith(CACHE_PREFIX))
	await Promise.all(yogaKeys.map(key => storage.removeItem(key)))
	return { cleared: yogaKeys.length }
}

async function getCacheStats() {
	const storage = useStorage()
	const keys = await storage.getKeys()
	const yogaKeys = keys.filter(key => key.startsWith(CACHE_PREFIX))

	const entries = await Promise.all(
		yogaKeys.map(async key => {
			const item = await storage.getItem(key)
			const size = JSON.stringify(item).length
			return { key: key.replace(CACHE_PREFIX, ''), size }
		})
	)

	return { totalEntries: entries.length, entries }
}

export default defineEventHandler(async event => {
	// Allow cache management in development only by default
	const config = useRuntimeConfig()
	const allowCacheApi = config.yoga?.cache?.apiEnabled ?? process.env.NODE_ENV === 'development'

	if (!allowCacheApi) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Cache API is disabled',
		})
	}

	const query = getQuery(event)
	const action = query.action as string

	switch (action) {
		case 'clear':
			const result = await clearAllCaches()
			return { success: true, message: `Cleared ${result.cleared} cache entries` }

		case 'stats':
			const stats = await getCacheStats()
			return { success: true, data: stats }

		default:
			return {
				success: false,
				message: 'Invalid action',
				availableActions: ['clear', 'stats'],
			}
	}
})
