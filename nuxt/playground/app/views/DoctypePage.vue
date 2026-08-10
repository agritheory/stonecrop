<!-- eslint-disable vue/multi-word-component-names -->
<!--
	Generic list/detail page for every doctype, mounted by the module's
	routeStrategy at /:doctype and /:doctype/:id. Lives outside pages/ so
	Nuxt's file-based routing doesn't also register it as its own route.
-->
<template>
	<ClientOnly>
		<Desktop :available-doctypes="availableDoctypes" :route-adapter="routeAdapter" />
		<template #fallback>
			<div class="loading"><p>Loading…</p></div>
		</template>
	</ClientOnly>
</template>

<script setup lang="ts">
import { Desktop } from '@stonecrop/desktop'
import { useDoctypeRouteAdapter } from '~/composables/useDoctypeRouteAdapter'
import { doctypeMap } from '~/composables/useDoctypes'

const routeAdapter = useDoctypeRouteAdapter()
const availableDoctypes = computed(() => Array.from(doctypeMap.keys()))

// No data handlers. Reads go through the CountriesDataClient registered in
// app/plugins/stonecrop.client.ts, so Stonecrop decides when to fetch and keys
// each row by the identity the doctype declares — this app is entirely
// natural-keyed, so that rule is the only thing that makes its lists render.
//
// Actions are unbound for the same reason: the countries API is read-only, and
// the client reports that on dispatch rather than the page silently swallowing it.
</script>

<style scoped>
.loading {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 50vh;
}
</style>
