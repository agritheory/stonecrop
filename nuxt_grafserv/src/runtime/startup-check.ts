import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin(() => {
	if (!process.env.DATABASE_URL) {
		console.warn(
			'[@stonecrop/nuxt-grafserv] DATABASE_URL is not set. ' +
				'The synthesized PostGraphile preset will fail to connect. ' +
				'Set DATABASE_URL or provide an explicit preset file via the `preset` option.'
		)
	}
})
