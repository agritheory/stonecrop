import { AsyncLocalStorage } from 'node:async_hooks'
import { randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'
import { getCookie, setCookie } from 'h3'

const PLAYGROUND_SESSION_COOKIE = 'playground-session'
const MAX_SESSIONS = 1000

export const sessionStorage = new AsyncLocalStorage<string>()

export function getSessionId(): string {
	return sessionStorage.getStore() ?? 'default'
}

export function ensureSessionId(event: H3Event): string {
	let sessionId = getCookie(event, PLAYGROUND_SESSION_COOKIE)
	if (!sessionId) {
		sessionId = randomUUID()
		setCookie(event, PLAYGROUND_SESSION_COOKIE, sessionId, {
			maxAge: 60 * 60 * 24,
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
		})
	}
	return sessionId
}

export function touchSession(sessionId: string, sessionOrder: string[]): void {
	const index = sessionOrder.indexOf(sessionId)
	if (index >= 0) {
		sessionOrder.splice(index, 1)
	}
	sessionOrder.push(sessionId)

	while (sessionOrder.length > MAX_SESSIONS) {
		const evicted = sessionOrder.shift()
		if (evicted) {
			onEvictSession?.(evicted)
		}
	}
}

let onEvictSession: ((sessionId: string) => void) | undefined

export function registerSessionEvictionHandler(handler: (sessionId: string) => void): void {
	onEvictSession = handler
}
