<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStonecrop } from '@stonecrop/stonecrop'
import profileDoctypeJson from '~/doctypes/role-profile.json'
import { hydrateSchema } from '~/utils/schema'

const route = useRoute()
const router = useRouter()
const profileId = computed(() => route.params.id as string)

// Use the imported doctype schema and hydrate it with components
const profileDoctype = {
	...profileDoctypeJson,
	schema: hydrateSchema(profileDoctypeJson.schema),
}

// Initialize Stonecrop with HST
const { stonecrop, provideHSTPath, handleHSTChange, formData } = useStonecrop({
	doctype: profileDoctype as any,
	recordId: profileId.value === 'new' ? undefined : profileId.value,
})

// Sample profile data
const profileData = ref(
	profileId.value === 'new'
		? { profile_name: '', description: '', roles: [], active: true }
		: {
				id: profileId.value,
				profile_name: 'System Administrator',
				description: 'Full system access profile',
				roles: [{ role: '1' }],
				active: true,
		  }
)

async function handleSave() {
	console.log('Saving profile:', profileData.value)
	router.push('/role-profiles')
}

function handleCancel() {
	router.back()
}
</script>

<template>
	<div class="page-container">
		<div class="page-header">
			<h1>{{ profileId === 'new' ? 'New Role Profile' : `Profile: ${profileData.profile_name}` }}</h1>
			<div class="button-group">
				<button class="btn-secondary" @click="handleCancel">Cancel</button>
				<button class="btn-primary" @click="handleSave">Save</button>
			</div>
		</div>

		<div class="form-container">
			<ClientOnly>
				<AForm v-model="(profileDoctype as any).schema" :data="profileData" />
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
