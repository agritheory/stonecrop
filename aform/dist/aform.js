import { defineComponent as E, computed as M, openBlock as g, createElementBlock as b, createElementVNode as u, withDirectives as T, isRef as ce, vModelCheckbox as ke, unref as k, toDisplayString as C, vShow as P, resolveComponent as we, createBlock as R, withCtx as xe, onMounted as U, onBeforeUnmount as Ce, ref as h, watch as F, getCurrentScope as Ee, onScopeDispose as Ae, inject as ie, nextTick as de, Fragment as V, renderList as B, normalizeStyle as fe, withModifiers as pe, normalizeClass as Q, createCommentVNode as ve, pushScopeId as Ie, popScopeId as Me, resolveDynamicComponent as Se, mergeProps as Te, createTextVNode as Oe, renderSlot as $e, createVNode as Ve, vModelText as me, resolveDirective as Be } from "vue";
const Le = { id: "checkbox-container" }, Pe = ["id", "readonly", "required"], Fe = { id: "custom-checkbox" }, He = ["for"], qe = ["innerHTML"], Ye = /* @__PURE__ */ E({
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
      set(a) {
        t("update:value", a);
      }
    });
    return (a, o) => (g(), b("div", null, [
      u("label", Le, [
        T(u("input", {
          "onUpdate:modelValue": o[0] || (o[0] = (s) => ce(n) ? n.value = s : null),
          type: "checkbox",
          id: e.uuid,
          class: "checkbox",
          readonly: e.readOnly,
          required: e.required
        }, null, 8, Pe), [
          [ke, k(n)]
        ]),
        u("span", Fe, C(k(n)), 1)
      ]),
      u("label", {
        for: e.uuid,
        id: "checkbox-label"
      }, C(e.label), 9, He),
      T(u("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, qe), [
        [P, e.validation.errorMessage]
      ])
    ]));
  }
});
const S = (e, t) => {
  const l = e.__vccOpts || e;
  for (const [n, a] of t)
    l[n] = a;
  return l;
}, Re = /* @__PURE__ */ S(Ye, [["__scopeId", "data-v-743cd4db"]]), Ue = /* @__PURE__ */ u("div", null, [
  /* @__PURE__ */ u("input", { type: "text" }),
  /* @__PURE__ */ u("input", { type: "text" }),
  /* @__PURE__ */ u("input", { type: "text" })
], -1), Qe = /* @__PURE__ */ E({
  __name: "AComboBox",
  props: ["event", "cellData", "tableID"],
  setup(e) {
    return (t, l) => {
      const n = we("ATableModal");
      return g(), R(n, {
        event: e.event,
        cellData: e.cellData,
        class: "amodal"
      }, {
        default: xe(() => [
          Ue
        ]),
        _: 1
      }, 8, ["event", "cellData"]);
    };
  }
});
var K;
const ye = typeof window < "u", We = (e) => typeof e == "string", je = () => {
};
ye && (K = window == null ? void 0 : window.navigator) != null && K.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function ge(e) {
  return typeof e == "function" ? e() : k(e);
}
function ze(e) {
  return e;
}
function Ge(e) {
  return Ee() ? (Ae(e), !0) : !1;
}
function Y(e) {
  var t;
  const l = ge(e);
  return (t = l == null ? void 0 : l.$el) != null ? t : l;
}
const he = ye ? window : void 0;
function Je(...e) {
  let t, l, n, a;
  if (We(e[0]) || Array.isArray(e[0]) ? ([l, n, a] = e, t = he) : [t, l, n, a] = e, !t)
    return je;
  Array.isArray(l) || (l = [l]), Array.isArray(n) || (n = [n]);
  const o = [], s = () => {
    o.forEach((m) => m()), o.length = 0;
  }, r = (m, D, _, v) => (m.addEventListener(D, _, v), () => m.removeEventListener(D, _, v)), i = F(() => [Y(t), ge(a)], ([m, D]) => {
    s(), m && o.push(...l.flatMap((_) => n.map((v) => r(m, _, v, D))));
  }, { immediate: !0, flush: "post" }), c = () => {
    i(), s();
  };
  return Ge(c), c;
}
const X = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Z = "__vueuse_ssr_handlers__";
X[Z] = X[Z] || {};
function Ke(e, { window: t = he, scrollTarget: l } = {}) {
  const n = h(!1), a = () => {
    if (!t)
      return;
    const o = t.document, s = Y(e);
    if (!s)
      n.value = !1;
    else {
      const r = s.getBoundingClientRect();
      n.value = r.top <= (t.innerHeight || o.documentElement.clientHeight) && r.left <= (t.innerWidth || o.documentElement.clientWidth) && r.bottom >= 0 && r.right >= 0;
    }
  };
  return F(() => Y(e), () => a(), { immediate: !0, flush: "post" }), t && Je(l || t, "scroll", a, {
    capture: !1,
    passive: !0
  }), n;
}
var N;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(N || (N = {}));
var Xe = Object.defineProperty, ee = Object.getOwnPropertySymbols, Ze = Object.prototype.hasOwnProperty, Ne = Object.prototype.propertyIsEnumerable, te = (e, t, l) => t in e ? Xe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: l }) : e[t] = l, et = (e, t) => {
  for (var l in t || (t = {}))
    Ze.call(t, l) && te(e, l, t[l]);
  if (ee)
    for (var l of ee(t))
      Ne.call(t, l) && te(e, l, t[l]);
  return e;
};
const tt = {
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
et({
  linear: ze
}, tt);
const A = (e) => {
  let t = Ke(e).value;
  return t = t && e.offsetHeight > 0, t;
}, I = (e) => e.tabIndex >= 0, ne = (e) => {
  const t = e.target;
  return W(t);
}, W = (e) => {
  var t;
  let l;
  if (e instanceof HTMLTableCellElement) {
    const n = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    if (n) {
      const a = Array.from(n.children)[e.cellIndex];
      a && (l = a);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const n = e.previousElementSibling;
    n && (l = n);
  }
  return l && (!I(l) || !A(l)) ? W(l) : l;
}, nt = (e) => {
  var t;
  const l = e.target;
  let n;
  if (l instanceof HTMLTableCellElement) {
    const a = (t = l.parentElement) == null ? void 0 : t.parentElement;
    if (a) {
      const o = a.firstElementChild.children[l.cellIndex];
      o && (n = o);
    }
  } else if (l instanceof HTMLTableRowElement) {
    const a = l.parentElement;
    if (a) {
      const o = a.firstElementChild;
      o && (n = o);
    }
  }
  return n && (!I(n) || !A(n)) ? j(n) : n;
}, le = (e) => {
  const t = e.target;
  return j(t);
}, j = (e) => {
  var t;
  let l;
  if (e instanceof HTMLTableCellElement) {
    const n = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    if (n) {
      const a = Array.from(n.children)[e.cellIndex];
      a && (l = a);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const n = e.nextElementSibling;
    n && (l = n);
  }
  return l && (!I(l) || !A(l)) ? j(l) : l;
}, lt = (e) => {
  var t;
  const l = e.target;
  let n;
  if (l instanceof HTMLTableCellElement) {
    const a = (t = l.parentElement) == null ? void 0 : t.parentElement;
    if (a) {
      const o = a.lastElementChild.children[l.cellIndex];
      o && (n = o);
    }
  } else if (l instanceof HTMLTableRowElement) {
    const a = l.parentElement;
    if (a) {
      const o = a.lastElementChild;
      o && (n = o);
    }
  }
  return n && (!I(n) || !A(n)) ? W(n) : n;
}, ae = (e) => {
  const t = e.target;
  return z(t);
}, z = (e) => {
  var t;
  let l;
  if (e.previousElementSibling)
    l = e.previousElementSibling;
  else {
    const n = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    l = n == null ? void 0 : n.lastElementChild;
  }
  return l && (!I(l) || !A(l)) ? z(l) : l;
}, oe = (e) => {
  const t = e.target;
  return G(t);
}, G = (e) => {
  var t;
  let l;
  if (e.nextElementSibling)
    l = e.nextElementSibling;
  else {
    const n = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    l = n == null ? void 0 : n.firstElementChild;
  }
  return l && (!I(l) || !A(l)) ? G(l) : l;
}, se = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!I(t) || !A(t)) ? G(t) : t;
}, re = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!I(t) || !A(t)) ? z(t) : t;
}, L = ["alt", "control", "shift", "meta"], at = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, J = {
  "keydown.up": (e) => {
    const t = ne(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.down": (e) => {
    const t = le(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.left": (e) => {
    const t = ae(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.right": (e) => {
    const t = oe(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.control.up": (e) => {
    const t = nt(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = lt(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.left": (e) => {
    const t = se(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.right": (e) => {
    const t = re(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.end": (e) => {
    const t = re(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = le(e);
      t && t.focus();
    }
  },
  "keydown.shift.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = ne(e);
      t && t.focus();
    }
  },
  "keydown.home": (e) => {
    const t = se(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.tab": (e) => {
    const t = oe(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.shift.tab": (e) => {
    const t = ae(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  }
};
function _e(e) {
  const t = (n) => {
    let a = null;
    n.parent && (typeof n.parent == "string" ? a = document.querySelector(n.parent) : n.parent instanceof Element ? a = n.parent : a = n.parent.value);
    let o = [];
    if (n.selectors)
      if (typeof n.selectors == "string")
        o = a ? Array.from(a.querySelectorAll(n.selectors)) : Array.from(document.querySelectorAll(n.selectors));
      else if (n.selectors instanceof Element)
        o.push(n.selectors);
      else if (Array.isArray(n.selectors.value))
        for (const s of n.selectors.value)
          s instanceof Element ? o.push(s) : o.push(s.$el);
      else
        o.push(n.selectors.value);
    else
      o = Array.from(a.children).filter((s) => I(s) && A(s));
    return o;
  }, l = (n) => (a) => {
    const o = at[a.key] || a.key.toLowerCase();
    if (L.includes(o))
      return;
    const s = n.handlers || J;
    for (const r of Object.keys(s)) {
      const [i, ...c] = r.split(".");
      if (i === "keydown" && c.includes(o)) {
        const m = s[r], D = c.filter((v) => L.includes(v)), _ = L.some((v) => {
          const x = v.charAt(0).toUpperCase() + v.slice(1);
          return a.getModifierState(x);
        });
        if (D.length > 0) {
          if (_) {
            for (const v of L)
              if (c.includes(v)) {
                const x = v.charAt(0).toUpperCase() + v.slice(1);
                a.getModifierState(x) && m(a);
              }
          }
        } else
          _ || m(a);
      }
    }
  };
  U(() => {
    for (const n of e) {
      const a = t(n);
      for (const o of a)
        o.addEventListener("keydown", l(n));
    }
  }), Ce(() => {
    for (const n of e) {
      const a = t(n);
      for (const o of a)
        o.removeEventListener("keydown", l(n));
    }
  });
}
const ot = ["event", "colIndex", "rowIndex", "tableid"], st = { colspan: "5" }, rt = ["onClick"], ut = /* @__PURE__ */ E({
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
    const t = e, l = ie(t.tableid), n = 6, a = 7, o = /* @__PURE__ */ new Date(), s = h(), r = h(), i = h(), c = h([]);
    U(async () => {
      let d = l.cellData(t.colIndex, t.rowIndex);
      d ? (d instanceof Date || (d = new Date(d)), s.value = d, r.value = s.value.getMonth(), i.value = s.value.getFullYear()) : (r.value = o.getMonth(), i.value = o.getFullYear()), m(), await de();
      const p = document.getElementsByClassName("selecteddate");
      if (p.length > 0)
        p[0].focus();
      else {
        const f = document.getElementsByClassName("todaysdate");
        f.length > 0 && f[0].focus();
      }
    }), F([r, i], () => {
      m();
    });
    const m = () => {
      c.value = [];
      const d = new Date(i.value, r.value, 1), p = d.getDay(), f = d.setDate(d.getDate() - p);
      for (let w of Array(43).keys())
        c.value.push(f + w * 864e5);
    }, D = () => {
      i.value -= 1;
    }, _ = () => {
      i.value += 1;
    }, v = () => {
      r.value == 0 ? (r.value = 11, D()) : r.value -= 1;
    }, x = () => {
      r.value == 11 ? (r.value = 0, _()) : r.value += 1;
    }, O = (d) => {
      if (r.value === o.getMonth())
        return o.toDateString() === new Date(d).toDateString();
    }, $ = (d) => new Date(d).toDateString() === new Date(s.value).toDateString(), H = (d, p) => {
      s.value = new Date(c.value[p]), q();
    }, q = () => {
      l.setCellData(t.rowIndex, t.colIndex, s.value.getTime());
    }, y = M(() => new Date(i.value, r.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return _e([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...J,
          "keydown.pageup": v,
          "keydown.shift.pageup": D,
          "keydown.pagedown": x,
          "keydown.shift.pagedown": _
        }
      }
    ]), (d, p) => e.readonly ? ve("", !0) : (g(), b("div", {
      key: 0,
      event: e.event,
      colIndex: e.colIndex,
      rowIndex: e.rowIndex,
      tableid: e.tableid,
      class: "adate",
      tabindex: "0",
      ref: "adatepicker"
    }, [
      u("table", null, [
        u("tr", null, [
          u("td", {
            onClick: v,
            tabindex: -1
          }, "<"),
          u("th", st, C(k(y)), 1),
          u("td", {
            onClick: x,
            tabindex: -1
          }, ">")
        ]),
        (g(), b(V, null, B(n, (f) => u("tr", { key: f }, [
          (g(), b(V, null, B(a, (w) => u("td", {
            key: (f - 1) * a + w,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            style: fe({
              border: $(c.value[(f - 1) * a + w]) ? "2px solid var(--focus-cell-outline)" : "none",
              borderBottomColor: O(c.value[(f - 1) * a + w]) ? "var(--focus-cell-outline)" : "none"
            }),
            onClick: pe((De) => H(De, (f - 1) * a + w), ["prevent", "stop"]),
            class: Q({
              todaysdate: O(c.value[(f - 1) * a + w]),
              selecteddate: $(c.value[(f - 1) * a + w])
            })
          }, C(new Date(c.value[(f - 1) * a + w]).getDate()), 15, rt)), 64))
        ])), 64))
      ])
    ], 8, ot));
  }
});
const ct = /* @__PURE__ */ S(ut, [["__scopeId", "data-v-fcdc102d"]]), it = (e) => (Ie("data-v-f52fdf43"), e = e(), Me(), e), dt = ["event"], ft = { class: "adate-header" }, pt = { colspan: "5" }, vt = /* @__PURE__ */ it(() => /* @__PURE__ */ u("tr", { class: "adate-header" }, [
  /* @__PURE__ */ u("td", null, "M"),
  /* @__PURE__ */ u("td", null, "T"),
  /* @__PURE__ */ u("td", null, "W"),
  /* @__PURE__ */ u("td", null, "T"),
  /* @__PURE__ */ u("td", null, "F"),
  /* @__PURE__ */ u("td", null, "S"),
  /* @__PURE__ */ u("td", null, "S")
], -1)), mt = ["onClick"], yt = /* @__PURE__ */ E({
  __name: "ADatePicker",
  props: {
    value: null,
    event: null
  },
  emits: ["update:modelValue", "selectedDate"],
  setup(e, { emit: t }) {
    const l = e, n = 6, a = 7, o = /* @__PURE__ */ new Date(), s = h(l.value || void 0), r = h(), i = h(), c = h([]);
    U(async () => {
      let y = /* @__PURE__ */ new Date();
      y ? (s.value = y, r.value = s.value.getMonth(), i.value = s.value.getFullYear()) : (r.value = o.getMonth(), i.value = o.getFullYear()), m(), await de();
      const d = document.getElementsByClassName("selecteddate");
      if (d.length > 0)
        d[0].focus();
      else {
        const p = document.getElementsByClassName("todaysdate");
        p.length > 0 && p[0].focus();
      }
    }), F([r, i], () => {
      m();
    });
    const m = () => {
      c.value = [];
      const y = new Date(i.value, r.value, 1), d = y.getDay(), p = y.setDate(y.getDate() - d);
      for (let f of Array(43).keys())
        c.value.push(p + f * 864e5);
    }, D = () => {
      i.value -= 1;
    }, _ = () => {
      i.value += 1;
    }, v = () => {
      r.value == 0 ? (r.value = 11, D()) : r.value -= 1;
    }, x = () => {
      r.value == 11 ? (r.value = 0, _()) : r.value += 1;
    }, O = (y) => {
      if (r.value === o.getMonth())
        return o.toDateString() === new Date(y).toDateString();
    }, $ = (y) => new Date(y).toDateString() === new Date(s.value).toDateString();
    M({
      get: () => s.value,
      set: (y) => {
        t("update:modelValue", y);
      }
    });
    const H = (y, d) => {
      s.value = new Date(c.value[d]), t("selectedDate", s.value);
    }, q = M(() => new Date(i.value, r.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return _e([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...J,
          "keydown.pageup": v,
          "keydown.shift.pageup": D,
          "keydown.pagedown": x,
          "keydown.shift.pagedown": _
        }
      }
    ]), (y, d) => (g(), b("div", {
      event: e.event,
      class: "adate",
      tabindex: "0",
      ref: "adatepicker"
    }, [
      u("table", null, [
        u("tr", ft, [
          u("td", {
            onClick: v,
            tabindex: -1
          }, "<"),
          u("th", pt, C(k(q)), 1),
          u("td", {
            onClick: x,
            tabindex: -1
          }, ">")
        ]),
        vt,
        (g(), b(V, null, B(n, (p) => u("tr", { key: p }, [
          (g(), b(V, null, B(a, (f) => u("td", {
            key: (p - 1) * a + f,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            style: fe({
              border: $(c.value[(p - 1) * a + f]) ? "2px solid var(--focus-cell-outline)" : "none",
              borderBottomColor: O(c.value[(p - 1) * a + f]) ? "var(--focus-cell-outline)" : "none"
            }),
            onClick: pe((w) => H(w, (p - 1) * a + f), ["prevent", "stop"]),
            class: Q({
              todaysdate: O(c.value[(p - 1) * a + f]),
              selecteddate: $(c.value[(p - 1) * a + f])
            })
          }, C(new Date(c.value[(p - 1) * a + f]).getDate()), 15, mt)), 64))
        ])), 64))
      ])
    ], 8, dt));
  }
});
const gt = /* @__PURE__ */ S(yt, [["__scopeId", "data-v-f52fdf43"]]), ht = /* @__PURE__ */ E({
  __name: "CollapseButton",
  props: {
    collapsed: { type: Boolean }
  },
  setup(e) {
    return (t, l) => (g(), b("button", {
      class: Q(["collapse-button", e.collapsed ? "rotated" : "unrotated"])
    }, "×", 2));
  }
});
const _t = /* @__PURE__ */ S(ht, [["__scopeId", "data-v-6f1c1b45"]]), bt = /* @__PURE__ */ E({
  __name: "AForm",
  props: {
    modelValue: null,
    data: null,
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const l = e, n = h(l.data || {}), a = (s) => {
      let r = {};
      for (const [i, c] of Object.entries(s))
        ["component", "fieldtype"].includes(i) || (r[i] = c), i === "rows" && c && c.length === 0 && (r.rows = n.value[s.fieldname]);
      return r;
    }, o = M({
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
    return (s, r) => (g(), b("form", null, [
      (g(!0), b(V, null, B(e.modelValue, (i, c) => (g(), R(Se(i.component), Te({
        key: c,
        schema: i,
        modelValue: k(o)[c].value,
        "onUpdate:modelValue": (m) => k(o)[c].value = m,
        data: n.value[i.fieldname],
        readonly: e.readonly
      }, a(i)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
});
const be = /* @__PURE__ */ S(bt, [["__scopeId", "data-v-74d66cf2"]]), Dt = /* @__PURE__ */ E({
  __name: "AFieldset",
  props: {
    schema: null,
    label: null,
    collapsible: { type: Boolean },
    data: null
  },
  setup(e) {
    const t = e, l = h(t.data || []);
    let n = h(!1), a = h(t.collapsible);
    const o = h(t.schema);
    function s(r) {
      r.preventDefault(), a.value && (n.value = !n.value);
    }
    return (r, i) => (g(), b("fieldset", null, [
      u("legend", {
        onClick: s,
        onSubmit: s
      }, [
        Oe(C(e.label) + " ", 1),
        k(a) ? (g(), R(_t, {
          key: 0,
          collapsed: k(n)
        }, null, 8, ["collapsed"])) : ve("", !0)
      ], 32),
      $e(r.$slots, "default", { collapsed: k(n) }, () => [
        T(Ve(be, {
          modelValue: o.value,
          "onUpdate:modelValue": i[0] || (i[0] = (c) => o.value = c),
          data: l.value
        }, null, 8, ["modelValue", "data"]), [
          [P, !k(n)]
        ])
      ], !0)
    ]));
  }
});
const kt = /* @__PURE__ */ S(Dt, [["__scopeId", "data-v-cad9b578"]]), wt = ["id", "disabled", "required"], xt = ["for"], Ct = ["innerHTML"], Et = /* @__PURE__ */ E({
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
      set: (a) => {
        t("update:modelValue", a);
      }
    });
    return (a, o) => (g(), b("div", null, [
      T(u("input", {
        "onUpdate:modelValue": o[0] || (o[0] = (s) => ce(n) ? n.value = s : null),
        type: "number",
        id: e.uuid,
        disabled: e.readonly,
        required: e.required
      }, null, 8, wt), [
        [me, k(n)]
      ]),
      u("label", { for: e.uuid }, C(e.label), 9, xt),
      T(u("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, Ct), [
        [P, e.validation.errorMessage]
      ])
    ]));
  }
});
const At = /* @__PURE__ */ S(Et, [["__scopeId", "data-v-be33e6c4"]]), ue = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function It(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function Mt(e) {
  var l;
  let t = e.value;
  if (t) {
    const n = It(t);
    if (n) {
      const a = e.instance.locale;
      t = n(a);
    }
  } else {
    const a = (l = e.instance.schema.fieldtype) == null ? void 0 : l.toLowerCase();
    a && ue[a] && (t = ue[a]);
  }
  return t;
}
function St(e, t) {
  t || (t = "#");
  let l = e;
  const n = [t, "/", "-", "(", ")", " "];
  for (const a of n)
    l = l.replaceAll(a, "");
  return l;
}
function Tt(e, t, l) {
  l || (l = "#");
  let n = t;
  for (const a of e) {
    const o = n.indexOf(l);
    if (o !== -1) {
      const s = n.substring(0, o), r = n.substring(o + 1);
      n = s + a + r;
    }
  }
  return n.slice(0, t.length);
}
function Ot(e, t) {
  const l = Mt(t);
  if (!l)
    return;
  const n = "#", a = e.value, o = St(a, n);
  if (o) {
    const s = Tt(o, l, n);
    t.instance.maskFilled && (t.instance.maskFilled = !s.includes(n)), e.value = s;
  } else
    e.value = l;
}
const $t = E({
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
    const l = h(!1), n = ie("locale", "");
    return { inputText: M({
      get() {
        return e.modelValue;
      },
      set(o) {
        t.emit("update:modelValue", o);
      }
    }), locale: n, maskFilled: l };
  },
  directives: {
    mask: Ot
  }
});
const Vt = ["id", "disabled", "maxlength", "required"], Bt = ["for"], Lt = ["innerHTML"];
function Pt(e, t, l, n, a, o) {
  const s = Be("mask");
  return g(), b("div", null, [
    T(u("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.inputText = r),
      id: e.uuid,
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required
    }, null, 8, Vt), [
      [me, e.inputText],
      [s, e.mask]
    ]),
    u("label", { for: e.uuid }, C(e.label), 9, Bt),
    T(u("p", {
      innerHTML: e.validation.errorMessage
    }, null, 8, Lt), [
      [P, e.validation.errorMessage]
    ])
  ]);
}
const Ft = /* @__PURE__ */ S($t, [["render", Pt], ["__scopeId", "data-v-76dba9b8"]]);
function qt(e) {
  e.component("ACheckbox", Re), e.component("ACombobox", Qe), e.component("ADate", ct), e.component("ADatePicker", gt), e.component("AFieldset", kt), e.component("AForm", be), e.component("ANumericInput", At), e.component("ATextInput", Ft);
}
export {
  Re as ACheckbox,
  Qe as AComboBox,
  ct as ADate,
  gt as ADatePicker,
  kt as AFieldset,
  be as AForm,
  At as ANumericInput,
  Ft as ATextInput,
  qt as install
};
//# sourceMappingURL=aform.js.map
