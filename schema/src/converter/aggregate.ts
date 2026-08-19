/**
 * Aggregate doctype derivation.
 *
 * A table gets two generated doctypes: the entity itself, whose `fields` carry every column and
 * which backs the record form, and an **aggregate** — the collection view over the same table.
 * The aggregate starts with identity alone, because the useful default for a collection is the
 * one column that lets a row be opened, not all forty. Widening it is curation, and curation
 * survives regeneration (see `mergeIntrospectedDoctype`).
 *
 * The two are peers: each is a complete doctype with its own `name` and `slug`, and nothing here
 * encodes a relationship between them. Deriving the aggregate's name from the entity's is a
 * generated encoding, not a readable one — no consumer recovers the pair by parsing a slug.
 *
 * @packageDocumentation
 */

import pluralize from 'pluralize'

import { toSlug } from '../naming'
import { getPrimaryKeyField } from '../field'
import type { ValueField } from '../field'
import type { ConvertedGraphQLDoctype } from './types'

/**
 * The name an entity's aggregate doctype is generated under: the entity's name, pluralised.
 *
 * One definition, because the CLI writes the file under `toSlug` of this and any later caller
 * (a scaffolder, a docs generator) must land on the same name or it silently addresses a
 * different file.
 *
 * `pluralize` rather than appending `s`, because the irregulars are not rare in practice —
 * measured against a consumer's 41 hand-authored aggregate doctypes, this rule reproduces every
 * one of their names, slugs and filenames exactly, while `+ 's'` gets five wrong
 * (`Currencys`, `JournalEntrys`, …).
 *
 * The rule is not total: an already-plural name pluralises to itself. Callers must handle that —
 * see {@link buildAggregateDoctype}.
 *
 * @param doctypeName - the entity doctype's `name`
 * @returns the aggregate doctype's `name`
 * @public
 *
 * @example
 * ```typescript
 * aggregateDoctypeName('SalesOrder') // 'SalesOrders' -> slug 'sales-orders'
 * ```
 */
export function aggregateDoctypeName(doctypeName: string): string {
	return pluralize.plural(doctypeName)
}

/**
 * Derive the aggregate doctype for a converted entity.
 *
 * Returns `undefined` when no identity column can be found — a natural-key table whose key the
 * converter refuses to guess and whose author has not declared one, or a foreign PostGraphile
 * endpoint that has left the Relay identifier occupying `id` (Stonecrop's own preset moves it to
 * `nodeId`). That is deliberate: an aggregate with an empty `fields` array is a valid doctype that
 * renders a table with no columns, which looks like a data problem rather than a generation one.
 * Emitting nothing and saying so is the loud failure.
 *
 * Identity resolves the same way `getRecordIdField` resolves it — the declared `primaryKey`, then
 * the conventional `id` — so an aggregate is always keyed on the column the client will later ask
 * for. `declaredIdentity` overrides both: SDL cannot express which `UNIQUE` column is the key, so
 * for a natural-key table the answer only exists in the authored file, and the caller that read it
 * passes the fieldname back.
 *
 * @param doctype - a converted entity doctype, as returned by `convertGraphQLSchema`
 * @param declaredIdentity - fieldname the authored doctype declares as its `primaryKey`, when the
 *   caller has read one. Must name a field the converter emitted; the caller checks that, because
 *   only it can say whether a missing one is a dropped column or a typo.
 * @returns the aggregate doctype, or `undefined` when no identity column exists
 * @public
 *
 * @example
 * ```typescript
 * const [order] = convertGraphQLSchema(sdl, { include: ['Order'] })
 * const aggregate = buildAggregateDoctype(order)
 * // { name: 'Orders', slug: 'orders', fields: [ the id field ] }
 * ```
 */
export function buildAggregateDoctype(
	doctype: ConvertedGraphQLDoctype,
	declaredIdentity?: string
): ConvertedGraphQLDoctype | undefined {
	const identity = findIdentityField(doctype.fields, declaredIdentity)
	if (!identity) return undefined

	const name = aggregateDoctypeName(doctype.name)
	// An already-plural name pluralises to itself, which would give the aggregate the entity's own
	// `name` *and* its filename. Both write paths are silent about it: the CLI writes the file twice
	// in one run, and the middleware's registry is a Map keyed by name, so the later read wins in
	// whatever order `readdirSync` returns. Refusing is the only loud option.
	if (name === doctype.name) return undefined

	// `primaryKey` is stamped rather than copied through: a declared identity is not marked on the
	// converter's own field, and an aggregate whose one column carries no marker resolves identity
	// through `getRecordIdField`'s `id` fallback — a column it does not have, so every listed row is
	// silently dropped. Rebuilt with `source` last so the key order matches an entity's identity
	// field and both files stay byte-stable.
	//
	// A copy, not a reference: the two doctypes are written to separate files and an edit to one
	// must not reach the other.
	const { source, ...rest } = identity
	return {
		name,
		slug: toSlug(name),
		fields: [{ ...rest, primaryKey: true, ...(source === undefined ? {} : { source }) }],
	}
}

/**
 * The field an aggregate is keyed on: an identity the author declared, else the primary key the
 * converter derived, else the conventional `id`.
 *
 * The author wins because the authored doctype is the source of truth — generation verifies it and
 * never overwrites it (see `mergeIntrospectedDoctype`), and the divergence is already reported as
 * identity drift.
 *
 * Calls `getPrimaryKeyField` for the derived half rather than restating it: a restatement drifted
 * exactly as one does, staying top-level while the helper learned to descend into fieldsets.
 *
 * @internal
 */
function findIdentityField(fields: readonly ValueField[], declared?: string): ValueField | undefined {
	if (declared !== undefined) return fields.find(field => field.fieldname === declared)
	return getPrimaryKeyField(fields) ?? fields.find(field => field.fieldname === 'id')
}

/**
 * One file the generator will write, and what that file is verified against.
 *
 * `basis` exists because the two are not always the same document. An aggregate is written from
 * its own one-field generation but verified against the **entity**, since its purpose is to carry
 * fewer columns than the table — checking it against itself reports every curated column as one
 * the table had dropped.
 *
 * @public
 */
export interface GenerationPlanEntry {
	/** The doctype to write. */
	generated: ConvertedGraphQLDoctype
	/** The doctype whose fields an existing file on disk is verified against. */
	basis: ConvertedGraphQLDoctype
	/** Whether the file is a curated subset of `basis` — passed through to `MergeOptions.subset`. */
	subset: boolean
}

/** Options for {@link planGeneration}. @public */
export interface GenerationPlanOptions {
	/** Emit only the entity doctypes, skipping their aggregates. Defaults to `false`. */
	noAggregates?: boolean
	/** Called with an advisory message for each entity that yields no aggregate. */
	onWarning?: (message: string) => void
	/**
	 * Identity the authored doctype on disk declares, keyed by doctype `name`.
	 *
	 * SDL cannot say which `UNIQUE` column is a table's key, so for a natural-key table the converter
	 * derives nothing and the answer exists only in the file. Without this the aggregate is
	 * unreachable: generation says "declare a primaryKey and re-run", and re-running after declaring
	 * one changes nothing, because planning never reads the file.
	 *
	 * Passed in rather than read here so this stays a pure function of its inputs; the CLI owns the
	 * IO. The plan is then a function of the schema *and* what is already on disk.
	 */
	identity?: Record<string, string>
}

/**
 * Expand converted entities into the set of doctype files to write.
 *
 * Each table yields two: the entity, whose fields carry every column and which backs the record
 * form, and its aggregate — the collection view. They are written as peers, one file each, with
 * no key relating them.
 *
 * Separate from the CLI because the pairing of a file to its verification basis is the part that
 * is easy to get wrong and impossible to notice: getting it wrong does not throw, it just reports
 * drift that is not there, forever.
 *
 * @param entities - `convertGraphQLSchema` output
 * @param options - see {@link GenerationPlanOptions}
 * @returns one entry per file to write
 * @public
 */
export function planGeneration(
	entities: readonly ConvertedGraphQLDoctype[],
	options: GenerationPlanOptions = {}
): GenerationPlanEntry[] {
	const entityNames = new Set(entities.map(entity => entity.name))
	const claimed = new Set<string>()

	return entities.flatMap(entity => {
		const self: GenerationPlanEntry = { generated: entity, basis: entity, subset: false }
		if (options.noAggregates) return [self]

		// Name collisions are checked here rather than in the builder because only this function
		// holds the whole set. Reported before the identity check so each refusal names its own
		// cause — the two are repaired differently.
		const name = aggregateDoctypeName(entity.name)
		if (name === entity.name) {
			options.onWarning?.(
				`${entity.name} is already plural, so its aggregate would take the same name and the same ` +
					`file. No aggregate was generated. Rename the doctype to its singular form, or author ` +
					`${entity.slug}.json's collection view by hand.`
			)
			return [self]
		}
		if (entityNames.has(name) || claimed.has(name)) {
			options.onWarning?.(
				`${entity.name}'s aggregate would be named ${name}, which is already taken by another ` +
					`doctype in this run. No aggregate was generated — one of the two needs an explicit ` +
					`name via the doctypeNames option.`
			)
			return [self]
		}

		// Checked here rather than in the builder because only the caller knows whether a name that
		// matches nothing is a dropped column or a typo — and an aggregate built around a field the
		// table has no column for renders a collection whose only column is absent from every row.
		const declared = options.identity?.[entity.name]
		if (declared !== undefined && !entity.fields.some(field => field.fieldname === declared)) {
			options.onWarning?.(
				`${entity.name} declares its primaryKey on '${declared}', which the schema has no column for. ` +
					`No aggregate was generated — correct the declaration in ${entity.slug}.json, or restore the ` +
					`column to the table.`
			)
			return [self]
		}

		const aggregate = buildAggregateDoctype(entity, declared)
		if (!aggregate) {
			options.onWarning?.(
				`${entity.name} has no derivable identity column, so no aggregate doctype was generated. ` +
					`Declare a primaryKey on ${entity.slug}.json and re-run.`
			)
			return [self]
		}
		claimed.add(name)

		// The basis is the entity itself: an aggregate is verified against the table it curates from,
		// not against its own one-field generation. Drift lines take their name from the authored file
		// being checked, so they already name the file the reader has to edit.
		return [self, { generated: aggregate, basis: entity, subset: true }]
	})
}
