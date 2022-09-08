import { onMounted, onUnmounted } from "vue";
const getUpCell = (event) => {
  var _a;
  const target = event.target;
  let $upCell;
  if (target instanceof HTMLTableCellElement) {
    const $prevRow = (_a = target.parentElement) == null ? void 0 : _a.previousElementSibling;
    if ($prevRow) {
      const $prevRowCells = Array.from($prevRow.children);
      const $prevCell = $prevRowCells[target.cellIndex];
      if ($prevCell) {
        $upCell = $prevCell;
      }
    }
  }
  return $upCell;
};
const getDownCell = (event) => {
  var _a;
  const target = event.target;
  let $downCell;
  if (target instanceof HTMLTableCellElement) {
    const $nextRow = (_a = target.parentElement) == null ? void 0 : _a.nextElementSibling;
    if ($nextRow) {
      const $nextRowCells = Array.from($nextRow.children);
      const $nextCell = $nextRowCells[target.cellIndex];
      if ($nextCell) {
        $downCell = $nextCell;
      }
    }
  }
  return $downCell;
};
const getPrevCell = (event) => {
  var _a;
  const target = event.target;
  let $prevCell;
  if (target.previousElementSibling) {
    $prevCell = target.previousElementSibling;
  } else {
    const $prevRow = (_a = target.parentElement) == null ? void 0 : _a.previousElementSibling;
    if ($prevRow) {
      const $prevRowCells = Array.from($prevRow.children);
      $prevRowCells.reverse();
      $prevCell = $prevRowCells[0];
    }
  }
  return $prevCell;
};
const getNextCell = (event) => {
  var _a;
  const target = event.target;
  let $nextCell;
  if (target.nextElementSibling) {
    $nextCell = target.nextElementSibling;
  } else {
    const $nextRow = (_a = target.parentElement) == null ? void 0 : _a.nextElementSibling;
    if ($nextRow) {
      const $nextRowCells = Array.from($nextRow.children);
      $nextCell = $nextRowCells[0];
    }
  }
  return $nextCell;
};
const getFirstCell = (event) => {
  const target = event.target;
  const $parent = target.parentElement;
  const $firstCell = $parent.firstElementChild;
  return $firstCell;
};
const getLastCell = (event) => {
  const target = event.target;
  const $parent = target.parentElement;
  const $lastCell = $parent.lastElementChild;
  return $lastCell;
};
const modifierKeys = ["alt", "control", "shift", "meta"];
const eventKeyMap = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  Home: "home",
  End: "end",
  Enter: "enter",
  Tab: "tab"
};
const defaultKeypressHandlers = {
  "keydown.up": (event) => {
    const $upCell = getUpCell(event);
    if ($upCell) {
      event.preventDefault();
      event.stopPropagation();
      $upCell.focus();
    }
  },
  "keydown.down": (event) => {
    const $downCell = getDownCell(event);
    if ($downCell) {
      event.preventDefault();
      event.stopPropagation();
      $downCell.focus();
    }
  },
  "keydown.left": (event) => {
    const $prevCell = getPrevCell(event);
    if ($prevCell) {
      event.preventDefault();
      event.stopPropagation();
      $prevCell.focus();
    }
  },
  "keydown.right": (event) => {
    const $nextCell = getNextCell(event);
    if ($nextCell) {
      event.preventDefault();
      event.stopPropagation();
      $nextCell.focus();
    }
  },
  "keydown.control.left": (event) => {
    const $firstCell = getFirstCell(event);
    if ($firstCell) {
      event.preventDefault();
      event.stopPropagation();
      $firstCell.focus();
    }
  },
  "keydown.control.right": (event) => {
    const $lastCell = getLastCell(event);
    if ($lastCell) {
      event.preventDefault();
      event.stopPropagation();
      $lastCell.focus();
    }
  },
  "keydown.end": (event) => {
    const $lastCell = getLastCell(event);
    if ($lastCell) {
      event.preventDefault();
      event.stopPropagation();
      $lastCell.focus();
    }
  },
  "keydown.enter": (event) => {
    const target = event.target;
    if (target instanceof HTMLTableCellElement) {
      const $downCell = getDownCell(event);
      if ($downCell) {
        event.preventDefault();
        event.stopPropagation();
        $downCell.focus();
      }
    }
  },
  "keydown.shift.enter": (event) => {
    const target = event.target;
    if (target instanceof HTMLTableCellElement) {
      const $upCell = getUpCell(event);
      if ($upCell) {
        event.preventDefault();
        event.stopPropagation();
        $upCell.focus();
      }
    }
  },
  "keydown.home": (event) => {
    const $firstCell = getFirstCell(event);
    if ($firstCell) {
      event.preventDefault();
      event.stopPropagation();
      $firstCell.focus();
    }
  },
  "keydown.tab": (event) => {
    const $nextCell = getNextCell(event);
    if ($nextCell) {
      event.preventDefault();
      event.stopPropagation();
      $nextCell.focus();
    }
  },
  "keydown.shift.tab": (event) => {
    const $prevCell = getPrevCell(event);
    if ($prevCell) {
      event.preventDefault();
      event.stopPropagation();
      $prevCell.focus();
    }
  }
};
function useKeyboardNav(options) {
  const getSelectors = (option) => {
    let $parent = null;
    if (option.parent) {
      if (typeof option.parent === "string") {
        $parent = document.querySelector(option.parent);
      } else if (option.parent instanceof Element) {
        $parent = option.parent;
      } else {
        $parent = option.parent.value;
      }
    }
    let selectors = [];
    if (option.selectors) {
      if (typeof option.selectors === "string") {
        selectors = $parent ? Array.from($parent.querySelectorAll(option.selectors)) : Array.from(document.querySelectorAll(option.selectors));
      } else if (option.selectors instanceof Element) {
        selectors.push(option.selectors);
      } else {
        if (Array.isArray(option.selectors.value)) {
          for (const element of option.selectors.value) {
            if (element instanceof Element) {
              selectors.push(element);
            } else {
              selectors.push(element.$el);
            }
          }
        } else {
          selectors.push(option.selectors.value);
        }
      }
    }
    return selectors;
  };
  const getEventListener = (option) => {
    return (event) => {
      const activeKey = eventKeyMap[event.key];
      if (!activeKey) {
        return;
      }
      for (const key of Object.keys(option.handlers)) {
        const [eventType, ...keys] = key.split(".");
        if (eventType !== "keydown") {
          continue;
        }
        if (keys.includes(activeKey)) {
          const listener = option.handlers[key];
          const hasModifier = keys.filter((key2) => modifierKeys.includes(key2));
          if (hasModifier.length > 0) {
            for (const modifier of modifierKeys) {
              if (keys.includes(modifier)) {
                const modifierKey = modifier.charAt(0).toUpperCase() + modifier.slice(1);
                const isModifierActive = event.getModifierState(modifierKey);
                if (isModifierActive) {
                  listener(event);
                }
              }
            }
          } else {
            listener(event);
          }
        }
      }
    };
  };
  onMounted(() => {
    for (const option of options) {
      const selectors = getSelectors(option);
      for (const selector of selectors) {
        selector.addEventListener("keydown", getEventListener(option));
      }
    }
  });
  onUnmounted(() => {
    for (const option of options) {
      const selectors = getSelectors(option);
      for (const selector of selectors) {
        selector.removeEventListener("keydown", getEventListener(option));
      }
    }
  });
}
function install(app) {
}
export {
  defaultKeypressHandlers,
  install,
  useKeyboardNav
};
