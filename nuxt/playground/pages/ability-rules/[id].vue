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

// Fetch ability rule data from API or use empty object for new rules
const { data: ruleData } =
	ruleId.value === 'new'
		? {
				data: ref({
					role_id: '',
					doctype: '',
					action: '',
					subject: 'all',
					conditions: null,
					inverted: false,
					active: true,
				}),
		  }
		: await useFetch(`/api/ability-rules/${ruleId.value}`, {
				default: () => ({
					role_id: '',
					doctype: '',
					action: '',
					subject: 'all',
					conditions: null,
					inverted: false,
					active: true,
				}),
		  })

// Add ability rule data to HST store when available
watch(
	[stonecrop, ruleData],
	() => {
		if (stonecrop.value && ruleData.value && ruleId.value !== 'new') {
			stonecrop.value.addRecord('ability-rule', ruleId.value, ruleData.value)
		}
	},
	{ immediate: true }
)

// Get reactive form data from HST store
const formData = computed(() => {
	if (ruleId.value === 'new') {
		return ruleData.value
	}
	if (hstStore.value && ruleId.value) {
		const record = hstStore.value.getNode(`ability-rule.${ruleId.value}`)
		// Use get('') to get the entire record object from the node
		return record ? record.get('') : ruleData.value
	}
	return ruleData.value
})

async function handleSave() {
	console.log('Saving ability rule:', ruleData.value)
}

function handleCancel() {
	router.back()
}

// Set up form actions for the ActionSet toolbar
const { setFormActions, clearFormActions } = useFormActions()

watchEffect(() => {
	setFormActions({
		undo: ruleId.value !== 'new' ? { action: undo, disabled: !canUndo.value } : undefined,
		redo: ruleId.value !== 'new' ? { action: redo, disabled: !canRedo.value } : undefined,
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
					<AForm v-model="(ruleDoctype as any).schema" :data="ruleData" />
				</ClientOnly>
			</div>
		</div>

		<!-- HST Sidebar -->
		<HSTSidebar
			v-if="ruleId !== 'new'"
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
