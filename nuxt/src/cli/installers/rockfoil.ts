/**
 * Rockfoil installer
 * Installs @stonecrop/rockfoil PostGraphile middleware
 */

import consola from 'consola'

import { updateNuxtConfig } from '../utils/config'
import { addDependencies } from '../utils/package'
import { addPluginToGrafservConfig } from '../utils/plugin'

export interface RockfoilInstallerOptions {
	cwd: string
}

/**
 * Install the @stonecrop/rockfoil PostGraphile middleware
 */
export async function installRockfoil(options: RockfoilInstallerOptions): Promise<boolean> {
	const { cwd } = options

	consola.start('Installing @stonecrop/rockfoil PostGraphile middleware...')

	try {
		// Add dependencies - use latest published version
		await addDependencies(cwd, {
			'@stonecrop/rockfoil': 'latest',
			postgraphile: '^5.0.0-rc.7',
		})

		// Add import to nuxt.config.ts
		await updateNuxtConfig(cwd, {
			import: "import { createPglRockfoilPlugin } from '@stonecrop/rockfoil'",
		})

		// Add plugin to grafserv preset configuration
		const pluginAdded = await addPluginToGrafservConfig(cwd, 'createPglRockfoilPlugin({})')

		if (pluginAdded) {
			consola.success('@stonecrop/rockfoil installed and configured successfully')
		} else {
			consola.success('@stonecrop/rockfoil installed successfully')
			consola.info('Add createPglRockfoilPlugin({}) to your grafserv preset plugins array manually')
		}

		return true
	} catch (error) {
		consola.error('Failed to install @stonecrop/rockfoil:', error)
		return false
	}
}
