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
 * `+ - * / %` and parentheses, plus the given separators. Exponents (`e`, `^`) and any other letter are refused.
 * @public
 */
export function arithmeticEntryPattern(separators: NumberSeparators = {}): RegExp {
	const marks = [separators.group, separators.decimal].filter(Boolean).map(mark => escapeMark(mark!))
	return new RegExp(`^[\\d.\\s+\\-*/%()${marks.join('')}]*$`)
}

/**
 * Whether a single typed character may go into an arithmetic number box.
 * @public
 */
export function isArithmeticKey(key: string, separators: NumberSeparators = {}): boolean {
	return key.length === 1 && arithmeticEntryPattern(separators).test(key)
}

/**
 * Evaluate the arithmetic typed into a number box: `12*3+4` is `40`. Supports `+ - * / %` (remainder, as
 * JavaScript's `%`), parentheses, signed numbers and decimals; nothing else, so no exponents, functions or names.
 *
 * The result is rounded to 15 significant digits to shed binary floating-point noise (`0.1*3` is `0.3`, not
 * `0.30000000000000004`).
 *
 * @param text - The box's text
 * @param separators - The marks the box writes numbers with; a plain `.` decimal point with no grouping when omitted
 * @returns The number, or null when the text is empty or no well-formed expression (`12*`, `(3`, `5/0`)
 * @public
 */
export function evaluateArithmetic(text: string, separators: NumberSeparators = {}): number | null {
	let source = text.replace(/\s/g, '')
	if (separators.group && separators.group !== separators.decimal) source = source.replaceAll(separators.group, '')
	if (separators.decimal && separators.decimal !== '.') source = source.replaceAll(separators.decimal, '.')
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
