/**
 * The record a form is editing, read and set by field name. Setting a field runs that field's
 * rules, whether the record is saved or not saved yet.
 *
 * @public
 */
export interface EditableRecord {
	/** Reads a field, or the whole record when `fieldname` is `''` */
	get(fieldname: string): any
	/** Sets a field, which runs that field's rules */
	set(fieldname: string, value: any): void
}
