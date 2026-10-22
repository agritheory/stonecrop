/**
 * The marks a number box writes numbers with. The decimal mark is read as the decimal point and the group mark is
 * dropped, so `1.000,5*2` reads as `1000.5*2` with German separators.
 * @public
 */
export type NumberSeparators = {
	group?: string
	decimal?: string
}

// Deep enough for any expression typed by hand, shallow enough that `((((…` can't exhaust the stack.
const MAX_DEPTH = 64

const escapeMark = (mark: string) => mark.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')

/**
 * What an arithmetic number box may hold while it is typed in: digits, a decimal point, whitespace,
 * `+ - * / %` and parentheses, plus the given separators, after an optional leading `=` (as a spreadsheet formula
 * starts). Exponents (`e`, `^`) and any other letter are refused, and so is `=` anywhere but first.
 * @public
 */
export function arithmeticEntryPattern(separators: NumberSeparators = {}): RegExp {
	const marks = [separators.group, separators.decimal].filter(Boolean).map(mark => escapeMark(mark!))
	return new RegExp(`^\\s*=?[\\d.\\s+\\-*/%()${marks.join('')}]*$`)
}

/**
 * Whether every number in the text is written as the box writes numbers: grouping marks only in the whole part, then
 * at most one decimal mark, and none at all where the field carries no decimals. "1.234,56" in English is no number
 * (grouping after the decimal point), and neither is "1.2.3".
 */
function numbersWellFormed(text: string, separators: NumberSeparators, fractionDigits?: number): boolean {
	const decimal = separators.decimal ?? '.'
	const group = separators.group && separators.group !== decimal ? separators.group : undefined
	const d = escapeMark(decimal)
	const g = group ? escapeMark(group) : ''
	const whole = group ? `\\d[\\d${g}]*` : '\\d+'
	const number = new RegExp(fractionDigits === 0 ? `^${whole}$` : `^(?:${whole})?(?:${d}\\d*)?$`)
	const tokens = text.match(new RegExp(`[\\d${d}${g}]+`, 'g')) ?? []
	return tokens.every(token => number.test(token))
}

/**
 * Whether an arithmetic number box may hold `text` while it is typed in: what {@link arithmeticEntryPattern} allows,
 * with each number in it well formed (grouping marks only in the whole part, then at most one decimal mark).
 * @param fractionDigits - The field's decimal places; at `0` (as for JPY) a decimal mark is refused
 * @public
 */
export function isArithmeticEntry(text: string, separators: NumberSeparators = {}, fractionDigits?: number): boolean {
	return arithmeticEntryPattern(separators).test(text) && numbersWellFormed(text, separators, fractionDigits)
}

/**
 * Whether a single typed character may go into an arithmetic number box. `=` is one, though only as the box's first
 * character: check the box's text with {@link arithmeticEntryPattern} where the caret is known.
 * @public
 */
export function isArithmeticKey(key: string, separators: NumberSeparators = {}): boolean {
	return key.length === 1 && arithmeticEntryPattern(separators).test(key)
}

/**
 * Round a number to a field's decimal places, as a column with a fixed scale holds it: `3.3333333333333` at 2 is
 * `3.33`. A missing or unusable precision (not a whole number from 0 to 100) leaves the number as it is.
 * @public
 */
export function roundToPrecision(value: number, precision?: number): number {
	if (precision === undefined || !Number.isInteger(precision) || precision < 0 || precision > 100) return value
	return Number(value.toFixed(precision))
}

/**
 * Evaluate the arithmetic typed into a number box: `12*3+4` is `40`. Supports `+ - * / %` (remainder, as
 * JavaScript's `%`), parentheses, signed numbers and decimals; nothing else, so no exponents, functions or names.
 * A leading `=` or `+` is read as a spreadsheet reads it, so `=12*3` and `+12*3` are both `36`.
 *
 * The result is rounded to 15 significant digits to shed binary floating-point noise (`0.1*3` is `0.3`, not
 * `0.30000000000000004`).
 *
 * @param text - The box's text
 * @param separators - The marks the box writes numbers with; a plain `.` decimal point with no grouping when omitted
 * @returns The number, or null when the text is empty or no well-formed expression (`12*`, `(3`, `5/0`, or a number
 * written with the separators the other way round, as `1.234,56` in English)
 * @public
 */
export function evaluateArithmetic(text: string, separators: NumberSeparators = {}): number | null {
	if (!numbersWellFormed(text, separators)) return null
	let source = text.replace(/\s/g, '')
	if (separators.group && separators.group !== separators.decimal) source = source.replaceAll(separators.group, '')
	if (separators.decimal && separators.decimal !== '.') source = source.replaceAll(separators.decimal, '.')
	if (source.startsWith('=')) source = source.slice(1)
	if (source === '' || !/^[\d.+\-*/%()]*$/.test(source)) return null

	let pos = 0
	let depth = 0

	const fail = (): never => {
		throw new SyntaxError(`Not an arithmetic expression: ${text}`)
	}

	const peek = () => source[pos]

	const parseNumber = (): number => {
		const match = /^(?:\d+\.?\d*|\.\d+)/.exec(source.slice(pos))
		if (!match) return fail()
		pos += match[0].length
		return Number(match[0])
	}

	const parsePrimary = (): number => {
		if (peek() !== '(') return parseNumber()
		if (++depth > MAX_DEPTH) fail()
		pos++
		const value = parseSum()
		if (peek() !== ')') fail()
		pos++
		depth--
		return value
	}

	const parseUnary = (): number => {
		const sign = peek()
		if (sign !== '+' && sign !== '-') return parsePrimary()
		if (++depth > MAX_DEPTH) fail()
		pos++
		const value = parseUnary()
		depth--
		return sign === '-' ? -value : value
	}

	const parseProduct = (): number => {
		let value = parseUnary()
		for (let op = peek(); op === '*' || op === '/' || op === '%'; op = peek()) {
			pos++
			const right = parseUnary()
			value = op === '*' ? value * right : op === '/' ? value / right : value % right
		}
		return value
	}

	function parseSum(): number {
		let value = parseProduct()
		for (let op = peek(); op === '+' || op === '-'; op = peek()) {
			pos++
			const right = parseProduct()
			value = op === '+' ? value + right : value - right
		}
		return value
	}

	try {
		const value = parseSum()
		if (pos !== source.length || !Number.isFinite(value)) return null
		// `-0` reads as 0 in a box.
		return Number(value.toPrecision(15)) + 0
	} catch {
		return null
	}
}
