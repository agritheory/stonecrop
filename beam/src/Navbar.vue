<template>
	<nav class="beam__navbar">
		<slot name="icon">
			<span class="home-icon">&#11043;</span>
		</slot>
		<slot name="title">
			<h1 class="nav-title">TITLE</h1>
		</slot>
		<div class="navbar-action-wrapper">
			<button class="navbar-action" @click="handlePrimaryAction">
				<slot name="navbaraction">Action</slot>
			</button>
		</div>
	</nav>
</template>
<script>
export default {
	name: 'Navbar',
	methods: {
		handlePrimaryAction() {
			this.$emit('click')
		},
	},
}
</script>
