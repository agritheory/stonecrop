/**
 * Icon exports for ATable row actions.
 * Icons are exported as raw SVG strings for flexibility in rendering.
 * @packageDocumentation
 */

// @ts-expect-error Vite raw import
import AddIcon from './stonecrop-ui-icon-add.svg?raw'
// @ts-expect-error Vite raw import
import DeleteIcon from './stonecrop-ui-icon-delete.svg?raw'
// @ts-expect-error Vite raw import
import DuplicateIcon from './stonecrop-ui-icon-duplicate.svg?raw'
// @ts-expect-error Vite raw import
import InsertAboveIcon from './stonecrop-ui-icon-insert-above.svg?raw'
// @ts-expect-error Vite raw import
import InsertBelowIcon from './stonecrop-ui-icon-insert-below.svg?raw'
// @ts-expect-error Vite raw import
import MoveIcon from './stonecrop-ui-icon-move.svg?raw'

export { AddIcon, DeleteIcon, DuplicateIcon, InsertAboveIcon, InsertBelowIcon, MoveIcon }

/**
 * Map of action types to their default icons.
 */
export const actionIcons: Record<string, string> = {
	add: AddIcon as string,
	delete: DeleteIcon as string,
	duplicate: DuplicateIcon as string,
	insertAbove: InsertAboveIcon as string,
	insertBelow: InsertBelowIcon as string,
	move: MoveIcon as string,
}
