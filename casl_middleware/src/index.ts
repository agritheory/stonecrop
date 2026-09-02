export { createAbility, detectSubjectType } from './middleware/ability'
export type { AppAbility, AbilityBuilderFunction } from './middleware/ability'
export { createCaslMiddleware } from './middleware/graphql'
export { pglCaslPlugin } from './middleware/postgraphile'
// Must stay a wildcard: `./types` resolves to this entry's rollup, so a type named in `./types`
// but not re-exported here would vanish from that subpath with nothing to catch it.
export type * from './types'
