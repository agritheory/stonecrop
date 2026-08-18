const __resolved__virtual_storySource_aformFetchStrategiesStoryVue = `<template>
	<Story title="fetch strategies" group="aform">
		<Variant title="sync vs lazy comparison" :setup-app="setupApp">
			<div class="fetch-demo">
				<div class="explanation">
					<h3>Sync vs Lazy Fetch Strategies</h3>
					<p>
						<b>Sync</b> fetches linked data in the initial query. <b>Lazy</b> fetches it on demand when explicitly
						accessed. Both are shown below with the same data source.
					</p>
				</div>
				<div class="comparison-grid">
					<div class="demo-panel sync">
						<h4>Sync Fetch</h4>
						<p class="strategy-desc">Data loaded in initial query</p>
						<SyncDemo />
					</div>
					<div class="demo-panel lazy">
						<h4>Lazy Fetch</h4>
						<p class="strategy-desc">Data loaded on demand</p>
						<LazyDemo />
					</div>
				</div>
			</div>
		</Variant>

		<Variant title="sync fetch behavior" :setup-app="setupApp">
			<div class="fetch-demo">
				<h3>Sync Fetch — Data in Initial Query</h3>
				<p>
					With sync fetch, the linked data is included in the GraphQL query from the start. Notice the tasks appear
					immediately without any additional loading step.
				</p>
				<SyncDemo />
			</div>
		</Variant>

		<Variant title="lazy fetch behavior" :setup-app="setupApp">
			<div class="fetch-demo">
				<h3>Lazy Fetch — On-Demand Loading</h3>
				<p>
					With lazy fetch, the parent form loads first. Linked data is only fetched when explicitly triggered (e.g.,
					clicking the load button or switching tabs).
				</p>
				<LazyDemo />
			</div>
		</Variant>

		<Variant title="blockWorkflows effect" :setup-app="setupApp">
			<div class="fetch-demo">
				<h3>blockWorkflows — Controlling Workflow Blocking</h3>
				<p>
					The <code>blockWorkflows</code> property determines whether actions are blocked until linked data is loaded.
				</p>
				<BlockWorkflowsDemo />
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { AForm } from '@stonecrop/aform'
import { Doctype, type DoctypeConfig, Registry, Stonecrop } from '@stonecrop/stonecrop'
import { type App, defineComponent, ref, h, computed } from 'vue'

import taskSchema from './assets/fetch/task_schema.json'
import recipeSyncSchema from './assets/fetch/recipe_sync_schema.json'
import recipeLazySchema from './assets/fetch/recipe_lazy_schema.json'
import recipeBlockSchema from './assets/fetch/recipe_block_schema.json'

let registryInstance: Registry | undefined
let stonecropInstance: Stonecrop | undefined

const setupApp = ({ app }: { app: App }) => {
	registryInstance = new Registry()
	registryInstance.addDoctype(Doctype.fromObject(taskSchema as DoctypeConfig))
	registryInstance.addDoctype(Doctype.fromObject(recipeSyncSchema as DoctypeConfig))
	registryInstance.addDoctype(Doctype.fromObject(recipeLazySchema as DoctypeConfig))
	registryInstance.addDoctype(Doctype.fromObject(recipeBlockSchema as DoctypeConfig))

	stonecropInstance = new Stonecrop(registryInstance)

	app.provide('$registry', registryInstance)
}

const sampleTasks = [
	{ name: 'Prepare ingredients', status: 'done' },
	{ name: 'Mix dough', status: 'in progress' },
	{ name: 'Bake', status: 'pending' },
]

const SyncDemo = defineComponent({
	name: 'SyncDemo',
	setup() {
		const resolvedSchema = computed(() => registryInstance!.resolveSchema(registryInstance!.registry['recipe']))
		const data = ref({
			name: 'Sourdough Bread',
			description: 'Classic long-fermentation recipe',
			tasks: [...sampleTasks],
		})

		return { resolvedSchema, data }
	},
	render() {
		return h('div', { class: 'demo-content' }, [
			h(AForm, {
				schema: this.resolvedSchema,
				data: this.data,
				'onUpdate:data': (val: any) => {
					this.data = val
				},
			}),
			h('div', { class: 'data-inspector' }, [
				h('strong', 'Tasks loaded:'),
				h('span', \`\${this.data.tasks?.length ?? 0} tasks (sync - loaded immediately)\`),
			]),
		])
	},
})

const LazyDemo = defineComponent({
	name: 'LazyDemo',
	setup() {
		const resolvedSchema = computed(() => registryInstance!.resolveSchema(registryInstance!.registry['recipe-lazy']))
		const data = ref({
			name: 'Sourdough Bread',
			description: 'Classic long-fermentation recipe',
		})
		const tasksLoaded = ref(false)
		const loadTasks = () => {
			data.value.tasks = [...sampleTasks]
			tasksLoaded.value = true
		}

		return { resolvedSchema, data, tasksLoaded, loadTasks }
	},
	render() {
		return h('div', { class: 'demo-content' }, [
			h(AForm, {
				schema: this.resolvedSchema,
				data: this.data,
				'onUpdate:data': (val: any) => {
					this.data = val
				},
			}),
			h('div', { class: 'lazy-controls' }, [
				h(
					'button',
					{
						class: 'load-button',
						onClick: this.loadTasks,
						disabled: this.tasksLoaded,
					},
					this.tasksLoaded ? 'Tasks Loaded' : 'Load Tasks (lazy)'
				),
			]),
			h('div', { class: 'data-inspector' }, [
				h('strong', 'Tasks loaded:'),
				h(
					'span',
					\`\${this.data.tasks?.length ?? 0} tasks (lazy - \${this.tasksLoaded ? 'manually loaded' : 'not yet loaded'})\`
				),
			]),
		])
	},
})

const BlockWorkflowsDemo = defineComponent({
	name: 'BlockWorkflowsDemo',
	setup() {
		const resolvedSchema = computed(() => registryInstance!.resolveSchema(registryInstance!.registry['recipe-block']))

		stonecropInstance!.addRecord('recipe-block', 'demo-1', {
			name: 'Sourdough Bread',
			description: 'Classic long-fermentation recipe',
			notes: [...sampleTasks],
		})

		const data = ref(stonecropInstance!.getStore().get('recipe-block.demo-1') || {})

		const workflowStatus = computed(() => {
			if (!stonecropInstance) return { ready: true }
			const doctype = registryInstance!.registry['recipe-block']
			return stonecropInstance!.isWorkflowReady(doctype, 'demo-1')
		})

		const loadTasks = () => {
			const record = stonecropInstance!.getStore().get('recipe-block.demo-1') || {}
			record.tasks = [...sampleTasks]
			stonecropInstance!.addRecord('recipe-block', 'demo-1', record)
			data.value = record
		}

		return { resolvedSchema, data, workflowStatus, loadTasks }
	},
	render() {
		return h('div', { class: 'demo-content' }, [
			h('p', { class: 'demo-description' }, [
				'This form has two sync links: ',
				h('strong', 'tasks'),
				' (blocks workflow) and ',
				h('strong', 'notes'),
				' (does not block). Try the submit button below.',
			]),
			h(AForm, {
				schema: this.resolvedSchema,
				data: this.data,
				'onUpdate:data': (val: any) => {
					this.data = val
				},
			}),
			h('div', { class: 'workflow-status' }, [
				h('strong', 'Workflow status: '),
				h(
					'span',
					{
						class: this.workflowStatus.ready ? 'status-ready' : 'status-blocked',
					},
					this.workflowStatus.ready ? 'Ready' : \`Blocked by: \${this.workflowStatus.blockedLinks?.join(', ')}\`
				),
			]),
			h('div', { class: 'action-buttons' }, [
				h(
					'button',
					{
						class: 'action-button',
						disabled: !this.workflowStatus.ready,
						onClick: () => alert('Action executed!'),
					},
					'Submit Recipe'
				),
				h(
					'button',
					{
						class: 'load-button',
						onClick: this.loadTasks,
						disabled: this.workflowStatus.ready,
					},
					this.workflowStatus.ready ? 'Tasks Loaded' : 'Load Tasks (to unblock)'
				),
			]),
		])
	},
})
<\/script>

<style scoped>
.fetch-demo {
	background: #f9f9f9;
	padding: 1.5rem;
	border-radius: 8px;
}

.explanation {
	background: #e8f4f8;
	padding: 1rem;
	border-radius: 4px;
	margin-bottom: 1.5rem;
}

.explanation h3 {
	margin-top: 0;
}

.comparison-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
}

.demo-panel {
	background: white;
	padding: 1rem;
	border-radius: 8px;
	border: 2px solid #ddd;
}

.demo-panel.sync {
	border-color: #27ae60;
}

.demo-panel.lazy {
	border-color: #e67e22;
}

.demo-panel h4 {
	margin-top: 0;
}

.strategy-desc {
	color: #666;
	font-style: italic;
}

.demo-content {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.data-inspector {
	background: #2c3e50;
	color: #ecf0f1;
	padding: 0.75rem;
	border-radius: 4px;
	font-size: 0.9rem;
}

.data-inspector strong {
	color: #3498db;
}

.lazy-controls {
	margin-top: 0.5rem;
}

.load-button {
	background: #3498db;
	color: white;
	border: none;
	padding: 0.5rem 1rem;
	border-radius: 4px;
	cursor: pointer;
}

.load-button:disabled {
	background: #95a5a6;
	cursor: not-allowed;
}

.workflow-status {
	background: #2c3e50;
	color: #ecf0f1;
	padding: 0.75rem;
	border-radius: 4px;
	font-size: 0.9rem;
}

.workflow-status strong {
	color: #3498db;
}

.status-ready {
	color: #2ecc71;
}

.status-blocked {
	color: #e74c3c;
}

.action-buttons {
	display: flex;
	gap: 1rem;
	margin-top: 0.5rem;
}

.action-button {
	background: #27ae60;
	color: white;
	border: none;
	padding: 0.75rem 1.5rem;
	border-radius: 4px;
	cursor: pointer;
	font-size: 1rem;
}

.action-button:disabled {
	background: #95a5a6;
	cursor: not-allowed;
}

.demo-description {
	color: #555;
	font-size: 0.95rem;
	margin-bottom: 1rem;
}

.demo-description strong {
	color: #2c3e50;
}
</style>

<docs lang="md">
# Fetch Strategies

Demonstrates the \`fetch\` property on \`LinkDeclaration\` and how it affects data loading behavior.

## Sync Fetch

Linked data is included in the initial GraphQL query. Use for data that is:

- Small and always needed
- Required for workflow actions
- Cheap to include in every query

## Lazy Fetch

Linked data is loaded on demand in a separate query. Use for data that is:

- Large or expensive to load
- Rarely needed
- User-initiated

## blockWorkflows

Controls whether workflow actions are blocked until linked data loads:

- \`sync\` links default to \`blockWorkflows: true\`
- \`lazy\` links default to \`blockWorkflows: false\`
- Can be overridden explicitly on either strategy
</docs>
`;
export {
  __resolved__virtual_storySource_aformFetchStrategiesStoryVue as default
};
