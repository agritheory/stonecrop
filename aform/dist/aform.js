import { defineComponent as w, computed as x, openBlock as m, createElementBlock as g, createElementVNode as u, withDirectives as k, isRef as P, vModelCheckbox as ve, unref as v, toDisplayString as A, vShow as S, resolveComponent as ye, createBlock as B, withCtx as ge, vModelText as H, onMounted as oe, onBeforeUnmount as he, ref as y, watch as q, getCurrentScope as _e, onScopeDispose as be, nextTick as ke, Fragment as O, renderList as $, withModifiers as we, normalizeClass as ae, pushScopeId as De, popScopeId as Ee, resolveDynamicComponent as xe, mergeProps as Ae, createTextVNode as Ce, createCommentVNode as Me, renderSlot as Te, createVNode as Ie, inject as Se, resolveDirective as Ve } from "vue";
const Oe = { id: "checkbox-container" }, $e = ["id", "readonly", "required"], Le = { id: "custom-checkbox" }, Pe = ["for"], Be = ["innerHTML"], He = /* @__PURE__ */ w({
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
    const l = e, n = x({
      get() {
        return l.value;
      },
      set(o) {
        t("update:value", o);
      }
    });
    return (o, a) => (m(), g("div", null, [
      u("label", Oe, [
        k(u("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (s) => P(n) ? n.value = s : null),
          type: "checkbox",
          id: e.uuid,
          class: "checkbox",
          readonly: e.readOnly,
          required: e.required
        }, null, 8, $e), [
          [ve, v(n)]
        ]),
        u("span", Le, A(v(n)), 1)
      ]),
      u("label", {
        for: e.uuid,
        id: "checkbox-label"
      }, A(e.label), 9, Pe),
      k(u("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, Be), [
        [S, e.validation.errorMessage]
      ])
    ]));
  }
});
const C = (e, t) => {
  const l = e.__vccOpts || e;
  for (const [n, o] of t)
    l[n] = o;
  return l;
}, qe = /* @__PURE__ */ C(He, [["__scopeId", "data-v-743cd4db"]]), Fe = /* @__PURE__ */ u("div", null, [
  /* @__PURE__ */ u("input", { type: "text" }),
  /* @__PURE__ */ u("input", { type: "text" }),
  /* @__PURE__ */ u("input", { type: "text" })
], -1), Ue = /* @__PURE__ */ w({
  __name: "AComboBox",
  props: ["event", "cellData", "tableID"],
  setup(e) {
    return (t, l) => {
      const n = ye("ATableModal");
      return m(), B(n, {
        event: e.event,
        cellData: e.cellData,
        class: "amodal"
      }, {
        default: ge(() => [
          Fe
        ]),
        _: 1
      }, 8, ["event", "cellData"]);
    };
  }
}), Ne = ["id", "disabled", "required"], Re = ["for"], Qe = ["innerHTML"], Ye = /* @__PURE__ */ w({
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
    const l = e, n = x({
      get: () => l.modelValue,
      set: (o) => {
        t("update:modelValue", o);
      }
    });
    return (o, a) => (m(), g("div", null, [
      k(u("input", {
        "onUpdate:modelValue": a[0] || (a[0] = (s) => P(n) ? n.value = s : null),
        type: "date",
        id: e.uuid,
        disabled: e.readonly,
        required: e.required
      }, null, 8, Ne), [
        [H, v(n)]
      ]),
      u("label", { for: e.uuid }, A(e.label), 9, Re),
      k(u("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, Qe), [
        [S, e.validation.errorMessage]
      ])
    ]));
  }
});
const je = /* @__PURE__ */ C(Ye, [["__scopeId", "data-v-91963706"]]);
var Y;
const se = typeof window < "u", We = (e) => typeof e == "string", Ge = () => {
};
se && (Y = window == null ? void 0 : window.navigator) != null && Y.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function re(e) {
  return typeof e == "function" ? e() : v(e);
}
function ze(e) {
  return e;
}
function Je(e) {
  return _e() ? (be(e), !0) : !1;
}
function L(e) {
  var t;
  const l = re(e);
  return (t = l == null ? void 0 : l.$el) != null ? t : l;
}
const ue = se ? window : void 0;
function Ke(...e) {
  let t, l, n, o;
  if (We(e[0]) || Array.isArray(e[0]) ? ([l, n, o] = e, t = ue) : [t, l, n, o] = e, !t)
    return Ge;
  Array.isArray(l) || (l = [l]), Array.isArray(n) || (n = [n]);
  const a = [], s = () => {
    a.forEach((p) => p()), a.length = 0;
  }, r = (p, b, h, d) => (p.addEventListener(b, h, d), () => p.removeEventListener(b, h, d)), i = q(() => [L(t), re(o)], ([p, b]) => {
    s(), p && a.push(...l.flatMap((h) => n.map((d) => r(p, h, d, b))));
  }, { immediate: !0, flush: "post" }), c = () => {
    i(), s();
  };
  return Je(c), c;
}
const j = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, W = "__vueuse_ssr_handlers__";
j[W] = j[W] || {};
function Xe(e, { window: t = ue, scrollTarget: l } = {}) {
  const n = y(!1), o = () => {
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
  return q(() => L(e), () => o(), { immediate: !0, flush: "post" }), t && Ke(l || t, "scroll", o, {
    capture: !1,
    passive: !0
  }), n;
}
var G;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(G || (G = {}));
var Ze = Object.defineProperty, z = Object.getOwnPropertySymbols, et = Object.prototype.hasOwnProperty, tt = Object.prototype.propertyIsEnumerable, J = (e, t, l) => t in e ? Ze(e, t, { enumerable: !0, configurable: !0, writable: !0, value: l }) : e[t] = l, nt = (e, t) => {
  for (var l in t || (t = {}))
    et.call(t, l) && J(e, l, t[l]);
  if (z)
    for (var l of z(t))
      tt.call(t, l) && J(e, l, t[l]);
  return e;
};
const lt = {
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
nt({
  linear: ze
}, lt);
const D = (e) => {
  let t = Xe(e).value;
  return t = t && e.offsetHeight > 0, t;
}, E = (e) => e.tabIndex >= 0, K = (e) => {
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
  return l && (!E(l) || !D(l)) ? F(l) : l;
}, ot = (e) => {
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
  return n && (!E(n) || !D(n)) ? U(n) : n;
}, X = (e) => {
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
  return l && (!E(l) || !D(l)) ? U(l) : l;
}, at = (e) => {
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
  return n && (!E(n) || !D(n)) ? F(n) : n;
}, Z = (e) => {
  const t = e.target;
  return N(t);
}, N = (e) => {
  var t;
  let l;
  if (e.previousElementSibling)
    l = e.previousElementSibling;
  else {
    const n = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    l = n == null ? void 0 : n.lastElementChild;
  }
  return l && (!E(l) || !D(l)) ? N(l) : l;
}, ee = (e) => {
  const t = e.target;
  return R(t);
}, R = (e) => {
  var t;
  let l;
  if (e.nextElementSibling)
    l = e.nextElementSibling;
  else {
    const n = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    l = n == null ? void 0 : n.firstElementChild;
  }
  return l && (!E(l) || !D(l)) ? R(l) : l;
}, te = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!E(t) || !D(t)) ? R(t) : t;
}, ne = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!E(t) || !D(t)) ? N(t) : t;
}, V = ["alt", "control", "shift", "meta"], st = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, ie = {
  "keydown.up": (e) => {
    const t = K(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.down": (e) => {
    const t = X(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.left": (e) => {
    const t = Z(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.right": (e) => {
    const t = ee(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.control.up": (e) => {
    const t = ot(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = at(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.left": (e) => {
    const t = te(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.right": (e) => {
    const t = ne(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.end": (e) => {
    const t = ne(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = X(e);
      t && t.focus();
    }
  },
  "keydown.shift.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = K(e);
      t && t.focus();
    }
  },
  "keydown.home": (e) => {
    const t = te(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.tab": (e) => {
    const t = ee(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.shift.tab": (e) => {
    const t = Z(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  }
};
function rt(e) {
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
      a = Array.from(o.children).filter((s) => E(s) && D(s));
    return a;
  }, l = (n) => (o) => {
    const a = st[o.key] || o.key.toLowerCase();
    if (V.includes(a))
      return;
    const s = n.handlers || ie;
    for (const r of Object.keys(s)) {
      const [i, ...c] = r.split(".");
      if (i === "keydown" && c.includes(a)) {
        const p = s[r], b = c.filter((d) => V.includes(d)), h = V.some((d) => {
          const M = d.charAt(0).toUpperCase() + d.slice(1);
          return o.getModifierState(M);
        });
        if (b.length > 0) {
          if (h) {
            for (const d of V)
              if (c.includes(d)) {
                const M = d.charAt(0).toUpperCase() + d.slice(1);
                o.getModifierState(M) && p(o);
              }
          }
        } else
          h || p(o);
      }
    }
  };
  oe(() => {
    for (const n of e) {
      const o = t(n);
      for (const a of o)
        a.addEventListener("keydown", l(n));
    }
  }), he(() => {
    for (const n of e) {
      const o = t(n);
      for (const a of o)
        a.removeEventListener("keydown", l(n));
    }
  });
}
const ut = (e) => (De("data-v-8bc67bdf"), e = e(), Ee(), e), it = ["event"], ct = { colspan: "5" }, dt = /* @__PURE__ */ ut(() => /* @__PURE__ */ u("tr", null, [
  /* @__PURE__ */ u("td", null, "M"),
  /* @__PURE__ */ u("td", null, "T"),
  /* @__PURE__ */ u("td", null, "W"),
  /* @__PURE__ */ u("td", null, "T"),
  /* @__PURE__ */ u("td", null, "F"),
  /* @__PURE__ */ u("td", null, "S"),
  /* @__PURE__ */ u("td", null, "S")
], -1)), pt = ["onClick"], ft = /* @__PURE__ */ w({
  __name: "ADatePicker",
  props: {
    modelValue: null,
    event: null
  },
  emits: ["modelValue"],
  setup(e, { emit: t }) {
    const l = e, n = 6, o = 7, a = /* @__PURE__ */ new Date(), s = y(l.modelValue || void 0), r = y(), i = y(), c = y([]);
    oe(async () => {
      let f = /* @__PURE__ */ new Date();
      f ? (s.value = f, r.value = s.value.getMonth(), i.value = s.value.getFullYear()) : (r.value = a.getMonth(), i.value = a.getFullYear()), p(), await ke();
      const I = document.getElementsByClassName("selecteddate");
      if (I.length > 0)
        I[0].focus();
      else {
        const _ = document.getElementsByClassName("todaysdate");
        _.length > 0 && _[0].focus();
      }
    }), q([r, i], () => {
      p();
    });
    const p = () => {
      c.value = [];
      const f = new Date(i.value, r.value, 1), I = f.getDay(), _ = f.setDate(f.getDate() - I);
      for (let T of Array(43).keys())
        c.value.push(_ + T * 864e5);
    }, b = () => {
      i.value -= 1;
    }, h = () => {
      i.value += 1;
    }, d = () => {
      r.value == 0 ? (r.value = 11, b()) : r.value -= 1;
    }, M = () => {
      r.value == 11 ? (r.value = 0, h()) : r.value += 1;
    }, de = (f) => {
      if (r.value === a.getMonth())
        return a.toDateString() === new Date(f).toDateString();
    }, pe = (f) => new Date(f).toDateString() === new Date(s.value).toDateString();
    x({
      get: () => modelValue.value,
      set: (f) => {
        Q(f);
      }
    });
    const Q = (f) => {
      s.value = new Date(c.value[f]), t("modelValue", s.value.getTime());
    }, fe = x(() => new Date(i.value, r.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return rt([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...ie,
          "keydown.pageup": d,
          "keydown.shift.pageup": b,
          "keydown.pagedown": M,
          "keydown.shift.pagedown": h,
          // 'keydown.tab': selectDate // select this date
          // 'keydown.enter': selectDate // select this date
          "keydown.shift.tab": () => {
          },
          // disable - not working
          "keydown.shift.enter": () => {
          }
        }
      }
    ]), (f, I) => (m(), g("div", {
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
          u("th", ct, A(v(fe)), 1),
          u("td", {
            onClick: M,
            tabindex: -1
          }, ">")
        ]),
        dt,
        (m(), g(O, null, $(n, (_) => u("tr", { key: _ }, [
          (m(), g(O, null, $(o, (T) => u("td", {
            key: (_ - 1) * o + T,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            onClick: we((me) => Q(me), ["prevent", "stop"]),
            class: ae({
              todaysDate: de(c.value[(_ - 1) * o + T]),
              selectedDate: pe(c.value[(_ - 1) * o + T])
            })
          }, A(new Date(c.value[(_ - 1) * o + T]).getDate()), 11, pt)), 64))
        ])), 64))
      ])
    ], 8, it));
  }
});
const mt = /* @__PURE__ */ C(ft, [["__scopeId", "data-v-8bc67bdf"]]), vt = /* @__PURE__ */ w({
  __name: "CollapseButton",
  props: {
    collapsed: { type: Boolean }
  },
  setup(e) {
    return (t, l) => (m(), g("button", {
      class: ae(["collapse-button", e.collapsed ? "rotated" : "unrotated"])
    }, "×", 2));
  }
});
const yt = /* @__PURE__ */ C(vt, [["__scopeId", "data-v-6f1c1b45"]]), gt = /* @__PURE__ */ w({
  __name: "AForm",
  props: {
    modelValue: null,
    data: null,
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const l = e, n = y(l.data || {}), o = (s) => {
      let r = {};
      for (const [i, c] of Object.entries(s))
        ["component", "fieldtype"].includes(i) || (r[i] = c), i === "rows" && c && c.length === 0 && (r.rows = n.value[s.fieldname]);
      return r;
    }, a = x({
      get: () => l.modelValue.map((s, r) => x({
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
    return (s, r) => (m(), g("form", null, [
      (m(!0), g(O, null, $(e.modelValue, (i, c) => (m(), B(xe(i.component), Ae({
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
const ce = /* @__PURE__ */ C(gt, [["__scopeId", "data-v-74d66cf2"]]), ht = /* @__PURE__ */ w({
  __name: "AFieldset",
  props: {
    schema: null,
    label: null,
    collapsible: { type: Boolean },
    data: null
  },
  setup(e) {
    const t = e, l = y(t.data || []);
    let n = y(!1), o = y(t.collapsible);
    const a = y(t.schema);
    function s(r) {
      r.preventDefault(), o.value && (n.value = !n.value);
    }
    return (r, i) => (m(), g("fieldset", null, [
      u("legend", {
        onClick: s,
        onSubmit: s
      }, [
        Ce(A(e.label) + " ", 1),
        v(o) ? (m(), B(yt, {
          key: 0,
          collapsed: v(n)
        }, null, 8, ["collapsed"])) : Me("", !0)
      ], 32),
      Te(r.$slots, "default", { collapsed: v(n) }, () => [
        k(Ie(ce, {
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
const _t = /* @__PURE__ */ C(ht, [["__scopeId", "data-v-cad9b578"]]), bt = ["id", "disabled", "required"], kt = ["for"], wt = ["innerHTML"], Dt = /* @__PURE__ */ w({
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
    const l = e, n = x({
      get: () => l.modelValue,
      set: (o) => {
        t("update:modelValue", o);
      }
    });
    return (o, a) => (m(), g("div", null, [
      k(u("input", {
        "onUpdate:modelValue": a[0] || (a[0] = (s) => P(n) ? n.value = s : null),
        type: "number",
        id: e.uuid,
        disabled: e.readonly,
        required: e.required
      }, null, 8, bt), [
        [H, v(n)]
      ]),
      u("label", { for: e.uuid }, A(e.label), 9, kt),
      k(u("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, wt), [
        [S, e.validation.errorMessage]
      ])
    ]));
  }
});
const Et = /* @__PURE__ */ C(Dt, [["__scopeId", "data-v-be33e6c4"]]), le = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function xt(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function At(e) {
  var l;
  let t = e.value;
  if (t) {
    const n = xt(t);
    if (n) {
      const o = e.instance.locale;
      t = n(o);
    }
  } else {
    const o = (l = e.instance.schema.fieldtype) == null ? void 0 : l.toLowerCase();
    o && le[o] && (t = le[o]);
  }
  return t;
}
function Ct(e, t) {
  t || (t = "#");
  let l = e;
  const n = [t, "/", "-", "(", ")", " "];
  for (const o of n)
    l = l.replaceAll(o, "");
  return l;
}
function Mt(e, t, l) {
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
function Tt(e, t) {
  const l = At(t);
  if (!l)
    return;
  const n = "#", o = e.value, a = Ct(o, n);
  if (a) {
    const s = Mt(a, l, n);
    t.instance.maskFilled && (t.instance.maskFilled = !s.includes(n)), e.value = s;
  } else
    e.value = l;
}
const It = w({
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
    const l = y(!1), n = Se("locale", "");
    return { inputText: x({
      get() {
        return e.modelValue;
      },
      set(a) {
        t.emit("update:modelValue", a);
      }
    }), locale: n, maskFilled: l };
  },
  directives: {
    mask: Tt
  }
});
const St = ["id", "disabled", "maxlength", "required"], Vt = ["for"], Ot = ["innerHTML"];
function $t(e, t, l, n, o, a) {
  const s = Ve("mask");
  return m(), g("div", null, [
    k(u("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.inputText = r),
      id: e.uuid,
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required
    }, null, 8, St), [
      [H, e.inputText],
      [s, e.mask]
    ]),
    u("label", { for: e.uuid }, A(e.label), 9, Vt),
    k(u("p", {
      innerHTML: e.validation.errorMessage
    }, null, 8, Ot), [
      [S, e.validation.errorMessage]
    ])
  ]);
}
const Lt = /* @__PURE__ */ C(It, [["render", $t], ["__scopeId", "data-v-76dba9b8"]]);
function Bt(e) {
  e.component("ACheckbox", qe), e.component("ACombobox", Ue), e.component("ADate", je), e.component("ADatePicker", mt), e.component("AFieldset", _t), e.component("AForm", ce), e.component("ANumericInput", Et), e.component("ATextInput", Lt);
}
export {
  qe as ACheckbox,
  Ue as AComboBox,
  je as ADate,
  mt as ADatePicker,
  _t as AFieldset,
  ce as AForm,
  Et as ANumericInput,
  Lt as ATextInput,
  Bt as install
};
//# sourceMappingURL=aform.js.map
