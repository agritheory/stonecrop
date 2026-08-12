<template>
	<div class="card-grid">
		<slot />
	</div>
</template>

<style scoped>
.card-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;
	margin: 2rem 0;
}
</style>
