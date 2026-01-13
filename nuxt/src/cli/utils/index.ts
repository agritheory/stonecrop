/**
 * CLI utilities barrel export
 */

export { hasModule, findNuxtConfig, updateNuxtConfig, type NuxtConfigUpdate } from './config'

export {
	readPackageJson,
	writePackageJson,
	hasPackage,
	addDependencies,
	detectPackageManager,
	getInstallCommand,
	type PackageJson,
} from './package'
