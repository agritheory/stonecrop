(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("vue")) : typeof define === "function" && define.amd ? define(["vue"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global["@sedum/aform"] = factory(global.Vue));
})(this, function(vue) {
  "use strict";
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
      for (var i2 = 0; i2 < 16; ++i2) {
        buf[offset + i2] = rnds[i2];
      }
      return buf;
    }
    return stringify(rnds);
  }
  class TableDataStore {
    constructor(id, columns, rows, config, table, display) {
      this.id = id || v4();
      this.rows = rows;
      this.columns = vue.reactive(columns);
      this.config = vue.reactive(config);
      this.table = table || vue.reactive(this.createTableObject());
      this.display = this.createDisplayObject(display);
      this.modal = vue.reactive({ visible: false });
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
      let defaultDisplay = [Object.assign({}, { modified: false })];
      if ("0:0" in display) {
        return display;
      } else if ("default" in display) {
        defaultDisplay = display.default;
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
      return vue.reactive(defaultDisplay);
    }
    get zeroColumn() {
      return this.config.numberedRows || this.config.treeView;
    }
    get numberedRowWidth() {
      return vue.computed(() => {
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
  const _sfc_main$4 = vue.defineComponent({
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
      const tableData = vue.inject(props.tableid);
      let cellModified = vue.ref(false);
      const displayValue = vue.computed(() => {
        const data = tableData.cellData(props.colIndex, props.rowIndex);
        if (tableData.columns[props.colIndex].format) {
          return tableData.columns[props.colIndex].format(data);
        } else {
          return data;
        }
      });
      const handleInput = (event) => {
        if (tableData.columns[props.colIndex].mask)
          ;
        if (tableData.columns[props.colIndex].component) {
          if (vue.resolveDynamicComponent(tableData.columns[props.colIndex].component)) {
            const target = event.target;
            const domRect = target.getBoundingClientRect();
            tableData.modal.visible = true;
            tableData.modal.colIndex = props.colIndex;
            tableData.modal.rowIndex = props.rowIndex;
            tableData.modal.parent = target;
            tableData.modal.top = domRect.top + domRect.height;
            tableData.modal.left = domRect.left;
            tableData.modal.width = cellWidth.value;
            tableData.modal.component = tableData.columns[props.colIndex].component;
          }
        }
        return event;
      };
      const updateData = (event) => {
        if (event) {
          if (!tableData.columns[props.colIndex].component) {
            const target = event.target;
            tableData.setCellData(props.rowIndex, props.colIndex, target.innerHTML);
          }
          cellModified.value = true;
        }
      };
      const textAlign = vue.computed(() => {
        return tableData.columns[props.colIndex].align || "center";
      });
      const cellWidth = vue.computed(() => {
        return tableData.columns[props.colIndex].width || "40ch";
      });
      let currentData = "";
      const onFocus = (event) => {
        const target = event.target;
        currentData = target.innerText;
      };
      const onChange = (event) => {
        const target = event.target;
        if (target.innerHTML !== currentData) {
          currentData = target.innerText;
          target.dispatchEvent(new Event("change"));
          cellModified.value = true;
        }
      };
      const getIndent = (colKey, indent) => {
        if (indent && colKey === 0 && indent > 0) {
          return indent * 1 + "ch";
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
  const ACell_vue_vue_type_style_index_0_scoped_a7ef2d4f_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$2 = ["contenteditable", "innerHTML"];
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("td", {
      ref: "colIndex + ':' + rowIndex",
      contenteditable: _ctx.tableData.columns[_ctx.colIndex].edit,
      tabindex: 0,
      spellcheck: false,
      style: vue.normalizeStyle(_ctx.cellStyle),
      onFocus: _cache[0] || (_cache[0] = ($event) => _ctx.onFocus($event)),
      onPaste: _cache[1] || (_cache[1] = ($event) => _ctx.onChange($event)),
      onBlur: _cache[2] || (_cache[2] = ($event) => _ctx.onChange($event)),
      onInput: _cache[3] || (_cache[3] = ($event) => _ctx.onChange($event)),
      onKeydown: [
        _cache[4] || (_cache[4] = vue.withKeys((...args) => _ctx.$parent.$parent.enterNav && _ctx.$parent.$parent.enterNav(...args), ["enter"])),
        _cache[5] || (_cache[5] = vue.withKeys((...args) => _ctx.$parent.$parent.tabNav && _ctx.$parent.$parent.tabNav(...args), ["tab"])),
        _cache[6] || (_cache[6] = vue.withKeys((...args) => _ctx.$parent.$parent.endNav && _ctx.$parent.$parent.endNav(...args), ["end"])),
        _cache[7] || (_cache[7] = vue.withKeys((...args) => _ctx.$parent.$parent.homeNav && _ctx.$parent.$parent.homeNav(...args), ["home"])),
        _cache[8] || (_cache[8] = vue.withKeys((...args) => _ctx.$parent.$parent.downArrowNav && _ctx.$parent.$parent.downArrowNav(...args), ["down"])),
        _cache[9] || (_cache[9] = vue.withKeys((...args) => _ctx.$parent.$parent.upArrowNav && _ctx.$parent.$parent.upArrowNav(...args), ["up"])),
        _cache[10] || (_cache[10] = vue.withKeys((...args) => _ctx.$parent.$parent.leftArrowNav && _ctx.$parent.$parent.leftArrowNav(...args), ["left"])),
        _cache[11] || (_cache[11] = vue.withKeys((...args) => _ctx.$parent.$parent.rightArrowNav && _ctx.$parent.$parent.rightArrowNav(...args), ["right"]))
      ],
      onClick: _cache[12] || (_cache[12] = (...args) => _ctx.handleInput && _ctx.handleInput(...args)),
      innerHTML: _ctx.displayValue
    }, null, 44, _hoisted_1$2);
  }
  const ACell = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-a7ef2d4f"]]);
  const _sfc_main$3 = vue.defineComponent({
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
      const tableData = vue.inject(props.tableid);
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
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("tr", null, [
      _ctx.tableData.config.numberedRows ? (vue.openBlock(), vue.createElementBlock("td", {
        key: 0,
        style: vue.normalizeStyle(_ctx.numberedRowStyle)
      }, vue.toDisplayString(_ctx.rowIndex + 1), 5)) : vue.createCommentVNode("", true),
      _ctx.tableData.config.treeView ? (vue.openBlock(), vue.createElementBlock("td", {
        key: 1,
        style: vue.normalizeStyle(_ctx.treeRowStyle),
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.toggleRowExpand(_ctx.rowIndex))
      }, vue.toDisplayString(_ctx.getRowExpandSymbol()), 5)) : vue.createCommentVNode("", true),
      !_ctx.tableData.config.numberedRows && !_ctx.tableData.config.treeView ? vue.renderSlot(_ctx.$slots, "indexCell", { key: 2 }) : vue.createCommentVNode("", true),
      vue.renderSlot(_ctx.$slots, "default")
    ], 512)), [
      [vue.vShow, _ctx.rowVisible()]
    ]);
  }
  const ARow = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
  const _sfc_main$2 = vue.defineComponent({
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
      const tableData = vue.inject(props.tableid);
      return { tableData };
    }
  });
  const ATableHeader_vue_vue_type_style_index_0_scoped_80fa6b2a_lang = "";
  const _hoisted_1$1 = { key: 0 };
  const _hoisted_2 = { tabindex: "-1" };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return _ctx.columns.length ? (vue.openBlock(), vue.createElementBlock("thead", _hoisted_1$1, [
      vue.createElementVNode("tr", _hoisted_2, [
        _ctx.tableData.zeroColumn ? (vue.openBlock(), vue.createElementBlock("th", {
          key: 0,
          style: vue.normalizeStyle({ minWidth: _ctx.tableData.numberedRowWidth.value })
        }, null, 4)) : vue.createCommentVNode("", true),
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.columns, (column, colKey) => {
          var _a;
          return vue.openBlock(), vue.createElementBlock("th", {
            key: colKey,
            tabindex: "-1",
            style: vue.normalizeStyle({
              textAlign: ((_a = column.align) == null ? void 0 : _a.toLowerCase()) || "center",
              minWidth: column.width || "40ch"
            })
          }, [
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              vue.createTextVNode(vue.toDisplayString(column.label || String.fromCharCode(colKey + 97).toUpperCase()), 1)
            ], true)
          ], 4);
        }), 128))
      ])
    ])) : vue.createCommentVNode("", true);
  }
  const ATableHeader = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-80fa6b2a"]]);
  const _sfc_main$1 = vue.defineComponent({
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
      const tableData = vue.inject(props.tableid);
      const handleInput = (event) => {
        event.stopPropagation();
      };
      return { tableData, handleInput };
    }
  });
  const ATableModal_vue_vue_type_style_index_0_scoped_25016cc4_lang = "";
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
      ref: "amodal",
      class: "amodal",
      tabindex: "-1",
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleInput && _ctx.handleInput(...args)),
      onInput: _cache[1] || (_cache[1] = (...args) => _ctx.handleInput && _ctx.handleInput(...args))
    }, [
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ], 544);
  }
  const ATableModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-25016cc4"]]);
  const _sfc_main = vue.defineComponent({
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
      vue.provide(tableData.id, tableData);
      const formatCell = (event, column, cellData) => {
        let colIndex;
        const target = event == null ? void 0 : event.target;
        if (event) {
          colIndex = target.cellIndex + (tableData.zeroColumn ? -1 : 0);
        } else if (column && cellData) {
          colIndex = tableData.columns.indexOf(column);
        }
        if (!column && "format" in tableData.columns[colIndex]) {
          target.innerHTML = tableData.columns[colIndex].format(target.innerHTML);
        } else if (cellData && "format" in column) {
          return column.format(cellData);
        } else if (cellData && column.type.toLowerCase() in ["int", "decimal", "float", "number", "percent"]) {
          return cellData;
        } else {
          return cellData;
        }
      };
      const getIndent = (colKey, indent) => {
        if (indent && colKey === 0 && indent > 0) {
          return indent * 1 + "ch";
        } else {
          return null;
        }
      };
      const enterNav = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.shiftKey ? upCell(event) : downCell(event);
      };
      const tabNav = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.shiftKey ? prevCell(event) : nextCell(event);
      };
      const downArrowNav = (event) => {
        if (!event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          downCell(event);
        }
      };
      const upArrowNav = (event) => {
        if (!event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          upCell(event);
        }
      };
      const leftArrowNav = (event) => {
        if (!event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          prevCell(event);
        }
      };
      const rightArrowNav = (event) => {
        if (!event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          nextCell(event);
        }
      };
      const endNav = (event) => {
        const $cell = event.target;
        const cellIndex = $cell.cellIndex;
        const $row = $cell.parentElement;
        const rowIndex = $row.rowIndex;
        const $table = $row.parentElement;
        const $lastRow = $table.rows[rowIndex - 1];
        if ($lastRow.cells.length - 1 !== cellIndex) {
          const $nextCell = $lastRow.cells[tableData.columns.length - (tableData.zeroColumn ? 0 : 1)];
          $nextCell.focus();
        }
      };
      const homeNav = (event) => {
        const $cell = event.target;
        const cellIndex = $cell.cellIndex;
        const $row = $cell.parentElement;
        const rowIndex = $row.rowIndex;
        const $table = $row.parentElement;
        const $lastRow = $table.rows[rowIndex - 1];
        if (cellIndex !== (tableData.config.numberedRows ? 1 : 0)) {
          const $nextCell = $lastRow.cells[tableData.zeroColumn ? 1 : 0];
          $nextCell.focus();
        }
      };
      const downCell = (event) => {
        const $cell = event.target;
        const cellIndex = $cell.cellIndex;
        const $row = $cell.parentElement;
        const rowIndex = $row.rowIndex;
        const $table = $row.parentElement;
        let $nextCell = event.target;
        if ($table.rows.length !== rowIndex) {
          $nextCell = $table.rows[rowIndex].cells[cellIndex];
          if (tableData.config.treeView && !tableData.display[rowIndex].open) {
            tableData.toggleRowExpand(rowIndex - 1);
          }
        }
        vue.nextTick(() => {
          $nextCell.focus();
        });
      };
      const upCell = (event) => {
        const $cell = event.target;
        const cellIndex = $cell.cellIndex;
        const $row = $cell.parentElement;
        const rowIndex = $row.rowIndex;
        const $table = $row.parentElement;
        let $nextCell = event.target;
        if (rowIndex !== 1) {
          $nextCell = $table.rows[rowIndex - 2].cells[cellIndex];
          if (tableData.config.treeView && !tableData.display[rowIndex - 2].open) {
            tableData.toggleRowExpand(tableData.display[rowIndex - 2].parent);
          }
        }
        vue.nextTick(() => {
          $nextCell.focus();
        });
      };
      const nextCell = (event) => {
        const $cell = event.target;
        const cellIndex = $cell.cellIndex;
        const $row = $cell.parentElement;
        const rowIndex = $row.rowIndex;
        const $table = $row.parentElement;
        let $nextCell;
        const $lastRow = $table.rows[rowIndex - 1];
        if ($lastRow.cells.length - 1 === cellIndex) {
          if ($table.rows.length === rowIndex) {
            $nextCell = $table.rows[0].cells[tableData.zeroColumn ? 1 : 0];
          } else {
            $nextCell = $table.rows[rowIndex].cells[tableData.zeroColumn ? 1 : 0];
            if (tableData.config.treeView && !tableData.display[rowIndex].open) {
              tableData.toggleRowExpand(rowIndex - 1);
            }
          }
        } else {
          $nextCell = $lastRow.cells[cellIndex + 1];
        }
        vue.nextTick(() => {
          $nextCell.focus();
        });
      };
      const prevCell = (event) => {
        const $cell = event.target;
        const cellIndex = $cell.cellIndex;
        const $row = $cell.parentElement;
        const rowIndex = $row.rowIndex;
        const $table = $row.parentElement;
        let $prevCell;
        const $lastRow = $table.rows[rowIndex - 1];
        const $secondLastRow = $table.rows[rowIndex - 2];
        if (cellIndex === (tableData.zeroColumn ? 1 : 0)) {
          if (rowIndex !== 1) {
            $prevCell = $secondLastRow.cells[$secondLastRow.cells.length - 1];
            tableData.toggleRowExpand(rowIndex - 2);
          } else {
            return;
          }
        } else {
          $prevCell = $lastRow.cells[cellIndex - 1];
        }
        $prevCell.focus();
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
        downArrowNav,
        downCell,
        endNav,
        enterNav,
        formatCell,
        getIndent,
        homeNav,
        leftArrowNav,
        moveCursorToEnd,
        nextCell,
        prevCell,
        rightArrowNav,
        tableData,
        tabNav,
        upArrowNav,
        upCell,
        v4
      };
    }
  });
  const ATable_vue_vue_type_style_index_0_scoped_512776fb_lang = "";
  const _hoisted_1 = { class: "atable" };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ATableHeader = vue.resolveComponent("ATableHeader");
    const _component_ACell = vue.resolveComponent("ACell");
    const _component_ARow = vue.resolveComponent("ARow");
    const _component_ATableModal = vue.resolveComponent("ATableModal");
    return vue.openBlock(), vue.createElementBlock("table", _hoisted_1, [
      vue.renderSlot(_ctx.$slots, "tableheader", {}, () => [
        vue.createVNode(_component_ATableHeader, {
          columns: _ctx.tableData.columns,
          config: _ctx.tableData.config,
          tableid: _ctx.tableData.id
        }, null, 8, ["columns", "config", "tableid"])
      ], true),
      vue.createElementVNode("tbody", null, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.tableData.rows, (row, rowIndex) => {
          return vue.openBlock(), vue.createBlock(_component_ARow, {
            key: row.id || _ctx.v4(),
            row,
            rowIndex,
            tableid: _ctx.tableData.id
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.tableData.columns, (col, colIndex) => {
                var _a;
                return vue.openBlock(), vue.createBlock(_component_ACell, {
                  key: colIndex,
                  tableid: _ctx.tableData.id,
                  col,
                  tabindex: "0",
                  spellcheck: "false",
                  rowIndex,
                  colIndex: colIndex + (_ctx.tableData.zeroColumn ? 0 : -1),
                  style: vue.normalizeStyle({
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
      vue.renderSlot(_ctx.$slots, "footer", {}, void 0, true),
      vue.withDirectives(vue.createVNode(_component_ATableModal, {
        colIndex: _ctx.tableData.modal.colIndex,
        rowIndex: _ctx.tableData.modal.rowIndex,
        tableid: _ctx.tableData.id,
        style: vue.normalizeStyle({
          left: _ctx.tableData.modal.left + "px",
          top: _ctx.tableData.modal.top + "px",
          maxWidth: _ctx.tableData.modal.width + "px"
        })
      }, {
        default: vue.withCtx(() => [
          (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tableData.modal.component), {
            colIndex: _ctx.tableData.modal.colIndex,
            rowIndex: _ctx.tableData.modal.rowIndex,
            tableid: _ctx.tableData.id
          }, null, 8, ["colIndex", "rowIndex", "tableid"]))
        ]),
        _: 1
      }, 8, ["colIndex", "rowIndex", "tableid", "style"]), [
        [vue.vShow, _ctx.tableData.modal.visible]
      ])
    ]);
  }
  const ATable = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-512776fb"]]);
  function install(app) {
    app.component("ATable", ATable);
    app.component("ATableHeader", ATableHeader);
    app.component("ATableModal", ATableModal);
  }
  const index = {
    install
  };
  return index;
});
