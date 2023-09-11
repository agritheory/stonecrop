import { defineComponent as k, computed as E, openBlock as p, createElementBlock as v, createElementVNode as i, withDirectives as g, vModelCheckbox as ve, toDisplayString as w, vShow as I, resolveComponent as he, createBlock as x, withCtx as ye, vModelText as q, normalizeClass as L, withKeys as H, Fragment as P, renderList as B, onMounted as ae, onBeforeUnmount as ge, ref as y, watch as R, unref as O, getCurrentScope as _e, onScopeDispose as be, nextTick as we, withModifiers as ke, pushScopeId as Ce, popScopeId as De, resolveDynamicComponent as Ae, mergeProps as Ee, createTextVNode as Me, createCommentVNode as Ie, renderSlot as Te, createVNode as Se, inject as $e, resolveDirective as Oe } from "vue";
const Ve = { id: "checkbox-container" }, Le = ["id", "readonly", "required"], Pe = { id: "custom-checkbox" }, Be = ["for"], qe = ["innerHTML"], He = /* @__PURE__ */ k({
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
    const n = e, o = t, s = E({
      get() {
        return n.value;
      },
      set(l) {
        o("update:value", l);
      }
    });
    return (l, a) => (p(), v("div", null, [
      i("label", Ve, [
        g(i("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value = r),
          type: "checkbox",
          id: l.uuid,
          class: "checkbox",
          readonly: l.readOnly,
          required: l.required
        }, null, 8, Le), [
          [ve, s.value]
        ]),
        i("span", Pe, w(s.value), 1)
      ]),
      i("label", {
        for: l.uuid,
        id: "checkbox-label"
      }, w(l.label), 9, Be),
      g(i("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, qe), [
        [I, l.validation.errorMessage]
      ])
    ]));
  }
});
const C = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, s] of t)
    n[o] = s;
  return n;
}, Fe = /* @__PURE__ */ C(He, [["__scopeId", "data-v-743cd4db"]]), xe = /* @__PURE__ */ i("div", null, [
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" }),
  /* @__PURE__ */ i("input", { type: "text" })
], -1), Re = /* @__PURE__ */ k({
  __name: "AComboBox",
  props: ["event", "cellData", "tableID"],
  setup(e) {
    return (t, n) => {
      const o = he("ATableModal");
      return p(), x(o, {
        event: e.event,
        cellData: e.cellData,
        class: "amodal"
      }, {
        default: ye(() => [
          xe
        ]),
        _: 1
      }, 8, ["event", "cellData"]);
    };
  }
}), Ue = ["id", "disabled", "required"], Ne = ["for"], Qe = ["innerHTML"], We = /* @__PURE__ */ k({
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
    const n = e, o = t, s = E({
      get: () => n.modelValue,
      set: (l) => {
        o("update:modelValue", l);
      }
    });
    return (l, a) => (p(), v("div", null, [
      g(i("input", {
        "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value = r),
        type: "date",
        id: l.uuid,
        disabled: l.readonly,
        required: l.required
      }, null, 8, Ue), [
        [q, s.value]
      ]),
      i("label", { for: l.uuid }, w(l.label), 9, Ne),
      g(i("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, Qe), [
        [I, l.validation.errorMessage]
      ])
    ]));
  }
});
const Ye = /* @__PURE__ */ C(We, [["__scopeId", "data-v-91963706"]]), je = k({
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
const Ge = { class: "input-wrapper" }, Ke = {
  id: "autocomplete-results",
  class: "autocomplete-results"
}, ze = {
  key: 0,
  class: "loading autocomplete-result"
}, Je = ["onClick"];
function Xe(e, t, n, o, s, l) {
  return p(), v("div", {
    class: L(["autocomplete", { isOpen: e.isOpen }])
  }, [
    i("div", Ge, [
      g(i("input", {
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
      g(i("ul", Ke, [
        e.isLoading ? (p(), v("li", ze, "Loading results...")) : (p(!0), v(P, { key: 1 }, B(e.results, (a, r) => (p(), v("li", {
          key: r,
          onClick: (d) => e.setResult(a),
          class: L(["autocomplete-result", { "is-active": r === e.arrowCounter }])
        }, w(a), 11, Je))), 128))
      ], 512), [
        [I, e.isOpen]
      ]),
      i("label", null, w(e.label), 1)
    ])
  ], 2);
}
const Ze = /* @__PURE__ */ C(je, [["render", Xe]]);
var j;
const re = typeof window < "u", et = (e) => typeof e == "string", tt = () => {
};
re && (j = window == null ? void 0 : window.navigator) != null && j.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function ie(e) {
  return typeof e == "function" ? e() : O(e);
}
function nt(e) {
  return e;
}
function ot(e) {
  return _e() ? (be(e), !0) : !1;
}
function F(e) {
  var t;
  const n = ie(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const ue = re ? window : void 0;
function lt(...e) {
  let t, n, o, s;
  if (et(e[0]) || Array.isArray(e[0]) ? ([n, o, s] = e, t = ue) : [t, n, o, s] = e, !t)
    return tt;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const l = [], a = () => {
    l.forEach((c) => c()), l.length = 0;
  }, r = (c, h, _, f) => (c.addEventListener(h, _, f), () => c.removeEventListener(h, _, f)), d = R(() => [F(t), ie(s)], ([c, h]) => {
    a(), c && l.push(...n.flatMap((_) => o.map((f) => r(c, _, f, h))));
  }, { immediate: !0, flush: "post" }), u = () => {
    d(), a();
  };
  return ot(u), u;
}
const G = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, K = "__vueuse_ssr_handlers__";
G[K] = G[K] || {};
function st(e, { window: t = ue, scrollTarget: n } = {}) {
  const o = y(!1), s = () => {
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
  return R(() => F(e), () => s(), { immediate: !0, flush: "post" }), t && lt(n || t, "scroll", s, {
    capture: !1,
    passive: !0
  }), o;
}
var z;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(z || (z = {}));
var at = Object.defineProperty, J = Object.getOwnPropertySymbols, rt = Object.prototype.hasOwnProperty, it = Object.prototype.propertyIsEnumerable, X = (e, t, n) => t in e ? at(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, ut = (e, t) => {
  for (var n in t || (t = {}))
    rt.call(t, n) && X(e, n, t[n]);
  if (J)
    for (var n of J(t))
      it.call(t, n) && X(e, n, t[n]);
  return e;
};
const dt = {
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
ut({
  linear: nt
}, dt);
const D = (e) => {
  let t = st(e).value;
  return t = t && e.offsetHeight > 0, t;
}, A = (e) => e.tabIndex >= 0, Z = (e) => {
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
}, ct = (e) => {
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
}, ee = (e) => {
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
}, pt = (e) => {
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
}, te = (e) => {
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
}, ne = (e) => {
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
}, oe = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!A(t) || !D(t)) ? W(t) : t;
}, le = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!A(t) || !D(t)) ? Q(t) : t;
}, V = ["alt", "control", "shift", "meta"], ft = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, de = {
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
    const t = ct(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = pt(e);
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
function mt(e) {
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
    const l = ft[s.key] || s.key.toLowerCase();
    if (V.includes(l))
      return;
    const a = o.handlers || de;
    for (const r of Object.keys(a)) {
      const [d, ...u] = r.split(".");
      if (d === "keydown" && u.includes(l)) {
        const c = a[r], h = u.filter((f) => V.includes(f)), _ = V.some((f) => {
          const T = f.charAt(0).toUpperCase() + f.slice(1);
          return s.getModifierState(T);
        });
        if (h.length > 0) {
          if (_) {
            for (const f of V)
              if (u.includes(f)) {
                const T = f.charAt(0).toUpperCase() + f.slice(1);
                s.getModifierState(T) && c(s);
              }
          }
        } else
          _ || c(s);
      }
    }
  };
  ae(() => {
    for (const o of e) {
      const s = t(o);
      for (const l of s)
        l.addEventListener("keydown", n(o));
    }
  }), ge(() => {
    for (const o of e) {
      const s = t(o);
      for (const l of s)
        l.removeEventListener("keydown", n(o));
    }
  });
}
const vt = (e) => (Ce("data-v-4abe2c18"), e = e(), De(), e), ht = ["event"], yt = { colspan: "5" }, gt = /* @__PURE__ */ vt(() => /* @__PURE__ */ i("tr", null, [
  /* @__PURE__ */ i("td", null, "M"),
  /* @__PURE__ */ i("td", null, "T"),
  /* @__PURE__ */ i("td", null, "W"),
  /* @__PURE__ */ i("td", null, "T"),
  /* @__PURE__ */ i("td", null, "F"),
  /* @__PURE__ */ i("td", null, "S"),
  /* @__PURE__ */ i("td", null, "S")
], -1)), _t = ["onClick"], bt = 6, $ = 7, wt = /* @__PURE__ */ k({
  __name: "ADatePicker",
  props: {
    modelValue: {},
    event: {}
  },
  emits: ["update:value"],
  setup(e, { emit: t }) {
    const n = e, o = t, s = /* @__PURE__ */ new Date(), l = y(n.modelValue || void 0), a = y(), r = y(), d = y([]);
    ae(async () => {
      let m = /* @__PURE__ */ new Date();
      m ? (l.value = m, a.value = l.value.getMonth(), r.value = l.value.getFullYear()) : (a.value = s.getMonth(), r.value = s.getFullYear()), u(), await we();
      const S = document.getElementsByClassName("selecteddate");
      if (S.length > 0)
        S[0].focus();
      else {
        const b = document.getElementsByClassName("todaysdate");
        b.length > 0 && b[0].focus();
      }
    }), R([a, r], () => {
      u();
    });
    const u = () => {
      d.value = [];
      const m = new Date(r.value, a.value, 1), S = m.getDay(), b = m.setDate(m.getDate() - S);
      for (let M of Array(43).keys())
        d.value.push(b + M * 864e5);
    }, c = () => {
      r.value -= 1;
    }, h = () => {
      r.value += 1;
    }, _ = () => {
      a.value == 0 ? (a.value = 11, c()) : a.value -= 1;
    }, f = () => {
      a.value == 11 ? (a.value = 0, h()) : a.value += 1;
    }, T = (m) => {
      if (a.value === s.getMonth())
        return s.toDateString() === new Date(m).toDateString();
    }, pe = (m) => new Date(m).toDateString() === new Date(l.value).toDateString();
    E({
      get: () => modelValue.value,
      set: (m) => {
        Y(m);
      }
    });
    const Y = (m) => {
      l.value = new Date(d.value[m]), o("modelValue", l.value.getTime());
    }, fe = E(() => new Date(r.value, a.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return mt([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...de,
          "keydown.pageup": _,
          "keydown.shift.pageup": c,
          "keydown.pagedown": f,
          "keydown.shift.pagedown": h,
          // 'keydown.tab': selectDate // select this date
          // 'keydown.enter': selectDate // select this date
          "keydown.shift.tab": () => {
          },
          // disable - not working
          "keydown.shift.enter": () => {
          }
        }
      }
    ]), (m, S) => (p(), v("div", {
      event: m.event,
      class: "adatepicker",
      tabindex: "0",
      ref: "adatepicker"
    }, [
      i("table", null, [
        i("tr", null, [
          i("td", {
            onClick: _,
            tabindex: -1
          }, "<"),
          i("th", yt, w(fe.value), 1),
          i("td", {
            onClick: f,
            tabindex: -1
          }, ">")
        ]),
        gt,
        (p(), v(P, null, B(bt, (b) => i("tr", { key: b }, [
          (p(), v(P, null, B($, (M) => i("td", {
            key: (b - 1) * $ + M,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            onClick: ke((me) => Y(me), ["prevent", "stop"]),
            class: L({
              todaysDate: T(d.value[(b - 1) * $ + M]),
              selectedDate: pe(d.value[(b - 1) * $ + M])
            })
          }, w(new Date(d.value[(b - 1) * $ + M]).getDate()), 11, _t)), 64))
        ])), 64))
      ])
    ], 8, ht));
  }
});
const kt = /* @__PURE__ */ C(wt, [["__scopeId", "data-v-4abe2c18"]]), Ct = /* @__PURE__ */ k({
  __name: "CollapseButton",
  props: {
    collapsed: { type: Boolean }
  },
  setup(e) {
    return (t, n) => (p(), v("button", {
      class: L(["collapse-button", t.collapsed ? "rotated" : "unrotated"])
    }, "×", 2));
  }
});
const Dt = /* @__PURE__ */ C(Ct, [["__scopeId", "data-v-6f1c1b45"]]), At = /* @__PURE__ */ k({
  __name: "AForm",
  props: {
    modelValue: {},
    data: {},
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = t, s = y(n.data || {}), l = (r) => {
      let d = {};
      for (const [u, c] of Object.entries(r))
        ["component", "fieldtype"].includes(u) || (d[u] = c), u === "rows" && c && c.length === 0 && (d.rows = s.value[r.fieldname]);
      return d;
    }, a = E({
      get: () => n.modelValue.map((r, d) => E({
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
    return (r, d) => (p(), v("form", null, [
      (p(!0), v(P, null, B(r.modelValue, (u, c) => (p(), x(Ae(u.component), Ee({
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
const ce = /* @__PURE__ */ C(At, [["__scopeId", "data-v-82492bb4"]]), Et = /* @__PURE__ */ k({
  __name: "AFieldset",
  props: {
    schema: {},
    label: {},
    collapsible: { type: Boolean },
    data: {}
  },
  setup(e) {
    const t = e, n = y(t.data || []);
    let o = y(!1), s = y(t.collapsible);
    const l = y(t.schema);
    function a(r) {
      r.preventDefault(), s.value && (o.value = !o.value);
    }
    return (r, d) => (p(), v("fieldset", null, [
      i("legend", {
        onClick: a,
        onSubmit: a
      }, [
        Me(w(r.label) + " ", 1),
        O(s) ? (p(), x(Dt, {
          key: 0,
          collapsed: O(o)
        }, null, 8, ["collapsed"])) : Ie("", !0)
      ], 32),
      Te(r.$slots, "default", { collapsed: O(o) }, () => [
        g(Se(ce, {
          modelValue: l.value,
          "onUpdate:modelValue": d[0] || (d[0] = (u) => l.value = u),
          data: n.value
        }, null, 8, ["modelValue", "data"]), [
          [I, !O(o)]
        ])
      ], !0)
    ]));
  }
});
const Mt = /* @__PURE__ */ C(Et, [["__scopeId", "data-v-cad9b578"]]), It = ["id", "disabled", "required"], Tt = ["for"], St = ["innerHTML"], $t = /* @__PURE__ */ k({
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
    const n = e, o = t, s = E({
      get: () => n.modelValue,
      set: (l) => {
        o("update:modelValue", l);
      }
    });
    return (l, a) => (p(), v("div", null, [
      g(i("input", {
        "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value = r),
        type: "number",
        id: l.uuid,
        disabled: l.readonly,
        required: l.required
      }, null, 8, It), [
        [q, s.value]
      ]),
      i("label", { for: l.uuid }, w(l.label), 9, Tt),
      g(i("p", {
        innerHTML: l.validation.errorMessage
      }, null, 8, St), [
        [I, l.validation.errorMessage]
      ])
    ]));
  }
});
const Ot = /* @__PURE__ */ C($t, [["__scopeId", "data-v-be33e6c4"]]), se = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function Vt(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function Lt(e) {
  var n;
  let t = e.value;
  if (t) {
    const o = Vt(t);
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
function Pt(e, t) {
  t || (t = "#");
  let n = e;
  const o = [t, "/", "-", "(", ")", " "];
  for (const s of o)
    n = n.replaceAll(s, "");
  return n;
}
function Bt(e, t, n) {
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
function qt(e, t) {
  const n = Lt(t);
  if (!n)
    return;
  const o = "#", s = e.value, l = Pt(s, o);
  if (l) {
    const a = Bt(l, n, o);
    t.instance.maskFilled && (t.instance.maskFilled = !a.includes(o)), e.value = a;
  } else
    e.value = n;
}
const Ht = k({
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
    const n = y(!1), o = $e("locale", "");
    return { inputText: E({
      get() {
        return e.modelValue;
      },
      set(l) {
        t.emit("update:modelValue", l);
      }
    }), locale: o, maskFilled: n };
  },
  directives: {
    mask: qt
  }
});
const Ft = ["id", "disabled", "maxlength", "required"], xt = ["for"], Rt = ["innerHTML"];
function Ut(e, t, n, o, s, l) {
  const a = Oe("mask");
  return p(), v("div", null, [
    g(i("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.inputText = r),
      id: e.uuid,
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required
    }, null, 8, Ft), [
      [q, e.inputText],
      [a, e.mask]
    ]),
    i("label", { for: e.uuid }, w(e.label), 9, xt),
    g(i("p", {
      innerHTML: e.validation.errorMessage
    }, null, 8, Rt), [
      [I, e.validation.errorMessage]
    ])
  ]);
}
const Nt = /* @__PURE__ */ C(Ht, [["render", Ut], ["__scopeId", "data-v-76dba9b8"]]);
function Wt(e) {
  e.component("ACheckbox", Fe), e.component("ACombobox", Re), e.component("ADate", Ye), e.component("ADropdown", Ze), e.component("ADatePicker", kt), e.component("AFieldset", Mt), e.component("AForm", ce), e.component("ANumericInput", Ot), e.component("ATextInput", Nt);
}
export {
  Fe as ACheckbox,
  Re as AComboBox,
  Ye as ADate,
  kt as ADatePicker,
  Ze as ADropdown,
  Mt as AFieldset,
  ce as AForm,
  Ot as ANumericInput,
  Nt as ATextInput,
  Wt as install
};
//# sourceMappingURL=aform.js.map
