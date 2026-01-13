/**
 * Stonecrop Nuxt CLI - Main Installer
 *
 * Orchestrates the installation of Stonecrop features into a Nuxt project.
 */

import consola from 'consola'
import { detectFeatures, getInstalledSummary } from './detect'
import { promptFeatures, type SelectedFeatures } from './prompts'
import { installFrontend } from './installers/frontend'
import { installGrafserv } from './installers/grafserv'
import { installGraphqlClient } from './installers/graphql-client'
import { installCasl } from './installers/casl'
import { installRockfoil } from './installers/rockfoil'
import { installDoctypes } from './installers/doctypes'
import { getInstallCommand } from './utils/package'

export interface InstallerOptions {
	/** Working directory (defaults to current directory) */
	cwd: string
	/** Pre-selected features from CLI flags */
	features?: Partial<SelectedFeatures>
	/** Skip confirmation prompts */
	skipConfirm?: boolean
}

/**
 * Main installer entry point
 */
export async function runInstaller(options: InstallerOptions): Promise<void> {
	const { cwd, features: preselectedFeatures = {}, skipConfirm = false } = options

	consola.box('🌱 Stonecrop Nuxt Installer')
	console.log()

	// Detect existing setup
	consola.start('Detecting existing setup...')
	const detected = await detectFeatures(cwd)

	if (!detected.isNuxtProject) {
		consola.error('This does not appear to be a Nuxt project.')
		consola.info('Please run this command in a directory with nuxt.config.ts and Nuxt in package.json.')
		process.exit(1)
	}

	consola.success('Nuxt project detected')

	// Show what's already installed
	const installed = getInstalledSummary(detected)
	if (installed.length > 0) {
		console.log()
		consola.info('Already installed:')
		for (const item of installed) {
			consola.info(`  ✓ ${item}`)
		}
	}

	console.log()

	// Prompt for features to install
	const selectedFeatures = await promptFeatures({
		preselected: preselectedFeatures,
		detected,
		skipConfirm,
	})

	if (!selectedFeatures) {
		return
	}

	console.log()
	consola.start('Installing selected features...')
	console.log()

	// Track installation results
	const results: { feature: string; success: boolean }[] = []

	// Install frontend module
	if (selectedFeatures.frontend) {
		const success = await installFrontend({ cwd })
		results.push({ feature: '@stonecrop/nuxt', success })
		console.log()
	}

	// Install GraphQL client
	if (selectedFeatures.graphqlClient) {
		const success = await installGraphqlClient({ cwd })
		results.push({ feature: '@stonecrop/graphql-client', success })
		console.log()
	}

	// Install GraphQL server (before CASL/Rockfoil since they modify middleware.ts)
	if (selectedFeatures.graphql) {
		const success = await installGrafserv({ cwd })
		results.push({ feature: '@stonecrop/nuxt-grafserv', success })
		console.log()
	}

	// Install CASL middleware
	if (selectedFeatures.casl) {
		const success = await installCasl({ cwd })
		results.push({ feature: '@stonecrop/casl-middleware', success })
		console.log()
	}

	// Install Rockfoil middleware
	if (selectedFeatures.rockfoil) {
		const success = await installRockfoil({ cwd })
		results.push({ feature: '@stonecrop/rockfoil', success })
		console.log()
	}

	// Install sample doctypes
	if (selectedFeatures.doctypes) {
		const success = await installDoctypes({ cwd })
		results.push({ feature: 'Sample doctypes', success })
		console.log()
	}

	// Summary
	const successCount = results.filter(r => r.success).length
	const failCount = results.filter(r => !r.success).length

	console.log()
	if (failCount === 0) {
		consola.success(`Successfully installed ${successCount} feature(s)`)
	} else {
		consola.warn(`Installed ${successCount} feature(s), ${failCount} failed`)
		for (const result of results.filter(r => !r.success)) {
			consola.error(`  ✗ ${result.feature}`)
		}
	}

	// Next steps
	console.log()
	consola.box('Next Steps')
	console.log()

	const installCmd = getInstallCommand(cwd)
	consola.info(`1. Install dependencies:`)
	consola.info(`   ${installCmd}`)
	console.log()

	let stepNum = 2

	if (selectedFeatures.graphql) {
		consola.info(`${stepNum}. Update your GraphQL schema and resolvers:`)
		consola.info(`   - server/schema.graphql`)
		consola.info(`   - server/resolvers.ts`)
		console.log()
		stepNum++
	}

	if (selectedFeatures.rockfoil) {
		consola.info(`${stepNum}. Configure Rockfoil in server/middleware.ts:`)
		consola.info(`   - Set DATABASE_URL environment variable`)
		consola.info(`   - Uncomment and configure the Rockfoil middleware`)
		console.log()
		stepNum++
	}

	if (selectedFeatures.doctypes) {
		consola.info(`${stepNum}. Customize your doctypes:`)
		consola.info(`   - doctypes/Example.json`)
		consola.info(`   - doctypes/example-table.json`)
		console.log()
		stepNum++
	}

	consola.info(`Start development server:`)
	consola.info(`   npx nuxi dev`)
	console.log()

	if (selectedFeatures.graphql) {
		consola.info(`Access GraphiQL:`)
		consola.info(`   http://localhost:3000/graphql/`)
		console.log()
	}
}

// Re-export types for external use
export type { SelectedFeatures } from './prompts'
export type { DetectedFeatures } from './detect'
