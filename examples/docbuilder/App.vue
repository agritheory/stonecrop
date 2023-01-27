<template>
	<router-view></router-view>
	<SheetNav />
</template>

<script setup lang="ts">
import { makeServer } from './server'
makeServer()
</script>
