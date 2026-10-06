// SemVer 2.0.0, strictly: https://semver.org. The same grammar the `semver` Postgres extension stores,
// so a version the form accepts is one the column takes, and the two order versions alike.
const SEMVER =
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

const NUMBER = /^(0|[1-9]\d*)$/
const NUMBER_SO_FAR = /^(0|[1-9]\d*)?$/
const PRERELEASE_IDENTIFIER = /^(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)$/
const BUILD_IDENTIFIER = /^[0-9a-zA-Z-]+$/
// Any run of identifier characters can still become an identifier: `01` is not one, but `01a` is.
const IDENTIFIER_SO_FAR = /^[0-9a-zA-Z-]*$/

/**
 * Whether the text is a version under SemVer 2.0.0: `1.4.0`, `1.4.0-beta.2`, `1.4.0+build.5`. A `v`
 * prefix, a missing part (`1.4`) and a leading zero (`01.4.0`) are not.
 * @param text - The text to check
 * @public
 */
export function isSemver(text: string): boolean {
	return SEMVER.test(text)
}

const splitOnce = (text: string, separator: string): [string, string | undefined] => {
	const index = text.indexOf(separator)
	return index === -1 ? [text, undefined] : [text.slice(0, index), text.slice(index + 1)]
}

/** Whether each dot-separated part before the last matches `whole`, and the last matches `last`. */
const partsMatch = (text: string, whole: RegExp, last: RegExp): boolean => {
	const parts = text.split('.')
	const typing = parts.pop() ?? ''
	return parts.every(part => whole.test(part)) && last.test(typing)
}

/**
 * Whether typing more could still make the text a version: `1.`, `1.4.0-` and the empty text can,
 * while `v1`, `01` and `1.4-beta` cannot. Every version passes, so a box that refuses any edit failing
 * this one never stops someone typing a version.
 * @param text - The text so far
 * @public
 */
export function isSemverPrefix(text: string): boolean {
	// Neither `+` nor `-` can appear in the numbers, so the first of each ends the part before it.
	const [head, build] = splitOnce(text, '+')
	const [core, prerelease] = splitOnce(head, '-')

	const coreDone = prerelease !== undefined || build !== undefined
	const numbers = core.split('.').length
	if (numbers > 3 || (coreDone && numbers < 3)) return false
	if (!partsMatch(core, NUMBER, coreDone ? NUMBER : NUMBER_SO_FAR)) return false

	if (prerelease !== undefined) {
		const last = build === undefined ? IDENTIFIER_SO_FAR : PRERELEASE_IDENTIFIER
		if (!partsMatch(prerelease, PRERELEASE_IDENTIFIER, last)) return false
	}

	return build === undefined || partsMatch(build, BUILD_IDENTIFIER, IDENTIFIER_SO_FAR)
}

// Digits without leading zeros, compared without converting, so no version is too big to order.
const compareDigits = (a: string, b: string): number => a.length - b.length || (a < b ? -1 : a > b ? 1 : 0)

const compareIdentifiers = (a: string, b: string): number => {
	const aNumeric = /^\d+$/.test(a)
	const bNumeric = /^\d+$/.test(b)
	if (aNumeric && bNumeric) return compareDigits(a, b)
	if (aNumeric !== bNumeric) return aNumeric ? -1 : 1
	return a < b ? -1 : a > b ? 1 : 0
}

const comparePrereleases = (a: string | undefined, b: string | undefined): number => {
	if (a === b) return 0
	// A prerelease comes before its release.
	if (a === undefined) return 1
	if (b === undefined) return -1

	const left = a.split('.')
	const right = b.split('.')
	for (let i = 0; i < Math.min(left.length, right.length); i++) {
		const order = compareIdentifiers(left[i], right[i])
		if (order) return order
	}
	return left.length - right.length
}

/**
 * Orders two versions by SemVer 2.0.0 precedence: major, minor and patch as numbers, a prerelease
 * before its release, and prerelease identifiers one by one. Build metadata does not count, so
 * `1.4.0+a` and `1.4.0+b` compare equal. Text that is not a version comes after every version.
 * @param a - The first version
 * @param b - The second version
 * @returns Negative when `a` comes first, positive when `b` does, zero when neither
 * @public
 */
export function compareSemver(a: string, b: string): number {
	const left = SEMVER.exec(a)
	const right = SEMVER.exec(b)
	if (!left || !right) return Number(!left) - Number(!right)

	for (let part = 1; part <= 3; part++) {
		const order = compareDigits(left[part], right[part])
		if (order) return order
	}
	return comparePrereleases(left[4], right[4])
}
