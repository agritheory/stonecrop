/**
 * Frontend module installer
 * Installs @stonecrop/nuxt and configures nuxt.config.ts
 */

import { existsSync } from 'node:fs'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { join } from 'pathe'
import consola from 'consola'
import { addDependencies } from '../utils/package'
import { updateNuxtConfig } from '../utils/config'
import { loadTemplate } from '../utils/templates'
import { STONECROP_PACKAGES } from '../../module'

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
			'@stonecrop/desktop': 'latest',
			pinia: '^3.0.4',
		})

		// Update nuxt.config.ts with module and Nitro configuration
		await updateNuxtConfig(cwd, {
			module: "'@stonecrop/nuxt'",
			moduleOptions: {
				key: 'stonecrop',
				// routeStrategy registers a single catch-all route that handles both list and
				// detail views; import.meta.url refers to nuxt.config.ts at the project root.
				value: `{
		docbuilder: false,
		routeStrategy: () => [
			{
				name: 'stonecrop-catch-all',
				path: '/:pathMatch(.*)*',
				file: new URL('./app/pages/index.vue', import.meta.url).pathname,
			},
		],
	}`,
			},
			// Add Nitro configuration to handle CSS imports in Stonecrop packages
			// This is required because the packages use vite-plugin-lib-inject-css which adds
			// CSS imports to the JavaScript bundles. Node.js ESM loader doesn't understand .css files,
			// so we need Nitro to bundle these packages (allowing Vite to process the CSS)
			// Shares the module's list rather than restating it: the two previously disagreed
			// (this one had `desktop` but not `themes`; the module's had the reverse), so a
			// scaffolded app and the module inlined different sets.
			nitroConfig: {
				externalsInline: [...STONECROP_PACKAGES],
			},
			css: ['@stonecrop/desktop/styles'],
		})

		// Scaffold app/composables/useDoctypes.ts, app/composables/useRouteAdapter.ts,
		// app/plugins/stonecrop.client.ts, app/pages/index.vue, and fix app/app.vue
		await scaffoldAppFiles(cwd)

		consola.success('@stonecrop/nuxt installed successfully')
		consola.info('Added Nitro configuration for CSS handling')
		return true
	} catch (error) {
		consola.error('Failed to install @stonecrop/nuxt:', error)
		return false
	}
}

/**
 * Scaffold the app directory with Stonecrop client wiring and page component
 */
async function scaffoldAppFiles(cwd: string): Promise<void> {
	const appDir = join(cwd, 'app')
	const composablesDir = join(appDir, 'composables')
	const pluginsDir = join(appDir, 'plugins')
	const pagesDir = join(appDir, 'pages')

	for (const dir of [appDir, composablesDir, pluginsDir, pagesDir]) {
		if (!existsSync(dir)) {
			await mkdir(dir, { recursive: true })
		}
	}

	// Replace nuxi's default app.vue (which renders <NuxtWelcome /> and disables routing)
	// with one that renders <NuxtPage /> so Stonecrop's registered routes are reachable.
	const appVuePath = join(appDir, 'app.vue')
	if (existsSync(appVuePath)) {
		const existing = await readFile(appVuePath, 'utf-8')
		if (existing.includes('NuxtWelcome')) {
			await writeFile(appVuePath, '<template>\n  <NuxtPage />\n</template>\n', 'utf-8')
			consola.info('Updated app/app.vue to use <NuxtPage />')
		}
	}

	const useDoctypesPath = join(composablesDir, 'useDoctypes.ts')
	if (!existsSync(useDoctypesPath)) {
		await writeFile(useDoctypesPath, await loadTemplate('useDoctypes.ts'), 'utf-8')
		consola.info('Created app/composables/useDoctypes.ts')
	} else {
		consola.info('app/composables/useDoctypes.ts already exists, skipping')
	}

	const useRouteAdapterPath = join(composablesDir, 'useRouteAdapter.ts')
	if (!existsSync(useRouteAdapterPath)) {
		await writeFile(useRouteAdapterPath, await loadTemplate('useRouteAdapter.ts'), 'utf-8')
		consola.info('Created app/composables/useRouteAdapter.ts')
	} else {
		consola.info('app/composables/useRouteAdapter.ts already exists, skipping')
	}

	const clientPluginPath = join(pluginsDir, 'stonecrop.client.ts')
	if (!existsSync(clientPluginPath)) {
		await writeFile(clientPluginPath, await loadTemplate('stonecrop.client.ts'), 'utf-8')
		consola.info('Created app/plugins/stonecrop.client.ts')
	} else {
		consola.info('app/plugins/stonecrop.client.ts already exists, skipping')
	}

	const indexPagePath = join(pagesDir, 'index.vue')
	if (!existsSync(indexPagePath)) {
		await writeFile(indexPagePath, await loadTemplate('index.vue'), 'utf-8')
		consola.info('Created app/pages/index.vue')
	} else {
		consola.info('app/pages/index.vue already exists, skipping')
	}
}
