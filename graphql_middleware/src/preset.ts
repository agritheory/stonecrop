import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'

/**
 * Controls how PostgreSQL column names are mapped to GraphQL field names in the synthesized preset.
 *
 * - `'camel'` (default): `my_column` → `myColumn`. This matches PostGraphile Amber's built-in behaviour.
 * - `'pascal'`: `my_column` → `MyColumn`. Opt in via `createStonecropPreset({ fieldCasing: 'pascal' })` or
 *   `grafserv.fieldCasing: 'pascal'` in `nuxt.config.ts`.
 *
 * Smart tag overrides (`@name` on column comments) are respected regardless of this setting.
 * @public
 */
export type FieldCasing = 'camel' | 'pascal'

/**
 * Stops Amber taking `id` for Relay's global object identifier.
 *
 * Amber points `nodeIdFieldName` at `id`, so `PgAttributesPlugin` renames any real column called
 * `id` out of the way to `row_id` -> `rowId`. Stonecrop can use neither name: the middleware
 * resolves columns with raw SQL through `camelToSnake` and never reads the GraphQL surface, so `id`
 * is an opaque base64 node id with no column behind it, and `rowId` names a `row_id` that does not
 * exist. A doctype generated from the un-overridden schema is stamped `primaryKey: true` on that
 * node id and every read of it then fails on a missing column.
 *
 * Both inflectors must move together. Undoing the rename alone collides with the Relay field still
 * sitting on `id`; disabling `NodePlugin` alone removes the Relay field but leaves the column called
 * `rowId`, which is strictly worse — it drops the one case that used to warn. Moving the identifier
 * to `nodeId` keeps Relay working and is the name the schema converter already skips.
 *
 * Mirrors `postgraphile/presets/v4`, which reverses exactly these two inflectors.
 */
const StonecropNaturalIdPlugin: GraphileConfig.Plugin = {
	name: 'StonecropNaturalIdPlugin',
	version: '0.0.0',
	after: ['PgAttributesPlugin'],
	inflection: {
		replace: {
			// Move Relay's global identifier off `id`...
			nodeIdFieldName() {
				return 'nodeId'
			},

			// ...so the real column can keep its own name.
			_attributeName(previous, options, details) {
				// `previous` is optional in the inflector signature because a replacement may be the first
				// implementation. It never is here — `after: ['PgAttributesPlugin']` guarantees Amber's runs
				// first — but the raw attribute name is the correct identity fallback.
				const name = previous?.(details) ?? details.attributeName
				if (!details.skipRowId && name === 'row_id') {
					const { codec, attributeName } = details
					const baseName = codec.attributes[attributeName]?.extensions?.tags?.name ?? attributeName
					if (typeof baseName === 'string' && baseName.toLowerCase() === 'id' && !codec.isAnonymous) {
						return 'id'
					}
				}
				return name
			},
		},
	},
}

/**
 * Exposes the many side of a foreign key the database declares as owning.
 *
 * PostGraphile registers both directions of every foreign key, but Amber gives the many side no
 * `manyRelation:resource:connection` behavior — for a non-unique relation `PgRelationsPlugin`'s
 * inferred behavior is `["resource:select", behavior]` and nothing more. So a parent type carries
 * no field for its children, and a doctype generated from that schema can never contain a child
 * table. Every one a consumer has is hand-authored.
 *
 * `ON DELETE CASCADE` is the discriminator because it is the only place a schema states ownership.
 * `sc_tag.item_id` cascades: the tags are the item's rows and die with it. `sc_order.customer_id`
 * does not: an order references a party that outlives it. The two are otherwise the same shape, so
 * no amount of reading the relation itself can separate them — and turning the many side on for
 * *every* foreign key would make each referenced table look like somebody's child.
 *
 * Read at the gather phase rather than from the built relation: `confdeltype` is on the raw
 * `pg_constraint` and does not survive into `relation.extensions`, which carries only `isIndexed`.
 *
 * Connection only, deliberately. The converter recognises a Connection type through
 * `getConnectionNodeType`; a list field is not a shape it knows, so `+manyRelation:resource:list`
 * would add a second field per relation that generation then drops on the floor.
 *
 * A global `preset.schema.defaultBehavior` cannot do this. Inferred behaviors are applied after the
 * global default and take precedence, so `+manyRelation:resource:connection` there is overridden
 * for every relation — verified, it changes nothing, while `-connection +list` through the same
 * option visibly rewrites the Query fields.
 */
const StonecropOwnedRelationsPlugin: GraphileConfig.Plugin = {
	name: 'StonecropOwnedRelationsPlugin',
	version: '0.0.0',
	gather: {
		hooks: {
			pgRelations_relation(_info, event) {
				const { relation, pgConstraint } = event
				// The hook fires once per direction of each constraint; only the backwards one has a
				// many side to expose. `confdeltype` is Postgres' own code: 'c' is CASCADE.
				if (!relation.isReferencee) return
				if (pgConstraint.confdeltype !== 'c') return

				relation.extensions ??= {}
				relation.extensions.tags ??= {}
				relation.extensions.tags.behavior = '+manyRelation:resource:connection'
			},
		},
	},
}

const StonecropFieldCasingPlugin: GraphileConfig.Plugin = {
	name: 'StonecropFieldCasingPlugin',
	version: '0.0.0',
	inflection: {
		replace: {
			attribute(previous, options, details) {
				return this.upperCamelCase(this._attributeName(details))
			},
		},
	},
}

/**
 * Creates a Stonecrop-flavoured PostGraphile preset.
 *
 * The returned preset extends `PostGraphileAmberPreset` and applies Stonecrop's
 * recommended defaults. Pass it to `extends` in your PostGraphile configuration:
 *
 * ```typescript
 * import { createStonecropPreset, makePgService, createStonecropPlugin } from '@stonecrop/graphql-middleware'
 *
 * export default {
 *   extends: [createStonecropPreset()],
 *   pgServices: [makePgService({ connectionString: process.env.DATABASE_URL, schemas: ['public'] })],
 *   plugins: [createStonecropPlugin()],
 * }
 * ```
 *
 * @param options - Optional configuration. Pass `{ fieldCasing: 'pascal' }` to enable
 *   `MyColumn`-style field names instead of the default `myColumn` (camelCase).
 * @public
 */
export const createStonecropPreset = (options?: { fieldCasing?: FieldCasing }): GraphileConfig.Preset => ({
	extends: [PostGraphileAmberPreset],
	plugins:
		options?.fieldCasing === 'pascal'
			? [StonecropNaturalIdPlugin, StonecropOwnedRelationsPlugin, StonecropFieldCasingPlugin]
			: [StonecropNaturalIdPlugin, StonecropOwnedRelationsPlugin],
})

/**
 * The default Stonecrop PostGraphile preset with camelCase field names.
 *
 * Equivalent to `createStonecropPreset()` with no options. Use this when you
 * do not need to customise field casing:
 *
 * ```typescript
 * import { StonecropPreset, makePgService, createStonecropPlugin } from '@stonecrop/graphql-middleware'
 *
 * export default {
 *   extends: [StonecropPreset],
 *   pgServices: [makePgService({ connectionString: process.env.DATABASE_URL })],
 *   plugins: [createStonecropPlugin()],
 * }
 * ```
 * @public
 */
export const StonecropPreset: GraphileConfig.Preset = createStonecropPreset()
