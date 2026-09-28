import { readFileSync } from 'node:fs'
import type { AddressInfo } from 'node:net'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { createServer, LogLevel } from 'pglite-server'
import type { Server } from 'node:net'

const __dirname = dirname(fileURLToPath(import.meta.url))

export type TestDatabase = {
	url: string
	stop: () => Promise<void>
}

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

/**
 * One seeded PGlite behind a local `pglite-server`. Each integration file owns an instance for its
 * lifetime: `makeSchema()` introspection corrupts a server if another file reuses it, and holding
 * five servers for the whole run can OOM when `vp run -r test` runs beside other Vitest jobs.
 */
export async function startTestDatabase(): Promise<TestDatabase> {
	const { url, server, db } = await createTestDb()
	return {
		url,
		stop: async () => {
			server.unref()
			server.close()
			await db.close()
		},
	}
}
