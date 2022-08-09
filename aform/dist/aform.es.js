import { defineComponent, ref, openBlock, createElementBlock, Fragment, renderList, createBlock, resolveDynamicComponent, mergeProps, normalizeClass, resolveComponent, createElementVNode, createTextVNode, toDisplayString, createCommentVNode, withDirectives, createVNode, vShow } from "vue";
var AForm_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$4 = defineComponent({
  name: "AForm",
  props: ["data", "schema", "key"],
  setup(props, context) {
    const formData = ref(props.data || {});
    function deriveComponent(schema) {
      if (schema.component) {
        return schema.component;
      }
      if (schema.fieldtype) {
        return schema.fieldtype;
      }
    }
    function componentProps(component) {
      let propsToPass = {};
      for (const [key, value] of Object.entries(component)) {
        if (key != "component" && key != "fieldtype") {
          propsToPass[key] = value;
        }
      }
      return propsToPass;
    }
    return { deriveComponent, formData, componentProps };
  }
});
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("form", null, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.schema, (component, key) => {
      return openBlock(), createBlock(resolveDynamicComponent(_ctx.deriveComponent(component)), mergeProps({
        key,
        schema: component
      }, _ctx.componentProps(component), {
        value: _ctx.formData[component.fieldname]
      }), null, 16, ["schema", "value"]);
    }), 128))
  ]);
}
var AForm = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-6ffb33cb"]]);
var CollapseButton_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$3 = defineComponent({
  props: ["collapsed"],
  setup(props, context) {
  }
});
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", {
    class: normalizeClass(["collapse-button", _ctx.collapsed ? "rotated" : "unrotated"])
  }, "\xD7", 2);
}
var CollapseButton = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-a2c6271a"]]);
var AFieldset_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$2 = defineComponent({
  name: "AFieldset",
  components: { AForm, CollapseButton },
  props: ["value", "schema", "key", "label", "collapsible"],
  setup(props, context) {
    const formData = ref(props.data || {});
    let collapsed = ref(false);
    let collapsible = ref(props.collapsible);
    function toggleCollapse(e) {
      e.preventDefault();
      if (!collapsible) {
        return;
      }
      collapsed.value = !collapsed.value;
    }
    return { formData, collapsed, toggleCollapse, collapsible };
  }
});
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
var AFieldset = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-53d61727"]]);
const _sfc_main$1 = {
  name: "ANumericInput",
  props: {
    value: { required: false },
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    readOnly: {
      type: Boolean,
      default: false
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
  data() {
    return {
      amount: ""
    };
  },
  methods: {
    update(value) {
      this.$emit("update:value", value);
    }
  }
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ATextInput = resolveComponent("ATextInput");
  return openBlock(), createBlock(_component_ATextInput, {
    label: $props.label,
    readOnly: $props.readOnly,
    uuid: $props.uuid,
    validation: $props.validation,
    modelValue: $data.amount,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.amount = $event)
  }, null, 8, ["label", "readOnly", "uuid", "validation", "modelValue"]);
}
var ANumericInput = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
var ATextInput_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main = {
  name: "ATextInput",
  props: {
    value: { required: false },
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    readOnly: {
      type: Boolean,
      default: false
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
  methods: {
    update(value) {
      this.$emit("update:value", value);
    }
  }
};
const _hoisted_1 = ["value", "required", "id", "disabled"];
const _hoisted_2 = ["for"];
const _hoisted_3 = ["innerHTML"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createElementVNode("input", {
      value: $props.value,
      required: $props.required,
      id: $props.uuid,
      disabled: $props.readOnly,
      onInput: _cache[0] || (_cache[0] = ($event) => $options.update($event.target.value))
    }, null, 40, _hoisted_1),
    createElementVNode("label", { for: $props.uuid }, toDisplayString($props.label), 9, _hoisted_2),
    withDirectives(createElementVNode("p", {
      innerHTML: $props.validation.errorMessage
    }, null, 8, _hoisted_3), [
      [vShow, $props.validation.errorMessage]
    ])
  ]);
}
var ATextInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4262e9c3"]]);
function install(app, options) {
  app.component("AForm", AForm);
  app.component("AFieldset", AFieldset);
  app.component("ANumericInput", ANumericInput);
  app.component("ATextInput", ATextInput);
}
var index = {
  install
};
export { index as default };
