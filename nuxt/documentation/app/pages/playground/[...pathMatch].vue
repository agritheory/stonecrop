<script setup lang="ts">
import {
	Desktop,
	ActionSetIconApprovals,
	ActionSetIconChat,
	ActionSetIconEmail,
	ActionSetIconFiles,
	ActionSetIconReports,
	type ActionElements,
	type ActionSetSlot,
} from '@stonecrop/desktop'
import { DRAFT_RECORD_ID } from '@stonecrop/stonecrop'
import ApprovalsPanel from '~/components/rail/ApprovalsPanel.vue'
import AttachmentsPanel from '~/components/rail/AttachmentsPanel.vue'
import ChatPanel from '~/components/rail/ChatPanel.vue'
import CollaborationPanel from '~/components/rail/CollaborationPanel.vue'
import ReportsPanel from '~/components/rail/ReportsPanel.vue'
import { usePlaygroundRouteAdapter } from '~/composables/usePlaygroundRouteAdapter'
import { doctypeMap } from '~/composables/useDoctypes'

definePageMeta({
	layout: 'playground',
})

const routeAdapter = usePlaygroundRouteAdapter()
const { run } = useClientAction()

const availableDoctypes = computed(() => Array.from(doctypeMap.keys()))

// Desktop offers no New of its own, so these lists get the playground's: the only doctypes the docs
// server can create. Unset on other views, never `[]`, which would hide a record's own actions.
const creatableDoctypes = new Set(['order', 'user'])
const hostActions = computed((): ActionElements[] | undefined => {
	const doctype = routeAdapter.getCurrentDoctype()
	if (routeAdapter.getCurrentView() !== 'records' || !creatableDoctypes.has(doctype)) return undefined
	return [
		{
			type: 'button',
			label: 'New Record',
			action: () => void routeAdapter.navigate({ view: 'record', doctype, recordId: DRAFT_RECORD_ID }),
		},
	]
})

const onOrderRecord = computed(
	() => routeAdapter.getCurrentDoctype() === 'order' && Boolean(routeAdapter.getCurrentRecordId())
)

const actionSetSlots = computed<ActionSetSlot[]>(() => [
	{ id: 'chat', label: 'Chat', icon: ActionSetIconChat, component: ChatPanel, show: onOrderRecord.value },
	{ id: 'email', label: 'Email', icon: ActionSetIconEmail, component: CollaborationPanel, show: onOrderRecord.value },
	{ id: 'files', label: 'Files', icon: ActionSetIconFiles, component: AttachmentsPanel, show: onOrderRecord.value },
	{
		id: 'approvals',
		label: 'Approvals',
		icon: ActionSetIconApprovals,
		component: ApprovalsPanel,
		show: onOrderRecord.value,
	},
	{ id: 'reports', label: 'Reports', icon: ActionSetIconReports, component: ReportsPanel, show: onOrderRecord.value },
])
</script>

<template>
	<div class="playground-desktop-root">
		<ClientOnly>
			<Desktop
				class="playground-desktop"
				:available-doctypes="availableDoctypes"
				:route-adapter="routeAdapter"
				:action-set-slots="actionSetSlots"
				:host-actions="hostActions"
				@action="run" />
			<template #fallback>
				<div class="playground-loading">
					<p>Loading playground...</p>
				</div>
			</template>
		</ClientOnly>
	</div>
</template>

<style scoped>
.playground-desktop-root {
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 0;
	min-width: 0;
}

/* ClientOnly may wrap children; keep the flex chain unbroken. */
.playground-desktop-root > * {
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 0;
	min-width: 0;
}

.playground-desktop {
	flex: 1;
	min-height: 0;
	min-width: 0;
}

.playground-loading {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	min-height: 0;
	color: var(--sc-gray-60);
}
</style>
