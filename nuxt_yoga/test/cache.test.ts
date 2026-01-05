import { resolve } from 'node:path'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

describe('cache functionality', async () => {
	await setup({
		rootDir: resolve(__dirname, 'fixtures/basic'),
	})

	it('should cache responses', async () => {
		// First request (fresh)
		const start1 = Date.now()
		await $fetch('/graphql/', {
			method: 'POST',
			body: { query: '{ hello }' },
		})
		const time1 = Date.now() - start1

		// Second request (cached)
		const start2 = Date.now()
		await $fetch('/graphql/', {
			method: 'POST',
			body: { query: '{ hello }' },
		})
		const time2 = Date.now() - start2

		// Cached should be significantly faster
		expect(time2).toBeLessThan(time1)
	})

	it('should get cache statistics', async () => {
		const stats = await $fetch<{ success: boolean; data: { entries: any[] } }>('/graphql/cache?action=stats')

		expect(stats.success).toBe(true)
		expect(stats.data).toBeDefined()
		expect(stats.data.entries).toBeInstanceOf(Array)
	})

	it('should clear cache on demand', async () => {
		// Get initial stats
		const statsBefore = await $fetch<{ success: boolean; data: { totalEntries: number } }>(
			'/graphql/cache?action=stats'
		)
		expect(statsBefore.data.totalEntries).toBeGreaterThan(0)

		// Clear cache
		const clearResponse = await $fetch<{ success: boolean; message: string }>('/graphql/cache?action=clear')
		expect(clearResponse.success).toBe(true)

		// Stats should show no entries
		const statsAfter = await $fetch<{ success: boolean; data: { totalEntries: number } }>('/graphql/cache?action=stats')
		expect(statsAfter.data.totalEntries).toBe(0)
	})
})
