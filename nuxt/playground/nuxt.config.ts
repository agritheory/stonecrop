import { defineNuxtConfig } from 'nuxt/config'

import NuxtStonecrop from '../src/module'

export default defineNuxtConfig({
	modules: [NuxtStonecrop],
	stonecrop: {},
	devtools: { enabled: true },
	compatibilityDate: '2024-12-13',
})
