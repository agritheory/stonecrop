import { defineComponent, ref, openBlock, createElementBlock, Fragment, renderList, createBlock, resolveDynamicComponent, mergeProps, normalizeClass, resolveComponent, createElementVNode, createTextVNode, toDisplayString, createCommentVNode, withDirectives, createVNode, vShow } from "vue";
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
    const deriveComponent = (componentObj) => {
      return componentObj.component || componentObj.fieldtype || "ATextInput";
    };
    const componentProps = (componentObj) => {
      let propsToPass = {};
      for (const [key, value] of Object.entries(componentObj)) {
        if (!["component", "fieldtype"].includes(key)) {
          propsToPass[key] = value;
        }
      }
      return propsToPass;
    };
    return { deriveComponent, formData, componentProps };
  }
});
const AForm_vue_vue_type_style_index_0_scoped_db6dce0e_lang = "";
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
      return openBlock(), createBlock(resolveDynamicComponent(_ctx.deriveComponent(componentObj)), mergeProps({
        key,
        schema: componentObj
      }, _ctx.componentProps(componentObj), {
        value: _ctx.formData[componentObj.fieldname]
      }), null, 16, ["schema", "value"]);
    }), 128))
  ]);
}
const AForm = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-db6dce0e"]]);
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
      type: Number,
      default: 0
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
const _sfc_main = defineComponent({
  name: "ATextInput",
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
      type: Number,
      default: 0
    },
    validation: {
      type: Object,
      default: () => ({ errorMessage: "&nbsp;" })
    }
  },
  setup(props, context) {
    const update = (event) => {
      const value = event.target.value;
      context.emit("update:value", value);
    };
    return { update };
  }
});
const ATextInput_vue_vue_type_style_index_0_scoped_1da3a261_lang = "";
const _hoisted_1 = ["value", "required", "id", "disabled"];
const _hoisted_2 = ["for"];
const _hoisted_3 = ["innerHTML"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createElementVNode("input", {
      value: _ctx.value,
      required: _ctx.required,
      id: _ctx.uuid,
      disabled: _ctx.readOnly,
      onInput: _cache[0] || (_cache[0] = (...args) => _ctx.update && _ctx.update(...args))
    }, null, 40, _hoisted_1),
    createElementVNode("label", { for: _ctx.uuid }, toDisplayString(_ctx.label), 9, _hoisted_2),
    withDirectives(createElementVNode("p", {
      innerHTML: _ctx.validation.errorMessage
    }, null, 8, _hoisted_3), [
      [vShow, _ctx.validation.errorMessage]
    ])
  ]);
}
const ATextInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1da3a261"]]);
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
