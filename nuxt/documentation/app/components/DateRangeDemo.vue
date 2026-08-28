<script setup lang="ts">
import { ref } from 'vue'
import { ADateRange } from '@stonecrop/aform'

const reportingPeriod = ref({ start_date: null, end_date: null })
</script>

<template>
	<div class="stonecrop-demo">
		<ADateRange v-model="reportingPeriod" label="Reporting Period" uuid="date-range-demo" mode="edit" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ reportingPeriod }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
