function xi(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const s in r)
        if (s !== "default" && !(s in e)) {
          const o = Object.getOwnPropertyDescriptor(r, s);
          o && Object.defineProperty(e, s, o.get ? o : {
            enumerable: !0,
            get: () => r[s]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
const pr = JSON, Ai = (e) => e.toUpperCase(), Di = (e) => {
  const t = {};
  return e.forEach((n, r) => {
    t[r] = n;
  }), t;
}, Ri = (e, t, n) => e.document ? e : {
  document: e,
  variables: t,
  requestHeaders: n,
  signal: void 0
}, Pi = (e, t, n) => e.query ? e : {
  query: e,
  variables: t,
  requestHeaders: n,
  signal: void 0
}, Ci = (e, t) => e.documents ? e : {
  documents: e,
  requestHeaders: t,
  signal: void 0
}, ki = (e, t, ...n) => {
  const [r, s] = n;
  return e.document ? e : {
    url: e,
    document: t,
    variables: r,
    requestHeaders: s,
    signal: void 0
  };
};
function Zt(e, t) {
  if (!!!e)
    throw new Error(t);
}
function $i(e) {
  return typeof e == "object" && e !== null;
}
function Vi(e, t) {
  if (!!!e)
    throw new Error(
      t ?? "Unexpected invariant triggered."
    );
}
const Li = /\r\n|[\n\r]/g;
function Gn(e, t) {
  let n = 0, r = 1;
  for (const s of e.body.matchAll(Li)) {
    if (typeof s.index == "number" || Vi(!1), s.index >= t)
      break;
    n = s.index + s[0].length, r += 1;
  }
  return {
    line: r,
    column: t + 1 - n
  };
}
function Mi(e) {
  return Us(
    e.source,
    Gn(e.source, e.start)
  );
}
function Us(e, t) {
  const n = e.locationOffset.column - 1, r = "".padStart(n) + e.body, s = t.line - 1, o = e.locationOffset.line - 1, i = t.line + o, a = t.line === 1 ? n : 0, c = t.column + a, l = `${e.name}:${i}:${c}
`, f = r.split(/\r\n|[\n\r]/g), u = f[s];
  if (u.length > 120) {
    const d = Math.floor(c / 80), p = c % 80, m = [];
    for (let y = 0; y < u.length; y += 80)
      m.push(u.slice(y, y + 80));
    return l + Hr([
      [`${i} |`, m[0]],
      ...m.slice(1, d + 1).map((y) => ["|", y]),
      ["|", "^".padStart(p)],
      ["|", m[d + 1]]
    ]);
  }
  return l + Hr([
    // Lines specified like this: ["prefix", "string"],
    [`${i - 1} |`, f[s - 1]],
    [`${i} |`, u],
    ["|", "^".padStart(c)],
    [`${i + 1} |`, f[s + 1]]
  ]);
}
function Hr(e) {
  const t = e.filter(([r, s]) => s !== void 0), n = Math.max(...t.map(([r]) => r.length));
  return t.map(([r, s]) => r.padStart(n) + (s ? " " + s : "")).join(`
`);
}
function ji(e) {
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
class hr extends Error {
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
    var r, s, o;
    const { nodes: i, source: a, positions: c, path: l, originalError: f, extensions: u } = ji(n);
    super(t), this.name = "GraphQLError", this.path = l ?? void 0, this.originalError = f ?? void 0, this.nodes = Gr(
      Array.isArray(i) ? i : i ? [i] : void 0
    );
    const d = Gr(
      (r = this.nodes) === null || r === void 0 ? void 0 : r.map((m) => m.loc).filter((m) => m != null)
    );
    this.source = a ?? (d == null || (s = d[0]) === null || s === void 0 ? void 0 : s.source), this.positions = c ?? (d == null ? void 0 : d.map((m) => m.start)), this.locations = c && a ? c.map((m) => Gn(a, m)) : d == null ? void 0 : d.map((m) => Gn(m.source, m.start));
    const p = $i(
      f == null ? void 0 : f.extensions
    ) ? f == null ? void 0 : f.extensions : void 0;
    this.extensions = (o = u ?? p) !== null && o !== void 0 ? o : /* @__PURE__ */ Object.create(null), Object.defineProperties(this, {
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
    }) : Error.captureStackTrace ? Error.captureStackTrace(this, hr) : Object.defineProperty(this, "stack", {
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

` + Mi(n.loc));
    else if (this.source && this.locations)
      for (const n of this.locations)
        t += `

` + Us(this.source, n);
    return t;
  }
  toJSON() {
    const t = {
      message: this.message
    };
    return this.locations != null && (t.locations = this.locations), this.path != null && (t.path = this.path), this.extensions != null && Object.keys(this.extensions).length > 0 && (t.extensions = this.extensions), t;
  }
}
function Gr(e) {
  return e === void 0 || e.length === 0 ? void 0 : e;
}
function ne(e, t, n) {
  return new hr(`Syntax Error: ${n}`, {
    source: e,
    positions: [t]
  });
}
class Fi {
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
class Bs {
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
  constructor(t, n, r, s, o, i) {
    this.kind = t, this.start = n, this.end = r, this.line = s, this.column = o, this.value = i, this.prev = null, this.next = null;
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
const qs = {
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
}, Ui = new Set(Object.keys(qs));
function zr(e) {
  const t = e == null ? void 0 : e.kind;
  return typeof t == "string" && Ui.has(t);
}
var ut;
(function(e) {
  e.QUERY = "query", e.MUTATION = "mutation", e.SUBSCRIPTION = "subscription";
})(ut || (ut = {}));
var zn;
(function(e) {
  e.QUERY = "QUERY", e.MUTATION = "MUTATION", e.SUBSCRIPTION = "SUBSCRIPTION", e.FIELD = "FIELD", e.FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION", e.FRAGMENT_SPREAD = "FRAGMENT_SPREAD", e.INLINE_FRAGMENT = "INLINE_FRAGMENT", e.VARIABLE_DEFINITION = "VARIABLE_DEFINITION", e.SCHEMA = "SCHEMA", e.SCALAR = "SCALAR", e.OBJECT = "OBJECT", e.FIELD_DEFINITION = "FIELD_DEFINITION", e.ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION", e.INTERFACE = "INTERFACE", e.UNION = "UNION", e.ENUM = "ENUM", e.ENUM_VALUE = "ENUM_VALUE", e.INPUT_OBJECT = "INPUT_OBJECT", e.INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION";
})(zn || (zn = {}));
var R;
(function(e) {
  e.NAME = "Name", e.DOCUMENT = "Document", e.OPERATION_DEFINITION = "OperationDefinition", e.VARIABLE_DEFINITION = "VariableDefinition", e.SELECTION_SET = "SelectionSet", e.FIELD = "Field", e.ARGUMENT = "Argument", e.FRAGMENT_SPREAD = "FragmentSpread", e.INLINE_FRAGMENT = "InlineFragment", e.FRAGMENT_DEFINITION = "FragmentDefinition", e.VARIABLE = "Variable", e.INT = "IntValue", e.FLOAT = "FloatValue", e.STRING = "StringValue", e.BOOLEAN = "BooleanValue", e.NULL = "NullValue", e.ENUM = "EnumValue", e.LIST = "ListValue", e.OBJECT = "ObjectValue", e.OBJECT_FIELD = "ObjectField", e.DIRECTIVE = "Directive", e.NAMED_TYPE = "NamedType", e.LIST_TYPE = "ListType", e.NON_NULL_TYPE = "NonNullType", e.SCHEMA_DEFINITION = "SchemaDefinition", e.OPERATION_TYPE_DEFINITION = "OperationTypeDefinition", e.SCALAR_TYPE_DEFINITION = "ScalarTypeDefinition", e.OBJECT_TYPE_DEFINITION = "ObjectTypeDefinition", e.FIELD_DEFINITION = "FieldDefinition", e.INPUT_VALUE_DEFINITION = "InputValueDefinition", e.INTERFACE_TYPE_DEFINITION = "InterfaceTypeDefinition", e.UNION_TYPE_DEFINITION = "UnionTypeDefinition", e.ENUM_TYPE_DEFINITION = "EnumTypeDefinition", e.ENUM_VALUE_DEFINITION = "EnumValueDefinition", e.INPUT_OBJECT_TYPE_DEFINITION = "InputObjectTypeDefinition", e.DIRECTIVE_DEFINITION = "DirectiveDefinition", e.SCHEMA_EXTENSION = "SchemaExtension", e.SCALAR_TYPE_EXTENSION = "ScalarTypeExtension", e.OBJECT_TYPE_EXTENSION = "ObjectTypeExtension", e.INTERFACE_TYPE_EXTENSION = "InterfaceTypeExtension", e.UNION_TYPE_EXTENSION = "UnionTypeExtension", e.ENUM_TYPE_EXTENSION = "EnumTypeExtension", e.INPUT_OBJECT_TYPE_EXTENSION = "InputObjectTypeExtension";
})(R || (R = {}));
function Wn(e) {
  return e === 9 || e === 32;
}
function Ct(e) {
  return e >= 48 && e <= 57;
}
function Hs(e) {
  return e >= 97 && e <= 122 || // A-Z
  e >= 65 && e <= 90;
}
function Gs(e) {
  return Hs(e) || e === 95;
}
function Bi(e) {
  return Hs(e) || Ct(e) || e === 95;
}
function qi(e) {
  var t;
  let n = Number.MAX_SAFE_INTEGER, r = null, s = -1;
  for (let i = 0; i < e.length; ++i) {
    var o;
    const a = e[i], c = Hi(a);
    c !== a.length && (r = (o = r) !== null && o !== void 0 ? o : i, s = i, i !== 0 && c < n && (n = c));
  }
  return e.map((i, a) => a === 0 ? i : i.slice(n)).slice(
    (t = r) !== null && t !== void 0 ? t : 0,
    s + 1
  );
}
function Hi(e) {
  let t = 0;
  for (; t < e.length && Wn(e.charCodeAt(t)); )
    ++t;
  return t;
}
function Gi(e, t) {
  const n = e.replace(/"""/g, '\\"""'), r = n.split(/\r\n|[\n\r]/g), s = r.length === 1, o = r.length > 1 && r.slice(1).every((p) => p.length === 0 || Wn(p.charCodeAt(0))), i = n.endsWith('\\"""'), a = e.endsWith('"') && !i, c = e.endsWith("\\"), l = a || c, f = !(t != null && t.minimize) && // add leading and trailing new lines only if it improves readability
  (!s || e.length > 70 || l || o || i);
  let u = "";
  const d = s && Wn(e.charCodeAt(0));
  return (f && !d || o) && (u += `
`), u += n, (f || l) && (u += `
`), '"""' + u + '"""';
}
var v;
(function(e) {
  e.SOF = "<SOF>", e.EOF = "<EOF>", e.BANG = "!", e.DOLLAR = "$", e.AMP = "&", e.PAREN_L = "(", e.PAREN_R = ")", e.SPREAD = "...", e.COLON = ":", e.EQUALS = "=", e.AT = "@", e.BRACKET_L = "[", e.BRACKET_R = "]", e.BRACE_L = "{", e.PIPE = "|", e.BRACE_R = "}", e.NAME = "Name", e.INT = "Int", e.FLOAT = "Float", e.STRING = "String", e.BLOCK_STRING = "BlockString", e.COMMENT = "Comment";
})(v || (v = {}));
class zi {
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
    const n = new Bs(v.SOF, 0, 0, 0, 0);
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
    if (t.kind !== v.EOF)
      do
        if (t.next)
          t = t.next;
        else {
          const n = Ji(this, t.end);
          t.next = n, n.prev = t, t = n;
        }
      while (t.kind === v.COMMENT);
    return t;
  }
}
function Wi(e) {
  return e === v.BANG || e === v.DOLLAR || e === v.AMP || e === v.PAREN_L || e === v.PAREN_R || e === v.SPREAD || e === v.COLON || e === v.EQUALS || e === v.AT || e === v.BRACKET_L || e === v.BRACKET_R || e === v.BRACE_L || e === v.PIPE || e === v.BRACE_R;
}
function yt(e) {
  return e >= 0 && e <= 55295 || e >= 57344 && e <= 1114111;
}
function _n(e, t) {
  return zs(e.charCodeAt(t)) && Ws(e.charCodeAt(t + 1));
}
function zs(e) {
  return e >= 55296 && e <= 56319;
}
function Ws(e) {
  return e >= 56320 && e <= 57343;
}
function tt(e, t) {
  const n = e.source.body.codePointAt(t);
  if (n === void 0)
    return v.EOF;
  if (n >= 32 && n <= 126) {
    const r = String.fromCodePoint(n);
    return r === '"' ? `'"'` : `"${r}"`;
  }
  return "U+" + n.toString(16).toUpperCase().padStart(4, "0");
}
function Y(e, t, n, r, s) {
  const o = e.line, i = 1 + n - e.lineStart;
  return new Bs(t, n, r, o, i, s);
}
function Ji(e, t) {
  const n = e.source.body, r = n.length;
  let s = t;
  for (; s < r; ) {
    const o = n.charCodeAt(s);
    switch (o) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++s;
        continue;
      case 10:
        ++s, ++e.line, e.lineStart = s;
        continue;
      case 13:
        n.charCodeAt(s + 1) === 10 ? s += 2 : ++s, ++e.line, e.lineStart = s;
        continue;
      case 35:
        return Yi(e, s);
      case 33:
        return Y(e, v.BANG, s, s + 1);
      case 36:
        return Y(e, v.DOLLAR, s, s + 1);
      case 38:
        return Y(e, v.AMP, s, s + 1);
      case 40:
        return Y(e, v.PAREN_L, s, s + 1);
      case 41:
        return Y(e, v.PAREN_R, s, s + 1);
      case 46:
        if (n.charCodeAt(s + 1) === 46 && n.charCodeAt(s + 2) === 46)
          return Y(e, v.SPREAD, s, s + 3);
        break;
      case 58:
        return Y(e, v.COLON, s, s + 1);
      case 61:
        return Y(e, v.EQUALS, s, s + 1);
      case 64:
        return Y(e, v.AT, s, s + 1);
      case 91:
        return Y(e, v.BRACKET_L, s, s + 1);
      case 93:
        return Y(e, v.BRACKET_R, s, s + 1);
      case 123:
        return Y(e, v.BRACE_L, s, s + 1);
      case 124:
        return Y(e, v.PIPE, s, s + 1);
      case 125:
        return Y(e, v.BRACE_R, s, s + 1);
      case 34:
        return n.charCodeAt(s + 1) === 34 && n.charCodeAt(s + 2) === 34 ? ta(e, s) : Ki(e, s);
    }
    if (Ct(o) || o === 45)
      return Qi(e, s, o);
    if (Gs(o))
      return na(e, s);
    throw ne(
      e.source,
      s,
      o === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : yt(o) || _n(n, s) ? `Unexpected character: ${tt(e, s)}.` : `Invalid character: ${tt(e, s)}.`
    );
  }
  return Y(e, v.EOF, r, r);
}
function Yi(e, t) {
  const n = e.source.body, r = n.length;
  let s = t + 1;
  for (; s < r; ) {
    const o = n.charCodeAt(s);
    if (o === 10 || o === 13)
      break;
    if (yt(o))
      ++s;
    else if (_n(n, s))
      s += 2;
    else
      break;
  }
  return Y(
    e,
    v.COMMENT,
    t,
    s,
    n.slice(t + 1, s)
  );
}
function Qi(e, t, n) {
  const r = e.source.body;
  let s = t, o = n, i = !1;
  if (o === 45 && (o = r.charCodeAt(++s)), o === 48) {
    if (o = r.charCodeAt(++s), Ct(o))
      throw ne(
        e.source,
        s,
        `Invalid number, unexpected digit after 0: ${tt(
          e,
          s
        )}.`
      );
  } else
    s = Dn(e, s, o), o = r.charCodeAt(s);
  if (o === 46 && (i = !0, o = r.charCodeAt(++s), s = Dn(e, s, o), o = r.charCodeAt(s)), (o === 69 || o === 101) && (i = !0, o = r.charCodeAt(++s), (o === 43 || o === 45) && (o = r.charCodeAt(++s)), s = Dn(e, s, o), o = r.charCodeAt(s)), o === 46 || Gs(o))
    throw ne(
      e.source,
      s,
      `Invalid number, expected digit but got: ${tt(
        e,
        s
      )}.`
    );
  return Y(
    e,
    i ? v.FLOAT : v.INT,
    t,
    s,
    r.slice(t, s)
  );
}
function Dn(e, t, n) {
  if (!Ct(n))
    throw ne(
      e.source,
      t,
      `Invalid number, expected digit but got: ${tt(
        e,
        t
      )}.`
    );
  const r = e.source.body;
  let s = t + 1;
  for (; Ct(r.charCodeAt(s)); )
    ++s;
  return s;
}
function Ki(e, t) {
  const n = e.source.body, r = n.length;
  let s = t + 1, o = s, i = "";
  for (; s < r; ) {
    const a = n.charCodeAt(s);
    if (a === 34)
      return i += n.slice(o, s), Y(e, v.STRING, t, s + 1, i);
    if (a === 92) {
      i += n.slice(o, s);
      const c = n.charCodeAt(s + 1) === 117 ? n.charCodeAt(s + 2) === 123 ? Xi(e, s) : Zi(e, s) : ea(e, s);
      i += c.value, s += c.size, o = s;
      continue;
    }
    if (a === 10 || a === 13)
      break;
    if (yt(a))
      ++s;
    else if (_n(n, s))
      s += 2;
    else
      throw ne(
        e.source,
        s,
        `Invalid character within String: ${tt(
          e,
          s
        )}.`
      );
  }
  throw ne(e.source, s, "Unterminated string.");
}
function Xi(e, t) {
  const n = e.source.body;
  let r = 0, s = 3;
  for (; s < 12; ) {
    const o = n.charCodeAt(t + s++);
    if (o === 125) {
      if (s < 5 || !yt(r))
        break;
      return {
        value: String.fromCodePoint(r),
        size: s
      };
    }
    if (r = r << 4 | wt(o), r < 0)
      break;
  }
  throw ne(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${n.slice(
      t,
      t + s
    )}".`
  );
}
function Zi(e, t) {
  const n = e.source.body, r = Wr(n, t + 2);
  if (yt(r))
    return {
      value: String.fromCodePoint(r),
      size: 6
    };
  if (zs(r) && n.charCodeAt(t + 6) === 92 && n.charCodeAt(t + 7) === 117) {
    const s = Wr(n, t + 8);
    if (Ws(s))
      return {
        value: String.fromCodePoint(r, s),
        size: 12
      };
  }
  throw ne(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${n.slice(t, t + 6)}".`
  );
}
function Wr(e, t) {
  return wt(e.charCodeAt(t)) << 12 | wt(e.charCodeAt(t + 1)) << 8 | wt(e.charCodeAt(t + 2)) << 4 | wt(e.charCodeAt(t + 3));
}
function wt(e) {
  return e >= 48 && e <= 57 ? e - 48 : e >= 65 && e <= 70 ? e - 55 : e >= 97 && e <= 102 ? e - 87 : -1;
}
function ea(e, t) {
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
  throw ne(
    e.source,
    t,
    `Invalid character escape sequence: "${n.slice(
      t,
      t + 2
    )}".`
  );
}
function ta(e, t) {
  const n = e.source.body, r = n.length;
  let s = e.lineStart, o = t + 3, i = o, a = "";
  const c = [];
  for (; o < r; ) {
    const l = n.charCodeAt(o);
    if (l === 34 && n.charCodeAt(o + 1) === 34 && n.charCodeAt(o + 2) === 34) {
      a += n.slice(i, o), c.push(a);
      const f = Y(
        e,
        v.BLOCK_STRING,
        t,
        o + 3,
        // Return a string of the lines joined with U+000A.
        qi(c).join(`
`)
      );
      return e.line += c.length - 1, e.lineStart = s, f;
    }
    if (l === 92 && n.charCodeAt(o + 1) === 34 && n.charCodeAt(o + 2) === 34 && n.charCodeAt(o + 3) === 34) {
      a += n.slice(i, o), i = o + 1, o += 4;
      continue;
    }
    if (l === 10 || l === 13) {
      a += n.slice(i, o), c.push(a), l === 13 && n.charCodeAt(o + 1) === 10 ? o += 2 : ++o, a = "", i = o, s = o;
      continue;
    }
    if (yt(l))
      ++o;
    else if (_n(n, o))
      o += 2;
    else
      throw ne(
        e.source,
        o,
        `Invalid character within String: ${tt(
          e,
          o
        )}.`
      );
  }
  throw ne(e.source, o, "Unterminated string.");
}
function na(e, t) {
  const n = e.source.body, r = n.length;
  let s = t + 1;
  for (; s < r; ) {
    const o = n.charCodeAt(s);
    if (Bi(o))
      ++s;
    else
      break;
  }
  return Y(
    e,
    v.NAME,
    t,
    s,
    n.slice(t, s)
  );
}
const ra = 10, Js = 2;
function mr(e) {
  return bn(e, []);
}
function bn(e, t) {
  switch (typeof e) {
    case "string":
      return JSON.stringify(e);
    case "function":
      return e.name ? `[function ${e.name}]` : "[function]";
    case "object":
      return sa(e, t);
    default:
      return String(e);
  }
}
function sa(e, t) {
  if (e === null)
    return "null";
  if (t.includes(e))
    return "[Circular]";
  const n = [...t, e];
  if (oa(e)) {
    const r = e.toJSON();
    if (r !== e)
      return typeof r == "string" ? r : bn(r, n);
  } else if (Array.isArray(e))
    return aa(e, n);
  return ia(e, n);
}
function oa(e) {
  return typeof e.toJSON == "function";
}
function ia(e, t) {
  const n = Object.entries(e);
  return n.length === 0 ? "{}" : t.length > Js ? "[" + ca(e) + "]" : "{ " + n.map(
    ([s, o]) => s + ": " + bn(o, t)
  ).join(", ") + " }";
}
function aa(e, t) {
  if (e.length === 0)
    return "[]";
  if (t.length > Js)
    return "[Array]";
  const n = Math.min(ra, e.length), r = e.length - n, s = [];
  for (let o = 0; o < n; ++o)
    s.push(bn(e[o], t));
  return r === 1 ? s.push("... 1 more item") : r > 1 && s.push(`... ${r} more items`), "[" + s.join(", ") + "]";
}
function ca(e) {
  const t = Object.prototype.toString.call(e).replace(/^\[object /, "").replace(/]$/, "");
  if (t === "Object" && typeof e.constructor == "function") {
    const n = e.constructor.name;
    if (typeof n == "string" && n !== "")
      return n;
  }
  return t;
}
const ua = (
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
      const s = n.prototype[Symbol.toStringTag], o = (
        // We still need to support constructor's name to detect conflicts with older versions of this library.
        Symbol.toStringTag in t ? t[Symbol.toStringTag] : (r = t.constructor) === null || r === void 0 ? void 0 : r.name
      );
      if (s === o) {
        const i = mr(t);
        throw new Error(`Cannot use ${s} "${i}" from another module or realm.

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
class Ys {
  constructor(t, n = "GraphQL request", r = {
    line: 1,
    column: 1
  }) {
    typeof t == "string" || Zt(!1, `Body must be a string. Received: ${mr(t)}.`), this.body = t, this.name = n, this.locationOffset = r, this.locationOffset.line > 0 || Zt(
      !1,
      "line in locationOffset is 1-indexed and must be positive."
    ), this.locationOffset.column > 0 || Zt(
      !1,
      "column in locationOffset is 1-indexed and must be positive."
    );
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
}
function la(e) {
  return ua(e, Ys);
}
function fa(e, t) {
  return new da(e, t).parseDocument();
}
class da {
  constructor(t, n = {}) {
    const r = la(t) ? t : new Ys(t);
    this._lexer = new zi(r), this._options = n, this._tokenCounter = 0;
  }
  /**
   * Converts a name lex token into a name parse node.
   */
  parseName() {
    const t = this.expectToken(v.NAME);
    return this.node(t, {
      kind: R.NAME,
      value: t.value
    });
  }
  // Implements the parsing rules in the Document section.
  /**
   * Document : Definition+
   */
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: R.DOCUMENT,
      definitions: this.many(
        v.SOF,
        this.parseDefinition,
        v.EOF
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
    if (this.peek(v.BRACE_L))
      return this.parseOperationDefinition();
    const t = this.peekDescription(), n = t ? this._lexer.lookahead() : this._lexer.token;
    if (n.kind === v.NAME) {
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
        throw ne(
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
    if (this.peek(v.BRACE_L))
      return this.node(t, {
        kind: R.OPERATION_DEFINITION,
        operation: ut.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet()
      });
    const n = this.parseOperationType();
    let r;
    return this.peek(v.NAME) && (r = this.parseName()), this.node(t, {
      kind: R.OPERATION_DEFINITION,
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
    const t = this.expectToken(v.NAME);
    switch (t.value) {
      case "query":
        return ut.QUERY;
      case "mutation":
        return ut.MUTATION;
      case "subscription":
        return ut.SUBSCRIPTION;
    }
    throw this.unexpected(t);
  }
  /**
   * VariableDefinitions : ( VariableDefinition+ )
   */
  parseVariableDefinitions() {
    return this.optionalMany(
      v.PAREN_L,
      this.parseVariableDefinition,
      v.PAREN_R
    );
  }
  /**
   * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
   */
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: R.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(v.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(v.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives()
    });
  }
  /**
   * Variable : $ Name
   */
  parseVariable() {
    const t = this._lexer.token;
    return this.expectToken(v.DOLLAR), this.node(t, {
      kind: R.VARIABLE,
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
      kind: R.SELECTION_SET,
      selections: this.many(
        v.BRACE_L,
        this.parseSelection,
        v.BRACE_R
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
    return this.peek(v.SPREAD) ? this.parseFragment() : this.parseField();
  }
  /**
   * Field : Alias? Name Arguments? Directives? SelectionSet?
   *
   * Alias : Name :
   */
  parseField() {
    const t = this._lexer.token, n = this.parseName();
    let r, s;
    return this.expectOptionalToken(v.COLON) ? (r = n, s = this.parseName()) : s = n, this.node(t, {
      kind: R.FIELD,
      alias: r,
      name: s,
      arguments: this.parseArguments(!1),
      directives: this.parseDirectives(!1),
      selectionSet: this.peek(v.BRACE_L) ? this.parseSelectionSet() : void 0
    });
  }
  /**
   * Arguments[Const] : ( Argument[?Const]+ )
   */
  parseArguments(t) {
    const n = t ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(v.PAREN_L, n, v.PAREN_R);
  }
  /**
   * Argument[Const] : Name : Value[?Const]
   */
  parseArgument(t = !1) {
    const n = this._lexer.token, r = this.parseName();
    return this.expectToken(v.COLON), this.node(n, {
      kind: R.ARGUMENT,
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
    this.expectToken(v.SPREAD);
    const n = this.expectOptionalKeyword("on");
    return !n && this.peek(v.NAME) ? this.node(t, {
      kind: R.FRAGMENT_SPREAD,
      name: this.parseFragmentName(),
      directives: this.parseDirectives(!1)
    }) : this.node(t, {
      kind: R.INLINE_FRAGMENT,
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
      kind: R.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      variableDefinitions: this.parseVariableDefinitions(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    }) : this.node(t, {
      kind: R.FRAGMENT_DEFINITION,
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
      case v.BRACKET_L:
        return this.parseList(t);
      case v.BRACE_L:
        return this.parseObject(t);
      case v.INT:
        return this.advanceLexer(), this.node(n, {
          kind: R.INT,
          value: n.value
        });
      case v.FLOAT:
        return this.advanceLexer(), this.node(n, {
          kind: R.FLOAT,
          value: n.value
        });
      case v.STRING:
      case v.BLOCK_STRING:
        return this.parseStringLiteral();
      case v.NAME:
        switch (this.advanceLexer(), n.value) {
          case "true":
            return this.node(n, {
              kind: R.BOOLEAN,
              value: !0
            });
          case "false":
            return this.node(n, {
              kind: R.BOOLEAN,
              value: !1
            });
          case "null":
            return this.node(n, {
              kind: R.NULL
            });
          default:
            return this.node(n, {
              kind: R.ENUM,
              value: n.value
            });
        }
      case v.DOLLAR:
        if (t)
          if (this.expectToken(v.DOLLAR), this._lexer.token.kind === v.NAME) {
            const r = this._lexer.token.value;
            throw ne(
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
      kind: R.STRING,
      value: t.value,
      block: t.kind === v.BLOCK_STRING
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
      kind: R.LIST,
      values: this.any(v.BRACKET_L, n, v.BRACKET_R)
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
      kind: R.OBJECT,
      fields: this.any(v.BRACE_L, n, v.BRACE_R)
    });
  }
  /**
   * ObjectField[Const] : Name : Value[?Const]
   */
  parseObjectField(t) {
    const n = this._lexer.token, r = this.parseName();
    return this.expectToken(v.COLON), this.node(n, {
      kind: R.OBJECT_FIELD,
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
    for (; this.peek(v.AT); )
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
    return this.expectToken(v.AT), this.node(n, {
      kind: R.DIRECTIVE,
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
    if (this.expectOptionalToken(v.BRACKET_L)) {
      const r = this.parseTypeReference();
      this.expectToken(v.BRACKET_R), n = this.node(t, {
        kind: R.LIST_TYPE,
        type: r
      });
    } else
      n = this.parseNamedType();
    return this.expectOptionalToken(v.BANG) ? this.node(t, {
      kind: R.NON_NULL_TYPE,
      type: n
    }) : n;
  }
  /**
   * NamedType : Name
   */
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: R.NAMED_TYPE,
      name: this.parseName()
    });
  }
  // Implements the parsing rules in the Type Definition section.
  peekDescription() {
    return this.peek(v.STRING) || this.peek(v.BLOCK_STRING);
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
    const r = this.parseConstDirectives(), s = this.many(
      v.BRACE_L,
      this.parseOperationTypeDefinition,
      v.BRACE_R
    );
    return this.node(t, {
      kind: R.SCHEMA_DEFINITION,
      description: n,
      directives: r,
      operationTypes: s
    });
  }
  /**
   * OperationTypeDefinition : OperationType : NamedType
   */
  parseOperationTypeDefinition() {
    const t = this._lexer.token, n = this.parseOperationType();
    this.expectToken(v.COLON);
    const r = this.parseNamedType();
    return this.node(t, {
      kind: R.OPERATION_TYPE_DEFINITION,
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
    const r = this.parseName(), s = this.parseConstDirectives();
    return this.node(t, {
      kind: R.SCALAR_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: s
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
    const r = this.parseName(), s = this.parseImplementsInterfaces(), o = this.parseConstDirectives(), i = this.parseFieldsDefinition();
    return this.node(t, {
      kind: R.OBJECT_TYPE_DEFINITION,
      description: n,
      name: r,
      interfaces: s,
      directives: o,
      fields: i
    });
  }
  /**
   * ImplementsInterfaces :
   *   - implements `&`? NamedType
   *   - ImplementsInterfaces & NamedType
   */
  parseImplementsInterfaces() {
    return this.expectOptionalKeyword("implements") ? this.delimitedMany(v.AMP, this.parseNamedType) : [];
  }
  /**
   * ```
   * FieldsDefinition : { FieldDefinition+ }
   * ```
   */
  parseFieldsDefinition() {
    return this.optionalMany(
      v.BRACE_L,
      this.parseFieldDefinition,
      v.BRACE_R
    );
  }
  /**
   * FieldDefinition :
   *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
   */
  parseFieldDefinition() {
    const t = this._lexer.token, n = this.parseDescription(), r = this.parseName(), s = this.parseArgumentDefs();
    this.expectToken(v.COLON);
    const o = this.parseTypeReference(), i = this.parseConstDirectives();
    return this.node(t, {
      kind: R.FIELD_DEFINITION,
      description: n,
      name: r,
      arguments: s,
      type: o,
      directives: i
    });
  }
  /**
   * ArgumentsDefinition : ( InputValueDefinition+ )
   */
  parseArgumentDefs() {
    return this.optionalMany(
      v.PAREN_L,
      this.parseInputValueDef,
      v.PAREN_R
    );
  }
  /**
   * InputValueDefinition :
   *   - Description? Name : Type DefaultValue? Directives[Const]?
   */
  parseInputValueDef() {
    const t = this._lexer.token, n = this.parseDescription(), r = this.parseName();
    this.expectToken(v.COLON);
    const s = this.parseTypeReference();
    let o;
    this.expectOptionalToken(v.EQUALS) && (o = this.parseConstValueLiteral());
    const i = this.parseConstDirectives();
    return this.node(t, {
      kind: R.INPUT_VALUE_DEFINITION,
      description: n,
      name: r,
      type: s,
      defaultValue: o,
      directives: i
    });
  }
  /**
   * InterfaceTypeDefinition :
   *   - Description? interface Name Directives[Const]? FieldsDefinition?
   */
  parseInterfaceTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("interface");
    const r = this.parseName(), s = this.parseImplementsInterfaces(), o = this.parseConstDirectives(), i = this.parseFieldsDefinition();
    return this.node(t, {
      kind: R.INTERFACE_TYPE_DEFINITION,
      description: n,
      name: r,
      interfaces: s,
      directives: o,
      fields: i
    });
  }
  /**
   * UnionTypeDefinition :
   *   - Description? union Name Directives[Const]? UnionMemberTypes?
   */
  parseUnionTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("union");
    const r = this.parseName(), s = this.parseConstDirectives(), o = this.parseUnionMemberTypes();
    return this.node(t, {
      kind: R.UNION_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: s,
      types: o
    });
  }
  /**
   * UnionMemberTypes :
   *   - = `|`? NamedType
   *   - UnionMemberTypes | NamedType
   */
  parseUnionMemberTypes() {
    return this.expectOptionalToken(v.EQUALS) ? this.delimitedMany(v.PIPE, this.parseNamedType) : [];
  }
  /**
   * EnumTypeDefinition :
   *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
   */
  parseEnumTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("enum");
    const r = this.parseName(), s = this.parseConstDirectives(), o = this.parseEnumValuesDefinition();
    return this.node(t, {
      kind: R.ENUM_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: s,
      values: o
    });
  }
  /**
   * ```
   * EnumValuesDefinition : { EnumValueDefinition+ }
   * ```
   */
  parseEnumValuesDefinition() {
    return this.optionalMany(
      v.BRACE_L,
      this.parseEnumValueDefinition,
      v.BRACE_R
    );
  }
  /**
   * EnumValueDefinition : Description? EnumValue Directives[Const]?
   */
  parseEnumValueDefinition() {
    const t = this._lexer.token, n = this.parseDescription(), r = this.parseEnumValueName(), s = this.parseConstDirectives();
    return this.node(t, {
      kind: R.ENUM_VALUE_DEFINITION,
      description: n,
      name: r,
      directives: s
    });
  }
  /**
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseEnumValueName() {
    if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null")
      throw ne(
        this._lexer.source,
        this._lexer.token.start,
        `${qt(
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
    const r = this.parseName(), s = this.parseConstDirectives(), o = this.parseInputFieldsDefinition();
    return this.node(t, {
      kind: R.INPUT_OBJECT_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: s,
      fields: o
    });
  }
  /**
   * ```
   * InputFieldsDefinition : { InputValueDefinition+ }
   * ```
   */
  parseInputFieldsDefinition() {
    return this.optionalMany(
      v.BRACE_L,
      this.parseInputValueDef,
      v.BRACE_R
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
    if (t.kind === v.NAME)
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
      v.BRACE_L,
      this.parseOperationTypeDefinition,
      v.BRACE_R
    );
    if (n.length === 0 && r.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: R.SCHEMA_EXTENSION,
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
      kind: R.SCALAR_TYPE_EXTENSION,
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
    const n = this.parseName(), r = this.parseImplementsInterfaces(), s = this.parseConstDirectives(), o = this.parseFieldsDefinition();
    if (r.length === 0 && s.length === 0 && o.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: R.OBJECT_TYPE_EXTENSION,
      name: n,
      interfaces: r,
      directives: s,
      fields: o
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
    const n = this.parseName(), r = this.parseImplementsInterfaces(), s = this.parseConstDirectives(), o = this.parseFieldsDefinition();
    if (r.length === 0 && s.length === 0 && o.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: R.INTERFACE_TYPE_EXTENSION,
      name: n,
      interfaces: r,
      directives: s,
      fields: o
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
    const n = this.parseName(), r = this.parseConstDirectives(), s = this.parseUnionMemberTypes();
    if (r.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: R.UNION_TYPE_EXTENSION,
      name: n,
      directives: r,
      types: s
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
    const n = this.parseName(), r = this.parseConstDirectives(), s = this.parseEnumValuesDefinition();
    if (r.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: R.ENUM_TYPE_EXTENSION,
      name: n,
      directives: r,
      values: s
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
    const n = this.parseName(), r = this.parseConstDirectives(), s = this.parseInputFieldsDefinition();
    if (r.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: R.INPUT_OBJECT_TYPE_EXTENSION,
      name: n,
      directives: r,
      fields: s
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
    this.expectKeyword("directive"), this.expectToken(v.AT);
    const r = this.parseName(), s = this.parseArgumentDefs(), o = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const i = this.parseDirectiveLocations();
    return this.node(t, {
      kind: R.DIRECTIVE_DEFINITION,
      description: n,
      name: r,
      arguments: s,
      repeatable: o,
      locations: i
    });
  }
  /**
   * DirectiveLocations :
   *   - `|`? DirectiveLocation
   *   - DirectiveLocations | DirectiveLocation
   */
  parseDirectiveLocations() {
    return this.delimitedMany(v.PIPE, this.parseDirectiveLocation);
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
    if (Object.prototype.hasOwnProperty.call(zn, n.value))
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
    return this._options.noLocation !== !0 && (n.loc = new Fi(
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
    throw ne(
      this._lexer.source,
      n.start,
      `Expected ${Qs(t)}, found ${qt(n)}.`
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
    if (n.kind === v.NAME && n.value === t)
      this.advanceLexer();
    else
      throw ne(
        this._lexer.source,
        n.start,
        `Expected "${t}", found ${qt(n)}.`
      );
  }
  /**
   * If the next token is a given keyword, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalKeyword(t) {
    const n = this._lexer.token;
    return n.kind === v.NAME && n.value === t ? (this.advanceLexer(), !0) : !1;
  }
  /**
   * Helper function for creating an error when an unexpected lexed token is encountered.
   */
  unexpected(t) {
    const n = t ?? this._lexer.token;
    return ne(
      this._lexer.source,
      n.start,
      `Unexpected ${qt(n)}.`
    );
  }
  /**
   * Returns a possibly empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  any(t, n, r) {
    this.expectToken(t);
    const s = [];
    for (; !this.expectOptionalToken(r); )
      s.push(n.call(this));
    return s;
  }
  /**
   * Returns a list of parse nodes, determined by the parseFn.
   * It can be empty only if open token is missing otherwise it will always return non-empty list
   * that begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  optionalMany(t, n, r) {
    if (this.expectOptionalToken(t)) {
      const s = [];
      do
        s.push(n.call(this));
      while (!this.expectOptionalToken(r));
      return s;
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
    const s = [];
    do
      s.push(n.call(this));
    while (!this.expectOptionalToken(r));
    return s;
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
    if (t !== void 0 && n.kind !== v.EOF && (++this._tokenCounter, this._tokenCounter > t))
      throw ne(
        this._lexer.source,
        n.start,
        `Document contains more that ${t} tokens. Parsing aborted.`
      );
  }
}
function qt(e) {
  const t = e.value;
  return Qs(e.kind) + (t != null ? ` "${t}"` : "");
}
function Qs(e) {
  return Wi(e) ? `"${e}"` : e;
}
function pa(e) {
  return `"${e.replace(ha, ma)}"`;
}
const ha = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function ma(e) {
  return ga[e.charCodeAt(0)];
}
const ga = [
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
], va = Object.freeze({});
function ya(e, t, n = qs) {
  const r = /* @__PURE__ */ new Map();
  for (const _ of Object.values(R))
    r.set(_, Ea(t, _));
  let s, o = Array.isArray(e), i = [e], a = -1, c = [], l = e, f, u;
  const d = [], p = [];
  do {
    a++;
    const _ = a === i.length, P = _ && c.length !== 0;
    if (_) {
      if (f = p.length === 0 ? void 0 : d[d.length - 1], l = u, u = p.pop(), P)
        if (o) {
          l = l.slice();
          let F = 0;
          for (const [z, oe] of c) {
            const A = z - F;
            oe === null ? (l.splice(A, 1), F++) : l[A] = oe;
          }
        } else {
          l = Object.defineProperties(
            {},
            Object.getOwnPropertyDescriptors(l)
          );
          for (const [F, z] of c)
            l[F] = z;
        }
      a = s.index, i = s.keys, c = s.edits, o = s.inArray, s = s.prev;
    } else if (u) {
      if (f = o ? a : i[a], l = u[f], l == null)
        continue;
      d.push(f);
    }
    let T;
    if (!Array.isArray(l)) {
      var m, y;
      zr(l) || Zt(!1, `Invalid AST Node: ${mr(l)}.`);
      const F = _ ? (m = r.get(l.kind)) === null || m === void 0 ? void 0 : m.leave : (y = r.get(l.kind)) === null || y === void 0 ? void 0 : y.enter;
      if (T = F == null ? void 0 : F.call(t, l, f, u, d, p), T === va)
        break;
      if (T === !1) {
        if (!_) {
          d.pop();
          continue;
        }
      } else if (T !== void 0 && (c.push([f, T]), !_))
        if (zr(T))
          l = T;
        else {
          d.pop();
          continue;
        }
    }
    if (T === void 0 && P && c.push([f, l]), _)
      d.pop();
    else {
      var S;
      s = {
        inArray: o,
        index: a,
        keys: i,
        edits: c,
        prev: s
      }, o = Array.isArray(l), i = o ? l : (S = n[l.kind]) !== null && S !== void 0 ? S : [], a = -1, c = [], u && p.push(u), u = l;
    }
  } while (s !== void 0);
  return c.length !== 0 ? c[c.length - 1][1] : e;
}
function Ea(e, t) {
  const n = e[t];
  return typeof n == "object" ? n : typeof n == "function" ? {
    enter: n,
    leave: void 0
  } : {
    enter: e.enter,
    leave: e.leave
  };
}
function _a(e) {
  return ya(e, wa);
}
const ba = 80, wa = {
  Name: {
    leave: (e) => e.value
  },
  Variable: {
    leave: (e) => "$" + e.name
  },
  // Document
  Document: {
    leave: (e) => N(e.definitions, `

`)
  },
  OperationDefinition: {
    leave(e) {
      const t = L("(", N(e.variableDefinitions, ", "), ")"), n = N(
        [
          e.operation,
          N([e.name, t]),
          N(e.directives, " ")
        ],
        " "
      );
      return (n === "query" ? "" : n + " ") + e.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: e, type: t, defaultValue: n, directives: r }) => e + ": " + t + L(" = ", n) + L(" ", N(r, " "))
  },
  SelectionSet: {
    leave: ({ selections: e }) => ve(e)
  },
  Field: {
    leave({ alias: e, name: t, arguments: n, directives: r, selectionSet: s }) {
      const o = L("", e, ": ") + t;
      let i = o + L("(", N(n, ", "), ")");
      return i.length > ba && (i = o + L(`(
`, en(N(n, `
`)), `
)`)), N([i, N(r, " "), s], " ");
    }
  },
  Argument: {
    leave: ({ name: e, value: t }) => e + ": " + t
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name: e, directives: t }) => "..." + e + L(" ", N(t, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: e, directives: t, selectionSet: n }) => N(
      [
        "...",
        L("on ", e),
        N(t, " "),
        n
      ],
      " "
    )
  },
  FragmentDefinition: {
    leave: ({ name: e, typeCondition: t, variableDefinitions: n, directives: r, selectionSet: s }) => (
      // or removed in the future.
      `fragment ${e}${L("(", N(n, ", "), ")")} on ${t} ${L("", N(r, " "), " ")}` + s
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
    leave: ({ value: e, block: t }) => t ? Gi(e) : pa(e)
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
    leave: ({ values: e }) => "[" + N(e, ", ") + "]"
  },
  ObjectValue: {
    leave: ({ fields: e }) => "{" + N(e, ", ") + "}"
  },
  ObjectField: {
    leave: ({ name: e, value: t }) => e + ": " + t
  },
  // Directive
  Directive: {
    leave: ({ name: e, arguments: t }) => "@" + e + L("(", N(t, ", "), ")")
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
    leave: ({ description: e, directives: t, operationTypes: n }) => L("", e, `
`) + N(["schema", N(t, " "), ve(n)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: e, type: t }) => e + ": " + t
  },
  ScalarTypeDefinition: {
    leave: ({ description: e, name: t, directives: n }) => L("", e, `
`) + N(["scalar", t, N(n, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ description: e, name: t, interfaces: n, directives: r, fields: s }) => L("", e, `
`) + N(
      [
        "type",
        t,
        L("implements ", N(n, " & ")),
        N(r, " "),
        ve(s)
      ],
      " "
    )
  },
  FieldDefinition: {
    leave: ({ description: e, name: t, arguments: n, type: r, directives: s }) => L("", e, `
`) + t + (Jr(n) ? L(`(
`, en(N(n, `
`)), `
)`) : L("(", N(n, ", "), ")")) + ": " + r + L(" ", N(s, " "))
  },
  InputValueDefinition: {
    leave: ({ description: e, name: t, type: n, defaultValue: r, directives: s }) => L("", e, `
`) + N(
      [t + ": " + n, L("= ", r), N(s, " ")],
      " "
    )
  },
  InterfaceTypeDefinition: {
    leave: ({ description: e, name: t, interfaces: n, directives: r, fields: s }) => L("", e, `
`) + N(
      [
        "interface",
        t,
        L("implements ", N(n, " & ")),
        N(r, " "),
        ve(s)
      ],
      " "
    )
  },
  UnionTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, types: r }) => L("", e, `
`) + N(
      ["union", t, N(n, " "), L("= ", N(r, " | "))],
      " "
    )
  },
  EnumTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, values: r }) => L("", e, `
`) + N(["enum", t, N(n, " "), ve(r)], " ")
  },
  EnumValueDefinition: {
    leave: ({ description: e, name: t, directives: n }) => L("", e, `
`) + N([t, N(n, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, fields: r }) => L("", e, `
`) + N(["input", t, N(n, " "), ve(r)], " ")
  },
  DirectiveDefinition: {
    leave: ({ description: e, name: t, arguments: n, repeatable: r, locations: s }) => L("", e, `
`) + "directive @" + t + (Jr(n) ? L(`(
`, en(N(n, `
`)), `
)`) : L("(", N(n, ", "), ")")) + (r ? " repeatable" : "") + " on " + N(s, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: e, operationTypes: t }) => N(
      ["extend schema", N(e, " "), ve(t)],
      " "
    )
  },
  ScalarTypeExtension: {
    leave: ({ name: e, directives: t }) => N(["extend scalar", e, N(t, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: r }) => N(
      [
        "extend type",
        e,
        L("implements ", N(t, " & ")),
        N(n, " "),
        ve(r)
      ],
      " "
    )
  },
  InterfaceTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: r }) => N(
      [
        "extend interface",
        e,
        L("implements ", N(t, " & ")),
        N(n, " "),
        ve(r)
      ],
      " "
    )
  },
  UnionTypeExtension: {
    leave: ({ name: e, directives: t, types: n }) => N(
      [
        "extend union",
        e,
        N(t, " "),
        L("= ", N(n, " | "))
      ],
      " "
    )
  },
  EnumTypeExtension: {
    leave: ({ name: e, directives: t, values: n }) => N(["extend enum", e, N(t, " "), ve(n)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: e, directives: t, fields: n }) => N(["extend input", e, N(t, " "), ve(n)], " ")
  }
};
function N(e, t = "") {
  var n;
  return (n = e == null ? void 0 : e.filter((r) => r).join(t)) !== null && n !== void 0 ? n : "";
}
function ve(e) {
  return L(`{
`, en(N(e, `
`)), `
}`);
}
function L(e, t, n = "") {
  return t != null && t !== "" ? e + t + n : "";
}
function en(e) {
  return L("  ", e.replace(/\n/g, `
  `));
}
function Jr(e) {
  var t;
  return (t = e == null ? void 0 : e.some((n) => n.includes(`
`))) !== null && t !== void 0 ? t : !1;
}
const Yr = (e) => {
  var r, s;
  let t;
  const n = e.definitions.filter((o) => o.kind === "OperationDefinition");
  return n.length === 1 && (t = (s = (r = n[0]) == null ? void 0 : r.name) == null ? void 0 : s.value), t;
}, Rn = (e) => {
  if (typeof e == "string") {
    let n;
    try {
      const r = fa(e);
      n = Yr(r);
    } catch {
    }
    return { query: e, operationName: n };
  }
  const t = Yr(e);
  return { query: _a(e), operationName: t };
};
class Tt extends Error {
  constructor(t, n) {
    const r = `${Tt.extractMessage(t)}: ${JSON.stringify({
      response: t,
      request: n
    })}`;
    super(r), Object.setPrototypeOf(this, Tt.prototype), this.response = t, this.request = n, typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, Tt);
  }
  static extractMessage(t) {
    var n, r;
    return ((r = (n = t.errors) == null ? void 0 : n[0]) == null ? void 0 : r.message) ?? `GraphQL Error (Code: ${t.status})`;
  }
}
var Na = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Oa(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Jn = { exports: {} };
(function(e, t) {
  var n = typeof self < "u" ? self : Na, r = function() {
    function o() {
      this.fetch = !1, this.DOMException = n.DOMException;
    }
    return o.prototype = n, new o();
  }();
  (function(o) {
    (function(i) {
      var a = {
        searchParams: "URLSearchParams" in o,
        iterable: "Symbol" in o && "iterator" in Symbol,
        blob: "FileReader" in o && "Blob" in o && function() {
          try {
            return new Blob(), !0;
          } catch {
            return !1;
          }
        }(),
        formData: "FormData" in o,
        arrayBuffer: "ArrayBuffer" in o
      };
      function c(h) {
        return h && DataView.prototype.isPrototypeOf(h);
      }
      if (a.arrayBuffer)
        var l = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ], f = ArrayBuffer.isView || function(h) {
          return h && l.indexOf(Object.prototype.toString.call(h)) > -1;
        };
      function u(h) {
        if (typeof h != "string" && (h = String(h)), /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(h))
          throw new TypeError("Invalid character in header field name");
        return h.toLowerCase();
      }
      function d(h) {
        return typeof h != "string" && (h = String(h)), h;
      }
      function p(h) {
        var E = {
          next: function() {
            var D = h.shift();
            return { done: D === void 0, value: D };
          }
        };
        return a.iterable && (E[Symbol.iterator] = function() {
          return E;
        }), E;
      }
      function m(h) {
        this.map = {}, h instanceof m ? h.forEach(function(E, D) {
          this.append(D, E);
        }, this) : Array.isArray(h) ? h.forEach(function(E) {
          this.append(E[0], E[1]);
        }, this) : h && Object.getOwnPropertyNames(h).forEach(function(E) {
          this.append(E, h[E]);
        }, this);
      }
      m.prototype.append = function(h, E) {
        h = u(h), E = d(E);
        var D = this.map[h];
        this.map[h] = D ? D + ", " + E : E;
      }, m.prototype.delete = function(h) {
        delete this.map[u(h)];
      }, m.prototype.get = function(h) {
        return h = u(h), this.has(h) ? this.map[h] : null;
      }, m.prototype.has = function(h) {
        return this.map.hasOwnProperty(u(h));
      }, m.prototype.set = function(h, E) {
        this.map[u(h)] = d(E);
      }, m.prototype.forEach = function(h, E) {
        for (var D in this.map)
          this.map.hasOwnProperty(D) && h.call(E, this.map[D], D, this);
      }, m.prototype.keys = function() {
        var h = [];
        return this.forEach(function(E, D) {
          h.push(D);
        }), p(h);
      }, m.prototype.values = function() {
        var h = [];
        return this.forEach(function(E) {
          h.push(E);
        }), p(h);
      }, m.prototype.entries = function() {
        var h = [];
        return this.forEach(function(E, D) {
          h.push([D, E]);
        }), p(h);
      }, a.iterable && (m.prototype[Symbol.iterator] = m.prototype.entries);
      function y(h) {
        if (h.bodyUsed)
          return Promise.reject(new TypeError("Already read"));
        h.bodyUsed = !0;
      }
      function S(h) {
        return new Promise(function(E, D) {
          h.onload = function() {
            E(h.result);
          }, h.onerror = function() {
            D(h.error);
          };
        });
      }
      function _(h) {
        var E = new FileReader(), D = S(E);
        return E.readAsArrayBuffer(h), D;
      }
      function P(h) {
        var E = new FileReader(), D = S(E);
        return E.readAsText(h), D;
      }
      function T(h) {
        for (var E = new Uint8Array(h), D = new Array(E.length), j = 0; j < E.length; j++)
          D[j] = String.fromCharCode(E[j]);
        return D.join("");
      }
      function F(h) {
        if (h.slice)
          return h.slice(0);
        var E = new Uint8Array(h.byteLength);
        return E.set(new Uint8Array(h)), E.buffer;
      }
      function z() {
        return this.bodyUsed = !1, this._initBody = function(h) {
          this._bodyInit = h, h ? typeof h == "string" ? this._bodyText = h : a.blob && Blob.prototype.isPrototypeOf(h) ? this._bodyBlob = h : a.formData && FormData.prototype.isPrototypeOf(h) ? this._bodyFormData = h : a.searchParams && URLSearchParams.prototype.isPrototypeOf(h) ? this._bodyText = h.toString() : a.arrayBuffer && a.blob && c(h) ? (this._bodyArrayBuffer = F(h.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : a.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(h) || f(h)) ? this._bodyArrayBuffer = F(h) : this._bodyText = h = Object.prototype.toString.call(h) : this._bodyText = "", this.headers.get("content-type") || (typeof h == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : a.searchParams && URLSearchParams.prototype.isPrototypeOf(h) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, a.blob && (this.blob = function() {
          var h = y(this);
          if (h)
            return h;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }, this.arrayBuffer = function() {
          return this._bodyArrayBuffer ? y(this) || Promise.resolve(this._bodyArrayBuffer) : this.blob().then(_);
        }), this.text = function() {
          var h = y(this);
          if (h)
            return h;
          if (this._bodyBlob)
            return P(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(T(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, a.formData && (this.formData = function() {
          return this.text().then(x);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var oe = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
      function A(h) {
        var E = h.toUpperCase();
        return oe.indexOf(E) > -1 ? E : h;
      }
      function te(h, E) {
        E = E || {};
        var D = E.body;
        if (h instanceof te) {
          if (h.bodyUsed)
            throw new TypeError("Already read");
          this.url = h.url, this.credentials = h.credentials, E.headers || (this.headers = new m(h.headers)), this.method = h.method, this.mode = h.mode, this.signal = h.signal, !D && h._bodyInit != null && (D = h._bodyInit, h.bodyUsed = !0);
        } else
          this.url = String(h);
        if (this.credentials = E.credentials || this.credentials || "same-origin", (E.headers || !this.headers) && (this.headers = new m(E.headers)), this.method = A(E.method || this.method || "GET"), this.mode = E.mode || this.mode || null, this.signal = E.signal || this.signal, this.referrer = null, (this.method === "GET" || this.method === "HEAD") && D)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        this._initBody(D);
      }
      te.prototype.clone = function() {
        return new te(this, { body: this._bodyInit });
      };
      function x(h) {
        var E = new FormData();
        return h.trim().split("&").forEach(function(D) {
          if (D) {
            var j = D.split("="), X = j.shift().replace(/\+/g, " "), U = j.join("=").replace(/\+/g, " ");
            E.append(decodeURIComponent(X), decodeURIComponent(U));
          }
        }), E;
      }
      function w(h) {
        var E = new m(), D = h.replace(/\r?\n[\t ]+/g, " ");
        return D.split(/\r?\n/).forEach(function(j) {
          var X = j.split(":"), U = X.shift().trim();
          if (U) {
            var He = X.join(":").trim();
            E.append(U, He);
          }
        }), E;
      }
      z.call(te.prototype);
      function $(h, E) {
        E || (E = {}), this.type = "default", this.status = E.status === void 0 ? 200 : E.status, this.ok = this.status >= 200 && this.status < 300, this.statusText = "statusText" in E ? E.statusText : "OK", this.headers = new m(E.headers), this.url = E.url || "", this._initBody(h);
      }
      z.call($.prototype), $.prototype.clone = function() {
        return new $(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new m(this.headers),
          url: this.url
        });
      }, $.error = function() {
        var h = new $(null, { status: 0, statusText: "" });
        return h.type = "error", h;
      };
      var W = [301, 302, 303, 307, 308];
      $.redirect = function(h, E) {
        if (W.indexOf(E) === -1)
          throw new RangeError("Invalid status code");
        return new $(null, { status: E, headers: { location: h } });
      }, i.DOMException = o.DOMException;
      try {
        new i.DOMException();
      } catch {
        i.DOMException = function(E, D) {
          this.message = E, this.name = D;
          var j = Error(E);
          this.stack = j.stack;
        }, i.DOMException.prototype = Object.create(Error.prototype), i.DOMException.prototype.constructor = i.DOMException;
      }
      function ge(h, E) {
        return new Promise(function(D, j) {
          var X = new te(h, E);
          if (X.signal && X.signal.aborted)
            return j(new i.DOMException("Aborted", "AbortError"));
          var U = new XMLHttpRequest();
          function He() {
            U.abort();
          }
          U.onload = function() {
            var xe = {
              status: U.status,
              statusText: U.statusText,
              headers: w(U.getAllResponseHeaders() || "")
            };
            xe.url = "responseURL" in U ? U.responseURL : xe.headers.get("X-Request-URL");
            var Ge = "response" in U ? U.response : U.responseText;
            D(new $(Ge, xe));
          }, U.onerror = function() {
            j(new TypeError("Network request failed"));
          }, U.ontimeout = function() {
            j(new TypeError("Network request failed"));
          }, U.onabort = function() {
            j(new i.DOMException("Aborted", "AbortError"));
          }, U.open(X.method, X.url, !0), X.credentials === "include" ? U.withCredentials = !0 : X.credentials === "omit" && (U.withCredentials = !1), "responseType" in U && a.blob && (U.responseType = "blob"), X.headers.forEach(function(xe, Ge) {
            U.setRequestHeader(Ge, xe);
          }), X.signal && (X.signal.addEventListener("abort", He), U.onreadystatechange = function() {
            U.readyState === 4 && X.signal.removeEventListener("abort", He);
          }), U.send(typeof X._bodyInit > "u" ? null : X._bodyInit);
        });
      }
      return ge.polyfill = !0, o.fetch || (o.fetch = ge, o.Headers = m, o.Request = te, o.Response = $), i.Headers = m, i.Request = te, i.Response = $, i.fetch = ge, Object.defineProperty(i, "__esModule", { value: !0 }), i;
    })({});
  })(r), r.fetch.ponyfill = !0, delete r.fetch.polyfill;
  var s = r;
  t = s.fetch, t.default = s.fetch, t.fetch = s.fetch, t.Headers = s.Headers, t.Request = s.Request, t.Response = s.Response, e.exports = t;
})(Jn, Jn.exports);
var cn = Jn.exports;
const tn = /* @__PURE__ */ Oa(cn), Sa = /* @__PURE__ */ xi({
  __proto__: null,
  default: tn
}, [cn]), st = (e) => {
  let t = {};
  return e && (typeof Headers < "u" && e instanceof Headers || Sa && cn.Headers && e instanceof cn.Headers ? t = Di(e) : Array.isArray(e) ? e.forEach(([n, r]) => {
    n && r !== void 0 && (t[n] = r);
  }) : t = e), t;
}, Qr = (e) => e.replace(/([\s,]|#[^\n\r]+)+/g, " ").trim(), Ta = (e) => {
  if (!Array.isArray(e.query)) {
    const r = e, s = [`query=${encodeURIComponent(Qr(r.query))}`];
    return e.variables && s.push(`variables=${encodeURIComponent(r.jsonSerializer.stringify(r.variables))}`), r.operationName && s.push(`operationName=${encodeURIComponent(r.operationName)}`), s.join("&");
  }
  if (typeof e.variables < "u" && !Array.isArray(e.variables))
    throw new Error("Cannot create query with given variable type, array expected");
  const t = e, n = e.query.reduce((r, s, o) => (r.push({
    query: Qr(s),
    variables: t.variables ? t.jsonSerializer.stringify(t.variables[o]) : void 0
  }), r), []);
  return `query=${encodeURIComponent(t.jsonSerializer.stringify(n))}`;
}, Ia = (e) => async (t) => {
  const { url: n, query: r, variables: s, operationName: o, fetch: i, fetchOptions: a, middleware: c } = t, l = { ...t.headers };
  let f = "", u;
  e === "POST" ? (u = Da(r, s, o, a.jsonSerializer), typeof u == "string" && (l["Content-Type"] = "application/json")) : f = Ta({
    query: r,
    variables: s,
    operationName: o,
    jsonSerializer: a.jsonSerializer ?? pr
  });
  const d = {
    method: e,
    headers: l,
    body: u,
    ...a
  };
  let p = n, m = d;
  if (c) {
    const y = await Promise.resolve(c({ ...d, url: n, operationName: o, variables: s })), { url: S, ..._ } = y;
    p = S, m = _;
  }
  return f && (p = `${p}?${f}`), await i(p, m);
};
class xa {
  constructor(t, n = {}) {
    this.url = t, this.requestConfig = n, this.rawRequest = async (...r) => {
      const [s, o, i] = r, a = Pi(s, o, i), { headers: c, fetch: l = tn, method: f = "POST", requestMiddleware: u, responseMiddleware: d, ...p } = this.requestConfig, { url: m } = this;
      a.signal !== void 0 && (p.signal = a.signal);
      const { operationName: y } = Rn(a.query);
      return Pn({
        url: m,
        query: a.query,
        variables: a.variables,
        headers: {
          ...st(Cn(c)),
          ...st(a.requestHeaders)
        },
        operationName: y,
        fetch: l,
        method: f,
        fetchOptions: p,
        middleware: u
      }).then((S) => (d && d(S), S)).catch((S) => {
        throw d && d(S), S;
      });
    };
  }
  async request(t, ...n) {
    const [r, s] = n, o = Ri(t, r, s), { headers: i, fetch: a = tn, method: c = "POST", requestMiddleware: l, responseMiddleware: f, ...u } = this.requestConfig, { url: d } = this;
    o.signal !== void 0 && (u.signal = o.signal);
    const { query: p, operationName: m } = Rn(o.document);
    return Pn({
      url: d,
      query: p,
      variables: o.variables,
      headers: {
        ...st(Cn(i)),
        ...st(o.requestHeaders)
      },
      operationName: m,
      fetch: a,
      method: c,
      fetchOptions: u,
      middleware: l
    }).then((y) => (f && f(y), y.data)).catch((y) => {
      throw f && f(y), y;
    });
  }
  // prettier-ignore
  batchRequests(t, n) {
    const r = Ci(t, n), { headers: s, ...o } = this.requestConfig;
    r.signal !== void 0 && (o.signal = r.signal);
    const i = r.documents.map(({ document: c }) => Rn(c).query), a = r.documents.map(({ variables: c }) => c);
    return Pn({
      url: this.url,
      query: i,
      // @ts-expect-error TODO reconcile batch variables into system.
      variables: a,
      headers: {
        ...st(Cn(s)),
        ...st(r.requestHeaders)
      },
      operationName: void 0,
      fetch: this.requestConfig.fetch ?? tn,
      method: this.requestConfig.method || "POST",
      fetchOptions: o,
      middleware: this.requestConfig.requestMiddleware
    }).then((c) => (this.requestConfig.responseMiddleware && this.requestConfig.responseMiddleware(c), c.data)).catch((c) => {
      throw this.requestConfig.responseMiddleware && this.requestConfig.responseMiddleware(c), c;
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
const Pn = async (e) => {
  const { query: t, variables: n, fetchOptions: r } = e, s = Ia(Ai(e.method ?? "post")), o = Array.isArray(e.query), i = await s(e), a = await Ra(i, r.jsonSerializer ?? pr), c = Array.isArray(a) ? !a.some(({ data: f }) => !f) : !!a.data, l = Array.isArray(a) || !a.errors || Array.isArray(a.errors) && !a.errors.length || r.errorPolicy === "all" || r.errorPolicy === "ignore";
  if (i.ok && l && c) {
    const { errors: f, ...u } = (Array.isArray(a), a), d = r.errorPolicy === "ignore" ? u : a;
    return {
      ...o ? { data: d } : d,
      headers: i.headers,
      status: i.status
    };
  } else {
    const f = typeof a == "string" ? {
      error: a
    } : a;
    throw new Tt(
      // @ts-expect-error TODO
      { ...f, status: i.status, headers: i.headers },
      { query: t, variables: n }
    );
  }
};
async function Aa(e, t, ...n) {
  const r = ki(e, t, ...n);
  return new xa(r.url).request({
    ...r
  });
}
const Da = (e, t, n, r) => {
  const s = r ?? pr;
  if (!Array.isArray(e))
    return s.stringify({ query: e, variables: t, operationName: n });
  if (typeof t < "u" && !Array.isArray(t))
    throw new Error("Cannot create request body with given variable type, array expected");
  const o = e.reduce((i, a, c) => (i.push({ query: a, variables: t ? t[c] : void 0 }), i), []);
  return s.stringify(o);
}, Ra = async (e, t) => {
  let n;
  return e.headers.forEach((r, s) => {
    s.toLowerCase() === "content-type" && (n = r);
  }), n && (n.toLowerCase().startsWith("application/json") || n.toLowerCase().startsWith("application/graphql+json") || n.toLowerCase().startsWith("application/graphql-response+json")) ? t.parse(await e.text()) : e.text();
}, Cn = (e) => typeof e == "function" ? e() : e, Pa = (e, ...t) => e.reduce((n, r, s) => `${n}${r}${s in t ? String(t[s]) : ""}`, "");
function Ca(e, t) {
  const n = /* @__PURE__ */ Object.create(null), r = e.split(",");
  for (let s = 0; s < r.length; s++)
    n[r[s]] = !0;
  return t ? (s) => !!n[s.toLowerCase()] : (s) => !!n[s];
}
function gr(e) {
  if (H(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const r = e[n], s = be(r) ? La(r) : gr(r);
      if (s)
        for (const o in s)
          t[o] = s[o];
    }
    return t;
  } else {
    if (be(e))
      return e;
    if (le(e))
      return e;
  }
}
const ka = /;(?![^(]*\))/g, $a = /:([^]+)/, Va = /\/\*.*?\*\//gs;
function La(e) {
  const t = {};
  return e.replace(Va, "").split(ka).forEach((n) => {
    if (n) {
      const r = n.split($a);
      r.length > 1 && (t[r[0].trim()] = r[1].trim());
    }
  }), t;
}
function vr(e) {
  let t = "";
  if (be(e))
    t = e;
  else if (H(e))
    for (let n = 0; n < e.length; n++) {
      const r = vr(e[n]);
      r && (t += r + " ");
    }
  else if (le(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Ne = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {};
process.env.NODE_ENV !== "production" && Object.freeze([]);
const wn = () => {
}, Ma = () => !1, ja = /^on[^a-z]/, Fa = (e) => ja.test(e), _e = Object.assign, Ua = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Ba = Object.prototype.hasOwnProperty, Q = (e, t) => Ba.call(e, t), H = Array.isArray, mt = (e) => Nn(e) === "[object Map]", qa = (e) => Nn(e) === "[object Set]", ee = (e) => typeof e == "function", be = (e) => typeof e == "string", yr = (e) => typeof e == "symbol", le = (e) => e !== null && typeof e == "object", Ha = (e) => le(e) && ee(e.then) && ee(e.catch), Ga = Object.prototype.toString, Nn = (e) => Ga.call(e), Ks = (e) => Nn(e).slice(8, -1), za = (e) => Nn(e) === "[object Object]", Er = (e) => be(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Xs = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Zs = Xs((e) => e.charAt(0).toUpperCase() + e.slice(1)), Wa = Xs((e) => e ? `on${Zs(e)}` : ""), kt = (e, t) => !Object.is(e, t), Ja = (e, t, n) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
};
let Kr;
const Ya = () => Kr || (Kr = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function un(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let fe;
class Qa {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this.effects = [], this.cleanups = [], this.parent = fe, !t && fe && (this.index = (fe.scopes || (fe.scopes = [])).push(this) - 1);
  }
  get active() {
    return this._active;
  }
  run(t) {
    if (this._active) {
      const n = fe;
      try {
        return fe = this, t();
      } finally {
        fe = n;
      }
    } else
      process.env.NODE_ENV !== "production" && un("cannot run an inactive effect scope.");
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    fe = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    fe = this.parent;
  }
  stop(t) {
    if (this._active) {
      let n, r;
      for (n = 0, r = this.effects.length; n < r; n++)
        this.effects[n].stop();
      for (n = 0, r = this.cleanups.length; n < r; n++)
        this.cleanups[n]();
      if (this.scopes)
        for (n = 0, r = this.scopes.length; n < r; n++)
          this.scopes[n].stop(!0);
      if (!this.detached && this.parent && !t) {
        const s = this.parent.scopes.pop();
        s && s !== this && (this.parent.scopes[this.index] = s, s.index = this.index);
      }
      this.parent = void 0, this._active = !1;
    }
  }
}
function eo(e) {
  return new Qa(e);
}
function Ka(e, t = fe) {
  t && t.active && t.effects.push(e);
}
function to() {
  return fe;
}
function Xa(e) {
  fe ? fe.cleanups.push(e) : process.env.NODE_ENV !== "production" && un("onScopeDispose() is called when there is no active effect scope to be associated with.");
}
const $t = (e) => {
  const t = new Set(e);
  return t.w = 0, t.n = 0, t;
}, no = (e) => (e.w & je) > 0, ro = (e) => (e.n & je) > 0, Za = ({ deps: e }) => {
  if (e.length)
    for (let t = 0; t < e.length; t++)
      e[t].w |= je;
}, ec = (e) => {
  const { deps: t } = e;
  if (t.length) {
    let n = 0;
    for (let r = 0; r < t.length; r++) {
      const s = t[r];
      no(s) && !ro(s) ? s.delete(e) : t[n++] = s, s.w &= ~je, s.n &= ~je;
    }
    t.length = n;
  }
}, ln = /* @__PURE__ */ new WeakMap();
let Nt = 0, je = 1;
const Yn = 30;
let ue;
const Qe = Symbol(process.env.NODE_ENV !== "production" ? "iterate" : ""), Qn = Symbol(process.env.NODE_ENV !== "production" ? "Map key iterate" : "");
class so {
  constructor(t, n = null, r) {
    this.fn = t, this.scheduler = n, this.active = !0, this.deps = [], this.parent = void 0, Ka(this, r);
  }
  run() {
    if (!this.active)
      return this.fn();
    let t = ue, n = Me;
    for (; t; ) {
      if (t === this)
        return;
      t = t.parent;
    }
    try {
      return this.parent = ue, ue = this, Me = !0, je = 1 << ++Nt, Nt <= Yn ? Za(this) : Xr(this), this.fn();
    } finally {
      Nt <= Yn && ec(this), je = 1 << --Nt, ue = this.parent, Me = n, this.parent = void 0, this.deferStop && this.stop();
    }
  }
  stop() {
    ue === this ? this.deferStop = !0 : this.active && (Xr(this), this.onStop && this.onStop(), this.active = !1);
  }
}
function Xr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
let Me = !0;
const oo = [];
function _r() {
  oo.push(Me), Me = !1;
}
function br() {
  const e = oo.pop();
  Me = e === void 0 ? !0 : e;
}
function pe(e, t, n) {
  if (Me && ue) {
    let r = ln.get(e);
    r || ln.set(e, r = /* @__PURE__ */ new Map());
    let s = r.get(n);
    s || r.set(n, s = $t());
    const o = process.env.NODE_ENV !== "production" ? { effect: ue, target: e, type: t, key: n } : void 0;
    Kn(s, o);
  }
}
function Kn(e, t) {
  let n = !1;
  Nt <= Yn ? ro(e) || (e.n |= je, n = !no(e)) : n = !e.has(ue), n && (e.add(ue), ue.deps.push(e), process.env.NODE_ENV !== "production" && ue.onTrack && ue.onTrack(Object.assign({ effect: ue }, t)));
}
function Fe(e, t, n, r, s, o) {
  const i = ln.get(e);
  if (!i)
    return;
  let a = [];
  if (t === "clear")
    a = [...i.values()];
  else if (n === "length" && H(e)) {
    const l = Number(r);
    i.forEach((f, u) => {
      (u === "length" || u >= l) && a.push(f);
    });
  } else
    switch (n !== void 0 && a.push(i.get(n)), t) {
      case "add":
        H(e) ? Er(n) && a.push(i.get("length")) : (a.push(i.get(Qe)), mt(e) && a.push(i.get(Qn)));
        break;
      case "delete":
        H(e) || (a.push(i.get(Qe)), mt(e) && a.push(i.get(Qn)));
        break;
      case "set":
        mt(e) && a.push(i.get(Qe));
        break;
    }
  const c = process.env.NODE_ENV !== "production" ? { target: e, type: t, key: n, newValue: r, oldValue: s, oldTarget: o } : void 0;
  if (a.length === 1)
    a[0] && (process.env.NODE_ENV !== "production" ? lt(a[0], c) : lt(a[0]));
  else {
    const l = [];
    for (const f of a)
      f && l.push(...f);
    process.env.NODE_ENV !== "production" ? lt($t(l), c) : lt($t(l));
  }
}
function lt(e, t) {
  const n = H(e) ? e : [...e];
  for (const r of n)
    r.computed && Zr(r, t);
  for (const r of n)
    r.computed || Zr(r, t);
}
function Zr(e, t) {
  (e !== ue || e.allowRecurse) && (process.env.NODE_ENV !== "production" && e.onTrigger && e.onTrigger(_e({ effect: e }, t)), e.scheduler ? e.scheduler() : e.run());
}
function tc(e, t) {
  var n;
  return (n = ln.get(e)) === null || n === void 0 ? void 0 : n.get(t);
}
const nc = /* @__PURE__ */ Ca("__proto__,__v_isRef,__isVue"), io = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(yr)
), rc = /* @__PURE__ */ wr(), sc = /* @__PURE__ */ wr(!0), oc = /* @__PURE__ */ wr(!0, !0), es = /* @__PURE__ */ ic();
function ic() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const r = C(this);
      for (let o = 0, i = this.length; o < i; o++)
        pe(r, "get", o + "");
      const s = r[t](...n);
      return s === -1 || s === !1 ? r[t](...n.map(C)) : s;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      _r();
      const r = C(this)[t].apply(this, n);
      return br(), r;
    };
  }), e;
}
function ac(e) {
  const t = C(this);
  return pe(t, "has", e), t.hasOwnProperty(e);
}
function wr(e = !1, t = !1) {
  return function(r, s, o) {
    if (s === "__v_isReactive")
      return !e;
    if (s === "__v_isReadonly")
      return e;
    if (s === "__v_isShallow")
      return t;
    if (s === "__v_raw" && o === (e ? t ? fo : lo : t ? Nc : uo).get(r))
      return r;
    const i = H(r);
    if (!e) {
      if (i && Q(es, s))
        return Reflect.get(es, s, o);
      if (s === "hasOwnProperty")
        return ac;
    }
    const a = Reflect.get(r, s, o);
    return (yr(s) ? io.has(s) : nc(s)) || (e || pe(r, "get", s), t) ? a : J(a) ? i && Er(s) ? a : a.value : le(a) ? e ? po(a) : Ut(a) : a;
  };
}
const cc = /* @__PURE__ */ uc();
function uc(e = !1) {
  return function(n, r, s, o) {
    let i = n[r];
    if (Ue(i) && J(i) && !J(s))
      return !1;
    if (!e && (!fn(s) && !Ue(s) && (i = C(i), s = C(s)), !H(n) && J(i) && !J(s)))
      return i.value = s, !0;
    const a = H(n) && Er(r) ? Number(r) < n.length : Q(n, r), c = Reflect.set(n, r, s, o);
    return n === C(o) && (a ? kt(s, i) && Fe(n, "set", r, s, i) : Fe(n, "add", r, s)), c;
  };
}
function lc(e, t) {
  const n = Q(e, t), r = e[t], s = Reflect.deleteProperty(e, t);
  return s && n && Fe(e, "delete", t, void 0, r), s;
}
function fc(e, t) {
  const n = Reflect.has(e, t);
  return (!yr(t) || !io.has(t)) && pe(e, "has", t), n;
}
function dc(e) {
  return pe(e, "iterate", H(e) ? "length" : Qe), Reflect.ownKeys(e);
}
const pc = {
  get: rc,
  set: cc,
  deleteProperty: lc,
  has: fc,
  ownKeys: dc
}, ao = {
  get: sc,
  set(e, t) {
    return process.env.NODE_ENV !== "production" && un(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return process.env.NODE_ENV !== "production" && un(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, hc = /* @__PURE__ */ _e({}, ao, {
  get: oc
}), Nr = (e) => e, On = (e) => Reflect.getPrototypeOf(e);
function Ht(e, t, n = !1, r = !1) {
  e = e.__v_raw;
  const s = C(e), o = C(t);
  n || (t !== o && pe(s, "get", t), pe(s, "get", o));
  const { has: i } = On(s), a = r ? Nr : n ? Tr : Vt;
  if (i.call(s, t))
    return a(e.get(t));
  if (i.call(s, o))
    return a(e.get(o));
  e !== s && e.get(t);
}
function Gt(e, t = !1) {
  const n = this.__v_raw, r = C(n), s = C(e);
  return t || (e !== s && pe(r, "has", e), pe(r, "has", s)), e === s ? n.has(e) : n.has(e) || n.has(s);
}
function zt(e, t = !1) {
  return e = e.__v_raw, !t && pe(C(e), "iterate", Qe), Reflect.get(e, "size", e);
}
function ts(e) {
  e = C(e);
  const t = C(this);
  return On(t).has.call(t, e) || (t.add(e), Fe(t, "add", e, e)), this;
}
function ns(e, t) {
  t = C(t);
  const n = C(this), { has: r, get: s } = On(n);
  let o = r.call(n, e);
  o ? process.env.NODE_ENV !== "production" && co(n, r, e) : (e = C(e), o = r.call(n, e));
  const i = s.call(n, e);
  return n.set(e, t), o ? kt(t, i) && Fe(n, "set", e, t, i) : Fe(n, "add", e, t), this;
}
function rs(e) {
  const t = C(this), { has: n, get: r } = On(t);
  let s = n.call(t, e);
  s ? process.env.NODE_ENV !== "production" && co(t, n, e) : (e = C(e), s = n.call(t, e));
  const o = r ? r.call(t, e) : void 0, i = t.delete(e);
  return s && Fe(t, "delete", e, void 0, o), i;
}
function ss() {
  const e = C(this), t = e.size !== 0, n = process.env.NODE_ENV !== "production" ? mt(e) ? new Map(e) : new Set(e) : void 0, r = e.clear();
  return t && Fe(e, "clear", void 0, void 0, n), r;
}
function Wt(e, t) {
  return function(r, s) {
    const o = this, i = o.__v_raw, a = C(i), c = t ? Nr : e ? Tr : Vt;
    return !e && pe(a, "iterate", Qe), i.forEach((l, f) => r.call(s, c(l), c(f), o));
  };
}
function Jt(e, t, n) {
  return function(...r) {
    const s = this.__v_raw, o = C(s), i = mt(o), a = e === "entries" || e === Symbol.iterator && i, c = e === "keys" && i, l = s[e](...r), f = n ? Nr : t ? Tr : Vt;
    return !t && pe(o, "iterate", c ? Qn : Qe), {
      // iterator protocol
      next() {
        const { value: u, done: d } = l.next();
        return d ? { value: u, done: d } : {
          value: a ? [f(u[0]), f(u[1])] : f(u),
          done: d
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Ce(e) {
  return function(...t) {
    if (process.env.NODE_ENV !== "production") {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${Zs(e)} operation ${n}failed: target is readonly.`, C(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function mc() {
  const e = {
    get(o) {
      return Ht(this, o);
    },
    get size() {
      return zt(this);
    },
    has: Gt,
    add: ts,
    set: ns,
    delete: rs,
    clear: ss,
    forEach: Wt(!1, !1)
  }, t = {
    get(o) {
      return Ht(this, o, !1, !0);
    },
    get size() {
      return zt(this);
    },
    has: Gt,
    add: ts,
    set: ns,
    delete: rs,
    clear: ss,
    forEach: Wt(!1, !0)
  }, n = {
    get(o) {
      return Ht(this, o, !0);
    },
    get size() {
      return zt(this, !0);
    },
    has(o) {
      return Gt.call(this, o, !0);
    },
    add: Ce(
      "add"
      /* TriggerOpTypes.ADD */
    ),
    set: Ce(
      "set"
      /* TriggerOpTypes.SET */
    ),
    delete: Ce(
      "delete"
      /* TriggerOpTypes.DELETE */
    ),
    clear: Ce(
      "clear"
      /* TriggerOpTypes.CLEAR */
    ),
    forEach: Wt(!0, !1)
  }, r = {
    get(o) {
      return Ht(this, o, !0, !0);
    },
    get size() {
      return zt(this, !0);
    },
    has(o) {
      return Gt.call(this, o, !0);
    },
    add: Ce(
      "add"
      /* TriggerOpTypes.ADD */
    ),
    set: Ce(
      "set"
      /* TriggerOpTypes.SET */
    ),
    delete: Ce(
      "delete"
      /* TriggerOpTypes.DELETE */
    ),
    clear: Ce(
      "clear"
      /* TriggerOpTypes.CLEAR */
    ),
    forEach: Wt(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((o) => {
    e[o] = Jt(o, !1, !1), n[o] = Jt(o, !0, !1), t[o] = Jt(o, !1, !0), r[o] = Jt(o, !0, !0);
  }), [
    e,
    n,
    t,
    r
  ];
}
const [gc, vc, yc, Ec] = /* @__PURE__ */ mc();
function Or(e, t) {
  const n = t ? e ? Ec : yc : e ? vc : gc;
  return (r, s, o) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? r : Reflect.get(Q(n, s) && s in r ? n : r, s, o);
}
const _c = {
  get: /* @__PURE__ */ Or(!1, !1)
}, bc = {
  get: /* @__PURE__ */ Or(!0, !1)
}, wc = {
  get: /* @__PURE__ */ Or(!0, !0)
};
function co(e, t, n) {
  const r = C(n);
  if (r !== n && t.call(e, r)) {
    const s = Ks(e);
    console.warn(`Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
const uo = /* @__PURE__ */ new WeakMap(), Nc = /* @__PURE__ */ new WeakMap(), lo = /* @__PURE__ */ new WeakMap(), fo = /* @__PURE__ */ new WeakMap();
function Oc(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Sc(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Oc(Ks(e));
}
function Ut(e) {
  return Ue(e) ? e : Sr(e, !1, pc, _c, uo);
}
function po(e) {
  return Sr(e, !0, ao, bc, lo);
}
function Yt(e) {
  return Sr(e, !0, hc, wc, fo);
}
function Sr(e, t, n, r, s) {
  if (!le(e))
    return process.env.NODE_ENV !== "production" && console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const o = s.get(e);
  if (o)
    return o;
  const i = Sc(e);
  if (i === 0)
    return e;
  const a = new Proxy(e, i === 2 ? r : n);
  return s.set(e, a), a;
}
function Te(e) {
  return Ue(e) ? Te(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Ue(e) {
  return !!(e && e.__v_isReadonly);
}
function fn(e) {
  return !!(e && e.__v_isShallow);
}
function dn(e) {
  return Te(e) || Ue(e);
}
function C(e) {
  const t = e && e.__v_raw;
  return t ? C(t) : e;
}
function Oe(e) {
  return Ja(e, "__v_skip", !0), e;
}
const Vt = (e) => le(e) ? Ut(e) : e, Tr = (e) => le(e) ? po(e) : e;
function ho(e) {
  Me && ue && (e = C(e), process.env.NODE_ENV !== "production" ? Kn(e.dep || (e.dep = $t()), {
    target: e,
    type: "get",
    key: "value"
  }) : Kn(e.dep || (e.dep = $t())));
}
function mo(e, t) {
  e = C(e);
  const n = e.dep;
  n && (process.env.NODE_ENV !== "production" ? lt(n, {
    target: e,
    type: "set",
    key: "value",
    newValue: t
  }) : lt(n));
}
function J(e) {
  return !!(e && e.__v_isRef === !0);
}
function Be(e) {
  return go(e, !1);
}
function Tc(e) {
  return go(e, !0);
}
function go(e, t) {
  return J(e) ? e : new Ic(e, t);
}
class Ic {
  constructor(t, n) {
    this.__v_isShallow = n, this.dep = void 0, this.__v_isRef = !0, this._rawValue = n ? t : C(t), this._value = n ? t : Vt(t);
  }
  get value() {
    return ho(this), this._value;
  }
  set value(t) {
    const n = this.__v_isShallow || fn(t) || Ue(t);
    t = n ? t : C(t), kt(t, this._rawValue) && (this._rawValue = t, this._value = n ? t : Vt(t), mo(this, t));
  }
}
function Ke(e) {
  return J(e) ? e.value : e;
}
const xc = {
  get: (e, t, n) => Ke(Reflect.get(e, t, n)),
  set: (e, t, n, r) => {
    const s = e[t];
    return J(s) && !J(n) ? (s.value = n, !0) : Reflect.set(e, t, n, r);
  }
};
function Ac(e) {
  return Te(e) ? e : new Proxy(e, xc);
}
function os(e) {
  process.env.NODE_ENV !== "production" && !dn(e) && console.warn("toRefs() expects a reactive object but received a plain one.");
  const t = H(e) ? new Array(e.length) : {};
  for (const n in e)
    t[n] = nn(e, n);
  return t;
}
class Dc {
  constructor(t, n, r) {
    this._object = t, this._key = n, this._defaultValue = r, this.__v_isRef = !0;
  }
  get value() {
    const t = this._object[this._key];
    return t === void 0 ? this._defaultValue : t;
  }
  set value(t) {
    this._object[this._key] = t;
  }
  get dep() {
    return tc(C(this._object), this._key);
  }
}
function nn(e, t, n) {
  const r = e[t];
  return J(r) ? r : new Dc(e, t, n);
}
var vo;
class Rc {
  constructor(t, n, r, s) {
    this._setter = n, this.dep = void 0, this.__v_isRef = !0, this[vo] = !1, this._dirty = !0, this.effect = new so(t, () => {
      this._dirty || (this._dirty = !0, mo(this));
    }), this.effect.computed = this, this.effect.active = this._cacheable = !s, this.__v_isReadonly = r;
  }
  get value() {
    const t = C(this);
    return ho(t), (t._dirty || !t._cacheable) && (t._dirty = !1, t._value = t.effect.run()), t._value;
  }
  set value(t) {
    this._setter(t);
  }
}
vo = "__v_isReadonly";
function Pc(e, t, n = !1) {
  let r, s;
  const o = ee(e);
  o ? (r = e, s = process.env.NODE_ENV !== "production" ? () => {
    console.warn("Write operation failed: computed value is readonly");
  } : wn) : (r = e.get, s = e.set);
  const i = new Rc(r, s, o || !s, n);
  return process.env.NODE_ENV !== "production" && t && !n && (i.effect.onTrack = t.onTrack, i.effect.onTrigger = t.onTrigger), i;
}
const Xe = [];
function Cc(e) {
  Xe.push(e);
}
function kc() {
  Xe.pop();
}
function K(e, ...t) {
  if (process.env.NODE_ENV === "production")
    return;
  _r();
  const n = Xe.length ? Xe[Xe.length - 1].component : null, r = n && n.appContext.config.warnHandler, s = $c();
  if (r)
    Ze(r, n, 11, [
      e + t.join(""),
      n && n.proxy,
      s.map(({ vnode: o }) => `at <${Co(n, o.type)}>`).join(`
`),
      s
    ]);
  else {
    const o = [`[Vue warn]: ${e}`, ...t];
    s.length && o.push(`
`, ...Vc(s)), console.warn(...o);
  }
  br();
}
function $c() {
  let e = Xe[Xe.length - 1];
  if (!e)
    return [];
  const t = [];
  for (; e; ) {
    const n = t[0];
    n && n.vnode === e ? n.recurseCount++ : t.push({
      vnode: e,
      recurseCount: 0
    });
    const r = e.component && e.component.parent;
    e = r && r.vnode;
  }
  return t;
}
function Vc(e) {
  const t = [];
  return e.forEach((n, r) => {
    t.push(...r === 0 ? [] : [`
`], ...Lc(n));
  }), t;
}
function Lc({ vnode: e, recurseCount: t }) {
  const n = t > 0 ? `... (${t} recursive calls)` : "", r = e.component ? e.component.parent == null : !1, s = ` at <${Co(e.component, e.type, r)}`, o = ">" + n;
  return e.props ? [s, ...Mc(e.props), o] : [s + o];
}
function Mc(e) {
  const t = [], n = Object.keys(e);
  return n.slice(0, 3).forEach((r) => {
    t.push(...yo(r, e[r]));
  }), n.length > 3 && t.push(" ..."), t;
}
function yo(e, t, n) {
  return be(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : J(t) ? (t = yo(e, C(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : ee(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = C(t), n ? t : [`${e}=`, t]);
}
const Ir = {
  sp: "serverPrefetch hook",
  bc: "beforeCreate hook",
  c: "created hook",
  bm: "beforeMount hook",
  m: "mounted hook",
  bu: "beforeUpdate hook",
  u: "updated",
  bum: "beforeUnmount hook",
  um: "unmounted hook",
  a: "activated hook",
  da: "deactivated hook",
  ec: "errorCaptured hook",
  rtc: "renderTracked hook",
  rtg: "renderTriggered hook",
  [
    0
    /* ErrorCodes.SETUP_FUNCTION */
  ]: "setup function",
  [
    1
    /* ErrorCodes.RENDER_FUNCTION */
  ]: "render function",
  [
    2
    /* ErrorCodes.WATCH_GETTER */
  ]: "watcher getter",
  [
    3
    /* ErrorCodes.WATCH_CALLBACK */
  ]: "watcher callback",
  [
    4
    /* ErrorCodes.WATCH_CLEANUP */
  ]: "watcher cleanup function",
  [
    5
    /* ErrorCodes.NATIVE_EVENT_HANDLER */
  ]: "native event handler",
  [
    6
    /* ErrorCodes.COMPONENT_EVENT_HANDLER */
  ]: "component event handler",
  [
    7
    /* ErrorCodes.VNODE_HOOK */
  ]: "vnode hook",
  [
    8
    /* ErrorCodes.DIRECTIVE_HOOK */
  ]: "directive hook",
  [
    9
    /* ErrorCodes.TRANSITION_HOOK */
  ]: "transition hook",
  [
    10
    /* ErrorCodes.APP_ERROR_HANDLER */
  ]: "app errorHandler",
  [
    11
    /* ErrorCodes.APP_WARN_HANDLER */
  ]: "app warnHandler",
  [
    12
    /* ErrorCodes.FUNCTION_REF */
  ]: "ref function",
  [
    13
    /* ErrorCodes.ASYNC_COMPONENT_LOADER */
  ]: "async component loader",
  [
    14
    /* ErrorCodes.SCHEDULER */
  ]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core"
};
function Ze(e, t, n, r) {
  let s;
  try {
    s = r ? e(...r) : e();
  } catch (o) {
    Eo(o, t, n);
  }
  return s;
}
function pn(e, t, n, r) {
  if (ee(e)) {
    const o = Ze(e, t, n, r);
    return o && Ha(o) && o.catch((i) => {
      Eo(i, t, n);
    }), o;
  }
  const s = [];
  for (let o = 0; o < e.length; o++)
    s.push(pn(e[o], t, n, r));
  return s;
}
function Eo(e, t, n, r = !0) {
  const s = t ? t.vnode : null;
  if (t) {
    let o = t.parent;
    const i = t.proxy, a = process.env.NODE_ENV !== "production" ? Ir[n] : n;
    for (; o; ) {
      const l = o.ec;
      if (l) {
        for (let f = 0; f < l.length; f++)
          if (l[f](e, i, a) === !1)
            return;
      }
      o = o.parent;
    }
    const c = t.appContext.config.errorHandler;
    if (c) {
      Ze(c, null, 10, [e, i, a]);
      return;
    }
  }
  jc(e, n, s, r);
}
function jc(e, t, n, r = !0) {
  if (process.env.NODE_ENV !== "production") {
    const s = Ir[t];
    if (n && Cc(n), K(`Unhandled error${s ? ` during execution of ${s}` : ""}`), n && kc(), r)
      throw e;
    console.error(e);
  } else
    console.error(e);
}
let hn = !1, Xn = !1;
const Ee = [];
let Le = 0;
const gt = [];
let we = null, $e = 0;
const _o = /* @__PURE__ */ Promise.resolve();
let xr = null;
const Fc = 100;
function mn(e) {
  const t = xr || _o;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Uc(e) {
  let t = Le + 1, n = Ee.length;
  for (; t < n; ) {
    const r = t + n >>> 1;
    Lt(Ee[r]) < e ? t = r + 1 : n = r;
  }
  return t;
}
function Ar(e) {
  (!Ee.length || !Ee.includes(e, hn && e.allowRecurse ? Le + 1 : Le)) && (e.id == null ? Ee.push(e) : Ee.splice(Uc(e.id), 0, e), bo());
}
function bo() {
  !hn && !Xn && (Xn = !0, xr = _o.then(No));
}
function wo(e) {
  H(e) ? gt.push(...e) : (!we || !we.includes(e, e.allowRecurse ? $e + 1 : $e)) && gt.push(e), bo();
}
function Bc(e) {
  if (gt.length) {
    const t = [...new Set(gt)];
    if (gt.length = 0, we) {
      we.push(...t);
      return;
    }
    for (we = t, process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map()), we.sort((n, r) => Lt(n) - Lt(r)), $e = 0; $e < we.length; $e++)
      process.env.NODE_ENV !== "production" && Oo(e, we[$e]) || we[$e]();
    we = null, $e = 0;
  }
}
const Lt = (e) => e.id == null ? 1 / 0 : e.id, qc = (e, t) => {
  const n = Lt(e) - Lt(t);
  if (n === 0) {
    if (e.pre && !t.pre)
      return -1;
    if (t.pre && !e.pre)
      return 1;
  }
  return n;
};
function No(e) {
  Xn = !1, hn = !0, process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map()), Ee.sort(qc);
  const t = process.env.NODE_ENV !== "production" ? (n) => Oo(e, n) : wn;
  try {
    for (Le = 0; Le < Ee.length; Le++) {
      const n = Ee[Le];
      if (n && n.active !== !1) {
        if (process.env.NODE_ENV !== "production" && t(n))
          continue;
        Ze(
          n,
          null,
          14
          /* ErrorCodes.SCHEDULER */
        );
      }
    }
  } finally {
    Le = 0, Ee.length = 0, Bc(e), hn = !1, xr = null, (Ee.length || gt.length) && No(e);
  }
}
function Oo(e, t) {
  if (!e.has(t))
    e.set(t, 1);
  else {
    const n = e.get(t);
    if (n > Fc) {
      const r = t.ownerInstance, s = r && Po(r.type);
      return K(`Maximum recursive updates exceeded${s ? ` in component <${s}>` : ""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`), !0;
    } else
      e.set(t, n + 1);
  }
}
const Et = /* @__PURE__ */ new Set();
process.env.NODE_ENV !== "production" && (Ya().__VUE_HMR_RUNTIME__ = {
  createRecord: kn(Hc),
  rerender: kn(Gc),
  reload: kn(zc)
});
const gn = /* @__PURE__ */ new Map();
function Hc(e, t) {
  return gn.has(e) ? !1 : (gn.set(e, {
    initialDef: It(t),
    instances: /* @__PURE__ */ new Set()
  }), !0);
}
function It(e) {
  return ko(e) ? e.__vccOpts : e;
}
function Gc(e, t) {
  const n = gn.get(e);
  n && (n.initialDef.render = t, [...n.instances].forEach((r) => {
    t && (r.render = t, It(r.type).render = t), r.renderCache = [], r.update();
  }));
}
function zc(e, t) {
  const n = gn.get(e);
  if (!n)
    return;
  t = It(t), is(n.initialDef, t);
  const r = [...n.instances];
  for (const s of r) {
    const o = It(s.type);
    Et.has(o) || (o !== n.initialDef && is(o, t), Et.add(o)), s.appContext.optionsCache.delete(s.type), s.ceReload ? (Et.add(o), s.ceReload(t.styles), Et.delete(o)) : s.parent ? Ar(s.parent.update) : s.appContext.reload ? s.appContext.reload() : typeof window < "u" ? window.location.reload() : console.warn("[HMR] Root or manually mounted instance modified. Full reload required.");
  }
  wo(() => {
    for (const s of r)
      Et.delete(It(s.type));
  });
}
function is(e, t) {
  _e(e, t);
  for (const n in e)
    n !== "__file" && !(n in t) && delete e[n];
}
function kn(e) {
  return (t, n) => {
    try {
      return e(t, n);
    } catch (r) {
      console.error(r), console.warn("[HMR] Something went wrong during Vue component hot-reload. Full reload required.");
    }
  };
}
let Se = null, Wc = null;
const Jc = (e) => e.__isSuspense;
function Yc(e, t) {
  t && t.pendingBranch ? H(e) ? t.effects.push(...e) : t.effects.push(e) : wo(e);
}
function $n(e, t) {
  if (!se)
    process.env.NODE_ENV !== "production" && K("provide() can only be used inside setup().");
  else {
    let n = se.provides;
    const r = se.parent && se.parent.provides;
    r === n && (n = se.provides = Object.create(r)), n[e] = t;
  }
}
function nt(e, t, n = !1) {
  const r = se || Se;
  if (r) {
    const s = r.parent == null ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides;
    if (s && e in s)
      return s[e];
    if (arguments.length > 1)
      return n && ee(t) ? t.call(r.proxy) : t;
    process.env.NODE_ENV !== "production" && K(`injection "${String(e)}" not found.`);
  } else
    process.env.NODE_ENV !== "production" && K("inject() can only be used inside setup() or functional components.");
}
function Qc(e, t) {
  return Dr(e, null, t);
}
const Qt = {};
function Bt(e, t, n) {
  return process.env.NODE_ENV !== "production" && !ee(t) && K("`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature."), Dr(e, t, n);
}
function Dr(e, t, { immediate: n, deep: r, flush: s, onTrack: o, onTrigger: i } = Ne) {
  process.env.NODE_ENV !== "production" && !t && (n !== void 0 && K('watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.'), r !== void 0 && K('watch() "deep" option is only respected when using the watch(source, callback, options?) signature.'));
  const a = (T) => {
    K("Invalid watch source: ", T, "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.");
  }, c = to() === (se == null ? void 0 : se.scope) ? se : null;
  let l, f = !1, u = !1;
  if (J(e) ? (l = () => e.value, f = fn(e)) : Te(e) ? (l = () => e, r = !0) : H(e) ? (u = !0, f = e.some((T) => Te(T) || fn(T)), l = () => e.map((T) => {
    if (J(T))
      return T.value;
    if (Te(T))
      return ft(T);
    if (ee(T))
      return Ze(
        T,
        c,
        2
        /* ErrorCodes.WATCH_GETTER */
      );
    process.env.NODE_ENV !== "production" && a(T);
  })) : ee(e) ? t ? l = () => Ze(
    e,
    c,
    2
    /* ErrorCodes.WATCH_GETTER */
  ) : l = () => {
    if (!(c && c.isUnmounted))
      return d && d(), pn(e, c, 3, [p]);
  } : (l = wn, process.env.NODE_ENV !== "production" && a(e)), t && r) {
    const T = l;
    l = () => ft(T());
  }
  let d, p = (T) => {
    d = _.onStop = () => {
      Ze(
        T,
        c,
        4
        /* ErrorCodes.WATCH_CLEANUP */
      );
    };
  }, m = u ? new Array(e.length).fill(Qt) : Qt;
  const y = () => {
    if (_.active)
      if (t) {
        const T = _.run();
        (r || f || (u ? T.some((F, z) => kt(F, m[z])) : kt(T, m))) && (d && d(), pn(t, c, 3, [
          T,
          // pass undefined as the old value when it's changed for the first time
          m === Qt ? void 0 : u && m[0] === Qt ? [] : m,
          p
        ]), m = T);
      } else
        _.run();
  };
  y.allowRecurse = !!t;
  let S;
  s === "sync" ? S = y : s === "post" ? S = () => us(y, c && c.suspense) : (y.pre = !0, c && (y.id = c.uid), S = () => Ar(y));
  const _ = new so(l, S);
  return process.env.NODE_ENV !== "production" && (_.onTrack = o, _.onTrigger = i), t ? n ? y() : m = _.run() : s === "post" ? us(_.run.bind(_), c && c.suspense) : _.run(), () => {
    _.stop(), c && c.scope && Ua(c.scope.effects, _);
  };
}
function Kc(e, t, n) {
  const r = this.proxy, s = be(e) ? e.includes(".") ? Xc(r, e) : () => r[e] : e.bind(r, r);
  let o;
  ee(t) ? o = t : (o = t.handler, n = t);
  const i = se;
  tr(this);
  const a = Dr(s, o.bind(r), n);
  return i ? tr(i) : Ro(), a;
}
function Xc(e, t) {
  const n = t.split(".");
  return () => {
    let r = e;
    for (let s = 0; s < n.length && r; s++)
      r = r[n[s]];
    return r;
  };
}
function ft(e, t) {
  if (!le(e) || e.__v_skip || (t = t || /* @__PURE__ */ new Set(), t.has(e)))
    return e;
  if (t.add(e), J(e))
    ft(e.value, t);
  else if (H(e))
    for (let n = 0; n < e.length; n++)
      ft(e[n], t);
  else if (qa(e) || mt(e))
    e.forEach((n) => {
      ft(n, t);
    });
  else if (za(e))
    for (const n in e)
      ft(e[n], t);
  return e;
}
function So(e) {
  return ee(e) ? { setup: e, name: e.name } : e;
}
function Zc(e, t, n = se, r = !1) {
  if (n) {
    const s = n[e] || (n[e] = []), o = t.__weh || (t.__weh = (...i) => {
      if (n.isUnmounted)
        return;
      _r(), tr(n);
      const a = pn(t, n, e, i);
      return Ro(), br(), a;
    });
    return r ? s.unshift(o) : s.push(o), o;
  } else if (process.env.NODE_ENV !== "production") {
    const s = Wa(Ir[e].replace(/ hook$/, ""));
    K(`${s} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`);
  }
}
const eu = (e) => (t, n = se) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  Zc(e, (...r) => t(...r), n)
), tu = eu(
  "bm"
  /* LifecycleHooks.BEFORE_MOUNT */
), nu = Symbol(), Zn = (e) => e ? Eu(e) ? bu(e) || e.proxy : Zn(e.parent) : null, xt = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ _e(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => process.env.NODE_ENV !== "production" ? Yt(e.props) : e.props,
    $attrs: (e) => process.env.NODE_ENV !== "production" ? Yt(e.attrs) : e.attrs,
    $slots: (e) => process.env.NODE_ENV !== "production" ? Yt(e.slots) : e.slots,
    $refs: (e) => process.env.NODE_ENV !== "production" ? Yt(e.refs) : e.refs,
    $parent: (e) => Zn(e.parent),
    $root: (e) => Zn(e.root),
    $emit: (e) => e.emit,
    $options: (e) => __VUE_OPTIONS_API__ ? iu(e) : e.type,
    $forceUpdate: (e) => e.f || (e.f = () => Ar(e.update)),
    $nextTick: (e) => e.n || (e.n = mn.bind(e.proxy)),
    $watch: (e) => __VUE_OPTIONS_API__ ? Kc.bind(e) : wn
  })
), ru = (e) => e === "_" || e === "$", Vn = (e, t) => e !== Ne && !e.__isScriptSetup && Q(e, t), su = {
  get({ _: e }, t) {
    const { ctx: n, setupState: r, data: s, props: o, accessCache: i, type: a, appContext: c } = e;
    if (process.env.NODE_ENV !== "production" && t === "__isVue")
      return !0;
    let l;
    if (t[0] !== "$") {
      const p = i[t];
      if (p !== void 0)
        switch (p) {
          case 1:
            return r[t];
          case 2:
            return s[t];
          case 4:
            return n[t];
          case 3:
            return o[t];
        }
      else {
        if (Vn(r, t))
          return i[t] = 1, r[t];
        if (s !== Ne && Q(s, t))
          return i[t] = 2, s[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (l = e.propsOptions[0]) && Q(l, t)
        )
          return i[t] = 3, o[t];
        if (n !== Ne && Q(n, t))
          return i[t] = 4, n[t];
        (!__VUE_OPTIONS_API__ || ou) && (i[t] = 0);
      }
    }
    const f = xt[t];
    let u, d;
    if (f)
      return t === "$attrs" && (pe(e, "get", t), process.env.NODE_ENV !== "production" && void 0), f(e);
    if (
      // css module (injected by vue-loader)
      (u = a.__cssModules) && (u = u[t])
    )
      return u;
    if (n !== Ne && Q(n, t))
      return i[t] = 4, n[t];
    if (
      // global properties
      d = c.config.globalProperties, Q(d, t)
    )
      return d[t];
    process.env.NODE_ENV !== "production" && Se && (!be(t) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    t.indexOf("__v") !== 0) && (s !== Ne && ru(t[0]) && Q(s, t) ? K(`Property ${JSON.stringify(t)} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`) : e === Se && K(`Property ${JSON.stringify(t)} was accessed during render but is not defined on instance.`));
  },
  set({ _: e }, t, n) {
    const { data: r, setupState: s, ctx: o } = e;
    return Vn(s, t) ? (s[t] = n, !0) : process.env.NODE_ENV !== "production" && s.__isScriptSetup && Q(s, t) ? (K(`Cannot mutate <script setup> binding "${t}" from Options API.`), !1) : r !== Ne && Q(r, t) ? (r[t] = n, !0) : Q(e.props, t) ? (process.env.NODE_ENV !== "production" && K(`Attempting to mutate prop "${t}". Props are readonly.`), !1) : t[0] === "$" && t.slice(1) in e ? (process.env.NODE_ENV !== "production" && K(`Attempting to mutate public property "${t}". Properties starting with $ are reserved and readonly.`), !1) : (process.env.NODE_ENV !== "production" && t in e.appContext.config.globalProperties ? Object.defineProperty(o, t, {
      enumerable: !0,
      configurable: !0,
      value: n
    }) : o[t] = n, !0);
  },
  has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: s, propsOptions: o } }, i) {
    let a;
    return !!n[i] || e !== Ne && Q(e, i) || Vn(t, i) || (a = o[0]) && Q(a, i) || Q(r, i) || Q(xt, i) || Q(s.config.globalProperties, i);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : Q(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
process.env.NODE_ENV !== "production" && (su.ownKeys = (e) => (K("Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."), Reflect.ownKeys(e)));
let ou = !0;
function iu(e) {
  const t = e.type, { mixins: n, extends: r } = t, { mixins: s, optionsCache: o, config: { optionMergeStrategies: i } } = e.appContext, a = o.get(t);
  let c;
  return a ? c = a : !s.length && !n && !r ? c = t : (c = {}, s.length && s.forEach((l) => vn(c, l, i, !0)), vn(c, t, i)), le(t) && o.set(t, c), c;
}
function vn(e, t, n, r = !1) {
  const { mixins: s, extends: o } = t;
  o && vn(e, o, n, !0), s && s.forEach((i) => vn(e, i, n, !0));
  for (const i in t)
    if (r && i === "expose")
      process.env.NODE_ENV !== "production" && K('"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.');
    else {
      const a = au[i] || n && n[i];
      e[i] = a ? a(e[i], t[i]) : t[i];
    }
  return e;
}
const au = {
  data: as,
  props: We,
  emits: We,
  // objects
  methods: We,
  computed: We,
  // lifecycle
  beforeCreate: ce,
  created: ce,
  beforeMount: ce,
  mounted: ce,
  beforeUpdate: ce,
  updated: ce,
  beforeDestroy: ce,
  beforeUnmount: ce,
  destroyed: ce,
  unmounted: ce,
  activated: ce,
  deactivated: ce,
  errorCaptured: ce,
  serverPrefetch: ce,
  // assets
  components: We,
  directives: We,
  // watch
  watch: uu,
  // provide / inject
  provide: as,
  inject: cu
};
function as(e, t) {
  return t ? e ? function() {
    return _e(ee(e) ? e.call(this, this) : e, ee(t) ? t.call(this, this) : t);
  } : t : e;
}
function cu(e, t) {
  return We(cs(e), cs(t));
}
function cs(e) {
  if (H(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function ce(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function We(e, t) {
  return e ? _e(_e(/* @__PURE__ */ Object.create(null), e), t) : t;
}
function uu(e, t) {
  if (!e)
    return t;
  if (!t)
    return e;
  const n = _e(/* @__PURE__ */ Object.create(null), e);
  for (const r in t)
    n[r] = ce(e[r], t[r]);
  return n;
}
function lu() {
  return {
    app: null,
    config: {
      isNativeTag: Ma,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
const us = Yc, fu = (e) => e.__isTeleport, To = Symbol(process.env.NODE_ENV !== "production" ? "Fragment" : void 0), du = Symbol(process.env.NODE_ENV !== "production" ? "Text" : void 0), pu = Symbol(process.env.NODE_ENV !== "production" ? "Comment" : void 0);
Symbol(process.env.NODE_ENV !== "production" ? "Static" : void 0);
let dt = null;
function er(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
const hu = (...e) => Ao(...e), Io = "__vInternal", xo = ({ key: e }) => e ?? null, rn = ({ ref: e, ref_key: t, ref_for: n }) => e != null ? be(e) || J(e) || ee(e) ? { i: Se, r: e, k: t, f: !!n } : e : null;
function mu(e, t = null, n = null, r = 0, s = null, o = e === To ? 0 : 1, i = !1, a = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && xo(t),
    ref: t && rn(t),
    scopeId: Wc,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: o,
    patchFlag: r,
    dynamicProps: s,
    dynamicChildren: null,
    appContext: null,
    ctx: Se
  };
  return a ? (Rr(c, n), o & 128 && e.normalize(c)) : n && (c.shapeFlag |= be(n) ? 8 : 16), process.env.NODE_ENV !== "production" && c.key !== c.key && K("VNode created with invalid key (NaN). VNode type:", c.type), // avoid a block node from tracking itself
  !i && // has current parent block
  dt && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (c.patchFlag > 0 || o & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  c.patchFlag !== 32 && dt.push(c), c;
}
const Ot = process.env.NODE_ENV !== "production" ? hu : Ao;
function Ao(e, t = null, n = null, r = 0, s = null, o = !1) {
  if ((!e || e === nu) && (process.env.NODE_ENV !== "production" && !e && K(`Invalid vnode type when creating vnode: ${e}.`), e = pu), er(e)) {
    const a = yn(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Rr(a, n), !o && dt && (a.shapeFlag & 6 ? dt[dt.indexOf(e)] = a : dt.push(a)), a.patchFlag |= -2, a;
  }
  if (ko(e) && (e = e.__vccOpts), t) {
    t = gu(t);
    let { class: a, style: c } = t;
    a && !be(a) && (t.class = vr(a)), le(c) && (dn(c) && !H(c) && (c = _e({}, c)), t.style = gr(c));
  }
  const i = be(e) ? 1 : Jc(e) ? 128 : fu(e) ? 64 : le(e) ? 4 : ee(e) ? 2 : 0;
  return process.env.NODE_ENV !== "production" && i & 4 && dn(e) && (e = C(e), K("Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.", `
Component that was made reactive: `, e)), mu(e, t, n, r, s, i, o, !0);
}
function gu(e) {
  return e ? dn(e) || Io in e ? _e({}, e) : e : null;
}
function yn(e, t, n = !1) {
  const { props: r, ref: s, patchFlag: o, children: i } = e, a = t ? yu(r || {}, t) : r;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: a,
    key: a && xo(a),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? H(s) ? s.concat(rn(t)) : [s, rn(t)] : rn(t)
    ) : s,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: process.env.NODE_ENV !== "production" && o === -1 && H(i) ? i.map(Do) : i,
    target: e.target,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== To ? o === -1 ? 16 : o | 16 : o,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: e.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && yn(e.ssContent),
    ssFallback: e.ssFallback && yn(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
}
function Do(e) {
  const t = yn(e);
  return H(e.children) && (t.children = e.children.map(Do)), t;
}
function vu(e = " ", t = 0) {
  return Ot(du, null, e, t);
}
function Rr(e, t) {
  let n = 0;
  const { shapeFlag: r } = e;
  if (t == null)
    t = null;
  else if (H(t))
    n = 16;
  else if (typeof t == "object")
    if (r & 65) {
      const s = t.default;
      s && (s._c && (s._d = !1), Rr(e, s()), s._c && (s._d = !0));
      return;
    } else {
      n = 32;
      const s = t._;
      !s && !(Io in t) ? t._ctx = Se : s === 3 && Se && (Se.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else
    ee(t) ? (t = { default: t, _ctx: Se }, n = 32) : (t = String(t), r & 64 ? (n = 16, t = [vu(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function yu(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    for (const s in r)
      if (s === "class")
        t.class !== r.class && (t.class = vr([t.class, r.class]));
      else if (s === "style")
        t.style = gr([t.style, r.style]);
      else if (Fa(s)) {
        const o = t[s], i = r[s];
        i && o !== i && !(H(o) && o.includes(i)) && (t[s] = o ? [].concat(o, i) : i);
      } else
        s !== "" && (t[s] = r[s]);
  }
  return t;
}
lu();
let se = null;
const Pr = () => se || Se, tr = (e) => {
  se = e, e.scope.on();
}, Ro = () => {
  se && se.scope.off(), se = null;
};
function Eu(e) {
  return e.vnode.shapeFlag & 4;
}
let _u = !1;
function bu(e) {
  if (e.exposed)
    return e.exposeProxy || (e.exposeProxy = new Proxy(Ac(Oe(e.exposed)), {
      get(t, n) {
        if (n in t)
          return t[n];
        if (n in xt)
          return xt[n](e);
      },
      has(t, n) {
        return n in t || n in xt;
      }
    }));
}
const wu = /(?:^|[-_])(\w)/g, Nu = (e) => e.replace(wu, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function Po(e, t = !0) {
  return ee(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Co(e, t, n = !1) {
  let r = Po(t);
  if (!r && t.__file) {
    const s = t.__file.match(/([^/\\]+)\.\w+$/);
    s && (r = s[1]);
  }
  if (!r && e && e.parent) {
    const s = (o) => {
      for (const i in o)
        if (o[i] === t)
          return i;
    };
    r = s(e.components || e.parent.type.components) || s(e.appContext.components);
  }
  return r ? Nu(r) : n ? "App" : "Anonymous";
}
function ko(e) {
  return ee(e) && "__vccOpts" in e;
}
const de = (e, t) => Pc(e, t, _u);
function $o(e, t, n) {
  const r = arguments.length;
  return r === 2 ? le(t) && !H(t) ? er(t) ? Ot(e, null, [t]) : Ot(e, t) : Ot(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && er(n) && (n = [n]), Ot(e, t, n));
}
Symbol(process.env.NODE_ENV !== "production" ? "ssrContext" : "");
function Ln(e) {
  return !!(e && e.__v_isShallow);
}
function Ou() {
  if (process.env.NODE_ENV === "production" || typeof window > "u")
    return;
  const e = { style: "color:#3ba776" }, t = { style: "color:#0b1bc9" }, n = { style: "color:#b62e24" }, r = { style: "color:#9d288c" }, s = {
    header(u) {
      return le(u) ? u.__isVue ? ["div", e, "VueInstance"] : J(u) ? [
        "div",
        {},
        ["span", e, f(u)],
        "<",
        a(u.value),
        ">"
      ] : Te(u) ? [
        "div",
        {},
        ["span", e, Ln(u) ? "ShallowReactive" : "Reactive"],
        "<",
        a(u),
        `>${Ue(u) ? " (readonly)" : ""}`
      ] : Ue(u) ? [
        "div",
        {},
        ["span", e, Ln(u) ? "ShallowReadonly" : "Readonly"],
        "<",
        a(u),
        ">"
      ] : null : null;
    },
    hasBody(u) {
      return u && u.__isVue;
    },
    body(u) {
      if (u && u.__isVue)
        return [
          "div",
          {},
          ...o(u.$)
        ];
    }
  };
  function o(u) {
    const d = [];
    u.type.props && u.props && d.push(i("props", C(u.props))), u.setupState !== Ne && d.push(i("setup", u.setupState)), u.data !== Ne && d.push(i("data", C(u.data)));
    const p = c(u, "computed");
    p && d.push(i("computed", p));
    const m = c(u, "inject");
    return m && d.push(i("injected", m)), d.push([
      "div",
      {},
      [
        "span",
        {
          style: r.style + ";opacity:0.66"
        },
        "$ (internal): "
      ],
      ["object", { object: u }]
    ]), d;
  }
  function i(u, d) {
    return d = _e({}, d), Object.keys(d).length ? [
      "div",
      { style: "line-height:1.25em;margin-bottom:0.6em" },
      [
        "div",
        {
          style: "color:#476582"
        },
        u
      ],
      [
        "div",
        {
          style: "padding-left:1.25em"
        },
        ...Object.keys(d).map((p) => [
          "div",
          {},
          ["span", r, p + ": "],
          a(d[p], !1)
        ])
      ]
    ] : ["span", {}];
  }
  function a(u, d = !0) {
    return typeof u == "number" ? ["span", t, u] : typeof u == "string" ? ["span", n, JSON.stringify(u)] : typeof u == "boolean" ? ["span", r, u] : le(u) ? ["object", { object: d ? C(u) : u }] : ["span", n, String(u)];
  }
  function c(u, d) {
    const p = u.type;
    if (ee(p))
      return;
    const m = {};
    for (const y in u.ctx)
      l(p, y, d) && (m[y] = u.ctx[y]);
    return m;
  }
  function l(u, d, p) {
    const m = u[p];
    if (H(m) && m.includes(d) || le(m) && d in m || u.extends && l(u.extends, d, p) || u.mixins && u.mixins.some((y) => l(y, d, p)))
      return !0;
  }
  function f(u) {
    return Ln(u) ? "ShallowRef" : u.effect ? "ComputedRef" : "Ref";
  }
  window.devtoolsFormatters ? window.devtoolsFormatters.push(s) : window.devtoolsFormatters = [s];
}
function Su() {
  Ou();
}
process.env.NODE_ENV !== "production" && Su();
class At {
  /**
   * @constructor
   * @param {Registry} registry - The immutable registry
   * @param {ReturnType<typeof useDataStore>} store - The mutable Pinia store
   * @param {Schema} [schema] - (optional) The Stonecrop schema
   * @param {ImmutableDoctype['workflow']} [workflow] - (optional) The Stonecrop workflow
   * @param {ImmutableDoctype['actions']} [actions] - (optional) The Stonecrop actions
   * @returns {Stonecrop} The Stonecrop instance
   */
  constructor(t, n, r, s, o) {
    if (this.name = "Stonecrop", At._root)
      return At._root;
    At._root = this, this.registry = t, this.store = n, this.schema = r, this.workflow = s, this.actions = o;
  }
  /**
   * @method setup
   * @param {DoctypeMeta} doctype - The doctype to setup
   * @returns {void}
   * @description Sets up the Stonecrop instance with the given doctype
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.setup(doctype)
   */
  setup(t) {
    this.getMeta(t), this.getWorkflow(t), this.getActions(t);
  }
  /**
   * @method getMeta
   * @param {DoctypeMeta} doctype - The doctype to get meta for
   * @returns {void}
   * @description Gets the meta for the given doctype
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.getMeta(doctype)
   */
  getMeta(t) {
    this.schema = { doctype: t.doctype, schema: t.schema };
  }
  /**
   * @method getWorkflow
   * @param {DoctypeMeta} doctype - The doctype to get workflow for
   * @returns {void}
   * @description Gets the workflow for the given doctype
   * @example
   * const doctype = await registry.doctypeLoader('Task')
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
   * const doctype = await registry.doctypeLoader('Task')
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
   * const doctype = await registry.doctypeLoader('Task')
   * await stonecrop.getRecords(doctype)
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * const filters = JSON.stringify({ status: 'Open' })
   * await stonecrop.getRecords(doctype, { body: filters })
   */
  async getRecords(t, n) {
    this.store.$patch({ records: [] });
    const s = await (await fetch(`/${t.slug}`, n)).json();
    this.store.$patch({ records: s });
  }
  /**
   * @method getRecord
   * @param {DoctypeMeta} doctype - The doctype to get record for
   * @param {string} id - The id of the record to get
   * @returns {Promise<void>}
   * @description Gets the record for the given doctype and id
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * await stonecrop.getRecord(doctype, 'TASK-00001')
   */
  async getRecord(t, n) {
    this.store.$patch({ record: {} });
    const s = await (await fetch(`/${t.slug}/${n}`)).json();
    this.store.$patch({ record: s });
  }
  /**
   * @method runAction
   * @param {DoctypeMeta} doctype - The doctype to run action for
   * @param {string} action - The action to run
   * @param {string[]} [id] - The id(s) of the record(s) to run action on
   * @returns {void}
   * @description Runs the action for the given doctype and id
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.runAction(doctype, 'CREATE')
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.runAction(doctype, 'UPDATE', ['TASK-00001'])
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.runAction(doctype, 'DELETE', ['TASK-00001'])
   * @example
   * const doctype = await registry.doctypeLoader('Task')
   * stonecrop.runAction(doctype, 'TRANSITION', ['TASK-00001', 'TASK-00002'])
   */
  runAction(t, n, r) {
    const o = this.registry.registry[t.slug].actions.get(n), { initialState: i } = this.workflow;
    this.workflow.transition(i, { type: n }), o.length > 0 && o.forEach((a) => {
      new Function(a)(r);
    });
  }
}
var Vo = !1;
function Kt(e, t, n) {
  return Array.isArray(e) ? (e.length = Math.max(e.length, t), e.splice(t, 1, n), n) : (e[t] = n, n);
}
function Mn(e, t) {
  if (Array.isArray(e)) {
    e.splice(t, 1);
    return;
  }
  delete e[t];
}
function Tu() {
  return Lo().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function Lo() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const Iu = typeof Proxy == "function", xu = "devtools-plugin:setup", Au = "plugin:settings:set";
let ot, nr;
function Du() {
  var e;
  return ot !== void 0 || (typeof window < "u" && window.performance ? (ot = !0, nr = window.performance) : typeof global < "u" && (!((e = global.perf_hooks) === null || e === void 0) && e.performance) ? (ot = !0, nr = global.perf_hooks.performance) : ot = !1), ot;
}
function Ru() {
  return Du() ? nr.now() : Date.now();
}
let Pu = class {
  constructor(t, n) {
    this.target = null, this.targetQueue = [], this.onQueue = [], this.plugin = t, this.hook = n;
    const r = {};
    if (t.settings)
      for (const i in t.settings) {
        const a = t.settings[i];
        r[i] = a.defaultValue;
      }
    const s = `__vue-devtools-plugin-settings__${t.id}`;
    let o = Object.assign({}, r);
    try {
      const i = localStorage.getItem(s), a = JSON.parse(i);
      Object.assign(o, a);
    } catch {
    }
    this.fallbacks = {
      getSettings() {
        return o;
      },
      setSettings(i) {
        try {
          localStorage.setItem(s, JSON.stringify(i));
        } catch {
        }
        o = i;
      },
      now() {
        return Ru();
      }
    }, n && n.on(Au, (i, a) => {
      i === this.plugin.id && this.fallbacks.setSettings(a);
    }), this.proxiedOn = new Proxy({}, {
      get: (i, a) => this.target ? this.target.on[a] : (...c) => {
        this.onQueue.push({
          method: a,
          args: c
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (i, a) => this.target ? this.target[a] : a === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(a) ? (...c) => (this.targetQueue.push({
        method: a,
        args: c,
        resolve: () => {
        }
      }), this.fallbacks[a](...c)) : (...c) => new Promise((l) => {
        this.targetQueue.push({
          method: a,
          args: c,
          resolve: l
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
function Mo(e, t) {
  const n = e, r = Lo(), s = Tu(), o = Iu && n.enableEarlyProxy;
  if (s && (r.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !o))
    s.emit(xu, e, t);
  else {
    const i = o ? new Pu(n, s) : null;
    (r.__VUE_DEVTOOLS_PLUGINS__ = r.__VUE_DEVTOOLS_PLUGINS__ || []).push({
      pluginDescriptor: n,
      setupFn: t,
      proxy: i
    }), i && t(i.proxiedTarget);
  }
}
/*!
  * pinia v2.0.33
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
let St;
const Mt = (e) => St = e, jo = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
  /* istanbul ignore next */
  Symbol()
);
function rt(e) {
  return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var Ie;
(function(e) {
  e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(Ie || (Ie = {}));
const Sn = typeof window < "u", Dt = (process.env.NODE_ENV !== "production" || !1) && process.env.NODE_ENV !== "test" && Sn, ls = /* @__PURE__ */ (() => typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null })();
function Cu(e, { autoBom: t = !1 } = {}) {
  return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob([String.fromCharCode(65279), e], { type: e.type }) : e;
}
function Cr(e, t, n) {
  const r = new XMLHttpRequest();
  r.open("GET", e), r.responseType = "blob", r.onload = function() {
    Bo(r.response, t, n);
  }, r.onerror = function() {
    console.error("could not download file");
  }, r.send();
}
function Fo(e) {
  const t = new XMLHttpRequest();
  t.open("HEAD", e, !1);
  try {
    t.send();
  } catch {
  }
  return t.status >= 200 && t.status <= 299;
}
function sn(e) {
  try {
    e.dispatchEvent(new MouseEvent("click"));
  } catch {
    const n = document.createEvent("MouseEvents");
    n.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), e.dispatchEvent(n);
  }
}
const on = typeof navigator == "object" ? navigator : { userAgent: "" }, Uo = /* @__PURE__ */ (() => /Macintosh/.test(on.userAgent) && /AppleWebKit/.test(on.userAgent) && !/Safari/.test(on.userAgent))(), Bo = Sn ? (
  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
  typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !Uo ? ku : (
    // Use msSaveOrOpenBlob as a second approach
    "msSaveOrOpenBlob" in on ? $u : (
      // Fallback to using FileReader and a popup
      Vu
    )
  )
) : () => {
};
function ku(e, t = "download", n) {
  const r = document.createElement("a");
  r.download = t, r.rel = "noopener", typeof e == "string" ? (r.href = e, r.origin !== location.origin ? Fo(r.href) ? Cr(e, t, n) : (r.target = "_blank", sn(r)) : sn(r)) : (r.href = URL.createObjectURL(e), setTimeout(function() {
    URL.revokeObjectURL(r.href);
  }, 4e4), setTimeout(function() {
    sn(r);
  }, 0));
}
function $u(e, t = "download", n) {
  if (typeof e == "string")
    if (Fo(e))
      Cr(e, t, n);
    else {
      const r = document.createElement("a");
      r.href = e, r.target = "_blank", setTimeout(function() {
        sn(r);
      });
    }
  else
    navigator.msSaveOrOpenBlob(Cu(e, n), t);
}
function Vu(e, t, n, r) {
  if (r = r || open("", "_blank"), r && (r.document.title = r.document.body.innerText = "downloading..."), typeof e == "string")
    return Cr(e, t, n);
  const s = e.type === "application/octet-stream", o = /constructor/i.test(String(ls.HTMLElement)) || "safari" in ls, i = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((i || s && o || Uo) && typeof FileReader < "u") {
    const a = new FileReader();
    a.onloadend = function() {
      let c = a.result;
      if (typeof c != "string")
        throw r = null, new Error("Wrong reader.result type");
      c = i ? c : c.replace(/^data:[^;]*;/, "data:attachment/file;"), r ? r.location.href = c : location.assign(c), r = null;
    }, a.readAsDataURL(e);
  } else {
    const a = URL.createObjectURL(e);
    r ? r.location.assign(a) : location.href = a, r = null, setTimeout(function() {
      URL.revokeObjectURL(a);
    }, 4e4);
  }
}
function re(e, t) {
  const n = "🍍 " + e;
  typeof __VUE_DEVTOOLS_TOAST__ == "function" ? __VUE_DEVTOOLS_TOAST__(n, t) : t === "error" ? console.error(n) : t === "warn" ? console.warn(n) : console.log(n);
}
function kr(e) {
  return "_a" in e && "install" in e;
}
function qo() {
  if (!("clipboard" in navigator))
    return re("Your browser doesn't support the Clipboard API", "error"), !0;
}
function Ho(e) {
  return e instanceof Error && e.message.toLowerCase().includes("document is not focused") ? (re('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn"), !0) : !1;
}
async function Lu(e) {
  if (!qo())
    try {
      await navigator.clipboard.writeText(JSON.stringify(e.state.value)), re("Global state copied to clipboard.");
    } catch (t) {
      if (Ho(t))
        return;
      re("Failed to serialize the state. Check the console for more details.", "error"), console.error(t);
    }
}
async function Mu(e) {
  if (!qo())
    try {
      e.state.value = JSON.parse(await navigator.clipboard.readText()), re("Global state pasted from clipboard.");
    } catch (t) {
      if (Ho(t))
        return;
      re("Failed to deserialize the state from clipboard. Check the console for more details.", "error"), console.error(t);
    }
}
async function ju(e) {
  try {
    Bo(new Blob([JSON.stringify(e.state.value)], {
      type: "text/plain;charset=utf-8"
    }), "pinia-state.json");
  } catch (t) {
    re("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
let Ae;
function Fu() {
  Ae || (Ae = document.createElement("input"), Ae.type = "file", Ae.accept = ".json");
  function e() {
    return new Promise((t, n) => {
      Ae.onchange = async () => {
        const r = Ae.files;
        if (!r)
          return t(null);
        const s = r.item(0);
        return t(s ? { text: await s.text(), file: s } : null);
      }, Ae.oncancel = () => t(null), Ae.onerror = n, Ae.click();
    });
  }
  return e;
}
async function Uu(e) {
  try {
    const n = await (await Fu())();
    if (!n)
      return;
    const { text: r, file: s } = n;
    e.state.value = JSON.parse(r), re(`Global state imported from "${s.name}".`);
  } catch (t) {
    re("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
function ye(e) {
  return {
    _custom: {
      display: e
    }
  };
}
const Go = "🍍 Pinia (root)", rr = "_root";
function Bu(e) {
  return kr(e) ? {
    id: rr,
    label: Go
  } : {
    id: e.$id,
    label: e.$id
  };
}
function qu(e) {
  if (kr(e)) {
    const n = Array.from(e._s.keys()), r = e._s;
    return {
      state: n.map((o) => ({
        editable: !0,
        key: o,
        value: e.state.value[o]
      })),
      getters: n.filter((o) => r.get(o)._getters).map((o) => {
        const i = r.get(o);
        return {
          editable: !1,
          key: o,
          value: i._getters.reduce((a, c) => (a[c] = i[c], a), {})
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
function Hu(e) {
  return e ? Array.isArray(e) ? e.reduce((t, n) => (t.keys.push(n.key), t.operations.push(n.type), t.oldValue[n.key] = n.oldValue, t.newValue[n.key] = n.newValue, t), {
    oldValue: {},
    keys: [],
    operations: [],
    newValue: {}
  }) : {
    operation: ye(e.type),
    key: ye(e.key),
    oldValue: e.oldValue,
    newValue: e.newValue
  } : {};
}
function Gu(e) {
  switch (e) {
    case Ie.direct:
      return "mutation";
    case Ie.patchFunction:
      return "$patch";
    case Ie.patchObject:
      return "$patch";
    default:
      return "unknown";
  }
}
let pt = !0;
const an = [], Je = "pinia:mutations", ie = "pinia", { assign: zu } = Object, En = (e) => "🍍 " + e;
function Wu(e, t) {
  Mo({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes: an,
    app: e
  }, (n) => {
    typeof n.now != "function" && re("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."), n.addTimelineLayer({
      id: Je,
      label: "Pinia 🍍",
      color: 15064968
    }), n.addInspector({
      id: ie,
      label: "Pinia 🍍",
      icon: "storage",
      treeFilterPlaceholder: "Search stores",
      actions: [
        {
          icon: "content_copy",
          action: () => {
            Lu(t);
          },
          tooltip: "Serialize and copy the state"
        },
        {
          icon: "content_paste",
          action: async () => {
            await Mu(t), n.sendInspectorTree(ie), n.sendInspectorState(ie);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            ju(t);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await Uu(t), n.sendInspectorTree(ie), n.sendInspectorState(ie);
          },
          tooltip: "Import the state from a JSON file"
        }
      ],
      nodeActions: [
        {
          icon: "restore",
          tooltip: "Reset the state (option store only)",
          action: (r) => {
            const s = t._s.get(r);
            s ? s._isOptionsAPI ? (s.$reset(), re(`Store "${r}" reset.`)) : re(`Cannot reset "${r}" store because it's a setup store.`, "warn") : re(`Cannot reset "${r}" store because it wasn't found.`, "warn");
          }
        }
      ]
    }), n.on.inspectComponent((r, s) => {
      const o = r.componentInstance && r.componentInstance.proxy;
      if (o && o._pStores) {
        const i = r.componentInstance.proxy._pStores;
        Object.values(i).forEach((a) => {
          r.instanceData.state.push({
            type: En(a.$id),
            key: "state",
            editable: !0,
            value: a._isOptionsAPI ? {
              _custom: {
                value: C(a.$state),
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
              Object.keys(a.$state).reduce((c, l) => (c[l] = a.$state[l], c), {})
            )
          }), a._getters && a._getters.length && r.instanceData.state.push({
            type: En(a.$id),
            key: "getters",
            editable: !1,
            value: a._getters.reduce((c, l) => {
              try {
                c[l] = a[l];
              } catch (f) {
                c[l] = f;
              }
              return c;
            }, {})
          });
        });
      }
    }), n.on.getInspectorTree((r) => {
      if (r.app === e && r.inspectorId === ie) {
        let s = [t];
        s = s.concat(Array.from(t._s.values())), r.rootNodes = (r.filter ? s.filter((o) => "$id" in o ? o.$id.toLowerCase().includes(r.filter.toLowerCase()) : Go.toLowerCase().includes(r.filter.toLowerCase())) : s).map(Bu);
      }
    }), n.on.getInspectorState((r) => {
      if (r.app === e && r.inspectorId === ie) {
        const s = r.nodeId === rr ? t : t._s.get(r.nodeId);
        if (!s)
          return;
        s && (r.state = qu(s));
      }
    }), n.on.editInspectorState((r, s) => {
      if (r.app === e && r.inspectorId === ie) {
        const o = r.nodeId === rr ? t : t._s.get(r.nodeId);
        if (!o)
          return re(`store "${r.nodeId}" not found`, "error");
        const { path: i } = r;
        kr(o) ? i.unshift("state") : (i.length !== 1 || !o._customProperties.has(i[0]) || i[0] in o.$state) && i.unshift("$state"), pt = !1, r.set(o, i, r.state.value), pt = !0;
      }
    }), n.on.editComponentState((r) => {
      if (r.type.startsWith("🍍")) {
        const s = r.type.replace(/^🍍\s*/, ""), o = t._s.get(s);
        if (!o)
          return re(`store "${s}" not found`, "error");
        const { path: i } = r;
        if (i[0] !== "state")
          return re(`Invalid path for store "${s}":
${i}
Only state can be modified.`);
        i[0] = "$state", pt = !1, r.set(o, i, r.state.value), pt = !0;
      }
    });
  });
}
function Ju(e, t) {
  an.includes(En(t.$id)) || an.push(En(t.$id)), Mo({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes: an,
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
    const r = typeof n.now == "function" ? n.now.bind(n) : Date.now;
    t.$onAction(({ after: i, onError: a, name: c, args: l }) => {
      const f = zo++;
      n.addTimelineEvent({
        layerId: Je,
        event: {
          time: r(),
          title: "🛫 " + c,
          subtitle: "start",
          data: {
            store: ye(t.$id),
            action: ye(c),
            args: l
          },
          groupId: f
        }
      }), i((u) => {
        Ye = void 0, n.addTimelineEvent({
          layerId: Je,
          event: {
            time: r(),
            title: "🛬 " + c,
            subtitle: "end",
            data: {
              store: ye(t.$id),
              action: ye(c),
              args: l,
              result: u
            },
            groupId: f
          }
        });
      }), a((u) => {
        Ye = void 0, n.addTimelineEvent({
          layerId: Je,
          event: {
            time: r(),
            logType: "error",
            title: "💥 " + c,
            subtitle: "end",
            data: {
              store: ye(t.$id),
              action: ye(c),
              args: l,
              error: u
            },
            groupId: f
          }
        });
      });
    }, !0), t._customProperties.forEach((i) => {
      Bt(() => Ke(t[i]), (a, c) => {
        n.notifyComponentUpdate(), n.sendInspectorState(ie), pt && n.addTimelineEvent({
          layerId: Je,
          event: {
            time: r(),
            title: "Change",
            subtitle: i,
            data: {
              newValue: a,
              oldValue: c
            },
            groupId: Ye
          }
        });
      }, { deep: !0 });
    }), t.$subscribe(({ events: i, type: a }, c) => {
      if (n.notifyComponentUpdate(), n.sendInspectorState(ie), !pt)
        return;
      const l = {
        time: r(),
        title: Gu(a),
        data: zu({ store: ye(t.$id) }, Hu(i)),
        groupId: Ye
      };
      Ye = void 0, a === Ie.patchFunction ? l.subtitle = "⤵️" : a === Ie.patchObject ? l.subtitle = "🧩" : i && !Array.isArray(i) && (l.subtitle = i.type), i && (l.data["rawEvent(s)"] = {
        _custom: {
          display: "DebuggerEvent",
          type: "object",
          tooltip: "raw DebuggerEvent[]",
          value: i
        }
      }), n.addTimelineEvent({
        layerId: Je,
        event: l
      });
    }, { detached: !0, flush: "sync" });
    const s = t._hotUpdate;
    t._hotUpdate = Oe((i) => {
      s(i), n.addTimelineEvent({
        layerId: Je,
        event: {
          time: r(),
          title: "🔥 " + t.$id,
          subtitle: "HMR update",
          data: {
            store: ye(t.$id),
            info: ye("HMR update")
          }
        }
      }), n.notifyComponentUpdate(), n.sendInspectorTree(ie), n.sendInspectorState(ie);
    });
    const { $dispose: o } = t;
    t.$dispose = () => {
      o(), n.notifyComponentUpdate(), n.sendInspectorTree(ie), n.sendInspectorState(ie), n.getSettings().logStoreChanges && re(`Disposed "${t.$id}" store 🗑`);
    }, n.notifyComponentUpdate(), n.sendInspectorTree(ie), n.sendInspectorState(ie), n.getSettings().logStoreChanges && re(`"${t.$id}" store installed 🆕`);
  });
}
let zo = 0, Ye;
function fs(e, t) {
  const n = t.reduce((r, s) => (r[s] = C(e)[s], r), {});
  for (const r in n)
    e[r] = function() {
      const s = zo, o = new Proxy(e, {
        get(...i) {
          return Ye = s, Reflect.get(...i);
        },
        set(...i) {
          return Ye = s, Reflect.set(...i);
        }
      });
      return n[r].apply(o, arguments);
    };
}
function Yu({ app: e, store: t, options: n }) {
  if (!t.$id.startsWith("__hot:")) {
    if (n.state && (t._isOptionsAPI = !0), typeof n.state == "function") {
      fs(
        // @ts-expect-error: can cast the store...
        t,
        Object.keys(n.actions)
      );
      const r = t._hotUpdate;
      C(t)._hotUpdate = function(s) {
        r.apply(this, arguments), fs(t, Object.keys(s._hmrPayload.actions));
      };
    }
    Ju(
      e,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      t
    );
  }
}
function Qu() {
  const e = eo(!0), t = e.run(() => Be({}));
  let n = [], r = [];
  const s = Oe({
    install(o) {
      Mt(s), s._a = o, o.provide(jo, s), o.config.globalProperties.$pinia = s, Dt && Wu(o, s), r.forEach((i) => n.push(i)), r = [];
    },
    use(o) {
      return !this._a && !Vo ? r.push(o) : n.push(o), this;
    },
    _p: n,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return Dt && typeof Proxy < "u" && s.use(Yu), s;
}
function Wo(e, t) {
  for (const n in t) {
    const r = t[n];
    if (!(n in e))
      continue;
    const s = e[n];
    rt(s) && rt(r) && !J(r) && !Te(r) ? e[n] = Wo(s, r) : e[n] = r;
  }
  return e;
}
const Jo = () => {
};
function ds(e, t, n, r = Jo) {
  e.push(t);
  const s = () => {
    const o = e.indexOf(t);
    o > -1 && (e.splice(o, 1), r());
  };
  return !n && to() && Xa(s), s;
}
function it(e, ...t) {
  e.slice().forEach((n) => {
    n(...t);
  });
}
function sr(e, t) {
  e instanceof Map && t instanceof Map && t.forEach((n, r) => e.set(r, n)), e instanceof Set && t instanceof Set && t.forEach(e.add, e);
  for (const n in t) {
    if (!t.hasOwnProperty(n))
      continue;
    const r = t[n], s = e[n];
    rt(s) && rt(r) && e.hasOwnProperty(n) && !J(r) && !Te(r) ? e[n] = sr(s, r) : e[n] = r;
  }
  return e;
}
const Ku = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
);
function Xu(e) {
  return !rt(e) || !e.hasOwnProperty(Ku);
}
const { assign: me } = Object;
function ps(e) {
  return !!(J(e) && e.effect);
}
function hs(e, t, n, r) {
  const { state: s, actions: o, getters: i } = t, a = n.state.value[e];
  let c;
  function l() {
    !a && (process.env.NODE_ENV === "production" || !r) && (n.state.value[e] = s ? s() : {});
    const f = process.env.NODE_ENV !== "production" && r ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      os(Be(s ? s() : {}).value)
    ) : os(n.state.value[e]);
    return me(f, o, Object.keys(i || {}).reduce((u, d) => (process.env.NODE_ENV !== "production" && d in f && console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${d}" in store "${e}".`), u[d] = Oe(de(() => {
      Mt(n);
      const p = n._s.get(e);
      return i[d].call(p, p);
    })), u), {}));
  }
  return c = or(e, l, t, n, r, !0), c;
}
function or(e, t, n = {}, r, s, o) {
  let i;
  const a = me({ actions: {} }, n);
  if (process.env.NODE_ENV !== "production" && !r._e.active)
    throw new Error("Pinia destroyed");
  const c = {
    deep: !0
    // flush: 'post',
  };
  process.env.NODE_ENV !== "production" && !Vo && (c.onTrigger = (x) => {
    l ? p = x : l == !1 && !A._hotUpdating && (Array.isArray(p) ? p.push(x) : console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug."));
  });
  let l, f, u = Oe([]), d = Oe([]), p;
  const m = r.state.value[e];
  !o && !m && (process.env.NODE_ENV === "production" || !s) && (r.state.value[e] = {});
  const y = Be({});
  let S;
  function _(x) {
    let w;
    l = f = !1, process.env.NODE_ENV !== "production" && (p = []), typeof x == "function" ? (x(r.state.value[e]), w = {
      type: Ie.patchFunction,
      storeId: e,
      events: p
    }) : (sr(r.state.value[e], x), w = {
      type: Ie.patchObject,
      payload: x,
      storeId: e,
      events: p
    });
    const $ = S = Symbol();
    mn().then(() => {
      S === $ && (l = !0);
    }), f = !0, it(u, w, r.state.value[e]);
  }
  const P = o ? function() {
    const { state: w } = n, $ = w ? w() : {};
    this.$patch((W) => {
      me(W, $);
    });
  } : (
    /* istanbul ignore next */
    process.env.NODE_ENV !== "production" ? () => {
      throw new Error(`🍍: Store "${e}" is built using the setup syntax and does not implement $reset().`);
    } : Jo
  );
  function T() {
    i.stop(), u = [], d = [], r._s.delete(e);
  }
  function F(x, w) {
    return function() {
      Mt(r);
      const $ = Array.from(arguments), W = [], ge = [];
      function h(j) {
        W.push(j);
      }
      function E(j) {
        ge.push(j);
      }
      it(d, {
        args: $,
        name: x,
        store: A,
        after: h,
        onError: E
      });
      let D;
      try {
        D = w.apply(this && this.$id === e ? this : A, $);
      } catch (j) {
        throw it(ge, j), j;
      }
      return D instanceof Promise ? D.then((j) => (it(W, j), j)).catch((j) => (it(ge, j), Promise.reject(j))) : (it(W, D), D);
    };
  }
  const z = /* @__PURE__ */ Oe({
    actions: {},
    getters: {},
    state: [],
    hotState: y
  }), oe = {
    _p: r,
    // _s: scope,
    $id: e,
    $onAction: ds.bind(null, d),
    $patch: _,
    $reset: P,
    $subscribe(x, w = {}) {
      const $ = ds(u, x, w.detached, () => W()), W = i.run(() => Bt(() => r.state.value[e], (ge) => {
        (w.flush === "sync" ? f : l) && x({
          storeId: e,
          type: Ie.direct,
          events: p
        }, ge);
      }, me({}, c, w)));
      return $;
    },
    $dispose: T
  }, A = Ut(process.env.NODE_ENV !== "production" || Dt ? me(
    {
      _hmrPayload: z,
      _customProperties: Oe(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    oe
    // must be added later
    // setupStore
  ) : oe);
  r._s.set(e, A);
  const te = r._e.run(() => (i = eo(), i.run(() => t())));
  for (const x in te) {
    const w = te[x];
    if (J(w) && !ps(w) || Te(w))
      process.env.NODE_ENV !== "production" && s ? Kt(y.value, x, nn(te, x)) : o || (m && Xu(w) && (J(w) ? w.value = m[x] : sr(w, m[x])), r.state.value[e][x] = w), process.env.NODE_ENV !== "production" && z.state.push(x);
    else if (typeof w == "function") {
      const $ = process.env.NODE_ENV !== "production" && s ? w : F(x, w);
      te[x] = $, process.env.NODE_ENV !== "production" && (z.actions[x] = w), a.actions[x] = w;
    } else
      process.env.NODE_ENV !== "production" && ps(w) && (z.getters[x] = o ? (
        // @ts-expect-error
        n.getters[x]
      ) : w, Sn && (te._getters || // @ts-expect-error: same
      (te._getters = Oe([]))).push(x));
  }
  if (me(A, te), me(C(A), te), Object.defineProperty(A, "$state", {
    get: () => process.env.NODE_ENV !== "production" && s ? y.value : r.state.value[e],
    set: (x) => {
      if (process.env.NODE_ENV !== "production" && s)
        throw new Error("cannot set hotState");
      _((w) => {
        me(w, x);
      });
    }
  }), process.env.NODE_ENV !== "production" && (A._hotUpdate = Oe((x) => {
    A._hotUpdating = !0, x._hmrPayload.state.forEach((w) => {
      if (w in A.$state) {
        const $ = x.$state[w], W = A.$state[w];
        typeof $ == "object" && rt($) && rt(W) ? Wo($, W) : x.$state[w] = W;
      }
      Kt(A, w, nn(x.$state, w));
    }), Object.keys(A.$state).forEach((w) => {
      w in x.$state || Mn(A, w);
    }), l = !1, f = !1, r.state.value[e] = nn(x._hmrPayload, "hotState"), f = !0, mn().then(() => {
      l = !0;
    });
    for (const w in x._hmrPayload.actions) {
      const $ = x[w];
      Kt(A, w, F(w, $));
    }
    for (const w in x._hmrPayload.getters) {
      const $ = x._hmrPayload.getters[w], W = o ? (
        // special handling of options api
        de(() => (Mt(r), $.call(A, A)))
      ) : $;
      Kt(A, w, W);
    }
    Object.keys(A._hmrPayload.getters).forEach((w) => {
      w in x._hmrPayload.getters || Mn(A, w);
    }), Object.keys(A._hmrPayload.actions).forEach((w) => {
      w in x._hmrPayload.actions || Mn(A, w);
    }), A._hmrPayload = x._hmrPayload, A._getters = x._getters, A._hotUpdating = !1;
  })), Dt) {
    const x = {
      writable: !0,
      configurable: !0,
      // avoid warning on devtools trying to display this property
      enumerable: !1
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((w) => {
      Object.defineProperty(A, w, me({ value: A[w] }, x));
    });
  }
  return r._p.forEach((x) => {
    if (Dt) {
      const w = i.run(() => x({
        store: A,
        app: r._a,
        pinia: r,
        options: a
      }));
      Object.keys(w || {}).forEach(($) => A._customProperties.add($)), me(A, w);
    } else
      me(A, i.run(() => x({
        store: A,
        app: r._a,
        pinia: r,
        options: a
      })));
  }), process.env.NODE_ENV !== "production" && A.$state && typeof A.$state == "object" && typeof A.$state.constructor == "function" && !A.$state.constructor.toString().includes("[native code]") && console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${A.$id}".`), m && o && n.hydrate && n.hydrate(A.$state, m), l = !0, f = !0, A;
}
function Zu(e, t, n) {
  let r, s;
  const o = typeof t == "function";
  typeof e == "string" ? (r = e, s = o ? n : t) : (s = e, r = e.id);
  function i(a, c) {
    const l = Pr();
    if (a = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (process.env.NODE_ENV === "test" && St && St._testing ? null : a) || l && nt(jo, null), a && Mt(a), process.env.NODE_ENV !== "production" && !St)
      throw new Error(`[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?
	const pinia = createPinia()
	app.use(pinia)
This will fail in production.`);
    a = St, a._s.has(r) || (o ? or(r, t, s, a) : hs(r, s, a), process.env.NODE_ENV !== "production" && (i._pinia = a));
    const f = a._s.get(r);
    if (process.env.NODE_ENV !== "production" && c) {
      const u = "__hot:" + r, d = o ? or(u, t, s, a, !0) : hs(u, me({}, s), a, !0);
      c._hotUpdate(d), delete a.state.value[u], a._s.delete(u);
    }
    if (process.env.NODE_ENV !== "production" && Sn && l && l.proxy && // avoid adding stores that are just built for hot module replacement
    !c) {
      const u = l.proxy, d = "_pStores" in u ? u._pStores : u._pStores = {};
      d[r] = f;
    }
    return f;
  }
  return i.$id = r, i;
}
const el = Zu("data", () => {
  const e = Be([]), t = Be({});
  return { records: e, record: t };
});
function tl(e) {
  e || (e = nt("$registry"));
  const t = el(), n = Be(new At(e, t)), r = Be(!1);
  return tu(async () => {
    var s, o;
    const i = e.router.currentRoute.value, a = (s = i.params.records) == null ? void 0 : s.toString().toLowerCase(), c = (o = i.params.record) == null ? void 0 : o.toString().toLowerCase();
    if (!a && !c)
      return;
    const l = await e.doctypeLoader(a);
    e.addDoctype(l), n.value.setup(l), a && (c ? await n.value.getRecord(l, c) : await n.value.getRecords(l)), n.value.runAction(l, "LOAD", c ? [c] : void 0), r.value = !0;
  }), { stonecrop: n, isReady: r };
}
function nl() {
  return Yo().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function Yo() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const rl = typeof Proxy == "function", sl = "devtools-plugin:setup", ol = "plugin:settings:set";
let at, ir;
function il() {
  var e;
  return at !== void 0 || (typeof window < "u" && window.performance ? (at = !0, ir = window.performance) : typeof global < "u" && (!((e = global.perf_hooks) === null || e === void 0) && e.performance) ? (at = !0, ir = global.perf_hooks.performance) : at = !1), at;
}
function al() {
  return il() ? ir.now() : Date.now();
}
class cl {
  constructor(t, n) {
    this.target = null, this.targetQueue = [], this.onQueue = [], this.plugin = t, this.hook = n;
    const r = {};
    if (t.settings)
      for (const i in t.settings) {
        const a = t.settings[i];
        r[i] = a.defaultValue;
      }
    const s = `__vue-devtools-plugin-settings__${t.id}`;
    let o = Object.assign({}, r);
    try {
      const i = localStorage.getItem(s), a = JSON.parse(i);
      Object.assign(o, a);
    } catch {
    }
    this.fallbacks = {
      getSettings() {
        return o;
      },
      setSettings(i) {
        try {
          localStorage.setItem(s, JSON.stringify(i));
        } catch {
        }
        o = i;
      },
      now() {
        return al();
      }
    }, n && n.on(ol, (i, a) => {
      i === this.plugin.id && this.fallbacks.setSettings(a);
    }), this.proxiedOn = new Proxy({}, {
      get: (i, a) => this.target ? this.target.on[a] : (...c) => {
        this.onQueue.push({
          method: a,
          args: c
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (i, a) => this.target ? this.target[a] : a === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(a) ? (...c) => (this.targetQueue.push({
        method: a,
        args: c,
        resolve: () => {
        }
      }), this.fallbacks[a](...c)) : (...c) => new Promise((l) => {
        this.targetQueue.push({
          method: a,
          args: c,
          resolve: l
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
function ul(e, t) {
  const n = e, r = Yo(), s = nl(), o = rl && n.enableEarlyProxy;
  if (s && (r.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !o))
    s.emit(sl, e, t);
  else {
    const i = o ? new cl(n, s) : null;
    (r.__VUE_DEVTOOLS_PLUGINS__ = r.__VUE_DEVTOOLS_PLUGINS__ || []).push({
      pluginDescriptor: n,
      setupFn: t,
      proxy: i
    }), i && t(i.proxiedTarget);
  }
}
/*!
  * vue-router v4.1.6
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
const Re = typeof window < "u";
function ll(e) {
  return e.__esModule || e[Symbol.toStringTag] === "Module";
}
const q = Object.assign;
function jn(e, t) {
  const n = {};
  for (const r in t) {
    const s = t[r];
    n[r] = he(s) ? s.map(e) : e(s);
  }
  return n;
}
const Rt = () => {
}, he = Array.isArray;
function M(e) {
  const t = Array.from(arguments).slice(1);
  console.warn.apply(console, ["[Vue Router warn]: " + e].concat(t));
}
const fl = /\/$/, dl = (e) => e.replace(fl, "");
function Fn(e, t, n = "/") {
  let r, s = {}, o = "", i = "";
  const a = t.indexOf("#");
  let c = t.indexOf("?");
  return a < c && a >= 0 && (c = -1), c > -1 && (r = t.slice(0, c), o = t.slice(c + 1, a > -1 ? a : t.length), s = e(o)), a > -1 && (r = r || t.slice(0, a), i = t.slice(a, t.length)), r = ml(r ?? t, n), {
    fullPath: r + (o && "?") + o + i,
    path: r,
    query: s,
    hash: i
  };
}
function pl(e, t) {
  const n = t.query ? e(t.query) : "";
  return t.path + (n && "?") + n + (t.hash || "");
}
function ms(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || "/";
}
function gs(e, t, n) {
  const r = t.matched.length - 1, s = n.matched.length - 1;
  return r > -1 && r === s && qe(t.matched[r], n.matched[s]) && Qo(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function qe(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t);
}
function Qo(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (!hl(e[n], t[n]))
      return !1;
  return !0;
}
function hl(e, t) {
  return he(e) ? vs(e, t) : he(t) ? vs(t, e) : e === t;
}
function vs(e, t) {
  return he(t) ? e.length === t.length && e.every((n, r) => n === t[r]) : e.length === 1 && e[0] === t;
}
function ml(e, t) {
  if (e.startsWith("/"))
    return e;
  if (process.env.NODE_ENV !== "production" && !t.startsWith("/"))
    return M(`Cannot resolve a relative location without an absolute path. Trying to resolve "${e}" from "${t}". It should look like "/${t}".`), e;
  if (!e)
    return t;
  const n = t.split("/"), r = e.split("/");
  let s = n.length - 1, o, i;
  for (o = 0; o < r.length; o++)
    if (i = r[o], i !== ".")
      if (i === "..")
        s > 1 && s--;
      else
        break;
  return n.slice(0, s).join("/") + "/" + r.slice(o - (o === r.length ? 1 : 0)).join("/");
}
var jt;
(function(e) {
  e.pop = "pop", e.push = "push";
})(jt || (jt = {}));
var Pt;
(function(e) {
  e.back = "back", e.forward = "forward", e.unknown = "";
})(Pt || (Pt = {}));
function gl(e) {
  if (!e)
    if (Re) {
      const t = document.querySelector("base");
      e = t && t.getAttribute("href") || "/", e = e.replace(/^\w+:\/\/[^\/]+/, "");
    } else
      e = "/";
  return e[0] !== "/" && e[0] !== "#" && (e = "/" + e), dl(e);
}
const vl = /^[^#]+#/;
function yl(e, t) {
  return e.replace(vl, "#") + t;
}
function El(e, t) {
  const n = document.documentElement.getBoundingClientRect(), r = e.getBoundingClientRect();
  return {
    behavior: t.behavior,
    left: r.left - n.left - (t.left || 0),
    top: r.top - n.top - (t.top || 0)
  };
}
const Tn = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function _l(e) {
  let t;
  if ("el" in e) {
    const n = e.el, r = typeof n == "string" && n.startsWith("#");
    if (process.env.NODE_ENV !== "production" && typeof e.el == "string" && (!r || !document.getElementById(e.el.slice(1))))
      try {
        const o = document.querySelector(e.el);
        if (r && o) {
          M(`The selector "${e.el}" should be passed as "el: document.querySelector('${e.el}')" because it starts with "#".`);
          return;
        }
      } catch {
        M(`The selector "${e.el}" is invalid. If you are using an id selector, make sure to escape it. You can find more information about escaping characters in selectors at https://mathiasbynens.be/notes/css-escapes or use CSS.escape (https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape).`);
        return;
      }
    const s = typeof n == "string" ? r ? document.getElementById(n.slice(1)) : document.querySelector(n) : n;
    if (!s) {
      process.env.NODE_ENV !== "production" && M(`Couldn't find element using selector "${e.el}" returned by scrollBehavior.`);
      return;
    }
    t = El(s, e);
  } else
    t = e;
  "scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left != null ? t.left : window.pageXOffset, t.top != null ? t.top : window.pageYOffset);
}
function ys(e, t) {
  return (history.state ? history.state.position - t : -1) + e;
}
const ar = /* @__PURE__ */ new Map();
function bl(e, t) {
  ar.set(e, t);
}
function wl(e) {
  const t = ar.get(e);
  return ar.delete(e), t;
}
let Nl = () => location.protocol + "//" + location.host;
function Ko(e, t) {
  const { pathname: n, search: r, hash: s } = t, o = e.indexOf("#");
  if (o > -1) {
    let a = s.includes(e.slice(o)) ? e.slice(o).length : 1, c = s.slice(a);
    return c[0] !== "/" && (c = "/" + c), ms(c, "");
  }
  return ms(n, e) + r + s;
}
function Ol(e, t, n, r) {
  let s = [], o = [], i = null;
  const a = ({ state: d }) => {
    const p = Ko(e, location), m = n.value, y = t.value;
    let S = 0;
    if (d) {
      if (n.value = p, t.value = d, i && i === m) {
        i = null;
        return;
      }
      S = y ? d.position - y.position : 0;
    } else
      r(p);
    s.forEach((_) => {
      _(n.value, m, {
        delta: S,
        type: jt.pop,
        direction: S ? S > 0 ? Pt.forward : Pt.back : Pt.unknown
      });
    });
  };
  function c() {
    i = n.value;
  }
  function l(d) {
    s.push(d);
    const p = () => {
      const m = s.indexOf(d);
      m > -1 && s.splice(m, 1);
    };
    return o.push(p), p;
  }
  function f() {
    const { history: d } = window;
    d.state && d.replaceState(q({}, d.state, { scroll: Tn() }), "");
  }
  function u() {
    for (const d of o)
      d();
    o = [], window.removeEventListener("popstate", a), window.removeEventListener("beforeunload", f);
  }
  return window.addEventListener("popstate", a), window.addEventListener("beforeunload", f), {
    pauseListeners: c,
    listen: l,
    destroy: u
  };
}
function Es(e, t, n, r = !1, s = !1) {
  return {
    back: e,
    current: t,
    forward: n,
    replaced: r,
    position: window.history.length,
    scroll: s ? Tn() : null
  };
}
function Sl(e) {
  const { history: t, location: n } = window, r = {
    value: Ko(e, n)
  }, s = { value: t.state };
  s.value || o(r.value, {
    back: null,
    current: r.value,
    forward: null,
    // the length is off by one, we need to decrease it
    position: t.length - 1,
    replaced: !0,
    // don't add a scroll as the user may have an anchor, and we want
    // scrollBehavior to be triggered without a saved position
    scroll: null
  }, !0);
  function o(c, l, f) {
    const u = e.indexOf("#"), d = u > -1 ? (n.host && document.querySelector("base") ? e : e.slice(u)) + c : Nl() + e + c;
    try {
      t[f ? "replaceState" : "pushState"](l, "", d), s.value = l;
    } catch (p) {
      process.env.NODE_ENV !== "production" ? M("Error with push/replace State", p) : console.error(p), n[f ? "replace" : "assign"](d);
    }
  }
  function i(c, l) {
    const f = q({}, t.state, Es(
      s.value.back,
      // keep back and forward entries but override current position
      c,
      s.value.forward,
      !0
    ), l, { position: s.value.position });
    o(c, f, !0), r.value = c;
  }
  function a(c, l) {
    const f = q(
      {},
      // use current history state to gracefully handle a wrong call to
      // history.replaceState
      // https://github.com/vuejs/router/issues/366
      s.value,
      t.state,
      {
        forward: c,
        scroll: Tn()
      }
    );
    process.env.NODE_ENV !== "production" && !t.state && M(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:

history.replaceState(history.state, '', url)

You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`), o(f.current, f, !0);
    const u = q({}, Es(r.value, c, null), { position: f.position + 1 }, l);
    o(c, u, !1), r.value = c;
  }
  return {
    location: r,
    state: s,
    push: a,
    replace: i
  };
}
function Tl(e) {
  e = gl(e);
  const t = Sl(e), n = Ol(e, t.state, t.location, t.replace);
  function r(o, i = !0) {
    i || n.pauseListeners(), history.go(o);
  }
  const s = q({
    // it's overridden right after
    location: "",
    base: e,
    go: r,
    createHref: yl.bind(null, e)
  }, t, n);
  return Object.defineProperty(s, "location", {
    enumerable: !0,
    get: () => t.location.value
  }), Object.defineProperty(s, "state", {
    enumerable: !0,
    get: () => t.state.value
  }), s;
}
function Il(e) {
  return typeof e == "string" || e && typeof e == "object";
}
function Xo(e) {
  return typeof e == "string" || typeof e == "symbol";
}
const ke = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
}, cr = Symbol(process.env.NODE_ENV !== "production" ? "navigation failure" : "");
var _s;
(function(e) {
  e[e.aborted = 4] = "aborted", e[e.cancelled = 8] = "cancelled", e[e.duplicated = 16] = "duplicated";
})(_s || (_s = {}));
const xl = {
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
    return `Redirected from "${e.fullPath}" to "${Dl(t)}" via a navigation guard.`;
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
function vt(e, t) {
  return process.env.NODE_ENV !== "production" ? q(new Error(xl[e](t)), {
    type: e,
    [cr]: !0
  }, t) : q(new Error(), {
    type: e,
    [cr]: !0
  }, t);
}
function De(e, t) {
  return e instanceof Error && cr in e && (t == null || !!(e.type & t));
}
const Al = ["params", "query", "hash"];
function Dl(e) {
  if (typeof e == "string")
    return e;
  if ("path" in e)
    return e.path;
  const t = {};
  for (const n of Al)
    n in e && (t[n] = e[n]);
  return JSON.stringify(t, null, 2);
}
const bs = "[^/]+?", Rl = {
  sensitive: !1,
  strict: !1,
  start: !0,
  end: !0
}, Pl = /[.+*?^${}()[\]/\\]/g;
function Cl(e, t) {
  const n = q({}, Rl, t), r = [];
  let s = n.start ? "^" : "";
  const o = [];
  for (const l of e) {
    const f = l.length ? [] : [
      90
      /* PathScore.Root */
    ];
    n.strict && !l.length && (s += "/");
    for (let u = 0; u < l.length; u++) {
      const d = l[u];
      let p = 40 + (n.sensitive ? 0.25 : 0);
      if (d.type === 0)
        u || (s += "/"), s += d.value.replace(Pl, "\\$&"), p += 40;
      else if (d.type === 1) {
        const { value: m, repeatable: y, optional: S, regexp: _ } = d;
        o.push({
          name: m,
          repeatable: y,
          optional: S
        });
        const P = _ || bs;
        if (P !== bs) {
          p += 10;
          try {
            new RegExp(`(${P})`);
          } catch (F) {
            throw new Error(`Invalid custom RegExp for param "${m}" (${P}): ` + F.message);
          }
        }
        let T = y ? `((?:${P})(?:/(?:${P}))*)` : `(${P})`;
        u || (T = // avoid an optional / if there are more segments e.g. /:p?-static
        // or /:p?-:p2
        S && l.length < 2 ? `(?:/${T})` : "/" + T), S && (T += "?"), s += T, p += 20, S && (p += -8), y && (p += -20), P === ".*" && (p += -50);
      }
      f.push(p);
    }
    r.push(f);
  }
  if (n.strict && n.end) {
    const l = r.length - 1;
    r[l][r[l].length - 1] += 0.7000000000000001;
  }
  n.strict || (s += "/?"), n.end ? s += "$" : n.strict && (s += "(?:/|$)");
  const i = new RegExp(s, n.sensitive ? "" : "i");
  function a(l) {
    const f = l.match(i), u = {};
    if (!f)
      return null;
    for (let d = 1; d < f.length; d++) {
      const p = f[d] || "", m = o[d - 1];
      u[m.name] = p && m.repeatable ? p.split("/") : p;
    }
    return u;
  }
  function c(l) {
    let f = "", u = !1;
    for (const d of e) {
      (!u || !f.endsWith("/")) && (f += "/"), u = !1;
      for (const p of d)
        if (p.type === 0)
          f += p.value;
        else if (p.type === 1) {
          const { value: m, repeatable: y, optional: S } = p, _ = m in l ? l[m] : "";
          if (he(_) && !y)
            throw new Error(`Provided param "${m}" is an array but it is not repeatable (* or + modifiers)`);
          const P = he(_) ? _.join("/") : _;
          if (!P)
            if (S)
              d.length < 2 && (f.endsWith("/") ? f = f.slice(0, -1) : u = !0);
            else
              throw new Error(`Missing required param "${m}"`);
          f += P;
        }
    }
    return f || "/";
  }
  return {
    re: i,
    score: r,
    keys: o,
    parse: a,
    stringify: c
  };
}
function kl(e, t) {
  let n = 0;
  for (; n < e.length && n < t.length; ) {
    const r = t[n] - e[n];
    if (r)
      return r;
    n++;
  }
  return e.length < t.length ? e.length === 1 && e[0] === 40 + 40 ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === 40 + 40 ? 1 : -1 : 0;
}
function $l(e, t) {
  let n = 0;
  const r = e.score, s = t.score;
  for (; n < r.length && n < s.length; ) {
    const o = kl(r[n], s[n]);
    if (o)
      return o;
    n++;
  }
  if (Math.abs(s.length - r.length) === 1) {
    if (ws(r))
      return 1;
    if (ws(s))
      return -1;
  }
  return s.length - r.length;
}
function ws(e) {
  const t = e[e.length - 1];
  return e.length > 0 && t[t.length - 1] < 0;
}
const Vl = {
  type: 0,
  value: ""
}, Ll = /[a-zA-Z0-9_]/;
function Ml(e) {
  if (!e)
    return [[]];
  if (e === "/")
    return [[Vl]];
  if (!e.startsWith("/"))
    throw new Error(process.env.NODE_ENV !== "production" ? `Route paths should start with a "/": "${e}" should be "/${e}".` : `Invalid path "${e}"`);
  function t(p) {
    throw new Error(`ERR (${n})/"${l}": ${p}`);
  }
  let n = 0, r = n;
  const s = [];
  let o;
  function i() {
    o && s.push(o), o = [];
  }
  let a = 0, c, l = "", f = "";
  function u() {
    l && (n === 0 ? o.push({
      type: 0,
      value: l
    }) : n === 1 || n === 2 || n === 3 ? (o.length > 1 && (c === "*" || c === "+") && t(`A repeatable param (${l}) must be alone in its segment. eg: '/:ids+.`), o.push({
      type: 1,
      value: l,
      regexp: f,
      repeatable: c === "*" || c === "+",
      optional: c === "*" || c === "?"
    })) : t("Invalid state to consume buffer"), l = "");
  }
  function d() {
    l += c;
  }
  for (; a < e.length; ) {
    if (c = e[a++], c === "\\" && n !== 2) {
      r = n, n = 4;
      continue;
    }
    switch (n) {
      case 0:
        c === "/" ? (l && u(), i()) : c === ":" ? (u(), n = 1) : d();
        break;
      case 4:
        d(), n = r;
        break;
      case 1:
        c === "(" ? n = 2 : Ll.test(c) ? d() : (u(), n = 0, c !== "*" && c !== "?" && c !== "+" && a--);
        break;
      case 2:
        c === ")" ? f[f.length - 1] == "\\" ? f = f.slice(0, -1) + c : n = 3 : f += c;
        break;
      case 3:
        u(), n = 0, c !== "*" && c !== "?" && c !== "+" && a--, f = "";
        break;
      default:
        t("Unknown state");
        break;
    }
  }
  return n === 2 && t(`Unfinished custom RegExp for param "${l}"`), u(), i(), s;
}
function jl(e, t, n) {
  const r = Cl(Ml(e.path), n);
  if (process.env.NODE_ENV !== "production") {
    const o = /* @__PURE__ */ new Set();
    for (const i of r.keys)
      o.has(i.name) && M(`Found duplicated params with name "${i.name}" for path "${e.path}". Only the last one will be available on "$route.params".`), o.add(i.name);
  }
  const s = q(r, {
    record: e,
    parent: t,
    // these needs to be populated by the parent
    children: [],
    alias: []
  });
  return t && !s.record.aliasOf == !t.record.aliasOf && t.children.push(s), s;
}
function Fl(e, t) {
  const n = [], r = /* @__PURE__ */ new Map();
  t = Ss({ strict: !1, end: !0, sensitive: !1 }, t);
  function s(f) {
    return r.get(f);
  }
  function o(f, u, d) {
    const p = !d, m = Ul(f);
    process.env.NODE_ENV !== "production" && Gl(m, u), m.aliasOf = d && d.record;
    const y = Ss(t, f), S = [
      m
    ];
    if ("alias" in f) {
      const T = typeof f.alias == "string" ? [f.alias] : f.alias;
      for (const F of T)
        S.push(q({}, m, {
          // this allows us to hold a copy of the `components` option
          // so that async components cache is hold on the original record
          components: d ? d.record.components : m.components,
          path: F,
          // we might be the child of an alias
          aliasOf: d ? d.record : m
          // the aliases are always of the same kind as the original since they
          // are defined on the same record
        }));
    }
    let _, P;
    for (const T of S) {
      const { path: F } = T;
      if (u && F[0] !== "/") {
        const z = u.record.path, oe = z[z.length - 1] === "/" ? "" : "/";
        T.path = u.record.path + (F && oe + F);
      }
      if (process.env.NODE_ENV !== "production" && T.path === "*")
        throw new Error(`Catch all routes ("*") must now be defined using a param with a custom regexp.
See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.`);
      if (_ = jl(T, u, y), process.env.NODE_ENV !== "production" && u && F[0] === "/" && zl(_, u), d ? (d.alias.push(_), process.env.NODE_ENV !== "production" && Hl(d, _)) : (P = P || _, P !== _ && P.alias.push(_), p && f.name && !Os(_) && i(f.name)), m.children) {
        const z = m.children;
        for (let oe = 0; oe < z.length; oe++)
          o(z[oe], _, d && d.children[oe]);
      }
      d = d || _, (_.record.components && Object.keys(_.record.components).length || _.record.name || _.record.redirect) && c(_);
    }
    return P ? () => {
      i(P);
    } : Rt;
  }
  function i(f) {
    if (Xo(f)) {
      const u = r.get(f);
      u && (r.delete(f), n.splice(n.indexOf(u), 1), u.children.forEach(i), u.alias.forEach(i));
    } else {
      const u = n.indexOf(f);
      u > -1 && (n.splice(u, 1), f.record.name && r.delete(f.record.name), f.children.forEach(i), f.alias.forEach(i));
    }
  }
  function a() {
    return n;
  }
  function c(f) {
    let u = 0;
    for (; u < n.length && $l(f, n[u]) >= 0 && // Adding children with empty path should still appear before the parent
    // https://github.com/vuejs/router/issues/1124
    (f.record.path !== n[u].record.path || !Zo(f, n[u])); )
      u++;
    n.splice(u, 0, f), f.record.name && !Os(f) && r.set(f.record.name, f);
  }
  function l(f, u) {
    let d, p = {}, m, y;
    if ("name" in f && f.name) {
      if (d = r.get(f.name), !d)
        throw vt(1, {
          location: f
        });
      if (process.env.NODE_ENV !== "production") {
        const P = Object.keys(f.params || {}).filter((T) => !d.keys.find((F) => F.name === T));
        P.length && M(`Discarded invalid param(s) "${P.join('", "')}" when navigating. See https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22 for more details.`);
      }
      y = d.record.name, p = q(
        // paramsFromLocation is a new object
        Ns(
          u.params,
          // only keep params that exist in the resolved location
          // TODO: only keep optional params coming from a parent record
          d.keys.filter((P) => !P.optional).map((P) => P.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        f.params && Ns(f.params, d.keys.map((P) => P.name))
      ), m = d.stringify(p);
    } else if ("path" in f)
      m = f.path, process.env.NODE_ENV !== "production" && !m.startsWith("/") && M(`The Matcher cannot resolve relative paths but received "${m}". Unless you directly called \`matcher.resolve("${m}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`), d = n.find((P) => P.re.test(m)), d && (p = d.parse(m), y = d.record.name);
    else {
      if (d = u.name ? r.get(u.name) : n.find((P) => P.re.test(u.path)), !d)
        throw vt(1, {
          location: f,
          currentLocation: u
        });
      y = d.record.name, p = q({}, u.params, f.params), m = d.stringify(p);
    }
    const S = [];
    let _ = d;
    for (; _; )
      S.unshift(_.record), _ = _.parent;
    return {
      name: y,
      path: m,
      params: p,
      matched: S,
      meta: ql(S)
    };
  }
  return e.forEach((f) => o(f)), { addRoute: o, resolve: l, removeRoute: i, getRoutes: a, getRecordMatcher: s };
}
function Ns(e, t) {
  const n = {};
  for (const r of t)
    r in e && (n[r] = e[r]);
  return n;
}
function Ul(e) {
  return {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: void 0,
    beforeEnter: e.beforeEnter,
    props: Bl(e),
    children: e.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in e ? e.components || null : e.component && { default: e.component }
  };
}
function Bl(e) {
  const t = {}, n = e.props || !1;
  if ("component" in e)
    t.default = n;
  else
    for (const r in e.components)
      t[r] = typeof n == "boolean" ? n : n[r];
  return t;
}
function Os(e) {
  for (; e; ) {
    if (e.record.aliasOf)
      return !0;
    e = e.parent;
  }
  return !1;
}
function ql(e) {
  return e.reduce((t, n) => q(t, n.meta), {});
}
function Ss(e, t) {
  const n = {};
  for (const r in e)
    n[r] = r in t ? t[r] : e[r];
  return n;
}
function ur(e, t) {
  return e.name === t.name && e.optional === t.optional && e.repeatable === t.repeatable;
}
function Hl(e, t) {
  for (const n of e.keys)
    if (!n.optional && !t.keys.find(ur.bind(null, n)))
      return M(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
  for (const n of t.keys)
    if (!n.optional && !e.keys.find(ur.bind(null, n)))
      return M(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
}
function Gl(e, t) {
  t && t.record.name && !e.name && !e.path && M(`The route named "${String(t.record.name)}" has a child without a name and an empty path. Using that name won't render the empty path child so you probably want to move the name to the child instead. If this is intentional, add a name to the child route to remove the warning.`);
}
function zl(e, t) {
  for (const n of t.keys)
    if (!e.keys.find(ur.bind(null, n)))
      return M(`Absolute path "${e.record.path}" must have the exact same param named "${n.name}" as its parent "${t.record.path}".`);
}
function Zo(e, t) {
  return t.children.some((n) => n === e || Zo(e, n));
}
const ei = /#/g, Wl = /&/g, Jl = /\//g, Yl = /=/g, Ql = /\?/g, ti = /\+/g, Kl = /%5B/g, Xl = /%5D/g, ni = /%5E/g, Zl = /%60/g, ri = /%7B/g, ef = /%7C/g, si = /%7D/g, tf = /%20/g;
function $r(e) {
  return encodeURI("" + e).replace(ef, "|").replace(Kl, "[").replace(Xl, "]");
}
function nf(e) {
  return $r(e).replace(ri, "{").replace(si, "}").replace(ni, "^");
}
function lr(e) {
  return $r(e).replace(ti, "%2B").replace(tf, "+").replace(ei, "%23").replace(Wl, "%26").replace(Zl, "`").replace(ri, "{").replace(si, "}").replace(ni, "^");
}
function rf(e) {
  return lr(e).replace(Yl, "%3D");
}
function sf(e) {
  return $r(e).replace(ei, "%23").replace(Ql, "%3F");
}
function of(e) {
  return e == null ? "" : sf(e).replace(Jl, "%2F");
}
function Ft(e) {
  try {
    return decodeURIComponent("" + e);
  } catch {
    process.env.NODE_ENV !== "production" && M(`Error decoding "${e}". Using original value`);
  }
  return "" + e;
}
function af(e) {
  const t = {};
  if (e === "" || e === "?")
    return t;
  const r = (e[0] === "?" ? e.slice(1) : e).split("&");
  for (let s = 0; s < r.length; ++s) {
    const o = r[s].replace(ti, " "), i = o.indexOf("="), a = Ft(i < 0 ? o : o.slice(0, i)), c = i < 0 ? null : Ft(o.slice(i + 1));
    if (a in t) {
      let l = t[a];
      he(l) || (l = t[a] = [l]), l.push(c);
    } else
      t[a] = c;
  }
  return t;
}
function Ts(e) {
  let t = "";
  for (let n in e) {
    const r = e[n];
    if (n = rf(n), r == null) {
      r !== void 0 && (t += (t.length ? "&" : "") + n);
      continue;
    }
    (he(r) ? r.map((o) => o && lr(o)) : [r && lr(r)]).forEach((o) => {
      o !== void 0 && (t += (t.length ? "&" : "") + n, o != null && (t += "=" + o));
    });
  }
  return t;
}
function cf(e) {
  const t = {};
  for (const n in e) {
    const r = e[n];
    r !== void 0 && (t[n] = he(r) ? r.map((s) => s == null ? null : "" + s) : r == null ? r : "" + r);
  }
  return t;
}
const uf = Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : ""), Is = Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : ""), Vr = Symbol(process.env.NODE_ENV !== "production" ? "router" : ""), oi = Symbol(process.env.NODE_ENV !== "production" ? "route location" : ""), fr = Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
function _t() {
  let e = [];
  function t(r) {
    return e.push(r), () => {
      const s = e.indexOf(r);
      s > -1 && e.splice(s, 1);
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
function Ve(e, t, n, r, s) {
  const o = r && // name is defined if record is because of the function overload
  (r.enterCallbacks[s] = r.enterCallbacks[s] || []);
  return () => new Promise((i, a) => {
    const c = (u) => {
      u === !1 ? a(vt(4, {
        from: n,
        to: t
      })) : u instanceof Error ? a(u) : Il(u) ? a(vt(2, {
        from: t,
        to: u
      })) : (o && // since enterCallbackArray is truthy, both record and name also are
      r.enterCallbacks[s] === o && typeof u == "function" && o.push(u), i());
    }, l = e.call(r && r.instances[s], t, n, process.env.NODE_ENV !== "production" ? lf(c, t, n) : c);
    let f = Promise.resolve(l);
    if (e.length < 3 && (f = f.then(c)), process.env.NODE_ENV !== "production" && e.length > 2) {
      const u = `The "next" callback was never called inside of ${e.name ? '"' + e.name + '"' : ""}:
${e.toString()}
. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;
      if (typeof l == "object" && "then" in l)
        f = f.then((d) => c._called ? d : (M(u), Promise.reject(new Error("Invalid navigation guard"))));
      else if (l !== void 0 && !c._called) {
        M(u), a(new Error("Invalid navigation guard"));
        return;
      }
    }
    f.catch((u) => a(u));
  });
}
function lf(e, t, n) {
  let r = 0;
  return function() {
    r++ === 1 && M(`The "next" callback was called more than once in one navigation guard when going from "${n.fullPath}" to "${t.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`), e._called = !0, r === 1 && e.apply(null, arguments);
  };
}
function Un(e, t, n, r) {
  const s = [];
  for (const o of e) {
    process.env.NODE_ENV !== "production" && !o.components && !o.children.length && M(`Record with path "${o.path}" is either missing a "component(s)" or "children" property.`);
    for (const i in o.components) {
      let a = o.components[i];
      if (process.env.NODE_ENV !== "production") {
        if (!a || typeof a != "object" && typeof a != "function")
          throw M(`Component "${i}" in record with path "${o.path}" is not a valid component. Received "${String(a)}".`), new Error("Invalid route component");
        if ("then" in a) {
          M(`Component "${i}" in record with path "${o.path}" is a Promise instead of a function that returns a Promise. Did you write "import('./MyPage.vue')" instead of "() => import('./MyPage.vue')" ? This will break in production if not fixed.`);
          const c = a;
          a = () => c;
        } else
          a.__asyncLoader && // warn only once per component
          !a.__warnedDefineAsync && (a.__warnedDefineAsync = !0, M(`Component "${i}" in record with path "${o.path}" is defined using "defineAsyncComponent()". Write "() => import('./MyPage.vue')" instead of "defineAsyncComponent(() => import('./MyPage.vue'))".`));
      }
      if (!(t !== "beforeRouteEnter" && !o.instances[i]))
        if (ff(a)) {
          const l = (a.__vccOpts || a)[t];
          l && s.push(Ve(l, n, r, o, i));
        } else {
          let c = a();
          process.env.NODE_ENV !== "production" && !("catch" in c) && (M(`Component "${i}" in record with path "${o.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`), c = Promise.resolve(c)), s.push(() => c.then((l) => {
            if (!l)
              return Promise.reject(new Error(`Couldn't resolve component "${i}" at "${o.path}"`));
            const f = ll(l) ? l.default : l;
            o.components[i] = f;
            const d = (f.__vccOpts || f)[t];
            return d && Ve(d, n, r, o, i)();
          }));
        }
    }
  }
  return s;
}
function ff(e) {
  return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function xs(e) {
  const t = nt(Vr), n = nt(oi), r = de(() => t.resolve(Ke(e.to))), s = de(() => {
    const { matched: c } = r.value, { length: l } = c, f = c[l - 1], u = n.matched;
    if (!f || !u.length)
      return -1;
    const d = u.findIndex(qe.bind(null, f));
    if (d > -1)
      return d;
    const p = As(c[l - 2]);
    return (
      // we are dealing with nested routes
      l > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      As(f) === p && // avoid comparing the child with its parent
      u[u.length - 1].path !== p ? u.findIndex(qe.bind(null, c[l - 2])) : d
    );
  }), o = de(() => s.value > -1 && mf(n.params, r.value.params)), i = de(() => s.value > -1 && s.value === n.matched.length - 1 && Qo(n.params, r.value.params));
  function a(c = {}) {
    return hf(c) ? t[Ke(e.replace) ? "replace" : "push"](
      Ke(e.to)
      // avoid uncaught errors are they are logged anyway
    ).catch(Rt) : Promise.resolve();
  }
  if (process.env.NODE_ENV !== "production" && Re) {
    const c = Pr();
    if (c) {
      const l = {
        route: r.value,
        isActive: o.value,
        isExactActive: i.value
      };
      c.__vrl_devtools = c.__vrl_devtools || [], c.__vrl_devtools.push(l), Qc(() => {
        l.route = r.value, l.isActive = o.value, l.isExactActive = i.value;
      }, { flush: "post" });
    }
  }
  return {
    route: r,
    href: de(() => r.value.href),
    isActive: o,
    isExactActive: i,
    navigate: a
  };
}
const df = /* @__PURE__ */ So({
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
  useLink: xs,
  setup(e, { slots: t }) {
    const n = Ut(xs(e)), { options: r } = nt(Vr), s = de(() => ({
      [Ds(e.activeClass, r.linkActiveClass, "router-link-active")]: n.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [Ds(e.exactActiveClass, r.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
    }));
    return () => {
      const o = t.default && t.default(n);
      return e.custom ? o : $o("a", {
        "aria-current": n.isExactActive ? e.ariaCurrentValue : null,
        href: n.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: n.navigate,
        class: s.value
      }, o);
    };
  }
}), pf = df;
function hf(e) {
  if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(t))
        return;
    }
    return e.preventDefault && e.preventDefault(), !0;
  }
}
function mf(e, t) {
  for (const n in t) {
    const r = t[n], s = e[n];
    if (typeof r == "string") {
      if (r !== s)
        return !1;
    } else if (!he(s) || s.length !== r.length || r.some((o, i) => o !== s[i]))
      return !1;
  }
  return !0;
}
function As(e) {
  return e ? e.aliasOf ? e.aliasOf.path : e.path : "";
}
const Ds = (e, t, n) => e ?? t ?? n, gf = /* @__PURE__ */ So({
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
    process.env.NODE_ENV !== "production" && yf();
    const r = nt(fr), s = de(() => e.route || r.value), o = nt(Is, 0), i = de(() => {
      let l = Ke(o);
      const { matched: f } = s.value;
      let u;
      for (; (u = f[l]) && !u.components; )
        l++;
      return l;
    }), a = de(() => s.value.matched[i.value]);
    $n(Is, de(() => i.value + 1)), $n(uf, a), $n(fr, s);
    const c = Be();
    return Bt(() => [c.value, a.value, e.name], ([l, f, u], [d, p, m]) => {
      f && (f.instances[u] = l, p && p !== f && l && l === d && (f.leaveGuards.size || (f.leaveGuards = p.leaveGuards), f.updateGuards.size || (f.updateGuards = p.updateGuards))), l && f && // if there is no instance but to and from are the same this might be
      // the first visit
      (!p || !qe(f, p) || !d) && (f.enterCallbacks[u] || []).forEach((y) => y(l));
    }, { flush: "post" }), () => {
      const l = s.value, f = e.name, u = a.value, d = u && u.components[f];
      if (!d)
        return Rs(n.default, { Component: d, route: l });
      const p = u.props[f], m = p ? p === !0 ? l.params : typeof p == "function" ? p(l) : p : null, S = $o(d, q({}, m, t, {
        onVnodeUnmounted: (_) => {
          _.component.isUnmounted && (u.instances[f] = null);
        },
        ref: c
      }));
      if (process.env.NODE_ENV !== "production" && Re && S.ref) {
        const _ = {
          depth: i.value,
          name: u.name,
          path: u.path,
          meta: u.meta
        };
        (he(S.ref) ? S.ref.map((T) => T.i) : [S.ref.i]).forEach((T) => {
          T.__vrv_devtools = _;
        });
      }
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        Rs(n.default, { Component: S, route: l }) || S
      );
    };
  }
});
function Rs(e, t) {
  if (!e)
    return null;
  const n = e(t);
  return n.length === 1 ? n[0] : n;
}
const vf = gf;
function yf() {
  const e = Pr(), t = e.parent && e.parent.type.name;
  if (t && (t === "KeepAlive" || t.includes("Transition"))) {
    const n = t === "KeepAlive" ? "keep-alive" : "transition";
    M(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.
Use slot props instead:

<router-view v-slot="{ Component }">
  <${n}>
    <component :is="Component" />
  </${n}>
</router-view>`);
  }
}
function bt(e, t) {
  const n = q({}, e, {
    // remove variables that can contain vue instances
    matched: e.matched.map((r) => If(r, ["instances", "children", "aliasOf"]))
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
function Xt(e) {
  return {
    _custom: {
      display: e
    }
  };
}
let Ef = 0;
function _f(e, t, n) {
  if (t.__hasDevtools)
    return;
  t.__hasDevtools = !0;
  const r = Ef++;
  ul({
    id: "org.vuejs.router" + (r ? "." + r : ""),
    label: "Vue Router",
    packageName: "vue-router",
    homepage: "https://router.vuejs.org",
    logo: "https://router.vuejs.org/logo.png",
    componentStateTypes: ["Routing"],
    app: e
  }, (s) => {
    typeof s.now != "function" && console.warn("[Vue Router]: You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."), s.on.inspectComponent((f, u) => {
      f.instanceData && f.instanceData.state.push({
        type: "Routing",
        key: "$route",
        editable: !1,
        value: bt(t.currentRoute.value, "Current Route")
      });
    }), s.on.visitComponentTree(({ treeNode: f, componentInstance: u }) => {
      if (u.__vrv_devtools) {
        const d = u.__vrv_devtools;
        f.tags.push({
          label: (d.name ? `${d.name.toString()}: ` : "") + d.path,
          textColor: 0,
          tooltip: "This component is rendered by &lt;router-view&gt;",
          backgroundColor: ii
        });
      }
      he(u.__vrl_devtools) && (u.__devtoolsApi = s, u.__vrl_devtools.forEach((d) => {
        let p = ui, m = "";
        d.isExactActive ? (p = ci, m = "This is exactly active") : d.isActive && (p = ai, m = "This link is active"), f.tags.push({
          label: d.route.path,
          textColor: 0,
          tooltip: m,
          backgroundColor: p
        });
      }));
    }), Bt(t.currentRoute, () => {
      c(), s.notifyComponentUpdate(), s.sendInspectorTree(a), s.sendInspectorState(a);
    });
    const o = "router:navigations:" + r;
    s.addTimelineLayer({
      id: o,
      label: `Router${r ? " " + r : ""} Navigations`,
      color: 4237508
    }), t.onError((f, u) => {
      s.addTimelineEvent({
        layerId: o,
        event: {
          title: "Error during Navigation",
          subtitle: u.fullPath,
          logType: "error",
          time: s.now(),
          data: { error: f },
          groupId: u.meta.__navigationId
        }
      });
    });
    let i = 0;
    t.beforeEach((f, u) => {
      const d = {
        guard: Xt("beforeEach"),
        from: bt(u, "Current Location during this navigation"),
        to: bt(f, "Target location")
      };
      Object.defineProperty(f.meta, "__navigationId", {
        value: i++
      }), s.addTimelineEvent({
        layerId: o,
        event: {
          time: s.now(),
          title: "Start of navigation",
          subtitle: f.fullPath,
          data: d,
          groupId: f.meta.__navigationId
        }
      });
    }), t.afterEach((f, u, d) => {
      const p = {
        guard: Xt("afterEach")
      };
      d ? (p.failure = {
        _custom: {
          type: Error,
          readOnly: !0,
          display: d ? d.message : "",
          tooltip: "Navigation Failure",
          value: d
        }
      }, p.status = Xt("❌")) : p.status = Xt("✅"), p.from = bt(u, "Current Location during this navigation"), p.to = bt(f, "Target location"), s.addTimelineEvent({
        layerId: o,
        event: {
          title: "End of navigation",
          subtitle: f.fullPath,
          time: s.now(),
          data: p,
          logType: d ? "warning" : "default",
          groupId: f.meta.__navigationId
        }
      });
    });
    const a = "router-inspector:" + r;
    s.addInspector({
      id: a,
      label: "Routes" + (r ? " " + r : ""),
      icon: "book",
      treeFilterPlaceholder: "Search routes"
    });
    function c() {
      if (!l)
        return;
      const f = l;
      let u = n.getRoutes().filter((d) => !d.parent);
      u.forEach(di), f.filter && (u = u.filter((d) => (
        // save matches state based on the payload
        dr(d, f.filter.toLowerCase())
      ))), u.forEach((d) => fi(d, t.currentRoute.value)), f.rootNodes = u.map(li);
    }
    let l;
    s.on.getInspectorTree((f) => {
      l = f, f.app === e && f.inspectorId === a && c();
    }), s.on.getInspectorState((f) => {
      if (f.app === e && f.inspectorId === a) {
        const d = n.getRoutes().find((p) => p.record.__vd_id === f.nodeId);
        d && (f.state = {
          options: wf(d)
        });
      }
    }), s.sendInspectorTree(a), s.sendInspectorState(a);
  });
}
function bf(e) {
  return e.optional ? e.repeatable ? "*" : "?" : e.repeatable ? "+" : "";
}
function wf(e) {
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
        display: e.keys.map((r) => `${r.name}${bf(r)}`).join(" "),
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
    value: e.alias.map((r) => r.record.path)
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
        display: e.score.map((r) => r.join(", ")).join(" | "),
        tooltip: "Score used to sort routes",
        value: e.score
      }
    }
  }), n;
}
const ii = 15485081, ai = 2450411, ci = 8702998, Nf = 2282478, ui = 16486972, Of = 6710886;
function li(e) {
  const t = [], { record: n } = e;
  n.name != null && t.push({
    label: String(n.name),
    textColor: 0,
    backgroundColor: Nf
  }), n.aliasOf && t.push({
    label: "alias",
    textColor: 0,
    backgroundColor: ui
  }), e.__vd_match && t.push({
    label: "matches",
    textColor: 0,
    backgroundColor: ii
  }), e.__vd_exactActive && t.push({
    label: "exact",
    textColor: 0,
    backgroundColor: ci
  }), e.__vd_active && t.push({
    label: "active",
    textColor: 0,
    backgroundColor: ai
  }), n.redirect && t.push({
    label: typeof n.redirect == "string" ? `redirect: ${n.redirect}` : "redirects",
    textColor: 16777215,
    backgroundColor: Of
  });
  let r = n.__vd_id;
  return r == null && (r = String(Sf++), n.__vd_id = r), {
    id: r,
    label: n.path,
    tags: t,
    children: e.children.map(li)
  };
}
let Sf = 0;
const Tf = /^\/(.*)\/([a-z]*)$/;
function fi(e, t) {
  const n = t.matched.length && qe(t.matched[t.matched.length - 1], e.record);
  e.__vd_exactActive = e.__vd_active = n, n || (e.__vd_active = t.matched.some((r) => qe(r, e.record))), e.children.forEach((r) => fi(r, t));
}
function di(e) {
  e.__vd_match = !1, e.children.forEach(di);
}
function dr(e, t) {
  const n = String(e.re).match(Tf);
  if (e.__vd_match = !1, !n || n.length < 3)
    return !1;
  if (new RegExp(n[1].replace(/\$$/, ""), n[2]).test(t))
    return e.children.forEach((i) => dr(i, t)), e.record.path !== "/" || t === "/" ? (e.__vd_match = e.re.test(t), !0) : !1;
  const s = e.record.path.toLowerCase(), o = Ft(s);
  return !t.startsWith("/") && (o.includes(t) || s.includes(t)) || o.startsWith(t) || s.startsWith(t) || e.record.name && String(e.record.name).includes(t) ? !0 : e.children.some((i) => dr(i, t));
}
function If(e, t) {
  const n = {};
  for (const r in e)
    t.includes(r) || (n[r] = e[r]);
  return n;
}
function xf(e) {
  const t = Fl(e.routes, e), n = e.parseQuery || af, r = e.stringifyQuery || Ts, s = e.history;
  if (process.env.NODE_ENV !== "production" && !s)
    throw new Error('Provide the "history" option when calling "createRouter()": https://next.router.vuejs.org/api/#history.');
  const o = _t(), i = _t(), a = _t(), c = Tc(ke);
  let l = ke;
  Re && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
  const f = jn.bind(null, (g) => "" + g), u = jn.bind(null, of), d = (
    // @ts-expect-error: intentionally avoid the type check
    jn.bind(null, Ft)
  );
  function p(g, O) {
    let b, I;
    return Xo(g) ? (b = t.getRecordMatcher(g), I = O) : I = g, t.addRoute(I, b);
  }
  function m(g) {
    const O = t.getRecordMatcher(g);
    O ? t.removeRoute(O) : process.env.NODE_ENV !== "production" && M(`Cannot remove non-existent route "${String(g)}"`);
  }
  function y() {
    return t.getRoutes().map((g) => g.record);
  }
  function S(g) {
    return !!t.getRecordMatcher(g);
  }
  function _(g, O) {
    if (O = q({}, O || c.value), typeof g == "string") {
      const k = Fn(n, g, O.path), G = t.resolve({ path: k.path }, O), ze = s.createHref(k.fullPath);
      return process.env.NODE_ENV !== "production" && (ze.startsWith("//") ? M(`Location "${g}" resolved to "${ze}". A resolved location cannot start with multiple slashes.`) : G.matched.length || M(`No match found for location with path "${g}"`)), q(k, G, {
        params: d(G.params),
        hash: Ft(k.hash),
        redirectedFrom: void 0,
        href: ze
      });
    }
    let b;
    if ("path" in g)
      process.env.NODE_ENV !== "production" && "params" in g && !("name" in g) && // @ts-expect-error: the type is never
      Object.keys(g.params).length && M(`Path "${// @ts-expect-error: the type is never
      g.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`), b = q({}, g, {
        path: Fn(n, g.path, O.path).path
      });
    else {
      const k = q({}, g.params);
      for (const G in k)
        k[G] == null && delete k[G];
      b = q({}, g, {
        params: u(g.params)
      }), O.params = u(O.params);
    }
    const I = t.resolve(b, O), B = g.hash || "";
    process.env.NODE_ENV !== "production" && B && !B.startsWith("#") && M(`A \`hash\` should always start with the character "#". Replace "${B}" with "#${B}".`), I.params = f(d(I.params));
    const Z = pl(r, q({}, g, {
      hash: nf(B),
      path: I.path
    })), V = s.createHref(Z);
    return process.env.NODE_ENV !== "production" && (V.startsWith("//") ? M(`Location "${g}" resolved to "${V}". A resolved location cannot start with multiple slashes.`) : I.matched.length || M(`No match found for location with path "${"path" in g ? g.path : g}"`)), q({
      fullPath: Z,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash: B,
      query: (
        // if the user is using a custom query lib like qs, we might have
        // nested objects, so we keep the query as is, meaning it can contain
        // numbers at `$route.query`, but at the point, the user will have to
        // use their own type anyway.
        // https://github.com/vuejs/router/issues/328#issuecomment-649481567
        r === Ts ? cf(g.query) : g.query || {}
      )
    }, I, {
      redirectedFrom: void 0,
      href: V
    });
  }
  function P(g) {
    return typeof g == "string" ? Fn(n, g, c.value.path) : q({}, g);
  }
  function T(g, O) {
    if (l !== g)
      return vt(8, {
        from: O,
        to: g
      });
  }
  function F(g) {
    return A(g);
  }
  function z(g) {
    return F(q(P(g), { replace: !0 }));
  }
  function oe(g) {
    const O = g.matched[g.matched.length - 1];
    if (O && O.redirect) {
      const { redirect: b } = O;
      let I = typeof b == "function" ? b(g) : b;
      if (typeof I == "string" && (I = I.includes("?") || I.includes("#") ? I = P(I) : (
        // force empty params
        { path: I }
      ), I.params = {}), process.env.NODE_ENV !== "production" && !("path" in I) && !("name" in I))
        throw M(`Invalid redirect found:
${JSON.stringify(I, null, 2)}
 when navigating to "${g.fullPath}". A redirect must contain a name or path. This will break in production.`), new Error("Invalid redirect");
      return q({
        query: g.query,
        hash: g.hash,
        // avoid transferring params if the redirect has a path
        params: "path" in I ? {} : g.params
      }, I);
    }
  }
  function A(g, O) {
    const b = l = _(g), I = c.value, B = g.state, Z = g.force, V = g.replace === !0, k = oe(b);
    if (k)
      return A(
        q(P(k), {
          state: typeof k == "object" ? q({}, B, k.state) : B,
          force: Z,
          replace: V
        }),
        // keep original redirectedFrom if it exists
        O || b
      );
    const G = b;
    G.redirectedFrom = O;
    let ze;
    return !Z && gs(r, I, b) && (ze = vt(16, { to: G, from: I }), He(
      I,
      I,
      // this is a push, the only way for it to be triggered from a
      // history.listen is with a redirect, which makes it become a push
      !0,
      // This cannot be the first navigation because the initial location
      // cannot be manually navigated to
      !1
    )), (ze ? Promise.resolve(ze) : x(G, I)).catch((ae) => De(ae) ? (
      // navigation redirects still mark the router as ready
      De(
        ae,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? ae : U(ae)
    ) : (
      // reject any unknown error
      j(ae, G, I)
    )).then((ae) => {
      if (ae) {
        if (De(
          ae,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        ))
          return process.env.NODE_ENV !== "production" && // we are redirecting to the same location we were already at
          gs(r, _(ae.to), G) && // and we have done it a couple of times
          O && // @ts-expect-error: added only in dev
          (O._count = O._count ? (
            // @ts-expect-error
            O._count + 1
          ) : 1) > 10 ? (M(`Detected an infinite redirection in a navigation guard when going from "${I.fullPath}" to "${G.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`), Promise.reject(new Error("Infinite redirect in navigation guard"))) : A(
            // keep options
            q({
              // preserve an existing replacement but allow the redirect to override it
              replace: V
            }, P(ae.to), {
              state: typeof ae.to == "object" ? q({}, B, ae.to.state) : B,
              force: Z
            }),
            // preserve the original redirectedFrom if any
            O || G
          );
      } else
        ae = $(G, I, !0, V, B);
      return w(G, I, ae), ae;
    });
  }
  function te(g, O) {
    const b = T(g, O);
    return b ? Promise.reject(b) : Promise.resolve();
  }
  function x(g, O) {
    let b;
    const [I, B, Z] = Af(g, O);
    b = Un(I.reverse(), "beforeRouteLeave", g, O);
    for (const k of I)
      k.leaveGuards.forEach((G) => {
        b.push(Ve(G, g, O));
      });
    const V = te.bind(null, g, O);
    return b.push(V), ct(b).then(() => {
      b = [];
      for (const k of o.list())
        b.push(Ve(k, g, O));
      return b.push(V), ct(b);
    }).then(() => {
      b = Un(B, "beforeRouteUpdate", g, O);
      for (const k of B)
        k.updateGuards.forEach((G) => {
          b.push(Ve(G, g, O));
        });
      return b.push(V), ct(b);
    }).then(() => {
      b = [];
      for (const k of g.matched)
        if (k.beforeEnter && !O.matched.includes(k))
          if (he(k.beforeEnter))
            for (const G of k.beforeEnter)
              b.push(Ve(G, g, O));
          else
            b.push(Ve(k.beforeEnter, g, O));
      return b.push(V), ct(b);
    }).then(() => (g.matched.forEach((k) => k.enterCallbacks = {}), b = Un(Z, "beforeRouteEnter", g, O), b.push(V), ct(b))).then(() => {
      b = [];
      for (const k of i.list())
        b.push(Ve(k, g, O));
      return b.push(V), ct(b);
    }).catch((k) => De(
      k,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? k : Promise.reject(k));
  }
  function w(g, O, b) {
    for (const I of a.list())
      I(g, O, b);
  }
  function $(g, O, b, I, B) {
    const Z = T(g, O);
    if (Z)
      return Z;
    const V = O === ke, k = Re ? history.state : {};
    b && (I || V ? s.replace(g.fullPath, q({
      scroll: V && k && k.scroll
    }, B)) : s.push(g.fullPath, B)), c.value = g, He(g, O, b, V), U();
  }
  let W;
  function ge() {
    W || (W = s.listen((g, O, b) => {
      const I = _(g), B = oe(I);
      if (B) {
        A(q(B, { replace: !0 }), I).catch(Rt);
        return;
      }
      l = I;
      const Z = c.value;
      Re && bl(ys(Z.fullPath, b.delta), Tn()), x(I, Z).catch((V) => De(
        V,
        12
        /* ErrorTypes.NAVIGATION_CANCELLED */
      ) ? V : De(
        V,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? (A(
        V.to,
        I
        // avoid an uncaught rejection, let push call triggerError
      ).then((k) => {
        De(
          k,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && !b.delta && b.type === jt.pop && s.go(-1, !1);
      }).catch(Rt), Promise.reject()) : (b.delta && s.go(-b.delta, !1), j(V, I, Z))).then((V) => {
        V = V || $(
          // after navigation, all matched components are resolved
          I,
          Z,
          !1
        ), V && (b.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
        // entry while a different route is displayed
        !De(
          V,
          8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        ) ? s.go(-b.delta, !1) : b.type === jt.pop && De(
          V,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && s.go(-1, !1)), w(I, Z, V);
      }).catch(Rt);
    }));
  }
  let h = _t(), E = _t(), D;
  function j(g, O, b) {
    U(g);
    const I = E.list();
    return I.length ? I.forEach((B) => B(g, O, b)) : (process.env.NODE_ENV !== "production" && M("uncaught error during route navigation:"), console.error(g)), Promise.reject(g);
  }
  function X() {
    return D && c.value !== ke ? Promise.resolve() : new Promise((g, O) => {
      h.add([g, O]);
    });
  }
  function U(g) {
    return D || (D = !g, ge(), h.list().forEach(([O, b]) => g ? b(g) : O()), h.reset()), g;
  }
  function He(g, O, b, I) {
    const { scrollBehavior: B } = e;
    if (!Re || !B)
      return Promise.resolve();
    const Z = !b && wl(ys(g.fullPath, 0)) || (I || !b) && history.state && history.state.scroll || null;
    return mn().then(() => B(g, O, Z)).then((V) => V && _l(V)).catch((V) => j(V, g, O));
  }
  const xe = (g) => s.go(g);
  let Ge;
  const An = /* @__PURE__ */ new Set();
  return {
    currentRoute: c,
    listening: !0,
    addRoute: p,
    removeRoute: m,
    hasRoute: S,
    getRoutes: y,
    resolve: _,
    options: e,
    push: F,
    replace: z,
    go: xe,
    back: () => xe(-1),
    forward: () => xe(1),
    beforeEach: o.add,
    beforeResolve: i.add,
    afterEach: a.add,
    onError: E.add,
    isReady: X,
    install(g) {
      const O = this;
      g.component("RouterLink", pf), g.component("RouterView", vf), g.config.globalProperties.$router = O, Object.defineProperty(g.config.globalProperties, "$route", {
        enumerable: !0,
        get: () => Ke(c)
      }), Re && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !Ge && c.value === ke && (Ge = !0, F(s.location).catch((B) => {
        process.env.NODE_ENV !== "production" && M("Unexpected error when starting the router:", B);
      }));
      const b = {};
      for (const B in ke)
        b[B] = de(() => c.value[B]);
      g.provide(Vr, O), g.provide(oi, Ut(b)), g.provide(fr, c);
      const I = g.unmount;
      An.add(g), g.unmount = function() {
        An.delete(g), An.size < 1 && (l = ke, W && W(), W = null, c.value = ke, Ge = !1, D = !1), I();
      }, process.env.NODE_ENV !== "production" && Re && _f(g, O, t);
    }
  };
}
function ct(e) {
  return e.reduce((t, n) => t.then(() => n()), Promise.resolve());
}
function Af(e, t) {
  const n = [], r = [], s = [], o = Math.max(t.matched.length, e.matched.length);
  for (let i = 0; i < o; i++) {
    const a = t.matched[i];
    a && (e.matched.find((l) => qe(l, a)) ? r.push(a) : n.push(a));
    const c = e.matched[i];
    c && (t.matched.find((l) => qe(l, c)) || s.push(c));
  }
  return [n, r, s];
}
xf({
  history: Tl(),
  routes: []
});
function Df(e) {
  return e && typeof e.then == "function";
}
Promise.resolve(!1);
Promise.resolve(!0);
var et = Promise.resolve();
function pi(e, t) {
  return e || (e = 0), new Promise(function(n) {
    return setTimeout(function() {
      return n(t);
    }, e);
  });
}
function Rf(e, t) {
  return Math.floor(Math.random() * (t - e + 1) + e);
}
function Lr() {
  return Math.random().toString(36).substring(2);
}
var Ps = 0, Bn = 0;
function In() {
  var e = (/* @__PURE__ */ new Date()).getTime();
  return e === Ps ? (Bn++, e * 1e3 + Bn) : (Ps = e, Bn = 0, e * 1e3);
}
var Pf = In, Cf = "native";
function kf(e) {
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
function $f(e) {
  e.bc.close(), e.subFns = [];
}
function Vf(e, t) {
  try {
    return e.bc.postMessage(t, !1), et;
  } catch (n) {
    return Promise.reject(n);
  }
}
function Lf(e, t) {
  e.messagesCallback = t;
}
function Mf() {
  if (typeof window > "u")
    return !1;
  if (typeof BroadcastChannel == "function") {
    if (BroadcastChannel._pubkey)
      throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
    return !0;
  } else
    return !1;
}
function jf() {
  return 150;
}
var Ff = {
  create: kf,
  close: $f,
  onMessage: Lf,
  postMessage: Vf,
  canBeUsed: Mf,
  type: Cf,
  averageResponseTime: jf,
  microSeconds: Pf
}, hi = (
  /** @class */
  function() {
    function e(t) {
      this.ttl = t, this.map = /* @__PURE__ */ new Map(), this._to = !1;
    }
    return e.prototype.has = function(t) {
      return this.map.has(t);
    }, e.prototype.add = function(t) {
      var n = this;
      this.map.set(t, mi()), this._to || (this._to = !0, setTimeout(function() {
        n._to = !1, Uf(n);
      }, 0));
    }, e.prototype.clear = function() {
      this.map.clear();
    }, e;
  }()
);
function Uf(e) {
  for (var t = mi() - e.ttl, n = e.map[Symbol.iterator](); ; ) {
    var r = n.next().value;
    if (!r)
      return;
    var s = r[0], o = r[1];
    if (o < t)
      e.map.delete(s);
    else
      return;
  }
}
function mi() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function Mr() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = JSON.parse(JSON.stringify(e));
  return typeof t.webWorkerSupport > "u" && (t.webWorkerSupport = !0), t.idb || (t.idb = {}), t.idb.ttl || (t.idb.ttl = 1e3 * 45), t.idb.fallbackInterval || (t.idb.fallbackInterval = 150), e.idb && typeof e.idb.onclose == "function" && (t.idb.onclose = e.idb.onclose), t.localstorage || (t.localstorage = {}), t.localstorage.removeTimeout || (t.localstorage.removeTimeout = 1e3 * 60), e.methods && (t.methods = e.methods), t.node || (t.node = {}), t.node.ttl || (t.node.ttl = 1e3 * 60 * 2), t.node.maxParallelWrites || (t.node.maxParallelWrites = 2048), typeof t.node.useFastPath > "u" && (t.node.useFastPath = !0), t;
}
var Bf = In, qf = "pubkey.broadcast-channel-0-", Pe = "messages", xn = {
  durability: "relaxed"
}, Hf = "idb";
function gi() {
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
function jr(e) {
  e.commit && e.commit();
}
function Gf(e) {
  var t = gi(), n = qf + e, r = t.open(n);
  return r.onupgradeneeded = function(s) {
    var o = s.target.result;
    o.createObjectStore(Pe, {
      keyPath: "id",
      autoIncrement: !0
    });
  }, new Promise(function(s, o) {
    r.onerror = function(i) {
      return o(i);
    }, r.onsuccess = function() {
      s(r.result);
    };
  });
}
function zf(e, t, n) {
  var r = (/* @__PURE__ */ new Date()).getTime(), s = {
    uuid: t,
    time: r,
    data: n
  }, o = e.transaction([Pe], "readwrite", xn);
  return new Promise(function(i, a) {
    o.oncomplete = function() {
      return i();
    }, o.onerror = function(l) {
      return a(l);
    };
    var c = o.objectStore(Pe);
    c.add(s), jr(o);
  });
}
function Wf(e, t) {
  var n = e.transaction(Pe, "readonly", xn), r = n.objectStore(Pe), s = [], o = IDBKeyRange.bound(t + 1, 1 / 0);
  if (r.getAll) {
    var i = r.getAll(o);
    return new Promise(function(c, l) {
      i.onerror = function(f) {
        return l(f);
      }, i.onsuccess = function(f) {
        c(f.target.result);
      };
    });
  }
  function a() {
    try {
      return o = IDBKeyRange.bound(t + 1, 1 / 0), r.openCursor(o);
    } catch {
      return r.openCursor();
    }
  }
  return new Promise(function(c, l) {
    var f = a();
    f.onerror = function(u) {
      return l(u);
    }, f.onsuccess = function(u) {
      var d = u.target.result;
      d ? d.value.id < t + 1 ? d.continue(t + 1) : (s.push(d.value), d.continue()) : (jr(n), c(s));
    };
  });
}
function Jf(e, t) {
  if (e.closed)
    return Promise.resolve([]);
  var n = e.db.transaction(Pe, "readwrite", xn), r = n.objectStore(Pe);
  return Promise.all(t.map(function(s) {
    var o = r.delete(s);
    return new Promise(function(i) {
      o.onsuccess = function() {
        return i();
      };
    });
  }));
}
function Yf(e, t) {
  var n = (/* @__PURE__ */ new Date()).getTime() - t, r = e.transaction(Pe, "readonly", xn), s = r.objectStore(Pe), o = [];
  return new Promise(function(i) {
    s.openCursor().onsuccess = function(a) {
      var c = a.target.result;
      if (c) {
        var l = c.value;
        l.time < n ? (o.push(l), c.continue()) : (jr(r), i(o));
      } else
        i(o);
    };
  });
}
function Qf(e) {
  return Yf(e.db, e.options.idb.ttl).then(function(t) {
    return Jf(e, t.map(function(n) {
      return n.id;
    }));
  });
}
function Kf(e, t) {
  return t = Mr(t), Gf(e).then(function(n) {
    var r = {
      closed: !1,
      lastCursorId: 0,
      channelName: e,
      options: t,
      uuid: Lr(),
      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new hi(t.idb.ttl * 2),
      // ensures we do not read messages in parallel
      writeBlockPromise: et,
      messagesCallback: null,
      readQueuePromises: [],
      db: n
    };
    return n.onclose = function() {
      r.closed = !0, t.idb.onclose && t.idb.onclose();
    }, vi(r), r;
  });
}
function vi(e) {
  e.closed || yi(e).then(function() {
    return pi(e.options.idb.fallbackInterval);
  }).then(function() {
    return vi(e);
  });
}
function Xf(e, t) {
  return !(e.uuid === t.uuid || t.eMIs.has(e.id) || e.data.time < t.messagesCallbackTime);
}
function yi(e) {
  return e.closed || !e.messagesCallback ? et : Wf(e.db, e.lastCursorId).then(function(t) {
    var n = t.filter(function(r) {
      return !!r;
    }).map(function(r) {
      return r.id > e.lastCursorId && (e.lastCursorId = r.id), r;
    }).filter(function(r) {
      return Xf(r, e);
    }).sort(function(r, s) {
      return r.time - s.time;
    });
    return n.forEach(function(r) {
      e.messagesCallback && (e.eMIs.add(r.id), e.messagesCallback(r.data));
    }), et;
  });
}
function Zf(e) {
  e.closed = !0, e.db.close();
}
function ed(e, t) {
  return e.writeBlockPromise = e.writeBlockPromise.then(function() {
    return zf(e.db, e.uuid, t);
  }).then(function() {
    Rf(0, 10) === 0 && Qf(e);
  }), e.writeBlockPromise;
}
function td(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t, yi(e);
}
function nd() {
  return !!gi();
}
function rd(e) {
  return e.idb.fallbackInterval * 2;
}
var sd = {
  create: Kf,
  close: Zf,
  onMessage: td,
  postMessage: ed,
  canBeUsed: nd,
  type: Hf,
  averageResponseTime: rd,
  microSeconds: Bf
}, od = In, id = "pubkey.broadcastChannel-", ad = "localstorage";
function Ei() {
  var e;
  if (typeof window > "u")
    return null;
  try {
    e = window.localStorage, e = window["ie8-eventlistener/storage"] || window.localStorage;
  } catch {
  }
  return e;
}
function _i(e) {
  return id + e;
}
function cd(e, t) {
  return new Promise(function(n) {
    pi().then(function() {
      var r = _i(e.channelName), s = {
        token: Lr(),
        time: (/* @__PURE__ */ new Date()).getTime(),
        data: t,
        uuid: e.uuid
      }, o = JSON.stringify(s);
      Ei().setItem(r, o);
      var i = document.createEvent("Event");
      i.initEvent("storage", !0, !0), i.key = r, i.newValue = o, window.dispatchEvent(i), n();
    });
  });
}
function ud(e, t) {
  var n = _i(e), r = function(o) {
    o.key === n && t(JSON.parse(o.newValue));
  };
  return window.addEventListener("storage", r), r;
}
function ld(e) {
  window.removeEventListener("storage", e);
}
function fd(e, t) {
  if (t = Mr(t), !bi())
    throw new Error("BroadcastChannel: localstorage cannot be used");
  var n = Lr(), r = new hi(t.localstorage.removeTimeout), s = {
    channelName: e,
    uuid: n,
    eMIs: r
    // emittedMessagesIds
  };
  return s.listener = ud(e, function(o) {
    s.messagesCallback && o.uuid !== n && (!o.token || r.has(o.token) || o.data.time && o.data.time < s.messagesCallbackTime || (r.add(o.token), s.messagesCallback(o.data)));
  }), s;
}
function dd(e) {
  ld(e.listener);
}
function pd(e, t, n) {
  e.messagesCallbackTime = n, e.messagesCallback = t;
}
function bi() {
  var e = Ei();
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
function hd() {
  var e = 120, t = navigator.userAgent.toLowerCase();
  return t.includes("safari") && !t.includes("chrome") ? e * 2 : e;
}
var md = {
  create: fd,
  close: dd,
  onMessage: pd,
  postMessage: cd,
  canBeUsed: bi,
  type: ad,
  averageResponseTime: hd,
  microSeconds: od
}, gd = In, vd = "simulate", Fr = /* @__PURE__ */ new Set();
function yd(e) {
  var t = {
    name: e,
    messagesCallback: null
  };
  return Fr.add(t), t;
}
function Ed(e) {
  Fr.delete(e);
}
function _d(e, t) {
  return new Promise(function(n) {
    return setTimeout(function() {
      var r = Array.from(Fr);
      r.filter(function(s) {
        return s.name === e.name;
      }).filter(function(s) {
        return s !== e;
      }).filter(function(s) {
        return !!s.messagesCallback;
      }).forEach(function(s) {
        return s.messagesCallback(t);
      }), n();
    }, 5);
  });
}
function bd(e, t) {
  e.messagesCallback = t;
}
function wd() {
  return !0;
}
function Nd() {
  return 5;
}
var Od = {
  create: yd,
  close: Ed,
  onMessage: bd,
  postMessage: _d,
  canBeUsed: wd,
  type: vd,
  averageResponseTime: Nd,
  microSeconds: gd
}, Cs = [
  Ff,
  // fastest
  sd,
  md
];
function Sd(e) {
  var t = [].concat(e.methods, Cs).filter(Boolean);
  if (e.type) {
    if (e.type === "simulate")
      return Od;
    var n = t.find(function(s) {
      return s.type === e.type;
    });
    if (n)
      return n;
    throw new Error("method-type " + e.type + " not found");
  }
  e.webWorkerSupport || (t = t.filter(function(s) {
    return s.type !== "idb";
  }));
  var r = t.find(function(s) {
    return s.canBeUsed();
  });
  if (r)
    return r;
  throw new Error("No usable method found in " + JSON.stringify(Cs.map(function(s) {
    return s.type;
  })));
}
var wi = /* @__PURE__ */ new Set(), Td = 0, Ur = function(t, n) {
  this.id = Td++, wi.add(this), this.name = t, this.options = Mr(n), this.method = Sd(this.options), this._iL = !1, this._onML = null, this._addEL = {
    message: [],
    internal: []
  }, this._uMP = /* @__PURE__ */ new Set(), this._befC = [], this._prepP = null, Id(this);
};
Ur._pubkey = !0;
Ur.prototype = {
  postMessage: function(t) {
    if (this.closed)
      throw new Error("BroadcastChannel.postMessage(): Cannot post message after channel has closed " + /**
      * In the past when this error appeared, it was really hard to debug.
      * So now we log the msg together with the error so it at least
      * gives some clue about where in your application this happens.
      */
      JSON.stringify(t));
    return ks(this, "message", t);
  },
  postInternal: function(t) {
    return ks(this, "internal", t);
  },
  set onmessage(e) {
    var t = this.method.microSeconds(), n = {
      time: t,
      fn: e
    };
    Vs(this, "message", this._onML), e && typeof e == "function" ? (this._onML = n, $s(this, "message", n)) : this._onML = null;
  },
  addEventListener: function(t, n) {
    var r = this.method.microSeconds(), s = {
      time: r,
      fn: n
    };
    $s(this, t, s);
  },
  removeEventListener: function(t, n) {
    var r = this._addEL[t].find(function(s) {
      return s.fn === n;
    });
    Vs(this, t, r);
  },
  close: function() {
    var t = this;
    if (!this.closed) {
      wi.delete(this), this.closed = !0;
      var n = this._prepP ? this._prepP : et;
      return this._onML = null, this._addEL.message = [], n.then(function() {
        return Promise.all(Array.from(t._uMP));
      }).then(function() {
        return Promise.all(t._befC.map(function(r) {
          return r();
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
function ks(e, t, n) {
  var r = e.method.microSeconds(), s = {
    time: r,
    type: t,
    data: n
  }, o = e._prepP ? e._prepP : et;
  return o.then(function() {
    var i = e.method.postMessage(e._state, s);
    return e._uMP.add(i), i.catch().then(function() {
      return e._uMP.delete(i);
    }), i;
  });
}
function Id(e) {
  var t = e.method.create(e.name, e.options);
  Df(t) ? (e._prepP = t, t.then(function(n) {
    e._state = n;
  })) : e._state = t;
}
function Ni(e) {
  return e._addEL.message.length > 0 || e._addEL.internal.length > 0;
}
function $s(e, t, n) {
  e._addEL[t].push(n), xd(e);
}
function Vs(e, t, n) {
  e._addEL[t] = e._addEL[t].filter(function(r) {
    return r !== n;
  }), Ad(e);
}
function xd(e) {
  if (!e._iL && Ni(e)) {
    var t = function(s) {
      e._addEL[s.type].forEach(function(o) {
        var i = 1e5, a = o.time - i;
        s.time >= a && o.fn(s.data);
      });
    }, n = e.method.microSeconds();
    e._prepP ? e._prepP.then(function() {
      e._iL = !0, e.method.onMessage(e._state, t, n);
    }) : (e._iL = !0, e.method.onMessage(e._state, t, n));
  }
}
function Ad(e) {
  if (e._iL && !Ni(e)) {
    e._iL = !1;
    var t = e.method.microSeconds();
    e.method.onMessage(e._state, null, t);
  }
}
const Ls = {
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
class qn extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   */
  constructor(t, n) {
    super(t), this.name = "DevalueError", this.path = n.join("");
  }
}
function Ms(e) {
  return Object(e) !== e;
}
const Dd = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function Rd(e) {
  const t = Object.getPrototypeOf(e);
  return t === Object.prototype || t === null || Object.getOwnPropertyNames(t).sort().join("\0") === Dd;
}
function Pd(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function ht(e) {
  let t = '"';
  for (let n = 0; n < e.length; n += 1) {
    const r = e.charAt(n), s = r.charCodeAt(0);
    if (r === '"')
      t += '\\"';
    else if (r in Ls)
      t += Ls[r];
    else if (s <= 31)
      t += `\\u${s.toString(16).toUpperCase().padStart(4, "0")}`;
    else if (s >= 55296 && s <= 57343) {
      const o = e.charCodeAt(n + 1);
      s <= 56319 && o >= 56320 && o <= 57343 ? t += r + e[++n] : t += `\\u${s.toString(16).toUpperCase()}`;
    } else
      t += r;
  }
  return t += '"', t;
}
const Br = -1, Oi = -2, Si = -3, Ti = -4, Ii = -5, qr = -6;
function js(e, t) {
  return Cd(JSON.parse(e), t);
}
function Cd(e, t) {
  if (typeof e == "number")
    return s(e, !0);
  if (!Array.isArray(e) || e.length === 0)
    throw new Error("Invalid input");
  const n = (
    /** @type {any[]} */
    e
  ), r = Array(n.length);
  function s(o, i = !1) {
    if (o === Br)
      return;
    if (o === Si)
      return NaN;
    if (o === Ti)
      return 1 / 0;
    if (o === Ii)
      return -1 / 0;
    if (o === qr)
      return -0;
    if (i)
      throw new Error("Invalid input");
    if (o in r)
      return r[o];
    const a = n[o];
    if (!a || typeof a != "object")
      r[o] = a;
    else if (Array.isArray(a))
      if (typeof a[0] == "string") {
        const c = a[0], l = t == null ? void 0 : t[c];
        if (l)
          return r[o] = l(s(a[1]));
        switch (c) {
          case "Date":
            r[o] = new Date(a[1]);
            break;
          case "Set":
            const f = /* @__PURE__ */ new Set();
            r[o] = f;
            for (let p = 1; p < a.length; p += 1)
              f.add(s(a[p]));
            break;
          case "Map":
            const u = /* @__PURE__ */ new Map();
            r[o] = u;
            for (let p = 1; p < a.length; p += 2)
              u.set(s(a[p]), s(a[p + 1]));
            break;
          case "RegExp":
            r[o] = new RegExp(a[1], a[2]);
            break;
          case "Object":
            r[o] = Object(a[1]);
            break;
          case "BigInt":
            r[o] = BigInt(a[1]);
            break;
          case "null":
            const d = /* @__PURE__ */ Object.create(null);
            r[o] = d;
            for (let p = 1; p < a.length; p += 2)
              d[a[p]] = s(a[p + 1]);
            break;
          default:
            throw new Error(`Unknown type ${c}`);
        }
      } else {
        const c = new Array(a.length);
        r[o] = c;
        for (let l = 0; l < a.length; l += 1) {
          const f = a[l];
          f !== Oi && (c[l] = s(f));
        }
      }
    else {
      const c = {};
      r[o] = c;
      for (const l in a) {
        const f = a[l];
        c[l] = s(f);
      }
    }
    return r[o];
  }
  return s(0);
}
function Fs(e, t) {
  const n = [], r = /* @__PURE__ */ new Map(), s = [];
  for (const l in t)
    s.push({ key: l, fn: t[l] });
  const o = [];
  let i = 0;
  function a(l) {
    if (typeof l == "function")
      throw new qn("Cannot stringify a function", o);
    if (r.has(l))
      return r.get(l);
    if (l === void 0)
      return Br;
    if (Number.isNaN(l))
      return Si;
    if (l === 1 / 0)
      return Ti;
    if (l === -1 / 0)
      return Ii;
    if (l === 0 && 1 / l < 0)
      return qr;
    const f = i++;
    r.set(l, f);
    for (const { key: d, fn: p } of s) {
      const m = p(l);
      if (m)
        return n[f] = `["${d}",${a(m)}]`, f;
    }
    let u = "";
    if (Ms(l))
      u = Hn(l);
    else
      switch (Pd(l)) {
        case "Number":
        case "String":
        case "Boolean":
          u = `["Object",${Hn(l)}]`;
          break;
        case "BigInt":
          u = `["BigInt",${l}]`;
          break;
        case "Date":
          u = `["Date","${l.toISOString()}"]`;
          break;
        case "RegExp":
          const { source: p, flags: m } = l;
          u = m ? `["RegExp",${ht(p)},"${m}"]` : `["RegExp",${ht(p)}]`;
          break;
        case "Array":
          u = "[";
          for (let y = 0; y < l.length; y += 1)
            y > 0 && (u += ","), y in l ? (o.push(`[${y}]`), u += a(l[y]), o.pop()) : u += Oi;
          u += "]";
          break;
        case "Set":
          u = '["Set"';
          for (const y of l)
            u += `,${a(y)}`;
          u += "]";
          break;
        case "Map":
          u = '["Map"';
          for (const [y, S] of l)
            o.push(
              `.get(${Ms(y) ? Hn(y) : "..."})`
            ), u += `,${a(y)},${a(S)}`;
          u += "]";
          break;
        default:
          if (!Rd(l))
            throw new qn(
              "Cannot stringify arbitrary non-POJOs",
              o
            );
          if (Object.getOwnPropertySymbols(l).length > 0)
            throw new qn(
              "Cannot stringify POJOs with symbolic keys",
              o
            );
          if (Object.getPrototypeOf(l) === null) {
            u = '["null"';
            for (const y in l)
              o.push(`.${y}`), u += `,${ht(y)},${a(l[y])}`, o.pop();
            u += "]";
          } else {
            u = "{";
            let y = !1;
            for (const S in l)
              y && (u += ","), y = !0, o.push(`.${S}`), u += `${ht(S)}:${a(l[S])}`, o.pop();
            u += "}";
          }
      }
    return n[f] = u, f;
  }
  const c = a(e);
  return c < 0 ? `${c}` : `[${n.join(",")}]`;
}
function Hn(e) {
  const t = typeof e;
  return t === "string" ? ht(e) : e instanceof String ? ht(e.toString()) : e === void 0 ? Br.toString() : e === 0 && 1 / e < 0 ? qr.toString() : t === "bigint" ? `["BigInt","${e}"]` : String(e);
}
function kd(e, t, { initialize: n, type: r }) {
  let s = `${t.$id}-${e.toString()}`, o = new Ur(s, { type: r }), i = !1, a = 0;
  Bt(() => t[e], (f) => {
    i || (a = Date.now(), o.postMessage({ timestamp: a, state: js(Fs(f)) })), i = !1;
  }, { deep: !0 }), o.onmessage = (f) => {
    if (f === void 0) {
      o.postMessage({ timestamp: a, state: js(Fs(t[e])) });
      return;
    }
    f.timestamp <= a || (i = !0, a = f.timestamp, t[e] = f.state);
  };
  let c = () => o.postMessage(void 0), l = () => o.close();
  return n && c(), { sync: c, unshare: l };
}
var $d = (e, t) => Object.keys(t).includes(e), Vd = ({ initialize: e = !0, enable: t = !0, type: n }) => ({ store: r, options: s }) => {
  var o, i;
  let a = ((o = s == null ? void 0 : s.share) == null ? void 0 : o.enable) ?? t, c = ((i = s == null ? void 0 : s.share) == null ? void 0 : i.omit) ?? [];
  !a || Object.keys(r.$state).forEach((l) => {
    var f;
    c.includes(l) || !$d(l, r.$state) || kd(l, r, { initialize: ((f = s == null ? void 0 : s.share) == null ? void 0 : f.initialize) ?? e, type: n });
  });
};
const Ld = Qu();
Ld.use(
  Vd({
    enable: !0,
    initialize: !0
  })
);
const Md = {
  getMeta: Pa`
		query getDoctype($doctype: String!) {
			getMeta(doctype: $doctype) {
				id
				name
				workflow
				schema
				actions
			}
		}
	`
}, Ud = {
  install: (e, t) => {
    if (!t.url)
      throw new Error("Please provide a URL for the GraphQL client");
    const { stonecrop: n } = tl();
    if (!(n.value || n.value.registry))
      throw new Error("Please setup Stonecrop before the GraphQL client");
    Object.assign(n.value, {
      getMeta: async (r) => await Aa(t.url, Md.getMeta, { doctype: r })
    });
  }
};
export {
  Ud as StonecropGraphQl
};
//# sourceMappingURL=graphql-client.js.map
