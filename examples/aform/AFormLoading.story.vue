<template>
	<Story title="AFormLoading">
		<Variant title="No schema – skeleton bars (4 fields)">
			<!-- No fields prop: schema not yet available, renders animated placeholder bars -->
			<AFormLoading />
		</Variant>
		<Variant title="No schema – skeleton bars (8 fields)">
			<AFormLoading :field-count="8" />
		</Variant>
		<Variant title="No schema – fieldset skeleton">
			<!-- AFieldsetLoading with no fields: skeleton legend bar + placeholder fields -->
			<AFieldsetLoading />
		</Variant>
		<Variant title="With schema – labels + disabled inputs">
			<!-- fields prop provided: labels render immediately, inputs disabled until data loads -->
			<AFormLoading
				:fields="[
					{ fieldname: 'first_name', label: 'First Name' },
					{ fieldname: 'last_name', label: 'Last Name' },
					{ fieldname: 'email', label: 'Email Address' },
					{ fieldname: 'phone', label: 'Phone Number' },
				]" />
		</Variant>
		<Variant title="Toggle loading — real form">
			<template #controls>
				<HstCheckbox v-model="state.loaded" title="Loaded" />
			</template>
			<AFormLoading
				v-if="!state.loaded"
				:fields="[
					{ fieldname: 'first_name', label: 'First Name' },
					{ fieldname: 'last_name', label: 'Last Name' },
					{ fieldname: 'email', label: 'Email Address' },
					{ fieldname: 'phone', label: 'Phone Number' },
				]" />
			<div v-else style="padding: 1rem; border: 1px solid #ccc; border-left: 4px solid #ccc">
				<p style="margin: 0; color: #555">Real form renders here once data is loaded.</p>
			</div>
		</Variant>
		<Variant title="Multiple sections loading">
			<AFormLoading
				:fields="[
					{ fieldname: 'first_name', label: 'First Name' },
					{ fieldname: 'last_name', label: 'Last Name' },
					{ fieldname: 'email', label: 'Email Address' },
					{ fieldname: 'phone', label: 'Phone Number' },
				]" />
			<AFieldsetLoading
				legend="Billing Address"
				:fields="[
					{ fieldname: 'street', label: 'Street' },
					{ fieldname: 'city', label: 'City' },
					{ fieldname: 'state', label: 'State' },
					{ fieldname: 'zip', label: 'Zip Code' },
					{ fieldname: 'country', label: 'Country' },
				]" />
			<AFieldsetLoading
				legend="Shipping Address"
				:fields="[
					{ fieldname: 'street', label: 'Street' },
					{ fieldname: 'city', label: 'City' },
					{ fieldname: 'zip', label: 'Zip Code' },
				]" />
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { AFormLoading, AFieldsetLoading } from '@stonecrop/aform'

const state = reactive({
	loaded: false,
})
</script>
