<template>
	<div class="builder-container">
		<div class="builder-schema">
			<h3>Schema</h3>
			<AForm class="aform-main" :key="formKey" :schema="doctypeSchema" :data="schemaData" />
			<!-- <SheetNav class="sheet-nav-footer" /> -->
		</div>
		<div class="builder-hooks">
			<h3>Side Effects</h3>
			<AForm class="aform-main" :key="formKey" :schema="hooksSchema" :data="hooksData" />
		</div>
		<div class="builder-events">
			<h3>Events</h3>
		</div>
	</div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import doctypeSchema from '../assets/doctype_schema.json'
import hooksSchema from '../assets/hooks_schema.json'
import { makeServer } from '../server'

const route = useRoute()

const key = uuidv4()
let formKey = ref(0)

// create mirage server
makeServer()

// create hooks data
let schemaData = ref({})
let hooksData = ref({})
onBeforeMount(async () => {
	const doctype = route.params.id.toString()
	const searchParams = new URLSearchParams({ doctype })

	const schemaResponse = await fetch('/api/load_meta?' + searchParams.toString())
	const schemaResponseData: Record<string, any>[] = await schemaResponse.json()
	schemaData.value['schema_fieldset'] = {}
	schemaData.value['schema_fieldset']['schema'] = schemaResponseData

	const hooksResponse = await fetch('/api/load_side_effects?' + searchParams.toString())
	const hooksResponseData: Record<string, any>[] = await hooksResponse.json()
	hooksData.value['side_effects_fieldset'] = {}
	hooksData.value['side_effects_fieldset']['side_effects'] = hooksResponseData

	formKey.value++
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import '../style.css';

.builder-container {
	display: flex;
	flex-direction: column;
	justify-content: start;
	height: 60vh;
}

.builder-schema,
.builder-hooks,
.builder-events {
	border: 2px solid #827553;
	padding: 1em;
	margin-bottom: 1em;
}
</style>
