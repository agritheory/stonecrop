import { defineComponent as q, ref as V, onMounted as Lt, openBlock as C, createElementBlock as A, normalizeClass as co, createElementVNode as T, Fragment as Ie, renderList as Pe, toDisplayString as ce, createCommentVNode as ke, withDirectives as lt, vShow as jt, pushScopeId as lo, popScopeId as uo, inject as Z, computed as B, createBlock as Se, resolveDynamicComponent as Bt, mergeProps as Ut, effectScope as fo, markRaw as Ee, onBeforeMount as wr, shallowRef as br, toRaw as ut, hasInjectionContext as _r, getCurrentInstance as Ht, unref as k, shallowReactive as Er, watch as ue, reactive as _e, isRef as We, isReactive as Wt, toRef as yt, nextTick as Fe, getCurrentScope as po, onScopeDispose as ho, h as mo, provide as nt, toRefs as dn, watchEffect as kr, normalizeStyle as ie, renderSlot as me, createVNode as at, withCtx as it, useCssVars as vo, createTextVNode as go, onBeforeUnmount as Sr, resolveComponent as Or, withKeys as Ye, vModelText as Ir } from "vue";
const Ft = (e) => (lo("data-v-b7fdfbec"), e = e(), uo(), e), Pr = { class: "action-menu-icon" }, Cr = /* @__PURE__ */ Ft(() => /* @__PURE__ */ T("svg", {
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
], -1)), xr = /* @__PURE__ */ Ft(() => /* @__PURE__ */ T("svg", {
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
  Cr,
  xr
], Nr = /* @__PURE__ */ Ft(() => /* @__PURE__ */ T("div", { style: { "margin-right": "30px" } }, null, -1)), Rr = ["onclick"], Ar = { key: 1 }, Tr = ["onClick"], Dr = { class: "dropdown-container" }, Vr = { class: "dropdown" }, Mr = ["onclick"], Lr = ["href"], jr = { class: "dropdown-item" }, Br = /* @__PURE__ */ q({
  __name: "ActionSet",
  props: {
    elements: {}
  },
  setup(e) {
    const t = e, n = V([]), o = V(!1), r = V(null), s = V(!1), i = V(!1);
    Lt(() => {
      n.value = t.elements, a();
    });
    const a = () => {
      for (let d of n.value)
        d.elementType === "dropdown" && (d.show = !1);
    }, l = () => {
      s.value = !0, r.value = setTimeout(() => {
        s.value && (o.value = !0);
      }, 500);
    }, u = () => {
      s.value = !1, i.value = !1, clearTimeout(r.value), o.value = !1;
    }, c = (d) => {
      const f = !n.value[d].show;
      a(), n.value[d].show = f;
    };
    return (d, f) => (C(), A("div", {
      class: co([{ "open-set": o.value, "hovered-and-closed": i.value }, "action-set collapse"]),
      onMouseover: l,
      onMouseleave: u
    }, [
      T("div", Pr, [
        T("div", {
          id: "chevron",
          onClick: f[0] || (f[0] = (p) => i.value = !i.value)
        }, $r)
      ]),
      Nr,
      (C(!0), A(Ie, null, Pe(n.value, (p, v) => (C(), A("div", {
        class: "action-element",
        key: v
      }, [
        p.elementType == "button" ? (C(), A("button", {
          key: 0,
          onclick: p.action,
          class: "button-default"
        }, ce(p.label), 9, Rr)) : ke("", !0),
        p.elementType == "dropdown" ? (C(), A("div", Ar, [
          T("button", {
            class: "button-default",
            onClick: (m) => c(v)
          }, ce(p.label), 9, Tr),
          lt(T("div", Dr, [
            T("div", Vr, [
              (C(!0), A(Ie, null, Pe(p.actions, (m) => (C(), A("div", {
                key: m.label
              }, [
                m.action != null ? (C(), A("button", {
                  key: 0,
                  onclick: m.action,
                  class: "dropdown-item"
                }, ce(m.label), 9, Mr)) : m.link != null ? (C(), A("a", {
                  key: 1,
                  href: m.link
                }, [
                  T("button", jr, ce(m.label), 1)
                ], 8, Lr)) : ke("", !0)
              ]))), 128))
            ])
          ], 512), [
            [jt, p.show]
          ])
        ])) : ke("", !0)
      ]))), 128))
    ], 34));
  }
}), Gt = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, Ur = /* @__PURE__ */ Gt(Br, [["__scopeId", "data-v-b7fdfbec"]]), Hr = {};
function Wr(e, t) {
  return C(), A("dialog");
}
const Fr = /* @__PURE__ */ Gt(Hr, [["render", Wr]]), Gr = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
};
var fn;
const zr = typeof window < "u";
zr && (fn = window == null ? void 0 : window.navigator) != null && fn.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function Qr(e) {
  return e;
}
const pn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, hn = "__vueuse_ssr_handlers__";
pn[hn] = pn[hn] || {};
var mn;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(mn || (mn = {}));
var qr = Object.defineProperty, vn = Object.getOwnPropertySymbols, Kr = Object.prototype.hasOwnProperty, Jr = Object.prototype.propertyIsEnumerable, gn = (e, t, n) => t in e ? qr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Yr = (e, t) => {
  for (var n in t || (t = {}))
    Kr.call(t, n) && gn(e, n, t[n]);
  if (vn)
    for (var n of vn(t))
      Jr.call(t, n) && gn(e, n, t[n]);
  return e;
};
const Xr = {
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
Yr({
  linear: Qr
}, Xr);
q({
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
const Zr = /* @__PURE__ */ q({
  __name: "AForm",
  props: {
    modelValue: {},
    data: {},
    readonly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = V(n.data || {}), s = (a) => {
      let l = {};
      for (const [u, c] of Object.entries(a))
        ["component", "fieldtype"].includes(u) || (l[u] = c), u === "rows" && c && c.length === 0 && (l.rows = r.value[a.fieldname]);
      return l;
    }, i = B({
      get: () => n.modelValue.map((a, l) => B({
        get() {
          return a.value;
        },
        set: (u) => {
          n.modelValue[l].value = u, o("update:modelValue", n.modelValue);
        }
      })),
      set: () => {
      }
    });
    return (a, l) => (C(), A("form", null, [
      (C(!0), A(Ie, null, Pe(a.modelValue, (u, c) => (C(), Se(Bt(u.component), Ut({
        key: c,
        schema: u,
        modelValue: i.value[c].value,
        "onUpdate:modelValue": (d) => i.value[c].value = d,
        data: r.value[u.fieldname],
        readonly: a.readonly
      }, s(u)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
}), es = /* @__PURE__ */ Gr(Zr, [["__scopeId", "data-v-74d66cf2"]]), yn = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function ts(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function ns(e) {
  var t;
  let n = e.value;
  if (n) {
    const o = ts(n);
    if (o) {
      const r = e.instance.locale;
      n = o(r);
    }
  } else {
    const o = (t = e.instance.schema.fieldtype) == null ? void 0 : t.toLowerCase();
    o && yn[o] && (n = yn[o]);
  }
  return n;
}
function os(e, t) {
  t || (t = "#");
  let n = e;
  const o = [t, "/", "-", "(", ")", " "];
  for (const r of o)
    n = n.replaceAll(r, "");
  return n;
}
function rs(e, t, n) {
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
function ss(e, t) {
  const n = ns(t);
  if (!n)
    return;
  const o = "#", r = e.value, s = os(r, o);
  if (s) {
    const i = rs(s, n, o);
    t.instance.maskFilled && (t.instance.maskFilled = !i.includes(o)), e.value = i;
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
    return { inputText: B({
      get() {
        return e.modelValue;
      },
      set(r) {
        t.emit("update:modelValue", r);
      }
    }), locale: o, maskFilled: n };
  },
  directives: {
    mask: ss
  }
});
function It(e) {
  this.message = e || "";
}
It.prototype = Object.create(Error.prototype, {
  constructor: { value: It },
  name: { value: "NotImplemented" },
  stack: {
    get: function() {
      return new Error().stack;
    }
  }
});
class je {
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
    if (this.name = "Stonecrop", je._root)
      return je._root;
    je._root = this, this.registry = t, this.store = n, this.schema = o, this.workflow = r, this.actions = s;
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
   * @returns {DoctypeMeta}
   * @see {@link DoctypeMeta}
   * @throws NotImplementedError
   * @description Gets the meta for the given doctype
   * @example
   * const doctype = await registry.getMeta('Task')
   * const meta = stonecrop.getMeta(doctype)
   */
  getMeta(t) {
    return this.registry.getMeta ? this.registry.getMeta(t.doctype) : new It(t.doctype);
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
var yo = !1;
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
function as() {
  return wo().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function wo() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const is = typeof Proxy == "function", cs = "devtools-plugin:setup", ls = "plugin:settings:set";
let $e, Pt;
function us() {
  var e;
  return $e !== void 0 || (typeof window < "u" && window.performance ? ($e = !0, Pt = window.performance) : typeof global < "u" && (!((e = global.perf_hooks) === null || e === void 0) && e.performance) ? ($e = !0, Pt = global.perf_hooks.performance) : $e = !1), $e;
}
function ds() {
  return us() ? Pt.now() : Date.now();
}
class fs {
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
        return ds();
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
      }), this.fallbacks[a](...l)) : (...l) => new Promise((u) => {
        this.targetQueue.push({
          method: a,
          args: l,
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
function zt(e, t) {
  const n = e, o = wo(), r = as(), s = is && n.enableEarlyProxy;
  if (r && (o.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !s))
    r.emit(cs, e, t);
  else {
    const i = s ? new fs(n, r) : null;
    (o.__VUE_DEVTOOLS_PLUGINS__ = o.__VUE_DEVTOOLS_PLUGINS__ || []).push({
      pluginDescriptor: n,
      setupFn: t,
      proxy: i
    }), i && t(i.proxiedTarget);
  }
}
/*!
 * pinia v2.1.7
 * (c) 2023 Eduardo San Martin Morote
 * @license MIT
 */
let Le;
const Ge = (e) => Le = e, bo = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
  /* istanbul ignore next */
  Symbol()
);
function Ce(e) {
  return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var oe;
(function(e) {
  e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(oe || (oe = {}));
const dt = typeof window < "u", Be = (process.env.NODE_ENV !== "production" || !1) && process.env.NODE_ENV !== "test" && dt, wn = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null };
function ps(e, { autoBom: t = !1 } = {}) {
  return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["\uFEFF", e], { type: e.type }) : e;
}
function Qt(e, t, n) {
  const o = new XMLHttpRequest();
  o.open("GET", e), o.responseType = "blob", o.onload = function() {
    ko(o.response, t, n);
  }, o.onerror = function() {
    console.error("could not download file");
  }, o.send();
}
function _o(e) {
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
const rt = typeof navigator == "object" ? navigator : { userAgent: "" }, Eo = /Macintosh/.test(rt.userAgent) && /AppleWebKit/.test(rt.userAgent) && !/Safari/.test(rt.userAgent), ko = dt ? (
  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
  typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !Eo ? hs : (
    // Use msSaveOrOpenBlob as a second approach
    "msSaveOrOpenBlob" in rt ? ms : (
      // Fallback to using FileReader and a popup
      vs
    )
  )
) : () => {
};
function hs(e, t = "download", n) {
  const o = document.createElement("a");
  o.download = t, o.rel = "noopener", typeof e == "string" ? (o.href = e, o.origin !== location.origin ? _o(o.href) ? Qt(e, t, n) : (o.target = "_blank", ot(o)) : ot(o)) : (o.href = URL.createObjectURL(e), setTimeout(function() {
    URL.revokeObjectURL(o.href);
  }, 4e4), setTimeout(function() {
    ot(o);
  }, 0));
}
function ms(e, t = "download", n) {
  if (typeof e == "string")
    if (_o(e))
      Qt(e, t, n);
    else {
      const o = document.createElement("a");
      o.href = e, o.target = "_blank", setTimeout(function() {
        ot(o);
      });
    }
  else
    navigator.msSaveOrOpenBlob(ps(e, n), t);
}
function vs(e, t, n, o) {
  if (o = o || open("", "_blank"), o && (o.document.title = o.document.body.innerText = "downloading..."), typeof e == "string")
    return Qt(e, t, n);
  const r = e.type === "application/octet-stream", s = /constructor/i.test(String(wn.HTMLElement)) || "safari" in wn, i = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((i || r && s || Eo) && typeof FileReader < "u") {
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
function qt(e) {
  return "_a" in e && "install" in e;
}
function So() {
  if (!("clipboard" in navigator))
    return H("Your browser doesn't support the Clipboard API", "error"), !0;
}
function Oo(e) {
  return e instanceof Error && e.message.toLowerCase().includes("document is not focused") ? (H('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn"), !0) : !1;
}
async function gs(e) {
  if (!So())
    try {
      await navigator.clipboard.writeText(JSON.stringify(e.state.value)), H("Global state copied to clipboard.");
    } catch (t) {
      if (Oo(t))
        return;
      H("Failed to serialize the state. Check the console for more details.", "error"), console.error(t);
    }
}
async function ys(e) {
  if (!So())
    try {
      Io(e, JSON.parse(await navigator.clipboard.readText())), H("Global state pasted from clipboard.");
    } catch (t) {
      if (Oo(t))
        return;
      H("Failed to deserialize the state from clipboard. Check the console for more details.", "error"), console.error(t);
    }
}
async function ws(e) {
  try {
    ko(new Blob([JSON.stringify(e.state.value)], {
      type: "text/plain;charset=utf-8"
    }), "pinia-state.json");
  } catch (t) {
    H("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
let re;
function bs() {
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
async function _s(e) {
  try {
    const n = await bs()();
    if (!n)
      return;
    const { text: o, file: r } = n;
    Io(e, JSON.parse(o)), H(`Global state imported from "${r.name}".`);
  } catch (t) {
    H("Failed to import the state from JSON. Check the console for more details.", "error"), console.error(t);
  }
}
function Io(e, t) {
  for (const n in t) {
    const o = e.state.value[n];
    o ? Object.assign(o, t[n]) : e.state.value[n] = t[n];
  }
}
function te(e) {
  return {
    _custom: {
      display: e
    }
  };
}
const Po = "🍍 Pinia (root)", Ct = "_root";
function Es(e) {
  return qt(e) ? {
    id: Ct,
    label: Po
  } : {
    id: e.$id,
    label: e.$id
  };
}
function ks(e) {
  if (qt(e)) {
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
function Ss(e) {
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
function Os(e) {
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
const st = [], be = "pinia:mutations", z = "pinia", { assign: Is } = Object, ct = (e) => "🍍 " + e;
function Ps(e, t) {
  zt({
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
      id: z,
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
            await ys(t), n.sendInspectorTree(z), n.sendInspectorState(z);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            ws(t);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await _s(t), n.sendInspectorTree(z), n.sendInspectorState(z);
          },
          tooltip: "Import the state from a JSON file"
        }
      ],
      nodeActions: [
        {
          icon: "restore",
          tooltip: 'Reset the state (with "$reset")',
          action: (o) => {
            const r = t._s.get(o);
            r ? typeof r.$reset != "function" ? H(`Cannot reset "${o}" store because it doesn't have a "$reset" method implemented.`, "warn") : (r.$reset(), H(`Store "${o}" reset.`)) : H(`Cannot reset "${o}" store because it wasn't found.`, "warn");
          }
        }
      ]
    }), n.on.inspectComponent((o, r) => {
      const s = o.componentInstance && o.componentInstance.proxy;
      if (s && s._pStores) {
        const i = o.componentInstance.proxy._pStores;
        Object.values(i).forEach((a) => {
          o.instanceData.state.push({
            type: ct(a.$id),
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
              Object.keys(a.$state).reduce((l, u) => (l[u] = a.$state[u], l), {})
            )
          }), a._getters && a._getters.length && o.instanceData.state.push({
            type: ct(a.$id),
            key: "getters",
            editable: !1,
            value: a._getters.reduce((l, u) => {
              try {
                l[u] = a[u];
              } catch (c) {
                l[u] = c;
              }
              return l;
            }, {})
          });
        });
      }
    }), n.on.getInspectorTree((o) => {
      if (o.app === e && o.inspectorId === z) {
        let r = [t];
        r = r.concat(Array.from(t._s.values())), o.rootNodes = (o.filter ? r.filter((s) => "$id" in s ? s.$id.toLowerCase().includes(o.filter.toLowerCase()) : Po.toLowerCase().includes(o.filter.toLowerCase())) : r).map(Es);
      }
    }), n.on.getInspectorState((o) => {
      if (o.app === e && o.inspectorId === z) {
        const r = o.nodeId === Ct ? t : t._s.get(o.nodeId);
        if (!r)
          return;
        r && (o.state = ks(r));
      }
    }), n.on.editInspectorState((o, r) => {
      if (o.app === e && o.inspectorId === z) {
        const s = o.nodeId === Ct ? t : t._s.get(o.nodeId);
        if (!s)
          return H(`store "${o.nodeId}" not found`, "error");
        const { path: i } = o;
        qt(s) ? i.unshift("state") : (i.length !== 1 || !s._customProperties.has(i[0]) || i[0] in s.$state) && i.unshift("$state"), Re = !1, o.set(s, i, o.state.value), Re = !0;
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
        i[0] = "$state", Re = !1, o.set(s, i, o.state.value), Re = !0;
      }
    });
  });
}
function Cs(e, t) {
  st.includes(ct(t.$id)) || st.push(ct(t.$id)), zt({
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
    t.$onAction(({ after: i, onError: a, name: l, args: u }) => {
      const c = Co++;
      n.addTimelineEvent({
        layerId: be,
        event: {
          time: o(),
          title: "🛫 " + l,
          subtitle: "start",
          data: {
            store: te(t.$id),
            action: te(l),
            args: u
          },
          groupId: c
        }
      }), i((d) => {
        ve = void 0, n.addTimelineEvent({
          layerId: be,
          event: {
            time: o(),
            title: "🛬 " + l,
            subtitle: "end",
            data: {
              store: te(t.$id),
              action: te(l),
              args: u,
              result: d
            },
            groupId: c
          }
        });
      }), a((d) => {
        ve = void 0, n.addTimelineEvent({
          layerId: be,
          event: {
            time: o(),
            logType: "error",
            title: "💥 " + l,
            subtitle: "end",
            data: {
              store: te(t.$id),
              action: te(l),
              args: u,
              error: d
            },
            groupId: c
          }
        });
      });
    }, !0), t._customProperties.forEach((i) => {
      ue(() => k(t[i]), (a, l) => {
        n.notifyComponentUpdate(), n.sendInspectorState(z), Re && n.addTimelineEvent({
          layerId: be,
          event: {
            time: o(),
            title: "Change",
            subtitle: i,
            data: {
              newValue: a,
              oldValue: l
            },
            groupId: ve
          }
        });
      }, { deep: !0 });
    }), t.$subscribe(({ events: i, type: a }, l) => {
      if (n.notifyComponentUpdate(), n.sendInspectorState(z), !Re)
        return;
      const u = {
        time: o(),
        title: Os(a),
        data: Is({ store: te(t.$id) }, Ss(i)),
        groupId: ve
      };
      a === oe.patchFunction ? u.subtitle = "⤵️" : a === oe.patchObject ? u.subtitle = "🧩" : i && !Array.isArray(i) && (u.subtitle = i.type), i && (u.data["rawEvent(s)"] = {
        _custom: {
          display: "DebuggerEvent",
          type: "object",
          tooltip: "raw DebuggerEvent[]",
          value: i
        }
      }), n.addTimelineEvent({
        layerId: be,
        event: u
      });
    }, { detached: !0, flush: "sync" });
    const r = t._hotUpdate;
    t._hotUpdate = Ee((i) => {
      r(i), n.addTimelineEvent({
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
      }), n.notifyComponentUpdate(), n.sendInspectorTree(z), n.sendInspectorState(z);
    });
    const { $dispose: s } = t;
    t.$dispose = () => {
      s(), n.notifyComponentUpdate(), n.sendInspectorTree(z), n.sendInspectorState(z), n.getSettings().logStoreChanges && H(`Disposed "${t.$id}" store 🗑`);
    }, n.notifyComponentUpdate(), n.sendInspectorTree(z), n.sendInspectorState(z), n.getSettings().logStoreChanges && H(`"${t.$id}" store installed 🆕`);
  });
}
let Co = 0, ve;
function bn(e, t, n) {
  const o = t.reduce((r, s) => (r[s] = ut(e)[s], r), {});
  for (const r in o)
    e[r] = function() {
      const s = Co, i = n ? new Proxy(e, {
        get(...l) {
          return ve = s, Reflect.get(...l);
        },
        set(...l) {
          return ve = s, Reflect.set(...l);
        }
      }) : e;
      ve = s;
      const a = o[r].apply(i, arguments);
      return ve = void 0, a;
    };
}
function xs({ app: e, store: t, options: n }) {
  if (t.$id.startsWith("__hot:"))
    return;
  t._isOptionsAPI = !!n.state, bn(t, Object.keys(n.actions), t._isOptionsAPI);
  const o = t._hotUpdate;
  ut(t)._hotUpdate = function(r) {
    o.apply(this, arguments), bn(t, Object.keys(r._hmrPayload.actions), !!t._isOptionsAPI);
  }, Cs(
    e,
    // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
    t
  );
}
function $s() {
  const e = fo(!0), t = e.run(() => V({}));
  let n = [], o = [];
  const r = Ee({
    install(s) {
      Ge(r), r._a = s, s.provide(bo, r), s.config.globalProperties.$pinia = r, Be && Ps(s, r), o.forEach((i) => n.push(i)), o = [];
    },
    use(s) {
      return !this._a && !yo ? o.push(s) : n.push(s), this;
    },
    _p: n,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return Be && typeof Proxy < "u" && r.use(xs), r;
}
function xo(e, t) {
  for (const n in t) {
    const o = t[n];
    if (!(n in e))
      continue;
    const r = e[n];
    Ce(r) && Ce(o) && !We(o) && !Wt(o) ? e[n] = xo(r, o) : e[n] = o;
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
  return !n && po() && ho(r), r;
}
function Ne(e, ...t) {
  e.slice().forEach((n) => {
    n(...t);
  });
}
const Ns = (e) => e();
function xt(e, t) {
  e instanceof Map && t instanceof Map && t.forEach((n, o) => e.set(o, n)), e instanceof Set && t instanceof Set && t.forEach(e.add, e);
  for (const n in t) {
    if (!t.hasOwnProperty(n))
      continue;
    const o = t[n], r = e[n];
    Ce(r) && Ce(o) && e.hasOwnProperty(n) && !We(o) && !Wt(o) ? e[n] = xt(r, o) : e[n] = o;
  }
  return e;
}
const Rs = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
);
function As(e) {
  return !Ce(e) || !e.hasOwnProperty(Rs);
}
const { assign: X } = Object;
function En(e) {
  return !!(We(e) && e.effect);
}
function kn(e, t, n, o) {
  const { state: r, actions: s, getters: i } = t, a = n.state.value[e];
  let l;
  function u() {
    !a && (process.env.NODE_ENV === "production" || !o) && (n.state.value[e] = r ? r() : {});
    const c = process.env.NODE_ENV !== "production" && o ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      dn(V(r ? r() : {}).value)
    ) : dn(n.state.value[e]);
    return X(c, s, Object.keys(i || {}).reduce((d, f) => (process.env.NODE_ENV !== "production" && f in c && console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${f}" in store "${e}".`), d[f] = Ee(B(() => {
      Ge(n);
      const p = n._s.get(e);
      return i[f].call(p, p);
    })), d), {}));
  }
  return l = $t(e, u, t, n, o, !0), l;
}
function $t(e, t, n = {}, o, r, s) {
  let i;
  const a = X({ actions: {} }, n);
  if (process.env.NODE_ENV !== "production" && !o._e.active)
    throw new Error("Pinia destroyed");
  const l = {
    deep: !0
    // flush: 'post',
  };
  process.env.NODE_ENV !== "production" && !yo && (l.onTrigger = (E) => {
    u ? p = E : u == !1 && !S._hotUpdating && (Array.isArray(p) ? p.push(E) : console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug."));
  });
  let u, c, d = [], f = [], p;
  const v = o.state.value[e];
  !s && !v && (process.env.NODE_ENV === "production" || !r) && (o.state.value[e] = {});
  const m = V({});
  let w;
  function O(E) {
    let b;
    u = c = !1, process.env.NODE_ENV !== "production" && (p = []), typeof E == "function" ? (E(o.state.value[e]), b = {
      type: oe.patchFunction,
      storeId: e,
      events: p
    }) : (xt(o.state.value[e], E), b = {
      type: oe.patchObject,
      payload: E,
      storeId: e,
      events: p
    });
    const D = w = Symbol();
    Fe().then(() => {
      w === D && (u = !0);
    }), c = !0, Ne(d, b, o.state.value[e]);
  }
  const I = s ? function() {
    const { state: b } = n, D = b ? b() : {};
    this.$patch((U) => {
      X(U, D);
    });
  } : (
    /* istanbul ignore next */
    process.env.NODE_ENV !== "production" ? () => {
      throw new Error(`🍍: Store "${e}" is built using the setup syntax and does not implement $reset().`);
    } : $o
  );
  function M() {
    i.stop(), d = [], f = [], o._s.delete(e);
  }
  function W(E, b) {
    return function() {
      Ge(o);
      const D = Array.from(arguments), U = [], ye = [];
      function De(G) {
        U.push(G);
      }
      function Ke(G) {
        ye.push(G);
      }
      Ne(f, {
        args: D,
        name: E,
        store: S,
        after: De,
        onError: Ke
      });
      let ne;
      try {
        ne = b.apply(this && this.$id === e ? this : S, D);
      } catch (G) {
        throw Ne(ye, G), G;
      }
      return ne instanceof Promise ? ne.then((G) => (Ne(U, G), G)).catch((G) => (Ne(ye, G), Promise.reject(G))) : (Ne(U, ne), ne);
    };
  }
  const J = /* @__PURE__ */ Ee({
    actions: {},
    getters: {},
    state: [],
    hotState: m
  }), Y = {
    _p: o,
    // _s: scope,
    $id: e,
    $onAction: _n.bind(null, f),
    $patch: O,
    $reset: I,
    $subscribe(E, b = {}) {
      const D = _n(d, E, b.detached, () => U()), U = i.run(() => ue(() => o.state.value[e], (ye) => {
        (b.flush === "sync" ? c : u) && E({
          storeId: e,
          type: oe.direct,
          events: p
        }, ye);
      }, X({}, l, b)));
      return D;
    },
    $dispose: M
  }, S = _e(process.env.NODE_ENV !== "production" || Be ? X(
    {
      _hmrPayload: J,
      _customProperties: Ee(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    Y
    // must be added later
    // setupStore
  ) : Y);
  o._s.set(e, S);
  const ee = (o._a && o._a.runWithContext || Ns)(() => o._e.run(() => (i = fo()).run(t)));
  for (const E in ee) {
    const b = ee[E];
    if (We(b) && !En(b) || Wt(b))
      process.env.NODE_ENV !== "production" && r ? Xe(m.value, E, yt(ee, E)) : s || (v && As(b) && (We(b) ? b.value = v[E] : xt(b, v[E])), o.state.value[e][E] = b), process.env.NODE_ENV !== "production" && J.state.push(E);
    else if (typeof b == "function") {
      const D = process.env.NODE_ENV !== "production" && r ? b : W(E, b);
      ee[E] = D, process.env.NODE_ENV !== "production" && (J.actions[E] = b), a.actions[E] = b;
    } else
      process.env.NODE_ENV !== "production" && En(b) && (J.getters[E] = s ? (
        // @ts-expect-error
        n.getters[E]
      ) : b, dt && (ee._getters || // @ts-expect-error: same
      (ee._getters = Ee([]))).push(E));
  }
  if (X(S, ee), X(ut(S), ee), Object.defineProperty(S, "$state", {
    get: () => process.env.NODE_ENV !== "production" && r ? m.value : o.state.value[e],
    set: (E) => {
      if (process.env.NODE_ENV !== "production" && r)
        throw new Error("cannot set hotState");
      O((b) => {
        X(b, E);
      });
    }
  }), process.env.NODE_ENV !== "production" && (S._hotUpdate = Ee((E) => {
    S._hotUpdating = !0, E._hmrPayload.state.forEach((b) => {
      if (b in S.$state) {
        const D = E.$state[b], U = S.$state[b];
        typeof D == "object" && Ce(D) && Ce(U) ? xo(D, U) : E.$state[b] = U;
      }
      Xe(S, b, yt(E.$state, b));
    }), Object.keys(S.$state).forEach((b) => {
      b in E.$state || wt(S, b);
    }), u = !1, c = !1, o.state.value[e] = yt(E._hmrPayload, "hotState"), c = !0, Fe().then(() => {
      u = !0;
    });
    for (const b in E._hmrPayload.actions) {
      const D = E[b];
      Xe(S, b, W(b, D));
    }
    for (const b in E._hmrPayload.getters) {
      const D = E._hmrPayload.getters[b], U = s ? (
        // special handling of options api
        B(() => (Ge(o), D.call(S, S)))
      ) : D;
      Xe(S, b, U);
    }
    Object.keys(S._hmrPayload.getters).forEach((b) => {
      b in E._hmrPayload.getters || wt(S, b);
    }), Object.keys(S._hmrPayload.actions).forEach((b) => {
      b in E._hmrPayload.actions || wt(S, b);
    }), S._hmrPayload = E._hmrPayload, S._getters = E._getters, S._hotUpdating = !1;
  })), Be) {
    const E = {
      writable: !0,
      configurable: !0,
      // avoid warning on devtools trying to display this property
      enumerable: !1
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((b) => {
      Object.defineProperty(S, b, X({ value: S[b] }, E));
    });
  }
  return o._p.forEach((E) => {
    if (Be) {
      const b = i.run(() => E({
        store: S,
        app: o._a,
        pinia: o,
        options: a
      }));
      Object.keys(b || {}).forEach((D) => S._customProperties.add(D)), X(S, b);
    } else
      X(S, i.run(() => E({
        store: S,
        app: o._a,
        pinia: o,
        options: a
      })));
  }), process.env.NODE_ENV !== "production" && S.$state && typeof S.$state == "object" && typeof S.$state.constructor == "function" && !S.$state.constructor.toString().includes("[native code]") && console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${S.$id}".`), v && s && n.hydrate && n.hydrate(S.$state, v), u = !0, c = !0, S;
}
function Ts(e, t, n) {
  let o, r;
  const s = typeof t == "function";
  if (typeof e == "string")
    o = e, r = s ? n : t;
  else if (r = e, o = e.id, process.env.NODE_ENV !== "production" && typeof o != "string")
    throw new Error('[🍍]: "defineStore()" must be passed a store id as its first argument.');
  function i(a, l) {
    const u = _r();
    if (a = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (process.env.NODE_ENV === "test" && Le && Le._testing ? null : a) || (u ? Z(bo, null) : null), a && Ge(a), process.env.NODE_ENV !== "production" && !Le)
      throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
    a = Le, a._s.has(o) || (s ? $t(o, t, r, a) : kn(o, r, a), process.env.NODE_ENV !== "production" && (i._pinia = a));
    const c = a._s.get(o);
    if (process.env.NODE_ENV !== "production" && l) {
      const d = "__hot:" + o, f = s ? $t(d, t, r, a, !0) : kn(d, X({}, r), a, !0);
      l._hotUpdate(f), delete a.state.value[d], a._s.delete(d);
    }
    if (process.env.NODE_ENV !== "production" && dt) {
      const d = Ht();
      if (d && d.proxy && // avoid adding stores that are just built for hot module replacement
      !l) {
        const f = d.proxy, p = "_pStores" in f ? f._pStores : f._pStores = {};
        p[o] = c;
      }
    }
    return c;
  }
  return i.$id = o, i;
}
const Ds = Ts("data", () => {
  const e = V([]), t = V({});
  return { records: e, record: t };
});
function No(e) {
  e || (e = Z("$registry"));
  const t = Ds(), n = V(new je(e, t)), o = V(!1);
  return wr(async () => {
    var r, s;
    const i = e.router.currentRoute.value, a = (r = i.params.records) == null ? void 0 : r.toString().toLowerCase(), l = (s = i.params.record) == null ? void 0 : s.toString().toLowerCase();
    if (!a && !l)
      return;
    const u = await e.getMeta(a);
    e.addDoctype(u), n.value.setup(u), a && (l ? await n.value.getRecord(u, l) : await n.value.getRecords(u)), n.value.runAction(u, "LOAD", l ? [l] : void 0), o.value = !0;
  }), { stonecrop: n, isReady: o };
}
/*!
  * vue-router v4.2.5
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
const ae = typeof window < "u";
function Vs(e) {
  return e.__esModule || e[Symbol.toStringTag] === "Module";
}
const R = Object.assign;
function bt(e, t) {
  const n = {};
  for (const o in t) {
    const r = t[o];
    n[o] = K(r) ? r.map(e) : e(r);
  }
  return n;
}
const Ue = () => {
}, K = Array.isArray;
function $(e) {
  const t = Array.from(arguments).slice(1);
  console.warn.apply(console, ["[Vue Router warn]: " + e].concat(t));
}
const Ms = /\/$/, Ls = (e) => e.replace(Ms, "");
function _t(e, t, n = "/") {
  let o, r = {}, s = "", i = "";
  const a = t.indexOf("#");
  let l = t.indexOf("?");
  return a < l && a >= 0 && (l = -1), l > -1 && (o = t.slice(0, l), s = t.slice(l + 1, a > -1 ? a : t.length), r = e(s)), a > -1 && (o = o || t.slice(0, a), i = t.slice(a, t.length)), o = Us(o ?? t, n), {
    fullPath: o + (s && "?") + s + i,
    path: o,
    query: r,
    hash: i
  };
}
function js(e, t) {
  const n = t.query ? e(t.query) : "";
  return t.path + (n && "?") + n + (t.hash || "");
}
function Sn(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || "/";
}
function On(e, t, n) {
  const o = t.matched.length - 1, r = n.matched.length - 1;
  return o > -1 && o === r && ge(t.matched[o], n.matched[r]) && Ro(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function ge(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t);
}
function Ro(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (!Bs(e[n], t[n]))
      return !1;
  return !0;
}
function Bs(e, t) {
  return K(e) ? In(e, t) : K(t) ? In(t, e) : e === t;
}
function In(e, t) {
  return K(t) ? e.length === t.length && e.every((n, o) => n === t[o]) : e.length === 1 && e[0] === t;
}
function Us(e, t) {
  if (e.startsWith("/"))
    return e;
  if (process.env.NODE_ENV !== "production" && !t.startsWith("/"))
    return $(`Cannot resolve a relative location without an absolute path. Trying to resolve "${e}" from "${t}". It should look like "/${t}".`), e;
  if (!e)
    return t;
  const n = t.split("/"), o = e.split("/"), r = o[o.length - 1];
  (r === ".." || r === ".") && o.push("");
  let s = n.length - 1, i, a;
  for (i = 0; i < o.length; i++)
    if (a = o[i], a !== ".")
      if (a === "..")
        s > 1 && s--;
      else
        break;
  return n.slice(0, s).join("/") + "/" + o.slice(i - (i === o.length ? 1 : 0)).join("/");
}
var ze;
(function(e) {
  e.pop = "pop", e.push = "push";
})(ze || (ze = {}));
var He;
(function(e) {
  e.back = "back", e.forward = "forward", e.unknown = "";
})(He || (He = {}));
function Hs(e) {
  if (!e)
    if (ae) {
      const t = document.querySelector("base");
      e = t && t.getAttribute("href") || "/", e = e.replace(/^\w+:\/\/[^\/]+/, "");
    } else
      e = "/";
  return e[0] !== "/" && e[0] !== "#" && (e = "/" + e), Ls(e);
}
const Ws = /^[^#]+#/;
function Fs(e, t) {
  return e.replace(Ws, "#") + t;
}
function Gs(e, t) {
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
function zs(e) {
  let t;
  if ("el" in e) {
    const n = e.el, o = typeof n == "string" && n.startsWith("#");
    if (process.env.NODE_ENV !== "production" && typeof e.el == "string" && (!o || !document.getElementById(e.el.slice(1))))
      try {
        const s = document.querySelector(e.el);
        if (o && s) {
          $(`The selector "${e.el}" should be passed as "el: document.querySelector('${e.el}')" because it starts with "#".`);
          return;
        }
      } catch {
        $(`The selector "${e.el}" is invalid. If you are using an id selector, make sure to escape it. You can find more information about escaping characters in selectors at https://mathiasbynens.be/notes/css-escapes or use CSS.escape (https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape).`);
        return;
      }
    const r = typeof n == "string" ? o ? document.getElementById(n.slice(1)) : document.querySelector(n) : n;
    if (!r) {
      process.env.NODE_ENV !== "production" && $(`Couldn't find element using selector "${e.el}" returned by scrollBehavior.`);
      return;
    }
    t = Gs(r, e);
  } else
    t = e;
  "scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left != null ? t.left : window.pageXOffset, t.top != null ? t.top : window.pageYOffset);
}
function Pn(e, t) {
  return (history.state ? history.state.position - t : -1) + e;
}
const Nt = /* @__PURE__ */ new Map();
function Qs(e, t) {
  Nt.set(e, t);
}
function qs(e) {
  const t = Nt.get(e);
  return Nt.delete(e), t;
}
let Ks = () => location.protocol + "//" + location.host;
function Ao(e, t) {
  const { pathname: n, search: o, hash: r } = t, s = e.indexOf("#");
  if (s > -1) {
    let a = r.includes(e.slice(s)) ? e.slice(s).length : 1, l = r.slice(a);
    return l[0] !== "/" && (l = "/" + l), Sn(l, "");
  }
  return Sn(n, e) + o + r;
}
function Js(e, t, n, o) {
  let r = [], s = [], i = null;
  const a = ({ state: f }) => {
    const p = Ao(e, location), v = n.value, m = t.value;
    let w = 0;
    if (f) {
      if (n.value = p, t.value = f, i && i === v) {
        i = null;
        return;
      }
      w = m ? f.position - m.position : 0;
    } else
      o(p);
    r.forEach((O) => {
      O(n.value, v, {
        delta: w,
        type: ze.pop,
        direction: w ? w > 0 ? He.forward : He.back : He.unknown
      });
    });
  };
  function l() {
    i = n.value;
  }
  function u(f) {
    r.push(f);
    const p = () => {
      const v = r.indexOf(f);
      v > -1 && r.splice(v, 1);
    };
    return s.push(p), p;
  }
  function c() {
    const { history: f } = window;
    f.state && f.replaceState(R({}, f.state, { scroll: ft() }), "");
  }
  function d() {
    for (const f of s)
      f();
    s = [], window.removeEventListener("popstate", a), window.removeEventListener("beforeunload", c);
  }
  return window.addEventListener("popstate", a), window.addEventListener("beforeunload", c, {
    passive: !0
  }), {
    pauseListeners: l,
    listen: u,
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
function Ys(e) {
  const { history: t, location: n } = window, o = {
    value: Ao(e, n)
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
  function s(l, u, c) {
    const d = e.indexOf("#"), f = d > -1 ? (n.host && document.querySelector("base") ? e : e.slice(d)) + l : Ks() + e + l;
    try {
      t[c ? "replaceState" : "pushState"](u, "", f), r.value = u;
    } catch (p) {
      process.env.NODE_ENV !== "production" ? $("Error with push/replace State", p) : console.error(p), n[c ? "replace" : "assign"](f);
    }
  }
  function i(l, u) {
    const c = R({}, t.state, Cn(
      r.value.back,
      // keep back and forward entries but override current position
      l,
      r.value.forward,
      !0
    ), u, { position: r.value.position });
    s(l, c, !0), o.value = l;
  }
  function a(l, u) {
    const c = R(
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
    process.env.NODE_ENV !== "production" && !t.state && $(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:

history.replaceState(history.state, '', url)

You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`), s(c.current, c, !0);
    const d = R({}, Cn(o.value, l, null), { position: c.position + 1 }, u);
    s(l, d, !1), o.value = l;
  }
  return {
    location: o,
    state: r,
    push: a,
    replace: i
  };
}
function Xs(e) {
  e = Hs(e);
  const t = Ys(e), n = Js(e, t.state, t.location, t.replace);
  function o(s, i = !0) {
    i || n.pauseListeners(), history.go(s);
  }
  const r = R({
    // it's overridden right after
    location: "",
    base: e,
    go: o,
    createHref: Fs.bind(null, e)
  }, t, n);
  return Object.defineProperty(r, "location", {
    enumerable: !0,
    get: () => t.location.value
  }), Object.defineProperty(r, "state", {
    enumerable: !0,
    get: () => t.state.value
  }), r;
}
function Zs(e) {
  return typeof e == "string" || e && typeof e == "object";
}
function To(e) {
  return typeof e == "string" || typeof e == "symbol";
}
const pe = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
}, Rt = Symbol(process.env.NODE_ENV !== "production" ? "navigation failure" : "");
var xn;
(function(e) {
  e[e.aborted = 4] = "aborted", e[e.cancelled = 8] = "cancelled", e[e.duplicated = 16] = "duplicated";
})(xn || (xn = {}));
const ea = {
  1({ location: e, currentLocation: t }) {
    return `No match for
 ${JSON.stringify(e)}${t ? `
while being at
` + JSON.stringify(t) : ""}`;
  },
  2({ from: e, to: t }) {
    return `Redirected from "${e.fullPath}" to "${na(t)}" via a navigation guard.`;
  },
  4({ from: e, to: t }) {
    return `Navigation aborted from "${e.fullPath}" to "${t.fullPath}" via a navigation guard.`;
  },
  8({ from: e, to: t }) {
    return `Navigation cancelled from "${e.fullPath}" to "${t.fullPath}" with a new navigation.`;
  },
  16({ from: e, to: t }) {
    return `Avoided redundant navigation to current location: "${e.fullPath}".`;
  }
};
function Te(e, t) {
  return process.env.NODE_ENV !== "production" ? R(new Error(ea[e](t)), {
    type: e,
    [Rt]: !0
  }, t) : R(new Error(), {
    type: e,
    [Rt]: !0
  }, t);
}
function se(e, t) {
  return e instanceof Error && Rt in e && (t == null || !!(e.type & t));
}
const ta = ["params", "query", "hash"];
function na(e) {
  if (typeof e == "string")
    return e;
  if ("path" in e)
    return e.path;
  const t = {};
  for (const n of ta)
    n in e && (t[n] = e[n]);
  return JSON.stringify(t, null, 2);
}
const $n = "[^/]+?", oa = {
  sensitive: !1,
  strict: !1,
  start: !0,
  end: !0
}, ra = /[.+*?^${}()[\]/\\]/g;
function sa(e, t) {
  const n = R({}, oa, t), o = [];
  let r = n.start ? "^" : "";
  const s = [];
  for (const u of e) {
    const c = u.length ? [] : [
      90
      /* PathScore.Root */
    ];
    n.strict && !u.length && (r += "/");
    for (let d = 0; d < u.length; d++) {
      const f = u[d];
      let p = 40 + (n.sensitive ? 0.25 : 0);
      if (f.type === 0)
        d || (r += "/"), r += f.value.replace(ra, "\\$&"), p += 40;
      else if (f.type === 1) {
        const { value: v, repeatable: m, optional: w, regexp: O } = f;
        s.push({
          name: v,
          repeatable: m,
          optional: w
        });
        const I = O || $n;
        if (I !== $n) {
          p += 10;
          try {
            new RegExp(`(${I})`);
          } catch (W) {
            throw new Error(`Invalid custom RegExp for param "${v}" (${I}): ` + W.message);
          }
        }
        let M = m ? `((?:${I})(?:/(?:${I}))*)` : `(${I})`;
        d || (M = // avoid an optional / if there are more segments e.g. /:p?-static
        // or /:p?-:p2
        w && u.length < 2 ? `(?:/${M})` : "/" + M), w && (M += "?"), r += M, p += 20, w && (p += -8), m && (p += -20), I === ".*" && (p += -50);
      }
      c.push(p);
    }
    o.push(c);
  }
  if (n.strict && n.end) {
    const u = o.length - 1;
    o[u][o[u].length - 1] += 0.7000000000000001;
  }
  n.strict || (r += "/?"), n.end ? r += "$" : n.strict && (r += "(?:/|$)");
  const i = new RegExp(r, n.sensitive ? "" : "i");
  function a(u) {
    const c = u.match(i), d = {};
    if (!c)
      return null;
    for (let f = 1; f < c.length; f++) {
      const p = c[f] || "", v = s[f - 1];
      d[v.name] = p && v.repeatable ? p.split("/") : p;
    }
    return d;
  }
  function l(u) {
    let c = "", d = !1;
    for (const f of e) {
      (!d || !c.endsWith("/")) && (c += "/"), d = !1;
      for (const p of f)
        if (p.type === 0)
          c += p.value;
        else if (p.type === 1) {
          const { value: v, repeatable: m, optional: w } = p, O = v in u ? u[v] : "";
          if (K(O) && !m)
            throw new Error(`Provided param "${v}" is an array but it is not repeatable (* or + modifiers)`);
          const I = K(O) ? O.join("/") : O;
          if (!I)
            if (w)
              f.length < 2 && (c.endsWith("/") ? c = c.slice(0, -1) : d = !0);
            else
              throw new Error(`Missing required param "${v}"`);
          c += I;
        }
    }
    return c || "/";
  }
  return {
    re: i,
    score: o,
    keys: s,
    parse: a,
    stringify: l
  };
}
function aa(e, t) {
  let n = 0;
  for (; n < e.length && n < t.length; ) {
    const o = t[n] - e[n];
    if (o)
      return o;
    n++;
  }
  return e.length < t.length ? e.length === 1 && e[0] === 80 ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === 80 ? 1 : -1 : 0;
}
function ia(e, t) {
  let n = 0;
  const o = e.score, r = t.score;
  for (; n < o.length && n < r.length; ) {
    const s = aa(o[n], r[n]);
    if (s)
      return s;
    n++;
  }
  if (Math.abs(r.length - o.length) === 1) {
    if (Nn(o))
      return 1;
    if (Nn(r))
      return -1;
  }
  return r.length - o.length;
}
function Nn(e) {
  const t = e[e.length - 1];
  return e.length > 0 && t[t.length - 1] < 0;
}
const ca = {
  type: 0,
  value: ""
}, la = /[a-zA-Z0-9_]/;
function ua(e) {
  if (!e)
    return [[]];
  if (e === "/")
    return [[ca]];
  if (!e.startsWith("/"))
    throw new Error(process.env.NODE_ENV !== "production" ? `Route paths should start with a "/": "${e}" should be "/${e}".` : `Invalid path "${e}"`);
  function t(p) {
    throw new Error(`ERR (${n})/"${u}": ${p}`);
  }
  let n = 0, o = n;
  const r = [];
  let s;
  function i() {
    s && r.push(s), s = [];
  }
  let a = 0, l, u = "", c = "";
  function d() {
    u && (n === 0 ? s.push({
      type: 0,
      value: u
    }) : n === 1 || n === 2 || n === 3 ? (s.length > 1 && (l === "*" || l === "+") && t(`A repeatable param (${u}) must be alone in its segment. eg: '/:ids+.`), s.push({
      type: 1,
      value: u,
      regexp: c,
      repeatable: l === "*" || l === "+",
      optional: l === "*" || l === "?"
    })) : t("Invalid state to consume buffer"), u = "");
  }
  function f() {
    u += l;
  }
  for (; a < e.length; ) {
    if (l = e[a++], l === "\\" && n !== 2) {
      o = n, n = 4;
      continue;
    }
    switch (n) {
      case 0:
        l === "/" ? (u && d(), i()) : l === ":" ? (d(), n = 1) : f();
        break;
      case 4:
        f(), n = o;
        break;
      case 1:
        l === "(" ? n = 2 : la.test(l) ? f() : (d(), n = 0, l !== "*" && l !== "?" && l !== "+" && a--);
        break;
      case 2:
        l === ")" ? c[c.length - 1] == "\\" ? c = c.slice(0, -1) + l : n = 3 : c += l;
        break;
      case 3:
        d(), n = 0, l !== "*" && l !== "?" && l !== "+" && a--, c = "";
        break;
      default:
        t("Unknown state");
        break;
    }
  }
  return n === 2 && t(`Unfinished custom RegExp for param "${u}"`), d(), i(), r;
}
function da(e, t, n) {
  const o = sa(ua(e.path), n);
  if (process.env.NODE_ENV !== "production") {
    const s = /* @__PURE__ */ new Set();
    for (const i of o.keys)
      s.has(i.name) && $(`Found duplicated params with name "${i.name}" for path "${e.path}". Only the last one will be available on "$route.params".`), s.add(i.name);
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
function fa(e, t) {
  const n = [], o = /* @__PURE__ */ new Map();
  t = Tn({ strict: !1, end: !0, sensitive: !1 }, t);
  function r(c) {
    return o.get(c);
  }
  function s(c, d, f) {
    const p = !f, v = pa(c);
    process.env.NODE_ENV !== "production" && ga(v, d), v.aliasOf = f && f.record;
    const m = Tn(t, c), w = [
      v
    ];
    if ("alias" in c) {
      const M = typeof c.alias == "string" ? [c.alias] : c.alias;
      for (const W of M)
        w.push(R({}, v, {
          // this allows us to hold a copy of the `components` option
          // so that async components cache is hold on the original record
          components: f ? f.record.components : v.components,
          path: W,
          // we might be the child of an alias
          aliasOf: f ? f.record : v
          // the aliases are always of the same kind as the original since they
          // are defined on the same record
        }));
    }
    let O, I;
    for (const M of w) {
      const { path: W } = M;
      if (d && W[0] !== "/") {
        const J = d.record.path, Y = J[J.length - 1] === "/" ? "" : "/";
        M.path = d.record.path + (W && Y + W);
      }
      if (process.env.NODE_ENV !== "production" && M.path === "*")
        throw new Error(`Catch all routes ("*") must now be defined using a param with a custom regexp.
See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.`);
      if (O = da(M, d, m), process.env.NODE_ENV !== "production" && d && W[0] === "/" && ya(O, d), f ? (f.alias.push(O), process.env.NODE_ENV !== "production" && va(f, O)) : (I = I || O, I !== O && I.alias.push(O), p && c.name && !An(O) && i(c.name)), v.children) {
        const J = v.children;
        for (let Y = 0; Y < J.length; Y++)
          s(J[Y], O, f && f.children[Y]);
      }
      f = f || O, (O.record.components && Object.keys(O.record.components).length || O.record.name || O.record.redirect) && l(O);
    }
    return I ? () => {
      i(I);
    } : Ue;
  }
  function i(c) {
    if (To(c)) {
      const d = o.get(c);
      d && (o.delete(c), n.splice(n.indexOf(d), 1), d.children.forEach(i), d.alias.forEach(i));
    } else {
      const d = n.indexOf(c);
      d > -1 && (n.splice(d, 1), c.record.name && o.delete(c.record.name), c.children.forEach(i), c.alias.forEach(i));
    }
  }
  function a() {
    return n;
  }
  function l(c) {
    let d = 0;
    for (; d < n.length && ia(c, n[d]) >= 0 && // Adding children with empty path should still appear before the parent
    // https://github.com/vuejs/router/issues/1124
    (c.record.path !== n[d].record.path || !Do(c, n[d])); )
      d++;
    n.splice(d, 0, c), c.record.name && !An(c) && o.set(c.record.name, c);
  }
  function u(c, d) {
    let f, p = {}, v, m;
    if ("name" in c && c.name) {
      if (f = o.get(c.name), !f)
        throw Te(1, {
          location: c
        });
      if (process.env.NODE_ENV !== "production") {
        const I = Object.keys(c.params || {}).filter((M) => !f.keys.find((W) => W.name === M));
        I.length && $(`Discarded invalid param(s) "${I.join('", "')}" when navigating. See https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22 for more details.`);
      }
      m = f.record.name, p = R(
        // paramsFromLocation is a new object
        Rn(
          d.params,
          // only keep params that exist in the resolved location
          // TODO: only keep optional params coming from a parent record
          f.keys.filter((I) => !I.optional).map((I) => I.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        c.params && Rn(c.params, f.keys.map((I) => I.name))
      ), v = f.stringify(p);
    } else if ("path" in c)
      v = c.path, process.env.NODE_ENV !== "production" && !v.startsWith("/") && $(`The Matcher cannot resolve relative paths but received "${v}". Unless you directly called \`matcher.resolve("${v}")\`, this is probably a bug in vue-router. Please open an issue at https://github.com/vuejs/router/issues/new/choose.`), f = n.find((I) => I.re.test(v)), f && (p = f.parse(v), m = f.record.name);
    else {
      if (f = d.name ? o.get(d.name) : n.find((I) => I.re.test(d.path)), !f)
        throw Te(1, {
          location: c,
          currentLocation: d
        });
      m = f.record.name, p = R({}, d.params, c.params), v = f.stringify(p);
    }
    const w = [];
    let O = f;
    for (; O; )
      w.unshift(O.record), O = O.parent;
    return {
      name: m,
      path: v,
      params: p,
      matched: w,
      meta: ma(w)
    };
  }
  return e.forEach((c) => s(c)), { addRoute: s, resolve: u, removeRoute: i, getRoutes: a, getRecordMatcher: r };
}
function Rn(e, t) {
  const n = {};
  for (const o of t)
    o in e && (n[o] = e[o]);
  return n;
}
function pa(e) {
  return {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: void 0,
    beforeEnter: e.beforeEnter,
    props: ha(e),
    children: e.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in e ? e.components || null : e.component && { default: e.component }
  };
}
function ha(e) {
  const t = {}, n = e.props || !1;
  if ("component" in e)
    t.default = n;
  else
    for (const o in e.components)
      t[o] = typeof n == "object" ? n[o] : n;
  return t;
}
function An(e) {
  for (; e; ) {
    if (e.record.aliasOf)
      return !0;
    e = e.parent;
  }
  return !1;
}
function ma(e) {
  return e.reduce((t, n) => R(t, n.meta), {});
}
function Tn(e, t) {
  const n = {};
  for (const o in e)
    n[o] = o in t ? t[o] : e[o];
  return n;
}
function At(e, t) {
  return e.name === t.name && e.optional === t.optional && e.repeatable === t.repeatable;
}
function va(e, t) {
  for (const n of e.keys)
    if (!n.optional && !t.keys.find(At.bind(null, n)))
      return $(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
  for (const n of t.keys)
    if (!n.optional && !e.keys.find(At.bind(null, n)))
      return $(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
}
function ga(e, t) {
  t && t.record.name && !e.name && !e.path && $(`The route named "${String(t.record.name)}" has a child without a name and an empty path. Using that name won't render the empty path child so you probably want to move the name to the child instead. If this is intentional, add a name to the child route to remove the warning.`);
}
function ya(e, t) {
  for (const n of t.keys)
    if (!e.keys.find(At.bind(null, n)))
      return $(`Absolute path "${e.record.path}" must have the exact same param named "${n.name}" as its parent "${t.record.path}".`);
}
function Do(e, t) {
  return t.children.some((n) => n === e || Do(e, n));
}
const Vo = /#/g, wa = /&/g, ba = /\//g, _a = /=/g, Ea = /\?/g, Mo = /\+/g, ka = /%5B/g, Sa = /%5D/g, Lo = /%5E/g, Oa = /%60/g, jo = /%7B/g, Ia = /%7C/g, Bo = /%7D/g, Pa = /%20/g;
function Kt(e) {
  return encodeURI("" + e).replace(Ia, "|").replace(ka, "[").replace(Sa, "]");
}
function Ca(e) {
  return Kt(e).replace(jo, "{").replace(Bo, "}").replace(Lo, "^");
}
function Tt(e) {
  return Kt(e).replace(Mo, "%2B").replace(Pa, "+").replace(Vo, "%23").replace(wa, "%26").replace(Oa, "`").replace(jo, "{").replace(Bo, "}").replace(Lo, "^");
}
function xa(e) {
  return Tt(e).replace(_a, "%3D");
}
function $a(e) {
  return Kt(e).replace(Vo, "%23").replace(Ea, "%3F");
}
function Na(e) {
  return e == null ? "" : $a(e).replace(ba, "%2F");
}
function Qe(e) {
  try {
    return decodeURIComponent("" + e);
  } catch {
    process.env.NODE_ENV !== "production" && $(`Error decoding "${e}". Using original value`);
  }
  return "" + e;
}
function Ra(e) {
  const t = {};
  if (e === "" || e === "?")
    return t;
  const o = (e[0] === "?" ? e.slice(1) : e).split("&");
  for (let r = 0; r < o.length; ++r) {
    const s = o[r].replace(Mo, " "), i = s.indexOf("="), a = Qe(i < 0 ? s : s.slice(0, i)), l = i < 0 ? null : Qe(s.slice(i + 1));
    if (a in t) {
      let u = t[a];
      K(u) || (u = t[a] = [u]), u.push(l);
    } else
      t[a] = l;
  }
  return t;
}
function Dn(e) {
  let t = "";
  for (let n in e) {
    const o = e[n];
    if (n = xa(n), o == null) {
      o !== void 0 && (t += (t.length ? "&" : "") + n);
      continue;
    }
    (K(o) ? o.map((s) => s && Tt(s)) : [o && Tt(o)]).forEach((s) => {
      s !== void 0 && (t += (t.length ? "&" : "") + n, s != null && (t += "=" + s));
    });
  }
  return t;
}
function Aa(e) {
  const t = {};
  for (const n in e) {
    const o = e[n];
    o !== void 0 && (t[n] = K(o) ? o.map((r) => r == null ? null : "" + r) : o == null ? o : "" + o);
  }
  return t;
}
const Ta = Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : ""), Vn = Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : ""), Jt = Symbol(process.env.NODE_ENV !== "production" ? "router" : ""), Uo = Symbol(process.env.NODE_ENV !== "production" ? "route location" : ""), Dt = Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
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
    list: () => e.slice(),
    reset: n
  };
}
function he(e, t, n, o, r) {
  const s = o && // name is defined if record is because of the function overload
  (o.enterCallbacks[r] = o.enterCallbacks[r] || []);
  return () => new Promise((i, a) => {
    const l = (d) => {
      d === !1 ? a(Te(4, {
        from: n,
        to: t
      })) : d instanceof Error ? a(d) : Zs(d) ? a(Te(2, {
        from: t,
        to: d
      })) : (s && // since enterCallbackArray is truthy, both record and name also are
      o.enterCallbacks[r] === s && typeof d == "function" && s.push(d), i());
    }, u = e.call(o && o.instances[r], t, n, process.env.NODE_ENV !== "production" ? Da(l, t, n) : l);
    let c = Promise.resolve(u);
    if (e.length < 3 && (c = c.then(l)), process.env.NODE_ENV !== "production" && e.length > 2) {
      const d = `The "next" callback was never called inside of ${e.name ? '"' + e.name + '"' : ""}:
${e.toString()}
. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;
      if (typeof u == "object" && "then" in u)
        c = c.then((f) => l._called ? f : ($(d), Promise.reject(new Error("Invalid navigation guard"))));
      else if (u !== void 0 && !l._called) {
        $(d), a(new Error("Invalid navigation guard"));
        return;
      }
    }
    c.catch((d) => a(d));
  });
}
function Da(e, t, n) {
  let o = 0;
  return function() {
    o++ === 1 && $(`The "next" callback was called more than once in one navigation guard when going from "${n.fullPath}" to "${t.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`), e._called = !0, o === 1 && e.apply(null, arguments);
  };
}
function Et(e, t, n, o) {
  const r = [];
  for (const s of e) {
    process.env.NODE_ENV !== "production" && !s.components && !s.children.length && $(`Record with path "${s.path}" is either missing a "component(s)" or "children" property.`);
    for (const i in s.components) {
      let a = s.components[i];
      if (process.env.NODE_ENV !== "production") {
        if (!a || typeof a != "object" && typeof a != "function")
          throw $(`Component "${i}" in record with path "${s.path}" is not a valid component. Received "${String(a)}".`), new Error("Invalid route component");
        if ("then" in a) {
          $(`Component "${i}" in record with path "${s.path}" is a Promise instead of a function that returns a Promise. Did you write "import('./MyPage.vue')" instead of "() => import('./MyPage.vue')" ? This will break in production if not fixed.`);
          const l = a;
          a = () => l;
        } else
          a.__asyncLoader && // warn only once per component
          !a.__warnedDefineAsync && (a.__warnedDefineAsync = !0, $(`Component "${i}" in record with path "${s.path}" is defined using "defineAsyncComponent()". Write "() => import('./MyPage.vue')" instead of "defineAsyncComponent(() => import('./MyPage.vue'))".`));
      }
      if (!(t !== "beforeRouteEnter" && !s.instances[i]))
        if (Va(a)) {
          const u = (a.__vccOpts || a)[t];
          u && r.push(he(u, n, o, s, i));
        } else {
          let l = a();
          process.env.NODE_ENV !== "production" && !("catch" in l) && ($(`Component "${i}" in record with path "${s.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`), l = Promise.resolve(l)), r.push(() => l.then((u) => {
            if (!u)
              return Promise.reject(new Error(`Couldn't resolve component "${i}" at "${s.path}"`));
            const c = Vs(u) ? u.default : u;
            s.components[i] = c;
            const f = (c.__vccOpts || c)[t];
            return f && he(f, n, o, s, i)();
          }));
        }
    }
  }
  return r;
}
function Va(e) {
  return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function Mn(e) {
  const t = Z(Jt), n = Z(Uo), o = B(() => t.resolve(k(e.to))), r = B(() => {
    const { matched: l } = o.value, { length: u } = l, c = l[u - 1], d = n.matched;
    if (!c || !d.length)
      return -1;
    const f = d.findIndex(ge.bind(null, c));
    if (f > -1)
      return f;
    const p = Ln(l[u - 2]);
    return (
      // we are dealing with nested routes
      u > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      Ln(c) === p && // avoid comparing the child with its parent
      d[d.length - 1].path !== p ? d.findIndex(ge.bind(null, l[u - 2])) : f
    );
  }), s = B(() => r.value > -1 && Ba(n.params, o.value.params)), i = B(() => r.value > -1 && r.value === n.matched.length - 1 && Ro(n.params, o.value.params));
  function a(l = {}) {
    return ja(l) ? t[k(e.replace) ? "replace" : "push"](
      k(e.to)
      // avoid uncaught errors are they are logged anyway
    ).catch(Ue) : Promise.resolve();
  }
  if (process.env.NODE_ENV !== "production" && ae) {
    const l = Ht();
    if (l) {
      const u = {
        route: o.value,
        isActive: s.value,
        isExactActive: i.value
      };
      l.__vrl_devtools = l.__vrl_devtools || [], l.__vrl_devtools.push(u), kr(() => {
        u.route = o.value, u.isActive = s.value, u.isExactActive = i.value;
      }, { flush: "post" });
    }
  }
  return {
    route: o,
    href: B(() => o.value.href),
    isActive: s,
    isExactActive: i,
    navigate: a
  };
}
const Ma = /* @__PURE__ */ q({
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
  useLink: Mn,
  setup(e, { slots: t }) {
    const n = _e(Mn(e)), { options: o } = Z(Jt), r = B(() => ({
      [jn(e.activeClass, o.linkActiveClass, "router-link-active")]: n.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [jn(e.exactActiveClass, o.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
    }));
    return () => {
      const s = t.default && t.default(n);
      return e.custom ? s : mo("a", {
        "aria-current": n.isExactActive ? e.ariaCurrentValue : null,
        href: n.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: n.navigate,
        class: r.value
      }, s);
    };
  }
}), La = Ma;
function ja(e) {
  if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(t))
        return;
    }
    return e.preventDefault && e.preventDefault(), !0;
  }
}
function Ba(e, t) {
  for (const n in t) {
    const o = t[n], r = e[n];
    if (typeof o == "string") {
      if (o !== r)
        return !1;
    } else if (!K(r) || r.length !== o.length || o.some((s, i) => s !== r[i]))
      return !1;
  }
  return !0;
}
function Ln(e) {
  return e ? e.aliasOf ? e.aliasOf.path : e.path : "";
}
const jn = (e, t, n) => e ?? t ?? n, Ua = /* @__PURE__ */ q({
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
    process.env.NODE_ENV !== "production" && Wa();
    const o = Z(Dt), r = B(() => e.route || o.value), s = Z(Vn, 0), i = B(() => {
      let u = k(s);
      const { matched: c } = r.value;
      let d;
      for (; (d = c[u]) && !d.components; )
        u++;
      return u;
    }), a = B(() => r.value.matched[i.value]);
    nt(Vn, B(() => i.value + 1)), nt(Ta, a), nt(Dt, r);
    const l = V();
    return ue(() => [l.value, a.value, e.name], ([u, c, d], [f, p, v]) => {
      c && (c.instances[d] = u, p && p !== c && u && u === f && (c.leaveGuards.size || (c.leaveGuards = p.leaveGuards), c.updateGuards.size || (c.updateGuards = p.updateGuards))), u && c && // if there is no instance but to and from are the same this might be
      // the first visit
      (!p || !ge(c, p) || !f) && (c.enterCallbacks[d] || []).forEach((m) => m(u));
    }, { flush: "post" }), () => {
      const u = r.value, c = e.name, d = a.value, f = d && d.components[c];
      if (!f)
        return Bn(n.default, { Component: f, route: u });
      const p = d.props[c], v = p ? p === !0 ? u.params : typeof p == "function" ? p(u) : p : null, w = mo(f, R({}, v, t, {
        onVnodeUnmounted: (O) => {
          O.component.isUnmounted && (d.instances[c] = null);
        },
        ref: l
      }));
      if (process.env.NODE_ENV !== "production" && ae && w.ref) {
        const O = {
          depth: i.value,
          name: d.name,
          path: d.path,
          meta: d.meta
        };
        (K(w.ref) ? w.ref.map((M) => M.i) : [w.ref.i]).forEach((M) => {
          M.__vrv_devtools = O;
        });
      }
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        Bn(n.default, { Component: w, route: u }) || w
      );
    };
  }
});
function Bn(e, t) {
  if (!e)
    return null;
  const n = e(t);
  return n.length === 1 ? n[0] : n;
}
const Ha = Ua;
function Wa() {
  const e = Ht(), t = e.parent && e.parent.type.name, n = e.parent && e.parent.subTree && e.parent.subTree.type;
  if (t && (t === "KeepAlive" || t.includes("Transition")) && typeof n == "object" && n.name === "RouterView") {
    const o = t === "KeepAlive" ? "keep-alive" : "transition";
    $(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.
Use slot props instead:

<router-view v-slot="{ Component }">
  <${o}>
    <component :is="Component" />
  </${o}>
</router-view>`);
  }
}
function Me(e, t) {
  const n = R({}, e, {
    // remove variables that can contain vue instances
    matched: e.matched.map((o) => Xa(o, ["instances", "children", "aliasOf"]))
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
let Fa = 0;
function Ga(e, t, n) {
  if (t.__hasDevtools)
    return;
  t.__hasDevtools = !0;
  const o = Fa++;
  zt({
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
          backgroundColor: Ho
        });
      }
      K(d.__vrl_devtools) && (d.__devtoolsApi = r, d.__vrl_devtools.forEach((f) => {
        let p = Go, v = "";
        f.isExactActive ? (p = Fo, v = "This is exactly active") : f.isActive && (p = Wo, v = "This link is active"), c.tags.push({
          label: f.route.path,
          textColor: 0,
          tooltip: v,
          backgroundColor: p
        });
      }));
    }), ue(t.currentRoute, () => {
      l(), r.notifyComponentUpdate(), r.sendInspectorTree(a), r.sendInspectorState(a);
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
    let i = 0;
    t.beforeEach((c, d) => {
      const f = {
        guard: Ze("beforeEach"),
        from: Me(d, "Current Location during this navigation"),
        to: Me(c, "Target location")
      };
      Object.defineProperty(c.meta, "__navigationId", {
        value: i++
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
      }, p.status = Ze("❌")) : p.status = Ze("✅"), p.from = Me(d, "Current Location during this navigation"), p.to = Me(c, "Target location"), r.addTimelineEvent({
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
    const a = "router-inspector:" + o;
    r.addInspector({
      id: a,
      label: "Routes" + (o ? " " + o : ""),
      icon: "book",
      treeFilterPlaceholder: "Search routes"
    });
    function l() {
      if (!u)
        return;
      const c = u;
      let d = n.getRoutes().filter((f) => !f.parent || // these routes have a parent with no component which will not appear in the view
      // therefore we still need to include them
      !f.parent.record.components);
      d.forEach(qo), c.filter && (d = d.filter((f) => (
        // save matches state based on the payload
        Vt(f, c.filter.toLowerCase())
      ))), d.forEach((f) => Qo(f, t.currentRoute.value)), c.rootNodes = d.map(zo);
    }
    let u;
    r.on.getInspectorTree((c) => {
      u = c, c.app === e && c.inspectorId === a && l();
    }), r.on.getInspectorState((c) => {
      if (c.app === e && c.inspectorId === a) {
        const f = n.getRoutes().find((p) => p.record.__vd_id === c.nodeId);
        f && (c.state = {
          options: Qa(f)
        });
      }
    }), r.sendInspectorTree(a), r.sendInspectorState(a);
  });
}
function za(e) {
  return e.optional ? e.repeatable ? "*" : "?" : e.repeatable ? "+" : "";
}
function Qa(e) {
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
        display: e.keys.map((o) => `${o.name}${za(o)}`).join(" "),
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
const Ho = 15485081, Wo = 2450411, Fo = 8702998, qa = 2282478, Go = 16486972, Ka = 6710886;
function zo(e) {
  const t = [], { record: n } = e;
  n.name != null && t.push({
    label: String(n.name),
    textColor: 0,
    backgroundColor: qa
  }), n.aliasOf && t.push({
    label: "alias",
    textColor: 0,
    backgroundColor: Go
  }), e.__vd_match && t.push({
    label: "matches",
    textColor: 0,
    backgroundColor: Ho
  }), e.__vd_exactActive && t.push({
    label: "exact",
    textColor: 0,
    backgroundColor: Fo
  }), e.__vd_active && t.push({
    label: "active",
    textColor: 0,
    backgroundColor: Wo
  }), n.redirect && t.push({
    label: typeof n.redirect == "string" ? `redirect: ${n.redirect}` : "redirects",
    textColor: 16777215,
    backgroundColor: Ka
  });
  let o = n.__vd_id;
  return o == null && (o = String(Ja++), n.__vd_id = o), {
    id: o,
    label: n.path,
    tags: t,
    children: e.children.map(zo)
  };
}
let Ja = 0;
const Ya = /^\/(.*)\/([a-z]*)$/;
function Qo(e, t) {
  const n = t.matched.length && ge(t.matched[t.matched.length - 1], e.record);
  e.__vd_exactActive = e.__vd_active = n, n || (e.__vd_active = t.matched.some((o) => ge(o, e.record))), e.children.forEach((o) => Qo(o, t));
}
function qo(e) {
  e.__vd_match = !1, e.children.forEach(qo);
}
function Vt(e, t) {
  const n = String(e.re).match(Ya);
  if (e.__vd_match = !1, !n || n.length < 3)
    return !1;
  if (new RegExp(n[1].replace(/\$$/, ""), n[2]).test(t))
    return e.children.forEach((i) => Vt(i, t)), e.record.path !== "/" || t === "/" ? (e.__vd_match = e.re.test(t), !0) : !1;
  const r = e.record.path.toLowerCase(), s = Qe(r);
  return !t.startsWith("/") && (s.includes(t) || r.includes(t)) || s.startsWith(t) || r.startsWith(t) || e.record.name && String(e.record.name).includes(t) ? !0 : e.children.some((i) => Vt(i, t));
}
function Xa(e, t) {
  const n = {};
  for (const o in e)
    t.includes(o) || (n[o] = e[o]);
  return n;
}
function Za(e) {
  const t = fa(e.routes, e), n = e.parseQuery || Ra, o = e.stringifyQuery || Dn, r = e.history;
  if (process.env.NODE_ENV !== "production" && !r)
    throw new Error('Provide the "history" option when calling "createRouter()": https://next.router.vuejs.org/api/#history.');
  const s = Ve(), i = Ve(), a = Ve(), l = br(pe);
  let u = pe;
  ae && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
  const c = bt.bind(null, (h) => "" + h), d = bt.bind(null, Na), f = (
    // @ts-expect-error: intentionally avoid the type check
    bt.bind(null, Qe)
  );
  function p(h, y) {
    let g, _;
    return To(h) ? (g = t.getRecordMatcher(h), _ = y) : _ = h, t.addRoute(_, g);
  }
  function v(h) {
    const y = t.getRecordMatcher(h);
    y ? t.removeRoute(y) : process.env.NODE_ENV !== "production" && $(`Cannot remove non-existent route "${String(h)}"`);
  }
  function m() {
    return t.getRoutes().map((h) => h.record);
  }
  function w(h) {
    return !!t.getRecordMatcher(h);
  }
  function O(h, y) {
    if (y = R({}, y || l.value), typeof h == "string") {
      const P = _t(n, h, y.path), L = t.resolve({ path: P.path }, y), we = r.createHref(P.fullPath);
      return process.env.NODE_ENV !== "production" && (we.startsWith("//") ? $(`Location "${h}" resolved to "${we}". A resolved location cannot start with multiple slashes.`) : L.matched.length || $(`No match found for location with path "${h}"`)), R(P, L, {
        params: f(L.params),
        hash: Qe(P.hash),
        redirectedFrom: void 0,
        href: we
      });
    }
    let g;
    if ("path" in h)
      process.env.NODE_ENV !== "production" && "params" in h && !("name" in h) && // @ts-expect-error: the type is never
      Object.keys(h.params).length && $(`Path "${h.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`), g = R({}, h, {
        path: _t(n, h.path, y.path).path
      });
    else {
      const P = R({}, h.params);
      for (const L in P)
        P[L] == null && delete P[L];
      g = R({}, h, {
        params: d(P)
      }), y.params = d(y.params);
    }
    const _ = t.resolve(g, y), N = h.hash || "";
    process.env.NODE_ENV !== "production" && N && !N.startsWith("#") && $(`A \`hash\` should always start with the character "#". Replace "${N}" with "#${N}".`), _.params = c(f(_.params));
    const j = js(o, R({}, h, {
      hash: Ca(N),
      path: _.path
    })), x = r.createHref(j);
    return process.env.NODE_ENV !== "production" && (x.startsWith("//") ? $(`Location "${h}" resolved to "${x}". A resolved location cannot start with multiple slashes.`) : _.matched.length || $(`No match found for location with path "${"path" in h ? h.path : h}"`)), R({
      fullPath: j,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash: N,
      query: (
        // if the user is using a custom query lib like qs, we might have
        // nested objects, so we keep the query as is, meaning it can contain
        // numbers at `$route.query`, but at the point, the user will have to
        // use their own type anyway.
        // https://github.com/vuejs/router/issues/328#issuecomment-649481567
        o === Dn ? Aa(h.query) : h.query || {}
      )
    }, _, {
      redirectedFrom: void 0,
      href: x
    });
  }
  function I(h) {
    return typeof h == "string" ? _t(n, h, l.value.path) : R({}, h);
  }
  function M(h, y) {
    if (u !== h)
      return Te(8, {
        from: y,
        to: h
      });
  }
  function W(h) {
    return S(h);
  }
  function J(h) {
    return W(R(I(h), { replace: !0 }));
  }
  function Y(h) {
    const y = h.matched[h.matched.length - 1];
    if (y && y.redirect) {
      const { redirect: g } = y;
      let _ = typeof g == "function" ? g(h) : g;
      if (typeof _ == "string" && (_ = _.includes("?") || _.includes("#") ? _ = I(_) : (
        // force empty params
        { path: _ }
      ), _.params = {}), process.env.NODE_ENV !== "production" && !("path" in _) && !("name" in _))
        throw $(`Invalid redirect found:
${JSON.stringify(_, null, 2)}
 when navigating to "${h.fullPath}". A redirect must contain a name or path. This will break in production.`), new Error("Invalid redirect");
      return R({
        query: h.query,
        hash: h.hash,
        // avoid transferring params if the redirect has a path
        params: "path" in _ ? {} : h.params
      }, _);
    }
  }
  function S(h, y) {
    const g = u = O(h), _ = l.value, N = h.state, j = h.force, x = h.replace === !0, P = Y(g);
    if (P)
      return S(
        R(I(P), {
          state: typeof P == "object" ? R({}, N, P.state) : N,
          force: j,
          replace: x
        }),
        // keep original redirectedFrom if it exists
        y || g
      );
    const L = g;
    L.redirectedFrom = y;
    let we;
    return !j && On(o, _, g) && (we = Te(16, { to: L, from: _ }), un(
      _,
      _,
      // this is a push, the only way for it to be triggered from a
      // history.listen is with a redirect, which makes it become a push
      !0,
      // This cannot be the first navigation because the initial location
      // cannot be manually navigated to
      !1
    )), (we ? Promise.resolve(we) : E(L, _)).catch((Q) => se(Q) ? (
      // navigation redirects still mark the router as ready
      se(
        Q,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? Q : mt(Q)
    ) : (
      // reject any unknown error
      G(Q, L, _)
    )).then((Q) => {
      if (Q) {
        if (se(
          Q,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        ))
          return process.env.NODE_ENV !== "production" && // we are redirecting to the same location we were already at
          On(o, O(Q.to), L) && // and we have done it a couple of times
          y && // @ts-expect-error: added only in dev
          (y._count = y._count ? (
            // @ts-expect-error
            y._count + 1
          ) : 1) > 30 ? ($(`Detected a possibly infinite redirection in a navigation guard when going from "${_.fullPath}" to "${L.fullPath}". Aborting to avoid a Stack Overflow.
 Are you always returning a new location within a navigation guard? That would lead to this error. Only return when redirecting or aborting, that should fix this. This might break in production if not fixed.`), Promise.reject(new Error("Infinite redirect in navigation guard"))) : S(
            // keep options
            R({
              // preserve an existing replacement but allow the redirect to override it
              replace: x
            }, I(Q.to), {
              state: typeof Q.to == "object" ? R({}, N, Q.to.state) : N,
              force: j
            }),
            // preserve the original redirectedFrom if any
            y || L
          );
      } else
        Q = D(L, _, !0, x, N);
      return b(L, _, Q), Q;
    });
  }
  function ln(h, y) {
    const g = M(h, y);
    return g ? Promise.reject(g) : Promise.resolve();
  }
  function ee(h) {
    const y = Je.values().next().value;
    return y && typeof y.runWithContext == "function" ? y.runWithContext(h) : h();
  }
  function E(h, y) {
    let g;
    const [_, N, j] = ei(h, y);
    g = Et(_.reverse(), "beforeRouteLeave", h, y);
    for (const P of _)
      P.leaveGuards.forEach((L) => {
        g.push(he(L, h, y));
      });
    const x = ln.bind(null, h, y);
    return g.push(x), xe(g).then(() => {
      g = [];
      for (const P of s.list())
        g.push(he(P, h, y));
      return g.push(x), xe(g);
    }).then(() => {
      g = Et(N, "beforeRouteUpdate", h, y);
      for (const P of N)
        P.updateGuards.forEach((L) => {
          g.push(he(L, h, y));
        });
      return g.push(x), xe(g);
    }).then(() => {
      g = [];
      for (const P of j)
        if (P.beforeEnter)
          if (K(P.beforeEnter))
            for (const L of P.beforeEnter)
              g.push(he(L, h, y));
          else
            g.push(he(P.beforeEnter, h, y));
      return g.push(x), xe(g);
    }).then(() => (h.matched.forEach((P) => P.enterCallbacks = {}), g = Et(j, "beforeRouteEnter", h, y), g.push(x), xe(g))).then(() => {
      g = [];
      for (const P of i.list())
        g.push(he(P, h, y));
      return g.push(x), xe(g);
    }).catch((P) => se(
      P,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? P : Promise.reject(P));
  }
  function b(h, y, g) {
    a.list().forEach((_) => ee(() => _(h, y, g)));
  }
  function D(h, y, g, _, N) {
    const j = M(h, y);
    if (j)
      return j;
    const x = y === pe, P = ae ? history.state : {};
    g && (_ || x ? r.replace(h.fullPath, R({
      scroll: x && P && P.scroll
    }, N)) : r.push(h.fullPath, N)), l.value = h, un(h, y, g, x), mt();
  }
  let U;
  function ye() {
    U || (U = r.listen((h, y, g) => {
      const _ = O(h), N = Y(_);
      if (N) {
        S(R(N, { replace: !0 }), _).catch(Ue);
        return;
      }
      u = _;
      const j = l.value;
      ae && Qs(Pn(j.fullPath, g.delta), ft()), E(_, j).catch((x) => se(
        x,
        12
        /* ErrorTypes.NAVIGATION_CANCELLED */
      ) ? x : se(
        x,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? (S(
        x.to,
        _
        // avoid an uncaught rejection, let push call triggerError
      ).then((P) => {
        se(
          P,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && !g.delta && g.type === ze.pop && r.go(-1, !1);
      }).catch(Ue), Promise.reject()) : (g.delta && r.go(-g.delta, !1), G(x, _, j))).then((x) => {
        x = x || D(
          // after navigation, all matched components are resolved
          _,
          j,
          !1
        ), x && (g.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
        // entry while a different route is displayed
        !se(
          x,
          8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        ) ? r.go(-g.delta, !1) : g.type === ze.pop && se(
          x,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && r.go(-1, !1)), b(_, j, x);
      }).catch(Ue);
    }));
  }
  let De = Ve(), Ke = Ve(), ne;
  function G(h, y, g) {
    mt(h);
    const _ = Ke.list();
    return _.length ? _.forEach((N) => N(h, y, g)) : (process.env.NODE_ENV !== "production" && $("uncaught error during route navigation:"), console.error(h)), Promise.reject(h);
  }
  function gr() {
    return ne && l.value !== pe ? Promise.resolve() : new Promise((h, y) => {
      De.add([h, y]);
    });
  }
  function mt(h) {
    return ne || (ne = !h, ye(), De.list().forEach(([y, g]) => h ? g(h) : y()), De.reset()), h;
  }
  function un(h, y, g, _) {
    const { scrollBehavior: N } = e;
    if (!ae || !N)
      return Promise.resolve();
    const j = !g && qs(Pn(h.fullPath, 0)) || (_ || !g) && history.state && history.state.scroll || null;
    return Fe().then(() => N(h, y, j)).then((x) => x && zs(x)).catch((x) => G(x, h, y));
  }
  const vt = (h) => r.go(h);
  let gt;
  const Je = /* @__PURE__ */ new Set(), yr = {
    currentRoute: l,
    listening: !0,
    addRoute: p,
    removeRoute: v,
    hasRoute: w,
    getRoutes: m,
    resolve: O,
    options: e,
    push: W,
    replace: J,
    go: vt,
    back: () => vt(-1),
    forward: () => vt(1),
    beforeEach: s.add,
    beforeResolve: i.add,
    afterEach: a.add,
    onError: Ke.add,
    isReady: gr,
    install(h) {
      const y = this;
      h.component("RouterLink", La), h.component("RouterView", Ha), h.config.globalProperties.$router = y, Object.defineProperty(h.config.globalProperties, "$route", {
        enumerable: !0,
        get: () => k(l)
      }), ae && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !gt && l.value === pe && (gt = !0, W(r.location).catch((N) => {
        process.env.NODE_ENV !== "production" && $("Unexpected error when starting the router:", N);
      }));
      const g = {};
      for (const N in pe)
        Object.defineProperty(g, N, {
          get: () => l.value[N],
          enumerable: !0
        });
      h.provide(Jt, y), h.provide(Uo, Er(g)), h.provide(Dt, l);
      const _ = h.unmount;
      Je.add(h), h.unmount = function() {
        Je.delete(h), Je.size < 1 && (u = pe, U && U(), U = null, l.value = pe, gt = !1, ne = !1), _();
      }, process.env.NODE_ENV !== "production" && ae && Ga(h, y, t);
    }
  };
  function xe(h) {
    return h.reduce((y, g) => y.then(() => ee(g)), Promise.resolve());
  }
  return yr;
}
function ei(e, t) {
  const n = [], o = [], r = [], s = Math.max(t.matched.length, e.matched.length);
  for (let i = 0; i < s; i++) {
    const a = t.matched[i];
    a && (e.matched.find((u) => ge(u, a)) ? o.push(a) : n.push(a));
    const l = e.matched[i];
    l && (t.matched.find((u) => ge(u, l)) || r.push(l));
  }
  return [n, o, r];
}
Za({
  history: Xs(),
  routes: []
});
function ti(e) {
  return e && typeof e.then == "function";
}
Promise.resolve(!1);
Promise.resolve(!0);
var Oe = Promise.resolve();
function Ko(e, t) {
  return e || (e = 0), new Promise(function(n) {
    return setTimeout(function() {
      return n(t);
    }, e);
  });
}
function ni(e, t) {
  return Math.floor(Math.random() * (t - e + 1) + e);
}
function Yt() {
  return Math.random().toString(36).substring(2);
}
var Un = 0, kt = 0;
function pt() {
  var e = (/* @__PURE__ */ new Date()).getTime();
  return e === Un ? (kt++, e * 1e3 + kt) : (Un = e, kt = 0, e * 1e3);
}
var oi = pt, ri = "native";
function si(e) {
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
function ai(e) {
  e.bc.close(), e.subFns = [];
}
function ii(e, t) {
  try {
    return e.bc.postMessage(t, !1), Oe;
  } catch (n) {
    return Promise.reject(n);
  }
}
function ci(e, t) {
  e.messagesCallback = t;
}
function li() {
  if (typeof window > "u")
    return !1;
  if (typeof BroadcastChannel == "function") {
    if (BroadcastChannel._pubkey)
      throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
    return !0;
  } else
    return !1;
}
function ui() {
  return 150;
}
var di = {
  create: si,
  close: ai,
  onMessage: ci,
  postMessage: ii,
  canBeUsed: li,
  type: ri,
  averageResponseTime: ui,
  microSeconds: oi
}, Jo = (
  /** @class */
  function() {
    function e(t) {
      this.ttl = t, this.map = /* @__PURE__ */ new Map(), this._to = !1;
    }
    return e.prototype.has = function(t) {
      return this.map.has(t);
    }, e.prototype.add = function(t) {
      var n = this;
      this.map.set(t, Yo()), this._to || (this._to = !0, setTimeout(function() {
        n._to = !1, fi(n);
      }, 0));
    }, e.prototype.clear = function() {
      this.map.clear();
    }, e;
  }()
);
function fi(e) {
  for (var t = Yo() - e.ttl, n = e.map[Symbol.iterator](); ; ) {
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
function Yo() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function Xt() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = JSON.parse(JSON.stringify(e));
  return typeof t.webWorkerSupport > "u" && (t.webWorkerSupport = !0), t.idb || (t.idb = {}), t.idb.ttl || (t.idb.ttl = 1e3 * 45), t.idb.fallbackInterval || (t.idb.fallbackInterval = 150), e.idb && typeof e.idb.onclose == "function" && (t.idb.onclose = e.idb.onclose), t.localstorage || (t.localstorage = {}), t.localstorage.removeTimeout || (t.localstorage.removeTimeout = 1e3 * 60), e.methods && (t.methods = e.methods), t.node || (t.node = {}), t.node.ttl || (t.node.ttl = 1e3 * 60 * 2), t.node.maxParallelWrites || (t.node.maxParallelWrites = 2048), typeof t.node.useFastPath > "u" && (t.node.useFastPath = !0), t;
}
var pi = pt, hi = "pubkey.broadcast-channel-0-", le = "messages", ht = {
  durability: "relaxed"
}, mi = "idb";
function Xo() {
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
function Zt(e) {
  e.commit && e.commit();
}
function vi(e) {
  var t = Xo(), n = hi + e, o = t.open(n);
  return o.onupgradeneeded = function(r) {
    var s = r.target.result;
    s.createObjectStore(le, {
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
function gi(e, t, n) {
  var o = (/* @__PURE__ */ new Date()).getTime(), r = {
    uuid: t,
    time: o,
    data: n
  }, s = e.transaction([le], "readwrite", ht);
  return new Promise(function(i, a) {
    s.oncomplete = function() {
      return i();
    }, s.onerror = function(u) {
      return a(u);
    };
    var l = s.objectStore(le);
    l.add(r), Zt(s);
  });
}
function yi(e, t) {
  var n = e.transaction(le, "readonly", ht), o = n.objectStore(le), r = [], s = IDBKeyRange.bound(t + 1, 1 / 0);
  if (o.getAll) {
    var i = o.getAll(s);
    return new Promise(function(l, u) {
      i.onerror = function(c) {
        return u(c);
      }, i.onsuccess = function(c) {
        l(c.target.result);
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
  return new Promise(function(l, u) {
    var c = a();
    c.onerror = function(d) {
      return u(d);
    }, c.onsuccess = function(d) {
      var f = d.target.result;
      f ? f.value.id < t + 1 ? f.continue(t + 1) : (r.push(f.value), f.continue()) : (Zt(n), l(r));
    };
  });
}
function wi(e, t) {
  if (e.closed)
    return Promise.resolve([]);
  var n = e.db.transaction(le, "readwrite", ht), o = n.objectStore(le);
  return Promise.all(t.map(function(r) {
    var s = o.delete(r);
    return new Promise(function(i) {
      s.onsuccess = function() {
        return i();
      };
    });
  }));
}
function bi(e, t) {
  var n = (/* @__PURE__ */ new Date()).getTime() - t, o = e.transaction(le, "readonly", ht), r = o.objectStore(le), s = [];
  return new Promise(function(i) {
    r.openCursor().onsuccess = function(a) {
      var l = a.target.result;
      if (l) {
        var u = l.value;
        u.time < n ? (s.push(u), l.continue()) : (Zt(o), i(s));
      } else
        i(s);
    };
  });
}
function _i(e) {
  return bi(e.db, e.options.idb.ttl).then(function(t) {
    return wi(e, t.map(function(n) {
      return n.id;
    }));
  });
}
function Ei(e, t) {
  return t = Xt(t), vi(e).then(function(n) {
    var o = {
      closed: !1,
      lastCursorId: 0,
      channelName: e,
      options: t,
      uuid: Yt(),
      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new Jo(t.idb.ttl * 2),
      // ensures we do not read messages in parallel
      writeBlockPromise: Oe,
      messagesCallback: null,
      readQueuePromises: [],
      db: n
    };
    return n.onclose = function() {
      o.closed = !0, t.idb.onclose && t.idb.onclose();
    }, Zo(o), o;
  });
}
function Zo(e) {
  e.closed || er(e).then(function() {
    return Ko(e.options.idb.fallbackInterval);
  }).then(function() {
    return Zo(e);
  });
}
function ki(e, t) {
  return !(e.uuid === t.uuid || t.eMIs.has(e.id) || e.data.time < t.messagesCallbackTime);
}
function er(e) {
  return e.closed || !e.messagesCallback ? Oe : yi(e.db, e.lastCursorId).then(function(t) {
    var n = t.filter(function(o) {
      return !!o;
    }).map(function(o) {
      return o.id > e.lastCursorId && (e.lastCursorId = o.id), o;
    }).filter(function(o) {
      return ki(o, e);
    }).sort(function(o, r) {
      return o.time - r.time;
    });
    return n.forEach(function(o) {
      e.messagesCallback && (e.eMIs.add(o.id), e.messagesCallback(o.data));
    }), Oe;
  });
}
function Si(e) {
  e.closed = !0, e.db.close();
}
function Oi(e, t) {
  return e.writeBlockPromise = e.writeBlockPromise.then(function() {
    return gi(e.db, e.uuid, t);
  }).then(function() {
    ni(0, 10) === 0 && _i(e);
  }), e.writeBlockPromise;
}
function Ii(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t, er(e);
}
function Pi() {
  return !!Xo();
}
function Ci(e) {
  return e.idb.fallbackInterval * 2;
}
var xi = {
  create: Ei,
  close: Si,
  onMessage: Ii,
  postMessage: Oi,
  canBeUsed: Pi,
  type: mi,
  averageResponseTime: Ci,
  microSeconds: pi
}, $i = pt, Ni = "pubkey.broadcastChannel-", Ri = "localstorage";
function tr() {
  var e;
  if (typeof window > "u")
    return null;
  try {
    e = window.localStorage, e = window["ie8-eventlistener/storage"] || window.localStorage;
  } catch {
  }
  return e;
}
function nr(e) {
  return Ni + e;
}
function Ai(e, t) {
  return new Promise(function(n) {
    Ko().then(function() {
      var o = nr(e.channelName), r = {
        token: Yt(),
        time: (/* @__PURE__ */ new Date()).getTime(),
        data: t,
        uuid: e.uuid
      }, s = JSON.stringify(r);
      tr().setItem(o, s);
      var i = document.createEvent("Event");
      i.initEvent("storage", !0, !0), i.key = o, i.newValue = s, window.dispatchEvent(i), n();
    });
  });
}
function Ti(e, t) {
  var n = nr(e), o = function(s) {
    s.key === n && t(JSON.parse(s.newValue));
  };
  return window.addEventListener("storage", o), o;
}
function Di(e) {
  window.removeEventListener("storage", e);
}
function Vi(e, t) {
  if (t = Xt(t), !or())
    throw new Error("BroadcastChannel: localstorage cannot be used");
  var n = Yt(), o = new Jo(t.localstorage.removeTimeout), r = {
    channelName: e,
    uuid: n,
    eMIs: o
    // emittedMessagesIds
  };
  return r.listener = Ti(e, function(s) {
    r.messagesCallback && s.uuid !== n && (!s.token || o.has(s.token) || s.data.time && s.data.time < r.messagesCallbackTime || (o.add(s.token), r.messagesCallback(s.data)));
  }), r;
}
function Mi(e) {
  Di(e.listener);
}
function Li(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t;
}
function or() {
  var e = tr();
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
function ji() {
  var e = 120, t = navigator.userAgent.toLowerCase();
  return t.includes("safari") && !t.includes("chrome") ? e * 2 : e;
}
var Bi = {
  create: Vi,
  close: Mi,
  onMessage: Li,
  postMessage: Ai,
  canBeUsed: or,
  type: Ri,
  averageResponseTime: ji,
  microSeconds: $i
}, Ui = pt, Hi = "simulate", en = /* @__PURE__ */ new Set();
function Wi(e) {
  var t = {
    name: e,
    messagesCallback: null
  };
  return en.add(t), t;
}
function Fi(e) {
  en.delete(e);
}
function Gi(e, t) {
  return new Promise(function(n) {
    return setTimeout(function() {
      var o = Array.from(en);
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
function zi(e, t) {
  e.messagesCallback = t;
}
function Qi() {
  return !0;
}
function qi() {
  return 5;
}
var Ki = {
  create: Wi,
  close: Fi,
  onMessage: zi,
  postMessage: Gi,
  canBeUsed: Qi,
  type: Hi,
  averageResponseTime: qi,
  microSeconds: Ui
}, Hn = [
  di,
  // fastest
  xi,
  Bi
];
function Ji(e) {
  var t = [].concat(e.methods, Hn).filter(Boolean);
  if (e.type) {
    if (e.type === "simulate")
      return Ki;
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
  throw new Error("No usable method found in " + JSON.stringify(Hn.map(function(r) {
    return r.type;
  })));
}
var rr = /* @__PURE__ */ new Set(), Yi = 0, tn = function(t, n) {
  this.id = Yi++, rr.add(this), this.name = t, this.options = Xt(n), this.method = Ji(this.options), this._iL = !1, this._onML = null, this._addEL = {
    message: [],
    internal: []
  }, this._uMP = /* @__PURE__ */ new Set(), this._befC = [], this._prepP = null, Xi(this);
};
tn._pubkey = !0;
tn.prototype = {
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
    Gn(this, "message", this._onML), e && typeof e == "function" ? (this._onML = n, Fn(this, "message", n)) : this._onML = null;
  },
  addEventListener: function(t, n) {
    var o = this.method.microSeconds(), r = {
      time: o,
      fn: n
    };
    Fn(this, t, r);
  },
  removeEventListener: function(t, n) {
    var o = this._addEL[t].find(function(r) {
      return r.fn === n;
    });
    Gn(this, t, o);
  },
  close: function() {
    var t = this;
    if (!this.closed) {
      rr.delete(this), this.closed = !0;
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
function Xi(e) {
  var t = e.method.create(e.name, e.options);
  ti(t) ? (e._prepP = t, t.then(function(n) {
    e._state = n;
  })) : e._state = t;
}
function sr(e) {
  return e._addEL.message.length > 0 || e._addEL.internal.length > 0;
}
function Fn(e, t, n) {
  e._addEL[t].push(n), Zi(e);
}
function Gn(e, t, n) {
  e._addEL[t] = e._addEL[t].filter(function(o) {
    return o !== n;
  }), ec(e);
}
function Zi(e) {
  if (!e._iL && sr(e)) {
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
function ec(e) {
  if (e._iL && !sr(e)) {
    e._iL = !1;
    var t = e.method.microSeconds();
    e.method.onMessage(e._state, null, t);
  }
}
class St extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   */
  constructor(t, n) {
    super(t), this.name = "DevalueError", this.path = n.join("");
  }
}
function zn(e) {
  return Object(e) !== e;
}
const tc = /* @__PURE__ */ Object.getOwnPropertyNames(
  Object.prototype
).sort().join("\0");
function nc(e) {
  const t = Object.getPrototypeOf(e);
  return t === Object.prototype || t === null || Object.getOwnPropertyNames(t).sort().join("\0") === tc;
}
function oc(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function rc(e) {
  switch (e) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return e < " " ? `\\u${e.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function Ae(e) {
  let t = "", n = 0;
  const o = e.length;
  for (let r = 0; r < o; r += 1) {
    const s = e[r], i = rc(s);
    i && (t += e.slice(n, r) + i, n = r + 1);
  }
  return `"${n === 0 ? e : t + e.slice(n)}"`;
}
const nn = -1, ar = -2, ir = -3, cr = -4, lr = -5, on = -6;
function Qn(e, t) {
  return sc(JSON.parse(e), t);
}
function sc(e, t) {
  if (typeof e == "number")
    return r(e, !0);
  if (!Array.isArray(e) || e.length === 0)
    throw new Error("Invalid input");
  const n = (
    /** @type {any[]} */
    e
  ), o = Array(n.length);
  function r(s, i = !1) {
    if (s === nn)
      return;
    if (s === ir)
      return NaN;
    if (s === cr)
      return 1 / 0;
    if (s === lr)
      return -1 / 0;
    if (s === on)
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
        const l = a[0], u = t == null ? void 0 : t[l];
        if (u)
          return o[s] = u(r(a[1]));
        switch (l) {
          case "Date":
            o[s] = new Date(a[1]);
            break;
          case "Set":
            const c = /* @__PURE__ */ new Set();
            o[s] = c;
            for (let p = 1; p < a.length; p += 1)
              c.add(r(a[p]));
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
        for (let u = 0; u < a.length; u += 1) {
          const c = a[u];
          c !== ar && (l[u] = r(c));
        }
      }
    else {
      const l = {};
      o[s] = l;
      for (const u in a) {
        const c = a[u];
        l[u] = r(c);
      }
    }
    return o[s];
  }
  return r(0);
}
function qn(e, t) {
  const n = [], o = /* @__PURE__ */ new Map(), r = [];
  for (const u in t)
    r.push({ key: u, fn: t[u] });
  const s = [];
  let i = 0;
  function a(u) {
    if (typeof u == "function")
      throw new St("Cannot stringify a function", s);
    if (o.has(u))
      return o.get(u);
    if (u === void 0)
      return nn;
    if (Number.isNaN(u))
      return ir;
    if (u === 1 / 0)
      return cr;
    if (u === -1 / 0)
      return lr;
    if (u === 0 && 1 / u < 0)
      return on;
    const c = i++;
    o.set(u, c);
    for (const { key: f, fn: p } of r) {
      const v = p(u);
      if (v)
        return n[c] = `["${f}",${a(v)}]`, c;
    }
    let d = "";
    if (zn(u))
      d = Ot(u);
    else
      switch (oc(u)) {
        case "Number":
        case "String":
        case "Boolean":
          d = `["Object",${Ot(u)}]`;
          break;
        case "BigInt":
          d = `["BigInt",${u}]`;
          break;
        case "Date":
          d = `["Date","${u.toISOString()}"]`;
          break;
        case "RegExp":
          const { source: p, flags: v } = u;
          d = v ? `["RegExp",${Ae(p)},"${v}"]` : `["RegExp",${Ae(p)}]`;
          break;
        case "Array":
          d = "[";
          for (let m = 0; m < u.length; m += 1)
            m > 0 && (d += ","), m in u ? (s.push(`[${m}]`), d += a(u[m]), s.pop()) : d += ar;
          d += "]";
          break;
        case "Set":
          d = '["Set"';
          for (const m of u)
            d += `,${a(m)}`;
          d += "]";
          break;
        case "Map":
          d = '["Map"';
          for (const [m, w] of u)
            s.push(
              `.get(${zn(m) ? Ot(m) : "..."})`
            ), d += `,${a(m)},${a(w)}`;
          d += "]";
          break;
        default:
          if (!nc(u))
            throw new St(
              "Cannot stringify arbitrary non-POJOs",
              s
            );
          if (Object.getOwnPropertySymbols(u).length > 0)
            throw new St(
              "Cannot stringify POJOs with symbolic keys",
              s
            );
          if (Object.getPrototypeOf(u) === null) {
            d = '["null"';
            for (const m in u)
              s.push(`.${m}`), d += `,${Ae(m)},${a(u[m])}`, s.pop();
            d += "]";
          } else {
            d = "{";
            let m = !1;
            for (const w in u)
              m && (d += ","), m = !0, s.push(`.${w}`), d += `${Ae(w)}:${a(u[w])}`, s.pop();
            d += "}";
          }
      }
    return n[c] = d, c;
  }
  const l = a(e);
  return l < 0 ? `${l}` : `[${n.join(",")}]`;
}
function Ot(e) {
  const t = typeof e;
  return t === "string" ? Ae(e) : e instanceof String ? Ae(e.toString()) : e === void 0 ? nn.toString() : e === 0 && 1 / e < 0 ? on.toString() : t === "bigint" ? `["BigInt","${e}"]` : String(e);
}
function ac(e, t, { initialize: n, type: o }) {
  let r = `${t.$id}-${e.toString()}`, s = new tn(r, { type: o }), i = !1, a = 0;
  ue(() => t[e], (c) => {
    i || (a = Date.now(), s.postMessage({ timestamp: a, state: Qn(qn(c)) })), i = !1;
  }, { deep: !0 }), s.onmessage = (c) => {
    if (c === void 0) {
      s.postMessage({ timestamp: a, state: Qn(qn(t[e])) });
      return;
    }
    c.timestamp <= a || (i = !0, a = c.timestamp, t[e] = c.state);
  };
  let l = () => s.postMessage(void 0), u = () => s.close();
  return n && l(), { sync: l, unshare: u };
}
var ic = (e, t) => Object.keys(t).includes(e), cc = ({ initialize: e = !0, enable: t = !0, type: n }) => ({ store: o, options: r }) => {
  var s, i;
  let a = ((s = r == null ? void 0 : r.share) == null ? void 0 : s.enable) ?? t, l = ((i = r == null ? void 0 : r.share) == null ? void 0 : i.omit) ?? [];
  !a || Object.keys(o.$state).forEach((u) => {
    var c;
    l.includes(u) || !ic(u, o.$state) || ac(u, o, { initialize: ((c = r == null ? void 0 : r.share) == null ? void 0 : c.initialize) ?? e, type: n });
  });
};
const lc = $s();
lc.use(
  cc({
    enable: !0,
    initialize: !0
  })
);
const uc = /* @__PURE__ */ q({
  __name: "Doctype",
  setup(e) {
    const { stonecrop: t, isReady: n } = No(), o = V([]);
    return ue(n, () => {
      if (n.value) {
        let r = t.value.schema.schema.toArray();
        r.forEach((s, i) => {
          const l = t.value.store.record[s.fieldname];
          r[i].value = l;
        }), o.value = r;
      }
    }), (r, s) => k(n) ? (C(), Se(k(es), {
      key: 0,
      class: "aform-main",
      modelValue: o.value,
      "onUpdate:modelValue": s[0] || (s[0] = (i) => o.value = i)
    }, null, 8, ["modelValue"])) : ke("", !0);
  }
});
var Kn;
const ur = typeof window < "u", dc = (e) => typeof e == "string", fc = () => {
};
ur && (Kn = window == null ? void 0 : window.navigator) != null && Kn.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function dr(e) {
  return typeof e == "function" ? e() : k(e);
}
function pc(e) {
  return e;
}
function hc(e) {
  return po() ? (ho(e), !0) : !1;
}
function Mt(e) {
  var t;
  const n = dr(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const fr = ur ? window : void 0;
function mc(...e) {
  let t, n, o, r;
  if (dc(e[0]) || Array.isArray(e[0]) ? ([n, o, r] = e, t = fr) : [t, n, o, r] = e, !t)
    return fc;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const s = [], i = () => {
    s.forEach((c) => c()), s.length = 0;
  }, a = (c, d, f, p) => (c.addEventListener(d, f, p), () => c.removeEventListener(d, f, p)), l = ue(() => [Mt(t), dr(r)], ([c, d]) => {
    i(), c && s.push(...n.flatMap((f) => o.map((p) => a(c, f, p, d))));
  }, { immediate: !0, flush: "post" }), u = () => {
    l(), i();
  };
  return hc(u), u;
}
const Jn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Yn = "__vueuse_ssr_handlers__";
Jn[Yn] = Jn[Yn] || {};
function vc(e, { window: t = fr, scrollTarget: n } = {}) {
  const o = V(!1), r = () => {
    if (!t)
      return;
    const s = t.document, i = Mt(e);
    if (!i)
      o.value = !1;
    else {
      const a = i.getBoundingClientRect();
      o.value = a.top <= (t.innerHeight || s.documentElement.clientHeight) && a.left <= (t.innerWidth || s.documentElement.clientWidth) && a.bottom >= 0 && a.right >= 0;
    }
  };
  return ue(() => Mt(e), () => r(), { immediate: !0, flush: "post" }), t && mc(n || t, "scroll", r, {
    capture: !1,
    passive: !0
  }), o;
}
var Xn;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(Xn || (Xn = {}));
var gc = Object.defineProperty, Zn = Object.getOwnPropertySymbols, yc = Object.prototype.hasOwnProperty, wc = Object.prototype.propertyIsEnumerable, eo = (e, t, n) => t in e ? gc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, bc = (e, t) => {
  for (var n in t || (t = {}))
    yc.call(t, n) && eo(e, n, t[n]);
  if (Zn)
    for (var n of Zn(t))
      wc.call(t, n) && eo(e, n, t[n]);
  return e;
};
const _c = {
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
bc({
  linear: pc
}, _c);
const de = (e) => {
  let t = vc(e).value;
  return t = t && e.offsetHeight > 0, t;
}, fe = (e) => e.tabIndex >= 0, to = (e) => {
  const t = e.target;
  return rn(t);
}, rn = (e) => {
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
  return n && (!fe(n) || !de(n)) ? rn(n) : n;
}, Ec = (e) => {
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
  return o && (!fe(o) || !de(o)) ? sn(o) : o;
}, no = (e) => {
  const t = e.target;
  return sn(t);
}, sn = (e) => {
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
  return n && (!fe(n) || !de(n)) ? sn(n) : n;
}, kc = (e) => {
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
  return o && (!fe(o) || !de(o)) ? rn(o) : o;
}, oo = (e) => {
  const t = e.target;
  return an(t);
}, an = (e) => {
  var t;
  let n;
  if (e.previousElementSibling)
    n = e.previousElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.previousElementSibling;
    n = o == null ? void 0 : o.lastElementChild;
  }
  return n && (!fe(n) || !de(n)) ? an(n) : n;
}, ro = (e) => {
  const t = e.target;
  return cn(t);
}, cn = (e) => {
  var t;
  let n;
  if (e.nextElementSibling)
    n = e.nextElementSibling;
  else {
    const o = (t = e.parentElement) == null ? void 0 : t.nextElementSibling;
    n = o == null ? void 0 : o.firstElementChild;
  }
  return n && (!fe(n) || !de(n)) ? cn(n) : n;
}, so = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!fe(t) || !de(t)) ? cn(t) : t;
}, ao = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!fe(t) || !de(t)) ? an(t) : t;
}, et = ["alt", "control", "shift", "meta"], Sc = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, pr = {
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
    const t = Ec(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = kc(e);
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
function hr(e) {
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
      s = Array.from(r.children).filter((i) => fe(i) && de(i));
    return s;
  }, n = (o) => (r) => {
    const s = Sc[r.key] || r.key.toLowerCase();
    if (et.includes(s))
      return;
    const i = o.handlers || pr;
    for (const a of Object.keys(i)) {
      const [l, ...u] = a.split(".");
      if (l === "keydown" && u.includes(s)) {
        const c = i[a], d = u.filter((p) => et.includes(p)), f = et.some((p) => {
          const v = p.charAt(0).toUpperCase() + p.slice(1);
          return r.getModifierState(v);
        });
        if (d.length > 0) {
          if (f) {
            for (const p of et)
              if (u.includes(p)) {
                const v = p.charAt(0).toUpperCase() + p.slice(1);
                r.getModifierState(v) && c(r);
              }
          }
        } else
          f || c(r);
      }
    }
  };
  Lt(() => {
    for (const o of e) {
      const r = t(o);
      for (const s of r)
        s.addEventListener("keydown", n(o));
    }
  }), Sr(() => {
    for (const o of e) {
      const r = t(o);
      for (const s of r)
        s.removeEventListener("keydown", n(o));
    }
  });
}
const Oc = ["data-colindex", "data-rowindex", "data-editable", "contenteditable", "tabindex"], Ic = { key: 1 }, Pc = /* @__PURE__ */ q({
  __name: "ACell",
  props: {
    colIndex: {},
    rowIndex: {},
    tableid: {},
    addNavigation: { type: [Boolean, Object], default: !0 },
    tabIndex: { default: 0 },
    clickHandler: {}
  },
  setup(e) {
    var t;
    const n = e, o = Z(n.tableid), r = V(null);
    let s = V(!1);
    const i = B(() => {
      const m = o.cellData(n.colIndex, n.rowIndex);
      if (o.columns[n.colIndex].format) {
        const w = o.columns[n.colIndex].format;
        return typeof w == "function" ? w(m) : typeof w == "string" ? Function(`"use strict";return (${w})`)()(m) : m;
      } else
        return m;
    }), a = (m) => {
      if (n.clickHandler) {
        n.clickHandler(m);
        return;
      }
      if (o.columns[n.colIndex].mask, o.columns[n.colIndex].modalComponent) {
        const w = r.value.getBoundingClientRect();
        o.modal.visible = !0, o.modal.colIndex = n.colIndex, o.modal.rowIndex = n.rowIndex, o.modal.parent = r.value, o.modal.top = w.top + w.height, o.modal.left = w.left, o.modal.width = u.value, o.modal.component = o.columns[n.colIndex].modalComponent, o.modal.componentProps = o.columns[n.colIndex].modalComponentProps;
      }
    };
    if (n.addNavigation) {
      let m = {
        ...pr,
        "keydown.f2": a,
        "keydown.alt.up": a,
        "keydown.alt.down": a,
        "keydown.alt.left": a,
        "keydown.alt.right": a
      };
      typeof n.addNavigation == "object" && (m = {
        ...m,
        ...n.addNavigation
      }), hr([
        {
          selectors: r,
          handlers: m
        }
      ]);
    }
    const l = B(() => o.columns[n.colIndex].align || "center"), u = B(() => o.columns[n.colIndex].width || "40ch");
    let c = "";
    const d = () => {
      r.value && (c = r.value.innerText);
    }, f = () => {
      r.value && r.value.innerHTML !== c && (c = r.value.innerText, r.value.dispatchEvent(new Event("change")), s.value = !0, o.columns[n.colIndex].format || o.setCellData(n.rowIndex, n.colIndex, c));
    }, p = (m, w) => w && m === 0 && w > 0 ? `${w}ch` : "inherit", v = {
      textAlign: l.value,
      width: u.value,
      backgroundColor: s.value ? "var(--cell-modified-color)" : "inherit",
      fontWeight: s.value ? "bold" : "inherit",
      paddingLeft: p(n.colIndex, (t = o.display[n.rowIndex]) == null ? void 0 : t.indent)
    };
    return (m, w) => (C(), A("td", {
      ref_key: "cell",
      ref: r,
      "data-colindex": m.colIndex,
      "data-rowindex": m.rowIndex,
      "data-editable": k(o).columns[m.colIndex].edit,
      contenteditable: k(o).columns[m.colIndex].edit,
      tabindex: m.tabIndex,
      spellcheck: !1,
      style: v,
      onFocus: d,
      onPaste: f,
      onBlur: f,
      onInput: f,
      onClick: a,
      onMousedown: a
    }, [
      k(o).columns[m.colIndex].cellComponent ? (C(), Se(Bt(k(o).columns[m.colIndex].cellComponent), Ut({
        key: 0,
        value: i.value
      }, k(o).columns[m.colIndex].cellComponentProps), null, 16, ["value"])) : (C(), A("span", Ic, ce(i.value), 1))
    ], 40, Oc));
  }
}), qe = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, Cc = /* @__PURE__ */ qe(Pc, [["__scopeId", "data-v-07dfe445"]]), xc = ["tabindex"], $c = {
  key: 0,
  tabIndex: -1,
  class: "list-index"
}, Nc = /* @__PURE__ */ q({
  __name: "ARow",
  props: {
    row: {},
    rowIndex: {},
    tableid: {},
    tabIndex: { default: -1 },
    addNavigation: {}
  },
  setup(e) {
    vo((l) => ({
      "5b18ee03": k(r)
    }));
    const t = e, n = Z(t.tableid), o = V(null), r = n.numberedRowWidth.value, s = () => n.config.view !== "tree" ? "" : n.display[t.rowIndex].isRoot || n.display[t.rowIndex].isParent ? n.display[t.rowIndex].childrenOpen ? "-" : "+" : "", i = () => n.config.view !== "tree" || n.display[t.rowIndex].isRoot || n.display[t.rowIndex].open, a = (l) => {
      n.toggleRowExpand(l);
    };
    return t.addNavigation && hr([
      {
        selectors: o,
        handlers: t.addNavigation
      }
    ]), (l, u) => lt((C(), A("tr", {
      ref_key: "rowEl",
      ref: o,
      tabindex: l.tabIndex,
      class: "table-row"
    }, [
      k(n).config.view === "list" ? (C(), A("td", $c, ce(l.rowIndex + 1), 1)) : k(n).config.view === "tree" ? (C(), A("td", {
        key: 1,
        tabIndex: -1,
        class: "tree-index",
        onClick: u[0] || (u[0] = (c) => a(l.rowIndex))
      }, ce(s()), 1)) : me(l.$slots, "indexCell", { key: 2 }, void 0, !0),
      me(l.$slots, "default", {}, void 0, !0)
    ], 8, xc)), [
      [jt, i()]
    ]);
  }
}), Rc = /* @__PURE__ */ qe(Nc, [["__scopeId", "data-v-4c71a067"]]);
let tt;
const Ac = new Uint8Array(16);
function Tc() {
  if (!tt && (tt = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !tt))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return tt(Ac);
}
const F = [];
for (let e = 0; e < 256; ++e)
  F.push((e + 256).toString(16).slice(1));
function Dc(e, t = 0) {
  return F[e[t + 0]] + F[e[t + 1]] + F[e[t + 2]] + F[e[t + 3]] + "-" + F[e[t + 4]] + F[e[t + 5]] + "-" + F[e[t + 6]] + F[e[t + 7]] + "-" + F[e[t + 8]] + F[e[t + 9]] + "-" + F[e[t + 10]] + F[e[t + 11]] + F[e[t + 12]] + F[e[t + 13]] + F[e[t + 14]] + F[e[t + 15]];
}
const Vc = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), io = {
  randomUUID: Vc
};
function mr(e, t, n) {
  if (io.randomUUID && !t && !e)
    return io.randomUUID();
  e = e || {};
  const o = e.random || (e.rng || Tc)();
  if (o[6] = o[6] & 15 | 64, o[8] = o[8] & 63 | 128, t) {
    n = n || 0;
    for (let r = 0; r < 16; ++r)
      t[n + r] = o[r];
    return t;
  }
  return Dc(o);
}
class Mc {
  constructor(t, n, o, r, s, i) {
    this.id = t || mr(), this.rows = o, this.columns = _e(n), this.config = _e(r), this.table = s || _e(this.createTableObject()), this.display = this.createDisplayObject(i), this.modal = _e({ visible: !1 });
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
    return _e(n);
  }
  get zeroColumn() {
    return ["list", "tree", "list-expansion"].includes(this.config.view);
  }
  get numberedRowWidth() {
    return B(() => String(Math.ceil(this.rows.length / 100) + 1) + "ch");
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
const Lc = { key: 0 }, jc = {
  class: "atable-header-row",
  tabindex: "-1"
}, Bc = {
  key: 0,
  id: "header-index"
}, Uc = /* @__PURE__ */ q({
  __name: "ATableHeader",
  props: {
    columns: {},
    config: {},
    tableid: {}
  },
  setup(e) {
    vo((r) => ({
      "12d06943": k(n)
    }));
    const t = Z(e.tableid), n = t.numberedRowWidth.value, o = (r) => ({
      minWidth: r.width || "40ch",
      textAlign: r.align || "center",
      width: t.config.fullWidth ? "auto" : null
    });
    return (r, s) => r.columns.length ? (C(), A("thead", Lc, [
      T("tr", jc, [
        k(t).zeroColumn ? (C(), A("th", Bc)) : ke("", !0),
        (C(!0), A(Ie, null, Pe(r.columns, (i, a) => (C(), A("th", {
          key: a,
          tabindex: "-1",
          style: ie(o(i))
        }, [
          me(r.$slots, "default", {}, () => [
            go(ce(i.label || String.fromCharCode(a + 97).toUpperCase()), 1)
          ], !0)
        ], 4))), 128))
      ])
    ])) : ke("", !0);
  }
}), Hc = /* @__PURE__ */ qe(Uc, [["__scopeId", "data-v-16e66636"]]), Wc = /* @__PURE__ */ q({
  __name: "ATableModal",
  props: {
    colIndex: {},
    rowIndex: {},
    tableid: {}
  },
  setup(e) {
    Z(e.tableid);
    const t = (n) => {
      n.stopPropagation();
    };
    return (n, o) => (C(), A("div", {
      ref: "amodal",
      class: "amodal",
      tabindex: "-1",
      onClick: t,
      onInput: t
    }, [
      me(n.$slots, "default", {}, void 0, !0)
    ], 544));
  }
}), Fc = /* @__PURE__ */ qe(Wc, [["__scopeId", "data-v-10a48b2a"]]), Gc = /* @__PURE__ */ q({
  __name: "ATable",
  props: {
    id: {},
    modelValue: {},
    columns: {},
    rows: { default: () => [] },
    config: { default: () => new Object() },
    tableid: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = t;
    let r = n.modelValue ? n.modelValue : n.rows, s = new Mc(n.id, n.columns, r, n.config);
    nt(s.id, s), ue(
      () => s.rows,
      (a, l) => {
        o("update:modelValue", a);
      },
      { deep: !0 }
    );
    const i = (a) => {
      var l;
      (l = s.modal.parent) != null && l.contains(a.target) || s.modal.visible && (s.modal.visible = !1);
    };
    return window.addEventListener("click", i), window.addEventListener("keydown", (a) => {
      if (a.key === "Escape" && s.modal.visible) {
        s.modal.visible = !1;
        const l = s.modal.parent;
        l && Fe().then(() => {
          const u = l.dataset.rowindex, c = l.dataset.colindex, d = document.querySelectorAll(`[data-rowindex='${u}'][data-colindex='${c}']`);
          d && d[0].focus();
        });
      }
    }), (a, l) => (C(), A("table", {
      class: "atable",
      style: ie({ width: k(s).config.fullWidth ? "100%" : "auto" })
    }, [
      me(a.$slots, "header", { data: k(s) }, () => [
        at(Hc, {
          columns: k(s).columns,
          config: k(s).config,
          tableid: k(s).id
        }, null, 8, ["columns", "config", "tableid"])
      ], !0),
      T("tbody", null, [
        me(a.$slots, "body", { data: k(s) }, () => [
          (C(!0), A(Ie, null, Pe(k(s).rows, (u, c) => (C(), Se(Rc, {
            key: u.id || k(mr)(),
            row: u,
            rowIndex: c,
            tableid: k(s).id
          }, {
            default: it(() => [
              (C(!0), A(Ie, null, Pe(k(s).columns, (d, f) => (C(), Se(Cc, {
                key: `${f}:${c}`,
                tableid: k(s).id,
                col: d,
                spellcheck: "false",
                rowIndex: c,
                colIndex: f + (k(s).zeroColumn ? 0 : -1),
                component: d.cellComponent,
                style: ie({
                  textAlign: (d == null ? void 0 : d.align) || "center",
                  minWidth: (d == null ? void 0 : d.width) || "40ch",
                  width: k(s).config.fullWidth ? "auto" : null
                })
              }, null, 8, ["tableid", "col", "rowIndex", "colIndex", "component", "style"]))), 128))
            ]),
            _: 2
          }, 1032, ["row", "rowIndex", "tableid"]))), 128))
        ], !0)
      ]),
      me(a.$slots, "footer", { data: k(s) }, void 0, !0),
      me(a.$slots, "modal", { data: k(s) }, () => [
        lt(at(Fc, {
          colIndex: k(s).modal.colIndex,
          rowIndex: k(s).modal.rowIndex,
          tableid: k(s).id,
          style: ie({
            left: k(s).modal.left + "px",
            top: k(s).modal.top + "px",
            maxWidth: k(s).modal.width + "px"
          })
        }, {
          default: it(() => [
            (C(), Se(Bt(k(s).modal.component), Ut({
              key: `${k(s).modal.rowIndex}:${k(s).modal.colIndex}`,
              colIndex: k(s).modal.colIndex,
              rowIndex: k(s).modal.rowIndex,
              tableid: k(s).id
            }, k(s).modal.componentProps), null, 16, ["colIndex", "rowIndex", "tableid"]))
          ]),
          _: 1
        }, 8, ["colIndex", "rowIndex", "tableid", "style"]), [
          [jt, k(s).modal.visible]
        ])
      ], !0)
    ], 4));
  }
}), zc = /* @__PURE__ */ qe(Gc, [["__scopeId", "data-v-819abcc5"]]), Qc = /* @__PURE__ */ q({
  __name: "Records",
  setup(e) {
    const { stonecrop: t, isReady: n } = No(), o = { view: "list" };
    return (r, s) => k(n) ? (C(), Se(k(zc), {
      key: 0,
      columns: k(t).schema.schema.toArray(),
      rows: k(t).store.records,
      config: o
    }, null, 8, ["columns", "rows"])) : ke("", !0);
  }
}), vr = (e) => (lo("data-v-18bfde6e"), e = e(), uo(), e), qc = { class: "tabs" }, Kc = { tabindex: "0" }, Jc = {
  version: "1.1",
  id: "Capa_1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  x: "0px",
  y: "0px",
  viewBox: "0 0 424.098 424.098",
  style: { "enable-background": "new 0 0 424.098 424.098" },
  "xml:space": "preserve"
}, Yc = /* @__PURE__ */ vr(() => /* @__PURE__ */ T("g", null, [
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
], -1)), Xc = [
  Yc
], Zc = { tabindex: "0" }, el = { style: { width: "11pt" } }, tl = /* @__PURE__ */ vr(() => /* @__PURE__ */ T("g", { transform: "matrix(-0.08088215,0,0,0.08088215,9.8016177,3.1263021e-6)" }, [
  /* @__PURE__ */ T("path", {
    d: "M 93.148438,80.832031 C 109.5,57.742188 104.03125,25.769531 80.941406,9.421875 57.851562,-6.925781 25.878906,-1.460938 9.53125,21.632812 -6.816406,44.722656 -1.351562,76.691406 21.742188,93.039062 38.222656,104.70703 60.011719,105.60547 77.394531,95.339844 l 37.769529,37.542966 c 4.07813,4.29297 10.86328,4.46485 15.15625,0.38672 4.29297,-4.07422 4.46485,-10.85937 0.39063,-15.15234 -0.12891,-0.13672 -0.25391,-0.26172 -0.39063,-0.39063 z m -41.839844,3.5 C 33.0625,84.335938 18.269531,69.554688 18.257812,51.308594 18.253906,33.0625 33.035156,18.269531 51.285156,18.261719 c 18.222656,-0.0078 33.007813,14.75 33.042969,32.972656 0.03125,18.25 -14.742187,33.066406 -32.996094,33.097656 -0.0078,0 -0.01172,0 -0.02344,0 z m 0,0",
    style: { fill: "#000000", "fill-opacity": "1", "fill-rule": "nonzero", stroke: "none" },
    id: "path2"
  })
], -1)), nl = [
  tl
], ol = /* @__PURE__ */ q({
  __name: "SheetNav",
  props: {
    breadcrumbs: {}
  },
  setup(e) {
    const t = e, n = V([]), o = V(!0), r = V(!1), s = V(""), i = V(null), a = B(() => o.value ? "unrotated" : "rotated");
    Lt(() => {
      n.value = t.breadcrumbs || [];
    });
    const l = () => {
      o.value = !o.value;
    }, u = async () => {
      r.value = !r.value, await Fe(() => {
        i.value.focus();
      });
    }, c = (p) => {
      p.preventDefault(), p.stopPropagation();
    }, d = async (p) => {
      p.preventDefault(), p.stopPropagation(), await u();
    }, f = () => {
    };
    return (p, v) => {
      const m = Or("router-link");
      return C(), A("footer", null, [
        T("ul", qc, [
          T("li", {
            class: "hidebreadcrumbs",
            onClick: l,
            onKeydown: Ye(l, ["enter"])
          }, [
            T("a", Kc, [
              T("div", {
                class: co(a.value)
              }, "×", 2)
            ])
          ], 32),
          T("li", {
            class: "hometab",
            onClick: f,
            onKeydown: Ye(f, ["enter"]),
            style: ie({ display: o.value ? "block" : "none" })
          }, [
            at(m, {
              to: "/home",
              tabindex: "0"
            }, {
              default: it(() => [
                (C(), A("svg", Jc, Xc))
              ]),
              _: 1
            })
          ], 36),
          T("li", {
            class: "searchtab",
            onClick: u,
            onKeydown: Ye(u, ["enter"]),
            style: ie({ display: o.value ? "block" : "none" })
          }, [
            T("a", Zc, [
              T("span", {
                style: ie({ display: r.value ? "none" : "block" })
              }, [
                (C(), A("svg", el, nl))
              ], 4),
              lt(T("input", {
                "onUpdate:modelValue": v[0] || (v[0] = (w) => s.value = w),
                ref_key: "searchinput",
                ref: i,
                style: ie({ display: r.value ? "block" : "none" }),
                onClick: v[1] || (v[1] = (w) => c(w)),
                onInput: v[2] || (v[2] = (w) => c(w)),
                onBlur: v[3] || (v[3] = (w) => d(w)),
                onKeydown: v[4] || (v[4] = Ye((w) => d(w), ["enter"])),
                type: "text"
              }, null, 36), [
                [Ir, s.value]
              ])
            ])
          ], 36),
          (C(!0), A(Ie, null, Pe(n.value, (w, O) => (C(), A("li", {
            key: O,
            style: ie({ display: o.value ? "block" : "none" })
          }, [
            at(m, {
              tabindex: "0",
              to: w.to
            }, {
              default: it(() => [
                go(ce(w.title), 1)
              ]),
              _: 2
            }, 1032, ["to"])
          ], 4))), 128))
        ])
      ]);
    };
  }
}), rl = /* @__PURE__ */ Gt(ol, [["__scopeId", "data-v-18bfde6e"]]), al = {
  install: (e) => {
    e.component("ActionSet", Ur), e.component("CommandPalette", Fr), e.component("Doctype", uc), e.component("Records", Qc), e.component("SheetNav", rl);
  }
};
export {
  Ur as ActionSet,
  Fr as CommandPalette,
  uc as Doctype,
  Qc as Records,
  rl as SheetNav,
  al as StonecropDesktop
};
//# sourceMappingURL=desktop.js.map
