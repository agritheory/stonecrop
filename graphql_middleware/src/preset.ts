import type { GraphileConfig } from 'postgraphile/graphile-build'
import type { PgCodecWithAttributes } from 'postgraphile/@dataplan/pg'
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'

import type { StonecropPresetOptions } from './types/preset'

const StonecropFieldCasingPlugin: GraphileConfig.Plugin = {
	name: 'StonecropFieldCasingPlugin',
	version: '0.0.0',
	inflection: {
		replace: {
			attribute(
				this: GraphileBuild.Inflection,
				previous: ((details: { attributeName: string; codec: PgCodecWithAttributes }) => string) | undefined,
				_options: GraphileConfig.ResolvedPreset,
				details: { attributeName: string; codec: PgCodecWithAttributes }
			) {
				return this.upperCamelCase(details.attributeName)
			},
		},
	},
}

/**
 * Create a PostGraphile preset configured for Stonecrop.
 *
 * The returned preset extends PostGraphile Amber, which provides PostgreSQL integration,
 * Relay-style connections, and the standard PostGraphile schema structure. Stonecrop's
 * `createStonecropPlugin` should be added to the `plugins` array to enable Stonecrop's
 * `stonecropRecord`, `stonecropRecords`, `stonecropMeta`, and `stonecropAction` resolvers.
 *
 * @example
 * ```typescript
 * import { createStonecropPreset, makePgService, createStonecropPlugin } from '@stonecrop/graphql-middleware'
 *
 * const preset = createStonecropPreset({ fieldCasing: 'camel' })
 * preset.pgServices = [makePgService({ connectionString: process.env.DATABASE_URL, schemas: ['public'] })]
 * preset.plugins = [createStonecropPlugin()]
 * ```
 *
 * @param options - Optional configuration for field casing
 * @public
 */
export const createStonecropPreset = (options?: StonecropPresetOptions): GraphileConfig.Preset => ({
	extends: [PostGraphileAmberPreset],
	plugins: options?.fieldCasing === 'pascal' ? [StonecropFieldCasingPlugin] : [],
})

/**
 * Default Stonecrop preset with camelCase field names.
 *
 * Convenience alias for `createStonecropPreset()` — equivalent to `createStonecropPreset({ fieldCasing: 'camel' })`.
 * Use this for a minimal setup when no custom options are needed.
 *
 * @public
 */
export const StonecropPreset = createStonecropPreset()
