import { ensureSessionId, sessionStorage } from '../session-store'

export default defineEventHandler(event => {
	if (!event.path.startsWith('/graphql')) {
		return
	}

	const sessionId = ensureSessionId(event)
	sessionStorage.enterWith(sessionId)
})
