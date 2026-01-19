/**
 * Vite plugin to handle symlinked Stonecrop packages during development
 *
 * When packages are linked (e.g., via pnpm link), their real paths may be outside
 * Vite's default fs.allow list. This plugin detects symlinked packages and adds them
 * to fs.allow so Vite can serve their files during development.
 */

import { existsSync, realpathSync } from 'node:fs'
import { dirname } from 'node:path'
import type { Plugin } from 'vite'

export interface SymlinkedPackagesPluginOptions {
	/** Root directory of the Nuxt project */
	rootDir: string
	/** List of package names to check for symlinks */
	packages: string[]
	/** Logger function for debug output */
	logger?: (message: string) => void
}

export function createSymlinkedPackagesPlugin(options: SymlinkedPackagesPluginOptions): Plugin {
	const { rootDir, packages, logger } = options

	return {
		name: 'stonecrop-symlinked-packages',
		config() {
			const allowPaths = new Set<string>()

			// Check if @stonecrop/nuxt itself is symlinked
			const nuxtModulePath = `${rootDir}/node_modules/@stonecrop/nuxt`

			try {
				if (existsSync(nuxtModulePath)) {
					const realNuxtModulePath = realpathSync(nuxtModulePath)

					if (realNuxtModulePath !== nuxtModulePath) {
						// @stonecrop/nuxt is symlinked - add the monorepo root
						const monorepoRoot = dirname(realNuxtModulePath)
						allowPaths.add(monorepoRoot)
						logger?.(`@stonecrop/nuxt is symlinked, adding monorepo root: ${monorepoRoot}`)
					}
				}
			} catch (e) {
				logger?.(`Error checking @stonecrop/nuxt symlink: ${e instanceof Error ? e.message : String(e)}`)
			}

			// Check individual Stonecrop packages for symlinks
			for (const pkg of packages) {
				const pkgPath = `${rootDir}/node_modules/${pkg}`
				try {
					if (existsSync(pkgPath)) {
						const realPath = realpathSync(pkgPath)
						if (realPath !== pkgPath) {
							allowPaths.add(realPath)
							logger?.(`Adding symlinked package to fs.allow: ${realPath}`)
						}
					}
				} catch {
					// Skip packages that can't be checked
				}
			}

			if (allowPaths.size > 0) {
				logger?.(`Vite fs.allow updated with ${allowPaths.size} path(s)`)
				return {
					server: {
						fs: {
							allow: [...allowPaths],
						},
					},
				}
			}
		},
	}
}
