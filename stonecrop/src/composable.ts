import { inject, onBeforeMount, Ref, ref } from 'vue'

import Registry from './registry'
import { Stonecrop } from './stonecrop'
import { useDataStore } from './stores/data'

/**
 * Stonecrop composable return type
 * @public
 */
export type StonecropReturn = {
	stonecrop: Ref<Stonecrop>
	isReady: Ref<boolean>
}

/**
 * Stonecrop composable
 * @param registry - An existing Stonecrop Registry instance
 * @returns The Stonecrop instance and a boolean indicating if Stonecrop is setup and ready
 * @throws Error if the Stonecrop plugin is not enabled before using the composable
 * @public
 */
export function useStonecrop(registry?: Registry): StonecropReturn {
	if (!registry) {
		registry = inject<Registry>('$registry')
	}

	let store: ReturnType<typeof useDataStore>
	try {
		store = useDataStore()
	} catch (e) {
		throw new Error('Please enable the Stonecrop plugin before using the Stonecrop composable')
	}

	const stonecrop = ref(new Stonecrop(registry, store))
	const isReady = ref(false)

	onBeforeMount(async () => {
		const route = registry.router.currentRoute.value
		const doctypeSlug = route.params.records?.toString().toLowerCase()
		const recordId = route.params.record?.toString().toLowerCase()

		// TODO: handle views other than list and form views?
		if (!doctypeSlug && !recordId) {
			return
		}

		// setup doctype via registry
		const doctype = await registry.getMeta(doctypeSlug)
		registry.addDoctype(doctype)
		stonecrop.value.setup(doctype)

		if (doctypeSlug) {
			if (recordId) {
				await stonecrop.value.getRecord(doctype, recordId)
			} else {
				await stonecrop.value.getRecords(doctype)
			}
		}

		stonecrop.value.runAction(doctype, 'LOAD', recordId ? [recordId] : undefined)
		isReady.value = true
	})

	// @ts-expect-error TODO: fix the type mismatch
	return { stonecrop, isReady }
}
