import { resolve } from 'node:path'

import { setup, fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

describe('the module installed from the registry', { tags: ['e2e', 'nuxt'] }, async () => {
	await setup({
		rootDir: resolve(__dirname, 'fixtures/registry-install'),
	})

	it.each(['/docbuilder', '/docbuilder/task'])('renders %s', async path => {
		const response = await fetch(path)
		const body = await response.text()
		expect(response.status, body.match(/\w+ is not defined/)?.[0]).toBe(200)
	})
})
