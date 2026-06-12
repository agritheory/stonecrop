import { StonecropClient } from '@stonecrop/graphql-client'
import { Doctype } from '@stonecrop/stonecrop'

import { doctypeMap } from '~/composables/useDoctypes'

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
			const slug = routeContext.segments?.[0] ?? ''
			if (!slug) throw new Error('Cannot resolve doctype from route context')

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
