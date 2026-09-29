/**
 * Server-side effects for doctype actions — the half of dispatch a doctype cannot express.
 *
 * A doctype's workflow says whether an action may run (`allowedStates`) and what state results
 * (`nextState`, `selfTransition`). It deliberately says nothing about what the action *does*: a
 * doctype is runtime data edited in DocBuilder, by whoever models the workflow, and it must not
 * name code living behind the GraphQL surface that a different author owns. This file is that
 * other author's — the routing from action to effect lives here, on the server, and is never
 * published to the client.
 *
 * Without an entry here a stateless Command (no `nextState`, no `selfTransition`) has nothing to
 * apply and fails loudly. `Order.recalculateTotal` below is exactly that case.
 *
 * The Postgres adapter's equivalent is `createStonecropPlugin({ actionHandlers })`, whose handlers
 * receive a `pgClient`. This host has a mock executor instead, so it defines its own context — the
 * shared contract is `GuardedTransitionIO.runEffect`, not any one adapter's handler signature.
 */

import type { DoctypeMeta } from '@stonecrop/schema'

import { mockExecutor } from './mock-executor'

/** What a handler in this host is given. Mirrors the middleware's `ActionHandlerContext`, minus `pgClient`. */
export interface FullstackActionContext {
	/** The doctype the action was dispatched against. */
	doctype: string
	/** The action's key in `workflow.actions` — the same string it is registered under here. */
	action: string
	/** Resolved doctype metadata. */
	meta: DoctypeMeta
	/** The target record's identity, from the argument envelope. Absent for a record-less command. */
	recordId?: string | number
	/** Record field data the client sent. Unvalidated browser input — `args` is an opaque JSON scalar. */
	data: Record<string, unknown>
	/** The state the guard read, or `undefined` when nothing about the action required reading it. */
	currentState?: string
}

/**
 * Returning the updated record makes it the client writeback payload; returning `undefined` leaves
 * the doctype's own outcome to decide. Throwing rejects the action, and no state is written.
 */
export type FullstackActionHandler = (context: FullstackActionContext) => Promise<unknown>

/** Keyed `[doctype name][action key]`. */
export const actionHandlers: Record<string, Record<string, FullstackActionHandler>> = {
	Order: {
		/**
		 * Sum the order's line items into its `total`.
		 *
		 * A worked example of why the seam exists: the number is derived from rows the client has
		 * not loaded and must not be trusted to compute, and recalculating does not move the order
		 * through its workflow. There is no `nextState` to write and no client patch to persist —
		 * only an effect.
		 */
		async recalculateTotal({ recordId }) {
			if (recordId == null) throw new Error('recalculateTotal needs an order id')

			const read = await mockExecutor.query<{ orderById?: { items?: { total?: number }[] } }>('orderById', {
				id: recordId,
			})
			const order = read.orderById
			if (!order) throw new Error(`Order ${String(recordId)} not found`)

			const total = (order.items ?? []).reduce((sum, item) => sum + (Number(item.total) || 0), 0)

			const written = await mockExecutor.mutate<{ updateOrderById?: { order?: Record<string, unknown> } }>(
				'updateOrderById',
				{ id: String(recordId), patch: { total } }
			)
			// The full row, so the client's writeback shows the recomputed total immediately.
			return written.updateOrderById?.order
		},
	},
}
