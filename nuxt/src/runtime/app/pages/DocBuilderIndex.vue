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
					{{ creating ? 'Creating…' : '+ New DocType' }}
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

<script setup lang="ts">
import type { TableColumn, TableConfig, RowClickEvent } from '@stonecrop/atable'
import { ActionSet } from '@stonecrop/desktop'
import type { ActionElements } from '@stonecrop/desktop/types'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'nuxt/app'

interface DoctypeRow {
	name: string
	slug: string
	fieldCount: number
}

const router = useRouter()
const doctypes = ref<DoctypeRow[]>([])
const loading = ref(true)

async function loadDoctypes() {
	try {
		doctypes.value = await $fetch<DoctypeRow[]>('/api/_stonecrop/docbuilder/doctypes')
	} catch (error) {
		console.error('Error loading doctypes:', error)
	} finally {
		loading.value = false
	}
}

onMounted(loadDoctypes)

// The list renders through ATable; clicking a row navigates to that doctype's detail route —
// the index's whole job. `clickable` gives the rows the pointer/hover affordance.
const columns: TableColumn[] = [
	{ label: 'Name', name: 'name', component: 'ATextInput', width: '20ch' },
	{ label: 'Fields', name: 'fieldCount', component: 'ANumericInput', width: '10ch' },
]

const config: TableConfig = {
	view: 'uncounted',
	clickable: true,
}

function handleRowClick({ row }: RowClickEvent) {
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
	// save.post resolves the target file case-insensitively and overwrites it, so creating a name that
	// collides with an existing doctype would WIPE its fields. Block the collision before POSTing.
	if (doctypes.value.some(d => String(d.slug).toLowerCase() === slug)) {
		createError.value = `A doctype "${name}" already exists.`
		return
	}
	createError.value = ''
	creating.value = true
	try {
		// Omit `workflow` so the write is purely additive on the fresh file (empty fields, no workflow).
		// `create: true` makes save.post reject (409) rather than overwrite if the name already exists —
		// the server-side backstop for the stale-list / direct-POST cases the guard above misses.
		await $fetch('/api/_stonecrop/docbuilder/save', {
			method: 'POST',
			body: { doctype: name, fields: [], create: true },
		})
		void router.push(`/docbuilder/${slug}`)
	} catch (error) {
		console.error('Error creating doctype:', error)
		const err = error as { statusCode?: number; data?: { message?: string } }
		if (err.statusCode === 409) {
			// The in-memory list was stale (another tab / out-of-band write). Surface the real cause and
			// refresh so the doctype that already exists shows up in the list.
			createError.value = err.data?.message ?? `A doctype "${name}" already exists.`
			await loadDoctypes()
		} else {
			createError.value = 'Failed to create doctype.'
		}
		creating.value = false
	}
}

// The index owns its own chrome (host layout suppressed via meta.layout=false), so it carries a
// minimal ActionSet rather than borrowing the host app's navigation.
const indexActions = computed<ActionElements[]>(() => [
	{ type: 'button', label: 'Home', action: () => void router.push('/') },
])
function handleAction(_label: string, action?: () => void | Promise<void>) {
	if (action) void action()
}
</script>

<style scoped>
/* Own a full-viewport white surface: these pages run with `layout: false`, so nothing paints
   over the playground layout's global grey `body` background. Without this, the page shows grey
   (or a grey/white flicker) depending on navigation order. */
.docbuilder-index {
	background: var(--sc-form-background);
	min-height: 100vh;
	box-sizing: border-box;
}

.docbuilder-index-inner {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
}

.docbuilder-header {
	text-align: center;
	padding: 2rem 0 3rem;
}

.docbuilder-header h1 {
	font-size: 2.5rem;
	margin: 0 0 1rem;
	font-weight: 700;
}

.subtitle {
	font-size: 1.125rem;
	color: #6b7280;
	margin: 0;
}

.loading,
.empty {
	text-align: center;
	padding: 2rem;
	color: #6b7280;
}

.docbuilder-create {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.docbuilder-create input {
	flex: 1;
	border: 1px solid var(--sc-gray-20, #d1d5db);
	border-radius: var(--sc-border-radius);
	padding: 0.5em 0.75em;
	font: inherit;
}

.btn-create {
	padding: 0.5em 1.25em;
	background: var(--sc-blue-40, #3b82f6);
	color: white;
	border: none;
	border-radius: var(--sc-border-radius);
	font-weight: 500;
	cursor: pointer;
	white-space: nowrap;
}

.btn-create:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.create-error {
	color: #b91c1c;
	font-size: 0.875rem;
	margin: -0.5rem 0 1rem;
}
</style>
