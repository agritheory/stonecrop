<template>
	<ATableModal :event="event" :cell-data="cellData" class="amodal">
		<div>
			<input type="text" />
			<input type="text" />
			<input type="text" />
		</div>
	</ATableModal>
</template>

<script setup lang="ts">
import type { ComponentProps } from '../../types'

// TODO: change props from individual elements to the store object
// TODO: implement full mode/display support
defineProps<ComponentProps & { event?: any; cellData?: any; tableID?: string }>()
</script>
