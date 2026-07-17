import { resolve } from 'node:path'

import NuxtStonecrop from '../../../src/module'

// This fixture deliberately has NO `doctypes/` directory. The routeStrategy below is
// self-sufficient — a catch-all that never looks at doctypes — so its routes must be
// registered regardless of whether a doctypes directory exists. See test/route-strategy.test.ts.
export default defineNuxtConfig({
	modules: [NuxtStonecrop],
	stonecrop: {
		routeStrategy: () => [
			{
				name: 'catch-all',
				path: '/:pathMatch(.*)*',
				file: resolve(__dirname, 'catch-all-target.vue'),
			},
		],
	},
})
