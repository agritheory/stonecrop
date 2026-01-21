/**
 * CASL middleware installer
 * Installs @stonecrop/casl-middleware and updates nuxt.config.ts
 */

import consola from 'consola'

import { updateNuxtConfig } from '../utils/config'
import { addDependencies } from '../utils/package'
import { addPluginToGrafservConfig } from '../utils/plugin'

export interface CaslInstallerOptions {
	cwd: string
}

/**
 * Install the @stonecrop/casl-middleware authorization package
 */
export async function installCasl(options: CaslInstallerOptions): Promise<boolean> {
	const { cwd } = options

	consola.start('Installing @stonecrop/casl-middleware authorization...')

	try {
		// Add dependencies - use latest published version
		await addDependencies(cwd, {
			'@stonecrop/casl-middleware': 'latest',
			'@casl/ability': '^6.7.3',
		})

		// Add import to nuxt.config.ts
		await updateNuxtConfig(cwd, {
			import: "import { pglCaslPlugin } from '@stonecrop/casl-middleware'",
		})

		// Add plugin to grafserv preset configuration
		const pluginAdded = await addPluginToGrafservConfig(cwd, 'pglCaslPlugin')

		if (pluginAdded) {
			consola.success('@stonecrop/casl-middleware installed and configured successfully')
		} else {
			consola.success('@stonecrop/casl-middleware installed successfully')
			consola.info('Add pglCaslPlugin to your grafserv preset plugins array manually')
		}

		return true
	} catch (error) {
		consola.error('Failed to install @stonecrop/casl-middleware:', error)
		return false
	}
}
