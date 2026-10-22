import { defineConfig } from 'vite-plus'

import { testTags } from '../vite/test-tags.ts'
import { fsModuleCachePath } from '../vite/fs-module-cache.ts'

/**
 * A workspace member so `vp run -r test` reaches these specs at all. `vp run` selects members only,
 * and `vp lint` rejects a `..` path, so no sibling under tools/ can run anything on this directory.
 */
export default defineConfig({
	test: {
		fsModuleCachePath,
		tags: testTags,
		environment: 'node',
	},
})
