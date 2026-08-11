/**
 * The shared action executor, re-exported so Nuxt hosts keep getting it as an auto-import.
 *
 * It used to be defined here, which made the one blessed write path a Nuxt-only privilege while
 * every other Vue host hand-rolled sixty lines of identity reconciliation — and both hosts that
 * did got the create case wrong in the same way. Nothing in it was ever Nuxt-specific, so it now
 * lives in `@stonecrop/stonecrop` alongside the store it writes to.
 *
 * This file stays because `addImportsDir` scans this directory: deleting it would silently remove
 * the auto-import that every scaffolded app's `@action="run"` binding depends on.
 */
export { useClientAction } from '@stonecrop/stonecrop'
export type {
	ActionArgsContext,
	ActionDispatchResult,
	ActionFailure,
	FollowRecordContext,
	UseClientActionOptions,
} from '@stonecrop/stonecrop'
