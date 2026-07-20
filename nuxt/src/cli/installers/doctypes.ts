/**
 * Sample doctypes installer
 * Scaffolds example doctype JSON files
 */

import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'pathe'
import consola from 'consola'
import { loadTemplate } from '../utils/templates'

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
