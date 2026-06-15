<template>
	<Story title="AFormLoading">
		<Variant title="No label">
			<!-- No slot content: just the animated bar -->
			<AFormLoading />
		</Variant>

		<Variant title="With label">
			<!-- Slot content shown as loading label with ellipsis animation -->
			<AFormLoading>Loading contact form</AFormLoading>
		</Variant>

		<Variant title="Multiple sections loading">
			<AFormLoading>Loading contact details</AFormLoading>
			<AFormLoading>Loading billing address</AFormLoading>
			<AFormLoading>Loading shipping address</AFormLoading>
		</Variant>

		<Variant title="Toggle loading — real form">
			<template #controls>
				<HstCheckbox v-model="state.loaded" title="Loaded" />
			</template>
			<AFormLoading v-if="!state.loaded">Loading contact form</AFormLoading>
			<div v-else style="padding: 1rem; border: 1px solid #ccc; border-left: 4px solid #ccc">
				<p style="margin: 0; color: #555">Real form renders here once data is loaded.</p>
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { AFormLoading } from '@stonecrop/aform'

const state = reactive({
	loaded: false,
})
</script>
