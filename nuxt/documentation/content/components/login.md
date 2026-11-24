---
title: Login
description: Username or email password sign-in with an optional alternateSignIn slot.
---

# Login

`Login` is a self-contained identity/password sign-in form — a standalone utility component, not a schema-driven [AForm](/reference/aform) field. It manages credentials internally, awaits a required `authenticate` callback on submit, and emits `loginSuccess` or `loginFailed`. Use `loginIdentities` or `useLoginPreset` from the [aform API reference](/reference/aform) for email vs username field wiring.

## Import

```ts
import { Login, loginIdentities, useLoginPreset } from '@stonecrop/aform'
```

## Basic

`useLoginPreset`, `authenticate`, and the success/failed emits. No slot.

::demo-panel
:::client-only
:login-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Login, useLoginPreset } from '@stonecrop/aform'

const { identity, headerSubtitle } = useLoginPreset('username')

const lastEvent = ref<string | null>(null)

async function authenticate(username: string, password: string) {
	await new Promise<void>(resolve => setTimeout(resolve, 300))
	if (password !== 'password') {
		throw new Error('invalid credentials')
	}
	void username
}
</script>

<template>
	<div class="stonecrop-demo">
		<Login
			:identity="identity"
			:header-subtitle="headerSubtitle"
			:authenticate="authenticate"
			@login-success="lastEvent = 'loginSuccess'"
			@login-failed="lastEvent = 'loginFailed'" />
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
```
::

## Alternate sign-in slot

Optional `#alternateSignIn` content renders below the submit button—for magic link, SAML, OIDC, or other host-owned flows. `Login` does not implement those paths; the slot is only a layout hook.

::demo-panel
:::client-only
:login-alternate-sign-in-demo
:::

#code
```vue
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
```
::

Use `type="button"` on controls inside the `<form>` so clicks do not submit the password form.

## Presets

```ts
useLoginPreset('username')
useLoginPreset('email')
```

Or pass a custom `LoginIdentity` object if neither preset fits.

## API Reference

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`identity`', '`LoginIdentity`', '—', 'Required. Label, input type, autocomplete, name, and optional placeholder for the identity field.']
  - ['`authenticate`', '`(identity: string, password: string) => Promise<void>`', '—', 'Required. Reject the promise to emit `loginFailed`.']
  - ['`headerTitle`', '`string`', "`'Login'`", 'Heading text above the form.']
  - ['`headerSubtitle`', '`string`', '—', 'Optional subheading; `useLoginPreset` supplies copy per preset.']
---
::

### Slots

::api-data-table
---
headers: ['Name', 'Description']
rows:
  - ['`alternateSignIn`', 'Rendered below the submit button. Host-owned secondary sign-in controls.']
---
::

### Emits

::api-data-table
---
headers: ['Name', 'Payload', 'Description']
rows:
  - ['`loginSuccess`', 'none', 'Emitted after `authenticate` resolves.']
  - ['`loginFailed`', 'none', 'Emitted after `authenticate` rejects.']
---
::

Neither identity nor password is exposed to the parent as props or v-models; only `authenticate` receives them on submit.

## Accessibility

Identity and password inputs use matching `id`/`for` on labels. Submit is disabled until both fields are non-empty and while `authenticate` is in flight (spinner + disabled state).

Source: [`aform/src/components/utilities/Login.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/utilities/Login.vue)