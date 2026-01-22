/**
 * Utilities for managing Grafserv plugin configuration in nuxt.config.ts
 */

import { readFile, writeFile } from 'node:fs/promises'
import consola from 'consola'

import { findNuxtConfig } from './config'

/**
 * Add a plugin to the grafserv preset plugins array in nuxt.config.ts
 *
 * @param cwd - Current working directory
 * @param pluginCode - The plugin code to add (e.g., "pglCaslPlugin" or "createPglRockfoilPlugin({})")
 * @returns true if successfully added, false otherwise
 */
export async function addPluginToGrafservConfig(cwd: string, pluginCode: string): Promise<boolean> {
	const configPath = findNuxtConfig(cwd)
	if (!configPath) {
		consola.error('Could not find nuxt.config.ts')
		return false
	}

	let content = await readFile(configPath, 'utf-8')

	// Check if plugin is already configured
	if (content.includes(pluginCode)) {
		consola.info('Plugin already configured in nuxt.config.ts')
		return true
	}

	// Find grafserv configuration
	const grafservMatch = content.match(/grafserv\s*:\s*\{/)
	if (!grafservMatch || grafservMatch.index === undefined) {
		consola.warn('Could not find grafserv configuration in nuxt.config.ts')
		return false
	}

	// Check if preset exists within grafserv config
	const grafservStart = grafservMatch.index
	const presetMatch = content.slice(grafservStart).match(/preset\s*:\s*\{/)

	if (presetMatch && presetMatch.index !== undefined) {
		const presetStart = grafservStart + presetMatch.index
		// Check if plugins array exists within preset
		const pluginsMatch = content.slice(presetStart).match(/plugins\s*:\s*\[/)

		if (pluginsMatch && pluginsMatch.index !== undefined) {
			// Plugins array exists, add to it
			const pluginsStart = presetStart + pluginsMatch.index + pluginsMatch[0].length
			const closingBracket = findMatchingBracket(content, pluginsStart - 1)

			if (closingBracket !== -1) {
				const arrayContent = content.slice(pluginsStart, closingBracket).trim()
				const separator = arrayContent.length > 0 ? ', ' : ''

				content = content.slice(0, closingBracket) + separator + pluginCode + content.slice(closingBracket)

				await writeFile(configPath, content, 'utf-8')
				consola.success('Added plugin to grafserv.preset.plugins array')
				return true
			}
		} else {
			// preset exists but no plugins array, add it
			const presetContentStart = presetStart + presetMatch[0].length
			content =
				content.slice(0, presetContentStart) + `\n\t\t\tplugins: [${pluginCode}],` + content.slice(presetContentStart)

			await writeFile(configPath, content, 'utf-8')
			consola.success('Added plugins array to grafserv.preset configuration')
			return true
		}
	} else {
		// grafserv exists but no preset, add preset with plugins
		const grafservContentStart = grafservStart + grafservMatch[0].length
		content =
			content.slice(0, grafservContentStart) +
			`\n\t\tpreset: {\n\t\t\tplugins: [${pluginCode}],\n\t\t},` +
			content.slice(grafservContentStart)

		await writeFile(configPath, content, 'utf-8')
		consola.success('Added preset.plugins configuration to grafserv')
		return true
	}

	return false
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
