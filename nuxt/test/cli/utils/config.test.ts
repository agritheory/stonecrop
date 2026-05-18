import { existsSync, type PathLike } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'pathe'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { hasModule, findNuxtConfig, updateNuxtConfig } from '../../../src/cli/utils/config'

vi.mock('node:fs/promises')
vi.mock('node:fs')
vi.mock('consola', () => ({
	default: {
		error: vi.fn(),
		info: vi.fn(),
		success: vi.fn(),
	},
}))

describe('config utilities', { tags: ['unit', 'nuxt'] }, () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.resetAllMocks()
	})

	describe('findNuxtConfig', () => {
		it('should find nuxt.config.ts', () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})

			const result = findNuxtConfig('/test')

			expect(result).toBe('/test/nuxt.config.ts')
		})

		it('should find nuxt.config.js', () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.js')
			})

			const result = findNuxtConfig('/test')

			expect(result).toBe('/test/nuxt.config.js')
		})

		it('should find nuxt.config.mjs', () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.mjs')
			})

			const result = findNuxtConfig('/test')

			expect(result).toBe('/test/nuxt.config.mjs')
		})

		it('should return null when no config found', () => {
			vi.mocked(existsSync).mockReturnValue(false)

			const result = findNuxtConfig('/test')

			expect(result).toBeNull()
		})

		it('should prioritize .ts over .js', () => {
			vi.mocked(existsSync).mockReturnValue(true)

			const result = findNuxtConfig('/test')

			expect(result).toBe('/test/nuxt.config.ts')
		})
	})

	describe('hasModule', () => {
		it('should return false when config not found', async () => {
			vi.mocked(existsSync).mockReturnValue(false)

			const result = await hasModule('/test', '@stonecrop/nuxt')

			expect(result).toBe(false)
		})

		it('should detect module in single quotes', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(`
				export default defineNuxtConfig({
					modules: ['@stonecrop/nuxt']
				})
			`)

			const result = await hasModule('/test', '@stonecrop/nuxt')

			expect(result).toBe(true)
		})

		it('should detect module in double quotes', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(`
				export default defineNuxtConfig({
					modules: ["@stonecrop/nuxt"]
				})
			`)

			const result = await hasModule('/test', '@stonecrop/nuxt')

			expect(result).toBe(true)
		})

		it('should detect module import', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(`
				import StonecropModule from '@stonecrop/nuxt'
				export default defineNuxtConfig({
					modules: [StonecropModule]
				})
			`)

			const result = await hasModule('/test', '@stonecrop/nuxt')

			expect(result).toBe(true)
		})

		it('should return false when module not found', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(`
				export default defineNuxtConfig({
					modules: ['@other/module']
				})
			`)

			const result = await hasModule('/test', '@stonecrop/nuxt')

			expect(result).toBe(false)
		})
	})

	describe('updateNuxtConfig', () => {
		const baseConfig = `export default defineNuxtConfig({
	modules: [],
})`

		it('should return false when config not found', async () => {
			vi.mocked(existsSync).mockReturnValue(false)

			const result = await updateNuxtConfig('/test', { module: '@stonecrop/nuxt' })

			expect(result).toBe(false)
		})

		it('should add import to config', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(`import { defineNuxtConfig } from 'nuxt/config'\n\n${baseConfig}`)

			await updateNuxtConfig('/test', {
				import: "import MyModule from '@stonecrop/nuxt'",
			})

			expect(writeFile).toHaveBeenCalledWith(
				'/test/nuxt.config.ts',
				expect.stringContaining("import MyModule from '@stonecrop/nuxt'"),
				'utf-8'
			)
		})

		it('should add module to existing modules array', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(`export default defineNuxtConfig({
	modules: ['@other/module'],
})`)

			await updateNuxtConfig('/test', {
				module: "'@stonecrop/nuxt'",
			})

			expect(writeFile).toHaveBeenCalledWith(
				'/test/nuxt.config.ts',
				expect.stringContaining("'@other/module', '@stonecrop/nuxt'"),
				'utf-8'
			)
		})

		it('should not add duplicate module', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(`export default defineNuxtConfig({
	modules: ['@stonecrop/nuxt'],
})`)

			const result = await updateNuxtConfig('/test', {
				module: "'@stonecrop/nuxt'",
			})

			expect(result).toBe(false)
			expect(writeFile).not.toHaveBeenCalled()
		})

		it('should create modules array if not exists', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(`export default defineNuxtConfig({
})`)

			await updateNuxtConfig('/test', {
				module: "'@stonecrop/nuxt'",
			})

			expect(writeFile).toHaveBeenCalledWith(
				'/test/nuxt.config.ts',
				expect.stringContaining("modules: ['@stonecrop/nuxt']"),
				'utf-8'
			)
		})

		it('should add module options', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(baseConfig)

			await updateNuxtConfig('/test', {
				moduleOptions: {
					key: 'stonecrop',
					value: '{ docbuilder: true }',
				},
			})

			expect(writeFile).toHaveBeenCalledWith(
				'/test/nuxt.config.ts',
				expect.stringContaining('stonecrop: { docbuilder: true }'),
				'utf-8'
			)
		})

		it('should not duplicate module options', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(`export default defineNuxtConfig({
	modules: [],
	stonecrop: { docbuilder: true }
})`)

			const result = await updateNuxtConfig('/test', {
				moduleOptions: {
					key: 'stonecrop',
					value: '{ docbuilder: true }',
				},
			})

			expect(result).toBe(false)
			expect(writeFile).not.toHaveBeenCalled()
		})

		it('should add nitro config with externals inline', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(baseConfig)

			await updateNuxtConfig('/test', {
				nitroConfig: {
					externalsInline: ['@stonecrop/aform', '@stonecrop/atable'],
				},
			})

			const writtenContent = vi.mocked(writeFile).mock.calls[0]?.[1] as string
			expect(writtenContent).toContain('nitro:')
			expect(writtenContent).toContain('externals:')
			expect(writtenContent).toContain('inline:')
			expect(writtenContent).toContain("'@stonecrop/aform'")
			expect(writtenContent).toContain("'@stonecrop/atable'")
		})

		it('should add nitro inline to existing externals config', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(`export default defineNuxtConfig({
	modules: [],
	nitro: {
		externals: {
			traceInclude: ['**/*.js']
		}
	}
})`)

			await updateNuxtConfig('/test', {
				nitroConfig: {
					externalsInline: ['@stonecrop/aform'],
				},
			})

			const writtenContent = vi.mocked(writeFile).mock.calls[0]?.[1] as string
			expect(writtenContent).toContain('externals:')
			expect(writtenContent).toContain('inline:')
			expect(writtenContent).toContain("'@stonecrop/aform'")
		})

		it('should add to existing nitro config', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(`export default defineNuxtConfig({
	modules: [],
	nitro: {
		prerender: { routes: ['/'] }
	}
})`)

			await updateNuxtConfig('/test', {
				nitroConfig: {
					externalsInline: ['@stonecrop/aform'],
				},
			})

			const writtenContent = vi.mocked(writeFile).mock.calls[0]?.[1] as string
			expect(writtenContent).toContain('externals:')
			expect(writtenContent).toContain("'@stonecrop/aform'")
		})

		it('should handle complex config updates', async () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'nuxt.config.ts')
			})
			vi.mocked(readFile).mockResolvedValue(`import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
	modules: ['@nuxtjs/tailwindcss'],
})`)

			await updateNuxtConfig('/test', {
				import: "import stonecrop from '@stonecrop/nuxt'",
				module: "'@stonecrop/nuxt'",
				moduleOptions: {
					key: 'stonecrop',
					value: '{ docbuilder: true }',
				},
			})

			const writtenContent = vi.mocked(writeFile).mock.calls[0]?.[1] as string
			expect(writtenContent).toContain("import stonecrop from '@stonecrop/nuxt'")
			expect(writtenContent).toContain("'@stonecrop/nuxt'")
			expect(writtenContent).toContain('stonecrop: { docbuilder: true }')
		})
	})
})
