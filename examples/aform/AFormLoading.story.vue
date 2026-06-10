<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const isLoading = ref(true)

const formData = ref({ first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', phone: '555-1234' })

const schema = ref([
	{ fieldname: 'first_name', label: 'First Name', component: 'ATextInput', kind: 'field' },
	{ fieldname: 'last_name', label: 'Last Name', component: 'ATextInput', kind: 'field' },
	{ fieldname: 'email', label: 'Email', component: 'ATextInput', kind: 'field' },
	{ fieldname: 'phone', label: 'Phone', component: 'ATextInput', kind: 'field' },
])
</script>

<template>
	<Story title="AFormLoading" icon="carbon:loading">
		<!-- ── Variant 1: default (4 fields) ───────────────────────────── -->
		<Variant title="Default (4 fields)">
			<div style="padding: 1rem; width: 600px">
				<AFormLoading />
			</div>
		</Variant>

		<!-- ── Variant 2: more fields ──────────────────────────────────── -->
		<Variant title="8 fields">
			<div style="padding: 1rem; width: 600px">
				<AFormLoading :field-count="8" />
			</div>
		</Variant>

		<!-- ── Variant 3: fieldset mode ────────────────────────────────── -->
		<Variant title="Fieldset skeleton">
			<div style="padding: 1rem; width: 600px">
				<AFieldsetLoading :field-count="4" />
			</div>
		</Variant>

		<!-- ── Variant 4: toggle simulation ────────────────────────────── -->
		<Variant title="Toggle loading → real form">
			<div style="padding: 1rem; width: 600px">
				<button style="margin-bottom: 1rem; padding: 0.4rem 1rem; cursor: pointer" @click="isLoading = !isLoading">
					{{ isLoading ? 'Simulate data loaded' : 'Simulate loading' }}
				</button>

				<AFormLoading v-if="isLoading" :field-count="4" />
				<AForm v-else v-model:data="formData" :schema="schema" />
			</div>
		</Variant>

		<!-- ── Variant 5: multiple sections (incremental load) ─────────── -->
		<Variant title="Multiple sections loading">
			<div style="padding: 1rem; width: 600px">
				<p style="margin-bottom: 0.5rem; font-size: 0.85rem; color: #666">
					Simulates a page where each section loads independently
				</p>
				<AFormLoading :field-count="3" />
				<AFieldsetLoading :field-count="4" />
				<AFieldsetLoading :field-count="2" />
			</div>
		</Variant>
	</Story>
</template>
