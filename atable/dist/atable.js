import { onMounted as xe, onBeforeUnmount as Ie, ref as k, watch as j, unref as r, getCurrentScope as Ee, onScopeDispose as ke, defineComponent as C, inject as O, computed as R, openBlock as m, createElementBlock as b, createBlock as P, resolveDynamicComponent as ie, mergeProps as W, toDisplayString as T, Fragment as L, createElementVNode as A, renderSlot as y, createCommentVNode as M, useCssVars as de, withDirectives as ce, vShow as ue, reactive as $, renderList as N, normalizeStyle as H, createTextVNode as Ce, provide as _e, nextTick as $e, createVNode as z, withCtx as G } from "vue";
var J;
const pe = typeof window < "u", Ae = (t) => typeof t == "string", Te = () => {
};
pe && (J = window == null ? void 0 : window.navigator) != null && J.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function fe(t) {
  return typeof t == "function" ? t() : r(t);
}
function Oe(t) {
  return t;
}
function De(t) {
  return Ee() ? (ke(t), !0) : !1;
}
function U(t) {
  var e;
  const n = fe(t);
  return (e = n == null ? void 0 : n.$el) != null ? e : n;
}
const me = pe ? window : void 0;
function Se(...t) {
  let e, n, o, a;
  if (Ae(t[0]) || Array.isArray(t[0]) ? ([n, o, a] = t, e = me) : [e, n, o, a] = t, !e)
    return Te;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const l = [], s = () => {
    l.forEach((f) => f()), l.length = 0;
  }, i = (f, c, v, h) => (f.addEventListener(c, v, h), () => f.removeEventListener(c, v, h)), d = j(() => [U(e), fe(a)], ([f, c]) => {
    s(), f && l.push(...n.flatMap((v) => o.map((h) => i(f, v, h, c))));
  }, { immediate: !0, flush: "post" }), p = () => {
    d(), s();
  };
  return De(p), p;
}
const X = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Y = "__vueuse_ssr_handlers__";
X[Y] = X[Y] || {};
function Re(t, { window: e = me, scrollTarget: n } = {}) {
  const o = k(!1), a = () => {
    if (!e)
      return;
    const l = e.document, s = U(t);
    if (!s)
      o.value = !1;
    else {
      const i = s.getBoundingClientRect();
      o.value = i.top <= (e.innerHeight || l.documentElement.clientHeight) && i.left <= (e.innerWidth || l.documentElement.clientWidth) && i.bottom >= 0 && i.right >= 0;
    }
  };
  return j(() => U(t), () => a(), { immediate: !0, flush: "post" }), e && Se(n || e, "scroll", a, {
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
const x = (t) => {
  let e = Re(t).value;
  return e = e && t.offsetHeight > 0, e;
}, I = (t) => t.tabIndex >= 0, te = (t) => {
  const e = t.target;
  return V(e);
}, V = (t) => {
  var e;
  let n;
  if (t instanceof HTMLTableCellElement) {
    const o = (e = t.parentElement) == null ? void 0 : e.previousElementSibling;
    if (o) {
      const a = Array.from(o.children)[t.cellIndex];
      a && (n = a);
    }
  } else if (t instanceof HTMLTableRowElement) {
    const o = t.previousElementSibling;
    o && (n = o);
  }
  return n && (!I(n) || !x(n)) ? V(n) : n;
}, Ue = (t) => {
  var e;
  const n = t.target;
  let o;
  if (n instanceof HTMLTableCellElement) {
    const a = (e = n.parentElement) == null ? void 0 : e.parentElement;
    if (a) {
      const l = a.firstElementChild.children[n.cellIndex];
      l && (o = l);
    }
  } else if (n instanceof HTMLTableRowElement) {
    const a = n.parentElement;
    if (a) {
      const l = a.firstElementChild;
      l && (o = l);
    }
  }
  return o && (!I(o) || !x(o)) ? B(o) : o;
}, ne = (t) => {
  const e = t.target;
  return B(e);
}, B = (t) => {
  var e;
  let n;
  if (t instanceof HTMLTableCellElement) {
    const o = (e = t.parentElement) == null ? void 0 : e.nextElementSibling;
    if (o) {
      const a = Array.from(o.children)[t.cellIndex];
      a && (n = a);
    }
  } else if (t instanceof HTMLTableRowElement) {
    const o = t.nextElementSibling;
    o && (n = o);
  }
  return n && (!I(n) || !x(n)) ? B(n) : n;
}, je = (t) => {
  var e;
  const n = t.target;
  let o;
  if (n instanceof HTMLTableCellElement) {
    const a = (e = n.parentElement) == null ? void 0 : e.parentElement;
    if (a) {
      const l = a.lastElementChild.children[n.cellIndex];
      l && (o = l);
    }
  } else if (n instanceof HTMLTableRowElement) {
    const a = n.parentElement;
    if (a) {
      const l = a.lastElementChild;
      l && (o = l);
    }
  }
  return o && (!I(o) || !x(o)) ? V(o) : o;
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
  return n && (!I(n) || !x(n)) ? Q(n) : n;
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
  return n && (!I(n) || !x(n)) ? F(n) : n;
}, ae = (t) => {
  const e = t.target.parentElement.firstElementChild;
  return e && (!I(e) || !x(e)) ? F(e) : e;
}, re = (t) => {
  const e = t.target.parentElement.lastElementChild;
  return e && (!I(e) || !x(e)) ? Q(e) : e;
}, D = ["alt", "control", "shift", "meta"], We = {
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
    let a = null;
    o.parent && (typeof o.parent == "string" ? a = document.querySelector(o.parent) : o.parent instanceof Element ? a = o.parent : a = o.parent.value);
    let l = [];
    if (o.selectors)
      if (typeof o.selectors == "string")
        l = a ? Array.from(a.querySelectorAll(o.selectors)) : Array.from(document.querySelectorAll(o.selectors));
      else if (o.selectors instanceof Element)
        l.push(o.selectors);
      else if (Array.isArray(o.selectors.value))
        for (const s of o.selectors.value)
          s instanceof Element ? l.push(s) : l.push(s.$el);
      else
        l.push(o.selectors.value);
    else
      l = Array.from(a.children).filter((s) => I(s) && x(s));
    return l;
  }, n = (o) => (a) => {
    const l = We[a.key] || a.key.toLowerCase();
    if (D.includes(l))
      return;
    const s = o.handlers || we;
    for (const i of Object.keys(s)) {
      const [d, ...p] = i.split(".");
      if (d === "keydown" && p.includes(l)) {
        const f = s[i], c = p.filter((h) => D.includes(h)), v = D.some((h) => {
          const E = h.charAt(0).toUpperCase() + h.slice(1);
          return a.getModifierState(E);
        });
        if (c.length > 0) {
          if (v) {
            for (const h of D)
              if (p.includes(h)) {
                const E = h.charAt(0).toUpperCase() + h.slice(1);
                a.getModifierState(E) && f(a);
              }
          }
        } else
          v || f(a);
      }
    }
  };
  xe(() => {
    for (const o of t) {
      const a = e(o);
      for (const l of a)
        l.addEventListener("keydown", n(o));
    }
  }), Ie(() => {
    for (const o of t) {
      const a = e(o);
      for (const l of a)
        l.removeEventListener("keydown", n(o));
    }
  });
}
const Ve = ["data-colindex", "data-rowindex", "data-editable", "contenteditable", "tabindex"], Be = { key: 1 }, Qe = /* @__PURE__ */ C({
  __name: "ACell",
  props: {
    colIndex: {},
    rowIndex: {},
    tableid: {},
    addNavigation: { type: [Boolean, Object], default: !0 },
    tabIndex: { default: 0 },
    clickHandler: {}
  },
  setup(t) {
    var E;
    const e = t, n = O(e.tableid), o = k(null);
    let a = k(!1);
    const l = R(() => {
      const u = n.cellData(e.colIndex, e.rowIndex);
      if (n.columns[e.colIndex].format) {
        const g = n.columns[e.colIndex].format;
        return typeof g == "function" ? g(u) : typeof g == "string" ? Function(`"use strict";return (${g})`)()(u) : u;
      } else
        return u;
    }), s = (u) => {
      if (e.clickHandler) {
        e.clickHandler(u);
        return;
      }
      if (n.columns[e.colIndex].mask, n.columns[e.colIndex].modalComponent) {
        const g = o.value.getBoundingClientRect();
        n.modal.visible = !0, n.modal.colIndex = e.colIndex, n.modal.rowIndex = e.rowIndex, n.modal.parent = o.value, n.modal.top = g.top + g.height, n.modal.left = g.left, n.modal.width = d.value, n.modal.component = n.columns[e.colIndex].modalComponent, n.modal.componentProps = n.columns[e.colIndex].modalComponentProps;
      }
    };
    if (e.addNavigation) {
      let u = {
        ...we,
        "keydown.f2": s,
        "keydown.alt.up": s,
        "keydown.alt.down": s,
        "keydown.alt.left": s,
        "keydown.alt.right": s
      };
      typeof e.addNavigation == "object" && (u = {
        ...u,
        ...e.addNavigation
      }), q([
        {
          selectors: o,
          handlers: u
        }
      ]);
    }
    const i = R(() => n.columns[e.colIndex].align || "center"), d = R(() => n.columns[e.colIndex].width || "40ch");
    let p = "";
    const f = () => {
      o.value && (p = o.value.innerText);
    }, c = () => {
      o.value && o.value.innerHTML !== p && (p = o.value.innerText, o.value.dispatchEvent(new Event("change")), a.value = !0, n.columns[e.colIndex].format || n.setCellData(e.rowIndex, e.colIndex, p));
    }, v = (u, g) => g && u === 0 && g > 0 ? `${g}ch` : "inherit", h = {
      textAlign: i.value,
      width: d.value,
      backgroundColor: a.value ? "var(--cell-modified-color)" : "inherit",
      fontWeight: a.value ? "bold" : "inherit",
      paddingLeft: v(e.colIndex, (E = n.display[e.rowIndex]) == null ? void 0 : E.indent)
    };
    return (u, g) => (m(), b("td", {
      ref_key: "cell",
      ref: o,
      "data-colindex": u.colIndex,
      "data-rowindex": u.rowIndex,
      "data-editable": r(n).columns[u.colIndex].edit,
      contenteditable: r(n).columns[u.colIndex].edit,
      tabindex: u.tabIndex,
      spellcheck: !1,
      style: h,
      onFocus: f,
      onPaste: c,
      onBlur: c,
      onInput: c,
      onClick: s,
      onMousedown: s
    }, [
      r(n).columns[u.colIndex].cellComponent ? (m(), P(ie(r(n).columns[u.colIndex].cellComponent), W({
        key: 0,
        value: l.value
      }, r(n).columns[u.colIndex].cellComponentProps), null, 16, ["value"])) : (m(), b("span", Be, T(l.value), 1))
    ], 40, Ve));
  }
}), _ = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [o, a] of e)
    n[o] = a;
  return n;
}, he = /* @__PURE__ */ _(Qe, [["__scopeId", "data-v-07dfe445"]]), Fe = ["tabindex"], qe = ["tabindex"], ze = ["colspan"], Ge = /* @__PURE__ */ C({
  __name: "AExpansionRow",
  props: {
    row: {},
    rowIndex: {},
    tableid: {},
    tabIndex: { default: -1 },
    addNavigation: {}
  },
  setup(t) {
    const e = t, n = O(e.tableid), o = k(null), a = k(null), l = () => n.display[e.rowIndex].expanded ? "▼" : "►";
    if (e.addNavigation !== void 0) {
      const s = Object.assign({}, e.addNavigation);
      s["keydown.control.g"] = (i) => {
        i.stopPropagation(), i.preventDefault(), n.toggleRowExpand(e.rowIndex);
      }, q([
        {
          selectors: o,
          handlers: s
        }
      ]);
    }
    return (s, i) => (m(), b(L, null, [
      A("tr", W(s.$attrs, {
        ref_key: "rowEl",
        ref: o,
        tabindex: s.tabIndex,
        class: "expandable-row"
      }), [
        A("td", {
          tabIndex: -1,
          onClick: i[0] || (i[0] = (d) => r(n).toggleRowExpand(s.rowIndex)),
          class: "row-index"
        }, T(l()), 1),
        y(s.$slots, "row", {}, void 0, !0)
      ], 16, Fe),
      r(n).display[e.rowIndex].expanded ? (m(), b("tr", {
        key: 0,
        ref_key: "rowExpanded",
        ref: a,
        tabindex: s.tabIndex,
        class: "expanded-row"
      }, [
        A("td", {
          tabIndex: -1,
          colspan: r(n).columns.length + 1,
          class: "expanded-row-content"
        }, [
          y(s.$slots, "content", {}, void 0, !0)
        ], 8, ze)
      ], 8, qe)) : M("", !0)
    ], 64));
  }
}), Je = /* @__PURE__ */ _(Ge, [["__scopeId", "data-v-b2e2ed2d"]]), Xe = ["tabindex"], Ye = {
  key: 0,
  tabIndex: -1,
  class: "list-index"
}, Ze = /* @__PURE__ */ C({
  __name: "ARow",
  props: {
    row: {},
    rowIndex: {},
    tableid: {},
    tabIndex: { default: -1 },
    addNavigation: {}
  },
  setup(t) {
    de((d) => ({
      "5b18ee03": r(a)
    }));
    const e = t, n = O(e.tableid), o = k(null), a = n.numberedRowWidth.value, l = () => n.config.view !== "tree" ? "" : n.display[e.rowIndex].isRoot || n.display[e.rowIndex].isParent ? n.display[e.rowIndex].childrenOpen ? "-" : "+" : "", s = () => n.config.view !== "tree" || n.display[e.rowIndex].isRoot || n.display[e.rowIndex].open, i = (d) => {
      n.toggleRowExpand(d);
    };
    return e.addNavigation && q([
      {
        selectors: o,
        handlers: e.addNavigation
      }
    ]), (d, p) => ce((m(), b("tr", {
      ref_key: "rowEl",
      ref: o,
      tabindex: d.tabIndex,
      class: "table-row"
    }, [
      r(n).config.view === "list" ? (m(), b("td", Ye, T(d.rowIndex + 1), 1)) : r(n).config.view === "tree" ? (m(), b("td", {
        key: 1,
        tabIndex: -1,
        class: "tree-index",
        onClick: p[0] || (p[0] = (f) => i(d.rowIndex))
      }, T(l()), 1)) : y(d.$slots, "indexCell", { key: 2 }, void 0, !0),
      y(d.$slots, "default", {}, void 0, !0)
    ], 8, Xe)), [
      [ue, s()]
    ]);
  }
}), be = /* @__PURE__ */ _(Ze, [["__scopeId", "data-v-4c71a067"]]);
let S;
const Ke = new Uint8Array(16);
function et() {
  if (!S && (S = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !S))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return S(Ke);
}
const w = [];
for (let t = 0; t < 256; ++t)
  w.push((t + 256).toString(16).slice(1));
function tt(t, e = 0) {
  return w[t[e + 0]] + w[t[e + 1]] + w[t[e + 2]] + w[t[e + 3]] + "-" + w[t[e + 4]] + w[t[e + 5]] + "-" + w[t[e + 6]] + w[t[e + 7]] + "-" + w[t[e + 8]] + w[t[e + 9]] + "-" + w[t[e + 10]] + w[t[e + 11]] + w[t[e + 12]] + w[t[e + 13]] + w[t[e + 14]] + w[t[e + 15]];
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
    for (let a = 0; a < 16; ++a)
      e[n + a] = o[a];
    return e;
  }
  return tt(o);
}
class ot {
  constructor(e, n, o, a, l, s) {
    this.id = e || ge(), this.rows = o, this.columns = $(n), this.config = $(a), this.table = l || $(this.createTableObject()), this.display = this.createDisplayObject(s), this.modal = $({ visible: !1 });
  }
  createTableObject() {
    const e = {};
    for (const [n, o] of this.columns.entries())
      for (const [a, l] of this.rows.entries())
        e[`${n}:${a}`] = l[o.name];
    return e;
  }
  createDisplayObject(e) {
    const n = [Object.assign({}, { modified: !1 })];
    if (e && "0:0" in e)
      return e;
    const o = /* @__PURE__ */ new Set();
    for (let a = this.rows.length - 1; a >= 0; a--) {
      const l = this.rows[a];
      l.parent && o.add(l.parent), n[a] = {
        childrenOpen: !1,
        expanded: !1,
        indent: l.indent || null,
        isParent: o.has(a),
        isRoot: l.parent === null || l.parent === void 0,
        modified: !1,
        open: l.parent === null || l.parent === void 0,
        parent: l.parent
      };
    }
    return $(n);
  }
  get zeroColumn() {
    return ["list", "tree", "list-expansion"].includes(this.config.view);
  }
  get numberedRowWidth() {
    return R(() => String(Math.ceil(this.rows.length / 100) + 1) + "ch");
  }
  cellData(e, n) {
    return this.table[`${e}:${n}`];
  }
  setCellData(e, n, o) {
    this.table[`${n}:${e}`] !== o && (this.display[e].modified = !0), this.table[`${n}:${e}`] = o;
    const a = this.columns[n];
    return this.rows[e][a.name] = o, this.table[`${n}:${e}`];
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
}, st = /* @__PURE__ */ C({
  __name: "ATableHeader",
  props: {
    columns: {},
    config: {},
    tableid: {}
  },
  setup(t) {
    de((l) => ({
      "12d06943": r(o)
    }));
    const n = O(t.tableid), o = n.numberedRowWidth.value, a = (l) => ({
      minWidth: l.width || "40ch",
      textAlign: l.align || "center",
      width: n.config.fullWidth ? "auto" : null
    });
    return (l, s) => l.columns.length ? (m(), b("thead", lt, [
      A("tr", at, [
        r(n).zeroColumn ? (m(), b("th", rt)) : M("", !0),
        (m(!0), b(L, null, N(l.columns, (i, d) => (m(), b("th", {
          key: d,
          tabindex: "-1",
          style: H(a(i))
        }, [
          y(l.$slots, "default", {}, () => [
            Ce(T(i.label || String.fromCharCode(d + 97).toUpperCase()), 1)
          ], !0)
        ], 4))), 128))
      ])
    ])) : M("", !0);
  }
}), ve = /* @__PURE__ */ _(st, [["__scopeId", "data-v-16e66636"]]), it = /* @__PURE__ */ C({
  __name: "ATableModal",
  props: {
    colIndex: {},
    rowIndex: {},
    tableid: {}
  },
  setup(t) {
    O(t.tableid);
    const n = (o) => {
      o.stopPropagation();
    };
    return (o, a) => (m(), b("div", {
      ref: "amodal",
      class: "amodal",
      tabindex: "-1",
      onClick: n,
      onInput: n
    }, [
      y(o.$slots, "default", {}, void 0, !0)
    ], 544));
  }
}), ye = /* @__PURE__ */ _(it, [["__scopeId", "data-v-10a48b2a"]]), dt = /* @__PURE__ */ C({
  __name: "ATable",
  props: {
    id: {},
    modelValue: {},
    columns: {},
    rows: { default: () => [] },
    config: { default: () => new Object() },
    tableid: {}
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const n = t, o = e;
    let a = n.modelValue ? n.modelValue : n.rows, l = new ot(n.id, n.columns, a, n.config);
    _e(l.id, l), j(
      () => l.rows,
      (i) => {
        o("update:modelValue", i);
      },
      { deep: !0 }
    );
    const s = (i) => {
      var d;
      (d = l.modal.parent) != null && d.contains(i.target) || l.modal.visible && (l.modal.visible = !1);
    };
    return window.addEventListener("click", s), window.addEventListener("keydown", (i) => {
      if (i.key === "Escape" && l.modal.visible) {
        l.modal.visible = !1;
        const d = l.modal.parent;
        d && $e().then(() => {
          const p = d.dataset.rowindex, f = d.dataset.colindex, c = document.querySelectorAll(`[data-rowindex='${p}'][data-colindex='${f}']`);
          c && c[0].focus();
        });
      }
    }), (i, d) => (m(), b("table", {
      class: "atable",
      style: H({ width: r(l).config.fullWidth ? "100%" : "auto" })
    }, [
      y(i.$slots, "header", { data: r(l) }, () => [
        z(ve, {
          columns: r(l).columns,
          config: r(l).config,
          tableid: r(l).id
        }, null, 8, ["columns", "config", "tableid"])
      ], !0),
      A("tbody", null, [
        y(i.$slots, "body", { data: r(l) }, () => [
          (m(!0), b(L, null, N(r(l).rows, (p, f) => (m(), P(be, {
            key: p.id || r(ge)(),
            row: p,
            rowIndex: f,
            tableid: r(l).id
          }, {
            default: G(() => [
              (m(!0), b(L, null, N(r(l).columns, (c, v) => (m(), P(he, {
                key: `${v}:${f}`,
                tableid: r(l).id,
                col: c,
                spellcheck: "false",
                rowIndex: f,
                colIndex: v + (r(l).zeroColumn ? 0 : -1),
                component: c.cellComponent,
                style: H({
                  textAlign: (c == null ? void 0 : c.align) || "center",
                  minWidth: (c == null ? void 0 : c.width) || "40ch",
                  width: r(l).config.fullWidth ? "auto" : null
                })
              }, null, 8, ["tableid", "col", "rowIndex", "colIndex", "component", "style"]))), 128))
            ]),
            _: 2
          }, 1032, ["row", "rowIndex", "tableid"]))), 128))
        ], !0)
      ]),
      y(i.$slots, "footer", { data: r(l) }, void 0, !0),
      y(i.$slots, "modal", { data: r(l) }, () => [
        ce(z(ye, {
          colIndex: r(l).modal.colIndex,
          rowIndex: r(l).modal.rowIndex,
          tableid: r(l).id,
          style: H({
            left: r(l).modal.left + "px",
            top: r(l).modal.top + "px",
            maxWidth: r(l).modal.width + "px"
          })
        }, {
          default: G(() => [
            (m(), P(ie(r(l).modal.component), W({
              key: `${r(l).modal.rowIndex}:${r(l).modal.colIndex}`,
              colIndex: r(l).modal.colIndex,
              rowIndex: r(l).modal.rowIndex,
              tableid: r(l).id
            }, r(l).modal.componentProps), null, 16, ["colIndex", "rowIndex", "tableid"]))
          ]),
          _: 1
        }, 8, ["colIndex", "rowIndex", "tableid", "style"]), [
          [ue, r(l).modal.visible]
        ])
      ], !0)
    ], 4));
  }
}), ct = /* @__PURE__ */ _(dt, [["__scopeId", "data-v-55d8ba05"]]);
function ft(t) {
  t.component("ACell", he), t.component("AExpansionRow", Je), t.component("ARow", be), t.component("ATable", ct), t.component("ATableHeader", ve), t.component("ATableModal", ye);
}
export {
  he as ACell,
  Je as AExpansionRow,
  be as ARow,
  ct as ATable,
  ve as ATableHeader,
  ye as ATableModal,
  ot as TableDataStore,
  ft as install
};
//# sourceMappingURL=atable.js.map
