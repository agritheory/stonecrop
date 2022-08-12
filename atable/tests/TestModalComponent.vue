<template>
	<input placeholder="test component" />
</template>

<script>
export default {
	name: 'TestModalComponent',
	props: {
		colIndex: {
			type: Number,
			required: false,
			default: 0,
		},
		rowIndex: {
			type: Number,
			required: false,
			default: 0,
		},
		tableid: {
			type: String,
			required: false,
		},
	},
	data() {
		return { dummyData: '' }
	},
}
</script>
<style scoped>
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
