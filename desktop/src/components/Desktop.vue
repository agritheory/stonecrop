<template>
	<div class="desktop" @click="handleClick">
		<!-- Action Set -->
		<ActionSet :elements="actionElements" />

		<!-- Main content using AForm -->
		<AForm v-if="currentViewSchema.length > 0" v-model="currentViewSchema" :data="currentViewData" />
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
import { computed, nextTick, onMounted, provide, ref, unref, watch } from 'vue'

import ActionSet from './ActionSet.vue'
import SheetNav from './SheetNav.vue'
import CommandPalette from './CommandPalette.vue'
import type { ActionElements } from '../types'

type Props = {
	availableDoctypes?: string[]
}

const { availableDoctypes = [] } = defineProps<Props>()

const { stonecrop } = useStonecrop()

// State
const loading = ref(false)
const saving = ref(false)
const currentViewData = ref<Record<string, any>>({})
const commandPaletteOpen = ref(false)

// Computed properties for current route context
const route = computed(() => unref(stonecrop.value?.registry.router?.currentRoute))
const router = computed(() => stonecrop.value?.registry.router)
const currentDoctype = computed(() => {
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
	if (!route.value) return 'doctypes'

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
		return pathMatch.length === 1 ? 'records' : 'record'
	}

	return 'doctypes'
})

// Schema for different views
const currentViewSchema = computed<SchemaTypes[]>(() => {
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

// New component reactive properties
const actionElements = computed<ActionElements[]>(() => {
	const elements: ActionElements[] = []

	switch (currentView.value) {
		case 'doctypes':
			elements.push({
				type: 'button',
				label: 'Refresh',
				action: () => {
					// Refresh doctypes
					window.location.reload()
				},
			})
			break
		case 'records':
			elements.push(
				{
					type: 'button',
					label: 'New Record',
					action: () => void createNewRecord(),
				},
				{
					type: 'button',
					label: 'Refresh',
					action: () => {
						// Refresh records
						window.location.reload()
					},
				}
			)
			break
		case 'record':
			if (!isNewRecord.value) {
				elements.push(
					{
						type: 'button',
						label: 'Save',
						action: () => void handleSave(),
					},
					{
						type: 'button',
						label: 'Delete',
						action: () => void handleDelete(),
					}
				)
			} else {
				elements.push({
					type: 'button',
					label: 'Save',
					action: () => void handleSave(),
				})
			}
			break
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
		breadcrumbs.push(
			{ title: 'Home', to: '/' },
			{ title: formatDoctypeName(routeDoctype.value), to: `/${routeDoctype.value}` },
			{ title: isNewRecord.value ? 'New Record' : 'Edit Record', to: route.value?.fullPath || '' }
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
			action: () => void router.value?.push('/'),
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
			action: () => void router.value?.push(`/${routeDoctype.value}`),
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
			action: () => void router.value?.push(`/${doctype}`),
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

// Helper functions
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

const navigateToDoctype = async (doctype: string) => {
	await router.value?.push(`/${doctype}`)
}

const openRecord = async (recordId: string) => {
	await router.value?.push(`/${routeDoctype.value}/${recordId}`)
}

const createNewRecord = async () => {
	const newId = `new-${Date.now()}`
	await router.value?.push(`/${routeDoctype.value}/${newId}`)
}

// Schema generators
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
			fieldname: 'header',
			component: 'div',
			value: `
				<div class="view-header">
					<h1>Available Doctypes</h1>
				</div>
			`,
		},
		{
			fieldname: 'doctypes_table',
			component: 'ATable',
			columns: [
				{
					label: 'Doctype',
					name: 'doctype',
					type: 'Data',
					align: 'left',
					edit: false,
					width: '20ch',
				},
				{
					label: 'Name',
					name: 'display_name',
					type: 'Data',
					align: 'left',
					edit: false,
					width: '30ch',
				},
				{
					label: 'Records',
					name: 'record_count',
					type: 'Data',
					align: 'center',
					edit: false,
					width: '15ch',
				},
				{
					label: 'Actions',
					name: 'actions',
					type: 'Data',
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

	// If no columns are available, show a loading or empty state
	if (columns.length === 0) {
		return [
			{
				fieldname: 'header',
				component: 'div',
				value: `
					<div class="view-header">
						<nav class="breadcrumbs">
							<a href="/">Home</a>
							<span class="separator">/</span>
							<span class="current">${formatDoctypeName(routeDoctype.value || currentDoctype.value)}</span>
						</nav>
						<h1>${formatDoctypeName(routeDoctype.value || currentDoctype.value)} Records</h1>
					</div>
				`,
			},
			{
				fieldname: 'loading',
				component: 'div',
				value: `
					<div class="loading-state">
						<p>Loading ${formatDoctypeName(routeDoctype.value || currentDoctype.value)} schema...</p>
					</div>
				`,
			},
		]
	}

	const rows = records.map((record: any) => ({
		...record,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		id: record.id || '',
		actions: 'Edit | Delete',
	}))

	return [
		{
			fieldname: 'header',
			component: 'div',
			value: `
				<div class="view-header">
					<nav class="breadcrumbs">
						<a href="/">Home</a>
						<span class="separator">/</span>
						<span class="current">${formatDoctypeName(routeDoctype.value || currentDoctype.value)}</span>
					</nav>
					<h1>${formatDoctypeName(routeDoctype.value || currentDoctype.value)} Records</h1>
				</div>
			`,
		},
		{
			fieldname: 'actions',
			component: 'div',
			value: `
				<div class="view-actions">
					<button class="btn-primary" data-action="create">
						New ${formatDoctypeName(routeDoctype.value || currentDoctype.value)}
					</button>
				</div>
			`,
		},
		...(records.length === 0
			? [
					{
						fieldname: 'empty_state',
						component: 'div',
						value: `
							<div class="empty-state">
								<p>No ${routeDoctype.value || currentDoctype.value} records found.</p>
								<button class="btn-primary" data-action="create">
									Create First Record
								</button>
							</div>
						`,
					},
			  ]
			: [
					{
						fieldname: 'records_table',
						component: 'ATable',
						columns: [
							...columns.map(col => ({
								label: col.label,
								name: col.fieldname,
								type: col.fieldtype,
								align: 'left',
								edit: false,
								width: '20ch',
							})),
							{
								label: 'Actions',
								name: 'actions',
								type: 'Data',
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
			  ]),
	]
}

const getRecordFormSchema = (): SchemaTypes[] => {
	if (!currentDoctype.value) return []
	if (!stonecrop.value) return []

	try {
		const registry = stonecrop.value?.registry
		const meta = registry?.registry[currentDoctype.value]

		if (!meta?.schema) {
			// Return loading state if schema isn't available yet
			return [
				{
					fieldname: 'header',
					component: 'div',
					value: `
						<div class="view-header">
							<nav class="breadcrumbs">
								<a href="/">Home</a>
								<span class="separator">/</span>
								<a href="/${routeDoctype.value || currentDoctype.value}">${formatDoctypeName(
						routeDoctype.value || currentDoctype.value
					)}</a>
								<span class="separator">/</span>
								<span class="current">${isNewRecord.value ? 'New Record' : currentRecordId.value}</span>
							</nav>
							<h1>${
								isNewRecord.value
									? `New ${formatDoctypeName(routeDoctype.value || currentDoctype.value)}`
									: `Edit ${formatDoctypeName(routeDoctype.value || currentDoctype.value)}`
							}</h1>
						</div>
					`,
				},
				{
					fieldname: 'loading',
					component: 'div',
					value: `
						<div class="loading-state">
							<p>Loading ${formatDoctypeName(routeDoctype.value || currentDoctype.value)} form...</p>
						</div>
					`,
				},
			]
		}

		const schemaArray = 'toArray' in meta.schema ? meta.schema.toArray() : meta.schema
		const currentRecord = getCurrentRecord()

		return [
			{
				fieldname: 'header',
				component: 'div',
				value: `
					<div class="view-header">
						<nav class="breadcrumbs">
							<a href="/">Home</a>
							<span class="separator">/</span>
							<a href="/${routeDoctype.value || currentDoctype.value}">${formatDoctypeName(
					routeDoctype.value || currentDoctype.value
				)}</a>
							<span class="separator">/</span>
							<span class="current">${isNewRecord.value ? 'New Record' : currentRecordId.value}</span>
						</nav>
						<h1>
							${
								isNewRecord.value
									? `New ${formatDoctypeName(routeDoctype.value || currentDoctype.value)}`
									: `Edit ${formatDoctypeName(routeDoctype.value || currentDoctype.value)}`
							}
						</h1>
					</div>
				`,
			},
			{
				fieldname: 'actions',
				component: 'div',
				value: `
					<div class="view-actions">
						<button class="btn-primary" data-action="save" ${saving.value ? 'disabled' : ''}>
							${saving.value ? 'Saving...' : 'Save'}
						</button>
						<button class="btn-secondary" data-action="cancel">Cancel</button>
						${!isNewRecord.value ? '<button class="btn-danger" data-action="delete">Delete</button>' : ''}
					</div>
				`,
			},
			...schemaArray.map(field => ({
				...field,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				value: currentRecord[field.fieldname] || '',
			})),
		]
	} catch (error) {
		return [
			{
				fieldname: 'error',
				component: 'div',
				value: `
					<div class="error-state">
						<p>Unable to load form schema for ${formatDoctypeName(routeDoctype.value || currentDoctype.value)}</p>
					</div>
				`,
			},
		]
	}
}

// Data helpers
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
		const meta = registry.registry[currentDoctype.value]

		if (meta?.schema) {
			const schemaArray = 'toArray' in meta.schema ? meta.schema.toArray() : meta.schema
			return schemaArray.map(field => ({
				fieldname: field.fieldname,
				label: ('label' in field && field.label) || field.fieldname,
				fieldtype: ('fieldtype' in field && field.fieldtype) || 'Data',
			}))
		}
	} catch (error) {
		// Error getting schema - return empty array
	}

	return []
}

// Doctype metadata loader - simplified since router handles most of this
const loadDoctypeMetadata = (doctype: string) => {
	if (!stonecrop.value) return

	// Ensure the doctype structure exists in HST
	// The router should have already loaded the metadata, but this ensures the HST structure exists
	try {
		stonecrop.value.records(doctype)
	} catch (error) {
		// Silent error handling - structure will be created if needed
	}
}

const getCurrentRecord = () => {
	if (!stonecrop.value || !currentDoctype.value || isNewRecord.value) return {}

	const currentRecord = stonecrop.value.currentRecord(currentDoctype.value)
	return currentRecord?.get('') || {}
}

// Action handlers (will be triggered by button clicks in the UI)
const handleSave = async () => {
	if (!stonecrop.value) return

	saving.value = true

	try {
		const formData = currentViewData.value || {}

		if (isNewRecord.value) {
			const newId = `record-${Date.now()}`
			const recordData = { id: newId, ...formData }

			stonecrop.value.addRecord(currentDoctype.value, newId, recordData)
			stonecrop.value.setCurrentRecord(currentDoctype.value, newId)

			await router.value?.replace(`/${routeDoctype.value}/${newId}`)
		} else {
			const recordData = { id: currentRecordId.value, ...formData }
			stonecrop.value.addRecord(currentDoctype.value, currentRecordId.value, recordData)
		}
	} catch (error) {
		// Silently handle error
	} finally {
		saving.value = false
	}
}

const handleCancel = async () => {
	if (isNewRecord.value) {
		await router.value?.push(`/${routeDoctype.value}`)
	} else {
		// Reload current record data
		loadRecordData()
	}
}

const handleDelete = async (recordId?: string) => {
	if (!stonecrop.value) return

	const targetRecordId = recordId || currentRecordId.value
	if (!targetRecordId) return

	if (confirm('Are you sure you want to delete this record?')) {
		stonecrop.value.removeRecord(currentDoctype.value, targetRecordId)

		if (currentView.value === 'record') {
			await router.value?.push(`/${routeDoctype.value}`)
		}
	}
}

// Event handlers
const handleClick = async (event: Event) => {
	const target = event.target as HTMLElement
	const action = target.getAttribute('data-action')

	if (action) {
		switch (action) {
			case 'create':
				await createNewRecord()
				break
			case 'save':
				await handleSave()
				break
			case 'cancel':
				await handleCancel()
				break
			case 'delete':
				await handleDelete()
				break
		}
	}

	// Handle table cell clicks for actions
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
			// Get the record ID from the row
			const cells = row.querySelectorAll('td')
			if (cells.length > 0) {
				const idCell = cells[0] // Assuming ID is in first column
				const recordId = idCell.textContent?.trim()
				if (recordId) {
					await openRecord(recordId)
				}
			}
		} else if (cellText?.includes('Delete') && row) {
			// Get the record ID from the row
			const cells = row.querySelectorAll('td')
			if (cells.length > 0) {
				const idCell = cells[0] // Assuming ID is in first column
				const recordId = idCell.textContent?.trim()
				if (recordId) {
					await handleDelete(recordId)
				}
			}
		}
	}
}

// Watch for route changes to load appropriate data
watch(
	[currentView, currentDoctype, currentRecordId],
	() => {
		if (currentView.value === 'record') {
			loadRecordData()
		}
	},
	{ immediate: true }
)

// Watch for Stonecrop instance to become available
watch(
	stonecrop,
	newStonecrop => {
		if (newStonecrop) {
			// Force a re-evaluation of the current view schema when Stonecrop becomes available
			// This is handled automatically by the reactive computed properties
		}
	},
	{ immediate: true }
)

// Watch for when we need to load data for records view
watch(
	[currentView, currentDoctype, stonecrop],
	([view, doctype, stonecropInstance]) => {
		if (view === 'records' && doctype && stonecropInstance) {
			// Ensure doctype metadata is loaded
			loadDoctypeMetadata(doctype)
		}
	},
	{ immediate: true }
)

const loadRecordData = () => {
	if (!stonecrop.value || !currentDoctype.value) return

	loading.value = true

	try {
		if (!isNewRecord.value) {
			// Load existing record data
			const currentRecord = stonecrop.value.currentRecord(currentDoctype.value)
			if (currentRecord) {
				const recordData = currentRecord.get('') || {}
				currentViewData.value = { ...recordData }
			}
		} else {
			// Initialize empty form data for new record
			currentViewData.value = {}
		}
	} catch (error) {
		// Silently handle error
	} finally {
		loading.value = false
	}
}

// Provide methods for action components
const desktopMethods = {
	navigateToDoctype,
	openRecord,
	createNewRecord,
	handleSave,
	handleCancel,
	handleDelete,
}

provide('desktopMethods', desktopMethods)

// Register action components in Vue app
onMounted(() => {
	// Wait a tick for stonecrop to be ready, then load initial data
	void nextTick(() => {
		if (currentView.value === 'records' && currentDoctype.value && stonecrop.value) {
			loadDoctypeMetadata(currentDoctype.value)
		}
	})

	// Components will be automatically registered via the global component system

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
