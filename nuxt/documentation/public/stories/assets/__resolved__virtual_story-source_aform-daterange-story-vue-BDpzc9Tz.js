const __resolved__virtual_storySource_aformDaterangeStoryVue = `<script setup lang="ts">
import { ref } from 'vue'
import { ADateRange } from '@stonecrop/aform'

const dateRange = ref({ start_date: null, end_date: null })
<\/script>

<template>
	<Story title="ADateRange">
		<Variant title="Default (edit mode)">
			<div style="min-height: 400px; padding: 20px">
				<ADateRange v-model="dateRange" label="Date Range" />
			</div>
			<p style="margin-top: 1rem; font-size: 0.9em">
				v-model: <strong>{{ JSON.stringify(dateRange) }}</strong>
			</p>
		</Variant>

		<Variant title="Read mode">
			<ADateRange :model-value="{ start_date: '2026-01-01', end_date: '2026-01-31' }" label="Date Range" mode="read" />
		</Variant>

		<Variant title="Display mode">
			<ADateRange
				:model-value="{ start_date: '2026-01-01', end_date: '2026-01-31' }"
				label="Date Range"
				mode="display" />
		</Variant>
	</Story>
</template>
`;
export {
  __resolved__virtual_storySource_aformDaterangeStoryVue as default
};
