export const isHtmlString = (htmlString: string) => {
	const $document = new DOMParser().parseFromString(htmlString, 'text/html')
	return Array.from($document.body.childNodes).some(node => node.nodeType === 1)
}

export const generateHash = (length = 8) => {
	return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

/**
 * Render a composite quantity value (`{ qty, uom }`, see `QuantityValue` in `@stonecrop/aform`)
 * as `"<qty> <uom>"`. Shared by the two paths a quantity column can reach formatting through:
 * the `format` that `schemaToColumns` attaches, and the table store's category-based default.
 */
export const formatQuantity = (value: any): string => {
	if (value === null || value === undefined) return ''
	if (typeof value === 'object') {
		const qty = value.qty ?? ''
		const uom = value.uom ?? ''
		return uom ? `${qty} ${uom}`.trim() : String(qty)
	}
	return String(value)
}

/**
 * Render a composite currency value (`{ amount, currency }`, see `CurrencyValue` in
 * `@stonecrop/aform`) as `"<amount> <currency>"`. `currency` is an AFormLinkValue FK reference —
 * its `displayText` is preferred, falling back to `id`. Shared by the two paths a currency column
 * can reach formatting through: the `format` that `schemaToColumns` attaches, and the table
 * store's category-based default.
 */
export const formatCurrency = (value: any): string => {
	if (value === null || value === undefined) return ''
	if (typeof value === 'object') {
		const amount = value.amount ?? ''
		const currency = value.currency?.displayText ?? value.currency?.id ?? ''
		return currency ? `${amount} ${currency}`.trim() : String(amount)
	}
	return String(value)
}

/**
 * Render a composite semver value (`{ raw, major, minor, patch }`) as its `raw` string.
 * Shared by the two paths a semver column can reach formatting through: the `format` that
 * `schemaToColumns` attaches, and the table store's category-based default.
 */
export const formatSemver = (value: any): string => {
	if (value === null || value === undefined) return ''
	if (typeof value === 'object' && 'raw' in value) return String(value.raw ?? '')
	return String(value)
}

/**
 * Whether a semver `raw` string carries prerelease metadata (hyphen or glued suffix).
 */
export const isSemverPrereleaseRaw = (raw: string): boolean => {
	if (!raw) return false
	let s = raw.replace(/^[vV]/, '')
	const plusIdx = s.indexOf('+')
	if (plusIdx !== -1) s = s.slice(0, plusIdx)
	if (s.includes('-')) return true
	const coreMatch = s.match(/^(\d+(?:\.\d+){0,2})(.*)$/)
	return !!(coreMatch?.[2] && /^[a-zA-Z]/.test(coreMatch[2]))
}

/**
 * Compare two semver cell values for table sort: `(major, minor, patch)`, then release before
 * prerelease when the triple matches.
 */
export const compareSemverValues = (a: unknown, b: unknown): number => {
	const parts = (value: unknown) => {
		if (value !== null && typeof value === 'object') {
			const v = value as { raw?: string; major?: number; minor?: number; patch?: number }
			if (typeof v.major === 'number' && typeof v.minor === 'number' && typeof v.patch === 'number') {
				return {
					major: v.major,
					minor: v.minor,
					patch: v.patch,
					raw: typeof v.raw === 'string' ? v.raw : '',
				}
			}
		}
		return undefined
	}

	const left = parts(a)
	const right = parts(b)
	if (!left && !right) return 0
	if (!left) return 1
	if (!right) return -1

	if (left.major !== right.major) return left.major - right.major
	if (left.minor !== right.minor) return left.minor - right.minor
	if (left.patch !== right.patch) return left.patch - right.patch

	const leftPre = isSemverPrereleaseRaw(left.raw)
	const rightPre = isSemverPrereleaseRaw(right.raw)
	if (leftPre === rightPre) return 0
	return leftPre ? -1 : 1
}
