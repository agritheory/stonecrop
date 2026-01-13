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

		// Scaffold Example.json (form doctype)
		const examplePath = join(doctypesDir, 'Example.json')
		if (!existsSync(examplePath)) {
			const exampleTemplate = await loadTemplate('Example.json')
			await writeFile(examplePath, exampleTemplate, 'utf-8')
			consola.info('Created doctypes/Example.json')
		} else {
			consola.info('doctypes/Example.json already exists, skipping')
		}

		// Scaffold example-table.json (table doctype)
		const tableExamplePath = join(doctypesDir, 'example-table.json')
		if (!existsSync(tableExamplePath)) {
			const tableTemplate = await loadTemplate('example-table.json')
			await writeFile(tableExamplePath, tableTemplate, 'utf-8')
			consola.info('Created doctypes/example-table.json')
		} else {
			consola.info('doctypes/example-table.json already exists, skipping')
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
		'Example.json': JSON.stringify(
			{
				name: 'Example',
				slug: 'example/:id',
				tableName: 'examples',
				fields: [
					{
						fieldname: 'id',
						fieldtype: 'Data',
						label: 'ID',
						readOnly: true,
					},
					{
						fieldname: 'title',
						fieldtype: 'Data',
						label: 'Title',
						required: true,
					},
					{
						fieldname: 'description',
						fieldtype: 'Text',
						label: 'Description',
					},
					{
						fieldname: 'status',
						fieldtype: 'Select',
						label: 'Status',
						options: ['Draft', 'Active', 'Archived'],
						default: 'Draft',
					},
					{
						fieldname: 'priority',
						fieldtype: 'Select',
						label: 'Priority',
						options: ['Low', 'Medium', 'High'],
						default: 'Medium',
					},
					{
						fieldname: 'createdAt',
						fieldtype: 'Datetime',
						label: 'Created At',
						readOnly: true,
					},
					{
						fieldname: 'updatedAt',
						fieldtype: 'Datetime',
						label: 'Updated At',
						readOnly: true,
					},
				],
				workflow: {
					states: ['Draft', 'Active', 'Archived'],
					actions: {
						activate: {
							label: 'Activate',
							handler: 'activate_example',
							allowedStates: ['Draft'],
							confirm: true,
						},
						archive: {
							label: 'Archive',
							handler: 'archive_example',
							allowedStates: ['Active'],
							confirm: true,
						},
					},
				},
			},
			null,
			'\t'
		),
		'example-table.json': JSON.stringify(
			{
				name: 'Example',
				slug: 'example',
				tableName: 'examples',
				schema: [
					{
						component: 'ATable',
						columns: [
							{
								name: 'id',
								label: 'ID',
								fieldtype: 'Data',
								width: '8ch',
							},
							{
								name: 'title',
								label: 'Title',
								fieldtype: 'Data',
								width: '20ch',
							},
							{
								name: 'status',
								label: 'Status',
								fieldtype: 'Data',
								width: '10ch',
							},
							{
								name: 'priority',
								label: 'Priority',
								fieldtype: 'Data',
								width: '10ch',
							},
							{
								name: 'createdAt',
								label: 'Created',
								fieldtype: 'Datetime',
								width: '18ch',
							},
						],
						config: {
							view: 'list',
						},
					},
				],
			},
			null,
			'\t'
		),
	}

	return templates[filename] || '{}'
}
