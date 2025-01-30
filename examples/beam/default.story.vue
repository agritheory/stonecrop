<template>
	<Story>
		<Variant title="default">
			<BeamModal @confirmmodal="confirmModal" @closemodal="closeModal" :showModal="showModal">
				<Confirm @confirmmodal="confirmModal" @closemodal="closeModal" />
			</BeamModal>

			<Navbar @click="handlePrimaryAction">
				<template #title>
					<BeamHeading>Items to Receive</BeamHeading>
				</template>
				<template #navbaraction>Done</template>
			</Navbar>

			<ListView :items="items" @scrollbottom="loadMoreItems" />
			<ActionFooter @click="handlePrimaryAction">Done</ActionFooter>
			<ScanInput :scanHandler="incrementItemCount" />
			<BeamModalOutlet @confirmmodal="confirmModal" @closemodal="closeModal"></BeamModalOutlet>
		</Variant>

		<Variant title="metadata">
			<template #controls>
				<HstText v-model="workOrder.orderNumber" title="Order Number" />
				<HstText v-model="workOrder.product" title="Product" />
				<HstNumber v-model="workOrder.quantity" :step="1" title="Quantity" />
				<HstNumber v-model="workOrder.total" title="Total" />
				<HstCheckbox v-model="workOrder.complete" title="Completed" />
			</template>

			<BeamMetadata :order="workOrder">
				<div class="beam_metadata_block">
					<SplitColumn>
						<template #left>
							<BeamHeading>
								{{ workOrder.orderNumber }} <span class="beam--normal">{{ workOrder.product }}</span>
							</BeamHeading>
						</template>
						<template #right>
							<ItemCount :denominator="workOrder.total" v-model="workOrder.quantity" />
						</template>
					</SplitColumn>
					<BeamProgress :complete="workOrder.complete" progress-message="In Transit" />
					<SplitColumn>
						<template #left>
							<p class="beam_metadata_heading">Source</p>
						</template>
						<template #right>
							<p class="beam_metadata_heading">Receiving</p>
						</template>
					</SplitColumn>
				</div>
			</BeamMetadata>
		</Variant>

		<Variant title="list with day-divider">
			<BeamModal @confirmmodal="confirmModal" @closemodal="closeModal" :showModal="showModal">
				<Confirm @confirmmodal="confirmModal" @closemodal="closeModal" />
			</BeamModal>

			<Navbar @click="handlePrimaryAction">
				<template #title>
					<BeamHeading>Items to Receive</BeamHeading>
				</template>
				<template #navbaraction>Done</template>
			</Navbar>

			<ListView :items="itemsWithDivider" @scrollbottom="loadMoreItems" />
			<ActionFooter @click="handlePrimaryAction">Done</ActionFooter>
			<ScanInput :scanHandler="incrementItemCount" />
			<BeamModalOutlet @confirmmodal="confirmModal" @closemodal="closeModal"></BeamModalOutlet>
		</Variant>

		<Variant title="toast">
			<template #controls>
				<HstText v-model="toastMsg" title="Toast Message" />
				<HstSelect
					v-model="toastType"
					:title="'Type'"
					:options="{
						default: 'default',
						success: 'success',
						error: 'error',
						warning: 'warning',
					}" />
				<HstSelect
					v-model="toastPosition"
					:title="'Position'"
					:options="{
						top: 'top',
						'top-right': 'top-right',
						'top-left': 'top-left',
						bottom: 'bottom',
						'bottom-right': 'bottom-right',
						'bottom-left': 'bottom-left',
					}" />
				<HstSlider v-model="toastTime" :step="0.5" :min="0" :max="20" title="Duration (Seconds)" />
			</template>
			<BeamModal @confirmmodal="confirmModal" @closemodal="closeModal" :showModal="showModal">
				<Confirm @confirmmodal="confirmModal" @closemodal="closeModal" />
			</BeamModal>
			<Navbar @click="showNotification">
				<template #title>
					<BeamHeading>Items to Receive</BeamHeading>
				</template>
				<template #navbaraction>Show Notification</template>
			</Navbar>
		</Variant>

		<Variant title="list filters">
			<FixedTop>
				<Navbar @click="handlePrimaryAction">
					<template #title>
						<BeamHeading>Items to Receive</BeamHeading>
					</template>
					<template #navbaraction>Done</template>
				</Navbar>
				<BeamFilter>
					<BeamFilterOption
						:title="'Status'"
						:choices="[
							{ label: 'All', value: 'all' },
							{ label: 'Complete', value: 'complete' },
							{ label: 'Incomplete', value: 'incomplete' },
						]"
						@select="filterItems" />
					<BeamFilterOption
						:title="'Delivery Start Date'"
						:choices="[
							{ label: 'All', value: 'all' },
							{ label: 'Past', value: 'past' },
							{ label: 'Today', value: 'today' },
							{ label: 'Future', value: 'future' },
						]" />
				</BeamFilter>
			</FixedTop>

			<ListView :items="items" @scrollbottom="loadMoreItems" />
			<ActionFooter @click="handlePrimaryAction">Done</ActionFooter>
			<ScanInput :scanHandler="incrementItemCount" />
			<BeamModalOutlet @confirmmodal="confirmModal" @closemodal="closeModal"></BeamModalOutlet>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import type { BeamFilterChoice, ListViewItem } from '@stonecrop/beam'
import { ref, reactive, computed } from 'vue'
import { type ToastPosition, useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'

import data from './data/items.json'

const items = ref<ListViewItem[]>(data)
const showModal = ref(false)
const workOrder = reactive({
	orderNumber: 'WO#2024-01-00001',
	product: 'Ambrosia Pie',
	quantity: 0,
	total: 20,
	complete: false,
})

// Start Toast //
const toast = useToast()
const toastType = ref('default')
const toastTime = ref(3)
const toastMsg = ref('Toast Message.')
const toastPosition = ref<ToastPosition>('top')

const showNotification = () => {
	toast.open({
		message: toastMsg.value,
		type: toastType.value,
		position: toastPosition.value,
		duration: toastTime.value * 1000,
	})
}
// End Toast //

const itemsWithDivider = computed(() => {
	const itemsCopy = [...items.value]
	itemsCopy.splice(3, 0, {
		date: '2024-11-12T00:00:00.000Z',
		linkComponent: 'BeamDayDivider',
		dateFormat: 'default',
	})
	itemsCopy.splice(7, 0, {
		date: '2024-10-18T00:00:00.000Z',
		linkComponent: 'BeamDayDivider',
		dateFormat: 'iso',
	})
	return itemsCopy
})

const incrementItemCount = (barcode: string, qty: number) => {
	// return indices of the matching barcode
	const detectedItemsByIndex = items.value
		.map((item, index) => (item.barcode === barcode ? index : null))
		.filter(x => x !== null)

	for (const [detectedIndex, rowIndex] of detectedItemsByIndex.entries()) {
		if (rowIndex) {
			const count = items.value[rowIndex].count
			if (!count) continue
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

const filterItems = (choice: BeamFilterChoice) => {
	if (choice.value === 'all') {
		items.value = data
	} else if (choice.value === 'complete') {
		items.value = data.filter(item => item.count.count === item.count.of)
	} else if (choice.value === 'incomplete') {
		items.value = data.filter(item => item.count.count !== item.count.of)
	}
}

const loadMoreItems = () => {
	if (items.value.length > 40) {
		// an arbitrary number for this example
		return
	}

	window.setTimeout(() => {
		// fake an API response time
		items.value.push(
			...[
				{
					barcode: '6281478257437327950',
					label: `Item ${Math.floor(Math.random() * 100)} Long Title: Including Subtitle to demonstrate ellipsis`,
					description: 'iPhone this and that',
					count: { count: 0, of: 3 },
					linkComponent: 'ListAnchor',
					route: '/item1',
				},
				{
					label: `Item ${Math.floor(Math.random() * 100)}`,
					description: 'More descriptions of stuff',
					count: { count: 3, of: 3 },
					linkComponent: 'ListAnchor',
					route: '/item2',
				},
				{
					label: `Item ${Math.floor(Math.random() * 100)}`,
					description: '',
					count: { count: 1, of: 6 },
					linkComponent: 'ListAnchor',
					route: '/item3',
				},
				{
					label: `Item ${Math.floor(Math.random() * 100)}`,
					description:
						"iPhone this and that plus even more text to demonstrate ellipsis and great savings! on things you can't see or touch",
					count: { count: 0, of: 3 },
					linkComponent: 'div',
					route: '/item4',
					barcode: '5564269659609843650',
				},
				{
					barcode: '6281478257437327897',
					label: `Item ${Math.floor(Math.random() * 100)}`,
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
const handlePrimaryAction = () => (showModal.value = true)
</script>
