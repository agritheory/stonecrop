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
		// Add @stonecrop/nuxt and its required peer dependencies
		// These packages are imported by the Nuxt module and need to be available at runtime
		await addDependencies(cwd, {
			'@stonecrop/nuxt': 'latest',
			'@stonecrop/aform': 'latest',
			'@stonecrop/atable': 'latest',
			'@stonecrop/stonecrop': 'latest',
			'@stonecrop/node-editor': 'latest',
			'@stonecrop/schema': 'latest',
			'@stonecrop/utilities': 'latest',
			pinia: '^3.0.4',
		})

		// Update nuxt.config.ts with module and Nitro configuration
		await updateNuxtConfig(cwd, {
			module: "'@stonecrop/nuxt'",
			moduleOptions: {
				key: 'stonecrop',
				value: `{
		// Enable DocBuilder for visual schema editing
		docbuilder: false,
	}`,
			},
			// Add Nitro configuration to handle CSS imports in Stonecrop packages
			// This is required because the packages use vite-plugin-lib-inject-css which adds
			// CSS imports to the JavaScript bundles. Node.js ESM loader doesn't understand .css files,
			// so we need Nitro to bundle these packages (allowing Vite to process the CSS)
			nitroConfig: {
				externalsInline: [
					'@stonecrop/aform',
					'@stonecrop/atable',
					'@stonecrop/stonecrop',
					'@stonecrop/node-editor',
					'@stonecrop/utilities',
				],
			},
		})

		consola.success('@stonecrop/nuxt installed successfully')
		consola.info('Added Nitro configuration for CSS handling')
		return true
	} catch (error) {
		consola.error('Failed to install @stonecrop/nuxt:', error)
		return false
	}
}
