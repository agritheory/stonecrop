<template>
	<div class="card-grid">
		<slot />
	</div>
</template>

<style scoped>
.card-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	margin: 2rem 0;
}

@media (max-width: 640px) {
	.card-grid {
		grid-template-columns: 1fr;
	}
}
</style>
