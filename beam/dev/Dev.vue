<template>
	<div>
		<BeamModal :showModal="showModal">
			<ConfirmDialog @closemodal="closeModal" @confirmmodal="confirmModal" />
		</BeamModal>
		<Navbar @click="handlePrimaryAction">
			<template v-slot:title><h1 class="nav-title">Items to Receive</h1></template>
			<template v-slot:navbaraction>DONE</template>
		</Navbar>
		<ListView :items="items" @scrollbottom="loadMoreItems" />
		<ActionFooter @click="handlePrimaryAction"> DONE </ActionFooter>
		<ScanInput @scaninput="handleScanInput($event)" />
		<BeamModalOutlet @closemodal="closeModal" @confirmmodal="confirmModal"></BeamModalOutlet>
	</div>
</template>

<script>
export default {
	name: 'App',
	data() {
		return {
			items: [
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
				{ label: 'Item 3', description: '', count: { count: 1, of: 6 }, linkComponent: 'ListAnchor', route: '/item3' },
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
				{ label: 'Item 3', description: '', count: { count: 1, of: 6 }, linkComponent: 'ListAnchor', route: '/item3' },
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
				{ label: 'Item 3', description: '', count: { count: 1, of: 6 }, linkComponent: 'ListAnchor', route: '/item3' },
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
			],
			showModal: false,
		}
	},
	methods: {
		handleScanInput(barcode) {
			this.incrementListItemCountByBarcode(barcode)
		},
		handlePrimaryAction() {
			console.log('primary action', this.showModal)
			this.showModal = true
		},
		incrementListItemCountByBarcode(barcode) {
			if (!barcode) {
				return
			}
			let detectedItemsByIndex = this.items
				.map((item, index) => {
					return item.barcode === barcode ? index : undefined
				}) // return indices of matching barcode
				.filter(x => x !== undefined) // remove undefined
			for (const [detectedIndex, rowIndex] of detectedItemsByIndex.entries()) {
				if (detectedIndex !== detectedItemsByIndex.length - 1) {
					if (this.items[rowIndex].count.count < this.items[rowIndex].count.of) {
						// don't overcount if its not the last row of that barcode
						let incrementedValue = this.items[rowIndex].count.count + 1
						this.$set(this.items[rowIndex].count, 'count', incrementedValue)
						break
					} else {
						continue
					}
				} else {
					// set it in the last item anyway
					let incrementedValue = this.items[rowIndex].count.count + 1
					this.$set(this.items[rowIndex].count, 'count', incrementedValue)
					break
				}
			}
		},
		loadMoreItems() {
			if (this.items.length > 40) {
				// an arbitrary number for this example
				return
			}
			window.setTimeout(() => {
				// fake an API response time
				this.items.push(
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
		},
		closeModal() {
			console.log('close modal')
			this.showModal = false
		},
		confirmModal() {
			console.log('confirm modal')
			this.showModal = false
		},
	},
}
</script>
<style>
@import './theme.css';
</style>
