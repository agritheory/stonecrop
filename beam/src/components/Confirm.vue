<template>
	<div class="beam_modal-confirm">
		<h2>Would you like to continue?</h2>
		<button class="beam_btn" @click="$emit('confirmmodal')">Yes</button>
		<button class="beam_btn" @click="$emit('closemodal')">No</button>
	</div>
</template>
