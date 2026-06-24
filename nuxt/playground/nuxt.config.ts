import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

import NuxtStonecrop from '../src/module'

const themePath = resolve(__dirname, '../../themes/default/default.css')

export default defineNuxtConfig({
	modules: [NuxtStonecrop],
	devtools: { enabled: true },
	compatibilityDate: '2026-01-01',
	stonecrop: {
		docbuilder: true,
		doctypesDir: 'doctypes',
	},
	css: [themePath, '~/assets/styles/common.css'],
	vite: {
		optimizeDeps: {
			include: ['pinia'],
		},
	},
})
