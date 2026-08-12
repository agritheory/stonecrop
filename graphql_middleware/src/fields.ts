import type { DoctypeField, TableField, ValueField } from '@stonecrop/schema'

/**
 * Recursively flatten Fieldset containers into a flat array of non-container fields.
 * Fieldset entries are replaced by their children; all other fields pass through.
 *
 * A fieldset is a layout grouping, not a scope: every field inside one is a field of the doctype,
 * with a column of its own and a name a link can bind to. Anything asking "what does this doctype
 * declare" must therefore descend, and the two ways to get that wrong point opposite ways — the
 * SELECT builder would omit real columns, while a validator would report a working declaration as
 * broken.
 *
 * Lives here rather than beside either caller because it now has three of them across two modules
 * (`getSqlColumns` and `knownFields` in the plugin, `validateReferences` in the registry), and a
 * second copy is how the plugin and the registry would come to disagree about what a doctype
 * declares. Internal — not re-exported from the package index.
 */
export function flattenFields(fields: readonly DoctypeField[]): (ValueField | TableField)[] {
	const result: (ValueField | TableField)[] = []
	for (const f of fields) {
		if (f.kind === 'fieldset') {
			result.push(...flattenFields(f.schema))
		} else {
			result.push(f)
		}
	}
	return result
}
