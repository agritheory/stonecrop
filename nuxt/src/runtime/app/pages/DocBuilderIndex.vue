<template>
	<div class="docbuilder-index">
		<div class="docbuilder-index-inner">
			<div class="docbuilder-header">
				<h1>DocType Builder</h1>
				<p class="subtitle">Select a DocType to view and edit its schema</p>
			</div>
			<div class="docbuilder-create">
				<input
					v-model="newName"
					type="text"
					placeholder="New doctype name (e.g. Invoice)"
					:disabled="creating"
					@keyup.enter="createDoctype" />
				<button type="button" class="btn-create" :disabled="creating || !newName.trim()" @click="createDoctype">
					{{ creating ? 'Creating\u2026' : '+ New DocType' }}
				</button>
			</div>
			<p v-if="createError" class="create-error">{{ createError }}</p>
			<ClientOnly>
				<div v-if="loading" class="loading">Loading doctypes...</div>
				<p v-else-if="!doctypes.length" class="empty">No doctypes yet — create one above.</p>
				<ATable v-else :columns="columns" :rows="doctypes" :config="config" @row:click="handleRowClick" />
			</ClientOnly>
		</div>

		<ActionSet :elements="indexActions" @action-click="handleAction" />
	</div>
</template>

<script setup>
import { ActionSet } from '@stonecrop/desktop'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'nuxt/app'
const router = useRouter()
const doctypes = ref([])
const loading = ref(true)
async function loadDoctypes() {
	try {
		doctypes.value = await $fetch('/api/_stonecrop/docbuilder/doctypes')
	} catch (error) {
		console.error('Error loading doctypes:', error)
	} finally {
		loading.value = false
	}
}
onMounted(loadDoctypes)
const columns = [
	{ label: 'Name', name: 'name', component: 'ATextInput', width: '20ch' },
	{ label: 'Fields', name: 'fieldCount', component: 'ANumericInput', width: '10ch' },
]
const config = {
	view: 'uncounted',
	clickable: true,
}
function handleRowClick({ row }) {
	void router.push(`/docbuilder/${row.slug}`)
}
const newName = ref('')
const createError = ref('')
const creating = ref(false)
const DOCTYPE_NAME = /^[A-Z][\w-]*$/i
async function createDoctype() {
	const name = newName.value.trim()
	if (!name) return
	if (!DOCTYPE_NAME.test(name)) {
		createError.value = 'Start with a letter; use only letters, numbers, hyphens, or underscores.'
		return
	}
	const slug = name.toLowerCase()
	if (doctypes.value.some(d => String(d.slug).toLowerCase() === slug)) {
		createError.value = `A doctype "${name}" already exists.`
		return
	}
	createError.value = ''
	creating.value = true
	try {
		await $fetch('/api/_stonecrop/docbuilder/save', {
			method: 'POST',
			body: { doctype: name, fields: [], create: true },
		})
		void router.push(`/docbuilder/${slug}`)
	} catch (error) {
		console.error('Error creating doctype:', error)
		const err = error
		if (err.statusCode === 409) {
			createError.value = err.data?.message ?? `A doctype "${name}" already exists.`
			await loadDoctypes()
		} else {
			createError.value = 'Failed to create doctype.'
		}
		creating.value = false
	}
}
const indexActions = computed(() => [{ type: 'button', label: 'Home', action: () => void router.push('/') }])
function handleAction(_label, action) {
	if (action) void action()
}
</script>

<style scoped>
.docbuilder-index {
	background: var(--sc-form-background, #fff);
	box-sizing: border-box;
	min-height: 100vh;
}
.docbuilder-index-inner {
	margin: 0 auto;
	max-width: 1200px;
	padding: 2rem;
}
.docbuilder-header {
	padding: 2rem 0 3rem;
	text-align: center;
}
.docbuilder-header h1 {
	font-size: 2.5rem;
	font-weight: 700;
	margin: 0 0 1rem;
}
.subtitle {
	color: #6b7280;
	font-size: 1.125rem;
	margin: 0;
}
.empty,
.loading {
	color: #6b7280;
	padding: 2rem;
	text-align: center;
}
.docbuilder-create {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 1rem;
}
.docbuilder-create input {
	border: 1px solid var(--sc-gray-20, #d1d5db);
	border-radius: 4px;
	flex: 1;
	font: inherit;
	padding: 0.5em 0.75em;
}
.btn-create {
	background: var(--sc-blue-40, #3b82f6);
	border: none;
	border-radius: 0.4rem;
	color: #fff;
	cursor: pointer;
	font-weight: 500;
	padding: 0.5em 1.25em;
	white-space: nowrap;
}
.btn-create:disabled {
	cursor: not-allowed;
	opacity: 0.5;
}
.create-error {
	color: #b91c1c;
	font-size: 0.875rem;
	margin: -0.5rem 0 1rem;
}
</style>
