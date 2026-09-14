<template>
	<ClientOnly>
		<Desktop
			:available-doctypes="availableDoctypes"
			:route-adapter="routeAdapter"
			:rail-slots="railSlots"
			@action="run" />
		<template #fallback>
			<div class="loading">
				<p>Loading...</p>
			</div>
		</template>
	</ClientOnly>
</template>

<script setup lang="ts">
import { Desktop, type DocumentRailSlot } from '@stonecrop/desktop'
import AttachmentsPanel from '~/components/rail/AttachmentsPanel.vue'
import CollaborationPanel from '~/components/rail/CollaborationPanel.vue'
import { useFullstackRouteAdapter } from '~/composables/useFullstackRouteAdapter'
import { doctypeMap } from '~/composables/useDoctypes'

const routeAdapter = useFullstackRouteAdapter()
// Shared action executor (auto-imported from @stonecrop/nuxt): runs an action's
// clientHandler if present, else dispatches to the server handler + writes HST.
// Bound directly to Desktop's @action — no host-specific wrapper needed.
const { run } = useClientAction()

// Reads are not bound here either. The registered StonecropClient is this app's whole data layer:
// Stonecrop fetches through it and keys the result by the doctype's declared identity. A handler
// here would only race that fetch with a second copy of the same rule.
const availableDoctypes = computed(() => Array.from(doctypeMap.keys()))

const onOrderRecord = computed(
	() => routeAdapter.getCurrentDoctype() === 'order' && Boolean(routeAdapter.getCurrentRecordId())
)

const railSlots = computed<DocumentRailSlot[]>(() => [
	{ id: 'files', label: 'Files', component: AttachmentsPanel, show: onOrderRecord.value },
	{ id: 'collaboration', label: 'Email', component: CollaborationPanel, show: onOrderRecord.value },
])
</script>

<style>
html,
body,
#__nuxt {
	height: 100%;
	margin: 0;
}

.loading {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 50vh;
	color: #666;
}
</style>
