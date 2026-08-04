/**
 * Mock for `nitropack/runtime`, aliased in vitest.config.ts.
 *
 * `src/runtime/handler.ts` and `ruru-static.ts` import `useRuntimeConfig` from here, and
 * `startup-check.ts` imports `defineNitroPlugin`. Nitropack's real runtime entry resolves
 * `#nitro-internal-virtual/storage`, a subpath that only exists inside a built Nitro app —
 * importing it from a plain vitest run throws
 * `Package import specifier "#nitro-internal-virtual/storage" is not defined`.
 *
 * The Nuxt test environment used to paper over this, but it can no longer be loaded here (see
 * the note in vitest.config.ts), and no active test needs the real implementations: the runtime
 * config these modules read is asserted through the values the tests inject, not through Nitro.
 *
 * Kept deliberately thin. If a test ever needs real Nitro behaviour it belongs in a Nuxt-
 * environment project, not here.
 */
import { vi } from 'vitest'

/** Overridable per test via `vi.mocked(useRuntimeConfig).mockReturnValue(...)`. */
export const useRuntimeConfig = vi.fn<() => Record<string, unknown>>(() => ({}))

/** Nitro's plugin wrapper is identity at runtime — it exists for typing and registration. */
export const defineNitroPlugin = <T>(plugin: T): T => plugin
