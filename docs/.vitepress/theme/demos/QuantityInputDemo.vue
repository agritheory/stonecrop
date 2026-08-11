<script setup lang="ts">
import { ref } from 'vue'
import { AQuantityInput } from '@stonecrop/aform'

// "Widget" item: stocked in Nos, but this line was purchased/received in Box.
// 1 Box = 10 Nos, 1 Kg = 25 Nos.
const quantityOptions = {
	uoms: ['Nos', 'Box', 'Kg'],
	stockUom: 'Nos',
	conversionFactors: { Box: 10, Kg: 25 },
}

const item = ref({
	qty: 5,
	uom: 'Box',
	stockQty: 50,
	stockUom: 'Nos',
	conversionFactor: 10,
})
</script>

<template>
	<div class="stonecrop-demo">
		<AQuantityInput v-model="item" label="Quantity" uuid="quantity-input-demo" :options="quantityOptions" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ item }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
