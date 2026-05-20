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
	plugins: options?.fieldCasing === 'pascal' ? [StonecropFieldCasingPlugin] : [],
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
