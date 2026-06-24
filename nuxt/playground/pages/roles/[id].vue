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
	schema: hydrateSchema(roleDoctypeJson.fields),
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

// Fetch role data from API or use empty object for new roles
const { data: roleData } =
	roleId.value === 'new'
		? { data: ref({ role_name: '', description: '', parent_role: null, active: true }) }
		: await useFetch(`/api/roles/${roleId.value}`, {
				default: () => ({ role_name: '', description: '', parent_role: null, active: true }),
			})

// Add role data to HST store when available
watch(
	[stonecrop, roleData],
	() => {
		if (stonecrop.value && roleData.value && roleId.value !== 'new') {
			stonecrop.value.addRecord('role', roleId.value, roleData.value)
		}
	},
	{ immediate: true }
)

// Get reactive form data from HST store
const formData = computed(() => {
	if (roleId.value === 'new') {
		return roleData.value
	}
	if (hstStore.value && roleId.value) {
		const record = hstStore.value.getNode(`role.${roleId.value}`)
		// Use get('') to get the entire record object from the node
		return record ? record.get('') : roleData.value
	}
	return roleData.value
})

async function handleSave() {
	console.log('Saving role:', roleData.value)
}

function handleCancel() {
	router.back()
}

// Set up form actions for the ActionSet toolbar
const { setFormActions, clearFormActions } = useFormActions()

watchEffect(() => {
	setFormActions({
		undo: roleId.value !== 'new' ? { action: undo, disabled: !canUndo.value } : undefined,
		redo: roleId.value !== 'new' ? { action: redo, disabled: !canRedo.value } : undefined,
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
					<AForm v-model:data="roleData" :schema="roleDoctype.schema" />
				</ClientOnly>
			</div>
		</div>

		<!-- HST Sidebar -->
		<HSTSidebar
			v-if="roleId !== 'new'"
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
