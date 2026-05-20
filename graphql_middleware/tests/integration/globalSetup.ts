import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AddressInfo } from 'node:net'
import { PGlite } from '@electric-sql/pglite'
import { createServer, LogLevel } from 'pglite-server'

declare module 'vitest' {
	interface ProvidedContext {
		testDatabaseUrl: string
	}
}

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function setup({ provide }: { provide: <K extends string>(key: K, value: unknown) => void }) {
	const db = new PGlite()
	await db.waitReady

	const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8')
	await db.exec(seed)

	const server = createServer(db, { logLevel: LogLevel.Error })
	await new Promise<void>(resolve => server.listen(0, () => resolve()))
	const port = (server.address() as AddressInfo).port

	provide<string>('testDatabaseUrl', `postgresql://localhost:${port}/postgres`)

	return async () => {
		server.unref()
		server.close()
		await db.close()
	}
}
