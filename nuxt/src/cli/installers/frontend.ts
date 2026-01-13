/**
 * Frontend module installer
 * Installs @stonecrop/nuxt and configures nuxt.config.ts
 */

import consola from 'consola'
import { addDependencies } from '../utils/package'
import { updateNuxtConfig } from '../utils/config'

export interface FrontendInstallerOptions {
	cwd: string
}

/**
 * Install the @stonecrop/nuxt frontend module
 */
export async function installFrontend(options: FrontendInstallerOptions): Promise<boolean> {
	const { cwd } = options

	consola.start('Installing @stonecrop/nuxt frontend module...')

	try {
		// Add dependency - use latest published version
		await addDependencies(cwd, {
			'@stonecrop/nuxt': 'latest',
		})

		// Update nuxt.config.ts
		await updateNuxtConfig(cwd, {
			module: "'@stonecrop/nuxt'",
			moduleOptions: {
				key: 'stonecrop',
				value: `{
		// Enable DocBuilder for visual schema editing
		docbuilder: false,
	}`,
			},
		})

		consola.success('@stonecrop/nuxt installed successfully')
		return true
	} catch (error) {
		consola.error('Failed to install @stonecrop/nuxt:', error)
		return false
	}
}
