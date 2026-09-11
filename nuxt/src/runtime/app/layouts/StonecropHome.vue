<template>
	<pre>{{ stonecrop }}</pre>
</template>

<script setup>
import { useStonecrop } from '@stonecrop/stonecrop'
const { stonecrop } = useStonecrop()
</script>
