<script setup lang="ts">
const actions = [
	{ key: 'convert', label: 'Convert DDL', description: 'PostgreSQL DDL to Stonecrop Doctypes' },
	{ key: 'load', label: 'Load Registry', description: 'Load doctypes into memory' },
	{ key: 'validate-refs', label: 'Validate References', description: 'Check Link field targets' },
	{ key: 'validate-schema', label: 'Validate Schema', description: 'Test Zod validation' },
]

const selectedAction = ref<string | null>(null)
const result = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function runAction(action: string) {
	selectedAction.value = action
	loading.value = true
	error.value = null
	result.value = null

	try {
		const response = await $fetch(`/api/test-middleware?action=${action}`)
		result.value = response
	} catch (e) {
		error.value = e instanceof Error ? e.message : String(e)
	} finally {
		loading.value = false
	}
}

async function getMeta(doctype: string) {
	loading.value = true
	error.value = null

	try {
		const response = await $fetch(`/api/test-middleware?action=get-meta&doctype=${doctype}`)
		result.value = response
	} catch (e) {
		error.value = e instanceof Error ? e.message : String(e)
	} finally {
		loading.value = false
	}
}

onMounted(async () => {
	const response = await $fetch('/api/test-middleware')
	result.value = response
})
</script>

<template>
	<div style="max-width: 1200px; margin: 0 auto; padding: 2rem">
		<h1>GraphQL Middleware Test</h1>
		<p>Test DDL conversion, schema validation, and doctype registry</p>

		<div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 2rem 0">
			<button
				v-for="action in actions"
				:key="action.key"
				:disabled="loading"
				style="padding: 1rem; border: 1px solid #ccc; border-radius: 4px; cursor: pointer"
				@click="runAction(action.key)">
				<strong>{{ action.label }}</strong>
				<br />
				<small>{{ action.description }}</small>
			</button>
		</div>

		<div v-if="result?.action === 'load'" style="margin: 1rem 0; padding: 1rem; background: #f0f8ff">
			<h3>Loaded Doctypes</h3>
			<button
				v-for="name in result.loaded"
				:key="name"
				style="margin: 0.25rem; padding: 0.5rem 1rem; cursor: pointer"
				@click="getMeta(name)">
				{{ name }}
			</button>
		</div>

		<div v-if="loading" style="padding: 2rem; text-align: center">Loading...</div>

		<div v-if="error" style="padding: 1rem; background: #fee; border: 1px solid #fcc; margin: 1rem 0">
			<h3 style="color: #c00">Error</h3>
			<pre>{{ error }}</pre>
		</div>

		<div v-if="result && !loading" style="background: #f8f8f8; border: 1px solid #ddd; margin: 1rem 0">
			<h3 style="padding: 1rem; margin: 0; background: #eee">
				Result
				<span v-if="result.success" style="color: green; margin-left: 1rem">Success</span>
				<span v-else style="color: red; margin-left: 1rem">Failed</span>
			</h3>
			<pre style="padding: 1rem; margin: 0; overflow: auto; max-height: 500px">{{
				JSON.stringify(result, null, 2)
			}}</pre>
		</div>
	</div>
</template>
