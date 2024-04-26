<template>
	<div class="beam__modal-confirm">
		<h2>Would you like to continue?</h2>
		<button class="btn" @click="$emit('confirmmodal')">Yes</button>
		<button class="btn" @click="$emit('closemodal')">No</button>
	</div>
</template>
