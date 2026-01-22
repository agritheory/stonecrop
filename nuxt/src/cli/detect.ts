/**
 * Detection utilities for existing Stonecrop setup
 */

import { existsSync } from 'node:fs'
import { join } from 'pathe'
import { hasModule, findNuxtConfig } from './utils/config'
import { hasPackage, readPackageJson } from './utils/package'

export interface DetectedFeatures {
	/** Is this a valid Nuxt project? */
	isNuxtProject: boolean
	/** Is @stonecrop/nuxt installed? */
	hasFrontend: boolean
	/** Is @stonecrop/nuxt-grafserv installed? */
	hasGraphql: boolean
	/** Is @stonecrop/graphql-client installed? */
	hasGraphqlClient: boolean
	/** Is @stonecrop/casl-middleware installed? */
	hasCasl: boolean
	/** Is @stonecrop/rockfoil installed? */
	hasRockfoil: boolean
	/** Does the doctypes directory exist? */
	hasDoctypes: boolean
	/** Does the server directory exist? */
	hasServerDir: boolean
	/** Does server/schema.graphql exist? */
	hasSchema: boolean
	/** Does server/resolvers.ts exist? */
	hasResolvers: boolean
}

/**
 * Detect what Stonecrop features are already installed in the project
 */
export async function detectFeatures(cwd: string): Promise<DetectedFeatures> {
	const result: DetectedFeatures = {
		isNuxtProject: false,
		hasFrontend: false,
		hasGraphql: false,
		hasGraphqlClient: false,
		hasCasl: false,
		hasRockfoil: false,
		hasDoctypes: false,
		hasServerDir: false,
		hasSchema: false,
		hasResolvers: false,
	}

	// Check if this is a Nuxt project
	const nuxtConfig = findNuxtConfig(cwd)
	const pkg = await readPackageJson(cwd)

	if (!nuxtConfig || !pkg) {
		return result
	}

	// Check for Nuxt in dependencies
	const hasNuxt = !!(pkg.dependencies?.nuxt || pkg.devDependencies?.nuxt)
	result.isNuxtProject = hasNuxt

	if (!hasNuxt) {
		return result
	}

	// Check for installed packages
	result.hasFrontend = await hasPackage(cwd, '@stonecrop/nuxt')
	result.hasGraphql = await hasPackage(cwd, '@stonecrop/nuxt-grafserv')
	result.hasGraphqlClient = await hasPackage(cwd, '@stonecrop/graphql-client')
	result.hasCasl = await hasPackage(cwd, '@stonecrop/casl-middleware')
	result.hasRockfoil = await hasPackage(cwd, '@stonecrop/rockfoil')

	// Also check nuxt.config for module registration
	if (!result.hasFrontend) {
		result.hasFrontend = await hasModule(cwd, '@stonecrop/nuxt')
	}
	if (!result.hasGraphql) {
		result.hasGraphql = await hasModule(cwd, '@stonecrop/nuxt-grafserv')
	}

	// Check for directories and files
	result.hasDoctypes = existsSync(join(cwd, 'doctypes'))
	result.hasServerDir = existsSync(join(cwd, 'server'))
	result.hasSchema = existsSync(join(cwd, 'server', 'schema.graphql'))
	result.hasResolvers =
		existsSync(join(cwd, 'server', 'resolvers.ts')) || existsSync(join(cwd, 'server', 'resolvers.js'))

	return result
}

/**
 * Check if the current directory is a valid Nuxt project
 */
export async function isNuxtProject(cwd: string): Promise<boolean> {
	const features = await detectFeatures(cwd)
	return features.isNuxtProject
}

/**
 * Get a summary of what's already installed
 */
export function getInstalledSummary(features: DetectedFeatures): string[] {
	const installed: string[] = []

	if (features.hasFrontend) {
		installed.push('@stonecrop/nuxt (frontend module)')
	}
	if (features.hasGraphqlClient) {
		installed.push('@stonecrop/graphql-client (GraphQL client)')
	}
	if (features.hasGraphql) {
		installed.push('@stonecrop/nuxt-grafserv (GraphQL server)')
	}
	if (features.hasCasl) {
		installed.push('@stonecrop/casl-middleware (authorization)')
	}
	if (features.hasRockfoil) {
		installed.push('@stonecrop/rockfoil (PostGraphile middleware)')
	}
	if (features.hasDoctypes) {
		installed.push('doctypes/ directory')
	}

	return installed
}
