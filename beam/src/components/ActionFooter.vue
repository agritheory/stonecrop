<template>
	<footer class="beam_action-footer">
		<span class="footer-action-wrapper">
			<button class="beam_btn" @click="handleFooterAction">
				<slot />
			</button>
		</span>
	</footer>
</template>

<script setup lang="ts">
const emit = defineEmits<{ click: [] }>()

const handleFooterAction = () => {
	emit('click')
}
</script>
