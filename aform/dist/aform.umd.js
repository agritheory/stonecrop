(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("vue")) : typeof define === "function" && define.amd ? define(["exports", "vue"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["@sedum/aform"] = {}, global.Vue));
})(this, function(exports2, vue) {
  "use strict";
  const _sfc_main$6 = vue.defineComponent({
    name: "AComboBox",
    props: ["event", "cellData", "tableID"]
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$2 = /* @__PURE__ */ vue.createElementVNode("div", null, [
    /* @__PURE__ */ vue.createElementVNode("input", { type: "text" }),
    /* @__PURE__ */ vue.createElementVNode("input", { type: "text" }),
    /* @__PURE__ */ vue.createElementVNode("input", { type: "text" })
  ], -1);
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ATableModal = vue.resolveComponent("ATableModal");
    return vue.openBlock(), vue.createBlock(_component_ATableModal, {
      event: _ctx.event,
      cellData: _ctx.cellData,
      class: "amodal"
    }, {
      default: vue.withCtx(() => [
        _hoisted_1$2
      ]),
      _: 1
    }, 8, ["event", "cellData"]);
  }
  const AComboBox = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5]]);
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
  const getTopCell = (event) => {
    var _a;
    const target = event.target;
    let $topCell;
    if (target instanceof HTMLTableCellElement) {
      const $table = (_a = target.parentElement) == null ? void 0 : _a.parentElement;
      if ($table) {
        const $firstRow = $table.firstElementChild;
        const $navCell = $firstRow.children[target.cellIndex];
        if ($navCell) {
          $topCell = $navCell;
        }
      }
    }
    return $topCell;
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
  const getBottomCell = (event) => {
    var _a;
    const target = event.target;
    let $bottomCell;
    if (target instanceof HTMLTableCellElement) {
      const $table = (_a = target.parentElement) == null ? void 0 : _a.parentElement;
      if ($table) {
        const $lastRow = $table.lastElementChild;
        const $navCell = $lastRow.children[target.cellIndex];
        if ($navCell) {
          $bottomCell = $navCell;
        }
      }
    }
    return $bottomCell;
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
      const target = event.target;
      if (target instanceof HTMLTableCellElement) {
        event.preventDefault();
        event.stopPropagation();
        const $downCell = getDownCell(event);
        if ($downCell) {
          $downCell.focus();
        }
      }
    },
    "keydown.shift.enter": (event) => {
      const target = event.target;
      if (target instanceof HTMLTableCellElement) {
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
      }
      return selectors;
    };
    const getEventListener = (option) => {
      return (event) => {
        const activeKey = eventKeyMap[event.key] || event.key.toLowerCase();
        if (modifierKeys.includes(activeKey))
          return;
        for (const key of Object.keys(option.handlers)) {
          const [eventType, ...keys] = key.split(".");
          if (eventType !== "keydown") {
            continue;
          }
          if (keys.includes(activeKey)) {
            const listener = option.handlers[key];
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
    vue.onMounted(() => {
      for (const option of options) {
        const selectors = getSelectors(option);
        for (const selector of selectors) {
          selector.addEventListener("keydown", getEventListener(option));
        }
      }
    });
    vue.onBeforeUnmount(() => {
      for (const option of options) {
        const selectors = getSelectors(option);
        for (const selector of selectors) {
          selector.removeEventListener("keydown", getEventListener(option));
        }
      }
    });
  }
  const _hoisted_1$1 = ["event", "colIndex", "rowIndex", "tableid"];
  const _hoisted_2$1 = ["onKeydown"];
  const _hoisted_3$1 = { colspan: "5" };
  const _hoisted_4 = ["contenteditable", "onClick"];
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "ADate",
    props: {
      colIndex: null,
      rowIndex: null,
      tableid: null,
      event: null,
      indent: null
    },
    setup(__props) {
      const props = __props;
      const tableData = vue.inject(props.tableid);
      useKeyboardNav([
        {
          selectors: "td",
          handlers: defaultKeypressHandlers
        }
      ]);
      const numberOfRows = 6;
      const numberOfColumns = 7;
      const todaysDate = new Date();
      let currentMonth = vue.ref(todaysDate.getMonth());
      let currentYear = vue.ref(todaysDate.getFullYear());
      let selectedDate = vue.ref(tableData.cellData(props.colIndex, props.rowIndex));
      let currentDates = vue.ref([]);
      let width = vue.ref("");
      vue.onMounted(() => {
        renderMonth();
      });
      vue.watch(currentMonth, () => {
        currentDates.value = [];
        renderMonth();
      });
      vue.watch(currentYear, () => {
        currentDates.value = [];
        renderMonth();
      });
      const renderMonth = () => {
        const firstOfMonth = new Date(currentYear.value, currentMonth.value, 1);
        const monthStartWeekday = firstOfMonth.getDay();
        const calendarStartDay = firstOfMonth.setDate(firstOfMonth.getDate() - monthStartWeekday);
        for (let dayIndex of Array(43).keys()) {
          currentDates.value.push(calendarStartDay + dayIndex * 864e5);
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
      const isSelectedDate = (day) => {
        return new Date(day).toDateString() === new Date(selectedDate.value).toDateString();
      };
      const selectDate = (event, currentIndex) => {
        selectedDate.value = currentDates.value[currentIndex];
        updateData();
      };
      const updateData = () => {
        tableData.setCellData(props.rowIndex, props.colIndex, selectedDate.value);
      };
      vue.computed(() => {
        const widthValue = Number(width.value.replace("px", ""));
        return `${widthValue / (numberOfColumns - 1)}px`;
      });
      const monthAndYear = vue.computed(() => {
        return new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString(void 0, {
          year: "numeric",
          month: "long"
        });
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          event: __props.event,
          colIndex: __props.colIndex,
          rowIndex: __props.rowIndex,
          tableid: __props.tableid,
          class: "adate",
          tabindex: "0",
          ref: "adatepicker"
        }, [
          vue.createElementVNode("table", {
            onKeydown: [
              vue.withKeys(handlePageDown, ["page-down"]),
              vue.withKeys(handlePageUp, ["page-up"])
            ]
          }, [
            vue.createElementVNode("tr", null, [
              vue.createElementVNode("td", {
                onClick: previousMonth,
                tabindex: -1
              }, "<"),
              vue.createElementVNode("th", _hoisted_3$1, vue.toDisplayString(vue.unref(monthAndYear)), 1),
              vue.createElementVNode("td", {
                onClick: nextMonth,
                tabindex: -1
              }, ">")
            ]),
            (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(numberOfRows, (rowNo) => {
              return vue.createElementVNode("tr", { key: rowNo }, [
                (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(numberOfColumns, (colNo) => {
                  return vue.createElementVNode("td", {
                    key: (rowNo - 1) * numberOfColumns + colNo,
                    contenteditable: vue.unref(tableData).columns[__props.colIndex].edit,
                    tabindex: 0,
                    spellcheck: false,
                    style: vue.normalizeStyle({
                      border: isSelectedDate(vue.unref(currentDates)[(rowNo - 1) * numberOfColumns + colNo]) ? "2px solid var(--focus-cell-outline)" : "none",
                      borderBottomColor: today(vue.unref(currentDates)[(rowNo - 1) * numberOfColumns + colNo]) ? "var(--focus-cell-outline)" : "none"
                    }),
                    onClick: vue.withModifiers(($event) => selectDate($event, (rowNo - 1) * numberOfColumns + colNo), ["prevent", "stop"]),
                    class: vue.normalizeClass({
                      todaysdate: today(vue.unref(currentDates)[(rowNo - 1) * numberOfColumns + colNo]),
                      selecteddate: isSelectedDate(vue.unref(currentDates)[(rowNo - 1) * numberOfColumns + colNo])
                    })
                  }, vue.toDisplayString(new Date(vue.unref(currentDates)[(rowNo - 1) * numberOfColumns + colNo]).getDate()), 15, _hoisted_4);
                }), 64))
              ]);
            }), 64))
          ], 40, _hoisted_2$1)
        ], 8, _hoisted_1$1);
      };
    }
  });
  const ADate_vue_vue_type_style_index_0_scoped_de94ea25_lang = "";
  const ADate = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-de94ea25"]]);
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
  const AForm = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-56233342"]]);
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
  const CollapseButton = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-5f720483"]]);
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
  const AFieldset = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-2ee1d08c"]]);
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
  const ANumericInput = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
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
  const ATextInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-58bab3b3"]]);
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
