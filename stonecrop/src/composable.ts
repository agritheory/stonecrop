import { inject, onBeforeMount, Ref, ref } from 'vue'

import { Stonecrop } from './stonecrop'

type StonecropReturn = {
	stonecrop: Stonecrop
	isReady: Ref<boolean>
}

export function useStonecrop(): StonecropReturn {
	const stonecrop = inject<Stonecrop>('$stonecrop')
	const isReady = ref(false)

	onBeforeMount(async () => {
		const route = stonecrop.registry.router.currentRoute.value
		const doctypeSlug = route.params.records?.toString().toLowerCase()
		const recordId = route.params.record?.toString().toLowerCase()

		// TODO: handle views other than list and form views?
		if (!doctypeSlug && !recordId) {
			return
		}

		// setup doctype via registry
		const doctype = await stonecrop.registry.doctypeLoader(doctypeSlug)
		stonecrop.registry.addDoctype(doctype)
		stonecrop.setup(doctype)

		if (doctypeSlug) {
			if (recordId) {
				await stonecrop.getRecord(doctype, recordId)
			} else {
				await stonecrop.getRecords(doctype)
			}
		}

		stonecrop.runAction(doctype, 'LOAD', recordId ? [recordId] : undefined)
		isReady.value = true
	})

	return { stonecrop, isReady }
}
