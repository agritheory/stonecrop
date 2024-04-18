<template>
	<div class="login-container">
		<span>Login</span>

		<div class="entity-container">
			<div id="entity">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					class="mr-2 h-6 w-6">
					<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
				</svg>
				{{ entityName }}
			</div>
		</div>

		<div>
			<div class="account-container">
				<div class="account-header">
					<h1 id="account-title">Create an account</h1>
					<p id="account-subtitle">Enter your email below to create your account</p>
				</div>

				<form @submit="onSubmit">
					<div class="login-form-container">
						<div class="login-form-email">
							<label id="login-email" for="email">Email</label>
							<input
								id="email"
								placeholder="name@example.com"
								type="email"
								auto-capitalize="none"
								auto-complete="email"
								auto-correct="off"
								:disabled="isLoading" />
						</div>
						<button :disabled="isLoading">
							<span v-if="isLoading" class="login-form-button">Sign In with Email</span>
						</button>
					</div>
				</form>

				<p id="terms">
					By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
	entityName: string
}>()

const isLoading = ref(false)

function onSubmit(event: Event) {
	event.preventDefault()
	isLoading.value = true

	// TODO: handle submit logic
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
}

.entity-container {
	height: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	padding: 2.5rem;
	color: rgb(255 255 255);
}

#entity {
	position: relative;
	z-index: 20;
	display: flex;
	align-items: center;
	font-size: 1.125rem;
	line-height: 1.75rem;
	font-weight: 500;
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
}

#account-subtitle {
	font-size: 0.875rem;
	line-height: 1.25rem;
}

.login-form-container {
	display: grid;
	gap: 0.5rem;
}

.login-form-email {
	display: grid;
	gap: 0.25rem;
}

#login-email {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}

.login-form-button {
	margin-right: 0.5rem;
	height: 1rem;
	width: 1rem;
	animation: spin 1s linear infinite;

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
}

#terms {
	text-align: center;
	font-size: 0.875rem;
	line-height: 1.25rem;
	padding-left: 2rem;
	padding-right: 2rem;
}
</style>
