import { pascalToSnake } from '@stonecrop/schema'

/** A table a doctype reads from, as named before quoting. `schema` is absent for an unqualified name. */
export interface TableRef {
	schema?: string
	name: string
}

/**
 * The table a doctype reads from: the `tables` override when the adapter supplies one, otherwise the
 * doctype name snake-cased.
 *
 * The one definition of that mapping. It lives in its own module rather than beside either caller
 * because the plugin imports the link-display enrichment, so the enrichment cannot import back —
 * and the copy it made instead was byte-identical, which is the state a mapping is in right before
 * one side learns about schema-qualified names and the other does not.
 *
 * A dotted override is read as `schema.table`, so a table in a non-default Postgres schema keeps
 * its schema instead of becoming one name containing a dot.
 */
export function resolveTable(name: string, tables?: Record<string, string>): TableRef {
	const target = tables?.[name] ?? pascalToSnake(name)
	const dotIndex = target.indexOf('.')
	if (dotIndex > 0) {
		return { schema: target.slice(0, dotIndex), name: target.slice(dotIndex + 1) }
	}
	return { name: target }
}

/** The quoted SQL table a doctype reads from (see `resolveTable`). */
export function resolveTableName(name: string, tables?: Record<string, string>): string {
	const table = resolveTable(name, tables)
	return table.schema === undefined ? `"${table.name}"` : `"${table.schema}"."${table.name}"`
}
