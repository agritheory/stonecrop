import { inject, onBeforeMount, Ref, ref } from 'vue'

import Registry from './registry'
import { Stonecrop } from './stonecrop'
import { useDataStore } from './stores/data'

type StonecropReturn = {
	stonecrop: Ref<Stonecrop>
	isReady: Ref<boolean>
}

export function useStonecrop(registry?: Registry): StonecropReturn {
	if (!registry) {
		registry = inject<Registry>('$registry')
	}

	const store = inject<ReturnType<typeof useDataStore>>('$store')
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
		const doctype = await registry.doctypeLoader(doctypeSlug)
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

	return { stonecrop, isReady }
}
