import { Doctype } from '@stonecrop/stonecrop'
import { doctypeMap } from '~/composables/useDoctypes'

export default defineNuxtPlugin({
	name: 'stonecrop-countries',
	dependsOn: ['stonecrop'],
	setup() {
		const { registerMeta, registerDoctype } = useStonecropSetup()

		// Register meta resolver — maps URL slug → Doctype instance
		registerMeta(routeContext => {
			const slug = routeContext.segments?.[0] ?? ''
			if (!slug) throw new Error('Cannot resolve doctype from route context')
			const config = doctypeMap.get(slug)
			if (!config) throw new Error(`No doctype registered for slug: ${slug}`)
			return Doctype.fromObject(config)
		})

		// Pre-register all doctypes so Desktop can list them
		for (const [slug, config] of doctypeMap.entries()) {
			const instance = Doctype.fromObject(config)
			registerDoctype(instance)
			// Also register by URL slug key if it differs from computed slug
			const { registry } = useStonecropSetup()
			if (registry && slug !== instance.slug) {
				registry.registry[slug] = instance
			}
		}
	},
})
