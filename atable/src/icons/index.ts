/**
 * Icon exports for ATable row actions.
 * Icons are exported as raw SVG strings for flexibility in rendering.
 * @packageDocumentation
 */

import AddIcon from './stonecrop-ui-icon-add.svg?raw'
import DeleteIcon from './stonecrop-ui-icon-delete.svg?raw'
import DuplicateIcon from './stonecrop-ui-icon-duplicate.svg?raw'
import InsertAboveIcon from './stonecrop-ui-icon-insert-above.svg?raw'
import InsertBelowIcon from './stonecrop-ui-icon-insert-below.svg?raw'
import MoveIcon from './stonecrop-ui-icon-move.svg?raw'

// Directional move icons are inline (no dedicated SVG asset): simple up/down chevrons.
const MoveUpIcon =
	'<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 13V3.5M4.5 7 8 3.5 11.5 7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const MoveDownIcon =
	'<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3v9.5M4.5 9 8 12.5 11.5 9" stroke-linecap="round" stroke-linejoin="round"/></svg>'

export { AddIcon, DeleteIcon, DuplicateIcon, InsertAboveIcon, InsertBelowIcon, MoveIcon }

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
}
