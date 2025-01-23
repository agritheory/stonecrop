<template>
	<div>Stonecrop Home</div>
	<pre>{{ stonecrop }}</pre>
</template>

<script setup lang="ts">
import { useStonecrop } from '@stonecrop/stonecrop'

const { stonecrop } = useStonecrop()
</script>
