<script setup lang="ts">
import { ref } from 'vue'
import { AFormLink } from '@stonecrop/aform'
import type { AFormLinkValue } from '@stonecrop/aform'

// Direct import, not via AForm — AForm resolves schema fields by string name through Vue's
// dynamic component registry, which needs @stonecrop/aform's `install` plugin registered on
// the app instance first. Direct imports skip that requirement, same as CheckboxDemo.vue.
const TERRITORIES: AFormLinkValue[] = [
	{ id: 'TERR-001', displayText: 'North America' },
	{ id: 'TERR-002', displayText: 'Europe' },
	{ id: 'TERR-003', displayText: 'Asia Pacific' },
	{ id: 'TERR-004', displayText: 'Latin America' },
	{ id: 'TERR-005', displayText: 'Middle East & Africa' },
]

const filterFunction = (search: string) =>
	TERRITORIES.filter(t => t.displayText!.toLowerCase().includes(search.toLowerCase()))

const territory = ref<AFormLinkValue>({ id: 'TERR-001', displayText: 'North America' })
</script>

<template>
	<div class="stonecrop-demo">
		<AFormLink
			v-model="territory"
			label="Territory"
			doctype="territory"
			uuid="form-link-demo"
			:filterFunction="filterFunction" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ territory }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
