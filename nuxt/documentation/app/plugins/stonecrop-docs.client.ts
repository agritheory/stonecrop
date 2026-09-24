import { Registry, Stonecrop } from '@stonecrop/stonecrop'

// Minimal Stonecrop surface so @stonecrop/desktop can mount on documentation pages without
// registering doctypes or a DataClient — the docs shell only needs ActionSet and SheetNav.
export default defineNuxtPlugin(nuxtApp => {
	const registry = new Registry()
	const stonecrop = new Stonecrop(registry)
	nuxtApp.vueApp.provide('$registry', registry)
	nuxtApp.vueApp.provide('$stonecrop', stonecrop)
})
