<template>
	<router-view v-slot="{ Component }">
		<transition name="slide-up">
			<keep-alive>
				<component :is="Component" />
			</keep-alive>
		</transition>
	</router-view>

	<!-- Field Trigger Notifications -->
	<FieldTriggerNotifications />
</template>

<script setup lang="ts">
import FieldTriggerNotifications from './components/FieldTriggerNotifications.vue'
</script>
