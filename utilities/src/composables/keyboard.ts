import { onMounted, onUnmounted } from 'vue'

import { KeyboardNavigationOptions, KeypressHandlers } from 'types'

const getUpCell = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement
	let $upCell: HTMLElement | undefined
	if (target instanceof HTMLTableCellElement) {
		const $prevRow = target.parentElement?.previousElementSibling
		if ($prevRow) {
			const $prevRowCells = Array.from($prevRow.children)
			const $prevCell = $prevRowCells[target.cellIndex] as HTMLElement
			if ($prevCell) {
				$upCell = $prevCell
			}
		}
	} else {
		// TODO: handle other contexts
	}
	return $upCell
}

const getDownCell = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement
	let $downCell: HTMLElement | undefined
	if (target instanceof HTMLTableCellElement) {
		const $nextRow = target.parentElement?.nextElementSibling
		if ($nextRow) {
			const $nextRowCells = Array.from($nextRow.children)
			const $nextCell = $nextRowCells[target.cellIndex] as HTMLElement
			if ($nextCell) {
				$downCell = $nextCell
			}
		}
	} else {
		// TODO: handle other contexts
	}
	return $downCell
}

const getPrevCell = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement
	let $prevCell: HTMLElement | undefined
	if (target.previousElementSibling) {
		$prevCell = target.previousElementSibling as HTMLElement
	} else {
		const $prevRow = target.parentElement?.previousElementSibling
		if ($prevRow) {
			const $prevRowCells = Array.from($prevRow.children)
			$prevRowCells.reverse()
			$prevCell = $prevRowCells[0] as HTMLElement
		}
	}
	return $prevCell
}

const getNextCell = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement
	let $nextCell: HTMLElement | undefined
	if (target.nextElementSibling) {
		$nextCell = target.nextElementSibling as HTMLElement
	} else {
		const $nextRow = target.parentElement?.nextElementSibling
		if ($nextRow) {
			const $nextRowCells = Array.from($nextRow.children)
			$nextCell = $nextRowCells[0] as HTMLElement
		}
	}
	return $nextCell
}

const getFirstCell = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement
	const $parent = target.parentElement
	const $firstCell = $parent.firstElementChild as HTMLElement | null
	return $firstCell
}

const getLastCell = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement
	const $parent = target.parentElement
	const $lastCell = $parent.lastElementChild as HTMLElement | null
	return $lastCell
}

const modifierKeys = ['alt', 'control', 'shift', 'meta']

const eventKeyMap = {
	ArrowUp: 'up',
	ArrowDown: 'down',
	ArrowLeft: 'left',
	ArrowRight: 'right',
	Home: 'home',
	End: 'end',
	Enter: 'enter',
	Tab: 'tab',
}

export const defaultKeypressHandlers: KeypressHandlers = {
	'keydown.up': (event: KeyboardEvent) => {
		const $upCell = getUpCell(event)
		if ($upCell) {
			event.preventDefault()
			event.stopPropagation()
			$upCell.focus()
		}
	},
	'keydown.down': (event: KeyboardEvent) => {
		const $downCell = getDownCell(event)
		if ($downCell) {
			event.preventDefault()
			event.stopPropagation()
			$downCell.focus()
		}
	},
	'keydown.left': (event: KeyboardEvent) => {
		const $prevCell = getPrevCell(event)
		if ($prevCell) {
			event.preventDefault()
			event.stopPropagation()
			$prevCell.focus()
		}
	},
	'keydown.right': (event: KeyboardEvent) => {
		const $nextCell = getNextCell(event)
		if ($nextCell) {
			event.preventDefault()
			event.stopPropagation()
			$nextCell.focus()
		}
	},
	'keydown.control.left': (event: KeyboardEvent) => {
		const $firstCell = getFirstCell(event)
		if ($firstCell) {
			event.preventDefault()
			event.stopPropagation()
			$firstCell.focus()
		}
	},
	'keydown.control.right': (event: KeyboardEvent) => {
		const $lastCell = getLastCell(event)
		if ($lastCell) {
			event.preventDefault()
			event.stopPropagation()
			$lastCell.focus()
		}
	},
	'keydown.end': (event: KeyboardEvent) => {
		const $lastCell = getLastCell(event)
		if ($lastCell) {
			event.preventDefault()
			event.stopPropagation()
			$lastCell.focus()
		}
	},
	'keydown.enter': (event: KeyboardEvent) => {
		const target = event.target as HTMLElement
		if (target instanceof HTMLTableCellElement) {
			const $downCell = getDownCell(event)
			if ($downCell) {
				event.preventDefault()
				event.stopPropagation()
				$downCell.focus()
			}
		} else {
			// TODO: handle other contexts
		}
	},
	'keydown.shift.enter': (event: KeyboardEvent) => {
		const target = event.target as HTMLElement
		if (target instanceof HTMLTableCellElement) {
			const $upCell = getUpCell(event)
			if ($upCell) {
				event.preventDefault()
				event.stopPropagation()
				$upCell.focus()
			}
		} else {
			// TODO: handle other contexts
		}
	},
	'keydown.home': (event: KeyboardEvent) => {
		const $firstCell = getFirstCell(event)
		if ($firstCell) {
			event.preventDefault()
			event.stopPropagation()
			$firstCell.focus()
		}
	},
	'keydown.tab': (event: KeyboardEvent) => {
		const $nextCell = getNextCell(event)
		if ($nextCell) {
			event.preventDefault()
			event.stopPropagation()
			$nextCell.focus()
		}
	},
	'keydown.shift.tab': (event: KeyboardEvent) => {
		const $prevCell = getPrevCell(event)
		if ($prevCell) {
			event.preventDefault()
			event.stopPropagation()
			$prevCell.focus()
		}
	},
}

export function useKeyboardNav(options: KeyboardNavigationOptions[]) {
	const getSelectors = (option: KeyboardNavigationOptions) => {
		// get parent element
		let $parent: Element | null = null
		if (option.parent) {
			if (typeof option.parent === 'string') {
				$parent = document.querySelector(option.parent)
			} else if (option.parent instanceof Element) {
				$parent = option.parent
			} else {
				$parent = option.parent.value
			}
		}

		// generate a list of selector(s)
		let selectors: Element[] = []

		if (option.selectors) {
			if (typeof option.selectors === 'string') {
				selectors = $parent
					? Array.from($parent.querySelectorAll(option.selectors))
					: Array.from(document.querySelectorAll(option.selectors))
			} else if (option.selectors instanceof Element) {
				selectors.push(option.selectors)
			} else {
				if (Array.isArray(option.selectors.value)) {
					for (const element of option.selectors.value) {
						if (element instanceof Element) {
							selectors.push(element)
						} else {
							selectors.push(element.$el as Element)
						}
					}
				} else {
					selectors.push(option.selectors.value)
				}
			}
		} else {
			// TODO: get all visible elements under parent DOM tree
		}

		return selectors
	}

	const getEventListener = (option: KeyboardNavigationOptions) => {
		return (event: KeyboardEvent) => {
			// only allow limited set of keypresses
			const activeKey: string | undefined = eventKeyMap[event.key]
			if (!activeKey) {
				return
			}

			for (const key of Object.keys(option.handlers)) {
				const [eventType, ...keys] = key.split('.')
				if (eventType !== 'keydown') {
					continue
				}

				if (keys.includes(activeKey)) {
					const listener = option.handlers[key]

					// check if the handler has modifiers, and if the modifier is active;
					// this is to ensure exact key-press matches
					const hasModifier = keys.filter(key => modifierKeys.includes(key))
					if (hasModifier.length > 0) {
						for (const modifier of modifierKeys) {
							if (keys.includes(modifier)) {
								// docs: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
								const modifierKey = modifier.charAt(0).toUpperCase() + modifier.slice(1)
								const isModifierActive = event.getModifierState(modifierKey)
								if (isModifierActive) {
									listener(event)
								}
							}
						}
					} else {
						listener(event)
					}
				}
			}
		}
	}

	onMounted(() => {
		for (const option of options) {
			const selectors = getSelectors(option)
			for (const selector of selectors) {
				selector.addEventListener('keydown', getEventListener(option))
			}
		}
	})

	onUnmounted(() => {
		for (const option of options) {
			const selectors = getSelectors(option)
			for (const selector of selectors) {
				selector.removeEventListener('keydown', getEventListener(option))
			}
		}
	})
}
