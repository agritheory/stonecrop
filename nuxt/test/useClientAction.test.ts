// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { useClientAction as fromCore } from '@stonecrop/stonecrop'

import { useClientAction } from '../src/runtime/app/composables/useClientAction'

// The composable's own behaviour is tested in stonecrop/tests/core/client-action.spec.ts, where it
// now lives. What is left to guard here is the seam that makes it reach a Nuxt host at all: this
// file must exist under `runtime/app/composables/`, because `addImportsDir` scans that directory
// and every scaffolded app's `@action="run"` binding is an auto-import of this name. Deleting the
// re-export would break those hosts with a bare "useClientAction is not defined" at runtime, which
// no typecheck sees — the templates are not in any tsconfig's program.
describe('useClientAction auto-import seam', { tags: ['unit'] }, () => {
	it('re-exports the core composable unchanged', () => {
		expect(useClientAction).toBe(fromCore)
	})
})
