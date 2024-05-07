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
						<div class="login-form-email login-form-element">
							<label id="login-email" for="email" class="aform__field-label">Email</label>
							<input
								id="email"
								class="aform__input-field"
								name="email"
								placeholder="name@example.com"
								type="email"
								auto-capitalize="none"
								auto-complete="email"
								auto-correct="off"
								:disabled="isLoading" />
						</div>

						<div class="login-form-password login-form-element">
							<label id="login-password" for="password" class="aform__field-label">Password</label>
							<input id="password" class="aform__input-field" name="password" type="password" :disabled="isLoading" />
						</div>

						<button class="btn" :disabled="isLoading">
							<span v-if="isLoading" class="material-symbols-outlined loading-icon"> progress_activity </span>
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

<style>
@import url('@/theme/login.css');
</style>
