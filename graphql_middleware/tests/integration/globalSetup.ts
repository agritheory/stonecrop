import { readFileSync } from 'node:fs'
import type { AddressInfo } from 'node:net'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { createServer, LogLevel } from 'pglite-server'
import type { TestProject } from 'vitest/node'

declare module 'vitest' {
	interface ProvidedContext {
		testDatabaseUrl: string
	}
}

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function setup(project: TestProject) {
	const db = new PGlite()
	await db.waitReady

	const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8')
	await db.exec(seed)

	const server = createServer(db, { logLevel: LogLevel.Error })
	await new Promise<void>(resolve => server.listen(0, () => resolve()))
	const port = (server.address() as AddressInfo).port

	project.provide('testDatabaseUrl', `postgresql://localhost:${port}/postgres`)

	return async () => {
		server.unref()
		server.close()
		await db.close()
	}
}
