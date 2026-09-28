/** In-memory layout for ActionSet drag position (survives SPA navigation, clears on full reload). */
export type ActionSetLayoutSession = {
	tileTopPx: number | null
}

const session: ActionSetLayoutSession = {
	tileTopPx: null,
}

export function readActionSetLayoutSession(): Readonly<ActionSetLayoutSession> {
	return session
}

export function writeActionSetLayoutSession(partial: Partial<ActionSetLayoutSession>): void {
	if (partial.tileTopPx !== undefined) {
		session.tileTopPx = partial.tileTopPx
	}
}

/** Test helper to reset in-memory session between cases. */
export function resetActionSetLayoutSessionForTests(): void {
	session.tileTopPx = null
}
