import { onMounted as ye, onBeforeUnmount as Ie, ref as E, watch as j, unref as s, getCurrentScope as _e, onScopeDispose as Ee, defineComponent as k, inject as O, computed as S, openBlock as p, createElementBlock as w, createBlock as P, resolveDynamicComponent as ie, mergeProps as V, toDisplayString as $, Fragment as L, createElementVNode as T, renderSlot as x, createCommentVNode as M, useCssVars as de, withDirectives as ce, vShow as ue, reactive as A, renderList as N, normalizeStyle as H, createTextVNode as ke, provide as Ce, nextTick as Ae, createVNode as z, withCtx as G } from "vue";
var J;
const pe = typeof window < "u", Te = (t) => typeof t == "string", $e = () => {
};
pe && (J = window == null ? void 0 : window.navigator) != null && J.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function fe(t) {
  return typeof t == "function" ? t() : s(t);
}
function Oe(t) {
  return t;
}
function De(t) {
  return _e() ? (Ee(t), !0) : !1;
}
function U(t) {
  var e;
  const n = fe(t);
  return (e = n == null ? void 0 : n.$el) != null ? e : n;
}
const me = pe ? window : void 0;
function Re(...t) {
  let e, n, o, l;
  if (Te(t[0]) || Array.isArray(t[0]) ? ([n, o, l] = t, e = me) : [e, n, o, l] = t, !e)
    return $e;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const a = [], r = () => {
    a.forEach((d) => d()), a.length = 0;
  }, i = (d, h, v, m) => (d.addEventListener(h, v, m), () => d.removeEventListener(h, v, m)), c = j(() => [U(e), fe(l)], ([d, h]) => {
    r(), d && a.push(...n.flatMap((v) => o.map((m) => i(d, v, m, h))));
  }, { immediate: !0, flush: "post" }), u = () => {
    c(), r();
  };
  return De(u), u;
}
const X = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Y = "__vueuse_ssr_handlers__";
X[Y] = X[Y] || {};
function Se(t, { window: e = me, scrollTarget: n } = {}) {
  const o = E(!1), l = () => {
    if (!e)
      return;
    const a = e.document, r = U(t);
    if (!r)
      o.value = !1;
    else {
      const i = r.getBoundingClientRect();
      o.value = i.top <= (e.innerHeight || a.documentElement.clientHeight) && i.left <= (e.innerWidth || a.documentElement.clientWidth) && i.bottom >= 0 && i.right >= 0;
    }
  };
  return j(() => U(t), () => l(), { immediate: !0, flush: "post" }), e && Re(n || e, "scroll", l, {
    capture: !1,
    passive: !0
  }), o;
}
var Z;
(function(t) {
  t.UP = "UP", t.RIGHT = "RIGHT", t.DOWN = "DOWN", t.LEFT = "LEFT", t.NONE = "NONE";
})(Z || (Z = {}));
var Pe = Object.defineProperty, K = Object.getOwnPropertySymbols, He = Object.prototype.hasOwnProperty, Le = Object.prototype.propertyIsEnumerable, ee = (t, e, n) => e in t ? Pe(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Me = (t, e) => {
  for (var n in e || (e = {}))
    He.call(e, n) && ee(t, n, e[n]);
  if (K)
    for (var n of K(e))
      Le.call(e, n) && ee(t, n, e[n]);
  return t;
};
const Ne = {
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
Me({
  linear: Oe
}, Ne);
const y = (t) => {
  let e = Se(t).value;
  return e = e && t.offsetHeight > 0, e;
}, I = (t) => t.tabIndex >= 0, te = (t) => {
  const e = t.target;
  return W(e);
}, W = (t) => {
  var e;
  let n;
  if (t instanceof HTMLTableCellElement) {
    const o = (e = t.parentElement) == null ? void 0 : e.previousElementSibling;
    if (o) {
      const l = Array.from(o.children)[t.cellIndex];
      l && (n = l);
    }
  } else if (t instanceof HTMLTableRowElement) {
    const o = t.previousElementSibling;
    o && (n = o);
  }
  return n && (!I(n) || !y(n)) ? W(n) : n;
}, Ue = (t) => {
  var e;
  const n = t.target;
  let o;
  if (n instanceof HTMLTableCellElement) {
    const l = (e = n.parentElement) == null ? void 0 : e.parentElement;
    if (l) {
      const a = l.firstElementChild.children[n.cellIndex];
      a && (o = a);
    }
  } else if (n instanceof HTMLTableRowElement) {
    const l = n.parentElement;
    if (l) {
      const a = l.firstElementChild;
      a && (o = a);
    }
  }
  return o && (!I(o) || !y(o)) ? B(o) : o;
}, ne = (t) => {
  const e = t.target;
  return B(e);
}, B = (t) => {
  var e;
  let n;
  if (t instanceof HTMLTableCellElement) {
    const o = (e = t.parentElement) == null ? void 0 : e.nextElementSibling;
    if (o) {
      const l = Array.from(o.children)[t.cellIndex];
      l && (n = l);
    }
  } else if (t instanceof HTMLTableRowElement) {
    const o = t.nextElementSibling;
    o && (n = o);
  }
  return n && (!I(n) || !y(n)) ? B(n) : n;
}, je = (t) => {
  var e;
  const n = t.target;
  let o;
  if (n instanceof HTMLTableCellElement) {
    const l = (e = n.parentElement) == null ? void 0 : e.parentElement;
    if (l) {
      const a = l.lastElementChild.children[n.cellIndex];
      a && (o = a);
    }
  } else if (n instanceof HTMLTableRowElement) {
    const l = n.parentElement;
    if (l) {
      const a = l.lastElementChild;
      a && (o = a);
    }
  }
  return o && (!I(o) || !y(o)) ? W(o) : o;
}, oe = (t) => {
  const e = t.target;
  return Q(e);
}, Q = (t) => {
  var e;
  let n;
  if (t.previousElementSibling)
    n = t.previousElementSibling;
  else {
    const o = (e = t.parentElement) == null ? void 0 : e.previousElementSibling;
    n = o == null ? void 0 : o.lastElementChild;
  }
  return n && (!I(n) || !y(n)) ? Q(n) : n;
}, le = (t) => {
  const e = t.target;
  return F(e);
}, F = (t) => {
  var e;
  let n;
  if (t.nextElementSibling)
    n = t.nextElementSibling;
  else {
    const o = (e = t.parentElement) == null ? void 0 : e.nextElementSibling;
    n = o == null ? void 0 : o.firstElementChild;
  }
  return n && (!I(n) || !y(n)) ? F(n) : n;
}, ae = (t) => {
  const e = t.target.parentElement.firstElementChild;
  return e && (!I(e) || !y(e)) ? F(e) : e;
}, re = (t) => {
  const e = t.target.parentElement.lastElementChild;
  return e && (!I(e) || !y(e)) ? Q(e) : e;
}, D = ["alt", "control", "shift", "meta"], Ve = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, we = {
  "keydown.up": (t) => {
    const e = te(t);
    e && (t.preventDefault(), t.stopPropagation(), e.focus());
  },
  "keydown.down": (t) => {
    const e = ne(t);
    e && (t.preventDefault(), t.stopPropagation(), e.focus());
  },
  "keydown.left": (t) => {
    const e = oe(t);
    t.preventDefault(), t.stopPropagation(), e && e.focus();
  },
  "keydown.right": (t) => {
    const e = le(t);
    t.preventDefault(), t.stopPropagation(), e && e.focus();
  },
  "keydown.control.up": (t) => {
    const e = Ue(t);
    e && (t.preventDefault(), t.stopPropagation(), e.focus());
  },
  "keydown.control.down": (t) => {
    const e = je(t);
    e && (t.preventDefault(), t.stopPropagation(), e.focus());
  },
  "keydown.control.left": (t) => {
    const e = ae(t);
    e && (t.preventDefault(), t.stopPropagation(), e.focus());
  },
  "keydown.control.right": (t) => {
    const e = re(t);
    e && (t.preventDefault(), t.stopPropagation(), e.focus());
  },
  "keydown.end": (t) => {
    const e = re(t);
    e && (t.preventDefault(), t.stopPropagation(), e.focus());
  },
  "keydown.enter": (t) => {
    if (t.target instanceof HTMLTableCellElement) {
      t.preventDefault(), t.stopPropagation();
      const e = ne(t);
      e && e.focus();
    }
  },
  "keydown.shift.enter": (t) => {
    if (t.target instanceof HTMLTableCellElement) {
      t.preventDefault(), t.stopPropagation();
      const e = te(t);
      e && e.focus();
    }
  },
  "keydown.home": (t) => {
    const e = ae(t);
    e && (t.preventDefault(), t.stopPropagation(), e.focus());
  },
  "keydown.tab": (t) => {
    const e = le(t);
    e && (t.preventDefault(), t.stopPropagation(), e.focus());
  },
  "keydown.shift.tab": (t) => {
    const e = oe(t);
    e && (t.preventDefault(), t.stopPropagation(), e.focus());
  }
};
function q(t) {
  const e = (o) => {
    let l = null;
    o.parent && (typeof o.parent == "string" ? l = document.querySelector(o.parent) : o.parent instanceof Element ? l = o.parent : l = o.parent.value);
    let a = [];
    if (o.selectors)
      if (typeof o.selectors == "string")
        a = l ? Array.from(l.querySelectorAll(o.selectors)) : Array.from(document.querySelectorAll(o.selectors));
      else if (o.selectors instanceof Element)
        a.push(o.selectors);
      else if (Array.isArray(o.selectors.value))
        for (const r of o.selectors.value)
          r instanceof Element ? a.push(r) : a.push(r.$el);
      else
        a.push(o.selectors.value);
    else
      a = Array.from(l.children).filter((r) => I(r) && y(r));
    return a;
  }, n = (o) => (l) => {
    const a = Ve[l.key] || l.key.toLowerCase();
    if (D.includes(a))
      return;
    const r = o.handlers || we;
    for (const i of Object.keys(r)) {
      const [c, ...u] = i.split(".");
      if (c === "keydown" && u.includes(a)) {
        const d = r[i], h = u.filter((m) => D.includes(m)), v = D.some((m) => {
          const _ = m.charAt(0).toUpperCase() + m.slice(1);
          return l.getModifierState(_);
        });
        if (h.length > 0) {
          if (v) {
            for (const m of D)
              if (u.includes(m)) {
                const _ = m.charAt(0).toUpperCase() + m.slice(1);
                l.getModifierState(_) && d(l);
              }
          }
        } else
          v || d(l);
      }
    }
  };
  ye(() => {
    for (const o of t) {
      const l = e(o);
      for (const a of l)
        a.addEventListener("keydown", n(o));
    }
  }), Ie(() => {
    for (const o of t) {
      const l = e(o);
      for (const a of l)
        a.removeEventListener("keydown", n(o));
    }
  });
}
const We = ["data-colindex", "data-rowindex", "data-editable", "contenteditable", "tabindex"], Be = { key: 1 }, Qe = /* @__PURE__ */ k({
  __name: "ACell",
  props: {
    colIndex: null,
    rowIndex: null,
    tableid: null,
    addNavigation: { type: [Boolean, Object], default: !0 },
    tabIndex: { default: 0 },
    clickHandler: null
  },
  setup(t) {
    var _;
    const e = t, n = O(e.tableid), o = E(null);
    let l = E(!1);
    const a = S(() => {
      const b = n.cellData(e.colIndex, e.rowIndex);
      if (n.columns[e.colIndex].format) {
        const g = n.columns[e.colIndex].format;
        return typeof g == "function" ? g(b) : typeof g == "string" ? Function(`"use strict";return (${g})`)()(b) : b;
      } else
        return b;
    }), r = (b) => {
      if (e.clickHandler) {
        e.clickHandler(b);
        return;
      }
      if (n.columns[e.colIndex].mask, n.columns[e.colIndex].modalComponent) {
        const g = o.value.getBoundingClientRect();
        n.modal.visible = !0, n.modal.colIndex = e.colIndex, n.modal.rowIndex = e.rowIndex, n.modal.parent = o.value, n.modal.top = g.top + g.height, n.modal.left = g.left, n.modal.width = c.value, n.modal.component = n.columns[e.colIndex].modalComponent, n.modal.componentProps = n.columns[e.colIndex].modalComponentProps;
      }
    };
    if (e.addNavigation) {
      let b = {
        ...we,
        "keydown.f2": r,
        "keydown.alt.up": r,
        "keydown.alt.down": r,
        "keydown.alt.left": r,
        "keydown.alt.right": r
      };
      typeof e.addNavigation == "object" && (b = {
        ...b,
        ...e.addNavigation
      }), q([
        {
          selectors: o,
          handlers: b
        }
      ]);
    }
    const i = S(() => n.columns[e.colIndex].align || "center"), c = S(() => n.columns[e.colIndex].width || "40ch");
    let u = "";
    const d = () => {
      o.value && (u = o.value.innerText);
    }, h = () => {
      o.value && o.value.innerHTML !== u && (u = o.value.innerText, o.value.dispatchEvent(new Event("change")), l.value = !0, n.columns[e.colIndex].format || n.setCellData(e.rowIndex, e.colIndex, u));
    }, v = (b, g) => g && b === 0 && g > 0 ? `${g}ch` : "inherit", m = {
      textAlign: i.value,
      width: c.value,
      backgroundColor: l.value ? "var(--cell-modified-color)" : "inherit",
      fontWeight: l.value ? "bold" : "inherit",
      paddingLeft: v(e.colIndex, (_ = n.display[e.rowIndex]) == null ? void 0 : _.indent)
    };
    return (b, g) => (p(), w("td", {
      ref_key: "cell",
      ref: o,
      "data-colindex": t.colIndex,
      "data-rowindex": t.rowIndex,
      "data-editable": s(n).columns[t.colIndex].edit,
      contenteditable: s(n).columns[t.colIndex].edit,
      tabindex: t.tabIndex,
      spellcheck: !1,
      style: m,
      onFocus: d,
      onPaste: h,
      onBlur: h,
      onInput: h,
      onClick: r,
      onMousedown: r
    }, [
      s(n).columns[t.colIndex].cellComponent ? (p(), P(ie(s(n).columns[t.colIndex].cellComponent), V({
        key: 0,
        value: s(a)
      }, s(n).columns[t.colIndex].cellComponentProps), null, 16, ["value"])) : (p(), w("span", Be, $(s(a)), 1))
    ], 40, We));
  }
});
const C = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [o, l] of e)
    n[o] = l;
  return n;
}, he = /* @__PURE__ */ C(Qe, [["__scopeId", "data-v-1738c6fc"]]), Fe = ["tabindex"], qe = ["tabindex"], ze = ["colspan"], Ge = /* @__PURE__ */ k({
  __name: "AExpansionRow",
  props: {
    row: null,
    rowIndex: null,
    tableid: null,
    tabIndex: { default: -1 },
    addNavigation: null
  },
  setup(t) {
    const e = t, n = O(e.tableid), o = E(null), l = E(null), a = () => n.display[e.rowIndex].expanded ? "▼" : "►";
    if (e.addNavigation !== void 0) {
      const r = Object.assign({}, e.addNavigation);
      r["keydown.control.g"] = (i) => {
        i.stopPropagation(), i.preventDefault(), n.toggleRowExpand(e.rowIndex);
      }, q([
        {
          selectors: o,
          handlers: r
        }
      ]);
    }
    return (r, i) => (p(), w(L, null, [
      T("tr", V(r.$attrs, {
        ref_key: "rowEl",
        ref: o,
        tabindex: t.tabIndex,
        class: "expandable-row"
      }), [
        T("td", {
          tabIndex: -1,
          onClick: i[0] || (i[0] = (c) => s(n).toggleRowExpand(t.rowIndex)),
          class: "row-index"
        }, $(a()), 1),
        x(r.$slots, "row", {}, void 0, !0)
      ], 16, Fe),
      s(n).display[e.rowIndex].expanded ? (p(), w("tr", {
        key: 0,
        ref_key: "rowExpanded",
        ref: l,
        tabindex: t.tabIndex,
        class: "expanded-row"
      }, [
        T("td", {
          tabIndex: -1,
          colspan: s(n).columns.length + 1,
          class: "expanded-row-content"
        }, [
          x(r.$slots, "content", {}, void 0, !0)
        ], 8, ze)
      ], 8, qe)) : M("", !0)
    ], 64));
  }
});
const Je = /* @__PURE__ */ C(Ge, [["__scopeId", "data-v-2bb821ae"]]), Xe = ["tabindex"], Ye = {
  key: 0,
  tabIndex: -1,
  class: "list-index"
}, Ze = /* @__PURE__ */ k({
  __name: "ARow",
  props: {
    row: null,
    rowIndex: null,
    tableid: null,
    tabIndex: { default: -1 },
    addNavigation: null
  },
  setup(t) {
    const e = t;
    de((c) => ({
      "6b10edcf": s(l)
    }));
    const n = O(e.tableid), o = E(null), l = n.numberedRowWidth.value, a = () => n.config.view !== "tree" ? "" : n.display[e.rowIndex].isRoot || n.display[e.rowIndex].isParent ? n.display[e.rowIndex].childrenOpen ? "-" : "+" : "", r = () => n.config.view !== "tree" || n.display[e.rowIndex].isRoot || n.display[e.rowIndex].open, i = (c) => {
      n.toggleRowExpand(c);
    };
    return e.addNavigation && q([
      {
        selectors: o,
        handlers: e.addNavigation
      }
    ]), (c, u) => ce((p(), w("tr", {
      ref_key: "rowEl",
      ref: o,
      tabindex: t.tabIndex,
      class: "table-row"
    }, [
      s(n).config.view === "list" ? (p(), w("td", Ye, $(t.rowIndex + 1), 1)) : s(n).config.view === "tree" ? (p(), w("td", {
        key: 1,
        tabIndex: -1,
        class: "tree-index",
        onClick: u[0] || (u[0] = (d) => i(t.rowIndex))
      }, $(a()), 1)) : x(c.$slots, "indexCell", { key: 2 }, void 0, !0),
      x(c.$slots, "default", {}, void 0, !0)
    ], 8, Xe)), [
      [ue, r()]
    ]);
  }
});
const be = /* @__PURE__ */ C(Ze, [["__scopeId", "data-v-c758303d"]]);
let R;
const Ke = new Uint8Array(16);
function et() {
  if (!R && (R = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !R))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return R(Ke);
}
const f = [];
for (let t = 0; t < 256; ++t)
  f.push((t + 256).toString(16).slice(1));
function tt(t, e = 0) {
  return (f[t[e + 0]] + f[t[e + 1]] + f[t[e + 2]] + f[t[e + 3]] + "-" + f[t[e + 4]] + f[t[e + 5]] + "-" + f[t[e + 6]] + f[t[e + 7]] + "-" + f[t[e + 8]] + f[t[e + 9]] + "-" + f[t[e + 10]] + f[t[e + 11]] + f[t[e + 12]] + f[t[e + 13]] + f[t[e + 14]] + f[t[e + 15]]).toLowerCase();
}
const nt = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), se = {
  randomUUID: nt
};
function ge(t, e, n) {
  if (se.randomUUID && !e && !t)
    return se.randomUUID();
  t = t || {};
  const o = t.random || (t.rng || et)();
  if (o[6] = o[6] & 15 | 64, o[8] = o[8] & 63 | 128, e) {
    n = n || 0;
    for (let l = 0; l < 16; ++l)
      e[n + l] = o[l];
    return e;
  }
  return tt(o);
}
class ot {
  constructor(e, n, o, l, a, r) {
    this.id = e || ge(), this.rows = o, this.columns = A(n), this.config = A(l), this.table = a || A(this.createTableObject()), this.display = this.createDisplayObject(r), this.modal = A({ visible: !1 });
  }
  createTableObject() {
    const e = {};
    for (const [n, o] of this.columns.entries())
      for (const [l, a] of this.rows.entries())
        e[`${n}:${l}`] = a[o.name];
    return e;
  }
  createDisplayObject(e) {
    const n = [Object.assign({}, { modified: !1 })];
    if (e && "0:0" in e)
      return e;
    const o = /* @__PURE__ */ new Set();
    for (let l = this.rows.length - 1; l >= 0; l--) {
      const a = this.rows[l];
      a.parent && o.add(a.parent), n[l] = {
        childrenOpen: !1,
        expanded: !1,
        indent: a.indent || null,
        isParent: o.has(l),
        isRoot: a.parent === null || a.parent === void 0,
        modified: !1,
        open: a.parent === null || a.parent === void 0,
        parent: a.parent
      };
    }
    return A(n);
  }
  get zeroColumn() {
    return ["list", "tree", "list-expansion"].includes(this.config.view);
  }
  get numberedRowWidth() {
    return S(() => String(Math.ceil(this.rows.length / 100) + 1) + "ch");
  }
  cellData(e, n) {
    return this.table[`${e}:${n}`];
  }
  setCellData(e, n, o) {
    this.table[`${n}:${e}`] !== o && (this.display[e].modified = !0), this.table[`${n}:${e}`] = o;
    const l = this.columns[n];
    return this.rows[e][l.name] = o, this.table[`${n}:${e}`];
  }
  toggleRowExpand(e) {
    if (this.config.view === "tree") {
      this.display[e].childrenOpen = !this.display[e].childrenOpen;
      for (let n = this.rows.length - 1; n >= 0; n--)
        this.display[n].parent === e && (this.display[n].open = !this.display[n].open, this.display[n].childrenOpen && this.toggleRowExpand(n));
    } else
      this.config.view === "list-expansion" && (this.display[e].expanded = !this.display[e].expanded);
  }
}
const lt = { key: 0 }, at = {
  class: "atable-header-row",
  tabindex: "-1"
}, rt = {
  key: 0,
  id: "header-index"
}, st = /* @__PURE__ */ k({
  __name: "ATableHeader",
  props: {
    columns: null,
    config: null,
    tableid: null
  },
  setup(t) {
    const e = t;
    de((a) => ({
      "1cb0fcc9": s(o)
    }));
    const n = O(e.tableid), o = n.numberedRowWidth.value, l = (a) => ({
      minWidth: a.width || "40ch",
      textAlign: a.align || "center",
      width: n.config.fullWidth ? "auto" : null
    });
    return (a, r) => t.columns.length ? (p(), w("thead", lt, [
      T("tr", at, [
        s(n).zeroColumn ? (p(), w("th", rt)) : M("", !0),
        (p(!0), w(L, null, N(t.columns, (i, c) => (p(), w("th", {
          key: c,
          tabindex: "-1",
          style: H(l(i))
        }, [
          x(a.$slots, "default", {}, () => [
            ke($(i.label || String.fromCharCode(c + 97).toUpperCase()), 1)
          ], !0)
        ], 4))), 128))
      ])
    ])) : M("", !0);
  }
});
const xe = /* @__PURE__ */ C(st, [["__scopeId", "data-v-8a8d9cee"]]), it = /* @__PURE__ */ k({
  __name: "ATableModal",
  props: {
    colIndex: null,
    rowIndex: null,
    tableid: null
  },
  setup(t) {
    O(t.tableid);
    const n = (o) => {
      o.stopPropagation();
    };
    return (o, l) => (p(), w("div", {
      ref: "amodal",
      class: "amodal",
      tabindex: "-1",
      onClick: n,
      onInput: n
    }, [
      x(o.$slots, "default", {}, void 0, !0)
    ], 544));
  }
});
const ve = /* @__PURE__ */ C(it, [["__scopeId", "data-v-8ac70767"]]), dt = /* @__PURE__ */ k({
  __name: "ATable",
  props: {
    id: null,
    modelValue: null,
    columns: null,
    rows: { default: () => [] },
    config: { default: () => new Object() },
    tableid: null
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const n = t;
    let o = n.modelValue ? n.modelValue : n.rows, l = new ot(n.id, n.columns, o, n.config);
    Ce(l.id, l), j(
      () => l.rows,
      (r, i) => {
        e("update:modelValue", r);
      },
      { deep: !0 }
    );
    const a = (r) => {
      var i;
      (i = l.modal.parent) != null && i.contains(r.target) || l.modal.visible && (l.modal.visible = !1);
    };
    return window.addEventListener("click", a), window.addEventListener("keydown", (r) => {
      if (r.key === "Escape" && l.modal.visible) {
        l.modal.visible = !1;
        const i = l.modal.parent;
        i && Ae().then(() => {
          const c = i.dataset.rowindex, u = i.dataset.colindex, d = document.querySelectorAll(`[data-rowindex='${c}'][data-colindex='${u}']`);
          d && d[0].focus();
        });
      }
    }), (r, i) => (p(), w("table", {
      class: "atable",
      style: H({ width: s(l).config.fullWidth ? "100%" : "auto" })
    }, [
      x(r.$slots, "header", { data: s(l) }, () => [
        z(xe, {
          columns: s(l).columns,
          config: s(l).config,
          tableid: s(l).id
        }, null, 8, ["columns", "config", "tableid"])
      ], !0),
      T("tbody", null, [
        x(r.$slots, "body", { data: s(l) }, () => [
          (p(!0), w(L, null, N(s(l).rows, (c, u) => (p(), P(be, {
            key: c.id || s(ge)(),
            row: c,
            rowIndex: u,
            tableid: s(l).id
          }, {
            default: G(() => [
              (p(!0), w(L, null, N(s(l).columns, (d, h) => (p(), P(he, {
                key: `${h}:${u}`,
                tableid: s(l).id,
                col: d,
                spellcheck: "false",
                rowIndex: u,
                colIndex: h + (s(l).zeroColumn ? 0 : -1),
                component: d.cellComponent,
                style: H({
                  textAlign: (d == null ? void 0 : d.align) || "center",
                  minWidth: (d == null ? void 0 : d.width) || "40ch",
                  width: s(l).config.fullWidth ? "auto" : null
                })
              }, null, 8, ["tableid", "col", "rowIndex", "colIndex", "component", "style"]))), 128))
            ]),
            _: 2
          }, 1032, ["row", "rowIndex", "tableid"]))), 128))
        ], !0)
      ]),
      x(r.$slots, "footer", { data: s(l) }, void 0, !0),
      x(r.$slots, "modal", { data: s(l) }, () => [
        ce(z(ve, {
          colIndex: s(l).modal.colIndex,
          rowIndex: s(l).modal.rowIndex,
          tableid: s(l).id,
          style: H({
            left: s(l).modal.left + "px",
            top: s(l).modal.top + "px",
            maxWidth: s(l).modal.width + "px"
          })
        }, {
          default: G(() => [
            (p(), P(ie(s(l).modal.component), V({
              key: `${s(l).modal.rowIndex}:${s(l).modal.colIndex}`,
              colIndex: s(l).modal.colIndex,
              rowIndex: s(l).modal.rowIndex,
              tableid: s(l).id
            }, s(l).modal.componentProps), null, 16, ["colIndex", "rowIndex", "tableid"]))
          ]),
          _: 1
        }, 8, ["colIndex", "rowIndex", "tableid", "style"]), [
          [ue, s(l).modal.visible]
        ])
      ], !0)
    ], 4));
  }
});
const ct = /* @__PURE__ */ C(dt, [["__scopeId", "data-v-9137b4c3"]]);
function ft(t) {
  t.component("ACell", he), t.component("AExpansionRow", Je), t.component("ARow", be), t.component("ATable", ct), t.component("ATableHeader", xe), t.component("ATableModal", ve);
}
export {
  he as ACell,
  Je as AExpansionRow,
  be as ARow,
  ct as ATable,
  xe as ATableHeader,
  ve as ATableModal,
  ot as TableDataStore,
  ft as install
};
//# sourceMappingURL=atable.js.map
