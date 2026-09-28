import { describe, expect, it } from 'vitest'

// Skipped unless `tools/scripts/tests/suite-exit-code.spec.js` asks for it: that check runs this file
// to prove a failing test fails this suite, which a check inside the suite cannot prove, since the
// global teardown runs after every test has reported.
describe('planted failure', { tags: ['integration'] }, () => {
	it.runIf(process.env.STONECROP_PLANTED_FAILURE === '1')('fails when asked to', () => {
		expect.fail('planted failure')
	})
})
