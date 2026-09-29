import { readFileSync } from 'node:fs'
import type { AddressInfo } from 'node:net'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { createServer, LogLevel } from 'pglite-server'
import type { Server } from 'node:net'
import type { TestProject } from 'vitest/node'

declare module 'vitest' {
	interface ProvidedContext {
		testDatabaseUrl: string
		camelTestDatabaseUrl: string
		inflectionTestDatabaseUrl: string
		conformanceTestDatabaseUrl: string
		naturalIdTestDatabaseUrl: string
	}
}

const __dirname = dirname(fileURLToPath(import.meta.url))

async function createTestDb(): Promise<{ url: string; server: Server; db: PGlite }> {
	const db = new PGlite()
	await db.waitReady

	const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8')
	await db.exec(seed)
	// PGlite takes its zone from the machine, so unpinned the fixture runs in UTC in CI and in the
	// developer's zone locally. A test that needs another zone sets it for its own transaction.
	await db.exec(`SET TIME ZONE 'UTC'`)

	const server = createServer(db, { logLevel: LogLevel.Error })
	await new Promise<void>(resolve => server.listen(0, () => resolve()))
	const port = (server.address() as AddressInfo).port

	return { url: `postgresql://localhost:${port}/postgres`, server, db }
}

export async function setup(project: TestProject) {
	// Each integration test file calls makeSchema(), which triggers heavy PostGraphile
	// catalog introspection. A single pglite-server can't survive multiple sequential
	// introspection rounds without corruption. Give each file its own isolated instance.
	// Spin up one instance at a time: five PGlite servers in parallel can OOM when `vp run -r test`
	// executes this package alongside other Vitest jobs on a memory-tight machine.
	const resolver = await createTestDb()
	const camel = await createTestDb()
	const inflection = await createTestDb()
	const conformance = await createTestDb()
	const naturalId = await createTestDb()

	project.provide('testDatabaseUrl', resolver.url)
	project.provide('camelTestDatabaseUrl', camel.url)
	project.provide('inflectionTestDatabaseUrl', inflection.url)
	project.provide('conformanceTestDatabaseUrl', conformance.url)
	project.provide('naturalIdTestDatabaseUrl', naturalId.url)

	return async () => {
		for (const { server, db } of [resolver, camel, inflection, conformance, naturalId]) {
			server.unref()
			server.close()
			// oxlint-disable-next-line eslint/no-await-in-loop -- sequential teardown intentional; parallel close risks race conditions on shared DB state
			await db.close()
		}
	}
}
