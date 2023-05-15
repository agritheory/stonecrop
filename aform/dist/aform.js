import { defineComponent as D, computed as T, openBlock as v, createElementBlock as b, createElementVNode as c, withDirectives as A, isRef as le, vModelCheckbox as he, unref as y, toDisplayString as C, vShow as O, resolveComponent as be, createBlock as H, withCtx as _e, onMounted as oe, onBeforeUnmount as we, ref as g, watch as F, getCurrentScope as xe, onScopeDispose as ke, inject as ae, nextTick as De, Fragment as $, renderList as L, normalizeStyle as Ee, withModifiers as Ae, normalizeClass as se, createCommentVNode as re, resolveDynamicComponent as Ce, mergeProps as Ie, createTextVNode as Me, renderSlot as Te, createVNode as Se, vModelText as ue, resolveDirective as Oe } from "vue";
const $e = { id: "checkbox-container" }, Le = ["id", "readonly", "required"], Ve = { id: "custom-checkbox" }, Be = ["for"], Pe = ["innerHTML"], He = /* @__PURE__ */ D({
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
    const l = e, n = T({
      get() {
        return l.value;
      },
      set(o) {
        t("update:value", o);
      }
    });
    return (o, a) => (v(), b("div", null, [
      c("label", $e, [
        A(c("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (s) => le(n) ? n.value = s : null),
          type: "checkbox",
          id: e.uuid,
          class: "checkbox",
          readonly: e.readOnly,
          required: e.required
        }, null, 8, Le), [
          [he, y(n)]
        ]),
        c("span", Ve, C(y(n)), 1)
      ]),
      c("label", {
        for: e.uuid,
        id: "checkbox-label"
      }, C(e.label), 9, Be),
      A(c("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, Pe), [
        [O, e.validation.errorMessage]
      ])
    ]));
  }
});
const I = (e, t) => {
  const l = e.__vccOpts || e;
  for (const [n, o] of t)
    l[n] = o;
  return l;
}, Fe = /* @__PURE__ */ I(He, [["__scopeId", "data-v-743cd4db"]]), qe = /* @__PURE__ */ c("div", null, [
  /* @__PURE__ */ c("input", { type: "text" }),
  /* @__PURE__ */ c("input", { type: "text" }),
  /* @__PURE__ */ c("input", { type: "text" })
], -1), Ue = /* @__PURE__ */ D({
  __name: "AComboBox",
  props: ["event", "cellData", "tableID"],
  setup(e) {
    return (t, l) => {
      const n = be("ATableModal");
      return v(), H(n, {
        event: e.event,
        cellData: e.cellData,
        class: "amodal"
      }, {
        default: _e(() => [
          qe
        ]),
        _: 1
      }, 8, ["event", "cellData"]);
    };
  }
});
var N;
const ie = typeof window < "u", Re = (e) => typeof e == "string", Qe = () => {
};
ie && (N = window == null ? void 0 : window.navigator) != null && N.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function ce(e) {
  return typeof e == "function" ? e() : y(e);
}
function Ye(e) {
  return e;
}
function je(e) {
  return xe() ? (ke(e), !0) : !1;
}
function V(e) {
  var t;
  const l = ce(e);
  return (t = l == null ? void 0 : l.$el) != null ? t : l;
}
const de = ie ? window : void 0;
function Ne(...e) {
  let t, l, n, o;
  if (Re(e[0]) || Array.isArray(e[0]) ? ([l, n, o] = e, t = de) : [t, l, n, o] = e, !t)
    return Qe;
  Array.isArray(l) || (l = [l]), Array.isArray(n) || (n = [n]);
  const a = [], s = () => {
    a.forEach((f) => f()), a.length = 0;
  }, r = (f, _, h, d) => (f.addEventListener(_, h, d), () => f.removeEventListener(_, h, d)), u = F(() => [V(t), ce(o)], ([f, _]) => {
    s(), f && a.push(...l.flatMap((h) => n.map((d) => r(f, h, d, _))));
  }, { immediate: !0, flush: "post" }), i = () => {
    u(), s();
  };
  return je(i), i;
}
const B = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, P = "__vueuse_ssr_handlers__";
B[P] = B[P] || {};
B[P];
function We(e, { window: t = de, scrollTarget: l } = {}) {
  const n = g(!1), o = () => {
    if (!t)
      return;
    const a = t.document, s = V(e);
    if (!s)
      n.value = !1;
    else {
      const r = s.getBoundingClientRect();
      n.value = r.top <= (t.innerHeight || a.documentElement.clientHeight) && r.left <= (t.innerWidth || a.documentElement.clientWidth) && r.bottom >= 0 && r.right >= 0;
    }
  };
  return F(() => V(e), () => o(), { immediate: !0, flush: "post" }), t && Ne(l || t, "scroll", o, {
    capture: !1,
    passive: !0
  }), n;
}
var W;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(W || (W = {}));
var ze = Object.defineProperty, z = Object.getOwnPropertySymbols, Ge = Object.prototype.hasOwnProperty, Je = Object.prototype.propertyIsEnumerable, G = (e, t, l) => t in e ? ze(e, t, { enumerable: !0, configurable: !0, writable: !0, value: l }) : e[t] = l, Ke = (e, t) => {
  for (var l in t || (t = {}))
    Ge.call(t, l) && G(e, l, t[l]);
  if (z)
    for (var l of z(t))
      Je.call(t, l) && G(e, l, t[l]);
  return e;
};
const Xe = {
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
Ke({
  linear: Ye
}, Xe);
const x = (e) => {
  let t = We(e).value;
  return t = t && e.offsetHeight > 0, t;
}, k = (e) => e.tabIndex >= 0, J = (e) => {
  const t = e.target;
  return q(t);
}, q = (e) => {
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
  return l && (!k(l) || !x(l)) ? q(l) : l;
}, Ze = (e) => {
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
  return n && (!k(n) || !x(n)) ? U(n) : n;
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
  return l && (!k(l) || !x(l)) ? U(l) : l;
}, et = (e) => {
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
  return n && (!k(n) || !x(n)) ? q(n) : n;
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
  return l && (!k(l) || !x(l)) ? R(l) : l;
}, Z = (e) => {
  const t = e.target;
  return Q(t);
}, Q = (e) => {
  var t;
  let l;
  if (e.nextElementSibling)
    l = e.nextElementSibling;
  else {
    const n = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    l = n == null ? void 0 : n.firstElementChild;
  }
  return l && (!k(l) || !x(l)) ? Q(l) : l;
}, ee = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!k(t) || !x(t)) ? Q(t) : t;
}, te = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!k(t) || !x(t)) ? R(t) : t;
}, S = ["alt", "control", "shift", "meta"], tt = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, fe = {
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
    const t = Ze(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = et(e);
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
function nt(e) {
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
      a = Array.from(o.children).filter((s) => k(s) && x(s));
    return a;
  }, l = (n) => (o) => {
    const a = tt[o.key] || o.key.toLowerCase();
    if (S.includes(a))
      return;
    const s = n.handlers || fe;
    for (const r of Object.keys(s)) {
      const [u, ...i] = r.split(".");
      if (u === "keydown" && i.includes(a)) {
        const f = s[r], _ = i.filter((d) => S.includes(d)), h = S.some((d) => {
          const M = d.charAt(0).toUpperCase() + d.slice(1);
          return o.getModifierState(M);
        });
        if (_.length > 0) {
          if (h) {
            for (const d of S)
              if (i.includes(d)) {
                const M = d.charAt(0).toUpperCase() + d.slice(1);
                o.getModifierState(M) && f(o);
              }
          }
        } else
          h || f(o);
      }
    }
  };
  oe(() => {
    for (const n of e) {
      const o = t(n);
      for (const a of o)
        a.addEventListener("keydown", l(n));
    }
  }), we(() => {
    for (const n of e) {
      const o = t(n);
      for (const a of o)
        a.removeEventListener("keydown", l(n));
    }
  });
}
const lt = ["event", "colIndex", "rowIndex", "tableid"], ot = { colspan: "5" }, at = ["onClick"], st = /* @__PURE__ */ D({
  __name: "ADate",
  props: {
    colIndex: null,
    rowIndex: null,
    tableid: null,
    event: null,
    indent: null,
    readonly: { type: Boolean }
  },
  setup(e) {
    const t = e, l = ae(t.tableid), n = 6, o = 7, a = new Date(), s = g(), r = g(), u = g(), i = g([]);
    oe(async () => {
      let p = l.cellData(t.colIndex, t.rowIndex);
      p ? (p instanceof Date || (p = new Date(p)), s.value = p, r.value = s.value.getMonth(), u.value = s.value.getFullYear()) : (r.value = a.getMonth(), u.value = a.getFullYear()), f(), await De();
      const E = document.getElementsByClassName("selecteddate");
      if (E.length > 0)
        E[0].focus();
      else {
        const m = document.getElementsByClassName("todaysdate");
        m.length > 0 && m[0].focus();
      }
    }), F([r, u], () => {
      f();
    });
    const f = () => {
      i.value = [];
      const p = new Date(u.value, r.value, 1), E = p.getDay(), m = p.setDate(p.getDate() - E);
      for (let w of Array(43).keys())
        i.value.push(m + w * 864e5);
    }, _ = () => {
      u.value -= 1;
    }, h = () => {
      u.value += 1;
    }, d = () => {
      r.value == 0 ? (r.value = 11, _()) : r.value -= 1;
    }, M = () => {
      r.value == 11 ? (r.value = 0, h()) : r.value += 1;
    }, Y = (p) => {
      if (r.value === a.getMonth())
        return a.toDateString() === new Date(p).toDateString();
    }, j = (p) => new Date(p).toDateString() === new Date(s.value).toDateString(), me = (p, E) => {
      s.value = new Date(i.value[E]), ve();
    }, ve = () => {
      l.setCellData(t.rowIndex, t.colIndex, s.value.getTime());
    }, ye = T(() => new Date(u.value, r.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return nt([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...fe,
          "keydown.pageup": d,
          "keydown.shift.pageup": _,
          "keydown.pagedown": M,
          "keydown.shift.pagedown": h
        }
      }
    ]), (p, E) => e.readonly ? re("", !0) : (v(), b("div", {
      key: 0,
      event: e.event,
      colIndex: e.colIndex,
      rowIndex: e.rowIndex,
      tableid: e.tableid,
      class: "adate",
      tabindex: "0",
      ref: "adatepicker"
    }, [
      c("table", null, [
        c("tr", null, [
          c("td", {
            onClick: d,
            tabindex: -1
          }, "<"),
          c("th", ot, C(y(ye)), 1),
          c("td", {
            onClick: M,
            tabindex: -1
          }, ">")
        ]),
        (v(), b($, null, L(n, (m) => c("tr", { key: m }, [
          (v(), b($, null, L(o, (w) => c("td", {
            key: (m - 1) * o + w,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            style: Ee({
              border: j(i.value[(m - 1) * o + w]) ? "2px solid var(--focus-cell-outline)" : "none",
              borderBottomColor: Y(i.value[(m - 1) * o + w]) ? "var(--focus-cell-outline)" : "none"
            }),
            onClick: Ae((ge) => me(ge, (m - 1) * o + w), ["prevent", "stop"]),
            class: se({
              todaysdate: Y(i.value[(m - 1) * o + w]),
              selecteddate: j(i.value[(m - 1) * o + w])
            })
          }, C(new Date(i.value[(m - 1) * o + w]).getDate()), 15, at)), 64))
        ])), 64))
      ])
    ], 8, lt));
  }
});
const rt = /* @__PURE__ */ I(st, [["__scopeId", "data-v-fcdc102d"]]), ut = /* @__PURE__ */ D({
  __name: "CollapseButton",
  props: {
    collapsed: { type: Boolean }
  },
  setup(e) {
    return (t, l) => (v(), b("button", {
      class: se(["collapse-button", e.collapsed ? "rotated" : "unrotated"])
    }, "×", 2));
  }
});
const it = /* @__PURE__ */ I(ut, [["__scopeId", "data-v-6f1c1b45"]]), ct = /* @__PURE__ */ D({
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
      for (const [u, i] of Object.entries(s))
        ["component", "fieldtype"].includes(u) || (r[u] = i), u === "rows" && i && i.length === 0 && (r.rows = n.value[s.fieldname]);
      return r;
    }, a = T({
      get: () => l.modelValue.map((s, r) => T({
        get() {
          return s.value;
        },
        set: (u) => {
          l.modelValue[r].value = u, t("update:modelValue", l.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (s, r) => (v(), b("form", null, [
      (v(!0), b($, null, L(e.modelValue, (u, i) => (v(), H(Ce(u.component), Ie({
        key: i,
        schema: u,
        modelValue: y(a)[i].value,
        "onUpdate:modelValue": (f) => y(a)[i].value = f,
        data: n.value[u.fieldname],
        readonly: e.readonly
      }, o(u)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
});
const pe = /* @__PURE__ */ I(ct, [["__scopeId", "data-v-74d66cf2"]]), dt = /* @__PURE__ */ D({
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
    return (r, u) => (v(), b("fieldset", null, [
      c("legend", {
        onClick: s,
        onSubmit: s
      }, [
        Me(C(e.label) + " ", 1),
        y(o) ? (v(), H(it, {
          key: 0,
          collapsed: y(n)
        }, null, 8, ["collapsed"])) : re("", !0)
      ], 32),
      Te(r.$slots, "default", { collapsed: y(n) }, () => [
        A(Se(pe, {
          modelValue: a.value,
          "onUpdate:modelValue": u[0] || (u[0] = (i) => a.value = i),
          data: l.value
        }, null, 8, ["modelValue", "data"]), [
          [O, !y(n)]
        ])
      ], !0)
    ]));
  }
});
const ft = /* @__PURE__ */ I(dt, [["__scopeId", "data-v-cad9b578"]]), pt = ["id", "disabled", "required"], mt = ["for"], vt = ["innerHTML"], yt = /* @__PURE__ */ D({
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
    const l = e, n = T({
      get: () => l.modelValue,
      set: (o) => {
        t("update:modelValue", o);
      }
    });
    return (o, a) => (v(), b("div", null, [
      A(c("input", {
        "onUpdate:modelValue": a[0] || (a[0] = (s) => le(n) ? n.value = s : null),
        type: "number",
        id: e.uuid,
        disabled: e.readonly,
        required: e.required
      }, null, 8, pt), [
        [ue, y(n)]
      ]),
      c("label", { for: e.uuid }, C(e.label), 9, mt),
      A(c("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, vt), [
        [O, e.validation.errorMessage]
      ])
    ]));
  }
});
const gt = /* @__PURE__ */ I(yt, [["__scopeId", "data-v-be33e6c4"]]), ne = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function ht(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function bt(e) {
  var l;
  let t = e.value;
  if (t) {
    const n = ht(t);
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
function _t(e, t) {
  t || (t = "#");
  let l = e;
  const n = [t, "/", "-", "(", ")", " "];
  for (const o of n)
    l = l.replaceAll(o, "");
  return l;
}
function wt(e, t, l) {
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
function xt(e, t) {
  const l = bt(t);
  if (!l)
    return;
  const n = "#", o = e.value, a = _t(o, n);
  if (a) {
    const s = wt(a, l, n);
    t.instance.maskFilled && (t.instance.maskFilled = !s.includes(n)), e.value = s;
  } else
    e.value = l;
}
const kt = D({
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
    const l = g(!1), n = ae("locale", "");
    return { inputText: T({
      get() {
        return e.modelValue;
      },
      set(a) {
        t.emit("update:modelValue", a);
      }
    }), locale: n, maskFilled: l };
  },
  directives: {
    mask: xt
  }
});
const Dt = ["id", "disabled", "maxlength", "required"], Et = ["for"], At = ["innerHTML"];
function Ct(e, t, l, n, o, a) {
  const s = Oe("mask");
  return v(), b("div", null, [
    A(c("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.inputText = r),
      id: e.uuid,
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required
    }, null, 8, Dt), [
      [ue, e.inputText],
      [s, e.mask]
    ]),
    c("label", { for: e.uuid }, C(e.label), 9, Et),
    A(c("p", {
      innerHTML: e.validation.errorMessage
    }, null, 8, At), [
      [O, e.validation.errorMessage]
    ])
  ]);
}
const It = /* @__PURE__ */ I(kt, [["render", Ct], ["__scopeId", "data-v-76dba9b8"]]);
function Tt(e) {
  e.component("ACheckbox", Fe), e.component("ACombobox", Ue), e.component("ADate", rt), e.component("AFieldset", ft), e.component("AForm", pe), e.component("ANumericInput", gt), e.component("ATextInput", It);
}
export {
  Fe as ACheckbox,
  Ue as AComboBox,
  rt as ADate,
  ft as AFieldset,
  pe as AForm,
  gt as ANumericInput,
  It as ATextInput,
  Tt as install
};
//# sourceMappingURL=aform.js.map
