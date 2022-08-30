import { defineComponent, inject, ref, computed, resolveDynamicComponent, openBlock, createElementBlock, normalizeStyle, toDisplayString, withDirectives, createCommentVNode, renderSlot, vShow, reactive, createElementVNode, Fragment, renderList, createTextVNode, onMounted, onUnmounted, provide, resolveComponent, createVNode, createBlock, withCtx } from "vue";
const _sfc_main$4 = defineComponent({
  name: "ACell",
  props: {
    colIndex: {
      type: Number,
      required: true
    },
    rowIndex: {
      type: Number,
      required: true
    },
    tableid: {
      type: String,
      required: true
    }
  },
  setup(props) {
    var _a;
    const tableData = inject(props.tableid);
    const cell = ref("");
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
      if (tableData.columns[props.colIndex].component) {
        if (resolveDynamicComponent(tableData.columns[props.colIndex].component)) {
          const domRect = cell.value.getBoundingClientRect();
          tableData.modal.visible = true;
          tableData.modal.colIndex = props.colIndex;
          tableData.modal.rowIndex = props.rowIndex;
          tableData.modal.parent = cell.value;
          tableData.modal.top = domRect.top + domRect.height;
          tableData.modal.left = domRect.left;
          tableData.modal.width = cellWidth.value;
          tableData.modal.component = tableData.columns[props.colIndex].component;
        }
      }
    };
    const updateData = (event) => {
      if (event) {
        if (!tableData.columns[props.colIndex].component) {
          tableData.setCellData(props.rowIndex, props.colIndex, cell.value.innerHTML);
        }
        cellModified.value = true;
      }
    };
    const textAlign = computed(() => {
      return tableData.columns[props.colIndex].align || "center";
    });
    const cellWidth = computed(() => {
      return tableData.columns[props.colIndex].width || "40ch";
    });
    let currentData = "";
    const onFocus = () => {
      currentData = cell.value.innerText;
      cell.value.tabIndex = 0;
    };
    const onChange = (event) => {
      if (event.type === "blur") {
        cell.value.tabIndex = -1;
      }
      if (cell.value.innerHTML !== currentData) {
        currentData = cell.value.innerText;
        cell.value.dispatchEvent(new Event("change"));
        cellModified.value = true;
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
      paddingLeft: getIndent(props.colIndex, (_a = tableData.display[props.rowIndex]) == null ? void 0 : _a.indent)
    };
    return {
      cell,
      cellModified,
      cellStyle,
      cellWidth,
      displayValue,
      getIndent,
      handleInput,
      onChange,
      onFocus,
      tableData,
      textAlign,
      updateData
    };
  }
});
const ACell_vue_vue_type_style_index_0_scoped_03fd16de_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$2 = ["data-colindex", "data-rowindex", "data-editable", "contenteditable"];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("td", {
    ref: "cell",
    "data-colindex": _ctx.colIndex,
    "data-rowindex": _ctx.rowIndex,
    "data-editable": _ctx.tableData.columns[_ctx.colIndex].edit,
    contenteditable: _ctx.tableData.columns[_ctx.colIndex].edit,
    tabindex: -1,
    spellcheck: false,
    style: normalizeStyle(_ctx.cellStyle),
    onFocus: _cache[0] || (_cache[0] = (...args) => _ctx.onFocus && _ctx.onFocus(...args)),
    onPaste: _cache[1] || (_cache[1] = (...args) => _ctx.onChange && _ctx.onChange(...args)),
    onBlur: _cache[2] || (_cache[2] = (...args) => _ctx.onChange && _ctx.onChange(...args)),
    onInput: _cache[3] || (_cache[3] = (...args) => _ctx.onChange && _ctx.onChange(...args)),
    onClick: _cache[4] || (_cache[4] = (...args) => _ctx.handleInput && _ctx.handleInput(...args))
  }, toDisplayString(_ctx.displayValue), 45, _hoisted_1$2);
}
const ACell = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-03fd16de"]]);
const _sfc_main$3 = defineComponent({
  name: "ARow",
  props: {
    row: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    rowIndex: {
      type: Number,
      required: true,
      default: 0
    },
    tableid: {
      type: String,
      required: true,
      default: () => {
        return void 0;
      }
    }
  },
  setup(props) {
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
    return { getRowExpandSymbol, numberedRowStyle, rowVisible, tableData, toggleRowExpand, treeRowStyle };
  }
});
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return withDirectives((openBlock(), createElementBlock("tr", null, [
    _ctx.tableData.config.numberedRows ? (openBlock(), createElementBlock("td", {
      key: 0,
      id: "row-index",
      style: normalizeStyle(_ctx.numberedRowStyle)
    }, toDisplayString(_ctx.rowIndex + 1), 5)) : createCommentVNode("", true),
    _ctx.tableData.config.treeView ? (openBlock(), createElementBlock("td", {
      key: 1,
      id: "row-index",
      style: normalizeStyle(_ctx.treeRowStyle),
      onClick: _cache[0] || (_cache[0] = ($event) => _ctx.toggleRowExpand(_ctx.rowIndex))
    }, toDisplayString(_ctx.getRowExpandSymbol()), 5)) : createCommentVNode("", true),
    !_ctx.tableData.config.numberedRows && !_ctx.tableData.config.treeView ? renderSlot(_ctx.$slots, "indexCell", { key: 2 }) : createCommentVNode("", true),
    renderSlot(_ctx.$slots, "default")
  ], 512)), [
    [vShow, _ctx.rowVisible()]
  ]);
}
const ARow = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
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
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.columns.length ? (openBlock(), createElementBlock("thead", _hoisted_1$1, [
    createElementVNode("tr", _hoisted_2, [
      _ctx.tableData.zeroColumn ? (openBlock(), createElementBlock("th", {
        key: 0,
        style: normalizeStyle({ minWidth: _ctx.tableData.numberedRowWidth.value })
      }, null, 4)) : createCommentVNode("", true),
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.columns, (column, colKey) => {
        var _a;
        return openBlock(), createElementBlock("th", {
          key: colKey,
          tabindex: "-1",
          style: normalizeStyle({
            textAlign: ((_a = column.align) == null ? void 0 : _a.toLowerCase()) || "center",
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
const ATableHeader = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-80fa6b2a"]]);
const _sfc_main$1 = defineComponent({
  name: "ATableModal",
  props: {
    colIndex: {
      type: Number,
      default: 0
    },
    rowIndex: {
      type: Number,
      default: 0
    },
    tableid: {
      type: String
    }
  },
  setup(props) {
    const tableData = inject(props.tableid);
    const handleInput = (event) => {
      event.stopPropagation();
    };
    return { tableData, handleInput };
  }
});
const ATableModal_vue_vue_type_style_index_0_scoped_33741903_lang = "";
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    ref: "amodal",
    class: "amodal",
    tabindex: "-1",
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleInput && _ctx.handleInput(...args)),
    onInput: _cache[1] || (_cache[1] = (...args) => _ctx.handleInput && _ctx.handleInput(...args))
  }, [
    renderSlot(_ctx.$slots, "default", {}, void 0, true)
  ], 544);
}
const ATableModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-33741903"]]);
function useKeyboardNav(options) {
  onMounted(() => {
    for (const [event, config] of Object.entries(options.handlers)) {
      if (config.default !== true) {
        if (!config.listener) {
          throw new Error(`Missing listener for event: '${event}'`);
        }
        const elements = [];
        if (Array.isArray(options.elements.value)) {
          for (const element of options.elements.value) {
            if (element instanceof Element) {
              elements.push(element);
            } else {
              elements.push(element.$el);
            }
          }
        } else {
          elements.push(options.elements.value);
        }
        for (const element of elements) {
          element.addEventListener(event, config.listener, config.options);
        }
      }
    }
  });
  onUnmounted(() => {
  });
}
const _sfc_main = defineComponent({
  name: "ATable",
  components: {
    ACell,
    ARow,
    ATableHeader,
    ATableModal
  },
  props: {
    id: {
      type: String
    },
    columns: {
      type: Array,
      required: true
    },
    rows: {
      type: Array,
      default: () => []
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
    let tableData = new TableDataStore(props.id, props.columns, props.rows, props.config);
    provide(tableData.id, tableData);
    const cells = ref([]);
    useKeyboardNav({
      elements: cells,
      handlers: {
        keydown: {
          listener: (event) => {
            var _a, _b;
            const target = event.target;
            if (event.key === "Tab") {
              event.preventDefault();
              event.stopPropagation();
              if (event.shiftKey) {
                const $prevCell = target.previousElementSibling;
                if ($prevCell && $prevCell.id !== "row-index") {
                  $prevCell.focus();
                } else {
                  const $prevRow = (_a = target.parentElement) == null ? void 0 : _a.previousElementSibling;
                  if ($prevRow) {
                    const $prevRowCells = Array.from($prevRow.children);
                    $prevRowCells.reverse();
                    for (const $cell of $prevRowCells) {
                      if ($cell.id !== "row-index") {
                        $cell.focus();
                        break;
                      }
                    }
                  }
                }
              } else {
                const $nextCell = target.nextElementSibling;
                if ($nextCell) {
                  $nextCell.focus();
                } else {
                  const $nextRow = (_b = target.parentElement) == null ? void 0 : _b.nextElementSibling;
                  if ($nextRow) {
                    const $nextRowCells = Array.from($nextRow.children);
                    for (const $cell of $nextRowCells) {
                      if ($cell.id !== "row-index") {
                        $cell.focus();
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    const formatCell = (event, column, cellData) => {
      let colIndex;
      const target = event == null ? void 0 : event.target;
      if (event) {
        colIndex = target.cellIndex + (tableData.zeroColumn ? -1 : 0);
      } else if (column && cellData) {
        colIndex = tableData.columns.indexOf(column);
      }
      if (!column && "format" in tableData.columns[colIndex]) {
        const format = tableData.columns[colIndex].format;
        if (typeof format === "function") {
          return format(target.innerHTML);
        } else if (typeof format === "string") {
          const formatFn = Function(`"use strict";return (${format})`)();
          return formatFn(target.innerHTML);
        } else {
          return target.innerHTML;
        }
      } else if (cellData && "format" in column) {
        const format = column.format;
        if (typeof format === "function") {
          return format(cellData);
        } else if (typeof format === "string") {
          const formatFn = Function(`"use strict";return (${format})`)();
          return formatFn(cellData);
        } else {
          return cellData;
        }
      } else if (cellData && column.type.toLowerCase() in ["int", "decimal", "float", "number", "percent"]) {
        return cellData;
      } else {
        return cellData;
      }
    };
    const moveCursorToEnd = (target) => {
      target.focus();
      document.execCommand("selectAll", false, null);
      document.getSelection().collapseToEnd();
    };
    const clickOutside = (event) => {
      var _a;
      if (!((_a = tableData.modal.parent) == null ? void 0 : _a.contains(event.target))) {
        if (tableData.modal.visible) {
          tableData.modal.visible = false;
        }
      }
    };
    window.addEventListener("click", clickOutside);
    return {
      cells,
      formatCell,
      moveCursorToEnd,
      tableData,
      v4
    };
  }
});
const ATable_vue_vue_type_style_index_0_scoped_63b7d924_lang = "";
const _hoisted_1 = { class: "atable" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ATableHeader = resolveComponent("ATableHeader");
  const _component_ACell = resolveComponent("ACell");
  const _component_ARow = resolveComponent("ARow");
  const _component_ATableModal = resolveComponent("ATableModal");
  return openBlock(), createElementBlock("table", _hoisted_1, [
    renderSlot(_ctx.$slots, "tableheader", {}, () => [
      createVNode(_component_ATableHeader, {
        columns: _ctx.tableData.columns,
        config: _ctx.tableData.config,
        tableid: _ctx.tableData.id
      }, null, 8, ["columns", "config", "tableid"])
    ], true),
    createElementVNode("tbody", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.tableData.rows, (row, rowIndex) => {
        return openBlock(), createBlock(_component_ARow, {
          key: row.id || _ctx.v4(),
          row,
          rowIndex,
          tableid: _ctx.tableData.id
        }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.tableData.columns, (col, colIndex) => {
              var _a;
              return openBlock(), createBlock(_component_ACell, {
                ref_for: true,
                ref: "cells",
                key: colIndex,
                tableid: _ctx.tableData.id,
                col,
                spellcheck: "false",
                rowIndex,
                colIndex: colIndex + (_ctx.tableData.zeroColumn ? 0 : -1),
                style: normalizeStyle({
                  textAlign: ((_a = col == null ? void 0 : col.align) == null ? void 0 : _a.toLowerCase()) || "center",
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
    withDirectives(createVNode(_component_ATableModal, {
      colIndex: _ctx.tableData.modal.colIndex,
      rowIndex: _ctx.tableData.modal.rowIndex,
      tableid: _ctx.tableData.id,
      style: normalizeStyle({
        left: _ctx.tableData.modal.left + "px",
        top: _ctx.tableData.modal.top + "px",
        maxWidth: _ctx.tableData.modal.width + "px"
      })
    }, {
      default: withCtx(() => [
        (openBlock(), createBlock(resolveDynamicComponent(_ctx.tableData.modal.component), {
          colIndex: _ctx.tableData.modal.colIndex,
          rowIndex: _ctx.tableData.modal.rowIndex,
          tableid: _ctx.tableData.id
        }, null, 8, ["colIndex", "rowIndex", "tableid"]))
      ]),
      _: 1
    }, 8, ["colIndex", "rowIndex", "tableid", "style"]), [
      [vShow, _ctx.tableData.modal.visible]
    ])
  ]);
}
const ATable = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-63b7d924"]]);
function install(app) {
  app.component("ACell", ACell);
  app.component("ARow", ARow);
  app.component("ATable", ATable);
  app.component("ATableHeader", ATableHeader);
  app.component("ATableModal", ATableModal);
}
export {
  ACell,
  ARow,
  ATable,
  ATableHeader,
  ATableModal,
  TableDataStore,
  install
};
