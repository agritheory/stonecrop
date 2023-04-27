function Pe(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const i in r)
        if (i !== "default" && !(i in e)) {
          const s = Object.getOwnPropertyDescriptor(r, i);
          s && Object.defineProperty(e, i, s.get ? s : {
            enumerable: !0,
            get: () => r[i]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
const pe = {
  parse: JSON.parse,
  stringify: JSON.stringify
};
var Be = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function K(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ue = function(t) {
  var n = t.uri, r = t.name, i = t.type;
  this.uri = n, this.name = r, this.type = i;
}, Me = Ue, Ae = function(t) {
  return typeof File < "u" && t instanceof File || typeof Blob < "u" && t instanceof Blob || t instanceof Me;
};
const Ve = /* @__PURE__ */ K(Ae);
var je = Ae, qe = function e(t, n, r) {
  n === void 0 && (n = ""), r === void 0 && (r = je);
  var i, s = /* @__PURE__ */ new Map();
  function c(f, y) {
    var m = s.get(y);
    m ? m.push.apply(m, f) : s.set(y, f);
  }
  if (r(t))
    i = null, c([n], t);
  else {
    var u = n ? n + "." : "";
    if (typeof FileList < "u" && t instanceof FileList)
      i = Array.prototype.map.call(t, function(f, y) {
        return c(["" + u + y], f), null;
      });
    else if (Array.isArray(t))
      i = t.map(function(f, y) {
        var m = e(f, "" + u + y, r);
        return m.files.forEach(c), m.clone;
      });
    else if (t && t.constructor === Object) {
      i = {};
      for (var h in t) {
        var d = e(t[h], "" + u + h, r);
        d.files.forEach(c), i[h] = d.clone;
      }
    } else
      i = t;
  }
  return {
    clone: i,
    files: s
  };
};
const $e = /* @__PURE__ */ K(qe);
var Ge = typeof self == "object" ? self.FormData : window.FormData;
const He = /* @__PURE__ */ K(Ge), Ye = (e) => Ve(e) || e !== null && typeof e == "object" && typeof e.pipe == "function", Je = (e, t, n, r = pe) => {
  const { clone: i, files: s } = $e({ query: e, variables: t, operationName: n }, "", Ye);
  if (s.size === 0) {
    if (!Array.isArray(e))
      return r.stringify(i);
    if (typeof t < "u" && !Array.isArray(t))
      throw new Error("Cannot create request body with given variable type, array expected");
    const f = e.reduce((y, m, x) => (y.push({ query: m, variables: t ? t[x] : void 0 }), y), []);
    return r.stringify(f);
  }
  const c = typeof FormData > "u" ? He : FormData, u = new c();
  u.append("operations", r.stringify(i));
  const h = {};
  let d = 0;
  return s.forEach((f) => {
    h[++d] = f;
  }), u.append("map", r.stringify(h)), d = 0, s.forEach((f, y) => {
    u.append(`${++d}`, y);
  }), u;
}, ze = (e) => e.toUpperCase(), Qe = (e) => {
  const t = {};
  return e.forEach((n, r) => {
    t[r] = n;
  }), t;
}, Xe = (e, t, n) => e.document ? e : {
  document: e,
  variables: t,
  requestHeaders: n,
  signal: void 0
}, We = (e, t, n) => e.query ? e : {
  query: e,
  variables: t,
  requestHeaders: n,
  signal: void 0
}, Ze = (e, t) => e.documents ? e : {
  documents: e,
  requestHeaders: t,
  signal: void 0
}, Ke = (e, t, ...n) => {
  const [r, i] = n;
  return e.document ? e : {
    url: e,
    document: t,
    variables: r,
    requestHeaders: i,
    signal: void 0
  };
};
function Q(e, t) {
  if (!!!e)
    throw new Error(t);
}
function et(e) {
  return typeof e == "object" && e !== null;
}
function tt(e, t) {
  if (!!!e)
    throw new Error(
      t ?? "Unexpected invariant triggered."
    );
}
const nt = /\r\n|[\n\r]/g;
function ce(e, t) {
  let n = 0, r = 1;
  for (const i of e.body.matchAll(nt)) {
    if (typeof i.index == "number" || tt(!1), i.index >= t)
      break;
    n = i.index + i[0].length, r += 1;
  }
  return {
    line: r,
    column: t + 1 - n
  };
}
function it(e) {
  return Ie(
    e.source,
    ce(e.source, e.start)
  );
}
function Ie(e, t) {
  const n = e.locationOffset.column - 1, r = "".padStart(n) + e.body, i = t.line - 1, s = e.locationOffset.line - 1, c = t.line + s, u = t.line === 1 ? n : 0, h = t.column + u, d = `${e.name}:${c}:${h}
`, f = r.split(/\r\n|[\n\r]/g), y = f[i];
  if (y.length > 120) {
    const m = Math.floor(h / 80), x = h % 80, T = [];
    for (let I = 0; I < y.length; I += 80)
      T.push(y.slice(I, I + 80));
    return d + ye([
      [`${c} |`, T[0]],
      ...T.slice(1, m + 1).map((I) => ["|", I]),
      ["|", "^".padStart(x)],
      ["|", T[m + 1]]
    ]);
  }
  return d + ye([
    // Lines specified like this: ["prefix", "string"],
    [`${c - 1} |`, f[i - 1]],
    [`${c} |`, y],
    ["|", "^".padStart(h)],
    [`${c + 1} |`, f[i + 1]]
  ]);
}
function ye(e) {
  const t = e.filter(([r, i]) => i !== void 0), n = Math.max(...t.map(([r]) => r.length));
  return t.map(([r, i]) => r.padStart(n) + (i ? " " + i : "")).join(`
`);
}
function rt(e) {
  const t = e[0];
  return t == null || "kind" in t || "length" in t ? {
    nodes: t,
    source: e[1],
    positions: e[2],
    path: e[3],
    originalError: e[4],
    extensions: e[5]
  } : t;
}
class fe extends Error {
  /**
   * An array of `{ line, column }` locations within the source GraphQL document
   * which correspond to this error.
   *
   * Errors during validation often contain multiple locations, for example to
   * point out two things with the same name. Errors during execution include a
   * single location, the field which produced the error.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  /**
   * An array describing the JSON-path into the execution response which
   * corresponds to this error. Only included for errors during execution.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  /**
   * An array of GraphQL AST Nodes corresponding to this error.
   */
  /**
   * The source GraphQL document for the first location of this error.
   *
   * Note that if this Error represents more than one node, the source may not
   * represent nodes after the first node.
   */
  /**
   * An array of character offsets within the source GraphQL document
   * which correspond to this error.
   */
  /**
   * The original error thrown from a field resolver during execution.
   */
  /**
   * Extension fields to add to the formatted error.
   */
  /**
   * @deprecated Please use the `GraphQLErrorOptions` constructor overload instead.
   */
  constructor(t, ...n) {
    var r, i, s;
    const { nodes: c, source: u, positions: h, path: d, originalError: f, extensions: y } = rt(n);
    super(t), this.name = "GraphQLError", this.path = d ?? void 0, this.originalError = f ?? void 0, this.nodes = Ee(
      Array.isArray(c) ? c : c ? [c] : void 0
    );
    const m = Ee(
      (r = this.nodes) === null || r === void 0 ? void 0 : r.map((T) => T.loc).filter((T) => T != null)
    );
    this.source = u ?? (m == null || (i = m[0]) === null || i === void 0 ? void 0 : i.source), this.positions = h ?? (m == null ? void 0 : m.map((T) => T.start)), this.locations = h && u ? h.map((T) => ce(u, T)) : m == null ? void 0 : m.map((T) => ce(T.source, T.start));
    const x = et(
      f == null ? void 0 : f.extensions
    ) ? f == null ? void 0 : f.extensions : void 0;
    this.extensions = (s = y ?? x) !== null && s !== void 0 ? s : /* @__PURE__ */ Object.create(null), Object.defineProperties(this, {
      message: {
        writable: !0,
        enumerable: !0
      },
      name: {
        enumerable: !1
      },
      nodes: {
        enumerable: !1
      },
      source: {
        enumerable: !1
      },
      positions: {
        enumerable: !1
      },
      originalError: {
        enumerable: !1
      }
    }), f != null && f.stack ? Object.defineProperty(this, "stack", {
      value: f.stack,
      writable: !0,
      configurable: !0
    }) : Error.captureStackTrace ? Error.captureStackTrace(this, fe) : Object.defineProperty(this, "stack", {
      value: Error().stack,
      writable: !0,
      configurable: !0
    });
  }
  get [Symbol.toStringTag]() {
    return "GraphQLError";
  }
  toString() {
    let t = this.message;
    if (this.nodes)
      for (const n of this.nodes)
        n.loc && (t += `

` + it(n.loc));
    else if (this.source && this.locations)
      for (const n of this.locations)
        t += `

` + Ie(this.source, n);
    return t;
  }
  toJSON() {
    const t = {
      message: this.message
    };
    return this.locations != null && (t.locations = this.locations), this.path != null && (t.path = this.path), this.extensions != null && Object.keys(this.extensions).length > 0 && (t.extensions = this.extensions), t;
  }
}
function Ee(e) {
  return e === void 0 || e.length === 0 ? void 0 : e;
}
function O(e, t, n) {
  return new fe(`Syntax Error: ${n}`, {
    source: e,
    positions: [t]
  });
}
class st {
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The Token at which this Node begins.
   */
  /**
   * The Token at which this Node ends.
   */
  /**
   * The Source document the AST represents.
   */
  constructor(t, n, r) {
    this.start = t.start, this.end = n.end, this.startToken = t, this.endToken = n, this.source = r;
  }
  get [Symbol.toStringTag]() {
    return "Location";
  }
  toJSON() {
    return {
      start: this.start,
      end: this.end
    };
  }
}
class ge {
  /**
   * The kind of Token.
   */
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The 1-indexed line number on which this Token appears.
   */
  /**
   * The 1-indexed column number at which this Token begins.
   */
  /**
   * For non-punctuation tokens, represents the interpreted value of the token.
   *
   * Note: is undefined for punctuation tokens, but typed as string for
   * convenience in the parser.
   */
  /**
   * Tokens exist as nodes in a double-linked-list amongst all tokens
   * including ignored tokens. <SOF> is always the first node and <EOF>
   * the last.
   */
  constructor(t, n, r, i, s, c) {
    this.kind = t, this.start = n, this.end = r, this.line = i, this.column = s, this.value = c, this.prev = null, this.next = null;
  }
  get [Symbol.toStringTag]() {
    return "Token";
  }
  toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  }
}
const Oe = {
  Name: [],
  Document: ["definitions"],
  OperationDefinition: [
    "name",
    "variableDefinitions",
    "directives",
    "selectionSet"
  ],
  VariableDefinition: ["variable", "type", "defaultValue", "directives"],
  Variable: ["name"],
  SelectionSet: ["selections"],
  Field: ["alias", "name", "arguments", "directives", "selectionSet"],
  Argument: ["name", "value"],
  FragmentSpread: ["name", "directives"],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: [
    "name",
    // Note: fragment variable definitions are deprecated and will removed in v17.0.0
    "variableDefinitions",
    "typeCondition",
    "directives",
    "selectionSet"
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ["values"],
  ObjectValue: ["fields"],
  ObjectField: ["name", "value"],
  Directive: ["name", "arguments"],
  NamedType: ["name"],
  ListType: ["type"],
  NonNullType: ["type"],
  SchemaDefinition: ["description", "directives", "operationTypes"],
  OperationTypeDefinition: ["type"],
  ScalarTypeDefinition: ["description", "name", "directives"],
  ObjectTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  FieldDefinition: ["description", "name", "arguments", "type", "directives"],
  InputValueDefinition: [
    "description",
    "name",
    "type",
    "defaultValue",
    "directives"
  ],
  InterfaceTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  UnionTypeDefinition: ["description", "name", "directives", "types"],
  EnumTypeDefinition: ["description", "name", "directives", "values"],
  EnumValueDefinition: ["description", "name", "directives"],
  InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
  DirectiveDefinition: ["description", "name", "arguments", "locations"],
  SchemaExtension: ["directives", "operationTypes"],
  ScalarTypeExtension: ["name", "directives"],
  ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
  InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
  UnionTypeExtension: ["name", "directives", "types"],
  EnumTypeExtension: ["name", "directives", "values"],
  InputObjectTypeExtension: ["name", "directives", "fields"]
}, ot = new Set(Object.keys(Oe));
function me(e) {
  const t = e == null ? void 0 : e.kind;
  return typeof t == "string" && ot.has(t);
}
var U;
(function(e) {
  e.QUERY = "query", e.MUTATION = "mutation", e.SUBSCRIPTION = "subscription";
})(U || (U = {}));
var ue;
(function(e) {
  e.QUERY = "QUERY", e.MUTATION = "MUTATION", e.SUBSCRIPTION = "SUBSCRIPTION", e.FIELD = "FIELD", e.FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION", e.FRAGMENT_SPREAD = "FRAGMENT_SPREAD", e.INLINE_FRAGMENT = "INLINE_FRAGMENT", e.VARIABLE_DEFINITION = "VARIABLE_DEFINITION", e.SCHEMA = "SCHEMA", e.SCALAR = "SCALAR", e.OBJECT = "OBJECT", e.FIELD_DEFINITION = "FIELD_DEFINITION", e.ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION", e.INTERFACE = "INTERFACE", e.UNION = "UNION", e.ENUM = "ENUM", e.ENUM_VALUE = "ENUM_VALUE", e.INPUT_OBJECT = "INPUT_OBJECT", e.INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION";
})(ue || (ue = {}));
var E;
(function(e) {
  e.NAME = "Name", e.DOCUMENT = "Document", e.OPERATION_DEFINITION = "OperationDefinition", e.VARIABLE_DEFINITION = "VariableDefinition", e.SELECTION_SET = "SelectionSet", e.FIELD = "Field", e.ARGUMENT = "Argument", e.FRAGMENT_SPREAD = "FragmentSpread", e.INLINE_FRAGMENT = "InlineFragment", e.FRAGMENT_DEFINITION = "FragmentDefinition", e.VARIABLE = "Variable", e.INT = "IntValue", e.FLOAT = "FloatValue", e.STRING = "StringValue", e.BOOLEAN = "BooleanValue", e.NULL = "NullValue", e.ENUM = "EnumValue", e.LIST = "ListValue", e.OBJECT = "ObjectValue", e.OBJECT_FIELD = "ObjectField", e.DIRECTIVE = "Directive", e.NAMED_TYPE = "NamedType", e.LIST_TYPE = "ListType", e.NON_NULL_TYPE = "NonNullType", e.SCHEMA_DEFINITION = "SchemaDefinition", e.OPERATION_TYPE_DEFINITION = "OperationTypeDefinition", e.SCALAR_TYPE_DEFINITION = "ScalarTypeDefinition", e.OBJECT_TYPE_DEFINITION = "ObjectTypeDefinition", e.FIELD_DEFINITION = "FieldDefinition", e.INPUT_VALUE_DEFINITION = "InputValueDefinition", e.INTERFACE_TYPE_DEFINITION = "InterfaceTypeDefinition", e.UNION_TYPE_DEFINITION = "UnionTypeDefinition", e.ENUM_TYPE_DEFINITION = "EnumTypeDefinition", e.ENUM_VALUE_DEFINITION = "EnumValueDefinition", e.INPUT_OBJECT_TYPE_DEFINITION = "InputObjectTypeDefinition", e.DIRECTIVE_DEFINITION = "DirectiveDefinition", e.SCHEMA_EXTENSION = "SchemaExtension", e.SCALAR_TYPE_EXTENSION = "ScalarTypeExtension", e.OBJECT_TYPE_EXTENSION = "ObjectTypeExtension", e.INTERFACE_TYPE_EXTENSION = "InterfaceTypeExtension", e.UNION_TYPE_EXTENSION = "UnionTypeExtension", e.ENUM_TYPE_EXTENSION = "EnumTypeExtension", e.INPUT_OBJECT_TYPE_EXTENSION = "InputObjectTypeExtension";
})(E || (E = {}));
function le(e) {
  return e === 9 || e === 32;
}
function $(e) {
  return e >= 48 && e <= 57;
}
function be(e) {
  return e >= 97 && e <= 122 || // A-Z
  e >= 65 && e <= 90;
}
function _e(e) {
  return be(e) || e === 95;
}
function at(e) {
  return be(e) || $(e) || e === 95;
}
function ct(e) {
  var t;
  let n = Number.MAX_SAFE_INTEGER, r = null, i = -1;
  for (let c = 0; c < e.length; ++c) {
    var s;
    const u = e[c], h = ut(u);
    h !== u.length && (r = (s = r) !== null && s !== void 0 ? s : c, i = c, c !== 0 && h < n && (n = h));
  }
  return e.map((c, u) => u === 0 ? c : c.slice(n)).slice(
    (t = r) !== null && t !== void 0 ? t : 0,
    i + 1
  );
}
function ut(e) {
  let t = 0;
  for (; t < e.length && le(e.charCodeAt(t)); )
    ++t;
  return t;
}
function lt(e, t) {
  const n = e.replace(/"""/g, '\\"""'), r = n.split(/\r\n|[\n\r]/g), i = r.length === 1, s = r.length > 1 && r.slice(1).every((x) => x.length === 0 || le(x.charCodeAt(0))), c = n.endsWith('\\"""'), u = e.endsWith('"') && !c, h = e.endsWith("\\"), d = u || h, f = !(t != null && t.minimize) && // add leading and trailing new lines only if it improves readability
  (!i || e.length > 70 || d || s || c);
  let y = "";
  const m = i && le(e.charCodeAt(0));
  return (f && !m || s) && (y += `
`), y += n, (f || d) && (y += `
`), '"""' + y + '"""';
}
var a;
(function(e) {
  e.SOF = "<SOF>", e.EOF = "<EOF>", e.BANG = "!", e.DOLLAR = "$", e.AMP = "&", e.PAREN_L = "(", e.PAREN_R = ")", e.SPREAD = "...", e.COLON = ":", e.EQUALS = "=", e.AT = "@", e.BRACKET_L = "[", e.BRACKET_R = "]", e.BRACE_L = "{", e.PIPE = "|", e.BRACE_R = "}", e.NAME = "Name", e.INT = "Int", e.FLOAT = "Float", e.STRING = "String", e.BLOCK_STRING = "BlockString", e.COMMENT = "Comment";
})(a || (a = {}));
class ht {
  /**
   * The previously focused non-ignored token.
   */
  /**
   * The currently focused non-ignored token.
   */
  /**
   * The (1-indexed) line containing the current token.
   */
  /**
   * The character offset at which the current line begins.
   */
  constructor(t) {
    const n = new ge(a.SOF, 0, 0, 0, 0);
    this.source = t, this.lastToken = n, this.token = n, this.line = 1, this.lineStart = 0;
  }
  get [Symbol.toStringTag]() {
    return "Lexer";
  }
  /**
   * Advances the token stream to the next non-ignored token.
   */
  advance() {
    return this.lastToken = this.token, this.token = this.lookahead();
  }
  /**
   * Looks ahead and returns the next non-ignored token, but does not change
   * the state of Lexer.
   */
  lookahead() {
    let t = this.token;
    if (t.kind !== a.EOF)
      do
        if (t.next)
          t = t.next;
        else {
          const n = ft(this, t.end);
          t.next = n, n.prev = t, t = n;
        }
      while (t.kind === a.COMMENT);
    return t;
  }
}
function pt(e) {
  return e === a.BANG || e === a.DOLLAR || e === a.AMP || e === a.PAREN_L || e === a.PAREN_R || e === a.SPREAD || e === a.COLON || e === a.EQUALS || e === a.AT || e === a.BRACKET_L || e === a.BRACKET_R || e === a.BRACE_L || e === a.PIPE || e === a.BRACE_R;
}
function M(e) {
  return e >= 0 && e <= 55295 || e >= 57344 && e <= 1114111;
}
function ee(e, t) {
  return De(e.charCodeAt(t)) && Se(e.charCodeAt(t + 1));
}
function De(e) {
  return e >= 55296 && e <= 56319;
}
function Se(e) {
  return e >= 56320 && e <= 57343;
}
function F(e, t) {
  const n = e.source.body.codePointAt(t);
  if (n === void 0)
    return a.EOF;
  if (n >= 32 && n <= 126) {
    const r = String.fromCodePoint(n);
    return r === '"' ? `'"'` : `"${r}"`;
  }
  return "U+" + n.toString(16).toUpperCase().padStart(4, "0");
}
function g(e, t, n, r, i) {
  const s = e.line, c = 1 + n - e.lineStart;
  return new ge(t, n, r, s, c, i);
}
function ft(e, t) {
  const n = e.source.body, r = n.length;
  let i = t;
  for (; i < r; ) {
    const s = n.charCodeAt(i);
    switch (s) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++i;
        continue;
      case 10:
        ++i, ++e.line, e.lineStart = i;
        continue;
      case 13:
        n.charCodeAt(i + 1) === 10 ? i += 2 : ++i, ++e.line, e.lineStart = i;
        continue;
      case 35:
        return dt(e, i);
      case 33:
        return g(e, a.BANG, i, i + 1);
      case 36:
        return g(e, a.DOLLAR, i, i + 1);
      case 38:
        return g(e, a.AMP, i, i + 1);
      case 40:
        return g(e, a.PAREN_L, i, i + 1);
      case 41:
        return g(e, a.PAREN_R, i, i + 1);
      case 46:
        if (n.charCodeAt(i + 1) === 46 && n.charCodeAt(i + 2) === 46)
          return g(e, a.SPREAD, i, i + 3);
        break;
      case 58:
        return g(e, a.COLON, i, i + 1);
      case 61:
        return g(e, a.EQUALS, i, i + 1);
      case 64:
        return g(e, a.AT, i, i + 1);
      case 91:
        return g(e, a.BRACKET_L, i, i + 1);
      case 93:
        return g(e, a.BRACKET_R, i, i + 1);
      case 123:
        return g(e, a.BRACE_L, i, i + 1);
      case 124:
        return g(e, a.PIPE, i, i + 1);
      case 125:
        return g(e, a.BRACE_R, i, i + 1);
      case 34:
        return n.charCodeAt(i + 1) === 34 && n.charCodeAt(i + 2) === 34 ? vt(e, i) : Et(e, i);
    }
    if ($(s) || s === 45)
      return yt(e, i, s);
    if (_e(s))
      return xt(e, i);
    throw O(
      e.source,
      i,
      s === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : M(s) || ee(n, i) ? `Unexpected character: ${F(e, i)}.` : `Invalid character: ${F(e, i)}.`
    );
  }
  return g(e, a.EOF, r, r);
}
function dt(e, t) {
  const n = e.source.body, r = n.length;
  let i = t + 1;
  for (; i < r; ) {
    const s = n.charCodeAt(i);
    if (s === 10 || s === 13)
      break;
    if (M(s))
      ++i;
    else if (ee(n, i))
      i += 2;
    else
      break;
  }
  return g(
    e,
    a.COMMENT,
    t,
    i,
    n.slice(t + 1, i)
  );
}
function yt(e, t, n) {
  const r = e.source.body;
  let i = t, s = n, c = !1;
  if (s === 45 && (s = r.charCodeAt(++i)), s === 48) {
    if (s = r.charCodeAt(++i), $(s))
      throw O(
        e.source,
        i,
        `Invalid number, unexpected digit after 0: ${F(
          e,
          i
        )}.`
      );
  } else
    i = re(e, i, s), s = r.charCodeAt(i);
  if (s === 46 && (c = !0, s = r.charCodeAt(++i), i = re(e, i, s), s = r.charCodeAt(i)), (s === 69 || s === 101) && (c = !0, s = r.charCodeAt(++i), (s === 43 || s === 45) && (s = r.charCodeAt(++i)), i = re(e, i, s), s = r.charCodeAt(i)), s === 46 || _e(s))
    throw O(
      e.source,
      i,
      `Invalid number, expected digit but got: ${F(
        e,
        i
      )}.`
    );
  return g(
    e,
    c ? a.FLOAT : a.INT,
    t,
    i,
    r.slice(t, i)
  );
}
function re(e, t, n) {
  if (!$(n))
    throw O(
      e.source,
      t,
      `Invalid number, expected digit but got: ${F(
        e,
        t
      )}.`
    );
  const r = e.source.body;
  let i = t + 1;
  for (; $(r.charCodeAt(i)); )
    ++i;
  return i;
}
function Et(e, t) {
  const n = e.source.body, r = n.length;
  let i = t + 1, s = i, c = "";
  for (; i < r; ) {
    const u = n.charCodeAt(i);
    if (u === 34)
      return c += n.slice(s, i), g(e, a.STRING, t, i + 1, c);
    if (u === 92) {
      c += n.slice(s, i);
      const h = n.charCodeAt(i + 1) === 117 ? n.charCodeAt(i + 2) === 123 ? mt(e, i) : Tt(e, i) : Nt(e, i);
      c += h.value, i += h.size, s = i;
      continue;
    }
    if (u === 10 || u === 13)
      break;
    if (M(u))
      ++i;
    else if (ee(n, i))
      i += 2;
    else
      throw O(
        e.source,
        i,
        `Invalid character within String: ${F(
          e,
          i
        )}.`
      );
  }
  throw O(e.source, i, "Unterminated string.");
}
function mt(e, t) {
  const n = e.source.body;
  let r = 0, i = 3;
  for (; i < 12; ) {
    const s = n.charCodeAt(t + i++);
    if (s === 125) {
      if (i < 5 || !M(r))
        break;
      return {
        value: String.fromCodePoint(r),
        size: i
      };
    }
    if (r = r << 4 | j(s), r < 0)
      break;
  }
  throw O(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${n.slice(
      t,
      t + i
    )}".`
  );
}
function Tt(e, t) {
  const n = e.source.body, r = Te(n, t + 2);
  if (M(r))
    return {
      value: String.fromCodePoint(r),
      size: 6
    };
  if (De(r) && n.charCodeAt(t + 6) === 92 && n.charCodeAt(t + 7) === 117) {
    const i = Te(n, t + 8);
    if (Se(i))
      return {
        value: String.fromCodePoint(r, i),
        size: 12
      };
  }
  throw O(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${n.slice(t, t + 6)}".`
  );
}
function Te(e, t) {
  return j(e.charCodeAt(t)) << 12 | j(e.charCodeAt(t + 1)) << 8 | j(e.charCodeAt(t + 2)) << 4 | j(e.charCodeAt(t + 3));
}
function j(e) {
  return e >= 48 && e <= 57 ? e - 48 : e >= 65 && e <= 70 ? e - 55 : e >= 97 && e <= 102 ? e - 87 : -1;
}
function Nt(e, t) {
  const n = e.source.body;
  switch (n.charCodeAt(t + 1)) {
    case 34:
      return {
        value: '"',
        size: 2
      };
    case 92:
      return {
        value: "\\",
        size: 2
      };
    case 47:
      return {
        value: "/",
        size: 2
      };
    case 98:
      return {
        value: "\b",
        size: 2
      };
    case 102:
      return {
        value: "\f",
        size: 2
      };
    case 110:
      return {
        value: `
`,
        size: 2
      };
    case 114:
      return {
        value: "\r",
        size: 2
      };
    case 116:
      return {
        value: "	",
        size: 2
      };
  }
  throw O(
    e.source,
    t,
    `Invalid character escape sequence: "${n.slice(
      t,
      t + 2
    )}".`
  );
}
function vt(e, t) {
  const n = e.source.body, r = n.length;
  let i = e.lineStart, s = t + 3, c = s, u = "";
  const h = [];
  for (; s < r; ) {
    const d = n.charCodeAt(s);
    if (d === 34 && n.charCodeAt(s + 1) === 34 && n.charCodeAt(s + 2) === 34) {
      u += n.slice(c, s), h.push(u);
      const f = g(
        e,
        a.BLOCK_STRING,
        t,
        s + 3,
        // Return a string of the lines joined with U+000A.
        ct(h).join(`
`)
      );
      return e.line += h.length - 1, e.lineStart = i, f;
    }
    if (d === 92 && n.charCodeAt(s + 1) === 34 && n.charCodeAt(s + 2) === 34 && n.charCodeAt(s + 3) === 34) {
      u += n.slice(c, s), c = s + 1, s += 4;
      continue;
    }
    if (d === 10 || d === 13) {
      u += n.slice(c, s), h.push(u), d === 13 && n.charCodeAt(s + 1) === 10 ? s += 2 : ++s, u = "", c = s, i = s;
      continue;
    }
    if (M(d))
      ++s;
    else if (ee(n, s))
      s += 2;
    else
      throw O(
        e.source,
        s,
        `Invalid character within String: ${F(
          e,
          s
        )}.`
      );
  }
  throw O(e.source, s, "Unterminated string.");
}
function xt(e, t) {
  const n = e.source.body, r = n.length;
  let i = t + 1;
  for (; i < r; ) {
    const s = n.charCodeAt(i);
    if (at(s))
      ++i;
    else
      break;
  }
  return g(
    e,
    a.NAME,
    t,
    i,
    n.slice(t, i)
  );
}
const At = 10, Ce = 2;
function de(e) {
  return te(e, []);
}
function te(e, t) {
  switch (typeof e) {
    case "string":
      return JSON.stringify(e);
    case "function":
      return e.name ? `[function ${e.name}]` : "[function]";
    case "object":
      return It(e, t);
    default:
      return String(e);
  }
}
function It(e, t) {
  if (e === null)
    return "null";
  if (t.includes(e))
    return "[Circular]";
  const n = [...t, e];
  if (gt(e)) {
    const r = e.toJSON();
    if (r !== e)
      return typeof r == "string" ? r : te(r, n);
  } else if (Array.isArray(e))
    return bt(e, n);
  return Ot(e, n);
}
function gt(e) {
  return typeof e.toJSON == "function";
}
function Ot(e, t) {
  const n = Object.entries(e);
  return n.length === 0 ? "{}" : t.length > Ce ? "[" + _t(e) + "]" : "{ " + n.map(
    ([i, s]) => i + ": " + te(s, t)
  ).join(", ") + " }";
}
function bt(e, t) {
  if (e.length === 0)
    return "[]";
  if (t.length > Ce)
    return "[Array]";
  const n = Math.min(At, e.length), r = e.length - n, i = [];
  for (let s = 0; s < n; ++s)
    i.push(te(e[s], t));
  return r === 1 ? i.push("... 1 more item") : r > 1 && i.push(`... ${r} more items`), "[" + i.join(", ") + "]";
}
function _t(e) {
  const t = Object.prototype.toString.call(e).replace(/^\[object /, "").replace(/]$/, "");
  if (t === "Object" && typeof e.constructor == "function") {
    const n = e.constructor.name;
    if (typeof n == "string" && n !== "")
      return n;
  }
  return t;
}
const Dt = (
  /* c8 ignore next 6 */
  // FIXME: https://github.com/graphql/graphql-js/issues/2317
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === "production" ? function(t, n) {
    return t instanceof n;
  } : function(t, n) {
    if (t instanceof n)
      return !0;
    if (typeof t == "object" && t !== null) {
      var r;
      const i = n.prototype[Symbol.toStringTag], s = (
        // We still need to support constructor's name to detect conflicts with older versions of this library.
        Symbol.toStringTag in t ? t[Symbol.toStringTag] : (r = t.constructor) === null || r === void 0 ? void 0 : r.name
      );
      if (i === s) {
        const c = de(t);
        throw new Error(`Cannot use ${i} "${c}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
      }
    }
    return !1;
  }
);
class we {
  constructor(t, n = "GraphQL request", r = {
    line: 1,
    column: 1
  }) {
    typeof t == "string" || Q(!1, `Body must be a string. Received: ${de(t)}.`), this.body = t, this.name = n, this.locationOffset = r, this.locationOffset.line > 0 || Q(
      !1,
      "line in locationOffset is 1-indexed and must be positive."
    ), this.locationOffset.column > 0 || Q(
      !1,
      "column in locationOffset is 1-indexed and must be positive."
    );
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
}
function St(e) {
  return Dt(e, we);
}
function Ct(e, t) {
  return new wt(e, t).parseDocument();
}
class wt {
  constructor(t, n = {}) {
    const r = St(t) ? t : new we(t);
    this._lexer = new ht(r), this._options = n, this._tokenCounter = 0;
  }
  /**
   * Converts a name lex token into a name parse node.
   */
  parseName() {
    const t = this.expectToken(a.NAME);
    return this.node(t, {
      kind: E.NAME,
      value: t.value
    });
  }
  // Implements the parsing rules in the Document section.
  /**
   * Document : Definition+
   */
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: E.DOCUMENT,
      definitions: this.many(
        a.SOF,
        this.parseDefinition,
        a.EOF
      )
    });
  }
  /**
   * Definition :
   *   - ExecutableDefinition
   *   - TypeSystemDefinition
   *   - TypeSystemExtension
   *
   * ExecutableDefinition :
   *   - OperationDefinition
   *   - FragmentDefinition
   *
   * TypeSystemDefinition :
   *   - SchemaDefinition
   *   - TypeDefinition
   *   - DirectiveDefinition
   *
   * TypeDefinition :
   *   - ScalarTypeDefinition
   *   - ObjectTypeDefinition
   *   - InterfaceTypeDefinition
   *   - UnionTypeDefinition
   *   - EnumTypeDefinition
   *   - InputObjectTypeDefinition
   */
  parseDefinition() {
    if (this.peek(a.BRACE_L))
      return this.parseOperationDefinition();
    const t = this.peekDescription(), n = t ? this._lexer.lookahead() : this._lexer.token;
    if (n.kind === a.NAME) {
      switch (n.value) {
        case "schema":
          return this.parseSchemaDefinition();
        case "scalar":
          return this.parseScalarTypeDefinition();
        case "type":
          return this.parseObjectTypeDefinition();
        case "interface":
          return this.parseInterfaceTypeDefinition();
        case "union":
          return this.parseUnionTypeDefinition();
        case "enum":
          return this.parseEnumTypeDefinition();
        case "input":
          return this.parseInputObjectTypeDefinition();
        case "directive":
          return this.parseDirectiveDefinition();
      }
      if (t)
        throw O(
          this._lexer.source,
          this._lexer.token.start,
          "Unexpected description, descriptions are supported only on type definitions."
        );
      switch (n.value) {
        case "query":
        case "mutation":
        case "subscription":
          return this.parseOperationDefinition();
        case "fragment":
          return this.parseFragmentDefinition();
        case "extend":
          return this.parseTypeSystemExtension();
      }
    }
    throw this.unexpected(n);
  }
  // Implements the parsing rules in the Operations section.
  /**
   * OperationDefinition :
   *  - SelectionSet
   *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
   */
  parseOperationDefinition() {
    const t = this._lexer.token;
    if (this.peek(a.BRACE_L))
      return this.node(t, {
        kind: E.OPERATION_DEFINITION,
        operation: U.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet()
      });
    const n = this.parseOperationType();
    let r;
    return this.peek(a.NAME) && (r = this.parseName()), this.node(t, {
      kind: E.OPERATION_DEFINITION,
      operation: n,
      name: r,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * OperationType : one of query mutation subscription
   */
  parseOperationType() {
    const t = this.expectToken(a.NAME);
    switch (t.value) {
      case "query":
        return U.QUERY;
      case "mutation":
        return U.MUTATION;
      case "subscription":
        return U.SUBSCRIPTION;
    }
    throw this.unexpected(t);
  }
  /**
   * VariableDefinitions : ( VariableDefinition+ )
   */
  parseVariableDefinitions() {
    return this.optionalMany(
      a.PAREN_L,
      this.parseVariableDefinition,
      a.PAREN_R
    );
  }
  /**
   * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
   */
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: E.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(a.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(a.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives()
    });
  }
  /**
   * Variable : $ Name
   */
  parseVariable() {
    const t = this._lexer.token;
    return this.expectToken(a.DOLLAR), this.node(t, {
      kind: E.VARIABLE,
      name: this.parseName()
    });
  }
  /**
   * ```
   * SelectionSet : { Selection+ }
   * ```
   */
  parseSelectionSet() {
    return this.node(this._lexer.token, {
      kind: E.SELECTION_SET,
      selections: this.many(
        a.BRACE_L,
        this.parseSelection,
        a.BRACE_R
      )
    });
  }
  /**
   * Selection :
   *   - Field
   *   - FragmentSpread
   *   - InlineFragment
   */
  parseSelection() {
    return this.peek(a.SPREAD) ? this.parseFragment() : this.parseField();
  }
  /**
   * Field : Alias? Name Arguments? Directives? SelectionSet?
   *
   * Alias : Name :
   */
  parseField() {
    const t = this._lexer.token, n = this.parseName();
    let r, i;
    return this.expectOptionalToken(a.COLON) ? (r = n, i = this.parseName()) : i = n, this.node(t, {
      kind: E.FIELD,
      alias: r,
      name: i,
      arguments: this.parseArguments(!1),
      directives: this.parseDirectives(!1),
      selectionSet: this.peek(a.BRACE_L) ? this.parseSelectionSet() : void 0
    });
  }
  /**
   * Arguments[Const] : ( Argument[?Const]+ )
   */
  parseArguments(t) {
    const n = t ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(a.PAREN_L, n, a.PAREN_R);
  }
  /**
   * Argument[Const] : Name : Value[?Const]
   */
  parseArgument(t = !1) {
    const n = this._lexer.token, r = this.parseName();
    return this.expectToken(a.COLON), this.node(n, {
      kind: E.ARGUMENT,
      name: r,
      value: this.parseValueLiteral(t)
    });
  }
  parseConstArgument() {
    return this.parseArgument(!0);
  }
  // Implements the parsing rules in the Fragments section.
  /**
   * Corresponds to both FragmentSpread and InlineFragment in the spec.
   *
   * FragmentSpread : ... FragmentName Directives?
   *
   * InlineFragment : ... TypeCondition? Directives? SelectionSet
   */
  parseFragment() {
    const t = this._lexer.token;
    this.expectToken(a.SPREAD);
    const n = this.expectOptionalKeyword("on");
    return !n && this.peek(a.NAME) ? this.node(t, {
      kind: E.FRAGMENT_SPREAD,
      name: this.parseFragmentName(),
      directives: this.parseDirectives(!1)
    }) : this.node(t, {
      kind: E.INLINE_FRAGMENT,
      typeCondition: n ? this.parseNamedType() : void 0,
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * FragmentDefinition :
   *   - fragment FragmentName on TypeCondition Directives? SelectionSet
   *
   * TypeCondition : NamedType
   */
  parseFragmentDefinition() {
    const t = this._lexer.token;
    return this.expectKeyword("fragment"), this._options.allowLegacyFragmentVariables === !0 ? this.node(t, {
      kind: E.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      variableDefinitions: this.parseVariableDefinitions(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    }) : this.node(t, {
      kind: E.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * FragmentName : Name but not `on`
   */
  parseFragmentName() {
    if (this._lexer.token.value === "on")
      throw this.unexpected();
    return this.parseName();
  }
  // Implements the parsing rules in the Values section.
  /**
   * Value[Const] :
   *   - [~Const] Variable
   *   - IntValue
   *   - FloatValue
   *   - StringValue
   *   - BooleanValue
   *   - NullValue
   *   - EnumValue
   *   - ListValue[?Const]
   *   - ObjectValue[?Const]
   *
   * BooleanValue : one of `true` `false`
   *
   * NullValue : `null`
   *
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseValueLiteral(t) {
    const n = this._lexer.token;
    switch (n.kind) {
      case a.BRACKET_L:
        return this.parseList(t);
      case a.BRACE_L:
        return this.parseObject(t);
      case a.INT:
        return this.advanceLexer(), this.node(n, {
          kind: E.INT,
          value: n.value
        });
      case a.FLOAT:
        return this.advanceLexer(), this.node(n, {
          kind: E.FLOAT,
          value: n.value
        });
      case a.STRING:
      case a.BLOCK_STRING:
        return this.parseStringLiteral();
      case a.NAME:
        switch (this.advanceLexer(), n.value) {
          case "true":
            return this.node(n, {
              kind: E.BOOLEAN,
              value: !0
            });
          case "false":
            return this.node(n, {
              kind: E.BOOLEAN,
              value: !1
            });
          case "null":
            return this.node(n, {
              kind: E.NULL
            });
          default:
            return this.node(n, {
              kind: E.ENUM,
              value: n.value
            });
        }
      case a.DOLLAR:
        if (t)
          if (this.expectToken(a.DOLLAR), this._lexer.token.kind === a.NAME) {
            const r = this._lexer.token.value;
            throw O(
              this._lexer.source,
              n.start,
              `Unexpected variable "$${r}" in constant value.`
            );
          } else
            throw this.unexpected(n);
        return this.parseVariable();
      default:
        throw this.unexpected();
    }
  }
  parseConstValueLiteral() {
    return this.parseValueLiteral(!0);
  }
  parseStringLiteral() {
    const t = this._lexer.token;
    return this.advanceLexer(), this.node(t, {
      kind: E.STRING,
      value: t.value,
      block: t.kind === a.BLOCK_STRING
    });
  }
  /**
   * ListValue[Const] :
   *   - [ ]
   *   - [ Value[?Const]+ ]
   */
  parseList(t) {
    const n = () => this.parseValueLiteral(t);
    return this.node(this._lexer.token, {
      kind: E.LIST,
      values: this.any(a.BRACKET_L, n, a.BRACKET_R)
    });
  }
  /**
   * ```
   * ObjectValue[Const] :
   *   - { }
   *   - { ObjectField[?Const]+ }
   * ```
   */
  parseObject(t) {
    const n = () => this.parseObjectField(t);
    return this.node(this._lexer.token, {
      kind: E.OBJECT,
      fields: this.any(a.BRACE_L, n, a.BRACE_R)
    });
  }
  /**
   * ObjectField[Const] : Name : Value[?Const]
   */
  parseObjectField(t) {
    const n = this._lexer.token, r = this.parseName();
    return this.expectToken(a.COLON), this.node(n, {
      kind: E.OBJECT_FIELD,
      name: r,
      value: this.parseValueLiteral(t)
    });
  }
  // Implements the parsing rules in the Directives section.
  /**
   * Directives[Const] : Directive[?Const]+
   */
  parseDirectives(t) {
    const n = [];
    for (; this.peek(a.AT); )
      n.push(this.parseDirective(t));
    return n;
  }
  parseConstDirectives() {
    return this.parseDirectives(!0);
  }
  /**
   * ```
   * Directive[Const] : @ Name Arguments[?Const]?
   * ```
   */
  parseDirective(t) {
    const n = this._lexer.token;
    return this.expectToken(a.AT), this.node(n, {
      kind: E.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(t)
    });
  }
  // Implements the parsing rules in the Types section.
  /**
   * Type :
   *   - NamedType
   *   - ListType
   *   - NonNullType
   */
  parseTypeReference() {
    const t = this._lexer.token;
    let n;
    if (this.expectOptionalToken(a.BRACKET_L)) {
      const r = this.parseTypeReference();
      this.expectToken(a.BRACKET_R), n = this.node(t, {
        kind: E.LIST_TYPE,
        type: r
      });
    } else
      n = this.parseNamedType();
    return this.expectOptionalToken(a.BANG) ? this.node(t, {
      kind: E.NON_NULL_TYPE,
      type: n
    }) : n;
  }
  /**
   * NamedType : Name
   */
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: E.NAMED_TYPE,
      name: this.parseName()
    });
  }
  // Implements the parsing rules in the Type Definition section.
  peekDescription() {
    return this.peek(a.STRING) || this.peek(a.BLOCK_STRING);
  }
  /**
   * Description : StringValue
   */
  parseDescription() {
    if (this.peekDescription())
      return this.parseStringLiteral();
  }
  /**
   * ```
   * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
   * ```
   */
  parseSchemaDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("schema");
    const r = this.parseConstDirectives(), i = this.many(
      a.BRACE_L,
      this.parseOperationTypeDefinition,
      a.BRACE_R
    );
    return this.node(t, {
      kind: E.SCHEMA_DEFINITION,
      description: n,
      directives: r,
      operationTypes: i
    });
  }
  /**
   * OperationTypeDefinition : OperationType : NamedType
   */
  parseOperationTypeDefinition() {
    const t = this._lexer.token, n = this.parseOperationType();
    this.expectToken(a.COLON);
    const r = this.parseNamedType();
    return this.node(t, {
      kind: E.OPERATION_TYPE_DEFINITION,
      operation: n,
      type: r
    });
  }
  /**
   * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
   */
  parseScalarTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("scalar");
    const r = this.parseName(), i = this.parseConstDirectives();
    return this.node(t, {
      kind: E.SCALAR_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: i
    });
  }
  /**
   * ObjectTypeDefinition :
   *   Description?
   *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
   */
  parseObjectTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("type");
    const r = this.parseName(), i = this.parseImplementsInterfaces(), s = this.parseConstDirectives(), c = this.parseFieldsDefinition();
    return this.node(t, {
      kind: E.OBJECT_TYPE_DEFINITION,
      description: n,
      name: r,
      interfaces: i,
      directives: s,
      fields: c
    });
  }
  /**
   * ImplementsInterfaces :
   *   - implements `&`? NamedType
   *   - ImplementsInterfaces & NamedType
   */
  parseImplementsInterfaces() {
    return this.expectOptionalKeyword("implements") ? this.delimitedMany(a.AMP, this.parseNamedType) : [];
  }
  /**
   * ```
   * FieldsDefinition : { FieldDefinition+ }
   * ```
   */
  parseFieldsDefinition() {
    return this.optionalMany(
      a.BRACE_L,
      this.parseFieldDefinition,
      a.BRACE_R
    );
  }
  /**
   * FieldDefinition :
   *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
   */
  parseFieldDefinition() {
    const t = this._lexer.token, n = this.parseDescription(), r = this.parseName(), i = this.parseArgumentDefs();
    this.expectToken(a.COLON);
    const s = this.parseTypeReference(), c = this.parseConstDirectives();
    return this.node(t, {
      kind: E.FIELD_DEFINITION,
      description: n,
      name: r,
      arguments: i,
      type: s,
      directives: c
    });
  }
  /**
   * ArgumentsDefinition : ( InputValueDefinition+ )
   */
  parseArgumentDefs() {
    return this.optionalMany(
      a.PAREN_L,
      this.parseInputValueDef,
      a.PAREN_R
    );
  }
  /**
   * InputValueDefinition :
   *   - Description? Name : Type DefaultValue? Directives[Const]?
   */
  parseInputValueDef() {
    const t = this._lexer.token, n = this.parseDescription(), r = this.parseName();
    this.expectToken(a.COLON);
    const i = this.parseTypeReference();
    let s;
    this.expectOptionalToken(a.EQUALS) && (s = this.parseConstValueLiteral());
    const c = this.parseConstDirectives();
    return this.node(t, {
      kind: E.INPUT_VALUE_DEFINITION,
      description: n,
      name: r,
      type: i,
      defaultValue: s,
      directives: c
    });
  }
  /**
   * InterfaceTypeDefinition :
   *   - Description? interface Name Directives[Const]? FieldsDefinition?
   */
  parseInterfaceTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("interface");
    const r = this.parseName(), i = this.parseImplementsInterfaces(), s = this.parseConstDirectives(), c = this.parseFieldsDefinition();
    return this.node(t, {
      kind: E.INTERFACE_TYPE_DEFINITION,
      description: n,
      name: r,
      interfaces: i,
      directives: s,
      fields: c
    });
  }
  /**
   * UnionTypeDefinition :
   *   - Description? union Name Directives[Const]? UnionMemberTypes?
   */
  parseUnionTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("union");
    const r = this.parseName(), i = this.parseConstDirectives(), s = this.parseUnionMemberTypes();
    return this.node(t, {
      kind: E.UNION_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: i,
      types: s
    });
  }
  /**
   * UnionMemberTypes :
   *   - = `|`? NamedType
   *   - UnionMemberTypes | NamedType
   */
  parseUnionMemberTypes() {
    return this.expectOptionalToken(a.EQUALS) ? this.delimitedMany(a.PIPE, this.parseNamedType) : [];
  }
  /**
   * EnumTypeDefinition :
   *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
   */
  parseEnumTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("enum");
    const r = this.parseName(), i = this.parseConstDirectives(), s = this.parseEnumValuesDefinition();
    return this.node(t, {
      kind: E.ENUM_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: i,
      values: s
    });
  }
  /**
   * ```
   * EnumValuesDefinition : { EnumValueDefinition+ }
   * ```
   */
  parseEnumValuesDefinition() {
    return this.optionalMany(
      a.BRACE_L,
      this.parseEnumValueDefinition,
      a.BRACE_R
    );
  }
  /**
   * EnumValueDefinition : Description? EnumValue Directives[Const]?
   */
  parseEnumValueDefinition() {
    const t = this._lexer.token, n = this.parseDescription(), r = this.parseEnumValueName(), i = this.parseConstDirectives();
    return this.node(t, {
      kind: E.ENUM_VALUE_DEFINITION,
      description: n,
      name: r,
      directives: i
    });
  }
  /**
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseEnumValueName() {
    if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null")
      throw O(
        this._lexer.source,
        this._lexer.token.start,
        `${z(
          this._lexer.token
        )} is reserved and cannot be used for an enum value.`
      );
    return this.parseName();
  }
  /**
   * InputObjectTypeDefinition :
   *   - Description? input Name Directives[Const]? InputFieldsDefinition?
   */
  parseInputObjectTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("input");
    const r = this.parseName(), i = this.parseConstDirectives(), s = this.parseInputFieldsDefinition();
    return this.node(t, {
      kind: E.INPUT_OBJECT_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: i,
      fields: s
    });
  }
  /**
   * ```
   * InputFieldsDefinition : { InputValueDefinition+ }
   * ```
   */
  parseInputFieldsDefinition() {
    return this.optionalMany(
      a.BRACE_L,
      this.parseInputValueDef,
      a.BRACE_R
    );
  }
  /**
   * TypeSystemExtension :
   *   - SchemaExtension
   *   - TypeExtension
   *
   * TypeExtension :
   *   - ScalarTypeExtension
   *   - ObjectTypeExtension
   *   - InterfaceTypeExtension
   *   - UnionTypeExtension
   *   - EnumTypeExtension
   *   - InputObjectTypeDefinition
   */
  parseTypeSystemExtension() {
    const t = this._lexer.lookahead();
    if (t.kind === a.NAME)
      switch (t.value) {
        case "schema":
          return this.parseSchemaExtension();
        case "scalar":
          return this.parseScalarTypeExtension();
        case "type":
          return this.parseObjectTypeExtension();
        case "interface":
          return this.parseInterfaceTypeExtension();
        case "union":
          return this.parseUnionTypeExtension();
        case "enum":
          return this.parseEnumTypeExtension();
        case "input":
          return this.parseInputObjectTypeExtension();
      }
    throw this.unexpected(t);
  }
  /**
   * ```
   * SchemaExtension :
   *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
   *  - extend schema Directives[Const]
   * ```
   */
  parseSchemaExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("schema");
    const n = this.parseConstDirectives(), r = this.optionalMany(
      a.BRACE_L,
      this.parseOperationTypeDefinition,
      a.BRACE_R
    );
    if (n.length === 0 && r.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: E.SCHEMA_EXTENSION,
      directives: n,
      operationTypes: r
    });
  }
  /**
   * ScalarTypeExtension :
   *   - extend scalar Name Directives[Const]
   */
  parseScalarTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("scalar");
    const n = this.parseName(), r = this.parseConstDirectives();
    if (r.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: E.SCALAR_TYPE_EXTENSION,
      name: n,
      directives: r
    });
  }
  /**
   * ObjectTypeExtension :
   *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend type Name ImplementsInterfaces? Directives[Const]
   *  - extend type Name ImplementsInterfaces
   */
  parseObjectTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("type");
    const n = this.parseName(), r = this.parseImplementsInterfaces(), i = this.parseConstDirectives(), s = this.parseFieldsDefinition();
    if (r.length === 0 && i.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: E.OBJECT_TYPE_EXTENSION,
      name: n,
      interfaces: r,
      directives: i,
      fields: s
    });
  }
  /**
   * InterfaceTypeExtension :
   *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend interface Name ImplementsInterfaces? Directives[Const]
   *  - extend interface Name ImplementsInterfaces
   */
  parseInterfaceTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("interface");
    const n = this.parseName(), r = this.parseImplementsInterfaces(), i = this.parseConstDirectives(), s = this.parseFieldsDefinition();
    if (r.length === 0 && i.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: E.INTERFACE_TYPE_EXTENSION,
      name: n,
      interfaces: r,
      directives: i,
      fields: s
    });
  }
  /**
   * UnionTypeExtension :
   *   - extend union Name Directives[Const]? UnionMemberTypes
   *   - extend union Name Directives[Const]
   */
  parseUnionTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("union");
    const n = this.parseName(), r = this.parseConstDirectives(), i = this.parseUnionMemberTypes();
    if (r.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: E.UNION_TYPE_EXTENSION,
      name: n,
      directives: r,
      types: i
    });
  }
  /**
   * EnumTypeExtension :
   *   - extend enum Name Directives[Const]? EnumValuesDefinition
   *   - extend enum Name Directives[Const]
   */
  parseEnumTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("enum");
    const n = this.parseName(), r = this.parseConstDirectives(), i = this.parseEnumValuesDefinition();
    if (r.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: E.ENUM_TYPE_EXTENSION,
      name: n,
      directives: r,
      values: i
    });
  }
  /**
   * InputObjectTypeExtension :
   *   - extend input Name Directives[Const]? InputFieldsDefinition
   *   - extend input Name Directives[Const]
   */
  parseInputObjectTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("input");
    const n = this.parseName(), r = this.parseConstDirectives(), i = this.parseInputFieldsDefinition();
    if (r.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: E.INPUT_OBJECT_TYPE_EXTENSION,
      name: n,
      directives: r,
      fields: i
    });
  }
  /**
   * ```
   * DirectiveDefinition :
   *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
   * ```
   */
  parseDirectiveDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("directive"), this.expectToken(a.AT);
    const r = this.parseName(), i = this.parseArgumentDefs(), s = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const c = this.parseDirectiveLocations();
    return this.node(t, {
      kind: E.DIRECTIVE_DEFINITION,
      description: n,
      name: r,
      arguments: i,
      repeatable: s,
      locations: c
    });
  }
  /**
   * DirectiveLocations :
   *   - `|`? DirectiveLocation
   *   - DirectiveLocations | DirectiveLocation
   */
  parseDirectiveLocations() {
    return this.delimitedMany(a.PIPE, this.parseDirectiveLocation);
  }
  /*
   * DirectiveLocation :
   *   - ExecutableDirectiveLocation
   *   - TypeSystemDirectiveLocation
   *
   * ExecutableDirectiveLocation : one of
   *   `QUERY`
   *   `MUTATION`
   *   `SUBSCRIPTION`
   *   `FIELD`
   *   `FRAGMENT_DEFINITION`
   *   `FRAGMENT_SPREAD`
   *   `INLINE_FRAGMENT`
   *
   * TypeSystemDirectiveLocation : one of
   *   `SCHEMA`
   *   `SCALAR`
   *   `OBJECT`
   *   `FIELD_DEFINITION`
   *   `ARGUMENT_DEFINITION`
   *   `INTERFACE`
   *   `UNION`
   *   `ENUM`
   *   `ENUM_VALUE`
   *   `INPUT_OBJECT`
   *   `INPUT_FIELD_DEFINITION`
   */
  parseDirectiveLocation() {
    const t = this._lexer.token, n = this.parseName();
    if (Object.prototype.hasOwnProperty.call(ue, n.value))
      return n;
    throw this.unexpected(t);
  }
  // Core parsing utility functions
  /**
   * Returns a node that, if configured to do so, sets a "loc" field as a
   * location object, used to identify the place in the source that created a
   * given parsed object.
   */
  node(t, n) {
    return this._options.noLocation !== !0 && (n.loc = new st(
      t,
      this._lexer.lastToken,
      this._lexer.source
    )), n;
  }
  /**
   * Determines if the next token is of a given kind
   */
  peek(t) {
    return this._lexer.token.kind === t;
  }
  /**
   * If the next token is of the given kind, return that token after advancing the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  expectToken(t) {
    const n = this._lexer.token;
    if (n.kind === t)
      return this.advanceLexer(), n;
    throw O(
      this._lexer.source,
      n.start,
      `Expected ${ke(t)}, found ${z(n)}.`
    );
  }
  /**
   * If the next token is of the given kind, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalToken(t) {
    return this._lexer.token.kind === t ? (this.advanceLexer(), !0) : !1;
  }
  /**
   * If the next token is a given keyword, advance the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  expectKeyword(t) {
    const n = this._lexer.token;
    if (n.kind === a.NAME && n.value === t)
      this.advanceLexer();
    else
      throw O(
        this._lexer.source,
        n.start,
        `Expected "${t}", found ${z(n)}.`
      );
  }
  /**
   * If the next token is a given keyword, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalKeyword(t) {
    const n = this._lexer.token;
    return n.kind === a.NAME && n.value === t ? (this.advanceLexer(), !0) : !1;
  }
  /**
   * Helper function for creating an error when an unexpected lexed token is encountered.
   */
  unexpected(t) {
    const n = t ?? this._lexer.token;
    return O(
      this._lexer.source,
      n.start,
      `Unexpected ${z(n)}.`
    );
  }
  /**
   * Returns a possibly empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  any(t, n, r) {
    this.expectToken(t);
    const i = [];
    for (; !this.expectOptionalToken(r); )
      i.push(n.call(this));
    return i;
  }
  /**
   * Returns a list of parse nodes, determined by the parseFn.
   * It can be empty only if open token is missing otherwise it will always return non-empty list
   * that begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  optionalMany(t, n, r) {
    if (this.expectOptionalToken(t)) {
      const i = [];
      do
        i.push(n.call(this));
      while (!this.expectOptionalToken(r));
      return i;
    }
    return [];
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  many(t, n, r) {
    this.expectToken(t);
    const i = [];
    do
      i.push(n.call(this));
    while (!this.expectOptionalToken(r));
    return i;
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
   * Advances the parser to the next lex token after last item in the list.
   */
  delimitedMany(t, n) {
    this.expectOptionalToken(t);
    const r = [];
    do
      r.push(n.call(this));
    while (this.expectOptionalToken(t));
    return r;
  }
  advanceLexer() {
    const { maxTokens: t } = this._options, n = this._lexer.advance();
    if (t !== void 0 && n.kind !== a.EOF && (++this._tokenCounter, this._tokenCounter > t))
      throw O(
        this._lexer.source,
        n.start,
        `Document contains more that ${t} tokens. Parsing aborted.`
      );
  }
}
function z(e) {
  const t = e.value;
  return ke(e.kind) + (t != null ? ` "${t}"` : "");
}
function ke(e) {
  return pt(e) ? `"${e}"` : e;
}
function kt(e) {
  return `"${e.replace(Rt, Lt)}"`;
}
const Rt = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function Lt(e) {
  return Ft[e.charCodeAt(0)];
}
const Ft = [
  "\\u0000",
  "\\u0001",
  "\\u0002",
  "\\u0003",
  "\\u0004",
  "\\u0005",
  "\\u0006",
  "\\u0007",
  "\\b",
  "\\t",
  "\\n",
  "\\u000B",
  "\\f",
  "\\r",
  "\\u000E",
  "\\u000F",
  "\\u0010",
  "\\u0011",
  "\\u0012",
  "\\u0013",
  "\\u0014",
  "\\u0015",
  "\\u0016",
  "\\u0017",
  "\\u0018",
  "\\u0019",
  "\\u001A",
  "\\u001B",
  "\\u001C",
  "\\u001D",
  "\\u001E",
  "\\u001F",
  "",
  "",
  '\\"',
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 2F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 3F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 4F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\\\",
  "",
  "",
  "",
  // 5F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 6F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\u007F",
  "\\u0080",
  "\\u0081",
  "\\u0082",
  "\\u0083",
  "\\u0084",
  "\\u0085",
  "\\u0086",
  "\\u0087",
  "\\u0088",
  "\\u0089",
  "\\u008A",
  "\\u008B",
  "\\u008C",
  "\\u008D",
  "\\u008E",
  "\\u008F",
  "\\u0090",
  "\\u0091",
  "\\u0092",
  "\\u0093",
  "\\u0094",
  "\\u0095",
  "\\u0096",
  "\\u0097",
  "\\u0098",
  "\\u0099",
  "\\u009A",
  "\\u009B",
  "\\u009C",
  "\\u009D",
  "\\u009E",
  "\\u009F"
], Pt = Object.freeze({});
function Bt(e, t, n = Oe) {
  const r = /* @__PURE__ */ new Map();
  for (const S of Object.values(E))
    r.set(S, Ut(t, S));
  let i, s = Array.isArray(e), c = [e], u = -1, h = [], d = e, f, y;
  const m = [], x = [];
  do {
    u++;
    const S = u === c.length, G = S && h.length !== 0;
    if (S) {
      if (f = x.length === 0 ? void 0 : m[m.length - 1], d = y, y = x.pop(), G)
        if (s) {
          d = d.slice();
          let C = 0;
          for (const [P, H] of h) {
            const Y = P - C;
            H === null ? (d.splice(Y, 1), C++) : d[Y] = H;
          }
        } else {
          d = Object.defineProperties(
            {},
            Object.getOwnPropertyDescriptors(d)
          );
          for (const [C, P] of h)
            d[C] = P;
        }
      u = i.index, c = i.keys, h = i.edits, s = i.inArray, i = i.prev;
    } else if (y) {
      if (f = s ? u : c[u], d = y[f], d == null)
        continue;
      m.push(f);
    }
    let k;
    if (!Array.isArray(d)) {
      var T, I;
      me(d) || Q(!1, `Invalid AST Node: ${de(d)}.`);
      const C = S ? (T = r.get(d.kind)) === null || T === void 0 ? void 0 : T.leave : (I = r.get(d.kind)) === null || I === void 0 ? void 0 : I.enter;
      if (k = C == null ? void 0 : C.call(t, d, f, y, m, x), k === Pt)
        break;
      if (k === !1) {
        if (!S) {
          m.pop();
          continue;
        }
      } else if (k !== void 0 && (h.push([f, k]), !S))
        if (me(k))
          d = k;
        else {
          m.pop();
          continue;
        }
    }
    if (k === void 0 && G && h.push([f, d]), S)
      m.pop();
    else {
      var D;
      i = {
        inArray: s,
        index: u,
        keys: c,
        edits: h,
        prev: i
      }, s = Array.isArray(d), c = s ? d : (D = n[d.kind]) !== null && D !== void 0 ? D : [], u = -1, h = [], y && x.push(y), y = d;
    }
  } while (i !== void 0);
  return h.length !== 0 ? h[h.length - 1][1] : e;
}
function Ut(e, t) {
  const n = e[t];
  return typeof n == "object" ? n : typeof n == "function" ? {
    enter: n,
    leave: void 0
  } : {
    enter: e.enter,
    leave: e.leave
  };
}
function Mt(e) {
  return Bt(e, jt);
}
const Vt = 80, jt = {
  Name: {
    leave: (e) => e.value
  },
  Variable: {
    leave: (e) => "$" + e.name
  },
  // Document
  Document: {
    leave: (e) => p(e.definitions, `

`)
  },
  OperationDefinition: {
    leave(e) {
      const t = v("(", p(e.variableDefinitions, ", "), ")"), n = p(
        [
          e.operation,
          p([e.name, t]),
          p(e.directives, " ")
        ],
        " "
      );
      return (n === "query" ? "" : n + " ") + e.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: e, type: t, defaultValue: n, directives: r }) => e + ": " + t + v(" = ", n) + v(" ", p(r, " "))
  },
  SelectionSet: {
    leave: ({ selections: e }) => w(e)
  },
  Field: {
    leave({ alias: e, name: t, arguments: n, directives: r, selectionSet: i }) {
      const s = v("", e, ": ") + t;
      let c = s + v("(", p(n, ", "), ")");
      return c.length > Vt && (c = s + v(`(
`, X(p(n, `
`)), `
)`)), p([c, p(r, " "), i], " ");
    }
  },
  Argument: {
    leave: ({ name: e, value: t }) => e + ": " + t
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name: e, directives: t }) => "..." + e + v(" ", p(t, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: e, directives: t, selectionSet: n }) => p(
      [
        "...",
        v("on ", e),
        p(t, " "),
        n
      ],
      " "
    )
  },
  FragmentDefinition: {
    leave: ({ name: e, typeCondition: t, variableDefinitions: n, directives: r, selectionSet: i }) => (
      // or removed in the future.
      `fragment ${e}${v("(", p(n, ", "), ")")} on ${t} ${v("", p(r, " "), " ")}` + i
    )
  },
  // Value
  IntValue: {
    leave: ({ value: e }) => e
  },
  FloatValue: {
    leave: ({ value: e }) => e
  },
  StringValue: {
    leave: ({ value: e, block: t }) => t ? lt(e) : kt(e)
  },
  BooleanValue: {
    leave: ({ value: e }) => e ? "true" : "false"
  },
  NullValue: {
    leave: () => "null"
  },
  EnumValue: {
    leave: ({ value: e }) => e
  },
  ListValue: {
    leave: ({ values: e }) => "[" + p(e, ", ") + "]"
  },
  ObjectValue: {
    leave: ({ fields: e }) => "{" + p(e, ", ") + "}"
  },
  ObjectField: {
    leave: ({ name: e, value: t }) => e + ": " + t
  },
  // Directive
  Directive: {
    leave: ({ name: e, arguments: t }) => "@" + e + v("(", p(t, ", "), ")")
  },
  // Type
  NamedType: {
    leave: ({ name: e }) => e
  },
  ListType: {
    leave: ({ type: e }) => "[" + e + "]"
  },
  NonNullType: {
    leave: ({ type: e }) => e + "!"
  },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ description: e, directives: t, operationTypes: n }) => v("", e, `
`) + p(["schema", p(t, " "), w(n)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: e, type: t }) => e + ": " + t
  },
  ScalarTypeDefinition: {
    leave: ({ description: e, name: t, directives: n }) => v("", e, `
`) + p(["scalar", t, p(n, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ description: e, name: t, interfaces: n, directives: r, fields: i }) => v("", e, `
`) + p(
      [
        "type",
        t,
        v("implements ", p(n, " & ")),
        p(r, " "),
        w(i)
      ],
      " "
    )
  },
  FieldDefinition: {
    leave: ({ description: e, name: t, arguments: n, type: r, directives: i }) => v("", e, `
`) + t + (Ne(n) ? v(`(
`, X(p(n, `
`)), `
)`) : v("(", p(n, ", "), ")")) + ": " + r + v(" ", p(i, " "))
  },
  InputValueDefinition: {
    leave: ({ description: e, name: t, type: n, defaultValue: r, directives: i }) => v("", e, `
`) + p(
      [t + ": " + n, v("= ", r), p(i, " ")],
      " "
    )
  },
  InterfaceTypeDefinition: {
    leave: ({ description: e, name: t, interfaces: n, directives: r, fields: i }) => v("", e, `
`) + p(
      [
        "interface",
        t,
        v("implements ", p(n, " & ")),
        p(r, " "),
        w(i)
      ],
      " "
    )
  },
  UnionTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, types: r }) => v("", e, `
`) + p(
      ["union", t, p(n, " "), v("= ", p(r, " | "))],
      " "
    )
  },
  EnumTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, values: r }) => v("", e, `
`) + p(["enum", t, p(n, " "), w(r)], " ")
  },
  EnumValueDefinition: {
    leave: ({ description: e, name: t, directives: n }) => v("", e, `
`) + p([t, p(n, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, fields: r }) => v("", e, `
`) + p(["input", t, p(n, " "), w(r)], " ")
  },
  DirectiveDefinition: {
    leave: ({ description: e, name: t, arguments: n, repeatable: r, locations: i }) => v("", e, `
`) + "directive @" + t + (Ne(n) ? v(`(
`, X(p(n, `
`)), `
)`) : v("(", p(n, ", "), ")")) + (r ? " repeatable" : "") + " on " + p(i, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: e, operationTypes: t }) => p(
      ["extend schema", p(e, " "), w(t)],
      " "
    )
  },
  ScalarTypeExtension: {
    leave: ({ name: e, directives: t }) => p(["extend scalar", e, p(t, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: r }) => p(
      [
        "extend type",
        e,
        v("implements ", p(t, " & ")),
        p(n, " "),
        w(r)
      ],
      " "
    )
  },
  InterfaceTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: r }) => p(
      [
        "extend interface",
        e,
        v("implements ", p(t, " & ")),
        p(n, " "),
        w(r)
      ],
      " "
    )
  },
  UnionTypeExtension: {
    leave: ({ name: e, directives: t, types: n }) => p(
      [
        "extend union",
        e,
        p(t, " "),
        v("= ", p(n, " | "))
      ],
      " "
    )
  },
  EnumTypeExtension: {
    leave: ({ name: e, directives: t, values: n }) => p(["extend enum", e, p(t, " "), w(n)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: e, directives: t, fields: n }) => p(["extend input", e, p(t, " "), w(n)], " ")
  }
};
function p(e, t = "") {
  var n;
  return (n = e == null ? void 0 : e.filter((r) => r).join(t)) !== null && n !== void 0 ? n : "";
}
function w(e) {
  return v(`{
`, X(p(e, `
`)), `
}`);
}
function v(e, t, n = "") {
  return t != null && t !== "" ? e + t + n : "";
}
function X(e) {
  return v("  ", e.replace(/\n/g, `
  `));
}
function Ne(e) {
  var t;
  return (t = e == null ? void 0 : e.some((n) => n.includes(`
`))) !== null && t !== void 0 ? t : !1;
}
const ve = (e) => {
  var r, i;
  let t;
  const n = e.definitions.filter((s) => s.kind === "OperationDefinition");
  return n.length === 1 && (t = (i = (r = n[0]) == null ? void 0 : r.name) == null ? void 0 : i.value), t;
}, se = (e) => {
  if (typeof e == "string") {
    let n;
    try {
      const r = Ct(e);
      n = ve(r);
    } catch {
    }
    return { query: e, operationName: n };
  }
  const t = ve(e);
  return { query: Mt(e), operationName: t };
};
class q extends Error {
  constructor(t, n) {
    const r = `${q.extractMessage(t)}: ${JSON.stringify({
      response: t,
      request: n
    })}`;
    super(r), Object.setPrototypeOf(this, q.prototype), this.response = t, this.request = n, typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, q);
  }
  static extractMessage(t) {
    var n, r;
    return ((r = (n = t.errors) == null ? void 0 : n[0]) == null ? void 0 : r.message) ?? `GraphQL Error (Code: ${t.status})`;
  }
}
var he = { exports: {} };
(function(e, t) {
  var n = typeof self < "u" ? self : Be, r = function() {
    function s() {
      this.fetch = !1, this.DOMException = n.DOMException;
    }
    return s.prototype = n, new s();
  }();
  (function(s) {
    (function(c) {
      var u = {
        searchParams: "URLSearchParams" in s,
        iterable: "Symbol" in s && "iterator" in Symbol,
        blob: "FileReader" in s && "Blob" in s && function() {
          try {
            return new Blob(), !0;
          } catch {
            return !1;
          }
        }(),
        formData: "FormData" in s,
        arrayBuffer: "ArrayBuffer" in s
      };
      function h(o) {
        return o && DataView.prototype.isPrototypeOf(o);
      }
      if (u.arrayBuffer)
        var d = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ], f = ArrayBuffer.isView || function(o) {
          return o && d.indexOf(Object.prototype.toString.call(o)) > -1;
        };
      function y(o) {
        if (typeof o != "string" && (o = String(o)), /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(o))
          throw new TypeError("Invalid character in header field name");
        return o.toLowerCase();
      }
      function m(o) {
        return typeof o != "string" && (o = String(o)), o;
      }
      function x(o) {
        var l = {
          next: function() {
            var N = o.shift();
            return { done: N === void 0, value: N };
          }
        };
        return u.iterable && (l[Symbol.iterator] = function() {
          return l;
        }), l;
      }
      function T(o) {
        this.map = {}, o instanceof T ? o.forEach(function(l, N) {
          this.append(N, l);
        }, this) : Array.isArray(o) ? o.forEach(function(l) {
          this.append(l[0], l[1]);
        }, this) : o && Object.getOwnPropertyNames(o).forEach(function(l) {
          this.append(l, o[l]);
        }, this);
      }
      T.prototype.append = function(o, l) {
        o = y(o), l = m(l);
        var N = this.map[o];
        this.map[o] = N ? N + ", " + l : l;
      }, T.prototype.delete = function(o) {
        delete this.map[y(o)];
      }, T.prototype.get = function(o) {
        return o = y(o), this.has(o) ? this.map[o] : null;
      }, T.prototype.has = function(o) {
        return this.map.hasOwnProperty(y(o));
      }, T.prototype.set = function(o, l) {
        this.map[y(o)] = m(l);
      }, T.prototype.forEach = function(o, l) {
        for (var N in this.map)
          this.map.hasOwnProperty(N) && o.call(l, this.map[N], N, this);
      }, T.prototype.keys = function() {
        var o = [];
        return this.forEach(function(l, N) {
          o.push(N);
        }), x(o);
      }, T.prototype.values = function() {
        var o = [];
        return this.forEach(function(l) {
          o.push(l);
        }), x(o);
      }, T.prototype.entries = function() {
        var o = [];
        return this.forEach(function(l, N) {
          o.push([N, l]);
        }), x(o);
      }, u.iterable && (T.prototype[Symbol.iterator] = T.prototype.entries);
      function I(o) {
        if (o.bodyUsed)
          return Promise.reject(new TypeError("Already read"));
        o.bodyUsed = !0;
      }
      function D(o) {
        return new Promise(function(l, N) {
          o.onload = function() {
            l(o.result);
          }, o.onerror = function() {
            N(o.error);
          };
        });
      }
      function S(o) {
        var l = new FileReader(), N = D(l);
        return l.readAsArrayBuffer(o), N;
      }
      function G(o) {
        var l = new FileReader(), N = D(l);
        return l.readAsText(o), N;
      }
      function k(o) {
        for (var l = new Uint8Array(o), N = new Array(l.length), _ = 0; _ < l.length; _++)
          N[_] = String.fromCharCode(l[_]);
        return N.join("");
      }
      function C(o) {
        if (o.slice)
          return o.slice(0);
        var l = new Uint8Array(o.byteLength);
        return l.set(new Uint8Array(o)), l.buffer;
      }
      function P() {
        return this.bodyUsed = !1, this._initBody = function(o) {
          this._bodyInit = o, o ? typeof o == "string" ? this._bodyText = o : u.blob && Blob.prototype.isPrototypeOf(o) ? this._bodyBlob = o : u.formData && FormData.prototype.isPrototypeOf(o) ? this._bodyFormData = o : u.searchParams && URLSearchParams.prototype.isPrototypeOf(o) ? this._bodyText = o.toString() : u.arrayBuffer && u.blob && h(o) ? (this._bodyArrayBuffer = C(o.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : u.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(o) || f(o)) ? this._bodyArrayBuffer = C(o) : this._bodyText = o = Object.prototype.toString.call(o) : this._bodyText = "", this.headers.get("content-type") || (typeof o == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : u.searchParams && URLSearchParams.prototype.isPrototypeOf(o) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, u.blob && (this.blob = function() {
          var o = I(this);
          if (o)
            return o;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }, this.arrayBuffer = function() {
          return this._bodyArrayBuffer ? I(this) || Promise.resolve(this._bodyArrayBuffer) : this.blob().then(S);
        }), this.text = function() {
          var o = I(this);
          if (o)
            return o;
          if (this._bodyBlob)
            return G(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(k(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, u.formData && (this.formData = function() {
          return this.text().then(Re);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var H = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
      function Y(o) {
        var l = o.toUpperCase();
        return H.indexOf(l) > -1 ? l : o;
      }
      function L(o, l) {
        l = l || {};
        var N = l.body;
        if (o instanceof L) {
          if (o.bodyUsed)
            throw new TypeError("Already read");
          this.url = o.url, this.credentials = o.credentials, l.headers || (this.headers = new T(o.headers)), this.method = o.method, this.mode = o.mode, this.signal = o.signal, !N && o._bodyInit != null && (N = o._bodyInit, o.bodyUsed = !0);
        } else
          this.url = String(o);
        if (this.credentials = l.credentials || this.credentials || "same-origin", (l.headers || !this.headers) && (this.headers = new T(l.headers)), this.method = Y(l.method || this.method || "GET"), this.mode = l.mode || this.mode || null, this.signal = l.signal || this.signal, this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        this._initBody(N);
      }
      L.prototype.clone = function() {
        return new L(this, { body: this._bodyInit });
      };
      function Re(o) {
        var l = new FormData();
        return o.trim().split("&").forEach(function(N) {
          if (N) {
            var _ = N.split("="), b = _.shift().replace(/\+/g, " "), A = _.join("=").replace(/\+/g, " ");
            l.append(decodeURIComponent(b), decodeURIComponent(A));
          }
        }), l;
      }
      function Le(o) {
        var l = new T(), N = o.replace(/\r?\n[\t ]+/g, " ");
        return N.split(/\r?\n/).forEach(function(_) {
          var b = _.split(":"), A = b.shift().trim();
          if (A) {
            var J = b.join(":").trim();
            l.append(A, J);
          }
        }), l;
      }
      P.call(L.prototype);
      function R(o, l) {
        l || (l = {}), this.type = "default", this.status = l.status === void 0 ? 200 : l.status, this.ok = this.status >= 200 && this.status < 300, this.statusText = "statusText" in l ? l.statusText : "OK", this.headers = new T(l.headers), this.url = l.url || "", this._initBody(o);
      }
      P.call(R.prototype), R.prototype.clone = function() {
        return new R(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new T(this.headers),
          url: this.url
        });
      }, R.error = function() {
        var o = new R(null, { status: 0, statusText: "" });
        return o.type = "error", o;
      };
      var Fe = [301, 302, 303, 307, 308];
      R.redirect = function(o, l) {
        if (Fe.indexOf(l) === -1)
          throw new RangeError("Invalid status code");
        return new R(null, { status: l, headers: { location: o } });
      }, c.DOMException = s.DOMException;
      try {
        new c.DOMException();
      } catch {
        c.DOMException = function(l, N) {
          this.message = l, this.name = N;
          var _ = Error(l);
          this.stack = _.stack;
        }, c.DOMException.prototype = Object.create(Error.prototype), c.DOMException.prototype.constructor = c.DOMException;
      }
      function ne(o, l) {
        return new Promise(function(N, _) {
          var b = new L(o, l);
          if (b.signal && b.signal.aborted)
            return _(new c.DOMException("Aborted", "AbortError"));
          var A = new XMLHttpRequest();
          function J() {
            A.abort();
          }
          A.onload = function() {
            var V = {
              status: A.status,
              statusText: A.statusText,
              headers: Le(A.getAllResponseHeaders() || "")
            };
            V.url = "responseURL" in A ? A.responseURL : V.headers.get("X-Request-URL");
            var ie = "response" in A ? A.response : A.responseText;
            N(new R(ie, V));
          }, A.onerror = function() {
            _(new TypeError("Network request failed"));
          }, A.ontimeout = function() {
            _(new TypeError("Network request failed"));
          }, A.onabort = function() {
            _(new c.DOMException("Aborted", "AbortError"));
          }, A.open(b.method, b.url, !0), b.credentials === "include" ? A.withCredentials = !0 : b.credentials === "omit" && (A.withCredentials = !1), "responseType" in A && u.blob && (A.responseType = "blob"), b.headers.forEach(function(V, ie) {
            A.setRequestHeader(ie, V);
          }), b.signal && (b.signal.addEventListener("abort", J), A.onreadystatechange = function() {
            A.readyState === 4 && b.signal.removeEventListener("abort", J);
          }), A.send(typeof b._bodyInit > "u" ? null : b._bodyInit);
        });
      }
      return ne.polyfill = !0, s.fetch || (s.fetch = ne, s.Headers = T, s.Request = L, s.Response = R), c.Headers = T, c.Request = L, c.Response = R, c.fetch = ne, Object.defineProperty(c, "__esModule", { value: !0 }), c;
    })({});
  })(r), r.fetch.ponyfill = !0, delete r.fetch.polyfill;
  var i = r;
  t = i.fetch, t.default = i.fetch, t.fetch = i.fetch, t.Headers = i.Headers, t.Request = i.Request, t.Response = i.Response, e.exports = t;
})(he, he.exports);
var Z = he.exports;
const W = /* @__PURE__ */ K(Z), qt = /* @__PURE__ */ Pe({
  __proto__: null,
  default: W
}, [Z]), B = (e) => {
  let t = {};
  return e && (typeof Headers < "u" && e instanceof Headers || qt && Z.Headers && e instanceof Z.Headers ? t = Qe(e) : Array.isArray(e) ? e.forEach(([n, r]) => {
    n && r !== void 0 && (t[n] = r);
  }) : t = e), t;
}, xe = (e) => e.replace(/([\s,]|#[^\n\r]+)+/g, " ").trim(), $t = (e) => {
  if (!Array.isArray(e.query)) {
    const r = e, i = [`query=${encodeURIComponent(xe(r.query))}`];
    return e.variables && i.push(`variables=${encodeURIComponent(r.jsonSerializer.stringify(r.variables))}`), r.operationName && i.push(`operationName=${encodeURIComponent(r.operationName)}`), i.join("&");
  }
  if (typeof e.variables < "u" && !Array.isArray(e.variables))
    throw new Error("Cannot create query with given variable type, array expected");
  const t = e, n = e.query.reduce((r, i, s) => (r.push({
    query: xe(i),
    variables: t.variables ? t.jsonSerializer.stringify(t.variables[s]) : void 0
  }), r), []);
  return `query=${encodeURIComponent(t.jsonSerializer.stringify(n))}`;
}, Gt = (e) => async (t) => {
  const { url: n, query: r, variables: i, operationName: s, fetch: c, fetchOptions: u, middleware: h } = t, d = { ...t.headers };
  let f = "", y;
  e === "POST" ? (y = Je(r, i, s, u.jsonSerializer), typeof y == "string" && (d["Content-Type"] = "application/json")) : f = $t({
    query: r,
    variables: i,
    operationName: s,
    jsonSerializer: u.jsonSerializer ?? pe
  });
  const m = {
    method: e,
    headers: d,
    body: y,
    ...u
  };
  let x = n, T = m;
  if (h) {
    const I = await Promise.resolve(h({ ...m, url: n, operationName: s, variables: i })), { url: D, ...S } = I;
    x = D, T = S;
  }
  return f && (x = `${x}?${f}`), await c(x, T);
};
class Ht {
  constructor(t, n = {}) {
    this.url = t, this.requestConfig = n, this.rawRequest = async (...r) => {
      const [i, s, c] = r, u = We(i, s, c), { headers: h, fetch: d = W, method: f = "POST", requestMiddleware: y, responseMiddleware: m, ...x } = this.requestConfig, { url: T } = this;
      u.signal !== void 0 && (x.signal = u.signal);
      const { operationName: I } = se(u.query);
      return oe({
        url: T,
        query: u.query,
        variables: u.variables,
        headers: {
          ...B(ae(h)),
          ...B(u.requestHeaders)
        },
        operationName: I,
        fetch: d,
        method: f,
        fetchOptions: x,
        middleware: y
      }).then((D) => (m && m(D), D)).catch((D) => {
        throw m && m(D), D;
      });
    };
  }
  async request(t, ...n) {
    const [r, i] = n, s = Xe(t, r, i), { headers: c, fetch: u = W, method: h = "POST", requestMiddleware: d, responseMiddleware: f, ...y } = this.requestConfig, { url: m } = this;
    s.signal !== void 0 && (y.signal = s.signal);
    const { query: x, operationName: T } = se(s.document);
    return oe({
      url: m,
      query: x,
      variables: s.variables,
      headers: {
        ...B(ae(c)),
        ...B(s.requestHeaders)
      },
      operationName: T,
      fetch: u,
      method: h,
      fetchOptions: y,
      middleware: d
    }).then((I) => (f && f(I), I.data)).catch((I) => {
      throw f && f(I), I;
    });
  }
  // prettier-ignore
  batchRequests(t, n) {
    const r = Ze(t, n), { headers: i, ...s } = this.requestConfig;
    r.signal !== void 0 && (s.signal = r.signal);
    const c = r.documents.map(({ document: h }) => se(h).query), u = r.documents.map(({ variables: h }) => h);
    return oe({
      url: this.url,
      query: c,
      // @ts-expect-error TODO reconcile batch variables into system.
      variables: u,
      headers: {
        ...B(ae(i)),
        ...B(r.requestHeaders)
      },
      operationName: void 0,
      fetch: this.requestConfig.fetch ?? W,
      method: this.requestConfig.method || "POST",
      fetchOptions: s,
      middleware: this.requestConfig.requestMiddleware
    }).then((h) => (this.requestConfig.responseMiddleware && this.requestConfig.responseMiddleware(h), h.data)).catch((h) => {
      throw this.requestConfig.responseMiddleware && this.requestConfig.responseMiddleware(h), h;
    });
  }
  setHeaders(t) {
    return this.requestConfig.headers = t, this;
  }
  /**
   * Attach a header to the client. All subsequent requests will have this header.
   */
  setHeader(t, n) {
    const { headers: r } = this.requestConfig;
    return r ? r[t] = n : this.requestConfig.headers = { [t]: n }, this;
  }
  /**
   * Change the client endpoint. All subsequent requests will send to this endpoint.
   */
  setEndpoint(t) {
    return this.url = t, this;
  }
}
const oe = async (e) => {
  const { query: t, variables: n, fetchOptions: r } = e, i = Gt(ze(e.method ?? "post")), s = Array.isArray(e.query), c = await i(e), u = await Jt(c, r.jsonSerializer ?? pe), h = Array.isArray(u) ? !u.some(({ data: f }) => !f) : !!u.data, d = Array.isArray(u) || !u.errors || Array.isArray(u.errors) && !u.errors.length || r.errorPolicy === "all" || r.errorPolicy === "ignore";
  if (c.ok && d && h) {
    const { errors: f, ...y } = (Array.isArray(u), u), m = r.errorPolicy === "ignore" ? y : u;
    return {
      ...s ? { data: m } : m,
      headers: c.headers,
      status: c.status
    };
  } else {
    const f = typeof u == "string" ? {
      error: u
    } : u;
    throw new q(
      // @ts-expect-error TODO
      { ...f, status: c.status, headers: c.headers },
      { query: t, variables: n }
    );
  }
};
async function Yt(e, t, ...n) {
  const r = Ke(e, t, ...n);
  return new Ht(r.url).request({
    ...r
  });
}
const Jt = async (e, t) => {
  let n;
  return e.headers.forEach((r, i) => {
    i.toLowerCase() === "content-type" && (n = r);
  }), n && (n.toLowerCase().startsWith("application/json") || n.toLowerCase().startsWith("application/graphql+json") || n.toLowerCase().startsWith("application/graphql-response+json")) ? t.parse(await e.text()) : e.text();
}, ae = (e) => typeof e == "function" ? e() : e, zt = (e, ...t) => e.reduce((n, r, i) => `${n}${r}${i in t ? t[i] : ""}`, ""), Qt = zt`
	{
		allFilms {
			films {
				title
				director
				releaseDate
				speciesConnection {
					species {
						name
						classification
						homeworld {
							name
						}
					}
				}
			}
		}
	}
`, Xt = async () => await Yt("https://swapi-graphql.netlify.app/.netlify/functions/index", Qt);
export {
  Xt as Query
};
//# sourceMappingURL=graphql-client.js.map
