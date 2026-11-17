// Which Vite a package resolving `vite` actually gets, and whether the spec it declares accepts it.
//
// Split from check-vite-ranges.mjs so the comparison can be tested without installing a workspace.

import semver from 'semver'

/**
 * The Vite inside the package `vite` resolves to. Plain Vite is its own version; Vite+'s core
 * carries Vite+'s version number and declares the Vite it bundles. Anything else throws, because
 * no range can be checked against it.
 */
export function bundledVite(manifest) {
	if (manifest.name === 'vite') return manifest.version
	const bundled = manifest.bundledVersions?.vite
	if (bundled === undefined) {
		throw new Error(`vite resolves to ${manifest.name}@${manifest.version}, which declares no bundled Vite version`)
	}
	return bundled
}

/**
 * Why `spec`, the `vite` one package declares, does not accept what it is given, or undefined when
 * it does. `given` is the package `vite` resolves to, as `{ name, version, vite }`.
 */
export function rangeProblem(spec, given) {
	// An npm alias names a package and a range of its own versions, not Vite's. vite-plus declares its
	// core this way, and the override never reaches an alias, so vite-plus always gets the core it
	// names: a vite-plus out of step with the catalog shows up as a second core, in `oneVite`.
	const alias = /^npm:((?:@[^/]+\/)?[^@]+)@(.+)$/.exec(spec)
	if (alias !== null) {
		const [, name, range] = alias
		if (name === given.name && semver.satisfies(given.version, range)) return undefined
		return `wants ${name}@${range}, and gets ${given.name}@${given.version}`
	}
	if (semver.validRange(spec) === null) return `declares ${spec}, which is neither a version range nor an npm alias`
	if (semver.satisfies(given.vite, spec)) return undefined
	return `wants Vite ${spec}, and gets Vite ${given.vite} inside ${given.name}@${given.version}`
}

/**
 * Why `givens`, every package `vite` resolves to, are more than the one the override installs, or
 * undefined when they are not. Each spec can still be satisfied with two installed: a vite-plus
 * bumped without the catalog's `vite` alias brings its own core and gets exactly what it names.
 */
export function oneVite(givens) {
	const distinct = [...new Set(givens.map(given => `${given.name}@${given.version}`))]
	if (distinct.length <= 1) return undefined
	return `vite resolves to ${distinct.length} packages, ${distinct.join(' and ')}, so two toolchains are installed`
}
