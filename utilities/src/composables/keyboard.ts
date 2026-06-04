import { type WatchStopHandle, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useFocusWithin } from '@vueuse/core'

import { useElementVisibility } from './visibility'
import type { KeyboardNavigationOptions, KeypressHandlers } from '../types'

// helper functions
const isVisible = (element: HTMLElement) => {
	let visible = useElementVisibility(element).value
	visible = visible && element.offsetHeight > 0
	return visible
}

const isFocusable = (element: HTMLElement) => {
	return element.tabIndex >= 0
}

// navigation functions
const getUpCell = (event: KeyboardEvent) => {
	if (!(event.target instanceof HTMLElement)) return undefined
	return getUpCellEl(event.target)
}

const getUpCellEl = (element: HTMLElement): HTMLElement | undefined => {
	let $upCell: HTMLElement | undefined
	if (element instanceof HTMLTableCellElement) {
		const $prevSibling = element.parentElement?.previousElementSibling
		if ($prevSibling instanceof HTMLTableRowElement) {
			const $prevRowCells = Array.from($prevSibling.children)
			const $cellEl = $prevRowCells[element.cellIndex]
			if ($cellEl instanceof HTMLElement) {
				$upCell = $cellEl
			}
		}
	} else if (element instanceof HTMLTableRowElement) {
		const $prevSibling = element.previousElementSibling
		if ($prevSibling instanceof HTMLTableRowElement) {
			$upCell = $prevSibling
		}
	} else {
		// handle other contexts
	}
	if ($upCell && (!isFocusable($upCell) || !isVisible($upCell))) {
		return getUpCellEl($upCell)
	}
	return $upCell
}

const getTopCell = (event: KeyboardEvent) => {
	if (!(event.target instanceof HTMLElement)) return undefined
	const $target = event.target
	let $topCell: HTMLElement | undefined
	if ($target instanceof HTMLTableCellElement) {
		const $table = $target.parentElement?.parentElement
		if ($table) {
			const $firstRow = $table.firstElementChild
			const $navEl = $firstRow?.children[$target.cellIndex]
			if ($navEl instanceof HTMLElement) {
				$topCell = $navEl
			}
		}
	} else if ($target instanceof HTMLTableRowElement) {
		const $parent = $target.parentElement
		if ($parent) {
			const $firstEl = $parent.firstElementChild
			if ($firstEl instanceof HTMLTableRowElement) {
				$topCell = $firstEl
			}
		}
	} else {
		// handle other contexts
	}
	if ($topCell && (!isFocusable($topCell) || !isVisible($topCell))) {
		return getDownCellEl($topCell)
	}
	return $topCell
}

const getDownCell = (event: KeyboardEvent) => {
	if (!(event.target instanceof HTMLElement)) return undefined
	return getDownCellEl(event.target)
}

const getDownCellEl = (element: HTMLElement): HTMLElement | undefined => {
	let $downCell: HTMLElement | undefined
	if (element instanceof HTMLTableCellElement) {
		const $nextSibling = element.parentElement?.nextElementSibling
		if ($nextSibling) {
			const $nextRowCells = Array.from($nextSibling.children)
			const $cellEl = $nextRowCells[element.cellIndex]
			if ($cellEl instanceof HTMLElement) {
				$downCell = $cellEl
			}
		}
	} else if (element instanceof HTMLTableRowElement) {
		const $nextSibling = element.nextElementSibling
		if ($nextSibling instanceof HTMLTableRowElement) {
			$downCell = $nextSibling
		}
	} else {
		// handle other contexts
	}
	if ($downCell && (!isFocusable($downCell) || !isVisible($downCell))) {
		return getDownCellEl($downCell)
	}
	return $downCell
}

const getBottomCell = (event: KeyboardEvent) => {
	if (!(event.target instanceof HTMLElement)) return undefined
	const $target = event.target
	let $bottomCell: HTMLElement | undefined
	if ($target instanceof HTMLTableCellElement) {
		const $table = $target.parentElement?.parentElement
		if ($table) {
			const $lastRow = $table.lastElementChild
			const $navEl = $lastRow?.children[$target.cellIndex]
			if ($navEl instanceof HTMLElement) {
				$bottomCell = $navEl
			}
		}
	} else if ($target instanceof HTMLTableRowElement) {
		const $parent = $target.parentElement
		if ($parent) {
			const $lastEl = $parent.lastElementChild
			if ($lastEl instanceof HTMLTableRowElement) {
				$bottomCell = $lastEl
			}
		}
	} else {
		// handle other contexts
	}
	if ($bottomCell && (!isFocusable($bottomCell) || !isVisible($bottomCell))) {
		return getUpCellEl($bottomCell)
	}
	return $bottomCell
}

const getPrevCell = (event: KeyboardEvent) => {
	if (!(event.target instanceof HTMLElement)) return undefined
	return getPrevCellEl(event.target)
}

const getPrevCellEl = (element: HTMLElement): HTMLElement | undefined => {
	let $prevCell: HTMLElement | undefined
	const $prevSibling = element.previousElementSibling
	if ($prevSibling instanceof HTMLElement) {
		$prevCell = $prevSibling
	} else {
		const $prevRow = element.parentElement?.previousElementSibling
		const $lastEl = $prevRow?.lastElementChild
		if ($lastEl instanceof HTMLElement) {
			$prevCell = $lastEl
		}
	}
	if ($prevCell && (!isFocusable($prevCell) || !isVisible($prevCell))) {
		return getPrevCellEl($prevCell)
	}
	return $prevCell
}

const getNextCell = (event: KeyboardEvent) => {
	if (!(event.target instanceof HTMLElement)) return undefined
	return getNextCellEl(event.target)
}

const getNextCellEl = (element: HTMLElement): HTMLElement | undefined => {
	let $nextCell: HTMLElement | undefined
	const $nextSibling = element.nextElementSibling
	if ($nextSibling instanceof HTMLElement) {
		$nextCell = $nextSibling
	} else {
		const $nextRow = element.parentElement?.nextElementSibling
		const $firstEl = $nextRow?.firstElementChild
		if ($firstEl instanceof HTMLElement) {
			$nextCell = $firstEl
		}
	}
	if ($nextCell && (!isFocusable($nextCell) || !isVisible($nextCell))) {
		return getNextCellEl($nextCell)
	}
	return $nextCell
}

const getFirstCell = (event: KeyboardEvent) => {
	if (!(event.target instanceof HTMLElement)) return undefined
	const $parent = event.target.parentElement
	const $firstEl = $parent?.firstElementChild
	const $firstCell = $firstEl instanceof HTMLElement ? $firstEl : null
	if ($firstCell && (!isFocusable($firstCell) || !isVisible($firstCell))) {
		return getNextCellEl($firstCell)
	}
	return $firstCell
}

const getLastCell = (event: KeyboardEvent) => {
	if (!(event.target instanceof HTMLElement)) return undefined
	const $parent = event.target.parentElement
	const $lastEl = $parent?.lastElementChild
	const $lastCell = $lastEl instanceof HTMLElement ? $lastEl : null
	if ($lastCell && (!isFocusable($lastCell) || !isVisible($lastCell))) {
		return getPrevCellEl($lastCell)
	}
	return $lastCell
}

const modifierKeys = ['alt', 'control', 'shift', 'meta']

const eventKeyMap: Record<string, string> = {
	ArrowUp: 'up',
	ArrowDown: 'down',
	ArrowLeft: 'left',
	ArrowRight: 'right',
}

/**
 * Default keypress handlers for keyboard navigation
 * @public
 */
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
		if (!(event.target instanceof HTMLElement)) return
		const $target = event.target
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
		if (!(event.target instanceof HTMLElement)) return
		const $target = event.target
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

/**
 * Gets the parent element from a keyboard navigation option.
 * @internal
 */
function getParentElement(option: KeyboardNavigationOptions): HTMLElement | null {
	let $parent: HTMLElement | null = null
	if (option.parent) {
		if (typeof option.parent === 'string') {
			$parent = document.querySelector(option.parent)
		} else if (option.parent instanceof HTMLElement) {
			$parent = option.parent
		} else {
			$parent = option.parent.value
		}
	}
	return $parent
}

/**
 * Keyboard navigation composable
 * @param options - Keyboard navigation options
 * @public
 */
export function useKeyboardNav(options: KeyboardNavigationOptions[]) {
	const getSelectorsFromOption = (option: KeyboardNavigationOptions) => {
		// assumes that option.selectors is provided
		const $parent = getParentElement(option)
		let selectors: HTMLElement[] = []
		if (typeof option.selectors === 'string') {
			selectors = $parent
				? Array.from($parent.querySelectorAll(option.selectors))
				: Array.from(document.querySelectorAll(option.selectors))
		} else if (Array.isArray(option.selectors)) {
			for (const element of option.selectors) {
				if (element instanceof HTMLElement) {
					selectors.push(element)
				} else {
					// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Vue component $el is typed as any; shape guaranteed by VNode contract
					selectors.push(element.$el as HTMLElement)
				}
			}
		} else if (option.selectors instanceof HTMLElement) {
			selectors.push(option.selectors)
		} else if (option.selectors?.value) {
			if (Array.isArray(option.selectors.value)) {
				for (const element of option.selectors.value) {
					if (element instanceof HTMLElement) {
						selectors.push(element)
					} else {
						// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Vue component $el is typed as any; shape guaranteed by VNode contract
						selectors.push(element.$el as HTMLElement)
					}
				}
			} else {
				selectors.push(option.selectors.value)
			}
		}
		return selectors
	}

	const getSelectors = (option: KeyboardNavigationOptions) => {
		const $parent = getParentElement(option)
		let selectors: HTMLElement[] = []
		if (option.selectors) {
			selectors = getSelectorsFromOption(option)
		} else if ($parent) {
			// TODO: what should happen if no parent or selectors are provided?
			const $children = Array.from($parent.children).filter((el): el is HTMLElement => el instanceof HTMLElement)
			selectors = $children.filter(selector => {
				// ignore elements not in the tab order or are not visible
				return isFocusable(selector) && isVisible(selector)
			})
		}
		return selectors
	}

	const getEventListener = (option: KeyboardNavigationOptions) => {
		return (event: KeyboardEvent) => {
			const activeKey = eventKeyMap[event.key] || event.key.toLowerCase()
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
					const hasModifier = keys.filter(k => modifierKeys.includes(k))
					const isModifierActive = modifierKeys.some(mk => {
						const modifierKey = mk.charAt(0).toUpperCase() + mk.slice(1)
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

	const watchStopHandlers: WatchStopHandle[] = []
	onMounted(() => {
		for (const option of options) {
			const $parent = getParentElement(option)
			const selectors = getSelectors(option)
			const listener = getEventListener(option)
			const listenerElements = $parent
				? [$parent] // watch for focus recursively within the parent element
				: selectors // watch for focus on each selector element TODO: too much JS?

			for (const element of listenerElements) {
				const { focused } = useFocusWithin(ref(element))
				const stopHandler = watch(focused, value => {
					if (value) {
						element.addEventListener('keydown', listener)
					} else {
						element.removeEventListener('keydown', listener)
					}
				})
				watchStopHandlers.push(stopHandler)
			}
		}
	})

	onBeforeUnmount(() => {
		for (const stopHandler of watchStopHandlers) {
			stopHandler()
		}
	})
}
