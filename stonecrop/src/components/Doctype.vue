<template>
	<div>
		<h3>{{ schema.doctype }}</h3>
		<AForm class="aform-main" :schema="schema.schema" :data="data" />
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useRoute } from 'vue-router'

import { AForm } from '@agritheory/aform'

import Registry from '@/registry.js'
// TODO: pinia for state, later
// const schema = useStonecrop()

const route = useRoute()
// change this to $registry.registry[$route.currentRoute???]
const data = route.params.recordData
const doctypeSlug = route.params.records

const registry = inject<Registry>('$registry')
const schema = registry.schemaLoader(doctypeSlug)
</script>
