/**
 * Sample doctypes installer
 * Scaffolds example doctype JSON files
 */

import { existsSync } from 'node:fs'
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { join } from 'pathe'
import consola from 'consola'
import { loadTemplate } from '../utils/templates'

const SAMPLE_DOCTYPES = ['project.json', 'task.json']

/**
 * The file in `dir` named `fileName` in any letter case. An app scaffolded when the samples were `Project.json` and
 * `Task.json` already has them, and a second copy under the new name would declare each doctype twice.
 */
async function findInAnyCase(dir: string, fileName: string): Promise<string | undefined> {
	const files = await readdir(dir).catch(() => [] as string[])
	return files.find(file => file.toLowerCase() === fileName.toLowerCase())
}

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

		for (const fileName of SAMPLE_DOCTYPES) {
			const existing = await findInAnyCase(doctypesDir, fileName)
			if (existing) {
				consola.info(`doctypes/${existing} already exists, skipping`)
				continue
			}
			await writeFile(join(doctypesDir, fileName), await loadTemplate(fileName), 'utf-8')
			consola.info(`Created doctypes/${fileName}`)
		}

		consola.success('Sample doctypes created successfully')
		return true
	} catch (error) {
		consola.error('Failed to scaffold doctypes:', error)
		return false
	}
}
