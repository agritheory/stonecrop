import { grafserv } from 'grafserv/h3/v1'
import type { GrafservRuntimeConfig } from '../types.js'
/**
 * Get or create the grafserv instance
 * Exported for use by separate handler files
 *
 * For PostGraphile mode: uses pgl.createServ(grafserv) to preserve the full
 * execution context (withPgClient, pgSettings, plugin middleware, etc.).
 * For schema mode: builds a schema from files/function and wraps with grafserv.
 */
export declare function getGrafservInstance(options: GrafservRuntimeConfig): Promise<ReturnType<typeof grafserv>>
/**
 * Clear the cached instances (useful for development hot reload)
 *
 * For PostGraphile mode, only the grafserv reference is cleared — PostGraphile's
 * pgl instance manages its own schema lifecycle and watch mode.
 */
export declare function clearGrafservCache(): Promise<void>
/**
 * Main H3 event handler for GraphQL requests and Ruru UI
 * Routes between GraphQL operations and GraphiQL UI based on request type
 */
declare const _default: import('h3').EventHandler<
	import('h3').EventHandlerRequest,
	Promise<Buffer<ArrayBufferLike> | import('grafserv').JSONValue | undefined>
>
export default _default
