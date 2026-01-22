/**
 * Interactive prompts for feature selection
 */

import prompts from 'prompts'
import consola from 'consola'
import type { DetectedFeatures } from './detect'

export interface SelectedFeatures {
	frontend: boolean
	graphql: boolean
	graphqlClient: boolean
	casl: boolean
	rockfoil: boolean
	doctypes: boolean
}

export interface PromptOptions {
	/** Pre-selected features from CLI flags */
	preselected?: Partial<SelectedFeatures>
	/** Already detected features in the project */
	detected?: DetectedFeatures
	/** Skip confirmation prompts */
	skipConfirm?: boolean
}

/**
 * Prompt the user to select which features to install
 */
export async function promptFeatures(options: PromptOptions = {}): Promise<SelectedFeatures | null> {
	const { preselected = {}, detected, skipConfirm } = options

	// If any features are pre-selected via flags, use those
	const hasPreselected = Object.values(preselected).some(Boolean)
	if (hasPreselected) {
		return {
			frontend: preselected.frontend ?? false,
			graphql: preselected.graphql ?? false,
			graphqlClient: preselected.graphqlClient ?? false,
			casl: preselected.casl ?? false,
			rockfoil: preselected.rockfoil ?? false,
			doctypes: preselected.doctypes ?? false,
		}
	}

	// Build choices based on what's already installed
	const choices = [
		{
			title: '@stonecrop/nuxt - Frontend module',
			value: 'frontend',
			description: 'Schema-driven UI components and routing',
			disabled: detected?.hasFrontend,
			selected: !detected?.hasFrontend,
		},
		{
			title: '@stonecrop/graphql-client - GraphQL client',
			value: 'graphqlClient',
			description: 'GraphQL client with Stonecrop integration',
			disabled: detected?.hasGraphqlClient,
			selected: false,
		},
		{
			title: '@stonecrop/nuxt-grafserv - GraphQL server',
			value: 'graphql',
			description: 'Grafserv-based GraphQL API with middleware support',
			disabled: detected?.hasGraphql,
			selected: false,
		},
		{
			title: '@stonecrop/casl-middleware - Authorization',
			value: 'casl',
			description: 'CASL-based permission system for GraphQL',
			disabled: detected?.hasCasl,
			selected: false,
		},
		{
			title: '@stonecrop/rockfoil - PostGraphile middleware',
			value: 'rockfoil',
			description: 'PostGraphile integration for database-driven GraphQL',
			disabled: detected?.hasRockfoil,
			selected: false,
		},
		{
			title: 'Sample doctypes',
			value: 'doctypes',
			description: 'Example doctype JSON files to get started',
			disabled: detected?.hasDoctypes,
			selected: false,
		},
	]

	// Filter out disabled choices for the hint
	const availableCount = choices.filter(c => !c.disabled).length
	if (availableCount === 0) {
		consola.info('All Stonecrop features are already installed!')
		return null
	}

	// Show what's already installed
	if (detected) {
		const installed = choices.filter(c => c.disabled)
		if (installed.length > 0) {
			consola.info('Already installed:')
			for (const item of installed) {
				consola.info(`  ✓ ${item.title}`)
			}
			console.log()
		}
	}

	const response = await prompts(
		{
			type: 'multiselect',
			name: 'features',
			message: 'Select features to install',
			choices: choices.filter(c => !c.disabled),
			hint: '- Space to select. Return to submit',
			instructions: false,
		},
		{
			onCancel: () => {
				consola.info('Installation cancelled')
				process.exit(0)
			},
		}
	)

	if (!response.features || response.features.length === 0) {
		consola.info('No features selected')
		return null
	}

	const selected: SelectedFeatures = {
		frontend: response.features.includes('frontend'),
		graphql: response.features.includes('graphql'),
		graphqlClient: response.features.includes('graphqlClient'),
		casl: response.features.includes('casl'),
		rockfoil: response.features.includes('rockfoil'),
		doctypes: response.features.includes('doctypes'),
	}

	// Confirm selection
	if (!skipConfirm) {
		console.log()
		consola.info('Selected features:')
		if (selected.frontend) consola.info('  • @stonecrop/nuxt')
		if (selected.graphqlClient) consola.info('  • @stonecrop/graphql-client')
		if (selected.graphql) consola.info('  • @stonecrop/nuxt-grafserv')
		if (selected.casl) consola.info('  • @stonecrop/casl-middleware')
		if (selected.rockfoil) consola.info('  • @stonecrop/rockfoil')
		if (selected.doctypes) consola.info('  • Sample doctypes')
		console.log()

		const confirm = await prompts({
			type: 'confirm',
			name: 'proceed',
			message: 'Proceed with installation?',
			initial: true,
		})

		if (!confirm.proceed) {
			consola.info('Installation cancelled')
			return null
		}
	}

	return selected
}

/**
 * Prompt for GraphQL server configuration
 */
export async function promptGraphqlConfig(): Promise<{
	schemaPath: string
	resolversPath: string
	endpoint: string
} | null> {
	const response = await prompts([
		{
			type: 'text',
			name: 'schemaPath',
			message: 'GraphQL schema path',
			initial: './server/schema.graphql',
		},
		{
			type: 'text',
			name: 'resolversPath',
			message: 'Resolvers file path',
			initial: './server/resolvers.ts',
		},
		{
			type: 'text',
			name: 'endpoint',
			message: 'GraphQL endpoint URL',
			initial: '/graphql/',
		},
	])

	if (!response.schemaPath) {
		return null
	}

	return response
}
