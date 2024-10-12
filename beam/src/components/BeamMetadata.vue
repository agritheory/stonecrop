<template>
	<div class="beam_metadata">
		<div class="beam_metadata_content">
			<slot>
				<div class="beam_metadata_header beam_metadata--two-column"></div>
				<div class="beam_metadata_block">
					<p class="beam_metadata_heading">
						Status:
						<span :class="{ alert: !order.complete }" class="beam_metadata--normal">{{
							order.complete ? 'Complete' : 'In Progress'
						}}</span>
					</p>
				</div>
				<div class="beam_metadata_shipping beam_metadata_block">
					<div class="beam_metadata_source">
						<p class="beam_metadata_heading">Source</p>
					</div>
					<div class="beam_metadata_arrow">
						<div class="beam_metadata_arrow-body"></div>
						<div class="beam_metadata_arrow-head">
							<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.74 7.78">
								<polygon points="6.74 3.89 0 0 0 7.78 6.74 3.89" style="fill: #c4c4c4" />
							</svg>
						</div>
					</div>
					<div class="beam_metadata_source">
						<p class="beam_metadata_heading">Receiving</p>
					</div>
				</div>
			</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	order: {
		orderNumber: string
		product: string
		quantity: number
		total: number
		complete: boolean
	}
}>()
</script>
