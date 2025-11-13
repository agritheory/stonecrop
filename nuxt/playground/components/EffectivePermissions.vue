<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
	userId: string
}

const props = defineProps<Props>()

interface Permission {
	doctype: string
	action: string
	allowed: boolean
	rule_source: string
}

const permissions = ref<Permission[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Fetch effective permissions from API
async function loadPermissions() {
	try {
		loading.value = true
		// This would be an API call to the server that runs the SQL function
		// GET_USER_EFFECTIVE_PERMISSIONS from Orpin
		const data = await $fetch(`/api/permissions/effective/${props.userId}`)
		permissions.value = data as Permission[]
	} catch (err) {
		error.value = 'Failed to load permissions'
		console.error(err)
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	loadPermissions()
})

// Group permissions by doctype
const groupedPermissions = computed(() => {
	const grouped: Record<string, Permission[]> = {}
	permissions.value.forEach(perm => {
		if (!grouped[perm.doctype]) {
			grouped[perm.doctype] = []
		}
		grouped[perm.doctype].push(perm)
	})
	return grouped
})
</script>

<template>
	<div class="effective-permissions">
		<div v-if="loading" class="loading">Loading permissions...</div>
		<div v-else-if="error" class="error">
			{{ error }}
		</div>
		<div v-else class="permissions-grid">
			<div v-for="(perms, doctype) in groupedPermissions" :key="doctype" class="doctype-permissions">
				<h3 class="doctype-title">
					{{ doctype }}
				</h3>
				<table class="permissions-table">
					<thead>
						<tr>
							<th>Action</th>
							<th>Allowed</th>
							<th>Rule Source</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="perm in perms" :key="perm.action" :class="{ allowed: perm.allowed, denied: !perm.allowed }">
							<td>{{ perm.action }}</td>
							<td>
								<span class="badge" :class="perm.allowed ? 'badge-success' : 'badge-danger'">
									{{ perm.allowed ? '✓ Allowed' : '✗ Denied' }}
								</span>
							</td>
							<td class="rule-source">
								{{ perm.rule_source }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<style scoped>
.effective-permissions {
	width: 100%;
}

.loading,
.error {
	padding: 1rem;
	text-align: center;
	color: #6b7280;
}

.error {
	color: #ef4444;
}

.permissions-grid {
	display: grid;
	gap: 2rem;
}

.doctype-permissions {
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	overflow: hidden;
}

.doctype-title {
	margin: 0;
	padding: 1rem;
	background: #f9fafb;
	border-bottom: 1px solid #e5e7eb;
	font-size: 1rem;
	font-weight: 600;
}

.permissions-table {
	width: 100%;
	border-collapse: collapse;
}

.permissions-table th {
	padding: 0.75rem 1rem;
	text-align: left;
	font-size: 0.875rem;
	font-weight: 500;
	color: #6b7280;
	background: #f9fafb;
	border-bottom: 1px solid #e5e7eb;
}

.permissions-table td {
	padding: 0.75rem 1rem;
	font-size: 0.875rem;
	border-bottom: 1px solid #e5e7eb;
}

.permissions-table tbody tr:last-child td {
	border-bottom: none;
}

.permissions-table tbody tr.allowed {
	background: #f0fdf4;
}

.permissions-table tbody tr.denied {
	background: #fef2f2;
}

.badge {
	display: inline-block;
	padding: 0.25rem 0.75rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 500;
}

.badge-success {
	background: #dcfce7;
	color: #166534;
}

.badge-danger {
	background: #fee2e2;
	color: #991b1b;
}

.rule-source {
	color: #6b7280;
	font-size: 0.8125rem;
}
</style>
