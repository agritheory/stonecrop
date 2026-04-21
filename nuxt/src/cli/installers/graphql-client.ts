/**
 * GraphQL client installer
 * Installs @stonecrop/graphql-client for frontend GraphQL operations
 */

import consola from 'consola'
import { addDependencies } from '../utils/package'

export interface GraphqlClientInstallerOptions {
	cwd: string
}

/**
 * Install the @stonecrop/graphql-client package
 */
export async function installGraphqlClient(options: GraphqlClientInstallerOptions): Promise<boolean> {
	const { cwd } = options

	consola.start('Installing @stonecrop/graphql-client...')

	try {
		// Add dependencies - use latest published version
		await addDependencies(cwd, {
			'@stonecrop/graphql-client': 'latest',
			graphql: '^16.11.0',
		})

		consola.success('@stonecrop/graphql-client installed successfully')
		consola.info('Usage: import { createClient } from "@stonecrop/graphql-client"')
		return true
	} catch (error) {
		consola.error('Failed to install @stonecrop/graphql-client:', error)
		return false
	}
}
