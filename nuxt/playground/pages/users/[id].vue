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

// Initialize Stonecrop with basic mode
const { stonecrop, operationLog } = useStonecrop()

// Extract HST store for components
const hstStore = computed(() => stonecrop.value?.getStore())

// Extract operation log data
const { operations, currentIndex, canUndo, canRedo } = operationLog

function undo() {
	if (hstStore.value) {
		operationLog.undo(hstStore.value)
	}
}

function redo() {
	if (hstStore.value) {
		operationLog.redo(hstStore.value)
	}
}

// Fetch user data from API or use empty object for new users
const { data: userData } =
	userId.value === 'new'
		? { data: ref({ username: '', disabled: false, has_roles: [] }) }
		: await useFetch(`/api/users/${userId.value}`, {
				default: () => ({ username: '', disabled: false, has_roles: [] }),
		  })

// Add user data to HST store when available
watch(
	[stonecrop, userData],
	() => {
		if (stonecrop.value && userData.value && userId.value !== 'new') {
			stonecrop.value.addRecord('user', userId.value, userData.value)
		}
	},
	{ immediate: true }
)

// Sync HST changes back to userData for form reactivity
watch(
	() => (hstStore.value && userId.value !== 'new' ? hstStore.value.get(`user.${userId.value}`) : null),
	hstData => {
		if (hstData && userData.value) {
			// Update userData with HST data to keep form in sync
			Object.assign(userData.value, hstData)
		}
	},
	{ deep: true }
)

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
	<div class="page-container-with-sidebar">
		<!-- Main Content -->
		<div class="main-content">
			<!-- HST Breadcrumbs -->
			<ClientOnly>
				<HSTBreadcrumbs v-if="userId !== 'new'" doctype="user" :record-id="userId" />
			</ClientOnly>

			<div class="page-header">
				<h1>{{ userId === 'new' ? 'New User' : `User: ${userData.username}` }}</h1>
				<div class="button-group">
					<!-- HST Controls -->
					<button v-if="userId !== 'new'" :disabled="!canUndo" class="btn-icon" title="Undo" @click="undo">↶</button>
					<button v-if="userId !== 'new'" :disabled="!canRedo" class="btn-icon" title="Redo" @click="redo">↷</button>
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

		<!-- HST Sidebar -->
		<HSTSidebar
			v-if="userId !== 'new'"
			:hst-store="hstStore"
			:operations="operations"
			:current-index="currentIndex"
			:can-undo="canUndo"
			:can-redo="canRedo" />
	</div>
</template>

<style scoped>
.page-container-with-sidebar {
	display: grid;
	grid-template-columns: 1fr 400px;
	gap: 0;
	padding: 0;
	max-width: 100%;
	margin: 0 auto;
	min-height: 100vh;
	background: #f9fafb;
}

.main-content {
	min-width: 0;
	padding: 2rem;
	background: #ffffff;
}

.page-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
}

.button-group {
	display: flex;
	gap: 0.5rem;
	align-items: center;
}

.btn-icon {
	padding: 0.5rem;
	background: #f3f4f6;
	color: #1f2937;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	cursor: pointer;
	font-size: 1.25rem;
	line-height: 1;
	transition: all 0.2s ease;
}

.btn-icon:hover:not(:disabled) {
	background: #e5e7eb;
	border-color: #9ca3af;
}

.btn-icon:disabled {
	opacity: 0.4;
	cursor: not-allowed;
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

@media (max-width: 1400px) {
	.page-container-with-sidebar {
		grid-template-columns: 1fr 350px;
	}
}

@media (max-width: 1024px) {
	.page-container-with-sidebar {
		grid-template-columns: 1fr;
		background: white;
	}

	.main-content {
		padding: 1.5rem;
	}

	.hst-sidebar {
		position: relative;
		top: 0;
		max-height: none;
		border-left: none;
		border-top: 3px solid #e5e7eb;
		background: #f9fafb;
	}
}
</style>
