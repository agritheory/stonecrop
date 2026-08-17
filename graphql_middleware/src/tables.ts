import { pascalToSnake } from '@stonecrop/schema'

/**
 * The quoted SQL table a doctype reads from: the `tables` override when the adapter supplies one,
 * otherwise the doctype name snake-cased.
 *
 * The one definition of that mapping. It lives in its own module rather than beside either caller
 * because the plugin imports the link-display enrichment, so the enrichment cannot import back —
 * and the copy it made instead was byte-identical, which is the state a mapping is in right before
 * one side learns about schema-qualified names and the other does not.
 *
 * A dotted override is read as `schema.table` and quoted in two parts, so a table in a non-default
 * Postgres schema survives quoting instead of becoming one identifier containing a dot.
 */
export function resolveTableName(name: string, tables?: Record<string, string>): string {
	const target = tables?.[name] ?? pascalToSnake(name)
	const dotIndex = target.indexOf('.')
	if (dotIndex > 0) {
		return `"${target.slice(0, dotIndex)}"."${target.slice(dotIndex + 1)}"`
	}
	return `"${target}"`
}
