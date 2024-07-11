<template>
	<div id="home">
		<pre>{{ stonecrop }}</pre>
		<Fieldtype></Fieldtype>
	</div>
</template>

<script setup lang="ts">
import { useStonecrop } from '@stonecrop/stonecrop'

import Fieldtype from './Fieldtype.vue'

const { stonecrop } = useStonecrop()
</script>
