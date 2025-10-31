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
defineProps(['event', 'cellData', 'tableID'])
</script>
