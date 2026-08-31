<!--
	Custom AForm field for the playground country doctype.
	When a country record is open, view controls teleport into Desktop's SheetNav toolbar —
	the same pattern FAB uses for Planner on plan records.
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'nuxt/app'
import { useStonecrop } from '@stonecrop/stonecrop'

import { ASegmentedControl } from '@stonecrop/aform'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const rootStyle = computed(() => {
	const style = { ...(attrs.style as Record<string, string> | undefined) }
	const height = attrs.height
	if (typeof height === 'string' && height && !style.height) style.height = height
	return style
})

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
	<div class="country-explorer" :style="rootStyle">
		<p class="country-explorer-lead">
			<strong>{{ countryName }}</strong> ({{ countryCode }}) — {{ view }} view
		</p>
		<p class="country-explorer-hint">
			View controls are in the SheetNav footer via <code>Teleport</code> to <code>#sheetnav-toolbar</code>.
		</p>
	</div>

	<ClientOnly>
		<Teleport to="#sheetnav-toolbar">
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
