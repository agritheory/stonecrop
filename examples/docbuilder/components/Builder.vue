<template>
	<div class="builder-container">
		<div class="builder-schema">
			<h3>Schema</h3>
			<AForm class="aform-main" :schema="basic_table_schema" :data="http_logs" :key="key" />
			<!-- <SheetNav class="sheet-nav-footer" /> -->
		</div>
		<div class="builder-hooks">
			<h3>Side Effects</h3>
			<AForm class="aform-main" :key="formKey" :schema="hooks" :data="hooksData" />
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

import basic_table_schema from '../assets/basic_table_schema.json'
import hooks from '../assets/hooks.json'
import http_logs from '../assets/http_logs.json'
import { makeServer } from '../server'

const route = useRoute()

const key = uuidv4()
let formKey = ref(0)

// create mirage server
makeServer()

// create hooks data
let hooksData = ref({})
onBeforeMount(async () => {
	const doctype = route.params.id.toString()
	const searchParams = new URLSearchParams({ doctype })
	const response = await fetch('/api/load_side_effects?' + searchParams.toString())
	const data: Record<string, any>[] = await response.json()

	hooksData.value['side_effects_fieldset'] = {}
	hooksData.value['side_effects_fieldset']['side_effects'] = data
	formKey.value++
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import '../style.css';
</style>
