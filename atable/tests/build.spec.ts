import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * These tests assert the desired build output after the theming refactor.
 *
 * They will FAIL against the current dist/ because:
 * - dist/assets/index.css currently contains :root blocks (inlined from SFC <style> @imports)
 * - dist/atable.js does NOT contain an external @stonecrop/themes import
 *
 * After the refactor:
 * 1. Remove @import url('@stonecrop/themes/default.css') from Vue SFC <style> blocks
 * 2. Add import '@stonecrop/themes/default.css' to src/index.ts
 * 3. Mark @stonecrop/themes as external via regex in vite.config.ts
 * 4. Rebuild
 *
 * Then these tests will PASS.
 */
describe('atable build output - theming', () => {
	const distDir = path.resolve(__dirname, '../dist')
	const cssPath = path.join(distDir, 'assets/index.css')
	const jsPath = path.join(distDir, 'atable.js')

	it('dist/assets/index.css should NOT contain :root variable blocks', () => {
		// The structural CSS auto-injected by libInjectCss must NOT redefine
		// :root variables, otherwise static user CSS overrides get clobbered.
		const css = fs.readFileSync(cssPath, 'utf-8')
		expect(css).not.toContain(':root')
	})

	it('dist/atable.js should import theme as external dependency', () => {
		// The theme must be imported by the JS entry point so the consumer's
		// bundler resolves it alongside other static CSS, preserving cascade order.
		const js = fs.readFileSync(jsPath, 'utf-8')
		expect(js).toMatch(/@stonecrop[/\\]themes[/\\]default\.css/)
	})

	it('dist/atable.js should still auto-inject structural CSS', () => {
		// libInjectCss must still inject the structural styles asset.
		const js = fs.readFileSync(jsPath, 'utf-8')
		expect(js).toContain("import './assets/index.css'")
	})
})
