export type { DoctypeMeta } from '@stonecrop/schema'

export { StonecropClient, type StonecropClientOptions, type DoctypeContext } from './client'
// Must stay a wildcard: `./types` resolves to this entry's rollup, so a type named in `./types`
// but not re-exported here would vanish from that subpath with nothing to catch it.
export type * from './types'
