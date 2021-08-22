<template>
<input placeholder="test component"/>
</template>

<script>
export default {
	name: 'TestComponent',
	data() {
		return {dummyData: ''}
	}
}
</script>
<style scoped>
input {
	width: calc(100% - 4px);
	border: none;
	background-color: inherit;
	outline: none;
}
</style>