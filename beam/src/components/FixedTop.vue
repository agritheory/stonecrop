<template>
	<div class="fixed-top">
		<slot></slot>
	</div>
</template>

<style scoped>
.fixed-top {
	position: sticky;
	top: 0;
	left: 0;
}
</style>
