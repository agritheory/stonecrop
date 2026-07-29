import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

import { STONECROP_PACKAGES } from '../src/module'

// Guards the completeness of STONECROP_PACKAGES (src/module.ts), the list Nitro inlines instead
// of externalizing.
//
// Why this shape and not an SSR test: externalization behaves differently in this Rush workspace
// than in a real consumer install. Here `nuxt/node_modules/@stonecrop/*` are direct `../../<dir>`
// symlinks whose realpaths contain no `node_modules/` segment, so an SSR fixture renders happily
// even with packages missing from the list — measured, not assumed. A booted-Nuxt test therefore
// cannot catch this class of bug; only a packed/published install can, and that can't run here.
//
// What *is* checkable in-repo is the invariant that actually broke: a client-side @stonecrop
// package became a dependency of this module and nobody added it to the list. That is exactly how
// `desktop` and `code-editor` went missing, and it is what let `desktop -> aform -> atable` reach
// `atable/dist/assets/index.css` through Node's ESM loader in a consumer app (HTTP 500,
// ERR_UNKNOWN_FILE_EXTENSION).
//
// Externalization is transitive, so a package needs inlining even when it imports no CSS itself —
// it only has to be able to *reach* one. Hence the default is "must be inlined", and anything left
// external has to be named below with a reason.
const INTENTIONALLY_EXTERNAL = new Set([
	// Server-only: these pull in postgraphile / @dataplan/pg and must not enter the Nitro bundle.
	'@stonecrop/casl-middleware',
	'@stonecrop/graphql-middleware',
	'@stonecrop/nuxt-grafserv',
	// Pure JS with no CSS anywhere in their subtree — safe for Node's ESM loader to resolve.
	'@stonecrop/graphql-client',
	'@stonecrop/schema',
])

describe('STONECROP_PACKAGES', { tags: ['unit'] }, () => {
	const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8')) as {
		dependencies?: Record<string, string>
	}
	const stonecropDeps = Object.keys(pkg.dependencies ?? {})
		.filter(name => name.startsWith('@stonecrop/'))
		.toSorted()

	it('finds @stonecrop dependencies to check', () => {
		// Fails loudly if the parse silently yields nothing — otherwise the assertion below
		// would pass vacuously and this whole file would be decorative.
		expect(stonecropDeps.length).toBeGreaterThan(0)
	})

	it('inlines every @stonecrop dependency that is not deliberately external', () => {
		const mustInline = stonecropDeps.filter(name => !INTENTIONALLY_EXTERNAL.has(name))
		const missing = mustInline.filter(name => !STONECROP_PACKAGES.includes(name))

		expect(
			missing,
			`These @stonecrop dependencies are neither inlined nor listed as intentionally external. ` +
				`Add them to STONECROP_PACKAGES in src/module.ts, or to INTENTIONALLY_EXTERNAL here ` +
				`with the reason they are safe to externalize.`
		).toEqual([])
	})

	it('does not inline a package it also calls intentionally external', () => {
		const contradictory = STONECROP_PACKAGES.filter(name => INTENTIONALLY_EXTERNAL.has(name))
		expect(contradictory).toEqual([])
	})
})
