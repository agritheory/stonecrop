import { onMounted, onUnmounted } from "vue";
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
      var _a, _b, _c, _d;
      const target = event.target;
      if (event.key === "Tab") {
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
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        let $navCell;
        if (event.key === "ArrowUp") {
          const $prevRow = (_c = target.parentElement) == null ? void 0 : _c.previousElementSibling;
          if ($prevRow) {
            const $prevRowCells = Array.from($prevRow.children);
            const $prevCell = $prevRowCells[target.cellIndex];
            if ($prevCell) {
              $navCell = $prevCell;
            }
          }
        } else if (event.key === "ArrowDown") {
          const $nextRow = (_d = target.parentElement) == null ? void 0 : _d.nextElementSibling;
          if ($nextRow) {
            const $nextRowCells = Array.from($nextRow.children);
            const $nextCell = $nextRowCells[target.cellIndex];
            if ($nextCell) {
              $navCell = $nextCell;
            }
          }
        } else if (event.key === "ArrowLeft") {
          const $prevCell = target.previousElementSibling;
          if ($prevCell) {
            $navCell = $prevCell;
          }
        } else if (event.key === "ArrowRight") {
          const $nextCell = target.nextElementSibling;
          if ($nextCell) {
            $navCell = $nextCell;
          }
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
