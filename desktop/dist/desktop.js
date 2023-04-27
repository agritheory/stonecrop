import { defineComponent as q, ref as V, onMounted as Mt, openBlock as $, createElementBlock as A, normalizeClass as io, createElementVNode as T, Fragment as Oe, renderList as Pe, toDisplayString as le, createCommentVNode as ke, withDirectives as ct, vShow as Lt, pushScopeId as co, popScopeId as lo, inject as Z, computed as j, createBlock as Se, resolveDynamicComponent as jt, mergeProps as Bt, unref as b, effectScope as uo, markRaw as ae, onBeforeMount as vr, shallowRef as gr, toRaw as lt, getCurrentInstance as Ut, reactive as ve, watch as de, isRef as He, isReactive as Ht, toRef as yt, nextTick as Fe, getCurrentScope as fo, onScopeDispose as po, h as ho, provide as et, toRefs as ln, watchEffect as yr, normalizeStyle as ce, renderSlot as ge, createVNode as st, withCtx as at, useCssVars as mo, createTextVNode as vo, onBeforeUnmount as _r, resolveComponent as wr, withKeys as qe, vModelText as br } from "vue";
const Ft = (e) => (co("data-v-b7fdfbec"), e = e(), lo(), e), Er = { class: "action-menu-icon" }, kr = /* @__PURE__ */ Ft(() => /* @__PURE__ */ T("svg", {
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
], -1)), Sr = /* @__PURE__ */ Ft(() => /* @__PURE__ */ T("svg", {
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
], -1)), Ir = [
  kr,
  Sr
], Or = /* @__PURE__ */ Ft(() => /* @__PURE__ */ T("div", { style: { "margin-right": "30px" } }, null, -1)), Pr = ["onclick"], $r = { key: 1 }, xr = ["onClick"], Nr = { class: "dropdown-container" }, Cr = { class: "dropdown" }, Rr = ["onclick"], Ar = ["href"], Tr = { class: "dropdown-item" }, Dr = /* @__PURE__ */ q({
  __name: "ActionSet",
  props: {
    elements: null
  },
  setup(e) {
    const t = e, n = V([]), o = V(!1), r = V(null), s = V(!1), a = V(!1);
    Mt(() => {
      n.value = t.elements, i();
    });
    const i = () => {
      for (let d of n.value)
        d.elementType === "dropdown" && (d.show = !1);
    }, u = () => {
      s.value = !0, r.value = setTimeout(() => {
        s.value && (o.value = !0);
      }, 500);
    }, l = () => {
      s.value = !1, a.value = !1, clearTimeout(r.value), o.value = !1;
    }, c = (d) => {
      const f = !n.value[d].show;
      i(), n.value[d].show = f;
    };
    return (d, f) => ($(), A("div", {
      class: io([{ "open-set": o.value, "hovered-and-closed": a.value }, "action-set collapse"]),
      onMouseover: u,
      onMouseleave: l
    }, [
      T("div", Er, [
        T("div", {
          id: "chevron",
          onClick: f[0] || (f[0] = (p) => a.value = !a.value)
        }, Ir)
      ]),
      Or,
      ($(!0), A(Oe, null, Pe(n.value, (p, m) => ($(), A("div", {
        class: "action-element",
        key: m
      }, [
        p.elementType == "button" ? ($(), A("button", {
          key: 0,
          onclick: p.action,
          class: "button-default"
        }, le(p.label), 9, Pr)) : ke("", !0),
        p.elementType == "dropdown" ? ($(), A("div", $r, [
          T("button", {
            class: "button-default",
            onClick: (v) => c(m)
          }, le(p.label), 9, xr),
          ct(T("div", Nr, [
            T("div", Cr, [
              ($(!0), A(Oe, null, Pe(p.actions, (v) => ($(), A("div", {
                key: v.label
              }, [
                v.action != null ? ($(), A("button", {
                  key: 0,
                  onclick: v.action,
                  class: "dropdown-item"
                }, le(v.label), 9, Rr)) : v.link != null ? ($(), A("a", {
                  key: 1,
                  href: v.link
                }, [
                  T("button", Tr, le(v.label), 1)
                ], 8, Ar)) : ke("", !0)
              ]))), 128))
            ])
          ], 512), [
            [Lt, p.show]
          ])
        ])) : ke("", !0)
      ]))), 128))
    ], 34));
  }
});
const Wt = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, Vr = /* @__PURE__ */ Wt(Dr, [["__scopeId", "data-v-b7fdfbec"]]), Mr = {};
function Lr(e, t) {
  return $(), A("dialog");
}
const jr = /* @__PURE__ */ Wt(Mr, [["render", Lr]]), Br = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
};
var un;
const Ur = typeof window < "u";
Ur && (un = window == null ? void 0 : window.navigator) != null && un.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function Hr(e) {
  return e;
}
const dn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, fn = "__vueuse_ssr_handlers__";
dn[fn] = dn[fn] || {};
var pn;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(pn || (pn = {}));
var Fr = Object.defineProperty, hn = Object.getOwnPropertySymbols, Wr = Object.prototype.hasOwnProperty, Gr = Object.prototype.propertyIsEnumerable, mn = (e, t, n) => t in e ? Fr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, zr = (e, t) => {
  for (var n in t || (t = {}))
    Wr.call(t, n) && mn(e, n, t[n]);
  if (hn)
    for (var n of hn(t))
      Gr.call(t, n) && mn(e, n, t[n]);
  return e;
};
const Qr = {
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
zr({
  linear: Hr
}, Qr);
const Kr = /* @__PURE__ */ q({
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
      for (const [u, l] of Object.entries(a))
        ["component", "fieldtype"].includes(u) || (i[u] = l), u === "rows" && l && l.length === 0 && (i.rows = o.value[a.fieldname]);
      return i;
    }, s = j({
      get: () => n.modelValue.map((a, i) => j({
        get() {
          return a.value;
        },
        set: (u) => {
          n.modelValue[i].value = u, t("update:modelValue", n.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (a, i) => ($(), A("form", null, [
      ($(!0), A(Oe, null, Pe(e.modelValue, (u, l) => ($(), Se(jt(u.component), Bt({
        key: l,
        schema: u,
        modelValue: b(s)[l].value,
        "onUpdate:modelValue": (c) => b(s)[l].value = c,
        data: o.value[u.fieldname],
        readonly: e.readonly
      }, r(u)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
}), qr = /* @__PURE__ */ Br(Kr, [["__scopeId", "data-v-74d66cf2"]]), vn = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function Jr(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function Yr(e) {
  var t;
  let n = e.value;
  if (n) {
    const o = Jr(n);
    if (o) {
      const r = e.instance.locale;
      n = o(r);
    }
  } else {
    const o = (t = e.instance.schema.fieldtype) == null ? void 0 : t.toLowerCase();
    o && vn[o] && (n = vn[o]);
  }
  return n;
}
function Xr(e, t) {
  t || (t = "#");
  let n = e;
  const o = [t, "/", "-", "(", ")", " "];
  for (const r of o)
    n = n.replaceAll(r, "");
  return n;
}
function Zr(e, t, n) {
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
function es(e, t) {
  const n = Yr(t);
  if (!n)
    return;
  const o = "#", r = e.value, s = Xr(r, o);
  if (s) {
    const a = Zr(s, n, o);
    t.instance.maskFilled && (t.instance.maskFilled = !a.includes(o)), e.value = a;
  } else
    e.value = n;
}
q({
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
    const n = V(!1), o = Z("locale", "");
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
    mask: es
  }
});
let ts = class tt {
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
    if (this.name = "Stonecrop", tt._root)
      return tt._root;
    tt._root = this, this.registry = t, this.store = n, this.schema = o, this.workflow = r, this.actions = s;
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
var go = !1;
function Je(e, t, n) {
  return Array.isArray(e) ? (e.length = Math.max(e.length, t), e.splice(t, 1, n), n) : (e[t] = n, n);
}
function _t(e, t) {
  if (Array.isArray(e)) {
    e.splice(t, 1);
    return;
  }
  delete e[t];
}
function ns() {
  return yo().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function yo() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const os = typeof Proxy == "function", rs = "devtools-plugin:setup", ss = "plugin:settings:set";
let xe, Ot;
function as() {
  var e;
  return xe !== void 0 || (typeof window < "u" && window.performance ? (xe = !0, Ot = window.performance) : typeof global < "u" && (!((e = global.perf_hooks) === null || e === void 0) && e.performance) ? (xe = !0, Ot = global.perf_hooks.performance) : xe = !1), xe;
}
function is() {
  return as() ? Ot.now() : Date.now();
}
class cs {
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
        return is();
      }
    }, n && n.on(ss, (a, i) => {
      a === this.plugin.id && this.fallbacks.setSettings(i);
    }), this.proxiedOn = new Proxy({}, {
      get: (a, i) => this.target ? this.target.on[i] : (...u) => {
        this.onQueue.push({
          method: i,
          args: u
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (a, i) => this.target ? this.target[i] : i === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(i) ? (...u) => (this.targetQueue.push({
        method: i,
        args: u,
        resolve: () => {
        }
      }), this.fallbacks[i](...u)) : (...u) => new Promise((l) => {
        this.targetQueue.push({
          method: i,
          args: u,
          resolve: l
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
function Gt(e, t) {
  const n = e, o = yo(), r = ns(), s = os && n.enableEarlyProxy;
  if (r && (o.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !s))
    r.emit(rs, e, t);
  else {
    const a = s ? new cs(n, r) : null;
    (o.__VUE_DEVTOOLS_PLUGINS__ = o.__VUE_DEVTOOLS_PLUGINS__ || []).push({
      pluginDescriptor: n,
      setupFn: t,
      proxy: a
    }), a && t(a.proxiedTarget);
  }
}
/*!
  * pinia v2.0.35
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
let Le;
const We = (e) => Le = e, _o = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
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
const ut = typeof window < "u", je = (process.env.NODE_ENV !== "production" || !1) && process.env.NODE_ENV !== "test" && ut, gn = /* @__PURE__ */ (() => typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null })();
function ls(e, { autoBom: t = !1 } = {}) {
  return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob([String.fromCharCode(65279), e], { type: e.type }) : e;
}
function zt(e, t, n) {
  const o = new XMLHttpRequest();
  o.open("GET", e), o.responseType = "blob", o.onload = function() {
    Eo(o.response, t, n);
  }, o.onerror = function() {
    console.error("could not download file");
  }, o.send();
}
function wo(e) {
  const t = new XMLHttpRequest();
  t.open("HEAD", e, !1);
  try {
    t.send();
  } catch {
  }
  return t.status >= 200 && t.status <= 299;
}
function nt(e) {
  try {
    e.dispatchEvent(new MouseEvent("click"));
  } catch {
    const n = document.createEvent("MouseEvents");
    n.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), e.dispatchEvent(n);
  }
}
const ot = typeof navigator == "object" ? navigator : { userAgent: "" }, bo = /* @__PURE__ */ (() => /Macintosh/.test(ot.userAgent) && /AppleWebKit/.test(ot.userAgent) && !/Safari/.test(ot.userAgent))(), Eo = ut ? (
  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
  typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !bo ? us : (
    // Use msSaveOrOpenBlob as a second approach
    "msSaveOrOpenBlob" in ot ? ds : (
      // Fallback to using FileReader and a popup
      fs
    )
  )
) : () => {
};
function us(e, t = "download", n) {
  const o = document.createElement("a");
  o.download = t, o.rel = "noopener", typeof e == "string" ? (o.href = e, o.origin !== location.origin ? wo(o.href) ? zt(e, t, n) : (o.target = "_blank", nt(o)) : nt(o)) : (o.href = URL.createObjectURL(e), setTimeout(function() {
    URL.revokeObjectURL(o.href);
  }, 4e4), setTimeout(function() {
    nt(o);
  }, 0));
}
function ds(e, t = "download", n) {
  if (typeof e == "string")
    if (wo(e))
      zt(e, t, n);
    else {
      const o = document.createElement("a");
      o.href = e, o.target = "_blank", setTimeout(function() {
        nt(o);
      });
    }
  else
    navigator.msSaveOrOpenBlob(ls(e, n), t);
}
function fs(e, t, n, o) {
  if (o = o || open("", "_blank"), o && (o.document.title = o.document.body.innerText = "downloading..."), typeof e == "string")
    return zt(e, t, n);
  const r = e.type === "application/octet-stream", s = /constructor/i.test(String(gn.HTMLElement)) || "safari" in gn, a = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((a || r && s || bo) && typeof FileReader < "u") {
    const i = new FileReader();
    i.onloadend = function() {
      let u = i.result;
      if (typeof u != "string")
        throw o = null, new Error("Wrong reader.result type");
      u = a ? u : u.replace(/^data:[^;]*;/, "data:attachment/file;"), o ? o.location.href = u : location.assign(u), o = null;
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
function Qt(e) {
  return "_a" in e && "install" in e;
}
function ko() {
  if (!("clipboard" in navigator))
    return H("Your browser doesn't support the Clipboard API", "error"), !0;
}
function So(e) {
  return e instanceof Error && e.message.toLowerCase().includes("document is not focused") ? (H('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn"), !0) : !1;
}
async function ps(e) {
  if (!ko())
    try {
      await navigator.clipboard.writeText(JSON.stringify(e.state.value)), H("Global state copied to clipboard.");
    } catch (t) {
      if (So(t))
        return;
      H("Failed to serialize the state. Check the console for more details.", "error"), console.error(t);
    }
}
async function hs(e) {
  if (!ko())
    try {
      e.state.value = JSON.parse(await navigator.clipboard.readText()), H("Global state pasted from clipboard.");
    } catch (t) {
      if (So(t))
        return;
      H("Failed to deserialize the state from clipboard. Check the console for more details.", "error"), console.error(t);
    }
}
async function ms(e) {
  try {
    Eo(new Blob([JSON.stringify(e.state.value)], {
      type: "text/plain;charset=utf-8"
    }), "pinia-state.json");
  } catch (t) {
    H("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
let re;
function vs() {
  re || (re = document.createElement("input"), re.type = "file", re.accept = ".json");
  function e() {
    return new Promise((t, n) => {
      re.onchange = async () => {
        const o = re.files;
        if (!o)
          return t(null);
        const r = o.item(0);
        return t(r ? { text: await r.text(), file: r } : null);
      }, re.oncancel = () => t(null), re.onerror = n, re.click();
    });
  }
  return e;
}
async function gs(e) {
  try {
    const n = await (await vs())();
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
const Io = "🍍 Pinia (root)", Pt = "_root";
function ys(e) {
  return Qt(e) ? {
    id: Pt,
    label: Io
  } : {
    id: e.$id,
    label: e.$id
  };
}
function _s(e) {
  if (Qt(e)) {
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
          value: a._getters.reduce((i, u) => (i[u] = a[u], i), {})
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
function ws(e) {
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
function bs(e) {
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
let Re = !0;
const rt = [], be = "pinia:mutations", z = "pinia", { assign: Es } = Object, it = (e) => "🍍 " + e;
function ks(e, t) {
  Gt({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes: rt,
    app: e
  }, (n) => {
    typeof n.now != "function" && H("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."), n.addTimelineLayer({
      id: be,
      label: "Pinia 🍍",
      color: 15064968
    }), n.addInspector({
      id: z,
      label: "Pinia 🍍",
      icon: "storage",
      treeFilterPlaceholder: "Search stores",
      actions: [
        {
          icon: "content_copy",
          action: () => {
            ps(t);
          },
          tooltip: "Serialize and copy the state"
        },
        {
          icon: "content_paste",
          action: async () => {
            await hs(t), n.sendInspectorTree(z), n.sendInspectorState(z);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            ms(t);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await gs(t), n.sendInspectorTree(z), n.sendInspectorState(z);
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
            type: it(i.$id),
            key: "state",
            editable: !0,
            value: i._isOptionsAPI ? {
              _custom: {
                value: lt(i.$state),
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
              Object.keys(i.$state).reduce((u, l) => (u[l] = i.$state[l], u), {})
            )
          }), i._getters && i._getters.length && o.instanceData.state.push({
            type: it(i.$id),
            key: "getters",
            editable: !1,
            value: i._getters.reduce((u, l) => {
              try {
                u[l] = i[l];
              } catch (c) {
                u[l] = c;
              }
              return u;
            }, {})
          });
        });
      }
    }), n.on.getInspectorTree((o) => {
      if (o.app === e && o.inspectorId === z) {
        let r = [t];
        r = r.concat(Array.from(t._s.values())), o.rootNodes = (o.filter ? r.filter((s) => "$id" in s ? s.$id.toLowerCase().includes(o.filter.toLowerCase()) : Io.toLowerCase().includes(o.filter.toLowerCase())) : r).map(ys);
      }
    }), n.on.getInspectorState((o) => {
      if (o.app === e && o.inspectorId === z) {
        const r = o.nodeId === Pt ? t : t._s.get(o.nodeId);
        if (!r)
          return;
        r && (o.state = _s(r));
      }
    }), n.on.editInspectorState((o, r) => {
      if (o.app === e && o.inspectorId === z) {
        const s = o.nodeId === Pt ? t : t._s.get(o.nodeId);
        if (!s)
          return H(`store "${o.nodeId}" not found`, "error");
        const { path: a } = o;
        Qt(s) ? a.unshift("state") : (a.length !== 1 || !s._customProperties.has(a[0]) || a[0] in s.$state) && a.unshift("$state"), Re = !1, o.set(s, a, o.state.value), Re = !0;
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
        a[0] = "$state", Re = !1, o.set(s, a, o.state.value), Re = !0;
      }
    });
  });
}
function Ss(e, t) {
  rt.includes(it(t.$id)) || rt.push(it(t.$id)), Gt({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes: rt,
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
    t.$onAction(({ after: a, onError: i, name: u, args: l }) => {
      const c = Oo++;
      n.addTimelineEvent({
        layerId: be,
        event: {
          time: o(),
          title: "🛫 " + u,
          subtitle: "start",
          data: {
            store: ee(t.$id),
            action: ee(u),
            args: l
          },
          groupId: c
        }
      }), a((d) => {
        Ee = void 0, n.addTimelineEvent({
          layerId: be,
          event: {
            time: o(),
            title: "🛬 " + u,
            subtitle: "end",
            data: {
              store: ee(t.$id),
              action: ee(u),
              args: l,
              result: d
            },
            groupId: c
          }
        });
      }), i((d) => {
        Ee = void 0, n.addTimelineEvent({
          layerId: be,
          event: {
            time: o(),
            logType: "error",
            title: "💥 " + u,
            subtitle: "end",
            data: {
              store: ee(t.$id),
              action: ee(u),
              args: l,
              error: d
            },
            groupId: c
          }
        });
      });
    }, !0), t._customProperties.forEach((a) => {
      de(() => b(t[a]), (i, u) => {
        n.notifyComponentUpdate(), n.sendInspectorState(z), Re && n.addTimelineEvent({
          layerId: be,
          event: {
            time: o(),
            title: "Change",
            subtitle: a,
            data: {
              newValue: i,
              oldValue: u
            },
            groupId: Ee
          }
        });
      }, { deep: !0 });
    }), t.$subscribe(({ events: a, type: i }, u) => {
      if (n.notifyComponentUpdate(), n.sendInspectorState(z), !Re)
        return;
      const l = {
        time: o(),
        title: bs(i),
        data: Es({ store: ee(t.$id) }, ws(a)),
        groupId: Ee
      };
      Ee = void 0, i === oe.patchFunction ? l.subtitle = "⤵️" : i === oe.patchObject ? l.subtitle = "🧩" : a && !Array.isArray(a) && (l.subtitle = a.type), a && (l.data["rawEvent(s)"] = {
        _custom: {
          display: "DebuggerEvent",
          type: "object",
          tooltip: "raw DebuggerEvent[]",
          value: a
        }
      }), n.addTimelineEvent({
        layerId: be,
        event: l
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
      }), n.notifyComponentUpdate(), n.sendInspectorTree(z), n.sendInspectorState(z);
    });
    const { $dispose: s } = t;
    t.$dispose = () => {
      s(), n.notifyComponentUpdate(), n.sendInspectorTree(z), n.sendInspectorState(z), n.getSettings().logStoreChanges && H(`Disposed "${t.$id}" store 🗑`);
    }, n.notifyComponentUpdate(), n.sendInspectorTree(z), n.sendInspectorState(z), n.getSettings().logStoreChanges && H(`"${t.$id}" store installed 🆕`);
  });
}
let Oo = 0, Ee;
function yn(e, t) {
  const n = t.reduce((o, r) => (o[r] = lt(e)[r], o), {});
  for (const o in n)
    e[o] = function() {
      const r = Oo, s = new Proxy(e, {
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
function Is({ app: e, store: t, options: n }) {
  if (!t.$id.startsWith("__hot:")) {
    if (n.state && (t._isOptionsAPI = !0), typeof n.state == "function") {
      yn(
        // @ts-expect-error: can cast the store...
        t,
        Object.keys(n.actions)
      );
      const o = t._hotUpdate;
      lt(t)._hotUpdate = function(r) {
        o.apply(this, arguments), yn(t, Object.keys(r._hmrPayload.actions));
      };
    }
    Ss(
      e,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      t
    );
  }
}
function Os() {
  const e = uo(!0), t = e.run(() => V({}));
  let n = [], o = [];
  const r = ae({
    install(s) {
      We(r), r._a = s, s.provide(_o, r), s.config.globalProperties.$pinia = r, je && ks(s, r), o.forEach((a) => n.push(a)), o = [];
    },
    use(s) {
      return !this._a && !go ? o.push(s) : n.push(s), this;
    },
    _p: n,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return je && typeof Proxy < "u" && r.use(Is), r;
}
function Po(e, t) {
  for (const n in t) {
    const o = t[n];
    if (!(n in e))
      continue;
    const r = e[n];
    $e(r) && $e(o) && !He(o) && !Ht(o) ? e[n] = Po(r, o) : e[n] = o;
  }
  return e;
}
const $o = () => {
};
function _n(e, t, n, o = $o) {
  e.push(t);
  const r = () => {
    const s = e.indexOf(t);
    s > -1 && (e.splice(s, 1), o());
  };
  return !n && fo() && po(r), r;
}
function Ne(e, ...t) {
  e.slice().forEach((n) => {
    n(...t);
  });
}
function $t(e, t) {
  e instanceof Map && t instanceof Map && t.forEach((n, o) => e.set(o, n)), e instanceof Set && t instanceof Set && t.forEach(e.add, e);
  for (const n in t) {
    if (!t.hasOwnProperty(n))
      continue;
    const o = t[n], r = e[n];
    $e(r) && $e(o) && e.hasOwnProperty(n) && !He(o) && !Ht(o) ? e[n] = $t(r, o) : e[n] = o;
  }
  return e;
}
const Ps = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
);
function $s(e) {
  return !$e(e) || !e.hasOwnProperty(Ps);
}
const { assign: X } = Object;
function wn(e) {
  return !!(He(e) && e.effect);
}
function bn(e, t, n, o) {
  const { state: r, actions: s, getters: a } = t, i = n.state.value[e];
  let u;
  function l() {
    !i && (process.env.NODE_ENV === "production" || !o) && (n.state.value[e] = r ? r() : {});
    const c = process.env.NODE_ENV !== "production" && o ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      ln(V(r ? r() : {}).value)
    ) : ln(n.state.value[e]);
    return X(c, s, Object.keys(a || {}).reduce((d, f) => (process.env.NODE_ENV !== "production" && f in c && console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${f}" in store "${e}".`), d[f] = ae(j(() => {
      We(n);
      const p = n._s.get(e);
      return a[f].call(p, p);
    })), d), {}));
  }
  return u = xt(e, l, t, n, o, !0), u;
}
function xt(e, t, n = {}, o, r, s) {
  let a;
  const i = X({ actions: {} }, n);
  if (process.env.NODE_ENV !== "production" && !o._e.active)
    throw new Error("Pinia destroyed");
  const u = {
    deep: !0
    // flush: 'post',
  };
  process.env.NODE_ENV !== "production" && !go && (u.onTrigger = (k) => {
    l ? p = k : l == !1 && !S._hotUpdating && (Array.isArray(p) ? p.push(k) : console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug."));
  });
  let l, c, d = ae([]), f = ae([]), p;
  const m = o.state.value[e];
  !s && !m && (process.env.NODE_ENV === "production" || !r) && (o.state.value[e] = {});
  const v = V({});
  let y;
  function I(k) {
    let _;
    l = c = !1, process.env.NODE_ENV !== "production" && (p = []), typeof k == "function" ? (k(o.state.value[e]), _ = {
      type: oe.patchFunction,
      storeId: e,
      events: p
    }) : ($t(o.state.value[e], k), _ = {
      type: oe.patchObject,
      payload: k,
      storeId: e,
      events: p
    });
    const D = y = Symbol();
    Fe().then(() => {
      y === D && (l = !0);
    }), c = !0, Ne(d, _, o.state.value[e]);
  }
  const O = s ? function() {
    const { state: _ } = n, D = _ ? _() : {};
    this.$patch((B) => {
      X(B, D);
    });
  } : (
    /* istanbul ignore next */
    process.env.NODE_ENV !== "production" ? () => {
      throw new Error(`🍍: Store "${e}" is built using the setup syntax and does not implement $reset().`);
    } : $o
  );
  function M() {
    a.stop(), d = [], f = [], o._s.delete(e);
  }
  function F(k, _) {
    return function() {
      We(o);
      const D = Array.from(arguments), B = [], _e = [];
      function De(G) {
        B.push(G);
      }
      function Ke(G) {
        _e.push(G);
      }
      Ne(f, {
        args: D,
        name: k,
        store: S,
        after: De,
        onError: Ke
      });
      let ne;
      try {
        ne = _.apply(this && this.$id === e ? this : S, D);
      } catch (G) {
        throw Ne(_e, G), G;
      }
      return ne instanceof Promise ? ne.then((G) => (Ne(B, G), G)).catch((G) => (Ne(_e, G), Promise.reject(G))) : (Ne(B, ne), ne);
    };
  }
  const J = /* @__PURE__ */ ae({
    actions: {},
    getters: {},
    state: [],
    hotState: v
  }), Y = {
    _p: o,
    // _s: scope,
    $id: e,
    $onAction: _n.bind(null, f),
    $patch: I,
    $reset: O,
    $subscribe(k, _ = {}) {
      const D = _n(d, k, _.detached, () => B()), B = a.run(() => de(() => o.state.value[e], (_e) => {
        (_.flush === "sync" ? c : l) && k({
          storeId: e,
          type: oe.direct,
          events: p
        }, _e);
      }, X({}, u, _)));
      return D;
    },
    $dispose: M
  }, S = ve(process.env.NODE_ENV !== "production" || je ? X(
    {
      _hmrPayload: J,
      _customProperties: ae(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    Y
    // must be added later
    // setupStore
  ) : Y);
  o._s.set(e, S);
  const te = o._e.run(() => (a = uo(), a.run(() => t())));
  for (const k in te) {
    const _ = te[k];
    if (He(_) && !wn(_) || Ht(_))
      process.env.NODE_ENV !== "production" && r ? Je(v.value, k, yt(te, k)) : s || (m && $s(_) && (He(_) ? _.value = m[k] : $t(_, m[k])), o.state.value[e][k] = _), process.env.NODE_ENV !== "production" && J.state.push(k);
    else if (typeof _ == "function") {
      const D = process.env.NODE_ENV !== "production" && r ? _ : F(k, _);
      te[k] = D, process.env.NODE_ENV !== "production" && (J.actions[k] = _), i.actions[k] = _;
    } else
      process.env.NODE_ENV !== "production" && wn(_) && (J.getters[k] = s ? (
        // @ts-expect-error
        n.getters[k]
      ) : _, ut && (te._getters || // @ts-expect-error: same
      (te._getters = ae([]))).push(k));
  }
  if (X(S, te), X(lt(S), te), Object.defineProperty(S, "$state", {
    get: () => process.env.NODE_ENV !== "production" && r ? v.value : o.state.value[e],
    set: (k) => {
      if (process.env.NODE_ENV !== "production" && r)
        throw new Error("cannot set hotState");
      I((_) => {
        X(_, k);
      });
    }
  }), process.env.NODE_ENV !== "production" && (S._hotUpdate = ae((k) => {
    S._hotUpdating = !0, k._hmrPayload.state.forEach((_) => {
      if (_ in S.$state) {
        const D = k.$state[_], B = S.$state[_];
        typeof D == "object" && $e(D) && $e(B) ? Po(D, B) : k.$state[_] = B;
      }
      Je(S, _, yt(k.$state, _));
    }), Object.keys(S.$state).forEach((_) => {
      _ in k.$state || _t(S, _);
    }), l = !1, c = !1, o.state.value[e] = yt(k._hmrPayload, "hotState"), c = !0, Fe().then(() => {
      l = !0;
    });
    for (const _ in k._hmrPayload.actions) {
      const D = k[_];
      Je(S, _, F(_, D));
    }
    for (const _ in k._hmrPayload.getters) {
      const D = k._hmrPayload.getters[_], B = s ? (
        // special handling of options api
        j(() => (We(o), D.call(S, S)))
      ) : D;
      Je(S, _, B);
    }
    Object.keys(S._hmrPayload.getters).forEach((_) => {
      _ in k._hmrPayload.getters || _t(S, _);
    }), Object.keys(S._hmrPayload.actions).forEach((_) => {
      _ in k._hmrPayload.actions || _t(S, _);
    }), S._hmrPayload = k._hmrPayload, S._getters = k._getters, S._hotUpdating = !1;
  })), je) {
    const k = {
      writable: !0,
      configurable: !0,
      // avoid warning on devtools trying to display this property
      enumerable: !1
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((_) => {
      Object.defineProperty(S, _, X({ value: S[_] }, k));
    });
  }
  return o._p.forEach((k) => {
    if (je) {
      const _ = a.run(() => k({
        store: S,
        app: o._a,
        pinia: o,
        options: i
      }));
      Object.keys(_ || {}).forEach((D) => S._customProperties.add(D)), X(S, _);
    } else
      X(S, a.run(() => k({
        store: S,
        app: o._a,
        pinia: o,
        options: i
      })));
  }), process.env.NODE_ENV !== "production" && S.$state && typeof S.$state == "object" && typeof S.$state.constructor == "function" && !S.$state.constructor.toString().includes("[native code]") && console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${S.$id}".`), m && s && n.hydrate && n.hydrate(S.$state, m), l = !0, c = !0, S;
}
function xs(e, t, n) {
  let o, r;
  const s = typeof t == "function";
  typeof e == "string" ? (o = e, r = s ? n : t) : (r = e, o = e.id);
  function a(i, u) {
    const l = Ut();
    if (i = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (process.env.NODE_ENV === "test" && Le && Le._testing ? null : i) || l && Z(_o, null), i && We(i), process.env.NODE_ENV !== "production" && !Le)
      throw new Error(`[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?
	const pinia = createPinia()
	app.use(pinia)
This will fail in production.`);
    i = Le, i._s.has(o) || (s ? xt(o, t, r, i) : bn(o, r, i), process.env.NODE_ENV !== "production" && (a._pinia = i));
    const c = i._s.get(o);
    if (process.env.NODE_ENV !== "production" && u) {
      const d = "__hot:" + o, f = s ? xt(d, t, r, i, !0) : bn(d, X({}, r), i, !0);
      u._hotUpdate(f), delete i.state.value[d], i._s.delete(d);
    }
    if (process.env.NODE_ENV !== "production" && ut && l && l.proxy && // avoid adding stores that are just built for hot module replacement
    !u) {
      const d = l.proxy, f = "_pStores" in d ? d._pStores : d._pStores = {};
      f[o] = c;
    }
    return c;
  }
  return a.$id = o, a;
}
const Ns = xs("data", () => {
  const e = V([]), t = V({});
  return { records: e, record: t };
});
function xo(e) {
  e || (e = Z("$registry"));
  const t = Ns(), n = V(new ts(e, t)), o = V(!1);
  return vr(async () => {
    var r, s;
    const a = e.router.currentRoute.value, i = (r = a.params.records) == null ? void 0 : r.toString().toLowerCase(), u = (s = a.params.record) == null ? void 0 : s.toString().toLowerCase();
    if (!i && !u)
      return;
    const l = await e.doctypeLoader(i);
    e.addDoctype(l), n.value.setup(l), i && (u ? await n.value.getRecord(l, u) : await n.value.getRecords(l)), n.value.runAction(l, "LOAD", u ? [u] : void 0), o.value = !0;
  }), { stonecrop: n, isReady: o };
}
/*!
  * vue-router v4.1.6
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
const ie = typeof window < "u";
function Cs(e) {
  return e.__esModule || e[Symbol.toStringTag] === "Module";
}
const R = Object.assign;
function wt(e, t) {
  const n = {};
  for (const o in t) {
    const r = t[o];
    n[o] = K(r) ? r.map(e) : e(r);
  }
  return n;
}
const Be = () => {
}, K = Array.isArray;
function N(e) {
  const t = Array.from(arguments).slice(1);
  console.warn.apply(console, ["[Vue Router warn]: " + e].concat(t));
}
const Rs = /\/$/, As = (e) => e.replace(Rs, "");
function bt(e, t, n = "/") {
  let o, r = {}, s = "", a = "";
  const i = t.indexOf("#");
  let u = t.indexOf("?");
  return i < u && i >= 0 && (u = -1), u > -1 && (o = t.slice(0, u), s = t.slice(u + 1, i > -1 ? i : t.length), r = e(s)), i > -1 && (o = o || t.slice(0, i), a = t.slice(i, t.length)), o = Vs(o ?? t, n), {
    fullPath: o + (s && "?") + s + a,
    path: o,
    query: r,
    hash: a
  };
}
function Ts(e, t) {
  const n = t.query ? e(t.query) : "";
  return t.path + (n && "?") + n + (t.hash || "");
}
function En(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || "/";
}
function kn(e, t, n) {
  const o = t.matched.length - 1, r = n.matched.length - 1;
  return o > -1 && o === r && ye(t.matched[o], n.matched[r]) && No(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function ye(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t);
}
function No(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (!Ds(e[n], t[n]))
      return !1;
  return !0;
}
function Ds(e, t) {
  return K(e) ? Sn(e, t) : K(t) ? Sn(t, e) : e === t;
}
function Sn(e, t) {
  return K(t) ? e.length === t.length && e.every((n, o) => n === t[o]) : e.length === 1 && e[0] === t;
}
function Vs(e, t) {
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
var Ge;
(function(e) {
  e.pop = "pop", e.push = "push";
})(Ge || (Ge = {}));
var Ue;
(function(e) {
  e.back = "back", e.forward = "forward", e.unknown = "";
})(Ue || (Ue = {}));
function Ms(e) {
  if (!e)
    if (ie) {
      const t = document.querySelector("base");
      e = t && t.getAttribute("href") || "/", e = e.replace(/^\w+:\/\/[^\/]+/, "");
    } else
      e = "/";
  return e[0] !== "/" && e[0] !== "#" && (e = "/" + e), As(e);
}
const Ls = /^[^#]+#/;
function js(e, t) {
  return e.replace(Ls, "#") + t;
}
function Bs(e, t) {
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
function Us(e) {
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
    t = Bs(r, e);
  } else
    t = e;
  "scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left != null ? t.left : window.pageXOffset, t.top != null ? t.top : window.pageYOffset);
}
function In(e, t) {
  return (history.state ? history.state.position - t : -1) + e;
}
const Nt = /* @__PURE__ */ new Map();
function Hs(e, t) {
  Nt.set(e, t);
}
function Fs(e) {
  const t = Nt.get(e);
  return Nt.delete(e), t;
}
let Ws = () => location.protocol + "//" + location.host;
function Co(e, t) {
  const { pathname: n, search: o, hash: r } = t, s = e.indexOf("#");
  if (s > -1) {
    let i = r.includes(e.slice(s)) ? e.slice(s).length : 1, u = r.slice(i);
    return u[0] !== "/" && (u = "/" + u), En(u, "");
  }
  return En(n, e) + o + r;
}
function Gs(e, t, n, o) {
  let r = [], s = [], a = null;
  const i = ({ state: f }) => {
    const p = Co(e, location), m = n.value, v = t.value;
    let y = 0;
    if (f) {
      if (n.value = p, t.value = f, a && a === m) {
        a = null;
        return;
      }
      y = v ? f.position - v.position : 0;
    } else
      o(p);
    r.forEach((I) => {
      I(n.value, m, {
        delta: y,
        type: Ge.pop,
        direction: y ? y > 0 ? Ue.forward : Ue.back : Ue.unknown
      });
    });
  };
  function u() {
    a = n.value;
  }
  function l(f) {
    r.push(f);
    const p = () => {
      const m = r.indexOf(f);
      m > -1 && r.splice(m, 1);
    };
    return s.push(p), p;
  }
  function c() {
    const { history: f } = window;
    f.state && f.replaceState(R({}, f.state, { scroll: dt() }), "");
  }
  function d() {
    for (const f of s)
      f();
    s = [], window.removeEventListener("popstate", i), window.removeEventListener("beforeunload", c);
  }
  return window.addEventListener("popstate", i), window.addEventListener("beforeunload", c), {
    pauseListeners: u,
    listen: l,
    destroy: d
  };
}
function On(e, t, n, o = !1, r = !1) {
  return {
    back: e,
    current: t,
    forward: n,
    replaced: o,
    position: window.history.length,
    scroll: r ? dt() : null
  };
}
function zs(e) {
  const { history: t, location: n } = window, o = {
    value: Co(e, n)
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
  function s(u, l, c) {
    const d = e.indexOf("#"), f = d > -1 ? (n.host && document.querySelector("base") ? e : e.slice(d)) + u : Ws() + e + u;
    try {
      t[c ? "replaceState" : "pushState"](l, "", f), r.value = l;
    } catch (p) {
      process.env.NODE_ENV !== "production" ? N("Error with push/replace State", p) : console.error(p), n[c ? "replace" : "assign"](f);
    }
  }
  function a(u, l) {
    const c = R({}, t.state, On(
      r.value.back,
      // keep back and forward entries but override current position
      u,
      r.value.forward,
      !0
    ), l, { position: r.value.position });
    s(u, c, !0), o.value = u;
  }
  function i(u, l) {
    const c = R(
      {},
      // use current history state to gracefully handle a wrong call to
      // history.replaceState
      // https://github.com/vuejs/router/issues/366
      r.value,
      t.state,
      {
        forward: u,
        scroll: dt()
      }
    );
    process.env.NODE_ENV !== "production" && !t.state && N(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:

history.replaceState(history.state, '', url)

You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`), s(c.current, c, !0);
    const d = R({}, On(o.value, u, null), { position: c.position + 1 }, l);
    s(u, d, !1), o.value = u;
  }
  return {
    location: o,
    state: r,
    push: i,
    replace: a
  };
}
function Qs(e) {
  e = Ms(e);
  const t = zs(e), n = Gs(e, t.state, t.location, t.replace);
  function o(s, a = !0) {
    a || n.pauseListeners(), history.go(s);
  }
  const r = R({
    // it's overridden right after
    location: "",
    base: e,
    go: o,
    createHref: js.bind(null, e)
  }, t, n);
  return Object.defineProperty(r, "location", {
    enumerable: !0,
    get: () => t.location.value
  }), Object.defineProperty(r, "state", {
    enumerable: !0,
    get: () => t.state.value
  }), r;
}
function Ks(e) {
  return typeof e == "string" || e && typeof e == "object";
}
function Ro(e) {
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
var Pn;
(function(e) {
  e[e.aborted = 4] = "aborted", e[e.cancelled = 8] = "cancelled", e[e.duplicated = 16] = "duplicated";
})(Pn || (Pn = {}));
const qs = {
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
    return `Redirected from "${e.fullPath}" to "${Ys(t)}" via a navigation guard.`;
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
function Te(e, t) {
  return process.env.NODE_ENV !== "production" ? R(new Error(qs[e](t)), {
    type: e,
    [Ct]: !0
  }, t) : R(new Error(), {
    type: e,
    [Ct]: !0
  }, t);
}
function se(e, t) {
  return e instanceof Error && Ct in e && (t == null || !!(e.type & t));
}
const Js = ["params", "query", "hash"];
function Ys(e) {
  if (typeof e == "string")
    return e;
  if ("path" in e)
    return e.path;
  const t = {};
  for (const n of Js)
    n in e && (t[n] = e[n]);
  return JSON.stringify(t, null, 2);
}
const $n = "[^/]+?", Xs = {
  sensitive: !1,
  strict: !1,
  start: !0,
  end: !0
}, Zs = /[.+*?^${}()[\]/\\]/g;
function ea(e, t) {
  const n = R({}, Xs, t), o = [];
  let r = n.start ? "^" : "";
  const s = [];
  for (const l of e) {
    const c = l.length ? [] : [
      90
      /* PathScore.Root */
    ];
    n.strict && !l.length && (r += "/");
    for (let d = 0; d < l.length; d++) {
      const f = l[d];
      let p = 40 + (n.sensitive ? 0.25 : 0);
      if (f.type === 0)
        d || (r += "/"), r += f.value.replace(Zs, "\\$&"), p += 40;
      else if (f.type === 1) {
        const { value: m, repeatable: v, optional: y, regexp: I } = f;
        s.push({
          name: m,
          repeatable: v,
          optional: y
        });
        const O = I || $n;
        if (O !== $n) {
          p += 10;
          try {
            new RegExp(`(${O})`);
          } catch (F) {
            throw new Error(`Invalid custom RegExp for param "${m}" (${O}): ` + F.message);
          }
        }
        let M = v ? `((?:${O})(?:/(?:${O}))*)` : `(${O})`;
        d || (M = // avoid an optional / if there are more segments e.g. /:p?-static
        // or /:p?-:p2
        y && l.length < 2 ? `(?:/${M})` : "/" + M), y && (M += "?"), r += M, p += 20, y && (p += -8), v && (p += -20), O === ".*" && (p += -50);
      }
      c.push(p);
    }
    o.push(c);
  }
  if (n.strict && n.end) {
    const l = o.length - 1;
    o[l][o[l].length - 1] += 0.7000000000000001;
  }
  n.strict || (r += "/?"), n.end ? r += "$" : n.strict && (r += "(?:/|$)");
  const a = new RegExp(r, n.sensitive ? "" : "i");
  function i(l) {
    const c = l.match(a), d = {};
    if (!c)
      return null;
    for (let f = 1; f < c.length; f++) {
      const p = c[f] || "", m = s[f - 1];
      d[m.name] = p && m.repeatable ? p.split("/") : p;
    }
    return d;
  }
  function u(l) {
    let c = "", d = !1;
    for (const f of e) {
      (!d || !c.endsWith("/")) && (c += "/"), d = !1;
      for (const p of f)
        if (p.type === 0)
          c += p.value;
        else if (p.type === 1) {
          const { value: m, repeatable: v, optional: y } = p, I = m in l ? l[m] : "";
          if (K(I) && !v)
            throw new Error(`Provided param "${m}" is an array but it is not repeatable (* or + modifiers)`);
          const O = K(I) ? I.join("/") : I;
          if (!O)
            if (y)
              f.length < 2 && (c.endsWith("/") ? c = c.slice(0, -1) : d = !0);
            else
              throw new Error(`Missing required param "${m}"`);
          c += O;
        }
    }
    return c || "/";
  }
  return {
    re: a,
    score: o,
    keys: s,
    parse: i,
    stringify: u
  };
}
function ta(e, t) {
  let n = 0;
  for (; n < e.length && n < t.length; ) {
    const o = t[n] - e[n];
    if (o)
      return o;
    n++;
  }
  return e.length < t.length ? e.length === 1 && e[0] === 40 + 40 ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === 40 + 40 ? 1 : -1 : 0;
}
function na(e, t) {
  let n = 0;
  const o = e.score, r = t.score;
  for (; n < o.length && n < r.length; ) {
    const s = ta(o[n], r[n]);
    if (s)
      return s;
    n++;
  }
  if (Math.abs(r.length - o.length) === 1) {
    if (xn(o))
      return 1;
    if (xn(r))
      return -1;
  }
  return r.length - o.length;
}
function xn(e) {
  const t = e[e.length - 1];
  return e.length > 0 && t[t.length - 1] < 0;
}
const oa = {
  type: 0,
  value: ""
}, ra = /[a-zA-Z0-9_]/;
function sa(e) {
  if (!e)
    return [[]];
  if (e === "/")
    return [[oa]];
  if (!e.startsWith("/"))
    throw new Error(process.env.NODE_ENV !== "production" ? `Route paths should start with a "/": "${e}" should be "/${e}".` : `Invalid path "${e}"`);
  function t(p) {
    throw new Error(`ERR (${n})/"${l}": ${p}`);
  }
  let n = 0, o = n;
  const r = [];
  let s;
  function a() {
    s && r.push(s), s = [];
  }
  let i = 0, u, l = "", c = "";
  function d() {
    l && (n === 0 ? s.push({
      type: 0,
      value: l
    }) : n === 1 || n === 2 || n === 3 ? (s.length > 1 && (u === "*" || u === "+") && t(`A repeatable param (${l}) must be alone in its segment. eg: '/:ids+.`), s.push({
      type: 1,
      value: l,
      regexp: c,
      repeatable: u === "*" || u === "+",
      optional: u === "*" || u === "?"
    })) : t("Invalid state to consume buffer"), l = "");
  }
  function f() {
    l += u;
  }
  for (; i < e.length; ) {
    if (u = e[i++], u === "\\" && n !== 2) {
      o = n, n = 4;
      continue;
    }
    switch (n) {
      case 0:
        u === "/" ? (l && d(), a()) : u === ":" ? (d(), n = 1) : f();
        break;
      case 4:
        f(), n = o;
        break;
      case 1:
        u === "(" ? n = 2 : ra.test(u) ? f() : (d(), n = 0, u !== "*" && u !== "?" && u !== "+" && i--);
        break;
      case 2:
        u === ")" ? c[c.length - 1] == "\\" ? c = c.slice(0, -1) + u : n = 3 : c += u;
        break;
      case 3:
        d(), n = 0, u !== "*" && u !== "?" && u !== "+" && i--, c = "";
        break;
      default:
        t("Unknown state");
        break;
    }
  }
  return n === 2 && t(`Unfinished custom RegExp for param "${l}"`), d(), a(), r;
}
function aa(e, t, n) {
  const o = ea(sa(e.path), n);
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
function ia(e, t) {
  const n = [], o = /* @__PURE__ */ new Map();
  t = Rn({ strict: !1, end: !0, sensitive: !1 }, t);
  function r(c) {
    return o.get(c);
  }
  function s(c, d, f) {
    const p = !f, m = ca(c);
    process.env.NODE_ENV !== "production" && fa(m, d), m.aliasOf = f && f.record;
    const v = Rn(t, c), y = [
      m
    ];
    if ("alias" in c) {
      const M = typeof c.alias == "string" ? [c.alias] : c.alias;
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
    let I, O;
    for (const M of y) {
      const { path: F } = M;
      if (d && F[0] !== "/") {
        const J = d.record.path, Y = J[J.length - 1] === "/" ? "" : "/";
        M.path = d.record.path + (F && Y + F);
      }
      if (process.env.NODE_ENV !== "production" && M.path === "*")
        throw new Error(`Catch all routes ("*") must now be defined using a param with a custom regexp.
See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.`);
      if (I = aa(M, d, v), process.env.NODE_ENV !== "production" && d && F[0] === "/" && pa(I, d), f ? (f.alias.push(I), process.env.NODE_ENV !== "production" && da(f, I)) : (O = O || I, O !== I && O.alias.push(I), p && c.name && !Cn(I) && a(c.name)), m.children) {
        const J = m.children;
        for (let Y = 0; Y < J.length; Y++)
          s(J[Y], I, f && f.children[Y]);
      }
      f = f || I, (I.record.components && Object.keys(I.record.components).length || I.record.name || I.record.redirect) && u(I);
    }
    return O ? () => {
      a(O);
    } : Be;
  }
  function a(c) {
    if (Ro(c)) {
      const d = o.get(c);
      d && (o.delete(c), n.splice(n.indexOf(d), 1), d.children.forEach(a), d.alias.forEach(a));
    } else {
      const d = n.indexOf(c);
      d > -1 && (n.splice(d, 1), c.record.name && o.delete(c.record.name), c.children.forEach(a), c.alias.forEach(a));
    }
  }
  function i() {
    return n;
  }
  function u(c) {
    let d = 0;
    for (; d < n.length && na(c, n[d]) >= 0 && // Adding children with empty path should still appear before the parent
    // https://github.com/vuejs/router/issues/1124
    (c.record.path !== n[d].record.path || !Ao(c, n[d])); )
      d++;
    n.splice(d, 0, c), c.record.name && !Cn(c) && o.set(c.record.name, c);
  }
  function l(c, d) {
    let f, p = {}, m, v;
    if ("name" in c && c.name) {
      if (f = o.get(c.name), !f)
        throw Te(1, {
          location: c
        });
      if (process.env.NODE_ENV !== "production") {
        const O = Object.keys(c.params || {}).filter((M) => !f.keys.find((F) => F.name === M));
        O.length && N(`Discarded invalid param(s) "${O.join('", "')}" when navigating. See https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22 for more details.`);
      }
      v = f.record.name, p = R(
        // paramsFromLocation is a new object
        Nn(
          d.params,
          // only keep params that exist in the resolved location
          // TODO: only keep optional params coming from a parent record
          f.keys.filter((O) => !O.optional).map((O) => O.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        c.params && Nn(c.params, f.keys.map((O) => O.name))
      ), m = f.stringify(p);
    } else if ("path" in c)
      m = c.path, process.env.NODE_ENV !== "production" && !m.startsWith("/") && N(`The Matcher cannot resolve relative paths but received "${m}". Unless you directly called \`matcher.resolve("${m}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`), f = n.find((O) => O.re.test(m)), f && (p = f.parse(m), v = f.record.name);
    else {
      if (f = d.name ? o.get(d.name) : n.find((O) => O.re.test(d.path)), !f)
        throw Te(1, {
          location: c,
          currentLocation: d
        });
      v = f.record.name, p = R({}, d.params, c.params), m = f.stringify(p);
    }
    const y = [];
    let I = f;
    for (; I; )
      y.unshift(I.record), I = I.parent;
    return {
      name: v,
      path: m,
      params: p,
      matched: y,
      meta: ua(y)
    };
  }
  return e.forEach((c) => s(c)), { addRoute: s, resolve: l, removeRoute: a, getRoutes: i, getRecordMatcher: r };
}
function Nn(e, t) {
  const n = {};
  for (const o of t)
    o in e && (n[o] = e[o]);
  return n;
}
function ca(e) {
  return {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: void 0,
    beforeEnter: e.beforeEnter,
    props: la(e),
    children: e.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in e ? e.components || null : e.component && { default: e.component }
  };
}
function la(e) {
  const t = {}, n = e.props || !1;
  if ("component" in e)
    t.default = n;
  else
    for (const o in e.components)
      t[o] = typeof n == "boolean" ? n : n[o];
  return t;
}
function Cn(e) {
  for (; e; ) {
    if (e.record.aliasOf)
      return !0;
    e = e.parent;
  }
  return !1;
}
function ua(e) {
  return e.reduce((t, n) => R(t, n.meta), {});
}
function Rn(e, t) {
  const n = {};
  for (const o in e)
    n[o] = o in t ? t[o] : e[o];
  return n;
}
function Rt(e, t) {
  return e.name === t.name && e.optional === t.optional && e.repeatable === t.repeatable;
}
function da(e, t) {
  for (const n of e.keys)
    if (!n.optional && !t.keys.find(Rt.bind(null, n)))
      return N(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
  for (const n of t.keys)
    if (!n.optional && !e.keys.find(Rt.bind(null, n)))
      return N(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
}
function fa(e, t) {
  t && t.record.name && !e.name && !e.path && N(`The route named "${String(t.record.name)}" has a child without a name and an empty path. Using that name won't render the empty path child so you probably want to move the name to the child instead. If this is intentional, add a name to the child route to remove the warning.`);
}
function pa(e, t) {
  for (const n of t.keys)
    if (!e.keys.find(Rt.bind(null, n)))
      return N(`Absolute path "${e.record.path}" must have the exact same param named "${n.name}" as its parent "${t.record.path}".`);
}
function Ao(e, t) {
  return t.children.some((n) => n === e || Ao(e, n));
}
const To = /#/g, ha = /&/g, ma = /\//g, va = /=/g, ga = /\?/g, Do = /\+/g, ya = /%5B/g, _a = /%5D/g, Vo = /%5E/g, wa = /%60/g, Mo = /%7B/g, ba = /%7C/g, Lo = /%7D/g, Ea = /%20/g;
function Kt(e) {
  return encodeURI("" + e).replace(ba, "|").replace(ya, "[").replace(_a, "]");
}
function ka(e) {
  return Kt(e).replace(Mo, "{").replace(Lo, "}").replace(Vo, "^");
}
function At(e) {
  return Kt(e).replace(Do, "%2B").replace(Ea, "+").replace(To, "%23").replace(ha, "%26").replace(wa, "`").replace(Mo, "{").replace(Lo, "}").replace(Vo, "^");
}
function Sa(e) {
  return At(e).replace(va, "%3D");
}
function Ia(e) {
  return Kt(e).replace(To, "%23").replace(ga, "%3F");
}
function Oa(e) {
  return e == null ? "" : Ia(e).replace(ma, "%2F");
}
function ze(e) {
  try {
    return decodeURIComponent("" + e);
  } catch {
    process.env.NODE_ENV !== "production" && N(`Error decoding "${e}". Using original value`);
  }
  return "" + e;
}
function Pa(e) {
  const t = {};
  if (e === "" || e === "?")
    return t;
  const o = (e[0] === "?" ? e.slice(1) : e).split("&");
  for (let r = 0; r < o.length; ++r) {
    const s = o[r].replace(Do, " "), a = s.indexOf("="), i = ze(a < 0 ? s : s.slice(0, a)), u = a < 0 ? null : ze(s.slice(a + 1));
    if (i in t) {
      let l = t[i];
      K(l) || (l = t[i] = [l]), l.push(u);
    } else
      t[i] = u;
  }
  return t;
}
function An(e) {
  let t = "";
  for (let n in e) {
    const o = e[n];
    if (n = Sa(n), o == null) {
      o !== void 0 && (t += (t.length ? "&" : "") + n);
      continue;
    }
    (K(o) ? o.map((s) => s && At(s)) : [o && At(o)]).forEach((s) => {
      s !== void 0 && (t += (t.length ? "&" : "") + n, s != null && (t += "=" + s));
    });
  }
  return t;
}
function $a(e) {
  const t = {};
  for (const n in e) {
    const o = e[n];
    o !== void 0 && (t[n] = K(o) ? o.map((r) => r == null ? null : "" + r) : o == null ? o : "" + o);
  }
  return t;
}
const xa = Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : ""), Tn = Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : ""), qt = Symbol(process.env.NODE_ENV !== "production" ? "router" : ""), jo = Symbol(process.env.NODE_ENV !== "production" ? "route location" : ""), Tt = Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
function Ve() {
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
    const u = (d) => {
      d === !1 ? i(Te(4, {
        from: n,
        to: t
      })) : d instanceof Error ? i(d) : Ks(d) ? i(Te(2, {
        from: t,
        to: d
      })) : (s && // since enterCallbackArray is truthy, both record and name also are
      o.enterCallbacks[r] === s && typeof d == "function" && s.push(d), a());
    }, l = e.call(o && o.instances[r], t, n, process.env.NODE_ENV !== "production" ? Na(u, t, n) : u);
    let c = Promise.resolve(l);
    if (e.length < 3 && (c = c.then(u)), process.env.NODE_ENV !== "production" && e.length > 2) {
      const d = `The "next" callback was never called inside of ${e.name ? '"' + e.name + '"' : ""}:
${e.toString()}
. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;
      if (typeof l == "object" && "then" in l)
        c = c.then((f) => u._called ? f : (N(d), Promise.reject(new Error("Invalid navigation guard"))));
      else if (l !== void 0 && !u._called) {
        N(d), i(new Error("Invalid navigation guard"));
        return;
      }
    }
    c.catch((d) => i(d));
  });
}
function Na(e, t, n) {
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
          const u = i;
          i = () => u;
        } else
          i.__asyncLoader && // warn only once per component
          !i.__warnedDefineAsync && (i.__warnedDefineAsync = !0, N(`Component "${a}" in record with path "${s.path}" is defined using "defineAsyncComponent()". Write "() => import('./MyPage.vue')" instead of "defineAsyncComponent(() => import('./MyPage.vue'))".`));
      }
      if (!(t !== "beforeRouteEnter" && !s.instances[a]))
        if (Ca(i)) {
          const l = (i.__vccOpts || i)[t];
          l && r.push(me(l, n, o, s, a));
        } else {
          let u = i();
          process.env.NODE_ENV !== "production" && !("catch" in u) && (N(`Component "${a}" in record with path "${s.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`), u = Promise.resolve(u)), r.push(() => u.then((l) => {
            if (!l)
              return Promise.reject(new Error(`Couldn't resolve component "${a}" at "${s.path}"`));
            const c = Cs(l) ? l.default : l;
            s.components[a] = c;
            const f = (c.__vccOpts || c)[t];
            return f && me(f, n, o, s, a)();
          }));
        }
    }
  }
  return r;
}
function Ca(e) {
  return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function Dn(e) {
  const t = Z(qt), n = Z(jo), o = j(() => t.resolve(b(e.to))), r = j(() => {
    const { matched: u } = o.value, { length: l } = u, c = u[l - 1], d = n.matched;
    if (!c || !d.length)
      return -1;
    const f = d.findIndex(ye.bind(null, c));
    if (f > -1)
      return f;
    const p = Vn(u[l - 2]);
    return (
      // we are dealing with nested routes
      l > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      Vn(c) === p && // avoid comparing the child with its parent
      d[d.length - 1].path !== p ? d.findIndex(ye.bind(null, u[l - 2])) : f
    );
  }), s = j(() => r.value > -1 && Da(n.params, o.value.params)), a = j(() => r.value > -1 && r.value === n.matched.length - 1 && No(n.params, o.value.params));
  function i(u = {}) {
    return Ta(u) ? t[b(e.replace) ? "replace" : "push"](
      b(e.to)
      // avoid uncaught errors are they are logged anyway
    ).catch(Be) : Promise.resolve();
  }
  if (process.env.NODE_ENV !== "production" && ie) {
    const u = Ut();
    if (u) {
      const l = {
        route: o.value,
        isActive: s.value,
        isExactActive: a.value
      };
      u.__vrl_devtools = u.__vrl_devtools || [], u.__vrl_devtools.push(l), yr(() => {
        l.route = o.value, l.isActive = s.value, l.isExactActive = a.value;
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
const Ra = /* @__PURE__ */ q({
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
  useLink: Dn,
  setup(e, { slots: t }) {
    const n = ve(Dn(e)), { options: o } = Z(qt), r = j(() => ({
      [Mn(e.activeClass, o.linkActiveClass, "router-link-active")]: n.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [Mn(e.exactActiveClass, o.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
    }));
    return () => {
      const s = t.default && t.default(n);
      return e.custom ? s : ho("a", {
        "aria-current": n.isExactActive ? e.ariaCurrentValue : null,
        href: n.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: n.navigate,
        class: r.value
      }, s);
    };
  }
}), Aa = Ra;
function Ta(e) {
  if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(t))
        return;
    }
    return e.preventDefault && e.preventDefault(), !0;
  }
}
function Da(e, t) {
  for (const n in t) {
    const o = t[n], r = e[n];
    if (typeof o == "string") {
      if (o !== r)
        return !1;
    } else if (!K(r) || r.length !== o.length || o.some((s, a) => s !== r[a]))
      return !1;
  }
  return !0;
}
function Vn(e) {
  return e ? e.aliasOf ? e.aliasOf.path : e.path : "";
}
const Mn = (e, t, n) => e ?? t ?? n, Va = /* @__PURE__ */ q({
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
    process.env.NODE_ENV !== "production" && La();
    const o = Z(Tt), r = j(() => e.route || o.value), s = Z(Tn, 0), a = j(() => {
      let l = b(s);
      const { matched: c } = r.value;
      let d;
      for (; (d = c[l]) && !d.components; )
        l++;
      return l;
    }), i = j(() => r.value.matched[a.value]);
    et(Tn, j(() => a.value + 1)), et(xa, i), et(Tt, r);
    const u = V();
    return de(() => [u.value, i.value, e.name], ([l, c, d], [f, p, m]) => {
      c && (c.instances[d] = l, p && p !== c && l && l === f && (c.leaveGuards.size || (c.leaveGuards = p.leaveGuards), c.updateGuards.size || (c.updateGuards = p.updateGuards))), l && c && // if there is no instance but to and from are the same this might be
      // the first visit
      (!p || !ye(c, p) || !f) && (c.enterCallbacks[d] || []).forEach((v) => v(l));
    }, { flush: "post" }), () => {
      const l = r.value, c = e.name, d = i.value, f = d && d.components[c];
      if (!f)
        return Ln(n.default, { Component: f, route: l });
      const p = d.props[c], m = p ? p === !0 ? l.params : typeof p == "function" ? p(l) : p : null, y = ho(f, R({}, m, t, {
        onVnodeUnmounted: (I) => {
          I.component.isUnmounted && (d.instances[c] = null);
        },
        ref: u
      }));
      if (process.env.NODE_ENV !== "production" && ie && y.ref) {
        const I = {
          depth: a.value,
          name: d.name,
          path: d.path,
          meta: d.meta
        };
        (K(y.ref) ? y.ref.map((M) => M.i) : [y.ref.i]).forEach((M) => {
          M.__vrv_devtools = I;
        });
      }
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        Ln(n.default, { Component: y, route: l }) || y
      );
    };
  }
});
function Ln(e, t) {
  if (!e)
    return null;
  const n = e(t);
  return n.length === 1 ? n[0] : n;
}
const Ma = Va;
function La() {
  const e = Ut(), t = e.parent && e.parent.type.name;
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
function Me(e, t) {
  const n = R({}, e, {
    // remove variables that can contain vue instances
    matched: e.matched.map((o) => Qa(o, ["instances", "children", "aliasOf"]))
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
let ja = 0;
function Ba(e, t, n) {
  if (t.__hasDevtools)
    return;
  t.__hasDevtools = !0;
  const o = ja++;
  Gt({
    id: "org.vuejs.router" + (o ? "." + o : ""),
    label: "Vue Router",
    packageName: "vue-router",
    homepage: "https://router.vuejs.org",
    logo: "https://router.vuejs.org/logo.png",
    componentStateTypes: ["Routing"],
    app: e
  }, (r) => {
    typeof r.now != "function" && console.warn("[Vue Router]: You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."), r.on.inspectComponent((c, d) => {
      c.instanceData && c.instanceData.state.push({
        type: "Routing",
        key: "$route",
        editable: !1,
        value: Me(t.currentRoute.value, "Current Route")
      });
    }), r.on.visitComponentTree(({ treeNode: c, componentInstance: d }) => {
      if (d.__vrv_devtools) {
        const f = d.__vrv_devtools;
        c.tags.push({
          label: (f.name ? `${f.name.toString()}: ` : "") + f.path,
          textColor: 0,
          tooltip: "This component is rendered by &lt;router-view&gt;",
          backgroundColor: Bo
        });
      }
      K(d.__vrl_devtools) && (d.__devtoolsApi = r, d.__vrl_devtools.forEach((f) => {
        let p = Fo, m = "";
        f.isExactActive ? (p = Ho, m = "This is exactly active") : f.isActive && (p = Uo, m = "This link is active"), c.tags.push({
          label: f.route.path,
          textColor: 0,
          tooltip: m,
          backgroundColor: p
        });
      }));
    }), de(t.currentRoute, () => {
      u(), r.notifyComponentUpdate(), r.sendInspectorTree(i), r.sendInspectorState(i);
    });
    const s = "router:navigations:" + o;
    r.addTimelineLayer({
      id: s,
      label: `Router${o ? " " + o : ""} Navigations`,
      color: 4237508
    }), t.onError((c, d) => {
      r.addTimelineEvent({
        layerId: s,
        event: {
          title: "Error during Navigation",
          subtitle: d.fullPath,
          logType: "error",
          time: r.now(),
          data: { error: c },
          groupId: d.meta.__navigationId
        }
      });
    });
    let a = 0;
    t.beforeEach((c, d) => {
      const f = {
        guard: Ye("beforeEach"),
        from: Me(d, "Current Location during this navigation"),
        to: Me(c, "Target location")
      };
      Object.defineProperty(c.meta, "__navigationId", {
        value: a++
      }), r.addTimelineEvent({
        layerId: s,
        event: {
          time: r.now(),
          title: "Start of navigation",
          subtitle: c.fullPath,
          data: f,
          groupId: c.meta.__navigationId
        }
      });
    }), t.afterEach((c, d, f) => {
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
      }, p.status = Ye("❌")) : p.status = Ye("✅"), p.from = Me(d, "Current Location during this navigation"), p.to = Me(c, "Target location"), r.addTimelineEvent({
        layerId: s,
        event: {
          title: "End of navigation",
          subtitle: c.fullPath,
          time: r.now(),
          data: p,
          logType: f ? "warning" : "default",
          groupId: c.meta.__navigationId
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
    function u() {
      if (!l)
        return;
      const c = l;
      let d = n.getRoutes().filter((f) => !f.parent);
      d.forEach(zo), c.filter && (d = d.filter((f) => (
        // save matches state based on the payload
        Dt(f, c.filter.toLowerCase())
      ))), d.forEach((f) => Go(f, t.currentRoute.value)), c.rootNodes = d.map(Wo);
    }
    let l;
    r.on.getInspectorTree((c) => {
      l = c, c.app === e && c.inspectorId === i && u();
    }), r.on.getInspectorState((c) => {
      if (c.app === e && c.inspectorId === i) {
        const f = n.getRoutes().find((p) => p.record.__vd_id === c.nodeId);
        f && (c.state = {
          options: Ha(f)
        });
      }
    }), r.sendInspectorTree(i), r.sendInspectorState(i);
  });
}
function Ua(e) {
  return e.optional ? e.repeatable ? "*" : "?" : e.repeatable ? "+" : "";
}
function Ha(e) {
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
        display: e.keys.map((o) => `${o.name}${Ua(o)}`).join(" "),
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
const Bo = 15485081, Uo = 2450411, Ho = 8702998, Fa = 2282478, Fo = 16486972, Wa = 6710886;
function Wo(e) {
  const t = [], { record: n } = e;
  n.name != null && t.push({
    label: String(n.name),
    textColor: 0,
    backgroundColor: Fa
  }), n.aliasOf && t.push({
    label: "alias",
    textColor: 0,
    backgroundColor: Fo
  }), e.__vd_match && t.push({
    label: "matches",
    textColor: 0,
    backgroundColor: Bo
  }), e.__vd_exactActive && t.push({
    label: "exact",
    textColor: 0,
    backgroundColor: Ho
  }), e.__vd_active && t.push({
    label: "active",
    textColor: 0,
    backgroundColor: Uo
  }), n.redirect && t.push({
    label: typeof n.redirect == "string" ? `redirect: ${n.redirect}` : "redirects",
    textColor: 16777215,
    backgroundColor: Wa
  });
  let o = n.__vd_id;
  return o == null && (o = String(Ga++), n.__vd_id = o), {
    id: o,
    label: n.path,
    tags: t,
    children: e.children.map(Wo)
  };
}
let Ga = 0;
const za = /^\/(.*)\/([a-z]*)$/;
function Go(e, t) {
  const n = t.matched.length && ye(t.matched[t.matched.length - 1], e.record);
  e.__vd_exactActive = e.__vd_active = n, n || (e.__vd_active = t.matched.some((o) => ye(o, e.record))), e.children.forEach((o) => Go(o, t));
}
function zo(e) {
  e.__vd_match = !1, e.children.forEach(zo);
}
function Dt(e, t) {
  const n = String(e.re).match(za);
  if (e.__vd_match = !1, !n || n.length < 3)
    return !1;
  if (new RegExp(n[1].replace(/\$$/, ""), n[2]).test(t))
    return e.children.forEach((a) => Dt(a, t)), e.record.path !== "/" || t === "/" ? (e.__vd_match = e.re.test(t), !0) : !1;
  const r = e.record.path.toLowerCase(), s = ze(r);
  return !t.startsWith("/") && (s.includes(t) || r.includes(t)) || s.startsWith(t) || r.startsWith(t) || e.record.name && String(e.record.name).includes(t) ? !0 : e.children.some((a) => Dt(a, t));
}
function Qa(e, t) {
  const n = {};
  for (const o in e)
    t.includes(o) || (n[o] = e[o]);
  return n;
}
function Ka(e) {
  const t = ia(e.routes, e), n = e.parseQuery || Pa, o = e.stringifyQuery || An, r = e.history;
  if (process.env.NODE_ENV !== "production" && !r)
    throw new Error('Provide the "history" option when calling "createRouter()": https://next.router.vuejs.org/api/#history.');
  const s = Ve(), a = Ve(), i = Ve(), u = gr(he);
  let l = he;
  ie && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
  const c = wt.bind(null, (h) => "" + h), d = wt.bind(null, Oa), f = (
    // @ts-expect-error: intentionally avoid the type check
    wt.bind(null, ze)
  );
  function p(h, w) {
    let g, E;
    return Ro(h) ? (g = t.getRecordMatcher(h), E = w) : E = h, t.addRoute(E, g);
  }
  function m(h) {
    const w = t.getRecordMatcher(h);
    w ? t.removeRoute(w) : process.env.NODE_ENV !== "production" && N(`Cannot remove non-existent route "${String(h)}"`);
  }
  function v() {
    return t.getRoutes().map((h) => h.record);
  }
  function y(h) {
    return !!t.getRecordMatcher(h);
  }
  function I(h, w) {
    if (w = R({}, w || u.value), typeof h == "string") {
      const P = bt(n, h, w.path), L = t.resolve({ path: P.path }, w), we = r.createHref(P.fullPath);
      return process.env.NODE_ENV !== "production" && (we.startsWith("//") ? N(`Location "${h}" resolved to "${we}". A resolved location cannot start with multiple slashes.`) : L.matched.length || N(`No match found for location with path "${h}"`)), R(P, L, {
        params: f(L.params),
        hash: ze(P.hash),
        redirectedFrom: void 0,
        href: we
      });
    }
    let g;
    if ("path" in h)
      process.env.NODE_ENV !== "production" && "params" in h && !("name" in h) && // @ts-expect-error: the type is never
      Object.keys(h.params).length && N(`Path "${// @ts-expect-error: the type is never
      h.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`), g = R({}, h, {
        path: bt(n, h.path, w.path).path
      });
    else {
      const P = R({}, h.params);
      for (const L in P)
        P[L] == null && delete P[L];
      g = R({}, h, {
        params: d(h.params)
      }), w.params = d(w.params);
    }
    const E = t.resolve(g, w), C = h.hash || "";
    process.env.NODE_ENV !== "production" && C && !C.startsWith("#") && N(`A \`hash\` should always start with the character "#". Replace "${C}" with "#${C}".`), E.params = c(f(E.params));
    const U = Ts(o, R({}, h, {
      hash: ka(C),
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
        o === An ? $a(h.query) : h.query || {}
      )
    }, E, {
      redirectedFrom: void 0,
      href: x
    });
  }
  function O(h) {
    return typeof h == "string" ? bt(n, h, u.value.path) : R({}, h);
  }
  function M(h, w) {
    if (l !== h)
      return Te(8, {
        from: w,
        to: h
      });
  }
  function F(h) {
    return S(h);
  }
  function J(h) {
    return F(R(O(h), { replace: !0 }));
  }
  function Y(h) {
    const w = h.matched[h.matched.length - 1];
    if (w && w.redirect) {
      const { redirect: g } = w;
      let E = typeof g == "function" ? g(h) : g;
      if (typeof E == "string" && (E = E.includes("?") || E.includes("#") ? E = O(E) : (
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
  function S(h, w) {
    const g = l = I(h), E = u.value, C = h.state, U = h.force, x = h.replace === !0, P = Y(g);
    if (P)
      return S(
        R(O(P), {
          state: typeof P == "object" ? R({}, C, P.state) : C,
          force: U,
          replace: x
        }),
        // keep original redirectedFrom if it exists
        w || g
      );
    const L = g;
    L.redirectedFrom = w;
    let we;
    return !U && kn(o, E, g) && (we = Te(16, { to: L, from: E }), cn(
      E,
      E,
      // this is a push, the only way for it to be triggered from a
      // history.listen is with a redirect, which makes it become a push
      !0,
      // This cannot be the first navigation because the initial location
      // cannot be manually navigated to
      !1
    )), (we ? Promise.resolve(we) : k(L, E)).catch((Q) => se(Q) ? (
      // navigation redirects still mark the router as ready
      se(
        Q,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? Q : ht(Q)
    ) : (
      // reject any unknown error
      G(Q, L, E)
    )).then((Q) => {
      if (Q) {
        if (se(
          Q,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        ))
          return process.env.NODE_ENV !== "production" && // we are redirecting to the same location we were already at
          kn(o, I(Q.to), L) && // and we have done it a couple of times
          w && // @ts-expect-error: added only in dev
          (w._count = w._count ? (
            // @ts-expect-error
            w._count + 1
          ) : 1) > 10 ? (N(`Detected an infinite redirection in a navigation guard when going from "${E.fullPath}" to "${L.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`), Promise.reject(new Error("Infinite redirect in navigation guard"))) : S(
            // keep options
            R({
              // preserve an existing replacement but allow the redirect to override it
              replace: x
            }, O(Q.to), {
              state: typeof Q.to == "object" ? R({}, C, Q.to.state) : C,
              force: U
            }),
            // preserve the original redirectedFrom if any
            w || L
          );
      } else
        Q = D(L, E, !0, x, C);
      return _(L, E, Q), Q;
    });
  }
  function te(h, w) {
    const g = M(h, w);
    return g ? Promise.reject(g) : Promise.resolve();
  }
  function k(h, w) {
    let g;
    const [E, C, U] = qa(h, w);
    g = Et(E.reverse(), "beforeRouteLeave", h, w);
    for (const P of E)
      P.leaveGuards.forEach((L) => {
        g.push(me(L, h, w));
      });
    const x = te.bind(null, h, w);
    return g.push(x), Ce(g).then(() => {
      g = [];
      for (const P of s.list())
        g.push(me(P, h, w));
      return g.push(x), Ce(g);
    }).then(() => {
      g = Et(C, "beforeRouteUpdate", h, w);
      for (const P of C)
        P.updateGuards.forEach((L) => {
          g.push(me(L, h, w));
        });
      return g.push(x), Ce(g);
    }).then(() => {
      g = [];
      for (const P of h.matched)
        if (P.beforeEnter && !w.matched.includes(P))
          if (K(P.beforeEnter))
            for (const L of P.beforeEnter)
              g.push(me(L, h, w));
          else
            g.push(me(P.beforeEnter, h, w));
      return g.push(x), Ce(g);
    }).then(() => (h.matched.forEach((P) => P.enterCallbacks = {}), g = Et(U, "beforeRouteEnter", h, w), g.push(x), Ce(g))).then(() => {
      g = [];
      for (const P of a.list())
        g.push(me(P, h, w));
      return g.push(x), Ce(g);
    }).catch((P) => se(
      P,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? P : Promise.reject(P));
  }
  function _(h, w, g) {
    for (const E of i.list())
      E(h, w, g);
  }
  function D(h, w, g, E, C) {
    const U = M(h, w);
    if (U)
      return U;
    const x = w === he, P = ie ? history.state : {};
    g && (E || x ? r.replace(h.fullPath, R({
      scroll: x && P && P.scroll
    }, C)) : r.push(h.fullPath, C)), u.value = h, cn(h, w, g, x), ht();
  }
  let B;
  function _e() {
    B || (B = r.listen((h, w, g) => {
      const E = I(h), C = Y(E);
      if (C) {
        S(R(C, { replace: !0 }), E).catch(Be);
        return;
      }
      l = E;
      const U = u.value;
      ie && Hs(In(U.fullPath, g.delta), dt()), k(E, U).catch((x) => se(
        x,
        12
        /* ErrorTypes.NAVIGATION_CANCELLED */
      ) ? x : se(
        x,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? (S(
        x.to,
        E
        // avoid an uncaught rejection, let push call triggerError
      ).then((P) => {
        se(
          P,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && !g.delta && g.type === Ge.pop && r.go(-1, !1);
      }).catch(Be), Promise.reject()) : (g.delta && r.go(-g.delta, !1), G(x, E, U))).then((x) => {
        x = x || D(
          // after navigation, all matched components are resolved
          E,
          U,
          !1
        ), x && (g.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
        // entry while a different route is displayed
        !se(
          x,
          8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        ) ? r.go(-g.delta, !1) : g.type === Ge.pop && se(
          x,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && r.go(-1, !1)), _(E, U, x);
      }).catch(Be);
    }));
  }
  let De = Ve(), Ke = Ve(), ne;
  function G(h, w, g) {
    ht(h);
    const E = Ke.list();
    return E.length ? E.forEach((C) => C(h, w, g)) : (process.env.NODE_ENV !== "production" && N("uncaught error during route navigation:"), console.error(h)), Promise.reject(h);
  }
  function mr() {
    return ne && u.value !== he ? Promise.resolve() : new Promise((h, w) => {
      De.add([h, w]);
    });
  }
  function ht(h) {
    return ne || (ne = !h, _e(), De.list().forEach(([w, g]) => h ? g(h) : w()), De.reset()), h;
  }
  function cn(h, w, g, E) {
    const { scrollBehavior: C } = e;
    if (!ie || !C)
      return Promise.resolve();
    const U = !g && Fs(In(h.fullPath, 0)) || (E || !g) && history.state && history.state.scroll || null;
    return Fe().then(() => C(h, w, U)).then((x) => x && Us(x)).catch((x) => G(x, h, w));
  }
  const mt = (h) => r.go(h);
  let vt;
  const gt = /* @__PURE__ */ new Set();
  return {
    currentRoute: u,
    listening: !0,
    addRoute: p,
    removeRoute: m,
    hasRoute: y,
    getRoutes: v,
    resolve: I,
    options: e,
    push: F,
    replace: J,
    go: mt,
    back: () => mt(-1),
    forward: () => mt(1),
    beforeEach: s.add,
    beforeResolve: a.add,
    afterEach: i.add,
    onError: Ke.add,
    isReady: mr,
    install(h) {
      const w = this;
      h.component("RouterLink", Aa), h.component("RouterView", Ma), h.config.globalProperties.$router = w, Object.defineProperty(h.config.globalProperties, "$route", {
        enumerable: !0,
        get: () => b(u)
      }), ie && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !vt && u.value === he && (vt = !0, F(r.location).catch((C) => {
        process.env.NODE_ENV !== "production" && N("Unexpected error when starting the router:", C);
      }));
      const g = {};
      for (const C in he)
        g[C] = j(() => u.value[C]);
      h.provide(qt, w), h.provide(jo, ve(g)), h.provide(Tt, u);
      const E = h.unmount;
      gt.add(h), h.unmount = function() {
        gt.delete(h), gt.size < 1 && (l = he, B && B(), B = null, u.value = he, vt = !1, ne = !1), E();
      }, process.env.NODE_ENV !== "production" && ie && Ba(h, w, t);
    }
  };
}
function Ce(e) {
  return e.reduce((t, n) => t.then(() => n()), Promise.resolve());
}
function qa(e, t) {
  const n = [], o = [], r = [], s = Math.max(t.matched.length, e.matched.length);
  for (let a = 0; a < s; a++) {
    const i = t.matched[a];
    i && (e.matched.find((l) => ye(l, i)) ? o.push(i) : n.push(i));
    const u = e.matched[a];
    u && (t.matched.find((l) => ye(l, u)) || r.push(u));
  }
  return [n, o, r];
}
Ka({
  history: Qs(),
  routes: []
});
function Ja(e) {
  return e && typeof e.then == "function";
}
Promise.resolve(!1);
Promise.resolve(!0);
var Ie = Promise.resolve();
function Qo(e, t) {
  return e || (e = 0), new Promise(function(n) {
    return setTimeout(function() {
      return n(t);
    }, e);
  });
}
function Ya(e, t) {
  return Math.floor(Math.random() * (t - e + 1) + e);
}
function Jt() {
  return Math.random().toString(36).substring(2);
}
var jn = 0, kt = 0;
function ft() {
  var e = (/* @__PURE__ */ new Date()).getTime();
  return e === jn ? (kt++, e * 1e3 + kt) : (jn = e, kt = 0, e * 1e3);
}
var Xa = ft, Za = "native";
function ei(e) {
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
function ti(e) {
  e.bc.close(), e.subFns = [];
}
function ni(e, t) {
  try {
    return e.bc.postMessage(t, !1), Ie;
  } catch (n) {
    return Promise.reject(n);
  }
}
function oi(e, t) {
  e.messagesCallback = t;
}
function ri() {
  if (typeof window > "u")
    return !1;
  if (typeof BroadcastChannel == "function") {
    if (BroadcastChannel._pubkey)
      throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
    return !0;
  } else
    return !1;
}
function si() {
  return 150;
}
var ai = {
  create: ei,
  close: ti,
  onMessage: oi,
  postMessage: ni,
  canBeUsed: ri,
  type: Za,
  averageResponseTime: si,
  microSeconds: Xa
}, Ko = (
  /** @class */
  function() {
    function e(t) {
      this.ttl = t, this.map = /* @__PURE__ */ new Map(), this._to = !1;
    }
    return e.prototype.has = function(t) {
      return this.map.has(t);
    }, e.prototype.add = function(t) {
      var n = this;
      this.map.set(t, qo()), this._to || (this._to = !0, setTimeout(function() {
        n._to = !1, ii(n);
      }, 0));
    }, e.prototype.clear = function() {
      this.map.clear();
    }, e;
  }()
);
function ii(e) {
  for (var t = qo() - e.ttl, n = e.map[Symbol.iterator](); ; ) {
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
function qo() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function Yt() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = JSON.parse(JSON.stringify(e));
  return typeof t.webWorkerSupport > "u" && (t.webWorkerSupport = !0), t.idb || (t.idb = {}), t.idb.ttl || (t.idb.ttl = 1e3 * 45), t.idb.fallbackInterval || (t.idb.fallbackInterval = 150), e.idb && typeof e.idb.onclose == "function" && (t.idb.onclose = e.idb.onclose), t.localstorage || (t.localstorage = {}), t.localstorage.removeTimeout || (t.localstorage.removeTimeout = 1e3 * 60), e.methods && (t.methods = e.methods), t.node || (t.node = {}), t.node.ttl || (t.node.ttl = 1e3 * 60 * 2), t.node.maxParallelWrites || (t.node.maxParallelWrites = 2048), typeof t.node.useFastPath > "u" && (t.node.useFastPath = !0), t;
}
var ci = ft, li = "pubkey.broadcast-channel-0-", ue = "messages", pt = {
  durability: "relaxed"
}, ui = "idb";
function Jo() {
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
function Xt(e) {
  e.commit && e.commit();
}
function di(e) {
  var t = Jo(), n = li + e, o = t.open(n);
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
function fi(e, t, n) {
  var o = (/* @__PURE__ */ new Date()).getTime(), r = {
    uuid: t,
    time: o,
    data: n
  }, s = e.transaction([ue], "readwrite", pt);
  return new Promise(function(a, i) {
    s.oncomplete = function() {
      return a();
    }, s.onerror = function(l) {
      return i(l);
    };
    var u = s.objectStore(ue);
    u.add(r), Xt(s);
  });
}
function pi(e, t) {
  var n = e.transaction(ue, "readonly", pt), o = n.objectStore(ue), r = [], s = IDBKeyRange.bound(t + 1, 1 / 0);
  if (o.getAll) {
    var a = o.getAll(s);
    return new Promise(function(u, l) {
      a.onerror = function(c) {
        return l(c);
      }, a.onsuccess = function(c) {
        u(c.target.result);
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
  return new Promise(function(u, l) {
    var c = i();
    c.onerror = function(d) {
      return l(d);
    }, c.onsuccess = function(d) {
      var f = d.target.result;
      f ? f.value.id < t + 1 ? f.continue(t + 1) : (r.push(f.value), f.continue()) : (Xt(n), u(r));
    };
  });
}
function hi(e, t) {
  if (e.closed)
    return Promise.resolve([]);
  var n = e.db.transaction(ue, "readwrite", pt), o = n.objectStore(ue);
  return Promise.all(t.map(function(r) {
    var s = o.delete(r);
    return new Promise(function(a) {
      s.onsuccess = function() {
        return a();
      };
    });
  }));
}
function mi(e, t) {
  var n = (/* @__PURE__ */ new Date()).getTime() - t, o = e.transaction(ue, "readonly", pt), r = o.objectStore(ue), s = [];
  return new Promise(function(a) {
    r.openCursor().onsuccess = function(i) {
      var u = i.target.result;
      if (u) {
        var l = u.value;
        l.time < n ? (s.push(l), u.continue()) : (Xt(o), a(s));
      } else
        a(s);
    };
  });
}
function vi(e) {
  return mi(e.db, e.options.idb.ttl).then(function(t) {
    return hi(e, t.map(function(n) {
      return n.id;
    }));
  });
}
function gi(e, t) {
  return t = Yt(t), di(e).then(function(n) {
    var o = {
      closed: !1,
      lastCursorId: 0,
      channelName: e,
      options: t,
      uuid: Jt(),
      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new Ko(t.idb.ttl * 2),
      // ensures we do not read messages in parallel
      writeBlockPromise: Ie,
      messagesCallback: null,
      readQueuePromises: [],
      db: n
    };
    return n.onclose = function() {
      o.closed = !0, t.idb.onclose && t.idb.onclose();
    }, Yo(o), o;
  });
}
function Yo(e) {
  e.closed || Xo(e).then(function() {
    return Qo(e.options.idb.fallbackInterval);
  }).then(function() {
    return Yo(e);
  });
}
function yi(e, t) {
  return !(e.uuid === t.uuid || t.eMIs.has(e.id) || e.data.time < t.messagesCallbackTime);
}
function Xo(e) {
  return e.closed || !e.messagesCallback ? Ie : pi(e.db, e.lastCursorId).then(function(t) {
    var n = t.filter(function(o) {
      return !!o;
    }).map(function(o) {
      return o.id > e.lastCursorId && (e.lastCursorId = o.id), o;
    }).filter(function(o) {
      return yi(o, e);
    }).sort(function(o, r) {
      return o.time - r.time;
    });
    return n.forEach(function(o) {
      e.messagesCallback && (e.eMIs.add(o.id), e.messagesCallback(o.data));
    }), Ie;
  });
}
function _i(e) {
  e.closed = !0, e.db.close();
}
function wi(e, t) {
  return e.writeBlockPromise = e.writeBlockPromise.then(function() {
    return fi(e.db, e.uuid, t);
  }).then(function() {
    Ya(0, 10) === 0 && vi(e);
  }), e.writeBlockPromise;
}
function bi(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t, Xo(e);
}
function Ei() {
  return !!Jo();
}
function ki(e) {
  return e.idb.fallbackInterval * 2;
}
var Si = {
  create: gi,
  close: _i,
  onMessage: bi,
  postMessage: wi,
  canBeUsed: Ei,
  type: ui,
  averageResponseTime: ki,
  microSeconds: ci
}, Ii = ft, Oi = "pubkey.broadcastChannel-", Pi = "localstorage";
function Zo() {
  var e;
  if (typeof window > "u")
    return null;
  try {
    e = window.localStorage, e = window["ie8-eventlistener/storage"] || window.localStorage;
  } catch {
  }
  return e;
}
function er(e) {
  return Oi + e;
}
function $i(e, t) {
  return new Promise(function(n) {
    Qo().then(function() {
      var o = er(e.channelName), r = {
        token: Jt(),
        time: (/* @__PURE__ */ new Date()).getTime(),
        data: t,
        uuid: e.uuid
      }, s = JSON.stringify(r);
      Zo().setItem(o, s);
      var a = document.createEvent("Event");
      a.initEvent("storage", !0, !0), a.key = o, a.newValue = s, window.dispatchEvent(a), n();
    });
  });
}
function xi(e, t) {
  var n = er(e), o = function(s) {
    s.key === n && t(JSON.parse(s.newValue));
  };
  return window.addEventListener("storage", o), o;
}
function Ni(e) {
  window.removeEventListener("storage", e);
}
function Ci(e, t) {
  if (t = Yt(t), !tr())
    throw new Error("BroadcastChannel: localstorage cannot be used");
  var n = Jt(), o = new Ko(t.localstorage.removeTimeout), r = {
    channelName: e,
    uuid: n,
    eMIs: o
    // emittedMessagesIds
  };
  return r.listener = xi(e, function(s) {
    r.messagesCallback && s.uuid !== n && (!s.token || o.has(s.token) || s.data.time && s.data.time < r.messagesCallbackTime || (o.add(s.token), r.messagesCallback(s.data)));
  }), r;
}
function Ri(e) {
  Ni(e.listener);
}
function Ai(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t;
}
function tr() {
  var e = Zo();
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
function Ti() {
  var e = 120, t = navigator.userAgent.toLowerCase();
  return t.includes("safari") && !t.includes("chrome") ? e * 2 : e;
}
var Di = {
  create: Ci,
  close: Ri,
  onMessage: Ai,
  postMessage: $i,
  canBeUsed: tr,
  type: Pi,
  averageResponseTime: Ti,
  microSeconds: Ii
}, Vi = ft, Mi = "simulate", Zt = /* @__PURE__ */ new Set();
function Li(e) {
  var t = {
    name: e,
    messagesCallback: null
  };
  return Zt.add(t), t;
}
function ji(e) {
  Zt.delete(e);
}
function Bi(e, t) {
  return new Promise(function(n) {
    return setTimeout(function() {
      var o = Array.from(Zt);
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
function Ui(e, t) {
  e.messagesCallback = t;
}
function Hi() {
  return !0;
}
function Fi() {
  return 5;
}
var Wi = {
  create: Li,
  close: ji,
  onMessage: Ui,
  postMessage: Bi,
  canBeUsed: Hi,
  type: Mi,
  averageResponseTime: Fi,
  microSeconds: Vi
}, Bn = [
  ai,
  // fastest
  Si,
  Di
];
function Gi(e) {
  var t = [].concat(e.methods, Bn).filter(Boolean);
  if (e.type) {
    if (e.type === "simulate")
      return Wi;
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
  throw new Error("No usable method found in " + JSON.stringify(Bn.map(function(r) {
    return r.type;
  })));
}
var nr = /* @__PURE__ */ new Set(), zi = 0, en = function(t, n) {
  this.id = zi++, nr.add(this), this.name = t, this.options = Yt(n), this.method = Gi(this.options), this._iL = !1, this._onML = null, this._addEL = {
    message: [],
    internal: []
  }, this._uMP = /* @__PURE__ */ new Set(), this._befC = [], this._prepP = null, Qi(this);
};
en._pubkey = !0;
en.prototype = {
  postMessage: function(t) {
    if (this.closed)
      throw new Error("BroadcastChannel.postMessage(): Cannot post message after channel has closed " + /**
      * In the past when this error appeared, it was really hard to debug.
      * So now we log the msg together with the error so it at least
      * gives some clue about where in your application this happens.
      */
      JSON.stringify(t));
    return Un(this, "message", t);
  },
  postInternal: function(t) {
    return Un(this, "internal", t);
  },
  set onmessage(e) {
    var t = this.method.microSeconds(), n = {
      time: t,
      fn: e
    };
    Fn(this, "message", this._onML), e && typeof e == "function" ? (this._onML = n, Hn(this, "message", n)) : this._onML = null;
  },
  addEventListener: function(t, n) {
    var o = this.method.microSeconds(), r = {
      time: o,
      fn: n
    };
    Hn(this, t, r);
  },
  removeEventListener: function(t, n) {
    var o = this._addEL[t].find(function(r) {
      return r.fn === n;
    });
    Fn(this, t, o);
  },
  close: function() {
    var t = this;
    if (!this.closed) {
      nr.delete(this), this.closed = !0;
      var n = this._prepP ? this._prepP : Ie;
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
function Un(e, t, n) {
  var o = e.method.microSeconds(), r = {
    time: o,
    type: t,
    data: n
  }, s = e._prepP ? e._prepP : Ie;
  return s.then(function() {
    var a = e.method.postMessage(e._state, r);
    return e._uMP.add(a), a.catch().then(function() {
      return e._uMP.delete(a);
    }), a;
  });
}
function Qi(e) {
  var t = e.method.create(e.name, e.options);
  Ja(t) ? (e._prepP = t, t.then(function(n) {
    e._state = n;
  })) : e._state = t;
}
function or(e) {
  return e._addEL.message.length > 0 || e._addEL.internal.length > 0;
}
function Hn(e, t, n) {
  e._addEL[t].push(n), Ki(e);
}
function Fn(e, t, n) {
  e._addEL[t] = e._addEL[t].filter(function(o) {
    return o !== n;
  }), qi(e);
}
function Ki(e) {
  if (!e._iL && or(e)) {
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
function qi(e) {
  if (e._iL && !or(e)) {
    e._iL = !1;
    var t = e.method.microSeconds();
    e.method.onMessage(e._state, null, t);
  }
}
const Wn = {
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
class St extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   */
  constructor(t, n) {
    super(t), this.name = "DevalueError", this.path = n.join("");
  }
}
function Gn(e) {
  return Object(e) !== e;
}
const Ji = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function Yi(e) {
  const t = Object.getPrototypeOf(e);
  return t === Object.prototype || t === null || Object.getOwnPropertyNames(t).sort().join("\0") === Ji;
}
function Xi(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function Ae(e) {
  let t = '"';
  for (let n = 0; n < e.length; n += 1) {
    const o = e.charAt(n), r = o.charCodeAt(0);
    if (o === '"')
      t += '\\"';
    else if (o in Wn)
      t += Wn[o];
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
const tn = -1, rr = -2, sr = -3, ar = -4, ir = -5, nn = -6;
function zn(e, t) {
  return Zi(JSON.parse(e), t);
}
function Zi(e, t) {
  if (typeof e == "number")
    return r(e, !0);
  if (!Array.isArray(e) || e.length === 0)
    throw new Error("Invalid input");
  const n = (
    /** @type {any[]} */
    e
  ), o = Array(n.length);
  function r(s, a = !1) {
    if (s === tn)
      return;
    if (s === sr)
      return NaN;
    if (s === ar)
      return 1 / 0;
    if (s === ir)
      return -1 / 0;
    if (s === nn)
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
        const u = i[0], l = t == null ? void 0 : t[u];
        if (l)
          return o[s] = l(r(i[1]));
        switch (u) {
          case "Date":
            o[s] = new Date(i[1]);
            break;
          case "Set":
            const c = /* @__PURE__ */ new Set();
            o[s] = c;
            for (let p = 1; p < i.length; p += 1)
              c.add(r(i[p]));
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
            throw new Error(`Unknown type ${u}`);
        }
      } else {
        const u = new Array(i.length);
        o[s] = u;
        for (let l = 0; l < i.length; l += 1) {
          const c = i[l];
          c !== rr && (u[l] = r(c));
        }
      }
    else {
      const u = {};
      o[s] = u;
      for (const l in i) {
        const c = i[l];
        u[l] = r(c);
      }
    }
    return o[s];
  }
  return r(0);
}
function Qn(e, t) {
  const n = [], o = /* @__PURE__ */ new Map(), r = [];
  for (const l in t)
    r.push({ key: l, fn: t[l] });
  const s = [];
  let a = 0;
  function i(l) {
    if (typeof l == "function")
      throw new St("Cannot stringify a function", s);
    if (o.has(l))
      return o.get(l);
    if (l === void 0)
      return tn;
    if (Number.isNaN(l))
      return sr;
    if (l === 1 / 0)
      return ar;
    if (l === -1 / 0)
      return ir;
    if (l === 0 && 1 / l < 0)
      return nn;
    const c = a++;
    o.set(l, c);
    for (const { key: f, fn: p } of r) {
      const m = p(l);
      if (m)
        return n[c] = `["${f}",${i(m)}]`, c;
    }
    let d = "";
    if (Gn(l))
      d = It(l);
    else
      switch (Xi(l)) {
        case "Number":
        case "String":
        case "Boolean":
          d = `["Object",${It(l)}]`;
          break;
        case "BigInt":
          d = `["BigInt",${l}]`;
          break;
        case "Date":
          d = `["Date","${l.toISOString()}"]`;
          break;
        case "RegExp":
          const { source: p, flags: m } = l;
          d = m ? `["RegExp",${Ae(p)},"${m}"]` : `["RegExp",${Ae(p)}]`;
          break;
        case "Array":
          d = "[";
          for (let v = 0; v < l.length; v += 1)
            v > 0 && (d += ","), v in l ? (s.push(`[${v}]`), d += i(l[v]), s.pop()) : d += rr;
          d += "]";
          break;
        case "Set":
          d = '["Set"';
          for (const v of l)
            d += `,${i(v)}`;
          d += "]";
          break;
        case "Map":
          d = '["Map"';
          for (const [v, y] of l)
            s.push(
              `.get(${Gn(v) ? It(v) : "..."})`
            ), d += `,${i(v)},${i(y)}`;
          d += "]";
          break;
        default:
          if (!Yi(l))
            throw new St(
              "Cannot stringify arbitrary non-POJOs",
              s
            );
          if (Object.getOwnPropertySymbols(l).length > 0)
            throw new St(
              "Cannot stringify POJOs with symbolic keys",
              s
            );
          if (Object.getPrototypeOf(l) === null) {
            d = '["null"';
            for (const v in l)
              s.push(`.${v}`), d += `,${Ae(v)},${i(l[v])}`, s.pop();
            d += "]";
          } else {
            d = "{";
            let v = !1;
            for (const y in l)
              v && (d += ","), v = !0, s.push(`.${y}`), d += `${Ae(y)}:${i(l[y])}`, s.pop();
            d += "}";
          }
      }
    return n[c] = d, c;
  }
  const u = i(e);
  return u < 0 ? `${u}` : `[${n.join(",")}]`;
}
function It(e) {
  const t = typeof e;
  return t === "string" ? Ae(e) : e instanceof String ? Ae(e.toString()) : e === void 0 ? tn.toString() : e === 0 && 1 / e < 0 ? nn.toString() : t === "bigint" ? `["BigInt","${e}"]` : String(e);
}
function ec(e, t, { initialize: n, type: o }) {
  let r = `${t.$id}-${e.toString()}`, s = new en(r, { type: o }), a = !1, i = 0;
  de(() => t[e], (c) => {
    a || (i = Date.now(), s.postMessage({ timestamp: i, state: zn(Qn(c)) })), a = !1;
  }, { deep: !0 }), s.onmessage = (c) => {
    if (c === void 0) {
      s.postMessage({ timestamp: i, state: zn(Qn(t[e])) });
      return;
    }
    c.timestamp <= i || (a = !0, i = c.timestamp, t[e] = c.state);
  };
  let u = () => s.postMessage(void 0), l = () => s.close();
  return n && u(), { sync: u, unshare: l };
}
var tc = (e, t) => Object.keys(t).includes(e), nc = ({ initialize: e = !0, enable: t = !0, type: n }) => ({ store: o, options: r }) => {
  var s, a;
  let i = ((s = r == null ? void 0 : r.share) == null ? void 0 : s.enable) ?? t, u = ((a = r == null ? void 0 : r.share) == null ? void 0 : a.omit) ?? [];
  !i || Object.keys(o.$state).forEach((l) => {
    var c;
    u.includes(l) || !tc(l, o.$state) || ec(l, o, { initialize: ((c = r == null ? void 0 : r.share) == null ? void 0 : c.initialize) ?? e, type: n });
  });
};
const oc = Os();
oc.use(
  nc({
    enable: !0,
    initialize: !0
  })
);
const rc = /* @__PURE__ */ q({
  __name: "Doctype",
  setup(e) {
    const { stonecrop: t, isReady: n } = xo(), o = V([]);
    return de(n, () => {
      if (n.value) {
        let r = t.value.schema.schema.toArray();
        r.forEach((s, a) => {
          const u = t.value.store.record[s.fieldname];
          r[a].value = u;
        }), o.value = r;
      }
    }), (r, s) => b(n) ? ($(), Se(b(qr), {
      key: 0,
      class: "aform-main",
      modelValue: o.value,
      "onUpdate:modelValue": s[0] || (s[0] = (a) => o.value = a)
    }, null, 8, ["modelValue"])) : ke("", !0);
  }
});
var Kn;
const cr = typeof window < "u", sc = (e) => typeof e == "string", ac = () => {
};
cr && (Kn = window == null ? void 0 : window.navigator) != null && Kn.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function lr(e) {
  return typeof e == "function" ? e() : b(e);
}
function ic(e) {
  return e;
}
function cc(e) {
  return fo() ? (po(e), !0) : !1;
}
function Vt(e) {
  var t;
  const n = lr(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const ur = cr ? window : void 0;
function lc(...e) {
  let t, n, o, r;
  if (sc(e[0]) || Array.isArray(e[0]) ? ([n, o, r] = e, t = ur) : [t, n, o, r] = e, !t)
    return ac;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const s = [], a = () => {
    s.forEach((c) => c()), s.length = 0;
  }, i = (c, d, f, p) => (c.addEventListener(d, f, p), () => c.removeEventListener(d, f, p)), u = de(() => [Vt(t), lr(r)], ([c, d]) => {
    a(), c && s.push(...n.flatMap((f) => o.map((p) => i(c, f, p, d))));
  }, { immediate: !0, flush: "post" }), l = () => {
    u(), a();
  };
  return cc(l), l;
}
const qn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Jn = "__vueuse_ssr_handlers__";
qn[Jn] = qn[Jn] || {};
function uc(e, { window: t = ur, scrollTarget: n } = {}) {
  const o = V(!1), r = () => {
    if (!t)
      return;
    const s = t.document, a = Vt(e);
    if (!a)
      o.value = !1;
    else {
      const i = a.getBoundingClientRect();
      o.value = i.top <= (t.innerHeight || s.documentElement.clientHeight) && i.left <= (t.innerWidth || s.documentElement.clientWidth) && i.bottom >= 0 && i.right >= 0;
    }
  };
  return de(() => Vt(e), () => r(), { immediate: !0, flush: "post" }), t && lc(n || t, "scroll", r, {
    capture: !1,
    passive: !0
  }), o;
}
var Yn;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(Yn || (Yn = {}));
var dc = Object.defineProperty, Xn = Object.getOwnPropertySymbols, fc = Object.prototype.hasOwnProperty, pc = Object.prototype.propertyIsEnumerable, Zn = (e, t, n) => t in e ? dc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, hc = (e, t) => {
  for (var n in t || (t = {}))
    fc.call(t, n) && Zn(e, n, t[n]);
  if (Xn)
    for (var n of Xn(t))
      pc.call(t, n) && Zn(e, n, t[n]);
  return e;
};
const mc = {
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
hc({
  linear: ic
}, mc);
const fe = (e) => {
  let t = uc(e).value;
  return t = t && e.offsetHeight > 0, t;
}, pe = (e) => e.tabIndex >= 0, eo = (e) => {
  const t = e.target;
  return on(t);
}, on = (e) => {
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
  return n && (!pe(n) || !fe(n)) ? on(n) : n;
}, vc = (e) => {
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
  return o && (!pe(o) || !fe(o)) ? rn(o) : o;
}, to = (e) => {
  const t = e.target;
  return rn(t);
}, rn = (e) => {
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
  return n && (!pe(n) || !fe(n)) ? rn(n) : n;
}, gc = (e) => {
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
  return o && (!pe(o) || !fe(o)) ? on(o) : o;
}, no = (e) => {
  const t = e.target;
  return sn(t);
}, sn = (e) => {
  var t;
  let n;
  if (e.previousElementSibling)
    n = e.previousElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    n = o == null ? void 0 : o.lastElementChild;
  }
  return n && (!pe(n) || !fe(n)) ? sn(n) : n;
}, oo = (e) => {
  const t = e.target;
  return an(t);
}, an = (e) => {
  var t;
  let n;
  if (e.nextElementSibling)
    n = e.nextElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    n = o == null ? void 0 : o.firstElementChild;
  }
  return n && (!pe(n) || !fe(n)) ? an(n) : n;
}, ro = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!pe(t) || !fe(t)) ? an(t) : t;
}, so = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!pe(t) || !fe(t)) ? sn(t) : t;
}, Xe = ["alt", "control", "shift", "meta"], yc = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, dr = {
  "keydown.up": (e) => {
    const t = eo(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.down": (e) => {
    const t = to(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.left": (e) => {
    const t = no(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.right": (e) => {
    const t = oo(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.control.up": (e) => {
    const t = vc(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = gc(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.left": (e) => {
    const t = ro(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.right": (e) => {
    const t = so(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.end": (e) => {
    const t = so(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = to(e);
      t && t.focus();
    }
  },
  "keydown.shift.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = eo(e);
      t && t.focus();
    }
  },
  "keydown.home": (e) => {
    const t = ro(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.tab": (e) => {
    const t = oo(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.shift.tab": (e) => {
    const t = no(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  }
};
function fr(e) {
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
    const s = yc[r.key] || r.key.toLowerCase();
    if (Xe.includes(s))
      return;
    const a = o.handlers || dr;
    for (const i of Object.keys(a)) {
      const [u, ...l] = i.split(".");
      if (u === "keydown" && l.includes(s)) {
        const c = a[i], d = l.filter((p) => Xe.includes(p)), f = Xe.some((p) => {
          const m = p.charAt(0).toUpperCase() + p.slice(1);
          return r.getModifierState(m);
        });
        if (d.length > 0) {
          if (f) {
            for (const p of Xe)
              if (l.includes(p)) {
                const m = p.charAt(0).toUpperCase() + p.slice(1);
                r.getModifierState(m) && c(r);
              }
          }
        } else
          f || c(r);
      }
    }
  };
  Mt(() => {
    for (const o of e) {
      const r = t(o);
      for (const s of r)
        s.addEventListener("keydown", n(o));
    }
  }), _r(() => {
    for (const o of e) {
      const r = t(o);
      for (const s of r)
        s.removeEventListener("keydown", n(o));
    }
  });
}
const _c = ["data-colindex", "data-rowindex", "data-editable", "contenteditable", "tabindex"], wc = { key: 1 }, bc = /* @__PURE__ */ q({
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
    const n = e, o = Z(n.tableid), r = V(null);
    let s = V(!1);
    const a = j(() => {
      const v = o.cellData(n.colIndex, n.rowIndex);
      if (o.columns[n.colIndex].format) {
        const y = o.columns[n.colIndex].format;
        return typeof y == "function" ? y(v) : typeof y == "string" ? Function(`"use strict";return (${y})`)()(v) : v;
      } else
        return v;
    }), i = (v) => {
      if (n.clickHandler) {
        n.clickHandler(v);
        return;
      }
      if (o.columns[n.colIndex].mask, o.columns[n.colIndex].modalComponent) {
        const y = r.value.getBoundingClientRect();
        o.modal.visible = !0, o.modal.colIndex = n.colIndex, o.modal.rowIndex = n.rowIndex, o.modal.parent = r.value, o.modal.top = y.top + y.height, o.modal.left = y.left, o.modal.width = l.value, o.modal.component = o.columns[n.colIndex].modalComponent, o.modal.componentProps = o.columns[n.colIndex].modalComponentProps;
      }
    };
    if (n.addNavigation) {
      let v = {
        ...dr,
        "keydown.f2": i,
        "keydown.alt.up": i,
        "keydown.alt.down": i,
        "keydown.alt.left": i,
        "keydown.alt.right": i
      };
      typeof n.addNavigation == "object" && (v = {
        ...v,
        ...n.addNavigation
      }), fr([
        {
          selectors: r,
          handlers: v
        }
      ]);
    }
    const u = j(() => o.columns[n.colIndex].align || "center"), l = j(() => o.columns[n.colIndex].width || "40ch");
    let c = "";
    const d = () => {
      r.value && (c = r.value.innerText);
    }, f = () => {
      r.value && r.value.innerHTML !== c && (c = r.value.innerText, r.value.dispatchEvent(new Event("change")), s.value = !0, o.columns[n.colIndex].format || o.setCellData(n.rowIndex, n.colIndex, c));
    }, p = (v, y) => y && v === 0 && y > 0 ? `${y}ch` : "inherit", m = {
      textAlign: u.value,
      width: l.value,
      backgroundColor: s.value ? "var(--cell-modified-color)" : "inherit",
      fontWeight: s.value ? "bold" : "inherit",
      paddingLeft: p(n.colIndex, (t = o.display[n.rowIndex]) == null ? void 0 : t.indent)
    };
    return (v, y) => ($(), A("td", {
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
      b(o).columns[e.colIndex].cellComponent ? ($(), Se(jt(b(o).columns[e.colIndex].cellComponent), Bt({
        key: 0,
        value: b(a)
      }, b(o).columns[e.colIndex].cellComponentProps), null, 16, ["value"])) : ($(), A("span", wc, le(b(a)), 1))
    ], 40, _c));
  }
}), Qe = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, Ec = /* @__PURE__ */ Qe(bc, [["__scopeId", "data-v-1738c6fc"]]), kc = ["tabindex"], Sc = {
  key: 0,
  tabIndex: -1,
  class: "list-index"
}, Ic = /* @__PURE__ */ q({
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
    mo((u) => ({
      "6b10edcf": b(r)
    }));
    const n = Z(t.tableid), o = V(null), r = n.numberedRowWidth.value, s = () => n.config.view !== "tree" ? "" : n.display[t.rowIndex].isRoot || n.display[t.rowIndex].isParent ? n.display[t.rowIndex].childrenOpen ? "-" : "+" : "", a = () => n.config.view !== "tree" || n.display[t.rowIndex].isRoot || n.display[t.rowIndex].open, i = (u) => {
      n.toggleRowExpand(u);
    };
    return t.addNavigation && fr([
      {
        selectors: o,
        handlers: t.addNavigation
      }
    ]), (u, l) => ct(($(), A("tr", {
      ref_key: "rowEl",
      ref: o,
      tabindex: e.tabIndex,
      class: "table-row"
    }, [
      b(n).config.view === "list" ? ($(), A("td", Sc, le(e.rowIndex + 1), 1)) : b(n).config.view === "tree" ? ($(), A("td", {
        key: 1,
        tabIndex: -1,
        class: "tree-index",
        onClick: l[0] || (l[0] = (c) => i(e.rowIndex))
      }, le(s()), 1)) : ge(u.$slots, "indexCell", { key: 2 }, void 0, !0),
      ge(u.$slots, "default", {}, void 0, !0)
    ], 8, kc)), [
      [Lt, a()]
    ]);
  }
}), Oc = /* @__PURE__ */ Qe(Ic, [["__scopeId", "data-v-c758303d"]]);
let Ze;
const Pc = new Uint8Array(16);
function $c() {
  if (!Ze && (Ze = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !Ze))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return Ze(Pc);
}
const W = [];
for (let e = 0; e < 256; ++e)
  W.push((e + 256).toString(16).slice(1));
function xc(e, t = 0) {
  return (W[e[t + 0]] + W[e[t + 1]] + W[e[t + 2]] + W[e[t + 3]] + "-" + W[e[t + 4]] + W[e[t + 5]] + "-" + W[e[t + 6]] + W[e[t + 7]] + "-" + W[e[t + 8]] + W[e[t + 9]] + "-" + W[e[t + 10]] + W[e[t + 11]] + W[e[t + 12]] + W[e[t + 13]] + W[e[t + 14]] + W[e[t + 15]]).toLowerCase();
}
const Nc = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), ao = {
  randomUUID: Nc
};
function pr(e, t, n) {
  if (ao.randomUUID && !t && !e)
    return ao.randomUUID();
  e = e || {};
  const o = e.random || (e.rng || $c)();
  if (o[6] = o[6] & 15 | 64, o[8] = o[8] & 63 | 128, t) {
    n = n || 0;
    for (let r = 0; r < 16; ++r)
      t[n + r] = o[r];
    return t;
  }
  return xc(o);
}
class Cc {
  constructor(t, n, o, r, s, a) {
    this.id = t || pr(), this.rows = o, this.columns = ve(n), this.config = ve(r), this.table = s || ve(this.createTableObject()), this.display = this.createDisplayObject(a), this.modal = ve({ visible: !1 });
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
const Rc = { key: 0 }, Ac = {
  class: "atable-header-row",
  tabindex: "-1"
}, Tc = {
  key: 0,
  id: "header-index"
}, Dc = /* @__PURE__ */ q({
  __name: "ATableHeader",
  props: {
    columns: null,
    config: null,
    tableid: null
  },
  setup(e) {
    const t = e;
    mo((s) => ({
      "1cb0fcc9": b(o)
    }));
    const n = Z(t.tableid), o = n.numberedRowWidth.value, r = (s) => ({
      minWidth: s.width || "40ch",
      textAlign: s.align || "center",
      width: n.config.fullWidth ? "auto" : null
    });
    return (s, a) => e.columns.length ? ($(), A("thead", Rc, [
      T("tr", Ac, [
        b(n).zeroColumn ? ($(), A("th", Tc)) : ke("", !0),
        ($(!0), A(Oe, null, Pe(e.columns, (i, u) => ($(), A("th", {
          key: u,
          tabindex: "-1",
          style: ce(r(i))
        }, [
          ge(s.$slots, "default", {}, () => [
            vo(le(i.label || String.fromCharCode(u + 97).toUpperCase()), 1)
          ], !0)
        ], 4))), 128))
      ])
    ])) : ke("", !0);
  }
}), Vc = /* @__PURE__ */ Qe(Dc, [["__scopeId", "data-v-8a8d9cee"]]), Mc = /* @__PURE__ */ q({
  __name: "ATableModal",
  props: {
    colIndex: null,
    rowIndex: null,
    tableid: null
  },
  setup(e) {
    Z(e.tableid);
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
      ge(n.$slots, "default", {}, void 0, !0)
    ], 544));
  }
}), Lc = /* @__PURE__ */ Qe(Mc, [["__scopeId", "data-v-8ac70767"]]), jc = /* @__PURE__ */ q({
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
    let o = n.modelValue ? n.modelValue : n.rows, r = new Cc(n.id, n.columns, o, n.config);
    et(r.id, r), de(
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
          const u = i.dataset.rowindex, l = i.dataset.colindex, c = document.querySelectorAll(`[data-rowindex='${u}'][data-colindex='${l}']`);
          c && c[0].focus();
        });
      }
    }), (a, i) => ($(), A("table", {
      class: "atable",
      style: ce({ width: b(r).config.fullWidth ? "100%" : "auto" })
    }, [
      ge(a.$slots, "header", { data: b(r) }, () => [
        st(Vc, {
          columns: b(r).columns,
          config: b(r).config,
          tableid: b(r).id
        }, null, 8, ["columns", "config", "tableid"])
      ], !0),
      T("tbody", null, [
        ge(a.$slots, "body", { data: b(r) }, () => [
          ($(!0), A(Oe, null, Pe(b(r).rows, (u, l) => ($(), Se(Oc, {
            key: u.id || b(pr)(),
            row: u,
            rowIndex: l,
            tableid: b(r).id
          }, {
            default: at(() => [
              ($(!0), A(Oe, null, Pe(b(r).columns, (c, d) => ($(), Se(Ec, {
                key: `${d}:${l}`,
                tableid: b(r).id,
                col: c,
                spellcheck: "false",
                rowIndex: l,
                colIndex: d + (b(r).zeroColumn ? 0 : -1),
                component: c.cellComponent,
                style: ce({
                  textAlign: (c == null ? void 0 : c.align) || "center",
                  minWidth: (c == null ? void 0 : c.width) || "40ch",
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
        ct(st(Lc, {
          colIndex: b(r).modal.colIndex,
          rowIndex: b(r).modal.rowIndex,
          tableid: b(r).id,
          style: ce({
            left: b(r).modal.left + "px",
            top: b(r).modal.top + "px",
            maxWidth: b(r).modal.width + "px"
          })
        }, {
          default: at(() => [
            ($(), Se(jt(b(r).modal.component), Bt({
              key: `${b(r).modal.rowIndex}:${b(r).modal.colIndex}`,
              colIndex: b(r).modal.colIndex,
              rowIndex: b(r).modal.rowIndex,
              tableid: b(r).id
            }, b(r).modal.componentProps), null, 16, ["colIndex", "rowIndex", "tableid"]))
          ]),
          _: 1
        }, 8, ["colIndex", "rowIndex", "tableid", "style"]), [
          [Lt, b(r).modal.visible]
        ])
      ], !0)
    ], 4));
  }
}), Bc = /* @__PURE__ */ Qe(jc, [["__scopeId", "data-v-9137b4c3"]]), Uc = /* @__PURE__ */ q({
  __name: "Records",
  setup(e) {
    const { stonecrop: t, isReady: n } = xo(), o = { view: "list" };
    return (r, s) => b(n) ? ($(), Se(b(Bc), {
      key: 0,
      columns: b(t).schema.schema.toArray(),
      rows: b(t).store.records,
      config: o
    }, null, 8, ["columns", "rows"])) : ke("", !0);
  }
}), hr = (e) => (co("data-v-18bfde6e"), e = e(), lo(), e), Hc = { class: "tabs" }, Fc = ["onKeydown"], Wc = { tabindex: "0" }, Gc = ["onKeydown"], zc = {
  version: "1.1",
  id: "Capa_1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  x: "0px",
  y: "0px",
  viewBox: "0 0 424.098 424.098",
  style: { "enable-background": "new 0 0 424.098 424.098" },
  "xml:space": "preserve"
}, Qc = /* @__PURE__ */ hr(() => /* @__PURE__ */ T("g", null, [
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
], -1)), Kc = [
  Qc
], qc = ["onKeydown"], Jc = { tabindex: "0" }, Yc = { style: { width: "11pt" } }, Xc = /* @__PURE__ */ hr(() => /* @__PURE__ */ T("g", { transform: "matrix(-0.08088215,0,0,0.08088215,9.8016177,3.1263021e-6)" }, [
  /* @__PURE__ */ T("path", {
    d: "M 93.148438,80.832031 C 109.5,57.742188 104.03125,25.769531 80.941406,9.421875 57.851562,-6.925781 25.878906,-1.460938 9.53125,21.632812 -6.816406,44.722656 -1.351562,76.691406 21.742188,93.039062 38.222656,104.70703 60.011719,105.60547 77.394531,95.339844 l 37.769529,37.542966 c 4.07813,4.29297 10.86328,4.46485 15.15625,0.38672 4.29297,-4.07422 4.46485,-10.85937 0.39063,-15.15234 -0.12891,-0.13672 -0.25391,-0.26172 -0.39063,-0.39063 z m -41.839844,3.5 C 33.0625,84.335938 18.269531,69.554688 18.257812,51.308594 18.253906,33.0625 33.035156,18.269531 51.285156,18.261719 c 18.222656,-0.0078 33.007813,14.75 33.042969,32.972656 0.03125,18.25 -14.742187,33.066406 -32.996094,33.097656 -0.0078,0 -0.01172,0 -0.02344,0 z m 0,0",
    style: { fill: "#000000", "fill-opacity": "1", "fill-rule": "nonzero", stroke: "none" },
    id: "path2"
  })
], -1)), Zc = [
  Xc
], el = /* @__PURE__ */ q({
  __name: "SheetNav",
  props: {
    breadcrumbs: null
  },
  setup(e) {
    const t = e, n = V([]), o = V(!0), r = V(!1), s = V(""), a = V(null), i = j(() => o.value ? "unrotated" : "rotated");
    Mt(() => {
      n.value = t.breadcrumbs || [];
    });
    const u = () => {
      o.value = !o.value;
    }, l = async () => {
      r.value = !r.value, await Fe(() => {
        a.value.focus();
      });
    }, c = (p) => {
      p.preventDefault(), p.stopPropagation();
    }, d = async (p) => {
      p.preventDefault(), p.stopPropagation(), await l();
    }, f = () => {
    };
    return (p, m) => {
      const v = wr("router-link");
      return $(), A("footer", null, [
        T("ul", Hc, [
          T("li", {
            class: "hidebreadcrumbs",
            onClick: u,
            onKeydown: qe(u, ["enter"])
          }, [
            T("a", Wc, [
              T("div", {
                class: io(b(i))
              }, "×", 2)
            ])
          ], 40, Fc),
          T("li", {
            class: "hometab",
            onClick: f,
            onKeydown: qe(f, ["enter"]),
            style: ce({ display: o.value ? "block" : "none" })
          }, [
            st(v, {
              to: "/home",
              tabindex: "0"
            }, {
              default: at(() => [
                ($(), A("svg", zc, Kc))
              ]),
              _: 1
            })
          ], 44, Gc),
          T("li", {
            class: "searchtab",
            onClick: l,
            onKeydown: qe(l, ["enter"]),
            style: ce({ display: o.value ? "block" : "none" })
          }, [
            T("a", Jc, [
              T("span", {
                style: ce({ display: r.value ? "none" : "block" })
              }, [
                ($(), A("svg", Yc, Zc))
              ], 4),
              ct(T("input", {
                "onUpdate:modelValue": m[0] || (m[0] = (y) => s.value = y),
                ref_key: "searchinput",
                ref: a,
                style: ce({ display: r.value ? "block" : "none" }),
                onClick: m[1] || (m[1] = (y) => c(y)),
                onInput: m[2] || (m[2] = (y) => c(y)),
                onBlur: m[3] || (m[3] = (y) => d(y)),
                onKeydown: m[4] || (m[4] = qe((y) => d(y), ["enter"])),
                type: "text"
              }, null, 36), [
                [br, s.value]
              ])
            ])
          ], 44, qc),
          ($(!0), A(Oe, null, Pe(n.value, (y, I) => ($(), A("li", {
            key: I,
            style: ce({ display: o.value ? "block" : "none" })
          }, [
            st(v, {
              tabindex: "0",
              to: y.to
            }, {
              default: at(() => [
                vo(le(y.title), 1)
              ]),
              _: 2
            }, 1032, ["to"])
          ], 4))), 128))
        ])
      ]);
    };
  }
});
const tl = /* @__PURE__ */ Wt(el, [["__scopeId", "data-v-18bfde6e"]]);
function rl(e) {
  e.component("ActionSet", Vr), e.component("CommandPalette", jr), e.component("Doctype", rc), e.component("Records", Uc), e.component("SheetNav", tl);
}
export {
  Vr as ActionSet,
  jr as CommandPalette,
  rc as Doctype,
  Uc as Records,
  tl as SheetNav,
  rl as install
};
//# sourceMappingURL=desktop.js.map
