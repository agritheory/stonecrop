<template>
	<router-view></router-view>
</template>

<script setup lang="ts">
import { makeServer } from './server'
makeServer()
</script>
