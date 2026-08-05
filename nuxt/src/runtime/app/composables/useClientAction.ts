import { executeClientHandler, useStonecrop } from '@stonecrop/stonecrop'
import type { Doctype } from '@stonecrop/stonecrop'
import type { ActionEventPayload } from '@stonecrop/desktop'
import type { WorkflowMeta } from '@stonecrop/schema'
import { useRouter } from 'vue-router'

/**
 * Result of dispatching an action to its server handler.
 */
export type ActionDispatchResult = { success: boolean; data: unknown; error: string | null }

/**
 * The identity a server response settled on, or `undefined` when it did not state one.
 *
 * Deliberately stricter than `getRecordId`: that falls back to `id` when the declared key is
 * absent, which here would let a handler returning a partial record (say `{ id, total }` for a
 * natural-keyed doctype) look like a rename and relocate the record to a key the adapter cannot
 * look up. An action whose result carries no identity at all — a `{ state }` outcome — leaves the
 * record exactly where it is.
 */
function settledRecordId(doctype: Doctype, record: Record<string, unknown>): string | undefined {
	if (record[doctype.recordIdField] === undefined) return undefined
	return doctype.getRecordId(record)
}

/**
 * Surface an action failure to the user. There is no notification system yet, so this is a
 * deliberate stopgap: a blocking alert beats a silent `console.error` for a failed action
 * (e.g. a Save that the server refused). Swap this for a real toast when one exists.
 */
function notifyActionError(message: string): void {
	// oxlint-disable-next-line no-console
	console.error('Action failed:', message)
	if (typeof window !== 'undefined') window.alert(message)
}

/**
 * Shared executor for doctype action clicks. A host's Desktop `@action` handler delegates
 * here so every host runs the same logic from one definition:
 *
 * - If the clicked action carries a `clientHandler`, run it. The handler **owns
 *   orchestration** — it calls `runAction` itself when it needs the server, navigates via
 *   `router`, reads `record`, or queries `graphql`. It supersedes the default dispatch.
 * - Otherwise dispatch the action to its server `handler` (the pre-existing behavior),
 *   so actions without a `clientHandler` are unchanged.
 *
 * `runAction` is the only blessed write: it dispatches **and** writes the returned record
 * back into HST, keeping the store consistent — the same invariant the host handler
 * previously upheld inline (`addRecord(result.data)` after dispatch). It stores the record
 * under the identity the *server* settled on, and follows the route there when that differs
 * from the one dispatched.
 *
 * The composable owns the `[{ id, data }]` argument envelope every server handler reads
 * (`const [{ id }] = args`), so an authored handler calls `runAction('Assign')` without
 * knowing that shape; an optional second argument is merged in for handlers needing more.
 */
export function useClientAction() {
	const { stonecrop } = useStonecrop()
	const router = useRouter()

	/**
	 * Dispatch `action` for the record and write the updated record back to HST, under whichever
	 * identity the result carries. Owns the `[{ id, data, ...extra }]` envelope the server
	 * handlers destructure.
	 */
	async function dispatchAndWriteback(
		doctypeSlug: string,
		recordId: string,
		data: Record<string, unknown>,
		action: string,
		extra?: Record<string, unknown>
	): Promise<ActionDispatchResult> {
		const sc = stonecrop.value
		if (!sc) return { success: false, data: null, error: 'Stonecrop is not initialized' }

		const doctype = sc.registry.getDoctype(doctypeSlug)
		if (!doctype) return { success: false, data: null, error: `Unknown doctype: ${doctypeSlug}` }

		const result = await sc.dispatchAction(doctype, action, [{ id: recordId, data, ...(extra ?? {}) }])

		if (result.success && result.data) {
			// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the action result payload is an opaque JSON scalar; every adapter returns the record as an object
			const record = result.data as Record<string, unknown>
			// The server decides identity, not the client. Saving a record that does not exist
			// creates it, so the id the form dispatched — Desktop's synthetic `new-<timestamp>` —
			// is not the one it now has; an action that rewrites a natural key moves it the same
			// way. Writing the result back under the dispatched id would strand the record under a
			// key nothing can fetch, and leave the next Save creating a second record.
			const settledId = settledRecordId(doctype, record) ?? recordId
			if (!settledId) return result

			sc.addRecord(doctypeSlug, settledId, record)
			if (recordId && recordId !== settledId) {
				sc.removeRecord(doctypeSlug, recordId)
				await followRecord(doctypeSlug, settledId)
			}
		}
		return result
	}

	/**
	 * Move the route onto the identity the record settled on.
	 *
	 * `replace`, not `push`: the id being left behind was never real — going Back to a spent
	 * `new-<timestamp>` would show an empty form that creates yet another record.
	 *
	 * The path is built here rather than through Desktop's `RouteAdapter` because every adapter in
	 * the project, and Desktop's own fallback, resolves a record view to exactly this shape, and
	 * `NavigationTarget` has no way to ask for a replace. If a host ever needs a different shape,
	 * give `NavigationTarget` a `replace` flag and take the adapter as an option here.
	 */
	async function followRecord(doctypeSlug: string, recordId: string): Promise<void> {
		await router.replace(`/${doctypeSlug}/${recordId}`)
	}

	/**
	 * Handle a Desktop `@action` event: run the action's `clientHandler` if present,
	 * else dispatch to the server handler.
	 */
	async function run(payload: ActionEventPayload): Promise<void> {
		const sc = stonecrop.value
		if (!sc) return

		const { name, doctype: doctypeSlug, recordId, data } = payload

		const doctype = sc.registry.getDoctype(doctypeSlug)
		// `workflow` is a union (XState | WorkflowMeta); only WorkflowMeta carries an
		// `actions` map with `clientHandler`. An XState workflow has no `actions`, so the
		// lookup is undefined and we fall through to the server dispatch.
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- narrowing the workflow union to read the optional actions map
		const workflow = doctype?.workflow as WorkflowMeta | undefined
		const clientHandler = workflow?.actions?.[name]?.clientHandler

		try {
			if (!clientHandler) {
				// No client handler — preserve the existing server-dispatch behavior.
				const result = await dispatchAndWriteback(doctypeSlug, recordId, data, name)
				if (!result.success) notifyActionError(result.error ?? `Action "${name}" failed`)
				return
			}

			// Client handler present — it owns orchestration. Assemble the capability map.
			// Prefer the live HST record; fall back to the form snapshot in the payload.
			const record = (sc.getRecordById(doctypeSlug, recordId)?.get('') as Record<string, unknown> | undefined) ?? data

			const runAction = (action: string, extra?: Record<string, unknown>) =>
				dispatchAndWriteback(doctypeSlug, recordId, data, action, extra)

			// Read-only GraphQL escape hatch — no mutation is injected (a raw mutation would
			// bypass the dispatch and leave HST stale). `query` is the GraphQL transport's
			// method, not part of the abstract DataClient interface (a non-GraphQL client may
			// not support it), so probe for it structurally and reject if unsupported.
			const graphql = {
				query<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T> {
					const client = sc.getClient() as unknown as
						{ query?: <R>(q: string, v?: Record<string, unknown>) => Promise<R> } | undefined
					if (!client?.query) {
						return Promise.reject(new Error('The configured data client does not support graphql.query'))
					}
					return client.query<T>(query, variables)
				},
			}

			await executeClientHandler(clientHandler, { router, record, runAction, graphql })
		} catch (error) {
			notifyActionError(error instanceof Error ? error.message : String(error))
		}
	}

	return { run }
}
