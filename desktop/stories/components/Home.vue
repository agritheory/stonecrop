<template>
	<div id="home">
		<pre>{{ stonecrop }}</pre>
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
let { stonecrop } = useStonecrop(route, registry)
</script>
