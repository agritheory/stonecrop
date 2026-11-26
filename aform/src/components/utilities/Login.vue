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
							<div class="login-form-password__control">
								<input
									id="password"
									ref="passwordInput"
									v-model="password"
									class="aform_input-field login-form-password__input"
									name="password"
									:type="passwordVisible ? 'text' : 'password'"
									autocomplete="current-password"
									:disabled="isLoading" />
								<button
									id="login-password-toggle"
									type="button"
									class="login-form-password__toggle"
									:aria-pressed="passwordVisible"
									aria-label="Show password"
									:disabled="isLoading"
									@click="passwordVisible = !passwordVisible">
									<svg
										v-if="!passwordVisible"
										class="login-form-password__icon"
										viewBox="0 0 24 24"
										aria-hidden="true"
										focusable="false">
										<path
											fill="currentColor"
											d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
									</svg>
									<svg
										v-else
										class="login-form-password__icon"
										viewBox="0 0 24 24"
										aria-hidden="true"
										focusable="false">
										<path
											fill="currentColor"
											d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zM11.84 9.02l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
									</svg>
								</button>
							</div>
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
const passwordVisible = ref(false)
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

.login-form-password__control {
	position: relative;
}

.login-form-password__input {
	padding-right: 2.5rem;
}

/* Edge adds its own reveal button to password fields; hide it so Login's toggle is the only one and can't disagree with it. */
.login-form-password__input::-ms-reveal {
	display: none;
}

.login-form-password__toggle {
	position: absolute;
	right: 0.25rem;
	top: 50%;
	transform: translateY(-50%);
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2rem;
	height: 2rem;
	padding: 0;
	margin: 0;
	border: none;
	background: transparent;
	color: var(--sc-input-label-color);
	cursor: pointer;

	&:hover:not(:disabled) {
		color: var(--sc-input-active-label-color);
	}

	&:disabled {
		cursor: default;
		opacity: 0.5;
	}
}

.login-form-password__icon {
	width: 1.25rem;
	height: 1.25rem;
	display: block;
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
