<template>
	<Story title="ADatePicker">
		<ADatePicker v-model="unsetDate" />
		<ADatePicker v-model="defaultDate" />
	</Story>
	<Story title="ADate">
		<ADate v-model="defaultDate" />
	</Story>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const unsetDate = ref()
const defaultDate = ref(new Date().setDate(new Date().getDate() - 2))

watch(unsetDate, () => {
	console.log('unsetDate', unsetDate.value)
})
</script>

<style>
@import url('@stonecrop/themes/default/default.css');

.adate {
	margin-right: 2ch;
}
</style>
