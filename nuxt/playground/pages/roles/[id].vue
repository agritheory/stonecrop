<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStonecrop } from '@stonecrop/stonecrop'
import roleDoctypeJson from '~/doctypes/role.json'
import { hydrateSchema } from '~/utils/schema'

const route = useRoute()
const router = useRouter()
const roleId = computed(() => route.params.id as string)

// Use the imported doctype schema and hydrate it with components
const roleDoctype = {
	...roleDoctypeJson,
	schema: hydrateSchema(roleDoctypeJson.schema),
}

// Initialize Stonecrop with HST
const { stonecrop, provideHSTPath, handleHSTChange, formData } = useStonecrop({
	doctype: roleDoctype as any,
	recordId: roleId.value === 'new' ? undefined : roleId.value,
})

// Sample role data
const roleData = ref(
	roleId.value === 'new'
		? { role_name: '', description: '', parent_role: null, active: true }
		: {
				id: roleId.value,
				role_name: 'Administrator',
				description: 'Full system access',
				parent_role: null,
				active: true,
		  }
)

async function handleSave() {
	console.log('Saving role:', roleData.value)
	router.push('/roles')
}

function handleCancel() {
	router.back()
}
</script>

<template>
	<div class="page-container">
		<div class="page-header">
			<h1>{{ roleId === 'new' ? 'New Role' : `Role: ${roleData.role_name}` }}</h1>
			<div class="button-group">
				<button class="btn-secondary" @click="handleCancel">Cancel</button>
				<button class="btn-primary" @click="handleSave">Save</button>
			</div>
		</div>

		<div class="form-container">
			<ClientOnly>
				<AForm v-model="(roleDoctype as any).schema" :data="roleData" />
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
