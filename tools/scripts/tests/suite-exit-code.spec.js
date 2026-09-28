import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const graphqlMiddleware = join(dirname(fileURLToPath(import.meta.url)), '../../../graphql_middleware')

describe('graphql_middleware test run', { tags: ['integration'] }, () => {
	// Coverage stays off: on one file its thresholds fail the run whatever the tests do.
	it('exits non-zero when a test fails', () => {
		const run = spawnSync(
			'pnpm',
			['exec', 'vitest', 'run', '--coverage.enabled', 'false', 'tests/integration/planted-failure.test.ts'],
			{ cwd: graphqlMiddleware, encoding: 'utf8', env: { ...process.env, STONECROP_PLANTED_FAILURE: '1' } }
		)
		expect(`${run.stdout}${run.stderr}`).toMatch(/Tests\s+1 failed/)
		expect(run.status).toBe(1)
	})
})
