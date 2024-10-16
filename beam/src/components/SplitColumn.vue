<template>
	<div class="two-column">
		<div class="column column--left">
			<slot name="left"></slot>
		</div>
		<div class="column column--right">
			<slot name="right"></slot>
		</div>
	</div>
</template>
<script setup lang="ts"></script>
<style scoped>
* {
	border: 1px solid red;
}
.two-column {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: baseline;
	gap: 1rem;

	@media screen and (max-width: 600px) {
		flex-direction: column;
	}
}
.column {
	width: 50%;
	box-sizing: border-box;
	padding: 1rem;
	@media screen and (max-width: 600px) {
		width: 100%;
	}
}
.scrollable {
	overflow: scroll;
}
</style>
