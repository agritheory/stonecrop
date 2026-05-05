import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Tests for the @stonecrop/themes package build output.
 *
 * These tests will FAIL against the current state because:
 * - package.json exports map is broken (non-agritheory themes point to default.css)
 * - Alternate themes are NOT self-contained (only override ~10-15 variables)
 *
 * After the refactor:
 * 1. Fix exports map in package.json
 * 2. Add build-time theme merge: each alternate theme's source stays DRY
 *    (overrides only), and the build script merges base + overrides into
 *    a self-contained dist/*.css
 * 3. Rebuild
 *
 * Then these tests will PASS.
 */

describe('themes package - exports', () => {
	const packageJsonPath = path.resolve(__dirname, '../package.json')
	const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

	it('each theme export should point to its own file', () => {
		const exports = pkg.exports as Record<string, string>
		for (const [key, value] of Object.entries(exports)) {
			const themeName = key.replace('.css', '')
			const expectedPath = `./dist/${themeName}.css`
			expect(value).toBe(expectedPath)
		}
	})
})

describe('themes package - self-contained alternate themes', () => {
	const distDir = path.resolve(__dirname, '../dist')

	// List of themes that should be self-contained (define ALL :root variables)
	const selfContainedThemes = ['dark', 'agritheory', 'verdant', 'excel', 'legal', 'vue']

	// Read the base _variables.css to count how many variables should exist
	const baseVariablesPath = path.resolve(__dirname, '../default/_variables.css')
	const baseVariablesContent = fs.readFileSync(baseVariablesPath, 'utf-8')
	const baseVariableCount = (baseVariablesContent.match(/--sc-[\w-]+/g) || []).length

	it(`base _variables.css should define a reasonable number of variables`, () => {
		expect(baseVariableCount).toBeGreaterThan(50)
	})

	for (const themeName of selfContainedThemes) {
		it(`${themeName}.css should be self-contained (define all base variables)`, () => {
			// After build-time generation, dist/<theme>.css is merged (base + overrides)
			// and must define all variables. Source files are DRY and intentionally
			// only contain overrides, so we only test the built dist/ output.
			const themePath = path.join(distDir, `${themeName}.css`)
			expect(fs.existsSync(themePath)).toBe(true)
			const themeContent = fs.readFileSync(themePath, 'utf-8')
			const themeVariableCount = (themeContent.match(/--sc-[\w-]+/g) || []).length
			expect(themeVariableCount).toBeGreaterThanOrEqual(baseVariableCount)
		})
	}
})
