<template>
	<Story title="date">
		<Variant title="Date Input">
			<ADate label="Date" v-model="defaultDate" />
		</Variant>
		<Variant title="Date Picker">
			<h3>Default Date</h3>
			<ADatePicker />
			<h3>Custom Date</h3>
			<ADatePicker v-model="defaultDate" />
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const twoDaysAgo = new Date().setDate(new Date().getDate() - 2)
const defaultDate = ref(new Date(twoDaysAgo))
</script>

<style>
@import url('@stonecrop/themes/default/default.css');

.adate,
.adatepicker {
	margin-right: 5ch;
}
</style>
