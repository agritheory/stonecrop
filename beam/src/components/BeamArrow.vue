<template>
	<div class="beam_metadata_arrow">
		<div class="beam_metadata_arrow-body" :style="{ background: color || '#c4c4c4' }"></div>
		<div class="beam_metadata_arrow-head">
			<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.74 7.78">
				<polygon points="6.74 3.89 0 0 0 7.78 6.74 3.89" style="fill: #c4c4c4" :style="{ fill: color || '#c4c4c4' }" />
			</svg>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps({
	color: String,
})
</script>
<style scoped>
.beam_metadata_arrow {
	align-self: center;
	flex-grow: 1;
	position: relative;
	display: flex;
	align-items: center;
}
.beam_metadata_arrow-body {
	width: 100%;
	height: 10px;
	background: #c4c4c4;
}
.beam_metadata_arrow-head {
	& svg {
		width: 20px;
		display: block;
	}
}
</style>
