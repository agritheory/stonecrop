/**
 * Stub for 'grafast', aliased in vitest.config.ts. grafast is not a dependency
 * of @stonecrop/nuxt — it belongs to consumer server contexts — but the
 * templates/ and fullstack/ resolver modules import it at top level, so unit
 * tests that exercise their pure formatting helpers need the specifier to
 * resolve. Every stub throws: plan resolvers must never execute in unit tests.
 */
const notExecutable = (name: string) => () => {
	throw new Error(`grafast stub: ${name}() must not execute in unit tests`)
}

export const lambda = notExecutable('lambda')
export const loadOne = notExecutable('loadOne')
export const constant = notExecutable('constant')
export const object = notExecutable('object')
