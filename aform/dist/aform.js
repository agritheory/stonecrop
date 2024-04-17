import { defineComponent as k, computed as M, openBlock as p, createElementBlock as m, createElementVNode as i, withDirectives as _, vModelCheckbox as me, toDisplayString as w, vShow as T, resolveComponent as ve, createBlock as x, withCtx as he, vModelText as q, normalizeClass as L, withKeys as H, Fragment as P, renderList as B, onMounted as se, onBeforeUnmount as ye, ref as g, watch as R, unref as O, getCurrentScope as ge, onScopeDispose as _e, nextTick as be, withModifiers as we, pushScopeId as ke, popScopeId as Ce, resolveDynamicComponent as De, mergeProps as Ae, createTextVNode as Ee, createCommentVNode as Me, renderSlot as Ie, createVNode as Te, inject as Se, resolveDirective as $e } from "vue";
const Oe = { id: "checkbox-container" }, Ve = ["id", "readonly", "required"], Le = { id: "custom-checkbox" }, Pe = ["for"], Be = ["innerHTML"], qe = /* @__PURE__ */ k({
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
    return (l, a) => (p(), m("div", null, [
      i("label", Oe, [
        _(i("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value = r),
          type: "checkbox",
          id: l.uuid,
          class: "checkbox",
          readonly: l.readOnly,
          required: l.required
        }, null, 8, Ve), [
          [me, s.value]
        ]),
        i("span", Le, w(s.value), 1)
      ]),
      i("label", {
        for: l.uuid,
        id: "checkbox-label"
      }, w(l.label), 9, Pe),
      _(i("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, Be), [
        [T, l.validation.errorMessage]
      ])
    ]));
  }
});
const C = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, s] of t)
    n[o] = s;
  return n;
}, He = /* @__PURE__ */ C(qe, [["__scopeId", "data-v-743cd4db"]]), Fe = /* @__PURE__ */ i("div", null, [
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" })
], -1), xe = /* @__PURE__ */ k({
  __name: "AComboBox",
  props: ["event", "cellData", "tableID"],
  setup(e) {
    return (t, n) => {
      const o = ve("ATableModal");
      return p(), x(o, {
        event: e.event,
        cellData: e.cellData,
        class: "amodal"
      }, {
        default: he(() => [
          Fe
        ]),
        _: 1
      }, 8, ["event", "cellData"]);
    };
  }
}), Re = ["id", "disabled", "required"], Ue = ["for"], Ne = ["innerHTML"], Qe = /* @__PURE__ */ k({
  __name: "ADate",
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
    return (l, a) => (p(), m("div", null, [
      _(i("input", {
        "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value = r),
        type: "date",
        id: l.uuid,
        disabled: l.readonly,
        required: l.required
      }, null, 8, Re), [
        [q, s.value]
      ]),
      i("label", { for: l.uuid }, w(l.label), 9, Ue),
      _(i("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, Ne), [
        [T, l.validation.errorMessage]
      ])
    ]));
  }
});
const We = /* @__PURE__ */ C(Qe, [["__scopeId", "data-v-91963706"]]), Ye = k({
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
const je = { class: "input-wrapper" }, Ge = {
  id: "autocomplete-results",
  class: "autocomplete-results"
}, Ke = {
  key: 0,
  class: "loading autocomplete-result"
}, ze = ["onClick"];
function Je(e, t, n, o, s, l) {
  return p(), m("div", {
    class: L(["autocomplete", { isOpen: e.isOpen }])
  }, [
    i("div", je, [
      _(i("input", {
        ref: "mopInput",
        type: "text",
        onInput: t[0] || (t[0] = (...a) => e.onChange && e.onChange(...a)),
        onFocus: t[1] || (t[1] = (...a) => e.onChange && e.onChange(...a)),
        "onUpdate:modelValue": t[2] || (t[2] = (a) => e.search = a),
        onKeydown: [
          t[3] || (t[3] = H((...a) => e.onArrowDown && e.onArrowDown(...a), ["down"])),
          t[4] || (t[4] = H((...a) => e.onArrowUp && e.onArrowUp(...a), ["up"])),
          t[5] || (t[5] = H((...a) => e.onEnter && e.onEnter(...a), ["enter"]))
        ]
      }, null, 544), [
        [q, e.search]
      ]),
      _(i("ul", Ge, [
        e.isLoading ? (p(), m("li", Ke, "Loading results...")) : (p(!0), m(P, { key: 1 }, B(e.results, (a, r) => (p(), m("li", {
          key: r,
          onClick: (d) => e.setResult(a),
          class: L(["autocomplete-result", { "is-active": r === e.arrowCounter }])
        }, w(a), 11, ze))), 128))
      ], 512), [
        [T, e.isOpen]
      ]),
      i("label", null, w(e.label), 1)
    ])
  ], 2);
}
const Xe = /* @__PURE__ */ C(Ye, [["render", Je]]);
var Y;
const ae = typeof window < "u", Ze = (e) => typeof e == "string", et = () => {
};
ae && (Y = window == null ? void 0 : window.navigator) != null && Y.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function re(e) {
  return typeof e == "function" ? e() : O(e);
}
function tt(e) {
  return e;
}
function nt(e) {
  return ge() ? (_e(e), !0) : !1;
}
function F(e) {
  var t;
  const n = re(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const ie = ae ? window : void 0;
function ot(...e) {
  let t, n, o, s;
  if (Ze(e[0]) || Array.isArray(e[0]) ? ([n, o, s] = e, t = ie) : [t, n, o, s] = e, !t)
    return et;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const l = [], a = () => {
    l.forEach((c) => c()), l.length = 0;
  }, r = (c, h, b, f) => (c.addEventListener(h, b, f), () => c.removeEventListener(h, b, f)), d = R(() => [F(t), re(s)], ([c, h]) => {
    a(), c && l.push(...n.flatMap((b) => o.map((f) => r(c, b, f, h))));
  }, { immediate: !0, flush: "post" }), u = () => {
    d(), a();
  };
  return nt(u), u;
}
const j = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, G = "__vueuse_ssr_handlers__";
j[G] = j[G] || {};
function lt(e, { window: t = ie, scrollTarget: n } = {}) {
  const o = g(!1), s = () => {
    if (!t)
      return;
    const l = t.document, a = F(e);
    if (!a)
      o.value = !1;
    else {
      const r = a.getBoundingClientRect();
      o.value = r.top <= (t.innerHeight || l.documentElement.clientHeight) && r.left <= (t.innerWidth || l.documentElement.clientWidth) && r.bottom >= 0 && r.right >= 0;
    }
  };
  return R(() => F(e), () => s(), { immediate: !0, flush: "post" }), t && ot(n || t, "scroll", s, {
    capture: !1,
    passive: !0
  }), o;
}
var K;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(K || (K = {}));
var st = Object.defineProperty, z = Object.getOwnPropertySymbols, at = Object.prototype.hasOwnProperty, rt = Object.prototype.propertyIsEnumerable, J = (e, t, n) => t in e ? st(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, it = (e, t) => {
  for (var n in t || (t = {}))
    at.call(t, n) && J(e, n, t[n]);
  if (z)
    for (var n of z(t))
      rt.call(t, n) && J(e, n, t[n]);
  return e;
};
const ut = {
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
it({
  linear: tt
}, ut);
const D = (e) => {
  let t = lt(e).value;
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
      const s = Array.from(o.children)[e.cellIndex];
      s && (n = s);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const o = e.previousElementSibling;
    o && (n = o);
  }
  return n && (!A(n) || !D(n)) ? U(n) : n;
}, dt = (e) => {
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
  return o && (!A(o) || !D(o)) ? N(o) : o;
}, Z = (e) => {
  const t = e.target;
  return N(t);
}, N = (e) => {
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
  return n && (!A(n) || !D(n)) ? N(n) : n;
}, ct = (e) => {
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
  return o && (!A(o) || !D(o)) ? U(o) : o;
}, ee = (e) => {
  const t = e.target;
  return Q(t);
}, Q = (e) => {
  var t;
  let n;
  if (e.previousElementSibling)
    n = e.previousElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    n = o == null ? void 0 : o.lastElementChild;
  }
  return n && (!A(n) || !D(n)) ? Q(n) : n;
}, te = (e) => {
  const t = e.target;
  return W(t);
}, W = (e) => {
  var t;
  let n;
  if (e.nextElementSibling)
    n = e.nextElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    n = o == null ? void 0 : o.firstElementChild;
  }
  return n && (!A(n) || !D(n)) ? W(n) : n;
}, ne = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!A(t) || !D(t)) ? W(t) : t;
}, oe = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!A(t) || !D(t)) ? Q(t) : t;
}, V = ["alt", "control", "shift", "meta"], pt = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, ue = {
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
    const t = dt(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = ct(e);
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
function ft(e) {
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
      l = Array.from(s.children).filter((a) => A(a) && D(a));
    return l;
  }, n = (o) => (s) => {
    const l = pt[s.key] || s.key.toLowerCase();
    if (V.includes(l))
      return;
    const a = o.handlers || ue;
    for (const r of Object.keys(a)) {
      const [d, ...u] = r.split(".");
      if (d === "keydown" && u.includes(l)) {
        const c = a[r], h = u.filter((f) => V.includes(f)), b = V.some((f) => {
          const S = f.charAt(0).toUpperCase() + f.slice(1);
          return s.getModifierState(S);
        });
        if (h.length > 0) {
          if (b) {
            for (const f of V)
              if (u.includes(f)) {
                const S = f.charAt(0).toUpperCase() + f.slice(1);
                s.getModifierState(S) && c(s);
              }
          }
        } else
          b || c(s);
      }
    }
  };
  se(() => {
    for (const o of e) {
      const s = t(o);
      for (const l of s)
        l.addEventListener("keydown", n(o));
    }
  }), ye(() => {
    for (const o of e) {
      const s = t(o);
      for (const l of s)
        l.removeEventListener("keydown", n(o));
    }
  });
}
const mt = (e) => (ke("data-v-bab7e0a8"), e = e(), Ce(), e), vt = ["event"], ht = { colspan: "5" }, yt = /* @__PURE__ */ mt(() => /* @__PURE__ */ i("tr", null, [
  /* @__PURE__ */ i("td", null, "M"),
  /* @__PURE__ */ i("td", null, "T"),
  /* @__PURE__ */ i("td", null, "W"),
  /* @__PURE__ */ i("td", null, "T"),
  /* @__PURE__ */ i("td", null, "F"),
  /* @__PURE__ */ i("td", null, "S"),
  /* @__PURE__ */ i("td", null, "S")
], -1)), gt = ["onClick"], _t = 6, I = 7, bt = /* @__PURE__ */ k({
  __name: "ADatePicker",
  props: {
    modelValue: {},
    event: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = t, s = /* @__PURE__ */ new Date(), l = g(n.modelValue ? new Date(n.modelValue) : void 0), a = g(), r = g(), d = g([]);
    se(async () => {
      let v = /* @__PURE__ */ new Date();
      v ? (l.value = v, a.value = l.value.getMonth(), r.value = l.value.getFullYear()) : (a.value = s.getMonth(), r.value = s.getFullYear()), u(), await be();
      const $ = document.getElementsByClassName("selectedDate");
      if ($.length > 0)
        $[0].focus();
      else {
        const y = document.getElementsByClassName("todaysDate");
        y.length > 0 && y[0].focus();
      }
    }), R([a, r], () => {
      u();
    });
    const u = () => {
      d.value = [];
      const v = new Date(r.value, a.value, 1), $ = v.getDay(), y = v.setDate(v.getDate() - $);
      for (let E of Array(43).keys())
        d.value.push(y + E * 864e5);
    }, c = () => {
      r.value -= 1;
    }, h = () => {
      r.value += 1;
    }, b = () => {
      a.value == 0 ? (a.value = 11, c()) : a.value -= 1;
    }, f = () => {
      a.value == 11 ? (a.value = 0, h()) : a.value += 1;
    }, S = (v) => {
      if (a.value === s.getMonth())
        return s.toDateString() === new Date(v).toDateString();
    }, ce = (v) => new Date(v).toDateString() === new Date(l.value).toDateString(), pe = (v) => {
      l.value = new Date(d.value[v]), o("update:modelValue", l.value.getTime());
    }, fe = M(() => new Date(r.value, a.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return ft([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...ue,
          "keydown.pageup": b,
          "keydown.shift.pageup": c,
          "keydown.pagedown": f,
          "keydown.shift.pagedown": h
        }
      }
    ]), (v, $) => (p(), m("div", {
      event: v.event,
      class: "adatepicker",
      tabindex: "0",
      ref: "adatepicker"
    }, [
      i("table", null, [
        i("tr", null, [
          i("td", {
            onClick: b,
            tabindex: -1
          }, "<"),
          i("th", ht, w(fe.value), 1),
          i("td", {
            onClick: f,
            tabindex: -1
          }, ">")
        ]),
        yt,
        (p(), m(P, null, B(_t, (y) => i("tr", { key: y }, [
          (p(), m(P, null, B(I, (E) => i("td", {
            key: (y - 1) * I + E,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            onClick: we((Nt) => pe((y - 1) * I + E), ["prevent", "stop"]),
            class: L({
              todaysDate: S(d.value[(y - 1) * I + E]),
              selectedDate: ce(d.value[(y - 1) * I + E])
            })
          }, w(new Date(d.value[(y - 1) * I + E]).getDate()), 11, gt)), 64))
        ])), 64))
      ])
    ], 8, vt));
  }
});
const wt = /* @__PURE__ */ C(bt, [["__scopeId", "data-v-bab7e0a8"]]), kt = /* @__PURE__ */ k({
  __name: "CollapseButton",
  props: {
    collapsed: { type: Boolean }
  },
  setup(e) {
    return (t, n) => (p(), m("button", {
      class: L(["collapse-button", t.collapsed ? "rotated" : "unrotated"])
    }, "×", 2));
  }
});
const Ct = /* @__PURE__ */ C(kt, [["__scopeId", "data-v-6f1c1b45"]]), Dt = /* @__PURE__ */ k({
  __name: "AForm",
  props: {
    modelValue: {},
    data: {},
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = t, s = g(n.data || {}), l = (r) => {
      let d = {};
      for (const [u, c] of Object.entries(r))
        ["component", "fieldtype"].includes(u) || (d[u] = c), u === "rows" && c && c.length === 0 && (d.rows = s.value[r.fieldname]);
      return d;
    }, a = M({
      get: () => n.modelValue.map((r, d) => M({
        get() {
          return r.value;
        },
        set: (u) => {
          n.modelValue[d].value = u, o("update:modelValue", n.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (r, d) => (p(), m("form", null, [
      (p(!0), m(P, null, B(r.modelValue, (u, c) => (p(), x(De(u.component), Ae({
        key: c,
        schema: u,
        modelValue: a.value[c].value,
        "onUpdate:modelValue": (h) => a.value[c].value = h,
        data: s.value[u.fieldname],
        readonly: r.readonly
      }, l(u)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
});
const de = /* @__PURE__ */ C(Dt, [["__scopeId", "data-v-82492bb4"]]), At = /* @__PURE__ */ k({
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
    return (r, d) => (p(), m("fieldset", null, [
      i("legend", {
        onClick: a,
        onSubmit: a
      }, [
        Ee(w(r.label) + " ", 1),
        O(s) ? (p(), x(Ct, {
          key: 0,
          collapsed: O(o)
        }, null, 8, ["collapsed"])) : Me("", !0)
      ], 32),
      Ie(r.$slots, "default", { collapsed: O(o) }, () => [
        _(Te(de, {
          modelValue: l.value,
          "onUpdate:modelValue": d[0] || (d[0] = (u) => l.value = u),
          data: n.value
        }, null, 8, ["modelValue", "data"]), [
          [T, !O(o)]
        ])
      ], !0)
    ]));
  }
});
const Et = /* @__PURE__ */ C(At, [["__scopeId", "data-v-cad9b578"]]), Mt = ["id", "disabled", "required"], It = ["for"], Tt = ["innerHTML"], St = /* @__PURE__ */ k({
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
    return (l, a) => (p(), m("div", null, [
      _(i("input", {
        "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value = r),
        type: "number",
        id: l.uuid,
        disabled: l.readonly,
        required: l.required
      }, null, 8, Mt), [
        [q, s.value]
      ]),
      i("label", { for: l.uuid }, w(l.label), 9, It),
      _(i("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, Tt), [
        [T, l.validation.errorMessage]
      ])
    ]));
  }
});
const $t = /* @__PURE__ */ C(St, [["__scopeId", "data-v-be33e6c4"]]), le = {
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
    s && le[s] && (t = le[s]);
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
function Pt(e, t, n) {
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
function Bt(e, t) {
  const n = Vt(t);
  if (!n)
    return;
  const o = "#", s = e.value, l = Lt(s, o);
  if (l) {
    const a = Pt(l, n, o);
    t.instance.maskFilled && (t.instance.maskFilled = !a.includes(o)), e.value = a;
  } else
    e.value = n;
}
const qt = k({
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
    const n = g(!1), o = Se("locale", "");
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
    mask: Bt
  }
});
const Ht = ["id", "disabled", "maxlength", "required"], Ft = ["for"], xt = ["innerHTML"];
function Rt(e, t, n, o, s, l) {
  const a = $e("mask");
  return p(), m("div", null, [
    _(i("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.inputText = r),
      id: e.uuid,
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required
    }, null, 8, Ht), [
      [q, e.inputText],
      [a, e.mask]
    ]),
    i("label", { for: e.uuid }, w(e.label), 9, Ft),
    _(i("p", {
      innerHTML: e.validation.errorMessage
    }, null, 8, xt), [
      [T, e.validation.errorMessage]
    ])
  ]);
}
const Ut = /* @__PURE__ */ C(qt, [["render", Rt], ["__scopeId", "data-v-76dba9b8"]]);
function Wt(e) {
  e.component("ACheckbox", He), e.component("ACombobox", xe), e.component("ADate", We), e.component("ADropdown", Xe), e.component("ADatePicker", wt), e.component("AFieldset", Et), e.component("AForm", de), e.component("ANumericInput", $t), e.component("ATextInput", Ut);
}
export {
  He as ACheckbox,
  xe as AComboBox,
  We as ADate,
  wt as ADatePicker,
  Xe as ADropdown,
  Et as AFieldset,
  de as AForm,
  $t as ANumericInput,
  Ut as ATextInput,
  Wt as install
};
//# sourceMappingURL=aform.js.map
