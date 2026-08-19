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
 * Returns `undefined` when the entity has no identity column to build one from — a natural-key
 * table whose key the converter refuses to guess, or the un-normalized PostGraphile case where
 * `id` is a Relay identifier and no primary key is derivable at all. That is deliberate: an
 * aggregate with an empty `fields` array is a valid doctype that renders a table with no columns,
 * which looks like a data problem rather than a generation one. Emitting nothing and saying so
 * is the loud failure.
 *
 * Identity resolves the same way {@link getRecordIdField} resolves it — the declared `primaryKey`,
 * then the conventional `id` — so an aggregate is always keyed on the column the client will
 * later ask for.
 *
 * @param doctype - a converted entity doctype, as returned by `convertGraphQLSchema`
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
export function buildAggregateDoctype(doctype: ConvertedGraphQLDoctype): ConvertedGraphQLDoctype | undefined {
	const identity = findIdentityField(doctype.fields)
	if (!identity) return undefined

	const name = aggregateDoctypeName(doctype.name)
	// An already-plural name pluralises to itself, which would give the aggregate the entity's own
	// `name` *and* its filename. Both write paths are silent about it: the CLI writes the file twice
	// in one run, and the middleware's registry is a Map keyed by name, so the later read wins in
	// whatever order `readdirSync` returns. Refusing is the only loud option.
	if (name === doctype.name) return undefined

	return {
		name,
		slug: toSlug(name),
		// A copy, not a reference: the two doctypes are written to separate files and an edit to
		// one must not reach the other.
		fields: [{ ...identity }],
	}
}

/**
 * The field an aggregate is keyed on: the declared primary key, else the conventional `id`.
 *
 * Calls `getPrimaryKeyField` for the first half rather than restating it. The note here used to
 * claim it could not — that the helper wanted a `DoctypeMeta` while this holds raw converter
 * output — and that was never true: `ValueField[]` is assignable to the `DoctypeField[]` the
 * helper takes. The restatement then drifted exactly as a restatement does, staying top-level
 * while the helper learned to descend into fieldsets.
 *
 * @internal
 */
function findIdentityField(fields: readonly ValueField[]): ValueField | undefined {
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

		const aggregate = buildAggregateDoctype(entity)
		if (!aggregate) {
			options.onWarning?.(
				`${entity.name} has no derivable identity column, so no aggregate doctype was generated. ` +
					`Declare a primaryKey on ${entity.slug}.json and re-run.`
			)
			return [self]
		}
		claimed.add(name)

		// The basis carries the entity's fields under the aggregate's name, so drift lines name the
		// file the reader has to go and edit.
		return [self, { generated: aggregate, basis: { ...entity, name: aggregate.name }, subset: true }]
	})
}
