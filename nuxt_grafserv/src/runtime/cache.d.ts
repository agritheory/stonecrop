/**
 * Cache management endpoint for the Grafserv module.
 *
 * Actions:
 * - clear: Clear the Grafserv instance cache
 * - status: Get cache status information
 */
declare const _default: import('h3').EventHandler<
	import('h3').EventHandlerRequest,
	Promise<
		| {
				success: boolean
				message: string
				data?: undefined
				availableActions?: undefined
		  }
		| {
				success: boolean
				data: {
					message: string
				}
				message?: undefined
				availableActions?: undefined
		  }
		| {
				success: boolean
				message: string
				availableActions: string[]
				data?: undefined
		  }
	>
>
export default _default
