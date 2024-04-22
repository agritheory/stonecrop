import { defineComponent as D, mergeModels as se, useModel as ae, openBlock as f, createElementBlock as h, createElementVNode as i, withDirectives as C, vModelCheckbox as be, toDisplayString as k, vShow as O, resolveComponent as we, createBlock as H, withCtx as Ce, onMounted as re, onBeforeUnmount as ke, ref as y, watch as F, unref as S, getCurrentScope as De, onScopeDispose as Ee, inject as ie, nextTick as Ae, computed as L, Fragment as V, renderList as x, normalizeStyle as Ie, withModifiers as Me, normalizeClass as B, createCommentVNode as ue, withKeys as P, vModelText as R, resolveDynamicComponent as Te, mergeProps as _e, createTextVNode as Se, renderSlot as Oe, createVNode as $e, resolveDirective as Le } from "vue";
const Ve = { id: "checkbox-container" }, xe = ["id", "readonly", "required"], Be = { id: "custom-checkbox" }, Pe = ["for"], qe = ["innerHTML"], He = /* @__PURE__ */ D({
  __name: "ACheckbox",
  props: /* @__PURE__ */ se({
    label: {},
    required: { type: Boolean },
    readOnly: { type: Boolean },
    uuid: {},
    validation: { default: () => ({ errorMessage: "&nbsp;" }) }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = ae(e, "modelValue");
    return (n, o) => (f(), h("div", null, [
      i("label", Ve, [
        C(i("input", {
          "onUpdate:modelValue": o[0] || (o[0] = (l) => t.value = l),
          type: "checkbox",
          id: n.uuid,
          class: "checkbox",
          readonly: n.readOnly,
          required: n.required
        }, null, 8, xe), [
          [be, t.value]
        ]),
        i("span", Be, k(t.value), 1)
      ]),
      i("label", {
        for: n.uuid,
        id: "checkbox-label"
      }, k(n.label), 9, Pe),
      C(i("p", {
        innerHTML: n.validation.errorMessage
      }, null, 8, qe), [
        [O, n.validation.errorMessage]
      ])
    ]));
  }
}), M = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, l] of t)
    n[o] = l;
  return n;
}, Fe = /* @__PURE__ */ M(He, [["__scopeId", "data-v-24cb38ac"]]), Re = /* @__PURE__ */ i("div", null, [
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" })
], -1), Ue = /* @__PURE__ */ D({
  __name: "AComboBox",
  props: ["event", "cellData", "tableID"],
  setup(e) {
    return (t, n) => {
      const o = we("ATableModal");
      return f(), H(o, {
        event: e.event,
        cellData: e.cellData,
        class: "amodal"
      }, {
        default: Ce(() => [
          Re
        ]),
        _: 1
      }, 8, ["event", "cellData"]);
    };
  }
});
var W;
const de = typeof window < "u", Qe = (e) => typeof e == "string", Ye = () => {
};
de && (W = window == null ? void 0 : window.navigator) != null && W.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function ce(e) {
  return typeof e == "function" ? e() : S(e);
}
function je(e) {
  return e;
}
function We(e) {
  return De() ? (Ee(e), !0) : !1;
}
function q(e) {
  var t;
  const n = ce(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const pe = de ? window : void 0;
function Ne(...e) {
  let t, n, o, l;
  if (Qe(e[0]) || Array.isArray(e[0]) ? ([n, o, l] = e, t = pe) : [t, n, o, l] = e, !t)
    return Ye;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const s = [], a = () => {
    s.forEach((d) => d()), s.length = 0;
  }, r = (d, g, b, m) => (d.addEventListener(g, b, m), () => d.removeEventListener(g, b, m)), p = F(() => [q(t), ce(l)], ([d, g]) => {
    a(), d && s.push(...n.flatMap((b) => o.map((m) => r(d, b, m, g))));
  }, { immediate: !0, flush: "post" }), u = () => {
    p(), a();
  };
  return We(u), u;
}
const N = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, z = "__vueuse_ssr_handlers__";
N[z] = N[z] || {};
function ze(e, { window: t = pe, scrollTarget: n } = {}) {
  const o = y(!1), l = () => {
    if (!t)
      return;
    const s = t.document, a = q(e);
    if (!a)
      o.value = !1;
    else {
      const r = a.getBoundingClientRect();
      o.value = r.top <= (t.innerHeight || s.documentElement.clientHeight) && r.left <= (t.innerWidth || s.documentElement.clientWidth) && r.bottom >= 0 && r.right >= 0;
    }
  };
  return F(() => q(e), () => l(), { immediate: !0, flush: "post" }), t && Ne(n || t, "scroll", l, {
    capture: !1,
    passive: !0
  }), o;
}
var G;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(G || (G = {}));
var Ge = Object.defineProperty, K = Object.getOwnPropertySymbols, Ke = Object.prototype.hasOwnProperty, Je = Object.prototype.propertyIsEnumerable, J = (e, t, n) => t in e ? Ge(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Xe = (e, t) => {
  for (var n in t || (t = {}))
    Ke.call(t, n) && J(e, n, t[n]);
  if (K)
    for (var n of K(t))
      Je.call(t, n) && J(e, n, t[n]);
  return e;
};
const Ze = {
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
Xe({
  linear: je
}, Ze);
const E = (e) => {
  let t = ze(e).value;
  return t = t && e.offsetHeight > 0, t;
}, A = (e) => e.tabIndex >= 0, X = (e) => {
  const t = e.target;
  return U(t);
}, U = (e) => {
  var t;
  let n;
  if (e instanceof HTMLTableCellElement) {
    const o = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    if (o) {
      const l = Array.from(o.children)[e.cellIndex];
      l && (n = l);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const o = e.previousElementSibling;
    o && (n = o);
  }
  return n && (!A(n) || !E(n)) ? U(n) : n;
}, et = (e) => {
  var t;
  const n = e.target;
  let o;
  if (n instanceof HTMLTableCellElement) {
    const l = (t = n.parentElement) == null ? void 0 : t.parentElement;
    if (l) {
      const s = l.firstElementChild.children[n.cellIndex];
      s && (o = s);
    }
  } else if (n instanceof HTMLTableRowElement) {
    const l = n.parentElement;
    if (l) {
      const s = l.firstElementChild;
      s && (o = s);
    }
  }
  return o && (!A(o) || !E(o)) ? Q(o) : o;
}, Z = (e) => {
  const t = e.target;
  return Q(t);
}, Q = (e) => {
  var t;
  let n;
  if (e instanceof HTMLTableCellElement) {
    const o = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    if (o) {
      const l = Array.from(o.children)[e.cellIndex];
      l && (n = l);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const o = e.nextElementSibling;
    o && (n = o);
  }
  return n && (!A(n) || !E(n)) ? Q(n) : n;
}, tt = (e) => {
  var t;
  const n = e.target;
  let o;
  if (n instanceof HTMLTableCellElement) {
    const l = (t = n.parentElement) == null ? void 0 : t.parentElement;
    if (l) {
      const s = l.lastElementChild.children[n.cellIndex];
      s && (o = s);
    }
  } else if (n instanceof HTMLTableRowElement) {
    const l = n.parentElement;
    if (l) {
      const s = l.lastElementChild;
      s && (o = s);
    }
  }
  return o && (!A(o) || !E(o)) ? U(o) : o;
}, ee = (e) => {
  const t = e.target;
  return Y(t);
}, Y = (e) => {
  var t;
  let n;
  if (e.previousElementSibling)
    n = e.previousElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    n = o == null ? void 0 : o.lastElementChild;
  }
  return n && (!A(n) || !E(n)) ? Y(n) : n;
}, te = (e) => {
  const t = e.target;
  return j(t);
}, j = (e) => {
  var t;
  let n;
  if (e.nextElementSibling)
    n = e.nextElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    n = o == null ? void 0 : o.firstElementChild;
  }
  return n && (!A(n) || !E(n)) ? j(n) : n;
}, ne = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!A(t) || !E(t)) ? j(t) : t;
}, oe = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!A(t) || !E(t)) ? Y(t) : t;
}, $ = ["alt", "control", "shift", "meta"], nt = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, fe = {
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
    const t = et(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = tt(e);
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
function ot(e) {
  const t = (o) => {
    let l = null;
    o.parent && (typeof o.parent == "string" ? l = document.querySelector(o.parent) : o.parent instanceof Element ? l = o.parent : l = o.parent.value);
    let s = [];
    if (o.selectors)
      if (typeof o.selectors == "string")
        s = l ? Array.from(l.querySelectorAll(o.selectors)) : Array.from(document.querySelectorAll(o.selectors));
      else if (o.selectors instanceof Element)
        s.push(o.selectors);
      else if (Array.isArray(o.selectors.value))
        for (const a of o.selectors.value)
          a instanceof Element ? s.push(a) : s.push(a.$el);
      else
        s.push(o.selectors.value);
    else
      s = Array.from(l.children).filter((a) => A(a) && E(a));
    return s;
  }, n = (o) => (l) => {
    const s = nt[l.key] || l.key.toLowerCase();
    if ($.includes(s))
      return;
    const a = o.handlers || fe;
    for (const r of Object.keys(a)) {
      const [p, ...u] = r.split(".");
      if (p === "keydown" && u.includes(s)) {
        const d = a[r], g = u.filter((m) => $.includes(m)), b = $.some((m) => {
          const _ = m.charAt(0).toUpperCase() + m.slice(1);
          return l.getModifierState(_);
        });
        if (g.length > 0) {
          if (b) {
            for (const m of $)
              if (u.includes(m)) {
                const _ = m.charAt(0).toUpperCase() + m.slice(1);
                l.getModifierState(_) && d(l);
              }
          }
        } else
          b || d(l);
      }
    }
  };
  re(() => {
    for (const o of e) {
      const l = t(o);
      for (const s of l)
        s.addEventListener("keydown", n(o));
    }
  }), ke(() => {
    for (const o of e) {
      const l = t(o);
      for (const s of l)
        s.removeEventListener("keydown", n(o));
    }
  });
}
const lt = ["event", "colIndex", "rowIndex", "tableid"], st = { colspan: "5" }, at = ["onClick"], rt = 6, I = 7, it = /* @__PURE__ */ D({
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
    const t = e, n = ie(t.tableid), o = /* @__PURE__ */ new Date(), l = y(), s = y(), a = y(), r = y([]);
    re(async () => {
      let c = n.cellData(t.colIndex, t.rowIndex);
      c ? (c instanceof Date || (c = new Date(c)), l.value = c, s.value = l.value.getMonth(), a.value = l.value.getFullYear()) : (s.value = o.getMonth(), a.value = o.getFullYear()), p(), await Ae();
      const T = document.getElementsByClassName("selecteddate");
      if (T.length > 0)
        T[0].focus();
      else {
        const v = document.getElementsByClassName("todaysdate");
        v.length > 0 && v[0].focus();
      }
    }), F([s, a], () => {
      p();
    });
    const p = () => {
      r.value = [];
      const c = new Date(a.value, s.value, 1), T = c.getDay(), v = c.setDate(c.getDate() - T);
      for (let w of Array(43).keys())
        r.value.push(v + w * 864e5);
    }, u = () => {
      a.value -= 1;
    }, d = () => {
      a.value += 1;
    }, g = () => {
      s.value == 0 ? (s.value = 11, u()) : s.value -= 1;
    }, b = () => {
      s.value == 11 ? (s.value = 0, d()) : s.value += 1;
    }, m = (c) => {
      if (s.value === o.getMonth())
        return o.toDateString() === new Date(c).toDateString();
    }, _ = (c) => new Date(c).toDateString() === new Date(l.value).toDateString(), he = (c, T) => {
      l.value = new Date(r.value[T]), ve();
    }, ve = () => {
      n.setCellData(t.rowIndex, t.colIndex, l.value.getTime());
    }, ge = L(() => new Date(a.value, s.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return ot([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...fe,
          "keydown.pageup": g,
          "keydown.shift.pageup": u,
          "keydown.pagedown": b,
          "keydown.shift.pagedown": d
        }
      }
    ]), (c, T) => c.readonly ? ue("", !0) : (f(), h("div", {
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
            onClick: g,
            tabindex: -1
          }, "<"),
          i("th", st, k(ge.value), 1),
          i("td", {
            onClick: b,
            tabindex: -1
          }, ">")
        ]),
        (f(), h(V, null, x(rt, (v) => i("tr", { key: v }, [
          (f(), h(V, null, x(I, (w) => i("td", {
            key: (v - 1) * I + w,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            style: Ie({
              border: _(r.value[(v - 1) * I + w]) ? "2px solid var(--focus-cell-outline)" : "none",
              borderBottomColor: m(r.value[(v - 1) * I + w]) ? "var(--focus-cell-outline)" : "none"
            }),
            onClick: Me((ye) => he(ye, (v - 1) * I + w), ["prevent", "stop"]),
            class: B({
              todaysdate: m(r.value[(v - 1) * I + w]),
              selecteddate: _(r.value[(v - 1) * I + w])
            })
          }, k(new Date(r.value[(v - 1) * I + w]).getDate()), 15, at)), 64))
        ])), 64))
      ])
    ], 8, lt));
  }
}), ut = /* @__PURE__ */ M(it, [["__scopeId", "data-v-e52e7ee9"]]), dt = D({
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
}), ct = { class: "input-wrapper" }, pt = {
  id: "autocomplete-results",
  class: "autocomplete-results"
}, ft = {
  key: 0,
  class: "loading autocomplete-result"
}, mt = ["onClick"];
function ht(e, t, n, o, l, s) {
  return f(), h("div", {
    class: B(["autocomplete", { isOpen: e.isOpen }])
  }, [
    i("div", ct, [
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
      C(i("ul", pt, [
        e.isLoading ? (f(), h("li", ft, "Loading results...")) : (f(!0), h(V, { key: 1 }, x(e.results, (a, r) => (f(), h("li", {
          key: r,
          onClick: (p) => e.setResult(a),
          class: B(["autocomplete-result", { "is-active": r === e.arrowCounter }])
        }, k(a), 11, mt))), 128))
      ], 512), [
        [O, e.isOpen]
      ]),
      i("label", null, k(e.label), 1)
    ])
  ], 2);
}
const vt = /* @__PURE__ */ M(dt, [["render", ht]]), gt = /* @__PURE__ */ D({
  __name: "CollapseButton",
  props: {
    collapsed: { type: Boolean }
  },
  setup(e) {
    return (t, n) => (f(), h("button", {
      class: B(["collapse-button", t.collapsed ? "rotated" : "unrotated"])
    }, "×", 2));
  }
}), yt = /* @__PURE__ */ M(gt, [["__scopeId", "data-v-fa78c7f7"]]), bt = /* @__PURE__ */ D({
  __name: "AForm",
  props: {
    modelValue: {},
    data: {},
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = t, l = y(n.data || {}), s = (r) => {
      let p = {};
      for (const [u, d] of Object.entries(r))
        ["component", "fieldtype"].includes(u) || (p[u] = d), u === "rows" && d && d.length === 0 && (p.rows = l.value[r.fieldname]);
      return p;
    }, a = L({
      get: () => n.modelValue.map((r, p) => L({
        get() {
          return r.value;
        },
        set: (u) => {
          n.modelValue[p].value = u, o("update:modelValue", n.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (r, p) => (f(), h("form", null, [
      (f(!0), h(V, null, x(r.modelValue, (u, d) => (f(), H(Te(u.component), _e({
        key: d,
        schema: u,
        modelValue: a.value[d].value,
        "onUpdate:modelValue": (g) => a.value[d].value = g,
        data: l.value[u.fieldname],
        readonly: r.readonly
      }, s(u)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
}), me = /* @__PURE__ */ M(bt, [["__scopeId", "data-v-e5beaceb"]]), wt = /* @__PURE__ */ D({
  __name: "AFieldset",
  props: {
    schema: {},
    label: {},
    collapsible: { type: Boolean },
    data: {}
  },
  setup(e) {
    const t = e, n = y(t.data || []);
    let o = y(!1), l = y(t.collapsible);
    const s = y(t.schema);
    function a(r) {
      r.preventDefault(), l.value && (o.value = !o.value);
    }
    return (r, p) => (f(), h("fieldset", null, [
      i("legend", {
        onClick: a,
        onSubmit: a
      }, [
        Se(k(r.label) + " ", 1),
        S(l) ? (f(), H(yt, {
          key: 0,
          collapsed: S(o)
        }, null, 8, ["collapsed"])) : ue("", !0)
      ], 32),
      Oe(r.$slots, "default", { collapsed: S(o) }, () => [
        C($e(me, {
          modelValue: s.value,
          "onUpdate:modelValue": p[0] || (p[0] = (u) => s.value = u),
          data: n.value
        }, null, 8, ["modelValue", "data"]), [
          [O, !S(o)]
        ])
      ], !0)
    ]));
  }
}), Ct = /* @__PURE__ */ M(wt, [["__scopeId", "data-v-f3ee8077"]]), kt = ["id", "disabled", "required"], Dt = ["for"], Et = ["innerHTML"], At = /* @__PURE__ */ D({
  __name: "ANumericInput",
  props: /* @__PURE__ */ se({
    label: {},
    required: { type: Boolean },
    readonly: { type: Boolean },
    uuid: {},
    validation: { default: () => ({ errorMessage: "&nbsp;" }) }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = ae(e, "modelValue");
    return (n, o) => (f(), h("div", null, [
      C(i("input", {
        "onUpdate:modelValue": o[0] || (o[0] = (l) => t.value = l),
        type: "number",
        id: n.uuid,
        disabled: n.readonly,
        required: n.required
      }, null, 8, kt), [
        [R, t.value]
      ]),
      i("label", { for: n.uuid }, k(n.label), 9, Dt),
      C(i("p", {
        innerHTML: n.validation.errorMessage
      }, null, 8, Et), [
        [O, n.validation.errorMessage]
      ])
    ]));
  }
}), It = /* @__PURE__ */ M(At, [["__scopeId", "data-v-5389ec31"]]), le = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function Mt(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function Tt(e) {
  var n;
  let t = e.value;
  if (t) {
    const o = Mt(t);
    if (o) {
      const l = e.instance.locale;
      t = o(l);
    }
  } else {
    const l = (n = e.instance.schema.fieldtype) == null ? void 0 : n.toLowerCase();
    l && le[l] && (t = le[l]);
  }
  return t;
}
function _t(e, t) {
  t || (t = "#");
  let n = e;
  const o = [t, "/", "-", "(", ")", " "];
  for (const l of o)
    n = n.replaceAll(l, "");
  return n;
}
function St(e, t, n) {
  n || (n = "#");
  let o = t;
  for (const l of e) {
    const s = o.indexOf(n);
    if (s !== -1) {
      const a = o.substring(0, s), r = o.substring(s + 1);
      o = a + l + r;
    }
  }
  return o.slice(0, t.length);
}
function Ot(e, t) {
  const n = Tt(t);
  if (!n)
    return;
  const o = "#", l = e.value, s = _t(l, o);
  if (s) {
    const a = St(s, n, o);
    t.instance.maskFilled && (t.instance.maskFilled = !a.includes(o)), e.value = a;
  } else
    e.value = n;
}
const $t = D({
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
    const n = y(!1), o = ie("locale", "");
    return { inputText: L({
      get() {
        return e.modelValue;
      },
      set(s) {
        t.emit("update:modelValue", s);
      }
    }), locale: o, maskFilled: n };
  },
  directives: {
    mask: Ot
  }
}), Lt = ["id", "disabled", "maxlength", "required"], Vt = ["for"], xt = ["innerHTML"];
function Bt(e, t, n, o, l, s) {
  const a = Le("mask");
  return f(), h("div", null, [
    C(i("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.inputText = r),
      id: e.uuid,
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required
    }, null, 8, Lt), [
      [R, e.inputText],
      [a, e.mask]
    ]),
    i("label", { for: e.uuid }, k(e.label), 9, Vt),
    C(i("p", {
      innerHTML: e.validation.errorMessage
    }, null, 8, xt), [
      [O, e.validation.errorMessage]
    ])
  ]);
}
const Pt = /* @__PURE__ */ M($t, [["render", Bt], ["__scopeId", "data-v-083a37fb"]]);
function Ht(e) {
  e.component("ACheckbox", Fe), e.component("ACombobox", Ue), e.component("ADate", ut), e.component("ADropdown", vt), e.component("AFieldset", Ct), e.component("AForm", me), e.component("ANumericInput", It), e.component("ATextInput", Pt);
}
export {
  Fe as ACheckbox,
  Ue as AComboBox,
  ut as ADate,
  vt as ADropdown,
  Ct as AFieldset,
  me as AForm,
  It as ANumericInput,
  Pt as ATextInput,
  Ht as install
};
//# sourceMappingURL=aform.js.map
