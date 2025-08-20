<template>
	<div class="desktop" @click="handleClick">
		<!-- Debug info -->
		<pre v-if="showDebug" class="debug-info">Route: {{ route }}</pre>

		<!-- Action Set -->
		<ActionSet :elements="actionElements" />

		<!-- Main content using AForm -->
		<AForm v-if="currentViewSchema.length > 0" v-model="currentViewSchema" :data="currentViewData" />
		<div v-else class="loading">Loading...</div>

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
import { AForm, type SchemaTypes } from '@stonecrop/aform'
import { computed, onMounted, provide, ref, unref, watch, defineExpose } from 'vue'
import ActionSet from './ActionSet.vue'
import SheetNav from './SheetNav.vue'
import CommandPalette from './CommandPalette.vue'
import type { ActionElements } from '../types'

type Props = {
	availableDoctypes?: string[]
	showDebug?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	availableDoctypes: () => [],
	showDebug: false,
})

const { stonecrop } = useStonecrop()

// State
const loading = ref(false)
const saving = ref(false)
const currentViewData = ref<Record<string, any>>({})
const commandPaletteOpen = ref(false)
// Computed properties for current route context
const route = computed(() => unref(stonecrop.value?.registry.router?.currentRoute))
const router = computed(() => stonecrop.value?.registry.router)
const currentDoctype = computed(() => route.value?.params.doctype as string)
const currentRecordId = computed(() => route.value?.params.recordId as string)
const isNewRecord = computed(() => currentRecordId.value?.startsWith('new-'))

// Determine current view based on route
const currentView = computed(() => {
	if (!route.value) return 'doctypes'

	const routeName = route.value.name as string
	const { doctype, recordId } = route.value.params

	// Check route name first for most accurate determination
	if (routeName === 'record-form' || recordId) {
		return 'record'
	} else if (routeName === 'records-list' || doctype) {
		return 'records'
	} else if (routeName === 'home' || route.value.path === '/') {
		return 'doctypes'
	}

	// Fallback logic for catch-all route using pathMatch
	const pathParams = route.value.params.pathMatch as string[] | undefined
	if (pathParams && pathParams.length > 0) {
		if (pathParams.length === 1) {
			return 'records'
		} else if (pathParams.length === 2) {
			return 'record'
		}
	}

	// Default fallback
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
					action: () => createNewRecord(),
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
						action: () => handleSave(),
					},
					{
						type: 'button',
						label: 'Delete',
						action: () => handleDelete(),
					}
				)
			} else {
				elements.push({
					type: 'button',
					label: 'Save',
					action: () => handleSave(),
				})
			}
			break
	}

	return elements
})

const navigationBreadcrumbs = computed(() => {
	const breadcrumbs: { title: string; to: string }[] = []

	if (currentView.value === 'records' && currentDoctype.value) {
		breadcrumbs.push(
			{ title: 'Home', to: '/' },
			{ title: formatDoctypeName(currentDoctype.value), to: `/${currentDoctype.value}` }
		)
	} else if (currentView.value === 'record' && currentDoctype.value) {
		breadcrumbs.push(
			{ title: 'Home', to: '/' },
			{ title: formatDoctypeName(currentDoctype.value), to: `/${currentDoctype.value}` },
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
	if (currentDoctype.value) {
		commands.push({
			title: `View ${formatDoctypeName(currentDoctype.value)} Records`,
			description: `Navigate to ${currentDoctype.value} list`,
			action: () => void router.value?.push(`/${currentDoctype.value}`),
		})

		commands.push({
			title: `Create New ${formatDoctypeName(currentDoctype.value)}`,
			description: `Create a new ${currentDoctype.value} record`,
			action: () => createNewRecord(),
		})
	}

	// Add available doctypes as commands
	props.availableDoctypes.forEach(doctype => {
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

const navigateToDoctype = (doctype: string) => {
	void router.value?.push(`/${doctype}`)
}

const openRecord = (recordId: string) => {
	void router.value?.push(`/${currentDoctype.value}/${recordId}`)
}

const createNewRecord = () => {
	const newId = `new-${Date.now()}`
	void router.value?.push(`/${currentDoctype.value}/${newId}`)
}

// Schema generators
const getDoctypesSchema = (): SchemaTypes[] => {
	if (!props.availableDoctypes.length) return []

	const rows = props.availableDoctypes.map(doctype => ({
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
					align: 'left' as const,
					edit: false,
					width: '20ch',
				},
				{
					label: 'Name',
					name: 'display_name',
					type: 'Data',
					align: 'left' as const,
					edit: false,
					width: '30ch',
				},
				{
					label: 'Records',
					name: 'record_count',
					type: 'Data',
					align: 'center' as const,
					edit: false,
					width: '15ch',
				},
				{
					label: 'Actions',
					name: 'actions',
					type: 'Data',
					align: 'center' as const,
					edit: false,
					width: '20ch',
				},
			],
			config: {
				view: 'list' as const,
				fullWidth: true,
				dependencyGraph: false,
			},
			rows,
		},
	]
}

const getRecordsSchema = (): SchemaTypes[] => {
	if (!currentDoctype.value) return []

	const records = getRecords()
	const columns = getColumns()

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
						<span class="current">${formatDoctypeName(currentDoctype.value)}</span>
					</nav>
					<h1>${formatDoctypeName(currentDoctype.value)} Records</h1>
				</div>
			`,
		},
		{
			fieldname: 'actions',
			component: 'div',
			value: `
				<div class="view-actions">
					<button class="btn-primary" data-action="create">
						New ${formatDoctypeName(currentDoctype.value)}
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
								<p>No ${currentDoctype.value} records found.</p>
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
								align: 'left' as const,
								edit: false,
								width: '20ch',
							})),
							{
								label: 'Actions',
								name: 'actions',
								type: 'Data',
								align: 'center' as const,
								edit: false,
								width: '20ch',
							},
						],
						config: {
							view: 'list' as const,
							fullWidth: true,
						},
						rows,
					},
			  ]),
	]
}

const getRecordFormSchema = (): SchemaTypes[] => {
	if (!currentDoctype.value) return []

	try {
		const registry = stonecrop.value?.registry
		const meta = registry?.registry[currentDoctype.value]

		if (!meta?.schema) return []

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
							<a href="/${currentDoctype.value}">${formatDoctypeName(currentDoctype.value)}</a>
							<span class="separator">/</span>
							<span class="current">${isNewRecord.value ? 'New Record' : currentRecordId.value}</span>
						</nav>
						<h1>
							${
								isNewRecord.value
									? `New ${formatDoctypeName(currentDoctype.value)}`
									: `Edit ${formatDoctypeName(currentDoctype.value)}`
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
			{
				fieldname: 'form_fields',
				schema: schemaArray.map(field => ({
					...field,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					value: currentRecord?.[field.fieldname] || '',
				})),
			},
		]
	} catch (error) {
		return [
			{
				fieldname: 'error',
				component: 'div',
				value: `
					<div class="error-state">
						<p>Unable to load form schema for ${currentDoctype.value}</p>
					</div>
				`,
			},
		]
	}
}

// Data helpers
const getRecords = () => {
	if (!stonecrop.value || !currentDoctype.value) return []

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

const getCurrentRecord = () => {
	if (!stonecrop.value || !currentDoctype.value || isNewRecord.value) return {}

	const currentRecord = stonecrop.value.currentRecord(currentDoctype.value)
	return currentRecord?.get('') || {}
}

// Action handlers (will be triggered by button clicks in the UI)
const handleSave = () => {
	if (!stonecrop.value) return

	saving.value = true

	try {
		const formData = currentViewData.value || {}

		if (isNewRecord.value) {
			const newId = `record-${Date.now()}`
			const recordData = { id: newId, ...formData }

			stonecrop.value.addRecord(currentDoctype.value, newId, recordData)
			stonecrop.value.setCurrentRecord(currentDoctype.value, newId)

			void router.value?.replace(`/${currentDoctype.value}/${newId}`)
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

const handleCancel = () => {
	if (isNewRecord.value) {
		void router.value?.push(`/${currentDoctype.value}`)
	} else {
		// Reload current record data
		loadRecordData()
	}
}

const handleDelete = (recordId?: string) => {
	if (!stonecrop.value) return

	const targetRecordId = recordId || currentRecordId.value
	if (!targetRecordId) return

	if (confirm('Are you sure you want to delete this record?')) {
		stonecrop.value.removeRecord(currentDoctype.value, targetRecordId)

		if (currentView.value === 'record') {
			void router.value?.push(`/${currentDoctype.value}`)
		}
	}
}

// Event handlers
const handleClick = (event: Event) => {
	const target = event.target as HTMLElement
	const action = target.getAttribute('data-action')

	if (action) {
		switch (action) {
			case 'create':
				createNewRecord()
				break
			case 'save':
				handleSave()
				break
			case 'cancel':
				handleCancel()
				break
			case 'delete':
				handleDelete()
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
					navigateToDoctype(doctype)
				}
			}
		} else if (cellText?.includes('Edit') && row) {
			// Get the record ID from the row
			const cells = row.querySelectorAll('td')
			if (cells.length > 0) {
				const idCell = cells[0] // Assuming ID is in first column
				const recordId = idCell.textContent?.trim()
				if (recordId) {
					openRecord(recordId)
				}
			}
		} else if (cellText?.includes('Delete') && row) {
			// Get the record ID from the row
			const cells = row.querySelectorAll('td')
			if (cells.length > 0) {
				const idCell = cells[0] // Assuming ID is in first column
				const recordId = idCell.textContent?.trim()
				if (recordId) {
					handleDelete(recordId)
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

// Expose action handlers for use by child components
defineExpose({
	navigateToDoctype,
	openRecord,
	createNewRecord,
	handleSave,
	handleCancel,
	handleDelete,
})

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
