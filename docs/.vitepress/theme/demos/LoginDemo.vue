<script setup lang="ts">
import { ref } from 'vue'
import { Login } from '@stonecrop/aform'

const lastEvent = ref<Record<string, string> | null>(null)

function onLoginSuccess() {
	lastEvent.value = { event: 'loginSuccess', at: new Date().toLocaleTimeString() }
}

function onLoginFailed() {
	lastEvent.value = { event: 'loginFailed', at: new Date().toLocaleTimeString() }
}
</script>

<template>
	<div class="stonecrop-demo">
		<Login @login-success="onLoginSuccess" @login-failed="onLoginFailed" />
		<pre v-if="lastEvent" class="stonecrop-demo__state">{{ lastEvent }}</pre>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
	white-space: pre-wrap;
}
</style>
