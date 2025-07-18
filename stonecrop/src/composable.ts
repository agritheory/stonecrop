import { inject, onMounted, Ref, ref } from 'vue'

import Registry from './registry'
import { Stonecrop } from './stonecrop'
import { useDataStore } from './stores/data'

/**
 * Stonecrop composable return type
 * @public
 */
export type StonecropReturn = {
	stonecrop: Ref<Stonecrop | undefined>
}

/**
 * Stonecrop composable
 * @param registry - An existing Stonecrop Registry instance
 * @returns The Stonecrop instance and a boolean indicating if Stonecrop is setup and ready
 * @throws Error if the Stonecrop plugin is not enabled before using the composable
 * @public
 */
export function useStonecrop(registry?: Registry): StonecropReturn {
	const stonecrop = ref<Stonecrop>()

	onMounted(async () => {
		if (!registry) {
			registry = inject<Registry>('$registry')
		}

		if (!registry || !registry.router) return

		let store: ReturnType<typeof useDataStore>
		try {
			store = useDataStore()
		} catch (e) {
			throw new Error('Please enable the Stonecrop plugin before using the Stonecrop composable')
		}

		stonecrop.value = new Stonecrop(registry, store)
		const route = registry.router.currentRoute.value
		const doctypeSlug = route.params.records?.toString().toLowerCase()
		const recordId = route.params.record?.toString().toLowerCase()

		// TODO: handle views other than list and form views?
		if (!doctypeSlug && !recordId) {
			return
		}

		// setup doctype via registry
		const doctype = await registry.getMeta?.(doctypeSlug)
		if (doctype) {
			registry.addDoctype(doctype)
			stonecrop.value.setup(doctype)

			if (doctypeSlug) {
				if (recordId) {
					await stonecrop.value.getRecord(doctype, recordId)
				} else {
					await stonecrop.value.getRecords(doctype)
				}
			}

			stonecrop.value.runAction(doctype, 'load', recordId ? [recordId] : undefined)
		}
	})

	return { stonecrop }
}
