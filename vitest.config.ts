import { defineConfig } from 'vitest/config'

// Tag definitions and descriptions live in each package's own vite/vitest config.
// CI filter examples:
//   Fast PR feedback:   vitest --tags-filter="unit or component"
//   Integration gate:   vitest --tags-filter="e2e or nuxt or graphql"
export default defineConfig({
	test: {
		projects: [
			'aform/*/vite.config.ts',
			'atable/*/vite.config.ts',
			'beam/*/vite.config.ts',
			'casl_middleware/*/vite.config.ts',
			'desktop/vite.config.ts',
			'node_editor/vite.config.ts',
			'nuxt/*',
			'rockfoil/*/vite.config.ts',
			'stonecrop/*/vite.config.ts',
		],
	},
})
