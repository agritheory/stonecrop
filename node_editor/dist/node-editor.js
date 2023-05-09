import { defineComponent as ve, toRef as k, ref as J, computed as Q, openBlock as oe, createElementBlock as ie, unref as M, normalizeClass as Ue, renderSlot as we, provide as it, onMounted as ze, onBeforeUnmount as Gn, watch as se, h as le, createBlock as xe, Teleport as mi, getCurrentScope as na, inject as rt, useSlots as yi, onUnmounted as bi, createVNode as Ne, withCtx as Pe, Fragment as Se, renderList as lt, onScopeDispose as At, getCurrentInstance as Jt, onBeforeMount as wi, nextTick as Ae, reactive as xi, toRefs as _i, effectScope as Ei, watchEffect as io, createElementVNode as ce, toDisplayString as ut, createCommentVNode as fe, markRaw as et, normalizeStyle as Re, readonly as Si, isRef as oa, customRef as Ni, resolveDynamicComponent as aa, normalizeProps as ki, mergeProps as Xt, resolveComponent as ia, createTextVNode as ra, withDirectives as la, withKeys as ua, vModelText as sa, withModifiers as Mi } from "vue";
var ro;
const jn = typeof window < "u", Pi = (e) => typeof e < "u", Ci = (e) => typeof e == "boolean", Ve = (e) => typeof e == "function", Te = (e) => typeof e == "number", De = (e) => typeof e == "string", Ii = () => {
};
jn && (ro = window == null ? void 0 : window.navigator) != null && ro.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function re(e) {
  return typeof e == "function" ? e() : M(e);
}
function Oi(e, t) {
  function n(...o) {
    return new Promise((a, i) => {
      Promise.resolve(e(() => t.apply(this, o), { fn: t, thisArg: this, args: o })).then(a).catch(i);
    });
  }
  return n;
}
const ca = (e) => e();
function $i(e = ca) {
  const t = J(!0);
  function n() {
    t.value = !1;
  }
  function o() {
    t.value = !0;
  }
  const a = (...i) => {
    t.value && e(...i);
  };
  return { isActive: Si(t), pause: n, resume: o, eventFilter: a };
}
function lo(e, t = !1, n = "Timeout") {
  return new Promise((o, a) => {
    setTimeout(t ? () => a(n) : o, e);
  });
}
function Ti(e) {
  return e;
}
function bn(e, t) {
  let n, o, a;
  const i = J(!0), r = () => {
    i.value = !0, a();
  };
  se(e, r, { flush: "sync" });
  const l = Ve(t) ? t : t.get, u = Ve(t) ? void 0 : t.set, c = Ni((s, d) => (o = s, a = d, {
    get() {
      return i.value && (n = l(), i.value = !1), o(), n;
    },
    set(v) {
      u == null || u(v);
    }
  }));
  return Object.isExtensible(c) && (c.trigger = r), c;
}
function Nt(e) {
  return na() ? (At(e), !0) : !1;
}
function Di(e, t = !0) {
  Jt() ? ze(e) : t ? e() : Ae(e);
}
function On(e, t = !1) {
  function n(d, { flush: v = "sync", deep: b = !1, timeout: g, throwOnTimeout: w } = {}) {
    let E = null;
    const _ = [new Promise(($) => {
      E = se(e, (Y) => {
        d(Y) !== t && (E == null || E(), $(Y));
      }, {
        flush: v,
        deep: b,
        immediate: !0
      });
    })];
    return g != null && _.push(lo(g, w).then(() => re(e)).finally(() => E == null ? void 0 : E())), Promise.race(_);
  }
  function o(d, v) {
    if (!oa(d))
      return n((Y) => Y === d, v);
    const { flush: b = "sync", deep: g = !1, timeout: w, throwOnTimeout: E } = v ?? {};
    let _ = null;
    const $ = [new Promise((Y) => {
      _ = se([e, d], ([m, O]) => {
        t !== (m === O) && (_ == null || _(), Y(m));
      }, {
        flush: b,
        deep: g,
        immediate: !0
      });
    })];
    return w != null && $.push(lo(w, E).then(() => re(e)).finally(() => (_ == null || _(), re(e)))), Promise.race($);
  }
  function a(d) {
    return n((v) => !!v, d);
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
  function u(d, v) {
    return n((b) => {
      const g = Array.from(b);
      return g.includes(d) || g.includes(re(d));
    }, v);
  }
  function c(d) {
    return s(1, d);
  }
  function s(d = 1, v) {
    let b = -1;
    return n(() => (b += 1, b >= d), v);
  }
  return Array.isArray(re(e)) ? {
    toMatch: n,
    toContains: u,
    changed: c,
    changedTimes: s,
    get not() {
      return On(e, !t);
    }
  } : {
    toMatch: n,
    toBe: o,
    toBeTruthy: a,
    toBeNull: i,
    toBeNaN: l,
    toBeUndefined: r,
    changed: c,
    changedTimes: s,
    get not() {
      return On(e, !t);
    }
  };
}
function ye(e) {
  return On(e);
}
var uo = Object.getOwnPropertySymbols, Bi = Object.prototype.hasOwnProperty, Ai = Object.prototype.propertyIsEnumerable, zi = (e, t) => {
  var n = {};
  for (var o in e)
    Bi.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && uo)
    for (var o of uo(e))
      t.indexOf(o) < 0 && Ai.call(e, o) && (n[o] = e[o]);
  return n;
};
function Ri(e, t, n = {}) {
  const o = n, {
    eventFilter: a = ca
  } = o, i = zi(o, [
    "eventFilter"
  ]);
  return se(e, Oi(a, t), i);
}
var Vi = Object.defineProperty, Li = Object.defineProperties, Fi = Object.getOwnPropertyDescriptors, Yt = Object.getOwnPropertySymbols, da = Object.prototype.hasOwnProperty, va = Object.prototype.propertyIsEnumerable, so = (e, t, n) => t in e ? Vi(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Xi = (e, t) => {
  for (var n in t || (t = {}))
    da.call(t, n) && so(e, n, t[n]);
  if (Yt)
    for (var n of Yt(t))
      va.call(t, n) && so(e, n, t[n]);
  return e;
}, Yi = (e, t) => Li(e, Fi(t)), Gi = (e, t) => {
  var n = {};
  for (var o in e)
    da.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && Yt)
    for (var o of Yt(e))
      t.indexOf(o) < 0 && va.call(e, o) && (n[o] = e[o]);
  return n;
};
function qe(e, t, n = {}) {
  const o = n, {
    eventFilter: a
  } = o, i = Gi(o, [
    "eventFilter"
  ]), { eventFilter: r, pause: l, resume: u, isActive: c } = $i(a);
  return { stop: Ri(e, t, Yi(Xi({}, i), {
    eventFilter: r
  })), pause: l, resume: u, isActive: c };
}
function fa(e) {
  var t;
  const n = re(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const Hn = jn ? window : void 0;
function Un(...e) {
  let t, n, o, a;
  if (De(e[0]) || Array.isArray(e[0]) ? ([n, o, a] = e, t = Hn) : [t, n, o, a] = e, !t)
    return Ii;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const i = [], r = () => {
    i.forEach((s) => s()), i.length = 0;
  }, l = (s, d, v, b) => (s.addEventListener(d, v, b), () => s.removeEventListener(d, v, b)), u = se(() => [fa(t), re(a)], ([s, d]) => {
    r(), s && i.push(...n.flatMap((v) => o.map((b) => l(s, v, b, d))));
  }, { immediate: !0, flush: "post" }), c = () => {
    u(), r();
  };
  return Nt(c), c;
}
const ji = (e) => typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
function co(...e) {
  let t, n, o = {};
  e.length === 3 ? (t = e[0], n = e[1], o = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], o = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
  const { target: a = Hn, eventName: i = "keydown", passive: r = !1 } = o, l = ji(t);
  return Un(a, i, (u) => {
    l(u) && n(u);
  }, r);
}
function Hi(e, t = !1) {
  const n = J(), o = () => n.value = !!e();
  return o(), Di(o, t), n;
}
function Ui(e) {
  return JSON.parse(JSON.stringify(e));
}
const vo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, fo = "__vueuse_ssr_handlers__";
vo[fo] = vo[fo] || {};
var ho = Object.getOwnPropertySymbols, Ki = Object.prototype.hasOwnProperty, Wi = Object.prototype.propertyIsEnumerable, Zi = (e, t) => {
  var n = {};
  for (var o in e)
    Ki.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && ho)
    for (var o of ho(e))
      t.indexOf(o) < 0 && Wi.call(e, o) && (n[o] = e[o]);
  return n;
};
function qi(e, t, n = {}) {
  const o = n, { window: a = Hn } = o, i = Zi(o, ["window"]);
  let r;
  const l = Hi(() => a && "ResizeObserver" in a), u = () => {
    r && (r.disconnect(), r = void 0);
  }, c = se(() => fa(e), (d) => {
    u(), l.value && a && d && (r = new ResizeObserver(t), r.observe(d, i));
  }, { immediate: !0, flush: "post" }), s = () => {
    u(), c();
  };
  return Nt(s), {
    isSupported: l,
    stop: s
  };
}
var go;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(go || (go = {}));
var Qi = Object.defineProperty, po = Object.getOwnPropertySymbols, Ji = Object.prototype.hasOwnProperty, er = Object.prototype.propertyIsEnumerable, mo = (e, t, n) => t in e ? Qi(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, tr = (e, t) => {
  for (var n in t || (t = {}))
    Ji.call(t, n) && mo(e, n, t[n]);
  if (po)
    for (var n of po(t))
      er.call(t, n) && mo(e, n, t[n]);
  return e;
};
const nr = {
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
tr({
  linear: Ti
}, nr);
function yt(e, t, n, o = {}) {
  var a, i, r;
  const {
    clone: l = !1,
    passive: u = !1,
    eventName: c,
    deep: s = !1,
    defaultValue: d
  } = o, v = Jt(), b = n || (v == null ? void 0 : v.emit) || ((a = v == null ? void 0 : v.$emit) == null ? void 0 : a.bind(v)) || ((r = (i = v == null ? void 0 : v.proxy) == null ? void 0 : i.$emit) == null ? void 0 : r.bind(v == null ? void 0 : v.proxy));
  let g = c;
  t || (t = "modelValue"), g = c || g || `update:${t.toString()}`;
  const w = (_) => l ? Ve(l) ? l(_) : Ui(_) : _, E = () => Pi(e[t]) ? w(e[t]) : d;
  if (u) {
    const _ = E(), $ = J(_);
    return se(() => e[t], (Y) => $.value = w(Y)), se($, (Y) => {
      (Y !== e[t] || s) && b(g, Y);
    }, { deep: s }), $;
  } else
    return Q({
      get() {
        return E();
      },
      set(_) {
        b(g, _);
      }
    });
}
function j(e = () => {
}) {
  const t = J(/* @__PURE__ */ new Set());
  e && t.value.add(e);
  const n = (o) => {
    t.value.delete(o);
  };
  return {
    on: (o) => {
      t.value.has(e) && t.value.delete(e), t.value.add(o);
      const a = () => n(o);
      return Nt(a), {
        off: a
      };
    },
    off: n,
    trigger: (o) => Promise.all(Array.from(t.value).map((a) => a(o))),
    fns: t
  };
}
const or = ["production", "prod"];
function ha(e, ...t) {
  or.includes(process.env.NODE_ENV || "") || console.warn(`[Vue Flow]: ${e}`, ...t);
}
function ar() {
  return {
    edgesChange: j(),
    nodesChange: j(),
    nodeDoubleClick: j(),
    nodeClick: j(),
    nodeMouseEnter: j(),
    nodeMouseMove: j(),
    nodeMouseLeave: j(),
    nodeContextMenu: j(),
    nodeDragStart: j(),
    nodeDrag: j(),
    nodeDragStop: j(),
    nodesInitialized: j(),
    miniMapNodeClick: j(),
    miniMapNodeDoubleClick: j(),
    miniMapNodeMouseEnter: j(),
    miniMapNodeMouseMove: j(),
    miniMapNodeMouseLeave: j(),
    connect: j(),
    connectStart: j(),
    connectEnd: j(),
    clickConnectStart: j(),
    clickConnectEnd: j(),
    paneReady: j(),
    move: j(),
    moveStart: j(),
    moveEnd: j(),
    selectionDragStart: j(),
    selectionDrag: j(),
    selectionDragStop: j(),
    selectionContextMenu: j(),
    selectionStart: j(),
    selectionEnd: j(),
    viewportChangeStart: j(),
    viewportChange: j(),
    viewportChangeEnd: j(),
    paneScroll: j(),
    paneClick: j(),
    paneContextMenu: j(),
    paneMouseEnter: j(),
    paneMouseMove: j(),
    paneMouseLeave: j(),
    edgeContextMenu: j(),
    edgeMouseEnter: j(),
    edgeMouseMove: j(),
    edgeMouseLeave: j(),
    edgeDoubleClick: j(),
    edgeClick: j(),
    edgeUpdateStart: j(),
    edgeUpdate: j(),
    edgeUpdateEnd: j(),
    updateNodeInternals: j(),
    error: j((e) => ha(e.message))
  };
}
function ir(e, t) {
  wi(() => {
    for (const [n, o] of Object.entries(t.value)) {
      const a = (i) => {
        e(n, i);
      };
      o.on(a), Nt(() => {
        o.off(a);
      });
    }
  });
}
var he = /* @__PURE__ */ ((e) => (e.MISSING_VIEWPORT_DIMENSIONS = "MISSING_VIEWPORT_DIMENSIONS", e.NODE_NOT_FOUND = "NODE_NOT_FOUND", e.NODE_MISSING_PARENT = "NODE_MISSING_PARENT", e.NODE_TYPE_MISSING = "NODE_TYPE_MISSING", e.NODE_EXTENT_INVALID = "NODE_EXTENT_INVALID", e.EDGE_INVALID = "EDGE_INVALID", e.EDGE_NOT_FOUND = "EDGE_NOT_FOUND", e.EDGE_SOURCE_MISSING = "EDGE_SOURCE_MISSING", e.EDGE_TARGET_MISSING = "EDGE_TARGET_MISSING", e.EDGE_TYPE_MISSING = "EDGE_TYPE_MISSING", e.EDGE_SOURCE_TARGET_SAME = "EDGE_SOURCE_TARGET_SAME", e.EDGE_SOURCE_TARGET_MISSING = "EDGE_SOURCE_TARGET_MISSING", e.EDGE_ORPHANED = "EDGE_ORPHANED", e))(he || {});
const yo = {
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
class ge extends Error {
  constructor(t, ...n) {
    var o;
    super((o = yo[t]) == null ? void 0 : o.call(yo, ...n)), this.code = t;
  }
}
const Kn = () => typeof window < "u" ? window : { chrome: !1 };
function bo(e) {
  return {
    ...e.computedPosition || { x: 0, y: 0 },
    width: e.dimensions.width || 0,
    height: e.dimensions.height || 0
  };
}
function $n(e, t) {
  const n = Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)), o = Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y));
  return Math.ceil(n * o);
}
function en(e) {
  return {
    width: e.offsetWidth,
    height: e.offsetHeight
  };
}
function st(e, t = 0, n = 1) {
  return Math.min(Math.max(e, t), n);
}
function ga(e, t) {
  return {
    x: st(e.x, t[0][0], t[1][0]),
    y: st(e.y, t[0][1], t[1][1])
  };
}
function wo(e) {
  const t = e.getRootNode(), n = Kn();
  return "elementFromPoint" in t ? t : n.document;
}
function ct(e) {
  return e && "id" in e && "source" in e && "target" in e;
}
function rr(e) {
  return ct(e) && "sourceNode" in e && "targetNode" in e;
}
function zt(e) {
  return e && "id" in e && !ct(e);
}
function Qe(e) {
  return zt(e) && "computedPosition" in e;
}
function lr(e) {
  return !!e.width && !!e.height && !!e.x && !!e.y;
}
function ur(e, t = {}) {
  let n = t;
  return Qe(e) || (n = {
    type: e.type ?? t.type ?? "default",
    dimensions: et({
      width: 0,
      height: 0
    }),
    handleBounds: {
      source: [],
      target: []
    },
    computedPosition: et({
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
    data: ue(e.data) ? e.data : {},
    events: et(ue(e.events) ? e.events : {})
  }), Object.assign({}, n, e, { id: e.id.toString() });
}
function pa(e, t = {}) {
  const n = ue(e.events) ? e.events : t.events && ue(t.events) ? t.events : {}, o = ue(e.data) ? e.data : t.data && ue(t.data) ? t.data : {};
  return t = rr(e) ? t : {
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
    events: et(n),
    label: (e.label && !De(e.label) ? et(e.label) : e.label) || t.label,
    interactionWidth: e.interactionWidth || t.interactionWidth
  }, Object.assign({}, t, e, { id: e.id.toString() });
}
function ma({ source: e, sourceHandle: t, target: n, targetHandle: o }) {
  return `vueflow__edge-${e}${t ?? ""}-${n}${o ?? ""}`;
}
function sr(e, t) {
  return t.some(
    (n) => ct(n) && n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)
  );
}
function cr({ x: e, y: t }, { x: n, y: o, zoom: a }) {
  return {
    x: e * a + n,
    y: t * a + o
  };
}
function ya({ x: e, y: t }, { x: n, y: o, zoom: a }, i, [r, l]) {
  const u = {
    x: (e - n) / a,
    y: (t - o) / a
  };
  return i ? {
    x: r * Math.round(u.x / r),
    y: l * Math.round(u.y / l)
  } : u;
}
function dr(e, t) {
  return {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x2, t.x2),
    y2: Math.max(e.y2, t.y2)
  };
}
function ba({ x: e, y: t, width: n, height: o }) {
  return {
    x: e,
    y: t,
    x2: e + n,
    y2: t + o
  };
}
function vr({ x: e, y: t, x2: n, y2: o }) {
  return {
    x: e,
    y: t,
    width: n - e,
    height: o - t
  };
}
function wa(e) {
  const t = e.reduce(
    (n, { computedPosition: o = { x: 0, y: 0 }, dimensions: a = { width: 0, height: 0 } } = {}) => dr(
      n,
      ba({
        ...o,
        ...a
      })
    ),
    { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }
  );
  return vr(t);
}
function xa(e, t, { x: n, y: o, zoom: a } = { x: 0, y: 0, zoom: 1 }, i = !1, r = !1) {
  const l = {
    x: (t.x - n) / a,
    y: (t.y - o) / a,
    width: t.width / a,
    height: t.height / a
  };
  return e.filter((u) => {
    const { computedPosition: c = { x: 0, y: 0 }, dimensions: s = { width: 0, height: 0 }, selectable: d } = u;
    if (r && !d)
      return !1;
    const v = { ...c, width: s.width || 0, height: s.height || 0 }, b = $n(l, v), g = typeof s.width > "u" || typeof s.height > "u" || s.width === 0 || s.height === 0, w = i && b > 0, E = s.width * s.height;
    return g || w || b >= E;
  });
}
function tn(e, t) {
  const n = e.map((o) => De(o) ? o : o.id);
  return t.filter((o) => n.includes(o.source) || n.includes(o.target));
}
function xo(e, t, n, o, a, i = 0.1, r = { x: 0, y: 0 }) {
  const l = t / (e.width * (1 + i)), u = n / (e.height * (1 + i)), c = Math.min(l, u), s = st(c, o, a), d = e.x + e.width / 2, v = e.y + e.height / 2, b = t / 2 - d * s + (r.x ?? 0), g = n / 2 - v * s + (r.y ?? 0);
  return { x: b, y: g, zoom: s };
}
function fr(e, t) {
  return {
    x: t.x + e.x,
    y: t.y + e.y,
    z: (e.z > t.z ? e.z : t.z) + 1
  };
}
function _a(e, t) {
  if (!e.parentNode)
    return !1;
  const n = t(e.parentNode);
  return n ? n.selected ? !0 : _a(n, t) : !1;
}
function Ge(e, t) {
  return typeof e > "u" ? "" : typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((n) => `${n}=${e[n]}`).join("&")}`;
}
function ue(e) {
  return typeof M(e) < "u";
}
function hr(e, t, n) {
  if (!e.source || !e.target)
    return n(new ge(he.EDGE_INVALID, e.id)), !1;
  let o;
  return ct(e) ? o = e : o = {
    ...e,
    id: ma(e)
  }, o = pa(o), sr(o, t) ? !1 : o;
}
function gr(e, t, n, o, a, i) {
  if (!t.source || !t.target)
    return i(new ge(he.EDGE_INVALID, e.id)), !1;
  const r = o(e.id);
  if (!r)
    return i(new ge(he.EDGE_NOT_FOUND, e.id)), !1;
  const { id: l, ...u } = e, c = {
    ...u,
    id: a ? ma(t) : l,
    source: t.source,
    target: t.target,
    sourceHandle: t.sourceHandle,
    targetHandle: t.targetHandle
  };
  return n.splice(n.indexOf(r), 1, c), c;
}
function _o(e, t, n, o) {
  const a = {}, i = e.map((l) => {
    const u = ur(l, {
      ...n(l.id),
      parentNode: l.parentNode
    });
    return l.parentNode && (a[l.parentNode] = !0), u;
  }), r = [...i, ...t];
  return i.forEach((l) => {
    const u = r.find((c) => c.id === l.parentNode);
    l.parentNode && !u && o(new ge(he.NODE_MISSING_PARENT, l.id, l.parentNode)), (l.parentNode || a[l.id]) && (a[l.id] && (l.isParent = !0), u && (u.isParent = !0));
  }), i;
}
var q = /* @__PURE__ */ ((e) => (e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom", e))(q || {}), Wn = /* @__PURE__ */ ((e) => (e.Partial = "partial", e.Full = "full", e))(Wn || {}), Ye = /* @__PURE__ */ ((e) => (e.Bezier = "default", e.SimpleBezier = "simple-bezier", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e))(Ye || {}), Ke = /* @__PURE__ */ ((e) => (e.Strict = "strict", e.Loose = "loose", e))(Ke || {}), Tn = /* @__PURE__ */ ((e) => (e.Arrow = "arrow", e.ArrowClosed = "arrowclosed", e))(Tn || {}), Gt = /* @__PURE__ */ ((e) => (e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal", e))(Gt || {});
const Eo = Symbol("vueFlow"), Ea = Symbol("nodeId"), Sa = Symbol("nodeRef"), pr = Symbol("edgeId"), mr = Symbol("edgeRef"), nn = Symbol("slots");
function yr(e) {
  const t = e ?? rt(Ea, ""), n = rt(Sa, null), { findNode: o, edges: a, emits: i } = de(), r = o(t);
  return r || i.error(new ge(he.NODE_NOT_FOUND, t)), {
    id: t,
    nodeEl: n,
    node: r,
    parentNode: Q(() => o(r.parentNode)),
    connectedEdges: Q(() => tn([r], a.value))
  };
}
function Zn(e) {
  return "clientX" in e;
}
function tt(e, t) {
  var n, o;
  const a = Zn(e), i = a ? e.clientX : (n = e.touches) == null ? void 0 : n[0].clientX, r = a ? e.clientY : (o = e.touches) == null ? void 0 : o[0].clientY;
  return {
    x: i - ((t == null ? void 0 : t.left) ?? 0),
    y: r - ((t == null ? void 0 : t.top) ?? 0)
  };
}
function jt(e, t, n) {
  const o = ((n == null ? void 0 : n.x) ?? 0) + t.x, a = ((n == null ? void 0 : n.y) ?? 0) + t.y, i = (n == null ? void 0 : n.width) ?? t.width, r = (n == null ? void 0 : n.height) ?? t.height;
  switch (e) {
    case q.Top:
      return {
        x: o + i / 2,
        y: a
      };
    case q.Right:
      return {
        x: o + i,
        y: a + r / 2
      };
    case q.Bottom:
      return {
        x: o + i / 2,
        y: a + r
      };
    case q.Left:
      return {
        x: o,
        y: a + r / 2
      };
  }
}
function So(e = [], t) {
  return e.length ? !t || e.length === 1 ? e[0] : t && e.find((n) => n.id === t) || null : null;
}
function br(e, t, n, o, a, i) {
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
function wr({
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
  const c = {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x + n, t.x + a),
    y2: Math.max(e.y + o, t.y + i)
  };
  c.x === c.x2 && (c.x2 += 1), c.y === c.y2 && (c.y2 += 1);
  const s = ba({
    x: (0 - u.x) / u.zoom,
    y: (0 - u.y) / u.zoom,
    width: r / u.zoom,
    height: l / u.zoom
  }), d = Math.max(0, Math.min(s.x2, c.x2) - Math.max(s.x, c.x)), v = Math.max(0, Math.min(s.y2, c.y2) - Math.max(s.y, c.y));
  return Math.ceil(d * v) > 0;
}
function xr(e, t, n = !1) {
  let o = -1;
  const a = e.reduce((i, r) => {
    const l = Te(r.zIndex);
    let u = l ? r.zIndex : 0;
    const c = t(r.source), s = t(r.target);
    return !c || !s || (n && (u = l ? r.zIndex : Math.max(c.computedPosition.z || 0, s.computedPosition.z || 0)), i[u] ? i[u].push(r) : i[u] = [r], o = u > o ? u : o), i;
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
function wn(e) {
  e == null || e.classList.remove("valid", "connecting", "vue-flow__handle-valid", "vue-flow__handle-connecting");
}
function No(e, t, n, o) {
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
function _r(e, t, n) {
  let o = null, a = 1 / 0;
  return n.forEach((i) => {
    const r = Math.sqrt((i.x - e.x) ** 2 + (i.y - e.y) ** 2);
    r <= t && r < a && (a = r, o = i);
  }), o;
}
function ko(e, t, n, o, a, i, r, l, u, c) {
  const s = i === "target", d = l.querySelector(`.vue-flow__handle[data-id="${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`), { x: v, y: b } = tt(e), g = l.elementFromPoint(v, b), w = g != null && g.classList.contains("vue-flow__handle") ? g : d, E = {
    handleDomNode: w,
    isValid: !1,
    connection: { source: "", target: "", sourceHandle: null, targetHandle: null },
    endHandle: null
  };
  if (w) {
    const _ = Na(void 0, w), $ = w.getAttribute("data-nodeid"), Y = w.getAttribute("data-handleid"), m = w.classList.contains("connectable"), O = w.classList.contains("connectableend"), x = {
      source: s ? $ : o,
      sourceHandle: s ? Y : a,
      target: s ? o : $,
      targetHandle: s ? a : Y
    };
    E.connection = x, m && O && (n === Ke.Strict ? s && _ === "source" || !s && _ === "target" : $ !== o || Y !== a) && (E.endHandle = {
      nodeId: $,
      handleId: Y,
      type: _
    }, E.isValid = r(x, {
      edges: u,
      sourceNode: c(x.source),
      targetNode: c(x.target)
    }));
  }
  return E;
}
function Er({ nodes: e, nodeId: t, handleId: n, handleType: o }) {
  return e.reduce((a, i) => {
    const { handleBounds: r } = i;
    let l = [], u = [];
    return r && (l = No(i, r, "source", `${t}-${n}-${o}`), u = No(i, r, "target", `${t}-${n}-${o}`)), a.push(...l, ...u), a;
  }, []);
}
function Na(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function Sr(e, t) {
  let n = null;
  return t ? n = "valid" : e && !t && (n = "invalid"), n;
}
function Mo(e, t, n) {
  return e < t ? st(Math.abs(e - t), 1, 50) / 50 : e > n ? -st(Math.abs(e - n), 1, 50) / 50 : 0;
}
function ka(e, t) {
  const n = Mo(e.x, 35, t.width - 35) * 20, o = Mo(e.y, 35, t.height - 35) * 20;
  return [n, o];
}
function Ct() {
  return !0;
}
function Ma({
  handleId: e,
  nodeId: t,
  type: n,
  isValidConnection: o,
  edgeUpdaterType: a,
  onEdgeUpdate: i,
  onEdgeUpdateEnd: r
}) {
  const l = Q(() => re(n) === "target"), {
    vueFlowRef: u,
    connectionMode: c,
    connectionRadius: s,
    connectOnClick: d,
    connectionClickStartHandle: v,
    nodesConnectable: b,
    autoPanOnConnect: g,
    findNode: w,
    panBy: E,
    getNodes: _,
    startConnection: $,
    updateConnection: Y,
    endConnection: m,
    emits: O,
    viewport: x,
    edges: h,
    isValidConnection: S
  } = de();
  let T = null, C = !1, D = null;
  function ee(p) {
    var R;
    const N = Zn(p), z = wo(p.target);
    if (N && p.button === 0 || !N) {
      let H = function(K) {
        A = tt(K, y), V = _r(
          ya(A, x.value, !1, [1, 1]),
          s.value,
          X
        ), F || (P(), F = !0);
        const ne = ko(
          K,
          V,
          c.value,
          re(t),
          re(e),
          l.value ? "target" : "source",
          U,
          z,
          h.value,
          w
        );
        if (T = ne.connection, C = ne.isValid, D = ne.handleDomNode, Y(
          V && C ? cr(
            {
              x: V.x,
              y: V.y
            },
            x.value
          ) : A,
          ne.endHandle,
          Sr(!!V, C)
        ), !V && !C && !D)
          return wn(L);
        T && T.source !== T.target && D && (wn(L), L = D, D.classList.add("connecting", "vue-flow__handle-connecting"), D.classList.toggle("valid", C), D.classList.toggle("vue-flow__handle-valid", C));
      }, W = function(K) {
        (V || D) && T && C && (i ? i(K, T) : O.connect(T)), O.connectEnd(K), a && (r == null || r(K)), wn(L), cancelAnimationFrame(Z), m(K), F = !1, C = !1, T = null, D = null, z.removeEventListener("mousemove", H), z.removeEventListener("mouseup", W), z.removeEventListener("touchmove", H), z.removeEventListener("touchend", W);
      };
      const B = w(re(t));
      let U = o || S.value || Ct;
      !U && B && (U = (l ? B.isValidSourcePos : B.isValidTargetPos) || Ct);
      let V, Z = 0;
      const { x: G, y: te } = tt(p), I = z == null ? void 0 : z.elementFromPoint(G, te), f = Na(re(a), I), y = (R = u.value) == null ? void 0 : R.getBoundingClientRect();
      if (!y || !f)
        return;
      let L, A = tt(p, y), F = !1;
      const X = Er({
        nodes: _.value,
        nodeId: re(t),
        handleId: re(e),
        handleType: f
      }), P = () => {
        if (!g)
          return;
        const [K, ne] = ka(A, y);
        E({ x: K, y: ne }), Z = requestAnimationFrame(P);
      };
      $(
        {
          nodeId: re(t),
          handleId: re(e),
          type: f
        },
        {
          x: G - y.left,
          y: te - y.top
        },
        p
      ), O.connectStart({ event: p, nodeId: re(t), handleId: re(e), handleType: f }), z.addEventListener("mousemove", H), z.addEventListener("mouseup", W), z.addEventListener("touchmove", H), z.addEventListener("touchend", W);
    }
  }
  function ae(p) {
    if (d.value)
      if (!v.value)
        O.clickConnectStart({ event: p, nodeId: re(t), handleId: re(e) }), $(
          { nodeId: re(t), type: re(n), handleId: re(e) },
          void 0,
          p,
          !0
        );
      else {
        let R = o || S.value || Ct;
        const N = w(re(t));
        if (!R && N && (R = (l ? N.isValidSourcePos : N.isValidTargetPos) || Ct), N && (typeof N.connectable > "u" ? b.value : N.connectable) === !1)
          return;
        const z = wo(p.target), { connection: H, isValid: W } = ko(
          p,
          {
            nodeId: re(t),
            id: re(e),
            type: re(n)
          },
          c.value,
          v.value.nodeId,
          v.value.handleId || null,
          v.value.type,
          R,
          z,
          h.value,
          w
        ), B = H.source === H.target;
        W && !B && O.connect(H), O.clickConnectEnd(p), m(p, !0);
      }
  }
  return {
    handlePointerDown: ee,
    handleClick: ae
  };
}
function Nr(e, t) {
  const n = {};
  for (const o in e)
    t.includes(o) || Object.defineProperty(n, o, {
      enumerable: !0,
      get: () => e[o]
    });
  return n;
}
const kr = ["data-id", "data-handleid", "data-nodeid", "data-handlepos"], Mr = {
  name: "Handle",
  compatConfig: { MODE: 3 }
}, dt = /* @__PURE__ */ ve({
  ...Mr,
  props: {
    id: null,
    type: null,
    position: { default: q.Top },
    isValidConnection: { type: Function },
    connectable: { type: [Boolean, String, Function], default: void 0 },
    connectableStart: { type: Boolean, default: !0 },
    connectableEnd: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = Nr(e, ["position", "connectable", "connectableStart", "connectableEnd", "id", "isValidConnection"]), n = k(t, "type", "source"), {
      connectionStartHandle: o,
      connectionClickStartHandle: a,
      connectionEndHandle: i,
      vueFlowRef: r,
      nodesConnectable: l,
      noDragClassName: u,
      noPanClassName: c
    } = de(), { id: s, node: d, nodeEl: v, connectedEdges: b } = yr(), g = J(), w = Q(() => e.id ?? `${s}__handle-${e.position}`), E = Q(() => typeof e.connectableStart < "u" ? e.connectableStart : !0), _ = Q(() => typeof e.connectableEnd < "u" ? e.connectableEnd : !0), { handlePointerDown: $, handleClick: Y } = Ma({
      nodeId: s,
      handleId: w,
      isValidConnection: e.isValidConnection,
      type: n
    }), m = Q(() => De(e.connectable) && e.connectable === "single" ? !b.value.some((T) => {
      const C = T[`${n.value}Handle`];
      return T[n.value] !== s ? !1 : C ? C === w.value : !0;
    }) : Ve(e.connectable) ? e.connectable(d, b.value) : ue(e.connectable) ? e.connectable : l.value), O = Q(
      () => {
        var T, C, D, ee, ae, p;
        return ((T = o.value) == null ? void 0 : T.nodeId) === s && ((C = o.value) == null ? void 0 : C.handleId) === w.value && ((D = o.value) == null ? void 0 : D.type) === n.value || ((ee = i.value) == null ? void 0 : ee.nodeId) === s && ((ae = i.value) == null ? void 0 : ae.handleId) === w.value && ((p = i.value) == null ? void 0 : p.type) === n.value;
      }
    ), x = Q(
      () => {
        var T, C, D;
        return ((T = a.value) == null ? void 0 : T.nodeId) === s && ((C = a.value) == null ? void 0 : C.handleId) === w.value && ((D = a.value) == null ? void 0 : D.type) === n.value;
      }
    );
    ye(() => d.initialized).toBe(!0, { flush: "post" }).then(() => {
      var T;
      const C = (T = d.handleBounds[n.value]) == null ? void 0 : T.find((z) => z.id === w.value);
      if (!r.value || C)
        return;
      const D = r.value.querySelector(".vue-flow__transformationpane");
      if (!v || !g.value || !D || !w.value)
        return;
      const ee = v.value.getBoundingClientRect(), ae = g.value.getBoundingClientRect(), p = window.getComputedStyle(D), { m22: R } = new window.DOMMatrixReadOnly(p.transform), N = {
        id: w.value,
        position: e.position,
        x: (ae.left - ee.left) / R,
        y: (ae.top - ee.top) / R,
        ...en(g.value)
      };
      d.handleBounds[n.value] = [...d.handleBounds[n.value] ?? [], N];
    });
    function h(T) {
      const C = Zn(T);
      m.value && E.value && (C && T.button === 0 || !C) && $(T);
    }
    function S(T) {
      !s || !a.value && !E.value || m.value && Y(T);
    }
    return (T, C) => (oe(), ie("div", {
      ref_key: "handle",
      ref: g,
      "data-id": `${M(s)}-${M(w)}-${M(n)}`,
      "data-handleid": M(w),
      "data-nodeid": M(s),
      "data-handlepos": e.position,
      class: Ue(["vue-flow__handle", [
        `vue-flow__handle-${e.position}`,
        `vue-flow__handle-${M(w)}`,
        M(u),
        M(c),
        M(n),
        {
          connectable: M(m),
          connecting: M(x),
          connectablestart: M(E),
          connectableend: M(_),
          connectionindicator: M(m) && (M(E) && !M(O) || M(_) && M(O))
        }
      ]]),
      onMousedown: h,
      onTouchstartPassive: h,
      onClick: S
    }, [
      we(T.$slots, "default", { id: e.id })
    ], 42, kr));
  }
}), on = function({
  sourcePosition: e = q.Bottom,
  targetPosition: t = q.Top,
  label: n,
  connectable: o = !0,
  isValidTargetPos: a,
  isValidSourcePos: i
}) {
  return [
    le(dt, { type: "target", position: t, connectable: o, isValidConnection: a }),
    typeof n != "string" && n ? le(n) : le("div", { innerHTML: n }),
    le(dt, { type: "source", position: e, connectable: o, isValidConnection: i })
  ];
};
on.props = ["sourcePosition", "targetPosition", "label", "isValidTargetPos", "isValidSourcePos", "connectable"];
on.inheritAttrs = !1;
on.compatConfig = { MODE: 3 };
const Pr = on, an = function({
  sourcePosition: e = q.Bottom,
  label: t,
  connectable: n = !0,
  isValidSourcePos: o
}) {
  return [
    typeof t != "string" && t ? le(t) : le("div", { innerHTML: t }),
    le(dt, { type: "source", position: e, connectable: n, isValidConnection: o })
  ];
};
an.props = ["sourcePosition", "label", "isValidSourcePos", "connectable"];
an.inheritAttrs = !1;
an.compatConfig = { MODE: 3 };
const Cr = an, rn = function({
  targetPosition: e = q.Top,
  label: t,
  connectable: n = !0,
  isValidTargetPos: o
}) {
  return [
    le(dt, { type: "target", position: e, connectable: n, isValidConnection: o }),
    typeof t != "string" && t ? le(t) : le("div", { innerHTML: t })
  ];
};
rn.props = ["targetPosition", "label", "isValidTargetPos", "connectable"];
rn.inheritAttrs = !1;
rn.compatConfig = { MODE: 3 };
const Ir = rn;
function Po(e, t, n) {
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
function Or(e, t, n, o, a) {
  return e.filter(
    (i) => (i.selected || i.id === a) && (!i.parentNode || !_a(i, o)) && (i.draggable || t && typeof i.draggable > "u")
  ).map(
    (i) => {
      var r, l;
      return et({
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
function xn({
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
function Pa(e) {
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
function $r(e, t, n) {
  const [o, a, i, r] = typeof e != "string" ? Pa(e.padding) : [0, 0, 0, 0];
  return n && Te(n.computedPosition.x) && Te(n.computedPosition.y) && Te(n.dimensions.width) && Te(n.dimensions.height) ? [
    [n.computedPosition.x + r, n.computedPosition.y + o],
    [
      n.computedPosition.x + (n.dimensions.width - t.dimensions.width) - a,
      n.computedPosition.y + (n.dimensions.height - t.dimensions.height) - i
    ]
  ] : !1;
}
function Tr(e, t, n, o) {
  let a = e.extent || n;
  if (a === "parent" || !Array.isArray(a) && (a == null ? void 0 : a.range) === "parent")
    if (e.parentNode && o && e.dimensions.width && e.dimensions.height) {
      const i = $r(a, e, o);
      i && (a = i);
    } else
      t(new ge(he.NODE_EXTENT_INVALID, e.id)), a = n;
  else if (Array.isArray(a)) {
    const i = (o == null ? void 0 : o.computedPosition.x) || 0, r = (o == null ? void 0 : o.computedPosition.y) || 0;
    a = [
      [a[0][0] + i, a[0][1] + r],
      [a[1][0] + i, a[1][1] + r]
    ];
  } else if (a != null && a.range && Array.isArray(a.range)) {
    const [i, r, l, u] = Pa(a.padding), c = (o == null ? void 0 : o.computedPosition.x) || 0, s = (o == null ? void 0 : o.computedPosition.y) || 0;
    a = [
      [a.range[0][0] + c + u, a.range[0][1] + s + i],
      [a.range[1][0] + c - r, a.range[1][1] + s - l]
    ];
  }
  return a;
}
function qn(e, t, n, o, a) {
  const i = Tr(e, n, o, a), r = ga(t, i);
  return {
    position: {
      x: r.x - ((a == null ? void 0 : a.computedPosition.x) || 0),
      y: r.y - ((a == null ? void 0 : a.computedPosition.y) || 0)
    },
    computedPosition: r
  };
}
function Ca() {
  const { getSelectedNodes: e, nodeExtent: t, updateNodePositions: n, findNode: o, snapGrid: a, snapToGrid: i, nodesDraggable: r, emits: l } = de();
  return (u, c = !1) => {
    const s = i.value ? a.value[0] : 5, d = i.value ? a.value[1] : 5, v = c ? 4 : 1, b = u.x * s * v, g = u.y * d * v, w = e.value.filter((E) => E.draggable || r && typeof E.draggable > "u").map((E) => {
      const _ = { x: E.computedPosition.x + b, y: E.computedPosition.y + g }, { computedPosition: $ } = qn(
        E,
        _,
        l.error,
        t.value,
        E.parentNode ? o(E.parentNode) : void 0
      );
      return {
        id: E.id,
        position: $,
        from: E.position,
        distance: { x: u.x, y: u.y },
        dimensions: E.dimensions
      };
    });
    n(w, !0, !1);
  };
}
function Dr() {
  return {
    doubleClick: j(),
    click: j(),
    mouseEnter: j(),
    mouseMove: j(),
    mouseLeave: j(),
    contextMenu: j(),
    dragStart: j(),
    drag: j(),
    dragStop: j()
  };
}
function Br(e, t) {
  const n = Dr();
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
function Ar() {
  const { viewport: e, snapGrid: t, snapToGrid: n } = de();
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
function Co(e, t, n) {
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
      ...en(r)
    };
  });
}
function Dn(e, t, n, o, a, i = !1, r) {
  a.value = !1, e.selected ? (i || e.selected && t) && (o([e]), Ae(r.blur)) : n([e]);
}
var zr = { value: () => {
} };
function ln() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o))
      throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Rt(n);
}
function Rt(e) {
  this._ = e;
}
function Rr(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", a = n.indexOf(".");
    if (a >= 0 && (o = n.slice(a + 1), n = n.slice(0, a)), n && !t.hasOwnProperty(n))
      throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Rt.prototype = ln.prototype = {
  constructor: Rt,
  on: function(e, t) {
    var n = this._, o = Rr(e + "", n), a, i = -1, r = o.length;
    if (arguments.length < 2) {
      for (; ++i < r; )
        if ((a = (e = o[i]).type) && (a = Vr(n[a], e.name)))
          return a;
      return;
    }
    if (t != null && typeof t != "function")
      throw new Error("invalid callback: " + t);
    for (; ++i < r; )
      if (a = (e = o[i]).type)
        n[a] = Io(n[a], e.name, t);
      else if (t == null)
        for (a in n)
          n[a] = Io(n[a], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t)
      e[n] = t[n].slice();
    return new Rt(e);
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
function Vr(e, t) {
  for (var n = 0, o = e.length, a; n < o; ++n)
    if ((a = e[n]).name === t)
      return a.value;
}
function Io(e, t, n) {
  for (var o = 0, a = e.length; o < a; ++o)
    if (e[o].name === t) {
      e[o] = zr, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Bn = "http://www.w3.org/1999/xhtml";
const Oo = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Bn,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function un(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Oo.hasOwnProperty(t) ? { space: Oo[t], local: e } : e;
}
function Lr(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Bn && t.documentElement.namespaceURI === Bn ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Fr(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Ia(e) {
  var t = un(e);
  return (t.local ? Fr : Lr)(t);
}
function Xr() {
}
function Qn(e) {
  return e == null ? Xr : function() {
    return this.querySelector(e);
  };
}
function Yr(e) {
  typeof e != "function" && (e = Qn(e));
  for (var t = this._groups, n = t.length, o = new Array(n), a = 0; a < n; ++a)
    for (var i = t[a], r = i.length, l = o[a] = new Array(r), u, c, s = 0; s < r; ++s)
      (u = i[s]) && (c = e.call(u, u.__data__, s, i)) && ("__data__" in u && (c.__data__ = u.__data__), l[s] = c);
  return new be(o, this._parents);
}
function Gr(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function jr() {
  return [];
}
function Oa(e) {
  return e == null ? jr : function() {
    return this.querySelectorAll(e);
  };
}
function Hr(e) {
  return function() {
    return Gr(e.apply(this, arguments));
  };
}
function Ur(e) {
  typeof e == "function" ? e = Hr(e) : e = Oa(e);
  for (var t = this._groups, n = t.length, o = [], a = [], i = 0; i < n; ++i)
    for (var r = t[i], l = r.length, u, c = 0; c < l; ++c)
      (u = r[c]) && (o.push(e.call(u, u.__data__, c, r)), a.push(u));
  return new be(o, a);
}
function $a(e) {
  return function() {
    return this.matches(e);
  };
}
function Ta(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Kr = Array.prototype.find;
function Wr(e) {
  return function() {
    return Kr.call(this.children, e);
  };
}
function Zr() {
  return this.firstElementChild;
}
function qr(e) {
  return this.select(e == null ? Zr : Wr(typeof e == "function" ? e : Ta(e)));
}
var Qr = Array.prototype.filter;
function Jr() {
  return Array.from(this.children);
}
function el(e) {
  return function() {
    return Qr.call(this.children, e);
  };
}
function tl(e) {
  return this.selectAll(e == null ? Jr : el(typeof e == "function" ? e : Ta(e)));
}
function nl(e) {
  typeof e != "function" && (e = $a(e));
  for (var t = this._groups, n = t.length, o = new Array(n), a = 0; a < n; ++a)
    for (var i = t[a], r = i.length, l = o[a] = [], u, c = 0; c < r; ++c)
      (u = i[c]) && e.call(u, u.__data__, c, i) && l.push(u);
  return new be(o, this._parents);
}
function Da(e) {
  return new Array(e.length);
}
function ol() {
  return new be(this._enter || this._groups.map(Da), this._parents);
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
function al(e) {
  return function() {
    return e;
  };
}
function il(e, t, n, o, a, i) {
  for (var r = 0, l, u = t.length, c = i.length; r < c; ++r)
    (l = t[r]) ? (l.__data__ = i[r], o[r] = l) : n[r] = new Ht(e, i[r]);
  for (; r < u; ++r)
    (l = t[r]) && (a[r] = l);
}
function rl(e, t, n, o, a, i, r) {
  var l, u, c = /* @__PURE__ */ new Map(), s = t.length, d = i.length, v = new Array(s), b;
  for (l = 0; l < s; ++l)
    (u = t[l]) && (v[l] = b = r.call(u, u.__data__, l, t) + "", c.has(b) ? a[l] = u : c.set(b, u));
  for (l = 0; l < d; ++l)
    b = r.call(e, i[l], l, i) + "", (u = c.get(b)) ? (o[l] = u, u.__data__ = i[l], c.delete(b)) : n[l] = new Ht(e, i[l]);
  for (l = 0; l < s; ++l)
    (u = t[l]) && c.get(v[l]) === u && (a[l] = u);
}
function ll(e) {
  return e.__data__;
}
function ul(e, t) {
  if (!arguments.length)
    return Array.from(this, ll);
  var n = t ? rl : il, o = this._parents, a = this._groups;
  typeof e != "function" && (e = al(e));
  for (var i = a.length, r = new Array(i), l = new Array(i), u = new Array(i), c = 0; c < i; ++c) {
    var s = o[c], d = a[c], v = d.length, b = sl(e.call(s, s && s.__data__, c, o)), g = b.length, w = l[c] = new Array(g), E = r[c] = new Array(g), _ = u[c] = new Array(v);
    n(s, d, w, E, _, b, t);
    for (var $ = 0, Y = 0, m, O; $ < g; ++$)
      if (m = w[$]) {
        for ($ >= Y && (Y = $ + 1); !(O = E[Y]) && ++Y < g; )
          ;
        m._next = O || null;
      }
  }
  return r = new be(r, o), r._enter = l, r._exit = u, r;
}
function sl(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function cl() {
  return new be(this._exit || this._groups.map(Da), this._parents);
}
function dl(e, t, n) {
  var o = this.enter(), a = this, i = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (a = t(a), a && (a = a.selection())), n == null ? i.remove() : n(i), o && a ? o.merge(a).order() : a;
}
function vl(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, a = n.length, i = o.length, r = Math.min(a, i), l = new Array(a), u = 0; u < r; ++u)
    for (var c = n[u], s = o[u], d = c.length, v = l[u] = new Array(d), b, g = 0; g < d; ++g)
      (b = c[g] || s[g]) && (v[g] = b);
  for (; u < a; ++u)
    l[u] = n[u];
  return new be(l, this._parents);
}
function fl() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], a = o.length - 1, i = o[a], r; --a >= 0; )
      (r = o[a]) && (i && r.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(r, i), i = r);
  return this;
}
function hl(e) {
  e || (e = gl);
  function t(d, v) {
    return d && v ? e(d.__data__, v.__data__) : !d - !v;
  }
  for (var n = this._groups, o = n.length, a = new Array(o), i = 0; i < o; ++i) {
    for (var r = n[i], l = r.length, u = a[i] = new Array(l), c, s = 0; s < l; ++s)
      (c = r[s]) && (u[s] = c);
    u.sort(t);
  }
  return new be(a, this._parents).order();
}
function gl(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function pl() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function ml() {
  return Array.from(this);
}
function yl() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], a = 0, i = o.length; a < i; ++a) {
      var r = o[a];
      if (r)
        return r;
    }
  return null;
}
function bl() {
  let e = 0;
  for (const t of this)
    ++e;
  return e;
}
function wl() {
  return !this.node();
}
function xl(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var a = t[n], i = 0, r = a.length, l; i < r; ++i)
      (l = a[i]) && e.call(l, l.__data__, i, a);
  return this;
}
function _l(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function El(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Sl(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Nl(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function kl(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Ml(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Pl(e, t) {
  var n = un(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? El : _l : typeof t == "function" ? n.local ? Ml : kl : n.local ? Nl : Sl)(n, t));
}
function Ba(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Cl(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Il(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Ol(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function $l(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? Cl : typeof t == "function" ? Ol : Il)(e, t, n ?? "")) : vt(this.node(), e);
}
function vt(e, t) {
  return e.style.getPropertyValue(t) || Ba(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Tl(e) {
  return function() {
    delete this[e];
  };
}
function Dl(e, t) {
  return function() {
    this[e] = t;
  };
}
function Bl(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Al(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Tl : typeof t == "function" ? Bl : Dl)(e, t)) : this.node()[e];
}
function Aa(e) {
  return e.trim().split(/^|\s+/);
}
function Jn(e) {
  return e.classList || new za(e);
}
function za(e) {
  this._node = e, this._names = Aa(e.getAttribute("class") || "");
}
za.prototype = {
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
function Ra(e, t) {
  for (var n = Jn(e), o = -1, a = t.length; ++o < a; )
    n.add(t[o]);
}
function Va(e, t) {
  for (var n = Jn(e), o = -1, a = t.length; ++o < a; )
    n.remove(t[o]);
}
function zl(e) {
  return function() {
    Ra(this, e);
  };
}
function Rl(e) {
  return function() {
    Va(this, e);
  };
}
function Vl(e, t) {
  return function() {
    (t.apply(this, arguments) ? Ra : Va)(this, e);
  };
}
function Ll(e, t) {
  var n = Aa(e + "");
  if (arguments.length < 2) {
    for (var o = Jn(this.node()), a = -1, i = n.length; ++a < i; )
      if (!o.contains(n[a]))
        return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Vl : t ? zl : Rl)(n, t));
}
function Fl() {
  this.textContent = "";
}
function Xl(e) {
  return function() {
    this.textContent = e;
  };
}
function Yl(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Gl(e) {
  return arguments.length ? this.each(e == null ? Fl : (typeof e == "function" ? Yl : Xl)(e)) : this.node().textContent;
}
function jl() {
  this.innerHTML = "";
}
function Hl(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Ul(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Kl(e) {
  return arguments.length ? this.each(e == null ? jl : (typeof e == "function" ? Ul : Hl)(e)) : this.node().innerHTML;
}
function Wl() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Zl() {
  return this.each(Wl);
}
function ql() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Ql() {
  return this.each(ql);
}
function Jl(e) {
  var t = typeof e == "function" ? e : Ia(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function eu() {
  return null;
}
function tu(e, t) {
  var n = typeof e == "function" ? e : Ia(e), o = t == null ? eu : typeof t == "function" ? t : Qn(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function nu() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function ou() {
  return this.each(nu);
}
function au() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function iu() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function ru(e) {
  return this.select(e ? iu : au);
}
function lu(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function uu(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function su(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function cu(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, a = t.length, i; n < a; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++o] = i;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function du(e, t, n) {
  return function() {
    var o = this.__on, a, i = uu(t);
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
function vu(e, t, n) {
  var o = su(e + ""), a, i = o.length, r;
  if (arguments.length < 2) {
    var l = this.node().__on;
    if (l) {
      for (var u = 0, c = l.length, s; u < c; ++u)
        for (a = 0, s = l[u]; a < i; ++a)
          if ((r = o[a]).type === s.type && r.name === s.name)
            return s.value;
    }
    return;
  }
  for (l = t ? du : cu, a = 0; a < i; ++a)
    this.each(l(o[a], t, n));
  return this;
}
function La(e, t, n) {
  var o = Ba(e), a = o.CustomEvent;
  typeof a == "function" ? a = new a(t, n) : (a = o.document.createEvent("Event"), n ? (a.initEvent(t, n.bubbles, n.cancelable), a.detail = n.detail) : a.initEvent(t, !1, !1)), e.dispatchEvent(a);
}
function fu(e, t) {
  return function() {
    return La(this, e, t);
  };
}
function hu(e, t) {
  return function() {
    return La(this, e, t.apply(this, arguments));
  };
}
function gu(e, t) {
  return this.each((typeof t == "function" ? hu : fu)(e, t));
}
function* pu() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], a = 0, i = o.length, r; a < i; ++a)
      (r = o[a]) && (yield r);
}
var Fa = [null];
function be(e, t) {
  this._groups = e, this._parents = t;
}
function kt() {
  return new be([[document.documentElement]], Fa);
}
function mu() {
  return this;
}
be.prototype = kt.prototype = {
  constructor: be,
  select: Yr,
  selectAll: Ur,
  selectChild: qr,
  selectChildren: tl,
  filter: nl,
  data: ul,
  enter: ol,
  exit: cl,
  join: dl,
  merge: vl,
  selection: mu,
  order: fl,
  sort: hl,
  call: pl,
  nodes: ml,
  node: yl,
  size: bl,
  empty: wl,
  each: xl,
  attr: Pl,
  style: $l,
  property: Al,
  classed: Ll,
  text: Gl,
  html: Kl,
  raise: Zl,
  lower: Ql,
  append: Jl,
  insert: tu,
  remove: ou,
  clone: ru,
  datum: lu,
  on: vu,
  dispatch: gu,
  [Symbol.iterator]: pu
};
function _e(e) {
  return typeof e == "string" ? new be([[document.querySelector(e)]], [document.documentElement]) : new be([[e]], Fa);
}
function yu(e) {
  let t;
  for (; t = e.sourceEvent; )
    e = t;
  return e;
}
function Me(e, t) {
  if (e = yu(e), t === void 0 && (t = e.currentTarget), t) {
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
const bu = { passive: !1 }, wt = { capture: !0, passive: !1 };
function _n(e) {
  e.stopImmediatePropagation();
}
function nt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Xa(e) {
  var t = e.document.documentElement, n = _e(e).on("dragstart.drag", nt, wt);
  "onselectstart" in t ? n.on("selectstart.drag", nt, wt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Ya(e, t) {
  var n = e.document.documentElement, o = _e(e).on("dragstart.drag", null);
  t && (o.on("click.drag", nt, wt), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const It = (e) => () => e;
function An(e, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: a,
  active: i,
  x: r,
  y: l,
  dx: u,
  dy: c,
  dispatch: s
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
    dy: { value: c, enumerable: !0, configurable: !0 },
    _: { value: s }
  });
}
An.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function wu(e) {
  return !e.ctrlKey && !e.button;
}
function xu() {
  return this.parentNode;
}
function _u(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Eu() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Su() {
  var e = wu, t = xu, n = _u, o = Eu, a = {}, i = ln("start", "drag", "end"), r = 0, l, u, c, s, d = 0;
  function v(m) {
    m.on("mousedown.drag", b).filter(o).on("touchstart.drag", E).on("touchmove.drag", _, bu).on("touchend.drag touchcancel.drag", $).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function b(m, O) {
    if (!(s || !e.call(this, m, O))) {
      var x = Y(this, t.call(this, m, O), m, O, "mouse");
      x && (_e(m.view).on("mousemove.drag", g, wt).on("mouseup.drag", w, wt), Xa(m.view), _n(m), c = !1, l = m.clientX, u = m.clientY, x("start", m));
    }
  }
  function g(m) {
    if (nt(m), !c) {
      var O = m.clientX - l, x = m.clientY - u;
      c = O * O + x * x > d;
    }
    a.mouse("drag", m);
  }
  function w(m) {
    _e(m.view).on("mousemove.drag mouseup.drag", null), Ya(m.view, c), nt(m), a.mouse("end", m);
  }
  function E(m, O) {
    if (e.call(this, m, O)) {
      var x = m.changedTouches, h = t.call(this, m, O), S = x.length, T, C;
      for (T = 0; T < S; ++T)
        (C = Y(this, h, m, O, x[T].identifier, x[T])) && (_n(m), C("start", m, x[T]));
    }
  }
  function _(m) {
    var O = m.changedTouches, x = O.length, h, S;
    for (h = 0; h < x; ++h)
      (S = a[O[h].identifier]) && (nt(m), S("drag", m, O[h]));
  }
  function $(m) {
    var O = m.changedTouches, x = O.length, h, S;
    for (s && clearTimeout(s), s = setTimeout(function() {
      s = null;
    }, 500), h = 0; h < x; ++h)
      (S = a[O[h].identifier]) && (_n(m), S("end", m, O[h]));
  }
  function Y(m, O, x, h, S, T) {
    var C = i.copy(), D = Me(T || x, O), ee, ae, p;
    if ((p = n.call(m, new An("beforestart", {
      sourceEvent: x,
      target: v,
      identifier: S,
      active: r,
      x: D[0],
      y: D[1],
      dx: 0,
      dy: 0,
      dispatch: C
    }), h)) != null)
      return ee = p.x - D[0] || 0, ae = p.y - D[1] || 0, function R(N, z, H) {
        var W = D, B;
        switch (N) {
          case "start":
            a[S] = R, B = r++;
            break;
          case "end":
            delete a[S], --r;
          case "drag":
            D = Me(H || z, O), B = r;
            break;
        }
        C.call(
          N,
          m,
          new An(N, {
            sourceEvent: z,
            subject: p,
            target: v,
            identifier: S,
            active: B,
            x: D[0] + ee,
            y: D[1] + ae,
            dx: D[0] - W[0],
            dy: D[1] - W[1],
            dispatch: C
          }),
          h
        );
      };
  }
  return v.filter = function(m) {
    return arguments.length ? (e = typeof m == "function" ? m : It(!!m), v) : e;
  }, v.container = function(m) {
    return arguments.length ? (t = typeof m == "function" ? m : It(m), v) : t;
  }, v.subject = function(m) {
    return arguments.length ? (n = typeof m == "function" ? m : It(m), v) : n;
  }, v.touchable = function(m) {
    return arguments.length ? (o = typeof m == "function" ? m : It(!!m), v) : o;
  }, v.on = function() {
    var m = i.on.apply(i, arguments);
    return m === i ? v : m;
  }, v.clickDistance = function(m) {
    return arguments.length ? (d = (m = +m) * m, v) : Math.sqrt(d);
  }, v;
}
function Ga(e) {
  const t = de(), n = k(t, "vueFlowRef"), o = k(t, "snapToGrid"), a = k(t, "snapGrid"), i = k(t, "noDragClassName"), r = k(t, "nodes"), l = k(t, "nodeExtent"), u = k(t, "viewport"), c = k(t, "autoPanOnNodeDrag"), s = k(t, "nodesDraggable"), d = k(t, "panBy"), v = k(t, "findNode"), b = k(t, "multiSelectionActive"), g = k(t, "nodesSelectionActive"), w = k(t, "selectNodesOnDrag"), E = k(t, "removeSelectedElements"), _ = k(t, "addSelectedNodes"), $ = k(t, "updateNodePositions"), Y = k(t, "emits"), { onStart: m, onDrag: O, onStop: x, el: h, disabled: S, id: T, selectable: C } = e, D = J(!1);
  let ee = J([]), ae = J(), p = J(null), R = J({ x: void 0, y: void 0 }), N = J({ x: 0, y: 0 }), z = J(null), H = J(0), W = J(!1);
  const B = Ar(), U = ({ x: Z, y: G }) => {
    R.value = { x: Z, y: G };
    let te = !1;
    if (ee.value = ee.value.map((I) => {
      const f = { x: Z - I.distance.x, y: G - I.distance.y };
      o.value && (f.x = a.value[0] * Math.round(f.x / a.value[0]), f.y = a.value[1] * Math.round(f.y / a.value[1]));
      const { computedPosition: y } = qn(
        I,
        f,
        Y.value.error,
        l.value,
        I.parentNode ? v.value(I.parentNode) : void 0
      );
      return te = te || I.position.x !== y.x || I.position.y !== y.y, I.position = y, I;
    }), !!te && ($.value(ee.value, !0, !0), D.value = !0, z.value)) {
      const [I, f] = xn({
        id: T,
        dragItems: ee.value,
        findNode: v.value
      });
      O({ event: z.value, node: I, nodes: f });
    }
  }, V = () => {
    if (!p.value)
      return;
    const [Z, G] = ka(N.value, p.value);
    if (Z !== 0 || G !== 0) {
      const te = {
        x: (R.value.x ?? 0) - Z / u.value.zoom,
        y: (R.value.y ?? 0) - G / u.value.zoom
      };
      d.value({ x: Z, y: G }) && U(te);
    }
    H.value = requestAnimationFrame(V);
  };
  return se([() => re(S), h], ([Z, G]) => {
    if (G) {
      const te = _e(G);
      if (Z)
        te.on(".drag", null);
      else {
        const I = v.value(T);
        ae.value = Su().on("start", (f) => {
          var y;
          !w.value && !b.value && I && (I.selected || E.value()), I && re(C) && w.value && Dn(
            I,
            b.value,
            _.value,
            E.value,
            g,
            !1,
            G
          );
          const L = B(f);
          if (R.value = L, ee.value = Or(r.value, s.value, L, v.value, T), ee.value.length) {
            const [A, F] = xn({
              id: T,
              dragItems: ee.value,
              findNode: v.value
            });
            m({ event: f.sourceEvent, node: A, nodes: F });
          }
          p.value = ((y = n.value) == null ? void 0 : y.getBoundingClientRect()) || null, N.value = tt(f.sourceEvent, p.value);
        }).on("drag", (f) => {
          const y = B(f);
          !W.value && c.value && (W.value = !0, V()), (R.value.x !== y.xSnapped || R.value.y !== y.ySnapped) && ee.value.length && (z.value = f.sourceEvent, N.value = tt(f.sourceEvent, p.value), U(y));
        }).on("end", (f) => {
          if (D.value = !1, W.value = !1, cancelAnimationFrame(H.value), ee.value.length) {
            $.value(ee.value, !1, !1);
            const [y, L] = xn({
              id: T,
              dragItems: ee.value,
              findNode: v.value
            });
            x({ event: f.sourceEvent, node: y, nodes: L });
          }
        }).filter((f) => {
          const y = f.target;
          return !f.button && (!i.value || !Po(y, `.${i.value}`, G) && (!(I != null && I.dragHandle) || Po(y, I.dragHandle, G)));
        }), te.call(ae.value);
      }
    }
  }), D;
}
const ja = "vue-flow__node-desc", Ha = "vue-flow__edge-desc", Nu = "vue-flow__aria-live", Ua = ["Enter", " ", "Escape"], ot = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};
function zn(e) {
  var t, n;
  const o = ((n = (t = e.composedPath) == null ? void 0 : t.call(e)) == null ? void 0 : n[0]) || e.target, a = Ve(o.hasAttribute) ? o.hasAttribute("contenteditable") : !1, i = Ve(o.closest) ? o.closest(".nokey") : null;
  return ["INPUT", "SELECT", "TEXTAREA"].includes(o == null ? void 0 : o.nodeName) || a || !!i;
}
function ku(e) {
  return e.ctrlKey || e.metaKey || e.shiftKey;
}
function Mu(e, t) {
  return (n) => e.some((o) => {
    const a = o.split("+").map((i) => i.trim().toLowerCase());
    return a.length === 1 ? n.key === o : (t.add(n.key.toLowerCase()), a.every((i) => t.has(i)));
  });
}
const bt = (e, t) => {
  const n = Kn(), o = J(re(e) === !0), a = J(!1), i = J(/* @__PURE__ */ new Set());
  return se(o, () => {
    t == null || t(o.value);
  }), se(
    () => re(e),
    (r) => {
      if (n && typeof n.addEventListener < "u" && Un(n, "blur", () => {
        o.value = !1;
      }), Ci(r)) {
        o.value = r;
        return;
      }
      Array.isArray(r) && (r = Mu(r, i.value)), r && (co(
        r,
        (l) => {
          a.value = ku(l), !(!a.value && zn(l)) && (l.preventDefault(), o.value = !0);
        },
        { eventName: "keydown" }
      ), co(
        r,
        (l) => {
          if (o.value) {
            if (!a.value && zn(l))
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
}, Pu = ve({
  name: "Node",
  compatConfig: { MODE: 3 },
  props: ["name", "type", "id", "draggable", "selectable", "focusable", "connectable", "node", "resizeObserver"],
  setup(e) {
    it(Ea, e.id);
    const t = de(), n = k(t, "id"), o = k(t, "edges"), a = k(t, "noPanClassName"), i = k(t, "selectNodesOnDrag"), r = k(t, "nodesSelectionActive"), l = k(t, "multiSelectionActive"), u = k(t, "emits"), c = k(t, "findNode"), s = k(t, "removeSelectedNodes"), d = k(t, "addSelectedNodes"), v = k(t, "updateNodeDimensions"), b = k(t, "onUpdateNodeInternals"), g = k(t, "getIntersectingNodes"), w = k(t, "getNodeTypes"), E = k(t, "nodeExtent"), _ = k(t, "elevateNodesOnSelect"), $ = k(t, "disableKeyboardA11y"), Y = k(t, "ariaLiveMessage"), m = k(t, "snapToGrid"), O = k(t, "snapGrid"), x = Ca(), h = yt(e, "node"), S = Q(() => c.value(h.value.parentNode)), T = Q(() => tn([h.value], o.value)), C = J();
    it(Sa, C);
    const { emit: D, on: ee } = Br(h.value, u.value), ae = Ga({
      id: e.id,
      el: C,
      disabled: () => !e.draggable,
      selectable: () => e.selectable,
      onStart(I) {
        D.dragStart({ ...I, intersections: g.value(h.value) });
      },
      onDrag(I) {
        D.drag({ ...I, intersections: g.value(h.value) });
      },
      onStop(I) {
        D.dragStop({ ...I, intersections: g.value(h.value) });
      }
    }), p = Q(() => h.value.class instanceof Function ? h.value.class(h.value) : h.value.class), R = Q(() => {
      const I = (h.value.style instanceof Function ? h.value.style(h.value) : h.value.style) || {}, f = h.value.width instanceof Function ? h.value.width(h.value) : h.value.width, y = h.value.height instanceof Function ? h.value.height(h.value) : h.value.height;
      return f && (I.width = typeof f == "string" ? f : `${f}px`), y && (I.height = typeof y == "string" ? y : `${y}px`), I;
    }), N = () => Number(h.value.zIndex ?? R.value.zIndex ?? 0);
    return b.value((I) => {
      I.includes(e.id) && H();
    }), ze(() => {
      e.resizeObserver.observe(C.value);
    }), Gn(() => {
      e.resizeObserver.unobserve(C.value);
    }), se(
      [() => h.value.type, () => h.value.sourcePosition, () => h.value.targetPosition],
      () => {
        v.value([{ id: e.id, nodeElement: C.value, forceUpdate: !0 }]);
      },
      { flush: "pre" }
    ), se(
      [
        () => h.value.position.x,
        () => h.value.position.y,
        () => {
          var I;
          return (I = S.value) == null ? void 0 : I.computedPosition.x;
        },
        () => {
          var I;
          return (I = S.value) == null ? void 0 : I.computedPosition.y;
        },
        () => {
          var I;
          return (I = S.value) == null ? void 0 : I.computedPosition.z;
        },
        () => N(),
        () => h.value.selected,
        () => h.value.dimensions.height,
        () => h.value.dimensions.width,
        () => {
          var I;
          return (I = S.value) == null ? void 0 : I.dimensions.height;
        },
        () => {
          var I;
          return (I = S.value) == null ? void 0 : I.dimensions.width;
        }
      ],
      ([I, f, y, L, A, F]) => {
        const X = {
          x: I,
          y: f,
          z: F + (_.value && h.value.selected ? 1e3 : 0)
        };
        Te(y) && Te(L) ? h.value.computedPosition = fr({ x: y, y: L, z: A }, X) : h.value.computedPosition = X;
      },
      { flush: "pre", immediate: !0 }
    ), se([() => h.value.extent, () => E.value], ([I, f], [y, L]) => {
      (I !== y || f !== L) && z();
    }), h.value.extent === "parent" || typeof h.value.extent == "object" && "range" in h.value.extent && h.value.extent.range === "parent" ? ye(() => h.value.initialized).toBe(!0).then(z) : z(), () => le(
      "div",
      {
        ref: C,
        "data-id": h.value.id,
        class: [
          "vue-flow__node",
          `vue-flow__node-${e.type === !1 ? "default" : e.name}`,
          {
            [a.value]: e.draggable,
            dragging: ae == null ? void 0 : ae.value,
            selected: h.value.selected,
            selectable: e.selectable
          },
          p.value
        ],
        style: {
          zIndex: h.value.computedPosition.z ?? N(),
          transform: `translate(${h.value.computedPosition.x}px,${h.value.computedPosition.y}px)`,
          pointerEvents: e.selectable || e.draggable ? "all" : "none",
          visibility: h.value.initialized ? "visible" : "hidden",
          ...R.value
        },
        tabIndex: e.focusable ? 0 : void 0,
        role: e.focusable ? "button" : void 0,
        "aria-describedby": $.value ? void 0 : `${ja}-${n.value}`,
        "aria-label": h.value.ariaLabel,
        onMouseenter: W,
        onMousemove: B,
        onMouseleave: U,
        onContextmenu: V,
        onClick: G,
        onDblclick: Z,
        onKeydown: te
      },
      [
        le(e.type === !1 ? w.value.default : e.type, {
          id: h.value.id,
          type: h.value.type,
          data: h.value.data,
          events: { ...h.value.events, ...ee },
          selected: !!h.value.selected,
          resizing: !!h.value.resizing,
          dragging: ae.value,
          connectable: e.connectable,
          position: h.value.position,
          dimensions: h.value.dimensions,
          isValidTargetPos: h.value.isValidTargetPos,
          isValidSourcePos: h.value.isValidSourcePos,
          parent: h.value.parentNode,
          zIndex: h.value.computedPosition.z,
          targetPosition: h.value.targetPosition,
          sourcePosition: h.value.sourcePosition,
          label: h.value.label,
          dragHandle: h.value.dragHandle,
          onUpdateNodeInternals: H
        })
      ]
    );
    function z() {
      const I = h.value.computedPosition;
      m.value && (I.x = O.value[0] * Math.round(I.x / O.value[0]), I.y = O.value[1] * Math.round(I.y / O.value[1]));
      const { computedPosition: f, position: y } = qn(h.value, I, u.value.error, E.value, S.value);
      (h.value.computedPosition.x !== f.x || h.value.computedPosition.y !== f.y) && (h.value.computedPosition = { ...h.value.computedPosition, ...f }), (h.value.position.x !== y.x || h.value.position.y !== y.y) && (h.value.position = y);
    }
    function H() {
      C.value && v.value([{ id: e.id, nodeElement: C.value, forceUpdate: !0 }]);
    }
    function W(I) {
      ae != null && ae.value || D.mouseEnter({ event: I, node: h.value, connectedEdges: T.value });
    }
    function B(I) {
      ae != null && ae.value || D.mouseMove({ event: I, node: h.value, connectedEdges: T.value });
    }
    function U(I) {
      ae != null && ae.value || D.mouseLeave({ event: I, node: h.value, connectedEdges: T.value });
    }
    function V(I) {
      return D.contextMenu({ event: I, node: h.value, connectedEdges: T.value });
    }
    function Z(I) {
      return D.doubleClick({ event: I, node: h.value, connectedEdges: T.value });
    }
    function G(I) {
      e.selectable && (!i.value || !e.draggable) && Dn(
        h.value,
        l.value,
        d.value,
        s.value,
        r,
        !1,
        C.value
      ), D.click({ event: I, node: h.value, connectedEdges: T.value });
    }
    function te(I) {
      var f;
      if (!zn(I))
        if (Ua.includes(I.key) && e.selectable) {
          const y = I.key === "Escape";
          y && ((f = C.value) == null || f.blur()), Dn(
            h.value,
            l.value,
            d.value,
            s.value,
            r,
            y,
            C.value
          );
        } else
          !$.value && e.draggable && h.value.selected && ot[I.key] && (Y.value = `Moved selected node ${I.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~h.value.position.x}, y: ${~~h.value.position.y}`, x(
            {
              x: ot[I.key].x,
              y: ot[I.key].y
            },
            I.shiftKey
          ));
    }
  }
}), Cu = Pu, Iu = ["transform"], Ou = ["width", "height", "x", "y", "rx", "ry"], $u = ["y"], Tu = {
  name: "EdgeText",
  compatConfig: { MODE: 3 }
}, Du = /* @__PURE__ */ ve({
  ...Tu,
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
    let t = J({ x: 0, y: 0, width: 0, height: 0 });
    const n = J(null), o = Q(() => `translate(${e.x - t.value.width / 2} ${e.y - t.value.height / 2})`);
    ze(a), se([() => e.x, () => e.y, n, () => e.label], a);
    function a() {
      if (!n.value)
        return;
      const i = n.value.getBBox();
      (i.width !== t.value.width || i.height !== t.value.height) && (t.value = i);
    }
    return (i, r) => (oe(), ie("g", {
      transform: M(o),
      class: "vue-flow__edge-textwrapper"
    }, [
      e.labelShowBg ? (oe(), ie("rect", {
        key: 0,
        class: "vue-flow__edge-textbg",
        width: `${M(t).width + 2 * e.labelBgPadding[0]}px`,
        height: `${M(t).height + 2 * e.labelBgPadding[1]}px`,
        x: -e.labelBgPadding[0],
        y: -e.labelBgPadding[1],
        style: Re(e.labelBgStyle),
        rx: e.labelBgBorderRadius,
        ry: e.labelBgBorderRadius
      }, null, 12, Ou)) : fe("", !0),
      ce("text", Xt(i.$attrs, {
        ref_key: "el",
        ref: n,
        class: "vue-flow__edge-text",
        y: M(t).height / 2,
        dy: "0.3em",
        style: e.labelStyle
      }), [
        we(i.$slots, "default", {}, () => [
          M(De)(e.label) ? (oe(), ie(Se, { key: 1 }, [
            ra(ut(e.label), 1)
          ], 64)) : (oe(), xe(aa(e.label), { key: 0 }))
        ])
      ], 16, $u)
    ], 8, Iu));
  }
}), sn = function({
  path: e,
  label: t,
  labelX: n,
  labelY: o,
  labelBgBorderRadius: a,
  labelBgPadding: i,
  labelBgStyle: r,
  labelShowBg: l = !0,
  labelStyle: u,
  markerStart: c,
  markerEnd: s,
  interactionWidth: d = 20
}, { attrs: v }) {
  return [
    le("path", {
      style: v.style,
      class: ["vue-flow__edge-path", v.class].join(" "),
      d: e,
      "marker-end": s,
      "marker-start": c
    }),
    d ? le("path", {
      d: e,
      fill: "none",
      "stroke-opacity": 0,
      "stroke-width": d
    }) : null,
    t && Te(n) && Te(o) ? le(Du, {
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
sn.props = [
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
sn.inheritAttrs = !1;
sn.compatConfig = { MODE: 3 };
const cn = sn;
function Ka({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const a = Math.abs(n - e) / 2, i = n < e ? n + a : n - a, r = Math.abs(o - t) / 2, l = o < t ? o + r : o - r;
  return [i, l, a, r];
}
function Wa({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o,
  sourceControlX: a,
  sourceControlY: i,
  targetControlX: r,
  targetControlY: l
}) {
  const u = e * 0.125 + a * 0.375 + r * 0.375 + n * 0.125, c = t * 0.125 + i * 0.375 + l * 0.375 + o * 0.125, s = Math.abs(u - e), d = Math.abs(c - t);
  return [u, c, s, d];
}
function Ot(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function $o({ pos: e, x1: t, y1: n, x2: o, y2: a, c: i }) {
  let r, l;
  switch (e) {
    case q.Left:
      r = t - Ot(t - o, i), l = n;
      break;
    case q.Right:
      r = t + Ot(o - t, i), l = n;
      break;
    case q.Top:
      r = t, l = n - Ot(n - a, i);
      break;
    case q.Bottom:
      r = t, l = n + Ot(a - n, i);
      break;
  }
  return [r, l];
}
function Ut({
  sourceX: e,
  sourceY: t,
  sourcePosition: n = q.Bottom,
  targetX: o,
  targetY: a,
  targetPosition: i = q.Top,
  curvature: r = 0.25
}) {
  const [l, u] = $o({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: a,
    c: r
  }), [c, s] = $o({
    pos: i,
    x1: o,
    y1: a,
    x2: e,
    y2: t,
    c: r
  }), [d, v, b, g] = Wa({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: a,
    sourceControlX: l,
    sourceControlY: u,
    targetControlX: c,
    targetControlY: s
  });
  return [
    `M${e},${t} C${l},${u} ${c},${s} ${o},${a}`,
    d,
    v,
    b,
    g
  ];
}
const dn = function({ sourcePosition: e = q.Bottom, targetPosition: t = q.Top, ...n }, { attrs: o }) {
  const [a, i, r] = Ut({
    sourcePosition: e,
    targetPosition: t,
    ...n
  });
  return le(cn, {
    path: a,
    labelX: i,
    labelY: r,
    ...n,
    ...o
  });
};
dn.props = [
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
dn.inheritAttrs = !1;
dn.compatConfig = { MODE: 3 };
const Bu = dn;
function To({ pos: e, x1: t, y1: n, x2: o, y2: a }) {
  let i, r;
  switch (e) {
    case q.Left:
    case q.Right:
      i = 0.5 * (t + o), r = n;
      break;
    case q.Top:
    case q.Bottom:
      i = t, r = 0.5 * (n + a);
      break;
  }
  return [i, r];
}
function Za({
  sourceX: e,
  sourceY: t,
  sourcePosition: n = q.Bottom,
  targetX: o,
  targetY: a,
  targetPosition: i = q.Top
}) {
  const [r, l] = To({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: a
  }), [u, c] = To({
    pos: i,
    x1: o,
    y1: a,
    x2: e,
    y2: t
  }), [s, d, v, b] = Wa({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: a,
    sourceControlX: r,
    sourceControlY: l,
    targetControlX: u,
    targetControlY: c
  });
  return [
    `M${e},${t} C${r},${l} ${u},${c} ${o},${a}`,
    s,
    d,
    v,
    b
  ];
}
const vn = function({ sourcePosition: e = q.Bottom, targetPosition: t = q.Top, ...n }, { attrs: o }) {
  const [a, i, r] = Za({
    sourcePosition: e,
    targetPosition: t,
    ...n
  });
  return le(cn, {
    path: a,
    labelX: i,
    labelY: r,
    ...n,
    ...o
  });
};
vn.props = [
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
vn.inheritAttrs = !1;
vn.compatConfig = { MODE: 3 };
const Au = vn, Do = {
  [q.Left]: { x: -1, y: 0 },
  [q.Right]: { x: 1, y: 0 },
  [q.Top]: { x: 0, y: -1 },
  [q.Bottom]: { x: 0, y: 1 }
};
function zu({
  source: e,
  sourcePosition: t = q.Bottom,
  target: n
}) {
  return t === q.Left || t === q.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
}
function Bo(e, t) {
  return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
}
function Ru({
  source: e,
  sourcePosition: t = q.Bottom,
  target: n,
  targetPosition: o = q.Top,
  center: a,
  offset: i
}) {
  const r = Do[t], l = Do[o], u = { x: e.x + r.x * i, y: e.y + r.y * i }, c = { x: n.x + l.x * i, y: n.y + l.y * i }, s = zu({
    source: u,
    sourcePosition: t,
    target: c
  }), d = s.x !== 0 ? "x" : "y", v = s[d];
  let b, g, w;
  const [E, _, $, Y] = Ka({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (r[d] * l[d] === -1) {
    g = a.x || E, w = a.y || _;
    const m = [
      { x: g, y: u.y },
      { x: g, y: c.y }
    ], O = [
      { x: u.x, y: w },
      { x: c.x, y: w }
    ];
    r[d] === v ? b = d === "x" ? m : O : b = d === "x" ? O : m;
  } else {
    const m = [{ x: u.x, y: c.y }], O = [{ x: c.x, y: u.y }];
    if (d === "x" ? b = r.x === v ? O : m : b = r.y === v ? m : O, t !== o) {
      const x = d === "x" ? "y" : "x", h = r[d] === l[x], S = u[x] > c[x], T = u[x] < c[x];
      (r[d] === 1 && (!h && S || h && T) || r[d] !== 1 && (!h && T || h && S)) && (b = d === "x" ? m : O);
    }
    g = b[0].x, w = b[0].y;
  }
  return [[e, u, ...b, c, n], g, w, $, Y];
}
function Vu(e, t, n, o) {
  const a = Math.min(Bo(e, t) / 2, Bo(t, n) / 2, o), { x: i, y: r } = t;
  if (e.x === i && i === n.x || e.y === r && r === n.y)
    return `L${i} ${r}`;
  if (e.y === r) {
    const c = e.x < n.x ? -1 : 1, s = e.y < n.y ? 1 : -1;
    return `L ${i + a * c},${r}Q ${i},${r} ${i},${r + a * s}`;
  }
  const l = e.x < n.x ? 1 : -1, u = e.y < n.y ? -1 : 1;
  return `L ${i},${r + a * u}Q ${i},${r} ${i + a * l},${r}`;
}
function Rn({
  sourceX: e,
  sourceY: t,
  sourcePosition: n = q.Bottom,
  targetX: o,
  targetY: a,
  targetPosition: i = q.Top,
  borderRadius: r = 5,
  centerX: l,
  centerY: u,
  offset: c = 20
}) {
  const [s, d, v, b, g] = Ru({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: o, y: a },
    targetPosition: i,
    center: { x: l, y: u },
    offset: c
  });
  return [s.reduce((w, E, _) => {
    let $;
    return _ > 0 && _ < s.length - 1 ? $ = Vu(s[_ - 1], E, s[_ + 1], r) : $ = `${_ === 0 ? "M" : "L"}${E.x} ${E.y}`, w += $, w;
  }, ""), d, v, b, g];
}
const fn = function({ sourcePosition: e = q.Bottom, targetPosition: t = q.Top, ...n }, { attrs: o }) {
  const [a, i, r] = Rn({
    sourcePosition: e,
    targetPosition: t,
    ...n
  });
  return le(cn, {
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
  "borderRadius",
  "markerEnd",
  "markerStart",
  "interactionWidth",
  "offset"
];
fn.inheritAttrs = !1;
fn.compatConfig = { MODE: 3 };
const qa = fn, hn = function(e, { attrs: t }) {
  return le(qa, { ...e, ...t, borderRadius: 0 });
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
  "markerEnd",
  "markerStart",
  "interactionWidth"
];
hn.inheritAttrs = !1;
hn.compatConfig = { MODE: 3 };
const Lu = hn;
function Qa({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const [a, i, r, l] = Ka({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: o
  });
  return [`M ${e},${t}L ${n},${o}`, a, i, r, l];
}
const gn = function(e, { attrs: t }) {
  const [n, o, a] = Qa(e);
  return le(cn, {
    path: n,
    labelX: o,
    labelY: a,
    ...e,
    ...t
  });
};
gn.props = [
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
gn.inheritAttrs = !1;
gn.compatConfig = { MODE: 3 };
const Fu = gn;
function Xu(e, t, n) {
  return n === q.Left ? e - t : n === q.Right ? e + t : e;
}
function Yu(e, t, n) {
  return n === q.Top ? e - t : n === q.Bottom ? e + t : e;
}
const eo = function({
  radius: e = 10,
  centerX: t = 0,
  centerY: n = 0,
  position: o = q.Top,
  type: a
}) {
  return le("circle", {
    class: `vue-flow__edgeupdater vue-flow__edgeupdater-${a}`,
    cx: Xu(t, e, o),
    cy: Yu(n, e, o),
    r: e,
    stroke: "transparent",
    fill: "transparent"
  });
};
eo.props = ["radius", "centerX", "centerY", "position", "type"];
eo.compatConfig = { MODE: 3 };
const Ao = eo;
function Gu() {
  return {
    doubleClick: j(),
    click: j(),
    mouseEnter: j(),
    mouseMove: j(),
    mouseLeave: j(),
    contextMenu: j(),
    updateStart: j(),
    update: j(),
    updateEnd: j()
  };
}
function ju(e, t) {
  const n = Gu();
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
const Hu = ve({
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
      removeSelectedEdges: c,
      findEdge: s,
      findNode: d,
      isValidConnection: v
    } = de(), b = ju(e.edge, i), g = yt(e, "edge");
    let w = J(!1), E = J(!1);
    const _ = J(""), $ = J(null), Y = J("source"), m = J();
    it(pr, e.id), it(mr, m);
    const O = Q(() => g.value.class instanceof Function ? g.value.class(g.value) : g.value.class), x = Q(() => g.value.style instanceof Function ? g.value.style(g.value) : g.value.style), { handlePointerDown: h } = Ma({
      nodeId: _,
      handleId: $,
      type: Y,
      isValidConnection: v.value,
      edgeUpdaterType: Y,
      onEdgeUpdate: C,
      onEdgeUpdateEnd: D
    });
    return () => {
      const V = d(g.value.source), Z = d(g.value.target);
      if (!V || !Z || !g.value)
        return null;
      let G;
      o.value === Ke.Strict ? G = V.handleBounds.source : G = [...V.handleBounds.source || [], ...V.handleBounds.target || []];
      const te = So(G, g.value.sourceHandle);
      let I;
      o.value === Ke.Strict ? I = Z.handleBounds.target : I = [...Z.handleBounds.target || [], ...Z.handleBounds.source || []];
      const f = So(I, g.value.targetHandle), y = te ? te.position : q.Bottom, L = f ? f.position : q.Top, { sourceX: A, sourceY: F, targetY: X, targetX: P } = br(
        V,
        te,
        y,
        Z,
        f,
        L
      );
      return g.value.sourceX = A, g.value.sourceY = F, g.value.targetX = P, g.value.targetY = X, le(
        "g",
        {
          ref: m,
          key: e.id,
          "data-id": e.id,
          class: [
            "vue-flow__edge",
            `vue-flow__edge-${e.type === !1 ? "default" : e.name}`,
            l.value,
            O.value,
            {
              updating: w.value,
              selected: g.value.selected,
              animated: g.value.animated,
              inactive: !e.selectable
            }
          ],
          onClick: ae,
          onContextmenu: p,
          onDblclick: R,
          onMouseenter: N,
          onMousemove: z,
          onMouseleave: H,
          onKeyDown: e.focusable ? U : void 0,
          tabIndex: e.focusable ? 0 : void 0,
          "aria-label": g.value.ariaLabel === null ? void 0 : g.value.ariaLabel || `Edge from ${g.value.source} to ${g.value.target}`,
          "aria-describedby": e.focusable ? `${Ha}-${t}` : void 0,
          role: e.focusable ? "button" : void 0
        },
        [
          E.value ? null : le(e.type === !1 ? u.value.default : e.type, {
            id: e.id,
            sourceNode: V,
            targetNode: Z,
            source: g.value.source,
            target: g.value.target,
            type: g.value.type,
            updatable: e.updatable,
            selected: g.value.selected,
            animated: g.value.animated,
            label: g.value.label,
            labelStyle: g.value.labelStyle,
            labelShowBg: g.value.labelShowBg,
            labelBgStyle: g.value.labelBgStyle,
            labelBgPadding: g.value.labelBgPadding,
            labelBgBorderRadius: g.value.labelBgBorderRadius,
            data: g.value.data,
            events: { ...g.value.events, ...b.on },
            style: x.value,
            markerStart: `url(#${Ge(g.value.markerStart, t)})`,
            markerEnd: `url(#${Ge(g.value.markerEnd, t)})`,
            sourcePosition: y,
            targetPosition: L,
            sourceX: A,
            sourceY: F,
            targetX: P,
            targetY: X,
            sourceHandleId: g.value.sourceHandle,
            targetHandleId: g.value.targetHandle,
            interactionWidth: g.value.interactionWidth
          }),
          [
            e.updatable === "source" || e.updatable === !0 ? [
              le(
                "g",
                {
                  onMousedown: W,
                  onMouseenter: S,
                  onMouseout: T
                },
                le(Ao, {
                  position: y,
                  centerX: A,
                  centerY: F,
                  radius: a.value,
                  type: "source",
                  "data-type": "source"
                })
              )
            ] : null,
            e.updatable === "target" || e.updatable === !0 ? [
              le(
                "g",
                {
                  onMousedown: B,
                  onMouseenter: S,
                  onMouseout: T
                },
                le(Ao, {
                  position: L,
                  centerX: P,
                  centerY: X,
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
    function S() {
      w.value = !0;
    }
    function T() {
      w.value = !1;
    }
    function C(V, Z) {
      b.emit.update({ event: V, edge: g.value, connection: Z });
    }
    function D(V) {
      b.emit.updateEnd({ event: V, edge: g.value }), E.value = !1;
    }
    function ee(V, Z) {
      V.button === 0 && (E.value = !0, _.value = Z ? g.value.target : g.value.source, $.value = (Z ? g.value.targetHandle : g.value.sourceHandle) ?? "", Y.value = Z ? "target" : "source", b.emit.updateStart({ event: V, edge: g.value }), h(V));
    }
    function ae(V) {
      const Z = { event: V, edge: g.value };
      e.selectable && (r.value = !1, n([g.value])), b.emit.click(Z);
    }
    function p(V) {
      b.emit.contextMenu({ event: V, edge: g.value });
    }
    function R(V) {
      b.emit.doubleClick({ event: V, edge: g.value });
    }
    function N(V) {
      b.emit.mouseEnter({ event: V, edge: g.value });
    }
    function z(V) {
      b.emit.mouseMove({ event: V, edge: g.value });
    }
    function H(V) {
      b.emit.mouseLeave({ event: V, edge: g.value });
    }
    function W(V) {
      ee(V, !0);
    }
    function B(V) {
      ee(V, !1);
    }
    function U(V) {
      var Z;
      Ua.includes(V.key) && e.selectable && (V.key === "Escape" ? ((Z = m.value) == null || Z.blur(), c([s(e.id)])) : n([s(e.id)]));
    }
  }
}), Uu = Hu, Ku = {
  height: "0",
  width: "0"
}, Wu = {
  name: "EdgeLabelRenderer",
  compatConfig: { MODE: 3 }
}, Zu = /* @__PURE__ */ ve({
  ...Wu,
  setup(e) {
    const { viewportRef: t } = de(), n = Q(() => {
      var o;
      return (o = t.value) == null ? void 0 : o.getElementsByClassName("vue-flow__edge-labels")[0];
    });
    return (o, a) => (oe(), ie("svg", null, [
      (oe(), ie("foreignObject", Ku, [
        (oe(), xe(mi, {
          to: M(n),
          disabled: !M(n)
        }, [
          we(o.$slots, "default")
        ], 8, ["to", "disabled"]))
      ]))
    ]));
  }
}), qu = { class: "vue-flow__connection" }, Qu = ["d", "marker-end", "marker-start"], Ju = {
  name: "ConnectionLine",
  compatConfig: { MODE: 3 }
}, es = /* @__PURE__ */ ve({
  ...Ju,
  props: {
    sourceNode: null
  },
  setup(e) {
    var t;
    const n = de(), o = k(n, "connectionMode"), a = k(n, "connectionStartHandle"), i = k(n, "connectionEndHandle"), r = k(n, "connectionPosition"), l = k(n, "connectionLineType"), u = k(n, "connectionLineStyle"), c = k(n, "connectionLineOptions"), s = k(n, "connectionStatus"), d = k(n, "viewport"), v = k(n, "findNode"), b = {
      [q.Left]: q.Right,
      [q.Right]: q.Left,
      [q.Top]: q.Bottom,
      [q.Bottom]: q.Top
    }, g = (t = rt(nn)) == null ? void 0 : t["connection-line"], w = Q(() => a.value.handleId), E = Q(() => a.value.type), _ = Q(() => {
      var C;
      return ((C = i.value) == null ? void 0 : C.handleId) && v.value(i.value.nodeId) || null;
    }), $ = Q(
      () => {
        var C, D;
        return (o.value === Ke.Strict ? (C = e.sourceNode.handleBounds[E.value]) == null ? void 0 : C.find((ee) => ee.id === w.value) : [...e.sourceNode.handleBounds.source || [], ...e.sourceNode.handleBounds.target || []].find((ee) => ee.id === w.value)) || ((D = e.sourceNode.handleBounds[E.value ?? "source"]) == null ? void 0 : D[0]);
      }
    ), Y = Q(() => {
      var C, D, ee;
      return _.value && ((C = i.value) == null ? void 0 : C.handleId) && ((o.value === Ke.Strict ? (D = _.value.handleBounds[E.value === "source" ? "target" : "source"]) == null ? void 0 : D.find(
        (ae) => {
          var p;
          return ae.id === ((p = i.value) == null ? void 0 : p.handleId);
        }
      ) : [..._.value.handleBounds.source || [], ..._.value.handleBounds.target || []].find(
        (ae) => {
          var p;
          return ae.id === ((p = i.value) == null ? void 0 : p.handleId);
        }
      )) || ((ee = _.value.handleBounds[E.value ?? "target"]) == null ? void 0 : ee[0])) || null;
    }), m = Q(() => {
      var C;
      return (C = $.value) == null ? void 0 : C.position;
    }), O = Q(() => $.value ? jt(
      m.value || q.Top,
      { ...e.sourceNode.dimensions, ...e.sourceNode.computedPosition },
      $.value
    ) : {
      x: e.sourceNode.dimensions.width / 2,
      y: e.sourceNode.dimensions.height / 2
    }), x = Q(() => m.value ? b[m.value] : void 0), h = Q(() => (r.value.x - d.value.x) / d.value.zoom), S = Q(() => (r.value.y - d.value.y) / d.value.zoom), T = Q(() => {
      let C;
      const D = {
        sourceX: O.value.x,
        sourceY: O.value.y,
        sourcePosition: m.value,
        targetX: h.value,
        targetY: S.value,
        targetPosition: x.value
      };
      switch (l.value ?? c.value.type) {
        case Ye.Bezier:
          [C] = Ut(D);
          break;
        case Ye.Step:
          [C] = Rn({
            ...D,
            borderRadius: 0
          });
          break;
        case Ye.SmoothStep:
          [C] = Rn(D);
          break;
        case Ye.SimpleBezier:
          [C] = Za(D);
          break;
        case Ye.Straight:
          [C] = Qa(D);
          break;
        default:
          [C] = Ut(D);
          break;
      }
      return C;
    });
    return (C, D) => {
      var ee;
      return oe(), ie("g", qu, [
        M(g) ? (oe(), xe(aa(M(g)), ki(Xt({ key: 0 }, {
          sourceX: M(O).x,
          sourceY: M(O).y,
          sourcePosition: (ee = M($)) == null ? void 0 : ee.position,
          targetX: M(h),
          targetY: M(S),
          targetPosition: M(x),
          sourceNode: e.sourceNode,
          sourceHandle: M($),
          targetNode: M(_),
          targetHandle: M(Y),
          markerEnd: `url(#${M(Ge)(M(c).markerEnd)})`,
          markerStart: `url(#${M(Ge)(M(c).markerStart)})`,
          connectionStatus: M(s)
        })), null, 16)) : (oe(), ie("path", {
          key: 1,
          d: M(T),
          class: Ue(["vue-flow__connection-path", [M(c).class, M(s)]]),
          style: Re(M(u) || M(c).style || {}),
          "marker-end": `url(#${M(Ge)(M(c).markerEnd)})`,
          "marker-start": `url(#${M(Ge)(M(c).markerStart)})`
        }, null, 14, Qu))
      ]);
    };
  }
}), ts = ["tabIndex"], ns = {
  name: "NodesSelection",
  compatConfig: { MODE: 3 }
}, os = /* @__PURE__ */ ve({
  ...ns,
  setup(e) {
    const t = de(), n = k(t, "emits"), o = k(t, "viewport"), a = k(t, "getSelectedNodes"), i = k(t, "noPanClassName"), r = k(t, "disableKeyboardA11y"), l = k(t, "userSelectionActive"), u = Ca(), c = J(), s = Ga({
      el: c,
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
    ze(() => {
      var w;
      r.value || (w = c.value) == null || w.focus({ preventScroll: !0 });
    });
    const d = Q(() => wa(a.value)), v = Q(() => ({
      width: `${d.value.width}px`,
      height: `${d.value.height}px`,
      top: `${d.value.y}px`,
      left: `${d.value.x}px`
    }));
    function b(w) {
      n.value.selectionContextMenu({ event: w, nodes: a.value });
    }
    function g(w) {
      r.value || ot[w.key] && u(
        {
          x: ot[w.key].x,
          y: ot[w.key].y
        },
        w.shiftKey
      );
    }
    return (w, E) => !M(l) && M(d).width && M(d).height ? (oe(), ie("div", {
      key: 0,
      class: Ue(["vue-flow__nodesselection vue-flow__container", M(i)]),
      style: Re({ transform: `translate(${M(o).x}px,${M(o).y}px) scale(${M(o).zoom})` })
    }, [
      ce("div", {
        ref_key: "el",
        ref: c,
        class: Ue([{ dragging: M(s) }, "vue-flow__nodesselection-rect"]),
        style: Re(M(v)),
        tabIndex: M(r) ? void 0 : -1,
        onContextmenu: b,
        onKeydown: g
      }, null, 46, ts)
    ], 6)) : fe("", !0);
  }
}), as = {
  name: "UserSelection",
  compatConfig: { MODE: 3 }
}, is = /* @__PURE__ */ ve({
  ...as,
  setup(e) {
    const { userSelectionRect: t } = de();
    return (n, o) => {
      var a, i, r, l;
      return oe(), ie("div", {
        class: "vue-flow__selection vue-flow__container",
        style: Re({
          width: `${(a = M(t)) == null ? void 0 : a.width}px`,
          height: `${(i = M(t)) == null ? void 0 : i.height}px`,
          transform: `translate(${(r = M(t)) == null ? void 0 : r.x}px, ${(l = M(t)) == null ? void 0 : l.y}px)`
        })
      }, null, 4);
    };
  }
}), rs = {
  input: Cr,
  default: Pr,
  output: Ir
}, ls = {
  default: Bu,
  straight: Fu,
  step: Lu,
  smoothstep: qa,
  simplebezier: Au
};
function us() {
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
    selectionMode: Wn.Full,
    paneDragging: !1,
    preventScrolling: !0,
    zoomOnScroll: !0,
    zoomOnPinch: !0,
    zoomOnDoubleClick: !0,
    panOnScroll: !1,
    panOnScrollSpeed: 0.5,
    panOnScrollMode: Gt.Free,
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
      type: Ye.Bezier,
      style: {}
    },
    connectionMode: Ke.Loose,
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
    hooks: ar(),
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
function Ja(e) {
  const t = us();
  return e && Object.keys(e).forEach((n) => {
    const o = e[n];
    ue(o) && (t[n] = o);
  }), t;
}
function ss(e, t, n) {
  const o = Q(() => (w) => e.nodes && !t.value.length ? e.nodes.find((E) => E.id === w) : e.nodes[t.value.indexOf(w)]), a = Q(() => (w) => e.edges && !n.value.length ? e.edges.find((E) => E.id === w) : e.edges[n.value.indexOf(w)]), i = Q(() => {
    var w;
    const E = {
      ...ls,
      ...e.edgeTypes
    }, _ = Object.keys(E);
    return (w = e.edges) == null || w.forEach(($) => $.type && !_.includes($.type) && (E[$.type] = $.type)), E;
  }), r = Q(() => {
    var w;
    const E = {
      ...rs,
      ...e.nodeTypes
    }, _ = Object.keys(E);
    return (w = e.nodes) == null || w.forEach(($) => $.type && !_.includes($.type) && (E[$.type] = $.type)), E;
  }), l = Q(() => {
    const w = e.nodes.filter((E) => !E.hidden);
    return e.onlyRenderVisibleElements ? w && xa(
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
      e.hooks.error.trigger(new ge(he.EDGE_ORPHANED, w.id));
      return;
    }
    return !w.hidden && !_.hidden && !E.hidden;
  }, c = Q(() => e.onlyRenderVisibleElements ? e.edges.filter((w) => {
    const E = o.value(w.source), _ = o.value(w.target);
    return u(w, E, _) && wr({
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
  }) : e.edges.filter((w) => u(w))), s = Q(() => [...l.value, ...c.value]), d = Q(() => e.nodes.filter((w) => w.selected)), v = Q(() => e.edges.filter((w) => w.selected)), b = Q(() => [
    ...d.value ?? [],
    ...v.value ?? []
  ]), g = Q(
    () => l.value.filter((w) => w.initialized && w.handleBounds !== void 0)
  );
  return {
    getNode: o,
    getEdge: a,
    getElements: s,
    getEdgeTypes: i,
    getNodeTypes: r,
    getEdges: c,
    getNodes: l,
    getSelectedElements: b,
    getSelectedNodes: d,
    getSelectedEdges: v,
    getNodesInitialized: g
  };
}
function to(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function ei(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t)
    n[o] = t[o];
  return n;
}
function Mt() {
}
var xt = 0.7, Kt = 1 / xt, at = "\\s*([+-]?\\d+)\\s*", _t = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ce = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", cs = /^#([0-9a-f]{3,8})$/, ds = new RegExp(`^rgb\\(${at},${at},${at}\\)$`), vs = new RegExp(`^rgb\\(${Ce},${Ce},${Ce}\\)$`), fs = new RegExp(`^rgba\\(${at},${at},${at},${_t}\\)$`), hs = new RegExp(`^rgba\\(${Ce},${Ce},${Ce},${_t}\\)$`), gs = new RegExp(`^hsl\\(${_t},${Ce},${Ce}\\)$`), ps = new RegExp(`^hsla\\(${_t},${Ce},${Ce},${_t}\\)$`), zo = {
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
to(Mt, Et, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ro,
  // Deprecated! Use color.formatHex.
  formatHex: Ro,
  formatHex8: ms,
  formatHsl: ys,
  formatRgb: Vo,
  toString: Vo
});
function Ro() {
  return this.rgb().formatHex();
}
function ms() {
  return this.rgb().formatHex8();
}
function ys() {
  return ti(this).formatHsl();
}
function Vo() {
  return this.rgb().formatRgb();
}
function Et(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = cs.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Lo(t) : n === 3 ? new me(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? $t(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? $t(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = ds.exec(e)) ? new me(t[1], t[2], t[3], 1) : (t = vs.exec(e)) ? new me(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = fs.exec(e)) ? $t(t[1], t[2], t[3], t[4]) : (t = hs.exec(e)) ? $t(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = gs.exec(e)) ? Yo(t[1], t[2] / 100, t[3] / 100, 1) : (t = ps.exec(e)) ? Yo(t[1], t[2] / 100, t[3] / 100, t[4]) : zo.hasOwnProperty(e) ? Lo(zo[e]) : e === "transparent" ? new me(NaN, NaN, NaN, 0) : null;
}
function Lo(e) {
  return new me(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function $t(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new me(e, t, n, o);
}
function bs(e) {
  return e instanceof Mt || (e = Et(e)), e ? (e = e.rgb(), new me(e.r, e.g, e.b, e.opacity)) : new me();
}
function Vn(e, t, n, o) {
  return arguments.length === 1 ? bs(e) : new me(e, t, n, o ?? 1);
}
function me(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
to(me, Vn, ei(Mt, {
  brighter(e) {
    return e = e == null ? Kt : Math.pow(Kt, e), new me(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? xt : Math.pow(xt, e), new me(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new me(He(this.r), He(this.g), He(this.b), Wt(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Fo,
  // Deprecated! Use color.formatHex.
  formatHex: Fo,
  formatHex8: ws,
  formatRgb: Xo,
  toString: Xo
}));
function Fo() {
  return `#${je(this.r)}${je(this.g)}${je(this.b)}`;
}
function ws() {
  return `#${je(this.r)}${je(this.g)}${je(this.b)}${je((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Xo() {
  const e = Wt(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${He(this.r)}, ${He(this.g)}, ${He(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Wt(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function He(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function je(e) {
  return e = He(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Yo(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Ee(e, t, n, o);
}
function ti(e) {
  if (e instanceof Ee)
    return new Ee(e.h, e.s, e.l, e.opacity);
  if (e instanceof Mt || (e = Et(e)), !e)
    return new Ee();
  if (e instanceof Ee)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, a = Math.min(t, n, o), i = Math.max(t, n, o), r = NaN, l = i - a, u = (i + a) / 2;
  return l ? (t === i ? r = (n - o) / l + (n < o) * 6 : n === i ? r = (o - t) / l + 2 : r = (t - n) / l + 4, l /= u < 0.5 ? i + a : 2 - i - a, r *= 60) : l = u > 0 && u < 1 ? 0 : r, new Ee(r, l, u, e.opacity);
}
function xs(e, t, n, o) {
  return arguments.length === 1 ? ti(e) : new Ee(e, t, n, o ?? 1);
}
function Ee(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
to(Ee, xs, ei(Mt, {
  brighter(e) {
    return e = e == null ? Kt : Math.pow(Kt, e), new Ee(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? xt : Math.pow(xt, e), new Ee(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, a = 2 * n - o;
    return new me(
      En(e >= 240 ? e - 240 : e + 120, a, o),
      En(e, a, o),
      En(e < 120 ? e + 240 : e - 120, a, o),
      this.opacity
    );
  },
  clamp() {
    return new Ee(Go(this.h), Tt(this.s), Tt(this.l), Wt(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Wt(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Go(this.h)}, ${Tt(this.s) * 100}%, ${Tt(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Go(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Tt(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function En(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const ni = (e) => () => e;
function _s(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Es(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function Ss(e) {
  return (e = +e) == 1 ? oi : function(t, n) {
    return n - t ? Es(t, n, e) : ni(isNaN(t) ? n : t);
  };
}
function oi(e, t) {
  var n = t - e;
  return n ? _s(e, n) : ni(isNaN(e) ? t : e);
}
const jo = function e(t) {
  var n = Ss(t);
  function o(a, i) {
    var r = n((a = Vn(a)).r, (i = Vn(i)).r), l = n(a.g, i.g), u = n(a.b, i.b), c = oi(a.opacity, i.opacity);
    return function(s) {
      return a.r = r(s), a.g = l(s), a.b = u(s), a.opacity = c(s), a + "";
    };
  }
  return o.gamma = e, o;
}(1);
function Fe(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
var Ln = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Sn = new RegExp(Ln.source, "g");
function Ns(e) {
  return function() {
    return e;
  };
}
function ks(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Ms(e, t) {
  var n = Ln.lastIndex = Sn.lastIndex = 0, o, a, i, r = -1, l = [], u = [];
  for (e = e + "", t = t + ""; (o = Ln.exec(e)) && (a = Sn.exec(t)); )
    (i = a.index) > n && (i = t.slice(n, i), l[r] ? l[r] += i : l[++r] = i), (o = o[0]) === (a = a[0]) ? l[r] ? l[r] += a : l[++r] = a : (l[++r] = null, u.push({ i: r, x: Fe(o, a) })), n = Sn.lastIndex;
  return n < t.length && (i = t.slice(n), l[r] ? l[r] += i : l[++r] = i), l.length < 2 ? u[0] ? ks(u[0].x) : Ns(t) : (t = u.length, function(c) {
    for (var s = 0, d; s < t; ++s)
      l[(d = u[s]).i] = d.x(c);
    return l.join("");
  });
}
var Ho = 180 / Math.PI, ai = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function ii(e, t, n, o, a, i) {
  var r, l, u;
  return (r = Math.sqrt(e * e + t * t)) && (e /= r, t /= r), (u = e * n + t * o) && (n -= e * u, o -= t * u), (l = Math.sqrt(n * n + o * o)) && (n /= l, o /= l, u /= l), e * o < t * n && (e = -e, t = -t, u = -u, r = -r), {
    translateX: a,
    translateY: i,
    rotate: Math.atan2(t, e) * Ho,
    skewX: Math.atan(u) * Ho,
    scaleX: r,
    scaleY: l
  };
}
var Dt;
function Ps(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? ai : ii(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Cs(e) {
  return e == null || (Dt || (Dt = document.createElementNS("http://www.w3.org/2000/svg", "g")), Dt.setAttribute("transform", e), !(e = Dt.transform.baseVal.consolidate())) ? ai : (e = e.matrix, ii(e.a, e.b, e.c, e.d, e.e, e.f));
}
function ri(e, t, n, o) {
  function a(c) {
    return c.length ? c.pop() + " " : "";
  }
  function i(c, s, d, v, b, g) {
    if (c !== d || s !== v) {
      var w = b.push("translate(", null, t, null, n);
      g.push({ i: w - 4, x: Fe(c, d) }, { i: w - 2, x: Fe(s, v) });
    } else
      (d || v) && b.push("translate(" + d + t + v + n);
  }
  function r(c, s, d, v) {
    c !== s ? (c - s > 180 ? s += 360 : s - c > 180 && (c += 360), v.push({ i: d.push(a(d) + "rotate(", null, o) - 2, x: Fe(c, s) })) : s && d.push(a(d) + "rotate(" + s + o);
  }
  function l(c, s, d, v) {
    c !== s ? v.push({ i: d.push(a(d) + "skewX(", null, o) - 2, x: Fe(c, s) }) : s && d.push(a(d) + "skewX(" + s + o);
  }
  function u(c, s, d, v, b, g) {
    if (c !== d || s !== v) {
      var w = b.push(a(b) + "scale(", null, ",", null, ")");
      g.push({ i: w - 4, x: Fe(c, d) }, { i: w - 2, x: Fe(s, v) });
    } else
      (d !== 1 || v !== 1) && b.push(a(b) + "scale(" + d + "," + v + ")");
  }
  return function(c, s) {
    var d = [], v = [];
    return c = e(c), s = e(s), i(c.translateX, c.translateY, s.translateX, s.translateY, d, v), r(c.rotate, s.rotate, d, v), l(c.skewX, s.skewX, d, v), u(c.scaleX, c.scaleY, s.scaleX, s.scaleY, d, v), c = s = null, function(b) {
      for (var g = -1, w = v.length, E; ++g < w; )
        d[(E = v[g]).i] = E.x(b);
      return d.join("");
    };
  };
}
var Is = ri(Ps, "px, ", "px)", "deg)"), Os = ri(Cs, ", ", ")", ")"), $s = 1e-12;
function Uo(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function Ts(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Ds(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const Bs = function e(t, n, o) {
  function a(i, r) {
    var l = i[0], u = i[1], c = i[2], s = r[0], d = r[1], v = r[2], b = s - l, g = d - u, w = b * b + g * g, E, _;
    if (w < $s)
      _ = Math.log(v / c) / t, E = function(h) {
        return [
          l + h * b,
          u + h * g,
          c * Math.exp(t * h * _)
        ];
      };
    else {
      var $ = Math.sqrt(w), Y = (v * v - c * c + o * w) / (2 * c * n * $), m = (v * v - c * c - o * w) / (2 * v * n * $), O = Math.log(Math.sqrt(Y * Y + 1) - Y), x = Math.log(Math.sqrt(m * m + 1) - m);
      _ = (x - O) / t, E = function(h) {
        var S = h * _, T = Uo(O), C = c / (n * $) * (T * Ds(t * S + O) - Ts(O));
        return [
          l + C * b,
          u + C * g,
          c * T / Uo(t * S + O)
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
var ft = 0, pt = 0, ht = 0, li = 1e3, Zt, mt, qt = 0, We = 0, pn = 0, St = typeof performance == "object" && performance.now ? performance : Date, ui = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function no() {
  return We || (ui(As), We = St.now() + pn);
}
function As() {
  We = 0;
}
function Qt() {
  this._call = this._time = this._next = null;
}
Qt.prototype = si.prototype = {
  constructor: Qt,
  restart: function(e, t, n) {
    if (typeof e != "function")
      throw new TypeError("callback is not a function");
    n = (n == null ? no() : +n) + (t == null ? 0 : +t), !this._next && mt !== this && (mt ? mt._next = this : Zt = this, mt = this), this._call = e, this._time = n, Fn();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Fn());
  }
};
function si(e, t, n) {
  var o = new Qt();
  return o.restart(e, t, n), o;
}
function zs() {
  no(), ++ft;
  for (var e = Zt, t; e; )
    (t = We - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --ft;
}
function Ko() {
  We = (qt = St.now()) + pn, ft = pt = 0;
  try {
    zs();
  } finally {
    ft = 0, Vs(), We = 0;
  }
}
function Rs() {
  var e = St.now(), t = e - qt;
  t > li && (pn -= t, qt = e);
}
function Vs() {
  for (var e, t = Zt, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Zt = n);
  mt = e, Fn(o);
}
function Fn(e) {
  if (!ft) {
    pt && (pt = clearTimeout(pt));
    var t = e - We;
    t > 24 ? (e < 1 / 0 && (pt = setTimeout(Ko, e - St.now() - pn)), ht && (ht = clearInterval(ht))) : (ht || (qt = St.now(), ht = setInterval(Rs, li)), ft = 1, ui(Ko));
  }
}
function Wo(e, t, n) {
  var o = new Qt();
  return t = t == null ? 0 : +t, o.restart((a) => {
    o.stop(), e(a + t);
  }, t, n), o;
}
var Ls = ln("start", "end", "cancel", "interrupt"), Fs = [], ci = 0, Zo = 1, Xn = 2, Vt = 3, qo = 4, Yn = 5, Lt = 6;
function mn(e, t, n, o, a, i) {
  var r = e.__transition;
  if (!r)
    e.__transition = {};
  else if (n in r)
    return;
  Xs(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: a,
    // For context during callback.
    on: Ls,
    tween: Fs,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: ci
  });
}
function oo(e, t) {
  var n = ke(e, t);
  if (n.state > ci)
    throw new Error("too late; already scheduled");
  return n;
}
function Ie(e, t) {
  var n = ke(e, t);
  if (n.state > Vt)
    throw new Error("too late; already running");
  return n;
}
function ke(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t]))
    throw new Error("transition not found");
  return n;
}
function Xs(e, t, n) {
  var o = e.__transition, a;
  o[t] = n, n.timer = si(i, 0, n.time);
  function i(c) {
    n.state = Zo, n.timer.restart(r, n.delay, n.time), n.delay <= c && r(c - n.delay);
  }
  function r(c) {
    var s, d, v, b;
    if (n.state !== Zo)
      return u();
    for (s in o)
      if (b = o[s], b.name === n.name) {
        if (b.state === Vt)
          return Wo(r);
        b.state === qo ? (b.state = Lt, b.timer.stop(), b.on.call("interrupt", e, e.__data__, b.index, b.group), delete o[s]) : +s < t && (b.state = Lt, b.timer.stop(), b.on.call("cancel", e, e.__data__, b.index, b.group), delete o[s]);
      }
    if (Wo(function() {
      n.state === Vt && (n.state = qo, n.timer.restart(l, n.delay, n.time), l(c));
    }), n.state = Xn, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Xn) {
      for (n.state = Vt, a = new Array(v = n.tween.length), s = 0, d = -1; s < v; ++s)
        (b = n.tween[s].value.call(e, e.__data__, n.index, n.group)) && (a[++d] = b);
      a.length = d + 1;
    }
  }
  function l(c) {
    for (var s = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(u), n.state = Yn, 1), d = -1, v = a.length; ++d < v; )
      a[d].call(e, s);
    n.state === Yn && (n.on.call("end", e, e.__data__, n.index, n.group), u());
  }
  function u() {
    n.state = Lt, n.timer.stop(), delete o[t];
    for (var c in o)
      return;
    delete e.__transition;
  }
}
function Ft(e, t) {
  var n = e.__transition, o, a, i = !0, r;
  if (n) {
    t = t == null ? null : t + "";
    for (r in n) {
      if ((o = n[r]).name !== t) {
        i = !1;
        continue;
      }
      a = o.state > Xn && o.state < Yn, o.state = Lt, o.timer.stop(), o.on.call(a ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[r];
    }
    i && delete e.__transition;
  }
}
function Ys(e) {
  return this.each(function() {
    Ft(this, e);
  });
}
function Gs(e, t) {
  var n, o;
  return function() {
    var a = Ie(this, e), i = a.tween;
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
function js(e, t, n) {
  var o, a;
  if (typeof n != "function")
    throw new Error();
  return function() {
    var i = Ie(this, e), r = i.tween;
    if (r !== o) {
      a = (o = r).slice();
      for (var l = { name: t, value: n }, u = 0, c = a.length; u < c; ++u)
        if (a[u].name === t) {
          a[u] = l;
          break;
        }
      u === c && a.push(l);
    }
    i.tween = a;
  };
}
function Hs(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = ke(this.node(), n).tween, a = 0, i = o.length, r; a < i; ++a)
      if ((r = o[a]).name === e)
        return r.value;
    return null;
  }
  return this.each((t == null ? Gs : js)(n, e, t));
}
function ao(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var a = Ie(this, o);
    (a.value || (a.value = {}))[t] = n.apply(this, arguments);
  }), function(a) {
    return ke(a, o).value[t];
  };
}
function di(e, t) {
  var n;
  return (typeof t == "number" ? Fe : t instanceof Et ? jo : (n = Et(t)) ? (t = n, jo) : Ms)(e, t);
}
function Us(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Ks(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Ws(e, t, n) {
  var o, a = n + "", i;
  return function() {
    var r = this.getAttribute(e);
    return r === a ? null : r === o ? i : i = t(o = r, n);
  };
}
function Zs(e, t, n) {
  var o, a = n + "", i;
  return function() {
    var r = this.getAttributeNS(e.space, e.local);
    return r === a ? null : r === o ? i : i = t(o = r, n);
  };
}
function qs(e, t, n) {
  var o, a, i;
  return function() {
    var r, l = n(this), u;
    return l == null ? void this.removeAttribute(e) : (r = this.getAttribute(e), u = l + "", r === u ? null : r === o && u === a ? i : (a = u, i = t(o = r, l)));
  };
}
function Qs(e, t, n) {
  var o, a, i;
  return function() {
    var r, l = n(this), u;
    return l == null ? void this.removeAttributeNS(e.space, e.local) : (r = this.getAttributeNS(e.space, e.local), u = l + "", r === u ? null : r === o && u === a ? i : (a = u, i = t(o = r, l)));
  };
}
function Js(e, t) {
  var n = un(e), o = n === "transform" ? Os : di;
  return this.attrTween(e, typeof t == "function" ? (n.local ? Qs : qs)(n, o, ao(this, "attr." + e, t)) : t == null ? (n.local ? Ks : Us)(n) : (n.local ? Zs : Ws)(n, o, t));
}
function ec(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function tc(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function nc(e, t) {
  var n, o;
  function a() {
    var i = t.apply(this, arguments);
    return i !== o && (n = (o = i) && tc(e, i)), n;
  }
  return a._value = t, a;
}
function oc(e, t) {
  var n, o;
  function a() {
    var i = t.apply(this, arguments);
    return i !== o && (n = (o = i) && ec(e, i)), n;
  }
  return a._value = t, a;
}
function ac(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2)
    return (n = this.tween(n)) && n._value;
  if (t == null)
    return this.tween(n, null);
  if (typeof t != "function")
    throw new Error();
  var o = un(e);
  return this.tween(n, (o.local ? nc : oc)(o, t));
}
function ic(e, t) {
  return function() {
    oo(this, e).delay = +t.apply(this, arguments);
  };
}
function rc(e, t) {
  return t = +t, function() {
    oo(this, e).delay = t;
  };
}
function lc(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? ic : rc)(t, e)) : ke(this.node(), t).delay;
}
function uc(e, t) {
  return function() {
    Ie(this, e).duration = +t.apply(this, arguments);
  };
}
function sc(e, t) {
  return t = +t, function() {
    Ie(this, e).duration = t;
  };
}
function cc(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? uc : sc)(t, e)) : ke(this.node(), t).duration;
}
function dc(e, t) {
  if (typeof t != "function")
    throw new Error();
  return function() {
    Ie(this, e).ease = t;
  };
}
function vc(e) {
  var t = this._id;
  return arguments.length ? this.each(dc(t, e)) : ke(this.node(), t).ease;
}
function fc(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function")
      throw new Error();
    Ie(this, e).ease = n;
  };
}
function hc(e) {
  if (typeof e != "function")
    throw new Error();
  return this.each(fc(this._id, e));
}
function gc(e) {
  typeof e != "function" && (e = $a(e));
  for (var t = this._groups, n = t.length, o = new Array(n), a = 0; a < n; ++a)
    for (var i = t[a], r = i.length, l = o[a] = [], u, c = 0; c < r; ++c)
      (u = i[c]) && e.call(u, u.__data__, c, i) && l.push(u);
  return new Le(o, this._parents, this._name, this._id);
}
function pc(e) {
  if (e._id !== this._id)
    throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, a = n.length, i = Math.min(o, a), r = new Array(o), l = 0; l < i; ++l)
    for (var u = t[l], c = n[l], s = u.length, d = r[l] = new Array(s), v, b = 0; b < s; ++b)
      (v = u[b] || c[b]) && (d[b] = v);
  for (; l < o; ++l)
    r[l] = t[l];
  return new Le(r, this._parents, this._name, this._id);
}
function mc(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function yc(e, t, n) {
  var o, a, i = mc(t) ? oo : Ie;
  return function() {
    var r = i(this, e), l = r.on;
    l !== o && (a = (o = l).copy()).on(t, n), r.on = a;
  };
}
function bc(e, t) {
  var n = this._id;
  return arguments.length < 2 ? ke(this.node(), n).on.on(e) : this.each(yc(n, e, t));
}
function wc(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition)
      if (+n !== e)
        return;
    t && t.removeChild(this);
  };
}
function xc() {
  return this.on("end.remove", wc(this._id));
}
function _c(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Qn(e));
  for (var o = this._groups, a = o.length, i = new Array(a), r = 0; r < a; ++r)
    for (var l = o[r], u = l.length, c = i[r] = new Array(u), s, d, v = 0; v < u; ++v)
      (s = l[v]) && (d = e.call(s, s.__data__, v, l)) && ("__data__" in s && (d.__data__ = s.__data__), c[v] = d, mn(c[v], t, n, v, c, ke(s, n)));
  return new Le(i, this._parents, t, n);
}
function Ec(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Oa(e));
  for (var o = this._groups, a = o.length, i = [], r = [], l = 0; l < a; ++l)
    for (var u = o[l], c = u.length, s, d = 0; d < c; ++d)
      if (s = u[d]) {
        for (var v = e.call(s, s.__data__, d, u), b, g = ke(s, n), w = 0, E = v.length; w < E; ++w)
          (b = v[w]) && mn(b, t, n, w, v, g);
        i.push(v), r.push(s);
      }
  return new Le(i, r, t, n);
}
var Sc = kt.prototype.constructor;
function Nc() {
  return new Sc(this._groups, this._parents);
}
function kc(e, t) {
  var n, o, a;
  return function() {
    var i = vt(this, e), r = (this.style.removeProperty(e), vt(this, e));
    return i === r ? null : i === n && r === o ? a : a = t(n = i, o = r);
  };
}
function vi(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Mc(e, t, n) {
  var o, a = n + "", i;
  return function() {
    var r = vt(this, e);
    return r === a ? null : r === o ? i : i = t(o = r, n);
  };
}
function Pc(e, t, n) {
  var o, a, i;
  return function() {
    var r = vt(this, e), l = n(this), u = l + "";
    return l == null && (u = l = (this.style.removeProperty(e), vt(this, e))), r === u ? null : r === o && u === a ? i : (a = u, i = t(o = r, l));
  };
}
function Cc(e, t) {
  var n, o, a, i = "style." + t, r = "end." + i, l;
  return function() {
    var u = Ie(this, e), c = u.on, s = u.value[i] == null ? l || (l = vi(t)) : void 0;
    (c !== n || a !== s) && (o = (n = c).copy()).on(r, a = s), u.on = o;
  };
}
function Ic(e, t, n) {
  var o = (e += "") == "transform" ? Is : di;
  return t == null ? this.styleTween(e, kc(e, o)).on("end.style." + e, vi(e)) : typeof t == "function" ? this.styleTween(e, Pc(e, o, ao(this, "style." + e, t))).each(Cc(this._id, e)) : this.styleTween(e, Mc(e, o, t), n).on("end.style." + e, null);
}
function Oc(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function $c(e, t, n) {
  var o, a;
  function i() {
    var r = t.apply(this, arguments);
    return r !== a && (o = (a = r) && Oc(e, r, n)), o;
  }
  return i._value = t, i;
}
function Tc(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2)
    return (o = this.tween(o)) && o._value;
  if (t == null)
    return this.tween(o, null);
  if (typeof t != "function")
    throw new Error();
  return this.tween(o, $c(e, t, n ?? ""));
}
function Dc(e) {
  return function() {
    this.textContent = e;
  };
}
function Bc(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function Ac(e) {
  return this.tween("text", typeof e == "function" ? Bc(ao(this, "text", e)) : Dc(e == null ? "" : e + ""));
}
function zc(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Rc(e) {
  var t, n;
  function o() {
    var a = e.apply(this, arguments);
    return a !== n && (t = (n = a) && zc(a)), t;
  }
  return o._value = e, o;
}
function Vc(e) {
  var t = "text";
  if (arguments.length < 1)
    return (t = this.tween(t)) && t._value;
  if (e == null)
    return this.tween(t, null);
  if (typeof e != "function")
    throw new Error();
  return this.tween(t, Rc(e));
}
function Lc() {
  for (var e = this._name, t = this._id, n = fi(), o = this._groups, a = o.length, i = 0; i < a; ++i)
    for (var r = o[i], l = r.length, u, c = 0; c < l; ++c)
      if (u = r[c]) {
        var s = ke(u, t);
        mn(u, e, n, c, r, {
          time: s.time + s.delay + s.duration,
          delay: 0,
          duration: s.duration,
          ease: s.ease
        });
      }
  return new Le(o, this._parents, e, n);
}
function Fc() {
  var e, t, n = this, o = n._id, a = n.size();
  return new Promise(function(i, r) {
    var l = { value: r }, u = { value: function() {
      --a === 0 && i();
    } };
    n.each(function() {
      var c = Ie(this, o), s = c.on;
      s !== e && (t = (e = s).copy(), t._.cancel.push(l), t._.interrupt.push(l), t._.end.push(u)), c.on = t;
    }), a === 0 && i();
  });
}
var Xc = 0;
function Le(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function fi() {
  return ++Xc;
}
var Oe = kt.prototype;
Le.prototype = {
  constructor: Le,
  select: _c,
  selectAll: Ec,
  selectChild: Oe.selectChild,
  selectChildren: Oe.selectChildren,
  filter: gc,
  merge: pc,
  selection: Nc,
  transition: Lc,
  call: Oe.call,
  nodes: Oe.nodes,
  node: Oe.node,
  size: Oe.size,
  empty: Oe.empty,
  each: Oe.each,
  on: bc,
  attr: Js,
  attrTween: ac,
  style: Ic,
  styleTween: Tc,
  text: Ac,
  textTween: Vc,
  remove: xc,
  tween: Hs,
  delay: lc,
  duration: cc,
  ease: vc,
  easeVarying: hc,
  end: Fc,
  [Symbol.iterator]: Oe[Symbol.iterator]
};
function Yc(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Gc = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Yc
};
function jc(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function Hc(e) {
  var t, n;
  e instanceof Le ? (t = e._id, e = e._name) : (t = fi(), (n = Gc).time = no(), e = e == null ? null : e + "");
  for (var o = this._groups, a = o.length, i = 0; i < a; ++i)
    for (var r = o[i], l = r.length, u, c = 0; c < l; ++c)
      (u = r[c]) && mn(u, e, t, c, r, n || jc(u, t));
  return new Le(o, this._parents, e, t);
}
kt.prototype.interrupt = Ys;
kt.prototype.transition = Hc;
const Bt = (e) => () => e;
function Uc(e, {
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
function Be(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
Be.prototype = {
  constructor: Be,
  scale: function(e) {
    return e === 1 ? this : new Be(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Be(this.k, this.x + this.k * e, this.y + this.k * t);
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
var Pt = new Be(1, 0, 0);
Be.prototype;
function Nn(e) {
  e.stopImmediatePropagation();
}
function gt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Kc(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Wc() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Qo() {
  return this.__zoom || Pt;
}
function Zc(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function qc() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Qc(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], a = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], r = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    a > o ? (o + a) / 2 : Math.min(0, o) || Math.max(0, a),
    r > i ? (i + r) / 2 : Math.min(0, i) || Math.max(0, r)
  );
}
function Jc() {
  var e = Kc, t = Wc, n = Qc, o = Zc, a = qc, i = [0, 1 / 0], r = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], l = 250, u = Bs, c = ln("start", "zoom", "end"), s, d, v, b = 500, g = 150, w = 0, E = 10;
  function _(p) {
    p.property("__zoom", Qo).on("wheel.zoom", S, { passive: !1 }).on("mousedown.zoom", T).on("dblclick.zoom", C).filter(a).on("touchstart.zoom", D).on("touchmove.zoom", ee).on("touchend.zoom touchcancel.zoom", ae).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  _.transform = function(p, R, N, z) {
    var H = p.selection ? p.selection() : p;
    H.property("__zoom", Qo), p !== H ? O(p, R, N, z) : H.interrupt().each(function() {
      x(this, arguments).event(z).start().zoom(null, typeof R == "function" ? R.apply(this, arguments) : R).end();
    });
  }, _.scaleBy = function(p, R, N, z) {
    _.scaleTo(p, function() {
      var H = this.__zoom.k, W = typeof R == "function" ? R.apply(this, arguments) : R;
      return H * W;
    }, N, z);
  }, _.scaleTo = function(p, R, N, z) {
    _.transform(p, function() {
      var H = t.apply(this, arguments), W = this.__zoom, B = N == null ? m(H) : typeof N == "function" ? N.apply(this, arguments) : N, U = W.invert(B), V = typeof R == "function" ? R.apply(this, arguments) : R;
      return n(Y($(W, V), B, U), H, r);
    }, N, z);
  }, _.translateBy = function(p, R, N, z) {
    _.transform(p, function() {
      return n(this.__zoom.translate(
        typeof R == "function" ? R.apply(this, arguments) : R,
        typeof N == "function" ? N.apply(this, arguments) : N
      ), t.apply(this, arguments), r);
    }, null, z);
  }, _.translateTo = function(p, R, N, z, H) {
    _.transform(p, function() {
      var W = t.apply(this, arguments), B = this.__zoom, U = z == null ? m(W) : typeof z == "function" ? z.apply(this, arguments) : z;
      return n(Pt.translate(U[0], U[1]).scale(B.k).translate(
        typeof R == "function" ? -R.apply(this, arguments) : -R,
        typeof N == "function" ? -N.apply(this, arguments) : -N
      ), W, r);
    }, z, H);
  };
  function $(p, R) {
    return R = Math.max(i[0], Math.min(i[1], R)), R === p.k ? p : new Be(R, p.x, p.y);
  }
  function Y(p, R, N) {
    var z = R[0] - N[0] * p.k, H = R[1] - N[1] * p.k;
    return z === p.x && H === p.y ? p : new Be(p.k, z, H);
  }
  function m(p) {
    return [(+p[0][0] + +p[1][0]) / 2, (+p[0][1] + +p[1][1]) / 2];
  }
  function O(p, R, N, z) {
    p.on("start.zoom", function() {
      x(this, arguments).event(z).start();
    }).on("interrupt.zoom end.zoom", function() {
      x(this, arguments).event(z).end();
    }).tween("zoom", function() {
      var H = this, W = arguments, B = x(H, W).event(z), U = t.apply(H, W), V = N == null ? m(U) : typeof N == "function" ? N.apply(H, W) : N, Z = Math.max(U[1][0] - U[0][0], U[1][1] - U[0][1]), G = H.__zoom, te = typeof R == "function" ? R.apply(H, W) : R, I = u(G.invert(V).concat(Z / G.k), te.invert(V).concat(Z / te.k));
      return function(f) {
        if (f === 1)
          f = te;
        else {
          var y = I(f), L = Z / y[2];
          f = new Be(L, V[0] - y[0] * L, V[1] - y[1] * L);
        }
        B.zoom(null, f);
      };
    });
  }
  function x(p, R, N) {
    return !N && p.__zooming || new h(p, R);
  }
  function h(p, R) {
    this.that = p, this.args = R, this.active = 0, this.sourceEvent = null, this.extent = t.apply(p, R), this.taps = 0;
  }
  h.prototype = {
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
      var R = _e(this.that).datum();
      c.call(
        p,
        this.that,
        new Uc(p, {
          sourceEvent: this.sourceEvent,
          target: _,
          type: p,
          transform: this.that.__zoom,
          dispatch: c
        }),
        R
      );
    }
  };
  function S(p, ...R) {
    if (!e.apply(this, arguments))
      return;
    var N = x(this, R).event(p), z = this.__zoom, H = Math.max(i[0], Math.min(i[1], z.k * Math.pow(2, o.apply(this, arguments)))), W = Me(p);
    if (N.wheel)
      (N.mouse[0][0] !== W[0] || N.mouse[0][1] !== W[1]) && (N.mouse[1] = z.invert(N.mouse[0] = W)), clearTimeout(N.wheel);
    else {
      if (z.k === H)
        return;
      N.mouse = [W, z.invert(W)], Ft(this), N.start();
    }
    gt(p), N.wheel = setTimeout(B, g), N.zoom("mouse", n(Y($(z, H), N.mouse[0], N.mouse[1]), N.extent, r));
    function B() {
      N.wheel = null, N.end();
    }
  }
  function T(p, ...R) {
    if (v || !e.apply(this, arguments))
      return;
    var N = p.currentTarget, z = x(this, R, !0).event(p), H = _e(p.view).on("mousemove.zoom", V, !0).on("mouseup.zoom", Z, !0), W = Me(p, N), B = p.clientX, U = p.clientY;
    Xa(p.view), Nn(p), z.mouse = [W, this.__zoom.invert(W)], Ft(this), z.start();
    function V(G) {
      if (gt(G), !z.moved) {
        var te = G.clientX - B, I = G.clientY - U;
        z.moved = te * te + I * I > w;
      }
      z.event(G).zoom("mouse", n(Y(z.that.__zoom, z.mouse[0] = Me(G, N), z.mouse[1]), z.extent, r));
    }
    function Z(G) {
      H.on("mousemove.zoom mouseup.zoom", null), Ya(G.view, z.moved), gt(G), z.event(G).end();
    }
  }
  function C(p, ...R) {
    if (e.apply(this, arguments)) {
      var N = this.__zoom, z = Me(p.changedTouches ? p.changedTouches[0] : p, this), H = N.invert(z), W = N.k * (p.shiftKey ? 0.5 : 2), B = n(Y($(N, W), z, H), t.apply(this, R), r);
      gt(p), l > 0 ? _e(this).transition().duration(l).call(O, B, z, p) : _e(this).call(_.transform, B, z, p);
    }
  }
  function D(p, ...R) {
    if (e.apply(this, arguments)) {
      var N = p.touches, z = N.length, H = x(this, R, p.changedTouches.length === z).event(p), W, B, U, V;
      for (Nn(p), B = 0; B < z; ++B)
        U = N[B], V = Me(U, this), V = [V, this.__zoom.invert(V), U.identifier], H.touch0 ? !H.touch1 && H.touch0[2] !== V[2] && (H.touch1 = V, H.taps = 0) : (H.touch0 = V, W = !0, H.taps = 1 + !!s);
      s && (s = clearTimeout(s)), W && (H.taps < 2 && (d = V[0], s = setTimeout(function() {
        s = null;
      }, b)), Ft(this), H.start());
    }
  }
  function ee(p, ...R) {
    if (this.__zooming) {
      var N = x(this, R).event(p), z = p.changedTouches, H = z.length, W, B, U, V;
      for (gt(p), W = 0; W < H; ++W)
        B = z[W], U = Me(B, this), N.touch0 && N.touch0[2] === B.identifier ? N.touch0[0] = U : N.touch1 && N.touch1[2] === B.identifier && (N.touch1[0] = U);
      if (B = N.that.__zoom, N.touch1) {
        var Z = N.touch0[0], G = N.touch0[1], te = N.touch1[0], I = N.touch1[1], f = (f = te[0] - Z[0]) * f + (f = te[1] - Z[1]) * f, y = (y = I[0] - G[0]) * y + (y = I[1] - G[1]) * y;
        B = $(B, Math.sqrt(f / y)), U = [(Z[0] + te[0]) / 2, (Z[1] + te[1]) / 2], V = [(G[0] + I[0]) / 2, (G[1] + I[1]) / 2];
      } else if (N.touch0)
        U = N.touch0[0], V = N.touch0[1];
      else
        return;
      N.zoom("touch", n(Y(B, U, V), N.extent, r));
    }
  }
  function ae(p, ...R) {
    if (this.__zooming) {
      var N = x(this, R).event(p), z = p.changedTouches, H = z.length, W, B;
      for (Nn(p), v && clearTimeout(v), v = setTimeout(function() {
        v = null;
      }, b), W = 0; W < H; ++W)
        B = z[W], N.touch0 && N.touch0[2] === B.identifier ? delete N.touch0 : N.touch1 && N.touch1[2] === B.identifier && delete N.touch1;
      if (N.touch1 && !N.touch0 && (N.touch0 = N.touch1, delete N.touch1), N.touch0)
        N.touch0[1] = this.__zoom.invert(N.touch0[0]);
      else if (N.end(), N.taps === 2 && (B = Me(B, this), Math.hypot(d[0] - B[0], d[1] - B[1]) < E)) {
        var U = _e(this).on("dblclick.zoom");
        U && U.apply(this, arguments);
      }
    }
  }
  return _.wheelDelta = function(p) {
    return arguments.length ? (o = typeof p == "function" ? p : Bt(+p), _) : o;
  }, _.filter = function(p) {
    return arguments.length ? (e = typeof p == "function" ? p : Bt(!!p), _) : e;
  }, _.touchable = function(p) {
    return arguments.length ? (a = typeof p == "function" ? p : Bt(!!p), _) : a;
  }, _.extent = function(p) {
    return arguments.length ? (t = typeof p == "function" ? p : Bt([[+p[0][0], +p[0][1]], [+p[1][0], +p[1][1]]]), _) : t;
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
    var p = c.on.apply(c, arguments);
    return p === c ? _ : p;
  }, _.clickDistance = function(p) {
    return arguments.length ? (w = (p = +p) * p, _) : Math.sqrt(w);
  }, _.tapDistance = function(p) {
    return arguments.length ? (E = +p, _) : E;
  }, _;
}
const kn = 0.1;
function Xe() {
}
const ed = {
  zoomIn: Xe,
  zoomOut: Xe,
  zoomTo: Xe,
  fitView: Xe,
  setCenter: Xe,
  fitBounds: Xe,
  project: (e) => e,
  setTransform: Xe,
  getTransform: () => ({ x: 0, y: 0, zoom: 1 }),
  initialized: !1
}, td = (e, t) => {
  const n = e, o = k(n, "nodes"), a = k(n, "d3Zoom"), i = k(n, "d3Selection"), r = k(n, "dimensions"), l = k(n, "translateExtent"), u = k(n, "minZoom"), c = k(n, "maxZoom"), s = k(n, "viewport"), d = k(n, "snapToGrid"), v = k(n, "snapGrid"), b = k(n, "hooks"), g = t, w = k(g, "getNodes"), E = J(!1);
  b.value.nodesInitialized.on(() => {
    E.value = !0;
  });
  const _ = Q(() => !!a.value && !!i.value && !!r.value.width && !!r.value.height && E.value);
  function $(m, O) {
    i.value && a.value && a.value.scaleBy(Mn(i.value, O), m);
  }
  function Y(m, O, x, h) {
    const { x: S, y: T } = ga({ x: -m, y: -O }, l.value), C = Pt.translate(-S, -T).scale(x);
    i.value && a.value && a.value.transform(Mn(i.value, h), C);
  }
  return Q(() => _.value ? {
    initialized: !0,
    zoomIn: (m) => {
      $(1.2, m == null ? void 0 : m.duration);
    },
    zoomOut: (m) => {
      $(1 / 1.2, m == null ? void 0 : m.duration);
    },
    zoomTo: (m, O) => {
      i.value && a.value && a.value.scaleTo(Mn(i.value, O == null ? void 0 : O.duration), m);
    },
    setTransform: (m, O) => {
      Y(m.x, m.y, m.zoom, O == null ? void 0 : O.duration);
    },
    getTransform: () => ({
      x: s.value.x,
      y: s.value.y,
      zoom: s.value.zoom
    }),
    fitView: (m = {
      padding: kn,
      includeHiddenNodes: !1,
      duration: 0
    }) => {
      if (!o.value.length)
        return;
      const O = (m.includeHiddenNodes ? o.value : w.value).filter((C) => {
        var D;
        const ee = C.initialized && C.dimensions.width && C.dimensions.height;
        let ae = !0;
        return (D = m.nodes) != null && D.length && (ae = m.nodes.includes(C.id)), ee && ae;
      }), x = wa(O), { x: h, y: S, zoom: T } = xo(
        x,
        r.value.width,
        r.value.height,
        m.minZoom ?? u.value,
        m.maxZoom ?? c.value,
        m.padding ?? kn,
        m.offset
      );
      Y(h, S, T, m == null ? void 0 : m.duration);
    },
    setCenter: (m, O, x) => {
      const h = typeof (x == null ? void 0 : x.zoom) < "u" ? x.zoom : c.value, S = r.value.width / 2 - m * h, T = r.value.height / 2 - O * h;
      Y(S, T, h, x == null ? void 0 : x.duration);
    },
    fitBounds: (m, O = { padding: kn }) => {
      const { x, y: h, zoom: S } = xo(
        m,
        r.value.width,
        r.value.height,
        u.value,
        c.value,
        O.padding
      );
      Y(x, h, S, O == null ? void 0 : O.duration);
    },
    project: (m) => ya(m, s.value, d.value, v.value)
  } : ed);
};
function Mn(e, t = 0) {
  return e.transition().duration(t);
}
function Pn(e, t) {
  if (t) {
    const n = e.position.x + e.dimensions.width - t.dimensions.width, o = e.position.y + e.dimensions.height - t.dimensions.height;
    if (n > 0 || o > 0 || e.position.x < 0 || e.position.y < 0) {
      let a = {};
      if (Ve(t.style) ? a = { ...t.style(t) } : t.style && (a = { ...t.style }), a.width = a.width ?? `${t.dimensions.width}px`, a.height = a.height ?? `${t.dimensions.height}px`, n > 0)
        if (De(a.width)) {
          const i = Number(a.width.replace("px", ""));
          a.width = `${i + n}px`;
        } else
          a.width += n;
      if (o > 0)
        if (De(a.height)) {
          const i = Number(a.height.replace("px", ""));
          a.height = `${i + o}px`;
        } else
          a.height += o;
      if (e.position.x < 0) {
        const i = Math.abs(e.position.x);
        if (t.position.x = t.position.x - i, De(a.width)) {
          const r = Number(a.width.replace("px", ""));
          a.width = `${r + i}px`;
        } else
          a.width += i;
        e.position.x = 0;
      }
      if (e.position.y < 0) {
        const i = Math.abs(e.position.y);
        if (t.position.y = t.position.y - i, De(a.height)) {
          const r = Number(a.height.replace("px", ""));
          a.height = `${r + i}px`;
        } else
          a.height += i;
        e.position.y = 0;
      }
      t.dimensions.width = Number(a.width.toString().replace("px", "")), t.dimensions.height = Number(a.height.toString().replace("px", "")), Ve(t.style) ? t.style = (i) => {
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
function Jo(e, t) {
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
          if (Qe(o) && (typeof l.position < "u" && (o.position = l.position), typeof l.dragging < "u" && (o.dragging = l.dragging), o.expandParent && o.parentNode)) {
            const u = t[n.indexOf(o.parentNode)];
            u && Qe(u) && Pn(o, u);
          }
          break;
        case "dimensions":
          if (Qe(o)) {
            if (typeof l.dimensions < "u" && (o.dimensions = l.dimensions), typeof l.updateStyle < "u" && (o.style = {
              ...o.style || {},
              width: `${(a = l.dimensions) == null ? void 0 : a.width}px`,
              height: `${(i = l.dimensions) == null ? void 0 : i.height}px`
            }), typeof l.resizing < "u" && (o.resizing = l.resizing), o.expandParent && o.parentNode) {
              const u = t[n.indexOf(o.parentNode)];
              u && Qe(u) && (u.initialized ? Pn(o, u) : Ae(() => {
                Pn(o, u);
              }));
            }
            o.initialized || (o.initialized = !0);
          }
          break;
      }
  }), t;
}
function $e(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function ea(e) {
  return {
    item: e,
    type: "add"
  };
}
function Cn(e) {
  return {
    id: e,
    type: "remove"
  };
}
function In(e, t) {
  return e.reduce(
    (n, o) => {
      let a = t.includes(o.id);
      ue(o.selectable) && !o.selectable && (a = !1);
      const i = Qe(o) ? "changedNodes" : "changedEdges";
      return !o.selected && a ? n[i].push($e(o.id, !0)) : o.selected && !a && n[i].push($e(o.id, !1)), n;
    },
    { changedNodes: [], changedEdges: [] }
  );
}
function nd(e, t, n, o) {
  let a = !1;
  const i = td(e, t), r = (f) => {
    const y = f ?? n.value ?? [];
    e.hooks.updateNodeInternals.trigger(y);
  }, l = (f) => {
    if (f)
      return e.nodes && !n.value.length ? e.nodes.find((y) => y.id === f) : e.nodes[n.value.indexOf(f)];
  }, u = (f) => {
    if (f)
      return e.edges && !o.value.length ? e.edges.find((y) => y.id === f) : e.edges[o.value.indexOf(f)];
  }, c = (f, y, L) => {
    const A = [];
    f.forEach((F) => {
      var X, P;
      const K = {
        id: F.id,
        type: "position",
        dragging: L,
        from: F.from
      };
      if (y && (K.position = F.position, F.parentNode)) {
        const ne = l(F.parentNode);
        K.position = {
          x: K.position.x - (((X = ne == null ? void 0 : ne.computedPosition) == null ? void 0 : X.x) ?? 0),
          y: K.position.y - (((P = ne == null ? void 0 : ne.computedPosition) == null ? void 0 : P.y) ?? 0)
        };
      }
      A.push(K);
    }), A != null && A.length && e.hooks.nodesChange.trigger(A);
  }, s = (f) => {
    var y;
    if (!e.vueFlowRef)
      return;
    const L = e.vueFlowRef.querySelector(".vue-flow__transformationpane");
    if (!L)
      return;
    let A;
    if ((y = e.__experimentalFeatures) != null && y.nestedFlow) {
      let X = [L], P = L, K;
      for (; !K && P; )
        P = P.parentElement, K = P == null ? void 0 : P.classList.contains("vue-flow__transformationpane"), K && (X = [P, ...X]);
      X.forEach((ne) => {
        const pe = window.getComputedStyle(ne), { m22: Ze } = new window.DOMMatrixReadOnly(pe.transform);
        A ? A *= Ze : A = Ze;
      });
    } else {
      const X = window.getComputedStyle(L), { m22: P } = new window.DOMMatrixReadOnly(X.transform);
      A = P;
    }
    const F = f.reduce((X, P) => {
      const K = l(P.id);
      if (K) {
        const ne = en(P.nodeElement);
        ne.width && ne.height && (K.dimensions.width !== ne.width || K.dimensions.height !== ne.height || P.forceUpdate) && (K.handleBounds.source = Co(".source", P.nodeElement, A), K.handleBounds.target = Co(".target", P.nodeElement, A), K.dimensions = ne, K.initialized = !0, X.push({
          id: K.id,
          type: "dimensions",
          dimensions: ne
        }));
      }
      return X;
    }, []);
    e.fitViewOnInit && !a && (ye(() => i.value.initialized).toBe(!0).then(() => {
      i.value.fitView();
    }), a = !0), F.length && e.hooks.nodesChange.trigger(F);
  }, d = (f, y) => {
    const L = f.map((X) => X.id);
    let A, F = [];
    if (e.multiSelectionActive)
      A = L.map((X) => $e(X, y));
    else {
      const X = In([...e.nodes, ...e.edges], L);
      A = X.changedNodes, F = X.changedEdges;
    }
    A.length && e.hooks.nodesChange.trigger(A), F.length && e.hooks.edgesChange.trigger(F);
  }, v = (f, y) => {
    const L = f.map((X) => X.id);
    let A = [], F;
    if (e.multiSelectionActive)
      F = L.map((X) => $e(X, y));
    else {
      const X = In([...e.nodes, ...e.edges], L);
      A = X.changedNodes, F = X.changedEdges;
    }
    A.length && e.hooks.nodesChange.trigger(A), F.length && e.hooks.edgesChange.trigger(F);
  }, b = (f, y) => {
    const L = f.filter(zt).map((P) => P.id), A = f.filter(ct).map((P) => P.id);
    let { changedNodes: F, changedEdges: X } = In([...e.nodes, ...e.edges], [...L, ...A]);
    e.multiSelectionActive && (F = L.map((P) => $e(P, y)), X = A.map((P) => $e(P, y))), F.length && e.hooks.nodesChange.trigger(F), X.length && e.hooks.edgesChange.trigger(X);
  }, g = (f) => {
    d(f, !0);
  }, w = (f) => {
    v(f, !0);
  }, E = (f) => {
    b(f, !0);
  }, _ = (f) => {
    if (!f.length)
      return d(f, !1);
    const y = f.map((L) => L.id).map((L) => $e(L, !1));
    y.length && e.hooks.nodesChange.trigger(y);
  }, $ = (f) => {
    if (!f.length)
      return v(f, !1);
    const y = f.map((L) => L.id).map((L) => $e(L, !1));
    y.length && e.hooks.edgesChange.trigger(y);
  }, Y = (f) => {
    if (!f || !f.length)
      return b([], !1);
    const { changedNodes: y, changedEdges: L } = f.reduce(
      (A, F) => {
        const X = $e(F.id, !1);
        return zt(F) ? A.changedNodes.push(X) : A.changedEdges.push(X), A;
      },
      { changedNodes: [], changedEdges: [] }
    );
    y.length && e.hooks.nodesChange.trigger(y), L.length && e.hooks.edgesChange.trigger(L);
  }, m = (f) => {
    var y;
    (y = e.d3Zoom) == null || y.scaleExtent([f, e.maxZoom]), e.minZoom = f;
  }, O = (f) => {
    var y;
    (y = e.d3Zoom) == null || y.scaleExtent([e.minZoom, f]), e.maxZoom = f;
  }, x = (f) => {
    var y;
    (y = e.d3Zoom) == null || y.translateExtent(f), e.translateExtent = f;
  }, h = (f) => {
    e.nodeExtent = f, r(n.value);
  }, S = (f) => {
    e.nodesDraggable = f, e.nodesConnectable = f, e.elementsSelectable = f;
  }, T = (f) => {
    const y = f instanceof Function ? f(e.nodes) : f;
    !e.initialized && !y.length || (e.nodes = _o(y, e.nodes, l, e.hooks.error.trigger));
  }, C = (f) => {
    const y = f instanceof Function ? f(e.edges) : f;
    if (!e.initialized && !y.length)
      return;
    const L = e.isValidConnection ? y.filter(
      (A) => e.isValidConnection(A, {
        edges: e.edges,
        sourceNode: l(A.source),
        targetNode: l(A.target)
      })
    ) : y;
    e.edges = L.reduce((A, F) => {
      const X = l(F.source), P = l(F.target), K = !X || typeof X > "u", ne = !P || typeof P > "u";
      if (K && ne ? e.hooks.error.trigger(new ge(he.EDGE_SOURCE_TARGET_MISSING, F.id, F.source, F.target)) : (K && e.hooks.error.trigger(new ge(he.EDGE_SOURCE_MISSING, F.id, F.source)), ne && e.hooks.error.trigger(new ge(he.EDGE_TARGET_MISSING, F.id, F.target))), K || ne)
        return A;
      const pe = u(F.id);
      return A.push({
        ...pa(F, Object.assign({}, pe, e.defaultEdgeOptions)),
        sourceNode: X,
        targetNode: P
      }), A;
    }, []);
  }, D = (f) => {
    const y = f instanceof Function ? f([...e.nodes, ...e.edges]) : f;
    !e.initialized && !y.length || (T(y.filter(zt)), C(y.filter(ct)));
  }, ee = (f) => {
    const y = f instanceof Function ? f(e.nodes) : f, L = _o(y, e.nodes, l, e.hooks.error.trigger).map(ea);
    L.length && e.hooks.nodesChange.trigger(L);
  }, ae = (f) => {
    const y = f instanceof Function ? f(e.edges) : f, L = (e.isValidConnection ? y.filter(
      (A) => e.isValidConnection(A, {
        edges: e.edges,
        sourceNode: l(A.source),
        targetNode: l(A.target)
      })
    ) : y).reduce((A, F) => {
      const X = hr(
        {
          ...F,
          ...e.defaultEdgeOptions
        },
        e.edges,
        e.hooks.error.trigger
      );
      if (X) {
        const P = l(X.source), K = l(X.target), ne = !P || typeof P > "u", pe = !K || typeof K > "u";
        if (ne && pe ? e.hooks.error.trigger(new ge(he.EDGE_SOURCE_TARGET_MISSING, X.id, X.source, X.target)) : (ne && e.hooks.error.trigger(new ge(he.EDGE_SOURCE_MISSING, X.id, X.source)), pe && e.hooks.error.trigger(new ge(he.EDGE_TARGET_MISSING, X.id, X.target))), ne || pe)
          return A;
        A.push(
          ea({
            ...X,
            sourceNode: P,
            targetNode: K
          })
        );
      }
      return A;
    }, []);
    L.length && e.hooks.edgesChange.trigger(L);
  }, p = (f, y = !0) => {
    const L = f instanceof Function ? f(e.nodes) : f, A = [], F = [];
    L.forEach((X) => {
      const P = typeof X == "string" ? l(X) : X;
      if (!(ue(P.deletable) && !P.deletable) && (A.push(Cn(P.id)), y)) {
        const K = tn([P], e.edges).filter((ne) => ue(ne.deletable) ? ne.deletable : !0);
        F.push(...K.map((ne) => Cn(ne.id)));
      }
    }), F.length && e.hooks.edgesChange.trigger(F), A.length && e.hooks.nodesChange.trigger(A);
  }, R = (f) => {
    const y = f instanceof Function ? f(e.edges) : f, L = [];
    y.forEach((A) => {
      const F = typeof A == "string" ? u(A) : A;
      ue(F.deletable) && !F.deletable || L.push(Cn(typeof A == "string" ? A : A.id));
    }), e.hooks.edgesChange.trigger(L);
  }, N = (f, y, L = !0) => gr(f, y, e.edges, u, L, e.hooks.error.trigger), z = (f) => Jo(f, e.nodes), H = (f) => Jo(f, e.edges), W = (f, y, L, A = !1) => {
    A ? e.connectionClickStartHandle = f : e.connectionStartHandle = f, e.connectionEndHandle = null, e.connectionStatus = null, y && (e.connectionPosition = y);
  }, B = (f, y = null, L = null) => {
    e.connectionStartHandle && (e.connectionPosition = f, e.connectionEndHandle = y, e.connectionStatus = L);
  }, U = (f, y) => {
    e.connectionPosition = { x: NaN, y: NaN }, e.connectionStatus = null, y ? e.connectionClickStartHandle = null : e.connectionStartHandle = null;
  }, V = (f) => {
    const y = lr(f), L = y ? null : l(f.id);
    return !y && !L ? [null, null, y] : [y ? f : bo(L), L, y];
  }, Z = (f, y = !0, L) => {
    const [A, F, X] = V(f);
    return A ? (L || e.nodes).filter((P) => {
      if (!X && (P.id === F.id || !P.computedPosition))
        return !1;
      const K = bo(P), ne = $n(K, A);
      return y && ne > 0 || ne >= Number(f.width) * Number(f.height);
    }) : [];
  }, G = (f, y, L = !0) => {
    const [A] = V(f);
    if (!A)
      return !1;
    const F = $n(A, y);
    return L && F > 0 || F >= Number(f.width) * Number(f.height);
  }, te = (f) => {
    const { viewport: y, dimensions: L, d3Zoom: A, d3Selection: F, translateExtent: X } = e;
    if (!A || !F || !f.x && !f.y)
      return !1;
    const P = Pt.translate(y.x + f.x, y.y + f.y).scale(y.zoom), K = [
      [0, 0],
      [L.width, L.height]
    ], ne = A.constrain()(P, K, X);
    return A.transform(F, ne), e.viewport.x !== ne.x || e.viewport.y !== ne.y || e.viewport.zoom !== ne.k;
  }, I = (f) => {
    const y = f instanceof Function ? f(e) : f, L = [
      "modelValue",
      "nodes",
      "edges",
      "maxZoom",
      "minZoom",
      "translateExtent",
      "nodeExtent",
      "hooks",
      "defaultEdgeOptions"
    ];
    ue(y.defaultEdgeOptions) && (e.defaultEdgeOptions = y.defaultEdgeOptions);
    const A = y.modelValue || y.nodes || y.edges ? [] : void 0;
    A && (y.modelValue && A.push(...y.modelValue), y.nodes && A.push(...y.nodes), y.edges && A.push(...y.edges), D(A));
    const F = () => {
      ue(y.maxZoom) && O(y.maxZoom), ue(y.minZoom) && m(y.minZoom), ue(y.translateExtent) && x(y.translateExtent), ue(y.nodeExtent) && h(y.nodeExtent);
    };
    Object.keys(y).forEach((X) => {
      const P = y[X];
      !L.includes(X) && ue(P) && (e[X] = P);
    }), e.d3Zoom ? F() : ye(() => e.d3Zoom).not.toBeUndefined().then(F), e.initialized || (e.initialized = !0);
  };
  return {
    updateNodePositions: c,
    updateNodeDimensions: s,
    setElements: D,
    setNodes: T,
    setEdges: C,
    addNodes: ee,
    addEdges: ae,
    removeNodes: p,
    removeEdges: R,
    findNode: l,
    findEdge: u,
    updateEdge: N,
    applyEdgeChanges: H,
    applyNodeChanges: z,
    addSelectedElements: E,
    addSelectedNodes: g,
    addSelectedEdges: w,
    setMinZoom: m,
    setMaxZoom: O,
    setTranslateExtent: x,
    setNodeExtent: h,
    removeSelectedElements: Y,
    removeSelectedNodes: _,
    removeSelectedEdges: $,
    startConnection: W,
    updateConnection: B,
    endConnection: U,
    setInteractive: S,
    setState: I,
    getIntersectingNodes: Z,
    isNodeIntersecting: G,
    panBy: te,
    fitView: async (f = { padding: 0.1 }) => {
      await ye(() => i.value.initialized).toBe(!0), i.value.fitView(f);
    },
    zoomIn: async (f) => {
      await ye(() => i.value.initialized).toBe(!0), i.value.zoomIn(f);
    },
    zoomOut: async (f) => {
      await ye(() => i.value.initialized).toBe(!0), i.value.zoomOut(f);
    },
    zoomTo: async (f, y) => {
      await ye(() => i.value.initialized).toBe(!0), i.value.zoomTo(f, y);
    },
    setTransform: async (f, y) => {
      await ye(() => i.value.initialized).toBe(!0), i.value.setTransform(f, y);
    },
    getTransform: () => i.value.getTransform(),
    setCenter: async (f, y, L) => {
      await ye(() => i.value.initialized).toBe(!0), i.value.setCenter(f, y, L);
    },
    fitBounds: async (f, y) => {
      await ye(() => i.value.initialized).toBe(!0), i.value.fitBounds(f, y);
    },
    project: (f) => i.value.project(f),
    toObject: () => JSON.parse(
      JSON.stringify({
        nodes: e.nodes.map((f) => {
          const {
            computedPosition: y,
            handleBounds: L,
            selected: A,
            dimensions: F,
            isParent: X,
            resizing: P,
            dragging: K,
            initialized: ne,
            ...pe
          } = f;
          return pe;
        }),
        edges: e.edges.map((f) => {
          const { selected: y, sourceNode: L, targetNode: A, ...F } = f;
          return F;
        }),
        position: [e.viewport.x, e.viewport.y],
        zoom: e.viewport.zoom
      })
    ),
    updateNodeInternals: r,
    $reset: () => {
      e.edges = [], e.nodes = [], I(Ja());
    },
    $destroy: () => {
    }
  };
}
class Je {
  constructor() {
    this.currentId = 0, this.flows = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    return Je.instance || (Je.instance = new Je()), Je.instance;
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
    const o = Ja(n), a = xi(o), i = Q(() => a.nodes.map((v) => v.id)), r = Q(() => a.edges.map((v) => v.id)), l = ss(a, i, r), u = nd(a, l, i, r), c = {};
    Object.entries(a.hooks).forEach(([v, b]) => {
      const g = `on${v.charAt(0).toUpperCase() + v.slice(1)}`;
      c[g] = b.on;
    });
    const s = {};
    Object.entries(a.hooks).forEach(([v, b]) => {
      s[v] = b.trigger;
    }), u.setState(a);
    const d = {
      ...c,
      ...l,
      ...u,
      ..._i(a),
      emits: s,
      id: t,
      vueFlowVersion: "1.19.3",
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
const de = (e) => {
  const t = Je.getInstance(), n = na(), o = e == null ? void 0 : e.id, a = (n == null ? void 0 : n.vueFlowId) || o;
  let i, r = !1;
  if (n) {
    const l = rt(Eo, null);
    typeof l < "u" && l !== null && (i = l);
  }
  if (i || a && (i = t.get(a)), !i || i && o && o !== i.id) {
    const l = o ?? t.getId();
    i = t.create(l, e), n && (r = !0);
  } else
    e && i.setState(e);
  return n && (it(Eo, i), n.vueFlowId = i.id, r && Nt(() => {
    if (i) {
      const l = t.get(i.id);
      l ? l.$destroy() : ha(`No store instance found for id ${i.id} in storage.`);
    }
  })), i;
};
function od(e, t, n) {
  const o = Ei();
  return o.run(() => {
    [
      () => {
        o.run(() => {
          let a, i, r = !!(n.nodes.value.length || n.edges.value.length);
          a = qe([e.modelValue, () => {
            var l, u;
            return (u = (l = e.modelValue) == null ? void 0 : l.value) == null ? void 0 : u.length;
          }], ([l]) => {
            l && Array.isArray(l) && (i == null || i.pause(), n.setElements(l), !i && !r && l.length ? r = !0 : i == null || i.resume());
          }), i = qe(
            [n.nodes, n.edges, () => n.edges.value.length, () => n.nodes.value.length],
            ([l, u]) => {
              var c;
              (c = e.modelValue) != null && c.value && Array.isArray(e.modelValue.value) && (a == null || a.pause(), e.modelValue.value = [...l, ...u], Ae(() => {
                a == null || a.resume();
              }));
            },
            { immediate: r }
          ), At(() => {
            a == null || a.stop(), i == null || i.stop();
          });
        });
      },
      () => {
        o.run(() => {
          let a, i, r = !!n.nodes.value.length;
          a = qe([e.nodes, () => {
            var l, u;
            return (u = (l = e.nodes) == null ? void 0 : l.value) == null ? void 0 : u.length;
          }], ([l]) => {
            l && Array.isArray(l) && (i == null || i.pause(), n.setNodes(l), !i && !r && l.length ? r = !0 : i == null || i.resume());
          }), i = qe(
            [n.nodes, () => n.nodes.value.length],
            ([l]) => {
              var u;
              (u = e.nodes) != null && u.value && Array.isArray(e.nodes.value) && (a == null || a.pause(), e.nodes.value = [...l], Ae(() => {
                a == null || a.resume();
              }));
            },
            { immediate: r }
          ), At(() => {
            a == null || a.stop(), i == null || i.stop();
          });
        });
      },
      () => {
        o.run(() => {
          let a, i, r = !!n.edges.value.length;
          a = qe([e.edges, () => {
            var l, u;
            return (u = (l = e.edges) == null ? void 0 : l.value) == null ? void 0 : u.length;
          }], ([l]) => {
            l && Array.isArray(l) && (i == null || i.pause(), n.setEdges(l), !i && !r && l.length ? r = !0 : i == null || i.resume());
          }), i = qe(
            [n.edges, () => n.edges.value.length],
            ([l]) => {
              var u;
              (u = e.edges) != null && u.value && Array.isArray(e.edges.value) && (a == null || a.pause(), e.edges.value = [...l], Ae(() => {
                a == null || a.resume();
              }));
            },
            { immediate: r }
          ), At(() => {
            a == null || a.stop(), i == null || i.stop();
          });
        });
      },
      () => {
        o.run(() => {
          se(
            () => t.minZoom,
            () => {
              t.minZoom && ue(t.minZoom) && n.setMinZoom(t.minZoom);
            }
          );
        });
      },
      () => {
        o.run(() => {
          se(
            () => t.maxZoom,
            () => {
              t.maxZoom && ue(t.maxZoom) && n.setMaxZoom(t.maxZoom);
            }
          );
        });
      },
      () => {
        o.run(() => {
          se(
            () => t.translateExtent,
            () => {
              t.translateExtent && ue(t.translateExtent) && n.setTranslateExtent(t.translateExtent);
            }
          );
        });
      },
      () => {
        o.run(() => {
          se(
            () => t.nodeExtent,
            () => {
              t.nodeExtent && ue(t.nodeExtent) && n.setNodeExtent(t.nodeExtent);
            }
          );
        });
      },
      () => {
        o.run(() => {
          se(
            () => t.applyDefault,
            () => {
              ue(t.applyDefault) && (n.applyDefault.value = t.applyDefault);
            }
          ), se(
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
            Ve(t.autoConnect) && (r = await t.autoConnect(i)), r !== !1 && n.addEdges([r]);
          };
          se(
            () => t.autoConnect,
            () => {
              ue(t.autoConnect) && (n.autoConnect.value = t.autoConnect);
            }
          ), se(
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
            const r = k(t, i), l = n[i];
            o.run(() => {
              se(
                r,
                (u) => {
                  ue(u) && (l.value = u);
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
function ta(e, t) {
  return {
    x: e.clientX - t.left,
    y: e.clientY - t.top
  };
}
const ad = {
  name: "Pane",
  compatConfig: { MODE: 3 }
}, id = /* @__PURE__ */ ve({
  ...ad,
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
      panOnDrag: c,
      userSelectionRect: s,
      elementsSelectable: d,
      nodesSelectionActive: v,
      addSelectedElements: b,
      getSelectedEdges: g,
      getSelectedNodes: w,
      removeNodes: E,
      removeEdges: _,
      selectionMode: $,
      deleteKeyCode: Y,
      multiSelectionKeyCode: m,
      multiSelectionActive: O
    } = de(), x = J(null), h = J(0), S = J(0), T = J(), C = Q(() => d.value && (e.isSelecting || l.value));
    bt(Y, (B) => {
      if (!B)
        return;
      const U = o.value.reduce((V, Z) => ((!Z.selected && Z.parentNode && V.find((G) => G.id === Z.parentNode) || Z.selected) && V.push(Z), V), []);
      (U || g.value) && (g.value.length > 0 && _(g.value), U.length > 0 && E(U), v.value = !1, u());
    }), bt(m, (B) => {
      O.value = B;
    });
    function D() {
      l.value = !1, s.value = null, h.value = 0, S.value = 0;
    }
    function ee(B) {
      B.target !== x.value || C.value || (r.paneClick(B), u(), v.value = !1);
    }
    function ae(B) {
      var U;
      if (B.target === x.value) {
        if (Array.isArray(c.value) && (U = c.value) != null && U.includes(2)) {
          B.preventDefault();
          return;
        }
        r.paneContextMenu(B);
      }
    }
    function p(B) {
      B.target === x.value && r.paneScroll(B);
    }
    function R(B) {
      if (T.value = n.value.getBoundingClientRect(), !C.value || !d || !e.isSelecting || B.button !== 0 || B.target !== x.value || !T.value)
        return;
      const { x: U, y: V } = ta(B, T.value);
      u(), s.value = {
        width: 0,
        height: 0,
        startX: U,
        startY: V,
        x: U,
        y: V
      }, l.value = !0, r.selectionStart(B);
    }
    function N(B) {
      if (!C.value)
        return r.paneMouseMove(B);
      if (!e.isSelecting || !T.value || !s.value)
        return;
      l.value || (l.value = !0), v.value && (v.value = !1);
      const U = ta(B, T.value), V = s.value.startX ?? 0, Z = s.value.startY ?? 0, G = {
        ...s.value,
        x: U.x < V ? U.x : V,
        y: U.y < Z ? U.y : Z,
        width: Math.abs(U.x - V),
        height: Math.abs(U.y - Z)
      }, te = xa(
        o.value,
        s.value,
        i.value,
        $.value === Wn.Partial
      ), I = tn(te, a.value);
      h.value = te.length, S.value = I.length, s.value = G, b([...te, ...I]);
    }
    function z(B) {
      C.value && B.button === 0 && (!l.value && s.value && B.target === x.value && ee(B), v.value = h.value > 0, D(), r.selectionEnd(B));
    }
    function H(B) {
      var U;
      if (!C.value)
        return r.paneMouseLeave(B);
      l.value && (v.value = h.value > 0, (U = r.selectionEnd) == null || U.call(r, B)), D();
    }
    function W(B) {
      C.value || r.paneMouseEnter(B);
    }
    return (B, U) => (oe(), ie("div", {
      ref_key: "container",
      ref: x,
      key: `pane-${M(t)}`,
      class: Ue(["vue-flow__pane vue-flow__container", { selection: e.isSelecting }]),
      onClick: ee,
      onContextmenu: ae,
      onWheelPassive: p,
      onMouseenter: W,
      onMousedown: R,
      onMousemove: N,
      onMouseup: z,
      onMouseleave: H
    }, [
      we(B.$slots, "default"),
      M(l) && M(s) ? (oe(), xe(is, { key: 0 })) : fe("", !0),
      M(v) && M(w).length ? (oe(), xe(os, { key: 1 })) : fe("", !0)
    ], 34));
  }
}), rd = { class: "vue-flow__nodes vue-flow__container" }, ld = {
  name: "Nodes",
  compatConfig: { MODE: 3 }
}, ud = /* @__PURE__ */ ve({
  ...ld,
  setup(e) {
    const t = rt(nn), n = de(), o = k(n, "nodesDraggable"), a = k(n, "nodesFocusable"), i = k(n, "elementsSelectable"), r = k(n, "nodesConnectable"), l = k(n, "getNodes"), u = k(n, "getNodesInitialized"), c = k(n, "getNodeTypes"), s = k(n, "updateNodeDimensions"), d = k(n, "emits");
    let v = J();
    ye(() => l.value.length > 0 && u.value.length === l.value.length).toBe(!0).then(() => {
      Ae(() => {
        d.value.nodesInitialized(u.value);
      });
    }), ze(() => {
      v.value = new ResizeObserver(($) => {
        const Y = $.map((m) => ({
          id: m.target.getAttribute("data-id"),
          nodeElement: m.target,
          forceUpdate: !0
        }));
        s.value(Y);
      });
    }), Gn(() => {
      var $;
      return ($ = v.value) == null ? void 0 : $.disconnect();
    });
    function b($) {
      return typeof $ > "u" ? o.value : $;
    }
    function g($) {
      return typeof $ > "u" ? i.value : $;
    }
    function w($) {
      return typeof $ > "u" ? r.value : $;
    }
    function E($) {
      return typeof $ > "u" ? a.value : $;
    }
    function _($, Y) {
      const m = $ || "default";
      let O = Y ?? c.value[m];
      const x = Jt();
      if (typeof O == "string" && x) {
        const S = Object.keys(x.appContext.components);
        S && S.includes(m) && (O = ia(m, !1));
      }
      return typeof O != "string" ? O : (t == null ? void 0 : t[`node-${m}`]) || (d.value.error(new ge(he.NODE_TYPE_MISSING, O)), !1);
    }
    return ($, Y) => (oe(), ie("div", rd, [
      M(v) ? (oe(!0), ie(Se, { key: 0 }, lt(M(l), (m) => (oe(), xe(M(Cu), {
        id: m.id,
        key: m.id,
        "resize-observer": M(v),
        type: _(m.type, m.template),
        name: m.type || "default",
        draggable: b(m.draggable),
        selectable: g(m.selectable),
        connectable: w(m.connectable),
        focusable: E(m.focusable),
        node: m
      }, null, 8, ["id", "resize-observer", "type", "name", "draggable", "selectable", "connectable", "focusable", "node"]))), 128)) : fe("", !0)
    ]));
  }
}), sd = ["id", "markerWidth", "markerHeight", "markerUnits", "orient"], cd = ["stroke", "stroke-width", "fill"], dd = ["stroke", "stroke-width"], vd = {
  name: "MarkerType",
  compatConfig: { MODE: 3 }
}, fd = /* @__PURE__ */ ve({
  ...vd,
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
    return (t, n) => (oe(), ie("marker", {
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
      e.type === M(Tn).ArrowClosed ? (oe(), ie("polyline", {
        key: 0,
        stroke: e.color,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": e.strokeWidth,
        fill: e.color,
        points: "-5,-4 0,0 -5,4 -5,-4"
      }, null, 8, cd)) : fe("", !0),
      e.type === M(Tn).Arrow ? (oe(), ie("polyline", {
        key: 1,
        stroke: e.color,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": e.strokeWidth,
        fill: "none",
        points: "-5,-4 0,0 -5,4"
      }, null, 8, dd)) : fe("", !0)
    ], 8, sd));
  }
}), hd = {
  name: "MarkerDefinitions",
  compatConfig: { MODE: 3 }
}, gd = /* @__PURE__ */ ve({
  ...hd,
  setup(e) {
    const t = de(), n = k(t, "id"), o = k(t, "edges"), a = k(t, "connectionLineOptions"), i = k(t, "defaultMarkerColor"), r = Q(() => {
      const l = [], u = [], c = (s) => {
        if (s) {
          const d = Ge(s, n.value);
          l.includes(d) || (typeof s == "object" ? u.push({ ...s, id: d, color: s.color || i.value }) : u.push({ id: d, color: i.value, type: s }), l.push(d));
        }
      };
      return [a.value.markerEnd, a.value.markerStart].forEach(c), o.value.reduce((s, d) => ([d.markerStart, d.markerEnd].forEach(c), s.sort((v, b) => v.id.localeCompare(b.id))), u), u;
    });
    return (l, u) => (oe(), ie("defs", null, [
      (oe(!0), ie(Se, null, lt(M(r), (c) => (oe(), xe(fd, {
        id: c.id,
        key: c.id,
        type: c.type,
        color: c.color,
        width: c.width,
        height: c.height,
        markerUnits: c.markerUnits,
        "stroke-width": c.strokeWidth,
        orient: c.orient
      }, null, 8, ["id", "type", "color", "width", "height", "markerUnits", "stroke-width", "orient"]))), 128))
    ]));
  }
}), pd = {
  key: 0,
  class: "vue-flow__edges vue-flow__connectionline vue-flow__container"
}, md = {
  name: "Edges",
  compatConfig: { MODE: 3 }
}, yd = /* @__PURE__ */ ve({
  ...md,
  setup(e) {
    const t = rt(nn), n = de(), o = k(n, "connectionStartHandle"), a = k(n, "nodesConnectable"), i = k(n, "edgesUpdatable"), r = k(n, "edgesFocusable"), l = k(n, "elementsSelectable"), u = k(n, "getSelectedNodes"), c = k(n, "findNode"), s = k(n, "edges"), d = k(n, "getEdges"), v = k(n, "getNodesInitialized"), b = k(n, "getEdgeTypes"), g = k(n, "elevateEdgesOnSelect"), w = k(n, "dimensions"), E = k(n, "emits"), _ = bn(
      () => {
        var S;
        return (S = o.value) == null ? void 0 : S.nodeId;
      },
      () => {
        var S;
        return (S = o.value) != null && S.nodeId ? c.value(o.value.nodeId) : !1;
      }
    ), $ = bn(
      () => {
        var S;
        return (S = o.value) == null ? void 0 : S.nodeId;
      },
      () => {
        var S, T;
        return !!(_.value && (typeof _.value.connectable > "u" ? a.value : _.value.connectable) && (S = o.value) != null && S.nodeId && (T = o.value) != null && T.type);
      }
    ), Y = bn(
      [
        () => s.value.map((S) => S.zIndex),
        () => g.value ? [u.value.length] : [0],
        () => g.value ? v.value.map((S) => S.computedPosition.z) : []
      ],
      () => xr(d.value, c.value, g.value)
    );
    function m(S) {
      return typeof S > "u" ? l.value : S;
    }
    function O(S) {
      return typeof S > "u" ? i.value : S;
    }
    function x(S) {
      return typeof S > "u" ? r.value : S;
    }
    function h(S, T) {
      const C = S || "default";
      let D = T ?? b.value[C];
      const ee = Jt();
      if (typeof D == "string" && ee) {
        const p = Object.keys(ee.appContext.components);
        p && p.includes(C) && (D = ia(C, !1));
      }
      return D && typeof D != "string" ? D : (t == null ? void 0 : t[`edge-${C}`]) || (E.value.error(new ge(he.EDGE_TYPE_MISSING, D)), !1);
    }
    return (S, T) => M(w).width && M(w).height ? (oe(), ie(Se, { key: 0 }, [
      (oe(!0), ie(Se, null, lt(M(Y), (C) => (oe(), ie("svg", {
        key: C.level,
        class: "vue-flow__edges vue-flow__container",
        style: Re(`z-index: ${C.level}`)
      }, [
        C.isMaxLevel ? (oe(), xe(gd, { key: 0 })) : fe("", !0),
        ce("g", null, [
          (oe(!0), ie(Se, null, lt(C.edges, (D) => (oe(), xe(M(Uu), {
            id: D.id,
            key: D.id,
            edge: D,
            type: h(D.type, D.template),
            name: D.type || "default",
            selectable: m(D.selectable),
            updatable: O(D.updatable),
            focusable: x(D.focusable)
          }, null, 8, ["id", "edge", "type", "name", "selectable", "updatable", "focusable"]))), 128))
        ])
      ], 4))), 128)),
      M($) && M(_) ? (oe(), ie("svg", pd, [
        Ne(es, { "source-node": M(_) }, null, 8, ["source-node"])
      ])) : fe("", !0)
    ], 64)) : fe("", !0);
  }
}), bd = /* @__PURE__ */ ce("div", { class: "vue-flow__edge-labels" }, null, -1), wd = {
  name: "Transform",
  compatConfig: { MODE: 3 }
}, xd = /* @__PURE__ */ ve({
  ...wd,
  setup(e) {
    const { id: t, viewport: n, emits: o, d3Zoom: a, d3Selection: i, dimensions: r, ...l } = de(), u = J(!jn);
    return ye(() => a.value && i.value && r.value.width > 0 && r.value.height > 0).toBeTruthy().then(() => {
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
    }), (c, s) => (oe(), ie("div", {
      key: `transform-${M(t)}`,
      class: "vue-flow__transformationpane vue-flow__container",
      style: Re({
        transform: `translate(${M(n).x}px,${M(n).y}px) scale(${M(n).zoom})`,
        opacity: M(u) ? void 0 : 0
      })
    }, [
      Ne(yd),
      bd,
      Ne(ud),
      we(c.$slots, "default")
    ], 4));
  }
}), _d = {
  name: "Viewport",
  compatConfig: { MODE: 3 }
}, Ed = /* @__PURE__ */ ve({
  ..._d,
  setup(e) {
    const t = de(), n = k(t, "id"), o = k(t, "minZoom"), a = k(t, "maxZoom"), i = k(t, "defaultViewport"), r = k(t, "translateExtent"), l = k(t, "dimensions"), u = k(t, "zoomActivationKeyCode"), c = k(t, "selectionKeyCode"), s = k(t, "panActivationKeyCode"), d = k(t, "panOnScroll"), v = k(t, "panOnScrollMode"), b = k(t, "panOnScrollSpeed"), g = k(t, "panOnDrag"), w = k(t, "zoomOnDoubleClick"), E = k(t, "zoomOnPinch"), _ = k(t, "zoomOnScroll"), $ = k(t, "preventScrolling"), Y = k(t, "noWheelClassName"), m = k(t, "noPanClassName"), O = k(t, "setState"), x = k(t, "emits"), h = k(t, "connectionStartHandle"), S = k(t, "userSelectionActive"), T = k(t, "paneDragging"), C = J();
    let D = J(!1), ee = J(!1), ae = J(!1), p = J(0);
    const R = bt(s.value), N = Q(() => !D.value && g.value && R.value), z = Q(
      () => c.value !== !0 && D.value || c.value === !0 && N.value !== !0
    );
    let H = J({
      x: 0,
      y: 0,
      zoom: 0
    });
    ze(() => {
      qi(C, V);
      const G = Kn();
      Un(G, "resize", V);
    }), ze(() => {
      const G = C.value, te = G.getBoundingClientRect(), I = Jc().scaleExtent([o.value, a.value]).translateExtent(r.value), f = _e(G).call(I), y = f.on("wheel.zoom"), L = Pt.translate(i.value.x ?? 0, i.value.y ?? 0).scale(st(i.value.zoom ?? 1, o.value, a.value)), A = [
        [0, 0],
        [te.width, te.height]
      ], F = I.constrain()(L, A, r.value);
      I.transform(f, F), O.value({
        d3Zoom: I,
        d3Selection: f,
        d3ZoomHandler: y,
        viewport: { x: F.x, y: F.y, zoom: F.k },
        viewportRef: G
      }), bt(c, (P) => {
        D.value = P;
      });
      const X = bt(u.value);
      io(() => {
        D.value && S.value && !ee.value ? I.on("zoom", null) : !D.value && !S.value && I.on("zoom", (P) => {
          O.value({ viewport: { x: P.transform.x, y: P.transform.y, zoom: P.transform.k } });
          const K = U(P.transform);
          ae.value = W(g.value, p.value ?? 0), x.value.viewportChange(K), x.value.move({ event: P, flowTransform: K });
        });
      }), I.on("start", (P) => {
        var K;
        if (!P.sourceEvent)
          return null;
        p.value = P.sourceEvent.button, ee.value = !0;
        const ne = U(P.transform);
        ((K = P.sourceEvent) == null ? void 0 : K.type) === "mousedown" && O.value({ paneDragging: !0 }), H.value = ne, x.value.viewportChangeStart(ne), x.value.moveStart({ event: P, flowTransform: ne });
      }), I.on("end", (P) => {
        if (!P.sourceEvent)
          return null;
        if (ee.value = !1, O.value({ paneDragging: !1 }), W(g.value, p.value ?? 0) && !ae.value && x.value.paneContextMenu(P.sourceEvent), ae.value = !1, B(H.value, P.transform)) {
          const K = U(P.transform);
          H.value = K, x.value.viewportChangeEnd(K), x.value.moveEnd({ event: P, flowTransform: K });
        }
      }), io(() => {
        d.value && !X.value && !S.value ? f.on(
          "wheel.zoom",
          (P) => {
            if (Z(P, Y.value))
              return !1;
            P.preventDefault(), P.stopImmediatePropagation();
            const K = f.property("__zoom").k || 1;
            if (P.ctrlKey && E.value) {
              const yn = Me(P), gi = -P.deltaY * (P.deltaMode === 1 ? 0.05 : P.deltaMode ? 1 : 2e-3) * 10, pi = K * 2 ** gi;
              I.scaleTo(f, pi, yn);
              return;
            }
            const ne = P.deltaMode === 1 ? 20 : 1, pe = v.value === Gt.Vertical ? 0 : P.deltaX * ne, Ze = v.value === Gt.Horizontal ? 0 : P.deltaY * ne;
            I.translateBy(f, -(pe / K) * b.value, -(Ze / K) * b.value);
          },
          { passive: !1 }
        ) : typeof y < "u" && f.on(
          "wheel.zoom",
          function(P, K) {
            if (!$.value || Z(P, Y.value))
              return null;
            P.preventDefault(), y.call(this, P, K);
          },
          { passive: !1 }
        );
      }), I.filter((P) => {
        var K, ne;
        const pe = X.value || _.value, Ze = E.value && P.ctrlKey;
        if (P.button === 1 && P.type === "mousedown" && ((K = P.target) != null && K.closest(".vue-flow__node") || (ne = P.target) != null && ne.closest(".vue-flow__edge")))
          return !0;
        if (!g.value && !pe && !d.value && !w.value && !E.value || S.value || !w.value && P.type === "dblclick" || Z(P, Y.value) && P.type === "wheel" || Z(P, m.value) && P.type !== "wheel" || !E.value && P.ctrlKey && P.type === "wheel" || !pe && !d.value && !Ze && P.type === "wheel" || !g.value && (P.type === "mousedown" || P.type === "touchstart") || Array.isArray(g.value) && !g.value.includes(P.button) && (P.type === "mousedown" || P.type === "touchstart"))
          return !1;
        const yn = Array.isArray(g.value) && g.value.includes(P.button) || !P.button || P.button <= 1;
        return (!P.ctrlKey || P.type === "wheel") && yn;
      });
    });
    function W(G, te) {
      return te === 2 && Array.isArray(G) && G.includes(2);
    }
    function B(G, te) {
      return G.x !== te.x && !isNaN(te.x) || G.y !== te.y && !isNaN(te.y) || G.zoom !== te.k && !isNaN(te.k);
    }
    function U(G) {
      return {
        x: G.x,
        y: G.y,
        zoom: G.k
      };
    }
    function V() {
      if (!C.value)
        return;
      const { width: G, height: te } = en(C.value);
      (G === 0 || te === 0) && x.value.error(new ge(he.MISSING_VIEWPORT_DIMENSIONS)), l.value.width = G || 500, l.value.height = te || 500;
    }
    function Z(G, te) {
      return G.target.closest(`.${te}`);
    }
    return (G, te) => (oe(), ie(Se, null, [
      (oe(), ie("div", {
        ref_key: "viewportEl",
        ref: C,
        key: `viewport-${M(n)}`,
        class: "vue-flow__viewport vue-flow__container"
      }, [
        Ne(id, {
          "is-selecting": M(z),
          class: Ue({ connecting: !!M(h), dragging: M(T), draggable: !!M(g) })
        }, {
          default: Pe(() => [
            Ne(xd, null, {
              default: Pe(() => [
                we(G.$slots, "zoom-pane")
              ]),
              _: 3
            })
          ]),
          _: 3
        }, 8, ["is-selecting", "class"])
      ])),
      we(G.$slots, "default")
    ], 64));
  }
}), Sd = ["id"], Nd = ["id"], kd = ["id"], Md = {
  name: "A11yDescriptions",
  compatConfig: { MODE: 3 }
}, Pd = /* @__PURE__ */ ve({
  ...Md,
  setup(e) {
    const { id: t, disableKeyboardA11y: n, ariaLiveMessage: o } = de(), a = {
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
    return (i, r) => (oe(), ie(Se, null, [
      ce("div", {
        id: `${M(ja)}-${M(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select a node. " + ut(M(n) ? "" : "You can then use the arrow keys to move the node around.") + " You can then use the arrow keys to move the node around, press delete to remove it and press escape to cancel. ", 9, Sd),
      ce("div", {
        id: `${M(Ha)}-${M(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel. ", 8, Nd),
      M(n) ? fe("", !0) : (oe(), ie("div", {
        key: 0,
        id: `${M(Nu)}-${M(t)}`,
        "aria-live": "assertive",
        "aria-atomic": "true",
        style: a
      }, ut(M(o)), 9, kd))
    ], 64));
  }
}), Cd = {
  name: "VueFlow",
  compatConfig: { MODE: 3 }
}, Id = /* @__PURE__ */ ve({
  ...Cd,
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
    const o = e, a = yt(o, "modelValue", n), i = yt(o, "nodes", n), r = yt(o, "edges", n), { vueFlowRef: l, hooks: u, getNodeTypes: c, getEdgeTypes: s, ...d } = de(o), v = od({ modelValue: a, nodes: i, edges: r }, o, {
      vueFlowRef: l,
      hooks: u,
      getNodeTypes: c,
      getEdgeTypes: s,
      ...d
    });
    ir(n, u);
    const b = J();
    return it(nn, yi()), bi(() => {
      v();
    }), ze(() => {
      l.value = b.value;
    }), t({
      vueFlowRef: l,
      hooks: u,
      getNodeTypes: c,
      getEdgeTypes: s,
      ...d
    }), (g, w) => (oe(), ie("div", {
      ref_key: "el",
      ref: b,
      class: "vue-flow"
    }, [
      Ne(Ed, null, {
        nodes: Pe(() => [
          (oe(!0), ie(Se, null, lt(Object.keys(M(c)), (E) => we(g.$slots, `node-${E}`)), 256))
        ]),
        edges: Pe(() => [
          (oe(!0), ie(Se, null, lt(Object.keys(M(s)), (E) => we(g.$slots, `edge-${E}`)), 256))
        ]),
        "connection-name": Pe(() => [
          we(g.$slots, "connection-line")
        ]),
        "zoom-pane": Pe(() => [
          we(g.$slots, "zoom-pane")
        ]),
        default: Pe(() => [
          we(g.$slots, "default")
        ]),
        _: 3
      }),
      Ne(Pd)
    ], 512));
  }
});
const Od = {
  key: 0,
  class: "label-input-wrapper"
}, $d = ["onKeypress"], Td = /* @__PURE__ */ ve({
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
      top: q.Top,
      right: q.Right,
      bottom: q.Bottom,
      left: q.Left
    }, a = Q(() => o[n.sourcePosition]), i = Q(() => o[n.targetPosition]), r = J(), l = J(""), u = J(!1);
    let c = 0;
    const s = () => {
      let b = Date.now();
      b - c < 500 && !u.value && d(), c = b;
    }, d = async () => {
      l.value = n.label, u.value = !0, await Ae(), r.value.focus();
    }, v = () => {
      u.value = !1, t("change", l.value);
    };
    return (b, g) => (oe(), ie("div", {
      onClick: g[2] || (g[2] = (w) => s())
    }, [
      ce("div", null, ut(n.label), 1),
      u.value ? (oe(), ie("div", Od, [
        la(ce("input", {
          ref_key: "labelInput",
          ref: r,
          class: "label-input",
          "onUpdate:modelValue": g[0] || (g[0] = (w) => l.value = w),
          onBlur: g[1] || (g[1] = (w) => u.value = !1),
          onKeypress: ua(v, ["enter"])
        }, null, 40, $d), [
          [sa, l.value]
        ])
      ])) : fe("", !0),
      n.data.hasInput ? (oe(), xe(M(dt), {
        key: 1,
        id: "a",
        type: "target",
        position: M(i)
      }, null, 8, ["position"])) : fe("", !0),
      n.data.hasOutput ? (oe(), xe(M(dt), {
        key: 2,
        id: "b",
        type: "source",
        position: M(a)
      }, null, 8, ["position"])) : fe("", !0)
    ]));
  }
});
const Dd = ["id", "d", "marker-end"], Bd = { class: "vue-flow__edge-label" }, Ad = {
  key: 0,
  class: "label-input-wrapper"
}, zd = ["onKeypress"], Rd = {
  inheritAttrs: !1
}, Vd = /* @__PURE__ */ ve({
  ...Rd,
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
    de();
    const o = J(), a = J(""), i = J(!1);
    let r = 0;
    const l = () => {
      let d = Date.now();
      d - r < 500 && !i.value && u(), r = d;
    }, u = async () => {
      a.value = n.label, i.value = !0, await Ae(), o.value.focus();
    }, c = () => {
      i.value = !1, t("change", a.value);
    }, s = Q(() => Ut(n));
    return (d, v) => (oe(), ie(Se, null, [
      ce("path", {
        id: e.id,
        style: Re(e.style),
        class: "vue-flow__edge-path",
        d: M(s)[0],
        "marker-end": e.markerEnd
      }, null, 12, Dd),
      Ne(M(Zu), null, {
        default: Pe(() => [
          ce("div", {
            style: Re({
              pointerEvents: "all",
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${M(s)[1]}px,${M(s)[2]}px)`
            }),
            class: "nodrag nopan editable-edge-label",
            onClick: v[2] || (v[2] = (b) => l())
          }, [
            ce("div", Bd, ut(n.label), 1),
            i.value ? (oe(), ie("div", Ad, [
              la(ce("input", {
                ref_key: "labelInput",
                ref: o,
                class: "label-input",
                "onUpdate:modelValue": v[0] || (v[0] = (b) => a.value = b),
                onBlur: v[1] || (v[1] = (b) => i.value = !1),
                onKeypress: ua(c, ["enter"])
              }, null, 40, zd), [
                [sa, a.value]
              ])
            ])) : fe("", !0)
          ], 4)
        ]),
        _: 1
      })
    ], 64));
  }
});
const Ld = { class: "chart-controls" }, Fd = { class: "chart-controls-left" }, Xd = /* @__PURE__ */ ce("b", null, "Selected Node:", -1), Yd = { class: "chart-controls-right" }, Gd = { key: 0 }, jd = { key: 1 }, hi = /* @__PURE__ */ ve({
  __name: "NodeEditor",
  props: {
    modelValue: null,
    nodeContainerClass: null
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = J(""), a = J({}), i = J(!1);
    J({
      x: 0,
      y: 0
    });
    const r = J(""), l = J([]), u = Q(() => {
      for (let x = 0; x < l.value.length; x++)
        if (l.value[x].id == r.value)
          return x;
      return -1;
    }), c = Q({
      get: () => {
        let x = n.modelValue;
        n.nodeContainerClass ? o.value = n.nodeContainerClass : o.value = "defaultContainerClass";
        for (let h = 0; h < x.length; h++)
          x[h].data = {}, x[h].type == "input" ? (x[h].data.hasInput = !1, x[h].data.hasOutput = !0) : x[h].type == "output" ? (x[h].data.hasInput = !0, x[h].data.hasOutput = !1) : (x[h].data.hasInput = !0, x[h].data.hasOutput = !0), x[h].class = "vue-flow__node-default", x[h].type = "editable";
        for (let h = 0; h < x.length; h++) {
          let S = x[h].id;
          x[h], x[h].events = {
            click: () => {
              r.value = S;
            }
          };
        }
        return x;
      },
      set: (x) => {
        t("update:modelValue", JSON.parse(JSON.stringify(x)));
      }
    }), { getNodes: s, onPaneReady: d } = de({});
    d((x) => {
      a.value = x;
    }), l.value = c.value, ze(() => {
      document.removeEventListener("keypress", E), document.addEventListener("keypress", E);
    }), Gn(() => {
      document.removeEventListener("keypress", E);
    });
    const v = (x) => ({
      top: "right",
      right: "bottom",
      bottom: "left",
      left: "top"
    })[x], b = () => {
      u.value > -1 && (l.value[u.value].sourcePosition = v(
        l.value[u.value].sourcePosition
      ));
    }, g = () => {
      u.value > -1 && (l.value[u.value].targetPosition = v(
        l.value[u.value].targetPosition
      ));
    }, w = (x) => {
      window.scrollBy(0, x.deltaY);
    }, E = (x) => {
      i.value && x.ctrlKey == !0 && ((x.key == "+" || x.key == "=") && a.value.zoomIn(), x.key == "-" && a.value.zoomOut());
    }, _ = () => {
      a.value.fitView();
    }, $ = () => {
      let x = { x: Math.random() * 200, y: Math.random() * 200 }, h = !1;
      if (u.value > -1) {
        const C = l.value[u.value];
        C.data.hasOutput && (x = { x: C.position.x + 200, y: C.position.y + 50 }, h = !0);
      }
      let S = l.value.length, T = `node-${S}`;
      if (l.value.push({
        id: T,
        label: "Node " + S,
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
            r.value = T;
          }
        },
        // position: { x: Math.random() * vueFlowInstance.value.dimensions.width, y: Math.random() * vueFlowInstance.value.dimensions.height }
        position: x
      }), h) {
        let C = `edge-${S + 1}`;
        l.value.push({
          id: C,
          source: r.value,
          target: T,
          type: "editable",
          label: `EDGE ${S + 1}`,
          animated: !0,
          events: {
            click: () => {
              r.value = C;
            }
          }
        });
      }
    }, Y = (x) => {
      console.log("edge connect", x);
    }, m = (x) => {
      console.log("edge double click", x);
    }, O = (x, h) => {
      for (let S = 0; S < l.value.length; S++)
        if (l.value[S].id == h) {
          l.value[S].label = x;
          break;
        }
    };
    return (x, h) => (oe(), ie("div", {
      class: Ue(["node-editor-wrapper", o.value]),
      onMouseover: h[8] || (h[8] = (S) => i.value = !0),
      onMouseleave: h[9] || (h[9] = (S) => i.value = !1)
    }, [
      ce("div", Ld, [
        ce("div", Fd, [
          ce("div", null, [
            Xd,
            ra(" " + ut(r.value ? r.value : "none"), 1)
          ])
        ]),
        ce("div", Yd, [
          ce("div", null, [
            ce("button", {
              class: "button-default",
              onClick: h[0] || (h[0] = (S) => $())
            }, "Add Node")
          ]),
          ce("div", null, [
            ce("button", {
              class: "button-default",
              onClick: h[1] || (h[1] = (S) => _())
            }, "Center")
          ]),
          M(u) > -1 ? (oe(), ie("div", Gd, [
            ce("button", {
              class: "button-default",
              onClick: h[2] || (h[2] = (S) => g())
            }, "Shift Input Position")
          ])) : fe("", !0),
          M(u) > -1 ? (oe(), ie("div", jd, [
            ce("button", {
              class: "button-default",
              onClick: h[3] || (h[3] = (S) => b())
            }, "Shift Output Position")
          ])) : fe("", !0)
        ])
      ]),
      l.value && l.value.length ? (oe(), xe(M(Id), {
        key: 0,
        onWheel: h[4] || (h[4] = Mi((S) => w(S), ["prevent"])),
        class: "nowheel",
        "prevent-scrolling": !0,
        "zoom-on-scroll": !1,
        "fit-view-on-init": !0,
        modelValue: l.value,
        "onUpdate:modelValue": h[5] || (h[5] = (S) => l.value = S),
        onConnect: h[6] || (h[6] = (S) => Y(S)),
        onEdgeDoubleClick: h[7] || (h[7] = (S) => m(S))
      }, {
        "node-editable": Pe((S) => [
          Ne(Td, Xt(S, {
            onChange: (T) => O(T, S.id)
          }), null, 16, ["onChange"])
        ]),
        "edge-editable": Pe((S) => [
          Ne(Vd, Xt(S, {
            onChange: (T) => O(T, S.id)
          }), null, 16, ["onChange"])
        ]),
        _: 1
      }, 8, ["modelValue"])) : fe("", !0)
    ], 34));
  }
});
const Hd = /* @__PURE__ */ ve({
  __name: "StateEditor",
  props: ["layout", "nodeContainerClass", "modelValue"],
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = Q({
      get: () => {
        let i = n.modelValue, r = {}, l = {}, u = 0, c = [];
        for (let s in i) {
          c.length;
          let d = {
            id: s,
            label: s,
            position: n.layout[s] && n.layout[s].position ? n.layout[s].position : { x: 200 * u, y: 100 },
            targetPosition: n.layout[s] && n.layout[s].targetPosition ? n.layout[s].targetPosition : "left",
            sourcePosition: n.layout[s] && n.layout[s].sourcePosition ? n.layout[s].sourcePosition : "right"
          };
          i[s].type && i[s].type == "final" && (d.type = "output", d.class = "default-output-node"), r[s] = d;
          let v = i[s].on;
          for (let b in i[s].on) {
            let g = v[b];
            typeof g == "object" && g.constructor === Object && (g = g.target), c.push({
              id: `${s}-${v[b]}-${b}`,
              target: g,
              source: s,
              label: b,
              animated: !0
            }), l[g] = !0;
          }
          u++;
        }
        for (let s in r)
          l[s] || (r[s].type = "input", r[s].class = "default-input-node"), c.push(r[s]);
        return c;
      },
      set: (i) => {
        a(i);
      }
    }), a = (i) => {
      let r = {}, l = {}, u = {};
      for (let c = 0; c < i.length; c++) {
        let s = i[c];
        s.type == "input" ? r[s.label] = {
          on: {}
        } : s.type == "output" ? r[s.label] = {
          type: "final"
        } : s.source && s.target ? (l[s.source] = l[s.source] || {}, l[s.source][s.label] = {
          target: s.target
        }) : r[s.label] = {
          on: {}
        }, u[s.id] = s.label;
      }
      for (let c in l) {
        let s = u[c];
        for (let d in l[c])
          r[s].on[d] = l[c][d];
      }
      t("update:modelValue", r);
    };
    return (i, r) => (oe(), ie("div", null, [
      Ne(hi, {
        modelValue: M(o),
        "onUpdate:modelValue": r[0] || (r[0] = (l) => oa(o) ? o.value = l : null),
        "node-container-class": e.nodeContainerClass
      }, null, 8, ["modelValue", "node-container-class"])
    ]));
  }
});
function Kd(e) {
  e.component("NodeEditor", hi), e.component("StateEditor", Hd);
}
export {
  hi as NodeEditor,
  Hd as StateEditor,
  Kd as install
};
//# sourceMappingURL=node-editor.js.map
