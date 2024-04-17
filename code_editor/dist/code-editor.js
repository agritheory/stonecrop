import { defineComponent as C, ref as $, onMounted as x, openBlock as q, createElementBlock as D, createElementVNode as _ } from "vue";
function B(e, n, r) {
  return n in e ? Object.defineProperty(e, n, {
    value: r,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[n] = r, e;
}
function k(e, n) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var t = Object.getOwnPropertySymbols(e);
    n && (t = t.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, t);
  }
  return r;
}
function y(e) {
  for (var n = 1; n < arguments.length; n++) {
    var r = arguments[n] != null ? arguments[n] : {};
    n % 2 ? k(Object(r), !0).forEach(function(t) {
      B(e, t, r[t]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : k(Object(r)).forEach(function(t) {
      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
    });
  }
  return e;
}
function L(e, n) {
  if (e == null)
    return {};
  var r = {}, t = Object.keys(e), o, i;
  for (i = 0; i < t.length; i++)
    o = t[i], !(n.indexOf(o) >= 0) && (r[o] = e[o]);
  return r;
}
function H(e, n) {
  if (e == null)
    return {};
  var r = L(e, n), t, o;
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    for (o = 0; o < i.length; o++)
      t = i[o], !(n.indexOf(t) >= 0) && Object.prototype.propertyIsEnumerable.call(e, t) && (r[t] = e[t]);
  }
  return r;
}
function M(e, n) {
  return R(e) || z(e, n) || F(e, n) || W();
}
function R(e) {
  if (Array.isArray(e))
    return e;
}
function z(e, n) {
  if (!(typeof Symbol > "u" || !(Symbol.iterator in Object(e)))) {
    var r = [], t = !0, o = !1, i = void 0;
    try {
      for (var a = e[Symbol.iterator](), u; !(t = (u = a.next()).done) && (r.push(u.value), !(n && r.length === n)); t = !0)
        ;
    } catch (c) {
      o = !0, i = c;
    } finally {
      try {
        !t && a.return != null && a.return();
      } finally {
        if (o)
          throw i;
      }
    }
    return r;
  }
}
function F(e, n) {
  if (e) {
    if (typeof e == "string")
      return O(e, n);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set")
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
      return O(e, n);
  }
}
function O(e, n) {
  (n == null || n > e.length) && (n = e.length);
  for (var r = 0, t = new Array(n); r < n; r++)
    t[r] = e[r];
  return t;
}
function W() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function G(e, n, r) {
  return n in e ? Object.defineProperty(e, n, {
    value: r,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[n] = r, e;
}
function w(e, n) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var t = Object.getOwnPropertySymbols(e);
    n && (t = t.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, t);
  }
  return r;
}
function j(e) {
  for (var n = 1; n < arguments.length; n++) {
    var r = arguments[n] != null ? arguments[n] : {};
    n % 2 ? w(Object(r), !0).forEach(function(t) {
      G(e, t, r[t]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : w(Object(r)).forEach(function(t) {
      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
    });
  }
  return e;
}
function N() {
  for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
    n[r] = arguments[r];
  return function(t) {
    return n.reduceRight(function(o, i) {
      return i(o);
    }, t);
  };
}
function d(e) {
  return function n() {
    for (var r = this, t = arguments.length, o = new Array(t), i = 0; i < t; i++)
      o[i] = arguments[i];
    return o.length >= e.length ? e.apply(this, o) : function() {
      for (var a = arguments.length, u = new Array(a), c = 0; c < a; c++)
        u[c] = arguments[c];
      return n.apply(r, [].concat(o, u));
    };
  };
}
function m(e) {
  return {}.toString.call(e).includes("Object");
}
function U(e) {
  return !Object.keys(e).length;
}
function l(e) {
  return typeof e == "function";
}
function K(e, n) {
  return Object.prototype.hasOwnProperty.call(e, n);
}
function V(e, n) {
  return m(n) || f("changeType"), Object.keys(n).some(function(r) {
    return !K(e, r);
  }) && f("changeField"), n;
}
function Y(e) {
  l(e) || f("selectorType");
}
function J(e) {
  l(e) || m(e) || f("handlerType"), m(e) && Object.values(e).some(function(n) {
    return !l(n);
  }) && f("handlersType");
}
function Q(e) {
  e || f("initialIsRequired"), m(e) || f("initialType"), U(e) && f("initialContent");
}
function X(e, n) {
  throw new Error(e[n] || e.default);
}
var Z = {
  initialIsRequired: "initial state is required",
  initialType: "initial state should be an object",
  initialContent: "initial state shouldn't be an empty object",
  handlerType: "handler should be an object or a function",
  handlersType: "all handlers should be a functions",
  selectorType: "selector should be a function",
  changeType: "provided value of changes should be an object",
  changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
  default: "an unknown error accured in `state-local` package"
}, f = d(X)(Z), p = {
  changes: V,
  selector: Y,
  handler: J,
  initial: Q
};
function ee(e) {
  var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  p.initial(e), p.handler(n);
  var r = {
    current: e
  }, t = d(te)(r, n), o = d(re)(r), i = d(p.changes)(e), a = d(ne)(r);
  function u() {
    var s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(T) {
      return T;
    };
    return p.selector(s), s(r.current);
  }
  function c(s) {
    N(t, o, i, a)(s);
  }
  return [u, c];
}
function ne(e, n) {
  return l(n) ? n(e.current) : n;
}
function re(e, n) {
  return e.current = j(j({}, e.current), n), n;
}
function te(e, n, r) {
  return l(n) ? n(e.current) : Object.keys(r).forEach(function(t) {
    var o;
    return (o = n[t]) === null || o === void 0 ? void 0 : o.call(n, e.current[t]);
  }), r;
}
var oe = {
  create: ee
}, ie = {
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1/min/vs"
  }
};
function ae(e) {
  return function n() {
    for (var r = this, t = arguments.length, o = new Array(t), i = 0; i < t; i++)
      o[i] = arguments[i];
    return o.length >= e.length ? e.apply(this, o) : function() {
      for (var a = arguments.length, u = new Array(a), c = 0; c < a; c++)
        u[c] = arguments[c];
      return n.apply(r, [].concat(o, u));
    };
  };
}
function ce(e) {
  return {}.toString.call(e).includes("Object");
}
function ue(e) {
  return e || S("configIsRequired"), ce(e) || S("configType"), e.urls ? (fe(), {
    paths: {
      vs: e.urls.monacoBase
    }
  }) : e;
}
function fe() {
  console.warn(P.deprecation);
}
function de(e, n) {
  throw new Error(e[n] || e.default);
}
var P = {
  configIsRequired: "the configuration object is required",
  configType: "the configuration object should be an object",
  default: "an unknown error accured in `@monaco-editor/loader` package",
  deprecation: `Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })

    For more please check the link https://github.com/suren-atoyan/monaco-loader#config
  `
}, S = ae(de)(P), le = {
  config: ue
}, ge = function() {
  for (var n = arguments.length, r = new Array(n), t = 0; t < n; t++)
    r[t] = arguments[t];
  return function(o) {
    return r.reduceRight(function(i, a) {
      return a(i);
    }, o);
  };
};
function I(e, n) {
  return Object.keys(n).forEach(function(r) {
    n[r] instanceof Object && e[r] && Object.assign(n[r], I(e[r], n[r]));
  }), y(y({}, e), n);
}
var se = {
  type: "cancelation",
  msg: "operation is manually canceled"
};
function h(e) {
  var n = !1, r = new Promise(function(t, o) {
    e.then(function(i) {
      return n ? o(se) : t(i);
    }), e.catch(o);
  });
  return r.cancel = function() {
    return n = !0;
  }, r;
}
var pe = oe.create({
  config: ie,
  isInitialized: !1,
  resolve: null,
  reject: null,
  monaco: null
}), E = M(pe, 2), g = E[0], b = E[1];
function me(e) {
  var n = le.config(e), r = n.monaco, t = H(n, ["monaco"]);
  b(function(o) {
    return {
      config: I(o.config, t),
      monaco: r
    };
  });
}
function be() {
  var e = g(function(n) {
    var r = n.monaco, t = n.isInitialized, o = n.resolve;
    return {
      monaco: r,
      isInitialized: t,
      resolve: o
    };
  });
  if (!e.isInitialized) {
    if (b({
      isInitialized: !0
    }), e.monaco)
      return e.resolve(e.monaco), h(v);
    if (window.monaco && window.monaco.editor)
      return A(window.monaco), e.resolve(window.monaco), h(v);
    ge(he, ke)(ye);
  }
  return h(v);
}
function he(e) {
  return document.body.appendChild(e);
}
function ve(e) {
  var n = document.createElement("script");
  return e && (n.src = e), n;
}
function ke(e) {
  var n = g(function(t) {
    var o = t.config, i = t.reject;
    return {
      config: o,
      reject: i
    };
  }), r = ve("".concat(n.config.paths.vs, "/loader.js"));
  return r.onload = function() {
    return e();
  }, r.onerror = n.reject, r;
}
function ye() {
  var e = g(function(r) {
    var t = r.config, o = r.resolve, i = r.reject;
    return {
      config: t,
      resolve: o,
      reject: i
    };
  }), n = window.require;
  n.config(e.config), n(["vs/editor/editor.main"], function(r) {
    A(r), e.resolve(r);
  }, function(r) {
    e.reject(r);
  });
}
function A(e) {
  g().monaco || b({
    monaco: e
  });
}
function Oe() {
  return g(function(e) {
    var n = e.monaco;
    return n;
  });
}
var v = new Promise(function(e, n) {
  return b({
    resolve: e,
    reject: n
  });
}), we = {
  config: me,
  init: be,
  __getMonacoInstance: Oe
};
const je = {
  base: "vs",
  inherit: !0,
  colors: {
    "editor.foreground": "#24292e",
    "editor.background": "#ffffff",
    "editor.selectionBackground": "#c8c8fa",
    "editor.inactiveSelectionBackground": "#fafbfc",
    "editor.lineHighlightBackground": "#fafbfc",
    "editorCursor.foreground": "#24292e",
    "editorWhitespace.foreground": "#959da5",
    "editorIndentGuide.background": "#959da5",
    "editorIndentGuide.activeBackground": "#24292e",
    "editor.selectionHighlightBorder": "#fafbfc"
  },
  rules: [
    {
      background: "ffffff",
      token: ""
    },
    {
      foreground: "6a737d",
      token: "comment"
    },
    {
      foreground: "6a737d",
      token: "punctuation.definition.comment"
    },
    {
      foreground: "6a737d",
      token: "string.comment"
    },
    {
      foreground: "005cc5",
      token: "constant"
    },
    {
      foreground: "005cc5",
      token: "entity.name.constant"
    },
    {
      foreground: "005cc5",
      token: "variable.other.constant"
    },
    {
      foreground: "005cc5",
      token: "variable.language"
    },
    {
      foreground: "6f42c1",
      token: "entity"
    },
    {
      foreground: "6f42c1",
      token: "entity.name"
    },
    {
      foreground: "24292e",
      token: "variable.parameter.function"
    },
    {
      foreground: "22863a",
      token: "entity.name.tag"
    },
    {
      foreground: "d73a49",
      token: "keyword"
    },
    {
      foreground: "d73a49",
      token: "storage"
    },
    {
      foreground: "d73a49",
      token: "storage.type"
    },
    {
      foreground: "24292e",
      token: "storage.modifier.package"
    },
    {
      foreground: "24292e",
      token: "storage.modifier.import"
    },
    {
      foreground: "24292e",
      token: "storage.type.java"
    },
    {
      foreground: "032f62",
      token: "string"
    },
    {
      foreground: "032f62",
      token: "punctuation.definition.string"
    },
    {
      foreground: "032f62",
      token: "string punctuation.section.embedded source"
    },
    {
      foreground: "005cc5",
      token: "support"
    },
    {
      foreground: "005cc5",
      token: "meta.property-name"
    },
    {
      foreground: "e36209",
      token: "variable"
    },
    {
      foreground: "24292e",
      token: "variable.other"
    },
    {
      foreground: "b31d28",
      fontStyle: "bold italic underline",
      token: "invalid.broken"
    },
    {
      foreground: "b31d28",
      fontStyle: "bold italic underline",
      token: "invalid.deprecated"
    },
    {
      foreground: "fafbfc",
      background: "b31d28",
      fontStyle: "italic underline",
      token: "invalid.illegal"
    },
    {
      foreground: "fafbfc",
      background: "d73a49",
      fontStyle: "italic underline",
      token: "carriage-return"
    },
    {
      foreground: "b31d28",
      fontStyle: "bold italic underline",
      token: "invalid.unimplemented"
    },
    {
      foreground: "b31d28",
      token: "message.error"
    },
    {
      foreground: "24292e",
      token: "string source"
    },
    {
      foreground: "005cc5",
      token: "string variable"
    },
    {
      foreground: "032f62",
      token: "source.regexp"
    },
    {
      foreground: "032f62",
      token: "string.regexp"
    },
    {
      foreground: "032f62",
      token: "string.regexp.character-class"
    },
    {
      foreground: "032f62",
      token: "string.regexp constant.character.escape"
    },
    {
      foreground: "032f62",
      token: "string.regexp source.ruby.embedded"
    },
    {
      foreground: "032f62",
      token: "string.regexp string.regexp.arbitrary-repitition"
    },
    {
      foreground: "22863a",
      fontStyle: "bold",
      token: "string.regexp constant.character.escape"
    },
    {
      foreground: "005cc5",
      token: "support.constant"
    },
    {
      foreground: "005cc5",
      token: "support.variable"
    },
    {
      foreground: "005cc5",
      token: "meta.module-reference"
    },
    {
      foreground: "735c0f",
      token: "markup.list"
    },
    {
      foreground: "005cc5",
      fontStyle: "bold",
      token: "markup.heading"
    },
    {
      foreground: "005cc5",
      fontStyle: "bold",
      token: "markup.heading entity.name"
    },
    {
      foreground: "22863a",
      token: "markup.quote"
    },
    {
      foreground: "24292e",
      fontStyle: "italic",
      token: "markup.italic"
    },
    {
      foreground: "24292e",
      fontStyle: "bold",
      token: "markup.bold"
    },
    {
      foreground: "005cc5",
      token: "markup.raw"
    },
    {
      foreground: "b31d28",
      background: "ffeef0",
      token: "markup.deleted"
    },
    {
      foreground: "b31d28",
      background: "ffeef0",
      token: "meta.diff.header.from-file"
    },
    {
      foreground: "b31d28",
      background: "ffeef0",
      token: "punctuation.definition.deleted"
    },
    {
      foreground: "22863a",
      background: "f0fff4",
      token: "markup.inserted"
    },
    {
      foreground: "22863a",
      background: "f0fff4",
      token: "meta.diff.header.to-file"
    },
    {
      foreground: "22863a",
      background: "f0fff4",
      token: "punctuation.definition.inserted"
    },
    {
      foreground: "e36209",
      background: "ffebda",
      token: "markup.changed"
    },
    {
      foreground: "e36209",
      background: "ffebda",
      token: "punctuation.definition.changed"
    },
    {
      foreground: "f6f8fa",
      background: "005cc5",
      token: "markup.ignored"
    },
    {
      foreground: "f6f8fa",
      background: "005cc5",
      token: "markup.untracked"
    },
    {
      foreground: "6f42c1",
      fontStyle: "bold",
      token: "meta.diff.range"
    },
    {
      foreground: "005cc5",
      token: "meta.diff.header"
    },
    {
      foreground: "005cc5",
      fontStyle: "bold",
      token: "meta.separator"
    },
    {
      foreground: "005cc5",
      token: "meta.output"
    },
    {
      foreground: "586069",
      token: "brackethighlighter.tag"
    },
    {
      foreground: "586069",
      token: "brackethighlighter.curly"
    },
    {
      foreground: "586069",
      token: "brackethighlighter.round"
    },
    {
      foreground: "586069",
      token: "brackethighlighter.square"
    },
    {
      foreground: "586069",
      token: "brackethighlighter.angle"
    },
    {
      foreground: "586069",
      token: "brackethighlighter.quote"
    },
    {
      foreground: "b31d28",
      token: "brackethighlighter.unmatched"
    },
    {
      foreground: "b31d28",
      token: "sublimelinter.mark.error"
    },
    {
      foreground: "e36209",
      token: "sublimelinter.mark.warning"
    },
    {
      foreground: "959da5",
      token: "sublimelinter.gutter-mark"
    },
    {
      foreground: "032f62",
      fontStyle: "underline",
      token: "constant.other.reference.link"
    },
    {
      foreground: "032f62",
      fontStyle: "underline",
      token: "string.other.link"
    }
  ]
}, Se = {
  ref: "editorContainer",
  id: "editor-container"
}, Pe = /* @__PURE__ */ C({
  __name: "ACodeEditor",
  props: {
    options: {}
  },
  setup(e) {
    const n = e, r = $(null), t = {
      ...n.options,
      automaticLayout: !0,
      colorDecorators: !0,
      lineHeight: 24,
      scrollBeyondLastLine: !1
    };
    return x(async () => {
      const i = (await we.init()).editor;
      i.defineTheme("agritheory", je), i.setTheme("agritheory"), i.create(r.value, t);
    }), (o, i) => (q(), D("div", Se, [
      _("div", {
        ref_key: "aCodeEditor",
        ref: r,
        id: "editor-area"
      }, null, 512)
    ], 512));
  }
}), Ie = (e, n) => {
  const r = e.__vccOpts || e;
  for (const [t, o] of n)
    r[t] = o;
  return r;
}, Ee = /* @__PURE__ */ Ie(Pe, [["__scopeId", "data-v-28cc715a"]]);
function Te(e) {
  e.component("ACodeEditor", Ee);
}
export {
  Ee as ACodeEditor,
  Te as install
};
//# sourceMappingURL=code-editor.js.map
