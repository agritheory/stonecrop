/** In-memory layout for ActionSet drag position (survives SPA navigation, clears on full reload). */
export type ActionSetLayoutSession = {
	tileTopPx: number | null
	previewFraction: number | null
}

const session: ActionSetLayoutSession = {
	tileTopPx: null,
	previewFraction: null,
}

export function readActionSetLayoutSession(): Readonly<ActionSetLayoutSession> {
	return session
}

export function writeActionSetLayoutSession(partial: Partial<ActionSetLayoutSession>): void {
	if (partial.tileTopPx !== undefined) {
		session.tileTopPx = partial.tileTopPx
	}
	if (partial.previewFraction !== undefined) {
		session.previewFraction = partial.previewFraction
	}
}

/** Test helper to reset in-memory session between cases. */
export function resetActionSetLayoutSessionForTests(): void {
	session.tileTopPx = null
	session.previewFraction = null
}
