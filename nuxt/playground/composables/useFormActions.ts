import type { ActionElements } from '../../../desktop/src/types'

export interface FormActionConfig {
	label: string
	disabled?: boolean
	show?: boolean
}

export interface FormActionsConfig {
	save?: FormActionConfig
	cancel?: FormActionConfig
	undo?: FormActionConfig
	redo?: FormActionConfig
}

// Store action handlers separately (not in useState to avoid serialization)
const actionHandlers = new Map<string, () => void | Promise<void>>()

/**
 * Composable to manage form actions that will be displayed in the ActionSet toolbar
 * Pages can set their form actions, and the layout will display them
 *
 * Note: We store only serializable config in useState, and keep function handlers
 * in a separate Map to avoid Nuxt's serialization issues with SSR
 */
export function useFormActions() {
	// Only store serializable config in useState
	const formActionsConfig = useState<FormActionsConfig>('formActionsConfig', () => ({}))

	const setFormActions = (actions: {
		save?: { action: () => void | Promise<void>; disabled?: boolean }
		cancel?: { action: () => void | Promise<void>; disabled?: boolean }
		undo?: { action: () => void | Promise<void>; disabled?: boolean }
		redo?: { action: () => void | Promise<void>; disabled?: boolean }
	}) => {
		// Store config (serializable)
		formActionsConfig.value = {
			save: actions.save ? { label: 'Save', disabled: actions.save.disabled, show: true } : undefined,
			cancel: actions.cancel ? { label: 'Cancel', disabled: actions.cancel.disabled, show: true } : undefined,
			undo: actions.undo ? { label: 'Undo', disabled: actions.undo.disabled, show: true } : undefined,
			redo: actions.redo ? { label: 'Redo', disabled: actions.redo.disabled, show: true } : undefined,
		}

		// Store handlers separately (not serialized)
		if (actions.save?.action) actionHandlers.set('save', actions.save.action)
		if (actions.cancel?.action) actionHandlers.set('cancel', actions.cancel.action)
		if (actions.undo?.action) actionHandlers.set('undo', actions.undo.action)
		if (actions.redo?.action) actionHandlers.set('redo', actions.redo.action)
	}

	const clearFormActions = () => {
		formActionsConfig.value = {}
		actionHandlers.clear()
	}

	const getActionSetElements = (): ActionElements[] => {
		const elements: ActionElements[] = []
		const config = formActionsConfig.value

		// Undo button
		if (config.undo && config.undo.show !== false) {
			const handler = actionHandlers.get('undo')
			if (handler) {
				elements.push({
					type: 'button',
					label: '↶ Undo',
					action: handler,
					disabled: config.undo.disabled,
				})
			}
		}

		// Redo button
		if (config.redo && config.redo.show !== false) {
			const handler = actionHandlers.get('redo')
			if (handler) {
				elements.push({
					type: 'button',
					label: '↷ Redo',
					action: handler,
					disabled: config.redo.disabled,
				})
			}
		}

		// Cancel button
		if (config.cancel && config.cancel.show !== false) {
			const handler = actionHandlers.get('cancel')
			if (handler) {
				elements.push({
					type: 'button',
					label: 'Cancel',
					action: handler,
					disabled: config.cancel.disabled,
				})
			}
		}

		// Save button
		if (config.save && config.save.show !== false) {
			const handler = actionHandlers.get('save')
			if (handler) {
				elements.push({
					type: 'button',
					label: 'Save',
					action: handler,
					disabled: config.save.disabled,
				})
			}
		}

		return elements
	}

	return {
		formActionsConfig,
		setFormActions,
		clearFormActions,
		getActionSetElements,
	}
}
