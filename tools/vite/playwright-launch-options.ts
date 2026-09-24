import { accessSync, constants } from 'node:fs'

/** Paths where CI images and common Linux installs place Google Chrome. */
const SYSTEM_CHROME_PATHS = [
	'/opt/google/chrome/chrome',
	'/usr/bin/google-chrome-stable',
	'/usr/bin/google-chrome',
] as const

/**
 * Vitest browser mode prefers the system Chrome channel when it exists (CI runners). Otherwise
 * Playwright uses its downloaded Chromium — run `pnpm exec playwright install chromium` once locally.
 */
export function playwrightLaunchOptions(): { channel?: 'chrome' } {
	for (const path of SYSTEM_CHROME_PATHS) {
		try {
			accessSync(path, constants.X_OK)
			return { channel: 'chrome' }
		} catch {
			// try next candidate
		}
	}
	return {}
}
