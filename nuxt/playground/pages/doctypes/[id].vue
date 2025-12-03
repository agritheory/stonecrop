<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStonecrop } from '@stonecrop/stonecrop'
import doctypeSchemaJson from '~/doctypes/doctype.json'
import { hydrateSchema } from '~/utils/schema'

const route = useRoute()
const router = useRouter()
const doctypeId = computed(() => route.params.id as string)

// Use the imported doctype schema and hydrate it with components
const doctypeSchema = {
	...doctypeSchemaJson,
	schema: hydrateSchema(doctypeSchemaJson.schema),
}

// Initialize Stonecrop with HST
const { stonecrop, provideHSTPath, handleHSTChange, formData } = useStonecrop({
	doctype: doctypeSchema as any,
	recordId: doctypeId.value === 'new' ? undefined : doctypeId.value,
})

// Fetch doctype data from API or use empty object for new doctypes
const { data: doctypeData } =
	doctypeId.value === 'new'
		? {
				data: ref({
					name: '',
					module: '',
					description: '',
					is_submittable: false,
					is_tree: false,
					fields: [],
					state_machine_id: null,
				}),
		  }
		: await useFetch(`/api/doctypes/${doctypeId.value}`, {
				default: () => ({
					name: '',
					module: '',
					description: '',
					is_submittable: false,
					is_tree: false,
					fields: [],
					state_machine_id: null,
				}),
		  })

async function handleSave() {
	console.log('Saving doctype:', doctypeData.value)
}

function handleCancel() {
	router.back()
}

function openBuilder() {
	router.push(`/builder/${doctypeData.value.name}`)
}
</script>

<template>
	<div class="page-container">
		<div class="page-header">
			<h1>{{ doctypeId === 'new' ? 'New DocType' : `DocType: ${doctypeData.name}` }}</h1>
			<div class="button-group">
				<button v-if="doctypeId !== 'new'" class="btn-secondary" @click="openBuilder">Open Builder</button>
				<button class="btn-secondary" @click="handleCancel">Cancel</button>
				<button class="btn-primary" @click="handleSave">Save</button>
			</div>
		</div>

		<div class="form-container">
			<ClientOnly>
				<AForm v-model="(doctypeSchema as any).schema" :data="doctypeData" />
			</ClientOnly>
		</div>
	</div>
</template>

<style scoped>
.page-container {
	padding: 2rem;
	max-width: 1200px;
	margin: 0 auto;
}

.page-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
}

.button-group {
	display: flex;
	gap: 1rem;
}

.btn-primary {
	padding: 0.5rem 1rem;
	background: #4f46e5;
	color: white;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
}

.btn-primary:hover {
	background: #4338ca;
}

.btn-secondary {
	padding: 0.5rem 1rem;
	background: #6b7280;
	color: white;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
}

.btn-secondary:hover {
	background: #4b5563;
}

.form-container {
	background: white;
	padding: 2rem;
	border-radius: 0.5rem;
	box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
</style>
