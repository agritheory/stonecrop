<template>
	<footer class="beam__actionfooter">
		<span class="footer-action-wrapper">
			<button class="footer-action btn" @click="handleFooterAction">
				<slot />
			</button>
		</span>
	</footer>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])

const handleFooterAction = () => {
	emit('click')
}
</script>
