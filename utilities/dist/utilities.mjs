import { onMounted, onUnmounted } from "vue";
const defaultKeyboardEvents = {
  ArrowUp: (event) => {
    var _a;
    const target = event.target;
    let $navCell;
    if (target instanceof HTMLTableCellElement) {
      const $prevRow = (_a = target.parentElement) == null ? void 0 : _a.previousElementSibling;
      if ($prevRow) {
        const $prevRowCells = Array.from($prevRow.children);
        const $prevCell = $prevRowCells[target.cellIndex];
        if ($prevCell) {
          $navCell = $prevCell;
        }
      }
    }
    if ($navCell) {
      event.preventDefault();
      event.stopPropagation();
      $navCell.focus();
    }
  },
  ArrowDown: (event) => {
    var _a;
    const target = event.target;
    let $navCell;
    if (target instanceof HTMLTableCellElement) {
      const $nextRow = (_a = target.parentElement) == null ? void 0 : _a.nextElementSibling;
      if ($nextRow) {
        const $nextRowCells = Array.from($nextRow.children);
        const $nextCell = $nextRowCells[target.cellIndex];
        if ($nextCell) {
          $navCell = $nextCell;
        }
      }
    }
    if ($navCell) {
      event.preventDefault();
      event.stopPropagation();
      $navCell.focus();
    }
  },
  ArrowLeft: (event) => {
    const target = event.target;
    const $prevCell = target.previousElementSibling;
    if ($prevCell) {
      event.preventDefault();
      event.stopPropagation();
      $prevCell.focus();
    }
  },
  ArrowRight: (event) => {
    const target = event.target;
    const $nextCell = target.nextElementSibling;
    if ($nextCell) {
      event.preventDefault();
      event.stopPropagation();
      $nextCell.focus();
    }
  },
  End: (event) => {
    const target = event.target;
    const $parent = target.parentElement;
    const $navCell = $parent.lastElementChild;
    if ($navCell) {
      event.preventDefault();
      event.stopPropagation();
      $navCell.focus();
    }
  },
  Enter: (event) => {
    const target = event.target;
    if (target instanceof HTMLTableCellElement) {
      if (event.shiftKey) {
        const handler = defaultKeyboardEvents["ArrowUp"];
        if (handler) {
          handler(event);
        }
      } else {
        const handler = defaultKeyboardEvents["ArrowDown"];
        if (handler) {
          handler(event);
        }
      }
    }
  },
  Home: (event) => {
    const target = event.target;
    const $parent = target.parentElement;
    const $navCell = $parent.firstElementChild;
    if ($navCell) {
      event.preventDefault();
      event.stopPropagation();
      $navCell.focus();
    }
  },
  Tab: (event) => {
    var _a, _b;
    const target = event.target;
    let $navCell;
    if (event.shiftKey) {
      const $prevCell = target.previousElementSibling;
      if ($prevCell) {
        $navCell = $prevCell;
      } else {
        const $prevRow = (_a = target.parentElement) == null ? void 0 : _a.previousElementSibling;
        if ($prevRow) {
          const $prevRowCells = Array.from($prevRow.children);
          $prevRowCells.reverse();
          $navCell = $prevRowCells[0];
        }
      }
    } else {
      const $nextCell = target.nextElementSibling;
      if ($nextCell) {
        $navCell = $nextCell;
      } else {
        const $nextRow = (_b = target.parentElement) == null ? void 0 : _b.nextElementSibling;
        if ($nextRow) {
          const $nextRowCells = Array.from($nextRow.children);
          $navCell = $nextRowCells[0];
        }
      }
    }
    if ($navCell) {
      event.preventDefault();
      event.stopPropagation();
      $navCell.focus();
    }
  }
};
const defaultEventMap = {
  focus: {
    listener: (event) => {
      const target = event.target;
      target.tabIndex = 0;
    }
  },
  blur: {
    listener: (event) => {
      const target = event.target;
      target.tabIndex = -1;
    }
  },
  keydown: {
    listener: (event) => {
      const handler = defaultKeyboardEvents[event.key];
      if (handler) {
        handler(event);
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
  const getEventListener = (event, config) => {
    let eventListener, eventOptions;
    if (config.default !== true) {
      if (!config.listener) {
        throw new Error(`Missing listener for event: '${event}'`);
      }
      eventListener = config.listener;
      eventOptions = config.options;
    } else {
      const eventMap = defaultEventMap[event];
      if (eventMap) {
        if (!eventMap.listener) {
          throw new Error(`Missing default event listener for event: '${event}'`);
        }
        eventListener = eventMap.listener;
        eventOptions = eventMap.options;
      } else {
        throw new Error(`Missing default event map for event: '${event}'`);
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
      for (const [event, config] of Object.entries(option.handlers)) {
        const { eventListener, eventOptions } = getEventListener(event, config);
        for (const element of selectors) {
          element.addEventListener(event, eventListener, eventOptions);
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
      for (const [event, config] of Object.entries(option.handlers)) {
        const { eventListener, eventOptions } = getEventListener(event, config);
        for (const element of selectors) {
          element.removeEventListener(event, eventListener, eventOptions);
        }
      }
    }
  });
}
function install(app) {
}
export {
  install,
  useKeyboardNav
};
