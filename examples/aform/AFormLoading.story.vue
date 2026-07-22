<template>
	<Story title="AFormLoading">
		<Variant title="Fieldset loading">
			<AFormLoading v-show="loading">Loading</AFormLoading>
			<AFieldset v-show="!loading" :schema="addressSchema" :data="addressData" label="Billing Address" />
		</Variant>

		<Variant title="Multiple sections loading">
			<AFormLoading v-show="loadingMultiple">Loading</AFormLoading>
			<AForm v-show="!loadingMultiple" :schema="contactSchema" v-model:data="contactData" />

			<AFormLoading v-show="loadingMultiple">Loading</AFormLoading>
			<AFieldset v-show="!loadingMultiple" :schema="addressSchema" :data="addressData" label="Billing Address" />

			<AFormLoading v-show="loadingMultiple">Loading</AFormLoading>
			<AFieldset v-show="!loadingMultiple" :schema="addressSchema" :data="shippingData" label="Shipping Address" />
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { AFormLoading, AFieldset, AForm } from '@stonecrop/aform'

const loading = ref(true)
const loadingMultiple = ref(true)

onMounted(() => {
	setTimeout(() => {
		loading.value = false
		loadingMultiple.value = false
	}, 5000)
})

const contactSchema = [
	{ fieldname: 'first_name', fieldtype: 'Data', component: 'ATextInput', label: 'First Name' },
	{ fieldname: 'last_name', fieldtype: 'Data', component: 'ATextInput', label: 'Last Name' },
	{ fieldname: 'email', fieldtype: 'Data', component: 'ATextInput', label: 'Email Address' },
	{ fieldname: 'phone', fieldtype: 'Data', component: 'ATextInput', label: 'Phone Number' },
]

const contactData = reactive({
	first_name: 'Jane',
	last_name: 'Smith',
	email: 'jane@example.com',
	phone: '555-1234',
})

const addressSchema = [
	{ fieldname: 'street', fieldtype: 'Data', component: 'ATextInput', label: 'Street' },
	{ fieldname: 'city', fieldtype: 'Data', component: 'ATextInput', label: 'City' },
	{ fieldname: 'state', fieldtype: 'Data', component: 'ATextInput', label: 'State' },
	{ fieldname: 'zip', fieldtype: 'Data', component: 'ATextInput', label: 'Zip Code' },
	{ fieldname: 'country', fieldtype: 'Data', component: 'ATextInput', label: 'Country' },
]

const addressData = reactive({
	street: '123 Main St',
	city: 'Springfield',
	state: 'IL',
	zip: '62701',
	country: 'USA',
})

const shippingData = reactive({
	street: '456 Oak Ave',
	city: 'Shelbyville',
	state: 'IL',
	zip: '62565',
	country: 'USA',
})
</script>
