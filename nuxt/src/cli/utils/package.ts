/**
 * Utilities for manipulating package.json
 */

import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'pathe'
import consola from 'consola'

export interface PackageJson {
	name?: string
	version?: string
	dependencies?: Record<string, string>
	devDependencies?: Record<string, string>
	[key: string]: unknown
}

/**
 * Read package.json from the project
 */
export async function readPackageJson(cwd: string): Promise<PackageJson | null> {
	const packagePath = join(cwd, 'package.json')

	if (!existsSync(packagePath)) {
		return null
	}

	const content = await readFile(packagePath, 'utf-8')
	return JSON.parse(content)
}

/**
 * Write package.json to the project
 */
export async function writePackageJson(cwd: string, pkg: PackageJson): Promise<void> {
	const packagePath = join(cwd, 'package.json')
	await writeFile(packagePath, JSON.stringify(pkg, null, '\t') + '\n', 'utf-8')
}

/**
 * Check if a package is installed (in dependencies or devDependencies)
 */
export async function hasPackage(cwd: string, packageName: string): Promise<boolean> {
	const pkg = await readPackageJson(cwd)
	if (!pkg) return false

	return !!(pkg.dependencies?.[packageName] || pkg.devDependencies?.[packageName])
}

/**
 * Add dependencies to package.json
 */
export async function addDependencies(
	cwd: string,
	dependencies: Record<string, string>,
	options: { dev?: boolean } = {}
): Promise<boolean> {
	const pkg = await readPackageJson(cwd)
	if (!pkg) {
		consola.error('Could not find package.json in', cwd)
		return false
	}

	const key = options.dev ? 'devDependencies' : 'dependencies'
	pkg[key] = pkg[key] || {}

	let modified = false
	for (const [name, version] of Object.entries(dependencies)) {
		if (!pkg[key]![name]) {
			pkg[key]![name] = version
			modified = true
			consola.info(`Adding ${name}@${version} to ${key}`)
		}
	}

	if (modified) {
		// Sort dependencies alphabetically
		pkg[key] = sortObject(pkg[key] as Record<string, string>)
		await writePackageJson(cwd, pkg)
	}

	return modified
}

/**
 * Get the package manager used in the project
 */
export function detectPackageManager(cwd: string): 'npm' | 'yarn' | 'pnpm' | 'bun' {
	if (existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock'))) {
		return 'bun'
	}
	if (existsSync(join(cwd, 'pnpm-lock.yaml'))) {
		return 'pnpm'
	}
	if (existsSync(join(cwd, 'yarn.lock'))) {
		return 'yarn'
	}
	return 'npm'
}

/**
 * Get the install command for the detected package manager
 */
export function getInstallCommand(cwd: string): string {
	const pm = detectPackageManager(cwd)
	switch (pm) {
		case 'bun':
			return 'bun install'
		case 'pnpm':
			return 'pnpm install'
		case 'yarn':
			return 'yarn'
		default:
			return 'npm install'
	}
}

/**
 * Sort an object's keys alphabetically
 */
function sortObject(obj: Record<string, string>): Record<string, string> {
	return Object.keys(obj)
		.sort()
		.reduce(
			(acc, key) => {
				acc[key] = obj[key]
				return acc
			},
			{} as Record<string, string>
		)
}
