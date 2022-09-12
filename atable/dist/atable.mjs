import { onMounted, onBeforeUnmount, ref, watch, unref, getCurrentScope, onScopeDispose, defineComponent, inject, computed, openBlock, createElementBlock, toDisplayString, resolveDynamicComponent, withDirectives, createCommentVNode, renderSlot, vShow, reactive, createElementVNode, normalizeStyle, Fragment, renderList, createTextVNode, provide, createVNode, createBlock, withCtx } from "vue";
var _a;
const isClient = typeof window !== "undefined";
const isString = (val) => typeof val === "string";
const noop = () => {
};
isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function identity(arg) {
  return arg;
}
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function unrefElement(elRef) {
  var _a2;
  const plain = resolveUnref(elRef);
  return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
}
const defaultWindow = isClient ? window : void 0;
function useEventListener(...args) {
  let target;
  let event;
  let listener;
  let options;
  if (isString(args[0])) {
    [event, listener, options] = args;
    target = defaultWindow;
  } else {
    [target, event, listener, options] = args;
  }
  if (!target)
    return noop;
  let cleanup = noop;
  const stopWatch = watch(() => unrefElement(target), (el) => {
    cleanup();
    if (!el)
      return;
    el.addEventListener(event, listener, options);
    cleanup = () => {
      el.removeEventListener(event, listener, options);
      cleanup = noop;
    };
  }, { immediate: true, flush: "post" });
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey = "__vueuse_ssr_handlers__";
_global[globalKey] = _global[globalKey] || {};
_global[globalKey];
function useElementVisibility(element, { window: window2 = defaultWindow, scrollTarget } = {}) {
  const elementIsVisible = ref(false);
  const testBounding = () => {
    if (!window2)
      return;
    const document2 = window2.document;
    const el = unrefElement(element);
    if (!el) {
      elementIsVisible.value = false;
    } else {
      const rect = el.getBoundingClientRect();
      elementIsVisible.value = rect.top <= (window2.innerHeight || document2.documentElement.clientHeight) && rect.left <= (window2.innerWidth || document2.documentElement.clientWidth) && rect.bottom >= 0 && rect.right >= 0;
    }
  };
  watch(() => unrefElement(element), () => testBounding(), { immediate: true, flush: "post" });
  if (window2) {
    useEventListener(scrollTarget || window2, "scroll", testBounding, {
      capture: false,
      passive: true
    });
  }
  return elementIsVisible;
}
var SwipeDirection;
(function(SwipeDirection2) {
  SwipeDirection2["UP"] = "UP";
  SwipeDirection2["RIGHT"] = "RIGHT";
  SwipeDirection2["DOWN"] = "DOWN";
  SwipeDirection2["LEFT"] = "LEFT";
  SwipeDirection2["NONE"] = "NONE";
})(SwipeDirection || (SwipeDirection = {}));
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const _TransitionPresets = {
  easeInSine: [0.12, 0, 0.39, 0],
  easeOutSine: [0.61, 1, 0.88, 1],
  easeInOutSine: [0.37, 0, 0.63, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInOutQuad: [0.45, 0, 0.55, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInQuart: [0.5, 0, 0.75, 0],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInQuint: [0.64, 0, 0.78, 0],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeInCirc: [0.55, 0, 1, 0.45],
  easeOutCirc: [0, 0.55, 0.45, 1],
  easeInOutCirc: [0.85, 0, 0.15, 1],
  easeInBack: [0.36, 0, 0.66, -0.56],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6]
};
__spreadValues({
  linear: identity
}, _TransitionPresets);
const isElementVisible = (element) => {
  return useElementVisibility(element).value && element.clientHeight > 0;
};
const getUpCell = (event) => {
  var _a2;
  const $target = event.target;
  let $upCell = $target;
  if ($target instanceof HTMLTableCellElement) {
    while ($upCell) {
      const $prevRow = (_a2 = $upCell.parentElement) == null ? void 0 : _a2.previousElementSibling;
      if (!$prevRow)
        break;
      const $prevRowCells = Array.from($prevRow.children);
      $upCell = $prevRowCells[$target.cellIndex];
      if (!$upCell || isElementVisible($upCell))
        break;
    }
  }
  return $upCell;
};
const getTopCell = (event) => {
  var _a2;
  const $target = event.target;
  let $topCell;
  if ($target instanceof HTMLTableCellElement) {
    const $table = (_a2 = $target.parentElement) == null ? void 0 : _a2.parentElement;
    if ($table) {
      const $firstRow = $table.firstElementChild;
      const $navCell = $firstRow.children[$target.cellIndex];
      if ($navCell) {
        $topCell = $navCell;
      }
    }
  }
  return $topCell;
};
const getDownCell = (event) => {
  var _a2;
  const $target = event.target;
  let $downCell = $target;
  if ($target instanceof HTMLTableCellElement) {
    while ($downCell) {
      debugger;
      const $nextRow = (_a2 = $target.parentElement) == null ? void 0 : _a2.nextElementSibling;
      if (!$nextRow)
        break;
      const $nextRowCells = Array.from($nextRow.children);
      $downCell = $nextRowCells[$target.cellIndex];
      if (!$downCell || isElementVisible($downCell))
        break;
    }
  }
  return $downCell;
};
const getBottomCell = (event) => {
  var _a2;
  const $target = event.target;
  let $bottomCell;
  if ($target instanceof HTMLTableCellElement) {
    const $table = (_a2 = $target.parentElement) == null ? void 0 : _a2.parentElement;
    if ($table) {
      const $lastRow = $table.lastElementChild;
      const $navCell = $lastRow.children[$target.cellIndex];
      if ($navCell) {
        $bottomCell = $navCell;
      }
    }
  }
  return $bottomCell;
};
const getPrevCell = (event) => {
  var _a2;
  const $target = event.target;
  let $prevCell;
  if ($target.previousElementSibling) {
    $prevCell = $target.previousElementSibling;
  } else {
    const $prevRow = (_a2 = $target.parentElement) == null ? void 0 : _a2.previousElementSibling;
    $prevCell = $prevRow == null ? void 0 : $prevRow.lastElementChild;
  }
  return $prevCell;
};
const getNextCell = (event) => {
  var _a2;
  const $target = event.target;
  let $nextCell;
  if ($target.nextElementSibling) {
    $nextCell = $target.nextElementSibling;
  } else {
    const $nextRow = (_a2 = $target.parentElement) == null ? void 0 : _a2.nextElementSibling;
    $nextCell = $nextRow == null ? void 0 : $nextRow.firstElementChild;
  }
  return $nextCell;
};
const getFirstCell = (event) => {
  const $target = event.target;
  const $parent = $target.parentElement;
  const $firstCell = $parent.firstElementChild;
  return $firstCell;
};
const getLastCell = (event) => {
  const $target = event.target;
  const $parent = $target.parentElement;
  const $lastCell = $parent.lastElementChild;
  return $lastCell;
};
const modifierKeys = ["alt", "control", "shift", "meta"];
const eventKeyMap = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
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
    event.preventDefault();
    event.stopPropagation();
    if ($prevCell) {
      $prevCell.focus();
    }
  },
  "keydown.right": (event) => {
    const $nextCell = getNextCell(event);
    event.preventDefault();
    event.stopPropagation();
    if ($nextCell) {
      $nextCell.focus();
    }
  },
  "keydown.control.up": (event) => {
    const $topCell = getTopCell(event);
    if ($topCell) {
      event.preventDefault();
      event.stopPropagation();
      $topCell.focus();
    }
  },
  "keydown.control.down": (event) => {
    const $bottomCell = getBottomCell(event);
    if ($bottomCell) {
      event.preventDefault();
      event.stopPropagation();
      $bottomCell.focus();
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
    const $target = event.target;
    if ($target instanceof HTMLTableCellElement) {
      event.preventDefault();
      event.stopPropagation();
      const $downCell = getDownCell(event);
      if ($downCell) {
        $downCell.focus();
      }
    }
  },
  "keydown.shift.enter": (event) => {
    const $target = event.target;
    if ($target instanceof HTMLTableCellElement) {
      event.preventDefault();
      event.stopPropagation();
      const $upCell = getUpCell(event);
      if ($upCell) {
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
    } else {
      const $children = Array.from($parent.children);
      selectors = $children.filter((selector) => {
        if (selector.tabIndex < 0) {
          return false;
        }
        if (!useElementVisibility(selector).value) {
          return false;
        }
        return true;
      });
    }
    return selectors;
  };
  const getEventListener = (option) => {
    return (event) => {
      const activeKey = eventKeyMap[event.key] || event.key.toLowerCase();
      if (modifierKeys.includes(activeKey))
        return;
      const handlers = option.handlers || defaultKeypressHandlers;
      for (const key of Object.keys(handlers)) {
        const [eventType, ...keys] = key.split(".");
        if (eventType !== "keydown") {
          continue;
        }
        if (keys.includes(activeKey)) {
          const listener = handlers[key];
          const hasModifier = keys.filter((key2) => modifierKeys.includes(key2));
          const isModifierActive = modifierKeys.some((key2) => {
            const modifierKey = key2.charAt(0).toUpperCase() + key2.slice(1);
            return event.getModifierState(modifierKey);
          });
          if (hasModifier.length > 0) {
            if (isModifierActive) {
              for (const modifier of modifierKeys) {
                if (keys.includes(modifier)) {
                  const modifierKey = modifier.charAt(0).toUpperCase() + modifier.slice(1);
                  if (event.getModifierState(modifierKey)) {
                    listener(event);
                  }
                }
              }
            }
          } else {
            if (!isModifierActive) {
              listener(event);
            }
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
  onBeforeUnmount(() => {
    for (const option of options) {
      const selectors = getSelectors(option);
      for (const selector of selectors) {
        selector.removeEventListener("keydown", getEventListener(option));
      }
    }
  });
}
const _hoisted_1$2 = ["data-colindex", "data-rowindex", "data-editable", "contenteditable"];
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ACell",
  props: {
    colIndex: null,
    rowIndex: null,
    tableid: null
  },
  setup(__props) {
    var _a2;
    const props = __props;
    const tableData = inject(props.tableid);
    const cell = ref(null);
    let cellModified = ref(false);
    const displayValue = computed(() => {
      const data = tableData.cellData(props.colIndex, props.rowIndex);
      if (tableData.columns[props.colIndex].format) {
        const format = tableData.columns[props.colIndex].format;
        if (typeof format === "function") {
          return format(data);
        } else if (typeof format === "string") {
          const formatFn = Function(`"use strict";return (${format})`)();
          return formatFn(data);
        } else {
          return data;
        }
      } else {
        return data;
      }
    });
    const handleInput = () => {
      if (tableData.columns[props.colIndex].mask)
        ;
      const component = tableData.columns[props.colIndex].component;
      if (component && resolveDynamicComponent(component)) {
        const domRect = cell.value.getBoundingClientRect();
        tableData.modal.visible = true;
        tableData.modal.colIndex = props.colIndex;
        tableData.modal.rowIndex = props.rowIndex;
        tableData.modal.parent = cell.value;
        tableData.modal.top = domRect.top + domRect.height;
        tableData.modal.left = domRect.left;
        tableData.modal.width = cellWidth.value;
        tableData.modal.component = component;
      }
    };
    useKeyboardNav([
      {
        selectors: cell,
        handlers: {
          "keydown.f2": handleInput,
          "keydown.alt.up": handleInput,
          "keydown.alt.down": handleInput,
          "keydown.alt.left": handleInput,
          "keydown.alt.right": handleInput
        }
      }
    ]);
    const textAlign = computed(() => {
      return tableData.columns[props.colIndex].align || "center";
    });
    const cellWidth = computed(() => {
      return tableData.columns[props.colIndex].width || "40ch";
    });
    let currentData = "";
    const onFocus = () => {
      if (cell.value) {
        currentData = cell.value.innerText;
        cell.value.tabIndex = 0;
      }
    };
    const onChange = (event) => {
      if (cell.value) {
        if (event.type == "blur") {
          cell.value.tabIndex = -1;
        }
        if (cell.value.innerHTML !== currentData) {
          currentData = cell.value.innerText;
          cell.value.dispatchEvent(new Event("change"));
          cellModified.value = true;
        }
      }
    };
    const getIndent = (colKey, indent) => {
      if (indent && colKey === 0 && indent > 0) {
        return `${indent}ch`;
      } else {
        return "inherit";
      }
    };
    const cellStyle = {
      textAlign: textAlign.value,
      width: cellWidth.value,
      backgroundColor: !cellModified.value ? "inherit" : "var(--cell-modified-color)",
      fontWeight: !cellModified.value ? "inherit" : "bold",
      paddingLeft: getIndent(props.colIndex, (_a2 = tableData.display[props.rowIndex]) == null ? void 0 : _a2.indent)
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("td", {
        ref_key: "cell",
        ref: cell,
        "data-colindex": __props.colIndex,
        "data-rowindex": __props.rowIndex,
        "data-editable": unref(tableData).columns[__props.colIndex].edit,
        contenteditable: unref(tableData).columns[__props.colIndex].edit,
        tabindex: -1,
        spellcheck: false,
        style: cellStyle,
        onFocus,
        onPaste: onChange,
        onBlur: onChange,
        onInput: onChange,
        onClick: handleInput
      }, toDisplayString(unref(displayValue)), 41, _hoisted_1$2);
    };
  }
});
const ACell_vue_vue_type_style_index_0_scoped_0fe8c033_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const ACell = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-0fe8c033"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ARow",
  props: {
    row: null,
    rowIndex: null,
    tableid: null
  },
  setup(__props) {
    const props = __props;
    const tableData = inject(props.tableid);
    const numberedRowStyle = {
      backgroundColor: "var(--brand-color)",
      borderColor: "var(--header-border-color)",
      color: "var(--header-text-color)",
      fontWeight: "bold",
      textAlign: "center",
      userSelect: "none",
      width: tableData.numberedRowWidth.value
    };
    const treeRowStyle = {
      backgroundColor: "var(--brand-color)",
      borderColor: "var(--header-border-color)",
      color: "var(--header-text-color)",
      fontWeight: "bold",
      textAlign: "center",
      userSelect: "none",
      width: "2ch"
    };
    const getRowExpandSymbol = () => {
      if (!tableData.config.treeView) {
        return "";
      }
      if (tableData.display[props.rowIndex].isRoot) {
        if (tableData.display[props.rowIndex].childrenOpen) {
          return "-";
        } else {
          return "+";
        }
      }
      if (tableData.display[props.rowIndex].isParent) {
        if (tableData.display[props.rowIndex].childrenOpen) {
          return "-";
        } else {
          return "+";
        }
      } else {
        return "";
      }
    };
    const rowVisible = () => {
      if (!tableData.config.treeView) {
        return true;
      }
      return tableData.display[props.rowIndex].isRoot || tableData.display[props.rowIndex].open;
    };
    const toggleRowExpand = (rowIndex) => {
      tableData.toggleRowExpand(rowIndex);
    };
    return (_ctx, _cache) => {
      return withDirectives((openBlock(), createElementBlock("tr", null, [
        unref(tableData).config.numberedRows ? (openBlock(), createElementBlock("td", {
          key: 0,
          id: "row-index",
          tabIndex: -1,
          style: numberedRowStyle
        }, toDisplayString(__props.rowIndex + 1), 1)) : createCommentVNode("", true),
        unref(tableData).config.treeView ? (openBlock(), createElementBlock("td", {
          key: 1,
          id: "row-index",
          tabIndex: -1,
          style: treeRowStyle,
          onClick: _cache[0] || (_cache[0] = ($event) => toggleRowExpand(__props.rowIndex))
        }, toDisplayString(getRowExpandSymbol()), 1)) : createCommentVNode("", true),
        !unref(tableData).config.numberedRows && !unref(tableData).config.treeView ? renderSlot(_ctx.$slots, "indexCell", { key: 2 }) : createCommentVNode("", true),
        renderSlot(_ctx.$slots, "default")
      ], 512)), [
        [vShow, rowVisible()]
      ]);
    };
  }
});
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== "undefined" && typeof msCrypto.getRandomValues === "function" && msCrypto.getRandomValues.bind(msCrypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
const REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
function validate(uuid) {
  return typeof uuid === "string" && REGEX.test(uuid);
}
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).substr(1));
}
function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  if (!validate(uuid)) {
    throw TypeError("Stringified UUID is invalid");
  }
  return uuid;
}
function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return stringify(rnds);
}
class TableDataStore {
  constructor(id, columns, rows, config, table, display) {
    this.id = id || v4();
    this.rows = rows;
    this.columns = reactive(columns);
    this.config = reactive(config);
    this.table = table || reactive(this.createTableObject());
    this.display = this.createDisplayObject(display);
    this.modal = reactive({ visible: false });
  }
  createTableObject() {
    const table = {};
    for (const [colIndex, column] of this.columns.entries()) {
      for (const [rowIndex, row] of this.rows.entries()) {
        table[`${colIndex}:${rowIndex}`] = row[column.name];
      }
    }
    return table;
  }
  createDisplayObject(display) {
    const defaultDisplay = [Object.assign({}, { modified: false })];
    if (display) {
      if ("0:0" in display) {
        return display;
      }
    }
    const parents = /* @__PURE__ */ new Set();
    for (let rowIndex = this.rows.length - 1; rowIndex >= 0; rowIndex--) {
      const row = this.rows[rowIndex];
      if (row.parent) {
        parents.add(row.parent);
      }
      defaultDisplay[rowIndex] = {
        childrenOpen: false,
        indent: row.indent || null,
        isParent: parents.has(rowIndex),
        isRoot: row.parent === null || row.parent === void 0,
        modified: false,
        open: row.parent === null || row.parent === void 0,
        parent: row.parent
      };
    }
    return reactive(defaultDisplay);
  }
  get zeroColumn() {
    return this.config.numberedRows || this.config.treeView;
  }
  get numberedRowWidth() {
    return computed(() => {
      return String(Math.ceil(this.rows.length / 100) + 1) + "ch";
    });
  }
  cellData(colIndex, rowIndex) {
    return this.table[`${colIndex}:${rowIndex}`];
  }
  setCellData(rowIndex, colIndex, value) {
    if (this.table[`${colIndex}:${rowIndex}`] !== value) {
      this.display[rowIndex].modified = true;
    }
    this.table[`${colIndex}:${rowIndex}`] = value;
    return this.table[`${colIndex}:${rowIndex}`];
  }
  toggleRowExpand(rowIndex) {
    if (!this.config.treeView) {
      return;
    }
    this.display[rowIndex].childrenOpen = !this.display[rowIndex].childrenOpen;
    for (let index = this.rows.length - 1; index >= 0; index--) {
      if (this.display[index].parent === rowIndex) {
        this.display[index].open = !this.display[index].open;
        if (this.display[index].childrenOpen) {
          this.toggleRowExpand(index);
        }
      }
    }
  }
}
const _sfc_main$2 = defineComponent({
  name: "ATableHeader",
  props: {
    columns: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      default: () => new Object()
    },
    tableid: {
      type: String
    }
  },
  setup(props) {
    const tableData = inject(props.tableid);
    return { tableData };
  }
});
const ATableHeader_vue_vue_type_style_index_0_scoped_80fa6b2a_lang = "";
const _hoisted_1$1 = { key: 0 };
const _hoisted_2 = { tabindex: "-1" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.columns.length ? (openBlock(), createElementBlock("thead", _hoisted_1$1, [
    createElementVNode("tr", _hoisted_2, [
      _ctx.tableData.zeroColumn ? (openBlock(), createElementBlock("th", {
        key: 0,
        style: normalizeStyle({ minWidth: _ctx.tableData.numberedRowWidth.value })
      }, null, 4)) : createCommentVNode("", true),
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.columns, (column, colKey) => {
        var _a2;
        return openBlock(), createElementBlock("th", {
          key: colKey,
          tabindex: "-1",
          style: normalizeStyle({
            textAlign: ((_a2 = column.align) == null ? void 0 : _a2.toLowerCase()) || "center",
            minWidth: column.width || "40ch"
          })
        }, [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createTextVNode(toDisplayString(column.label || String.fromCharCode(colKey + 97).toUpperCase()), 1)
          ], true)
        ], 4);
      }), 128))
    ])
  ])) : createCommentVNode("", true);
}
const ATableHeader = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render], ["__scopeId", "data-v-80fa6b2a"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ATableModal",
  props: {
    colIndex: null,
    rowIndex: null,
    tableid: null
  },
  setup(__props) {
    const props = __props;
    inject(props.tableid);
    const handleInput = (event) => {
      event.stopPropagation();
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref: "amodal",
        class: "amodal",
        tabindex: "-1",
        onClick: handleInput,
        onInput: handleInput
      }, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 544);
    };
  }
});
const ATableModal_vue_vue_type_style_index_0_scoped_1bd2b677_lang = "";
const ATableModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-1bd2b677"]]);
const _hoisted_1 = { class: "atable" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ATable",
  props: {
    id: null,
    columns: null,
    rows: { default: () => [] },
    config: { default: () => new Object() },
    tableid: null
  },
  setup(__props) {
    const props = __props;
    let tableData = new TableDataStore(props.id, props.columns, props.rows, props.config);
    provide(tableData.id, tableData);
    useKeyboardNav([{ selectors: "td" }]);
    const clickOutside = (event) => {
      var _a2;
      if (!((_a2 = tableData.modal.parent) == null ? void 0 : _a2.contains(event.target))) {
        if (tableData.modal.visible) {
          tableData.modal.visible = false;
        }
      }
    };
    window.addEventListener("click", clickOutside);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (tableData.modal.visible) {
          tableData.modal.visible = false;
        }
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("table", _hoisted_1, [
        renderSlot(_ctx.$slots, "tableheader", {}, () => [
          createVNode(ATableHeader, {
            columns: unref(tableData).columns,
            config: unref(tableData).config,
            tableid: unref(tableData).id
          }, null, 8, ["columns", "config", "tableid"])
        ], true),
        createElementVNode("tbody", null, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(tableData).rows, (row, rowIndex) => {
            return openBlock(), createBlock(_sfc_main$3, {
              key: row.id || unref(v4)(),
              row,
              rowIndex,
              tableid: unref(tableData).id
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(tableData).columns, (col, colIndex) => {
                  var _a2;
                  return openBlock(), createBlock(ACell, {
                    key: colIndex,
                    tableid: unref(tableData).id,
                    col,
                    spellcheck: "false",
                    rowIndex,
                    colIndex: colIndex + (unref(tableData).zeroColumn ? 0 : -1),
                    style: normalizeStyle({
                      textAlign: ((_a2 = col == null ? void 0 : col.align) == null ? void 0 : _a2.toLowerCase()) || "center",
                      minWidth: (col == null ? void 0 : col.width) || "40ch"
                    })
                  }, null, 8, ["tableid", "col", "rowIndex", "colIndex", "style"]);
                }), 128))
              ]),
              _: 2
            }, 1032, ["row", "rowIndex", "tableid"]);
          }), 128))
        ]),
        renderSlot(_ctx.$slots, "footer", {}, void 0, true),
        withDirectives(createVNode(ATableModal, {
          colIndex: unref(tableData).modal.colIndex,
          rowIndex: unref(tableData).modal.rowIndex,
          tableid: unref(tableData).id,
          style: normalizeStyle({
            left: unref(tableData).modal.left + "px",
            top: unref(tableData).modal.top + "px",
            maxWidth: unref(tableData).modal.width + "px"
          })
        }, {
          default: withCtx(() => [
            (openBlock(), createBlock(resolveDynamicComponent(unref(tableData).modal.component), {
              colIndex: unref(tableData).modal.colIndex,
              rowIndex: unref(tableData).modal.rowIndex,
              tableid: unref(tableData).id
            }, null, 8, ["colIndex", "rowIndex", "tableid"]))
          ]),
          _: 1
        }, 8, ["colIndex", "rowIndex", "tableid", "style"]), [
          [vShow, unref(tableData).modal.visible]
        ])
      ]);
    };
  }
});
const ATable_vue_vue_type_style_index_0_scoped_f1dba1ed_lang = "";
const ATable = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f1dba1ed"]]);
function install(app) {
  app.component("ACell", ACell);
  app.component("ARow", _sfc_main$3);
  app.component("ATable", ATable);
  app.component("ATableHeader", ATableHeader);
  app.component("ATableModal", ATableModal);
}
export {
  ACell,
  _sfc_main$3 as ARow,
  ATable,
  ATableHeader,
  ATableModal,
  TableDataStore,
  install
};
