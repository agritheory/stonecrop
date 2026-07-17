/**
 * clientHandler execution
 * Pure executor for docbuilder-authored client handlers.
 * @packageDocumentation
 */

/**
 * Named capabilities injected into a clientHandler body as function parameters.
 * The caller (the assembly composable) owns what each name resolves to — typically
 * `router`, `record`, `runAction`, and a read-only `graphql`.
 *
 * @public
 */
export type ClientHandlerApi = Record<string, unknown>

// AsyncFunction is not a global; reach it via an async function's constructor so authored
// bodies can use top-level `await` without writing an async wrapper.
// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- an async function's constructor is always the AsyncFunction constructor
const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor as new (
	...args: string[]
) => (...args: unknown[]) => Promise<unknown>

/**
 * Execute a docbuilder-authored `clientHandler` body against an injected API map.
 *
 * `code` is a function *body* (statements), not a full function — authored in the
 * docbuilder code editor and stored on `ActionDefinition.clientHandler`. It is compiled
 * with the AsyncFunction constructor, so `await` works directly. Each key of `api`
 * becomes a parameter name bound to its value, so a handler can reference `router`,
 * `record`, `runAction`, etc. by name.
 *
 * This executor is deliberately concern-free: it performs no routing, dispatch, or HST
 * writes itself — the caller assembles `api`. The injected set is an *intent* contract,
 * not a sandbox (an AsyncFunction body can still reach `fetch`/`window`); enforcement of
 * what a handler may actually do lives server-side, not here.
 *
 * Errors are propagated to the caller as a rejected promise — syntax errors at compile
 * time and thrown errors / rejections at run time — so callers handle both uniformly.
 *
 * @param code - the clientHandler body, e.g. `"router.push('/users')"`
 * @param api - named capabilities injected as parameters (default: none)
 * @returns whatever the body returns (typically `void`)
 *
 * @example
 * ```ts
 * await executeClientHandler("await runAction('Assign', [record.id])", { runAction, record })
 * ```
 *
 * @public
 */
export async function executeClientHandler(code: string, api: ClientHandlerApi = {}): Promise<unknown> {
	const names = Object.keys(api)
	const fn = new AsyncFunction(...names, code)
	return fn(...names.map(name => api[name]))
}
