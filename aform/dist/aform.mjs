import { defineComponent as f, ref as c, openBlock as u, createElementBlock as i, Fragment as C, renderList as $, createBlock as v, resolveDynamicComponent as I, mergeProps as h, normalizeClass as B, resolveComponent as m, createElementVNode as _, createTextVNode as F, toDisplayString as y, createCommentVNode as k, withDirectives as b, createVNode as O, vShow as g } from "vue";
const p = (e, n) => {
  const t = e.__vccOpts || e;
  for (const [r, a] of n)
    t[r] = a;
  return t;
}, T = f({
  name: "AForm",
  props: ["data", "schema", "key"],
  setup(e, n) {
    const t = c(e.data || {});
    function r(l) {
      if (l.component)
        return l.component;
      if (l.fieldtype)
        return l.fieldtype;
    }
    function a(l) {
      let o = {};
      for (const [s, d] of Object.entries(l))
        s != "component" && s != "fieldtype" && (o[s] = d);
      return o;
    }
    return { deriveComponent: r, formData: t, componentProps: a };
  }
});
function q(e, n, t, r, a, l) {
  return u(), i("form", null, [
    (u(!0), i(C, null, $(e.schema, (o, s) => (u(), v(I(e.deriveComponent(o)), h({
      key: s,
      schema: o
    }, e.componentProps(o), {
      value: e.formData[o.fieldname]
    }), null, 16, ["schema", "value"]))), 128))
  ]);
}
const A = /* @__PURE__ */ p(T, [["render", q], ["__scopeId", "data-v-66485a97"]]);
const x = f({
  props: ["collapsed"],
  setup(e, n) {
  }
});
function N(e, n, t, r, a, l) {
  return u(), i("button", {
    class: B(["collapse-button", e.collapsed ? "rotated" : "unrotated"])
  }, "\xD7", 2);
}
const D = /* @__PURE__ */ p(x, [["render", N], ["__scopeId", "data-v-5d663325"]]);
const V = f({
  name: "AFieldset",
  components: { AForm: A, CollapseButton: D },
  props: ["value", "schema", "key", "label", "collapsible"],
  setup(e, n) {
    const t = c(e.data || {});
    let r = c(!1), a = c(e.collapsible);
    function l(o) {
      o.preventDefault(), a && (r.value = !r.value);
    }
    return { formData: t, collapsed: r, toggleCollapse: l, collapsible: a };
  }
});
function M(e, n, t, r, a, l) {
  const o = m("CollapseButton"), s = m("AForm");
  return u(), i("fieldset", null, [
    _("legend", {
      onClick: n[0] || (n[0] = (d) => e.toggleCollapse(d)),
      onSubmit: n[1] || (n[1] = (d) => e.toggleCollapse(d))
    }, [
      F(y(e.label) + " ", 1),
      e.collapsible ? (u(), v(o, {
        key: 0,
        collapsed: e.collapsed
      }, null, 8, ["collapsed"])) : k("", !0)
    ], 32),
    b(O(s, {
      schema: e.schema,
      data: e.formData
    }, null, 8, ["schema", "data"]), [
      [g, !e.collapsed]
    ])
  ]);
}
const S = /* @__PURE__ */ p(V, [["render", M], ["__scopeId", "data-v-458ad327"]]), P = {
  name: "ANumericInput",
  props: {
    value: { required: !1 },
    required: {
      type: Boolean,
      default: !1
    },
    label: {
      type: String,
      required: !0
    },
    readOnly: {
      type: Boolean,
      default: !1
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
    update(e) {
      this.$emit("update:value", e);
    }
  }
};
function j(e, n, t, r, a, l) {
  const o = m("ATextInput");
  return u(), v(o, {
    label: t.label,
    readOnly: t.readOnly,
    uuid: t.uuid,
    validation: t.validation,
    modelValue: a.amount,
    "onUpdate:modelValue": n[0] || (n[0] = (s) => a.amount = s)
  }, null, 8, ["label", "readOnly", "uuid", "validation", "modelValue"]);
}
const L = /* @__PURE__ */ p(P, [["render", j]]);
const w = {
  name: "ATextInput",
  props: {
    value: { required: !1 },
    required: {
      type: Boolean,
      default: !1
    },
    label: {
      type: String,
      required: !0
    },
    readOnly: {
      type: Boolean,
      default: !1
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
    update(e) {
      this.$emit("update:value", e);
    }
  }
}, E = ["value", "required", "id", "disabled"], H = ["for"], z = ["innerHTML"];
function U(e, n, t, r, a, l) {
  return u(), i("div", null, [
    _("input", {
      value: t.value,
      required: t.required,
      id: t.uuid,
      disabled: t.readOnly,
      onInput: n[0] || (n[0] = (o) => l.update(o.target.value))
    }, null, 40, E),
    _("label", { for: t.uuid }, y(t.label), 9, H),
    b(_("p", {
      innerHTML: t.validation.errorMessage
    }, null, 8, z), [
      [g, t.validation.errorMessage]
    ])
  ]);
}
const G = /* @__PURE__ */ p(w, [["render", U], ["__scopeId", "data-v-a123c08e"]]);
function J(e, n) {
  e.component("AForm", A), e.component("AFieldset", S), e.component("ANumericInput", L), e.component("ATextInput", G);
}
const Q = {
  install: J
};
export {
  Q as default
};
