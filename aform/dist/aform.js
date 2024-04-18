import { defineComponent as C, computed as M, openBlock as p, createElementBlock as v, createElementVNode as i, withDirectives as _, vModelCheckbox as _e, toDisplayString as w, vShow as S, resolveComponent as be, createBlock as B, withCtx as we, onMounted as ae, onBeforeUnmount as Ce, ref as g, watch as U, unref as O, getCurrentScope as ke, onScopeDispose as Ae, inject as re, nextTick as De, Fragment as L, renderList as q, normalizeStyle as Ee, withModifiers as Ie, normalizeClass as x, createCommentVNode as H, withKeys as F, vModelText as P, resolveDynamicComponent as Me, mergeProps as ie, createTextVNode as Te, renderSlot as $e, createVNode as Se, resolveDirective as Oe } from "vue";
const Ve = { id: "checkbox-container" }, Le = ["id", "readonly", "required"], qe = { id: "custom-checkbox" }, xe = ["for"], Be = ["innerHTML"], He = /* @__PURE__ */ C({
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
    const n = e, o = t, s = M({
      get() {
        return n.value;
      },
      set(l) {
        o("update:value", l);
      }
    });
    return (l, a) => (p(), v("div", null, [
      i("label", Ve, [
        _(i("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value = r),
          type: "checkbox",
          id: l.uuid,
          class: "checkbox",
          readonly: l.readOnly,
          required: l.required
        }, null, 8, Le), [
          [_e, s.value]
        ]),
        i("span", qe, w(s.value), 1)
      ]),
      i("label", {
        for: l.uuid,
        id: "checkbox-label"
      }, w(l.label), 9, xe),
      _(i("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, Be), [
        [S, l.validation.errorMessage]
      ])
    ]));
  }
});
const A = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, s] of t)
    n[o] = s;
  return n;
}, Pe = /* @__PURE__ */ A(He, [["__scopeId", "data-v-743cd4db"]]), Fe = /* @__PURE__ */ i("div", null, [
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" })
], -1), Re = /* @__PURE__ */ C({
  __name: "AComboBox",
  props: ["event", "cellData", "tableID"],
  setup(e) {
    return (t, n) => {
      const o = be("ATableModal");
      return p(), B(o, {
        event: e.event,
        cellData: e.cellData,
        class: "amodal"
      }, {
        default: we(() => [
          Fe
        ]),
        _: 1
      }, 8, ["event", "cellData"]);
    };
  }
});
var W;
const ue = typeof window < "u", Ue = (e) => typeof e == "string", Qe = () => {
};
ue && (W = window == null ? void 0 : window.navigator) != null && W.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function de(e) {
  return typeof e == "function" ? e() : O(e);
}
function Ye(e) {
  return e;
}
function je(e) {
  return ke() ? (Ae(e), !0) : !1;
}
function R(e) {
  var t;
  const n = de(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const ce = ue ? window : void 0;
function Ne(...e) {
  let t, n, o, s;
  if (Ue(e[0]) || Array.isArray(e[0]) ? ([n, o, s] = e, t = ce) : [t, n, o, s] = e, !t)
    return Qe;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const l = [], a = () => {
    l.forEach((d) => d()), l.length = 0;
  }, r = (d, y, b, m) => (d.addEventListener(y, b, m), () => d.removeEventListener(y, b, m)), f = U(() => [R(t), de(s)], ([d, y]) => {
    a(), d && l.push(...n.flatMap((b) => o.map((m) => r(d, b, m, y))));
  }, { immediate: !0, flush: "post" }), u = () => {
    f(), a();
  };
  return je(u), u;
}
const z = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, G = "__vueuse_ssr_handlers__";
z[G] = z[G] || {};
function We(e, { window: t = ce, scrollTarget: n } = {}) {
  const o = g(!1), s = () => {
    if (!t)
      return;
    const l = t.document, a = R(e);
    if (!a)
      o.value = !1;
    else {
      const r = a.getBoundingClientRect();
      o.value = r.top <= (t.innerHeight || l.documentElement.clientHeight) && r.left <= (t.innerWidth || l.documentElement.clientWidth) && r.bottom >= 0 && r.right >= 0;
    }
  };
  return U(() => R(e), () => s(), { immediate: !0, flush: "post" }), t && Ne(n || t, "scroll", s, {
    capture: !1,
    passive: !0
  }), o;
}
var K;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(K || (K = {}));
var ze = Object.defineProperty, J = Object.getOwnPropertySymbols, Ge = Object.prototype.hasOwnProperty, Ke = Object.prototype.propertyIsEnumerable, X = (e, t, n) => t in e ? ze(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Je = (e, t) => {
  for (var n in t || (t = {}))
    Ge.call(t, n) && X(e, n, t[n]);
  if (J)
    for (var n of J(t))
      Ke.call(t, n) && X(e, n, t[n]);
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
Je({
  linear: Ye
}, Xe);
const D = (e) => {
  let t = We(e).value;
  return t = t && e.offsetHeight > 0, t;
}, E = (e) => e.tabIndex >= 0, Z = (e) => {
  const t = e.target;
  return Q(t);
}, Q = (e) => {
  var t;
  let n;
  if (e instanceof HTMLTableCellElement) {
    const o = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    if (o) {
      const s = Array.from(o.children)[e.cellIndex];
      s && (n = s);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const o = e.previousElementSibling;
    o && (n = o);
  }
  return n && (!E(n) || !D(n)) ? Q(n) : n;
}, Ze = (e) => {
  var t;
  const n = e.target;
  let o;
  if (n instanceof HTMLTableCellElement) {
    const s = (t = n.parentElement) == null ? void 0 : t.parentElement;
    if (s) {
      const l = s.firstElementChild.children[n.cellIndex];
      l && (o = l);
    }
  } else if (n instanceof HTMLTableRowElement) {
    const s = n.parentElement;
    if (s) {
      const l = s.firstElementChild;
      l && (o = l);
    }
  }
  return o && (!E(o) || !D(o)) ? Y(o) : o;
}, ee = (e) => {
  const t = e.target;
  return Y(t);
}, Y = (e) => {
  var t;
  let n;
  if (e instanceof HTMLTableCellElement) {
    const o = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    if (o) {
      const s = Array.from(o.children)[e.cellIndex];
      s && (n = s);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const o = e.nextElementSibling;
    o && (n = o);
  }
  return n && (!E(n) || !D(n)) ? Y(n) : n;
}, et = (e) => {
  var t;
  const n = e.target;
  let o;
  if (n instanceof HTMLTableCellElement) {
    const s = (t = n.parentElement) == null ? void 0 : t.parentElement;
    if (s) {
      const l = s.lastElementChild.children[n.cellIndex];
      l && (o = l);
    }
  } else if (n instanceof HTMLTableRowElement) {
    const s = n.parentElement;
    if (s) {
      const l = s.lastElementChild;
      l && (o = l);
    }
  }
  return o && (!E(o) || !D(o)) ? Q(o) : o;
}, te = (e) => {
  const t = e.target;
  return j(t);
}, j = (e) => {
  var t;
  let n;
  if (e.previousElementSibling)
    n = e.previousElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    n = o == null ? void 0 : o.lastElementChild;
  }
  return n && (!E(n) || !D(n)) ? j(n) : n;
}, ne = (e) => {
  const t = e.target;
  return N(t);
}, N = (e) => {
  var t;
  let n;
  if (e.nextElementSibling)
    n = e.nextElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    n = o == null ? void 0 : o.firstElementChild;
  }
  return n && (!E(n) || !D(n)) ? N(n) : n;
}, oe = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!E(t) || !D(t)) ? N(t) : t;
}, le = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!E(t) || !D(t)) ? j(t) : t;
}, V = ["alt", "control", "shift", "meta"], tt = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, pe = {
  "keydown.up": (e) => {
    const t = Z(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.down": (e) => {
    const t = ee(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.left": (e) => {
    const t = te(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.right": (e) => {
    const t = ne(e);
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
    const t = oe(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.right": (e) => {
    const t = le(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.end": (e) => {
    const t = le(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = ee(e);
      t && t.focus();
    }
  },
  "keydown.shift.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = Z(e);
      t && t.focus();
    }
  },
  "keydown.home": (e) => {
    const t = oe(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.tab": (e) => {
    const t = ne(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.shift.tab": (e) => {
    const t = te(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  }
};
function nt(e) {
  const t = (o) => {
    let s = null;
    o.parent && (typeof o.parent == "string" ? s = document.querySelector(o.parent) : o.parent instanceof Element ? s = o.parent : s = o.parent.value);
    let l = [];
    if (o.selectors)
      if (typeof o.selectors == "string")
        l = s ? Array.from(s.querySelectorAll(o.selectors)) : Array.from(document.querySelectorAll(o.selectors));
      else if (o.selectors instanceof Element)
        l.push(o.selectors);
      else if (Array.isArray(o.selectors.value))
        for (const a of o.selectors.value)
          a instanceof Element ? l.push(a) : l.push(a.$el);
      else
        l.push(o.selectors.value);
    else
      l = Array.from(s.children).filter((a) => E(a) && D(a));
    return l;
  }, n = (o) => (s) => {
    const l = tt[s.key] || s.key.toLowerCase();
    if (V.includes(l))
      return;
    const a = o.handlers || pe;
    for (const r of Object.keys(a)) {
      const [f, ...u] = r.split(".");
      if (f === "keydown" && u.includes(l)) {
        const d = a[r], y = u.filter((m) => V.includes(m)), b = V.some((m) => {
          const $ = m.charAt(0).toUpperCase() + m.slice(1);
          return s.getModifierState($);
        });
        if (y.length > 0) {
          if (b) {
            for (const m of V)
              if (u.includes(m)) {
                const $ = m.charAt(0).toUpperCase() + m.slice(1);
                s.getModifierState($) && d(s);
              }
          }
        } else
          b || d(s);
      }
    }
  };
  ae(() => {
    for (const o of e) {
      const s = t(o);
      for (const l of s)
        l.addEventListener("keydown", n(o));
    }
  }), Ce(() => {
    for (const o of e) {
      const s = t(o);
      for (const l of s)
        l.removeEventListener("keydown", n(o));
    }
  });
}
const ot = ["event", "colIndex", "rowIndex", "tableid"], lt = { colspan: "5" }, st = ["onClick"], at = 6, I = 7, rt = /* @__PURE__ */ C({
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
    const t = e, n = re(t.tableid), o = /* @__PURE__ */ new Date(), s = g(), l = g(), a = g(), r = g([]);
    ae(async () => {
      let c = n.cellData(t.colIndex, t.rowIndex);
      c ? (c instanceof Date || (c = new Date(c)), s.value = c, l.value = s.value.getMonth(), a.value = s.value.getFullYear()) : (l.value = o.getMonth(), a.value = o.getFullYear()), f(), await De();
      const T = document.getElementsByClassName("selecteddate");
      if (T.length > 0)
        T[0].focus();
      else {
        const h = document.getElementsByClassName("todaysdate");
        h.length > 0 && h[0].focus();
      }
    }), U([l, a], () => {
      f();
    });
    const f = () => {
      r.value = [];
      const c = new Date(a.value, l.value, 1), T = c.getDay(), h = c.setDate(c.getDate() - T);
      for (let k of Array(43).keys())
        r.value.push(h + k * 864e5);
    }, u = () => {
      a.value -= 1;
    }, d = () => {
      a.value += 1;
    }, y = () => {
      l.value == 0 ? (l.value = 11, u()) : l.value -= 1;
    }, b = () => {
      l.value == 11 ? (l.value = 0, d()) : l.value += 1;
    }, m = (c) => {
      if (l.value === o.getMonth())
        return o.toDateString() === new Date(c).toDateString();
    }, $ = (c) => new Date(c).toDateString() === new Date(s.value).toDateString(), ve = (c, T) => {
      s.value = new Date(r.value[T]), he();
    }, he = () => {
      n.setCellData(t.rowIndex, t.colIndex, s.value.getTime());
    }, ye = M(() => new Date(a.value, l.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return nt([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...pe,
          "keydown.pageup": y,
          "keydown.shift.pageup": u,
          "keydown.pagedown": b,
          "keydown.shift.pagedown": d
        }
      }
    ]), (c, T) => c.readonly ? H("", !0) : (p(), v("div", {
      key: 0,
      event: c.event,
      colIndex: c.colIndex,
      rowIndex: c.rowIndex,
      tableid: c.tableid,
      class: "adate",
      tabindex: "0",
      ref: "adatepicker"
    }, [
      i("table", null, [
        i("tr", null, [
          i("td", {
            onClick: y,
            tabindex: -1
          }, "<"),
          i("th", lt, w(ye.value), 1),
          i("td", {
            onClick: b,
            tabindex: -1
          }, ">")
        ]),
        (p(), v(L, null, q(at, (h) => i("tr", { key: h }, [
          (p(), v(L, null, q(I, (k) => i("td", {
            key: (h - 1) * I + k,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            style: Ee({
              border: $(r.value[(h - 1) * I + k]) ? "2px solid var(--focus-cell-outline)" : "none",
              borderBottomColor: m(r.value[(h - 1) * I + k]) ? "var(--focus-cell-outline)" : "none"
            }),
            onClick: Ie((ge) => ve(ge, (h - 1) * I + k), ["prevent", "stop"]),
            class: x({
              todaysdate: m(r.value[(h - 1) * I + k]),
              selecteddate: $(r.value[(h - 1) * I + k])
            })
          }, w(new Date(r.value[(h - 1) * I + k]).getDate()), 15, st)), 64))
        ])), 64))
      ])
    ], 8, ot));
  }
});
const it = /* @__PURE__ */ A(rt, [["__scopeId", "data-v-169f1184"]]), ut = C({
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
});
const dt = { class: "input-wrapper" }, ct = {
  id: "autocomplete-results",
  class: "autocomplete-results"
}, pt = {
  key: 0,
  class: "loading autocomplete-result"
}, ft = ["onClick"], mt = { key: 0 };
function vt(e, t, n, o, s, l) {
  return p(), v("div", {
    class: x(["autocomplete", { isOpen: e.isOpen }])
  }, [
    i("div", dt, [
      _(i("input", {
        ref: "mopInput",
        type: "text",
        onInput: t[0] || (t[0] = (...a) => e.onChange && e.onChange(...a)),
        onFocus: t[1] || (t[1] = (...a) => e.onChange && e.onChange(...a)),
        "onUpdate:modelValue": t[2] || (t[2] = (a) => e.search = a),
        onKeydown: [
          t[3] || (t[3] = F((...a) => e.onArrowDown && e.onArrowDown(...a), ["down"])),
          t[4] || (t[4] = F((...a) => e.onArrowUp && e.onArrowUp(...a), ["up"])),
          t[5] || (t[5] = F((...a) => e.onEnter && e.onEnter(...a), ["enter"]))
        ]
      }, null, 544), [
        [P, e.search]
      ]),
      _(i("ul", ct, [
        e.isLoading ? (p(), v("li", pt, "Loading results...")) : (p(!0), v(L, { key: 1 }, q(e.results, (a, r) => (p(), v("li", {
          key: r,
          onClick: (f) => e.setResult(a),
          class: x(["autocomplete-result", { "is-active": r === e.arrowCounter }])
        }, w(a), 11, ft))), 128))
      ], 512), [
        [S, e.isOpen]
      ]),
      e.label ? (p(), v("label", mt, w(e.label), 1)) : H("", !0)
    ])
  ], 2);
}
const fe = /* @__PURE__ */ A(ut, [["render", vt], ["__scopeId", "data-v-35e27f15"]]), ht = /* @__PURE__ */ C({
  __name: "CollapseButton",
  props: {
    collapsed: { type: Boolean }
  },
  setup(e) {
    return (t, n) => (p(), v("button", {
      class: x(["collapse-button", t.collapsed ? "rotated" : "unrotated"])
    }, "×", 2));
  }
});
const yt = /* @__PURE__ */ A(ht, [["__scopeId", "data-v-6f1c1b45"]]), gt = /* @__PURE__ */ C({
  __name: "AForm",
  props: {
    modelValue: {},
    data: {},
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = t, s = g(n.data || {}), l = (r) => {
      let f = {};
      for (const [u, d] of Object.entries(r))
        ["component", "fieldtype"].includes(u) || (f[u] = d), u === "rows" && d && d.length === 0 && (f.rows = s.value[r.fieldname]);
      return f;
    }, a = M({
      get: () => n.modelValue.map((r, f) => M({
        get() {
          return r.value;
        },
        set: (u) => {
          n.modelValue[f].value = u, o("update:modelValue", n.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (r, f) => (p(), v("form", null, [
      (p(!0), v(L, null, q(r.modelValue, (u, d) => (p(), B(Me(u.component), ie({
        key: d,
        schema: u,
        modelValue: a.value[d].value,
        "onUpdate:modelValue": (y) => a.value[d].value = y,
        data: s.value[u.fieldname],
        readonly: r.readonly
      }, l(u)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
});
const me = /* @__PURE__ */ A(gt, [["__scopeId", "data-v-82492bb4"]]), _t = /* @__PURE__ */ C({
  __name: "AFieldset",
  props: {
    schema: {},
    label: {},
    collapsible: { type: Boolean },
    data: {}
  },
  setup(e) {
    const t = e, n = g(t.data || []);
    let o = g(!1), s = g(t.collapsible);
    const l = g(t.schema);
    function a(r) {
      r.preventDefault(), s.value && (o.value = !o.value);
    }
    return (r, f) => (p(), v("fieldset", null, [
      i("legend", {
        onClick: a,
        onSubmit: a
      }, [
        Te(w(r.label) + " ", 1),
        O(s) ? (p(), B(yt, {
          key: 0,
          collapsed: O(o)
        }, null, 8, ["collapsed"])) : H("", !0)
      ], 32),
      $e(r.$slots, "default", { collapsed: O(o) }, () => [
        _(Se(me, {
          modelValue: l.value,
          "onUpdate:modelValue": f[0] || (f[0] = (u) => l.value = u),
          data: n.value
        }, null, 8, ["modelValue", "data"]), [
          [S, !O(o)]
        ])
      ], !0)
    ]));
  }
});
const bt = /* @__PURE__ */ A(_t, [["__scopeId", "data-v-cad9b578"]]), wt = ["id", "disabled", "required"], Ct = ["for"], kt = ["innerHTML"], At = /* @__PURE__ */ C({
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
    const n = e, o = t, s = M({
      get: () => n.modelValue,
      set: (l) => {
        o("update:modelValue", l);
      }
    });
    return (l, a) => (p(), v("div", null, [
      _(i("input", {
        "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value = r),
        type: "number",
        id: l.uuid,
        disabled: l.readonly,
        required: l.required
      }, null, 8, wt), [
        [P, s.value]
      ]),
      i("label", { for: l.uuid }, w(l.label), 9, Ct),
      _(i("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, kt), [
        [S, l.validation.errorMessage]
      ])
    ]));
  }
});
const Dt = /* @__PURE__ */ A(At, [["__scopeId", "data-v-be33e6c4"]]), Et = { class: "input-group" }, It = ["for"], Mt = ["id", "disabled", "required"], Tt = ["innerHTML"], $t = /* @__PURE__ */ C({
  __name: "AQuantity",
  props: {
    label: {},
    modelValue: { default: () => ({ quantity: 0 }) },
    required: { type: Boolean },
    readonly: { type: Boolean },
    uuid: {},
    validation: { default: () => ({ errorMessage: "" }) }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = t;
    M(() => n.modelValue.quantity * n.modelValue.conversionFactor);
    const s = M({
      get: () => n.modelValue,
      set: (l) => {
        o("update:modelValue", l);
      }
    });
    return (l, a) => (p(), v("div", Et, [
      i("label", { for: l.uuid }, w(l.label), 9, It),
      _(i("input", ie({
        "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value.quantity = r),
        type: "number",
        id: l.uuid,
        disabled: l.readonly,
        required: l.required
      }, s.value), null, 16, Mt), [
        [P, s.value.quantity]
      ]),
      s.value.uom ? (p(), B(fe, {
        key: 0,
        modelValue: s.value.uom,
        "onUpdate:modelValue": a[1] || (a[1] = (r) => s.value.uom = r),
        label: "",
        items: s.value.uoms,
        class: "input-group-append"
      }, null, 8, ["modelValue", "items"])) : H("", !0),
      _(i("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, Tt), [
        [S, l.validation.errorMessage]
      ])
    ]));
  }
});
const St = /* @__PURE__ */ A($t, [["__scopeId", "data-v-45134904"]]), se = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function Ot(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function Vt(e) {
  var n;
  let t = e.value;
  if (t) {
    const o = Ot(t);
    if (o) {
      const s = e.instance.locale;
      t = o(s);
    }
  } else {
    const s = (n = e.instance.schema.fieldtype) == null ? void 0 : n.toLowerCase();
    s && se[s] && (t = se[s]);
  }
  return t;
}
function Lt(e, t) {
  t || (t = "#");
  let n = e;
  const o = [t, "/", "-", "(", ")", " "];
  for (const s of o)
    n = n.replaceAll(s, "");
  return n;
}
function qt(e, t, n) {
  n || (n = "#");
  let o = t;
  for (const s of e) {
    const l = o.indexOf(n);
    if (l !== -1) {
      const a = o.substring(0, l), r = o.substring(l + 1);
      o = a + s + r;
    }
  }
  return o.slice(0, t.length);
}
function xt(e, t) {
  const n = Vt(t);
  if (!n)
    return;
  const o = "#", s = e.value, l = Lt(s, o);
  if (l) {
    const a = qt(l, n, o);
    t.instance.maskFilled && (t.instance.maskFilled = !a.includes(o)), e.value = a;
  } else
    e.value = n;
}
const Bt = C({
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
    const n = g(!1), o = re("locale", "");
    return { inputText: M({
      get() {
        return e.modelValue;
      },
      set(l) {
        t.emit("update:modelValue", l);
      }
    }), locale: o, maskFilled: n };
  },
  directives: {
    mask: xt
  }
});
const Ht = ["id", "disabled", "maxlength", "required"], Pt = ["for"], Ft = ["innerHTML"];
function Rt(e, t, n, o, s, l) {
  const a = Oe("mask");
  return p(), v("div", null, [
    _(i("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.inputText = r),
      id: e.uuid,
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required
    }, null, 8, Ht), [
      [P, e.inputText],
      [a, e.mask]
    ]),
    i("label", { for: e.uuid }, w(e.label), 9, Pt),
    _(i("p", {
      innerHTML: e.validation.errorMessage
    }, null, 8, Ft), [
      [S, e.validation.errorMessage]
    ])
  ]);
}
const Ut = /* @__PURE__ */ A(Bt, [["render", Rt], ["__scopeId", "data-v-76dba9b8"]]);
function Yt(e) {
  e.component("ACheckbox", Pe), e.component("ACombobox", Re), e.component("ADate", it), e.component("ADropdown", fe), e.component("AFieldset", bt), e.component("AForm", me), e.component("ANumericInput", Dt), e.component("AQuantity", St), e.component("ATextInput", Ut);
}
export {
  Pe as ACheckbox,
  Re as AComboBox,
  it as ADate,
  fe as ADropdown,
  bt as AFieldset,
  me as AForm,
  Dt as ANumericInput,
  St as AQuantity,
  Ut as ATextInput,
  Yt as install
};
//# sourceMappingURL=aform.js.map
