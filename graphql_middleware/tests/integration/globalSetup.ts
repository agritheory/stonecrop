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
	}
}

const __dirname = dirname(fileURLToPath(import.meta.url))

async function createTestDb(): Promise<{ url: string; server: Server; db: PGlite }> {
	const db = new PGlite()
	await db.waitReady

	const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8')
	await db.exec(seed)

	const server = createServer(db, { logLevel: LogLevel.Error })
	await new Promise<void>(resolve => server.listen(0, () => resolve()))
	const port = (server.address() as AddressInfo).port

	return { url: `postgresql://localhost:${port}/postgres`, server, db }
}

export async function setup(project: TestProject) {
	// Each integration test file calls makeSchema(), which triggers heavy PostGraphile
	// catalog introspection. A single pglite-server can't survive multiple sequential
	// introspection rounds without corruption. Give each file its own isolated instance.
	const [resolver, camel, inflection] = await Promise.all([createTestDb(), createTestDb(), createTestDb()])

	project.provide('testDatabaseUrl', resolver.url)
	project.provide('camelTestDatabaseUrl', camel.url)
	project.provide('inflectionTestDatabaseUrl', inflection.url)

	return async () => {
		for (const { server, db } of [resolver, camel, inflection]) {
			server.unref()
			server.close()
			await db.close()
		}
	}
}
