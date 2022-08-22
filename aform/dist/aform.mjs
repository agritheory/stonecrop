import { defineComponent, ref, openBlock, createElementBlock, Fragment, renderList, createBlock, resolveDynamicComponent, mergeProps, normalizeClass, resolveComponent, createElementVNode, createTextVNode, toDisplayString, createCommentVNode, withDirectives, createVNode, vShow, inject, resolveDirective, vModelText } from "vue";
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
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
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
      const locale = binding.instance.locale;
      mask = maskFn(locale);
    }
  } else {
    const schema = binding.instance.schema;
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
    if (binding.instance.maskFilled) {
      binding.instance.maskFilled = !replacement.includes(maskToken);
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
  app.component("AForm", AForm);
  app.component("AFieldset", AFieldset);
  app.component("ANumericInput", ANumericInput);
  app.component("ATextInput", ATextInput);
}
const index = {
  install
};
export {
  index as default
};
