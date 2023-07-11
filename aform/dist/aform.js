import { defineComponent as D, computed as T, openBlock as d, createElementBlock as v, createElementVNode as i, withDirectives as C, isRef as ae, vModelCheckbox as be, unref as y, toDisplayString as k, vShow as S, resolveComponent as we, createBlock as H, withCtx as _e, onMounted as re, onBeforeUnmount as Ce, ref as g, watch as R, getCurrentScope as ke, onScopeDispose as De, inject as ie, nextTick as Ae, Fragment as $, renderList as L, normalizeStyle as Ee, withModifiers as Ie, normalizeClass as V, createCommentVNode as ue, withKeys as B, vModelText as U, resolveDynamicComponent as xe, mergeProps as Me, createTextVNode as Te, renderSlot as Se, createVNode as Oe, resolveDirective as $e } from "vue";
const Le = { id: "checkbox-container" }, Ve = ["id", "readonly", "required"], Be = { id: "custom-checkbox" }, Pe = ["for"], qe = ["innerHTML"], Fe = /* @__PURE__ */ D({
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
    const o = e, n = T({
      get() {
        return o.value;
      },
      set(l) {
        t("update:value", l);
      }
    });
    return (l, s) => (d(), v("div", null, [
      i("label", Le, [
        C(i("input", {
          "onUpdate:modelValue": s[0] || (s[0] = (a) => ae(n) ? n.value = a : null),
          type: "checkbox",
          id: e.uuid,
          class: "checkbox",
          readonly: e.readOnly,
          required: e.required
        }, null, 8, Ve), [
          [be, y(n)]
        ]),
        i("span", Be, k(y(n)), 1)
      ]),
      i("label", {
        for: e.uuid,
        id: "checkbox-label"
      }, k(e.label), 9, Pe),
      C(i("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, qe), [
        [S, e.validation.errorMessage]
      ])
    ]));
  }
});
const I = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [n, l] of t)
    o[n] = l;
  return o;
}, He = /* @__PURE__ */ I(Fe, [["__scopeId", "data-v-743cd4db"]]), Re = /* @__PURE__ */ i("div", null, [
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" })
], -1), Ue = /* @__PURE__ */ D({
  __name: "AComboBox",
  props: ["event", "cellData", "tableID"],
  setup(e) {
    return (t, o) => {
      const n = we("ATableModal");
      return d(), H(n, {
        event: e.event,
        cellData: e.cellData,
        class: "amodal"
      }, {
        default: _e(() => [
          Re
        ]),
        _: 1
      }, 8, ["event", "cellData"]);
    };
  }
});
var G;
const ce = typeof window < "u", Qe = (e) => typeof e == "string", Ye = () => {
};
ce && (G = window == null ? void 0 : window.navigator) != null && G.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function de(e) {
  return typeof e == "function" ? e() : y(e);
}
function je(e) {
  return e;
}
function Ne(e) {
  return ke() ? (De(e), !0) : !1;
}
function P(e) {
  var t;
  const o = de(e);
  return (t = o == null ? void 0 : o.$el) != null ? t : o;
}
const pe = ce ? window : void 0;
function We(...e) {
  let t, o, n, l;
  if (Qe(e[0]) || Array.isArray(e[0]) ? ([o, n, l] = e, t = pe) : [t, o, n, l] = e, !t)
    return Ye;
  Array.isArray(o) || (o = [o]), Array.isArray(n) || (n = [n]);
  const s = [], a = () => {
    s.forEach((f) => f()), s.length = 0;
  }, r = (f, w, b, p) => (f.addEventListener(w, b, p), () => f.removeEventListener(w, b, p)), u = R(() => [P(t), de(l)], ([f, w]) => {
    a(), f && s.push(...o.flatMap((b) => n.map((p) => r(f, b, p, w))));
  }, { immediate: !0, flush: "post" }), c = () => {
    u(), a();
  };
  return Ne(c), c;
}
const q = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, F = "__vueuse_ssr_handlers__";
q[F] = q[F] || {};
q[F];
function ze(e, { window: t = pe, scrollTarget: o } = {}) {
  const n = g(!1), l = () => {
    if (!t)
      return;
    const s = t.document, a = P(e);
    if (!a)
      n.value = !1;
    else {
      const r = a.getBoundingClientRect();
      n.value = r.top <= (t.innerHeight || s.documentElement.clientHeight) && r.left <= (t.innerWidth || s.documentElement.clientWidth) && r.bottom >= 0 && r.right >= 0;
    }
  };
  return R(() => P(e), () => l(), { immediate: !0, flush: "post" }), t && We(o || t, "scroll", l, {
    capture: !1,
    passive: !0
  }), n;
}
var K;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(K || (K = {}));
var Ge = Object.defineProperty, J = Object.getOwnPropertySymbols, Ke = Object.prototype.hasOwnProperty, Je = Object.prototype.propertyIsEnumerable, X = (e, t, o) => t in e ? Ge(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o, Xe = (e, t) => {
  for (var o in t || (t = {}))
    Ke.call(t, o) && X(e, o, t[o]);
  if (J)
    for (var o of J(t))
      Je.call(t, o) && X(e, o, t[o]);
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
const A = (e) => {
  let t = ze(e).value;
  return t = t && e.offsetHeight > 0, t;
}, E = (e) => e.tabIndex >= 0, Z = (e) => {
  const t = e.target;
  return Q(t);
}, Q = (e) => {
  var t;
  let o;
  if (e instanceof HTMLTableCellElement) {
    const n = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    if (n) {
      const l = Array.from(n.children)[e.cellIndex];
      l && (o = l);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const n = e.previousElementSibling;
    n && (o = n);
  }
  return o && (!E(o) || !A(o)) ? Q(o) : o;
}, et = (e) => {
  var t;
  const o = e.target;
  let n;
  if (o instanceof HTMLTableCellElement) {
    const l = (t = o.parentElement) == null ? void 0 : t.parentElement;
    if (l) {
      const s = l.firstElementChild.children[o.cellIndex];
      s && (n = s);
    }
  } else if (o instanceof HTMLTableRowElement) {
    const l = o.parentElement;
    if (l) {
      const s = l.firstElementChild;
      s && (n = s);
    }
  }
  return n && (!E(n) || !A(n)) ? Y(n) : n;
}, ee = (e) => {
  const t = e.target;
  return Y(t);
}, Y = (e) => {
  var t;
  let o;
  if (e instanceof HTMLTableCellElement) {
    const n = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    if (n) {
      const l = Array.from(n.children)[e.cellIndex];
      l && (o = l);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const n = e.nextElementSibling;
    n && (o = n);
  }
  return o && (!E(o) || !A(o)) ? Y(o) : o;
}, tt = (e) => {
  var t;
  const o = e.target;
  let n;
  if (o instanceof HTMLTableCellElement) {
    const l = (t = o.parentElement) == null ? void 0 : t.parentElement;
    if (l) {
      const s = l.lastElementChild.children[o.cellIndex];
      s && (n = s);
    }
  } else if (o instanceof HTMLTableRowElement) {
    const l = o.parentElement;
    if (l) {
      const s = l.lastElementChild;
      s && (n = s);
    }
  }
  return n && (!E(n) || !A(n)) ? Q(n) : n;
}, te = (e) => {
  const t = e.target;
  return j(t);
}, j = (e) => {
  var t;
  let o;
  if (e.previousElementSibling)
    o = e.previousElementSibling;
  else {
    const n = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    o = n == null ? void 0 : n.lastElementChild;
  }
  return o && (!E(o) || !A(o)) ? j(o) : o;
}, ne = (e) => {
  const t = e.target;
  return N(t);
}, N = (e) => {
  var t;
  let o;
  if (e.nextElementSibling)
    o = e.nextElementSibling;
  else {
    const n = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    o = n == null ? void 0 : n.firstElementChild;
  }
  return o && (!E(o) || !A(o)) ? N(o) : o;
}, oe = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!E(t) || !A(t)) ? N(t) : t;
}, le = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!E(t) || !A(t)) ? j(t) : t;
}, O = ["alt", "control", "shift", "meta"], nt = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, fe = {
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
    const t = et(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = tt(e);
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
function ot(e) {
  const t = (n) => {
    let l = null;
    n.parent && (typeof n.parent == "string" ? l = document.querySelector(n.parent) : n.parent instanceof Element ? l = n.parent : l = n.parent.value);
    let s = [];
    if (n.selectors)
      if (typeof n.selectors == "string")
        s = l ? Array.from(l.querySelectorAll(n.selectors)) : Array.from(document.querySelectorAll(n.selectors));
      else if (n.selectors instanceof Element)
        s.push(n.selectors);
      else if (Array.isArray(n.selectors.value))
        for (const a of n.selectors.value)
          a instanceof Element ? s.push(a) : s.push(a.$el);
      else
        s.push(n.selectors.value);
    else
      s = Array.from(l.children).filter((a) => E(a) && A(a));
    return s;
  }, o = (n) => (l) => {
    const s = nt[l.key] || l.key.toLowerCase();
    if (O.includes(s))
      return;
    const a = n.handlers || fe;
    for (const r of Object.keys(a)) {
      const [u, ...c] = r.split(".");
      if (u === "keydown" && c.includes(s)) {
        const f = a[r], w = c.filter((p) => O.includes(p)), b = O.some((p) => {
          const M = p.charAt(0).toUpperCase() + p.slice(1);
          return l.getModifierState(M);
        });
        if (w.length > 0) {
          if (b) {
            for (const p of O)
              if (c.includes(p)) {
                const M = p.charAt(0).toUpperCase() + p.slice(1);
                l.getModifierState(M) && f(l);
              }
          }
        } else
          b || f(l);
      }
    }
  };
  re(() => {
    for (const n of e) {
      const l = t(n);
      for (const s of l)
        s.addEventListener("keydown", o(n));
    }
  }), Ce(() => {
    for (const n of e) {
      const l = t(n);
      for (const s of l)
        s.removeEventListener("keydown", o(n));
    }
  });
}
const lt = ["event", "colIndex", "rowIndex", "tableid"], st = { colspan: "5" }, at = ["onClick"], rt = /* @__PURE__ */ D({
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
    const t = e, o = ie(t.tableid), n = 6, l = 7, s = new Date(), a = g(), r = g(), u = g(), c = g([]);
    re(async () => {
      let m = o.cellData(t.colIndex, t.rowIndex);
      m ? (m instanceof Date || (m = new Date(m)), a.value = m, r.value = a.value.getMonth(), u.value = a.value.getFullYear()) : (r.value = s.getMonth(), u.value = s.getFullYear()), f(), await Ae();
      const x = document.getElementsByClassName("selecteddate");
      if (x.length > 0)
        x[0].focus();
      else {
        const h = document.getElementsByClassName("todaysdate");
        h.length > 0 && h[0].focus();
      }
    }), R([r, u], () => {
      f();
    });
    const f = () => {
      c.value = [];
      const m = new Date(u.value, r.value, 1), x = m.getDay(), h = m.setDate(m.getDate() - x);
      for (let _ of Array(43).keys())
        c.value.push(h + _ * 864e5);
    }, w = () => {
      u.value -= 1;
    }, b = () => {
      u.value += 1;
    }, p = () => {
      r.value == 0 ? (r.value = 11, w()) : r.value -= 1;
    }, M = () => {
      r.value == 11 ? (r.value = 0, b()) : r.value += 1;
    }, W = (m) => {
      if (r.value === s.getMonth())
        return s.toDateString() === new Date(m).toDateString();
    }, z = (m) => new Date(m).toDateString() === new Date(a.value).toDateString(), ve = (m, x) => {
      a.value = new Date(c.value[x]), he();
    }, he = () => {
      o.setCellData(t.rowIndex, t.colIndex, a.value.getTime());
    }, ye = T(() => new Date(u.value, r.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return ot([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...fe,
          "keydown.pageup": p,
          "keydown.shift.pageup": w,
          "keydown.pagedown": M,
          "keydown.shift.pagedown": b
        }
      }
    ]), (m, x) => e.readonly ? ue("", !0) : (d(), v("div", {
      key: 0,
      event: e.event,
      colIndex: e.colIndex,
      rowIndex: e.rowIndex,
      tableid: e.tableid,
      class: "adate",
      tabindex: "0",
      ref: "adatepicker"
    }, [
      i("table", null, [
        i("tr", null, [
          i("td", {
            onClick: p,
            tabindex: -1
          }, "<"),
          i("th", st, k(y(ye)), 1),
          i("td", {
            onClick: M,
            tabindex: -1
          }, ">")
        ]),
        (d(), v($, null, L(n, (h) => i("tr", { key: h }, [
          (d(), v($, null, L(l, (_) => i("td", {
            key: (h - 1) * l + _,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            style: Ee({
              border: z(c.value[(h - 1) * l + _]) ? "2px solid var(--focus-cell-outline)" : "none",
              borderBottomColor: W(c.value[(h - 1) * l + _]) ? "var(--focus-cell-outline)" : "none"
            }),
            onClick: Ie((ge) => ve(ge, (h - 1) * l + _), ["prevent", "stop"]),
            class: V({
              todaysdate: W(c.value[(h - 1) * l + _]),
              selecteddate: z(c.value[(h - 1) * l + _])
            })
          }, k(new Date(c.value[(h - 1) * l + _]).getDate()), 15, at)), 64))
        ])), 64))
      ])
    ], 8, lt));
  }
});
const it = /* @__PURE__ */ I(rt, [["__scopeId", "data-v-fcdc102d"]]), ut = D({
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
const ct = { class: "input-wrapper" }, dt = {
  id: "autocomplete-results",
  class: "autocomplete-results"
}, pt = {
  key: 0,
  class: "loading autocomplete-result"
}, ft = ["onClick"];
function mt(e, t, o, n, l, s) {
  return d(), v("div", {
    class: V(["autocomplete", { isOpen: e.isOpen }])
  }, [
    i("div", ct, [
      C(i("input", {
        ref: "mopInput",
        type: "text",
        onInput: t[0] || (t[0] = (...a) => e.onChange && e.onChange(...a)),
        onFocus: t[1] || (t[1] = (...a) => e.onChange && e.onChange(...a)),
        "onUpdate:modelValue": t[2] || (t[2] = (a) => e.search = a),
        onKeydown: [
          t[3] || (t[3] = B((...a) => e.onArrowDown && e.onArrowDown(...a), ["down"])),
          t[4] || (t[4] = B((...a) => e.onArrowUp && e.onArrowUp(...a), ["up"])),
          t[5] || (t[5] = B((...a) => e.onEnter && e.onEnter(...a), ["enter"]))
        ]
      }, null, 544), [
        [U, e.search]
      ]),
      C(i("ul", dt, [
        e.isLoading ? (d(), v("li", pt, "Loading results...")) : (d(!0), v($, { key: 1 }, L(e.results, (a, r) => (d(), v("li", {
          key: r,
          onClick: (u) => e.setResult(a),
          class: V(["autocomplete-result", { "is-active": r === e.arrowCounter }])
        }, k(a), 11, ft))), 128))
      ], 512), [
        [S, e.isOpen]
      ]),
      i("label", null, k(e.label), 1)
    ])
  ], 2);
}
const vt = /* @__PURE__ */ I(ut, [["render", mt]]), ht = /* @__PURE__ */ D({
  __name: "CollapseButton",
  props: {
    collapsed: { type: Boolean }
  },
  setup(e) {
    return (t, o) => (d(), v("button", {
      class: V(["collapse-button", e.collapsed ? "rotated" : "unrotated"])
    }, "×", 2));
  }
});
const yt = /* @__PURE__ */ I(ht, [["__scopeId", "data-v-6f1c1b45"]]), gt = /* @__PURE__ */ D({
  __name: "AForm",
  props: {
    modelValue: null,
    data: null,
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const o = e, n = g(o.data || {}), l = (a) => {
      let r = {};
      for (const [u, c] of Object.entries(a))
        ["component", "fieldtype"].includes(u) || (r[u] = c), u === "rows" && c && c.length === 0 && (r.rows = n.value[a.fieldname]);
      return r;
    }, s = T({
      get: () => o.modelValue.map((a, r) => T({
        get() {
          return a.value;
        },
        set: (u) => {
          o.modelValue[r].value = u, t("update:modelValue", o.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (a, r) => (d(), v("form", null, [
      (d(!0), v($, null, L(e.modelValue, (u, c) => (d(), H(xe(u.component), Me({
        key: c,
        schema: u,
        modelValue: y(s)[c].value,
        "onUpdate:modelValue": (f) => y(s)[c].value = f,
        data: n.value[u.fieldname],
        readonly: e.readonly
      }, l(u)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
});
const me = /* @__PURE__ */ I(gt, [["__scopeId", "data-v-74d66cf2"]]), bt = /* @__PURE__ */ D({
  __name: "AFieldset",
  props: {
    schema: null,
    label: null,
    collapsible: { type: Boolean },
    data: null
  },
  setup(e) {
    const t = e, o = g(t.data || []);
    let n = g(!1), l = g(t.collapsible);
    const s = g(t.schema);
    function a(r) {
      r.preventDefault(), l.value && (n.value = !n.value);
    }
    return (r, u) => (d(), v("fieldset", null, [
      i("legend", {
        onClick: a,
        onSubmit: a
      }, [
        Te(k(e.label) + " ", 1),
        y(l) ? (d(), H(yt, {
          key: 0,
          collapsed: y(n)
        }, null, 8, ["collapsed"])) : ue("", !0)
      ], 32),
      Se(r.$slots, "default", { collapsed: y(n) }, () => [
        C(Oe(me, {
          modelValue: s.value,
          "onUpdate:modelValue": u[0] || (u[0] = (c) => s.value = c),
          data: o.value
        }, null, 8, ["modelValue", "data"]), [
          [S, !y(n)]
        ])
      ], !0)
    ]));
  }
});
const wt = /* @__PURE__ */ I(bt, [["__scopeId", "data-v-cad9b578"]]), _t = ["id", "disabled", "required"], Ct = ["for"], kt = ["innerHTML"], Dt = /* @__PURE__ */ D({
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
    const o = e, n = T({
      get: () => o.modelValue,
      set: (l) => {
        t("update:modelValue", l);
      }
    });
    return (l, s) => (d(), v("div", null, [
      C(i("input", {
        "onUpdate:modelValue": s[0] || (s[0] = (a) => ae(n) ? n.value = a : null),
        type: "number",
        id: e.uuid,
        disabled: e.readonly,
        required: e.required
      }, null, 8, _t), [
        [U, y(n)]
      ]),
      i("label", { for: e.uuid }, k(e.label), 9, Ct),
      C(i("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, kt), [
        [S, e.validation.errorMessage]
      ])
    ]));
  }
});
const At = /* @__PURE__ */ I(Dt, [["__scopeId", "data-v-be33e6c4"]]), se = {
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
function It(e) {
  var o;
  let t = e.value;
  if (t) {
    const n = Et(t);
    if (n) {
      const l = e.instance.locale;
      t = n(l);
    }
  } else {
    const l = (o = e.instance.schema.fieldtype) == null ? void 0 : o.toLowerCase();
    l && se[l] && (t = se[l]);
  }
  return t;
}
function xt(e, t) {
  t || (t = "#");
  let o = e;
  const n = [t, "/", "-", "(", ")", " "];
  for (const l of n)
    o = o.replaceAll(l, "");
  return o;
}
function Mt(e, t, o) {
  o || (o = "#");
  let n = t;
  for (const l of e) {
    const s = n.indexOf(o);
    if (s !== -1) {
      const a = n.substring(0, s), r = n.substring(s + 1);
      n = a + l + r;
    }
  }
  return n.slice(0, t.length);
}
function Tt(e, t) {
  const o = It(t);
  if (!o)
    return;
  const n = "#", l = e.value, s = xt(l, n);
  if (s) {
    const a = Mt(s, o, n);
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
    const o = g(!1), n = ie("locale", "");
    return { inputText: T({
      get() {
        return e.modelValue;
      },
      set(s) {
        t.emit("update:modelValue", s);
      }
    }), locale: n, maskFilled: o };
  },
  directives: {
    mask: Tt
  }
});
const Ot = ["id", "disabled", "maxlength", "required"], $t = ["for"], Lt = ["innerHTML"];
function Vt(e, t, o, n, l, s) {
  const a = $e("mask");
  return d(), v("div", null, [
    C(i("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.inputText = r),
      id: e.uuid,
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required
    }, null, 8, Ot), [
      [U, e.inputText],
      [a, e.mask]
    ]),
    i("label", { for: e.uuid }, k(e.label), 9, $t),
    C(i("p", {
      innerHTML: e.validation.errorMessage
    }, null, 8, Lt), [
      [S, e.validation.errorMessage]
    ])
  ]);
}
const Bt = /* @__PURE__ */ I(St, [["render", Vt], ["__scopeId", "data-v-76dba9b8"]]);
function qt(e) {
  e.component("ACheckbox", He), e.component("ACombobox", Ue), e.component("ADate", it), e.component("ADropdown", vt), e.component("AFieldset", wt), e.component("AForm", me), e.component("ANumericInput", At), e.component("ATextInput", Bt);
}
export {
  He as ACheckbox,
  Ue as AComboBox,
  it as ADate,
  vt as ADropdown,
  wt as AFieldset,
  me as AForm,
  At as ANumericInput,
  Bt as ATextInput,
  qt as install
};
//# sourceMappingURL=aform.js.map
