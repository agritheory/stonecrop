import { unref as Q, getCurrentScope as U, onScopeDispose as K, ref as B, watch as D, onMounted as W, onBeforeUnmount as V } from "vue";
var v;
const M = typeof window < "u", F = (e) => typeof e == "string", j = () => {
};
M && ((v = window == null ? void 0 : window.navigator) != null && v.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function H(e) {
  return typeof e == "function" ? e() : Q(e);
}
function q(e) {
  return e;
}
function G(e) {
  return U() ? (K(e), !0) : !1;
}
function y(e) {
  var t;
  const r = H(e);
  return (t = r == null ? void 0 : r.$el) != null ? t : r;
}
const N = M ? window : void 0;
function z(...e) {
  let t, r, n, o;
  if (F(e[0]) || Array.isArray(e[0]) ? ([r, n, o] = e, t = N) : [t, r, n, o] = e, !t)
    return j;
  Array.isArray(r) || (r = [r]), Array.isArray(n) || (n = [n]);
  const l = [], s = () => {
    l.forEach((c) => c()), l.length = 0;
  }, a = (c, g, p, i) => (c.addEventListener(g, p, i), () => c.removeEventListener(g, p, i)), C = D(() => [y(t), H(o)], ([c, g]) => {
    s(), c && l.push(...r.flatMap((p) => n.map((i) => a(c, p, i, g))));
  }, { immediate: !0, flush: "post" }), d = () => {
    C(), s();
  };
  return G(d), d;
}
const O = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, T = "__vueuse_ssr_handlers__";
O[T] = O[T] || {};
function J(e, { window: t = N, scrollTarget: r } = {}) {
  const n = B(!1), o = () => {
    if (!t)
      return;
    const l = t.document, s = y(e);
    if (!s)
      n.value = !1;
    else {
      const a = s.getBoundingClientRect();
      n.value = a.top <= (t.innerHeight || l.documentElement.clientHeight) && a.left <= (t.innerWidth || l.documentElement.clientWidth) && a.bottom >= 0 && a.right >= 0;
    }
  };
  return D(() => y(e), () => o(), { immediate: !0, flush: "post" }), t && z(r || t, "scroll", o, {
    capture: !1,
    passive: !0
  }), n;
}
var P;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(P || (P = {}));
var X = Object.defineProperty, I = Object.getOwnPropertySymbols, Y = Object.prototype.hasOwnProperty, Z = Object.prototype.propertyIsEnumerable, _ = (e, t, r) => t in e ? X(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, ee = (e, t) => {
  for (var r in t || (t = {}))
    Y.call(t, r) && _(e, r, t[r]);
  if (I)
    for (var r of I(t))
      Z.call(t, r) && _(e, r, t[r]);
  return e;
};
const te = {
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
ee({
  linear: q
}, te);
const f = (e) => {
  let t = J(e).value;
  return t = t && e.offsetHeight > 0, t;
}, u = (e) => e.tabIndex >= 0, A = (e) => {
  const t = e.target;
  return E(t);
}, E = (e) => {
  var r;
  let t;
  if (e instanceof HTMLTableCellElement) {
    const n = (r = e.parentElement) == null ? void 0 : r.previousElementSibling;
    if (n) {
      const l = Array.from(n.children)[e.cellIndex];
      l && (t = l);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const n = e.previousElementSibling;
    n && (t = n);
  }
  return t && (!u(t) || !f(t)) ? E(t) : t;
}, ne = (e) => {
  var n;
  const t = e.target;
  let r;
  if (t instanceof HTMLTableCellElement) {
    const o = (n = t.parentElement) == null ? void 0 : n.parentElement;
    if (o) {
      const s = o.firstElementChild.children[t.cellIndex];
      s && (r = s);
    }
  } else if (t instanceof HTMLTableRowElement) {
    const o = t.parentElement;
    if (o) {
      const l = o.firstElementChild;
      l && (r = l);
    }
  }
  return r && (!u(r) || !f(r)) ? w(r) : r;
}, x = (e) => {
  const t = e.target;
  return w(t);
}, w = (e) => {
  var r;
  let t;
  if (e instanceof HTMLTableCellElement) {
    const n = (r = e.parentElement) == null ? void 0 : r.nextElementSibling;
    if (n) {
      const l = Array.from(n.children)[e.cellIndex];
      l && (t = l);
    }
  } else if (e instanceof HTMLTableRowElement) {
    const n = e.nextElementSibling;
    n && (t = n);
  }
  return t && (!u(t) || !f(t)) ? w(t) : t;
}, re = (e) => {
  var n;
  const t = e.target;
  let r;
  if (t instanceof HTMLTableCellElement) {
    const o = (n = t.parentElement) == null ? void 0 : n.parentElement;
    if (o) {
      const s = o.lastElementChild.children[t.cellIndex];
      s && (r = s);
    }
  } else if (t instanceof HTMLTableRowElement) {
    const o = t.parentElement;
    if (o) {
      const l = o.lastElementChild;
      l && (r = l);
    }
  }
  return r && (!u(r) || !f(r)) ? E(r) : r;
}, k = (e) => {
  const t = e.target;
  return h(t);
}, h = (e) => {
  var r;
  let t;
  if (e.previousElementSibling)
    t = e.previousElementSibling;
  else {
    const n = (r = e.parentElement) == null ? void 0 : r.previousElementSibling;
    t = n == null ? void 0 : n.lastElementChild;
  }
  return t && (!u(t) || !f(t)) ? h(t) : t;
}, S = (e) => {
  const t = e.target;
  return b(t);
}, b = (e) => {
  var r;
  let t;
  if (e.nextElementSibling)
    t = e.nextElementSibling;
  else {
    const n = (r = e.parentElement) == null ? void 0 : r.nextElementSibling;
    t = n == null ? void 0 : n.firstElementChild;
  }
  return t && (!u(t) || !f(t)) ? b(t) : t;
}, L = (e) => {
  const n = e.target.parentElement.firstElementChild;
  return n && (!u(n) || !f(n)) ? b(n) : n;
}, R = (e) => {
  const n = e.target.parentElement.lastElementChild;
  return n && (!u(n) || !f(n)) ? h(n) : n;
}, m = ["alt", "control", "shift", "meta"], oe = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
}, le = {
  "keydown.up": (e) => {
    const t = A(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.down": (e) => {
    const t = x(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.left": (e) => {
    const t = k(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.right": (e) => {
    const t = S(e);
    e.preventDefault(), e.stopPropagation(), t && t.focus();
  },
  "keydown.control.up": (e) => {
    const t = ne(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.down": (e) => {
    const t = re(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.left": (e) => {
    const t = L(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.control.right": (e) => {
    const t = R(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.end": (e) => {
    const t = R(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const r = x(e);
      r && r.focus();
    }
  },
  "keydown.shift.enter": (e) => {
    if (e.target instanceof HTMLTableCellElement) {
      e.preventDefault(), e.stopPropagation();
      const r = A(e);
      r && r.focus();
    }
  },
  "keydown.home": (e) => {
    const t = L(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.tab": (e) => {
    const t = S(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  },
  "keydown.shift.tab": (e) => {
    const t = k(e);
    t && (e.preventDefault(), e.stopPropagation(), t.focus());
  }
};
function ie(e) {
  const t = (n) => {
    let o = null;
    n.parent && (typeof n.parent == "string" ? o = document.querySelector(n.parent) : n.parent instanceof Element ? o = n.parent : o = n.parent.value);
    let l = [];
    if (n.selectors)
      if (typeof n.selectors == "string")
        l = o ? Array.from(o.querySelectorAll(n.selectors)) : Array.from(document.querySelectorAll(n.selectors));
      else if (n.selectors instanceof Element)
        l.push(n.selectors);
      else if (Array.isArray(n.selectors.value))
        for (const s of n.selectors.value)
          s instanceof Element ? l.push(s) : l.push(s.$el);
      else
        l.push(n.selectors.value);
    else
      l = Array.from(o.children).filter((a) => u(a) && f(a));
    return l;
  }, r = (n) => (o) => {
    const l = oe[o.key] || o.key.toLowerCase();
    if (m.includes(l))
      return;
    const s = n.handlers || le;
    for (const a of Object.keys(s)) {
      const [C, ...d] = a.split(".");
      if (C === "keydown" && d.includes(l)) {
        const c = s[a], g = d.filter((i) => m.includes(i)), p = m.some((i) => {
          const $ = i.charAt(0).toUpperCase() + i.slice(1);
          return o.getModifierState($);
        });
        if (g.length > 0) {
          if (p) {
            for (const i of m)
              if (d.includes(i)) {
                const $ = i.charAt(0).toUpperCase() + i.slice(1);
                o.getModifierState($) && c(o);
              }
          }
        } else
          p || c(o);
      }
    }
  };
  W(() => {
    for (const n of e) {
      const o = t(n);
      for (const l of o)
        l.addEventListener("keydown", r(n));
    }
  }), V(() => {
    for (const n of e) {
      const o = t(n);
      for (const l of o)
        l.removeEventListener("keydown", r(n));
    }
  });
}
function ae(e) {
}
export {
  le as defaultKeypressHandlers,
  ae as install,
  ie as useKeyboardNav
};
//# sourceMappingURL=utilities.js.map
