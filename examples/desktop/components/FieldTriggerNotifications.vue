<template>
	<Teleport to="body">
		<div v-if="notifications.length > 0" class="notification-container">
			<TransitionGroup name="notification" tag="div">
				<div
					v-for="notification in notifications"
					:key="notification.id"
					:class="['notification', `notification-${notification.type}`]">
					<div class="notification-icon">
						<span v-if="notification.type === 'success'">✅</span>
						<span v-else-if="notification.type === 'warning'">⚠️</span>
						<span v-else-if="notification.type === 'error'">❌</span>
						<span v-else>ℹ️</span>
					</div>
					<div class="notification-content">
						<p class="notification-message">{{ notification.message }}</p>
						<p class="notification-time">{{ formatTime(notification.timestamp) }}</p>
					</div>
					<button class="notification-close" @click="removeNotification(notification.id)">×</button>
				</div>
			</TransitionGroup>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'
import { notifications as notificationStore } from '../actions'

// Create a reactive reference to the notifications
const notifications = reactive(notificationStore)

function removeNotification(id: string) {
	const index = notificationStore.findIndex(n => n.id === id)
	if (index > -1) {
		notificationStore.splice(index, 1)
	}
}

function formatTime(timestamp: Date): string {
	return timestamp.toLocaleTimeString()
}

// Keep the component reactive to notifications array changes
let pollInterval: number | undefined

onMounted(() => {
	// Poll for changes (in a real app, you might use a more sophisticated reactivity system)
	pollInterval = setInterval(() => {
		// The reactive proxy will automatically trigger updates
	}, 100) as any
})

onUnmounted(() => {
	if (pollInterval) {
		clearInterval(pollInterval)
	}
})
</script>

<style scoped>
.notification-container {
	position: fixed;
	top: 20px;
	right: 20px;
	z-index: 400;
	max-width: 400px;
	pointer-events: none;
}

.notification {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	background: var(--sc-form-background);
	border-radius: 8px;
	padding: 16px;
	margin-bottom: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	border-left: 4px solid var(--sc-form-border);
	pointer-events: auto;
	max-width: 400px;
	word-wrap: break-word;
}

.notification-info {
	border-left-color: var(--sc-primary-color);
	background: var(--sc-color-changed);
}

.notification-success {
	border-left-color: var(--sc-brand-success);
	background: var(--sc-form-background);
}

.notification-warning {
	border-left-color: var(--sc-brand-warning);
	background: var(--sc-form-background);
}

.notification-error {
	border-left-color: var(--sc-brand-danger);
	background: var(--sc-form-background);
}

.notification-icon {
	font-size: 18px;
	line-height: 1;
	flex-shrink: 0;
}

.notification-content {
	flex: 1;
	min-width: 0;
}

.notification-message {
	margin: 0 0 4px 0;
	font-size: 14px;
	font-weight: 500;
	color: var(--sc-gray-80);
	line-height: 1.4;
}

.notification-time {
	margin: 0;
	font-size: 12px;
	color: var(--sc-input-label-color);
}

.notification-close {
	background: none;
	border: none;
	font-size: 18px;
	color: var(--sc-gray-50);
	cursor: pointer;
	padding: 0;
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.notification-close:hover {
	color: var(--sc-input-label-color);
}

/* Transitions */
.notification-enter-active,
.notification-leave-active {
	transition: all 0.3s ease;
}

.notification-enter-from {
	opacity: 0;
	transform: translateX(100%);
}

.notification-leave-to {
	opacity: 0;
	transform: translateX(100%);
}

.notification-move {
	transition: transform 0.3s ease;
}
</style>
