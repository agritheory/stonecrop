/**
 * Sample doctypes installer
 * Scaffolds example doctype JSON files
 */

import { existsSync } from 'node:fs'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { join, dirname } from 'pathe'
import { fileURLToPath } from 'node:url'
import consola from 'consola'

const __dirname = dirname(fileURLToPath(import.meta.url))

export interface DoctypesInstallerOptions {
	cwd: string
}

/**
 * Install sample doctype files
 */
export async function installDoctypes(options: DoctypesInstallerOptions): Promise<boolean> {
	const { cwd } = options

	consola.start('Scaffolding sample doctypes...')

	try {
		const doctypesDir = join(cwd, 'doctypes')

		// Create doctypes directory if it doesn't exist
		if (!existsSync(doctypesDir)) {
			await mkdir(doctypesDir, { recursive: true })
			consola.info('Created doctypes/ directory')
		}

		// Scaffold Project.json
		const projectPath = join(doctypesDir, 'Project.json')
		if (!existsSync(projectPath)) {
			const projectTemplate = await loadTemplate('Project.json')
			await writeFile(projectPath, projectTemplate, 'utf-8')
			consola.info('Created doctypes/Project.json')
		} else {
			consola.info('doctypes/Project.json already exists, skipping')
		}

		// Scaffold Task.json
		const taskPath = join(doctypesDir, 'Task.json')
		if (!existsSync(taskPath)) {
			const taskTemplate = await loadTemplate('Task.json')
			await writeFile(taskPath, taskTemplate, 'utf-8')
			consola.info('Created doctypes/Task.json')
		} else {
			consola.info('doctypes/Task.json already exists, skipping')
		}

		consola.success('Sample doctypes created successfully')
		return true
	} catch (error) {
		consola.error('Failed to scaffold doctypes:', error)
		return false
	}
}

/**
 * Load a template file
 */
async function loadTemplate(filename: string): Promise<string> {
	// Try to load from templates directory
	const templatePath = join(__dirname, '..', '..', '..', 'templates', filename)

	if (existsSync(templatePath)) {
		return readFile(templatePath, 'utf-8')
	}

	// Fallback to inline templates
	return getInlineTemplate(filename)
}

/**
 * Get inline template content as fallback
 */
function getInlineTemplate(filename: string): string {
	const templates: Record<string, string> = {
		'Project.json': JSON.stringify(
			{
				name: 'Project',
				slug: 'project',
				fields: [
					{ fieldname: 'id', label: 'ID', component: 'ATextInput', fieldtype: 'Data', mode: 'display' },
					{ fieldname: 'title', label: 'Title', component: 'ATextInput', fieldtype: 'Data', required: true },
					{ fieldname: 'description', label: 'Description', component: 'ATextarea', fieldtype: 'Text' },
					{
						fieldname: 'status',
						label: 'Status',
						component: 'ADropdown',
						fieldtype: 'Select',
						options: ['Active', 'Archived'],
						default: 'Active',
					},
					{
						fieldname: 'createdAt',
						label: 'Created At',
						component: 'ATextInput',
						fieldtype: 'Datetime',
						mode: 'display',
					},
				],
				workflow: {
					states: ['Active', 'Archived'],
					actions: {
						save: { label: 'Save', handler: 'project:save' },
						archive: { label: 'Archive Project', handler: 'archive_project', allowedStates: ['Active'], confirm: true },
					},
				},
			},
			null,
			'\t'
		),
		'Task.json': JSON.stringify(
			{
				name: 'Task',
				slug: 'task',
				fields: [
					{ fieldname: 'id', label: 'ID', component: 'ATextInput', fieldtype: 'Data', mode: 'display' },
					{ fieldname: 'title', label: 'Title', component: 'ATextInput', fieldtype: 'Data', required: true },
					{
						fieldname: 'projectId',
						label: 'Project',
						component: 'ACombobox',
						fieldtype: 'Link',
						options: 'project',
						required: true,
					},
					{
						fieldname: 'status',
						label: 'Status',
						component: 'ADropdown',
						fieldtype: 'Select',
						options: ['Todo', 'In Progress', 'Done'],
						default: 'Todo',
					},
					{ fieldname: 'description', label: 'Description', component: 'ATextarea', fieldtype: 'Text' },
					{ fieldname: 'dueDate', label: 'Due Date', component: 'ADatepicker', fieldtype: 'Date' },
					{
						fieldname: 'createdAt',
						label: 'Created At',
						component: 'ATextInput',
						fieldtype: 'Datetime',
						mode: 'display',
					},
				],
				workflow: {
					states: ['Todo', 'In Progress', 'Done'],
					actions: {
						save: { label: 'Save', handler: 'task:save' },
						start_task: { label: 'Start Task', handler: 'start_task', allowedStates: ['Todo'] },
						complete_task: { label: 'Complete', handler: 'complete_task', allowedStates: ['In Progress'] },
					},
				},
			},
			null,
			'\t'
		),
	}

	return templates[filename] || '{}'
}
