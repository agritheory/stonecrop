<template>
	<div id="home">
		<pre>{{ state }}</pre>
		<Fieldtype></Fieldtype>
	</div>
</template>

<script setup lang="ts">
import { Registry, useStonecrop } from '@agritheory/stonecrop'
import { inject } from 'vue'
import { useRoute } from 'vue-router'

import Fieldtype from './Fieldtype.vue'

const route = useRoute()
const registry = inject<Registry>('$registry')
let { state } = useStonecrop(route, registry)
</script>
