/**
 * Split an `orderBy` value into the field it names and its direction. The form is `FIELD_ASC` or
 * `FIELD_DESC`, the direction in either case, and the field is everything before the last underscore,
 * so a field name may hold underscores of its own.
 *
 * The one reading of the form: the list query takes it from its caller, and a link declares it for its
 * rows, where the load gate refuses a malformed one before any record is read.
 *
 * A module of its own, importing nothing, so the adapter can call it without taking on Zod.
 *
 * @param orderBy - the value to read, such as `rowOrder_ASC`
 * @returns the fieldname and the direction, upper-cased
 * @throws Error when there is no direction suffix, or it is neither ASC nor DESC
 * @public
 */
export function parseOrderBy(orderBy: string): { fieldname: string; direction: 'ASC' | 'DESC' } {
	const lastUnder = orderBy.lastIndexOf('_')
	if (lastUnder <= 0) {
		throw new Error(`Invalid orderBy format: "${orderBy}". Expected FIELD_ASC or FIELD_DESC`)
	}
	const direction = orderBy.slice(lastUnder + 1).toUpperCase()
	if (direction !== 'ASC' && direction !== 'DESC') {
		throw new Error(`Invalid orderBy direction: "${direction}". Must be ASC or DESC`)
	}
	return { fieldname: orderBy.slice(0, lastUnder), direction }
}
