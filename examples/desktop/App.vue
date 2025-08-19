<template>
	<router-view v-slot="{ Component }">
		<transition name="slide-up">
			<keep-alive>
				<component :is="Component" />
			</keep-alive>
		</transition>
	</router-view>
</template>
