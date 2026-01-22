import { existsSync, type PathLike } from 'node:fs'
import { join } from 'pathe'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { detectFeatures, isNuxtProject, getInstalledSummary } from '../../src/cli/detect'
import { hasModule, findNuxtConfig } from '../../src/cli/utils/config'
import { hasPackage, readPackageJson } from '../../src/cli/utils/package'

vi.mock('node:fs')
vi.mock('../../src/cli/utils/config')
vi.mock('../../src/cli/utils/package')

describe('detect utilities', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('detectFeatures', () => {
		it('should return all false when not a Nuxt project', async () => {
			vi.mocked(findNuxtConfig).mockReturnValue(null)
			vi.mocked(readPackageJson).mockResolvedValue(null)

			const result = await detectFeatures('/test')

			expect(result.isNuxtProject).toBe(false)
			expect(result.hasFrontend).toBe(false)
			expect(result.hasGraphql).toBe(false)
		})

		it('should return all false when package.json has no nuxt', async () => {
			vi.mocked(findNuxtConfig).mockReturnValue('/test/nuxt.config.ts')
			vi.mocked(readPackageJson).mockResolvedValue({
				name: 'test',
				dependencies: {},
			})

			const result = await detectFeatures('/test')

			expect(result.isNuxtProject).toBe(false)
		})

		it('should detect Nuxt project with dependencies', async () => {
			vi.mocked(findNuxtConfig).mockReturnValue('/test/nuxt.config.ts')
			vi.mocked(readPackageJson).mockResolvedValue({
				name: 'test',
				dependencies: {
					nuxt: '^3.0.0',
				},
			})
			vi.mocked(hasPackage).mockResolvedValue(false)
			vi.mocked(hasModule).mockResolvedValue(false)
			vi.mocked(existsSync).mockReturnValue(false)

			const result = await detectFeatures('/test')

			expect(result.isNuxtProject).toBe(true)
		})

		it('should detect Nuxt project with devDependencies', async () => {
			vi.mocked(findNuxtConfig).mockReturnValue('/test/nuxt.config.ts')
			vi.mocked(readPackageJson).mockResolvedValue({
				name: 'test',
				devDependencies: {
					nuxt: '^3.0.0',
				},
			})
			vi.mocked(hasPackage).mockResolvedValue(false)
			vi.mocked(hasModule).mockResolvedValue(false)
			vi.mocked(existsSync).mockReturnValue(false)

			const result = await detectFeatures('/test')

			expect(result.isNuxtProject).toBe(true)
		})

		it('should detect installed Stonecrop packages', async () => {
			vi.mocked(findNuxtConfig).mockReturnValue('/test/nuxt.config.ts')
			vi.mocked(readPackageJson).mockResolvedValue({
				name: 'test',
				dependencies: {
					nuxt: '^3.0.0',
				},
			})
			vi.mocked(hasPackage).mockImplementation(async (_, pkg) => {
				return pkg === '@stonecrop/nuxt' || pkg === '@stonecrop/nuxt-grafserv'
			})
			vi.mocked(hasModule).mockResolvedValue(false)
			vi.mocked(existsSync).mockReturnValue(false)

			const result = await detectFeatures('/test')

			expect(result.hasFrontend).toBe(true)
			expect(result.hasGraphql).toBe(true)
			expect(result.hasGraphqlClient).toBe(false)
		})

		it('should detect modules in config when not in package.json', async () => {
			vi.mocked(findNuxtConfig).mockReturnValue('/test/nuxt.config.ts')
			vi.mocked(readPackageJson).mockResolvedValue({
				name: 'test',
				dependencies: {
					nuxt: '^3.0.0',
				},
			})
			vi.mocked(hasPackage).mockResolvedValue(false)
			vi.mocked(hasModule).mockImplementation(async (_, mod) => {
				return mod === '@stonecrop/nuxt'
			})
			vi.mocked(existsSync).mockReturnValue(false)

			const result = await detectFeatures('/test')

			expect(result.hasFrontend).toBe(true)
			expect(result.hasGraphql).toBe(false)
		})

		it('should detect directories and files', async () => {
			vi.mocked(findNuxtConfig).mockReturnValue('/test/nuxt.config.ts')
			vi.mocked(readPackageJson).mockResolvedValue({
				name: 'test',
				dependencies: {
					nuxt: '^3.0.0',
				},
			})
			vi.mocked(hasPackage).mockResolvedValue(false)
			vi.mocked(hasModule).mockResolvedValue(false)
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return (
					path === join('/test', 'doctypes') ||
					path === join('/test', 'server') ||
					path === join('/test', 'server', 'schema.graphql') ||
					path === join('/test', 'server', 'resolvers.ts')
				)
			})

			const result = await detectFeatures('/test')

			expect(result.hasDoctypes).toBe(true)
			expect(result.hasServerDir).toBe(true)
			expect(result.hasSchema).toBe(true)
			expect(result.hasResolvers).toBe(true)
		})

		it('should detect resolvers.js file', async () => {
			vi.mocked(findNuxtConfig).mockReturnValue('/test/nuxt.config.ts')
			vi.mocked(readPackageJson).mockResolvedValue({
				name: 'test',
				dependencies: {
					nuxt: '^3.0.0',
				},
			})
			vi.mocked(hasPackage).mockResolvedValue(false)
			vi.mocked(hasModule).mockResolvedValue(false)
			vi.mocked(existsSync).mockImplementation((path: PathLike) => {
				return path === join('/test', 'server', 'resolvers.js')
			})

			const result = await detectFeatures('/test')

			expect(result.hasResolvers).toBe(true)
		})

		it('should detect all Stonecrop packages', async () => {
			vi.mocked(findNuxtConfig).mockReturnValue('/test/nuxt.config.ts')
			vi.mocked(readPackageJson).mockResolvedValue({
				name: 'test',
				dependencies: {
					nuxt: '^3.0.0',
				},
			})
			vi.mocked(hasPackage).mockResolvedValue(true)
			vi.mocked(hasModule).mockResolvedValue(false)
			vi.mocked(existsSync).mockReturnValue(true)

			const result = await detectFeatures('/test')

			expect(result.hasFrontend).toBe(true)
			expect(result.hasGraphql).toBe(true)
			expect(result.hasGraphqlClient).toBe(true)
			expect(result.hasCasl).toBe(true)
			expect(result.hasRockfoil).toBe(true)
		})
	})

	describe('isNuxtProject', () => {
		it('should return false for non-Nuxt project', async () => {
			vi.mocked(findNuxtConfig).mockReturnValue(null)
			vi.mocked(readPackageJson).mockResolvedValue(null)

			const result = await isNuxtProject('/test')

			expect(result).toBe(false)
		})

		it('should return true for Nuxt project', async () => {
			vi.mocked(findNuxtConfig).mockReturnValue('/test/nuxt.config.ts')
			vi.mocked(readPackageJson).mockResolvedValue({
				name: 'test',
				dependencies: {
					nuxt: '^3.0.0',
				},
			})
			vi.mocked(hasPackage).mockResolvedValue(false)
			vi.mocked(hasModule).mockResolvedValue(false)
			vi.mocked(existsSync).mockReturnValue(false)

			const result = await isNuxtProject('/test')

			expect(result).toBe(true)
		})
	})

	describe('getInstalledSummary', () => {
		it('should return empty array when nothing installed', () => {
			const features = {
				isNuxtProject: true,
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

			const result = getInstalledSummary(features)

			expect(result).toEqual([])
		})

		it('should list installed features', () => {
			const features = {
				isNuxtProject: true,
				hasFrontend: true,
				hasGraphql: true,
				hasGraphqlClient: true,
				hasCasl: true,
				hasRockfoil: false,
				hasDoctypes: true,
				hasServerDir: true,
				hasSchema: true,
				hasResolvers: true,
			}

			const result = getInstalledSummary(features)

			expect(result).toContain('@stonecrop/nuxt (frontend module)')
			expect(result).toContain('@stonecrop/graphql-client (GraphQL client)')
			expect(result).toContain('@stonecrop/nuxt-grafserv (GraphQL server)')
			expect(result).toContain('@stonecrop/casl-middleware (authorization)')
			expect(result).toContain('doctypes/ directory')
			expect(result).not.toContain('@stonecrop/rockfoil')
		})

		it('should include all features when installed', () => {
			const features = {
				isNuxtProject: true,
				hasFrontend: true,
				hasGraphql: true,
				hasGraphqlClient: true,
				hasCasl: true,
				hasRockfoil: true,
				hasDoctypes: true,
				hasServerDir: true,
				hasSchema: true,
				hasResolvers: true,
			}

			const result = getInstalledSummary(features)

			expect(result).toHaveLength(6)
			expect(result).toContain('@stonecrop/rockfoil (PostGraphile middleware)')
		})
	})
})
