<template>
	<div class="docbuilder-index">
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
			<ul v-else class="doctype-list">
				<li v-for="dt in doctypes" :key="dt.slug">
					<button type="button" class="doctype-row" @click="open(dt.slug)">
						<span class="doctype-name">{{ dt.name }}</span>
						<span class="doctype-meta">{{ dt.fieldCount }} field{{ dt.fieldCount === 1 ? '' : 's' }}</span>
						<span class="doctype-arrow">→</span>
					</button>
				</li>
			</ul>
		</ClientOnly>

		<ActionSet :elements="indexActions" @action-click="handleAction" />
	</div>
</template>

<script setup lang="ts">
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

// ATable has no row-click event (it's a read-only grid), so the list is hand-rolled clickable rows
// that navigate to the detail route — the index's whole job.
function open(slug: string) {
	void router.push(`/docbuilder/${slug}`)
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
.docbuilder-index {
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
	border-radius: 4px;
	padding: 0.5em 0.75em;
	font: inherit;
}

.btn-create {
	padding: 0.5em 1.25em;
	background: var(--sc-blue-40, #3b82f6);
	color: white;
	border: none;
	border-radius: 0.4rem;
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

.doctype-list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.doctype-row {
	width: 100%;
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem 1.25rem;
	background: var(--sc-form-background, #fff);
	border: 1px solid var(--sc-gray-20, #e5e7eb);
	border-left: 4px solid var(--sc-gray-20, #e5e7eb);
	border-radius: 0;
	cursor: pointer;
	font: inherit;
	text-align: left;
}

.doctype-row:hover {
	background: var(--sc-gray-5, #f9fafb);
	border-left-color: var(--sc-blue-40, #3b82f6);
}

.doctype-name {
	font-size: 1.125rem;
	font-weight: 600;
	flex: 1;
}

.doctype-meta {
	color: #6b7280;
	font-size: 0.875rem;
}

.doctype-arrow {
	color: var(--sc-gray-50, #9ca3af);
	font-size: 1.25rem;
}

.doctype-row:hover .doctype-arrow {
	color: var(--sc-blue-40, #3b82f6);
}
</style>
