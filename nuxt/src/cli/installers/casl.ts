/**
 * CASL middleware installer
 * Installs @stonecrop/casl-middleware and updates middleware.ts
 */

import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'pathe'
import consola from 'consola'
import { addDependencies } from '../utils/package'

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

		// Update middleware.ts to include CASL
		await updateMiddlewareWithCasl(cwd)

		consola.success('@stonecrop/casl-middleware installed successfully')
		return true
	} catch (error) {
		consola.error('Failed to install @stonecrop/casl-middleware:', error)
		return false
	}
}

/**
 * Update the middleware.ts file to include CASL authorization
 */
async function updateMiddlewareWithCasl(cwd: string): Promise<void> {
	const middlewarePath = join(cwd, 'server', 'middleware.ts')

	if (!existsSync(middlewarePath)) {
		consola.warn('server/middleware.ts not found. Please install GraphQL server first.')
		return
	}

	let content = await readFile(middlewarePath, 'utf-8')

	// Check if CASL is already imported
	if (content.includes('@stonecrop/casl-middleware')) {
		consola.info('CASL middleware already configured')
		return
	}

	// Add import at the top
	const importStatement = "import { createAbility } from '@stonecrop/casl-middleware'"

	// Find the first import and add after it
	const importMatch = content.match(/^import\s+.*$/m)
	if (importMatch && importMatch.index !== undefined) {
		const insertIndex = importMatch.index + importMatch[0].length
		content = content.slice(0, insertIndex) + '\n' + importStatement + content.slice(insertIndex)
	} else {
		content = importStatement + '\n\n' + content
	}

	// Add CASL middleware to the chain
	const caslMiddleware = `
	// CASL Authorization middleware
	async (ctx: GrafastContext, next) => {
		// Create CASL ability based on user context
		// Customize this based on your authorization rules
		ctx.ability = await createAbility(ctx.user)

		return next()
	},`

	// Find the middleware array and add CASL middleware
	const middlewareArrayMatch = content.match(/const middleware:\s*MiddlewareFunction\[\]\s*=\s*\[/)
	if (middlewareArrayMatch && middlewareArrayMatch.index !== undefined) {
		const insertIndex = middlewareArrayMatch.index + middlewareArrayMatch[0].length
		content = content.slice(0, insertIndex) + caslMiddleware + content.slice(insertIndex)
	}

	await writeFile(middlewarePath, content, 'utf-8')
	consola.info('Updated server/middleware.ts with CASL authorization')
}
