import type { WorkflowMeta } from '@stonecrop/schema'
import { useRouter } from 'vue-router'

import { executeClientHandler } from './client-handler'
import { useStonecrop } from './composables/stonecrop'
import Doctype from './doctype'
import { isDraftRecordId } from './draft'
import type {
	ActionDispatchResult,
	ActionEventPayload,
	ActionFailure,
	FollowRecordContext,
	UseClientActionOptions,
} from './types/client-action'

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
 * Default failure surface: a blocking alert beats a silent `console.error` for a failed action
 * (e.g. a Save that the server refused), and there is no notification system in the framework to
 * route it into. A host with one passes `onError` and this is never called.
 */
function notifyActionError(failure: ActionFailure): void {
	console.error('Action failed:', failure.message)
	if (typeof window !== 'undefined') window.alert(failure.message)
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
 * `runAction` is the only blessed write: it dispatches **and** leaves the store consistent,
 * filing the returned record under the identity the *server* settled on and following the route
 * there when that differs from the one dispatched. For a created record those are never the same,
 * which is what makes hand-rolling this reliably wrong.
 *
 * The store write itself lives one layer down, in {@link Stonecrop.dispatchAction}, so a host that
 * never adopts this composable still cannot file a record under the wrong key. What stays here is
 * only what needs the *dispatched* id: dropping the stale key, and moving the route.
 *
 * Pass `buildArgs` to change the argument envelope your backend receives, `followRecord` to change
 * where a created record sends the user, and `onError` to route failures into your own
 * notification system. Identity resolution and HST keying are deliberately not configurable — see
 * {@link UseClientActionOptions}.
 *
 * @public
 */
export function useClientAction(options: UseClientActionOptions = {}) {
	const { stonecrop } = useStonecrop()
	// Called during setup so the injection is available; the registry fallback below covers a
	// caller outside an injection context, and a host that installed the plugin with `{ router }`.
	const injectedRouter = useRouter()
	const onError = options.onError ?? notifyActionError

	const resolveRouter = () => injectedRouter ?? stonecrop.value?.registry.router

	const buildArgs =
		options.buildArgs ??
		// Spreading `undefined` in an object literal adds nothing, so `extra` needs no fallback.
		(({ recordId, isDraft, data, extra }) => [{ ...(isDraft ? {} : { id: recordId }), data, ...extra }])

	const followRecord =
		options.followRecord ??
		(async ({ doctype, recordId }: FollowRecordContext) => {
			await resolveRouter()?.replace(`/${doctype}/${recordId}`)
		})

	/**
	 * Dispatch `action` for the record and reconcile the store and the route with whichever
	 * identity the result carries.
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

		// A draft omits the id, which the write path reads as "create". Sending the route segment
		// instead reaches the same branch by accident — via a lookup for a record named `new`.
		const isDraft = isDraftRecordId(recordId)
		const result = await sc.dispatchAction(
			doctype,
			action,
			buildArgs({ doctype: doctypeSlug, action, recordId, isDraft, data, extra })
		)

		if (result.success && result.data) {
			// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the action result payload is an opaque JSON scalar; every adapter returns the record as an object
			const record = result.data as Record<string, unknown>
			const settledId = settledRecordId(doctype, record)

			if (settledId === undefined) {
				// The result states no identity of its own — a `{ state }` outcome. `dispatchAction`
				// could not file it, because only this layer knows which record was dispatched. A
				// draft has nowhere to put it: filing it under the route segment would leave a
				// record named `new` in the list view.
				if (!isDraft) sc.addRecord(doctypeSlug, recordId, record)
				return result
			}

			// `dispatchAction` has already filed the record under `settledId`. Only the two steps
			// that need the dispatched id are left.
			if (recordId !== settledId) {
				// No-op for a draft, which was never in the store — `removeRecord` checks first.
				sc.removeRecord(doctypeSlug, recordId)
				await followRecord({ doctype: doctypeSlug, recordId: settledId, previousRecordId: recordId })
			}
		}
		return result
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
				if (!result.success) {
					onError({
						message: result.error ?? `Action "${name}" failed`,
						action: name,
						doctype: doctypeSlug,
						recordId,
					})
				}
				return
			}

			// Client handler present — it owns orchestration. Assemble the capability map.
			// Prefer the live HST record; fall back to the form snapshot in the payload.
			// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- HSTNode.get returns any; a record node is always an object of field values
			const record = (sc.getRecordById(doctypeSlug, recordId)?.get('') as Record<string, unknown> | undefined) ?? data

			const runAction = (action: string, extra?: Record<string, unknown>) =>
				dispatchAndWriteback(doctypeSlug, recordId, data, action, extra)

			// Read-only GraphQL escape hatch — no mutation is injected (a raw mutation would
			// bypass the dispatch and leave HST stale). `query` is the GraphQL transport's
			// method, not part of the abstract DataClient interface (a non-GraphQL client may
			// not support it), so probe for it structurally and reject if unsupported.
			const graphql = {
				query<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T> {
					// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- probing DataClient for the GraphQL transport's `query`, which the abstract interface deliberately does not declare
					const client = sc.getClient() as unknown as
						| { query?: <R>(q: string, v?: Record<string, unknown>) => Promise<R> }
						| undefined
					if (!client?.query) {
						return Promise.reject(new Error('The configured data client does not support graphql.query'))
					}
					return client.query<T>(query, variables)
				},
			}

			await executeClientHandler(clientHandler, { router: resolveRouter(), record, runAction, graphql })
		} catch (error) {
			onError({
				message: error instanceof Error ? error.message : String(error),
				action: name,
				doctype: doctypeSlug,
				recordId,
				cause: error,
			})
		}
	}

	return { run }
}
