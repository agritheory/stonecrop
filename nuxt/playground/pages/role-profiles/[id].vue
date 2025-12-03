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

// Fetch role profile data from API or use empty object for new profiles
const { data: profileData } =
	profileId.value === 'new'
		? { data: ref({ profile_name: '', description: '', roles: [], active: true }) }
		: await useFetch(`/api/role-profiles/${profileId.value}`, {
				default: () => ({ profile_name: '', description: '', roles: [], active: true }),
		  })

// Add role profile data to HST store when available
watch(
	[stonecrop, profileData],
	() => {
		if (stonecrop.value && profileData.value && profileId.value !== 'new') {
			stonecrop.value.addRecord('role-profile', profileId.value, profileData.value)
		}
	},
	{ immediate: true }
)

// Get reactive form data from HST store
const formData = computed(() => {
	if (profileId.value === 'new') {
		return profileData.value
	}
	if (hstStore.value && profileId.value) {
		const record = hstStore.value.getNode(`role-profile.${profileId.value}`)
		// Use get('') to get the entire record object from the node
		return record ? record.get('') : profileData.value
	}
	return profileData.value
})

async function handleSave() {
	console.log('Saving profile:', profileData.value)
}

function handleCancel() {
	router.back()
}

// Set up form actions for the ActionSet toolbar
const { setFormActions, clearFormActions } = useFormActions()

watchEffect(() => {
	setFormActions({
		undo: profileId.value !== 'new' ? { action: undo, disabled: !canUndo.value } : undefined,
		redo: profileId.value !== 'new' ? { action: redo, disabled: !canRedo.value } : undefined,
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
					<AForm v-model="(profileDoctype as any).schema" :data="profileData" />
				</ClientOnly>
			</div>
		</div>

		<!-- HST Sidebar -->
		<HSTSidebar
			v-if="profileId !== 'new'"
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
}

.hst-sidebar {
	display: flex;
	flex-direction: column;
	gap: 0;
	position: sticky;
	top: 0;
	align-self: stretch;
	min-height: 100vh;
	max-height: 100vh;
	overflow: hidden;
	background: #f3f4f6;
	border-left: 3px solid #e5e7eb;
	padding: 1.5rem;
}

.sidebar-section {
	background: white;
	border-radius: 0.5rem;
	box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	margin-bottom: 1.5rem;
	border: 1px solid #e5e7eb;
}

.sidebar-section:last-child {
	margin-bottom: 0;
}

.sidebar-section:first-child {
	flex: 0 0 auto;
	max-height: 300px;
}

.sidebar-section:last-child {
	flex: 1 1 auto;
	min-height: 0;
}

.sidebar-title {
	padding: 1rem 1.5rem;
	margin: 0;
	font-size: 0.875rem;
	font-weight: 600;
	color: #374151;
	border-bottom: 1px solid #e5e7eb;
	background: #f9fafb;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.sidebar-content {
	padding: 1rem;
	flex: 1;
	min-height: 0;
	overflow: auto;
}

@media (max-width: 1400px) {
	.page-container-with-sidebar {
		grid-template-columns: 1fr 350px;
	}
}

@media (max-width: 1024px) {
	.page-container-with-sidebar {
		grid-template-columns: 1fr;
	}

	.hst-sidebar {
		position: relative;
		top: 0;
		max-height: none;
	}
}
</style>
