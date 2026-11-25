<template>
	<div class="login-container">
		<div>
			<div class="account-container">
				<div class="account-header">
					<h1 id="account-title">{{ headerTitle }}</h1>
					<p v-if="headerSubtitle" id="account-subtitle">{{ headerSubtitle }}</p>
				</div>

				<form @submit="onSubmit">
					<div class="login-form-container">
						<div class="login-form-identity aform_form-element">
							<label :id="`login-${identity.name}`" :for="identity.name" class="aform_field-label">{{
								identity.label
							}}</label>
							<input
								:id="identity.name"
								v-model="identityValue"
								class="aform_input-field"
								:name="identity.name"
								:placeholder="identity.placeholder"
								:type="identity.inputType"
								:autocomplete="identity.autocomplete"
								autocapitalize="none"
								autocorrect="off"
								:disabled="isLoading" />
						</div>

						<div class="login-form-password aform_form-element">
							<label id="login-password" for="password" class="aform_field-label">Password</label>
							<input
								id="password"
								ref="passwordInput"
								v-model="password"
								class="aform_input-field"
								name="password"
								type="password"
								autocomplete="current-password"
								:disabled="isLoading" />
						</div>

						<button type="submit" class="btn" :disabled="isLoading || !identityValue || !password">
							<span v-if="isLoading" class="loading-icon" aria-hidden="true" />
							<span id="login-form-button">Login</span>
						</button>
					</div>
				</form>

				<div v-if="$slots.alternateSignIn" class="login-alternate">
					<slot name="alternateSignIn" :identity="identityValue" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'

import type { LoginIdentity } from '../../login/loginIdentity'

const {
	headerTitle = 'Login',
	headerSubtitle,
	identity,
	authenticate,
} = defineProps<{
	headerTitle?: string
	headerSubtitle?: string
	identity: LoginIdentity
	authenticate: (identity: string, password: string) => Promise<void>
}>()

const emit = defineEmits<{
	loginFailed: [error: unknown]
	loginSuccess: []
}>()

defineSlots<{
	alternateSignIn?: (props: { identity: string }) => unknown
}>()

const identityValue = ref('')
const password = ref('')
const isLoading = ref(false)
const passwordInput = useTemplateRef<HTMLInputElement>('passwordInput')

async function onSubmit(event: Event) {
	event.preventDefault()
	isLoading.value = true
	try {
		await authenticate(identityValue.value, password.value)
		emit('loginSuccess')
	} catch (error) {
		// The fields are disabled while signing in, which takes the cursor out of them: put it back in the password,
		// selected, so it can be retyped at once. Before the emit, so a host can still move it elsewhere.
		isLoading.value = false
		await nextTick()
		passwordInput.value?.focus()
		passwordInput.value?.select()
		emit('loginFailed', error)
	} finally {
		isLoading.value = false
	}
}
</script>

<style scoped>
.login-container {
	width: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-family: var(--sc-font-family);
	background: var(--sc-form-background);
}

.account-container {
	width: 100%;
	margin-left: auto;
	margin-top: 0.5rem;
	margin-right: auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.account-header {
	display: flex;
	flex-direction: column;
	text-align: center;
	margin-top: 0.5rem;
}

#account-title {
	font-size: 1.5rem;
	line-height: 2rem;
	font-weight: 600;
	letter-spacing: -0.025em;
	margin: 0;
}

#account-subtitle {
	font-size: 0.875rem;
	line-height: 1.25rem;
	margin: 1rem;
}

.login-form-container,
.login-alternate {
	display: grid;
	gap: 0.5rem;
}

.login-form-element {
	display: grid;
	margin: 0.5rem 0;
	position: relative;
}
.btn {
	background-color: var(--sc-btn-color);
	color: var(--sc-btn-label-color);
	border: 1px solid var(--sc-btn-border);
	margin: 0.5rem 0;
	padding: 0.25rem;
	position: relative;
	cursor: pointer;

	&:hover {
		background-color: var(--sc-btn-hover);
	}

	&:disabled {
		background-color: var(--sc-input-field-disabled-background);
	}
}
.disabled {
	opacity: 0.5;
}
/* Drawn in CSS: an icon font would show its ligature's name, "progress_activity", wherever the host hasn't loaded it. */
.loading-icon {
	animation: spin 1s linear infinite;
	display: inline-block;
	box-sizing: border-box;
	width: 0.75rem;
	height: 0.75rem;
	margin-right: 0.4rem;
	vertical-align: -0.05rem;
	border: 2px solid currentColor;
	border-right-color: transparent;
	border-radius: 50%;
}

/* ANIMATION */
@keyframes spin {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}
</style>
