import { reactive, computed, defineComponent, inject, withDirectives, openBlock, createElementBlock, normalizeStyle, toDisplayString, createCommentVNode, renderSlot, vShow, ref, watch, resolveDynamicComponent, withKeys, createElementVNode, Fragment, renderList, createTextVNode, provide, nextTick, resolveComponent, createVNode, createBlock, withCtx } from "vue";
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
var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
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
  constructor(id = void 0, columns = [], rows = [], config = {}, table = void 0, display = void 0) {
    this.id = id === void 0 ? v4() : id;
    this.rows = rows;
    this.columns = reactive(columns);
    this.config = reactive(config);
    this.table = table === void 0 ? reactive(this.createTableObject()) : table;
    this.display = this.createDisplayObject(display);
    this.modal = reactive({
      visible: false,
      rowIndex: void 0,
      colIndex: void 0,
      event: void 0,
      top: void 0,
      left: void 0,
      width: void 0
    });
  }
  createTableObject() {
    let table = {};
    for (const [colIndex, column] of this.columns.entries()) {
      for (const [rowIndex, row] of this.rows.entries()) {
        table[`${colIndex}:${rowIndex}`] = row[column.name];
      }
    }
    return table;
  }
  createDisplayObject(display) {
    let defaultDisplay = Object.assign({}, { modified: false });
    if (display !== void 0 && display.hasOwnProperty("0:0")) {
      return display;
    } else if (display !== void 0 && display.hasOwnProperty("default")) {
      defaultDisplay = display.default;
    }
    let parents = new Set();
    for (let rowIndex = this.rows.length - 1; rowIndex >= 0; rowIndex--) {
      let row = this.rows[rowIndex];
      if (row.parent) {
        parents.add(row.parent);
      }
      defaultDisplay[rowIndex] = {
        modified: false,
        open: row.parent !== null && row.parent !== void 0 ? false : true,
        isParent: parents.has(rowIndex) ? true : false,
        parent: row.parent,
        isRoot: row.parent !== null && row.parent !== void 0 ? false : true,
        indent: row.indent || null,
        childrenOpen: false
      };
    }
    return reactive(defaultDisplay);
  }
  get zeroColumn() {
    if (this.config.numberedRows || this.config.treeView) {
      return true;
    } else {
      return false;
    }
  }
  get numberedRowWidth() {
    computed(() => {
      return String(Math.ceil(this.rows.length / 100) + 1) + "ch";
    });
  }
  cellData(colIndex, rowIndex) {
    return this.table[`${colIndex}:${rowIndex}`];
  }
  setCellData(rowIndex, colIndex, value) {
    if (this.table[`${colIndex}:${rowIndex}`] !== value) {
      this.display[`${colIndex}:${rowIndex}`].modified = true;
    }
    this.table[`${colIndex}:${rowIndex}`] = value;
    return this.table[`${colIndex}:${rowIndex}`];
  }
  toggleRowExpand(rowIndex) {
    if (!this.config.treeView) {
      return;
    }
    this.display[rowIndex].childrenOpen = !this.display[rowIndex].childrenOpen;
    for (let index2 = this.rows.length - 1; index2 >= 0; index2--) {
      if (this.display[index2].parent === rowIndex) {
        this.display[index2].open = !this.display[index2].open;
        if (this.display[index2].childrenOpen) {
          this.toggleRowExpand(index2);
        }
      }
    }
  }
}
const _sfc_main$4 = defineComponent({
  name: "ARow",
  props: {
    "row": {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    "rowIndex": {
      type: Number,
      required: true,
      default: 0
    },
    "tableid": {
      type: String,
      required: true,
      default: () => {
        return void 0;
      }
    }
  },
  setup(props) {
    const TableData = inject(props.tableid);
    function getRowExpandSymbol() {
      if (!TableData.config.treeView) {
        return "";
      }
      if (TableData.display[props.rowIndex].isRoot && !TableData.display[props.rowIndex].childrenOpen) {
        return "+";
      }
      if (TableData.display[props.rowIndex].isRoot && TableData.display[props.rowIndex].childrenOpen) {
        return "-";
      }
      if (TableData.display[props.rowIndex].isParent && !TableData.display[props.rowIndex].childrenOpen) {
        return "+";
      } else if (TableData.display[props.rowIndex].isParent && TableData.display[props.rowIndex].childrenOpen) {
        return "-";
      } else {
        return "";
      }
    }
    function rowVisible() {
      if (!TableData.config.treeView) {
        return true;
      }
      if (TableData.display[props.rowIndex].isRoot) {
        return true;
      } else {
        return TableData.display[props.rowIndex].open;
      }
    }
    function toggleRowExpand(rowIndex) {
      TableData.toggleRowExpand(rowIndex);
    }
    return { TableData, getRowExpandSymbol, toggleRowExpand, rowVisible };
  }
});
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return withDirectives((openBlock(), createElementBlock("tr", null, [
    _ctx.TableData.config.numberedRows ? (openBlock(), createElementBlock("td", {
      key: 0,
      style: normalizeStyle({
        "width": "TableData.numberedRowWidth",
        "text-align": "center",
        "background-color": "var(--brand-color)",
        "color": "var(--header-text-color)",
        "font-weight": "bold",
        "border-color": "var(--header-border-color)",
        "user-select": "none"
      })
    }, toDisplayString(_ctx.rowIndex + 1), 5)) : createCommentVNode("", true),
    _ctx.TableData.config.treeView ? (openBlock(), createElementBlock("td", {
      key: 1,
      style: normalizeStyle({
        "width": "2ch",
        "text-align": "center",
        "background-color": "var(--brand-color)",
        "color": "var(--header-text-color)",
        "font-weight": "bold",
        "border-color": "var(--header-border-color)",
        "user-select": "none"
      }),
      onClick: _cache[0] || (_cache[0] = ($event) => _ctx.toggleRowExpand(_ctx.rowIndex))
    }, toDisplayString(_ctx.getRowExpandSymbol()), 5)) : createCommentVNode("", true),
    !_ctx.TableData.config.numberedRows && !_ctx.TableData.config.treeView ? renderSlot(_ctx.$slots, "indexCell", { key: 2 }) : createCommentVNode("", true),
    renderSlot(_ctx.$slots, "default")
  ], 512)), [
    [vShow, _ctx.rowVisible()]
  ]);
}
_sfc_main$4.render = _sfc_render$4;
var ACell_vue_vue_type_style_index_0_scoped_true_lang = "\ntd[data-v-f81c70ec] {\n  border: 1px;\n  border-style: solid;\n  border-color: var(--cell-border-color);\n  border-radius: 0px;\n	box-sizing: border-box;\n  margin: 0px;\n  outline: none;\n  box-shadow: none;\n  color: var(--cell-text-color);\n  text-overflow: ellipsis;\n  overflow: hidden;\n	padding-left: 0.5ch;\n	padding-right: 0.5ch;\n}\ntd[data-v-f81c70ec]:focus, td[data-v-f81c70ec]:focus-within {\n  background-color: var(--focus-cell-background);\n  outline-width: 2px;\n  outline-style: solid; \n  outline-color: var(--focus-cell-outline);\n  box-shadow: none;\n  overflow: hidden;\n  min-height: 1.15em;\n  max-height: 1.15em;\n  overflow: hidden;\n}\n";
const _sfc_main$3 = defineComponent({
  name: "ACell",
  props: {
    "colIndex": {
      type: Number,
      required: true,
      default: 0
    },
    "rowIndex": {
      type: Number,
      required: true,
      default: 0
    },
    "tableid": {
      type: String,
      required: true,
      default: () => {
        return void 0;
      }
    }
  },
  setup(props) {
    const TableData = inject(props.tableid);
    let cellModified = ref(false);
    const displayValue = computed(() => {
      if (TableData.columns[props.colIndex].format !== void 0) {
        return TableData.columns[props.colIndex].format(TableData.cellData(props.colIndex, props.rowIndex));
      } else {
        return TableData.cellData(props.colIndex, props.rowIndex);
      }
    });
    const handleInput = function(event) {
      if (TableData.columns[props.colIndex].mask !== void 0) {
        console.log("masking function");
      }
      if (TableData.columns[props.colIndex].hasOwnProperty("component")) {
        if (resolveDynamicComponent(TableData.columns[props.colIndex].component)) {
          const domRect = event.target.getBoundingClientRect();
          TableData.modal.visible = true;
          TableData.modal.colIndex = props.colIndex;
          TableData.modal.rowIndex = props.rowIndex;
          TableData.modal.parent = event.target;
          TableData.modal.top = domRect.top + domRect.height;
          TableData.modal.left = domRect.left;
          TableData.modal.width = cellWidth;
          TableData.modal.component = TableData.columns[props.colIndex].component;
        }
        console.log(event.target);
      }
      return event;
    };
    const updateData = function(event) {
      if (event) {
        if (TableData.columns[props.colIndex].component === void 0) {
          TableData.setCellData(props.rowIndex, props.colIndex, event.target.innerHTML);
        }
        cellModified = true;
      }
    };
    const textAlign = computed(() => {
      return TableData.columns[props.colIndex].align !== void 0 ? TableData.columns[props.colIndex].align.toLowerCase() : "center";
    });
    const cellWidth = computed(() => {
      return TableData.columns[props.colIndex].width !== void 0 ? TableData.columns[props.colIndex].width : "40ch";
    });
    let currentData = "";
    const onFocus = function(event) {
      currentData = event.target.innerText;
    };
    const onChange = function(event) {
      if (event.target.innerHTML !== currentData) {
        currentData = event.target.innerText;
        event.target.dispatchEvent(new Event("change"));
        cellModified = true;
      }
      console.log("cellModified", cellModified);
    };
    const getIndent = function(colKey, indent) {
      if (indent && colKey === 0 && indent > 0) {
        return indent * 1 + "ch";
      } else {
        return "inherit";
      }
    };
    watch(cellModified, () => {
      console.log(currentData);
    });
    return { TableData, updateData, displayValue, handleInput, cellModified, textAlign, cellWidth, onFocus, onChange, getIndent };
  }
});
const _hoisted_1$2 = ["contenteditable", "innerHTML"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  var _a;
  return openBlock(), createElementBlock("td", {
    ref: "colIndex + ':' + rowIndex",
    contenteditable: _ctx.TableData.columns[_ctx.colIndex].edit === true ? true : false,
    tabindex: 0,
    spellcheck: false,
    style: normalizeStyle({
      "text-align": _ctx.textAlign,
      "width": _ctx.cellWidth,
      "background-color": _ctx.cellModified === false ? "inherit" : "var(--cell-modified-color)",
      "font-weight": _ctx.cellModified === false ? "inherit" : "bold",
      "padding-left": _ctx.getIndent(_ctx.colIndex, (_a = _ctx.TableData.display[_ctx.rowIndex]) == null ? void 0 : _a.indent)
    }),
    onFocus: _cache[0] || (_cache[0] = ($event) => _ctx.onFocus($event)),
    onPaste: _cache[1] || (_cache[1] = ($event) => _ctx.onChange($event)),
    onBlur: _cache[2] || (_cache[2] = ($event) => _ctx.onChange($event)),
    onInput: _cache[3] || (_cache[3] = ($event) => _ctx.onChange($event)),
    onKeydown: [
      _cache[4] || (_cache[4] = withKeys((...args) => _ctx.$parent.$parent.enterNav && _ctx.$parent.$parent.enterNav(...args), ["enter"])),
      _cache[5] || (_cache[5] = withKeys((...args) => _ctx.$parent.$parent.tabNav && _ctx.$parent.$parent.tabNav(...args), ["tab"])),
      _cache[6] || (_cache[6] = withKeys((...args) => _ctx.$parent.$parent.endNav && _ctx.$parent.$parent.endNav(...args), ["end"])),
      _cache[7] || (_cache[7] = withKeys((...args) => _ctx.$parent.$parent.homeNav && _ctx.$parent.$parent.homeNav(...args), ["home"])),
      _cache[8] || (_cache[8] = withKeys((...args) => _ctx.$parent.$parent.downArrowNav && _ctx.$parent.$parent.downArrowNav(...args), ["down"])),
      _cache[9] || (_cache[9] = withKeys((...args) => _ctx.$parent.$parent.upArrowNav && _ctx.$parent.$parent.upArrowNav(...args), ["up"])),
      _cache[10] || (_cache[10] = withKeys((...args) => _ctx.$parent.$parent.leftArrowNav && _ctx.$parent.$parent.leftArrowNav(...args), ["left"])),
      _cache[11] || (_cache[11] = withKeys((...args) => _ctx.$parent.$parent.rightArrowNav && _ctx.$parent.$parent.rightArrowNav(...args), ["right"]))
    ],
    onClick: _cache[12] || (_cache[12] = (...args) => _ctx.handleInput && _ctx.handleInput(...args)),
    innerHTML: _ctx.displayValue
  }, null, 44, _hoisted_1$2);
}
_sfc_main$3.render = _sfc_render$3;
_sfc_main$3.__scopeId = "data-v-f81c70ec";
var ATableHeader_vue_vue_type_style_index_0_scoped_true_lang = "\nth[data-v-bf1b4a04] {\n	background-color: var(--brand-color);\n	border-width: 0px;\n	border-style: solid;\n	border-color: var(--header-border-color);\n	border-radius: 0px;\n	color: var(--header-text-color);\n	padding-left: 0.5ch;\n	padding-right: 0.5ch;\n}\nth[data-v-bf1b4a04]:focus{\n	outline: none;\n}\n";
const _sfc_main$2 = defineComponent({
  name: "ATableHeader",
  props: {
    "columns": {
      type: Array,
      required: true
    },
    "config": {
      type: Object,
      default: () => {
        return {};
      }
    },
    "tableid": {
      type: String,
      required: true,
      default: () => {
        return void 0;
      }
    }
  },
  setup(props) {
    const TableData = inject(props.tableid);
    return { TableData };
  }
});
const _hoisted_1$1 = { key: 0 };
const _hoisted_2 = { tabindex: "-1" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.columns.length ? (openBlock(), createElementBlock("thead", _hoisted_1$1, [
    createElementVNode("tr", _hoisted_2, [
      _ctx.TableData.zeroColumn ? (openBlock(), createElementBlock("th", {
        key: 0,
        style: normalizeStyle({ "min-width": _ctx.TableData.numberedRowWidth })
      }, null, 4)) : createCommentVNode("", true),
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.columns, (column, colKey) => {
        return openBlock(), createElementBlock("th", {
          key: colKey,
          tabindex: "-1",
          style: normalizeStyle({
            "text-align": column.align !== void 0 ? column.align.toLowerCase() : "center",
            "min-width": column.width !== void 0 ? column.width : "40ch"
          })
        }, [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createTextVNode(toDisplayString(column.label !== void 0 ? column.label : String.fromCharCode(colKey + 97).toUpperCase()), 1)
          ], true)
        ], 4);
      }), 128))
    ])
  ])) : createCommentVNode("", true);
}
_sfc_main$2.render = _sfc_render$2;
_sfc_main$2.__scopeId = "data-v-bf1b4a04";
var ATableModal_vue_vue_type_style_index_0_scoped_true_lang = "\ndiv[data-v-5e464449] {\n	z-index: 100;\n	position: absolute;\n	background-color: var(--row-color-zebra-dark);\n	/* margin: 0px;\n  outline: none;\n  box-shadow: none;\n  color: var(--cell-text-color);\n  text-overflow: ellipsis;\n  overflow: hidden;\n	padding-left: 0.5ch;\n	padding-right: 0.5ch;\n	font-size: var(--table-font-size); */\n}\n";
const _sfc_main$1 = defineComponent({
  name: "ATableModal",
  props: {
    "colIndex": {
      type: Number,
      required: false,
      default: 0
    },
    "rowIndex": {
      type: Number,
      required: false,
      default: 0
    },
    "tableid": {
      type: String,
      required: false
    }
  },
  setup(props) {
    const TableData = inject(props.tableid);
    function handleInput(event) {
      event.stopPropagation();
    }
    return { TableData, handleInput };
  }
});
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
_sfc_main$1.render = _sfc_render$1;
_sfc_main$1.__scopeId = "data-v-5e464449";
var ATable_vue_vue_type_style_index_0_scoped_true_lang = "\ntable[data-v-455a3966] {\n  display: table;\n  border-collapse: var(--border-collapsed);\n	caret-color: var(--brand-color);\n}\nth[data-v-455a3966] {\n	box-sizing: border-box;\n  background-color: var(--brand-color);\n  border-width: 1px;\n  border-style: solid;\n  border-color: var(--header-border-color);\n  border-radius: 0px;\n  color: var(--header-text-color);\n}\ntr[data-v-455a3966] {\n  background-color: var(--row-color-zebra-light);\n  outline: none;\n}\ntr[data-v-455a3966]:nth-child(even) {\n  background-color: var(--row-color-zebra-dark);\n}\n";
const _sfc_main = defineComponent({
  name: "ATable",
  components: {
    ATableModal: _sfc_main$1,
    ARow: _sfc_main$4,
    ATableHeader: _sfc_main$2,
    ACell: _sfc_main$3
  },
  props: {
    "columns": {
      type: Array,
      required: true
    },
    "rows": {
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    },
    "config": {
      type: Object,
      default: () => {
        return {};
      }
    },
    "tableid": {
      type: String,
      default: () => {
        return void 0;
      }
    }
  },
  setup(props) {
    let TableData = new TableDataStore(props.id, props.columns, props.rows, props.config);
    provide(TableData.id, TableData);
    const formatCell = function(event = void 0, column = void 0, cellData = void 0) {
      let colIndex = void 0;
      if (event) {
        colIndex = event.target.cellIndex + (TableData.zeroColumn === true ? -1 : 0);
      } else if (column && cellData) {
        colIndex = TableData.columns.indexOf(column);
      }
      if (!column && "format" in TableData.columns[colIndex]) {
        event.target.innerHTML = TableData.columns[colIndex].format(event.target.innerHTML);
      } else if (cellData && "format" in column) {
        return column.format(cellData);
      } else if (cellData && column.type.toLowerCase() in ["int", "decimal", "float", "number", "percent"]) {
        return cellData;
      } else {
        return cellData;
      }
    };
    function enterNav(event) {
      event.preventDefault();
      event.stopPropagation();
      if (event.shiftKey === true) {
        upCell(event);
      } else {
        downCell(event);
      }
    }
    function tabNav(event) {
      event.preventDefault();
      event.stopPropagation();
      if (event.shiftKey === true) {
        prevCell(event);
      } else {
        nextCell(event);
      }
    }
    function downArrowNav(event) {
      if (event.shiftKey !== true) {
        event.preventDefault();
        event.stopPropagation();
        downCell(event);
      }
    }
    function upArrowNav(event) {
      if (event.shiftKey !== true) {
        event.preventDefault();
        event.stopPropagation();
        upCell(event);
      }
    }
    function leftArrowNav(event) {
      if (event.shiftKey !== true) {
        event.preventDefault();
        event.stopPropagation();
        prevCell(event);
      }
    }
    function rightArrowNav(event) {
      if (event.shiftKey !== true) {
        event.preventDefault();
        event.stopPropagation();
        nextCell(event);
      }
    }
    function endNav(event) {
      let nextCellEl = void 0;
      const cellIndex = event.target.cellIndex;
      const rowIndex = event.target.parentElement.rowIndex;
      const tableEl = event.target.parentElement.parentElement;
      if (tableEl.rows[rowIndex - 1].cells.length - 1 === cellIndex) {
        return;
      } else {
        nextCellEl = tableEl.rows[rowIndex - 1].cells[TableData.columns.length - (TableData.zeroColumn === true ? 0 : 1)];
      }
      nextCellEl.focus();
    }
    function homeNav(event) {
      let nextCellEl = void 0;
      const cellIndex = event.target.cellIndex;
      const rowIndex = event.target.parentElement.rowIndex;
      const tableEl = event.target.parentElement.parentElement;
      if (cellIndex === (TableData.config.numberedRows === true ? 1 : 0)) {
        return;
      } else {
        nextCellEl = tableEl.rows[rowIndex - 1].cells[TableData.zeroColumn === true ? 1 : 0];
      }
      nextCellEl.focus();
    }
    function downCell(event) {
      const cellIndex = event.target.cellIndex;
      const rowIndex = event.target.parentElement.rowIndex;
      const tableEl = event.target.parentElement.parentElement;
      let cell = void 0;
      if (tableEl.rows.length !== rowIndex) {
        cell = tableEl.rows[rowIndex].cells[cellIndex];
        if (TableData.config.treeView === true && TableData.display[rowIndex].open === false) {
          TableData.toggleRowExpand(rowIndex - 1);
        }
      } else {
        cell = event.target;
      }
      nextTick(function() {
        cell.focus();
      });
    }
    function upCell(event) {
      const cellIndex = event.target.cellIndex;
      const rowIndex = event.target.parentElement.rowIndex;
      const table = event.target.parentElement.parentElement;
      let cell = void 0;
      if (rowIndex !== 1) {
        cell = table.rows[rowIndex - 2].cells[cellIndex];
        if (TableData.config.treeView === true && TableData.display[rowIndex - 2].open === false) {
          TableData.toggleRowExpand(TableData.display[rowIndex - 2].parent);
        }
      } else {
        cell = event.target;
      }
      nextTick(function() {
        cell.focus();
      });
    }
    function nextCell(event) {
      let nextCellEl = void 0;
      const cellIndex = event.target.cellIndex;
      const rowIndex = event.target.parentElement.rowIndex;
      const tableEl = event.target.parentElement.parentElement;
      if (tableEl.rows[rowIndex - 1].cells.length - 1 === cellIndex) {
        if (tableEl.rows.length === rowIndex) {
          nextCellEl = tableEl.rows[0].cells[TableData.zeroColumn === true ? 1 : 0];
        } else {
          nextCellEl = tableEl.rows[rowIndex].cells[TableData.zeroColumn === true ? 1 : 0];
          if (TableData.config.treeView === true && TableData.display[rowIndex].open === false) {
            TableData.toggleRowExpand(rowIndex - 1);
          }
        }
      } else {
        nextCellEl = tableEl.rows[rowIndex - 1].cells[cellIndex + 1];
      }
      nextTick(function() {
        nextCellEl.focus();
      });
    }
    function prevCell(event) {
      let prevCellEl = void 0;
      const cellIndex = event.target.cellIndex;
      const rowIndex = event.target.parentElement.rowIndex;
      const tableEl = event.target.parentElement.parentElement;
      if (cellIndex === (TableData.zeroColumn === true ? 1 : 0)) {
        if (rowIndex !== 1) {
          prevCellEl = tableEl.rows[rowIndex - 2].cells[tableEl.rows[rowIndex - 2].cells.length - 1];
          TableData.toggleRowExpand(rowIndex - 2);
        } else {
          return;
        }
      } else {
        prevCellEl = tableEl.rows[rowIndex - 1].cells[cellIndex - 1];
      }
      prevCellEl.focus();
    }
    function moveCursorToEnd(target) {
      target.focus();
      document.execCommand("selectAll", false, null);
      document.getSelection().collapseToEnd();
    }
    function clickOutside(event) {
      if (!TableData.modal.parent) {
        return;
      }
      if (TableData.modal.parent.contains(event.target))
        ;
      else {
        if (!TableData.modal.visible) {
          return;
        } else {
          TableData.modal.visible = false;
        }
      }
    }
    window.addEventListener("click", clickOutside);
    return {
      TableData,
      v4,
      formatCell,
      enterNav,
      tabNav,
      downArrowNav,
      upArrowNav,
      leftArrowNav,
      rightArrowNav,
      homeNav,
      endNav,
      prevCell,
      nextCell,
      upCell,
      downCell,
      moveCursorToEnd
    };
  }
});
const _hoisted_1 = { class: "atable" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ATableHeader = resolveComponent("ATableHeader");
  const _component_ACell = resolveComponent("ACell");
  const _component_ARow = resolveComponent("ARow");
  const _component_ATableModal = resolveComponent("ATableModal");
  return openBlock(), createElementBlock("table", _hoisted_1, [
    renderSlot(_ctx.$slots, "tableheader", {}, () => [
      createVNode(_component_ATableHeader, {
        columns: _ctx.TableData.columns,
        config: _ctx.TableData.config,
        tableid: _ctx.TableData.id
      }, null, 8, ["columns", "config", "tableid"])
    ], true),
    createElementVNode("tbody", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.TableData.rows, (row, rowIndex) => {
        return openBlock(), createBlock(_component_ARow, {
          key: row.id || _ctx.v4(),
          row,
          rowIndex,
          tableid: _ctx.TableData.id
        }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.TableData.columns, (col, colIndex) => {
              return openBlock(), createBlock(_component_ACell, {
                key: colIndex,
                tableid: _ctx.TableData.id,
                col,
                tabindex: "0",
                spellcheck: "false",
                rowIndex,
                colIndex: colIndex + Number(_ctx.TableData.zeroColumn === true ? 0 : -1),
                style: normalizeStyle({
                  "text-align": col.align !== void 0 ? col.align.toLowerCase() : "center",
                  "min-width": col.width !== void 0 ? col.width : "40ch"
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
      colIndex: _ctx.TableData.modal.colIndex,
      rowIndex: _ctx.TableData.modal.rowIndex,
      tableid: _ctx.TableData.id,
      style: normalizeStyle({
        left: _ctx.TableData.modal.left + "px",
        top: _ctx.TableData.modal.top + "px",
        "max-width": _ctx.TableData.modal.width + "px"
      })
    }, {
      default: withCtx(() => [
        (openBlock(), createBlock(resolveDynamicComponent(_ctx.TableData.modal.component), {
          colIndex: _ctx.TableData.modal.colIndex,
          rowIndex: _ctx.TableData.modal.rowIndex,
          tableid: _ctx.TableData.id
        }, null, 8, ["colIndex", "rowIndex", "tableid"]))
      ]),
      _: 1
    }, 8, ["colIndex", "rowIndex", "tableid", "style"]), [
      [vShow, _ctx.TableData.modal.visible]
    ])
  ]);
}
_sfc_main.render = _sfc_render;
_sfc_main.__scopeId = "data-v-455a3966";
function install(app, options) {
  app.component("ATable", _sfc_main);
  app.component("ATableHeader", _sfc_main$2);
  app.component("ATableModal", _sfc_main$1);
}
var index = {
  install
};
export { index as default };
