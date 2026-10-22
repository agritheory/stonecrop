/**
 * Generate a UUID version 7 (time-ordered) string without an external dependency.
 * @public
 */
export function createUuidv7(now: Date = new Date()): string {
	const ms = BigInt(now.getTime())
	const rand = crypto.getRandomValues(new Uint8Array(10))

	const timeHex = ms.toString(16).padStart(12, '0').slice(-12)
	const randHex = Array.from(rand, b => b.toString(16).padStart(2, '0')).join('')

	const g = `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}`
	const h = `7${randHex.slice(0, 3)}`
	const i = `${((parseInt(randHex.slice(3, 5), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0')}${randHex.slice(5, 7)}`
	const j = randHex.slice(7, 19)

	return `${g}-${h}-${i}-${j}`
}
