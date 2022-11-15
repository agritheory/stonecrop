<template>
	<div class="builder-container">
		<div class="builder-schema">
			<h3>Schema</h3>
			<AForm class="aform-main" :schema="basic_table_schema" :data="http_logs" :key="key" />
			<!-- <SheetNav class="sheet-nav-footer" /> -->
		</div>
		<div class="builder-hooks">
			<h3>Side Effects</h3>
			<AForm class="aform-main" :key="hooksData" :schema="hooks" :data="hooksData" />
		</div>
		<div class="builder-events">
			<h3>Events</h3>
		</div>
	</div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { onMounted, ref } from 'vue'

import basic_table_schema from './assets/basic_table_schema.json'
import hooks from './assets/hooks.json'
import http_logs from './assets/http_logs.json'
import { makeServer } from './server'

const key = uuidv4()

// create mirage server
makeServer()

// create hooks data
let hooksData = ref([])
onMounted(async () => {
	const searchParams = new URLSearchParams({ doctype: 'Sales Order' })
	const response = await fetch('/api/load_hooks?' + searchParams.toString())
	const data: Record<string, string[]> = await response.json()

	for (const [event, callbacks] of Object.entries(data)) {
		if (Array.isArray(callbacks)) {
			hooksData.value.push({
				event_name: event,
				callback: JSON.stringify(callbacks, null, 2),
			})
		}
	}
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import './style.css';

html,
body {
	height: 100%;
	font-family: Arimo, sans-serif;
	font-size: 11pt;
}

nav {
	min-height: 60px;
	display: flex;
	/* flex-direction: row; */
	flex-direction: row-reverse;
	align-items: center;
	border-bottom: 2px solid var(--primary-color);
	margin: 0px;
	padding-left: 1ch;
	padding-right: 1ch;
}

.builder-container {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 40vh;
}

.builder-schema,
.builder-hooks,
.builder-events {
	border: 2px solid #827553;
	padding: 1em;
}

.collapse-button {
	background-color: transparent;
	border: none;
	float: right;
	font-size: 150%;
	margin-top: -0.5rem;
	min-width: calc(66px - 4ch);
	text-align: center;
	width: 2ch;
}

.rotated {
	transform: rotate(45deg);
	-webkit-transform: rotate(45deg);
	-moz-transform: rotate(45deg);
	-ms-transform: rotate(45deg);
	-o-transform: rotate(45deg);
	transition: transform 250ms;
	transform-origin: center center;
}

.unrotated {
	transform: rotate(0deg);
	-webkit-transform: rotate(0deg);
	-moz-transform: rotate(0deg);
	-ms-transform: rotate(0deg);
	-o-transform: rotate(0deg);
	transition: transform 250ms;
}
</style>
