<template>
	<Layout
		class="aform-main"
		:schema="schema"
		:data="data"
		:key="id"
	/>
	
</template>
<script>
import Layout from './../src/components/Layout.vue'

export default {
	name: "Dev",
	components: { AForm },
	data() {
		return {
			schema : {}
		}
	},
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('../lib/theme/aform.css');
html {
	font-family: Arimo, sans-serif;
	font-size: 11pt;
}
nav {
	min-height: 60px;
	display: flex;
	/* flex-direction: row; */
	flex-direction: row-reverse;
	align-items:center;
	border-bottom: 2px solid var(--primary-color);
	margin: 0px;
	padding-left: 1ch;
	padding-right: 1ch;
}
.aform-main {
	margin-left: 2ch;
	margin-top: 1.15rem;
}
</style>
