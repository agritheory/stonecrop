<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStonecrop } from '@stonecrop/stonecrop'
import ruleDoctypeJson from '~/doctypes/ability-rule.json'
import { hydrateSchema } from '~/utils/schema'

const route = useRoute()
const router = useRouter()
const ruleId = computed(() => route.params.id as string)

// Use the imported doctype schema and hydrate it with components
const ruleDoctype = {
	...ruleDoctypeJson,
	schema: hydrateSchema(ruleDoctypeJson.schema),
}

// Initialize Stonecrop with HST
const { stonecrop, provideHSTPath, handleHSTChange, formData } = useStonecrop({
	doctype: ruleDoctype as any,
	recordId: ruleId.value === 'new' ? undefined : ruleId.value,
})

// Sample rule data
const ruleData = ref(
	ruleId.value === 'new'
		? { role_id: '', doctype: '', action: '', subject: 'all', conditions: null, inverted: false, active: true }
		: {
				id: ruleId.value,
				role_id: '1',
				doctype: 'User',
				action: 'create',
				subject: 'all',
				conditions: null,
				inverted: false,
				active: true,
		  }
)

async function handleSave() {
	console.log('Saving ability rule:', ruleData.value)
	router.push('/ability-rules')
}

function handleCancel() {
	router.back()
}
</script>

<template>
	<div class="page-container">
		<div class="page-header">
			<h1>{{ ruleId === 'new' ? 'New Ability Rule' : 'Edit Ability Rule' }}</h1>
			<div class="button-group">
				<button class="btn-secondary" @click="handleCancel">Cancel</button>
				<button class="btn-primary" @click="handleSave">Save</button>
			</div>
		</div>

		<div class="form-container">
			<ClientOnly>
				<AForm v-model="(ruleDoctype as any).schema" :data="ruleData" />
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
