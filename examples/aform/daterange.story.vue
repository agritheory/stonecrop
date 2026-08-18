<script setup lang="ts">
import { ref } from 'vue'
import { ADateRange } from '@stonecrop/aform'

const dateRange = ref({ start_date: null, end_date: null })
</script>

<template>
	<Story title="ADateRange">
		<Variant title="Default (edit mode)">
			<div class="story-field" style="min-height: 400px">
				<ADateRange v-model="dateRange" label="Date Range" />
			</div>
			<p style="margin-top: 1rem; font-size: 0.9em">
				v-model: <strong>{{ JSON.stringify(dateRange) }}</strong>
			</p>
		</Variant>

		<Variant title="Read mode">
			<div class="story-field">
				<ADateRange
					:model-value="{ start_date: '2026-01-01', end_date: '2026-01-31' }"
					label="Date Range"
					mode="read" />
			</div>
		</Variant>

		<Variant title="Display mode">
			<div class="story-field">
				<ADateRange
					:model-value="{ start_date: '2026-01-01', end_date: '2026-01-31' }"
					label="Date Range"
					mode="display" />
			</div>
		</Variant>
	</Story>
</template>

<style scoped>
.story-field {
	padding: 1rem;
}
</style>
