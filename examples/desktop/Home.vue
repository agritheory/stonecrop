<template>
	<div id="home">
		<Desktop :elements="actionElements" />
	</div>
</template>

<script setup lang="ts">
import { actionElements } from './mocks/elements'
</script>
