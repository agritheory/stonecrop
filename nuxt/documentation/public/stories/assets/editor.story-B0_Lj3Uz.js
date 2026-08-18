import { av as defineComponent, a_ as useModel, ax as computed, aq as openBlock, aU as createElementBlock, at as createVNode, a$ as mergeModels, aL as onMounted, b0 as onBeforeUnmount, au as createBaseVNode, az as createTextVNode, aA as toDisplayString, aC as createCommentVNode, ar as createBlock, as as withCtx, b1 as mergeProps, b2 as withModifiers, aR as unref, b3 as normalizeClass, ay as ref, b4 as inject, b5 as effectScope, aG as watch, b6 as provide, aT as useTemplateRef, aZ as normalizeStyle, aV as withDirectives, b7 as withKeys, b8 as vModelText, aX as Fragment, aM as nextTick, b9 as useSlots, ba as onUnmounted, bb as renderSlot, aO as getCurrentInstance, bc as getCurrentScope, bd as onScopeDispose, be as Teleport, aP as toRef, bf as createPropsRestProxy, bg as onBeforeMount, aY as renderList, bh as isMemoSame, aJ as shallowRef, aw as reactive, bi as isRef, bj as toRefs, aQ as customRef, ap as resolveComponent, aE as h, aK as toValue, bk as useAttrs, bl as resolveDynamicComponent, bm as markRaw, aN as readonly } from "./vendor-BFYlYCwc.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
function Dt(e3) {
  return getCurrentScope() ? (onScopeDispose(e3), true) : false;
}
function Ye(e3) {
  return typeof e3 == "function" ? e3() : unref(e3);
}
const zr = typeof window < "u" && typeof document < "u", Br = (e3) => typeof e3 < "u", Vr = Object.prototype.toString, Rr = (e3) => Vr.call(e3) === "[object Object]", Hr = () => {
};
function Lr(e3, t) {
  function n(...o) {
    return new Promise((i, r) => {
      Promise.resolve(e3(() => t.apply(this, o), { fn: t, thisArg: this, args: o })).then(i).catch(r);
    });
  }
  return n;
}
const vi = (e3) => e3();
function Fr(e3 = vi) {
  const t = ref(true);
  function n() {
    t.value = false;
  }
  function o() {
    t.value = true;
  }
  const i = (...r) => {
    t.value && e3(...r);
  };
  return { isActive: readonly(t), pause: n, resume: o, eventFilter: i };
}
function yo(e3, t = false, n = "Timeout") {
  return new Promise((o, i) => {
    setTimeout(t ? () => i(n) : o, e3);
  });
}
function Yr(e3, t, n = {}) {
  const {
    eventFilter: o = vi,
    ...i
  } = n;
  return watch(
    e3,
    Lr(
      o,
      t
    ),
    i
  );
}
function st(e3, t, n = {}) {
  const {
    eventFilter: o,
    ...i
  } = n, { eventFilter: r, pause: l, resume: a, isActive: s } = Fr(o);
  return { stop: Yr(
    e3,
    t,
    {
      ...i,
      eventFilter: r
    }
  ), pause: l, resume: a, isActive: s };
}
function Gr(e3, t = {}) {
  if (!isRef(e3))
    return toRefs(e3);
  const n = Array.isArray(e3.value) ? Array.from({ length: e3.value.length }) : {};
  for (const o in e3.value)
    n[o] = customRef(() => ({
      get() {
        return e3.value[o];
      },
      set(i) {
        var r;
        if ((r = Ye(t.replaceRef)) != null ? r : true)
          if (Array.isArray(e3.value)) {
            const a = [...e3.value];
            a[o] = i, e3.value = a;
          } else {
            const a = { ...e3.value, [o]: i };
            Object.setPrototypeOf(a, Object.getPrototypeOf(e3.value)), e3.value = a;
          }
        else
          e3.value[o] = i;
      }
    }));
  return n;
}
function Hn(e3, t = false) {
  function n(d, { flush: f = "sync", deep: g = false, timeout: b, throwOnTimeout: x } = {}) {
    let S = null;
    const M = [new Promise((_) => {
      S = watch(
        e3,
        (N) => {
          d(N) !== t && (S?.(), _(N));
        },
        {
          flush: f,
          deep: g,
          immediate: true
        }
      );
    })];
    return b != null && M.push(
      yo(b, x).then(() => Ye(e3)).finally(() => S?.())
    ), Promise.race(M);
  }
  function o(d, f) {
    if (!isRef(d))
      return n((N) => N === d, f);
    const { flush: g = "sync", deep: b = false, timeout: x, throwOnTimeout: S } = f ?? {};
    let C = null;
    const _ = [new Promise((N) => {
      C = watch(
        [e3, d],
        ([O, k]) => {
          t !== (O === k) && (C?.(), N(O));
        },
        {
          flush: g,
          deep: b,
          immediate: true
        }
      );
    })];
    return x != null && _.push(
      yo(x, S).then(() => Ye(e3)).finally(() => (C?.(), Ye(e3)))
    ), Promise.race(_);
  }
  function i(d) {
    return n((f) => !!f, d);
  }
  function r(d) {
    return o(null, d);
  }
  function l(d) {
    return o(void 0, d);
  }
  function a(d) {
    return n(Number.isNaN, d);
  }
  function s(d, f) {
    return n((g) => {
      const b = Array.from(g);
      return b.includes(d) || b.includes(Ye(d));
    }, f);
  }
  function u(d) {
    return c(1, d);
  }
  function c(d = 1, f) {
    let g = -1;
    return n(() => (g += 1, g >= d), f);
  }
  return Array.isArray(Ye(e3)) ? {
    toMatch: n,
    toContains: s,
    changed: u,
    changedTimes: c,
    get not() {
      return Hn(e3, !t);
    }
  } : {
    toMatch: n,
    toBe: o,
    toBeTruthy: i,
    toBeNull: r,
    toBeNaN: a,
    toBeUndefined: l,
    changed: u,
    changedTimes: c,
    get not() {
      return Hn(e3, !t);
    }
  };
}
function Ln(e3) {
  return Hn(e3);
}
function Xr(e3) {
  var t;
  const n = Ye(e3);
  return (t = n?.$el) != null ? t : n;
}
const pi = zr ? window : void 0;
function mi(...e3) {
  let t, n, o, i;
  if (typeof e3[0] == "string" || Array.isArray(e3[0]) ? ([n, o, i] = e3, t = pi) : [t, n, o, i] = e3, !t)
    return Hr;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const r = [], l = () => {
    r.forEach((c) => c()), r.length = 0;
  }, a = (c, d, f, g) => (c.addEventListener(d, f, g), () => c.removeEventListener(d, f, g)), s = watch(
    () => [Xr(t), Ye(i)],
    ([c, d]) => {
      if (l(), !c)
        return;
      const f = Rr(d) ? { ...d } : d;
      r.push(
        ...n.flatMap((g) => o.map((b) => a(c, g, b, f)))
      );
    },
    { immediate: true, flush: "post" }
  ), u = () => {
    s(), l();
  };
  return Dt(u), u;
}
function Ur(e3) {
  return typeof e3 == "function" ? e3 : typeof e3 == "string" ? (t) => t.key === e3 : Array.isArray(e3) ? (t) => e3.includes(t.key) : () => true;
}
function _o(...e3) {
  let t, n, o = {};
  e3.length === 3 ? (t = e3[0], n = e3[1], o = e3[2]) : e3.length === 2 ? typeof e3[1] == "object" ? (t = true, n = e3[0], o = e3[1]) : (t = e3[0], n = e3[1]) : (t = true, n = e3[0]);
  const {
    target: i = pi,
    eventName: r = "keydown",
    passive: l = false,
    dedupe: a = false
  } = o, s = Ur(t);
  return mi(i, r, (c) => {
    c.repeat && Ye(a) || s(c) && n(c);
  }, l);
}
function Zr(e3) {
  return JSON.parse(JSON.stringify(e3));
}
function kn(e3, t, n, o = {}) {
  var i, r, l;
  const {
    clone: a = false,
    passive: s = false,
    eventName: u,
    deep: c = false,
    defaultValue: d,
    shouldEmit: f
  } = o, g = getCurrentInstance(), b = n || g?.emit || ((i = g?.$emit) == null ? void 0 : i.bind(g)) || ((l = (r = g?.proxy) == null ? void 0 : r.$emit) == null ? void 0 : l.bind(g?.proxy));
  let x = u;
  t || (t = "modelValue"), x = x || `update:${t.toString()}`;
  const S = (_) => a ? typeof a == "function" ? a(_) : Zr(_) : _, C = () => Br(e3[t]) ? S(e3[t]) : d, M = (_) => {
    f ? f(_) && b(x, _) : b(x, _);
  };
  if (s) {
    const _ = C(), N = ref(_);
    let O = false;
    return watch(
      () => e3[t],
      (k) => {
        O || (O = true, N.value = S(k), nextTick(() => O = false));
      }
    ), watch(
      N,
      (k) => {
        !O && (k !== e3[t] || c) && M(k);
      },
      { deep: c }
    ), N;
  } else
    return computed({
      get() {
        return C();
      },
      set(_) {
        M(_);
      }
    });
}
var Wr = { value: () => {
} };
function yn() {
  for (var e3 = 0, t = arguments.length, n = {}, o; e3 < t; ++e3) {
    if (!(o = arguments[e3] + "") || o in n || /[\s.]/.test(o))
      throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new tn(n);
}
function tn(e3) {
  this._ = e3;
}
function Kr(e3, t) {
  return e3.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n))
      throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
tn.prototype = yn.prototype = {
  constructor: tn,
  on: function(e3, t) {
    var n = this._, o = Kr(e3 + "", n), i, r = -1, l = o.length;
    if (arguments.length < 2) {
      for (; ++r < l; )
        if ((i = (e3 = o[r]).type) && (i = qr(n[i], e3.name)))
          return i;
      return;
    }
    if (t != null && typeof t != "function")
      throw new Error("invalid callback: " + t);
    for (; ++r < l; )
      if (i = (e3 = o[r]).type)
        n[i] = wo(n[i], e3.name, t);
      else if (t == null)
        for (i in n)
          n[i] = wo(n[i], e3.name, null);
    return this;
  },
  copy: function() {
    var e3 = {}, t = this._;
    for (var n in t)
      e3[n] = t[n].slice();
    return new tn(e3);
  },
  call: function(e3, t) {
    if ((i = arguments.length - 2) > 0)
      for (var n = new Array(i), o = 0, i, r; o < i; ++o)
        n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e3))
      throw new Error("unknown type: " + e3);
    for (r = this._[e3], o = 0, i = r.length; o < i; ++o)
      r[o].value.apply(t, n);
  },
  apply: function(e3, t, n) {
    if (!this._.hasOwnProperty(e3))
      throw new Error("unknown type: " + e3);
    for (var o = this._[e3], i = 0, r = o.length; i < r; ++i)
      o[i].value.apply(t, n);
  }
};
function qr(e3, t) {
  for (var n = 0, o = e3.length, i; n < o; ++n)
    if ((i = e3[n]).name === t)
      return i.value;
}
function wo(e3, t, n) {
  for (var o = 0, i = e3.length; o < i; ++o)
    if (e3[o].name === t) {
      e3[o] = Wr, e3 = e3.slice(0, o).concat(e3.slice(o + 1));
      break;
    }
  return n != null && e3.push({ name: t, value: n }), e3;
}
var Fn = "http://www.w3.org/1999/xhtml";
const bo = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Fn,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function _n(e3) {
  var t = e3 += "", n = t.indexOf(":");
  return n >= 0 && (t = e3.slice(0, n)) !== "xmlns" && (e3 = e3.slice(n + 1)), bo.hasOwnProperty(t) ? { space: bo[t], local: e3 } : e3;
}
function Jr(e3) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Fn && t.documentElement.namespaceURI === Fn ? t.createElement(e3) : t.createElementNS(n, e3);
  };
}
function jr(e3) {
  return function() {
    return this.ownerDocument.createElementNS(e3.space, e3.local);
  };
}
function yi(e3) {
  var t = _n(e3);
  return (t.local ? jr : Jr)(t);
}
function Qr() {
}
function io(e3) {
  return e3 == null ? Qr : function() {
    return this.querySelector(e3);
  };
}
function el(e3) {
  typeof e3 != "function" && (e3 = io(e3));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], l = r.length, a = o[i] = new Array(l), s, u, c = 0; c < l; ++c)
      (s = r[c]) && (u = e3.call(s, s.__data__, c, r)) && ("__data__" in s && (u.__data__ = s.__data__), a[c] = u);
  return new Ie(o, this._parents);
}
function tl(e3) {
  return e3 == null ? [] : Array.isArray(e3) ? e3 : Array.from(e3);
}
function nl() {
  return [];
}
function _i(e3) {
  return e3 == null ? nl : function() {
    return this.querySelectorAll(e3);
  };
}
function ol(e3) {
  return function() {
    return tl(e3.apply(this, arguments));
  };
}
function il(e3) {
  typeof e3 == "function" ? e3 = ol(e3) : e3 = _i(e3);
  for (var t = this._groups, n = t.length, o = [], i = [], r = 0; r < n; ++r)
    for (var l = t[r], a = l.length, s, u = 0; u < a; ++u)
      (s = l[u]) && (o.push(e3.call(s, s.__data__, u, l)), i.push(s));
  return new Ie(o, i);
}
function wi(e3) {
  return function() {
    return this.matches(e3);
  };
}
function bi(e3) {
  return function(t) {
    return t.matches(e3);
  };
}
var rl = Array.prototype.find;
function ll(e3) {
  return function() {
    return rl.call(this.children, e3);
  };
}
function al() {
  return this.firstElementChild;
}
function sl(e3) {
  return this.select(e3 == null ? al : ll(typeof e3 == "function" ? e3 : bi(e3)));
}
var ul = Array.prototype.filter;
function cl() {
  return Array.from(this.children);
}
function dl(e3) {
  return function() {
    return ul.call(this.children, e3);
  };
}
function fl(e3) {
  return this.selectAll(e3 == null ? cl : dl(typeof e3 == "function" ? e3 : bi(e3)));
}
function hl(e3) {
  typeof e3 != "function" && (e3 = wi(e3));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], l = r.length, a = o[i] = [], s, u = 0; u < l; ++u)
      (s = r[u]) && e3.call(s, s.__data__, u, r) && a.push(s);
  return new Ie(o, this._parents);
}
function xi(e3) {
  return new Array(e3.length);
}
function gl() {
  return new Ie(this._enter || this._groups.map(xi), this._parents);
}
function sn(e3, t) {
  this.ownerDocument = e3.ownerDocument, this.namespaceURI = e3.namespaceURI, this._next = null, this._parent = e3, this.__data__ = t;
}
sn.prototype = {
  constructor: sn,
  appendChild: function(e3) {
    return this._parent.insertBefore(e3, this._next);
  },
  insertBefore: function(e3, t) {
    return this._parent.insertBefore(e3, t);
  },
  querySelector: function(e3) {
    return this._parent.querySelector(e3);
  },
  querySelectorAll: function(e3) {
    return this._parent.querySelectorAll(e3);
  }
};
function vl(e3) {
  return function() {
    return e3;
  };
}
function pl(e3, t, n, o, i, r) {
  for (var l = 0, a, s = t.length, u = r.length; l < u; ++l)
    (a = t[l]) ? (a.__data__ = r[l], o[l] = a) : n[l] = new sn(e3, r[l]);
  for (; l < s; ++l)
    (a = t[l]) && (i[l] = a);
}
function ml(e3, t, n, o, i, r, l) {
  var a, s, u = /* @__PURE__ */ new Map(), c = t.length, d = r.length, f = new Array(c), g;
  for (a = 0; a < c; ++a)
    (s = t[a]) && (f[a] = g = l.call(s, s.__data__, a, t) + "", u.has(g) ? i[a] = s : u.set(g, s));
  for (a = 0; a < d; ++a)
    g = l.call(e3, r[a], a, r) + "", (s = u.get(g)) ? (o[a] = s, s.__data__ = r[a], u.delete(g)) : n[a] = new sn(e3, r[a]);
  for (a = 0; a < c; ++a)
    (s = t[a]) && u.get(f[a]) === s && (i[a] = s);
}
function yl(e3) {
  return e3.__data__;
}
function _l(e3, t) {
  if (!arguments.length)
    return Array.from(this, yl);
  var n = t ? ml : pl, o = this._parents, i = this._groups;
  typeof e3 != "function" && (e3 = vl(e3));
  for (var r = i.length, l = new Array(r), a = new Array(r), s = new Array(r), u = 0; u < r; ++u) {
    var c = o[u], d = i[u], f = d.length, g = wl(e3.call(c, c && c.__data__, u, o)), b = g.length, x = a[u] = new Array(b), S = l[u] = new Array(b), C = s[u] = new Array(f);
    n(c, d, x, S, C, g, t);
    for (var M = 0, _ = 0, N, O; M < b; ++M)
      if (N = x[M]) {
        for (M >= _ && (_ = M + 1); !(O = S[_]) && ++_ < b; )
          ;
        N._next = O || null;
      }
  }
  return l = new Ie(l, o), l._enter = a, l._exit = s, l;
}
function wl(e3) {
  return typeof e3 == "object" && "length" in e3 ? e3 : Array.from(e3);
}
function bl() {
  return new Ie(this._exit || this._groups.map(xi), this._parents);
}
function xl(e3, t, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof e3 == "function" ? (o = e3(o), o && (o = o.selection())) : o = o.append(e3 + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function El(e3) {
  for (var t = e3.selection ? e3.selection() : e3, n = this._groups, o = t._groups, i = n.length, r = o.length, l = Math.min(i, r), a = new Array(i), s = 0; s < l; ++s)
    for (var u = n[s], c = o[s], d = u.length, f = a[s] = new Array(d), g, b = 0; b < d; ++b)
      (g = u[b] || c[b]) && (f[b] = g);
  for (; s < i; ++s)
    a[s] = n[s];
  return new Ie(a, this._parents);
}
function Sl() {
  for (var e3 = this._groups, t = -1, n = e3.length; ++t < n; )
    for (var o = e3[t], i = o.length - 1, r = o[i], l; --i >= 0; )
      (l = o[i]) && (r && l.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(l, r), r = l);
  return this;
}
function Nl(e3) {
  e3 || (e3 = Cl);
  function t(d, f) {
    return d && f ? e3(d.__data__, f.__data__) : !d - !f;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var l = n[r], a = l.length, s = i[r] = new Array(a), u, c = 0; c < a; ++c)
      (u = l[c]) && (s[c] = u);
    s.sort(t);
  }
  return new Ie(i, this._parents).order();
}
function Cl(e3, t) {
  return e3 < t ? -1 : e3 > t ? 1 : e3 >= t ? 0 : NaN;
}
function Ml() {
  var e3 = arguments[0];
  return arguments[0] = this, e3.apply(null, arguments), this;
}
function Il() {
  return Array.from(this);
}
function kl() {
  for (var e3 = this._groups, t = 0, n = e3.length; t < n; ++t)
    for (var o = e3[t], i = 0, r = o.length; i < r; ++i) {
      var l = o[i];
      if (l)
        return l;
    }
  return null;
}
function Pl() {
  let e3 = 0;
  for (const t of this)
    ++e3;
  return e3;
}
function $l() {
  return !this.node();
}
function Tl(e3) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var i = t[n], r = 0, l = i.length, a; r < l; ++r)
      (a = i[r]) && e3.call(a, a.__data__, r, i);
  return this;
}
function Dl(e3) {
  return function() {
    this.removeAttribute(e3);
  };
}
function Al(e3) {
  return function() {
    this.removeAttributeNS(e3.space, e3.local);
  };
}
function Ol(e3, t) {
  return function() {
    this.setAttribute(e3, t);
  };
}
function zl(e3, t) {
  return function() {
    this.setAttributeNS(e3.space, e3.local, t);
  };
}
function Bl(e3, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e3) : this.setAttribute(e3, n);
  };
}
function Vl(e3, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e3.space, e3.local) : this.setAttributeNS(e3.space, e3.local, n);
  };
}
function Rl(e3, t) {
  var n = _n(e3);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Al : Dl : typeof t == "function" ? n.local ? Vl : Bl : n.local ? zl : Ol)(n, t));
}
function Ei(e3) {
  return e3.ownerDocument && e3.ownerDocument.defaultView || e3.document && e3 || e3.defaultView;
}
function Hl(e3) {
  return function() {
    this.style.removeProperty(e3);
  };
}
function Ll(e3, t, n) {
  return function() {
    this.style.setProperty(e3, t, n);
  };
}
function Fl(e3, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e3) : this.style.setProperty(e3, o, n);
  };
}
function Yl(e3, t, n) {
  return arguments.length > 1 ? this.each((t == null ? Hl : typeof t == "function" ? Fl : Ll)(e3, t, n ?? "")) : mt(this.node(), e3);
}
function mt(e3, t) {
  return e3.style.getPropertyValue(t) || Ei(e3).getComputedStyle(e3, null).getPropertyValue(t);
}
function Gl(e3) {
  return function() {
    delete this[e3];
  };
}
function Xl(e3, t) {
  return function() {
    this[e3] = t;
  };
}
function Ul(e3, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e3] : this[e3] = n;
  };
}
function Zl(e3, t) {
  return arguments.length > 1 ? this.each((t == null ? Gl : typeof t == "function" ? Ul : Xl)(e3, t)) : this.node()[e3];
}
function Si(e3) {
  return e3.trim().split(/^|\s+/);
}
function ro(e3) {
  return e3.classList || new Ni(e3);
}
function Ni(e3) {
  this._node = e3, this._names = Si(e3.getAttribute("class") || "");
}
Ni.prototype = {
  add: function(e3) {
    var t = this._names.indexOf(e3);
    t < 0 && (this._names.push(e3), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e3) {
    var t = this._names.indexOf(e3);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e3) {
    return this._names.indexOf(e3) >= 0;
  }
};
function Ci(e3, t) {
  for (var n = ro(e3), o = -1, i = t.length; ++o < i; )
    n.add(t[o]);
}
function Mi(e3, t) {
  for (var n = ro(e3), o = -1, i = t.length; ++o < i; )
    n.remove(t[o]);
}
function Wl(e3) {
  return function() {
    Ci(this, e3);
  };
}
function Kl(e3) {
  return function() {
    Mi(this, e3);
  };
}
function ql(e3, t) {
  return function() {
    (t.apply(this, arguments) ? Ci : Mi)(this, e3);
  };
}
function Jl(e3, t) {
  var n = Si(e3 + "");
  if (arguments.length < 2) {
    for (var o = ro(this.node()), i = -1, r = n.length; ++i < r; )
      if (!o.contains(n[i]))
        return false;
    return true;
  }
  return this.each((typeof t == "function" ? ql : t ? Wl : Kl)(n, t));
}
function jl() {
  this.textContent = "";
}
function Ql(e3) {
  return function() {
    this.textContent = e3;
  };
}
function ea(e3) {
  return function() {
    var t = e3.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function ta(e3) {
  return arguments.length ? this.each(e3 == null ? jl : (typeof e3 == "function" ? ea : Ql)(e3)) : this.node().textContent;
}
function na() {
  this.innerHTML = "";
}
function oa(e3) {
  return function() {
    this.innerHTML = e3;
  };
}
function ia(e3) {
  return function() {
    var t = e3.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function ra(e3) {
  return arguments.length ? this.each(e3 == null ? na : (typeof e3 == "function" ? ia : oa)(e3)) : this.node().innerHTML;
}
function la() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function aa() {
  return this.each(la);
}
function sa() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function ua() {
  return this.each(sa);
}
function ca(e3) {
  var t = typeof e3 == "function" ? e3 : yi(e3);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function da() {
  return null;
}
function fa(e3, t) {
  var n = typeof e3 == "function" ? e3 : yi(e3), o = t == null ? da : typeof t == "function" ? t : io(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function ha() {
  var e3 = this.parentNode;
  e3 && e3.removeChild(this);
}
function ga() {
  return this.each(ha);
}
function va() {
  var e3 = this.cloneNode(false), t = this.parentNode;
  return t ? t.insertBefore(e3, this.nextSibling) : e3;
}
function pa() {
  var e3 = this.cloneNode(true), t = this.parentNode;
  return t ? t.insertBefore(e3, this.nextSibling) : e3;
}
function ma(e3) {
  return this.select(e3 ? pa : va);
}
function ya(e3) {
  return arguments.length ? this.property("__data__", e3) : this.node().__data__;
}
function _a(e3) {
  return function(t) {
    e3.call(this, t, this.__data__);
  };
}
function wa(e3) {
  return e3.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function ba(e3) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, i = t.length, r; n < i; ++n)
        r = t[n], (!e3.type || r.type === e3.type) && r.name === e3.name ? this.removeEventListener(r.type, r.listener, r.options) : t[++o] = r;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function xa(e3, t, n) {
  return function() {
    var o = this.__on, i, r = _a(t);
    if (o) {
      for (var l = 0, a = o.length; l < a; ++l)
        if ((i = o[l]).type === e3.type && i.name === e3.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = r, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e3.type, r, n), i = { type: e3.type, name: e3.name, value: t, listener: r, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function Ea(e3, t, n) {
  var o = wa(e3 + ""), i, r = o.length, l;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var s = 0, u = a.length, c; s < u; ++s)
        for (i = 0, c = a[s]; i < r; ++i)
          if ((l = o[i]).type === c.type && l.name === c.name)
            return c.value;
    }
    return;
  }
  for (a = t ? xa : ba, i = 0; i < r; ++i)
    this.each(a(o[i], t, n));
  return this;
}
function Ii(e3, t, n) {
  var o = Ei(e3), i = o.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, false, false)), e3.dispatchEvent(i);
}
function Sa(e3, t) {
  return function() {
    return Ii(this, e3, t);
  };
}
function Na(e3, t) {
  return function() {
    return Ii(this, e3, t.apply(this, arguments));
  };
}
function Ca(e3, t) {
  return this.each((typeof t == "function" ? Na : Sa)(e3, t));
}
function* Ma() {
  for (var e3 = this._groups, t = 0, n = e3.length; t < n; ++t)
    for (var o = e3[t], i = 0, r = o.length, l; i < r; ++i)
      (l = o[i]) && (yield l);
}
var ki = [null];
function Ie(e3, t) {
  this._groups = e3, this._parents = t;
}
function Lt() {
  return new Ie([[document.documentElement]], ki);
}
function Ia() {
  return this;
}
Ie.prototype = Lt.prototype = {
  constructor: Ie,
  select: el,
  selectAll: il,
  selectChild: sl,
  selectChildren: fl,
  filter: hl,
  data: _l,
  enter: gl,
  exit: bl,
  join: xl,
  merge: El,
  selection: Ia,
  order: Sl,
  sort: Nl,
  call: Ml,
  nodes: Il,
  node: kl,
  size: Pl,
  empty: $l,
  each: Tl,
  attr: Rl,
  style: Yl,
  property: Zl,
  classed: Jl,
  text: ta,
  html: ra,
  raise: aa,
  lower: ua,
  append: ca,
  insert: fa,
  remove: ga,
  clone: ma,
  datum: ya,
  on: Ea,
  dispatch: Ca,
  [Symbol.iterator]: Ma
};
function ke(e3) {
  return typeof e3 == "string" ? new Ie([[document.querySelector(e3)]], [document.documentElement]) : new Ie([[e3]], ki);
}
function ka(e3) {
  let t;
  for (; t = e3.sourceEvent; )
    e3 = t;
  return e3;
}
function Oe(e3, t) {
  if (e3 = ka(e3), t === void 0 && (t = e3.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e3.clientX, o.y = e3.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var i = t.getBoundingClientRect();
      return [e3.clientX - i.left - t.clientLeft, e3.clientY - i.top - t.clientTop];
    }
  }
  return [e3.pageX, e3.pageY];
}
const Pa = { passive: false }, At = { capture: true, passive: false };
function Pn(e3) {
  e3.stopImmediatePropagation();
}
function ct(e3) {
  e3.preventDefault(), e3.stopImmediatePropagation();
}
function Pi(e3) {
  var t = e3.document.documentElement, n = ke(e3).on("dragstart.drag", ct, At);
  "onselectstart" in t ? n.on("selectstart.drag", ct, At) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function $i(e3, t) {
  var n = e3.document.documentElement, o = ke(e3).on("dragstart.drag", null);
  t && (o.on("click.drag", ct, At), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Gt = (e3) => () => e3;
function Yn(e3, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: i,
  active: r,
  x: l,
  y: a,
  dx: s,
  dy: u,
  dispatch: c
}) {
  Object.defineProperties(this, {
    type: { value: e3, enumerable: true, configurable: true },
    sourceEvent: { value: t, enumerable: true, configurable: true },
    subject: { value: n, enumerable: true, configurable: true },
    target: { value: o, enumerable: true, configurable: true },
    identifier: { value: i, enumerable: true, configurable: true },
    active: { value: r, enumerable: true, configurable: true },
    x: { value: l, enumerable: true, configurable: true },
    y: { value: a, enumerable: true, configurable: true },
    dx: { value: s, enumerable: true, configurable: true },
    dy: { value: u, enumerable: true, configurable: true },
    _: { value: c }
  });
}
Yn.prototype.on = function() {
  var e3 = this._.on.apply(this._, arguments);
  return e3 === this._ ? this : e3;
};
function $a(e3) {
  return !e3.ctrlKey && !e3.button;
}
function Ta() {
  return this.parentNode;
}
function Da(e3, t) {
  return t ?? { x: e3.x, y: e3.y };
}
function Aa() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Oa() {
  var e3 = $a, t = Ta, n = Da, o = Aa, i = {}, r = yn("start", "drag", "end"), l = 0, a, s, u, c, d = 0;
  function f(N) {
    N.on("mousedown.drag", g).filter(o).on("touchstart.drag", S).on("touchmove.drag", C, Pa).on("touchend.drag touchcancel.drag", M).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function g(N, O) {
    if (!(c || !e3.call(this, N, O))) {
      var k = _(this, t.call(this, N, O), N, O, "mouse");
      k && (ke(N.view).on("mousemove.drag", b, At).on("mouseup.drag", x, At), Pi(N.view), Pn(N), u = false, a = N.clientX, s = N.clientY, k("start", N));
    }
  }
  function b(N) {
    if (ct(N), !u) {
      var O = N.clientX - a, k = N.clientY - s;
      u = O * O + k * k > d;
    }
    i.mouse("drag", N);
  }
  function x(N) {
    ke(N.view).on("mousemove.drag mouseup.drag", null), $i(N.view, u), ct(N), i.mouse("end", N);
  }
  function S(N, O) {
    if (e3.call(this, N, O)) {
      var k = N.changedTouches, $ = t.call(this, N, O), T = k.length, W, L;
      for (W = 0; W < T; ++W)
        (L = _(this, $, N, O, k[W].identifier, k[W])) && (Pn(N), L("start", N, k[W]));
    }
  }
  function C(N) {
    var O = N.changedTouches, k = O.length, $, T;
    for ($ = 0; $ < k; ++$)
      (T = i[O[$].identifier]) && (ct(N), T("drag", N, O[$]));
  }
  function M(N) {
    var O = N.changedTouches, k = O.length, $, T;
    for (c && clearTimeout(c), c = setTimeout(function() {
      c = null;
    }, 500), $ = 0; $ < k; ++$)
      (T = i[O[$].identifier]) && (Pn(N), T("end", N, O[$]));
  }
  function _(N, O, k, $, T, W) {
    var L = r.copy(), z = Oe(W || k, O), w, J, y;
    if ((y = n.call(N, new Yn("beforestart", {
      sourceEvent: k,
      target: f,
      identifier: T,
      active: l,
      x: z[0],
      y: z[1],
      dx: 0,
      dy: 0,
      dispatch: L
    }), $)) != null)
      return w = y.x - z[0] || 0, J = y.y - z[1] || 0, function P(E, D, A) {
        var B = z, V;
        switch (E) {
          case "start":
            i[T] = P, V = l++;
            break;
          case "end":
            delete i[T], --l;
          case "drag":
            z = Oe(A || D, O), V = l;
            break;
        }
        L.call(
          E,
          N,
          new Yn(E, {
            sourceEvent: D,
            subject: y,
            target: f,
            identifier: T,
            active: V,
            x: z[0] + w,
            y: z[1] + J,
            dx: z[0] - B[0],
            dy: z[1] - B[1],
            dispatch: L
          }),
          $
        );
      };
  }
  return f.filter = function(N) {
    return arguments.length ? (e3 = typeof N == "function" ? N : Gt(!!N), f) : e3;
  }, f.container = function(N) {
    return arguments.length ? (t = typeof N == "function" ? N : Gt(N), f) : t;
  }, f.subject = function(N) {
    return arguments.length ? (n = typeof N == "function" ? N : Gt(N), f) : n;
  }, f.touchable = function(N) {
    return arguments.length ? (o = typeof N == "function" ? N : Gt(!!N), f) : o;
  }, f.on = function() {
    var N = r.on.apply(r, arguments);
    return N === r ? f : N;
  }, f.clickDistance = function(N) {
    return arguments.length ? (d = (N = +N) * N, f) : Math.sqrt(d);
  }, f;
}
function lo(e3, t, n) {
  e3.prototype = t.prototype = n, n.constructor = e3;
}
function Ti(e3, t) {
  var n = Object.create(e3.prototype);
  for (var o in t)
    n[o] = t[o];
  return n;
}
function Ft() {
}
var Ot = 0.7, un = 1 / Ot, dt = "\\s*([+-]?\\d+)\\s*", zt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ve = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", za = /^#([0-9a-f]{3,8})$/, Ba = new RegExp(`^rgb\\(${dt},${dt},${dt}\\)$`), Va = new RegExp(`^rgb\\(${Ve},${Ve},${Ve}\\)$`), Ra = new RegExp(`^rgba\\(${dt},${dt},${dt},${zt}\\)$`), Ha = new RegExp(`^rgba\\(${Ve},${Ve},${Ve},${zt}\\)$`), La = new RegExp(`^hsl\\(${zt},${Ve},${Ve}\\)$`), Fa = new RegExp(`^hsla\\(${zt},${Ve},${Ve},${zt}\\)$`), xo = {
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
lo(Ft, rt, {
  copy(e3) {
    return Object.assign(new this.constructor(), this, e3);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Eo,
  // Deprecated! Use color.formatHex.
  formatHex: Eo,
  formatHex8: Ya,
  formatHsl: Ga,
  formatRgb: So,
  toString: So
});
function Eo() {
  return this.rgb().formatHex();
}
function Ya() {
  return this.rgb().formatHex8();
}
function Ga() {
  return Di(this).formatHsl();
}
function So() {
  return this.rgb().formatRgb();
}
function rt(e3) {
  var t, n;
  return e3 = (e3 + "").trim().toLowerCase(), (t = za.exec(e3)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? No(t) : n === 3 ? new Ce(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Xt(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Xt(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Ba.exec(e3)) ? new Ce(t[1], t[2], t[3], 1) : (t = Va.exec(e3)) ? new Ce(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Ra.exec(e3)) ? Xt(t[1], t[2], t[3], t[4]) : (t = Ha.exec(e3)) ? Xt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = La.exec(e3)) ? Io(t[1], t[2] / 100, t[3] / 100, 1) : (t = Fa.exec(e3)) ? Io(t[1], t[2] / 100, t[3] / 100, t[4]) : xo.hasOwnProperty(e3) ? No(xo[e3]) : e3 === "transparent" ? new Ce(NaN, NaN, NaN, 0) : null;
}
function No(e3) {
  return new Ce(e3 >> 16 & 255, e3 >> 8 & 255, e3 & 255, 1);
}
function Xt(e3, t, n, o) {
  return o <= 0 && (e3 = t = n = NaN), new Ce(e3, t, n, o);
}
function Xa(e3) {
  return e3 instanceof Ft || (e3 = rt(e3)), e3 ? (e3 = e3.rgb(), new Ce(e3.r, e3.g, e3.b, e3.opacity)) : new Ce();
}
function Gn(e3, t, n, o) {
  return arguments.length === 1 ? Xa(e3) : new Ce(e3, t, n, o ?? 1);
}
function Ce(e3, t, n, o) {
  this.r = +e3, this.g = +t, this.b = +n, this.opacity = +o;
}
lo(Ce, Gn, Ti(Ft, {
  brighter(e3) {
    return e3 = e3 == null ? un : Math.pow(un, e3), new Ce(this.r * e3, this.g * e3, this.b * e3, this.opacity);
  },
  darker(e3) {
    return e3 = e3 == null ? Ot : Math.pow(Ot, e3), new Ce(this.r * e3, this.g * e3, this.b * e3, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ce(ot(this.r), ot(this.g), ot(this.b), cn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Co,
  // Deprecated! Use color.formatHex.
  formatHex: Co,
  formatHex8: Ua,
  formatRgb: Mo,
  toString: Mo
}));
function Co() {
  return `#${nt(this.r)}${nt(this.g)}${nt(this.b)}`;
}
function Ua() {
  return `#${nt(this.r)}${nt(this.g)}${nt(this.b)}${nt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Mo() {
  const e3 = cn(this.opacity);
  return `${e3 === 1 ? "rgb(" : "rgba("}${ot(this.r)}, ${ot(this.g)}, ${ot(this.b)}${e3 === 1 ? ")" : `, ${e3})`}`;
}
function cn(e3) {
  return isNaN(e3) ? 1 : Math.max(0, Math.min(1, e3));
}
function ot(e3) {
  return Math.max(0, Math.min(255, Math.round(e3) || 0));
}
function nt(e3) {
  return e3 = ot(e3), (e3 < 16 ? "0" : "") + e3.toString(16);
}
function Io(e3, t, n, o) {
  return o <= 0 ? e3 = t = n = NaN : n <= 0 || n >= 1 ? e3 = t = NaN : t <= 0 && (e3 = NaN), new Pe(e3, t, n, o);
}
function Di(e3) {
  if (e3 instanceof Pe)
    return new Pe(e3.h, e3.s, e3.l, e3.opacity);
  if (e3 instanceof Ft || (e3 = rt(e3)), !e3)
    return new Pe();
  if (e3 instanceof Pe)
    return e3;
  e3 = e3.rgb();
  var t = e3.r / 255, n = e3.g / 255, o = e3.b / 255, i = Math.min(t, n, o), r = Math.max(t, n, o), l = NaN, a = r - i, s = (r + i) / 2;
  return a ? (t === r ? l = (n - o) / a + (n < o) * 6 : n === r ? l = (o - t) / a + 2 : l = (t - n) / a + 4, a /= s < 0.5 ? r + i : 2 - r - i, l *= 60) : a = s > 0 && s < 1 ? 0 : l, new Pe(l, a, s, e3.opacity);
}
function Za(e3, t, n, o) {
  return arguments.length === 1 ? Di(e3) : new Pe(e3, t, n, o ?? 1);
}
function Pe(e3, t, n, o) {
  this.h = +e3, this.s = +t, this.l = +n, this.opacity = +o;
}
lo(Pe, Za, Ti(Ft, {
  brighter(e3) {
    return e3 = e3 == null ? un : Math.pow(un, e3), new Pe(this.h, this.s, this.l * e3, this.opacity);
  },
  darker(e3) {
    return e3 = e3 == null ? Ot : Math.pow(Ot, e3), new Pe(this.h, this.s, this.l * e3, this.opacity);
  },
  rgb() {
    var e3 = this.h % 360 + (this.h < 0) * 360, t = isNaN(e3) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - o;
    return new Ce(
      $n(e3 >= 240 ? e3 - 240 : e3 + 120, i, o),
      $n(e3, i, o),
      $n(e3 < 120 ? e3 + 240 : e3 - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new Pe(ko(this.h), Ut(this.s), Ut(this.l), cn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e3 = cn(this.opacity);
    return `${e3 === 1 ? "hsl(" : "hsla("}${ko(this.h)}, ${Ut(this.s) * 100}%, ${Ut(this.l) * 100}%${e3 === 1 ? ")" : `, ${e3})`}`;
  }
}));
function ko(e3) {
  return e3 = (e3 || 0) % 360, e3 < 0 ? e3 + 360 : e3;
}
function Ut(e3) {
  return Math.max(0, Math.min(1, e3 || 0));
}
function $n(e3, t, n) {
  return (e3 < 60 ? t + (n - t) * e3 / 60 : e3 < 180 ? n : e3 < 240 ? t + (n - t) * (240 - e3) / 60 : t) * 255;
}
const ao = (e3) => () => e3;
function Wa(e3, t) {
  return function(n) {
    return e3 + n * t;
  };
}
function Ka(e3, t, n) {
  return e3 = Math.pow(e3, n), t = Math.pow(t, n) - e3, n = 1 / n, function(o) {
    return Math.pow(e3 + o * t, n);
  };
}
function qa(e3) {
  return (e3 = +e3) == 1 ? Ai : function(t, n) {
    return n - t ? Ka(t, n, e3) : ao(isNaN(t) ? n : t);
  };
}
function Ai(e3, t) {
  var n = t - e3;
  return n ? Wa(e3, n) : ao(isNaN(e3) ? t : e3);
}
const dn = (function e(t) {
  var n = qa(t);
  function o(i, r) {
    var l = n((i = Gn(i)).r, (r = Gn(r)).r), a = n(i.g, r.g), s = n(i.b, r.b), u = Ai(i.opacity, r.opacity);
    return function(c) {
      return i.r = l(c), i.g = a(c), i.b = s(c), i.opacity = u(c), i + "";
    };
  }
  return o.gamma = e, o;
})(1);
function Ja(e3, t) {
  t || (t = []);
  var n = e3 ? Math.min(t.length, e3.length) : 0, o = t.slice(), i;
  return function(r) {
    for (i = 0; i < n; ++i)
      o[i] = e3[i] * (1 - r) + t[i] * r;
    return o;
  };
}
function ja(e3) {
  return ArrayBuffer.isView(e3) && !(e3 instanceof DataView);
}
function Qa(e3, t) {
  var n = t ? t.length : 0, o = e3 ? Math.min(n, e3.length) : 0, i = new Array(o), r = new Array(n), l;
  for (l = 0; l < o; ++l)
    i[l] = Pt(e3[l], t[l]);
  for (; l < n; ++l)
    r[l] = t[l];
  return function(a) {
    for (l = 0; l < o; ++l)
      r[l] = i[l](a);
    return r;
  };
}
function es(e3, t) {
  var n = /* @__PURE__ */ new Date();
  return e3 = +e3, t = +t, function(o) {
    return n.setTime(e3 * (1 - o) + t * o), n;
  };
}
function ze(e3, t) {
  return e3 = +e3, t = +t, function(n) {
    return e3 * (1 - n) + t * n;
  };
}
function ts(e3, t) {
  var n = {}, o = {}, i;
  (e3 === null || typeof e3 != "object") && (e3 = {}), (t === null || typeof t != "object") && (t = {});
  for (i in t)
    i in e3 ? n[i] = Pt(e3[i], t[i]) : o[i] = t[i];
  return function(r) {
    for (i in n)
      o[i] = n[i](r);
    return o;
  };
}
var Xn = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Tn = new RegExp(Xn.source, "g");
function ns(e3) {
  return function() {
    return e3;
  };
}
function os(e3) {
  return function(t) {
    return e3(t) + "";
  };
}
function Oi(e3, t) {
  var n = Xn.lastIndex = Tn.lastIndex = 0, o, i, r, l = -1, a = [], s = [];
  for (e3 = e3 + "", t = t + ""; (o = Xn.exec(e3)) && (i = Tn.exec(t)); )
    (r = i.index) > n && (r = t.slice(n, r), a[l] ? a[l] += r : a[++l] = r), (o = o[0]) === (i = i[0]) ? a[l] ? a[l] += i : a[++l] = i : (a[++l] = null, s.push({ i: l, x: ze(o, i) })), n = Tn.lastIndex;
  return n < t.length && (r = t.slice(n), a[l] ? a[l] += r : a[++l] = r), a.length < 2 ? s[0] ? os(s[0].x) : ns(t) : (t = s.length, function(u) {
    for (var c = 0, d; c < t; ++c)
      a[(d = s[c]).i] = d.x(u);
    return a.join("");
  });
}
function Pt(e3, t) {
  var n = typeof t, o;
  return t == null || n === "boolean" ? ao(t) : (n === "number" ? ze : n === "string" ? (o = rt(t)) ? (t = o, dn) : Oi : t instanceof rt ? dn : t instanceof Date ? es : ja(t) ? Ja : Array.isArray(t) ? Qa : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? ts : ze)(e3, t);
}
var Po = 180 / Math.PI, Un = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function zi(e3, t, n, o, i, r) {
  var l, a, s;
  return (l = Math.sqrt(e3 * e3 + t * t)) && (e3 /= l, t /= l), (s = e3 * n + t * o) && (n -= e3 * s, o -= t * s), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, s /= a), e3 * o < t * n && (e3 = -e3, t = -t, s = -s, l = -l), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(t, e3) * Po,
    skewX: Math.atan(s) * Po,
    scaleX: l,
    scaleY: a
  };
}
var Zt;
function is(e3) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e3 + "");
  return t.isIdentity ? Un : zi(t.a, t.b, t.c, t.d, t.e, t.f);
}
function rs(e3) {
  return e3 == null || (Zt || (Zt = document.createElementNS("http://www.w3.org/2000/svg", "g")), Zt.setAttribute("transform", e3), !(e3 = Zt.transform.baseVal.consolidate())) ? Un : (e3 = e3.matrix, zi(e3.a, e3.b, e3.c, e3.d, e3.e, e3.f));
}
function Bi(e3, t, n, o) {
  function i(u) {
    return u.length ? u.pop() + " " : "";
  }
  function r(u, c, d, f, g, b) {
    if (u !== d || c !== f) {
      var x = g.push("translate(", null, t, null, n);
      b.push({ i: x - 4, x: ze(u, d) }, { i: x - 2, x: ze(c, f) });
    } else (d || f) && g.push("translate(" + d + t + f + n);
  }
  function l(u, c, d, f) {
    u !== c ? (u - c > 180 ? c += 360 : c - u > 180 && (u += 360), f.push({ i: d.push(i(d) + "rotate(", null, o) - 2, x: ze(u, c) })) : c && d.push(i(d) + "rotate(" + c + o);
  }
  function a(u, c, d, f) {
    u !== c ? f.push({ i: d.push(i(d) + "skewX(", null, o) - 2, x: ze(u, c) }) : c && d.push(i(d) + "skewX(" + c + o);
  }
  function s(u, c, d, f, g, b) {
    if (u !== d || c !== f) {
      var x = g.push(i(g) + "scale(", null, ",", null, ")");
      b.push({ i: x - 4, x: ze(u, d) }, { i: x - 2, x: ze(c, f) });
    } else (d !== 1 || f !== 1) && g.push(i(g) + "scale(" + d + "," + f + ")");
  }
  return function(u, c) {
    var d = [], f = [];
    return u = e3(u), c = e3(c), r(u.translateX, u.translateY, c.translateX, c.translateY, d, f), l(u.rotate, c.rotate, d, f), a(u.skewX, c.skewX, d, f), s(u.scaleX, u.scaleY, c.scaleX, c.scaleY, d, f), u = c = null, function(g) {
      for (var b = -1, x = f.length, S; ++b < x; )
        d[(S = f[b]).i] = S.x(g);
      return d.join("");
    };
  };
}
var ls = Bi(is, "px, ", "px)", "deg)"), as = Bi(rs, ", ", ")", ")"), ss = 1e-12;
function $o(e3) {
  return ((e3 = Math.exp(e3)) + 1 / e3) / 2;
}
function us(e3) {
  return ((e3 = Math.exp(e3)) - 1 / e3) / 2;
}
function cs(e3) {
  return ((e3 = Math.exp(2 * e3)) - 1) / (e3 + 1);
}
const nn = (function e2(t, n, o) {
  function i(r, l) {
    var a = r[0], s = r[1], u = r[2], c = l[0], d = l[1], f = l[2], g = c - a, b = d - s, x = g * g + b * b, S, C;
    if (x < ss)
      C = Math.log(f / u) / t, S = function($) {
        return [
          a + $ * g,
          s + $ * b,
          u * Math.exp(t * $ * C)
        ];
      };
    else {
      var M = Math.sqrt(x), _ = (f * f - u * u + o * x) / (2 * u * n * M), N = (f * f - u * u - o * x) / (2 * f * n * M), O = Math.log(Math.sqrt(_ * _ + 1) - _), k = Math.log(Math.sqrt(N * N + 1) - N);
      C = (k - O) / t, S = function($) {
        var T = $ * C, W = $o(O), L = u / (n * M) * (W * cs(t * T + O) - us(O));
        return [
          a + L * g,
          s + L * b,
          u * W / $o(t * T + O)
        ];
      };
    }
    return S.duration = C * 1e3 * t / Math.SQRT2, S;
  }
  return i.rho = function(r) {
    var l = Math.max(1e-3, +r), a = l * l, s = a * a;
    return e2(l, a, s);
  }, i;
})(Math.SQRT2, 2, 4);
var yt = 0, Mt = 0, Nt = 0, Vi = 1e3, fn, It, hn = 0, lt = 0, wn = 0, Bt = typeof performance == "object" && performance.now ? performance : Date, Ri = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e3) {
  setTimeout(e3, 17);
};
function so() {
  return lt || (Ri(ds), lt = Bt.now() + wn);
}
function ds() {
  lt = 0;
}
function gn() {
  this._call = this._time = this._next = null;
}
gn.prototype = Hi.prototype = {
  constructor: gn,
  restart: function(e3, t, n) {
    if (typeof e3 != "function")
      throw new TypeError("callback is not a function");
    n = (n == null ? so() : +n) + (t == null ? 0 : +t), !this._next && It !== this && (It ? It._next = this : fn = this, It = this), this._call = e3, this._time = n, Zn();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Zn());
  }
};
function Hi(e3, t, n) {
  var o = new gn();
  return o.restart(e3, t, n), o;
}
function fs() {
  so(), ++yt;
  for (var e3 = fn, t; e3; )
    (t = lt - e3._time) >= 0 && e3._call.call(void 0, t), e3 = e3._next;
  --yt;
}
function To() {
  lt = (hn = Bt.now()) + wn, yt = Mt = 0;
  try {
    fs();
  } finally {
    yt = 0, gs(), lt = 0;
  }
}
function hs() {
  var e3 = Bt.now(), t = e3 - hn;
  t > Vi && (wn -= t, hn = e3);
}
function gs() {
  for (var e3, t = fn, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e3 = t, t = t._next) : (n = t._next, t._next = null, t = e3 ? e3._next = n : fn = n);
  It = e3, Zn(o);
}
function Zn(e3) {
  if (!yt) {
    Mt && (Mt = clearTimeout(Mt));
    var t = e3 - lt;
    t > 24 ? (e3 < 1 / 0 && (Mt = setTimeout(To, e3 - Bt.now() - wn)), Nt && (Nt = clearInterval(Nt))) : (Nt || (hn = Bt.now(), Nt = setInterval(hs, Vi)), yt = 1, Ri(To));
  }
}
function Do(e3, t, n) {
  var o = new gn();
  return t = t == null ? 0 : +t, o.restart((i) => {
    o.stop(), e3(i + t);
  }, t, n), o;
}
var vs = yn("start", "end", "cancel", "interrupt"), ps = [], Li = 0, Ao = 1, Wn = 2, on = 3, Oo = 4, Kn = 5, rn = 6;
function bn(e3, t, n, o, i, r) {
  var l = e3.__transition;
  if (!l)
    e3.__transition = {};
  else if (n in l)
    return;
  ms(e3, n, {
    name: t,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: vs,
    tween: ps,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: Li
  });
}
function uo(e3, t) {
  var n = De(e3, t);
  if (n.state > Li)
    throw new Error("too late; already scheduled");
  return n;
}
function Le(e3, t) {
  var n = De(e3, t);
  if (n.state > on)
    throw new Error("too late; already running");
  return n;
}
function De(e3, t) {
  var n = e3.__transition;
  if (!n || !(n = n[t]))
    throw new Error("transition not found");
  return n;
}
function ms(e3, t, n) {
  var o = e3.__transition, i;
  o[t] = n, n.timer = Hi(r, 0, n.time);
  function r(u) {
    n.state = Ao, n.timer.restart(l, n.delay, n.time), n.delay <= u && l(u - n.delay);
  }
  function l(u) {
    var c, d, f, g;
    if (n.state !== Ao)
      return s();
    for (c in o)
      if (g = o[c], g.name === n.name) {
        if (g.state === on)
          return Do(l);
        g.state === Oo ? (g.state = rn, g.timer.stop(), g.on.call("interrupt", e3, e3.__data__, g.index, g.group), delete o[c]) : +c < t && (g.state = rn, g.timer.stop(), g.on.call("cancel", e3, e3.__data__, g.index, g.group), delete o[c]);
      }
    if (Do(function() {
      n.state === on && (n.state = Oo, n.timer.restart(a, n.delay, n.time), a(u));
    }), n.state = Wn, n.on.call("start", e3, e3.__data__, n.index, n.group), n.state === Wn) {
      for (n.state = on, i = new Array(f = n.tween.length), c = 0, d = -1; c < f; ++c)
        (g = n.tween[c].value.call(e3, e3.__data__, n.index, n.group)) && (i[++d] = g);
      i.length = d + 1;
    }
  }
  function a(u) {
    for (var c = u < n.duration ? n.ease.call(null, u / n.duration) : (n.timer.restart(s), n.state = Kn, 1), d = -1, f = i.length; ++d < f; )
      i[d].call(e3, c);
    n.state === Kn && (n.on.call("end", e3, e3.__data__, n.index, n.group), s());
  }
  function s() {
    n.state = rn, n.timer.stop(), delete o[t];
    for (var u in o)
      return;
    delete e3.__transition;
  }
}
function ln(e3, t) {
  var n = e3.__transition, o, i, r = true, l;
  if (n) {
    t = t == null ? null : t + "";
    for (l in n) {
      if ((o = n[l]).name !== t) {
        r = false;
        continue;
      }
      i = o.state > Wn && o.state < Kn, o.state = rn, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", e3, e3.__data__, o.index, o.group), delete n[l];
    }
    r && delete e3.__transition;
  }
}
function ys(e3) {
  return this.each(function() {
    ln(this, e3);
  });
}
function _s(e3, t) {
  var n, o;
  return function() {
    var i = Le(this, e3), r = i.tween;
    if (r !== n) {
      o = n = r;
      for (var l = 0, a = o.length; l < a; ++l)
        if (o[l].name === t) {
          o = o.slice(), o.splice(l, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function ws(e3, t, n) {
  var o, i;
  if (typeof n != "function")
    throw new Error();
  return function() {
    var r = Le(this, e3), l = r.tween;
    if (l !== o) {
      i = (o = l).slice();
      for (var a = { name: t, value: n }, s = 0, u = i.length; s < u; ++s)
        if (i[s].name === t) {
          i[s] = a;
          break;
        }
      s === u && i.push(a);
    }
    r.tween = i;
  };
}
function bs(e3, t) {
  var n = this._id;
  if (e3 += "", arguments.length < 2) {
    for (var o = De(this.node(), n).tween, i = 0, r = o.length, l; i < r; ++i)
      if ((l = o[i]).name === e3)
        return l.value;
    return null;
  }
  return this.each((t == null ? _s : ws)(n, e3, t));
}
function co(e3, t, n) {
  var o = e3._id;
  return e3.each(function() {
    var i = Le(this, o);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return De(i, o).value[t];
  };
}
function Fi(e3, t) {
  var n;
  return (typeof t == "number" ? ze : t instanceof rt ? dn : (n = rt(t)) ? (t = n, dn) : Oi)(e3, t);
}
function xs(e3) {
  return function() {
    this.removeAttribute(e3);
  };
}
function Es(e3) {
  return function() {
    this.removeAttributeNS(e3.space, e3.local);
  };
}
function Ss(e3, t, n) {
  var o, i = n + "", r;
  return function() {
    var l = this.getAttribute(e3);
    return l === i ? null : l === o ? r : r = t(o = l, n);
  };
}
function Ns(e3, t, n) {
  var o, i = n + "", r;
  return function() {
    var l = this.getAttributeNS(e3.space, e3.local);
    return l === i ? null : l === o ? r : r = t(o = l, n);
  };
}
function Cs(e3, t, n) {
  var o, i, r;
  return function() {
    var l, a = n(this), s;
    return a == null ? void this.removeAttribute(e3) : (l = this.getAttribute(e3), s = a + "", l === s ? null : l === o && s === i ? r : (i = s, r = t(o = l, a)));
  };
}
function Ms(e3, t, n) {
  var o, i, r;
  return function() {
    var l, a = n(this), s;
    return a == null ? void this.removeAttributeNS(e3.space, e3.local) : (l = this.getAttributeNS(e3.space, e3.local), s = a + "", l === s ? null : l === o && s === i ? r : (i = s, r = t(o = l, a)));
  };
}
function Is(e3, t) {
  var n = _n(e3), o = n === "transform" ? as : Fi;
  return this.attrTween(e3, typeof t == "function" ? (n.local ? Ms : Cs)(n, o, co(this, "attr." + e3, t)) : t == null ? (n.local ? Es : xs)(n) : (n.local ? Ns : Ss)(n, o, t));
}
function ks(e3, t) {
  return function(n) {
    this.setAttribute(e3, t.call(this, n));
  };
}
function Ps(e3, t) {
  return function(n) {
    this.setAttributeNS(e3.space, e3.local, t.call(this, n));
  };
}
function $s(e3, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && Ps(e3, r)), n;
  }
  return i._value = t, i;
}
function Ts(e3, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && ks(e3, r)), n;
  }
  return i._value = t, i;
}
function Ds(e3, t) {
  var n = "attr." + e3;
  if (arguments.length < 2)
    return (n = this.tween(n)) && n._value;
  if (t == null)
    return this.tween(n, null);
  if (typeof t != "function")
    throw new Error();
  var o = _n(e3);
  return this.tween(n, (o.local ? $s : Ts)(o, t));
}
function As(e3, t) {
  return function() {
    uo(this, e3).delay = +t.apply(this, arguments);
  };
}
function Os(e3, t) {
  return t = +t, function() {
    uo(this, e3).delay = t;
  };
}
function zs(e3) {
  var t = this._id;
  return arguments.length ? this.each((typeof e3 == "function" ? As : Os)(t, e3)) : De(this.node(), t).delay;
}
function Bs(e3, t) {
  return function() {
    Le(this, e3).duration = +t.apply(this, arguments);
  };
}
function Vs(e3, t) {
  return t = +t, function() {
    Le(this, e3).duration = t;
  };
}
function Rs(e3) {
  var t = this._id;
  return arguments.length ? this.each((typeof e3 == "function" ? Bs : Vs)(t, e3)) : De(this.node(), t).duration;
}
function Hs(e3, t) {
  if (typeof t != "function")
    throw new Error();
  return function() {
    Le(this, e3).ease = t;
  };
}
function Ls(e3) {
  var t = this._id;
  return arguments.length ? this.each(Hs(t, e3)) : De(this.node(), t).ease;
}
function Fs(e3, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function")
      throw new Error();
    Le(this, e3).ease = n;
  };
}
function Ys(e3) {
  if (typeof e3 != "function")
    throw new Error();
  return this.each(Fs(this._id, e3));
}
function Gs(e3) {
  typeof e3 != "function" && (e3 = wi(e3));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], l = r.length, a = o[i] = [], s, u = 0; u < l; ++u)
      (s = r[u]) && e3.call(s, s.__data__, u, r) && a.push(s);
  return new Xe(o, this._parents, this._name, this._id);
}
function Xs(e3) {
  if (e3._id !== this._id)
    throw new Error();
  for (var t = this._groups, n = e3._groups, o = t.length, i = n.length, r = Math.min(o, i), l = new Array(o), a = 0; a < r; ++a)
    for (var s = t[a], u = n[a], c = s.length, d = l[a] = new Array(c), f, g = 0; g < c; ++g)
      (f = s[g] || u[g]) && (d[g] = f);
  for (; a < o; ++a)
    l[a] = t[a];
  return new Xe(l, this._parents, this._name, this._id);
}
function Us(e3) {
  return (e3 + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function Zs(e3, t, n) {
  var o, i, r = Us(t) ? uo : Le;
  return function() {
    var l = r(this, e3), a = l.on;
    a !== o && (i = (o = a).copy()).on(t, n), l.on = i;
  };
}
function Ws(e3, t) {
  var n = this._id;
  return arguments.length < 2 ? De(this.node(), n).on.on(e3) : this.each(Zs(n, e3, t));
}
function Ks(e3) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition)
      if (+n !== e3)
        return;
    t && t.removeChild(this);
  };
}
function qs() {
  return this.on("end.remove", Ks(this._id));
}
function Js(e3) {
  var t = this._name, n = this._id;
  typeof e3 != "function" && (e3 = io(e3));
  for (var o = this._groups, i = o.length, r = new Array(i), l = 0; l < i; ++l)
    for (var a = o[l], s = a.length, u = r[l] = new Array(s), c, d, f = 0; f < s; ++f)
      (c = a[f]) && (d = e3.call(c, c.__data__, f, a)) && ("__data__" in c && (d.__data__ = c.__data__), u[f] = d, bn(u[f], t, n, f, u, De(c, n)));
  return new Xe(r, this._parents, t, n);
}
function js(e3) {
  var t = this._name, n = this._id;
  typeof e3 != "function" && (e3 = _i(e3));
  for (var o = this._groups, i = o.length, r = [], l = [], a = 0; a < i; ++a)
    for (var s = o[a], u = s.length, c, d = 0; d < u; ++d)
      if (c = s[d]) {
        for (var f = e3.call(c, c.__data__, d, s), g, b = De(c, n), x = 0, S = f.length; x < S; ++x)
          (g = f[x]) && bn(g, t, n, x, f, b);
        r.push(f), l.push(c);
      }
  return new Xe(r, l, t, n);
}
var Qs = Lt.prototype.constructor;
function eu() {
  return new Qs(this._groups, this._parents);
}
function tu(e3, t) {
  var n, o, i;
  return function() {
    var r = mt(this, e3), l = (this.style.removeProperty(e3), mt(this, e3));
    return r === l ? null : r === n && l === o ? i : i = t(n = r, o = l);
  };
}
function Yi(e3) {
  return function() {
    this.style.removeProperty(e3);
  };
}
function nu(e3, t, n) {
  var o, i = n + "", r;
  return function() {
    var l = mt(this, e3);
    return l === i ? null : l === o ? r : r = t(o = l, n);
  };
}
function ou(e3, t, n) {
  var o, i, r;
  return function() {
    var l = mt(this, e3), a = n(this), s = a + "";
    return a == null && (s = a = (this.style.removeProperty(e3), mt(this, e3))), l === s ? null : l === o && s === i ? r : (i = s, r = t(o = l, a));
  };
}
function iu(e3, t) {
  var n, o, i, r = "style." + t, l = "end." + r, a;
  return function() {
    var s = Le(this, e3), u = s.on, c = s.value[r] == null ? a || (a = Yi(t)) : void 0;
    (u !== n || i !== c) && (o = (n = u).copy()).on(l, i = c), s.on = o;
  };
}
function ru(e3, t, n) {
  var o = (e3 += "") == "transform" ? ls : Fi;
  return t == null ? this.styleTween(e3, tu(e3, o)).on("end.style." + e3, Yi(e3)) : typeof t == "function" ? this.styleTween(e3, ou(e3, o, co(this, "style." + e3, t))).each(iu(this._id, e3)) : this.styleTween(e3, nu(e3, o, t), n).on("end.style." + e3, null);
}
function lu(e3, t, n) {
  return function(o) {
    this.style.setProperty(e3, t.call(this, o), n);
  };
}
function au(e3, t, n) {
  var o, i;
  function r() {
    var l = t.apply(this, arguments);
    return l !== i && (o = (i = l) && lu(e3, l, n)), o;
  }
  return r._value = t, r;
}
function su(e3, t, n) {
  var o = "style." + (e3 += "");
  if (arguments.length < 2)
    return (o = this.tween(o)) && o._value;
  if (t == null)
    return this.tween(o, null);
  if (typeof t != "function")
    throw new Error();
  return this.tween(o, au(e3, t, n ?? ""));
}
function uu(e3) {
  return function() {
    this.textContent = e3;
  };
}
function cu(e3) {
  return function() {
    var t = e3(this);
    this.textContent = t ?? "";
  };
}
function du(e3) {
  return this.tween("text", typeof e3 == "function" ? cu(co(this, "text", e3)) : uu(e3 == null ? "" : e3 + ""));
}
function fu(e3) {
  return function(t) {
    this.textContent = e3.call(this, t);
  };
}
function hu(e3) {
  var t, n;
  function o() {
    var i = e3.apply(this, arguments);
    return i !== n && (t = (n = i) && fu(i)), t;
  }
  return o._value = e3, o;
}
function gu(e3) {
  var t = "text";
  if (arguments.length < 1)
    return (t = this.tween(t)) && t._value;
  if (e3 == null)
    return this.tween(t, null);
  if (typeof e3 != "function")
    throw new Error();
  return this.tween(t, hu(e3));
}
function vu() {
  for (var e3 = this._name, t = this._id, n = Gi(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var l = o[r], a = l.length, s, u = 0; u < a; ++u)
      if (s = l[u]) {
        var c = De(s, t);
        bn(s, e3, n, u, l, {
          time: c.time + c.delay + c.duration,
          delay: 0,
          duration: c.duration,
          ease: c.ease
        });
      }
  return new Xe(o, this._parents, e3, n);
}
function pu() {
  var e3, t, n = this, o = n._id, i = n.size();
  return new Promise(function(r, l) {
    var a = { value: l }, s = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var u = Le(this, o), c = u.on;
      c !== e3 && (t = (e3 = c).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(s)), u.on = t;
    }), i === 0 && r();
  });
}
var mu = 0;
function Xe(e3, t, n, o) {
  this._groups = e3, this._parents = t, this._name = n, this._id = o;
}
function Gi() {
  return ++mu;
}
var Fe = Lt.prototype;
Xe.prototype = {
  constructor: Xe,
  select: Js,
  selectAll: js,
  selectChild: Fe.selectChild,
  selectChildren: Fe.selectChildren,
  filter: Gs,
  merge: Xs,
  selection: eu,
  transition: vu,
  call: Fe.call,
  nodes: Fe.nodes,
  node: Fe.node,
  size: Fe.size,
  empty: Fe.empty,
  each: Fe.each,
  on: Ws,
  attr: Is,
  attrTween: Ds,
  style: ru,
  styleTween: su,
  text: du,
  textTween: gu,
  remove: qs,
  tween: bs,
  delay: zs,
  duration: Rs,
  ease: Ls,
  easeVarying: Ys,
  end: pu,
  [Symbol.iterator]: Fe[Symbol.iterator]
};
function yu(e3) {
  return ((e3 *= 2) <= 1 ? e3 * e3 * e3 : (e3 -= 2) * e3 * e3 + 2) / 2;
}
var _u = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: yu
};
function wu(e3, t) {
  for (var n; !(n = e3.__transition) || !(n = n[t]); )
    if (!(e3 = e3.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function bu(e3) {
  var t, n;
  e3 instanceof Xe ? (t = e3._id, e3 = e3._name) : (t = Gi(), (n = _u).time = so(), e3 = e3 == null ? null : e3 + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var l = o[r], a = l.length, s, u = 0; u < a; ++u)
      (s = l[u]) && bn(s, e3, t, u, l, n || wu(s, t));
  return new Xe(o, this._parents, e3, t);
}
Lt.prototype.interrupt = ys;
Lt.prototype.transition = bu;
const Wt = (e3) => () => e3;
function xu(e3, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: e3, enumerable: true, configurable: true },
    sourceEvent: { value: t, enumerable: true, configurable: true },
    target: { value: n, enumerable: true, configurable: true },
    transform: { value: o, enumerable: true, configurable: true },
    _: { value: i }
  });
}
function Ge(e3, t, n) {
  this.k = e3, this.x = t, this.y = n;
}
Ge.prototype = {
  constructor: Ge,
  scale: function(e3) {
    return e3 === 1 ? this : new Ge(this.k * e3, this.x, this.y);
  },
  translate: function(e3, t) {
    return e3 === 0 & t === 0 ? this : new Ge(this.k, this.x + this.k * e3, this.y + this.k * t);
  },
  apply: function(e3) {
    return [e3[0] * this.k + this.x, e3[1] * this.k + this.y];
  },
  applyX: function(e3) {
    return e3 * this.k + this.x;
  },
  applyY: function(e3) {
    return e3 * this.k + this.y;
  },
  invert: function(e3) {
    return [(e3[0] - this.x) / this.k, (e3[1] - this.y) / this.k];
  },
  invertX: function(e3) {
    return (e3 - this.x) / this.k;
  },
  invertY: function(e3) {
    return (e3 - this.y) / this.k;
  },
  rescaleX: function(e3) {
    return e3.copy().domain(e3.range().map(this.invertX, this).map(e3.invert, e3));
  },
  rescaleY: function(e3) {
    return e3.copy().domain(e3.range().map(this.invertY, this).map(e3.invert, e3));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var _t = new Ge(1, 0, 0);
Ge.prototype;
function Dn(e3) {
  e3.stopImmediatePropagation();
}
function Ct(e3) {
  e3.preventDefault(), e3.stopImmediatePropagation();
}
function Eu(e3) {
  return (!e3.ctrlKey || e3.type === "wheel") && !e3.button;
}
function Su() {
  var e3 = this;
  return e3 instanceof SVGElement ? (e3 = e3.ownerSVGElement || e3, e3.hasAttribute("viewBox") ? (e3 = e3.viewBox.baseVal, [[e3.x, e3.y], [e3.x + e3.width, e3.y + e3.height]]) : [[0, 0], [e3.width.baseVal.value, e3.height.baseVal.value]]) : [[0, 0], [e3.clientWidth, e3.clientHeight]];
}
function zo() {
  return this.__zoom || _t;
}
function Nu(e3) {
  return -e3.deltaY * (e3.deltaMode === 1 ? 0.05 : e3.deltaMode ? 1 : 2e-3) * (e3.ctrlKey ? 10 : 1);
}
function Cu() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Mu(e3, t, n) {
  var o = e3.invertX(t[0][0]) - n[0][0], i = e3.invertX(t[1][0]) - n[1][0], r = e3.invertY(t[0][1]) - n[0][1], l = e3.invertY(t[1][1]) - n[1][1];
  return e3.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    l > r ? (r + l) / 2 : Math.min(0, r) || Math.max(0, l)
  );
}
function Iu() {
  var e3 = Eu, t = Su, n = Mu, o = Nu, i = Cu, r = [0, 1 / 0], l = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, s = nn, u = yn("start", "zoom", "end"), c, d, f, g = 500, b = 150, x = 0, S = 10;
  function C(y) {
    y.property("__zoom", zo).on("wheel.zoom", T, { passive: false }).on("mousedown.zoom", W).on("dblclick.zoom", L).filter(i).on("touchstart.zoom", z).on("touchmove.zoom", w).on("touchend.zoom touchcancel.zoom", J).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  C.transform = function(y, P, E, D) {
    var A = y.selection ? y.selection() : y;
    A.property("__zoom", zo), y !== A ? O(y, P, E, D) : A.interrupt().each(function() {
      k(this, arguments).event(D).start().zoom(null, typeof P == "function" ? P.apply(this, arguments) : P).end();
    });
  }, C.scaleBy = function(y, P, E, D) {
    C.scaleTo(y, function() {
      var A = this.__zoom.k, B = typeof P == "function" ? P.apply(this, arguments) : P;
      return A * B;
    }, E, D);
  }, C.scaleTo = function(y, P, E, D) {
    C.transform(y, function() {
      var A = t.apply(this, arguments), B = this.__zoom, V = E == null ? N(A) : typeof E == "function" ? E.apply(this, arguments) : E, X = B.invert(V), Q = typeof P == "function" ? P.apply(this, arguments) : P;
      return n(_(M(B, Q), V, X), A, l);
    }, E, D);
  }, C.translateBy = function(y, P, E, D) {
    C.transform(y, function() {
      return n(this.__zoom.translate(
        typeof P == "function" ? P.apply(this, arguments) : P,
        typeof E == "function" ? E.apply(this, arguments) : E
      ), t.apply(this, arguments), l);
    }, null, D);
  }, C.translateTo = function(y, P, E, D, A) {
    C.transform(y, function() {
      var B = t.apply(this, arguments), V = this.__zoom, X = D == null ? N(B) : typeof D == "function" ? D.apply(this, arguments) : D;
      return n(_t.translate(X[0], X[1]).scale(V.k).translate(
        typeof P == "function" ? -P.apply(this, arguments) : -P,
        typeof E == "function" ? -E.apply(this, arguments) : -E
      ), B, l);
    }, D, A);
  };
  function M(y, P) {
    return P = Math.max(r[0], Math.min(r[1], P)), P === y.k ? y : new Ge(P, y.x, y.y);
  }
  function _(y, P, E) {
    var D = P[0] - E[0] * y.k, A = P[1] - E[1] * y.k;
    return D === y.x && A === y.y ? y : new Ge(y.k, D, A);
  }
  function N(y) {
    return [(+y[0][0] + +y[1][0]) / 2, (+y[0][1] + +y[1][1]) / 2];
  }
  function O(y, P, E, D) {
    y.on("start.zoom", function() {
      k(this, arguments).event(D).start();
    }).on("interrupt.zoom end.zoom", function() {
      k(this, arguments).event(D).end();
    }).tween("zoom", function() {
      var A = this, B = arguments, V = k(A, B).event(D), X = t.apply(A, B), Q = E == null ? N(X) : typeof E == "function" ? E.apply(A, B) : E, oe = Math.max(X[1][0] - X[0][0], X[1][1] - X[0][1]), le = A.__zoom, Y = typeof P == "function" ? P.apply(A, B) : P, U = s(le.invert(Q).concat(oe / le.k), Y.invert(Q).concat(oe / Y.k));
      return function(q) {
        if (q === 1)
          q = Y;
        else {
          var ce = U(q), re = oe / ce[2];
          q = new Ge(re, Q[0] - ce[0] * re, Q[1] - ce[1] * re);
        }
        V.zoom(null, q);
      };
    });
  }
  function k(y, P, E) {
    return !E && y.__zooming || new $(y, P);
  }
  function $(y, P) {
    this.that = y, this.args = P, this.active = 0, this.sourceEvent = null, this.extent = t.apply(y, P), this.taps = 0;
  }
  $.prototype = {
    event: function(y) {
      return y && (this.sourceEvent = y), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(y, P) {
      return this.mouse && y !== "mouse" && (this.mouse[1] = P.invert(this.mouse[0])), this.touch0 && y !== "touch" && (this.touch0[1] = P.invert(this.touch0[0])), this.touch1 && y !== "touch" && (this.touch1[1] = P.invert(this.touch1[0])), this.that.__zoom = P, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(y) {
      var P = ke(this.that).datum();
      u.call(
        y,
        this.that,
        new xu(y, {
          sourceEvent: this.sourceEvent,
          target: C,
          transform: this.that.__zoom,
          dispatch: u
        }),
        P
      );
    }
  };
  function T(y, ...P) {
    if (!e3.apply(this, arguments))
      return;
    var E = k(this, P).event(y), D = this.__zoom, A = Math.max(r[0], Math.min(r[1], D.k * Math.pow(2, o.apply(this, arguments)))), B = Oe(y);
    if (E.wheel)
      (E.mouse[0][0] !== B[0] || E.mouse[0][1] !== B[1]) && (E.mouse[1] = D.invert(E.mouse[0] = B)), clearTimeout(E.wheel);
    else {
      if (D.k === A)
        return;
      E.mouse = [B, D.invert(B)], ln(this), E.start();
    }
    Ct(y), E.wheel = setTimeout(V, b), E.zoom("mouse", n(_(M(D, A), E.mouse[0], E.mouse[1]), E.extent, l));
    function V() {
      E.wheel = null, E.end();
    }
  }
  function W(y, ...P) {
    if (f || !e3.apply(this, arguments))
      return;
    var E = y.currentTarget, D = k(this, P, true).event(y), A = ke(y.view).on("mousemove.zoom", Q, true).on("mouseup.zoom", oe, true), B = Oe(y, E), V = y.clientX, X = y.clientY;
    Pi(y.view), Dn(y), D.mouse = [B, this.__zoom.invert(B)], ln(this), D.start();
    function Q(le) {
      if (Ct(le), !D.moved) {
        var Y = le.clientX - V, U = le.clientY - X;
        D.moved = Y * Y + U * U > x;
      }
      D.event(le).zoom("mouse", n(_(D.that.__zoom, D.mouse[0] = Oe(le, E), D.mouse[1]), D.extent, l));
    }
    function oe(le) {
      A.on("mousemove.zoom mouseup.zoom", null), $i(le.view, D.moved), Ct(le), D.event(le).end();
    }
  }
  function L(y, ...P) {
    if (e3.apply(this, arguments)) {
      var E = this.__zoom, D = Oe(y.changedTouches ? y.changedTouches[0] : y, this), A = E.invert(D), B = E.k * (y.shiftKey ? 0.5 : 2), V = n(_(M(E, B), D, A), t.apply(this, P), l);
      Ct(y), a > 0 ? ke(this).transition().duration(a).call(O, V, D, y) : ke(this).call(C.transform, V, D, y);
    }
  }
  function z(y, ...P) {
    if (e3.apply(this, arguments)) {
      var E = y.touches, D = E.length, A = k(this, P, y.changedTouches.length === D).event(y), B, V, X, Q;
      for (Dn(y), V = 0; V < D; ++V)
        X = E[V], Q = Oe(X, this), Q = [Q, this.__zoom.invert(Q), X.identifier], A.touch0 ? !A.touch1 && A.touch0[2] !== Q[2] && (A.touch1 = Q, A.taps = 0) : (A.touch0 = Q, B = true, A.taps = 1 + !!c);
      c && (c = clearTimeout(c)), B && (A.taps < 2 && (d = Q[0], c = setTimeout(function() {
        c = null;
      }, g)), ln(this), A.start());
    }
  }
  function w(y, ...P) {
    if (this.__zooming) {
      var E = k(this, P).event(y), D = y.changedTouches, A = D.length, B, V, X, Q;
      for (Ct(y), B = 0; B < A; ++B)
        V = D[B], X = Oe(V, this), E.touch0 && E.touch0[2] === V.identifier ? E.touch0[0] = X : E.touch1 && E.touch1[2] === V.identifier && (E.touch1[0] = X);
      if (V = E.that.__zoom, E.touch1) {
        var oe = E.touch0[0], le = E.touch0[1], Y = E.touch1[0], U = E.touch1[1], q = (q = Y[0] - oe[0]) * q + (q = Y[1] - oe[1]) * q, ce = (ce = U[0] - le[0]) * ce + (ce = U[1] - le[1]) * ce;
        V = M(V, Math.sqrt(q / ce)), X = [(oe[0] + Y[0]) / 2, (oe[1] + Y[1]) / 2], Q = [(le[0] + U[0]) / 2, (le[1] + U[1]) / 2];
      } else if (E.touch0)
        X = E.touch0[0], Q = E.touch0[1];
      else
        return;
      E.zoom("touch", n(_(V, X, Q), E.extent, l));
    }
  }
  function J(y, ...P) {
    if (this.__zooming) {
      var E = k(this, P).event(y), D = y.changedTouches, A = D.length, B, V;
      for (Dn(y), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, g), B = 0; B < A; ++B)
        V = D[B], E.touch0 && E.touch0[2] === V.identifier ? delete E.touch0 : E.touch1 && E.touch1[2] === V.identifier && delete E.touch1;
      if (E.touch1 && !E.touch0 && (E.touch0 = E.touch1, delete E.touch1), E.touch0)
        E.touch0[1] = this.__zoom.invert(E.touch0[0]);
      else if (E.end(), E.taps === 2 && (V = Oe(V, this), Math.hypot(d[0] - V[0], d[1] - V[1]) < S)) {
        var X = ke(this).on("dblclick.zoom");
        X && X.apply(this, arguments);
      }
    }
  }
  return C.wheelDelta = function(y) {
    return arguments.length ? (o = typeof y == "function" ? y : Wt(+y), C) : o;
  }, C.filter = function(y) {
    return arguments.length ? (e3 = typeof y == "function" ? y : Wt(!!y), C) : e3;
  }, C.touchable = function(y) {
    return arguments.length ? (i = typeof y == "function" ? y : Wt(!!y), C) : i;
  }, C.extent = function(y) {
    return arguments.length ? (t = typeof y == "function" ? y : Wt([[+y[0][0], +y[0][1]], [+y[1][0], +y[1][1]]]), C) : t;
  }, C.scaleExtent = function(y) {
    return arguments.length ? (r[0] = +y[0], r[1] = +y[1], C) : [r[0], r[1]];
  }, C.translateExtent = function(y) {
    return arguments.length ? (l[0][0] = +y[0][0], l[1][0] = +y[1][0], l[0][1] = +y[0][1], l[1][1] = +y[1][1], C) : [[l[0][0], l[0][1]], [l[1][0], l[1][1]]];
  }, C.constrain = function(y) {
    return arguments.length ? (n = y, C) : n;
  }, C.duration = function(y) {
    return arguments.length ? (a = +y, C) : a;
  }, C.interpolate = function(y) {
    return arguments.length ? (s = y, C) : s;
  }, C.on = function() {
    var y = u.on.apply(u, arguments);
    return y === u ? C : y;
  }, C.clickDistance = function(y) {
    return arguments.length ? (x = (y = +y) * y, C) : Math.sqrt(x);
  }, C.tapDistance = function(y) {
    return arguments.length ? (S = +y, C) : S;
  }, C;
}
var R = /* @__PURE__ */ ((e3) => (e3.Left = "left", e3.Top = "top", e3.Right = "right", e3.Bottom = "bottom", e3))(R || {}), fo = /* @__PURE__ */ ((e3) => (e3.Partial = "partial", e3.Full = "full", e3))(fo || {}), et = /* @__PURE__ */ ((e3) => (e3.Bezier = "default", e3.SimpleBezier = "simple-bezier", e3.Straight = "straight", e3.Step = "step", e3.SmoothStep = "smoothstep", e3))(et || {}), je = /* @__PURE__ */ ((e3) => (e3.Strict = "strict", e3.Loose = "loose", e3))(je || {}), qn = /* @__PURE__ */ ((e3) => (e3.Arrow = "arrow", e3.ArrowClosed = "arrowclosed", e3))(qn || {}), $t = /* @__PURE__ */ ((e3) => (e3.Free = "free", e3.Vertical = "vertical", e3.Horizontal = "horizontal", e3))($t || {});
const ku = ["INPUT", "SELECT", "TEXTAREA"], Pu = typeof document < "u" ? document : null;
function Jn(e3) {
  var t, n;
  const o = ((n = (t = e3.composedPath) == null ? void 0 : t.call(e3)) == null ? void 0 : n[0]) || e3.target, i = typeof o?.hasAttribute == "function" ? o.hasAttribute("contenteditable") : false, r = typeof o?.closest == "function" ? o.closest(".nokey") : null;
  return ku.includes(o?.nodeName) || i || !!r;
}
function $u(e3) {
  return e3.ctrlKey || e3.metaKey || e3.shiftKey || e3.altKey;
}
function Bo(e3, t, n, o) {
  const i = t.replace("+", `
`).replace(`

`, `
+`).split(`
`).map((l) => l.trim().toLowerCase());
  if (i.length === 1)
    return e3.toLowerCase() === t.toLowerCase();
  o || n.add(e3.toLowerCase());
  const r = i.every(
    (l, a) => n.has(l) && Array.from(n.values())[a] === i[a]
  );
  return o && n.delete(e3.toLowerCase()), r;
}
function Tu(e3, t) {
  return (n) => {
    if (!n.code && !n.key)
      return false;
    const o = Du(n.code, e3);
    return Array.isArray(e3) ? e3.some((i) => Bo(n[o], i, t, n.type === "keyup")) : Bo(n[o], e3, t, n.type === "keyup");
  };
}
function Du(e3, t) {
  return t.includes(e3) ? "code" : "key";
}
function Tt(e3, t) {
  const n = computed(() => toValue(t?.target) ?? Pu), o = shallowRef(toValue(e3) === true);
  let i = false;
  const r = /* @__PURE__ */ new Set();
  let l = s(toValue(e3));
  watch(
    () => toValue(e3),
    (u, c) => {
      typeof c == "boolean" && typeof u != "boolean" && a(), l = s(u);
    },
    {
      immediate: true
    }
  ), mi(["blur", "contextmenu"], a), _o(
    (...u) => l(...u),
    (u) => {
      var c, d;
      const f = toValue(t?.actInsideInputWithModifier) ?? true, g = toValue(t?.preventDefault) ?? false;
      if (i = $u(u), (!i || i && !f) && Jn(u))
        return;
      const x = ((d = (c = u.composedPath) == null ? void 0 : c.call(u)) == null ? void 0 : d[0]) || u.target, S = x?.nodeName === "BUTTON" || x?.nodeName === "A";
      !g && (i || !S) && u.preventDefault(), o.value = true;
    },
    { eventName: "keydown", target: n }
  ), _o(
    (...u) => l(...u),
    (u) => {
      const c = toValue(t?.actInsideInputWithModifier) ?? true;
      if (o.value) {
        if ((!i || i && !c) && Jn(u))
          return;
        i = false, o.value = false;
      }
    },
    { eventName: "keyup", target: n }
  );
  function a() {
    i = false, r.clear(), o.value = toValue(e3) === true;
  }
  function s(u) {
    return u === null ? (a(), () => false) : typeof u == "boolean" ? (a(), o.value = u, () => false) : Array.isArray(u) || typeof u == "string" ? Tu(u, r) : u;
  }
  return o;
}
const Xi = "vue-flow__node-desc", Ui = "vue-flow__edge-desc", Au = "vue-flow__aria-live", Zi = ["Enter", " ", "Escape"], ft = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};
function vn(e3) {
  return {
    ...e3.computedPosition || { x: 0, y: 0 },
    width: e3.dimensions.width || 0,
    height: e3.dimensions.height || 0
  };
}
function pn(e3, t) {
  const n = Math.max(0, Math.min(e3.x + e3.width, t.x + t.width) - Math.max(e3.x, t.x)), o = Math.max(0, Math.min(e3.y + e3.height, t.y + t.height) - Math.max(e3.y, t.y));
  return Math.ceil(n * o);
}
function xn(e3) {
  return {
    width: e3.offsetWidth,
    height: e3.offsetHeight
  };
}
function at(e3, t = 0, n = 1) {
  return Math.min(Math.max(e3, t), n);
}
function Wi(e3, t) {
  return {
    x: at(e3.x, t[0][0], t[1][0]),
    y: at(e3.y, t[0][1], t[1][1])
  };
}
function Vo(e3) {
  const t = e3.getRootNode();
  return "elementFromPoint" in t ? t : window.document;
}
function Qe(e3) {
  return e3 && typeof e3 == "object" && "id" in e3 && "source" in e3 && "target" in e3;
}
function it(e3) {
  return e3 && typeof e3 == "object" && "id" in e3 && "position" in e3 && !Qe(e3);
}
function kt(e3) {
  return it(e3) && "computedPosition" in e3;
}
function Kt(e3) {
  return !Number.isNaN(e3) && Number.isFinite(e3);
}
function Ou(e3) {
  return Kt(e3.width) && Kt(e3.height) && Kt(e3.x) && Kt(e3.y);
}
function zu(e3, t, n) {
  const o = {
    id: e3.id.toString(),
    type: e3.type ?? "default",
    dimensions: markRaw({
      width: 0,
      height: 0
    }),
    computedPosition: markRaw({
      z: 0,
      ...e3.position
    }),
    // todo: shouldn't be defined initially, as we want to use handleBounds to check if a node was actually initialized or not
    handleBounds: {
      source: [],
      target: []
    },
    draggable: void 0,
    selectable: void 0,
    connectable: void 0,
    focusable: void 0,
    selected: false,
    dragging: false,
    resizing: false,
    initialized: false,
    isParent: false,
    position: {
      x: 0,
      y: 0
    },
    data: xe(e3.data) ? e3.data : {},
    events: markRaw(xe(e3.events) ? e3.events : {})
  };
  return Object.assign(t ?? o, e3, { id: e3.id.toString(), parentNode: n });
}
function Ki(e3, t, n) {
  var o, i;
  const r = {
    id: e3.id.toString(),
    type: e3.type ?? t?.type ?? "default",
    source: e3.source.toString(),
    target: e3.target.toString(),
    sourceHandle: (o = e3.sourceHandle) == null ? void 0 : o.toString(),
    targetHandle: (i = e3.targetHandle) == null ? void 0 : i.toString(),
    updatable: e3.updatable ?? n?.updatable,
    selectable: e3.selectable ?? n?.selectable,
    focusable: e3.focusable ?? n?.focusable,
    data: xe(e3.data) ? e3.data : {},
    events: markRaw(xe(e3.events) ? e3.events : {}),
    label: e3.label ?? "",
    interactionWidth: e3.interactionWidth ?? n?.interactionWidth,
    ...n ?? {}
  };
  return Object.assign(t ?? r, e3, { id: e3.id.toString() });
}
function qi(e3, t, n, o) {
  const i = typeof e3 == "string" ? e3 : e3.id, r = /* @__PURE__ */ new Set(), l = o === "source" ? "target" : "source";
  for (const a of n)
    a[l] === i && r.add(a[o]);
  return t.filter((a) => r.has(a.id));
}
function Bu(...e3) {
  if (e3.length === 3) {
    const [r, l, a] = e3;
    return qi(r, l, a, "target");
  }
  const [t, n] = e3, o = typeof t == "string" ? t : t.id;
  return n.filter((r) => Qe(r) && r.source === o).map((r) => n.find((l) => it(l) && l.id === r.target));
}
function Vu(...e3) {
  if (e3.length === 3) {
    const [r, l, a] = e3;
    return qi(r, l, a, "source");
  }
  const [t, n] = e3, o = typeof t == "string" ? t : t.id;
  return n.filter((r) => Qe(r) && r.target === o).map((r) => n.find((l) => it(l) && l.id === r.source));
}
function Ji({ source: e3, sourceHandle: t, target: n, targetHandle: o }) {
  return `vueflow__edge-${e3}${t ?? ""}-${n}${o ?? ""}`;
}
function Ru(e3, t) {
  return t.some(
    (n) => Qe(n) && n.source === e3.source && n.target === e3.target && (n.sourceHandle === e3.sourceHandle || !n.sourceHandle && !e3.sourceHandle) && (n.targetHandle === e3.targetHandle || !n.targetHandle && !e3.targetHandle)
  );
}
function Vt({ x: e3, y: t }, { x: n, y: o, zoom: i }) {
  return {
    x: e3 * i + n,
    y: t * i + o
  };
}
function Rt({ x: e3, y: t }, { x: n, y: o, zoom: i }, r = false, l = [1, 1]) {
  const a = {
    x: (e3 - n) / i,
    y: (t - o) / i
  };
  return r ? En(a, l) : a;
}
function Hu(e3, t) {
  return {
    x: Math.min(e3.x, t.x),
    y: Math.min(e3.y, t.y),
    x2: Math.max(e3.x2, t.x2),
    y2: Math.max(e3.y2, t.y2)
  };
}
function ji({ x: e3, y: t, width: n, height: o }) {
  return {
    x: e3,
    y: t,
    x2: e3 + n,
    y2: t + o
  };
}
function Lu({ x: e3, y: t, x2: n, y2: o }) {
  return {
    x: e3,
    y: t,
    width: n - e3,
    height: o - t
  };
}
function Qi(e3) {
  let t = {
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
    x2: Number.NEGATIVE_INFINITY,
    y2: Number.NEGATIVE_INFINITY
  };
  for (let n = 0; n < e3.length; n++) {
    const o = e3[n];
    t = Hu(
      t,
      ji({
        ...o.computedPosition,
        ...o.dimensions
      })
    );
  }
  return Lu(t);
}
function er(e3, t, n = { x: 0, y: 0, zoom: 1 }, o = false, i = false) {
  const r = {
    ...Rt(t, n),
    width: t.width / n.zoom,
    height: t.height / n.zoom
  }, l = [];
  for (const a of e3) {
    const { dimensions: s, selectable: u = true, hidden: c = false } = a, d = s.width ?? a.width ?? null, f = s.height ?? a.height ?? null;
    if (i && !u || c)
      continue;
    const g = pn(r, vn(a)), b = d === null || f === null, x = o && g > 0, S = (d ?? 0) * (f ?? 0);
    (b || x || g >= S || a.dragging) && l.push(a);
  }
  return l;
}
function tr(e3, t) {
  const n = /* @__PURE__ */ new Set();
  if (typeof e3 == "string")
    n.add(e3);
  else if (e3.length >= 1)
    for (const o of e3)
      n.add(o.id);
  return t.filter((o) => n.has(o.source) || n.has(o.target));
}
function ut(e3, t) {
  if (typeof e3 == "number")
    return Math.floor((t - t / (1 + e3)) * 0.5);
  if (typeof e3 == "string" && e3.endsWith("px")) {
    const n = Number.parseFloat(e3);
    if (!Number.isNaN(n))
      return Math.floor(n);
  }
  if (typeof e3 == "string" && e3.endsWith("%")) {
    const n = Number.parseFloat(e3);
    if (!Number.isNaN(n))
      return Math.floor(t * n * 0.01);
  }
  return Yt(`The padding value "${e3}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function Fu(e3, t, n) {
  if (typeof e3 == "string" || typeof e3 == "number") {
    const o = ut(e3, n), i = ut(e3, t);
    return {
      top: o,
      right: i,
      bottom: o,
      left: i,
      x: i * 2,
      y: o * 2
    };
  }
  if (typeof e3 == "object") {
    const o = ut(e3.top ?? e3.y ?? 0, n), i = ut(e3.bottom ?? e3.y ?? 0, n), r = ut(e3.left ?? e3.x ?? 0, t), l = ut(e3.right ?? e3.x ?? 0, t);
    return { top: o, right: l, bottom: i, left: r, x: r + l, y: o + i };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function Yu(e3, t, n, o, i, r) {
  const { x: l, y: a } = Vt(e3, { x: t, y: n, zoom: o }), { x: s, y: u } = Vt(
    { x: e3.x + e3.width, y: e3.y + e3.height },
    {
      x: t,
      y: n,
      zoom: o
    }
  ), c = i - s, d = r - u;
  return {
    left: Math.floor(l),
    top: Math.floor(a),
    right: Math.floor(c),
    bottom: Math.floor(d)
  };
}
function Ro(e3, t, n, o, i, r = 0.1) {
  const l = Fu(r, t, n), a = (t - l.x) / e3.width, s = (n - l.y) / e3.height, u = Math.min(a, s), c = at(u, o, i), d = e3.x + e3.width / 2, f = e3.y + e3.height / 2, g = t / 2 - d * c, b = n / 2 - f * c, x = Yu(e3, g, b, c, t, n), S = {
    left: Math.min(x.left - l.left, 0),
    top: Math.min(x.top - l.top, 0),
    right: Math.min(x.right - l.right, 0),
    bottom: Math.min(x.bottom - l.bottom, 0)
  };
  return {
    x: g - S.left + S.right,
    y: b - S.top + S.bottom,
    zoom: c
  };
}
function Gu(e3, t) {
  return {
    x: t.x + e3.x,
    y: t.y + e3.y,
    z: (e3.z > t.z ? e3.z : t.z) + 1
  };
}
function nr(e3, t) {
  if (!e3.parentNode)
    return false;
  const n = t.get(e3.parentNode);
  return n ? n.selected ? true : nr(n, t) : false;
}
function Ht(e3, t) {
  return typeof e3 > "u" ? "" : typeof e3 == "string" ? e3 : `${t ? `${t}__` : ""}${Object.keys(e3).sort().map((o) => `${o}=${e3[o]}`).join("&")}`;
}
function Ho(e3) {
  const t = e3.ctrlKey && mn() ? 10 : 1;
  return -e3.deltaY * (e3.deltaMode === 1 ? 0.05 : e3.deltaMode ? 1 : 2e-3) * t;
}
function Lo(e3, t, n) {
  return e3 < t ? at(Math.abs(e3 - t), 1, t) / t : e3 > n ? -at(Math.abs(e3 - n), 1, t) / t : 0;
}
function or(e3, t, n = 15, o = 40) {
  const i = Lo(e3.x, o, t.width - o) * n, r = Lo(e3.y, o, t.height - o) * n;
  return [i, r];
}
function An(e3, t) {
  if (t) {
    const n = e3.position.x + e3.dimensions.width - t.dimensions.width, o = e3.position.y + e3.dimensions.height - t.dimensions.height;
    if (n > 0 || o > 0 || e3.position.x < 0 || e3.position.y < 0) {
      let i = {};
      if (typeof t.style == "function" ? i = { ...t.style(t) } : t.style && (i = { ...t.style }), i.width = i.width ?? `${t.dimensions.width}px`, i.height = i.height ?? `${t.dimensions.height}px`, n > 0)
        if (typeof i.width == "string") {
          const r = Number(i.width.replace("px", ""));
          i.width = `${r + n}px`;
        } else
          i.width += n;
      if (o > 0)
        if (typeof i.height == "string") {
          const r = Number(i.height.replace("px", ""));
          i.height = `${r + o}px`;
        } else
          i.height += o;
      if (e3.position.x < 0) {
        const r = Math.abs(e3.position.x);
        if (t.position.x = t.position.x - r, typeof i.width == "string") {
          const l = Number(i.width.replace("px", ""));
          i.width = `${l + r}px`;
        } else
          i.width += r;
        e3.position.x = 0;
      }
      if (e3.position.y < 0) {
        const r = Math.abs(e3.position.y);
        if (t.position.y = t.position.y - r, typeof i.height == "string") {
          const l = Number(i.height.replace("px", ""));
          i.height = `${l + r}px`;
        } else
          i.height += r;
        e3.position.y = 0;
      }
      t.dimensions.width = Number(i.width.toString().replace("px", "")), t.dimensions.height = Number(i.height.toString().replace("px", "")), typeof t.style == "function" ? t.style = (r) => {
        const l = t.style;
        return {
          ...l(r),
          ...i
        };
      } : t.style = {
        ...t.style,
        ...i
      };
    }
  }
}
function Fo(e3, t) {
  var n, o;
  const i = e3.filter((l) => l.type === "add" || l.type === "remove");
  for (const l of i)
    if (l.type === "add")
      t.findIndex((s) => s.id === l.item.id) === -1 && t.push(l.item);
    else if (l.type === "remove") {
      const a = t.findIndex((s) => s.id === l.id);
      a !== -1 && t.splice(a, 1);
    }
  const r = t.map((l) => l.id);
  for (const l of t)
    for (const a of e3)
      if (a.id === l.id)
        switch (a.type) {
          case "select":
            l.selected = a.selected;
            break;
          case "position":
            if (kt(l) && (typeof a.position < "u" && (l.position = a.position), typeof a.dragging < "u" && (l.dragging = a.dragging), l.expandParent && l.parentNode)) {
              const s = t[r.indexOf(l.parentNode)];
              s && kt(s) && An(l, s);
            }
            break;
          case "dimensions":
            if (kt(l) && (typeof a.dimensions < "u" && (l.dimensions = a.dimensions), typeof a.updateStyle < "u" && a.updateStyle && (l.style = {
              ...l.style || {},
              width: `${(n = a.dimensions) == null ? void 0 : n.width}px`,
              height: `${(o = a.dimensions) == null ? void 0 : o.height}px`
            }), typeof a.resizing < "u" && (l.resizing = a.resizing), l.expandParent && l.parentNode)) {
              const s = t[r.indexOf(l.parentNode)];
              s && kt(s) && (!!s.dimensions.width && !!s.dimensions.height ? An(l, s) : nextTick(() => {
                An(l, s);
              }));
            }
            break;
        }
  return t;
}
function We(e3, t) {
  return {
    id: e3,
    type: "select",
    selected: t
  };
}
function Yo(e3) {
  return {
    item: e3,
    type: "add"
  };
}
function Go(e3) {
  return {
    id: e3,
    type: "remove"
  };
}
function Xo(e3, t, n, o, i) {
  return {
    id: e3,
    source: t,
    target: n,
    sourceHandle: o || null,
    targetHandle: i || null,
    type: "remove"
  };
}
function Ke(e3, t = /* @__PURE__ */ new Set(), n = false) {
  const o = [];
  for (const [i, r] of e3) {
    const l = t.has(i);
    !(r.selected === void 0 && !l) && r.selected !== l && (n && (r.selected = l), o.push(We(r.id, l)));
  }
  return o;
}
const Uo = () => {
};
function H(e3) {
  const t = /* @__PURE__ */ new Set();
  let n = Uo, o = () => false;
  const i = () => t.size > 0 || o(), r = (f) => {
    n = f;
  }, l = () => {
    n = Uo;
  }, a = (f) => {
    o = f;
  }, s = () => {
    o = () => false;
  }, u = (f) => {
    t.delete(f);
  };
  return {
    on: (f) => {
      t.add(f);
      const g = () => u(f);
      return Dt(g), { off: g };
    },
    off: u,
    trigger: (f) => {
      const g = [n];
      return i() ? g.push(...t) : e3 && g.push(e3), Promise.allSettled(g.map((b) => b(f)));
    },
    hasListeners: i,
    listeners: t,
    setEmitter: r,
    removeEmitter: l,
    setHasEmitListeners: a,
    removeHasEmitListeners: s
  };
}
function Zo(e3, t, n) {
  let o = e3;
  do {
    if (o && o.matches(t))
      return true;
    if (o === n)
      return false;
    o = o.parentElement;
  } while (o);
  return false;
}
function Xu(e3, t, n, o) {
  var i, r;
  const l = /* @__PURE__ */ new Map();
  for (const [a, s] of e3)
    (s.selected || s.id === o) && (!s.parentNode || !nr(s, e3)) && (s.draggable || t && typeof s.draggable > "u") && e3.get(a) && l.set(a, {
      id: s.id,
      position: s.position || { x: 0, y: 0 },
      distance: {
        x: n.x - ((i = s.computedPosition) == null ? void 0 : i.x) || 0,
        y: n.y - ((r = s.computedPosition) == null ? void 0 : r.y) || 0
      },
      from: { x: s.computedPosition.x, y: s.computedPosition.y },
      extent: s.extent,
      parentNode: s.parentNode,
      dimensions: { ...s.dimensions },
      expandParent: s.expandParent
    });
  return Array.from(l.values());
}
function On({
  id: e3,
  dragItems: t,
  findNode: n
}) {
  const o = [];
  for (const i of t) {
    const r = n(i.id);
    r && o.push(r);
  }
  return [e3 ? o.find((i) => i.id === e3) : o[0], o];
}
function ir(e3) {
  if (Array.isArray(e3))
    switch (e3.length) {
      case 1:
        return [e3[0], e3[0], e3[0], e3[0]];
      case 2:
        return [e3[0], e3[1], e3[0], e3[1]];
      case 3:
        return [e3[0], e3[1], e3[2], e3[1]];
      case 4:
        return e3;
      default:
        return [0, 0, 0, 0];
    }
  return [e3, e3, e3, e3];
}
function Uu(e3, t, n) {
  const [o, i, r, l] = typeof e3 != "string" ? ir(e3.padding) : [0, 0, 0, 0];
  return n && typeof n.computedPosition.x < "u" && typeof n.computedPosition.y < "u" && typeof n.dimensions.width < "u" && typeof n.dimensions.height < "u" ? [
    [n.computedPosition.x + l, n.computedPosition.y + o],
    [
      n.computedPosition.x + n.dimensions.width - i,
      n.computedPosition.y + n.dimensions.height - r
    ]
  ] : false;
}
function Zu(e3, t, n, o) {
  let i = e3.extent || n;
  if ((i === "parent" || !Array.isArray(i) && i?.range === "parent") && !e3.expandParent)
    if (e3.parentNode && o && e3.dimensions.width && e3.dimensions.height) {
      const r = Uu(i, e3, o);
      r && (i = r);
    } else
      t(new Se(Ee.NODE_EXTENT_INVALID, e3.id)), i = n;
  else if (Array.isArray(i)) {
    const r = o?.computedPosition.x || 0, l = o?.computedPosition.y || 0;
    i = [
      [i[0][0] + r, i[0][1] + l],
      [i[1][0] + r, i[1][1] + l]
    ];
  } else if (i !== "parent" && i?.range && Array.isArray(i.range)) {
    const [r, l, a, s] = ir(i.padding), u = o?.computedPosition.x || 0, c = o?.computedPosition.y || 0;
    i = [
      [i.range[0][0] + u + s, i.range[0][1] + c + r],
      [i.range[1][0] + u - l, i.range[1][1] + c - a]
    ];
  }
  return i === "parent" ? [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
  ] : i;
}
function Wu({ width: e3, height: t }, n) {
  return [n[0], [n[1][0] - (e3 || 0), n[1][1] - (t || 0)]];
}
function ho(e3, t, n, o, i) {
  const r = Wu(e3.dimensions, Zu(e3, n, o, i)), l = Wi(t, r);
  return {
    position: {
      x: l.x - (i?.computedPosition.x || 0),
      y: l.y - (i?.computedPosition.y || 0)
    },
    computedPosition: l
  };
}
function wt(e3, t, n = R.Left, o = false) {
  const i = (t?.x ?? 0) + e3.computedPosition.x, r = (t?.y ?? 0) + e3.computedPosition.y, { width: l, height: a } = t ?? ju(e3);
  if (o)
    return { x: i + l / 2, y: r + a / 2 };
  switch (t?.position ?? n) {
    case R.Top:
      return { x: i + l / 2, y: r };
    case R.Right:
      return { x: i + l, y: r + a / 2 };
    case R.Bottom:
      return { x: i + l / 2, y: r + a };
    case R.Left:
      return { x: i, y: r + a / 2 };
  }
}
function Wo(e3, t) {
  return e3 && (t ? e3.find((n) => n.id === t) : e3[0]) || null;
}
function Ku({
  sourcePos: e3,
  targetPos: t,
  sourceWidth: n,
  sourceHeight: o,
  targetWidth: i,
  targetHeight: r,
  width: l,
  height: a,
  viewport: s
}) {
  const u = {
    x: Math.min(e3.x, t.x),
    y: Math.min(e3.y, t.y),
    x2: Math.max(e3.x + n, t.x + i),
    y2: Math.max(e3.y + o, t.y + r)
  };
  u.x === u.x2 && (u.x2 += 1), u.y === u.y2 && (u.y2 += 1);
  const c = ji({
    x: (0 - s.x) / s.zoom,
    y: (0 - s.y) / s.zoom,
    width: l / s.zoom,
    height: a / s.zoom
  }), d = Math.max(0, Math.min(c.x2, u.x2) - Math.max(c.x, u.x)), f = Math.max(0, Math.min(c.y2, u.y2) - Math.max(c.y, u.y));
  return Math.ceil(d * f) > 0;
}
function qu(e3, t, n = false) {
  const o = typeof e3.zIndex == "number";
  let i = o ? e3.zIndex : 0;
  const r = t(e3.source), l = t(e3.target);
  return !r || !l ? 0 : (n && (i = o ? e3.zIndex : Math.max(r.computedPosition.z || 0, l.computedPosition.z || 0)), i);
}
var Ee = /* @__PURE__ */ ((e3) => (e3.MISSING_STYLES = "MISSING_STYLES", e3.MISSING_VIEWPORT_DIMENSIONS = "MISSING_VIEWPORT_DIMENSIONS", e3.NODE_INVALID = "NODE_INVALID", e3.NODE_NOT_FOUND = "NODE_NOT_FOUND", e3.NODE_MISSING_PARENT = "NODE_MISSING_PARENT", e3.NODE_TYPE_MISSING = "NODE_TYPE_MISSING", e3.NODE_EXTENT_INVALID = "NODE_EXTENT_INVALID", e3.EDGE_INVALID = "EDGE_INVALID", e3.EDGE_NOT_FOUND = "EDGE_NOT_FOUND", e3.EDGE_SOURCE_MISSING = "EDGE_SOURCE_MISSING", e3.EDGE_TARGET_MISSING = "EDGE_TARGET_MISSING", e3.EDGE_TYPE_MISSING = "EDGE_TYPE_MISSING", e3.EDGE_SOURCE_TARGET_SAME = "EDGE_SOURCE_TARGET_SAME", e3.EDGE_SOURCE_TARGET_MISSING = "EDGE_SOURCE_TARGET_MISSING", e3.EDGE_ORPHANED = "EDGE_ORPHANED", e3.USEVUEFLOW_OPTIONS = "USEVUEFLOW_OPTIONS", e3))(Ee || {});
const Ko = {
  MISSING_STYLES: () => "It seems that you haven't loaded the necessary styles. Please import '@vue-flow/core/dist/style.css' to ensure that the graph is rendered correctly",
  MISSING_VIEWPORT_DIMENSIONS: () => "The Vue Flow parent container needs a width and a height to render the graph",
  NODE_INVALID: (e3) => `Node is invalid
Node: ${e3}`,
  NODE_NOT_FOUND: (e3) => `Node not found
Node: ${e3}`,
  NODE_MISSING_PARENT: (e3, t) => `Node is missing a parent
Node: ${e3}
Parent: ${t}`,
  NODE_TYPE_MISSING: (e3) => `Node type is missing
Type: ${e3}`,
  NODE_EXTENT_INVALID: (e3) => `Only child nodes can use a parent extent
Node: ${e3}`,
  EDGE_INVALID: (e3) => `An edge needs a source and a target
Edge: ${e3}`,
  EDGE_SOURCE_MISSING: (e3, t) => `Edge source is missing
Edge: ${e3} 
Source: ${t}`,
  EDGE_TARGET_MISSING: (e3, t) => `Edge target is missing
Edge: ${e3} 
Target: ${t}`,
  EDGE_TYPE_MISSING: (e3) => `Edge type is missing
Type: ${e3}`,
  EDGE_SOURCE_TARGET_SAME: (e3, t, n) => `Edge source and target are the same
Edge: ${e3} 
Source: ${t} 
Target: ${n}`,
  EDGE_SOURCE_TARGET_MISSING: (e3, t, n) => `Edge source or target is missing
Edge: ${e3} 
Source: ${t} 
Target: ${n}`,
  EDGE_ORPHANED: (e3) => `Edge was orphaned (suddenly missing source or target) and has been removed
Edge: ${e3}`,
  EDGE_NOT_FOUND: (e3) => `Edge not found
Edge: ${e3}`,
  // deprecation errors
  USEVUEFLOW_OPTIONS: () => "The options parameter is deprecated and will be removed in the next major version. Please use the id parameter instead"
};
class Se extends Error {
  constructor(t, ...n) {
    var o;
    super((o = Ko[t]) == null ? void 0 : o.call(Ko, ...n)), this.name = "VueFlowError", this.code = t, this.args = n;
  }
}
function go(e3) {
  return "clientX" in e3;
}
function Ju(e3) {
  return "sourceEvent" in e3;
}
function Be(e3, t) {
  const n = go(e3);
  let o, i;
  return n ? (o = e3.clientX, i = e3.clientY) : "touches" in e3 && e3.touches.length > 0 ? (o = e3.touches[0].clientX, i = e3.touches[0].clientY) : "changedTouches" in e3 && e3.changedTouches.length > 0 ? (o = e3.changedTouches[0].clientX, i = e3.changedTouches[0].clientY) : (o = 0, i = 0), {
    x: o - (t?.left ?? 0),
    y: i - (t?.top ?? 0)
  };
}
const mn = () => {
  var e3;
  return typeof navigator < "u" && ((e3 = navigator?.userAgent) == null ? void 0 : e3.indexOf("Mac")) >= 0;
};
function ju(e3) {
  var t, n;
  return {
    width: ((t = e3.dimensions) == null ? void 0 : t.width) ?? e3.width ?? 0,
    height: ((n = e3.dimensions) == null ? void 0 : n.height) ?? e3.height ?? 0
  };
}
function En(e3, t = [1, 1]) {
  return {
    x: t[0] * Math.round(e3.x / t[0]),
    y: t[1] * Math.round(e3.y / t[1])
  };
}
const Qu = () => true;
function zn(e3) {
  e3?.classList.remove("valid", "connecting", "vue-flow__handle-valid", "vue-flow__handle-connecting");
}
function ec(e3, t, n) {
  const o = [], i = {
    x: e3.x - n,
    y: e3.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const r of t.values())
    pn(i, vn(r)) > 0 && o.push(r);
  return o;
}
const tc = 250;
function nc(e3, t, n, o) {
  var i, r;
  let l = [], a = Number.POSITIVE_INFINITY;
  const s = ec(e3, n, t + tc);
  for (const u of s) {
    const c = [...((i = u.handleBounds) == null ? void 0 : i.source) ?? [], ...((r = u.handleBounds) == null ? void 0 : r.target) ?? []];
    for (const d of c) {
      if (o.nodeId === d.nodeId && o.type === d.type && o.id === d.id)
        continue;
      const { x: f, y: g } = wt(u, d, d.position, true), b = Math.sqrt((f - e3.x) ** 2 + (g - e3.y) ** 2);
      b > t || (b < a ? (l = [{ ...d, x: f, y: g }], a = b) : b === a && l.push({ ...d, x: f, y: g }));
    }
  }
  if (!l.length)
    return null;
  if (l.length > 1) {
    const u = o.type === "source" ? "target" : "source";
    return l.find((c) => c.type === u) ?? l[0];
  }
  return l[0];
}
function qo(e3, {
  handle: t,
  connectionMode: n,
  fromNodeId: o,
  fromHandleId: i,
  fromType: r,
  doc: l,
  lib: a,
  flowId: s,
  isValidConnection: u = Qu
}, c, d, f, g) {
  const b = r === "target", x = t ? l.querySelector(`.${a}-flow__handle[data-id="${s}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: S, y: C } = Be(e3), M = l.elementFromPoint(S, C), _ = M?.classList.contains(`${a}-flow__handle`) ? M : x, N = {
    handleDomNode: _,
    isValid: false,
    connection: null,
    toHandle: null
  };
  if (_) {
    const O = rr(void 0, _), k = _.getAttribute("data-nodeid"), $ = _.getAttribute("data-handleid"), T = _.classList.contains("connectable"), W = _.classList.contains("connectableend");
    if (!k || !O)
      return N;
    const L = {
      source: b ? k : o,
      sourceHandle: b ? $ : i,
      target: b ? o : k,
      targetHandle: b ? i : $
    };
    N.connection = L;
    const w = T && W && (n === je.Strict ? b && O === "source" || !b && O === "target" : k !== o || $ !== i);
    N.isValid = w && u(L, {
      nodes: d,
      edges: c,
      sourceNode: f(L.source),
      targetNode: f(L.target)
    }), N.toHandle = lr(k, O, $, g, n, true);
  }
  return N;
}
function rr(e3, t) {
  return e3 || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function oc(e3, t) {
  let n = null;
  return t ? n = "valid" : e3 && !t && (n = "invalid"), n;
}
function ic(e3, t) {
  let n = null;
  return t ? n = true : e3 && !t && (n = false), n;
}
function lr(e3, t, n, o, i, r = false) {
  var l, a, s;
  const u = o.get(e3);
  if (!u)
    return null;
  const c = i === je.Strict ? (l = u.handleBounds) == null ? void 0 : l[t] : [...((a = u.handleBounds) == null ? void 0 : a.source) ?? [], ...((s = u.handleBounds) == null ? void 0 : s.target) ?? []], d = (n ? c?.find((f) => f.id === n) : c?.[0]) ?? null;
  return d && r ? { ...d, ...wt(u, d, d.position, true) } : d;
}
const jn = {
  [R.Left]: R.Right,
  [R.Right]: R.Left,
  [R.Top]: R.Bottom,
  [R.Bottom]: R.Top
}, rc = ["production", "prod"];
function Yt(e3, ...t) {
  ar() && console.warn(`[Vue Flow]: ${e3}`, ...t);
}
function ar() {
  return !rc.includes("development");
}
function Jo(e3, t, n, o, i) {
  const r = t.querySelectorAll(`.vue-flow__handle.${e3}`);
  return r?.length ? Array.from(r).map((l) => {
    const a = l.getBoundingClientRect();
    return {
      id: l.getAttribute("data-handleid"),
      type: e3,
      nodeId: i,
      position: l.getAttribute("data-handlepos"),
      x: (a.left - n.left) / o,
      y: (a.top - n.top) / o,
      ...xn(l)
    };
  }) : null;
}
function Qn(e3, t, n, o, i, r = false, l) {
  i.value = false, e3.selected ? (r || e3.selected && t) && (o([e3]), nextTick(() => {
    l.blur();
  })) : n([e3]);
}
function xe(e3) {
  return typeof unref(e3) < "u";
}
function lc(e3, t, n, o) {
  if (!e3 || !e3.source || !e3.target)
    return n(new Se(Ee.EDGE_INVALID, e3?.id ?? "[ID UNKNOWN]")), false;
  let i;
  return Qe(e3) ? i = e3 : i = {
    ...e3,
    id: Ji(e3)
  }, i = Ki(i, void 0, o), Ru(i, t) ? false : i;
}
function ac(e3, t, n, o, i) {
  if (!t.source || !t.target)
    return i(new Se(Ee.EDGE_INVALID, e3.id)), false;
  if (!n)
    return i(new Se(Ee.EDGE_NOT_FOUND, e3.id)), false;
  const { id: r, ...l } = e3;
  return {
    ...l,
    id: o ? Ji(t) : r,
    source: t.source,
    target: t.target,
    sourceHandle: t.sourceHandle,
    targetHandle: t.targetHandle
  };
}
function jo(e3, t, n) {
  const o = {}, i = [];
  for (let r = 0; r < e3.length; ++r) {
    const l = e3[r];
    if (!it(l)) {
      n(
        new Se(Ee.NODE_INVALID, l?.id) || `[ID UNKNOWN|INDEX ${r}]`
      );
      continue;
    }
    const a = zu(l, t(l.id), l.parentNode);
    l.parentNode && (o[l.parentNode] = true), i[r] = a;
  }
  for (const r of i) {
    const l = t(r.parentNode) || i.find((a) => a.id === r.parentNode);
    r.parentNode && !l && n(new Se(Ee.NODE_MISSING_PARENT, r.id, r.parentNode)), (r.parentNode || o[r.id]) && (o[r.id] && (r.isParent = true), l && (l.isParent = true));
  }
  return i;
}
function Qo(e3, t, n, o, i, r) {
  let l = i;
  const a = o.get(l) || /* @__PURE__ */ new Map();
  o.set(l, a.set(n, t)), l = `${i}-${e3}`;
  const s = o.get(l) || /* @__PURE__ */ new Map();
  if (o.set(l, s.set(n, t)), r) {
    l = `${i}-${e3}-${r}`;
    const u = o.get(l) || /* @__PURE__ */ new Map();
    o.set(l, u.set(n, t));
  }
}
function Bn(e3, t, n) {
  e3.clear();
  for (const o of n) {
    const { source: i, target: r, sourceHandle: l = null, targetHandle: a = null } = o, s = { edgeId: o.id, source: i, target: r, sourceHandle: l, targetHandle: a }, u = `${i}-${l}--${r}-${a}`, c = `${r}-${a}--${i}-${l}`;
    Qo("source", s, c, e3, i, l), Qo("target", s, u, e3, r, a);
  }
}
function ei(e3, t) {
  if (e3.size !== t.size)
    return false;
  for (const n of e3)
    if (!t.has(n))
      return false;
  return true;
}
function Vn(e3, t, n, o, i, r, l, a) {
  const s = [];
  for (const u of e3) {
    const c = Qe(u) ? u : lc(u, a, i, r);
    if (!c)
      continue;
    const d = n(c.source), f = n(c.target);
    if (!d || !f) {
      i(new Se(Ee.EDGE_SOURCE_TARGET_MISSING, c.id, c.source, c.target));
      continue;
    }
    if (!d) {
      i(new Se(Ee.EDGE_SOURCE_MISSING, c.id, c.source));
      continue;
    }
    if (!f) {
      i(new Se(Ee.EDGE_TARGET_MISSING, c.id, c.target));
      continue;
    }
    if (t && !t(c, {
      edges: a,
      nodes: l,
      sourceNode: d,
      targetNode: f
    })) {
      i(new Se(Ee.EDGE_INVALID, c.id));
      continue;
    }
    const g = o(c.id);
    s.push({
      ...Ki(c, g, r),
      sourceNode: d,
      targetNode: f
    });
  }
  return s;
}
const ti = /* @__PURE__ */ Symbol("vueFlow"), sr = /* @__PURE__ */ Symbol("nodeId"), ur = /* @__PURE__ */ Symbol("nodeRef"), sc = /* @__PURE__ */ Symbol("edgeId"), uc = /* @__PURE__ */ Symbol("edgeRef"), Sn = /* @__PURE__ */ Symbol("slots");
function cr(e3) {
  const {
    vueFlowRef: t,
    snapToGrid: n,
    snapGrid: o,
    noDragClassName: i,
    nodeLookup: r,
    nodeExtent: l,
    nodeDragThreshold: a,
    viewport: s,
    autoPanOnNodeDrag: u,
    autoPanSpeed: c,
    nodesDraggable: d,
    panBy: f,
    findNode: g,
    multiSelectionActive: b,
    nodesSelectionActive: x,
    selectNodesOnDrag: S,
    removeSelectedElements: C,
    addSelectedNodes: M,
    updateNodePositions: _,
    emits: N
  } = we(), { onStart: O, onDrag: k, onStop: $, onClick: T, el: W, disabled: L, id: z, selectable: w, dragHandle: J } = e3, y = shallowRef(false);
  let P = [], E, D = null, A = { x: void 0, y: void 0 }, B = { x: 0, y: 0 }, V = null, X = false, Q = false, oe = 0, le = false;
  const Y = fc(), U = ({ x: ee, y: ae }) => {
    A = { x: ee, y: ae };
    let p = false;
    if (P = P.map((h2) => {
      const m = { x: ee - h2.distance.x, y: ae - h2.distance.y }, { computedPosition: v } = ho(
        h2,
        n.value ? En(m, o.value) : m,
        N.error,
        l.value,
        h2.parentNode ? g(h2.parentNode) : void 0
      );
      return p = p || h2.position.x !== v.x || h2.position.y !== v.y, h2.position = v, h2;
    }), Q = Q || p, !!p && (_(P, true, true), y.value = true, V)) {
      const [h2, m] = On({
        id: z,
        dragItems: P,
        findNode: g
      });
      k({ event: V, node: h2, nodes: m });
    }
  }, q = () => {
    if (!D)
      return;
    const [ee, ae] = or(B, D, c.value);
    if (ee !== 0 || ae !== 0) {
      const p = {
        x: (A.x ?? 0) - ee / s.value.zoom,
        y: (A.y ?? 0) - ae / s.value.zoom
      };
      f({ x: ee, y: ae }) && U(p);
    }
    oe = requestAnimationFrame(q);
  }, ce = (ee, ae) => {
    X = true;
    const p = g(z);
    !S.value && !b.value && p && (p.selected || C()), p && toValue(w) && S.value && Qn(
      p,
      b.value,
      M,
      C,
      x,
      false,
      ae
    );
    const h2 = Y(ee.sourceEvent);
    if (A = h2, P = Xu(r.value, d.value, h2, z), P.length) {
      const [m, v] = On({
        id: z,
        dragItems: P,
        findNode: g
      });
      O({ event: ee.sourceEvent, node: m, nodes: v });
    }
  }, re = (ee, ae) => {
    var p;
    ee.sourceEvent.type === "touchmove" && ee.sourceEvent.touches.length > 1 || (Q = false, a.value === 0 && ce(ee, ae), A = Y(ee.sourceEvent), D = ((p = t.value) == null ? void 0 : p.getBoundingClientRect()) || null, B = Be(ee.sourceEvent, D));
  }, se = (ee, ae) => {
    const p = Y(ee.sourceEvent);
    if (!le && X && u.value && (le = true, q()), !X) {
      const h2 = p.xSnapped - (A.x ?? 0), m = p.ySnapped - (A.y ?? 0);
      Math.sqrt(h2 * h2 + m * m) > a.value && ce(ee, ae);
    }
    (A.x !== p.xSnapped || A.y !== p.ySnapped) && P.length && X && (V = ee.sourceEvent, B = Be(ee.sourceEvent, D), U(p));
  }, ge = (ee) => {
    let ae = false;
    if (!X && !y.value && !b.value) {
      const p = ee.sourceEvent, h2 = Y(p), m = h2.xSnapped - (A.x ?? 0), v = h2.ySnapped - (A.y ?? 0), I = Math.sqrt(m * m + v * v);
      I !== 0 && I <= a.value && (T?.(p), ae = true);
    }
    if (P.length && !ae) {
      Q && (_(P, false, false), Q = false);
      const [p, h2] = On({
        id: z,
        dragItems: P,
        findNode: g
      });
      $({ event: ee.sourceEvent, node: p, nodes: h2 });
    }
    P = [], y.value = false, le = false, X = false, A = { x: void 0, y: void 0 }, cancelAnimationFrame(oe);
  };
  return watch([() => toValue(L), W], ([ee, ae], p, h2) => {
    if (ae) {
      const m = ke(ae);
      ee || (E = Oa().on("start", (v) => re(v, ae)).on("drag", (v) => se(v, ae)).on("end", (v) => ge(v)).filter((v) => {
        const I = v.target, G = toValue(J);
        return !v.button && (!i.value || !Zo(I, `.${i.value}`, ae) && (!G || Zo(I, G, ae)));
      }), m.call(E)), h2(() => {
        m.on(".drag", null), E && (E.on("start", null), E.on("drag", null), E.on("end", null));
      });
    }
  }), y;
}
function cc() {
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
function dc(e3, t) {
  const n = cc();
  return n.doubleClick.on((o) => {
    var i, r;
    t.edgeDoubleClick(o), (r = (i = e3.events) == null ? void 0 : i.doubleClick) == null || r.call(i, o);
  }), n.click.on((o) => {
    var i, r;
    t.edgeClick(o), (r = (i = e3.events) == null ? void 0 : i.click) == null || r.call(i, o);
  }), n.mouseEnter.on((o) => {
    var i, r;
    t.edgeMouseEnter(o), (r = (i = e3.events) == null ? void 0 : i.mouseEnter) == null || r.call(i, o);
  }), n.mouseMove.on((o) => {
    var i, r;
    t.edgeMouseMove(o), (r = (i = e3.events) == null ? void 0 : i.mouseMove) == null || r.call(i, o);
  }), n.mouseLeave.on((o) => {
    var i, r;
    t.edgeMouseLeave(o), (r = (i = e3.events) == null ? void 0 : i.mouseLeave) == null || r.call(i, o);
  }), n.contextMenu.on((o) => {
    var i, r;
    t.edgeContextMenu(o), (r = (i = e3.events) == null ? void 0 : i.contextMenu) == null || r.call(i, o);
  }), n.updateStart.on((o) => {
    var i, r;
    t.edgeUpdateStart(o), (r = (i = e3.events) == null ? void 0 : i.updateStart) == null || r.call(i, o);
  }), n.update.on((o) => {
    var i, r;
    t.edgeUpdate(o), (r = (i = e3.events) == null ? void 0 : i.update) == null || r.call(i, o);
  }), n.updateEnd.on((o) => {
    var i, r;
    t.edgeUpdateEnd(o), (r = (i = e3.events) == null ? void 0 : i.updateEnd) == null || r.call(i, o);
  }), Object.entries(n).reduce(
    (o, [i, r]) => (o.emit[i] = r.trigger, o.on[i] = r.on, o),
    { emit: {}, on: {} }
  );
}
function fc() {
  const { viewport: e3, snapGrid: t, snapToGrid: n, vueFlowRef: o } = we();
  return (i) => {
    var r;
    const l = ((r = o.value) == null ? void 0 : r.getBoundingClientRect()) ?? { left: 0, top: 0 }, a = Ju(i) ? i.sourceEvent : i, { x: s, y: u } = Be(a, l), c = Rt({ x: s, y: u }, e3.value), { x: d, y: f } = n.value ? En(c, t.value) : c;
    return {
      xSnapped: d,
      ySnapped: f,
      ...c
    };
  };
}
function qt() {
  return true;
}
function dr({
  handleId: e3,
  nodeId: t,
  type: n,
  isValidConnection: o,
  edgeUpdaterType: i,
  onEdgeUpdate: r,
  onEdgeUpdateEnd: l
}) {
  const {
    id: a,
    vueFlowRef: s,
    connectionMode: u,
    connectionRadius: c,
    connectOnClick: d,
    connectionClickStartHandle: f,
    nodesConnectable: g,
    autoPanOnConnect: b,
    autoPanSpeed: x,
    findNode: S,
    panBy: C,
    startConnection: M,
    updateConnection: _,
    endConnection: N,
    emits: O,
    viewport: k,
    edges: $,
    nodes: T,
    isValidConnection: W,
    nodeLookup: L
  } = we();
  let z = null, w = false, J = null;
  function y(E) {
    var D;
    const A = toValue(n) === "target", B = go(E), V = Vo(E.target), X = E.currentTarget;
    if (X && (B && E.button === 0 || !B)) {
      let Q = function(K) {
        p = Be(K, ge), U = nc(
          Rt(p, k.value, false, [1, 1]),
          c.value,
          L.value,
          v
        ), h2 || (m(), h2 = true);
        const ie = qo(
          K,
          {
            handle: U,
            connectionMode: u.value,
            fromNodeId: toValue(t),
            fromHandleId: toValue(e3),
            fromType: A ? "target" : "source",
            isValidConnection: Y,
            doc: V,
            lib: "vue",
            flowId: a,
            nodeLookup: L.value
          },
          $.value,
          T.value,
          S,
          L.value
        );
        J = ie.handleDomNode, z = ie.connection, w = ic(!!U, ie.isValid);
        const de = {
          // from stays the same
          ...F,
          isValid: w,
          to: ie.toHandle && w ? Vt({ x: ie.toHandle.x, y: ie.toHandle.y }, k.value) : p,
          toHandle: ie.toHandle,
          toPosition: w && ie.toHandle ? ie.toHandle.position : jn[v.position],
          toNode: ie.toHandle ? L.value.get(ie.toHandle.nodeId) : null
        };
        if (w && U && F?.toHandle && de.toHandle && F.toHandle.type === de.toHandle.type && F.toHandle.nodeId === de.toHandle.nodeId && F.toHandle.id === de.toHandle.id && F.to.x === de.to.x && F.to.y === de.to.y)
          return;
        const he = U ?? ie.toHandle;
        if (_(
          he && w ? Vt(
            {
              x: he.x,
              y: he.y
            },
            k.value
          ) : p,
          he,
          oc(!!he, w)
        ), F = de, !U && !w && !J)
          return zn(ae);
        z && z.source !== z.target && J && (zn(ae), ae = J, J.classList.add("connecting", "vue-flow__handle-connecting"), J.classList.toggle("valid", !!w), J.classList.toggle("vue-flow__handle-valid", !!w));
      }, oe = function(K) {
        "touches" in K && K.touches.length > 0 || ((U || J) && z && w && (r ? r(K, z) : O.connect(z)), O.connectEnd(K), i && l?.(K), zn(ae), cancelAnimationFrame(q), N(K), h2 = false, w = false, z = null, J = null, V.removeEventListener("mousemove", Q), V.removeEventListener("mouseup", oe), V.removeEventListener("touchmove", Q), V.removeEventListener("touchend", oe));
      };
      const le = S(toValue(t));
      let Y = toValue(o) || W.value || qt;
      !Y && le && (Y = (A ? le.isValidSourcePos : le.isValidTargetPos) || qt);
      let U, q = 0;
      const { x: ce, y: re } = Be(E), se = rr(toValue(i), X), ge = (D = s.value) == null ? void 0 : D.getBoundingClientRect();
      if (!ge || !se)
        return;
      const ee = lr(toValue(t), se, toValue(e3), L.value, u.value);
      if (!ee)
        return;
      let ae, p = Be(E, ge), h2 = false;
      const m = () => {
        if (!b.value)
          return;
        const [K, ie] = or(p, ge, x.value);
        C({ x: K, y: ie }), q = requestAnimationFrame(m);
      }, v = {
        ...ee,
        nodeId: toValue(t),
        type: se,
        position: ee.position
      }, I = L.value.get(toValue(t)), Z = {
        inProgress: true,
        isValid: null,
        from: wt(I, v, R.Left, true),
        fromHandle: v,
        fromPosition: v.position,
        fromNode: I,
        to: p,
        toHandle: null,
        toPosition: jn[v.position],
        toNode: null
      };
      M(
        {
          nodeId: toValue(t),
          id: toValue(e3),
          type: se,
          position: X?.getAttribute("data-handlepos") || R.Top,
          ...p
        },
        {
          x: ce - ge.left,
          y: re - ge.top
        }
      ), O.connectStart({ event: E, nodeId: toValue(t), handleId: toValue(e3), handleType: se });
      let F = Z;
      V.addEventListener("mousemove", Q), V.addEventListener("mouseup", oe), V.addEventListener("touchmove", Q), V.addEventListener("touchend", oe);
    }
  }
  function P(E) {
    var D, A;
    if (!d.value)
      return;
    const B = toValue(n) === "target";
    if (!f.value) {
      O.clickConnectStart({ event: E, nodeId: toValue(t), handleId: toValue(e3) }), M(
        {
          nodeId: toValue(t),
          type: toValue(n),
          id: toValue(e3),
          position: R.Top,
          ...Be(E)
        },
        void 0,
        true
      );
      return;
    }
    let V = toValue(o) || W.value || qt;
    const X = S(toValue(t));
    if (!V && X && (V = (B ? X.isValidSourcePos : X.isValidTargetPos) || qt), X && (typeof X.connectable > "u" ? g.value : X.connectable) === false)
      return;
    const Q = Vo(E.target), oe = qo(
      E,
      {
        handle: {
          nodeId: toValue(t),
          id: toValue(e3),
          type: toValue(n),
          position: R.Top,
          ...Be(E)
        },
        connectionMode: u.value,
        fromNodeId: f.value.nodeId,
        fromHandleId: f.value.id ?? null,
        fromType: f.value.type,
        isValidConnection: V,
        doc: Q,
        lib: "vue",
        flowId: a,
        nodeLookup: L.value
      },
      $.value,
      T.value,
      S,
      L.value
    ), le = ((D = oe.connection) == null ? void 0 : D.source) === ((A = oe.connection) == null ? void 0 : A.target);
    oe.isValid && oe.connection && !le && O.connect(oe.connection), O.clickConnectEnd(E), N(E, true);
  }
  return {
    handlePointerDown: y,
    handleClick: P
  };
}
function hc() {
  return inject(sr, "");
}
function fr(e3) {
  const t = e3 ?? hc() ?? "", n = inject(ur, ref(null)), { findNode: o, edges: i, emits: r } = we(), l = o(t);
  return l || r.error(new Se(Ee.NODE_NOT_FOUND, t)), {
    id: t,
    nodeEl: n,
    node: l,
    parentNode: computed(() => o(l.parentNode)),
    connectedEdges: computed(() => tr([l], i.value))
  };
}
function gc() {
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
function vc(e3, t) {
  const n = gc();
  return n.doubleClick.on((o) => {
    var i, r;
    t.nodeDoubleClick(o), (r = (i = e3.events) == null ? void 0 : i.doubleClick) == null || r.call(i, o);
  }), n.click.on((o) => {
    var i, r;
    t.nodeClick(o), (r = (i = e3.events) == null ? void 0 : i.click) == null || r.call(i, o);
  }), n.mouseEnter.on((o) => {
    var i, r;
    t.nodeMouseEnter(o), (r = (i = e3.events) == null ? void 0 : i.mouseEnter) == null || r.call(i, o);
  }), n.mouseMove.on((o) => {
    var i, r;
    t.nodeMouseMove(o), (r = (i = e3.events) == null ? void 0 : i.mouseMove) == null || r.call(i, o);
  }), n.mouseLeave.on((o) => {
    var i, r;
    t.nodeMouseLeave(o), (r = (i = e3.events) == null ? void 0 : i.mouseLeave) == null || r.call(i, o);
  }), n.contextMenu.on((o) => {
    var i, r;
    t.nodeContextMenu(o), (r = (i = e3.events) == null ? void 0 : i.contextMenu) == null || r.call(i, o);
  }), n.dragStart.on((o) => {
    var i, r;
    t.nodeDragStart(o), (r = (i = e3.events) == null ? void 0 : i.dragStart) == null || r.call(i, o);
  }), n.drag.on((o) => {
    var i, r;
    t.nodeDrag(o), (r = (i = e3.events) == null ? void 0 : i.drag) == null || r.call(i, o);
  }), n.dragStop.on((o) => {
    var i, r;
    t.nodeDragStop(o), (r = (i = e3.events) == null ? void 0 : i.dragStop) == null || r.call(i, o);
  }), Object.entries(n).reduce(
    (o, [i, r]) => (o.emit[i] = r.trigger, o.on[i] = r.on, o),
    { emit: {}, on: {} }
  );
}
function hr() {
  const { getSelectedNodes: e3, nodeExtent: t, updateNodePositions: n, findNode: o, snapGrid: i, snapToGrid: r, nodesDraggable: l, emits: a } = we();
  return (s, u = false) => {
    const c = r.value ? i.value[0] : 5, d = r.value ? i.value[1] : 5, f = u ? 4 : 1, g = s.x * c * f, b = s.y * d * f, x = [];
    for (const S of e3.value)
      if (S.draggable || l && typeof S.draggable > "u") {
        const C = { x: S.computedPosition.x + g, y: S.computedPosition.y + b }, { position: M } = ho(
          S,
          C,
          a.error,
          t.value,
          S.parentNode ? o(S.parentNode) : void 0
        );
        x.push({
          id: S.id,
          position: M,
          from: S.position,
          distance: { x: s.x, y: s.y },
          dimensions: S.dimensions
        });
      }
    n(x, true, false);
  };
}
const Jt = 0.1, pc = (e3) => ((e3 *= 2) <= 1 ? e3 * e3 * e3 : (e3 -= 2) * e3 * e3 + 2) / 2;
function Ze() {
  return Yt("Viewport not initialized yet."), Promise.resolve(false);
}
const mc = {
  zoomIn: Ze,
  zoomOut: Ze,
  zoomTo: Ze,
  fitView: Ze,
  setCenter: Ze,
  fitBounds: Ze,
  project: (e3) => e3,
  screenToFlowCoordinate: (e3) => e3,
  flowToScreenCoordinate: (e3) => e3,
  setViewport: Ze,
  setTransform: Ze,
  getViewport: () => ({ x: 0, y: 0, zoom: 1 }),
  getTransform: () => ({ x: 0, y: 0, zoom: 1 }),
  viewportInitialized: false
};
function yc(e3) {
  function t(o, i) {
    return new Promise((r) => {
      e3.d3Selection && e3.d3Zoom ? e3.d3Zoom.interpolate(i?.interpolate === "linear" ? Pt : nn).scaleBy(
        Rn(e3.d3Selection, i?.duration, i?.ease, () => {
          r(true);
        }),
        o
      ) : r(false);
    });
  }
  function n(o, i, r, l) {
    return new Promise((a) => {
      var s;
      const { x: u, y: c } = Wi({ x: -o, y: -i }, e3.translateExtent), d = _t.translate(-u, -c).scale(r);
      e3.d3Selection && e3.d3Zoom ? (s = e3.d3Zoom) == null || s.interpolate(l?.interpolate === "linear" ? Pt : nn).transform(
        Rn(e3.d3Selection, l?.duration, l?.ease, () => {
          a(true);
        }),
        d
      ) : a(false);
    });
  }
  return computed(() => e3.d3Zoom && e3.d3Selection && e3.dimensions.width && e3.dimensions.height ? {
    viewportInitialized: true,
    // todo: allow passing scale as option
    zoomIn: (i) => t(1.2, i),
    zoomOut: (i) => t(1 / 1.2, i),
    zoomTo: (i, r) => new Promise((l) => {
      e3.d3Selection && e3.d3Zoom ? e3.d3Zoom.interpolate(r?.interpolate === "linear" ? Pt : nn).scaleTo(
        Rn(e3.d3Selection, r?.duration, r?.ease, () => {
          l(true);
        }),
        i
      ) : l(false);
    }),
    setViewport: (i, r) => n(i.x, i.y, i.zoom, r),
    setTransform: (i, r) => n(i.x, i.y, i.zoom, r),
    getViewport: () => ({
      x: e3.viewport.x,
      y: e3.viewport.y,
      zoom: e3.viewport.zoom
    }),
    getTransform: () => ({
      x: e3.viewport.x,
      y: e3.viewport.y,
      zoom: e3.viewport.zoom
    }),
    fitView: (i = {
      padding: Jt,
      includeHiddenNodes: false,
      duration: 0
    }) => {
      var r, l;
      const a = [];
      for (const f of e3.nodes)
        f.dimensions.width && f.dimensions.height && (i?.includeHiddenNodes || !f.hidden) && (!((r = i.nodes) != null && r.length) || (l = i.nodes) != null && l.length && i.nodes.includes(f.id)) && a.push(f);
      if (!a.length)
        return Promise.resolve(false);
      const s = Qi(a), { x: u, y: c, zoom: d } = Ro(
        s,
        e3.dimensions.width,
        e3.dimensions.height,
        i.minZoom ?? e3.minZoom,
        i.maxZoom ?? e3.maxZoom,
        i.padding ?? Jt
      );
      return n(u, c, d, i);
    },
    setCenter: (i, r, l) => {
      const a = typeof l?.zoom < "u" ? l.zoom : e3.maxZoom, s = e3.dimensions.width / 2 - i * a, u = e3.dimensions.height / 2 - r * a;
      return n(s, u, a, l);
    },
    fitBounds: (i, r = { padding: Jt }) => {
      const { x: l, y: a, zoom: s } = Ro(
        i,
        e3.dimensions.width,
        e3.dimensions.height,
        e3.minZoom,
        e3.maxZoom,
        r.padding ?? Jt
      );
      return n(l, a, s, r);
    },
    project: (i) => Rt(i, e3.viewport, e3.snapToGrid, e3.snapGrid),
    screenToFlowCoordinate: (i) => {
      if (e3.vueFlowRef) {
        const { x: r, y: l } = e3.vueFlowRef.getBoundingClientRect(), a = {
          x: i.x - r,
          y: i.y - l
        };
        return Rt(a, e3.viewport, e3.snapToGrid, e3.snapGrid);
      }
      return { x: 0, y: 0 };
    },
    flowToScreenCoordinate: (i) => {
      if (e3.vueFlowRef) {
        const { x: r, y: l } = e3.vueFlowRef.getBoundingClientRect(), a = {
          x: i.x + r,
          y: i.y + l
        };
        return Vt(a, e3.viewport);
      }
      return { x: 0, y: 0 };
    }
  } : mc);
}
function Rn(e3, t = 0, n = pc, o = () => {
}) {
  const i = typeof t == "number" && t > 0;
  return i || o(), i ? e3.transition().duration(t).ease(n).on("end", o) : e3;
}
function _c(e3, t, n) {
  const o = effectScope(true);
  return o.run(() => {
    const i = () => {
      o.run(() => {
        let x, S, C = !!(n.nodes.value.length || n.edges.value.length);
        x = st([e3.modelValue, () => {
          var M, _;
          return (_ = (M = e3.modelValue) == null ? void 0 : M.value) == null ? void 0 : _.length;
        }], ([M]) => {
          M && Array.isArray(M) && (S?.pause(), n.setElements(M), !S && !C && M.length ? C = true : S?.resume());
        }), S = st(
          [n.nodes, n.edges, () => n.edges.value.length, () => n.nodes.value.length],
          ([M, _]) => {
            var N;
            (N = e3.modelValue) != null && N.value && Array.isArray(e3.modelValue.value) && (x?.pause(), e3.modelValue.value = [...M, ..._], nextTick(() => {
              x?.resume();
            }));
          },
          { immediate: C }
        ), onScopeDispose(() => {
          x?.stop(), S?.stop();
        });
      });
    }, r = () => {
      o.run(() => {
        let x, S, C = !!n.nodes.value.length;
        x = st([e3.nodes, () => {
          var M, _;
          return (_ = (M = e3.nodes) == null ? void 0 : M.value) == null ? void 0 : _.length;
        }], ([M]) => {
          M && Array.isArray(M) && (S?.pause(), n.setNodes(M), !S && !C && M.length ? C = true : S?.resume());
        }), S = st(
          [n.nodes, () => n.nodes.value.length],
          ([M]) => {
            var _;
            (_ = e3.nodes) != null && _.value && Array.isArray(e3.nodes.value) && (x?.pause(), e3.nodes.value = [...M], nextTick(() => {
              x?.resume();
            }));
          },
          { immediate: C }
        ), onScopeDispose(() => {
          x?.stop(), S?.stop();
        });
      });
    }, l = () => {
      o.run(() => {
        let x, S, C = !!n.edges.value.length;
        x = st([e3.edges, () => {
          var M, _;
          return (_ = (M = e3.edges) == null ? void 0 : M.value) == null ? void 0 : _.length;
        }], ([M]) => {
          M && Array.isArray(M) && (S?.pause(), n.setEdges(M), !S && !C && M.length ? C = true : S?.resume());
        }), S = st(
          [n.edges, () => n.edges.value.length],
          ([M]) => {
            var _;
            (_ = e3.edges) != null && _.value && Array.isArray(e3.edges.value) && (x?.pause(), e3.edges.value = [...M], nextTick(() => {
              x?.resume();
            }));
          },
          { immediate: C }
        ), onScopeDispose(() => {
          x?.stop(), S?.stop();
        });
      });
    }, a = () => {
      o.run(() => {
        watch(
          () => t.maxZoom,
          () => {
            t.maxZoom && xe(t.maxZoom) && n.setMaxZoom(t.maxZoom);
          },
          {
            immediate: true
          }
        );
      });
    }, s = () => {
      o.run(() => {
        watch(
          () => t.minZoom,
          () => {
            t.minZoom && xe(t.minZoom) && n.setMinZoom(t.minZoom);
          },
          { immediate: true }
        );
      });
    }, u = () => {
      o.run(() => {
        watch(
          () => t.translateExtent,
          () => {
            t.translateExtent && xe(t.translateExtent) && n.setTranslateExtent(t.translateExtent);
          },
          {
            immediate: true
          }
        );
      });
    }, c = () => {
      o.run(() => {
        watch(
          () => t.nodeExtent,
          () => {
            t.nodeExtent && xe(t.nodeExtent) && n.setNodeExtent(t.nodeExtent);
          },
          {
            immediate: true
          }
        );
      });
    }, d = () => {
      o.run(() => {
        watch(
          () => t.applyDefault,
          () => {
            xe(t.applyDefault) && (n.applyDefault.value = t.applyDefault);
          },
          {
            immediate: true
          }
        );
      });
    }, f = () => {
      o.run(() => {
        const x = async (S) => {
          let C = S;
          typeof t.autoConnect == "function" && (C = await t.autoConnect(S)), C !== false && n.addEdges([C]);
        };
        watch(
          () => t.autoConnect,
          () => {
            xe(t.autoConnect) && (n.autoConnect.value = t.autoConnect);
          },
          { immediate: true }
        ), watch(
          n.autoConnect,
          (S, C, M) => {
            S ? n.onConnect(x) : n.hooks.value.connect.off(x), M(() => {
              n.hooks.value.connect.off(x);
            });
          },
          { immediate: true }
        );
      });
    }, g = () => {
      const x = [
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
      for (const S of Object.keys(t)) {
        const C = S;
        if (!x.includes(C)) {
          const M = toRef(() => t[C]), _ = n[C];
          isRef(_) && o.run(() => {
            watch(
              M,
              (N) => {
                xe(N) && (_.value = N);
              },
              { immediate: true }
            );
          });
        }
      }
    };
    i(), r(), l(), s(), a(), u(), c(), d(), f(), g();
  }), () => o.stop();
}
function wc() {
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
    init: H(),
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
    error: H((e3) => Yt(e3.message))
  };
}
function bc(e3, t) {
  const n = getCurrentInstance();
  onBeforeMount(() => {
    for (const [i, r] of Object.entries(t.value)) {
      const l = (a) => {
        e3(i, a);
      };
      r.setEmitter(l), Dt(r.removeEmitter), r.setHasEmitListeners(() => o(i)), Dt(r.removeHasEmitListeners);
    }
  });
  function o(i) {
    var r;
    const l = xc(i);
    return !!((r = n?.vnode.props) == null ? void 0 : r[l]);
  }
}
function xc(e3) {
  const [t, ...n] = e3.split(":");
  return `on${t.replace(/(?:^|-)(\w)/g, (i, r) => r.toUpperCase())}${n.length ? `:${n.join(":")}` : ""}`;
}
function gr() {
  return {
    vueFlowRef: null,
    viewportRef: null,
    nodes: [],
    edges: [],
    connectionLookup: /* @__PURE__ */ new Map(),
    nodeTypes: {},
    edgeTypes: {},
    initialized: false,
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
    selectionMode: fo.Full,
    paneDragging: false,
    preventScrolling: true,
    zoomOnScroll: true,
    zoomOnPinch: true,
    zoomOnDoubleClick: true,
    panOnScroll: false,
    panOnScrollSpeed: 0.5,
    panOnScrollMode: $t.Free,
    paneClickDistance: 0,
    panOnDrag: true,
    edgeUpdaterRadius: 10,
    onlyRenderVisibleElements: false,
    defaultViewport: { x: 0, y: 0, zoom: 1 },
    nodesSelectionActive: false,
    userSelectionActive: false,
    userSelectionRect: null,
    defaultMarkerColor: "#b1b1b7",
    connectionLineStyle: {},
    connectionLineType: null,
    connectionLineOptions: {
      type: et.Bezier,
      style: {}
    },
    connectionMode: je.Loose,
    connectionStartHandle: null,
    connectionEndHandle: null,
    connectionClickStartHandle: null,
    connectionPosition: { x: Number.NaN, y: Number.NaN },
    connectionRadius: 20,
    connectOnClick: true,
    connectionStatus: null,
    isValidConnection: null,
    snapGrid: [15, 15],
    snapToGrid: false,
    edgesUpdatable: false,
    edgesFocusable: true,
    nodesFocusable: true,
    nodesConnectable: true,
    nodesDraggable: true,
    nodeDragThreshold: 1,
    elementsSelectable: true,
    selectNodesOnDrag: true,
    multiSelectionActive: false,
    selectionKeyCode: "Shift",
    multiSelectionKeyCode: mn() ? "Meta" : "Control",
    zoomActivationKeyCode: mn() ? "Meta" : "Control",
    deleteKeyCode: "Backspace",
    panActivationKeyCode: "Space",
    hooks: wc(),
    applyDefault: true,
    autoConnect: false,
    fitViewOnInit: false,
    fitViewOnInitDone: false,
    noDragClassName: "nodrag",
    noWheelClassName: "nowheel",
    noPanClassName: "nopan",
    defaultEdgeOptions: void 0,
    elevateEdgesOnSelect: false,
    elevateNodesOnSelect: true,
    autoPanOnNodeDrag: true,
    autoPanOnConnect: true,
    autoPanSpeed: 15,
    disableKeyboardA11y: false,
    ariaLiveMessage: ""
  };
}
const Ec = [
  "id",
  "vueFlowRef",
  "viewportRef",
  "initialized",
  "modelValue",
  "nodes",
  "edges",
  "maxZoom",
  "minZoom",
  "translateExtent",
  "hooks",
  "defaultEdgeOptions"
];
function Sc(e3, t, n) {
  const o = yc(e3), i = (p) => {
    const h2 = p ?? [];
    e3.hooks.updateNodeInternals.trigger(h2);
  }, r = (p) => Vu(p, e3.nodes, e3.edges), l = (p) => Bu(p, e3.nodes, e3.edges), a = (p) => tr(p, e3.edges), s = ({ id: p, type: h2, nodeId: m }) => {
    var v;
    const I = p ? `-${h2}-${p}` : `-${h2}`;
    return Array.from(((v = e3.connectionLookup.get(`${m}${I}`)) == null ? void 0 : v.values()) ?? []);
  }, u = (p) => {
    if (p)
      return t.value.get(p);
  }, c = (p) => {
    if (p)
      return n.value.get(p);
  }, d = (p, h2, m) => {
    var v, I;
    const G = [];
    for (const Z of p) {
      const F = {
        id: Z.id,
        type: "position",
        dragging: m,
        from: Z.from
      };
      if (h2 && (F.position = Z.position, Z.parentNode)) {
        const K = u(Z.parentNode);
        F.position = {
          x: F.position.x - (((v = K?.computedPosition) == null ? void 0 : v.x) ?? 0),
          y: F.position.y - (((I = K?.computedPosition) == null ? void 0 : I.y) ?? 0)
        };
      }
      G.push(F);
    }
    G?.length && e3.hooks.nodesChange.trigger(G);
  }, f = (p) => {
    if (!e3.vueFlowRef)
      return;
    const h2 = e3.vueFlowRef.querySelector(".vue-flow__transformationpane");
    if (!h2)
      return;
    const m = window.getComputedStyle(h2), { m22: v } = new window.DOMMatrixReadOnly(m.transform), I = [];
    for (const G of p) {
      const Z = G, F = u(Z.id);
      if (F) {
        const K = xn(Z.nodeElement);
        if (!!(K.width && K.height && (F.dimensions.width !== K.width || F.dimensions.height !== K.height || Z.forceUpdate))) {
          const de = Z.nodeElement.getBoundingClientRect();
          F.dimensions = K, F.handleBounds.source = Jo("source", Z.nodeElement, de, v, F.id), F.handleBounds.target = Jo("target", Z.nodeElement, de, v, F.id), I.push({
            id: F.id,
            type: "dimensions",
            dimensions: K
          });
        }
      }
    }
    !e3.fitViewOnInitDone && e3.fitViewOnInit && o.value.fitView().then(() => {
      e3.fitViewOnInitDone = true;
    }), I.length && e3.hooks.nodesChange.trigger(I);
  }, g = (p, h2) => {
    const m = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set();
    for (const Z of p)
      it(Z) ? m.add(Z.id) : Qe(Z) && v.add(Z.id);
    const I = Ke(t.value, m, true), G = Ke(n.value, v);
    if (e3.multiSelectionActive) {
      for (const Z of m)
        I.push(We(Z, h2));
      for (const Z of v)
        G.push(We(Z, h2));
    }
    I.length && e3.hooks.nodesChange.trigger(I), G.length && e3.hooks.edgesChange.trigger(G);
  }, b = (p) => {
    if (e3.multiSelectionActive) {
      const h2 = p.map((m) => We(m.id, true));
      e3.hooks.nodesChange.trigger(h2);
      return;
    }
    e3.hooks.nodesChange.trigger(Ke(t.value, new Set(p.map((h2) => h2.id)), true)), e3.hooks.edgesChange.trigger(Ke(n.value));
  }, x = (p) => {
    if (e3.multiSelectionActive) {
      const h2 = p.map((m) => We(m.id, true));
      e3.hooks.edgesChange.trigger(h2);
      return;
    }
    e3.hooks.edgesChange.trigger(Ke(n.value, new Set(p.map((h2) => h2.id)))), e3.hooks.nodesChange.trigger(Ke(t.value, /* @__PURE__ */ new Set(), true));
  }, S = (p) => {
    g(p, true);
  }, C = (p) => {
    const m = (p || e3.nodes).map((v) => (v.selected = false, We(v.id, false)));
    e3.hooks.nodesChange.trigger(m);
  }, M = (p) => {
    const m = (p || e3.edges).map((v) => (v.selected = false, We(v.id, false)));
    e3.hooks.edgesChange.trigger(m);
  }, _ = (p) => {
    if (!p || !p.length)
      return g([], false);
    const h2 = p.reduce(
      (m, v) => {
        const I = We(v.id, false);
        return it(v) ? m.nodes.push(I) : m.edges.push(I), m;
      },
      { nodes: [], edges: [] }
    );
    h2.nodes.length && e3.hooks.nodesChange.trigger(h2.nodes), h2.edges.length && e3.hooks.edgesChange.trigger(h2.edges);
  }, N = (p) => {
    var h2;
    (h2 = e3.d3Zoom) == null || h2.scaleExtent([p, e3.maxZoom]), e3.minZoom = p;
  }, O = (p) => {
    var h2;
    (h2 = e3.d3Zoom) == null || h2.scaleExtent([e3.minZoom, p]), e3.maxZoom = p;
  }, k = (p) => {
    var h2;
    (h2 = e3.d3Zoom) == null || h2.translateExtent(p), e3.translateExtent = p;
  }, $ = (p) => {
    e3.nodeExtent = p, i();
  }, T = (p) => {
    var h2;
    (h2 = e3.d3Zoom) == null || h2.clickDistance(p);
  }, W = (p) => {
    e3.nodesDraggable = p, e3.nodesConnectable = p, e3.elementsSelectable = p;
  }, L = (p) => {
    const h2 = p instanceof Function ? p(e3.nodes) : p;
    !e3.initialized && !h2.length || (e3.nodes = jo(h2, u, e3.hooks.error.trigger));
  }, z = (p) => {
    const h2 = p instanceof Function ? p(e3.edges) : p;
    if (!e3.initialized && !h2.length)
      return;
    const m = Vn(
      h2,
      e3.isValidConnection,
      u,
      c,
      e3.hooks.error.trigger,
      e3.defaultEdgeOptions,
      e3.nodes,
      e3.edges
    );
    Bn(e3.connectionLookup, n.value, m), e3.edges = m;
  }, w = (p) => {
    const h2 = p instanceof Function ? p([...e3.nodes, ...e3.edges]) : p;
    !e3.initialized && !h2.length || (L(h2.filter(it)), z(h2.filter(Qe)));
  }, J = (p) => {
    let h2 = p instanceof Function ? p(e3.nodes) : p;
    h2 = Array.isArray(h2) ? h2 : [h2];
    const m = jo(h2, u, e3.hooks.error.trigger), v = [];
    for (const I of m)
      v.push(Yo(I));
    v.length && e3.hooks.nodesChange.trigger(v);
  }, y = (p) => {
    let h2 = p instanceof Function ? p(e3.edges) : p;
    h2 = Array.isArray(h2) ? h2 : [h2];
    const m = Vn(
      h2,
      e3.isValidConnection,
      u,
      c,
      e3.hooks.error.trigger,
      e3.defaultEdgeOptions,
      e3.nodes,
      e3.edges
    ), v = [];
    for (const I of m)
      v.push(Yo(I));
    v.length && e3.hooks.edgesChange.trigger(v);
  }, P = (p, h2 = true, m = false) => {
    const v = p instanceof Function ? p(e3.nodes) : p, I = Array.isArray(v) ? v : [v], G = [], Z = [];
    function F(ie) {
      const de = a(ie);
      for (const he of de)
        (!xe(he.deletable) || he.deletable) && Z.push(Xo(he.id, he.source, he.target, he.sourceHandle, he.targetHandle));
    }
    function K(ie) {
      const de = [];
      for (const he of e3.nodes)
        he.parentNode === ie && de.push(he);
      if (de.length) {
        for (const he of de)
          G.push(Go(he.id));
        h2 && F(de);
        for (const he of de)
          K(he.id);
      }
    }
    for (const ie of I) {
      const de = typeof ie == "string" ? u(ie) : ie;
      de && (xe(de.deletable) && !de.deletable || (G.push(Go(de.id)), h2 && F([de]), m && K(de.id)));
    }
    Z.length && e3.hooks.edgesChange.trigger(Z), G.length && e3.hooks.nodesChange.trigger(G);
  }, E = (p) => {
    const h2 = p instanceof Function ? p(e3.edges) : p, m = Array.isArray(h2) ? h2 : [h2], v = [];
    for (const I of m) {
      const G = typeof I == "string" ? c(I) : I;
      G && (xe(G.deletable) && !G.deletable || v.push(
        Xo(
          typeof I == "string" ? I : I.id,
          G.source,
          G.target,
          G.sourceHandle,
          G.targetHandle
        )
      ));
    }
    e3.hooks.edgesChange.trigger(v);
  }, D = (p, h2, m = true) => {
    const v = c(p.id);
    if (!v)
      return false;
    const I = e3.edges.indexOf(v), G = ac(p, h2, v, m, e3.hooks.error.trigger);
    if (G) {
      const [Z] = Vn(
        [G],
        e3.isValidConnection,
        u,
        c,
        e3.hooks.error.trigger,
        e3.defaultEdgeOptions,
        e3.nodes,
        e3.edges
      );
      return e3.edges = e3.edges.map((F, K) => K === I ? Z : F), Bn(e3.connectionLookup, n.value, [Z]), Z;
    }
    return false;
  }, A = (p, h2, m = { replace: false }) => {
    const v = c(p);
    if (!v)
      return;
    const I = typeof h2 == "function" ? h2(v) : h2;
    v.data = m.replace ? I : { ...v.data, ...I };
  }, B = (p) => Fo(p, e3.nodes), V = (p) => {
    const h2 = Fo(p, e3.edges);
    return Bn(e3.connectionLookup, n.value, h2), h2;
  }, X = (p, h2, m = { replace: false }) => {
    const v = u(p);
    if (!v)
      return;
    const I = typeof h2 == "function" ? h2(v) : h2;
    m.replace ? e3.nodes.splice(e3.nodes.indexOf(v), 1, I) : Object.assign(v, I);
  }, Q = (p, h2, m = { replace: false }) => {
    const v = u(p);
    if (!v)
      return;
    const I = typeof h2 == "function" ? h2(v) : h2;
    v.data = m.replace ? I : { ...v.data, ...I };
  }, oe = (p, h2, m = false) => {
    m ? e3.connectionClickStartHandle = p : e3.connectionStartHandle = p, e3.connectionEndHandle = null, e3.connectionStatus = null, h2 && (e3.connectionPosition = h2);
  }, le = (p, h2 = null, m = null) => {
    e3.connectionStartHandle && (e3.connectionPosition = p, e3.connectionEndHandle = h2, e3.connectionStatus = m);
  }, Y = (p, h2) => {
    e3.connectionPosition = { x: Number.NaN, y: Number.NaN }, e3.connectionEndHandle = null, e3.connectionStatus = null, h2 ? e3.connectionClickStartHandle = null : e3.connectionStartHandle = null;
  }, U = (p) => {
    const h2 = Ou(p), m = h2 ? null : kt(p) ? p : u(p.id);
    return !h2 && !m ? [null, null, h2] : [h2 ? p : vn(m), m, h2];
  }, q = (p, h2 = true, m = e3.nodes) => {
    const [v, I, G] = U(p);
    if (!v)
      return [];
    const Z = [];
    for (const F of m || e3.nodes) {
      if (!G && (F.id === I.id || !F.computedPosition))
        continue;
      const K = vn(F), ie = pn(K, v);
      (h2 && ie > 0 || ie >= K.width * K.height || ie >= Number(v.width) * Number(v.height)) && Z.push(F);
    }
    return Z;
  }, ce = (p, h2, m = true) => {
    const [v] = U(p);
    if (!v)
      return false;
    const I = pn(v, h2);
    return m && I > 0 || I >= Number(v.width) * Number(v.height);
  }, re = (p) => {
    const { viewport: h2, dimensions: m, d3Zoom: v, d3Selection: I, translateExtent: G } = e3;
    if (!v || !I || !p.x && !p.y)
      return false;
    const Z = _t.translate(h2.x + p.x, h2.y + p.y).scale(h2.zoom), F = [
      [0, 0],
      [m.width, m.height]
    ], K = v.constrain()(Z, F, G), ie = e3.viewport.x !== K.x || e3.viewport.y !== K.y || e3.viewport.zoom !== K.k;
    return v.transform(I, K), ie;
  }, se = (p) => {
    const h2 = p instanceof Function ? p(e3) : p, m = [
      "d3Zoom",
      "d3Selection",
      "d3ZoomHandler",
      "viewportRef",
      "vueFlowRef",
      "dimensions",
      "hooks"
    ];
    xe(h2.defaultEdgeOptions) && (e3.defaultEdgeOptions = h2.defaultEdgeOptions);
    const v = h2.modelValue || h2.nodes || h2.edges ? [] : void 0;
    v && (h2.modelValue && v.push(...h2.modelValue), h2.nodes && v.push(...h2.nodes), h2.edges && v.push(...h2.edges), w(v));
    const I = () => {
      xe(h2.maxZoom) && O(h2.maxZoom), xe(h2.minZoom) && N(h2.minZoom), xe(h2.translateExtent) && k(h2.translateExtent);
    };
    for (const G of Object.keys(h2)) {
      const Z = G, F = h2[Z];
      ![...Ec, ...m].includes(Z) && xe(F) && (e3[Z] = F);
    }
    Ln(() => e3.d3Zoom).not.toBeNull().then(I), e3.initialized || (e3.initialized = true);
  };
  return {
    updateNodePositions: d,
    updateNodeDimensions: f,
    setElements: w,
    setNodes: L,
    setEdges: z,
    addNodes: J,
    addEdges: y,
    removeNodes: P,
    removeEdges: E,
    findNode: u,
    findEdge: c,
    updateEdge: D,
    updateEdgeData: A,
    updateNode: X,
    updateNodeData: Q,
    applyEdgeChanges: V,
    applyNodeChanges: B,
    addSelectedElements: S,
    addSelectedNodes: b,
    addSelectedEdges: x,
    setMinZoom: N,
    setMaxZoom: O,
    setTranslateExtent: k,
    setNodeExtent: $,
    setPaneClickDistance: T,
    removeSelectedElements: _,
    removeSelectedNodes: C,
    removeSelectedEdges: M,
    startConnection: oe,
    updateConnection: le,
    endConnection: Y,
    setInteractive: W,
    setState: se,
    getIntersectingNodes: q,
    getIncomers: r,
    getOutgoers: l,
    getConnectedEdges: a,
    getHandleConnections: s,
    isNodeIntersecting: ce,
    panBy: re,
    fitView: (p) => o.value.fitView(p),
    zoomIn: (p) => o.value.zoomIn(p),
    zoomOut: (p) => o.value.zoomOut(p),
    zoomTo: (p, h2) => o.value.zoomTo(p, h2),
    setViewport: (p, h2) => o.value.setViewport(p, h2),
    setTransform: (p, h2) => o.value.setTransform(p, h2),
    getViewport: () => o.value.getViewport(),
    getTransform: () => o.value.getTransform(),
    setCenter: (p, h2, m) => o.value.setCenter(p, h2, m),
    fitBounds: (p, h2) => o.value.fitBounds(p, h2),
    project: (p) => o.value.project(p),
    screenToFlowCoordinate: (p) => o.value.screenToFlowCoordinate(p),
    flowToScreenCoordinate: (p) => o.value.flowToScreenCoordinate(p),
    toObject: () => {
      const p = [], h2 = [];
      for (const m of e3.nodes) {
        const {
          computedPosition: v,
          handleBounds: I,
          selected: G,
          dimensions: Z,
          isParent: F,
          resizing: K,
          dragging: ie,
          events: de,
          ...he
        } = m;
        p.push(he);
      }
      for (const m of e3.edges) {
        const { selected: v, sourceNode: I, targetNode: G, events: Z, ...F } = m;
        h2.push(F);
      }
      return JSON.parse(
        JSON.stringify({
          nodes: p,
          edges: h2,
          position: [e3.viewport.x, e3.viewport.y],
          zoom: e3.viewport.zoom,
          viewport: e3.viewport
        })
      );
    },
    fromObject: (p) => new Promise((h2) => {
      const { nodes: m, edges: v, position: I, zoom: G, viewport: Z } = p;
      m && L(m), v && z(v);
      const [F, K] = Z?.x && Z?.y ? [Z.x, Z.y] : I ?? [null, null];
      if (F && K) {
        const ie = Z?.zoom || G || e3.viewport.zoom;
        return Ln(() => o.value.viewportInitialized).toBe(true).then(() => {
          o.value.setViewport({
            x: F,
            y: K,
            zoom: ie
          }).then(() => {
            h2(true);
          });
        });
      } else
        h2(true);
    }),
    updateNodeInternals: i,
    viewportHelper: o,
    $reset: () => {
      const p = gr();
      if (e3.edges = [], e3.nodes = [], e3.d3Zoom && e3.d3Selection) {
        const h2 = _t.translate(p.defaultViewport.x ?? 0, p.defaultViewport.y ?? 0).scale(at(p.defaultViewport.zoom ?? 1, p.minZoom, p.maxZoom)), m = e3.viewportRef.getBoundingClientRect(), v = [
          [0, 0],
          [m.width, m.height]
        ], I = e3.d3Zoom.constrain()(h2, v, p.translateExtent);
        e3.d3Zoom.transform(e3.d3Selection, I);
      }
      se(p);
    },
    $destroy: () => {
    }
  };
}
const Nc = ["data-id", "data-handleid", "data-nodeid", "data-handlepos"], Cc = {
  name: "Handle",
  compatConfig: { MODE: 3 }
}, bt = /* @__PURE__ */ defineComponent({
  ...Cc,
  props: {
    id: { default: null },
    type: {},
    position: { default: () => R.Top },
    isValidConnection: { type: Function },
    connectable: { type: [Boolean, Number, String, Function], default: void 0 },
    connectableStart: { type: Boolean, default: true },
    connectableEnd: { type: Boolean, default: true }
  },
  setup(e3, { expose: t }) {
    const n = createPropsRestProxy(e3, ["position", "connectable", "connectableStart", "connectableEnd", "id"]), o = toRef(() => n.type ?? "source"), i = toRef(() => n.isValidConnection ?? null), {
      id: r,
      connectionStartHandle: l,
      connectionClickStartHandle: a,
      connectionEndHandle: s,
      vueFlowRef: u,
      nodesConnectable: c,
      noDragClassName: d,
      noPanClassName: f
    } = we(), { id: g, node: b, nodeEl: x, connectedEdges: S } = fr(), C = ref(), M = toRef(() => typeof e3.connectableStart < "u" ? e3.connectableStart : true), _ = toRef(() => typeof e3.connectableEnd < "u" ? e3.connectableEnd : true), N = toRef(
      () => {
        var z, w, J, y, P, E;
        return ((z = l.value) == null ? void 0 : z.nodeId) === g && ((w = l.value) == null ? void 0 : w.id) === e3.id && ((J = l.value) == null ? void 0 : J.type) === o.value || ((y = s.value) == null ? void 0 : y.nodeId) === g && ((P = s.value) == null ? void 0 : P.id) === e3.id && ((E = s.value) == null ? void 0 : E.type) === o.value;
      }
    ), O = toRef(
      () => {
        var z, w, J;
        return ((z = a.value) == null ? void 0 : z.nodeId) === g && ((w = a.value) == null ? void 0 : w.id) === e3.id && ((J = a.value) == null ? void 0 : J.type) === o.value;
      }
    ), { handlePointerDown: k, handleClick: $ } = dr({
      nodeId: g,
      handleId: e3.id,
      isValidConnection: i,
      type: o
    }), T = computed(() => typeof e3.connectable == "string" && e3.connectable === "single" ? !S.value.some((z) => {
      const w = z[`${o.value}Handle`];
      return z[o.value] !== g ? false : w ? w === e3.id : true;
    }) : typeof e3.connectable == "number" ? S.value.filter((z) => {
      const w = z[`${o.value}Handle`];
      return z[o.value] !== g ? false : w ? w === e3.id : true;
    }).length < e3.connectable : typeof e3.connectable == "function" ? e3.connectable(b, S.value) : xe(e3.connectable) ? e3.connectable : c.value);
    onMounted(() => {
      var z;
      if (!b.dimensions.width || !b.dimensions.height)
        return;
      const w = (z = b.handleBounds[o.value]) == null ? void 0 : z.find((B) => B.id === e3.id);
      if (!u.value || w)
        return;
      const J = u.value.querySelector(".vue-flow__transformationpane");
      if (!x.value || !C.value || !J || !e3.id)
        return;
      const y = x.value.getBoundingClientRect(), P = C.value.getBoundingClientRect(), E = window.getComputedStyle(J), { m22: D } = new window.DOMMatrixReadOnly(E.transform), A = {
        id: e3.id,
        position: e3.position,
        x: (P.left - y.left) / D,
        y: (P.top - y.top) / D,
        type: o.value,
        nodeId: g,
        ...xn(C.value)
      };
      b.handleBounds[o.value] = [...b.handleBounds[o.value] ?? [], A];
    });
    function W(z) {
      const w = go(z);
      T.value && M.value && (w && z.button === 0 || !w) && k(z);
    }
    function L(z) {
      !g || !a.value && !M.value || T.value && $(z);
    }
    return t({
      handleClick: $,
      handlePointerDown: k,
      onClick: L,
      onPointerDown: W
    }), (z, w) => (openBlock(), createElementBlock("div", {
      ref_key: "handle",
      ref: C,
      "data-id": `${unref(r)}-${unref(g)}-${e3.id}-${o.value}`,
      "data-handleid": e3.id,
      "data-nodeid": unref(g),
      "data-handlepos": z.position,
      class: normalizeClass(["vue-flow__handle", [
        `vue-flow__handle-${z.position}`,
        `vue-flow__handle-${e3.id}`,
        unref(d),
        unref(f),
        o.value,
        {
          connectable: T.value,
          connecting: O.value,
          connectablestart: M.value,
          connectableend: _.value,
          connectionindicator: T.value && (M.value && !N.value || _.value && N.value)
        }
      ]]),
      onMousedown: W,
      onTouchstartPassive: W,
      onClick: L
    }, [
      renderSlot(z.$slots, "default", { id: z.id })
    ], 42, Nc));
  }
}), Nn = function({
  sourcePosition: e3 = R.Bottom,
  targetPosition: t = R.Top,
  label: n,
  connectable: o = true,
  isValidTargetPos: i,
  isValidSourcePos: r,
  data: l
}) {
  const a = l.label ?? n;
  return [
    h(bt, { type: "target", position: t, connectable: o, isValidConnection: i }),
    typeof a != "string" && a ? h(a) : h(Fragment, [a]),
    h(bt, { type: "source", position: e3, connectable: o, isValidConnection: r })
  ];
};
Nn.props = ["sourcePosition", "targetPosition", "label", "isValidTargetPos", "isValidSourcePos", "connectable", "data"];
Nn.inheritAttrs = false;
Nn.compatConfig = { MODE: 3 };
const Mc = Nn, Cn = function({
  targetPosition: e3 = R.Top,
  label: t,
  connectable: n = true,
  isValidTargetPos: o,
  data: i
}) {
  const r = i.label ?? t;
  return [
    h(bt, { type: "target", position: e3, connectable: n, isValidConnection: o }),
    typeof r != "string" && r ? h(r) : h(Fragment, [r])
  ];
};
Cn.props = ["targetPosition", "label", "isValidTargetPos", "connectable", "data"];
Cn.inheritAttrs = false;
Cn.compatConfig = { MODE: 3 };
const Ic = Cn, Mn = function({
  sourcePosition: e3 = R.Bottom,
  label: t,
  connectable: n = true,
  isValidSourcePos: o,
  data: i
}) {
  const r = i.label ?? t;
  return [
    typeof r != "string" && r ? h(r) : h(Fragment, [r]),
    h(bt, { type: "source", position: e3, connectable: n, isValidConnection: o })
  ];
};
Mn.props = ["sourcePosition", "label", "isValidSourcePos", "connectable", "data"];
Mn.inheritAttrs = false;
Mn.compatConfig = { MODE: 3 };
const kc = Mn, Pc = ["transform"], $c = ["width", "height", "x", "y", "rx", "ry"], Tc = ["y"], Dc = {
  name: "EdgeText",
  compatConfig: { MODE: 3 }
}, Ac = /* @__PURE__ */ defineComponent({
  ...Dc,
  props: {
    x: {},
    y: {},
    label: {},
    labelStyle: { default: () => ({}) },
    labelShowBg: { type: Boolean, default: true },
    labelBgStyle: { default: () => ({}) },
    labelBgPadding: { default: () => [2, 4] },
    labelBgBorderRadius: { default: 2 }
  },
  setup(e3) {
    const t = ref({ x: 0, y: 0, width: 0, height: 0 }), n = ref(null), o = computed(() => `translate(${e3.x - t.value.width / 2} ${e3.y - t.value.height / 2})`);
    onMounted(i), watch([() => e3.x, () => e3.y, n, () => e3.label], i);
    function i() {
      if (!n.value)
        return;
      const r = n.value.getBBox();
      (r.width !== t.value.width || r.height !== t.value.height) && (t.value = r);
    }
    return (r, l) => (openBlock(), createElementBlock("g", {
      transform: o.value,
      class: "vue-flow__edge-textwrapper"
    }, [
      r.labelShowBg ? (openBlock(), createElementBlock("rect", {
        key: 0,
        class: "vue-flow__edge-textbg",
        width: `${t.value.width + 2 * r.labelBgPadding[0]}px`,
        height: `${t.value.height + 2 * r.labelBgPadding[1]}px`,
        x: -r.labelBgPadding[0],
        y: -r.labelBgPadding[1],
        style: normalizeStyle(r.labelBgStyle),
        rx: r.labelBgBorderRadius,
        ry: r.labelBgBorderRadius
      }, null, 12, $c)) : createCommentVNode("", true),
      createBaseVNode("text", mergeProps(r.$attrs, {
        ref_key: "el",
        ref: n,
        class: "vue-flow__edge-text",
        y: t.value.height / 2,
        dy: "0.3em",
        style: r.labelStyle
      }), [
        renderSlot(r.$slots, "default", {}, () => [
          typeof r.label != "string" ? (openBlock(), createBlock(resolveDynamicComponent(r.label), { key: 0 })) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createTextVNode(toDisplayString(r.label), 1)
          ], 64))
        ])
      ], 16, Tc)
    ], 8, Pc));
  }
}), Oc = ["id", "d", "marker-end", "marker-start"], zc = ["d", "stroke-width"], Bc = {
  name: "BaseEdge",
  inheritAttrs: false,
  compatConfig: { MODE: 3 }
}, In = /* @__PURE__ */ defineComponent({
  ...Bc,
  props: {
    id: {},
    labelX: {},
    labelY: {},
    path: {},
    label: {},
    markerStart: {},
    markerEnd: {},
    interactionWidth: { default: 20 },
    labelStyle: {},
    labelShowBg: { type: Boolean },
    labelBgStyle: {},
    labelBgPadding: {},
    labelBgBorderRadius: {}
  },
  setup(e3, { expose: t }) {
    const n = ref(null), o = ref(null), i = ref(null), r = useAttrs();
    return t({
      pathEl: n,
      interactionEl: o,
      labelEl: i
    }), (l, a) => (openBlock(), createElementBlock(Fragment, null, [
      createBaseVNode("path", mergeProps(unref(r), {
        id: l.id,
        ref_key: "pathEl",
        ref: n,
        d: l.path,
        class: "vue-flow__edge-path",
        "marker-end": l.markerEnd,
        "marker-start": l.markerStart
      }), null, 16, Oc),
      l.interactionWidth ? (openBlock(), createElementBlock("path", {
        key: 0,
        ref_key: "interactionEl",
        ref: o,
        fill: "none",
        d: l.path,
        "stroke-width": l.interactionWidth,
        "stroke-opacity": 0,
        class: "vue-flow__edge-interaction"
      }, null, 8, zc)) : createCommentVNode("", true),
      l.label && l.labelX && l.labelY ? (openBlock(), createBlock(Ac, {
        key: 1,
        ref_key: "labelEl",
        ref: i,
        x: l.labelX,
        y: l.labelY,
        label: l.label,
        "label-show-bg": l.labelShowBg,
        "label-bg-style": l.labelBgStyle,
        "label-bg-padding": l.labelBgPadding,
        "label-bg-border-radius": l.labelBgBorderRadius,
        "label-style": l.labelStyle
      }, null, 8, ["x", "y", "label", "label-show-bg", "label-bg-style", "label-bg-padding", "label-bg-border-radius", "label-style"])) : createCommentVNode("", true)
    ], 64));
  }
});
function vr({
  sourceX: e3,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const i = Math.abs(n - e3) / 2, r = n < e3 ? n + i : n - i, l = Math.abs(o - t) / 2, a = o < t ? o + l : o - l;
  return [r, a, i, l];
}
function pr({
  sourceX: e3,
  sourceY: t,
  targetX: n,
  targetY: o,
  sourceControlX: i,
  sourceControlY: r,
  targetControlX: l,
  targetControlY: a
}) {
  const s = e3 * 0.125 + i * 0.375 + l * 0.375 + n * 0.125, u = t * 0.125 + r * 0.375 + a * 0.375 + o * 0.125, c = Math.abs(s - e3), d = Math.abs(u - t);
  return [s, u, c, d];
}
function jt(e3, t) {
  return e3 >= 0 ? 0.5 * e3 : t * 25 * Math.sqrt(-e3);
}
function ni({ pos: e3, x1: t, y1: n, x2: o, y2: i, c: r }) {
  let l, a;
  switch (e3) {
    case R.Left:
      l = t - jt(t - o, r), a = n;
      break;
    case R.Right:
      l = t + jt(o - t, r), a = n;
      break;
    case R.Top:
      l = t, a = n - jt(n - i, r);
      break;
    case R.Bottom:
      l = t, a = n + jt(i - n, r);
      break;
  }
  return [l, a];
}
function vo(e3) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = R.Bottom,
    targetX: i,
    targetY: r,
    targetPosition: l = R.Top,
    curvature: a = 0.25
  } = e3, [s, u] = ni({
    pos: o,
    x1: t,
    y1: n,
    x2: i,
    y2: r,
    c: a
  }), [c, d] = ni({
    pos: l,
    x1: i,
    y1: r,
    x2: t,
    y2: n,
    c: a
  }), [f, g, b, x] = pr({
    sourceX: t,
    sourceY: n,
    targetX: i,
    targetY: r,
    sourceControlX: s,
    sourceControlY: u,
    targetControlX: c,
    targetControlY: d
  });
  return [
    `M${t},${n} C${s},${u} ${c},${d} ${i},${r}`,
    f,
    g,
    b,
    x
  ];
}
function oi({ pos: e3, x1: t, y1: n, x2: o, y2: i }) {
  let r, l;
  switch (e3) {
    case R.Left:
    case R.Right:
      r = 0.5 * (t + o), l = n;
      break;
    case R.Top:
    case R.Bottom:
      r = t, l = 0.5 * (n + i);
      break;
  }
  return [r, l];
}
function mr(e3) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = R.Bottom,
    targetX: i,
    targetY: r,
    targetPosition: l = R.Top
  } = e3, [a, s] = oi({
    pos: o,
    x1: t,
    y1: n,
    x2: i,
    y2: r
  }), [u, c] = oi({
    pos: l,
    x1: i,
    y1: r,
    x2: t,
    y2: n
  }), [d, f, g, b] = pr({
    sourceX: t,
    sourceY: n,
    targetX: i,
    targetY: r,
    sourceControlX: a,
    sourceControlY: s,
    targetControlX: u,
    targetControlY: c
  });
  return [
    `M${t},${n} C${a},${s} ${u},${c} ${i},${r}`,
    d,
    f,
    g,
    b
  ];
}
const ii = {
  [R.Left]: { x: -1, y: 0 },
  [R.Right]: { x: 1, y: 0 },
  [R.Top]: { x: 0, y: -1 },
  [R.Bottom]: { x: 0, y: 1 }
};
function Vc({
  source: e3,
  sourcePosition: t = R.Bottom,
  target: n
}) {
  return t === R.Left || t === R.Right ? e3.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e3.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
}
function ri(e3, t) {
  return Math.sqrt((t.x - e3.x) ** 2 + (t.y - e3.y) ** 2);
}
function Rc({
  source: e3,
  sourcePosition: t = R.Bottom,
  target: n,
  targetPosition: o = R.Top,
  center: i,
  offset: r
}) {
  const l = ii[t], a = ii[o], s = { x: e3.x + l.x * r, y: e3.y + l.y * r }, u = { x: n.x + a.x * r, y: n.y + a.y * r }, c = Vc({
    source: s,
    sourcePosition: t,
    target: u
  }), d = c.x !== 0 ? "x" : "y", f = c[d];
  let g, b, x;
  const S = { x: 0, y: 0 }, C = { x: 0, y: 0 }, [M, _, N, O] = vr({
    sourceX: e3.x,
    sourceY: e3.y,
    targetX: n.x,
    targetY: n.y
  });
  if (l[d] * a[d] === -1) {
    b = i.x ?? M, x = i.y ?? _;
    const $ = [
      { x: b, y: s.y },
      { x: b, y: u.y }
    ], T = [
      { x: s.x, y: x },
      { x: u.x, y: x }
    ];
    l[d] === f ? g = d === "x" ? $ : T : g = d === "x" ? T : $;
  } else {
    const $ = [{ x: s.x, y: u.y }], T = [{ x: u.x, y: s.y }];
    if (d === "x" ? g = l.x === f ? T : $ : g = l.y === f ? $ : T, t === o) {
      const J = Math.abs(e3[d] - n[d]);
      if (J <= r) {
        const y = Math.min(r - 1, r - J);
        l[d] === f ? S[d] = (s[d] > e3[d] ? -1 : 1) * y : C[d] = (u[d] > n[d] ? -1 : 1) * y;
      }
    }
    if (t !== o) {
      const J = d === "x" ? "y" : "x", y = l[d] === a[J], P = s[J] > u[J], E = s[J] < u[J];
      (l[d] === 1 && (!y && P || y && E) || l[d] !== 1 && (!y && E || y && P)) && (g = d === "x" ? $ : T);
    }
    const W = { x: s.x + S.x, y: s.y + S.y }, L = { x: u.x + C.x, y: u.y + C.y }, z = Math.max(Math.abs(W.x - g[0].x), Math.abs(L.x - g[0].x)), w = Math.max(Math.abs(W.y - g[0].y), Math.abs(L.y - g[0].y));
    z >= w ? (b = (W.x + L.x) / 2, x = g[0].y) : (b = g[0].x, x = (W.y + L.y) / 2);
  }
  return [[
    e3,
    { x: s.x + S.x, y: s.y + S.y },
    ...g,
    { x: u.x + C.x, y: u.y + C.y },
    n
  ], b, x, N, O];
}
function Hc(e3, t, n, o) {
  const i = Math.min(ri(e3, t) / 2, ri(t, n) / 2, o), { x: r, y: l } = t;
  if (e3.x === r && r === n.x || e3.y === l && l === n.y)
    return `L${r} ${l}`;
  if (e3.y === l) {
    const u = e3.x < n.x ? -1 : 1, c = e3.y < n.y ? 1 : -1;
    return `L ${r + i * u},${l}Q ${r},${l} ${r},${l + i * c}`;
  }
  const a = e3.x < n.x ? 1 : -1, s = e3.y < n.y ? -1 : 1;
  return `L ${r},${l + i * s}Q ${r},${l} ${r + i * a},${l}`;
}
function eo(e3) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = R.Bottom,
    targetX: i,
    targetY: r,
    targetPosition: l = R.Top,
    borderRadius: a = 5,
    centerX: s,
    centerY: u,
    offset: c = 20
  } = e3, [d, f, g, b, x] = Rc({
    source: { x: t, y: n },
    sourcePosition: o,
    target: { x: i, y: r },
    targetPosition: l,
    center: { x: s, y: u },
    offset: c
  });
  return [d.reduce((C, M, _) => {
    let N;
    return _ > 0 && _ < d.length - 1 ? N = Hc(d[_ - 1], M, d[_ + 1], a) : N = `${_ === 0 ? "M" : "L"}${M.x} ${M.y}`, C += N, C;
  }, ""), f, g, b, x];
}
function Lc(e3) {
  const { sourceX: t, sourceY: n, targetX: o, targetY: i } = e3, [r, l, a, s] = vr({
    sourceX: t,
    sourceY: n,
    targetX: o,
    targetY: i
  });
  return [`M ${t},${n}L ${o},${i}`, r, l, a, s];
}
const Fc = defineComponent({
  name: "StraightEdge",
  props: [
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
  ],
  compatConfig: { MODE: 3 },
  setup(e3, { attrs: t }) {
    return () => {
      const [n, o, i] = Lc(e3);
      return h(In, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e3
      });
    };
  }
}), Yc = Fc, Gc = defineComponent({
  name: "SmoothStepEdge",
  props: [
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
  ],
  compatConfig: { MODE: 3 },
  setup(e3, { attrs: t }) {
    return () => {
      const [n, o, i] = eo({
        ...e3,
        sourcePosition: e3.sourcePosition ?? R.Bottom,
        targetPosition: e3.targetPosition ?? R.Top
      });
      return h(In, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e3
      });
    };
  }
}), yr = Gc, Xc = defineComponent({
  name: "StepEdge",
  props: [
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
  ],
  setup(e3, { attrs: t }) {
    return () => h(yr, { ...e3, ...t, borderRadius: 0 });
  }
}), Uc = Xc, Zc = defineComponent({
  name: "BezierEdge",
  props: [
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
  ],
  compatConfig: { MODE: 3 },
  setup(e3, { attrs: t }) {
    return () => {
      const [n, o, i] = vo({
        ...e3,
        sourcePosition: e3.sourcePosition ?? R.Bottom,
        targetPosition: e3.targetPosition ?? R.Top
      });
      return h(In, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e3
      });
    };
  }
}), Wc = Zc, Kc = defineComponent({
  name: "SimpleBezierEdge",
  props: [
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
  ],
  compatConfig: { MODE: 3 },
  setup(e3, { attrs: t }) {
    return () => {
      const [n, o, i] = mr({
        ...e3,
        sourcePosition: e3.sourcePosition ?? R.Bottom,
        targetPosition: e3.targetPosition ?? R.Top
      });
      return h(In, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e3
      });
    };
  }
}), qc = Kc, Jc = {
  input: kc,
  default: Mc,
  output: Ic
}, jc = {
  default: Wc,
  straight: Yc,
  step: Uc,
  smoothstep: yr,
  simplebezier: qc
};
function Qc(e3, t, n) {
  const o = computed(() => (x) => t.value.get(x)), i = computed(() => (x) => n.value.get(x)), r = computed(() => {
    const x = {
      ...jc,
      ...e3.edgeTypes
    }, S = Object.keys(x);
    for (const C of e3.edges)
      C.type && !S.includes(C.type) && (x[C.type] = C.type);
    return x;
  }), l = computed(() => {
    const x = {
      ...Jc,
      ...e3.nodeTypes
    }, S = Object.keys(x);
    for (const C of e3.nodes)
      C.type && !S.includes(C.type) && (x[C.type] = C.type);
    return x;
  }), a = computed(() => e3.onlyRenderVisibleElements ? er(
    e3.nodes,
    {
      x: 0,
      y: 0,
      width: e3.dimensions.width,
      height: e3.dimensions.height
    },
    e3.viewport,
    true
  ) : e3.nodes), s = computed(() => {
    if (e3.onlyRenderVisibleElements) {
      const x = [];
      for (const S of e3.edges) {
        const C = t.value.get(S.source), M = t.value.get(S.target);
        Ku({
          sourcePos: C.computedPosition || { x: 0, y: 0 },
          targetPos: M.computedPosition || { x: 0, y: 0 },
          sourceWidth: C.dimensions.width,
          sourceHeight: C.dimensions.height,
          targetWidth: M.dimensions.width,
          targetHeight: M.dimensions.height,
          width: e3.dimensions.width,
          height: e3.dimensions.height,
          viewport: e3.viewport
        }) && x.push(S);
      }
      return x;
    }
    return e3.edges;
  }), u = computed(() => [...a.value, ...s.value]), c = computed(() => {
    const x = [];
    for (const S of e3.nodes)
      S.selected && x.push(S);
    return x;
  }), d = computed(() => {
    const x = [];
    for (const S of e3.edges)
      S.selected && x.push(S);
    return x;
  }), f = computed(() => [
    ...c.value,
    ...d.value
  ]), g = computed(() => {
    const x = [];
    for (const S of e3.nodes)
      S.dimensions.width && S.dimensions.height && S.handleBounds !== void 0 && x.push(S);
    return x;
  }), b = computed(
    () => a.value.length > 0 && g.value.length === a.value.length
  );
  return {
    getNode: o,
    getEdge: i,
    getElements: u,
    getEdgeTypes: r,
    getNodeTypes: l,
    getEdges: s,
    getNodes: a,
    getSelectedElements: f,
    getSelectedNodes: c,
    getSelectedEdges: d,
    getNodesInitialized: g,
    areNodesInitialized: b
  };
}
class tt {
  constructor() {
    this.currentId = 0, this.flows = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    var t;
    const n = (t = getCurrentInstance()) == null ? void 0 : t.appContext.app, o = n?.config.globalProperties.$vueFlowStorage ?? tt.instance;
    return tt.instance = o ?? new tt(), n && (n.config.globalProperties.$vueFlowStorage = tt.instance), tt.instance;
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
    const o = gr(), i = reactive(o), r = {};
    for (const [f, g] of Object.entries(i.hooks)) {
      const b = `on${f.charAt(0).toUpperCase() + f.slice(1)}`;
      r[b] = g.on;
    }
    const l = {};
    for (const [f, g] of Object.entries(i.hooks))
      l[f] = g.trigger;
    const a = computed(() => {
      const f = /* @__PURE__ */ new Map();
      for (const g of i.nodes)
        f.set(g.id, g);
      return f;
    }), s = computed(() => {
      const f = /* @__PURE__ */ new Map();
      for (const g of i.edges)
        f.set(g.id, g);
      return f;
    }), u = Qc(i, a, s), c = Sc(i, a, s);
    c.setState({ ...i, ...n });
    const d = {
      ...r,
      ...u,
      ...c,
      ...Gr(i),
      nodeLookup: a,
      edgeLookup: s,
      emits: l,
      id: t,
      vueFlowVersion: "1.48.1",
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
function we(e3) {
  const t = tt.getInstance(), n = getCurrentScope(), o = typeof e3 == "object", i = o ? e3 : { id: e3 }, r = i.id, l = r ?? n?.vueFlowId;
  let a;
  if (n) {
    const s = inject(ti, null);
    typeof s < "u" && s !== null && (!l || s.id === l) && (a = s);
  }
  if (a || l && (a = t.get(l)), !a || l && a.id !== l) {
    const s = r ?? t.getId(), u = t.create(s, i);
    a = u, (n ?? effectScope(true)).run(() => {
      watch(
        u.applyDefault,
        (d, f, g) => {
          const b = (S) => {
            u.applyNodeChanges(S);
          }, x = (S) => {
            u.applyEdgeChanges(S);
          };
          d ? (u.onNodesChange(b), u.onEdgesChange(x)) : (u.hooks.value.nodesChange.off(b), u.hooks.value.edgesChange.off(x)), g(() => {
            u.hooks.value.nodesChange.off(b), u.hooks.value.edgesChange.off(x);
          });
        },
        { immediate: true }
      ), Dt(() => {
        if (a) {
          const d = t.get(a.id);
          d ? d.$destroy() : Yt(`No store instance found for id ${a.id} in storage.`);
        }
      });
    });
  } else
    o && a.setState(i);
  if (n && (provide(ti, a), n.vueFlowId = a.id), o) {
    const s = getCurrentInstance();
    s?.type.name !== "VueFlow" && a.emits.error(new Se(Ee.USEVUEFLOW_OPTIONS));
  }
  return a;
}
function ed(e3) {
  const { emits: t, dimensions: n } = we();
  let o;
  onMounted(() => {
    const i = () => {
      var r, l;
      if (!e3.value || !(((l = (r = e3.value).checkVisibility) == null ? void 0 : l.call(r)) ?? true))
        return;
      const a = xn(e3.value);
      (a.width === 0 || a.height === 0) && t.error(new Se(Ee.MISSING_VIEWPORT_DIMENSIONS)), n.value = { width: a.width || 500, height: a.height || 500 };
    };
    i(), window.addEventListener("resize", i), e3.value && (o = new ResizeObserver(() => i()), o.observe(e3.value)), onBeforeUnmount(() => {
      window.removeEventListener("resize", i), o && e3.value && o.unobserve(e3.value);
    });
  });
}
const td = {
  name: "UserSelection",
  compatConfig: { MODE: 3 }
}, nd = /* @__PURE__ */ defineComponent({
  ...td,
  props: {
    userSelectionRect: {}
  },
  setup(e3) {
    return (t, n) => (openBlock(), createElementBlock("div", {
      class: "vue-flow__selection vue-flow__container",
      style: normalizeStyle({
        width: `${t.userSelectionRect.width}px`,
        height: `${t.userSelectionRect.height}px`,
        transform: `translate(${t.userSelectionRect.x}px, ${t.userSelectionRect.y}px)`
      })
    }, null, 4));
  }
}), od = ["tabIndex"], id$1 = {
  name: "NodesSelection",
  compatConfig: { MODE: 3 }
}, rd = /* @__PURE__ */ defineComponent({
  ...id$1,
  setup(e3) {
    const { emits: t, viewport: n, getSelectedNodes: o, noPanClassName: i, disableKeyboardA11y: r, userSelectionActive: l } = we(), a = hr(), s = ref(null), u = cr({
      el: s,
      onStart(b) {
        t.selectionDragStart(b), t.nodeDragStart(b);
      },
      onDrag(b) {
        t.selectionDrag(b), t.nodeDrag(b);
      },
      onStop(b) {
        t.selectionDragStop(b), t.nodeDragStop(b);
      }
    });
    onMounted(() => {
      var b;
      r.value || (b = s.value) == null || b.focus({ preventScroll: true });
    });
    const c = computed(() => Qi(o.value)), d = computed(() => ({
      width: `${c.value.width}px`,
      height: `${c.value.height}px`,
      top: `${c.value.y}px`,
      left: `${c.value.x}px`
    }));
    function f(b) {
      t.selectionContextMenu({ event: b, nodes: o.value });
    }
    function g(b) {
      r.value || ft[b.key] && (b.preventDefault(), a(
        {
          x: ft[b.key].x,
          y: ft[b.key].y
        },
        b.shiftKey
      ));
    }
    return (b, x) => !unref(l) && c.value.width && c.value.height ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(["vue-flow__nodesselection vue-flow__container", unref(i)]),
      style: normalizeStyle({ transform: `translate(${unref(n).x}px,${unref(n).y}px) scale(${unref(n).zoom})` })
    }, [
      createBaseVNode("div", {
        ref_key: "el",
        ref: s,
        class: normalizeClass([{ dragging: unref(u) }, "vue-flow__nodesselection-rect"]),
        style: normalizeStyle(d.value),
        tabIndex: unref(r) ? void 0 : -1,
        onContextmenu: f,
        onKeydown: g
      }, null, 46, od)
    ], 6)) : createCommentVNode("", true);
  }
});
function ld(e3, t) {
  return {
    x: e3.clientX - t.left,
    y: e3.clientY - t.top
  };
}
const ad = {
  name: "Pane",
  compatConfig: { MODE: 3 }
}, sd = /* @__PURE__ */ defineComponent({
  ...ad,
  props: {
    isSelecting: { type: Boolean },
    selectionKeyPressed: { type: Boolean }
  },
  setup(e3) {
    const {
      vueFlowRef: t,
      nodes: n,
      viewport: o,
      emits: i,
      userSelectionActive: r,
      removeSelectedElements: l,
      userSelectionRect: a,
      elementsSelectable: s,
      nodesSelectionActive: u,
      getSelectedEdges: c,
      getSelectedNodes: d,
      removeNodes: f,
      removeEdges: g,
      selectionMode: b,
      deleteKeyCode: x,
      multiSelectionKeyCode: S,
      multiSelectionActive: C,
      edgeLookup: M,
      nodeLookup: _,
      connectionLookup: N,
      defaultEdgeOptions: O,
      connectionStartHandle: k,
      panOnDrag: $
    } = we(), T = shallowRef(null), W = shallowRef(/* @__PURE__ */ new Set()), L = shallowRef(/* @__PURE__ */ new Set()), z = shallowRef(null), w = toRef(() => s.value && (e3.isSelecting || r.value)), J = toRef(() => k.value !== null);
    let y = false, P = false;
    const E = Tt(x, { actInsideInputWithModifier: false }), D = Tt(S);
    watch(E, (Y) => {
      Y && (f(d.value), g(c.value), u.value = false);
    }), watch(D, (Y) => {
      C.value = Y;
    });
    function A(Y, U) {
      return (q) => {
        q.target === U && Y?.(q);
      };
    }
    function B(Y) {
      if (y || J.value) {
        y = false;
        return;
      }
      i.paneClick(Y), l(), u.value = false;
    }
    function V(Y) {
      var U;
      if (Array.isArray($.value) && ((U = $.value) != null && U.includes(2))) {
        Y.preventDefault();
        return;
      }
      i.paneContextMenu(Y);
    }
    function X(Y) {
      i.paneScroll(Y);
    }
    function Q(Y) {
      var U, q, ce;
      if (z.value = ((U = t.value) == null ? void 0 : U.getBoundingClientRect()) ?? null, !s.value || !e3.isSelecting || Y.button !== 0 || Y.target !== T.value || !z.value)
        return;
      (ce = (q = Y.target) == null ? void 0 : q.setPointerCapture) == null || ce.call(q, Y.pointerId);
      const { x: re, y: se } = ld(Y, z.value);
      P = true, y = false, l(), a.value = {
        width: 0,
        height: 0,
        startX: re,
        startY: se,
        x: re,
        y: se
      }, i.selectionStart(Y);
    }
    function oe(Y) {
      var U;
      if (!z.value || !a.value)
        return;
      y = true;
      const { x: q, y: ce } = Be(Y, z.value), { startX: re = 0, startY: se = 0 } = a.value, ge = {
        startX: re,
        startY: se,
        x: q < re ? q : re,
        y: ce < se ? ce : se,
        width: Math.abs(q - re),
        height: Math.abs(ce - se)
      }, ee = W.value, ae = L.value;
      W.value = new Set(
        er(n.value, ge, o.value, b.value === fo.Partial, true).map(
          (h2) => h2.id
        )
      ), L.value = /* @__PURE__ */ new Set();
      const p = ((U = O.value) == null ? void 0 : U.selectable) ?? true;
      for (const h2 of W.value) {
        const m = N.value.get(h2);
        if (m)
          for (const { edgeId: v } of m.values()) {
            const I = M.value.get(v);
            I && (I.selectable ?? p) && L.value.add(v);
          }
      }
      if (!ei(ee, W.value)) {
        const h2 = Ke(_.value, W.value, true);
        i.nodesChange(h2);
      }
      if (!ei(ae, L.value)) {
        const h2 = Ke(M.value, L.value);
        i.edgesChange(h2);
      }
      a.value = ge, r.value = true, u.value = false;
    }
    function le(Y) {
      var U;
      Y.button !== 0 || !P || ((U = Y.target) == null || U.releasePointerCapture(Y.pointerId), !r.value && a.value && Y.target === T.value && B(Y), r.value = false, a.value = null, u.value = W.value.size > 0, i.selectionEnd(Y), e3.selectionKeyPressed && (y = false), P = false);
    }
    return (Y, U) => (openBlock(), createElementBlock("div", {
      ref_key: "container",
      ref: T,
      class: normalizeClass(["vue-flow__pane vue-flow__container", { selection: Y.isSelecting }]),
      onClick: U[0] || (U[0] = (q) => w.value ? void 0 : A(B, T.value)(q)),
      onContextmenu: U[1] || (U[1] = (q) => A(V, T.value)(q)),
      onWheelPassive: U[2] || (U[2] = (q) => A(X, T.value)(q)),
      onPointerenter: U[3] || (U[3] = (q) => w.value ? void 0 : unref(i).paneMouseEnter(q)),
      onPointerdown: U[4] || (U[4] = (q) => w.value ? Q(q) : unref(i).paneMouseMove(q)),
      onPointermove: U[5] || (U[5] = (q) => w.value ? oe(q) : unref(i).paneMouseMove(q)),
      onPointerup: U[6] || (U[6] = (q) => w.value ? le(q) : void 0),
      onPointerleave: U[7] || (U[7] = (q) => unref(i).paneMouseLeave(q))
    }, [
      renderSlot(Y.$slots, "default"),
      unref(r) && unref(a) ? (openBlock(), createBlock(nd, {
        key: 0,
        "user-selection-rect": unref(a)
      }, null, 8, ["user-selection-rect"])) : createCommentVNode("", true),
      unref(u) && unref(d).length ? (openBlock(), createBlock(rd, { key: 1 })) : createCommentVNode("", true)
    ], 34));
  }
}), ud = {
  name: "Transform",
  compatConfig: { MODE: 3 }
}, cd = /* @__PURE__ */ defineComponent({
  ...ud,
  setup(e3) {
    const { viewport: t, fitViewOnInit: n, fitViewOnInitDone: o } = we(), i = computed(() => n.value ? !o.value : false), r = computed(() => `translate(${t.value.x}px,${t.value.y}px) scale(${t.value.zoom})`);
    return (l, a) => (openBlock(), createElementBlock("div", {
      class: "vue-flow__transformationpane vue-flow__container",
      style: normalizeStyle({ transform: r.value, opacity: i.value ? 0 : void 0 })
    }, [
      renderSlot(l.$slots, "default")
    ], 4));
  }
}), dd = {
  name: "Viewport",
  compatConfig: { MODE: 3 }
}, fd = /* @__PURE__ */ defineComponent({
  ...dd,
  setup(e3) {
    const {
      minZoom: t,
      maxZoom: n,
      defaultViewport: o,
      translateExtent: i,
      zoomActivationKeyCode: r,
      selectionKeyCode: l,
      panActivationKeyCode: a,
      panOnScroll: s,
      panOnScrollMode: u,
      panOnScrollSpeed: c,
      panOnDrag: d,
      zoomOnDoubleClick: f,
      zoomOnPinch: g,
      zoomOnScroll: b,
      preventScrolling: x,
      noWheelClassName: S,
      noPanClassName: C,
      emits: M,
      connectionStartHandle: _,
      userSelectionActive: N,
      paneDragging: O,
      d3Zoom: k,
      d3Selection: $,
      d3ZoomHandler: T,
      viewport: W,
      viewportRef: L,
      paneClickDistance: z
    } = we();
    ed(L);
    const w = shallowRef(false), J = shallowRef(false);
    let y = null, P = false, E = 0, D = {
      x: 0,
      y: 0,
      zoom: 0
    };
    const A = Tt(a), B = Tt(l), V = Tt(r), X = toRef(
      () => (!B.value || B.value && l.value === true) && (A.value || d.value)
    ), Q = toRef(() => A.value || s.value), oe = toRef(() => B.value || l.value === true && X.value !== true), le = toRef(() => _.value !== null);
    onMounted(() => {
      if (!L.value) {
        Yt("Viewport element is missing");
        return;
      }
      const re = L.value, se = re.getBoundingClientRect(), ge = Iu().clickDistance(z.value).scaleExtent([t.value, n.value]).translateExtent(i.value), ee = ke(re).call(ge), ae = ee.on("wheel.zoom"), p = _t.translate(o.value.x ?? 0, o.value.y ?? 0).scale(at(o.value.zoom ?? 1, t.value, n.value)), h2 = [
        [0, 0],
        [se.width, se.height]
      ], m = ge.constrain()(p, h2, i.value);
      ge.transform(ee, m), ge.wheelDelta(Ho), k.value = ge, $.value = ee, T.value = ae, W.value = { x: m.x, y: m.y, zoom: m.k }, ge.on("start", (v) => {
        var I;
        if (!v.sourceEvent)
          return null;
        E = v.sourceEvent.button, w.value = true;
        const G = q(v.transform);
        ((I = v.sourceEvent) == null ? void 0 : I.type) === "mousedown" && (O.value = true), D = G, M.viewportChangeStart(G), M.moveStart({ event: v, flowTransform: G });
      }), ge.on("end", (v) => {
        if (!v.sourceEvent)
          return null;
        if (w.value = false, O.value = false, Y(X.value, E ?? 0) && !P && M.paneContextMenu(v.sourceEvent), P = false, U(D, v.transform)) {
          const I = q(v.transform);
          D = I, M.viewportChangeEnd(I), M.moveEnd({ event: v, flowTransform: I });
        }
      }), ge.filter((v) => {
        var I;
        const G = V.value || b.value, Z = g.value && v.ctrlKey, F = v.button, K = v.type === "wheel";
        if (F === 1 && v.type === "mousedown" && (ce(v, "vue-flow__node") || ce(v, "vue-flow__edge")))
          return true;
        if (!X.value && !G && !Q.value && !f.value && !g.value || N.value || le.value && !K || !f.value && v.type === "dblclick" || ce(v, S.value) && K || ce(v, C.value) && (!K || Q.value && K && !V.value) || !g.value && v.ctrlKey && K || !G && !Q.value && !Z && K)
          return false;
        if (!g && v.type === "touchstart" && ((I = v.touches) == null ? void 0 : I.length) > 1)
          return v.preventDefault(), false;
        if (!X.value && (v.type === "mousedown" || v.type === "touchstart") || l.value === true && Array.isArray(d.value) && d.value.includes(0) && F === 0 || Array.isArray(d.value) && !d.value.includes(F) && (v.type === "mousedown" || v.type === "touchstart"))
          return false;
        const ie = Array.isArray(d.value) && d.value.includes(F) || l.value === true && Array.isArray(d.value) && !d.value.includes(0) || !F || F <= 1;
        return (!v.ctrlKey || A.value || K) && ie;
      }), watch(
        [N, X],
        () => {
          N.value && !w.value ? ge.on("zoom", null) : N.value || ge.on("zoom", (v) => {
            W.value = { x: v.transform.x, y: v.transform.y, zoom: v.transform.k };
            const I = q(v.transform);
            P = Y(X.value, E ?? 0), M.viewportChange(I), M.move({ event: v, flowTransform: I });
          });
        },
        { immediate: true }
      ), watch(
        [N, Q, u, V, g, x, S],
        () => {
          Q.value && !V.value && !N.value ? ee.on(
            "wheel.zoom",
            (v) => {
              if (ce(v, S.value))
                return false;
              const I = V.value || b.value, G = g.value && v.ctrlKey;
              if (!(!x.value || Q.value || I || G))
                return false;
              v.preventDefault(), v.stopImmediatePropagation();
              const F = ee.property("__zoom").k || 1, K = mn();
              if (!A.value && v.ctrlKey && g.value && K) {
                const St = Oe(v), wr = Ho(v), br = F * 2 ** wr;
                ge.scaleTo(ee, br, St, v);
                return;
              }
              const ie = v.deltaMode === 1 ? 20 : 1;
              let de = u.value === $t.Vertical ? 0 : v.deltaX * ie, he = u.value === $t.Horizontal ? 0 : v.deltaY * ie;
              !K && v.shiftKey && u.value !== $t.Vertical && !de && he && (de = he, he = 0), ge.translateBy(
                ee,
                -(de / F) * c.value,
                -(he / F) * c.value
              );
              const Ae = q(ee.property("__zoom"));
              y && clearTimeout(y), J.value ? (M.move({ event: v, flowTransform: Ae }), M.viewportChange(Ae), y = setTimeout(() => {
                M.moveEnd({ event: v, flowTransform: Ae }), M.viewportChangeEnd(Ae), J.value = false;
              }, 150)) : (J.value = true, M.moveStart({ event: v, flowTransform: Ae }), M.viewportChangeStart(Ae));
            },
            { passive: false }
          ) : typeof ae < "u" && ee.on(
            "wheel.zoom",
            function(v, I) {
              const G = !x.value && v.type === "wheel" && !v.ctrlKey, Z = V.value || b.value, F = g.value && v.ctrlKey;
              if (!Z && !s.value && !F && v.type === "wheel" || G || ce(v, S.value))
                return null;
              v.preventDefault(), ae.call(this, v, I);
            },
            { passive: false }
          );
        },
        { immediate: true }
      );
    });
    function Y(re, se) {
      return se === 2 && Array.isArray(re) && re.includes(2);
    }
    function U(re, se) {
      return re.x !== se.x && !Number.isNaN(se.x) || re.y !== se.y && !Number.isNaN(se.y) || re.zoom !== se.k && !Number.isNaN(se.k);
    }
    function q(re) {
      return {
        x: re.x,
        y: re.y,
        zoom: re.k
      };
    }
    function ce(re, se) {
      return re.target.closest(`.${se}`);
    }
    return (re, se) => (openBlock(), createElementBlock("div", {
      ref_key: "viewportRef",
      ref: L,
      class: "vue-flow__viewport vue-flow__container"
    }, [
      createVNode(sd, {
        "is-selecting": oe.value,
        "selection-key-pressed": unref(B),
        class: normalizeClass({
          connecting: le.value,
          dragging: unref(O),
          draggable: unref(d) === true || Array.isArray(unref(d)) && unref(d).includes(0)
        })
      }, {
        default: withCtx(() => [
          createVNode(cd, null, {
            default: withCtx(() => [
              renderSlot(re.$slots, "default")
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["is-selecting", "selection-key-pressed", "class"])
    ], 512));
  }
}), hd = ["id"], gd = ["id"], vd = ["id"], pd = {
  name: "A11yDescriptions",
  compatConfig: { MODE: 3 }
}, md = /* @__PURE__ */ defineComponent({
  ...pd,
  setup(e3) {
    const { id: t, disableKeyboardA11y: n, ariaLiveMessage: o } = we();
    return (i, r) => (openBlock(), createElementBlock(Fragment, null, [
      createBaseVNode("div", {
        id: `${unref(Xi)}-${unref(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select a node. " + toDisplayString(unref(n) ? "" : "You can then use the arrow keys to move the node around.") + " You can then use the arrow keys to move the node around, press delete to remove it and press escape to cancel. ", 9, hd),
      createBaseVNode("div", {
        id: `${unref(Ui)}-${unref(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel. ", 8, gd),
      unref(n) ? createCommentVNode("", true) : (openBlock(), createElementBlock("div", {
        key: 0,
        id: `${unref(Au)}-${unref(t)}`,
        "aria-live": "assertive",
        "aria-atomic": "true",
        style: { position: "absolute", width: "1px", height: "1px", margin: "-1px", border: "0", padding: "0", overflow: "hidden", clip: "rect(0px, 0px, 0px, 0px)", "clip-path": "inset(100%)" }
      }, toDisplayString(unref(o)), 9, vd))
    ], 64));
  }
});
function yd() {
  const e3 = we();
  watch(
    () => e3.viewportHelper.value.viewportInitialized,
    (t) => {
      t && setTimeout(() => {
        e3.emits.init(e3), e3.emits.paneReady(e3);
      }, 1);
    }
  );
}
function _d(e3, t, n) {
  return n === R.Left ? e3 - t : n === R.Right ? e3 + t : e3;
}
function wd(e3, t, n) {
  return n === R.Top ? e3 - t : n === R.Bottom ? e3 + t : e3;
}
const po = function({
  radius: e3 = 10,
  centerX: t = 0,
  centerY: n = 0,
  position: o = R.Top,
  type: i
}) {
  return h("circle", {
    class: `vue-flow__edgeupdater vue-flow__edgeupdater-${i}`,
    cx: _d(t, e3, o),
    cy: wd(n, e3, o),
    r: e3,
    stroke: "transparent",
    fill: "transparent"
  });
};
po.props = ["radius", "centerX", "centerY", "position", "type"];
po.compatConfig = { MODE: 3 };
const li = po, bd = defineComponent({
  name: "Edge",
  compatConfig: { MODE: 3 },
  props: ["id"],
  setup(e3) {
    const {
      id: t,
      addSelectedEdges: n,
      connectionMode: o,
      edgeUpdaterRadius: i,
      emits: r,
      nodesSelectionActive: l,
      noPanClassName: a,
      getEdgeTypes: s,
      removeSelectedEdges: u,
      findEdge: c,
      findNode: d,
      isValidConnection: f,
      multiSelectionActive: g,
      disableKeyboardA11y: b,
      elementsSelectable: x,
      edgesUpdatable: S,
      edgesFocusable: C,
      hooks: M
    } = we(), _ = computed(() => c(e3.id)), { emit: N, on: O } = dc(_.value, r), k = inject(Sn), $ = getCurrentInstance(), T = ref(false), W = ref(false), L = ref(""), z = ref(null), w = ref("source"), J = ref(null), y = toRef(
      () => typeof _.value.selectable > "u" ? x.value : _.value.selectable
    ), P = toRef(() => typeof _.value.updatable > "u" ? S.value : _.value.updatable), E = toRef(() => typeof _.value.focusable > "u" ? C.value : _.value.focusable);
    provide(sc, e3.id), provide(uc, J);
    const D = computed(() => _.value.class instanceof Function ? _.value.class(_.value) : _.value.class), A = computed(() => _.value.style instanceof Function ? _.value.style(_.value) : _.value.style), B = computed(() => {
      const h2 = _.value.type || "default", m = k?.[`edge-${h2}`];
      if (m)
        return m;
      let v = _.value.template ?? s.value[h2];
      if (typeof v == "string" && $) {
        const I = Object.keys($.appContext.components);
        I && I.includes(h2) && (v = resolveComponent(h2, false));
      }
      return v && typeof v != "string" ? v : (r.error(new Se(Ee.EDGE_TYPE_MISSING, v)), false);
    }), { handlePointerDown: V } = dr({
      nodeId: L,
      handleId: z,
      type: w,
      isValidConnection: f,
      edgeUpdaterType: w,
      onEdgeUpdate: oe,
      onEdgeUpdateEnd: le
    });
    return () => {
      const h$1 = d(_.value.source), m = d(_.value.target), v = "pathOptions" in _.value ? _.value.pathOptions : {};
      if (!h$1 && !m)
        return r.error(new Se(Ee.EDGE_SOURCE_TARGET_MISSING, _.value.id, _.value.source, _.value.target)), null;
      if (!h$1)
        return r.error(new Se(Ee.EDGE_SOURCE_MISSING, _.value.id, _.value.source)), null;
      if (!m)
        return r.error(new Se(Ee.EDGE_TARGET_MISSING, _.value.id, _.value.target)), null;
      if (!_.value || _.value.hidden || h$1.hidden || m.hidden)
        return null;
      let I;
      o.value === je.Strict ? I = h$1.handleBounds.source : I = [...h$1.handleBounds.source || [], ...h$1.handleBounds.target || []];
      const G = Wo(I, _.value.sourceHandle);
      let Z;
      o.value === je.Strict ? Z = m.handleBounds.target : Z = [...m.handleBounds.target || [], ...m.handleBounds.source || []];
      const F = Wo(Z, _.value.targetHandle), K = G?.position || R.Bottom, ie = F?.position || R.Top, { x: de, y: he } = wt(h$1, G, K), { x: Ae, y: St } = wt(m, F, ie);
      return _.value.sourceX = de, _.value.sourceY = he, _.value.targetX = Ae, _.value.targetY = St, h(
        "g",
        {
          ref: J,
          key: e3.id,
          "data-id": e3.id,
          class: [
            "vue-flow__edge",
            `vue-flow__edge-${B.value === false ? "default" : _.value.type || "default"}`,
            a.value,
            D.value,
            {
              updating: T.value,
              selected: _.value.selected,
              animated: _.value.animated,
              inactive: !y.value && !M.value.edgeClick.hasListeners()
            }
          ],
          tabIndex: E.value ? 0 : void 0,
          "aria-label": _.value.ariaLabel === null ? void 0 : _.value.ariaLabel ?? `Edge from ${_.value.source} to ${_.value.target}`,
          "aria-describedby": E.value ? `${Ui}-${t}` : void 0,
          "aria-roledescription": "edge",
          role: E.value ? "group" : "img",
          ..._.value.domAttributes,
          onClick: U,
          onContextmenu: q,
          onDblclick: ce,
          onMouseenter: re,
          onMousemove: se,
          onMouseleave: ge,
          onKeyDown: E.value ? p : void 0
        },
        [
          W.value ? null : h(B.value === false ? s.value.default : B.value, {
            id: e3.id,
            sourceNode: h$1,
            targetNode: m,
            source: _.value.source,
            target: _.value.target,
            type: _.value.type,
            updatable: P.value,
            selected: _.value.selected,
            animated: _.value.animated,
            label: _.value.label,
            labelStyle: _.value.labelStyle,
            labelShowBg: _.value.labelShowBg,
            labelBgStyle: _.value.labelBgStyle,
            labelBgPadding: _.value.labelBgPadding,
            labelBgBorderRadius: _.value.labelBgBorderRadius,
            data: _.value.data,
            events: { ..._.value.events, ...O },
            style: A.value,
            markerStart: `url('#${Ht(_.value.markerStart, t)}')`,
            markerEnd: `url('#${Ht(_.value.markerEnd, t)}')`,
            sourcePosition: K,
            targetPosition: ie,
            sourceX: de,
            sourceY: he,
            targetX: Ae,
            targetY: St,
            sourceHandleId: _.value.sourceHandle,
            targetHandleId: _.value.targetHandle,
            interactionWidth: _.value.interactionWidth,
            ...v
          }),
          [
            P.value === "source" || P.value === true ? [
              h(
                "g",
                {
                  onMousedown: ee,
                  onMouseenter: X,
                  onMouseout: Q
                },
                h(li, {
                  position: K,
                  centerX: de,
                  centerY: he,
                  radius: i.value,
                  type: "source",
                  "data-type": "source"
                })
              )
            ] : null,
            P.value === "target" || P.value === true ? [
              h(
                "g",
                {
                  onMousedown: ae,
                  onMouseenter: X,
                  onMouseout: Q
                },
                h(li, {
                  position: ie,
                  centerX: Ae,
                  centerY: St,
                  radius: i.value,
                  type: "target",
                  "data-type": "target"
                })
              )
            ] : null
          ]
        ]
      );
    };
    function X() {
      T.value = true;
    }
    function Q() {
      T.value = false;
    }
    function oe(h2, m) {
      N.update({ event: h2, edge: _.value, connection: m });
    }
    function le(h2) {
      N.updateEnd({ event: h2, edge: _.value }), W.value = false;
    }
    function Y(h2, m) {
      h2.button === 0 && (W.value = true, L.value = m ? _.value.target : _.value.source, z.value = (m ? _.value.targetHandle : _.value.sourceHandle) ?? null, w.value = m ? "target" : "source", N.updateStart({ event: h2, edge: _.value }), V(h2));
    }
    function U(h2) {
      var m;
      const v = { event: h2, edge: _.value };
      y.value && (l.value = false, _.value.selected && g.value ? (u([_.value]), (m = J.value) == null || m.blur()) : n([_.value])), N.click(v);
    }
    function q(h2) {
      N.contextMenu({ event: h2, edge: _.value });
    }
    function ce(h2) {
      N.doubleClick({ event: h2, edge: _.value });
    }
    function re(h2) {
      N.mouseEnter({ event: h2, edge: _.value });
    }
    function se(h2) {
      N.mouseMove({ event: h2, edge: _.value });
    }
    function ge(h2) {
      N.mouseLeave({ event: h2, edge: _.value });
    }
    function ee(h2) {
      Y(h2, true);
    }
    function ae(h2) {
      Y(h2, false);
    }
    function p(h2) {
      var m;
      !b.value && Zi.includes(h2.key) && y.value && (h2.key === "Escape" ? ((m = J.value) == null || m.blur(), u([c(e3.id)])) : n([c(e3.id)]));
    }
  }
}), xd = bd, Ed = defineComponent({
  name: "ConnectionLine",
  compatConfig: { MODE: 3 },
  setup() {
    var e3;
    const {
      id: t,
      connectionMode: n,
      connectionStartHandle: o,
      connectionEndHandle: i,
      connectionPosition: r,
      connectionLineType: l,
      connectionLineStyle: a,
      connectionLineOptions: s,
      connectionStatus: u,
      viewport: c,
      findNode: d
    } = we(), f = (e3 = inject(Sn)) == null ? void 0 : e3["connection-line"], g = computed(() => {
      var M;
      return d((M = o.value) == null ? void 0 : M.nodeId);
    }), b = computed(() => {
      var M;
      return d((M = i.value) == null ? void 0 : M.nodeId) ?? null;
    }), x = computed(() => ({
      x: (r.value.x - c.value.x) / c.value.zoom,
      y: (r.value.y - c.value.y) / c.value.zoom
    })), S = computed(
      () => s.value.markerStart ? `url(#${Ht(s.value.markerStart, t)})` : ""
    ), C = computed(
      () => s.value.markerEnd ? `url(#${Ht(s.value.markerEnd, t)})` : ""
    );
    return () => {
      var M, _, N;
      if (!g.value || !o.value)
        return null;
      const O = o.value.id, k = o.value.type, $ = g.value.handleBounds;
      let T = $?.[k] ?? [];
      if (n.value === je.Loose) {
        const A = $?.[k === "source" ? "target" : "source"] ?? [];
        T = [...T, ...A];
      }
      if (!T)
        return null;
      const W = (O ? T.find((A) => A.id === O) : T[0]) ?? null, L = W?.position ?? R.Top, { x: z, y: w } = wt(g.value, W, L);
      let J = null;
      b.value && (n.value === je.Strict ? J = ((M = b.value.handleBounds[k === "source" ? "target" : "source"]) == null ? void 0 : M.find(
        (A) => {
          var B;
          return A.id === ((B = i.value) == null ? void 0 : B.id);
        }
      )) || null : J = ((_ = [...b.value.handleBounds.source ?? [], ...b.value.handleBounds.target ?? []]) == null ? void 0 : _.find(
        (A) => {
          var B;
          return A.id === ((B = i.value) == null ? void 0 : B.id);
        }
      )) || null);
      const y = ((N = i.value) == null ? void 0 : N.position) ?? (L ? jn[L] : null);
      if (!L || !y)
        return null;
      const P = l.value ?? s.value.type ?? et.Bezier;
      let E = "";
      const D = {
        sourceX: z,
        sourceY: w,
        sourcePosition: L,
        targetX: x.value.x,
        targetY: x.value.y,
        targetPosition: y
      };
      return P === et.Bezier ? [E] = vo(D) : P === et.Step ? [E] = eo({
        ...D,
        borderRadius: 0
      }) : P === et.SmoothStep ? [E] = eo(D) : P === et.SimpleBezier ? [E] = mr(D) : E = `M${z},${w} ${x.value.x},${x.value.y}`, h(
        "svg",
        { class: "vue-flow__edges vue-flow__connectionline vue-flow__container" },
        h(
          "g",
          { class: "vue-flow__connection" },
          f ? h(f, {
            sourceX: z,
            sourceY: w,
            sourcePosition: L,
            targetX: x.value.x,
            targetY: x.value.y,
            targetPosition: y,
            sourceNode: g.value,
            sourceHandle: W,
            targetNode: b.value,
            targetHandle: J,
            markerEnd: C.value,
            markerStart: S.value,
            connectionStatus: u.value
          }) : h("path", {
            d: E,
            class: [s.value.class, u.value, "vue-flow__connection-path"],
            style: {
              ...a.value,
              ...s.value.style
            },
            "marker-end": C.value,
            "marker-start": S.value
          })
        )
      );
    };
  }
}), Sd = Ed, Nd = ["id", "markerWidth", "markerHeight", "markerUnits", "orient"], Cd = {
  name: "MarkerType",
  compatConfig: { MODE: 3 }
}, Md = /* @__PURE__ */ defineComponent({
  ...Cd,
  props: {
    id: {},
    type: {},
    color: { default: "none" },
    width: { default: 12.5 },
    height: { default: 12.5 },
    markerUnits: { default: "strokeWidth" },
    orient: { default: "auto-start-reverse" },
    strokeWidth: { default: 1 }
  },
  setup(e3) {
    return (t, n) => (openBlock(), createElementBlock("marker", {
      id: t.id,
      class: "vue-flow__arrowhead",
      viewBox: "-10 -10 20 20",
      refX: "0",
      refY: "0",
      markerWidth: `${t.width}`,
      markerHeight: `${t.height}`,
      markerUnits: t.markerUnits,
      orient: t.orient
    }, [
      t.type === unref(qn).ArrowClosed ? (openBlock(), createElementBlock("polyline", {
        key: 0,
        style: normalizeStyle({
          stroke: t.color,
          fill: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        points: "-5,-4 0,0 -5,4 -5,-4"
      }, null, 4)) : createCommentVNode("", true),
      t.type === unref(qn).Arrow ? (openBlock(), createElementBlock("polyline", {
        key: 1,
        style: normalizeStyle({
          stroke: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        fill: "none",
        points: "-5,-4 0,0 -5,4"
      }, null, 4)) : createCommentVNode("", true)
    ], 8, Nd));
  }
}), Id = {
  class: "vue-flow__marker vue-flow__container",
  "aria-hidden": "true"
}, kd = {
  name: "MarkerDefinitions",
  compatConfig: { MODE: 3 }
}, Pd = /* @__PURE__ */ defineComponent({
  ...kd,
  setup(e3) {
    const { id: t, edges: n, connectionLineOptions: o, defaultMarkerColor: i } = we(), r = computed(() => {
      const l = /* @__PURE__ */ new Set(), a = [], s = (u) => {
        if (u) {
          const c = Ht(u, t);
          l.has(c) || (typeof u == "object" ? a.push({ ...u, id: c, color: u.color || i.value }) : a.push({ id: c, color: i.value, type: u }), l.add(c));
        }
      };
      for (const u of [o.value.markerEnd, o.value.markerStart])
        s(u);
      for (const u of n.value)
        for (const c of [u.markerStart, u.markerEnd])
          s(c);
      return a.sort((u, c) => u.id.localeCompare(c.id));
    });
    return (l, a) => (openBlock(), createElementBlock("svg", Id, [
      createBaseVNode("defs", null, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(r.value, (s) => (openBlock(), createBlock(Md, {
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
      ])
    ]));
  }
}), $d = {
  name: "Edges",
  compatConfig: { MODE: 3 }
}, Td = /* @__PURE__ */ defineComponent({
  ...$d,
  setup(e3) {
    const { findNode: t, getEdges: n, elevateEdgesOnSelect: o } = we();
    return (i, r) => (openBlock(), createElementBlock(Fragment, null, [
      createVNode(Pd),
      (openBlock(true), createElementBlock(Fragment, null, renderList(unref(n), (l) => (openBlock(), createElementBlock("svg", {
        key: l.id,
        class: "vue-flow__edges vue-flow__container",
        style: normalizeStyle({ zIndex: unref(qu)(l, unref(t), unref(o)) })
      }, [
        createVNode(unref(xd), {
          id: l.id
        }, null, 8, ["id"])
      ], 4))), 128)),
      createVNode(unref(Sd))
    ], 64));
  }
}), Dd = defineComponent({
  name: "Node",
  compatConfig: { MODE: 3 },
  props: ["id", "resizeObserver"],
  setup(e3) {
    const {
      id: t,
      noPanClassName: n,
      selectNodesOnDrag: o,
      nodesSelectionActive: i,
      multiSelectionActive: r,
      emits: l,
      removeSelectedNodes: a,
      addSelectedNodes: s,
      updateNodeDimensions: u,
      onUpdateNodeInternals: c,
      getNodeTypes: d,
      nodeExtent: f,
      elevateNodesOnSelect: g,
      disableKeyboardA11y: b,
      ariaLiveMessage: x,
      snapToGrid: S,
      snapGrid: C,
      nodeDragThreshold: M,
      nodesDraggable: _,
      elementsSelectable: N,
      nodesConnectable: O,
      nodesFocusable: k,
      hooks: $
    } = we(), T = ref(null);
    provide(ur, T), provide(sr, e3.id);
    const W = inject(Sn), L = getCurrentInstance(), z = hr(), { node: w, parentNode: J } = fr(e3.id), { emit: y, on: P } = vc(w, l), E = toRef(() => typeof w.draggable > "u" ? _.value : w.draggable), D = toRef(() => typeof w.selectable > "u" ? N.value : w.selectable), A = toRef(() => typeof w.connectable > "u" ? O.value : w.connectable), B = toRef(() => typeof w.focusable > "u" ? k.value : w.focusable), V = computed(
      () => D.value || E.value || $.value.nodeClick.hasListeners() || $.value.nodeDoubleClick.hasListeners() || $.value.nodeMouseEnter.hasListeners() || $.value.nodeMouseMove.hasListeners() || $.value.nodeMouseLeave.hasListeners()
    ), X = toRef(() => !!w.dimensions.width && !!w.dimensions.height), Q = computed(() => {
      const m = w.type || "default", v = W?.[`node-${m}`];
      if (v)
        return v;
      let I = w.template || d.value[m];
      if (typeof I == "string" && L) {
        const G = Object.keys(L.appContext.components);
        G && G.includes(m) && (I = resolveComponent(m, false));
      }
      return I && typeof I != "string" ? I : (l.error(new Se(Ee.NODE_TYPE_MISSING, I)), false);
    }), oe = cr({
      id: e3.id,
      el: T,
      disabled: () => !E.value,
      selectable: D,
      dragHandle: () => w.dragHandle,
      onStart(m) {
        y.dragStart(m);
      },
      onDrag(m) {
        y.drag(m);
      },
      onStop(m) {
        y.dragStop(m);
      },
      onClick(m) {
        p(m);
      }
    }), le = computed(() => w.class instanceof Function ? w.class(w) : w.class), Y = computed(() => {
      const m = (w.style instanceof Function ? w.style(w) : w.style) || {}, v = w.width instanceof Function ? w.width(w) : w.width, I = w.height instanceof Function ? w.height(w) : w.height;
      return !m.width && v && (m.width = typeof v == "string" ? v : `${v}px`), !m.height && I && (m.height = typeof I == "string" ? I : `${I}px`), m;
    }), U = toRef(() => Number(w.zIndex ?? Y.value.zIndex ?? 0));
    return c((m) => {
      (m.includes(e3.id) || !m.length) && ce();
    }), onMounted(() => {
      watch(
        () => w.hidden,
        (m = false, v, I) => {
          !m && T.value && (e3.resizeObserver.observe(T.value), I(() => {
            T.value && e3.resizeObserver.unobserve(T.value);
          }));
        },
        { immediate: true, flush: "post" }
      );
    }), watch([() => w.type, () => w.sourcePosition, () => w.targetPosition], () => {
      nextTick(() => {
        u([{ id: e3.id, nodeElement: T.value, forceUpdate: true }]);
      });
    }), watch(
      [
        () => w.position.x,
        () => w.position.y,
        () => {
          var m;
          return (m = J.value) == null ? void 0 : m.computedPosition.x;
        },
        () => {
          var m;
          return (m = J.value) == null ? void 0 : m.computedPosition.y;
        },
        () => {
          var m;
          return (m = J.value) == null ? void 0 : m.computedPosition.z;
        },
        U,
        () => w.selected,
        () => w.dimensions.height,
        () => w.dimensions.width,
        () => {
          var m;
          return (m = J.value) == null ? void 0 : m.dimensions.height;
        },
        () => {
          var m;
          return (m = J.value) == null ? void 0 : m.dimensions.width;
        }
      ],
      ([m, v, I, G, Z, F]) => {
        const K = {
          x: m,
          y: v,
          z: F + (g.value && w.selected ? 1e3 : 0)
        };
        typeof I < "u" && typeof G < "u" ? w.computedPosition = Gu({ x: I, y: G, z: Z }, K) : w.computedPosition = K;
      },
      { flush: "post", immediate: true }
    ), watch([() => w.extent, f], ([m, v], [I, G]) => {
      (m !== I || v !== G) && q();
    }), w.extent === "parent" || typeof w.extent == "object" && "range" in w.extent && w.extent.range === "parent" ? Ln(() => X).toBe(true).then(q) : q(), () => w.hidden ? null : h(
      "div",
      {
        ref: T,
        "data-id": w.id,
        class: [
          "vue-flow__node",
          `vue-flow__node-${Q.value === false ? "default" : w.type || "default"}`,
          {
            [n.value]: E.value,
            dragging: oe?.value,
            draggable: E.value,
            selected: w.selected,
            selectable: D.value,
            parent: w.isParent
          },
          le.value
        ],
        style: {
          visibility: X.value ? "visible" : "hidden",
          zIndex: w.computedPosition.z ?? U.value,
          transform: `translate(${w.computedPosition.x}px,${w.computedPosition.y}px)`,
          pointerEvents: V.value ? "all" : "none",
          ...Y.value
        },
        tabIndex: B.value ? 0 : void 0,
        role: B.value ? "group" : void 0,
        "aria-describedby": b.value ? void 0 : `${Xi}-${t}`,
        "aria-label": w.ariaLabel,
        "aria-roledescription": "node",
        ...w.domAttributes,
        onMouseenter: re,
        onMousemove: se,
        onMouseleave: ge,
        onContextmenu: ee,
        onClick: p,
        onDblclick: ae,
        onKeydown: h$1
      },
      [
        h(Q.value === false ? d.value.default : Q.value, {
          id: w.id,
          type: w.type,
          data: w.data,
          events: { ...w.events, ...P },
          selected: w.selected,
          resizing: w.resizing,
          dragging: oe.value,
          connectable: A.value,
          position: w.computedPosition,
          dimensions: w.dimensions,
          isValidTargetPos: w.isValidTargetPos,
          isValidSourcePos: w.isValidSourcePos,
          parent: w.parentNode,
          parentNodeId: w.parentNode,
          zIndex: w.computedPosition.z ?? U.value,
          targetPosition: w.targetPosition,
          sourcePosition: w.sourcePosition,
          label: w.label,
          dragHandle: w.dragHandle,
          onUpdateNodeInternals: ce
        })
      ]
    );
    function q() {
      const m = w.computedPosition, { computedPosition: v, position: I } = ho(
        w,
        S.value ? En(m, C.value) : m,
        l.error,
        f.value,
        J.value
      );
      (w.computedPosition.x !== v.x || w.computedPosition.y !== v.y) && (w.computedPosition = { ...w.computedPosition, ...v }), (w.position.x !== I.x || w.position.y !== I.y) && (w.position = I);
    }
    function ce() {
      T.value && u([{ id: e3.id, nodeElement: T.value, forceUpdate: true }]);
    }
    function re(m) {
      oe?.value || y.mouseEnter({ event: m, node: w });
    }
    function se(m) {
      oe?.value || y.mouseMove({ event: m, node: w });
    }
    function ge(m) {
      oe?.value || y.mouseLeave({ event: m, node: w });
    }
    function ee(m) {
      return y.contextMenu({ event: m, node: w });
    }
    function ae(m) {
      return y.doubleClick({ event: m, node: w });
    }
    function p(m) {
      D.value && (!o.value || !E.value || M.value > 0) && Qn(
        w,
        r.value,
        s,
        a,
        i,
        false,
        T.value
      ), y.click({ event: m, node: w });
    }
    function h$1(m) {
      if (!(Jn(m) || b.value))
        if (Zi.includes(m.key) && D.value) {
          const v = m.key === "Escape";
          Qn(
            w,
            r.value,
            s,
            a,
            i,
            v,
            T.value
          );
        } else E.value && w.selected && ft[m.key] && (m.preventDefault(), x.value = `Moved selected node ${m.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~w.position.x}, y: ${~~w.position.y}`, z(
          {
            x: ft[m.key].x,
            y: ft[m.key].y
          },
          m.shiftKey
        ));
    }
  }
}), Ad = Dd, Od = {
  height: "0",
  width: "0"
}, zd = {
  name: "EdgeLabelRenderer",
  compatConfig: { MODE: 3 }
}, Bd = /* @__PURE__ */ defineComponent({
  ...zd,
  setup(e3) {
    const { viewportRef: t } = we(), n = toRef(() => {
      var o;
      return (o = t.value) == null ? void 0 : o.getElementsByClassName("vue-flow__edge-labels")[0];
    });
    return (o, i) => (openBlock(), createElementBlock("svg", null, [
      (openBlock(), createElementBlock("foreignObject", Od, [
        (openBlock(), createBlock(Teleport, {
          to: n.value,
          disabled: !n.value
        }, [
          renderSlot(o.$slots, "default")
        ], 8, ["to", "disabled"]))
      ]))
    ]));
  }
});
function Vd(e3 = { includeHiddenNodes: false }) {
  const { nodes: t } = we();
  return computed(() => {
    if (t.value.length === 0)
      return false;
    for (const n of t.value)
      if ((e3.includeHiddenNodes || !n.hidden) && (n?.handleBounds === void 0 || n.dimensions.width === 0 || n.dimensions.height === 0))
        return false;
    return true;
  });
}
const Rd = { class: "vue-flow__nodes vue-flow__container" }, Hd = {
  name: "Nodes",
  compatConfig: { MODE: 3 }
}, Ld = /* @__PURE__ */ defineComponent({
  ...Hd,
  setup(e3) {
    const { getNodes: t, updateNodeDimensions: n, emits: o } = we(), i = Vd(), r = ref();
    return watch(
      i,
      (l) => {
        l && nextTick(() => {
          o.nodesInitialized(t.value);
        });
      },
      { immediate: true }
    ), onMounted(() => {
      r.value = new ResizeObserver((l) => {
        const a = l.map((s) => ({
          id: s.target.getAttribute("data-id"),
          nodeElement: s.target,
          forceUpdate: true
        }));
        nextTick(() => n(a));
      });
    }), onBeforeUnmount(() => {
      var l;
      return (l = r.value) == null ? void 0 : l.disconnect();
    }), (l, a) => (openBlock(), createElementBlock("div", Rd, [
      r.value ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(unref(t), (s, u, c, d) => {
        const f = [s.id];
        if (d && d.key === s.id && isMemoSame(d, f))
          return d;
        const g = (openBlock(), createBlock(unref(Ad), {
          id: s.id,
          key: s.id,
          "resize-observer": r.value
        }, null, 8, ["id", "resize-observer"]));
        return g.memo = f, g;
      }, a, 0), 128)) : createCommentVNode("", true)
    ]));
  }
});
function Fd() {
  const { emits: e3 } = we();
  onMounted(() => {
    if (ar()) {
      const t = document.querySelector(".vue-flow__pane");
      t && window.getComputedStyle(t).zIndex !== "1" && e3.error(new Se(Ee.MISSING_STYLES));
    }
  });
}
const Yd = /* @__PURE__ */ createBaseVNode("div", { class: "vue-flow__edge-labels" }, null, -1), Gd = {
  name: "VueFlow",
  compatConfig: { MODE: 3 }
}, Xd = /* @__PURE__ */ defineComponent({
  ...Gd,
  props: {
    id: {},
    modelValue: {},
    nodes: {},
    edges: {},
    edgeTypes: {},
    nodeTypes: {},
    connectionMode: {},
    connectionLineType: {},
    connectionLineStyle: { default: void 0 },
    connectionLineOptions: { default: void 0 },
    connectionRadius: {},
    isValidConnection: { type: [Function, null], default: void 0 },
    deleteKeyCode: { default: void 0 },
    selectionKeyCode: { type: [Boolean, null], default: void 0 },
    multiSelectionKeyCode: { default: void 0 },
    zoomActivationKeyCode: { default: void 0 },
    panActivationKeyCode: { default: void 0 },
    snapToGrid: { type: Boolean, default: void 0 },
    snapGrid: {},
    onlyRenderVisibleElements: { type: Boolean, default: void 0 },
    edgesUpdatable: { type: [Boolean, String], default: void 0 },
    nodesDraggable: { type: Boolean, default: void 0 },
    nodesConnectable: { type: Boolean, default: void 0 },
    nodeDragThreshold: {},
    elementsSelectable: { type: Boolean, default: void 0 },
    selectNodesOnDrag: { type: Boolean, default: void 0 },
    panOnDrag: { type: [Boolean, Array], default: void 0 },
    minZoom: {},
    maxZoom: {},
    defaultViewport: {},
    translateExtent: {},
    nodeExtent: {},
    defaultMarkerColor: {},
    zoomOnScroll: { type: Boolean, default: void 0 },
    zoomOnPinch: { type: Boolean, default: void 0 },
    panOnScroll: { type: Boolean, default: void 0 },
    panOnScrollSpeed: {},
    panOnScrollMode: {},
    paneClickDistance: {},
    zoomOnDoubleClick: { type: Boolean, default: void 0 },
    preventScrolling: { type: Boolean, default: void 0 },
    selectionMode: {},
    edgeUpdaterRadius: {},
    fitViewOnInit: { type: Boolean, default: void 0 },
    connectOnClick: { type: Boolean, default: void 0 },
    applyDefault: { type: Boolean, default: void 0 },
    autoConnect: { type: [Boolean, Function], default: void 0 },
    noDragClassName: {},
    noWheelClassName: {},
    noPanClassName: {},
    defaultEdgeOptions: {},
    elevateEdgesOnSelect: { type: Boolean, default: void 0 },
    elevateNodesOnSelect: { type: Boolean, default: void 0 },
    disableKeyboardA11y: { type: Boolean, default: void 0 },
    edgesFocusable: { type: Boolean, default: void 0 },
    nodesFocusable: { type: Boolean, default: void 0 },
    autoPanOnConnect: { type: Boolean, default: void 0 },
    autoPanOnNodeDrag: { type: Boolean, default: void 0 },
    autoPanSpeed: {}
  },
  emits: ["nodesChange", "edgesChange", "nodesInitialized", "paneReady", "init", "updateNodeInternals", "error", "connect", "connectStart", "connectEnd", "clickConnectStart", "clickConnectEnd", "moveStart", "move", "moveEnd", "selectionDragStart", "selectionDrag", "selectionDragStop", "selectionContextMenu", "selectionStart", "selectionEnd", "viewportChangeStart", "viewportChange", "viewportChangeEnd", "paneScroll", "paneClick", "paneContextMenu", "paneMouseEnter", "paneMouseMove", "paneMouseLeave", "edgeUpdate", "edgeContextMenu", "edgeMouseEnter", "edgeMouseMove", "edgeMouseLeave", "edgeDoubleClick", "edgeClick", "edgeUpdateStart", "edgeUpdateEnd", "nodeContextMenu", "nodeMouseEnter", "nodeMouseMove", "nodeMouseLeave", "nodeDoubleClick", "nodeClick", "nodeDragStart", "nodeDrag", "nodeDragStop", "miniMapNodeClick", "miniMapNodeDoubleClick", "miniMapNodeMouseEnter", "miniMapNodeMouseMove", "miniMapNodeMouseLeave", "update:modelValue", "update:nodes", "update:edges"],
  setup(e3, { expose: t, emit: n }) {
    const o = e3, i = useSlots(), r = kn(o, "modelValue", n), l = kn(o, "nodes", n), a = kn(o, "edges", n), s = we(o), u = _c({ modelValue: r, nodes: l, edges: a }, o, s);
    return bc(n, s.hooks), yd(), Fd(), provide(Sn, i), onUnmounted(u), t(s), (c, d) => (openBlock(), createElementBlock("div", {
      ref: unref(s).vueFlowRef,
      class: "vue-flow"
    }, [
      createVNode(fd, null, {
        default: withCtx(() => [
          createVNode(Td),
          Yd,
          createVNode(Ld),
          renderSlot(c.$slots, "zoom-pane")
        ]),
        _: 3
      }),
      renderSlot(c.$slots, "default"),
      createVNode(md)
    ], 512));
  }
}), Ud = ["id", "d", "marker-end"], Zd = { class: "vue-flow__edge-label" }, Wd = {
  key: 0,
  class: "label-input-wrapper"
}, Kd = {
  inheritAttrs: false
}, qd = /* @__PURE__ */ defineComponent({
  ...Kd,
  __name: "EditableEdge",
  props: {
    id: {},
    sourceNode: {},
    targetNode: {},
    source: {},
    target: {},
    type: {},
    label: { type: [String, Object, Function] },
    style: {},
    selected: { type: Boolean },
    sourcePosition: {},
    targetPosition: {},
    sourceHandleId: {},
    targetHandleId: {},
    animated: { type: Boolean },
    updatable: { type: Boolean },
    markerStart: {},
    markerEnd: {},
    curvature: {},
    interactionWidth: {},
    data: {},
    events: {},
    labelStyle: {},
    labelShowBg: { type: Boolean },
    labelBgStyle: {},
    labelBgPadding: {},
    labelBgBorderRadius: {},
    sourceX: {},
    sourceY: {},
    targetX: {},
    targetY: {}
  },
  emits: ["change"],
  setup(e3, { emit: t }) {
    const n = e3, o = t, i = useTemplateRef("labelInput"), r = ref(""), l = ref(false);
    let a = 0;
    const s = async () => {
      let f = Date.now();
      f - a < 500 && !l.value && await u(), a = f;
    }, u = async () => {
      r.value = n.label, l.value = true, await nextTick(), i.value.focus();
    }, c = () => {
      l.value = false, o("change", r.value);
    }, d = computed(() => vo(n));
    return (f, g) => (openBlock(), createElementBlock(Fragment, null, [
      createBaseVNode("path", {
        id: e3.id,
        style: normalizeStyle(e3.style),
        class: "vue-flow__edge-path",
        d: d.value[0],
        "marker-end": e3.markerEnd
      }, null, 12, Ud),
      createVNode(unref(Bd), null, {
        default: withCtx(() => [
          createBaseVNode("div", {
            style: normalizeStyle({
              pointerEvents: "all",
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${d.value[1]}px,${d.value[2]}px)`
            }),
            class: "nodrag nopan editable-edge-label",
            onClick: g[2] || (g[2] = (b) => s())
          }, [
            createBaseVNode("div", Zd, toDisplayString(e3.label), 1),
            l.value ? (openBlock(), createElementBlock("div", Wd, [
              withDirectives(createBaseVNode("input", {
                ref: "labelInput",
                "onUpdate:modelValue": g[0] || (g[0] = (b) => r.value = b),
                class: "label-input",
                onBlur: g[1] || (g[1] = (b) => l.value = false),
                onKeypress: withKeys(c, ["enter"])
              }, null, 544), [
                [vModelText, r.value]
              ])
            ])) : createCommentVNode("", true)
          ], 4)
        ]),
        _: 1
      })
    ], 64));
  }
}), Jd = {
  key: 0,
  class: "label-input-wrapper"
}, jd = /* @__PURE__ */ defineComponent({
  __name: "EditableNode",
  props: {
    id: {},
    type: {},
    selected: { type: Boolean },
    connectable: { type: [Boolean, Number, String, Function] },
    position: {},
    dimensions: {},
    label: {},
    isValidTargetPos: { type: Function },
    isValidSourcePos: { type: Function },
    parent: {},
    parentNodeId: {},
    dragging: { type: Boolean },
    resizing: { type: Boolean },
    zIndex: {},
    targetPosition: {},
    sourcePosition: {},
    dragHandle: {},
    data: {},
    events: {}
  },
  emits: ["change"],
  setup(e3, { emit: t }) {
    const n = e3, o = t, i = useTemplateRef("labelInput"), r = ref(""), l = ref(false);
    let a = 0;
    const s = async () => {
      let d = Date.now();
      d - a < 500 && !l.value && await u(), a = d;
    }, u = async () => {
      r.value = n.label, l.value = true, await nextTick(), i.value.focus();
    }, c = () => {
      l.value = false, o("change", r.value);
    };
    return (d, f) => (openBlock(), createElementBlock("div", {
      onClick: f[2] || (f[2] = (g) => s())
    }, [
      createBaseVNode("div", null, toDisplayString(e3.label), 1),
      l.value ? (openBlock(), createElementBlock("div", Jd, [
        withDirectives(createBaseVNode("input", {
          ref: "labelInput",
          "onUpdate:modelValue": f[0] || (f[0] = (g) => r.value = g),
          class: "label-input",
          onBlur: f[1] || (f[1] = (g) => l.value = false),
          onKeypress: withKeys(c, ["enter"])
        }, null, 544), [
          [vModelText, r.value]
        ])
      ])) : createCommentVNode("", true),
      e3.data.hasInput ? (openBlock(), createBlock(unref(bt), {
        key: 1,
        id: "a",
        type: "target",
        position: e3.targetPosition
      }, null, 8, ["position"])) : createCommentVNode("", true),
      e3.data.hasOutput ? (openBlock(), createBlock(unref(bt), {
        key: 2,
        id: "b",
        type: "source",
        position: e3.sourcePosition
      }, null, 8, ["position"])) : createCommentVNode("", true)
    ]));
  }
}), Qd = { class: "chart-controls" }, ef = { class: "chart-controls-left" }, tf = { class: "chart-controls-right" }, nf = { key: 0 }, of = { key: 1 }, _r = /* @__PURE__ */ defineComponent({
  __name: "NodeEditor",
  props: {
    modelValue: {},
    nodeContainerClass: { type: [Boolean, null, String, Object, Array], default: "" }
  },
  emits: ["update:modelValue"],
  setup(e3, { emit: t }) {
    const n = t, o = ref(false), i = ref([]), r = ref(), l = ref(""), a = computed(() => (i.value.forEach((k, $) => {
      if (k.id === l.value)
        return $;
    }), -1)), s = computed({
      get: () => {
        const k = e3.modelValue;
        for (const $ of k)
          $.data = {}, $.type === "input" ? ($.data.hasInput = false, $.data.hasOutput = true) : $.type === "output" ? ($.data.hasInput = true, $.data.hasOutput = false) : ($.data.hasInput = true, $.data.hasOutput = true), $.class = "vue-flow__node-default", $.type = "editable";
        for (const $ of k)
          $.events = {
            click: () => {
              l.value = $.id;
            }
          };
        return k;
      },
      set: (k) => {
        n("update:modelValue", JSON.parse(JSON.stringify(k)));
      }
    }), { addEdges: u, removeEdges: c } = we();
    onMounted(() => {
      document.removeEventListener("keypress", S), document.addEventListener("keypress", S);
    }), onBeforeUnmount(() => {
      document.removeEventListener("keypress", S);
    });
    const d = (k) => {
      r.value = k;
    };
    i.value = s.value;
    const f = (k) => ({
      [R.Top]: R.Right,
      [R.Right]: R.Bottom,
      [R.Bottom]: R.Left,
      [R.Left]: R.Top
    })[k], g = () => {
      if (a.value > -1) {
        const k = i.value[a.value];
        if (!k.sourcePosition) return;
        k.sourcePosition = f(k.sourcePosition);
      }
    }, b = () => {
      if (a.value > -1) {
        const k = i.value[a.value];
        if (!k.targetPosition) return;
        k.targetPosition = f(k.targetPosition);
      }
    }, x = (k) => {
      window.scrollBy(0, k.deltaY);
    }, S = (k) => {
      o.value && k.ctrlKey == true && ((k.key == "+" || k.key == "=") && r.value?.zoomIn(), k.key == "-" && r.value?.zoomOut());
    }, C = async () => {
      await r.value?.fitView();
    }, M = () => {
      let k = false, $ = { x: Math.random() * 200, y: Math.random() * 200 };
      if (a.value > -1) {
        const L = i.value[a.value];
        L.data?.hasOutput && ($ = { x: L.position.x + 200, y: L.position.y + 50 }, k = true);
      }
      const T = i.value.length, W = `node-${T}`;
      if (i.value.push({
        id: W,
        label: "Node " + T,
        sourcePosition: R.Right,
        targetPosition: R.Left,
        class: "vue-flow__node-default",
        type: "editable",
        data: {
          hasInput: true,
          hasOutput: true
        },
        events: {
          click: () => {
            l.value = W;
          }
        },
        // position: { x: Math.random() * vueFlowInstance.value.dimensions.width, y: Math.random() * vueFlowInstance.value.dimensions.height }
        position: $
      }), k) {
        let L = `edge-${T + 1}`;
        i.value.push({
          id: L,
          source: l.value,
          target: W,
          type: "editable",
          label: `EDGE ${T + 1}`,
          animated: true,
          events: {
            click: () => {
              l.value = L;
            }
          }
        });
      }
    }, _ = (k, $) => {
      for (let T = 0; T < i.value.length; T++)
        if (i.value[T].id == $) {
          i.value[T].label = k;
          break;
        }
    }, N = (k) => {
      const T = {
        id: `edge-${i.value.length}`,
        source: k.source,
        target: k.target,
        type: "editable",
        label: "New Edge",
        interactionWidth: 400,
        animated: true,
        events: {
          click: () => {
            l.value = T.id;
          }
        }
      };
      u([T]);
    }, O = (k) => {
      c(k.edge.id);
    };
    return (k, $) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(["node-editor-wrapper", e3.nodeContainerClass]),
      onMouseover: $[1] || ($[1] = (T) => o.value = true),
      onMouseleave: $[2] || ($[2] = (T) => o.value = false)
    }, [
      createBaseVNode("div", Qd, [
        createBaseVNode("div", ef, [
          createBaseVNode("div", null, [
            $[3] || ($[3] = createBaseVNode("b", null, "Selected Node:", -1)),
            createTextVNode(" " + toDisplayString(l.value ? l.value : "none"), 1)
          ])
        ]),
        createBaseVNode("div", tf, [
          createBaseVNode("div", null, [
            createBaseVNode("button", {
              class: "button-default",
              onClick: M
            }, "Add Node")
          ]),
          createBaseVNode("div", null, [
            createBaseVNode("button", {
              class: "button-default",
              onClick: C
            }, "Center")
          ]),
          a.value > -1 ? (openBlock(), createElementBlock("div", nf, [
            createBaseVNode("button", {
              class: "button-default",
              onClick: b
            }, "Shift Input Position")
          ])) : createCommentVNode("", true),
          a.value > -1 ? (openBlock(), createElementBlock("div", of, [
            createBaseVNode("button", {
              class: "button-default",
              onClick: g
            }, "Shift Output Position")
          ])) : createCommentVNode("", true)
        ])
      ]),
      i.value && i.value.length ? (openBlock(), createBlock(unref(Xd), {
        key: 0,
        modelValue: i.value,
        "onUpdate:modelValue": $[0] || ($[0] = (T) => i.value = T),
        class: "nowheel",
        "prevent-scrolling": true,
        "zoom-on-scroll": false,
        "fit-view-on-init": true,
        onConnect: N,
        onPaneReady: d,
        onEdgeContextMenu: O,
        onWheel: withModifiers(x, ["prevent"])
      }, {
        "node-editable": withCtx((T) => [
          createVNode(jd, mergeProps(T, {
            onChange: (W) => _(W, T.id)
          }), null, 16, ["onChange"])
        ]),
        "edge-editable": withCtx((T) => [
          createVNode(qd, mergeProps(T, {
            onChange: (W) => _(W, T.id)
          }), null, 16, ["onChange"])
        ]),
        _: 1
      }, 8, ["modelValue"])) : createCommentVNode("", true)
    ], 34));
  }
}), rf = /* @__PURE__ */ defineComponent({
  __name: "StateEditor",
  props: /* @__PURE__ */ mergeModels({
    layout: {},
    nodeContainerClass: { type: [Boolean, null, String, Object, Array], default: "" }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ mergeModels(["update:modelValue"], ["update:modelValue"]),
  setup(e3, { emit: t }) {
    const n = t, o = useModel(e3, "modelValue"), i = computed({
      get: () => {
        const l = {}, a = [], s = {};
        if (!o.value)
          return a;
        let u = 0;
        for (const [c, d] of Object.entries(o.value)) {
          const f = {
            id: c,
            label: c,
            position: e3.layout[c]?.position || { x: 200 * u, y: 100 },
            targetPosition: e3.layout[c]?.targetPosition || R.Left,
            sourcePosition: e3.layout[c]?.sourcePosition || R.Right
          };
          d?.type === "final" && (f.type = "output", f.class = "default-output-node"), s[c] = f;
        }
        for (const [c, d] of Object.entries(o.value)) {
          if (d?.on)
            for (const [f, g] of Object.entries(d.on)) {
              const b = g.target || g;
              a.push({
                id: `${c}-${b}`,
                source: c,
                target: b,
                label: f,
                animated: true,
                type: "smoothstep"
                // Use smoothstep for better separation of bidirectional edges
              }), l[b] = true;
            }
          u++;
        }
        for (const [c, d] of Object.entries(s))
          l[c] || (d.type = "input", d.class = "default-input-node"), a.push(d);
        return a;
      },
      set: (l) => {
        r(l);
      }
    }), r = (l) => {
      const a = {}, s = {}, u = {};
      for (const c of l) {
        const d = c.label;
        c.type === "input" ? u[d] = {
          on: {}
        } : c.type === "output" ? u[d] = {
          type: "final"
        } : c.source && c.target ? (a[c.source] = a[c.source] || {}, a[c.source][d] = {
          target: c.target
        }) : u[d] = {
          on: {}
        }, s[c.id] = d;
      }
      for (const [c, d] of Object.entries(a)) {
        const f = s[c];
        for (const [g, b] of Object.entries(d))
          u[f] || (u[f] = { on: {} }), u[f].on[g] = b;
      }
      n("update:modelValue", u);
    };
    return (l, a) => (openBlock(), createElementBlock("div", null, [
      createVNode(_r, {
        modelValue: i.value,
        "onUpdate:modelValue": a[0] || (a[0] = (s) => i.value = s),
        "node-container-class": e3.nodeContainerClass
      }, null, 8, ["modelValue", "node-container-class"])
    ]));
  }
});
var noop$2 = { value: () => {
} };
function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t))
      throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}
function Dispatch(_) {
  this._ = _;
}
function parseTypenames$1(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0)
      name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t))
      throw new Error("unknown type: " + t);
    return { type: t, name };
  });
}
Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._, T = parseTypenames$1(typename + "", _), t, i = -1, n = T.length;
    if (arguments.length < 2) {
      while (++i < n)
        if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name)))
          return t;
      return;
    }
    if (callback != null && typeof callback !== "function")
      throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type)
        _[t] = set$1(_[t], typename.name, callback);
      else if (callback == null)
        for (t in _)
          _[t] = set$1(_[t], typename.name, null);
    }
    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _)
      copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0)
      for (var args = new Array(n), i = 0, n, t; i < n; ++i)
        args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type))
      throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i)
      t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type))
      throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i)
      t[i].value.apply(that, args);
  }
};
function get$1(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}
function set$1(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop$2, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null)
    type.push({ name, value: callback });
  return type;
}
var xhtml = "http://www.w3.org/1999/xhtml";
const namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns")
    name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? { space: namespaces[prefix], local: name } : name;
}
function creatorInherit(name) {
  return function() {
    var document2 = this.ownerDocument, uri = this.namespaceURI;
    return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
  };
}
function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}
function creator(name) {
  var fullname = namespace(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}
function none() {
}
function selector(selector2) {
  return selector2 == null ? none : function() {
    return this.querySelector(selector2);
  };
}
function selection_select(select2) {
  if (typeof select2 !== "function")
    select2 = selector(select2);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select2.call(node, node.__data__, i, group))) {
        if ("__data__" in node)
          subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }
  return new Selection$1(subgroups, this._parents);
}
function array(x) {
  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}
function empty() {
  return [];
}
function selectorAll(selector2) {
  return selector2 == null ? empty : function() {
    return this.querySelectorAll(selector2);
  };
}
function arrayAll(select2) {
  return function() {
    return array(select2.apply(this, arguments));
  };
}
function selection_selectAll(select2) {
  if (typeof select2 === "function")
    select2 = arrayAll(select2);
  else
    select2 = selectorAll(select2);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select2.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }
  return new Selection$1(subgroups, parents);
}
function matcher(selector2) {
  return function() {
    return this.matches(selector2);
  };
}
function childMatcher(selector2) {
  return function(node) {
    return node.matches(selector2);
  };
}
var find = Array.prototype.find;
function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}
function childFirst() {
  return this.firstElementChild;
}
function selection_selectChild(match) {
  return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}
var filter = Array.prototype.filter;
function children() {
  return Array.from(this.children);
}
function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}
function selection_selectChildren(match) {
  return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}
function selection_filter(match) {
  if (typeof match !== "function")
    match = matcher(match);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Selection$1(subgroups, this._parents);
}
function sparse(update) {
  return new Array(update.length);
}
function selection_enter() {
  return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
}
function EnterNode(parent, datum2) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum2;
}
EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function(selector2) {
    return this._parent.querySelector(selector2);
  },
  querySelectorAll: function(selector2) {
    return this._parent.querySelectorAll(selector2);
  }
};
function constant$3(x) {
  return function() {
    return x;
  };
}
function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0, node, groupLength = group.length, dataLength = data.length;
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}
function bindKey(parent, group, enter, update, exit, data, key) {
  var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
      exit[i] = node;
    }
  }
}
function datum(node) {
  return node.__data__;
}
function selection_data(value, key) {
  if (!arguments.length)
    return Array.from(this, datum);
  var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
  if (typeof value !== "function")
    value = constant$3(value);
  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1)
          i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength)
          ;
        previous._next = next || null;
      }
    }
  }
  update = new Selection$1(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}
function arraylike(data) {
  return typeof data === "object" && "length" in data ? data : Array.from(data);
}
function selection_exit() {
  return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
}
function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter)
      enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update)
      update = update.selection();
  }
  if (onexit == null)
    exit.remove();
  else
    onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}
function selection_merge(context) {
  var selection2 = context.selection ? context.selection() : context;
  for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Selection$1(merges, this._parents);
}
function selection_order() {
  for (var groups = this._groups, j = -1, m = groups.length; ++j < m; ) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4)
          next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
}
function selection_sort(compare) {
  if (!compare)
    compare = ascending;
  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }
  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }
  return new Selection$1(sortgroups, this._parents).order();
}
function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}
function selection_nodes() {
  return Array.from(this);
}
function selection_node() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node)
        return node;
    }
  }
  return null;
}
function selection_size() {
  let size = 0;
  for (const node of this)
    ++size;
  return size;
}
function selection_empty() {
  return !this.node();
}
function selection_each(callback) {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i])
        callback.call(node, node.__data__, i, group);
    }
  }
  return this;
}
function attrRemove$1(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS$1(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant$1(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}
function attrConstantNS$1(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}
function attrFunction$1(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.removeAttribute(name);
    else
      this.setAttribute(name, v);
  };
}
function attrFunctionNS$1(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.removeAttributeNS(fullname.space, fullname.local);
    else
      this.setAttributeNS(fullname.space, fullname.local, v);
  };
}
function selection_attr(name, value) {
  var fullname = namespace(name);
  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }
  return this.each((value == null ? fullname.local ? attrRemoveNS$1 : attrRemove$1 : typeof value === "function" ? fullname.local ? attrFunctionNS$1 : attrFunction$1 : fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, value));
}
function defaultView(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}
function styleRemove$1(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant$1(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}
function styleFunction$1(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.style.removeProperty(name);
    else
      this.style.setProperty(name, v, priority);
  };
}
function selection_style(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove$1 : typeof value === "function" ? styleFunction$1 : styleConstant$1)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
  return node.style.getPropertyValue(name) || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}
function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}
function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      delete this[name];
    else
      this[name] = v;
  };
}
function selection_property(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}
function classArray(string) {
  return string.trim().split(/^|\s+/);
}
function classList(node) {
  return node.classList || new ClassList(node);
}
function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};
function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n)
    list.add(names[i]);
}
function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n)
    list.remove(names[i]);
}
function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}
function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}
function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}
function selection_classed(name, value) {
  var names = classArray(name + "");
  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n)
      if (!list.contains(names[i]))
        return false;
    return true;
  }
  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}
function textRemove() {
  this.textContent = "";
}
function textConstant$1(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction$1(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}
function selection_text(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction$1 : textConstant$1)(value)) : this.node().textContent;
}
function htmlRemove() {
  this.innerHTML = "";
}
function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}
function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}
function selection_html(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}
function raise$1() {
  if (this.nextSibling)
    this.parentNode.appendChild(this);
}
function selection_raise() {
  return this.each(raise$1);
}
function lower() {
  if (this.previousSibling)
    this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function selection_lower() {
  return this.each(lower);
}
function selection_append(name) {
  var create2 = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create2.apply(this, arguments));
  });
}
function constantNull() {
  return null;
}
function selection_insert(name, before) {
  var create2 = typeof name === "function" ? name : creator(name), select2 = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create2.apply(this, arguments), select2.apply(this, arguments) || null);
  });
}
function remove() {
  var parent = this.parentNode;
  if (parent)
    parent.removeChild(this);
}
function selection_remove() {
  return this.each(remove);
}
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}
function selection_datum(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}
function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}
function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0)
      name = t.slice(i + 1), t = t.slice(0, i);
    return { type: t, name };
  });
}
function onRemove(typename) {
  return function() {
    var on2 = this.__on;
    if (!on2)
      return;
    for (var j = 0, i = -1, m = on2.length, o; j < m; ++j) {
      if (o = on2[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on2[++i] = o;
      }
    }
    if (++i)
      on2.length = i;
    else
      delete this.__on;
  };
}
function onAdd(typename, value, options) {
  return function() {
    var on2 = this.__on, o, listener = contextListener(value);
    if (on2)
      for (var j = 0, m = on2.length; j < m; ++j) {
        if ((o = on2[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
    this.addEventListener(typename.type, listener, options);
    o = { type: typename.type, name: typename.name, value, listener, options };
    if (!on2)
      this.__on = [o];
    else
      on2.push(o);
  };
}
function selection_on(typename, value, options) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;
  if (arguments.length < 2) {
    var on2 = this.node().__on;
    if (on2)
      for (var j = 0, m = on2.length, o; j < m; ++j) {
        for (i = 0, o = on2[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
    return;
  }
  on2 = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i)
    this.each(on2(typenames[i], value, options));
  return this;
}
function dispatchEvent(node, type, params) {
  var window2 = defaultView(node), event = window2.CustomEvent;
  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window2.document.createEvent("Event");
    if (params)
      event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else
      event.initEvent(type, false, false);
  }
  node.dispatchEvent(event);
}
function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}
function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}
function selection_dispatch(type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}
function* selection_iterator() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i])
        yield node;
    }
  }
}
var root = [null];
function Selection$1(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}
function selection() {
  return new Selection$1([[document.documentElement]], root);
}
function selection_selection() {
  return this;
}
Selection$1.prototype = selection.prototype = {
  constructor: Selection$1,
  select: selection_select,
  selectAll: selection_selectAll,
  selectChild: selection_selectChild,
  selectChildren: selection_selectChildren,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  selection: selection_selection,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch,
  [Symbol.iterator]: selection_iterator
};
function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition)
    prototype[key] = definition[key];
  return prototype;
}
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*", reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", reHex = /^#([0-9a-f]{3,8})$/, reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`), reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`), reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`), reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`), reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`), reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
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
define(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHex8() {
  return this.rgb().formatHex8();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
  if (a <= 0)
    r = g = b = NaN;
  return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define(Rgb, rgb, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h2, s, l, a) {
  if (a <= 0)
    h2 = s = l = NaN;
  else if (l <= 0 || l >= 1)
    h2 = s = NaN;
  else if (s <= 0)
    h2 = NaN;
  return new Hsl(h2, s, l, a);
}
function hslConvert(o) {
  if (o instanceof Hsl)
    return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Hsl();
  if (o instanceof Hsl)
    return o;
  o = o.rgb();
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h2 = NaN, s = max - min, l = (max + min) / 2;
  if (s) {
    if (r === max)
      h2 = (g - b) / s + (g < b) * 6;
    else if (g === max)
      h2 = (b - r) / s + 2;
    else
      h2 = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h2 *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h2;
  }
  return new Hsl(h2, s, l, o.opacity);
}
function hsl(h2, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h2) : new Hsl(h2, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h2, s, l, opacity) {
  this.h = +h2;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}
define(Hsl, hsl, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h2 = this.h % 360 + (this.h < 0) * 360, s = isNaN(h2) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h2 >= 240 ? h2 - 240 : h2 + 120, m1, m2),
      hsl2rgb(h2, m1, m2),
      hsl2rgb(h2 < 120 ? h2 + 240 : h2 - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));
function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}
function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h2, m1, m2) {
  return (h2 < 60 ? m1 + (m2 - m1) * h2 / 60 : h2 < 180 ? m2 : h2 < 240 ? m1 + (m2 - m1) * (240 - h2) / 60 : m1) * 255;
}
const constant$1 = (x) => () => x;
function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}
function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}
function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
  };
}
function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
}
const interpolateRgb = (function rgbGamma(y) {
  var color2 = gamma(y);
  function rgb$1(start2, end) {
    var r = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
    return function(t) {
      start2.r = r(t);
      start2.g = g(t);
      start2.b = b(t);
      start2.opacity = opacity(t);
      return start2 + "";
    };
  }
  rgb$1.gamma = rgbGamma;
  return rgb$1;
})(1);
function interpolateNumber(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, reB = new RegExp(reA.source, "g");
function zero(b) {
  return function() {
    return b;
  };
}
function one(b) {
  return function(t) {
    return b(t) + "";
  };
}
function interpolateString(a, b) {
  var bi2 = reA.lastIndex = reB.lastIndex = 0, am, bm, bs2, i = -1, s = [], q = [];
  a = a + "", b = b + "";
  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs2 = bm.index) > bi2) {
      bs2 = b.slice(bi2, bs2);
      if (s[i])
        s[i] += bs2;
      else
        s[++i] = bs2;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s[i])
        s[i] += bm;
      else
        s[++i] = bm;
    } else {
      s[++i] = null;
      q.push({ i, x: interpolateNumber(am, bm) });
    }
    bi2 = reB.lastIndex;
  }
  if (bi2 < b.length) {
    bs2 = b.slice(bi2);
    if (s[i])
      s[i] += bs2;
    else
      s[++i] = bs2;
  }
  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
    for (var i2 = 0, o; i2 < b; ++i2)
      s[(o = q[i2]).i] = o.x(t);
    return s.join("");
  });
}
var degrees = 180 / Math.PI;
var identity$1 = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function decompose(a, b, c, d, e3, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b))
    a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d)
    c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d))
    c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c)
    a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e3,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX,
    scaleY
  };
}
var svgNode;
function parseCss(value) {
  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m.isIdentity ? identity$1 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
}
function parseSvg(value) {
  if (value == null)
    return identity$1;
  if (!svgNode)
    svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate()))
    return identity$1;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}
function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }
  function translate(xa2, ya2, xb, yb, s, q) {
    if (xa2 !== xb || ya2 !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({ i: i - 4, x: interpolateNumber(xa2, xb) }, { i: i - 2, x: interpolateNumber(ya2, yb) });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }
  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180)
        b += 360;
      else if (b - a > 180)
        a += 360;
      q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b) });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }
  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b) });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }
  function scale(xa2, ya2, xb, yb, s, q) {
    if (xa2 !== xb || ya2 !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({ i: i - 4, x: interpolateNumber(xa2, xb) }, { i: i - 2, x: interpolateNumber(ya2, yb) });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }
  return function(a, b) {
    var s = [], q = [];
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null;
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n)
        s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");
var epsilon2 = 1e-12;
function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}
function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}
function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}
(function zoomRho(rho, rho2, rho4) {
  function zoom2(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      };
    } else {
      var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      };
    }
    i.duration = S * 1e3 * rho / Math.SQRT2;
    return i;
  }
  zoom2.rho = function(_) {
    var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
    return zoomRho(_1, _2, _4);
  };
  return zoom2;
})(Math.SQRT2, 2, 4);
var frame = 0, timeout$1 = 0, interval = 0, pokeDelay = 1e3, taskHead, taskTail, clockLast = 0, clockNow = 0, clockSkew = 0, clock = typeof performance === "object" && performance.now ? performance : Date, setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
  setTimeout(f, 17);
};
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
  clockNow = 0;
}
function Timer() {
  this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function")
      throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail)
        taskTail._next = this;
      else
        taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};
function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}
function timerFlush() {
  now();
  ++frame;
  var t = taskHead, e3;
  while (t) {
    if ((e3 = clockNow - t._time) >= 0)
      t._call.call(void 0, e3);
    t = t._next;
  }
  --frame;
}
function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout$1 = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}
function poke() {
  var now2 = clock.now(), delay = now2 - clockLast;
  if (delay > pokeDelay)
    clockSkew -= delay, clockLast = now2;
}
function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time)
        time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}
function sleep(time) {
  if (frame)
    return;
  if (timeout$1)
    timeout$1 = clearTimeout(timeout$1);
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity)
      timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval)
      interval = clearInterval(interval);
  } else {
    if (!interval)
      clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}
function timeout(callback, delay, time) {
  var t = new Timer();
  delay = delay == null ? 0 : +delay;
  t.restart((elapsed) => {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}
var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule(node, name, id2, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules)
    node.__transition = {};
  else if (id2 in schedules)
    return;
  create(node, id2, {
    name,
    index,
    // For context during callback.
    group,
    // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}
function init(node, id2) {
  var schedule2 = get(node, id2);
  if (schedule2.state > CREATED)
    throw new Error("too late; already scheduled");
  return schedule2;
}
function set(node, id2) {
  var schedule2 = get(node, id2);
  if (schedule2.state > STARTED)
    throw new Error("too late; already running");
  return schedule2;
}
function get(node, id2) {
  var schedule2 = node.__transition;
  if (!schedule2 || !(schedule2 = schedule2[id2]))
    throw new Error("transition not found");
  return schedule2;
}
function create(node, id2, self2) {
  var schedules = node.__transition, tween;
  schedules[id2] = self2;
  self2.timer = timer(schedule2, 0, self2.time);
  function schedule2(elapsed) {
    self2.state = SCHEDULED;
    self2.timer.restart(start2, self2.delay, self2.time);
    if (self2.delay <= elapsed)
      start2(elapsed - self2.delay);
  }
  function start2(elapsed) {
    var i, j, n, o;
    if (self2.state !== SCHEDULED)
      return stop();
    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self2.name)
        continue;
      if (o.state === STARTED)
        return timeout(start2);
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      } else if (+i < id2) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }
    timeout(function() {
      if (self2.state === STARTED) {
        self2.state = RUNNING;
        self2.timer.restart(tick, self2.delay, self2.time);
        tick(elapsed);
      }
    });
    self2.state = STARTING;
    self2.on.call("start", node, node.__data__, self2.index, self2.group);
    if (self2.state !== STARTING)
      return;
    self2.state = STARTED;
    tween = new Array(n = self2.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self2.tween[i].value.call(node, node.__data__, self2.index, self2.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }
  function tick(elapsed) {
    var t = elapsed < self2.duration ? self2.ease.call(null, elapsed / self2.duration) : (self2.timer.restart(stop), self2.state = ENDING, 1), i = -1, n = tween.length;
    while (++i < n) {
      tween[i].call(node, t);
    }
    if (self2.state === ENDING) {
      self2.on.call("end", node, node.__data__, self2.index, self2.group);
      stop();
    }
  }
  function stop() {
    self2.state = ENDED;
    self2.timer.stop();
    delete schedules[id2];
    for (var i in schedules)
      return;
    delete node.__transition;
  }
}
function interrupt(node, name) {
  var schedules = node.__transition, schedule2, active, empty2 = true, i;
  if (!schedules)
    return;
  name = name == null ? null : name + "";
  for (i in schedules) {
    if ((schedule2 = schedules[i]).name !== name) {
      empty2 = false;
      continue;
    }
    active = schedule2.state > STARTING && schedule2.state < ENDING;
    schedule2.state = ENDED;
    schedule2.timer.stop();
    schedule2.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule2.index, schedule2.group);
    delete schedules[i];
  }
  if (empty2)
    delete node.__transition;
}
function selection_interrupt(name) {
  return this.each(function() {
    interrupt(this, name);
  });
}
function tweenRemove(id2, name) {
  var tween0, tween1;
  return function() {
    var schedule2 = set(this, id2), tween = schedule2.tween;
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }
    schedule2.tween = tween1;
  };
}
function tweenFunction(id2, name, value) {
  var tween0, tween1;
  if (typeof value !== "function")
    throw new Error();
  return function() {
    var schedule2 = set(this, id2), tween = schedule2.tween;
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = { name, value }, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n)
        tween1.push(t);
    }
    schedule2.tween = tween1;
  };
}
function transition_tween(name, value) {
  var id2 = this._id;
  name += "";
  if (arguments.length < 2) {
    var tween = get(this.node(), id2).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }
  return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
}
function tweenValue(transition, name, value) {
  var id2 = transition._id;
  transition.each(function() {
    var schedule2 = set(this, id2);
    (schedule2.value || (schedule2.value = {}))[name] = value.apply(this, arguments);
  });
  return function(node) {
    return get(node, id2).value[name];
  };
}
function interpolate(a, b) {
  var c;
  return (typeof b === "number" ? interpolateNumber : b instanceof color ? interpolateRgb : (c = color(b)) ? (b = c, interpolateRgb) : interpolateString)(a, b);
}
function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant(name, interpolate2, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
  };
}
function attrConstantNS(fullname, interpolate2, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
  };
}
function attrFunction(name, interpolate2, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null)
      return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
  };
}
function attrFunctionNS(fullname, interpolate2, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null)
      return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
  };
}
function transition_attr(name, value) {
  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname) : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}
function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}
function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}
function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0)
      t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0)
      t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function transition_attrTween(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2)
    return (key = this.tween(key)) && key._value;
  if (value == null)
    return this.tween(key, null);
  if (typeof value !== "function")
    throw new Error();
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}
function delayFunction(id2, value) {
  return function() {
    init(this, id2).delay = +value.apply(this, arguments);
  };
}
function delayConstant(id2, value) {
  return value = +value, function() {
    init(this, id2).delay = value;
  };
}
function transition_delay(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get(this.node(), id2).delay;
}
function durationFunction(id2, value) {
  return function() {
    set(this, id2).duration = +value.apply(this, arguments);
  };
}
function durationConstant(id2, value) {
  return value = +value, function() {
    set(this, id2).duration = value;
  };
}
function transition_duration(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get(this.node(), id2).duration;
}
function easeConstant(id2, value) {
  if (typeof value !== "function")
    throw new Error();
  return function() {
    set(this, id2).ease = value;
  };
}
function transition_ease(value) {
  var id2 = this._id;
  return arguments.length ? this.each(easeConstant(id2, value)) : get(this.node(), id2).ease;
}
function easeVarying(id2, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (typeof v !== "function")
      throw new Error();
    set(this, id2).ease = v;
  };
}
function transition_easeVarying(value) {
  if (typeof value !== "function")
    throw new Error();
  return this.each(easeVarying(this._id, value));
}
function transition_filter(match) {
  if (typeof match !== "function")
    match = matcher(match);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Transition(subgroups, this._parents, this._name, this._id);
}
function transition_merge(transition) {
  if (transition._id !== this._id)
    throw new Error();
  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Transition(merges, this._parents, this._name, this._id);
}
function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0)
      t = t.slice(0, i);
    return !t || t === "start";
  });
}
function onFunction(id2, name, listener) {
  var on0, on1, sit = start(name) ? init : set;
  return function() {
    var schedule2 = sit(this, id2), on2 = schedule2.on;
    if (on2 !== on0)
      (on1 = (on0 = on2).copy()).on(name, listener);
    schedule2.on = on1;
  };
}
function transition_on(name, listener) {
  var id2 = this._id;
  return arguments.length < 2 ? get(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
}
function removeFunction(id2) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition)
      if (+i !== id2)
        return;
    if (parent)
      parent.removeChild(this);
  };
}
function transition_remove() {
  return this.on("end.remove", removeFunction(this._id));
}
function transition_select(select2) {
  var name = this._name, id2 = this._id;
  if (typeof select2 !== "function")
    select2 = selector(select2);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select2.call(node, node.__data__, i, group))) {
        if ("__data__" in node)
          subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id2, i, subgroup, get(node, id2));
      }
    }
  }
  return new Transition(subgroups, this._parents, name, id2);
}
function transition_selectAll(select2) {
  var name = this._name, id2 = this._id;
  if (typeof select2 !== "function")
    select2 = selectorAll(select2);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children2 = select2.call(node, node.__data__, i, group), child, inherit2 = get(node, id2), k = 0, l = children2.length; k < l; ++k) {
          if (child = children2[k]) {
            schedule(child, name, id2, k, children2, inherit2);
          }
        }
        subgroups.push(children2);
        parents.push(node);
      }
    }
  }
  return new Transition(subgroups, parents, name, id2);
}
var Selection = selection.prototype.constructor;
function transition_selection() {
  return new Selection(this._groups, this._parents);
}
function styleNull(name, interpolate2) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, string10 = string1);
  };
}
function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant(name, interpolate2, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
  };
}
function styleFunction(name, interpolate2, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
    if (value1 == null)
      string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
  };
}
function styleMaybeRemove(id2, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove2;
  return function() {
    var schedule2 = set(this, id2), on2 = schedule2.on, listener = schedule2.value[key] == null ? remove2 || (remove2 = styleRemove(name)) : void 0;
    if (on2 !== on0 || listener0 !== listener)
      (on1 = (on0 = on2).copy()).on(event, listener0 = listener);
    schedule2.on = on1;
  };
}
function transition_style(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
  return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove(name)) : typeof value === "function" ? this.styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant(name, i, value), priority).on("end.style." + name, null);
}
function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}
function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0)
      t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}
function transition_styleTween(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2)
    return (key = this.tween(key)) && key._value;
  if (value == null)
    return this.tween(key, null);
  if (typeof value !== "function")
    throw new Error();
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}
function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}
function transition_text(value) {
  return this.tween("text", typeof value === "function" ? textFunction(tweenValue(this, "text", value)) : textConstant(value == null ? "" : value + ""));
}
function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}
function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0)
      t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function transition_textTween(value) {
  var key = "text";
  if (arguments.length < 1)
    return (key = this.tween(key)) && key._value;
  if (value == null)
    return this.tween(key, null);
  if (typeof value !== "function")
    throw new Error();
  return this.tween(key, textTween(value));
}
function transition_transition() {
  var name = this._name, id0 = this._id, id1 = newId();
  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit2 = get(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit2.time + inherit2.delay + inherit2.duration,
          delay: 0,
          duration: inherit2.duration,
          ease: inherit2.ease
        });
      }
    }
  }
  return new Transition(groups, this._parents, name, id1);
}
function transition_end() {
  var on0, on1, that = this, id2 = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel2 = { value: reject }, end = { value: function() {
      if (--size === 0)
        resolve();
    } };
    that.each(function() {
      var schedule2 = set(this, id2), on2 = schedule2.on;
      if (on2 !== on0) {
        on1 = (on0 = on2).copy();
        on1._.cancel.push(cancel2);
        on1._.interrupt.push(cancel2);
        on1._.end.push(end);
      }
      schedule2.on = on1;
    });
    if (size === 0)
      resolve();
  });
}
var id = 0;
function Transition(groups, parents, name, id2) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id2;
}
function newId() {
  return ++id;
}
var selection_prototype = selection.prototype;
Transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  textTween: transition_textTween,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease,
  easeVarying: transition_easeVarying,
  end: transition_end,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};
function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var defaultTiming = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};
function inherit(node, id2) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id2])) {
    if (!(node = node.parentNode)) {
      throw new Error(`transition ${id2} not found`);
    }
  }
  return timing;
}
function selection_transition(name) {
  var id2, timing;
  if (name instanceof Transition) {
    id2 = name._id, name = name._name;
  } else {
    id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }
  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name, id2, i, group, timing || inherit(node, id2));
      }
    }
  }
  return new Transition(groups, this._parents, name, id2);
}
selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;
function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}
Transform.prototype = {
  constructor: Transform,
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x) {
    return x * this.k + this.x;
  },
  applyY: function(y) {
    return y * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x) {
    return (x - this.x) / this.k;
  },
  invertY: function(y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
Transform.prototype;
var Position = /* @__PURE__ */ ((Position2) => {
  Position2["Left"] = "left";
  Position2["Top"] = "top";
  Position2["Right"] = "right";
  Position2["Bottom"] = "bottom";
  return Position2;
})(Position || {});
function getGlobal() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  {
    console.warn("XState could not find a global object in this environment. Please let the maintainers know and raise an issue here: https://github.com/statelyai/xstate/issues");
  }
}
function getDevTools() {
  const w = getGlobal();
  if (w.__xstate__) {
    return w.__xstate__;
  }
  return void 0;
}
const devToolsAdapter = (service) => {
  if (typeof window === "undefined") {
    return;
  }
  const devTools = getDevTools();
  if (devTools) {
    devTools.register(service);
  }
};
class Mailbox {
  constructor(_process) {
    this._process = _process;
    this._active = false;
    this._current = null;
    this._last = null;
  }
  start() {
    this._active = true;
    this.flush();
  }
  clear() {
    if (this._current) {
      this._current.next = null;
      this._last = this._current;
    }
  }
  enqueue(event) {
    const enqueued = {
      value: event,
      next: null
    };
    if (this._current) {
      this._last.next = enqueued;
      this._last = enqueued;
      return;
    }
    this._current = enqueued;
    this._last = enqueued;
    if (this._active) {
      this.flush();
    }
  }
  flush() {
    while (this._current) {
      const consumed = this._current;
      this._process(consumed.value);
      this._current = consumed.next;
    }
    this._last = null;
  }
}
const STATE_DELIMITER = ".";
const TARGETLESS_KEY = "";
const NULL_EVENT = "";
const STATE_IDENTIFIER$1 = "#";
const WILDCARD = "*";
const XSTATE_INIT = "xstate.init";
const XSTATE_STOP = "xstate.stop";
function createAfterEvent(delayRef, id2) {
  return {
    type: `xstate.after.${delayRef}.${id2}`
  };
}
function createDoneStateEvent(id2, output) {
  return {
    type: `xstate.done.state.${id2}`,
    output
  };
}
function createDoneActorEvent(invokeId, output) {
  return {
    type: `xstate.done.actor.${invokeId}`,
    output,
    actorId: invokeId
  };
}
function createErrorActorEvent(id2, error) {
  return {
    type: `xstate.error.actor.${id2}`,
    error,
    actorId: id2
  };
}
function createInitEvent(input) {
  return {
    type: XSTATE_INIT,
    input
  };
}
function reportUnhandledError(err) {
  setTimeout(() => {
    throw err;
  });
}
const symbolObservable = (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();
function matchesState(parentStateId, childStateId) {
  const parentStateValue = toStateValue(parentStateId);
  const childStateValue = toStateValue(childStateId);
  if (typeof childStateValue === "string") {
    if (typeof parentStateValue === "string") {
      return childStateValue === parentStateValue;
    }
    return false;
  }
  if (typeof parentStateValue === "string") {
    return parentStateValue in childStateValue;
  }
  return Object.keys(parentStateValue).every((key) => {
    if (!(key in childStateValue)) {
      return false;
    }
    return matchesState(parentStateValue[key], childStateValue[key]);
  });
}
function toStatePath(stateId) {
  if (isArray(stateId)) {
    return stateId;
  }
  const result = [];
  let segment = "";
  for (let i = 0; i < stateId.length; i++) {
    const char = stateId.charCodeAt(i);
    switch (char) {
      // \
      case 92:
        segment += stateId[i + 1];
        i++;
        continue;
      // .
      case 46:
        result.push(segment);
        segment = "";
        continue;
    }
    segment += stateId[i];
  }
  result.push(segment);
  return result;
}
function toStateValue(stateValue) {
  if (isMachineSnapshot(stateValue)) {
    return stateValue.value;
  }
  if (typeof stateValue !== "string") {
    return stateValue;
  }
  const statePath = toStatePath(stateValue);
  return pathToStateValue(statePath);
}
function pathToStateValue(statePath) {
  if (statePath.length === 1) {
    return statePath[0];
  }
  const value = {};
  let marker = value;
  for (let i = 0; i < statePath.length - 1; i++) {
    if (i === statePath.length - 2) {
      marker[statePath[i]] = statePath[i + 1];
    } else {
      const previous = marker;
      marker = {};
      previous[statePath[i]] = marker;
    }
  }
  return value;
}
function mapValues(collection, iteratee) {
  const result = {};
  const collectionKeys = Object.keys(collection);
  for (let i = 0; i < collectionKeys.length; i++) {
    const key = collectionKeys[i];
    result[key] = iteratee(collection[key], key, collection, i);
  }
  return result;
}
function toArrayStrict(value) {
  if (isArray(value)) {
    return value;
  }
  return [value];
}
function toArray(value) {
  if (value === void 0) {
    return [];
  }
  return toArrayStrict(value);
}
function resolveOutput(mapper, context, event, self2) {
  if (typeof mapper === "function") {
    return mapper({
      context,
      event,
      self: self2
    });
  }
  if (!!mapper && typeof mapper === "object" && Object.values(mapper).some((val) => typeof val === "function")) {
    console.warn(`Dynamically mapping values to individual properties is deprecated. Use a single function that returns the mapped object instead.
Found object containing properties whose values are possibly mapping functions: ${Object.entries(mapper).filter(([, value]) => typeof value === "function").map(([key, value]) => `
 - ${key}: ${value.toString().replace(/\n\s*/g, "")}`).join("")}`);
  }
  return mapper;
}
function isArray(value) {
  return Array.isArray(value);
}
function isErrorActorEvent(event) {
  return event.type.startsWith("xstate.error.actor");
}
function toTransitionConfigArray(configLike) {
  return toArrayStrict(configLike).map((transitionLike) => {
    if (typeof transitionLike === "undefined" || typeof transitionLike === "string") {
      return {
        target: transitionLike
      };
    }
    return transitionLike;
  });
}
function normalizeTarget(target) {
  if (target === void 0 || target === TARGETLESS_KEY) {
    return void 0;
  }
  return toArray(target);
}
function toObserver(nextHandler, errorHandler, completionHandler) {
  const isObserver = typeof nextHandler === "object";
  const self2 = isObserver ? nextHandler : void 0;
  return {
    next: (isObserver ? nextHandler.next : nextHandler)?.bind(self2),
    error: (isObserver ? nextHandler.error : errorHandler)?.bind(self2),
    complete: (isObserver ? nextHandler.complete : completionHandler)?.bind(self2)
  };
}
function createInvokeId(stateNodeId, index) {
  return `${index}.${stateNodeId}`;
}
function resolveReferencedActor(machine, src) {
  const match = src.match(/^xstate\.invoke\.(\d+)\.(.*)/);
  if (!match) {
    return machine.implementations.actors[src];
  }
  const [, indexStr, nodeId] = match;
  const node = machine.getStateNodeById(nodeId);
  const invokeConfig = node.config.invoke;
  return (Array.isArray(invokeConfig) ? invokeConfig[indexStr] : invokeConfig).src;
}
function matchesEventDescriptor(eventType, descriptor) {
  if (descriptor === eventType) {
    return true;
  }
  if (descriptor === WILDCARD) {
    return true;
  }
  if (!descriptor.endsWith(".*")) {
    return false;
  }
  if (/.*\*.+/.test(descriptor)) {
    console.warn(`Wildcards can only be the last token of an event descriptor (e.g., "event.*") or the entire event descriptor ("*"). Check the "${descriptor}" event.`);
  }
  const partialEventTokens = descriptor.split(".");
  const eventTokens = eventType.split(".");
  for (let tokenIndex = 0; tokenIndex < partialEventTokens.length; tokenIndex++) {
    const partialEventToken = partialEventTokens[tokenIndex];
    const eventToken = eventTokens[tokenIndex];
    if (partialEventToken === "*") {
      const isLastToken = tokenIndex === partialEventTokens.length - 1;
      if (!isLastToken) {
        console.warn(`Infix wildcards in transition events are not allowed. Check the "${descriptor}" transition.`);
      }
      return isLastToken;
    }
    if (partialEventToken !== eventToken) {
      return false;
    }
  }
  return true;
}
function createScheduledEventId(actorRef, id2) {
  return `${actorRef.sessionId}.${id2}`;
}
let idCounter = 0;
function createSystem(rootActor, options) {
  const children2 = /* @__PURE__ */ new Map();
  const keyedActors = /* @__PURE__ */ new Map();
  const reverseKeyedActors = /* @__PURE__ */ new WeakMap();
  const inspectionObservers = /* @__PURE__ */ new Set();
  const timerMap = {};
  const {
    clock: clock2,
    logger
  } = options;
  const scheduler = {
    schedule: (source, target, event, delay, id2 = Math.random().toString(36).slice(2)) => {
      const scheduledEvent = {
        source,
        target,
        event,
        delay,
        id: id2,
        startedAt: Date.now()
      };
      const scheduledEventId = createScheduledEventId(source, id2);
      system._snapshot._scheduledEvents[scheduledEventId] = scheduledEvent;
      const timeout2 = clock2.setTimeout(() => {
        delete timerMap[scheduledEventId];
        delete system._snapshot._scheduledEvents[scheduledEventId];
        system._relay(source, target, event);
      }, delay);
      timerMap[scheduledEventId] = timeout2;
    },
    cancel: (source, id2) => {
      const scheduledEventId = createScheduledEventId(source, id2);
      const timeout2 = timerMap[scheduledEventId];
      delete timerMap[scheduledEventId];
      delete system._snapshot._scheduledEvents[scheduledEventId];
      if (timeout2 !== void 0) {
        clock2.clearTimeout(timeout2);
      }
    },
    cancelAll: (actorRef) => {
      for (const scheduledEventId in system._snapshot._scheduledEvents) {
        const scheduledEvent = system._snapshot._scheduledEvents[scheduledEventId];
        if (scheduledEvent.source === actorRef) {
          scheduler.cancel(actorRef, scheduledEvent.id);
        }
      }
    }
  };
  const sendInspectionEvent = (event) => {
    if (!inspectionObservers.size) {
      return;
    }
    const resolvedInspectionEvent = {
      ...event,
      rootId: rootActor.sessionId
    };
    inspectionObservers.forEach((observer) => observer.next?.(resolvedInspectionEvent));
  };
  const system = {
    _snapshot: {
      _scheduledEvents: (options?.snapshot && options.snapshot.scheduler) ?? {}
    },
    _bookId: () => `x:${idCounter++}`,
    _register: (sessionId, actorRef) => {
      children2.set(sessionId, actorRef);
      return sessionId;
    },
    _unregister: (actorRef) => {
      children2.delete(actorRef.sessionId);
      const systemId = reverseKeyedActors.get(actorRef);
      if (systemId !== void 0) {
        keyedActors.delete(systemId);
        reverseKeyedActors.delete(actorRef);
      }
    },
    get: (systemId) => {
      return keyedActors.get(systemId);
    },
    getAll: () => {
      return Object.fromEntries(keyedActors.entries());
    },
    _set: (systemId, actorRef) => {
      const existing = keyedActors.get(systemId);
      if (existing && existing !== actorRef) {
        throw new Error(`Actor with system ID '${systemId}' already exists.`);
      }
      keyedActors.set(systemId, actorRef);
      reverseKeyedActors.set(actorRef, systemId);
    },
    inspect: (observerOrFn) => {
      const observer = toObserver(observerOrFn);
      inspectionObservers.add(observer);
      return {
        unsubscribe() {
          inspectionObservers.delete(observer);
        }
      };
    },
    _sendInspectionEvent: sendInspectionEvent,
    _relay: (source, target, event) => {
      system._sendInspectionEvent({
        type: "@xstate.event",
        sourceRef: source,
        actorRef: target,
        event
      });
      target._send(event);
    },
    scheduler,
    getSnapshot: () => {
      return {
        _scheduledEvents: {
          ...system._snapshot._scheduledEvents
        }
      };
    },
    start: () => {
      const scheduledEvents = system._snapshot._scheduledEvents;
      system._snapshot._scheduledEvents = {};
      for (const scheduledId in scheduledEvents) {
        const {
          source,
          target,
          event,
          delay,
          id: id2
        } = scheduledEvents[scheduledId];
        scheduler.schedule(source, target, event, delay, id2);
      }
    },
    _clock: clock2,
    _logger: logger
  };
  return system;
}
let executingCustomAction = false;
const $$ACTOR_TYPE = 1;
let ProcessingStatus = /* @__PURE__ */ (function(ProcessingStatus2) {
  ProcessingStatus2[ProcessingStatus2["NotStarted"] = 0] = "NotStarted";
  ProcessingStatus2[ProcessingStatus2["Running"] = 1] = "Running";
  ProcessingStatus2[ProcessingStatus2["Stopped"] = 2] = "Stopped";
  return ProcessingStatus2;
})({});
const defaultOptions = {
  clock: {
    setTimeout: (fn2, ms2) => {
      return setTimeout(fn2, ms2);
    },
    clearTimeout: (id2) => {
      return clearTimeout(id2);
    }
  },
  logger: console.log.bind(console),
  devTools: false
};
class Actor {
  /**
   * Creates a new actor instance for the given logic with the provided options,
   * if any.
   *
   * @param logic The logic to create an actor from
   * @param options Actor options
   */
  constructor(logic, options) {
    this.logic = logic;
    this._snapshot = void 0;
    this.clock = void 0;
    this.options = void 0;
    this.id = void 0;
    this.mailbox = new Mailbox(this._process.bind(this));
    this.observers = /* @__PURE__ */ new Set();
    this.eventListeners = /* @__PURE__ */ new Map();
    this.logger = void 0;
    this._processingStatus = ProcessingStatus.NotStarted;
    this._parent = void 0;
    this._syncSnapshot = void 0;
    this.ref = void 0;
    this._actorScope = void 0;
    this.systemId = void 0;
    this.sessionId = void 0;
    this.system = void 0;
    this._doneEvent = void 0;
    this.src = void 0;
    this._deferred = [];
    const resolvedOptions = {
      ...defaultOptions,
      ...options
    };
    const {
      clock: clock2,
      logger,
      parent,
      syncSnapshot,
      id: id2,
      systemId,
      inspect
    } = resolvedOptions;
    this.system = parent ? parent.system : createSystem(this, {
      clock: clock2,
      logger
    });
    if (inspect && !parent) {
      this.system.inspect(toObserver(inspect));
    }
    this.sessionId = this.system._bookId();
    this.id = id2 ?? this.sessionId;
    this.logger = options?.logger ?? this.system._logger;
    this.clock = options?.clock ?? this.system._clock;
    this._parent = parent;
    this._syncSnapshot = syncSnapshot;
    this.options = resolvedOptions;
    this.src = resolvedOptions.src ?? logic;
    this.ref = this;
    this._actorScope = {
      self: this,
      id: this.id,
      sessionId: this.sessionId,
      logger: this.logger,
      defer: (fn2) => {
        this._deferred.push(fn2);
      },
      system: this.system,
      stopChild: (child) => {
        if (child._parent !== this) {
          throw new Error(`Cannot stop child actor ${child.id} of ${this.id} because it is not a child`);
        }
        child._stop();
      },
      emit: (emittedEvent) => {
        const listeners = this.eventListeners.get(emittedEvent.type);
        const wildcardListener = this.eventListeners.get("*");
        if (!listeners && !wildcardListener) {
          return;
        }
        const allListeners = [...listeners ? listeners.values() : [], ...wildcardListener ? wildcardListener.values() : []];
        for (const handler of allListeners) {
          try {
            handler(emittedEvent);
          } catch (err) {
            reportUnhandledError(err);
          }
        }
      },
      actionExecutor: (action) => {
        const exec = () => {
          this._actorScope.system._sendInspectionEvent({
            type: "@xstate.action",
            actorRef: this,
            action: {
              type: action.type,
              params: action.params
            }
          });
          if (!action.exec) {
            return;
          }
          const saveExecutingCustomAction = executingCustomAction;
          try {
            executingCustomAction = true;
            action.exec(action.info, action.params);
          } finally {
            executingCustomAction = saveExecutingCustomAction;
          }
        };
        if (this._processingStatus === ProcessingStatus.Running) {
          exec();
        } else {
          this._deferred.push(exec);
        }
      }
    };
    this.send = this.send.bind(this);
    this.system._sendInspectionEvent({
      type: "@xstate.actor",
      actorRef: this
    });
    if (systemId) {
      this.systemId = systemId;
      this.system._set(systemId, this);
    }
    this._initState(options?.snapshot ?? options?.state);
    if (systemId && this._snapshot.status !== "active") {
      this.system._unregister(this);
    }
  }
  _initState(persistedState) {
    try {
      this._snapshot = persistedState ? this.logic.restoreSnapshot ? this.logic.restoreSnapshot(persistedState, this._actorScope) : persistedState : this.logic.getInitialSnapshot(this._actorScope, this.options?.input);
    } catch (err) {
      this._snapshot = {
        status: "error",
        output: void 0,
        error: err
      };
    }
  }
  update(snapshot, event) {
    this._snapshot = snapshot;
    let deferredFn;
    while (deferredFn = this._deferred.shift()) {
      try {
        deferredFn();
      } catch (err) {
        this._deferred.length = 0;
        this._snapshot = {
          ...snapshot,
          status: "error",
          error: err
        };
      }
    }
    switch (this._snapshot.status) {
      case "active":
        for (const observer of this.observers) {
          try {
            observer.next?.(snapshot);
          } catch (err) {
            reportUnhandledError(err);
          }
        }
        break;
      case "done":
        for (const observer of this.observers) {
          try {
            observer.next?.(snapshot);
          } catch (err) {
            reportUnhandledError(err);
          }
        }
        this._stopProcedure();
        this._complete();
        this._doneEvent = createDoneActorEvent(this.id, this._snapshot.output);
        if (this._parent) {
          this.system._relay(this, this._parent, this._doneEvent);
        }
        break;
      case "error":
        this._error(this._snapshot.error);
        break;
    }
    this.system._sendInspectionEvent({
      type: "@xstate.snapshot",
      actorRef: this,
      event,
      snapshot
    });
  }
  /**
   * Subscribe an observer to an actor’s snapshot values.
   *
   * @remarks
   * The observer will receive the actor’s snapshot value when it is emitted.
   * The observer can be:
   *
   * - A plain function that receives the latest snapshot, or
   * - An observer object whose `.next(snapshot)` method receives the latest
   *   snapshot
   *
   * @example
   *
   * ```ts
   * // Observer as a plain function
   * const subscription = actor.subscribe((snapshot) => {
   *   console.log(snapshot);
   * });
   * ```
   *
   * @example
   *
   * ```ts
   * // Observer as an object
   * const subscription = actor.subscribe({
   *   next(snapshot) {
   *     console.log(snapshot);
   *   },
   *   error(err) {
   *     // ...
   *   },
   *   complete() {
   *     // ...
   *   }
   * });
   * ```
   *
   * The return value of `actor.subscribe(observer)` is a subscription object
   * that has an `.unsubscribe()` method. You can call
   * `subscription.unsubscribe()` to unsubscribe the observer:
   *
   * @example
   *
   * ```ts
   * const subscription = actor.subscribe((snapshot) => {
   *   // ...
   * });
   *
   * // Unsubscribe the observer
   * subscription.unsubscribe();
   * ```
   *
   * When the actor is stopped, all of its observers will automatically be
   * unsubscribed.
   *
   * @param observer - Either a plain function that receives the latest
   *   snapshot, or an observer object whose `.next(snapshot)` method receives
   *   the latest snapshot
   */
  subscribe(nextListenerOrObserver, errorListener, completeListener) {
    const observer = toObserver(nextListenerOrObserver, errorListener, completeListener);
    if (this._processingStatus !== ProcessingStatus.Stopped) {
      this.observers.add(observer);
    } else {
      switch (this._snapshot.status) {
        case "done":
          try {
            observer.complete?.();
          } catch (err) {
            reportUnhandledError(err);
          }
          break;
        case "error": {
          const err = this._snapshot.error;
          if (!observer.error) {
            reportUnhandledError(err);
          } else {
            try {
              observer.error(err);
            } catch (err2) {
              reportUnhandledError(err2);
            }
          }
          break;
        }
      }
    }
    return {
      unsubscribe: () => {
        this.observers.delete(observer);
      }
    };
  }
  on(type, handler) {
    let listeners = this.eventListeners.get(type);
    if (!listeners) {
      listeners = /* @__PURE__ */ new Set();
      this.eventListeners.set(type, listeners);
    }
    const wrappedHandler = handler.bind(void 0);
    listeners.add(wrappedHandler);
    return {
      unsubscribe: () => {
        listeners.delete(wrappedHandler);
      }
    };
  }
  /** Starts the Actor from the initial state */
  start() {
    if (this._processingStatus === ProcessingStatus.Running) {
      return this;
    }
    if (this._syncSnapshot) {
      this.subscribe({
        next: (snapshot) => {
          if (snapshot.status === "active") {
            this.system._relay(this, this._parent, {
              type: `xstate.snapshot.${this.id}`,
              snapshot
            });
          }
        },
        error: () => {
        }
      });
    }
    this.system._register(this.sessionId, this);
    if (this.systemId) {
      this.system._set(this.systemId, this);
    }
    this._processingStatus = ProcessingStatus.Running;
    const initEvent = createInitEvent(this.options.input);
    this.system._sendInspectionEvent({
      type: "@xstate.event",
      sourceRef: this._parent,
      actorRef: this,
      event: initEvent
    });
    const status = this._snapshot.status;
    switch (status) {
      case "done":
        this.update(this._snapshot, initEvent);
        return this;
      case "error":
        this._error(this._snapshot.error);
        return this;
    }
    if (!this._parent) {
      this.system.start();
    }
    if (this.logic.start) {
      try {
        this.logic.start(this._snapshot, this._actorScope);
      } catch (err) {
        this._snapshot = {
          ...this._snapshot,
          status: "error",
          error: err
        };
        this._error(err);
        return this;
      }
    }
    this.update(this._snapshot, initEvent);
    if (this.options.devTools) {
      this.attachDevTools();
    }
    this.mailbox.start();
    return this;
  }
  _process(event) {
    let nextState;
    let caughtError;
    try {
      nextState = this.logic.transition(this._snapshot, event, this._actorScope);
    } catch (err) {
      caughtError = {
        err
      };
    }
    if (caughtError) {
      const {
        err
      } = caughtError;
      this._snapshot = {
        ...this._snapshot,
        status: "error",
        error: err
      };
      this._error(err);
      return;
    }
    this.update(nextState, event);
    if (event.type === XSTATE_STOP) {
      this._stopProcedure();
      this._complete();
    }
  }
  _stop() {
    if (this._processingStatus === ProcessingStatus.Stopped) {
      return this;
    }
    this.mailbox.clear();
    if (this._processingStatus === ProcessingStatus.NotStarted) {
      this._processingStatus = ProcessingStatus.Stopped;
      return this;
    }
    this.mailbox.enqueue({
      type: XSTATE_STOP
    });
    return this;
  }
  /** Stops the Actor and unsubscribe all listeners. */
  stop() {
    if (this._parent) {
      throw new Error("A non-root actor cannot be stopped directly.");
    }
    return this._stop();
  }
  _complete() {
    for (const observer of this.observers) {
      try {
        observer.complete?.();
      } catch (err) {
        reportUnhandledError(err);
      }
    }
    this.observers.clear();
  }
  _reportError(err) {
    if (!this.observers.size) {
      if (!this._parent) {
        reportUnhandledError(err);
      }
      return;
    }
    let reportError = false;
    for (const observer of this.observers) {
      const errorListener = observer.error;
      reportError ||= !errorListener;
      try {
        errorListener?.(err);
      } catch (err2) {
        reportUnhandledError(err2);
      }
    }
    this.observers.clear();
    if (reportError) {
      reportUnhandledError(err);
    }
  }
  _error(err) {
    this._stopProcedure();
    this._reportError(err);
    if (this._parent) {
      this.system._relay(this, this._parent, createErrorActorEvent(this.id, err));
    }
  }
  // TODO: atm children don't belong entirely to the actor so
  // in a way - it's not even super aware of them
  // so we can't stop them from here but we really should!
  // right now, they are being stopped within the machine's transition
  // but that could throw and leave us with "orphaned" active actors
  _stopProcedure() {
    if (this._processingStatus !== ProcessingStatus.Running) {
      return this;
    }
    this.system.scheduler.cancelAll(this);
    this.mailbox.clear();
    this.mailbox = new Mailbox(this._process.bind(this));
    this._processingStatus = ProcessingStatus.Stopped;
    this.system._unregister(this);
    return this;
  }
  /** @internal */
  _send(event) {
    if (this._processingStatus === ProcessingStatus.Stopped) {
      {
        const eventString = JSON.stringify(event);
        console.warn(`Event "${event.type}" was sent to stopped actor "${this.id} (${this.sessionId})". This actor has already reached its final state, and will not transition.
Event: ${eventString}`);
      }
      return;
    }
    this.mailbox.enqueue(event);
  }
  /**
   * Sends an event to the running Actor to trigger a transition.
   *
   * @param event The event to send
   */
  send(event) {
    if (typeof event === "string") {
      throw new Error(`Only event objects may be sent to actors; use .send({ type: "${event}" }) instead`);
    }
    this.system._relay(void 0, this, event);
  }
  attachDevTools() {
    const {
      devTools
    } = this.options;
    if (devTools) {
      const resolvedDevToolsAdapter = typeof devTools === "function" ? devTools : devToolsAdapter;
      resolvedDevToolsAdapter(this);
    }
  }
  toJSON() {
    return {
      xstate$$type: $$ACTOR_TYPE,
      id: this.id
    };
  }
  /**
   * Obtain the internal state of the actor, which can be persisted.
   *
   * @remarks
   * The internal state can be persisted from any actor, not only machines.
   *
   * Note that the persisted state is not the same as the snapshot from
   * {@link Actor.getSnapshot}. Persisted state represents the internal state of
   * the actor, while snapshots represent the actor's last emitted value.
   *
   * Can be restored with {@link ActorOptions.state}
   * @see https://stately.ai/docs/persistence
   */
  getPersistedSnapshot(options) {
    return this.logic.getPersistedSnapshot(this._snapshot, options);
  }
  [symbolObservable]() {
    return this;
  }
  /**
   * Read an actor’s snapshot synchronously.
   *
   * @remarks
   * The snapshot represent an actor's last emitted value.
   *
   * When an actor receives an event, its internal state may change. An actor
   * may emit a snapshot when a state transition occurs.
   *
   * Note that some actors, such as callback actors generated with
   * `fromCallback`, will not emit snapshots.
   * @see {@link Actor.subscribe} to subscribe to an actor’s snapshot values.
   * @see {@link Actor.getPersistedSnapshot} to persist the internal state of an actor (which is more than just a snapshot).
   */
  getSnapshot() {
    if (!this._snapshot) {
      throw new Error(`Snapshot can't be read while the actor initializes itself`);
    }
    return this._snapshot;
  }
}
function createActor(logic, ...[options]) {
  return new Actor(logic, options);
}
function resolveCancel(_, snapshot, actionArgs, actionParams, {
  sendId
}) {
  const resolvedSendId = typeof sendId === "function" ? sendId(actionArgs, actionParams) : sendId;
  return [snapshot, {
    sendId: resolvedSendId
  }, void 0];
}
function executeCancel(actorScope, params) {
  actorScope.defer(() => {
    actorScope.system.scheduler.cancel(actorScope.self, params.sendId);
  });
}
function cancel(sendId) {
  function cancel2(_args, _params) {
    {
      throw new Error(`This isn't supposed to be called`);
    }
  }
  cancel2.type = "xstate.cancel";
  cancel2.sendId = sendId;
  cancel2.resolve = resolveCancel;
  cancel2.execute = executeCancel;
  return cancel2;
}
function resolveSpawn(actorScope, snapshot, actionArgs, _actionParams, {
  id: id2,
  systemId,
  src,
  input,
  syncSnapshot
}) {
  const logic = typeof src === "string" ? resolveReferencedActor(snapshot.machine, src) : src;
  const resolvedId = typeof id2 === "function" ? id2(actionArgs) : id2;
  let actorRef;
  let resolvedInput = void 0;
  if (logic) {
    resolvedInput = typeof input === "function" ? input({
      context: snapshot.context,
      event: actionArgs.event,
      self: actorScope.self
    }) : input;
    actorRef = createActor(logic, {
      id: resolvedId,
      src,
      parent: actorScope.self,
      syncSnapshot,
      systemId,
      input: resolvedInput
    });
  }
  if (!actorRef) {
    console.warn(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-base-to-string
      `Actor type '${src}' not found in machine '${actorScope.id}'.`
    );
  }
  return [cloneMachineSnapshot(snapshot, {
    children: {
      ...snapshot.children,
      [resolvedId]: actorRef
    }
  }), {
    id: id2,
    systemId,
    actorRef,
    src,
    input: resolvedInput
  }, void 0];
}
function executeSpawn(actorScope, {
  actorRef
}) {
  if (!actorRef) {
    return;
  }
  actorScope.defer(() => {
    if (actorRef._processingStatus === ProcessingStatus.Stopped) {
      return;
    }
    actorRef.start();
  });
}
function spawnChild(...[src, {
  id: id2,
  systemId,
  input,
  syncSnapshot = false
} = {}]) {
  function spawnChild2(_args, _params) {
    {
      throw new Error(`This isn't supposed to be called`);
    }
  }
  spawnChild2.type = "xstate.spawnChild";
  spawnChild2.id = id2;
  spawnChild2.systemId = systemId;
  spawnChild2.src = src;
  spawnChild2.input = input;
  spawnChild2.syncSnapshot = syncSnapshot;
  spawnChild2.resolve = resolveSpawn;
  spawnChild2.execute = executeSpawn;
  return spawnChild2;
}
function resolveStop(_, snapshot, args, actionParams, {
  actorRef
}) {
  const actorRefOrString = typeof actorRef === "function" ? actorRef(args, actionParams) : actorRef;
  const resolvedActorRef = typeof actorRefOrString === "string" ? snapshot.children[actorRefOrString] : actorRefOrString;
  let children2 = snapshot.children;
  if (resolvedActorRef) {
    children2 = {
      ...children2
    };
    delete children2[resolvedActorRef.id];
  }
  return [cloneMachineSnapshot(snapshot, {
    children: children2
  }), resolvedActorRef, void 0];
}
function executeStop(actorScope, actorRef) {
  if (!actorRef) {
    return;
  }
  actorScope.system._unregister(actorRef);
  if (actorRef._processingStatus !== ProcessingStatus.Running) {
    actorScope.stopChild(actorRef);
    return;
  }
  actorScope.defer(() => {
    actorScope.stopChild(actorRef);
  });
}
function stopChild(actorRef) {
  function stop(_args, _params) {
    {
      throw new Error(`This isn't supposed to be called`);
    }
  }
  stop.type = "xstate.stopChild";
  stop.actorRef = actorRef;
  stop.resolve = resolveStop;
  stop.execute = executeStop;
  return stop;
}
function evaluateGuard(guard, context, event, snapshot) {
  const {
    machine
  } = snapshot;
  const isInline = typeof guard === "function";
  const resolved = isInline ? guard : machine.implementations.guards[typeof guard === "string" ? guard : guard.type];
  if (!isInline && !resolved) {
    throw new Error(`Guard '${typeof guard === "string" ? guard : guard.type}' is not implemented.'.`);
  }
  if (typeof resolved !== "function") {
    return evaluateGuard(resolved, context, event, snapshot);
  }
  const guardArgs = {
    context,
    event
  };
  const guardParams = isInline || typeof guard === "string" ? void 0 : "params" in guard ? typeof guard.params === "function" ? guard.params({
    context,
    event
  }) : guard.params : void 0;
  if (!("check" in resolved)) {
    return resolved(guardArgs, guardParams);
  }
  const builtinGuard = resolved;
  return builtinGuard.check(
    snapshot,
    guardArgs,
    resolved
    // this holds all params
  );
}
const isAtomicStateNode = (stateNode) => stateNode.type === "atomic" || stateNode.type === "final";
function getChildren(stateNode) {
  return Object.values(stateNode.states).filter((sn2) => sn2.type !== "history");
}
function getProperAncestors(stateNode, toStateNode) {
  const ancestors = [];
  if (toStateNode === stateNode) {
    return ancestors;
  }
  let m = stateNode.parent;
  while (m && m !== toStateNode) {
    ancestors.push(m);
    m = m.parent;
  }
  return ancestors;
}
function getAllStateNodes(stateNodes) {
  const nodeSet = new Set(stateNodes);
  const adjList = getAdjList(nodeSet);
  for (const s of nodeSet) {
    if (s.type === "compound" && (!adjList.get(s) || !adjList.get(s).length)) {
      getInitialStateNodesWithTheirAncestors(s).forEach((sn2) => nodeSet.add(sn2));
    } else {
      if (s.type === "parallel") {
        for (const child of getChildren(s)) {
          if (child.type === "history") {
            continue;
          }
          if (!nodeSet.has(child)) {
            const initialStates = getInitialStateNodesWithTheirAncestors(child);
            for (const initialStateNode of initialStates) {
              nodeSet.add(initialStateNode);
            }
          }
        }
      }
    }
  }
  for (const s of nodeSet) {
    let m = s.parent;
    while (m) {
      nodeSet.add(m);
      m = m.parent;
    }
  }
  return nodeSet;
}
function getValueFromAdj(baseNode, adjList) {
  const childStateNodes = adjList.get(baseNode);
  if (!childStateNodes) {
    return {};
  }
  if (baseNode.type === "compound") {
    const childStateNode = childStateNodes[0];
    if (childStateNode) {
      if (isAtomicStateNode(childStateNode)) {
        return childStateNode.key;
      }
    } else {
      return {};
    }
  }
  const stateValue = {};
  for (const childStateNode of childStateNodes) {
    stateValue[childStateNode.key] = getValueFromAdj(childStateNode, adjList);
  }
  return stateValue;
}
function getAdjList(stateNodes) {
  const adjList = /* @__PURE__ */ new Map();
  for (const s of stateNodes) {
    if (!adjList.has(s)) {
      adjList.set(s, []);
    }
    if (s.parent) {
      if (!adjList.has(s.parent)) {
        adjList.set(s.parent, []);
      }
      adjList.get(s.parent).push(s);
    }
  }
  return adjList;
}
function getStateValue(rootNode, stateNodes) {
  const config = getAllStateNodes(stateNodes);
  return getValueFromAdj(rootNode, getAdjList(config));
}
function isInFinalState(stateNodeSet, stateNode) {
  if (stateNode.type === "compound") {
    return getChildren(stateNode).some((s) => s.type === "final" && stateNodeSet.has(s));
  }
  if (stateNode.type === "parallel") {
    return getChildren(stateNode).every((sn2) => isInFinalState(stateNodeSet, sn2));
  }
  return stateNode.type === "final";
}
const isStateId = (str) => str[0] === STATE_IDENTIFIER$1;
function getCandidates(stateNode, receivedEventType) {
  const candidates = stateNode.transitions.get(receivedEventType) || [...stateNode.transitions.keys()].filter((eventDescriptor) => matchesEventDescriptor(receivedEventType, eventDescriptor)).sort((a, b) => b.length - a.length).flatMap((key) => stateNode.transitions.get(key));
  return candidates;
}
function getDelayedTransitions(stateNode) {
  const afterConfig = stateNode.config.after;
  if (!afterConfig) {
    return [];
  }
  const mutateEntryExit = (delay) => {
    const afterEvent = createAfterEvent(delay, stateNode.id);
    const eventType = afterEvent.type;
    stateNode.entry.push(raise(afterEvent, {
      id: eventType,
      delay
    }));
    stateNode.exit.push(cancel(eventType));
    return eventType;
  };
  const delayedTransitions = Object.keys(afterConfig).flatMap((delay) => {
    const configTransition = afterConfig[delay];
    const resolvedTransition = typeof configTransition === "string" ? {
      target: configTransition
    } : configTransition;
    const resolvedDelay = Number.isNaN(+delay) ? delay : +delay;
    const eventType = mutateEntryExit(resolvedDelay);
    return toArray(resolvedTransition).map((transition) => ({
      ...transition,
      event: eventType,
      delay: resolvedDelay
    }));
  });
  return delayedTransitions.map((delayedTransition) => {
    const {
      delay
    } = delayedTransition;
    return {
      ...formatTransition(stateNode, delayedTransition.event, delayedTransition),
      delay
    };
  });
}
function formatTransition(stateNode, descriptor, transitionConfig) {
  const normalizedTarget = normalizeTarget(transitionConfig.target);
  const reenter = transitionConfig.reenter ?? false;
  const target = resolveTarget(stateNode, normalizedTarget);
  if (transitionConfig.cond) {
    throw new Error(`State "${stateNode.id}" has declared \`cond\` for one of its transitions. This property has been renamed to \`guard\`. Please update your code.`);
  }
  const transition = {
    ...transitionConfig,
    actions: toArray(transitionConfig.actions),
    guard: transitionConfig.guard,
    target,
    source: stateNode,
    reenter,
    eventType: descriptor,
    toJSON: () => ({
      ...transition,
      source: `#${stateNode.id}`,
      target: target ? target.map((t) => `#${t.id}`) : void 0
    })
  };
  return transition;
}
function formatTransitions(stateNode) {
  const transitions = /* @__PURE__ */ new Map();
  if (stateNode.config.on) {
    for (const descriptor of Object.keys(stateNode.config.on)) {
      if (descriptor === NULL_EVENT) {
        throw new Error('Null events ("") cannot be specified as a transition key. Use `always: { ... }` instead.');
      }
      const transitionsConfig = stateNode.config.on[descriptor];
      transitions.set(descriptor, toTransitionConfigArray(transitionsConfig).map((t) => formatTransition(stateNode, descriptor, t)));
    }
  }
  if (stateNode.config.onDone) {
    const descriptor = `xstate.done.state.${stateNode.id}`;
    transitions.set(descriptor, toTransitionConfigArray(stateNode.config.onDone).map((t) => formatTransition(stateNode, descriptor, t)));
  }
  for (const invokeDef of stateNode.invoke) {
    if (invokeDef.onDone) {
      const descriptor = `xstate.done.actor.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onDone).map((t) => formatTransition(stateNode, descriptor, t)));
    }
    if (invokeDef.onError) {
      const descriptor = `xstate.error.actor.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onError).map((t) => formatTransition(stateNode, descriptor, t)));
    }
    if (invokeDef.onSnapshot) {
      const descriptor = `xstate.snapshot.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onSnapshot).map((t) => formatTransition(stateNode, descriptor, t)));
    }
  }
  for (const delayedTransition of stateNode.after) {
    let existing = transitions.get(delayedTransition.eventType);
    if (!existing) {
      existing = [];
      transitions.set(delayedTransition.eventType, existing);
    }
    existing.push(delayedTransition);
  }
  return transitions;
}
function formatInitialTransition(stateNode, _target) {
  const resolvedTarget = typeof _target === "string" ? stateNode.states[_target] : _target ? stateNode.states[_target.target] : void 0;
  if (!resolvedTarget && _target) {
    throw new Error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
      `Initial state node "${_target}" not found on parent state node #${stateNode.id}`
    );
  }
  const transition = {
    source: stateNode,
    actions: !_target || typeof _target === "string" ? [] : toArray(_target.actions),
    eventType: null,
    reenter: false,
    target: resolvedTarget ? [resolvedTarget] : [],
    toJSON: () => ({
      ...transition,
      source: `#${stateNode.id}`,
      target: resolvedTarget ? [`#${resolvedTarget.id}`] : []
    })
  };
  return transition;
}
function resolveTarget(stateNode, targets) {
  if (targets === void 0) {
    return void 0;
  }
  return targets.map((target) => {
    if (typeof target !== "string") {
      return target;
    }
    if (isStateId(target)) {
      return stateNode.machine.getStateNodeById(target);
    }
    const isInternalTarget = target[0] === STATE_DELIMITER;
    if (isInternalTarget && !stateNode.parent) {
      return getStateNodeByPath(stateNode, target.slice(1));
    }
    const resolvedTarget = isInternalTarget ? stateNode.key + target : target;
    if (stateNode.parent) {
      try {
        const targetStateNode = getStateNodeByPath(stateNode.parent, resolvedTarget);
        return targetStateNode;
      } catch (err) {
        throw new Error(`Invalid transition definition for state node '${stateNode.id}':
${err.message}`);
      }
    } else {
      throw new Error(`Invalid target: "${target}" is not a valid target from the root node. Did you mean ".${target}"?`);
    }
  });
}
function resolveHistoryDefaultTransition(stateNode) {
  const normalizedTarget = normalizeTarget(stateNode.config.target);
  if (!normalizedTarget) {
    return stateNode.parent.initial;
  }
  return {
    target: normalizedTarget.map((t) => typeof t === "string" ? getStateNodeByPath(stateNode.parent, t) : t)
  };
}
function isHistoryNode(stateNode) {
  return stateNode.type === "history";
}
function getInitialStateNodesWithTheirAncestors(stateNode) {
  const states = getInitialStateNodes(stateNode);
  for (const initialState of states) {
    for (const ancestor of getProperAncestors(initialState, stateNode)) {
      states.add(ancestor);
    }
  }
  return states;
}
function getInitialStateNodes(stateNode) {
  const set2 = /* @__PURE__ */ new Set();
  function iter(descStateNode) {
    if (set2.has(descStateNode)) {
      return;
    }
    set2.add(descStateNode);
    if (descStateNode.type === "compound") {
      iter(descStateNode.initial.target[0]);
    } else if (descStateNode.type === "parallel") {
      for (const child of getChildren(descStateNode)) {
        iter(child);
      }
    }
  }
  iter(stateNode);
  return set2;
}
function getStateNode(stateNode, stateKey) {
  if (isStateId(stateKey)) {
    return stateNode.machine.getStateNodeById(stateKey);
  }
  if (!stateNode.states) {
    throw new Error(`Unable to retrieve child state '${stateKey}' from '${stateNode.id}'; no child states exist.`);
  }
  const result = stateNode.states[stateKey];
  if (!result) {
    throw new Error(`Child state '${stateKey}' does not exist on '${stateNode.id}'`);
  }
  return result;
}
function getStateNodeByPath(stateNode, statePath) {
  if (typeof statePath === "string" && isStateId(statePath)) {
    try {
      return stateNode.machine.getStateNodeById(statePath);
    } catch {
    }
  }
  const arrayStatePath = toStatePath(statePath).slice();
  let currentStateNode = stateNode;
  while (arrayStatePath.length) {
    const key = arrayStatePath.shift();
    if (!key.length) {
      break;
    }
    currentStateNode = getStateNode(currentStateNode, key);
  }
  return currentStateNode;
}
function getStateNodes(stateNode, stateValue) {
  if (typeof stateValue === "string") {
    const childStateNode = stateNode.states[stateValue];
    if (!childStateNode) {
      throw new Error(`State '${stateValue}' does not exist on '${stateNode.id}'`);
    }
    return [stateNode, childStateNode];
  }
  const childStateKeys = Object.keys(stateValue);
  const childStateNodes = childStateKeys.map((subStateKey) => getStateNode(stateNode, subStateKey)).filter(Boolean);
  return [stateNode.machine.root, stateNode].concat(childStateNodes, childStateKeys.reduce((allSubStateNodes, subStateKey) => {
    const subStateNode = getStateNode(stateNode, subStateKey);
    if (!subStateNode) {
      return allSubStateNodes;
    }
    const subStateNodes = getStateNodes(subStateNode, stateValue[subStateKey]);
    return allSubStateNodes.concat(subStateNodes);
  }, []));
}
function transitionAtomicNode(stateNode, stateValue, snapshot, event) {
  const childStateNode = getStateNode(stateNode, stateValue);
  const next = childStateNode.next(snapshot, event);
  if (!next || !next.length) {
    return stateNode.next(snapshot, event);
  }
  return next;
}
function transitionCompoundNode(stateNode, stateValue, snapshot, event) {
  const subStateKeys = Object.keys(stateValue);
  const childStateNode = getStateNode(stateNode, subStateKeys[0]);
  const next = transitionNode(childStateNode, stateValue[subStateKeys[0]], snapshot, event);
  if (!next || !next.length) {
    return stateNode.next(snapshot, event);
  }
  return next;
}
function transitionParallelNode(stateNode, stateValue, snapshot, event) {
  const allInnerTransitions = [];
  for (const subStateKey of Object.keys(stateValue)) {
    const subStateValue = stateValue[subStateKey];
    if (!subStateValue) {
      continue;
    }
    const subStateNode = getStateNode(stateNode, subStateKey);
    const innerTransitions = transitionNode(subStateNode, subStateValue, snapshot, event);
    if (innerTransitions) {
      allInnerTransitions.push(...innerTransitions);
    }
  }
  if (!allInnerTransitions.length) {
    return stateNode.next(snapshot, event);
  }
  return allInnerTransitions;
}
function transitionNode(stateNode, stateValue, snapshot, event) {
  if (typeof stateValue === "string") {
    return transitionAtomicNode(stateNode, stateValue, snapshot, event);
  }
  if (Object.keys(stateValue).length === 1) {
    return transitionCompoundNode(stateNode, stateValue, snapshot, event);
  }
  return transitionParallelNode(stateNode, stateValue, snapshot, event);
}
function getHistoryNodes(stateNode) {
  return Object.keys(stateNode.states).map((key) => stateNode.states[key]).filter((sn2) => sn2.type === "history");
}
function isDescendant(childStateNode, parentStateNode) {
  let marker = childStateNode;
  while (marker.parent && marker.parent !== parentStateNode) {
    marker = marker.parent;
  }
  return marker.parent === parentStateNode;
}
function hasIntersection(s1, s2) {
  const set1 = new Set(s1);
  const set2 = new Set(s2);
  for (const item of set1) {
    if (set2.has(item)) {
      return true;
    }
  }
  for (const item of set2) {
    if (set1.has(item)) {
      return true;
    }
  }
  return false;
}
function removeConflictingTransitions(enabledTransitions, stateNodeSet, historyValue) {
  const filteredTransitions = /* @__PURE__ */ new Set();
  for (const t1 of enabledTransitions) {
    let t1Preempted = false;
    const transitionsToRemove = /* @__PURE__ */ new Set();
    for (const t2 of filteredTransitions) {
      if (hasIntersection(computeExitSet([t1], stateNodeSet, historyValue), computeExitSet([t2], stateNodeSet, historyValue))) {
        if (isDescendant(t1.source, t2.source)) {
          transitionsToRemove.add(t2);
        } else {
          t1Preempted = true;
          break;
        }
      }
    }
    if (!t1Preempted) {
      for (const t3 of transitionsToRemove) {
        filteredTransitions.delete(t3);
      }
      filteredTransitions.add(t1);
    }
  }
  return Array.from(filteredTransitions);
}
function findLeastCommonAncestor(stateNodes) {
  const [head, ...tail] = stateNodes;
  for (const ancestor of getProperAncestors(head, void 0)) {
    if (tail.every((sn2) => isDescendant(sn2, ancestor))) {
      return ancestor;
    }
  }
}
function getEffectiveTargetStates(transition, historyValue) {
  if (!transition.target) {
    return [];
  }
  const targets = /* @__PURE__ */ new Set();
  for (const targetNode of transition.target) {
    if (isHistoryNode(targetNode)) {
      if (historyValue[targetNode.id]) {
        for (const node of historyValue[targetNode.id]) {
          targets.add(node);
        }
      } else {
        for (const node of getEffectiveTargetStates(resolveHistoryDefaultTransition(targetNode), historyValue)) {
          targets.add(node);
        }
      }
    } else {
      targets.add(targetNode);
    }
  }
  return [...targets];
}
function getTransitionDomain(transition, historyValue) {
  const targetStates = getEffectiveTargetStates(transition, historyValue);
  if (!targetStates) {
    return;
  }
  if (!transition.reenter && targetStates.every((target) => target === transition.source || isDescendant(target, transition.source))) {
    return transition.source;
  }
  const lca = findLeastCommonAncestor(targetStates.concat(transition.source));
  if (lca) {
    return lca;
  }
  if (transition.reenter) {
    return;
  }
  return transition.source.machine.root;
}
function computeExitSet(transitions, stateNodeSet, historyValue) {
  const statesToExit = /* @__PURE__ */ new Set();
  for (const t of transitions) {
    if (t.target?.length) {
      const domain = getTransitionDomain(t, historyValue);
      if (t.reenter && t.source === domain) {
        statesToExit.add(domain);
      }
      for (const stateNode of stateNodeSet) {
        if (isDescendant(stateNode, domain)) {
          statesToExit.add(stateNode);
        }
      }
    }
  }
  return [...statesToExit];
}
function areStateNodeCollectionsEqual(prevStateNodes, nextStateNodeSet) {
  if (prevStateNodes.length !== nextStateNodeSet.size) {
    return false;
  }
  for (const node of prevStateNodes) {
    if (!nextStateNodeSet.has(node)) {
      return false;
    }
  }
  return true;
}
function microstep(transitions, currentSnapshot, actorScope, event, isInitial, internalQueue) {
  if (!transitions.length) {
    return currentSnapshot;
  }
  const mutStateNodeSet = new Set(currentSnapshot._nodes);
  let historyValue = currentSnapshot.historyValue;
  const filteredTransitions = removeConflictingTransitions(transitions, mutStateNodeSet, historyValue);
  let nextState = currentSnapshot;
  if (!isInitial) {
    [nextState, historyValue] = exitStates(nextState, event, actorScope, filteredTransitions, mutStateNodeSet, historyValue, internalQueue, actorScope.actionExecutor);
  }
  nextState = resolveActionsAndContext(nextState, event, actorScope, filteredTransitions.flatMap((t) => t.actions), internalQueue, void 0);
  nextState = enterStates(nextState, event, actorScope, filteredTransitions, mutStateNodeSet, internalQueue, historyValue, isInitial);
  const nextStateNodes = [...mutStateNodeSet];
  if (nextState.status === "done") {
    nextState = resolveActionsAndContext(nextState, event, actorScope, nextStateNodes.sort((a, b) => b.order - a.order).flatMap((state) => state.exit), internalQueue, void 0);
  }
  try {
    if (historyValue === currentSnapshot.historyValue && areStateNodeCollectionsEqual(currentSnapshot._nodes, mutStateNodeSet)) {
      return nextState;
    }
    return cloneMachineSnapshot(nextState, {
      _nodes: nextStateNodes,
      historyValue
    });
  } catch (e3) {
    throw e3;
  }
}
function getMachineOutput(snapshot, event, actorScope, rootNode, rootCompletionNode) {
  if (rootNode.output === void 0) {
    return;
  }
  const doneStateEvent = createDoneStateEvent(rootCompletionNode.id, rootCompletionNode.output !== void 0 && rootCompletionNode.parent ? resolveOutput(rootCompletionNode.output, snapshot.context, event, actorScope.self) : void 0);
  return resolveOutput(rootNode.output, snapshot.context, doneStateEvent, actorScope.self);
}
function enterStates(currentSnapshot, event, actorScope, filteredTransitions, mutStateNodeSet, internalQueue, historyValue, isInitial) {
  let nextSnapshot = currentSnapshot;
  const statesToEnter = /* @__PURE__ */ new Set();
  const statesForDefaultEntry = /* @__PURE__ */ new Set();
  computeEntrySet(filteredTransitions, historyValue, statesForDefaultEntry, statesToEnter);
  if (isInitial) {
    statesForDefaultEntry.add(currentSnapshot.machine.root);
  }
  const completedNodes = /* @__PURE__ */ new Set();
  for (const stateNodeToEnter of [...statesToEnter].sort((a, b) => a.order - b.order)) {
    mutStateNodeSet.add(stateNodeToEnter);
    const actions = [];
    actions.push(...stateNodeToEnter.entry);
    for (const invokeDef of stateNodeToEnter.invoke) {
      actions.push(spawnChild(invokeDef.src, {
        ...invokeDef,
        syncSnapshot: !!invokeDef.onSnapshot
      }));
    }
    if (statesForDefaultEntry.has(stateNodeToEnter)) {
      const initialActions = stateNodeToEnter.initial.actions;
      actions.push(...initialActions);
    }
    nextSnapshot = resolveActionsAndContext(nextSnapshot, event, actorScope, actions, internalQueue, stateNodeToEnter.invoke.map((invokeDef) => invokeDef.id));
    if (stateNodeToEnter.type === "final") {
      const parent = stateNodeToEnter.parent;
      let ancestorMarker = parent?.type === "parallel" ? parent : parent?.parent;
      let rootCompletionNode = ancestorMarker || stateNodeToEnter;
      if (parent?.type === "compound") {
        internalQueue.push(createDoneStateEvent(parent.id, stateNodeToEnter.output !== void 0 ? resolveOutput(stateNodeToEnter.output, nextSnapshot.context, event, actorScope.self) : void 0));
      }
      while (ancestorMarker?.type === "parallel" && !completedNodes.has(ancestorMarker) && isInFinalState(mutStateNodeSet, ancestorMarker)) {
        completedNodes.add(ancestorMarker);
        internalQueue.push(createDoneStateEvent(ancestorMarker.id));
        rootCompletionNode = ancestorMarker;
        ancestorMarker = ancestorMarker.parent;
      }
      if (ancestorMarker) {
        continue;
      }
      nextSnapshot = cloneMachineSnapshot(nextSnapshot, {
        status: "done",
        output: getMachineOutput(nextSnapshot, event, actorScope, nextSnapshot.machine.root, rootCompletionNode)
      });
    }
  }
  return nextSnapshot;
}
function computeEntrySet(transitions, historyValue, statesForDefaultEntry, statesToEnter) {
  for (const t of transitions) {
    const domain = getTransitionDomain(t, historyValue);
    for (const s of t.target || []) {
      if (!isHistoryNode(s) && // if the target is different than the source then it will *definitely* be entered
      (t.source !== s || // we know that the domain can't lie within the source
      // if it's different than the source then it's outside of it and it means that the target has to be entered as well
      t.source !== domain || // reentering transitions always enter the target, even if it's the source itself
      t.reenter)) {
        statesToEnter.add(s);
        statesForDefaultEntry.add(s);
      }
      addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
    }
    const targetStates = getEffectiveTargetStates(t, historyValue);
    for (const s of targetStates) {
      const ancestors = getProperAncestors(s, domain);
      if (domain?.type === "parallel") {
        ancestors.push(domain);
      }
      addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, !t.source.parent && t.reenter ? void 0 : domain);
    }
  }
}
function addDescendantStatesToEnter(stateNode, historyValue, statesForDefaultEntry, statesToEnter) {
  if (isHistoryNode(stateNode)) {
    if (historyValue[stateNode.id]) {
      const historyStateNodes = historyValue[stateNode.id];
      for (const s of historyStateNodes) {
        statesToEnter.add(s);
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of historyStateNodes) {
        addProperAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
      }
    } else {
      const historyDefaultTransition = resolveHistoryDefaultTransition(stateNode);
      for (const s of historyDefaultTransition.target) {
        statesToEnter.add(s);
        if (historyDefaultTransition === stateNode.parent?.initial) {
          statesForDefaultEntry.add(stateNode.parent);
        }
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of historyDefaultTransition.target) {
        addProperAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
      }
    }
  } else {
    if (stateNode.type === "compound") {
      const [initialState] = stateNode.initial.target;
      if (!isHistoryNode(initialState)) {
        statesToEnter.add(initialState);
        statesForDefaultEntry.add(initialState);
      }
      addDescendantStatesToEnter(initialState, historyValue, statesForDefaultEntry, statesToEnter);
      addProperAncestorStatesToEnter(initialState, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
    } else {
      if (stateNode.type === "parallel") {
        for (const child of getChildren(stateNode).filter((sn2) => !isHistoryNode(sn2))) {
          if (![...statesToEnter].some((s) => isDescendant(s, child))) {
            if (!isHistoryNode(child)) {
              statesToEnter.add(child);
              statesForDefaultEntry.add(child);
            }
            addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
          }
        }
      }
    }
  }
}
function addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, reentrancyDomain) {
  for (const anc of ancestors) {
    if (!reentrancyDomain || isDescendant(anc, reentrancyDomain)) {
      statesToEnter.add(anc);
    }
    if (anc.type === "parallel") {
      for (const child of getChildren(anc).filter((sn2) => !isHistoryNode(sn2))) {
        if (![...statesToEnter].some((s) => isDescendant(s, child))) {
          statesToEnter.add(child);
          addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
        }
      }
    }
  }
}
function addProperAncestorStatesToEnter(stateNode, toStateNode, statesToEnter, historyValue, statesForDefaultEntry) {
  addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, getProperAncestors(stateNode, toStateNode));
}
function exitStates(currentSnapshot, event, actorScope, transitions, mutStateNodeSet, historyValue, internalQueue, _actionExecutor) {
  let nextSnapshot = currentSnapshot;
  const statesToExit = computeExitSet(transitions, mutStateNodeSet, historyValue);
  statesToExit.sort((a, b) => b.order - a.order);
  let changedHistory;
  for (const exitStateNode of statesToExit) {
    for (const historyNode of getHistoryNodes(exitStateNode)) {
      let predicate;
      if (historyNode.history === "deep") {
        predicate = (sn2) => isAtomicStateNode(sn2) && isDescendant(sn2, exitStateNode);
      } else {
        predicate = (sn2) => {
          return sn2.parent === exitStateNode;
        };
      }
      changedHistory ??= {
        ...historyValue
      };
      changedHistory[historyNode.id] = Array.from(mutStateNodeSet).filter(predicate);
    }
  }
  for (const s of statesToExit) {
    nextSnapshot = resolveActionsAndContext(nextSnapshot, event, actorScope, [...s.exit, ...s.invoke.map((def) => stopChild(def.id))], internalQueue, void 0);
    mutStateNodeSet.delete(s);
  }
  return [nextSnapshot, changedHistory || historyValue];
}
function getAction(machine, actionType) {
  return machine.implementations.actions[actionType];
}
function resolveAndExecuteActionsWithContext(currentSnapshot, event, actorScope, actions, extra, retries) {
  const {
    machine
  } = currentSnapshot;
  let intermediateSnapshot = currentSnapshot;
  for (const action of actions) {
    const isInline = typeof action === "function";
    const resolvedAction = isInline ? action : (
      // the existing type of `.actions` assumes non-nullable `TExpressionAction`
      // it's fine to cast this here to get a common type and lack of errors in the rest of the code
      // our logic below makes sure that we call those 2 "variants" correctly
      getAction(machine, typeof action === "string" ? action : action.type)
    );
    const actionArgs = {
      context: intermediateSnapshot.context,
      event,
      self: actorScope.self,
      system: actorScope.system
    };
    const actionParams = isInline || typeof action === "string" ? void 0 : "params" in action ? typeof action.params === "function" ? action.params({
      context: intermediateSnapshot.context,
      event
    }) : action.params : void 0;
    if (!resolvedAction || !("resolve" in resolvedAction)) {
      actorScope.actionExecutor({
        type: typeof action === "string" ? action : typeof action === "object" ? action.type : action.name || "(anonymous)",
        info: actionArgs,
        params: actionParams,
        exec: resolvedAction
      });
      continue;
    }
    const builtinAction = resolvedAction;
    const [nextState, params, actions2] = builtinAction.resolve(
      actorScope,
      intermediateSnapshot,
      actionArgs,
      actionParams,
      resolvedAction,
      // this holds all params
      extra
    );
    intermediateSnapshot = nextState;
    if ("retryResolve" in builtinAction) {
      retries?.push([builtinAction, params]);
    }
    if ("execute" in builtinAction) {
      actorScope.actionExecutor({
        type: builtinAction.type,
        info: actionArgs,
        params,
        exec: builtinAction.execute.bind(null, actorScope, params)
      });
    }
    if (actions2) {
      intermediateSnapshot = resolveAndExecuteActionsWithContext(intermediateSnapshot, event, actorScope, actions2, extra, retries);
    }
  }
  return intermediateSnapshot;
}
function resolveActionsAndContext(currentSnapshot, event, actorScope, actions, internalQueue, deferredActorIds) {
  const retries = deferredActorIds ? [] : void 0;
  const nextState = resolveAndExecuteActionsWithContext(currentSnapshot, event, actorScope, actions, {
    internalQueue,
    deferredActorIds
  }, retries);
  retries?.forEach(([builtinAction, params]) => {
    builtinAction.retryResolve(actorScope, nextState, params);
  });
  return nextState;
}
function macrostep(snapshot, event, actorScope, internalQueue) {
  if (event.type === WILDCARD) {
    throw new Error(`An event cannot have the wildcard type ('${WILDCARD}')`);
  }
  let nextSnapshot = snapshot;
  const microstates = [];
  function addMicrostate(microstate, event2, transitions) {
    actorScope.system._sendInspectionEvent({
      type: "@xstate.microstep",
      actorRef: actorScope.self,
      event: event2,
      snapshot: microstate,
      _transitions: transitions
    });
    microstates.push(microstate);
  }
  if (event.type === XSTATE_STOP) {
    nextSnapshot = cloneMachineSnapshot(stopChildren(nextSnapshot, event, actorScope), {
      status: "stopped"
    });
    addMicrostate(nextSnapshot, event, []);
    return {
      snapshot: nextSnapshot,
      microstates
    };
  }
  let nextEvent = event;
  if (nextEvent.type !== XSTATE_INIT) {
    const currentEvent = nextEvent;
    const isErr = isErrorActorEvent(currentEvent);
    const transitions = selectTransitions(currentEvent, nextSnapshot);
    if (isErr && !transitions.length) {
      nextSnapshot = cloneMachineSnapshot(snapshot, {
        status: "error",
        error: currentEvent.error
      });
      addMicrostate(nextSnapshot, currentEvent, []);
      return {
        snapshot: nextSnapshot,
        microstates
      };
    }
    nextSnapshot = microstep(
      transitions,
      snapshot,
      actorScope,
      nextEvent,
      false,
      // isInitial
      internalQueue
    );
    addMicrostate(nextSnapshot, currentEvent, transitions);
  }
  let shouldSelectEventlessTransitions = true;
  while (nextSnapshot.status === "active") {
    let enabledTransitions = shouldSelectEventlessTransitions ? selectEventlessTransitions(nextSnapshot, nextEvent) : [];
    const previousState = enabledTransitions.length ? nextSnapshot : void 0;
    if (!enabledTransitions.length) {
      if (!internalQueue.length) {
        break;
      }
      nextEvent = internalQueue.shift();
      enabledTransitions = selectTransitions(nextEvent, nextSnapshot);
    }
    nextSnapshot = microstep(enabledTransitions, nextSnapshot, actorScope, nextEvent, false, internalQueue);
    shouldSelectEventlessTransitions = nextSnapshot !== previousState;
    addMicrostate(nextSnapshot, nextEvent, enabledTransitions);
  }
  if (nextSnapshot.status !== "active") {
    stopChildren(nextSnapshot, nextEvent, actorScope);
  }
  return {
    snapshot: nextSnapshot,
    microstates
  };
}
function stopChildren(nextState, event, actorScope) {
  return resolveActionsAndContext(nextState, event, actorScope, Object.values(nextState.children).map((child) => stopChild(child)), [], void 0);
}
function selectTransitions(event, nextState) {
  return nextState.machine.getTransitionData(nextState, event);
}
function selectEventlessTransitions(nextState, event) {
  const enabledTransitionSet = /* @__PURE__ */ new Set();
  const atomicStates = nextState._nodes.filter(isAtomicStateNode);
  for (const stateNode of atomicStates) {
    loop: for (const s of [stateNode].concat(getProperAncestors(stateNode, void 0))) {
      if (!s.always) {
        continue;
      }
      for (const transition of s.always) {
        if (transition.guard === void 0 || evaluateGuard(transition.guard, nextState.context, event, nextState)) {
          enabledTransitionSet.add(transition);
          break loop;
        }
      }
    }
  }
  return removeConflictingTransitions(Array.from(enabledTransitionSet), new Set(nextState._nodes), nextState.historyValue);
}
function resolveStateValue(rootNode, stateValue) {
  const allStateNodes = getAllStateNodes(getStateNodes(rootNode, stateValue));
  return getStateValue(rootNode, [...allStateNodes]);
}
function isMachineSnapshot(value) {
  return !!value && typeof value === "object" && "machine" in value && "value" in value;
}
const machineSnapshotMatches = function matches(testValue) {
  return matchesState(testValue, this.value);
};
const machineSnapshotHasTag = function hasTag(tag) {
  return this.tags.has(tag);
};
const machineSnapshotCan = function can(event) {
  if (!this.machine) {
    console.warn(`state.can(...) used outside of a machine-created State object; this will always return false.`);
  }
  const transitionData = this.machine.getTransitionData(this, event);
  return !!transitionData?.length && // Check that at least one transition is not forbidden
  transitionData.some((t) => t.target !== void 0 || t.actions.length);
};
const machineSnapshotToJSON = function toJSON() {
  const {
    _nodes: nodes,
    tags,
    machine,
    getMeta: getMeta2,
    toJSON: toJSON2,
    can: can2,
    hasTag: hasTag2,
    matches: matches2,
    ...jsonValues
  } = this;
  return {
    ...jsonValues,
    tags: Array.from(tags)
  };
};
const machineSnapshotGetMeta = function getMeta() {
  return this._nodes.reduce((acc, stateNode) => {
    if (stateNode.meta !== void 0) {
      acc[stateNode.id] = stateNode.meta;
    }
    return acc;
  }, {});
};
function createMachineSnapshot(config, machine) {
  return {
    status: config.status,
    output: config.output,
    error: config.error,
    machine,
    context: config.context,
    _nodes: config._nodes,
    value: getStateValue(machine.root, config._nodes),
    tags: new Set(config._nodes.flatMap((sn2) => sn2.tags)),
    children: config.children,
    historyValue: config.historyValue || {},
    matches: machineSnapshotMatches,
    hasTag: machineSnapshotHasTag,
    can: machineSnapshotCan,
    getMeta: machineSnapshotGetMeta,
    toJSON: machineSnapshotToJSON
  };
}
function cloneMachineSnapshot(snapshot, config = {}) {
  return createMachineSnapshot({
    ...snapshot,
    ...config
  }, snapshot.machine);
}
function serializeHistoryValue(historyValue) {
  if (typeof historyValue !== "object" || historyValue === null) {
    return {};
  }
  const result = {};
  for (const key in historyValue) {
    const value = historyValue[key];
    if (Array.isArray(value)) {
      result[key] = value.map((item) => ({
        id: item.id
      }));
    }
  }
  return result;
}
function getPersistedSnapshot(snapshot, options) {
  const {
    _nodes: nodes,
    tags,
    machine,
    children: children2,
    context,
    can: can2,
    hasTag: hasTag2,
    matches: matches2,
    getMeta: getMeta2,
    toJSON: toJSON2,
    ...jsonValues
  } = snapshot;
  const childrenJson = {};
  for (const id2 in children2) {
    const child = children2[id2];
    if (typeof child.src !== "string" && (!options || !("__unsafeAllowInlineActors" in options))) {
      throw new Error("An inline child actor cannot be persisted.");
    }
    childrenJson[id2] = {
      snapshot: child.getPersistedSnapshot(options),
      src: child.src,
      systemId: child.systemId,
      syncSnapshot: child._syncSnapshot
    };
  }
  const persisted = {
    ...jsonValues,
    context: persistContext(context),
    children: childrenJson,
    historyValue: serializeHistoryValue(jsonValues.historyValue)
  };
  return persisted;
}
function persistContext(contextPart) {
  let copy;
  for (const key in contextPart) {
    const value = contextPart[key];
    if (value && typeof value === "object") {
      if ("sessionId" in value && "send" in value && "ref" in value) {
        copy ??= Array.isArray(contextPart) ? contextPart.slice() : {
          ...contextPart
        };
        copy[key] = {
          xstate$$type: $$ACTOR_TYPE,
          id: value.id
        };
      } else {
        const result = persistContext(value);
        if (result !== value) {
          copy ??= Array.isArray(contextPart) ? contextPart.slice() : {
            ...contextPart
          };
          copy[key] = result;
        }
      }
    }
  }
  return copy ?? contextPart;
}
function resolveRaise(_, snapshot, args, actionParams, {
  event: eventOrExpr,
  id: id2,
  delay
}, {
  internalQueue
}) {
  const delaysMap = snapshot.machine.implementations.delays;
  if (typeof eventOrExpr === "string") {
    throw new Error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Only event objects may be used with raise; use raise({ type: "${eventOrExpr}" }) instead`
    );
  }
  const resolvedEvent = typeof eventOrExpr === "function" ? eventOrExpr(args, actionParams) : eventOrExpr;
  let resolvedDelay;
  if (typeof delay === "string") {
    const configDelay = delaysMap && delaysMap[delay];
    resolvedDelay = typeof configDelay === "function" ? configDelay(args, actionParams) : configDelay;
  } else {
    resolvedDelay = typeof delay === "function" ? delay(args, actionParams) : delay;
  }
  if (typeof resolvedDelay !== "number") {
    internalQueue.push(resolvedEvent);
  }
  return [snapshot, {
    event: resolvedEvent,
    id: id2,
    delay: resolvedDelay
  }, void 0];
}
function executeRaise(actorScope, params) {
  const {
    event,
    delay,
    id: id2
  } = params;
  if (typeof delay === "number") {
    actorScope.defer(() => {
      const self2 = actorScope.self;
      actorScope.system.scheduler.schedule(self2, self2, event, delay, id2);
    });
    return;
  }
}
function raise(eventOrExpr, options) {
  if (executingCustomAction) {
    console.warn("Custom actions should not call `raise()` directly, as it is not imperative. See https://stately.ai/docs/actions#built-in-actions for more details.");
  }
  function raise2(_args, _params) {
    {
      throw new Error(`This isn't supposed to be called`);
    }
  }
  raise2.type = "xstate.raise";
  raise2.event = eventOrExpr;
  raise2.id = options?.id;
  raise2.delay = options?.delay;
  raise2.resolve = resolveRaise;
  raise2.execute = executeRaise;
  return raise2;
}
function createSpawner(actorScope, {
  machine,
  context
}, event, spawnedChildren) {
  const spawn = (src, options) => {
    if (typeof src === "string") {
      const logic = resolveReferencedActor(machine, src);
      if (!logic) {
        throw new Error(`Actor logic '${src}' not implemented in machine '${machine.id}'`);
      }
      const actorRef = createActor(logic, {
        id: options?.id,
        parent: actorScope.self,
        syncSnapshot: options?.syncSnapshot,
        input: typeof options?.input === "function" ? options.input({
          context,
          event,
          self: actorScope.self
        }) : options?.input,
        src,
        systemId: options?.systemId
      });
      spawnedChildren[actorRef.id] = actorRef;
      return actorRef;
    } else {
      const actorRef = createActor(src, {
        id: options?.id,
        parent: actorScope.self,
        syncSnapshot: options?.syncSnapshot,
        input: options?.input,
        src,
        systemId: options?.systemId
      });
      return actorRef;
    }
  };
  return (src, options) => {
    const actorRef = spawn(src, options);
    spawnedChildren[actorRef.id] = actorRef;
    actorScope.defer(() => {
      if (actorRef._processingStatus === ProcessingStatus.Stopped) {
        return;
      }
      actorRef.start();
    });
    return actorRef;
  };
}
function resolveAssign(actorScope, snapshot, actionArgs, actionParams, {
  assignment
}) {
  if (!snapshot.context) {
    throw new Error("Cannot assign to undefined `context`. Ensure that `context` is defined in the machine config.");
  }
  const spawnedChildren = {};
  const assignArgs = {
    context: snapshot.context,
    event: actionArgs.event,
    spawn: createSpawner(actorScope, snapshot, actionArgs.event, spawnedChildren),
    self: actorScope.self,
    system: actorScope.system
  };
  let partialUpdate = {};
  if (typeof assignment === "function") {
    partialUpdate = assignment(assignArgs, actionParams);
  } else {
    for (const key of Object.keys(assignment)) {
      const propAssignment = assignment[key];
      partialUpdate[key] = typeof propAssignment === "function" ? propAssignment(assignArgs, actionParams) : propAssignment;
    }
  }
  const updatedContext = Object.assign({}, snapshot.context, partialUpdate);
  return [cloneMachineSnapshot(snapshot, {
    context: updatedContext,
    children: Object.keys(spawnedChildren).length ? {
      ...snapshot.children,
      ...spawnedChildren
    } : snapshot.children
  }), void 0, void 0];
}
function assign(assignment) {
  if (executingCustomAction) {
    console.warn("Custom actions should not call `assign()` directly, as it is not imperative. See https://stately.ai/docs/actions#built-in-actions for more details.");
  }
  function assign2(_args, _params) {
    {
      throw new Error(`This isn't supposed to be called`);
    }
  }
  assign2.type = "xstate.assign";
  assign2.assignment = assignment;
  assign2.resolve = resolveAssign;
  return assign2;
}
const cache = /* @__PURE__ */ new WeakMap();
function memo(object, key, fn2) {
  let memoizedData = cache.get(object);
  if (!memoizedData) {
    memoizedData = {
      [key]: fn2()
    };
    cache.set(object, memoizedData);
  } else if (!(key in memoizedData)) {
    memoizedData[key] = fn2();
  }
  return memoizedData[key];
}
const EMPTY_OBJECT = {};
const toSerializableAction = (action) => {
  if (typeof action === "string") {
    return {
      type: action
    };
  }
  if (typeof action === "function") {
    if ("resolve" in action) {
      return {
        type: action.type
      };
    }
    return {
      type: action.name
    };
  }
  return action;
};
class StateNode {
  constructor(config, options) {
    this.config = config;
    this.key = void 0;
    this.id = void 0;
    this.type = void 0;
    this.path = void 0;
    this.states = void 0;
    this.history = void 0;
    this.entry = void 0;
    this.exit = void 0;
    this.parent = void 0;
    this.machine = void 0;
    this.meta = void 0;
    this.output = void 0;
    this.order = -1;
    this.description = void 0;
    this.tags = [];
    this.transitions = void 0;
    this.always = void 0;
    this.parent = options._parent;
    this.key = options._key;
    this.machine = options._machine;
    this.path = this.parent ? this.parent.path.concat(this.key) : [];
    this.id = this.config.id || [this.machine.id, ...this.path].join(STATE_DELIMITER);
    this.type = this.config.type || (this.config.states && Object.keys(this.config.states).length ? "compound" : this.config.history ? "history" : "atomic");
    this.description = this.config.description;
    this.order = this.machine.idMap.size;
    this.machine.idMap.set(this.id, this);
    this.states = this.config.states ? mapValues(this.config.states, (stateConfig, key) => {
      const stateNode = new StateNode(stateConfig, {
        _parent: this,
        _key: key,
        _machine: this.machine
      });
      return stateNode;
    }) : EMPTY_OBJECT;
    if (this.type === "compound" && !this.config.initial) {
      throw new Error(`No initial state specified for compound state node "#${this.id}". Try adding { initial: "${Object.keys(this.states)[0]}" } to the state config.`);
    }
    this.history = this.config.history === true ? "shallow" : this.config.history || false;
    this.entry = toArray(this.config.entry).slice();
    this.exit = toArray(this.config.exit).slice();
    this.meta = this.config.meta;
    this.output = this.type === "final" || !this.parent ? this.config.output : void 0;
    this.tags = toArray(config.tags).slice();
  }
  /** @internal */
  _initialize() {
    this.transitions = formatTransitions(this);
    if (this.config.always) {
      this.always = toTransitionConfigArray(this.config.always).map((t) => formatTransition(this, NULL_EVENT, t));
    }
    Object.keys(this.states).forEach((key) => {
      this.states[key]._initialize();
    });
  }
  /** The well-structured state node definition. */
  get definition() {
    return {
      id: this.id,
      key: this.key,
      version: this.machine.version,
      type: this.type,
      initial: this.initial ? {
        target: this.initial.target,
        source: this,
        actions: this.initial.actions.map(toSerializableAction),
        eventType: null,
        reenter: false,
        toJSON: () => ({
          target: this.initial.target.map((t) => `#${t.id}`),
          source: `#${this.id}`,
          actions: this.initial.actions.map(toSerializableAction),
          eventType: null
        })
      } : void 0,
      history: this.history,
      states: mapValues(this.states, (state) => {
        return state.definition;
      }),
      on: this.on,
      transitions: [...this.transitions.values()].flat().map((t) => ({
        ...t,
        actions: t.actions.map(toSerializableAction)
      })),
      entry: this.entry.map(toSerializableAction),
      exit: this.exit.map(toSerializableAction),
      meta: this.meta,
      order: this.order || -1,
      output: this.output,
      invoke: this.invoke,
      description: this.description,
      tags: this.tags
    };
  }
  /** @internal */
  toJSON() {
    return this.definition;
  }
  /** The logic invoked as actors by this state node. */
  get invoke() {
    return memo(this, "invoke", () => toArray(this.config.invoke).map((invokeConfig, i) => {
      const {
        src,
        systemId
      } = invokeConfig;
      const resolvedId = invokeConfig.id ?? createInvokeId(this.id, i);
      const sourceName = typeof src === "string" ? src : `xstate.invoke.${createInvokeId(this.id, i)}`;
      return {
        ...invokeConfig,
        src: sourceName,
        id: resolvedId,
        systemId,
        toJSON() {
          const {
            onDone,
            onError,
            ...invokeDefValues
          } = invokeConfig;
          return {
            ...invokeDefValues,
            type: "xstate.invoke",
            src: sourceName,
            id: resolvedId
          };
        }
      };
    }));
  }
  /** The mapping of events to transitions. */
  get on() {
    return memo(this, "on", () => {
      const transitions = this.transitions;
      return [...transitions].flatMap(([descriptor, t]) => t.map((t2) => [descriptor, t2])).reduce((map, [descriptor, transition]) => {
        map[descriptor] = map[descriptor] || [];
        map[descriptor].push(transition);
        return map;
      }, {});
    });
  }
  get after() {
    return memo(this, "delayedTransitions", () => getDelayedTransitions(this));
  }
  get initial() {
    return memo(this, "initial", () => formatInitialTransition(this, this.config.initial));
  }
  /** @internal */
  next(snapshot, event) {
    const eventType = event.type;
    const actions = [];
    let selectedTransition;
    const candidates = memo(this, `candidates-${eventType}`, () => getCandidates(this, eventType));
    for (const candidate of candidates) {
      const {
        guard
      } = candidate;
      const resolvedContext = snapshot.context;
      let guardPassed = false;
      try {
        guardPassed = !guard || evaluateGuard(guard, resolvedContext, event, snapshot);
      } catch (err) {
        const guardType = typeof guard === "string" ? guard : typeof guard === "object" ? guard.type : void 0;
        throw new Error(`Unable to evaluate guard ${guardType ? `'${guardType}' ` : ""}in transition for event '${eventType}' in state node '${this.id}':
${err.message}`);
      }
      if (guardPassed) {
        actions.push(...candidate.actions);
        selectedTransition = candidate;
        break;
      }
    }
    return selectedTransition ? [selectedTransition] : void 0;
  }
  /** All the event types accepted by this state node and its descendants. */
  get events() {
    return memo(this, "events", () => {
      const {
        states
      } = this;
      const events = new Set(this.ownEvents);
      if (states) {
        for (const stateId of Object.keys(states)) {
          const state = states[stateId];
          if (state.states) {
            for (const event of state.events) {
              events.add(`${event}`);
            }
          }
        }
      }
      return Array.from(events);
    });
  }
  /**
   * All the events that have transitions directly from this state node.
   *
   * Excludes any inert events.
   */
  get ownEvents() {
    const keys = Object.keys(Object.fromEntries(this.transitions));
    const events = new Set(keys.filter((descriptor) => {
      return this.transitions.get(descriptor).some((transition) => !(!transition.target && !transition.actions.length && !transition.reenter));
    }));
    return Array.from(events);
  }
}
const STATE_IDENTIFIER = "#";
class StateMachine {
  constructor(config, implementations) {
    this.config = config;
    this.version = void 0;
    this.schemas = void 0;
    this.implementations = void 0;
    this.__xstatenode = true;
    this.idMap = /* @__PURE__ */ new Map();
    this.root = void 0;
    this.id = void 0;
    this.states = void 0;
    this.events = void 0;
    this.id = config.id || "(machine)";
    this.implementations = {
      actors: implementations?.actors ?? {},
      actions: implementations?.actions ?? {},
      delays: implementations?.delays ?? {},
      guards: implementations?.guards ?? {}
    };
    this.version = this.config.version;
    this.schemas = this.config.schemas;
    this.transition = this.transition.bind(this);
    this.getInitialSnapshot = this.getInitialSnapshot.bind(this);
    this.getPersistedSnapshot = this.getPersistedSnapshot.bind(this);
    this.restoreSnapshot = this.restoreSnapshot.bind(this);
    this.start = this.start.bind(this);
    this.root = new StateNode(config, {
      _key: this.id,
      _machine: this
    });
    this.root._initialize();
    this.states = this.root.states;
    this.events = this.root.events;
    if (!("output" in this.root) && Object.values(this.states).some((state) => state.type === "final" && "output" in state)) {
      console.warn("Missing `machine.output` declaration (top-level final state with output detected)");
    }
  }
  /**
   * Clones this state machine with the provided implementations.
   *
   * @param implementations Options (`actions`, `guards`, `actors`, `delays`) to
   *   recursively merge with the existing options.
   * @returns A new `StateMachine` instance with the provided implementations.
   */
  provide(implementations) {
    const {
      actions,
      guards,
      actors,
      delays
    } = this.implementations;
    return new StateMachine(this.config, {
      actions: {
        ...actions,
        ...implementations.actions
      },
      guards: {
        ...guards,
        ...implementations.guards
      },
      actors: {
        ...actors,
        ...implementations.actors
      },
      delays: {
        ...delays,
        ...implementations.delays
      }
    });
  }
  resolveState(config) {
    const resolvedStateValue = resolveStateValue(this.root, config.value);
    const nodeSet = getAllStateNodes(getStateNodes(this.root, resolvedStateValue));
    return createMachineSnapshot({
      _nodes: [...nodeSet],
      context: config.context || {},
      children: {},
      status: isInFinalState(nodeSet, this.root) ? "done" : config.status || "active",
      output: config.output,
      error: config.error,
      historyValue: config.historyValue
    }, this);
  }
  /**
   * Determines the next snapshot given the current `snapshot` and received
   * `event`. Calculates a full macrostep from all microsteps.
   *
   * @param snapshot The current snapshot
   * @param event The received event
   */
  transition(snapshot, event, actorScope) {
    return macrostep(snapshot, event, actorScope, []).snapshot;
  }
  /**
   * Determines the next state given the current `state` and `event`. Calculates
   * a microstep.
   *
   * @param state The current state
   * @param event The received event
   */
  microstep(snapshot, event, actorScope) {
    return macrostep(snapshot, event, actorScope, []).microstates;
  }
  getTransitionData(snapshot, event) {
    return transitionNode(this.root, snapshot.value, snapshot, event) || [];
  }
  /**
   * The initial state _before_ evaluating any microsteps. This "pre-initial"
   * state is provided to initial actions executed in the initial state.
   */
  getPreInitialState(actorScope, initEvent, internalQueue) {
    const {
      context
    } = this.config;
    const preInitial = createMachineSnapshot({
      context: typeof context !== "function" && context ? context : {},
      _nodes: [this.root],
      children: {},
      status: "active"
    }, this);
    if (typeof context === "function") {
      const assignment = ({
        spawn,
        event,
        self: self2
      }) => context({
        spawn,
        input: event.input,
        self: self2
      });
      return resolveActionsAndContext(preInitial, initEvent, actorScope, [assign(assignment)], internalQueue, void 0);
    }
    return preInitial;
  }
  /**
   * Returns the initial `State` instance, with reference to `self` as an
   * `ActorRef`.
   */
  getInitialSnapshot(actorScope, input) {
    const initEvent = createInitEvent(input);
    const internalQueue = [];
    const preInitialState = this.getPreInitialState(actorScope, initEvent, internalQueue);
    const nextState = microstep([{
      target: [...getInitialStateNodes(this.root)],
      source: this.root,
      reenter: true,
      actions: [],
      eventType: null,
      toJSON: null
      // TODO: fix
    }], preInitialState, actorScope, initEvent, true, internalQueue);
    const {
      snapshot: macroState
    } = macrostep(nextState, initEvent, actorScope, internalQueue);
    return macroState;
  }
  start(snapshot) {
    Object.values(snapshot.children).forEach((child) => {
      if (child.getSnapshot().status === "active") {
        child.start();
      }
    });
  }
  getStateNodeById(stateId) {
    const fullPath = toStatePath(stateId);
    const relativePath = fullPath.slice(1);
    const resolvedStateId = isStateId(fullPath[0]) ? fullPath[0].slice(STATE_IDENTIFIER.length) : fullPath[0];
    const stateNode = this.idMap.get(resolvedStateId);
    if (!stateNode) {
      throw new Error(`Child state node '#${resolvedStateId}' does not exist on machine '${this.id}'`);
    }
    return getStateNodeByPath(stateNode, relativePath);
  }
  get definition() {
    return this.root.definition;
  }
  toJSON() {
    return this.definition;
  }
  getPersistedSnapshot(snapshot, options) {
    return getPersistedSnapshot(snapshot, options);
  }
  restoreSnapshot(snapshot, _actorScope) {
    const children2 = {};
    const snapshotChildren = snapshot.children;
    Object.keys(snapshotChildren).forEach((actorId) => {
      const actorData = snapshotChildren[actorId];
      const childState = actorData.snapshot;
      const src = actorData.src;
      const logic = typeof src === "string" ? resolveReferencedActor(this, src) : src;
      if (!logic) {
        return;
      }
      const actorRef = createActor(logic, {
        id: actorId,
        parent: _actorScope.self,
        syncSnapshot: actorData.syncSnapshot,
        snapshot: childState,
        src,
        systemId: actorData.systemId
      });
      children2[actorId] = actorRef;
    });
    function resolveHistoryReferencedState(root2, referenced) {
      if (referenced instanceof StateNode) {
        return referenced;
      }
      try {
        return root2.machine.getStateNodeById(referenced.id);
      } catch {
        {
          console.warn(`Could not resolve StateNode for id: ${referenced.id}`);
        }
      }
    }
    function reviveHistoryValue(root2, historyValue) {
      if (!historyValue || typeof historyValue !== "object") {
        return {};
      }
      const revived = {};
      for (const key in historyValue) {
        const arr = historyValue[key];
        for (const item of arr) {
          const resolved = resolveHistoryReferencedState(root2, item);
          if (!resolved) {
            continue;
          }
          revived[key] ??= [];
          revived[key].push(resolved);
        }
      }
      return revived;
    }
    const revivedHistoryValue = reviveHistoryValue(this.root, snapshot.historyValue);
    const restoredSnapshot = createMachineSnapshot({
      ...snapshot,
      children: children2,
      _nodes: Array.from(getAllStateNodes(getStateNodes(this.root, snapshot.value))),
      historyValue: revivedHistoryValue
    }, this);
    const seen = /* @__PURE__ */ new Set();
    function reviveContext(contextPart, children3) {
      if (seen.has(contextPart)) {
        return;
      }
      seen.add(contextPart);
      for (const key in contextPart) {
        const value = contextPart[key];
        if (value && typeof value === "object") {
          if ("xstate$$type" in value && value.xstate$$type === $$ACTOR_TYPE) {
            contextPart[key] = children3[value.id];
            continue;
          }
          reviveContext(value, children3);
        }
      }
    }
    reviveContext(restoredSnapshot.context, children2);
    return restoredSnapshot;
  }
}
function createMachine(config, implementations) {
  return new StateMachine(config, implementations);
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "editor.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const layout = {
      idle: {
        position: { x: 100, y: 50 }
      },
      loading: {
        position: { x: 400, y: 50 }
      },
      failure: {
        position: { x: 400, y: 250 },
        targetPosition: Position.Right,
        sourcePosition: Position.Left
      },
      success: {
        position: { x: 700, y: 50 }
      }
    };
    const fetchMachine = createMachine({
      id: "fetch",
      initial: "idle",
      context: {
        retries: 0
      },
      states: {
        idle: {
          on: {
            FETCH: "loading"
          }
        },
        loading: {
          on: {
            RESOLVE: "success",
            REJECT: "failure"
          }
        },
        success: {
          type: "final"
        },
        failure: {
          on: {
            RETRY: {
              target: "loading",
              actions: (context) => context.retries + 1
            }
          }
        }
      }
    });
    const fetchConfig = ref(fetchMachine.config.states);
    const __returned__ = { layout, fetchMachine, fetchConfig, get StateEditor() {
      return rf;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { title: "NodeEditor" }, {
    default: withCtx(() => [
      createVNode($setup["StateEditor"], {
        modelValue: $setup.fetchConfig,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.fetchConfig = $event),
        layout: $setup.layout
      }, null, 8, ["modelValue"])
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "node_editor/editor.story.vue";
const editor_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/dell/StoneCrop/stonecrop/examples/node_editor/editor.story.vue"]]);
export {
  editor_story as default
};
