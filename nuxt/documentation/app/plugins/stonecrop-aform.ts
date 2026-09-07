import { createPinia } from 'pinia'
import { install as installAform } from '@stonecrop/aform'

// Ported from docs/.vitepress/theme/index.ts's enhanceApp — AForm's dynamic schema-driven
// field resolution (e.g. `component: 'ACheckbox'` strings in an AForm schema) needs these
// components registered globally, and some rely on an active Pinia store.
export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.use(createPinia())
	nuxtApp.vueApp.use(installAform)
})
