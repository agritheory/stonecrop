/**
 * Rockfoil installer
 * Installs @stonecrop/rockfoil PostGraphile middleware
 */

import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'pathe'
import consola from 'consola'
import { addDependencies } from '../utils/package'

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
			postgraphile: '^5.0.0-rc.3',
		})

		// Update middleware.ts to include Rockfoil if it exists
		await updateMiddlewareWithRockfoil(cwd)

		consola.success('@stonecrop/rockfoil installed successfully')
		return true
	} catch (error) {
		consola.error('Failed to install @stonecrop/rockfoil:', error)
		return false
	}
}

/**
 * Update the middleware.ts file to include Rockfoil
 */
async function updateMiddlewareWithRockfoil(cwd: string): Promise<void> {
	const middlewarePath = join(cwd, 'server', 'middleware.ts')

	if (!existsSync(middlewarePath)) {
		consola.warn('server/middleware.ts not found. Please install GraphQL server first.')
		consola.info('You can add Rockfoil middleware manually after setting up the GraphQL server.')
		return
	}

	let content = await readFile(middlewarePath, 'utf-8')

	// Check if Rockfoil is already imported
	if (content.includes('@stonecrop/rockfoil')) {
		consola.info('Rockfoil middleware already configured')
		return
	}

	// Add import at the top
	const importStatement = "import { createRockfoilMiddleware } from '@stonecrop/rockfoil'"

	// Find the first import and add after it
	const importMatch = content.match(/^import\s+.*$/m)
	if (importMatch && importMatch.index !== undefined) {
		const insertIndex = importMatch.index + importMatch[0].length
		content = content.slice(0, insertIndex) + '\n' + importStatement + content.slice(insertIndex)
	} else {
		content = importStatement + '\n\n' + content
	}

	// Add Rockfoil middleware to the chain (add a comment for manual configuration)
	const rockfoilMiddleware = `
	// Rockfoil PostGraphile middleware
	// Configure with your database connection
	// async (ctx: GrafastContext, next) => {
	//   const rockfoil = createRockfoilMiddleware({
	//     connectionString: process.env.DATABASE_URL,
	//   })
	//   return rockfoil(ctx, next)
	// },`

	// Find the middleware array and add Rockfoil middleware
	const middlewareArrayMatch = content.match(/const middleware:\s*MiddlewareFunction\[\]\s*=\s*\[/)
	if (middlewareArrayMatch && middlewareArrayMatch.index !== undefined) {
		const insertIndex = middlewareArrayMatch.index + middlewareArrayMatch[0].length
		content = content.slice(0, insertIndex) + rockfoilMiddleware + content.slice(insertIndex)
	}

	await writeFile(middlewarePath, content, 'utf-8')
	consola.info('Updated server/middleware.ts with Rockfoil placeholder')
	consola.info('Configure your DATABASE_URL and uncomment the Rockfoil middleware')
}
