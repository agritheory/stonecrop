import { defineComponent as I, computed as S, openBlock as g, createElementBlock as w, createElementVNode as d, withDirectives as A, isRef as ge, vModelCheckbox as He, unref as y, toDisplayString as D, vShow as L, resolveComponent as qe, createBlock as V, withCtx as Re, getCurrentInstance as Qe, onMounted as Q, nextTick as he, getCurrentScope as be, onScopeDispose as _e, ref as f, watch as $, inject as U, resolveDirective as we, vModelText as j, onBeforeUnmount as Ue, Fragment as F, renderList as H, normalizeStyle as ke, withModifiers as je, normalizeClass as Ie, createCommentVNode as N, resolveDynamicComponent as Ne, mergeProps as We, createTextVNode as ze, renderSlot as Ye, createVNode as Ge, Teleport as Ke } from "vue";
const Je = { id: "checkbox-container" }, Xe = ["id", "readonly", "required"], Ze = { id: "custom-checkbox" }, et = ["for"], tt = ["innerHTML"], nt = /* @__PURE__ */ I({
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
    const n = e, o = S({
      get() {
        return n.value;
      },
      set(l) {
        t("update:value", l);
      }
    });
    return (l, a) => (g(), w("div", null, [
      d("label", Je, [
        A(d("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (r) => ge(o) ? o.value = r : null),
          type: "checkbox",
          id: e.uuid,
          class: "checkbox",
          readonly: e.readOnly,
          required: e.required
        }, null, 8, Xe), [
          [He, y(o)]
        ]),
        d("span", Ze, D(y(o)), 1)
      ]),
      d("label", {
        for: e.uuid,
        id: "checkbox-label"
      }, D(e.label), 9, et),
      A(d("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, tt), [
        [L, e.validation.errorMessage]
      ])
    ]));
  }
});
const C = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, l] of t)
    n[o] = l;
  return n;
}, ot = /* @__PURE__ */ C(nt, [["__scopeId", "data-v-743cd4db"]]), lt = /* @__PURE__ */ d("div", null, [
  /* @__PURE__ */ d("input", { type: "text" }),
  /* @__PURE__ */ d("input", { type: "text" }),
  /* @__PURE__ */ d("input", { type: "text" })
], -1), at = /* @__PURE__ */ I({
  __name: "AComboBox",
  props: ["event", "cellData", "tableID"],
  setup(e) {
    return (t, n) => {
      const o = qe("ATableModal");
      return g(), V(o, {
        event: e.event,
        cellData: e.cellData,
        class: "amodal"
      }, {
        default: Re(() => [
          lt
        ]),
        _: 1
      }, 8, ["event", "cellData"]);
    };
  }
}), K = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function rt(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function st(e) {
  var n;
  let t = e.value;
  if (t) {
    const o = rt(t);
    if (o) {
      const l = e.instance.locale;
      t = o(l);
    }
  } else {
    const l = (n = e.instance.schema.fieldtype) == null ? void 0 : n.toLowerCase();
    l && K[l] && (t = K[l]);
  }
  return t;
}
function ut(e, t) {
  t || (t = "#");
  let n = e;
  const o = [t, "/", "-", "(", ")", " "];
  for (const l of o)
    n = n.replaceAll(l, "");
  return n;
}
function it(e, t, n) {
  n || (n = "#");
  let o = t;
  for (const l of e) {
    const a = o.indexOf(n);
    if (a !== -1) {
      const r = o.substring(0, a), s = o.substring(a + 1);
      o = r + l + s;
    }
  }
  return o.slice(0, t.length);
}
function Ee(e, t) {
  const n = st(t);
  if (!n)
    return;
  const o = "#", l = e.value, a = ut(l, o);
  if (a) {
    const r = it(a, n, o);
    t.instance.maskFilled && (t.instance.maskFilled = !r.includes(o)), e.value = r;
  } else
    e.value = n;
}
var J;
const Oe = typeof window < "u", ct = (e) => typeof e == "string", dt = () => {
};
Oe && ((J = window == null ? void 0 : window.navigator) != null && J.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function xe(e) {
  return typeof e == "function" ? e() : y(e);
}
function pt(e) {
  return e;
}
function Ae(e) {
  return be() ? (_e(e), !0) : !1;
}
function De(e, t = !0) {
  Qe() ? Q(e) : t ? e() : he(e);
}
function B(e) {
  var t;
  const n = xe(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const Ce = Oe ? window : void 0;
function X(...e) {
  let t, n, o, l;
  if (ct(e[0]) || Array.isArray(e[0]) ? ([n, o, l] = e, t = Ce) : [t, n, o, l] = e, !t)
    return dt;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const a = [], r = () => {
    a.forEach((c) => c()), a.length = 0;
  }, s = (c, m, v, p) => (c.addEventListener(m, v, p), () => c.removeEventListener(m, v, p)), u = $(() => [B(t), xe(l)], ([c, m]) => {
    r(), c && a.push(...n.flatMap((v) => o.map((p) => s(c, v, p, m))));
  }, { immediate: !0, flush: "post" }), i = () => {
    u(), r();
  };
  return Ae(i), i;
}
function ft(e, t = !1) {
  const n = f(), o = () => n.value = !!e();
  return o(), De(o, t), n;
}
const Z = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ee = "__vueuse_ssr_handlers__";
Z[ee] = Z[ee] || {};
var te = Object.getOwnPropertySymbols, mt = Object.prototype.hasOwnProperty, vt = Object.prototype.propertyIsEnumerable, yt = (e, t) => {
  var n = {};
  for (var o in e)
    mt.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && te)
    for (var o of te(e))
      t.indexOf(o) < 0 && vt.call(e, o) && (n[o] = e[o]);
  return n;
};
function gt(e, t, n = {}) {
  const o = n, { window: l = Ce } = o, a = yt(o, ["window"]);
  let r;
  const s = ft(() => l && "ResizeObserver" in l), u = () => {
    r && (r.disconnect(), r = void 0);
  }, i = $(() => B(e), (m) => {
    u(), s.value && l && m && (r = new ResizeObserver(t), r.observe(m, a));
  }, { immediate: !0, flush: "post" }), c = () => {
    u(), i();
  };
  return Ae(c), {
    isSupported: s,
    stop: c
  };
}
function ht(e, t = {}) {
  const {
    reset: n = !0,
    windowResize: o = !0,
    windowScroll: l = !0,
    immediate: a = !0
  } = t, r = f(0), s = f(0), u = f(0), i = f(0), c = f(0), m = f(0), v = f(0), p = f(0);
  function b() {
    const M = B(e);
    if (!M) {
      n && (r.value = 0, s.value = 0, u.value = 0, i.value = 0, c.value = 0, m.value = 0, v.value = 0, p.value = 0);
      return;
    }
    const k = M.getBoundingClientRect();
    r.value = k.height, s.value = k.bottom, u.value = k.left, i.value = k.right, c.value = k.top, m.value = k.width, v.value = k.x, p.value = k.y;
  }
  return gt(e, b), $(() => B(e), (M) => !M && b()), l && X("scroll", b, { capture: !0, passive: !0 }), o && X("resize", b, { passive: !0 }), De(() => {
    a && b();
  }), {
    height: r,
    bottom: s,
    left: u,
    right: i,
    top: c,
    width: m,
    x: v,
    y: p,
    update: b
  };
}
var ne;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(ne || (ne = {}));
var bt = Object.defineProperty, oe = Object.getOwnPropertySymbols, _t = Object.prototype.hasOwnProperty, wt = Object.prototype.propertyIsEnumerable, le = (e, t, n) => t in e ? bt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, kt = (e, t) => {
  for (var n in t || (t = {}))
    _t.call(t, n) && le(e, n, t[n]);
  if (oe)
    for (var n of oe(t))
      wt.call(t, n) && le(e, n, t[n]);
  return e;
};
const It = {
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
kt({
  linear: pt
}, It);
function q(e, t) {
  console.log(e, t);
  const n = ht(e.$el);
  return e.position = {
    top: n.bottom.value,
    left: n.left.value,
    width: n.width.value,
    height: "1.15rem"
  }, { target: e, component: t };
}
const Et = I({
  name: "ADate",
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
      // default:
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
    const n = f(!1), o = U("locale", "");
    return { inputText: S({
      get() {
        return e.modelValue;
      },
      set(a) {
        t.emit("update:modelValue", a);
      }
    }), locale: o, maskFilled: n, useAModal: q };
  },
  directives: {
    mask: Ee
  },
  methods: {
    toggleModal() {
      q(this, "ADatePicker");
    }
  }
});
const Ot = ["id", "disabled", "maxlength", "required"], xt = ["for"];
function At(e, t, n, o, l, a) {
  const r = we("mask");
  return g(), w("div", null, [
    A(d("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (s) => e.inputText = s),
      id: e.uuid,
      ref: "uuid",
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required,
      onClick: t[1] || (t[1] = (...s) => e.toggleModal && e.toggleModal(...s))
    }, null, 8, Ot), [
      [j, e.inputText],
      [r, e.mask]
    ]),
    d("label", { for: e.uuid }, D(e.label), 9, xt)
  ]);
}
const Dt = /* @__PURE__ */ C(Et, [["render", At], ["__scopeId", "data-v-cb714523"]]);
var ae;
const Me = typeof window < "u", Ct = (e) => typeof e == "string", Mt = () => {
};
Me && (ae = window == null ? void 0 : window.navigator) != null && ae.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function Te(e) {
  return typeof e == "function" ? e() : y(e);
}
function Tt(e) {
  return e;
}
function St(e) {
  return be() ? (_e(e), !0) : !1;
}
function R(e) {
  var t;
  const n = Te(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const Se = Me ? window : void 0;
function $t(...e) {
  let t, n, o, l;
  if (Ct(e[0]) || Array.isArray(e[0]) ? ([n, o, l] = e, t = Se) : [t, n, o, l] = e, !t)
    return Mt;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const a = [], r = () => {
    a.forEach((c) => c()), a.length = 0;
  }, s = (c, m, v, p) => (c.addEventListener(m, v, p), () => c.removeEventListener(m, v, p)), u = $(() => [R(t), Te(l)], ([c, m]) => {
    r(), c && a.push(...n.flatMap((v) => o.map((p) => s(c, v, p, m))));
  }, { immediate: !0, flush: "post" }), i = () => {
    u(), r();
  };
  return St(i), i;
}
const re = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, se = "__vueuse_ssr_handlers__";
re[se] = re[se] || {};
function Pt(e, { window: t = Se, scrollTarget: n } = {}) {
  const o = f(!1), l = () => {
    if (!t)
      return;
    const a = t.document, r = R(e);
    if (!r)
      o.value = !1;
    else {
      const s = r.getBoundingClientRect();
      o.value = s.top <= (t.innerHeight || a.documentElement.clientHeight) && s.left <= (t.innerWidth || a.documentElement.clientWidth) && s.bottom >= 0 && s.right >= 0;
    }
  };
  return $(() => R(e), () => l(), { immediate: !0, flush: "post" }), t && $t(n || t, "scroll", l, {
    capture: !1,
    passive: !0
  }), o;
}
var ue;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(ue || (ue = {}));
var Bt = Object.defineProperty, ie = Object.getOwnPropertySymbols, Lt = Object.prototype.hasOwnProperty, Vt = Object.prototype.propertyIsEnumerable, ce = (e, t, n) => t in e ? Bt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Ft = (e, t) => {
  for (var n in t || (t = {}))
    Lt.call(t, n) && ce(e, n, t[n]);
  if (ie)
    for (var n of ie(t))
      Vt.call(t, n) && ce(e, n, t[n]);
  return e;
};
const Ht = {
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
Ft({
  linear: Tt
}, Ht);
const O = (e) => {
  let t = Pt(e).value;
  return t = t && e.offsetHeight > 0, t;
}, x = (e) => e.tabIndex >= 0, de = (e) => {
  const t = e.target;
  return W(t);
}, W = (e) => {
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
  return n && (!x(n) || !O(n)) ? W(n) : n;
}, qt = (e) => {
  var t;
  const n = e.target;
  let o;
  if (n instanceof HTMLTableCellElement) {
    const l = (t = n.parentElement) == null ? void 0 : t.parentElement;
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
  return o && (!x(o) || !O(o)) ? z(o) : o;
}, pe = (e) => {
  const t = e.target;
  return z(t);
}, z = (e) => {
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
  return n && (!x(n) || !O(n)) ? z(n) : n;
}, Rt = (e) => {
  var t;
  const n = e.target;
  let o;
  if (n instanceof HTMLTableCellElement) {
    const l = (t = n.parentElement) == null ? void 0 : t.parentElement;
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
  return o && (!x(o) || !O(o)) ? W(o) : o;
}, fe = (e) => {
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
  return n && (!x(n) || !O(n)) ? Y(n) : n;
}, me = (e) => {
  const t = e.target;
  return G(t);
}, G = (e) => {
  var t;
  let n;
  if (e.nextElementSibling)
    n = e.nextElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    n = o == null ? void 0 : o.firstElementChild;
  }
  return n && (!x(n) || !O(n)) ? G(n) : n;
}, ve = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!x(t) || !O(t)) ? G(t) : t;
}, ye = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!x(t) || !O(t)) ? Y(t) : t;
}, P = ["alt", "control", "shift", "meta"], Qt = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, $e = {
  "keydown.up": (e) => {
    const t = de(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.down": (e) => {
    const t = pe(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.left": (e) => {
    const t = fe(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.right": (e) => {
    const t = me(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.control.up": (e) => {
    const t = qt(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = Rt(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.left": (e) => {
    const t = ve(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.right": (e) => {
    const t = ye(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.end": (e) => {
    const t = ye(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = pe(e);
      t && t.focus();
    }
  },
  "keydown.shift.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = de(e);
      t && t.focus();
    }
  },
  "keydown.home": (e) => {
    const t = ve(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.tab": (e) => {
    const t = me(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.shift.tab": (e) => {
    const t = fe(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  }
};
function Ut(e) {
  const t = (o) => {
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
      a = Array.from(l.children).filter((r) => x(r) && O(r));
    return a;
  }, n = (o) => (l) => {
    const a = Qt[l.key] || l.key.toLowerCase();
    if (P.includes(a))
      return;
    const r = o.handlers || $e;
    for (const s of Object.keys(r)) {
      const [u, ...i] = s.split(".");
      if (u === "keydown" && i.includes(a)) {
        const c = r[s], m = i.filter((p) => P.includes(p)), v = P.some((p) => {
          const b = p.charAt(0).toUpperCase() + p.slice(1);
          return l.getModifierState(b);
        });
        if (m.length > 0) {
          if (v) {
            for (const p of P)
              if (i.includes(p)) {
                const b = p.charAt(0).toUpperCase() + p.slice(1);
                l.getModifierState(b) && c(l);
              }
          }
        } else
          v || c(l);
      }
    }
  };
  Q(() => {
    for (const o of e) {
      const l = t(o);
      for (const a of l)
        a.addEventListener("keydown", n(o));
    }
  }), Ue(() => {
    for (const o of e) {
      const l = t(o);
      for (const a of l)
        a.removeEventListener("keydown", n(o));
    }
  });
}
const jt = ["event", "colIndex", "rowIndex", "tableid"], Nt = { colspan: "5" }, Wt = ["onClick"], zt = /* @__PURE__ */ I({
  __name: "ADatePicker",
  props: {
    colIndex: null,
    rowIndex: null,
    tableid: null,
    event: null,
    indent: null,
    readonly: { type: Boolean }
  },
  setup(e) {
    const t = e, n = U(t.tableid), o = 6, l = 7, a = /* @__PURE__ */ new Date(), r = f(), s = f(), u = f(), i = f([]);
    Q(async () => {
      let h = n.cellData(t.colIndex, t.rowIndex);
      h ? (h instanceof Date || (h = new Date(h)), r.value = h, s.value = r.value.getMonth(), u.value = r.value.getFullYear()) : (s.value = a.getMonth(), u.value = a.getFullYear()), c(), await he();
      const T = document.getElementsByClassName("selecteddate");
      if (T.length > 0)
        T[0].focus();
      else {
        const _ = document.getElementsByClassName("todaysdate");
        _.length > 0 && _[0].focus();
      }
    }), $([s, u], () => {
      c();
    });
    const c = () => {
      i.value = [];
      const h = new Date(u.value, s.value, 1), T = h.getDay(), _ = h.setDate(h.getDate() - T);
      for (let E of Array(43).keys())
        i.value.push(_ + E * 864e5);
    }, m = () => {
      u.value -= 1;
    }, v = () => {
      u.value += 1;
    }, p = () => {
      s.value == 0 ? (s.value = 11, m()) : s.value -= 1;
    }, b = () => {
      s.value == 11 ? (s.value = 0, v()) : s.value += 1;
    }, M = (h) => {
      if (s.value === a.getMonth())
        return a.toDateString() === new Date(h).toDateString();
    }, k = (h) => new Date(h).toDateString() === new Date(r.value).toDateString(), Be = (h, T) => {
      r.value = new Date(i.value[T]), Le();
    }, Le = () => {
      n.setCellData(t.rowIndex, t.colIndex, r.value.getTime());
    }, Ve = S(() => new Date(u.value, s.value, 1).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long"
    }));
    return Ut([
      {
        parent: "table.adate",
        selectors: "td",
        handlers: {
          ...$e,
          "keydown.pageup": p,
          "keydown.shift.pageup": m,
          "keydown.pagedown": b,
          "keydown.shift.pagedown": v
        }
      }
    ]), (h, T) => e.readonly ? N("", !0) : (g(), w("div", {
      key: 0,
      event: e.event,
      colIndex: e.colIndex,
      rowIndex: e.rowIndex,
      tableid: e.tableid,
      class: "adate",
      tabindex: "0",
      ref: "adatepicker"
    }, [
      d("table", null, [
        d("tr", null, [
          d("td", {
            onClick: p,
            tabindex: -1
          }, "<"),
          d("th", Nt, D(y(Ve)), 1),
          d("td", {
            onClick: b,
            tabindex: -1
          }, ">")
        ]),
        (g(), w(F, null, H(o, (_) => d("tr", { key: _ }, [
          (g(), w(F, null, H(l, (E) => d("td", {
            key: (_ - 1) * l + E,
            contenteditable: !1,
            spellcheck: !1,
            tabindex: 0,
            style: ke({
              border: k(i.value[(_ - 1) * l + E]) ? "2px solid var(--focus-cell-outline)" : "none",
              borderBottomColor: M(i.value[(_ - 1) * l + E]) ? "var(--focus-cell-outline)" : "none"
            }),
            onClick: je((Fe) => Be(Fe, (_ - 1) * l + E), ["prevent", "stop"]),
            class: Ie({
              todaysdate: M(i.value[(_ - 1) * l + E]),
              selecteddate: k(i.value[(_ - 1) * l + E])
            })
          }, D(new Date(i.value[(_ - 1) * l + E]).getDate()), 15, Wt)), 64))
        ])), 64))
      ])
    ], 8, jt));
  }
});
const Yt = /* @__PURE__ */ C(zt, [["__scopeId", "data-v-a53b9422"]]), Gt = /* @__PURE__ */ I({
  __name: "CollapseButton",
  props: {
    collapsed: { type: Boolean }
  },
  setup(e) {
    return (t, n) => (g(), w("button", {
      class: Ie(["collapse-button", e.collapsed ? "rotated" : "unrotated"])
    }, "×", 2));
  }
});
const Kt = /* @__PURE__ */ C(Gt, [["__scopeId", "data-v-6f1c1b45"]]), Jt = /* @__PURE__ */ I({
  __name: "AForm",
  props: {
    modelValue: null,
    data: null,
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = f(n.data || {}), l = (r) => {
      let s = {};
      for (const [u, i] of Object.entries(r))
        ["component", "fieldtype"].includes(u) || (s[u] = i), u === "rows" && i && i.length === 0 && (s.rows = o.value[r.fieldname]);
      return s;
    }, a = S({
      get: () => n.modelValue.map((r, s) => S({
        get() {
          return r.value;
        },
        set: (u) => {
          n.modelValue[s].value = u, t("update:modelValue", n.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (r, s) => (g(), w("form", null, [
      (g(!0), w(F, null, H(e.modelValue, (u, i) => (g(), V(Ne(u.component), We({
        key: i,
        schema: u,
        modelValue: y(a)[i].value,
        "onUpdate:modelValue": (c) => y(a)[i].value = c,
        data: o.value[u.fieldname],
        readonly: e.readonly
      }, l(u)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
});
const Pe = /* @__PURE__ */ C(Jt, [["__scopeId", "data-v-74d66cf2"]]), Xt = /* @__PURE__ */ I({
  __name: "AFieldset",
  props: {
    schema: null,
    label: null,
    collapsible: { type: Boolean },
    data: null
  },
  setup(e) {
    const t = e, n = f(t.data || []);
    let o = f(!1), l = f(t.collapsible);
    const a = f(t.schema);
    function r(s) {
      s.preventDefault(), l.value && (o.value = !o.value);
    }
    return (s, u) => (g(), w("fieldset", null, [
      d("legend", {
        onClick: r,
        onSubmit: r
      }, [
        ze(D(e.label) + " ", 1),
        y(l) ? (g(), V(Kt, {
          key: 0,
          collapsed: y(o)
        }, null, 8, ["collapsed"])) : N("", !0)
      ], 32),
      Ye(s.$slots, "default", { collapsed: y(o) }, () => [
        A(Ge(Pe, {
          modelValue: a.value,
          "onUpdate:modelValue": u[0] || (u[0] = (i) => a.value = i),
          data: n.value
        }, null, 8, ["modelValue", "data"]), [
          [L, !y(o)]
        ])
      ], !0)
    ]));
  }
});
const Zt = /* @__PURE__ */ C(Xt, [["__scopeId", "data-v-cad9b578"]]), en = /* @__PURE__ */ d("p", null, "Hello from the modal!", -1), tn = /* @__PURE__ */ I({
  __name: "AModal",
  props: {
    target: { default: () => ({
      position: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      }
    }) },
    component: null
  },
  setup(e) {
    const t = e, n = f(!1), { target: o, component: l } = q(t.target, t.component);
    return (a, r) => (g(), V(Ke, { to: "amodal" }, [
      n.value ? (g(), w("div", {
        key: 0,
        class: "amodal",
        style: ke({
          top: y(o).position.top,
          left: y(o).position.left,
          width: y(o).position.width,
          height: y(o).position.height
        })
      }, [
        en,
        d("button", {
          onClick: r[0] || (r[0] = (s) => n.value = !1)
        }, "Close")
      ], 4)) : N("", !0)
    ]));
  }
});
const nn = ["id", "disabled", "required"], on = ["for"], ln = ["innerHTML"], an = /* @__PURE__ */ I({
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
    const n = e, o = S({
      get: () => n.modelValue,
      set: (l) => {
        t("update:modelValue", l);
      }
    });
    return (l, a) => (g(), w("div", null, [
      A(d("input", {
        "onUpdate:modelValue": a[0] || (a[0] = (r) => ge(o) ? o.value = r : null),
        type: "number",
        id: e.uuid,
        disabled: e.readonly,
        required: e.required
      }, null, 8, nn), [
        [j, y(o)]
      ]),
      d("label", { for: e.uuid }, D(e.label), 9, on),
      A(d("p", {
        innerHTML: e.validation.errorMessage
      }, null, 8, ln), [
        [L, e.validation.errorMessage]
      ])
    ]));
  }
});
const rn = /* @__PURE__ */ C(an, [["__scopeId", "data-v-be33e6c4"]]), sn = I({
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
    const n = f(!1), o = U("locale", "");
    return { inputText: S({
      get() {
        return e.modelValue;
      },
      set(a) {
        t.emit("update:modelValue", a);
      }
    }), locale: o, maskFilled: n };
  },
  directives: {
    mask: Ee
  }
});
const un = ["id", "disabled", "maxlength", "required"], cn = ["for"], dn = ["innerHTML"];
function pn(e, t, n, o, l, a) {
  const r = we("mask");
  return g(), w("div", null, [
    A(d("input", {
      "onUpdate:modelValue": t[0] || (t[0] = (s) => e.inputText = s),
      id: e.uuid,
      disabled: e.readonly,
      maxlength: e.mask ? e.maskFilled && e.mask.length : void 0,
      required: e.required
    }, null, 8, un), [
      [j, e.inputText],
      [r, e.mask]
    ]),
    d("label", { for: e.uuid }, D(e.label), 9, cn),
    A(d("p", {
      innerHTML: e.validation.errorMessage
    }, null, 8, dn), [
      [L, e.validation.errorMessage]
    ])
  ]);
}
const fn = /* @__PURE__ */ C(sn, [["render", pn], ["__scopeId", "data-v-76dba9b8"]]);
function vn(e) {
  e.component("ACheckbox", ot), e.component("ACombobox", at), e.component("ADate", Dt), e.component("ADatePicker", Yt), e.component("AFieldset", Zt), e.component("AForm", Pe), e.component("AModal", tn), e.component("ANumericInput", rn), e.component("ATextInput", fn);
}
export {
  ot as ACheckbox,
  at as AComboBox,
  Dt as ADate,
  Zt as AFieldset,
  Pe as AForm,
  rn as ANumericInput,
  fn as ATextInput,
  vn as install
};
//# sourceMappingURL=aform.js.map
