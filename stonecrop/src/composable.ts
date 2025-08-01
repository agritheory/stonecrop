// src/composable.ts
import { inject, onMounted, Ref, ref } from 'vue'

import Registry from './registry'
import { Stonecrop } from './stonecrop'

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
 * @throws Error if the Registry is not available
 * @public
 */
export function useStonecrop(registry?: Registry): StonecropReturn {
	const stonecrop = ref<Stonecrop>()

	onMounted(async () => {
		if (!registry) {
			registry = inject<Registry>('$registry')
		}

		if (!registry) {
			// Don't throw error, just leave stonecrop undefined
			// This allows components to handle the missing registry gracefully
			return
		}

		// Create Stonecrop instance with HST integration
		stonecrop.value = new Stonecrop(registry)

		if (!registry.router) return

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
