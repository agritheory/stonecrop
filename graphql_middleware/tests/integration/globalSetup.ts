import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import type { TestProject } from 'vite-plus/test/node'

declare module 'vitest' {
	interface ProvidedContext {
		testDatabaseUrl: string
		camelTestDatabaseUrl: string
		inflectionTestDatabaseUrl: string
		conformanceTestDatabaseUrl: string
		naturalIdTestDatabaseUrl: string
		generatedMutationsTestDatabaseUrl: string
	}
}

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Serve a freshly seeded PGlite over a socket. `@electric-sql/pglite-socket` passes PGlite's
 * answers through unchanged; `pglite-server` sent its own "ready for query" after a failed message,
 * so after a failed query with parameters every later answer on that connection arrived one query
 * late (#544).
 *
 * `maxConnections` is how many connections the test files using this database hold at once — the
 * server turns away any connection past it, so a file that opens more must raise it here.
 */
async function createTestDb(maxConnections: number): Promise<{ url: string; server: PGLiteSocketServer; db: PGlite }> {
	const db = new PGlite()
	await db.waitReady

	const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8')
	await db.exec(seed)
	// PGlite takes its zone from the machine, so unpinned the fixture runs in UTC in CI and in the
	// developer's zone locally. A test that needs another zone sets it for its own transaction.
	await db.exec(`SET TIME ZONE 'UTC'`)

	const server = new PGLiteSocketServer({ db, host: '127.0.0.1', port: 0, maxConnections })
	await server.start()

	return { url: `postgresql://${server.getServerConn()}/postgres`, server, db }
}

export async function setup(project: TestProject) {
	// Each integration test file calls makeSchema(), which runs PostGraphile's catalog
	// introspection, so each file gets its own isolated instance.
	// Spin up one instance at a time: several PGlite instances in parallel can OOM when `vp run -r test`
	// executes this package alongside other Vitest jobs on a memory-tight machine.
	// resolver.test.ts: its own `pool`, plus the pg services its schemas build on.
	const resolver = await createTestDb(4)
	// camel, inflection, conformance: their own `pool`, plus one pg service.
	const camel = await createTestDb(2)
	const inflection = await createTestDb(2)
	const conformance = await createTestDb(2)
	// natural-id and owned-relations (run one after the other), generated-mutations: one pg service.
	const naturalId = await createTestDb(1)
	const generatedMutations = await createTestDb(1)

	project.provide('testDatabaseUrl', resolver.url)
	project.provide('camelTestDatabaseUrl', camel.url)
	project.provide('inflectionTestDatabaseUrl', inflection.url)
	project.provide('conformanceTestDatabaseUrl', conformance.url)
	project.provide('naturalIdTestDatabaseUrl', naturalId.url)
	project.provide('generatedMutationsTestDatabaseUrl', generatedMutations.url)

	return async () => {
		for (const { server, db } of [resolver, camel, inflection, conformance, naturalId, generatedMutations]) {
			// oxlint-disable-next-line eslint/no-await-in-loop -- sequential teardown intentional; parallel close risks race conditions on shared DB state
			await server.stop()
			// oxlint-disable-next-line eslint/no-await-in-loop -- as above
			await db.close()
		}
	}
}
