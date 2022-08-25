(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("vue")) : typeof define === "function" && define.amd ? define(["exports", "vue"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["@sedum/aform"] = {}, global.Vue));
})(this, function(exports2, vue) {
  "use strict";
  const _sfc_main$6 = vue.defineComponent({
    name: "AComboBox",
    props: ["event", "cellData", "tableID"]
  });
  const _export_sfc$1 = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$3 = /* @__PURE__ */ vue.createElementVNode("div", null, [
    /* @__PURE__ */ vue.createElementVNode("input", { type: "text" }),
    /* @__PURE__ */ vue.createElementVNode("input", { type: "text" }),
    /* @__PURE__ */ vue.createElementVNode("input", { type: "text" })
  ], -1);
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ATableModal = vue.resolveComponent("ATableModal");
    return vue.openBlock(), vue.createBlock(_component_ATableModal, {
      event: _ctx.event,
      cellData: _ctx.cellData,
      class: "amodal"
    }, {
      default: vue.withCtx(() => [
        _hoisted_1$3
      ]),
      _: 1
    }, 8, ["event", "cellData"]);
  }
  const AComboBox = /* @__PURE__ */ _export_sfc$1(_sfc_main$6, [["render", _sfc_render$6]]);
  function useKeyboardNav(tableData) {
    const enterNav = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.shiftKey ? await upCell(event) : await downCell(event);
    };
    const tabNav = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.shiftKey ? await prevCell(event) : await nextCell(event);
    };
    const downArrowNav = async (event) => {
      if (!event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        await downCell(event);
      }
    };
    const upArrowNav = async (event) => {
      if (!event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        await upCell(event);
      }
    };
    const leftArrowNav = async (event) => {
      if (!event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        await prevCell(event);
      }
    };
    const rightArrowNav = async (event) => {
      if (!event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        await nextCell(event);
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
    const downCell = async (event) => {
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
      await vue.nextTick();
      $nextCell.focus();
    };
    const upCell = async (event) => {
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
      await vue.nextTick();
      $nextCell.focus();
    };
    const nextCell = async (event) => {
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
      await vue.nextTick();
      $nextCell.focus();
    };
    const prevCell = async (event) => {
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
      await vue.nextTick();
      $prevCell.focus();
    };
    return {
      downArrowNav,
      downCell,
      endNav,
      enterNav,
      homeNav,
      leftArrowNav,
      nextCell,
      prevCell,
      rightArrowNav,
      tabNav,
      upArrowNav,
      upCell
    };
  }
  const _sfc_main$4$1 = vue.defineComponent({
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
      const { enterNav, tabNav, endNav, homeNav, downArrowNav, upArrowNav, leftArrowNav, rightArrowNav } = useKeyboardNav(tableData);
      let cellModified = vue.ref(false);
      const displayValue = vue.computed(() => {
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
        cellModified,
        cellStyle,
        cellWidth,
        displayValue,
        downArrowNav,
        endNav,
        enterNav,
        getIndent,
        handleInput,
        homeNav,
        leftArrowNav,
        onChange,
        onFocus,
        rightArrowNav,
        tableData,
        tabNav,
        textAlign,
        upArrowNav,
        updateData
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$2 = ["contenteditable"];
  function _sfc_render$4$1(_ctx, _cache, $props, $setup, $data, $options) {
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
        _cache[4] || (_cache[4] = vue.withKeys((...args) => _ctx.enterNav && _ctx.enterNav(...args), ["enter"])),
        _cache[5] || (_cache[5] = vue.withKeys((...args) => _ctx.tabNav && _ctx.tabNav(...args), ["tab"])),
        _cache[6] || (_cache[6] = vue.withKeys((...args) => _ctx.endNav && _ctx.endNav(...args), ["end"])),
        _cache[7] || (_cache[7] = vue.withKeys((...args) => _ctx.homeNav && _ctx.homeNav(...args), ["home"])),
        _cache[8] || (_cache[8] = vue.withKeys((...args) => _ctx.downArrowNav && _ctx.downArrowNav(...args), ["down"])),
        _cache[9] || (_cache[9] = vue.withKeys((...args) => _ctx.upArrowNav && _ctx.upArrowNav(...args), ["up"])),
        _cache[10] || (_cache[10] = vue.withKeys((...args) => _ctx.leftArrowNav && _ctx.leftArrowNav(...args), ["left"])),
        _cache[11] || (_cache[11] = vue.withKeys((...args) => _ctx.rightArrowNav && _ctx.rightArrowNav(...args), ["right"]))
      ],
      onClick: _cache[12] || (_cache[12] = (...args) => _ctx.handleInput && _ctx.handleInput(...args))
    }, vue.toDisplayString(_ctx.displayValue), 45, _hoisted_1$2);
  }
  const ACell = /* @__PURE__ */ _export_sfc(_sfc_main$4$1, [["render", _sfc_render$4$1], ["__scopeId", "data-v-32475309"]]);
  const _sfc_main$3$1 = vue.defineComponent({
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
  function _sfc_render$3$1(_ctx, _cache, $props, $setup, $data, $options) {
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
  const ARow = /* @__PURE__ */ _export_sfc(_sfc_main$3$1, [["render", _sfc_render$3$1]]);
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
  const _sfc_main$2$1 = vue.defineComponent({
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
  const _hoisted_1$1$1 = { key: 0 };
  const _hoisted_2$2 = { tabindex: "-1" };
  function _sfc_render$2$1(_ctx, _cache, $props, $setup, $data, $options) {
    return _ctx.columns.length ? (vue.openBlock(), vue.createElementBlock("thead", _hoisted_1$1$1, [
      vue.createElementVNode("tr", _hoisted_2$2, [
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
  const ATableHeader = /* @__PURE__ */ _export_sfc(_sfc_main$2$1, [["render", _sfc_render$2$1], ["__scopeId", "data-v-80fa6b2a"]]);
  const _sfc_main$1$1 = vue.defineComponent({
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
  function _sfc_render$1$1(_ctx, _cache, $props, $setup, $data, $options) {
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
  const ATableModal = /* @__PURE__ */ _export_sfc(_sfc_main$1$1, [["render", _sfc_render$1$1], ["__scopeId", "data-v-33741903"]]);
  vue.defineComponent({
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
        formatCell,
        moveCursorToEnd,
        tableData,
        v4
      };
    }
  });
  const _sfc_main$5 = vue.defineComponent({
    name: "ADate",
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
      },
      event: {
        type: Event
      },
      indent: {
        type: Number,
        default: 0
      }
    },
    setup(props) {
      const tableData = vue.inject(props.tableid);
      const { enterNav, tabNav, endNav, homeNav, downArrowNav, upArrowNav, leftArrowNav, rightArrowNav } = useKeyboardNav(tableData);
      const numberOfRows = 6;
      const numberOfColumns = 7;
      const todaysDate = new Date();
      let currentMonth = vue.ref(todaysDate.getMonth());
      let currentYear = vue.ref(todaysDate.getFullYear());
      let selectedDate = vue.ref(tableData.cellData(props.colIndex, props.rowIndex));
      let currentDates = vue.ref([]);
      let width = vue.ref("");
      const renderMonth = () => {
        const firstOfMonth = new Date(currentYear.value, currentMonth.value, 1);
        const monthStartWeekday = firstOfMonth.getDay();
        const calendarStartDay = firstOfMonth.setDate(firstOfMonth.getDate() - monthStartWeekday);
        for (let i2 of Array(43).keys()) {
          currentDates.value.push(calendarStartDay + i2 * 84e6);
        }
      };
      const handlePageDown = (event) => {
        event.shiftKey ? previousYear() : previousMonth();
      };
      const handlePageUp = (event) => {
        event.shiftKey ? nextYear() : nextMonth();
      };
      const previousYear = () => {
        currentYear.value -= 1;
      };
      const nextYear = () => {
        currentYear.value += 1;
      };
      const previousMonth = () => {
        if (currentMonth.value == 0) {
          currentMonth.value = 11;
          currentYear.value -= 1;
        } else {
          currentMonth.value -= 1;
        }
      };
      const nextMonth = () => {
        if (currentMonth.value == 11) {
          currentMonth.value = 0;
          currentYear.value += 1;
        } else {
          currentMonth.value += 1;
        }
      };
      const today = (day) => {
        if (currentMonth.value !== todaysDate.getMonth()) {
          return;
        }
        return todaysDate.toDateString() === new Date(day).toDateString();
      };
      const isSelectedDate = function(day) {
        return new Date(day).toDateString() === new Date(selectedDate.value).toDateString();
      };
      const selectDate = function(event, currentIndex) {
        selectedDate.value = currentDates.value[currentIndex];
        updateData();
        event.preventDefault();
        event.stopPropagation();
      };
      const updateData = function() {
        tableData.setCellData(props.rowIndex, props.colIndex, selectedDate.value);
      };
      vue.onMounted(() => {
        renderMonth();
      });
      const dayWidth = vue.computed(() => {
        const widthValue = Number(width.value.replace("px", ""));
        return `${widthValue / (numberOfColumns - 1)}px`;
      });
      const monthAndYear = vue.computed(() => {
        return new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString(void 0, {
          year: "numeric",
          month: "long"
        });
      });
      const cellStyle = {
        border: "2px solid var(--focus-cell-outline)"
      };
      vue.watch(currentMonth, () => {
        currentDates.value = [];
        renderMonth();
      });
      vue.watch(currentYear, () => {
        currentDates.value = [];
        renderMonth();
      });
      return {
        cellStyle,
        currentDates,
        currentMonth,
        currentYear,
        dayWidth,
        downArrowNav,
        endNav,
        enterNav,
        handlePageDown,
        handlePageUp,
        homeNav,
        isSelectedDate,
        leftArrowNav,
        monthAndYear,
        nextMonth,
        numberOfColumns,
        numberOfRows,
        previousMonth,
        rightArrowNav,
        selectDate,
        selectedDate,
        tableData,
        tabNav,
        today,
        upArrowNav,
        updateData,
        width
      };
    }
  });
  const ADate_vue_vue_type_style_index_0_scoped_e0bca036_lang = "";
  const _hoisted_1$1 = ["event", "colIndex", "rowIndex", "tableid"];
  const _hoisted_2$1 = { colspan: "5" };
  const _hoisted_3$1 = ["contenteditable", "onClick"];
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
      event: _ctx.event,
      colIndex: _ctx.colIndex,
      rowIndex: _ctx.rowIndex,
      tableid: _ctx.tableid,
      class: "adate",
      tabindex: "0",
      ref: "adatepicker"
    }, [
      vue.createElementVNode("table", {
        onKeydown: [
          _cache[10] || (_cache[10] = vue.withKeys((...args) => _ctx.handlePageDown && _ctx.handlePageDown(...args), ["page-down"])),
          _cache[11] || (_cache[11] = vue.withKeys((...args) => _ctx.handlePageUp && _ctx.handlePageUp(...args), ["page-up"]))
        ]
      }, [
        vue.createElementVNode("tr", null, [
          vue.createElementVNode("td", {
            onClick: _cache[0] || (_cache[0] = (...args) => _ctx.previousMonth && _ctx.previousMonth(...args)),
            tabindex: "-1"
          }, "<"),
          vue.createElementVNode("th", _hoisted_2$1, vue.toDisplayString(_ctx.monthAndYear), 1),
          vue.createElementVNode("td", {
            onClick: _cache[1] || (_cache[1] = (...args) => _ctx.nextMonth && _ctx.nextMonth(...args)),
            tabindex: "-1"
          }, ">")
        ]),
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.numberOfRows, (rowNo) => {
          return vue.openBlock(), vue.createElementBlock("tr", { key: rowNo }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.numberOfColumns, (colNo) => {
              return vue.openBlock(), vue.createElementBlock("td", {
                key: (rowNo - 1) * _ctx.numberOfColumns + colNo,
                contenteditable: _ctx.tableData.columns[_ctx.colIndex].edit,
                tabindex: 0,
                spellcheck: false,
                style: vue.normalizeStyle({
                  border: _ctx.isSelectedDate(_ctx.currentDates[(rowNo - 1) * _ctx.numberOfColumns + colNo]) ? "2px solid var(--focus-cell-outline)" : "none",
                  borderBottomColor: _ctx.today(_ctx.currentDates[(rowNo - 1) * _ctx.numberOfColumns + colNo]) ? "var(--focus-cell-outline)" : "none"
                }),
                onClick: ($event) => _ctx.selectDate($event, (rowNo - 1) * _ctx.numberOfColumns + colNo),
                onKeydown: [
                  _cache[2] || (_cache[2] = vue.withKeys((...args) => _ctx.enterNav && _ctx.enterNav(...args), ["enter"])),
                  _cache[3] || (_cache[3] = vue.withKeys((...args) => _ctx.tabNav && _ctx.tabNav(...args), ["tab"])),
                  _cache[4] || (_cache[4] = vue.withKeys((...args) => _ctx.endNav && _ctx.endNav(...args), ["end"])),
                  _cache[5] || (_cache[5] = vue.withKeys((...args) => _ctx.homeNav && _ctx.homeNav(...args), ["home"])),
                  _cache[6] || (_cache[6] = vue.withKeys((...args) => _ctx.downArrowNav && _ctx.downArrowNav(...args), ["down"])),
                  _cache[7] || (_cache[7] = vue.withKeys((...args) => _ctx.upArrowNav && _ctx.upArrowNav(...args), ["up"])),
                  _cache[8] || (_cache[8] = vue.withKeys((...args) => _ctx.leftArrowNav && _ctx.leftArrowNav(...args), ["left"])),
                  _cache[9] || (_cache[9] = vue.withKeys((...args) => _ctx.rightArrowNav && _ctx.rightArrowNav(...args), ["right"]))
                ],
                class: vue.normalizeClass({
                  todaysdate: _ctx.today(_ctx.currentDates[(rowNo - 1) * _ctx.numberOfColumns + colNo]),
                  selecteddate: _ctx.isSelectedDate(_ctx.currentDates[(rowNo - 1) * _ctx.numberOfColumns + colNo])
                })
              }, vue.toDisplayString(new Date(_ctx.currentDates[(rowNo - 1) * _ctx.numberOfColumns + colNo]).getDate()), 47, _hoisted_3$1);
            }), 128))
          ]);
        }), 128))
      ], 32)
    ], 8, _hoisted_1$1);
  }
  const ADate = /* @__PURE__ */ _export_sfc$1(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-e0bca036"]]);
  const _sfc_main$4 = vue.defineComponent({
    name: "AForm",
    props: {
      schema: {
        type: Array,
        required: true
      },
      data: {
        type: Array,
        required: true
      },
      formId: {
        type: Number
      }
    },
    setup(props) {
      const formData = vue.ref(props.data || {});
      const componentProps = (componentObj) => {
        let propsToPass = {};
        for (const [key, value] of Object.entries(componentObj)) {
          if (!["component", "fieldtype"].includes(key)) {
            propsToPass[key] = value;
          }
        }
        return propsToPass;
      };
      return { formData, componentProps };
    }
  });
  const AForm_vue_vue_type_style_index_0_scoped_56233342_lang = "";
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("form", null, [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.schema, (componentObj, key) => {
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(componentObj.component), vue.mergeProps({
          key,
          schema: componentObj
        }, _ctx.componentProps(componentObj), {
          value: _ctx.formData[componentObj.fieldname]
        }), null, 16, ["schema", "value"]);
      }), 128))
    ]);
  }
  const AForm = /* @__PURE__ */ _export_sfc$1(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-56233342"]]);
  const _sfc_main$3 = vue.defineComponent({
    props: {
      collapsed: {
        type: Boolean,
        required: true
      }
    }
  });
  const CollapseButton_vue_vue_type_style_index_0_scoped_5f720483_lang = "";
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("button", {
      class: vue.normalizeClass(["collapse-button", _ctx.collapsed ? "rotated" : "unrotated"])
    }, "\xD7", 2);
  }
  const CollapseButton = /* @__PURE__ */ _export_sfc$1(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-5f720483"]]);
  const _sfc_main$2 = vue.defineComponent({
    name: "AFieldset",
    components: { AForm, CollapseButton },
    props: {
      schema: {
        type: Array,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      collapsible: {
        type: Boolean
      },
      value: { required: false }
    },
    setup(props) {
      const formData = vue.ref(props.data || []);
      let collapsed = vue.ref(false);
      let collapsible = vue.ref(props.collapsible);
      function toggleCollapse(e) {
        e.preventDefault();
        if (!collapsible.value) {
          return;
        }
        collapsed.value = !collapsed.value;
      }
      return { formData, collapsed, toggleCollapse };
    }
  });
  const AFieldset_vue_vue_type_style_index_0_scoped_2ee1d08c_lang = "";
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CollapseButton = vue.resolveComponent("CollapseButton");
    const _component_AForm = vue.resolveComponent("AForm");
    return vue.openBlock(), vue.createElementBlock("fieldset", null, [
      vue.createElementVNode("legend", {
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.toggleCollapse($event)),
        onSubmit: _cache[1] || (_cache[1] = ($event) => _ctx.toggleCollapse($event))
      }, [
        vue.createTextVNode(vue.toDisplayString(_ctx.label) + " ", 1),
        _ctx.collapsible ? (vue.openBlock(), vue.createBlock(_component_CollapseButton, {
          key: 0,
          collapsed: _ctx.collapsed
        }, null, 8, ["collapsed"])) : vue.createCommentVNode("", true)
      ], 32),
      vue.withDirectives(vue.createVNode(_component_AForm, {
        schema: _ctx.schema,
        data: _ctx.formData
      }, null, 8, ["schema", "data"]), [
        [vue.vShow, !_ctx.collapsed]
      ])
    ]);
  }
  const AFieldset = /* @__PURE__ */ _export_sfc$1(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-2ee1d08c"]]);
  const _sfc_main$1 = vue.defineComponent({
    name: "ANumericInput",
    props: {
      value: { required: false },
      required: {
        type: Boolean
      },
      label: {
        type: String,
        required: true
      },
      readOnly: {
        type: Boolean
      },
      uuid: {
        type: String
      },
      validation: {
        type: Object,
        default: () => ({ errorMessage: "&nbsp;" })
      }
    },
    setup(props, context) {
      const amount = vue.ref("");
      const update = (event) => {
        const value = event.target.value;
        context.emit("update:value", value);
      };
      return { amount, update };
    }
  });
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ATextInput = vue.resolveComponent("ATextInput");
    return vue.openBlock(), vue.createBlock(_component_ATextInput, {
      label: _ctx.label,
      readOnly: _ctx.readOnly,
      uuid: _ctx.uuid,
      validation: _ctx.validation,
      modelValue: _ctx.amount,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.amount = $event)
    }, null, 8, ["label", "readOnly", "uuid", "validation", "modelValue"]);
  }
  const ANumericInput = /* @__PURE__ */ _export_sfc$1(_sfc_main$1, [["render", _sfc_render$1]]);
  const NAMED_MASKS = {
    date: "##/##/####",
    datetime: "####/##/## ##:##",
    time: "##:##",
    fulltime: "##:##:##",
    phone: "(###) ### - ####",
    card: "#### #### #### ####"
  };
  function extractMaskFn(mask) {
    try {
      return Function(`"use strict";return (${mask})`)();
    } catch (error) {
    }
  }
  function getMask(binding) {
    var _a;
    let mask = binding.value;
    if (mask) {
      const maskFn = extractMaskFn(mask);
      if (maskFn) {
        const locale = binding.instance["locale"];
        mask = maskFn(locale);
      }
    } else {
      const schema = binding.instance["schema"];
      const fieldType = (_a = schema.fieldtype) == null ? void 0 : _a.toLowerCase();
      if (fieldType && NAMED_MASKS[fieldType]) {
        mask = NAMED_MASKS[fieldType];
      }
    }
    return mask;
  }
  function unmaskInput(input, maskToken) {
    if (!maskToken) {
      maskToken = "#";
    }
    let unmaskedInput = input;
    const maskChars = [maskToken, "/", "-", "(", ")", " "];
    for (const char of maskChars) {
      unmaskedInput = unmaskedInput.replaceAll(char, "");
    }
    return unmaskedInput;
  }
  function fillMask(input, mask, maskToken) {
    if (!maskToken) {
      maskToken = "#";
    }
    let replacement = mask;
    for (const inputChar of input) {
      const replaceIndex = replacement.indexOf(maskToken);
      if (replaceIndex !== -1) {
        const prefix = replacement.substring(0, replaceIndex);
        const suffix = replacement.substring(replaceIndex + 1);
        replacement = prefix + inputChar + suffix;
      }
    }
    return replacement.slice(0, mask.length);
  }
  function useStringMask(el, binding) {
    const mask = getMask(binding);
    if (!mask)
      return;
    const maskToken = "#";
    const inputText = el.value;
    const unmaskedInput = unmaskInput(inputText, maskToken);
    if (unmaskedInput) {
      const replacement = fillMask(unmaskedInput, mask, maskToken);
      if (binding.instance["maskFilled"]) {
        binding.instance["maskFilled"] = !replacement.includes(maskToken);
      }
      el.value = replacement;
    } else {
      el.value = mask;
    }
  }
  const _sfc_main = vue.defineComponent({
    name: "ATextInput",
    props: {
      schema: {
        type: Object,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      value: {
        type: null
      },
      mask: {
        type: String
      },
      required: {
        type: Boolean
      },
      readOnly: {
        type: Boolean
      },
      uuid: {
        type: String
      },
      validation: {
        type: Object,
        default: () => ({ errorMessage: "&nbsp;" })
      }
    },
    setup(props, context) {
      const inputText = vue.ref(props.value);
      const maskFilled = vue.ref(false);
      const locale = vue.inject("locale", "");
      const update = (event) => {
        const value = event.target.value;
        context.emit("update:value", value);
      };
      return { inputText, locale, maskFilled, update };
    },
    directives: {
      mask: useStringMask
    }
  });
  const ATextInput_vue_vue_type_style_index_0_scoped_58bab3b3_lang = "";
  const _hoisted_1 = ["id", "disabled", "maxlength", "required"];
  const _hoisted_2 = ["for"];
  const _hoisted_3 = ["innerHTML"];
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _directive_mask = vue.resolveDirective("mask");
    return vue.openBlock(), vue.createElementBlock("div", null, [
      vue.withDirectives(vue.createElementVNode("input", {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.inputText = $event),
        id: _ctx.uuid,
        disabled: _ctx.readOnly,
        maxlength: _ctx.mask ? _ctx.maskFilled && _ctx.mask.length : void 0,
        required: _ctx.required,
        onInput: _cache[1] || (_cache[1] = (...args) => _ctx.update && _ctx.update(...args))
      }, null, 40, _hoisted_1), [
        [vue.vModelText, _ctx.inputText],
        [_directive_mask, _ctx.mask]
      ]),
      vue.createElementVNode("label", { for: _ctx.uuid }, vue.toDisplayString(_ctx.label), 9, _hoisted_2),
      vue.withDirectives(vue.createElementVNode("p", {
        innerHTML: _ctx.validation.errorMessage
      }, null, 8, _hoisted_3), [
        [vue.vShow, _ctx.validation.errorMessage]
      ])
    ]);
  }
  const ATextInput = /* @__PURE__ */ _export_sfc$1(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-58bab3b3"]]);
  function install(app) {
    app.component("ACombobox", AComboBox);
    app.component("ADate", ADate);
    app.component("AForm", AForm);
    app.component("AFieldset", AFieldset);
    app.component("ANumericInput", ANumericInput);
    app.component("ATextInput", ATextInput);
  }
  exports2.AComboBox = AComboBox;
  exports2.ADate = ADate;
  exports2.AFieldset = AFieldset;
  exports2.AForm = AForm;
  exports2.ANumericInput = ANumericInput;
  exports2.ATextInput = ATextInput;
  exports2.install = install;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});
