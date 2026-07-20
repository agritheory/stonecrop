/**
 * Controls the level of user interaction for a field, container, or table.
 *
 * - `'edit'` — field is fully interactive; user can change the value
 * - `'read'` — field is non-interactive but displayed with form chrome (input outline, etc.)
 * - `'display'` — field is non-interactive and displayed as plain text; no form chrome
 *
 * Applied at authoring time via `mode` on any `DoctypeField` variant. Propagated through
 * `resolveSchema()` into the resolved output types. Nested `AForm` and `ATable` components
 * inherit `mode` from their parent unless overridden at the field level.
 *
 * @public
 */
export type InteractionMode = 'edit' | 'read' | 'display'
