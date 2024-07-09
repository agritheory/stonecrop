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
			<ScanInput @scaninput="handleScanInput($event)" />
			<BeamModalOutlet @confirmmodal="confirmModal" @closemodal="closeModal"></BeamModalOutlet>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import items from './data/items.json'

const showModal = ref(false)

const handleScanInput = (barcode: string) => {
	incrementListItemCountByBarcode(barcode)
}

const handlePrimaryAction = () => {
	showModal.value = true
}

const incrementListItemCountByBarcode = (barcode?: string) => {
	if (!barcode) {
		return
	}

	const detectedItemsByIndex = items
		.map((item, index) => {
			return item.barcode === barcode ? index : undefined
		}) // return indices of matching barcode
		.filter(x => x !== undefined) // remove undefined

	for (const [detectedIndex, rowIndex] of detectedItemsByIndex.entries()) {
		if (rowIndex) {
			if (detectedIndex !== detectedItemsByIndex.length - 1) {
				if (items[rowIndex].count.count < items[rowIndex].count.of) {
					// don't overcount if its not the last row of that barcode
					let incrementedValue = items[rowIndex].count.count + 1
					items[rowIndex].count.count = incrementedValue
					break
				} else {
					continue
				}
			} else {
				// set it in the last item anyway
				let incrementedValue = items[rowIndex].count.count + 1
				items[rowIndex].count.count = incrementedValue
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

const closeModal = () => {
	showModal.value = false
}

const confirmModal = () => {
	showModal.value = false
}
</script>

<style>
@import url('@stonecrop/beam/styles');
</style>
