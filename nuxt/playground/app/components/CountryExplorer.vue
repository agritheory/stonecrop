<!--
	Custom AForm field for the playground country doctype, registered through host-components.ts.
	Its view controls teleport into Desktop's SheetNav toolbar while a country record is open.
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'nuxt/app'
import { useStonecrop } from '@stonecrop/stonecrop'

import { ASegmentedControl } from '@stonecrop/aform'
import { SHEET_NAV_TOOLBAR_SELECTOR } from '@stonecrop/desktop'

// Two root nodes (the field and the teleport), so AForm's field style is bound by hand.
defineOptions({ inheritAttrs: false })

const route = useRoute()
const { stonecrop } = useStonecrop()

const view = ref<'overview' | 'languages' | 'subdivisions'>('overview')

const viewOptions = {
	overview: { label: 'Overview' },
	languages: { label: 'Languages' },
	subdivisions: { label: 'Subdivisions' },
}

const countryCode = computed(() => (route.params.id as string) ?? '')

const countryRecord = computed(() => {
	if (!stonecrop.value || !countryCode.value) return null
	return stonecrop.value.getRecordById('country', countryCode.value)?.get('') as Record<string, unknown> | undefined
})

const countryName = computed(() => String(countryRecord.value?.name ?? countryCode.value ?? 'Country'))
</script>

<template>
	<div class="country-explorer" :style="$attrs.style">
		<p class="country-explorer-lead">
			<strong>{{ countryName }}</strong> ({{ countryCode }}) — {{ view }} view
		</p>
		<p class="country-explorer-hint">
			View controls teleport into <code>{{ SHEET_NAV_TOOLBAR_SELECTOR }}</code> in the SheetNav footer.
		</p>
	</div>

	<ClientOnly>
		<Teleport :to="SHEET_NAV_TOOLBAR_SELECTOR">
			<div class="country-explorer-toolbar">
				<ASegmentedControl
					:model-value="view"
					label="Country view"
					uuid="country-explorer-view"
					mode="edit"
					size="xs"
					hide-label
					aria-label="Country view"
					:options="viewOptions"
					@update:model-value="view = $event as typeof view" />
			</div>
		</Teleport>
	</ClientOnly>
</template>

<style scoped>
.country-explorer {
	display: flex;
	flex-direction: column;
	justify-content: center;
	box-sizing: border-box;
	padding: 1rem 1.25rem;
	border: 1px solid var(--sc-form-border);
	border-radius: 0.25rem;
	background: var(--sc-gray-5);
	font-family: var(--sc-font-family);
}

.country-explorer-lead {
	margin: 0 0 0.5rem;
	color: var(--sc-gray-80);
}

.country-explorer-hint {
	margin: 0;
	font-size: 0.875rem;
	color: var(--sc-gray-60);
	line-height: 1.5;
}

.country-explorer-toolbar {
	display: flex;
	align-items: center;
	min-height: 2.4rem;
	font-family: var(--sc-font-family);
}

code {
	padding: 0.1rem 0.35rem;
	background: var(--sc-gray-10);
	border-radius: 0.25rem;
	font-size: 0.9em;
}
</style>
