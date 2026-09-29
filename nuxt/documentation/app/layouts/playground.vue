<template>
	<div class="playground-shell">
		<slot />
	</div>
</template>

<style scoped>
/* Viewport-bound shell so Desktop routes scroll inside .desktop__main (same flex chain as DocBuilder). */
.playground-shell {
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	height: 100dvh;
	min-height: 100dvh;
	overflow: hidden;
}
</style>
