<script setup lang="ts">
import { ref } from 'vue'
import { Login, useLoginPreset } from '@stonecrop/aform'

const { identity, headerSubtitle } = useLoginPreset('email')

const alternateMessage = ref<string | null>(null)

async function authenticate(email: string, password: string) {
	void email
	void password
	alternateMessage.value = null
	await new Promise<void>(resolve => setTimeout(resolve, 200))
}
</script>

<template>
	<div class="stonecrop-demo">
		<Login
			:identity="identity"
			:header-subtitle="headerSubtitle"
			:authenticate="authenticate"
			@login-success="alternateMessage = null">
			<template #alternateSignIn>
				<button type="button" class="btn" @click="alternateMessage = 'Magic link requested (host-owned).'">
					Email me a magic link
				</button>
				<button type="button" class="btn" @click="alternateMessage = 'SSO redirect (host-owned).'">
					Sign in with SSO
				</button>
			</template>
		</Login>
		<p v-if="alternateMessage" class="stonecrop-demo__state">{{ alternateMessage }}</p>
		<p class="stonecrop-demo__hint">
			Slot controls use <code>type="button"</code> so they never submit the password form.
		</p>
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
