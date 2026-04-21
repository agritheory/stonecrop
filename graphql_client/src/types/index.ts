/**
 * @file Types for the GraphQL client.
 * @public
 */

import type { GetRecordResult as SchemaGetRecordResult } from '@stonecrop/schema'

/**
 * Result from getRecord - includes the record data and any unknown links requested
 * @public
 */
export interface GetRecordResult extends SchemaGetRecordResult {
	/** Link names that were requested but don't exist in the doctype schema */
	unknownLinks?: string[]
}
