<template>
	<div
		class="two-column"
		:style="{ justifyContent: justifyContent || 'space-between', alignItems: alignItems || 'flex-start' }">
		<div class="column column-left">
			<slot name="left"></slot>
		</div>
		<div class="column column-right">
			<slot name="right"></slot>
		</div>
	</div>
</template>
<script setup lang="ts">
const props = defineProps<{
	justifyContent?: String
	alignItems?: String
}>()
</script>
<style scoped>
.two-column {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: baseline;
	gap: 1rem;

	@media screen and (max-width: 400px) {
		flex-direction: column;
		gap: 0;
	}
}
.column {
	flex-grow: 1;
	width: 50%;
	@media screen and (max-width: 400px) {
		width: 100%;
	}
}
.column-right {
	text-align: right;
	@media screen and (max-width: 400px) {
		text-align: left;
	}
}
</style>
