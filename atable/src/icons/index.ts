/**
 * Icon exports for ATable row actions.
 * Icons are exported as raw SVG strings for flexibility in rendering.
 * @packageDocumentation
 */

import rawAddIcon from './stonecrop-ui-icon-add.svg?raw'
import rawDeleteIcon from './stonecrop-ui-icon-delete.svg?raw'
import rawDuplicateIcon from './stonecrop-ui-icon-duplicate.svg?raw'
import rawInsertAboveIcon from './stonecrop-ui-icon-insert-above.svg?raw'
import rawInsertBelowIcon from './stonecrop-ui-icon-insert-below.svg?raw'
import rawMoveIcon from './stonecrop-ui-icon-move.svg?raw'
import rawOpenIcon from './stonecrop-ui-icon-open.svg?raw'

// Annotated rather than re-exported directly. `?raw` is a Vite import and the .svg files are inlined
// at build time, so a declaration that infers its type from the import re-states that specifier — and
// the emitted `dist/src/icons/index.d.ts` then names seven modules the tarball does not contain.
/** Raw SVG for the add-row action. @public */
const AddIcon: string = rawAddIcon
/** Raw SVG for the delete-row action. @public */
const DeleteIcon: string = rawDeleteIcon
/** Raw SVG for the duplicate-row action. @public */
const DuplicateIcon: string = rawDuplicateIcon
/** Raw SVG for the insert-above action. @public */
const InsertAboveIcon: string = rawInsertAboveIcon
/** Raw SVG for the insert-below action. @public */
const InsertBelowIcon: string = rawInsertBelowIcon
/** Raw SVG for the move action. @public */
const MoveIcon: string = rawMoveIcon
/** Raw SVG for the open-record action. @public */
const OpenIcon: string = rawOpenIcon

// Directional move icons are inline (no dedicated SVG asset): simple up/down chevrons.
const MoveUpIcon =
	'<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 13V3.5M4.5 7 8 3.5 11.5 7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const MoveDownIcon =
	'<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3v9.5M4.5 9 8 12.5 11.5 9" stroke-linecap="round" stroke-linejoin="round"/></svg>'

export { AddIcon, DeleteIcon, DuplicateIcon, InsertAboveIcon, InsertBelowIcon, MoveIcon, OpenIcon }

/**
 * Map of action types to their default icons.
 *
 * @public
 */
export const actionIcons: Record<string, string> = {
	add: AddIcon,
	delete: DeleteIcon,
	duplicate: DuplicateIcon,
	insertAbove: InsertAboveIcon,
	insertBelow: InsertBelowIcon,
	move: MoveIcon,
	moveUp: MoveUpIcon,
	moveDown: MoveDownIcon,
	open: OpenIcon,
}
