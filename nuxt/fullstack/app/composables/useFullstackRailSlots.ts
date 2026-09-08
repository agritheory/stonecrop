import { computed } from 'vue'

import type { DocumentRailSlot } from '@stonecrop/desktop'

import AttachmentsPanel from '~/components/rail/AttachmentsPanel.vue'
import CollaborationPanel from '~/components/rail/CollaborationPanel.vue'
import { useFullstackRouteAdapter } from '~/composables/useFullstackRouteAdapter'

export function useFullstackRailSlots() {
	const routeAdapter = useFullstackRouteAdapter()

	const onRecordView = computed(() => routeAdapter.getCurrentView() === 'record')

	return computed((): DocumentRailSlot[] => [
		{
			id: 'attachments',
			label: 'Attachments',
			component: AttachmentsPanel,
			show: onRecordView.value,
		},
		{
			id: 'collaboration',
			label: 'Collaboration',
			component: CollaborationPanel,
			show: onRecordView.value,
		},
	])
}
