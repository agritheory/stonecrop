<template>
	<div class="hst-state-viewer">
		<div class="viewer-header">
			<h3>HST State Tree</h3>
			<div class="viewer-actions">
				<button class="action-btn" @click="refreshTree">🔄</button>
				<button class="action-btn" @click="expandAll">{{ allExpanded ? '▼' : '▶' }}</button>
			</div>
		</div>

		<div class="tree-container">
			<div v-if="!treeData || Object.keys(treeData).length === 0" class="empty-state">
				<p>No records in HST. Add records to see the state tree.</p>
			</div>
			<div v-else class="tree-nodes">
				<TreeNode
					v-for="(value, key) in treeData"
					:key="key"
					:node-key="String(key)"
					:node-value="value"
					:level="0"
					:initial-expanded="allExpanded" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
	store: any
}

const props = defineProps<Props>()

const allExpanded = ref(false)

const treeData = computed(() => {
	if (!props.store) return {}
	// Access the underlying data safely by getting it through get method
	// rather than direct property access which can cause recursion
	try {
		const data: Record<string, any> = {}
		// Get all top-level keys from the store
		const storeData = (props.store as any).target || {}
		for (const key in storeData) {
			if (Object.prototype.hasOwnProperty.call(storeData, key)) {
				data[key] = storeData[key]
			}
		}
		return data
	} catch (error) {
		console.warn('Failed to read HST store data:', error)
		return {}
	}
})

function refreshTree() {
	// Force reactivity update
	allExpanded.value = allExpanded.value
}

function expandAll() {
	allExpanded.value = !allExpanded.value
}
</script>

<script lang="ts">
import { defineComponent, h, ref, type VNode, type Component } from 'vue'

// TreeNode component defined inline for nested rendering
export const TreeNode: Component = defineComponent({
	name: 'TreeNode',
	props: {
		nodeKey: { type: String, required: true },
		nodeValue: { required: true },
		level: { type: Number, required: true },
		initialExpanded: { type: Boolean, default: false },
	},
	setup(props) {
		const expanded = ref(props.initialExpanded)

		watch(
			() => props.initialExpanded,
			newVal => {
				expanded.value = newVal
			}
		)

		const isObject = computed(() => {
			return props.nodeValue !== null && typeof props.nodeValue === 'object' && !Array.isArray(props.nodeValue)
		})

		const isArray = computed(() => {
			return Array.isArray(props.nodeValue)
		})

		const hasChildren = computed(() => {
			return isObject.value || isArray.value
		})

		const childEntries = computed(() => {
			if (isArray.value) {
				return (props.nodeValue as any[]).map((item, index) => [String(index), item])
			} else if (isObject.value) {
				return Object.entries(props.nodeValue as object)
			}
			return []
		})

		const displayValue = computed(() => {
			if (props.nodeValue === null) return 'null'
			if (props.nodeValue === undefined) return 'undefined'
			if (typeof props.nodeValue === 'string') return `"${props.nodeValue}"`
			if (typeof props.nodeValue === 'boolean') return String(props.nodeValue)
			if (typeof props.nodeValue === 'number') return String(props.nodeValue)
			if (isArray.value) return `Array[${(props.nodeValue as any[]).length}]`
			if (isObject.value) return `Object{${Object.keys(props.nodeValue as object).length}}`
			return String(props.nodeValue)
		})

		const toggle = () => {
			if (hasChildren.value) {
				expanded.value = !expanded.value
			}
		}

		return (): VNode =>
			h(
				'div',
				{
					class: 'tree-node',
					style: { paddingLeft: `${props.level * 20}px` },
				},
				[
					h(
						'div',
						{
							class: ['node-header', { clickable: hasChildren.value }],
							onClick: toggle,
						},
						[
							hasChildren.value
								? h('span', { class: 'expand-icon' }, expanded.value ? '▼' : '▶')
								: h('span', { class: 'expand-icon-placeholder' }),
							h('span', { class: 'node-key' }, props.nodeKey),
							h('span', { class: 'node-separator' }, ': '),
							h('span', { class: 'node-value' }, displayValue.value),
						]
					),
					expanded.value && hasChildren.value
						? h(
								'div',
								{ class: 'node-children' },
								childEntries.value.map(([key, value]) =>
									h(TreeNode, {
										key,
										nodeKey: key,
										nodeValue: value,
										level: props.level + 1,
										initialExpanded: props.initialExpanded,
									})
								)
						  )
						: null,
				]
			)
	},
})
</script>

<style scoped>
.hst-state-viewer {
	background: white;
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	overflow: hidden;
}

.viewer-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	background: #f3f4f6;
	border-bottom: 1px solid #e5e7eb;
}

.viewer-header h3 {
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
	color: #1f2937;
}

.viewer-actions {
	display: flex;
	gap: 0.5rem;
}

.action-btn {
	padding: 0.375rem 0.75rem;
	background: white;
	border: 1px solid #d1d5db;
	border-radius: 4px;
	font-size: 0.875rem;
	cursor: pointer;
	color: #374151;
	font-weight: 500;
}

.action-btn:hover {
	background: #f9fafb;
	border-color: #9ca3af;
}

.tree-container {
	padding: 1rem;
	overflow-y: auto;
	font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
	font-size: 0.875rem;
}

.empty-state {
	padding: 2rem 1rem;
	text-align: center;
	color: #6b7280;
}

.tree-nodes {
	padding-left: 0;
}

.tree-node {
	margin: 0;
}

.node-header {
	display: flex;
	align-items: center;
	padding: 0.25rem 0;
	border-radius: 3px;
	transition: background 0.15s ease;
}

.node-header.clickable {
	cursor: pointer;
}

.node-header.clickable:hover {
	background: #f9fafb;
}

.expand-icon {
	display: inline-block;
	width: 16px;
	text-align: center;
	color: #6b7280;
	font-size: 0.75rem;
	margin-right: 0.25rem;
}

.expand-icon-placeholder {
	display: inline-block;
	width: 16px;
	margin-right: 0.25rem;
}

.node-key {
	color: #7c3aed;
	font-weight: 600;
}

.node-separator {
	color: #6b7280;
	margin: 0 0.25rem;
}

.node-value {
	color: #059669;
}

.node-children {
	margin-left: 0;
}
</style>
