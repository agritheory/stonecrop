/**
 * Deserializes a stringified function expression into a typed callable.
 *
 * Throws if the string cannot be parsed as a function (SyntaxError) or if the
 * resulting expression is not callable (TypeError), or if the expression references
 * an undefined variable (ReferenceError). Callers are responsible for try/catch.
 *
 * @example
 * ```ts
 * const fn = deserializeFunction<(x: number) => number>('(x) => x * 2')
 * fn(5) // 10
 * ```
 * @public
 */
export function deserializeFunction<T extends (...args: any[]) => any>(source: string): T {
	// eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
	return Function(`"use strict"; return (${source})`)() as T
}
