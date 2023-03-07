import { onMounted, onBeforeUnmount } from 'vue'
import { useElementVisibility } from '@vueuse/core'

import type { KeyboardNavigationOptions, KeypressHandlers } from 'types'

// helper functions
const isVisible = (element: HTMLElement) => {
	let isVisible = useElementVisibility(element).value
	isVisible = isVisible && element.offsetHeight > 0
	return isVisible
}

const isFocusable = (element: HTMLElement) => {
	return element.tabIndex >= 0
}

// navigation functions
const getUpCell = (event: KeyboardEvent) => {
	const $target = event.target as HTMLElement
	return _getUpCell($target)
}

const _getUpCell = (element: HTMLElement): HTMLElement | undefined => {
	let $upCell: HTMLElement | undefined
	if (element instanceof HTMLTableCellElement) {
		const $prevRow = element.parentElement?.previousElementSibling as HTMLTableRowElement
		if ($prevRow) {
			const $prevRowCells = Array.from($prevRow.children)
			const $prevCell = $prevRowCells[element.cellIndex] as HTMLElement
			if ($prevCell) {
				$upCell = $prevCell
			}
		}
	} else if (element instanceof HTMLTableRowElement) {
		const $prevRow = element.previousElementSibling as HTMLTableRowElement
		if ($prevRow) {
			$upCell = $prevRow
		}
	} else {
		// handle other contexts
	}
	if ($upCell && (!isFocusable($upCell) || !isVisible($upCell))) {
		return _getUpCell($upCell)
	}
	return $upCell
}

const getTopCell = (event: KeyboardEvent) => {
	const $target = event.target as HTMLElement
	let $topCell: HTMLElement | undefined
	if ($target instanceof HTMLTableCellElement) {
		const $table = $target.parentElement?.parentElement
		if ($table) {
			const $firstRow = $table.firstElementChild
			const $navCell = $firstRow.children[$target.cellIndex] as HTMLElement
			if ($navCell) {
				$topCell = $navCell
			}
		}
	} else if ($target instanceof HTMLTableRowElement) {
		const $table = $target.parentElement as HTMLTableElement
		if ($table) {
			const $firstRow = $table.firstElementChild as HTMLTableRowElement
			if ($firstRow) {
				$topCell = $firstRow
			}
		}
	} else {
		// handle other contexts
	}
	if ($topCell && (!isFocusable($topCell) || !isVisible($topCell))) {
		return _getDownCell($topCell)
	}
	return $topCell
}

const getDownCell = (event: KeyboardEvent) => {
	const $target = event.target as HTMLElement
	return _getDownCell($target)
}

const _getDownCell = (element: HTMLElement): HTMLElement | undefined => {
	let $downCell: HTMLElement | undefined
	if (element instanceof HTMLTableCellElement) {
		const $nextRow = element.parentElement?.nextElementSibling
		if ($nextRow) {
			const $nextRowCells = Array.from($nextRow.children)
			const $nextCell = $nextRowCells[element.cellIndex] as HTMLElement
			if ($nextCell) {
				$downCell = $nextCell
			}
		}
	} else if (element instanceof HTMLTableRowElement) {
		const $nextRow = element.nextElementSibling as HTMLTableRowElement
		if ($nextRow) {
			$downCell = $nextRow
		}
	} else {
		// handle other contexts
	}
	if ($downCell && (!isFocusable($downCell) || !isVisible($downCell))) {
		return _getDownCell($downCell)
	}
	return $downCell
}

const getBottomCell = (event: KeyboardEvent) => {
	const $target = event.target as HTMLElement
	let $bottomCell: HTMLElement | undefined
	if ($target instanceof HTMLTableCellElement) {
		const $table = $target.parentElement?.parentElement
		if ($table) {
			const $lastRow = $table.lastElementChild
			const $navCell = $lastRow.children[$target.cellIndex] as HTMLElement
			if ($navCell) {
				$bottomCell = $navCell
			}
		}
	} else if ($target instanceof HTMLTableRowElement) {
		const $table = $target.parentElement as HTMLTableElement
		if ($table) {
			const $lastRow = $table.lastElementChild as HTMLTableRowElement
			if ($lastRow) {
				$bottomCell = $lastRow
			}
		}
	} else {
		// handle other contexts
	}
	if ($bottomCell && (!isFocusable($bottomCell) || !isVisible($bottomCell))) {
		return _getUpCell($bottomCell)
	}
	return $bottomCell
}

const getPrevCell = (event: KeyboardEvent) => {
	const $target = event.target as HTMLElement
	return _getPrevCell($target)
}

const _getPrevCell = (element: HTMLElement): HTMLElement | undefined => {
	let $prevCell: HTMLElement | undefined
	if (element.previousElementSibling) {
		$prevCell = element.previousElementSibling as HTMLElement
	} else {
		const $prevRow = element.parentElement?.previousElementSibling
		$prevCell = $prevRow?.lastElementChild as HTMLElement
	}
	if ($prevCell && (!isFocusable($prevCell) || !isVisible($prevCell))) {
		return _getPrevCell($prevCell)
	}
	return $prevCell
}

const getNextCell = (event: KeyboardEvent) => {
	const $target = event.target as HTMLElement
	return _getNextCell($target)
}

const _getNextCell = (element: HTMLElement): HTMLElement | undefined => {
	let $nextCell: HTMLElement | undefined
	if (element.nextElementSibling) {
		$nextCell = element.nextElementSibling as HTMLElement
	} else {
		const $nextRow = element.parentElement?.nextElementSibling
		$nextCell = $nextRow?.firstElementChild as HTMLElement
	}
	if ($nextCell && (!isFocusable($nextCell) || !isVisible($nextCell))) {
		return _getNextCell($nextCell)
	}
	return $nextCell
}

const getFirstCell = (event: KeyboardEvent) => {
	const $target = event.target as HTMLElement
	const $parent = $target.parentElement
	const $firstCell = $parent.firstElementChild as HTMLElement | null
	if ($firstCell && (!isFocusable($firstCell) || !isVisible($firstCell))) {
		return _getNextCell($firstCell)
	}
	return $firstCell
}

const getLastCell = (event: KeyboardEvent) => {
	const $target = event.target as HTMLElement
	const $parent = $target.parentElement
	const $lastCell = $parent.lastElementChild as HTMLElement | null
	if ($lastCell && (!isFocusable($lastCell) || !isVisible($lastCell))) {
		return _getPrevCell($lastCell)
	}
	return $lastCell
}

const modifierKeys = ['alt', 'control', 'shift', 'meta']

const eventKeyMap = {
	ArrowUp: 'up',
	ArrowDown: 'down',
	ArrowLeft: 'left',
	ArrowRight: 'right',
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
		// prevent default edit-cell behaviour on first cell
		event.preventDefault()
		event.stopPropagation()
		if ($prevCell) {
			$prevCell.focus()
		}
	},
	'keydown.right': (event: KeyboardEvent) => {
		const $nextCell = getNextCell(event)
		// prevent default edit-cell behaviour on last cell
		event.preventDefault()
		event.stopPropagation()
		if ($nextCell) {
			$nextCell.focus()
		}
	},
	'keydown.control.up': (event: KeyboardEvent) => {
		const $topCell = getTopCell(event)
		if ($topCell) {
			event.preventDefault()
			event.stopPropagation()
			$topCell.focus()
		}
	},
	'keydown.control.down': (event: KeyboardEvent) => {
		const $bottomCell = getBottomCell(event)
		if ($bottomCell) {
			event.preventDefault()
			event.stopPropagation()
			$bottomCell.focus()
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
		const $target = event.target as HTMLElement
		if ($target instanceof HTMLTableCellElement) {
			event.preventDefault()
			event.stopPropagation()
			const $downCell = getDownCell(event)
			if ($downCell) {
				$downCell.focus()
			}
		} else {
			// handle other contexts
		}
	},
	'keydown.shift.enter': (event: KeyboardEvent) => {
		const $target = event.target as HTMLElement
		if ($target instanceof HTMLTableCellElement) {
			event.preventDefault()
			event.stopPropagation()
			const $upCell = getUpCell(event)
			if ($upCell) {
				$upCell.focus()
			}
		} else {
			// handle other contexts
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
			const $children = Array.from($parent.children)
			selectors = $children.filter((selector: HTMLElement) => {
				// ignore elements not in the tab order or are not visible
				return isFocusable(selector) && isVisible(selector)
			})
		}

		return selectors
	}

	const getEventListener = (option: KeyboardNavigationOptions) => {
		return (event: KeyboardEvent) => {
			const activeKey = (eventKeyMap[event.key] as string) || event.key.toLowerCase()
			if (modifierKeys.includes(activeKey)) return // ignore modifier key presses

			const handlers = option.handlers || defaultKeypressHandlers
			for (const key of Object.keys(handlers)) {
				const [eventType, ...keys] = key.split('.')
				if (eventType !== 'keydown') {
					continue
				}

				if (keys.includes(activeKey)) {
					const listener = handlers[key]

					// check if the handler has modifiers, and if the modifier is active;
					// this is to ensure exact key-press matches
					const hasModifier = keys.filter(key => modifierKeys.includes(key))
					const isModifierActive = modifierKeys.some(key => {
						const modifierKey = key.charAt(0).toUpperCase() + key.slice(1)
						return event.getModifierState(modifierKey)
					})

					if (hasModifier.length > 0) {
						if (isModifierActive) {
							for (const modifier of modifierKeys) {
								if (keys.includes(modifier)) {
									// docs: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
									const modifierKey = modifier.charAt(0).toUpperCase() + modifier.slice(1)
									if (event.getModifierState(modifierKey)) {
										listener(event)
									}
								}
							}
						}
					} else {
						if (!isModifierActive) {
							listener(event)
						}
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

	onBeforeUnmount(() => {
		for (const option of options) {
			const selectors = getSelectors(option)
			for (const selector of selectors) {
				selector.removeEventListener('keydown', getEventListener(option))
			}
		}
	})
}
