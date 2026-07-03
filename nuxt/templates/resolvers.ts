/**
 * Stonecrop GraphQL Resolvers
 *
 * Uses Grafast plan resolvers — functions that return Steps (execution plans)
 * rather than raw data. The key step functions used here:
 *
 * - constant(value)           — return a static value
 * - lambda($step, fn)         — transform a step SYNCHRONOUSLY (no async/await)
 * - loadOne($step, fn)        — batch-load data ASYNCHRONOUSLY (for DB queries)
 * - object({ ... })           — group multiple steps into a single step object
 *
 * Data reads go through loadOne. Workflow state transitions are applied by the
 * stonecropAction resolver itself (server-owns-transition, guarded by allowedStates);
 * side-effecting saves go through registered handlers (project:save, task:save).
 *
 * To connect a real database, replace the imports from ./data with your
 * PostGraphile setup. See: https://stonecrop.io/docs/guides/postgraphile
 */

import { constant, lambda, loadOne, object } from 'grafast'
import { getMeta, getAllMeta, applyGuardedTransition } from '@stonecrop/graphql-middleware'
import type { DoctypeMeta } from '@stonecrop/schema'
import { projects, tasks, type Project, type Task } from './data'

// ============================================================
// Formatting helpers (shape doctype metadata for the GraphQL
// response type defined in server/schema.graphql)
// ============================================================

export function formatDoctypeMeta(meta: DoctypeMeta) {
	// Fields and actions pass through verbatim — the SDL alone decides what is
	// selectable. Enumerating keys here silently drops any field the schema gains
	// later; the only computed addition is `name` (an action's key in the
	// WorkflowMeta.actions record, flattened into the list the SDL declares).
	const actions = meta.workflow?.actions
	const actionList = actions
		? Object.entries(actions as Record<string, Record<string, unknown>>).map(([name, action]) => ({
				name,
				...action,
			}))
		: []
	return {
		name: meta.name,
		slug: meta.slug ?? null,
		fields: meta.fields,
		workflow: meta.workflow
			? {
					states: meta.workflow.states ?? null,
					actions: actionList,
				}
			: null,
		inherits: meta.inherits ?? null,
	}
}

// ============================================================
// Record helpers — read/write the in-memory Maps by doctype
// ============================================================

function getRecord(doctype: string, id: string): Project | Task | null {
	const d = doctype.toLowerCase()
	if (d === 'project') return projects.get(id) ?? null
	if (d === 'task') return tasks.get(id) ?? null
	return null
}

function getRecords(doctype: string, filters?: Record<string, unknown>): (Project | Task)[] {
	const d = doctype.toLowerCase()
	if (d === 'project') {
		return Array.from(projects.values())
	}
	if (d === 'task') {
		let all = Array.from(tasks.values())
		if (filters?.projectId) {
			all = all.filter(t => t.projectId === filters.projectId)
		}
		return all
	}
	return []
}

function nextId(doctype: string): string {
	const d = doctype.toLowerCase()
	const ids = d === 'project' ? projects.keys() : tasks.keys()
	const max = Math.max(0, ...Array.from(ids, id => Number(id) || 0))
	return String(max + 1)
}

// ============================================================
// Resolvers (Grafast plan format)
// ============================================================

export const resolvers = {
	Query: {
		plans: {
			healthCheck() {
				return constant({ status: 'healthy', timestamp: new Date().toISOString(), version: '1.0.0' })
			},

			getMeta(_: unknown, { $doctype }: any) {
				return lambda($doctype, (doctype: unknown) => {
					const meta = getMeta(doctype as string)
					return meta ? formatDoctypeMeta(meta) : null
				})
			},

			stonecropMeta(_: unknown, { $doctype }: any) {
				return lambda($doctype, (doctype: unknown) => {
					const meta = getMeta(doctype as string)
					return meta ? formatDoctypeMeta(meta) : null
				})
			},

			stonecropAllMeta() {
				return constant(getAllMeta().map(formatDoctypeMeta))
			},

			stonecropRecord(_: unknown, { $doctype, $id, $options }: any) {
				return loadOne(object({ doctype: $doctype, id: $id, options: $options }), async (specs: readonly any[]) => {
					return specs.map(spec => ({
						data: getRecord(spec.doctype, spec.id),
						doctype: spec.doctype,
					}))
				})
			},

			stonecropRecords(_: unknown, { $doctype, $filters, $orderBy, $limit, $offset, $options }: any) {
				return loadOne(
					object({
						doctype: $doctype,
						filters: $filters,
						orderBy: $orderBy,
						limit: $limit,
						offset: $offset,
						options: $options,
					}),
					async (specs: readonly any[]) => {
						return specs.map(spec => {
							const all = getRecords(spec.doctype, spec.filters ?? {})
							const offset = spec.offset ?? 0
							const limit = spec.limit ?? 100
							return {
								data: all.slice(offset, offset + limit),
								doctype: spec.doctype,
								count: all.length,
							}
						})
					}
				)
			},
		},
	},

	Mutation: {
		plans: {
			stonecropAction(_: unknown, { $doctype, $action, $args: $actionArgs }: any) {
				return loadOne(
					object({ doctype: $doctype, action: $action, actionArgs: $actionArgs }),
					async (specs: readonly any[]) => {
						return Promise.all(
							specs.map(async spec => {
								const meta = getMeta(spec.doctype)
								if (!meta) return { success: false, data: null, error: `Unknown doctype: ${spec.doctype}` }

								const actionDef = meta.workflow?.actions?.[spec.action]
								if (!actionDef) return { success: false, data: null, error: `Unknown action: ${spec.action}` }

								// Record envelope: [{ id, data }] — the transition keys off the record id.
								const argList = Array.isArray(spec.actionArgs) ? spec.actionArgs : []
								const recordId = argList[0]?.id != null ? String(argList[0].id) : undefined
								const d = spec.doctype.toLowerCase()

								try {
									// The server owns the transition: read current state, guard against allowedStates,
									// write nextState. Reads/writes go straight to the in-memory Maps; a PostGraphile
									// setup swaps in pgClient SQL instead.
									return await applyGuardedTransition(actionDef, {
										readState: async () => {
											if (recordId == null) return undefined
											const record = getRecord(d, recordId)
											return record?.status == null ? undefined : String(record.status)
										},
										writeState: async (nextState: string) => {
											if (recordId == null) return
											const existing = getRecord(d, recordId)
											if (!existing) return
											if (d === 'project') projects.set(recordId, { ...existing, status: nextState } as Project)
											else if (d === 'task') tasks.set(recordId, { ...existing, status: nextState } as Task)
										},
									})
								} catch (err) {
									return { success: false, data: null, error: err instanceof Error ? err.message : String(err) }
								}
							})
						)
					}
				)
			},

			stonecropCreate(_: unknown, { $doctype, $input }: any) {
				return loadOne(object({ doctype: $doctype, input: $input }), async (specs: readonly any[]) => {
					return specs.map(spec => {
						const d = spec.doctype.toLowerCase()
						const id = nextId(d)
						const now = new Date().toISOString()
						if (d === 'project') {
							const record: Project = { id, createdAt: now, status: 'Active', description: '', ...spec.input }
							projects.set(id, record)
							return { data: record, doctype: spec.doctype }
						}
						if (d === 'task') {
							const record: Task = { id, createdAt: now, status: 'Todo', description: '', dueDate: null, ...spec.input }
							tasks.set(id, record)
							return { data: record, doctype: spec.doctype }
						}
						return { data: null, doctype: spec.doctype }
					})
				})
			},

			stonecropUpdate(_: unknown, { $doctype, $id, $patch }: any) {
				return loadOne(object({ doctype: $doctype, id: $id, patch: $patch }), async (specs: readonly any[]) => {
					return specs.map(spec => {
						const d = spec.doctype.toLowerCase()
						const existing = getRecord(d, spec.id)
						if (!existing) return null
						if (d === 'project') {
							const updated = { ...existing, ...spec.patch } as Project
							projects.set(spec.id, updated)
							return { data: updated, doctype: spec.doctype }
						}
						if (d === 'task') {
							const updated = { ...existing, ...spec.patch } as Task
							tasks.set(spec.id, updated)
							return { data: updated, doctype: spec.doctype }
						}
						return null
					})
				})
			},

			stonecropDelete(_: unknown, { $doctype, $id }: any) {
				return loadOne(object({ doctype: $doctype, id: $id }), async (specs: readonly any[]) => {
					return specs.map(spec => {
						const d = spec.doctype.toLowerCase()
						let deleted = false
						if (d === 'project') deleted = projects.delete(spec.id)
						else if (d === 'task') deleted = tasks.delete(spec.id)
						return {
							success: deleted,
							data: deleted ? { id: spec.id } : null,
							error: deleted ? null : 'Record not found',
						}
					})
				})
			},
		},
	},
}

export default resolvers
