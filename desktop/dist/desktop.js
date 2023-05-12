import { defineComponent as q, ref as V, onMounted as Ht, openBlock as x, createElementBlock as T, normalizeClass as io, createElementVNode as A, Fragment as Ie, renderList as Pe, toDisplayString as ce, createCommentVNode as Se, withDirectives as lt, vShow as Gt, pushScopeId as lo, popScopeId as co, inject as Z, computed as j, createBlock as ke, resolveDynamicComponent as Ft, mergeProps as Wt, unref as b, onBeforeMount as yr, effectScope as uo, markRaw as ae, shallowRef as _r, toRaw as ct, getCurrentInstance as Qt, watch as de, reactive as ve, isRef as Ge, isReactive as zt, toRef as yt, nextTick as Fe, getCurrentScope as fo, onScopeDispose as po, h as ho, provide as tt, toRefs as pn, watchEffect as wr, normalizeStyle as le, renderSlot as ge, createVNode as st, withCtx as at, useCssVars as mo, createTextVNode as vo, onBeforeUnmount as br, resolveComponent as Er, withKeys as Je, vModelText as Sr } from "vue";
const Kt = (e) => (lo("data-v-b7fdfbec"), e = e(), co(), e), kr = { class: "action-menu-icon" }, Or = /* @__PURE__ */ Kt(() => /* @__PURE__ */ A("svg", {
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
  /* @__PURE__ */ A("polygon", { points: "54.2,33.4 29.2,58.8 25,54.6 50,29.2 " })
], -1)), Ir = /* @__PURE__ */ Kt(() => /* @__PURE__ */ A("svg", {
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
  /* @__PURE__ */ A("polygon", { points: "70.8,58.8 45.8,33.4 50,29.2 75,54.6 " })
], -1)), Pr = [
  Or,
  Ir
], xr = /* @__PURE__ */ Kt(() => /* @__PURE__ */ A("div", { style: { "margin-right": "30px" } }, null, -1)), $r = ["onclick"], Nr = { key: 1 }, Cr = ["onClick"], Rr = { class: "dropdown-container" }, Tr = { class: "dropdown" }, Ar = ["onclick"], Dr = ["href"], Vr = { class: "dropdown-item" }, Lr = /* @__PURE__ */ q({
  __name: "ActionSet",
  props: {
    elements: null
  },
  setup(e) {
    const t = e, n = V([]), o = V(!1), r = V(null), s = V(!1), a = V(!1);
    Ht(() => {
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
    return (d, f) => (x(), T("div", {
      class: io([{ "open-set": o.value, "hovered-and-closed": a.value }, "action-set collapse"]),
      onMouseover: c,
      onMouseleave: u
    }, [
      A("div", kr, [
        A("div", {
          id: "chevron",
          onClick: f[0] || (f[0] = (p) => a.value = !a.value)
        }, Pr)
      ]),
      xr,
      (x(!0), T(Ie, null, Pe(n.value, (p, m) => (x(), T("div", {
        class: "action-element",
        key: m
      }, [
        p.elementType == "button" ? (x(), T("button", {
          key: 0,
          onclick: p.action,
          class: "button-default"
        }, ce(p.label), 9, $r)) : Se("", !0),
        p.elementType == "dropdown" ? (x(), T("div", Nr, [
          A("button", {
            class: "button-default",
            onClick: (v) => l(m)
          }, ce(p.label), 9, Cr),
          lt(A("div", Rr, [
            A("div", Tr, [
              (x(!0), T(Ie, null, Pe(p.actions, (v) => (x(), T("div", {
                key: v.label
              }, [
                v.action != null ? (x(), T("button", {
                  key: 0,
                  onclick: v.action,
                  class: "dropdown-item"
                }, ce(v.label), 9, Ar)) : v.link != null ? (x(), T("a", {
                  key: 1,
                  href: v.link
                }, [
                  A("button", Vr, ce(v.label), 1)
                ], 8, Dr)) : Se("", !0)
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
const qt = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, Mr = /* @__PURE__ */ qt(Lr, [["__scopeId", "data-v-b7fdfbec"]]), jr = {};
function Br(e, t) {
  return x(), T("dialog");
}
const Ur = /* @__PURE__ */ qt(jr, [["render", Br]]), Hr = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
};
var hn;
const Gr = typeof window < "u";
Gr && (hn = window == null ? void 0 : window.navigator) != null && hn.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function Fr(e) {
  return e;
}
const It = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Pt = "__vueuse_ssr_handlers__";
It[Pt] = It[Pt] || {};
It[Pt];
var mn;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(mn || (mn = {}));
var Wr = Object.defineProperty, vn = Object.getOwnPropertySymbols, Qr = Object.prototype.hasOwnProperty, zr = Object.prototype.propertyIsEnumerable, gn = (e, t, n) => t in e ? Wr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Kr = (e, t) => {
  for (var n in t || (t = {}))
    Qr.call(t, n) && gn(e, n, t[n]);
  if (vn)
    for (var n of vn(t))
      zr.call(t, n) && gn(e, n, t[n]);
  return e;
};
const qr = {
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
Kr({
  linear: Fr
}, qr);
const Jr = /* @__PURE__ */ q({
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
    return (a, i) => (x(), T("form", null, [
      (x(!0), T(Ie, null, Pe(e.modelValue, (c, u) => (x(), ke(Ft(c.component), Wt({
        key: u,
        schema: c,
        modelValue: b(s)[u].value,
        "onUpdate:modelValue": (l) => b(s)[u].value = l,
        data: o.value[c.fieldname],
        readonly: e.readonly
      }, r(c)), null, 16, ["schema", "modelValue", "onUpdate:modelValue", "data", "readonly"]))), 128))
    ]));
  }
}), Yr = /* @__PURE__ */ Hr(Jr, [["__scopeId", "data-v-74d66cf2"]]), yn = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function Xr(e) {
  try {
    return Function(`"use strict";return (${e})`)();
  } catch {
  }
}
function Zr(e) {
  var t;
  let n = e.value;
  if (n) {
    const o = Xr(n);
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
function es(e, t) {
  t || (t = "#");
  let n = e;
  const o = [t, "/", "-", "(", ")", " "];
  for (const r of o)
    n = n.replaceAll(r, "");
  return n;
}
function ts(e, t, n) {
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
function ns(e, t) {
  const n = Zr(t);
  if (!n)
    return;
  const o = "#", r = e.value, s = es(r, o);
  if (s) {
    const a = ts(s, n, o);
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
    mask: ns
  }
});
function go() {
  const e = Z("$stonecrop"), t = V(!1);
  return yr(async () => {
    var n, o;
    const r = e.registry.router.currentRoute.value, s = (n = r.params.records) == null ? void 0 : n.toString().toLowerCase(), a = (o = r.params.record) == null ? void 0 : o.toString().toLowerCase();
    if (!s && !a)
      return;
    const i = await e.registry.doctypeLoader(s);
    e.registry.addDoctype(i), e.setup(i), s && (a ? await e.getRecord(i, a) : await e.getRecords(i)), e.runAction(i, "LOAD", a ? [a] : void 0), t.value = !0;
  }), { stonecrop: e, isReady: t };
}
var yo = !1;
function Ye(e, t, n) {
  return Array.isArray(e) ? (e.length = Math.max(e.length, t), e.splice(t, 1, n), n) : (e[t] = n, n);
}
function _t(e, t) {
  if (Array.isArray(e)) {
    e.splice(t, 1);
    return;
  }
  delete e[t];
}
function os() {
  return _o().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function _o() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const rs = typeof Proxy == "function", ss = "devtools-plugin:setup", as = "plugin:settings:set";
let $e, xt;
function is() {
  var e;
  return $e !== void 0 || (typeof window < "u" && window.performance ? ($e = !0, xt = window.performance) : typeof global < "u" && (!((e = global.perf_hooks) === null || e === void 0) && e.performance) ? ($e = !0, xt = global.perf_hooks.performance) : $e = !1), $e;
}
function ls() {
  return is() ? xt.now() : Date.now();
}
let cs = class {
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
        return ls();
      }
    }, n && n.on(as, (a, i) => {
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
function wo(e, t) {
  const n = e, o = _o(), r = os(), s = rs && n.enableEarlyProxy;
  if (r && (o.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !s))
    r.emit(ss, e, t);
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
  * pinia v2.0.33
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
let je;
const We = (e) => je = e, bo = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
  /* istanbul ignore next */
  Symbol()
);
function xe(e) {
  return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var oe;
(function(e) {
  e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(oe || (oe = {}));
const ut = typeof window < "u", Be = (process.env.NODE_ENV !== "production" || !1) && process.env.NODE_ENV !== "test" && ut, _n = /* @__PURE__ */ (() => typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null })();
function us(e, { autoBom: t = !1 } = {}) {
  return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob([String.fromCharCode(65279), e], { type: e.type }) : e;
}
function Jt(e, t, n) {
  const o = new XMLHttpRequest();
  o.open("GET", e), o.responseType = "blob", o.onload = function() {
    ko(o.response, t, n);
  }, o.onerror = function() {
    console.error("could not download file");
  }, o.send();
}
function Eo(e) {
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
const ot = typeof navigator == "object" ? navigator : { userAgent: "" }, So = /* @__PURE__ */ (() => /Macintosh/.test(ot.userAgent) && /AppleWebKit/.test(ot.userAgent) && !/Safari/.test(ot.userAgent))(), ko = ut ? (
  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
  typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !So ? ds : (
    // Use msSaveOrOpenBlob as a second approach
    "msSaveOrOpenBlob" in ot ? fs : (
      // Fallback to using FileReader and a popup
      ps
    )
  )
) : () => {
};
function ds(e, t = "download", n) {
  const o = document.createElement("a");
  o.download = t, o.rel = "noopener", typeof e == "string" ? (o.href = e, o.origin !== location.origin ? Eo(o.href) ? Jt(e, t, n) : (o.target = "_blank", nt(o)) : nt(o)) : (o.href = URL.createObjectURL(e), setTimeout(function() {
    URL.revokeObjectURL(o.href);
  }, 4e4), setTimeout(function() {
    nt(o);
  }, 0));
}
function fs(e, t = "download", n) {
  if (typeof e == "string")
    if (Eo(e))
      Jt(e, t, n);
    else {
      const o = document.createElement("a");
      o.href = e, o.target = "_blank", setTimeout(function() {
        nt(o);
      });
    }
  else
    navigator.msSaveOrOpenBlob(us(e, n), t);
}
function ps(e, t, n, o) {
  if (o = o || open("", "_blank"), o && (o.document.title = o.document.body.innerText = "downloading..."), typeof e == "string")
    return Jt(e, t, n);
  const r = e.type === "application/octet-stream", s = /constructor/i.test(String(_n.HTMLElement)) || "safari" in _n, a = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((a || r && s || So) && typeof FileReader < "u") {
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
function Oo() {
  if (!("clipboard" in navigator))
    return H("Your browser doesn't support the Clipboard API", "error"), !0;
}
function Io(e) {
  return e instanceof Error && e.message.toLowerCase().includes("document is not focused") ? (H('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn"), !0) : !1;
}
async function hs(e) {
  if (!Oo())
    try {
      await navigator.clipboard.writeText(JSON.stringify(e.state.value)), H("Global state copied to clipboard.");
    } catch (t) {
      if (Io(t))
        return;
      H("Failed to serialize the state. Check the console for more details.", "error"), console.error(t);
    }
}
async function ms(e) {
  if (!Oo())
    try {
      e.state.value = JSON.parse(await navigator.clipboard.readText()), H("Global state pasted from clipboard.");
    } catch (t) {
      if (Io(t))
        return;
      H("Failed to deserialize the state from clipboard. Check the console for more details.", "error"), console.error(t);
    }
}
async function vs(e) {
  try {
    ko(new Blob([JSON.stringify(e.state.value)], {
      type: "text/plain;charset=utf-8"
    }), "pinia-state.json");
  } catch (t) {
    H("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
let re;
function gs() {
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
async function ys(e) {
  try {
    const n = await (await gs())();
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
const Po = "🍍 Pinia (root)", $t = "_root";
function _s(e) {
  return Yt(e) ? {
    id: $t,
    label: Po
  } : {
    id: e.$id,
    label: e.$id
  };
}
function ws(e) {
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
function bs(e) {
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
function Es(e) {
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
let Te = !0;
const rt = [], be = "pinia:mutations", Q = "pinia", { assign: Ss } = Object, it = (e) => "🍍 " + e;
function ks(e, t) {
  wo({
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
      id: Q,
      label: "Pinia 🍍",
      icon: "storage",
      treeFilterPlaceholder: "Search stores",
      actions: [
        {
          icon: "content_copy",
          action: () => {
            hs(t);
          },
          tooltip: "Serialize and copy the state"
        },
        {
          icon: "content_paste",
          action: async () => {
            await ms(t), n.sendInspectorTree(Q), n.sendInspectorState(Q);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            vs(t);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await ys(t), n.sendInspectorTree(Q), n.sendInspectorState(Q);
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
                value: ct(i.$state),
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
            type: it(i.$id),
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
      if (o.app === e && o.inspectorId === Q) {
        let r = [t];
        r = r.concat(Array.from(t._s.values())), o.rootNodes = (o.filter ? r.filter((s) => "$id" in s ? s.$id.toLowerCase().includes(o.filter.toLowerCase()) : Po.toLowerCase().includes(o.filter.toLowerCase())) : r).map(_s);
      }
    }), n.on.getInspectorState((o) => {
      if (o.app === e && o.inspectorId === Q) {
        const r = o.nodeId === $t ? t : t._s.get(o.nodeId);
        if (!r)
          return;
        r && (o.state = ws(r));
      }
    }), n.on.editInspectorState((o, r) => {
      if (o.app === e && o.inspectorId === Q) {
        const s = o.nodeId === $t ? t : t._s.get(o.nodeId);
        if (!s)
          return H(`store "${o.nodeId}" not found`, "error");
        const { path: a } = o;
        Yt(s) ? a.unshift("state") : (a.length !== 1 || !s._customProperties.has(a[0]) || a[0] in s.$state) && a.unshift("$state"), Te = !1, o.set(s, a, o.state.value), Te = !0;
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
        a[0] = "$state", Te = !1, o.set(s, a, o.state.value), Te = !0;
      }
    });
  });
}
function Os(e, t) {
  rt.includes(it(t.$id)) || rt.push(it(t.$id)), wo({
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
    t.$onAction(({ after: a, onError: i, name: c, args: u }) => {
      const l = xo++;
      n.addTimelineEvent({
        layerId: be,
        event: {
          time: o(),
          title: "🛫 " + c,
          subtitle: "start",
          data: {
            store: ee(t.$id),
            action: ee(c),
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
              store: ee(t.$id),
              action: ee(c),
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
              store: ee(t.$id),
              action: ee(c),
              args: u,
              error: d
            },
            groupId: l
          }
        });
      });
    }, !0), t._customProperties.forEach((a) => {
      de(() => b(t[a]), (i, c) => {
        n.notifyComponentUpdate(), n.sendInspectorState(Q), Te && n.addTimelineEvent({
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
      if (n.notifyComponentUpdate(), n.sendInspectorState(Q), !Te)
        return;
      const u = {
        time: o(),
        title: Es(i),
        data: Ss({ store: ee(t.$id) }, bs(a)),
        groupId: Ee
      };
      Ee = void 0, i === oe.patchFunction ? u.subtitle = "⤵️" : i === oe.patchObject ? u.subtitle = "🧩" : a && !Array.isArray(a) && (u.subtitle = a.type), a && (u.data["rawEvent(s)"] = {
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
let xo = 0, Ee;
function wn(e, t) {
  const n = t.reduce((o, r) => (o[r] = ct(e)[r], o), {});
  for (const o in n)
    e[o] = function() {
      const r = xo, s = new Proxy(e, {
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
      wn(
        // @ts-expect-error: can cast the store...
        t,
        Object.keys(n.actions)
      );
      const o = t._hotUpdate;
      ct(t)._hotUpdate = function(r) {
        o.apply(this, arguments), wn(t, Object.keys(r._hmrPayload.actions));
      };
    }
    Os(
      e,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      t
    );
  }
}
function Ps() {
  const e = uo(!0), t = e.run(() => V({}));
  let n = [], o = [];
  const r = ae({
    install(s) {
      We(r), r._a = s, s.provide(bo, r), s.config.globalProperties.$pinia = r, Be && ks(s, r), o.forEach((a) => n.push(a)), o = [];
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
  return Be && typeof Proxy < "u" && r.use(Is), r;
}
function $o(e, t) {
  for (const n in t) {
    const o = t[n];
    if (!(n in e))
      continue;
    const r = e[n];
    xe(r) && xe(o) && !Ge(o) && !zt(o) ? e[n] = $o(r, o) : e[n] = o;
  }
  return e;
}
const No = () => {
};
function bn(e, t, n, o = No) {
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
function Nt(e, t) {
  e instanceof Map && t instanceof Map && t.forEach((n, o) => e.set(o, n)), e instanceof Set && t instanceof Set && t.forEach(e.add, e);
  for (const n in t) {
    if (!t.hasOwnProperty(n))
      continue;
    const o = t[n], r = e[n];
    xe(r) && xe(o) && e.hasOwnProperty(n) && !Ge(o) && !zt(o) ? e[n] = Nt(r, o) : e[n] = o;
  }
  return e;
}
const xs = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
);
function $s(e) {
  return !xe(e) || !e.hasOwnProperty(xs);
}
const { assign: X } = Object;
function En(e) {
  return !!(Ge(e) && e.effect);
}
function Sn(e, t, n, o) {
  const { state: r, actions: s, getters: a } = t, i = n.state.value[e];
  let c;
  function u() {
    !i && (process.env.NODE_ENV === "production" || !o) && (n.state.value[e] = r ? r() : {});
    const l = process.env.NODE_ENV !== "production" && o ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      pn(V(r ? r() : {}).value)
    ) : pn(n.state.value[e]);
    return X(l, s, Object.keys(a || {}).reduce((d, f) => (process.env.NODE_ENV !== "production" && f in l && console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${f}" in store "${e}".`), d[f] = ae(j(() => {
      We(n);
      const p = n._s.get(e);
      return a[f].call(p, p);
    })), d), {}));
  }
  return c = Ct(e, u, t, n, o, !0), c;
}
function Ct(e, t, n = {}, o, r, s) {
  let a;
  const i = X({ actions: {} }, n);
  if (process.env.NODE_ENV !== "production" && !o._e.active)
    throw new Error("Pinia destroyed");
  const c = {
    deep: !0
    // flush: 'post',
  };
  process.env.NODE_ENV !== "production" && !yo && (c.onTrigger = (S) => {
    u ? p = S : u == !1 && !k._hotUpdating && (Array.isArray(p) ? p.push(S) : console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug."));
  });
  let u, l, d = ae([]), f = ae([]), p;
  const m = o.state.value[e];
  !s && !m && (process.env.NODE_ENV === "production" || !r) && (o.state.value[e] = {});
  const v = V({});
  let y;
  function O(S) {
    let _;
    u = l = !1, process.env.NODE_ENV !== "production" && (p = []), typeof S == "function" ? (S(o.state.value[e]), _ = {
      type: oe.patchFunction,
      storeId: e,
      events: p
    }) : (Nt(o.state.value[e], S), _ = {
      type: oe.patchObject,
      payload: S,
      storeId: e,
      events: p
    });
    const D = y = Symbol();
    Fe().then(() => {
      y === D && (u = !0);
    }), l = !0, Ne(d, _, o.state.value[e]);
  }
  const I = s ? function() {
    const { state: _ } = n, D = _ ? _() : {};
    this.$patch((B) => {
      X(B, D);
    });
  } : (
    /* istanbul ignore next */
    process.env.NODE_ENV !== "production" ? () => {
      throw new Error(`🍍: Store "${e}" is built using the setup syntax and does not implement $reset().`);
    } : No
  );
  function L() {
    a.stop(), d = [], f = [], o._s.delete(e);
  }
  function G(S, _) {
    return function() {
      We(o);
      const D = Array.from(arguments), B = [], _e = [];
      function Ve(W) {
        B.push(W);
      }
      function qe(W) {
        _e.push(W);
      }
      Ne(f, {
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
        throw Ne(_e, W), W;
      }
      return ne instanceof Promise ? ne.then((W) => (Ne(B, W), W)).catch((W) => (Ne(_e, W), Promise.reject(W))) : (Ne(B, ne), ne);
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
    $onAction: bn.bind(null, f),
    $patch: O,
    $reset: I,
    $subscribe(S, _ = {}) {
      const D = bn(d, S, _.detached, () => B()), B = a.run(() => de(() => o.state.value[e], (_e) => {
        (_.flush === "sync" ? l : u) && S({
          storeId: e,
          type: oe.direct,
          events: p
        }, _e);
      }, X({}, c, _)));
      return D;
    },
    $dispose: L
  }, k = ve(process.env.NODE_ENV !== "production" || Be ? X(
    {
      _hmrPayload: J,
      _customProperties: ae(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    Y
    // must be added later
    // setupStore
  ) : Y);
  o._s.set(e, k);
  const te = o._e.run(() => (a = uo(), a.run(() => t())));
  for (const S in te) {
    const _ = te[S];
    if (Ge(_) && !En(_) || zt(_))
      process.env.NODE_ENV !== "production" && r ? Ye(v.value, S, yt(te, S)) : s || (m && $s(_) && (Ge(_) ? _.value = m[S] : Nt(_, m[S])), o.state.value[e][S] = _), process.env.NODE_ENV !== "production" && J.state.push(S);
    else if (typeof _ == "function") {
      const D = process.env.NODE_ENV !== "production" && r ? _ : G(S, _);
      te[S] = D, process.env.NODE_ENV !== "production" && (J.actions[S] = _), i.actions[S] = _;
    } else
      process.env.NODE_ENV !== "production" && En(_) && (J.getters[S] = s ? (
        // @ts-expect-error
        n.getters[S]
      ) : _, ut && (te._getters || // @ts-expect-error: same
      (te._getters = ae([]))).push(S));
  }
  if (X(k, te), X(ct(k), te), Object.defineProperty(k, "$state", {
    get: () => process.env.NODE_ENV !== "production" && r ? v.value : o.state.value[e],
    set: (S) => {
      if (process.env.NODE_ENV !== "production" && r)
        throw new Error("cannot set hotState");
      O((_) => {
        X(_, S);
      });
    }
  }), process.env.NODE_ENV !== "production" && (k._hotUpdate = ae((S) => {
    k._hotUpdating = !0, S._hmrPayload.state.forEach((_) => {
      if (_ in k.$state) {
        const D = S.$state[_], B = k.$state[_];
        typeof D == "object" && xe(D) && xe(B) ? $o(D, B) : S.$state[_] = B;
      }
      Ye(k, _, yt(S.$state, _));
    }), Object.keys(k.$state).forEach((_) => {
      _ in S.$state || _t(k, _);
    }), u = !1, l = !1, o.state.value[e] = yt(S._hmrPayload, "hotState"), l = !0, Fe().then(() => {
      u = !0;
    });
    for (const _ in S._hmrPayload.actions) {
      const D = S[_];
      Ye(k, _, G(_, D));
    }
    for (const _ in S._hmrPayload.getters) {
      const D = S._hmrPayload.getters[_], B = s ? (
        // special handling of options api
        j(() => (We(o), D.call(k, k)))
      ) : D;
      Ye(k, _, B);
    }
    Object.keys(k._hmrPayload.getters).forEach((_) => {
      _ in S._hmrPayload.getters || _t(k, _);
    }), Object.keys(k._hmrPayload.actions).forEach((_) => {
      _ in S._hmrPayload.actions || _t(k, _);
    }), k._hmrPayload = S._hmrPayload, k._getters = S._getters, k._hotUpdating = !1;
  })), Be) {
    const S = {
      writable: !0,
      configurable: !0,
      // avoid warning on devtools trying to display this property
      enumerable: !1
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((_) => {
      Object.defineProperty(k, _, X({ value: k[_] }, S));
    });
  }
  return o._p.forEach((S) => {
    if (Be) {
      const _ = a.run(() => S({
        store: k,
        app: o._a,
        pinia: o,
        options: i
      }));
      Object.keys(_ || {}).forEach((D) => k._customProperties.add(D)), X(k, _);
    } else
      X(k, a.run(() => S({
        store: k,
        app: o._a,
        pinia: o,
        options: i
      })));
  }), process.env.NODE_ENV !== "production" && k.$state && typeof k.$state == "object" && typeof k.$state.constructor == "function" && !k.$state.constructor.toString().includes("[native code]") && console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${k.$id}".`), m && s && n.hydrate && n.hydrate(k.$state, m), u = !0, l = !0, k;
}
function Ns(e, t, n) {
  let o, r;
  const s = typeof t == "function";
  typeof e == "string" ? (o = e, r = s ? n : t) : (r = e, o = e.id);
  function a(i, c) {
    const u = Qt();
    if (i = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (process.env.NODE_ENV === "test" && je && je._testing ? null : i) || u && Z(bo, null), i && We(i), process.env.NODE_ENV !== "production" && !je)
      throw new Error(`[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?
	const pinia = createPinia()
	app.use(pinia)
This will fail in production.`);
    i = je, i._s.has(o) || (s ? Ct(o, t, r, i) : Sn(o, r, i), process.env.NODE_ENV !== "production" && (a._pinia = i));
    const l = i._s.get(o);
    if (process.env.NODE_ENV !== "production" && c) {
      const d = "__hot:" + o, f = s ? Ct(d, t, r, i, !0) : Sn(d, X({}, r), i, !0);
      c._hotUpdate(f), delete i.state.value[d], i._s.delete(d);
    }
    if (process.env.NODE_ENV !== "production" && ut && u && u.proxy && // avoid adding stores that are just built for hot module replacement
    !c) {
      const d = u.proxy, f = "_pStores" in d ? d._pStores : d._pStores = {};
      f[o] = l;
    }
    return l;
  }
  return a.$id = o, a;
}
function Cs(e) {
  return e && typeof e.then == "function";
}
Promise.resolve(!1);
Promise.resolve(!0);
var Oe = Promise.resolve();
function Co(e, t) {
  return e || (e = 0), new Promise(function(n) {
    return setTimeout(function() {
      return n(t);
    }, e);
  });
}
function Rs(e, t) {
  return Math.floor(Math.random() * (t - e + 1) + e);
}
function Xt() {
  return Math.random().toString(36).substring(2);
}
var kn = 0, wt = 0;
function dt() {
  var e = new Date().getTime();
  return e === kn ? (wt++, e * 1e3 + wt) : (kn = e, wt = 0, e * 1e3);
}
var Ts = dt, As = "native";
function Ds(e) {
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
function Vs(e) {
  e.bc.close(), e.subFns = [];
}
function Ls(e, t) {
  try {
    return e.bc.postMessage(t, !1), Oe;
  } catch (n) {
    return Promise.reject(n);
  }
}
function Ms(e, t) {
  e.messagesCallback = t;
}
function js() {
  if (typeof window > "u")
    return !1;
  if (typeof BroadcastChannel == "function") {
    if (BroadcastChannel._pubkey)
      throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
    return !0;
  } else
    return !1;
}
function Bs() {
  return 150;
}
var Us = {
  create: Ds,
  close: Vs,
  onMessage: Ms,
  postMessage: Ls,
  canBeUsed: js,
  type: As,
  averageResponseTime: Bs,
  microSeconds: Ts
}, Ro = (
  /** @class */
  function() {
    function e(t) {
      this.ttl = t, this.map = /* @__PURE__ */ new Map(), this._to = !1;
    }
    return e.prototype.has = function(t) {
      return this.map.has(t);
    }, e.prototype.add = function(t) {
      var n = this;
      this.map.set(t, To()), this._to || (this._to = !0, setTimeout(function() {
        n._to = !1, Hs(n);
      }, 0));
    }, e.prototype.clear = function() {
      this.map.clear();
    }, e;
  }()
);
function Hs(e) {
  for (var t = To() - e.ttl, n = e.map[Symbol.iterator](); ; ) {
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
function To() {
  return new Date().getTime();
}
function Zt() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = JSON.parse(JSON.stringify(e));
  return typeof t.webWorkerSupport > "u" && (t.webWorkerSupport = !0), t.idb || (t.idb = {}), t.idb.ttl || (t.idb.ttl = 1e3 * 45), t.idb.fallbackInterval || (t.idb.fallbackInterval = 150), e.idb && typeof e.idb.onclose == "function" && (t.idb.onclose = e.idb.onclose), t.localstorage || (t.localstorage = {}), t.localstorage.removeTimeout || (t.localstorage.removeTimeout = 1e3 * 60), e.methods && (t.methods = e.methods), t.node || (t.node = {}), t.node.ttl || (t.node.ttl = 1e3 * 60 * 2), t.node.maxParallelWrites || (t.node.maxParallelWrites = 2048), typeof t.node.useFastPath > "u" && (t.node.useFastPath = !0), t;
}
var Gs = dt, Fs = "pubkey.broadcast-channel-0-", ue = "messages", ft = {
  durability: "relaxed"
}, Ws = "idb";
function Ao() {
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
function en(e) {
  e.commit && e.commit();
}
function Qs(e) {
  var t = Ao(), n = Fs + e, o = t.open(n);
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
function zs(e, t, n) {
  var o = new Date().getTime(), r = {
    uuid: t,
    time: o,
    data: n
  }, s = e.transaction([ue], "readwrite", ft);
  return new Promise(function(a, i) {
    s.oncomplete = function() {
      return a();
    }, s.onerror = function(u) {
      return i(u);
    };
    var c = s.objectStore(ue);
    c.add(r), en(s);
  });
}
function Ks(e, t) {
  var n = e.transaction(ue, "readonly", ft), o = n.objectStore(ue), r = [], s = IDBKeyRange.bound(t + 1, 1 / 0);
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
      f ? f.value.id < t + 1 ? f.continue(t + 1) : (r.push(f.value), f.continue()) : (en(n), c(r));
    };
  });
}
function qs(e, t) {
  if (e.closed)
    return Promise.resolve([]);
  var n = e.db.transaction(ue, "readwrite", ft), o = n.objectStore(ue);
  return Promise.all(t.map(function(r) {
    var s = o.delete(r);
    return new Promise(function(a) {
      s.onsuccess = function() {
        return a();
      };
    });
  }));
}
function Js(e, t) {
  var n = new Date().getTime() - t, o = e.transaction(ue, "readonly", ft), r = o.objectStore(ue), s = [];
  return new Promise(function(a) {
    r.openCursor().onsuccess = function(i) {
      var c = i.target.result;
      if (c) {
        var u = c.value;
        u.time < n ? (s.push(u), c.continue()) : (en(o), a(s));
      } else
        a(s);
    };
  });
}
function Ys(e) {
  return Js(e.db, e.options.idb.ttl).then(function(t) {
    return qs(e, t.map(function(n) {
      return n.id;
    }));
  });
}
function Xs(e, t) {
  return t = Zt(t), Qs(e).then(function(n) {
    var o = {
      closed: !1,
      lastCursorId: 0,
      channelName: e,
      options: t,
      uuid: Xt(),
      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new Ro(t.idb.ttl * 2),
      // ensures we do not read messages in parallel
      writeBlockPromise: Oe,
      messagesCallback: null,
      readQueuePromises: [],
      db: n
    };
    return n.onclose = function() {
      o.closed = !0, t.idb.onclose && t.idb.onclose();
    }, Do(o), o;
  });
}
function Do(e) {
  e.closed || Vo(e).then(function() {
    return Co(e.options.idb.fallbackInterval);
  }).then(function() {
    return Do(e);
  });
}
function Zs(e, t) {
  return !(e.uuid === t.uuid || t.eMIs.has(e.id) || e.data.time < t.messagesCallbackTime);
}
function Vo(e) {
  return e.closed || !e.messagesCallback ? Oe : Ks(e.db, e.lastCursorId).then(function(t) {
    var n = t.filter(function(o) {
      return !!o;
    }).map(function(o) {
      return o.id > e.lastCursorId && (e.lastCursorId = o.id), o;
    }).filter(function(o) {
      return Zs(o, e);
    }).sort(function(o, r) {
      return o.time - r.time;
    });
    return n.forEach(function(o) {
      e.messagesCallback && (e.eMIs.add(o.id), e.messagesCallback(o.data));
    }), Oe;
  });
}
function ea(e) {
  e.closed = !0, e.db.close();
}
function ta(e, t) {
  return e.writeBlockPromise = e.writeBlockPromise.then(function() {
    return zs(e.db, e.uuid, t);
  }).then(function() {
    Rs(0, 10) === 0 && Ys(e);
  }), e.writeBlockPromise;
}
function na(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t, Vo(e);
}
function oa() {
  return !!Ao();
}
function ra(e) {
  return e.idb.fallbackInterval * 2;
}
var sa = {
  create: Xs,
  close: ea,
  onMessage: na,
  postMessage: ta,
  canBeUsed: oa,
  type: Ws,
  averageResponseTime: ra,
  microSeconds: Gs
}, aa = dt, ia = "pubkey.broadcastChannel-", la = "localstorage";
function Lo() {
  var e;
  if (typeof window > "u")
    return null;
  try {
    e = window.localStorage, e = window["ie8-eventlistener/storage"] || window.localStorage;
  } catch {
  }
  return e;
}
function Mo(e) {
  return ia + e;
}
function ca(e, t) {
  return new Promise(function(n) {
    Co().then(function() {
      var o = Mo(e.channelName), r = {
        token: Xt(),
        time: new Date().getTime(),
        data: t,
        uuid: e.uuid
      }, s = JSON.stringify(r);
      Lo().setItem(o, s);
      var a = document.createEvent("Event");
      a.initEvent("storage", !0, !0), a.key = o, a.newValue = s, window.dispatchEvent(a), n();
    });
  });
}
function ua(e, t) {
  var n = Mo(e), o = function(s) {
    s.key === n && t(JSON.parse(s.newValue));
  };
  return window.addEventListener("storage", o), o;
}
function da(e) {
  window.removeEventListener("storage", e);
}
function fa(e, t) {
  if (t = Zt(t), !jo())
    throw new Error("BroadcastChannel: localstorage cannot be used");
  var n = Xt(), o = new Ro(t.localstorage.removeTimeout), r = {
    channelName: e,
    uuid: n,
    eMIs: o
    // emittedMessagesIds
  };
  return r.listener = ua(e, function(s) {
    r.messagesCallback && s.uuid !== n && (!s.token || o.has(s.token) || s.data.time && s.data.time < r.messagesCallbackTime || (o.add(s.token), r.messagesCallback(s.data)));
  }), r;
}
function pa(e) {
  da(e.listener);
}
function ha(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t;
}
function jo() {
  var e = Lo();
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
function ma() {
  var e = 120, t = navigator.userAgent.toLowerCase();
  return t.includes("safari") && !t.includes("chrome") ? e * 2 : e;
}
var va = {
  create: fa,
  close: pa,
  onMessage: ha,
  postMessage: ca,
  canBeUsed: jo,
  type: la,
  averageResponseTime: ma,
  microSeconds: aa
}, ga = dt, ya = "simulate", tn = /* @__PURE__ */ new Set();
function _a(e) {
  var t = {
    name: e,
    messagesCallback: null
  };
  return tn.add(t), t;
}
function wa(e) {
  tn.delete(e);
}
function ba(e, t) {
  return new Promise(function(n) {
    return setTimeout(function() {
      var o = Array.from(tn);
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
function Ea(e, t) {
  e.messagesCallback = t;
}
function Sa() {
  return !0;
}
function ka() {
  return 5;
}
var Oa = {
  create: _a,
  close: wa,
  onMessage: Ea,
  postMessage: ba,
  canBeUsed: Sa,
  type: ya,
  averageResponseTime: ka,
  microSeconds: ga
}, On = [
  Us,
  // fastest
  sa,
  va
];
function Ia(e) {
  var t = [].concat(e.methods, On).filter(Boolean);
  if (e.type) {
    if (e.type === "simulate")
      return Oa;
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
  throw new Error("No usable method found in " + JSON.stringify(On.map(function(r) {
    return r.type;
  })));
}
var Bo = /* @__PURE__ */ new Set(), Pa = 0, nn = function(t, n) {
  this.id = Pa++, Bo.add(this), this.name = t, this.options = Zt(n), this.method = Ia(this.options), this._iL = !1, this._onML = null, this._addEL = {
    message: [],
    internal: []
  }, this._uMP = /* @__PURE__ */ new Set(), this._befC = [], this._prepP = null, xa(this);
};
nn._pubkey = !0;
nn.prototype = {
  postMessage: function(t) {
    if (this.closed)
      throw new Error("BroadcastChannel.postMessage(): Cannot post message after channel has closed " + /**
      * In the past when this error appeared, it was really hard to debug.
      * So now we log the msg together with the error so it at least
      * gives some clue about where in your application this happens.
      */
      JSON.stringify(t));
    return In(this, "message", t);
  },
  postInternal: function(t) {
    return In(this, "internal", t);
  },
  set onmessage(e) {
    var t = this.method.microSeconds(), n = {
      time: t,
      fn: e
    };
    xn(this, "message", this._onML), e && typeof e == "function" ? (this._onML = n, Pn(this, "message", n)) : this._onML = null;
  },
  addEventListener: function(t, n) {
    var o = this.method.microSeconds(), r = {
      time: o,
      fn: n
    };
    Pn(this, t, r);
  },
  removeEventListener: function(t, n) {
    var o = this._addEL[t].find(function(r) {
      return r.fn === n;
    });
    xn(this, t, o);
  },
  close: function() {
    var t = this;
    if (!this.closed) {
      Bo.delete(this), this.closed = !0;
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
function In(e, t, n) {
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
function xa(e) {
  var t = e.method.create(e.name, e.options);
  Cs(t) ? (e._prepP = t, t.then(function(n) {
    e._state = n;
  })) : e._state = t;
}
function Uo(e) {
  return e._addEL.message.length > 0 || e._addEL.internal.length > 0;
}
function Pn(e, t, n) {
  e._addEL[t].push(n), $a(e);
}
function xn(e, t, n) {
  e._addEL[t] = e._addEL[t].filter(function(o) {
    return o !== n;
  }), Na(e);
}
function $a(e) {
  if (!e._iL && Uo(e)) {
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
function Na(e) {
  if (e._iL && !Uo(e)) {
    e._iL = !1;
    var t = e.method.microSeconds();
    e.method.onMessage(e._state, null, t);
  }
}
const $n = {
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
class bt extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   */
  constructor(t, n) {
    super(t), this.name = "DevalueError", this.path = n.join("");
  }
}
function Nn(e) {
  return Object(e) !== e;
}
const Ca = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function Ra(e) {
  const t = Object.getPrototypeOf(e);
  return t === Object.prototype || t === null || Object.getOwnPropertyNames(t).sort().join("\0") === Ca;
}
function Ta(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function Ae(e) {
  let t = '"';
  for (let n = 0; n < e.length; n += 1) {
    const o = e.charAt(n), r = o.charCodeAt(0);
    if (o === '"')
      t += '\\"';
    else if (o in $n)
      t += $n[o];
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
const on = -1, Ho = -2, Go = -3, Fo = -4, Wo = -5, rn = -6;
function Cn(e, t) {
  return Aa(JSON.parse(e), t);
}
function Aa(e, t) {
  if (typeof e == "number")
    return r(e, !0);
  if (!Array.isArray(e) || e.length === 0)
    throw new Error("Invalid input");
  const n = (
    /** @type {any[]} */
    e
  ), o = Array(n.length);
  function r(s, a = !1) {
    if (s === on)
      return;
    if (s === Go)
      return NaN;
    if (s === Fo)
      return 1 / 0;
    if (s === Wo)
      return -1 / 0;
    if (s === rn)
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
          l !== Ho && (c[u] = r(l));
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
function Rn(e, t) {
  const n = [], o = /* @__PURE__ */ new Map(), r = [];
  for (const u in t)
    r.push({ key: u, fn: t[u] });
  const s = [];
  let a = 0;
  function i(u) {
    if (typeof u == "function")
      throw new bt("Cannot stringify a function", s);
    if (o.has(u))
      return o.get(u);
    if (u === void 0)
      return on;
    if (Number.isNaN(u))
      return Go;
    if (u === 1 / 0)
      return Fo;
    if (u === -1 / 0)
      return Wo;
    if (u === 0 && 1 / u < 0)
      return rn;
    const l = a++;
    o.set(u, l);
    for (const { key: f, fn: p } of r) {
      const m = p(u);
      if (m)
        return n[l] = `["${f}",${i(m)}]`, l;
    }
    let d = "";
    if (Nn(u))
      d = Et(u);
    else
      switch (Ta(u)) {
        case "Number":
        case "String":
        case "Boolean":
          d = `["Object",${Et(u)}]`;
          break;
        case "BigInt":
          d = `["BigInt",${u}]`;
          break;
        case "Date":
          d = `["Date","${u.toISOString()}"]`;
          break;
        case "RegExp":
          const { source: p, flags: m } = u;
          d = m ? `["RegExp",${Ae(p)},"${m}"]` : `["RegExp",${Ae(p)}]`;
          break;
        case "Array":
          d = "[";
          for (let v = 0; v < u.length; v += 1)
            v > 0 && (d += ","), v in u ? (s.push(`[${v}]`), d += i(u[v]), s.pop()) : d += Ho;
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
          for (const [v, y] of u)
            s.push(
              `.get(${Nn(v) ? Et(v) : "..."})`
            ), d += `,${i(v)},${i(y)}`;
          d += "]";
          break;
        default:
          if (!Ra(u))
            throw new bt(
              "Cannot stringify arbitrary non-POJOs",
              s
            );
          if (Object.getOwnPropertySymbols(u).length > 0)
            throw new bt(
              "Cannot stringify POJOs with symbolic keys",
              s
            );
          if (Object.getPrototypeOf(u) === null) {
            d = '["null"';
            for (const v in u)
              s.push(`.${v}`), d += `,${Ae(v)},${i(u[v])}`, s.pop();
            d += "]";
          } else {
            d = "{";
            let v = !1;
            for (const y in u)
              v && (d += ","), v = !0, s.push(`.${y}`), d += `${Ae(y)}:${i(u[y])}`, s.pop();
            d += "}";
          }
      }
    return n[l] = d, l;
  }
  const c = i(e);
  return c < 0 ? `${c}` : `[${n.join(",")}]`;
}
function Et(e) {
  const t = typeof e;
  return t === "string" ? Ae(e) : e instanceof String ? Ae(e.toString()) : e === void 0 ? on.toString() : e === 0 && 1 / e < 0 ? rn.toString() : t === "bigint" ? `["BigInt","${e}"]` : String(e);
}
function Da(e, t, { initialize: n, type: o }) {
  let r = `${t.$id}-${e.toString()}`, s = new nn(r, { type: o }), a = !1, i = 0;
  de(() => t[e], (l) => {
    a || (i = Date.now(), s.postMessage({ timestamp: i, state: Cn(Rn(l)) })), a = !1;
  }, { deep: !0 }), s.onmessage = (l) => {
    if (l === void 0) {
      s.postMessage({ timestamp: i, state: Cn(Rn(t[e])) });
      return;
    }
    l.timestamp <= i || (a = !0, i = l.timestamp, t[e] = l.state);
  };
  let c = () => s.postMessage(void 0), u = () => s.close();
  return n && c(), { sync: c, unshare: u };
}
var Va = (e, t) => Object.keys(t).includes(e), La = ({ initialize: e = !0, enable: t = !0, type: n }) => ({ store: o, options: r }) => {
  var s, a;
  let i = ((s = r == null ? void 0 : r.share) == null ? void 0 : s.enable) ?? t, c = ((a = r == null ? void 0 : r.share) == null ? void 0 : a.omit) ?? [];
  !i || Object.keys(o.$state).forEach((u) => {
    var l;
    c.includes(u) || !Va(u, o.$state) || Da(u, o, { initialize: ((l = r == null ? void 0 : r.share) == null ? void 0 : l.initialize) ?? e, type: n });
  });
};
const Ma = Ps();
Ma.use(
  La({
    enable: !0,
    initialize: !0
  })
);
Ns("data", () => {
  const e = V([]), t = V({});
  return { records: e, record: t };
});
function ja() {
  return Qo().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function Qo() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const Ba = typeof Proxy == "function", Ua = "devtools-plugin:setup", Ha = "plugin:settings:set";
let Ce, Rt;
function Ga() {
  var e;
  return Ce !== void 0 || (typeof window < "u" && window.performance ? (Ce = !0, Rt = window.performance) : typeof global < "u" && (!((e = global.perf_hooks) === null || e === void 0) && e.performance) ? (Ce = !0, Rt = global.perf_hooks.performance) : Ce = !1), Ce;
}
function Fa() {
  return Ga() ? Rt.now() : Date.now();
}
class Wa {
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
        return Fa();
      }
    }, n && n.on(Ha, (a, i) => {
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
function Qa(e, t) {
  const n = e, o = Qo(), r = ja(), s = Ba && n.enableEarlyProxy;
  if (r && (o.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !s))
    r.emit(Ua, e, t);
  else {
    const a = s ? new Wa(n, r) : null;
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
function za(e) {
  return e.__esModule || e[Symbol.toStringTag] === "Module";
}
const R = Object.assign;
function St(e, t) {
  const n = {};
  for (const o in t) {
    const r = t[o];
    n[o] = K(r) ? r.map(e) : e(r);
  }
  return n;
}
const Ue = () => {
}, K = Array.isArray;
function N(e) {
  const t = Array.from(arguments).slice(1);
  console.warn.apply(console, ["[Vue Router warn]: " + e].concat(t));
}
const Ka = /\/$/, qa = (e) => e.replace(Ka, "");
function kt(e, t, n = "/") {
  let o, r = {}, s = "", a = "";
  const i = t.indexOf("#");
  let c = t.indexOf("?");
  return i < c && i >= 0 && (c = -1), c > -1 && (o = t.slice(0, c), s = t.slice(c + 1, i > -1 ? i : t.length), r = e(s)), i > -1 && (o = o || t.slice(0, i), a = t.slice(i, t.length)), o = Xa(o ?? t, n), {
    fullPath: o + (s && "?") + s + a,
    path: o,
    query: r,
    hash: a
  };
}
function Ja(e, t) {
  const n = t.query ? e(t.query) : "";
  return t.path + (n && "?") + n + (t.hash || "");
}
function Tn(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || "/";
}
function An(e, t, n) {
  const o = t.matched.length - 1, r = n.matched.length - 1;
  return o > -1 && o === r && ye(t.matched[o], n.matched[r]) && zo(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function ye(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t);
}
function zo(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (!Ya(e[n], t[n]))
      return !1;
  return !0;
}
function Ya(e, t) {
  return K(e) ? Dn(e, t) : K(t) ? Dn(t, e) : e === t;
}
function Dn(e, t) {
  return K(t) ? e.length === t.length && e.every((n, o) => n === t[o]) : e.length === 1 && e[0] === t;
}
function Xa(e, t) {
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
var Qe;
(function(e) {
  e.pop = "pop", e.push = "push";
})(Qe || (Qe = {}));
var He;
(function(e) {
  e.back = "back", e.forward = "forward", e.unknown = "";
})(He || (He = {}));
function Za(e) {
  if (!e)
    if (ie) {
      const t = document.querySelector("base");
      e = t && t.getAttribute("href") || "/", e = e.replace(/^\w+:\/\/[^\/]+/, "");
    } else
      e = "/";
  return e[0] !== "/" && e[0] !== "#" && (e = "/" + e), qa(e);
}
const ei = /^[^#]+#/;
function ti(e, t) {
  return e.replace(ei, "#") + t;
}
function ni(e, t) {
  const n = document.documentElement.getBoundingClientRect(), o = e.getBoundingClientRect();
  return {
    behavior: t.behavior,
    left: o.left - n.left - (t.left || 0),
    top: o.top - n.top - (t.top || 0)
  };
}
const pt = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function oi(e) {
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
    t = ni(r, e);
  } else
    t = e;
  "scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left != null ? t.left : window.pageXOffset, t.top != null ? t.top : window.pageYOffset);
}
function Vn(e, t) {
  return (history.state ? history.state.position - t : -1) + e;
}
const Tt = /* @__PURE__ */ new Map();
function ri(e, t) {
  Tt.set(e, t);
}
function si(e) {
  const t = Tt.get(e);
  return Tt.delete(e), t;
}
let ai = () => location.protocol + "//" + location.host;
function Ko(e, t) {
  const { pathname: n, search: o, hash: r } = t, s = e.indexOf("#");
  if (s > -1) {
    let i = r.includes(e.slice(s)) ? e.slice(s).length : 1, c = r.slice(i);
    return c[0] !== "/" && (c = "/" + c), Tn(c, "");
  }
  return Tn(n, e) + o + r;
}
function ii(e, t, n, o) {
  let r = [], s = [], a = null;
  const i = ({ state: f }) => {
    const p = Ko(e, location), m = n.value, v = t.value;
    let y = 0;
    if (f) {
      if (n.value = p, t.value = f, a && a === m) {
        a = null;
        return;
      }
      y = v ? f.position - v.position : 0;
    } else
      o(p);
    r.forEach((O) => {
      O(n.value, m, {
        delta: y,
        type: Qe.pop,
        direction: y ? y > 0 ? He.forward : He.back : He.unknown
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
    f.state && f.replaceState(R({}, f.state, { scroll: pt() }), "");
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
function Ln(e, t, n, o = !1, r = !1) {
  return {
    back: e,
    current: t,
    forward: n,
    replaced: o,
    position: window.history.length,
    scroll: r ? pt() : null
  };
}
function li(e) {
  const { history: t, location: n } = window, o = {
    value: Ko(e, n)
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
    const d = e.indexOf("#"), f = d > -1 ? (n.host && document.querySelector("base") ? e : e.slice(d)) + c : ai() + e + c;
    try {
      t[l ? "replaceState" : "pushState"](u, "", f), r.value = u;
    } catch (p) {
      process.env.NODE_ENV !== "production" ? N("Error with push/replace State", p) : console.error(p), n[l ? "replace" : "assign"](f);
    }
  }
  function a(c, u) {
    const l = R({}, t.state, Ln(
      r.value.back,
      // keep back and forward entries but override current position
      c,
      r.value.forward,
      !0
    ), u, { position: r.value.position });
    s(c, l, !0), o.value = c;
  }
  function i(c, u) {
    const l = R(
      {},
      // use current history state to gracefully handle a wrong call to
      // history.replaceState
      // https://github.com/vuejs/router/issues/366
      r.value,
      t.state,
      {
        forward: c,
        scroll: pt()
      }
    );
    process.env.NODE_ENV !== "production" && !t.state && N(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:

history.replaceState(history.state, '', url)

You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`), s(l.current, l, !0);
    const d = R({}, Ln(o.value, c, null), { position: l.position + 1 }, u);
    s(c, d, !1), o.value = c;
  }
  return {
    location: o,
    state: r,
    push: i,
    replace: a
  };
}
function ci(e) {
  e = Za(e);
  const t = li(e), n = ii(e, t.state, t.location, t.replace);
  function o(s, a = !0) {
    a || n.pauseListeners(), history.go(s);
  }
  const r = R({
    // it's overridden right after
    location: "",
    base: e,
    go: o,
    createHref: ti.bind(null, e)
  }, t, n);
  return Object.defineProperty(r, "location", {
    enumerable: !0,
    get: () => t.location.value
  }), Object.defineProperty(r, "state", {
    enumerable: !0,
    get: () => t.state.value
  }), r;
}
function ui(e) {
  return typeof e == "string" || e && typeof e == "object";
}
function qo(e) {
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
}, At = Symbol(process.env.NODE_ENV !== "production" ? "navigation failure" : "");
var Mn;
(function(e) {
  e[e.aborted = 4] = "aborted", e[e.cancelled = 8] = "cancelled", e[e.duplicated = 16] = "duplicated";
})(Mn || (Mn = {}));
const di = {
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
    return `Redirected from "${e.fullPath}" to "${pi(t)}" via a navigation guard.`;
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
  return process.env.NODE_ENV !== "production" ? R(new Error(di[e](t)), {
    type: e,
    [At]: !0
  }, t) : R(new Error(), {
    type: e,
    [At]: !0
  }, t);
}
function se(e, t) {
  return e instanceof Error && At in e && (t == null || !!(e.type & t));
}
const fi = ["params", "query", "hash"];
function pi(e) {
  if (typeof e == "string")
    return e;
  if ("path" in e)
    return e.path;
  const t = {};
  for (const n of fi)
    n in e && (t[n] = e[n]);
  return JSON.stringify(t, null, 2);
}
const jn = "[^/]+?", hi = {
  sensitive: !1,
  strict: !1,
  start: !0,
  end: !0
}, mi = /[.+*?^${}()[\]/\\]/g;
function vi(e, t) {
  const n = R({}, hi, t), o = [];
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
        d || (r += "/"), r += f.value.replace(mi, "\\$&"), p += 40;
      else if (f.type === 1) {
        const { value: m, repeatable: v, optional: y, regexp: O } = f;
        s.push({
          name: m,
          repeatable: v,
          optional: y
        });
        const I = O || jn;
        if (I !== jn) {
          p += 10;
          try {
            new RegExp(`(${I})`);
          } catch (G) {
            throw new Error(`Invalid custom RegExp for param "${m}" (${I}): ` + G.message);
          }
        }
        let L = v ? `((?:${I})(?:/(?:${I}))*)` : `(${I})`;
        d || (L = // avoid an optional / if there are more segments e.g. /:p?-static
        // or /:p?-:p2
        y && u.length < 2 ? `(?:/${L})` : "/" + L), y && (L += "?"), r += L, p += 20, y && (p += -8), v && (p += -20), I === ".*" && (p += -50);
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
          const { value: m, repeatable: v, optional: y } = p, O = m in u ? u[m] : "";
          if (K(O) && !v)
            throw new Error(`Provided param "${m}" is an array but it is not repeatable (* or + modifiers)`);
          const I = K(O) ? O.join("/") : O;
          if (!I)
            if (y)
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
function gi(e, t) {
  let n = 0;
  for (; n < e.length && n < t.length; ) {
    const o = t[n] - e[n];
    if (o)
      return o;
    n++;
  }
  return e.length < t.length ? e.length === 1 && e[0] === 40 + 40 ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === 40 + 40 ? 1 : -1 : 0;
}
function yi(e, t) {
  let n = 0;
  const o = e.score, r = t.score;
  for (; n < o.length && n < r.length; ) {
    const s = gi(o[n], r[n]);
    if (s)
      return s;
    n++;
  }
  if (Math.abs(r.length - o.length) === 1) {
    if (Bn(o))
      return 1;
    if (Bn(r))
      return -1;
  }
  return r.length - o.length;
}
function Bn(e) {
  const t = e[e.length - 1];
  return e.length > 0 && t[t.length - 1] < 0;
}
const _i = {
  type: 0,
  value: ""
}, wi = /[a-zA-Z0-9_]/;
function bi(e) {
  if (!e)
    return [[]];
  if (e === "/")
    return [[_i]];
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
        c === "(" ? n = 2 : wi.test(c) ? f() : (d(), n = 0, c !== "*" && c !== "?" && c !== "+" && i--);
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
function Ei(e, t, n) {
  const o = vi(bi(e.path), n);
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
function Si(e, t) {
  const n = [], o = /* @__PURE__ */ new Map();
  t = Gn({ strict: !1, end: !0, sensitive: !1 }, t);
  function r(l) {
    return o.get(l);
  }
  function s(l, d, f) {
    const p = !f, m = ki(l);
    process.env.NODE_ENV !== "production" && xi(m, d), m.aliasOf = f && f.record;
    const v = Gn(t, l), y = [
      m
    ];
    if ("alias" in l) {
      const L = typeof l.alias == "string" ? [l.alias] : l.alias;
      for (const G of L)
        y.push(R({}, m, {
          // this allows us to hold a copy of the `components` option
          // so that async components cache is hold on the original record
          components: f ? f.record.components : m.components,
          path: G,
          // we might be the child of an alias
          aliasOf: f ? f.record : m
          // the aliases are always of the same kind as the original since they
          // are defined on the same record
        }));
    }
    let O, I;
    for (const L of y) {
      const { path: G } = L;
      if (d && G[0] !== "/") {
        const J = d.record.path, Y = J[J.length - 1] === "/" ? "" : "/";
        L.path = d.record.path + (G && Y + G);
      }
      if (process.env.NODE_ENV !== "production" && L.path === "*")
        throw new Error(`Catch all routes ("*") must now be defined using a param with a custom regexp.
See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.`);
      if (O = Ei(L, d, v), process.env.NODE_ENV !== "production" && d && G[0] === "/" && $i(O, d), f ? (f.alias.push(O), process.env.NODE_ENV !== "production" && Pi(f, O)) : (I = I || O, I !== O && I.alias.push(O), p && l.name && !Hn(O) && a(l.name)), m.children) {
        const J = m.children;
        for (let Y = 0; Y < J.length; Y++)
          s(J[Y], O, f && f.children[Y]);
      }
      f = f || O, (O.record.components && Object.keys(O.record.components).length || O.record.name || O.record.redirect) && c(O);
    }
    return I ? () => {
      a(I);
    } : Ue;
  }
  function a(l) {
    if (qo(l)) {
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
    for (; d < n.length && yi(l, n[d]) >= 0 && // Adding children with empty path should still appear before the parent
    // https://github.com/vuejs/router/issues/1124
    (l.record.path !== n[d].record.path || !Jo(l, n[d])); )
      d++;
    n.splice(d, 0, l), l.record.name && !Hn(l) && o.set(l.record.name, l);
  }
  function u(l, d) {
    let f, p = {}, m, v;
    if ("name" in l && l.name) {
      if (f = o.get(l.name), !f)
        throw De(1, {
          location: l
        });
      if (process.env.NODE_ENV !== "production") {
        const I = Object.keys(l.params || {}).filter((L) => !f.keys.find((G) => G.name === L));
        I.length && N(`Discarded invalid param(s) "${I.join('", "')}" when navigating. See https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22 for more details.`);
      }
      v = f.record.name, p = R(
        // paramsFromLocation is a new object
        Un(
          d.params,
          // only keep params that exist in the resolved location
          // TODO: only keep optional params coming from a parent record
          f.keys.filter((I) => !I.optional).map((I) => I.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        l.params && Un(l.params, f.keys.map((I) => I.name))
      ), m = f.stringify(p);
    } else if ("path" in l)
      m = l.path, process.env.NODE_ENV !== "production" && !m.startsWith("/") && N(`The Matcher cannot resolve relative paths but received "${m}". Unless you directly called \`matcher.resolve("${m}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`), f = n.find((I) => I.re.test(m)), f && (p = f.parse(m), v = f.record.name);
    else {
      if (f = d.name ? o.get(d.name) : n.find((I) => I.re.test(d.path)), !f)
        throw De(1, {
          location: l,
          currentLocation: d
        });
      v = f.record.name, p = R({}, d.params, l.params), m = f.stringify(p);
    }
    const y = [];
    let O = f;
    for (; O; )
      y.unshift(O.record), O = O.parent;
    return {
      name: v,
      path: m,
      params: p,
      matched: y,
      meta: Ii(y)
    };
  }
  return e.forEach((l) => s(l)), { addRoute: s, resolve: u, removeRoute: a, getRoutes: i, getRecordMatcher: r };
}
function Un(e, t) {
  const n = {};
  for (const o of t)
    o in e && (n[o] = e[o]);
  return n;
}
function ki(e) {
  return {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: void 0,
    beforeEnter: e.beforeEnter,
    props: Oi(e),
    children: e.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in e ? e.components || null : e.component && { default: e.component }
  };
}
function Oi(e) {
  const t = {}, n = e.props || !1;
  if ("component" in e)
    t.default = n;
  else
    for (const o in e.components)
      t[o] = typeof n == "boolean" ? n : n[o];
  return t;
}
function Hn(e) {
  for (; e; ) {
    if (e.record.aliasOf)
      return !0;
    e = e.parent;
  }
  return !1;
}
function Ii(e) {
  return e.reduce((t, n) => R(t, n.meta), {});
}
function Gn(e, t) {
  const n = {};
  for (const o in e)
    n[o] = o in t ? t[o] : e[o];
  return n;
}
function Dt(e, t) {
  return e.name === t.name && e.optional === t.optional && e.repeatable === t.repeatable;
}
function Pi(e, t) {
  for (const n of e.keys)
    if (!n.optional && !t.keys.find(Dt.bind(null, n)))
      return N(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
  for (const n of t.keys)
    if (!n.optional && !e.keys.find(Dt.bind(null, n)))
      return N(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
}
function xi(e, t) {
  t && t.record.name && !e.name && !e.path && N(`The route named "${String(t.record.name)}" has a child without a name and an empty path. Using that name won't render the empty path child so you probably want to move the name to the child instead. If this is intentional, add a name to the child route to remove the warning.`);
}
function $i(e, t) {
  for (const n of t.keys)
    if (!e.keys.find(Dt.bind(null, n)))
      return N(`Absolute path "${e.record.path}" must have the exact same param named "${n.name}" as its parent "${t.record.path}".`);
}
function Jo(e, t) {
  return t.children.some((n) => n === e || Jo(e, n));
}
const Yo = /#/g, Ni = /&/g, Ci = /\//g, Ri = /=/g, Ti = /\?/g, Xo = /\+/g, Ai = /%5B/g, Di = /%5D/g, Zo = /%5E/g, Vi = /%60/g, er = /%7B/g, Li = /%7C/g, tr = /%7D/g, Mi = /%20/g;
function sn(e) {
  return encodeURI("" + e).replace(Li, "|").replace(Ai, "[").replace(Di, "]");
}
function ji(e) {
  return sn(e).replace(er, "{").replace(tr, "}").replace(Zo, "^");
}
function Vt(e) {
  return sn(e).replace(Xo, "%2B").replace(Mi, "+").replace(Yo, "%23").replace(Ni, "%26").replace(Vi, "`").replace(er, "{").replace(tr, "}").replace(Zo, "^");
}
function Bi(e) {
  return Vt(e).replace(Ri, "%3D");
}
function Ui(e) {
  return sn(e).replace(Yo, "%23").replace(Ti, "%3F");
}
function Hi(e) {
  return e == null ? "" : Ui(e).replace(Ci, "%2F");
}
function ze(e) {
  try {
    return decodeURIComponent("" + e);
  } catch {
    process.env.NODE_ENV !== "production" && N(`Error decoding "${e}". Using original value`);
  }
  return "" + e;
}
function Gi(e) {
  const t = {};
  if (e === "" || e === "?")
    return t;
  const o = (e[0] === "?" ? e.slice(1) : e).split("&");
  for (let r = 0; r < o.length; ++r) {
    const s = o[r].replace(Xo, " "), a = s.indexOf("="), i = ze(a < 0 ? s : s.slice(0, a)), c = a < 0 ? null : ze(s.slice(a + 1));
    if (i in t) {
      let u = t[i];
      K(u) || (u = t[i] = [u]), u.push(c);
    } else
      t[i] = c;
  }
  return t;
}
function Fn(e) {
  let t = "";
  for (let n in e) {
    const o = e[n];
    if (n = Bi(n), o == null) {
      o !== void 0 && (t += (t.length ? "&" : "") + n);
      continue;
    }
    (K(o) ? o.map((s) => s && Vt(s)) : [o && Vt(o)]).forEach((s) => {
      s !== void 0 && (t += (t.length ? "&" : "") + n, s != null && (t += "=" + s));
    });
  }
  return t;
}
function Fi(e) {
  const t = {};
  for (const n in e) {
    const o = e[n];
    o !== void 0 && (t[n] = K(o) ? o.map((r) => r == null ? null : "" + r) : o == null ? o : "" + o);
  }
  return t;
}
const Wi = Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : ""), Wn = Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : ""), an = Symbol(process.env.NODE_ENV !== "production" ? "router" : ""), nr = Symbol(process.env.NODE_ENV !== "production" ? "route location" : ""), Lt = Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
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
  return () => new Promise((a, i) => {
    const c = (d) => {
      d === !1 ? i(De(4, {
        from: n,
        to: t
      })) : d instanceof Error ? i(d) : ui(d) ? i(De(2, {
        from: t,
        to: d
      })) : (s && // since enterCallbackArray is truthy, both record and name also are
      o.enterCallbacks[r] === s && typeof d == "function" && s.push(d), a());
    }, u = e.call(o && o.instances[r], t, n, process.env.NODE_ENV !== "production" ? Qi(c, t, n) : c);
    let l = Promise.resolve(u);
    if (e.length < 3 && (l = l.then(c)), process.env.NODE_ENV !== "production" && e.length > 2) {
      const d = `The "next" callback was never called inside of ${e.name ? '"' + e.name + '"' : ""}:
${e.toString()}
. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;
      if (typeof u == "object" && "then" in u)
        l = l.then((f) => c._called ? f : (N(d), Promise.reject(new Error("Invalid navigation guard"))));
      else if (u !== void 0 && !c._called) {
        N(d), i(new Error("Invalid navigation guard"));
        return;
      }
    }
    l.catch((d) => i(d));
  });
}
function Qi(e, t, n) {
  let o = 0;
  return function() {
    o++ === 1 && N(`The "next" callback was called more than once in one navigation guard when going from "${n.fullPath}" to "${t.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`), e._called = !0, o === 1 && e.apply(null, arguments);
  };
}
function Ot(e, t, n, o) {
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
          const c = i;
          i = () => c;
        } else
          i.__asyncLoader && // warn only once per component
          !i.__warnedDefineAsync && (i.__warnedDefineAsync = !0, N(`Component "${a}" in record with path "${s.path}" is defined using "defineAsyncComponent()". Write "() => import('./MyPage.vue')" instead of "defineAsyncComponent(() => import('./MyPage.vue'))".`));
      }
      if (!(t !== "beforeRouteEnter" && !s.instances[a]))
        if (zi(i)) {
          const u = (i.__vccOpts || i)[t];
          u && r.push(me(u, n, o, s, a));
        } else {
          let c = i();
          process.env.NODE_ENV !== "production" && !("catch" in c) && (N(`Component "${a}" in record with path "${s.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`), c = Promise.resolve(c)), r.push(() => c.then((u) => {
            if (!u)
              return Promise.reject(new Error(`Couldn't resolve component "${a}" at "${s.path}"`));
            const l = za(u) ? u.default : u;
            s.components[a] = l;
            const f = (l.__vccOpts || l)[t];
            return f && me(f, n, o, s, a)();
          }));
        }
    }
  }
  return r;
}
function zi(e) {
  return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function Qn(e) {
  const t = Z(an), n = Z(nr), o = j(() => t.resolve(b(e.to))), r = j(() => {
    const { matched: c } = o.value, { length: u } = c, l = c[u - 1], d = n.matched;
    if (!l || !d.length)
      return -1;
    const f = d.findIndex(ye.bind(null, l));
    if (f > -1)
      return f;
    const p = zn(c[u - 2]);
    return (
      // we are dealing with nested routes
      u > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      zn(l) === p && // avoid comparing the child with its parent
      d[d.length - 1].path !== p ? d.findIndex(ye.bind(null, c[u - 2])) : f
    );
  }), s = j(() => r.value > -1 && Yi(n.params, o.value.params)), a = j(() => r.value > -1 && r.value === n.matched.length - 1 && zo(n.params, o.value.params));
  function i(c = {}) {
    return Ji(c) ? t[b(e.replace) ? "replace" : "push"](
      b(e.to)
      // avoid uncaught errors are they are logged anyway
    ).catch(Ue) : Promise.resolve();
  }
  if (process.env.NODE_ENV !== "production" && ie) {
    const c = Qt();
    if (c) {
      const u = {
        route: o.value,
        isActive: s.value,
        isExactActive: a.value
      };
      c.__vrl_devtools = c.__vrl_devtools || [], c.__vrl_devtools.push(u), wr(() => {
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
const Ki = /* @__PURE__ */ q({
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
  useLink: Qn,
  setup(e, { slots: t }) {
    const n = ve(Qn(e)), { options: o } = Z(an), r = j(() => ({
      [Kn(e.activeClass, o.linkActiveClass, "router-link-active")]: n.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [Kn(e.exactActiveClass, o.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
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
}), qi = Ki;
function Ji(e) {
  if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(t))
        return;
    }
    return e.preventDefault && e.preventDefault(), !0;
  }
}
function Yi(e, t) {
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
function zn(e) {
  return e ? e.aliasOf ? e.aliasOf.path : e.path : "";
}
const Kn = (e, t, n) => e ?? t ?? n, Xi = /* @__PURE__ */ q({
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
    process.env.NODE_ENV !== "production" && el();
    const o = Z(Lt), r = j(() => e.route || o.value), s = Z(Wn, 0), a = j(() => {
      let u = b(s);
      const { matched: l } = r.value;
      let d;
      for (; (d = l[u]) && !d.components; )
        u++;
      return u;
    }), i = j(() => r.value.matched[a.value]);
    tt(Wn, j(() => a.value + 1)), tt(Wi, i), tt(Lt, r);
    const c = V();
    return de(() => [c.value, i.value, e.name], ([u, l, d], [f, p, m]) => {
      l && (l.instances[d] = u, p && p !== l && u && u === f && (l.leaveGuards.size || (l.leaveGuards = p.leaveGuards), l.updateGuards.size || (l.updateGuards = p.updateGuards))), u && l && // if there is no instance but to and from are the same this might be
      // the first visit
      (!p || !ye(l, p) || !f) && (l.enterCallbacks[d] || []).forEach((v) => v(u));
    }, { flush: "post" }), () => {
      const u = r.value, l = e.name, d = i.value, f = d && d.components[l];
      if (!f)
        return qn(n.default, { Component: f, route: u });
      const p = d.props[l], m = p ? p === !0 ? u.params : typeof p == "function" ? p(u) : p : null, y = ho(f, R({}, m, t, {
        onVnodeUnmounted: (O) => {
          O.component.isUnmounted && (d.instances[l] = null);
        },
        ref: c
      }));
      if (process.env.NODE_ENV !== "production" && ie && y.ref) {
        const O = {
          depth: a.value,
          name: d.name,
          path: d.path,
          meta: d.meta
        };
        (K(y.ref) ? y.ref.map((L) => L.i) : [y.ref.i]).forEach((L) => {
          L.__vrv_devtools = O;
        });
      }
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        qn(n.default, { Component: y, route: u }) || y
      );
    };
  }
});
function qn(e, t) {
  if (!e)
    return null;
  const n = e(t);
  return n.length === 1 ? n[0] : n;
}
const Zi = Xi;
function el() {
  const e = Qt(), t = e.parent && e.parent.type.name;
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
    matched: e.matched.map((o) => cl(o, ["instances", "children", "aliasOf"]))
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
function Xe(e) {
  return {
    _custom: {
      display: e
    }
  };
}
let tl = 0;
function nl(e, t, n) {
  if (t.__hasDevtools)
    return;
  t.__hasDevtools = !0;
  const o = tl++;
  Qa({
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
        value: Me(t.currentRoute.value, "Current Route")
      });
    }), r.on.visitComponentTree(({ treeNode: l, componentInstance: d }) => {
      if (d.__vrv_devtools) {
        const f = d.__vrv_devtools;
        l.tags.push({
          label: (f.name ? `${f.name.toString()}: ` : "") + f.path,
          textColor: 0,
          tooltip: "This component is rendered by &lt;router-view&gt;",
          backgroundColor: or
        });
      }
      K(d.__vrl_devtools) && (d.__devtoolsApi = r, d.__vrl_devtools.forEach((f) => {
        let p = ar, m = "";
        f.isExactActive ? (p = sr, m = "This is exactly active") : f.isActive && (p = rr, m = "This link is active"), l.tags.push({
          label: f.route.path,
          textColor: 0,
          tooltip: m,
          backgroundColor: p
        });
      }));
    }), de(t.currentRoute, () => {
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
        guard: Xe("beforeEach"),
        from: Me(d, "Current Location during this navigation"),
        to: Me(l, "Target location")
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
        guard: Xe("afterEach")
      };
      f ? (p.failure = {
        _custom: {
          type: Error,
          readOnly: !0,
          display: f ? f.message : "",
          tooltip: "Navigation Failure",
          value: f
        }
      }, p.status = Xe("❌")) : p.status = Xe("✅"), p.from = Me(d, "Current Location during this navigation"), p.to = Me(l, "Target location"), r.addTimelineEvent({
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
      d.forEach(cr), l.filter && (d = d.filter((f) => (
        // save matches state based on the payload
        Mt(f, l.filter.toLowerCase())
      ))), d.forEach((f) => lr(f, t.currentRoute.value)), l.rootNodes = d.map(ir);
    }
    let u;
    r.on.getInspectorTree((l) => {
      u = l, l.app === e && l.inspectorId === i && c();
    }), r.on.getInspectorState((l) => {
      if (l.app === e && l.inspectorId === i) {
        const f = n.getRoutes().find((p) => p.record.__vd_id === l.nodeId);
        f && (l.state = {
          options: rl(f)
        });
      }
    }), r.sendInspectorTree(i), r.sendInspectorState(i);
  });
}
function ol(e) {
  return e.optional ? e.repeatable ? "*" : "?" : e.repeatable ? "+" : "";
}
function rl(e) {
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
        display: e.keys.map((o) => `${o.name}${ol(o)}`).join(" "),
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
const or = 15485081, rr = 2450411, sr = 8702998, sl = 2282478, ar = 16486972, al = 6710886;
function ir(e) {
  const t = [], { record: n } = e;
  n.name != null && t.push({
    label: String(n.name),
    textColor: 0,
    backgroundColor: sl
  }), n.aliasOf && t.push({
    label: "alias",
    textColor: 0,
    backgroundColor: ar
  }), e.__vd_match && t.push({
    label: "matches",
    textColor: 0,
    backgroundColor: or
  }), e.__vd_exactActive && t.push({
    label: "exact",
    textColor: 0,
    backgroundColor: sr
  }), e.__vd_active && t.push({
    label: "active",
    textColor: 0,
    backgroundColor: rr
  }), n.redirect && t.push({
    label: typeof n.redirect == "string" ? `redirect: ${n.redirect}` : "redirects",
    textColor: 16777215,
    backgroundColor: al
  });
  let o = n.__vd_id;
  return o == null && (o = String(il++), n.__vd_id = o), {
    id: o,
    label: n.path,
    tags: t,
    children: e.children.map(ir)
  };
}
let il = 0;
const ll = /^\/(.*)\/([a-z]*)$/;
function lr(e, t) {
  const n = t.matched.length && ye(t.matched[t.matched.length - 1], e.record);
  e.__vd_exactActive = e.__vd_active = n, n || (e.__vd_active = t.matched.some((o) => ye(o, e.record))), e.children.forEach((o) => lr(o, t));
}
function cr(e) {
  e.__vd_match = !1, e.children.forEach(cr);
}
function Mt(e, t) {
  const n = String(e.re).match(ll);
  if (e.__vd_match = !1, !n || n.length < 3)
    return !1;
  if (new RegExp(n[1].replace(/\$$/, ""), n[2]).test(t))
    return e.children.forEach((a) => Mt(a, t)), e.record.path !== "/" || t === "/" ? (e.__vd_match = e.re.test(t), !0) : !1;
  const r = e.record.path.toLowerCase(), s = ze(r);
  return !t.startsWith("/") && (s.includes(t) || r.includes(t)) || s.startsWith(t) || r.startsWith(t) || e.record.name && String(e.record.name).includes(t) ? !0 : e.children.some((a) => Mt(a, t));
}
function cl(e, t) {
  const n = {};
  for (const o in e)
    t.includes(o) || (n[o] = e[o]);
  return n;
}
function ul(e) {
  const t = Si(e.routes, e), n = e.parseQuery || Gi, o = e.stringifyQuery || Fn, r = e.history;
  if (process.env.NODE_ENV !== "production" && !r)
    throw new Error('Provide the "history" option when calling "createRouter()": https://next.router.vuejs.org/api/#history.');
  const s = Le(), a = Le(), i = Le(), c = _r(he);
  let u = he;
  ie && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
  const l = St.bind(null, (h) => "" + h), d = St.bind(null, Hi), f = (
    // @ts-expect-error: intentionally avoid the type check
    St.bind(null, ze)
  );
  function p(h, w) {
    let g, E;
    return qo(h) ? (g = t.getRecordMatcher(h), E = w) : E = h, t.addRoute(E, g);
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
  function O(h, w) {
    if (w = R({}, w || c.value), typeof h == "string") {
      const P = kt(n, h, w.path), M = t.resolve({ path: P.path }, w), we = r.createHref(P.fullPath);
      return process.env.NODE_ENV !== "production" && (we.startsWith("//") ? N(`Location "${h}" resolved to "${we}". A resolved location cannot start with multiple slashes.`) : M.matched.length || N(`No match found for location with path "${h}"`)), R(P, M, {
        params: f(M.params),
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
        path: kt(n, h.path, w.path).path
      });
    else {
      const P = R({}, h.params);
      for (const M in P)
        P[M] == null && delete P[M];
      g = R({}, h, {
        params: d(h.params)
      }), w.params = d(w.params);
    }
    const E = t.resolve(g, w), C = h.hash || "";
    process.env.NODE_ENV !== "production" && C && !C.startsWith("#") && N(`A \`hash\` should always start with the character "#". Replace "${C}" with "#${C}".`), E.params = l(f(E.params));
    const U = Ja(o, R({}, h, {
      hash: ji(C),
      path: E.path
    })), $ = r.createHref(U);
    return process.env.NODE_ENV !== "production" && ($.startsWith("//") ? N(`Location "${h}" resolved to "${$}". A resolved location cannot start with multiple slashes.`) : E.matched.length || N(`No match found for location with path "${"path" in h ? h.path : h}"`)), R({
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
        o === Fn ? Fi(h.query) : h.query || {}
      )
    }, E, {
      redirectedFrom: void 0,
      href: $
    });
  }
  function I(h) {
    return typeof h == "string" ? kt(n, h, c.value.path) : R({}, h);
  }
  function L(h, w) {
    if (u !== h)
      return De(8, {
        from: w,
        to: h
      });
  }
  function G(h) {
    return k(h);
  }
  function J(h) {
    return G(R(I(h), { replace: !0 }));
  }
  function Y(h) {
    const w = h.matched[h.matched.length - 1];
    if (w && w.redirect) {
      const { redirect: g } = w;
      let E = typeof g == "function" ? g(h) : g;
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
    const g = u = O(h), E = c.value, C = h.state, U = h.force, $ = h.replace === !0, P = Y(g);
    if (P)
      return k(
        R(I(P), {
          state: typeof P == "object" ? R({}, C, P.state) : C,
          force: U,
          replace: $
        }),
        // keep original redirectedFrom if it exists
        w || g
      );
    const M = g;
    M.redirectedFrom = w;
    let we;
    return !U && An(o, E, g) && (we = De(16, { to: M, from: E }), fn(
      E,
      E,
      // this is a push, the only way for it to be triggered from a
      // history.listen is with a redirect, which makes it become a push
      !0,
      // This cannot be the first navigation because the initial location
      // cannot be manually navigated to
      !1
    )), (we ? Promise.resolve(we) : S(M, E)).catch((z) => se(z) ? (
      // navigation redirects still mark the router as ready
      se(
        z,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? z : ht(z)
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
          An(o, O(z.to), M) && // and we have done it a couple of times
          w && // @ts-expect-error: added only in dev
          (w._count = w._count ? (
            // @ts-expect-error
            w._count + 1
          ) : 1) > 10 ? (N(`Detected an infinite redirection in a navigation guard when going from "${E.fullPath}" to "${M.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`), Promise.reject(new Error("Infinite redirect in navigation guard"))) : k(
            // keep options
            R({
              // preserve an existing replacement but allow the redirect to override it
              replace: $
            }, I(z.to), {
              state: typeof z.to == "object" ? R({}, C, z.to.state) : C,
              force: U
            }),
            // preserve the original redirectedFrom if any
            w || M
          );
      } else
        z = D(M, E, !0, $, C);
      return _(M, E, z), z;
    });
  }
  function te(h, w) {
    const g = L(h, w);
    return g ? Promise.reject(g) : Promise.resolve();
  }
  function S(h, w) {
    let g;
    const [E, C, U] = dl(h, w);
    g = Ot(E.reverse(), "beforeRouteLeave", h, w);
    for (const P of E)
      P.leaveGuards.forEach((M) => {
        g.push(me(M, h, w));
      });
    const $ = te.bind(null, h, w);
    return g.push($), Re(g).then(() => {
      g = [];
      for (const P of s.list())
        g.push(me(P, h, w));
      return g.push($), Re(g);
    }).then(() => {
      g = Ot(C, "beforeRouteUpdate", h, w);
      for (const P of C)
        P.updateGuards.forEach((M) => {
          g.push(me(M, h, w));
        });
      return g.push($), Re(g);
    }).then(() => {
      g = [];
      for (const P of h.matched)
        if (P.beforeEnter && !w.matched.includes(P))
          if (K(P.beforeEnter))
            for (const M of P.beforeEnter)
              g.push(me(M, h, w));
          else
            g.push(me(P.beforeEnter, h, w));
      return g.push($), Re(g);
    }).then(() => (h.matched.forEach((P) => P.enterCallbacks = {}), g = Ot(U, "beforeRouteEnter", h, w), g.push($), Re(g))).then(() => {
      g = [];
      for (const P of a.list())
        g.push(me(P, h, w));
      return g.push($), Re(g);
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
    const U = L(h, w);
    if (U)
      return U;
    const $ = w === he, P = ie ? history.state : {};
    g && (E || $ ? r.replace(h.fullPath, R({
      scroll: $ && P && P.scroll
    }, C)) : r.push(h.fullPath, C)), c.value = h, fn(h, w, g, $), ht();
  }
  let B;
  function _e() {
    B || (B = r.listen((h, w, g) => {
      const E = O(h), C = Y(E);
      if (C) {
        k(R(C, { replace: !0 }), E).catch(Ue);
        return;
      }
      u = E;
      const U = c.value;
      ie && ri(Vn(U.fullPath, g.delta), pt()), S(E, U).catch(($) => se(
        $,
        12
        /* ErrorTypes.NAVIGATION_CANCELLED */
      ) ? $ : se(
        $,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? (k(
        $.to,
        E
        // avoid an uncaught rejection, let push call triggerError
      ).then((P) => {
        se(
          P,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && !g.delta && g.type === Qe.pop && r.go(-1, !1);
      }).catch(Ue), Promise.reject()) : (g.delta && r.go(-g.delta, !1), W($, E, U))).then(($) => {
        $ = $ || D(
          // after navigation, all matched components are resolved
          E,
          U,
          !1
        ), $ && (g.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
        // entry while a different route is displayed
        !se(
          $,
          8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        ) ? r.go(-g.delta, !1) : g.type === Qe.pop && se(
          $,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && r.go(-1, !1)), _(E, U, $);
      }).catch(Ue);
    }));
  }
  let Ve = Le(), qe = Le(), ne;
  function W(h, w, g) {
    ht(h);
    const E = qe.list();
    return E.length ? E.forEach((C) => C(h, w, g)) : (process.env.NODE_ENV !== "production" && N("uncaught error during route navigation:"), console.error(h)), Promise.reject(h);
  }
  function gr() {
    return ne && c.value !== he ? Promise.resolve() : new Promise((h, w) => {
      Ve.add([h, w]);
    });
  }
  function ht(h) {
    return ne || (ne = !h, _e(), Ve.list().forEach(([w, g]) => h ? g(h) : w()), Ve.reset()), h;
  }
  function fn(h, w, g, E) {
    const { scrollBehavior: C } = e;
    if (!ie || !C)
      return Promise.resolve();
    const U = !g && si(Vn(h.fullPath, 0)) || (E || !g) && history.state && history.state.scroll || null;
    return Fe().then(() => C(h, w, U)).then(($) => $ && oi($)).catch(($) => W($, h, w));
  }
  const mt = (h) => r.go(h);
  let vt;
  const gt = /* @__PURE__ */ new Set();
  return {
    currentRoute: c,
    listening: !0,
    addRoute: p,
    removeRoute: m,
    hasRoute: y,
    getRoutes: v,
    resolve: O,
    options: e,
    push: G,
    replace: J,
    go: mt,
    back: () => mt(-1),
    forward: () => mt(1),
    beforeEach: s.add,
    beforeResolve: a.add,
    afterEach: i.add,
    onError: qe.add,
    isReady: gr,
    install(h) {
      const w = this;
      h.component("RouterLink", qi), h.component("RouterView", Zi), h.config.globalProperties.$router = w, Object.defineProperty(h.config.globalProperties, "$route", {
        enumerable: !0,
        get: () => b(c)
      }), ie && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !vt && c.value === he && (vt = !0, G(r.location).catch((C) => {
        process.env.NODE_ENV !== "production" && N("Unexpected error when starting the router:", C);
      }));
      const g = {};
      for (const C in he)
        g[C] = j(() => c.value[C]);
      h.provide(an, w), h.provide(nr, ve(g)), h.provide(Lt, c);
      const E = h.unmount;
      gt.add(h), h.unmount = function() {
        gt.delete(h), gt.size < 1 && (u = he, B && B(), B = null, c.value = he, vt = !1, ne = !1), E();
      }, process.env.NODE_ENV !== "production" && ie && nl(h, w, t);
    }
  };
}
function Re(e) {
  return e.reduce((t, n) => t.then(() => n()), Promise.resolve());
}
function dl(e, t) {
  const n = [], o = [], r = [], s = Math.max(t.matched.length, e.matched.length);
  for (let a = 0; a < s; a++) {
    const i = t.matched[a];
    i && (e.matched.find((u) => ye(u, i)) ? o.push(i) : n.push(i));
    const c = e.matched[a];
    c && (t.matched.find((u) => ye(u, c)) || r.push(c));
  }
  return [n, o, r];
}
ul({
  history: ci(),
  routes: []
});
const fl = /* @__PURE__ */ q({
  __name: "Doctype",
  setup(e) {
    const { stonecrop: t, isReady: n } = go(), o = V([]);
    return de(n, () => {
      if (n.value) {
        let r = t.schema.schema.toArray();
        r.forEach((s, a) => {
          const c = t.store.record[s.fieldname];
          r[a].value = c;
        }), o.value = r;
      }
    }), (r, s) => b(n) ? (x(), ke(b(Yr), {
      key: 0,
      class: "aform-main",
      modelValue: o.value,
      "onUpdate:modelValue": s[0] || (s[0] = (a) => o.value = a)
    }, null, 8, ["modelValue"])) : Se("", !0);
  }
});
var Jn;
const ur = typeof window < "u", pl = (e) => typeof e == "string", hl = () => {
};
ur && (Jn = window == null ? void 0 : window.navigator) != null && Jn.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function dr(e) {
  return typeof e == "function" ? e() : b(e);
}
function ml(e) {
  return e;
}
function vl(e) {
  return fo() ? (po(e), !0) : !1;
}
function jt(e) {
  var t;
  const n = dr(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const fr = ur ? window : void 0;
function gl(...e) {
  let t, n, o, r;
  if (pl(e[0]) || Array.isArray(e[0]) ? ([n, o, r] = e, t = fr) : [t, n, o, r] = e, !t)
    return hl;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const s = [], a = () => {
    s.forEach((l) => l()), s.length = 0;
  }, i = (l, d, f, p) => (l.addEventListener(d, f, p), () => l.removeEventListener(d, f, p)), c = de(() => [jt(t), dr(r)], ([l, d]) => {
    a(), l && s.push(...n.flatMap((f) => o.map((p) => i(l, f, p, d))));
  }, { immediate: !0, flush: "post" }), u = () => {
    c(), a();
  };
  return vl(u), u;
}
const Bt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Ut = "__vueuse_ssr_handlers__";
Bt[Ut] = Bt[Ut] || {};
Bt[Ut];
function yl(e, { window: t = fr, scrollTarget: n } = {}) {
  const o = V(!1), r = () => {
    if (!t)
      return;
    const s = t.document, a = jt(e);
    if (!a)
      o.value = !1;
    else {
      const i = a.getBoundingClientRect();
      o.value = i.top <= (t.innerHeight || s.documentElement.clientHeight) && i.left <= (t.innerWidth || s.documentElement.clientWidth) && i.bottom >= 0 && i.right >= 0;
    }
  };
  return de(() => jt(e), () => r(), { immediate: !0, flush: "post" }), t && gl(n || t, "scroll", r, {
    capture: !1,
    passive: !0
  }), o;
}
var Yn;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(Yn || (Yn = {}));
var _l = Object.defineProperty, Xn = Object.getOwnPropertySymbols, wl = Object.prototype.hasOwnProperty, bl = Object.prototype.propertyIsEnumerable, Zn = (e, t, n) => t in e ? _l(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, El = (e, t) => {
  for (var n in t || (t = {}))
    wl.call(t, n) && Zn(e, n, t[n]);
  if (Xn)
    for (var n of Xn(t))
      bl.call(t, n) && Zn(e, n, t[n]);
  return e;
};
const Sl = {
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
El({
  linear: ml
}, Sl);
const fe = (e) => {
  let t = yl(e).value;
  return t = t && e.offsetHeight > 0, t;
}, pe = (e) => e.tabIndex >= 0, eo = (e) => {
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
}, kl = (e) => {
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
}, to = (e) => {
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
}, Ol = (e) => {
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
}, no = (e) => {
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
}, oo = (e) => {
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
}, ro = (e) => {
  const t = e.target.parentElement.firstElementChild;
  return t && (!pe(t) || !fe(t)) ? dn(t) : t;
}, so = (e) => {
  const t = e.target.parentElement.lastElementChild;
  return t && (!pe(t) || !fe(t)) ? un(t) : t;
}, Ze = ["alt", "control", "shift", "meta"], Il = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, pr = {
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
    const t = kl(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = Ol(e);
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
        for (const a of o.selectors.value)
          a instanceof Element ? s.push(a) : s.push(a.$el);
      else
        s.push(o.selectors.value);
    else
      s = Array.from(r.children).filter((a) => pe(a) && fe(a));
    return s;
  }, n = (o) => (r) => {
    const s = Il[r.key] || r.key.toLowerCase();
    if (Ze.includes(s))
      return;
    const a = o.handlers || pr;
    for (const i of Object.keys(a)) {
      const [c, ...u] = i.split(".");
      if (c === "keydown" && u.includes(s)) {
        const l = a[i], d = u.filter((p) => Ze.includes(p)), f = Ze.some((p) => {
          const m = p.charAt(0).toUpperCase() + p.slice(1);
          return r.getModifierState(m);
        });
        if (d.length > 0) {
          if (f) {
            for (const p of Ze)
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
  Ht(() => {
    for (const o of e) {
      const r = t(o);
      for (const s of r)
        s.addEventListener("keydown", n(o));
    }
  }), br(() => {
    for (const o of e) {
      const r = t(o);
      for (const s of r)
        s.removeEventListener("keydown", n(o));
    }
  });
}
const Pl = ["data-colindex", "data-rowindex", "data-editable", "contenteditable", "tabindex"], xl = { key: 1 }, $l = /* @__PURE__ */ q({
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
        o.modal.visible = !0, o.modal.colIndex = n.colIndex, o.modal.rowIndex = n.rowIndex, o.modal.parent = r.value, o.modal.top = y.top + y.height, o.modal.left = y.left, o.modal.width = u.value, o.modal.component = o.columns[n.colIndex].modalComponent, o.modal.componentProps = o.columns[n.colIndex].modalComponentProps;
      }
    };
    if (n.addNavigation) {
      let v = {
        ...pr,
        "keydown.f2": i,
        "keydown.alt.up": i,
        "keydown.alt.down": i,
        "keydown.alt.left": i,
        "keydown.alt.right": i
      };
      typeof n.addNavigation == "object" && (v = {
        ...v,
        ...n.addNavigation
      }), hr([
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
    }, p = (v, y) => y && v === 0 && y > 0 ? `${y}ch` : "inherit", m = {
      textAlign: c.value,
      width: u.value,
      backgroundColor: s.value ? "var(--cell-modified-color)" : "inherit",
      fontWeight: s.value ? "bold" : "inherit",
      paddingLeft: p(n.colIndex, (t = o.display[n.rowIndex]) == null ? void 0 : t.indent)
    };
    return (v, y) => (x(), T("td", {
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
      b(o).columns[e.colIndex].cellComponent ? (x(), ke(Ft(b(o).columns[e.colIndex].cellComponent), Wt({
        key: 0,
        value: b(a)
      }, b(o).columns[e.colIndex].cellComponentProps), null, 16, ["value"])) : (x(), T("span", xl, ce(b(a)), 1))
    ], 40, Pl));
  }
}), Ke = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, Nl = /* @__PURE__ */ Ke($l, [["__scopeId", "data-v-1738c6fc"]]), Cl = ["tabindex"], Rl = {
  key: 0,
  tabIndex: -1,
  class: "list-index"
}, Tl = /* @__PURE__ */ q({
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
    mo((c) => ({
      "6b10edcf": b(r)
    }));
    const n = Z(t.tableid), o = V(null), r = n.numberedRowWidth.value, s = () => n.config.view !== "tree" ? "" : n.display[t.rowIndex].isRoot || n.display[t.rowIndex].isParent ? n.display[t.rowIndex].childrenOpen ? "-" : "+" : "", a = () => n.config.view !== "tree" || n.display[t.rowIndex].isRoot || n.display[t.rowIndex].open, i = (c) => {
      n.toggleRowExpand(c);
    };
    return t.addNavigation && hr([
      {
        selectors: o,
        handlers: t.addNavigation
      }
    ]), (c, u) => lt((x(), T("tr", {
      ref_key: "rowEl",
      ref: o,
      tabindex: e.tabIndex,
      class: "table-row"
    }, [
      b(n).config.view === "list" ? (x(), T("td", Rl, ce(e.rowIndex + 1), 1)) : b(n).config.view === "tree" ? (x(), T("td", {
        key: 1,
        tabIndex: -1,
        class: "tree-index",
        onClick: u[0] || (u[0] = (l) => i(e.rowIndex))
      }, ce(s()), 1)) : ge(c.$slots, "indexCell", { key: 2 }, void 0, !0),
      ge(c.$slots, "default", {}, void 0, !0)
    ], 8, Cl)), [
      [Gt, a()]
    ]);
  }
}), Al = /* @__PURE__ */ Ke(Tl, [["__scopeId", "data-v-c758303d"]]);
let et;
const Dl = new Uint8Array(16);
function Vl() {
  if (!et && (et = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !et))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return et(Dl);
}
const F = [];
for (let e = 0; e < 256; ++e)
  F.push((e + 256).toString(16).slice(1));
function Ll(e, t = 0) {
  return (F[e[t + 0]] + F[e[t + 1]] + F[e[t + 2]] + F[e[t + 3]] + "-" + F[e[t + 4]] + F[e[t + 5]] + "-" + F[e[t + 6]] + F[e[t + 7]] + "-" + F[e[t + 8]] + F[e[t + 9]] + "-" + F[e[t + 10]] + F[e[t + 11]] + F[e[t + 12]] + F[e[t + 13]] + F[e[t + 14]] + F[e[t + 15]]).toLowerCase();
}
const Ml = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), ao = {
  randomUUID: Ml
};
function mr(e, t, n) {
  if (ao.randomUUID && !t && !e)
    return ao.randomUUID();
  e = e || {};
  const o = e.random || (e.rng || Vl)();
  if (o[6] = o[6] & 15 | 64, o[8] = o[8] & 63 | 128, t) {
    n = n || 0;
    for (let r = 0; r < 16; ++r)
      t[n + r] = o[r];
    return t;
  }
  return Ll(o);
}
class jl {
  constructor(t, n, o, r, s, a) {
    this.id = t || mr(), this.rows = o, this.columns = ve(n), this.config = ve(r), this.table = s || ve(this.createTableObject()), this.display = this.createDisplayObject(a), this.modal = ve({ visible: !1 });
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
const Bl = { key: 0 }, Ul = {
  class: "atable-header-row",
  tabindex: "-1"
}, Hl = {
  key: 0,
  id: "header-index"
}, Gl = /* @__PURE__ */ q({
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
    return (s, a) => e.columns.length ? (x(), T("thead", Bl, [
      A("tr", Ul, [
        b(n).zeroColumn ? (x(), T("th", Hl)) : Se("", !0),
        (x(!0), T(Ie, null, Pe(e.columns, (i, c) => (x(), T("th", {
          key: c,
          tabindex: "-1",
          style: le(r(i))
        }, [
          ge(s.$slots, "default", {}, () => [
            vo(ce(i.label || String.fromCharCode(c + 97).toUpperCase()), 1)
          ], !0)
        ], 4))), 128))
      ])
    ])) : Se("", !0);
  }
}), Fl = /* @__PURE__ */ Ke(Gl, [["__scopeId", "data-v-8a8d9cee"]]), Wl = /* @__PURE__ */ q({
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
    return (n, o) => (x(), T("div", {
      ref: "amodal",
      class: "amodal",
      tabindex: "-1",
      onClick: t,
      onInput: t
    }, [
      ge(n.$slots, "default", {}, void 0, !0)
    ], 544));
  }
}), Ql = /* @__PURE__ */ Ke(Wl, [["__scopeId", "data-v-8ac70767"]]), zl = /* @__PURE__ */ q({
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
    let o = n.modelValue ? n.modelValue : n.rows, r = new jl(n.id, n.columns, o, n.config);
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
          const c = i.dataset.rowindex, u = i.dataset.colindex, l = document.querySelectorAll(`[data-rowindex='${c}'][data-colindex='${u}']`);
          l && l[0].focus();
        });
      }
    }), (a, i) => (x(), T("table", {
      class: "atable",
      style: le({ width: b(r).config.fullWidth ? "100%" : "auto" })
    }, [
      ge(a.$slots, "header", { data: b(r) }, () => [
        st(Fl, {
          columns: b(r).columns,
          config: b(r).config,
          tableid: b(r).id
        }, null, 8, ["columns", "config", "tableid"])
      ], !0),
      A("tbody", null, [
        ge(a.$slots, "body", { data: b(r) }, () => [
          (x(!0), T(Ie, null, Pe(b(r).rows, (c, u) => (x(), ke(Al, {
            key: c.id || b(mr)(),
            row: c,
            rowIndex: u,
            tableid: b(r).id
          }, {
            default: at(() => [
              (x(!0), T(Ie, null, Pe(b(r).columns, (l, d) => (x(), ke(Nl, {
                key: `${d}:${u}`,
                tableid: b(r).id,
                col: l,
                spellcheck: "false",
                rowIndex: u,
                colIndex: d + (b(r).zeroColumn ? 0 : -1),
                component: l.cellComponent,
                style: le({
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
        lt(st(Ql, {
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
            (x(), ke(Ft(b(r).modal.component), Wt({
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
}), Kl = /* @__PURE__ */ Ke(zl, [["__scopeId", "data-v-9137b4c3"]]), ql = /* @__PURE__ */ q({
  __name: "Records",
  setup(e) {
    const { stonecrop: t, isReady: n } = go(), o = { view: "list" };
    return (r, s) => b(n) ? (x(), ke(b(Kl), {
      key: 0,
      columns: b(t).schema.schema.toArray(),
      rows: b(t).store.records,
      config: o
    }, null, 8, ["columns", "rows"])) : Se("", !0);
  }
}), vr = (e) => (lo("data-v-18bfde6e"), e = e(), co(), e), Jl = { class: "tabs" }, Yl = ["onKeydown"], Xl = { tabindex: "0" }, Zl = ["onKeydown"], ec = {
  version: "1.1",
  id: "Capa_1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  x: "0px",
  y: "0px",
  viewBox: "0 0 424.098 424.098",
  style: { "enable-background": "new 0 0 424.098 424.098" },
  "xml:space": "preserve"
}, tc = /* @__PURE__ */ vr(() => /* @__PURE__ */ A("g", null, [
  /* @__PURE__ */ A("path", {
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
], -1)), nc = [
  tc
], oc = ["onKeydown"], rc = { tabindex: "0" }, sc = { style: { width: "11pt" } }, ac = /* @__PURE__ */ vr(() => /* @__PURE__ */ A("g", { transform: "matrix(-0.08088215,0,0,0.08088215,9.8016177,3.1263021e-6)" }, [
  /* @__PURE__ */ A("path", {
    d: "M 93.148438,80.832031 C 109.5,57.742188 104.03125,25.769531 80.941406,9.421875 57.851562,-6.925781 25.878906,-1.460938 9.53125,21.632812 -6.816406,44.722656 -1.351562,76.691406 21.742188,93.039062 38.222656,104.70703 60.011719,105.60547 77.394531,95.339844 l 37.769529,37.542966 c 4.07813,4.29297 10.86328,4.46485 15.15625,0.38672 4.29297,-4.07422 4.46485,-10.85937 0.39063,-15.15234 -0.12891,-0.13672 -0.25391,-0.26172 -0.39063,-0.39063 z m -41.839844,3.5 C 33.0625,84.335938 18.269531,69.554688 18.257812,51.308594 18.253906,33.0625 33.035156,18.269531 51.285156,18.261719 c 18.222656,-0.0078 33.007813,14.75 33.042969,32.972656 0.03125,18.25 -14.742187,33.066406 -32.996094,33.097656 -0.0078,0 -0.01172,0 -0.02344,0 z m 0,0",
    style: { fill: "#000000", "fill-opacity": "1", "fill-rule": "nonzero", stroke: "none" },
    id: "path2"
  })
], -1)), ic = [
  ac
], lc = /* @__PURE__ */ q({
  __name: "SheetNav",
  props: {
    breadcrumbs: null
  },
  setup(e) {
    const t = e, n = V([]), o = V(!0), r = V(!1), s = V(""), a = V(null), i = j(() => o.value ? "unrotated" : "rotated");
    Ht(() => {
      n.value = t.breadcrumbs || [];
    });
    const c = () => {
      o.value = !o.value;
    }, u = async () => {
      r.value = !r.value, await Fe(() => {
        a.value.focus();
      });
    }, l = (p) => {
      p.preventDefault(), p.stopPropagation();
    }, d = async (p) => {
      p.preventDefault(), p.stopPropagation(), await u();
    }, f = () => {
    };
    return (p, m) => {
      const v = Er("router-link");
      return x(), T("footer", null, [
        A("ul", Jl, [
          A("li", {
            class: "hidebreadcrumbs",
            onClick: c,
            onKeydown: Je(c, ["enter"])
          }, [
            A("a", Xl, [
              A("div", {
                class: io(b(i))
              }, "×", 2)
            ])
          ], 40, Yl),
          A("li", {
            class: "hometab",
            onClick: f,
            onKeydown: Je(f, ["enter"]),
            style: le({ display: o.value ? "block" : "none" })
          }, [
            st(v, {
              to: "/home",
              tabindex: "0"
            }, {
              default: at(() => [
                (x(), T("svg", ec, nc))
              ]),
              _: 1
            })
          ], 44, Zl),
          A("li", {
            class: "searchtab",
            onClick: u,
            onKeydown: Je(u, ["enter"]),
            style: le({ display: o.value ? "block" : "none" })
          }, [
            A("a", rc, [
              A("span", {
                style: le({ display: r.value ? "none" : "block" })
              }, [
                (x(), T("svg", sc, ic))
              ], 4),
              lt(A("input", {
                "onUpdate:modelValue": m[0] || (m[0] = (y) => s.value = y),
                ref_key: "searchinput",
                ref: a,
                style: le({ display: r.value ? "block" : "none" }),
                onClick: m[1] || (m[1] = (y) => l(y)),
                onInput: m[2] || (m[2] = (y) => l(y)),
                onBlur: m[3] || (m[3] = (y) => d(y)),
                onKeydown: m[4] || (m[4] = Je((y) => d(y), ["enter"])),
                type: "text"
              }, null, 36), [
                [Sr, s.value]
              ])
            ])
          ], 44, oc),
          (x(!0), T(Ie, null, Pe(n.value, (y, O) => (x(), T("li", {
            key: O,
            style: le({ display: o.value ? "block" : "none" })
          }, [
            st(v, {
              tabindex: "0",
              to: y.to
            }, {
              default: at(() => [
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
const cc = /* @__PURE__ */ qt(lc, [["__scopeId", "data-v-18bfde6e"]]), pc = {
  install: (e) => {
    e.component("ActionSet", Mr), e.component("CommandPalette", Ur), e.component("Doctype", fl), e.component("Records", ql), e.component("SheetNav", cc);
  }
};
export {
  Mr as ActionSet,
  Ur as CommandPalette,
  fl as Doctype,
  ql as Records,
  cc as SheetNav,
  pc as StonecropDesktop
};
//# sourceMappingURL=desktop.js.map
