import { Pool, type PoolClient } from 'pg'

const TEST_DATABASE_URL_ENV = process.env.TEST_DATABASE_URL

export const TEST_DATABASE_URL: string | undefined = TEST_DATABASE_URL_ENV

const pools: Record<string, Pool> = {}

afterAll(async () => {
	const keys = Object.keys(pools)
	await Promise.all(
		keys.map(async key => {
			try {
				const pool = pools[key]
				delete pools[key]
				await pool.end()
			} catch (e) {
				console.error('Failed to release pool!')
				console.error(e)
			}
		})
	)
})

async function withDbFromUrl<T>(url: string, fn: (client: PoolClient) => Promise<T>): Promise<T> {
	if (!url) {
		throw new Error('Cannot run integration tests without TEST_DATABASE_URL')
	}
	let pool = pools[url]
	if (!pool) {
		pool = new Pool({ connectionString: url })
		pools[url] = pool
	}
	const client = await pool.connect()
	await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE')
	try {
		return await fn(client)
	} catch (e) {
		if (typeof e === 'object' && e !== null && 'code' in e && typeof (e as any).code === 'string') {
			const err = e as any
			console.error([err.message, err.code, err.detail, err.hint, err.where].join('\n'))
		}
		throw e
	} finally {
		await client.query('ROLLBACK')
		await client.query('RESET ALL')
		await client.release()
	}
}

export const withRootDb = <T>(fn: (client: PoolClient) => Promise<T>): Promise<T> => {
	if (!TEST_DATABASE_URL) {
		throw new Error('Cannot run integration tests without TEST_DATABASE_URL')
	}
	return withDbFromUrl(TEST_DATABASE_URL, fn)
}

export const becomeRoot = async (client: PoolClient): Promise<void> => {
	await client.query('reset role')
}
