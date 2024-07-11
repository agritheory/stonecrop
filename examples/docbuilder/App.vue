<template>
	<router-view></router-view>
	<SheetNav />
</template>

<script setup lang="ts">
import { makeServer } from './server'
makeServer()
</script>

<style scoped>
footer {
	position: fixed;
	bottom: 0.75rem;
	background-color: transparent;
	height: 2rem;
	z-index: 100;
	text-align: left;
	font-size: 100%;
	display: flex;
	justify-content: right;
	padding-bottom: 0.2rem;
	margin-right: 1ch;
}
</style>
