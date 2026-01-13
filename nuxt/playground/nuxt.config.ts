import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

import NuxtStonecrop from '../src/module'

const themePath = resolve(__dirname, '../../themes/default/default.css')

export default defineNuxtConfig({
	modules: [NuxtStonecrop],
	devtools: { enabled: true },
	compatibilityDate: '2024-12-13',
	stonecrop: {
		docbuilder: true,
	},
	css: [themePath, '~/assets/styles/common.css'],
})
