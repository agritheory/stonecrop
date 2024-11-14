<template>
	<div class="login-container">
		<div>
			<div class="account-container">
				<div class="account-header">
					<h1 id="account-title">{{ headerTitle }}</h1>
					<p id="account-subtitle">{{ headerSubtitle }}</p>
				</div>

				<form @submit="onSubmit">
					<div class="login-form-container">
						<div class="login-form-email aform_form-element">
							<label id="login-email" for="email" class="aform_field-label">Email</label>
							<input
								id="email"
								class="aform_input-field"
								name="email"
								placeholder="name@example.com"
								type="email"
								v-model="email"
								auto-capitalize="none"
								auto-complete="email"
								auto-correct="off"
								:disabled="isLoading" />
						</div>

						<div class="login-form-password aform_form-element">
							<label id="login-password" for="password" class="aform_field-label">Password</label>
							<input
								id="password"
								class="aform_input-field"
								name="password"
								type="password"
								v-model="password"
								:disabled="isLoading" />
						</div>

						<button class="btn" @click="onSubmit" :disabled="isLoading || !email || !password">
							<span v-if="isLoading" class="material-symbols-outlined loading-icon">progress_activity</span>
							<span id="login-form-button">Login</span>
						</button>
					</div>
				</form>

				<button class="btn">
					<span id="forgot-password-button">Forgot password?</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { headerTitle = 'Login', headerSubtitle = 'Enter your email and password to login' } = defineProps<{
	headerTitle?: string
	headerSubtitle?: string
}>()

const emit = defineEmits(['loginFailed', 'loginSuccess'])

const email = ref('')
const password = ref('')

const isLoading = ref(false)
const loginFailed = ref(false)

function onSubmit(event: Event) {
	event.preventDefault()
	isLoading.value = true

	// TODO: handle submit logic, handle failure

	if (loginFailed.value) {
		isLoading.value = false
		emit('loginFailed')
		return
	}

	isLoading.value = false
	emit('loginSuccess')
}
</script>

<style scoped>
/* @import url('@stonecrop/themes/default.css'); */
.login-container {
	width: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-family: var(--sc-font-family);
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
.login-field {
	padding: 0.5rem 0.25rem 0.25rem 0.5rem;
	outline: 1px solid transparent;
	border: 1px solid var(--sc-input-border-color);
	border-radius: 0.25rem;

	&:focus {
		border: 1px solid black;
	}
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
