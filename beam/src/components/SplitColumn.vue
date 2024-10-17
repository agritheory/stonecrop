<template>
	<div
		class="two-column"
		:style="{ justifyContent: justifyContent || 'space-between', alignItems: alignItems || 'baseline' }">
		<div class="column column--left" :style="{ textAlign: leftColumnAlign || 'left' }">
			<slot name="left"></slot>
		</div>
		<div class="column column--right" :style="{ textAlign: rightColumnAlign || 'left' }">
			<slot name="right"></slot>
		</div>
	</div>
</template>
<script setup lang="ts">
const props = defineProps<{
	justifyContent?: String
	alignItems?: String
	leftColumnAlign?: String
	rightColumnAlign?: String
}>()
</script>
<style scoped>
.two-column {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: baseline;

	@media screen and (max-width: 600px) {
		flex-direction: column;
	}
}
.column {
	box-sizing: border-box;
	@media screen and (max-width: 600px) {
		width: 100%;
	}
}

.scrollable {
	overflow: scroll;
}
.align-right {
	text-align: right;
}
.align-center {
	text-align: center;
}
</style>
