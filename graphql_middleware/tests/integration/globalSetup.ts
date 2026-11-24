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
 * The server turns away any connection past `maxConnections`, and the tests that connect next fail
 * with "Connection terminated unexpectedly" or "read ECONNRESET" without naming the limit. A closed
 * connection also keeps its slot for a moment. So every database gets the same roomy limit rather
 * than a count of what each test file opens.
 */
const MAX_CONNECTIONS = 10

async function createTestDb(): Promise<{ url: string; server: PGLiteSocketServer; db: PGlite }> {
	const db = new PGlite()
	await db.waitReady

	const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8')
	await db.exec(seed)
	// PGlite takes its zone from the machine, so unpinned the fixture runs in UTC in CI and in the
	// developer's zone locally. A test that needs another zone sets it for its own transaction.
	await db.exec(`SET TIME ZONE 'UTC'`)

	const server = new PGLiteSocketServer({ db, host: '127.0.0.1', port: 0, maxConnections: MAX_CONNECTIONS })
	await server.start()

	return { url: `postgresql://${server.getServerConn()}/postgres`, server, db }
}

export async function setup(project: TestProject) {
	// Each integration test file calls makeSchema(), which runs PostGraphile's catalog
	// introspection, so each file gets its own isolated instance.
	// Spin up one instance at a time: several PGlite instances in parallel can OOM when `vp run -r test`
	// executes this package alongside other Vitest jobs on a memory-tight machine.
	const resolver = await createTestDb()
	const camel = await createTestDb()
	const inflection = await createTestDb()
	const conformance = await createTestDb()
	const naturalId = await createTestDb()
	const generatedMutations = await createTestDb()

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
