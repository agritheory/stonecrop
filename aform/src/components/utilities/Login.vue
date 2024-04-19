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
						<div class="login-form-email">
							<label id="login-email" for="email">Email</label>
							<input
								id="email"
								name="email"
								placeholder="name@example.com"
								type="email"
								auto-capitalize="none"
								auto-complete="email"
								auto-correct="off"
								:disabled="isLoading" />
						</div>

						<div class="login-form-password">
							<label id="login-password" for="password">Password</label>
							<input id="password" name="password" type="password" :disabled="isLoading" />
						</div>

						<button :disabled="isLoading">
							<span id="login-form-button">Login</span>
						</button>
					</div>
				</form>

				<button>
					<span id="forgot-password-button">Forgot password?</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
	defineProps<{
		headerTitle?: string
		headerSubtitle?: string
	}>(),
	{
		headerTitle: 'Login',
		headerSubtitle: 'Enter your email and password to login',
	}
)

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

.login-form-email,
.login-form-password {
	display: grid;
	gap: 0.25rem;
}

#login-email,
#login-password {
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

#login-form-button {
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

#forgot-password-button {
	/* TODO: add styling for button */
}
</style>
