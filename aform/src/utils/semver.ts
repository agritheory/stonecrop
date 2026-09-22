import type { SemverValue } from '../types'

/**
 * Named mask token for {@link useStringMask} — filters to semver-safe characters without
 * placeholders or maxlength.
 * @public
 */
export const SEMVER_MASK = 'semver'

/**
 * Default empty semver value.
 * @public
 */
export function emptySemverValue(): SemverValue {
	return { raw: '', major: 0, minor: 0, patch: 0 }
}

/**
 * Parsed numeric core of a semver string (prerelease and build metadata are ignored).
 * @public
 */
export interface SemverParts {
	major: number
	minor: number
	patch: number
}

/**
 * Parse the numeric major/minor/patch from a semver string.
 *
 * Accepts optional `v`/`V` prefix, hyphen prerelease (`-pre`, `-pre.1`), build metadata (`+b`),
 * and glued prerelease suffixes (`b`, `b1`, `pre`). Missing minor/patch default to `0`.
 *
 * @returns Parsed parts, or `undefined` when the string is not a valid semver shape.
 * @public
 */
export function parseSemver(input: string): SemverParts | undefined {
	const trimmed = input.trim()
	if (!trimmed) return undefined

	let s = trimmed
	if (s[0] === 'v' || s[0] === 'V') {
		s = s.slice(1)
		if (!s) return undefined
	}

	let build = ''
	const plusIdx = s.indexOf('+')
	if (plusIdx !== -1) {
		build = s.slice(plusIdx + 1)
		s = s.slice(0, plusIdx)
		if (!build || !/^[\w.]+$/.test(build)) return undefined
	}

	let hyphenPre = ''
	const dashIdx = s.indexOf('-')
	if (dashIdx !== -1) {
		hyphenPre = s.slice(dashIdx + 1)
		s = s.slice(0, dashIdx)
		if (!hyphenPre || !/^[\w.]+$/.test(hyphenPre)) return undefined
	}

	if (s.includes('..')) return undefined

	const coreMatch = s.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?(.*)$/)
	if (!coreMatch) return undefined

	const [, majorStr, minorStr, patchStr, glued] = coreMatch
	if (glued && !/^[a-zA-Z][\w.]*$/.test(glued)) return undefined

	const major = Number.parseInt(majorStr, 10)
	const minor = minorStr !== undefined ? Number.parseInt(minorStr, 10) : 0
	const patch = patchStr !== undefined ? Number.parseInt(patchStr, 10) : 0

	if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) return undefined

	return { major, minor, patch }
}

/**
 * Build a {@link SemverValue} from a raw string when parse succeeds.
 * @public
 */
export function recomputeSemver(raw: string): SemverValue | undefined {
	const parts = parseSemver(raw)
	if (!parts) return undefined
	return { raw, ...parts }
}

/**
 * Characters allowed in the default semver mask.
 * @public
 */
export const SEMVER_MASK_CHARSET = /^[vV0-9.+\-A-Za-z]*$/

/**
 * Filter input to semver-safe characters for the named `semver` mask.
 * @public
 */
export function filterSemverMaskInput(input: string): string {
	let filtered = ''
	for (const char of input) {
		if (SEMVER_MASK_CHARSET.test(char)) filtered += char
	}
	return filtered
}
