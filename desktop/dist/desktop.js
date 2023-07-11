import { defineComponent as K, ref as V, onMounted as Gt, openBlock as $, createElementBlock as A, normalizeClass as co, createElementVNode as T, Fragment as Ie, renderList as Pe, toDisplayString as ce, createCommentVNode as ke, withDirectives as ct, vShow as Wt, pushScopeId as uo, popScopeId as fo, inject as Z, computed as j, createBlock as Se, resolveDynamicComponent as Qt, mergeProps as zt, unref as b, effectScope as po, markRaw as ie, onBeforeMount as wr, shallowRef as br, toRaw as ut, getCurrentInstance as Kt, reactive as ge, watch as de, isRef as Ge, isReactive as qt, toRef as _t, nextTick as We, getCurrentScope as ho, onScopeDispose as mo, h as go, provide as nt, toRefs as mn, watchEffect as Er, normalizeStyle as le, renderSlot as ve, createVNode as it, withCtx as at, useCssVars as vo, createTextVNode as yo, onBeforeUnmount as kr, resolveComponent as Sr, withKeys as Ye, vModelText as Or } from "vue";
const Jt = (e) => (uo("data-v-b7fdfbec"), e = e(), fo(), e), Ir = { class: "action-menu-icon" }, Pr = /* @__PURE__ */ Jt(() => /* @__PURE__ */ T("svg", {
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
], -1)), $r = /* @__PURE__ */ Jt(() => /* @__PURE__ */ T("svg", {
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
], -1)), xr = [
  Pr,
  $r
], Cr = /* @__PURE__ */ Jt(() => /* @__PURE__ */ T("div", { style: { "margin-right": "30px" } }, null, -1)), Nr = ["onclick"], Rr = { key: 1 }, Ar = ["onClick"], Tr = { class: "dropdown-container" }, Dr = { class: "dropdown" }, Vr = ["onclick"], Lr = ["href"], Mr = { class: "dropdown-item" }, jr = /* @__PURE__ */ K({
  __name: "ActionSet",
  props: {
    elements: null
  },
  setup(e) {
    const t = e, n = V([]), o = V(!1), r = V(null), s = V(!1), i = V(!1);
    Gt(() => {
      n.value = t.elements, a();
    });
    const a = () => {
      for (let d of n.value)
        d.elementType === "dropdown" && (d.show = !1);
    }, l = () => {
      s.value = !0, r.value = setTimeout(() => {
        s.value && (o.value = !0);
      }, 500);
    }, c = () => {
      s.value = !1, i.value = !1, clearTimeout(r.value), o.value = !1;
    }, u = (d) => {
      const f = !n.value[d].show;
      a(), n.value[d].show = f;
    };
    return (d, f) => ($(), A("div", {
      class: co([{ "open-set": o.value, "hovered-and-closed": i.value }, "action-set collapse"]),
      onMouseover: l,
      onMouseleave: c
    }, [
      T("div", Ir, [
        T("div", {
          id: "chevron",
          onClick: f[0] || (f[0] = (p) => i.value = !i.value)
        }, xr)
      ]),
      Cr,
      ($(!0), A(Ie, null, Pe(n.value, (p, m) => ($(), A("div", {
        class: "action-element",
        key: m
      }, [
        p.elementType == "button" ? ($(), A("button", {
          key: 0,
          onclick: p.action,
          class: "button-default"
        }, ce(p.label), 9, Nr)) : ke("", !0),
        p.elementType == "dropdown" ? ($(), A("div", Rr, [
          T("button", {
            class: "button-default",
            onClick: (g) => u(m)
          }, ce(p.label), 9, Ar),
          ct(T("div", Tr, [
            T("div", Dr, [
              ($(!0), A(Ie, null, Pe(p.actions, (g) => ($(), A("div", {
                key: g.label
              }, [
                g.action != null ? ($(), A("button", {
                  key: 0,
                  onclick: g.action,
                  class: "dropdown-item"
                }, ce(g.label), 9, Vr)) : g.link != null ? ($(), A("a", {
                  key: 1,
                  href: g.link
                }, [
                  T("button", Mr, ce(g.label), 1)
                ], 8, Lr)) : ke("", !0)
              ]))), 128))
            ])
          ], 512), [
            [Wt, p.show]
          ])
        ])) : ke("", !0)
      ]))), 128))
    ], 34));
  }
});
const Yt = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, Ur = /* @__PURE__ */ Yt(jr, [["__scopeId", "data-v-b7fdfbec"]]), Br = {};
function Hr(e, t) {
  return $(), A("dialog");
}
const Fr = /* @__PURE__ */ Yt(Br, [["render", Hr]]), Gr = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
};
var gn;
const Wr = typeof window < "u";
Wr && (gn = window == null ? void 0 : window.navigator) != null && gn.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function Qr(e) {
  return e;
}
const Pt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, $t = "__vueuse_ssr_handlers__";
Pt[$t] = Pt[$t] || {};
Pt[$t];
var vn;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(vn || (vn = {}));
var zr = Object.defineProperty, yn = Object.getOwnPropertySymbols, Kr = Object.prototype.hasOwnProperty, qr = Object.prototype.propertyIsEnumerable, _n = (e, t, n) => t in e ? zr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Jr = (e, t) => {
  for (var n in t || (t = {}))
    Kr.call(t, n) && _n(e, n, t[n]);
  if (yn)
    for (var n of yn(t))
      qr.call(t, n) && _n(e, n, t[n]);
  return e;
};
const Yr = {
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
Jr({
  linear: Qr
}, Yr);
K({
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
const Xr = /* @__PURE__ */ K({
  __name: "AForm",
  props: {
    modelValue: null,
    data: null,
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = V(n.data || {}), r = (i) => {
      let a = {};
      for (const [l, c] of Object.entries(i))
        ["component", "fieldtype"].includes(l) || (a[l] = c), l === "rows" && c && c.length === 0 && (a.rows = o.value[i.fieldname]);
      return a;
    }, s = j({
      get: () => n.modelValue.map((i, a) => j({
        get() {
          return i.value;
        },
        set: (l) => {
          n.modelValue[a].value = l, t("update:modelValue", n.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (i, a) => ($(), A("form", null, [
      ($(!0), A(Ie, null, Pe(e.modelValue, (l, c) => ($(), Se(Qt(l.component), zt({
        key: c,
        schema: l,
        modelValue: b(s)[c].value,
        "onUpdate:modelValue": (u) => b(s)[c].value = u,
        data: o.value[l.fieldname],
        readonly: e.readonly
      }, r(l)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
}), Zr = /* @__PURE__ */ Gr(Xr, [["__scopeId", "data-v-74d66cf2"]]), wn = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function es(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function ts(e) {
  var t;
  let n = e.value;
  if (n) {
    const o = es(n);
    if (o) {
      const r = e.instance.locale;
      n = o(r);
    }
  } else {
    const o = (t = e.instance.schema.fieldtype) == null ? void 0 : t.toLowerCase();
    o && wn[o] && (n = wn[o]);
  }
  return n;
}
function ns(e, t) {
  t || (t = "#");
  let n = e;
  const o = [t, "/", "-", "(", ")", " "];
  for (const r of o)
    n = n.replaceAll(r, "");
  return n;
}
function os(e, t, n) {
  n || (n = "#");
  let o = t;
  for (const r of e) {
    const s = o.indexOf(n);
    if (s !== -1) {
      const i = o.substring(0, s), a = o.substring(s + 1);
      o = i + r + a;
    }
  }
  return o.slice(0, t.length);
}
function rs(e, t) {
  const n = ts(t);
  if (!n)
    return;
  const o = "#", r = e.value, s = ns(r, o);
  if (s) {
    const i = os(s, n, o);
    t.instance.maskFilled && (t.instance.maskFilled = !i.includes(o)), e.value = i;
  } else
    e.value = n;
}
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
    mask: rs
  }
});
function xt(e) {
  this.message = e || "";
}
xt.prototype = Object.create(Error.prototype, {
  constructor: { value: xt },
  name: { value: "NotImplemented" },
  stack: {
    get: function() {
      return new Error().stack;
    }
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
   * @description The Stonecrop constructor initializes a new Stonecrop instance with the given registry, store, schema, workflow, and actions. If a Stonecrop instance has already been created, it returns the existing instance instead of creating a new one.
   * @example
   * const registry = new Registry()
   * const store = useDataStore()
   * const stonecrop = new Stonecrop(registry, store, schema, workflow, actions)
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
   * const doctype = await registry.getMeta('Task')
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
   * const doctype = await registry.getMeta('Task')
   * stonecrop.getMeta(doctype)
   */
  getMeta(t) {
    return this.registry.getMeta ? this.registry.getMeta(t.doctype) : new xt(t.doctype);
  }
  /**
   * @method getWorkflow
   * @param {DoctypeMeta} doctype - The doctype to get workflow for
   * @returns {void}
   * @description Gets the workflow for the given doctype
   * @example
   * const doctype = await registry.getMeta('Task')
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
   * const doctype = await registry.getMeta('Task')
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
   * const doctype = await registry.getMeta('Task')
   * await stonecrop.getRecords(doctype)
   * @example
   * const doctype = await registry.getMeta('Task')
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
   * const doctype = await registry.getMeta('Task')
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
   * const doctype = await registry.getMeta('Task')
   * stonecrop.runAction(doctype, 'CREATE')
   * @example
   * const doctype = await registry.getMeta('Task')
   * stonecrop.runAction(doctype, 'UPDATE', ['TASK-00001'])
   * @example
   * const doctype = await registry.getMeta('Task')
   * stonecrop.runAction(doctype, 'DELETE', ['TASK-00001'])
   * @example
   * const doctype = await registry.getMeta('Task')
   * stonecrop.runAction(doctype, 'TRANSITION', ['TASK-00001', 'TASK-00002'])
   */
  runAction(t, n, o) {
    const s = this.registry.registry[t.slug].actions.get(n), { initialState: i } = this.workflow;
    this.workflow.transition(i, { type: n }), s.length > 0 && s.forEach((a) => {
      new Function(a)(o);
    });
  }
}
var _o = !1;
function Xe(e, t, n) {
  return Array.isArray(e) ? (e.length = Math.max(e.length, t), e.splice(t, 1, n), n) : (e[t] = n, n);
}
function wt(e, t) {
  if (Array.isArray(e)) {
    e.splice(t, 1);
    return;
  }
  delete e[t];
}
function ss() {
  return wo().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function wo() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const is = typeof Proxy == "function", as = "devtools-plugin:setup", ls = "plugin:settings:set";
let xe, Ct;
function cs() {
  var e;
  return xe !== void 0 || (typeof window < "u" && window.performance ? (xe = !0, Ct = window.performance) : typeof global < "u" && (!((e = global.perf_hooks) === null || e === void 0) && e.performance) ? (xe = !0, Ct = global.perf_hooks.performance) : xe = !1), xe;
}
function us() {
  return cs() ? Ct.now() : Date.now();
}
let ds = class {
  constructor(t, n) {
    this.target = null, this.targetQueue = [], this.onQueue = [], this.plugin = t, this.hook = n;
    const o = {};
    if (t.settings)
      for (const i in t.settings) {
        const a = t.settings[i];
        o[i] = a.defaultValue;
      }
    const r = `__vue-devtools-plugin-settings__${t.id}`;
    let s = Object.assign({}, o);
    try {
      const i = localStorage.getItem(r), a = JSON.parse(i);
      Object.assign(s, a);
    } catch {
    }
    this.fallbacks = {
      getSettings() {
        return s;
      },
      setSettings(i) {
        try {
          localStorage.setItem(r, JSON.stringify(i));
        } catch {
        }
        s = i;
      },
      now() {
        return us();
      }
    }, n && n.on(ls, (i, a) => {
      i === this.plugin.id && this.fallbacks.setSettings(a);
    }), this.proxiedOn = new Proxy({}, {
      get: (i, a) => this.target ? this.target.on[a] : (...l) => {
        this.onQueue.push({
          method: a,
          args: l
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (i, a) => this.target ? this.target[a] : a === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(a) ? (...l) => (this.targetQueue.push({
        method: a,
        args: l,
        resolve: () => {
        }
      }), this.fallbacks[a](...l)) : (...l) => new Promise((c) => {
        this.targetQueue.push({
          method: a,
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
function bo(e, t) {
  const n = e, o = wo(), r = ss(), s = is && n.enableEarlyProxy;
  if (r && (o.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !s))
    r.emit(as, e, t);
  else {
    const i = s ? new ds(n, r) : null;
    (o.__VUE_DEVTOOLS_PLUGINS__ = o.__VUE_DEVTOOLS_PLUGINS__ || []).push({
      pluginDescriptor: n,
      setupFn: t,
      proxy: i
    }), i && t(i.proxiedTarget);
  }
}
/*!
  * pinia v2.0.33
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
let je;
const Qe = (e) => je = e, Eo = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
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
const dt = typeof window < "u", Be = (process.env.NODE_ENV !== "production" || !1) && process.env.NODE_ENV !== "test" && dt, bn = /* @__PURE__ */ (() => typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null })();
function fs(e, { autoBom: t = !1 } = {}) {
  return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob([String.fromCharCode(65279), e], { type: e.type }) : e;
}
function Xt(e, t, n) {
  const o = new XMLHttpRequest();
  o.open("GET", e), o.responseType = "blob", o.onload = function() {
    Oo(o.response, t, n);
  }, o.onerror = function() {
    console.error("could not download file");
  }, o.send();
}
function ko(e) {
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
const rt = typeof navigator == "object" ? navigator : { userAgent: "" }, So = /* @__PURE__ */ (() => /Macintosh/.test(rt.userAgent) && /AppleWebKit/.test(rt.userAgent) && !/Safari/.test(rt.userAgent))(), Oo = dt ? (
  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
  typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !So ? ps : (
    // Use msSaveOrOpenBlob as a second approach
    "msSaveOrOpenBlob" in rt ? hs : (
      // Fallback to using FileReader and a popup
      ms
    )
  )
) : () => {
};
function ps(e, t = "download", n) {
  const o = document.createElement("a");
  o.download = t, o.rel = "noopener", typeof e == "string" ? (o.href = e, o.origin !== location.origin ? ko(o.href) ? Xt(e, t, n) : (o.target = "_blank", ot(o)) : ot(o)) : (o.href = URL.createObjectURL(e), setTimeout(function() {
    URL.revokeObjectURL(o.href);
  }, 4e4), setTimeout(function() {
    ot(o);
  }, 0));
}
function hs(e, t = "download", n) {
  if (typeof e == "string")
    if (ko(e))
      Xt(e, t, n);
    else {
      const o = document.createElement("a");
      o.href = e, o.target = "_blank", setTimeout(function() {
        ot(o);
      });
    }
  else
    navigator.msSaveOrOpenBlob(fs(e, n), t);
}
function ms(e, t, n, o) {
  if (o = o || open("", "_blank"), o && (o.document.title = o.document.body.innerText = "downloading..."), typeof e == "string")
    return Xt(e, t, n);
  const r = e.type === "application/octet-stream", s = /constructor/i.test(String(bn.HTMLElement)) || "safari" in bn, i = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((i || r && s || So) && typeof FileReader < "u") {
    const a = new FileReader();
    a.onloadend = function() {
      let l = a.result;
      if (typeof l != "string")
        throw o = null, new Error("Wrong reader.result type");
      l = i ? l : l.replace(/^data:[^;]*;/, "data:attachment/file;"), o ? o.location.href = l : location.assign(l), o = null;
    }, a.readAsDataURL(e);
  } else {
    const a = URL.createObjectURL(e);
    o ? o.location.assign(a) : location.href = a, o = null, setTimeout(function() {
      URL.revokeObjectURL(a);
    }, 4e4);
  }
}
function H(e, t) {
  const n = "🍍 " + e;
  typeof __VUE_DEVTOOLS_TOAST__ == "function" ? __VUE_DEVTOOLS_TOAST__(n, t) : t === "error" ? console.error(n) : t === "warn" ? console.warn(n) : console.log(n);
}
function Zt(e) {
  return "_a" in e && "install" in e;
}
function Io() {
  if (!("clipboard" in navigator))
    return H("Your browser doesn't support the Clipboard API", "error"), !0;
}
function Po(e) {
  return e instanceof Error && e.message.toLowerCase().includes("document is not focused") ? (H('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn"), !0) : !1;
}
async function gs(e) {
  if (!Io())
    try {
      await navigator.clipboard.writeText(JSON.stringify(e.state.value)), H("Global state copied to clipboard.");
    } catch (t) {
      if (Po(t))
        return;
      H("Failed to serialize the state. Check the console for more details.", "error"), console.error(t);
    }
}
async function vs(e) {
  if (!Io())
    try {
      e.state.value = JSON.parse(await navigator.clipboard.readText()), H("Global state pasted from clipboard.");
    } catch (t) {
      if (Po(t))
        return;
      H("Failed to deserialize the state from clipboard. Check the console for more details.", "error"), console.error(t);
    }
}
async function ys(e) {
  try {
    Oo(new Blob([JSON.stringify(e.state.value)], {
      type: "text/plain;charset=utf-8"
    }), "pinia-state.json");
  } catch (t) {
    H("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
let re;
function _s() {
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
async function ws(e) {
  try {
    const n = await (await _s())();
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
const $o = "🍍 Pinia (root)", Nt = "_root";
function bs(e) {
  return Zt(e) ? {
    id: Nt,
    label: $o
  } : {
    id: e.$id,
    label: e.$id
  };
}
function Es(e) {
  if (Zt(e)) {
    const n = Array.from(e._s.keys()), o = e._s;
    return {
      state: n.map((s) => ({
        editable: !0,
        key: s,
        value: e.state.value[s]
      })),
      getters: n.filter((s) => o.get(s)._getters).map((s) => {
        const i = o.get(s);
        return {
          editable: !1,
          key: s,
          value: i._getters.reduce((a, l) => (a[l] = i[l], a), {})
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
function ks(e) {
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
function Ss(e) {
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
const st = [], be = "pinia:mutations", Q = "pinia", { assign: Os } = Object, lt = (e) => "🍍 " + e;
function Is(e, t) {
  bo({
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
            gs(t);
          },
          tooltip: "Serialize and copy the state"
        },
        {
          icon: "content_paste",
          action: async () => {
            await vs(t), n.sendInspectorTree(Q), n.sendInspectorState(Q);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            ys(t);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await ws(t), n.sendInspectorTree(Q), n.sendInspectorState(Q);
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
        const i = o.componentInstance.proxy._pStores;
        Object.values(i).forEach((a) => {
          o.instanceData.state.push({
            type: lt(a.$id),
            key: "state",
            editable: !0,
            value: a._isOptionsAPI ? {
              _custom: {
                value: ut(a.$state),
                actions: [
                  {
                    icon: "restore",
                    tooltip: "Reset the state of this store",
                    action: () => a.$reset()
                  }
                ]
              }
            } : (
              // NOTE: workaround to unwrap transferred refs
              Object.keys(a.$state).reduce((l, c) => (l[c] = a.$state[c], l), {})
            )
          }), a._getters && a._getters.length && o.instanceData.state.push({
            type: lt(a.$id),
            key: "getters",
            editable: !1,
            value: a._getters.reduce((l, c) => {
              try {
                l[c] = a[c];
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
        r = r.concat(Array.from(t._s.values())), o.rootNodes = (o.filter ? r.filter((s) => "$id" in s ? s.$id.toLowerCase().includes(o.filter.toLowerCase()) : $o.toLowerCase().includes(o.filter.toLowerCase())) : r).map(bs);
      }
    }), n.on.getInspectorState((o) => {
      if (o.app === e && o.inspectorId === Q) {
        const r = o.nodeId === Nt ? t : t._s.get(o.nodeId);
        if (!r)
          return;
        r && (o.state = Es(r));
      }
    }), n.on.editInspectorState((o, r) => {
      if (o.app === e && o.inspectorId === Q) {
        const s = o.nodeId === Nt ? t : t._s.get(o.nodeId);
        if (!s)
          return H(`store "${o.nodeId}" not found`, "error");
        const { path: i } = o;
        Zt(s) ? i.unshift("state") : (i.length !== 1 || !s._customProperties.has(i[0]) || i[0] in s.$state) && i.unshift("$state"), Ae = !1, o.set(s, i, o.state.value), Ae = !0;
      }
    }), n.on.editComponentState((o) => {
      if (o.type.startsWith("🍍")) {
        const r = o.type.replace(/^🍍\s*/, ""), s = t._s.get(r);
        if (!s)
          return H(`store "${r}" not found`, "error");
        const { path: i } = o;
        if (i[0] !== "state")
          return H(`Invalid path for store "${r}":
${i}
Only state can be modified.`);
        i[0] = "$state", Ae = !1, o.set(s, i, o.state.value), Ae = !0;
      }
    });
  });
}
function Ps(e, t) {
  st.includes(lt(t.$id)) || st.push(lt(t.$id)), bo({
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
    t.$onAction(({ after: i, onError: a, name: l, args: c }) => {
      const u = xo++;
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
      }), i((d) => {
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
      }), a((d) => {
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
    }, !0), t._customProperties.forEach((i) => {
      de(() => b(t[i]), (a, l) => {
        n.notifyComponentUpdate(), n.sendInspectorState(Q), Ae && n.addTimelineEvent({
          layerId: be,
          event: {
            time: o(),
            title: "Change",
            subtitle: i,
            data: {
              newValue: a,
              oldValue: l
            },
            groupId: Ee
          }
        });
      }, { deep: !0 });
    }), t.$subscribe(({ events: i, type: a }, l) => {
      if (n.notifyComponentUpdate(), n.sendInspectorState(Q), !Ae)
        return;
      const c = {
        time: o(),
        title: Ss(a),
        data: Os({ store: ee(t.$id) }, ks(i)),
        groupId: Ee
      };
      Ee = void 0, a === oe.patchFunction ? c.subtitle = "⤵️" : a === oe.patchObject ? c.subtitle = "🧩" : i && !Array.isArray(i) && (c.subtitle = i.type), i && (c.data["rawEvent(s)"] = {
        _custom: {
          display: "DebuggerEvent",
          type: "object",
          tooltip: "raw DebuggerEvent[]",
          value: i
        }
      }), n.addTimelineEvent({
        layerId: be,
        event: c
      });
    }, { detached: !0, flush: "sync" });
    const r = t._hotUpdate;
    t._hotUpdate = ie((i) => {
      r(i), n.addTimelineEvent({
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
let xo = 0, Ee;
function En(e, t) {
  const n = t.reduce((o, r) => (o[r] = ut(e)[r], o), {});
  for (const o in n)
    e[o] = function() {
      const r = xo, s = new Proxy(e, {
        get(...i) {
          return Ee = r, Reflect.get(...i);
        },
        set(...i) {
          return Ee = r, Reflect.set(...i);
        }
      });
      return n[o].apply(s, arguments);
    };
}
function $s({ app: e, store: t, options: n }) {
  if (!t.$id.startsWith("__hot:")) {
    if (n.state && (t._isOptionsAPI = !0), typeof n.state == "function") {
      En(
        // @ts-expect-error: can cast the store...
        t,
        Object.keys(n.actions)
      );
      const o = t._hotUpdate;
      ut(t)._hotUpdate = function(r) {
        o.apply(this, arguments), En(t, Object.keys(r._hmrPayload.actions));
      };
    }
    Ps(
      e,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      t
    );
  }
}
function xs() {
  const e = po(!0), t = e.run(() => V({}));
  let n = [], o = [];
  const r = ie({
    install(s) {
      Qe(r), r._a = s, s.provide(Eo, r), s.config.globalProperties.$pinia = r, Be && Is(s, r), o.forEach((i) => n.push(i)), o = [];
    },
    use(s) {
      return !this._a && !_o ? o.push(s) : n.push(s), this;
    },
    _p: n,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return Be && typeof Proxy < "u" && r.use($s), r;
}
function Co(e, t) {
  for (const n in t) {
    const o = t[n];
    if (!(n in e))
      continue;
    const r = e[n];
    $e(r) && $e(o) && !Ge(o) && !qt(o) ? e[n] = Co(r, o) : e[n] = o;
  }
  return e;
}
const No = () => {
};
function kn(e, t, n, o = No) {
  e.push(t);
  const r = () => {
    const s = e.indexOf(t);
    s > -1 && (e.splice(s, 1), o());
  };
  return !n && ho() && mo(r), r;
}
function Ce(e, ...t) {
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
    $e(r) && $e(o) && e.hasOwnProperty(n) && !Ge(o) && !qt(o) ? e[n] = Rt(r, o) : e[n] = o;
  }
  return e;
}
const Cs = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
);
function Ns(e) {
  return !$e(e) || !e.hasOwnProperty(Cs);
}
const { assign: X } = Object;
function Sn(e) {
  return !!(Ge(e) && e.effect);
}
function On(e, t, n, o) {
  const { state: r, actions: s, getters: i } = t, a = n.state.value[e];
  let l;
  function c() {
    !a && (process.env.NODE_ENV === "production" || !o) && (n.state.value[e] = r ? r() : {});
    const u = process.env.NODE_ENV !== "production" && o ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      mn(V(r ? r() : {}).value)
    ) : mn(n.state.value[e]);
    return X(u, s, Object.keys(i || {}).reduce((d, f) => (process.env.NODE_ENV !== "production" && f in u && console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${f}" in store "${e}".`), d[f] = ie(j(() => {
      Qe(n);
      const p = n._s.get(e);
      return i[f].call(p, p);
    })), d), {}));
  }
  return l = At(e, c, t, n, o, !0), l;
}
function At(e, t, n = {}, o, r, s) {
  let i;
  const a = X({ actions: {} }, n);
  if (process.env.NODE_ENV !== "production" && !o._e.active)
    throw new Error("Pinia destroyed");
  const l = {
    deep: !0
    // flush: 'post',
  };
  process.env.NODE_ENV !== "production" && !_o && (l.onTrigger = (k) => {
    c ? p = k : c == !1 && !S._hotUpdating && (Array.isArray(p) ? p.push(k) : console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug."));
  });
  let c, u, d = ie([]), f = ie([]), p;
  const m = o.state.value[e];
  !s && !m && (process.env.NODE_ENV === "production" || !r) && (o.state.value[e] = {});
  const g = V({});
  let y;
  function O(k) {
    let _;
    c = u = !1, process.env.NODE_ENV !== "production" && (p = []), typeof k == "function" ? (k(o.state.value[e]), _ = {
      type: oe.patchFunction,
      storeId: e,
      events: p
    }) : (Rt(o.state.value[e], k), _ = {
      type: oe.patchObject,
      payload: k,
      storeId: e,
      events: p
    });
    const D = y = Symbol();
    We().then(() => {
      y === D && (c = !0);
    }), u = !0, Ce(d, _, o.state.value[e]);
  }
  const I = s ? function() {
    const { state: _ } = n, D = _ ? _() : {};
    this.$patch((U) => {
      X(U, D);
    });
  } : (
    /* istanbul ignore next */
    process.env.NODE_ENV !== "production" ? () => {
      throw new Error(`🍍: Store "${e}" is built using the setup syntax and does not implement $reset().`);
    } : No
  );
  function L() {
    i.stop(), d = [], f = [], o._s.delete(e);
  }
  function F(k, _) {
    return function() {
      Qe(o);
      const D = Array.from(arguments), U = [], _e = [];
      function Ve(W) {
        U.push(W);
      }
      function Je(W) {
        _e.push(W);
      }
      Ce(f, {
        args: D,
        name: k,
        store: S,
        after: Ve,
        onError: Je
      });
      let ne;
      try {
        ne = _.apply(this && this.$id === e ? this : S, D);
      } catch (W) {
        throw Ce(_e, W), W;
      }
      return ne instanceof Promise ? ne.then((W) => (Ce(U, W), W)).catch((W) => (Ce(_e, W), Promise.reject(W))) : (Ce(U, ne), ne);
    };
  }
  const J = /* @__PURE__ */ ie({
    actions: {},
    getters: {},
    state: [],
    hotState: g
  }), Y = {
    _p: o,
    // _s: scope,
    $id: e,
    $onAction: kn.bind(null, f),
    $patch: O,
    $reset: I,
    $subscribe(k, _ = {}) {
      const D = kn(d, k, _.detached, () => U()), U = i.run(() => de(() => o.state.value[e], (_e) => {
        (_.flush === "sync" ? u : c) && k({
          storeId: e,
          type: oe.direct,
          events: p
        }, _e);
      }, X({}, l, _)));
      return D;
    },
    $dispose: L
  }, S = ge(process.env.NODE_ENV !== "production" || Be ? X(
    {
      _hmrPayload: J,
      _customProperties: ie(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    Y
    // must be added later
    // setupStore
  ) : Y);
  o._s.set(e, S);
  const te = o._e.run(() => (i = po(), i.run(() => t())));
  for (const k in te) {
    const _ = te[k];
    if (Ge(_) && !Sn(_) || qt(_))
      process.env.NODE_ENV !== "production" && r ? Xe(g.value, k, _t(te, k)) : s || (m && Ns(_) && (Ge(_) ? _.value = m[k] : Rt(_, m[k])), o.state.value[e][k] = _), process.env.NODE_ENV !== "production" && J.state.push(k);
    else if (typeof _ == "function") {
      const D = process.env.NODE_ENV !== "production" && r ? _ : F(k, _);
      te[k] = D, process.env.NODE_ENV !== "production" && (J.actions[k] = _), a.actions[k] = _;
    } else
      process.env.NODE_ENV !== "production" && Sn(_) && (J.getters[k] = s ? (
        // @ts-expect-error
        n.getters[k]
      ) : _, dt && (te._getters || // @ts-expect-error: same
      (te._getters = ie([]))).push(k));
  }
  if (X(S, te), X(ut(S), te), Object.defineProperty(S, "$state", {
    get: () => process.env.NODE_ENV !== "production" && r ? g.value : o.state.value[e],
    set: (k) => {
      if (process.env.NODE_ENV !== "production" && r)
        throw new Error("cannot set hotState");
      O((_) => {
        X(_, k);
      });
    }
  }), process.env.NODE_ENV !== "production" && (S._hotUpdate = ie((k) => {
    S._hotUpdating = !0, k._hmrPayload.state.forEach((_) => {
      if (_ in S.$state) {
        const D = k.$state[_], U = S.$state[_];
        typeof D == "object" && $e(D) && $e(U) ? Co(D, U) : k.$state[_] = U;
      }
      Xe(S, _, _t(k.$state, _));
    }), Object.keys(S.$state).forEach((_) => {
      _ in k.$state || wt(S, _);
    }), c = !1, u = !1, o.state.value[e] = _t(k._hmrPayload, "hotState"), u = !0, We().then(() => {
      c = !0;
    });
    for (const _ in k._hmrPayload.actions) {
      const D = k[_];
      Xe(S, _, F(_, D));
    }
    for (const _ in k._hmrPayload.getters) {
      const D = k._hmrPayload.getters[_], U = s ? (
        // special handling of options api
        j(() => (Qe(o), D.call(S, S)))
      ) : D;
      Xe(S, _, U);
    }
    Object.keys(S._hmrPayload.getters).forEach((_) => {
      _ in k._hmrPayload.getters || wt(S, _);
    }), Object.keys(S._hmrPayload.actions).forEach((_) => {
      _ in k._hmrPayload.actions || wt(S, _);
    }), S._hmrPayload = k._hmrPayload, S._getters = k._getters, S._hotUpdating = !1;
  })), Be) {
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
    if (Be) {
      const _ = i.run(() => k({
        store: S,
        app: o._a,
        pinia: o,
        options: a
      }));
      Object.keys(_ || {}).forEach((D) => S._customProperties.add(D)), X(S, _);
    } else
      X(S, i.run(() => k({
        store: S,
        app: o._a,
        pinia: o,
        options: a
      })));
  }), process.env.NODE_ENV !== "production" && S.$state && typeof S.$state == "object" && typeof S.$state.constructor == "function" && !S.$state.constructor.toString().includes("[native code]") && console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${S.$id}".`), m && s && n.hydrate && n.hydrate(S.$state, m), c = !0, u = !0, S;
}
function Rs(e, t, n) {
  let o, r;
  const s = typeof t == "function";
  typeof e == "string" ? (o = e, r = s ? n : t) : (r = e, o = e.id);
  function i(a, l) {
    const c = Kt();
    if (a = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (process.env.NODE_ENV === "test" && je && je._testing ? null : a) || c && Z(Eo, null), a && Qe(a), process.env.NODE_ENV !== "production" && !je)
      throw new Error(`[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?
	const pinia = createPinia()
	app.use(pinia)
This will fail in production.`);
    a = je, a._s.has(o) || (s ? At(o, t, r, a) : On(o, r, a), process.env.NODE_ENV !== "production" && (i._pinia = a));
    const u = a._s.get(o);
    if (process.env.NODE_ENV !== "production" && l) {
      const d = "__hot:" + o, f = s ? At(d, t, r, a, !0) : On(d, X({}, r), a, !0);
      l._hotUpdate(f), delete a.state.value[d], a._s.delete(d);
    }
    if (process.env.NODE_ENV !== "production" && dt && c && c.proxy && // avoid adding stores that are just built for hot module replacement
    !l) {
      const d = c.proxy, f = "_pStores" in d ? d._pStores : d._pStores = {};
      f[o] = u;
    }
    return u;
  }
  return i.$id = o, i;
}
const As = Rs("data", () => {
  const e = V([]), t = V({});
  return { records: e, record: t };
});
function Ro(e) {
  e || (e = Z("$registry"));
  const t = As(), n = V(new Ue(e, t)), o = V(!1);
  return wr(async () => {
    var r, s;
    const i = e.router.currentRoute.value, a = (r = i.params.records) == null ? void 0 : r.toString().toLowerCase(), l = (s = i.params.record) == null ? void 0 : s.toString().toLowerCase();
    if (!a && !l)
      return;
    const c = await e.getMeta(a);
    e.addDoctype(c), n.value.setup(c), a && (l ? await n.value.getRecord(c, l) : await n.value.getRecords(c)), n.value.runAction(c, "LOAD", l ? [l] : void 0), o.value = !0;
  }), { stonecrop: n, isReady: o };
}
function Ts() {
  return Ao().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function Ao() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const Ds = typeof Proxy == "function", Vs = "devtools-plugin:setup", Ls = "plugin:settings:set";
let Ne, Tt;
function Ms() {
  var e;
  return Ne !== void 0 || (typeof window < "u" && window.performance ? (Ne = !0, Tt = window.performance) : typeof global < "u" && (!((e = global.perf_hooks) === null || e === void 0) && e.performance) ? (Ne = !0, Tt = global.perf_hooks.performance) : Ne = !1), Ne;
}
function js() {
  return Ms() ? Tt.now() : Date.now();
}
class Us {
  constructor(t, n) {
    this.target = null, this.targetQueue = [], this.onQueue = [], this.plugin = t, this.hook = n;
    const o = {};
    if (t.settings)
      for (const i in t.settings) {
        const a = t.settings[i];
        o[i] = a.defaultValue;
      }
    const r = `__vue-devtools-plugin-settings__${t.id}`;
    let s = Object.assign({}, o);
    try {
      const i = localStorage.getItem(r), a = JSON.parse(i);
      Object.assign(s, a);
    } catch {
    }
    this.fallbacks = {
      getSettings() {
        return s;
      },
      setSettings(i) {
        try {
          localStorage.setItem(r, JSON.stringify(i));
        } catch {
        }
        s = i;
      },
      now() {
        return js();
      }
    }, n && n.on(Ls, (i, a) => {
      i === this.plugin.id && this.fallbacks.setSettings(a);
    }), this.proxiedOn = new Proxy({}, {
      get: (i, a) => this.target ? this.target.on[a] : (...l) => {
        this.onQueue.push({
          method: a,
          args: l
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (i, a) => this.target ? this.target[a] : a === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(a) ? (...l) => (this.targetQueue.push({
        method: a,
        args: l,
        resolve: () => {
        }
      }), this.fallbacks[a](...l)) : (...l) => new Promise((c) => {
        this.targetQueue.push({
          method: a,
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
function Bs(e, t) {
  const n = e, o = Ao(), r = Ts(), s = Ds && n.enableEarlyProxy;
  if (r && (o.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !s))
    r.emit(Vs, e, t);
  else {
    const i = s ? new Us(n, r) : null;
    (o.__VUE_DEVTOOLS_PLUGINS__ = o.__VUE_DEVTOOLS_PLUGINS__ || []).push({
      pluginDescriptor: n,
      setupFn: t,
      proxy: i
    }), i && t(i.proxiedTarget);
  }
}
/*!
  * vue-router v4.1.6
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
const ae = typeof window < "u";
function Hs(e) {
  return e.__esModule || e[Symbol.toStringTag] === "Module";
}
const R = Object.assign;
function bt(e, t) {
  const n = {};
  for (const o in t) {
    const r = t[o];
    n[o] = q(r) ? r.map(e) : e(r);
  }
  return n;
}
const He = () => {
}, q = Array.isArray;
function C(e) {
  const t = Array.from(arguments).slice(1);
  console.warn.apply(console, ["[Vue Router warn]: " + e].concat(t));
}
const Fs = /\/$/, Gs = (e) => e.replace(Fs, "");
function Et(e, t, n = "/") {
  let o, r = {}, s = "", i = "";
  const a = t.indexOf("#");
  let l = t.indexOf("?");
  return a < l && a >= 0 && (l = -1), l > -1 && (o = t.slice(0, l), s = t.slice(l + 1, a > -1 ? a : t.length), r = e(s)), a > -1 && (o = o || t.slice(0, a), i = t.slice(a, t.length)), o = zs(o ?? t, n), {
    fullPath: o + (s && "?") + s + i,
    path: o,
    query: r,
    hash: i
  };
}
function Ws(e, t) {
  const n = t.query ? e(t.query) : "";
  return t.path + (n && "?") + n + (t.hash || "");
}
function In(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || "/";
}
function Pn(e, t, n) {
  const o = t.matched.length - 1, r = n.matched.length - 1;
  return o > -1 && o === r && ye(t.matched[o], n.matched[r]) && To(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function ye(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t);
}
function To(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (!Qs(e[n], t[n]))
      return !1;
  return !0;
}
function Qs(e, t) {
  return q(e) ? $n(e, t) : q(t) ? $n(t, e) : e === t;
}
function $n(e, t) {
  return q(t) ? e.length === t.length && e.every((n, o) => n === t[o]) : e.length === 1 && e[0] === t;
}
function zs(e, t) {
  if (e.startsWith("/"))
    return e;
  if (process.env.NODE_ENV !== "production" && !t.startsWith("/"))
    return C(`Cannot resolve a relative location without an absolute path. Trying to resolve "${e}" from "${t}". It should look like "/${t}".`), e;
  if (!e)
    return t;
  const n = t.split("/"), o = e.split("/");
  let r = n.length - 1, s, i;
  for (s = 0; s < o.length; s++)
    if (i = o[s], i !== ".")
      if (i === "..")
        r > 1 && r--;
      else
        break;
  return n.slice(0, r).join("/") + "/" + o.slice(s - (s === o.length ? 1 : 0)).join("/");
}
var ze;
(function(e) {
  e.pop = "pop", e.push = "push";
})(ze || (ze = {}));
var Fe;
(function(e) {
  e.back = "back", e.forward = "forward", e.unknown = "";
})(Fe || (Fe = {}));
function Ks(e) {
  if (!e)
    if (ae) {
      const t = document.querySelector("base");
      e = t && t.getAttribute("href") || "/", e = e.replace(/^\w+:\/\/[^\/]+/, "");
    } else
      e = "/";
  return e[0] !== "/" && e[0] !== "#" && (e = "/" + e), Gs(e);
}
const qs = /^[^#]+#/;
function Js(e, t) {
  return e.replace(qs, "#") + t;
}
function Ys(e, t) {
  const n = document.documentElement.getBoundingClientRect(), o = e.getBoundingClientRect();
  return {
    behavior: t.behavior,
    left: o.left - n.left - (t.left || 0),
    top: o.top - n.top - (t.top || 0)
  };
}
const ft = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function Xs(e) {
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
    t = Ys(r, e);
  } else
    t = e;
  "scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left != null ? t.left : window.pageXOffset, t.top != null ? t.top : window.pageYOffset);
}
function xn(e, t) {
  return (history.state ? history.state.position - t : -1) + e;
}
const Dt = /* @__PURE__ */ new Map();
function Zs(e, t) {
  Dt.set(e, t);
}
function ei(e) {
  const t = Dt.get(e);
  return Dt.delete(e), t;
}
let ti = () => location.protocol + "//" + location.host;
function Do(e, t) {
  const { pathname: n, search: o, hash: r } = t, s = e.indexOf("#");
  if (s > -1) {
    let a = r.includes(e.slice(s)) ? e.slice(s).length : 1, l = r.slice(a);
    return l[0] !== "/" && (l = "/" + l), In(l, "");
  }
  return In(n, e) + o + r;
}
function ni(e, t, n, o) {
  let r = [], s = [], i = null;
  const a = ({ state: f }) => {
    const p = Do(e, location), m = n.value, g = t.value;
    let y = 0;
    if (f) {
      if (n.value = p, t.value = f, i && i === m) {
        i = null;
        return;
      }
      y = g ? f.position - g.position : 0;
    } else
      o(p);
    r.forEach((O) => {
      O(n.value, m, {
        delta: y,
        type: ze.pop,
        direction: y ? y > 0 ? Fe.forward : Fe.back : Fe.unknown
      });
    });
  };
  function l() {
    i = n.value;
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
    f.state && f.replaceState(R({}, f.state, { scroll: ft() }), "");
  }
  function d() {
    for (const f of s)
      f();
    s = [], window.removeEventListener("popstate", a), window.removeEventListener("beforeunload", u);
  }
  return window.addEventListener("popstate", a), window.addEventListener("beforeunload", u), {
    pauseListeners: l,
    listen: c,
    destroy: d
  };
}
function Cn(e, t, n, o = !1, r = !1) {
  return {
    back: e,
    current: t,
    forward: n,
    replaced: o,
    position: window.history.length,
    scroll: r ? ft() : null
  };
}
function oi(e) {
  const { history: t, location: n } = window, o = {
    value: Do(e, n)
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
    const d = e.indexOf("#"), f = d > -1 ? (n.host && document.querySelector("base") ? e : e.slice(d)) + l : ti() + e + l;
    try {
      t[u ? "replaceState" : "pushState"](c, "", f), r.value = c;
    } catch (p) {
      process.env.NODE_ENV !== "production" ? C("Error with push/replace State", p) : console.error(p), n[u ? "replace" : "assign"](f);
    }
  }
  function i(l, c) {
    const u = R({}, t.state, Cn(
      r.value.back,
      // keep back and forward entries but override current position
      l,
      r.value.forward,
      !0
    ), c, { position: r.value.position });
    s(l, u, !0), o.value = l;
  }
  function a(l, c) {
    const u = R(
      {},
      // use current history state to gracefully handle a wrong call to
      // history.replaceState
      // https://github.com/vuejs/router/issues/366
      r.value,
      t.state,
      {
        forward: l,
        scroll: ft()
      }
    );
    process.env.NODE_ENV !== "production" && !t.state && C(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:

history.replaceState(history.state, '', url)

You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`), s(u.current, u, !0);
    const d = R({}, Cn(o.value, l, null), { position: u.position + 1 }, c);
    s(l, d, !1), o.value = l;
  }
  return {
    location: o,
    state: r,
    push: a,
    replace: i
  };
}
function ri(e) {
  e = Ks(e);
  const t = oi(e), n = ni(e, t.state, t.location, t.replace);
  function o(s, i = !0) {
    i || n.pauseListeners(), history.go(s);
  }
  const r = R({
    // it's overridden right after
    location: "",
    base: e,
    go: o,
    createHref: Js.bind(null, e)
  }, t, n);
  return Object.defineProperty(r, "location", {
    enumerable: !0,
    get: () => t.location.value
  }), Object.defineProperty(r, "state", {
    enumerable: !0,
    get: () => t.state.value
  }), r;
}
function si(e) {
  return typeof e == "string" || e && typeof e == "object";
}
function Vo(e) {
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
var Nn;
(function(e) {
  e[e.aborted = 4] = "aborted", e[e.cancelled = 8] = "cancelled", e[e.duplicated = 16] = "duplicated";
})(Nn || (Nn = {}));
const ii = {
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
    return `Redirected from "${e.fullPath}" to "${li(t)}" via a navigation guard.`;
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
  return process.env.NODE_ENV !== "production" ? R(new Error(ii[e](t)), {
    type: e,
    [Vt]: !0
  }, t) : R(new Error(), {
    type: e,
    [Vt]: !0
  }, t);
}
function se(e, t) {
  return e instanceof Error && Vt in e && (t == null || !!(e.type & t));
}
const ai = ["params", "query", "hash"];
function li(e) {
  if (typeof e == "string")
    return e;
  if ("path" in e)
    return e.path;
  const t = {};
  for (const n of ai)
    n in e && (t[n] = e[n]);
  return JSON.stringify(t, null, 2);
}
const Rn = "[^/]+?", ci = {
  sensitive: !1,
  strict: !1,
  start: !0,
  end: !0
}, ui = /[.+*?^${}()[\]/\\]/g;
function di(e, t) {
  const n = R({}, ci, t), o = [];
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
        d || (r += "/"), r += f.value.replace(ui, "\\$&"), p += 40;
      else if (f.type === 1) {
        const { value: m, repeatable: g, optional: y, regexp: O } = f;
        s.push({
          name: m,
          repeatable: g,
          optional: y
        });
        const I = O || Rn;
        if (I !== Rn) {
          p += 10;
          try {
            new RegExp(`(${I})`);
          } catch (F) {
            throw new Error(`Invalid custom RegExp for param "${m}" (${I}): ` + F.message);
          }
        }
        let L = g ? `((?:${I})(?:/(?:${I}))*)` : `(${I})`;
        d || (L = // avoid an optional / if there are more segments e.g. /:p?-static
        // or /:p?-:p2
        y && c.length < 2 ? `(?:/${L})` : "/" + L), y && (L += "?"), r += L, p += 20, y && (p += -8), g && (p += -20), I === ".*" && (p += -50);
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
  const i = new RegExp(r, n.sensitive ? "" : "i");
  function a(c) {
    const u = c.match(i), d = {};
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
    re: i,
    score: o,
    keys: s,
    parse: a,
    stringify: l
  };
}
function fi(e, t) {
  let n = 0;
  for (; n < e.length && n < t.length; ) {
    const o = t[n] - e[n];
    if (o)
      return o;
    n++;
  }
  return e.length < t.length ? e.length === 1 && e[0] === 40 + 40 ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === 40 + 40 ? 1 : -1 : 0;
}
function pi(e, t) {
  let n = 0;
  const o = e.score, r = t.score;
  for (; n < o.length && n < r.length; ) {
    const s = fi(o[n], r[n]);
    if (s)
      return s;
    n++;
  }
  if (Math.abs(r.length - o.length) === 1) {
    if (An(o))
      return 1;
    if (An(r))
      return -1;
  }
  return r.length - o.length;
}
function An(e) {
  const t = e[e.length - 1];
  return e.length > 0 && t[t.length - 1] < 0;
}
const hi = {
  type: 0,
  value: ""
}, mi = /[a-zA-Z0-9_]/;
function gi(e) {
  if (!e)
    return [[]];
  if (e === "/")
    return [[hi]];
  if (!e.startsWith("/"))
    throw new Error(process.env.NODE_ENV !== "production" ? `Route paths should start with a "/": "${e}" should be "/${e}".` : `Invalid path "${e}"`);
  function t(p) {
    throw new Error(`ERR (${n})/"${c}": ${p}`);
  }
  let n = 0, o = n;
  const r = [];
  let s;
  function i() {
    s && r.push(s), s = [];
  }
  let a = 0, l, c = "", u = "";
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
  for (; a < e.length; ) {
    if (l = e[a++], l === "\\" && n !== 2) {
      o = n, n = 4;
      continue;
    }
    switch (n) {
      case 0:
        l === "/" ? (c && d(), i()) : l === ":" ? (d(), n = 1) : f();
        break;
      case 4:
        f(), n = o;
        break;
      case 1:
        l === "(" ? n = 2 : mi.test(l) ? f() : (d(), n = 0, l !== "*" && l !== "?" && l !== "+" && a--);
        break;
      case 2:
        l === ")" ? u[u.length - 1] == "\\" ? u = u.slice(0, -1) + l : n = 3 : u += l;
        break;
      case 3:
        d(), n = 0, l !== "*" && l !== "?" && l !== "+" && a--, u = "";
        break;
      default:
        t("Unknown state");
        break;
    }
  }
  return n === 2 && t(`Unfinished custom RegExp for param "${c}"`), d(), i(), r;
}
function vi(e, t, n) {
  const o = di(gi(e.path), n);
  if (process.env.NODE_ENV !== "production") {
    const s = /* @__PURE__ */ new Set();
    for (const i of o.keys)
      s.has(i.name) && C(`Found duplicated params with name "${i.name}" for path "${e.path}". Only the last one will be available on "$route.params".`), s.add(i.name);
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
function yi(e, t) {
  const n = [], o = /* @__PURE__ */ new Map();
  t = Vn({ strict: !1, end: !0, sensitive: !1 }, t);
  function r(u) {
    return o.get(u);
  }
  function s(u, d, f) {
    const p = !f, m = _i(u);
    process.env.NODE_ENV !== "production" && ki(m, d), m.aliasOf = f && f.record;
    const g = Vn(t, u), y = [
      m
    ];
    if ("alias" in u) {
      const L = typeof u.alias == "string" ? [u.alias] : u.alias;
      for (const F of L)
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
    for (const L of y) {
      const { path: F } = L;
      if (d && F[0] !== "/") {
        const J = d.record.path, Y = J[J.length - 1] === "/" ? "" : "/";
        L.path = d.record.path + (F && Y + F);
      }
      if (process.env.NODE_ENV !== "production" && L.path === "*")
        throw new Error(`Catch all routes ("*") must now be defined using a param with a custom regexp.
See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.`);
      if (O = vi(L, d, g), process.env.NODE_ENV !== "production" && d && F[0] === "/" && Si(O, d), f ? (f.alias.push(O), process.env.NODE_ENV !== "production" && Ei(f, O)) : (I = I || O, I !== O && I.alias.push(O), p && u.name && !Dn(O) && i(u.name)), m.children) {
        const J = m.children;
        for (let Y = 0; Y < J.length; Y++)
          s(J[Y], O, f && f.children[Y]);
      }
      f = f || O, (O.record.components && Object.keys(O.record.components).length || O.record.name || O.record.redirect) && l(O);
    }
    return I ? () => {
      i(I);
    } : He;
  }
  function i(u) {
    if (Vo(u)) {
      const d = o.get(u);
      d && (o.delete(u), n.splice(n.indexOf(d), 1), d.children.forEach(i), d.alias.forEach(i));
    } else {
      const d = n.indexOf(u);
      d > -1 && (n.splice(d, 1), u.record.name && o.delete(u.record.name), u.children.forEach(i), u.alias.forEach(i));
    }
  }
  function a() {
    return n;
  }
  function l(u) {
    let d = 0;
    for (; d < n.length && pi(u, n[d]) >= 0 && // Adding children with empty path should still appear before the parent
    // https://github.com/vuejs/router/issues/1124
    (u.record.path !== n[d].record.path || !Lo(u, n[d])); )
      d++;
    n.splice(d, 0, u), u.record.name && !Dn(u) && o.set(u.record.name, u);
  }
  function c(u, d) {
    let f, p = {}, m, g;
    if ("name" in u && u.name) {
      if (f = o.get(u.name), !f)
        throw De(1, {
          location: u
        });
      if (process.env.NODE_ENV !== "production") {
        const I = Object.keys(u.params || {}).filter((L) => !f.keys.find((F) => F.name === L));
        I.length && C(`Discarded invalid param(s) "${I.join('", "')}" when navigating. See https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22 for more details.`);
      }
      g = f.record.name, p = R(
        // paramsFromLocation is a new object
        Tn(
          d.params,
          // only keep params that exist in the resolved location
          // TODO: only keep optional params coming from a parent record
          f.keys.filter((I) => !I.optional).map((I) => I.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        u.params && Tn(u.params, f.keys.map((I) => I.name))
      ), m = f.stringify(p);
    } else if ("path" in u)
      m = u.path, process.env.NODE_ENV !== "production" && !m.startsWith("/") && C(`The Matcher cannot resolve relative paths but received "${m}". Unless you directly called \`matcher.resolve("${m}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`), f = n.find((I) => I.re.test(m)), f && (p = f.parse(m), g = f.record.name);
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
      meta: bi(y)
    };
  }
  return e.forEach((u) => s(u)), { addRoute: s, resolve: c, removeRoute: i, getRoutes: a, getRecordMatcher: r };
}
function Tn(e, t) {
  const n = {};
  for (const o of t)
    o in e && (n[o] = e[o]);
  return n;
}
function _i(e) {
  return {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: void 0,
    beforeEnter: e.beforeEnter,
    props: wi(e),
    children: e.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in e ? e.components || null : e.component && { default: e.component }
  };
}
function wi(e) {
  const t = {}, n = e.props || !1;
  if ("component" in e)
    t.default = n;
  else
    for (const o in e.components)
      t[o] = typeof n == "boolean" ? n : n[o];
  return t;
}
function Dn(e) {
  for (; e; ) {
    if (e.record.aliasOf)
      return !0;
    e = e.parent;
  }
  return !1;
}
function bi(e) {
  return e.reduce((t, n) => R(t, n.meta), {});
}
function Vn(e, t) {
  const n = {};
  for (const o in e)
    n[o] = o in t ? t[o] : e[o];
  return n;
}
function Lt(e, t) {
  return e.name === t.name && e.optional === t.optional && e.repeatable === t.repeatable;
}
function Ei(e, t) {
  for (const n of e.keys)
    if (!n.optional && !t.keys.find(Lt.bind(null, n)))
      return C(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
  for (const n of t.keys)
    if (!n.optional && !e.keys.find(Lt.bind(null, n)))
      return C(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
}
function ki(e, t) {
  t && t.record.name && !e.name && !e.path && C(`The route named "${String(t.record.name)}" has a child without a name and an empty path. Using that name won't render the empty path child so you probably want to move the name to the child instead. If this is intentional, add a name to the child route to remove the warning.`);
}
function Si(e, t) {
  for (const n of t.keys)
    if (!e.keys.find(Lt.bind(null, n)))
      return C(`Absolute path "${e.record.path}" must have the exact same param named "${n.name}" as its parent "${t.record.path}".`);
}
function Lo(e, t) {
  return t.children.some((n) => n === e || Lo(e, n));
}
const Mo = /#/g, Oi = /&/g, Ii = /\//g, Pi = /=/g, $i = /\?/g, jo = /\+/g, xi = /%5B/g, Ci = /%5D/g, Uo = /%5E/g, Ni = /%60/g, Bo = /%7B/g, Ri = /%7C/g, Ho = /%7D/g, Ai = /%20/g;
function en(e) {
  return encodeURI("" + e).replace(Ri, "|").replace(xi, "[").replace(Ci, "]");
}
function Ti(e) {
  return en(e).replace(Bo, "{").replace(Ho, "}").replace(Uo, "^");
}
function Mt(e) {
  return en(e).replace(jo, "%2B").replace(Ai, "+").replace(Mo, "%23").replace(Oi, "%26").replace(Ni, "`").replace(Bo, "{").replace(Ho, "}").replace(Uo, "^");
}
function Di(e) {
  return Mt(e).replace(Pi, "%3D");
}
function Vi(e) {
  return en(e).replace(Mo, "%23").replace($i, "%3F");
}
function Li(e) {
  return e == null ? "" : Vi(e).replace(Ii, "%2F");
}
function Ke(e) {
  try {
    return decodeURIComponent("" + e);
  } catch {
    process.env.NODE_ENV !== "production" && C(`Error decoding "${e}". Using original value`);
  }
  return "" + e;
}
function Mi(e) {
  const t = {};
  if (e === "" || e === "?")
    return t;
  const o = (e[0] === "?" ? e.slice(1) : e).split("&");
  for (let r = 0; r < o.length; ++r) {
    const s = o[r].replace(jo, " "), i = s.indexOf("="), a = Ke(i < 0 ? s : s.slice(0, i)), l = i < 0 ? null : Ke(s.slice(i + 1));
    if (a in t) {
      let c = t[a];
      q(c) || (c = t[a] = [c]), c.push(l);
    } else
      t[a] = l;
  }
  return t;
}
function Ln(e) {
  let t = "";
  for (let n in e) {
    const o = e[n];
    if (n = Di(n), o == null) {
      o !== void 0 && (t += (t.length ? "&" : "") + n);
      continue;
    }
    (q(o) ? o.map((s) => s && Mt(s)) : [o && Mt(o)]).forEach((s) => {
      s !== void 0 && (t += (t.length ? "&" : "") + n, s != null && (t += "=" + s));
    });
  }
  return t;
}
function ji(e) {
  const t = {};
  for (const n in e) {
    const o = e[n];
    o !== void 0 && (t[n] = q(o) ? o.map((r) => r == null ? null : "" + r) : o == null ? o : "" + o);
  }
  return t;
}
const Ui = Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : ""), Mn = Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : ""), tn = Symbol(process.env.NODE_ENV !== "production" ? "router" : ""), Fo = Symbol(process.env.NODE_ENV !== "production" ? "route location" : ""), jt = Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
function Le() {
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
  return () => new Promise((i, a) => {
    const l = (d) => {
      d === !1 ? a(De(4, {
        from: n,
        to: t
      })) : d instanceof Error ? a(d) : si(d) ? a(De(2, {
        from: t,
        to: d
      })) : (s && // since enterCallbackArray is truthy, both record and name also are
      o.enterCallbacks[r] === s && typeof d == "function" && s.push(d), i());
    }, c = e.call(o && o.instances[r], t, n, process.env.NODE_ENV !== "production" ? Bi(l, t, n) : l);
    let u = Promise.resolve(c);
    if (e.length < 3 && (u = u.then(l)), process.env.NODE_ENV !== "production" && e.length > 2) {
      const d = `The "next" callback was never called inside of ${e.name ? '"' + e.name + '"' : ""}:
${e.toString()}
. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;
      if (typeof c == "object" && "then" in c)
        u = u.then((f) => l._called ? f : (C(d), Promise.reject(new Error("Invalid navigation guard"))));
      else if (c !== void 0 && !l._called) {
        C(d), a(new Error("Invalid navigation guard"));
        return;
      }
    }
    u.catch((d) => a(d));
  });
}
function Bi(e, t, n) {
  let o = 0;
  return function() {
    o++ === 1 && C(`The "next" callback was called more than once in one navigation guard when going from "${n.fullPath}" to "${t.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`), e._called = !0, o === 1 && e.apply(null, arguments);
  };
}
function kt(e, t, n, o) {
  const r = [];
  for (const s of e) {
    process.env.NODE_ENV !== "production" && !s.components && !s.children.length && C(`Record with path "${s.path}" is either missing a "component(s)" or "children" property.`);
    for (const i in s.components) {
      let a = s.components[i];
      if (process.env.NODE_ENV !== "production") {
        if (!a || typeof a != "object" && typeof a != "function")
          throw C(`Component "${i}" in record with path "${s.path}" is not a valid component. Received "${String(a)}".`), new Error("Invalid route component");
        if ("then" in a) {
          C(`Component "${i}" in record with path "${s.path}" is a Promise instead of a function that returns a Promise. Did you write "import('./MyPage.vue')" instead of "() => import('./MyPage.vue')" ? This will break in production if not fixed.`);
          const l = a;
          a = () => l;
        } else
          a.__asyncLoader && // warn only once per component
          !a.__warnedDefineAsync && (a.__warnedDefineAsync = !0, C(`Component "${i}" in record with path "${s.path}" is defined using "defineAsyncComponent()". Write "() => import('./MyPage.vue')" instead of "defineAsyncComponent(() => import('./MyPage.vue'))".`));
      }
      if (!(t !== "beforeRouteEnter" && !s.instances[i]))
        if (Hi(a)) {
          const c = (a.__vccOpts || a)[t];
          c && r.push(me(c, n, o, s, i));
        } else {
          let l = a();
          process.env.NODE_ENV !== "production" && !("catch" in l) && (C(`Component "${i}" in record with path "${s.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`), l = Promise.resolve(l)), r.push(() => l.then((c) => {
            if (!c)
              return Promise.reject(new Error(`Couldn't resolve component "${i}" at "${s.path}"`));
            const u = Hs(c) ? c.default : c;
            s.components[i] = u;
            const f = (u.__vccOpts || u)[t];
            return f && me(f, n, o, s, i)();
          }));
        }
    }
  }
  return r;
}
function Hi(e) {
  return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function jn(e) {
  const t = Z(tn), n = Z(Fo), o = j(() => t.resolve(b(e.to))), r = j(() => {
    const { matched: l } = o.value, { length: c } = l, u = l[c - 1], d = n.matched;
    if (!u || !d.length)
      return -1;
    const f = d.findIndex(ye.bind(null, u));
    if (f > -1)
      return f;
    const p = Un(l[c - 2]);
    return (
      // we are dealing with nested routes
      c > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      Un(u) === p && // avoid comparing the child with its parent
      d[d.length - 1].path !== p ? d.findIndex(ye.bind(null, l[c - 2])) : f
    );
  }), s = j(() => r.value > -1 && Qi(n.params, o.value.params)), i = j(() => r.value > -1 && r.value === n.matched.length - 1 && To(n.params, o.value.params));
  function a(l = {}) {
    return Wi(l) ? t[b(e.replace) ? "replace" : "push"](
      b(e.to)
      // avoid uncaught errors are they are logged anyway
    ).catch(He) : Promise.resolve();
  }
  if (process.env.NODE_ENV !== "production" && ae) {
    const l = Kt();
    if (l) {
      const c = {
        route: o.value,
        isActive: s.value,
        isExactActive: i.value
      };
      l.__vrl_devtools = l.__vrl_devtools || [], l.__vrl_devtools.push(c), Er(() => {
        c.route = o.value, c.isActive = s.value, c.isExactActive = i.value;
      }, { flush: "post" });
    }
  }
  return {
    route: o,
    href: j(() => o.value.href),
    isActive: s,
    isExactActive: i,
    navigate: a
  };
}
const Fi = /* @__PURE__ */ K({
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
  useLink: jn,
  setup(e, { slots: t }) {
    const n = ge(jn(e)), { options: o } = Z(tn), r = j(() => ({
      [Bn(e.activeClass, o.linkActiveClass, "router-link-active")]: n.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [Bn(e.exactActiveClass, o.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
    }));
    return () => {
      const s = t.default && t.default(n);
      return e.custom ? s : go("a", {
        "aria-current": n.isExactActive ? e.ariaCurrentValue : null,
        href: n.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: n.navigate,
        class: r.value
      }, s);
    };
  }
}), Gi = Fi;
function Wi(e) {
  if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(t))
        return;
    }
    return e.preventDefault && e.preventDefault(), !0;
  }
}
function Qi(e, t) {
  for (const n in t) {
    const o = t[n], r = e[n];
    if (typeof o == "string") {
      if (o !== r)
        return !1;
    } else if (!q(r) || r.length !== o.length || o.some((s, i) => s !== r[i]))
      return !1;
  }
  return !0;
}
function Un(e) {
  return e ? e.aliasOf ? e.aliasOf.path : e.path : "";
}
const Bn = (e, t, n) => e ?? t ?? n, zi = /* @__PURE__ */ K({
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
    process.env.NODE_ENV !== "production" && qi();
    const o = Z(jt), r = j(() => e.route || o.value), s = Z(Mn, 0), i = j(() => {
      let c = b(s);
      const { matched: u } = r.value;
      let d;
      for (; (d = u[c]) && !d.components; )
        c++;
      return c;
    }), a = j(() => r.value.matched[i.value]);
    nt(Mn, j(() => i.value + 1)), nt(Ui, a), nt(jt, r);
    const l = V();
    return de(() => [l.value, a.value, e.name], ([c, u, d], [f, p, m]) => {
      u && (u.instances[d] = c, p && p !== u && c && c === f && (u.leaveGuards.size || (u.leaveGuards = p.leaveGuards), u.updateGuards.size || (u.updateGuards = p.updateGuards))), c && u && // if there is no instance but to and from are the same this might be
      // the first visit
      (!p || !ye(u, p) || !f) && (u.enterCallbacks[d] || []).forEach((g) => g(c));
    }, { flush: "post" }), () => {
      const c = r.value, u = e.name, d = a.value, f = d && d.components[u];
      if (!f)
        return Hn(n.default, { Component: f, route: c });
      const p = d.props[u], m = p ? p === !0 ? c.params : typeof p == "function" ? p(c) : p : null, y = go(f, R({}, m, t, {
        onVnodeUnmounted: (O) => {
          O.component.isUnmounted && (d.instances[u] = null);
        },
        ref: l
      }));
      if (process.env.NODE_ENV !== "production" && ae && y.ref) {
        const O = {
          depth: i.value,
          name: d.name,
          path: d.path,
          meta: d.meta
        };
        (q(y.ref) ? y.ref.map((L) => L.i) : [y.ref.i]).forEach((L) => {
          L.__vrv_devtools = O;
        });
      }
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        Hn(n.default, { Component: y, route: c }) || y
      );
    };
  }
});
function Hn(e, t) {
  if (!e)
    return null;
  const n = e(t);
  return n.length === 1 ? n[0] : n;
}
const Ki = zi;
function qi() {
  const e = Kt(), t = e.parent && e.parent.type.name;
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
function Me(e, t) {
  const n = R({}, e, {
    // remove variables that can contain vue instances
    matched: e.matched.map((o) => ra(o, ["instances", "children", "aliasOf"]))
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
let Ji = 0;
function Yi(e, t, n) {
  if (t.__hasDevtools)
    return;
  t.__hasDevtools = !0;
  const o = Ji++;
  Bs({
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
        value: Me(t.currentRoute.value, "Current Route")
      });
    }), r.on.visitComponentTree(({ treeNode: u, componentInstance: d }) => {
      if (d.__vrv_devtools) {
        const f = d.__vrv_devtools;
        u.tags.push({
          label: (f.name ? `${f.name.toString()}: ` : "") + f.path,
          textColor: 0,
          tooltip: "This component is rendered by &lt;router-view&gt;",
          backgroundColor: Go
        });
      }
      q(d.__vrl_devtools) && (d.__devtoolsApi = r, d.__vrl_devtools.forEach((f) => {
        let p = zo, m = "";
        f.isExactActive ? (p = Qo, m = "This is exactly active") : f.isActive && (p = Wo, m = "This link is active"), u.tags.push({
          label: f.route.path,
          textColor: 0,
          tooltip: m,
          backgroundColor: p
        });
      }));
    }), de(t.currentRoute, () => {
      l(), r.notifyComponentUpdate(), r.sendInspectorTree(a), r.sendInspectorState(a);
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
    let i = 0;
    t.beforeEach((u, d) => {
      const f = {
        guard: Ze("beforeEach"),
        from: Me(d, "Current Location during this navigation"),
        to: Me(u, "Target location")
      };
      Object.defineProperty(u.meta, "__navigationId", {
        value: i++
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
      }, p.status = Ze("❌")) : p.status = Ze("✅"), p.from = Me(d, "Current Location during this navigation"), p.to = Me(u, "Target location"), r.addTimelineEvent({
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
    const a = "router-inspector:" + o;
    r.addInspector({
      id: a,
      label: "Routes" + (o ? " " + o : ""),
      icon: "book",
      treeFilterPlaceholder: "Search routes"
    });
    function l() {
      if (!c)
        return;
      const u = c;
      let d = n.getRoutes().filter((f) => !f.parent);
      d.forEach(Jo), u.filter && (d = d.filter((f) => (
        // save matches state based on the payload
        Ut(f, u.filter.toLowerCase())
      ))), d.forEach((f) => qo(f, t.currentRoute.value)), u.rootNodes = d.map(Ko);
    }
    let c;
    r.on.getInspectorTree((u) => {
      c = u, u.app === e && u.inspectorId === a && l();
    }), r.on.getInspectorState((u) => {
      if (u.app === e && u.inspectorId === a) {
        const f = n.getRoutes().find((p) => p.record.__vd_id === u.nodeId);
        f && (u.state = {
          options: Zi(f)
        });
      }
    }), r.sendInspectorTree(a), r.sendInspectorState(a);
  });
}
function Xi(e) {
  return e.optional ? e.repeatable ? "*" : "?" : e.repeatable ? "+" : "";
}
function Zi(e) {
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
        display: e.keys.map((o) => `${o.name}${Xi(o)}`).join(" "),
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
const Go = 15485081, Wo = 2450411, Qo = 8702998, ea = 2282478, zo = 16486972, ta = 6710886;
function Ko(e) {
  const t = [], { record: n } = e;
  n.name != null && t.push({
    label: String(n.name),
    textColor: 0,
    backgroundColor: ea
  }), n.aliasOf && t.push({
    label: "alias",
    textColor: 0,
    backgroundColor: zo
  }), e.__vd_match && t.push({
    label: "matches",
    textColor: 0,
    backgroundColor: Go
  }), e.__vd_exactActive && t.push({
    label: "exact",
    textColor: 0,
    backgroundColor: Qo
  }), e.__vd_active && t.push({
    label: "active",
    textColor: 0,
    backgroundColor: Wo
  }), n.redirect && t.push({
    label: typeof n.redirect == "string" ? `redirect: ${n.redirect}` : "redirects",
    textColor: 16777215,
    backgroundColor: ta
  });
  let o = n.__vd_id;
  return o == null && (o = String(na++), n.__vd_id = o), {
    id: o,
    label: n.path,
    tags: t,
    children: e.children.map(Ko)
  };
}
let na = 0;
const oa = /^\/(.*)\/([a-z]*)$/;
function qo(e, t) {
  const n = t.matched.length && ye(t.matched[t.matched.length - 1], e.record);
  e.__vd_exactActive = e.__vd_active = n, n || (e.__vd_active = t.matched.some((o) => ye(o, e.record))), e.children.forEach((o) => qo(o, t));
}
function Jo(e) {
  e.__vd_match = !1, e.children.forEach(Jo);
}
function Ut(e, t) {
  const n = String(e.re).match(oa);
  if (e.__vd_match = !1, !n || n.length < 3)
    return !1;
  if (new RegExp(n[1].replace(/\$$/, ""), n[2]).test(t))
    return e.children.forEach((i) => Ut(i, t)), e.record.path !== "/" || t === "/" ? (e.__vd_match = e.re.test(t), !0) : !1;
  const r = e.record.path.toLowerCase(), s = Ke(r);
  return !t.startsWith("/") && (s.includes(t) || r.includes(t)) || s.startsWith(t) || r.startsWith(t) || e.record.name && String(e.record.name).includes(t) ? !0 : e.children.some((i) => Ut(i, t));
}
function ra(e, t) {
  const n = {};
  for (const o in e)
    t.includes(o) || (n[o] = e[o]);
  return n;
}
function sa(e) {
  const t = yi(e.routes, e), n = e.parseQuery || Mi, o = e.stringifyQuery || Ln, r = e.history;
  if (process.env.NODE_ENV !== "production" && !r)
    throw new Error('Provide the "history" option when calling "createRouter()": https://next.router.vuejs.org/api/#history.');
  const s = Le(), i = Le(), a = Le(), l = br(he);
  let c = he;
  ae && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
  const u = bt.bind(null, (h) => "" + h), d = bt.bind(null, Li), f = (
    // @ts-expect-error: intentionally avoid the type check
    bt.bind(null, Ke)
  );
  function p(h, w) {
    let v, E;
    return Vo(h) ? (v = t.getRecordMatcher(h), E = w) : E = h, t.addRoute(E, v);
  }
  function m(h) {
    const w = t.getRecordMatcher(h);
    w ? t.removeRoute(w) : process.env.NODE_ENV !== "production" && C(`Cannot remove non-existent route "${String(h)}"`);
  }
  function g() {
    return t.getRoutes().map((h) => h.record);
  }
  function y(h) {
    return !!t.getRecordMatcher(h);
  }
  function O(h, w) {
    if (w = R({}, w || l.value), typeof h == "string") {
      const P = Et(n, h, w.path), M = t.resolve({ path: P.path }, w), we = r.createHref(P.fullPath);
      return process.env.NODE_ENV !== "production" && (we.startsWith("//") ? C(`Location "${h}" resolved to "${we}". A resolved location cannot start with multiple slashes.`) : M.matched.length || C(`No match found for location with path "${h}"`)), R(P, M, {
        params: f(M.params),
        hash: Ke(P.hash),
        redirectedFrom: void 0,
        href: we
      });
    }
    let v;
    if ("path" in h)
      process.env.NODE_ENV !== "production" && "params" in h && !("name" in h) && // @ts-expect-error: the type is never
      Object.keys(h.params).length && C(`Path "${// @ts-expect-error: the type is never
      h.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`), v = R({}, h, {
        path: Et(n, h.path, w.path).path
      });
    else {
      const P = R({}, h.params);
      for (const M in P)
        P[M] == null && delete P[M];
      v = R({}, h, {
        params: d(h.params)
      }), w.params = d(w.params);
    }
    const E = t.resolve(v, w), N = h.hash || "";
    process.env.NODE_ENV !== "production" && N && !N.startsWith("#") && C(`A \`hash\` should always start with the character "#". Replace "${N}" with "#${N}".`), E.params = u(f(E.params));
    const B = Ws(o, R({}, h, {
      hash: Ti(N),
      path: E.path
    })), x = r.createHref(B);
    return process.env.NODE_ENV !== "production" && (x.startsWith("//") ? C(`Location "${h}" resolved to "${x}". A resolved location cannot start with multiple slashes.`) : E.matched.length || C(`No match found for location with path "${"path" in h ? h.path : h}"`)), R({
      fullPath: B,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash: N,
      query: (
        // if the user is using a custom query lib like qs, we might have
        // nested objects, so we keep the query as is, meaning it can contain
        // numbers at `$route.query`, but at the point, the user will have to
        // use their own type anyway.
        // https://github.com/vuejs/router/issues/328#issuecomment-649481567
        o === Ln ? ji(h.query) : h.query || {}
      )
    }, E, {
      redirectedFrom: void 0,
      href: x
    });
  }
  function I(h) {
    return typeof h == "string" ? Et(n, h, l.value.path) : R({}, h);
  }
  function L(h, w) {
    if (c !== h)
      return De(8, {
        from: w,
        to: h
      });
  }
  function F(h) {
    return S(h);
  }
  function J(h) {
    return F(R(I(h), { replace: !0 }));
  }
  function Y(h) {
    const w = h.matched[h.matched.length - 1];
    if (w && w.redirect) {
      const { redirect: v } = w;
      let E = typeof v == "function" ? v(h) : v;
      if (typeof E == "string" && (E = E.includes("?") || E.includes("#") ? E = I(E) : (
        // force empty params
        { path: E }
      ), E.params = {}), process.env.NODE_ENV !== "production" && !("path" in E) && !("name" in E))
        throw C(`Invalid redirect found:
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
    const v = c = O(h), E = l.value, N = h.state, B = h.force, x = h.replace === !0, P = Y(v);
    if (P)
      return S(
        R(I(P), {
          state: typeof P == "object" ? R({}, N, P.state) : N,
          force: B,
          replace: x
        }),
        // keep original redirectedFrom if it exists
        w || v
      );
    const M = v;
    M.redirectedFrom = w;
    let we;
    return !B && Pn(o, E, v) && (we = De(16, { to: M, from: E }), hn(
      E,
      E,
      // this is a push, the only way for it to be triggered from a
      // history.listen is with a redirect, which makes it become a push
      !0,
      // This cannot be the first navigation because the initial location
      // cannot be manually navigated to
      !1
    )), (we ? Promise.resolve(we) : k(M, E)).catch((z) => se(z) ? (
      // navigation redirects still mark the router as ready
      se(
        z,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? z : mt(z)
    ) : (
      // reject any unknown error
      W(z, M, E)
    )).then((z) => {
      if (z) {
        if (se(
          z,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        ))
          return process.env.NODE_ENV !== "production" && // we are redirecting to the same location we were already at
          Pn(o, O(z.to), M) && // and we have done it a couple of times
          w && // @ts-expect-error: added only in dev
          (w._count = w._count ? (
            // @ts-expect-error
            w._count + 1
          ) : 1) > 10 ? (C(`Detected an infinite redirection in a navigation guard when going from "${E.fullPath}" to "${M.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`), Promise.reject(new Error("Infinite redirect in navigation guard"))) : S(
            // keep options
            R({
              // preserve an existing replacement but allow the redirect to override it
              replace: x
            }, I(z.to), {
              state: typeof z.to == "object" ? R({}, N, z.to.state) : N,
              force: B
            }),
            // preserve the original redirectedFrom if any
            w || M
          );
      } else
        z = D(M, E, !0, x, N);
      return _(M, E, z), z;
    });
  }
  function te(h, w) {
    const v = L(h, w);
    return v ? Promise.reject(v) : Promise.resolve();
  }
  function k(h, w) {
    let v;
    const [E, N, B] = ia(h, w);
    v = kt(E.reverse(), "beforeRouteLeave", h, w);
    for (const P of E)
      P.leaveGuards.forEach((M) => {
        v.push(me(M, h, w));
      });
    const x = te.bind(null, h, w);
    return v.push(x), Re(v).then(() => {
      v = [];
      for (const P of s.list())
        v.push(me(P, h, w));
      return v.push(x), Re(v);
    }).then(() => {
      v = kt(N, "beforeRouteUpdate", h, w);
      for (const P of N)
        P.updateGuards.forEach((M) => {
          v.push(me(M, h, w));
        });
      return v.push(x), Re(v);
    }).then(() => {
      v = [];
      for (const P of h.matched)
        if (P.beforeEnter && !w.matched.includes(P))
          if (q(P.beforeEnter))
            for (const M of P.beforeEnter)
              v.push(me(M, h, w));
          else
            v.push(me(P.beforeEnter, h, w));
      return v.push(x), Re(v);
    }).then(() => (h.matched.forEach((P) => P.enterCallbacks = {}), v = kt(B, "beforeRouteEnter", h, w), v.push(x), Re(v))).then(() => {
      v = [];
      for (const P of i.list())
        v.push(me(P, h, w));
      return v.push(x), Re(v);
    }).catch((P) => se(
      P,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? P : Promise.reject(P));
  }
  function _(h, w, v) {
    for (const E of a.list())
      E(h, w, v);
  }
  function D(h, w, v, E, N) {
    const B = L(h, w);
    if (B)
      return B;
    const x = w === he, P = ae ? history.state : {};
    v && (E || x ? r.replace(h.fullPath, R({
      scroll: x && P && P.scroll
    }, N)) : r.push(h.fullPath, N)), l.value = h, hn(h, w, v, x), mt();
  }
  let U;
  function _e() {
    U || (U = r.listen((h, w, v) => {
      const E = O(h), N = Y(E);
      if (N) {
        S(R(N, { replace: !0 }), E).catch(He);
        return;
      }
      c = E;
      const B = l.value;
      ae && Zs(xn(B.fullPath, v.delta), ft()), k(E, B).catch((x) => se(
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
        ) && !v.delta && v.type === ze.pop && r.go(-1, !1);
      }).catch(He), Promise.reject()) : (v.delta && r.go(-v.delta, !1), W(x, E, B))).then((x) => {
        x = x || D(
          // after navigation, all matched components are resolved
          E,
          B,
          !1
        ), x && (v.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
        // entry while a different route is displayed
        !se(
          x,
          8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        ) ? r.go(-v.delta, !1) : v.type === ze.pop && se(
          x,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && r.go(-1, !1)), _(E, B, x);
      }).catch(He);
    }));
  }
  let Ve = Le(), Je = Le(), ne;
  function W(h, w, v) {
    mt(h);
    const E = Je.list();
    return E.length ? E.forEach((N) => N(h, w, v)) : (process.env.NODE_ENV !== "production" && C("uncaught error during route navigation:"), console.error(h)), Promise.reject(h);
  }
  function _r() {
    return ne && l.value !== he ? Promise.resolve() : new Promise((h, w) => {
      Ve.add([h, w]);
    });
  }
  function mt(h) {
    return ne || (ne = !h, _e(), Ve.list().forEach(([w, v]) => h ? v(h) : w()), Ve.reset()), h;
  }
  function hn(h, w, v, E) {
    const { scrollBehavior: N } = e;
    if (!ae || !N)
      return Promise.resolve();
    const B = !v && ei(xn(h.fullPath, 0)) || (E || !v) && history.state && history.state.scroll || null;
    return We().then(() => N(h, w, B)).then((x) => x && Xs(x)).catch((x) => W(x, h, w));
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
    replace: J,
    go: gt,
    back: () => gt(-1),
    forward: () => gt(1),
    beforeEach: s.add,
    beforeResolve: i.add,
    afterEach: a.add,
    onError: Je.add,
    isReady: _r,
    install(h) {
      const w = this;
      h.component("RouterLink", Gi), h.component("RouterView", Ki), h.config.globalProperties.$router = w, Object.defineProperty(h.config.globalProperties, "$route", {
        enumerable: !0,
        get: () => b(l)
      }), ae && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !vt && l.value === he && (vt = !0, F(r.location).catch((N) => {
        process.env.NODE_ENV !== "production" && C("Unexpected error when starting the router:", N);
      }));
      const v = {};
      for (const N in he)
        v[N] = j(() => l.value[N]);
      h.provide(tn, w), h.provide(Fo, ge(v)), h.provide(jt, l);
      const E = h.unmount;
      yt.add(h), h.unmount = function() {
        yt.delete(h), yt.size < 1 && (c = he, U && U(), U = null, l.value = he, vt = !1, ne = !1), E();
      }, process.env.NODE_ENV !== "production" && ae && Yi(h, w, t);
    }
  };
}
function Re(e) {
  return e.reduce((t, n) => t.then(() => n()), Promise.resolve());
}
function ia(e, t) {
  const n = [], o = [], r = [], s = Math.max(t.matched.length, e.matched.length);
  for (let i = 0; i < s; i++) {
    const a = t.matched[i];
    a && (e.matched.find((c) => ye(c, a)) ? o.push(a) : n.push(a));
    const l = e.matched[i];
    l && (t.matched.find((c) => ye(c, l)) || r.push(l));
  }
  return [n, o, r];
}
sa({
  history: ri(),
  routes: []
});
function aa(e) {
  return e && typeof e.then == "function";
}
Promise.resolve(!1);
Promise.resolve(!0);
var Oe = Promise.resolve();
function Yo(e, t) {
  return e || (e = 0), new Promise(function(n) {
    return setTimeout(function() {
      return n(t);
    }, e);
  });
}
function la(e, t) {
  return Math.floor(Math.random() * (t - e + 1) + e);
}
function nn() {
  return Math.random().toString(36).substring(2);
}
var Fn = 0, St = 0;
function pt() {
  var e = new Date().getTime();
  return e === Fn ? (St++, e * 1e3 + St) : (Fn = e, St = 0, e * 1e3);
}
var ca = pt, ua = "native";
function da(e) {
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
function fa(e) {
  e.bc.close(), e.subFns = [];
}
function pa(e, t) {
  try {
    return e.bc.postMessage(t, !1), Oe;
  } catch (n) {
    return Promise.reject(n);
  }
}
function ha(e, t) {
  e.messagesCallback = t;
}
function ma() {
  if (typeof window > "u")
    return !1;
  if (typeof BroadcastChannel == "function") {
    if (BroadcastChannel._pubkey)
      throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
    return !0;
  } else
    return !1;
}
function ga() {
  return 150;
}
var va = {
  create: da,
  close: fa,
  onMessage: ha,
  postMessage: pa,
  canBeUsed: ma,
  type: ua,
  averageResponseTime: ga,
  microSeconds: ca
}, Xo = (
  /** @class */
  function() {
    function e(t) {
      this.ttl = t, this.map = /* @__PURE__ */ new Map(), this._to = !1;
    }
    return e.prototype.has = function(t) {
      return this.map.has(t);
    }, e.prototype.add = function(t) {
      var n = this;
      this.map.set(t, Zo()), this._to || (this._to = !0, setTimeout(function() {
        n._to = !1, ya(n);
      }, 0));
    }, e.prototype.clear = function() {
      this.map.clear();
    }, e;
  }()
);
function ya(e) {
  for (var t = Zo() - e.ttl, n = e.map[Symbol.iterator](); ; ) {
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
function Zo() {
  return new Date().getTime();
}
function on() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = JSON.parse(JSON.stringify(e));
  return typeof t.webWorkerSupport > "u" && (t.webWorkerSupport = !0), t.idb || (t.idb = {}), t.idb.ttl || (t.idb.ttl = 1e3 * 45), t.idb.fallbackInterval || (t.idb.fallbackInterval = 150), e.idb && typeof e.idb.onclose == "function" && (t.idb.onclose = e.idb.onclose), t.localstorage || (t.localstorage = {}), t.localstorage.removeTimeout || (t.localstorage.removeTimeout = 1e3 * 60), e.methods && (t.methods = e.methods), t.node || (t.node = {}), t.node.ttl || (t.node.ttl = 1e3 * 60 * 2), t.node.maxParallelWrites || (t.node.maxParallelWrites = 2048), typeof t.node.useFastPath > "u" && (t.node.useFastPath = !0), t;
}
var _a = pt, wa = "pubkey.broadcast-channel-0-", ue = "messages", ht = {
  durability: "relaxed"
}, ba = "idb";
function er() {
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
function rn(e) {
  e.commit && e.commit();
}
function Ea(e) {
  var t = er(), n = wa + e, o = t.open(n);
  return o.onupgradeneeded = function(r) {
    var s = r.target.result;
    s.createObjectStore(ue, {
      keyPath: "id",
      autoIncrement: !0
    });
  }, new Promise(function(r, s) {
    o.onerror = function(i) {
      return s(i);
    }, o.onsuccess = function() {
      r(o.result);
    };
  });
}
function ka(e, t, n) {
  var o = new Date().getTime(), r = {
    uuid: t,
    time: o,
    data: n
  }, s = e.transaction([ue], "readwrite", ht);
  return new Promise(function(i, a) {
    s.oncomplete = function() {
      return i();
    }, s.onerror = function(c) {
      return a(c);
    };
    var l = s.objectStore(ue);
    l.add(r), rn(s);
  });
}
function Sa(e, t) {
  var n = e.transaction(ue, "readonly", ht), o = n.objectStore(ue), r = [], s = IDBKeyRange.bound(t + 1, 1 / 0);
  if (o.getAll) {
    var i = o.getAll(s);
    return new Promise(function(l, c) {
      i.onerror = function(u) {
        return c(u);
      }, i.onsuccess = function(u) {
        l(u.target.result);
      };
    });
  }
  function a() {
    try {
      return s = IDBKeyRange.bound(t + 1, 1 / 0), o.openCursor(s);
    } catch {
      return o.openCursor();
    }
  }
  return new Promise(function(l, c) {
    var u = a();
    u.onerror = function(d) {
      return c(d);
    }, u.onsuccess = function(d) {
      var f = d.target.result;
      f ? f.value.id < t + 1 ? f.continue(t + 1) : (r.push(f.value), f.continue()) : (rn(n), l(r));
    };
  });
}
function Oa(e, t) {
  if (e.closed)
    return Promise.resolve([]);
  var n = e.db.transaction(ue, "readwrite", ht), o = n.objectStore(ue);
  return Promise.all(t.map(function(r) {
    var s = o.delete(r);
    return new Promise(function(i) {
      s.onsuccess = function() {
        return i();
      };
    });
  }));
}
function Ia(e, t) {
  var n = new Date().getTime() - t, o = e.transaction(ue, "readonly", ht), r = o.objectStore(ue), s = [];
  return new Promise(function(i) {
    r.openCursor().onsuccess = function(a) {
      var l = a.target.result;
      if (l) {
        var c = l.value;
        c.time < n ? (s.push(c), l.continue()) : (rn(o), i(s));
      } else
        i(s);
    };
  });
}
function Pa(e) {
  return Ia(e.db, e.options.idb.ttl).then(function(t) {
    return Oa(e, t.map(function(n) {
      return n.id;
    }));
  });
}
function $a(e, t) {
  return t = on(t), Ea(e).then(function(n) {
    var o = {
      closed: !1,
      lastCursorId: 0,
      channelName: e,
      options: t,
      uuid: nn(),
      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new Xo(t.idb.ttl * 2),
      // ensures we do not read messages in parallel
      writeBlockPromise: Oe,
      messagesCallback: null,
      readQueuePromises: [],
      db: n
    };
    return n.onclose = function() {
      o.closed = !0, t.idb.onclose && t.idb.onclose();
    }, tr(o), o;
  });
}
function tr(e) {
  e.closed || nr(e).then(function() {
    return Yo(e.options.idb.fallbackInterval);
  }).then(function() {
    return tr(e);
  });
}
function xa(e, t) {
  return !(e.uuid === t.uuid || t.eMIs.has(e.id) || e.data.time < t.messagesCallbackTime);
}
function nr(e) {
  return e.closed || !e.messagesCallback ? Oe : Sa(e.db, e.lastCursorId).then(function(t) {
    var n = t.filter(function(o) {
      return !!o;
    }).map(function(o) {
      return o.id > e.lastCursorId && (e.lastCursorId = o.id), o;
    }).filter(function(o) {
      return xa(o, e);
    }).sort(function(o, r) {
      return o.time - r.time;
    });
    return n.forEach(function(o) {
      e.messagesCallback && (e.eMIs.add(o.id), e.messagesCallback(o.data));
    }), Oe;
  });
}
function Ca(e) {
  e.closed = !0, e.db.close();
}
function Na(e, t) {
  return e.writeBlockPromise = e.writeBlockPromise.then(function() {
    return ka(e.db, e.uuid, t);
  }).then(function() {
    la(0, 10) === 0 && Pa(e);
  }), e.writeBlockPromise;
}
function Ra(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t, nr(e);
}
function Aa() {
  return !!er();
}
function Ta(e) {
  return e.idb.fallbackInterval * 2;
}
var Da = {
  create: $a,
  close: Ca,
  onMessage: Ra,
  postMessage: Na,
  canBeUsed: Aa,
  type: ba,
  averageResponseTime: Ta,
  microSeconds: _a
}, Va = pt, La = "pubkey.broadcastChannel-", Ma = "localstorage";
function or() {
  var e;
  if (typeof window > "u")
    return null;
  try {
    e = window.localStorage, e = window["ie8-eventlistener/storage"] || window.localStorage;
  } catch {
  }
  return e;
}
function rr(e) {
  return La + e;
}
function ja(e, t) {
  return new Promise(function(n) {
    Yo().then(function() {
      var o = rr(e.channelName), r = {
        token: nn(),
        time: new Date().getTime(),
        data: t,
        uuid: e.uuid
      }, s = JSON.stringify(r);
      or().setItem(o, s);
      var i = document.createEvent("Event");
      i.initEvent("storage", !0, !0), i.key = o, i.newValue = s, window.dispatchEvent(i), n();
    });
  });
}
function Ua(e, t) {
  var n = rr(e), o = function(s) {
    s.key === n && t(JSON.parse(s.newValue));
  };
  return window.addEventListener("storage", o), o;
}
function Ba(e) {
  window.removeEventListener("storage", e);
}
function Ha(e, t) {
  if (t = on(t), !sr())
    throw new Error("BroadcastChannel: localstorage cannot be used");
  var n = nn(), o = new Xo(t.localstorage.removeTimeout), r = {
    channelName: e,
    uuid: n,
    eMIs: o
    // emittedMessagesIds
  };
  return r.listener = Ua(e, function(s) {
    r.messagesCallback && s.uuid !== n && (!s.token || o.has(s.token) || s.data.time && s.data.time < r.messagesCallbackTime || (o.add(s.token), r.messagesCallback(s.data)));
  }), r;
}
function Fa(e) {
  Ba(e.listener);
}
function Ga(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t;
}
function sr() {
  var e = or();
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
function Wa() {
  var e = 120, t = navigator.userAgent.toLowerCase();
  return t.includes("safari") && !t.includes("chrome") ? e * 2 : e;
}
var Qa = {
  create: Ha,
  close: Fa,
  onMessage: Ga,
  postMessage: ja,
  canBeUsed: sr,
  type: Ma,
  averageResponseTime: Wa,
  microSeconds: Va
}, za = pt, Ka = "simulate", sn = /* @__PURE__ */ new Set();
function qa(e) {
  var t = {
    name: e,
    messagesCallback: null
  };
  return sn.add(t), t;
}
function Ja(e) {
  sn.delete(e);
}
function Ya(e, t) {
  return new Promise(function(n) {
    return setTimeout(function() {
      var o = Array.from(sn);
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
function Xa(e, t) {
  e.messagesCallback = t;
}
function Za() {
  return !0;
}
function el() {
  return 5;
}
var tl = {
  create: qa,
  close: Ja,
  onMessage: Xa,
  postMessage: Ya,
  canBeUsed: Za,
  type: Ka,
  averageResponseTime: el,
  microSeconds: za
}, Gn = [
  va,
  // fastest
  Da,
  Qa
];
function nl(e) {
  var t = [].concat(e.methods, Gn).filter(Boolean);
  if (e.type) {
    if (e.type === "simulate")
      return tl;
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
  throw new Error("No usable method found in " + JSON.stringify(Gn.map(function(r) {
    return r.type;
  })));
}
var ir = /* @__PURE__ */ new Set(), ol = 0, an = function(t, n) {
  this.id = ol++, ir.add(this), this.name = t, this.options = on(n), this.method = nl(this.options), this._iL = !1, this._onML = null, this._addEL = {
    message: [],
    internal: []
  }, this._uMP = /* @__PURE__ */ new Set(), this._befC = [], this._prepP = null, rl(this);
};
an._pubkey = !0;
an.prototype = {
  postMessage: function(t) {
    if (this.closed)
      throw new Error("BroadcastChannel.postMessage(): Cannot post message after channel has closed " + /**
      * In the past when this error appeared, it was really hard to debug.
      * So now we log the msg together with the error so it at least
      * gives some clue about where in your application this happens.
      */
      JSON.stringify(t));
    return Wn(this, "message", t);
  },
  postInternal: function(t) {
    return Wn(this, "internal", t);
  },
  set onmessage(e) {
    var t = this.method.microSeconds(), n = {
      time: t,
      fn: e
    };
    zn(this, "message", this._onML), e && typeof e == "function" ? (this._onML = n, Qn(this, "message", n)) : this._onML = null;
  },
  addEventListener: function(t, n) {
    var o = this.method.microSeconds(), r = {
      time: o,
      fn: n
    };
    Qn(this, t, r);
  },
  removeEventListener: function(t, n) {
    var o = this._addEL[t].find(function(r) {
      return r.fn === n;
    });
    zn(this, t, o);
  },
  close: function() {
    var t = this;
    if (!this.closed) {
      ir.delete(this), this.closed = !0;
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
function Wn(e, t, n) {
  var o = e.method.microSeconds(), r = {
    time: o,
    type: t,
    data: n
  }, s = e._prepP ? e._prepP : Oe;
  return s.then(function() {
    var i = e.method.postMessage(e._state, r);
    return e._uMP.add(i), i.catch().then(function() {
      return e._uMP.delete(i);
    }), i;
  });
}
function rl(e) {
  var t = e.method.create(e.name, e.options);
  aa(t) ? (e._prepP = t, t.then(function(n) {
    e._state = n;
  })) : e._state = t;
}
function ar(e) {
  return e._addEL.message.length > 0 || e._addEL.internal.length > 0;
}
function Qn(e, t, n) {
  e._addEL[t].push(n), sl(e);
}
function zn(e, t, n) {
  e._addEL[t] = e._addEL[t].filter(function(o) {
    return o !== n;
  }), il(e);
}
function sl(e) {
  if (!e._iL && ar(e)) {
    var t = function(r) {
      e._addEL[r.type].forEach(function(s) {
        var i = 1e5, a = s.time - i;
        r.time >= a && s.fn(r.data);
      });
    }, n = e.method.microSeconds();
    e._prepP ? e._prepP.then(function() {
      e._iL = !0, e.method.onMessage(e._state, t, n);
    }) : (e._iL = !0, e.method.onMessage(e._state, t, n));
  }
}
function il(e) {
  if (e._iL && !ar(e)) {
    e._iL = !1;
    var t = e.method.microSeconds();
    e.method.onMessage(e._state, null, t);
  }
}
const Kn = {
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
function qn(e) {
  return Object(e) !== e;
}
const al = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function ll(e) {
  const t = Object.getPrototypeOf(e);
  return t === Object.prototype || t === null || Object.getOwnPropertyNames(t).sort().join("\0") === al;
}
function cl(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function Te(e) {
  let t = '"';
  for (let n = 0; n < e.length; n += 1) {
    const o = e.charAt(n), r = o.charCodeAt(0);
    if (o === '"')
      t += '\\"';
    else if (o in Kn)
      t += Kn[o];
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
const ln = -1, lr = -2, cr = -3, ur = -4, dr = -5, cn = -6;
function Jn(e, t) {
  return ul(JSON.parse(e), t);
}
function ul(e, t) {
  if (typeof e == "number")
    return r(e, !0);
  if (!Array.isArray(e) || e.length === 0)
    throw new Error("Invalid input");
  const n = (
    /** @type {any[]} */
    e
  ), o = Array(n.length);
  function r(s, i = !1) {
    if (s === ln)
      return;
    if (s === cr)
      return NaN;
    if (s === ur)
      return 1 / 0;
    if (s === dr)
      return -1 / 0;
    if (s === cn)
      return -0;
    if (i)
      throw new Error("Invalid input");
    if (s in o)
      return o[s];
    const a = n[s];
    if (!a || typeof a != "object")
      o[s] = a;
    else if (Array.isArray(a))
      if (typeof a[0] == "string") {
        const l = a[0], c = t == null ? void 0 : t[l];
        if (c)
          return o[s] = c(r(a[1]));
        switch (l) {
          case "Date":
            o[s] = new Date(a[1]);
            break;
          case "Set":
            const u = /* @__PURE__ */ new Set();
            o[s] = u;
            for (let p = 1; p < a.length; p += 1)
              u.add(r(a[p]));
            break;
          case "Map":
            const d = /* @__PURE__ */ new Map();
            o[s] = d;
            for (let p = 1; p < a.length; p += 2)
              d.set(r(a[p]), r(a[p + 1]));
            break;
          case "RegExp":
            o[s] = new RegExp(a[1], a[2]);
            break;
          case "Object":
            o[s] = Object(a[1]);
            break;
          case "BigInt":
            o[s] = BigInt(a[1]);
            break;
          case "null":
            const f = /* @__PURE__ */ Object.create(null);
            o[s] = f;
            for (let p = 1; p < a.length; p += 2)
              f[a[p]] = r(a[p + 1]);
            break;
          default:
            throw new Error(`Unknown type ${l}`);
        }
      } else {
        const l = new Array(a.length);
        o[s] = l;
        for (let c = 0; c < a.length; c += 1) {
          const u = a[c];
          u !== lr && (l[c] = r(u));
        }
      }
    else {
      const l = {};
      o[s] = l;
      for (const c in a) {
        const u = a[c];
        l[c] = r(u);
      }
    }
    return o[s];
  }
  return r(0);
}
function Yn(e, t) {
  const n = [], o = /* @__PURE__ */ new Map(), r = [];
  for (const c in t)
    r.push({ key: c, fn: t[c] });
  const s = [];
  let i = 0;
  function a(c) {
    if (typeof c == "function")
      throw new Ot("Cannot stringify a function", s);
    if (o.has(c))
      return o.get(c);
    if (c === void 0)
      return ln;
    if (Number.isNaN(c))
      return cr;
    if (c === 1 / 0)
      return ur;
    if (c === -1 / 0)
      return dr;
    if (c === 0 && 1 / c < 0)
      return cn;
    const u = i++;
    o.set(c, u);
    for (const { key: f, fn: p } of r) {
      const m = p(c);
      if (m)
        return n[u] = `["${f}",${a(m)}]`, u;
    }
    let d = "";
    if (qn(c))
      d = It(c);
    else
      switch (cl(c)) {
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
            g > 0 && (d += ","), g in c ? (s.push(`[${g}]`), d += a(c[g]), s.pop()) : d += lr;
          d += "]";
          break;
        case "Set":
          d = '["Set"';
          for (const g of c)
            d += `,${a(g)}`;
          d += "]";
          break;
        case "Map":
          d = '["Map"';
          for (const [g, y] of c)
            s.push(
              `.get(${qn(g) ? It(g) : "..."})`
            ), d += `,${a(g)},${a(y)}`;
          d += "]";
          break;
        default:
          if (!ll(c))
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
              s.push(`.${g}`), d += `,${Te(g)},${a(c[g])}`, s.pop();
            d += "]";
          } else {
            d = "{";
            let g = !1;
            for (const y in c)
              g && (d += ","), g = !0, s.push(`.${y}`), d += `${Te(y)}:${a(c[y])}`, s.pop();
            d += "}";
          }
      }
    return n[u] = d, u;
  }
  const l = a(e);
  return l < 0 ? `${l}` : `[${n.join(",")}]`;
}
function It(e) {
  const t = typeof e;
  return t === "string" ? Te(e) : e instanceof String ? Te(e.toString()) : e === void 0 ? ln.toString() : e === 0 && 1 / e < 0 ? cn.toString() : t === "bigint" ? `["BigInt","${e}"]` : String(e);
}
function dl(e, t, { initialize: n, type: o }) {
  let r = `${t.$id}-${e.toString()}`, s = new an(r, { type: o }), i = !1, a = 0;
  de(() => t[e], (u) => {
    i || (a = Date.now(), s.postMessage({ timestamp: a, state: Jn(Yn(u)) })), i = !1;
  }, { deep: !0 }), s.onmessage = (u) => {
    if (u === void 0) {
      s.postMessage({ timestamp: a, state: Jn(Yn(t[e])) });
      return;
    }
    u.timestamp <= a || (i = !0, a = u.timestamp, t[e] = u.state);
  };
  let l = () => s.postMessage(void 0), c = () => s.close();
  return n && l(), { sync: l, unshare: c };
}
var fl = (e, t) => Object.keys(t).includes(e), pl = ({ initialize: e = !0, enable: t = !0, type: n }) => ({ store: o, options: r }) => {
  var s, i;
  let a = ((s = r == null ? void 0 : r.share) == null ? void 0 : s.enable) ?? t, l = ((i = r == null ? void 0 : r.share) == null ? void 0 : i.omit) ?? [];
  !a || Object.keys(o.$state).forEach((c) => {
    var u;
    l.includes(c) || !fl(c, o.$state) || dl(c, o, { initialize: ((u = r == null ? void 0 : r.share) == null ? void 0 : u.initialize) ?? e, type: n });
  });
};
const hl = xs();
hl.use(
  pl({
    enable: !0,
    initialize: !0
  })
);
const ml = /* @__PURE__ */ K({
  __name: "Doctype",
  setup(e) {
    const { stonecrop: t, isReady: n } = Ro(), o = V([]);
    return de(n, () => {
      if (n.value) {
        let r = t.value.schema.schema.toArray();
        r.forEach((s, i) => {
          const l = t.value.store.record[s.fieldname];
          r[i].value = l;
        }), o.value = r;
      }
    }), (r, s) => b(n) ? ($(), Se(b(Zr), {
      key: 0,
      class: "aform-main",
      modelValue: o.value,
      "onUpdate:modelValue": s[0] || (s[0] = (i) => o.value = i)
    }, null, 8, ["modelValue"])) : ke("", !0);
  }
});
var Xn;
const fr = typeof window < "u", gl = (e) => typeof e == "string", vl = () => {
};
fr && (Xn = window == null ? void 0 : window.navigator) != null && Xn.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function pr(e) {
  return typeof e == "function" ? e() : b(e);
}
function yl(e) {
  return e;
}
function _l(e) {
  return ho() ? (mo(e), !0) : !1;
}
function Bt(e) {
  var t;
  const n = pr(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const hr = fr ? window : void 0;
function wl(...e) {
  let t, n, o, r;
  if (gl(e[0]) || Array.isArray(e[0]) ? ([n, o, r] = e, t = hr) : [t, n, o, r] = e, !t)
    return vl;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const s = [], i = () => {
    s.forEach((u) => u()), s.length = 0;
  }, a = (u, d, f, p) => (u.addEventListener(d, f, p), () => u.removeEventListener(d, f, p)), l = de(() => [Bt(t), pr(r)], ([u, d]) => {
    i(), u && s.push(...n.flatMap((f) => o.map((p) => a(u, f, p, d))));
  }, { immediate: !0, flush: "post" }), c = () => {
    l(), i();
  };
  return _l(c), c;
}
const Ht = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Ft = "__vueuse_ssr_handlers__";
Ht[Ft] = Ht[Ft] || {};
Ht[Ft];
function bl(e, { window: t = hr, scrollTarget: n } = {}) {
  const o = V(!1), r = () => {
    if (!t)
      return;
    const s = t.document, i = Bt(e);
    if (!i)
      o.value = !1;
    else {
      const a = i.getBoundingClientRect();
      o.value = a.top <= (t.innerHeight || s.documentElement.clientHeight) && a.left <= (t.innerWidth || s.documentElement.clientWidth) && a.bottom >= 0 && a.right >= 0;
    }
  };
  return de(() => Bt(e), () => r(), { immediate: !0, flush: "post" }), t && wl(n || t, "scroll", r, {
    capture: !1,
    passive: !0
  }), o;
}
var Zn;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(Zn || (Zn = {}));
var El = Object.defineProperty, eo = Object.getOwnPropertySymbols, kl = Object.prototype.hasOwnProperty, Sl = Object.prototype.propertyIsEnumerable, to = (e, t, n) => t in e ? El(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Ol = (e, t) => {
  for (var n in t || (t = {}))
    kl.call(t, n) && to(e, n, t[n]);
  if (eo)
    for (var n of eo(t))
      Sl.call(t, n) && to(e, n, t[n]);
  return e;
};
const Il = {
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
Ol({
  linear: yl
}, Il);
const fe = (e) => {
  let t = bl(e).value;
  return t = t && e.offsetHeight > 0, t;
}, pe = (e) => e.tabIndex >= 0, no = (e) => {
  const t = e.target;
  return un(t);
}, un = (e) => {
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
  return n && (!pe(n) || !fe(n)) ? un(n) : n;
}, Pl = (e) => {
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
  return o && (!pe(o) || !fe(o)) ? dn(o) : o;
}, oo = (e) => {
  const t = e.target;
  return dn(t);
}, dn = (e) => {
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
  return n && (!pe(n) || !fe(n)) ? dn(n) : n;
}, $l = (e) => {
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
  return o && (!pe(o) || !fe(o)) ? un(o) : o;
}, ro = (e) => {
  const t = e.target;
  return fn(t);
}, fn = (e) => {
  var t;
  let n;
  if (e.previousElementSibling)
    n = e.previousElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    n = o == null ? void 0 : o.lastElementChild;
  }
  return n && (!pe(n) || !fe(n)) ? fn(n) : n;
}, so = (e) => {
  const t = e.target;
  return pn(t);
}, pn = (e) => {
  var t;
  let n;
  if (e.nextElementSibling)
    n = e.nextElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    n = o == null ? void 0 : o.firstElementChild;
  }
  return n && (!pe(n) || !fe(n)) ? pn(n) : n;
}, io = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!pe(t) || !fe(t)) ? pn(t) : t;
}, ao = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!pe(t) || !fe(t)) ? fn(t) : t;
}, et = ["alt", "control", "shift", "meta"], xl = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, mr = {
  "keydown.up": (e) => {
    const t = no(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.down": (e) => {
    const t = oo(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.left": (e) => {
    const t = ro(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.right": (e) => {
    const t = so(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.control.up": (e) => {
    const t = Pl(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = $l(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.left": (e) => {
    const t = io(e);
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
      const t = oo(e);
      t && t.focus();
    }
  },
  "keydown.shift.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const t = no(e);
      t && t.focus();
    }
  },
  "keydown.home": (e) => {
    const t = io(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.tab": (e) => {
    const t = so(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.shift.tab": (e) => {
    const t = ro(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  }
};
function gr(e) {
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
        for (const i of o.selectors.value)
          i instanceof Element ? s.push(i) : s.push(i.$el);
      else
        s.push(o.selectors.value);
    else
      s = Array.from(r.children).filter((i) => pe(i) && fe(i));
    return s;
  }, n = (o) => (r) => {
    const s = xl[r.key] || r.key.toLowerCase();
    if (et.includes(s))
      return;
    const i = o.handlers || mr;
    for (const a of Object.keys(i)) {
      const [l, ...c] = a.split(".");
      if (l === "keydown" && c.includes(s)) {
        const u = i[a], d = c.filter((p) => et.includes(p)), f = et.some((p) => {
          const m = p.charAt(0).toUpperCase() + p.slice(1);
          return r.getModifierState(m);
        });
        if (d.length > 0) {
          if (f) {
            for (const p of et)
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
  Gt(() => {
    for (const o of e) {
      const r = t(o);
      for (const s of r)
        s.addEventListener("keydown", n(o));
    }
  }), kr(() => {
    for (const o of e) {
      const r = t(o);
      for (const s of r)
        s.removeEventListener("keydown", n(o));
    }
  });
}
const Cl = ["data-colindex", "data-rowindex", "data-editable", "contenteditable", "tabindex"], Nl = { key: 1 }, Rl = /* @__PURE__ */ K({
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
    const i = j(() => {
      const g = o.cellData(n.colIndex, n.rowIndex);
      if (o.columns[n.colIndex].format) {
        const y = o.columns[n.colIndex].format;
        return typeof y == "function" ? y(g) : typeof y == "string" ? Function(`"use strict";return (${y})`)()(g) : g;
      } else
        return g;
    }), a = (g) => {
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
        ...mr,
        "keydown.f2": a,
        "keydown.alt.up": a,
        "keydown.alt.down": a,
        "keydown.alt.left": a,
        "keydown.alt.right": a
      };
      typeof n.addNavigation == "object" && (g = {
        ...g,
        ...n.addNavigation
      }), gr([
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
      onClick: a,
      onMousedown: a
    }, [
      b(o).columns[e.colIndex].cellComponent ? ($(), Se(Qt(b(o).columns[e.colIndex].cellComponent), zt({
        key: 0,
        value: b(i)
      }, b(o).columns[e.colIndex].cellComponentProps), null, 16, ["value"])) : ($(), A("span", Nl, ce(b(i)), 1))
    ], 40, Cl));
  }
}), qe = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, Al = /* @__PURE__ */ qe(Rl, [["__scopeId", "data-v-1738c6fc"]]), Tl = ["tabindex"], Dl = {
  key: 0,
  tabIndex: -1,
  class: "list-index"
}, Vl = /* @__PURE__ */ K({
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
    vo((l) => ({
      "6b10edcf": b(r)
    }));
    const n = Z(t.tableid), o = V(null), r = n.numberedRowWidth.value, s = () => n.config.view !== "tree" ? "" : n.display[t.rowIndex].isRoot || n.display[t.rowIndex].isParent ? n.display[t.rowIndex].childrenOpen ? "-" : "+" : "", i = () => n.config.view !== "tree" || n.display[t.rowIndex].isRoot || n.display[t.rowIndex].open, a = (l) => {
      n.toggleRowExpand(l);
    };
    return t.addNavigation && gr([
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
      b(n).config.view === "list" ? ($(), A("td", Dl, ce(e.rowIndex + 1), 1)) : b(n).config.view === "tree" ? ($(), A("td", {
        key: 1,
        tabIndex: -1,
        class: "tree-index",
        onClick: c[0] || (c[0] = (u) => a(e.rowIndex))
      }, ce(s()), 1)) : ve(l.$slots, "indexCell", { key: 2 }, void 0, !0),
      ve(l.$slots, "default", {}, void 0, !0)
    ], 8, Tl)), [
      [Wt, i()]
    ]);
  }
}), Ll = /* @__PURE__ */ qe(Vl, [["__scopeId", "data-v-c758303d"]]);
let tt;
const Ml = new Uint8Array(16);
function jl() {
  if (!tt && (tt = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !tt))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return tt(Ml);
}
const G = [];
for (let e = 0; e < 256; ++e)
  G.push((e + 256).toString(16).slice(1));
function Ul(e, t = 0) {
  return (G[e[t + 0]] + G[e[t + 1]] + G[e[t + 2]] + G[e[t + 3]] + "-" + G[e[t + 4]] + G[e[t + 5]] + "-" + G[e[t + 6]] + G[e[t + 7]] + "-" + G[e[t + 8]] + G[e[t + 9]] + "-" + G[e[t + 10]] + G[e[t + 11]] + G[e[t + 12]] + G[e[t + 13]] + G[e[t + 14]] + G[e[t + 15]]).toLowerCase();
}
const Bl = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), lo = {
  randomUUID: Bl
};
function vr(e, t, n) {
  if (lo.randomUUID && !t && !e)
    return lo.randomUUID();
  e = e || {};
  const o = e.random || (e.rng || jl)();
  if (o[6] = o[6] & 15 | 64, o[8] = o[8] & 63 | 128, t) {
    n = n || 0;
    for (let r = 0; r < 16; ++r)
      t[n + r] = o[r];
    return t;
  }
  return Ul(o);
}
class Hl {
  constructor(t, n, o, r, s, i) {
    this.id = t || vr(), this.rows = o, this.columns = ge(n), this.config = ge(r), this.table = s || ge(this.createTableObject()), this.display = this.createDisplayObject(i), this.modal = ge({ visible: !1 });
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
const Fl = { key: 0 }, Gl = {
  class: "atable-header-row",
  tabindex: "-1"
}, Wl = {
  key: 0,
  id: "header-index"
}, Ql = /* @__PURE__ */ K({
  __name: "ATableHeader",
  props: {
    columns: null,
    config: null,
    tableid: null
  },
  setup(e) {
    const t = e;
    vo((s) => ({
      "1cb0fcc9": b(o)
    }));
    const n = Z(t.tableid), o = n.numberedRowWidth.value, r = (s) => ({
      minWidth: s.width || "40ch",
      textAlign: s.align || "center",
      width: n.config.fullWidth ? "auto" : null
    });
    return (s, i) => e.columns.length ? ($(), A("thead", Fl, [
      T("tr", Gl, [
        b(n).zeroColumn ? ($(), A("th", Wl)) : ke("", !0),
        ($(!0), A(Ie, null, Pe(e.columns, (a, l) => ($(), A("th", {
          key: l,
          tabindex: "-1",
          style: le(r(a))
        }, [
          ve(s.$slots, "default", {}, () => [
            yo(ce(a.label || String.fromCharCode(l + 97).toUpperCase()), 1)
          ], !0)
        ], 4))), 128))
      ])
    ])) : ke("", !0);
  }
}), zl = /* @__PURE__ */ qe(Ql, [["__scopeId", "data-v-8a8d9cee"]]), Kl = /* @__PURE__ */ K({
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
      ve(n.$slots, "default", {}, void 0, !0)
    ], 544));
  }
}), ql = /* @__PURE__ */ qe(Kl, [["__scopeId", "data-v-8ac70767"]]), Jl = /* @__PURE__ */ K({
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
    let o = n.modelValue ? n.modelValue : n.rows, r = new Hl(n.id, n.columns, o, n.config);
    nt(r.id, r), de(
      () => r.rows,
      (i, a) => {
        t("update:modelValue", i);
      },
      { deep: !0 }
    );
    const s = (i) => {
      var a;
      (a = r.modal.parent) != null && a.contains(i.target) || r.modal.visible && (r.modal.visible = !1);
    };
    return window.addEventListener("click", s), window.addEventListener("keydown", (i) => {
      if (i.key === "Escape" && r.modal.visible) {
        r.modal.visible = !1;
        const a = r.modal.parent;
        a && We().then(() => {
          const l = a.dataset.rowindex, c = a.dataset.colindex, u = document.querySelectorAll(`[data-rowindex='${l}'][data-colindex='${c}']`);
          u && u[0].focus();
        });
      }
    }), (i, a) => ($(), A("table", {
      class: "atable",
      style: le({ width: b(r).config.fullWidth ? "100%" : "auto" })
    }, [
      ve(i.$slots, "header", { data: b(r) }, () => [
        it(zl, {
          columns: b(r).columns,
          config: b(r).config,
          tableid: b(r).id
        }, null, 8, ["columns", "config", "tableid"])
      ], !0),
      T("tbody", null, [
        ve(i.$slots, "body", { data: b(r) }, () => [
          ($(!0), A(Ie, null, Pe(b(r).rows, (l, c) => ($(), Se(Ll, {
            key: l.id || b(vr)(),
            row: l,
            rowIndex: c,
            tableid: b(r).id
          }, {
            default: at(() => [
              ($(!0), A(Ie, null, Pe(b(r).columns, (u, d) => ($(), Se(Al, {
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
      ve(i.$slots, "footer", { data: b(r) }, void 0, !0),
      ve(i.$slots, "modal", { data: b(r) }, () => [
        ct(it(ql, {
          colIndex: b(r).modal.colIndex,
          rowIndex: b(r).modal.rowIndex,
          tableid: b(r).id,
          style: le({
            left: b(r).modal.left + "px",
            top: b(r).modal.top + "px",
            maxWidth: b(r).modal.width + "px"
          })
        }, {
          default: at(() => [
            ($(), Se(Qt(b(r).modal.component), zt({
              key: `${b(r).modal.rowIndex}:${b(r).modal.colIndex}`,
              colIndex: b(r).modal.colIndex,
              rowIndex: b(r).modal.rowIndex,
              tableid: b(r).id
            }, b(r).modal.componentProps), null, 16, ["colIndex", "rowIndex", "tableid"]))
          ]),
          _: 1
        }, 8, ["colIndex", "rowIndex", "tableid", "style"]), [
          [Wt, b(r).modal.visible]
        ])
      ], !0)
    ], 4));
  }
}), Yl = /* @__PURE__ */ qe(Jl, [["__scopeId", "data-v-9137b4c3"]]), Xl = /* @__PURE__ */ K({
  __name: "Records",
  setup(e) {
    const { stonecrop: t, isReady: n } = Ro(), o = { view: "list" };
    return (r, s) => b(n) ? ($(), Se(b(Yl), {
      key: 0,
      columns: b(t).schema.schema.toArray(),
      rows: b(t).store.records,
      config: o
    }, null, 8, ["columns", "rows"])) : ke("", !0);
  }
}), yr = (e) => (uo("data-v-18bfde6e"), e = e(), fo(), e), Zl = { class: "tabs" }, ec = ["onKeydown"], tc = { tabindex: "0" }, nc = ["onKeydown"], oc = {
  version: "1.1",
  id: "Capa_1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  x: "0px",
  y: "0px",
  viewBox: "0 0 424.098 424.098",
  style: { "enable-background": "new 0 0 424.098 424.098" },
  "xml:space": "preserve"
}, rc = /* @__PURE__ */ yr(() => /* @__PURE__ */ T("g", null, [
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
], -1)), sc = [
  rc
], ic = ["onKeydown"], ac = { tabindex: "0" }, lc = { style: { width: "11pt" } }, cc = /* @__PURE__ */ yr(() => /* @__PURE__ */ T("g", { transform: "matrix(-0.08088215,0,0,0.08088215,9.8016177,3.1263021e-6)" }, [
  /* @__PURE__ */ T("path", {
    d: "M 93.148438,80.832031 C 109.5,57.742188 104.03125,25.769531 80.941406,9.421875 57.851562,-6.925781 25.878906,-1.460938 9.53125,21.632812 -6.816406,44.722656 -1.351562,76.691406 21.742188,93.039062 38.222656,104.70703 60.011719,105.60547 77.394531,95.339844 l 37.769529,37.542966 c 4.07813,4.29297 10.86328,4.46485 15.15625,0.38672 4.29297,-4.07422 4.46485,-10.85937 0.39063,-15.15234 -0.12891,-0.13672 -0.25391,-0.26172 -0.39063,-0.39063 z m -41.839844,3.5 C 33.0625,84.335938 18.269531,69.554688 18.257812,51.308594 18.253906,33.0625 33.035156,18.269531 51.285156,18.261719 c 18.222656,-0.0078 33.007813,14.75 33.042969,32.972656 0.03125,18.25 -14.742187,33.066406 -32.996094,33.097656 -0.0078,0 -0.01172,0 -0.02344,0 z m 0,0",
    style: { fill: "#000000", "fill-opacity": "1", "fill-rule": "nonzero", stroke: "none" },
    id: "path2"
  })
], -1)), uc = [
  cc
], dc = /* @__PURE__ */ K({
  __name: "SheetNav",
  props: {
    breadcrumbs: null
  },
  setup(e) {
    const t = e, n = V([]), o = V(!0), r = V(!1), s = V(""), i = V(null), a = j(() => o.value ? "unrotated" : "rotated");
    Gt(() => {
      n.value = t.breadcrumbs || [];
    });
    const l = () => {
      o.value = !o.value;
    }, c = async () => {
      r.value = !r.value, await We(() => {
        i.value.focus();
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
        T("ul", Zl, [
          T("li", {
            class: "hidebreadcrumbs",
            onClick: l,
            onKeydown: Ye(l, ["enter"])
          }, [
            T("a", tc, [
              T("div", {
                class: co(b(a))
              }, "×", 2)
            ])
          ], 40, ec),
          T("li", {
            class: "hometab",
            onClick: f,
            onKeydown: Ye(f, ["enter"]),
            style: le({ display: o.value ? "block" : "none" })
          }, [
            it(g, {
              to: "/home",
              tabindex: "0"
            }, {
              default: at(() => [
                ($(), A("svg", oc, sc))
              ]),
              _: 1
            })
          ], 44, nc),
          T("li", {
            class: "searchtab",
            onClick: c,
            onKeydown: Ye(c, ["enter"]),
            style: le({ display: o.value ? "block" : "none" })
          }, [
            T("a", ac, [
              T("span", {
                style: le({ display: r.value ? "none" : "block" })
              }, [
                ($(), A("svg", lc, uc))
              ], 4),
              ct(T("input", {
                "onUpdate:modelValue": m[0] || (m[0] = (y) => s.value = y),
                ref_key: "searchinput",
                ref: i,
                style: le({ display: r.value ? "block" : "none" }),
                onClick: m[1] || (m[1] = (y) => u(y)),
                onInput: m[2] || (m[2] = (y) => u(y)),
                onBlur: m[3] || (m[3] = (y) => d(y)),
                onKeydown: m[4] || (m[4] = Ye((y) => d(y), ["enter"])),
                type: "text"
              }, null, 36), [
                [Or, s.value]
              ])
            ])
          ], 44, ic),
          ($(!0), A(Ie, null, Pe(n.value, (y, O) => ($(), A("li", {
            key: O,
            style: le({ display: o.value ? "block" : "none" })
          }, [
            it(g, {
              tabindex: "0",
              to: y.to
            }, {
              default: at(() => [
                yo(ce(y.title), 1)
              ]),
              _: 2
            }, 1032, ["to"])
          ], 4))), 128))
        ])
      ]);
    };
  }
});
const fc = /* @__PURE__ */ Yt(dc, [["__scopeId", "data-v-18bfde6e"]]), gc = {
  install: (e) => {
    e.component("ActionSet", Ur), e.component("CommandPalette", Fr), e.component("Doctype", ml), e.component("Records", Xl), e.component("SheetNav", fc);
  }
};
export {
  Ur as ActionSet,
  Fr as CommandPalette,
  ml as Doctype,
  Xl as Records,
  fc as SheetNav,
  gc as StonecropDesktop
};
//# sourceMappingURL=desktop.js.map
