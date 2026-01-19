/**
 * Utilities for manipulating nuxt.config.ts
 */

import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'pathe'
import consola from 'consola'

export interface NuxtConfigUpdate {
	/** Module to add to the modules array */
	module?: string
	/** Module options to add (key in defineNuxtConfig) */
	moduleOptions?: {
		key: string
		value: string
	}
	/** Import to add at the top of the file */
	import?: string
	/** Nitro configuration to add */
	nitroConfig?: {
		externalsInline?: string[]
	}
}

/**
 * Check if a module is already configured in nuxt.config.ts
 */
export async function hasModule(cwd: string, moduleName: string): Promise<boolean> {
	const configPath = findNuxtConfig(cwd)
	if (!configPath) return false

	const content = await readFile(configPath, 'utf-8')

	// Check for module in modules array
	const modulePatterns = [
		new RegExp(`['"\`]${escapeRegex(moduleName)}['"\`]`),
		new RegExp(`from\\s+['"\`]${escapeRegex(moduleName)}['"\`]`),
	]

	return modulePatterns.some(pattern => pattern.test(content))
}

/**
 * Find the nuxt.config file in the project
 */
export function findNuxtConfig(cwd: string): string | null {
	const candidates = ['nuxt.config.ts', 'nuxt.config.js', 'nuxt.config.mjs']

	for (const candidate of candidates) {
		const fullPath = join(cwd, candidate)
		if (existsSync(fullPath)) {
			return fullPath
		}
	}

	return null
}

/**
 * Update nuxt.config.ts with new module configuration
 *
 * This uses string manipulation rather than AST parsing for simplicity
 * and to preserve formatting/comments as much as possible.
 */
export async function updateNuxtConfig(cwd: string, updates: NuxtConfigUpdate): Promise<boolean> {
	const configPath = findNuxtConfig(cwd)
	if (!configPath) {
		consola.error('Could not find nuxt.config.ts in', cwd)
		return false
	}

	let content = await readFile(configPath, 'utf-8')
	let modified = false

	// Add import if specified
	if (updates.import) {
		if (!content.includes(updates.import)) {
			// Find the first import or the start of the file
			const importMatch = content.match(/^import\s+/m)
			if (importMatch && importMatch.index !== undefined) {
				// Add after existing imports
				const lastImportMatch = content.match(/^import\s.*$/gm)
				if (lastImportMatch && lastImportMatch.length > 0) {
					const lastImport = lastImportMatch[lastImportMatch.length - 1]
					if (lastImport) {
						const lastImportIndex = content.lastIndexOf(lastImport)
						const insertIndex = lastImportIndex + lastImport.length
						content = content.slice(0, insertIndex) + '\n' + updates.import + content.slice(insertIndex)
					}
				}
			} else {
				// Add at the start of the file
				content = updates.import + '\n\n' + content
			}
			modified = true
		}
	}

	// Add module to modules array
	if (updates.module) {
		const moduleEntry = updates.module

		// Find the modules array
		const modulesMatch = content.match(/modules\s*:\s*\[/)
		if (modulesMatch && modulesMatch.index !== undefined) {
			// Find the closing bracket
			const startIndex = modulesMatch.index + modulesMatch[0].length
			const closingIndex = findMatchingBracket(content, startIndex - 1)

			if (closingIndex !== -1) {
				// Check if module is already present in the modules array (not just anywhere in the file)
				const arrayContent = content.slice(startIndex, closingIndex)
				const moduleAlreadyExists = arrayContent.includes(moduleEntry)

				if (!moduleAlreadyExists) {
					// Check if array is empty
					const separator = arrayContent.trim().length > 0 ? ', ' : ''

					content = content.slice(0, closingIndex) + separator + moduleEntry + content.slice(closingIndex)
					modified = true
				}
			}
		} else {
			// modules array doesn't exist, we need to add it
			const defineNuxtConfigMatch = content.match(/defineNuxtConfig\s*\(\s*\{/)
			if (defineNuxtConfigMatch && defineNuxtConfigMatch.index !== undefined) {
				const insertIndex = defineNuxtConfigMatch.index + defineNuxtConfigMatch[0].length
				content = content.slice(0, insertIndex) + `\n\tmodules: [${moduleEntry}],` + content.slice(insertIndex)
				modified = true
			}
		}
	}

	// Add module options
	if (updates.moduleOptions) {
		const { key, value } = updates.moduleOptions

		// Check if the key already exists
		const keyPattern = new RegExp(`${escapeRegex(key)}\\s*:`)
		if (!keyPattern.test(content)) {
			// Find defineNuxtConfig and add the option
			const defineNuxtConfigMatch = content.match(/defineNuxtConfig\s*\(\s*\{/)
			if (defineNuxtConfigMatch && defineNuxtConfigMatch.index !== undefined) {
				// Find a good place to insert (after modules if it exists, otherwise at the start)
				const modulesEndMatch = content.match(/modules\s*:\s*\[[^\]]*\]\s*,?/)
				if (modulesEndMatch && modulesEndMatch.index !== undefined) {
					const insertIndex = modulesEndMatch.index + modulesEndMatch[0].length
					content = content.slice(0, insertIndex) + `\n\n\t${key}: ${value},` + content.slice(insertIndex)
				} else {
					const insertIndex = defineNuxtConfigMatch.index + defineNuxtConfigMatch[0].length
					content = content.slice(0, insertIndex) + `\n\t${key}: ${value},` + content.slice(insertIndex)
				}
				modified = true
			}
		}
	}

	// Add Nitro configuration
	if (updates.nitroConfig) {
		// Check if nitro config already exists
		const nitroMatch = content.match(/nitro\s*:\s*\{/)

		if (updates.nitroConfig.externalsInline) {
			const packagesStr = updates.nitroConfig.externalsInline.map(pkg => `'${pkg}'`).join(', ')

			if (nitroMatch && nitroMatch.index !== undefined) {
				// Nitro config exists, check if externals.inline exists
				const externalsMatch = content.match(/externals\s*:\s*\{/)

				if (externalsMatch && externalsMatch.index !== undefined && externalsMatch.index > nitroMatch.index) {
					// Check if inline array exists
					const inlineMatch = content.match(/inline\s*:\s*\[/)

					if (inlineMatch && inlineMatch.index !== undefined && inlineMatch.index > externalsMatch.index) {
						// inline array exists, add packages if not present
						const startIndex = inlineMatch.index + inlineMatch[0].length
						const closingIndex = findMatchingBracket(content, startIndex - 1)

						if (closingIndex !== -1) {
							const arrayContent = content.slice(startIndex, closingIndex).trim()
							const separator = arrayContent.length > 0 ? ', ' : ''
							content = content.slice(0, closingIndex) + separator + packagesStr + content.slice(closingIndex)
							modified = true
						}
					} else {
						// externals exists but no inline, add it
						const startIndex = externalsMatch.index + externalsMatch[0].length
						content = content.slice(0, startIndex) + `\n\t\t\tinline: [${packagesStr}],` + content.slice(startIndex)
						modified = true
					}
				} else {
					// nitro exists but no externals, add it
					const startIndex = nitroMatch.index + nitroMatch[0].length
					content =
						content.slice(0, startIndex) +
						`\n\t\texternals: {\n\t\t\tinline: [${packagesStr}],\n\t\t},` +
						content.slice(startIndex)
					modified = true
				}
			} else {
				// No nitro config, add everything - insert after modules array
				const defineNuxtConfigMatch = content.match(/defineNuxtConfig\s*\(\s*\{/)
				if (defineNuxtConfigMatch && defineNuxtConfigMatch.index !== undefined) {
					// Try to find modules array to insert after it
					const modulesEndMatch = content.match(/modules\s*:\s*\[[^\]]*\]\s*,?/)
					if (modulesEndMatch && modulesEndMatch.index !== undefined) {
						const insertIndex = modulesEndMatch.index + modulesEndMatch[0].length
						content =
							content.slice(0, insertIndex) +
							`\n\n\t// Nitro configuration for Stonecrop CSS handling\n\tnitro: {\n\t\texternals: {\n\t\t\tinline: [${packagesStr}],\n\t\t},\n\t},` +
							content.slice(insertIndex)
					} else {
						// No modules, add at the start of config
						const insertIndex = defineNuxtConfigMatch.index + defineNuxtConfigMatch[0].length
						content =
							content.slice(0, insertIndex) +
							`\n\t// Nitro configuration for Stonecrop CSS handling\n\tnitro: {\n\t\texternals: {\n\t\t\tinline: [${packagesStr}],\n\t\t},\n\t},` +
							content.slice(insertIndex)
					}
					modified = true
				}
			}
		}
	}

	if (modified) {
		await writeFile(configPath, content, 'utf-8')
		consola.success(`Updated ${configPath}`)
	}

	return modified
}

/**
 * Find the matching closing bracket
 */
function findMatchingBracket(content: string, openIndex: number): number {
	const openChar = content[openIndex]
	const closeChar = openChar === '[' ? ']' : openChar === '{' ? '}' : ')'

	let depth = 1
	let i = openIndex + 1

	while (i < content.length && depth > 0) {
		const char = content[i]
		if (char === openChar) depth++
		else if (char === closeChar) depth--
		i++
	}

	return depth === 0 ? i - 1 : -1
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
