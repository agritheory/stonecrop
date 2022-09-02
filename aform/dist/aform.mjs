import { defineComponent, resolveComponent, openBlock, createBlock, withCtx, createElementVNode, onMounted, onUnmounted, inject, ref, computed, watch, createElementBlock, withKeys, toDisplayString, Fragment, renderList, normalizeStyle, withModifiers, normalizeClass, resolveDynamicComponent, mergeProps, createTextVNode, createCommentVNode, withDirectives, createVNode, vShow, resolveDirective, vModelText } from "vue";
const _sfc_main$6 = defineComponent({
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
const _hoisted_1$2 = /* @__PURE__ */ createElementVNode("div", null, [
  /* @__PURE__ */ createElementVNode("input", { type: "text" }),
  /* @__PURE__ */ createElementVNode("input", { type: "text" }),
  /* @__PURE__ */ createElementVNode("input", { type: "text" })
], -1);
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ATableModal = resolveComponent("ATableModal");
  return openBlock(), createBlock(_component_ATableModal, {
    event: _ctx.event,
    cellData: _ctx.cellData,
    class: "amodal"
  }, {
    default: withCtx(() => [
      _hoisted_1$2
    ]),
    _: 1
  }, 8, ["event", "cellData"]);
}
const AComboBox = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
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
    let selectors = [];
    if (typeof option.selectors === "string") {
      selectors = Array.from(document.querySelectorAll(option.selectors));
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
const _sfc_main$5 = defineComponent({
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
    const tableData = inject(props.tableid);
    const { enterNav, tabNav, endNav, homeNav, downArrowNav, upArrowNav, leftArrowNav, rightArrowNav } = useKeyboardNav(tableData);
    const numberOfRows = 6;
    const numberOfColumns = 7;
    const todaysDate = new Date();
    let currentMonth = ref(todaysDate.getMonth());
    let currentYear = ref(todaysDate.getFullYear());
    let selectedDate = ref(tableData.cellData(props.colIndex, props.rowIndex));
    let currentDates = ref([]);
    let width = ref("");
    const renderMonth = () => {
      const firstOfMonth = new Date(currentYear.value, currentMonth.value, 1);
      const monthStartWeekday = firstOfMonth.getDay();
      const calendarStartDay = firstOfMonth.setDate(firstOfMonth.getDate() - monthStartWeekday);
      for (let i of Array(43).keys()) {
        currentDates.value.push(calendarStartDay + i * 84e6);
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
    onMounted(() => {
      renderMonth();
    });
    const dayWidth = computed(() => {
      const widthValue = Number(width.value.replace("px", ""));
      return `${widthValue / (numberOfColumns - 1)}px`;
    });
    const monthAndYear = computed(() => {
      return new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString(void 0, {
        year: "numeric",
        month: "long"
      });
    });
    const cellStyle = {
      border: "2px solid var(--focus-cell-outline)"
    };
    watch(currentMonth, () => {
      currentDates.value = [];
      renderMonth();
    });
    watch(currentYear, () => {
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
const ADate_vue_vue_type_style_index_0_scoped_f1965e8d_lang = "";
const _hoisted_1$1 = ["event", "colIndex", "rowIndex", "tableid"];
const _hoisted_2$1 = { colspan: "5" };
const _hoisted_3$1 = ["contenteditable", "onClick"];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    event: _ctx.event,
    colIndex: _ctx.colIndex,
    rowIndex: _ctx.rowIndex,
    tableid: _ctx.tableid,
    class: "adate",
    tabindex: "0",
    ref: "adatepicker"
  }, [
    createElementVNode("table", {
      onKeydown: [
        _cache[10] || (_cache[10] = withKeys((...args) => _ctx.handlePageDown && _ctx.handlePageDown(...args), ["page-down"])),
        _cache[11] || (_cache[11] = withKeys((...args) => _ctx.handlePageUp && _ctx.handlePageUp(...args), ["page-up"]))
      ]
    }, [
      createElementVNode("tr", null, [
        createElementVNode("td", {
          onClick: _cache[0] || (_cache[0] = (...args) => _ctx.previousMonth && _ctx.previousMonth(...args)),
          tabindex: -1
        }, "<"),
        createElementVNode("th", _hoisted_2$1, toDisplayString(_ctx.monthAndYear), 1),
        createElementVNode("td", {
          onClick: _cache[1] || (_cache[1] = (...args) => _ctx.nextMonth && _ctx.nextMonth(...args)),
          tabindex: -1
        }, ">")
      ]),
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.numberOfRows, (rowNo) => {
        return openBlock(), createElementBlock("tr", { key: rowNo }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.numberOfColumns, (colNo) => {
            return openBlock(), createElementBlock("td", {
              key: (rowNo - 1) * _ctx.numberOfColumns + colNo,
              contenteditable: _ctx.tableData.columns[_ctx.colIndex].edit,
              tabindex: 0,
              spellcheck: false,
              style: normalizeStyle({
                border: _ctx.isSelectedDate(_ctx.currentDates[(rowNo - 1) * _ctx.numberOfColumns + colNo]) ? "2px solid var(--focus-cell-outline)" : "none",
                borderBottomColor: _ctx.today(_ctx.currentDates[(rowNo - 1) * _ctx.numberOfColumns + colNo]) ? "var(--focus-cell-outline)" : "none"
              }),
              onClick: withModifiers(($event) => _ctx.selectDate($event, (rowNo - 1) * _ctx.numberOfColumns + colNo), ["prevent", "stop"]),
              onKeydown: [
                _cache[2] || (_cache[2] = withKeys((...args) => _ctx.enterNav && _ctx.enterNav(...args), ["enter"])),
                _cache[3] || (_cache[3] = withKeys((...args) => _ctx.tabNav && _ctx.tabNav(...args), ["tab"])),
                _cache[4] || (_cache[4] = withKeys((...args) => _ctx.endNav && _ctx.endNav(...args), ["end"])),
                _cache[5] || (_cache[5] = withKeys((...args) => _ctx.homeNav && _ctx.homeNav(...args), ["home"])),
                _cache[6] || (_cache[6] = withKeys((...args) => _ctx.downArrowNav && _ctx.downArrowNav(...args), ["down"])),
                _cache[7] || (_cache[7] = withKeys((...args) => _ctx.upArrowNav && _ctx.upArrowNav(...args), ["up"])),
                _cache[8] || (_cache[8] = withKeys((...args) => _ctx.leftArrowNav && _ctx.leftArrowNav(...args), ["left"])),
                _cache[9] || (_cache[9] = withKeys((...args) => _ctx.rightArrowNav && _ctx.rightArrowNav(...args), ["right"]))
              ],
              class: normalizeClass({
                todaysdate: _ctx.today(_ctx.currentDates[(rowNo - 1) * _ctx.numberOfColumns + colNo]),
                selecteddate: _ctx.isSelectedDate(_ctx.currentDates[(rowNo - 1) * _ctx.numberOfColumns + colNo])
              })
            }, toDisplayString(new Date(_ctx.currentDates[(rowNo - 1) * _ctx.numberOfColumns + colNo]).getDate()), 47, _hoisted_3$1);
          }), 128))
        ]);
      }), 128))
    ], 32)
  ], 8, _hoisted_1$1);
}
const ADate = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-f1965e8d"]]);
const _sfc_main$4 = defineComponent({
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
    const formData = ref(props.data || {});
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
  return openBlock(), createElementBlock("form", null, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.schema, (componentObj, key) => {
      return openBlock(), createBlock(resolveDynamicComponent(componentObj.component), mergeProps({
        key,
        schema: componentObj
      }, _ctx.componentProps(componentObj), {
        value: _ctx.formData[componentObj.fieldname]
      }), null, 16, ["schema", "value"]);
    }), 128))
  ]);
}
const AForm = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-56233342"]]);
const _sfc_main$3 = defineComponent({
  props: {
    collapsed: {
      type: Boolean,
      required: true
    }
  }
});
const CollapseButton_vue_vue_type_style_index_0_scoped_5f720483_lang = "";
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", {
    class: normalizeClass(["collapse-button", _ctx.collapsed ? "rotated" : "unrotated"])
  }, "\xD7", 2);
}
const CollapseButton = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-5f720483"]]);
const _sfc_main$2 = defineComponent({
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
    const formData = ref(props.data || []);
    let collapsed = ref(false);
    let collapsible = ref(props.collapsible);
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
  const _component_CollapseButton = resolveComponent("CollapseButton");
  const _component_AForm = resolveComponent("AForm");
  return openBlock(), createElementBlock("fieldset", null, [
    createElementVNode("legend", {
      onClick: _cache[0] || (_cache[0] = ($event) => _ctx.toggleCollapse($event)),
      onSubmit: _cache[1] || (_cache[1] = ($event) => _ctx.toggleCollapse($event))
    }, [
      createTextVNode(toDisplayString(_ctx.label) + " ", 1),
      _ctx.collapsible ? (openBlock(), createBlock(_component_CollapseButton, {
        key: 0,
        collapsed: _ctx.collapsed
      }, null, 8, ["collapsed"])) : createCommentVNode("", true)
    ], 32),
    withDirectives(createVNode(_component_AForm, {
      schema: _ctx.schema,
      data: _ctx.formData
    }, null, 8, ["schema", "data"]), [
      [vShow, !_ctx.collapsed]
    ])
  ]);
}
const AFieldset = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-2ee1d08c"]]);
const _sfc_main$1 = defineComponent({
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
    const amount = ref("");
    const update = (event) => {
      const value = event.target.value;
      context.emit("update:value", value);
    };
    return { amount, update };
  }
});
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ATextInput = resolveComponent("ATextInput");
  return openBlock(), createBlock(_component_ATextInput, {
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
const _sfc_main = defineComponent({
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
    const inputText = ref(props.value);
    const maskFilled = ref(false);
    const locale = inject("locale", "");
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
  const _directive_mask = resolveDirective("mask");
  return openBlock(), createElementBlock("div", null, [
    withDirectives(createElementVNode("input", {
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.inputText = $event),
      id: _ctx.uuid,
      disabled: _ctx.readOnly,
      maxlength: _ctx.mask ? _ctx.maskFilled && _ctx.mask.length : void 0,
      required: _ctx.required,
      onInput: _cache[1] || (_cache[1] = (...args) => _ctx.update && _ctx.update(...args))
    }, null, 40, _hoisted_1), [
      [vModelText, _ctx.inputText],
      [_directive_mask, _ctx.mask]
    ]),
    createElementVNode("label", { for: _ctx.uuid }, toDisplayString(_ctx.label), 9, _hoisted_2),
    withDirectives(createElementVNode("p", {
      innerHTML: _ctx.validation.errorMessage
    }, null, 8, _hoisted_3), [
      [vShow, _ctx.validation.errorMessage]
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
export {
  AComboBox,
  ADate,
  AFieldset,
  AForm,
  ANumericInput,
  ATextInput,
  install
};
