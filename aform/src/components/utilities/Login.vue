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
								v-model="password"
								class="aform_input-field"
								name="password"
								type="password"
								autocomplete="current-password"
								:disabled="isLoading" />
						</div>

						<button type="submit" class="btn" :disabled="isLoading || !identityValue || !password">
							<span v-if="isLoading" class="material-symbols-outlined loading-icon">progress_activity</span>
							<span id="login-form-button">Login</span>
						</button>

						<slot name="alternateSignIn" />
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
	loginFailed: []
	loginSuccess: []
}>()

defineSlots<{
	alternateSignIn?: () => unknown
}>()

const identityValue = ref('')
const password = ref('')
const isLoading = ref(false)

async function onSubmit(event: Event) {
	event.preventDefault()
	isLoading.value = true
	try {
		await authenticate(identityValue.value, password.value)
		emit('loginSuccess')
	} catch {
		emit('loginFailed')
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

.login-form-container {
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
.loading-icon {
	animation: spin 1s linear infinite forwards;
	display: inline-block;
	margin-right: 0.2rem;
	line-height: 0;
	font-size: 1rem;
	position: relative;
	top: 0.2rem;
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
