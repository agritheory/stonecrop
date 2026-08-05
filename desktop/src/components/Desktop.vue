<template>
	<div class="desktop" @click="handleClick">
		<!-- Action Set -->
		<ActionSet :elements="actionElements" @action-click="handleActionClick" />

		<!-- Main content using AForm -->
		<AForm
			v-if="currentViewSchema.length > 0"
			v-model:data="currentViewData"
			:schema="currentViewSchema"
			:errors="fieldErrors" />
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
// `isDraftRecordId`/`newDraftRecordId` come from @stonecrop/stonecrop rather than being spelled
// out here. Desktop mints the id but it is not the only reader: the composables in that package
// guard fetching, field initialization and workflow readiness on the same question, and when the
// two were written separately they disagreed — Desktop minted `new-<timestamp>` while the other
// dialect tested `=== 'new'`, so every guard over there was silently dead.
import { isDraftRecordId, newDraftRecordId, useStonecrop, useValidationStore } from '@stonecrop/stonecrop'
import { AForm, type AFormLinkNavigator, type ResolvedField, type ResolvedTable } from '@stonecrop/aform'
import type { ColumnSchema } from '@stonecrop/schema'
import { computed, onMounted, onUnmounted, provide, ref, unref, watch } from 'vue'

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

const {
	availableDoctypes = [],
	routeAdapter,
	recordIdField,
} = defineProps<{
	availableDoctypes?: string[]
	/**
	 * Pluggable router adapter. When provided, Desktop uses these functions for all
	 * routing instead of reaching into the registry's internal Vue Router instance.
	 * Nuxt hosts (or any host with custom route conventions) should supply this.
	 */
	routeAdapter?: RouteAdapter
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

const { stonecrop } = useStonecrop()

// Field-validation store (advisory, client-side). Pinia is a declared peerDependency, kept external
// in this package's build (rollupOptions), so `useValidationStore()` resolves the host app's single
// active Pinia directly — the old `getCurrentInstance().$pinia` workaround for the bundled-Pinia bug
// is no longer needed. Still guarded: validation is optional and Desktop predates it, so a host that
// mounts Desktop without Pinia disables validation gracefully instead of crashing on mount.
let validationStore: ReturnType<typeof useValidationStore> | null = null
try {
	validationStore = useValidationStore()
} catch {
	validationStore = null
}

// Inline field errors handed to AForm. Only surfaced in the record form view (currentView is
// defined below); empty elsewhere so a previous record's errors never bleed into a list view.
const fieldErrors = computed<Record<string, string[]>>(() =>
	currentView.value === 'record' ? (validationStore?.errorsByField ?? {}) : {}
)

// State
const loading = ref(false)
const commandPaletteOpen = ref(false)

// Form/list data management — each view produces a different data shape.
// List views (doctypes, records) return table row data keyed by fieldname.
// Record view returns HST record fields for two-way binding.
const currentViewData = computed<Record<string, any>>({
	get() {
		// Doctypes list — rows come from availableDoctypes prop (reactive via availableDoctypes)
		if (currentView.value === 'doctypes') {
			return {
				doctypes_table:
					availableDoctypes?.map(doctype => ({
						id: doctype,
						doctype,
						display_name: formatDoctypeName(doctype),
						record_count: getRecordCount(doctype),
						actions: 'View Records',
					})) ?? [],
			}
		}

		// Records list — rows come from HST store (reactive because HST is Vue reactive())
		if (currentView.value === 'records') {
			return {
				records_table: getRecords().map(record =>
					Object.assign({}, record, {
						id: resolveRecordId(record) ?? '',
						// A list row is navigation. Actions live on the record view, where the Actions
						// dropdown is built from what the doctype declares and what the record's
						// current state allows. This cell used to also offer Delete, which dispatched
						// an action named `DELETE` that Desktop invented — no doctype in a
						// WorkflowMeta app declares it, so it failed on every click. Removal is a
						// workflow outcome (`archive`, `cancel`) and belongs in the doctype.
						actions: 'Edit',
					})
				),
			}
		}

		// Record form — read single record from HST
		if (!stonecrop.value || !currentDoctype.value || !currentRecordId.value) {
			return {}
		}

		try {
			const record = stonecrop.value.getRecordById(currentDoctype.value, currentRecordId.value)
			// Return a plain shallow copy so AForm mutations don't propagate directly into
			// the HST reactive object, which would bypass field-trigger diffing and cause
			// setupDeepReactivity to fire triggers for all fields on every keystroke.
			const flat: Record<string, any> = { ...record?.get('') }

			// AFieldset receives data[fieldsetFieldname] as its data prop, so the fieldset's
			// children must be grouped under the fieldset key. The server returns flat SQL rows,
			// so we nest fieldset children here before AForm renders them.
			const doctype = stonecrop.value.registry.registry[currentDoctype.value]
			if (doctype) {
				for (const field of doctype.getSchemaArray()) {
					if (field.kind === 'fieldset') {
						const nested: Record<string, any> = {}
						for (const child of field.schema) {
							if (child.fieldname) nested[child.fieldname] = flat[child.fieldname]
						}
						flat[field.fieldname] = nested
					}
				}
			}
			return flat
		} catch {
			return {}
		}
	},
	set(newData: Record<string, any>) {
		// List views are read-only from AForm's perspective — HST writes only apply to record form
		if (currentView.value !== 'record') return
		if (!stonecrop.value || !currentDoctype.value || !currentRecordId.value) {
			return
		}

		try {
			// AForm emits nested data for fieldsets: { fieldsetKey: { childA: val } }.
			// HST and the server both expect flat rows, so flatten fieldset values back before writing.
			const doctype = stonecrop.value.registry.registry[currentDoctype.value]
			const fieldsetNames = new Set<string>()
			if (doctype) {
				for (const field of doctype.getSchemaArray()) {
					if (field.kind === 'fieldset') {
						fieldsetNames.add(field.fieldname)
					}
				}
			}

			// Two-pass flatten: non-fieldset keys first, then fieldset children.
			// Fieldset children must be applied last — AForm may emit stale flat copies
			// of fieldset children alongside the updated nested value, and the nested
			// value must win regardless of key insertion order.
			const flatData: Record<string, any> = {}
			const fieldsetValues: Record<string, any>[] = []
			for (const [key, value] of Object.entries(newData)) {
				if (fieldsetNames.has(key) && value && typeof value === 'object' && !Array.isArray(value)) {
					fieldsetValues.push(value)
				} else {
					flatData[key] = value
				}
			}
			for (const nestedValue of fieldsetValues) {
				Object.assign(flatData, nestedValue)
			}

			// Only update fields that actually changed. Never write undefined — AForm may emit
			// schema fields absent from the record as undefined; writing them would silently
			// clear values that exist in HST. Explicit null is allowed (intentional clear).
			const hstStore = stonecrop.value.getStore()
			const changedFields: string[] = []
			for (const [fieldname, value] of Object.entries(flatData)) {
				if (value === undefined) continue
				const fieldPath = `${currentDoctype.value}.${currentRecordId.value}.${fieldname}`
				const currentValue = hstStore.has(fieldPath) ? hstStore.get(fieldPath) : undefined
				if (currentValue !== value) {
					hstStore.set(fieldPath, value)
					changedFields.push(fieldname)
				}
			}

			// Advisory field-validation runs on the fields that actually changed (honors each
			// trigger's `on` set). Driven here, after the HST writes, so HST stays value-only.
			if (changedFields.length > 0) {
				driveFieldValidation(changedFields)
			}
		} catch (error) {
			console.warn('HST update failed:', error)
		}
	},
})

// Advisory field-validation: run the doctype's triggers for the fields that changed on this edit.
// Snapshots the post-edit record as a plain, flat object so validators read siblings read-only
// (the core store freezes it). Fire-and-forget — the reactive error store repaints AForm on resolve.
function driveFieldValidation(changedFields: string[]) {
	if (!validationStore || !stonecrop.value || !currentDoctype.value || !currentRecordId.value) return

	const doctype = stonecrop.value.registry.getDoctype(currentDoctype.value)
	const triggers = doctype?.getTriggers()
	if (!triggers || Object.keys(triggers).length === 0) return

	const node = stonecrop.value.getRecordById(currentDoctype.value, currentRecordId.value)
	const record = { ...(node?.get('') as Record<string, unknown>) }

	for (const field of changedFields) {
		void validationStore.validateField(triggers, field, record)
	}
}

// Computed properties for current route context.
// When a routeAdapter is provided it takes full precedence over the registry's internal router.
const route = computed(() => (routeAdapter ? null : unref(stonecrop.value?.registry.router?.currentRoute)))
const router = computed(() => (routeAdapter ? null : stonecrop.value?.registry.router))
const currentDoctype = computed(() => {
	if (routeAdapter) return routeAdapter.getCurrentDoctype()
	if (!route.value) return ''

	// First check if we have actualDoctype in meta (from registered routes)
	if (route.value.meta?.actualDoctype) {
		return route.value.meta.actualDoctype as string
	}

	// For named routes, use params.doctype
	if (route.value.params.doctype) {
		return route.value.params.doctype.toString()
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
	if (routeAdapter) return routeAdapter.getCurrentDoctype()
	if (!route.value) return ''

	// Check route meta first
	if (route.value.meta?.doctype) {
		return route.value.meta.doctype as string
	}

	// For named routes, use params.doctype
	if (route.value.params.doctype) {
		return route.value.params.doctype.toString()
	}

	// For catch-all routes, extract from path
	const pathMatch = route.value.params.pathMatch as string[] | undefined
	if (pathMatch && pathMatch.length > 0) {
		return pathMatch[0]
	}

	return ''
})

const currentRecordId = computed(() => {
	if (routeAdapter) return routeAdapter.getCurrentRecordId()
	if (!route.value) return ''

	// For named routes, use params.recordId
	if (route.value.params.recordId) {
		return route.value.params.recordId.toString()
	}

	// For catch-all routes that haven't been registered yet, extract from path
	const pathMatch = route.value.params.pathMatch as string[] | undefined
	if (pathMatch && pathMatch.length > 1) {
		return pathMatch[1]
	}

	return ''
})
const isNewRecord = computed(() => isDraftRecordId(currentRecordId.value))

// Determine current view based on route
const currentView = computed(() => {
	if (routeAdapter) return routeAdapter.getCurrentView()
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
		return transitions.map(({ name }) => ({
			// Prefer the workflow action's human-readable label (WorkflowMeta format);
			// fall back to the raw transition name for XState workflows with no action meta.
			label: doctype.getActionMeta(name)?.label ?? name,
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
		console.warn('Error getting available transitions:', error)
		return []
	}
}

// Helper: stateless Commands available for the current record — side-effect actions that
// change no workflow state. Surfaced in the same Actions dropdown as transitions; each emits
// the same 'action' event, so the host's handler runs a Command's clientHandler identically.
const getAvailableCommands = () => {
	if (!stonecrop.value || !currentDoctype.value || !currentRecordId.value) {
		return []
	}

	try {
		const doctype = stonecrop.value.registry.getDoctype(currentDoctype.value)
		if (!doctype?.workflow) return []

		const currentState = stonecrop.value.getRecordState(currentDoctype.value, currentRecordId.value)
		const commands = doctype.getAvailableCommands(currentState)
		const recordData = currentViewData.value || {}

		return commands.map(({ name }) => ({
			label: doctype.getActionMeta(name)?.label ?? name,
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
		console.warn('Error getting available commands:', error)
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
			// Populate the Actions dropdown with every FSM transition AND stateless Command
			// available in the record's current state.  Clicking either emits 'action'.
			const recordActions = [...getAvailableTransitions(), ...getAvailableCommands()]
			if (recordActions.length > 0) {
				elements.push({
					type: 'dropdown',
					label: 'Actions',
					actions: recordActions,
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
			: (route.value?.fullPath ?? '')
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
	if (routeAdapter) {
		await routeAdapter.navigate(target)
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
	await doNavigate({ view: 'record', doctype: routeDoctype.value, recordId: newDraftRecordId() })
}

// Flatten Fieldset containers into individual columns for list/table views.
// A Fieldset groups form fields visually but has no DB column; its children are the
// actual data fields and should appear as flat columns in a list view.
const flattenFieldsets = (fields: ResolvedField[]): ResolvedField[] => {
	const result: ResolvedField[] = []
	for (const field of fields) {
		if (field.kind === 'fieldset') {
			result.push(...flattenFieldsets(field.schema))
		} else {
			result.push(field)
		}
	}
	return result
}

// Schema generator functions - moved here to be available to computed properties
const getDoctypesSchema = (): ResolvedField[] => {
	if (!availableDoctypes?.length) return []

	return [
		{
			kind: 'table' as const,
			fieldname: 'doctypes_table',
			component: 'ATable',
			label: 'Doctypes',
			schema: [
				{
					fieldname: 'doctype',
					label: 'Doctype',
					component: 'ATextInput',
					align: 'left' as const,
					edit: false,
					width: '20ch',
				},
				{
					fieldname: 'display_name',
					label: 'Name',
					component: 'ATextInput',
					align: 'left' as const,
					edit: false,
					width: '30ch',
				},
				{
					fieldname: 'record_count',
					label: 'Records',
					component: 'ANumericInput',
					align: 'center' as const,
					edit: false,
					width: '15ch',
				},
				{
					fieldname: 'actions',
					label: 'Actions',
					component: 'ATextInput',
					align: 'center' as const,
					edit: false,
					width: '20ch',
				},
			],
			config: { view: 'list' as const, fullWidth: true },
		} satisfies ResolvedTable,
	]
}

const getRecordsSchema = (): ResolvedField[] => {
	if (!currentDoctype.value) return []
	if (!stonecrop.value) return []

	const registry = stonecrop.value.registry
	const doctype = registry.registry[currentDoctype.value]

	if (!doctype) return []

	const schema = registry.resolveSchema(doctype)

	// If no schema is available, let the template fallback handle the loading state
	if (schema.length === 0) return []

	return [
		{
			kind: 'table' as const,
			fieldname: 'records_table',
			component: 'ATable',
			schema: [
				...(flattenFieldsets(schema) as ColumnSchema[]),
				{ fieldname: 'actions', label: 'Actions', component: 'ATextInput' },
			],
			config: { view: 'list' as const, fullWidth: true },
		} satisfies ResolvedTable,
	]
}

const getRecordFormSchema = (): ResolvedField[] => {
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

/**
 * Resolve a record's identity for links and navigation.
 *
 * Precedence: the explicit `recordIdField` prop wins (a host that names a field has said which
 * column it means), then the doctype's declared `primaryKey`, then `id`. Before this, the default
 * was a bare `record.id`, which produced empty links for every natural-keyed doctype.
 *
 * Delegates to `Doctype.getRecordId` so this matches the key `Stonecrop.getRecords` stored the
 * record under — resolving it independently here would let a row render a link to an HST path
 * that does not exist.
 */
const resolveRecordId = (record: Record<string, unknown>): string | undefined => {
	if (recordIdField) {
		const explicit = record[recordIdField]
		if (typeof explicit === 'number') return String(explicit)
		if (typeof explicit === 'string' && explicit !== '') return explicit
	}
	if (!stonecrop.value || !currentDoctype.value) return undefined
	return stonecrop.value.registry.registry[currentDoctype.value]?.getRecordId(record)
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

	return resolveRecordId(record) ?? null
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
		} else if (cellText === 'Edit' && row) {
			// Matched exactly, not by substring. This handler is bound to the whole desktop, so a
			// substring match fired on any cell whose *data* happened to contain the word — a task
			// titled "Delete old backups" popped a delete confirmation when you clicked it.
			const recordId = getRecordIdFromRow(row)
			if (recordId) {
				await openRecord(recordId)
			}
		}
	}
}

const loadRecordData = async () => {
	if (!stonecrop.value || !currentDoctype.value || isNewRecord.value) return

	// Record already in HST — nothing to fetch.
	if (stonecrop.value.getRecordById(currentDoctype.value, currentRecordId.value)) return

	// Record absent and a client is configured — fetch directly so the form
	// populates even when the list view was never visited (direct URL navigation).
	if (stonecrop.value.getClient()) {
		loading.value = true
		try {
			await stonecrop.value.getRecord(currentDoctype.value, currentRecordId.value)
		} catch (error) {
			console.warn('Error fetching record:', error)
		} finally {
			loading.value = false
		}
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
			// A draft has nothing to fetch — the record does not exist on the server yet. Desktop
			// used to emit anyway and leave the host to work it out, which meant every host had to
			// recognise the private draft-id scheme above just to suppress a doomed request; all of
			// them did, identically. `loadRecordData` declines the same case for the same reason.
			if (isNewRecord.value) return

			// Emit load-record event so host app can fetch and populate HST
			emit('load-record', { doctype: currentDoctype.value, recordId: currentRecordId.value })
			void loadRecordData()
		}
	},
	{ immediate: true }
)

// Clear advisory validation errors when the target record changes, so errors from a previously
// edited record never bleed into a newly opened one.
watch([currentDoctype, currentRecordId], () => {
	validationStore?.clearAll()
})

// Stonecrop reactive computed properties update automatically when the instance
// becomes available — no manual watcher needed.

// Provide navigation helpers and an emitAction convenience function to child components.
const desktopMethods = {
	navigateToDoctype,
	openRecord,
	createNewRecord,
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

// Provide a navigator for AFormLink so the arrow button navigates to the linked record.
provide('aformLinkNavigator', {
	navigate: (doctype: string, id: string | number) => {
		void doNavigate({ view: 'record', doctype, recordId: String(id) })
	},
} satisfies AFormLinkNavigator)

function toDisplayString(rec: Record<string, unknown> | undefined): string | undefined {
	if (!rec) return undefined
	const val = rec.name ?? rec.title ?? rec.displayText
	return typeof val === 'string' || typeof val === 'number' ? String(val) : undefined
}

// Provide a resolver for AFormLink to look up display text by doctype + id.
// Checks HST first (sync); falls back to an async client fetch if not cached.
provide('aformLinkResolver', async (doctypeSlug: string, id: string): Promise<string | undefined> => {
	if (!stonecrop.value) return undefined
	try {
		const cached = stonecrop.value.getRecordById(doctypeSlug, id)?.get('') as Record<string, unknown> | undefined
		const cachedDisplay = toDisplayString(cached)
		if (cachedDisplay != null) return cachedDisplay
		await stonecrop.value.getRecord(doctypeSlug, id)
		const fetched = stonecrop.value.getRecordById(doctypeSlug, id)?.get('') as Record<string, unknown> | undefined
		return toDisplayString(fetched)
	} catch {
		return undefined
	}
})

const handleKeydown = (event: KeyboardEvent) => {
	if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
		event.preventDefault()
		commandPaletteOpen.value = true
	}
	if (event.key === 'Escape' && commandPaletteOpen.value) {
		commandPaletteOpen.value = false
	}
}

onMounted(() => {
	document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeydown)
})
</script>
