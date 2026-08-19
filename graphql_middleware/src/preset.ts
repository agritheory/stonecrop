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
			? [StonecropNaturalIdPlugin, StonecropFieldCasingPlugin]
			: [StonecropNaturalIdPlugin],
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
