<script setup lang="ts">
import { ref } from 'vue'
import { ADuration } from '@stonecrop/aform'

const durationMs = ref<number>(0)
</script>

<template>
	<Story title="ADuration">
		<Variant title="Default (edit mode)">
			<ADuration v-model="durationMs" label="Task Duration" />
			<p style="margin-top: 1rem; font-size: 0.9em">
				v-model value: <strong>{{ durationMs }} ms</strong>
			</p>
		</Variant>

		<Variant title="Military time + seconds">
			<ADuration v-model="durationMs" label="Shift Duration" :allow-military-time="true" :use-seconds="true" />
		</Variant>

		<Variant title="Display mode (pre-saved value)">
			<ADuration :model-value="9_000_000" label="Meeting Duration" mode="display" />
		</Variant>

		<Variant title="Read mode">
			<ADuration :model-value="3_661_000" label="Session Duration" mode="read" />
		</Variant>
	</Story>
</template>
