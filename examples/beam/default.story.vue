<template>
	<Story>
		<Variant>
			<BeamModal @confirmmodal="confirmModal" @closemodal="closeModal" :showModal="showModal">
				<Confirm @confirmmodal="confirmModal" @closemodal="closeModal" />
			</BeamModal>

			<Navbar @click="handlePrimaryAction">
				<template #title>
					<h1 class="nav-title">Items to Receive</h1>
				</template>
				<template #navbaraction>Done</template>
			</Navbar>

			<ListView :items="items" @scrollbottom="loadMoreItems" />
			<ActionFooter @click="handlePrimaryAction">Done</ActionFooter>
			<ScanInput :scanHandler="incrementItemCount" />
			<BeamModalOutlet @confirmmodal="confirmModal" @closemodal="closeModal"></BeamModalOutlet>
		</Variant>
		<Variant title="Metadata">
			<template #controls>
				<HstText v-model="workOrder.orderNumber" title="Order Number" />
				<HstText v-model="workOrder.product" title="Product" />
				<HstNumber v-model="workOrder.quantity" :step="1" title="Quantity" />
				<HstNumber v-model="workOrder.total" title="Total" />
				<HstCheckbox v-model="workOrder.complete" title="Completed" />
			</template>
			<BeamMetadata :order="workOrder">
				<template #components>
					<ListView :items="items" @scrollbottom="loadMoreItems" />
				</template>
			</BeamMetadata>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

import items from './data/items.json'

const workOrder = reactive({
	orderNumber: 'WO#2024-01-00001',
	product: 'Ambrosia Pie',
	quantity: 0,
	total: 20,
	complete: false,
})

const showModal = ref(false)

const handlePrimaryAction = () => {
	showModal.value = true
}

const incrementItemCount = (barcode: string, qty: number) => {
	// return indices of the matching barcode
	const detectedItemsByIndex = items
		.map((item, index) => (item.barcode === barcode ? index : null))
		.filter(x => x !== null)

	for (const [detectedIndex, rowIndex] of detectedItemsByIndex.entries()) {
		if (rowIndex) {
			const count = items[rowIndex].count
			if (detectedIndex !== detectedItemsByIndex.length - 1) {
				if (count.count < count.of) {
					// don't overcount if its not the last row of that barcode
					count.count = count.count + qty
					break
				} else {
					continue
				}
			} else {
				// set it in the last item anyway
				count.count = count.count + qty
				break
			}
		}
	}
}

const loadMoreItems = () => {
	if (items.length > 40) {
		// an arbitrary number for this example
		return
	}

	window.setTimeout(() => {
		// fake an API response time
		items.push(
			...[
				{
					barcode: '6281478257437327897',
					label: 'Item 1 Long Title: Including Subtitle to demonstrate ellipsis',
					description: 'iPhone this and that',
					count: { count: 0, of: 3 },
					linkComponent: 'ListAnchor',
					route: '/item1',
				},
				{
					label: 'Item 2',
					description: 'More descriptions of stuff',
					count: { count: 3, of: 3 },
					linkComponent: 'ListAnchor',
					route: '/item2',
				},
				{
					label: 'Item 3',
					description: '',
					count: { count: 1, of: 6 },
					linkComponent: 'ListAnchor',
					route: '/item3',
				},
				{
					label: 'Item 4',
					description:
						"iPhone this and that plus even more text to demonstrate ellipsis and great savings! on things you can't see or touch",
					count: { count: 0, of: 3 },
					linkComponent: 'div',
					route: '/item4',
					barcode: '5564269659609843627',
				},
				{
					barcode: '6281478257437327897',
					label: 'Item 1',
					description: 'iPhone this and that',
					count: { count: 0, of: 2 },
					linkComponent: 'ListAnchor',
					route: '/item1',
				},
			]
		)
	}, 300)
}

const confirmModal = () => (showModal.value = false)
const closeModal = () => (showModal.value = false)
</script>

<style>
@import url('@stonecrop/beam/styles');
</style>
