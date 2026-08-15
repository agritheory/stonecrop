import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const fixtureDir = dirname(fileURLToPath(import.meta.url))
const nuxtPackageRoot = resolve(fixtureDir, '../../..')

export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	alias: {
		'@route-utils': resolve(nuxtPackageRoot, 'src/runtime/app/composables/useDoctypeRoutes.ts'),
	},
})
