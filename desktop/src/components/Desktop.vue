<template>
	<div
		class="desktop"
		:class="{
			'desktop--action-set-open': actionSetDrawerOpen,
			'desktop--preview-open': actionSetPreviewOpen,
			'desktop--preview-resizing': previewResizing,
		}">
		<div ref="workspace" class="desktop__workspace">
			<div class="desktop__main">
				<slot v-if="$slots.default" />
				<AForm
					v-else-if="currentViewSchema.length > 0 && !draftLoading && recordLoadState === 'loaded'"
					v-model:data="currentViewData"
					:schema="currentViewSchema"
					:errors="fieldErrors" />
				<div v-else-if="!stonecrop" class="loading"><p>Initializing Stonecrop...</p></div>
				<div v-else-if="draftLoading" class="loading">
					<p>Preparing new {{ formatDoctypeName(currentDoctype) }}...</p>
				</div>
				<div v-else-if="recordLoadState === 'notFound'" class="loading">
					<div class="desktop__load-state">
						<p class="desktop__load-title">
							{{ formatDoctypeName(currentDoctype) }} {{ currentRecordId }} was not found.
						</p>
						<p class="desktop__load-detail">It may have been deleted, or the link may be wrong.</p>
					</div>
				</div>
				<div v-else-if="recordLoadState === 'failed'" class="loading">
					<div class="desktop__load-state">
						<p class="desktop__load-title desktop__load-title--failed">
							Couldn't load {{ formatDoctypeName(currentDoctype) }} {{ currentRecordId }}.
						</p>
						<p class="desktop__load-detail">{{ recordLoadMessage }}</p>
						<button type="button" class="desktop__load-retry" @click="retryRecordLoad">Try again</button>
					</div>
				</div>
				<div v-else class="loading">
					<p>Loading {{ currentView }} data...</p>
				</div>
			</div>

			<aside v-if="actionSetPreviewSubject" ref="previewEl" class="desktop__preview" :style="previewStyle">
				<div
					class="desktop__preview-resize"
					role="separator"
					aria-orientation="vertical"
					aria-label="Resize preview"
					:aria-valuenow="Math.round(previewFraction * 100)"
					:aria-valuemin="Math.round(previewBounds.min * 100)"
					:aria-valuemax="Math.round(previewBounds.max * 100)"
					tabindex="0"
					title="Drag to resize · double-click to reset"
					@pointerdown="onPreviewResizeStart"
					@dblclick="resetPreviewWidth"
					@keydown="onPreviewResizeKeydown" />
				<header class="desktop__preview-header">
					<button
						type="button"
						ref="previewCloseEl"
						class="desktop__preview-close"
						aria-label="Close preview"
						@click="closeActionSetPreview">
						×
					</button>
				</header>
				<div class="desktop__preview-body">
					<component :is="actionSetPreviewSubject.view" v-bind="actionSetPreviewSubject.props ?? {}" />
				</div>
			</aside>
		</div>

		<ActionSet
			:slots="visibleActionSetSlots"
			:elements="actionElements"
			:controller="actionSetController"
			:search="resolvedCommandSearch"
			:search-placeholder="commandSearchPlaceholder"
			@action-click="handleActionClick"
			@search-select="onSearchSelect">
			<template #search-title="{ result }">
				{{ (result as Command).title }}
			</template>
			<template #search-content="{ result }">
				{{ (result as Command).description }}
			</template>
		</ActionSet>

		<SheetNav class="desktop__sheetnav" :breadcrumbs="sheetBreadcrumbs">
			<template #toolbar>
				<slot name="sheetnav-toolbar" />
			</template>
		</SheetNav>
	</div>
</template>

<script setup lang="ts">
// The draft segment comes from @stonecrop/stonecrop rather than being spelled out here: that
// package guards fetching, field initialization and workflow readiness on the same question, and
// when the two were written separately they disagreed and every guard over there went dead.
import { isDraftRecordId, useStonecrop, useValidationStore, type EditableRecord } from '@stonecrop/stonecrop'
import {
	AForm,
	type AFormLinkNavigator,
	resolvedFieldsToColumns,
	type ResolvedField,
	type ResolvedTable,
} from '@stonecrop/aform'
import {
	computed,
	getCurrentInstance,
	markRaw,
	nextTick,
	onMounted,
	onUnmounted,
	provide,
	ref,
	shallowRef,
	toRaw,
	unref,
	watch,
} from 'vue'

import ActionSet from './ActionSet.vue'
import DesktopRowLink from './DesktopRowLink.vue'
import SheetNav from './SheetNav.vue'
import { createActionSet, actionSetKey } from '../composables/useActionSet'
import { usePreviewSplit } from '../composables/usePreviewSplit'
import { ROW_LINK_COMPONENT, openListRowKey } from '../row-link'
import type {
	ActionElements,
	RouteAdapter,
	NavigationTarget,
	ActionEventPayload,
	RecordOpenEventPayload,
	LoadRecordsEventPayload,
	LoadRecordEventPayload,
	ActionSetSlot,
} from '../types'

type CommandSearchResult = {
	title: string
	description: string
	action: () => void
}

const {
	availableDoctypes = [],
	routeAdapter,
	actionSetSlots,
	hostActions,
	breadcrumbs: hostBreadcrumbs,
	commandSearch,
	commandSearchPlaceholder = 'Type a command or search...',
} = defineProps<{
	availableDoctypes?: string[]
	/**
	 * Pluggable router adapter. When provided, Desktop uses these functions for all
	 * routing instead of reaching into the registry's internal Vue Router instance.
	 * Nuxt hosts (or any host with custom route conventions) should supply this.
	 */
	routeAdapter?: RouteAdapter
	/** Host drawer slots, each shown as a tile in the ActionSet column. */
	actionSetSlots?: ActionSetSlot[]
	/**
	 * When provided, the Actions drawer lists exactly these, in place of the actions Desktop derives from the doctype;
	 * `[]` lists none. A list shows every action its doctype declares, so an app whose list and record share a doctype
	 * passes its list's actions (New, say) on list views, and leaves this unset on others.
	 */
	hostActions?: ActionElements[]
	/** When provided, replaces Desktop's default doctype-navigation breadcrumbs in SheetNav. */
	breadcrumbs?: { title: string; to: string }[]
	/** When provided, replaces Desktop's built-in command palette search (e.g. documentation site pages). */
	commandSearch?: (query: string) => CommandSearchResult[]
	commandSearchPlaceholder?: string
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
	 * Fired when Desktop is about to read records for a list view. A notification, not a request:
	 * Desktop performs the read itself through `Stonecrop.getRecords`. A host that fetches here
	 * races that read into the same HST key.
	 */
	'load-records': [payload: LoadRecordsEventPayload]
	/**
	 * Fired when Desktop is about to read a single record for a form view. A notification, not a
	 * request — see `load-records`. Not emitted for a draft, which has nothing to fetch.
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
// The last record read that failed, kept with the record it was for so it never shows on another.
const recordLoadFailure = ref<{ doctype: string; recordId: string; error: unknown } | null>(null)

// The record the form edits, from `editRecord`: a saved record lives in HST, and one on a
// `/{doctype}/new` route is held by this object instead, since a draft has no identity to be keyed by
// (see `DRAFT_RECORD_ID`). Either way a field set through it runs that field's rules.
const editedRecord = shallowRef<EditableRecord>()
// True while a new record's starting values are still arriving. The form stays behind the loading state until
// then, so no late value can land on top of what a user has typed.
const draftLoading = ref(false)

// Form/list data management — each view produces a different data shape.
// List views (doctypes, records) return table row data keyed by fieldname.
// Record view returns the record's fields for two-way binding, through `editedRecord`.
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

		// Record form: read through the record being edited
		const record = editedRecord.value
		if (!record) return {}

		try {
			// A plain shallow copy, so a field AForm replaces reaches the record only through `set`, which
			// is where a field's rules run.
			return { ...(record.get('') as Record<string, any> | undefined) }
		} catch {
			return {}
		}
	},
	set(newData: Record<string, any>) {
		// List views are read-only from AForm's perspective; writes only apply to the record form
		if (currentView.value !== 'record') return
		const record = editedRecord.value
		if (!record) return

		try {
			// Only update fields that actually changed. Never write undefined — AForm may emit
			// schema fields absent from the record as undefined; writing them would silently
			// clear values that exist. Explicit null is allowed (intentional clear).
			const changedFields: string[] = []
			for (const [fieldname, value] of Object.entries(newData)) {
				if (value === undefined) continue
				if (record.get(fieldname) !== value) {
					record.set(fieldname, value)
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

	// Read through the edited record: a draft's siblings are not in HST, so reading there would hand
	// every validator an empty record.
	const record = { ...(editedRecord.value?.get('') as Record<string, unknown> | undefined) }

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

// What the record view can draw. A record that is not in the store is never drawn as an empty form:
// it is still loading, the server did not find it, or the read failed.
const recordLoadState = computed<'loaded' | 'loading' | 'notFound' | 'failed'>(() => {
	if (currentView.value !== 'record' || isNewRecord.value) return 'loaded'
	if (!stonecrop.value || !currentDoctype.value || !currentRecordId.value) return 'loaded'
	if (stonecrop.value.getRecordById(currentDoctype.value, currentRecordId.value)) return 'loaded'

	const failure = recordLoadFailure.value
	if (!failure || failure.doctype !== currentDoctype.value || failure.recordId !== currentRecordId.value) {
		return 'loading'
	}
	// `getRecord` declares this code for a record the server does not have.
	return (failure.error as { code?: unknown } | null)?.code === 'RECORD_NOT_FOUND' ? 'notFound' : 'failed'
})

const recordLoadMessage = computed(() => {
	const error = recordLoadFailure.value?.error
	return error instanceof Error ? error.message : String(error ?? '')
})

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
// workflow's first state) so the available action buttons always reflect reality. A record
// not created yet has no state, and is offered only the actions that can run on it.
const getAvailableTransitions = () => {
	if (!stonecrop.value || !currentDoctype.value || !currentRecordId.value) {
		return []
	}

	try {
		const doctype = stonecrop.value.registry.getDoctype(currentDoctype.value)
		if (!doctype?.workflow) return []

		// Delegate state resolution to Stonecrop: reads record 'status', falls back to the workflow's
		// first state, and is null for a record not created yet
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

// Every action a list's doctype declares, one button each. A list has no record, so each is raised
// without a `recordId`.
const getListActions = (): ActionElements[] => {
	const doctypeSlug = currentDoctype.value
	const doctype = doctypeSlug ? stonecrop.value?.registry.getDoctype(doctypeSlug) : undefined
	if (!doctype) return []

	return doctype.getActions().map(({ name }) => ({
		type: 'button' as const,
		label: doctype.getActionMeta(name)?.label ?? name,
		action: () => emit('action', { name, doctype: doctypeSlug, data: {} }),
	}))
}

const actionElements = computed(() => {
	if (hostActions) {
		return hostActions
	}

	const elements: ActionElements[] = []

	switch (currentView.value) {
		case 'records':
			elements.push(...getListActions())
			break
		case 'record': {
			// No actions until there is a record on screen to act on: a new record's starting values, or
			// an existing record read into the store.
			if (draftLoading.value || recordLoadState.value !== 'loaded') break
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

const sheetBreadcrumbs = computed(() => hostBreadcrumbs ?? navigationBreadcrumbs.value)

// Command palette functionality
type Command = CommandSearchResult

const resolvedCommandSearch = (query: string): Command[] => {
	if (commandSearch) {
		return commandSearch(query)
	}
	return searchCommands(query)
}

const searchCommands = (query: string): Command[] => {
	const commands: Command[] = [
		{
			title: 'Go Home',
			description: 'Navigate to the home page',
			action: () => void doNavigate({ view: 'doctypes' }),
		},
		{
			title: 'Toggle Search',
			description: 'Open/close the search panel',
			action: () => {
				if (actionSetController.isSearchOpen.value) {
					actionSetController.close()
				} else {
					actionSetController.openSearch()
				}
			},
		},
	]

	// Add doctype-specific commands
	if (routeDoctype.value) {
		commands.push({
			title: `View ${formatDoctypeName(routeDoctype.value)} Records`,
			description: `Navigate to ${routeDoctype.value} list`,
			action: () => void doNavigate({ view: 'records', doctype: routeDoctype.value }),
		})
	}

	// A list page offers each action its drawer shows, the host's included.
	if (currentView.value === 'records') {
		const listActions = actionElements.value.flatMap(element => {
			if (element.type === 'dropdown') return element.actions
			return element.disabled ? [] : [element]
		})
		for (const { label, action, show } of listActions) {
			if (!action || show === false) continue
			commands.push({ title: label, description: `Run on the ${routeDoctype.value} list`, action })
		}
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
	actionSetController.close()
}

const onSearchSelect = (result: unknown) => {
	executeCommand(result as Command)
}

// List reads are wired on the records table; ATable owns the fetch via getRecords.
const listRecordsFetcher = (options?: import('@stonecrop/schema').GetRecordsOptions) => {
	if (!stonecrop.value || !currentDoctype.value) {
		return Promise.resolve({ data: [], hasMore: false })
	}
	const doctype = stonecrop.value.registry.getDoctype(currentDoctype.value)
	if (!doctype) {
		return Promise.resolve({ data: [], hasMore: false })
	}
	return stonecrop.value.getRecords(doctype, options)
}

// Helper functions - moved here to avoid "before initialization" errors
const formatDoctypeName = (doctype: string): string => {
	return doctype
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
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
				// No record count column. It read `getRecordIds(doctype).length`, which is how many
				// records HST happens to hold — zero for a doctype never opened, and the page size
				// for one that was. The real total belongs to the backend and Desktop never asks
				// for it, so this shell cannot answer it. Same reason the `recordIdField` prop went.
				{
					fieldname: 'actions',
					label: 'Actions',
					component: 'ATextInput',
					cellComponent: ROW_LINK_COMPONENT,
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

	const doctypeSlug = currentDoctype.value
	const clientConfigured = Boolean(stonecrop.value.getClient())

	return [
		{
			kind: 'table' as const,
			fieldname: 'records_table',
			component: 'ATable',
			// Which resolved fields a cell can render is answered once, in @stonecrop/aform; never
			// re-derive it here. Flattening alone is not the rule: it kept the expanding links, whose
			// value is a nested record or an array of them.
			schema: [
				...resolvedFieldsToColumns(schema),
				{ fieldname: 'actions', label: 'Actions', component: 'ATextInput', cellComponent: ROW_LINK_COMPONENT },
			],
			config: { view: 'list' as const, fullWidth: true },
			...(clientConfigured ? { getRecords: listRecordsFetcher, sourceKey: doctypeSlug } : {}),
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
 * Identity is declared once, on the doctype: `primaryKey`, or `id` when nothing is declared.
 * Delegating to `Doctype.getRecordId` is what guarantees this matches the key
 * `Stonecrop.getRecords` stored the record under — resolving it independently here would let a
 * row render a link to an HST path that does not exist.
 *
 * There is deliberately no per-shell override. Identity is a per-doctype fact and one shell
 * renders many doctypes, so a single prop cannot answer it; a shell that named a field would
 * also be overriding the very declaration the store keyed on, which is the bug above.
 */
const resolveRecordId = (record: Record<string, unknown>): string | undefined => {
	if (!stonecrop.value || !currentDoctype.value) return undefined
	return stonecrop.value.registry.registry[currentDoctype.value]?.getRecordId(record)
}

// What a list's link opens. Each link is handed its own row, so nothing reads a cell's text to learn what
// was clicked: a records list's row is a record, and a doctypes list's row a doctype.
const openListRow = async (row: Record<string, unknown>) => {
	if (currentView.value === 'doctypes') {
		await navigateToDoctype(String(row.doctype))
		return
	}
	const recordId = resolveRecordId(row)
	if (recordId) await openRecord(recordId)
}

// Reads go through Stonecrop, which owns whether to fetch, how to key the result, and where to
// put it. Desktop asks for data and renders what arrives; it decides none of that itself.
//
// Both loaders are no-ops without a client, so a host that populates HST some other way keeps
// working unchanged rather than taking a thrown error on every navigation; the record view waits
// for its record to appear.
const loadRecordData = async () => {
	if (!stonecrop.value || !currentDoctype.value || !stonecrop.value.getClient()) return

	const doctype = currentDoctype.value
	const recordId = currentRecordId.value
	recordLoadFailure.value = null
	try {
		await stonecrop.value.getRecord(doctype, recordId)
	} catch (error) {
		// A read that fails after the user has moved on belongs to no record on screen.
		if (doctype === currentDoctype.value && recordId === currentRecordId.value) {
			recordLoadFailure.value = { doctype, recordId, error }
		}
	}
}

const retryRecordLoad = () => {
	void loadRecordData()
}

// Watch for route changes to load appropriate data
watch(
	[currentView, currentDoctype, currentRecordId],
	() => {
		// The events are notifications, not fetch requests: they announce what Desktop is about to
		// read so a host can hang analytics or a prefetch off them. The read itself is Stonecrop's.
		if (currentView.value === 'records' && currentDoctype.value) {
			emit('load-records', { doctype: currentDoctype.value })
		} else if (currentView.value === 'record' && currentDoctype.value && currentRecordId.value) {
			// A draft has nothing to fetch — the record does not exist on the server yet. Desktop
			// used to emit anyway and leave the host to work it out, which meant every host had to
			// recognise the private draft-id scheme above just to suppress a doomed request; all of
			// them did, identically. `getRecord` declines the same case for the same reason.
			if (isNewRecord.value) return

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

// Seeding on entry gives a new record the doctype's declared defaults, which it never used to get.
// Discarding on exit matters as much: the draft segment is one shared literal, so a reused record
// would open the next new record pre-filled with the abandoned one's values.
watch(
	[currentDoctype, currentRecordId],
	() => {
		draftLoading.value = false
		editedRecord.value = undefined
		const app = stonecrop.value
		const slug = currentDoctype.value
		const recordId = currentRecordId.value
		if (!app || !slug || !recordId) return
		if (!isNewRecord.value) {
			editedRecord.value = app.editRecord(slug, recordId)
			return
		}
		const registry = app.registry
		const doctype = registry.getDoctype(slug)
		if (!doctype) {
			editedRecord.value = app.editRecord(slug, recordId, registry.initializeRecord(getRecordFormSchema()))
			return
		}
		draftLoading.value = true
		const stillHere = () => isNewRecord.value && currentDoctype.value === slug
		// Taken before the build waits on anything, so only this form uses what the app filled in.
		const prefill = registry.takePrefill(doctype.slug)
		void registry
			.composeNewRecord(doctype, { prefill })
			.then(({ record }) => {
				if (!stillHere()) return undefined
				editedRecord.value = app.editRecord(slug, recordId, record)
				return undefined
			})
			.catch((error: unknown) => {
				// A failure outside any one starting value (those are skipped and reported where they fail): open the
				// form with the schema's own values rather than leave it loading.
				console.error(`[desktop] Could not prepare a new ${slug}:`, error)
				if (stillHere()) {
					editedRecord.value = app.editRecord(slug, recordId, registry.initializeRecord(getRecordFormSchema()))
				}
			})
			.finally(() => {
				if (stillHere()) draftLoading.value = false
			})
	},
	{ immediate: true }
)

// Stonecrop reactive computed properties update automatically when the instance
// becomes available — no manual watcher needed.

// Provide navigation helpers and an emitAction convenience function to child components.
const desktopMethods = {
	navigateToDoctype,
	openRecord,
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

// ATable finds a column's cell component only by a name registered on the app, and hosts mount Desktop
// without installing its plugin, so Desktop registers its list link itself.
const app = getCurrentInstance()?.appContext.app
if (app && !app.component(ROW_LINK_COMPONENT)) app.component(ROW_LINK_COMPONENT, DesktopRowLink)
provide(openListRowKey, openListRow)

// Provide a navigator for AFormLink so the arrow button navigates to the linked record.
provide('aformLinkNavigator', {
	navigate: (doctype: string, id: string | number) => {
		void doNavigate({ view: 'record', doctype, recordId: String(id) })
	},
} satisfies AFormLinkNavigator)

// Provide a resolver for AFormLink to look up display text by doctype + id.
// Checks HST first (sync); falls back to an async client fetch if not cached.
// Uses the target doctype's declared displayField — no heuristic field guessing.
provide('aformLinkResolver', async (doctypeSlug: string, id: string): Promise<string | undefined> => {
	if (!stonecrop.value) return undefined
	try {
		const meta = await stonecrop.value.getMeta({ path: `/${doctypeSlug}`, segments: [doctypeSlug] })
		const displayField = meta?.displayField
		if (!displayField) return undefined

		const readDisplay = (rec: Record<string, unknown> | undefined): string | undefined => {
			if (!rec) return undefined
			const val = rec[displayField]
			return typeof val === 'string' || typeof val === 'number' ? String(val) : undefined
		}

		const cached = stonecrop.value.getRecordById(doctypeSlug, id)?.get('') as Record<string, unknown> | undefined
		const cachedDisplay = readDisplay(cached)
		if (cachedDisplay != null) return cachedDisplay

		await stonecrop.value.getRecord(doctypeSlug, id)
		const fetched = stonecrop.value.getRecordById(doctypeSlug, id)?.get('') as Record<string, unknown> | undefined
		return readDisplay(fetched)
	} catch {
		return undefined
	}
})

const handleKeydown = (event: KeyboardEvent) => {
	if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
		event.preventDefault()
		actionSetController.openSearch()
	}
	if (event.key === 'Escape') {
		// Mid-drag, Escape abandons the resize; the preview stays open.
		if (previewResizing.value) {
			event.preventDefault()
			cancelPreviewResize()
			return
		}
		if (actionSetController.isPreviewOpen.value) {
			actionSetController.closePreview()
			return
		}
		if (actionSetController.isDrawerOpen.value) {
			actionSetController.close()
		}
	}
}

const visibleActionSetSlots = computed(() =>
	(actionSetSlots ?? [])
		.filter(slot => slot.show !== false)
		.map(slot =>
			Object.assign({}, slot, {
				// A host's slots may be reactive, so each component is unwrapped before it is marked raw.
				icon: slot.icon ? markRaw(toRaw(slot.icon)) : undefined,
				component: slot.component ? markRaw(toRaw(slot.component)) : undefined,
			})
		)
)

const actionSetController = createActionSet({ doctype: currentDoctype, recordId: currentRecordId })
provide(actionSetKey, actionSetController)

const actionSetDrawerOpen = computed(() => actionSetController.isDrawerShown.value)
const actionSetPreviewOpen = computed(() => actionSetController.isPreviewOpen.value)
const actionSetPreviewSubject = computed(() => actionSetController.previewSubject.value)

watch([currentDoctype, currentRecordId], () => {
	actionSetController.close()
})

function closeActionSetPreview() {
	actionSetController.closePreview()
}

const workspace = ref<HTMLElement | null>(null)
const {
	fraction: previewFraction,
	bounds: previewBounds,
	resizing: previewResizing,
	previewStyle,
	onPointerDown: onPreviewResizeStart,
	onKeydown: onPreviewResizeKeydown,
	reset: resetPreviewWidth,
	cancel: cancelPreviewResize,
} = usePreviewSplit(workspace)

const previewEl = ref<HTMLElement | null>(null)
const previewCloseEl = ref<HTMLElement | null>(null)
// Whatever had focus when the preview opened, usually the control in the drawer that opened it.
let previewOpener: HTMLElement | null = null

// Runs before the DOM updates, so on close the preview, and whether it holds focus, is still there.
watch(actionSetPreviewOpen, async open => {
	if (typeof document === 'undefined') return
	if (open) {
		previewOpener = document.activeElement instanceof HTMLElement ? document.activeElement : null
		await nextTick()
		// A preview that replaced the drawer has hidden the control that opened it, taking focus with it.
		if (actionSetController.isDrawerOpen.value && !actionSetController.isDrawerShown.value) {
			previewCloseEl.value?.focus()
		}
		return
	}
	cancelPreviewResize()
	const opener = previewOpener
	previewOpener = null
	// Only when the preview held focus: closing it otherwise leaves focus where the user put it.
	if (!previewEl.value?.contains(document.activeElement)) return
	await nextTick()
	if (opener?.isConnected) opener.focus()
})

onMounted(() => {
	document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.desktop {
	position: relative;
	height: 100%;
	display: flex;
	flex-direction: column;
	min-height: 0;
	overflow: hidden;
}

.desktop__workspace {
	display: flex;
	flex: 1;
	min-height: 0;
	min-width: 0;
	margin-right: 0;
	transition: margin-right 0.25s ease-out;
}

/* Pull workspace 1px under the drawer so Firefox does not leave a hairline at the seam. */
.desktop--action-set-open .desktop__workspace {
	margin-right: calc(var(--sc-action-set-drawer-width) - 1px);
}

/* SheetNav is fixed to the viewport, so the workspace margin does not move it clear of the drawer. */
.desktop__sheetnav {
	transition: right 0.25s ease-out;
}

.desktop--action-set-open .desktop__sheetnav {
	right: var(--sc-action-set-drawer-width);
}

.desktop__main {
	flex: 1;
	min-width: 0;
	min-height: 0;
	overflow: auto;
	/* Keep the scroll track left of the fixed tile column (drawer open shifts workspace instead). */
	padding-right: calc(var(--sc-action-set-rail-width) + var(--sc-action-set-tile-gap));
	scrollbar-gutter: stable;
}

.desktop--action-set-open .desktop__main {
	padding-right: 0;
	/* Stable gutter reserves a column in Firefox; release it when the drawer owns the right edge. */
	scrollbar-gutter: auto;
}

.desktop--preview-open .desktop__main {
	flex: 1 1 0;
}

.desktop__preview {
	position: relative;
	flex: 0 0 50%;
	min-width: 0;
	min-height: 0;
	display: flex;
	flex-direction: column;
	border-left: 1px solid var(--sc-gray-20);
	background: var(--sc-form-background);
	overflow: hidden;
}

.desktop__preview-resize {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	z-index: 1;
	width: 8px;
	cursor: col-resize;
	touch-action: none;
}

.desktop__preview-resize::before {
	content: '';
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: 2px;
	background: transparent;
	transition: background-color 0.15s ease;
}

.desktop__preview-resize:hover::before,
.desktop__preview-resize:focus-visible::before,
.desktop--preview-resizing .desktop__preview-resize::before {
	background: var(--sc-primary-color);
}

.desktop__preview-resize:focus-visible {
	outline: none;
}

.desktop--preview-resizing {
	cursor: col-resize;
	user-select: none;
}

.desktop--preview-resizing .desktop__preview-body {
	pointer-events: none;
}

.desktop__preview-header {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 40px;
	padding: 0 8px;
	border-bottom: 1px solid var(--sc-gray-20);
	flex-shrink: 0;
}

.desktop__preview-close {
	border: none;
	background: transparent;
	font-size: 1.25rem;
	line-height: 1;
	cursor: pointer;
	color: var(--sc-gray-60);
}

.desktop__preview-body {
	flex: 1;
	min-height: 0;
	overflow: auto;
}

.loading {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 50vh;
	color: var(--sc-gray-60);
}

.desktop__load-state {
	max-width: 36rem;
	text-align: center;
}

.desktop__load-title {
	margin: 0;
	font-size: var(--sc-font-size);
	font-weight: 600;
	color: var(--sc-gray-80);
}

.desktop__load-title--failed {
	color: var(--sc-brand-danger);
}

.desktop__load-detail {
	margin: 0.5rem 0 0;
	font-size: 0.875rem;
}

/* ATable's pagination button, so the two retries look alike. */
.desktop__load-retry {
	appearance: none;
	box-sizing: border-box;
	margin-top: 1rem;
	padding: 0.5rem 1rem;
	background: var(--sc-btn-color);
	color: var(--sc-btn-label-color);
	border: 1px solid var(--sc-btn-border);
	border-radius: var(--sc-border-radius);
	cursor: pointer;
	font-family: var(--sc-font-family);
	font-size: var(--sc-font-size);
	font-weight: 400;
	line-height: 1.2;
	transition: background-color 0.15s ease;
}

.desktop__load-retry:hover {
	background: var(--sc-btn-hover);
}

.desktop__load-retry:focus-visible {
	outline: 2px solid var(--sc-input-active-border-color);
	outline-offset: 1px;
}
</style>
