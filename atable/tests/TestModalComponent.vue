<template>
	<input placeholder="test component" />
</template>

<script setup lang="ts">
defineProps<{
	colIndex?: number
	rowIndex?: number
	tableid?: string
}>()

const dummyData = ref('')
</script>

<style scoped>
@import url('@agritheory/themes/default/default.css');
input {
	position: relative;
	/* width: calc(100% - 4px); */
	border: 1px;
	border-style: solid;
	border-color: var(--cell-border-color);
	border-radius: 0px;
	box-sizing: border-box;
	background-color: inherit;
	outline: none;
	min-height: 1.15em;
	font-size: var(--table-font-size);
}
</style>
