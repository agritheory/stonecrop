import { defineComponent as K, ref as N, onMounted as ut, openBlock as $, createElementBlock as T, normalizeClass as bo, createElementVNode as D, Fragment as Ie, renderList as Pe, toDisplayString as ue, createCommentVNode as Oe, withDirectives as dt, vShow as Ht, pushScopeId as Eo, popScopeId as Oo, inject as q, computed as j, watch as ee, getCurrentInstance as ft, nextTick as De, createBlock as Se, resolveDynamicComponent as Ft, mergeProps as Qt, unref as b, getCurrentScope as Wt, onScopeDispose as Gt, effectScope as So, markRaw as ie, onBeforeMount as Dr, shallowRef as Vr, toRaw as pt, reactive as ve, isRef as We, isReactive as zt, toRef as Et, h as ko, provide as nt, toRefs as pn, watchEffect as Lr, normalizeStyle as ce, renderSlot as ge, createVNode as at, withCtx as it, useCssVars as Io, createTextVNode as Po, onBeforeUnmount as Mr, resolveComponent as jr, withKeys as Ye, vModelText as Br } from "vue";
const Kt = (e) => (Eo("data-v-b7fdfbec"), e = e(), Oo(), e), Ur = { class: "action-menu-icon" }, Hr = /* @__PURE__ */ Kt(() => /* @__PURE__ */ D("svg", {
  class: "leftBar",
  version: "1.1",
  id: "Layer_1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  x: "0px",
  y: "0px",
  viewBox: "0 0 100 100",
  "xml:space": "preserve",
  width: "50",
  height: "50"
}, [
  /* @__PURE__ */ D("polygon", { points: "54.2,33.4 29.2,58.8 25,54.6 50,29.2 " })
], -1)), Fr = /* @__PURE__ */ Kt(() => /* @__PURE__ */ D("svg", {
  class: "rightBar",
  version: "1.1",
  id: "Layer_1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  x: "0px",
  y: "0px",
  viewBox: "0 0 100 100",
  "xml:space": "preserve",
  width: "50",
  height: "50"
}, [
  /* @__PURE__ */ D("polygon", { points: "70.8,58.8 45.8,33.4 50,29.2 75,54.6 " })
], -1)), Qr = [
  Hr,
  Fr
], Wr = /* @__PURE__ */ Kt(() => /* @__PURE__ */ D("div", { style: { "margin-right": "30px" } }, null, -1)), Gr = ["onclick"], zr = { key: 1 }, Kr = ["onClick"], qr = { class: "dropdown-container" }, Jr = { class: "dropdown" }, Yr = ["onclick"], Xr = ["href"], Zr = { class: "dropdown-item" }, es = /* @__PURE__ */ K({
  __name: "ActionSet",
  props: {
    elements: null
  },
  setup(e) {
    const t = e, n = N([]), o = N(!1), r = N(null), s = N(!1), a = N(!1);
    ut(() => {
      n.value = t.elements, i();
    });
    const i = () => {
      for (let d of n.value)
        d.elementType === "dropdown" && (d.show = !1);
    }, c = () => {
      s.value = !0, r.value = setTimeout(() => {
        s.value && (o.value = !0);
      }, 500);
    }, u = () => {
      s.value = !1, a.value = !1, clearTimeout(r.value), o.value = !1;
    }, l = (d) => {
      const f = !n.value[d].show;
      i(), n.value[d].show = f;
    };
    return (d, f) => ($(), T("div", {
      class: bo([{ "open-set": o.value, "hovered-and-closed": a.value }, "action-set collapse"]),
      onMouseover: c,
      onMouseleave: u
    }, [
      D("div", Ur, [
        D("div", {
          id: "chevron",
          onClick: f[0] || (f[0] = (p) => a.value = !a.value)
        }, Qr)
      ]),
      Wr,
      ($(!0), T(Ie, null, Pe(n.value, (p, m) => ($(), T("div", {
        class: "action-element",
        key: m
      }, [
        p.elementType == "button" ? ($(), T("button", {
          key: 0,
          onclick: p.action,
          class: "button-default"
        }, ue(p.label), 9, Gr)) : Oe("", !0),
        p.elementType == "dropdown" ? ($(), T("div", zr, [
          D("button", {
            class: "button-default",
            onClick: (v) => l(m)
          }, ue(p.label), 9, Kr),
          dt(D("div", qr, [
            D("div", Jr, [
              ($(!0), T(Ie, null, Pe(p.actions, (v) => ($(), T("div", {
                key: v.label
              }, [
                v.action != null ? ($(), T("button", {
                  key: 0,
                  onclick: v.action,
                  class: "dropdown-item"
                }, ue(v.label), 9, Yr)) : v.link != null ? ($(), T("a", {
                  key: 1,
                  href: v.link
                }, [
                  D("button", Zr, ue(v.label), 1)
                ], 8, Xr)) : Oe("", !0)
              ]))), 128))
            ])
          ], 512), [
            [Ht, p.show]
          ])
        ])) : Oe("", !0)
      ]))), 128))
    ], 34));
  }
});
const qt = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, ts = /* @__PURE__ */ qt(es, [["__scopeId", "data-v-b7fdfbec"]]), ns = {};
function os(e, t) {
  return $(), T("dialog");
}
const rs = /* @__PURE__ */ qt(ns, [["render", os]]), ss = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, hn = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function as(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function is(e) {
  var t;
  let n = e.value;
  if (n) {
    const o = as(n);
    if (o) {
      const r = e.instance.locale;
      n = o(r);
    }
  } else {
    const o = (t = e.instance.schema.fieldtype) == null ? void 0 : t.toLowerCase();
    o && hn[o] && (n = hn[o]);
  }
  return n;
}
function ls(e, t) {
  t || (t = "#");
  let n = e;
  const o = [t, "/", "-", "(", ")", " "];
  for (const r of o)
    n = n.replaceAll(r, "");
  return n;
}
function cs(e, t, n) {
  n || (n = "#");
  let o = t;
  for (const r of e) {
    const s = o.indexOf(n);
    if (s !== -1) {
      const a = o.substring(0, s), i = o.substring(s + 1);
      o = a + r + i;
    }
  }
  return o.slice(0, t.length);
}
function $o(e, t) {
  const n = is(t);
  if (!n)
    return;
  const o = "#", r = e.value, s = ls(r, o);
  if (s) {
    const a = cs(s, n, o);
    t.instance.maskFilled && (t.instance.maskFilled = !a.includes(o)), e.value = a;
  } else
    e.value = n;
}
var mn;
const xo = typeof window < "u", us = (e) => typeof e == "string", ds = () => {
};
xo && (mn = window == null ? void 0 : window.navigator) != null && mn.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function No(e) {
  return typeof e == "function" ? e() : b(e);
}
function fs(e) {
  return e;
}
function Co(e) {
  return Wt() ? (Gt(e), !0) : !1;
}
function Ro(e, t = !0) {
  ft() ? ut(e) : t ? e() : De(e);
}
function lt(e) {
  var t;
  const n = No(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const Ao = xo ? window : void 0;
function vn(...e) {
  let t, n, o, r;
  if (us(e[0]) || Array.isArray(e[0]) ? ([n, o, r] = e, t = Ao) : [t, n, o, r] = e, !t)
    return ds;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const s = [], a = () => {
    s.forEach((l) => l()), s.length = 0;
  }, i = (l, d, f, p) => (l.addEventListener(d, f, p), () => l.removeEventListener(d, f, p)), c = ee(() => [lt(t), No(r)], ([l, d]) => {
    a(), l && s.push(...n.flatMap((f) => o.map((p) => i(l, f, p, d))));
  }, { immediate: !0, flush: "post" }), u = () => {
    c(), a();
  };
  return Co(u), u;
}
function ps(e, t = !1) {
  const n = N(), o = () => n.value = !!e();
  return o(), Ro(o, t), n;
}
const gn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, yn = "__vueuse_ssr_handlers__";
gn[yn] = gn[yn] || {};
var wn = Object.getOwnPropertySymbols, hs = Object.prototype.hasOwnProperty, ms = Object.prototype.propertyIsEnumerable, vs = (e, t) => {
  var n = {};
  for (var o in e)
    hs.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && wn)
    for (var o of wn(e))
      t.indexOf(o) < 0 && ms.call(e, o) && (n[o] = e[o]);
  return n;
};
function gs(e, t, n = {}) {
  const o = n, { window: r = Ao } = o, s = vs(o, ["window"]);
  let a;
  const i = ps(() => r && "ResizeObserver" in r), c = () => {
    a && (a.disconnect(), a = void 0);
  }, u = ee(() => lt(e), (d) => {
    c(), i.value && r && d && (a = new ResizeObserver(t), a.observe(d, s));
  }, { immediate: !0, flush: "post" }), l = () => {
    c(), u();
  };
  return Co(l), {
    isSupported: i,
    stop: l
  };
}
function ys(e, t = {}) {
  const {
    reset: n = !0,
    windowResize: o = !0,
    windowScroll: r = !0,
    immediate: s = !0
  } = t, a = N(0), i = N(0), c = N(0), u = N(0), l = N(0), d = N(0), f = N(0), p = N(0);
  function m() {
    const v = lt(e);
    if (!v) {
      n && (a.value = 0, i.value = 0, c.value = 0, u.value = 0, l.value = 0, d.value = 0, f.value = 0, p.value = 0);
      return;
    }
    const g = v.getBoundingClientRect();
    a.value = g.height, i.value = g.bottom, c.value = g.left, u.value = g.right, l.value = g.top, d.value = g.width, f.value = g.x, p.value = g.y;
  }
  return gs(e, m), ee(() => lt(e), (v) => !v && m()), r && vn("scroll", m, { capture: !0, passive: !0 }), o && vn("resize", m, { passive: !0 }), Ro(() => {
    s && m();
  }), {
    height: a,
    bottom: i,
    left: c,
    right: u,
    top: l,
    width: d,
    x: f,
    y: p,
    update: m
  };
}
var _n;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(_n || (_n = {}));
var ws = Object.defineProperty, bn = Object.getOwnPropertySymbols, _s = Object.prototype.hasOwnProperty, bs = Object.prototype.propertyIsEnumerable, En = (e, t, n) => t in e ? ws(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Es = (e, t) => {
  for (var n in t || (t = {}))
    _s.call(t, n) && En(e, n, t[n]);
  if (bn)
    for (var n of bn(t))
      bs.call(t, n) && En(e, n, t[n]);
  return e;
};
const Os = {
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
Es({
  linear: fs
}, Os);
function On(e, t) {
  if (console.log(e, t), e) {
    const n = ys(e.$el);
    e.position = {
      top: n.bottom.value,
      left: n.left.value,
      width: n.width.value,
      height: "1.15rem"
    };
  }
  return { target: e, component: t };
}
K({
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
    const n = N(!1), o = N(!1), { target: r, component: s } = On(this, "ADatePicker"), a = q("locale", ""), i = j({
      get() {
        return e.modelValue;
      },
      set(c) {
        t.emit("update:modelValue", c);
      }
    });
    return { component: s, inputText: i, locale: a, maskFilled: n, modalOpen: o, target: r, useAModal: On };
  },
  directives: {
    mask: $o
  }
});
var Sn;
const Ss = typeof window < "u";
Ss && (Sn = window == null ? void 0 : window.navigator) != null && Sn.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function ks(e) {
  return e;
}
const kn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, In = "__vueuse_ssr_handlers__";
kn[In] = kn[In] || {};
var Pn;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(Pn || (Pn = {}));
var Is = Object.defineProperty, $n = Object.getOwnPropertySymbols, Ps = Object.prototype.hasOwnProperty, $s = Object.prototype.propertyIsEnumerable, xn = (e, t, n) => t in e ? Is(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, xs = (e, t) => {
  for (var n in t || (t = {}))
    Ps.call(t, n) && xn(e, n, t[n]);
  if ($n)
    for (var n of $n(t))
      $s.call(t, n) && xn(e, n, t[n]);
  return e;
};
const Ns = {
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
xs({
  linear: ks
}, Ns);
const Cs = /* @__PURE__ */ K({
  __name: "AForm",
  props: {
    modelValue: null,
    data: null,
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = N(n.data || {}), r = (a) => {
      let i = {};
      for (const [c, u] of Object.entries(a))
        ["component", "fieldtype"].includes(c) || (i[c] = u), c === "rows" && u && u.length === 0 && (i.rows = o.value[a.fieldname]);
      return i;
    }, s = j({
      get: () => n.modelValue.map((a, i) => j({
        get() {
          return a.value;
        },
        set: (c) => {
          n.modelValue[i].value = c, t("update:modelValue", n.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (a, i) => ($(), T("form", null, [
      ($(!0), T(Ie, null, Pe(e.modelValue, (c, u) => ($(), Se(Ft(c.component), Qt({
        key: u,
        schema: c,
        modelValue: b(s)[u].value,
        "onUpdate:modelValue": (l) => b(s)[u].value = l,
        data: o.value[c.fieldname],
        readonly: e.readonly
      }, r(c)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
}), Rs = /* @__PURE__ */ ss(Cs, [["__scopeId", "data-v-74d66cf2"]]);
K({
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
    const n = N(!1), o = q("locale", "");
    return { inputText: j({
      get() {
        return e.modelValue;
      },
      set(r) {
        t.emit("update:modelValue", r);
      }
    }), locale: o, maskFilled: n };
  },
  directives: {
    mask: $o
  }
});
class Ue {
  /**
   * @constructor
   * @param {Registry} registry - The immutable registry
   * @param {ReturnType<typeof useDataStore>} store - The mutable Pinia store
   * @param {Schema} [schema] - (optional) The Stonecrop schema
   * @param {ImmutableDoctype['workflow']} [workflow] - (optional) The Stonecrop workflow
   * @param {ImmutableDoctype['actions']} [actions] - (optional) The Stonecrop actions
   * @returns {Stonecrop} The Stonecrop instance
   */
  constructor(t, n, o, r, s) {
    if (this.name = "Stonecrop", Ue._root)
      return Ue._root;
    Ue._root = this, this.registry = t, this.store = n, this.schema = o, this.workflow = r, this.actions = s;
  }
  /**
   * @method setup
   * @param {DoctypeMeta} doctype - The doctype to setup
   * @returns {void}
   * @description Sets up the Stonecrop instance with the given doctype
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.setup(doctype)
   */
  setup(t) {
    this.getMeta(t), this.getWorkflow(t), this.getActions(t);
  }
  /**
   * @method getMeta
   * @param {DoctypeMeta} doctype - The doctype to get meta for
   * @returns {void}
   * @description Gets the meta for the given doctype
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.getMeta(doctype)
   */
  getMeta(t) {
    this.schema = { doctype: t.doctype, schema: t.schema };
  }
  /**
   * @method getWorkflow
   * @param {DoctypeMeta} doctype - The doctype to get workflow for
   * @returns {void}
   * @description Gets the workflow for the given doctype
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.getWorkflow(doctype)
   */
  getWorkflow(t) {
    const n = this.registry.registry[t.slug];
    this.workflow = n.workflow;
  }
  /**
   * @method getActions
   * @param {DoctypeMeta} doctype - The doctype to get actions for
   * @returns {void}
   * @description Gets the actions for the given doctype
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.getActions(doctype)
   */
  getActions(t) {
    const n = this.registry.registry[t.slug];
    this.actions = n.actions;
  }
  /**
   * @method getRecords
   * @param {DoctypeMeta} doctype - The doctype to get records for
   * @param {RequestInit} [filters] - The filters to apply to the records
   * @returns {Promise<void>}
   * @description Gets the records for the given doctype
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * await stonecrop.getRecords(doctype)
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * const filters = JSON.stringify({ status: 'Open' })
   * await stonecrop.getRecords(doctype, { body: filters })
   */
  async getRecords(t, n) {
    this.store.$patch({ records: [] });
    const r = await (await fetch(`/${t.slug}`, n)).json();
    this.store.$patch({ records: r });
  }
  /**
   * @method getRecord
   * @param {DoctypeMeta} doctype - The doctype to get record for
   * @param {string} id - The id of the record to get
   * @returns {Promise<void>}
   * @description Gets the record for the given doctype and id
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * await stonecrop.getRecord(doctype, 'TASK-00001')
   */
  async getRecord(t, n) {
    this.store.$patch({ record: {} });
    const r = await (await fetch(`/${t.slug}/${n}`)).json();
    this.store.$patch({ record: r });
  }
  /**
   * @method runAction
   * @param {DoctypeMeta} doctype - The doctype to run action for
   * @param {string} action - The action to run
   * @param {string[]} [id] - The id(s) of the record(s) to run action on
   * @returns {void}
   * @description Runs the action for the given doctype and id
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.runAction(doctype, 'CREATE')
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.runAction(doctype, 'UPDATE', ['TASK-00001'])
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.runAction(doctype, 'DELETE', ['TASK-00001'])
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.runAction(doctype, 'TRANSITION', ['TASK-00001', 'TASK-00002'])
   */
  runAction(t, n, o) {
    const s = this.registry.registry[t.slug].actions.get(n), { initialState: a } = this.workflow;
    this.workflow.transition(a, { type: n }), s.length > 0 && s.forEach((i) => {
      new Function(i)(o);
    });
  }
}
var To = !1;
function Xe(e, t, n) {
  return Array.isArray(e) ? (e.length = Math.max(e.length, t), e.splice(t, 1, n), n) : (e[t] = n, n);
}
function Ot(e, t) {
  if (Array.isArray(e)) {
    e.splice(t, 1);
    return;
  }
  delete e[t];
}
function As() {
  return Do().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function Do() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const Ts = typeof Proxy == "function", Ds = "devtools-plugin:setup", Vs = "plugin:settings:set";
let xe, Nt;
function Ls() {
  var e;
  return xe !== void 0 || (typeof window < "u" && window.performance ? (xe = !0, Nt = window.performance) : typeof global < "u" && (!((e = global.perf_hooks) === null || e === void 0) && e.performance) ? (xe = !0, Nt = global.perf_hooks.performance) : xe = !1), xe;
}
function Ms() {
  return Ls() ? Nt.now() : Date.now();
}
let js = class {
  constructor(t, n) {
    this.target = null, this.targetQueue = [], this.onQueue = [], this.plugin = t, this.hook = n;
    const o = {};
    if (t.settings)
      for (const a in t.settings) {
        const i = t.settings[a];
        o[a] = i.defaultValue;
      }
    const r = `__vue-devtools-plugin-settings__${t.id}`;
    let s = Object.assign({}, o);
    try {
      const a = localStorage.getItem(r), i = JSON.parse(a);
      Object.assign(s, i);
    } catch {
    }
    this.fallbacks = {
      getSettings() {
        return s;
      },
      setSettings(a) {
        try {
          localStorage.setItem(r, JSON.stringify(a));
        } catch {
        }
        s = a;
      },
      now() {
        return Ms();
      }
    }, n && n.on(Vs, (a, i) => {
      a === this.plugin.id && this.fallbacks.setSettings(i);
    }), this.proxiedOn = new Proxy({}, {
      get: (a, i) => this.target ? this.target.on[i] : (...c) => {
        this.onQueue.push({
          method: i,
          args: c
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (a, i) => this.target ? this.target[i] : i === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(i) ? (...c) => (this.targetQueue.push({
        method: i,
        args: c,
        resolve: () => {
        }
      }), this.fallbacks[i](...c)) : (...c) => new Promise((u) => {
        this.targetQueue.push({
          method: i,
          args: c,
          resolve: u
        });
      })
    });
  }
  async setRealTarget(t) {
    this.target = t;
    for (const n of this.onQueue)
      this.target.on[n.method](...n.args);
    for (const n of this.targetQueue)
      n.resolve(await this.target[n.method](...n.args));
  }
};
function Vo(e, t) {
  const n = e, o = Do(), r = As(), s = Ts && n.enableEarlyProxy;
  if (r && (o.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !s))
    r.emit(Ds, e, t);
  else {
    const a = s ? new js(n, r) : null;
    (o.__VUE_DEVTOOLS_PLUGINS__ = o.__VUE_DEVTOOLS_PLUGINS__ || []).push({
      pluginDescriptor: n,
      setupFn: t,
      proxy: a
    }), a && t(a.proxiedTarget);
  }
}
/*!
  * pinia v2.0.33
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
let Be;
const Ge = (e) => Be = e, Lo = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
  /* istanbul ignore next */
  Symbol()
);
function $e(e) {
  return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var re;
(function(e) {
  e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(re || (re = {}));
const ht = typeof window < "u", He = (process.env.NODE_ENV !== "production" || !1) && process.env.NODE_ENV !== "test" && ht, Nn = /* @__PURE__ */ (() => typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null })();
function Bs(e, { autoBom: t = !1 } = {}) {
  return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob([String.fromCharCode(65279), e], { type: e.type }) : e;
}
function Jt(e, t, n) {
  const o = new XMLHttpRequest();
  o.open("GET", e), o.responseType = "blob", o.onload = function() {
    Bo(o.response, t, n);
  }, o.onerror = function() {
    console.error("could not download file");
  }, o.send();
}
function Mo(e) {
  const t = new XMLHttpRequest();
  t.open("HEAD", e, !1);
  try {
    t.send();
  } catch {
  }
  return t.status >= 200 && t.status <= 299;
}
function ot(e) {
  try {
    e.dispatchEvent(new MouseEvent("click"));
  } catch {
    const n = document.createEvent("MouseEvents");
    n.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), e.dispatchEvent(n);
  }
}
const rt = typeof navigator == "object" ? navigator : { userAgent: "" }, jo = /* @__PURE__ */ (() => /Macintosh/.test(rt.userAgent) && /AppleWebKit/.test(rt.userAgent) && !/Safari/.test(rt.userAgent))(), Bo = ht ? (
  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
  typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !jo ? Us : (
    // Use msSaveOrOpenBlob as a second approach
    "msSaveOrOpenBlob" in rt ? Hs : (
      // Fallback to using FileReader and a popup
      Fs
    )
  )
) : () => {
};
function Us(e, t = "download", n) {
  const o = document.createElement("a");
  o.download = t, o.rel = "noopener", typeof e == "string" ? (o.href = e, o.origin !== location.origin ? Mo(o.href) ? Jt(e, t, n) : (o.target = "_blank", ot(o)) : ot(o)) : (o.href = URL.createObjectURL(e), setTimeout(function() {
    URL.revokeObjectURL(o.href);
  }, 4e4), setTimeout(function() {
    ot(o);
  }, 0));
}
function Hs(e, t = "download", n) {
  if (typeof e == "string")
    if (Mo(e))
      Jt(e, t, n);
    else {
      const o = document.createElement("a");
      o.href = e, o.target = "_blank", setTimeout(function() {
        ot(o);
      });
    }
  else
    navigator.msSaveOrOpenBlob(Bs(e, n), t);
}
function Fs(e, t, n, o) {
  if (o = o || open("", "_blank"), o && (o.document.title = o.document.body.innerText = "downloading..."), typeof e == "string")
    return Jt(e, t, n);
  const r = e.type === "application/octet-stream", s = /constructor/i.test(String(Nn.HTMLElement)) || "safari" in Nn, a = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((a || r && s || jo) && typeof FileReader < "u") {
    const i = new FileReader();
    i.onloadend = function() {
      let c = i.result;
      if (typeof c != "string")
        throw o = null, new Error("Wrong reader.result type");
      c = a ? c : c.replace(/^data:[^;]*;/, "data:attachment/file;"), o ? o.location.href = c : location.assign(c), o = null;
    }, i.readAsDataURL(e);
  } else {
    const i = URL.createObjectURL(e);
    o ? o.location.assign(i) : location.href = i, o = null, setTimeout(function() {
      URL.revokeObjectURL(i);
    }, 4e4);
  }
}
function H(e, t) {
  const n = "🍍 " + e;
  typeof __VUE_DEVTOOLS_TOAST__ == "function" ? __VUE_DEVTOOLS_TOAST__(n, t) : t === "error" ? console.error(n) : t === "warn" ? console.warn(n) : console.log(n);
}
function Yt(e) {
  return "_a" in e && "install" in e;
}
function Uo() {
  if (!("clipboard" in navigator))
    return H("Your browser doesn't support the Clipboard API", "error"), !0;
}
function Ho(e) {
  return e instanceof Error && e.message.toLowerCase().includes("document is not focused") ? (H('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn"), !0) : !1;
}
async function Qs(e) {
  if (!Uo())
    try {
      await navigator.clipboard.writeText(JSON.stringify(e.state.value)), H("Global state copied to clipboard.");
    } catch (t) {
      if (Ho(t))
        return;
      H("Failed to serialize the state. Check the console for more details.", "error"), console.error(t);
    }
}
async function Ws(e) {
  if (!Uo())
    try {
      e.state.value = JSON.parse(await navigator.clipboard.readText()), H("Global state pasted from clipboard.");
    } catch (t) {
      if (Ho(t))
        return;
      H("Failed to deserialize the state from clipboard. Check the console for more details.", "error"), console.error(t);
    }
}
async function Gs(e) {
  try {
    Bo(new Blob([JSON.stringify(e.state.value)], {
      type: "text/plain;charset=utf-8"
    }), "pinia-state.json");
  } catch (t) {
    H("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
let se;
function zs() {
  se || (se = document.createElement("input"), se.type = "file", se.accept = ".json");
  function e() {
    return new Promise((t, n) => {
      se.onchange = async () => {
        const o = se.files;
        if (!o)
          return t(null);
        const r = o.item(0);
        return t(r ? { text: await r.text(), file: r } : null);
      }, se.oncancel = () => t(null), se.onerror = n, se.click();
    });
  }
  return e;
}
async function Ks(e) {
  try {
    const n = await (await zs())();
    if (!n)
      return;
    const { text: o, file: r } = n;
    e.state.value = JSON.parse(o), H(`Global state imported from "${r.name}".`);
  } catch (t) {
    H("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
function te(e) {
  return {
    _custom: {
      display: e
    }
  };
}
const Fo = "🍍 Pinia (root)", Ct = "_root";
function qs(e) {
  return Yt(e) ? {
    id: Ct,
    label: Fo
  } : {
    id: e.$id,
    label: e.$id
  };
}
function Js(e) {
  if (Yt(e)) {
    const n = Array.from(e._s.keys()), o = e._s;
    return {
      state: n.map((s) => ({
        editable: !0,
        key: s,
        value: e.state.value[s]
      })),
      getters: n.filter((s) => o.get(s)._getters).map((s) => {
        const a = o.get(s);
        return {
          editable: !1,
          key: s,
          value: a._getters.reduce((i, c) => (i[c] = a[c], i), {})
        };
      })
    };
  }
  const t = {
    state: Object.keys(e.$state).map((n) => ({
      editable: !0,
      key: n,
      value: e.$state[n]
    }))
  };
  return e._getters && e._getters.length && (t.getters = e._getters.map((n) => ({
    editable: !1,
    key: n,
    value: e[n]
  }))), e._customProperties.size && (t.customProperties = Array.from(e._customProperties).map((n) => ({
    editable: !0,
    key: n,
    value: e[n]
  }))), t;
}
function Ys(e) {
  return e ? Array.isArray(e) ? e.reduce((t, n) => (t.keys.push(n.key), t.operations.push(n.type), t.oldValue[n.key] = n.oldValue, t.newValue[n.key] = n.newValue, t), {
    oldValue: {},
    keys: [],
    operations: [],
    newValue: {}
  }) : {
    operation: te(e.type),
    key: te(e.key),
    oldValue: e.oldValue,
    newValue: e.newValue
  } : {};
}
function Xs(e) {
  switch (e) {
    case re.direct:
      return "mutation";
    case re.patchFunction:
      return "$patch";
    case re.patchObject:
      return "$patch";
    default:
      return "unknown";
  }
}
let Ae = !0;
const st = [], be = "pinia:mutations", G = "pinia", { assign: Zs } = Object, ct = (e) => "🍍 " + e;
function ea(e, t) {
  Vo({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes: st,
    app: e
  }, (n) => {
    typeof n.now != "function" && H("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."), n.addTimelineLayer({
      id: be,
      label: "Pinia 🍍",
      color: 15064968
    }), n.addInspector({
      id: G,
      label: "Pinia 🍍",
      icon: "storage",
      treeFilterPlaceholder: "Search stores",
      actions: [
        {
          icon: "content_copy",
          action: () => {
            Qs(t);
          },
          tooltip: "Serialize and copy the state"
        },
        {
          icon: "content_paste",
          action: async () => {
            await Ws(t), n.sendInspectorTree(G), n.sendInspectorState(G);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            Gs(t);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await Ks(t), n.sendInspectorTree(G), n.sendInspectorState(G);
          },
          tooltip: "Import the state from a JSON file"
        }
      ],
      nodeActions: [
        {
          icon: "restore",
          tooltip: "Reset the state (option store only)",
          action: (o) => {
            const r = t._s.get(o);
            r ? r._isOptionsAPI ? (r.$reset(), H(`Store "${o}" reset.`)) : H(`Cannot reset "${o}" store because it's a setup store.`, "warn") : H(`Cannot reset "${o}" store because it wasn't found.`, "warn");
          }
        }
      ]
    }), n.on.inspectComponent((o, r) => {
      const s = o.componentInstance && o.componentInstance.proxy;
      if (s && s._pStores) {
        const a = o.componentInstance.proxy._pStores;
        Object.values(a).forEach((i) => {
          o.instanceData.state.push({
            type: ct(i.$id),
            key: "state",
            editable: !0,
            value: i._isOptionsAPI ? {
              _custom: {
                value: pt(i.$state),
                actions: [
                  {
                    icon: "restore",
                    tooltip: "Reset the state of this store",
                    action: () => i.$reset()
                  }
                ]
              }
            } : (
              // NOTE: workaround to unwrap transferred refs
              Object.keys(i.$state).reduce((c, u) => (c[u] = i.$state[u], c), {})
            )
          }), i._getters && i._getters.length && o.instanceData.state.push({
            type: ct(i.$id),
            key: "getters",
            editable: !1,
            value: i._getters.reduce((c, u) => {
              try {
                c[u] = i[u];
              } catch (l) {
                c[u] = l;
              }
              return c;
            }, {})
          });
        });
      }
    }), n.on.getInspectorTree((o) => {
      if (o.app === e && o.inspectorId === G) {
        let r = [t];
        r = r.concat(Array.from(t._s.values())), o.rootNodes = (o.filter ? r.filter((s) => "$id" in s ? s.$id.toLowerCase().includes(o.filter.toLowerCase()) : Fo.toLowerCase().includes(o.filter.toLowerCase())) : r).map(qs);
      }
    }), n.on.getInspectorState((o) => {
      if (o.app === e && o.inspectorId === G) {
        const r = o.nodeId === Ct ? t : t._s.get(o.nodeId);
        if (!r)
          return;
        r && (o.state = Js(r));
      }
    }), n.on.editInspectorState((o, r) => {
      if (o.app === e && o.inspectorId === G) {
        const s = o.nodeId === Ct ? t : t._s.get(o.nodeId);
        if (!s)
          return H(`store "${o.nodeId}" not found`, "error");
        const { path: a } = o;
        Yt(s) ? a.unshift("state") : (a.length !== 1 || !s._customProperties.has(a[0]) || a[0] in s.$state) && a.unshift("$state"), Ae = !1, o.set(s, a, o.state.value), Ae = !0;
      }
    }), n.on.editComponentState((o) => {
      if (o.type.startsWith("🍍")) {
        const r = o.type.replace(/^🍍\s*/, ""), s = t._s.get(r);
        if (!s)
          return H(`store "${r}" not found`, "error");
        const { path: a } = o;
        if (a[0] !== "state")
          return H(`Invalid path for store "${r}":
${a}
Only state can be modified.`);
        a[0] = "$state", Ae = !1, o.set(s, a, o.state.value), Ae = !0;
      }
    });
  });
}
function ta(e, t) {
  st.includes(ct(t.$id)) || st.push(ct(t.$id)), Vo({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes: st,
    app: e,
    settings: {
      logStoreChanges: {
        label: "Notify about new/deleted stores",
        type: "boolean",
        defaultValue: !0
      }
      // useEmojis: {
      //   label: 'Use emojis in messages ⚡️',
      //   type: 'boolean',
      //   defaultValue: true,
      // },
    }
  }, (n) => {
    const o = typeof n.now == "function" ? n.now.bind(n) : Date.now;
    t.$onAction(({ after: a, onError: i, name: c, args: u }) => {
      const l = Qo++;
      n.addTimelineEvent({
        layerId: be,
        event: {
          time: o(),
          title: "🛫 " + c,
          subtitle: "start",
          data: {
            store: te(t.$id),
            action: te(c),
            args: u
          },
          groupId: l
        }
      }), a((d) => {
        Ee = void 0, n.addTimelineEvent({
          layerId: be,
          event: {
            time: o(),
            title: "🛬 " + c,
            subtitle: "end",
            data: {
              store: te(t.$id),
              action: te(c),
              args: u,
              result: d
            },
            groupId: l
          }
        });
      }), i((d) => {
        Ee = void 0, n.addTimelineEvent({
          layerId: be,
          event: {
            time: o(),
            logType: "error",
            title: "💥 " + c,
            subtitle: "end",
            data: {
              store: te(t.$id),
              action: te(c),
              args: u,
              error: d
            },
            groupId: l
          }
        });
      });
    }, !0), t._customProperties.forEach((a) => {
      ee(() => b(t[a]), (i, c) => {
        n.notifyComponentUpdate(), n.sendInspectorState(G), Ae && n.addTimelineEvent({
          layerId: be,
          event: {
            time: o(),
            title: "Change",
            subtitle: a,
            data: {
              newValue: i,
              oldValue: c
            },
            groupId: Ee
          }
        });
      }, { deep: !0 });
    }), t.$subscribe(({ events: a, type: i }, c) => {
      if (n.notifyComponentUpdate(), n.sendInspectorState(G), !Ae)
        return;
      const u = {
        time: o(),
        title: Xs(i),
        data: Zs({ store: te(t.$id) }, Ys(a)),
        groupId: Ee
      };
      Ee = void 0, i === re.patchFunction ? u.subtitle = "⤵️" : i === re.patchObject ? u.subtitle = "🧩" : a && !Array.isArray(a) && (u.subtitle = a.type), a && (u.data["rawEvent(s)"] = {
        _custom: {
          display: "DebuggerEvent",
          type: "object",
          tooltip: "raw DebuggerEvent[]",
          value: a
        }
      }), n.addTimelineEvent({
        layerId: be,
        event: u
      });
    }, { detached: !0, flush: "sync" });
    const r = t._hotUpdate;
    t._hotUpdate = ie((a) => {
      r(a), n.addTimelineEvent({
        layerId: be,
        event: {
          time: o(),
          title: "🔥 " + t.$id,
          subtitle: "HMR update",
          data: {
            store: te(t.$id),
            info: te("HMR update")
          }
        }
      }), n.notifyComponentUpdate(), n.sendInspectorTree(G), n.sendInspectorState(G);
    });
    const { $dispose: s } = t;
    t.$dispose = () => {
      s(), n.notifyComponentUpdate(), n.sendInspectorTree(G), n.sendInspectorState(G), n.getSettings().logStoreChanges && H(`Disposed "${t.$id}" store 🗑`);
    }, n.notifyComponentUpdate(), n.sendInspectorTree(G), n.sendInspectorState(G), n.getSettings().logStoreChanges && H(`"${t.$id}" store installed 🆕`);
  });
}
let Qo = 0, Ee;
function Cn(e, t) {
  const n = t.reduce((o, r) => (o[r] = pt(e)[r], o), {});
  for (const o in n)
    e[o] = function() {
      const r = Qo, s = new Proxy(e, {
        get(...a) {
          return Ee = r, Reflect.get(...a);
        },
        set(...a) {
          return Ee = r, Reflect.set(...a);
        }
      });
      return n[o].apply(s, arguments);
    };
}
function na({ app: e, store: t, options: n }) {
  if (!t.$id.startsWith("__hot:")) {
    if (n.state && (t._isOptionsAPI = !0), typeof n.state == "function") {
      Cn(
        // @ts-expect-error: can cast the store...
        t,
        Object.keys(n.actions)
      );
      const o = t._hotUpdate;
      pt(t)._hotUpdate = function(r) {
        o.apply(this, arguments), Cn(t, Object.keys(r._hmrPayload.actions));
      };
    }
    ta(
      e,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      t
    );
  }
}
function oa() {
  const e = So(!0), t = e.run(() => N({}));
  let n = [], o = [];
  const r = ie({
    install(s) {
      Ge(r), r._a = s, s.provide(Lo, r), s.config.globalProperties.$pinia = r, He && ea(s, r), o.forEach((a) => n.push(a)), o = [];
    },
    use(s) {
      return !this._a && !To ? o.push(s) : n.push(s), this;
    },
    _p: n,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return He && typeof Proxy < "u" && r.use(na), r;
}
function Wo(e, t) {
  for (const n in t) {
    const o = t[n];
    if (!(n in e))
      continue;
    const r = e[n];
    $e(r) && $e(o) && !We(o) && !zt(o) ? e[n] = Wo(r, o) : e[n] = o;
  }
  return e;
}
const Go = () => {
};
function Rn(e, t, n, o = Go) {
  e.push(t);
  const r = () => {
    const s = e.indexOf(t);
    s > -1 && (e.splice(s, 1), o());
  };
  return !n && Wt() && Gt(r), r;
}
function Ne(e, ...t) {
  e.slice().forEach((n) => {
    n(...t);
  });
}
function Rt(e, t) {
  e instanceof Map && t instanceof Map && t.forEach((n, o) => e.set(o, n)), e instanceof Set && t instanceof Set && t.forEach(e.add, e);
  for (const n in t) {
    if (!t.hasOwnProperty(n))
      continue;
    const o = t[n], r = e[n];
    $e(r) && $e(o) && e.hasOwnProperty(n) && !We(o) && !zt(o) ? e[n] = Rt(r, o) : e[n] = o;
  }
  return e;
}
const ra = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
);
function sa(e) {
  return !$e(e) || !e.hasOwnProperty(ra);
}
const { assign: Z } = Object;
function An(e) {
  return !!(We(e) && e.effect);
}
function Tn(e, t, n, o) {
  const { state: r, actions: s, getters: a } = t, i = n.state.value[e];
  let c;
  function u() {
    !i && (process.env.NODE_ENV === "production" || !o) && (n.state.value[e] = r ? r() : {});
    const l = process.env.NODE_ENV !== "production" && o ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      pn(N(r ? r() : {}).value)
    ) : pn(n.state.value[e]);
    return Z(l, s, Object.keys(a || {}).reduce((d, f) => (process.env.NODE_ENV !== "production" && f in l && console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${f}" in store "${e}".`), d[f] = ie(j(() => {
      Ge(n);
      const p = n._s.get(e);
      return a[f].call(p, p);
    })), d), {}));
  }
  return c = At(e, u, t, n, o, !0), c;
}
function At(e, t, n = {}, o, r, s) {
  let a;
  const i = Z({ actions: {} }, n);
  if (process.env.NODE_ENV !== "production" && !o._e.active)
    throw new Error("Pinia destroyed");
  const c = {
    deep: !0
    // flush: 'post',
  };
  process.env.NODE_ENV !== "production" && !To && (c.onTrigger = (O) => {
    u ? p = O : u == !1 && !S._hotUpdating && (Array.isArray(p) ? p.push(O) : console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug."));
  });
  let u, l, d = ie([]), f = ie([]), p;
  const m = o.state.value[e];
  !s && !m && (process.env.NODE_ENV === "production" || !r) && (o.state.value[e] = {});
  const v = N({});
  let g;
  function k(O) {
    let w;
    u = l = !1, process.env.NODE_ENV !== "production" && (p = []), typeof O == "function" ? (O(o.state.value[e]), w = {
      type: re.patchFunction,
      storeId: e,
      events: p
    }) : (Rt(o.state.value[e], O), w = {
      type: re.patchObject,
      payload: O,
      storeId: e,
      events: p
    });
    const V = g = Symbol();
    De().then(() => {
      g === V && (u = !0);
    }), l = !0, Ne(d, w, o.state.value[e]);
  }
  const I = s ? function() {
    const { state: w } = n, V = w ? w() : {};
    this.$patch((B) => {
      Z(B, V);
    });
  } : (
    /* istanbul ignore next */
    process.env.NODE_ENV !== "production" ? () => {
      throw new Error(`🍍: Store "${e}" is built using the setup syntax and does not implement $reset().`);
    } : Go
  );
  function L() {
    a.stop(), d = [], f = [], o._s.delete(e);
  }
  function F(O, w) {
    return function() {
      Ge(o);
      const V = Array.from(arguments), B = [], we = [];
      function Le(W) {
        B.push(W);
      }
      function Je(W) {
        we.push(W);
      }
      Ne(f, {
        args: V,
        name: O,
        store: S,
        after: Le,
        onError: Je
      });
      let oe;
      try {
        oe = w.apply(this && this.$id === e ? this : S, V);
      } catch (W) {
        throw Ne(we, W), W;
      }
      return oe instanceof Promise ? oe.then((W) => (Ne(B, W), W)).catch((W) => (Ne(we, W), Promise.reject(W))) : (Ne(B, oe), oe);
    };
  }
  const Y = /* @__PURE__ */ ie({
    actions: {},
    getters: {},
    state: [],
    hotState: v
  }), X = {
    _p: o,
    // _s: scope,
    $id: e,
    $onAction: Rn.bind(null, f),
    $patch: k,
    $reset: I,
    $subscribe(O, w = {}) {
      const V = Rn(d, O, w.detached, () => B()), B = a.run(() => ee(() => o.state.value[e], (we) => {
        (w.flush === "sync" ? l : u) && O({
          storeId: e,
          type: re.direct,
          events: p
        }, we);
      }, Z({}, c, w)));
      return V;
    },
    $dispose: L
  }, S = ve(process.env.NODE_ENV !== "production" || He ? Z(
    {
      _hmrPayload: Y,
      _customProperties: ie(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    X
    // must be added later
    // setupStore
  ) : X);
  o._s.set(e, S);
  const ne = o._e.run(() => (a = So(), a.run(() => t())));
  for (const O in ne) {
    const w = ne[O];
    if (We(w) && !An(w) || zt(w))
      process.env.NODE_ENV !== "production" && r ? Xe(v.value, O, Et(ne, O)) : s || (m && sa(w) && (We(w) ? w.value = m[O] : Rt(w, m[O])), o.state.value[e][O] = w), process.env.NODE_ENV !== "production" && Y.state.push(O);
    else if (typeof w == "function") {
      const V = process.env.NODE_ENV !== "production" && r ? w : F(O, w);
      ne[O] = V, process.env.NODE_ENV !== "production" && (Y.actions[O] = w), i.actions[O] = w;
    } else
      process.env.NODE_ENV !== "production" && An(w) && (Y.getters[O] = s ? (
        // @ts-expect-error
        n.getters[O]
      ) : w, ht && (ne._getters || // @ts-expect-error: same
      (ne._getters = ie([]))).push(O));
  }
  if (Z(S, ne), Z(pt(S), ne), Object.defineProperty(S, "$state", {
    get: () => process.env.NODE_ENV !== "production" && r ? v.value : o.state.value[e],
    set: (O) => {
      if (process.env.NODE_ENV !== "production" && r)
        throw new Error("cannot set hotState");
      k((w) => {
        Z(w, O);
      });
    }
  }), process.env.NODE_ENV !== "production" && (S._hotUpdate = ie((O) => {
    S._hotUpdating = !0, O._hmrPayload.state.forEach((w) => {
      if (w in S.$state) {
        const V = O.$state[w], B = S.$state[w];
        typeof V == "object" && $e(V) && $e(B) ? Wo(V, B) : O.$state[w] = B;
      }
      Xe(S, w, Et(O.$state, w));
    }), Object.keys(S.$state).forEach((w) => {
      w in O.$state || Ot(S, w);
    }), u = !1, l = !1, o.state.value[e] = Et(O._hmrPayload, "hotState"), l = !0, De().then(() => {
      u = !0;
    });
    for (const w in O._hmrPayload.actions) {
      const V = O[w];
      Xe(S, w, F(w, V));
    }
    for (const w in O._hmrPayload.getters) {
      const V = O._hmrPayload.getters[w], B = s ? (
        // special handling of options api
        j(() => (Ge(o), V.call(S, S)))
      ) : V;
      Xe(S, w, B);
    }
    Object.keys(S._hmrPayload.getters).forEach((w) => {
      w in O._hmrPayload.getters || Ot(S, w);
    }), Object.keys(S._hmrPayload.actions).forEach((w) => {
      w in O._hmrPayload.actions || Ot(S, w);
    }), S._hmrPayload = O._hmrPayload, S._getters = O._getters, S._hotUpdating = !1;
  })), He) {
    const O = {
      writable: !0,
      configurable: !0,
      // avoid warning on devtools trying to display this property
      enumerable: !1
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((w) => {
      Object.defineProperty(S, w, Z({ value: S[w] }, O));
    });
  }
  return o._p.forEach((O) => {
    if (He) {
      const w = a.run(() => O({
        store: S,
        app: o._a,
        pinia: o,
        options: i
      }));
      Object.keys(w || {}).forEach((V) => S._customProperties.add(V)), Z(S, w);
    } else
      Z(S, a.run(() => O({
        store: S,
        app: o._a,
        pinia: o,
        options: i
      })));
  }), process.env.NODE_ENV !== "production" && S.$state && typeof S.$state == "object" && typeof S.$state.constructor == "function" && !S.$state.constructor.toString().includes("[native code]") && console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${S.$id}".`), m && s && n.hydrate && n.hydrate(S.$state, m), u = !0, l = !0, S;
}
function aa(e, t, n) {
  let o, r;
  const s = typeof t == "function";
  typeof e == "string" ? (o = e, r = s ? n : t) : (r = e, o = e.id);
  function a(i, c) {
    const u = ft();
    if (i = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (process.env.NODE_ENV === "test" && Be && Be._testing ? null : i) || u && q(Lo, null), i && Ge(i), process.env.NODE_ENV !== "production" && !Be)
      throw new Error(`[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?
	const pinia = createPinia()
	app.use(pinia)
This will fail in production.`);
    i = Be, i._s.has(o) || (s ? At(o, t, r, i) : Tn(o, r, i), process.env.NODE_ENV !== "production" && (a._pinia = i));
    const l = i._s.get(o);
    if (process.env.NODE_ENV !== "production" && c) {
      const d = "__hot:" + o, f = s ? At(d, t, r, i, !0) : Tn(d, Z({}, r), i, !0);
      c._hotUpdate(f), delete i.state.value[d], i._s.delete(d);
    }
    if (process.env.NODE_ENV !== "production" && ht && u && u.proxy && // avoid adding stores that are just built for hot module replacement
    !c) {
      const d = u.proxy, f = "_pStores" in d ? d._pStores : d._pStores = {};
      f[o] = l;
    }
    return l;
  }
  return a.$id = o, a;
}
const ia = aa("data", () => {
  const e = N([]), t = N({});
  return { records: e, record: t };
});
function zo(e) {
  e || (e = q("$registry"));
  const t = ia(), n = N(new Ue(e, t)), o = N(!1);
  return Dr(async () => {
    var r, s;
    const a = e.router.currentRoute.value, i = (r = a.params.records) == null ? void 0 : r.toString().toLowerCase(), c = (s = a.params.record) == null ? void 0 : s.toString().toLowerCase();
    if (!i && !c)
      return;
    const u = await e.doctypeLoader(i);
    e.addDoctype(u), n.value.setup(u), i && (c ? await n.value.getRecord(u, c) : await n.value.getRecords(u)), n.value.runAction(u, "LOAD", c ? [c] : void 0), o.value = !0;
  }), { stonecrop: n, isReady: o };
}
function la() {
  return Ko().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function Ko() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const ca = typeof Proxy == "function", ua = "devtools-plugin:setup", da = "plugin:settings:set";
let Ce, Tt;
function fa() {
  var e;
  return Ce !== void 0 || (typeof window < "u" && window.performance ? (Ce = !0, Tt = window.performance) : typeof global < "u" && (!((e = global.perf_hooks) === null || e === void 0) && e.performance) ? (Ce = !0, Tt = global.perf_hooks.performance) : Ce = !1), Ce;
}
function pa() {
  return fa() ? Tt.now() : Date.now();
}
class ha {
  constructor(t, n) {
    this.target = null, this.targetQueue = [], this.onQueue = [], this.plugin = t, this.hook = n;
    const o = {};
    if (t.settings)
      for (const a in t.settings) {
        const i = t.settings[a];
        o[a] = i.defaultValue;
      }
    const r = `__vue-devtools-plugin-settings__${t.id}`;
    let s = Object.assign({}, o);
    try {
      const a = localStorage.getItem(r), i = JSON.parse(a);
      Object.assign(s, i);
    } catch {
    }
    this.fallbacks = {
      getSettings() {
        return s;
      },
      setSettings(a) {
        try {
          localStorage.setItem(r, JSON.stringify(a));
        } catch {
        }
        s = a;
      },
      now() {
        return pa();
      }
    }, n && n.on(da, (a, i) => {
      a === this.plugin.id && this.fallbacks.setSettings(i);
    }), this.proxiedOn = new Proxy({}, {
      get: (a, i) => this.target ? this.target.on[i] : (...c) => {
        this.onQueue.push({
          method: i,
          args: c
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (a, i) => this.target ? this.target[i] : i === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(i) ? (...c) => (this.targetQueue.push({
        method: i,
        args: c,
        resolve: () => {
        }
      }), this.fallbacks[i](...c)) : (...c) => new Promise((u) => {
        this.targetQueue.push({
          method: i,
          args: c,
          resolve: u
        });
      })
    });
  }
  async setRealTarget(t) {
    this.target = t;
    for (const n of this.onQueue)
      this.target.on[n.method](...n.args);
    for (const n of this.targetQueue)
      n.resolve(await this.target[n.method](...n.args));
  }
}
function ma(e, t) {
  const n = e, o = Ko(), r = la(), s = ca && n.enableEarlyProxy;
  if (r && (o.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !s))
    r.emit(ua, e, t);
  else {
    const a = s ? new ha(n, r) : null;
    (o.__VUE_DEVTOOLS_PLUGINS__ = o.__VUE_DEVTOOLS_PLUGINS__ || []).push({
      pluginDescriptor: n,
      setupFn: t,
      proxy: a
    }), a && t(a.proxiedTarget);
  }
}
/*!
  * vue-router v4.1.6
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
const le = typeof window < "u";
function va(e) {
  return e.__esModule || e[Symbol.toStringTag] === "Module";
}
const A = Object.assign;
function St(e, t) {
  const n = {};
  for (const o in t) {
    const r = t[o];
    n[o] = J(r) ? r.map(e) : e(r);
  }
  return n;
}
const Fe = () => {
}, J = Array.isArray;
function C(e) {
  const t = Array.from(arguments).slice(1);
  console.warn.apply(console, ["[Vue Router warn]: " + e].concat(t));
}
const ga = /\/$/, ya = (e) => e.replace(ga, "");
function kt(e, t, n = "/") {
  let o, r = {}, s = "", a = "";
  const i = t.indexOf("#");
  let c = t.indexOf("?");
  return i < c && i >= 0 && (c = -1), c > -1 && (o = t.slice(0, c), s = t.slice(c + 1, i > -1 ? i : t.length), r = e(s)), i > -1 && (o = o || t.slice(0, i), a = t.slice(i, t.length)), o = ba(o ?? t, n), {
    fullPath: o + (s && "?") + s + a,
    path: o,
    query: r,
    hash: a
  };
}
function wa(e, t) {
  const n = t.query ? e(t.query) : "";
  return t.path + (n && "?") + n + (t.hash || "");
}
function Dn(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || "/";
}
function Vn(e, t, n) {
  const o = t.matched.length - 1, r = n.matched.length - 1;
  return o > -1 && o === r && ye(t.matched[o], n.matched[r]) && qo(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function ye(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t);
}
function qo(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (!_a(e[n], t[n]))
      return !1;
  return !0;
}
function _a(e, t) {
  return J(e) ? Ln(e, t) : J(t) ? Ln(t, e) : e === t;
}
function Ln(e, t) {
  return J(t) ? e.length === t.length && e.every((n, o) => n === t[o]) : e.length === 1 && e[0] === t;
}
function ba(e, t) {
  if (e.startsWith("/"))
    return e;
  if (process.env.NODE_ENV !== "production" && !t.startsWith("/"))
    return C(`Cannot resolve a relative location without an absolute path. Trying to resolve "${e}" from "${t}". It should look like "/${t}".`), e;
  if (!e)
    return t;
  const n = t.split("/"), o = e.split("/");
  let r = n.length - 1, s, a;
  for (s = 0; s < o.length; s++)
    if (a = o[s], a !== ".")
      if (a === "..")
        r > 1 && r--;
      else
        break;
  return n.slice(0, r).join("/") + "/" + o.slice(s - (s === o.length ? 1 : 0)).join("/");
}
var ze;
(function(e) {
  e.pop = "pop", e.push = "push";
})(ze || (ze = {}));
var Qe;
(function(e) {
  e.back = "back", e.forward = "forward", e.unknown = "";
})(Qe || (Qe = {}));
function Ea(e) {
  if (!e)
    if (le) {
      const t = document.querySelector("base");
      e = t && t.getAttribute("href") || "/", e = e.replace(/^\w+:\/\/[^\/]+/, "");
    } else
      e = "/";
  return e[0] !== "/" && e[0] !== "#" && (e = "/" + e), ya(e);
}
const Oa = /^[^#]+#/;
function Sa(e, t) {
  return e.replace(Oa, "#") + t;
}
function ka(e, t) {
  const n = document.documentElement.getBoundingClientRect(), o = e.getBoundingClientRect();
  return {
    behavior: t.behavior,
    left: o.left - n.left - (t.left || 0),
    top: o.top - n.top - (t.top || 0)
  };
}
const mt = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function Ia(e) {
  let t;
  if ("el" in e) {
    const n = e.el, o = typeof n == "string" && n.startsWith("#");
    if (process.env.NODE_ENV !== "production" && typeof e.el == "string" && (!o || !document.getElementById(e.el.slice(1))))
      try {
        const s = document.querySelector(e.el);
        if (o && s) {
          C(`The selector "${e.el}" should be passed as "el: document.querySelector('${e.el}')" because it starts with "#".`);
          return;
        }
      } catch {
        C(`The selector "${e.el}" is invalid. If you are using an id selector, make sure to escape it. You can find more information about escaping characters in selectors at https://mathiasbynens.be/notes/css-escapes or use CSS.escape (https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape).`);
        return;
      }
    const r = typeof n == "string" ? o ? document.getElementById(n.slice(1)) : document.querySelector(n) : n;
    if (!r) {
      process.env.NODE_ENV !== "production" && C(`Couldn't find element using selector "${e.el}" returned by scrollBehavior.`);
      return;
    }
    t = ka(r, e);
  } else
    t = e;
  "scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left != null ? t.left : window.pageXOffset, t.top != null ? t.top : window.pageYOffset);
}
function Mn(e, t) {
  return (history.state ? history.state.position - t : -1) + e;
}
const Dt = /* @__PURE__ */ new Map();
function Pa(e, t) {
  Dt.set(e, t);
}
function $a(e) {
  const t = Dt.get(e);
  return Dt.delete(e), t;
}
let xa = () => location.protocol + "//" + location.host;
function Jo(e, t) {
  const { pathname: n, search: o, hash: r } = t, s = e.indexOf("#");
  if (s > -1) {
    let i = r.includes(e.slice(s)) ? e.slice(s).length : 1, c = r.slice(i);
    return c[0] !== "/" && (c = "/" + c), Dn(c, "");
  }
  return Dn(n, e) + o + r;
}
function Na(e, t, n, o) {
  let r = [], s = [], a = null;
  const i = ({ state: f }) => {
    const p = Jo(e, location), m = n.value, v = t.value;
    let g = 0;
    if (f) {
      if (n.value = p, t.value = f, a && a === m) {
        a = null;
        return;
      }
      g = v ? f.position - v.position : 0;
    } else
      o(p);
    r.forEach((k) => {
      k(n.value, m, {
        delta: g,
        type: ze.pop,
        direction: g ? g > 0 ? Qe.forward : Qe.back : Qe.unknown
      });
    });
  };
  function c() {
    a = n.value;
  }
  function u(f) {
    r.push(f);
    const p = () => {
      const m = r.indexOf(f);
      m > -1 && r.splice(m, 1);
    };
    return s.push(p), p;
  }
  function l() {
    const { history: f } = window;
    f.state && f.replaceState(A({}, f.state, { scroll: mt() }), "");
  }
  function d() {
    for (const f of s)
      f();
    s = [], window.removeEventListener("popstate", i), window.removeEventListener("beforeunload", l);
  }
  return window.addEventListener("popstate", i), window.addEventListener("beforeunload", l), {
    pauseListeners: c,
    listen: u,
    destroy: d
  };
}
function jn(e, t, n, o = !1, r = !1) {
  return {
    back: e,
    current: t,
    forward: n,
    replaced: o,
    position: window.history.length,
    scroll: r ? mt() : null
  };
}
function Ca(e) {
  const { history: t, location: n } = window, o = {
    value: Jo(e, n)
  }, r = { value: t.state };
  r.value || s(o.value, {
    back: null,
    current: o.value,
    forward: null,
    // the length is off by one, we need to decrease it
    position: t.length - 1,
    replaced: !0,
    // don't add a scroll as the user may have an anchor, and we want
    // scrollBehavior to be triggered without a saved position
    scroll: null
  }, !0);
  function s(c, u, l) {
    const d = e.indexOf("#"), f = d > -1 ? (n.host && document.querySelector("base") ? e : e.slice(d)) + c : xa() + e + c;
    try {
      t[l ? "replaceState" : "pushState"](u, "", f), r.value = u;
    } catch (p) {
      process.env.NODE_ENV !== "production" ? C("Error with push/replace State", p) : console.error(p), n[l ? "replace" : "assign"](f);
    }
  }
  function a(c, u) {
    const l = A({}, t.state, jn(
      r.value.back,
      // keep back and forward entries but override current position
      c,
      r.value.forward,
      !0
    ), u, { position: r.value.position });
    s(c, l, !0), o.value = c;
  }
  function i(c, u) {
    const l = A(
      {},
      // use current history state to gracefully handle a wrong call to
      // history.replaceState
      // https://github.com/vuejs/router/issues/366
      r.value,
      t.state,
      {
        forward: c,
        scroll: mt()
      }
    );
    process.env.NODE_ENV !== "production" && !t.state && C(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:

history.replaceState(history.state, '', url)

You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`), s(l.current, l, !0);
    const d = A({}, jn(o.value, c, null), { position: l.position + 1 }, u);
    s(c, d, !1), o.value = c;
  }
  return {
    location: o,
    state: r,
    push: i,
    replace: a
  };
}
function Ra(e) {
  e = Ea(e);
  const t = Ca(e), n = Na(e, t.state, t.location, t.replace);
  function o(s, a = !0) {
    a || n.pauseListeners(), history.go(s);
  }
  const r = A({
    // it's overridden right after
    location: "",
    base: e,
    go: o,
    createHref: Sa.bind(null, e)
  }, t, n);
  return Object.defineProperty(r, "location", {
    enumerable: !0,
    get: () => t.location.value
  }), Object.defineProperty(r, "state", {
    enumerable: !0,
    get: () => t.state.value
  }), r;
}
function Aa(e) {
  return typeof e == "string" || e && typeof e == "object";
}
function Yo(e) {
  return typeof e == "string" || typeof e == "symbol";
}
const he = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
}, Vt = Symbol(process.env.NODE_ENV !== "production" ? "navigation failure" : "");
var Bn;
(function(e) {
  e[e.aborted = 4] = "aborted", e[e.cancelled = 8] = "cancelled", e[e.duplicated = 16] = "duplicated";
})(Bn || (Bn = {}));
const Ta = {
  [
    1
    /* ErrorTypes.MATCHER_NOT_FOUND */
  ]({ location: e, currentLocation: t }) {
    return `No match for
 ${JSON.stringify(e)}${t ? `
while being at
` + JSON.stringify(t) : ""}`;
  },
  [
    2
    /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
  ]({ from: e, to: t }) {
    return `Redirected from "${e.fullPath}" to "${Va(t)}" via a navigation guard.`;
  },
  [
    4
    /* ErrorTypes.NAVIGATION_ABORTED */
  ]({ from: e, to: t }) {
    return `Navigation aborted from "${e.fullPath}" to "${t.fullPath}" via a navigation guard.`;
  },
  [
    8
    /* ErrorTypes.NAVIGATION_CANCELLED */
  ]({ from: e, to: t }) {
    return `Navigation cancelled from "${e.fullPath}" to "${t.fullPath}" with a new navigation.`;
  },
  [
    16
    /* ErrorTypes.NAVIGATION_DUPLICATED */
  ]({ from: e, to: t }) {
    return `Avoided redundant navigation to current location: "${e.fullPath}".`;
  }
};
function Ve(e, t) {
  return process.env.NODE_ENV !== "production" ? A(new Error(Ta[e](t)), {
    type: e,
    [Vt]: !0
  }, t) : A(new Error(), {
    type: e,
    [Vt]: !0
  }, t);
}
function ae(e, t) {
  return e instanceof Error && Vt in e && (t == null || !!(e.type & t));
}
const Da = ["params", "query", "hash"];
function Va(e) {
  if (typeof e == "string")
    return e;
  if ("path" in e)
    return e.path;
  const t = {};
  for (const n of Da)
    n in e && (t[n] = e[n]);
  return JSON.stringify(t, null, 2);
}
const Un = "[^/]+?", La = {
  sensitive: !1,
  strict: !1,
  start: !0,
  end: !0
}, Ma = /[.+*?^${}()[\]/\\]/g;
function ja(e, t) {
  const n = A({}, La, t), o = [];
  let r = n.start ? "^" : "";
  const s = [];
  for (const u of e) {
    const l = u.length ? [] : [
      90
      /* PathScore.Root */
    ];
    n.strict && !u.length && (r += "/");
    for (let d = 0; d < u.length; d++) {
      const f = u[d];
      let p = 40 + (n.sensitive ? 0.25 : 0);
      if (f.type === 0)
        d || (r += "/"), r += f.value.replace(Ma, "\\$&"), p += 40;
      else if (f.type === 1) {
        const { value: m, repeatable: v, optional: g, regexp: k } = f;
        s.push({
          name: m,
          repeatable: v,
          optional: g
        });
        const I = k || Un;
        if (I !== Un) {
          p += 10;
          try {
            new RegExp(`(${I})`);
          } catch (F) {
            throw new Error(`Invalid custom RegExp for param "${m}" (${I}): ` + F.message);
          }
        }
        let L = v ? `((?:${I})(?:/(?:${I}))*)` : `(${I})`;
        d || (L = // avoid an optional / if there are more segments e.g. /:p?-static
        // or /:p?-:p2
        g && u.length < 2 ? `(?:/${L})` : "/" + L), g && (L += "?"), r += L, p += 20, g && (p += -8), v && (p += -20), I === ".*" && (p += -50);
      }
      l.push(p);
    }
    o.push(l);
  }
  if (n.strict && n.end) {
    const u = o.length - 1;
    o[u][o[u].length - 1] += 0.7000000000000001;
  }
  n.strict || (r += "/?"), n.end ? r += "$" : n.strict && (r += "(?:/|$)");
  const a = new RegExp(r, n.sensitive ? "" : "i");
  function i(u) {
    const l = u.match(a), d = {};
    if (!l)
      return null;
    for (let f = 1; f < l.length; f++) {
      const p = l[f] || "", m = s[f - 1];
      d[m.name] = p && m.repeatable ? p.split("/") : p;
    }
    return d;
  }
  function c(u) {
    let l = "", d = !1;
    for (const f of e) {
      (!d || !l.endsWith("/")) && (l += "/"), d = !1;
      for (const p of f)
        if (p.type === 0)
          l += p.value;
        else if (p.type === 1) {
          const { value: m, repeatable: v, optional: g } = p, k = m in u ? u[m] : "";
          if (J(k) && !v)
            throw new Error(`Provided param "${m}" is an array but it is not repeatable (* or + modifiers)`);
          const I = J(k) ? k.join("/") : k;
          if (!I)
            if (g)
              f.length < 2 && (l.endsWith("/") ? l = l.slice(0, -1) : d = !0);
            else
              throw new Error(`Missing required param "${m}"`);
          l += I;
        }
    }
    return l || "/";
  }
  return {
    re: a,
    score: o,
    keys: s,
    parse: i,
    stringify: c
  };
}
function Ba(e, t) {
  let n = 0;
  for (; n < e.length && n < t.length; ) {
    const o = t[n] - e[n];
    if (o)
      return o;
    n++;
  }
  return e.length < t.length ? e.length === 1 && e[0] === 40 + 40 ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === 40 + 40 ? 1 : -1 : 0;
}
function Ua(e, t) {
  let n = 0;
  const o = e.score, r = t.score;
  for (; n < o.length && n < r.length; ) {
    const s = Ba(o[n], r[n]);
    if (s)
      return s;
    n++;
  }
  if (Math.abs(r.length - o.length) === 1) {
    if (Hn(o))
      return 1;
    if (Hn(r))
      return -1;
  }
  return r.length - o.length;
}
function Hn(e) {
  const t = e[e.length - 1];
  return e.length > 0 && t[t.length - 1] < 0;
}
const Ha = {
  type: 0,
  value: ""
}, Fa = /[a-zA-Z0-9_]/;
function Qa(e) {
  if (!e)
    return [[]];
  if (e === "/")
    return [[Ha]];
  if (!e.startsWith("/"))
    throw new Error(process.env.NODE_ENV !== "production" ? `Route paths should start with a "/": "${e}" should be "/${e}".` : `Invalid path "${e}"`);
  function t(p) {
    throw new Error(`ERR (${n})/"${u}": ${p}`);
  }
  let n = 0, o = n;
  const r = [];
  let s;
  function a() {
    s && r.push(s), s = [];
  }
  let i = 0, c, u = "", l = "";
  function d() {
    u && (n === 0 ? s.push({
      type: 0,
      value: u
    }) : n === 1 || n === 2 || n === 3 ? (s.length > 1 && (c === "*" || c === "+") && t(`A repeatable param (${u}) must be alone in its segment. eg: '/:ids+.`), s.push({
      type: 1,
      value: u,
      regexp: l,
      repeatable: c === "*" || c === "+",
      optional: c === "*" || c === "?"
    })) : t("Invalid state to consume buffer"), u = "");
  }
  function f() {
    u += c;
  }
  for (; i < e.length; ) {
    if (c = e[i++], c === "\\" && n !== 2) {
      o = n, n = 4;
      continue;
    }
    switch (n) {
      case 0:
        c === "/" ? (u && d(), a()) : c === ":" ? (d(), n = 1) : f();
        break;
      case 4:
        f(), n = o;
        break;
      case 1:
        c === "(" ? n = 2 : Fa.test(c) ? f() : (d(), n = 0, c !== "*" && c !== "?" && c !== "+" && i--);
        break;
      case 2:
        c === ")" ? l[l.length - 1] == "\\" ? l = l.slice(0, -1) + c : n = 3 : l += c;
        break;
      case 3:
        d(), n = 0, c !== "*" && c !== "?" && c !== "+" && i--, l = "";
        break;
      default:
        t("Unknown state");
        break;
    }
  }
  return n === 2 && t(`Unfinished custom RegExp for param "${u}"`), d(), a(), r;
}
function Wa(e, t, n) {
  const o = ja(Qa(e.path), n);
  if (process.env.NODE_ENV !== "production") {
    const s = /* @__PURE__ */ new Set();
    for (const a of o.keys)
      s.has(a.name) && C(`Found duplicated params with name "${a.name}" for path "${e.path}". Only the last one will be available on "$route.params".`), s.add(a.name);
  }
  const r = A(o, {
    record: e,
    parent: t,
    // these needs to be populated by the parent
    children: [],
    alias: []
  });
  return t && !r.record.aliasOf == !t.record.aliasOf && t.children.push(r), r;
}
function Ga(e, t) {
  const n = [], o = /* @__PURE__ */ new Map();
  t = Wn({ strict: !1, end: !0, sensitive: !1 }, t);
  function r(l) {
    return o.get(l);
  }
  function s(l, d, f) {
    const p = !f, m = za(l);
    process.env.NODE_ENV !== "production" && Ya(m, d), m.aliasOf = f && f.record;
    const v = Wn(t, l), g = [
      m
    ];
    if ("alias" in l) {
      const L = typeof l.alias == "string" ? [l.alias] : l.alias;
      for (const F of L)
        g.push(A({}, m, {
          // this allows us to hold a copy of the `components` option
          // so that async components cache is hold on the original record
          components: f ? f.record.components : m.components,
          path: F,
          // we might be the child of an alias
          aliasOf: f ? f.record : m
          // the aliases are always of the same kind as the original since they
          // are defined on the same record
        }));
    }
    let k, I;
    for (const L of g) {
      const { path: F } = L;
      if (d && F[0] !== "/") {
        const Y = d.record.path, X = Y[Y.length - 1] === "/" ? "" : "/";
        L.path = d.record.path + (F && X + F);
      }
      if (process.env.NODE_ENV !== "production" && L.path === "*")
        throw new Error(`Catch all routes ("*") must now be defined using a param with a custom regexp.
See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.`);
      if (k = Wa(L, d, v), process.env.NODE_ENV !== "production" && d && F[0] === "/" && Xa(k, d), f ? (f.alias.push(k), process.env.NODE_ENV !== "production" && Ja(f, k)) : (I = I || k, I !== k && I.alias.push(k), p && l.name && !Qn(k) && a(l.name)), m.children) {
        const Y = m.children;
        for (let X = 0; X < Y.length; X++)
          s(Y[X], k, f && f.children[X]);
      }
      f = f || k, (k.record.components && Object.keys(k.record.components).length || k.record.name || k.record.redirect) && c(k);
    }
    return I ? () => {
      a(I);
    } : Fe;
  }
  function a(l) {
    if (Yo(l)) {
      const d = o.get(l);
      d && (o.delete(l), n.splice(n.indexOf(d), 1), d.children.forEach(a), d.alias.forEach(a));
    } else {
      const d = n.indexOf(l);
      d > -1 && (n.splice(d, 1), l.record.name && o.delete(l.record.name), l.children.forEach(a), l.alias.forEach(a));
    }
  }
  function i() {
    return n;
  }
  function c(l) {
    let d = 0;
    for (; d < n.length && Ua(l, n[d]) >= 0 && // Adding children with empty path should still appear before the parent
    // https://github.com/vuejs/router/issues/1124
    (l.record.path !== n[d].record.path || !Xo(l, n[d])); )
      d++;
    n.splice(d, 0, l), l.record.name && !Qn(l) && o.set(l.record.name, l);
  }
  function u(l, d) {
    let f, p = {}, m, v;
    if ("name" in l && l.name) {
      if (f = o.get(l.name), !f)
        throw Ve(1, {
          location: l
        });
      if (process.env.NODE_ENV !== "production") {
        const I = Object.keys(l.params || {}).filter((L) => !f.keys.find((F) => F.name === L));
        I.length && C(`Discarded invalid param(s) "${I.join('", "')}" when navigating. See https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22 for more details.`);
      }
      v = f.record.name, p = A(
        // paramsFromLocation is a new object
        Fn(
          d.params,
          // only keep params that exist in the resolved location
          // TODO: only keep optional params coming from a parent record
          f.keys.filter((I) => !I.optional).map((I) => I.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        l.params && Fn(l.params, f.keys.map((I) => I.name))
      ), m = f.stringify(p);
    } else if ("path" in l)
      m = l.path, process.env.NODE_ENV !== "production" && !m.startsWith("/") && C(`The Matcher cannot resolve relative paths but received "${m}". Unless you directly called \`matcher.resolve("${m}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`), f = n.find((I) => I.re.test(m)), f && (p = f.parse(m), v = f.record.name);
    else {
      if (f = d.name ? o.get(d.name) : n.find((I) => I.re.test(d.path)), !f)
        throw Ve(1, {
          location: l,
          currentLocation: d
        });
      v = f.record.name, p = A({}, d.params, l.params), m = f.stringify(p);
    }
    const g = [];
    let k = f;
    for (; k; )
      g.unshift(k.record), k = k.parent;
    return {
      name: v,
      path: m,
      params: p,
      matched: g,
      meta: qa(g)
    };
  }
  return e.forEach((l) => s(l)), { addRoute: s, resolve: u, removeRoute: a, getRoutes: i, getRecordMatcher: r };
}
function Fn(e, t) {
  const n = {};
  for (const o of t)
    o in e && (n[o] = e[o]);
  return n;
}
function za(e) {
  return {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: void 0,
    beforeEnter: e.beforeEnter,
    props: Ka(e),
    children: e.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in e ? e.components || null : e.component && { default: e.component }
  };
}
function Ka(e) {
  const t = {}, n = e.props || !1;
  if ("component" in e)
    t.default = n;
  else
    for (const o in e.components)
      t[o] = typeof n == "boolean" ? n : n[o];
  return t;
}
function Qn(e) {
  for (; e; ) {
    if (e.record.aliasOf)
      return !0;
    e = e.parent;
  }
  return !1;
}
function qa(e) {
  return e.reduce((t, n) => A(t, n.meta), {});
}
function Wn(e, t) {
  const n = {};
  for (const o in e)
    n[o] = o in t ? t[o] : e[o];
  return n;
}
function Lt(e, t) {
  return e.name === t.name && e.optional === t.optional && e.repeatable === t.repeatable;
}
function Ja(e, t) {
  for (const n of e.keys)
    if (!n.optional && !t.keys.find(Lt.bind(null, n)))
      return C(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
  for (const n of t.keys)
    if (!n.optional && !e.keys.find(Lt.bind(null, n)))
      return C(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
}
function Ya(e, t) {
  t && t.record.name && !e.name && !e.path && C(`The route named "${String(t.record.name)}" has a child without a name and an empty path. Using that name won't render the empty path child so you probably want to move the name to the child instead. If this is intentional, add a name to the child route to remove the warning.`);
}
function Xa(e, t) {
  for (const n of t.keys)
    if (!e.keys.find(Lt.bind(null, n)))
      return C(`Absolute path "${e.record.path}" must have the exact same param named "${n.name}" as its parent "${t.record.path}".`);
}
function Xo(e, t) {
  return t.children.some((n) => n === e || Xo(e, n));
}
const Zo = /#/g, Za = /&/g, ei = /\//g, ti = /=/g, ni = /\?/g, er = /\+/g, oi = /%5B/g, ri = /%5D/g, tr = /%5E/g, si = /%60/g, nr = /%7B/g, ai = /%7C/g, or = /%7D/g, ii = /%20/g;
function Xt(e) {
  return encodeURI("" + e).replace(ai, "|").replace(oi, "[").replace(ri, "]");
}
function li(e) {
  return Xt(e).replace(nr, "{").replace(or, "}").replace(tr, "^");
}
function Mt(e) {
  return Xt(e).replace(er, "%2B").replace(ii, "+").replace(Zo, "%23").replace(Za, "%26").replace(si, "`").replace(nr, "{").replace(or, "}").replace(tr, "^");
}
function ci(e) {
  return Mt(e).replace(ti, "%3D");
}
function ui(e) {
  return Xt(e).replace(Zo, "%23").replace(ni, "%3F");
}
function di(e) {
  return e == null ? "" : ui(e).replace(ei, "%2F");
}
function Ke(e) {
  try {
    return decodeURIComponent("" + e);
  } catch {
    process.env.NODE_ENV !== "production" && C(`Error decoding "${e}". Using original value`);
  }
  return "" + e;
}
function fi(e) {
  const t = {};
  if (e === "" || e === "?")
    return t;
  const o = (e[0] === "?" ? e.slice(1) : e).split("&");
  for (let r = 0; r < o.length; ++r) {
    const s = o[r].replace(er, " "), a = s.indexOf("="), i = Ke(a < 0 ? s : s.slice(0, a)), c = a < 0 ? null : Ke(s.slice(a + 1));
    if (i in t) {
      let u = t[i];
      J(u) || (u = t[i] = [u]), u.push(c);
    } else
      t[i] = c;
  }
  return t;
}
function Gn(e) {
  let t = "";
  for (let n in e) {
    const o = e[n];
    if (n = ci(n), o == null) {
      o !== void 0 && (t += (t.length ? "&" : "") + n);
      continue;
    }
    (J(o) ? o.map((s) => s && Mt(s)) : [o && Mt(o)]).forEach((s) => {
      s !== void 0 && (t += (t.length ? "&" : "") + n, s != null && (t += "=" + s));
    });
  }
  return t;
}
function pi(e) {
  const t = {};
  for (const n in e) {
    const o = e[n];
    o !== void 0 && (t[n] = J(o) ? o.map((r) => r == null ? null : "" + r) : o == null ? o : "" + o);
  }
  return t;
}
const hi = Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : ""), zn = Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : ""), Zt = Symbol(process.env.NODE_ENV !== "production" ? "router" : ""), rr = Symbol(process.env.NODE_ENV !== "production" ? "route location" : ""), jt = Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
function Me() {
  let e = [];
  function t(o) {
    return e.push(o), () => {
      const r = e.indexOf(o);
      r > -1 && e.splice(r, 1);
    };
  }
  function n() {
    e = [];
  }
  return {
    add: t,
    list: () => e,
    reset: n
  };
}
function me(e, t, n, o, r) {
  const s = o && // name is defined if record is because of the function overload
  (o.enterCallbacks[r] = o.enterCallbacks[r] || []);
  return () => new Promise((a, i) => {
    const c = (d) => {
      d === !1 ? i(Ve(4, {
        from: n,
        to: t
      })) : d instanceof Error ? i(d) : Aa(d) ? i(Ve(2, {
        from: t,
        to: d
      })) : (s && // since enterCallbackArray is truthy, both record and name also are
      o.enterCallbacks[r] === s && typeof d == "function" && s.push(d), a());
    }, u = e.call(o && o.instances[r], t, n, process.env.NODE_ENV !== "production" ? mi(c, t, n) : c);
    let l = Promise.resolve(u);
    if (e.length < 3 && (l = l.then(c)), process.env.NODE_ENV !== "production" && e.length > 2) {
      const d = `The "next" callback was never called inside of ${e.name ? '"' + e.name + '"' : ""}:
${e.toString()}
. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;
      if (typeof u == "object" && "then" in u)
        l = l.then((f) => c._called ? f : (C(d), Promise.reject(new Error("Invalid navigation guard"))));
      else if (u !== void 0 && !c._called) {
        C(d), i(new Error("Invalid navigation guard"));
        return;
      }
    }
    l.catch((d) => i(d));
  });
}
function mi(e, t, n) {
  let o = 0;
  return function() {
    o++ === 1 && C(`The "next" callback was called more than once in one navigation guard when going from "${n.fullPath}" to "${t.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`), e._called = !0, o === 1 && e.apply(null, arguments);
  };
}
function It(e, t, n, o) {
  const r = [];
  for (const s of e) {
    process.env.NODE_ENV !== "production" && !s.components && !s.children.length && C(`Record with path "${s.path}" is either missing a "component(s)" or "children" property.`);
    for (const a in s.components) {
      let i = s.components[a];
      if (process.env.NODE_ENV !== "production") {
        if (!i || typeof i != "object" && typeof i != "function")
          throw C(`Component "${a}" in record with path "${s.path}" is not a valid component. Received "${String(i)}".`), new Error("Invalid route component");
        if ("then" in i) {
          C(`Component "${a}" in record with path "${s.path}" is a Promise instead of a function that returns a Promise. Did you write "import('./MyPage.vue')" instead of "() => import('./MyPage.vue')" ? This will break in production if not fixed.`);
          const c = i;
          i = () => c;
        } else
          i.__asyncLoader && // warn only once per component
          !i.__warnedDefineAsync && (i.__warnedDefineAsync = !0, C(`Component "${a}" in record with path "${s.path}" is defined using "defineAsyncComponent()". Write "() => import('./MyPage.vue')" instead of "defineAsyncComponent(() => import('./MyPage.vue'))".`));
      }
      if (!(t !== "beforeRouteEnter" && !s.instances[a]))
        if (vi(i)) {
          const u = (i.__vccOpts || i)[t];
          u && r.push(me(u, n, o, s, a));
        } else {
          let c = i();
          process.env.NODE_ENV !== "production" && !("catch" in c) && (C(`Component "${a}" in record with path "${s.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`), c = Promise.resolve(c)), r.push(() => c.then((u) => {
            if (!u)
              return Promise.reject(new Error(`Couldn't resolve component "${a}" at "${s.path}"`));
            const l = va(u) ? u.default : u;
            s.components[a] = l;
            const f = (l.__vccOpts || l)[t];
            return f && me(f, n, o, s, a)();
          }));
        }
    }
  }
  return r;
}
function vi(e) {
  return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function Kn(e) {
  const t = q(Zt), n = q(rr), o = j(() => t.resolve(b(e.to))), r = j(() => {
    const { matched: c } = o.value, { length: u } = c, l = c[u - 1], d = n.matched;
    if (!l || !d.length)
      return -1;
    const f = d.findIndex(ye.bind(null, l));
    if (f > -1)
      return f;
    const p = qn(c[u - 2]);
    return (
      // we are dealing with nested routes
      u > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      qn(l) === p && // avoid comparing the child with its parent
      d[d.length - 1].path !== p ? d.findIndex(ye.bind(null, c[u - 2])) : f
    );
  }), s = j(() => r.value > -1 && _i(n.params, o.value.params)), a = j(() => r.value > -1 && r.value === n.matched.length - 1 && qo(n.params, o.value.params));
  function i(c = {}) {
    return wi(c) ? t[b(e.replace) ? "replace" : "push"](
      b(e.to)
      // avoid uncaught errors are they are logged anyway
    ).catch(Fe) : Promise.resolve();
  }
  if (process.env.NODE_ENV !== "production" && le) {
    const c = ft();
    if (c) {
      const u = {
        route: o.value,
        isActive: s.value,
        isExactActive: a.value
      };
      c.__vrl_devtools = c.__vrl_devtools || [], c.__vrl_devtools.push(u), Lr(() => {
        u.route = o.value, u.isActive = s.value, u.isExactActive = a.value;
      }, { flush: "post" });
    }
  }
  return {
    route: o,
    href: j(() => o.value.href),
    isActive: s,
    isExactActive: a,
    navigate: i
  };
}
const gi = /* @__PURE__ */ K({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: !0
    },
    replace: Boolean,
    activeClass: String,
    // inactiveClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink: Kn,
  setup(e, { slots: t }) {
    const n = ve(Kn(e)), { options: o } = q(Zt), r = j(() => ({
      [Jn(e.activeClass, o.linkActiveClass, "router-link-active")]: n.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [Jn(e.exactActiveClass, o.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
    }));
    return () => {
      const s = t.default && t.default(n);
      return e.custom ? s : ko("a", {
        "aria-current": n.isExactActive ? e.ariaCurrentValue : null,
        href: n.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: n.navigate,
        class: r.value
      }, s);
    };
  }
}), yi = gi;
function wi(e) {
  if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(t))
        return;
    }
    return e.preventDefault && e.preventDefault(), !0;
  }
}
function _i(e, t) {
  for (const n in t) {
    const o = t[n], r = e[n];
    if (typeof o == "string") {
      if (o !== r)
        return !1;
    } else if (!J(r) || r.length !== o.length || o.some((s, a) => s !== r[a]))
      return !1;
  }
  return !0;
}
function qn(e) {
  return e ? e.aliasOf ? e.aliasOf.path : e.path : "";
}
const Jn = (e, t, n) => e ?? t ?? n, bi = /* @__PURE__ */ K({
  name: "RouterView",
  // #674 we manually inherit them
  inheritAttrs: !1,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  // Better compat for @vue/compat users
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t, slots: n }) {
    process.env.NODE_ENV !== "production" && Oi();
    const o = q(jt), r = j(() => e.route || o.value), s = q(zn, 0), a = j(() => {
      let u = b(s);
      const { matched: l } = r.value;
      let d;
      for (; (d = l[u]) && !d.components; )
        u++;
      return u;
    }), i = j(() => r.value.matched[a.value]);
    nt(zn, j(() => a.value + 1)), nt(hi, i), nt(jt, r);
    const c = N();
    return ee(() => [c.value, i.value, e.name], ([u, l, d], [f, p, m]) => {
      l && (l.instances[d] = u, p && p !== l && u && u === f && (l.leaveGuards.size || (l.leaveGuards = p.leaveGuards), l.updateGuards.size || (l.updateGuards = p.updateGuards))), u && l && // if there is no instance but to and from are the same this might be
      // the first visit
      (!p || !ye(l, p) || !f) && (l.enterCallbacks[d] || []).forEach((v) => v(u));
    }, { flush: "post" }), () => {
      const u = r.value, l = e.name, d = i.value, f = d && d.components[l];
      if (!f)
        return Yn(n.default, { Component: f, route: u });
      const p = d.props[l], m = p ? p === !0 ? u.params : typeof p == "function" ? p(u) : p : null, g = ko(f, A({}, m, t, {
        onVnodeUnmounted: (k) => {
          k.component.isUnmounted && (d.instances[l] = null);
        },
        ref: c
      }));
      if (process.env.NODE_ENV !== "production" && le && g.ref) {
        const k = {
          depth: a.value,
          name: d.name,
          path: d.path,
          meta: d.meta
        };
        (J(g.ref) ? g.ref.map((L) => L.i) : [g.ref.i]).forEach((L) => {
          L.__vrv_devtools = k;
        });
      }
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        Yn(n.default, { Component: g, route: u }) || g
      );
    };
  }
});
function Yn(e, t) {
  if (!e)
    return null;
  const n = e(t);
  return n.length === 1 ? n[0] : n;
}
const Ei = bi;
function Oi() {
  const e = ft(), t = e.parent && e.parent.type.name;
  if (t && (t === "KeepAlive" || t.includes("Transition"))) {
    const n = t === "KeepAlive" ? "keep-alive" : "transition";
    C(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.
Use slot props instead:

<router-view v-slot="{ Component }">
  <${n}>
    <component :is="Component" />
  </${n}>
</router-view>`);
  }
}
function je(e, t) {
  const n = A({}, e, {
    // remove variables that can contain vue instances
    matched: e.matched.map((o) => Ri(o, ["instances", "children", "aliasOf"]))
  });
  return {
    _custom: {
      type: null,
      readOnly: !0,
      display: e.fullPath,
      tooltip: t,
      value: n
    }
  };
}
function Ze(e) {
  return {
    _custom: {
      display: e
    }
  };
}
let Si = 0;
function ki(e, t, n) {
  if (t.__hasDevtools)
    return;
  t.__hasDevtools = !0;
  const o = Si++;
  ma({
    id: "org.vuejs.router" + (o ? "." + o : ""),
    label: "Vue Router",
    packageName: "vue-router",
    homepage: "https://router.vuejs.org",
    logo: "https://router.vuejs.org/logo.png",
    componentStateTypes: ["Routing"],
    app: e
  }, (r) => {
    typeof r.now != "function" && console.warn("[Vue Router]: You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."), r.on.inspectComponent((l, d) => {
      l.instanceData && l.instanceData.state.push({
        type: "Routing",
        key: "$route",
        editable: !1,
        value: je(t.currentRoute.value, "Current Route")
      });
    }), r.on.visitComponentTree(({ treeNode: l, componentInstance: d }) => {
      if (d.__vrv_devtools) {
        const f = d.__vrv_devtools;
        l.tags.push({
          label: (f.name ? `${f.name.toString()}: ` : "") + f.path,
          textColor: 0,
          tooltip: "This component is rendered by &lt;router-view&gt;",
          backgroundColor: sr
        });
      }
      J(d.__vrl_devtools) && (d.__devtoolsApi = r, d.__vrl_devtools.forEach((f) => {
        let p = lr, m = "";
        f.isExactActive ? (p = ir, m = "This is exactly active") : f.isActive && (p = ar, m = "This link is active"), l.tags.push({
          label: f.route.path,
          textColor: 0,
          tooltip: m,
          backgroundColor: p
        });
      }));
    }), ee(t.currentRoute, () => {
      c(), r.notifyComponentUpdate(), r.sendInspectorTree(i), r.sendInspectorState(i);
    });
    const s = "router:navigations:" + o;
    r.addTimelineLayer({
      id: s,
      label: `Router${o ? " " + o : ""} Navigations`,
      color: 4237508
    }), t.onError((l, d) => {
      r.addTimelineEvent({
        layerId: s,
        event: {
          title: "Error during Navigation",
          subtitle: d.fullPath,
          logType: "error",
          time: r.now(),
          data: { error: l },
          groupId: d.meta.__navigationId
        }
      });
    });
    let a = 0;
    t.beforeEach((l, d) => {
      const f = {
        guard: Ze("beforeEach"),
        from: je(d, "Current Location during this navigation"),
        to: je(l, "Target location")
      };
      Object.defineProperty(l.meta, "__navigationId", {
        value: a++
      }), r.addTimelineEvent({
        layerId: s,
        event: {
          time: r.now(),
          title: "Start of navigation",
          subtitle: l.fullPath,
          data: f,
          groupId: l.meta.__navigationId
        }
      });
    }), t.afterEach((l, d, f) => {
      const p = {
        guard: Ze("afterEach")
      };
      f ? (p.failure = {
        _custom: {
          type: Error,
          readOnly: !0,
          display: f ? f.message : "",
          tooltip: "Navigation Failure",
          value: f
        }
      }, p.status = Ze("❌")) : p.status = Ze("✅"), p.from = je(d, "Current Location during this navigation"), p.to = je(l, "Target location"), r.addTimelineEvent({
        layerId: s,
        event: {
          title: "End of navigation",
          subtitle: l.fullPath,
          time: r.now(),
          data: p,
          logType: f ? "warning" : "default",
          groupId: l.meta.__navigationId
        }
      });
    });
    const i = "router-inspector:" + o;
    r.addInspector({
      id: i,
      label: "Routes" + (o ? " " + o : ""),
      icon: "book",
      treeFilterPlaceholder: "Search routes"
    });
    function c() {
      if (!u)
        return;
      const l = u;
      let d = n.getRoutes().filter((f) => !f.parent);
      d.forEach(dr), l.filter && (d = d.filter((f) => (
        // save matches state based on the payload
        Bt(f, l.filter.toLowerCase())
      ))), d.forEach((f) => ur(f, t.currentRoute.value)), l.rootNodes = d.map(cr);
    }
    let u;
    r.on.getInspectorTree((l) => {
      u = l, l.app === e && l.inspectorId === i && c();
    }), r.on.getInspectorState((l) => {
      if (l.app === e && l.inspectorId === i) {
        const f = n.getRoutes().find((p) => p.record.__vd_id === l.nodeId);
        f && (l.state = {
          options: Pi(f)
        });
      }
    }), r.sendInspectorTree(i), r.sendInspectorState(i);
  });
}
function Ii(e) {
  return e.optional ? e.repeatable ? "*" : "?" : e.repeatable ? "+" : "";
}
function Pi(e) {
  const { record: t } = e, n = [
    { editable: !1, key: "path", value: t.path }
  ];
  return t.name != null && n.push({
    editable: !1,
    key: "name",
    value: t.name
  }), n.push({ editable: !1, key: "regexp", value: e.re }), e.keys.length && n.push({
    editable: !1,
    key: "keys",
    value: {
      _custom: {
        type: null,
        readOnly: !0,
        display: e.keys.map((o) => `${o.name}${Ii(o)}`).join(" "),
        tooltip: "Param keys",
        value: e.keys
      }
    }
  }), t.redirect != null && n.push({
    editable: !1,
    key: "redirect",
    value: t.redirect
  }), e.alias.length && n.push({
    editable: !1,
    key: "aliases",
    value: e.alias.map((o) => o.record.path)
  }), Object.keys(e.record.meta).length && n.push({
    editable: !1,
    key: "meta",
    value: e.record.meta
  }), n.push({
    key: "score",
    editable: !1,
    value: {
      _custom: {
        type: null,
        readOnly: !0,
        display: e.score.map((o) => o.join(", ")).join(" | "),
        tooltip: "Score used to sort routes",
        value: e.score
      }
    }
  }), n;
}
const sr = 15485081, ar = 2450411, ir = 8702998, $i = 2282478, lr = 16486972, xi = 6710886;
function cr(e) {
  const t = [], { record: n } = e;
  n.name != null && t.push({
    label: String(n.name),
    textColor: 0,
    backgroundColor: $i
  }), n.aliasOf && t.push({
    label: "alias",
    textColor: 0,
    backgroundColor: lr
  }), e.__vd_match && t.push({
    label: "matches",
    textColor: 0,
    backgroundColor: sr
  }), e.__vd_exactActive && t.push({
    label: "exact",
    textColor: 0,
    backgroundColor: ir
  }), e.__vd_active && t.push({
    label: "active",
    textColor: 0,
    backgroundColor: ar
  }), n.redirect && t.push({
    label: typeof n.redirect == "string" ? `redirect: ${n.redirect}` : "redirects",
    textColor: 16777215,
    backgroundColor: xi
  });
  let o = n.__vd_id;
  return o == null && (o = String(Ni++), n.__vd_id = o), {
    id: o,
    label: n.path,
    tags: t,
    children: e.children.map(cr)
  };
}
let Ni = 0;
const Ci = /^\/(.*)\/([a-z]*)$/;
function ur(e, t) {
  const n = t.matched.length && ye(t.matched[t.matched.length - 1], e.record);
  e.__vd_exactActive = e.__vd_active = n, n || (e.__vd_active = t.matched.some((o) => ye(o, e.record))), e.children.forEach((o) => ur(o, t));
}
function dr(e) {
  e.__vd_match = !1, e.children.forEach(dr);
}
function Bt(e, t) {
  const n = String(e.re).match(Ci);
  if (e.__vd_match = !1, !n || n.length < 3)
    return !1;
  if (new RegExp(n[1].replace(/\$$/, ""), n[2]).test(t))
    return e.children.forEach((a) => Bt(a, t)), e.record.path !== "/" || t === "/" ? (e.__vd_match = e.re.test(t), !0) : !1;
  const r = e.record.path.toLowerCase(), s = Ke(r);
  return !t.startsWith("/") && (s.includes(t) || r.includes(t)) || s.startsWith(t) || r.startsWith(t) || e.record.name && String(e.record.name).includes(t) ? !0 : e.children.some((a) => Bt(a, t));
}
function Ri(e, t) {
  const n = {};
  for (const o in e)
    t.includes(o) || (n[o] = e[o]);
  return n;
}
function Ai(e) {
  const t = Ga(e.routes, e), n = e.parseQuery || fi, o = e.stringifyQuery || Gn, r = e.history;
  if (process.env.NODE_ENV !== "production" && !r)
    throw new Error('Provide the "history" option when calling "createRouter()": https://next.router.vuejs.org/api/#history.');
  const s = Me(), a = Me(), i = Me(), c = Vr(he);
  let u = he;
  le && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
  const l = St.bind(null, (h) => "" + h), d = St.bind(null, di), f = (
    // @ts-expect-error: intentionally avoid the type check
    St.bind(null, Ke)
  );
  function p(h, _) {
    let y, E;
    return Yo(h) ? (y = t.getRecordMatcher(h), E = _) : E = h, t.addRoute(E, y);
  }
  function m(h) {
    const _ = t.getRecordMatcher(h);
    _ ? t.removeRoute(_) : process.env.NODE_ENV !== "production" && C(`Cannot remove non-existent route "${String(h)}"`);
  }
  function v() {
    return t.getRoutes().map((h) => h.record);
  }
  function g(h) {
    return !!t.getRecordMatcher(h);
  }
  function k(h, _) {
    if (_ = A({}, _ || c.value), typeof h == "string") {
      const P = kt(n, h, _.path), M = t.resolve({ path: P.path }, _), _e = r.createHref(P.fullPath);
      return process.env.NODE_ENV !== "production" && (_e.startsWith("//") ? C(`Location "${h}" resolved to "${_e}". A resolved location cannot start with multiple slashes.`) : M.matched.length || C(`No match found for location with path "${h}"`)), A(P, M, {
        params: f(M.params),
        hash: Ke(P.hash),
        redirectedFrom: void 0,
        href: _e
      });
    }
    let y;
    if ("path" in h)
      process.env.NODE_ENV !== "production" && "params" in h && !("name" in h) && // @ts-expect-error: the type is never
      Object.keys(h.params).length && C(`Path "${// @ts-expect-error: the type is never
      h.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`), y = A({}, h, {
        path: kt(n, h.path, _.path).path
      });
    else {
      const P = A({}, h.params);
      for (const M in P)
        P[M] == null && delete P[M];
      y = A({}, h, {
        params: d(h.params)
      }), _.params = d(_.params);
    }
    const E = t.resolve(y, _), R = h.hash || "";
    process.env.NODE_ENV !== "production" && R && !R.startsWith("#") && C(`A \`hash\` should always start with the character "#". Replace "${R}" with "#${R}".`), E.params = l(f(E.params));
    const U = wa(o, A({}, h, {
      hash: li(R),
      path: E.path
    })), x = r.createHref(U);
    return process.env.NODE_ENV !== "production" && (x.startsWith("//") ? C(`Location "${h}" resolved to "${x}". A resolved location cannot start with multiple slashes.`) : E.matched.length || C(`No match found for location with path "${"path" in h ? h.path : h}"`)), A({
      fullPath: U,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash: R,
      query: (
        // if the user is using a custom query lib like qs, we might have
        // nested objects, so we keep the query as is, meaning it can contain
        // numbers at `$route.query`, but at the point, the user will have to
        // use their own type anyway.
        // https://github.com/vuejs/router/issues/328#issuecomment-649481567
        o === Gn ? pi(h.query) : h.query || {}
      )
    }, E, {
      redirectedFrom: void 0,
      href: x
    });
  }
  function I(h) {
    return typeof h == "string" ? kt(n, h, c.value.path) : A({}, h);
  }
  function L(h, _) {
    if (u !== h)
      return Ve(8, {
        from: _,
        to: h
      });
  }
  function F(h) {
    return S(h);
  }
  function Y(h) {
    return F(A(I(h), { replace: !0 }));
  }
  function X(h) {
    const _ = h.matched[h.matched.length - 1];
    if (_ && _.redirect) {
      const { redirect: y } = _;
      let E = typeof y == "function" ? y(h) : y;
      if (typeof E == "string" && (E = E.includes("?") || E.includes("#") ? E = I(E) : (
        // force empty params
        { path: E }
      ), E.params = {}), process.env.NODE_ENV !== "production" && !("path" in E) && !("name" in E))
        throw C(`Invalid redirect found:
${JSON.stringify(E, null, 2)}
 when navigating to "${h.fullPath}". A redirect must contain a name or path. This will break in production.`), new Error("Invalid redirect");
      return A({
        query: h.query,
        hash: h.hash,
        // avoid transferring params if the redirect has a path
        params: "path" in E ? {} : h.params
      }, E);
    }
  }
  function S(h, _) {
    const y = u = k(h), E = c.value, R = h.state, U = h.force, x = h.replace === !0, P = X(y);
    if (P)
      return S(
        A(I(P), {
          state: typeof P == "object" ? A({}, R, P.state) : R,
          force: U,
          replace: x
        }),
        // keep original redirectedFrom if it exists
        _ || y
      );
    const M = y;
    M.redirectedFrom = _;
    let _e;
    return !U && Vn(o, E, y) && (_e = Ve(16, { to: M, from: E }), fn(
      E,
      E,
      // this is a push, the only way for it to be triggered from a
      // history.listen is with a redirect, which makes it become a push
      !0,
      // This cannot be the first navigation because the initial location
      // cannot be manually navigated to
      !1
    )), (_e ? Promise.resolve(_e) : O(M, E)).catch((z) => ae(z) ? (
      // navigation redirects still mark the router as ready
      ae(
        z,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? z : yt(z)
    ) : (
      // reject any unknown error
      W(z, M, E)
    )).then((z) => {
      if (z) {
        if (ae(
          z,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        ))
          return process.env.NODE_ENV !== "production" && // we are redirecting to the same location we were already at
          Vn(o, k(z.to), M) && // and we have done it a couple of times
          _ && // @ts-expect-error: added only in dev
          (_._count = _._count ? (
            // @ts-expect-error
            _._count + 1
          ) : 1) > 10 ? (C(`Detected an infinite redirection in a navigation guard when going from "${E.fullPath}" to "${M.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`), Promise.reject(new Error("Infinite redirect in navigation guard"))) : S(
            // keep options
            A({
              // preserve an existing replacement but allow the redirect to override it
              replace: x
            }, I(z.to), {
              state: typeof z.to == "object" ? A({}, R, z.to.state) : R,
              force: U
            }),
            // preserve the original redirectedFrom if any
            _ || M
          );
      } else
        z = V(M, E, !0, x, R);
      return w(M, E, z), z;
    });
  }
  function ne(h, _) {
    const y = L(h, _);
    return y ? Promise.reject(y) : Promise.resolve();
  }
  function O(h, _) {
    let y;
    const [E, R, U] = Ti(h, _);
    y = It(E.reverse(), "beforeRouteLeave", h, _);
    for (const P of E)
      P.leaveGuards.forEach((M) => {
        y.push(me(M, h, _));
      });
    const x = ne.bind(null, h, _);
    return y.push(x), Re(y).then(() => {
      y = [];
      for (const P of s.list())
        y.push(me(P, h, _));
      return y.push(x), Re(y);
    }).then(() => {
      y = It(R, "beforeRouteUpdate", h, _);
      for (const P of R)
        P.updateGuards.forEach((M) => {
          y.push(me(M, h, _));
        });
      return y.push(x), Re(y);
    }).then(() => {
      y = [];
      for (const P of h.matched)
        if (P.beforeEnter && !_.matched.includes(P))
          if (J(P.beforeEnter))
            for (const M of P.beforeEnter)
              y.push(me(M, h, _));
          else
            y.push(me(P.beforeEnter, h, _));
      return y.push(x), Re(y);
    }).then(() => (h.matched.forEach((P) => P.enterCallbacks = {}), y = It(U, "beforeRouteEnter", h, _), y.push(x), Re(y))).then(() => {
      y = [];
      for (const P of a.list())
        y.push(me(P, h, _));
      return y.push(x), Re(y);
    }).catch((P) => ae(
      P,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? P : Promise.reject(P));
  }
  function w(h, _, y) {
    for (const E of i.list())
      E(h, _, y);
  }
  function V(h, _, y, E, R) {
    const U = L(h, _);
    if (U)
      return U;
    const x = _ === he, P = le ? history.state : {};
    y && (E || x ? r.replace(h.fullPath, A({
      scroll: x && P && P.scroll
    }, R)) : r.push(h.fullPath, R)), c.value = h, fn(h, _, y, x), yt();
  }
  let B;
  function we() {
    B || (B = r.listen((h, _, y) => {
      const E = k(h), R = X(E);
      if (R) {
        S(A(R, { replace: !0 }), E).catch(Fe);
        return;
      }
      u = E;
      const U = c.value;
      le && Pa(Mn(U.fullPath, y.delta), mt()), O(E, U).catch((x) => ae(
        x,
        12
        /* ErrorTypes.NAVIGATION_CANCELLED */
      ) ? x : ae(
        x,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? (S(
        x.to,
        E
        // avoid an uncaught rejection, let push call triggerError
      ).then((P) => {
        ae(
          P,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && !y.delta && y.type === ze.pop && r.go(-1, !1);
      }).catch(Fe), Promise.reject()) : (y.delta && r.go(-y.delta, !1), W(x, E, U))).then((x) => {
        x = x || V(
          // after navigation, all matched components are resolved
          E,
          U,
          !1
        ), x && (y.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
        // entry while a different route is displayed
        !ae(
          x,
          8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        ) ? r.go(-y.delta, !1) : y.type === ze.pop && ae(
          x,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && r.go(-1, !1)), w(E, U, x);
      }).catch(Fe);
    }));
  }
  let Le = Me(), Je = Me(), oe;
  function W(h, _, y) {
    yt(h);
    const E = Je.list();
    return E.length ? E.forEach((R) => R(h, _, y)) : (process.env.NODE_ENV !== "production" && C("uncaught error during route navigation:"), console.error(h)), Promise.reject(h);
  }
  function Tr() {
    return oe && c.value !== he ? Promise.resolve() : new Promise((h, _) => {
      Le.add([h, _]);
    });
  }
  function yt(h) {
    return oe || (oe = !h, we(), Le.list().forEach(([_, y]) => h ? y(h) : _()), Le.reset()), h;
  }
  function fn(h, _, y, E) {
    const { scrollBehavior: R } = e;
    if (!le || !R)
      return Promise.resolve();
    const U = !y && $a(Mn(h.fullPath, 0)) || (E || !y) && history.state && history.state.scroll || null;
    return De().then(() => R(h, _, U)).then((x) => x && Ia(x)).catch((x) => W(x, h, _));
  }
  const wt = (h) => r.go(h);
  let _t;
  const bt = /* @__PURE__ */ new Set();
  return {
    currentRoute: c,
    listening: !0,
    addRoute: p,
    removeRoute: m,
    hasRoute: g,
    getRoutes: v,
    resolve: k,
    options: e,
    push: F,
    replace: Y,
    go: wt,
    back: () => wt(-1),
    forward: () => wt(1),
    beforeEach: s.add,
    beforeResolve: a.add,
    afterEach: i.add,
    onError: Je.add,
    isReady: Tr,
    install(h) {
      const _ = this;
      h.component("RouterLink", yi), h.component("RouterView", Ei), h.config.globalProperties.$router = _, Object.defineProperty(h.config.globalProperties, "$route", {
        enumerable: !0,
        get: () => b(c)
      }), le && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !_t && c.value === he && (_t = !0, F(r.location).catch((R) => {
        process.env.NODE_ENV !== "production" && C("Unexpected error when starting the router:", R);
      }));
      const y = {};
      for (const R in he)
        y[R] = j(() => c.value[R]);
      h.provide(Zt, _), h.provide(rr, ve(y)), h.provide(jt, c);
      const E = h.unmount;
      bt.add(h), h.unmount = function() {
        bt.delete(h), bt.size < 1 && (u = he, B && B(), B = null, c.value = he, _t = !1, oe = !1), E();
      }, process.env.NODE_ENV !== "production" && le && ki(h, _, t);
    }
  };
}
function Re(e) {
  return e.reduce((t, n) => t.then(() => n()), Promise.resolve());
}
function Ti(e, t) {
  const n = [], o = [], r = [], s = Math.max(t.matched.length, e.matched.length);
  for (let a = 0; a < s; a++) {
    const i = t.matched[a];
    i && (e.matched.find((u) => ye(u, i)) ? o.push(i) : n.push(i));
    const c = e.matched[a];
    c && (t.matched.find((u) => ye(u, c)) || r.push(c));
  }
  return [n, o, r];
}
Ai({
  history: Ra(),
  routes: []
});
function Di(e) {
  return e && typeof e.then == "function";
}
Promise.resolve(!1);
Promise.resolve(!0);
var ke = Promise.resolve();
function fr(e, t) {
  return e || (e = 0), new Promise(function(n) {
    return setTimeout(function() {
      return n(t);
    }, e);
  });
}
function Vi(e, t) {
  return Math.floor(Math.random() * (t - e + 1) + e);
}
function en() {
  return Math.random().toString(36).substring(2);
}
var Xn = 0, Pt = 0;
function vt() {
  var e = (/* @__PURE__ */ new Date()).getTime();
  return e === Xn ? (Pt++, e * 1e3 + Pt) : (Xn = e, Pt = 0, e * 1e3);
}
var Li = vt, Mi = "native";
function ji(e) {
  var t = {
    messagesCallback: null,
    bc: new BroadcastChannel(e),
    subFns: []
    // subscriberFunctions
  };
  return t.bc.onmessage = function(n) {
    t.messagesCallback && t.messagesCallback(n.data);
  }, t;
}
function Bi(e) {
  e.bc.close(), e.subFns = [];
}
function Ui(e, t) {
  try {
    return e.bc.postMessage(t, !1), ke;
  } catch (n) {
    return Promise.reject(n);
  }
}
function Hi(e, t) {
  e.messagesCallback = t;
}
function Fi() {
  if (typeof window > "u")
    return !1;
  if (typeof BroadcastChannel == "function") {
    if (BroadcastChannel._pubkey)
      throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
    return !0;
  } else
    return !1;
}
function Qi() {
  return 150;
}
var Wi = {
  create: ji,
  close: Bi,
  onMessage: Hi,
  postMessage: Ui,
  canBeUsed: Fi,
  type: Mi,
  averageResponseTime: Qi,
  microSeconds: Li
}, pr = (
  /** @class */
  function() {
    function e(t) {
      this.ttl = t, this.map = /* @__PURE__ */ new Map(), this._to = !1;
    }
    return e.prototype.has = function(t) {
      return this.map.has(t);
    }, e.prototype.add = function(t) {
      var n = this;
      this.map.set(t, hr()), this._to || (this._to = !0, setTimeout(function() {
        n._to = !1, Gi(n);
      }, 0));
    }, e.prototype.clear = function() {
      this.map.clear();
    }, e;
  }()
);
function Gi(e) {
  for (var t = hr() - e.ttl, n = e.map[Symbol.iterator](); ; ) {
    var o = n.next().value;
    if (!o)
      return;
    var r = o[0], s = o[1];
    if (s < t)
      e.map.delete(r);
    else
      return;
  }
}
function hr() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function tn() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = JSON.parse(JSON.stringify(e));
  return typeof t.webWorkerSupport > "u" && (t.webWorkerSupport = !0), t.idb || (t.idb = {}), t.idb.ttl || (t.idb.ttl = 1e3 * 45), t.idb.fallbackInterval || (t.idb.fallbackInterval = 150), e.idb && typeof e.idb.onclose == "function" && (t.idb.onclose = e.idb.onclose), t.localstorage || (t.localstorage = {}), t.localstorage.removeTimeout || (t.localstorage.removeTimeout = 1e3 * 60), e.methods && (t.methods = e.methods), t.node || (t.node = {}), t.node.ttl || (t.node.ttl = 1e3 * 60 * 2), t.node.maxParallelWrites || (t.node.maxParallelWrites = 2048), typeof t.node.useFastPath > "u" && (t.node.useFastPath = !0), t;
}
var zi = vt, Ki = "pubkey.broadcast-channel-0-", de = "messages", gt = {
  durability: "relaxed"
}, qi = "idb";
function mr() {
  if (typeof indexedDB < "u")
    return indexedDB;
  if (typeof window < "u") {
    if (typeof window.mozIndexedDB < "u")
      return window.mozIndexedDB;
    if (typeof window.webkitIndexedDB < "u")
      return window.webkitIndexedDB;
    if (typeof window.msIndexedDB < "u")
      return window.msIndexedDB;
  }
  return !1;
}
function nn(e) {
  e.commit && e.commit();
}
function Ji(e) {
  var t = mr(), n = Ki + e, o = t.open(n);
  return o.onupgradeneeded = function(r) {
    var s = r.target.result;
    s.createObjectStore(de, {
      keyPath: "id",
      autoIncrement: !0
    });
  }, new Promise(function(r, s) {
    o.onerror = function(a) {
      return s(a);
    }, o.onsuccess = function() {
      r(o.result);
    };
  });
}
function Yi(e, t, n) {
  var o = (/* @__PURE__ */ new Date()).getTime(), r = {
    uuid: t,
    time: o,
    data: n
  }, s = e.transaction([de], "readwrite", gt);
  return new Promise(function(a, i) {
    s.oncomplete = function() {
      return a();
    }, s.onerror = function(u) {
      return i(u);
    };
    var c = s.objectStore(de);
    c.add(r), nn(s);
  });
}
function Xi(e, t) {
  var n = e.transaction(de, "readonly", gt), o = n.objectStore(de), r = [], s = IDBKeyRange.bound(t + 1, 1 / 0);
  if (o.getAll) {
    var a = o.getAll(s);
    return new Promise(function(c, u) {
      a.onerror = function(l) {
        return u(l);
      }, a.onsuccess = function(l) {
        c(l.target.result);
      };
    });
  }
  function i() {
    try {
      return s = IDBKeyRange.bound(t + 1, 1 / 0), o.openCursor(s);
    } catch {
      return o.openCursor();
    }
  }
  return new Promise(function(c, u) {
    var l = i();
    l.onerror = function(d) {
      return u(d);
    }, l.onsuccess = function(d) {
      var f = d.target.result;
      f ? f.value.id < t + 1 ? f.continue(t + 1) : (r.push(f.value), f.continue()) : (nn(n), c(r));
    };
  });
}
function Zi(e, t) {
  if (e.closed)
    return Promise.resolve([]);
  var n = e.db.transaction(de, "readwrite", gt), o = n.objectStore(de);
  return Promise.all(t.map(function(r) {
    var s = o.delete(r);
    return new Promise(function(a) {
      s.onsuccess = function() {
        return a();
      };
    });
  }));
}
function el(e, t) {
  var n = (/* @__PURE__ */ new Date()).getTime() - t, o = e.transaction(de, "readonly", gt), r = o.objectStore(de), s = [];
  return new Promise(function(a) {
    r.openCursor().onsuccess = function(i) {
      var c = i.target.result;
      if (c) {
        var u = c.value;
        u.time < n ? (s.push(u), c.continue()) : (nn(o), a(s));
      } else
        a(s);
    };
  });
}
function tl(e) {
  return el(e.db, e.options.idb.ttl).then(function(t) {
    return Zi(e, t.map(function(n) {
      return n.id;
    }));
  });
}
function nl(e, t) {
  return t = tn(t), Ji(e).then(function(n) {
    var o = {
      closed: !1,
      lastCursorId: 0,
      channelName: e,
      options: t,
      uuid: en(),
      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new pr(t.idb.ttl * 2),
      // ensures we do not read messages in parallel
      writeBlockPromise: ke,
      messagesCallback: null,
      readQueuePromises: [],
      db: n
    };
    return n.onclose = function() {
      o.closed = !0, t.idb.onclose && t.idb.onclose();
    }, vr(o), o;
  });
}
function vr(e) {
  e.closed || gr(e).then(function() {
    return fr(e.options.idb.fallbackInterval);
  }).then(function() {
    return vr(e);
  });
}
function ol(e, t) {
  return !(e.uuid === t.uuid || t.eMIs.has(e.id) || e.data.time < t.messagesCallbackTime);
}
function gr(e) {
  return e.closed || !e.messagesCallback ? ke : Xi(e.db, e.lastCursorId).then(function(t) {
    var n = t.filter(function(o) {
      return !!o;
    }).map(function(o) {
      return o.id > e.lastCursorId && (e.lastCursorId = o.id), o;
    }).filter(function(o) {
      return ol(o, e);
    }).sort(function(o, r) {
      return o.time - r.time;
    });
    return n.forEach(function(o) {
      e.messagesCallback && (e.eMIs.add(o.id), e.messagesCallback(o.data));
    }), ke;
  });
}
function rl(e) {
  e.closed = !0, e.db.close();
}
function sl(e, t) {
  return e.writeBlockPromise = e.writeBlockPromise.then(function() {
    return Yi(e.db, e.uuid, t);
  }).then(function() {
    Vi(0, 10) === 0 && tl(e);
  }), e.writeBlockPromise;
}
function al(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t, gr(e);
}
function il() {
  return !!mr();
}
function ll(e) {
  return e.idb.fallbackInterval * 2;
}
var cl = {
  create: nl,
  close: rl,
  onMessage: al,
  postMessage: sl,
  canBeUsed: il,
  type: qi,
  averageResponseTime: ll,
  microSeconds: zi
}, ul = vt, dl = "pubkey.broadcastChannel-", fl = "localstorage";
function yr() {
  var e;
  if (typeof window > "u")
    return null;
  try {
    e = window.localStorage, e = window["ie8-eventlistener/storage"] || window.localStorage;
  } catch {
  }
  return e;
}
function wr(e) {
  return dl + e;
}
function pl(e, t) {
  return new Promise(function(n) {
    fr().then(function() {
      var o = wr(e.channelName), r = {
        token: en(),
        time: (/* @__PURE__ */ new Date()).getTime(),
        data: t,
        uuid: e.uuid
      }, s = JSON.stringify(r);
      yr().setItem(o, s);
      var a = document.createEvent("Event");
      a.initEvent("storage", !0, !0), a.key = o, a.newValue = s, window.dispatchEvent(a), n();
    });
  });
}
function hl(e, t) {
  var n = wr(e), o = function(s) {
    s.key === n && t(JSON.parse(s.newValue));
  };
  return window.addEventListener("storage", o), o;
}
function ml(e) {
  window.removeEventListener("storage", e);
}
function vl(e, t) {
  if (t = tn(t), !_r())
    throw new Error("BroadcastChannel: localstorage cannot be used");
  var n = en(), o = new pr(t.localstorage.removeTimeout), r = {
    channelName: e,
    uuid: n,
    eMIs: o
    // emittedMessagesIds
  };
  return r.listener = hl(e, function(s) {
    r.messagesCallback && s.uuid !== n && (!s.token || o.has(s.token) || s.data.time && s.data.time < r.messagesCallbackTime || (o.add(s.token), r.messagesCallback(s.data)));
  }), r;
}
function gl(e) {
  ml(e.listener);
}
function yl(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t;
}
function _r() {
  var e = yr();
  if (!e)
    return !1;
  try {
    var t = "__broadcastchannel_check";
    e.setItem(t, "works"), e.removeItem(t);
  } catch {
    return !1;
  }
  return !0;
}
function wl() {
  var e = 120, t = navigator.userAgent.toLowerCase();
  return t.includes("safari") && !t.includes("chrome") ? e * 2 : e;
}
var _l = {
  create: vl,
  close: gl,
  onMessage: yl,
  postMessage: pl,
  canBeUsed: _r,
  type: fl,
  averageResponseTime: wl,
  microSeconds: ul
}, bl = vt, El = "simulate", on = /* @__PURE__ */ new Set();
function Ol(e) {
  var t = {
    name: e,
    messagesCallback: null
  };
  return on.add(t), t;
}
function Sl(e) {
  on.delete(e);
}
function kl(e, t) {
  return new Promise(function(n) {
    return setTimeout(function() {
      var o = Array.from(on);
      o.filter(function(r) {
        return r.name === e.name;
      }).filter(function(r) {
        return r !== e;
      }).filter(function(r) {
        return !!r.messagesCallback;
      }).forEach(function(r) {
        return r.messagesCallback(t);
      }), n();
    }, 5);
  });
}
function Il(e, t) {
  e.messagesCallback = t;
}
function Pl() {
  return !0;
}
function $l() {
  return 5;
}
var xl = {
  create: Ol,
  close: Sl,
  onMessage: Il,
  postMessage: kl,
  canBeUsed: Pl,
  type: El,
  averageResponseTime: $l,
  microSeconds: bl
}, Zn = [
  Wi,
  // fastest
  cl,
  _l
];
function Nl(e) {
  var t = [].concat(e.methods, Zn).filter(Boolean);
  if (e.type) {
    if (e.type === "simulate")
      return xl;
    var n = t.find(function(r) {
      return r.type === e.type;
    });
    if (n)
      return n;
    throw new Error("method-type " + e.type + " not found");
  }
  e.webWorkerSupport || (t = t.filter(function(r) {
    return r.type !== "idb";
  }));
  var o = t.find(function(r) {
    return r.canBeUsed();
  });
  if (o)
    return o;
  throw new Error("No usable method found in " + JSON.stringify(Zn.map(function(r) {
    return r.type;
  })));
}
var br = /* @__PURE__ */ new Set(), Cl = 0, rn = function(t, n) {
  this.id = Cl++, br.add(this), this.name = t, this.options = tn(n), this.method = Nl(this.options), this._iL = !1, this._onML = null, this._addEL = {
    message: [],
    internal: []
  }, this._uMP = /* @__PURE__ */ new Set(), this._befC = [], this._prepP = null, Rl(this);
};
rn._pubkey = !0;
rn.prototype = {
  postMessage: function(t) {
    if (this.closed)
      throw new Error("BroadcastChannel.postMessage(): Cannot post message after channel has closed " + /**
      * In the past when this error appeared, it was really hard to debug.
      * So now we log the msg together with the error so it at least
      * gives some clue about where in your application this happens.
      */
      JSON.stringify(t));
    return eo(this, "message", t);
  },
  postInternal: function(t) {
    return eo(this, "internal", t);
  },
  set onmessage(e) {
    var t = this.method.microSeconds(), n = {
      time: t,
      fn: e
    };
    no(this, "message", this._onML), e && typeof e == "function" ? (this._onML = n, to(this, "message", n)) : this._onML = null;
  },
  addEventListener: function(t, n) {
    var o = this.method.microSeconds(), r = {
      time: o,
      fn: n
    };
    to(this, t, r);
  },
  removeEventListener: function(t, n) {
    var o = this._addEL[t].find(function(r) {
      return r.fn === n;
    });
    no(this, t, o);
  },
  close: function() {
    var t = this;
    if (!this.closed) {
      br.delete(this), this.closed = !0;
      var n = this._prepP ? this._prepP : ke;
      return this._onML = null, this._addEL.message = [], n.then(function() {
        return Promise.all(Array.from(t._uMP));
      }).then(function() {
        return Promise.all(t._befC.map(function(o) {
          return o();
        }));
      }).then(function() {
        return t.method.close(t._state);
      });
    }
  },
  get type() {
    return this.method.type;
  },
  get isClosed() {
    return this.closed;
  }
};
function eo(e, t, n) {
  var o = e.method.microSeconds(), r = {
    time: o,
    type: t,
    data: n
  }, s = e._prepP ? e._prepP : ke;
  return s.then(function() {
    var a = e.method.postMessage(e._state, r);
    return e._uMP.add(a), a.catch().then(function() {
      return e._uMP.delete(a);
    }), a;
  });
}
function Rl(e) {
  var t = e.method.create(e.name, e.options);
  Di(t) ? (e._prepP = t, t.then(function(n) {
    e._state = n;
  })) : e._state = t;
}
function Er(e) {
  return e._addEL.message.length > 0 || e._addEL.internal.length > 0;
}
function to(e, t, n) {
  e._addEL[t].push(n), Al(e);
}
function no(e, t, n) {
  e._addEL[t] = e._addEL[t].filter(function(o) {
    return o !== n;
  }), Tl(e);
}
function Al(e) {
  if (!e._iL && Er(e)) {
    var t = function(r) {
      e._addEL[r.type].forEach(function(s) {
        var a = 1e5, i = s.time - a;
        r.time >= i && s.fn(r.data);
      });
    }, n = e.method.microSeconds();
    e._prepP ? e._prepP.then(function() {
      e._iL = !0, e.method.onMessage(e._state, t, n);
    }) : (e._iL = !0, e.method.onMessage(e._state, t, n));
  }
}
function Tl(e) {
  if (e._iL && !Er(e)) {
    e._iL = !1;
    var t = e.method.microSeconds();
    e.method.onMessage(e._state, null, t);
  }
}
const oo = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\u0000",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
class $t extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   */
  constructor(t, n) {
    super(t), this.name = "DevalueError", this.path = n.join("");
  }
}
function ro(e) {
  return Object(e) !== e;
}
const Dl = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function Vl(e) {
  const t = Object.getPrototypeOf(e);
  return t === Object.prototype || t === null || Object.getOwnPropertyNames(t).sort().join("\0") === Dl;
}
function Ll(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function Te(e) {
  let t = '"';
  for (let n = 0; n < e.length; n += 1) {
    const o = e.charAt(n), r = o.charCodeAt(0);
    if (o === '"')
      t += '\\"';
    else if (o in oo)
      t += oo[o];
    else if (r <= 31)
      t += `\\u${r.toString(16).toUpperCase().padStart(4, "0")}`;
    else if (r >= 55296 && r <= 57343) {
      const s = e.charCodeAt(n + 1);
      r <= 56319 && s >= 56320 && s <= 57343 ? t += o + e[++n] : t += `\\u${r.toString(16).toUpperCase()}`;
    } else
      t += o;
  }
  return t += '"', t;
}
const sn = -1, Or = -2, Sr = -3, kr = -4, Ir = -5, an = -6;
function so(e, t) {
  return Ml(JSON.parse(e), t);
}
function Ml(e, t) {
  if (typeof e == "number")
    return r(e, !0);
  if (!Array.isArray(e) || e.length === 0)
    throw new Error("Invalid input");
  const n = (
    /** @type {any[]} */
    e
  ), o = Array(n.length);
  function r(s, a = !1) {
    if (s === sn)
      return;
    if (s === Sr)
      return NaN;
    if (s === kr)
      return 1 / 0;
    if (s === Ir)
      return -1 / 0;
    if (s === an)
      return -0;
    if (a)
      throw new Error("Invalid input");
    if (s in o)
      return o[s];
    const i = n[s];
    if (!i || typeof i != "object")
      o[s] = i;
    else if (Array.isArray(i))
      if (typeof i[0] == "string") {
        const c = i[0], u = t == null ? void 0 : t[c];
        if (u)
          return o[s] = u(r(i[1]));
        switch (c) {
          case "Date":
            o[s] = new Date(i[1]);
            break;
          case "Set":
            const l = /* @__PURE__ */ new Set();
            o[s] = l;
            for (let p = 1; p < i.length; p += 1)
              l.add(r(i[p]));
            break;
          case "Map":
            const d = /* @__PURE__ */ new Map();
            o[s] = d;
            for (let p = 1; p < i.length; p += 2)
              d.set(r(i[p]), r(i[p + 1]));
            break;
          case "RegExp":
            o[s] = new RegExp(i[1], i[2]);
            break;
          case "Object":
            o[s] = Object(i[1]);
            break;
          case "BigInt":
            o[s] = BigInt(i[1]);
            break;
          case "null":
            const f = /* @__PURE__ */ Object.create(null);
            o[s] = f;
            for (let p = 1; p < i.length; p += 2)
              f[i[p]] = r(i[p + 1]);
            break;
          default:
            throw new Error(`Unknown type ${c}`);
        }
      } else {
        const c = new Array(i.length);
        o[s] = c;
        for (let u = 0; u < i.length; u += 1) {
          const l = i[u];
          l !== Or && (c[u] = r(l));
        }
      }
    else {
      const c = {};
      o[s] = c;
      for (const u in i) {
        const l = i[u];
        c[u] = r(l);
      }
    }
    return o[s];
  }
  return r(0);
}
function ao(e, t) {
  const n = [], o = /* @__PURE__ */ new Map(), r = [];
  for (const u in t)
    r.push({ key: u, fn: t[u] });
  const s = [];
  let a = 0;
  function i(u) {
    if (typeof u == "function")
      throw new $t("Cannot stringify a function", s);
    if (o.has(u))
      return o.get(u);
    if (u === void 0)
      return sn;
    if (Number.isNaN(u))
      return Sr;
    if (u === 1 / 0)
      return kr;
    if (u === -1 / 0)
      return Ir;
    if (u === 0 && 1 / u < 0)
      return an;
    const l = a++;
    o.set(u, l);
    for (const { key: f, fn: p } of r) {
      const m = p(u);
      if (m)
        return n[l] = `["${f}",${i(m)}]`, l;
    }
    let d = "";
    if (ro(u))
      d = xt(u);
    else
      switch (Ll(u)) {
        case "Number":
        case "String":
        case "Boolean":
          d = `["Object",${xt(u)}]`;
          break;
        case "BigInt":
          d = `["BigInt",${u}]`;
          break;
        case "Date":
          d = `["Date","${u.toISOString()}"]`;
          break;
        case "RegExp":
          const { source: p, flags: m } = u;
          d = m ? `["RegExp",${Te(p)},"${m}"]` : `["RegExp",${Te(p)}]`;
          break;
        case "Array":
          d = "[";
          for (let v = 0; v < u.length; v += 1)
            v > 0 && (d += ","), v in u ? (s.push(`[${v}]`), d += i(u[v]), s.pop()) : d += Or;
          d += "]";
          break;
        case "Set":
          d = '["Set"';
          for (const v of u)
            d += `,${i(v)}`;
          d += "]";
          break;
        case "Map":
          d = '["Map"';
          for (const [v, g] of u)
            s.push(
              `.get(${ro(v) ? xt(v) : "..."})`
            ), d += `,${i(v)},${i(g)}`;
          d += "]";
          break;
        default:
          if (!Vl(u))
            throw new $t(
              "Cannot stringify arbitrary non-POJOs",
              s
            );
          if (Object.getOwnPropertySymbols(u).length > 0)
            throw new $t(
              "Cannot stringify POJOs with symbolic keys",
              s
            );
          if (Object.getPrototypeOf(u) === null) {
            d = '["null"';
            for (const v in u)
              s.push(`.${v}`), d += `,${Te(v)},${i(u[v])}`, s.pop();
            d += "]";
          } else {
            d = "{";
            let v = !1;
            for (const g in u)
              v && (d += ","), v = !0, s.push(`.${g}`), d += `${Te(g)}:${i(u[g])}`, s.pop();
            d += "}";
          }
      }
    return n[l] = d, l;
  }
  const c = i(e);
  return c < 0 ? `${c}` : `[${n.join(",")}]`;
}
function xt(e) {
  const t = typeof e;
  return t === "string" ? Te(e) : e instanceof String ? Te(e.toString()) : e === void 0 ? sn.toString() : e === 0 && 1 / e < 0 ? an.toString() : t === "bigint" ? `["BigInt","${e}"]` : String(e);
}
function jl(e, t, { initialize: n, type: o }) {
  let r = `${t.$id}-${e.toString()}`, s = new rn(r, { type: o }), a = !1, i = 0;
  ee(() => t[e], (l) => {
    a || (i = Date.now(), s.postMessage({ timestamp: i, state: so(ao(l)) })), a = !1;
  }, { deep: !0 }), s.onmessage = (l) => {
    if (l === void 0) {
      s.postMessage({ timestamp: i, state: so(ao(t[e])) });
      return;
    }
    l.timestamp <= i || (a = !0, i = l.timestamp, t[e] = l.state);
  };
  let c = () => s.postMessage(void 0), u = () => s.close();
  return n && c(), { sync: c, unshare: u };
}
var Bl = (e, t) => Object.keys(t).includes(e), Ul = ({ initialize: e = !0, enable: t = !0, type: n }) => ({ store: o, options: r }) => {
  var s, a;
  let i = ((s = r == null ? void 0 : r.share) == null ? void 0 : s.enable) ?? t, c = ((a = r == null ? void 0 : r.share) == null ? void 0 : a.omit) ?? [];
  !i || Object.keys(o.$state).forEach((u) => {
    var l;
    c.includes(u) || !Bl(u, o.$state) || jl(u, o, { initialize: ((l = r == null ? void 0 : r.share) == null ? void 0 : l.initialize) ?? e, type: n });
  });
};
const Hl = oa();
Hl.use(
  Ul({
    enable: !0,
    initialize: !0
  })
);
const Fl = /* @__PURE__ */ K({
  __name: "Doctype",
  setup(e) {
    const { stonecrop: t, isReady: n } = zo(), o = N([]);
    return ee(n, () => {
      if (n.value) {
        let r = t.value.schema.schema.toArray();
        r.forEach((s, a) => {
          const c = t.value.store.record[s.fieldname];
          r[a].value = c;
        }), o.value = r;
      }
    }), (r, s) => b(n) ? ($(), Se(b(Rs), {
      key: 0,
      class: "aform-main",
      modelValue: o.value,
      "onUpdate:modelValue": s[0] || (s[0] = (a) => o.value = a)
    }, null, 8, ["modelValue"])) : Oe("", !0);
  }
});
var io;
const Pr = typeof window < "u", Ql = (e) => typeof e == "string", Wl = () => {
};
Pr && (io = window == null ? void 0 : window.navigator) != null && io.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function $r(e) {
  return typeof e == "function" ? e() : b(e);
}
function Gl(e) {
  return e;
}
function zl(e) {
  return Wt() ? (Gt(e), !0) : !1;
}
function Ut(e) {
  var t;
  const n = $r(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const xr = Pr ? window : void 0;
function Kl(...e) {
  let t, n, o, r;
  if (Ql(e[0]) || Array.isArray(e[0]) ? ([n, o, r] = e, t = xr) : [t, n, o, r] = e, !t)
    return Wl;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const s = [], a = () => {
    s.forEach((l) => l()), s.length = 0;
  }, i = (l, d, f, p) => (l.addEventListener(d, f, p), () => l.removeEventListener(d, f, p)), c = ee(() => [Ut(t), $r(r)], ([l, d]) => {
    a(), l && s.push(...n.flatMap((f) => o.map((p) => i(l, f, p, d))));
  }, { immediate: !0, flush: "post" }), u = () => {
    c(), a();
  };
  return zl(u), u;
}
const lo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, co = "__vueuse_ssr_handlers__";
lo[co] = lo[co] || {};
function ql(e, { window: t = xr, scrollTarget: n } = {}) {
  const o = N(!1), r = () => {
    if (!t)
      return;
    const s = t.document, a = Ut(e);
    if (!a)
      o.value = !1;
    else {
      const i = a.getBoundingClientRect();
      o.value = i.top <= (t.innerHeight || s.documentElement.clientHeight) && i.left <= (t.innerWidth || s.documentElement.clientWidth) && i.bottom >= 0 && i.right >= 0;
    }
  };
  return ee(() => Ut(e), () => r(), { immediate: !0, flush: "post" }), t && Kl(n || t, "scroll", r, {
    capture: !1,
    passive: !0
  }), o;
}
var uo;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(uo || (uo = {}));
var Jl = Object.defineProperty, fo = Object.getOwnPropertySymbols, Yl = Object.prototype.hasOwnProperty, Xl = Object.prototype.propertyIsEnumerable, po = (e, t, n) => t in e ? Jl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Zl = (e, t) => {
  for (var n in t || (t = {}))
    Yl.call(t, n) && po(e, n, t[n]);
  if (fo)
    for (var n of fo(t))
      Xl.call(t, n) && po(e, n, t[n]);
  return e;
};
const ec = {
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
Zl({
  linear: Gl
}, ec);
const fe = (e) => {
  let t = ql(e).value;
  return t = t && e.offsetHeight > 0, t;
}, pe = (e) => e.tabIndex >= 0, ho = (e) => {
  const t = e.target;
  return ln(t);
}, ln = (e) => {
  var t;
  let n;
  if (e instanceof HTMLTableCellElement) {
    const o = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    if (o) {
      const r = Array.from(o.children)[e.cellIndex];
      r && (n = r);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const o = e.previousElementSibling;
    o && (n = o);
  }
  return n && (!pe(n) || !fe(n)) ? ln(n) : n;
}, tc = (e) => {
  var t;
  const n = e.target;
  let o;
  if (n instanceof HTMLTableCellElement) {
    const r = (t = n.parentElement) == null ? void 0 : t.parentElement;
    if (r) {
      const s = r.firstElementChild.children[n.cellIndex];
      s && (o = s);
    }
  } else if (n instanceof HTMLTableRowElement) {
    const r = n.parentElement;
    if (r) {
      const s = r.firstElementChild;
      s && (o = s);
    }
  }
  return o && (!pe(o) || !fe(o)) ? cn(o) : o;
}, mo = (e) => {
  const t = e.target;
  return cn(t);
}, cn = (e) => {
  var t;
  let n;
  if (e instanceof HTMLTableCellElement) {
    const o = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    if (o) {
      const r = Array.from(o.children)[e.cellIndex];
      r && (n = r);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const o = e.nextElementSibling;
    o && (n = o);
  }
  return n && (!pe(n) || !fe(n)) ? cn(n) : n;
}, nc = (e) => {
  var t;
  const n = e.target;
  let o;
  if (n instanceof HTMLTableCellElement) {
    const r = (t = n.parentElement) == null ? void 0 : t.parentElement;
    if (r) {
      const s = r.lastElementChild.children[n.cellIndex];
      s && (o = s);
    }
  } else if (n instanceof HTMLTableRowElement) {
    const r = n.parentElement;
    if (r) {
      const s = r.lastElementChild;
      s && (o = s);
    }
  }
  return o && (!pe(o) || !fe(o)) ? ln(o) : o;
}, vo = (e) => {
  const t = e.target;
  return un(t);
}, un = (e) => {
  var t;
  let n;
  if (e.previousElementSibling)
    n = e.previousElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    n = o == null ? void 0 : o.lastElementChild;
  }
  return n && (!pe(n) || !fe(n)) ? un(n) : n;
}, go = (e) => {
  const t = e.target;
  return dn(t);
}, dn = (e) => {
  var t;
  let n;
  if (e.nextElementSibling)
    n = e.nextElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    n = o == null ? void 0 : o.firstElementChild;
  }
  return n && (!pe(n) || !fe(n)) ? dn(n) : n;
}, yo = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!pe(t) || !fe(t)) ? dn(t) : t;
}, wo = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!pe(t) || !fe(t)) ? un(t) : t;
}, et = ["alt", "control", "shift", "meta"], oc = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, Nr = {
  "keydown.up": (e) => {
    const t = ho(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.down": (e) => {
    const t = mo(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.left": (e) => {
    const t = vo(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.right": (e) => {
    const t = go(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.control.up": (e) => {
    const t = tc(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = nc(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.left": (e) => {
    const t = yo(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.right": (e) => {
    const t = wo(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.end": (e) => {
    const t = wo(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = mo(e);
      t && t.focus();
    }
  },
  "keydown.shift.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = ho(e);
      t && t.focus();
    }
  },
  "keydown.home": (e) => {
    const t = yo(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.tab": (e) => {
    const t = go(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.shift.tab": (e) => {
    const t = vo(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  }
};
function Cr(e) {
  const t = (o) => {
    let r = null;
    o.parent && (typeof o.parent == "string" ? r = document.querySelector(o.parent) : o.parent instanceof Element ? r = o.parent : r = o.parent.value);
    let s = [];
    if (o.selectors)
      if (typeof o.selectors == "string")
        s = r ? Array.from(r.querySelectorAll(o.selectors)) : Array.from(document.querySelectorAll(o.selectors));
      else if (o.selectors instanceof Element)
        s.push(o.selectors);
      else if (Array.isArray(o.selectors.value))
        for (const a of o.selectors.value)
          a instanceof Element ? s.push(a) : s.push(a.$el);
      else
        s.push(o.selectors.value);
    else
      s = Array.from(r.children).filter((a) => pe(a) && fe(a));
    return s;
  }, n = (o) => (r) => {
    const s = oc[r.key] || r.key.toLowerCase();
    if (et.includes(s))
      return;
    const a = o.handlers || Nr;
    for (const i of Object.keys(a)) {
      const [c, ...u] = i.split(".");
      if (c === "keydown" && u.includes(s)) {
        const l = a[i], d = u.filter((p) => et.includes(p)), f = et.some((p) => {
          const m = p.charAt(0).toUpperCase() + p.slice(1);
          return r.getModifierState(m);
        });
        if (d.length > 0) {
          if (f) {
            for (const p of et)
              if (u.includes(p)) {
                const m = p.charAt(0).toUpperCase() + p.slice(1);
                r.getModifierState(m) && l(r);
              }
          }
        } else
          f || l(r);
      }
    }
  };
  ut(() => {
    for (const o of e) {
      const r = t(o);
      for (const s of r)
        s.addEventListener("keydown", n(o));
    }
  }), Mr(() => {
    for (const o of e) {
      const r = t(o);
      for (const s of r)
        s.removeEventListener("keydown", n(o));
    }
  });
}
const rc = ["data-colindex", "data-rowindex", "data-editable", "contenteditable", "tabindex"], sc = { key: 1 }, ac = /* @__PURE__ */ K({
  __name: "ACell",
  props: {
    colIndex: null,
    rowIndex: null,
    tableid: null,
    addNavigation: { type: [Boolean, Object], default: !0 },
    tabIndex: { default: 0 },
    clickHandler: null
  },
  setup(e) {
    var t;
    const n = e, o = q(n.tableid), r = N(null);
    let s = N(!1);
    const a = j(() => {
      const v = o.cellData(n.colIndex, n.rowIndex);
      if (o.columns[n.colIndex].format) {
        const g = o.columns[n.colIndex].format;
        return typeof g == "function" ? g(v) : typeof g == "string" ? Function(`"use strict";return (${g})`)()(v) : v;
      } else
        return v;
    }), i = (v) => {
      if (n.clickHandler) {
        n.clickHandler(v);
        return;
      }
      if (o.columns[n.colIndex].mask, o.columns[n.colIndex].modalComponent) {
        const g = r.value.getBoundingClientRect();
        o.modal.visible = !0, o.modal.colIndex = n.colIndex, o.modal.rowIndex = n.rowIndex, o.modal.parent = r.value, o.modal.top = g.top + g.height, o.modal.left = g.left, o.modal.width = u.value, o.modal.component = o.columns[n.colIndex].modalComponent, o.modal.componentProps = o.columns[n.colIndex].modalComponentProps;
      }
    };
    if (n.addNavigation) {
      let v = {
        ...Nr,
        "keydown.f2": i,
        "keydown.alt.up": i,
        "keydown.alt.down": i,
        "keydown.alt.left": i,
        "keydown.alt.right": i
      };
      typeof n.addNavigation == "object" && (v = {
        ...v,
        ...n.addNavigation
      }), Cr([
        {
          selectors: r,
          handlers: v
        }
      ]);
    }
    const c = j(() => o.columns[n.colIndex].align || "center"), u = j(() => o.columns[n.colIndex].width || "40ch");
    let l = "";
    const d = () => {
      r.value && (l = r.value.innerText);
    }, f = () => {
      r.value && r.value.innerHTML !== l && (l = r.value.innerText, r.value.dispatchEvent(new Event("change")), s.value = !0, o.columns[n.colIndex].format || o.setCellData(n.rowIndex, n.colIndex, l));
    }, p = (v, g) => g && v === 0 && g > 0 ? `${g}ch` : "inherit", m = {
      textAlign: c.value,
      width: u.value,
      backgroundColor: s.value ? "var(--cell-modified-color)" : "inherit",
      fontWeight: s.value ? "bold" : "inherit",
      paddingLeft: p(n.colIndex, (t = o.display[n.rowIndex]) == null ? void 0 : t.indent)
    };
    return (v, g) => ($(), T("td", {
      ref_key: "cell",
      ref: r,
      "data-colindex": e.colIndex,
      "data-rowindex": e.rowIndex,
      "data-editable": b(o).columns[e.colIndex].edit,
      contenteditable: b(o).columns[e.colIndex].edit,
      tabindex: e.tabIndex,
      spellcheck: !1,
      style: m,
      onFocus: d,
      onPaste: f,
      onBlur: f,
      onInput: f,
      onClick: i,
      onMousedown: i
    }, [
      b(o).columns[e.colIndex].cellComponent ? ($(), Se(Ft(b(o).columns[e.colIndex].cellComponent), Qt({
        key: 0,
        value: b(a)
      }, b(o).columns[e.colIndex].cellComponentProps), null, 16, ["value"])) : ($(), T("span", sc, ue(b(a)), 1))
    ], 40, rc));
  }
}), qe = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, ic = /* @__PURE__ */ qe(ac, [["__scopeId", "data-v-1738c6fc"]]), lc = ["tabindex"], cc = {
  key: 0,
  tabIndex: -1,
  class: "list-index"
}, uc = /* @__PURE__ */ K({
  __name: "ARow",
  props: {
    row: null,
    rowIndex: null,
    tableid: null,
    tabIndex: { default: -1 },
    addNavigation: null
  },
  setup(e) {
    const t = e;
    Io((c) => ({
      "6b10edcf": b(r)
    }));
    const n = q(t.tableid), o = N(null), r = n.numberedRowWidth.value, s = () => n.config.view !== "tree" ? "" : n.display[t.rowIndex].isRoot || n.display[t.rowIndex].isParent ? n.display[t.rowIndex].childrenOpen ? "-" : "+" : "", a = () => n.config.view !== "tree" || n.display[t.rowIndex].isRoot || n.display[t.rowIndex].open, i = (c) => {
      n.toggleRowExpand(c);
    };
    return t.addNavigation && Cr([
      {
        selectors: o,
        handlers: t.addNavigation
      }
    ]), (c, u) => dt(($(), T("tr", {
      ref_key: "rowEl",
      ref: o,
      tabindex: e.tabIndex,
      class: "table-row"
    }, [
      b(n).config.view === "list" ? ($(), T("td", cc, ue(e.rowIndex + 1), 1)) : b(n).config.view === "tree" ? ($(), T("td", {
        key: 1,
        tabIndex: -1,
        class: "tree-index",
        onClick: u[0] || (u[0] = (l) => i(e.rowIndex))
      }, ue(s()), 1)) : ge(c.$slots, "indexCell", { key: 2 }, void 0, !0),
      ge(c.$slots, "default", {}, void 0, !0)
    ], 8, lc)), [
      [Ht, a()]
    ]);
  }
}), dc = /* @__PURE__ */ qe(uc, [["__scopeId", "data-v-c758303d"]]);
let tt;
const fc = new Uint8Array(16);
function pc() {
  if (!tt && (tt = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !tt))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return tt(fc);
}
const Q = [];
for (let e = 0; e < 256; ++e)
  Q.push((e + 256).toString(16).slice(1));
function hc(e, t = 0) {
  return (Q[e[t + 0]] + Q[e[t + 1]] + Q[e[t + 2]] + Q[e[t + 3]] + "-" + Q[e[t + 4]] + Q[e[t + 5]] + "-" + Q[e[t + 6]] + Q[e[t + 7]] + "-" + Q[e[t + 8]] + Q[e[t + 9]] + "-" + Q[e[t + 10]] + Q[e[t + 11]] + Q[e[t + 12]] + Q[e[t + 13]] + Q[e[t + 14]] + Q[e[t + 15]]).toLowerCase();
}
const mc = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), _o = {
  randomUUID: mc
};
function Rr(e, t, n) {
  if (_o.randomUUID && !t && !e)
    return _o.randomUUID();
  e = e || {};
  const o = e.random || (e.rng || pc)();
  if (o[6] = o[6] & 15 | 64, o[8] = o[8] & 63 | 128, t) {
    n = n || 0;
    for (let r = 0; r < 16; ++r)
      t[n + r] = o[r];
    return t;
  }
  return hc(o);
}
class vc {
  constructor(t, n, o, r, s, a) {
    this.id = t || Rr(), this.rows = o, this.columns = ve(n), this.config = ve(r), this.table = s || ve(this.createTableObject()), this.display = this.createDisplayObject(a), this.modal = ve({ visible: !1 });
  }
  createTableObject() {
    const t = {};
    for (const [n, o] of this.columns.entries())
      for (const [r, s] of this.rows.entries())
        t[`${n}:${r}`] = s[o.name];
    return t;
  }
  createDisplayObject(t) {
    const n = [Object.assign({}, { modified: !1 })];
    if (t && "0:0" in t)
      return t;
    const o = /* @__PURE__ */ new Set();
    for (let r = this.rows.length - 1; r >= 0; r--) {
      const s = this.rows[r];
      s.parent && o.add(s.parent), n[r] = {
        childrenOpen: !1,
        expanded: !1,
        indent: s.indent || null,
        isParent: o.has(r),
        isRoot: s.parent === null || s.parent === void 0,
        modified: !1,
        open: s.parent === null || s.parent === void 0,
        parent: s.parent
      };
    }
    return ve(n);
  }
  get zeroColumn() {
    return ["list", "tree", "list-expansion"].includes(this.config.view);
  }
  get numberedRowWidth() {
    return j(() => String(Math.ceil(this.rows.length / 100) + 1) + "ch");
  }
  cellData(t, n) {
    return this.table[`${t}:${n}`];
  }
  setCellData(t, n, o) {
    this.table[`${n}:${t}`] !== o && (this.display[t].modified = !0), this.table[`${n}:${t}`] = o;
    const r = this.columns[n];
    return this.rows[t][r.name] = o, this.table[`${n}:${t}`];
  }
  toggleRowExpand(t) {
    if (this.config.view === "tree") {
      this.display[t].childrenOpen = !this.display[t].childrenOpen;
      for (let n = this.rows.length - 1; n >= 0; n--)
        this.display[n].parent === t && (this.display[n].open = !this.display[n].open, this.display[n].childrenOpen && this.toggleRowExpand(n));
    } else
      this.config.view === "list-expansion" && (this.display[t].expanded = !this.display[t].expanded);
  }
}
const gc = { key: 0 }, yc = {
  class: "atable-header-row",
  tabindex: "-1"
}, wc = {
  key: 0,
  id: "header-index"
}, _c = /* @__PURE__ */ K({
  __name: "ATableHeader",
  props: {
    columns: null,
    config: null,
    tableid: null
  },
  setup(e) {
    const t = e;
    Io((s) => ({
      "1cb0fcc9": b(o)
    }));
    const n = q(t.tableid), o = n.numberedRowWidth.value, r = (s) => ({
      minWidth: s.width || "40ch",
      textAlign: s.align || "center",
      width: n.config.fullWidth ? "auto" : null
    });
    return (s, a) => e.columns.length ? ($(), T("thead", gc, [
      D("tr", yc, [
        b(n).zeroColumn ? ($(), T("th", wc)) : Oe("", !0),
        ($(!0), T(Ie, null, Pe(e.columns, (i, c) => ($(), T("th", {
          key: c,
          tabindex: "-1",
          style: ce(r(i))
        }, [
          ge(s.$slots, "default", {}, () => [
            Po(ue(i.label || String.fromCharCode(c + 97).toUpperCase()), 1)
          ], !0)
        ], 4))), 128))
      ])
    ])) : Oe("", !0);
  }
}), bc = /* @__PURE__ */ qe(_c, [["__scopeId", "data-v-8a8d9cee"]]), Ec = /* @__PURE__ */ K({
  __name: "ATableModal",
  props: {
    colIndex: null,
    rowIndex: null,
    tableid: null
  },
  setup(e) {
    q(e.tableid);
    const t = (n) => {
      n.stopPropagation();
    };
    return (n, o) => ($(), T("div", {
      ref: "amodal",
      class: "amodal",
      tabindex: "-1",
      onClick: t,
      onInput: t
    }, [
      ge(n.$slots, "default", {}, void 0, !0)
    ], 544));
  }
}), Oc = /* @__PURE__ */ qe(Ec, [["__scopeId", "data-v-8ac70767"]]), Sc = /* @__PURE__ */ K({
  __name: "ATable",
  props: {
    id: null,
    modelValue: null,
    columns: null,
    rows: { default: () => [] },
    config: { default: () => new Object() },
    tableid: null
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e;
    let o = n.modelValue ? n.modelValue : n.rows, r = new vc(n.id, n.columns, o, n.config);
    nt(r.id, r), ee(
      () => r.rows,
      (a, i) => {
        t("update:modelValue", a);
      },
      { deep: !0 }
    );
    const s = (a) => {
      var i;
      (i = r.modal.parent) != null && i.contains(a.target) || r.modal.visible && (r.modal.visible = !1);
    };
    return window.addEventListener("click", s), window.addEventListener("keydown", (a) => {
      if (a.key === "Escape" && r.modal.visible) {
        r.modal.visible = !1;
        const i = r.modal.parent;
        i && De().then(() => {
          const c = i.dataset.rowindex, u = i.dataset.colindex, l = document.querySelectorAll(`[data-rowindex='${c}'][data-colindex='${u}']`);
          l && l[0].focus();
        });
      }
    }), (a, i) => ($(), T("table", {
      class: "atable",
      style: ce({ width: b(r).config.fullWidth ? "100%" : "auto" })
    }, [
      ge(a.$slots, "header", { data: b(r) }, () => [
        at(bc, {
          columns: b(r).columns,
          config: b(r).config,
          tableid: b(r).id
        }, null, 8, ["columns", "config", "tableid"])
      ], !0),
      D("tbody", null, [
        ge(a.$slots, "body", { data: b(r) }, () => [
          ($(!0), T(Ie, null, Pe(b(r).rows, (c, u) => ($(), Se(dc, {
            key: c.id || b(Rr)(),
            row: c,
            rowIndex: u,
            tableid: b(r).id
          }, {
            default: it(() => [
              ($(!0), T(Ie, null, Pe(b(r).columns, (l, d) => ($(), Se(ic, {
                key: `${d}:${u}`,
                tableid: b(r).id,
                col: l,
                spellcheck: "false",
                rowIndex: u,
                colIndex: d + (b(r).zeroColumn ? 0 : -1),
                component: l.cellComponent,
                style: ce({
                  textAlign: (l == null ? void 0 : l.align) || "center",
                  minWidth: (l == null ? void 0 : l.width) || "40ch",
                  width: b(r).config.fullWidth ? "auto" : null
                })
              }, null, 8, ["tableid", "col", "rowIndex", "colIndex", "component", "style"]))), 128))
            ]),
            _: 2
          }, 1032, ["row", "rowIndex", "tableid"]))), 128))
        ], !0)
      ]),
      ge(a.$slots, "footer", { data: b(r) }, void 0, !0),
      ge(a.$slots, "modal", { data: b(r) }, () => [
        dt(at(Oc, {
          colIndex: b(r).modal.colIndex,
          rowIndex: b(r).modal.rowIndex,
          tableid: b(r).id,
          style: ce({
            left: b(r).modal.left + "px",
            top: b(r).modal.top + "px",
            maxWidth: b(r).modal.width + "px"
          })
        }, {
          default: it(() => [
            ($(), Se(Ft(b(r).modal.component), Qt({
              key: `${b(r).modal.rowIndex}:${b(r).modal.colIndex}`,
              colIndex: b(r).modal.colIndex,
              rowIndex: b(r).modal.rowIndex,
              tableid: b(r).id
            }, b(r).modal.componentProps), null, 16, ["colIndex", "rowIndex", "tableid"]))
          ]),
          _: 1
        }, 8, ["colIndex", "rowIndex", "tableid", "style"]), [
          [Ht, b(r).modal.visible]
        ])
      ], !0)
    ], 4));
  }
}), kc = /* @__PURE__ */ qe(Sc, [["__scopeId", "data-v-9137b4c3"]]), Ic = /* @__PURE__ */ K({
  __name: "Records",
  setup(e) {
    const { stonecrop: t, isReady: n } = zo(), o = { view: "list" };
    return (r, s) => b(n) ? ($(), Se(b(kc), {
      key: 0,
      columns: b(t).schema.schema.toArray(),
      rows: b(t).store.records,
      config: o
    }, null, 8, ["columns", "rows"])) : Oe("", !0);
  }
}), Ar = (e) => (Eo("data-v-18bfde6e"), e = e(), Oo(), e), Pc = { class: "tabs" }, $c = ["onKeydown"], xc = { tabindex: "0" }, Nc = ["onKeydown"], Cc = {
  version: "1.1",
  id: "Capa_1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  x: "0px",
  y: "0px",
  viewBox: "0 0 424.098 424.098",
  style: { "enable-background": "new 0 0 424.098 424.098" },
  "xml:space": "preserve"
}, Rc = /* @__PURE__ */ Ar(() => /* @__PURE__ */ D("g", null, [
  /* @__PURE__ */ D("path", {
    style: { fill: "#010002" },
    d: `M351.191,401.923H72.901c-4.487,0-8.129-3.633-8.129-8.129V242.262l-56.664-0.114
								c-3.284-0.008-6.243-1.992-7.495-5.023c-1.252-3.04-0.553-6.527,1.764-8.852L206.104,24.546c1.853-1.845,4.503-2.666,7.047-2.276
								c2.414,0.39,4.511,1.845,5.731,3.942l47.43,47.43V58.499c0-4.487,3.633-8.129,8.129-8.129h47.755c4.495,0,8.129,3.642,8.129,8.129
								v79.156l91.39,91.398c2.325,2.325,3.024,5.828,1.764,8.868c-1.26,3.032-4.227,5.007-7.511,5.007c-0.008,0-0.008,0-0.016,0
								l-56.64-0.114v150.98C359.32,398.29,355.686,401.923,351.191,401.923z M81.03,385.666h262.033V234.67
								c0-2.162,0.854-4.235,2.39-5.755c1.528-1.52,3.585-2.374,5.739-2.374c0.008,0,0.008,0,0.016,0l45.105,0.089l-79.855-79.863
								c-1.528-1.528-2.382-3.593-2.382-5.747V66.628h-31.498v26.645c0,3.284-1.975,6.251-5.015,7.511
								c-3.032,1.268-6.527,0.569-8.86-1.764l-57.038-57.038l-183.95,183.95l45.203,0.089c4.487,0.008,8.112,3.642,8.112,8.129
								C81.03,234.149,81.03,385.666,81.03,385.666z`
  })
], -1)), Ac = [
  Rc
], Tc = ["onKeydown"], Dc = { tabindex: "0" }, Vc = { style: { width: "11pt" } }, Lc = /* @__PURE__ */ Ar(() => /* @__PURE__ */ D("g", { transform: "matrix(-0.08088215,0,0,0.08088215,9.8016177,3.1263021e-6)" }, [
  /* @__PURE__ */ D("path", {
    d: "M 93.148438,80.832031 C 109.5,57.742188 104.03125,25.769531 80.941406,9.421875 57.851562,-6.925781 25.878906,-1.460938 9.53125,21.632812 -6.816406,44.722656 -1.351562,76.691406 21.742188,93.039062 38.222656,104.70703 60.011719,105.60547 77.394531,95.339844 l 37.769529,37.542966 c 4.07813,4.29297 10.86328,4.46485 15.15625,0.38672 4.29297,-4.07422 4.46485,-10.85937 0.39063,-15.15234 -0.12891,-0.13672 -0.25391,-0.26172 -0.39063,-0.39063 z m -41.839844,3.5 C 33.0625,84.335938 18.269531,69.554688 18.257812,51.308594 18.253906,33.0625 33.035156,18.269531 51.285156,18.261719 c 18.222656,-0.0078 33.007813,14.75 33.042969,32.972656 0.03125,18.25 -14.742187,33.066406 -32.996094,33.097656 -0.0078,0 -0.01172,0 -0.02344,0 z m 0,0",
    style: { fill: "#000000", "fill-opacity": "1", "fill-rule": "nonzero", stroke: "none" },
    id: "path2"
  })
], -1)), Mc = [
  Lc
], jc = /* @__PURE__ */ K({
  __name: "SheetNav",
  props: {
    breadcrumbs: null
  },
  setup(e) {
    const t = e, n = N([]), o = N(!0), r = N(!1), s = N(""), a = N(null), i = j(() => o.value ? "unrotated" : "rotated");
    ut(() => {
      n.value = t.breadcrumbs || [];
    });
    const c = () => {
      o.value = !o.value;
    }, u = async () => {
      r.value = !r.value, await De(() => {
        a.value.focus();
      });
    }, l = (p) => {
      p.preventDefault(), p.stopPropagation();
    }, d = async (p) => {
      p.preventDefault(), p.stopPropagation(), await u();
    }, f = () => {
    };
    return (p, m) => {
      const v = jr("router-link");
      return $(), T("footer", null, [
        D("ul", Pc, [
          D("li", {
            class: "hidebreadcrumbs",
            onClick: c,
            onKeydown: Ye(c, ["enter"])
          }, [
            D("a", xc, [
              D("div", {
                class: bo(b(i))
              }, "×", 2)
            ])
          ], 40, $c),
          D("li", {
            class: "hometab",
            onClick: f,
            onKeydown: Ye(f, ["enter"]),
            style: ce({ display: o.value ? "block" : "none" })
          }, [
            at(v, {
              to: "/home",
              tabindex: "0"
            }, {
              default: it(() => [
                ($(), T("svg", Cc, Ac))
              ]),
              _: 1
            })
          ], 44, Nc),
          D("li", {
            class: "searchtab",
            onClick: u,
            onKeydown: Ye(u, ["enter"]),
            style: ce({ display: o.value ? "block" : "none" })
          }, [
            D("a", Dc, [
              D("span", {
                style: ce({ display: r.value ? "none" : "block" })
              }, [
                ($(), T("svg", Vc, Mc))
              ], 4),
              dt(D("input", {
                "onUpdate:modelValue": m[0] || (m[0] = (g) => s.value = g),
                ref_key: "searchinput",
                ref: a,
                style: ce({ display: r.value ? "block" : "none" }),
                onClick: m[1] || (m[1] = (g) => l(g)),
                onInput: m[2] || (m[2] = (g) => l(g)),
                onBlur: m[3] || (m[3] = (g) => d(g)),
                onKeydown: m[4] || (m[4] = Ye((g) => d(g), ["enter"])),
                type: "text"
              }, null, 36), [
                [Br, s.value]
              ])
            ])
          ], 44, Tc),
          ($(!0), T(Ie, null, Pe(n.value, (g, k) => ($(), T("li", {
            key: k,
            style: ce({ display: o.value ? "block" : "none" })
          }, [
            at(v, {
              tabindex: "0",
              to: g.to
            }, {
              default: it(() => [
                Po(ue(g.title), 1)
              ]),
              _: 2
            }, 1032, ["to"])
          ], 4))), 128))
        ])
      ]);
    };
  }
});
const Bc = /* @__PURE__ */ qt(jc, [["__scopeId", "data-v-18bfde6e"]]), Qc = {
  install: (e) => {
    e.component("ActionSet", ts), e.component("CommandPalette", rs), e.component("Doctype", Fl), e.component("Records", Ic), e.component("SheetNav", Bc);
  }
};
export {
  ts as ActionSet,
  rs as CommandPalette,
  Fl as Doctype,
  Ic as Records,
  Bc as SheetNav,
  Qc as StonecropDesktop
};
//# sourceMappingURL=desktop.js.map
