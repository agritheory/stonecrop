import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isPortActive } from '../../src/composables/mqtt'

describe('mqtt composable', { tags: ['component'] }, () => {
	beforeEach(() => {
		vi.clearAllMocks()
		global.fetch = vi.fn()
	})

	describe('isPortActive', () => {
		it('returns true when port is active', async () => {
			vi.mocked(global.fetch).mockResolvedValueOnce(new Response())
			const result = await isPortActive('http://localhost', 8080)
			expect(result).toBe(true)
		})

		it('returns false on network error', async () => {
			vi.mocked(global.fetch).mockRejectedValueOnce(new Error('NetworkError'))
			const result = await isPortActive('http://localhost', 8080)
			expect(result).toBe(false)
		})

		it('returns false on connection refused', async () => {
			vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Failed to fetch'))
			const result = await isPortActive('http://localhost', 8080)
			expect(result).toBe(false)
		})

		it('handles abort error', async () => {
			const abortError = new DOMException('Aborted', 'AbortError')
			vi.mocked(global.fetch).mockRejectedValueOnce(abortError)
			const result = await isPortActive('http://localhost', 8080)
			expect(result).toBe(false)
		})

		it('returns true for unexpected errors', async () => {
			vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Some other error'))
			const result = await isPortActive('http://localhost', 8080)
			expect(result).toBe(true)
		})
	})
})
