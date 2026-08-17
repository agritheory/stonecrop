import { StonecropClient } from '@stonecrop/graphql-client'
import { Doctype } from '@stonecrop/stonecrop'

import { doctypeMap, doctypeRoutes } from '~/composables/useDoctypes'

export default defineNuxtPlugin({
	name: 'stonecrop-client',
	dependsOn: ['stonecrop'],
	setup() {
		const { registerClient, registerMeta, registry } = useStonecropSetup()

		const client = new StonecropClient({
			endpoint: '/graphql/',
		})

		registerClient(client)

		registerMeta(async routeContext => {
			const segments = routeContext.segments ?? []
			const { slug } = doctypeRoutes.resolve(segments)
			if (!slug) throw new Error(`No doctype serves the route: /${segments.join('/')}`)

			const localDoctype = doctypeMap.get(slug)
			if (!localDoctype) throw new Error(`No doctype registered for slug: ${slug}`)

			return Doctype.fromObject(localDoctype)
		})

		for (const [slug, doctypeConfig] of doctypeMap.entries()) {
			const doctypeInstance = Doctype.fromObject(doctypeConfig)
			registry!.addDoctype(doctypeInstance)
			if (slug !== doctypeInstance.slug) {
				registry!.registry[slug] = doctypeInstance
			}
		}

		return {
			provide: {
				stonecropClient: client,
			},
		}
	},
})
