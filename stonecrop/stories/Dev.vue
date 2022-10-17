<template>
	<router-view v-slot="{ Component, route }">
		<transition :name="route.meta.transition || 'slide-up'">
			<component :is="Component" />
		</transition>
	</router-view>
</template>

<script setup lang="ts"></script>
