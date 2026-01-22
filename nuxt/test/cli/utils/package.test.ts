import { existsSync, type PathLike } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'pathe'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
	readPackageJson,
	writePackageJson,
	hasPackage,
	addDependencies,
	detectPackageManager,
	getInstallCommand,
} from '../../../src/cli/utils/package'

vi.mock('node:fs/promises')
vi.mock('node:fs')
vi.mock('consola', () => ({
	default: {
		error: vi.fn(),
		info: vi.fn(),
		success: vi.fn(),
	},
}))

describe('package utilities', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('readPackageJson', () => {
		it('should return null when package.json does not exist', async () => {
			vi.mocked(existsSync).mockReturnValue(false)

			const result = await readPackageJson('/test')

			expect(result).toBeNull()
		})

		it('should read and parse package.json', async () => {
			vi.mocked(existsSync).mockReturnValue(true)
			vi.mocked(readFile).mockResolvedValue(
				JSON.stringify({
					name: 'test-project',
					version: '1.0.0',
					dependencies: {
						nuxt: '^3.0.0',
					},
				})
			)

			const result = await readPackageJson('/test')

			expect(result).toEqual({
				name: 'test-project',
				version: '1.0.0',
				dependencies: {
					nuxt: '^3.0.0',
				},
			})
			expect(readFile).toHaveBeenCalledWith(join('/test', 'package.json'), 'utf-8')
		})
	})

	describe('writePackageJson', () => {
		it('should write package.json with tabs', async () => {
			const pkg = {
				name: 'test',
				version: '1.0.0',
			}

			await writePackageJson('/test', pkg)

			expect(writeFile).toHaveBeenCalledWith(
				join('/test', 'package.json'),
				JSON.stringify(pkg, null, '\t') + '\n',
				'utf-8'
			)
		})
	})

	describe('hasPackage', () => {
		it('should return false when package.json does not exist', async () => {
			vi.mocked(existsSync).mockReturnValue(false)

			const result = await hasPackage('/test', '@stonecrop/nuxt')

			expect(result).toBe(false)
		})

		it('should detect package in dependencies', async () => {
			vi.mocked(existsSync).mockReturnValue(true)
			vi.mocked(readFile).mockResolvedValue(
				JSON.stringify({
					dependencies: {
						'@stonecrop/nuxt': '^0.1.0',
					},
				})
			)

			const result = await hasPackage('/test', '@stonecrop/nuxt')

			expect(result).toBe(true)
		})

		it('should detect package in devDependencies', async () => {
			vi.mocked(existsSync).mockReturnValue(true)
			vi.mocked(readFile).mockResolvedValue(
				JSON.stringify({
					devDependencies: {
						'@stonecrop/nuxt': '^0.1.0',
					},
				})
			)

			const result = await hasPackage('/test', '@stonecrop/nuxt')

			expect(result).toBe(true)
		})

		it('should return false when package not found', async () => {
			vi.mocked(existsSync).mockReturnValue(true)
			vi.mocked(readFile).mockResolvedValue(
				JSON.stringify({
					dependencies: {
						nuxt: '^3.0.0',
					},
				})
			)

			const result = await hasPackage('/test', '@stonecrop/nuxt')

			expect(result).toBe(false)
		})
	})

	describe('addDependencies', () => {
		it('should return false when package.json does not exist', async () => {
			vi.mocked(existsSync).mockReturnValue(false)

			const result = await addDependencies('/test', { '@stonecrop/nuxt': '^0.1.0' })

			expect(result).toBe(false)
		})

		it('should add new dependencies', async () => {
			vi.mocked(existsSync).mockReturnValue(true)
			vi.mocked(readFile).mockResolvedValue(
				JSON.stringify({
					name: 'test',
					dependencies: {
						nuxt: '^3.0.0',
					},
				})
			)

			const result = await addDependencies('/test', {
				'@stonecrop/nuxt': '^0.1.0',
				'@stonecrop/aform': '^0.1.0',
			})

			expect(result).toBe(true)
			expect(writeFile).toHaveBeenCalled()
			const written = JSON.parse((vi.mocked(writeFile).mock.calls[0]?.[1] as string).trim())
			expect(written.dependencies['@stonecrop/aform']).toBe('^0.1.0')
			expect(written.dependencies['@stonecrop/nuxt']).toBe('^0.1.0')
			expect(written.dependencies.nuxt).toBe('^3.0.0')
		})

		it('should add to devDependencies when dev option is true', async () => {
			vi.mocked(existsSync).mockReturnValue(true)
			vi.mocked(readFile).mockResolvedValue(
				JSON.stringify({
					name: 'test',
				})
			)

			await addDependencies('/test', { '@stonecrop/nuxt': '^0.1.0' }, { dev: true })

			const written = JSON.parse((vi.mocked(writeFile).mock.calls[0]?.[1] as string).trim())
			expect(written.devDependencies['@stonecrop/nuxt']).toBe('^0.1.0')
			expect(written.dependencies).toBeUndefined()
		})

		it('should not modify if dependencies already exist', async () => {
			vi.mocked(existsSync).mockReturnValue(true)
			vi.mocked(readFile).mockResolvedValue(
				JSON.stringify({
					name: 'test',
					dependencies: {
						'@stonecrop/nuxt': '^0.1.0',
					},
				})
			)

			const result = await addDependencies('/test', { '@stonecrop/nuxt': '^0.1.0' })

			expect(result).toBe(false)
			expect(writeFile).not.toHaveBeenCalled()
		})

		it('should sort dependencies alphabetically', async () => {
			vi.mocked(existsSync).mockReturnValue(true)
			vi.mocked(readFile).mockResolvedValue(
				JSON.stringify({
					name: 'test',
					dependencies: {
						vue: '^3.0.0',
					},
				})
			)

			await addDependencies('/test', {
				'@stonecrop/nuxt': '^0.1.0',
				'@stonecrop/aform': '^0.1.0',
			})

			const written = JSON.parse((vi.mocked(writeFile).mock.calls[0]?.[1] as string).trim())
			const keys = Object.keys(written.dependencies)
			expect(keys).toEqual(['@stonecrop/aform', '@stonecrop/nuxt', 'vue'])
		})
	})

	describe('detectPackageManager', () => {
		it('should detect bun from bun.lockb', () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'bun.lockb')
			})

			const result = detectPackageManager('/test')

			expect(result).toBe('bun')
		})

		it('should detect bun from bun.lock', () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'bun.lock')
			})

			const result = detectPackageManager('/test')

			expect(result).toBe('bun')
		})

		it('should detect pnpm', () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'pnpm-lock.yaml')
			})

			const result = detectPackageManager('/test')

			expect(result).toBe('pnpm')
		})

		it('should detect yarn', () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'yarn.lock')
			})

			const result = detectPackageManager('/test')

			expect(result).toBe('yarn')
		})

		it('should default to npm', () => {
			vi.mocked(existsSync).mockReturnValue(false)

			const result = detectPackageManager('/test')

			expect(result).toBe('npm')
		})
	})

	describe('getInstallCommand', () => {
		it('should return npm install for npm', () => {
			vi.mocked(existsSync).mockReturnValue(false)

			const result = getInstallCommand('/test')

			expect(result).toBe('npm install')
		})

		it('should return pnpm install for pnpm', () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'pnpm-lock.yaml')
			})

			const result = getInstallCommand('/test')

			expect(result).toBe('pnpm install')
		})

		it('should return yarn for yarn', () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'yarn.lock')
			})

			const result = getInstallCommand('/test')

			expect(result).toBe('yarn')
		})

		it('should return bun install for bun', () => {
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'bun.lockb')
			})

			const result = getInstallCommand('/test')

			expect(result).toBe('bun install')
		})
	})
})
