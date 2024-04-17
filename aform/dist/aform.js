import { defineComponent as D, computed as S, openBlock as f, createElementBlock as v, createElementVNode as i, withDirectives as C, vModelCheckbox as ge, toDisplayString as k, vShow as $, resolveComponent as ye, createBlock as H, withCtx as be, onMounted as se, onBeforeUnmount as we, ref as y, watch as F, unref as O, getCurrentScope as Ce, onScopeDispose as ke, inject as ae, nextTick as De, Fragment as V, renderList as x, normalizeStyle as Ee, withModifiers as Ae, normalizeClass as B, createCommentVNode as re, withKeys as P, vModelText as R, resolveDynamicComponent as Ie, mergeProps as Me, createTextVNode as Te, renderSlot as _e, createVNode as Se, resolveDirective as Oe } from "vue";
const $e = { id: "checkbox-container" }, Le = ["id", "readonly", "required"], Ve = { id: "custom-checkbox" }, xe = ["for"], Be = ["innerHTML"], Pe = /* @__PURE__ */ D({
  __name: "ACheckbox",
  props: {
    label: {},
    value: {},
    required: { type: Boolean },
    readOnly: { type: Boolean },
    uuid: {},
    validation: { default: () => ({ errorMessage: "&nbsp;" }) }
  },
  emits: ["update:value"],
  setup(e, { emit: t }) {
    const o = e, n = t, s = S({
      get() {
        return o.value;
      },
      set(l) {
        n("update:value", l);
      }
    });
    return (l, a) => (f(), v("div", null, [
      i("label", $e, [
        C(i("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value = r),
          type: "checkbox",
          id: l.uuid,
          class: "checkbox",
          readonly: l.readOnly,
          required: l.required
        }, null, 8, Le), [
          [ge, s.value]
        ]),
        i("span", Ve, k(s.value), 1)
      ]),
      i("label", {
        for: l.uuid,
        id: "checkbox-label"
      }, k(l.label), 9, xe),
      C(i("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, Be), [
        [$, l.validation.errorMessage]
      ])
    ]));
  }
}), M = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [n, s] of t)
    o[n] = s;
  return o;
}, qe = /* @__PURE__ */ M(Pe, [["__scopeId", "data-v-743cd4db"]]), He = /* @__PURE__ */ i("div", null, [
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" })
], -1), Fe = /* @__PURE__ */ D({
  __name: "AComboBox",
  props: ["event", "cellData", "tableID"],
  setup(e) {
    return (t, o) => {
      const n = ye("ATableModal");
      return f(), H(n, {
        event: e.event,
        cellData: e.cellData,
        class: "amodal"
      }, {
        default: be(() => [
          He
        ]),
        _: 1
      }, 8, ["event", "cellData"]);
    };
  }
});
var W;
const ie = typeof window < "u", Re = (e) => typeof e == "string", Ue = () => {
};
ie && (W = window == null ? void 0 : window.navigator) != null && W.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function ue(e) {
  return typeof e == "function" ? e() : O(e);
}
function Qe(e) {
  return e;
}
function Ye(e) {
  return Ce() ? (ke(e), !0) : !1;
}
function q(e) {
  var t;
  const o = ue(e);
  return (t = o == null ? void 0 : o.$el) != null ? t : o;
}
const ce = ie ? window : void 0;
function je(...e) {
  let t, o, n, s;
  if (Re(e[0]) || Array.isArray(e[0]) ? ([o, n, s] = e, t = ce) : [t, o, n, s] = e, !t)
    return Ue;
  Array.isArray(o) || (o = [o]), Array.isArray(n) || (n = [n]);
  const l = [], a = () => {
    l.forEach((c) => c()), l.length = 0;
  }, r = (c, g, b, m) => (c.addEventListener(g, b, m), () => c.removeEventListener(g, b, m)), p = F(() => [q(t), ue(s)], ([c, g]) => {
    a(), c && l.push(...o.flatMap((b) => n.map((m) => r(c, b, m, g))));
  }, { immediate: !0, flush: "post" }), u = () => {
    p(), a();
  };
  return Ye(u), u;
}
const N = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, z = "__vueuse_ssr_handlers__";
N[z] = N[z] || {};
function We(e, { window: t = ce, scrollTarget: o } = {}) {
  const n = y(!1), s = () => {
    if (!t)
      return;
    const l = t.document, a = q(e);
    if (!a)
      n.value = !1;
    else {
      const r = a.getBoundingClientRect();
      n.value = r.top <= (t.innerHeight || l.documentElement.clientHeight) && r.left <= (t.innerWidth || l.documentElement.clientWidth) && r.bottom >= 0 && r.right >= 0;
    }
  };
  return F(() => q(e), () => s(), { immediate: !0, flush: "post" }), t && je(o || t, "scroll", s, {
    capture: !1,
    passive: !0
  }), n;
}
var G;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(G || (G = {}));
var Ne = Object.defineProperty, K = Object.getOwnPropertySymbols, ze = Object.prototype.hasOwnProperty, Ge = Object.prototype.propertyIsEnumerable, J = (e, t, o) => t in e ? Ne(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o, Ke = (e, t) => {
  for (var o in t || (t = {}))
    ze.call(t, o) && J(e, o, t[o]);
  if (K)
    for (var o of K(t))
      Ge.call(t, o) && J(e, o, t[o]);
  return e;
};
const Je = {
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
  linear: Qe
}, Je);
const E = (e) => {
  let t = We(e).value;
  return t = t && e.offsetHeight > 0, t;
}, A = (e) => e.tabIndex >= 0, X = (e) => {
  const t = e.target;
  return U(t);
}, U = (e) => {
  var t;
  let o;
  if (e instanceof HTMLTableCellElement) {
    const n = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    if (n) {
      const s = Array.from(n.children)[e.cellIndex];
      s && (o = s);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const n = e.previousElementSibling;
    n && (o = n);
  }
  return o && (!A(o) || !E(o)) ? U(o) : o;
}, Xe = (e) => {
  var t;
  const o = e.target;
  let n;
  if (o instanceof HTMLTableCellElement) {
    const s = (t = o.parentElement) == null ? void 0 : t.parentElement;
    if (s) {
      const l = s.firstElementChild.children[o.cellIndex];
      l && (n = l);
    }
  } else if (o instanceof HTMLTableRowElement) {
    const s = o.parentElement;
    if (s) {
      const l = s.firstElementChild;
      l && (n = l);
    }
  }
  return n && (!A(n) || !E(n)) ? Q(n) : n;
}, Z = (e) => {
  const t = e.target;
  return Q(t);
}, Q = (e) => {
  var t;
  let o;
  if (e instanceof HTMLTableCellElement) {
    const n = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    if (n) {
      const s = Array.from(n.children)[e.cellIndex];
      s && (o = s);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const n = e.nextElementSibling;
    n && (o = n);
  }
  return o && (!A(o) || !E(o)) ? Q(o) : o;
}, Ze = (e) => {
  var t;
  const o = e.target;
  let n;
  if (o instanceof HTMLTableCellElement) {
    const s = (t = o.parentElement) == null ? void 0 : t.parentElement;
    if (s) {
      const l = s.lastElementChild.children[o.cellIndex];
      l && (n = l);
    }
  } else if (o instanceof HTMLTableRowElement) {
    const s = o.parentElement;
    if (s) {
      const l = s.lastElementChild;
      l && (n = l);
    }
  }
  return n && (!A(n) || !E(n)) ? U(n) : n;
}, ee = (e) => {
  const t = e.target;
  return Y(t);
}, Y = (e) => {
  var t;
  let o;
  if (e.previousElementSibling)
    o = e.previousElementSibling;
  else {
    const n = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    o = n == null ? void 0 : n.lastElementChild;
  }
  return o && (!A(o) || !E(o)) ? Y(o) : o;
}, te = (e) => {
  const t = e.target;
  return j(t);
}, j = (e) => {
  var t;
  let o;
  if (e.nextElementSibling)
    o = e.nextElementSibling;
  else {
    const n = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    o = n == null ? void 0 : n.firstElementChild;
  }
  return o && (!A(o) || !E(o)) ? j(o) : o;
}, ne = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!A(t) || !E(t)) ? j(t) : t;
}, oe = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!A(t) || !E(t)) ? Y(t) : t;
}, L = ["alt", "control", "shift", "meta"], et = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, de = {
  "keydown.up": (e) => {
    const t = X(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.down": (e) => {
    const t = Z(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.left": (e) => {
    const t = ee(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.right": (e) => {
    const t = te(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.control.up": (e) => {
    const t = Xe(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = Ze(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.left": (e) => {
    const t = ne(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.right": (e) => {
    const t = oe(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.end": (e) => {
    const t = oe(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = Z(e);
      t && t.focus();
    }
  },
  "keydown.shift.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = X(e);
      t && t.focus();
    }
  },
  "keydown.home": (e) => {
    const t = ne(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.tab": (e) => {
    const t = te(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.shift.tab": (e) => {
    const t = ee(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  }
};
function tt(e) {
  const t = (n) => {
    let s = null;
    n.parent && (typeof n.parent == "string" ? s = document.querySelector(n.parent) : n.parent instanceof Element ? s = n.parent : s = n.parent.value);
    let l = [];
    if (n.selectors)
      if (typeof n.selectors == "string")
        l = s ? Array.from(s.querySelectorAll(n.selectors)) : Array.from(document.querySelectorAll(n.selectors));
      else if (n.selectors instanceof Element)
        l.push(n.selectors);
      else if (Array.isArray(n.selectors.value))
        for (const a of n.selectors.value)
          a instanceof Element ? l.push(a) : l.push(a.$el);
      else
        l.push(n.selectors.value);
    else
      l = Array.from(s.children).filter((a) => A(a) && E(a));
    return l;
  }, o = (n) => (s) => {
    const l = et[s.key] || s.key.toLowerCase();
    if (L.includes(l))
      return;
    const a = n.handlers || de;
    for (const r of Object.keys(a)) {
      const [p, ...u] = r.split(".");
      if (p === "keydown" && u.includes(l)) {
        const c = a[r], g = u.filter((m) => L.includes(m)), b = L.some((m) => {
          const _ = m.charAt(0).toUpperCase() + m.slice(1);
          return s.getModifierState(_);
        });
        if (g.length > 0) {
          if (b) {
            for (const m of L)
              if (u.includes(m)) {
                const _ = m.charAt(0).toUpperCase() + m.slice(1);
                s.getModifierState(_) && c(s);
              }
          }
        } else
          b || c(s);
      }
    }
  };
  se(() => {
    for (const n of e) {
      const s = t(n);
      for (const l of s)
        l.addEventListener("keydown", o(n));
    }
  }), we(() => {
    for (const n of e) {
      const s = t(n);
      for (const l of s)
        l.removeEventListener("keydown", o(n));
    }
  });
}
const nt = ["event", "colIndex", "rowIndex", "tableid"], ot = { colspan: "5" }, lt = ["onClick"], st = 6, I = 7, at = /* @__PURE__ */ D({
  __name: "ADate",
  props: {
    colIndex: {},
    rowIndex: {},
    tableid: {},
    event: {},
    indent: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const t = e, o = ae(t.tableid), n = /* @__PURE__ */ new Date(), s = y(), l = y(), a = y(), r = y([]);
    se(async () => {
      let d = o.cellData(t.colIndex, t.rowIndex);
      d ? (d instanceof Date || (d = new Date(d)), s.value = d, l.value = s.value.getMonth(), a.value = s.value.getFullYear()) : (l.value = n.getMonth(), a.value = n.getFullYear()), p(), await De();
      const T = document.getElementsByClassName("selecteddate");
      if (T.length > 0)
        T[0].focus();
      else {
        const h = document.getElementsByClassName("todaysdate");
        h.length > 0 && h[0].focus();
      }
    }), F([l, a], () => {
      p();
    });
    const p = () => {
      r.value = [];
      const d = new Date(a.value, l.value, 1), T = d.getDay(), h = d.setDate(d.getDate() - T);
      for (let w of Array(43).keys())
        r.value.push(h + w * 864e5);
    }, u = () => {
      a.value -= 1;
    }, c = () => {
      a.value += 1;
    }, g = () => {
      l.value == 0 ? (l.value = 11, u()) : l.value -= 1;
    }, b = () => {
      l.value == 11 ? (l.value = 0, c()) : l.value += 1;
    }, m = (d) => {
      if (l.value === n.getMonth())
        return n.toDateString() === new Date(d).toDateString();
    }, _ = (d) => new Date(d).toDateString() === new Date(s.value).toDateString(), fe = (d, T) => {
      s.value = new Date(r.value[T]), me();
    }, me = () => {
      o.setCellData(t.rowIndex, t.colIndex, s.value.getTime());
    }, ve = S(() => new Date(a.value, l.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return tt([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...de,
          "keydown.pageup": g,
          "keydown.shift.pageup": u,
          "keydown.pagedown": b,
          "keydown.shift.pagedown": c
        }
      }
    ]), (d, T) => d.readonly ? re("", !0) : (f(), v("div", {
      key: 0,
      event: d.event,
      colIndex: d.colIndex,
      rowIndex: d.rowIndex,
      tableid: d.tableid,
      class: "adate",
      tabindex: "0",
      ref: "adatepicker"
    }, [
      i("table", null, [
        i("tr", null, [
          i("td", {
            onClick: g,
            tabindex: -1
          }, "<"),
          i("th", ot, k(ve.value), 1),
          i("td", {
            onClick: b,
            tabindex: -1
          }, ">")
        ]),
        (f(), v(V, null, x(st, (h) => i("tr", { key: h }, [
          (f(), v(V, null, x(I, (w) => i("td", {
            key: (h - 1) * I + w,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            style: Ee({
              border: _(r.value[(h - 1) * I + w]) ? "2px solid var(--focus-cell-outline)" : "none",
              borderBottomColor: m(r.value[(h - 1) * I + w]) ? "var(--focus-cell-outline)" : "none"
            }),
            onClick: Ae((he) => fe(he, (h - 1) * I + w), ["prevent", "stop"]),
            class: B({
              todaysdate: m(r.value[(h - 1) * I + w]),
              selecteddate: _(r.value[(h - 1) * I + w])
            })
          }, k(new Date(r.value[(h - 1) * I + w]).getDate()), 15, lt)), 64))
        ])), 64))
      ])
    ], 8, nt));
  }
}), rt = /* @__PURE__ */ M(at, [["__scopeId", "data-v-169f1184"]]), it = D({
  name: "ADropdown",
  props: {
    modelValue: {
      type: String,
      required: !1,
      default: ""
    },
    label: {
      type: String,
      required: !0
    },
    value: String,
    items: {
      type: Array,
      required: !1,
      default: () => []
    },
    isAsync: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: ["update:modelValue", "filterChanged"],
  data() {
    return {
      results: [],
      search: this.modelValue,
      isLoading: !1,
      arrowCounter: 0,
      isOpen: !1
    };
  },
  watch: {
    items: function(e, t) {
      this.isLoading = !1, this.results = e;
    }
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside), this.filterResults();
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    setResult(e) {
      this.search = e, this.closeResults();
    },
    filterResults() {
      this.results = this.items.filter((e) => e.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
    },
    onChange() {
      this.isOpen = !0, this.isAsync ? (this.isLoading = !0, this.$emit("filterChanged", this.search)) : this.filterResults();
    },
    handleClickOutside(e) {
      this.$el.contains(e.target) || (this.closeResults(), this.arrowCounter = 0);
    },
    closeResults() {
      this.isOpen = !1, this.items.includes(this.search) || (this.search = ""), this.$emit("update:modelValue", this.search);
    },
    onArrowDown() {
      this.arrowCounter < this.results.length && (this.arrowCounter = this.arrowCounter + 1);
    },
    onArrowUp() {
      this.arrowCounter > 0 && (this.arrowCounter = this.arrowCounter - 1);
    },
    onEnter() {
      this.search = this.results[this.arrowCounter], this.closeResults(), this.arrowCounter = 0;
    },
    openWithSearch() {
      this.search = "", this.onChange(), this.$refs.mopInput.focus();
    }
  }
}), ut = { class: "input-wrapper" }, ct = {
  id: "autocomplete-results",
  class: "autocomplete-results"
}, dt = {
  key: 0,
  class: "loading autocomplete-result"
}, pt = ["onClick"];
function ft(e, t, o, n, s, l) {
  return f(), v("div", {
    class: B(["autocomplete", { isOpen: e.isOpen }])
  }, [
    i("div", ut, [
      C(i("input", {
        ref: "mopInput",
        type: "text",
        onInput: t[0] || (t[0] = (...a) => e.onChange && e.onChange(...a)),
        onFocus: t[1] || (t[1] = (...a) => e.onChange && e.onChange(...a)),
        "onUpdate:modelValue": t[2] || (t[2] = (a) => e.search = a),
        onKeydown: [
          t[3] || (t[3] = P((...a) => e.onArrowDown && e.onArrowDown(...a), ["down"])),
          t[4] || (t[4] = P((...a) => e.onArrowUp && e.onArrowUp(...a), ["up"])),
          t[5] || (t[5] = P((...a) => e.onEnter && e.onEnter(...a), ["enter"]))
        ]
      }, null, 544), [
        [R, e.search]
      ]),
      C(i("ul", ct, [
        e.isLoading ? (f(), v("li", dt, "Loading results...")) : (f(!0), v(V, { key: 1 }, x(e.results, (a, r) => (f(), v("li", {
          key: r,
          onClick: (p) => e.setResult(a),
          class: B(["autocomplete-result", { "is-active": r === e.arrowCounter }])
        }, k(a), 11, pt))), 128))
      ], 512), [
        [$, e.isOpen]
      ]),
      i("label", null, k(e.label), 1)
    ])
  ], 2);
}
const mt = /* @__PURE__ */ M(it, [["render", ft]]), vt = /* @__PURE__ */ D({
  __name: "CollapseButton",
  props: {
    collapsed: { type: Boolean }
  },
  setup(e) {
    return (t, o) => (f(), v("button", {
      class: B(["collapse-button", t.collapsed ? "rotated" : "unrotated"])
    }, "×", 2));
  }
}), ht = /* @__PURE__ */ M(vt, [["__scopeId", "data-v-6f1c1b45"]]), gt = /* @__PURE__ */ D({
  __name: "AForm",
  props: {
    modelValue: {},
    data: {},
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const o = e, n = t, s = y(o.data || {}), l = (r) => {
      let p = {};
      for (const [u, c] of Object.entries(r))
        ["component", "fieldtype"].includes(u) || (p[u] = c), u === "rows" && c && c.length === 0 && (p.rows = s.value[r.fieldname]);
      return p;
    }, a = S({
      get: () => o.modelValue.map((r, p) => S({
        get() {
          return r.value;
        },
        set: (u) => {
          o.modelValue[p].value = u, n("update:modelValue", o.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (r, p) => (f(), v("form", null, [
      (f(!0), v(V, null, x(r.modelValue, (u, c) => (f(), H(Ie(u.component), Me({
        key: c,
        schema: u,
        modelValue: a.value[c].value,
        "onUpdate:modelValue": (g) => a.value[c].value = g,
        data: s.value[u.fieldname],
        readonly: r.readonly
      }, l(u)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
}), pe = /* @__PURE__ */ M(gt, [["__scopeId", "data-v-74d66cf2"]]), yt = /* @__PURE__ */ D({
  __name: "AFieldset",
  props: {
    schema: {},
    label: {},
    collapsible: { type: Boolean },
    data: {}
  },
  setup(e) {
    const t = e, o = y(t.data || []);
    let n = y(!1), s = y(t.collapsible);
    const l = y(t.schema);
    function a(r) {
      r.preventDefault(), s.value && (n.value = !n.value);
    }
    return (r, p) => (f(), v("fieldset", null, [
      i("legend", {
        onClick: a,
        onSubmit: a
      }, [
        Te(k(r.label) + " ", 1),
        O(s) ? (f(), H(ht, {
          key: 0,
          collapsed: O(n)
        }, null, 8, ["collapsed"])) : re("", !0)
      ], 32),
      _e(r.$slots, "default", { collapsed: O(n) }, () => [
        C(Se(pe, {
          modelValue: l.value,
          "onUpdate:modelValue": p[0] || (p[0] = (u) => l.value = u),
          data: o.value
        }, null, 8, ["modelValue", "data"]), [
          [$, !O(n)]
        ])
      ], !0)
    ]));
  }
}), bt = /* @__PURE__ */ M(yt, [["__scopeId", "data-v-cad9b578"]]), wt = ["id", "disabled", "required"], Ct = ["for"], kt = ["innerHTML"], Dt = /* @__PURE__ */ D({
  __name: "ANumericInput",
  props: {
    label: {},
    modelValue: {},
    required: { type: Boolean },
    readonly: { type: Boolean },
    uuid: {},
    validation: { default: () => ({ errorMessage: "&nbsp;" }) }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const o = e, n = t, s = S({
      get: () => o.modelValue,
      set: (l) => {
        n("update:modelValue", l);
      }
    });
    return (l, a) => (f(), v("div", null, [
      C(i("input", {
        "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value = r),
        type: "number",
        id: l.uuid,
        disabled: l.readonly,
        required: l.required
      }, null, 8, wt), [
        [R, s.value]
      ]),
      i("label", { for: l.uuid }, k(l.label), 9, Ct),
      C(i("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, kt), [
        [$, l.validation.errorMessage]
      ])
    ]));
  }
}), Et = /* @__PURE__ */ M(Dt, [["__scopeId", "data-v-be33e6c4"]]), le = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function At(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function It(e) {
  var o;
  let t = e.value;
  if (t) {
    const n = At(t);
    if (n) {
      const s = e.instance.locale;
      t = n(s);
    }
  } else {
    const s = (o = e.instance.schema.fieldtype) == null ? void 0 : o.toLowerCase();
    s && le[s] && (t = le[s]);
  }
  return t;
}
function Mt(e, t) {
  t || (t = "#");
  let o = e;
  const n = [t, "/", "-", "(", ")", " "];
  for (const s of n)
    o = o.replaceAll(s, "");
  return o;
}
function Tt(e, t, o) {
  o || (o = "#");
  let n = t;
  for (const s of e) {
    const l = n.indexOf(o);
    if (l !== -1) {
      const a = n.substring(0, l), r = n.substring(l + 1);
      n = a + s + r;
    }
  }
  return n.slice(0, t.length);
}
function _t(e, t) {
  const o = It(t);
  if (!o)
    return;
  const n = "#", s = e.value, l = Mt(s, n);
  if (l) {
    const a = Tt(l, o, n);
    t.instance.maskFilled && (t.instance.maskFilled = !a.includes(n)), e.value = a;
  } else
    e.value = o;
}
const St = D({
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
    const o = y(!1), n = ae("locale", "");
    return { inputText: S({
      get() {
        return e.modelValue;
      },
      set(l) {
        t.emit("update:modelValue", l);
      }
    }), locale: n, maskFilled: o };
  },
  directives: {
    mask: _t
  }
}), Ot = ["id", "disabled", "maxlength", "required"], $t = ["for"], Lt = ["innerHTML"];
function Vt(e, t, o, n, s, l) {
  const a = Oe("mask");
  return f(), v("div", null, [
    C(i("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.inputText = r),
      id: e.uuid,
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required
    }, null, 8, Ot), [
      [R, e.inputText],
      [a, e.mask]
    ]),
    i("label", { for: e.uuid }, k(e.label), 9, $t),
    C(i("p", {
      innerHTML: e.validation.errorMessage
    }, null, 8, Lt), [
      [$, e.validation.errorMessage]
    ])
  ]);
}
const xt = /* @__PURE__ */ M(St, [["render", Vt], ["__scopeId", "data-v-76dba9b8"]]);
function Pt(e) {
  e.component("ACheckbox", qe), e.component("ACombobox", Fe), e.component("ADate", rt), e.component("ADropdown", mt), e.component("AFieldset", bt), e.component("AForm", pe), e.component("ANumericInput", Et), e.component("ATextInput", xt);
}
export {
  qe as ACheckbox,
  Fe as AComboBox,
  rt as ADate,
  mt as ADropdown,
  bt as AFieldset,
  pe as AForm,
  Et as ANumericInput,
  xt as ATextInput,
  Pt as install
};
//# sourceMappingURL=aform.js.map
