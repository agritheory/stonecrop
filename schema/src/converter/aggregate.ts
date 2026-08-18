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

import { toSlug } from '../naming'
import type { ValueField } from '../field'
import type { ConvertedGraphQLDoctype } from './types'

/** Appended to an entity's doctype name to name its aggregate. @public */
export const AGGREGATE_NAME_SUFFIX = 'Aggregate'

/**
 * The name an entity's aggregate doctype is generated under.
 *
 * One definition, because the CLI writes the file under `toSlug` of this and any later caller
 * (a scaffolder, a docs generator) must land on the same name or it silently addresses a
 * different file.
 *
 * @param doctypeName - the entity doctype's `name`
 * @returns the aggregate doctype's `name`
 * @public
 *
 * @example
 * ```typescript
 * aggregateDoctypeName('SalesOrder') // 'SalesOrder Aggregate' -> slug 'sales-order-aggregate'
 * ```
 */
export function aggregateDoctypeName(doctypeName: string): string {
	return `${doctypeName} ${AGGREGATE_NAME_SUFFIX}`
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
 * // { name: 'Order Aggregate', slug: 'order-aggregate', fields: [ the id field ] }
 * ```
 */
export function buildAggregateDoctype(doctype: ConvertedGraphQLDoctype): ConvertedGraphQLDoctype | undefined {
	const identity = findIdentityField(doctype.fields)
	if (!identity) return undefined

	const name = aggregateDoctypeName(doctype.name)
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
 * Mirrors `getRecordIdField`'s order rather than re-deriving it. It cannot call that helper
 * directly — this operates on converter output (`ValueField[]`) mid-conversion, before the
 * doctype is a `DoctypeMeta` — but the order must not diverge, or the aggregate would key on a
 * column the client never asks for.
 *
 * @internal
 */
function findIdentityField(fields: readonly ValueField[]): ValueField | undefined {
	return fields.find(field => field.primaryKey) ?? fields.find(field => field.fieldname === 'id')
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
	return entities.flatMap(entity => {
		const self: GenerationPlanEntry = { generated: entity, basis: entity, subset: false }
		if (options.noAggregates) return [self]

		const aggregate = buildAggregateDoctype(entity)
		if (!aggregate) {
			options.onWarning?.(
				`${entity.name} has no derivable identity column, so no aggregate doctype was generated. ` +
					`Declare a primaryKey on ${entity.slug}.json and re-run.`
			)
			return [self]
		}

		// The basis carries the entity's fields under the aggregate's name, so drift lines name the
		// file the reader has to go and edit.
		return [self, { generated: aggregate, basis: { ...entity, name: aggregate.name }, subset: true }]
	})
}
