/**
 * Merge introspected schema facts into an already-authored doctype.
 *
 * The authored doctype is the source of truth. Generation **verifies** it and stamps provenance;
 * it does not overwrite. That polarity is deliberate and load-bearing — a doctype legitimately
 * declares a `primaryKey` the schema cannot express. A natural business key is very often a
 * `UNIQUE` constraint rather than the table's `PRIMARY KEY`, and where a table carries several
 * uniques no rule can pick between them. Overwriting identity from the schema would silently
 * re-key such a doctype on every regeneration and break the handlers that key on the old value.
 *
 * So divergence is **reported, never applied** — a human decides. The only mutation this performs
 * is adding `source: 'introspected'` to fields confirmed to exist in the GraphQL schema.
 *
 * @packageDocumentation
 */

import { INTROSPECTED_IDENTITY_PROPS } from '../field'
import { authoredPrimaryKey, flattenAuthored, isAuthoredRecord } from './authored'
import type { AuthoredDoctype } from './authored'
import type { ConvertedGraphQLDoctype } from './types'

export type { AuthoredDoctype }

/**
 * What generation found that the authored doctype does not agree with. Every bucket is advisory —
 * nothing here is applied automatically.
 *
 * @public
 */
export interface DoctypeDrift {
	/** The authored doctype's name. */
	doctype: string
	/**
	 * `clean` — the authored primary key is the one generation would derive.
	 * `partial` — the doctype declares an identity generation cannot derive, so identity was left alone.
	 */
	mode: 'clean' | 'partial'
	/** Why the mode is `partial`, when it is. */
	reason?: string
	/** Fieldnames confirmed against the schema and stamped. */
	tagged: string[]
	/** Authored fields with no matching schema field — app components, fieldsets, or stale entries. */
	orphan: string[]
	/** Schema fields absent from the doctype. Usually deliberate curation, occasionally an oversight. */
	omitted: string[]
	/** `fieldname: authored=… schema=…` where the chosen component differs from the scalar mapping. */
	componentDrift: string[]
	/** `fieldname: authored=… schema=…` where nullability disagrees. */
	requiredDrift: string[]
	/** Identity properties that differ. These are the ones a human must adjudicate. */
	identityDrift: string[]
}

/**
 * How to verify the authored doctype against the schema.
 *
 * @public
 */
export interface MergeOptions {
	/**
	 * The authored doctype is a curated **subset** of the schema's columns rather than a model of
	 * all of them — an aggregate being the case this exists for.
	 *
	 * This changes what counts as drift in both directions, so `generated` must be passed the
	 * *entity's* full field set, not the subset's. A column the author added to an aggregate is
	 * then confirmed against the real table (so a genuinely dropped column still reports as an
	 * orphan), while the columns deliberately left out stop reporting as omissions. Without it an
	 * aggregate reports phantom drift on every run, which both spams `--check` and buries the one
	 * finding that matters.
	 */
	subset?: boolean
}

/** Outcome of a merge: the doctype to write, plus what generation disagreed with. @public */
export interface MergeResult {
	/** The authored doctype with `source` markers added and nothing else changed. */
	doctype: AuthoredDoctype
	/** Advisory report. Never applied. */
	drift: DoctypeDrift
}

function describe(value: unknown): string {
	return value === undefined ? '—' : JSON.stringify(value)
}

/**
 * Verify an authored doctype against freshly generated output and stamp provenance.
 *
 * @param authored - the doctype as it exists on disk; every key not named below is preserved verbatim
 * @param generated - `convertGraphQLSchema` output for the corresponding GraphQL type. For a
 *   `subset` merge this is the **entity**, whose fields are the set the subset is curated from
 * @param options - see {@link MergeOptions}
 * @returns the doctype to write, plus a drift report
 *
 * @example
 * ```ts
 * const [generated] = convertGraphQLSchema(introspection, { include: ['Uom'] })
 * const { doctype, drift } = mergeIntrospectedDoctype(JSON.parse(onDisk), generated)
 * if (drift.identityDrift.length) console.warn(drift.identityDrift.join('\n'))
 * ```
 *
 * @public
 */
export function mergeIntrospectedDoctype(
	authored: AuthoredDoctype,
	generated: ConvertedGraphQLDoctype,
	options: MergeOptions = {}
): MergeResult {
	const authoredFields = Array.isArray(authored.fields) ? authored.fields.filter(isAuthoredRecord) : []
	const generatedByName = new Map(generated.fields.map(f => [f.fieldname, f]))
	// Expanding links live in `links`, not `fields`, so a field naming one is modelled, not orphaned.
	const generatedLinkNames = new Set(Object.keys(generated.links ?? {}))

	const drift: DoctypeDrift = {
		doctype: typeof authored.name === 'string' ? authored.name : '(unnamed)',
		mode: 'clean',
		tagged: [],
		orphan: [],
		omitted: [],
		componentDrift: [],
		requiredDrift: [],
		identityDrift: [],
	}

	const tag = (field: AuthoredDoctype): AuthoredDoctype => {
		// Containers have no column of their own; recurse and leave the container itself alone.
		if (Array.isArray(field.schema)) {
			return { ...field, schema: field.schema.filter(isAuthoredRecord).map(tag) }
		}

		const name = typeof field.fieldname === 'string' ? field.fieldname : ''
		const match = generatedByName.get(name)

		if (!match) {
			// A computed field declares up front that it has no backing column, so it is not a
			// discrepancy. Everything else is worth surfacing — it may be an app component, or a
			// column that has since been dropped.
			if (field.computed !== true && !generatedLinkNames.has(name)) drift.orphan.push(name)
			return field
		}

		drift.tagged.push(name)

		if (match.component !== field.component) {
			drift.componentDrift.push(`${name}: authored=${describe(field.component)} schema=${describe(match.component)}`)
		}
		if (Boolean(match.required) !== Boolean(field.required)) {
			drift.requiredDrift.push(`${name}: authored=${Boolean(field.required)} schema=${Boolean(match.required)}`)
		}
		for (const prop of INTROSPECTED_IDENTITY_PROPS) {
			if (prop === 'fieldname' || prop === 'required') continue
			const authoredValue = field[prop]
			const schemaValue = match[prop]
			// Absent on both sides is agreement, not drift — most fields set none of these.
			if (authoredValue === undefined && schemaValue === undefined) continue
			if (JSON.stringify(authoredValue) !== JSON.stringify(schemaValue)) {
				drift.identityDrift.push(`${name}.${prop}: authored=${describe(authoredValue)} schema=${describe(schemaValue)}`)
			}
		}

		return { ...field, source: 'introspected' }
	}

	const merged: AuthoredDoctype = { ...authored, fields: authoredFields.map(tag) }

	// A curated subset omits columns by definition, so the bucket that reports omissions has
	// nothing true to say about one.
	if (!options.subset) {
		const authoredNames = new Set(flattenAuthored(authoredFields).map(f => f.fieldname))
		drift.omitted = generated.fields.map(f => f.fieldname).filter(n => !authoredNames.has(n))
	}

	// Classify identity last, once every field has been compared.
	const authoredPk = authoredPrimaryKey(authored)
	const generatedPk = generated.fields.find(f => f.primaryKey === true)
	if (authoredPk && generatedPk && authoredPk !== generatedPk.fieldname) {
		drift.mode = 'partial'
		drift.reason = `authored primary key '${authoredPk}' is not the derivable '${generatedPk.fieldname}' — left as authored`
	} else if (authoredPk && !generatedPk) {
		drift.mode = 'partial'
		drift.reason = `authored primary key '${authoredPk}' is not derivable from the schema — left as authored`
	} else if (!authoredPk && generatedPk) {
		drift.mode = 'partial'
		drift.reason = `schema suggests '${generatedPk.fieldname}' as primary key but the doctype declares none — not applied`
	}

	return { doctype: merged, drift }
}

/**
 * Render a drift report as human-readable lines. Empty when generation agrees with the doctype.
 *
 * @param drift - a report from {@link mergeIntrospectedDoctype}
 * @returns one line per finding, ready to print
 *
 * @public
 */
export function formatDoctypeDrift(drift: DoctypeDrift): string[] {
	const lines: string[] = []
	if (drift.reason) lines.push(`  ${drift.doctype}: ${drift.reason}`)
	const bucket = (label: string, entries: string[]) => {
		if (entries.length) lines.push(`  ${drift.doctype}: ${label} ${entries.join('; ')}`)
	}
	bucket('identity drift', drift.identityDrift)
	bucket('component drift', drift.componentDrift)
	bucket('required drift', drift.requiredDrift)
	bucket('authored fields with no schema field:', drift.orphan)
	bucket('schema fields not modelled:', drift.omitted)
	return lines
}
