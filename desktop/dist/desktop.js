import { defineComponent as J, ref as V, onMounted as Ft, openBlock as $, createElementBlock as A, normalizeClass as lo, createElementVNode as T, Fragment as Ie, renderList as Pe, toDisplayString as ce, createCommentVNode as Se, withDirectives as ct, vShow as Gt, pushScopeId as co, popScopeId as uo, inject as K, computed as j, createBlock as ke, resolveDynamicComponent as Wt, mergeProps as Qt, unref as b, onBeforeMount as _r, shallowRef as wr, effectScope as fo, markRaw as ae, reactive as ge, toRaw as ut, getCurrentInstance as zt, watch as de, nextTick as Fe, isRef as Ge, isReactive as Kt, toRef as _t, h as po, provide as tt, getCurrentScope as ho, onScopeDispose as mo, watchEffect as br, toRefs as hn, normalizeStyle as le, renderSlot as ve, createVNode as at, withCtx as it, useCssVars as go, createTextVNode as vo, onBeforeUnmount as Er, resolveComponent as Sr, withKeys as Je, vModelText as kr } from "vue";
const qt = (e) => (co("data-v-b7fdfbec"), e = e(), uo(), e), Or = { class: "action-menu-icon" }, Ir = /* @__PURE__ */ qt(() => /* @__PURE__ */ T("svg", {
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
  /* @__PURE__ */ T("polygon", { points: "54.2,33.4 29.2,58.8 25,54.6 50,29.2 " })
], -1)), Pr = /* @__PURE__ */ qt(() => /* @__PURE__ */ T("svg", {
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
  /* @__PURE__ */ T("polygon", { points: "70.8,58.8 45.8,33.4 50,29.2 75,54.6 " })
], -1)), $r = [
  Ir,
  Pr
], xr = /* @__PURE__ */ qt(() => /* @__PURE__ */ T("div", { style: { "margin-right": "30px" } }, null, -1)), Nr = ["onclick"], Cr = { key: 1 }, Rr = ["onClick"], Ar = { class: "dropdown-container" }, Tr = { class: "dropdown" }, Dr = ["onclick"], Vr = ["href"], Mr = { class: "dropdown-item" }, Lr = /* @__PURE__ */ J({
  __name: "ActionSet",
  props: {
    elements: null
  },
  setup(e) {
    const t = e, n = V([]), o = V(!1), r = V(null), s = V(!1), a = V(!1);
    Ft(() => {
      n.value = t.elements, i();
    });
    const i = () => {
      for (let d of n.value)
        d.elementType === "dropdown" && (d.show = !1);
    }, l = () => {
      s.value = !0, r.value = setTimeout(() => {
        s.value && (o.value = !0);
      }, 500);
    }, c = () => {
      s.value = !1, a.value = !1, clearTimeout(r.value), o.value = !1;
    }, u = (d) => {
      const f = !n.value[d].show;
      i(), n.value[d].show = f;
    };
    return (d, f) => ($(), A("div", {
      class: lo([{ "open-set": o.value, "hovered-and-closed": a.value }, "action-set collapse"]),
      onMouseover: l,
      onMouseleave: c
    }, [
      T("div", Or, [
        T("div", {
          id: "chevron",
          onClick: f[0] || (f[0] = (p) => a.value = !a.value)
        }, $r)
      ]),
      xr,
      ($(!0), A(Ie, null, Pe(n.value, (p, m) => ($(), A("div", {
        class: "action-element",
        key: m
      }, [
        p.elementType == "button" ? ($(), A("button", {
          key: 0,
          onclick: p.action,
          class: "button-default"
        }, ce(p.label), 9, Nr)) : Se("", !0),
        p.elementType == "dropdown" ? ($(), A("div", Cr, [
          T("button", {
            class: "button-default",
            onClick: (g) => u(m)
          }, ce(p.label), 9, Rr),
          ct(T("div", Ar, [
            T("div", Tr, [
              ($(!0), A(Ie, null, Pe(p.actions, (g) => ($(), A("div", {
                key: g.label
              }, [
                g.action != null ? ($(), A("button", {
                  key: 0,
                  onclick: g.action,
                  class: "dropdown-item"
                }, ce(g.label), 9, Dr)) : g.link != null ? ($(), A("a", {
                  key: 1,
                  href: g.link
                }, [
                  T("button", Mr, ce(g.label), 1)
                ], 8, Vr)) : Se("", !0)
              ]))), 128))
            ])
          ], 512), [
            [Gt, p.show]
          ])
        ])) : Se("", !0)
      ]))), 128))
    ], 34));
  }
});
const Jt = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, jr = /* @__PURE__ */ Jt(Lr, [["__scopeId", "data-v-b7fdfbec"]]), Br = {};
function Ur(e, t) {
  return $(), A("dialog");
}
const Hr = /* @__PURE__ */ Jt(Br, [["render", Ur]]), Fr = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
};
var mn;
const Gr = typeof window < "u";
Gr && (mn = window == null ? void 0 : window.navigator) != null && mn.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function Wr(e) {
  return e;
}
const Pt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, $t = "__vueuse_ssr_handlers__";
Pt[$t] = Pt[$t] || {};
Pt[$t];
var gn;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(gn || (gn = {}));
var Qr = Object.defineProperty, vn = Object.getOwnPropertySymbols, zr = Object.prototype.hasOwnProperty, Kr = Object.prototype.propertyIsEnumerable, yn = (e, t, n) => t in e ? Qr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, qr = (e, t) => {
  for (var n in t || (t = {}))
    zr.call(t, n) && yn(e, n, t[n]);
  if (vn)
    for (var n of vn(t))
      Kr.call(t, n) && yn(e, n, t[n]);
  return e;
};
const Jr = {
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
qr({
  linear: Wr
}, Jr);
const Yr = /* @__PURE__ */ J({
  __name: "AForm",
  props: {
    modelValue: null,
    data: null,
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = V(n.data || {}), r = (a) => {
      let i = {};
      for (const [l, c] of Object.entries(a))
        ["component", "fieldtype"].includes(l) || (i[l] = c), l === "rows" && c && c.length === 0 && (i.rows = o.value[a.fieldname]);
      return i;
    }, s = j({
      get: () => n.modelValue.map((a, i) => j({
        get() {
          return a.value;
        },
        set: (l) => {
          n.modelValue[i].value = l, t("update:modelValue", n.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (a, i) => ($(), A("form", null, [
      ($(!0), A(Ie, null, Pe(e.modelValue, (l, c) => ($(), ke(Wt(l.component), Qt({
        key: c,
        schema: l,
        modelValue: b(s)[c].value,
        "onUpdate:modelValue": (u) => b(s)[c].value = u,
        data: o.value[l.fieldname],
        readonly: e.readonly
      }, r(l)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
}), Xr = /* @__PURE__ */ Fr(Yr, [["__scopeId", "data-v-74d66cf2"]]), _n = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function Zr(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function es(e) {
  var t;
  let n = e.value;
  if (n) {
    const o = Zr(n);
    if (o) {
      const r = e.instance.locale;
      n = o(r);
    }
  } else {
    const o = (t = e.instance.schema.fieldtype) == null ? void 0 : t.toLowerCase();
    o && _n[o] && (n = _n[o]);
  }
  return n;
}
function ts(e, t) {
  t || (t = "#");
  let n = e;
  const o = [t, "/", "-", "(", ")", " "];
  for (const r of o)
    n = n.replaceAll(r, "");
  return n;
}
function ns(e, t, n) {
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
function os(e, t) {
  const n = es(t);
  if (!n)
    return;
  const o = "#", r = e.value, s = ts(r, o);
  if (s) {
    const a = ns(s, n, o);
    t.instance.maskFilled && (t.instance.maskFilled = !a.includes(o)), e.value = a;
  } else
    e.value = n;
}
J({
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
    const n = V(!1), o = K("locale", "");
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
    mask: os
  }
});
let rs = class nt {
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
    if (this.name = "Stonecrop", nt._root)
      return nt._root;
    nt._root = this, this.registry = t, this.store = n, this.schema = o, this.workflow = r, this.actions = s;
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
};
function yo(e) {
  e || (e = K("$registry"));
  const t = K("$store"), n = V(new rs(e, t)), o = V(!1);
  return _r(async () => {
    var r, s;
    const a = e.router.currentRoute.value, i = (r = a.params.records) == null ? void 0 : r.toString().toLowerCase(), l = (s = a.params.record) == null ? void 0 : s.toString().toLowerCase();
    if (!i && !l)
      return;
    const c = await e.doctypeLoader(i);
    e.addDoctype(c), n.value.setup(c), i && (l ? await n.value.getRecord(c, l) : await n.value.getRecords(c)), n.value.runAction(c, "LOAD", l ? [l] : void 0), o.value = !0;
  }), { stonecrop: n, isReady: o };
}
function ss() {
  return _o().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function _o() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const as = typeof Proxy == "function", is = "devtools-plugin:setup", ls = "plugin:settings:set";
let xe, xt;
function cs() {
  var e;
  return xe !== void 0 || (typeof window < "u" && window.performance ? (xe = !0, xt = window.performance) : typeof global < "u" && (!((e = global.perf_hooks) === null || e === void 0) && e.performance) ? (xe = !0, xt = global.perf_hooks.performance) : xe = !1), xe;
}
function us() {
  return cs() ? xt.now() : Date.now();
}
let ds = class {
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
        return us();
      }
    }, n && n.on(ls, (a, i) => {
      a === this.plugin.id && this.fallbacks.setSettings(i);
    }), this.proxiedOn = new Proxy({}, {
      get: (a, i) => this.target ? this.target.on[i] : (...l) => {
        this.onQueue.push({
          method: i,
          args: l
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (a, i) => this.target ? this.target[i] : i === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(i) ? (...l) => (this.targetQueue.push({
        method: i,
        args: l,
        resolve: () => {
        }
      }), this.fallbacks[i](...l)) : (...l) => new Promise((c) => {
        this.targetQueue.push({
          method: i,
          args: l,
          resolve: c
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
function fs(e, t) {
  const n = e, o = _o(), r = ss(), s = as && n.enableEarlyProxy;
  if (r && (o.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !s))
    r.emit(is, e, t);
  else {
    const a = s ? new ds(n, r) : null;
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
const ie = typeof window < "u";
function ps(e) {
  return e.__esModule || e[Symbol.toStringTag] === "Module";
}
const R = Object.assign;
function wt(e, t) {
  const n = {};
  for (const o in t) {
    const r = t[o];
    n[o] = q(r) ? r.map(e) : e(r);
  }
  return n;
}
const Be = () => {
}, q = Array.isArray;
function N(e) {
  const t = Array.from(arguments).slice(1);
  console.warn.apply(console, ["[Vue Router warn]: " + e].concat(t));
}
const hs = /\/$/, ms = (e) => e.replace(hs, "");
function bt(e, t, n = "/") {
  let o, r = {}, s = "", a = "";
  const i = t.indexOf("#");
  let l = t.indexOf("?");
  return i < l && i >= 0 && (l = -1), l > -1 && (o = t.slice(0, l), s = t.slice(l + 1, i > -1 ? i : t.length), r = e(s)), i > -1 && (o = o || t.slice(0, i), a = t.slice(i, t.length)), o = ys(o ?? t, n), {
    fullPath: o + (s && "?") + s + a,
    path: o,
    query: r,
    hash: a
  };
}
function gs(e, t) {
  const n = t.query ? e(t.query) : "";
  return t.path + (n && "?") + n + (t.hash || "");
}
function wn(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || "/";
}
function bn(e, t, n) {
  const o = t.matched.length - 1, r = n.matched.length - 1;
  return o > -1 && o === r && ye(t.matched[o], n.matched[r]) && wo(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function ye(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t);
}
function wo(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (!vs(e[n], t[n]))
      return !1;
  return !0;
}
function vs(e, t) {
  return q(e) ? En(e, t) : q(t) ? En(t, e) : e === t;
}
function En(e, t) {
  return q(t) ? e.length === t.length && e.every((n, o) => n === t[o]) : e.length === 1 && e[0] === t;
}
function ys(e, t) {
  if (e.startsWith("/"))
    return e;
  if (process.env.NODE_ENV !== "production" && !t.startsWith("/"))
    return N(`Cannot resolve a relative location without an absolute path. Trying to resolve "${e}" from "${t}". It should look like "/${t}".`), e;
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
var We;
(function(e) {
  e.pop = "pop", e.push = "push";
})(We || (We = {}));
var Ue;
(function(e) {
  e.back = "back", e.forward = "forward", e.unknown = "";
})(Ue || (Ue = {}));
function _s(e) {
  if (!e)
    if (ie) {
      const t = document.querySelector("base");
      e = t && t.getAttribute("href") || "/", e = e.replace(/^\w+:\/\/[^\/]+/, "");
    } else
      e = "/";
  return e[0] !== "/" && e[0] !== "#" && (e = "/" + e), ms(e);
}
const ws = /^[^#]+#/;
function bs(e, t) {
  return e.replace(ws, "#") + t;
}
function Es(e, t) {
  const n = document.documentElement.getBoundingClientRect(), o = e.getBoundingClientRect();
  return {
    behavior: t.behavior,
    left: o.left - n.left - (t.left || 0),
    top: o.top - n.top - (t.top || 0)
  };
}
const dt = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function Ss(e) {
  let t;
  if ("el" in e) {
    const n = e.el, o = typeof n == "string" && n.startsWith("#");
    if (process.env.NODE_ENV !== "production" && typeof e.el == "string" && (!o || !document.getElementById(e.el.slice(1))))
      try {
        const s = document.querySelector(e.el);
        if (o && s) {
          N(`The selector "${e.el}" should be passed as "el: document.querySelector('${e.el}')" because it starts with "#".`);
          return;
        }
      } catch {
        N(`The selector "${e.el}" is invalid. If you are using an id selector, make sure to escape it. You can find more information about escaping characters in selectors at https://mathiasbynens.be/notes/css-escapes or use CSS.escape (https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape).`);
        return;
      }
    const r = typeof n == "string" ? o ? document.getElementById(n.slice(1)) : document.querySelector(n) : n;
    if (!r) {
      process.env.NODE_ENV !== "production" && N(`Couldn't find element using selector "${e.el}" returned by scrollBehavior.`);
      return;
    }
    t = Es(r, e);
  } else
    t = e;
  "scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left != null ? t.left : window.pageXOffset, t.top != null ? t.top : window.pageYOffset);
}
function Sn(e, t) {
  return (history.state ? history.state.position - t : -1) + e;
}
const Nt = /* @__PURE__ */ new Map();
function ks(e, t) {
  Nt.set(e, t);
}
function Os(e) {
  const t = Nt.get(e);
  return Nt.delete(e), t;
}
let Is = () => location.protocol + "//" + location.host;
function bo(e, t) {
  const { pathname: n, search: o, hash: r } = t, s = e.indexOf("#");
  if (s > -1) {
    let i = r.includes(e.slice(s)) ? e.slice(s).length : 1, l = r.slice(i);
    return l[0] !== "/" && (l = "/" + l), wn(l, "");
  }
  return wn(n, e) + o + r;
}
function Ps(e, t, n, o) {
  let r = [], s = [], a = null;
  const i = ({ state: f }) => {
    const p = bo(e, location), m = n.value, g = t.value;
    let y = 0;
    if (f) {
      if (n.value = p, t.value = f, a && a === m) {
        a = null;
        return;
      }
      y = g ? f.position - g.position : 0;
    } else
      o(p);
    r.forEach((O) => {
      O(n.value, m, {
        delta: y,
        type: We.pop,
        direction: y ? y > 0 ? Ue.forward : Ue.back : Ue.unknown
      });
    });
  };
  function l() {
    a = n.value;
  }
  function c(f) {
    r.push(f);
    const p = () => {
      const m = r.indexOf(f);
      m > -1 && r.splice(m, 1);
    };
    return s.push(p), p;
  }
  function u() {
    const { history: f } = window;
    f.state && f.replaceState(R({}, f.state, { scroll: dt() }), "");
  }
  function d() {
    for (const f of s)
      f();
    s = [], window.removeEventListener("popstate", i), window.removeEventListener("beforeunload", u);
  }
  return window.addEventListener("popstate", i), window.addEventListener("beforeunload", u), {
    pauseListeners: l,
    listen: c,
    destroy: d
  };
}
function kn(e, t, n, o = !1, r = !1) {
  return {
    back: e,
    current: t,
    forward: n,
    replaced: o,
    position: window.history.length,
    scroll: r ? dt() : null
  };
}
function $s(e) {
  const { history: t, location: n } = window, o = {
    value: bo(e, n)
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
  function s(l, c, u) {
    const d = e.indexOf("#"), f = d > -1 ? (n.host && document.querySelector("base") ? e : e.slice(d)) + l : Is() + e + l;
    try {
      t[u ? "replaceState" : "pushState"](c, "", f), r.value = c;
    } catch (p) {
      process.env.NODE_ENV !== "production" ? N("Error with push/replace State", p) : console.error(p), n[u ? "replace" : "assign"](f);
    }
  }
  function a(l, c) {
    const u = R({}, t.state, kn(
      r.value.back,
      // keep back and forward entries but override current position
      l,
      r.value.forward,
      !0
    ), c, { position: r.value.position });
    s(l, u, !0), o.value = l;
  }
  function i(l, c) {
    const u = R(
      {},
      // use current history state to gracefully handle a wrong call to
      // history.replaceState
      // https://github.com/vuejs/router/issues/366
      r.value,
      t.state,
      {
        forward: l,
        scroll: dt()
      }
    );
    process.env.NODE_ENV !== "production" && !t.state && N(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:

history.replaceState(history.state, '', url)

You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`), s(u.current, u, !0);
    const d = R({}, kn(o.value, l, null), { position: u.position + 1 }, c);
    s(l, d, !1), o.value = l;
  }
  return {
    location: o,
    state: r,
    push: i,
    replace: a
  };
}
function xs(e) {
  e = _s(e);
  const t = $s(e), n = Ps(e, t.state, t.location, t.replace);
  function o(s, a = !0) {
    a || n.pauseListeners(), history.go(s);
  }
  const r = R({
    // it's overridden right after
    location: "",
    base: e,
    go: o,
    createHref: bs.bind(null, e)
  }, t, n);
  return Object.defineProperty(r, "location", {
    enumerable: !0,
    get: () => t.location.value
  }), Object.defineProperty(r, "state", {
    enumerable: !0,
    get: () => t.state.value
  }), r;
}
function Ns(e) {
  return typeof e == "string" || e && typeof e == "object";
}
function Eo(e) {
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
}, Ct = Symbol(process.env.NODE_ENV !== "production" ? "navigation failure" : "");
var On;
(function(e) {
  e[e.aborted = 4] = "aborted", e[e.cancelled = 8] = "cancelled", e[e.duplicated = 16] = "duplicated";
})(On || (On = {}));
const Cs = {
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
    return `Redirected from "${e.fullPath}" to "${As(t)}" via a navigation guard.`;
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
function De(e, t) {
  return process.env.NODE_ENV !== "production" ? R(new Error(Cs[e](t)), {
    type: e,
    [Ct]: !0
  }, t) : R(new Error(), {
    type: e,
    [Ct]: !0
  }, t);
}
function re(e, t) {
  return e instanceof Error && Ct in e && (t == null || !!(e.type & t));
}
const Rs = ["params", "query", "hash"];
function As(e) {
  if (typeof e == "string")
    return e;
  if ("path" in e)
    return e.path;
  const t = {};
  for (const n of Rs)
    n in e && (t[n] = e[n]);
  return JSON.stringify(t, null, 2);
}
const In = "[^/]+?", Ts = {
  sensitive: !1,
  strict: !1,
  start: !0,
  end: !0
}, Ds = /[.+*?^${}()[\]/\\]/g;
function Vs(e, t) {
  const n = R({}, Ts, t), o = [];
  let r = n.start ? "^" : "";
  const s = [];
  for (const c of e) {
    const u = c.length ? [] : [
      90
      /* PathScore.Root */
    ];
    n.strict && !c.length && (r += "/");
    for (let d = 0; d < c.length; d++) {
      const f = c[d];
      let p = 40 + (n.sensitive ? 0.25 : 0);
      if (f.type === 0)
        d || (r += "/"), r += f.value.replace(Ds, "\\$&"), p += 40;
      else if (f.type === 1) {
        const { value: m, repeatable: g, optional: y, regexp: O } = f;
        s.push({
          name: m,
          repeatable: g,
          optional: y
        });
        const I = O || In;
        if (I !== In) {
          p += 10;
          try {
            new RegExp(`(${I})`);
          } catch (F) {
            throw new Error(`Invalid custom RegExp for param "${m}" (${I}): ` + F.message);
          }
        }
        let M = g ? `((?:${I})(?:/(?:${I}))*)` : `(${I})`;
        d || (M = // avoid an optional / if there are more segments e.g. /:p?-static
        // or /:p?-:p2
        y && c.length < 2 ? `(?:/${M})` : "/" + M), y && (M += "?"), r += M, p += 20, y && (p += -8), g && (p += -20), I === ".*" && (p += -50);
      }
      u.push(p);
    }
    o.push(u);
  }
  if (n.strict && n.end) {
    const c = o.length - 1;
    o[c][o[c].length - 1] += 0.7000000000000001;
  }
  n.strict || (r += "/?"), n.end ? r += "$" : n.strict && (r += "(?:/|$)");
  const a = new RegExp(r, n.sensitive ? "" : "i");
  function i(c) {
    const u = c.match(a), d = {};
    if (!u)
      return null;
    for (let f = 1; f < u.length; f++) {
      const p = u[f] || "", m = s[f - 1];
      d[m.name] = p && m.repeatable ? p.split("/") : p;
    }
    return d;
  }
  function l(c) {
    let u = "", d = !1;
    for (const f of e) {
      (!d || !u.endsWith("/")) && (u += "/"), d = !1;
      for (const p of f)
        if (p.type === 0)
          u += p.value;
        else if (p.type === 1) {
          const { value: m, repeatable: g, optional: y } = p, O = m in c ? c[m] : "";
          if (q(O) && !g)
            throw new Error(`Provided param "${m}" is an array but it is not repeatable (* or + modifiers)`);
          const I = q(O) ? O.join("/") : O;
          if (!I)
            if (y)
              f.length < 2 && (u.endsWith("/") ? u = u.slice(0, -1) : d = !0);
            else
              throw new Error(`Missing required param "${m}"`);
          u += I;
        }
    }
    return u || "/";
  }
  return {
    re: a,
    score: o,
    keys: s,
    parse: i,
    stringify: l
  };
}
function Ms(e, t) {
  let n = 0;
  for (; n < e.length && n < t.length; ) {
    const o = t[n] - e[n];
    if (o)
      return o;
    n++;
  }
  return e.length < t.length ? e.length === 1 && e[0] === 40 + 40 ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === 40 + 40 ? 1 : -1 : 0;
}
function Ls(e, t) {
  let n = 0;
  const o = e.score, r = t.score;
  for (; n < o.length && n < r.length; ) {
    const s = Ms(o[n], r[n]);
    if (s)
      return s;
    n++;
  }
  if (Math.abs(r.length - o.length) === 1) {
    if (Pn(o))
      return 1;
    if (Pn(r))
      return -1;
  }
  return r.length - o.length;
}
function Pn(e) {
  const t = e[e.length - 1];
  return e.length > 0 && t[t.length - 1] < 0;
}
const js = {
  type: 0,
  value: ""
}, Bs = /[a-zA-Z0-9_]/;
function Us(e) {
  if (!e)
    return [[]];
  if (e === "/")
    return [[js]];
  if (!e.startsWith("/"))
    throw new Error(process.env.NODE_ENV !== "production" ? `Route paths should start with a "/": "${e}" should be "/${e}".` : `Invalid path "${e}"`);
  function t(p) {
    throw new Error(`ERR (${n})/"${c}": ${p}`);
  }
  let n = 0, o = n;
  const r = [];
  let s;
  function a() {
    s && r.push(s), s = [];
  }
  let i = 0, l, c = "", u = "";
  function d() {
    c && (n === 0 ? s.push({
      type: 0,
      value: c
    }) : n === 1 || n === 2 || n === 3 ? (s.length > 1 && (l === "*" || l === "+") && t(`A repeatable param (${c}) must be alone in its segment. eg: '/:ids+.`), s.push({
      type: 1,
      value: c,
      regexp: u,
      repeatable: l === "*" || l === "+",
      optional: l === "*" || l === "?"
    })) : t("Invalid state to consume buffer"), c = "");
  }
  function f() {
    c += l;
  }
  for (; i < e.length; ) {
    if (l = e[i++], l === "\\" && n !== 2) {
      o = n, n = 4;
      continue;
    }
    switch (n) {
      case 0:
        l === "/" ? (c && d(), a()) : l === ":" ? (d(), n = 1) : f();
        break;
      case 4:
        f(), n = o;
        break;
      case 1:
        l === "(" ? n = 2 : Bs.test(l) ? f() : (d(), n = 0, l !== "*" && l !== "?" && l !== "+" && i--);
        break;
      case 2:
        l === ")" ? u[u.length - 1] == "\\" ? u = u.slice(0, -1) + l : n = 3 : u += l;
        break;
      case 3:
        d(), n = 0, l !== "*" && l !== "?" && l !== "+" && i--, u = "";
        break;
      default:
        t("Unknown state");
        break;
    }
  }
  return n === 2 && t(`Unfinished custom RegExp for param "${c}"`), d(), a(), r;
}
function Hs(e, t, n) {
  const o = Vs(Us(e.path), n);
  if (process.env.NODE_ENV !== "production") {
    const s = /* @__PURE__ */ new Set();
    for (const a of o.keys)
      s.has(a.name) && N(`Found duplicated params with name "${a.name}" for path "${e.path}". Only the last one will be available on "$route.params".`), s.add(a.name);
  }
  const r = R(o, {
    record: e,
    parent: t,
    // these needs to be populated by the parent
    children: [],
    alias: []
  });
  return t && !r.record.aliasOf == !t.record.aliasOf && t.children.push(r), r;
}
function Fs(e, t) {
  const n = [], o = /* @__PURE__ */ new Map();
  t = Nn({ strict: !1, end: !0, sensitive: !1 }, t);
  function r(u) {
    return o.get(u);
  }
  function s(u, d, f) {
    const p = !f, m = Gs(u);
    process.env.NODE_ENV !== "production" && Ks(m, d), m.aliasOf = f && f.record;
    const g = Nn(t, u), y = [
      m
    ];
    if ("alias" in u) {
      const M = typeof u.alias == "string" ? [u.alias] : u.alias;
      for (const F of M)
        y.push(R({}, m, {
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
    let O, I;
    for (const M of y) {
      const { path: F } = M;
      if (d && F[0] !== "/") {
        const Y = d.record.path, X = Y[Y.length - 1] === "/" ? "" : "/";
        M.path = d.record.path + (F && X + F);
      }
      if (process.env.NODE_ENV !== "production" && M.path === "*")
        throw new Error(`Catch all routes ("*") must now be defined using a param with a custom regexp.
See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.`);
      if (O = Hs(M, d, g), process.env.NODE_ENV !== "production" && d && F[0] === "/" && qs(O, d), f ? (f.alias.push(O), process.env.NODE_ENV !== "production" && zs(f, O)) : (I = I || O, I !== O && I.alias.push(O), p && u.name && !xn(O) && a(u.name)), m.children) {
        const Y = m.children;
        for (let X = 0; X < Y.length; X++)
          s(Y[X], O, f && f.children[X]);
      }
      f = f || O, (O.record.components && Object.keys(O.record.components).length || O.record.name || O.record.redirect) && l(O);
    }
    return I ? () => {
      a(I);
    } : Be;
  }
  function a(u) {
    if (Eo(u)) {
      const d = o.get(u);
      d && (o.delete(u), n.splice(n.indexOf(d), 1), d.children.forEach(a), d.alias.forEach(a));
    } else {
      const d = n.indexOf(u);
      d > -1 && (n.splice(d, 1), u.record.name && o.delete(u.record.name), u.children.forEach(a), u.alias.forEach(a));
    }
  }
  function i() {
    return n;
  }
  function l(u) {
    let d = 0;
    for (; d < n.length && Ls(u, n[d]) >= 0 && // Adding children with empty path should still appear before the parent
    // https://github.com/vuejs/router/issues/1124
    (u.record.path !== n[d].record.path || !So(u, n[d])); )
      d++;
    n.splice(d, 0, u), u.record.name && !xn(u) && o.set(u.record.name, u);
  }
  function c(u, d) {
    let f, p = {}, m, g;
    if ("name" in u && u.name) {
      if (f = o.get(u.name), !f)
        throw De(1, {
          location: u
        });
      if (process.env.NODE_ENV !== "production") {
        const I = Object.keys(u.params || {}).filter((M) => !f.keys.find((F) => F.name === M));
        I.length && N(`Discarded invalid param(s) "${I.join('", "')}" when navigating. See https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22 for more details.`);
      }
      g = f.record.name, p = R(
        // paramsFromLocation is a new object
        $n(
          d.params,
          // only keep params that exist in the resolved location
          // TODO: only keep optional params coming from a parent record
          f.keys.filter((I) => !I.optional).map((I) => I.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        u.params && $n(u.params, f.keys.map((I) => I.name))
      ), m = f.stringify(p);
    } else if ("path" in u)
      m = u.path, process.env.NODE_ENV !== "production" && !m.startsWith("/") && N(`The Matcher cannot resolve relative paths but received "${m}". Unless you directly called \`matcher.resolve("${m}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`), f = n.find((I) => I.re.test(m)), f && (p = f.parse(m), g = f.record.name);
    else {
      if (f = d.name ? o.get(d.name) : n.find((I) => I.re.test(d.path)), !f)
        throw De(1, {
          location: u,
          currentLocation: d
        });
      g = f.record.name, p = R({}, d.params, u.params), m = f.stringify(p);
    }
    const y = [];
    let O = f;
    for (; O; )
      y.unshift(O.record), O = O.parent;
    return {
      name: g,
      path: m,
      params: p,
      matched: y,
      meta: Qs(y)
    };
  }
  return e.forEach((u) => s(u)), { addRoute: s, resolve: c, removeRoute: a, getRoutes: i, getRecordMatcher: r };
}
function $n(e, t) {
  const n = {};
  for (const o of t)
    o in e && (n[o] = e[o]);
  return n;
}
function Gs(e) {
  return {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: void 0,
    beforeEnter: e.beforeEnter,
    props: Ws(e),
    children: e.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in e ? e.components || null : e.component && { default: e.component }
  };
}
function Ws(e) {
  const t = {}, n = e.props || !1;
  if ("component" in e)
    t.default = n;
  else
    for (const o in e.components)
      t[o] = typeof n == "boolean" ? n : n[o];
  return t;
}
function xn(e) {
  for (; e; ) {
    if (e.record.aliasOf)
      return !0;
    e = e.parent;
  }
  return !1;
}
function Qs(e) {
  return e.reduce((t, n) => R(t, n.meta), {});
}
function Nn(e, t) {
  const n = {};
  for (const o in e)
    n[o] = o in t ? t[o] : e[o];
  return n;
}
function Rt(e, t) {
  return e.name === t.name && e.optional === t.optional && e.repeatable === t.repeatable;
}
function zs(e, t) {
  for (const n of e.keys)
    if (!n.optional && !t.keys.find(Rt.bind(null, n)))
      return N(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
  for (const n of t.keys)
    if (!n.optional && !e.keys.find(Rt.bind(null, n)))
      return N(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
}
function Ks(e, t) {
  t && t.record.name && !e.name && !e.path && N(`The route named "${String(t.record.name)}" has a child without a name and an empty path. Using that name won't render the empty path child so you probably want to move the name to the child instead. If this is intentional, add a name to the child route to remove the warning.`);
}
function qs(e, t) {
  for (const n of t.keys)
    if (!e.keys.find(Rt.bind(null, n)))
      return N(`Absolute path "${e.record.path}" must have the exact same param named "${n.name}" as its parent "${t.record.path}".`);
}
function So(e, t) {
  return t.children.some((n) => n === e || So(e, n));
}
const ko = /#/g, Js = /&/g, Ys = /\//g, Xs = /=/g, Zs = /\?/g, Oo = /\+/g, ea = /%5B/g, ta = /%5D/g, Io = /%5E/g, na = /%60/g, Po = /%7B/g, oa = /%7C/g, $o = /%7D/g, ra = /%20/g;
function Yt(e) {
  return encodeURI("" + e).replace(oa, "|").replace(ea, "[").replace(ta, "]");
}
function sa(e) {
  return Yt(e).replace(Po, "{").replace($o, "}").replace(Io, "^");
}
function At(e) {
  return Yt(e).replace(Oo, "%2B").replace(ra, "+").replace(ko, "%23").replace(Js, "%26").replace(na, "`").replace(Po, "{").replace($o, "}").replace(Io, "^");
}
function aa(e) {
  return At(e).replace(Xs, "%3D");
}
function ia(e) {
  return Yt(e).replace(ko, "%23").replace(Zs, "%3F");
}
function la(e) {
  return e == null ? "" : ia(e).replace(Ys, "%2F");
}
function Qe(e) {
  try {
    return decodeURIComponent("" + e);
  } catch {
    process.env.NODE_ENV !== "production" && N(`Error decoding "${e}". Using original value`);
  }
  return "" + e;
}
function ca(e) {
  const t = {};
  if (e === "" || e === "?")
    return t;
  const o = (e[0] === "?" ? e.slice(1) : e).split("&");
  for (let r = 0; r < o.length; ++r) {
    const s = o[r].replace(Oo, " "), a = s.indexOf("="), i = Qe(a < 0 ? s : s.slice(0, a)), l = a < 0 ? null : Qe(s.slice(a + 1));
    if (i in t) {
      let c = t[i];
      q(c) || (c = t[i] = [c]), c.push(l);
    } else
      t[i] = l;
  }
  return t;
}
function Cn(e) {
  let t = "";
  for (let n in e) {
    const o = e[n];
    if (n = aa(n), o == null) {
      o !== void 0 && (t += (t.length ? "&" : "") + n);
      continue;
    }
    (q(o) ? o.map((s) => s && At(s)) : [o && At(o)]).forEach((s) => {
      s !== void 0 && (t += (t.length ? "&" : "") + n, s != null && (t += "=" + s));
    });
  }
  return t;
}
function ua(e) {
  const t = {};
  for (const n in e) {
    const o = e[n];
    o !== void 0 && (t[n] = q(o) ? o.map((r) => r == null ? null : "" + r) : o == null ? o : "" + o);
  }
  return t;
}
const da = Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : ""), Rn = Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : ""), Xt = Symbol(process.env.NODE_ENV !== "production" ? "router" : ""), xo = Symbol(process.env.NODE_ENV !== "production" ? "route location" : ""), Tt = Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
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
    const l = (d) => {
      d === !1 ? i(De(4, {
        from: n,
        to: t
      })) : d instanceof Error ? i(d) : Ns(d) ? i(De(2, {
        from: t,
        to: d
      })) : (s && // since enterCallbackArray is truthy, both record and name also are
      o.enterCallbacks[r] === s && typeof d == "function" && s.push(d), a());
    }, c = e.call(o && o.instances[r], t, n, process.env.NODE_ENV !== "production" ? fa(l, t, n) : l);
    let u = Promise.resolve(c);
    if (e.length < 3 && (u = u.then(l)), process.env.NODE_ENV !== "production" && e.length > 2) {
      const d = `The "next" callback was never called inside of ${e.name ? '"' + e.name + '"' : ""}:
${e.toString()}
. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;
      if (typeof c == "object" && "then" in c)
        u = u.then((f) => l._called ? f : (N(d), Promise.reject(new Error("Invalid navigation guard"))));
      else if (c !== void 0 && !l._called) {
        N(d), i(new Error("Invalid navigation guard"));
        return;
      }
    }
    u.catch((d) => i(d));
  });
}
function fa(e, t, n) {
  let o = 0;
  return function() {
    o++ === 1 && N(`The "next" callback was called more than once in one navigation guard when going from "${n.fullPath}" to "${t.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`), e._called = !0, o === 1 && e.apply(null, arguments);
  };
}
function Et(e, t, n, o) {
  const r = [];
  for (const s of e) {
    process.env.NODE_ENV !== "production" && !s.components && !s.children.length && N(`Record with path "${s.path}" is either missing a "component(s)" or "children" property.`);
    for (const a in s.components) {
      let i = s.components[a];
      if (process.env.NODE_ENV !== "production") {
        if (!i || typeof i != "object" && typeof i != "function")
          throw N(`Component "${a}" in record with path "${s.path}" is not a valid component. Received "${String(i)}".`), new Error("Invalid route component");
        if ("then" in i) {
          N(`Component "${a}" in record with path "${s.path}" is a Promise instead of a function that returns a Promise. Did you write "import('./MyPage.vue')" instead of "() => import('./MyPage.vue')" ? This will break in production if not fixed.`);
          const l = i;
          i = () => l;
        } else
          i.__asyncLoader && // warn only once per component
          !i.__warnedDefineAsync && (i.__warnedDefineAsync = !0, N(`Component "${a}" in record with path "${s.path}" is defined using "defineAsyncComponent()". Write "() => import('./MyPage.vue')" instead of "defineAsyncComponent(() => import('./MyPage.vue'))".`));
      }
      if (!(t !== "beforeRouteEnter" && !s.instances[a]))
        if (pa(i)) {
          const c = (i.__vccOpts || i)[t];
          c && r.push(me(c, n, o, s, a));
        } else {
          let l = i();
          process.env.NODE_ENV !== "production" && !("catch" in l) && (N(`Component "${a}" in record with path "${s.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`), l = Promise.resolve(l)), r.push(() => l.then((c) => {
            if (!c)
              return Promise.reject(new Error(`Couldn't resolve component "${a}" at "${s.path}"`));
            const u = ps(c) ? c.default : c;
            s.components[a] = u;
            const f = (u.__vccOpts || u)[t];
            return f && me(f, n, o, s, a)();
          }));
        }
    }
  }
  return r;
}
function pa(e) {
  return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function An(e) {
  const t = K(Xt), n = K(xo), o = j(() => t.resolve(b(e.to))), r = j(() => {
    const { matched: l } = o.value, { length: c } = l, u = l[c - 1], d = n.matched;
    if (!u || !d.length)
      return -1;
    const f = d.findIndex(ye.bind(null, u));
    if (f > -1)
      return f;
    const p = Tn(l[c - 2]);
    return (
      // we are dealing with nested routes
      c > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      Tn(u) === p && // avoid comparing the child with its parent
      d[d.length - 1].path !== p ? d.findIndex(ye.bind(null, l[c - 2])) : f
    );
  }), s = j(() => r.value > -1 && va(n.params, o.value.params)), a = j(() => r.value > -1 && r.value === n.matched.length - 1 && wo(n.params, o.value.params));
  function i(l = {}) {
    return ga(l) ? t[b(e.replace) ? "replace" : "push"](
      b(e.to)
      // avoid uncaught errors are they are logged anyway
    ).catch(Be) : Promise.resolve();
  }
  if (process.env.NODE_ENV !== "production" && ie) {
    const l = zt();
    if (l) {
      const c = {
        route: o.value,
        isActive: s.value,
        isExactActive: a.value
      };
      l.__vrl_devtools = l.__vrl_devtools || [], l.__vrl_devtools.push(c), br(() => {
        c.route = o.value, c.isActive = s.value, c.isExactActive = a.value;
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
const ha = /* @__PURE__ */ J({
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
  useLink: An,
  setup(e, { slots: t }) {
    const n = ge(An(e)), { options: o } = K(Xt), r = j(() => ({
      [Dn(e.activeClass, o.linkActiveClass, "router-link-active")]: n.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [Dn(e.exactActiveClass, o.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
    }));
    return () => {
      const s = t.default && t.default(n);
      return e.custom ? s : po("a", {
        "aria-current": n.isExactActive ? e.ariaCurrentValue : null,
        href: n.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: n.navigate,
        class: r.value
      }, s);
    };
  }
}), ma = ha;
function ga(e) {
  if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(t))
        return;
    }
    return e.preventDefault && e.preventDefault(), !0;
  }
}
function va(e, t) {
  for (const n in t) {
    const o = t[n], r = e[n];
    if (typeof o == "string") {
      if (o !== r)
        return !1;
    } else if (!q(r) || r.length !== o.length || o.some((s, a) => s !== r[a]))
      return !1;
  }
  return !0;
}
function Tn(e) {
  return e ? e.aliasOf ? e.aliasOf.path : e.path : "";
}
const Dn = (e, t, n) => e ?? t ?? n, ya = /* @__PURE__ */ J({
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
    process.env.NODE_ENV !== "production" && wa();
    const o = K(Tt), r = j(() => e.route || o.value), s = K(Rn, 0), a = j(() => {
      let c = b(s);
      const { matched: u } = r.value;
      let d;
      for (; (d = u[c]) && !d.components; )
        c++;
      return c;
    }), i = j(() => r.value.matched[a.value]);
    tt(Rn, j(() => a.value + 1)), tt(da, i), tt(Tt, r);
    const l = V();
    return de(() => [l.value, i.value, e.name], ([c, u, d], [f, p, m]) => {
      u && (u.instances[d] = c, p && p !== u && c && c === f && (u.leaveGuards.size || (u.leaveGuards = p.leaveGuards), u.updateGuards.size || (u.updateGuards = p.updateGuards))), c && u && // if there is no instance but to and from are the same this might be
      // the first visit
      (!p || !ye(u, p) || !f) && (u.enterCallbacks[d] || []).forEach((g) => g(c));
    }, { flush: "post" }), () => {
      const c = r.value, u = e.name, d = i.value, f = d && d.components[u];
      if (!f)
        return Vn(n.default, { Component: f, route: c });
      const p = d.props[u], m = p ? p === !0 ? c.params : typeof p == "function" ? p(c) : p : null, y = po(f, R({}, m, t, {
        onVnodeUnmounted: (O) => {
          O.component.isUnmounted && (d.instances[u] = null);
        },
        ref: l
      }));
      if (process.env.NODE_ENV !== "production" && ie && y.ref) {
        const O = {
          depth: a.value,
          name: d.name,
          path: d.path,
          meta: d.meta
        };
        (q(y.ref) ? y.ref.map((M) => M.i) : [y.ref.i]).forEach((M) => {
          M.__vrv_devtools = O;
        });
      }
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        Vn(n.default, { Component: y, route: c }) || y
      );
    };
  }
});
function Vn(e, t) {
  if (!e)
    return null;
  const n = e(t);
  return n.length === 1 ? n[0] : n;
}
const _a = ya;
function wa() {
  const e = zt(), t = e.parent && e.parent.type.name;
  if (t && (t === "KeepAlive" || t.includes("Transition"))) {
    const n = t === "KeepAlive" ? "keep-alive" : "transition";
    N(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.
Use slot props instead:

<router-view v-slot="{ Component }">
  <${n}>
    <component :is="Component" />
  </${n}>
</router-view>`);
  }
}
function Le(e, t) {
  const n = R({}, e, {
    // remove variables that can contain vue instances
    matched: e.matched.map((o) => xa(o, ["instances", "children", "aliasOf"]))
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
function Ye(e) {
  return {
    _custom: {
      display: e
    }
  };
}
let ba = 0;
function Ea(e, t, n) {
  if (t.__hasDevtools)
    return;
  t.__hasDevtools = !0;
  const o = ba++;
  fs({
    id: "org.vuejs.router" + (o ? "." + o : ""),
    label: "Vue Router",
    packageName: "vue-router",
    homepage: "https://router.vuejs.org",
    logo: "https://router.vuejs.org/logo.png",
    componentStateTypes: ["Routing"],
    app: e
  }, (r) => {
    typeof r.now != "function" && console.warn("[Vue Router]: You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."), r.on.inspectComponent((u, d) => {
      u.instanceData && u.instanceData.state.push({
        type: "Routing",
        key: "$route",
        editable: !1,
        value: Le(t.currentRoute.value, "Current Route")
      });
    }), r.on.visitComponentTree(({ treeNode: u, componentInstance: d }) => {
      if (d.__vrv_devtools) {
        const f = d.__vrv_devtools;
        u.tags.push({
          label: (f.name ? `${f.name.toString()}: ` : "") + f.path,
          textColor: 0,
          tooltip: "This component is rendered by &lt;router-view&gt;",
          backgroundColor: No
        });
      }
      q(d.__vrl_devtools) && (d.__devtoolsApi = r, d.__vrl_devtools.forEach((f) => {
        let p = Ao, m = "";
        f.isExactActive ? (p = Ro, m = "This is exactly active") : f.isActive && (p = Co, m = "This link is active"), u.tags.push({
          label: f.route.path,
          textColor: 0,
          tooltip: m,
          backgroundColor: p
        });
      }));
    }), de(t.currentRoute, () => {
      l(), r.notifyComponentUpdate(), r.sendInspectorTree(i), r.sendInspectorState(i);
    });
    const s = "router:navigations:" + o;
    r.addTimelineLayer({
      id: s,
      label: `Router${o ? " " + o : ""} Navigations`,
      color: 4237508
    }), t.onError((u, d) => {
      r.addTimelineEvent({
        layerId: s,
        event: {
          title: "Error during Navigation",
          subtitle: d.fullPath,
          logType: "error",
          time: r.now(),
          data: { error: u },
          groupId: d.meta.__navigationId
        }
      });
    });
    let a = 0;
    t.beforeEach((u, d) => {
      const f = {
        guard: Ye("beforeEach"),
        from: Le(d, "Current Location during this navigation"),
        to: Le(u, "Target location")
      };
      Object.defineProperty(u.meta, "__navigationId", {
        value: a++
      }), r.addTimelineEvent({
        layerId: s,
        event: {
          time: r.now(),
          title: "Start of navigation",
          subtitle: u.fullPath,
          data: f,
          groupId: u.meta.__navigationId
        }
      });
    }), t.afterEach((u, d, f) => {
      const p = {
        guard: Ye("afterEach")
      };
      f ? (p.failure = {
        _custom: {
          type: Error,
          readOnly: !0,
          display: f ? f.message : "",
          tooltip: "Navigation Failure",
          value: f
        }
      }, p.status = Ye("❌")) : p.status = Ye("✅"), p.from = Le(d, "Current Location during this navigation"), p.to = Le(u, "Target location"), r.addTimelineEvent({
        layerId: s,
        event: {
          title: "End of navigation",
          subtitle: u.fullPath,
          time: r.now(),
          data: p,
          logType: f ? "warning" : "default",
          groupId: u.meta.__navigationId
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
    function l() {
      if (!c)
        return;
      const u = c;
      let d = n.getRoutes().filter((f) => !f.parent);
      d.forEach(Vo), u.filter && (d = d.filter((f) => (
        // save matches state based on the payload
        Dt(f, u.filter.toLowerCase())
      ))), d.forEach((f) => Do(f, t.currentRoute.value)), u.rootNodes = d.map(To);
    }
    let c;
    r.on.getInspectorTree((u) => {
      c = u, u.app === e && u.inspectorId === i && l();
    }), r.on.getInspectorState((u) => {
      if (u.app === e && u.inspectorId === i) {
        const f = n.getRoutes().find((p) => p.record.__vd_id === u.nodeId);
        f && (u.state = {
          options: ka(f)
        });
      }
    }), r.sendInspectorTree(i), r.sendInspectorState(i);
  });
}
function Sa(e) {
  return e.optional ? e.repeatable ? "*" : "?" : e.repeatable ? "+" : "";
}
function ka(e) {
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
        display: e.keys.map((o) => `${o.name}${Sa(o)}`).join(" "),
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
const No = 15485081, Co = 2450411, Ro = 8702998, Oa = 2282478, Ao = 16486972, Ia = 6710886;
function To(e) {
  const t = [], { record: n } = e;
  n.name != null && t.push({
    label: String(n.name),
    textColor: 0,
    backgroundColor: Oa
  }), n.aliasOf && t.push({
    label: "alias",
    textColor: 0,
    backgroundColor: Ao
  }), e.__vd_match && t.push({
    label: "matches",
    textColor: 0,
    backgroundColor: No
  }), e.__vd_exactActive && t.push({
    label: "exact",
    textColor: 0,
    backgroundColor: Ro
  }), e.__vd_active && t.push({
    label: "active",
    textColor: 0,
    backgroundColor: Co
  }), n.redirect && t.push({
    label: typeof n.redirect == "string" ? `redirect: ${n.redirect}` : "redirects",
    textColor: 16777215,
    backgroundColor: Ia
  });
  let o = n.__vd_id;
  return o == null && (o = String(Pa++), n.__vd_id = o), {
    id: o,
    label: n.path,
    tags: t,
    children: e.children.map(To)
  };
}
let Pa = 0;
const $a = /^\/(.*)\/([a-z]*)$/;
function Do(e, t) {
  const n = t.matched.length && ye(t.matched[t.matched.length - 1], e.record);
  e.__vd_exactActive = e.__vd_active = n, n || (e.__vd_active = t.matched.some((o) => ye(o, e.record))), e.children.forEach((o) => Do(o, t));
}
function Vo(e) {
  e.__vd_match = !1, e.children.forEach(Vo);
}
function Dt(e, t) {
  const n = String(e.re).match($a);
  if (e.__vd_match = !1, !n || n.length < 3)
    return !1;
  if (new RegExp(n[1].replace(/\$$/, ""), n[2]).test(t))
    return e.children.forEach((a) => Dt(a, t)), e.record.path !== "/" || t === "/" ? (e.__vd_match = e.re.test(t), !0) : !1;
  const r = e.record.path.toLowerCase(), s = Qe(r);
  return !t.startsWith("/") && (s.includes(t) || r.includes(t)) || s.startsWith(t) || r.startsWith(t) || e.record.name && String(e.record.name).includes(t) ? !0 : e.children.some((a) => Dt(a, t));
}
function xa(e, t) {
  const n = {};
  for (const o in e)
    t.includes(o) || (n[o] = e[o]);
  return n;
}
function Na(e) {
  const t = Fs(e.routes, e), n = e.parseQuery || ca, o = e.stringifyQuery || Cn, r = e.history;
  if (process.env.NODE_ENV !== "production" && !r)
    throw new Error('Provide the "history" option when calling "createRouter()": https://next.router.vuejs.org/api/#history.');
  const s = Me(), a = Me(), i = Me(), l = wr(he);
  let c = he;
  ie && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
  const u = wt.bind(null, (h) => "" + h), d = wt.bind(null, la), f = (
    // @ts-expect-error: intentionally avoid the type check
    wt.bind(null, Qe)
  );
  function p(h, w) {
    let v, E;
    return Eo(h) ? (v = t.getRecordMatcher(h), E = w) : E = h, t.addRoute(E, v);
  }
  function m(h) {
    const w = t.getRecordMatcher(h);
    w ? t.removeRoute(w) : process.env.NODE_ENV !== "production" && N(`Cannot remove non-existent route "${String(h)}"`);
  }
  function g() {
    return t.getRoutes().map((h) => h.record);
  }
  function y(h) {
    return !!t.getRecordMatcher(h);
  }
  function O(h, w) {
    if (w = R({}, w || l.value), typeof h == "string") {
      const P = bt(n, h, w.path), L = t.resolve({ path: P.path }, w), we = r.createHref(P.fullPath);
      return process.env.NODE_ENV !== "production" && (we.startsWith("//") ? N(`Location "${h}" resolved to "${we}". A resolved location cannot start with multiple slashes.`) : L.matched.length || N(`No match found for location with path "${h}"`)), R(P, L, {
        params: f(L.params),
        hash: Qe(P.hash),
        redirectedFrom: void 0,
        href: we
      });
    }
    let v;
    if ("path" in h)
      process.env.NODE_ENV !== "production" && "params" in h && !("name" in h) && // @ts-expect-error: the type is never
      Object.keys(h.params).length && N(`Path "${// @ts-expect-error: the type is never
      h.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`), v = R({}, h, {
        path: bt(n, h.path, w.path).path
      });
    else {
      const P = R({}, h.params);
      for (const L in P)
        P[L] == null && delete P[L];
      v = R({}, h, {
        params: d(h.params)
      }), w.params = d(w.params);
    }
    const E = t.resolve(v, w), C = h.hash || "";
    process.env.NODE_ENV !== "production" && C && !C.startsWith("#") && N(`A \`hash\` should always start with the character "#". Replace "${C}" with "#${C}".`), E.params = u(f(E.params));
    const U = gs(o, R({}, h, {
      hash: sa(C),
      path: E.path
    })), x = r.createHref(U);
    return process.env.NODE_ENV !== "production" && (x.startsWith("//") ? N(`Location "${h}" resolved to "${x}". A resolved location cannot start with multiple slashes.`) : E.matched.length || N(`No match found for location with path "${"path" in h ? h.path : h}"`)), R({
      fullPath: U,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash: C,
      query: (
        // if the user is using a custom query lib like qs, we might have
        // nested objects, so we keep the query as is, meaning it can contain
        // numbers at `$route.query`, but at the point, the user will have to
        // use their own type anyway.
        // https://github.com/vuejs/router/issues/328#issuecomment-649481567
        o === Cn ? ua(h.query) : h.query || {}
      )
    }, E, {
      redirectedFrom: void 0,
      href: x
    });
  }
  function I(h) {
    return typeof h == "string" ? bt(n, h, l.value.path) : R({}, h);
  }
  function M(h, w) {
    if (c !== h)
      return De(8, {
        from: w,
        to: h
      });
  }
  function F(h) {
    return k(h);
  }
  function Y(h) {
    return F(R(I(h), { replace: !0 }));
  }
  function X(h) {
    const w = h.matched[h.matched.length - 1];
    if (w && w.redirect) {
      const { redirect: v } = w;
      let E = typeof v == "function" ? v(h) : v;
      if (typeof E == "string" && (E = E.includes("?") || E.includes("#") ? E = I(E) : (
        // force empty params
        { path: E }
      ), E.params = {}), process.env.NODE_ENV !== "production" && !("path" in E) && !("name" in E))
        throw N(`Invalid redirect found:
${JSON.stringify(E, null, 2)}
 when navigating to "${h.fullPath}". A redirect must contain a name or path. This will break in production.`), new Error("Invalid redirect");
      return R({
        query: h.query,
        hash: h.hash,
        // avoid transferring params if the redirect has a path
        params: "path" in E ? {} : h.params
      }, E);
    }
  }
  function k(h, w) {
    const v = c = O(h), E = l.value, C = h.state, U = h.force, x = h.replace === !0, P = X(v);
    if (P)
      return k(
        R(I(P), {
          state: typeof P == "object" ? R({}, C, P.state) : C,
          force: U,
          replace: x
        }),
        // keep original redirectedFrom if it exists
        w || v
      );
    const L = v;
    L.redirectedFrom = w;
    let we;
    return !U && bn(o, E, v) && (we = De(16, { to: L, from: E }), pn(
      E,
      E,
      // this is a push, the only way for it to be triggered from a
      // history.listen is with a redirect, which makes it become a push
      !0,
      // This cannot be the first navigation because the initial location
      // cannot be manually navigated to
      !1
    )), (we ? Promise.resolve(we) : S(L, E)).catch((z) => re(z) ? (
      // navigation redirects still mark the router as ready
      re(
        z,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? z : mt(z)
    ) : (
      // reject any unknown error
      W(z, L, E)
    )).then((z) => {
      if (z) {
        if (re(
          z,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        ))
          return process.env.NODE_ENV !== "production" && // we are redirecting to the same location we were already at
          bn(o, O(z.to), L) && // and we have done it a couple of times
          w && // @ts-expect-error: added only in dev
          (w._count = w._count ? (
            // @ts-expect-error
            w._count + 1
          ) : 1) > 10 ? (N(`Detected an infinite redirection in a navigation guard when going from "${E.fullPath}" to "${L.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`), Promise.reject(new Error("Infinite redirect in navigation guard"))) : k(
            // keep options
            R({
              // preserve an existing replacement but allow the redirect to override it
              replace: x
            }, I(z.to), {
              state: typeof z.to == "object" ? R({}, C, z.to.state) : C,
              force: U
            }),
            // preserve the original redirectedFrom if any
            w || L
          );
      } else
        z = D(L, E, !0, x, C);
      return _(L, E, z), z;
    });
  }
  function te(h, w) {
    const v = M(h, w);
    return v ? Promise.reject(v) : Promise.resolve();
  }
  function S(h, w) {
    let v;
    const [E, C, U] = Ca(h, w);
    v = Et(E.reverse(), "beforeRouteLeave", h, w);
    for (const P of E)
      P.leaveGuards.forEach((L) => {
        v.push(me(L, h, w));
      });
    const x = te.bind(null, h, w);
    return v.push(x), Ne(v).then(() => {
      v = [];
      for (const P of s.list())
        v.push(me(P, h, w));
      return v.push(x), Ne(v);
    }).then(() => {
      v = Et(C, "beforeRouteUpdate", h, w);
      for (const P of C)
        P.updateGuards.forEach((L) => {
          v.push(me(L, h, w));
        });
      return v.push(x), Ne(v);
    }).then(() => {
      v = [];
      for (const P of h.matched)
        if (P.beforeEnter && !w.matched.includes(P))
          if (q(P.beforeEnter))
            for (const L of P.beforeEnter)
              v.push(me(L, h, w));
          else
            v.push(me(P.beforeEnter, h, w));
      return v.push(x), Ne(v);
    }).then(() => (h.matched.forEach((P) => P.enterCallbacks = {}), v = Et(U, "beforeRouteEnter", h, w), v.push(x), Ne(v))).then(() => {
      v = [];
      for (const P of a.list())
        v.push(me(P, h, w));
      return v.push(x), Ne(v);
    }).catch((P) => re(
      P,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? P : Promise.reject(P));
  }
  function _(h, w, v) {
    for (const E of i.list())
      E(h, w, v);
  }
  function D(h, w, v, E, C) {
    const U = M(h, w);
    if (U)
      return U;
    const x = w === he, P = ie ? history.state : {};
    v && (E || x ? r.replace(h.fullPath, R({
      scroll: x && P && P.scroll
    }, C)) : r.push(h.fullPath, C)), l.value = h, pn(h, w, v, x), mt();
  }
  let B;
  function _e() {
    B || (B = r.listen((h, w, v) => {
      const E = O(h), C = X(E);
      if (C) {
        k(R(C, { replace: !0 }), E).catch(Be);
        return;
      }
      c = E;
      const U = l.value;
      ie && ks(Sn(U.fullPath, v.delta), dt()), S(E, U).catch((x) => re(
        x,
        12
        /* ErrorTypes.NAVIGATION_CANCELLED */
      ) ? x : re(
        x,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? (k(
        x.to,
        E
        // avoid an uncaught rejection, let push call triggerError
      ).then((P) => {
        re(
          P,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && !v.delta && v.type === We.pop && r.go(-1, !1);
      }).catch(Be), Promise.reject()) : (v.delta && r.go(-v.delta, !1), W(x, E, U))).then((x) => {
        x = x || D(
          // after navigation, all matched components are resolved
          E,
          U,
          !1
        ), x && (v.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
        // entry while a different route is displayed
        !re(
          x,
          8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        ) ? r.go(-v.delta, !1) : v.type === We.pop && re(
          x,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && r.go(-1, !1)), _(E, U, x);
      }).catch(Be);
    }));
  }
  let Ve = Me(), qe = Me(), ne;
  function W(h, w, v) {
    mt(h);
    const E = qe.list();
    return E.length ? E.forEach((C) => C(h, w, v)) : (process.env.NODE_ENV !== "production" && N("uncaught error during route navigation:"), console.error(h)), Promise.reject(h);
  }
  function yr() {
    return ne && l.value !== he ? Promise.resolve() : new Promise((h, w) => {
      Ve.add([h, w]);
    });
  }
  function mt(h) {
    return ne || (ne = !h, _e(), Ve.list().forEach(([w, v]) => h ? v(h) : w()), Ve.reset()), h;
  }
  function pn(h, w, v, E) {
    const { scrollBehavior: C } = e;
    if (!ie || !C)
      return Promise.resolve();
    const U = !v && Os(Sn(h.fullPath, 0)) || (E || !v) && history.state && history.state.scroll || null;
    return Fe().then(() => C(h, w, U)).then((x) => x && Ss(x)).catch((x) => W(x, h, w));
  }
  const gt = (h) => r.go(h);
  let vt;
  const yt = /* @__PURE__ */ new Set();
  return {
    currentRoute: l,
    listening: !0,
    addRoute: p,
    removeRoute: m,
    hasRoute: y,
    getRoutes: g,
    resolve: O,
    options: e,
    push: F,
    replace: Y,
    go: gt,
    back: () => gt(-1),
    forward: () => gt(1),
    beforeEach: s.add,
    beforeResolve: a.add,
    afterEach: i.add,
    onError: qe.add,
    isReady: yr,
    install(h) {
      const w = this;
      h.component("RouterLink", ma), h.component("RouterView", _a), h.config.globalProperties.$router = w, Object.defineProperty(h.config.globalProperties, "$route", {
        enumerable: !0,
        get: () => b(l)
      }), ie && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !vt && l.value === he && (vt = !0, F(r.location).catch((C) => {
        process.env.NODE_ENV !== "production" && N("Unexpected error when starting the router:", C);
      }));
      const v = {};
      for (const C in he)
        v[C] = j(() => l.value[C]);
      h.provide(Xt, w), h.provide(xo, ge(v)), h.provide(Tt, l);
      const E = h.unmount;
      yt.add(h), h.unmount = function() {
        yt.delete(h), yt.size < 1 && (c = he, B && B(), B = null, l.value = he, vt = !1, ne = !1), E();
      }, process.env.NODE_ENV !== "production" && ie && Ea(h, w, t);
    }
  };
}
function Ne(e) {
  return e.reduce((t, n) => t.then(() => n()), Promise.resolve());
}
function Ca(e, t) {
  const n = [], o = [], r = [], s = Math.max(t.matched.length, e.matched.length);
  for (let a = 0; a < s; a++) {
    const i = t.matched[a];
    i && (e.matched.find((c) => ye(c, i)) ? o.push(i) : n.push(i));
    const l = e.matched[a];
    l && (t.matched.find((c) => ye(c, l)) || r.push(l));
  }
  return [n, o, r];
}
Na({
  history: xs(),
  routes: []
});
var Mo = !1;
function Xe(e, t, n) {
  return Array.isArray(e) ? (e.length = Math.max(e.length, t), e.splice(t, 1, n), n) : (e[t] = n, n);
}
function St(e, t) {
  if (Array.isArray(e)) {
    e.splice(t, 1);
    return;
  }
  delete e[t];
}
function Ra() {
  return Lo().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function Lo() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const Aa = typeof Proxy == "function", Ta = "devtools-plugin:setup", Da = "plugin:settings:set";
let Ce, Vt;
function Va() {
  var e;
  return Ce !== void 0 || (typeof window < "u" && window.performance ? (Ce = !0, Vt = window.performance) : typeof global < "u" && (!((e = global.perf_hooks) === null || e === void 0) && e.performance) ? (Ce = !0, Vt = global.perf_hooks.performance) : Ce = !1), Ce;
}
function Ma() {
  return Va() ? Vt.now() : Date.now();
}
class La {
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
        return Ma();
      }
    }, n && n.on(Da, (a, i) => {
      a === this.plugin.id && this.fallbacks.setSettings(i);
    }), this.proxiedOn = new Proxy({}, {
      get: (a, i) => this.target ? this.target.on[i] : (...l) => {
        this.onQueue.push({
          method: i,
          args: l
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (a, i) => this.target ? this.target[i] : i === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(i) ? (...l) => (this.targetQueue.push({
        method: i,
        args: l,
        resolve: () => {
        }
      }), this.fallbacks[i](...l)) : (...l) => new Promise((c) => {
        this.targetQueue.push({
          method: i,
          args: l,
          resolve: c
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
function jo(e, t) {
  const n = e, o = Lo(), r = Ra(), s = Aa && n.enableEarlyProxy;
  if (r && (o.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !s))
    r.emit(Ta, e, t);
  else {
    const a = s ? new La(n, r) : null;
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
let je;
const ze = (e) => je = e, Bo = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
  /* istanbul ignore next */
  Symbol()
);
function $e(e) {
  return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var oe;
(function(e) {
  e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(oe || (oe = {}));
const ft = typeof window < "u", He = (process.env.NODE_ENV !== "production" || !1) && process.env.NODE_ENV !== "test" && ft, Mn = /* @__PURE__ */ (() => typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null })();
function ja(e, { autoBom: t = !1 } = {}) {
  return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob([String.fromCharCode(65279), e], { type: e.type }) : e;
}
function Zt(e, t, n) {
  const o = new XMLHttpRequest();
  o.open("GET", e), o.responseType = "blob", o.onload = function() {
    Fo(o.response, t, n);
  }, o.onerror = function() {
    console.error("could not download file");
  }, o.send();
}
function Uo(e) {
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
const rt = typeof navigator == "object" ? navigator : { userAgent: "" }, Ho = /* @__PURE__ */ (() => /Macintosh/.test(rt.userAgent) && /AppleWebKit/.test(rt.userAgent) && !/Safari/.test(rt.userAgent))(), Fo = ft ? (
  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
  typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !Ho ? Ba : (
    // Use msSaveOrOpenBlob as a second approach
    "msSaveOrOpenBlob" in rt ? Ua : (
      // Fallback to using FileReader and a popup
      Ha
    )
  )
) : () => {
};
function Ba(e, t = "download", n) {
  const o = document.createElement("a");
  o.download = t, o.rel = "noopener", typeof e == "string" ? (o.href = e, o.origin !== location.origin ? Uo(o.href) ? Zt(e, t, n) : (o.target = "_blank", ot(o)) : ot(o)) : (o.href = URL.createObjectURL(e), setTimeout(function() {
    URL.revokeObjectURL(o.href);
  }, 4e4), setTimeout(function() {
    ot(o);
  }, 0));
}
function Ua(e, t = "download", n) {
  if (typeof e == "string")
    if (Uo(e))
      Zt(e, t, n);
    else {
      const o = document.createElement("a");
      o.href = e, o.target = "_blank", setTimeout(function() {
        ot(o);
      });
    }
  else
    navigator.msSaveOrOpenBlob(ja(e, n), t);
}
function Ha(e, t, n, o) {
  if (o = o || open("", "_blank"), o && (o.document.title = o.document.body.innerText = "downloading..."), typeof e == "string")
    return Zt(e, t, n);
  const r = e.type === "application/octet-stream", s = /constructor/i.test(String(Mn.HTMLElement)) || "safari" in Mn, a = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((a || r && s || Ho) && typeof FileReader < "u") {
    const i = new FileReader();
    i.onloadend = function() {
      let l = i.result;
      if (typeof l != "string")
        throw o = null, new Error("Wrong reader.result type");
      l = a ? l : l.replace(/^data:[^;]*;/, "data:attachment/file;"), o ? o.location.href = l : location.assign(l), o = null;
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
function en(e) {
  return "_a" in e && "install" in e;
}
function Go() {
  if (!("clipboard" in navigator))
    return H("Your browser doesn't support the Clipboard API", "error"), !0;
}
function Wo(e) {
  return e instanceof Error && e.message.toLowerCase().includes("document is not focused") ? (H('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn"), !0) : !1;
}
async function Fa(e) {
  if (!Go())
    try {
      await navigator.clipboard.writeText(JSON.stringify(e.state.value)), H("Global state copied to clipboard.");
    } catch (t) {
      if (Wo(t))
        return;
      H("Failed to serialize the state. Check the console for more details.", "error"), console.error(t);
    }
}
async function Ga(e) {
  if (!Go())
    try {
      e.state.value = JSON.parse(await navigator.clipboard.readText()), H("Global state pasted from clipboard.");
    } catch (t) {
      if (Wo(t))
        return;
      H("Failed to deserialize the state from clipboard. Check the console for more details.", "error"), console.error(t);
    }
}
async function Wa(e) {
  try {
    Fo(new Blob([JSON.stringify(e.state.value)], {
      type: "text/plain;charset=utf-8"
    }), "pinia-state.json");
  } catch (t) {
    H("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
let se;
function Qa() {
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
async function za(e) {
  try {
    const n = await (await Qa())();
    if (!n)
      return;
    const { text: o, file: r } = n;
    e.state.value = JSON.parse(o), H(`Global state imported from "${r.name}".`);
  } catch (t) {
    H("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
function ee(e) {
  return {
    _custom: {
      display: e
    }
  };
}
const Qo = "🍍 Pinia (root)", Mt = "_root";
function Ka(e) {
  return en(e) ? {
    id: Mt,
    label: Qo
  } : {
    id: e.$id,
    label: e.$id
  };
}
function qa(e) {
  if (en(e)) {
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
          value: a._getters.reduce((i, l) => (i[l] = a[l], i), {})
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
function Ja(e) {
  return e ? Array.isArray(e) ? e.reduce((t, n) => (t.keys.push(n.key), t.operations.push(n.type), t.oldValue[n.key] = n.oldValue, t.newValue[n.key] = n.newValue, t), {
    oldValue: {},
    keys: [],
    operations: [],
    newValue: {}
  }) : {
    operation: ee(e.type),
    key: ee(e.key),
    oldValue: e.oldValue,
    newValue: e.newValue
  } : {};
}
function Ya(e) {
  switch (e) {
    case oe.direct:
      return "mutation";
    case oe.patchFunction:
      return "$patch";
    case oe.patchObject:
      return "$patch";
    default:
      return "unknown";
  }
}
let Ae = !0;
const st = [], be = "pinia:mutations", Q = "pinia", { assign: Xa } = Object, lt = (e) => "🍍 " + e;
function Za(e, t) {
  jo({
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
      id: Q,
      label: "Pinia 🍍",
      icon: "storage",
      treeFilterPlaceholder: "Search stores",
      actions: [
        {
          icon: "content_copy",
          action: () => {
            Fa(t);
          },
          tooltip: "Serialize and copy the state"
        },
        {
          icon: "content_paste",
          action: async () => {
            await Ga(t), n.sendInspectorTree(Q), n.sendInspectorState(Q);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            Wa(t);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await za(t), n.sendInspectorTree(Q), n.sendInspectorState(Q);
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
            type: lt(i.$id),
            key: "state",
            editable: !0,
            value: i._isOptionsAPI ? {
              _custom: {
                value: ut(i.$state),
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
              Object.keys(i.$state).reduce((l, c) => (l[c] = i.$state[c], l), {})
            )
          }), i._getters && i._getters.length && o.instanceData.state.push({
            type: lt(i.$id),
            key: "getters",
            editable: !1,
            value: i._getters.reduce((l, c) => {
              try {
                l[c] = i[c];
              } catch (u) {
                l[c] = u;
              }
              return l;
            }, {})
          });
        });
      }
    }), n.on.getInspectorTree((o) => {
      if (o.app === e && o.inspectorId === Q) {
        let r = [t];
        r = r.concat(Array.from(t._s.values())), o.rootNodes = (o.filter ? r.filter((s) => "$id" in s ? s.$id.toLowerCase().includes(o.filter.toLowerCase()) : Qo.toLowerCase().includes(o.filter.toLowerCase())) : r).map(Ka);
      }
    }), n.on.getInspectorState((o) => {
      if (o.app === e && o.inspectorId === Q) {
        const r = o.nodeId === Mt ? t : t._s.get(o.nodeId);
        if (!r)
          return;
        r && (o.state = qa(r));
      }
    }), n.on.editInspectorState((o, r) => {
      if (o.app === e && o.inspectorId === Q) {
        const s = o.nodeId === Mt ? t : t._s.get(o.nodeId);
        if (!s)
          return H(`store "${o.nodeId}" not found`, "error");
        const { path: a } = o;
        en(s) ? a.unshift("state") : (a.length !== 1 || !s._customProperties.has(a[0]) || a[0] in s.$state) && a.unshift("$state"), Ae = !1, o.set(s, a, o.state.value), Ae = !0;
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
function ei(e, t) {
  st.includes(lt(t.$id)) || st.push(lt(t.$id)), jo({
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
    t.$onAction(({ after: a, onError: i, name: l, args: c }) => {
      const u = zo++;
      n.addTimelineEvent({
        layerId: be,
        event: {
          time: o(),
          title: "🛫 " + l,
          subtitle: "start",
          data: {
            store: ee(t.$id),
            action: ee(l),
            args: c
          },
          groupId: u
        }
      }), a((d) => {
        Ee = void 0, n.addTimelineEvent({
          layerId: be,
          event: {
            time: o(),
            title: "🛬 " + l,
            subtitle: "end",
            data: {
              store: ee(t.$id),
              action: ee(l),
              args: c,
              result: d
            },
            groupId: u
          }
        });
      }), i((d) => {
        Ee = void 0, n.addTimelineEvent({
          layerId: be,
          event: {
            time: o(),
            logType: "error",
            title: "💥 " + l,
            subtitle: "end",
            data: {
              store: ee(t.$id),
              action: ee(l),
              args: c,
              error: d
            },
            groupId: u
          }
        });
      });
    }, !0), t._customProperties.forEach((a) => {
      de(() => b(t[a]), (i, l) => {
        n.notifyComponentUpdate(), n.sendInspectorState(Q), Ae && n.addTimelineEvent({
          layerId: be,
          event: {
            time: o(),
            title: "Change",
            subtitle: a,
            data: {
              newValue: i,
              oldValue: l
            },
            groupId: Ee
          }
        });
      }, { deep: !0 });
    }), t.$subscribe(({ events: a, type: i }, l) => {
      if (n.notifyComponentUpdate(), n.sendInspectorState(Q), !Ae)
        return;
      const c = {
        time: o(),
        title: Ya(i),
        data: Xa({ store: ee(t.$id) }, Ja(a)),
        groupId: Ee
      };
      Ee = void 0, i === oe.patchFunction ? c.subtitle = "⤵️" : i === oe.patchObject ? c.subtitle = "🧩" : a && !Array.isArray(a) && (c.subtitle = a.type), a && (c.data["rawEvent(s)"] = {
        _custom: {
          display: "DebuggerEvent",
          type: "object",
          tooltip: "raw DebuggerEvent[]",
          value: a
        }
      }), n.addTimelineEvent({
        layerId: be,
        event: c
      });
    }, { detached: !0, flush: "sync" });
    const r = t._hotUpdate;
    t._hotUpdate = ae((a) => {
      r(a), n.addTimelineEvent({
        layerId: be,
        event: {
          time: o(),
          title: "🔥 " + t.$id,
          subtitle: "HMR update",
          data: {
            store: ee(t.$id),
            info: ee("HMR update")
          }
        }
      }), n.notifyComponentUpdate(), n.sendInspectorTree(Q), n.sendInspectorState(Q);
    });
    const { $dispose: s } = t;
    t.$dispose = () => {
      s(), n.notifyComponentUpdate(), n.sendInspectorTree(Q), n.sendInspectorState(Q), n.getSettings().logStoreChanges && H(`Disposed "${t.$id}" store 🗑`);
    }, n.notifyComponentUpdate(), n.sendInspectorTree(Q), n.sendInspectorState(Q), n.getSettings().logStoreChanges && H(`"${t.$id}" store installed 🆕`);
  });
}
let zo = 0, Ee;
function Ln(e, t) {
  const n = t.reduce((o, r) => (o[r] = ut(e)[r], o), {});
  for (const o in n)
    e[o] = function() {
      const r = zo, s = new Proxy(e, {
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
function ti({ app: e, store: t, options: n }) {
  if (!t.$id.startsWith("__hot:")) {
    if (n.state && (t._isOptionsAPI = !0), typeof n.state == "function") {
      Ln(
        // @ts-expect-error: can cast the store...
        t,
        Object.keys(n.actions)
      );
      const o = t._hotUpdate;
      ut(t)._hotUpdate = function(r) {
        o.apply(this, arguments), Ln(t, Object.keys(r._hmrPayload.actions));
      };
    }
    ei(
      e,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      t
    );
  }
}
function ni() {
  const e = fo(!0), t = e.run(() => V({}));
  let n = [], o = [];
  const r = ae({
    install(s) {
      ze(r), r._a = s, s.provide(Bo, r), s.config.globalProperties.$pinia = r, He && Za(s, r), o.forEach((a) => n.push(a)), o = [];
    },
    use(s) {
      return !this._a && !Mo ? o.push(s) : n.push(s), this;
    },
    _p: n,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return He && typeof Proxy < "u" && r.use(ti), r;
}
function Ko(e, t) {
  for (const n in t) {
    const o = t[n];
    if (!(n in e))
      continue;
    const r = e[n];
    $e(r) && $e(o) && !Ge(o) && !Kt(o) ? e[n] = Ko(r, o) : e[n] = o;
  }
  return e;
}
const qo = () => {
};
function jn(e, t, n, o = qo) {
  e.push(t);
  const r = () => {
    const s = e.indexOf(t);
    s > -1 && (e.splice(s, 1), o());
  };
  return !n && ho() && mo(r), r;
}
function Re(e, ...t) {
  e.slice().forEach((n) => {
    n(...t);
  });
}
function Lt(e, t) {
  e instanceof Map && t instanceof Map && t.forEach((n, o) => e.set(o, n)), e instanceof Set && t instanceof Set && t.forEach(e.add, e);
  for (const n in t) {
    if (!t.hasOwnProperty(n))
      continue;
    const o = t[n], r = e[n];
    $e(r) && $e(o) && e.hasOwnProperty(n) && !Ge(o) && !Kt(o) ? e[n] = Lt(r, o) : e[n] = o;
  }
  return e;
}
const oi = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
);
function ri(e) {
  return !$e(e) || !e.hasOwnProperty(oi);
}
const { assign: Z } = Object;
function Bn(e) {
  return !!(Ge(e) && e.effect);
}
function Un(e, t, n, o) {
  const { state: r, actions: s, getters: a } = t, i = n.state.value[e];
  let l;
  function c() {
    !i && (process.env.NODE_ENV === "production" || !o) && (n.state.value[e] = r ? r() : {});
    const u = process.env.NODE_ENV !== "production" && o ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      hn(V(r ? r() : {}).value)
    ) : hn(n.state.value[e]);
    return Z(u, s, Object.keys(a || {}).reduce((d, f) => (process.env.NODE_ENV !== "production" && f in u && console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${f}" in store "${e}".`), d[f] = ae(j(() => {
      ze(n);
      const p = n._s.get(e);
      return a[f].call(p, p);
    })), d), {}));
  }
  return l = jt(e, c, t, n, o, !0), l;
}
function jt(e, t, n = {}, o, r, s) {
  let a;
  const i = Z({ actions: {} }, n);
  if (process.env.NODE_ENV !== "production" && !o._e.active)
    throw new Error("Pinia destroyed");
  const l = {
    deep: !0
    // flush: 'post',
  };
  process.env.NODE_ENV !== "production" && !Mo && (l.onTrigger = (S) => {
    c ? p = S : c == !1 && !k._hotUpdating && (Array.isArray(p) ? p.push(S) : console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug."));
  });
  let c, u, d = ae([]), f = ae([]), p;
  const m = o.state.value[e];
  !s && !m && (process.env.NODE_ENV === "production" || !r) && (o.state.value[e] = {});
  const g = V({});
  let y;
  function O(S) {
    let _;
    c = u = !1, process.env.NODE_ENV !== "production" && (p = []), typeof S == "function" ? (S(o.state.value[e]), _ = {
      type: oe.patchFunction,
      storeId: e,
      events: p
    }) : (Lt(o.state.value[e], S), _ = {
      type: oe.patchObject,
      payload: S,
      storeId: e,
      events: p
    });
    const D = y = Symbol();
    Fe().then(() => {
      y === D && (c = !0);
    }), u = !0, Re(d, _, o.state.value[e]);
  }
  const I = s ? function() {
    const { state: _ } = n, D = _ ? _() : {};
    this.$patch((B) => {
      Z(B, D);
    });
  } : (
    /* istanbul ignore next */
    process.env.NODE_ENV !== "production" ? () => {
      throw new Error(`🍍: Store "${e}" is built using the setup syntax and does not implement $reset().`);
    } : qo
  );
  function M() {
    a.stop(), d = [], f = [], o._s.delete(e);
  }
  function F(S, _) {
    return function() {
      ze(o);
      const D = Array.from(arguments), B = [], _e = [];
      function Ve(W) {
        B.push(W);
      }
      function qe(W) {
        _e.push(W);
      }
      Re(f, {
        args: D,
        name: S,
        store: k,
        after: Ve,
        onError: qe
      });
      let ne;
      try {
        ne = _.apply(this && this.$id === e ? this : k, D);
      } catch (W) {
        throw Re(_e, W), W;
      }
      return ne instanceof Promise ? ne.then((W) => (Re(B, W), W)).catch((W) => (Re(_e, W), Promise.reject(W))) : (Re(B, ne), ne);
    };
  }
  const Y = /* @__PURE__ */ ae({
    actions: {},
    getters: {},
    state: [],
    hotState: g
  }), X = {
    _p: o,
    // _s: scope,
    $id: e,
    $onAction: jn.bind(null, f),
    $patch: O,
    $reset: I,
    $subscribe(S, _ = {}) {
      const D = jn(d, S, _.detached, () => B()), B = a.run(() => de(() => o.state.value[e], (_e) => {
        (_.flush === "sync" ? u : c) && S({
          storeId: e,
          type: oe.direct,
          events: p
        }, _e);
      }, Z({}, l, _)));
      return D;
    },
    $dispose: M
  }, k = ge(process.env.NODE_ENV !== "production" || He ? Z(
    {
      _hmrPayload: Y,
      _customProperties: ae(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    X
    // must be added later
    // setupStore
  ) : X);
  o._s.set(e, k);
  const te = o._e.run(() => (a = fo(), a.run(() => t())));
  for (const S in te) {
    const _ = te[S];
    if (Ge(_) && !Bn(_) || Kt(_))
      process.env.NODE_ENV !== "production" && r ? Xe(g.value, S, _t(te, S)) : s || (m && ri(_) && (Ge(_) ? _.value = m[S] : Lt(_, m[S])), o.state.value[e][S] = _), process.env.NODE_ENV !== "production" && Y.state.push(S);
    else if (typeof _ == "function") {
      const D = process.env.NODE_ENV !== "production" && r ? _ : F(S, _);
      te[S] = D, process.env.NODE_ENV !== "production" && (Y.actions[S] = _), i.actions[S] = _;
    } else
      process.env.NODE_ENV !== "production" && Bn(_) && (Y.getters[S] = s ? (
        // @ts-expect-error
        n.getters[S]
      ) : _, ft && (te._getters || // @ts-expect-error: same
      (te._getters = ae([]))).push(S));
  }
  if (Z(k, te), Z(ut(k), te), Object.defineProperty(k, "$state", {
    get: () => process.env.NODE_ENV !== "production" && r ? g.value : o.state.value[e],
    set: (S) => {
      if (process.env.NODE_ENV !== "production" && r)
        throw new Error("cannot set hotState");
      O((_) => {
        Z(_, S);
      });
    }
  }), process.env.NODE_ENV !== "production" && (k._hotUpdate = ae((S) => {
    k._hotUpdating = !0, S._hmrPayload.state.forEach((_) => {
      if (_ in k.$state) {
        const D = S.$state[_], B = k.$state[_];
        typeof D == "object" && $e(D) && $e(B) ? Ko(D, B) : S.$state[_] = B;
      }
      Xe(k, _, _t(S.$state, _));
    }), Object.keys(k.$state).forEach((_) => {
      _ in S.$state || St(k, _);
    }), c = !1, u = !1, o.state.value[e] = _t(S._hmrPayload, "hotState"), u = !0, Fe().then(() => {
      c = !0;
    });
    for (const _ in S._hmrPayload.actions) {
      const D = S[_];
      Xe(k, _, F(_, D));
    }
    for (const _ in S._hmrPayload.getters) {
      const D = S._hmrPayload.getters[_], B = s ? (
        // special handling of options api
        j(() => (ze(o), D.call(k, k)))
      ) : D;
      Xe(k, _, B);
    }
    Object.keys(k._hmrPayload.getters).forEach((_) => {
      _ in S._hmrPayload.getters || St(k, _);
    }), Object.keys(k._hmrPayload.actions).forEach((_) => {
      _ in S._hmrPayload.actions || St(k, _);
    }), k._hmrPayload = S._hmrPayload, k._getters = S._getters, k._hotUpdating = !1;
  })), He) {
    const S = {
      writable: !0,
      configurable: !0,
      // avoid warning on devtools trying to display this property
      enumerable: !1
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((_) => {
      Object.defineProperty(k, _, Z({ value: k[_] }, S));
    });
  }
  return o._p.forEach((S) => {
    if (He) {
      const _ = a.run(() => S({
        store: k,
        app: o._a,
        pinia: o,
        options: i
      }));
      Object.keys(_ || {}).forEach((D) => k._customProperties.add(D)), Z(k, _);
    } else
      Z(k, a.run(() => S({
        store: k,
        app: o._a,
        pinia: o,
        options: i
      })));
  }), process.env.NODE_ENV !== "production" && k.$state && typeof k.$state == "object" && typeof k.$state.constructor == "function" && !k.$state.constructor.toString().includes("[native code]") && console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${k.$id}".`), m && s && n.hydrate && n.hydrate(k.$state, m), c = !0, u = !0, k;
}
function si(e, t, n) {
  let o, r;
  const s = typeof t == "function";
  typeof e == "string" ? (o = e, r = s ? n : t) : (r = e, o = e.id);
  function a(i, l) {
    const c = zt();
    if (i = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (process.env.NODE_ENV === "test" && je && je._testing ? null : i) || c && K(Bo, null), i && ze(i), process.env.NODE_ENV !== "production" && !je)
      throw new Error(`[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?
	const pinia = createPinia()
	app.use(pinia)
This will fail in production.`);
    i = je, i._s.has(o) || (s ? jt(o, t, r, i) : Un(o, r, i), process.env.NODE_ENV !== "production" && (a._pinia = i));
    const u = i._s.get(o);
    if (process.env.NODE_ENV !== "production" && l) {
      const d = "__hot:" + o, f = s ? jt(d, t, r, i, !0) : Un(d, Z({}, r), i, !0);
      l._hotUpdate(f), delete i.state.value[d], i._s.delete(d);
    }
    if (process.env.NODE_ENV !== "production" && ft && c && c.proxy && // avoid adding stores that are just built for hot module replacement
    !l) {
      const d = c.proxy, f = "_pStores" in d ? d._pStores : d._pStores = {};
      f[o] = u;
    }
    return u;
  }
  return a.$id = o, a;
}
function ai(e) {
  return e && typeof e.then == "function";
}
Promise.resolve(!1);
Promise.resolve(!0);
var Oe = Promise.resolve();
function Jo(e, t) {
  return e || (e = 0), new Promise(function(n) {
    return setTimeout(function() {
      return n(t);
    }, e);
  });
}
function ii(e, t) {
  return Math.floor(Math.random() * (t - e + 1) + e);
}
function tn() {
  return Math.random().toString(36).substring(2);
}
var Hn = 0, kt = 0;
function pt() {
  var e = new Date().getTime();
  return e === Hn ? (kt++, e * 1e3 + kt) : (Hn = e, kt = 0, e * 1e3);
}
var li = pt, ci = "native";
function ui(e) {
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
function di(e) {
  e.bc.close(), e.subFns = [];
}
function fi(e, t) {
  try {
    return e.bc.postMessage(t, !1), Oe;
  } catch (n) {
    return Promise.reject(n);
  }
}
function pi(e, t) {
  e.messagesCallback = t;
}
function hi() {
  if (typeof window > "u")
    return !1;
  if (typeof BroadcastChannel == "function") {
    if (BroadcastChannel._pubkey)
      throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
    return !0;
  } else
    return !1;
}
function mi() {
  return 150;
}
var gi = {
  create: ui,
  close: di,
  onMessage: pi,
  postMessage: fi,
  canBeUsed: hi,
  type: ci,
  averageResponseTime: mi,
  microSeconds: li
}, Yo = (
  /** @class */
  function() {
    function e(t) {
      this.ttl = t, this.map = /* @__PURE__ */ new Map(), this._to = !1;
    }
    return e.prototype.has = function(t) {
      return this.map.has(t);
    }, e.prototype.add = function(t) {
      var n = this;
      this.map.set(t, Xo()), this._to || (this._to = !0, setTimeout(function() {
        n._to = !1, vi(n);
      }, 0));
    }, e.prototype.clear = function() {
      this.map.clear();
    }, e;
  }()
);
function vi(e) {
  for (var t = Xo() - e.ttl, n = e.map[Symbol.iterator](); ; ) {
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
function Xo() {
  return new Date().getTime();
}
function nn() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = JSON.parse(JSON.stringify(e));
  return typeof t.webWorkerSupport > "u" && (t.webWorkerSupport = !0), t.idb || (t.idb = {}), t.idb.ttl || (t.idb.ttl = 1e3 * 45), t.idb.fallbackInterval || (t.idb.fallbackInterval = 150), e.idb && typeof e.idb.onclose == "function" && (t.idb.onclose = e.idb.onclose), t.localstorage || (t.localstorage = {}), t.localstorage.removeTimeout || (t.localstorage.removeTimeout = 1e3 * 60), e.methods && (t.methods = e.methods), t.node || (t.node = {}), t.node.ttl || (t.node.ttl = 1e3 * 60 * 2), t.node.maxParallelWrites || (t.node.maxParallelWrites = 2048), typeof t.node.useFastPath > "u" && (t.node.useFastPath = !0), t;
}
var yi = pt, _i = "pubkey.broadcast-channel-0-", ue = "messages", ht = {
  durability: "relaxed"
}, wi = "idb";
function Zo() {
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
function on(e) {
  e.commit && e.commit();
}
function bi(e) {
  var t = Zo(), n = _i + e, o = t.open(n);
  return o.onupgradeneeded = function(r) {
    var s = r.target.result;
    s.createObjectStore(ue, {
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
function Ei(e, t, n) {
  var o = new Date().getTime(), r = {
    uuid: t,
    time: o,
    data: n
  }, s = e.transaction([ue], "readwrite", ht);
  return new Promise(function(a, i) {
    s.oncomplete = function() {
      return a();
    }, s.onerror = function(c) {
      return i(c);
    };
    var l = s.objectStore(ue);
    l.add(r), on(s);
  });
}
function Si(e, t) {
  var n = e.transaction(ue, "readonly", ht), o = n.objectStore(ue), r = [], s = IDBKeyRange.bound(t + 1, 1 / 0);
  if (o.getAll) {
    var a = o.getAll(s);
    return new Promise(function(l, c) {
      a.onerror = function(u) {
        return c(u);
      }, a.onsuccess = function(u) {
        l(u.target.result);
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
  return new Promise(function(l, c) {
    var u = i();
    u.onerror = function(d) {
      return c(d);
    }, u.onsuccess = function(d) {
      var f = d.target.result;
      f ? f.value.id < t + 1 ? f.continue(t + 1) : (r.push(f.value), f.continue()) : (on(n), l(r));
    };
  });
}
function ki(e, t) {
  if (e.closed)
    return Promise.resolve([]);
  var n = e.db.transaction(ue, "readwrite", ht), o = n.objectStore(ue);
  return Promise.all(t.map(function(r) {
    var s = o.delete(r);
    return new Promise(function(a) {
      s.onsuccess = function() {
        return a();
      };
    });
  }));
}
function Oi(e, t) {
  var n = new Date().getTime() - t, o = e.transaction(ue, "readonly", ht), r = o.objectStore(ue), s = [];
  return new Promise(function(a) {
    r.openCursor().onsuccess = function(i) {
      var l = i.target.result;
      if (l) {
        var c = l.value;
        c.time < n ? (s.push(c), l.continue()) : (on(o), a(s));
      } else
        a(s);
    };
  });
}
function Ii(e) {
  return Oi(e.db, e.options.idb.ttl).then(function(t) {
    return ki(e, t.map(function(n) {
      return n.id;
    }));
  });
}
function Pi(e, t) {
  return t = nn(t), bi(e).then(function(n) {
    var o = {
      closed: !1,
      lastCursorId: 0,
      channelName: e,
      options: t,
      uuid: tn(),
      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new Yo(t.idb.ttl * 2),
      // ensures we do not read messages in parallel
      writeBlockPromise: Oe,
      messagesCallback: null,
      readQueuePromises: [],
      db: n
    };
    return n.onclose = function() {
      o.closed = !0, t.idb.onclose && t.idb.onclose();
    }, er(o), o;
  });
}
function er(e) {
  e.closed || tr(e).then(function() {
    return Jo(e.options.idb.fallbackInterval);
  }).then(function() {
    return er(e);
  });
}
function $i(e, t) {
  return !(e.uuid === t.uuid || t.eMIs.has(e.id) || e.data.time < t.messagesCallbackTime);
}
function tr(e) {
  return e.closed || !e.messagesCallback ? Oe : Si(e.db, e.lastCursorId).then(function(t) {
    var n = t.filter(function(o) {
      return !!o;
    }).map(function(o) {
      return o.id > e.lastCursorId && (e.lastCursorId = o.id), o;
    }).filter(function(o) {
      return $i(o, e);
    }).sort(function(o, r) {
      return o.time - r.time;
    });
    return n.forEach(function(o) {
      e.messagesCallback && (e.eMIs.add(o.id), e.messagesCallback(o.data));
    }), Oe;
  });
}
function xi(e) {
  e.closed = !0, e.db.close();
}
function Ni(e, t) {
  return e.writeBlockPromise = e.writeBlockPromise.then(function() {
    return Ei(e.db, e.uuid, t);
  }).then(function() {
    ii(0, 10) === 0 && Ii(e);
  }), e.writeBlockPromise;
}
function Ci(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t, tr(e);
}
function Ri() {
  return !!Zo();
}
function Ai(e) {
  return e.idb.fallbackInterval * 2;
}
var Ti = {
  create: Pi,
  close: xi,
  onMessage: Ci,
  postMessage: Ni,
  canBeUsed: Ri,
  type: wi,
  averageResponseTime: Ai,
  microSeconds: yi
}, Di = pt, Vi = "pubkey.broadcastChannel-", Mi = "localstorage";
function nr() {
  var e;
  if (typeof window > "u")
    return null;
  try {
    e = window.localStorage, e = window["ie8-eventlistener/storage"] || window.localStorage;
  } catch {
  }
  return e;
}
function or(e) {
  return Vi + e;
}
function Li(e, t) {
  return new Promise(function(n) {
    Jo().then(function() {
      var o = or(e.channelName), r = {
        token: tn(),
        time: new Date().getTime(),
        data: t,
        uuid: e.uuid
      }, s = JSON.stringify(r);
      nr().setItem(o, s);
      var a = document.createEvent("Event");
      a.initEvent("storage", !0, !0), a.key = o, a.newValue = s, window.dispatchEvent(a), n();
    });
  });
}
function ji(e, t) {
  var n = or(e), o = function(s) {
    s.key === n && t(JSON.parse(s.newValue));
  };
  return window.addEventListener("storage", o), o;
}
function Bi(e) {
  window.removeEventListener("storage", e);
}
function Ui(e, t) {
  if (t = nn(t), !rr())
    throw new Error("BroadcastChannel: localstorage cannot be used");
  var n = tn(), o = new Yo(t.localstorage.removeTimeout), r = {
    channelName: e,
    uuid: n,
    eMIs: o
    // emittedMessagesIds
  };
  return r.listener = ji(e, function(s) {
    r.messagesCallback && s.uuid !== n && (!s.token || o.has(s.token) || s.data.time && s.data.time < r.messagesCallbackTime || (o.add(s.token), r.messagesCallback(s.data)));
  }), r;
}
function Hi(e) {
  Bi(e.listener);
}
function Fi(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t;
}
function rr() {
  var e = nr();
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
function Gi() {
  var e = 120, t = navigator.userAgent.toLowerCase();
  return t.includes("safari") && !t.includes("chrome") ? e * 2 : e;
}
var Wi = {
  create: Ui,
  close: Hi,
  onMessage: Fi,
  postMessage: Li,
  canBeUsed: rr,
  type: Mi,
  averageResponseTime: Gi,
  microSeconds: Di
}, Qi = pt, zi = "simulate", rn = /* @__PURE__ */ new Set();
function Ki(e) {
  var t = {
    name: e,
    messagesCallback: null
  };
  return rn.add(t), t;
}
function qi(e) {
  rn.delete(e);
}
function Ji(e, t) {
  return new Promise(function(n) {
    return setTimeout(function() {
      var o = Array.from(rn);
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
function Yi(e, t) {
  e.messagesCallback = t;
}
function Xi() {
  return !0;
}
function Zi() {
  return 5;
}
var el = {
  create: Ki,
  close: qi,
  onMessage: Yi,
  postMessage: Ji,
  canBeUsed: Xi,
  type: zi,
  averageResponseTime: Zi,
  microSeconds: Qi
}, Fn = [
  gi,
  // fastest
  Ti,
  Wi
];
function tl(e) {
  var t = [].concat(e.methods, Fn).filter(Boolean);
  if (e.type) {
    if (e.type === "simulate")
      return el;
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
  throw new Error("No usable method found in " + JSON.stringify(Fn.map(function(r) {
    return r.type;
  })));
}
var sr = /* @__PURE__ */ new Set(), nl = 0, sn = function(t, n) {
  this.id = nl++, sr.add(this), this.name = t, this.options = nn(n), this.method = tl(this.options), this._iL = !1, this._onML = null, this._addEL = {
    message: [],
    internal: []
  }, this._uMP = /* @__PURE__ */ new Set(), this._befC = [], this._prepP = null, ol(this);
};
sn._pubkey = !0;
sn.prototype = {
  postMessage: function(t) {
    if (this.closed)
      throw new Error("BroadcastChannel.postMessage(): Cannot post message after channel has closed " + /**
      * In the past when this error appeared, it was really hard to debug.
      * So now we log the msg together with the error so it at least
      * gives some clue about where in your application this happens.
      */
      JSON.stringify(t));
    return Gn(this, "message", t);
  },
  postInternal: function(t) {
    return Gn(this, "internal", t);
  },
  set onmessage(e) {
    var t = this.method.microSeconds(), n = {
      time: t,
      fn: e
    };
    Qn(this, "message", this._onML), e && typeof e == "function" ? (this._onML = n, Wn(this, "message", n)) : this._onML = null;
  },
  addEventListener: function(t, n) {
    var o = this.method.microSeconds(), r = {
      time: o,
      fn: n
    };
    Wn(this, t, r);
  },
  removeEventListener: function(t, n) {
    var o = this._addEL[t].find(function(r) {
      return r.fn === n;
    });
    Qn(this, t, o);
  },
  close: function() {
    var t = this;
    if (!this.closed) {
      sr.delete(this), this.closed = !0;
      var n = this._prepP ? this._prepP : Oe;
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
function Gn(e, t, n) {
  var o = e.method.microSeconds(), r = {
    time: o,
    type: t,
    data: n
  }, s = e._prepP ? e._prepP : Oe;
  return s.then(function() {
    var a = e.method.postMessage(e._state, r);
    return e._uMP.add(a), a.catch().then(function() {
      return e._uMP.delete(a);
    }), a;
  });
}
function ol(e) {
  var t = e.method.create(e.name, e.options);
  ai(t) ? (e._prepP = t, t.then(function(n) {
    e._state = n;
  })) : e._state = t;
}
function ar(e) {
  return e._addEL.message.length > 0 || e._addEL.internal.length > 0;
}
function Wn(e, t, n) {
  e._addEL[t].push(n), rl(e);
}
function Qn(e, t, n) {
  e._addEL[t] = e._addEL[t].filter(function(o) {
    return o !== n;
  }), sl(e);
}
function rl(e) {
  if (!e._iL && ar(e)) {
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
function sl(e) {
  if (e._iL && !ar(e)) {
    e._iL = !1;
    var t = e.method.microSeconds();
    e.method.onMessage(e._state, null, t);
  }
}
const zn = {
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
class Ot extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   */
  constructor(t, n) {
    super(t), this.name = "DevalueError", this.path = n.join("");
  }
}
function Kn(e) {
  return Object(e) !== e;
}
const al = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function il(e) {
  const t = Object.getPrototypeOf(e);
  return t === Object.prototype || t === null || Object.getOwnPropertyNames(t).sort().join("\0") === al;
}
function ll(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function Te(e) {
  let t = '"';
  for (let n = 0; n < e.length; n += 1) {
    const o = e.charAt(n), r = o.charCodeAt(0);
    if (o === '"')
      t += '\\"';
    else if (o in zn)
      t += zn[o];
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
const an = -1, ir = -2, lr = -3, cr = -4, ur = -5, ln = -6;
function qn(e, t) {
  return cl(JSON.parse(e), t);
}
function cl(e, t) {
  if (typeof e == "number")
    return r(e, !0);
  if (!Array.isArray(e) || e.length === 0)
    throw new Error("Invalid input");
  const n = (
    /** @type {any[]} */
    e
  ), o = Array(n.length);
  function r(s, a = !1) {
    if (s === an)
      return;
    if (s === lr)
      return NaN;
    if (s === cr)
      return 1 / 0;
    if (s === ur)
      return -1 / 0;
    if (s === ln)
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
        const l = i[0], c = t == null ? void 0 : t[l];
        if (c)
          return o[s] = c(r(i[1]));
        switch (l) {
          case "Date":
            o[s] = new Date(i[1]);
            break;
          case "Set":
            const u = /* @__PURE__ */ new Set();
            o[s] = u;
            for (let p = 1; p < i.length; p += 1)
              u.add(r(i[p]));
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
            throw new Error(`Unknown type ${l}`);
        }
      } else {
        const l = new Array(i.length);
        o[s] = l;
        for (let c = 0; c < i.length; c += 1) {
          const u = i[c];
          u !== ir && (l[c] = r(u));
        }
      }
    else {
      const l = {};
      o[s] = l;
      for (const c in i) {
        const u = i[c];
        l[c] = r(u);
      }
    }
    return o[s];
  }
  return r(0);
}
function Jn(e, t) {
  const n = [], o = /* @__PURE__ */ new Map(), r = [];
  for (const c in t)
    r.push({ key: c, fn: t[c] });
  const s = [];
  let a = 0;
  function i(c) {
    if (typeof c == "function")
      throw new Ot("Cannot stringify a function", s);
    if (o.has(c))
      return o.get(c);
    if (c === void 0)
      return an;
    if (Number.isNaN(c))
      return lr;
    if (c === 1 / 0)
      return cr;
    if (c === -1 / 0)
      return ur;
    if (c === 0 && 1 / c < 0)
      return ln;
    const u = a++;
    o.set(c, u);
    for (const { key: f, fn: p } of r) {
      const m = p(c);
      if (m)
        return n[u] = `["${f}",${i(m)}]`, u;
    }
    let d = "";
    if (Kn(c))
      d = It(c);
    else
      switch (ll(c)) {
        case "Number":
        case "String":
        case "Boolean":
          d = `["Object",${It(c)}]`;
          break;
        case "BigInt":
          d = `["BigInt",${c}]`;
          break;
        case "Date":
          d = `["Date","${c.toISOString()}"]`;
          break;
        case "RegExp":
          const { source: p, flags: m } = c;
          d = m ? `["RegExp",${Te(p)},"${m}"]` : `["RegExp",${Te(p)}]`;
          break;
        case "Array":
          d = "[";
          for (let g = 0; g < c.length; g += 1)
            g > 0 && (d += ","), g in c ? (s.push(`[${g}]`), d += i(c[g]), s.pop()) : d += ir;
          d += "]";
          break;
        case "Set":
          d = '["Set"';
          for (const g of c)
            d += `,${i(g)}`;
          d += "]";
          break;
        case "Map":
          d = '["Map"';
          for (const [g, y] of c)
            s.push(
              `.get(${Kn(g) ? It(g) : "..."})`
            ), d += `,${i(g)},${i(y)}`;
          d += "]";
          break;
        default:
          if (!il(c))
            throw new Ot(
              "Cannot stringify arbitrary non-POJOs",
              s
            );
          if (Object.getOwnPropertySymbols(c).length > 0)
            throw new Ot(
              "Cannot stringify POJOs with symbolic keys",
              s
            );
          if (Object.getPrototypeOf(c) === null) {
            d = '["null"';
            for (const g in c)
              s.push(`.${g}`), d += `,${Te(g)},${i(c[g])}`, s.pop();
            d += "]";
          } else {
            d = "{";
            let g = !1;
            for (const y in c)
              g && (d += ","), g = !0, s.push(`.${y}`), d += `${Te(y)}:${i(c[y])}`, s.pop();
            d += "}";
          }
      }
    return n[u] = d, u;
  }
  const l = i(e);
  return l < 0 ? `${l}` : `[${n.join(",")}]`;
}
function It(e) {
  const t = typeof e;
  return t === "string" ? Te(e) : e instanceof String ? Te(e.toString()) : e === void 0 ? an.toString() : e === 0 && 1 / e < 0 ? ln.toString() : t === "bigint" ? `["BigInt","${e}"]` : String(e);
}
function ul(e, t, { initialize: n, type: o }) {
  let r = `${t.$id}-${e.toString()}`, s = new sn(r, { type: o }), a = !1, i = 0;
  de(() => t[e], (u) => {
    a || (i = Date.now(), s.postMessage({ timestamp: i, state: qn(Jn(u)) })), a = !1;
  }, { deep: !0 }), s.onmessage = (u) => {
    if (u === void 0) {
      s.postMessage({ timestamp: i, state: qn(Jn(t[e])) });
      return;
    }
    u.timestamp <= i || (a = !0, i = u.timestamp, t[e] = u.state);
  };
  let l = () => s.postMessage(void 0), c = () => s.close();
  return n && l(), { sync: l, unshare: c };
}
var dl = (e, t) => Object.keys(t).includes(e), fl = ({ initialize: e = !0, enable: t = !0, type: n }) => ({ store: o, options: r }) => {
  var s, a;
  let i = ((s = r == null ? void 0 : r.share) == null ? void 0 : s.enable) ?? t, l = ((a = r == null ? void 0 : r.share) == null ? void 0 : a.omit) ?? [];
  !i || Object.keys(o.$state).forEach((c) => {
    var u;
    l.includes(c) || !dl(c, o.$state) || ul(c, o, { initialize: ((u = r == null ? void 0 : r.share) == null ? void 0 : u.initialize) ?? e, type: n });
  });
};
const pl = ni();
pl.use(
  fl({
    enable: !0,
    initialize: !0
  })
);
si("data", () => {
  const e = V([]), t = V({});
  return { records: e, record: t };
});
const hl = /* @__PURE__ */ J({
  __name: "Doctype",
  setup(e) {
    const { stonecrop: t, isReady: n } = yo(), o = V([]);
    return de(n, () => {
      if (n.value) {
        let r = t.value.schema.schema.toArray();
        r.forEach((s, a) => {
          const l = t.value.store.record[s.fieldname];
          r[a].value = l;
        }), o.value = r;
      }
    }), (r, s) => b(n) ? ($(), ke(b(Xr), {
      key: 0,
      class: "aform-main",
      modelValue: o.value,
      "onUpdate:modelValue": s[0] || (s[0] = (a) => o.value = a)
    }, null, 8, ["modelValue"])) : Se("", !0);
  }
});
var Yn;
const dr = typeof window < "u", ml = (e) => typeof e == "string", gl = () => {
};
dr && (Yn = window == null ? void 0 : window.navigator) != null && Yn.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function fr(e) {
  return typeof e == "function" ? e() : b(e);
}
function vl(e) {
  return e;
}
function yl(e) {
  return ho() ? (mo(e), !0) : !1;
}
function Bt(e) {
  var t;
  const n = fr(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const pr = dr ? window : void 0;
function _l(...e) {
  let t, n, o, r;
  if (ml(e[0]) || Array.isArray(e[0]) ? ([n, o, r] = e, t = pr) : [t, n, o, r] = e, !t)
    return gl;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const s = [], a = () => {
    s.forEach((u) => u()), s.length = 0;
  }, i = (u, d, f, p) => (u.addEventListener(d, f, p), () => u.removeEventListener(d, f, p)), l = de(() => [Bt(t), fr(r)], ([u, d]) => {
    a(), u && s.push(...n.flatMap((f) => o.map((p) => i(u, f, p, d))));
  }, { immediate: !0, flush: "post" }), c = () => {
    l(), a();
  };
  return yl(c), c;
}
const Ut = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Ht = "__vueuse_ssr_handlers__";
Ut[Ht] = Ut[Ht] || {};
Ut[Ht];
function wl(e, { window: t = pr, scrollTarget: n } = {}) {
  const o = V(!1), r = () => {
    if (!t)
      return;
    const s = t.document, a = Bt(e);
    if (!a)
      o.value = !1;
    else {
      const i = a.getBoundingClientRect();
      o.value = i.top <= (t.innerHeight || s.documentElement.clientHeight) && i.left <= (t.innerWidth || s.documentElement.clientWidth) && i.bottom >= 0 && i.right >= 0;
    }
  };
  return de(() => Bt(e), () => r(), { immediate: !0, flush: "post" }), t && _l(n || t, "scroll", r, {
    capture: !1,
    passive: !0
  }), o;
}
var Xn;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(Xn || (Xn = {}));
var bl = Object.defineProperty, Zn = Object.getOwnPropertySymbols, El = Object.prototype.hasOwnProperty, Sl = Object.prototype.propertyIsEnumerable, eo = (e, t, n) => t in e ? bl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, kl = (e, t) => {
  for (var n in t || (t = {}))
    El.call(t, n) && eo(e, n, t[n]);
  if (Zn)
    for (var n of Zn(t))
      Sl.call(t, n) && eo(e, n, t[n]);
  return e;
};
const Ol = {
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
kl({
  linear: vl
}, Ol);
const fe = (e) => {
  let t = wl(e).value;
  return t = t && e.offsetHeight > 0, t;
}, pe = (e) => e.tabIndex >= 0, to = (e) => {
  const t = e.target;
  return cn(t);
}, cn = (e) => {
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
  return n && (!pe(n) || !fe(n)) ? cn(n) : n;
}, Il = (e) => {
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
  return o && (!pe(o) || !fe(o)) ? un(o) : o;
}, no = (e) => {
  const t = e.target;
  return un(t);
}, un = (e) => {
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
  return n && (!pe(n) || !fe(n)) ? un(n) : n;
}, Pl = (e) => {
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
  return o && (!pe(o) || !fe(o)) ? cn(o) : o;
}, oo = (e) => {
  const t = e.target;
  return dn(t);
}, dn = (e) => {
  var t;
  let n;
  if (e.previousElementSibling)
    n = e.previousElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    n = o == null ? void 0 : o.lastElementChild;
  }
  return n && (!pe(n) || !fe(n)) ? dn(n) : n;
}, ro = (e) => {
  const t = e.target;
  return fn(t);
}, fn = (e) => {
  var t;
  let n;
  if (e.nextElementSibling)
    n = e.nextElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    n = o == null ? void 0 : o.firstElementChild;
  }
  return n && (!pe(n) || !fe(n)) ? fn(n) : n;
}, so = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!pe(t) || !fe(t)) ? fn(t) : t;
}, ao = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!pe(t) || !fe(t)) ? dn(t) : t;
}, Ze = ["alt", "control", "shift", "meta"], $l = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, hr = {
  "keydown.up": (e) => {
    const t = to(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.down": (e) => {
    const t = no(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.left": (e) => {
    const t = oo(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.right": (e) => {
    const t = ro(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.control.up": (e) => {
    const t = Il(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = Pl(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.left": (e) => {
    const t = so(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.right": (e) => {
    const t = ao(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.end": (e) => {
    const t = ao(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = no(e);
      t && t.focus();
    }
  },
  "keydown.shift.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = to(e);
      t && t.focus();
    }
  },
  "keydown.home": (e) => {
    const t = so(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.tab": (e) => {
    const t = ro(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.shift.tab": (e) => {
    const t = oo(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  }
};
function mr(e) {
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
    const s = $l[r.key] || r.key.toLowerCase();
    if (Ze.includes(s))
      return;
    const a = o.handlers || hr;
    for (const i of Object.keys(a)) {
      const [l, ...c] = i.split(".");
      if (l === "keydown" && c.includes(s)) {
        const u = a[i], d = c.filter((p) => Ze.includes(p)), f = Ze.some((p) => {
          const m = p.charAt(0).toUpperCase() + p.slice(1);
          return r.getModifierState(m);
        });
        if (d.length > 0) {
          if (f) {
            for (const p of Ze)
              if (c.includes(p)) {
                const m = p.charAt(0).toUpperCase() + p.slice(1);
                r.getModifierState(m) && u(r);
              }
          }
        } else
          f || u(r);
      }
    }
  };
  Ft(() => {
    for (const o of e) {
      const r = t(o);
      for (const s of r)
        s.addEventListener("keydown", n(o));
    }
  }), Er(() => {
    for (const o of e) {
      const r = t(o);
      for (const s of r)
        s.removeEventListener("keydown", n(o));
    }
  });
}
const xl = ["data-colindex", "data-rowindex", "data-editable", "contenteditable", "tabindex"], Nl = { key: 1 }, Cl = /* @__PURE__ */ J({
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
    const n = e, o = K(n.tableid), r = V(null);
    let s = V(!1);
    const a = j(() => {
      const g = o.cellData(n.colIndex, n.rowIndex);
      if (o.columns[n.colIndex].format) {
        const y = o.columns[n.colIndex].format;
        return typeof y == "function" ? y(g) : typeof y == "string" ? Function(`"use strict";return (${y})`)()(g) : g;
      } else
        return g;
    }), i = (g) => {
      if (n.clickHandler) {
        n.clickHandler(g);
        return;
      }
      if (o.columns[n.colIndex].mask, o.columns[n.colIndex].modalComponent) {
        const y = r.value.getBoundingClientRect();
        o.modal.visible = !0, o.modal.colIndex = n.colIndex, o.modal.rowIndex = n.rowIndex, o.modal.parent = r.value, o.modal.top = y.top + y.height, o.modal.left = y.left, o.modal.width = c.value, o.modal.component = o.columns[n.colIndex].modalComponent, o.modal.componentProps = o.columns[n.colIndex].modalComponentProps;
      }
    };
    if (n.addNavigation) {
      let g = {
        ...hr,
        "keydown.f2": i,
        "keydown.alt.up": i,
        "keydown.alt.down": i,
        "keydown.alt.left": i,
        "keydown.alt.right": i
      };
      typeof n.addNavigation == "object" && (g = {
        ...g,
        ...n.addNavigation
      }), mr([
        {
          selectors: r,
          handlers: g
        }
      ]);
    }
    const l = j(() => o.columns[n.colIndex].align || "center"), c = j(() => o.columns[n.colIndex].width || "40ch");
    let u = "";
    const d = () => {
      r.value && (u = r.value.innerText);
    }, f = () => {
      r.value && r.value.innerHTML !== u && (u = r.value.innerText, r.value.dispatchEvent(new Event("change")), s.value = !0, o.columns[n.colIndex].format || o.setCellData(n.rowIndex, n.colIndex, u));
    }, p = (g, y) => y && g === 0 && y > 0 ? `${y}ch` : "inherit", m = {
      textAlign: l.value,
      width: c.value,
      backgroundColor: s.value ? "var(--cell-modified-color)" : "inherit",
      fontWeight: s.value ? "bold" : "inherit",
      paddingLeft: p(n.colIndex, (t = o.display[n.rowIndex]) == null ? void 0 : t.indent)
    };
    return (g, y) => ($(), A("td", {
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
      b(o).columns[e.colIndex].cellComponent ? ($(), ke(Wt(b(o).columns[e.colIndex].cellComponent), Qt({
        key: 0,
        value: b(a)
      }, b(o).columns[e.colIndex].cellComponentProps), null, 16, ["value"])) : ($(), A("span", Nl, ce(b(a)), 1))
    ], 40, xl));
  }
}), Ke = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, Rl = /* @__PURE__ */ Ke(Cl, [["__scopeId", "data-v-1738c6fc"]]), Al = ["tabindex"], Tl = {
  key: 0,
  tabIndex: -1,
  class: "list-index"
}, Dl = /* @__PURE__ */ J({
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
    go((l) => ({
      "6b10edcf": b(r)
    }));
    const n = K(t.tableid), o = V(null), r = n.numberedRowWidth.value, s = () => n.config.view !== "tree" ? "" : n.display[t.rowIndex].isRoot || n.display[t.rowIndex].isParent ? n.display[t.rowIndex].childrenOpen ? "-" : "+" : "", a = () => n.config.view !== "tree" || n.display[t.rowIndex].isRoot || n.display[t.rowIndex].open, i = (l) => {
      n.toggleRowExpand(l);
    };
    return t.addNavigation && mr([
      {
        selectors: o,
        handlers: t.addNavigation
      }
    ]), (l, c) => ct(($(), A("tr", {
      ref_key: "rowEl",
      ref: o,
      tabindex: e.tabIndex,
      class: "table-row"
    }, [
      b(n).config.view === "list" ? ($(), A("td", Tl, ce(e.rowIndex + 1), 1)) : b(n).config.view === "tree" ? ($(), A("td", {
        key: 1,
        tabIndex: -1,
        class: "tree-index",
        onClick: c[0] || (c[0] = (u) => i(e.rowIndex))
      }, ce(s()), 1)) : ve(l.$slots, "indexCell", { key: 2 }, void 0, !0),
      ve(l.$slots, "default", {}, void 0, !0)
    ], 8, Al)), [
      [Gt, a()]
    ]);
  }
}), Vl = /* @__PURE__ */ Ke(Dl, [["__scopeId", "data-v-c758303d"]]);
let et;
const Ml = new Uint8Array(16);
function Ll() {
  if (!et && (et = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !et))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return et(Ml);
}
const G = [];
for (let e = 0; e < 256; ++e)
  G.push((e + 256).toString(16).slice(1));
function jl(e, t = 0) {
  return (G[e[t + 0]] + G[e[t + 1]] + G[e[t + 2]] + G[e[t + 3]] + "-" + G[e[t + 4]] + G[e[t + 5]] + "-" + G[e[t + 6]] + G[e[t + 7]] + "-" + G[e[t + 8]] + G[e[t + 9]] + "-" + G[e[t + 10]] + G[e[t + 11]] + G[e[t + 12]] + G[e[t + 13]] + G[e[t + 14]] + G[e[t + 15]]).toLowerCase();
}
const Bl = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), io = {
  randomUUID: Bl
};
function gr(e, t, n) {
  if (io.randomUUID && !t && !e)
    return io.randomUUID();
  e = e || {};
  const o = e.random || (e.rng || Ll)();
  if (o[6] = o[6] & 15 | 64, o[8] = o[8] & 63 | 128, t) {
    n = n || 0;
    for (let r = 0; r < 16; ++r)
      t[n + r] = o[r];
    return t;
  }
  return jl(o);
}
class Ul {
  constructor(t, n, o, r, s, a) {
    this.id = t || gr(), this.rows = o, this.columns = ge(n), this.config = ge(r), this.table = s || ge(this.createTableObject()), this.display = this.createDisplayObject(a), this.modal = ge({ visible: !1 });
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
    return ge(n);
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
    let r = this.columns[n];
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
const Hl = { key: 0 }, Fl = {
  class: "atable-header-row",
  tabindex: "-1"
}, Gl = {
  key: 0,
  id: "header-index"
}, Wl = /* @__PURE__ */ J({
  __name: "ATableHeader",
  props: {
    columns: null,
    config: null,
    tableid: null
  },
  setup(e) {
    const t = e;
    go((s) => ({
      "1cb0fcc9": b(o)
    }));
    const n = K(t.tableid), o = n.numberedRowWidth.value, r = (s) => ({
      minWidth: s.width || "40ch",
      textAlign: s.align || "center",
      width: n.config.fullWidth ? "auto" : null
    });
    return (s, a) => e.columns.length ? ($(), A("thead", Hl, [
      T("tr", Fl, [
        b(n).zeroColumn ? ($(), A("th", Gl)) : Se("", !0),
        ($(!0), A(Ie, null, Pe(e.columns, (i, l) => ($(), A("th", {
          key: l,
          tabindex: "-1",
          style: le(r(i))
        }, [
          ve(s.$slots, "default", {}, () => [
            vo(ce(i.label || String.fromCharCode(l + 97).toUpperCase()), 1)
          ], !0)
        ], 4))), 128))
      ])
    ])) : Se("", !0);
  }
}), Ql = /* @__PURE__ */ Ke(Wl, [["__scopeId", "data-v-8a8d9cee"]]), zl = /* @__PURE__ */ J({
  __name: "ATableModal",
  props: {
    colIndex: null,
    rowIndex: null,
    tableid: null
  },
  setup(e) {
    K(e.tableid);
    const t = (n) => {
      n.stopPropagation();
    };
    return (n, o) => ($(), A("div", {
      ref: "amodal",
      class: "amodal",
      tabindex: "-1",
      onClick: t,
      onInput: t
    }, [
      ve(n.$slots, "default", {}, void 0, !0)
    ], 544));
  }
}), Kl = /* @__PURE__ */ Ke(zl, [["__scopeId", "data-v-8ac70767"]]), ql = /* @__PURE__ */ J({
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
    let o = n.modelValue ? n.modelValue : n.rows, r = new Ul(n.id, n.columns, o, n.config);
    tt(r.id, r), de(
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
        i && Fe().then(() => {
          const l = i.dataset.rowindex, c = i.dataset.colindex, u = document.querySelectorAll(`[data-rowindex='${l}'][data-colindex='${c}']`);
          u && u[0].focus();
        });
      }
    }), (a, i) => ($(), A("table", {
      class: "atable",
      style: le({ width: b(r).config.fullWidth ? "100%" : "auto" })
    }, [
      ve(a.$slots, "header", { data: b(r) }, () => [
        at(Ql, {
          columns: b(r).columns,
          config: b(r).config,
          tableid: b(r).id
        }, null, 8, ["columns", "config", "tableid"])
      ], !0),
      T("tbody", null, [
        ve(a.$slots, "body", { data: b(r) }, () => [
          ($(!0), A(Ie, null, Pe(b(r).rows, (l, c) => ($(), ke(Vl, {
            key: l.id || b(gr)(),
            row: l,
            rowIndex: c,
            tableid: b(r).id
          }, {
            default: it(() => [
              ($(!0), A(Ie, null, Pe(b(r).columns, (u, d) => ($(), ke(Rl, {
                key: `${d}:${c}`,
                tableid: b(r).id,
                col: u,
                spellcheck: "false",
                rowIndex: c,
                colIndex: d + (b(r).zeroColumn ? 0 : -1),
                component: u.cellComponent,
                style: le({
                  textAlign: (u == null ? void 0 : u.align) || "center",
                  minWidth: (u == null ? void 0 : u.width) || "40ch",
                  width: b(r).config.fullWidth ? "auto" : null
                })
              }, null, 8, ["tableid", "col", "rowIndex", "colIndex", "component", "style"]))), 128))
            ]),
            _: 2
          }, 1032, ["row", "rowIndex", "tableid"]))), 128))
        ], !0)
      ]),
      ve(a.$slots, "footer", { data: b(r) }, void 0, !0),
      ve(a.$slots, "modal", { data: b(r) }, () => [
        ct(at(Kl, {
          colIndex: b(r).modal.colIndex,
          rowIndex: b(r).modal.rowIndex,
          tableid: b(r).id,
          style: le({
            left: b(r).modal.left + "px",
            top: b(r).modal.top + "px",
            maxWidth: b(r).modal.width + "px"
          })
        }, {
          default: it(() => [
            ($(), ke(Wt(b(r).modal.component), Qt({
              key: `${b(r).modal.rowIndex}:${b(r).modal.colIndex}`,
              colIndex: b(r).modal.colIndex,
              rowIndex: b(r).modal.rowIndex,
              tableid: b(r).id
            }, b(r).modal.componentProps), null, 16, ["colIndex", "rowIndex", "tableid"]))
          ]),
          _: 1
        }, 8, ["colIndex", "rowIndex", "tableid", "style"]), [
          [Gt, b(r).modal.visible]
        ])
      ], !0)
    ], 4));
  }
}), Jl = /* @__PURE__ */ Ke(ql, [["__scopeId", "data-v-9137b4c3"]]), Yl = /* @__PURE__ */ J({
  __name: "Records",
  setup(e) {
    const { stonecrop: t, isReady: n } = yo(), o = { view: "list" };
    return (r, s) => b(n) ? ($(), ke(b(Jl), {
      key: 0,
      columns: b(t).schema.schema.toArray(),
      rows: b(t).store.records,
      config: o
    }, null, 8, ["columns", "rows"])) : Se("", !0);
  }
}), vr = (e) => (co("data-v-18bfde6e"), e = e(), uo(), e), Xl = { class: "tabs" }, Zl = ["onKeydown"], ec = { tabindex: "0" }, tc = ["onKeydown"], nc = {
  version: "1.1",
  id: "Capa_1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  x: "0px",
  y: "0px",
  viewBox: "0 0 424.098 424.098",
  style: { "enable-background": "new 0 0 424.098 424.098" },
  "xml:space": "preserve"
}, oc = /* @__PURE__ */ vr(() => /* @__PURE__ */ T("g", null, [
  /* @__PURE__ */ T("path", {
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
], -1)), rc = [
  oc
], sc = ["onKeydown"], ac = { tabindex: "0" }, ic = { style: { width: "11pt" } }, lc = /* @__PURE__ */ vr(() => /* @__PURE__ */ T("g", { transform: "matrix(-0.08088215,0,0,0.08088215,9.8016177,3.1263021e-6)" }, [
  /* @__PURE__ */ T("path", {
    d: "M 93.148438,80.832031 C 109.5,57.742188 104.03125,25.769531 80.941406,9.421875 57.851562,-6.925781 25.878906,-1.460938 9.53125,21.632812 -6.816406,44.722656 -1.351562,76.691406 21.742188,93.039062 38.222656,104.70703 60.011719,105.60547 77.394531,95.339844 l 37.769529,37.542966 c 4.07813,4.29297 10.86328,4.46485 15.15625,0.38672 4.29297,-4.07422 4.46485,-10.85937 0.39063,-15.15234 -0.12891,-0.13672 -0.25391,-0.26172 -0.39063,-0.39063 z m -41.839844,3.5 C 33.0625,84.335938 18.269531,69.554688 18.257812,51.308594 18.253906,33.0625 33.035156,18.269531 51.285156,18.261719 c 18.222656,-0.0078 33.007813,14.75 33.042969,32.972656 0.03125,18.25 -14.742187,33.066406 -32.996094,33.097656 -0.0078,0 -0.01172,0 -0.02344,0 z m 0,0",
    style: { fill: "#000000", "fill-opacity": "1", "fill-rule": "nonzero", stroke: "none" },
    id: "path2"
  })
], -1)), cc = [
  lc
], uc = /* @__PURE__ */ J({
  __name: "SheetNav",
  props: {
    breadcrumbs: null
  },
  setup(e) {
    const t = e, n = V([]), o = V(!0), r = V(!1), s = V(""), a = V(null), i = j(() => o.value ? "unrotated" : "rotated");
    Ft(() => {
      n.value = t.breadcrumbs || [];
    });
    const l = () => {
      o.value = !o.value;
    }, c = async () => {
      r.value = !r.value, await Fe(() => {
        a.value.focus();
      });
    }, u = (p) => {
      p.preventDefault(), p.stopPropagation();
    }, d = async (p) => {
      p.preventDefault(), p.stopPropagation(), await c();
    }, f = () => {
    };
    return (p, m) => {
      const g = Sr("router-link");
      return $(), A("footer", null, [
        T("ul", Xl, [
          T("li", {
            class: "hidebreadcrumbs",
            onClick: l,
            onKeydown: Je(l, ["enter"])
          }, [
            T("a", ec, [
              T("div", {
                class: lo(b(i))
              }, "×", 2)
            ])
          ], 40, Zl),
          T("li", {
            class: "hometab",
            onClick: f,
            onKeydown: Je(f, ["enter"]),
            style: le({ display: o.value ? "block" : "none" })
          }, [
            at(g, {
              to: "/home",
              tabindex: "0"
            }, {
              default: it(() => [
                ($(), A("svg", nc, rc))
              ]),
              _: 1
            })
          ], 44, tc),
          T("li", {
            class: "searchtab",
            onClick: c,
            onKeydown: Je(c, ["enter"]),
            style: le({ display: o.value ? "block" : "none" })
          }, [
            T("a", ac, [
              T("span", {
                style: le({ display: r.value ? "none" : "block" })
              }, [
                ($(), A("svg", ic, cc))
              ], 4),
              ct(T("input", {
                "onUpdate:modelValue": m[0] || (m[0] = (y) => s.value = y),
                ref_key: "searchinput",
                ref: a,
                style: le({ display: r.value ? "block" : "none" }),
                onClick: m[1] || (m[1] = (y) => u(y)),
                onInput: m[2] || (m[2] = (y) => u(y)),
                onBlur: m[3] || (m[3] = (y) => d(y)),
                onKeydown: m[4] || (m[4] = Je((y) => d(y), ["enter"])),
                type: "text"
              }, null, 36), [
                [kr, s.value]
              ])
            ])
          ], 44, sc),
          ($(!0), A(Ie, null, Pe(n.value, (y, O) => ($(), A("li", {
            key: O,
            style: le({ display: o.value ? "block" : "none" })
          }, [
            at(g, {
              tabindex: "0",
              to: y.to
            }, {
              default: it(() => [
                vo(ce(y.title), 1)
              ]),
              _: 2
            }, 1032, ["to"])
          ], 4))), 128))
        ])
      ]);
    };
  }
});
const dc = /* @__PURE__ */ Jt(uc, [["__scopeId", "data-v-18bfde6e"]]);
function mc(e) {
  e.component("ActionSet", jr), e.component("CommandPalette", Hr), e.component("Doctype", hl), e.component("Records", Yl), e.component("SheetNav", dc);
}
export {
  jr as ActionSet,
  Hr as CommandPalette,
  hl as Doctype,
  Yl as Records,
  dc as SheetNav,
  mc as install
};
//# sourceMappingURL=desktop.js.map
