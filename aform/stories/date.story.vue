<template>
	<Story title="ADatePicker">
		<ADatePicker v-model="unsetDate" />
		<ADatePicker v-model="defaultDate" />
	</Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const unsetDate = ref()
const defaultDate = ref(new Date().setDate(new Date().getDate() - 2))
</script>
