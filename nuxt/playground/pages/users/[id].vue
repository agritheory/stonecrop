<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStonecrop } from '@stonecrop/stonecrop'
import userDoctypeJson from '~/doctypes/user.json'
import { hydrateSchema } from '~/utils/schema'

const route = useRoute()
const router = useRouter()
const userId = computed(() => route.params.id as string)

// Use the imported doctype schema and hydrate it with components
const userDoctype = {
	...userDoctypeJson,
	schema: hydrateSchema(userDoctypeJson.schema),
}

// Initialize Stonecrop with HST
const { stonecrop, provideHSTPath, handleHSTChange, formData } = useStonecrop({
	doctype: userDoctype as any,
	recordId: userId.value === 'new' ? undefined : userId.value,
})

// Fetch user data from API or use empty object for new users
const { data: userData } =
	userId.value === 'new'
		? { data: ref({ username: '', disabled: false, has_roles: [] }) }
		: await useFetch(`/api/users/${userId.value}`, {
				default: () => ({ username: '', disabled: false, has_roles: [] }),
		  })

async function handleSave() {
	// API call to save user
	console.log('Saving user:', userData.value)
	router.push('/users')
}

function handleCancel() {
	router.back()
}
</script>

<template>
	<div class="page-container">
		<div class="page-header">
			<h1>{{ userId === 'new' ? 'New User' : `User: ${userData.username}` }}</h1>
			<div class="button-group">
				<button class="btn-secondary" @click="handleCancel">Cancel</button>
				<button class="btn-primary" @click="handleSave">Save</button>
			</div>
		</div>

		<div class="form-container">
			<ClientOnly>
				<AForm v-model="(userDoctype as any).schema" :data="userData" />
			</ClientOnly>
		</div>

		<!-- Effective Permissions Component will be added here -->
		<div v-if="userId !== 'new'" class="permissions-section">
			<h2>Effective Permissions</h2>
			<EffectivePermissions :user-id="userId" />
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
	margin-bottom: 2rem;
}

.permissions-section {
	background: white;
	padding: 2rem;
	border-radius: 0.5rem;
	box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.permissions-section h2 {
	margin-top: 0;
	margin-bottom: 1rem;
	font-size: 1.25rem;
	font-weight: 600;
}
</style>
