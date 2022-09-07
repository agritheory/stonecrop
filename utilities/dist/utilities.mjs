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
const defaultKeypressHandlers = {
  ArrowUp: {
    listener: (event) => {
      if (event.key === "ArrowUp") {
        const $upCell = getUpCell(event);
        if ($upCell) {
          event.preventDefault();
          event.stopPropagation();
          $upCell.focus();
        }
      }
    }
  },
  ArrowDown: {
    listener: (event) => {
      if (event.key === "ArrowDown") {
        const $downCell = getDownCell(event);
        if ($downCell) {
          event.preventDefault();
          event.stopPropagation();
          $downCell.focus();
        }
      }
    }
  },
  ArrowLeft: {
    listener: (event) => {
      if (event.key === "ArrowLeft") {
        const $prevCell = getPrevCell(event);
        if ($prevCell) {
          event.preventDefault();
          event.stopPropagation();
          $prevCell.focus();
        }
      }
    }
  },
  ArrowRight: {
    listener: (event) => {
      if (event.key === "ArrowRight") {
        const $nextCell = getNextCell(event);
        if ($nextCell) {
          event.preventDefault();
          event.stopPropagation();
          $nextCell.focus();
        }
      }
    }
  },
  End: {
    listener: (event) => {
      if (event.key === "End") {
        const $lastCell = getLastCell(event);
        if ($lastCell) {
          event.preventDefault();
          event.stopPropagation();
          $lastCell.focus();
        }
      }
    }
  },
  Enter: {
    listener: (event) => {
      if (event.key === "Enter") {
        const target = event.target;
        if (target instanceof HTMLTableCellElement) {
          let $navCell;
          if (event.shiftKey) {
            $navCell = getUpCell(event);
          } else {
            $navCell = getDownCell(event);
          }
          if ($navCell) {
            event.preventDefault();
            event.stopPropagation();
            $navCell.focus();
          }
        }
      }
    }
  },
  Home: {
    listener: (event) => {
      if (event.key === "Home") {
        const $firstCell = getFirstCell(event);
        if ($firstCell) {
          event.preventDefault();
          event.stopPropagation();
          $firstCell.focus();
        }
      }
    }
  },
  Tab: {
    listener: (event) => {
      if (event.key === "Tab") {
        let $navCell;
        if (event.shiftKey) {
          $navCell = getPrevCell(event);
        } else {
          $navCell = getNextCell(event);
        }
        if ($navCell) {
          event.preventDefault();
          event.stopPropagation();
          $navCell.focus();
        }
      }
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
  const getEventListener = (key, config) => {
    let eventListener, eventOptions;
    if (config.listener) {
      eventListener = config.listener;
      eventOptions = config.options;
    } else {
      const eventMap = defaultKeypressHandlers[key];
      if (eventMap) {
        if (!eventMap.listener) {
          throw new Error(`Missing default event listener for keypress: '${key}'`);
        }
        eventListener = eventMap.listener;
        eventOptions = eventMap.options;
      } else {
        throw new Error(`Missing default event map for keypress: '${key}'`);
      }
    }
    return { eventListener, eventOptions };
  };
  onMounted(() => {
    for (const option of options) {
      const selectors = getSelectors(option);
      if (selectors.length === 0) {
        continue;
      }
      for (const [key, config] of Object.entries(option.handlers)) {
        const { eventListener, eventOptions } = getEventListener(key, config);
        for (const element of selectors) {
          element.addEventListener("keydown", eventListener, eventOptions);
        }
      }
    }
  });
  onUnmounted(() => {
    for (const option of options) {
      const selectors = getSelectors(option);
      if (selectors.length === 0) {
        continue;
      }
      for (const [key, config] of Object.entries(option.handlers)) {
        const { eventListener, eventOptions } = getEventListener(key, config);
        for (const element of selectors) {
          element.removeEventListener("keydown", eventListener, eventOptions);
        }
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
