<template>
	<Story title="Doctype">
		<router-view v-slot="{ Component, route }">
			<transition :name="route.meta.transition || 'slide-up'">
				<component :is="Component" />
			</transition>
		</router-view>
		<SheetNav />
	</Story>
</template>

<script setup lang="ts"></script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
* {
	margin: 0;
}

html,
body {
	height: 100%;
	font-family: Arimo, sans-serif;
	font-size: 11pt;
}
</style>
