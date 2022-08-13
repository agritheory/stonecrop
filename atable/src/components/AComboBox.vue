<template>
	<ATableModal :event="event" :cellData="cellData" class="amodal">
		<div>
			<input type="text" />
			<input type="text" />
			<input type="text" />
		</div>
	</ATableModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AComboBox',
	// components: { ATableModal }, // no need to define because its imported globally with the plugin
	props: ['event', 'cellData', 'tableID'],
	created() {
		console.log(this.$props)
	},
})
</script>
