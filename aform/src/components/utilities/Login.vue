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
								v-model="email"
								auto-capitalize="none"
								auto-complete="email"
								auto-correct="off"
								:disabled="isLoading" />
						</div>

						<div class="login-form-password login-form-element">
							<label id="login-password" for="password" class="aform__field-label">Password</label>
							<input
								id="password"
								class="aform__input-field"
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

<style>
@import url('@/theme/login.css');
</style>
