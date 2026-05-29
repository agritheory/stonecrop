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
// T is intentionally a caller-supplied return type — this utility is unsafe by design (Function constructor).
// oxlint-disable-next-line typescript/no-unnecessary-type-parameters
export function deserializeFunction<T extends (...args: any[]) => any>(source: string): T {
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion, typescript/no-implied-eval
	return Function(`"use strict"; return (${source})`)() as T
}
