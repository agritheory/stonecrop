<template>
	<div class="beam_metadata">
		<div class="beam_metadata_content">
			<div class="beam_metadata_header beam_metadata--two-column">
				<h1 class="beam_metadata_header-order-num">
					WO#2024-01-00001 <span class="beam_metadata--normal">Ambrosia Pie</span>
				</h1>
				<div class="alert beam_metadata_count">
					<p>0/2</p>
				</div>
			</div>
			<div class="beam_metadata_block">
				<p class="beam_metadata_heading">Status: <span class="alert beam_metadata--normal">In Progress</span></p>
			</div>
			<div class="beam_metadata_shipping beam_metadata_block">
				<div class="beam_metadata_source">
					<p class="beam_metadata_heading">Source</p>
					<p class="beam_metadata--single-line">Packing Warehouse Inc.</p>
					<p class="beam_metadata--single-line">1432 W. Parkway Ave.</p>
					<p class="beam_metadata--single-line">Chicago, IL 60617</p>
				</div>
				<div class="beam_metadata_arrow"></div>
				<div class="beam_metadata_source">
					<p class="beam_metadata_heading">Receiving</p>
					<p class="beam_metadata--single-line">Packing Warehouse Inc.</p>
					<p class="beam_metadata--single-line">1432 W. Parkway Ave.</p>
					<p class="beam_metadata--single-line">Chicago, IL 60617</p>
				</div>
			</div>
			<div class="beam_metadata_component_header beam_metadata_block">
				<p class="beam_metadata_heading">Components</p>
				<p class="beam_metadata_heading">Quantity</p>
			</div>
		</div>
		<div class="beam_metadata_components">
			<!--slot added here-->
			<slot name="components"></slot>
		</div>
	</div>
</template>

<script setup lang="ts"></script>
