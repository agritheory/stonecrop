import { resolve } from 'node:path'

import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

// Regression guard for the module gating ALL route generation behind `existsSync(doctypesDir)`
// (src/module.ts). A configured `routeStrategy` may be self-sufficient — fullstack's is a
// catch-all that never reads doctypes — but the module skipped the whole `extendPages` block when
// the doctypes directory was absent, so the strategy was silently never called and every doctype
// URL 404'd. fullstack hit this because its doctypes lived in `app/doctypes` while the module's
// default `doctypesDir` is `<rootDir>/doctypes`.
//
// The fixture has no `doctypes/` directory on purpose; the catch-all must still resolve.
describe('routeStrategy without a doctypesDir', { tags: ['e2e', 'nuxt'] }, async () => {
	await setup({
		rootDir: resolve(__dirname, 'fixtures/route-strategy'),
	})

	it('registers routeStrategy routes even when the doctypes dir is absent', async () => {
		const html = await $fetch('/any/deep/doctype/path')
		expect(html).toContain('catchall-rendered')
	})
})
