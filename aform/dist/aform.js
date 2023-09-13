import { defineComponent as D, computed as M, openBlock as f, createElementBlock as _, createElementVNode as u, withDirectives as k, isRef as P, vModelCheckbox as me, unref as v, toDisplayString as x, vShow as S, resolveComponent as ve, createBlock as B, withCtx as ye, vModelText as H, onMounted as le, onBeforeUnmount as ge, ref as g, watch as q, getCurrentScope as _e, onScopeDispose as he, nextTick as be, Fragment as $, renderList as O, withModifiers as ke, normalizeClass as oe, pushScopeId as De, popScopeId as we, resolveDynamicComponent as Ee, mergeProps as xe, createTextVNode as Ae, createCommentVNode as Ce, renderSlot as Me, createVNode as Te, inject as Ie, resolveDirective as Se } from "vue";
const Ve = { id: "checkbox-container" }, $e = ["id", "readonly", "required"], Oe = { id: "custom-checkbox" }, Le = ["for"], Pe = ["innerHTML"], Be = /* @__PURE__ */ D({
  __name: "ACheckbox",
  props: {
    label: null,
    value: null,
    required: { type: Boolean },
    readOnly: { type: Boolean },
    uuid: null,
    validation: { default: () => ({ errorMessage: "&nbsp;" }) }
  },
  emits: ["update:value"],
  setup(e, { emit: t }) {
    const l = e, n = M({
      get() {
        return l.value;
      },
      set(o) {
        t("update:value", o);
      }
    });
    return (o, a) => (f(), _("div", null, [
      u("label", Ve, [
        k(u("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (s) => P(n) ? n.value = s : null),
          type: "checkbox",
          id: e.uuid,
          class: "checkbox",
          readonly: e.readOnly,
          required: e.required
        }, null, 8, $e), [
          [me, v(n)]
        ]),
        u("span", Oe, x(v(n)), 1)
      ]),
      u("label", {
        for: e.uuid,
        id: "checkbox-label"
      }, x(e.label), 9, Le),
      k(u("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, Pe), [
        [S, e.validation.errorMessage]
      ])
    ]));
  }
});
const A = (e, t) => {
  const l = e.__vccOpts || e;
  for (const [n, o] of t)
    l[n] = o;
  return l;
}, He = /* @__PURE__ */ A(Be, [["__scopeId", "data-v-743cd4db"]]), qe = /* @__PURE__ */ u("div", null, [
  /* @__PURE__ */ u("input", { type: "text" }),
  /* @__PURE__ */ u("input", { type: "text" }),
  /* @__PURE__ */ u("input", { type: "text" })
], -1), Fe = /* @__PURE__ */ D({
  __name: "AComboBox",
  props: ["event", "cellData", "tableID"],
  setup(e) {
    return (t, l) => {
      const n = ve("ATableModal");
      return f(), B(n, {
        event: e.event,
        cellData: e.cellData,
        class: "amodal"
      }, {
        default: ye(() => [
          qe
        ]),
        _: 1
      }, 8, ["event", "cellData"]);
    };
  }
}), Ue = ["id", "disabled", "required"], Re = ["for"], Ne = ["innerHTML"], Qe = /* @__PURE__ */ D({
  __name: "ADate",
  props: {
    label: null,
    modelValue: null,
    required: { type: Boolean },
    readonly: { type: Boolean },
    uuid: null,
    validation: { default: () => ({ errorMessage: "&nbsp;" }) }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const l = e, n = M({
      get: () => l.modelValue,
      set: (o) => {
        t("update:modelValue", o);
      }
    });
    return (o, a) => (f(), _("div", null, [
      k(u("input", {
        "onUpdate:modelValue": a[0] || (a[0] = (s) => P(n) ? n.value = s : null),
        type: "date",
        id: e.uuid,
        disabled: e.readonly,
        required: e.required
      }, null, 8, Ue), [
        [H, v(n)]
      ]),
      u("label", { for: e.uuid }, x(e.label), 9, Re),
      k(u("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, Ne), [
        [S, e.validation.errorMessage]
      ])
    ]));
  }
});
const Ye = /* @__PURE__ */ A(Qe, [["__scopeId", "data-v-91963706"]]);
var Q;
const ae = typeof window < "u", je = (e) => typeof e == "string", We = () => {
};
ae && (Q = window == null ? void 0 : window.navigator) != null && Q.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function se(e) {
  return typeof e == "function" ? e() : v(e);
}
function Ge(e) {
  return e;
}
function ze(e) {
  return _e() ? (he(e), !0) : !1;
}
function L(e) {
  var t;
  const l = se(e);
  return (t = l == null ? void 0 : l.$el) != null ? t : l;
}
const re = ae ? window : void 0;
function Je(...e) {
  let t, l, n, o;
  if (je(e[0]) || Array.isArray(e[0]) ? ([l, n, o] = e, t = re) : [t, l, n, o] = e, !t)
    return We;
  Array.isArray(l) || (l = [l]), Array.isArray(n) || (n = [n]);
  const a = [], s = () => {
    a.forEach((p) => p()), a.length = 0;
  }, r = (p, b, h, d) => (p.addEventListener(b, h, d), () => p.removeEventListener(b, h, d)), i = q(() => [L(t), se(o)], ([p, b]) => {
    s(), p && a.push(...l.flatMap((h) => n.map((d) => r(p, h, d, b))));
  }, { immediate: !0, flush: "post" }), c = () => {
    i(), s();
  };
  return ze(c), c;
}
const Y = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, j = "__vueuse_ssr_handlers__";
Y[j] = Y[j] || {};
function Ke(e, { window: t = re, scrollTarget: l } = {}) {
  const n = g(!1), o = () => {
    if (!t)
      return;
    const a = t.document, s = L(e);
    if (!s)
      n.value = !1;
    else {
      const r = s.getBoundingClientRect();
      n.value = r.top <= (t.innerHeight || a.documentElement.clientHeight) && r.left <= (t.innerWidth || a.documentElement.clientWidth) && r.bottom >= 0 && r.right >= 0;
    }
  };
  return q(() => L(e), () => o(), { immediate: !0, flush: "post" }), t && Je(l || t, "scroll", o, {
    capture: !1,
    passive: !0
  }), n;
}
var W;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(W || (W = {}));
var Xe = Object.defineProperty, G = Object.getOwnPropertySymbols, Ze = Object.prototype.hasOwnProperty, et = Object.prototype.propertyIsEnumerable, z = (e, t, l) => t in e ? Xe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: l }) : e[t] = l, tt = (e, t) => {
  for (var l in t || (t = {}))
    Ze.call(t, l) && z(e, l, t[l]);
  if (G)
    for (var l of G(t))
      et.call(t, l) && z(e, l, t[l]);
  return e;
};
const nt = {
  easeInSine: [0.12, 0, 0.39, 0],
  easeOutSine: [0.61, 1, 0.88, 1],
  easeInOutSine: [0.37, 0, 0.63, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInOutQuad: [0.45, 0, 0.55, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInQuart: [0.5, 0, 0.75, 0],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInQuint: [0.64, 0, 0.78, 0],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeInCirc: [0.55, 0, 1, 0.45],
  easeOutCirc: [0, 0.55, 0.45, 1],
  easeInOutCirc: [0.85, 0, 0.15, 1],
  easeInBack: [0.36, 0, 0.66, -0.56],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6]
};
tt({
  linear: Ge
}, nt);
const w = (e) => {
  let t = Ke(e).value;
  return t = t && e.offsetHeight > 0, t;
}, E = (e) => e.tabIndex >= 0, J = (e) => {
  const t = e.target;
  return F(t);
}, F = (e) => {
  var t;
  let l;
  if (e instanceof HTMLTableCellElement) {
    const n = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    if (n) {
      const o = Array.from(n.children)[e.cellIndex];
      o && (l = o);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const n = e.previousElementSibling;
    n && (l = n);
  }
  return l && (!E(l) || !w(l)) ? F(l) : l;
}, lt = (e) => {
  var t;
  const l = e.target;
  let n;
  if (l instanceof HTMLTableCellElement) {
    const o = (t = l.parentElement) == null ? void 0 : t.parentElement;
    if (o) {
      const a = o.firstElementChild.children[l.cellIndex];
      a && (n = a);
    }
  } else if (l instanceof HTMLTableRowElement) {
    const o = l.parentElement;
    if (o) {
      const a = o.firstElementChild;
      a && (n = a);
    }
  }
  return n && (!E(n) || !w(n)) ? U(n) : n;
}, K = (e) => {
  const t = e.target;
  return U(t);
}, U = (e) => {
  var t;
  let l;
  if (e instanceof HTMLTableCellElement) {
    const n = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    if (n) {
      const o = Array.from(n.children)[e.cellIndex];
      o && (l = o);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const n = e.nextElementSibling;
    n && (l = n);
  }
  return l && (!E(l) || !w(l)) ? U(l) : l;
}, ot = (e) => {
  var t;
  const l = e.target;
  let n;
  if (l instanceof HTMLTableCellElement) {
    const o = (t = l.parentElement) == null ? void 0 : t.parentElement;
    if (o) {
      const a = o.lastElementChild.children[l.cellIndex];
      a && (n = a);
    }
  } else if (l instanceof HTMLTableRowElement) {
    const o = l.parentElement;
    if (o) {
      const a = o.lastElementChild;
      a && (n = a);
    }
  }
  return n && (!E(n) || !w(n)) ? F(n) : n;
}, X = (e) => {
  const t = e.target;
  return R(t);
}, R = (e) => {
  var t;
  let l;
  if (e.previousElementSibling)
    l = e.previousElementSibling;
  else {
    const n = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    l = n == null ? void 0 : n.lastElementChild;
  }
  return l && (!E(l) || !w(l)) ? R(l) : l;
}, Z = (e) => {
  const t = e.target;
  return N(t);
}, N = (e) => {
  var t;
  let l;
  if (e.nextElementSibling)
    l = e.nextElementSibling;
  else {
    const n = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    l = n == null ? void 0 : n.firstElementChild;
  }
  return l && (!E(l) || !w(l)) ? N(l) : l;
}, ee = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!E(t) || !w(t)) ? N(t) : t;
}, te = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!E(t) || !w(t)) ? R(t) : t;
}, V = ["alt", "control", "shift", "meta"], at = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, ue = {
  "keydown.up": (e) => {
    const t = J(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.down": (e) => {
    const t = K(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.left": (e) => {
    const t = X(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.right": (e) => {
    const t = Z(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.control.up": (e) => {
    const t = lt(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = ot(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.left": (e) => {
    const t = ee(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.right": (e) => {
    const t = te(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.end": (e) => {
    const t = te(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = K(e);
      t && t.focus();
    }
  },
  "keydown.shift.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = J(e);
      t && t.focus();
    }
  },
  "keydown.home": (e) => {
    const t = ee(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.tab": (e) => {
    const t = Z(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.shift.tab": (e) => {
    const t = X(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  }
};
function st(e) {
  const t = (n) => {
    let o = null;
    n.parent && (typeof n.parent == "string" ? o = document.querySelector(n.parent) : n.parent instanceof Element ? o = n.parent : o = n.parent.value);
    let a = [];
    if (n.selectors)
      if (typeof n.selectors == "string")
        a = o ? Array.from(o.querySelectorAll(n.selectors)) : Array.from(document.querySelectorAll(n.selectors));
      else if (n.selectors instanceof Element)
        a.push(n.selectors);
      else if (Array.isArray(n.selectors.value))
        for (const s of n.selectors.value)
          s instanceof Element ? a.push(s) : a.push(s.$el);
      else
        a.push(n.selectors.value);
    else
      a = Array.from(o.children).filter((s) => E(s) && w(s));
    return a;
  }, l = (n) => (o) => {
    const a = at[o.key] || o.key.toLowerCase();
    if (V.includes(a))
      return;
    const s = n.handlers || ue;
    for (const r of Object.keys(s)) {
      const [i, ...c] = r.split(".");
      if (i === "keydown" && c.includes(a)) {
        const p = s[r], b = c.filter((d) => V.includes(d)), h = V.some((d) => {
          const T = d.charAt(0).toUpperCase() + d.slice(1);
          return o.getModifierState(T);
        });
        if (b.length > 0) {
          if (h) {
            for (const d of V)
              if (c.includes(d)) {
                const T = d.charAt(0).toUpperCase() + d.slice(1);
                o.getModifierState(T) && p(o);
              }
          }
        } else
          h || p(o);
      }
    }
  };
  le(() => {
    for (const n of e) {
      const o = t(n);
      for (const a of o)
        a.addEventListener("keydown", l(n));
    }
  }), ge(() => {
    for (const n of e) {
      const o = t(n);
      for (const a of o)
        a.removeEventListener("keydown", l(n));
    }
  });
}
const rt = (e) => (De("data-v-e1d2d140"), e = e(), we(), e), ut = ["event"], it = { colspan: "5" }, ct = /* @__PURE__ */ rt(() => /* @__PURE__ */ u("tr", null, [
  /* @__PURE__ */ u("td", null, "M"),
  /* @__PURE__ */ u("td", null, "T"),
  /* @__PURE__ */ u("td", null, "W"),
  /* @__PURE__ */ u("td", null, "T"),
  /* @__PURE__ */ u("td", null, "F"),
  /* @__PURE__ */ u("td", null, "S"),
  /* @__PURE__ */ u("td", null, "S")
], -1)), dt = ["onClick"], pt = /* @__PURE__ */ D({
  __name: "ADatePicker",
  props: {
    modelValue: null,
    event: null
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const l = e, n = 6, o = 7, a = /* @__PURE__ */ new Date(), s = g(l.modelValue ? new Date(l.modelValue) : void 0), r = g(), i = g(), c = g([]);
    le(async () => {
      let m = /* @__PURE__ */ new Date();
      m ? (s.value = m, r.value = s.value.getMonth(), i.value = s.value.getFullYear()) : (r.value = a.getMonth(), i.value = a.getFullYear()), p(), await be();
      const I = document.getElementsByClassName("selectedDate");
      if (I.length > 0)
        I[0].focus();
      else {
        const y = document.getElementsByClassName("todaysDate");
        y.length > 0 && y[0].focus();
      }
    }), q([r, i], () => {
      p();
    });
    const p = () => {
      c.value = [];
      const m = new Date(i.value, r.value, 1), I = m.getDay(), y = m.setDate(m.getDate() - I);
      for (let C of Array(43).keys())
        c.value.push(y + C * 864e5);
    }, b = () => {
      i.value -= 1;
    }, h = () => {
      i.value += 1;
    }, d = () => {
      r.value == 0 ? (r.value = 11, b()) : r.value -= 1;
    }, T = () => {
      r.value == 11 ? (r.value = 0, h()) : r.value += 1;
    }, ce = (m) => {
      if (r.value === a.getMonth())
        return a.toDateString() === new Date(m).toDateString();
    }, de = (m) => new Date(m).toDateString() === new Date(s.value).toDateString(), pe = (m) => {
      s.value = new Date(c.value[m]), t("update:modelValue", s.value.getTime());
    }, fe = M(() => new Date(i.value, r.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return st([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...ue,
          "keydown.pageup": d,
          "keydown.shift.pageup": b,
          "keydown.pagedown": T,
          "keydown.shift.pagedown": h
        }
      }
    ]), (m, I) => (f(), _("div", {
      event: e.event,
      class: "adatepicker",
      tabindex: "0",
      ref: "adatepicker"
    }, [
      u("table", null, [
        u("tr", null, [
          u("td", {
            onClick: d,
            tabindex: -1
          }, "<"),
          u("th", it, x(v(fe)), 1),
          u("td", {
            onClick: T,
            tabindex: -1
          }, ">")
        ]),
        ct,
        (f(), _($, null, O(n, (y) => u("tr", { key: y }, [
          (f(), _($, null, O(o, (C) => u("td", {
            key: (y - 1) * o + C,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            onClick: ke((Lt) => pe((y - 1) * o + C), ["prevent", "stop"]),
            class: oe({
              todaysDate: ce(c.value[(y - 1) * o + C]),
              selectedDate: de(c.value[(y - 1) * o + C])
            })
          }, x(new Date(c.value[(y - 1) * o + C]).getDate()), 11, dt)), 64))
        ])), 64))
      ])
    ], 8, ut));
  }
});
const ft = /* @__PURE__ */ A(pt, [["__scopeId", "data-v-e1d2d140"]]), mt = /* @__PURE__ */ D({
  __name: "CollapseButton",
  props: {
    collapsed: { type: Boolean }
  },
  setup(e) {
    return (t, l) => (f(), _("button", {
      class: oe(["collapse-button", e.collapsed ? "rotated" : "unrotated"])
    }, "×", 2));
  }
});
const vt = /* @__PURE__ */ A(mt, [["__scopeId", "data-v-6f1c1b45"]]), yt = /* @__PURE__ */ D({
  __name: "AForm",
  props: {
    modelValue: null,
    data: null,
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const l = e, n = g(l.data || {}), o = (s) => {
      let r = {};
      for (const [i, c] of Object.entries(s))
        ["component", "fieldtype"].includes(i) || (r[i] = c), i === "rows" && c && c.length === 0 && (r.rows = n.value[s.fieldname]);
      return r;
    }, a = M({
      get: () => l.modelValue.map((s, r) => M({
        get() {
          return s.value;
        },
        set: (i) => {
          l.modelValue[r].value = i, t("update:modelValue", l.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (s, r) => (f(), _("form", null, [
      (f(!0), _($, null, O(e.modelValue, (i, c) => (f(), B(Ee(i.component), xe({
        key: c,
        schema: i,
        modelValue: v(a)[c].value,
        "onUpdate:modelValue": (p) => v(a)[c].value = p,
        data: n.value[i.fieldname],
        readonly: e.readonly
      }, o(i)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
});
const ie = /* @__PURE__ */ A(yt, [["__scopeId", "data-v-74d66cf2"]]), gt = /* @__PURE__ */ D({
  __name: "AFieldset",
  props: {
    schema: null,
    label: null,
    collapsible: { type: Boolean },
    data: null
  },
  setup(e) {
    const t = e, l = g(t.data || []);
    let n = g(!1), o = g(t.collapsible);
    const a = g(t.schema);
    function s(r) {
      r.preventDefault(), o.value && (n.value = !n.value);
    }
    return (r, i) => (f(), _("fieldset", null, [
      u("legend", {
        onClick: s,
        onSubmit: s
      }, [
        Ae(x(e.label) + " ", 1),
        v(o) ? (f(), B(vt, {
          key: 0,
          collapsed: v(n)
        }, null, 8, ["collapsed"])) : Ce("", !0)
      ], 32),
      Me(r.$slots, "default", { collapsed: v(n) }, () => [
        k(Te(ie, {
          modelValue: a.value,
          "onUpdate:modelValue": i[0] || (i[0] = (c) => a.value = c),
          data: l.value
        }, null, 8, ["modelValue", "data"]), [
          [S, !v(n)]
        ])
      ], !0)
    ]));
  }
});
const _t = /* @__PURE__ */ A(gt, [["__scopeId", "data-v-cad9b578"]]), ht = ["id", "disabled", "required"], bt = ["for"], kt = ["innerHTML"], Dt = /* @__PURE__ */ D({
  __name: "ANumericInput",
  props: {
    label: null,
    modelValue: null,
    required: { type: Boolean },
    readonly: { type: Boolean },
    uuid: null,
    validation: { default: () => ({ errorMessage: "&nbsp;" }) }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const l = e, n = M({
      get: () => l.modelValue,
      set: (o) => {
        t("update:modelValue", o);
      }
    });
    return (o, a) => (f(), _("div", null, [
      k(u("input", {
        "onUpdate:modelValue": a[0] || (a[0] = (s) => P(n) ? n.value = s : null),
        type: "number",
        id: e.uuid,
        disabled: e.readonly,
        required: e.required
      }, null, 8, ht), [
        [H, v(n)]
      ]),
      u("label", { for: e.uuid }, x(e.label), 9, bt),
      k(u("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, kt), [
        [S, e.validation.errorMessage]
      ])
    ]));
  }
});
const wt = /* @__PURE__ */ A(Dt, [["__scopeId", "data-v-be33e6c4"]]), ne = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function Et(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function xt(e) {
  var l;
  let t = e.value;
  if (t) {
    const n = Et(t);
    if (n) {
      const o = e.instance.locale;
      t = n(o);
    }
  } else {
    const o = (l = e.instance.schema.fieldtype) == null ? void 0 : l.toLowerCase();
    o && ne[o] && (t = ne[o]);
  }
  return t;
}
function At(e, t) {
  t || (t = "#");
  let l = e;
  const n = [t, "/", "-", "(", ")", " "];
  for (const o of n)
    l = l.replaceAll(o, "");
  return l;
}
function Ct(e, t, l) {
  l || (l = "#");
  let n = t;
  for (const o of e) {
    const a = n.indexOf(l);
    if (a !== -1) {
      const s = n.substring(0, a), r = n.substring(a + 1);
      n = s + o + r;
    }
  }
  return n.slice(0, t.length);
}
function Mt(e, t) {
  const l = xt(t);
  if (!l)
    return;
  const n = "#", o = e.value, a = At(o, n);
  if (a) {
    const s = Ct(a, l, n);
    t.instance.maskFilled && (t.instance.maskFilled = !s.includes(n)), e.value = s;
  } else
    e.value = l;
}
const Tt = D({
  name: "ATextInput",
  props: {
    schema: {
      type: Object,
      required: !0
    },
    label: {
      type: String,
      required: !0
    },
    modelValue: {
      type: null
    },
    mask: {
      type: String
    },
    required: {
      type: Boolean
    },
    readonly: {
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
  setup(e, t) {
    const l = g(!1), n = Ie("locale", "");
    return { inputText: M({
      get() {
        return e.modelValue;
      },
      set(a) {
        t.emit("update:modelValue", a);
      }
    }), locale: n, maskFilled: l };
  },
  directives: {
    mask: Mt
  }
});
const It = ["id", "disabled", "maxlength", "required"], St = ["for"], Vt = ["innerHTML"];
function $t(e, t, l, n, o, a) {
  const s = Se("mask");
  return f(), _("div", null, [
    k(u("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.inputText = r),
      id: e.uuid,
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required
    }, null, 8, It), [
      [H, e.inputText],
      [s, e.mask]
    ]),
    u("label", { for: e.uuid }, x(e.label), 9, St),
    k(u("p", {
      innerHTML: e.validation.errorMessage
    }, null, 8, Vt), [
      [S, e.validation.errorMessage]
    ])
  ]);
}
const Ot = /* @__PURE__ */ A(Tt, [["render", $t], ["__scopeId", "data-v-76dba9b8"]]);
function Bt(e) {
  e.component("ACheckbox", He), e.component("ACombobox", Fe), e.component("ADate", Ye), e.component("ADatePicker", ft), e.component("AFieldset", _t), e.component("AForm", ie), e.component("ANumericInput", wt), e.component("ATextInput", Ot);
}
export {
  He as ACheckbox,
  Fe as AComboBox,
  Ye as ADate,
  ft as ADatePicker,
  _t as AFieldset,
  ie as AForm,
  wt as ANumericInput,
  Ot as ATextInput,
  Bt as install
};
//# sourceMappingURL=aform.js.map
