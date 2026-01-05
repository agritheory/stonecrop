import type { Plugin } from 'graphql-yoga'

import { createAbility } from './ability'
import { Context } from '../types'

const getLoggedInUser = () => {
	// Mock user for demonstration purposes
	return { id: '1', roles: ['editor'] }
}

export const yogaCaslPlugin: Plugin<Context> = {
	onContextBuilding: async ({ context, extendContext }) => {
		// Make this async
		const user = getLoggedInUser()
		const ability = await createAbility(user) // Await here
		extendContext({ ability, user })
	},
}
