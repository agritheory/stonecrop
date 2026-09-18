import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'
import { getGrafservInstance } from './handler.js'
export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const options = config.grafserv
	const serv = await getGrafservInstance(options)
	return serv.handleGraphiqlStaticEvent(event)
})
