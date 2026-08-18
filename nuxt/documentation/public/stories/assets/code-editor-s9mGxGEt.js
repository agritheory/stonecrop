import { av as defineComponent, aT as useTemplateRef, aL as onMounted, aq as openBlock, aU as createElementBlock } from "./vendor-BFYlYCwc.js";
function y(e, n) {
  (n == null || n > e.length) && (n = e.length);
  for (var r = 0, t = Array(n); r < n; r++) t[r] = e[r];
  return t;
}
function B(e) {
  if (Array.isArray(e)) return e;
}
function L(e, n, r) {
  return (n = W(n)) in e ? Object.defineProperty(e, n, {
    value: r,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[n] = r, e;
}
function R(e, n) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var t, o, i, c, u = [], a = true, d = false;
    try {
      if (i = (r = r.call(e)).next, n !== 0) for (; !(a = (t = i.call(r)).done) && (u.push(t.value), u.length !== n); a = true) ;
    } catch (h) {
      d = true, o = h;
    } finally {
      try {
        if (!a && r.return != null && (c = r.return(), Object(c) !== c)) return;
      } finally {
        if (d) throw o;
      }
    }
    return u;
  }
}
function H() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
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
    n % 2 ? w(Object(r), true).forEach(function(t) {
      L(e, t, r[t]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : w(Object(r)).forEach(function(t) {
      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
    });
  }
  return e;
}
function M(e, n) {
  if (e == null) return {};
  var r, t, o = z(e, n);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    for (t = 0; t < i.length; t++) r = i[t], n.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function z(e, n) {
  if (e == null) return {};
  var r = {};
  for (var t in e) if ({}.hasOwnProperty.call(e, t)) {
    if (n.indexOf(t) !== -1) continue;
    r[t] = e[t];
  }
  return r;
}
function _(e, n) {
  return B(e) || R(e, n) || G(e, n) || H();
}
function F(e, n) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var t = r.call(e, n);
    if (typeof t != "object") return t;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(e);
}
function W(e) {
  var n = F(e, "string");
  return typeof n == "symbol" ? n : n + "";
}
function G(e, n) {
  if (e) {
    if (typeof e == "string") return y(e, n);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? y(e, n) : void 0;
  }
}
function K(e, n, r) {
  return n in e ? Object.defineProperty(e, n, {
    value: r,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[n] = r, e;
}
function O(e, n) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var t = Object.getOwnPropertySymbols(e);
    n && (t = t.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, t);
  }
  return r;
}
function S(e) {
  for (var n = 1; n < arguments.length; n++) {
    var r = arguments[n] != null ? arguments[n] : {};
    n % 2 ? O(Object(r), true).forEach(function(t) {
      K(e, t, r[t]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : O(Object(r)).forEach(function(t) {
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
function l(e) {
  return function n() {
    for (var r = this, t = arguments.length, o = new Array(t), i = 0; i < t; i++)
      o[i] = arguments[i];
    return o.length >= e.length ? e.apply(this, o) : function() {
      for (var c = arguments.length, u = new Array(c), a = 0; a < c; a++)
        u[a] = arguments[a];
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
function s(e) {
  return typeof e == "function";
}
function Y(e, n) {
  return Object.prototype.hasOwnProperty.call(e, n);
}
function J(e, n) {
  return m(n) || f("changeType"), Object.keys(n).some(function(r) {
    return !Y(e, r);
  }) && f("changeField"), n;
}
function Q(e) {
  s(e) || f("selectorType");
}
function V(e) {
  s(e) || m(e) || f("handlerType"), m(e) && Object.values(e).some(function(n) {
    return !s(n);
  }) && f("handlersType");
}
function X(e) {
  e || f("initialIsRequired"), m(e) || f("initialType"), U(e) && f("initialContent");
}
function Z(e, n) {
  throw new Error(e[n] || e.default);
}
var ee = {
  initialIsRequired: "initial state is required",
  initialType: "initial state should be an object",
  initialContent: "initial state shouldn't be an empty object",
  handlerType: "handler should be an object or a function",
  handlersType: "all handlers should be a functions",
  selectorType: "selector should be a function",
  changeType: "provided value of changes should be an object",
  changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
  default: "an unknown error accured in `state-local` package"
}, f = l(Z)(ee), p = {
  changes: J,
  selector: Q,
  handler: V,
  initial: X
};
function ne(e) {
  var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  p.initial(e), p.handler(n);
  var r = {
    current: e
  }, t = l(oe)(r, n), o = l(te)(r), i = l(p.changes)(e), c = l(re)(r);
  function u() {
    var d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(h) {
      return h;
    };
    return p.selector(d), d(r.current);
  }
  function a(d) {
    N(t, o, i, c)(d);
  }
  return [u, a];
}
function re(e, n) {
  return s(n) ? n(e.current) : n;
}
function te(e, n) {
  return e.current = S(S({}, e.current), n), n;
}
function oe(e, n, r) {
  return s(n) ? n(e.current) : Object.keys(r).forEach(function(t) {
    var o;
    return (o = n[t]) === null || o === void 0 ? void 0 : o.call(n, e.current[t]);
  }), r;
}
var ie = {
  create: ne
}, ae = {
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs"
  }
};
function ce(e) {
  return function n() {
    for (var r = this, t = arguments.length, o = new Array(t), i = 0; i < t; i++)
      o[i] = arguments[i];
    return o.length >= e.length ? e.apply(this, o) : function() {
      for (var c = arguments.length, u = new Array(c), a = 0; a < c; a++)
        u[a] = arguments[a];
      return n.apply(r, [].concat(o, u));
    };
  };
}
function ue(e) {
  return {}.toString.call(e).includes("Object");
}
function fe(e) {
  return e || P("configIsRequired"), ue(e) || P("configType"), e.urls ? (de(), {
    paths: {
      vs: e.urls.monacoBase
    }
  }) : e;
}
function de() {
  console.warn(I.deprecation);
}
function le(e, n) {
  throw new Error(e[n] || e.default);
}
var I = {
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
}, P = ce(le)(I), se = {
  config: fe
}, ge = function() {
  for (var n = arguments.length, r = new Array(n), t = 0; t < n; t++)
    r[t] = arguments[t];
  return function(o) {
    return r.reduceRight(function(i, c) {
      return c(i);
    }, o);
  };
};
function E(e, n) {
  return Object.keys(n).forEach(function(r) {
    n[r] instanceof Object && e[r] && Object.assign(n[r], E(e[r], n[r]));
  }), j(j({}, e), n);
}
var pe = {
  type: "cancelation",
  msg: "operation is manually canceled"
};
function v(e) {
  var n = false, r = new Promise(function(t, o) {
    e.then(function(i) {
      return n ? o(pe) : t(i);
    }), e.catch(o);
  });
  return r.cancel = function() {
    return n = true;
  }, r;
}
var me = ["monaco"], be = ie.create({
  config: ae,
  isInitialized: false,
  resolve: null,
  reject: null,
  monaco: null
}), T = _(be, 2), g = T[0], b = T[1];
function he(e) {
  var n = se.config(e), r = n.monaco, t = M(n, me);
  b(function(o) {
    return {
      config: E(o.config, t),
      monaco: r
    };
  });
}
function ve() {
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
      isInitialized: true
    }), e.monaco)
      return e.resolve(e.monaco), v(k);
    if (window.monaco && window.monaco.editor)
      return A(window.monaco), e.resolve(window.monaco), v(k);
    ge(ke, we)(je);
  }
  return v(k);
}
function ke(e) {
  return document.body.appendChild(e);
}
function ye(e) {
  var n = document.createElement("script");
  return e && (n.src = e), n;
}
function we(e) {
  var n = g(function(t) {
    var o = t.config, i = t.reject;
    return {
      config: o,
      reject: i
    };
  }), r = ye("".concat(n.config.paths.vs, "/loader.js"));
  return r.onload = function() {
    return e();
  }, r.onerror = n.reject, r;
}
function je() {
  var e = g(function(r) {
    var t = r.config, o = r.resolve, i = r.reject;
    return {
      config: t,
      resolve: o,
      reject: i
    };
  }), n = window.require;
  n.config(e.config), n(["vs/editor/editor.main"], function(r) {
    var t = r.m || r;
    A(t), e.resolve(t);
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
var k = new Promise(function(e, n) {
  return b({
    resolve: e,
    reject: n
  });
}), Se = {
  config: he,
  init: ve,
  __getMonacoInstance: Oe
};
const Pe = {
  base: "vs",
  inherit: true,
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
}, Ie = {
  id: "editor-container",
  ref: "aCodeEditor"
}, Ee = /* @__PURE__ */ defineComponent({
  __name: "ACodeEditor",
  props: {
    options: { default: () => ({}) }
  },
  setup(e) {
    const n = useTemplateRef("aCodeEditor"), r = {
      ...e.options,
      automaticLayout: true,
      colorDecorators: true,
      lineHeight: 24,
      scrollBeyondLastLine: false
    };
    return onMounted(async () => {
      const o = (await Se.init()).editor;
      o.defineTheme("agritheory", Pe), o.setTheme("agritheory"), n.value && o.create(n.value, r);
    }), (t, o) => (openBlock(), createElementBlock("div", Ie, null, 512));
  }
});
export {
  Ee as E
};
