<script setup lang="ts">
import { Desktop, ActionSetIconHelp, type ActionSetSlot } from '@stonecrop/desktop'

import DocContentsPanel from '~/components/DocContentsPanel.vue'

const routeAdapter = useDocsRouteAdapter()
const { search: commandSearch, placeholder: commandSearchPlaceholder } = useDocsCommandSearch()
const { breadcrumbs } = useDocsNav()

const actionSetSlots: ActionSetSlot[] = [
	{
		id: 'contents',
		label: 'Contents',
		icon: ActionSetIconHelp,
		component: DocContentsPanel,
	},
]
</script>

<template>
	<div class="doc-shell">
		<Desktop
			class="doc-desktop"
			:route-adapter="routeAdapter"
			:breadcrumbs="breadcrumbs"
			:command-search="commandSearch"
			:command-search-placeholder="commandSearchPlaceholder"
			:action-set-slots="actionSetSlots">
			<div class="doc-content">
				<slot />
			</div>
		</Desktop>
	</div>
</template>
