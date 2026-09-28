import { StonecropClient } from '@stonecrop/graphql-client'
import { Doctype } from '@stonecrop/stonecrop'

import { DocumentationDataClient } from '~/composables/useDocumentationDataClient'
import { doctypeMap } from '~/composables/useDoctypes'
import { hostComponents } from '~/host-components'

export default defineNuxtPlugin({
	name: 'stonecrop-client',
	dependsOn: ['stonecrop'],
	setup(nuxtApp) {
		for (const [name, component] of Object.entries(hostComponents)) {
			nuxtApp.vueApp.component(name, component)
		}

		const { registerClient, registerMeta, registry } = useStonecropSetup()

		const client = new DocumentationDataClient()

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

		const grafservClient = new StonecropClient({ endpoint: '/graphql/' })

		registry!.registerDefaults('order', {
			userId: async () => {
				const { data } = await grafservClient.getRecords({ name: 'User', slug: 'user' })
				const first = data[0]
				return first && typeof first.id === 'string' ? first.id : ''
			},
		})

		registry!.registerDefaults('user', () => ({
			createdAt: new Date().toISOString(),
		}))

		return {
			provide: {
				stonecropClient: client,
			},
		}
	},
})
