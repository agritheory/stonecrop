<template>
	<Story title="date">
		<Variant title="ADatePicker">
			<ADatePicker />
			<ADatePicker v-model="defaultDate" />
		</Variant>
		<Variant title="ADate">
			<ADate label="Date" v-model="defaultDate" />
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

.adate {
	margin-right: 2ch;
}
</style>
