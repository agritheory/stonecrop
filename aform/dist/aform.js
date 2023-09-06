import { defineComponent as k, computed as T, openBlock as m, createElementBlock as y, createElementVNode as u, withDirectives as A, vModelCheckbox as De, toDisplayString as D, vShow as B, resolveComponent as ke, createBlock as W, withCtx as Ce, onMounted as j, onBeforeUnmount as Ae, ref as _, watch as q, unref as L, getCurrentScope as Ee, onScopeDispose as Ie, inject as pe, nextTick as fe, Fragment as O, renderList as x, normalizeStyle as me, withModifiers as ve, normalizeClass as V, createCommentVNode as he, withKeys as Y, vModelText as z, pushScopeId as Me, popScopeId as Se, resolveDynamicComponent as $e, mergeProps as Te, createTextVNode as Oe, renderSlot as xe, createVNode as Le, resolveDirective as Ve } from "vue";
const Be = { id: "checkbox-container" }, Pe = ["id", "readonly", "required"], Fe = { id: "custom-checkbox" }, qe = ["for"], He = ["innerHTML"], Re = /* @__PURE__ */ k({
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
    const o = e, n = t, a = T({
      get() {
        return o.value;
      },
      set(l) {
        n("update:value", l);
      }
    });
    return (l, s) => (m(), y("div", null, [
      u("label", Be, [
        A(u("input", {
          "onUpdate:modelValue": s[0] || (s[0] = (r) => a.value = r),
          type: "checkbox",
          id: l.uuid,
          class: "checkbox",
          readonly: l.readOnly,
          required: l.required
        }, null, 8, Pe), [
          [De, a.value]
        ]),
        u("span", Fe, D(a.value), 1)
      ]),
      u("label", {
        for: l.uuid,
        id: "checkbox-label"
      }, D(l.label), 9, qe),
      A(u("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, He), [
        [B, l.validation.errorMessage]
      ])
    ]));
  }
});
const E = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [n, a] of t)
    o[n] = a;
  return o;
}, Ue = /* @__PURE__ */ E(Re, [["__scopeId", "data-v-743cd4db"]]), Ye = /* @__PURE__ */ u("div", null, [
  /* @__PURE__ */ u("input", { type: "text" }),
  /* @__PURE__ */ u("input", { type: "text" }),
  /* @__PURE__ */ u("input", { type: "text" })
], -1), Qe = /* @__PURE__ */ k({
  __name: "AComboBox",
  props: ["event", "cellData", "tableID"],
  setup(e) {
    return (t, o) => {
      const n = ke("ATableModal");
      return m(), W(n, {
        event: e.event,
        cellData: e.cellData,
        class: "amodal"
      }, {
        default: Ce(() => [
          Ye
        ]),
        _: 1
      }, 8, ["event", "cellData"]);
    };
  }
});
var N;
const ye = typeof window < "u", We = (e) => typeof e == "string", je = () => {
};
ye && (N = window == null ? void 0 : window.navigator) != null && N.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function ge(e) {
  return typeof e == "function" ? e() : L(e);
}
function ze(e) {
  return e;
}
function Ge(e) {
  return Ee() ? (Ie(e), !0) : !1;
}
function Q(e) {
  var t;
  const o = ge(e);
  return (t = o == null ? void 0 : o.$el) != null ? t : o;
}
const _e = ye ? window : void 0;
function Ke(...e) {
  let t, o, n, a;
  if (We(e[0]) || Array.isArray(e[0]) ? ([o, n, a] = e, t = _e) : [t, o, n, a] = e, !t)
    return je;
  Array.isArray(o) || (o = [o]), Array.isArray(n) || (n = [n]);
  const l = [], s = () => {
    l.forEach((f) => f()), l.length = 0;
  }, r = (f, b, w, v) => (f.addEventListener(b, w, v), () => f.removeEventListener(b, w, v)), d = q(() => [Q(t), ge(a)], ([f, b]) => {
    s(), f && l.push(...o.flatMap((w) => n.map((v) => r(f, w, v, b))));
  }, { immediate: !0, flush: "post" }), p = () => {
    d(), s();
  };
  return Ge(p), p;
}
const ee = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, te = "__vueuse_ssr_handlers__";
ee[te] = ee[te] || {};
function Je(e, { window: t = _e, scrollTarget: o } = {}) {
  const n = _(!1), a = () => {
    if (!t)
      return;
    const l = t.document, s = Q(e);
    if (!s)
      n.value = !1;
    else {
      const r = s.getBoundingClientRect();
      n.value = r.top <= (t.innerHeight || l.documentElement.clientHeight) && r.left <= (t.innerWidth || l.documentElement.clientWidth) && r.bottom >= 0 && r.right >= 0;
    }
  };
  return q(() => Q(e), () => a(), { immediate: !0, flush: "post" }), t && Ke(o || t, "scroll", a, {
    capture: !1,
    passive: !0
  }), n;
}
var ne;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(ne || (ne = {}));
var Xe = Object.defineProperty, oe = Object.getOwnPropertySymbols, Ze = Object.prototype.hasOwnProperty, Ne = Object.prototype.propertyIsEnumerable, le = (e, t, o) => t in e ? Xe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o, et = (e, t) => {
  for (var o in t || (t = {}))
    Ze.call(t, o) && le(e, o, t[o]);
  if (oe)
    for (var o of oe(t))
      Ne.call(t, o) && le(e, o, t[o]);
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
const I = (e) => {
  let t = Je(e).value;
  return t = t && e.offsetHeight > 0, t;
}, M = (e) => e.tabIndex >= 0, ae = (e) => {
  const t = e.target;
  return G(t);
}, G = (e) => {
  var t;
  let o;
  if (e instanceof HTMLTableCellElement) {
    const n = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    if (n) {
      const a = Array.from(n.children)[e.cellIndex];
      a && (o = a);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const n = e.previousElementSibling;
    n && (o = n);
  }
  return o && (!M(o) || !I(o)) ? G(o) : o;
}, nt = (e) => {
  var t;
  const o = e.target;
  let n;
  if (o instanceof HTMLTableCellElement) {
    const a = (t = o.parentElement) == null ? void 0 : t.parentElement;
    if (a) {
      const l = a.firstElementChild.children[o.cellIndex];
      l && (n = l);
    }
  } else if (o instanceof HTMLTableRowElement) {
    const a = o.parentElement;
    if (a) {
      const l = a.firstElementChild;
      l && (n = l);
    }
  }
  return n && (!M(n) || !I(n)) ? K(n) : n;
}, se = (e) => {
  const t = e.target;
  return K(t);
}, K = (e) => {
  var t;
  let o;
  if (e instanceof HTMLTableCellElement) {
    const n = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    if (n) {
      const a = Array.from(n.children)[e.cellIndex];
      a && (o = a);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const n = e.nextElementSibling;
    n && (o = n);
  }
  return o && (!M(o) || !I(o)) ? K(o) : o;
}, ot = (e) => {
  var t;
  const o = e.target;
  let n;
  if (o instanceof HTMLTableCellElement) {
    const a = (t = o.parentElement) == null ? void 0 : t.parentElement;
    if (a) {
      const l = a.lastElementChild.children[o.cellIndex];
      l && (n = l);
    }
  } else if (o instanceof HTMLTableRowElement) {
    const a = o.parentElement;
    if (a) {
      const l = a.lastElementChild;
      l && (n = l);
    }
  }
  return n && (!M(n) || !I(n)) ? G(n) : n;
}, re = (e) => {
  const t = e.target;
  return J(t);
}, J = (e) => {
  var t;
  let o;
  if (e.previousElementSibling)
    o = e.previousElementSibling;
  else {
    const n = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    o = n == null ? void 0 : n.lastElementChild;
  }
  return o && (!M(o) || !I(o)) ? J(o) : o;
}, ue = (e) => {
  const t = e.target;
  return X(t);
}, X = (e) => {
  var t;
  let o;
  if (e.nextElementSibling)
    o = e.nextElementSibling;
  else {
    const n = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    o = n == null ? void 0 : n.firstElementChild;
  }
  return o && (!M(o) || !I(o)) ? X(o) : o;
}, ie = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!M(t) || !I(t)) ? X(t) : t;
}, ce = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!M(t) || !I(t)) ? J(t) : t;
}, F = ["alt", "control", "shift", "meta"], lt = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, Z = {
  "keydown.up": (e) => {
    const t = ae(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.down": (e) => {
    const t = se(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.left": (e) => {
    const t = re(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.right": (e) => {
    const t = ue(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.control.up": (e) => {
    const t = nt(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = ot(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.left": (e) => {
    const t = ie(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.right": (e) => {
    const t = ce(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.end": (e) => {
    const t = ce(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = se(e);
      t && t.focus();
    }
  },
  "keydown.shift.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = ae(e);
      t && t.focus();
    }
  },
  "keydown.home": (e) => {
    const t = ie(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.tab": (e) => {
    const t = ue(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.shift.tab": (e) => {
    const t = re(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  }
};
function be(e) {
  const t = (n) => {
    let a = null;
    n.parent && (typeof n.parent == "string" ? a = document.querySelector(n.parent) : n.parent instanceof Element ? a = n.parent : a = n.parent.value);
    let l = [];
    if (n.selectors)
      if (typeof n.selectors == "string")
        l = a ? Array.from(a.querySelectorAll(n.selectors)) : Array.from(document.querySelectorAll(n.selectors));
      else if (n.selectors instanceof Element)
        l.push(n.selectors);
      else if (Array.isArray(n.selectors.value))
        for (const s of n.selectors.value)
          s instanceof Element ? l.push(s) : l.push(s.$el);
      else
        l.push(n.selectors.value);
    else
      l = Array.from(a.children).filter((s) => M(s) && I(s));
    return l;
  }, o = (n) => (a) => {
    const l = lt[a.key] || a.key.toLowerCase();
    if (F.includes(l))
      return;
    const s = n.handlers || Z;
    for (const r of Object.keys(s)) {
      const [d, ...p] = r.split(".");
      if (d === "keydown" && p.includes(l)) {
        const f = s[r], b = p.filter((v) => F.includes(v)), w = F.some((v) => {
          const C = v.charAt(0).toUpperCase() + v.slice(1);
          return a.getModifierState(C);
        });
        if (b.length > 0) {
          if (w) {
            for (const v of F)
              if (p.includes(v)) {
                const C = v.charAt(0).toUpperCase() + v.slice(1);
                a.getModifierState(C) && f(a);
              }
          }
        } else
          w || f(a);
      }
    }
  };
  j(() => {
    for (const n of e) {
      const a = t(n);
      for (const l of a)
        l.addEventListener("keydown", o(n));
    }
  }), Ae(() => {
    for (const n of e) {
      const a = t(n);
      for (const l of a)
        l.removeEventListener("keydown", o(n));
    }
  });
}
const at = ["event", "colIndex", "rowIndex", "tableid"], st = { colspan: "5" }, rt = ["onClick"], ut = 6, S = 7, it = /* @__PURE__ */ k({
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
    const t = e, o = pe(t.tableid), n = /* @__PURE__ */ new Date(), a = _(), l = _(), s = _(), r = _([]);
    j(async () => {
      let i = o.cellData(t.colIndex, t.rowIndex);
      i ? (i instanceof Date || (i = new Date(i)), a.value = i, l.value = a.value.getMonth(), s.value = a.value.getFullYear()) : (l.value = n.getMonth(), s.value = n.getFullYear()), d(), await fe();
      const g = document.getElementsByClassName("selecteddate");
      if (g.length > 0)
        g[0].focus();
      else {
        const c = document.getElementsByClassName("todaysdate");
        c.length > 0 && c[0].focus();
      }
    }), q([l, s], () => {
      d();
    });
    const d = () => {
      r.value = [];
      const i = new Date(s.value, l.value, 1), g = i.getDay(), c = i.setDate(i.getDate() - g);
      for (let h of Array(43).keys())
        r.value.push(c + h * 864e5);
    }, p = () => {
      s.value -= 1;
    }, f = () => {
      s.value += 1;
    }, b = () => {
      l.value == 0 ? (l.value = 11, p()) : l.value -= 1;
    }, w = () => {
      l.value == 11 ? (l.value = 0, f()) : l.value += 1;
    }, v = (i) => {
      if (l.value === n.getMonth())
        return n.toDateString() === new Date(i).toDateString();
    }, C = (i) => new Date(i).toDateString() === new Date(a.value).toDateString(), P = (i, g) => {
      a.value = new Date(r.value[g]), H();
    }, H = () => {
      o.setCellData(t.rowIndex, t.colIndex, a.value.getTime());
    }, R = T(() => new Date(s.value, l.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return be([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...Z,
          "keydown.pageup": b,
          "keydown.shift.pageup": p,
          "keydown.pagedown": w,
          "keydown.shift.pagedown": f
        }
      }
    ]), (i, g) => i.readonly ? he("", !0) : (m(), y("div", {
      key: 0,
      event: i.event,
      colIndex: i.colIndex,
      rowIndex: i.rowIndex,
      tableid: i.tableid,
      class: "adate",
      tabindex: "0",
      ref: "adatepicker"
    }, [
      u("table", null, [
        u("tr", null, [
          u("td", {
            onClick: b,
            tabindex: -1
          }, "<"),
          u("th", st, D(R.value), 1),
          u("td", {
            onClick: w,
            tabindex: -1
          }, ">")
        ]),
        (m(), y(O, null, x(ut, (c) => u("tr", { key: c }, [
          (m(), y(O, null, x(S, (h) => u("td", {
            key: (c - 1) * S + h,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            style: me({
              border: C(r.value[(c - 1) * S + h]) ? "2px solid var(--focus-cell-outline)" : "none",
              borderBottomColor: v(r.value[(c - 1) * S + h]) ? "var(--focus-cell-outline)" : "none"
            }),
            onClick: ve((U) => P(U, (c - 1) * S + h), ["prevent", "stop"]),
            class: V({
              todaysdate: v(r.value[(c - 1) * S + h]),
              selecteddate: C(r.value[(c - 1) * S + h])
            })
          }, D(new Date(r.value[(c - 1) * S + h]).getDate()), 15, rt)), 64))
        ])), 64))
      ])
    ], 8, at));
  }
});
const ct = /* @__PURE__ */ E(it, [["__scopeId", "data-v-169f1184"]]), dt = k({
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
const pt = { class: "input-wrapper" }, ft = {
  id: "autocomplete-results",
  class: "autocomplete-results"
}, mt = {
  key: 0,
  class: "loading autocomplete-result"
}, vt = ["onClick"];
function ht(e, t, o, n, a, l) {
  return m(), y("div", {
    class: V(["autocomplete", { isOpen: e.isOpen }])
  }, [
    u("div", pt, [
      A(u("input", {
        ref: "mopInput",
        type: "text",
        onInput: t[0] || (t[0] = (...s) => e.onChange && e.onChange(...s)),
        onFocus: t[1] || (t[1] = (...s) => e.onChange && e.onChange(...s)),
        "onUpdate:modelValue": t[2] || (t[2] = (s) => e.search = s),
        onKeydown: [
          t[3] || (t[3] = Y((...s) => e.onArrowDown && e.onArrowDown(...s), ["down"])),
          t[4] || (t[4] = Y((...s) => e.onArrowUp && e.onArrowUp(...s), ["up"])),
          t[5] || (t[5] = Y((...s) => e.onEnter && e.onEnter(...s), ["enter"]))
        ]
      }, null, 544), [
        [z, e.search]
      ]),
      A(u("ul", ft, [
        e.isLoading ? (m(), y("li", mt, "Loading results...")) : (m(!0), y(O, { key: 1 }, x(e.results, (s, r) => (m(), y("li", {
          key: r,
          onClick: (d) => e.setResult(s),
          class: V(["autocomplete-result", { "is-active": r === e.arrowCounter }])
        }, D(s), 11, vt))), 128))
      ], 512), [
        [B, e.isOpen]
      ]),
      u("label", null, D(e.label), 1)
    ])
  ], 2);
}
const yt = /* @__PURE__ */ E(dt, [["render", ht]]), gt = (e) => (Me("data-v-79400fb2"), e = e(), Se(), e), _t = ["event"], bt = { class: "adate-header" }, wt = { colspan: "5" }, Dt = /* @__PURE__ */ gt(() => /* @__PURE__ */ u("tr", { class: "adate-header" }, [
  /* @__PURE__ */ u("td", null, "M"),
  /* @__PURE__ */ u("td", null, "T"),
  /* @__PURE__ */ u("td", null, "W"),
  /* @__PURE__ */ u("td", null, "T"),
  /* @__PURE__ */ u("td", null, "F"),
  /* @__PURE__ */ u("td", null, "S"),
  /* @__PURE__ */ u("td", null, "S")
], -1)), kt = ["onClick"], Ct = 6, $ = 7, At = /* @__PURE__ */ k({
  __name: "ADatePicker",
  props: {
    value: {},
    event: {}
  },
  emits: ["update:modelValue", "selectedDate"],
  setup(e, { emit: t }) {
    const o = e, n = t, a = /* @__PURE__ */ new Date(), l = _(o.value || void 0), s = _(), r = _(), d = _([]);
    j(async () => {
      let i = /* @__PURE__ */ new Date();
      i ? (l.value = i, s.value = l.value.getMonth(), r.value = l.value.getFullYear()) : (s.value = a.getMonth(), r.value = a.getFullYear()), p(), await fe();
      const g = document.getElementsByClassName("selecteddate");
      if (g.length > 0)
        g[0].focus();
      else {
        const c = document.getElementsByClassName("todaysdate");
        c.length > 0 && c[0].focus();
      }
    }), q([s, r], () => {
      p();
    });
    const p = () => {
      d.value = [];
      const i = new Date(r.value, s.value, 1), g = i.getDay(), c = i.setDate(i.getDate() - g);
      for (let h of Array(43).keys())
        d.value.push(c + h * 864e5);
    }, f = () => {
      r.value -= 1;
    }, b = () => {
      r.value += 1;
    }, w = () => {
      s.value == 0 ? (s.value = 11, f()) : s.value -= 1;
    }, v = () => {
      s.value == 11 ? (s.value = 0, b()) : s.value += 1;
    }, C = (i) => {
      if (s.value === a.getMonth())
        return a.toDateString() === new Date(i).toDateString();
    }, P = (i) => new Date(i).toDateString() === new Date(l.value).toDateString();
    T({
      get: () => l.value,
      set: (i) => {
        n("update:modelValue", i);
      }
    });
    const H = (i, g) => {
      l.value = new Date(d.value[g]), n("selectedDate", l.value);
    }, R = T(() => new Date(r.value, s.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return be([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...Z,
          "keydown.pageup": w,
          "keydown.shift.pageup": f,
          "keydown.pagedown": v,
          "keydown.shift.pagedown": b
        }
      }
    ]), (i, g) => (m(), y("div", {
      event: i.event,
      class: "adate",
      tabindex: "0",
      ref: "adatepicker"
    }, [
      u("table", null, [
        u("tr", bt, [
          u("td", {
            onClick: w,
            tabindex: -1
          }, "<"),
          u("th", wt, D(R.value), 1),
          u("td", {
            onClick: v,
            tabindex: -1
          }, ">")
        ]),
        Dt,
        (m(), y(O, null, x(Ct, (c) => u("tr", { key: c }, [
          (m(), y(O, null, x($, (h) => u("td", {
            key: (c - 1) * $ + h,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            style: me({
              border: P(d.value[(c - 1) * $ + h]) ? "2px solid var(--focus-cell-outline)" : "none",
              borderBottomColor: C(d.value[(c - 1) * $ + h]) ? "var(--focus-cell-outline)" : "none"
            }),
            onClick: ve((U) => H(U, (c - 1) * $ + h), ["prevent", "stop"]),
            class: V({
              todaysdate: C(d.value[(c - 1) * $ + h]),
              selecteddate: P(d.value[(c - 1) * $ + h])
            })
          }, D(new Date(d.value[(c - 1) * $ + h]).getDate()), 15, kt)), 64))
        ])), 64))
      ])
    ], 8, _t));
  }
});
const Et = /* @__PURE__ */ E(At, [["__scopeId", "data-v-79400fb2"]]), It = /* @__PURE__ */ k({
  __name: "CollapseButton",
  props: {
    collapsed: { type: Boolean }
  },
  setup(e) {
    return (t, o) => (m(), y("button", {
      class: V(["collapse-button", t.collapsed ? "rotated" : "unrotated"])
    }, "×", 2));
  }
});
const Mt = /* @__PURE__ */ E(It, [["__scopeId", "data-v-6f1c1b45"]]), St = /* @__PURE__ */ k({
  __name: "AForm",
  props: {
    modelValue: {},
    data: {},
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const o = e, n = t, a = _(o.data || {}), l = (r) => {
      let d = {};
      for (const [p, f] of Object.entries(r))
        ["component", "fieldtype"].includes(p) || (d[p] = f), p === "rows" && f && f.length === 0 && (d.rows = a.value[r.fieldname]);
      return d;
    }, s = T({
      get: () => o.modelValue.map((r, d) => T({
        get() {
          return r.value;
        },
        set: (p) => {
          o.modelValue[d].value = p, n("update:modelValue", o.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (r, d) => (m(), y("form", null, [
      (m(!0), y(O, null, x(r.modelValue, (p, f) => (m(), W($e(p.component), Te({
        key: f,
        schema: p,
        modelValue: s.value[f].value,
        "onUpdate:modelValue": (b) => s.value[f].value = b,
        data: a.value[p.fieldname],
        readonly: r.readonly
      }, l(p)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
});
const we = /* @__PURE__ */ E(St, [["__scopeId", "data-v-82492bb4"]]), $t = /* @__PURE__ */ k({
  __name: "AFieldset",
  props: {
    schema: {},
    label: {},
    collapsible: { type: Boolean },
    data: {}
  },
  setup(e) {
    const t = e, o = _(t.data || []);
    let n = _(!1), a = _(t.collapsible);
    const l = _(t.schema);
    function s(r) {
      r.preventDefault(), a.value && (n.value = !n.value);
    }
    return (r, d) => (m(), y("fieldset", null, [
      u("legend", {
        onClick: s,
        onSubmit: s
      }, [
        Oe(D(r.label) + " ", 1),
        L(a) ? (m(), W(Mt, {
          key: 0,
          collapsed: L(n)
        }, null, 8, ["collapsed"])) : he("", !0)
      ], 32),
      xe(r.$slots, "default", { collapsed: L(n) }, () => [
        A(Le(we, {
          modelValue: l.value,
          "onUpdate:modelValue": d[0] || (d[0] = (p) => l.value = p),
          data: o.value
        }, null, 8, ["modelValue", "data"]), [
          [B, !L(n)]
        ])
      ], !0)
    ]));
  }
});
const Tt = /* @__PURE__ */ E($t, [["__scopeId", "data-v-cad9b578"]]), Ot = ["id", "disabled", "required"], xt = ["for"], Lt = ["innerHTML"], Vt = /* @__PURE__ */ k({
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
    const o = e, n = t, a = T({
      get: () => o.modelValue,
      set: (l) => {
        n("update:modelValue", l);
      }
    });
    return (l, s) => (m(), y("div", null, [
      A(u("input", {
        "onUpdate:modelValue": s[0] || (s[0] = (r) => a.value = r),
        type: "number",
        id: l.uuid,
        disabled: l.readonly,
        required: l.required
      }, null, 8, Ot), [
        [z, a.value]
      ]),
      u("label", { for: l.uuid }, D(l.label), 9, xt),
      A(u("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, Lt), [
        [B, l.validation.errorMessage]
      ])
    ]));
  }
});
const Bt = /* @__PURE__ */ E(Vt, [["__scopeId", "data-v-be33e6c4"]]), de = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function Pt(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function Ft(e) {
  var o;
  let t = e.value;
  if (t) {
    const n = Pt(t);
    if (n) {
      const a = e.instance.locale;
      t = n(a);
    }
  } else {
    const a = (o = e.instance.schema.fieldtype) == null ? void 0 : o.toLowerCase();
    a && de[a] && (t = de[a]);
  }
  return t;
}
function qt(e, t) {
  t || (t = "#");
  let o = e;
  const n = [t, "/", "-", "(", ")", " "];
  for (const a of n)
    o = o.replaceAll(a, "");
  return o;
}
function Ht(e, t, o) {
  o || (o = "#");
  let n = t;
  for (const a of e) {
    const l = n.indexOf(o);
    if (l !== -1) {
      const s = n.substring(0, l), r = n.substring(l + 1);
      n = s + a + r;
    }
  }
  return n.slice(0, t.length);
}
function Rt(e, t) {
  const o = Ft(t);
  if (!o)
    return;
  const n = "#", a = e.value, l = qt(a, n);
  if (l) {
    const s = Ht(l, o, n);
    t.instance.maskFilled && (t.instance.maskFilled = !s.includes(n)), e.value = s;
  } else
    e.value = o;
}
const Ut = k({
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
    const o = _(!1), n = pe("locale", "");
    return { inputText: T({
      get() {
        return e.modelValue;
      },
      set(l) {
        t.emit("update:modelValue", l);
      }
    }), locale: n, maskFilled: o };
  },
  directives: {
    mask: Rt
  }
});
const Yt = ["id", "disabled", "maxlength", "required"], Qt = ["for"], Wt = ["innerHTML"];
function jt(e, t, o, n, a, l) {
  const s = Ve("mask");
  return m(), y("div", null, [
    A(u("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.inputText = r),
      id: e.uuid,
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required
    }, null, 8, Yt), [
      [z, e.inputText],
      [s, e.mask]
    ]),
    u("label", { for: e.uuid }, D(e.label), 9, Qt),
    A(u("p", {
      innerHTML: e.validation.errorMessage
    }, null, 8, Wt), [
      [B, e.validation.errorMessage]
    ])
  ]);
}
const zt = /* @__PURE__ */ E(Ut, [["render", jt], ["__scopeId", "data-v-76dba9b8"]]);
function Kt(e) {
  e.component("ACheckbox", Ue), e.component("ACombobox", Qe), e.component("ADate", ct), e.component("ADropdown", yt), e.component("ADatePicker", Et), e.component("AFieldset", Tt), e.component("AForm", we), e.component("ANumericInput", Bt), e.component("ATextInput", zt);
}
export {
  Ue as ACheckbox,
  Qe as AComboBox,
  ct as ADate,
  Et as ADatePicker,
  yt as ADropdown,
  Tt as AFieldset,
  we as AForm,
  Bt as ANumericInput,
  zt as ATextInput,
  Kt as install
};
//# sourceMappingURL=aform.js.map
