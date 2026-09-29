<script setup lang="ts">
import {
	Desktop,
	ActionSetIconApprovals,
	ActionSetIconChat,
	ActionSetIconEmail,
	ActionSetIconFiles,
	ActionSetIconReports,
	type ActionSetSlot,
} from '@stonecrop/desktop'
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
