import { defineComponent as fe, toRef as O, ref as ee, computed as q, openBlock as te, createElementBlock as ie, unref as k, normalizeClass as Ke, renderSlot as xe, provide as lt, onMounted as Ve, onBeforeUnmount as jn, watch as ce, h as ue, createBlock as _e, Teleport as bi, getCurrentScope as ia, inject as ut, useSlots as wi, onUnmounted as xi, createVNode as ke, withCtx as Pe, Fragment as Ne, renderList as st, onScopeDispose as Rt, getCurrentInstance as tn, onBeforeMount as _i, nextTick as Re, effectScope as Ei, watchEffect as uo, createElementVNode as de, toDisplayString as ct, createCommentVNode as ge, markRaw as nt, reactive as Si, toRefs as Ni, normalizeStyle as Le, readonly as ki, isRef as Ci, customRef as Mi, resolveDynamicComponent as ra, normalizeProps as Pi, mergeProps as Ht, resolveComponent as la, createTextVNode as ua, withDirectives as sa, withKeys as ca, vModelText as da, withModifiers as Ii } from "vue";
var so;
const Zn = typeof window < "u", $i = (e) => typeof e < "u", Ti = (e) => typeof e == "boolean", Ye = (e) => typeof e == "function", Be = (e) => typeof e == "number", Ae = (e) => typeof e == "string", Oi = () => {
};
Zn && (so = window == null ? void 0 : window.navigator) != null && so.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function le(e) {
  return typeof e == "function" ? e() : k(e);
}
function Di(e, t) {
  function n(...o) {
    return new Promise((a, i) => {
      Promise.resolve(e(() => t.apply(this, o), { fn: t, thisArg: this, args: o })).then(a).catch(i);
    });
  }
  return n;
}
const va = (e) => e();
function Bi(e = va) {
  const t = ee(!0);
  function n() {
    t.value = !1;
  }
  function o() {
    t.value = !0;
  }
  const a = (...i) => {
    t.value && e(...i);
  };
  return { isActive: ki(t), pause: n, resume: o, eventFilter: a };
}
function co(e, t = !1, n = "Timeout") {
  return new Promise((o, a) => {
    setTimeout(t ? () => a(n) : o, e);
  });
}
function Ai(e) {
  return e;
}
function _n(e, t) {
  let n, o, a;
  const i = ee(!0), r = () => {
    i.value = !0, a();
  };
  ce(e, r, { flush: "sync" });
  const l = Ye(t) ? t : t.get, u = Ye(t) ? void 0 : t.set, s = Mi((c, d) => (o = c, a = d, {
    get() {
      return i.value && (n = l(), i.value = !1), o(), n;
    },
    set(h) {
      u == null || u(h);
    }
  }));
  return Object.isExtensible(s) && (s.trigger = r), s;
}
function Ct(e) {
  return ia() ? (Rt(e), !0) : !1;
}
function zi(e, t = !0) {
  tn() ? Ve(e) : t ? e() : Re(e);
}
function Dn(e, t = !1) {
  function n(d, { flush: h = "sync", deep: b = !1, timeout: m, throwOnTimeout: w } = {}) {
    let E = null;
    const _ = [new Promise((P) => {
      E = ce(e, (G) => {
        d(G) !== t && (E == null || E(), P(G));
      }, {
        flush: h,
        deep: b,
        immediate: !0
      });
    })];
    return m != null && _.push(co(m, w).then(() => le(e)).finally(() => E == null ? void 0 : E())), Promise.race(_);
  }
  function o(d, h) {
    if (!Ci(d))
      return n((G) => G === d, h);
    const { flush: b = "sync", deep: m = !1, timeout: w, throwOnTimeout: E } = h ?? {};
    let _ = null;
    const P = [new Promise((G) => {
      _ = ce([e, d], ([y, I]) => {
        t !== (y === I) && (_ == null || _(), G(y));
      }, {
        flush: b,
        deep: m,
        immediate: !0
      });
    })];
    return w != null && P.push(co(w, E).then(() => le(e)).finally(() => (_ == null || _(), le(e)))), Promise.race(P);
  }
  function a(d) {
    return n((h) => !!h, d);
  }
  function i(d) {
    return o(null, d);
  }
  function r(d) {
    return o(void 0, d);
  }
  function l(d) {
    return n(Number.isNaN, d);
  }
  function u(d, h) {
    return n((b) => {
      const m = Array.from(b);
      return m.includes(d) || m.includes(le(d));
    }, h);
  }
  function s(d) {
    return c(1, d);
  }
  function c(d = 1, h) {
    let b = -1;
    return n(() => (b += 1, b >= d), h);
  }
  return Array.isArray(le(e)) ? {
    toMatch: n,
    toContains: u,
    changed: s,
    changedTimes: c,
    get not() {
      return Dn(e, !t);
    }
  } : {
    toMatch: n,
    toBe: o,
    toBeTruthy: a,
    toBeNull: i,
    toBeNaN: l,
    toBeUndefined: r,
    changed: s,
    changedTimes: c,
    get not() {
      return Dn(e, !t);
    }
  };
}
function be(e) {
  return Dn(e);
}
var vo = Object.getOwnPropertySymbols, Ri = Object.prototype.hasOwnProperty, Vi = Object.prototype.propertyIsEnumerable, Li = (e, t) => {
  var n = {};
  for (var o in e)
    Ri.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && vo)
    for (var o of vo(e))
      t.indexOf(o) < 0 && Vi.call(e, o) && (n[o] = e[o]);
  return n;
};
function Yi(e, t, n = {}) {
  const o = n, {
    eventFilter: a = va
  } = o, i = Li(o, [
    "eventFilter"
  ]);
  return ce(e, Di(a, t), i);
}
var Xi = Object.defineProperty, Gi = Object.defineProperties, Hi = Object.getOwnPropertyDescriptors, Ft = Object.getOwnPropertySymbols, ha = Object.prototype.hasOwnProperty, fa = Object.prototype.propertyIsEnumerable, ho = (e, t, n) => t in e ? Xi(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Fi = (e, t) => {
  for (var n in t || (t = {}))
    ha.call(t, n) && ho(e, n, t[n]);
  if (Ft)
    for (var n of Ft(t))
      fa.call(t, n) && ho(e, n, t[n]);
  return e;
}, Ui = (e, t) => Gi(e, Hi(t)), ji = (e, t) => {
  var n = {};
  for (var o in e)
    ha.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && Ft)
    for (var o of Ft(e))
      t.indexOf(o) < 0 && fa.call(e, o) && (n[o] = e[o]);
  return n;
};
function Je(e, t, n = {}) {
  const o = n, {
    eventFilter: a
  } = o, i = ji(o, [
    "eventFilter"
  ]), { eventFilter: r, pause: l, resume: u, isActive: s } = Bi(a);
  return { stop: Yi(e, t, Ui(Fi({}, i), {
    eventFilter: r
  })), pause: l, resume: u, isActive: s };
}
function ga(e) {
  var t;
  const n = le(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const Kn = Zn ? window : void 0;
function Wn(...e) {
  let t, n, o, a;
  if (Ae(e[0]) || Array.isArray(e[0]) ? ([n, o, a] = e, t = Kn) : [t, n, o, a] = e, !t)
    return Oi;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const i = [], r = () => {
    i.forEach((c) => c()), i.length = 0;
  }, l = (c, d, h, b) => (c.addEventListener(d, h, b), () => c.removeEventListener(d, h, b)), u = ce(() => [ga(t), le(a)], ([c, d]) => {
    r(), c && i.push(...n.flatMap((h) => o.map((b) => l(c, h, b, d))));
  }, { immediate: !0, flush: "post" }), s = () => {
    u(), r();
  };
  return Ct(s), s;
}
const Zi = (e) => typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
function fo(...e) {
  let t, n, o = {};
  e.length === 3 ? (t = e[0], n = e[1], o = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], o = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
  const { target: a = Kn, eventName: i = "keydown", passive: r = !1 } = o, l = Zi(t);
  return Wn(a, i, (u) => {
    l(u) && n(u);
  }, r);
}
function Ki(e, t = !1) {
  const n = ee(), o = () => n.value = !!e();
  return o(), zi(o, t), n;
}
function Wi(e) {
  return JSON.parse(JSON.stringify(e));
}
const go = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, po = "__vueuse_ssr_handlers__";
go[po] = go[po] || {};
var mo = Object.getOwnPropertySymbols, qi = Object.prototype.hasOwnProperty, Qi = Object.prototype.propertyIsEnumerable, Ji = (e, t) => {
  var n = {};
  for (var o in e)
    qi.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && mo)
    for (var o of mo(e))
      t.indexOf(o) < 0 && Qi.call(e, o) && (n[o] = e[o]);
  return n;
};
function er(e, t, n = {}) {
  const o = n, { window: a = Kn } = o, i = Ji(o, ["window"]);
  let r;
  const l = Ki(() => a && "ResizeObserver" in a), u = () => {
    r && (r.disconnect(), r = void 0);
  }, s = ce(() => ga(e), (d) => {
    u(), l.value && a && d && (r = new ResizeObserver(t), r.observe(d, i));
  }, { immediate: !0, flush: "post" }), c = () => {
    u(), s();
  };
  return Ct(c), {
    isSupported: l,
    stop: c
  };
}
var yo;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(yo || (yo = {}));
var tr = Object.defineProperty, bo = Object.getOwnPropertySymbols, nr = Object.prototype.hasOwnProperty, or = Object.prototype.propertyIsEnumerable, wo = (e, t, n) => t in e ? tr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, ar = (e, t) => {
  for (var n in t || (t = {}))
    nr.call(t, n) && wo(e, n, t[n]);
  if (bo)
    for (var n of bo(t))
      or.call(t, n) && wo(e, n, t[n]);
  return e;
};
const ir = {
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
ar({
  linear: Ai
}, ir);
function wt(e, t, n, o = {}) {
  var a, i, r;
  const {
    clone: l = !1,
    passive: u = !1,
    eventName: s,
    deep: c = !1,
    defaultValue: d
  } = o, h = tn(), b = n || (h == null ? void 0 : h.emit) || ((a = h == null ? void 0 : h.$emit) == null ? void 0 : a.bind(h)) || ((r = (i = h == null ? void 0 : h.proxy) == null ? void 0 : i.$emit) == null ? void 0 : r.bind(h == null ? void 0 : h.proxy));
  let m = s;
  t || (t = "modelValue"), m = s || m || `update:${t.toString()}`;
  const w = (_) => l ? Ye(l) ? l(_) : Wi(_) : _, E = () => $i(e[t]) ? w(e[t]) : d;
  if (u) {
    const _ = E(), P = ee(_);
    return ce(() => e[t], (G) => P.value = w(G)), ce(P, (G) => {
      (G !== e[t] || c) && b(m, G);
    }, { deep: c }), P;
  } else
    return q({
      get() {
        return E();
      },
      set(_) {
        b(m, _);
      }
    });
}
function H(e = () => {
}) {
  const t = ee(/* @__PURE__ */ new Set());
  e && t.value.add(e);
  const n = (o) => {
    t.value.delete(o);
  };
  return {
    on: (o) => {
      t.value.has(e) && t.value.delete(e), t.value.add(o);
      const a = () => n(o);
      return Ct(a), {
        off: a
      };
    },
    off: n,
    trigger: (o) => Promise.all(Array.from(t.value).map((a) => a(o))),
    fns: t
  };
}
const rr = ["production", "prod"];
function pa(e, ...t) {
  rr.includes(process.env.NODE_ENV || "") || console.warn(`[Vue Flow]: ${e}`, ...t);
}
function lr() {
  return {
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
    clickConnectStart: H(),
    clickConnectEnd: H(),
    paneReady: H(),
    move: H(),
    moveStart: H(),
    moveEnd: H(),
    selectionDragStart: H(),
    selectionDrag: H(),
    selectionDragStop: H(),
    selectionContextMenu: H(),
    selectionStart: H(),
    selectionEnd: H(),
    viewportChangeStart: H(),
    viewportChange: H(),
    viewportChangeEnd: H(),
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
    updateNodeInternals: H(),
    error: H((e) => pa(e.message))
  };
}
function ur(e, t) {
  _i(() => {
    for (const [n, o] of Object.entries(t.value)) {
      const a = (i) => {
        e(n, i);
      };
      o.on(a), Ct(() => {
        o.off(a);
      });
    }
  });
}
var pe = /* @__PURE__ */ ((e) => (e.MISSING_VIEWPORT_DIMENSIONS = "MISSING_VIEWPORT_DIMENSIONS", e.NODE_NOT_FOUND = "NODE_NOT_FOUND", e.NODE_MISSING_PARENT = "NODE_MISSING_PARENT", e.NODE_TYPE_MISSING = "NODE_TYPE_MISSING", e.NODE_EXTENT_INVALID = "NODE_EXTENT_INVALID", e.EDGE_INVALID = "EDGE_INVALID", e.EDGE_NOT_FOUND = "EDGE_NOT_FOUND", e.EDGE_SOURCE_MISSING = "EDGE_SOURCE_MISSING", e.EDGE_TARGET_MISSING = "EDGE_TARGET_MISSING", e.EDGE_TYPE_MISSING = "EDGE_TYPE_MISSING", e.EDGE_SOURCE_TARGET_SAME = "EDGE_SOURCE_TARGET_SAME", e.EDGE_SOURCE_TARGET_MISSING = "EDGE_SOURCE_TARGET_MISSING", e.EDGE_ORPHANED = "EDGE_ORPHANED", e))(pe || {});
const xo = {
  MISSING_VIEWPORT_DIMENSIONS: () => "The Vue Flow parent container needs a width and a height to render the graph",
  NODE_NOT_FOUND: (e) => `Node not found
Node: ${e}`,
  NODE_MISSING_PARENT: (e, t) => `Node is missing a parent
Node: ${e}
Parent: ${t}`,
  NODE_TYPE_MISSING: (e) => `Node type is missing
Type: ${e}`,
  NODE_EXTENT_INVALID: (e) => `Only child nodes can use a parent extent
Node: ${e}`,
  EDGE_INVALID: (e) => `An edge needs a source and a target
Edge: ${e}`,
  EDGE_SOURCE_MISSING: (e, t) => `Edge source is missing
Edge: ${e} 
Source: ${t}`,
  EDGE_TARGET_MISSING: (e, t) => `Edge target is missing
Edge: ${e} 
Target: ${t}`,
  EDGE_TYPE_MISSING: (e) => `Edge type is missing
Type: ${e}`,
  EDGE_SOURCE_TARGET_SAME: (e, t, n) => `Edge source and target are the same
Edge: ${e} 
Source: ${t} 
Target: ${n}`,
  EDGE_SOURCE_TARGET_MISSING: (e, t, n) => `Edge source or target is missing
Edge: ${e} 
Source: ${t} 
Target: ${n}`,
  EDGE_ORPHANED: (e) => `Edge was orphaned (suddenly missing source or target) and has been removed
Edge: ${e}`,
  EDGE_NOT_FOUND: (e) => `Edge not found
Edge: ${e}`
};
class me extends Error {
  constructor(t, ...n) {
    var o;
    super((o = xo[t]) == null ? void 0 : o.call(xo, ...n)), this.code = t;
  }
}
const qn = () => typeof window < "u" ? window : { chrome: !1 };
function _o(e) {
  return {
    ...e.computedPosition || { x: 0, y: 0 },
    width: e.dimensions.width || 0,
    height: e.dimensions.height || 0
  };
}
function Bn(e, t) {
  const n = Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)), o = Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y));
  return Math.ceil(n * o);
}
function nn(e) {
  return {
    width: e.offsetWidth,
    height: e.offsetHeight
  };
}
function We(e, t = 0, n = 1) {
  return Math.min(Math.max(e, t), n);
}
function ma(e, t) {
  return {
    x: We(e.x, t[0][0], t[1][0]),
    y: We(e.y, t[0][1], t[1][1])
  };
}
function Eo(e) {
  const t = e.getRootNode(), n = qn();
  return "elementFromPoint" in t ? t : n.document;
}
function dt(e) {
  return e && "id" in e && "source" in e && "target" in e;
}
function sr(e) {
  return dt(e) && "sourceNode" in e && "targetNode" in e;
}
function Vt(e) {
  return e && "id" in e && !dt(e);
}
function et(e) {
  return Vt(e) && "computedPosition" in e;
}
function cr(e) {
  return !!e.width && !!e.height && !!e.x && !!e.y;
}
function dr(e, t = {}) {
  let n = t;
  return et(e) || (n = {
    type: e.type ?? t.type ?? "default",
    dimensions: nt({
      width: 0,
      height: 0
    }),
    handleBounds: {
      source: [],
      target: []
    },
    computedPosition: nt({
      z: 0,
      ...e.position
    }),
    draggable: void 0,
    selectable: void 0,
    connectable: void 0,
    focusable: void 0,
    selected: !1,
    dragging: !1,
    resizing: !1,
    initialized: !1,
    ...t,
    data: se(e.data) ? e.data : {},
    events: nt(se(e.events) ? e.events : {})
  }), Object.assign({}, n, e, { id: e.id.toString() });
}
function ya(e, t = {}) {
  const n = se(e.events) ? e.events : t.events && se(t.events) ? t.events : {}, o = se(e.data) ? e.data : t.data && se(t.data) ? t.data : {};
  return t = sr(e) ? t : {
    ...t,
    sourceHandle: (e.sourceHandle ? e.sourceHandle.toString() : void 0) || t.sourceHandle,
    targetHandle: (e.targetHandle ? e.targetHandle.toString() : void 0) || t.targetHandle,
    type: e.type ?? t.type ?? "default",
    source: e.source.toString() || t.source,
    target: e.target.toString() || t.target,
    updatable: e.updatable ?? t.updatable,
    selectable: e.selectable ?? t.selectable,
    focusable: e.focusable ?? t.focusable,
    data: o,
    events: nt(n),
    label: (e.label && !Ae(e.label) ? nt(e.label) : e.label) || t.label,
    interactionWidth: e.interactionWidth || t.interactionWidth
  }, Object.assign({}, t, e, { id: e.id.toString() });
}
function ba({ source: e, sourceHandle: t, target: n, targetHandle: o }) {
  return `vueflow__edge-${e}${t ?? ""}-${n}${o ?? ""}`;
}
function vr(e, t) {
  return t.some(
    (n) => dt(n) && n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)
  );
}
function hr({ x: e, y: t }, { x: n, y: o, zoom: a }) {
  return {
    x: e * a + n,
    y: t * a + o
  };
}
function wa({ x: e, y: t }, { x: n, y: o, zoom: a }, i, [r, l]) {
  const u = {
    x: (e - n) / a,
    y: (t - o) / a
  };
  return i ? {
    x: r * Math.round(u.x / r),
    y: l * Math.round(u.y / l)
  } : u;
}
function fr(e, t) {
  return {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x2, t.x2),
    y2: Math.max(e.y2, t.y2)
  };
}
function xa({ x: e, y: t, width: n, height: o }) {
  return {
    x: e,
    y: t,
    x2: e + n,
    y2: t + o
  };
}
function gr({ x: e, y: t, x2: n, y2: o }) {
  return {
    x: e,
    y: t,
    width: n - e,
    height: o - t
  };
}
function _a(e) {
  const t = e.reduce(
    (n, { computedPosition: o = { x: 0, y: 0 }, dimensions: a = { width: 0, height: 0 } } = {}) => fr(
      n,
      xa({
        ...o,
        ...a
      })
    ),
    { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }
  );
  return gr(t);
}
function Ea(e, t, { x: n, y: o, zoom: a } = { x: 0, y: 0, zoom: 1 }, i = !1, r = !1) {
  const l = {
    x: (t.x - n) / a,
    y: (t.y - o) / a,
    width: t.width / a,
    height: t.height / a
  };
  return e.filter((u) => {
    const { computedPosition: s = { x: 0, y: 0 }, dimensions: c = { width: 0, height: 0 }, selectable: d } = u;
    if (r && !d)
      return !1;
    const h = { ...s, width: c.width || 0, height: c.height || 0 }, b = Bn(l, h), m = typeof c.width > "u" || typeof c.height > "u" || c.width === 0 || c.height === 0, w = i && b > 0, E = c.width * c.height;
    return m || w || b >= E;
  });
}
function on(e, t) {
  const n = e.map((o) => Ae(o) ? o : o.id);
  return t.filter((o) => n.includes(o.source) || n.includes(o.target));
}
function So(e, t, n, o, a, i = 0.1, r = { x: 0, y: 0 }) {
  const l = t / (e.width * (1 + i)), u = n / (e.height * (1 + i)), s = Math.min(l, u), c = We(s, o, a), d = e.x + e.width / 2, h = e.y + e.height / 2, b = t / 2 - d * c + (r.x ?? 0), m = n / 2 - h * c + (r.y ?? 0);
  return { x: b, y: m, zoom: c };
}
function pr(e, t) {
  return {
    x: t.x + e.x,
    y: t.y + e.y,
    z: (e.z > t.z ? e.z : t.z) + 1
  };
}
function Sa(e, t) {
  if (!e.parentNode)
    return !1;
  const n = t(e.parentNode);
  return n ? n.selected ? !0 : Sa(n, t) : !1;
}
function Ue(e, t) {
  return typeof e > "u" ? "" : typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((n) => `${n}=${e[n]}`).join("&")}`;
}
function se(e) {
  return typeof k(e) < "u";
}
function mr(e, t, n) {
  if (!e.source || !e.target)
    return n(new me(pe.EDGE_INVALID, e.id)), !1;
  let o;
  return dt(e) ? o = e : o = {
    ...e,
    id: ba(e)
  }, o = ya(o), vr(o, t) ? !1 : o;
}
function yr(e, t, n, o, a, i) {
  if (!t.source || !t.target)
    return i(new me(pe.EDGE_INVALID, e.id)), !1;
  const r = o(e.id);
  if (!r)
    return i(new me(pe.EDGE_NOT_FOUND, e.id)), !1;
  const { id: l, ...u } = e, s = {
    ...u,
    id: a ? ba(t) : l,
    source: t.source,
    target: t.target,
    sourceHandle: t.sourceHandle,
    targetHandle: t.targetHandle
  };
  return n.splice(n.indexOf(r), 1, s), s;
}
function No(e, t, n, o) {
  const a = {}, i = e.map((l) => {
    const u = dr(l, {
      ...n(l.id),
      parentNode: l.parentNode
    });
    return l.parentNode && (a[l.parentNode] = !0), u;
  }), r = [...i, ...t];
  return i.forEach((l) => {
    const u = r.find((s) => s.id === l.parentNode);
    l.parentNode && !u && o(new me(pe.NODE_MISSING_PARENT, l.id, l.parentNode)), (l.parentNode || a[l.id]) && (a[l.id] && (l.isParent = !0), u && (u.isParent = !0));
  }), i;
}
var Z = /* @__PURE__ */ ((e) => (e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom", e))(Z || {}), Qn = /* @__PURE__ */ ((e) => (e.Partial = "partial", e.Full = "full", e))(Qn || {}), Fe = /* @__PURE__ */ ((e) => (e.Bezier = "default", e.SimpleBezier = "simple-bezier", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e))(Fe || {}), qe = /* @__PURE__ */ ((e) => (e.Strict = "strict", e.Loose = "loose", e))(qe || {}), An = /* @__PURE__ */ ((e) => (e.Arrow = "arrow", e.ArrowClosed = "arrowclosed", e))(An || {}), Ut = /* @__PURE__ */ ((e) => (e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal", e))(Ut || {});
const ko = Symbol("vueFlow"), Na = Symbol("nodeId"), ka = Symbol("nodeRef"), br = Symbol("edgeId"), wr = Symbol("edgeRef"), an = Symbol("slots");
function xr(e) {
  const t = e ?? ut(Na, ""), n = ut(ka, null), { findNode: o, edges: a, emits: i } = ve(), r = o(t);
  return r || i.error(new me(pe.NODE_NOT_FOUND, t)), {
    id: t,
    nodeEl: n,
    node: r,
    parentNode: q(() => o(r.parentNode)),
    connectedEdges: q(() => on([r], a.value))
  };
}
function Jn(e) {
  return "clientX" in e;
}
function ot(e, t) {
  var n, o;
  const a = Jn(e), i = a ? e.clientX : (n = e.touches) == null ? void 0 : n[0].clientX, r = a ? e.clientY : (o = e.touches) == null ? void 0 : o[0].clientY;
  return {
    x: i - ((t == null ? void 0 : t.left) ?? 0),
    y: r - ((t == null ? void 0 : t.top) ?? 0)
  };
}
function jt(e, t, n) {
  const o = ((n == null ? void 0 : n.x) ?? 0) + t.x, a = ((n == null ? void 0 : n.y) ?? 0) + t.y, i = (n == null ? void 0 : n.width) ?? t.width, r = (n == null ? void 0 : n.height) ?? t.height;
  switch (e) {
    case Z.Top:
      return {
        x: o + i / 2,
        y: a
      };
    case Z.Right:
      return {
        x: o + i,
        y: a + r / 2
      };
    case Z.Bottom:
      return {
        x: o + i / 2,
        y: a + r
      };
    case Z.Left:
      return {
        x: o,
        y: a + r / 2
      };
  }
}
function Co(e = [], t) {
  return e.length ? !t || e.length === 1 ? e[0] : t && e.find((n) => n.id === t) || null : null;
}
function _r(e, t, n, o, a, i) {
  const r = jt(
    n,
    {
      ...e.dimensions,
      ...e.computedPosition
    },
    t
  ), l = jt(
    i,
    {
      ...o.dimensions,
      ...o.computedPosition
    },
    a
  );
  return {
    sourceX: r.x,
    sourceY: r.y,
    targetX: l.x,
    targetY: l.y
  };
}
function Er({
  sourcePos: e,
  targetPos: t,
  sourceWidth: n,
  sourceHeight: o,
  targetWidth: a,
  targetHeight: i,
  width: r,
  height: l,
  viewport: u
}) {
  const s = {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x + n, t.x + a),
    y2: Math.max(e.y + o, t.y + i)
  };
  s.x === s.x2 && (s.x2 += 1), s.y === s.y2 && (s.y2 += 1);
  const c = xa({
    x: (0 - u.x) / u.zoom,
    y: (0 - u.y) / u.zoom,
    width: r / u.zoom,
    height: l / u.zoom
  }), d = Math.max(0, Math.min(c.x2, s.x2) - Math.max(c.x, s.x)), h = Math.max(0, Math.min(c.y2, s.y2) - Math.max(c.y, s.y));
  return Math.ceil(d * h) > 0;
}
function Sr(e, t, n = !1) {
  let o = -1;
  const a = e.reduce((i, r) => {
    const l = Be(r.zIndex);
    let u = l ? r.zIndex : 0;
    const s = t(r.source), c = t(r.target);
    return !s || !c || (n && (u = l ? r.zIndex : Math.max(s.computedPosition.z || 0, c.computedPosition.z || 0)), i[u] ? i[u].push(r) : i[u] = [r], o = u > o ? u : o), i;
  }, {});
  return Object.entries(Object.keys(a).length ? a : { 0: [] }).map(([i, r]) => {
    const l = +i;
    return {
      edges: r,
      level: l,
      isMaxLevel: l === o
    };
  });
}
function En(e) {
  e == null || e.classList.remove("valid", "connecting", "vue-flow__handle-valid", "vue-flow__handle-connecting");
}
function Mo(e, t, n, o) {
  return (t[n] || []).reduce((a, i) => (`${e.id}-${i.id}-${n}` !== o && a.push({
    id: i.id || null,
    type: n,
    nodeId: e.id,
    ...jt(
      i.position,
      {
        ...e.dimensions,
        ...e.computedPosition
      },
      i
    )
  }), a), []);
}
function Nr(e, t, n) {
  let o = null, a = 1 / 0;
  return n.forEach((i) => {
    const r = Math.sqrt((i.x - e.x) ** 2 + (i.y - e.y) ** 2);
    r <= t && r < a && (a = r, o = i);
  }), o;
}
function Po(e, t, n, o, a, i, r, l, u, s) {
  const c = i === "target", d = l.querySelector(`.vue-flow__handle[data-id="${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`), { x: h, y: b } = ot(e), m = l.elementFromPoint(h, b), w = m != null && m.classList.contains("vue-flow__handle") ? m : d, E = {
    handleDomNode: w,
    isValid: !1,
    connection: { source: "", target: "", sourceHandle: null, targetHandle: null },
    endHandle: null
  };
  if (w) {
    const _ = Ca(void 0, w), P = w.getAttribute("data-nodeid"), G = w.getAttribute("data-handleid"), y = w.classList.contains("connectable"), I = w.classList.contains("connectableend"), z = {
      source: c ? P : o,
      sourceHandle: c ? G : a,
      target: c ? o : P,
      targetHandle: c ? a : G
    };
    E.connection = z, y && I && (n === qe.Strict ? c && _ === "source" || !c && _ === "target" : P !== o || G !== a) && (E.endHandle = {
      nodeId: P,
      handleId: G,
      type: _
    }, E.isValid = r(z, {
      edges: u,
      sourceNode: s(z.source),
      targetNode: s(z.target)
    }));
  }
  return E;
}
function kr({ nodes: e, nodeId: t, handleId: n, handleType: o }) {
  return e.reduce((a, i) => {
    const { handleBounds: r } = i;
    let l = [], u = [];
    return r && (l = Mo(i, r, "source", `${t}-${n}-${o}`), u = Mo(i, r, "target", `${t}-${n}-${o}`)), a.push(...l, ...u), a;
  }, []);
}
function Ca(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function Cr(e, t) {
  let n = null;
  return t ? n = "valid" : e && !t && (n = "invalid"), n;
}
function Io(e, t, n) {
  return e < t ? We(Math.abs(e - t), 1, 50) / 50 : e > n ? -We(Math.abs(e - n), 1, 50) / 50 : 0;
}
function Ma(e, t) {
  const n = Io(e.x, 35, t.width - 35) * 20, o = Io(e.y, 35, t.height - 35) * 20;
  return [n, o];
}
function $t() {
  return !0;
}
function Pa({
  handleId: e,
  nodeId: t,
  type: n,
  isValidConnection: o,
  edgeUpdaterType: a,
  onEdgeUpdate: i,
  onEdgeUpdateEnd: r
}) {
  const l = q(() => le(n) === "target"), {
    vueFlowRef: u,
    connectionMode: s,
    connectionRadius: c,
    connectOnClick: d,
    connectionClickStartHandle: h,
    nodesConnectable: b,
    autoPanOnConnect: m,
    findNode: w,
    panBy: E,
    getNodes: _,
    startConnection: P,
    updateConnection: G,
    endConnection: y,
    emits: I,
    viewport: z,
    edges: f,
    isValidConnection: x
  } = ve();
  let N = null, C = !1, T = null;
  function J(p) {
    var R;
    const S = Jn(p), B = Eo(p.target);
    if (S && p.button === 0 || !S) {
      let F = function(Q) {
        D = ot(Q, g), V = Nr(
          wa(D, z.value, !1, [1, 1]),
          c.value,
          Y
        ), L || (W(), L = !0);
        const oe = Po(
          Q,
          V,
          s.value,
          le(t),
          le(e),
          l.value ? "target" : "source",
          U,
          B,
          f.value,
          w
        );
        if (N = oe.connection, C = oe.isValid, T = oe.handleDomNode, G(
          V && C ? hr(
            {
              x: V.x,
              y: V.y
            },
            z.value
          ) : D,
          oe.endHandle,
          Cr(!!V, C)
        ), !V && !C && !T)
          return En($);
        N && N.source !== N.target && T && (En($), $ = T, T.classList.add("connecting", "vue-flow__handle-connecting"), T.classList.toggle("valid", C), T.classList.toggle("vue-flow__handle-valid", C));
      }, j = function(Q) {
        (V || T) && N && C && (i ? i(Q, N) : I.connect(N)), I.connectEnd(Q), a && (r == null || r(Q)), En($), cancelAnimationFrame(K), y(Q), L = !1, C = !1, N = null, T = null, B.removeEventListener("mousemove", F), B.removeEventListener("mouseup", j), B.removeEventListener("touchmove", F), B.removeEventListener("touchend", j);
      };
      const A = w(le(t));
      let U = o || x.value || $t;
      !U && A && (U = (l ? A.isValidSourcePos : A.isValidTargetPos) || $t);
      let V, K = 0;
      const { x: ne, y: re } = ot(p), M = B == null ? void 0 : B.elementFromPoint(ne, re), v = Ca(le(a), M), g = (R = u.value) == null ? void 0 : R.getBoundingClientRect();
      if (!g || !v)
        return;
      let $, D = ot(p, g), L = !1;
      const Y = kr({
        nodes: _.value,
        nodeId: le(t),
        handleId: le(e),
        handleType: v
      }), W = () => {
        if (!m)
          return;
        const [Q, oe] = Ma(D, g);
        E({ x: Q, y: oe }), K = requestAnimationFrame(W);
      };
      P(
        {
          nodeId: le(t),
          handleId: le(e),
          type: v
        },
        {
          x: ne - g.left,
          y: re - g.top
        },
        p
      ), I.connectStart({ event: p, nodeId: le(t), handleId: le(e), handleType: v }), B.addEventListener("mousemove", F), B.addEventListener("mouseup", j), B.addEventListener("touchmove", F), B.addEventListener("touchend", j);
    }
  }
  function ae(p) {
    if (d.value)
      if (!h.value)
        I.clickConnectStart({ event: p, nodeId: le(t), handleId: le(e) }), P(
          { nodeId: le(t), type: le(n), handleId: le(e) },
          void 0,
          p,
          !0
        );
      else {
        let R = o || x.value || $t;
        const S = w(le(t));
        if (!R && S && (R = (l ? S.isValidSourcePos : S.isValidTargetPos) || $t), S && (typeof S.connectable > "u" ? b.value : S.connectable) === !1)
          return;
        const B = Eo(p.target), { connection: F, isValid: j } = Po(
          p,
          {
            nodeId: le(t),
            id: le(e),
            type: le(n)
          },
          s.value,
          h.value.nodeId,
          h.value.handleId || null,
          h.value.type,
          R,
          B,
          f.value,
          w
        ), A = F.source === F.target;
        j && !A && I.connect(F), I.clickConnectEnd(p), y(p, !0);
      }
  }
  return {
    handlePointerDown: J,
    handleClick: ae
  };
}
function Mr(e, t) {
  const n = {};
  for (const o in e)
    t.includes(o) || Object.defineProperty(n, o, {
      enumerable: !0,
      get: () => e[o]
    });
  return n;
}
const Pr = ["data-id", "data-handleid", "data-nodeid", "data-handlepos"], Ir = {
  name: "Handle",
  compatConfig: { MODE: 3 }
}, vt = /* @__PURE__ */ fe({
  ...Ir,
  props: {
    id: null,
    type: null,
    position: { default: Z.Top },
    isValidConnection: { type: Function },
    connectable: { type: [Boolean, String, Function], default: void 0 },
    connectableStart: { type: Boolean, default: !0 },
    connectableEnd: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = Mr(e, ["position", "connectable", "connectableStart", "connectableEnd", "id", "isValidConnection"]), n = O(t, "type", "source"), {
      connectionStartHandle: o,
      connectionClickStartHandle: a,
      connectionEndHandle: i,
      vueFlowRef: r,
      nodesConnectable: l,
      noDragClassName: u,
      noPanClassName: s
    } = ve(), { id: c, node: d, nodeEl: h, connectedEdges: b } = xr(), m = ee(), w = q(() => e.id ?? `${c}__handle-${e.position}`), E = q(() => typeof e.connectableStart < "u" ? e.connectableStart : !0), _ = q(() => typeof e.connectableEnd < "u" ? e.connectableEnd : !0), { handlePointerDown: P, handleClick: G } = Pa({
      nodeId: c,
      handleId: w,
      isValidConnection: e.isValidConnection,
      type: n
    }), y = q(() => Ae(e.connectable) && e.connectable === "single" ? !b.value.some((N) => {
      const C = N[`${n.value}Handle`];
      return N[n.value] !== c ? !1 : C ? C === w.value : !0;
    }) : Ye(e.connectable) ? e.connectable(d, b.value) : se(e.connectable) ? e.connectable : l.value), I = q(
      () => {
        var N, C, T, J, ae, p;
        return ((N = o.value) == null ? void 0 : N.nodeId) === c && ((C = o.value) == null ? void 0 : C.handleId) === w.value && ((T = o.value) == null ? void 0 : T.type) === n.value || ((J = i.value) == null ? void 0 : J.nodeId) === c && ((ae = i.value) == null ? void 0 : ae.handleId) === w.value && ((p = i.value) == null ? void 0 : p.type) === n.value;
      }
    ), z = q(
      () => {
        var N, C, T;
        return ((N = a.value) == null ? void 0 : N.nodeId) === c && ((C = a.value) == null ? void 0 : C.handleId) === w.value && ((T = a.value) == null ? void 0 : T.type) === n.value;
      }
    );
    be(() => d.initialized).toBe(!0, { flush: "post" }).then(() => {
      var N;
      const C = (N = d.handleBounds[n.value]) == null ? void 0 : N.find((B) => B.id === w.value);
      if (!r.value || C)
        return;
      const T = r.value.querySelector(".vue-flow__transformationpane");
      if (!h || !m.value || !T || !w.value)
        return;
      const J = h.value.getBoundingClientRect(), ae = m.value.getBoundingClientRect(), p = window.getComputedStyle(T), { m22: R } = new window.DOMMatrixReadOnly(p.transform), S = {
        id: w.value,
        position: e.position,
        x: (ae.left - J.left) / R,
        y: (ae.top - J.top) / R,
        ...nn(m.value)
      };
      d.handleBounds[n.value] = [...d.handleBounds[n.value] ?? [], S];
    });
    function f(N) {
      const C = Jn(N);
      y.value && E.value && (C && N.button === 0 || !C) && P(N);
    }
    function x(N) {
      !c || !a.value && !E.value || y.value && G(N);
    }
    return (N, C) => (te(), ie("div", {
      ref_key: "handle",
      ref: m,
      "data-id": `${k(c)}-${k(w)}-${k(n)}`,
      "data-handleid": k(w),
      "data-nodeid": k(c),
      "data-handlepos": e.position,
      class: Ke(["vue-flow__handle", [
        `vue-flow__handle-${e.position}`,
        `vue-flow__handle-${k(w)}`,
        k(u),
        k(s),
        k(n),
        {
          connectable: k(y),
          connecting: k(z),
          connectablestart: k(E),
          connectableend: k(_),
          connectionindicator: k(y) && (k(E) && !k(I) || k(_) && k(I))
        }
      ]]),
      onMousedown: f,
      onTouchstartPassive: f,
      onClick: x
    }, [
      xe(N.$slots, "default", { id: e.id })
    ], 42, Pr));
  }
}), rn = function({
  sourcePosition: e = Z.Bottom,
  targetPosition: t = Z.Top,
  label: n,
  connectable: o = !0,
  isValidTargetPos: a,
  isValidSourcePos: i
}) {
  return [
    ue(vt, { type: "target", position: t, connectable: o, isValidConnection: a }),
    typeof n != "string" && n ? ue(n) : ue("div", { innerHTML: n }),
    ue(vt, { type: "source", position: e, connectable: o, isValidConnection: i })
  ];
};
rn.props = ["sourcePosition", "targetPosition", "label", "isValidTargetPos", "isValidSourcePos", "connectable"];
rn.inheritAttrs = !1;
rn.compatConfig = { MODE: 3 };
const $r = rn, ln = function({
  sourcePosition: e = Z.Bottom,
  label: t,
  connectable: n = !0,
  isValidSourcePos: o
}) {
  return [
    typeof t != "string" && t ? ue(t) : ue("div", { innerHTML: t }),
    ue(vt, { type: "source", position: e, connectable: n, isValidConnection: o })
  ];
};
ln.props = ["sourcePosition", "label", "isValidSourcePos", "connectable"];
ln.inheritAttrs = !1;
ln.compatConfig = { MODE: 3 };
const Tr = ln, un = function({
  targetPosition: e = Z.Top,
  label: t,
  connectable: n = !0,
  isValidTargetPos: o
}) {
  return [
    ue(vt, { type: "target", position: e, connectable: n, isValidConnection: o }),
    typeof t != "string" && t ? ue(t) : ue("div", { innerHTML: t })
  ];
};
un.props = ["targetPosition", "label", "isValidTargetPos", "connectable"];
un.inheritAttrs = !1;
un.compatConfig = { MODE: 3 };
const Or = un;
function $o(e, t, n) {
  let o = e;
  do {
    if (o && o.matches(t))
      return !0;
    if (o === n)
      return !1;
    o = o.parentElement;
  } while (o);
  return !1;
}
function Dr(e, t, n, o, a) {
  return e.filter(
    (i) => (i.selected || i.id === a) && (!i.parentNode || !Sa(i, o)) && (i.draggable || t && typeof i.draggable > "u")
  ).map(
    (i) => {
      var r, l;
      return nt({
        id: i.id,
        position: i.position || { x: 0, y: 0 },
        distance: {
          x: n.x - ((r = i.computedPosition) == null ? void 0 : r.x) || 0,
          y: n.y - ((l = i.computedPosition) == null ? void 0 : l.y) || 0
        },
        from: i.computedPosition,
        extent: i.extent,
        parentNode: i.parentNode,
        dimensions: i.dimensions
      });
    }
  );
}
function Sn({
  id: e,
  dragItems: t,
  findNode: n
}) {
  const o = t.reduce((a, i) => {
    const r = n(i.id);
    return r && a.push(r), a;
  }, []);
  return [e ? o.find((a) => a.id === e) : o[0], o];
}
function Ia(e) {
  if (Array.isArray(e))
    switch (e.length) {
      case 1:
        return [e[0], e[0], e[0], e[0]];
      case 2:
        return [e[0], e[1], e[0], e[1]];
      case 3:
        return [e[0], e[1], e[2], e[1]];
      case 4:
        return e;
      default:
        return [0, 0, 0, 0];
    }
  return [e, e, e, e];
}
function Br(e, t, n) {
  const [o, a, i, r] = typeof e != "string" ? Ia(e.padding) : [0, 0, 0, 0];
  return n && Be(n.computedPosition.x) && Be(n.computedPosition.y) && Be(n.dimensions.width) && Be(n.dimensions.height) ? [
    [n.computedPosition.x + r, n.computedPosition.y + o],
    [
      n.computedPosition.x + (n.dimensions.width - t.dimensions.width) - a,
      n.computedPosition.y + (n.dimensions.height - t.dimensions.height) - i
    ]
  ] : !1;
}
function Ar(e, t, n, o) {
  let a = e.extent || n;
  if (a === "parent" || !Array.isArray(a) && (a == null ? void 0 : a.range) === "parent")
    if (e.parentNode && o && e.dimensions.width && e.dimensions.height) {
      const i = Br(a, e, o);
      i && (a = i);
    } else
      t(new me(pe.NODE_EXTENT_INVALID, e.id)), a = n;
  else if (Array.isArray(a)) {
    const i = (o == null ? void 0 : o.computedPosition.x) || 0, r = (o == null ? void 0 : o.computedPosition.y) || 0;
    a = [
      [a[0][0] + i, a[0][1] + r],
      [a[1][0] + i, a[1][1] + r]
    ];
  } else if (a != null && a.range && Array.isArray(a.range)) {
    const [i, r, l, u] = Ia(a.padding), s = (o == null ? void 0 : o.computedPosition.x) || 0, c = (o == null ? void 0 : o.computedPosition.y) || 0;
    a = [
      [a.range[0][0] + s + u, a.range[0][1] + c + i],
      [a.range[1][0] + s - r, a.range[1][1] + c - l]
    ];
  }
  return a;
}
function eo(e, t, n, o, a) {
  const i = Ar(e, n, o, a), r = ma(t, i);
  return {
    position: {
      x: r.x - ((a == null ? void 0 : a.computedPosition.x) || 0),
      y: r.y - ((a == null ? void 0 : a.computedPosition.y) || 0)
    },
    computedPosition: r
  };
}
function $a() {
  const { getSelectedNodes: e, nodeExtent: t, updateNodePositions: n, findNode: o, snapGrid: a, snapToGrid: i, nodesDraggable: r, emits: l } = ve();
  return (u, s = !1) => {
    const c = i.value ? a.value[0] : 5, d = i.value ? a.value[1] : 5, h = s ? 4 : 1, b = u.x * c * h, m = u.y * d * h, w = e.value.filter((E) => E.draggable || r && typeof E.draggable > "u").map((E) => {
      const _ = { x: E.computedPosition.x + b, y: E.computedPosition.y + m }, { computedPosition: P } = eo(
        E,
        _,
        l.error,
        t.value,
        E.parentNode ? o(E.parentNode) : void 0
      );
      return {
        id: E.id,
        position: P,
        from: E.position,
        distance: { x: u.x, y: u.y },
        dimensions: E.dimensions
      };
    });
    n(w, !0, !1);
  };
}
function zr() {
  return {
    doubleClick: H(),
    click: H(),
    mouseEnter: H(),
    mouseMove: H(),
    mouseLeave: H(),
    contextMenu: H(),
    dragStart: H(),
    drag: H(),
    dragStop: H()
  };
}
function Rr(e, t) {
  const n = zr();
  return n.doubleClick.on((o) => {
    var a, i;
    t.nodeDoubleClick(o), (i = (a = e.events) == null ? void 0 : a.doubleClick) == null || i.call(a, o);
  }), n.click.on((o) => {
    var a, i;
    t.nodeClick(o), (i = (a = e.events) == null ? void 0 : a.click) == null || i.call(a, o);
  }), n.mouseEnter.on((o) => {
    var a, i;
    t.nodeMouseEnter(o), (i = (a = e.events) == null ? void 0 : a.mouseEnter) == null || i.call(a, o);
  }), n.mouseMove.on((o) => {
    var a, i;
    t.nodeMouseMove(o), (i = (a = e.events) == null ? void 0 : a.mouseMove) == null || i.call(a, o);
  }), n.mouseLeave.on((o) => {
    var a, i;
    t.nodeMouseLeave(o), (i = (a = e.events) == null ? void 0 : a.mouseLeave) == null || i.call(a, o);
  }), n.contextMenu.on((o) => {
    var a, i;
    t.nodeContextMenu(o), (i = (a = e.events) == null ? void 0 : a.contextMenu) == null || i.call(a, o);
  }), n.dragStart.on((o) => {
    var a, i;
    t.nodeDragStart(o), (i = (a = e.events) == null ? void 0 : a.dragStart) == null || i.call(a, o);
  }), n.drag.on((o) => {
    var a, i;
    t.nodeDrag(o), (i = (a = e.events) == null ? void 0 : a.drag) == null || i.call(a, o);
  }), n.dragStop.on((o) => {
    var a, i;
    t.nodeDragStop(o), (i = (a = e.events) == null ? void 0 : a.dragStop) == null || i.call(a, o);
  }), Object.entries(n).reduce(
    (o, [a, i]) => (o.emit[a] = i.trigger, o.on[a] = i.on, o),
    { emit: {}, on: {} }
  );
}
function Vr() {
  const { viewport: e, snapGrid: t, snapToGrid: n } = ve();
  return ({ sourceEvent: o }) => {
    const a = o.touches ? o.touches[0].clientX : o.clientX, i = o.touches ? o.touches[0].clientY : o.clientY, r = {
      x: (a - e.value.x) / e.value.zoom,
      y: (i - e.value.y) / e.value.zoom
    };
    return {
      xSnapped: n.value ? t.value[0] * Math.round(r.x / t.value[0]) : r.x,
      ySnapped: n.value ? t.value[1] * Math.round(r.y / t.value[1]) : r.y,
      ...r
    };
  };
}
function To(e, t, n) {
  const o = t.querySelectorAll(`.vue-flow__handle${e}`);
  if (!o || !o.length)
    return;
  const a = Array.from(o), i = t.getBoundingClientRect();
  return a.map((r) => {
    const l = r.getBoundingClientRect();
    return {
      id: r.getAttribute("data-handleid"),
      position: r.getAttribute("data-handlepos"),
      x: (l.left - i.left) / n,
      y: (l.top - i.top) / n,
      ...nn(r)
    };
  });
}
function zn(e, t, n, o, a, i = !1, r) {
  a.value = !1, e.selected ? (i || e.selected && t) && (o([e]), Re(r.blur)) : n([e]);
}
var Lr = { value: () => {
} };
function sn() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o))
      throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Lt(n);
}
function Lt(e) {
  this._ = e;
}
function Yr(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", a = n.indexOf(".");
    if (a >= 0 && (o = n.slice(a + 1), n = n.slice(0, a)), n && !t.hasOwnProperty(n))
      throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Lt.prototype = sn.prototype = {
  constructor: Lt,
  on: function(e, t) {
    var n = this._, o = Yr(e + "", n), a, i = -1, r = o.length;
    if (arguments.length < 2) {
      for (; ++i < r; )
        if ((a = (e = o[i]).type) && (a = Xr(n[a], e.name)))
          return a;
      return;
    }
    if (t != null && typeof t != "function")
      throw new Error("invalid callback: " + t);
    for (; ++i < r; )
      if (a = (e = o[i]).type)
        n[a] = Oo(n[a], e.name, t);
      else if (t == null)
        for (a in n)
          n[a] = Oo(n[a], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t)
      e[n] = t[n].slice();
    return new Lt(e);
  },
  call: function(e, t) {
    if ((a = arguments.length - 2) > 0)
      for (var n = new Array(a), o = 0, a, i; o < a; ++o)
        n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (i = this._[e], o = 0, a = i.length; o < a; ++o)
      i[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (var o = this._[e], a = 0, i = o.length; a < i; ++a)
      o[a].value.apply(t, n);
  }
};
function Xr(e, t) {
  for (var n = 0, o = e.length, a; n < o; ++n)
    if ((a = e[n]).name === t)
      return a.value;
}
function Oo(e, t, n) {
  for (var o = 0, a = e.length; o < a; ++o)
    if (e[o].name === t) {
      e[o] = Lr, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Rn = "http://www.w3.org/1999/xhtml";
const Do = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Rn,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function cn(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Do.hasOwnProperty(t) ? { space: Do[t], local: e } : e;
}
function Gr(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Rn && t.documentElement.namespaceURI === Rn ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Hr(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Ta(e) {
  var t = cn(e);
  return (t.local ? Hr : Gr)(t);
}
function Fr() {
}
function to(e) {
  return e == null ? Fr : function() {
    return this.querySelector(e);
  };
}
function Ur(e) {
  typeof e != "function" && (e = to(e));
  for (var t = this._groups, n = t.length, o = new Array(n), a = 0; a < n; ++a)
    for (var i = t[a], r = i.length, l = o[a] = new Array(r), u, s, c = 0; c < r; ++c)
      (u = i[c]) && (s = e.call(u, u.__data__, c, i)) && ("__data__" in u && (s.__data__ = u.__data__), l[c] = s);
  return new we(o, this._parents);
}
function jr(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Zr() {
  return [];
}
function Oa(e) {
  return e == null ? Zr : function() {
    return this.querySelectorAll(e);
  };
}
function Kr(e) {
  return function() {
    return jr(e.apply(this, arguments));
  };
}
function Wr(e) {
  typeof e == "function" ? e = Kr(e) : e = Oa(e);
  for (var t = this._groups, n = t.length, o = [], a = [], i = 0; i < n; ++i)
    for (var r = t[i], l = r.length, u, s = 0; s < l; ++s)
      (u = r[s]) && (o.push(e.call(u, u.__data__, s, r)), a.push(u));
  return new we(o, a);
}
function Da(e) {
  return function() {
    return this.matches(e);
  };
}
function Ba(e) {
  return function(t) {
    return t.matches(e);
  };
}
var qr = Array.prototype.find;
function Qr(e) {
  return function() {
    return qr.call(this.children, e);
  };
}
function Jr() {
  return this.firstElementChild;
}
function el(e) {
  return this.select(e == null ? Jr : Qr(typeof e == "function" ? e : Ba(e)));
}
var tl = Array.prototype.filter;
function nl() {
  return Array.from(this.children);
}
function ol(e) {
  return function() {
    return tl.call(this.children, e);
  };
}
function al(e) {
  return this.selectAll(e == null ? nl : ol(typeof e == "function" ? e : Ba(e)));
}
function il(e) {
  typeof e != "function" && (e = Da(e));
  for (var t = this._groups, n = t.length, o = new Array(n), a = 0; a < n; ++a)
    for (var i = t[a], r = i.length, l = o[a] = [], u, s = 0; s < r; ++s)
      (u = i[s]) && e.call(u, u.__data__, s, i) && l.push(u);
  return new we(o, this._parents);
}
function Aa(e) {
  return new Array(e.length);
}
function rl() {
  return new we(this._enter || this._groups.map(Aa), this._parents);
}
function Zt(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Zt.prototype = {
  constructor: Zt,
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
function ll(e) {
  return function() {
    return e;
  };
}
function ul(e, t, n, o, a, i) {
  for (var r = 0, l, u = t.length, s = i.length; r < s; ++r)
    (l = t[r]) ? (l.__data__ = i[r], o[r] = l) : n[r] = new Zt(e, i[r]);
  for (; r < u; ++r)
    (l = t[r]) && (a[r] = l);
}
function sl(e, t, n, o, a, i, r) {
  var l, u, s = /* @__PURE__ */ new Map(), c = t.length, d = i.length, h = new Array(c), b;
  for (l = 0; l < c; ++l)
    (u = t[l]) && (h[l] = b = r.call(u, u.__data__, l, t) + "", s.has(b) ? a[l] = u : s.set(b, u));
  for (l = 0; l < d; ++l)
    b = r.call(e, i[l], l, i) + "", (u = s.get(b)) ? (o[l] = u, u.__data__ = i[l], s.delete(b)) : n[l] = new Zt(e, i[l]);
  for (l = 0; l < c; ++l)
    (u = t[l]) && s.get(h[l]) === u && (a[l] = u);
}
function cl(e) {
  return e.__data__;
}
function dl(e, t) {
  if (!arguments.length)
    return Array.from(this, cl);
  var n = t ? sl : ul, o = this._parents, a = this._groups;
  typeof e != "function" && (e = ll(e));
  for (var i = a.length, r = new Array(i), l = new Array(i), u = new Array(i), s = 0; s < i; ++s) {
    var c = o[s], d = a[s], h = d.length, b = vl(e.call(c, c && c.__data__, s, o)), m = b.length, w = l[s] = new Array(m), E = r[s] = new Array(m), _ = u[s] = new Array(h);
    n(c, d, w, E, _, b, t);
    for (var P = 0, G = 0, y, I; P < m; ++P)
      if (y = w[P]) {
        for (P >= G && (G = P + 1); !(I = E[G]) && ++G < m; )
          ;
        y._next = I || null;
      }
  }
  return r = new we(r, o), r._enter = l, r._exit = u, r;
}
function vl(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function hl() {
  return new we(this._exit || this._groups.map(Aa), this._parents);
}
function fl(e, t, n) {
  var o = this.enter(), a = this, i = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (a = t(a), a && (a = a.selection())), n == null ? i.remove() : n(i), o && a ? o.merge(a).order() : a;
}
function gl(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, a = n.length, i = o.length, r = Math.min(a, i), l = new Array(a), u = 0; u < r; ++u)
    for (var s = n[u], c = o[u], d = s.length, h = l[u] = new Array(d), b, m = 0; m < d; ++m)
      (b = s[m] || c[m]) && (h[m] = b);
  for (; u < a; ++u)
    l[u] = n[u];
  return new we(l, this._parents);
}
function pl() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], a = o.length - 1, i = o[a], r; --a >= 0; )
      (r = o[a]) && (i && r.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(r, i), i = r);
  return this;
}
function ml(e) {
  e || (e = yl);
  function t(d, h) {
    return d && h ? e(d.__data__, h.__data__) : !d - !h;
  }
  for (var n = this._groups, o = n.length, a = new Array(o), i = 0; i < o; ++i) {
    for (var r = n[i], l = r.length, u = a[i] = new Array(l), s, c = 0; c < l; ++c)
      (s = r[c]) && (u[c] = s);
    u.sort(t);
  }
  return new we(a, this._parents).order();
}
function yl(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function bl() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function wl() {
  return Array.from(this);
}
function xl() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], a = 0, i = o.length; a < i; ++a) {
      var r = o[a];
      if (r)
        return r;
    }
  return null;
}
function _l() {
  let e = 0;
  for (const t of this)
    ++e;
  return e;
}
function El() {
  return !this.node();
}
function Sl(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var a = t[n], i = 0, r = a.length, l; i < r; ++i)
      (l = a[i]) && e.call(l, l.__data__, i, a);
  return this;
}
function Nl(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function kl(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Cl(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Ml(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Pl(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Il(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function $l(e, t) {
  var n = cn(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? kl : Nl : typeof t == "function" ? n.local ? Il : Pl : n.local ? Ml : Cl)(n, t));
}
function za(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Tl(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Ol(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Dl(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function Bl(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? Tl : typeof t == "function" ? Dl : Ol)(e, t, n ?? "")) : ht(this.node(), e);
}
function ht(e, t) {
  return e.style.getPropertyValue(t) || za(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Al(e) {
  return function() {
    delete this[e];
  };
}
function zl(e, t) {
  return function() {
    this[e] = t;
  };
}
function Rl(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Vl(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Al : typeof t == "function" ? Rl : zl)(e, t)) : this.node()[e];
}
function Ra(e) {
  return e.trim().split(/^|\s+/);
}
function no(e) {
  return e.classList || new Va(e);
}
function Va(e) {
  this._node = e, this._names = Ra(e.getAttribute("class") || "");
}
Va.prototype = {
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
function La(e, t) {
  for (var n = no(e), o = -1, a = t.length; ++o < a; )
    n.add(t[o]);
}
function Ya(e, t) {
  for (var n = no(e), o = -1, a = t.length; ++o < a; )
    n.remove(t[o]);
}
function Ll(e) {
  return function() {
    La(this, e);
  };
}
function Yl(e) {
  return function() {
    Ya(this, e);
  };
}
function Xl(e, t) {
  return function() {
    (t.apply(this, arguments) ? La : Ya)(this, e);
  };
}
function Gl(e, t) {
  var n = Ra(e + "");
  if (arguments.length < 2) {
    for (var o = no(this.node()), a = -1, i = n.length; ++a < i; )
      if (!o.contains(n[a]))
        return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Xl : t ? Ll : Yl)(n, t));
}
function Hl() {
  this.textContent = "";
}
function Fl(e) {
  return function() {
    this.textContent = e;
  };
}
function Ul(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function jl(e) {
  return arguments.length ? this.each(e == null ? Hl : (typeof e == "function" ? Ul : Fl)(e)) : this.node().textContent;
}
function Zl() {
  this.innerHTML = "";
}
function Kl(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Wl(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function ql(e) {
  return arguments.length ? this.each(e == null ? Zl : (typeof e == "function" ? Wl : Kl)(e)) : this.node().innerHTML;
}
function Ql() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Jl() {
  return this.each(Ql);
}
function eu() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function tu() {
  return this.each(eu);
}
function nu(e) {
  var t = typeof e == "function" ? e : Ta(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function ou() {
  return null;
}
function au(e, t) {
  var n = typeof e == "function" ? e : Ta(e), o = t == null ? ou : typeof t == "function" ? t : to(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function iu() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function ru() {
  return this.each(iu);
}
function lu() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function uu() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function su(e) {
  return this.select(e ? uu : lu);
}
function cu(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function du(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function vu(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function hu(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, a = t.length, i; n < a; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++o] = i;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function fu(e, t, n) {
  return function() {
    var o = this.__on, a, i = du(t);
    if (o) {
      for (var r = 0, l = o.length; r < l; ++r)
        if ((a = o[r]).type === e.type && a.name === e.name) {
          this.removeEventListener(a.type, a.listener, a.options), this.addEventListener(a.type, a.listener = i, a.options = n), a.value = t;
          return;
        }
    }
    this.addEventListener(e.type, i, n), a = { type: e.type, name: e.name, value: t, listener: i, options: n }, o ? o.push(a) : this.__on = [a];
  };
}
function gu(e, t, n) {
  var o = vu(e + ""), a, i = o.length, r;
  if (arguments.length < 2) {
    var l = this.node().__on;
    if (l) {
      for (var u = 0, s = l.length, c; u < s; ++u)
        for (a = 0, c = l[u]; a < i; ++a)
          if ((r = o[a]).type === c.type && r.name === c.name)
            return c.value;
    }
    return;
  }
  for (l = t ? fu : hu, a = 0; a < i; ++a)
    this.each(l(o[a], t, n));
  return this;
}
function Xa(e, t, n) {
  var o = za(e), a = o.CustomEvent;
  typeof a == "function" ? a = new a(t, n) : (a = o.document.createEvent("Event"), n ? (a.initEvent(t, n.bubbles, n.cancelable), a.detail = n.detail) : a.initEvent(t, !1, !1)), e.dispatchEvent(a);
}
function pu(e, t) {
  return function() {
    return Xa(this, e, t);
  };
}
function mu(e, t) {
  return function() {
    return Xa(this, e, t.apply(this, arguments));
  };
}
function yu(e, t) {
  return this.each((typeof t == "function" ? mu : pu)(e, t));
}
function* bu() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], a = 0, i = o.length, r; a < i; ++a)
      (r = o[a]) && (yield r);
}
var Ga = [null];
function we(e, t) {
  this._groups = e, this._parents = t;
}
function Mt() {
  return new we([[document.documentElement]], Ga);
}
function wu() {
  return this;
}
we.prototype = Mt.prototype = {
  constructor: we,
  select: Ur,
  selectAll: Wr,
  selectChild: el,
  selectChildren: al,
  filter: il,
  data: dl,
  enter: rl,
  exit: hl,
  join: fl,
  merge: gl,
  selection: wu,
  order: pl,
  sort: ml,
  call: bl,
  nodes: wl,
  node: xl,
  size: _l,
  empty: El,
  each: Sl,
  attr: $l,
  style: Bl,
  property: Vl,
  classed: Gl,
  text: jl,
  html: ql,
  raise: Jl,
  lower: tu,
  append: nu,
  insert: au,
  remove: ru,
  clone: su,
  datum: cu,
  on: gu,
  dispatch: yu,
  [Symbol.iterator]: bu
};
function Ee(e) {
  return typeof e == "string" ? new we([[document.querySelector(e)]], [document.documentElement]) : new we([[e]], Ga);
}
function xu(e) {
  let t;
  for (; t = e.sourceEvent; )
    e = t;
  return e;
}
function Me(e, t) {
  if (e = xu(e), t === void 0 && (t = e.currentTarget), t) {
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
const _u = { passive: !1 }, _t = { capture: !0, passive: !1 };
function Nn(e) {
  e.stopImmediatePropagation();
}
function at(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Ha(e) {
  var t = e.document.documentElement, n = Ee(e).on("dragstart.drag", at, _t);
  "onselectstart" in t ? n.on("selectstart.drag", at, _t) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Fa(e, t) {
  var n = e.document.documentElement, o = Ee(e).on("dragstart.drag", null);
  t && (o.on("click.drag", at, _t), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Tt = (e) => () => e;
function Vn(e, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: a,
  active: i,
  x: r,
  y: l,
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
    active: { value: i, enumerable: !0, configurable: !0 },
    x: { value: r, enumerable: !0, configurable: !0 },
    y: { value: l, enumerable: !0, configurable: !0 },
    dx: { value: u, enumerable: !0, configurable: !0 },
    dy: { value: s, enumerable: !0, configurable: !0 },
    _: { value: c }
  });
}
Vn.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function Eu(e) {
  return !e.ctrlKey && !e.button;
}
function Su() {
  return this.parentNode;
}
function Nu(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function ku() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Cu() {
  var e = Eu, t = Su, n = Nu, o = ku, a = {}, i = sn("start", "drag", "end"), r = 0, l, u, s, c, d = 0;
  function h(y) {
    y.on("mousedown.drag", b).filter(o).on("touchstart.drag", E).on("touchmove.drag", _, _u).on("touchend.drag touchcancel.drag", P).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function b(y, I) {
    if (!(c || !e.call(this, y, I))) {
      var z = G(this, t.call(this, y, I), y, I, "mouse");
      z && (Ee(y.view).on("mousemove.drag", m, _t).on("mouseup.drag", w, _t), Ha(y.view), Nn(y), s = !1, l = y.clientX, u = y.clientY, z("start", y));
    }
  }
  function m(y) {
    if (at(y), !s) {
      var I = y.clientX - l, z = y.clientY - u;
      s = I * I + z * z > d;
    }
    a.mouse("drag", y);
  }
  function w(y) {
    Ee(y.view).on("mousemove.drag mouseup.drag", null), Fa(y.view, s), at(y), a.mouse("end", y);
  }
  function E(y, I) {
    if (e.call(this, y, I)) {
      var z = y.changedTouches, f = t.call(this, y, I), x = z.length, N, C;
      for (N = 0; N < x; ++N)
        (C = G(this, f, y, I, z[N].identifier, z[N])) && (Nn(y), C("start", y, z[N]));
    }
  }
  function _(y) {
    var I = y.changedTouches, z = I.length, f, x;
    for (f = 0; f < z; ++f)
      (x = a[I[f].identifier]) && (at(y), x("drag", y, I[f]));
  }
  function P(y) {
    var I = y.changedTouches, z = I.length, f, x;
    for (c && clearTimeout(c), c = setTimeout(function() {
      c = null;
    }, 500), f = 0; f < z; ++f)
      (x = a[I[f].identifier]) && (Nn(y), x("end", y, I[f]));
  }
  function G(y, I, z, f, x, N) {
    var C = i.copy(), T = Me(N || z, I), J, ae, p;
    if ((p = n.call(y, new Vn("beforestart", {
      sourceEvent: z,
      target: h,
      identifier: x,
      active: r,
      x: T[0],
      y: T[1],
      dx: 0,
      dy: 0,
      dispatch: C
    }), f)) != null)
      return J = p.x - T[0] || 0, ae = p.y - T[1] || 0, function R(S, B, F) {
        var j = T, A;
        switch (S) {
          case "start":
            a[x] = R, A = r++;
            break;
          case "end":
            delete a[x], --r;
          case "drag":
            T = Me(F || B, I), A = r;
            break;
        }
        C.call(
          S,
          y,
          new Vn(S, {
            sourceEvent: B,
            subject: p,
            target: h,
            identifier: x,
            active: A,
            x: T[0] + J,
            y: T[1] + ae,
            dx: T[0] - j[0],
            dy: T[1] - j[1],
            dispatch: C
          }),
          f
        );
      };
  }
  return h.filter = function(y) {
    return arguments.length ? (e = typeof y == "function" ? y : Tt(!!y), h) : e;
  }, h.container = function(y) {
    return arguments.length ? (t = typeof y == "function" ? y : Tt(y), h) : t;
  }, h.subject = function(y) {
    return arguments.length ? (n = typeof y == "function" ? y : Tt(y), h) : n;
  }, h.touchable = function(y) {
    return arguments.length ? (o = typeof y == "function" ? y : Tt(!!y), h) : o;
  }, h.on = function() {
    var y = i.on.apply(i, arguments);
    return y === i ? h : y;
  }, h.clickDistance = function(y) {
    return arguments.length ? (d = (y = +y) * y, h) : Math.sqrt(d);
  }, h;
}
function Ua(e) {
  const t = ve(), n = O(t, "vueFlowRef"), o = O(t, "snapToGrid"), a = O(t, "snapGrid"), i = O(t, "noDragClassName"), r = O(t, "nodes"), l = O(t, "nodeExtent"), u = O(t, "viewport"), s = O(t, "autoPanOnNodeDrag"), c = O(t, "nodesDraggable"), d = O(t, "panBy"), h = O(t, "findNode"), b = O(t, "multiSelectionActive"), m = O(t, "nodesSelectionActive"), w = O(t, "selectNodesOnDrag"), E = O(t, "removeSelectedElements"), _ = O(t, "addSelectedNodes"), P = O(t, "updateNodePositions"), G = O(t, "emits"), { onStart: y, onDrag: I, onStop: z, el: f, disabled: x, id: N, selectable: C } = e, T = ee(!1);
  let J = ee([]), ae = ee(), p = ee(null), R = ee({ x: void 0, y: void 0 }), S = ee({ x: 0, y: 0 }), B = ee(null), F = ee(0), j = ee(!1);
  const A = Vr(), U = ({ x: K, y: ne }) => {
    R.value = { x: K, y: ne };
    let re = !1;
    if (J.value = J.value.map((M) => {
      const v = { x: K - M.distance.x, y: ne - M.distance.y };
      o.value && (v.x = a.value[0] * Math.round(v.x / a.value[0]), v.y = a.value[1] * Math.round(v.y / a.value[1]));
      const { computedPosition: g } = eo(
        M,
        v,
        G.value.error,
        l.value,
        M.parentNode ? h.value(M.parentNode) : void 0
      );
      return re = re || M.position.x !== g.x || M.position.y !== g.y, M.position = g, M;
    }), !!re && (P.value(J.value, !0, !0), T.value = !0, B.value)) {
      const [M, v] = Sn({
        id: N,
        dragItems: J.value,
        findNode: h.value
      });
      I({ event: B.value, node: M, nodes: v });
    }
  }, V = () => {
    if (!p.value)
      return;
    const [K, ne] = Ma(S.value, p.value);
    if (K !== 0 || ne !== 0) {
      const re = {
        x: (R.value.x ?? 0) - K / u.value.zoom,
        y: (R.value.y ?? 0) - ne / u.value.zoom
      };
      d.value({ x: K, y: ne }) && U(re);
    }
    F.value = requestAnimationFrame(V);
  };
  return ce([() => le(x), f], ([K, ne]) => {
    if (ne) {
      const re = Ee(ne);
      if (K)
        re.on(".drag", null);
      else {
        const M = h.value(N);
        ae.value = Cu().on("start", (v) => {
          var g;
          !w.value && !b.value && M && (M.selected || E.value()), M && le(C) && w.value && zn(
            M,
            b.value,
            _.value,
            E.value,
            m,
            !1,
            ne
          );
          const $ = A(v);
          if (R.value = $, J.value = Dr(r.value, c.value, $, h.value, N), J.value.length) {
            const [D, L] = Sn({
              id: N,
              dragItems: J.value,
              findNode: h.value
            });
            y({ event: v.sourceEvent, node: D, nodes: L });
          }
          p.value = ((g = n.value) == null ? void 0 : g.getBoundingClientRect()) || null, S.value = ot(v.sourceEvent, p.value);
        }).on("drag", (v) => {
          const g = A(v);
          !j.value && s.value && (j.value = !0, V()), (R.value.x !== g.xSnapped || R.value.y !== g.ySnapped) && J.value.length && (B.value = v.sourceEvent, S.value = ot(v.sourceEvent, p.value), U(g));
        }).on("end", (v) => {
          if (T.value = !1, j.value = !1, cancelAnimationFrame(F.value), J.value.length) {
            P.value(J.value, !1, !1);
            const [g, $] = Sn({
              id: N,
              dragItems: J.value,
              findNode: h.value
            });
            z({ event: v.sourceEvent, node: g, nodes: $ });
          }
        }).filter((v) => {
          const g = v.target;
          return !v.button && (!i.value || !$o(g, `.${i.value}`, ne) && (!(M != null && M.dragHandle) || $o(g, M.dragHandle, ne)));
        }), re.call(ae.value);
      }
    }
  }), T;
}
const ja = "vue-flow__node-desc", Za = "vue-flow__edge-desc", Mu = "vue-flow__aria-live", Ka = ["Enter", " ", "Escape"], it = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};
function Ln(e) {
  var t, n;
  const o = ((n = (t = e.composedPath) == null ? void 0 : t.call(e)) == null ? void 0 : n[0]) || e.target, a = Ye(o.hasAttribute) ? o.hasAttribute("contenteditable") : !1, i = Ye(o.closest) ? o.closest(".nokey") : null;
  return ["INPUT", "SELECT", "TEXTAREA"].includes(o == null ? void 0 : o.nodeName) || a || !!i;
}
function Pu(e) {
  return e.ctrlKey || e.metaKey || e.shiftKey;
}
function Iu(e, t) {
  return (n) => e.some((o) => {
    const a = o.split("+").map((i) => i.trim().toLowerCase());
    return a.length === 1 ? n.key === o : (t.add(n.key.toLowerCase()), a.every((i) => t.has(i)));
  });
}
const xt = (e, t) => {
  const n = qn(), o = ee(le(e) === !0), a = ee(!1), i = ee(/* @__PURE__ */ new Set());
  return ce(o, () => {
    t == null || t(o.value);
  }), ce(
    () => le(e),
    (r) => {
      if (n && typeof n.addEventListener < "u" && Wn(n, "blur", () => {
        o.value = !1;
      }), Ti(r)) {
        o.value = r;
        return;
      }
      Array.isArray(r) && (r = Iu(r, i.value)), r && (fo(
        r,
        (l) => {
          a.value = Pu(l), !(!a.value && Ln(l)) && (l.preventDefault(), o.value = !0);
        },
        { eventName: "keydown" }
      ), fo(
        r,
        (l) => {
          if (o.value) {
            if (!a.value && Ln(l))
              return;
            a.value = !1, i.value.clear(), o.value = !1;
          }
        },
        { eventName: "keyup" }
      ));
    },
    {
      immediate: !0
    }
  ), o;
}, $u = fe({
  name: "Node",
  compatConfig: { MODE: 3 },
  props: ["name", "type", "id", "draggable", "selectable", "focusable", "connectable", "node", "resizeObserver"],
  setup(e) {
    lt(Na, e.id);
    const t = ve(), n = O(t, "id"), o = O(t, "edges"), a = O(t, "noPanClassName"), i = O(t, "selectNodesOnDrag"), r = O(t, "nodesSelectionActive"), l = O(t, "multiSelectionActive"), u = O(t, "emits"), s = O(t, "findNode"), c = O(t, "removeSelectedNodes"), d = O(t, "addSelectedNodes"), h = O(t, "updateNodeDimensions"), b = O(t, "onUpdateNodeInternals"), m = O(t, "getIntersectingNodes"), w = O(t, "getNodeTypes"), E = O(t, "nodeExtent"), _ = O(t, "elevateNodesOnSelect"), P = O(t, "disableKeyboardA11y"), G = O(t, "ariaLiveMessage"), y = O(t, "snapToGrid"), I = O(t, "snapGrid"), z = $a(), f = wt(e, "node"), x = q(() => s.value(f.value.parentNode)), N = q(() => on([f.value], o.value)), C = ee();
    lt(ka, C);
    const { emit: T, on: J } = Rr(f.value, u.value), ae = Ua({
      id: e.id,
      el: C,
      disabled: () => !e.draggable,
      selectable: () => e.selectable,
      onStart(M) {
        T.dragStart({ ...M, intersections: m.value(f.value) });
      },
      onDrag(M) {
        T.drag({ ...M, intersections: m.value(f.value) });
      },
      onStop(M) {
        T.dragStop({ ...M, intersections: m.value(f.value) });
      }
    }), p = q(() => f.value.class instanceof Function ? f.value.class(f.value) : f.value.class), R = q(() => {
      const M = (f.value.style instanceof Function ? f.value.style(f.value) : f.value.style) || {}, v = f.value.width instanceof Function ? f.value.width(f.value) : f.value.width, g = f.value.height instanceof Function ? f.value.height(f.value) : f.value.height;
      return v && (M.width = typeof v == "string" ? v : `${v}px`), g && (M.height = typeof g == "string" ? g : `${g}px`), M;
    }), S = () => Number(f.value.zIndex ?? R.value.zIndex ?? 0);
    return b.value((M) => {
      M.includes(e.id) && F();
    }), Ve(() => {
      e.resizeObserver.observe(C.value);
    }), jn(() => {
      e.resizeObserver.unobserve(C.value);
    }), ce(
      [() => f.value.type, () => f.value.sourcePosition, () => f.value.targetPosition],
      () => {
        h.value([{ id: e.id, nodeElement: C.value, forceUpdate: !0 }]);
      },
      { flush: "pre" }
    ), ce(
      [
        () => f.value.position.x,
        () => f.value.position.y,
        () => {
          var M;
          return (M = x.value) == null ? void 0 : M.computedPosition.x;
        },
        () => {
          var M;
          return (M = x.value) == null ? void 0 : M.computedPosition.y;
        },
        () => {
          var M;
          return (M = x.value) == null ? void 0 : M.computedPosition.z;
        },
        () => S(),
        () => f.value.selected,
        () => f.value.dimensions.height,
        () => f.value.dimensions.width,
        () => {
          var M;
          return (M = x.value) == null ? void 0 : M.dimensions.height;
        },
        () => {
          var M;
          return (M = x.value) == null ? void 0 : M.dimensions.width;
        }
      ],
      ([M, v, g, $, D, L]) => {
        const Y = {
          x: M,
          y: v,
          z: L + (_.value && f.value.selected ? 1e3 : 0)
        };
        Be(g) && Be($) ? f.value.computedPosition = pr({ x: g, y: $, z: D }, Y) : f.value.computedPosition = Y;
      },
      { flush: "pre", immediate: !0 }
    ), ce([() => f.value.extent, () => E.value], ([M, v], [g, $]) => {
      (M !== g || v !== $) && B();
    }), f.value.extent === "parent" || typeof f.value.extent == "object" && "range" in f.value.extent && f.value.extent.range === "parent" ? be(() => f.value.initialized).toBe(!0).then(B) : B(), () => ue(
      "div",
      {
        ref: C,
        "data-id": f.value.id,
        class: [
          "vue-flow__node",
          `vue-flow__node-${e.type === !1 ? "default" : e.name}`,
          {
            [a.value]: e.draggable,
            dragging: ae == null ? void 0 : ae.value,
            selected: f.value.selected,
            selectable: e.selectable
          },
          p.value
        ],
        style: {
          zIndex: f.value.computedPosition.z ?? S(),
          transform: `translate(${f.value.computedPosition.x}px,${f.value.computedPosition.y}px)`,
          pointerEvents: e.selectable || e.draggable ? "all" : "none",
          visibility: f.value.initialized ? "visible" : "hidden",
          ...R.value
        },
        tabIndex: e.focusable ? 0 : void 0,
        role: e.focusable ? "button" : void 0,
        "aria-describedby": P.value ? void 0 : `${ja}-${n.value}`,
        "aria-label": f.value.ariaLabel,
        onMouseenter: j,
        onMousemove: A,
        onMouseleave: U,
        onContextmenu: V,
        onClick: ne,
        onDblclick: K,
        onKeydown: re
      },
      [
        ue(e.type === !1 ? w.value.default : e.type, {
          id: f.value.id,
          type: f.value.type,
          data: f.value.data,
          events: { ...f.value.events, ...J },
          selected: !!f.value.selected,
          resizing: !!f.value.resizing,
          dragging: ae.value,
          connectable: e.connectable,
          position: f.value.position,
          dimensions: f.value.dimensions,
          isValidTargetPos: f.value.isValidTargetPos,
          isValidSourcePos: f.value.isValidSourcePos,
          parent: f.value.parentNode,
          zIndex: f.value.computedPosition.z,
          targetPosition: f.value.targetPosition,
          sourcePosition: f.value.sourcePosition,
          label: f.value.label,
          dragHandle: f.value.dragHandle,
          onUpdateNodeInternals: F
        })
      ]
    );
    function B() {
      const M = f.value.computedPosition;
      y.value && (M.x = I.value[0] * Math.round(M.x / I.value[0]), M.y = I.value[1] * Math.round(M.y / I.value[1]));
      const { computedPosition: v, position: g } = eo(f.value, M, u.value.error, E.value, x.value);
      (f.value.computedPosition.x !== v.x || f.value.computedPosition.y !== v.y) && (f.value.computedPosition = { ...f.value.computedPosition, ...v }), (f.value.position.x !== g.x || f.value.position.y !== g.y) && (f.value.position = g);
    }
    function F() {
      C.value && h.value([{ id: e.id, nodeElement: C.value, forceUpdate: !0 }]);
    }
    function j(M) {
      ae != null && ae.value || T.mouseEnter({ event: M, node: f.value, connectedEdges: N.value });
    }
    function A(M) {
      ae != null && ae.value || T.mouseMove({ event: M, node: f.value, connectedEdges: N.value });
    }
    function U(M) {
      ae != null && ae.value || T.mouseLeave({ event: M, node: f.value, connectedEdges: N.value });
    }
    function V(M) {
      return T.contextMenu({ event: M, node: f.value, connectedEdges: N.value });
    }
    function K(M) {
      return T.doubleClick({ event: M, node: f.value, connectedEdges: N.value });
    }
    function ne(M) {
      e.selectable && (!i.value || !e.draggable) && zn(
        f.value,
        l.value,
        d.value,
        c.value,
        r,
        !1,
        C.value
      ), T.click({ event: M, node: f.value, connectedEdges: N.value });
    }
    function re(M) {
      var v;
      if (!Ln(M))
        if (Ka.includes(M.key) && e.selectable) {
          const g = M.key === "Escape";
          g && ((v = C.value) == null || v.blur()), zn(
            f.value,
            l.value,
            d.value,
            c.value,
            r,
            g,
            C.value
          );
        } else
          !P.value && e.draggable && f.value.selected && it[M.key] && (G.value = `Moved selected node ${M.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~f.value.position.x}, y: ${~~f.value.position.y}`, z(
            {
              x: it[M.key].x,
              y: it[M.key].y
            },
            M.shiftKey
          ));
    }
  }
}), Tu = $u, Ou = ["transform"], Du = ["width", "height", "x", "y", "rx", "ry"], Bu = ["y"], Au = {
  name: "EdgeText",
  compatConfig: { MODE: 3 }
}, zu = /* @__PURE__ */ fe({
  ...Au,
  props: {
    x: null,
    y: null,
    label: null,
    labelStyle: { default: {} },
    labelShowBg: { type: Boolean, default: !0 },
    labelBgStyle: { default: {} },
    labelBgPadding: { default: [2, 4] },
    labelBgBorderRadius: { default: 2 }
  },
  setup(e) {
    let t = ee({ x: 0, y: 0, width: 0, height: 0 });
    const n = ee(null), o = q(() => `translate(${e.x - t.value.width / 2} ${e.y - t.value.height / 2})`);
    Ve(a), ce([() => e.x, () => e.y, n, () => e.label], a);
    function a() {
      if (!n.value)
        return;
      const i = n.value.getBBox();
      (i.width !== t.value.width || i.height !== t.value.height) && (t.value = i);
    }
    return (i, r) => (te(), ie("g", {
      transform: k(o),
      class: "vue-flow__edge-textwrapper"
    }, [
      e.labelShowBg ? (te(), ie("rect", {
        key: 0,
        class: "vue-flow__edge-textbg",
        width: `${k(t).width + 2 * e.labelBgPadding[0]}px`,
        height: `${k(t).height + 2 * e.labelBgPadding[1]}px`,
        x: -e.labelBgPadding[0],
        y: -e.labelBgPadding[1],
        style: Le(e.labelBgStyle),
        rx: e.labelBgBorderRadius,
        ry: e.labelBgBorderRadius
      }, null, 12, Du)) : ge("", !0),
      de("text", Ht(i.$attrs, {
        ref_key: "el",
        ref: n,
        class: "vue-flow__edge-text",
        y: k(t).height / 2,
        dy: "0.3em",
        style: e.labelStyle
      }), [
        xe(i.$slots, "default", {}, () => [
          k(Ae)(e.label) ? (te(), ie(Ne, { key: 1 }, [
            ua(ct(e.label), 1)
          ], 64)) : (te(), _e(ra(e.label), { key: 0 }))
        ])
      ], 16, Bu)
    ], 8, Ou));
  }
}), dn = function({
  path: e,
  label: t,
  labelX: n,
  labelY: o,
  labelBgBorderRadius: a,
  labelBgPadding: i,
  labelBgStyle: r,
  labelShowBg: l = !0,
  labelStyle: u,
  markerStart: s,
  markerEnd: c,
  interactionWidth: d = 20
}, { attrs: h }) {
  return [
    ue("path", {
      style: h.style,
      class: ["vue-flow__edge-path", h.class].join(" "),
      d: e,
      "marker-end": c,
      "marker-start": s
    }),
    d ? ue("path", {
      d: e,
      fill: "none",
      "stroke-opacity": 0,
      "stroke-width": d
    }) : null,
    t && Be(n) && Be(o) ? ue(zu, {
      x: n,
      y: o,
      label: t,
      labelStyle: u,
      labelShowBg: l,
      labelBgStyle: r,
      labelBgPadding: i,
      labelBgBorderRadius: a
    }) : null
  ];
};
dn.props = [
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
  "interactionWidth"
];
dn.inheritAttrs = !1;
dn.compatConfig = { MODE: 3 };
const vn = dn;
function Wa({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const a = Math.abs(n - e) / 2, i = n < e ? n + a : n - a, r = Math.abs(o - t) / 2, l = o < t ? o + r : o - r;
  return [i, l, a, r];
}
function qa({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o,
  sourceControlX: a,
  sourceControlY: i,
  targetControlX: r,
  targetControlY: l
}) {
  const u = e * 0.125 + a * 0.375 + r * 0.375 + n * 0.125, s = t * 0.125 + i * 0.375 + l * 0.375 + o * 0.125, c = Math.abs(u - e), d = Math.abs(s - t);
  return [u, s, c, d];
}
function Ot(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function Bo({ pos: e, x1: t, y1: n, x2: o, y2: a, c: i }) {
  let r, l;
  switch (e) {
    case Z.Left:
      r = t - Ot(t - o, i), l = n;
      break;
    case Z.Right:
      r = t + Ot(o - t, i), l = n;
      break;
    case Z.Top:
      r = t, l = n - Ot(n - a, i);
      break;
    case Z.Bottom:
      r = t, l = n + Ot(a - n, i);
      break;
  }
  return [r, l];
}
function Kt({
  sourceX: e,
  sourceY: t,
  sourcePosition: n = Z.Bottom,
  targetX: o,
  targetY: a,
  targetPosition: i = Z.Top,
  curvature: r = 0.25
}) {
  const [l, u] = Bo({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: a,
    c: r
  }), [s, c] = Bo({
    pos: i,
    x1: o,
    y1: a,
    x2: e,
    y2: t,
    c: r
  }), [d, h, b, m] = qa({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: a,
    sourceControlX: l,
    sourceControlY: u,
    targetControlX: s,
    targetControlY: c
  });
  return [
    `M${e},${t} C${l},${u} ${s},${c} ${o},${a}`,
    d,
    h,
    b,
    m
  ];
}
const hn = function({ sourcePosition: e = Z.Bottom, targetPosition: t = Z.Top, ...n }, { attrs: o }) {
  const [a, i, r] = Kt({
    sourcePosition: e,
    targetPosition: t,
    ...n
  });
  return ue(vn, {
    path: a,
    labelX: i,
    labelY: r,
    ...n,
    ...o
  });
};
hn.props = [
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
  "interactionWidth"
];
hn.inheritAttrs = !1;
hn.compatConfig = { MODE: 3 };
const Ru = hn;
function Ao({ pos: e, x1: t, y1: n, x2: o, y2: a }) {
  let i, r;
  switch (e) {
    case Z.Left:
    case Z.Right:
      i = 0.5 * (t + o), r = n;
      break;
    case Z.Top:
    case Z.Bottom:
      i = t, r = 0.5 * (n + a);
      break;
  }
  return [i, r];
}
function Qa({
  sourceX: e,
  sourceY: t,
  sourcePosition: n = Z.Bottom,
  targetX: o,
  targetY: a,
  targetPosition: i = Z.Top
}) {
  const [r, l] = Ao({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: a
  }), [u, s] = Ao({
    pos: i,
    x1: o,
    y1: a,
    x2: e,
    y2: t
  }), [c, d, h, b] = qa({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: a,
    sourceControlX: r,
    sourceControlY: l,
    targetControlX: u,
    targetControlY: s
  });
  return [
    `M${e},${t} C${r},${l} ${u},${s} ${o},${a}`,
    c,
    d,
    h,
    b
  ];
}
const fn = function({ sourcePosition: e = Z.Bottom, targetPosition: t = Z.Top, ...n }, { attrs: o }) {
  const [a, i, r] = Qa({
    sourcePosition: e,
    targetPosition: t,
    ...n
  });
  return ue(vn, {
    path: a,
    labelX: i,
    labelY: r,
    ...n,
    ...o
  });
};
fn.props = [
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
  "interactionWidth"
];
fn.inheritAttrs = !1;
fn.compatConfig = { MODE: 3 };
const Vu = fn, zo = {
  [Z.Left]: { x: -1, y: 0 },
  [Z.Right]: { x: 1, y: 0 },
  [Z.Top]: { x: 0, y: -1 },
  [Z.Bottom]: { x: 0, y: 1 }
};
function Lu({
  source: e,
  sourcePosition: t = Z.Bottom,
  target: n
}) {
  return t === Z.Left || t === Z.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
}
function Ro(e, t) {
  return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
}
function Yu({
  source: e,
  sourcePosition: t = Z.Bottom,
  target: n,
  targetPosition: o = Z.Top,
  center: a,
  offset: i
}) {
  const r = zo[t], l = zo[o], u = { x: e.x + r.x * i, y: e.y + r.y * i }, s = { x: n.x + l.x * i, y: n.y + l.y * i }, c = Lu({
    source: u,
    sourcePosition: t,
    target: s
  }), d = c.x !== 0 ? "x" : "y", h = c[d];
  let b, m, w;
  const [E, _, P, G] = Wa({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (r[d] * l[d] === -1) {
    m = a.x || E, w = a.y || _;
    const y = [
      { x: m, y: u.y },
      { x: m, y: s.y }
    ], I = [
      { x: u.x, y: w },
      { x: s.x, y: w }
    ];
    r[d] === h ? b = d === "x" ? y : I : b = d === "x" ? I : y;
  } else {
    const y = [{ x: u.x, y: s.y }], I = [{ x: s.x, y: u.y }];
    if (d === "x" ? b = r.x === h ? I : y : b = r.y === h ? y : I, t !== o) {
      const z = d === "x" ? "y" : "x", f = r[d] === l[z], x = u[z] > s[z], N = u[z] < s[z];
      (r[d] === 1 && (!f && x || f && N) || r[d] !== 1 && (!f && N || f && x)) && (b = d === "x" ? y : I);
    }
    m = b[0].x, w = b[0].y;
  }
  return [[e, u, ...b, s, n], m, w, P, G];
}
function Xu(e, t, n, o) {
  const a = Math.min(Ro(e, t) / 2, Ro(t, n) / 2, o), { x: i, y: r } = t;
  if (e.x === i && i === n.x || e.y === r && r === n.y)
    return `L${i} ${r}`;
  if (e.y === r) {
    const s = e.x < n.x ? -1 : 1, c = e.y < n.y ? 1 : -1;
    return `L ${i + a * s},${r}Q ${i},${r} ${i},${r + a * c}`;
  }
  const l = e.x < n.x ? 1 : -1, u = e.y < n.y ? -1 : 1;
  return `L ${i},${r + a * u}Q ${i},${r} ${i + a * l},${r}`;
}
function Yn({
  sourceX: e,
  sourceY: t,
  sourcePosition: n = Z.Bottom,
  targetX: o,
  targetY: a,
  targetPosition: i = Z.Top,
  borderRadius: r = 5,
  centerX: l,
  centerY: u,
  offset: s = 20
}) {
  const [c, d, h, b, m] = Yu({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: o, y: a },
    targetPosition: i,
    center: { x: l, y: u },
    offset: s
  });
  return [c.reduce((w, E, _) => {
    let P;
    return _ > 0 && _ < c.length - 1 ? P = Xu(c[_ - 1], E, c[_ + 1], r) : P = `${_ === 0 ? "M" : "L"}${E.x} ${E.y}`, w += P, w;
  }, ""), d, h, b, m];
}
const gn = function({ sourcePosition: e = Z.Bottom, targetPosition: t = Z.Top, ...n }, { attrs: o }) {
  const [a, i, r] = Yn({
    sourcePosition: e,
    targetPosition: t,
    ...n
  });
  return ue(vn, {
    path: a,
    labelX: i,
    labelY: r,
    ...n,
    ...o
  });
};
gn.props = [
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
  "interactionWidth",
  "offset"
];
gn.inheritAttrs = !1;
gn.compatConfig = { MODE: 3 };
const Ja = gn, pn = function(e, { attrs: t }) {
  return ue(Ja, { ...e, ...t, borderRadius: 0 });
};
pn.props = [
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
  "interactionWidth"
];
pn.inheritAttrs = !1;
pn.compatConfig = { MODE: 3 };
const Gu = pn;
function ei({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const [a, i, r, l] = Wa({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: o
  });
  return [`M ${e},${t}L ${n},${o}`, a, i, r, l];
}
const mn = function(e, { attrs: t }) {
  const [n, o, a] = ei(e);
  return ue(vn, {
    path: n,
    labelX: o,
    labelY: a,
    ...e,
    ...t
  });
};
mn.props = [
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
  "interactionWidth"
];
mn.inheritAttrs = !1;
mn.compatConfig = { MODE: 3 };
const Hu = mn;
function Fu(e, t, n) {
  return n === Z.Left ? e - t : n === Z.Right ? e + t : e;
}
function Uu(e, t, n) {
  return n === Z.Top ? e - t : n === Z.Bottom ? e + t : e;
}
const oo = function({
  radius: e = 10,
  centerX: t = 0,
  centerY: n = 0,
  position: o = Z.Top,
  type: a
}) {
  return ue("circle", {
    class: `vue-flow__edgeupdater vue-flow__edgeupdater-${a}`,
    cx: Fu(t, e, o),
    cy: Uu(n, e, o),
    r: e,
    stroke: "transparent",
    fill: "transparent"
  });
};
oo.props = ["radius", "centerX", "centerY", "position", "type"];
oo.compatConfig = { MODE: 3 };
const Vo = oo;
function ju() {
  return {
    doubleClick: H(),
    click: H(),
    mouseEnter: H(),
    mouseMove: H(),
    mouseLeave: H(),
    contextMenu: H(),
    updateStart: H(),
    update: H(),
    updateEnd: H()
  };
}
function Zu(e, t) {
  const n = ju();
  return n.doubleClick.on((o) => {
    var a, i;
    t.edgeDoubleClick(o), (i = (a = e.events) == null ? void 0 : a.doubleClick) == null || i.call(a, o);
  }), n.click.on((o) => {
    var a, i;
    t.edgeClick(o), (i = (a = e.events) == null ? void 0 : a.click) == null || i.call(a, o);
  }), n.mouseEnter.on((o) => {
    var a, i;
    t.edgeMouseEnter(o), (i = (a = e.events) == null ? void 0 : a.mouseEnter) == null || i.call(a, o);
  }), n.mouseMove.on((o) => {
    var a, i;
    t.edgeMouseMove(o), (i = (a = e.events) == null ? void 0 : a.mouseMove) == null || i.call(a, o);
  }), n.mouseLeave.on((o) => {
    var a, i;
    t.edgeMouseLeave(o), (i = (a = e.events) == null ? void 0 : a.mouseLeave) == null || i.call(a, o);
  }), n.contextMenu.on((o) => {
    var a, i;
    t.edgeContextMenu(o), (i = (a = e.events) == null ? void 0 : a.contextMenu) == null || i.call(a, o);
  }), n.updateStart.on((o) => {
    var a, i;
    t.edgeUpdateStart(o), (i = (a = e.events) == null ? void 0 : a.updateStart) == null || i.call(a, o);
  }), n.update.on((o) => {
    var a, i;
    t.edgeUpdate(o), (i = (a = e.events) == null ? void 0 : a.update) == null || i.call(a, o);
  }), n.updateEnd.on((o) => {
    var a, i;
    t.edgeUpdateEnd(o), (i = (a = e.events) == null ? void 0 : a.updateEnd) == null || i.call(a, o);
  }), Object.entries(n).reduce(
    (o, [a, i]) => (o.emit[a] = i.trigger, o.on[a] = i.on, o),
    { emit: {}, on: {} }
  );
}
const Ku = fe({
  name: "Edge",
  compatConfig: { MODE: 3 },
  props: ["name", "type", "id", "updatable", "selectable", "focusable", "edge"],
  setup(e) {
    const {
      id: t,
      addSelectedEdges: n,
      connectionMode: o,
      edgeUpdaterRadius: a,
      emits: i,
      nodesSelectionActive: r,
      noPanClassName: l,
      getEdgeTypes: u,
      removeSelectedEdges: s,
      findEdge: c,
      findNode: d,
      isValidConnection: h
    } = ve(), b = Zu(e.edge, i), m = wt(e, "edge");
    let w = ee(!1), E = ee(!1);
    const _ = ee(""), P = ee(null), G = ee("source"), y = ee();
    lt(br, e.id), lt(wr, y);
    const I = q(() => m.value.class instanceof Function ? m.value.class(m.value) : m.value.class), z = q(() => m.value.style instanceof Function ? m.value.style(m.value) : m.value.style), { handlePointerDown: f } = Pa({
      nodeId: _,
      handleId: P,
      type: G,
      isValidConnection: h.value,
      edgeUpdaterType: G,
      onEdgeUpdate: C,
      onEdgeUpdateEnd: T
    });
    return () => {
      const V = d(m.value.source), K = d(m.value.target);
      if (!V || !K || !m.value)
        return null;
      let ne;
      o.value === qe.Strict ? ne = V.handleBounds.source : ne = [...V.handleBounds.source || [], ...V.handleBounds.target || []];
      const re = Co(ne, m.value.sourceHandle);
      let M;
      o.value === qe.Strict ? M = K.handleBounds.target : M = [...K.handleBounds.target || [], ...K.handleBounds.source || []];
      const v = Co(M, m.value.targetHandle), g = re ? re.position : Z.Bottom, $ = v ? v.position : Z.Top, { sourceX: D, sourceY: L, targetY: Y, targetX: W } = _r(
        V,
        re,
        g,
        K,
        v,
        $
      );
      return m.value.sourceX = D, m.value.sourceY = L, m.value.targetX = W, m.value.targetY = Y, ue(
        "g",
        {
          ref: y,
          key: e.id,
          "data-id": e.id,
          class: [
            "vue-flow__edge",
            `vue-flow__edge-${e.type === !1 ? "default" : e.name}`,
            l.value,
            I.value,
            {
              updating: w.value,
              selected: m.value.selected,
              animated: m.value.animated,
              inactive: !e.selectable
            }
          ],
          onClick: ae,
          onContextmenu: p,
          onDblclick: R,
          onMouseenter: S,
          onMousemove: B,
          onMouseleave: F,
          onKeyDown: e.focusable ? U : void 0,
          tabIndex: e.focusable ? 0 : void 0,
          "aria-label": m.value.ariaLabel === null ? void 0 : m.value.ariaLabel || `Edge from ${m.value.source} to ${m.value.target}`,
          "aria-describedby": e.focusable ? `${Za}-${t}` : void 0,
          role: e.focusable ? "button" : void 0
        },
        [
          E.value ? null : ue(e.type === !1 ? u.value.default : e.type, {
            id: e.id,
            sourceNode: V,
            targetNode: K,
            source: m.value.source,
            target: m.value.target,
            type: m.value.type,
            updatable: e.updatable,
            selected: m.value.selected,
            animated: m.value.animated,
            label: m.value.label,
            labelStyle: m.value.labelStyle,
            labelShowBg: m.value.labelShowBg,
            labelBgStyle: m.value.labelBgStyle,
            labelBgPadding: m.value.labelBgPadding,
            labelBgBorderRadius: m.value.labelBgBorderRadius,
            data: m.value.data,
            events: { ...m.value.events, ...b.on },
            style: z.value,
            markerStart: `url(#${Ue(m.value.markerStart, t)})`,
            markerEnd: `url(#${Ue(m.value.markerEnd, t)})`,
            sourcePosition: g,
            targetPosition: $,
            sourceX: D,
            sourceY: L,
            targetX: W,
            targetY: Y,
            sourceHandleId: m.value.sourceHandle,
            targetHandleId: m.value.targetHandle,
            interactionWidth: m.value.interactionWidth
          }),
          [
            e.updatable === "source" || e.updatable === !0 ? [
              ue(
                "g",
                {
                  onMousedown: j,
                  onMouseenter: x,
                  onMouseout: N
                },
                ue(Vo, {
                  position: g,
                  centerX: D,
                  centerY: L,
                  radius: a.value,
                  type: "source",
                  "data-type": "source"
                })
              )
            ] : null,
            e.updatable === "target" || e.updatable === !0 ? [
              ue(
                "g",
                {
                  onMousedown: A,
                  onMouseenter: x,
                  onMouseout: N
                },
                ue(Vo, {
                  position: $,
                  centerX: W,
                  centerY: Y,
                  radius: a.value,
                  type: "target",
                  "data-type": "target"
                })
              )
            ] : null
          ]
        ]
      );
    };
    function x() {
      w.value = !0;
    }
    function N() {
      w.value = !1;
    }
    function C(V, K) {
      b.emit.update({ event: V, edge: m.value, connection: K });
    }
    function T(V) {
      b.emit.updateEnd({ event: V, edge: m.value }), E.value = !1;
    }
    function J(V, K) {
      V.button === 0 && (E.value = !0, _.value = K ? m.value.target : m.value.source, P.value = (K ? m.value.targetHandle : m.value.sourceHandle) ?? "", G.value = K ? "target" : "source", b.emit.updateStart({ event: V, edge: m.value }), f(V));
    }
    function ae(V) {
      const K = { event: V, edge: m.value };
      e.selectable && (r.value = !1, n([m.value])), b.emit.click(K);
    }
    function p(V) {
      b.emit.contextMenu({ event: V, edge: m.value });
    }
    function R(V) {
      b.emit.doubleClick({ event: V, edge: m.value });
    }
    function S(V) {
      b.emit.mouseEnter({ event: V, edge: m.value });
    }
    function B(V) {
      b.emit.mouseMove({ event: V, edge: m.value });
    }
    function F(V) {
      b.emit.mouseLeave({ event: V, edge: m.value });
    }
    function j(V) {
      J(V, !0);
    }
    function A(V) {
      J(V, !1);
    }
    function U(V) {
      var K;
      Ka.includes(V.key) && e.selectable && (V.key === "Escape" ? ((K = y.value) == null || K.blur(), s([c(e.id)])) : n([c(e.id)]));
    }
  }
}), Wu = Ku, qu = {
  height: "0",
  width: "0"
}, Qu = {
  name: "EdgeLabelRenderer",
  compatConfig: { MODE: 3 }
}, Ju = /* @__PURE__ */ fe({
  ...Qu,
  setup(e) {
    const { viewportRef: t } = ve(), n = q(() => {
      var o;
      return (o = t.value) == null ? void 0 : o.getElementsByClassName("vue-flow__edge-labels")[0];
    });
    return (o, a) => (te(), ie("svg", null, [
      (te(), ie("foreignObject", qu, [
        (te(), _e(bi, {
          to: k(n),
          disabled: !k(n)
        }, [
          xe(o.$slots, "default")
        ], 8, ["to", "disabled"]))
      ]))
    ]));
  }
}), es = { class: "vue-flow__connection" }, ts = ["d", "marker-end", "marker-start"], ns = {
  name: "ConnectionLine",
  compatConfig: { MODE: 3 }
}, os = /* @__PURE__ */ fe({
  ...ns,
  props: {
    sourceNode: null
  },
  setup(e) {
    var t;
    const n = ve(), o = O(n, "connectionMode"), a = O(n, "connectionStartHandle"), i = O(n, "connectionEndHandle"), r = O(n, "connectionPosition"), l = O(n, "connectionLineType"), u = O(n, "connectionLineStyle"), s = O(n, "connectionLineOptions"), c = O(n, "connectionStatus"), d = O(n, "viewport"), h = O(n, "findNode"), b = {
      [Z.Left]: Z.Right,
      [Z.Right]: Z.Left,
      [Z.Top]: Z.Bottom,
      [Z.Bottom]: Z.Top
    }, m = (t = ut(an)) == null ? void 0 : t["connection-line"], w = q(() => a.value.handleId), E = q(() => a.value.type), _ = q(() => {
      var C;
      return ((C = i.value) == null ? void 0 : C.handleId) && h.value(i.value.nodeId) || null;
    }), P = q(
      () => {
        var C, T;
        return (o.value === qe.Strict ? (C = e.sourceNode.handleBounds[E.value]) == null ? void 0 : C.find((J) => J.id === w.value) : [...e.sourceNode.handleBounds.source || [], ...e.sourceNode.handleBounds.target || []].find((J) => J.id === w.value)) || ((T = e.sourceNode.handleBounds[E.value ?? "source"]) == null ? void 0 : T[0]);
      }
    ), G = q(() => {
      var C, T, J;
      return _.value && ((C = i.value) == null ? void 0 : C.handleId) && ((o.value === qe.Strict ? (T = _.value.handleBounds[E.value === "source" ? "target" : "source"]) == null ? void 0 : T.find(
        (ae) => {
          var p;
          return ae.id === ((p = i.value) == null ? void 0 : p.handleId);
        }
      ) : [..._.value.handleBounds.source || [], ..._.value.handleBounds.target || []].find(
        (ae) => {
          var p;
          return ae.id === ((p = i.value) == null ? void 0 : p.handleId);
        }
      )) || ((J = _.value.handleBounds[E.value ?? "target"]) == null ? void 0 : J[0])) || null;
    }), y = q(() => {
      var C;
      return (C = P.value) == null ? void 0 : C.position;
    }), I = q(() => P.value ? jt(
      y.value || Z.Top,
      { ...e.sourceNode.dimensions, ...e.sourceNode.computedPosition },
      P.value
    ) : {
      x: e.sourceNode.dimensions.width / 2,
      y: e.sourceNode.dimensions.height / 2
    }), z = q(() => y.value ? b[y.value] : void 0), f = q(() => (r.value.x - d.value.x) / d.value.zoom), x = q(() => (r.value.y - d.value.y) / d.value.zoom), N = q(() => {
      let C;
      const T = {
        sourceX: I.value.x,
        sourceY: I.value.y,
        sourcePosition: y.value,
        targetX: f.value,
        targetY: x.value,
        targetPosition: z.value
      };
      switch (l.value ?? s.value.type) {
        case Fe.Bezier:
          [C] = Kt(T);
          break;
        case Fe.Step:
          [C] = Yn({
            ...T,
            borderRadius: 0
          });
          break;
        case Fe.SmoothStep:
          [C] = Yn(T);
          break;
        case Fe.SimpleBezier:
          [C] = Qa(T);
          break;
        case Fe.Straight:
          [C] = ei(T);
          break;
        default:
          [C] = Kt(T);
          break;
      }
      return C;
    });
    return (C, T) => {
      var J;
      return te(), ie("g", es, [
        k(m) ? (te(), _e(ra(k(m)), Pi(Ht({ key: 0 }, {
          sourceX: k(I).x,
          sourceY: k(I).y,
          sourcePosition: (J = k(P)) == null ? void 0 : J.position,
          targetX: k(f),
          targetY: k(x),
          targetPosition: k(z),
          sourceNode: e.sourceNode,
          sourceHandle: k(P),
          targetNode: k(_),
          targetHandle: k(G),
          markerEnd: `url(#${k(Ue)(k(s).markerEnd)})`,
          markerStart: `url(#${k(Ue)(k(s).markerStart)})`,
          connectionStatus: k(c)
        })), null, 16)) : (te(), ie("path", {
          key: 1,
          d: k(N),
          class: Ke(["vue-flow__connection-path", [k(s).class, k(c)]]),
          style: Le(k(u) || k(s).style || {}),
          "marker-end": `url(#${k(Ue)(k(s).markerEnd)})`,
          "marker-start": `url(#${k(Ue)(k(s).markerStart)})`
        }, null, 14, ts))
      ]);
    };
  }
}), as = ["tabIndex"], is = {
  name: "NodesSelection",
  compatConfig: { MODE: 3 }
}, rs = /* @__PURE__ */ fe({
  ...is,
  setup(e) {
    const t = ve(), n = O(t, "emits"), o = O(t, "viewport"), a = O(t, "getSelectedNodes"), i = O(t, "noPanClassName"), r = O(t, "disableKeyboardA11y"), l = O(t, "userSelectionActive"), u = $a(), s = ee(), c = Ua({
      el: s,
      onStart(w) {
        n.value.selectionDragStart(w);
      },
      onDrag(w) {
        n.value.selectionDrag(w);
      },
      onStop(w) {
        n.value.selectionDragStop(w);
      }
    });
    Ve(() => {
      var w;
      r.value || (w = s.value) == null || w.focus({ preventScroll: !0 });
    });
    const d = q(() => _a(a.value)), h = q(() => ({
      width: `${d.value.width}px`,
      height: `${d.value.height}px`,
      top: `${d.value.y}px`,
      left: `${d.value.x}px`
    }));
    function b(w) {
      n.value.selectionContextMenu({ event: w, nodes: a.value });
    }
    function m(w) {
      r.value || it[w.key] && u(
        {
          x: it[w.key].x,
          y: it[w.key].y
        },
        w.shiftKey
      );
    }
    return (w, E) => !k(l) && k(d).width && k(d).height ? (te(), ie("div", {
      key: 0,
      class: Ke(["vue-flow__nodesselection vue-flow__container", k(i)]),
      style: Le({ transform: `translate(${k(o).x}px,${k(o).y}px) scale(${k(o).zoom})` })
    }, [
      de("div", {
        ref_key: "el",
        ref: s,
        class: Ke([{ dragging: k(c) }, "vue-flow__nodesselection-rect"]),
        style: Le(k(h)),
        tabIndex: k(r) ? void 0 : -1,
        onContextmenu: b,
        onKeydown: m
      }, null, 46, as)
    ], 6)) : ge("", !0);
  }
}), ls = {
  name: "UserSelection",
  compatConfig: { MODE: 3 }
}, us = /* @__PURE__ */ fe({
  ...ls,
  setup(e) {
    const { userSelectionRect: t } = ve();
    return (n, o) => {
      var a, i, r, l;
      return te(), ie("div", {
        class: "vue-flow__selection vue-flow__container",
        style: Le({
          width: `${(a = k(t)) == null ? void 0 : a.width}px`,
          height: `${(i = k(t)) == null ? void 0 : i.height}px`,
          transform: `translate(${(r = k(t)) == null ? void 0 : r.x}px, ${(l = k(t)) == null ? void 0 : l.y}px)`
        })
      }, null, 4);
    };
  }
}), ss = {
  input: Tr,
  default: $r,
  output: Or
}, cs = {
  default: Ru,
  straight: Hu,
  step: Gu,
  smoothstep: Ja,
  simplebezier: Vu
};
function ds() {
  return {
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
    selectionMode: Qn.Full,
    paneDragging: !1,
    preventScrolling: !0,
    zoomOnScroll: !0,
    zoomOnPinch: !0,
    zoomOnDoubleClick: !0,
    panOnScroll: !1,
    panOnScrollSpeed: 0.5,
    panOnScrollMode: Ut.Free,
    panOnDrag: !0,
    edgeUpdaterRadius: 10,
    onlyRenderVisibleElements: !1,
    defaultViewport: { x: 0, y: 0, zoom: 1 },
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    defaultMarkerColor: "#b1b1b7",
    connectionLineStyle: {},
    connectionLineType: null,
    connectionLineOptions: {
      type: Fe.Bezier,
      style: {}
    },
    connectionMode: qe.Loose,
    connectionStartHandle: null,
    connectionEndHandle: null,
    connectionClickStartHandle: null,
    connectionPosition: { x: NaN, y: NaN },
    connectionRadius: 20,
    connectOnClick: !0,
    connectionStatus: null,
    isValidConnection: null,
    snapGrid: [15, 15],
    snapToGrid: !1,
    edgesUpdatable: !1,
    edgesFocusable: !0,
    nodesFocusable: !0,
    nodesConnectable: !0,
    nodesDraggable: !0,
    elementsSelectable: !0,
    selectNodesOnDrag: !0,
    multiSelectionActive: !1,
    selectionKeyCode: "Shift",
    multiSelectionKeyCode: "Meta",
    zoomActivationKeyCode: "Meta",
    deleteKeyCode: "Backspace",
    panActivationKeyCode: "Space",
    hooks: lr(),
    applyDefault: !0,
    autoConnect: !1,
    fitViewOnInit: !1,
    noDragClassName: "nodrag",
    noWheelClassName: "nowheel",
    noPanClassName: "nopan",
    defaultEdgeOptions: void 0,
    elevateEdgesOnSelect: !1,
    elevateNodesOnSelect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnConnect: !0,
    disableKeyboardA11y: !1,
    ariaLiveMessage: "",
    __experimentalFeatures: {
      nestedFlow: !1
    }
  };
}
function ti(e) {
  const t = ds();
  return e && Object.keys(e).forEach((n) => {
    const o = e[n];
    se(o) && (t[n] = o);
  }), t;
}
function vs(e, t, n) {
  const o = q(() => (w) => e.nodes && !t.value.length ? e.nodes.find((E) => E.id === w) : e.nodes[t.value.indexOf(w)]), a = q(() => (w) => e.edges && !n.value.length ? e.edges.find((E) => E.id === w) : e.edges[n.value.indexOf(w)]), i = q(() => {
    var w;
    const E = {
      ...cs,
      ...e.edgeTypes
    }, _ = Object.keys(E);
    return (w = e.edges) == null || w.forEach((P) => P.type && !_.includes(P.type) && (E[P.type] = P.type)), E;
  }), r = q(() => {
    var w;
    const E = {
      ...ss,
      ...e.nodeTypes
    }, _ = Object.keys(E);
    return (w = e.nodes) == null || w.forEach((P) => P.type && !_.includes(P.type) && (E[P.type] = P.type)), E;
  }), l = q(() => {
    const w = e.nodes.filter((E) => !E.hidden);
    return e.onlyRenderVisibleElements ? w && Ea(
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
  }), u = (w, E, _) => {
    if (E = E ?? o.value(w.source), _ = _ ?? o.value(w.target), !E || !_) {
      e.hooks.error.trigger(new me(pe.EDGE_ORPHANED, w.id));
      return;
    }
    return !w.hidden && !_.hidden && !E.hidden;
  }, s = q(() => e.onlyRenderVisibleElements ? e.edges.filter((w) => {
    const E = o.value(w.source), _ = o.value(w.target);
    return u(w, E, _) && Er({
      sourcePos: E.computedPosition || { x: 0, y: 0 },
      targetPos: _.computedPosition || { x: 0, y: 0 },
      sourceWidth: E.dimensions.width,
      sourceHeight: E.dimensions.height,
      targetWidth: _.dimensions.width,
      targetHeight: _.dimensions.height,
      width: e.dimensions.width,
      height: e.dimensions.height,
      viewport: e.viewport
    });
  }) : e.edges.filter((w) => u(w))), c = q(() => [...l.value, ...s.value]), d = q(() => e.nodes.filter((w) => w.selected)), h = q(() => e.edges.filter((w) => w.selected)), b = q(() => [
    ...d.value ?? [],
    ...h.value ?? []
  ]), m = q(
    () => l.value.filter((w) => w.initialized && w.handleBounds !== void 0)
  );
  return {
    getNode: o,
    getEdge: a,
    getElements: c,
    getEdgeTypes: i,
    getNodeTypes: r,
    getEdges: s,
    getNodes: l,
    getSelectedElements: b,
    getSelectedNodes: d,
    getSelectedEdges: h,
    getNodesInitialized: m
  };
}
function ao(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function ni(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t)
    n[o] = t[o];
  return n;
}
function Pt() {
}
var Et = 0.7, Wt = 1 / Et, rt = "\\s*([+-]?\\d+)\\s*", St = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ie = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", hs = /^#([0-9a-f]{3,8})$/, fs = new RegExp(`^rgb\\(${rt},${rt},${rt}\\)$`), gs = new RegExp(`^rgb\\(${Ie},${Ie},${Ie}\\)$`), ps = new RegExp(`^rgba\\(${rt},${rt},${rt},${St}\\)$`), ms = new RegExp(`^rgba\\(${Ie},${Ie},${Ie},${St}\\)$`), ys = new RegExp(`^hsl\\(${St},${Ie},${Ie}\\)$`), bs = new RegExp(`^hsla\\(${St},${Ie},${Ie},${St}\\)$`), Lo = {
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
ao(Pt, Nt, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Yo,
  // Deprecated! Use color.formatHex.
  formatHex: Yo,
  formatHex8: ws,
  formatHsl: xs,
  formatRgb: Xo,
  toString: Xo
});
function Yo() {
  return this.rgb().formatHex();
}
function ws() {
  return this.rgb().formatHex8();
}
function xs() {
  return oi(this).formatHsl();
}
function Xo() {
  return this.rgb().formatRgb();
}
function Nt(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = hs.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Go(t) : n === 3 ? new ye(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Dt(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Dt(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = fs.exec(e)) ? new ye(t[1], t[2], t[3], 1) : (t = gs.exec(e)) ? new ye(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = ps.exec(e)) ? Dt(t[1], t[2], t[3], t[4]) : (t = ms.exec(e)) ? Dt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = ys.exec(e)) ? Uo(t[1], t[2] / 100, t[3] / 100, 1) : (t = bs.exec(e)) ? Uo(t[1], t[2] / 100, t[3] / 100, t[4]) : Lo.hasOwnProperty(e) ? Go(Lo[e]) : e === "transparent" ? new ye(NaN, NaN, NaN, 0) : null;
}
function Go(e) {
  return new ye(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Dt(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new ye(e, t, n, o);
}
function _s(e) {
  return e instanceof Pt || (e = Nt(e)), e ? (e = e.rgb(), new ye(e.r, e.g, e.b, e.opacity)) : new ye();
}
function Xn(e, t, n, o) {
  return arguments.length === 1 ? _s(e) : new ye(e, t, n, o ?? 1);
}
function ye(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
ao(ye, Xn, ni(Pt, {
  brighter(e) {
    return e = e == null ? Wt : Math.pow(Wt, e), new ye(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Et : Math.pow(Et, e), new ye(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new ye(Ze(this.r), Ze(this.g), Ze(this.b), qt(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Ho,
  // Deprecated! Use color.formatHex.
  formatHex: Ho,
  formatHex8: Es,
  formatRgb: Fo,
  toString: Fo
}));
function Ho() {
  return `#${je(this.r)}${je(this.g)}${je(this.b)}`;
}
function Es() {
  return `#${je(this.r)}${je(this.g)}${je(this.b)}${je((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Fo() {
  const e = qt(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Ze(this.r)}, ${Ze(this.g)}, ${Ze(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function qt(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Ze(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function je(e) {
  return e = Ze(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Uo(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Se(e, t, n, o);
}
function oi(e) {
  if (e instanceof Se)
    return new Se(e.h, e.s, e.l, e.opacity);
  if (e instanceof Pt || (e = Nt(e)), !e)
    return new Se();
  if (e instanceof Se)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, a = Math.min(t, n, o), i = Math.max(t, n, o), r = NaN, l = i - a, u = (i + a) / 2;
  return l ? (t === i ? r = (n - o) / l + (n < o) * 6 : n === i ? r = (o - t) / l + 2 : r = (t - n) / l + 4, l /= u < 0.5 ? i + a : 2 - i - a, r *= 60) : l = u > 0 && u < 1 ? 0 : r, new Se(r, l, u, e.opacity);
}
function Ss(e, t, n, o) {
  return arguments.length === 1 ? oi(e) : new Se(e, t, n, o ?? 1);
}
function Se(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
ao(Se, Ss, ni(Pt, {
  brighter(e) {
    return e = e == null ? Wt : Math.pow(Wt, e), new Se(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Et : Math.pow(Et, e), new Se(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, a = 2 * n - o;
    return new ye(
      kn(e >= 240 ? e - 240 : e + 120, a, o),
      kn(e, a, o),
      kn(e < 120 ? e + 240 : e - 120, a, o),
      this.opacity
    );
  },
  clamp() {
    return new Se(jo(this.h), Bt(this.s), Bt(this.l), qt(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = qt(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${jo(this.h)}, ${Bt(this.s) * 100}%, ${Bt(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function jo(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Bt(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function kn(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const ai = (e) => () => e;
function Ns(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function ks(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function Cs(e) {
  return (e = +e) == 1 ? ii : function(t, n) {
    return n - t ? ks(t, n, e) : ai(isNaN(t) ? n : t);
  };
}
function ii(e, t) {
  var n = t - e;
  return n ? Ns(e, n) : ai(isNaN(e) ? t : e);
}
const Zo = function e(t) {
  var n = Cs(t);
  function o(a, i) {
    var r = n((a = Xn(a)).r, (i = Xn(i)).r), l = n(a.g, i.g), u = n(a.b, i.b), s = ii(a.opacity, i.opacity);
    return function(c) {
      return a.r = r(c), a.g = l(c), a.b = u(c), a.opacity = s(c), a + "";
    };
  }
  return o.gamma = e, o;
}(1);
function Ge(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
var Gn = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Cn = new RegExp(Gn.source, "g");
function Ms(e) {
  return function() {
    return e;
  };
}
function Ps(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Is(e, t) {
  var n = Gn.lastIndex = Cn.lastIndex = 0, o, a, i, r = -1, l = [], u = [];
  for (e = e + "", t = t + ""; (o = Gn.exec(e)) && (a = Cn.exec(t)); )
    (i = a.index) > n && (i = t.slice(n, i), l[r] ? l[r] += i : l[++r] = i), (o = o[0]) === (a = a[0]) ? l[r] ? l[r] += a : l[++r] = a : (l[++r] = null, u.push({ i: r, x: Ge(o, a) })), n = Cn.lastIndex;
  return n < t.length && (i = t.slice(n), l[r] ? l[r] += i : l[++r] = i), l.length < 2 ? u[0] ? Ps(u[0].x) : Ms(t) : (t = u.length, function(s) {
    for (var c = 0, d; c < t; ++c)
      l[(d = u[c]).i] = d.x(s);
    return l.join("");
  });
}
var Ko = 180 / Math.PI, ri = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function li(e, t, n, o, a, i) {
  var r, l, u;
  return (r = Math.sqrt(e * e + t * t)) && (e /= r, t /= r), (u = e * n + t * o) && (n -= e * u, o -= t * u), (l = Math.sqrt(n * n + o * o)) && (n /= l, o /= l, u /= l), e * o < t * n && (e = -e, t = -t, u = -u, r = -r), {
    translateX: a,
    translateY: i,
    rotate: Math.atan2(t, e) * Ko,
    skewX: Math.atan(u) * Ko,
    scaleX: r,
    scaleY: l
  };
}
var At;
function $s(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? ri : li(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Ts(e) {
  return e == null || (At || (At = document.createElementNS("http://www.w3.org/2000/svg", "g")), At.setAttribute("transform", e), !(e = At.transform.baseVal.consolidate())) ? ri : (e = e.matrix, li(e.a, e.b, e.c, e.d, e.e, e.f));
}
function ui(e, t, n, o) {
  function a(s) {
    return s.length ? s.pop() + " " : "";
  }
  function i(s, c, d, h, b, m) {
    if (s !== d || c !== h) {
      var w = b.push("translate(", null, t, null, n);
      m.push({ i: w - 4, x: Ge(s, d) }, { i: w - 2, x: Ge(c, h) });
    } else
      (d || h) && b.push("translate(" + d + t + h + n);
  }
  function r(s, c, d, h) {
    s !== c ? (s - c > 180 ? c += 360 : c - s > 180 && (s += 360), h.push({ i: d.push(a(d) + "rotate(", null, o) - 2, x: Ge(s, c) })) : c && d.push(a(d) + "rotate(" + c + o);
  }
  function l(s, c, d, h) {
    s !== c ? h.push({ i: d.push(a(d) + "skewX(", null, o) - 2, x: Ge(s, c) }) : c && d.push(a(d) + "skewX(" + c + o);
  }
  function u(s, c, d, h, b, m) {
    if (s !== d || c !== h) {
      var w = b.push(a(b) + "scale(", null, ",", null, ")");
      m.push({ i: w - 4, x: Ge(s, d) }, { i: w - 2, x: Ge(c, h) });
    } else
      (d !== 1 || h !== 1) && b.push(a(b) + "scale(" + d + "," + h + ")");
  }
  return function(s, c) {
    var d = [], h = [];
    return s = e(s), c = e(c), i(s.translateX, s.translateY, c.translateX, c.translateY, d, h), r(s.rotate, c.rotate, d, h), l(s.skewX, c.skewX, d, h), u(s.scaleX, s.scaleY, c.scaleX, c.scaleY, d, h), s = c = null, function(b) {
      for (var m = -1, w = h.length, E; ++m < w; )
        d[(E = h[m]).i] = E.x(b);
      return d.join("");
    };
  };
}
var Os = ui($s, "px, ", "px)", "deg)"), Ds = ui(Ts, ", ", ")", ")"), Bs = 1e-12;
function Wo(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function As(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function zs(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const Rs = function e(t, n, o) {
  function a(i, r) {
    var l = i[0], u = i[1], s = i[2], c = r[0], d = r[1], h = r[2], b = c - l, m = d - u, w = b * b + m * m, E, _;
    if (w < Bs)
      _ = Math.log(h / s) / t, E = function(f) {
        return [
          l + f * b,
          u + f * m,
          s * Math.exp(t * f * _)
        ];
      };
    else {
      var P = Math.sqrt(w), G = (h * h - s * s + o * w) / (2 * s * n * P), y = (h * h - s * s - o * w) / (2 * h * n * P), I = Math.log(Math.sqrt(G * G + 1) - G), z = Math.log(Math.sqrt(y * y + 1) - y);
      _ = (z - I) / t, E = function(f) {
        var x = f * _, N = Wo(I), C = s / (n * P) * (N * zs(t * x + I) - As(I));
        return [
          l + C * b,
          u + C * m,
          s * N / Wo(t * x + I)
        ];
      };
    }
    return E.duration = _ * 1e3 * t / Math.SQRT2, E;
  }
  return a.rho = function(i) {
    var r = Math.max(1e-3, +i), l = r * r, u = l * l;
    return e(r, l, u);
  }, a;
}(Math.SQRT2, 2, 4);
var ft = 0, yt = 0, pt = 0, si = 1e3, Qt, bt, Jt = 0, Qe = 0, yn = 0, kt = typeof performance == "object" && performance.now ? performance : Date, ci = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function io() {
  return Qe || (ci(Vs), Qe = kt.now() + yn);
}
function Vs() {
  Qe = 0;
}
function en() {
  this._call = this._time = this._next = null;
}
en.prototype = di.prototype = {
  constructor: en,
  restart: function(e, t, n) {
    if (typeof e != "function")
      throw new TypeError("callback is not a function");
    n = (n == null ? io() : +n) + (t == null ? 0 : +t), !this._next && bt !== this && (bt ? bt._next = this : Qt = this, bt = this), this._call = e, this._time = n, Hn();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Hn());
  }
};
function di(e, t, n) {
  var o = new en();
  return o.restart(e, t, n), o;
}
function Ls() {
  io(), ++ft;
  for (var e = Qt, t; e; )
    (t = Qe - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --ft;
}
function qo() {
  Qe = (Jt = kt.now()) + yn, ft = yt = 0;
  try {
    Ls();
  } finally {
    ft = 0, Xs(), Qe = 0;
  }
}
function Ys() {
  var e = kt.now(), t = e - Jt;
  t > si && (yn -= t, Jt = e);
}
function Xs() {
  for (var e, t = Qt, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Qt = n);
  bt = e, Hn(o);
}
function Hn(e) {
  if (!ft) {
    yt && (yt = clearTimeout(yt));
    var t = e - Qe;
    t > 24 ? (e < 1 / 0 && (yt = setTimeout(qo, e - kt.now() - yn)), pt && (pt = clearInterval(pt))) : (pt || (Jt = kt.now(), pt = setInterval(Ys, si)), ft = 1, ci(qo));
  }
}
function Qo(e, t, n) {
  var o = new en();
  return t = t == null ? 0 : +t, o.restart((a) => {
    o.stop(), e(a + t);
  }, t, n), o;
}
var Gs = sn("start", "end", "cancel", "interrupt"), Hs = [], vi = 0, Jo = 1, Fn = 2, Yt = 3, ea = 4, Un = 5, Xt = 6;
function bn(e, t, n, o, a, i) {
  var r = e.__transition;
  if (!r)
    e.__transition = {};
  else if (n in r)
    return;
  Fs(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: a,
    // For context during callback.
    on: Gs,
    tween: Hs,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: vi
  });
}
function ro(e, t) {
  var n = Ce(e, t);
  if (n.state > vi)
    throw new Error("too late; already scheduled");
  return n;
}
function $e(e, t) {
  var n = Ce(e, t);
  if (n.state > Yt)
    throw new Error("too late; already running");
  return n;
}
function Ce(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t]))
    throw new Error("transition not found");
  return n;
}
function Fs(e, t, n) {
  var o = e.__transition, a;
  o[t] = n, n.timer = di(i, 0, n.time);
  function i(s) {
    n.state = Jo, n.timer.restart(r, n.delay, n.time), n.delay <= s && r(s - n.delay);
  }
  function r(s) {
    var c, d, h, b;
    if (n.state !== Jo)
      return u();
    for (c in o)
      if (b = o[c], b.name === n.name) {
        if (b.state === Yt)
          return Qo(r);
        b.state === ea ? (b.state = Xt, b.timer.stop(), b.on.call("interrupt", e, e.__data__, b.index, b.group), delete o[c]) : +c < t && (b.state = Xt, b.timer.stop(), b.on.call("cancel", e, e.__data__, b.index, b.group), delete o[c]);
      }
    if (Qo(function() {
      n.state === Yt && (n.state = ea, n.timer.restart(l, n.delay, n.time), l(s));
    }), n.state = Fn, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Fn) {
      for (n.state = Yt, a = new Array(h = n.tween.length), c = 0, d = -1; c < h; ++c)
        (b = n.tween[c].value.call(e, e.__data__, n.index, n.group)) && (a[++d] = b);
      a.length = d + 1;
    }
  }
  function l(s) {
    for (var c = s < n.duration ? n.ease.call(null, s / n.duration) : (n.timer.restart(u), n.state = Un, 1), d = -1, h = a.length; ++d < h; )
      a[d].call(e, c);
    n.state === Un && (n.on.call("end", e, e.__data__, n.index, n.group), u());
  }
  function u() {
    n.state = Xt, n.timer.stop(), delete o[t];
    for (var s in o)
      return;
    delete e.__transition;
  }
}
function Gt(e, t) {
  var n = e.__transition, o, a, i = !0, r;
  if (n) {
    t = t == null ? null : t + "";
    for (r in n) {
      if ((o = n[r]).name !== t) {
        i = !1;
        continue;
      }
      a = o.state > Fn && o.state < Un, o.state = Xt, o.timer.stop(), o.on.call(a ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[r];
    }
    i && delete e.__transition;
  }
}
function Us(e) {
  return this.each(function() {
    Gt(this, e);
  });
}
function js(e, t) {
  var n, o;
  return function() {
    var a = $e(this, e), i = a.tween;
    if (i !== n) {
      o = n = i;
      for (var r = 0, l = o.length; r < l; ++r)
        if (o[r].name === t) {
          o = o.slice(), o.splice(r, 1);
          break;
        }
    }
    a.tween = o;
  };
}
function Zs(e, t, n) {
  var o, a;
  if (typeof n != "function")
    throw new Error();
  return function() {
    var i = $e(this, e), r = i.tween;
    if (r !== o) {
      a = (o = r).slice();
      for (var l = { name: t, value: n }, u = 0, s = a.length; u < s; ++u)
        if (a[u].name === t) {
          a[u] = l;
          break;
        }
      u === s && a.push(l);
    }
    i.tween = a;
  };
}
function Ks(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = Ce(this.node(), n).tween, a = 0, i = o.length, r; a < i; ++a)
      if ((r = o[a]).name === e)
        return r.value;
    return null;
  }
  return this.each((t == null ? js : Zs)(n, e, t));
}
function lo(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var a = $e(this, o);
    (a.value || (a.value = {}))[t] = n.apply(this, arguments);
  }), function(a) {
    return Ce(a, o).value[t];
  };
}
function hi(e, t) {
  var n;
  return (typeof t == "number" ? Ge : t instanceof Nt ? Zo : (n = Nt(t)) ? (t = n, Zo) : Is)(e, t);
}
function Ws(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function qs(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Qs(e, t, n) {
  var o, a = n + "", i;
  return function() {
    var r = this.getAttribute(e);
    return r === a ? null : r === o ? i : i = t(o = r, n);
  };
}
function Js(e, t, n) {
  var o, a = n + "", i;
  return function() {
    var r = this.getAttributeNS(e.space, e.local);
    return r === a ? null : r === o ? i : i = t(o = r, n);
  };
}
function ec(e, t, n) {
  var o, a, i;
  return function() {
    var r, l = n(this), u;
    return l == null ? void this.removeAttribute(e) : (r = this.getAttribute(e), u = l + "", r === u ? null : r === o && u === a ? i : (a = u, i = t(o = r, l)));
  };
}
function tc(e, t, n) {
  var o, a, i;
  return function() {
    var r, l = n(this), u;
    return l == null ? void this.removeAttributeNS(e.space, e.local) : (r = this.getAttributeNS(e.space, e.local), u = l + "", r === u ? null : r === o && u === a ? i : (a = u, i = t(o = r, l)));
  };
}
function nc(e, t) {
  var n = cn(e), o = n === "transform" ? Ds : hi;
  return this.attrTween(e, typeof t == "function" ? (n.local ? tc : ec)(n, o, lo(this, "attr." + e, t)) : t == null ? (n.local ? qs : Ws)(n) : (n.local ? Js : Qs)(n, o, t));
}
function oc(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function ac(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function ic(e, t) {
  var n, o;
  function a() {
    var i = t.apply(this, arguments);
    return i !== o && (n = (o = i) && ac(e, i)), n;
  }
  return a._value = t, a;
}
function rc(e, t) {
  var n, o;
  function a() {
    var i = t.apply(this, arguments);
    return i !== o && (n = (o = i) && oc(e, i)), n;
  }
  return a._value = t, a;
}
function lc(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2)
    return (n = this.tween(n)) && n._value;
  if (t == null)
    return this.tween(n, null);
  if (typeof t != "function")
    throw new Error();
  var o = cn(e);
  return this.tween(n, (o.local ? ic : rc)(o, t));
}
function uc(e, t) {
  return function() {
    ro(this, e).delay = +t.apply(this, arguments);
  };
}
function sc(e, t) {
  return t = +t, function() {
    ro(this, e).delay = t;
  };
}
function cc(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? uc : sc)(t, e)) : Ce(this.node(), t).delay;
}
function dc(e, t) {
  return function() {
    $e(this, e).duration = +t.apply(this, arguments);
  };
}
function vc(e, t) {
  return t = +t, function() {
    $e(this, e).duration = t;
  };
}
function hc(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? dc : vc)(t, e)) : Ce(this.node(), t).duration;
}
function fc(e, t) {
  if (typeof t != "function")
    throw new Error();
  return function() {
    $e(this, e).ease = t;
  };
}
function gc(e) {
  var t = this._id;
  return arguments.length ? this.each(fc(t, e)) : Ce(this.node(), t).ease;
}
function pc(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function")
      throw new Error();
    $e(this, e).ease = n;
  };
}
function mc(e) {
  if (typeof e != "function")
    throw new Error();
  return this.each(pc(this._id, e));
}
function yc(e) {
  typeof e != "function" && (e = Da(e));
  for (var t = this._groups, n = t.length, o = new Array(n), a = 0; a < n; ++a)
    for (var i = t[a], r = i.length, l = o[a] = [], u, s = 0; s < r; ++s)
      (u = i[s]) && e.call(u, u.__data__, s, i) && l.push(u);
  return new Xe(o, this._parents, this._name, this._id);
}
function bc(e) {
  if (e._id !== this._id)
    throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, a = n.length, i = Math.min(o, a), r = new Array(o), l = 0; l < i; ++l)
    for (var u = t[l], s = n[l], c = u.length, d = r[l] = new Array(c), h, b = 0; b < c; ++b)
      (h = u[b] || s[b]) && (d[b] = h);
  for (; l < o; ++l)
    r[l] = t[l];
  return new Xe(r, this._parents, this._name, this._id);
}
function wc(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function xc(e, t, n) {
  var o, a, i = wc(t) ? ro : $e;
  return function() {
    var r = i(this, e), l = r.on;
    l !== o && (a = (o = l).copy()).on(t, n), r.on = a;
  };
}
function _c(e, t) {
  var n = this._id;
  return arguments.length < 2 ? Ce(this.node(), n).on.on(e) : this.each(xc(n, e, t));
}
function Ec(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition)
      if (+n !== e)
        return;
    t && t.removeChild(this);
  };
}
function Sc() {
  return this.on("end.remove", Ec(this._id));
}
function Nc(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = to(e));
  for (var o = this._groups, a = o.length, i = new Array(a), r = 0; r < a; ++r)
    for (var l = o[r], u = l.length, s = i[r] = new Array(u), c, d, h = 0; h < u; ++h)
      (c = l[h]) && (d = e.call(c, c.__data__, h, l)) && ("__data__" in c && (d.__data__ = c.__data__), s[h] = d, bn(s[h], t, n, h, s, Ce(c, n)));
  return new Xe(i, this._parents, t, n);
}
function kc(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Oa(e));
  for (var o = this._groups, a = o.length, i = [], r = [], l = 0; l < a; ++l)
    for (var u = o[l], s = u.length, c, d = 0; d < s; ++d)
      if (c = u[d]) {
        for (var h = e.call(c, c.__data__, d, u), b, m = Ce(c, n), w = 0, E = h.length; w < E; ++w)
          (b = h[w]) && bn(b, t, n, w, h, m);
        i.push(h), r.push(c);
      }
  return new Xe(i, r, t, n);
}
var Cc = Mt.prototype.constructor;
function Mc() {
  return new Cc(this._groups, this._parents);
}
function Pc(e, t) {
  var n, o, a;
  return function() {
    var i = ht(this, e), r = (this.style.removeProperty(e), ht(this, e));
    return i === r ? null : i === n && r === o ? a : a = t(n = i, o = r);
  };
}
function fi(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Ic(e, t, n) {
  var o, a = n + "", i;
  return function() {
    var r = ht(this, e);
    return r === a ? null : r === o ? i : i = t(o = r, n);
  };
}
function $c(e, t, n) {
  var o, a, i;
  return function() {
    var r = ht(this, e), l = n(this), u = l + "";
    return l == null && (u = l = (this.style.removeProperty(e), ht(this, e))), r === u ? null : r === o && u === a ? i : (a = u, i = t(o = r, l));
  };
}
function Tc(e, t) {
  var n, o, a, i = "style." + t, r = "end." + i, l;
  return function() {
    var u = $e(this, e), s = u.on, c = u.value[i] == null ? l || (l = fi(t)) : void 0;
    (s !== n || a !== c) && (o = (n = s).copy()).on(r, a = c), u.on = o;
  };
}
function Oc(e, t, n) {
  var o = (e += "") == "transform" ? Os : hi;
  return t == null ? this.styleTween(e, Pc(e, o)).on("end.style." + e, fi(e)) : typeof t == "function" ? this.styleTween(e, $c(e, o, lo(this, "style." + e, t))).each(Tc(this._id, e)) : this.styleTween(e, Ic(e, o, t), n).on("end.style." + e, null);
}
function Dc(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function Bc(e, t, n) {
  var o, a;
  function i() {
    var r = t.apply(this, arguments);
    return r !== a && (o = (a = r) && Dc(e, r, n)), o;
  }
  return i._value = t, i;
}
function Ac(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2)
    return (o = this.tween(o)) && o._value;
  if (t == null)
    return this.tween(o, null);
  if (typeof t != "function")
    throw new Error();
  return this.tween(o, Bc(e, t, n ?? ""));
}
function zc(e) {
  return function() {
    this.textContent = e;
  };
}
function Rc(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function Vc(e) {
  return this.tween("text", typeof e == "function" ? Rc(lo(this, "text", e)) : zc(e == null ? "" : e + ""));
}
function Lc(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Yc(e) {
  var t, n;
  function o() {
    var a = e.apply(this, arguments);
    return a !== n && (t = (n = a) && Lc(a)), t;
  }
  return o._value = e, o;
}
function Xc(e) {
  var t = "text";
  if (arguments.length < 1)
    return (t = this.tween(t)) && t._value;
  if (e == null)
    return this.tween(t, null);
  if (typeof e != "function")
    throw new Error();
  return this.tween(t, Yc(e));
}
function Gc() {
  for (var e = this._name, t = this._id, n = gi(), o = this._groups, a = o.length, i = 0; i < a; ++i)
    for (var r = o[i], l = r.length, u, s = 0; s < l; ++s)
      if (u = r[s]) {
        var c = Ce(u, t);
        bn(u, e, n, s, r, {
          time: c.time + c.delay + c.duration,
          delay: 0,
          duration: c.duration,
          ease: c.ease
        });
      }
  return new Xe(o, this._parents, e, n);
}
function Hc() {
  var e, t, n = this, o = n._id, a = n.size();
  return new Promise(function(i, r) {
    var l = { value: r }, u = { value: function() {
      --a === 0 && i();
    } };
    n.each(function() {
      var s = $e(this, o), c = s.on;
      c !== e && (t = (e = c).copy(), t._.cancel.push(l), t._.interrupt.push(l), t._.end.push(u)), s.on = t;
    }), a === 0 && i();
  });
}
var Fc = 0;
function Xe(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function gi() {
  return ++Fc;
}
var Oe = Mt.prototype;
Xe.prototype = {
  constructor: Xe,
  select: Nc,
  selectAll: kc,
  selectChild: Oe.selectChild,
  selectChildren: Oe.selectChildren,
  filter: yc,
  merge: bc,
  selection: Mc,
  transition: Gc,
  call: Oe.call,
  nodes: Oe.nodes,
  node: Oe.node,
  size: Oe.size,
  empty: Oe.empty,
  each: Oe.each,
  on: _c,
  attr: nc,
  attrTween: lc,
  style: Oc,
  styleTween: Ac,
  text: Vc,
  textTween: Xc,
  remove: Sc,
  tween: Ks,
  delay: cc,
  duration: hc,
  ease: gc,
  easeVarying: mc,
  end: Hc,
  [Symbol.iterator]: Oe[Symbol.iterator]
};
function Uc(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var jc = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Uc
};
function Zc(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function Kc(e) {
  var t, n;
  e instanceof Xe ? (t = e._id, e = e._name) : (t = gi(), (n = jc).time = io(), e = e == null ? null : e + "");
  for (var o = this._groups, a = o.length, i = 0; i < a; ++i)
    for (var r = o[i], l = r.length, u, s = 0; s < l; ++s)
      (u = r[s]) && bn(u, e, t, s, r, n || Zc(u, t));
  return new Xe(o, this._parents, e, t);
}
Mt.prototype.interrupt = Us;
Mt.prototype.transition = Kc;
const zt = (e) => () => e;
function Wc(e, {
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
function ze(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
ze.prototype = {
  constructor: ze,
  scale: function(e) {
    return e === 1 ? this : new ze(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new ze(this.k, this.x + this.k * e, this.y + this.k * t);
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
var gt = new ze(1, 0, 0);
ze.prototype;
function Mn(e) {
  e.stopImmediatePropagation();
}
function mt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function qc(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Qc() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function ta() {
  return this.__zoom || gt;
}
function Jc(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function ed() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function td(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], a = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], r = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    a > o ? (o + a) / 2 : Math.min(0, o) || Math.max(0, a),
    r > i ? (i + r) / 2 : Math.min(0, i) || Math.max(0, r)
  );
}
function nd() {
  var e = qc, t = Qc, n = td, o = Jc, a = ed, i = [0, 1 / 0], r = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], l = 250, u = Rs, s = sn("start", "zoom", "end"), c, d, h, b = 500, m = 150, w = 0, E = 10;
  function _(p) {
    p.property("__zoom", ta).on("wheel.zoom", x, { passive: !1 }).on("mousedown.zoom", N).on("dblclick.zoom", C).filter(a).on("touchstart.zoom", T).on("touchmove.zoom", J).on("touchend.zoom touchcancel.zoom", ae).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  _.transform = function(p, R, S, B) {
    var F = p.selection ? p.selection() : p;
    F.property("__zoom", ta), p !== F ? I(p, R, S, B) : F.interrupt().each(function() {
      z(this, arguments).event(B).start().zoom(null, typeof R == "function" ? R.apply(this, arguments) : R).end();
    });
  }, _.scaleBy = function(p, R, S, B) {
    _.scaleTo(p, function() {
      var F = this.__zoom.k, j = typeof R == "function" ? R.apply(this, arguments) : R;
      return F * j;
    }, S, B);
  }, _.scaleTo = function(p, R, S, B) {
    _.transform(p, function() {
      var F = t.apply(this, arguments), j = this.__zoom, A = S == null ? y(F) : typeof S == "function" ? S.apply(this, arguments) : S, U = j.invert(A), V = typeof R == "function" ? R.apply(this, arguments) : R;
      return n(G(P(j, V), A, U), F, r);
    }, S, B);
  }, _.translateBy = function(p, R, S, B) {
    _.transform(p, function() {
      return n(this.__zoom.translate(
        typeof R == "function" ? R.apply(this, arguments) : R,
        typeof S == "function" ? S.apply(this, arguments) : S
      ), t.apply(this, arguments), r);
    }, null, B);
  }, _.translateTo = function(p, R, S, B, F) {
    _.transform(p, function() {
      var j = t.apply(this, arguments), A = this.__zoom, U = B == null ? y(j) : typeof B == "function" ? B.apply(this, arguments) : B;
      return n(gt.translate(U[0], U[1]).scale(A.k).translate(
        typeof R == "function" ? -R.apply(this, arguments) : -R,
        typeof S == "function" ? -S.apply(this, arguments) : -S
      ), j, r);
    }, B, F);
  };
  function P(p, R) {
    return R = Math.max(i[0], Math.min(i[1], R)), R === p.k ? p : new ze(R, p.x, p.y);
  }
  function G(p, R, S) {
    var B = R[0] - S[0] * p.k, F = R[1] - S[1] * p.k;
    return B === p.x && F === p.y ? p : new ze(p.k, B, F);
  }
  function y(p) {
    return [(+p[0][0] + +p[1][0]) / 2, (+p[0][1] + +p[1][1]) / 2];
  }
  function I(p, R, S, B) {
    p.on("start.zoom", function() {
      z(this, arguments).event(B).start();
    }).on("interrupt.zoom end.zoom", function() {
      z(this, arguments).event(B).end();
    }).tween("zoom", function() {
      var F = this, j = arguments, A = z(F, j).event(B), U = t.apply(F, j), V = S == null ? y(U) : typeof S == "function" ? S.apply(F, j) : S, K = Math.max(U[1][0] - U[0][0], U[1][1] - U[0][1]), ne = F.__zoom, re = typeof R == "function" ? R.apply(F, j) : R, M = u(ne.invert(V).concat(K / ne.k), re.invert(V).concat(K / re.k));
      return function(v) {
        if (v === 1)
          v = re;
        else {
          var g = M(v), $ = K / g[2];
          v = new ze($, V[0] - g[0] * $, V[1] - g[1] * $);
        }
        A.zoom(null, v);
      };
    });
  }
  function z(p, R, S) {
    return !S && p.__zooming || new f(p, R);
  }
  function f(p, R) {
    this.that = p, this.args = R, this.active = 0, this.sourceEvent = null, this.extent = t.apply(p, R), this.taps = 0;
  }
  f.prototype = {
    event: function(p) {
      return p && (this.sourceEvent = p), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(p, R) {
      return this.mouse && p !== "mouse" && (this.mouse[1] = R.invert(this.mouse[0])), this.touch0 && p !== "touch" && (this.touch0[1] = R.invert(this.touch0[0])), this.touch1 && p !== "touch" && (this.touch1[1] = R.invert(this.touch1[0])), this.that.__zoom = R, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(p) {
      var R = Ee(this.that).datum();
      s.call(
        p,
        this.that,
        new Wc(p, {
          sourceEvent: this.sourceEvent,
          target: _,
          type: p,
          transform: this.that.__zoom,
          dispatch: s
        }),
        R
      );
    }
  };
  function x(p, ...R) {
    if (!e.apply(this, arguments))
      return;
    var S = z(this, R).event(p), B = this.__zoom, F = Math.max(i[0], Math.min(i[1], B.k * Math.pow(2, o.apply(this, arguments)))), j = Me(p);
    if (S.wheel)
      (S.mouse[0][0] !== j[0] || S.mouse[0][1] !== j[1]) && (S.mouse[1] = B.invert(S.mouse[0] = j)), clearTimeout(S.wheel);
    else {
      if (B.k === F)
        return;
      S.mouse = [j, B.invert(j)], Gt(this), S.start();
    }
    mt(p), S.wheel = setTimeout(A, m), S.zoom("mouse", n(G(P(B, F), S.mouse[0], S.mouse[1]), S.extent, r));
    function A() {
      S.wheel = null, S.end();
    }
  }
  function N(p, ...R) {
    if (h || !e.apply(this, arguments))
      return;
    var S = p.currentTarget, B = z(this, R, !0).event(p), F = Ee(p.view).on("mousemove.zoom", V, !0).on("mouseup.zoom", K, !0), j = Me(p, S), A = p.clientX, U = p.clientY;
    Ha(p.view), Mn(p), B.mouse = [j, this.__zoom.invert(j)], Gt(this), B.start();
    function V(ne) {
      if (mt(ne), !B.moved) {
        var re = ne.clientX - A, M = ne.clientY - U;
        B.moved = re * re + M * M > w;
      }
      B.event(ne).zoom("mouse", n(G(B.that.__zoom, B.mouse[0] = Me(ne, S), B.mouse[1]), B.extent, r));
    }
    function K(ne) {
      F.on("mousemove.zoom mouseup.zoom", null), Fa(ne.view, B.moved), mt(ne), B.event(ne).end();
    }
  }
  function C(p, ...R) {
    if (e.apply(this, arguments)) {
      var S = this.__zoom, B = Me(p.changedTouches ? p.changedTouches[0] : p, this), F = S.invert(B), j = S.k * (p.shiftKey ? 0.5 : 2), A = n(G(P(S, j), B, F), t.apply(this, R), r);
      mt(p), l > 0 ? Ee(this).transition().duration(l).call(I, A, B, p) : Ee(this).call(_.transform, A, B, p);
    }
  }
  function T(p, ...R) {
    if (e.apply(this, arguments)) {
      var S = p.touches, B = S.length, F = z(this, R, p.changedTouches.length === B).event(p), j, A, U, V;
      for (Mn(p), A = 0; A < B; ++A)
        U = S[A], V = Me(U, this), V = [V, this.__zoom.invert(V), U.identifier], F.touch0 ? !F.touch1 && F.touch0[2] !== V[2] && (F.touch1 = V, F.taps = 0) : (F.touch0 = V, j = !0, F.taps = 1 + !!c);
      c && (c = clearTimeout(c)), j && (F.taps < 2 && (d = V[0], c = setTimeout(function() {
        c = null;
      }, b)), Gt(this), F.start());
    }
  }
  function J(p, ...R) {
    if (this.__zooming) {
      var S = z(this, R).event(p), B = p.changedTouches, F = B.length, j, A, U, V;
      for (mt(p), j = 0; j < F; ++j)
        A = B[j], U = Me(A, this), S.touch0 && S.touch0[2] === A.identifier ? S.touch0[0] = U : S.touch1 && S.touch1[2] === A.identifier && (S.touch1[0] = U);
      if (A = S.that.__zoom, S.touch1) {
        var K = S.touch0[0], ne = S.touch0[1], re = S.touch1[0], M = S.touch1[1], v = (v = re[0] - K[0]) * v + (v = re[1] - K[1]) * v, g = (g = M[0] - ne[0]) * g + (g = M[1] - ne[1]) * g;
        A = P(A, Math.sqrt(v / g)), U = [(K[0] + re[0]) / 2, (K[1] + re[1]) / 2], V = [(ne[0] + M[0]) / 2, (ne[1] + M[1]) / 2];
      } else if (S.touch0)
        U = S.touch0[0], V = S.touch0[1];
      else
        return;
      S.zoom("touch", n(G(A, U, V), S.extent, r));
    }
  }
  function ae(p, ...R) {
    if (this.__zooming) {
      var S = z(this, R).event(p), B = p.changedTouches, F = B.length, j, A;
      for (Mn(p), h && clearTimeout(h), h = setTimeout(function() {
        h = null;
      }, b), j = 0; j < F; ++j)
        A = B[j], S.touch0 && S.touch0[2] === A.identifier ? delete S.touch0 : S.touch1 && S.touch1[2] === A.identifier && delete S.touch1;
      if (S.touch1 && !S.touch0 && (S.touch0 = S.touch1, delete S.touch1), S.touch0)
        S.touch0[1] = this.__zoom.invert(S.touch0[0]);
      else if (S.end(), S.taps === 2 && (A = Me(A, this), Math.hypot(d[0] - A[0], d[1] - A[1]) < E)) {
        var U = Ee(this).on("dblclick.zoom");
        U && U.apply(this, arguments);
      }
    }
  }
  return _.wheelDelta = function(p) {
    return arguments.length ? (o = typeof p == "function" ? p : zt(+p), _) : o;
  }, _.filter = function(p) {
    return arguments.length ? (e = typeof p == "function" ? p : zt(!!p), _) : e;
  }, _.touchable = function(p) {
    return arguments.length ? (a = typeof p == "function" ? p : zt(!!p), _) : a;
  }, _.extent = function(p) {
    return arguments.length ? (t = typeof p == "function" ? p : zt([[+p[0][0], +p[0][1]], [+p[1][0], +p[1][1]]]), _) : t;
  }, _.scaleExtent = function(p) {
    return arguments.length ? (i[0] = +p[0], i[1] = +p[1], _) : [i[0], i[1]];
  }, _.translateExtent = function(p) {
    return arguments.length ? (r[0][0] = +p[0][0], r[1][0] = +p[1][0], r[0][1] = +p[0][1], r[1][1] = +p[1][1], _) : [[r[0][0], r[0][1]], [r[1][0], r[1][1]]];
  }, _.constrain = function(p) {
    return arguments.length ? (n = p, _) : n;
  }, _.duration = function(p) {
    return arguments.length ? (l = +p, _) : l;
  }, _.interpolate = function(p) {
    return arguments.length ? (u = p, _) : u;
  }, _.on = function() {
    var p = s.on.apply(s, arguments);
    return p === s ? _ : p;
  }, _.clickDistance = function(p) {
    return arguments.length ? (w = (p = +p) * p, _) : Math.sqrt(w);
  }, _.tapDistance = function(p) {
    return arguments.length ? (E = +p, _) : E;
  }, _;
}
const Pn = 0.1;
function He() {
}
const od = {
  zoomIn: He,
  zoomOut: He,
  zoomTo: He,
  fitView: He,
  setCenter: He,
  fitBounds: He,
  project: (e) => e,
  setTransform: He,
  getTransform: () => ({ x: 0, y: 0, zoom: 1 }),
  initialized: !1
}, ad = (e, t) => {
  const n = e, o = O(n, "nodes"), a = O(n, "d3Zoom"), i = O(n, "d3Selection"), r = O(n, "dimensions"), l = O(n, "translateExtent"), u = O(n, "minZoom"), s = O(n, "maxZoom"), c = O(n, "viewport"), d = O(n, "snapToGrid"), h = O(n, "snapGrid"), b = O(n, "hooks"), m = t, w = O(m, "getNodes"), E = ee(!1);
  b.value.nodesInitialized.on(() => {
    E.value = !0;
  });
  const _ = q(() => !!a.value && !!i.value && !!r.value.width && !!r.value.height && E.value);
  function P(y, I) {
    i.value && a.value && a.value.scaleBy(In(i.value, I), y);
  }
  function G(y, I, z, f) {
    const { x, y: N } = ma({ x: -y, y: -I }, l.value), C = gt.translate(-x, -N).scale(z);
    i.value && a.value && a.value.transform(In(i.value, f), C);
  }
  return q(() => _.value ? {
    initialized: !0,
    zoomIn: (y) => {
      P(1.2, y == null ? void 0 : y.duration);
    },
    zoomOut: (y) => {
      P(1 / 1.2, y == null ? void 0 : y.duration);
    },
    zoomTo: (y, I) => {
      i.value && a.value && a.value.scaleTo(In(i.value, I == null ? void 0 : I.duration), y);
    },
    setTransform: (y, I) => {
      G(y.x, y.y, y.zoom, I == null ? void 0 : I.duration);
    },
    getTransform: () => ({
      x: c.value.x,
      y: c.value.y,
      zoom: c.value.zoom
    }),
    fitView: (y = {
      padding: Pn,
      includeHiddenNodes: !1,
      duration: 0
    }) => {
      if (!o.value.length)
        return;
      const I = (y.includeHiddenNodes ? o.value : w.value).filter((C) => {
        var T;
        const J = C.initialized && C.dimensions.width && C.dimensions.height;
        let ae = !0;
        return (T = y.nodes) != null && T.length && (ae = y.nodes.includes(C.id)), J && ae;
      }), z = _a(I), { x: f, y: x, zoom: N } = So(
        z,
        r.value.width,
        r.value.height,
        y.minZoom ?? u.value,
        y.maxZoom ?? s.value,
        y.padding ?? Pn,
        y.offset
      );
      G(f, x, N, y == null ? void 0 : y.duration);
    },
    setCenter: (y, I, z) => {
      const f = typeof (z == null ? void 0 : z.zoom) < "u" ? z.zoom : s.value, x = r.value.width / 2 - y * f, N = r.value.height / 2 - I * f;
      G(x, N, f, z == null ? void 0 : z.duration);
    },
    fitBounds: (y, I = { padding: Pn }) => {
      const { x: z, y: f, zoom: x } = So(
        y,
        r.value.width,
        r.value.height,
        u.value,
        s.value,
        I.padding
      );
      G(z, f, x, I == null ? void 0 : I.duration);
    },
    project: (y) => wa(y, c.value, d.value, h.value)
  } : od);
};
function In(e, t = 0) {
  return e.transition().duration(t);
}
function $n(e, t) {
  if (t) {
    const n = e.position.x + e.dimensions.width - t.dimensions.width, o = e.position.y + e.dimensions.height - t.dimensions.height;
    if (n > 0 || o > 0 || e.position.x < 0 || e.position.y < 0) {
      let a = {};
      if (Ye(t.style) ? a = { ...t.style(t) } : t.style && (a = { ...t.style }), a.width = a.width ?? `${t.dimensions.width}px`, a.height = a.height ?? `${t.dimensions.height}px`, n > 0)
        if (Ae(a.width)) {
          const i = Number(a.width.replace("px", ""));
          a.width = `${i + n}px`;
        } else
          a.width += n;
      if (o > 0)
        if (Ae(a.height)) {
          const i = Number(a.height.replace("px", ""));
          a.height = `${i + o}px`;
        } else
          a.height += o;
      if (e.position.x < 0) {
        const i = Math.abs(e.position.x);
        if (t.position.x = t.position.x - i, Ae(a.width)) {
          const r = Number(a.width.replace("px", ""));
          a.width = `${r + i}px`;
        } else
          a.width += i;
        e.position.x = 0;
      }
      if (e.position.y < 0) {
        const i = Math.abs(e.position.y);
        if (t.position.y = t.position.y - i, Ae(a.height)) {
          const r = Number(a.height.replace("px", ""));
          a.height = `${r + i}px`;
        } else
          a.height += i;
        e.position.y = 0;
      }
      t.dimensions.width = Number(a.width.toString().replace("px", "")), t.dimensions.height = Number(a.height.toString().replace("px", "")), Ye(t.style) ? t.style = (i) => {
        const r = t.style;
        return {
          ...r(i),
          ...a
        };
      } : t.style = {
        ...t.style,
        ...a
      };
    }
  }
}
function na(e, t) {
  e.filter((o) => o.type === "add" || o.type === "remove").forEach((o) => {
    if (o.type === "add")
      t.findIndex((a) => a.id === o.item.id) === -1 && t.push(o.item);
    else if (o.type === "remove") {
      const a = t.findIndex((i) => i.id === o.id);
      a !== -1 && t.splice(a, 1);
    }
  });
  const n = t.map((o) => o.id);
  return t.forEach((o) => {
    var a, i;
    const r = e.filter((l) => l.id === o.id);
    for (const l of r)
      switch (l.type) {
        case "select":
          o.selected = l.selected;
          break;
        case "position":
          if (et(o) && (typeof l.position < "u" && (o.position = l.position), typeof l.dragging < "u" && (o.dragging = l.dragging), o.expandParent && o.parentNode)) {
            const u = t[n.indexOf(o.parentNode)];
            u && et(u) && $n(o, u);
          }
          break;
        case "dimensions":
          if (et(o)) {
            if (typeof l.dimensions < "u" && (o.dimensions = l.dimensions), typeof l.updateStyle < "u" && (o.style = {
              ...o.style || {},
              width: `${(a = l.dimensions) == null ? void 0 : a.width}px`,
              height: `${(i = l.dimensions) == null ? void 0 : i.height}px`
            }), typeof l.resizing < "u" && (o.resizing = l.resizing), o.expandParent && o.parentNode) {
              const u = t[n.indexOf(o.parentNode)];
              u && et(u) && (u.initialized ? $n(o, u) : Re(() => {
                $n(o, u);
              }));
            }
            o.initialized || (o.initialized = !0);
          }
          break;
      }
  }), t;
}
function De(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function oa(e) {
  return {
    item: e,
    type: "add"
  };
}
function Tn(e) {
  return {
    id: e,
    type: "remove"
  };
}
function On(e, t) {
  return e.reduce(
    (n, o) => {
      let a = t.includes(o.id);
      se(o.selectable) && !o.selectable && (a = !1);
      const i = et(o) ? "changedNodes" : "changedEdges";
      return !o.selected && a ? n[i].push(De(o.id, !0)) : o.selected && !a && n[i].push(De(o.id, !1)), n;
    },
    { changedNodes: [], changedEdges: [] }
  );
}
function id(e, t, n, o) {
  let a = !1;
  const i = ad(e, t), r = (v) => {
    const g = v ?? n.value ?? [];
    e.hooks.updateNodeInternals.trigger(g);
  }, l = (v) => {
    if (v)
      return e.nodes && !n.value.length ? e.nodes.find((g) => g.id === v) : e.nodes[n.value.indexOf(v)];
  }, u = (v) => {
    if (v)
      return e.edges && !o.value.length ? e.edges.find((g) => g.id === v) : e.edges[o.value.indexOf(v)];
  }, s = (v, g, $) => {
    const D = [];
    v.forEach((L) => {
      var Y, W;
      const Q = {
        id: L.id,
        type: "position",
        dragging: $,
        from: L.from
      };
      if (g && (Q.position = L.position, L.parentNode)) {
        const oe = l(L.parentNode);
        Q.position = {
          x: Q.position.x - (((Y = oe == null ? void 0 : oe.computedPosition) == null ? void 0 : Y.x) ?? 0),
          y: Q.position.y - (((W = oe == null ? void 0 : oe.computedPosition) == null ? void 0 : W.y) ?? 0)
        };
      }
      D.push(Q);
    }), D != null && D.length && e.hooks.nodesChange.trigger(D);
  }, c = (v) => {
    var g;
    if (!e.vueFlowRef)
      return;
    const $ = e.vueFlowRef.querySelector(".vue-flow__transformationpane");
    if (!$)
      return;
    let D;
    if ((g = e.__experimentalFeatures) != null && g.nestedFlow) {
      let Y = [$], W = $, Q;
      for (; !Q && W; )
        W = W.parentElement, Q = W == null ? void 0 : W.classList.contains("vue-flow__transformationpane"), Q && (Y = [W, ...Y]);
      Y.forEach((oe) => {
        const X = window.getComputedStyle(oe), { m22: he } = new window.DOMMatrixReadOnly(X.transform);
        D ? D *= he : D = he;
      });
    } else {
      const Y = window.getComputedStyle($), { m22: W } = new window.DOMMatrixReadOnly(Y.transform);
      D = W;
    }
    const L = v.reduce((Y, W) => {
      const Q = l(W.id);
      if (Q) {
        const oe = nn(W.nodeElement);
        oe.width && oe.height && (Q.dimensions.width !== oe.width || Q.dimensions.height !== oe.height || W.forceUpdate) && (Q.handleBounds.source = To(".source", W.nodeElement, D), Q.handleBounds.target = To(".target", W.nodeElement, D), Q.dimensions = oe, Q.initialized = !0, Y.push({
          id: Q.id,
          type: "dimensions",
          dimensions: oe
        }));
      }
      return Y;
    }, []);
    e.fitViewOnInit && !a && (be(() => i.value.initialized).toBe(!0).then(() => {
      i.value.fitView();
    }), a = !0), L.length && e.hooks.nodesChange.trigger(L);
  }, d = (v, g) => {
    const $ = v.map((Y) => Y.id);
    let D, L = [];
    if (e.multiSelectionActive)
      D = $.map((Y) => De(Y, g));
    else {
      const Y = On([...e.nodes, ...e.edges], $);
      D = Y.changedNodes, L = Y.changedEdges;
    }
    D.length && e.hooks.nodesChange.trigger(D), L.length && e.hooks.edgesChange.trigger(L);
  }, h = (v, g) => {
    const $ = v.map((Y) => Y.id);
    let D = [], L;
    if (e.multiSelectionActive)
      L = $.map((Y) => De(Y, g));
    else {
      const Y = On([...e.nodes, ...e.edges], $);
      D = Y.changedNodes, L = Y.changedEdges;
    }
    D.length && e.hooks.nodesChange.trigger(D), L.length && e.hooks.edgesChange.trigger(L);
  }, b = (v, g) => {
    const $ = v.filter(Vt).map((W) => W.id), D = v.filter(dt).map((W) => W.id);
    let { changedNodes: L, changedEdges: Y } = On([...e.nodes, ...e.edges], [...$, ...D]);
    e.multiSelectionActive && (L = $.map((W) => De(W, g)), Y = D.map((W) => De(W, g))), L.length && e.hooks.nodesChange.trigger(L), Y.length && e.hooks.edgesChange.trigger(Y);
  }, m = (v) => {
    d(v, !0);
  }, w = (v) => {
    h(v, !0);
  }, E = (v) => {
    b(v, !0);
  }, _ = (v) => {
    if (!v.length)
      return d(v, !1);
    const g = v.map(($) => $.id).map(($) => De($, !1));
    g.length && e.hooks.nodesChange.trigger(g);
  }, P = (v) => {
    if (!v.length)
      return h(v, !1);
    const g = v.map(($) => $.id).map(($) => De($, !1));
    g.length && e.hooks.edgesChange.trigger(g);
  }, G = (v) => {
    if (!v || !v.length)
      return b([], !1);
    const { changedNodes: g, changedEdges: $ } = v.reduce(
      (D, L) => {
        const Y = De(L.id, !1);
        return Vt(L) ? D.changedNodes.push(Y) : D.changedEdges.push(Y), D;
      },
      { changedNodes: [], changedEdges: [] }
    );
    g.length && e.hooks.nodesChange.trigger(g), $.length && e.hooks.edgesChange.trigger($);
  }, y = (v) => {
    var g;
    (g = e.d3Zoom) == null || g.scaleExtent([v, e.maxZoom]), e.minZoom = v;
  }, I = (v) => {
    var g;
    (g = e.d3Zoom) == null || g.scaleExtent([e.minZoom, v]), e.maxZoom = v;
  }, z = (v) => {
    var g;
    (g = e.d3Zoom) == null || g.translateExtent(v), e.translateExtent = v;
  }, f = (v) => {
    e.nodeExtent = v, r(n.value);
  }, x = (v) => {
    e.nodesDraggable = v, e.nodesConnectable = v, e.elementsSelectable = v;
  }, N = (v) => {
    const g = v instanceof Function ? v(e.nodes) : v;
    !e.initialized && !g.length || (e.nodes = No(g, e.nodes, l, e.hooks.error.trigger));
  }, C = (v) => {
    const g = v instanceof Function ? v(e.edges) : v;
    if (!e.initialized && !g.length)
      return;
    const $ = e.isValidConnection ? g.filter(
      (D) => e.isValidConnection(D, {
        edges: e.edges,
        sourceNode: l(D.source),
        targetNode: l(D.target)
      })
    ) : g;
    e.edges = $.reduce((D, L) => {
      const Y = l(L.source), W = l(L.target), Q = !Y || typeof Y > "u", oe = !W || typeof W > "u";
      if (Q && oe ? e.hooks.error.trigger(new me(pe.EDGE_SOURCE_TARGET_MISSING, L.id, L.source, L.target)) : (Q && e.hooks.error.trigger(new me(pe.EDGE_SOURCE_MISSING, L.id, L.source)), oe && e.hooks.error.trigger(new me(pe.EDGE_TARGET_MISSING, L.id, L.target))), Q || oe)
        return D;
      const X = u(L.id);
      return D.push({
        ...ya(L, Object.assign({}, X, e.defaultEdgeOptions)),
        sourceNode: Y,
        targetNode: W
      }), D;
    }, []);
  }, T = (v) => {
    const g = v instanceof Function ? v([...e.nodes, ...e.edges]) : v;
    !e.initialized && !g.length || (N(g.filter(Vt)), C(g.filter(dt)));
  }, J = (v) => {
    const g = v instanceof Function ? v(e.nodes) : v, $ = No(g, e.nodes, l, e.hooks.error.trigger).map(oa);
    $.length && e.hooks.nodesChange.trigger($);
  }, ae = (v) => {
    const g = v instanceof Function ? v(e.edges) : v, $ = (e.isValidConnection ? g.filter(
      (D) => e.isValidConnection(D, {
        edges: e.edges,
        sourceNode: l(D.source),
        targetNode: l(D.target)
      })
    ) : g).reduce((D, L) => {
      const Y = mr(
        {
          ...L,
          ...e.defaultEdgeOptions
        },
        e.edges,
        e.hooks.error.trigger
      );
      if (Y) {
        const W = l(Y.source), Q = l(Y.target), oe = !W || typeof W > "u", X = !Q || typeof Q > "u";
        if (oe && X ? e.hooks.error.trigger(new me(pe.EDGE_SOURCE_TARGET_MISSING, Y.id, Y.source, Y.target)) : (oe && e.hooks.error.trigger(new me(pe.EDGE_SOURCE_MISSING, Y.id, Y.source)), X && e.hooks.error.trigger(new me(pe.EDGE_TARGET_MISSING, Y.id, Y.target))), oe || X)
          return D;
        D.push(
          oa({
            ...Y,
            sourceNode: W,
            targetNode: Q
          })
        );
      }
      return D;
    }, []);
    $.length && e.hooks.edgesChange.trigger($);
  }, p = (v, g = !0) => {
    const $ = v instanceof Function ? v(e.nodes) : v, D = [], L = [];
    $.forEach((Y) => {
      const W = typeof Y == "string" ? l(Y) : Y;
      if (!(se(W.deletable) && !W.deletable) && (D.push(Tn(W.id)), g)) {
        const Q = on([W], e.edges).filter((oe) => se(oe.deletable) ? oe.deletable : !0);
        L.push(...Q.map((oe) => Tn(oe.id)));
      }
    }), L.length && e.hooks.edgesChange.trigger(L), D.length && e.hooks.nodesChange.trigger(D);
  }, R = (v) => {
    const g = v instanceof Function ? v(e.edges) : v, $ = [];
    g.forEach((D) => {
      const L = typeof D == "string" ? u(D) : D;
      se(L.deletable) && !L.deletable || $.push(Tn(typeof D == "string" ? D : D.id));
    }), e.hooks.edgesChange.trigger($);
  }, S = (v, g, $ = !0) => yr(v, g, e.edges, u, $, e.hooks.error.trigger), B = (v) => na(v, e.nodes), F = (v) => na(v, e.edges), j = (v, g, $, D = !1) => {
    D ? e.connectionClickStartHandle = v : e.connectionStartHandle = v, e.connectionEndHandle = null, e.connectionStatus = null, g && (e.connectionPosition = g);
  }, A = (v, g = null, $ = null) => {
    e.connectionStartHandle && (e.connectionPosition = v, e.connectionEndHandle = g, e.connectionStatus = $);
  }, U = (v, g) => {
    e.connectionPosition = { x: NaN, y: NaN }, e.connectionStatus = null, g ? e.connectionClickStartHandle = null : e.connectionStartHandle = null;
  }, V = (v) => {
    const g = cr(v), $ = g ? null : l(v.id);
    return !g && !$ ? [null, null, g] : [g ? v : _o($), $, g];
  }, K = (v, g = !0, $) => {
    const [D, L, Y] = V(v);
    return D ? ($ || e.nodes).filter((W) => {
      if (!Y && (W.id === L.id || !W.computedPosition))
        return !1;
      const Q = _o(W), oe = Bn(Q, D);
      return g && oe > 0 || oe >= Number(v.width) * Number(v.height);
    }) : [];
  }, ne = (v, g, $ = !0) => {
    const [D] = V(v);
    if (!D)
      return !1;
    const L = Bn(D, g);
    return $ && L > 0 || L >= Number(v.width) * Number(v.height);
  }, re = (v) => {
    const { viewport: g, dimensions: $, d3Zoom: D, d3Selection: L, translateExtent: Y } = e;
    if (!D || !L || !v.x && !v.y)
      return !1;
    const W = gt.translate(g.x + v.x, g.y + v.y).scale(g.zoom), Q = [
      [0, 0],
      [$.width, $.height]
    ], oe = D.constrain()(W, Q, Y), X = e.viewport.x !== oe.x || e.viewport.y !== oe.y || e.viewport.zoom !== oe.k;
    return D.transform(L, oe), X;
  }, M = (v) => {
    const g = v instanceof Function ? v(e) : v, $ = [
      "modelValue",
      "nodes",
      "edges",
      "maxZoom",
      "minZoom",
      "translateExtent",
      "nodeExtent",
      "hooks",
      "defaultEdgeOptions"
    ], D = [
      "d3Zoom",
      "d3Selection",
      "d3ZoomHandler",
      "viewportRef",
      "vueFlowRef",
      "dimensions",
      "hooks"
    ];
    se(g.defaultEdgeOptions) && (e.defaultEdgeOptions = g.defaultEdgeOptions);
    const L = g.modelValue || g.nodes || g.edges ? [] : void 0;
    L && (g.modelValue && L.push(...g.modelValue), g.nodes && L.push(...g.nodes), g.edges && L.push(...g.edges), T(L));
    const Y = () => {
      se(g.maxZoom) && I(g.maxZoom), se(g.minZoom) && y(g.minZoom), se(g.translateExtent) && z(g.translateExtent), se(g.nodeExtent) && f(g.nodeExtent);
    };
    Object.keys(g).forEach((W) => {
      const Q = W, oe = g[Q];
      ![...$, ...D].includes(Q) && se(oe) && (e[Q] = oe);
    }), e.d3Zoom ? Y() : be(() => e.d3Zoom).not.toBeUndefined().then(Y), e.initialized || (e.initialized = !0);
  };
  return {
    updateNodePositions: s,
    updateNodeDimensions: c,
    setElements: T,
    setNodes: N,
    setEdges: C,
    addNodes: J,
    addEdges: ae,
    removeNodes: p,
    removeEdges: R,
    findNode: l,
    findEdge: u,
    updateEdge: S,
    applyEdgeChanges: F,
    applyNodeChanges: B,
    addSelectedElements: E,
    addSelectedNodes: m,
    addSelectedEdges: w,
    setMinZoom: y,
    setMaxZoom: I,
    setTranslateExtent: z,
    setNodeExtent: f,
    removeSelectedElements: G,
    removeSelectedNodes: _,
    removeSelectedEdges: P,
    startConnection: j,
    updateConnection: A,
    endConnection: U,
    setInteractive: x,
    setState: M,
    getIntersectingNodes: K,
    isNodeIntersecting: ne,
    panBy: re,
    fitView: async (v = { padding: 0.1 }) => {
      await be(() => i.value.initialized).toBe(!0), i.value.fitView(v);
    },
    zoomIn: async (v) => {
      await be(() => i.value.initialized).toBe(!0), i.value.zoomIn(v);
    },
    zoomOut: async (v) => {
      await be(() => i.value.initialized).toBe(!0), i.value.zoomOut(v);
    },
    zoomTo: async (v, g) => {
      await be(() => i.value.initialized).toBe(!0), i.value.zoomTo(v, g);
    },
    setTransform: async (v, g) => {
      await be(() => i.value.initialized).toBe(!0), i.value.setTransform(v, g);
    },
    getTransform: () => i.value.getTransform(),
    setCenter: async (v, g, $) => {
      await be(() => i.value.initialized).toBe(!0), i.value.setCenter(v, g, $);
    },
    fitBounds: async (v, g) => {
      await be(() => i.value.initialized).toBe(!0), i.value.fitBounds(v, g);
    },
    project: (v) => i.value.project(v),
    toObject: () => JSON.parse(
      JSON.stringify({
        nodes: e.nodes.map((v) => {
          const {
            computedPosition: g,
            handleBounds: $,
            selected: D,
            dimensions: L,
            isParent: Y,
            resizing: W,
            dragging: Q,
            initialized: oe,
            ...X
          } = v;
          return X;
        }),
        edges: e.edges.map((v) => {
          const { selected: g, sourceNode: $, targetNode: D, ...L } = v;
          return L;
        }),
        position: [e.viewport.x, e.viewport.y],
        zoom: e.viewport.zoom
      })
    ),
    updateNodeInternals: r,
    $reset: () => {
      const v = ti();
      if (e.edges = [], e.nodes = [], e.d3Zoom && e.d3Selection) {
        const g = gt.translate(v.defaultViewport.x ?? 0, v.defaultViewport.y ?? 0).scale(We(v.defaultViewport.zoom ?? 1, v.minZoom, v.maxZoom)), $ = e.viewportRef.getBoundingClientRect(), D = [
          [0, 0],
          [$.width, $.height]
        ], L = e.d3Zoom.constrain()(g, D, v.translateExtent);
        e.d3Zoom.transform(e.d3Selection, L);
      }
      M(v);
    },
    $destroy: () => {
    }
  };
}
class tt {
  constructor() {
    this.currentId = 0, this.flows = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    return tt.instance || (tt.instance = new tt()), tt.instance;
  }
  set(t, n) {
    return this.flows.set(t, n);
  }
  get(t) {
    return this.flows.get(t);
  }
  remove(t) {
    return this.flows.delete(t);
  }
  create(t, n) {
    const o = ti(n), a = Si(o), i = q(() => a.nodes.map((h) => h.id)), r = q(() => a.edges.map((h) => h.id)), l = vs(a, i, r), u = id(a, l, i, r), s = {};
    Object.entries(a.hooks).forEach(([h, b]) => {
      const m = `on${h.charAt(0).toUpperCase() + h.slice(1)}`;
      s[m] = b.on;
    });
    const c = {};
    Object.entries(a.hooks).forEach(([h, b]) => {
      c[h] = b.trigger;
    }), u.setState(a);
    const d = {
      ...s,
      ...l,
      ...u,
      ...Ni(a),
      emits: c,
      id: t,
      vueFlowVersion: "1.19.4",
      $destroy: () => {
        this.remove(t);
      }
    };
    return this.set(t, d), d;
  }
  getId() {
    return `vue-flow-${this.currentId++}`;
  }
}
const ve = (e) => {
  const t = tt.getInstance(), n = ia(), o = e == null ? void 0 : e.id, a = (n == null ? void 0 : n.vueFlowId) || o;
  let i, r = !1;
  if (n) {
    const l = ut(ko, null);
    typeof l < "u" && l !== null && (i = l);
  }
  if (i || a && (i = t.get(a)), !i || i && o && o !== i.id) {
    const l = o ?? t.getId();
    i = t.create(l, e), n && (r = !0);
  } else
    e && i.setState(e);
  return n && (lt(ko, i), n.vueFlowId = i.id, r && Ct(() => {
    if (i) {
      const l = t.get(i.id);
      l ? l.$destroy() : pa(`No store instance found for id ${i.id} in storage.`);
    }
  })), i;
};
function rd(e, t, n) {
  const o = Ei();
  return o.run(() => {
    [
      () => {
        o.run(() => {
          let a, i, r = !!(n.nodes.value.length || n.edges.value.length);
          a = Je([e.modelValue, () => {
            var l, u;
            return (u = (l = e.modelValue) == null ? void 0 : l.value) == null ? void 0 : u.length;
          }], ([l]) => {
            l && Array.isArray(l) && (i == null || i.pause(), n.setElements(l), !i && !r && l.length ? r = !0 : i == null || i.resume());
          }), i = Je(
            [n.nodes, n.edges, () => n.edges.value.length, () => n.nodes.value.length],
            ([l, u]) => {
              var s;
              (s = e.modelValue) != null && s.value && Array.isArray(e.modelValue.value) && (a == null || a.pause(), e.modelValue.value = [...l, ...u], Re(() => {
                a == null || a.resume();
              }));
            },
            { immediate: r }
          ), Rt(() => {
            a == null || a.stop(), i == null || i.stop();
          });
        });
      },
      () => {
        o.run(() => {
          let a, i, r = !!n.nodes.value.length;
          a = Je([e.nodes, () => {
            var l, u;
            return (u = (l = e.nodes) == null ? void 0 : l.value) == null ? void 0 : u.length;
          }], ([l]) => {
            l && Array.isArray(l) && (i == null || i.pause(), n.setNodes(l), !i && !r && l.length ? r = !0 : i == null || i.resume());
          }), i = Je(
            [n.nodes, () => n.nodes.value.length],
            ([l]) => {
              var u;
              (u = e.nodes) != null && u.value && Array.isArray(e.nodes.value) && (a == null || a.pause(), e.nodes.value = [...l], Re(() => {
                a == null || a.resume();
              }));
            },
            { immediate: r }
          ), Rt(() => {
            a == null || a.stop(), i == null || i.stop();
          });
        });
      },
      () => {
        o.run(() => {
          let a, i, r = !!n.edges.value.length;
          a = Je([e.edges, () => {
            var l, u;
            return (u = (l = e.edges) == null ? void 0 : l.value) == null ? void 0 : u.length;
          }], ([l]) => {
            l && Array.isArray(l) && (i == null || i.pause(), n.setEdges(l), !i && !r && l.length ? r = !0 : i == null || i.resume());
          }), i = Je(
            [n.edges, () => n.edges.value.length],
            ([l]) => {
              var u;
              (u = e.edges) != null && u.value && Array.isArray(e.edges.value) && (a == null || a.pause(), e.edges.value = [...l], Re(() => {
                a == null || a.resume();
              }));
            },
            { immediate: r }
          ), Rt(() => {
            a == null || a.stop(), i == null || i.stop();
          });
        });
      },
      () => {
        o.run(() => {
          ce(
            () => t.minZoom,
            () => {
              t.minZoom && se(t.minZoom) && n.setMinZoom(t.minZoom);
            }
          );
        });
      },
      () => {
        o.run(() => {
          ce(
            () => t.maxZoom,
            () => {
              t.maxZoom && se(t.maxZoom) && n.setMaxZoom(t.maxZoom);
            }
          );
        });
      },
      () => {
        o.run(() => {
          ce(
            () => t.translateExtent,
            () => {
              t.translateExtent && se(t.translateExtent) && n.setTranslateExtent(t.translateExtent);
            }
          );
        });
      },
      () => {
        o.run(() => {
          ce(
            () => t.nodeExtent,
            () => {
              t.nodeExtent && se(t.nodeExtent) && n.setNodeExtent(t.nodeExtent);
            }
          );
        });
      },
      () => {
        o.run(() => {
          ce(
            () => t.applyDefault,
            () => {
              se(t.applyDefault) && (n.applyDefault.value = t.applyDefault);
            }
          ), ce(
            n.applyDefault,
            (a, i, r) => {
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
          const a = async (i) => {
            let r = i;
            Ye(t.autoConnect) && (r = await t.autoConnect(i)), r !== !1 && n.addEdges([r]);
          };
          ce(
            () => t.autoConnect,
            () => {
              se(t.autoConnect) && (n.autoConnect.value = t.autoConnect);
            }
          ), ce(
            n.autoConnect,
            (i, r, l) => {
              i ? n.onConnect(a) : n.hooks.value.connect.off(a), l(() => {
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
        Object.keys(t).forEach((i) => {
          if (!a.includes(i)) {
            const r = O(t, i), l = n[i];
            o.run(() => {
              ce(
                r,
                (u) => {
                  se(u) && (l.value = u);
                },
                { flush: "pre" }
              );
            });
          }
        });
      }
    ].forEach((a) => a());
  }), () => o.stop();
}
function aa(e, t) {
  return {
    x: e.clientX - t.left,
    y: e.clientY - t.top
  };
}
const ld = {
  name: "Pane",
  compatConfig: { MODE: 3 }
}, ud = /* @__PURE__ */ fe({
  ...ld,
  props: {
    isSelecting: { type: Boolean }
  },
  setup(e) {
    const {
      id: t,
      vueFlowRef: n,
      getNodes: o,
      getEdges: a,
      viewport: i,
      emits: r,
      userSelectionActive: l,
      removeSelectedElements: u,
      panOnDrag: s,
      userSelectionRect: c,
      elementsSelectable: d,
      nodesSelectionActive: h,
      addSelectedElements: b,
      getSelectedEdges: m,
      getSelectedNodes: w,
      removeNodes: E,
      removeEdges: _,
      selectionMode: P,
      deleteKeyCode: G,
      multiSelectionKeyCode: y,
      multiSelectionActive: I
    } = ve(), z = ee(null), f = ee(0), x = ee(0), N = ee(), C = q(() => d.value && (e.isSelecting || l.value));
    xt(G, (A) => {
      if (!A)
        return;
      const U = o.value.reduce((V, K) => ((!K.selected && K.parentNode && V.find((ne) => ne.id === K.parentNode) || K.selected) && V.push(K), V), []);
      (U || m.value) && (m.value.length > 0 && _(m.value), U.length > 0 && E(U), h.value = !1, u());
    }), xt(y, (A) => {
      I.value = A;
    });
    function T() {
      l.value = !1, c.value = null, f.value = 0, x.value = 0;
    }
    function J(A) {
      A.target !== z.value || C.value || (r.paneClick(A), u(), h.value = !1);
    }
    function ae(A) {
      var U;
      if (A.target === z.value) {
        if (Array.isArray(s.value) && (U = s.value) != null && U.includes(2)) {
          A.preventDefault();
          return;
        }
        r.paneContextMenu(A);
      }
    }
    function p(A) {
      A.target === z.value && r.paneScroll(A);
    }
    function R(A) {
      if (N.value = n.value.getBoundingClientRect(), !C.value || !d || !e.isSelecting || A.button !== 0 || A.target !== z.value || !N.value)
        return;
      const { x: U, y: V } = aa(A, N.value);
      u(), c.value = {
        width: 0,
        height: 0,
        startX: U,
        startY: V,
        x: U,
        y: V
      }, l.value = !0, r.selectionStart(A);
    }
    function S(A) {
      if (!C.value)
        return r.paneMouseMove(A);
      if (!e.isSelecting || !N.value || !c.value)
        return;
      l.value || (l.value = !0), h.value && (h.value = !1);
      const U = aa(A, N.value), V = c.value.startX ?? 0, K = c.value.startY ?? 0, ne = {
        ...c.value,
        x: U.x < V ? U.x : V,
        y: U.y < K ? U.y : K,
        width: Math.abs(U.x - V),
        height: Math.abs(U.y - K)
      }, re = Ea(
        o.value,
        c.value,
        i.value,
        P.value === Qn.Partial
      ), M = on(re, a.value);
      f.value = re.length, x.value = M.length, c.value = ne, b([...re, ...M]);
    }
    function B(A) {
      C.value && A.button === 0 && (!l.value && c.value && A.target === z.value && J(A), h.value = f.value > 0, T(), r.selectionEnd(A));
    }
    function F(A) {
      var U;
      if (!C.value)
        return r.paneMouseLeave(A);
      l.value && (h.value = f.value > 0, (U = r.selectionEnd) == null || U.call(r, A)), T();
    }
    function j(A) {
      C.value || r.paneMouseEnter(A);
    }
    return (A, U) => (te(), ie("div", {
      ref_key: "container",
      ref: z,
      key: `pane-${k(t)}`,
      class: Ke(["vue-flow__pane vue-flow__container", { selection: e.isSelecting }]),
      onClick: J,
      onContextmenu: ae,
      onWheelPassive: p,
      onMouseenter: j,
      onMousedown: R,
      onMousemove: S,
      onMouseup: B,
      onMouseleave: F
    }, [
      xe(A.$slots, "default"),
      k(l) && k(c) ? (te(), _e(us, { key: 0 })) : ge("", !0),
      k(h) && k(w).length ? (te(), _e(rs, { key: 1 })) : ge("", !0)
    ], 34));
  }
}), sd = { class: "vue-flow__nodes vue-flow__container" }, cd = {
  name: "Nodes",
  compatConfig: { MODE: 3 }
}, dd = /* @__PURE__ */ fe({
  ...cd,
  setup(e) {
    const t = ut(an), n = ve(), o = O(n, "nodesDraggable"), a = O(n, "nodesFocusable"), i = O(n, "elementsSelectable"), r = O(n, "nodesConnectable"), l = O(n, "getNodes"), u = O(n, "getNodesInitialized"), s = O(n, "getNodeTypes"), c = O(n, "updateNodeDimensions"), d = O(n, "emits");
    let h = ee();
    be(() => l.value.length > 0 && u.value.length === l.value.length).toBe(!0).then(() => {
      Re(() => {
        d.value.nodesInitialized(u.value);
      });
    }), Ve(() => {
      h.value = new ResizeObserver((P) => {
        const G = P.map((y) => ({
          id: y.target.getAttribute("data-id"),
          nodeElement: y.target,
          forceUpdate: !0
        }));
        c.value(G);
      });
    }), jn(() => {
      var P;
      return (P = h.value) == null ? void 0 : P.disconnect();
    });
    function b(P) {
      return typeof P > "u" ? o.value : P;
    }
    function m(P) {
      return typeof P > "u" ? i.value : P;
    }
    function w(P) {
      return typeof P > "u" ? r.value : P;
    }
    function E(P) {
      return typeof P > "u" ? a.value : P;
    }
    function _(P, G) {
      const y = P || "default";
      let I = G ?? s.value[y];
      const z = tn();
      if (typeof I == "string" && z) {
        const x = Object.keys(z.appContext.components);
        x && x.includes(y) && (I = la(y, !1));
      }
      return typeof I != "string" ? I : (t == null ? void 0 : t[`node-${y}`]) || (d.value.error(new me(pe.NODE_TYPE_MISSING, I)), !1);
    }
    return (P, G) => (te(), ie("div", sd, [
      k(h) ? (te(!0), ie(Ne, { key: 0 }, st(k(l), (y) => (te(), _e(k(Tu), {
        id: y.id,
        key: y.id,
        "resize-observer": k(h),
        type: _(y.type, y.template),
        name: y.type || "default",
        draggable: b(y.draggable),
        selectable: m(y.selectable),
        connectable: w(y.connectable),
        focusable: E(y.focusable),
        node: y
      }, null, 8, ["id", "resize-observer", "type", "name", "draggable", "selectable", "connectable", "focusable", "node"]))), 128)) : ge("", !0)
    ]));
  }
}), vd = ["id", "markerWidth", "markerHeight", "markerUnits", "orient"], hd = ["stroke", "stroke-width", "fill"], fd = ["stroke", "stroke-width"], gd = {
  name: "MarkerType",
  compatConfig: { MODE: 3 }
}, pd = /* @__PURE__ */ fe({
  ...gd,
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
    return (t, n) => (te(), ie("marker", {
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
      e.type === k(An).ArrowClosed ? (te(), ie("polyline", {
        key: 0,
        stroke: e.color,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": e.strokeWidth,
        fill: e.color,
        points: "-5,-4 0,0 -5,4 -5,-4"
      }, null, 8, hd)) : ge("", !0),
      e.type === k(An).Arrow ? (te(), ie("polyline", {
        key: 1,
        stroke: e.color,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": e.strokeWidth,
        fill: "none",
        points: "-5,-4 0,0 -5,4"
      }, null, 8, fd)) : ge("", !0)
    ], 8, vd));
  }
}), md = {
  name: "MarkerDefinitions",
  compatConfig: { MODE: 3 }
}, yd = /* @__PURE__ */ fe({
  ...md,
  setup(e) {
    const t = ve(), n = O(t, "id"), o = O(t, "edges"), a = O(t, "connectionLineOptions"), i = O(t, "defaultMarkerColor"), r = q(() => {
      const l = [], u = [], s = (c) => {
        if (c) {
          const d = Ue(c, n.value);
          l.includes(d) || (typeof c == "object" ? u.push({ ...c, id: d, color: c.color || i.value }) : u.push({ id: d, color: i.value, type: c }), l.push(d));
        }
      };
      return [a.value.markerEnd, a.value.markerStart].forEach(s), o.value.reduce((c, d) => ([d.markerStart, d.markerEnd].forEach(s), c.sort((h, b) => h.id.localeCompare(b.id))), u), u;
    });
    return (l, u) => (te(), ie("defs", null, [
      (te(!0), ie(Ne, null, st(k(r), (s) => (te(), _e(pd, {
        id: s.id,
        key: s.id,
        type: s.type,
        color: s.color,
        width: s.width,
        height: s.height,
        markerUnits: s.markerUnits,
        "stroke-width": s.strokeWidth,
        orient: s.orient
      }, null, 8, ["id", "type", "color", "width", "height", "markerUnits", "stroke-width", "orient"]))), 128))
    ]));
  }
}), bd = {
  key: 0,
  class: "vue-flow__edges vue-flow__connectionline vue-flow__container"
}, wd = {
  name: "Edges",
  compatConfig: { MODE: 3 }
}, xd = /* @__PURE__ */ fe({
  ...wd,
  setup(e) {
    const t = ut(an), n = ve(), o = O(n, "connectionStartHandle"), a = O(n, "nodesConnectable"), i = O(n, "edgesUpdatable"), r = O(n, "edgesFocusable"), l = O(n, "elementsSelectable"), u = O(n, "getSelectedNodes"), s = O(n, "findNode"), c = O(n, "edges"), d = O(n, "getEdges"), h = O(n, "getNodesInitialized"), b = O(n, "getEdgeTypes"), m = O(n, "elevateEdgesOnSelect"), w = O(n, "dimensions"), E = O(n, "emits"), _ = _n(
      () => {
        var x;
        return (x = o.value) == null ? void 0 : x.nodeId;
      },
      () => {
        var x;
        return (x = o.value) != null && x.nodeId ? s.value(o.value.nodeId) : !1;
      }
    ), P = _n(
      () => {
        var x;
        return (x = o.value) == null ? void 0 : x.nodeId;
      },
      () => {
        var x, N;
        return !!(_.value && (typeof _.value.connectable > "u" ? a.value : _.value.connectable) && (x = o.value) != null && x.nodeId && (N = o.value) != null && N.type);
      }
    ), G = _n(
      [
        () => c.value.map((x) => x.zIndex),
        () => m.value ? [u.value.length] : [0],
        () => m.value ? h.value.map((x) => x.computedPosition.z) : []
      ],
      () => Sr(d.value, s.value, m.value)
    );
    function y(x) {
      return typeof x > "u" ? l.value : x;
    }
    function I(x) {
      return typeof x > "u" ? i.value : x;
    }
    function z(x) {
      return typeof x > "u" ? r.value : x;
    }
    function f(x, N) {
      const C = x || "default";
      let T = N ?? b.value[C];
      const J = tn();
      if (typeof T == "string" && J) {
        const p = Object.keys(J.appContext.components);
        p && p.includes(C) && (T = la(C, !1));
      }
      return T && typeof T != "string" ? T : (t == null ? void 0 : t[`edge-${C}`]) || (E.value.error(new me(pe.EDGE_TYPE_MISSING, T)), !1);
    }
    return (x, N) => k(w).width && k(w).height ? (te(), ie(Ne, { key: 0 }, [
      (te(!0), ie(Ne, null, st(k(G), (C) => (te(), ie("svg", {
        key: C.level,
        class: "vue-flow__edges vue-flow__container",
        style: Le(`z-index: ${C.level}`)
      }, [
        C.isMaxLevel ? (te(), _e(yd, { key: 0 })) : ge("", !0),
        de("g", null, [
          (te(!0), ie(Ne, null, st(C.edges, (T) => (te(), _e(k(Wu), {
            id: T.id,
            key: T.id,
            edge: T,
            type: f(T.type, T.template),
            name: T.type || "default",
            selectable: y(T.selectable),
            updatable: I(T.updatable),
            focusable: z(T.focusable)
          }, null, 8, ["id", "edge", "type", "name", "selectable", "updatable", "focusable"]))), 128))
        ])
      ], 4))), 128)),
      k(P) && k(_) ? (te(), ie("svg", bd, [
        ke(os, { "source-node": k(_) }, null, 8, ["source-node"])
      ])) : ge("", !0)
    ], 64)) : ge("", !0);
  }
}), _d = /* @__PURE__ */ de("div", { class: "vue-flow__edge-labels" }, null, -1), Ed = {
  name: "Transform",
  compatConfig: { MODE: 3 }
}, Sd = /* @__PURE__ */ fe({
  ...Ed,
  setup(e) {
    const { id: t, viewport: n, emits: o, d3Zoom: a, d3Selection: i, dimensions: r, ...l } = ve(), u = ee(!Zn);
    return be(() => a.value && i.value && r.value.width > 0 && r.value.height > 0).toBeTruthy().then(() => {
      o.paneReady({
        id: t,
        viewport: n,
        emits: o,
        d3Zoom: a,
        d3Selection: i,
        dimensions: r,
        ...l
      }), setTimeout(() => {
        u.value = !0;
      }, 0);
    }), (s, c) => (te(), ie("div", {
      key: `transform-${k(t)}`,
      class: "vue-flow__transformationpane vue-flow__container",
      style: Le({
        transform: `translate(${k(n).x}px,${k(n).y}px) scale(${k(n).zoom})`,
        opacity: k(u) ? void 0 : 0
      })
    }, [
      ke(xd),
      _d,
      ke(dd),
      xe(s.$slots, "default")
    ], 4));
  }
}), Nd = {
  name: "Viewport",
  compatConfig: { MODE: 3 }
}, kd = /* @__PURE__ */ fe({
  ...Nd,
  setup(e) {
    const {
      id: t,
      minZoom: n,
      maxZoom: o,
      defaultViewport: a,
      translateExtent: i,
      dimensions: r,
      zoomActivationKeyCode: l,
      selectionKeyCode: u,
      panActivationKeyCode: s,
      panOnScroll: c,
      panOnScrollMode: d,
      panOnScrollSpeed: h,
      panOnDrag: b,
      zoomOnDoubleClick: m,
      zoomOnPinch: w,
      zoomOnScroll: E,
      preventScrolling: _,
      noWheelClassName: P,
      noPanClassName: G,
      emits: y,
      connectionStartHandle: I,
      userSelectionActive: z,
      paneDragging: f,
      d3Zoom: x,
      d3Selection: N,
      d3ZoomHandler: C,
      viewport: T,
      viewportRef: J
    } = ve(), ae = ee(), p = ee(!1), R = ee(!1);
    let S = !1, B = 0, F = {
      x: 0,
      y: 0,
      zoom: 0
    };
    const j = xt(s), A = q(() => !p.value && b.value && j.value), U = q(
      () => u.value !== !0 && p.value || u.value === !0 && !A.value
    );
    Ve(() => {
      er(ae, re);
      const v = qn();
      Wn(v, "resize", re);
    }), Ve(() => {
      const v = ae.value, g = v.getBoundingClientRect(), $ = nd().scaleExtent([n.value, o.value]).translateExtent(i.value), D = Ee(v).call($), L = D.on("wheel.zoom"), Y = gt.translate(a.value.x ?? 0, a.value.y ?? 0).scale(We(a.value.zoom ?? 1, n.value, o.value)), W = [
        [0, 0],
        [g.width, g.height]
      ], Q = $.constrain()(Y, W, i.value);
      $.transform(D, Q), x.value = $, N.value = D, C.value = L, T.value = { x: Q.x, y: Q.y, zoom: Q.k }, J.value = v, xt(u, (X) => {
        p.value = X;
      });
      const oe = xt(l);
      uo(() => {
        p.value && z.value && !R.value ? $.on("zoom", null) : !p.value && !z.value && $.on("zoom", (X) => {
          T.value = { x: X.transform.x, y: X.transform.y, zoom: X.transform.k };
          const he = ne(X.transform);
          S = V(b.value, B ?? 0), y.viewportChange(he), y.move({ event: X, flowTransform: he });
        });
      }), $.on("start", (X) => {
        var he;
        if (!X.sourceEvent)
          return null;
        B = X.sourceEvent.button, R.value = !0;
        const Te = ne(X.transform);
        ((he = X.sourceEvent) == null ? void 0 : he.type) === "mousedown" && (f.value = !0), F = Te, y.viewportChangeStart(Te), y.moveStart({ event: X, flowTransform: Te });
      }), $.on("end", (X) => {
        if (!X.sourceEvent)
          return null;
        if (R.value = !1, f.value = !1, V(b.value, B ?? 0) && !S && y.paneContextMenu(X.sourceEvent), S = !1, K(F, X.transform)) {
          const he = ne(X.transform);
          F = he, y.viewportChangeEnd(he), y.moveEnd({ event: X, flowTransform: he });
        }
      }), uo(() => {
        c.value && !oe.value && !z.value ? D.on(
          "wheel.zoom",
          (X) => {
            if (M(X, P.value))
              return !1;
            X.preventDefault(), X.stopImmediatePropagation();
            const he = D.property("__zoom").k || 1;
            if (X.ctrlKey && w.value) {
              const xn = Me(X), mi = -X.deltaY * (X.deltaMode === 1 ? 0.05 : X.deltaMode ? 1 : 2e-3) * 10, yi = he * 2 ** mi;
              $.scaleTo(D, yi, xn);
              return;
            }
            const Te = X.deltaMode === 1 ? 20 : 1, It = d.value === Ut.Vertical ? 0 : X.deltaX * Te, wn = d.value === Ut.Horizontal ? 0 : X.deltaY * Te;
            $.translateBy(
              D,
              -(It / he) * h.value,
              -(wn / he) * h.value
            );
          },
          { passive: !1 }
        ) : typeof L < "u" && D.on(
          "wheel.zoom",
          function(X, he) {
            if (!_.value || M(X, P.value))
              return null;
            X.preventDefault(), L.call(this, X, he);
          },
          { passive: !1 }
        );
      }), $.filter((X) => {
        var he, Te;
        const It = oe.value || E.value, wn = w.value && X.ctrlKey;
        if (X.button === 1 && X.type === "mousedown" && ((he = X.target) != null && he.closest(".vue-flow__node") || (Te = X.target) != null && Te.closest(".vue-flow__edge")))
          return !0;
        if (!b.value && !It && !c.value && !m.value && !w.value || z.value || !m.value && X.type === "dblclick" || M(X, P.value) && X.type === "wheel" || M(X, G.value) && X.type !== "wheel" || !w.value && X.ctrlKey && X.type === "wheel" || !It && !c.value && !wn && X.type === "wheel" || !b.value && (X.type === "mousedown" || X.type === "touchstart") || Array.isArray(b.value) && !b.value.includes(X.button) && (X.type === "mousedown" || X.type === "touchstart"))
          return !1;
        const xn = Array.isArray(b.value) && b.value.includes(X.button) || !X.button || X.button <= 1;
        return (!X.ctrlKey || X.type === "wheel") && xn;
      });
    });
    function V(v, g) {
      return g === 2 && Array.isArray(v) && v.includes(2);
    }
    function K(v, g) {
      return v.x !== g.x && !isNaN(g.x) || v.y !== g.y && !isNaN(g.y) || v.zoom !== g.k && !isNaN(g.k);
    }
    function ne(v) {
      return {
        x: v.x,
        y: v.y,
        zoom: v.k
      };
    }
    function re() {
      if (!ae.value)
        return;
      const { width: v, height: g } = nn(ae.value);
      (v === 0 || g === 0) && y.error(new me(pe.MISSING_VIEWPORT_DIMENSIONS)), r.value.width = v || 500, r.value.height = g || 500;
    }
    function M(v, g) {
      return v.target.closest(`.${g}`);
    }
    return (v, g) => (te(), ie(Ne, null, [
      (te(), ie("div", {
        ref_key: "viewportEl",
        ref: ae,
        key: `viewport-${k(t)}`,
        class: "vue-flow__viewport vue-flow__container"
      }, [
        ke(ud, {
          "is-selecting": k(U),
          class: Ke({ connecting: !!k(I), dragging: k(f), draggable: !!k(b) })
        }, {
          default: Pe(() => [
            ke(Sd, null, {
              default: Pe(() => [
                xe(v.$slots, "zoom-pane")
              ]),
              _: 3
            })
          ]),
          _: 3
        }, 8, ["is-selecting", "class"])
      ])),
      xe(v.$slots, "default")
    ], 64));
  }
}), Cd = ["id"], Md = ["id"], Pd = ["id"], Id = {
  name: "A11yDescriptions",
  compatConfig: { MODE: 3 }
}, $d = /* @__PURE__ */ fe({
  ...Id,
  setup(e) {
    const { id: t, disableKeyboardA11y: n, ariaLiveMessage: o } = ve(), a = {
      position: "absolute",
      width: 1,
      height: 1,
      margin: -1,
      border: 0,
      padding: 0,
      overflow: "hidden",
      clip: "rect(0px, 0px, 0px, 0px)",
      clipPath: "inset(100%)"
    };
    return (i, r) => (te(), ie(Ne, null, [
      de("div", {
        id: `${k(ja)}-${k(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select a node. " + ct(k(n) ? "" : "You can then use the arrow keys to move the node around.") + " You can then use the arrow keys to move the node around, press delete to remove it and press escape to cancel. ", 9, Cd),
      de("div", {
        id: `${k(Za)}-${k(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel. ", 8, Md),
      k(n) ? ge("", !0) : (te(), ie("div", {
        key: 0,
        id: `${k(Mu)}-${k(t)}`,
        "aria-live": "assertive",
        "aria-atomic": "true",
        style: a
      }, ct(k(o)), 9, Pd))
    ], 64));
  }
}), Td = {
  name: "VueFlow",
  compatConfig: { MODE: 3 }
}, Od = /* @__PURE__ */ fe({
  ...Td,
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
    connectionLineOptions: { default: void 0 },
    connectionRadius: null,
    isValidConnection: { type: [Function, null], default: void 0 },
    deleteKeyCode: null,
    selectionKeyCode: null,
    multiSelectionKeyCode: null,
    zoomActivationKeyCode: null,
    panActivationKeyCode: null,
    snapToGrid: { type: Boolean, default: void 0 },
    snapGrid: null,
    onlyRenderVisibleElements: { type: Boolean, default: void 0 },
    edgesUpdatable: { type: [Boolean, String], default: void 0 },
    nodesDraggable: { type: Boolean, default: void 0 },
    nodesConnectable: { type: Boolean, default: void 0 },
    elementsSelectable: { type: Boolean, default: void 0 },
    selectNodesOnDrag: { type: Boolean, default: void 0 },
    panOnDrag: { type: [Boolean, Array], default: void 0 },
    minZoom: null,
    maxZoom: null,
    defaultViewport: null,
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
    selectionMode: null,
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
    elevateNodesOnSelect: { type: Boolean, default: void 0 },
    disableKeyboardA11y: { type: Boolean, default: void 0 },
    edgesFocusable: { type: Boolean, default: void 0 },
    nodesFocusable: { type: Boolean, default: void 0 },
    autoPanOnConnect: { type: Boolean, default: void 0 },
    autoPanOnNodeDrag: { type: Boolean, default: void 0 },
    __experimentalFeatures: null
  },
  emits: ["nodesChange", "edgesChange", "nodeDoubleClick", "nodeClick", "nodeMouseEnter", "nodeMouseMove", "nodeMouseLeave", "nodeContextMenu", "nodeDragStart", "nodeDrag", "nodeDragStop", "nodesInitialized", "miniMapNodeClick", "miniMapNodeDoubleClick", "miniMapNodeMouseEnter", "miniMapNodeMouseMove", "miniMapNodeMouseLeave", "connect", "connectStart", "connectEnd", "clickConnectStart", "clickConnectEnd", "moveStart", "move", "moveEnd", "selectionDragStart", "selectionDrag", "selectionDragStop", "selectionContextMenu", "selectionStart", "selectionEnd", "viewportChangeStart", "viewportChange", "viewportChangeEnd", "paneReady", "paneScroll", "paneClick", "paneContextMenu", "paneMouseEnter", "paneMouseMove", "paneMouseLeave", "edgeContextMenu", "edgeMouseEnter", "edgeMouseMove", "edgeMouseLeave", "edgeDoubleClick", "edgeClick", "edgeUpdateStart", "edgeUpdate", "edgeUpdateEnd", "updateNodeInternals", "error", "update:modelValue", "update:nodes", "update:edges"],
  setup(e, { expose: t, emit: n }) {
    const o = e, a = wt(o, "modelValue", n), i = wt(o, "nodes", n), r = wt(o, "edges", n), { vueFlowRef: l, hooks: u, getNodeTypes: s, getEdgeTypes: c, ...d } = ve(o), h = rd({ modelValue: a, nodes: i, edges: r }, o, {
      vueFlowRef: l,
      hooks: u,
      getNodeTypes: s,
      getEdgeTypes: c,
      ...d
    });
    ur(n, u);
    const b = ee();
    return lt(an, wi()), xi(() => {
      h();
    }), Ve(() => {
      l.value = b.value;
    }), t({
      vueFlowRef: l,
      hooks: u,
      getNodeTypes: s,
      getEdgeTypes: c,
      ...d
    }), (m, w) => (te(), ie("div", {
      ref_key: "el",
      ref: b,
      class: "vue-flow"
    }, [
      ke(kd, null, {
        nodes: Pe(() => [
          (te(!0), ie(Ne, null, st(Object.keys(k(s)), (E) => xe(m.$slots, `node-${E}`)), 256))
        ]),
        edges: Pe(() => [
          (te(!0), ie(Ne, null, st(Object.keys(k(c)), (E) => xe(m.$slots, `edge-${E}`)), 256))
        ]),
        "connection-name": Pe(() => [
          xe(m.$slots, "connection-line")
        ]),
        "zoom-pane": Pe(() => [
          xe(m.$slots, "zoom-pane")
        ]),
        default: Pe(() => [
          xe(m.$slots, "default")
        ]),
        _: 3
      }),
      ke($d)
    ], 512));
  }
}), Dd = {
  key: 0,
  class: "label-input-wrapper"
}, Bd = /* @__PURE__ */ fe({
  __name: "EditableNode",
  props: {
    id: {},
    label: {},
    sourcePosition: {},
    targetPosition: {},
    data: {},
    type: {},
    selected: { type: Boolean },
    connectable: { type: [Boolean, String, Function] },
    position: {},
    dimensions: {},
    isValidTargetPos: { type: Function },
    isValidSourcePos: { type: Function },
    parent: {},
    dragging: { type: Boolean },
    resizing: { type: Boolean },
    zIndex: {},
    dragHandle: {},
    events: {}
  },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = e, o = t, a = {
      top: Z.Top,
      right: Z.Right,
      bottom: Z.Bottom,
      left: Z.Left
    }, i = q(() => a[n.sourcePosition]), r = q(() => a[n.targetPosition]), l = ee(), u = ee(""), s = ee(!1);
    let c = 0;
    const d = () => {
      let m = Date.now();
      m - c < 500 && !s.value && h(), c = m;
    }, h = async () => {
      u.value = n.label, s.value = !0, await Re(), l.value.focus();
    }, b = () => {
      s.value = !1, o("change", u.value);
    };
    return (m, w) => (te(), ie("div", {
      onClick: w[2] || (w[2] = (E) => d())
    }, [
      de("div", null, ct(n.label), 1),
      s.value ? (te(), ie("div", Dd, [
        sa(de("input", {
          ref_key: "labelInput",
          ref: l,
          class: "label-input",
          "onUpdate:modelValue": w[0] || (w[0] = (E) => u.value = E),
          onBlur: w[1] || (w[1] = (E) => s.value = !1),
          onKeypress: ca(b, ["enter"])
        }, null, 544), [
          [da, u.value]
        ])
      ])) : ge("", !0),
      n.data.hasInput ? (te(), _e(k(vt), {
        key: 1,
        id: "a",
        type: "target",
        position: r.value
      }, null, 8, ["position"])) : ge("", !0),
      n.data.hasOutput ? (te(), _e(k(vt), {
        key: 2,
        id: "b",
        type: "source",
        position: i.value
      }, null, 8, ["position"])) : ge("", !0)
    ]));
  }
}), Ad = ["id", "d", "marker-end"], zd = { class: "vue-flow__edge-label" }, Rd = {
  key: 0,
  class: "label-input-wrapper"
}, Vd = {
  inheritAttrs: !1
}, Ld = /* @__PURE__ */ fe({
  ...Vd,
  __name: "EditableEdge",
  props: {
    id: {},
    sourceX: {},
    sourceY: {},
    targetX: {},
    targetY: {},
    sourcePosition: {},
    targetPosition: {},
    data: {},
    markerEnd: {},
    style: {},
    label: {},
    sourceNode: {},
    targetNode: {},
    source: {},
    target: {},
    type: {},
    selected: { type: Boolean },
    sourceHandleId: {},
    targetHandleId: {},
    animated: { type: Boolean },
    updatable: { type: Boolean },
    markerStart: {},
    curvature: {},
    interactionWidth: {},
    events: {},
    labelStyle: {},
    labelShowBg: { type: Boolean },
    labelBgStyle: {},
    labelBgPadding: {},
    labelBgBorderRadius: {}
  },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = e;
    ve();
    const o = t, a = ee(), i = ee(""), r = ee(!1);
    let l = 0;
    const u = () => {
      let h = Date.now();
      h - l < 500 && !r.value && s(), l = h;
    }, s = async () => {
      i.value = n.label, r.value = !0, await Re(), a.value.focus();
    }, c = () => {
      r.value = !1, o("change", i.value);
    }, d = q(() => Kt(n));
    return (h, b) => (te(), ie(Ne, null, [
      de("path", {
        id: h.id,
        style: Le(h.style),
        class: "vue-flow__edge-path",
        d: d.value[0],
        "marker-end": h.markerEnd
      }, null, 12, Ad),
      ke(k(Ju), null, {
        default: Pe(() => [
          de("div", {
            style: Le({
              pointerEvents: "all",
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${d.value[1]}px,${d.value[2]}px)`
            }),
            class: "nodrag nopan editable-edge-label",
            onClick: b[2] || (b[2] = (m) => u())
          }, [
            de("div", zd, ct(n.label), 1),
            r.value ? (te(), ie("div", Rd, [
              sa(de("input", {
                ref_key: "labelInput",
                ref: a,
                class: "label-input",
                "onUpdate:modelValue": b[0] || (b[0] = (m) => i.value = m),
                onBlur: b[1] || (b[1] = (m) => r.value = !1),
                onKeypress: ca(c, ["enter"])
              }, null, 544), [
                [da, i.value]
              ])
            ])) : ge("", !0)
          ], 4)
        ]),
        _: 1
      })
    ], 64));
  }
}), Yd = { class: "chart-controls" }, Xd = { class: "chart-controls-left" }, Gd = /* @__PURE__ */ de("b", null, "Selected Node:", -1), Hd = { class: "chart-controls-right" }, Fd = { key: 0 }, Ud = { key: 1 }, pi = /* @__PURE__ */ fe({
  __name: "NodeEditor",
  props: {
    modelValue: {},
    nodeContainerClass: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = t, a = ee(""), i = ee({}), r = ee(!1);
    ee({
      x: 0,
      y: 0
    });
    const l = ee(""), u = ee([]), s = q(() => {
      for (let f = 0; f < u.value.length; f++)
        if (u.value[f].id == l.value)
          return f;
      return -1;
    }), c = q({
      get: () => {
        let f = n.modelValue;
        n.nodeContainerClass ? a.value = n.nodeContainerClass : a.value = "defaultContainerClass";
        for (let x = 0; x < f.length; x++)
          f[x].data = {}, f[x].type == "input" ? (f[x].data.hasInput = !1, f[x].data.hasOutput = !0) : f[x].type == "output" ? (f[x].data.hasInput = !0, f[x].data.hasOutput = !1) : (f[x].data.hasInput = !0, f[x].data.hasOutput = !0), f[x].class = "vue-flow__node-default", f[x].type = "editable";
        for (let x = 0; x < f.length; x++) {
          let N = f[x].id;
          f[x], f[x].events = {
            click: () => {
              l.value = N;
            }
          };
        }
        return f;
      },
      set: (f) => {
        o("update:modelValue", JSON.parse(JSON.stringify(f)));
      }
    }), { getNodes: d, onPaneReady: h } = ve({});
    h((f) => {
      i.value = f;
    }), u.value = c.value, Ve(() => {
      document.removeEventListener("keypress", _), document.addEventListener("keypress", _);
    }), jn(() => {
      document.removeEventListener("keypress", _);
    });
    const b = (f) => ({
      top: "right",
      right: "bottom",
      bottom: "left",
      left: "top"
    })[f], m = () => {
      s.value > -1 && (u.value[s.value].sourcePosition = b(
        u.value[s.value].sourcePosition
      ));
    }, w = () => {
      s.value > -1 && (u.value[s.value].targetPosition = b(
        u.value[s.value].targetPosition
      ));
    }, E = (f) => {
      window.scrollBy(0, f.deltaY);
    }, _ = (f) => {
      r.value && f.ctrlKey == !0 && ((f.key == "+" || f.key == "=") && i.value.zoomIn(), f.key == "-" && i.value.zoomOut());
    }, P = () => {
      i.value.fitView();
    }, G = () => {
      let f = { x: Math.random() * 200, y: Math.random() * 200 }, x = !1;
      if (s.value > -1) {
        const T = u.value[s.value];
        T.data.hasOutput && (f = { x: T.position.x + 200, y: T.position.y + 50 }, x = !0);
      }
      let N = u.value.length, C = `node-${N}`;
      if (u.value.push({
        id: C,
        label: "Node " + N,
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
            l.value = C;
          }
        },
        // position: { x: Math.random() * vueFlowInstance.value.dimensions.width, y: Math.random() * vueFlowInstance.value.dimensions.height }
        position: f
      }), x) {
        let T = `edge-${N + 1}`;
        u.value.push({
          id: T,
          source: l.value,
          target: C,
          type: "editable",
          label: `EDGE ${N + 1}`,
          animated: !0,
          events: {
            click: () => {
              l.value = T;
            }
          }
        });
      }
    }, y = (f) => {
      console.log("edge connect", f);
    }, I = (f) => {
      console.log("edge double click", f);
    }, z = (f, x) => {
      for (let N = 0; N < u.value.length; N++)
        if (u.value[N].id == x) {
          u.value[N].label = f;
          break;
        }
    };
    return (f, x) => (te(), ie("div", {
      class: Ke(["node-editor-wrapper", a.value]),
      onMouseover: x[8] || (x[8] = (N) => r.value = !0),
      onMouseleave: x[9] || (x[9] = (N) => r.value = !1)
    }, [
      de("div", Yd, [
        de("div", Xd, [
          de("div", null, [
            Gd,
            ua(" " + ct(l.value ? l.value : "none"), 1)
          ])
        ]),
        de("div", Hd, [
          de("div", null, [
            de("button", {
              class: "button-default",
              onClick: x[0] || (x[0] = (N) => G())
            }, "Add Node")
          ]),
          de("div", null, [
            de("button", {
              class: "button-default",
              onClick: x[1] || (x[1] = (N) => P())
            }, "Center")
          ]),
          s.value > -1 ? (te(), ie("div", Fd, [
            de("button", {
              class: "button-default",
              onClick: x[2] || (x[2] = (N) => w())
            }, "Shift Input Position")
          ])) : ge("", !0),
          s.value > -1 ? (te(), ie("div", Ud, [
            de("button", {
              class: "button-default",
              onClick: x[3] || (x[3] = (N) => m())
            }, "Shift Output Position")
          ])) : ge("", !0)
        ])
      ]),
      u.value && u.value.length ? (te(), _e(k(Od), {
        key: 0,
        onWheel: x[4] || (x[4] = Ii((N) => E(N), ["prevent"])),
        class: "nowheel",
        "prevent-scrolling": !0,
        "zoom-on-scroll": !1,
        "fit-view-on-init": !0,
        modelValue: u.value,
        "onUpdate:modelValue": x[5] || (x[5] = (N) => u.value = N),
        onConnect: x[6] || (x[6] = (N) => y(N)),
        onEdgeDoubleClick: x[7] || (x[7] = (N) => I(N))
      }, {
        "node-editable": Pe((N) => [
          ke(Bd, Ht(N, {
            onChange: (C) => z(C, N.id)
          }), null, 16, ["onChange"])
        ]),
        "edge-editable": Pe((N) => [
          ke(Ld, Ht(N, {
            onChange: (C) => z(C, N.id)
          }), null, 16, ["onChange"])
        ]),
        _: 1
      }, 8, ["modelValue"])) : ge("", !0)
    ], 34));
  }
}), jd = /* @__PURE__ */ fe({
  __name: "StateEditor",
  props: ["layout", "nodeContainerClass", "modelValue"],
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = t, a = q({
      get: () => {
        let r = n.modelValue, l = {}, u = {}, s = 0, c = [];
        for (let d in r) {
          c.length;
          let h = {
            id: d,
            label: d,
            position: n.layout[d] && n.layout[d].position ? n.layout[d].position : { x: 200 * s, y: 100 },
            targetPosition: n.layout[d] && n.layout[d].targetPosition ? n.layout[d].targetPosition : "left",
            sourcePosition: n.layout[d] && n.layout[d].sourcePosition ? n.layout[d].sourcePosition : "right"
          };
          r[d].type && r[d].type == "final" && (h.type = "output", h.class = "default-output-node"), l[d] = h;
          let b = r[d].on;
          for (let m in r[d].on) {
            let w = b[m];
            typeof w == "object" && w.constructor === Object && (w = w.target), c.push({
              id: `${d}-${b[m]}-${m}`,
              target: w,
              source: d,
              label: m,
              animated: !0
            }), u[w] = !0;
          }
          s++;
        }
        for (let d in l)
          u[d] || (l[d].type = "input", l[d].class = "default-input-node"), c.push(l[d]);
        return c;
      },
      set: (r) => {
        i(r);
      }
    }), i = (r) => {
      let l = {}, u = {}, s = {};
      for (let c = 0; c < r.length; c++) {
        let d = r[c];
        d.type == "input" ? l[d.label] = {
          on: {}
        } : d.type == "output" ? l[d.label] = {
          type: "final"
        } : d.source && d.target ? (u[d.source] = u[d.source] || {}, u[d.source][d.label] = {
          target: d.target
        }) : l[d.label] = {
          on: {}
        }, s[d.id] = d.label;
      }
      for (let c in u) {
        let d = s[c];
        for (let h in u[c])
          l[d].on[h] = u[c][h];
      }
      o("update:modelValue", l);
    };
    return (r, l) => (te(), ie("div", null, [
      ke(pi, {
        modelValue: a.value,
        "onUpdate:modelValue": l[0] || (l[0] = (u) => a.value = u),
        "node-container-class": e.nodeContainerClass
      }, null, 8, ["modelValue", "node-container-class"])
    ]));
  }
});
function Kd(e) {
  e.component("NodeEditor", pi), e.component("StateEditor", jd);
}
export {
  pi as NodeEditor,
  jd as StateEditor,
  Kd as install
};
//# sourceMappingURL=node-editor.js.map
