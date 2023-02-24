import { inject, onBeforeMount, Ref, ref } from 'vue'

import Registry from './registry'
import { Stonecrop } from './stonecrop'

type StonecropReturn = {
	stonecrop: Ref<Stonecrop>
	isReady: Ref<boolean>
}

// TODO: pinia for state, later
export function useStonecrop(registry?: Registry): StonecropReturn {
	if (!registry) {
		registry = inject<Registry>('$registry')
	}

	const stonecrop = ref(new Stonecrop(registry))
	const isReady = ref(false)

	onBeforeMount(async () => {
		const route = registry.router.currentRoute.value
		const doctypeSlug = route.params.records?.toString().toLowerCase()
		const recordId = route.params.record?.toString().toLowerCase()

		// TODO: handle views other than list and form views
		if (doctypeSlug === undefined && recordId === undefined) {
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
