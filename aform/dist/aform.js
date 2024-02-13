import { defineComponent as k, computed as S, openBlock as f, createElementBlock as v, createElementVNode as i, withDirectives as w, vModelCheckbox as ye, toDisplayString as C, vShow as $, resolveComponent as ge, createBlock as F, withCtx as be, onMounted as se, onBeforeUnmount as _e, ref as g, watch as H, unref as O, getCurrentScope as we, onScopeDispose as Ce, inject as ae, nextTick as ke, Fragment as x, renderList as V, normalizeStyle as De, withModifiers as Ae, normalizeClass as B, createCommentVNode as re, withKeys as P, vModelText as R, resolveDynamicComponent as Ee, mergeProps as Ie, createTextVNode as Me, renderSlot as Te, createVNode as Se, resolveDirective as Oe } from "vue";
const $e = { id: "checkbox-container" }, Le = ["id", "readonly", "required"], xe = { id: "custom-checkbox" }, Ve = ["for"], Be = ["innerHTML"], Pe = /* @__PURE__ */ k({
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
        w(i("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value = r),
          type: "checkbox",
          id: l.uuid,
          class: "checkbox",
          readonly: l.readOnly,
          required: l.required
        }, null, 8, Le), [
          [ye, s.value]
        ]),
        i("span", xe, C(s.value), 1)
      ]),
      i("label", {
        for: l.uuid,
        id: "checkbox-label"
      }, C(l.label), 9, Ve),
      w(i("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, Be), [
        [$, l.validation.errorMessage]
      ])
    ]));
  }
});
const I = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [n, s] of t)
    o[n] = s;
  return o;
}, qe = /* @__PURE__ */ I(Pe, [["__scopeId", "data-v-743cd4db"]]), Fe = /* @__PURE__ */ i("div", null, [
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" })
], -1), He = /* @__PURE__ */ k({
  __name: "AComboBox",
  props: ["event", "cellData", "tableID"],
  setup(e) {
    return (t, o) => {
      const n = ge("ATableModal");
      return f(), F(n, {
        event: e.event,
        cellData: e.cellData,
        class: "amodal"
      }, {
        default: be(() => [
          Fe
        ]),
        _: 1
      }, 8, ["event", "cellData"]);
    };
  }
});
var N;
const ie = typeof window < "u", Re = (e) => typeof e == "string", Ue = () => {
};
ie && (N = window == null ? void 0 : window.navigator) != null && N.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function ue(e) {
  return typeof e == "function" ? e() : O(e);
}
function Qe(e) {
  return e;
}
function Ye(e) {
  return we() ? (Ce(e), !0) : !1;
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
  }, r = (c, y, b, m) => (c.addEventListener(y, b, m), () => c.removeEventListener(y, b, m)), p = H(() => [q(t), ue(s)], ([c, y]) => {
    a(), c && l.push(...o.flatMap((b) => n.map((m) => r(c, b, m, y))));
  }, { immediate: !0, flush: "post" }), u = () => {
    p(), a();
  };
  return Ye(u), u;
}
const W = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, z = "__vueuse_ssr_handlers__";
W[z] = W[z] || {};
function Ne(e, { window: t = ce, scrollTarget: o } = {}) {
  const n = g(!1), s = () => {
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
  return H(() => q(e), () => s(), { immediate: !0, flush: "post" }), t && je(o || t, "scroll", s, {
    capture: !1,
    passive: !0
  }), n;
}
var G;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(G || (G = {}));
var We = Object.defineProperty, K = Object.getOwnPropertySymbols, ze = Object.prototype.hasOwnProperty, Ge = Object.prototype.propertyIsEnumerable, J = (e, t, o) => t in e ? We(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o, Ke = (e, t) => {
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
const D = (e) => {
  let t = Ne(e).value;
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
  return o && (!A(o) || !D(o)) ? U(o) : o;
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
  return n && (!A(n) || !D(n)) ? Q(n) : n;
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
  return o && (!A(o) || !D(o)) ? Q(o) : o;
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
  return n && (!A(n) || !D(n)) ? U(n) : n;
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
  return o && (!A(o) || !D(o)) ? Y(o) : o;
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
  return o && (!A(o) || !D(o)) ? j(o) : o;
}, ne = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!A(t) || !D(t)) ? j(t) : t;
}, oe = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!A(t) || !D(t)) ? Y(t) : t;
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
      l = Array.from(s.children).filter((a) => A(a) && D(a));
    return l;
  }, o = (n) => (s) => {
    const l = et[s.key] || s.key.toLowerCase();
    if (L.includes(l))
      return;
    const a = n.handlers || de;
    for (const r of Object.keys(a)) {
      const [p, ...u] = r.split(".");
      if (p === "keydown" && u.includes(l)) {
        const c = a[r], y = u.filter((m) => L.includes(m)), b = L.some((m) => {
          const T = m.charAt(0).toUpperCase() + m.slice(1);
          return s.getModifierState(T);
        });
        if (y.length > 0) {
          if (b) {
            for (const m of L)
              if (u.includes(m)) {
                const T = m.charAt(0).toUpperCase() + m.slice(1);
                s.getModifierState(T) && c(s);
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
  }), _e(() => {
    for (const n of e) {
      const s = t(n);
      for (const l of s)
        l.removeEventListener("keydown", o(n));
    }
  });
}
const nt = ["event", "colIndex", "rowIndex", "tableid"], ot = { colspan: "5" }, lt = ["onClick"], st = 6, E = 7, at = /* @__PURE__ */ k({
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
    const t = e, o = ae(t.tableid), n = /* @__PURE__ */ new Date(), s = g(), l = g(), a = g(), r = g([]);
    se(async () => {
      let d = o.cellData(t.colIndex, t.rowIndex);
      d ? (d instanceof Date || (d = new Date(d)), s.value = d, l.value = s.value.getMonth(), a.value = s.value.getFullYear()) : (l.value = n.getMonth(), a.value = n.getFullYear()), p(), await ke();
      const M = document.getElementsByClassName("selecteddate");
      if (M.length > 0)
        M[0].focus();
      else {
        const h = document.getElementsByClassName("todaysdate");
        h.length > 0 && h[0].focus();
      }
    }), H([l, a], () => {
      p();
    });
    const p = () => {
      r.value = [];
      const d = new Date(a.value, l.value, 1), M = d.getDay(), h = d.setDate(d.getDate() - M);
      for (let _ of Array(43).keys())
        r.value.push(h + _ * 864e5);
    }, u = () => {
      a.value -= 1;
    }, c = () => {
      a.value += 1;
    }, y = () => {
      l.value == 0 ? (l.value = 11, u()) : l.value -= 1;
    }, b = () => {
      l.value == 11 ? (l.value = 0, c()) : l.value += 1;
    }, m = (d) => {
      if (l.value === n.getMonth())
        return n.toDateString() === new Date(d).toDateString();
    }, T = (d) => new Date(d).toDateString() === new Date(s.value).toDateString(), fe = (d, M) => {
      s.value = new Date(r.value[M]), me();
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
          "keydown.pageup": y,
          "keydown.shift.pageup": u,
          "keydown.pagedown": b,
          "keydown.shift.pagedown": c
        }
      }
    ]), (d, M) => d.readonly ? re("", !0) : (f(), v("div", {
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
            onClick: y,
            tabindex: -1
          }, "<"),
          i("th", ot, C(ve.value), 1),
          i("td", {
            onClick: b,
            tabindex: -1
          }, ">")
        ]),
        (f(), v(x, null, V(st, (h) => i("tr", { key: h }, [
          (f(), v(x, null, V(E, (_) => i("td", {
            key: (h - 1) * E + _,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            style: De({
              border: T(r.value[(h - 1) * E + _]) ? "2px solid var(--focus-cell-outline)" : "none",
              borderBottomColor: m(r.value[(h - 1) * E + _]) ? "var(--focus-cell-outline)" : "none"
            }),
            onClick: Ae((he) => fe(he, (h - 1) * E + _), ["prevent", "stop"]),
            class: B({
              todaysdate: m(r.value[(h - 1) * E + _]),
              selecteddate: T(r.value[(h - 1) * E + _])
            })
          }, C(new Date(r.value[(h - 1) * E + _]).getDate()), 15, lt)), 64))
        ])), 64))
      ])
    ], 8, nt));
  }
});
const rt = /* @__PURE__ */ I(at, [["__scopeId", "data-v-fcdc102d"]]), it = k({
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
const ut = { class: "input-wrapper" }, ct = {
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
      w(i("input", {
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
      w(i("ul", ct, [
        e.isLoading ? (f(), v("li", dt, "Loading results...")) : (f(!0), v(x, { key: 1 }, V(e.results, (a, r) => (f(), v("li", {
          key: r,
          onClick: (p) => e.setResult(a),
          class: B(["autocomplete-result", { "is-active": r === e.arrowCounter }])
        }, C(a), 11, pt))), 128))
      ], 512), [
        [$, e.isOpen]
      ]),
      i("label", null, C(e.label), 1)
    ])
  ], 2);
}
const mt = /* @__PURE__ */ I(it, [["render", ft]]), vt = /* @__PURE__ */ k({
  __name: "CollapseButton",
  props: {
    collapsed: { type: Boolean }
  },
  setup(e) {
    return (t, o) => (f(), v("button", {
      class: B(["collapse-button", t.collapsed ? "rotated" : "unrotated"])
    }, "×", 2));
  }
});
const ht = /* @__PURE__ */ I(vt, [["__scopeId", "data-v-6f1c1b45"]]), yt = /* @__PURE__ */ k({
  __name: "AForm",
  props: {
    modelValue: {},
    data: {},
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const o = e, n = t, s = g(o.data || {}), l = (r) => {
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
      (f(!0), v(x, null, V(r.modelValue, (u, c) => (f(), F(Ee(u.component), Ie({
        key: c,
        schema: u,
        modelValue: a.value[c].value,
        "onUpdate:modelValue": (y) => a.value[c].value = y,
        data: s.value[u.fieldname],
        readonly: r.readonly
      }, l(u)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
});
const pe = /* @__PURE__ */ I(yt, [["__scopeId", "data-v-74d66cf2"]]), gt = /* @__PURE__ */ k({
  __name: "AFieldset",
  props: {
    schema: {},
    label: {},
    collapsible: { type: Boolean },
    data: {}
  },
  setup(e) {
    const t = e, o = g(t.data || []);
    let n = g(!1), s = g(t.collapsible);
    const l = g(t.schema);
    function a(r) {
      r.preventDefault(), s.value && (n.value = !n.value);
    }
    return (r, p) => (f(), v("fieldset", null, [
      i("legend", {
        onClick: a,
        onSubmit: a
      }, [
        Me(C(r.label) + " ", 1),
        O(s) ? (f(), F(ht, {
          key: 0,
          collapsed: O(n)
        }, null, 8, ["collapsed"])) : re("", !0)
      ], 32),
      Te(r.$slots, "default", { collapsed: O(n) }, () => [
        w(Se(pe, {
          modelValue: l.value,
          "onUpdate:modelValue": p[0] || (p[0] = (u) => l.value = u),
          data: o.value
        }, null, 8, ["modelValue", "data"]), [
          [$, !O(n)]
        ])
      ], !0)
    ]));
  }
});
const bt = /* @__PURE__ */ I(gt, [["__scopeId", "data-v-cad9b578"]]), _t = ["id", "disabled", "required"], wt = ["for"], Ct = ["innerHTML"], kt = /* @__PURE__ */ k({
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
      w(i("input", {
        "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value = r),
        type: "number",
        id: l.uuid,
        disabled: l.readonly,
        required: l.required
      }, null, 8, _t), [
        [R, s.value]
      ]),
      i("label", { for: l.uuid }, C(l.label), 9, wt),
      w(i("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, Ct), [
        [$, l.validation.errorMessage]
      ])
    ]));
  }
});
const Dt = /* @__PURE__ */ I(kt, [["__scopeId", "data-v-be33e6c4"]]), le = {
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
function Et(e) {
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
function It(e, t) {
  t || (t = "#");
  let o = e;
  const n = [t, "/", "-", "(", ")", " "];
  for (const s of n)
    o = o.replaceAll(s, "");
  return o;
}
function Mt(e, t, o) {
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
function Tt(e, t) {
  const o = Et(t);
  if (!o)
    return;
  const n = "#", s = e.value, l = It(s, n);
  if (l) {
    const a = Mt(l, o, n);
    t.instance.maskFilled && (t.instance.maskFilled = !a.includes(n)), e.value = a;
  } else
    e.value = o;
}
const St = k({
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
    const o = g(!1), n = ae("locale", "");
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
    mask: Tt
  }
});
const Ot = ["id", "disabled", "maxlength", "required"], $t = ["for"], Lt = ["innerHTML"];
function xt(e, t, o, n, s, l) {
  const a = Oe("mask");
  return f(), v("div", null, [
    w(i("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.inputText = r),
      id: e.uuid,
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required
    }, null, 8, Ot), [
      [R, e.inputText],
      [a, e.mask]
    ]),
    i("label", { for: e.uuid }, C(e.label), 9, $t),
    w(i("p", {
      innerHTML: e.validation.errorMessage
    }, null, 8, Lt), [
      [$, e.validation.errorMessage]
    ])
  ]);
}
const Vt = /* @__PURE__ */ I(St, [["render", xt], ["__scopeId", "data-v-76dba9b8"]]);
function Pt(e) {
  e.component("ACheckbox", qe), e.component("ACombobox", He), e.component("ADate", rt), e.component("ADropdown", mt), e.component("AFieldset", bt), e.component("AForm", pe), e.component("ANumericInput", Dt), e.component("ATextInput", Vt);
}
export {
  qe as ACheckbox,
  He as AComboBox,
  rt as ADate,
  mt as ADropdown,
  bt as AFieldset,
  pe as AForm,
  Dt as ANumericInput,
  Vt as ATextInput,
  Pt as install
};
//# sourceMappingURL=aform.js.map
