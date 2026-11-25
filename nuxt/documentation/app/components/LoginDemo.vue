<script setup lang="ts">
import { ref } from 'vue'
import { Login, useLoginPreset } from '@stonecrop/aform'

const { identity, headerSubtitle } = useLoginPreset('username')

const lastEvent = ref<string | null>(null)

async function authenticate(_username: string, password: string) {
	await new Promise<void>(resolve => setTimeout(resolve, 300))
	if (password !== 'password') {
		throw new Error('invalid credentials')
	}
}

function onFailed(error: unknown) {
	lastEvent.value = error instanceof Error ? error.message : 'Sign-in failed'
}
</script>

<template>
	<div class="stonecrop-demo">
		<Login
			:identity="identity"
			:header-subtitle="headerSubtitle"
			:authenticate="authenticate"
			@login-success="lastEvent = 'Signed in'"
			@login-failed="onFailed" />
		<p v-if="lastEvent" class="stonecrop-demo__state">
			Last emit: <strong>{{ lastEvent }}</strong>
		</p>
		<p class="stonecrop-demo__hint">Password <code>password</code> succeeds; anything else fails.</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
.stonecrop-demo__hint {
	margin: 0.75rem 0 0;
	font-size: 0.85em;
	opacity: 0.85;
}
</style>
