import { defineComponent as se, createPropsRestProxy as Fo, toRef as N, ref as W, computed as K, onMounted as be, openBlock as j, createElementBlock as q, unref as I, normalizeClass as Ie, renderSlot as _e, provide as Ke, h as ae, createBlock as ve, Teleport as ol, getCurrentScope as Zo, inject as qe, onUnmounted as al, useSlots as ll, createVNode as Ne, withCtx as Te, Fragment as ke, renderList as Qe, onScopeDispose as Ot, getCurrentInstance as bt, watch as re, onBeforeMount as rl, effectScope as Dt, watchEffect as Uo, customRef as Wo, onUpdated as il, reactive as ul, toRefs as sl, nextTick as ge, createCommentVNode as de, mergeProps as ht, normalizeStyle as Se, createElementVNode as ue, onBeforeUnmount as wt, resolveDynamicComponent as Mn, normalizeProps as cl, resolveComponent as Go, markRaw as Ue, isRef as Ko, createTextVNode as qo, toDisplayString as Wt, withDirectives as Qo, withKeys as Jo, vModelText as ea, withModifiers as dl } from "vue";
var hl = Object.defineProperty, vl = (e, t, n) => t in e ? hl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, pn = (e, t, n) => (vl(e, typeof t != "symbol" ? t + "" : t, n), n), Gn;
const ta = typeof window < "u", fl = (e) => typeof e < "u", pl = (e) => typeof e == "boolean", Ae = (e) => typeof e == "function", gl = (e) => typeof e == "number", Gt = (e) => typeof e == "string", ml = () => {
};
ta && ((Gn = window == null ? void 0 : window.navigator) != null && Gn.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function Ze(e) {
  return typeof e == "function" ? e() : I(e);
}
function yl(e, t) {
  function n(...o) {
    e(() => t.apply(this, o), { fn: t, thisArg: this, args: o });
  }
  return n;
}
const na = (e) => e();
function bl(e = na) {
  const t = W(!0);
  function n() {
    t.value = !1;
  }
  function o() {
    t.value = !0;
  }
  return { isActive: t, pause: n, resume: o, eventFilter: (...a) => {
    t.value && e(...a);
  } };
}
function Kn(e, t = !1, n = "Timeout") {
  return new Promise((o, a) => {
    setTimeout(t ? () => a(n) : o, e);
  });
}
function wl(e) {
  return e;
}
function qn(e, t) {
  let n, o, a;
  const l = W(!0), r = () => {
    l.value = !0, a();
  };
  re(e, r, { flush: "sync" });
  const i = Ae(t) ? t : t.get, u = Ae(t) ? void 0 : t.set, s = Wo((c, d) => (o = c, a = d, {
    get() {
      return l.value && (n = i(), l.value = !1), o(), n;
    },
    set(h) {
      u == null || u(h);
    }
  }));
  return Object.isExtensible(s) && (s.trigger = r), s;
}
function H() {
  const e = [], t = (n) => {
    const o = e.indexOf(n);
    o !== -1 && e.splice(o, 1);
  };
  return {
    on: (n) => (e.push(n), {
      off: () => t(n)
    }),
    off: t,
    trigger: (n) => {
      e.forEach((o) => o(n));
    }
  };
}
function xt(e) {
  return Zo() ? (Ot(e), !0) : !1;
}
function oa(e, t = !0) {
  bt() ? be(e) : t ? e() : ge(e);
}
function gn(e, t = !1) {
  function n(d, { flush: h = "sync", deep: f = !1, timeout: w, throwOnTimeout: k } = {}) {
    let E = null;
    const g = [new Promise((b) => {
      E = re(e, (B) => {
        d(B) !== t && (E == null || E(), b(B));
      }, {
        flush: h,
        deep: f,
        immediate: !0
      });
    })];
    return w != null && g.push(Kn(w, k).then(() => Ze(e)).finally(() => E == null ? void 0 : E())), Promise.race(g);
  }
  function o(d, h) {
    if (!Ko(d))
      return n((B) => B === d, h);
    const { flush: f = "sync", deep: w = !1, timeout: k, throwOnTimeout: E } = h ?? {};
    let g = null;
    const b = [new Promise((B) => {
      g = re([e, d], ([y, $]) => {
        t !== (y === $) && (g == null || g(), B(y));
      }, {
        flush: f,
        deep: w,
        immediate: !0
      });
    })];
    return k != null && b.push(Kn(k, E).then(() => Ze(e)).finally(() => (g == null || g(), Ze(e)))), Promise.race(b);
  }
  function a(d) {
    return n((h) => !!h, d);
  }
  function l(d) {
    return o(null, d);
  }
  function r(d) {
    return o(void 0, d);
  }
  function i(d) {
    return n(Number.isNaN, d);
  }
  function u(d, h) {
    return n((f) => {
      const w = Array.from(f);
      return w.includes(d) || w.includes(Ze(d));
    }, h);
  }
  function s(d) {
    return c(1, d);
  }
  function c(d = 1, h) {
    let f = -1;
    return n(() => (f += 1, f >= d), h);
  }
  return Array.isArray(Ze(e)) ? {
    toMatch: n,
    toContains: u,
    changed: s,
    changedTimes: c,
    get not() {
      return gn(e, !t);
    }
  } : {
    toMatch: n,
    toBe: o,
    toBeTruthy: a,
    toBeNull: l,
    toBeNaN: i,
    toBeUndefined: r,
    changed: s,
    changedTimes: c,
    get not() {
      return gn(e, !t);
    }
  };
}
function Je(e) {
  return gn(e);
}
var Qn = Object.getOwnPropertySymbols, xl = Object.prototype.hasOwnProperty, _l = Object.prototype.propertyIsEnumerable, kl = (e, t) => {
  var n = {};
  for (var o in e)
    xl.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && Qn)
    for (var o of Qn(e))
      t.indexOf(o) < 0 && _l.call(e, o) && (n[o] = e[o]);
  return n;
};
function El(e, t, n = {}) {
  const o = n, {
    eventFilter: a = na
  } = o, l = kl(o, [
    "eventFilter"
  ]);
  return re(e, yl(a, t), l);
}
var Nl = Object.defineProperty, Sl = Object.defineProperties, Ml = Object.getOwnPropertyDescriptors, Lt = Object.getOwnPropertySymbols, aa = Object.prototype.hasOwnProperty, la = Object.prototype.propertyIsEnumerable, Jn = (e, t, n) => t in e ? Nl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Cl = (e, t) => {
  for (var n in t || (t = {}))
    aa.call(t, n) && Jn(e, n, t[n]);
  if (Lt)
    for (var n of Lt(t))
      la.call(t, n) && Jn(e, n, t[n]);
  return e;
}, Pl = (e, t) => Sl(e, Ml(t)), $l = (e, t) => {
  var n = {};
  for (var o in e)
    aa.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && Lt)
    for (var o of Lt(e))
      t.indexOf(o) < 0 && la.call(e, o) && (n[o] = e[o]);
  return n;
};
function je(e, t, n = {}) {
  const o = n, {
    eventFilter: a
  } = o, l = $l(o, [
    "eventFilter"
  ]), { eventFilter: r, pause: i, resume: u, isActive: s } = bl(a);
  return { stop: El(e, t, Pl(Cl({}, l), {
    eventFilter: r
  })), pause: i, resume: u, isActive: s };
}
function ra(e) {
  var t;
  const n = Ze(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const Cn = ta ? window : void 0;
function Pn(...e) {
  let t, n, o, a;
  if (Gt(e[0]) || Array.isArray(e[0]) ? ([n, o, a] = e, t = Cn) : [t, n, o, a] = e, !t)
    return ml;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const l = [], r = () => {
    l.forEach((c) => c()), l.length = 0;
  }, i = (c, d, h) => (c.addEventListener(d, h, a), () => c.removeEventListener(d, h, a)), u = re(() => ra(t), (c) => {
    r(), c && l.push(...n.flatMap((d) => o.map((h) => i(c, d, h))));
  }, { immediate: !0, flush: "post" }), s = () => {
    u(), r();
  };
  return xt(s), s;
}
const zl = (e) => typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
function eo(...e) {
  let t, n, o = {};
  e.length === 3 ? (t = e[0], n = e[1], o = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], o = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
  const { target: a = Cn, eventName: l = "keydown", passive: r = !1 } = o, i = zl(t);
  return Pn(a, l, (u) => {
    i(u) && n(u);
  }, r);
}
function Bl(e, t = null) {
  const n = bt();
  let o = () => {
  };
  const a = Wo((l, r) => (o = r, {
    get() {
      var i, u;
      return l(), (u = (i = n == null ? void 0 : n.proxy) == null ? void 0 : i.$refs[e]) != null ? u : t;
    },
    set() {
    }
  }));
  return oa(o), il(o), a;
}
function Tl(e, t = !1) {
  const n = W(), o = () => n.value = !!e();
  return o(), oa(o, t), n;
}
function Ol(e) {
  return JSON.parse(JSON.stringify(e));
}
const to = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, no = "__vueuse_ssr_handlers__";
to[no] = to[no] || {};
var oo = Object.getOwnPropertySymbols, Il = Object.prototype.hasOwnProperty, Al = Object.prototype.propertyIsEnumerable, Vl = (e, t) => {
  var n = {};
  for (var o in e)
    Il.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && oo)
    for (var o of oo(e))
      t.indexOf(o) < 0 && Al.call(e, o) && (n[o] = e[o]);
  return n;
};
function Xl(e, t, n = {}) {
  const o = n, { window: a = Cn } = o, l = Vl(o, ["window"]);
  let r;
  const i = Tl(() => a && "ResizeObserver" in a), u = () => {
    r && (r.disconnect(), r = void 0);
  }, s = re(() => ra(e), (d) => {
    u(), i.value && a && d && (r = new ResizeObserver(t), r.observe(d, l));
  }, { immediate: !0, flush: "post" }), c = () => {
    u(), s();
  };
  return xt(c), {
    isSupported: i,
    stop: c
  };
}
var ao;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(ao || (ao = {}));
var Dl = Object.defineProperty, lo = Object.getOwnPropertySymbols, Ll = Object.prototype.hasOwnProperty, Rl = Object.prototype.propertyIsEnumerable, ro = (e, t, n) => t in e ? Dl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Hl = (e, t) => {
  for (var n in t || (t = {}))
    Ll.call(t, n) && ro(e, n, t[n]);
  if (lo)
    for (var n of lo(t))
      Rl.call(t, n) && ro(e, n, t[n]);
  return e;
};
const Yl = {
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
Hl({
  linear: wl
}, Yl);
function ct(e, t, n, o = {}) {
  var a, l, r;
  const {
    clone: i = !1,
    passive: u = !1,
    eventName: s,
    deep: c = !1,
    defaultValue: d
  } = o, h = bt(), f = n || (h == null ? void 0 : h.emit) || ((a = h == null ? void 0 : h.$emit) == null ? void 0 : a.bind(h)) || ((r = (l = h == null ? void 0 : h.proxy) == null ? void 0 : l.$emit) == null ? void 0 : r.bind(h == null ? void 0 : h.proxy));
  let w = s;
  t || (t = "modelValue"), w = s || w || `update:${t.toString()}`;
  const k = (g) => i ? Ae(i) ? i(g) : Ol(g) : g, E = () => fl(e[t]) ? k(e[t]) : d;
  if (u) {
    const g = E(), b = W(g);
    return re(() => e[t], (B) => b.value = k(B)), re(b, (B) => {
      (B !== e[t] || c) && f(w, B);
    }, { deep: c }), b;
  } else
    return K({
      get() {
        return E();
      },
      set(g) {
        f(w, g);
      }
    });
}
const jl = () => ({
  edgesChange: H(),
  nodesChange: H(),
  nodeDoubleClick: H(),
  nodeClick: H(),
  nodeMouseEnter: H(),
  nodeMouseMove: H(),
  nodeMouseLeave: H(),
  nodeContextMenu: H(),
  nodeDragStart: H(),
  nodeDrag: H(),
  nodeDragStop: H(),
  nodesInitialized: H(),
  miniMapNodeClick: H(),
  miniMapNodeDoubleClick: H(),
  miniMapNodeMouseEnter: H(),
  miniMapNodeMouseMove: H(),
  miniMapNodeMouseLeave: H(),
  connect: H(),
  connectStart: H(),
  connectEnd: H(),
  paneReady: H(),
  move: H(),
  moveStart: H(),
  moveEnd: H(),
  selectionDragStart: H(),
  selectionDrag: H(),
  selectionDragStop: H(),
  selectionContextMenu: H(),
  paneScroll: H(),
  paneClick: H(),
  paneContextMenu: H(),
  paneMouseEnter: H(),
  paneMouseMove: H(),
  paneMouseLeave: H(),
  edgeContextMenu: H(),
  edgeMouseEnter: H(),
  edgeMouseMove: H(),
  edgeMouseLeave: H(),
  edgeDoubleClick: H(),
  edgeClick: H(),
  edgeUpdateStart: H(),
  edgeUpdate: H(),
  edgeUpdateEnd: H(),
  updateNodeInternals: H()
});
function Fl(e, t) {
  rl(() => {
    for (const [n, o] of Object.entries(t.value)) {
      const a = (l) => {
        e(n, l);
      };
      o.on(a), xt(() => {
        o.off(a);
      });
    }
  });
}
const Zl = ["production", "prod"], pe = (e, ...t) => {
  Zl.includes(process.env.NODE_ENV || "") || console.warn(`[Vue Flow]: ${e}`, ...t);
}, _t = () => typeof window < "u" ? window : { chrome: !1 }, io = (e) => ({
  ...e.computedPosition || { x: 0, y: 0 },
  width: e.dimensions.width || 0,
  height: e.dimensions.height || 0
}), mn = (e, t) => {
  const n = Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)), o = Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y));
  return Math.ceil(n * o);
}, vt = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), yn = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), $n = (e, t) => ({
  x: yn(e.x, t[0][0], t[1][0]),
  y: yn(e.y, t[0][1], t[1][1])
}), an = (e) => {
  const t = e.getRootNode(), n = _t();
  return "elementFromPoint" in t ? t : n.document;
}, kt = (e) => e && "id" in e && "source" in e && "target" in e, zn = (e) => kt(e) && "sourceNode" in e && "targetNode" in e, ia = (e) => e && "id" in e && !kt(e), Oe = (e) => ia(e) && "computedPosition" in e, Ul = (e) => !!e.width && !!e.height && !!e.x && !!e.y, Wl = (e, t, n) => {
  var o;
  let a = n;
  return Oe(e) || (a = {
    type: (o = e.type) != null ? o : "default",
    dimensions: Ue({
      width: 0,
      height: 0
    }),
    handleBounds: {
      source: [],
      target: []
    },
    computedPosition: Ue({
      z: 0,
      ...e.position
    }),
    draggable: void 0,
    selectable: void 0,
    connectable: void 0,
    ...n,
    data: le(e.data) ? e.data : {},
    events: Ue(le(e.events) ? e.events : {})
  }), {
    ...a,
    ...e,
    id: e.id.toString()
  };
}, ua = (e, t) => {
  var n, o, a, l;
  const r = le(e.events) ? e.events : t != null && t.events && le(t == null ? void 0 : t.events) ? t == null ? void 0 : t.events : {}, i = le(e.data) ? e.data : t != null && t.data && le(t == null ? void 0 : t.data) ? t == null ? void 0 : t.data : {};
  return t = zn(e) ? t : {
    ...t,
    sourceHandle: (e.sourceHandle ? e.sourceHandle.toString() : void 0) || (t == null ? void 0 : t.sourceHandle),
    targetHandle: (e.targetHandle ? e.targetHandle.toString() : void 0) || (t == null ? void 0 : t.targetHandle),
    type: (o = (n = e.type) != null ? n : t == null ? void 0 : t.type) != null ? o : "default",
    source: e.source.toString() || (t == null ? void 0 : t.source),
    target: e.target.toString() || (t == null ? void 0 : t.target),
    z: t == null ? void 0 : t.z,
    sourceX: t == null ? void 0 : t.sourceX,
    sourceY: t == null ? void 0 : t.sourceY,
    targetX: t == null ? void 0 : t.targetX,
    targetY: t == null ? void 0 : t.targetY,
    updatable: (a = e.updatable) != null ? a : t == null ? void 0 : t.updatable,
    selectable: (l = e.selectable) != null ? l : t == null ? void 0 : t.selectable,
    data: i,
    events: Ue(r),
    label: (e.label && !Gt(e.label) ? Ue(e.label) : e.label) || (t == null ? void 0 : t.label),
    interactionWidth: e.interactionWidth || (t == null ? void 0 : t.interactionWidth)
  }, Object.assign({ id: e.id.toString() }, e, t);
}, sa = ({ source: e, sourceHandle: t, target: n, targetHandle: o }) => `vueflow__edge-${e}${t ?? ""}-${n}${o ?? ""}`, ca = (e, t) => t.some(
  (n) => kt(n) && n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)
), Bn = ({ x: e, y: t }, { x: n, y: o, zoom: a }, l, [r, i]) => {
  const u = {
    x: (e - n) / a,
    y: (t - o) / a
  };
  return l ? {
    x: r * Math.round(u.x / r),
    y: i * Math.round(u.y / i)
  } : u;
}, Gl = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), da = ({ x: e, y: t, width: n, height: o }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + o
}), Kl = ({ x: e, y: t, x2: n, y2: o }) => ({
  x: e,
  y: t,
  width: n - e,
  height: o - t
}), ha = (e) => {
  const t = e.reduce(
    (n, { computedPosition: o = { x: 0, y: 0 }, dimensions: a = { width: 0, height: 0 } } = {}) => Gl(
      n,
      da({
        ...o,
        ...a
      })
    ),
    { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }
  );
  return Kl(t);
}, va = (e, t, { x: n, y: o, zoom: a } = { x: 0, y: 0, zoom: 1 }, l = !1, r = !1) => {
  const i = {
    x: (t.x - n) / a,
    y: (t.y - o) / a,
    width: t.width / a,
    height: t.height / a
  };
  return e.filter((u) => {
    const { computedPosition: s = { x: 0, y: 0 }, dimensions: c = { width: 0, height: 0 }, selectable: d } = u;
    if (r && !d)
      return !1;
    const h = { ...s, width: c.width || 0, height: c.height || 0 }, f = mn(i, h), w = typeof c.width > "u" || typeof c.height > "u" || c.width === 0 || c.height === 0, k = l && f > 0, E = c.width * c.height;
    return w || k || f >= E;
  });
}, Kt = (e, t) => {
  const n = e.map((o) => o.id);
  return t.filter((o) => n.includes(o.source) || n.includes(o.target));
}, uo = (e, t, n, o, a, l = 0.1, r = { x: 0, y: 0 }) => {
  var i, u;
  const s = t / (e.width * (1 + l)), c = n / (e.height * (1 + l)), d = Math.min(s, c), h = yn(d, o, a), f = e.x + e.width / 2, w = e.y + e.height / 2, k = t / 2 - f * h + ((i = r.x) != null ? i : 0), E = n / 2 - w * h + ((u = r.y) != null ? u : 0);
  return { x: k, y: E, zoom: h };
}, ql = (e, t) => ({
  x: t.x + e.x,
  y: t.y + e.y,
  z: (e.z > t.z ? e.z : t.z) + 1
}), fa = (e, t) => {
  if (!e.parentNode)
    return !1;
  const n = t(e.parentNode);
  return n ? n.selected ? !0 : fa(n, t) : !1;
}, De = (e) => typeof e > "u" ? "" : typeof e == "string" ? e : Object.keys(e).sort().map((t) => `${t}=${e[t]}`).join("&"), le = (e) => typeof I(e) < "u", Ql = (e, t) => {
  if (!e.source || !e.target)
    return pe("Can't create edge. An edge needs a source and a target."), !1;
  let n;
  return kt(e) ? n = { ...e } : n = {
    ...e,
    id: sa(e)
  }, n = ua(n), ca(n, t) ? !1 : n;
}, Jl = (e, t, n) => {
  if (!t.source || !t.target)
    return pe("Can't create new edge. An edge needs a source and a target."), !1;
  const o = n.find((l) => zn(l) && l.id === e.id);
  if (!o)
    return pe(`The old edge with id=${e.id} does not exist.`), !1;
  const a = {
    ...e,
    id: sa(t),
    source: t.source,
    target: t.target,
    sourceHandle: t.sourceHandle,
    targetHandle: t.targetHandle
  };
  return n.splice(n.indexOf(o), 1, a), a;
}, so = (e, t, n, o) => {
  const a = {}, l = e.map((r) => {
    const i = Wl(r, o, {
      ...t(r.id),
      parentNode: r.parentNode
    });
    return r.parentNode && (a[r.parentNode] = !0), i;
  });
  return l.forEach((r) => {
    const i = [...l, ...n];
    if (r.parentNode && !i.find((u) => u.id === r.parentNode) && pe(`Parent node ${r.parentNode} not found`), r.parentNode || a[r.id]) {
      a[r.id] && (r.isParent = !0);
      const u = r.parentNode ? t(r.parentNode) : void 0;
      u && (u.isParent = !0);
    }
  }), l;
};
var F = /* @__PURE__ */ ((e) => (e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom", e))(F || {}), Le = /* @__PURE__ */ ((e) => (e.Bezier = "default", e.SimpleBezier = "simple-bezier", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e))(Le || {}), et = /* @__PURE__ */ ((e) => (e.Strict = "strict", e.Loose = "loose", e))(et || {}), Rt = /* @__PURE__ */ ((e) => (e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal", e))(Rt || {});
const co = Symbol("vueFlow"), pa = Symbol("nodeId"), ga = Symbol("nodeRef"), er = Symbol("edgeId"), tr = Symbol("edgeRef"), qt = Symbol("slots");
function nr(e) {
  const t = e ?? qe(pa, ""), n = qe(ga, null), { findNode: o, getEdges: a } = ce(), l = o(t);
  if (!l)
    throw new Error(`[vue-flow]: useNode - Node with id ${t} not found!`);
  return {
    id: t,
    nodeEl: n,
    node: l,
    parentNode: K(() => l.parentNode ? o(l.parentNode) : void 0),
    connectedEdges: K(() => Kt([l], a.value))
  };
}
const at = (e, t, n, o, a, l, r, i, u) => {
  var s, c;
  const d = e.touches ? e.touches[0].clientX : e.clientX, h = e.touches ? e.touches[0].clientY : e.clientY, f = r.elementFromPoint(d, h), w = (f == null ? void 0 : f.classList.contains("target")) || !1, k = (f == null ? void 0 : f.classList.contains("source")) || !1, E = {
    elementBelow: f,
    isValid: !1,
    connection: { source: "", target: "", sourceHandle: null, targetHandle: null },
    isHoveringHandle: !1
  };
  if (f && (w || k) && (E.isHoveringHandle = !0, t === et.Strict ? n && k || !n && w : !0)) {
    const g = (s = f.getAttribute("data-nodeid")) != null ? s : "", b = (c = f.getAttribute("data-handleid")) != null ? c : "", B = n ? g : o, y = n ? b : a, $ = n ? o : g, p = {
      source: B,
      sourceHandle: y,
      target: $,
      targetHandle: n ? a : b
    };
    E.connection = p, E.isValid = (Ae(l) ? l(p, { edges: i, sourceNode: u(B), targetNode: u($) }) : g !== o || b !== a) || !E.connection.target || !E.connection.source;
  }
  return E;
}, St = (e) => {
  e == null || e.classList.remove("vue-flow__handle-valid"), e == null || e.classList.remove("vue-flow__handle-connecting");
};
function ma({
  handleId: e,
  nodeId: t,
  isValidConnection: n,
  type: o,
  elementEdgeUpdaterType: a,
  onEdgeUpdateEnd: l,
  onEdgeUpdate: r
}) {
  const i = ce(), u = N(i, "edges"), s = N(i, "connectOnClick"), c = N(i, "nodesConnectable"), d = N(i, "connectionClickStartHandle"), h = N(i, "connectionMode"), f = N(i, "emits"), w = N(i, "startConnection"), k = N(i, "updateConnection"), E = N(i, "endConnection"), g = N(i, "getNode"), b = N(i, "vueFlowRef"), B = K(() => I(o) === "target");
  let y;
  const $ = (_) => {
    if (_.button !== 0)
      return;
    const M = an(_.target);
    if (!M)
      return;
    let z = n;
    const D = g.value(I(t));
    if (D && (typeof D.connectable > "u" ? c.value : D.connectable) === !1)
      return;
    n || D && (z = B.value ? D.isValidSourcePos : D.isValidTargetPos);
    const U = M.elementFromPoint(_.clientX, _.clientY), Q = U == null ? void 0 : U.classList.contains("target"), ne = U == null ? void 0 : U.classList.contains("source");
    if (!b.value || !Q && !ne && !a)
      return;
    const m = a ?? (Q ? "target" : "source"), T = b.value.getBoundingClientRect();
    w.value(
      {
        nodeId: I(t),
        handleId: I(e),
        type: I(m)
      },
      {
        x: _.clientX - T.left,
        y: _.clientY - T.top
      },
      _
    );
    function x(V) {
      k.value({
        x: V.clientX - T.left,
        y: V.clientY - T.top
      });
      const { connection: L, elementBelow: S, isValid: X, isHoveringHandle: R } = at(
        V,
        h.value,
        I(B.value),
        I(t),
        I(e),
        z,
        M,
        u.value,
        g.value
      );
      if (!R)
        return St(y);
      L.source !== L.target && S && (y = S, S.classList.add("vue-flow__handle-connecting"), S.classList.toggle("vue-flow__handle-valid", X));
    }
    function P(V) {
      const { connection: L, isValid: S } = at(
        V,
        h.value,
        I(B.value),
        I(t),
        I(e),
        z,
        M,
        u.value,
        g.value
      ), X = L.source === L.target;
      S && !X && (r ? r(L) : f.value.connect(L)), a && (l == null || l()), St(y), E.value(V), M.removeEventListener("mousemove", x), M.removeEventListener("mouseup", P);
    }
    M.addEventListener("mousemove", x), M.addEventListener("mouseup", P);
  }, p = W({ x: 0, y: 0 });
  return {
    onMouseDown: $,
    onTouchStart: (_) => {
      const M = _.touches[0].clientX, z = _.touches[0].clientY, D = an(_.target);
      if (!D)
        return;
      let U = n;
      const Q = g.value(I(t));
      if (Q && (typeof Q.connectable > "u" ? c.value : Q.connectable) === !1)
        return;
      n || Q && (U = B.value ? Q.isValidSourcePos : Q.isValidTargetPos);
      const ne = D.elementFromPoint(M, z), m = ne == null ? void 0 : ne.classList.contains("target"), T = ne == null ? void 0 : ne.classList.contains("source");
      if (!b.value || !m && !T && !a)
        return;
      const x = a ?? (m ? "target" : "source"), P = b.value.getBoundingClientRect();
      w.value(
        {
          nodeId: I(t),
          handleId: I(e),
          type: I(x)
        },
        {
          x: M - P.left,
          y: z - P.top
        },
        _
      );
      function V(S) {
        k.value({
          x: S.touches[0].clientX - P.left,
          y: S.touches[0].clientY - P.top
        }), p.value = {
          x: S.touches[0].clientX,
          y: S.touches[0].clientY
        };
        const { connection: X, elementBelow: R, isValid: te, isHoveringHandle: ee } = at(
          S,
          h.value,
          I(B.value),
          I(t),
          I(e),
          U,
          D,
          u.value,
          g.value
        );
        if (!ee)
          return St(y);
        X.source !== X.target && R && (y = R, R.classList.add("vue-flow__handle-connecting"), R.classList.toggle("vue-flow__handle-valid", te));
      }
      function L(S) {
        const { connection: X, isValid: R } = at(
          { clientX: p.value.x, clientY: p.value.y },
          h.value,
          I(B.value),
          I(t),
          I(e),
          U,
          D,
          u.value,
          g.value
        ), te = X.source === X.target;
        R && !te && (r ? r(X) : f.value.connect(X)), a && (l == null || l()), St(y), E.value(S), p.value = { x: 0, y: 0 }, D.removeEventListener("touchmove", V), D.removeEventListener("touchend", L);
      }
      D.addEventListener("touchmove", V), D.addEventListener("touchend", L);
    },
    onClick: (_) => {
      var M;
      if (s.value)
        if (!d.value)
          w.value({ nodeId: I(t), type: I(o), handleId: I(e) }, void 0, _, !0);
        else {
          let z = n ?? (() => !0);
          const D = g.value(I(t));
          if (D && (typeof D.connectable > "u" ? c.value : D.connectable) === !1)
            return;
          n || D && (z = (M = B.value ? D.isValidSourcePos : D.isValidTargetPos) != null ? M : () => !0);
          const U = an(_.target), { connection: Q, isValid: ne } = at(
            _,
            h.value,
            d.value.type === "target",
            d.value.nodeId,
            d.value.handleId || null,
            z,
            U,
            u.value,
            g.value
          ), m = Q.source === Q.target;
          ne && !m && f.value.connect(Q), E.value(_, !0);
        }
    }
  };
}
const or = ["data-handleid", "data-nodeid", "data-handlepos"], ar = {
  name: "Handle"
}, tt = /* @__PURE__ */ se({
  ...ar,
  props: {
    id: null,
    type: null,
    position: { default: () => "top" },
    isValidConnection: null,
    connectable: { type: [Boolean, String, Function], default: !0 }
  },
  setup(e) {
    const t = Fo(e, ["position", "connectable", "id", "isValidConnection"]), n = N(t, "type", "source"), o = ce(), a = N(o, "connectionStartHandle");
    N(o, "connectionMode");
    const l = N(o, "vueFlowRef"), r = N(o, "nodesConnectable"), { id: i, node: u, nodeEl: s, connectedEdges: c } = nr(), d = W(), h = K(() => {
      var g;
      return (g = e.id) != null ? g : `${i}__handle-${e.position}`;
    }), { onMouseDown: f, onTouchStart: w, onClick: k } = ma({
      nodeId: i,
      handleId: h.value,
      isValidConnection: e.isValidConnection,
      type: n
    }), E = K(() => Gt(e.connectable) && e.connectable === "single" ? !c.value.some((g) => {
      const b = g[`${n.value}Handle`];
      return g[n.value] !== i ? !1 : b ? b === h.value : !0;
    }) : Ae(e.connectable) ? e.connectable(u, c.value) : le(e.connectable) ? e.connectable : r.value);
    return be(() => {
      var g, b;
      const B = (g = u.handleBounds[n.value]) == null ? void 0 : g.find((D) => D.id === h.value);
      if (!l.value || B)
        return;
      const y = l.value.querySelector(".vue-flow__transformationpane");
      if (!s || !d.value || !y)
        return;
      const $ = s.value.getBoundingClientRect(), p = d.value.getBoundingClientRect(), _ = window.getComputedStyle(y), { m22: M } = new window.DOMMatrixReadOnly(_.transform), z = {
        id: h.value,
        position: e.position,
        x: (p.left - $.left) / M,
        y: (p.top - $.top) / M,
        ...vt(d.value)
      };
      u.handleBounds[n.value] = [...(b = u.handleBounds[n.value]) != null ? b : [], z];
    }), (g, b) => (j(), q("div", {
      ref_key: "handle",
      ref: d,
      "data-handleid": h.value,
      "data-nodeid": I(i),
      "data-handlepos": e.position,
      class: Ie(["vue-flow__handle nodrag", [
        `vue-flow__handle-${e.position}`,
        `vue-flow__handle-${h.value}`,
        {
          source: I(n) !== "target",
          target: I(n) === "target",
          connectable: I(E),
          connecting: a.value && a.value.nodeId === I(i) && a.value.handleId === h.value && a.value.type === I(n)
        }
      ]]),
      onMousedown: b[0] || (b[0] = (...B) => I(f) && I(f)(...B)),
      onTouchstart: b[1] || (b[1] = (...B) => I(w) && I(w)(...B)),
      onClick: b[2] || (b[2] = (...B) => I(k) && I(k)(...B))
    }, [
      _e(g.$slots, "default", { id: e.id })
    ], 42, or));
  }
}), Tn = function({
  sourcePosition: e = F.Bottom,
  targetPosition: t = F.Top,
  label: n,
  connectable: o = !0,
  isValidTargetPos: a,
  isValidSourcePos: l
}) {
  return [
    ae(tt, { type: "target", position: t, connectable: o, isValidConnection: a }),
    typeof n != "string" && n ? ae(n) : ae("div", { innerHTML: n }),
    ae(tt, { type: "source", position: e, connectable: o, isValidConnection: l })
  ];
};
Tn.props = ["sourcePosition", "targetPosition", "label", "isValidTargetPos", "isValidSourcePos", "connectable"];
Tn.inheritAttrs = !1;
const lr = Tn, On = function({
  sourcePosition: e = F.Bottom,
  label: t,
  connectable: n = !0,
  isValidSourcePos: o
}) {
  return [
    typeof t != "string" && t ? ae(t) : ae("div", { innerHTML: t }),
    ae(tt, { type: "source", position: e, connectable: n, isValidConnection: o })
  ];
};
On.props = ["sourcePosition", "label", "isValidSourcePos", "connectable"];
On.inheritAttrs = !1;
const rr = On, In = function({
  targetPosition: e = F.Top,
  label: t,
  connectable: n = !0,
  isValidTargetPos: o
}) {
  return [
    ae(tt, { type: "target", position: e, connectable: n, isValidConnection: o }),
    typeof t != "string" && t ? ae(t) : ae("div", { innerHTML: t })
  ];
};
In.props = ["targetPosition", "label", "isValidTargetPos", "connectable"];
In.inheritAttrs = !1;
const ir = In, ur = () => ({
  doubleClick: H(),
  click: H(),
  mouseEnter: H(),
  mouseMove: H(),
  mouseLeave: H(),
  contextMenu: H(),
  dragStart: H(),
  drag: H(),
  dragStop: H()
});
function sr(e, t) {
  const n = ur();
  return n.doubleClick.on((o) => {
    var a, l;
    t.nodeDoubleClick(o), (l = (a = e.events) == null ? void 0 : a.doubleClick) == null || l.call(a, o);
  }), n.click.on((o) => {
    var a, l;
    t.nodeClick(o), (l = (a = e.events) == null ? void 0 : a.click) == null || l.call(a, o);
  }), n.mouseEnter.on((o) => {
    var a, l;
    t.nodeMouseEnter(o), (l = (a = e.events) == null ? void 0 : a.mouseEnter) == null || l.call(a, o);
  }), n.mouseMove.on((o) => {
    var a, l;
    t.nodeMouseMove(o), (l = (a = e.events) == null ? void 0 : a.mouseMove) == null || l.call(a, o);
  }), n.mouseLeave.on((o) => {
    var a, l;
    t.nodeMouseLeave(o), (l = (a = e.events) == null ? void 0 : a.mouseLeave) == null || l.call(a, o);
  }), n.contextMenu.on((o) => {
    var a, l;
    t.nodeContextMenu(o), (l = (a = e.events) == null ? void 0 : a.contextMenu) == null || l.call(a, o);
  }), n.dragStart.on((o) => {
    var a, l;
    t.nodeDragStart(o), (l = (a = e.events) == null ? void 0 : a.dragStart) == null || l.call(a, o);
  }), n.drag.on((o) => {
    var a, l;
    t.nodeDrag(o), (l = (a = e.events) == null ? void 0 : a.drag) == null || l.call(a, o);
  }), n.dragStop.on((o) => {
    var a, l;
    t.nodeDragStop(o), (l = (a = e.events) == null ? void 0 : a.dragStop) == null || l.call(a, o);
  }), Object.entries(n).reduce(
    (o, [a, l]) => (o.emit[a] = l.trigger, o.on[a] = l.on, o),
    { emit: {}, on: {} }
  );
}
const ho = (e, t, n) => {
  const o = t.querySelectorAll(e);
  if (!o || !o.length)
    return;
  const a = Array.from(o), l = t.getBoundingClientRect();
  return a.map((r) => {
    const i = r.getBoundingClientRect();
    return {
      id: r.getAttribute("data-handleid"),
      position: r.getAttribute("data-handlepos"),
      x: (i.left - l.left) / n,
      y: (i.top - l.top) / n,
      ...vt(r)
    };
  });
}, ya = (e, t, n, o, a) => {
  a.value = !1, e.selected ? e.selected && t && o([e]) : n([e]);
};
var vo;
const cr = typeof window < "u", Mt = (e) => typeof e == "number";
cr && ((vo = window == null ? void 0 : window.navigator) != null && vo.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function fo(e, t, n) {
  let o = e;
  do {
    if (o && o.matches(t))
      return !0;
    if (o === n.value)
      return !1;
    o = o.parentElement;
  } while (o);
  return !1;
}
function dr(e, t, n, o) {
  return e.filter((a) => (a.selected || a.id === o) && (!a.parentNode || !fa(a, n))).map(
    (a) => {
      var l, r;
      return Ue({
        id: a.id,
        position: a.computedPosition || { x: 0, y: 0, z: 0 },
        distance: {
          x: t.x - ((l = a.computedPosition) == null ? void 0 : l.x) || 0,
          y: t.y - ((r = a.computedPosition) == null ? void 0 : r.y) || 0
        },
        from: a.computedPosition,
        extent: a.extent,
        parentNode: a.parentNode,
        dimensions: a.dimensions
      });
    }
  );
}
function ln({
  id: e,
  dragItems: t,
  getNode: n
}) {
  const o = t.map((a) => ({
    ...n.value(a.id)
  }));
  return [e ? o.find((a) => a.id === e) : o[0], o];
}
function ba(e, t, n) {
  let o = e.extent || t;
  if (e.extent === "parent")
    e.parentNode && n && e.dimensions.width && e.dimensions.height ? o = n && Mt(n.computedPosition.x) && Mt(n.computedPosition.y) && Mt(n.dimensions.width) && Mt(n.dimensions.height) ? [
      [n.computedPosition.x, n.computedPosition.y],
      [
        n.computedPosition.x + n.dimensions.width - e.dimensions.width,
        n.computedPosition.y + n.dimensions.height - e.dimensions.height
      ]
    ] : o : (pe("Only child nodes can use a parent extent."), o = t);
  else if (e.extent && n) {
    const a = n.computedPosition.x, l = n.computedPosition.y;
    o = [
      [e.extent[0][0] + a, e.extent[0][1] + l],
      [e.extent[1][0] + a, e.extent[1][1] + l]
    ];
  }
  return o;
}
var hr = { value: () => {
} };
function Qt() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o))
      throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new It(n);
}
function It(e) {
  this._ = e;
}
function vr(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", a = n.indexOf(".");
    if (a >= 0 && (o = n.slice(a + 1), n = n.slice(0, a)), n && !t.hasOwnProperty(n))
      throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
It.prototype = Qt.prototype = {
  constructor: It,
  on: function(e, t) {
    var n = this._, o = vr(e + "", n), a, l = -1, r = o.length;
    if (arguments.length < 2) {
      for (; ++l < r; )
        if ((a = (e = o[l]).type) && (a = fr(n[a], e.name)))
          return a;
      return;
    }
    if (t != null && typeof t != "function")
      throw new Error("invalid callback: " + t);
    for (; ++l < r; )
      if (a = (e = o[l]).type)
        n[a] = po(n[a], e.name, t);
      else if (t == null)
        for (a in n)
          n[a] = po(n[a], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t)
      e[n] = t[n].slice();
    return new It(e);
  },
  call: function(e, t) {
    if ((a = arguments.length - 2) > 0)
      for (var n = new Array(a), o = 0, a, l; o < a; ++o)
        n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (l = this._[e], o = 0, a = l.length; o < a; ++o)
      l[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (var o = this._[e], a = 0, l = o.length; a < l; ++a)
      o[a].value.apply(t, n);
  }
};
function fr(e, t) {
  for (var n = 0, o = e.length, a; n < o; ++n)
    if ((a = e[n]).name === t)
      return a.value;
}
function po(e, t, n) {
  for (var o = 0, a = e.length; o < a; ++o)
    if (e[o].name === t) {
      e[o] = hr, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var bn = "http://www.w3.org/1999/xhtml";
const go = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: bn,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Jt(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), go.hasOwnProperty(t) ? { space: go[t], local: e } : e;
}
function pr(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === bn && t.documentElement.namespaceURI === bn ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function gr(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function wa(e) {
  var t = Jt(e);
  return (t.local ? gr : pr)(t);
}
function mr() {
}
function An(e) {
  return e == null ? mr : function() {
    return this.querySelector(e);
  };
}
function yr(e) {
  typeof e != "function" && (e = An(e));
  for (var t = this._groups, n = t.length, o = new Array(n), a = 0; a < n; ++a)
    for (var l = t[a], r = l.length, i = o[a] = new Array(r), u, s, c = 0; c < r; ++c)
      (u = l[c]) && (s = e.call(u, u.__data__, c, l)) && ("__data__" in u && (s.__data__ = u.__data__), i[c] = s);
  return new fe(o, this._parents);
}
function br(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function wr() {
  return [];
}
function xa(e) {
  return e == null ? wr : function() {
    return this.querySelectorAll(e);
  };
}
function xr(e) {
  return function() {
    return br(e.apply(this, arguments));
  };
}
function _r(e) {
  typeof e == "function" ? e = xr(e) : e = xa(e);
  for (var t = this._groups, n = t.length, o = [], a = [], l = 0; l < n; ++l)
    for (var r = t[l], i = r.length, u, s = 0; s < i; ++s)
      (u = r[s]) && (o.push(e.call(u, u.__data__, s, r)), a.push(u));
  return new fe(o, a);
}
function _a(e) {
  return function() {
    return this.matches(e);
  };
}
function ka(e) {
  return function(t) {
    return t.matches(e);
  };
}
var kr = Array.prototype.find;
function Er(e) {
  return function() {
    return kr.call(this.children, e);
  };
}
function Nr() {
  return this.firstElementChild;
}
function Sr(e) {
  return this.select(e == null ? Nr : Er(typeof e == "function" ? e : ka(e)));
}
var Mr = Array.prototype.filter;
function Cr() {
  return Array.from(this.children);
}
function Pr(e) {
  return function() {
    return Mr.call(this.children, e);
  };
}
function $r(e) {
  return this.selectAll(e == null ? Cr : Pr(typeof e == "function" ? e : ka(e)));
}
function zr(e) {
  typeof e != "function" && (e = _a(e));
  for (var t = this._groups, n = t.length, o = new Array(n), a = 0; a < n; ++a)
    for (var l = t[a], r = l.length, i = o[a] = [], u, s = 0; s < r; ++s)
      (u = l[s]) && e.call(u, u.__data__, s, l) && i.push(u);
  return new fe(o, this._parents);
}
function Ea(e) {
  return new Array(e.length);
}
function Br() {
  return new fe(this._enter || this._groups.map(Ea), this._parents);
}
function Ht(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Ht.prototype = {
  constructor: Ht,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function Tr(e) {
  return function() {
    return e;
  };
}
function Or(e, t, n, o, a, l) {
  for (var r = 0, i, u = t.length, s = l.length; r < s; ++r)
    (i = t[r]) ? (i.__data__ = l[r], o[r] = i) : n[r] = new Ht(e, l[r]);
  for (; r < u; ++r)
    (i = t[r]) && (a[r] = i);
}
function Ir(e, t, n, o, a, l, r) {
  var i, u, s = /* @__PURE__ */ new Map(), c = t.length, d = l.length, h = new Array(c), f;
  for (i = 0; i < c; ++i)
    (u = t[i]) && (h[i] = f = r.call(u, u.__data__, i, t) + "", s.has(f) ? a[i] = u : s.set(f, u));
  for (i = 0; i < d; ++i)
    f = r.call(e, l[i], i, l) + "", (u = s.get(f)) ? (o[i] = u, u.__data__ = l[i], s.delete(f)) : n[i] = new Ht(e, l[i]);
  for (i = 0; i < c; ++i)
    (u = t[i]) && s.get(h[i]) === u && (a[i] = u);
}
function Ar(e) {
  return e.__data__;
}
function Vr(e, t) {
  if (!arguments.length)
    return Array.from(this, Ar);
  var n = t ? Ir : Or, o = this._parents, a = this._groups;
  typeof e != "function" && (e = Tr(e));
  for (var l = a.length, r = new Array(l), i = new Array(l), u = new Array(l), s = 0; s < l; ++s) {
    var c = o[s], d = a[s], h = d.length, f = Xr(e.call(c, c && c.__data__, s, o)), w = f.length, k = i[s] = new Array(w), E = r[s] = new Array(w), g = u[s] = new Array(h);
    n(c, d, k, E, g, f, t);
    for (var b = 0, B = 0, y, $; b < w; ++b)
      if (y = k[b]) {
        for (b >= B && (B = b + 1); !($ = E[B]) && ++B < w; )
          ;
        y._next = $ || null;
      }
  }
  return r = new fe(r, o), r._enter = i, r._exit = u, r;
}
function Xr(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Dr() {
  return new fe(this._exit || this._groups.map(Ea), this._parents);
}
function Lr(e, t, n) {
  var o = this.enter(), a = this, l = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (a = t(a), a && (a = a.selection())), n == null ? l.remove() : n(l), o && a ? o.merge(a).order() : a;
}
function Rr(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, a = n.length, l = o.length, r = Math.min(a, l), i = new Array(a), u = 0; u < r; ++u)
    for (var s = n[u], c = o[u], d = s.length, h = i[u] = new Array(d), f, w = 0; w < d; ++w)
      (f = s[w] || c[w]) && (h[w] = f);
  for (; u < a; ++u)
    i[u] = n[u];
  return new fe(i, this._parents);
}
function Hr() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], a = o.length - 1, l = o[a], r; --a >= 0; )
      (r = o[a]) && (l && r.compareDocumentPosition(l) ^ 4 && l.parentNode.insertBefore(r, l), l = r);
  return this;
}
function Yr(e) {
  e || (e = jr);
  function t(d, h) {
    return d && h ? e(d.__data__, h.__data__) : !d - !h;
  }
  for (var n = this._groups, o = n.length, a = new Array(o), l = 0; l < o; ++l) {
    for (var r = n[l], i = r.length, u = a[l] = new Array(i), s, c = 0; c < i; ++c)
      (s = r[c]) && (u[c] = s);
    u.sort(t);
  }
  return new fe(a, this._parents).order();
}
function jr(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Fr() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Zr() {
  return Array.from(this);
}
function Ur() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], a = 0, l = o.length; a < l; ++a) {
      var r = o[a];
      if (r)
        return r;
    }
  return null;
}
function Wr() {
  let e = 0;
  for (const t of this)
    ++e;
  return e;
}
function Gr() {
  return !this.node();
}
function Kr(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var a = t[n], l = 0, r = a.length, i; l < r; ++l)
      (i = a[l]) && e.call(i, i.__data__, l, a);
  return this;
}
function qr(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Qr(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Jr(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function ei(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function ti(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function ni(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function oi(e, t) {
  var n = Jt(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Qr : qr : typeof t == "function" ? n.local ? ni : ti : n.local ? ei : Jr)(n, t));
}
function Na(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function ai(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function li(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function ri(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function ii(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? ai : typeof t == "function" ? ri : li)(e, t, n ?? "")) : nt(this.node(), e);
}
function nt(e, t) {
  return e.style.getPropertyValue(t) || Na(e).getComputedStyle(e, null).getPropertyValue(t);
}
function ui(e) {
  return function() {
    delete this[e];
  };
}
function si(e, t) {
  return function() {
    this[e] = t;
  };
}
function ci(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function di(e, t) {
  return arguments.length > 1 ? this.each((t == null ? ui : typeof t == "function" ? ci : si)(e, t)) : this.node()[e];
}
function Sa(e) {
  return e.trim().split(/^|\s+/);
}
function Vn(e) {
  return e.classList || new Ma(e);
}
function Ma(e) {
  this._node = e, this._names = Sa(e.getAttribute("class") || "");
}
Ma.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Ca(e, t) {
  for (var n = Vn(e), o = -1, a = t.length; ++o < a; )
    n.add(t[o]);
}
function Pa(e, t) {
  for (var n = Vn(e), o = -1, a = t.length; ++o < a; )
    n.remove(t[o]);
}
function hi(e) {
  return function() {
    Ca(this, e);
  };
}
function vi(e) {
  return function() {
    Pa(this, e);
  };
}
function fi(e, t) {
  return function() {
    (t.apply(this, arguments) ? Ca : Pa)(this, e);
  };
}
function pi(e, t) {
  var n = Sa(e + "");
  if (arguments.length < 2) {
    for (var o = Vn(this.node()), a = -1, l = n.length; ++a < l; )
      if (!o.contains(n[a]))
        return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? fi : t ? hi : vi)(n, t));
}
function gi() {
  this.textContent = "";
}
function mi(e) {
  return function() {
    this.textContent = e;
  };
}
function yi(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function bi(e) {
  return arguments.length ? this.each(e == null ? gi : (typeof e == "function" ? yi : mi)(e)) : this.node().textContent;
}
function wi() {
  this.innerHTML = "";
}
function xi(e) {
  return function() {
    this.innerHTML = e;
  };
}
function _i(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function ki(e) {
  return arguments.length ? this.each(e == null ? wi : (typeof e == "function" ? _i : xi)(e)) : this.node().innerHTML;
}
function Ei() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Ni() {
  return this.each(Ei);
}
function Si() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Mi() {
  return this.each(Si);
}
function Ci(e) {
  var t = typeof e == "function" ? e : wa(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Pi() {
  return null;
}
function $i(e, t) {
  var n = typeof e == "function" ? e : wa(e), o = t == null ? Pi : typeof t == "function" ? t : An(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function zi() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Bi() {
  return this.each(zi);
}
function Ti() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Oi() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Ii(e) {
  return this.select(e ? Oi : Ti);
}
function Ai(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Vi(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Xi(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function Di(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, a = t.length, l; n < a; ++n)
        l = t[n], (!e.type || l.type === e.type) && l.name === e.name ? this.removeEventListener(l.type, l.listener, l.options) : t[++o] = l;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function Li(e, t, n) {
  return function() {
    var o = this.__on, a, l = Vi(t);
    if (o) {
      for (var r = 0, i = o.length; r < i; ++r)
        if ((a = o[r]).type === e.type && a.name === e.name) {
          this.removeEventListener(a.type, a.listener, a.options), this.addEventListener(a.type, a.listener = l, a.options = n), a.value = t;
          return;
        }
    }
    this.addEventListener(e.type, l, n), a = { type: e.type, name: e.name, value: t, listener: l, options: n }, o ? o.push(a) : this.__on = [a];
  };
}
function Ri(e, t, n) {
  var o = Xi(e + ""), a, l = o.length, r;
  if (arguments.length < 2) {
    var i = this.node().__on;
    if (i) {
      for (var u = 0, s = i.length, c; u < s; ++u)
        for (a = 0, c = i[u]; a < l; ++a)
          if ((r = o[a]).type === c.type && r.name === c.name)
            return c.value;
    }
    return;
  }
  for (i = t ? Li : Di, a = 0; a < l; ++a)
    this.each(i(o[a], t, n));
  return this;
}
function $a(e, t, n) {
  var o = Na(e), a = o.CustomEvent;
  typeof a == "function" ? a = new a(t, n) : (a = o.document.createEvent("Event"), n ? (a.initEvent(t, n.bubbles, n.cancelable), a.detail = n.detail) : a.initEvent(t, !1, !1)), e.dispatchEvent(a);
}
function Hi(e, t) {
  return function() {
    return $a(this, e, t);
  };
}
function Yi(e, t) {
  return function() {
    return $a(this, e, t.apply(this, arguments));
  };
}
function ji(e, t) {
  return this.each((typeof t == "function" ? Yi : Hi)(e, t));
}
function* Fi() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], a = 0, l = o.length, r; a < l; ++a)
      (r = o[a]) && (yield r);
}
var za = [null];
function fe(e, t) {
  this._groups = e, this._parents = t;
}
function Et() {
  return new fe([[document.documentElement]], za);
}
function Zi() {
  return this;
}
fe.prototype = Et.prototype = {
  constructor: fe,
  select: yr,
  selectAll: _r,
  selectChild: Sr,
  selectChildren: $r,
  filter: zr,
  data: Vr,
  enter: Br,
  exit: Dr,
  join: Lr,
  merge: Rr,
  selection: Zi,
  order: Hr,
  sort: Yr,
  call: Fr,
  nodes: Zr,
  node: Ur,
  size: Wr,
  empty: Gr,
  each: Kr,
  attr: oi,
  style: ii,
  property: di,
  classed: pi,
  text: bi,
  html: ki,
  raise: Ni,
  lower: Mi,
  append: Ci,
  insert: $i,
  remove: Bi,
  clone: Ii,
  datum: Ai,
  on: Ri,
  dispatch: ji,
  [Symbol.iterator]: Fi
};
function me(e) {
  return typeof e == "string" ? new fe([[document.querySelector(e)]], [document.documentElement]) : new fe([[e]], za);
}
function Ui(e) {
  let t;
  for (; t = e.sourceEvent; )
    e = t;
  return e;
}
function xe(e, t) {
  if (e = Ui(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var a = t.getBoundingClientRect();
      return [e.clientX - a.left - t.clientLeft, e.clientY - a.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const Wi = { passive: !1 }, ft = { capture: !0, passive: !1 };
function rn(e) {
  e.stopImmediatePropagation();
}
function We(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Ba(e) {
  var t = e.document.documentElement, n = me(e).on("dragstart.drag", We, ft);
  "onselectstart" in t ? n.on("selectstart.drag", We, ft) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Ta(e, t) {
  var n = e.document.documentElement, o = me(e).on("dragstart.drag", null);
  t && (o.on("click.drag", We, ft), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Ct = (e) => () => e;
function wn(e, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: a,
  active: l,
  x: r,
  y: i,
  dx: u,
  dy: s,
  dispatch: c
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    identifier: { value: a, enumerable: !0, configurable: !0 },
    active: { value: l, enumerable: !0, configurable: !0 },
    x: { value: r, enumerable: !0, configurable: !0 },
    y: { value: i, enumerable: !0, configurable: !0 },
    dx: { value: u, enumerable: !0, configurable: !0 },
    dy: { value: s, enumerable: !0, configurable: !0 },
    _: { value: c }
  });
}
wn.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function Gi(e) {
  return !e.ctrlKey && !e.button;
}
function Ki() {
  return this.parentNode;
}
function qi(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Qi() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Ji() {
  var e = Gi, t = Ki, n = qi, o = Qi, a = {}, l = Qt("start", "drag", "end"), r = 0, i, u, s, c, d = 0;
  function h(y) {
    y.on("mousedown.drag", f).filter(o).on("touchstart.drag", E).on("touchmove.drag", g, Wi).on("touchend.drag touchcancel.drag", b).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function f(y, $) {
    if (!(c || !e.call(this, y, $))) {
      var p = B(this, t.call(this, y, $), y, $, "mouse");
      !p || (me(y.view).on("mousemove.drag", w, ft).on("mouseup.drag", k, ft), Ba(y.view), rn(y), s = !1, i = y.clientX, u = y.clientY, p("start", y));
    }
  }
  function w(y) {
    if (We(y), !s) {
      var $ = y.clientX - i, p = y.clientY - u;
      s = $ * $ + p * p > d;
    }
    a.mouse("drag", y);
  }
  function k(y) {
    me(y.view).on("mousemove.drag mouseup.drag", null), Ta(y.view, s), We(y), a.mouse("end", y);
  }
  function E(y, $) {
    if (e.call(this, y, $)) {
      var p = y.changedTouches, _ = t.call(this, y, $), M = p.length, z, D;
      for (z = 0; z < M; ++z)
        (D = B(this, _, y, $, p[z].identifier, p[z])) && (rn(y), D("start", y, p[z]));
    }
  }
  function g(y) {
    var $ = y.changedTouches, p = $.length, _, M;
    for (_ = 0; _ < p; ++_)
      (M = a[$[_].identifier]) && (We(y), M("drag", y, $[_]));
  }
  function b(y) {
    var $ = y.changedTouches, p = $.length, _, M;
    for (c && clearTimeout(c), c = setTimeout(function() {
      c = null;
    }, 500), _ = 0; _ < p; ++_)
      (M = a[$[_].identifier]) && (rn(y), M("end", y, $[_]));
  }
  function B(y, $, p, _, M, z) {
    var D = l.copy(), U = xe(z || p, $), Q, ne, m;
    if ((m = n.call(y, new wn("beforestart", {
      sourceEvent: p,
      target: h,
      identifier: M,
      active: r,
      x: U[0],
      y: U[1],
      dx: 0,
      dy: 0,
      dispatch: D
    }), _)) != null)
      return Q = m.x - U[0] || 0, ne = m.y - U[1] || 0, function T(x, P, V) {
        var L = U, S;
        switch (x) {
          case "start":
            a[M] = T, S = r++;
            break;
          case "end":
            delete a[M], --r;
          case "drag":
            U = xe(V || P, $), S = r;
            break;
        }
        D.call(
          x,
          y,
          new wn(x, {
            sourceEvent: P,
            subject: m,
            target: h,
            identifier: M,
            active: S,
            x: U[0] + Q,
            y: U[1] + ne,
            dx: U[0] - L[0],
            dy: U[1] - L[1],
            dispatch: D
          }),
          _
        );
      };
  }
  return h.filter = function(y) {
    return arguments.length ? (e = typeof y == "function" ? y : Ct(!!y), h) : e;
  }, h.container = function(y) {
    return arguments.length ? (t = typeof y == "function" ? y : Ct(y), h) : t;
  }, h.subject = function(y) {
    return arguments.length ? (n = typeof y == "function" ? y : Ct(y), h) : n;
  }, h.touchable = function(y) {
    return arguments.length ? (o = typeof y == "function" ? y : Ct(!!y), h) : o;
  }, h.on = function() {
    var y = l.on.apply(l, arguments);
    return y === l ? h : y;
  }, h.clickDistance = function(y) {
    return arguments.length ? (d = (y = +y) * y, h) : Math.sqrt(d);
  }, h;
}
function Oa(e) {
  const t = Dt(), n = t.run(() => {
    const o = ce(), a = N(o, "viewport"), l = N(o, "snapToGrid"), r = N(o, "snapGrid"), i = N(o, "noDragClassName"), u = N(o, "nodes"), s = N(o, "nodeExtent"), c = N(o, "getNode"), d = N(o, "multiSelectionActive"), h = N(o, "nodesSelectionActive"), f = N(o, "selectNodesOnDrag"), w = N(o, "removeSelectedElements"), k = N(o, "addSelectedNodes"), E = N(o, "updateNodePositions"), g = e, b = N(g, "onStart"), B = N(g, "onDrag"), y = N(g, "onStop"), $ = N(g, "el"), p = N(g, "disabled", !1), _ = N(g, "id"), M = W(!1);
    let z = W(), D = W({ x: void 0, y: void 0 }), U = W();
    const Q = (m) => m ?? l.value ? r.value : void 0, ne = (m, T) => {
      const x = m.sourceEvent.touches ? m.sourceEvent.touches[0].clientX : m.sourceEvent.clientX, P = m.sourceEvent.touches ? m.sourceEvent.touches[0].clientY : m.sourceEvent.clientY;
      return Bn(
        {
          x,
          y: P
        },
        a.value,
        !!T,
        T ?? r.value
      );
    };
    return re([() => p.value, () => $.value], () => {
      if ($.value) {
        const m = me($.value), T = _.value ? c.value(_.value) : void 0;
        p.value ? m.on(".drag", null) : (U.value = Ji().on("start", (x) => {
          !f.value && !d.value && _.value && (T != null && T.selected || w.value()), T && !p.value && f.value && ya(T, d.value, k.value, w.value, h);
          const P = ne(x, Q(T == null ? void 0 : T.snapGrid));
          if (z.value = dr(u.value, P, c.value, _.value), b.value && z.value) {
            const [V, L] = ln({
              id: _.value,
              dragItems: z.value,
              getNode: c
            });
            b.value(x.sourceEvent, V, L);
          }
        }).on("drag", (x) => {
          const P = Q(T == null ? void 0 : T.snapGrid), V = ne(x, P);
          let L = !1;
          if ((D.value.x !== V.x || D.value.y !== V.y) && z.value) {
            if (D.value = V, z.value = z.value.map((S) => {
              const X = { x: V.x - S.distance.x, y: V.y - S.distance.y };
              if (l.value && P) {
                const [te, ee] = P;
                X.x = te * Math.round(X.x / te), X.y = ee * Math.round(X.y / ee);
              }
              const R = ba(S, s.value, S.parentNode ? c.value(S.parentNode) : void 0);
              return L = L || S.position.x !== X.x || S.position.y !== X.y, S.position = R ? $n(X, R) : X, S;
            }), !L)
              return;
            if (E.value(z.value, !0, !0), B.value) {
              const [S, X] = ln({
                id: _.value,
                dragItems: z.value,
                getNode: c
              });
              M.value = !0, B.value(x.sourceEvent, S, X);
            }
          }
          x.on("end", (S) => {
            if (M.value = !1, y.value && z.value) {
              E.value(z.value, !1, !1);
              const [X, R] = ln({
                id: _.value,
                dragItems: z.value,
                getNode: c
              });
              M.value = !1, y.value(S.sourceEvent, X, R);
            }
          });
        }).on("end", () => {
          M.value = !1;
        }).filter((x) => {
          const P = x.target;
          return !x.button && (!i.value || !fo(P, `.${i.value}`, $) && (!(T != null && T.dragHandle) || fo(P, T.dragHandle, $)));
        }), m.call(U.value));
      }
    }), M;
  });
  return xt(() => t.stop()), n;
}
const eu = ["data-id"], tu = {
  name: "Node",
  inheritAttrs: !1
}, nu = /* @__PURE__ */ se({
  ...tu,
  props: {
    id: null,
    draggable: { type: Boolean },
    selectable: { type: Boolean },
    connectable: null,
    snapGrid: null,
    type: { type: [null, Function, Object, Boolean] },
    name: null,
    node: null,
    resizeObserver: null
  },
  setup(e) {
    const t = Fo(e, ["id", "type", "name", "draggable", "selectable", "connectable"]);
    Ke(pa, e.id);
    const n = ce(), o = N(n, "edges"), a = N(n, "noPanClassName"), l = N(n, "selectNodesOnDrag"), r = N(n, "nodesSelectionActive"), i = N(n, "multiSelectionActive"), u = N(n, "emits"), s = N(n, "getNode"), c = N(n, "removeSelectedElements"), d = N(n, "addSelectedNodes"), h = N(n, "updateNodeDimensions"), f = N(n, "onUpdateNodeInternals"), w = N(n, "getIntersectingNodes"), k = N(n, "getNodeTypes"), E = N(n, "nodeExtent"), g = N(n, "onNodesInitialized"), b = ct(t, "node"), B = K(() => b.value.parentNode ? s.value(b.value.parentNode) : void 0), y = K(() => Kt([b.value], o.value)), $ = W(), p = W(!1);
    Ke(ga, $);
    const { emit: _, on: M } = sr(b.value, u.value), z = Oa({
      id: e.id,
      el: $,
      disabled: K(() => !e.draggable),
      onStart(S, X, R) {
        _.dragStart({ event: S, node: X, nodes: R, intersections: w.value(X) });
      },
      onDrag(S, X, R) {
        _.drag({ event: S, node: X, nodes: R, intersections: w.value(X) });
      },
      onStop(S, X, R) {
        _.dragStop({ event: S, node: X, nodes: R, intersections: w.value(X) });
      }
    }), D = K(() => b.value.class instanceof Function ? b.value.class(b.value) : b.value.class), U = K(() => {
      const S = (b.value.style instanceof Function ? b.value.style(b.value) : b.value.style) || {}, X = b.value.width instanceof Function ? b.value.width(b.value) : b.value.width, R = b.value.height instanceof Function ? b.value.height(b.value) : b.value.height;
      return X && (S.width = typeof X == "string" ? X : `${X}px`), R && (S.height = typeof R == "string" ? R : `${R}px`), S;
    });
    f.value((S) => {
      S.includes(e.id) && ne();
    }), be(() => {
      t.resizeObserver.observe($.value);
    }), wt(() => {
      t.resizeObserver.unobserve($.value);
    }), re(
      [() => b.value.type, () => b.value.sourcePosition, () => b.value.targetPosition],
      () => {
        h.value([{ id: e.id, nodeElement: $.value, forceUpdate: !0 }]);
      },
      { flush: "post" }
    ), re(
      [
        () => b.value.position.x,
        () => b.value.position.y,
        () => {
          var S;
          return (S = B.value) == null ? void 0 : S.computedPosition.x;
        },
        () => {
          var S;
          return (S = B.value) == null ? void 0 : S.computedPosition.y;
        },
        () => {
          var S;
          return (S = B.value) == null ? void 0 : S.computedPosition.z;
        },
        () => b.value.selected,
        () => b.value.dimensions,
        () => {
          var S;
          return (S = B.value) == null ? void 0 : S.dimensions;
        }
      ],
      ([S, X, R, te, ee]) => {
        const ie = {
          x: S,
          y: X,
          z: (gl(U.value.zIndex) ? U.value.zIndex : 0) + (b.value.selected ? 1e3 : 0)
        };
        Q(ie, R && te ? { x: R, y: te, z: ee || 0 } : void 0);
      },
      { flush: "post", immediate: !0 }
    );
    function Q(S, X) {
      let R = S;
      X && (R = ql({ x: X.x, y: X.y, z: X.z }, S)), b.value.computedPosition = R;
    }
    g.value(() => {
      p.value = !0;
    }), be(() => {
      Je(p).toBe(!0).then(() => {
        var S, X;
        const R = ba(b.value, E.value, B.value), te = $n(b.value.computedPosition, R);
        b.value.computedPosition = { ...b.value.computedPosition, ...te }, b.value.position = {
          x: b.value.computedPosition.x - (((S = B.value) == null ? void 0 : S.computedPosition.x) || 0),
          y: b.value.computedPosition.y - (((X = B.value) == null ? void 0 : X.computedPosition.y) || 0)
        };
      });
    });
    function ne() {
      $.value && h.value([{ id: e.id, nodeElement: $.value, forceUpdate: !0 }]), Q(
        {
          x: b.value.position.x,
          y: b.value.position.y,
          z: b.value.computedPosition.z ? b.value.computedPosition.z : b.value.selected ? 1e3 : 0
        },
        B.value ? { ...B.value.computedPosition } : void 0
      );
    }
    function m(S) {
      z != null && z.value || _.mouseEnter({ event: S, node: b.value, connectedEdges: y.value });
    }
    function T(S) {
      z != null && z.value || _.mouseMove({ event: S, node: b.value, connectedEdges: y.value });
    }
    function x(S) {
      z != null && z.value || _.mouseLeave({ event: S, node: b.value, connectedEdges: y.value });
    }
    function P(S) {
      return _.contextMenu({ event: S, node: b.value, connectedEdges: y.value });
    }
    function V(S) {
      return _.doubleClick({ event: S, node: b.value, connectedEdges: y.value });
    }
    function L(S) {
      e.selectable && (!l.value || !e.draggable) && ya(b.value, i.value, d.value, c.value, r), _.click({ event: S, node: b.value, connectedEdges: y.value });
    }
    return (S, X) => {
      var R;
      return j(), q("div", {
        ref_key: "nodeElement",
        ref: $,
        class: Ie(["vue-flow__node", [
          `vue-flow__node-${e.type === !1 ? "default" : e.name}`,
          a.value,
          {
            dragging: I(z),
            selected: b.value.selected,
            selectable: e.selectable
          },
          I(D)
        ]]),
        style: Se({
          zIndex: (R = b.value.computedPosition.z) != null ? R : 0,
          transform: `translate(${b.value.computedPosition.x}px,${b.value.computedPosition.y}px)`,
          pointerEvents: e.selectable || e.draggable ? "all" : "none",
          ...I(U)
        }),
        "data-id": b.value.id,
        onMouseenter: m,
        onMousemove: T,
        onMouseleave: x,
        onContextmenu: P,
        onClick: L,
        onDblclick: V
      }, [
        (j(), ve(Mn(e.type === !1 ? k.value.default : e.type), {
          id: b.value.id,
          type: b.value.type,
          data: b.value.data,
          events: { ...b.value.events, ...I(M) },
          selected: !!b.value.selected,
          connectable: e.connectable,
          position: b.value.position,
          dimensions: b.value.dimensions,
          "is-valid-target-pos": b.value.isValidTargetPos,
          "is-valid-source-pos": b.value.isValidSourcePos,
          "parent-node": b.value.parentNode,
          dragging: I(z),
          "z-index": b.value.computedPosition.z,
          "target-position": b.value.targetPosition,
          "source-position": b.value.sourcePosition,
          label: b.value.label,
          "drag-handle": b.value.dragHandle,
          onUpdateNodeInternals: ne
        }, null, 40, ["id", "type", "data", "events", "selected", "connectable", "position", "dimensions", "is-valid-target-pos", "is-valid-source-pos", "parent-node", "dragging", "z-index", "target-position", "source-position", "label", "drag-handle"]))
      ], 46, eu);
    };
  }
}), ou = ["transform"], au = ["width", "height", "x", "y", "rx", "ry"], lu = ["y"], ru = {
  name: "EdgeText"
}, iu = /* @__PURE__ */ se({
  ...ru,
  props: {
    x: null,
    y: null,
    label: null,
    labelStyle: { default: () => ({}) },
    labelShowBg: { type: Boolean, default: !0 },
    labelBgStyle: { default: () => ({}) },
    labelBgPadding: { default: () => [2, 4] },
    labelBgBorderRadius: { default: 2 }
  },
  setup(e) {
    let t = W({ x: 0, y: 0, width: 0, height: 0 });
    const n = W(null), o = () => {
      if (!n.value)
        return;
      const l = n.value.getBBox();
      (l.width !== t.value.width || l.height !== t.value.height) && (t.value = l);
    };
    be(o), re([() => e.x, () => e.y, n, () => e.label], o);
    const a = K(() => `translate(${e.x - t.value.width / 2} ${e.y - t.value.height / 2})`);
    return (l, r) => (j(), q("g", {
      transform: I(a),
      class: "vue-flow__edge-textwrapper"
    }, [
      e.labelShowBg ? (j(), q("rect", {
        key: 0,
        class: "vue-flow__edge-textbg",
        width: `${t.value.width + 2 * e.labelBgPadding[0]}px`,
        height: `${t.value.height + 2 * e.labelBgPadding[1]}px`,
        x: -e.labelBgPadding[0],
        y: -e.labelBgPadding[1],
        style: Se(e.labelBgStyle),
        rx: e.labelBgBorderRadius,
        ry: e.labelBgBorderRadius
      }, null, 12, au)) : de("", !0),
      ue("text", ht(l.$attrs, {
        ref_key: "el",
        ref: n,
        class: "vue-flow__edge-text",
        y: t.value.height / 2,
        dy: "0.3em",
        style: e.labelStyle
      }), [
        _e(l.$slots, "default", {}, () => [
          I(Gt)(e.label) ? (j(), q(ke, { key: 1 }, [
            qo(Wt(e.label), 1)
          ], 64)) : (j(), ve(Mn(e.label), { key: 0 }))
        ])
      ], 16, lu)
    ], 8, ou));
  }
}), Xn = function({
  path: e,
  label: t,
  labelX: n,
  labelY: o,
  labelBgBorderRadius: a,
  labelBgPadding: l,
  labelBgStyle: r,
  labelShowBg: i = !0,
  labelStyle: u,
  markerStart: s,
  markerEnd: c,
  style: d,
  interactionWidth: h = 20
}) {
  return [
    ae("path", {
      style: d,
      d: e,
      class: "vue-flow__edge-path",
      "marker-end": c,
      "marker-start": s
    }),
    h ? ae("path", {
      d: e,
      fill: "none",
      "stroke-opacity": 0,
      "stroke-width": h
    }) : null,
    t ? ae(iu, {
      x: n,
      y: o,
      label: t,
      labelStyle: u,
      labelShowBg: i,
      labelBgStyle: r,
      labelBgPadding: l,
      labelBgBorderRadius: a
    }) : null
  ];
};
Xn.props = [
  "path",
  "labelX",
  "labelY",
  "label",
  "labelBgBorderRadius",
  "labelBgPadding",
  "labelBgStyle",
  "labelShowBg",
  "labelStyle",
  "markerStart",
  "markerEnd",
  "style",
  "interactionWidth"
];
Xn.inheritAttrs = !1;
const en = Xn;
function Ia({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const a = Math.abs(n - e) / 2, l = n < e ? n + a : n - a, r = Math.abs(o - t) / 2, i = o < t ? o + r : o - r;
  return [l, i, a, r];
}
function Aa({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o,
  sourceControlX: a,
  sourceControlY: l,
  targetControlX: r,
  targetControlY: i
}) {
  const u = e * 0.125 + a * 0.375 + r * 0.375 + n * 0.125, s = t * 0.125 + l * 0.375 + i * 0.375 + o * 0.125, c = Math.abs(u - e), d = Math.abs(s - t);
  return [u, s, c, d];
}
function Pt(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function mo({ pos: e, x1: t, y1: n, x2: o, y2: a, c: l }) {
  let r, i;
  switch (e) {
    case F.Left:
      r = t - Pt(t - o, l), i = n;
      break;
    case F.Right:
      r = t + Pt(o - t, l), i = n;
      break;
    case F.Top:
      r = t, i = n - Pt(n - a, l);
      break;
    case F.Bottom:
      r = t, i = n + Pt(a - n, l);
      break;
  }
  return [r, i];
}
function Dn({
  sourceX: e,
  sourceY: t,
  sourcePosition: n = F.Bottom,
  targetX: o,
  targetY: a,
  targetPosition: l = F.Top,
  curvature: r = 0.25
}) {
  const [i, u] = mo({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: a,
    c: r
  }), [s, c] = mo({
    pos: l,
    x1: o,
    y1: a,
    x2: e,
    y2: t,
    c: r
  }), [d, h, f, w] = Aa({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: a,
    sourceControlX: i,
    sourceControlY: u,
    targetControlX: s,
    targetControlY: c
  });
  return [
    `M${e},${t} C${i},${u} ${s},${c} ${o},${a}`,
    d,
    h,
    f,
    w
  ];
}
const Ln = function({
  sourcePosition: e = F.Bottom,
  targetPosition: t = F.Top,
  ...n
}) {
  const [o, a, l] = Dn({
    sourcePosition: e,
    targetPosition: t,
    ...n
  });
  return ae(en, {
    path: o,
    labelX: a,
    labelY: l,
    ...n
  });
};
Ln.props = [
  "sourcePosition",
  "targetPosition",
  "label",
  "labelStyle",
  "labelShowBg",
  "labelBgStyle",
  "labelBgPadding",
  "labelBgBorderRadius",
  "sourceY",
  "sourceX",
  "targetX",
  "targetY",
  "curvature",
  "markerEnd",
  "markerStart",
  "style",
  "interactionWidth"
];
Ln.inheritAttrs = !1;
const uu = Ln;
function yo({ pos: e, x1: t, y1: n, x2: o, y2: a }) {
  let l, r;
  switch (e) {
    case F.Left:
    case F.Right:
      l = 0.5 * (t + o), r = n;
      break;
    case F.Top:
    case F.Bottom:
      l = t, r = 0.5 * (n + a);
      break;
  }
  return [l, r];
}
function Va({
  sourceX: e,
  sourceY: t,
  sourcePosition: n = F.Bottom,
  targetX: o,
  targetY: a,
  targetPosition: l = F.Top
}) {
  const [r, i] = yo({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: a
  }), [u, s] = yo({
    pos: l,
    x1: o,
    y1: a,
    x2: e,
    y2: t
  }), [c, d, h, f] = Aa({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: a,
    sourceControlX: r,
    sourceControlY: i,
    targetControlX: u,
    targetControlY: s
  });
  return [
    `M${e},${t} C${r},${i} ${u},${s} ${o},${a}`,
    c,
    d,
    h,
    f
  ];
}
const Rn = function({
  sourcePosition: e = F.Bottom,
  targetPosition: t = F.Top,
  ...n
}) {
  const [o, a, l] = Va({
    sourcePosition: e,
    targetPosition: t,
    ...n
  });
  return ae(en, {
    path: o,
    labelX: a,
    labelY: l,
    ...n
  });
};
Rn.props = [
  "sourcePosition",
  "targetPosition",
  "label",
  "labelStyle",
  "labelShowBg",
  "labelBgStyle",
  "labelBgPadding",
  "labelBgBorderRadius",
  "sourceY",
  "sourceX",
  "targetX",
  "targetY",
  "markerEnd",
  "markerStart",
  "style",
  "interactionWidth"
];
Rn.inheritAttrs = !1;
const su = Rn, bo = {
  [F.Left]: { x: -1, y: 0 },
  [F.Right]: { x: 1, y: 0 },
  [F.Top]: { x: 0, y: -1 },
  [F.Bottom]: { x: 0, y: 1 }
}, cu = ({
  source: e,
  sourcePosition: t = F.Bottom,
  target: n
}) => t === F.Left || t === F.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, wo = (e, t) => Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
function du({
  source: e,
  sourcePosition: t = F.Bottom,
  target: n,
  targetPosition: o = F.Top,
  center: a,
  offset: l
}) {
  const r = bo[t], i = bo[o], u = { x: e.x + r.x * l, y: e.y + r.y * l }, s = { x: n.x + i.x * l, y: n.y + i.y * l }, c = cu({
    source: u,
    sourcePosition: t,
    target: s
  }), d = c.x !== 0 ? "x" : "y", h = c[d];
  let f = [], w, k;
  const [E, g, b, B] = Ia({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (r[d] * i[d] === -1) {
    w = a.x || E, k = a.y || g;
    const y = [
      { x: w, y: u.y },
      { x: w, y: s.y }
    ], $ = [
      { x: u.x, y: k },
      { x: s.x, y: k }
    ];
    r[d] === h ? f = d === "x" ? y : $ : f = d === "x" ? $ : y;
  } else {
    const y = [{ x: u.x, y: s.y }], $ = [{ x: s.x, y: u.y }];
    if (d === "x" ? f = r.x === h ? $ : y : f = r.y === h ? y : $, t !== o) {
      const p = d === "x" ? "y" : "x", _ = r[d] === i[p], M = u[p] > s[p], z = u[p] < s[p];
      (r[d] === 1 && (!_ && M || _ && z) || r[d] !== 1 && (!_ && z || _ && M)) && (f = d === "x" ? y : $);
    }
    w = f[0].x, k = f[0].y;
  }
  return [[e, u, ...f, s, n], w, k, b, B];
}
function hu(e, t, n, o) {
  const a = Math.min(wo(e, t) / 2, wo(t, n) / 2, o), { x: l, y: r } = t;
  if (e.x === l && l === n.x || e.y === r && r === n.y)
    return `L${l} ${r}`;
  if (e.y === r) {
    const s = e.x < n.x ? -1 : 1, c = e.y < n.y ? 1 : -1;
    return `L ${l + a * s},${r}Q ${l},${r} ${l},${r + a * c}`;
  }
  const i = e.x < n.x ? 1 : -1, u = e.y < n.y ? -1 : 1;
  return `L ${l},${r + a * u}Q ${l},${r} ${l + a * i},${r}`;
}
function xn({
  sourceX: e,
  sourceY: t,
  sourcePosition: n = F.Bottom,
  targetX: o,
  targetY: a,
  targetPosition: l = F.Top,
  borderRadius: r = 5,
  centerX: i,
  centerY: u,
  offset: s = 20
}) {
  const [c, d, h, f, w] = du({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: o, y: a },
    targetPosition: l,
    center: { x: i, y: u },
    offset: s
  });
  return [c.reduce((k, E, g) => {
    let b = "";
    return g > 0 && g < c.length - 1 ? b = hu(c[g - 1], E, c[g + 1], r) : b = `${g === 0 ? "M" : "L"}${E.x} ${E.y}`, k += b, k;
  }, ""), d, h, f, w];
}
const Hn = function({
  sourcePosition: e = F.Bottom,
  targetPosition: t = F.Top,
  ...n
}) {
  const [o, a, l] = xn({
    sourcePosition: e,
    targetPosition: t,
    ...n
  });
  return ae(en, {
    path: o,
    labelX: a,
    labelY: l,
    ...n
  });
};
Hn.props = [
  "sourcePosition",
  "targetPosition",
  "label",
  "labelStyle",
  "labelShowBg",
  "labelBgStyle",
  "labelBgPadding",
  "labelBgBorderRadius",
  "sourceY",
  "sourceX",
  "targetX",
  "targetY",
  "borderRadius",
  "markerEnd",
  "markerStart",
  "style",
  "interactionWidth"
];
Hn.inheritAttrs = !1;
const Xa = Hn, Yn = function(e) {
  return ae(Xa, { ...e, borderRadius: 0 });
};
Yn.props = [
  "sourcePosition",
  "targetPosition",
  "label",
  "labelStyle",
  "labelShowBg",
  "labelBgStyle",
  "labelBgPadding",
  "labelBgBorderRadius",
  "sourceY",
  "sourceX",
  "targetX",
  "targetY",
  "markerEnd",
  "markerStart",
  "style",
  "interactionWidth"
];
Yn.inheritAttrs = !1;
const vu = Yn;
function fu({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const [a, l, r, i] = Ia({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: o
  });
  return [`M ${e},${t}L ${n},${o}`, a, l, r, i];
}
const jn = function(e) {
  const [t, n, o] = fu(e);
  return ae(en, {
    path: t,
    labelX: n,
    labelY: o,
    ...e
  });
};
jn.props = [
  "label",
  "labelStyle",
  "labelShowBg",
  "labelBgStyle",
  "labelBgPadding",
  "labelBgBorderRadius",
  "sourceY",
  "sourceX",
  "targetX",
  "targetY",
  "markerEnd",
  "markerStart",
  "style",
  "interactionWidth"
];
jn.inheritAttrs = !1;
const pu = jn, gu = (e, t, n) => n === F.Left ? e - t : n === F.Right ? e + t : e, mu = (e, t, n) => n === F.Top ? e - t : n === F.Bottom ? e + t : e, Da = function({ radius: e = 10, centerX: t = 0, centerY: n = 0, position: o = F.Top }) {
  const a = () => {
    const r = gu(t, e, o);
    return isNaN(r) ? 0 : r;
  }, l = () => {
    const r = mu(n, e, o);
    return isNaN(r) ? 0 : r;
  };
  return ae("circle", {
    class: "vue-flow__edgeupdater",
    cx: a(),
    cy: l(),
    r: e,
    stroke: "transparent",
    fill: "transparent"
  });
};
Da.props = ["radius", "centerX", "centerY", "position"];
const xo = Da, yu = () => ({
  doubleClick: H(),
  click: H(),
  mouseEnter: H(),
  mouseMove: H(),
  mouseLeave: H(),
  contextMenu: H(),
  updateStart: H(),
  update: H(),
  updateEnd: H()
});
function bu(e, t) {
  const n = yu();
  return n.doubleClick.on((o) => {
    var a, l;
    t.edgeDoubleClick(o), (l = (a = e.events) == null ? void 0 : a.doubleClick) == null || l.call(a, o);
  }), n.click.on((o) => {
    var a, l;
    t.edgeClick(o), (l = (a = e.events) == null ? void 0 : a.click) == null || l.call(a, o);
  }), n.mouseEnter.on((o) => {
    var a, l;
    t.edgeMouseEnter(o), (l = (a = e.events) == null ? void 0 : a.mouseEnter) == null || l.call(a, o);
  }), n.mouseMove.on((o) => {
    var a, l;
    t.edgeMouseMove(o), (l = (a = e.events) == null ? void 0 : a.mouseMove) == null || l.call(a, o);
  }), n.mouseLeave.on((o) => {
    var a, l;
    t.edgeMouseLeave(o), (l = (a = e.events) == null ? void 0 : a.mouseLeave) == null || l.call(a, o);
  }), n.contextMenu.on((o) => {
    var a, l;
    t.edgeContextMenu(o), (l = (a = e.events) == null ? void 0 : a.contextMenu) == null || l.call(a, o);
  }), n.updateStart.on((o) => {
    var a, l;
    t.edgeUpdateStart(o), (l = (a = e.events) == null ? void 0 : a.updateStart) == null || l.call(a, o);
  }), n.update.on((o) => {
    var a, l;
    t.edgeUpdate(o), (l = (a = e.events) == null ? void 0 : a.update) == null || l.call(a, o);
  }), n.updateEnd.on((o) => {
    var a, l;
    t.edgeUpdateEnd(o), (l = (a = e.events) == null ? void 0 : a.updateEnd) == null || l.call(a, o);
  }), Object.entries(n).reduce(
    (o, [a, l]) => (o.emit[a] = l.trigger, o.on[a] = l.on, o),
    { emit: {}, on: {} }
  );
}
const _o = (e, t, n) => {
  var o, a, l, r;
  const i = ((o = n == null ? void 0 : n.x) != null ? o : 0) + t.x, u = ((a = n == null ? void 0 : n.y) != null ? a : 0) + t.y, s = (l = n == null ? void 0 : n.width) != null ? l : t.width, c = (r = n == null ? void 0 : n.height) != null ? r : t.height;
  switch (e) {
    case F.Top:
      return {
        x: i + s / 2,
        y: u
      };
    case F.Right:
      return {
        x: i + s,
        y: u + c / 2
      };
    case F.Bottom:
      return {
        x: i + s / 2,
        y: u + c
      };
    case F.Left:
      return {
        x: i,
        y: u + c / 2
      };
  }
}, ko = (e = [], t) => {
  if (!e.length)
    return;
  let n;
  return !t && e.length === 1 ? n = e[0] : t && (n = e.find((o) => o.id === t)), n || e[0];
}, wu = (e, t, n, o, a, l) => {
  const r = _o(
    n,
    {
      ...e.dimensions,
      ...e.computedPosition
    },
    t
  ), i = _o(
    l,
    {
      ...o.dimensions,
      ...o.computedPosition
    },
    a
  );
  return {
    sourceX: r.x,
    sourceY: r.y,
    targetX: i.x,
    targetY: i.y
  };
};
function xu({
  sourcePos: e,
  targetPos: t,
  sourceWidth: n,
  sourceHeight: o,
  targetWidth: a,
  targetHeight: l,
  width: r,
  height: i,
  viewport: u
}) {
  const s = {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x + n, t.x + a),
    y2: Math.max(e.y + o, t.y + l)
  };
  s.x === s.x2 && (s.x2 += 1), s.y === s.y2 && (s.y2 += 1);
  const c = da({
    x: (0 - u.x) / u.zoom,
    y: (0 - u.y) / u.zoom,
    width: r / u.zoom,
    height: i / u.zoom
  }), d = Math.max(0, Math.min(c.x2, s.x2) - Math.max(c.x, s.x)), h = Math.max(0, Math.min(c.y2, s.y2) - Math.max(c.y, s.y));
  return Math.ceil(d * h) > 0;
}
const _u = (e, t) => {
  let n = -1;
  const o = e.reduce((a, l) => {
    const r = t(l.source), i = t(l.target);
    if (!r || !i)
      return a;
    const u = l.z ? l.z : Math.max(r.computedPosition.z || 0, i.computedPosition.z || 0);
    return a[u] ? a[u].push(l) : a[u] = [l], n = u > n ? u : n, a;
  }, {});
  return Object.entries(Object.keys(o).length ? o : { 0: [] }).map(([a, l]) => {
    const r = +a;
    return {
      edges: l,
      level: r,
      isMaxLevel: r === n
    };
  });
}, ku = se({
  props: ["name", "type", "id", "updatable", "selectable", "edge", "sourceNode", "targetNode"],
  setup(e) {
    const { addSelectedEdges: t, connectionMode: n, edgeUpdaterRadius: o, emits: a, nodesSelectionActive: l, getEdges: r, getEdgeTypes: i } = ce(), u = bu(e.edge, a), s = ct(e, "edge");
    let c = W(!1), d = W(!1);
    const h = W(""), f = W(null), w = W("source"), k = W("source"), E = W(), g = W();
    Ke(er, e.id), Ke(tr, g);
    const b = () => c.value = !0, B = () => c.value = !1, y = (x) => {
      ca(x, r.value) || u.emit.update({ edge: s.value, connection: x });
    }, $ = () => {
      !E.value || (u.emit.updateEnd({ event: E.value, edge: s.value }), d.value = !1);
    }, { onMouseDown: p } = ma({
      nodeId: h,
      handleId: f,
      type: w,
      isValidConnection: void 0,
      elementEdgeUpdaterType: k,
      onEdgeUpdate: y,
      onEdgeUpdateEnd: $
    }), _ = (x, P) => {
      var V;
      h.value = P ? s.value.target : s.value.source, f.value = (V = P ? s.value.targetHandle : s.value.sourceHandle) != null ? V : "", w.value = P ? "target" : "source", k.value = w.value, E.value = x, u.emit.updateStart({ event: x, edge: s.value }), p(x);
    }, M = (x) => {
      const P = { event: x, edge: s.value };
      e.selectable && (l.value = !1, t([s.value])), u.emit.click(P);
    }, z = (x) => u.emit.contextMenu({ event: x, edge: s.value }), D = (x) => u.emit.doubleClick({ event: x, edge: s.value }), U = (x) => u.emit.mouseEnter({ event: x, edge: s.value }), Q = (x) => u.emit.mouseMove({ event: x, edge: s.value }), ne = (x) => u.emit.mouseLeave({ event: x, edge: s.value }), m = (x) => {
      d.value = !0, _(x, !0);
    }, T = (x) => {
      d.value = !0, _(x, !1);
    };
    return () => {
      if (!e.sourceNode || !e.targetNode)
        return null;
      let x;
      n.value === et.Strict ? x = e.sourceNode.handleBounds.source : x = [...e.sourceNode.handleBounds.source || [], ...e.sourceNode.handleBounds.target || []];
      const P = ko(x, s.value.sourceHandle);
      let V;
      n.value === et.Strict ? V = e.targetNode.handleBounds.target : V = [...e.targetNode.handleBounds.target || [], ...e.targetNode.handleBounds.source || []];
      const L = ko(V, s.value.targetHandle), S = P ? P.position : F.Bottom, X = L ? L.position : F.Top, { sourceX: R, sourceY: te, targetY: ee, targetX: ie } = wu(
        e.sourceNode,
        P,
        S,
        e.targetNode,
        L,
        X
      );
      return ae(
        "g",
        {
          ref: g,
          "data-id": e.id,
          class: [
            "vue-flow__edge",
            `vue-flow__edge-${e.type === !1 ? "default" : e.name}`,
            {
              updating: c.value,
              selected: s.value.selected,
              animated: s.value.animated,
              inactive: !e.selectable
            }
          ],
          onClick: M,
          onContextmenu: z,
          onDblclick: D,
          onMouseenter: U,
          onMousemove: Q,
          onMouseleave: ne
        },
        [
          d.value ? null : ae(e.type === !1 ? i.value.default : e.type, {
            id: e.id,
            sourceNode: e.sourceNode,
            targetNode: e.targetNode,
            source: s.value.source,
            target: s.value.target,
            type: s.value.type,
            updatable: e.updatable,
            selected: s.value.selected,
            animated: s.value.animated,
            label: s.value.label,
            labelStyle: s.value.labelStyle,
            labelShowBg: s.value.labelShowBg,
            labelBgStyle: s.value.labelBgStyle,
            labelBgPadding: s.value.labelBgPadding,
            labelBgBorderRadius: s.value.labelBgBorderRadius,
            data: s.value.data,
            events: { ...s.value.events, ...u.on },
            style: s.value.style instanceof Function ? s.value.style(s.value) : s.value.style,
            markerStart: `url(#${De(s.value.markerStart)})`,
            markerEnd: `url(#${De(s.value.markerEnd)})`,
            sourcePosition: S,
            targetPosition: X,
            sourceX: R,
            sourceY: te,
            targetX: ie,
            targetY: ee,
            sourceHandleId: s.value.sourceHandle,
            targetHandleId: s.value.targetHandle,
            interactionWidth: s.value.interactionWidth
          }),
          [
            e.updatable === "source" || e.updatable === !0 ? [
              ae(
                "g",
                {
                  onMousedown: m,
                  onMouseenter: b,
                  onMouseout: B
                },
                ae(xo, {
                  position: S,
                  centerX: R,
                  centerY: te,
                  radius: o.value,
                  "data-type": "source"
                })
              )
            ] : null,
            e.updatable === "target" || e.updatable === !0 ? [
              ae(
                "g",
                {
                  onMousedown: T,
                  onMouseenter: b,
                  onMouseout: B
                },
                ae(xo, {
                  position: X,
                  centerX: ie,
                  centerY: ee,
                  radius: o.value,
                  "data-type": "target"
                })
              )
            ] : null
          ]
        ]
      );
    };
  }
}), Eu = ku, Nu = {
  height: "0",
  width: "0"
}, Su = {
  name: "EdgeLabelRenderer"
}, Mu = /* @__PURE__ */ se({
  ...Su,
  setup(e) {
    const { viewportRef: t } = ce(), n = K(() => {
      var o;
      return (o = t.value) == null ? void 0 : o.getElementsByClassName("vue-flow__edge-labels")[0];
    });
    return (o, a) => (j(), q("svg", null, [
      (j(), q("foreignObject", Nu, [
        (j(), ve(ol, {
          to: I(n),
          disabled: !I(n)
        }, [
          _e(o.$slots, "default")
        ], 8, ["to", "disabled"]))
      ]))
    ]));
  }
}), Cu = { class: "vue-flow__connection" }, Pu = ["d", "marker-end", "marker-start"], $u = {
  name: "ConnectionLine"
}, zu = /* @__PURE__ */ se({
  ...$u,
  props: {
    sourceNode: null
  },
  setup(e) {
    var t, n, o;
    const a = ce(), l = N(a, "getNodes"), r = N(a, "connectionMode"), i = N(a, "connectionStartHandle"), u = N(a, "connectionPosition"), s = N(a, "connectionLineType"), c = N(a, "connectionLineStyle"), d = N(a, "connectionLineOptions"), h = N(a, "viewport"), f = (t = qe(qt)) == null ? void 0 : t["connection-line"], w = f == null ? void 0 : f({}), k = i.value.handleId;
    i.value.nodeId;
    const E = i.value.type, g = (r.value === et.Strict ? (n = e.sourceNode.handleBounds[E]) == null ? void 0 : n.find((D) => D.id === k) : [...e.sourceNode.handleBounds.source || [], ...e.sourceNode.handleBounds.target || []].find((D) => D.id === k)) || ((o = e.sourceNode.handleBounds[E ?? "source"]) == null ? void 0 : o[0]), b = g ? g.x + g.width / 2 : e.sourceNode.dimensions.width / 2, B = g ? g.y + g.height / 2 : e.sourceNode.dimensions.height, y = e.sourceNode.computedPosition.x + b, $ = e.sourceNode.computedPosition.y + B, p = (g == null ? void 0 : g.position) === F.Left || (g == null ? void 0 : g.position) === F.Right ? F.Left : F.Top, _ = K(() => (u.value.x - h.value.x) / h.value.zoom), M = K(() => (u.value.y - h.value.y) / h.value.zoom), z = K(() => {
      let D = `M${y},${$} ${_.value},${M.value}`;
      const U = {
        sourceX: y,
        sourceY: $,
        sourcePosition: g == null ? void 0 : g.position,
        targetX: _.value,
        targetY: M.value,
        targetPosition: p
      };
      switch (s.value || d.value.type) {
        case Le.Bezier:
          [D] = Dn(U);
          break;
        case Le.Step:
          [D] = xn({
            ...U,
            borderRadius: 0
          });
          break;
        case Le.SmoothStep:
          [D] = xn(U);
          break;
        case Le.SimpleBezier:
          [D] = Va(U);
          break;
      }
      return D;
    });
    return (D, U) => {
      var Q;
      return j(), q("g", Cu, [
        I(w) ? (j(), ve(Mn(I(f)), cl(ht({ key: 0 }, {
          sourceX: y,
          sourceY: $,
          sourcePosition: (Q = I(g)) == null ? void 0 : Q.position,
          targetX: _.value,
          targetY: M.value,
          targetPosition: I(p),
          nodes: l.value,
          sourceNode: e.sourceNode,
          sourceHandle: I(g),
          markerEnd: `url(#${I(De)(d.value.markerEnd)})`,
          markerStart: `url(#${I(De)(d.value.markerStart)})`
        })), null, 16)) : (j(), q("path", {
          key: 1,
          d: I(z),
          class: Ie(["vue-flow__connection-path", d.value.class]),
          style: Se(c.value || d.value.style || {}),
          "marker-end": `url(#${I(De)(d.value.markerEnd)})`,
          "marker-start": `url(#${I(De)(d.value.markerStart)})`
        }, null, 14, Pu))
      ]);
    };
  }
}), Bu = {
  name: "NodesSelection"
}, Tu = /* @__PURE__ */ se({
  ...Bu,
  setup(e) {
    const t = ce(), n = N(t, "emits");
    N(t, "setState");
    const o = N(t, "viewport"), a = N(t, "getSelectedNodes");
    N(t, "snapToGrid"), N(t, "snapGrid");
    const l = N(t, "noPanClassName"), r = W(), i = Oa({
      el: r,
      onStart(d, h, f) {
        n.value.selectionDragStart({ event: d, node: h, nodes: f });
      },
      onDrag(d, h, f) {
        n.value.selectionDrag({ event: d, node: h, nodes: f });
      },
      onStop(d, h, f) {
        n.value.selectionDragStop({ event: d, node: h, nodes: f });
      }
    }), u = K(() => ha(a.value)), s = K(() => ({
      width: `${u.value.width}px`,
      height: `${u.value.height}px`,
      top: `${u.value.y}px`,
      left: `${u.value.x}px`
    })), c = (d) => n.value.selectionContextMenu({ event: d, nodes: a.value });
    return (d, h) => (j(), q("div", {
      class: Ie(["vue-flow__nodesselection vue-flow__container", l.value]),
      style: Se({ transform: `translate(${o.value.x}px,${o.value.y}px) scale(${o.value.zoom})` })
    }, [
      ue("div", {
        ref_key: "el",
        ref: r,
        class: Ie([{ dragging: I(i) }, "vue-flow__nodesselection-rect"]),
        style: Se(I(s)),
        onContextmenu: c
      }, null, 38)
    ], 6));
  }
}), Ou = {
  name: "SelectionRect"
}, Iu = /* @__PURE__ */ se({
  ...Ou,
  props: {
    width: null,
    height: null,
    x: null,
    y: null
  },
  setup(e) {
    return (t, n) => (j(), q("div", {
      class: "vue-flow__selection",
      style: Se({
        width: `${e.width}px`,
        height: `${e.height}px`,
        transform: `translate(${e.x}px, ${e.y}px)`
      })
    }, null, 4));
  }
});
function Eo(e) {
  const t = e.target.closest(".vue-flow");
  if (!t)
    return;
  const n = t.getBoundingClientRect();
  return {
    x: e.clientX - n.left,
    y: e.clientY - n.top
  };
}
const Au = {
  name: "UserSelection"
}, Vu = /* @__PURE__ */ se({
  ...Au,
  setup(e) {
    const { userSelectionActive: t, nodesSelectionActive: n, getNodes: o, getEdges: a, viewport: l, addSelectedElements: r } = ce();
    let i = W(0), u = W(0);
    const s = () => ({
      width: 0,
      height: 0,
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
      draw: !1
    });
    let c = W(s());
    const d = () => {
      c.value = s(), i.value = 0, u.value = 0, t.value = !1;
    }, h = (k) => {
      const E = Eo(k);
      !E || (c.value = {
        width: 0,
        height: 0,
        startX: E.x,
        startY: E.y,
        x: E.x,
        y: E.y,
        draw: !0
      }, t.value = !0);
    }, f = (k) => {
      if (!t || !c.value.draw)
        return;
      const E = Eo(k);
      if (!E)
        return;
      const g = c.value.startX, b = c.value.startY, B = {
        ...c.value,
        x: E.x < g ? E.x : c.value.x,
        y: E.y < b ? E.y : c.value.y,
        width: Math.abs(E.x - g),
        height: Math.abs(E.y - b)
      }, y = va(o.value, c.value, l.value), $ = Kt(y, a.value);
      c.value = B, r([...y, ...$]), i.value = y.length, u.value = $.length;
    }, w = () => {
      c.value = s(), n.value = i.value > 0, t.value = !1;
    };
    return wt(d), (k, E) => (j(), q("div", {
      class: "vue-flow__selectionpane vue-flow__container",
      onMousedown: h,
      onMousemove: f,
      onClick: w,
      onMouseup: w
    }, [
      c.value.draw ? (j(), ve(Iu, {
        key: 0,
        width: c.value.width,
        height: c.value.height,
        x: c.value.x,
        y: c.value.y
      }, null, 8, ["width", "height", "x", "y"])) : de("", !0)
    ], 32));
  }
}), Xu = {
  input: rr,
  default: lr,
  output: ir
}, Du = {
  default: uu,
  straight: pu,
  step: vu,
  smoothstep: Xa,
  simplebezier: su
}, Lu = () => ({
  vueFlowRef: null,
  viewportRef: null,
  nodes: [],
  edges: [],
  nodeTypes: {},
  edgeTypes: {},
  initialized: !1,
  dimensions: {
    width: 0,
    height: 0
  },
  viewport: { x: 0, y: 0, zoom: 1 },
  d3Zoom: null,
  d3Selection: null,
  d3ZoomHandler: null,
  minZoom: 0.5,
  maxZoom: 2,
  translateExtent: [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
  ],
  nodeExtent: [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
  ],
  preventScrolling: !0,
  zoomOnScroll: !0,
  zoomOnPinch: !0,
  zoomOnDoubleClick: !0,
  panOnScroll: !1,
  panOnScrollSpeed: 0.5,
  panOnScrollMode: Rt.Free,
  panOnDrag: !0,
  edgeUpdaterRadius: 10,
  onlyRenderVisibleElements: !1,
  defaultZoom: 1,
  defaultPosition: [0, 0],
  nodesSelectionActive: !1,
  userSelectionActive: !1,
  defaultMarkerColor: "#b1b1b7",
  connectionLineStyle: {},
  connectionLineType: Le.Bezier,
  connectionLineOptions: {
    type: Le.Bezier,
    style: {}
  },
  connectionMode: et.Loose,
  connectionStartHandle: null,
  connectionClickStartHandle: null,
  connectionPosition: { x: NaN, y: NaN },
  connectOnClick: !0,
  snapGrid: [15, 15],
  snapToGrid: !1,
  edgesUpdatable: !1,
  nodesConnectable: !0,
  nodesDraggable: !0,
  elementsSelectable: !0,
  selectNodesOnDrag: !0,
  multiSelectionActive: !1,
  selectionKeyCode: "Shift",
  multiSelectionKeyCode: "Meta",
  zoomActivationKeyCode: "Meta",
  deleteKeyCode: "Backspace",
  hooks: jl(),
  applyDefault: !0,
  autoConnect: !1,
  fitViewOnInit: !1,
  noDragClassName: "nodrag",
  noWheelClassName: "nowheel",
  noPanClassName: "nopan",
  defaultEdgeOptions: void 0,
  elevateEdgesOnSelect: !1,
  __experimentalFeatures: {
    nestedFlow: !1
  },
  vueFlowVersion: "1.5.11"
});
function La(e) {
  const t = Lu();
  return e && Object.keys(e).forEach((n) => {
    const o = e[n];
    le(o) && (t[n] = o);
  }), t;
}
function Ru(e) {
  const t = K(() => e.nodes.map((w) => w.id)), n = K(() => e.edges.map((w) => w.id)), o = K(() => (w) => e.nodes && !t.value.length ? e.nodes.find((k) => k.id === w) : e.nodes[t.value.indexOf(w)]), a = K(() => (w) => e.edges && !n.value.length ? e.edges.find((k) => k.id === w) : e.edges[n.value.indexOf(w)]), l = K(() => {
    var w;
    const k = {
      ...Du,
      ...e.edgeTypes
    }, E = Object.keys(k);
    return (w = e.edges) == null || w.forEach((g) => g.type && !E.includes(g.type) && (k[g.type] = g.type)), k;
  }), r = K(() => {
    var w;
    const k = {
      ...Xu,
      ...e.nodeTypes
    }, E = Object.keys(k);
    return (w = e.nodes) == null || w.forEach((g) => g.type && !E.includes(g.type) && (k[g.type] = g.type)), k;
  }), i = K(() => {
    const w = e.nodes.filter((k) => !k.hidden);
    return e.onlyRenderVisibleElements ? w && va(
      w,
      {
        x: 0,
        y: 0,
        width: e.dimensions.width,
        height: e.dimensions.height
      },
      e.viewport,
      !0
    ) : w ?? [];
  }), u = (w, k, E) => {
    if (k = k ?? o.value(w.source), E = E ?? o.value(w.target), !k || !E) {
      e.edges = e.edges.filter((g) => g.id !== w.id), pe(`Orphaned edge ${w.id} removed.`);
      return;
    }
    return !w.hidden && !E.hidden && !k.hidden;
  }, s = K(() => e.onlyRenderVisibleElements ? e.edges.filter((w) => {
    const k = o.value(w.source), E = o.value(w.target);
    return u(w, k, E) && xu({
      sourcePos: k.computedPosition || { x: 0, y: 0 },
      targetPos: E.computedPosition || { x: 0, y: 0 },
      sourceWidth: k.dimensions.width,
      sourceHeight: k.dimensions.height,
      targetWidth: E.dimensions.width,
      targetHeight: E.dimensions.height,
      width: e.dimensions.width,
      height: e.dimensions.height,
      viewport: e.viewport
    });
  }) : e.edges.filter((w) => u(w))), c = K(() => [...i.value, ...s.value]), d = K(() => e.nodes.filter((w) => w.selected)), h = K(() => e.edges.filter((w) => w.selected)), f = K(() => {
    var w, k;
    return [
      ...(w = d.value) != null ? w : [],
      ...(k = h.value) != null ? k : []
    ];
  });
  return {
    getNode: o,
    getEdge: a,
    getElements: c,
    getEdgeTypes: l,
    getNodeTypes: r,
    getEdges: s,
    getNodes: i,
    getSelectedElements: f,
    getSelectedNodes: d,
    getSelectedEdges: h
  };
}
function Fn(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Ra(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t)
    n[o] = t[o];
  return n;
}
function Nt() {
}
var pt = 0.7, Yt = 1 / pt, Ge = "\\s*([+-]?\\d+)\\s*", gt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ee = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Hu = /^#([0-9a-f]{3,8})$/, Yu = new RegExp(`^rgb\\(${Ge},${Ge},${Ge}\\)$`), ju = new RegExp(`^rgb\\(${Ee},${Ee},${Ee}\\)$`), Fu = new RegExp(`^rgba\\(${Ge},${Ge},${Ge},${gt}\\)$`), Zu = new RegExp(`^rgba\\(${Ee},${Ee},${Ee},${gt}\\)$`), Uu = new RegExp(`^hsl\\(${gt},${Ee},${Ee}\\)$`), Wu = new RegExp(`^hsla\\(${gt},${Ee},${Ee},${gt}\\)$`), No = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Fn(Nt, mt, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: So,
  formatHex: So,
  formatHex8: Gu,
  formatHsl: Ku,
  formatRgb: Mo,
  toString: Mo
});
function So() {
  return this.rgb().formatHex();
}
function Gu() {
  return this.rgb().formatHex8();
}
function Ku() {
  return Ha(this).formatHsl();
}
function Mo() {
  return this.rgb().formatRgb();
}
function mt(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Hu.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Co(t) : n === 3 ? new he(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? $t(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? $t(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Yu.exec(e)) ? new he(t[1], t[2], t[3], 1) : (t = ju.exec(e)) ? new he(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Fu.exec(e)) ? $t(t[1], t[2], t[3], t[4]) : (t = Zu.exec(e)) ? $t(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Uu.exec(e)) ? zo(t[1], t[2] / 100, t[3] / 100, 1) : (t = Wu.exec(e)) ? zo(t[1], t[2] / 100, t[3] / 100, t[4]) : No.hasOwnProperty(e) ? Co(No[e]) : e === "transparent" ? new he(NaN, NaN, NaN, 0) : null;
}
function Co(e) {
  return new he(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function $t(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new he(e, t, n, o);
}
function qu(e) {
  return e instanceof Nt || (e = mt(e)), e ? (e = e.rgb(), new he(e.r, e.g, e.b, e.opacity)) : new he();
}
function _n(e, t, n, o) {
  return arguments.length === 1 ? qu(e) : new he(e, t, n, o ?? 1);
}
function he(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
Fn(he, _n, Ra(Nt, {
  brighter(e) {
    return e = e == null ? Yt : Math.pow(Yt, e), new he(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? pt : Math.pow(pt, e), new he(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new he(He(this.r), He(this.g), He(this.b), jt(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Po,
  formatHex: Po,
  formatHex8: Qu,
  formatRgb: $o,
  toString: $o
}));
function Po() {
  return `#${Re(this.r)}${Re(this.g)}${Re(this.b)}`;
}
function Qu() {
  return `#${Re(this.r)}${Re(this.g)}${Re(this.b)}${Re((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function $o() {
  const e = jt(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${He(this.r)}, ${He(this.g)}, ${He(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function jt(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function He(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Re(e) {
  return e = He(e), (e < 16 ? "0" : "") + e.toString(16);
}
function zo(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new ye(e, t, n, o);
}
function Ha(e) {
  if (e instanceof ye)
    return new ye(e.h, e.s, e.l, e.opacity);
  if (e instanceof Nt || (e = mt(e)), !e)
    return new ye();
  if (e instanceof ye)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, a = Math.min(t, n, o), l = Math.max(t, n, o), r = NaN, i = l - a, u = (l + a) / 2;
  return i ? (t === l ? r = (n - o) / i + (n < o) * 6 : n === l ? r = (o - t) / i + 2 : r = (t - n) / i + 4, i /= u < 0.5 ? l + a : 2 - l - a, r *= 60) : i = u > 0 && u < 1 ? 0 : r, new ye(r, i, u, e.opacity);
}
function Ju(e, t, n, o) {
  return arguments.length === 1 ? Ha(e) : new ye(e, t, n, o ?? 1);
}
function ye(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
Fn(ye, Ju, Ra(Nt, {
  brighter(e) {
    return e = e == null ? Yt : Math.pow(Yt, e), new ye(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? pt : Math.pow(pt, e), new ye(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, a = 2 * n - o;
    return new he(
      un(e >= 240 ? e - 240 : e + 120, a, o),
      un(e, a, o),
      un(e < 120 ? e + 240 : e - 120, a, o),
      this.opacity
    );
  },
  clamp() {
    return new ye(Bo(this.h), zt(this.s), zt(this.l), jt(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = jt(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Bo(this.h)}, ${zt(this.s) * 100}%, ${zt(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Bo(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function zt(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function un(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Ya = (e) => () => e;
function es(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function ts(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function ns(e) {
  return (e = +e) == 1 ? ja : function(t, n) {
    return n - t ? ts(t, n, e) : Ya(isNaN(t) ? n : t);
  };
}
function ja(e, t) {
  var n = t - e;
  return n ? es(e, n) : Ya(isNaN(e) ? t : e);
}
const To = function e(t) {
  var n = ns(t);
  function o(a, l) {
    var r = n((a = _n(a)).r, (l = _n(l)).r), i = n(a.g, l.g), u = n(a.b, l.b), s = ja(a.opacity, l.opacity);
    return function(c) {
      return a.r = r(c), a.g = i(c), a.b = u(c), a.opacity = s(c), a + "";
    };
  }
  return o.gamma = e, o;
}(1);
function Be(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
var kn = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, sn = new RegExp(kn.source, "g");
function os(e) {
  return function() {
    return e;
  };
}
function as(e) {
  return function(t) {
    return e(t) + "";
  };
}
function ls(e, t) {
  var n = kn.lastIndex = sn.lastIndex = 0, o, a, l, r = -1, i = [], u = [];
  for (e = e + "", t = t + ""; (o = kn.exec(e)) && (a = sn.exec(t)); )
    (l = a.index) > n && (l = t.slice(n, l), i[r] ? i[r] += l : i[++r] = l), (o = o[0]) === (a = a[0]) ? i[r] ? i[r] += a : i[++r] = a : (i[++r] = null, u.push({ i: r, x: Be(o, a) })), n = sn.lastIndex;
  return n < t.length && (l = t.slice(n), i[r] ? i[r] += l : i[++r] = l), i.length < 2 ? u[0] ? as(u[0].x) : os(t) : (t = u.length, function(s) {
    for (var c = 0, d; c < t; ++c)
      i[(d = u[c]).i] = d.x(s);
    return i.join("");
  });
}
var Oo = 180 / Math.PI, Fa = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Za(e, t, n, o, a, l) {
  var r, i, u;
  return (r = Math.sqrt(e * e + t * t)) && (e /= r, t /= r), (u = e * n + t * o) && (n -= e * u, o -= t * u), (i = Math.sqrt(n * n + o * o)) && (n /= i, o /= i, u /= i), e * o < t * n && (e = -e, t = -t, u = -u, r = -r), {
    translateX: a,
    translateY: l,
    rotate: Math.atan2(t, e) * Oo,
    skewX: Math.atan(u) * Oo,
    scaleX: r,
    scaleY: i
  };
}
var Bt;
function rs(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Fa : Za(t.a, t.b, t.c, t.d, t.e, t.f);
}
function is(e) {
  return e == null || (Bt || (Bt = document.createElementNS("http://www.w3.org/2000/svg", "g")), Bt.setAttribute("transform", e), !(e = Bt.transform.baseVal.consolidate())) ? Fa : (e = e.matrix, Za(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Ua(e, t, n, o) {
  function a(s) {
    return s.length ? s.pop() + " " : "";
  }
  function l(s, c, d, h, f, w) {
    if (s !== d || c !== h) {
      var k = f.push("translate(", null, t, null, n);
      w.push({ i: k - 4, x: Be(s, d) }, { i: k - 2, x: Be(c, h) });
    } else
      (d || h) && f.push("translate(" + d + t + h + n);
  }
  function r(s, c, d, h) {
    s !== c ? (s - c > 180 ? c += 360 : c - s > 180 && (s += 360), h.push({ i: d.push(a(d) + "rotate(", null, o) - 2, x: Be(s, c) })) : c && d.push(a(d) + "rotate(" + c + o);
  }
  function i(s, c, d, h) {
    s !== c ? h.push({ i: d.push(a(d) + "skewX(", null, o) - 2, x: Be(s, c) }) : c && d.push(a(d) + "skewX(" + c + o);
  }
  function u(s, c, d, h, f, w) {
    if (s !== d || c !== h) {
      var k = f.push(a(f) + "scale(", null, ",", null, ")");
      w.push({ i: k - 4, x: Be(s, d) }, { i: k - 2, x: Be(c, h) });
    } else
      (d !== 1 || h !== 1) && f.push(a(f) + "scale(" + d + "," + h + ")");
  }
  return function(s, c) {
    var d = [], h = [];
    return s = e(s), c = e(c), l(s.translateX, s.translateY, c.translateX, c.translateY, d, h), r(s.rotate, c.rotate, d, h), i(s.skewX, c.skewX, d, h), u(s.scaleX, s.scaleY, c.scaleX, c.scaleY, d, h), s = c = null, function(f) {
      for (var w = -1, k = h.length, E; ++w < k; )
        d[(E = h[w]).i] = E.x(f);
      return d.join("");
    };
  };
}
var us = Ua(rs, "px, ", "px)", "deg)"), ss = Ua(is, ", ", ")", ")"), cs = 1e-12;
function Io(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function ds(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function hs(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const vs = function e(t, n, o) {
  function a(l, r) {
    var i = l[0], u = l[1], s = l[2], c = r[0], d = r[1], h = r[2], f = c - i, w = d - u, k = f * f + w * w, E, g;
    if (k < cs)
      g = Math.log(h / s) / t, E = function(_) {
        return [
          i + _ * f,
          u + _ * w,
          s * Math.exp(t * _ * g)
        ];
      };
    else {
      var b = Math.sqrt(k), B = (h * h - s * s + o * k) / (2 * s * n * b), y = (h * h - s * s - o * k) / (2 * h * n * b), $ = Math.log(Math.sqrt(B * B + 1) - B), p = Math.log(Math.sqrt(y * y + 1) - y);
      g = (p - $) / t, E = function(_) {
        var M = _ * g, z = Io($), D = s / (n * b) * (z * hs(t * M + $) - ds($));
        return [
          i + D * f,
          u + D * w,
          s * z / Io(t * M + $)
        ];
      };
    }
    return E.duration = g * 1e3 * t / Math.SQRT2, E;
  }
  return a.rho = function(l) {
    var r = Math.max(1e-3, +l), i = r * r, u = i * i;
    return e(r, i, u);
  }, a;
}(Math.SQRT2, 2, 4);
var ot = 0, it = 0, lt = 0, Wa = 1e3, Ft, ut, Zt = 0, Ye = 0, tn = 0, yt = typeof performance == "object" && performance.now ? performance : Date, Ga = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Zn() {
  return Ye || (Ga(fs), Ye = yt.now() + tn);
}
function fs() {
  Ye = 0;
}
function Ut() {
  this._call = this._time = this._next = null;
}
Ut.prototype = Ka.prototype = {
  constructor: Ut,
  restart: function(e, t, n) {
    if (typeof e != "function")
      throw new TypeError("callback is not a function");
    n = (n == null ? Zn() : +n) + (t == null ? 0 : +t), !this._next && ut !== this && (ut ? ut._next = this : Ft = this, ut = this), this._call = e, this._time = n, En();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, En());
  }
};
function Ka(e, t, n) {
  var o = new Ut();
  return o.restart(e, t, n), o;
}
function ps() {
  Zn(), ++ot;
  for (var e = Ft, t; e; )
    (t = Ye - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --ot;
}
function Ao() {
  Ye = (Zt = yt.now()) + tn, ot = it = 0;
  try {
    ps();
  } finally {
    ot = 0, ms(), Ye = 0;
  }
}
function gs() {
  var e = yt.now(), t = e - Zt;
  t > Wa && (tn -= t, Zt = e);
}
function ms() {
  for (var e, t = Ft, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Ft = n);
  ut = e, En(o);
}
function En(e) {
  if (!ot) {
    it && (it = clearTimeout(it));
    var t = e - Ye;
    t > 24 ? (e < 1 / 0 && (it = setTimeout(Ao, e - yt.now() - tn)), lt && (lt = clearInterval(lt))) : (lt || (Zt = yt.now(), lt = setInterval(gs, Wa)), ot = 1, Ga(Ao));
  }
}
function Vo(e, t, n) {
  var o = new Ut();
  return t = t == null ? 0 : +t, o.restart((a) => {
    o.stop(), e(a + t);
  }, t, n), o;
}
var ys = Qt("start", "end", "cancel", "interrupt"), bs = [], qa = 0, Xo = 1, Nn = 2, At = 3, Do = 4, Sn = 5, Vt = 6;
function nn(e, t, n, o, a, l) {
  var r = e.__transition;
  if (!r)
    e.__transition = {};
  else if (n in r)
    return;
  ws(e, n, {
    name: t,
    index: o,
    group: a,
    on: ys,
    tween: bs,
    time: l.time,
    delay: l.delay,
    duration: l.duration,
    ease: l.ease,
    timer: null,
    state: qa
  });
}
function Un(e, t) {
  var n = we(e, t);
  if (n.state > qa)
    throw new Error("too late; already scheduled");
  return n;
}
function Me(e, t) {
  var n = we(e, t);
  if (n.state > At)
    throw new Error("too late; already running");
  return n;
}
function we(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t]))
    throw new Error("transition not found");
  return n;
}
function ws(e, t, n) {
  var o = e.__transition, a;
  o[t] = n, n.timer = Ka(l, 0, n.time);
  function l(s) {
    n.state = Xo, n.timer.restart(r, n.delay, n.time), n.delay <= s && r(s - n.delay);
  }
  function r(s) {
    var c, d, h, f;
    if (n.state !== Xo)
      return u();
    for (c in o)
      if (f = o[c], f.name === n.name) {
        if (f.state === At)
          return Vo(r);
        f.state === Do ? (f.state = Vt, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete o[c]) : +c < t && (f.state = Vt, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete o[c]);
      }
    if (Vo(function() {
      n.state === At && (n.state = Do, n.timer.restart(i, n.delay, n.time), i(s));
    }), n.state = Nn, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Nn) {
      for (n.state = At, a = new Array(h = n.tween.length), c = 0, d = -1; c < h; ++c)
        (f = n.tween[c].value.call(e, e.__data__, n.index, n.group)) && (a[++d] = f);
      a.length = d + 1;
    }
  }
  function i(s) {
    for (var c = s < n.duration ? n.ease.call(null, s / n.duration) : (n.timer.restart(u), n.state = Sn, 1), d = -1, h = a.length; ++d < h; )
      a[d].call(e, c);
    n.state === Sn && (n.on.call("end", e, e.__data__, n.index, n.group), u());
  }
  function u() {
    n.state = Vt, n.timer.stop(), delete o[t];
    for (var s in o)
      return;
    delete e.__transition;
  }
}
function Xt(e, t) {
  var n = e.__transition, o, a, l = !0, r;
  if (n) {
    t = t == null ? null : t + "";
    for (r in n) {
      if ((o = n[r]).name !== t) {
        l = !1;
        continue;
      }
      a = o.state > Nn && o.state < Sn, o.state = Vt, o.timer.stop(), o.on.call(a ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[r];
    }
    l && delete e.__transition;
  }
}
function xs(e) {
  return this.each(function() {
    Xt(this, e);
  });
}
function _s(e, t) {
  var n, o;
  return function() {
    var a = Me(this, e), l = a.tween;
    if (l !== n) {
      o = n = l;
      for (var r = 0, i = o.length; r < i; ++r)
        if (o[r].name === t) {
          o = o.slice(), o.splice(r, 1);
          break;
        }
    }
    a.tween = o;
  };
}
function ks(e, t, n) {
  var o, a;
  if (typeof n != "function")
    throw new Error();
  return function() {
    var l = Me(this, e), r = l.tween;
    if (r !== o) {
      a = (o = r).slice();
      for (var i = { name: t, value: n }, u = 0, s = a.length; u < s; ++u)
        if (a[u].name === t) {
          a[u] = i;
          break;
        }
      u === s && a.push(i);
    }
    l.tween = a;
  };
}
function Es(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = we(this.node(), n).tween, a = 0, l = o.length, r; a < l; ++a)
      if ((r = o[a]).name === e)
        return r.value;
    return null;
  }
  return this.each((t == null ? _s : ks)(n, e, t));
}
function Wn(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var a = Me(this, o);
    (a.value || (a.value = {}))[t] = n.apply(this, arguments);
  }), function(a) {
    return we(a, o).value[t];
  };
}
function Qa(e, t) {
  var n;
  return (typeof t == "number" ? Be : t instanceof mt ? To : (n = mt(t)) ? (t = n, To) : ls)(e, t);
}
function Ns(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Ss(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Ms(e, t, n) {
  var o, a = n + "", l;
  return function() {
    var r = this.getAttribute(e);
    return r === a ? null : r === o ? l : l = t(o = r, n);
  };
}
function Cs(e, t, n) {
  var o, a = n + "", l;
  return function() {
    var r = this.getAttributeNS(e.space, e.local);
    return r === a ? null : r === o ? l : l = t(o = r, n);
  };
}
function Ps(e, t, n) {
  var o, a, l;
  return function() {
    var r, i = n(this), u;
    return i == null ? void this.removeAttribute(e) : (r = this.getAttribute(e), u = i + "", r === u ? null : r === o && u === a ? l : (a = u, l = t(o = r, i)));
  };
}
function $s(e, t, n) {
  var o, a, l;
  return function() {
    var r, i = n(this), u;
    return i == null ? void this.removeAttributeNS(e.space, e.local) : (r = this.getAttributeNS(e.space, e.local), u = i + "", r === u ? null : r === o && u === a ? l : (a = u, l = t(o = r, i)));
  };
}
function zs(e, t) {
  var n = Jt(e), o = n === "transform" ? ss : Qa;
  return this.attrTween(e, typeof t == "function" ? (n.local ? $s : Ps)(n, o, Wn(this, "attr." + e, t)) : t == null ? (n.local ? Ss : Ns)(n) : (n.local ? Cs : Ms)(n, o, t));
}
function Bs(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function Ts(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function Os(e, t) {
  var n, o;
  function a() {
    var l = t.apply(this, arguments);
    return l !== o && (n = (o = l) && Ts(e, l)), n;
  }
  return a._value = t, a;
}
function Is(e, t) {
  var n, o;
  function a() {
    var l = t.apply(this, arguments);
    return l !== o && (n = (o = l) && Bs(e, l)), n;
  }
  return a._value = t, a;
}
function As(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2)
    return (n = this.tween(n)) && n._value;
  if (t == null)
    return this.tween(n, null);
  if (typeof t != "function")
    throw new Error();
  var o = Jt(e);
  return this.tween(n, (o.local ? Os : Is)(o, t));
}
function Vs(e, t) {
  return function() {
    Un(this, e).delay = +t.apply(this, arguments);
  };
}
function Xs(e, t) {
  return t = +t, function() {
    Un(this, e).delay = t;
  };
}
function Ds(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Vs : Xs)(t, e)) : we(this.node(), t).delay;
}
function Ls(e, t) {
  return function() {
    Me(this, e).duration = +t.apply(this, arguments);
  };
}
function Rs(e, t) {
  return t = +t, function() {
    Me(this, e).duration = t;
  };
}
function Hs(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Ls : Rs)(t, e)) : we(this.node(), t).duration;
}
function Ys(e, t) {
  if (typeof t != "function")
    throw new Error();
  return function() {
    Me(this, e).ease = t;
  };
}
function js(e) {
  var t = this._id;
  return arguments.length ? this.each(Ys(t, e)) : we(this.node(), t).ease;
}
function Fs(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function")
      throw new Error();
    Me(this, e).ease = n;
  };
}
function Zs(e) {
  if (typeof e != "function")
    throw new Error();
  return this.each(Fs(this._id, e));
}
function Us(e) {
  typeof e != "function" && (e = _a(e));
  for (var t = this._groups, n = t.length, o = new Array(n), a = 0; a < n; ++a)
    for (var l = t[a], r = l.length, i = o[a] = [], u, s = 0; s < r; ++s)
      (u = l[s]) && e.call(u, u.__data__, s, l) && i.push(u);
  return new ze(o, this._parents, this._name, this._id);
}
function Ws(e) {
  if (e._id !== this._id)
    throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, a = n.length, l = Math.min(o, a), r = new Array(o), i = 0; i < l; ++i)
    for (var u = t[i], s = n[i], c = u.length, d = r[i] = new Array(c), h, f = 0; f < c; ++f)
      (h = u[f] || s[f]) && (d[f] = h);
  for (; i < o; ++i)
    r[i] = t[i];
  return new ze(r, this._parents, this._name, this._id);
}
function Gs(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function Ks(e, t, n) {
  var o, a, l = Gs(t) ? Un : Me;
  return function() {
    var r = l(this, e), i = r.on;
    i !== o && (a = (o = i).copy()).on(t, n), r.on = a;
  };
}
function qs(e, t) {
  var n = this._id;
  return arguments.length < 2 ? we(this.node(), n).on.on(e) : this.each(Ks(n, e, t));
}
function Qs(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition)
      if (+n !== e)
        return;
    t && t.removeChild(this);
  };
}
function Js() {
  return this.on("end.remove", Qs(this._id));
}
function ec(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = An(e));
  for (var o = this._groups, a = o.length, l = new Array(a), r = 0; r < a; ++r)
    for (var i = o[r], u = i.length, s = l[r] = new Array(u), c, d, h = 0; h < u; ++h)
      (c = i[h]) && (d = e.call(c, c.__data__, h, i)) && ("__data__" in c && (d.__data__ = c.__data__), s[h] = d, nn(s[h], t, n, h, s, we(c, n)));
  return new ze(l, this._parents, t, n);
}
function tc(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = xa(e));
  for (var o = this._groups, a = o.length, l = [], r = [], i = 0; i < a; ++i)
    for (var u = o[i], s = u.length, c, d = 0; d < s; ++d)
      if (c = u[d]) {
        for (var h = e.call(c, c.__data__, d, u), f, w = we(c, n), k = 0, E = h.length; k < E; ++k)
          (f = h[k]) && nn(f, t, n, k, h, w);
        l.push(h), r.push(c);
      }
  return new ze(l, r, t, n);
}
var nc = Et.prototype.constructor;
function oc() {
  return new nc(this._groups, this._parents);
}
function ac(e, t) {
  var n, o, a;
  return function() {
    var l = nt(this, e), r = (this.style.removeProperty(e), nt(this, e));
    return l === r ? null : l === n && r === o ? a : a = t(n = l, o = r);
  };
}
function Ja(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function lc(e, t, n) {
  var o, a = n + "", l;
  return function() {
    var r = nt(this, e);
    return r === a ? null : r === o ? l : l = t(o = r, n);
  };
}
function rc(e, t, n) {
  var o, a, l;
  return function() {
    var r = nt(this, e), i = n(this), u = i + "";
    return i == null && (u = i = (this.style.removeProperty(e), nt(this, e))), r === u ? null : r === o && u === a ? l : (a = u, l = t(o = r, i));
  };
}
function ic(e, t) {
  var n, o, a, l = "style." + t, r = "end." + l, i;
  return function() {
    var u = Me(this, e), s = u.on, c = u.value[l] == null ? i || (i = Ja(t)) : void 0;
    (s !== n || a !== c) && (o = (n = s).copy()).on(r, a = c), u.on = o;
  };
}
function uc(e, t, n) {
  var o = (e += "") == "transform" ? us : Qa;
  return t == null ? this.styleTween(e, ac(e, o)).on("end.style." + e, Ja(e)) : typeof t == "function" ? this.styleTween(e, rc(e, o, Wn(this, "style." + e, t))).each(ic(this._id, e)) : this.styleTween(e, lc(e, o, t), n).on("end.style." + e, null);
}
function sc(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function cc(e, t, n) {
  var o, a;
  function l() {
    var r = t.apply(this, arguments);
    return r !== a && (o = (a = r) && sc(e, r, n)), o;
  }
  return l._value = t, l;
}
function dc(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2)
    return (o = this.tween(o)) && o._value;
  if (t == null)
    return this.tween(o, null);
  if (typeof t != "function")
    throw new Error();
  return this.tween(o, cc(e, t, n ?? ""));
}
function hc(e) {
  return function() {
    this.textContent = e;
  };
}
function vc(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function fc(e) {
  return this.tween("text", typeof e == "function" ? vc(Wn(this, "text", e)) : hc(e == null ? "" : e + ""));
}
function pc(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function gc(e) {
  var t, n;
  function o() {
    var a = e.apply(this, arguments);
    return a !== n && (t = (n = a) && pc(a)), t;
  }
  return o._value = e, o;
}
function mc(e) {
  var t = "text";
  if (arguments.length < 1)
    return (t = this.tween(t)) && t._value;
  if (e == null)
    return this.tween(t, null);
  if (typeof e != "function")
    throw new Error();
  return this.tween(t, gc(e));
}
function yc() {
  for (var e = this._name, t = this._id, n = el(), o = this._groups, a = o.length, l = 0; l < a; ++l)
    for (var r = o[l], i = r.length, u, s = 0; s < i; ++s)
      if (u = r[s]) {
        var c = we(u, t);
        nn(u, e, n, s, r, {
          time: c.time + c.delay + c.duration,
          delay: 0,
          duration: c.duration,
          ease: c.ease
        });
      }
  return new ze(o, this._parents, e, n);
}
function bc() {
  var e, t, n = this, o = n._id, a = n.size();
  return new Promise(function(l, r) {
    var i = { value: r }, u = { value: function() {
      --a === 0 && l();
    } };
    n.each(function() {
      var s = Me(this, o), c = s.on;
      c !== e && (t = (e = c).copy(), t._.cancel.push(i), t._.interrupt.push(i), t._.end.push(u)), s.on = t;
    }), a === 0 && l();
  });
}
var wc = 0;
function ze(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function el() {
  return ++wc;
}
var Ce = Et.prototype;
ze.prototype = {
  constructor: ze,
  select: ec,
  selectAll: tc,
  selectChild: Ce.selectChild,
  selectChildren: Ce.selectChildren,
  filter: Us,
  merge: Ws,
  selection: oc,
  transition: yc,
  call: Ce.call,
  nodes: Ce.nodes,
  node: Ce.node,
  size: Ce.size,
  empty: Ce.empty,
  each: Ce.each,
  on: qs,
  attr: zs,
  attrTween: As,
  style: uc,
  styleTween: dc,
  text: fc,
  textTween: mc,
  remove: Js,
  tween: Es,
  delay: Ds,
  duration: Hs,
  ease: js,
  easeVarying: Zs,
  end: bc,
  [Symbol.iterator]: Ce[Symbol.iterator]
};
function xc(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var _c = {
  time: null,
  delay: 0,
  duration: 250,
  ease: xc
};
function kc(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function Ec(e) {
  var t, n;
  e instanceof ze ? (t = e._id, e = e._name) : (t = el(), (n = _c).time = Zn(), e = e == null ? null : e + "");
  for (var o = this._groups, a = o.length, l = 0; l < a; ++l)
    for (var r = o[l], i = r.length, u, s = 0; s < i; ++s)
      (u = r[s]) && nn(u, e, t, s, r, n || kc(u, t));
  return new ze(o, this._parents, e, t);
}
Et.prototype.interrupt = xs;
Et.prototype.transition = Ec;
const Tt = (e) => () => e;
function Nc(e, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: a
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: a }
  });
}
function $e(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
$e.prototype = {
  constructor: $e,
  scale: function(e) {
    return e === 1 ? this : new $e(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new $e(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var on = new $e(1, 0, 0);
$e.prototype;
function cn(e) {
  e.stopImmediatePropagation();
}
function rt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Sc(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Mc() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Lo() {
  return this.__zoom || on;
}
function Cc(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function Pc() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function $c(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], a = e.invertX(t[1][0]) - n[1][0], l = e.invertY(t[0][1]) - n[0][1], r = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    a > o ? (o + a) / 2 : Math.min(0, o) || Math.max(0, a),
    r > l ? (l + r) / 2 : Math.min(0, l) || Math.max(0, r)
  );
}
function zc() {
  var e = Sc, t = Mc, n = $c, o = Cc, a = Pc, l = [0, 1 / 0], r = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], i = 250, u = vs, s = Qt("start", "zoom", "end"), c, d, h, f = 500, w = 150, k = 0, E = 10;
  function g(m) {
    m.property("__zoom", Lo).on("wheel.zoom", M, { passive: !1 }).on("mousedown.zoom", z).on("dblclick.zoom", D).filter(a).on("touchstart.zoom", U).on("touchmove.zoom", Q).on("touchend.zoom touchcancel.zoom", ne).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  g.transform = function(m, T, x, P) {
    var V = m.selection ? m.selection() : m;
    V.property("__zoom", Lo), m !== V ? $(m, T, x, P) : V.interrupt().each(function() {
      p(this, arguments).event(P).start().zoom(null, typeof T == "function" ? T.apply(this, arguments) : T).end();
    });
  }, g.scaleBy = function(m, T, x, P) {
    g.scaleTo(m, function() {
      var V = this.__zoom.k, L = typeof T == "function" ? T.apply(this, arguments) : T;
      return V * L;
    }, x, P);
  }, g.scaleTo = function(m, T, x, P) {
    g.transform(m, function() {
      var V = t.apply(this, arguments), L = this.__zoom, S = x == null ? y(V) : typeof x == "function" ? x.apply(this, arguments) : x, X = L.invert(S), R = typeof T == "function" ? T.apply(this, arguments) : T;
      return n(B(b(L, R), S, X), V, r);
    }, x, P);
  }, g.translateBy = function(m, T, x, P) {
    g.transform(m, function() {
      return n(this.__zoom.translate(
        typeof T == "function" ? T.apply(this, arguments) : T,
        typeof x == "function" ? x.apply(this, arguments) : x
      ), t.apply(this, arguments), r);
    }, null, P);
  }, g.translateTo = function(m, T, x, P, V) {
    g.transform(m, function() {
      var L = t.apply(this, arguments), S = this.__zoom, X = P == null ? y(L) : typeof P == "function" ? P.apply(this, arguments) : P;
      return n(on.translate(X[0], X[1]).scale(S.k).translate(
        typeof T == "function" ? -T.apply(this, arguments) : -T,
        typeof x == "function" ? -x.apply(this, arguments) : -x
      ), L, r);
    }, P, V);
  };
  function b(m, T) {
    return T = Math.max(l[0], Math.min(l[1], T)), T === m.k ? m : new $e(T, m.x, m.y);
  }
  function B(m, T, x) {
    var P = T[0] - x[0] * m.k, V = T[1] - x[1] * m.k;
    return P === m.x && V === m.y ? m : new $e(m.k, P, V);
  }
  function y(m) {
    return [(+m[0][0] + +m[1][0]) / 2, (+m[0][1] + +m[1][1]) / 2];
  }
  function $(m, T, x, P) {
    m.on("start.zoom", function() {
      p(this, arguments).event(P).start();
    }).on("interrupt.zoom end.zoom", function() {
      p(this, arguments).event(P).end();
    }).tween("zoom", function() {
      var V = this, L = arguments, S = p(V, L).event(P), X = t.apply(V, L), R = x == null ? y(X) : typeof x == "function" ? x.apply(V, L) : x, te = Math.max(X[1][0] - X[0][0], X[1][1] - X[0][1]), ee = V.__zoom, ie = typeof T == "function" ? T.apply(V, L) : T, v = u(ee.invert(R).concat(te / ee.k), ie.invert(R).concat(te / ie.k));
      return function(C) {
        if (C === 1)
          C = ie;
        else {
          var O = v(C), A = te / O[2];
          C = new $e(A, R[0] - O[0] * A, R[1] - O[1] * A);
        }
        S.zoom(null, C);
      };
    });
  }
  function p(m, T, x) {
    return !x && m.__zooming || new _(m, T);
  }
  function _(m, T) {
    this.that = m, this.args = T, this.active = 0, this.sourceEvent = null, this.extent = t.apply(m, T), this.taps = 0;
  }
  _.prototype = {
    event: function(m) {
      return m && (this.sourceEvent = m), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(m, T) {
      return this.mouse && m !== "mouse" && (this.mouse[1] = T.invert(this.mouse[0])), this.touch0 && m !== "touch" && (this.touch0[1] = T.invert(this.touch0[0])), this.touch1 && m !== "touch" && (this.touch1[1] = T.invert(this.touch1[0])), this.that.__zoom = T, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(m) {
      var T = me(this.that).datum();
      s.call(
        m,
        this.that,
        new Nc(m, {
          sourceEvent: this.sourceEvent,
          target: g,
          type: m,
          transform: this.that.__zoom,
          dispatch: s
        }),
        T
      );
    }
  };
  function M(m, ...T) {
    if (!e.apply(this, arguments))
      return;
    var x = p(this, T).event(m), P = this.__zoom, V = Math.max(l[0], Math.min(l[1], P.k * Math.pow(2, o.apply(this, arguments)))), L = xe(m);
    if (x.wheel)
      (x.mouse[0][0] !== L[0] || x.mouse[0][1] !== L[1]) && (x.mouse[1] = P.invert(x.mouse[0] = L)), clearTimeout(x.wheel);
    else {
      if (P.k === V)
        return;
      x.mouse = [L, P.invert(L)], Xt(this), x.start();
    }
    rt(m), x.wheel = setTimeout(S, w), x.zoom("mouse", n(B(b(P, V), x.mouse[0], x.mouse[1]), x.extent, r));
    function S() {
      x.wheel = null, x.end();
    }
  }
  function z(m, ...T) {
    if (h || !e.apply(this, arguments))
      return;
    var x = m.currentTarget, P = p(this, T, !0).event(m), V = me(m.view).on("mousemove.zoom", R, !0).on("mouseup.zoom", te, !0), L = xe(m, x), S = m.clientX, X = m.clientY;
    Ba(m.view), cn(m), P.mouse = [L, this.__zoom.invert(L)], Xt(this), P.start();
    function R(ee) {
      if (rt(ee), !P.moved) {
        var ie = ee.clientX - S, v = ee.clientY - X;
        P.moved = ie * ie + v * v > k;
      }
      P.event(ee).zoom("mouse", n(B(P.that.__zoom, P.mouse[0] = xe(ee, x), P.mouse[1]), P.extent, r));
    }
    function te(ee) {
      V.on("mousemove.zoom mouseup.zoom", null), Ta(ee.view, P.moved), rt(ee), P.event(ee).end();
    }
  }
  function D(m, ...T) {
    if (e.apply(this, arguments)) {
      var x = this.__zoom, P = xe(m.changedTouches ? m.changedTouches[0] : m, this), V = x.invert(P), L = x.k * (m.shiftKey ? 0.5 : 2), S = n(B(b(x, L), P, V), t.apply(this, T), r);
      rt(m), i > 0 ? me(this).transition().duration(i).call($, S, P, m) : me(this).call(g.transform, S, P, m);
    }
  }
  function U(m, ...T) {
    if (e.apply(this, arguments)) {
      var x = m.touches, P = x.length, V = p(this, T, m.changedTouches.length === P).event(m), L, S, X, R;
      for (cn(m), S = 0; S < P; ++S)
        X = x[S], R = xe(X, this), R = [R, this.__zoom.invert(R), X.identifier], V.touch0 ? !V.touch1 && V.touch0[2] !== R[2] && (V.touch1 = R, V.taps = 0) : (V.touch0 = R, L = !0, V.taps = 1 + !!c);
      c && (c = clearTimeout(c)), L && (V.taps < 2 && (d = R[0], c = setTimeout(function() {
        c = null;
      }, f)), Xt(this), V.start());
    }
  }
  function Q(m, ...T) {
    if (this.__zooming) {
      var x = p(this, T).event(m), P = m.changedTouches, V = P.length, L, S, X, R;
      for (rt(m), L = 0; L < V; ++L)
        S = P[L], X = xe(S, this), x.touch0 && x.touch0[2] === S.identifier ? x.touch0[0] = X : x.touch1 && x.touch1[2] === S.identifier && (x.touch1[0] = X);
      if (S = x.that.__zoom, x.touch1) {
        var te = x.touch0[0], ee = x.touch0[1], ie = x.touch1[0], v = x.touch1[1], C = (C = ie[0] - te[0]) * C + (C = ie[1] - te[1]) * C, O = (O = v[0] - ee[0]) * O + (O = v[1] - ee[1]) * O;
        S = b(S, Math.sqrt(C / O)), X = [(te[0] + ie[0]) / 2, (te[1] + ie[1]) / 2], R = [(ee[0] + v[0]) / 2, (ee[1] + v[1]) / 2];
      } else if (x.touch0)
        X = x.touch0[0], R = x.touch0[1];
      else
        return;
      x.zoom("touch", n(B(S, X, R), x.extent, r));
    }
  }
  function ne(m, ...T) {
    if (this.__zooming) {
      var x = p(this, T).event(m), P = m.changedTouches, V = P.length, L, S;
      for (cn(m), h && clearTimeout(h), h = setTimeout(function() {
        h = null;
      }, f), L = 0; L < V; ++L)
        S = P[L], x.touch0 && x.touch0[2] === S.identifier ? delete x.touch0 : x.touch1 && x.touch1[2] === S.identifier && delete x.touch1;
      if (x.touch1 && !x.touch0 && (x.touch0 = x.touch1, delete x.touch1), x.touch0)
        x.touch0[1] = this.__zoom.invert(x.touch0[0]);
      else if (x.end(), x.taps === 2 && (S = xe(S, this), Math.hypot(d[0] - S[0], d[1] - S[1]) < E)) {
        var X = me(this).on("dblclick.zoom");
        X && X.apply(this, arguments);
      }
    }
  }
  return g.wheelDelta = function(m) {
    return arguments.length ? (o = typeof m == "function" ? m : Tt(+m), g) : o;
  }, g.filter = function(m) {
    return arguments.length ? (e = typeof m == "function" ? m : Tt(!!m), g) : e;
  }, g.touchable = function(m) {
    return arguments.length ? (a = typeof m == "function" ? m : Tt(!!m), g) : a;
  }, g.extent = function(m) {
    return arguments.length ? (t = typeof m == "function" ? m : Tt([[+m[0][0], +m[0][1]], [+m[1][0], +m[1][1]]]), g) : t;
  }, g.scaleExtent = function(m) {
    return arguments.length ? (l[0] = +m[0], l[1] = +m[1], g) : [l[0], l[1]];
  }, g.translateExtent = function(m) {
    return arguments.length ? (r[0][0] = +m[0][0], r[1][0] = +m[1][0], r[0][1] = +m[0][1], r[1][1] = +m[1][1], g) : [[r[0][0], r[0][1]], [r[1][0], r[1][1]]];
  }, g.constrain = function(m) {
    return arguments.length ? (n = m, g) : n;
  }, g.duration = function(m) {
    return arguments.length ? (i = +m, g) : i;
  }, g.interpolate = function(m) {
    return arguments.length ? (u = m, g) : u;
  }, g.on = function() {
    var m = s.on.apply(s, arguments);
    return m === s ? g : m;
  }, g.clickDistance = function(m) {
    return arguments.length ? (k = (m = +m) * m, g) : Math.sqrt(k);
  }, g.tapDistance = function(m) {
    return arguments.length ? (E = +m, g) : E;
  }, g;
}
const dn = 0.1, hn = (e, t = 0) => e.transition().duration(t), Fe = async (e, t) => ("screen" in _t() && (await Je(e).toMatch(({ height: o, width: a }) => !isNaN(a) && a > 0 && !isNaN(o) && o > 0), t.length > 0 && await Je(t).toMatch(
  (o) => !!o.filter(({ dimensions: { width: a, height: l } }) => !isNaN(a) && a > 0 && !isNaN(l) && l > 0).length
)), !0), Bc = (e) => {
  const t = ce({ id: e }), n = N(t, "onPaneReady"), o = N(t, "nodes"), a = N(t, "d3Zoom"), l = N(t, "d3Selection"), r = N(t, "dimensions"), i = N(t, "translateExtent"), u = N(t, "minZoom"), s = N(t, "maxZoom"), c = N(t, "viewport"), d = N(t, "snapToGrid"), h = N(t, "snapGrid"), f = N(t, "getNodes");
  let w = W(!1);
  n.value(() => w.value = !0);
  const k = async (y, $) => {
    w.value || await Fe(r.value, f.value), l.value && a.value && a.value.scaleTo(hn(l.value, $ == null ? void 0 : $.duration), y);
  }, E = async (y, $) => {
    w.value || await Fe(r.value, f.value), l.value && a.value && a.value.scaleBy(hn(l.value, $), y);
  }, g = async (y) => {
    await E(1.2, y == null ? void 0 : y.duration);
  }, b = async (y) => {
    await E(1 / 1.2, y == null ? void 0 : y.duration);
  }, B = (y, $, p, _) => {
    const { x: M, y: z } = $n({ x: -y, y: -$ }, i.value), D = on.translate(-M, -z).scale(p);
    l.value && a.value && a.value.transform(hn(l.value, _), D);
  };
  return {
    zoomIn: g,
    zoomOut: b,
    zoomTo: k,
    setTransform: async (y, $) => {
      w.value || await Fe(r.value, f.value), B(y.x, y.y, y.zoom, $ == null ? void 0 : $.duration);
    },
    getTransform: () => ({
      x: c.value.x,
      y: c.value.y,
      zoom: c.value.zoom
    }),
    fitView: async (y = {
      padding: dn,
      includeHiddenNodes: !1,
      duration: 0
    }) => {
      var $, p, _;
      if (w.value || await Fe(r.value, f.value), !f.value.length)
        return;
      let M = [];
      y.nodes && (M = o.value.filter((ne) => {
        var m;
        return (m = y.nodes) == null ? void 0 : m.includes(ne.id);
      })), (!M || !M.length) && (M = y.includeHiddenNodes ? M : f.value);
      const z = ha(M), { x: D, y: U, zoom: Q } = uo(
        z,
        r.value.width,
        r.value.height,
        ($ = y.minZoom) != null ? $ : u.value,
        (p = y.maxZoom) != null ? p : s.value,
        (_ = y.padding) != null ? _ : dn,
        y.offset
      );
      B(D, U, Q, y == null ? void 0 : y.duration);
    },
    setCenter: async (y, $, p) => {
      w.value || await Fe(r.value, f.value);
      const _ = typeof (p == null ? void 0 : p.zoom) < "u" ? p.zoom : s.value, M = r.value.width / 2 - y * _, z = r.value.height / 2 - $ * _;
      B(M, z, _, p == null ? void 0 : p.duration);
    },
    fitBounds: async (y, $ = { padding: dn }) => {
      w.value || await Fe(r.value, f.value);
      const { x: p, y: _, zoom: M } = uo(y, r.value.width, r.value.height, u.value, s.value, $.padding);
      B(p, _, M, $ == null ? void 0 : $.duration);
    },
    project: (y) => Bn(y, c.value, d.value, h.value)
  };
};
function Ro(e, t) {
  var n, o;
  if (t) {
    const a = e.position.x + e.dimensions.width - t.dimensions.width, l = e.position.y + e.dimensions.height - t.dimensions.height;
    if (a > 0 || l > 0 || e.position.x < 0 || e.position.y < 0) {
      if (t.style = { ...t.style }, t.style.width = (n = t.style.width) != null ? n : t.dimensions.width, t.style.height = (o = t.style.height) != null ? o : t.dimensions.height, a > 0)
        if (typeof t.style.width == "string") {
          const r = parseInt(t.style.width, 10);
          t.style.width = `${r + a}px`;
        } else
          t.style.width += a;
      if (l > 0)
        if (typeof t.style.height == "string") {
          const r = parseInt(t.style.height, 10);
          t.style.height = `${r + l}px`;
        } else
          t.style.height += l;
      if (e.position.x < 0) {
        const r = Math.abs(e.position.x);
        if (t.position.x = t.position.x - r, typeof t.style.width == "string") {
          const i = parseInt(t.style.width, 10);
          t.style.width = `${i + r}px`;
        } else
          t.style.width += r;
        e.position.x = 0;
      }
      if (e.position.y < 0) {
        const r = Math.abs(e.position.y);
        if (t.position.y = t.position.y - r, typeof t.style.height == "string") {
          const i = parseInt(t.style.height, 10);
          t.style.height = `${i + r}px`;
        } else
          t.style.height += r;
        e.position.y = 0;
      }
    }
  }
}
const Ho = (e, t) => {
  let n = t.map((o) => o.id);
  return e.forEach((o) => {
    if (o.type === "add") {
      const r = o.item;
      return t.push(r);
    }
    const a = n.indexOf(o.id), l = t[a];
    switch (o.type) {
      case "select":
        l.selected = o.selected;
        break;
      case "position":
        if (Oe(l) && (typeof o.position < "u" && (l.position = o.position), l.expandParent && l.parentNode)) {
          const r = t[n.indexOf(l.parentNode)];
          r && Oe(r) && Ro(l, r);
        }
        break;
      case "dimensions":
        if (Oe(l) && (typeof o.dimensions < "u" && (l.dimensions = o.dimensions), l.expandParent && l.parentNode)) {
          const r = t[n.indexOf(l.parentNode)];
          r && Oe(r) && Ro(l, r);
        }
        break;
      case "remove":
        n.includes(o.id) && (t.splice(a, 1), n = t.map((r) => r.id));
        break;
    }
  }), t;
}, Pe = (e, t) => ({
  id: e,
  type: "select",
  selected: t
}), Yo = (e) => ({
  item: e,
  type: "add"
}), vn = (e) => ({
  id: e,
  type: "remove"
}), fn = (e, t) => e.reduce(
  (n, o) => {
    const a = t.includes(o.id), l = Oe(o) ? "changedNodes" : "changedEdges";
    return !o.selected && a ? n[l].push(Pe(o.id, !0)) : o.selected && !a && n[l].push(Pe(o.id, !1)), n;
  },
  { changedNodes: [], changedEdges: [] }
);
function Tc(e, t) {
  const n = (v) => {
    e.hooks.updateNodeInternals.trigger(v);
  }, o = W();
  e.hooks.paneReady.on(({ id: v }) => {
    o.value = Bc(v);
  });
  const a = async () => new Promise((v) => {
    o.value ? v(o.value) : Je(o).not.toBeUndefined().then(() => v(o.value));
  }), l = K(() => e.nodes.map((v) => v.id)), r = K(() => e.edges.map((v) => v.id)), i = (v) => e.nodes && !l.value.length ? e.nodes.find((C) => C.id === v) : e.nodes[l.value.indexOf(v)], u = (v) => e.edges && !r.value.length ? e.edges.find((C) => C.id === v) : e.edges[r.value.indexOf(v)], s = (v, C, O) => {
    const A = [];
    v.forEach((Z) => {
      var Y, G, J, oe;
      const Ve = {
        id: Z.id,
        type: "position",
        dragging: O,
        from: Z.from
      };
      if (C && (Ve.position = Z.position, Z.parentNode)) {
        const Xe = i(Z.parentNode);
        Ve.position = {
          x: Ve.position.x - ((G = (Y = Xe == null ? void 0 : Xe.computedPosition) == null ? void 0 : Y.x) != null ? G : 0),
          y: Ve.position.y - ((oe = (J = Xe == null ? void 0 : Xe.computedPosition) == null ? void 0 : J.y) != null ? oe : 0)
        };
      }
      A.push(Ve);
    }), A != null && A.length && e.hooks.nodesChange.trigger(A);
  }, c = (v) => {
    var C;
    if (!e.vueFlowRef)
      return;
    const O = e.vueFlowRef.querySelector(".vue-flow__transformationpane");
    if (!O)
      return;
    let A;
    if ((C = e.__experimentalFeatures) != null && C.nestedFlow) {
      let Y = [O], G = O, J;
      for (; !J && G; )
        G = G.parentElement, J = G == null ? void 0 : G.classList.contains("vue-flow__transformationpane"), J && (Y = [G, ...Y]);
      Y.forEach((oe) => {
        const Ve = window.getComputedStyle(oe), { m22: Xe } = new window.DOMMatrixReadOnly(Ve.transform);
        A ? A *= Xe : A = Xe;
      });
    } else {
      const Y = window.getComputedStyle(O), { m22: G } = new window.DOMMatrixReadOnly(Y.transform);
      A = G;
    }
    const Z = v.reduce((Y, G) => {
      const J = t.getNode.value(G.id);
      if (J) {
        const oe = vt(G.nodeElement);
        (oe.width && oe.height && (J.dimensions.width !== oe.width || J.dimensions.height !== oe.height) || G.forceUpdate) && (J.handleBounds.source = ho(".source", G.nodeElement, A), J.handleBounds.target = ho(".target", G.nodeElement, A), J.dimensions = oe, Y.push({
          id: J.id,
          type: "dimensions",
          dimensions: oe
        }));
      }
      return Y;
    }, []);
    Z.length && e.hooks.nodesChange.trigger(Z);
  }, d = (v, C) => {
    const O = v.map((Y) => Y.id);
    let A, Z = [];
    if (e.multiSelectionActive)
      A = O.map((Y) => Pe(Y, C));
    else {
      const Y = fn([...e.nodes, ...e.edges], O);
      A = Y.changedNodes, Z = Y.changedEdges;
    }
    A.length && e.hooks.nodesChange.trigger(A), Z.length && e.hooks.edgesChange.trigger(Z);
  }, h = (v, C) => {
    const O = v.map((Y) => Y.id);
    let A = [], Z;
    if (e.multiSelectionActive)
      Z = O.map((Y) => Pe(Y, C));
    else {
      const Y = fn([...e.nodes, ...e.edges], O);
      A = Y.changedNodes, Z = Y.changedEdges;
    }
    A.length && e.hooks.nodesChange.trigger(A), Z.length && e.hooks.edgesChange.trigger(Z);
  }, f = (v, C) => {
    const O = v.filter(Oe), A = v.filter(zn), Z = O.map((oe) => oe.id), Y = A.map((oe) => oe.id);
    let { changedNodes: G, changedEdges: J } = fn([...e.nodes, ...e.edges], [...Z, ...Y]);
    e.multiSelectionActive && (G = Z.map((oe) => Pe(oe, C))), e.multiSelectionActive && (J = Y.map((oe) => Pe(oe, C))), G.length && e.hooks.nodesChange.trigger(G), J.length && e.hooks.edgesChange.trigger(J);
  }, w = (v) => {
    d(v, !0);
  }, k = (v) => {
    h(v, !0);
  }, E = (v) => {
    f(v, !0);
  }, g = (v) => {
    if (!v.length)
      return d(v, !1);
    const C = v.map((O) => O.id).map((O) => Pe(O, !1));
    C.length && e.hooks.nodesChange.trigger(C);
  }, b = (v) => {
    if (!v.length)
      return h(v, !1);
    const C = v.map((O) => O.id).map((O) => Pe(O, !1));
    C.length && e.hooks.edgesChange.trigger(C);
  }, B = (v) => {
    if (!v || !v.length)
      return f([], !1);
    const { changedNodes: C, changedEdges: O } = v.reduce(
      (A, Z) => {
        const Y = Pe(Z.id, !1);
        return Oe(Z) ? A.changedNodes.push(Y) : A.changedEdges.push(Y), A;
      },
      { changedNodes: [], changedEdges: [] }
    );
    C.length && e.hooks.nodesChange.trigger(C), O.length && e.hooks.edgesChange.trigger(O);
  }, y = (v) => {
    var C;
    (C = e.d3Zoom) == null || C.scaleExtent([v, e.maxZoom]), e.minZoom = v;
  }, $ = (v) => {
    var C;
    (C = e.d3Zoom) == null || C.scaleExtent([e.minZoom, v]), e.maxZoom = v;
  }, p = (v) => {
    var C;
    (C = e.d3Zoom) == null || C.translateExtent(v), e.translateExtent = v;
  }, _ = async (v) => {
    if (e.nodeExtent = v, o.value) {
      const C = t.getNodes.value.map((O) => O.id);
      n(C);
    }
  }, M = (v) => {
    e.nodesDraggable = v, e.nodesConnectable = v, e.elementsSelectable = v;
  }, z = (v, C) => {
    if (!e.initialized && !v.length)
      return;
    e.nodes || (e.nodes = []);
    const O = v instanceof Function ? v(e.nodes) : v;
    e.nodes = so(O, t.getNode.value, e.nodes, C ?? e.nodeExtent);
  }, D = (v) => {
    if (!e.initialized && !v.length)
      return;
    const C = v instanceof Function ? v(e.edges) : v;
    e.edges = C.reduce((O, A) => {
      const Z = t.getNode.value(A.source), Y = t.getNode.value(A.target), G = !Z || typeof Z > "u", J = !Y || typeof Y > "u";
      if (G && pe(`Couldn't create edge for source id: ${A.source}; edge id: ${A.id}`), J && pe(`Couldn't create edge for target id: ${A.target}; edge id: ${A.id}`), G || J)
        return O;
      const oe = t.getEdge.value(A.id);
      return O.push({
        ...ua(A, Object.assign({}, oe, e.defaultEdgeOptions)),
        sourceNode: Z,
        targetNode: Y
      }), O;
    }, []);
  }, U = (v, C) => {
    if (!e.initialized && !v.length || !v)
      return;
    const O = v instanceof Function ? v([...e.nodes, ...e.edges]) : v;
    z(O.filter(ia), C), D(O.filter(kt));
  }, Q = (v, C) => {
    const O = v instanceof Function ? v(e.nodes) : v, A = so(O, t.getNode.value, e.nodes, C ?? e.nodeExtent).map(Yo);
    A.length && e.hooks.nodesChange.trigger(A);
  }, ne = (v) => {
    const C = (v instanceof Function ? v(e.edges) : v).reduce((O, A) => {
      const Z = Ql(
        {
          ...A,
          ...e.defaultEdgeOptions
        },
        e.edges
      );
      if (Z) {
        const Y = t.getNode.value(Z.source), G = t.getNode.value(Z.target), J = !Y || typeof Y > "u", oe = !G || typeof G > "u";
        if (J && pe(`Couldn't create edge for source id: ${Z.source}; edge id: ${Z.id}`), oe && pe(`Couldn't create edge for target id: ${Z.target}; edge id: ${Z.id}`), oe || J)
          return O;
        O.push(
          Yo({
            ...Z,
            sourceNode: Y,
            targetNode: G
          })
        );
      }
      return O;
    }, []);
    C.length && e.hooks.edgesChange.trigger(C);
  }, m = (v, C = !0) => {
    const O = v instanceof Function ? v(e.nodes) : v, A = [], Z = [];
    O.forEach((Y) => {
      if (A.push(vn(typeof Y == "string" ? Y : Y.id)), C) {
        const G = Kt([typeof Y == "string" ? { id: Y } : Y], e.edges);
        Z.push(...G.map((J) => vn(J.id)));
      }
    }), A.length && e.hooks.nodesChange.trigger(A), Z.length && e.hooks.edgesChange.trigger(Z);
  }, T = (v) => {
    const C = v instanceof Function ? v(e.edges) : v, O = [];
    C.forEach((A) => {
      O.push(vn(typeof A == "string" ? A : A.id));
    }), e.hooks.edgesChange.trigger(O);
  }, x = (v, C) => Jl(v, C, e.edges), P = (v) => Ho(v, e.nodes), V = (v) => Ho(v, e.edges), L = (v, C, O, A = !1) => {
    A ? e.connectionClickStartHandle = v : e.connectionStartHandle = v, C && (e.connectionPosition = C), e.hooks.connectStart.trigger({
      event: O,
      nodeId: v.nodeId,
      handleId: v.handleId,
      handleType: v.type
    });
  }, S = (v) => {
    e.connectionPosition = v;
  }, X = (v, C) => {
    e.connectionPosition = { x: NaN, y: NaN }, C ? e.connectionClickStartHandle = null : e.connectionStartHandle = null, e.hooks.connectEnd.trigger(v);
  }, R = (v) => {
    const C = Ul(v), O = C ? null : i(v.id);
    return !C && !O ? [null, null, C] : [C ? v : io(O), O, C];
  }, te = (v, C = !0, O) => {
    const [A, Z, Y] = R(v);
    return A ? (O || e.nodes).filter((G) => {
      if (!Y && (G.id === Z.id || !G.computedPosition))
        return !1;
      const J = io(G), oe = mn(J, A);
      return C && oe > 0 || oe >= Number(v.width) * Number(v.height);
    }) : [];
  }, ee = (v, C, O = !0) => {
    const [A] = R(v);
    if (!A)
      return !1;
    const Z = mn(A, C);
    return O && Z > 0 || Z >= Number(v.width) * Number(v.height);
  }, ie = (v) => {
    var C, O;
    const A = v instanceof Function ? v(e) : v, Z = [
      "modelValue",
      "nodes",
      "edges",
      "maxZoom",
      "minZoom",
      "translateExtent",
      "nodeExtent",
      "hooks"
    ];
    typeof A.modelValue < "u" && U(A.modelValue, (C = A.nodeExtent) != null ? C : e.nodeExtent), typeof A.nodes < "u" && z(A.nodes, (O = A.nodeExtent) != null ? O : e.nodeExtent), typeof A.edges < "u" && D(A.edges);
    const Y = () => {
      typeof A.maxZoom < "u" && $(A.maxZoom), typeof A.minZoom < "u" && y(A.minZoom), typeof A.translateExtent < "u" && p(A.translateExtent), typeof A.nodeExtent < "u" && _(A.nodeExtent);
    };
    Object.keys(A).forEach((G) => {
      const J = A[G];
      !Z.includes(G) && le(J) && (e[G] = J);
    }), e.d3Zoom ? Y() : Je(() => e.d3Zoom).not.toBeUndefined().then(Y), e.initialized || (e.initialized = !0);
  };
  return {
    updateNodePositions: s,
    updateNodeDimensions: c,
    setElements: U,
    setNodes: z,
    setEdges: D,
    addNodes: Q,
    addEdges: ne,
    removeNodes: m,
    removeEdges: T,
    findNode: i,
    findEdge: u,
    updateEdge: x,
    applyEdgeChanges: V,
    applyNodeChanges: P,
    addSelectedElements: E,
    addSelectedNodes: w,
    addSelectedEdges: k,
    setMinZoom: y,
    setMaxZoom: $,
    setTranslateExtent: p,
    setNodeExtent: _,
    removeSelectedElements: B,
    removeSelectedNodes: g,
    removeSelectedEdges: b,
    startConnection: L,
    updateConnection: S,
    endConnection: X,
    setInteractive: M,
    setState: ie,
    getIntersectingNodes: te,
    isNodeIntersecting: ee,
    fitView: async (v = { padding: 0.1 }) => {
      const { fitView: C } = await a();
      C(v);
    },
    zoomIn: async (v) => {
      const { zoomIn: C } = await a();
      C(v);
    },
    zoomOut: async (v) => {
      const { zoomOut: C } = await a();
      C(v);
    },
    zoomTo: async (v, C) => {
      const { zoomTo: O } = await a();
      O(v, C);
    },
    setTransform: async (v, C) => {
      const { setTransform: O } = await a();
      O(v, C);
    },
    getTransform: () => ({
      x: e.viewport.x,
      y: e.viewport.y,
      zoom: e.viewport.zoom
    }),
    setCenter: async (v, C, O) => {
      const { setCenter: A } = await a();
      A(v, C, O);
    },
    fitBounds: async (v, C) => {
      const { fitBounds: O } = await a();
      O(v, C);
    },
    project: (v) => Bn(v, e.viewport, e.snapToGrid, e.snapGrid),
    toObject: () => JSON.parse(
      JSON.stringify({
        nodes: e.nodes,
        edges: e.edges,
        position: [e.viewport.x, e.viewport.y],
        zoom: e.viewport.zoom
      })
    ),
    updateNodeInternals: n,
    $reset: () => {
      ie(La());
    },
    $destroy: () => {
    }
  };
}
const st = class {
  constructor() {
    pn(this, "currentId", 0), pn(this, "flows", /* @__PURE__ */ new Map());
  }
  static getInstance() {
    return st.instance || (st.instance = new st()), st.instance;
  }
  set(e, t) {
    return this.flows.set(e, t);
  }
  get(e) {
    return this.flows.get(e);
  }
  remove(e) {
    return this.flows.delete(e);
  }
  create(e, t) {
    const n = La(t), o = ul(n), a = Ru(o), l = Tc(o, a), r = {};
    Object.entries(o.hooks).forEach(([s, c]) => {
      const d = `on${s.charAt(0).toUpperCase() + s.slice(1)}`;
      r[d] = c.on;
    });
    const i = {};
    Object.entries(o.hooks).forEach(([s, c]) => {
      i[s] = c.trigger;
    }), l.setState(o), t && (t.modelValue && l.setElements(t.modelValue), t.nodes && l.setNodes(t.nodes), t.edges && l.setEdges(t.edges));
    const u = {
      ...r,
      ...a,
      ...l,
      ...sl(o),
      emits: i,
      id: e,
      $destroy: () => {
        this.remove(e);
      }
    };
    return this.set(e, u), u;
  }
  getId() {
    return `vue-flow-${this.currentId++}`;
  }
};
let tl = st;
pn(tl, "instance");
const ce = (e) => {
  const t = tl.getInstance(), n = Zo(), o = e == null ? void 0 : e.id, a = (n == null ? void 0 : n.vueFlowId) || o;
  let l, r = !1;
  if (n) {
    const i = qe(co, null);
    typeof i < "u" && i !== null && (l = i);
  }
  if (l || a && (l = t.get(a)), !l || l && o && o !== l.id) {
    const i = o ?? t.getId();
    l = t.create(i, e), n && (r = !0);
  } else
    e && l.setState(e);
  if (!l)
    throw new Error("[vueflow]: store instance not found.");
  return n && (Ke(co, l), n.vueFlowId = l.id, r && xt(() => {
    t.get(l.id) && l.$destroy(), l = null;
  })), l;
}, Oc = (e, t, n) => {
  const o = Dt();
  return o.run(() => {
    [
      () => {
        o.run(() => {
          let a, l;
          const r = !!(e.modelValue && e.modelValue.value && e.modelValue.value.length);
          a = je(
            [e.modelValue, () => {
              var i, u;
              return (u = (i = e.modelValue) == null ? void 0 : i.value) == null ? void 0 : u.length;
            }],
            ([i]) => {
              i && Array.isArray(i) && (l == null || l.pause(), n.setElements(i), l = je(
                [n.nodes, n.edges, () => n.edges.value.length, () => n.nodes.value.length],
                ([u, s]) => {
                  var c;
                  (c = e.modelValue) != null && c.value && Array.isArray(e.modelValue.value) && (a == null || a.pause(), e.modelValue.value = [...u, ...s], ge(() => {
                    a == null || a.resume();
                  }));
                },
                { immediate: !0 }
              ), ge(() => {
                l == null || l.resume();
              }));
            },
            { immediate: r }
          ), Ot(() => {
            a == null || a.stop(), l == null || l.stop();
          });
        });
      },
      () => {
        o.run(() => {
          let a, l;
          const r = !!(e.nodes && e.nodes.value && e.nodes.value.length);
          a = je(
            [e.nodes, () => {
              var i, u;
              return (u = (i = e.nodes) == null ? void 0 : i.value) == null ? void 0 : u.length;
            }],
            ([i]) => {
              i && Array.isArray(i) && (l == null || l.pause(), n.setNodes(i), l = je(
                [n.nodes, () => n.nodes.value.length],
                ([u]) => {
                  var s;
                  (s = e.nodes) != null && s.value && Array.isArray(e.nodes.value) && (a == null || a.pause(), e.nodes.value = [...u], ge(() => {
                    a == null || a.resume();
                  }));
                },
                { immediate: !0 }
              ), ge(() => {
                l == null || l.resume();
              }));
            },
            { immediate: r }
          ), Ot(() => {
            a == null || a.stop(), l == null || l.stop();
          });
        });
      },
      () => {
        o.run(() => {
          let a, l;
          const r = !!(e.edges && e.edges.value && e.edges.value.length);
          a = je(
            [e.edges, () => {
              var i, u;
              return (u = (i = e.edges) == null ? void 0 : i.value) == null ? void 0 : u.length;
            }],
            ([i]) => {
              i && Array.isArray(i) && (l == null || l.pause(), n.setEdges(i), l = je(
                [n.edges, () => n.edges.value.length],
                ([u]) => {
                  var s;
                  (s = e.edges) != null && s.value && Array.isArray(e.edges.value) && (a == null || a.pause(), e.edges.value = [...u], ge(() => {
                    a == null || a.resume();
                  }));
                },
                { immediate: !0 }
              ), ge(() => {
                l == null || l.resume();
              }));
            },
            { immediate: r }
          ), Ot(() => {
            a == null || a.stop(), l == null || l.stop();
          });
        });
      },
      () => {
        o.run(() => {
          re(
            () => t.minZoom,
            () => {
              t.minZoom && le(t.minZoom) && n.setMinZoom(t.minZoom);
            },
            { immediate: le(t.minZoom) }
          );
        });
      },
      () => {
        o.run(() => {
          re(
            () => t.maxZoom,
            () => {
              t.maxZoom && le(t.maxZoom) && n.setMaxZoom(t.maxZoom);
            },
            { immediate: le(t.maxZoom) }
          );
        });
      },
      () => {
        o.run(() => {
          re(
            () => t.translateExtent,
            () => {
              t.translateExtent && le(t.translateExtent) && n.setTranslateExtent(t.translateExtent);
            },
            { immediate: le(t.translateExtent) }
          );
        });
      },
      () => {
        o.run(() => {
          re(
            () => t.nodeExtent,
            () => {
              t.nodeExtent && le(t.nodeExtent) && n.setNodeExtent(t.nodeExtent);
            },
            { immediate: le(t.nodeExtent) }
          );
        });
      },
      () => {
        o.run(() => {
          re(
            () => t.applyDefault,
            () => {
              le(t.applyDefault) && (n.applyDefault.value = t.applyDefault);
            },
            { immediate: le(t.applyDefault) }
          ), re(
            n.applyDefault,
            (a, l, r) => {
              n.applyDefault.value ? (n.onNodesChange(n.applyNodeChanges), n.onEdgesChange(n.applyEdgeChanges)) : (n.hooks.value.nodesChange.off(n.applyNodeChanges), n.hooks.value.edgesChange.off(n.applyEdgeChanges)), r(() => {
                n.hooks.value.nodesChange.off(n.applyNodeChanges), n.hooks.value.edgesChange.off(n.applyEdgeChanges);
              });
            },
            { immediate: !0 }
          );
        });
      },
      () => {
        o.run(() => {
          const a = async (l) => {
            let r = l;
            Ae(t.autoConnect) && (r = await t.autoConnect(l)), r !== !1 && n.addEdges([r]);
          };
          re(
            () => t.autoConnect,
            () => {
              le(t.autoConnect) && (n.autoConnect.value = t.autoConnect);
            },
            { immediate: le(t.autoConnect) }
          ), re(
            n.autoConnect,
            (l, r, i) => {
              l ? n.onConnect(a) : n.hooks.value.connect.off(a), i(() => {
                n.hooks.value.connect.off(a);
              });
            },
            { immediate: !0 }
          );
        });
      },
      () => {
        const a = [
          "id",
          "modelValue",
          "translateExtent",
          "nodeExtent",
          "edges",
          "nodes",
          "maxZoom",
          "minZoom",
          "applyDefault",
          "autoConnect"
        ];
        Object.keys(t).forEach((l) => {
          if (!a.includes(l)) {
            const r = N(t, l), i = n[l];
            o.run(() => {
              re(
                r,
                () => {
                  le(r) && (i.value = r.value);
                },
                { immediate: le(r) }
              );
            });
          }
        });
      }
    ].forEach((a) => a());
  }), () => o.stop();
};
function jo(e) {
  const t = e.composedPath()[0], n = Ae(t.hasAttribute) ? t.hasAttribute("contenteditable") : !1, o = Ae(t.closest) ? t.closest(".nokey") : null;
  return ["INPUT", "SELECT", "TEXTAREA"].includes(t == null ? void 0 : t.nodeName) || n || !!o;
}
const dt = (e, t) => {
  const n = _t();
  let o = W(I(e) === !0);
  return re(o, () => {
    t && typeof t == "function" && t(o.value);
  }), Uo(() => {
    const a = I(e);
    if (pl(a)) {
      o.value = a;
      return;
    }
    a && (eo(
      a,
      (l) => {
        jo(l) || (l.preventDefault(), o.value = !0);
      },
      { eventName: "keydown" }
    ), eo(
      a,
      (l) => {
        jo(l) || (l.preventDefault(), o.value = !1);
      },
      { eventName: "keyup" }
    ));
  }), typeof n.addEventListener < "u" && Pn(n, "blur", () => {
    o.value = !1;
  }), o;
}, Ic = {
  name: "SelectionPane",
  inheritAttrs: !1
}, Ac = /* @__PURE__ */ se({
  ...Ic,
  setup(e) {
    const {
      id: t,
      deleteKeyCode: n,
      selectionKeyCode: o,
      multiSelectionKeyCode: a,
      emits: l,
      nodesSelectionActive: r,
      userSelectionActive: i,
      multiSelectionActive: u,
      elementsSelectable: s,
      getNodes: c,
      getSelectedEdges: d,
      removeSelectedElements: h,
      removeNodes: f,
      removeEdges: w
    } = ce(), k = (p) => {
      l.paneClick(p), r.value = !1, h();
    }, E = (p) => l.paneContextMenu(p), g = (p) => l.paneScroll(p), b = (p) => l.paneMouseEnter(p), B = (p) => l.paneMouseLeave(p), y = (p) => l.paneMouseMove(p);
    dt(n, (p) => {
      if (!p)
        return;
      const _ = c.value.reduce((M, z) => ((!z.selected && z.parentNode && M.find((D) => D.id === z.parentNode) || z.selected) && M.push(z), M), []);
      (_ || d.value) && (d.value.length > 0 && w(d.value), _.length > 0 && f(_), r.value = !1, h());
    }), dt(a, (p) => {
      u.value = p;
    });
    const $ = dt(o, (p) => {
      i.value && p || (i.value = p && s.value);
    });
    return (p, _) => (j(), q(ke, null, [
      I($) && I(i) ? (j(), ve(I(Vu), { key: 0 })) : de("", !0),
      I(r) ? (j(), ve(I(Tu), { key: 1 })) : de("", !0),
      (j(), q("div", ht({
        key: `pane-${I(t)}`
      }, p.$attrs, {
        class: "vue-flow__pane vue-flow__container",
        onClick: k,
        onContextmenu: E,
        onWheel: g,
        onMouseenter: b,
        onMousemove: y,
        onMouseleave: B
      }), null, 16))
    ], 64));
  }
}), Vc = { class: "vue-flow__nodes vue-flow__container" }, Xc = {
  name: "Nodes"
}, Dc = /* @__PURE__ */ se({
  ...Xc,
  setup(e) {
    const t = qe(qt), n = ce(), o = N(n, "nodesDraggable"), a = N(n, "elementsSelectable"), l = N(n, "nodesConnectable"), r = N(n, "getNodes"), i = N(n, "getNodeTypes"), u = N(n, "updateNodeDimensions"), s = N(n, "emits"), c = (k) => typeof k > "u" ? o.value : k, d = (k) => typeof k > "u" ? a.value : k, h = (k) => typeof k > "u" ? l.value : k, f = W();
    be(() => {
      const k = [];
      let E = !1;
      const g = (b) => {
        k.push(b), k.length === r.value.length && ge(() => {
          E = !0, s.value.nodesInitialized();
        });
      };
      f.value = new ResizeObserver((b) => {
        const B = b.map((y) => {
          const $ = y.target.getAttribute("data-id");
          return E || g($), {
            id: $,
            nodeElement: y.target,
            forceUpdate: !0
          };
        });
        u.value(B);
      });
    }), wt(() => {
      var k;
      return (k = f.value) == null ? void 0 : k.disconnect();
    });
    const w = (k, E) => {
      const g = k || "default";
      let b = E ?? i.value[g];
      const B = bt();
      if (typeof b == "string" && B) {
        const $ = Object.keys(B.appContext.components);
        $ && $.includes(g) && (b = Go(g, !1));
      }
      if (typeof b != "string")
        return b;
      const y = t == null ? void 0 : t[`node-${g}`];
      return y != null && y({}) ? y : (pe(`Node type "${k}" not found and no node-slot detected. Using fallback type "default".`), !1);
    };
    return (k, E) => (j(), q("div", Vc, [
      f.value ? (j(!0), q(ke, { key: 0 }, Qe(r.value, (g) => (j(), ve(I(nu), {
        id: g.id,
        key: g.id,
        "resize-observer": f.value,
        type: w(g.type, g.template),
        name: g.type || "default",
        draggable: c(g.draggable),
        selectable: d(g.selectable),
        connectable: h(g.connectable),
        node: g
      }, null, 8, ["id", "resize-observer", "type", "name", "draggable", "selectable", "connectable", "node"]))), 128)) : de("", !0)
    ]));
  }
}), Lc = ["id", "markerWidth", "markerHeight", "markerUnits", "orient"], Rc = ["stroke", "stroke-width", "fill"], Hc = ["stroke", "stroke-width"], Yc = {
  name: "MarkerType"
}, jc = /* @__PURE__ */ se({
  ...Yc,
  props: {
    id: null,
    type: null,
    color: { default: "none" },
    width: { default: 12.5 },
    height: { default: 12.5 },
    markerUnits: { default: "strokeWidth" },
    orient: { default: "auto-start-reverse" },
    strokeWidth: { default: 1 }
  },
  setup(e) {
    return (t, n) => (j(), q("marker", {
      id: e.id,
      class: "vue-flow__arrowhead",
      viewBox: "-10 -10 20 20",
      refX: "0",
      refY: "0",
      markerWidth: `${e.width}`,
      markerHeight: `${e.height}`,
      markerUnits: e.markerUnits,
      orient: e.orient
    }, [
      e.type === "arrowclosed" ? (j(), q("polyline", {
        key: 0,
        stroke: e.color,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": e.strokeWidth,
        fill: e.color,
        points: "-5,-4 0,0 -5,4 -5,-4"
      }, null, 8, Rc)) : de("", !0),
      e.type === "arrow" ? (j(), q("polyline", {
        key: 1,
        stroke: e.color,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": e.strokeWidth,
        fill: "none",
        points: "-5,-4 0,0 -5,4"
      }, null, 8, Hc)) : de("", !0)
    ], 8, Lc));
  }
}), Fc = {
  name: "MarkerDefinitions"
}, Zc = /* @__PURE__ */ se({
  ...Fc,
  setup(e) {
    const t = ce(), n = N(t, "edges"), o = N(t, "connectionLineOptions"), a = N(t, "defaultMarkerColor"), l = K(() => {
      const r = [], i = [], u = (s) => {
        if (s) {
          const c = De(s);
          r.includes(c) || (typeof s == "object" ? i.push({ ...s, id: c, color: s.color || a.value }) : i.push({ id: c, color: a.value, type: s }), r.push(c));
        }
      };
      return [o.value.markerEnd, o.value.markerStart].forEach(u), n.value.reduce((s, c) => ([c.markerStart, c.markerEnd].forEach(u), s.sort((d, h) => d.id.localeCompare(h.id))), i), i;
    });
    return (r, i) => (j(), q("defs", null, [
      (j(!0), q(ke, null, Qe(I(l), (u) => (j(), ve(jc, {
        id: u.id,
        key: u.id,
        type: u.type,
        color: u.color,
        width: u.width,
        height: u.height,
        markerUnits: u.markerUnits,
        "stroke-width": u.strokeWidth,
        orient: u.orient
      }, null, 8, ["id", "type", "color", "width", "height", "markerUnits", "stroke-width", "orient"]))), 128))
    ]));
  }
}), Uc = {
  key: 0,
  class: "vue-flow__edges vue-flow__connectionline vue-flow__container"
}, Wc = {
  name: "Edges"
}, Gc = /* @__PURE__ */ se({
  ...Wc,
  setup(e) {
    const t = qe(qt), n = ce();
    N(n, "emits"), N(n, "connectionMode"), N(n, "edgeUpdaterRadius");
    const o = N(n, "onPaneReady"), a = N(n, "connectionStartHandle"), l = N(n, "nodesConnectable"), r = N(n, "edgesUpdatable"), i = N(n, "elementsSelectable"), u = N(n, "getSelectedNodes");
    N(n, "nodesSelectionActive");
    const s = N(n, "getNode");
    N(n, "getNodes");
    const c = N(n, "getEdges"), d = N(n, "getEdgeTypes");
    N(n, "addSelectedEdges");
    const h = N(n, "noPanClassName"), f = N(n, "elevateEdgesOnSelect"), w = (p) => typeof p > "u" ? i.value : p, k = (p) => typeof p > "u" ? r.value : p, E = qn(
      () => {
        var p;
        return (p = a.value) == null ? void 0 : p.nodeId;
      },
      () => {
        var p;
        return (p = a.value) != null && p.nodeId ? s.value(a.value.nodeId) : !1;
      }
    ), g = qn(
      () => {
        var p;
        return (p = a.value) == null ? void 0 : p.nodeId;
      },
      () => {
        var p, _;
        return !!(E.value && (typeof E.value.connectable > "u" ? l.value : E.value.connectable) && ((p = a.value) != null && p.nodeId) && ((_ = a.value) != null && _.type));
      }
    );
    let b = W([]), B = Dt();
    o.value(() => {
      B || (B = Dt()), B.run(() => {
        re(
          [u, c],
          () => {
            f.value ? ge(() => b.value = _u(c.value, s.value)) : b.value = [
              {
                isMaxLevel: !0,
                edges: c.value,
                level: 0
              }
            ];
          },
          { immediate: !0 }
        );
      });
    }), wt(() => {
      B == null || B.stop(), B = null;
    });
    const y = (p, _) => {
      const M = p || "default";
      let z = _ ?? d.value[M];
      const D = bt();
      if (typeof z == "string" && D) {
        const Q = Object.keys(D.appContext.components);
        Q && Q.includes(M) && (z = Go(M, !1));
      }
      if (z && typeof z != "string")
        return z;
      const U = t == null ? void 0 : t[`edge-${M}`];
      return U != null && U({}) ? U : (pe(`Edge type "${p}" not found and no edge-slot detected. Using fallback type "default".`), !1);
    }, $ = (p) => {
      const _ = p.class instanceof Function ? p.class(p) : p.class;
      return [h.value, _];
    };
    return (p, _) => (j(), q(ke, null, [
      (j(!0), q(ke, null, Qe(b.value, (M) => (j(), q("svg", {
        key: M.level,
        class: "vue-flow__edges vue-flow__container",
        style: Se(`z-index: ${M.level}`)
      }, [
        M.isMaxLevel ? (j(), ve(Zc, { key: 0 })) : de("", !0),
        ue("g", null, [
          (j(!0), q(ke, null, Qe(M.edges, (z) => (j(), ve(I(Eu), {
            id: z.id,
            key: z.id,
            edge: z,
            type: y(z.type, z.template),
            name: z.type || "default",
            "source-node": s.value(z.source),
            "target-node": s.value(z.target),
            selectable: w(z.selectable),
            updatable: k(z.updatable),
            class: Ie($(z))
          }, null, 8, ["id", "edge", "type", "name", "source-node", "target-node", "selectable", "updatable", "class"]))), 128))
        ])
      ], 4))), 128)),
      g.value && E.value ? (j(), q("svg", Uc, [
        Ne(zu, { "source-node": E.value }, null, 8, ["source-node"])
      ])) : de("", !0)
    ], 64));
  }
}), Kc = /* @__PURE__ */ ue("div", { class: "vue-flow__edge-labels" }, null, -1), qc = {
  name: "Transform"
}, Qc = /* @__PURE__ */ se({
  ...qc,
  setup(e) {
    const { id: t, viewport: n, dimensions: o, fitViewOnInit: a, emits: l, fitView: r, ...i } = ce(), u = async (c) => ("screen" in _t() && await Je(c).toMatch(({ height: h, width: f }) => !isNaN(f) && f > 0 && !isNaN(h) && h > 0), !0);
    let s = W(!1);
    return be(async () => {
      await u(o.value), s.value = !0, l.paneReady({
        id: t,
        viewport: n,
        dimensions: o,
        fitViewOnInit: a,
        fitView: r,
        emits: l,
        ...i
      }), a != null && a.value && r();
    }), (c, d) => (j(), q("div", {
      key: `transform-${I(t)}`,
      class: "vue-flow__transformationpane vue-flow__container",
      style: Se({ transform: `translate(${I(n).x}px,${I(n).y}px) scale(${I(n).zoom})`, opacity: s.value ? void 0 : 0 })
    }, [
      Ne(Gc),
      Kc,
      Ne(Dc),
      _e(c.$slots, "default")
    ], 4));
  }
}), Jc = {
  name: "Viewport"
}, ed = /* @__PURE__ */ se({
  ...Jc,
  setup(e) {
    const t = ce(), n = N(t, "id"), o = N(t, "minZoom"), a = N(t, "maxZoom"), l = N(t, "defaultZoom"), r = N(t, "defaultPosition"), i = N(t, "translateExtent"), u = N(t, "dimensions"), s = N(t, "zoomActivationKeyCode"), c = N(t, "selectionKeyCode"), d = N(t, "panOnScroll"), h = N(t, "panOnScrollMode"), f = N(t, "panOnScrollSpeed"), w = N(t, "panOnDrag"), k = N(t, "zoomOnDoubleClick"), E = N(t, "zoomOnPinch"), g = N(t, "zoomOnScroll"), b = N(t, "preventScrolling"), B = N(t, "noWheelClassName"), y = N(t, "noPanClassName"), $ = N(t, "setState"), p = N(t, "emits"), _ = N(t, "connectionStartHandle"), M = Bl("viewport", null);
    let z = W(!1), D = W(!1);
    const U = K(() => !!_.value), Q = (x, P) => x.x !== P.x && !isNaN(P.x) || x.y !== P.y && !isNaN(P.y) || x.zoom !== P.k && !isNaN(P.k), ne = (x) => ({
      x: x.x,
      y: x.y,
      zoom: x.k
    }), m = (x, P) => x.target.closest(`.${P}`);
    let T = W({
      x: 0,
      y: 0,
      zoom: 0
    });
    return be(() => {
      Xl(M, () => {
        if (!M.value)
          return;
        const { width: P, height: V } = vt(M.value);
        u.value.width = P, u.value.height = V;
      });
      const x = _t();
      Pn(x, "resize", () => {
        if (!M.value)
          return;
        const { width: P, height: V } = vt(M.value);
        u.value.width = P, u.value.height = V;
      });
    }), be(() => {
      const x = M.value.getBoundingClientRect(), P = zc().scaleExtent([o.value, a.value]).translateExtent(i.value), V = me(M.value).call(P), L = V.on("wheel.zoom"), S = on.translate(r.value[0], r.value[1]).scale(l.value), X = [
        [0, 0],
        [x.width, x.height]
      ], R = P.constrain()(S, X, i.value);
      P.transform(V, R), $.value({
        d3Zoom: P,
        d3Selection: V,
        d3ZoomHandler: L,
        viewport: { x: S.x, y: S.y, zoom: S.k },
        viewportRef: M.value
      });
      const te = (v) => {
        v && !z.value ? P.on("zoom", null) : v || P.on("zoom", (C) => {
          $.value({ viewport: { x: C.transform.x, y: C.transform.y, zoom: C.transform.k } });
          const O = ne(C.transform);
          p.value.move({ event: C, flowTransform: O });
        });
      }, ee = dt(c.value, te);
      te(!1);
      const ie = dt(s.value);
      P.on("start", (v) => {
        var C;
        if (!v.sourceEvent)
          return null;
        z.value = !0;
        const O = ne(v.transform);
        ((C = v.sourceEvent) == null ? void 0 : C.type) === "mousedown" && (D.value = !0), T.value = O, p.value.moveStart({ event: v, flowTransform: O });
      }), P.on("end", (v) => {
        if (!v.sourceEvent)
          return null;
        if (z.value = !1, D.value = !1, Q(T.value, v.transform)) {
          const C = ne(v.transform);
          T.value = C, p.value.moveEnd({ event: v, flowTransform: C });
        }
      }), Uo(() => {
        d.value && !ie.value ? V.on("wheel", (v) => {
          var C;
          if (m(v, (C = B.value) == null ? void 0 : C.value))
            return !1;
          v.preventDefault(), v.stopImmediatePropagation();
          const O = V.property("__zoom").k || 1;
          if (v.ctrlKey && E.value) {
            const G = xe(v), J = -v.deltaY * (v.deltaMode === 1 ? 0.05 : v.deltaMode ? 1 : 2e-3) * 10, oe = O * 2 ** J;
            P.scaleTo(V, oe, G);
            return;
          }
          const A = v.deltaMode === 1 ? 20 : 1, Z = h.value === Rt.Vertical ? 0 : v.deltaX * A, Y = h.value === Rt.Horizontal ? 0 : v.deltaY * A;
          P.translateBy(V, -(Z / O) * f.value, -(Y / O) * f.value);
        }).on("wheel.zoom", null) : typeof L < "u" && V.on("wheel", (v) => {
          var C;
          if (!b.value || m(v, (C = B.value) == null ? void 0 : C.value))
            return null;
          v.preventDefault();
        }).on("wheel.zoom", L);
      }), P.filter((v) => {
        var C, O;
        const A = ie.value || g.value, Z = E.value && v.ctrlKey;
        return v.button === 1 && v.type === "mousedown" && ((C = v.target) != null && C.closest(".vue-flow__node") || (O = v.target) != null && O.closest(".vue-flow__edge")) ? !0 : !w.value && !A && !d.value && !k.value && !E.value || ee.value && c.value !== !0 || !k.value && v.type === "dblclick" || m(v, B.value) && v.type === "wheel" || m(v, y.value) && v.type !== "wheel" || !E.value && v.ctrlKey && v.type === "wheel" || !A && !d.value && !Z && v.type === "wheel" || !w.value && (v.type === "mousedown" || v.type === "touchstart") ? !1 : (!v.ctrlKey || v.type === "wheel") && (!v.button || v.button <= 1);
      });
    }), (x, P) => (j(), q("div", {
      ref: "viewport",
      key: `viewport-${n.value}`,
      class: "vue-flow__viewport vue-flow__container"
    }, [
      Ne(Qc, null, {
        default: Te(() => [
          _e(x.$slots, "default")
        ]),
        _: 3
      }),
      Ne(Ac, {
        class: Ie({ connecting: U.value, dragging: D.value, draggable: w.value })
      }, null, 8, ["class"])
    ]));
  }
}), td = {
  name: "VueFlow"
}, nd = /* @__PURE__ */ se({
  ...td,
  props: {
    id: null,
    modelValue: null,
    nodes: null,
    edges: null,
    edgeTypes: null,
    nodeTypes: null,
    connectionMode: null,
    connectionLineType: null,
    connectionLineStyle: { default: void 0 },
    connectionLineOptions: null,
    deleteKeyCode: null,
    selectionKeyCode: null,
    multiSelectionKeyCode: null,
    zoomActivationKeyCode: null,
    snapToGrid: { type: Boolean, default: void 0 },
    snapGrid: null,
    onlyRenderVisibleElements: { type: Boolean, default: void 0 },
    edgesUpdatable: { type: [Boolean, String], default: void 0 },
    nodesDraggable: { type: Boolean, default: void 0 },
    nodesConnectable: { type: Boolean, default: void 0 },
    elementsSelectable: { type: Boolean, default: void 0 },
    selectNodesOnDrag: { type: Boolean, default: void 0 },
    panOnDrag: { type: Boolean, default: void 0 },
    minZoom: null,
    maxZoom: null,
    defaultZoom: null,
    defaultPosition: null,
    translateExtent: null,
    nodeExtent: null,
    defaultMarkerColor: null,
    zoomOnScroll: { type: Boolean, default: void 0 },
    zoomOnPinch: { type: Boolean, default: void 0 },
    panOnScroll: { type: Boolean, default: void 0 },
    panOnScrollSpeed: null,
    panOnScrollMode: null,
    zoomOnDoubleClick: { type: Boolean, default: void 0 },
    preventScrolling: { type: Boolean, default: void 0 },
    edgeUpdaterRadius: null,
    fitViewOnInit: { type: Boolean, default: void 0 },
    connectOnClick: { type: Boolean, default: void 0 },
    applyDefault: { type: Boolean, default: void 0 },
    autoConnect: { type: [Boolean, Function], default: void 0 },
    noDragClassName: null,
    noWheelClassName: null,
    noPanClassName: null,
    defaultEdgeOptions: null,
    elevateEdgesOnSelect: { type: Boolean, default: void 0 },
    __experimentalFeatures: null
  },
  emits: ["nodesChange", "edgesChange", "nodeDoubleClick", "nodeClick", "nodeMouseEnter", "nodeMouseMove", "nodeMouseLeave", "nodeContextMenu", "nodeDragStart", "nodeDrag", "nodeDragStop", "nodesInitialized", "miniMapNodeClick", "miniMapNodeDoubleClick", "miniMapNodeMouseEnter", "miniMapNodeMouseMove", "miniMapNodeMouseLeave", "connect", "connectStart", "connectEnd", "moveStart", "move", "moveEnd", "selectionDragStart", "selectionDrag", "selectionDragStop", "selectionContextMenu", "paneReady", "paneScroll", "paneClick", "paneContextMenu", "paneMouseEnter", "paneMouseMove", "paneMouseLeave", "edgeContextMenu", "edgeMouseEnter", "edgeMouseMove", "edgeMouseLeave", "edgeDoubleClick", "edgeClick", "edgeUpdateStart", "edgeUpdate", "edgeUpdateEnd", "updateNodeInternals", "update:modelValue", "update:nodes", "update:edges"],
  setup(e, { expose: t, emit: n }) {
    const o = e, a = ct(o, "modelValue", n), l = ct(o, "nodes", n), r = ct(o, "edges", n), { vueFlowRef: i, id: u, hooks: s, getNodeTypes: c, getEdgeTypes: d, $reset: h, ...f } = ce({ id: o.id }), w = Oc({ modelValue: a, nodes: l, edges: r }, o, {
      vueFlowRef: i,
      id: u,
      hooks: s,
      getNodeTypes: c,
      getEdgeTypes: d,
      $reset: h,
      ...f
    }), k = W();
    return al(() => {
      w();
    }), be(() => {
      i.value = k.value;
    }), Fl(n, s), Ke(qt, ll()), t({
      vueFlowRef: i,
      id: u,
      hooks: s,
      getNodeTypes: c,
      getEdgeTypes: d,
      $reset: h,
      ...f
    }), (E, g) => (j(), q("div", {
      ref_key: "el",
      ref: k,
      class: "vue-flow"
    }, [
      Ne(ed, null, {
        nodes: Te(() => [
          (j(!0), q(ke, null, Qe(Object.keys(I(c)), (b) => _e(E.$slots, `node-${b}`)), 256))
        ]),
        edges: Te(() => [
          (j(!0), q(ke, null, Qe(Object.keys(I(d)), (b) => _e(E.$slots, `edge-${b}`)), 256))
        ]),
        "connection-name": Te(() => [
          _e(E.$slots, "connection-line")
        ]),
        default: Te(() => [
          _e(E.$slots, "zoom-pane")
        ]),
        _: 3
      }),
      _e(E.$slots, "default")
    ], 512));
  }
});
const od = {
  key: 0,
  class: "label-input-wrapper"
}, ad = ["onKeypress"], ld = /* @__PURE__ */ se({
  __name: "EditableNode",
  props: {
    id: null,
    label: null,
    sourcePosition: null,
    targetPosition: null,
    data: null
  },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = e, o = {
      top: F.Top,
      right: F.Right,
      bottom: F.Bottom,
      left: F.Left
    }, a = K(() => o[n.sourcePosition]), l = K(() => o[n.targetPosition]), r = W(), i = W(""), u = W(!1);
    let s = 0;
    const c = () => {
      let f = Date.now();
      f - s < 500 && !u.value && d(), s = f;
    }, d = async () => {
      i.value = n.label, u.value = !0, await ge(), r.value.focus();
    }, h = () => {
      u.value = !1, t("change", i.value);
    };
    return (f, w) => (j(), q("div", {
      onClick: w[2] || (w[2] = (k) => c())
    }, [
      ue("div", null, Wt(n.label), 1),
      u.value ? (j(), q("div", od, [
        Qo(ue("input", {
          ref_key: "labelInput",
          ref: r,
          class: "label-input",
          "onUpdate:modelValue": w[0] || (w[0] = (k) => i.value = k),
          onBlur: w[1] || (w[1] = (k) => u.value = !1),
          onKeypress: Jo(h, ["enter"])
        }, null, 40, ad), [
          [ea, i.value]
        ])
      ])) : de("", !0),
      n.data.hasInput ? (j(), ve(I(tt), {
        key: 1,
        id: "a",
        type: "target",
        position: I(l)
      }, null, 8, ["position"])) : de("", !0),
      n.data.hasOutput ? (j(), ve(I(tt), {
        key: 2,
        id: "b",
        type: "source",
        position: I(a)
      }, null, 8, ["position"])) : de("", !0)
    ]));
  }
});
const rd = ["id", "d", "marker-end"], id = { class: "vue-flow__edge-label" }, ud = {
  key: 0,
  class: "label-input-wrapper"
}, sd = ["onKeypress"], cd = {
  inheritAttrs: !1
}, dd = /* @__PURE__ */ se({
  ...cd,
  __name: "EditableEdge",
  props: {
    id: null,
    sourceX: null,
    sourceY: null,
    targetX: null,
    targetY: null,
    sourcePosition: null,
    targetPosition: null,
    data: null,
    markerEnd: null,
    style: null,
    label: null
  },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = e;
    ce();
    const o = W(), a = W(""), l = W(!1);
    let r = 0;
    const i = () => {
      let d = Date.now();
      d - r < 500 && !l.value && u(), r = d;
    }, u = async () => {
      a.value = n.label, l.value = !0, await ge(), o.value.focus();
    }, s = () => {
      l.value = !1, t("change", a.value);
    }, c = K(() => Dn(n));
    return (d, h) => (j(), q(ke, null, [
      ue("path", {
        id: e.id,
        style: Se(e.style),
        class: "vue-flow__edge-path",
        d: I(c)[0],
        "marker-end": e.markerEnd
      }, null, 12, rd),
      Ne(I(Mu), null, {
        default: Te(() => [
          ue("div", {
            style: Se({
              pointerEvents: "all",
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${I(c)[1]}px,${I(c)[2]}px)`
            }),
            class: "nodrag nopan editable-edge-label",
            onClick: h[2] || (h[2] = (f) => i())
          }, [
            ue("div", id, Wt(n.label), 1),
            l.value ? (j(), q("div", ud, [
              Qo(ue("input", {
                ref_key: "labelInput",
                ref: o,
                class: "label-input",
                "onUpdate:modelValue": h[0] || (h[0] = (f) => a.value = f),
                onBlur: h[1] || (h[1] = (f) => l.value = !1),
                onKeypress: Jo(s, ["enter"])
              }, null, 40, sd), [
                [ea, a.value]
              ])
            ])) : de("", !0)
          ], 4)
        ]),
        _: 1
      })
    ], 64));
  }
});
const hd = { class: "chart-controls" }, vd = { class: "chart-controls-left" }, fd = /* @__PURE__ */ ue("b", null, "Selected Node:", -1), pd = { class: "chart-controls-right" }, gd = { key: 0 }, md = { key: 1 }, nl = /* @__PURE__ */ se({
  __name: "NodeEditor",
  props: {
    modelValue: null,
    nodeContainerClass: null
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = W(""), a = W({}), l = W(!1);
    W({
      x: 0,
      y: 0
    });
    const r = W(""), i = W([]), u = K(() => {
      for (let p = 0; p < i.value.length; p++)
        if (i.value[p].id == r.value)
          return p;
      return -1;
    }), s = K({
      get: () => {
        let p = n.modelValue;
        n.nodeContainerClass ? o.value = n.nodeContainerClass : o.value = "defaultContainerClass";
        for (let _ = 0; _ < p.length; _++)
          p[_].data = {}, p[_].type == "input" ? (p[_].data.hasInput = !1, p[_].data.hasOutput = !0) : p[_].type == "output" ? (p[_].data.hasInput = !0, p[_].data.hasOutput = !1) : (p[_].data.hasInput = !0, p[_].data.hasOutput = !0), p[_].class = "vue-flow__node-default", p[_].type = "editable";
        for (let _ = 0; _ < p.length; _++) {
          let M = p[_].id;
          p[_], p[_].events = {
            click: () => {
              r.value = M;
            }
          };
        }
        return p;
      },
      set: (p) => {
        t("update:modelValue", JSON.parse(JSON.stringify(p)));
      }
    }), { getNodes: c, onPaneReady: d } = ce({});
    d((p) => {
      a.value = p;
    }), i.value = s.value, be(() => {
      document.removeEventListener("keypress", E), document.addEventListener("keypress", E);
    }), wt(() => {
      document.removeEventListener("keypress", E);
    });
    const h = (p) => ({
      top: "right",
      right: "bottom",
      bottom: "left",
      left: "top"
    })[p], f = () => {
      u.value > -1 && (i.value[u.value].sourcePosition = h(
        i.value[u.value].sourcePosition
      ));
    }, w = () => {
      u.value > -1 && (i.value[u.value].targetPosition = h(
        i.value[u.value].targetPosition
      ));
    }, k = (p) => {
      window.scrollBy(0, p.deltaY);
    }, E = (p) => {
      l.value && p.ctrlKey == !0 && ((p.key == "+" || p.key == "=") && a.value.zoomIn(), p.key == "-" && a.value.zoomOut());
    }, g = () => {
      a.value.fitView();
    }, b = () => {
      let p = { x: Math.random() * 200, y: Math.random() * 200 }, _ = !1;
      if (u.value > -1) {
        const D = i.value[u.value];
        D.data.hasOutput && (p = { x: D.position.x + 200, y: D.position.y + 50 }, _ = !0);
      }
      let M = i.value.length, z = `node-${M}`;
      if (i.value.push({
        id: z,
        label: "Node " + M,
        sourcePosition: "right",
        targetPosition: "left",
        class: "vue-flow__node-default",
        type: "editable",
        data: {
          hasInput: !0,
          hasOutput: !0
        },
        events: {
          click: () => {
            r.value = z;
          }
        },
        // position: { x: Math.random() * vueFlowInstance.value.dimensions.width, y: Math.random() * vueFlowInstance.value.dimensions.height }
        position: p
      }), _) {
        let D = `edge-${M + 1}`;
        i.value.push({
          id: D,
          source: r.value,
          target: z,
          type: "editable",
          label: `EDGE ${M + 1}`,
          animated: !0,
          events: {
            click: () => {
              r.value = D;
            }
          }
        });
      }
    }, B = (p) => {
      console.log("edge connect", p);
    }, y = (p) => {
      console.log("edge double click", p);
    }, $ = (p, _) => {
      for (let M = 0; M < i.value.length; M++)
        if (i.value[M].id == _) {
          i.value[M].label = p;
          break;
        }
    };
    return (p, _) => (j(), q("div", {
      class: Ie(["node-editor-wrapper", o.value]),
      onMouseover: _[8] || (_[8] = (M) => l.value = !0),
      onMouseleave: _[9] || (_[9] = (M) => l.value = !1)
    }, [
      ue("div", hd, [
        ue("div", vd, [
          ue("div", null, [
            fd,
            qo(" " + Wt(r.value ? r.value : "none"), 1)
          ])
        ]),
        ue("div", pd, [
          ue("div", null, [
            ue("button", {
              class: "button-default",
              onClick: _[0] || (_[0] = (M) => b())
            }, "Add Node")
          ]),
          ue("div", null, [
            ue("button", {
              class: "button-default",
              onClick: _[1] || (_[1] = (M) => g())
            }, "Center")
          ]),
          I(u) > -1 ? (j(), q("div", gd, [
            ue("button", {
              class: "button-default",
              onClick: _[2] || (_[2] = (M) => w())
            }, "Shift Input Position")
          ])) : de("", !0),
          I(u) > -1 ? (j(), q("div", md, [
            ue("button", {
              class: "button-default",
              onClick: _[3] || (_[3] = (M) => f())
            }, "Shift Output Position")
          ])) : de("", !0)
        ])
      ]),
      i.value && i.value.length ? (j(), ve(I(nd), {
        key: 0,
        onWheel: _[4] || (_[4] = dl((M) => k(M), ["prevent"])),
        class: "nowheel",
        "prevent-scrolling": !0,
        "zoom-on-scroll": !1,
        "fit-view-on-init": !0,
        modelValue: i.value,
        "onUpdate:modelValue": _[5] || (_[5] = (M) => i.value = M),
        onConnect: _[6] || (_[6] = (M) => B(M)),
        onEdgeDoubleClick: _[7] || (_[7] = (M) => y(M))
      }, {
        "node-editable": Te((M) => [
          Ne(ld, ht(M, {
            onChange: (z) => $(z, M.id)
          }), null, 16, ["onChange"])
        ]),
        "edge-editable": Te((M) => [
          Ne(dd, ht(M, {
            onChange: (z) => $(z, M.id)
          }), null, 16, ["onChange"])
        ]),
        _: 1
      }, 8, ["modelValue"])) : de("", !0)
    ], 34));
  }
});
const yd = /* @__PURE__ */ se({
  __name: "StateEditor",
  props: ["layout", "nodeContainerClass", "modelValue"],
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = K({
      get: () => {
        let l = n.modelValue, r = {}, i = {}, u = 0, s = [];
        for (let c in l) {
          s.length;
          let d = {
            id: c,
            label: c,
            position: n.layout[c] && n.layout[c].position ? n.layout[c].position : { x: 200 * u, y: 100 },
            targetPosition: n.layout[c] && n.layout[c].targetPosition ? n.layout[c].targetPosition : "left",
            sourcePosition: n.layout[c] && n.layout[c].sourcePosition ? n.layout[c].sourcePosition : "right"
          };
          l[c].type && l[c].type == "final" && (d.type = "output", d.class = "default-output-node"), r[c] = d;
          let h = l[c].on;
          for (let f in l[c].on) {
            let w = h[f];
            typeof w == "object" && w.constructor === Object && (w = w.target), s.push({
              id: `${c}-${h[f]}-${f}`,
              target: w,
              source: c,
              label: f,
              animated: !0
            }), i[w] = !0;
          }
          u++;
        }
        for (let c in r)
          i[c] || (r[c].type = "input", r[c].class = "default-input-node"), s.push(r[c]);
        return s;
      },
      set: (l) => {
        a(l);
      }
    }), a = (l) => {
      let r = {}, i = {}, u = {};
      for (let s = 0; s < l.length; s++) {
        let c = l[s];
        c.type == "input" ? r[c.label] = {
          on: {}
        } : c.type == "output" ? r[c.label] = {
          type: "final"
        } : c.source && c.target ? (i[c.source] = i[c.source] || {}, i[c.source][c.label] = {
          target: c.target
        }) : r[c.label] = {
          on: {}
        }, u[c.id] = c.label;
      }
      for (let s in i) {
        let c = u[s];
        for (let d in i[s])
          r[c].on[d] = i[s][d];
      }
      t("update:modelValue", r);
    };
    return (l, r) => (j(), q("div", null, [
      Ne(nl, {
        modelValue: I(o),
        "onUpdate:modelValue": r[0] || (r[0] = (i) => Ko(o) ? o.value = i : null),
        "node-container-class": e.nodeContainerClass
      }, null, 8, ["modelValue", "node-container-class"])
    ]));
  }
});
function wd(e) {
  e.component("NodeEditor", nl), e.component("StateEditor", yd);
}
export {
  nl as NodeEditor,
  yd as StateEditor,
  wd as install
};
//# sourceMappingURL=node-editor.js.map
