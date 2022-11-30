<template>
	<Story title="NodeEditor">
		<NodeEditor />
	</Story>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import NodeEditor from '@/components/NodeEditor.vue'
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
* {
	margin: 0;
}
html,
body {
	height: 100%;
	font-family: Arimo, sans-serif;
	font-size: 11pt;
}
</style>
