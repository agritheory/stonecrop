<template>
	<div class="desktop" @click="handleClick">
		<!-- Action Set -->
		<ActionSet :elements="actionElements" @action-click="handleActionClick" />

		<!-- Main content using AForm -->
		<AForm v-if="currentViewSchema.length > 0" v-model:data="currentViewData" :schema="currentViewSchema" />
		<div v-else-if="!stonecrop" class="loading"><p>Initializing Stonecrop...</p></div>
		<div v-else class="loading">
			<p>Loading {{ currentView }} data...</p>
		</div>

		<!-- Sheet Navigation -->
		<SheetNav :breadcrumbs="navigationBreadcrumbs" />

		<!-- Command Palette -->
		<CommandPalette
			:is-open="commandPaletteOpen"
			:search="searchCommands"
			placeholder="Type a command or search..."
			@select="executeCommand"
			@close="commandPaletteOpen = false">
			<template #title="{ result }">
				{{ result.title }}
			</template>
			<template #content="{ result }">
				{{ result.description }}
			</template>
		</CommandPalette>
	</div>
</template>

<script setup lang="ts">
import { useStonecrop } from '@stonecrop/stonecrop'
import { AForm, type SchemaTypes, type TableColumn, type TableConfig } from '@stonecrop/aform'
import { computed, onMounted, provide, ref, unref, watch } from 'vue'

import ActionSet from './ActionSet.vue'
import SheetNav from './SheetNav.vue'
import CommandPalette from './CommandPalette.vue'
import type {
	ActionElements,
	RouteAdapter,
	NavigationTarget,
	ActionEventPayload,
	RecordOpenEventPayload,
	LoadRecordsEventPayload,
	LoadRecordEventPayload,
} from '../types'

const props = defineProps<{
	availableDoctypes?: string[]
	/**
	 * Pluggable router adapter. When provided, Desktop uses these functions for all
	 * routing instead of reaching into the registry's internal Vue Router instance.
	 * Nuxt hosts (or any host with custom route conventions) should supply this.
	 */
	routeAdapter?: RouteAdapter
	/**
	 * Replacement for the native `confirm()` dialog. Desktop calls this before
	 * performing a destructive action. Return `true` to proceed.
	 * Defaults to the native `window.confirm` if omitted.
	 */
	confirmFn?: (message: string) => boolean | Promise<boolean>
	/**
	 * The field name that holds the canonical record ID (e.g., 'rowId' for UUID).
	 * Used for navigation and table row identification.
	 * Defaults to 'id' if not specified.
	 */
	recordIdField?: string
}>()

const emit = defineEmits<{
	/**
	 * Fired when the user triggers an FSM transition (action button click).
	 * The host app is responsible for calling the server, persisting state, etc.
	 */
	action: [payload: ActionEventPayload]
	/**
	 * Fired when Desktop wants to navigate to a different view.
	 * Also calls routeAdapter.navigate() if an adapter is provided.
	 */
	navigate: [target: NavigationTarget]
	/**
	 * Fired when the user opens a specific record.
	 */
	'record:open': [payload: RecordOpenEventPayload]
	/**
	 * Fired when Desktop needs records for a list view.
	 * The host app should fetch and populate HST.
	 */
	'load-records': [payload: LoadRecordsEventPayload]
	/**
	 * Fired when Desktop needs a single record for a form view.
	 * The host app should fetch and populate HST.
	 */
	'load-record': [payload: LoadRecordEventPayload]
}>()

const { availableDoctypes = [] } = props

const { stonecrop } = useStonecrop()

// State
const loading = ref(false)
const commandPaletteOpen = ref(false)

// HST-based form data management - field triggers are handled automatically by HST

// Computed property that reads from HST store for reactive form data
const currentViewData = computed<Record<string, any>>({
	get() {
		if (!stonecrop.value || !currentDoctype.value || !currentRecordId.value) {
			return {}
		}

		try {
			const record = stonecrop.value.getRecordById(currentDoctype.value, currentRecordId.value)
			// Return a plain shallow copy so AForm mutations don't propagate directly into
			// the HST reactive object, which would bypass field-trigger diffing and cause
			// setupDeepReactivity to fire triggers for all fields on every keystroke.
			return { ...(record?.get('') || {}) }
		} catch {
			return {}
		}
	},
	set(newData: Record<string, any>) {
		if (!stonecrop.value || !currentDoctype.value || !currentRecordId.value) {
			return
		}

		try {
			// Only update fields that actually changed to avoid triggering actions for unchanged fields
			const hstStore = stonecrop.value.getStore()
			for (const [fieldname, value] of Object.entries(newData)) {
				const fieldPath = `${currentDoctype.value}.${currentRecordId.value}.${fieldname}`
				const currentValue = hstStore.has(fieldPath) ? hstStore.get(fieldPath) : undefined
				if (currentValue !== value) {
					hstStore.set(fieldPath, value)
				}
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn('HST update failed:', error)
		}
	},
})

// Computed properties for current route context.
// When a routeAdapter is provided it takes full precedence over the registry's internal router.
const route = computed(() => (props.routeAdapter ? null : unref(stonecrop.value?.registry.router?.currentRoute)))
const router = computed(() => (props.routeAdapter ? null : stonecrop.value?.registry.router))
const currentDoctype = computed(() => {
	if (props.routeAdapter) return props.routeAdapter.getCurrentDoctype()
	if (!route.value) return ''

	// First check if we have actualDoctype in meta (from registered routes)
	if (route.value.meta?.actualDoctype) {
		return route.value.meta.actualDoctype as string
	}

	// For named routes, use params.doctype
	if (route.value.params.doctype) {
		return route.value.params.doctype as string
	}

	// For catch-all routes that haven't been registered yet, extract from path
	const pathMatch = route.value.params.pathMatch as string[] | undefined
	if (pathMatch && pathMatch.length > 0) {
		return pathMatch[0]
	}

	return ''
})

// The route doctype for display and navigation (e.g., 'todo')
const routeDoctype = computed(() => {
	if (props.routeAdapter) return props.routeAdapter.getCurrentDoctype()
	if (!route.value) return ''

	// Check route meta first
	if (route.value.meta?.doctype) {
		return route.value.meta.doctype as string
	}

	// For named routes, use params.doctype
	if (route.value.params.doctype) {
		return route.value.params.doctype as string
	}

	// For catch-all routes, extract from path
	const pathMatch = route.value.params.pathMatch as string[] | undefined
	if (pathMatch && pathMatch.length > 0) {
		return pathMatch[0]
	}

	return ''
})

const currentRecordId = computed(() => {
	if (props.routeAdapter) return props.routeAdapter.getCurrentRecordId()
	if (!route.value) return ''

	// For named routes, use params.recordId
	if (route.value.params.recordId) {
		return route.value.params.recordId as string
	}

	// For catch-all routes that haven't been registered yet, extract from path
	const pathMatch = route.value.params.pathMatch as string[] | undefined
	if (pathMatch && pathMatch.length > 1) {
		return pathMatch[1]
	}

	return ''
})
const isNewRecord = computed(() => currentRecordId.value?.startsWith('new-'))

// Determine current view based on route
const currentView = computed(() => {
	if (props.routeAdapter) return props.routeAdapter.getCurrentView()
	if (!route.value) {
		return 'doctypes'
	}

	// Home route
	if (route.value.name === 'home' || route.value.path === '/') {
		return 'doctypes'
	}

	// Named routes from registered doctypes
	if (route.value.name && route.value.name !== 'catch-all') {
		const routeName = route.value.name as string
		if (routeName.includes('form') || route.value.params.recordId) {
			return 'record'
		} else if (routeName.includes('list') || route.value.params.doctype) {
			return 'records'
		}
	}

	// Catch-all route - determine from path structure
	const pathMatch = route.value.params.pathMatch as string[] | undefined
	if (pathMatch && pathMatch.length > 0) {
		const view = pathMatch.length === 1 ? 'records' : 'record'
		return view
	}

	return 'doctypes'
})

// Computed properties (now that all helper functions are defined)
// Helper function to get available transitions for current record.
// Reads the actual FSM state from the record's `status` field (or falls back to the
// workflow initial state) so the available action buttons always reflect reality.
const getAvailableTransitions = () => {
	if (!stonecrop.value || !currentDoctype.value || !currentRecordId.value) {
		return []
	}

	try {
		const doctype = stonecrop.value.registry.getDoctype(currentDoctype.value)
		if (!doctype?.workflow) return []

		// Delegate state resolution to Stonecrop — reads record 'status', falls back to workflow.initial
		const currentState = stonecrop.value.getRecordState(currentDoctype.value, currentRecordId.value)

		// Delegate transition lookup to Doctype — no more manual workflow introspection
		const transitions = doctype.getAvailableTransitions(currentState)

		const recordData = currentViewData.value || {}

		// Each transition emits an 'action' event. The host app decides what to do
		// (call the server, trigger an FSM actor, update HST, etc.).
		return transitions.map(({ name, targetState }) => ({
			label: `${name} (→ ${targetState})`,
			action: () => {
				emit('action', {
					name,
					doctype: currentDoctype.value,
					recordId: currentRecordId.value,
					data: recordData,
				})
			},
		}))
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn('Error getting available transitions:', error)
		return []
	}
}

const actionElements = computed(() => {
	const elements: ActionElements[] = []

	switch (currentView.value) {
		case 'records':
			elements.push({
				type: 'button',
				label: 'New Record',
				action: () => void createNewRecord(),
			})
			break
		case 'record': {
			// Populate the Actions dropdown with every FSM transition available in the
			// record's current state.  Clicking a transition emits 'action'.
			const transitionActions = getAvailableTransitions()
			if (transitionActions.length > 0) {
				elements.push({
					type: 'dropdown',
					label: 'Actions',
					actions: transitionActions,
				})
			}
			break
		}
	}

	return elements
})

const navigationBreadcrumbs = computed(() => {
	const breadcrumbs: { title: string; to: string }[] = []

	if (currentView.value === 'records' && routeDoctype.value) {
		breadcrumbs.push(
			{ title: 'Home', to: '/' },
			{ title: formatDoctypeName(routeDoctype.value), to: `/${routeDoctype.value}` }
		)
	} else if (currentView.value === 'record' && routeDoctype.value) {
		const recordPath = currentRecordId.value
			? `/${routeDoctype.value}/${currentRecordId.value}`
			: route.value?.fullPath ?? ''
		breadcrumbs.push(
			{ title: 'Home', to: '/' },
			{ title: formatDoctypeName(routeDoctype.value), to: `/${routeDoctype.value}` },
			{ title: isNewRecord.value ? 'New Record' : 'Edit Record', to: recordPath }
		)
	}

	return breadcrumbs
})

// Command palette functionality
type Command = {
	title: string
	description: string
	action: () => void
}

const searchCommands = (query: string): Command[] => {
	const commands: Command[] = [
		{
			title: 'Go Home',
			description: 'Navigate to the home page',
			action: () => void doNavigate({ view: 'doctypes' }),
		},
		{
			title: 'Toggle Command Palette',
			description: 'Open/close the command palette',
			action: () => (commandPaletteOpen.value = !commandPaletteOpen.value),
		},
	]

	// Add doctype-specific commands
	if (routeDoctype.value) {
		commands.push({
			title: `View ${formatDoctypeName(routeDoctype.value)} Records`,
			description: `Navigate to ${routeDoctype.value} list`,
			action: () => void doNavigate({ view: 'records', doctype: routeDoctype.value }),
		})

		commands.push({
			title: `Create New ${formatDoctypeName(routeDoctype.value)}`,
			description: `Create a new ${routeDoctype.value} record`,
			action: () => void createNewRecord(),
		})
	}

	// Add available doctypes as commands
	availableDoctypes.forEach(doctype => {
		commands.push({
			title: `View ${formatDoctypeName(doctype)}`,
			description: `Navigate to ${doctype} list`,
			action: () => void doNavigate({ view: 'records', doctype }),
		})
	})

	// Filter commands based on query
	if (!query) return commands

	return commands.filter(
		cmd =>
			cmd.title.toLowerCase().includes(query.toLowerCase()) ||
			cmd.description.toLowerCase().includes(query.toLowerCase())
	)
}

const executeCommand = (command: Command) => {
	command.action()
	commandPaletteOpen.value = false
}

// Helper functions - moved here to avoid "before initialization" errors
const formatDoctypeName = (doctype: string): string => {
	return doctype
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

const getRecordCount = (doctype: string): number => {
	if (!stonecrop.value) return 0
	const recordIds = stonecrop.value.getRecordIds(doctype)
	return recordIds.length
}

// Internal navigation helper: emits 'navigate', then calls the adapter (if any)
// or falls back to the registry's Vue Router instance.
const doNavigate = async (target: NavigationTarget) => {
	emit('navigate', target)
	if (props.routeAdapter) {
		await props.routeAdapter.navigate(target)
	} else {
		if (target.view === 'doctypes') {
			await router.value?.push('/')
		} else if (target.view === 'records' && target.doctype) {
			await router.value?.push(`/${target.doctype}`)
		} else if (target.view === 'record' && target.doctype && target.recordId) {
			await router.value?.push(`/${target.doctype}/${target.recordId}`)
		}
	}
}

const navigateToDoctype = async (doctype: string) => {
	await doNavigate({ view: 'records', doctype })
}

const openRecord = async (recordId: string) => {
	const doctype = routeDoctype.value
	emit('record:open', { doctype, recordId })
	await doNavigate({ view: 'record', doctype, recordId })
}

const createNewRecord = async () => {
	const newId = `new-${Date.now()}`
	await doNavigate({ view: 'record', doctype: routeDoctype.value, recordId: newId })
}

// Schema generator functions - moved here to be available to computed properties
const getDoctypesSchema = (): SchemaTypes[] => {
	if (!availableDoctypes.length) return []

	const rows = availableDoctypes.map(doctype => ({
		id: doctype,
		doctype,
		display_name: formatDoctypeName(doctype),
		record_count: getRecordCount(doctype),
		actions: 'View Records',
	}))

	return [
		{
			fieldname: 'doctypes_table',
			component: 'ATable',
			columns: [
				{
					label: 'Doctype',
					name: 'doctype',
					fieldtype: 'Data',
					align: 'left',
					edit: false,
					width: '20ch',
				},
				{
					label: 'Name',
					name: 'display_name',
					fieldtype: 'Data',
					align: 'left',
					edit: false,
					width: '30ch',
				},
				{
					label: 'Records',
					name: 'record_count',
					fieldtype: 'Int',
					align: 'center',
					edit: false,
					width: '15ch',
				},
				{
					label: 'Actions',
					name: 'actions',
					fieldtype: 'Data',
					align: 'center',
					edit: false,
					width: '20ch',
				},
			] as TableColumn[],
			config: {
				view: 'list',
				fullWidth: true,
			} as TableConfig,
			rows,
		},
	]
}

const getRecordsSchema = (): SchemaTypes[] => {
	if (!currentDoctype.value) return []
	if (!stonecrop.value) return []

	const records = getRecords()
	const columns = getColumns()
	const idField = props.recordIdField || 'id'

	// If no columns are available, let the template fallback handle the loading state
	if (columns.length === 0) {
		return []
	}

	// Ensure the ID column is first so click handler can reliably find it
	const idColumn = columns.find(c => c.fieldname === idField)
	const otherColumns = columns.filter(c => c.fieldname !== idField)
	const orderedColumns = idColumn ? [idColumn, ...otherColumns] : columns

	const rows = records.map((record: any) => ({
		...record,
		// Use the canonical ID field for navigation
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		id: record[idField] || record.id || '',
		actions: 'Edit | Delete',
	}))

	return [
		{
			fieldname: 'records_table',
			component: 'ATable',
			columns: [
				...orderedColumns.map(col => ({
					label: col.label,
					name: col.fieldname,
					fieldtype: col.fieldtype,
					align: 'left',
					edit: false,
					width: '20ch',
				})),
				{
					label: 'Actions',
					name: 'actions',
					fieldtype: 'Data',
					align: 'center',
					edit: false,
					width: '20ch',
				},
			] as TableColumn[],
			config: {
				view: 'list',
				fullWidth: true,
			} as TableConfig,
			rows,
		},
	]
}

const getRecordFormSchema = (): SchemaTypes[] => {
	if (!currentDoctype.value) return []
	if (!stonecrop.value) return []

	try {
		const registry = stonecrop.value?.registry
		const doctype = registry?.registry[currentDoctype.value]

		if (!doctype?.schema) {
			// Let the template fallback handle the loading state
			return []
		}

		return registry.resolveSchema(doctype)
	} catch {
		return []
	}
}

// Additional data helper functions
const getRecords = () => {
	if (!stonecrop.value || !currentDoctype.value) {
		return []
	}

	const recordsNode = stonecrop.value.records(currentDoctype.value)
	const recordsData = recordsNode?.get('')

	if (recordsData && typeof recordsData === 'object' && !Array.isArray(recordsData)) {
		return Object.values(recordsData as Record<string, any>)
	}

	return []
}

const getColumns = () => {
	if (!stonecrop.value || !currentDoctype.value) return []

	try {
		const registry = stonecrop.value.registry
		const doctype = registry.registry[currentDoctype.value]

		if (doctype?.schema) {
			const schemaArray = 'toArray' in doctype.schema ? doctype.schema.toArray() : doctype.schema
			return schemaArray.map(field => ({
				fieldname: field.fieldname,
				label: ('label' in field && field.label) || field.fieldname,
				fieldtype: ('fieldtype' in field && field.fieldtype) || 'Data',
			}))
		}
	} catch {
		// Error getting schema - return empty array
	}

	return []
}

// Schema for different views - defined here after all helper functions are available
const currentViewSchema = computed(() => {
	switch (currentView.value) {
		case 'doctypes':
			return getDoctypesSchema()
		case 'records':
			return getRecordsSchema()
		case 'record':
			return getRecordFormSchema()
		default:
			return []
	}
})

const handleActionClick = (_label: string, action: (() => void | Promise<void>) | undefined) => {
	if (action) {
		void action()
	}
}

// Desktop does NOT own the delete lifecycle — it asks for confirmation, then emits
// an 'action' event.  The host app is responsible for removing the record from HST
// and calling the server.
const handleDelete = async (recordId?: string) => {
	const targetRecordId = recordId || currentRecordId.value
	if (!targetRecordId) return

	const confirmed = props.confirmFn
		? await props.confirmFn('Are you sure you want to delete this record?')
		: confirm('Are you sure you want to delete this record?')

	if (confirmed) {
		emit('action', {
			name: 'DELETE',
			doctype: currentDoctype.value,
			recordId: targetRecordId,
			data: currentViewData.value || {},
		})
	}
}

// Event handlers
const getRecordIdFromRow = (rowElement: HTMLTableRowElement): string | null => {
	const cell = rowElement.querySelector('td[data-rowindex]')
	if (!cell) return null

	const rowIndexAttr = cell.getAttribute('data-rowindex')
	if (rowIndexAttr === null) return null

	const rowIndex = parseInt(rowIndexAttr, 10)
	if (isNaN(rowIndex)) return null

	const records = getRecords()
	const record = records[rowIndex]
	if (!record) return null

	const idField = props.recordIdField || 'id'
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return record[idField] || record.id || null
}

const handleClick = async (event: Event) => {
	const target = event.target as HTMLElement
	const action = target.getAttribute('data-action')

	if (action === 'create') {
		await createNewRecord()
	}

	const cell = target.closest('td, th')
	if (cell) {
		const cellText = cell.textContent?.trim()
		const row = cell.closest('tr')

		if (cellText === 'View Records' && row) {
			// Get the doctype from the row data
			const cells = row.querySelectorAll('td')
			if (cells.length > 0) {
				const doctypeCell = cells[1] // Assuming doctype is in second column (first column is index)
				const doctype = doctypeCell.textContent?.trim()
				if (doctype) {
					await navigateToDoctype(doctype)
				}
			}
		} else if (cellText?.includes('Edit') && row) {
			const recordId = getRecordIdFromRow(row)
			if (recordId) {
				await openRecord(recordId)
			}
		} else if (cellText?.includes('Delete') && row) {
			const recordId = getRecordIdFromRow(row)
			if (recordId) {
				await handleDelete(recordId)
			}
		}
	}
}

const loadRecordData = () => {
	if (!stonecrop.value || !currentDoctype.value) return

	loading.value = true

	try {
		if (!isNewRecord.value) {
			// For existing records, ensure the record exists in HST.
			// The computed currentViewData will automatically read from HST.
			stonecrop.value.getRecordById(currentDoctype.value, currentRecordId.value)
		}
		// For new records, currentViewData computed property will return {} automatically.
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn('Error loading record data:', error)
	} finally {
		loading.value = false
	}
}

// Watch for route changes to load appropriate data
watch(
	[currentView, currentDoctype, currentRecordId],
	() => {
		if (currentView.value === 'records' && currentDoctype.value) {
			// Emit load-records event so host app can populate HST
			emit('load-records', { doctype: currentDoctype.value })
		} else if (currentView.value === 'record' && currentDoctype.value && currentRecordId.value) {
			// Emit load-record event so host app can fetch and populate HST
			emit('load-record', { doctype: currentDoctype.value, recordId: currentRecordId.value })
			loadRecordData()
		}
	},
	{ immediate: true }
)

// Stonecrop reactive computed properties update automatically when the instance
// becomes available — no manual watcher needed.

// Provide navigation helpers and an emitAction convenience function to child components.
const desktopMethods = {
	navigateToDoctype,
	openRecord,
	createNewRecord,
	handleDelete,
	/**
	 * Convenience wrapper so child components (e.g. slot content) can emit
	 * an action event without needing a direct reference to the emit function.
	 */
	emitAction: (name: string, data?: Record<string, any>) => {
		emit('action', {
			name,
			doctype: currentDoctype.value,
			recordId: currentRecordId.value,
			data: data ?? currentViewData.value ?? {},
		})
	},
}

provide('desktopMethods', desktopMethods)

onMounted(() => {
	// Add keyboard shortcuts
	const handleKeydown = (event: KeyboardEvent) => {
		// Ctrl+K or Cmd+K to open command palette
		if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
			event.preventDefault()
			commandPaletteOpen.value = true
		}
		// Escape to close command palette
		if (event.key === 'Escape' && commandPaletteOpen.value) {
			commandPaletteOpen.value = false
		}
	}

	document.addEventListener('keydown', handleKeydown)

	// Cleanup event listener on unmount
	return () => {
		document.removeEventListener('keydown', handleKeydown)
	}
})
</script>
