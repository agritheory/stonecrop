<template>
	<footer class="beam_action-footer">
		<span class="footer-action-wrapper">
			<BeamBtn @click="handleFooterAction">
				<slot />
			</BeamBtn>
		</span>
	</footer>
</template>

<script setup lang="ts">
const emit = defineEmits<{ click: [] }>()

const handleFooterAction = () => {
	emit('click')
}
</script>

<style scoped>
.beam_action-footer {
	margin-left: 0;
	background: linear-gradient(180deg, transparent 0%, white 100%);
	color: var(--sc-primary-text-color);
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 0.625rem;
	text-align: center;
}
</style>
