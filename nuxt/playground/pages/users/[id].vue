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

// Set up form actions for the ActionSet toolbar
const { setFormActions, clearFormActions } = useFormActions()

watchEffect(() => {
	setFormActions({
		undo: userId.value !== 'new' ? { action: undo, disabled: !canUndo.value } : undefined,
		redo: userId.value !== 'new' ? { action: redo, disabled: !canRedo.value } : undefined,
		cancel: { action: handleCancel },
		save: { action: handleSave },
	})
})

// Clear form actions when leaving the page
onUnmounted(() => {
	clearFormActions()
})
</script>

<template>
	<div class="page-container-with-sidebar">
		<!-- Main Content -->
		<div class="main-content">
			<div class="form-container">
				<ClientOnly>
					<AForm v-model:data="userData" :schema="userDoctype.schema" />
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
	background: var(--sc-gray-5);
}

.main-content {
	min-width: 0;
	padding: 2rem;
	background: var(--sc-form-background);
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

.form-container {
	background: var(--sc-form-background);
	padding: 2rem;
	border-radius: 0.25rem;
	border: 1px solid var(--sc-form-border);
	margin-bottom: 2rem;
}

.permissions-section {
	background: var(--sc-form-background);
	padding: 2rem;
	border-radius: 0.25rem;
	border: 1px solid var(--sc-form-border);
}

.permissions-section h2 {
	margin-top: 0;
	margin-bottom: 1rem;
	font-size: 1.25rem;
	font-weight: 600;
	color: var(--sc-gray-80);
}

@media (max-width: 1400px) {
	.page-container-with-sidebar {
		grid-template-columns: 1fr 350px;
	}
}

@media (max-width: 1024px) {
	.page-container-with-sidebar {
		grid-template-columns: 1fr;
		background: var(--sc-form-background);
	}

	.main-content {
		padding: 1.5rem;
	}
}
</style>
