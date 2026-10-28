<template>
	<ClientOnly>
		<Desktop
			:available-doctypes="availableDoctypes"
			:route-adapter="routeAdapter"
			:host-actions="hostActions"
			@action="run" />
		<template #fallback>
			<div class="sc-loading">
				<p>Loading...</p>
			</div>
		</template>
	</ClientOnly>
</template>

<script setup lang="ts">
import { Desktop, type ActionElements } from '@stonecrop/desktop'
import { DRAFT_RECORD_ID } from '@stonecrop/stonecrop'

import { useRouteAdapter } from '~/composables/useRouteAdapter'
import { doctypeMap } from '~/composables/useDoctypes'

const routeAdapter = useRouteAdapter()
// Shared action executor, auto-imported from @stonecrop/nuxt: it runs an action's clientHandler
// when the doctype declares one, otherwise dispatches to the server, and writes the result back
// into the store under the identity the server settled on — a Save on a record not created yet
// creates it, so that identity is not always the one the form dispatched. Bound straight to
// Desktop's @action; a host-written wrapper would have to restate all of that.
const { run } = useClientAction()

// Reads are not bound here either. The StonecropClient registered in `stonecrop.client.ts` is this
// app's whole data layer: Stonecrop fetches through it and keys each result by the doctype's
// declared identity. A handler here would only race that fetch with a second copy of the same rule,
// which is how a hardcoded `record.id` once dropped every row of a natural-keyed doctype.
const availableDoctypes = computed(() => Array.from(doctypeMap.keys()))

// Desktop offers no New of its own, so a list gets this app's. Unset on other views, never `[]`,
// which would hide a record's own actions.
const hostActions = computed((): ActionElements[] | undefined => {
	if (routeAdapter.getCurrentView() !== 'records') return undefined
	const doctype = routeAdapter.getCurrentDoctype()
	return [
		{
			type: 'button',
			label: 'New Record',
			action: () => void routeAdapter.navigate({ view: 'record', doctype, recordId: DRAFT_RECORD_ID }),
		},
	]
})
</script>

<style>
.sc-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 50vh;
	color: #666;
}
</style>
