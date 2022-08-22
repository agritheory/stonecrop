import { shallowRef as tn, unref as ie, computed as $, reactive as _t, nextTick as nn, defineComponent as St, inject as ce, h as Rt, provide as _e, ref as sn, watch as wt, getCurrentInstance as Pt, watchEffect as rn } from "vue";
const Se = (() => {
  let t;
  try {
    t = process.env.NODE_ENV;
  } catch {
    t = "development";
  }
  return t;
})(), V = Symbol("IS_PROXY"), q = Symbol("PATH"), X = Symbol("VALUE"), on = Symbol("PROXY_TREE"), an = (t) => String(t) === "[object Object]" && t.constructor.name === "Object", Xe = /* @__PURE__ */ new Set([
  "push",
  "shift",
  "pop",
  "unshift",
  "splice",
  "reverse",
  "sort",
  "copyWithin"
]), Qe = (t) => t && t[V] ? t[X] : t, me = (t) => typeof t == "object" && t !== null && !Array.isArray(t) && t.constructor.name !== "Object" && Object.isExtensible(t), Je = (t) => t !== void 0 && (!me(t) || me(t) && !(t instanceof Date) && !(t instanceof Map) && !(t instanceof Set));
class Ae {
  constructor(e) {
    this.tree = e, this.CACHED_PROXY = Symbol("CACHED_PROXY"), this.delimiter = e.master.options.delimiter, this.ssr = Boolean(e.master.options.ssr);
  }
  concat(e, n) {
    return e ? e + this.delimiter + n : n;
  }
  ensureMutationTrackingIsEnabled(e) {
    if (Se !== "production" && this.tree.master.options.devmode && !this.tree.canMutate())
      throw new Error(`proxy-state-tree - You are mutating the path "${e}", but it is not allowed. The following could have happened:
        
        - The mutation is explicitly being blocket
        - You are passing state to a 3rd party tool trying to manipulate the state
        - You are running asynchronous code and forgot to "await" its execution
        `);
  }
  isDefaultProxifier() {
    return this.tree.proxifier === this.tree.master.proxifier;
  }
  ensureValueDosntExistInStateTreeElsewhere(e) {
    if (Se !== "production") {
      if (e && e[V] === !0)
        throw new Error(`proxy-state-tree - You are trying to insert a value that already exists in the state tree on path "${e[q]}"`);
      return e;
    }
  }
  trackPath(e) {
    if (!!this.tree.canTrack())
      if (this.isDefaultProxifier()) {
        const n = this.tree.master.currentTree;
        if (!n)
          return;
        n.addTrackingPath(e);
      } else
        this.tree.addTrackingPath(e);
  }
  getTrackingTree() {
    return this.tree.master.currentTree && this.isDefaultProxifier() ? this.tree.master.currentTree : this.tree.canTrack() && this.tree.canTrack() ? this.tree : null;
  }
  getMutationTree() {
    return this.tree.master.mutationTree || this.tree;
  }
  isProxyCached(e, n) {
    return e[this.CACHED_PROXY] && String(e[this.CACHED_PROXY][q]) === String(n);
  }
  createArrayProxy(e, n) {
    if (!this.ssr && this.isProxyCached(e, n))
      return e[this.CACHED_PROXY];
    const s = this, r = new Proxy(e, {
      get(o, i) {
        if (i === V)
          return !0;
        if (i === q)
          return n;
        if (i === X)
          return e;
        if (i === "indexOf")
          return (h, f) => e.indexOf(Qe(h), Qe(f));
        if (i === "length" || typeof o[i] == "function" && !Xe.has(String(i)) || typeof i == "symbol")
          return o[i];
        const c = s.getTrackingTree(), l = s.concat(n, i), u = c || s.tree;
        c && c.proxifier.trackPath(l), u.trackPathListeners.forEach((h) => h(l));
        const a = String(i);
        return Xe.has(a) ? (...h) => {
          const f = s.getMutationTree();
          let p;
          return Se === "production" ? p = o[i](...h) : p = o[i](...h.map((y) => /* @__PURE__ */ s.ensureValueDosntExistInStateTreeElsewhere(y))), f.addMutation({
            method: a,
            path: n,
            delimiter: s.delimiter,
            args: h,
            hasChangedValue: !0
          }), p;
        } : Je(o[i]) ? s.proxify(o[i], l) : o[i];
      },
      set(o, i, c) {
        const l = s.concat(n, i), u = s.getMutationTree(), a = Reflect.set(o, i, c);
        return u.addMutation({
          method: "set",
          path: l,
          args: [c],
          delimiter: s.delimiter,
          hasChangedValue: !0
        }), a;
      }
    });
    return this.ssr || Object.defineProperty(e, this.CACHED_PROXY, {
      value: r,
      configurable: !0
    }), r;
  }
  createObjectProxy(e, n) {
    if (!this.ssr && this.isProxyCached(e, n))
      return e[this.CACHED_PROXY];
    const s = this, r = new Proxy(e, {
      get(o, i) {
        if (i === V)
          return !0;
        if (i === q)
          return n;
        if (i === X)
          return e;
        if (i === on)
          return s.tree;
        if (typeof i == "symbol" || i in Object.prototype)
          return o[i];
        const c = Object.getOwnPropertyDescriptor(o, i) || Object.getPrototypeOf(o) && Object.getOwnPropertyDescriptor(Object.getPrototypeOf(o), i);
        if (c && "get" in c) {
          const f = c.get.call(r);
          return s.tree.master.options.devmode && s.tree.master.options.onGetter && s.tree.master.options.onGetter(s.concat(n, i), f), f;
        }
        const l = s.getTrackingTree(), u = o[i], a = s.concat(n, i), h = l || s.tree;
        return typeof u == "function" ? s.tree.master.options.onGetFunction ? s.tree.master.options.onGetFunction(l || s.tree, a, o, i) : me(o) ? u : u.call(o, s.tree, a) : (h.trackPathListeners.forEach((f) => f(a)), l && l.proxifier.trackPath(a), Je(u) ? s.proxify(u, a) : u);
      },
      set(o, i, c) {
        const l = s.concat(n, i);
        let u;
        i in o || (u = n);
        const a = s.getMutationTree(), h = o[i];
        typeof c == "function" && s.tree.master.options.onSetFunction && (c = s.tree.master.options.onSetFunction(s.getTrackingTree() || s.tree, l, o, i, c));
        const f = h !== c, p = Reflect.set(o, i, c);
        return a.addMutation({
          method: "set",
          path: l,
          args: [c],
          delimiter: s.delimiter,
          hasChangedValue: f
        }, u), p;
      },
      deleteProperty(o, i) {
        const c = s.concat(n, i);
        let l;
        i in o && (l = n);
        const u = s.getMutationTree();
        return delete o[i], u.addMutation({
          method: "unset",
          path: c,
          args: [],
          delimiter: s.delimiter,
          hasChangedValue: !0
        }, l), !0;
      }
    });
    return this.ssr || Object.defineProperty(e, this.CACHED_PROXY, {
      value: r,
      configurable: !0
    }), r;
  }
  proxify(e, n) {
    if (e) {
      if (e[V] && (String(e[q]) !== String(n) || e[X][this.CACHED_PROXY] !== e))
        return this.proxify(e[X], n);
      if (e[V])
        return e;
      if (Array.isArray(e))
        return this.createArrayProxy(e, n);
      if (an(e) || me(e))
        return this.createObjectProxy(e, n);
    }
    return e;
  }
}
class Re {
  constructor(e, n) {
    this.mutationCallbacks = [], this.mutations = [], this.objectChanges = /* @__PURE__ */ new Set(), this.isTracking = !1, this.isBlocking = !1, this.trackPathListeners = [], this.isTracking = !0, this.master = e, this.proxifier = n || new Ae(this), this.state = this.proxifier.proxify(e.sourceState, "");
  }
  trackPaths() {
    const e = /* @__PURE__ */ new Set(), n = (s) => {
      e.add(s);
    };
    return this.trackPathListeners.push(n), () => (this.trackPathListeners.splice(this.trackPathListeners.indexOf(n), 1), e);
  }
  getMutations() {
    const e = this.mutations.slice();
    return this.mutations.length = 0, e;
  }
  getObjectChanges() {
    const e = /* @__PURE__ */ new Set([...this.objectChanges]);
    return this.objectChanges.clear(), e;
  }
  addMutation(e, n) {
    const s = this.master.currentFlushId;
    this.mutations.push(e), n && this.objectChanges.add(n);
    for (const r of this.master.mutationCallbacks)
      r(e, new Set(n ? [e.path, n] : [e.path]), s);
    for (const r of this.mutationCallbacks)
      r(e, new Set(n ? [e.path, n] : [e.path]), s);
  }
  flush(e = !1) {
    return this.master.flush(this, e);
  }
  onMutation(e) {
    this.mutationCallbacks.push(e);
  }
  canMutate() {
    return this.isTracking && !this.isBlocking;
  }
  canTrack() {
    return !1;
  }
  blockMutations() {
    this.isBlocking = !0;
  }
  enableMutations() {
    this.isBlocking = !1;
  }
  dispose() {
    return this.isTracking = !1, this.mutationCallbacks.length = 0, this.proxifier = this.master.proxifier, this;
  }
}
class pe {
  constructor(e) {
    this.pathDependencies = /* @__PURE__ */ new Set(), this.shouldTrack = !1, this.trackPathListeners = [], this.master = e, this.proxifier = e.proxifier, this.state = e.state;
  }
  trackPaths() {
    const e = /* @__PURE__ */ new Set(), n = (s) => {
      e.add(s);
    };
    return this.trackPathListeners.push(n), () => (this.trackPathListeners.splice(this.trackPathListeners.indexOf(n), 1), e);
  }
  canMutate() {
    return !1;
  }
  canTrack() {
    return !0;
  }
  addTrackingPath(e) {
    !this.shouldTrack || (this.pathDependencies.add(e), this.callback && this.master.addPathDependency(e, this.callback));
  }
  track(e) {
    return this.master.changeTrackStateTree(this), this.shouldTrack = !0, this.clearTracking(), e && (this.callback = (...n) => {
      !this.callback || e(...n);
    }), this;
  }
  clearTracking() {
    if (this.callback)
      for (const e of this.pathDependencies)
        this.master.removePathDependency(e, this.callback);
    this.pathDependencies.clear();
  }
  stopTracking() {
    this.shouldTrack = !1;
  }
  trackScope(e, n) {
    const s = this.master.previousTree, r = this.master.currentTree;
    this.master.currentTree = this, this.track(n);
    const o = e(this);
    return this.master.currentTree = r, this.master.previousTree = s, this.stopTracking(), o;
  }
  dispose() {
    return this.callback ? (this.clearTracking(), this.callback = null, this.proxifier = this.master.proxifier, this.master.currentTree === this && (this.master.currentTree = null), this) : (this.pathDependencies.clear(), this);
  }
}
class cn {
  constructor(e, n = {}) {
    this.cache = {
      mutationTree: [],
      trackStateTree: []
    }, this.flushCallbacks = [], this.mutationCallbacks = [], this.currentFlushId = 0, this.pathDependencies = {}, typeof n.devmode > "u" && (n.devmode = !0), n.delimiter || (n.delimiter = "."), this.master = this, this.sourceState = e, this.options = n, this.createTrackStateProxifier();
  }
  createTrackStateProxifier() {
    const e = new pe(this);
    this.proxifier = e.proxifier = new Ae(e), this.state = e.state = this.proxifier.proxify(this.sourceState, "");
  }
  getMutationTree() {
    return this.options.devmode ? this.cache.mutationTree.pop() || new Re(this) : this.mutationTree = this.mutationTree || new Re(this, this.proxifier);
  }
  getTrackStateTree() {
    return this.cache.trackStateTree.pop() || new pe(this);
  }
  getTrackStateTreeWithProxifier() {
    const e = this.getTrackStateTree();
    return this.options.ssr ? e.state = this.sourceState : (e.proxifier = new Ae(e), e.state = e.proxifier.proxify(this.sourceState, "")), e;
  }
  changeTrackStateTree(e) {
    this.previousTree = this.currentTree, this.currentTree = e;
  }
  disposeTree(e) {
    e instanceof Re ? this.cache.mutationTree.push(e.dispose()) : e instanceof pe && this.cache.trackStateTree.push(e.dispose());
  }
  onMutation(e) {
    return this.mutationCallbacks.push(e), () => {
      this.mutationCallbacks.splice(this.mutationCallbacks.indexOf(e), 1);
    };
  }
  forceFlush() {
    const e = [], n = [];
    for (const s in this.pathDependencies)
      this.pathDependencies[s].forEach((o) => {
        o(e, n, this.currentFlushId++, !1);
      });
  }
  flush(e, n = !1) {
    let s;
    if (Array.isArray(e) ? s = e.reduce((u, a) => ({
      mutations: u.mutations.concat(a.getMutations()),
      objectChanges: /* @__PURE__ */ new Set([
        ...u.objectChanges,
        ...a.getObjectChanges()
      ])
    }), {
      mutations: [],
      objectChanges: /* @__PURE__ */ new Set()
    }) : s = {
      mutations: e.getMutations(),
      objectChanges: e.getObjectChanges()
    }, !s.mutations.length && !s.objectChanges.size)
      return {
        mutations: [],
        flushId: null
      };
    const r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), i = this.currentFlushId++;
    for (const u of s.objectChanges)
      this.pathDependencies[u] && r.add(u);
    for (const u of s.mutations)
      u.hasChangedValue && r.add(u.path);
    const c = Array.from(r).sort();
    for (const u of c)
      if (this.pathDependencies[u])
        for (const a of this.pathDependencies[u])
          o.add(a);
    for (const u of o)
      u(s.mutations, c, i, n);
    const l = this.flushCallbacks.slice();
    for (const u of l)
      this.flushCallbacks.includes(u) && u(s.mutations, c, i, n);
    return r.clear(), o.clear(), {
      mutations: s.mutations,
      flushId: i
    };
  }
  onFlush(e) {
    return this.flushCallbacks.push(e), () => this.flushCallbacks.splice(this.flushCallbacks.indexOf(e), 1);
  }
  rescope(e, n) {
    return e && e[V] ? n.proxifier.proxify(e[X], e[q]) : e;
  }
  addPathDependency(e, n) {
    this.pathDependencies[e] || (this.pathDependencies[e] = /* @__PURE__ */ new Set()), this.pathDependencies[e].add(n);
  }
  removePathDependency(e, n) {
    this.pathDependencies[e].delete(n), this.pathDependencies[e].size || delete this.pathDependencies[e];
  }
  toJSON() {
    return this.sourceState;
  }
}
var E;
(function(t) {
  t.ACTION_START = "action:start", t.ACTION_END = "action:end", t.OPERATOR_START = "operator:start", t.OPERATOR_END = "operator:end", t.OPERATOR_ASYNC = "operator:async", t.MUTATIONS = "mutations", t.EFFECT = "effect", t.DERIVED = "derived", t.DERIVED_DIRTY = "derived:dirty", t.COMPONENT_ADD = "component:add", t.COMPONENT_UPDATE = "component:update", t.COMPONENT_REMOVE = "component:remove", t.GETTER = "getter";
})(E || (E = {}));
const Nt = Symbol("IS_DERIVED"), ke = Symbol("IS_DERIVED_CONSTRUCTOR");
class Ze {
  constructor(e) {
    this.cb = e, this.isDirty = !0, this.updateCount = 0;
    const n = this.evaluate.bind(this);
    return process.env.NODE_ENV === "development" && (n.dispose = () => {
      this.disposeOnMutation();
    }), n[Nt] = !0, n;
  }
  runScope(e, n) {
    const s = n.slice(0, n.length - 1).reduce((r, o) => r[o], e.state);
    return this.cb(s, e.state);
  }
  evaluate(e, n, s, r) {
    if (this.disposeOnMutation || (this.disposeOnMutation = s.onMutation((o, i, c) => {
      if (typeof r.reduce((l, u) => l && l[u], s.sourceState) != "function") {
        this.disposeOnMutation();
        return;
      }
      if (!this.isDirty) {
        for (const l of i)
          if (this.paths.has(l)) {
            this.isDirty = !0, e.emitAsync(E.DERIVED_DIRTY, {
              derivedPath: r,
              path: l,
              flushId: c
            });
            return;
          }
      }
    })), this.isDirty || this.previousProxifier !== n.proxifier) {
      const o = n.trackPaths();
      this.value = this.runScope(n, r), this.isDirty = !1, this.paths = o(), process.env.NODE_ENV === "development" && (e.emitAsync(E.DERIVED, {
        path: r,
        paths: Array.from(this.paths),
        updateCount: this.updateCount,
        value: this.value
      }), this.updateCount++);
    }
    if (n instanceof pe)
      for (const o of this.paths)
        n.addTrackingPath(o), n.trackPathListeners.forEach((i) => i(o));
    return this.previousProxifier = n.proxifier, this.value && this.value[V] ? s.rescope(this.value, n) : this.value;
  }
}
var un = function() {
  function t() {
    this.events = /* @__PURE__ */ new Map();
  }
  return t.prototype.emit = function(e, n) {
    for (var s = this.events.get(e) || [], r = s.length - 1; r >= 0; r--) {
      var o = s[r];
      o.cb(n), o.once && s.splice(r, 1);
    }
  }, t.prototype.emitAsync = function(e, n) {
    var s = this.events.get(e) || [];
    setTimeout(function() {
      for (var r = s.length - 1; r >= 0; r--) {
        var o = s[r];
        o.cb(n), o.once && s.splice(r, 1);
      }
    });
  }, t.prototype.on = function(e, n) {
    this.addListener(e, n, !1);
  }, t.prototype.once = function(e, n) {
    this.addListener(e, n, !0);
  }, t.prototype.addListener = function(e, n, s) {
    var r = this.events.get(e) || [];
    r.push({
      once: s,
      cb: n
    }), this.events.set(e, r);
  }, t;
}(), ln = Object.prototype.toString, Q = function(t) {
  var e;
  return ln.call(t) === "[object Object]" && (e = Object.getPrototypeOf(t), e === null || e === Object.getPrototypeOf({}));
};
function hn(t, e, n, s) {
  function r(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function c(a) {
      try {
        u(s.next(a));
      } catch (h) {
        i(h);
      }
    }
    function l(a) {
      try {
        u(s.throw(a));
      } catch (h) {
        i(h);
      }
    }
    function u(a) {
      a.done ? o(a.value) : r(a.value).then(c, l);
    }
    u((s = s.apply(t, e || [])).next());
  });
}
function Ct(t, e, n = {}) {
  if (!t || !e)
    throw new Error('You have to pass a "target" and "source" object to rehydrate');
  Object.keys(e).forEach((s) => {
    const r = e[s], o = n[s];
    typeof o == "function" && Array.isArray(t[s]) ? t[s] = e[s].map((i) => o(i)) : typeof o == "function" && typeof t[s] == "object" && t[s] !== null && t[s].constructor.name === "Object" ? t[s] = Object.keys(e[s]).reduce((i, c) => (i[c] = o(e[s][c]), i), {}) : typeof o == "function" ? t[s] = o(e[s]) : typeof r == "object" && !Array.isArray(r) && r !== null ? (t[s] || (t[s] = {}), Ct(t[s], e[s], n[s])) : t[s] = e[s];
  });
}
const fn = Symbol("SERIALIZE"), et = (t, e, n = {}) => {
  Array.isArray(e) ? e.forEach((r) => {
    const o = r.path.split(r.delimiter), i = o.pop(), c = o.reduce((u, a) => u[a], t), l = o.reduce((u, a) => u && u[a], n);
    r.method === "set" ? typeof l == "function" && Array.isArray(r.args[0]) ? c[i] = r.args[0].map((u) => l(u)) : typeof l == "function" ? c[i] = l(r.args[0]) : c[i] = r.args[0] : r.method === "unset" ? delete c[i] : c[i][r.method].apply(c[i], typeof l == "function" ? r.args.map((u) => typeof u == "object" && u !== null ? l(u) : u) : r.args);
  }) : Ct(t, e, n);
};
class dn {
  constructor(e) {
    this.safeClassNames = /* @__PURE__ */ new Set(), this.unsafeClassNames = /* @__PURE__ */ new Set(), this.circularReferenceCache = [], this.buffer = [], this.serializer = Promise.resolve(), this.isConnected = !1, this.doReconnect = !1, this.hasWarnedReconnect = !1, this.reconnectInterval = 1e4, this.connect = (n, s) => {
      n = n || "localhost:3031", this.ws = new WebSocket(`ws://${n}?name=${this.name}`), this.ws.onmessage = (r) => {
        const o = JSON.parse(r.data);
        o.appName === this.name && s(o);
      }, this.ws.onopen = () => {
        this.isConnected = !0, this.flushBuffer();
      }, this.ws.onerror = () => {
        console.error(`OVERMIND DEVTOOLS: Not able to connect. You are trying to connect to "${n}", but there was no devtool there. Try the following:
        
          - Make sure you are running the latest version of the devtools, using "npx overmind-devtools@latest" or install latest extension for VSCode
          - Close the current tab and open a new one
          - Make sure the correct port is configured in the devtools
        `);
      }, this.ws.onclose = () => {
        this.isConnected = !1, this.doReconnect && !this.hasWarnedReconnect && (console.warn("Debugger application is not running on selected port... will reconnect automatically behind the scenes"), this.hasWarnedReconnect = !0), this.doReconnect && this.reconnect(n, s);
      };
    }, this.sendMessage = (n) => {
      if (!this.isConnected) {
        this.buffer.push(n);
        return;
      }
      this.ws.send(`{"appName":"${this.name}","message":${n}}`);
    }, this.flushBuffer = () => hn(this, void 0, void 0, function* () {
      this.buffer.forEach((n) => {
        this.sendMessage(n);
      }), this.buffer.length = 0;
    }), this.name = typeof location < "u" && location.search.includes("OVERMIND_DEVTOOL") ? e + " (Overmind Devtool)" : e;
  }
  reconnect(e, n) {
    setTimeout(() => this.connect(e, n), this.reconnectInterval);
  }
  send(e) {
    const n = this.safeClassNames, s = this.unsafeClassNames, r = this.circularReferenceCache;
    this.sendMessage(JSON.stringify(e, function(o, i) {
      if (typeof i == "function")
        return "[Function]";
      if (this.__CLASS__)
        return i;
      if (i && i[fn])
        return {
          __CLASS__: !0,
          name: i.constructor.name,
          value: i
        };
      if (typeof i == "object" && i !== null && !Array.isArray(i) && i.constructor && i.constructor.name !== "Object") {
        if (r.includes(i))
          return `[CIRCULAR REFERENCE: ${i.constructor.name}]`;
        if (r.push(i), !n.has(i.constructor.name) && !s.has(i.constructor.name))
          try {
            JSON.stringify(i), n.add(i.constructor.name);
          } catch {
            s.add(i.constructor.name);
          }
        return n.has(i.constructor.name) ? {
          __CLASS__: !0,
          name: i.constructor.name,
          value: i
        } : `[${i.constructor.name || "NOT SERIALIZABLE"}]`;
      }
      return i;
    })), r.length = 0;
  }
}
function pn(t) {
  return typeof t == "object" && !Array.isArray(t) && t !== null;
}
let tt = !1, mn = 0;
const nt = Symbol("ORIGIN_TARGET");
function It(t, e, n = "") {
  return !pn(t) && typeof t != "function" ? t : new Proxy(t, {
    apply(s, r, o) {
      const i = mn++, c = n.split("."), l = c.pop();
      return e({
        func: s.bind(r ? r[nt] : void 0),
        effectId: i,
        name: c.join("."),
        method: l,
        args: o
      });
    },
    construct(s, r) {
      return tt || (console.warn(`EFFECTS - It is highly recommended to create a custom effect, exposing a method that deals with the instantiation of "${n}". It improves readability and debugability of your app`), tt = !0), new s(...r);
    },
    get(s, r) {
      return r === nt ? s : It(s[r], e, n ? n + "." + r.toString() : r.toString());
    }
  });
}
const gn = () => ({ actions: t }, e) => {
  const n = kt("onInitializeOvermind", t);
  return Promise.all(n.map((s) => s(e)));
}, M = (() => {
  let t;
  try {
    t = process.env.NODE_ENV;
  } catch {
    console.warn("Overmind was unable to determine the NODE_ENV, which means it will run in DEVELOPMENT mode. If this is a production app, please configure your build tool to define NODE_ENV"), t = "development";
  }
  return t;
})(), yn = M === "test", st = Symbol("operator"), vn = Symbol("origina_actions"), we = Symbol("execution"), Y = Symbol("MODE_DEFAULT"), fe = Symbol("MODE_TEST"), F = Symbol("MODE_SSR");
class En {
  emit() {
  }
  emitAsync() {
  }
  on() {
  }
  once() {
  }
  addListener() {
  }
}
function rt(t) {
  return t instanceof Promise || t && typeof t.then == "function" && typeof t.catch == "function";
}
function xe(t) {
  return Object.keys(t).reduce((e, n) => {
    if (n === "__esModule")
      return e;
    const s = Object.getOwnPropertyDescriptor(t, n);
    if (s && "get" in s)
      return Object.defineProperty(e, n, s), e;
    const r = t[n];
    return Q(r) ? e[n] = xe(r) : Object.defineProperty(e, n, s), e;
  }, Q(t) ? {} : t);
}
const it = ".";
function At(t, e, n = [], s = []) {
  const r = Object.keys(t), o = Object.keys(e);
  return r.forEach((i) => {
    o.includes(i) || s.push({
      delimiter: it,
      args: [],
      path: n.concat(i).join("."),
      hasChangedValue: !1,
      method: "unset"
    });
  }), o.forEach((i) => {
    Q(t[i]) && Q(e[i]) ? At(t[i], e[i], n.concat(i), s) : t[i] !== e[i] && s.push({
      delimiter: it,
      args: [e[i]],
      path: n.concat(i).join("."),
      hasChangedValue: !1,
      method: "set"
    });
  }), s;
}
function kt(t, e = {}, n = []) {
  return Object.keys(e).reduce((s, r) => typeof e[r] == "function" && r === t ? s.concat(e[r]) : s.concat(kt(t, e[r], n.concat(r))), []);
}
function De(t = {}, e = []) {
  return Object.keys(t).reduce((n, s) => typeof t[s] == "function" ? n.concat(e.concat(s).join(".")) : n.concat(De(t[s], e.concat(s))), []);
}
function xt(t, e) {
  return new Proxy(t, {
    get(n, s) {
      if (s === vn)
        return t;
      if (typeof n[s] == "function")
        return e(n[s]);
      if (!!n[s])
        return xt(n[s], e);
    }
  });
}
const Pe = {};
class bn {
  constructor(e, n = {}, s = {
    mode: Y
  }) {
    this.actionReferences = {}, this.nextExecutionId = 0, this.reydrateMutationsForHotReloading = [], this.isStrict = !1, this.reaction = (u, a, h = {}) => {
      let f;
      if (h.nested) {
        const p = u(this.state);
        if (!p || !p[V])
          throw new Error('You have to return an object or array from the Overmind state when using a "nested" reaction');
        const y = p[q];
        f = this.addFlushListener((N) => {
          N.forEach((R) => {
            R.path.startsWith(y) && a(y ? y.split(this.delimiter).reduce((b, _) => b[_], this.state) : this.state);
          });
        });
      } else {
        const p = this.proxyStateTreeInstance.getTrackStateTree();
        let y;
        const N = () => {
          p.trackScope(() => y = u(p.state), () => {
            N(), a(y);
          });
        };
        N(), f = () => {
          p.dispose();
        };
      }
      return h.immediate && a(u(this.state)), f;
    }, this.addMutationListener = (u) => this.proxyStateTreeInstance.onMutation(u), this.addFlushListener = (u) => this.proxyStateTreeInstance.onFlush(u);
    const r = n.name || "OvermindApp", o = n.devEnv || "development", i = typeof process < "u" && process.title && process.title.includes("node");
    if (this.delimiter = n.delimiter || ".", this.isStrict = Boolean(n.strict), M === o && s.mode === Y && n.hotReloading !== !1 && !i) {
      if (Pe[r])
        return Pe[r].reconfigure(e);
      Pe[r] = this;
    }
    const c = s.mode === F ? new En() : new un(), l = this.createProxyStateTree(e, c, s.mode === fe || M === o, s.mode === F);
    if (this.originalConfiguration = e, this.state = l.state, this.effects = e.effects || {}, this.proxyStateTreeInstance = l, this.eventHub = c, this.mode = s, this.actions = this.getActions(e.actions), s.mode !== F) {
      if (M === o && s.mode === Y && typeof window < "u") {
        let u = "OVERMIND: You are running in DEVELOPMENT mode.";
        if (n.logProxies !== !0) {
          const a = console.log;
          console.log = (...h) => a.apply(console, h.map((f) => f && f[V] ? f[X] : f)), u += `

 - To improve debugging experience "console.log" will NOT log proxies from Overmind, but the actual value. Please see docs to turn off this behaviour`;
        }
        if (n.devtools || typeof location < "u" && location.hostname === "localhost" && n.devtools !== !1) {
          const a = n.devtools === !0 ? "localhost:3031" : n.devtools, h = n.name ? n.name : typeof document > "u" ? "NoName" : document.title || "NoName";
          this.initializeDevtools(a, h, c, l.sourceState, e.actions);
        } else
          n.devtools !== !1 && (u += `

 - You are not running on localhost. You will have to manually define the devtools option to connect`);
        yn || console.warn(u);
      }
      if (M === "production" && s.mode === Y) {
        c.on(E.OPERATOR_ASYNC, (h) => {
          (!h.parentExecution || !h.parentExecution.isRunning) && l.getMutationTree().flush(!0);
        }), c.on(E.ACTION_END, (h) => {
          (!h.parentExecution || !h.parentExecution.isRunning) && l.getMutationTree().flush();
        });
        let u;
        const a = () => {
          l.getMutationTree().flush(!0);
        };
        this.proxyStateTreeInstance.onMutation(() => {
          u && clearTimeout(u), u = setTimeout(a, 0);
        });
      } else
        (s.mode === Y || s.mode === fe) && ((M === "test" || this.devtools && n.hotReloading !== !1) && c.on(E.MUTATIONS, (u) => {
          this.reydrateMutationsForHotReloading = this.reydrateMutationsForHotReloading.concat(u.mutations);
        }), c.on(E.OPERATOR_ASYNC, (u) => {
          if (!u.parentExecution || !u.parentExecution.isRunning) {
            const a = u.flush(!0);
            this.devtools && a.mutations.length && this.devtools.send({
              type: "flush",
              data: Object.assign(Object.assign({}, u), a)
            });
          }
        }), c.on(E.ACTION_END, (u) => {
          if (!u.parentExecution || !u.parentExecution.isRunning) {
            const a = u.flush();
            this.devtools && a.mutations.length && this.devtools.send({
              type: "flush",
              data: Object.assign(Object.assign({}, u), a)
            });
          }
        }));
      if (s.mode === Y) {
        const u = this.createAction("onInitialize", gn());
        this.initialized = Promise.resolve(u(this));
      } else
        this.initialized = Promise.resolve(null);
    }
  }
  createProxyStateTree(e, n, s, r) {
    const o = new cn(this.getState(e), {
      devmode: s && !r,
      ssr: r,
      delimiter: this.delimiter,
      onSetFunction: (i, c, l, u, a) => a[ke] ? new Ze(a) : a,
      onGetFunction: (i, c, l, u) => {
        const a = l[u];
        if (a[Nt])
          return a(n, i, o, c.split(this.delimiter));
        if (a[ke]) {
          const h = new Ze(a);
          return l[u] = h, h(n, i, o, c.split(this.delimiter));
        }
        return a;
      },
      onGetter: s ? (i, c) => {
        this.eventHub.emitAsync(E.GETTER, {
          path: i,
          value: c
        });
      } : void 0
    });
    return o;
  }
  createExecution(e, n, s) {
    const r = e.split(".");
    if (r.pop(), M === "production")
      return {
        [we]: !0,
        parentExecution: s,
        namespacePath: r,
        actionName: e,
        getMutationTree: () => this.proxyStateTreeInstance.getMutationTree(),
        getTrackStateTree: () => this.proxyStateTreeInstance.getTrackStateTree(),
        emit: this.eventHub.emit.bind(this.eventHub)
      };
    const o = [];
    return {
      [we]: !0,
      namespacePath: r,
      actionId: e,
      executionId: this.nextExecutionId++,
      actionName: e,
      operatorId: 0,
      isRunning: !0,
      parentExecution: s,
      path: [],
      emit: this.eventHub.emit.bind(this.eventHub),
      send: this.devtools ? this.devtools.send.bind(this.devtools) : () => {
      },
      trackEffects: this.trackEffects.bind(this, this.effects),
      getNextOperatorId: (() => {
        let c = 0;
        return () => ++c;
      })(),
      flush: s ? s.flush : (c) => this.proxyStateTreeInstance.flush(o, c),
      getMutationTree: s ? s.getMutationTree : () => {
        const c = this.proxyStateTreeInstance.getMutationTree();
        return o.push(c), c;
      },
      getTrackStateTree: () => this.proxyStateTreeInstance.getTrackStateTree(),
      onFlush: (c) => this.proxyStateTreeInstance.onFlush(c),
      scopeValue: (c, l) => this.scopeValue(c, l)
    };
  }
  createContext(e, n) {
    return {
      state: n.state,
      actions: xt(this.actions, (s) => (r) => s(r, e.isRunning ? e : null)),
      execution: e,
      proxyStateTree: this.proxyStateTreeInstance,
      effects: this.trackEffects(this.effects, e),
      addNamespace: this.addNamespace.bind(this),
      reaction: this.reaction.bind(this),
      addMutationListener: this.addMutationListener.bind(this),
      addFlushListener: this.addFlushListener.bind(this)
    };
  }
  addNamespace(e, n, s) {
    const r = s || this.state, o = n.pop();
    if (e.state) {
      const i = n.reduce((c, l) => c[l], r);
      i[o] = xe(e.state);
    }
    if (e.actions) {
      const i = n.reduce((c, l) => c[l], this.actions);
      i[o] = this.getActions(e.actions);
    }
    if (e.effects) {
      const i = n.reduce((c, l) => c[l], this.effects);
      i[o] = e.effects;
    }
  }
  scopeValue(e, n) {
    return e && (e[V] ? this.proxyStateTreeInstance.rescope(e, n) : Q(e) ? Object.assign({}, ...Object.keys(e).map((s) => ({
      [s]: this.proxyStateTreeInstance.rescope(e[s], n)
    }))) : e);
  }
  addExecutionMutation(e) {
    this.mutations.push(e);
  }
  createAction(e, n) {
    return this.actionReferences[e] = n, (r, o) => {
      const i = this.actionReferences[e];
      if (o = o && o[we] ? o : void 0, M === "production" || i[st] || this.mode.mode === F) {
        const c = this.createExecution(e, i, o);
        if (this.eventHub.emit(E.ACTION_START, Object.assign(Object.assign({}, c), { value: r })), i[st])
          return new Promise((l, u) => {
            i(null, Object.assign(Object.assign({}, this.createContext(c, this.proxyStateTreeInstance)), { value: r }), (a, h) => {
              c.isRunning = !1, h && this.eventHub.emit(E.ACTION_END, Object.assign(Object.assign({}, h.execution), { operatorId: h.execution.operatorId - 1 })), a ? u(a) : l(h.value);
            });
          });
        {
          const l = c.getMutationTree();
          this.isStrict && l.blockMutations();
          const u = i(this.createContext(c, l), r);
          return this.eventHub.emit(E.ACTION_END, c), u;
        }
      } else {
        const c = Object.assign(Object.assign({}, this.createExecution(e, i, o)), { operatorId: 0, type: "action" });
        this.eventHub.emit(E.ACTION_START, Object.assign(Object.assign({}, c), { value: r })), this.eventHub.emit(E.OPERATOR_START, c);
        const l = c.getMutationTree();
        this.isStrict && l.blockMutations(), l.onMutation((h) => {
          this.eventHub.emit(E.MUTATIONS, Object.assign(Object.assign({}, c), { mutations: [h] }));
        });
        const u = this.scopeValue(r, l), a = this.createContext(c, l);
        try {
          let h;
          l.onMutation((p) => {
            h && clearTimeout(h), this.mode.mode === fe ? this.addExecutionMutation(p) : this.mode.mode === Y && (h = setTimeout(() => {
              h = null;
              const y = c.flush(!0);
              this.devtools && y.mutations.length && this.devtools.send({
                type: "flush",
                data: Object.assign(Object.assign(Object.assign({}, c), y), { mutations: y.mutations })
              });
            }));
          });
          let f = i(a, u);
          return rt(f) ? (this.eventHub.emit(E.OPERATOR_ASYNC, c), f = f.then((p) => (c.isRunning = !1, o || l.dispose(), this.eventHub.emit(E.OPERATOR_END, Object.assign(Object.assign({}, c), { isAsync: !0, result: void 0 })), this.eventHub.emit(E.ACTION_END, c), p)).catch((p) => {
            throw c.isRunning = !1, o || l.dispose(), this.eventHub.emit(E.OPERATOR_END, Object.assign(Object.assign({}, c), { isAsync: !0, result: void 0, error: p.message })), this.eventHub.emit(E.ACTION_END, c), p;
          })) : (c.isRunning = !1, o || l.dispose(), this.eventHub.emit(E.OPERATOR_END, Object.assign(Object.assign({}, c), { isAsync: !1, result: void 0 })), this.eventHub.emit(E.ACTION_END, c)), f;
        } catch (h) {
          throw this.eventHub.emit(E.OPERATOR_END, Object.assign(Object.assign({}, c), { isAsync: !1, result: void 0, error: h.message })), this.eventHub.emit(E.ACTION_END, c), h;
        }
      }
    };
  }
  trackEffects(e = {}, n) {
    return M === "production" ? e : It(this.effects, (s) => {
      let r;
      try {
        this.mode.mode === fe ? r = this.mode.options.effectsCallback(s) : (this.eventHub.emit(E.EFFECT, Object.assign(Object.assign(Object.assign({}, n), s), { args: s.args, isPending: !0, error: !1 })), r = s.func.apply(this, s.args));
      } catch (o) {
        throw this.eventHub.emit(E.EFFECT, Object.assign(Object.assign(Object.assign({}, n), s), { args: s.args, isPending: !1, error: o.message })), o;
      }
      return rt(r) ? (this.eventHub.emit(E.EFFECT, Object.assign(Object.assign(Object.assign({}, n), s), { args: s.args, isPending: !0, error: !1 })), r.then((o) => (this.eventHub.emit(E.EFFECT, Object.assign(Object.assign(Object.assign({}, n), s), { args: s.args, result: o, isPending: !1, error: !1 })), o)).catch((o) => {
        throw this.eventHub.emit(E.EFFECT, Object.assign(Object.assign(Object.assign({}, n), s), { args: s.args, isPending: !1, error: o && o.message })), o;
      })) : (this.eventHub.emit(E.EFFECT, Object.assign(Object.assign(Object.assign({}, n), s), { args: s.args, result: r, isPending: !1, error: !1 })), r);
    });
  }
  initializeDevtools(e, n, s, r, o) {
    if (M === "production")
      return;
    const i = new dn(n);
    i.connect(e, (c) => {
      switch (c.type) {
        case "refresh": {
          location.reload();
          break;
        }
        case "executeAction": {
          const l = c.data.name.split(".").reduce((u, a) => u[a], this.actions);
          c.data.payload ? l(JSON.parse(c.data.payload)) : l();
          break;
        }
        case "mutation": {
          const l = this.proxyStateTreeInstance.getMutationTree(), u = c.data.path.slice(), a = JSON.parse(`{ "value": ${c.data.value} }`).value, h = u.pop(), f = u.reduce((p, y) => p[y], l.state);
          f[h] = a, l.flush(!0), l.dispose(), this.devtools.send({
            type: "state",
            data: {
              path: c.data.path,
              value: a
            }
          });
          break;
        }
      }
    });
    for (const c in E)
      s.on(E[c], ((l) => (u) => {
        i.send({
          type: E[c],
          data: u
        }), l === E.MUTATIONS && u.mutations.forEach((a) => {
          const h = a.path.split(this.delimiter).reduce((f, p) => f[p], this.proxyStateTreeInstance.state);
          Q(h) ? Object.keys(h).forEach((f) => h[f]) : Array.isArray(h) && h.forEach((f) => {
            Q(f) && Object.keys(f).forEach((p) => f[p]);
          });
        }), l === E.DERIVED_DIRTY && u.derivedPath.reduce((a, h) => a[h], this.proxyStateTreeInstance.state);
      })(E[c]));
    i.send({
      type: "init",
      data: {
        state: this.proxyStateTreeInstance.state,
        actions: De(o),
        delimiter: this.delimiter
      }
    }), this.devtools = i;
  }
  getState(e) {
    let n = {};
    return e.state && (n = xe(e.state)), n;
  }
  getActions(e = {}, n = []) {
    return Object.keys(e).reduce((s, r) => {
      if (typeof e[r] == "function") {
        const o = this.createAction(n.concat(r).join("."), e[r]);
        return o.displayName = n.concat(r).join("."), Object.assign(s, {
          [r]: o
        });
      }
      return Object.assign(s, {
        [r]: this.getActions(e[r], n.concat(r))
      });
    }, {});
  }
  updateActions(e = {}, n = []) {
    Object.keys(e).forEach((s) => {
      if (typeof e[s] == "function") {
        const r = n.concat(s).join(".");
        if (this.actionReferences[r])
          this.actionReferences[r] = e[s];
        else {
          const o = n.reduce((i, c) => (i[c] || (i[c] = {}), i[c]), this.actions);
          o[s] = this.createAction(r, e[s]), o[s].displayName = n.concat(s).join(".");
        }
      } else
        this.updateActions(e[s], n.concat(s));
    }, {});
  }
  getTrackStateTree() {
    return this.proxyStateTreeInstance.getTrackStateTree();
  }
  getMutationTree() {
    return this.proxyStateTreeInstance.getMutationTree();
  }
  reconfigure(e) {
    const n = At(this.originalConfiguration.state, e.state || {});
    this.updateActions(e.actions), this.effects = e.effects || {};
    const s = this.proxyStateTreeInstance.getMutationTree();
    return et(s.state, n), this.reydrateMutationsForHotReloading.forEach((r) => {
      try {
        et(s.state, [r]);
      } catch {
      }
    }), s.flush(), s.dispose(), this.devtools && this.devtools.send({
      type: "re_init",
      data: {
        state: this.state,
        actions: De(e.actions)
      }
    }), this;
  }
}
const On = (t) => (t[ke] = !0, t);
function Tn(t, e) {
  return new bn(t, e, { mode: Y });
}
const I = Symbol("OVERMIND"), ot = M === "production";
let _n = 0;
function Sn(t, e, n = !1) {
  const s = _n++;
  let r = 0;
  return Object.assign(Object.assign({
    beforeCreate() {
      t.mode.mode === F ? (this.overmind = {
        state: t.state,
        actions: t.actions,
        effects: t.effects,
        addMutationListener: t.addMutationListener,
        reaction: t.reaction
      }, e && Object.assign(this, e({
        state: t.state,
        actions: t.actions,
        effects: t.effects
      }))) : (this[I] = {
        tree: t.proxyStateTreeInstance.getTrackStateTree(),
        componentInstanceId: r++,
        onUpdate: (o, i, c) => {
          this[I].currentFlushId = c, this[I].isUpdating = !0, this.$forceUpdate();
        },
        isUpdating: !1
      }, this.overmind = {
        state: this[I].tree.state,
        actions: t.actions,
        effects: t.effects,
        addMutationListener: t.addMutationListener,
        reaction: t.reaction
      }, this[I].tree.track(this[I].onUpdate), e && Object.assign(this, e({
        state: this[I].tree.state,
        actions: t.actions,
        effects: t.effects
      })));
    },
    beforeUpdate() {
      t.mode.mode !== F && (this[I].tree.track(this[I].onUpdate), e && n && Object.assign(this, e({
        state: this[I].tree.state,
        actions: t.actions,
        effects: t.effects
      })));
    }
  }, ot ? {
    updated() {
      this[I].tree.stopTracking();
    }
  } : {
    mounted() {
      t.mode.mode !== F && t.eventHub.emitAsync(E.COMPONENT_ADD, {
        componentId: s,
        componentInstanceId: this[I].componentInstanceId,
        name: this.$options.name || "",
        paths: Array.from(this[I].tree.pathDependencies)
      });
    },
    updated() {
      t.mode.mode !== F && (this[I].tree.stopTracking(), this[I].isUpdating && (t.eventHub.emitAsync(E.COMPONENT_UPDATE, {
        componentId: s,
        componentInstanceId: this[I].componentInstanceId,
        name: this.$options.name || "",
        flushId: this[I].currentFlushId,
        paths: Array.from(this[I].tree.pathDependencies)
      }), this[I].isUpdating = !1));
    }
  }), { beforeDestroy() {
    t.mode.mode !== F && (t.proxyStateTreeInstance.disposeTree(this[I].tree), !ot && t.eventHub.emitAsync(E.COMPONENT_REMOVE, {
      componentId: s,
      componentInstanceId: this[I].componentInstanceId,
      name: this.$options.name || ""
    }));
  } });
}
const Rn = (t) => ({
  install(e, n = ({ state: s, actions: r, effects: o }) => ({
    state: s,
    actions: r,
    effects: o
  })) {
    e.mixin(Sn(t, n));
  }
});
On((t, e) => {
  let n = [];
  return e.route.view == "login" || (e.route.doctype && n.push({
    title: e.route.doctype,
    to: `/${e.route.doctype}`
  }), e.route.document && n.push({
    title: e.route.document,
    to: `/${e.route.doctype}/${e.route.document}`
  })), n;
});
function wn() {
  return Dt().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function Dt() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const Pn = typeof Proxy == "function", Nn = "devtools-plugin:setup", Cn = "plugin:settings:set";
let J, je;
function In() {
  var t;
  return J !== void 0 || (typeof window < "u" && window.performance ? (J = !0, je = window.performance) : typeof global < "u" && ((t = global.perf_hooks) === null || t === void 0 ? void 0 : t.performance) ? (J = !0, je = global.perf_hooks.performance) : J = !1), J;
}
function An() {
  return In() ? je.now() : Date.now();
}
class kn {
  constructor(e, n) {
    this.target = null, this.targetQueue = [], this.onQueue = [], this.plugin = e, this.hook = n;
    const s = {};
    if (e.settings)
      for (const i in e.settings) {
        const c = e.settings[i];
        s[i] = c.defaultValue;
      }
    const r = `__vue-devtools-plugin-settings__${e.id}`;
    let o = Object.assign({}, s);
    try {
      const i = localStorage.getItem(r), c = JSON.parse(i);
      Object.assign(o, c);
    } catch {
    }
    this.fallbacks = {
      getSettings() {
        return o;
      },
      setSettings(i) {
        try {
          localStorage.setItem(r, JSON.stringify(i));
        } catch {
        }
        o = i;
      },
      now() {
        return An();
      }
    }, n && n.on(Cn, (i, c) => {
      i === this.plugin.id && this.fallbacks.setSettings(c);
    }), this.proxiedOn = new Proxy({}, {
      get: (i, c) => this.target ? this.target.on[c] : (...l) => {
        this.onQueue.push({
          method: c,
          args: l
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (i, c) => this.target ? this.target[c] : c === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(c) ? (...l) => (this.targetQueue.push({
        method: c,
        args: l,
        resolve: () => {
        }
      }), this.fallbacks[c](...l)) : (...l) => new Promise((u) => {
        this.targetQueue.push({
          method: c,
          args: l,
          resolve: u
        });
      })
    });
  }
  async setRealTarget(e) {
    this.target = e;
    for (const n of this.onQueue)
      this.target.on[n.method](...n.args);
    for (const n of this.targetQueue)
      n.resolve(await this.target[n.method](...n.args));
  }
}
function xn(t, e) {
  const n = t, s = Dt(), r = wn(), o = Pn && n.enableEarlyProxy;
  if (r && (s.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !o))
    r.emit(Nn, t, e);
  else {
    const i = o ? new kn(n, r) : null;
    (s.__VUE_DEVTOOLS_PLUGINS__ = s.__VUE_DEVTOOLS_PLUGINS__ || []).push({
      pluginDescriptor: n,
      setupFn: e,
      proxy: i
    }), i && e(i.proxiedTarget);
  }
}
/*!
  * vue-router v4.1.3
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
const U = typeof window < "u";
function Dn(t) {
  return t.__esModule || t[Symbol.toStringTag] === "Module";
}
const P = Object.assign;
function Ne(t, e) {
  const n = {};
  for (const s in e) {
    const r = e[s];
    n[s] = D(r) ? r.map(t) : t(r);
  }
  return n;
}
const oe = () => {
}, D = Array.isArray;
function S(t) {
  const e = Array.from(arguments).slice(1);
  console.warn.apply(console, ["[Vue Router warn]: " + t].concat(e));
}
const jn = /\/$/, Mn = (t) => t.replace(jn, "");
function Ce(t, e, n = "/") {
  let s, r = {}, o = "", i = "";
  const c = e.indexOf("#");
  let l = e.indexOf("?");
  return c < l && c >= 0 && (l = -1), l > -1 && (s = e.slice(0, l), o = e.slice(l + 1, c > -1 ? c : e.length), r = t(o)), c > -1 && (s = s || e.slice(0, c), i = e.slice(c, e.length)), s = Ln(s != null ? s : e, n), {
    fullPath: s + (o && "?") + o + i,
    path: s,
    query: r,
    hash: i
  };
}
function $n(t, e) {
  const n = e.query ? t(e.query) : "";
  return e.path + (n && "?") + n + (e.hash || "");
}
function at(t, e) {
  return !e || !t.toLowerCase().startsWith(e.toLowerCase()) ? t : t.slice(e.length) || "/";
}
function ct(t, e, n) {
  const s = e.matched.length - 1, r = n.matched.length - 1;
  return s > -1 && s === r && z(e.matched[s], n.matched[r]) && jt(e.params, n.params) && t(e.query) === t(n.query) && e.hash === n.hash;
}
function z(t, e) {
  return (t.aliasOf || t) === (e.aliasOf || e);
}
function jt(t, e) {
  if (Object.keys(t).length !== Object.keys(e).length)
    return !1;
  for (const n in t)
    if (!Vn(t[n], e[n]))
      return !1;
  return !0;
}
function Vn(t, e) {
  return D(t) ? ut(t, e) : D(e) ? ut(e, t) : t === e;
}
function ut(t, e) {
  return D(e) ? t.length === e.length && t.every((n, s) => n === e[s]) : t.length === 1 && t[0] === e;
}
function Ln(t, e) {
  if (t.startsWith("/"))
    return t;
  if (process.env.NODE_ENV !== "production" && !e.startsWith("/"))
    return S(`Cannot resolve a relative location without an absolute path. Trying to resolve "${t}" from "${e}". It should look like "/${e}".`), t;
  if (!t)
    return e;
  const n = e.split("/"), s = t.split("/");
  let r = n.length - 1, o, i;
  for (o = 0; o < s.length; o++)
    if (i = s[o], i !== ".")
      if (i === "..")
        r > 1 && r--;
      else
        break;
  return n.slice(0, r).join("/") + "/" + s.slice(o - (o === s.length ? 1 : 0)).join("/");
}
var ue;
(function(t) {
  t.pop = "pop", t.push = "push";
})(ue || (ue = {}));
var ae;
(function(t) {
  t.back = "back", t.forward = "forward", t.unknown = "";
})(ae || (ae = {}));
function Hn(t) {
  if (!t)
    if (U) {
      const e = document.querySelector("base");
      t = e && e.getAttribute("href") || "/", t = t.replace(/^\w+:\/\/[^\/]+/, "");
    } else
      t = "/";
  return t[0] !== "/" && t[0] !== "#" && (t = "/" + t), Mn(t);
}
const Un = /^[^#]+#/;
function Fn(t, e) {
  return t.replace(Un, "#") + e;
}
function Gn(t, e) {
  const n = document.documentElement.getBoundingClientRect(), s = t.getBoundingClientRect();
  return {
    behavior: e.behavior,
    left: s.left - n.left - (e.left || 0),
    top: s.top - n.top - (e.top || 0)
  };
}
const ge = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function Yn(t) {
  let e;
  if ("el" in t) {
    const n = t.el, s = typeof n == "string" && n.startsWith("#");
    if (process.env.NODE_ENV !== "production" && typeof t.el == "string" && (!s || !document.getElementById(t.el.slice(1))))
      try {
        const o = document.querySelector(t.el);
        if (s && o) {
          S(`The selector "${t.el}" should be passed as "el: document.querySelector('${t.el}')" because it starts with "#".`);
          return;
        }
      } catch {
        S(`The selector "${t.el}" is invalid. If you are using an id selector, make sure to escape it. You can find more information about escaping characters in selectors at https://mathiasbynens.be/notes/css-escapes or use CSS.escape (https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape).`);
        return;
      }
    const r = typeof n == "string" ? s ? document.getElementById(n.slice(1)) : document.querySelector(n) : n;
    if (!r) {
      process.env.NODE_ENV !== "production" && S(`Couldn't find element using selector "${t.el}" returned by scrollBehavior.`);
      return;
    }
    e = Gn(r, t);
  } else
    e = t;
  "scrollBehavior" in document.documentElement.style ? window.scrollTo(e) : window.scrollTo(e.left != null ? e.left : window.pageXOffset, e.top != null ? e.top : window.pageYOffset);
}
function lt(t, e) {
  return (history.state ? history.state.position - e : -1) + t;
}
const Me = /* @__PURE__ */ new Map();
function Bn(t, e) {
  Me.set(t, e);
}
function zn(t) {
  const e = Me.get(t);
  return Me.delete(t), e;
}
let Kn = () => location.protocol + "//" + location.host;
function Mt(t, e) {
  const { pathname: n, search: s, hash: r } = e, o = t.indexOf("#");
  if (o > -1) {
    let c = r.includes(t.slice(o)) ? t.slice(o).length : 1, l = r.slice(c);
    return l[0] !== "/" && (l = "/" + l), at(l, "");
  }
  return at(n, t) + s + r;
}
function Wn(t, e, n, s) {
  let r = [], o = [], i = null;
  const c = ({ state: f }) => {
    const p = Mt(t, location), y = n.value, N = e.value;
    let R = 0;
    if (f) {
      if (n.value = p, e.value = f, i && i === y) {
        i = null;
        return;
      }
      R = N ? f.position - N.position : 0;
    } else
      s(p);
    r.forEach((b) => {
      b(n.value, y, {
        delta: R,
        type: ue.pop,
        direction: R ? R > 0 ? ae.forward : ae.back : ae.unknown
      });
    });
  };
  function l() {
    i = n.value;
  }
  function u(f) {
    r.push(f);
    const p = () => {
      const y = r.indexOf(f);
      y > -1 && r.splice(y, 1);
    };
    return o.push(p), p;
  }
  function a() {
    const { history: f } = window;
    !f.state || f.replaceState(P({}, f.state, { scroll: ge() }), "");
  }
  function h() {
    for (const f of o)
      f();
    o = [], window.removeEventListener("popstate", c), window.removeEventListener("beforeunload", a);
  }
  return window.addEventListener("popstate", c), window.addEventListener("beforeunload", a), {
    pauseListeners: l,
    listen: u,
    destroy: h
  };
}
function ht(t, e, n, s = !1, r = !1) {
  return {
    back: t,
    current: e,
    forward: n,
    replaced: s,
    position: window.history.length,
    scroll: r ? ge() : null
  };
}
function qn(t) {
  const { history: e, location: n } = window, s = {
    value: Mt(t, n)
  }, r = { value: e.state };
  r.value || o(s.value, {
    back: null,
    current: s.value,
    forward: null,
    position: e.length - 1,
    replaced: !0,
    scroll: null
  }, !0);
  function o(l, u, a) {
    const h = t.indexOf("#"), f = h > -1 ? (n.host && document.querySelector("base") ? t : t.slice(h)) + l : Kn() + t + l;
    try {
      e[a ? "replaceState" : "pushState"](u, "", f), r.value = u;
    } catch (p) {
      process.env.NODE_ENV !== "production" ? S("Error with push/replace State", p) : console.error(p), n[a ? "replace" : "assign"](f);
    }
  }
  function i(l, u) {
    const a = P({}, e.state, ht(
      r.value.back,
      l,
      r.value.forward,
      !0
    ), u, { position: r.value.position });
    o(l, a, !0), s.value = l;
  }
  function c(l, u) {
    const a = P(
      {},
      r.value,
      e.state,
      {
        forward: l,
        scroll: ge()
      }
    );
    process.env.NODE_ENV !== "production" && !e.state && S(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:

history.replaceState(history.state, '', url)

You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`), o(a.current, a, !0);
    const h = P({}, ht(s.value, l, null), { position: a.position + 1 }, u);
    o(l, h, !1), s.value = l;
  }
  return {
    location: s,
    state: r,
    push: c,
    replace: i
  };
}
function Xn(t) {
  t = Hn(t);
  const e = qn(t), n = Wn(t, e.state, e.location, e.replace);
  function s(o, i = !0) {
    i || n.pauseListeners(), history.go(o);
  }
  const r = P({
    location: "",
    base: t,
    go: s,
    createHref: Fn.bind(null, t)
  }, e, n);
  return Object.defineProperty(r, "location", {
    enumerable: !0,
    get: () => e.location.value
  }), Object.defineProperty(r, "state", {
    enumerable: !0,
    get: () => e.state.value
  }), r;
}
function Qn(t) {
  return typeof t == "string" || t && typeof t == "object";
}
function $t(t) {
  return typeof t == "string" || typeof t == "symbol";
}
const G = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
}, $e = Symbol(process.env.NODE_ENV !== "production" ? "navigation failure" : "");
var ft;
(function(t) {
  t[t.aborted = 4] = "aborted", t[t.cancelled = 8] = "cancelled", t[t.duplicated = 16] = "duplicated";
})(ft || (ft = {}));
const Jn = {
  [1]({ location: t, currentLocation: e }) {
    return `No match for
 ${JSON.stringify(t)}${e ? `
while being at
` + JSON.stringify(e) : ""}`;
  },
  [2]({ from: t, to: e }) {
    return `Redirected from "${t.fullPath}" to "${es(e)}" via a navigation guard.`;
  },
  [4]({ from: t, to: e }) {
    return `Navigation aborted from "${t.fullPath}" to "${e.fullPath}" via a navigation guard.`;
  },
  [8]({ from: t, to: e }) {
    return `Navigation cancelled from "${t.fullPath}" to "${e.fullPath}" with a new navigation.`;
  },
  [16]({ from: t, to: e }) {
    return `Avoided redundant navigation to current location: "${t.fullPath}".`;
  }
};
function ee(t, e) {
  return process.env.NODE_ENV !== "production" ? P(new Error(Jn[t](e)), {
    type: t,
    [$e]: !0
  }, e) : P(new Error(), {
    type: t,
    [$e]: !0
  }, e);
}
function H(t, e) {
  return t instanceof Error && $e in t && (e == null || !!(t.type & e));
}
const Zn = ["params", "query", "hash"];
function es(t) {
  if (typeof t == "string")
    return t;
  if ("path" in t)
    return t.path;
  const e = {};
  for (const n of Zn)
    n in t && (e[n] = t[n]);
  return JSON.stringify(e, null, 2);
}
const dt = "[^/]+?", ts = {
  sensitive: !1,
  strict: !1,
  start: !0,
  end: !0
}, ns = /[.+*?^${}()[\]/\\]/g;
function ss(t, e) {
  const n = P({}, ts, e), s = [];
  let r = n.start ? "^" : "";
  const o = [];
  for (const u of t) {
    const a = u.length ? [] : [90];
    n.strict && !u.length && (r += "/");
    for (let h = 0; h < u.length; h++) {
      const f = u[h];
      let p = 40 + (n.sensitive ? 0.25 : 0);
      if (f.type === 0)
        h || (r += "/"), r += f.value.replace(ns, "\\$&"), p += 40;
      else if (f.type === 1) {
        const { value: y, repeatable: N, optional: R, regexp: b } = f;
        o.push({
          name: y,
          repeatable: N,
          optional: R
        });
        const _ = b || dt;
        if (_ !== dt) {
          p += 10;
          try {
            new RegExp(`(${_})`);
          } catch (j) {
            throw new Error(`Invalid custom RegExp for param "${y}" (${_}): ` + j.message);
          }
        }
        let A = N ? `((?:${_})(?:/(?:${_}))*)` : `(${_})`;
        h || (A = R && u.length < 2 ? `(?:/${A})` : "/" + A), R && (A += "?"), r += A, p += 20, R && (p += -8), N && (p += -20), _ === ".*" && (p += -50);
      }
      a.push(p);
    }
    s.push(a);
  }
  if (n.strict && n.end) {
    const u = s.length - 1;
    s[u][s[u].length - 1] += 0.7000000000000001;
  }
  n.strict || (r += "/?"), n.end ? r += "$" : n.strict && (r += "(?:/|$)");
  const i = new RegExp(r, n.sensitive ? "" : "i");
  function c(u) {
    const a = u.match(i), h = {};
    if (!a)
      return null;
    for (let f = 1; f < a.length; f++) {
      const p = a[f] || "", y = o[f - 1];
      h[y.name] = p && y.repeatable ? p.split("/") : p;
    }
    return h;
  }
  function l(u) {
    let a = "", h = !1;
    for (const f of t) {
      (!h || !a.endsWith("/")) && (a += "/"), h = !1;
      for (const p of f)
        if (p.type === 0)
          a += p.value;
        else if (p.type === 1) {
          const { value: y, repeatable: N, optional: R } = p, b = y in u ? u[y] : "";
          if (D(b) && !N)
            throw new Error(`Provided param "${y}" is an array but it is not repeatable (* or + modifiers)`);
          const _ = D(b) ? b.join("/") : b;
          if (!_)
            if (R)
              f.length < 2 && (a.endsWith("/") ? a = a.slice(0, -1) : h = !0);
            else
              throw new Error(`Missing required param "${y}"`);
          a += _;
        }
    }
    return a || "/";
  }
  return {
    re: i,
    score: s,
    keys: o,
    parse: c,
    stringify: l
  };
}
function rs(t, e) {
  let n = 0;
  for (; n < t.length && n < e.length; ) {
    const s = e[n] - t[n];
    if (s)
      return s;
    n++;
  }
  return t.length < e.length ? t.length === 1 && t[0] === 40 + 40 ? -1 : 1 : t.length > e.length ? e.length === 1 && e[0] === 40 + 40 ? 1 : -1 : 0;
}
function is(t, e) {
  let n = 0;
  const s = t.score, r = e.score;
  for (; n < s.length && n < r.length; ) {
    const o = rs(s[n], r[n]);
    if (o)
      return o;
    n++;
  }
  if (Math.abs(r.length - s.length) === 1) {
    if (pt(s))
      return 1;
    if (pt(r))
      return -1;
  }
  return r.length - s.length;
}
function pt(t) {
  const e = t[t.length - 1];
  return t.length > 0 && e[e.length - 1] < 0;
}
const os = {
  type: 0,
  value: ""
}, as = /[a-zA-Z0-9_]/;
function cs(t) {
  if (!t)
    return [[]];
  if (t === "/")
    return [[os]];
  if (!t.startsWith("/"))
    throw new Error(process.env.NODE_ENV !== "production" ? `Route paths should start with a "/": "${t}" should be "/${t}".` : `Invalid path "${t}"`);
  function e(p) {
    throw new Error(`ERR (${n})/"${u}": ${p}`);
  }
  let n = 0, s = n;
  const r = [];
  let o;
  function i() {
    o && r.push(o), o = [];
  }
  let c = 0, l, u = "", a = "";
  function h() {
    !u || (n === 0 ? o.push({
      type: 0,
      value: u
    }) : n === 1 || n === 2 || n === 3 ? (o.length > 1 && (l === "*" || l === "+") && e(`A repeatable param (${u}) must be alone in its segment. eg: '/:ids+.`), o.push({
      type: 1,
      value: u,
      regexp: a,
      repeatable: l === "*" || l === "+",
      optional: l === "*" || l === "?"
    })) : e("Invalid state to consume buffer"), u = "");
  }
  function f() {
    u += l;
  }
  for (; c < t.length; ) {
    if (l = t[c++], l === "\\" && n !== 2) {
      s = n, n = 4;
      continue;
    }
    switch (n) {
      case 0:
        l === "/" ? (u && h(), i()) : l === ":" ? (h(), n = 1) : f();
        break;
      case 4:
        f(), n = s;
        break;
      case 1:
        l === "(" ? n = 2 : as.test(l) ? f() : (h(), n = 0, l !== "*" && l !== "?" && l !== "+" && c--);
        break;
      case 2:
        l === ")" ? a[a.length - 1] == "\\" ? a = a.slice(0, -1) + l : n = 3 : a += l;
        break;
      case 3:
        h(), n = 0, l !== "*" && l !== "?" && l !== "+" && c--, a = "";
        break;
      default:
        e("Unknown state");
        break;
    }
  }
  return n === 2 && e(`Unfinished custom RegExp for param "${u}"`), h(), i(), r;
}
function us(t, e, n) {
  const s = ss(cs(t.path), n);
  if (process.env.NODE_ENV !== "production") {
    const o = /* @__PURE__ */ new Set();
    for (const i of s.keys)
      o.has(i.name) && S(`Found duplicated params with name "${i.name}" for path "${t.path}". Only the last one will be available on "$route.params".`), o.add(i.name);
  }
  const r = P(s, {
    record: t,
    parent: e,
    children: [],
    alias: []
  });
  return e && !r.record.aliasOf == !e.record.aliasOf && e.children.push(r), r;
}
function ls(t, e) {
  const n = [], s = /* @__PURE__ */ new Map();
  e = gt({ strict: !1, end: !0, sensitive: !1 }, e);
  function r(a) {
    return s.get(a);
  }
  function o(a, h, f) {
    const p = !f, y = fs(a);
    process.env.NODE_ENV !== "production" && gs(y, h), y.aliasOf = f && f.record;
    const N = gt(e, a), R = [
      y
    ];
    if ("alias" in a) {
      const A = typeof a.alias == "string" ? [a.alias] : a.alias;
      for (const j of A)
        R.push(P({}, y, {
          components: f ? f.record.components : y.components,
          path: j,
          aliasOf: f ? f.record : y
        }));
    }
    let b, _;
    for (const A of R) {
      const { path: j } = A;
      if (h && j[0] !== "/") {
        const K = h.record.path, L = K[K.length - 1] === "/" ? "" : "/";
        A.path = h.record.path + (j && L + j);
      }
      if (process.env.NODE_ENV !== "production" && A.path === "*")
        throw new Error(`Catch all routes ("*") must now be defined using a param with a custom regexp.
See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.`);
      if (b = us(A, h, N), process.env.NODE_ENV !== "production" && h && j[0] === "/" && ys(b, h), f ? (f.alias.push(b), process.env.NODE_ENV !== "production" && ms(f, b)) : (_ = _ || b, _ !== b && _.alias.push(b), p && a.name && !mt(b) && i(a.name)), y.children) {
        const K = y.children;
        for (let L = 0; L < K.length; L++)
          o(K[L], b, f && f.children[L]);
      }
      f = f || b, l(b);
    }
    return _ ? () => {
      i(_);
    } : oe;
  }
  function i(a) {
    if ($t(a)) {
      const h = s.get(a);
      h && (s.delete(a), n.splice(n.indexOf(h), 1), h.children.forEach(i), h.alias.forEach(i));
    } else {
      const h = n.indexOf(a);
      h > -1 && (n.splice(h, 1), a.record.name && s.delete(a.record.name), a.children.forEach(i), a.alias.forEach(i));
    }
  }
  function c() {
    return n;
  }
  function l(a) {
    let h = 0;
    for (; h < n.length && is(a, n[h]) >= 0 && (a.record.path !== n[h].record.path || !Vt(a, n[h])); )
      h++;
    n.splice(h, 0, a), a.record.name && !mt(a) && s.set(a.record.name, a);
  }
  function u(a, h) {
    let f, p = {}, y, N;
    if ("name" in a && a.name) {
      if (f = s.get(a.name), !f)
        throw ee(1, {
          location: a
        });
      N = f.record.name, p = P(
        hs(
          h.params,
          f.keys.filter((_) => !_.optional).map((_) => _.name)
        ),
        a.params
      ), y = f.stringify(p);
    } else if ("path" in a)
      y = a.path, process.env.NODE_ENV !== "production" && !y.startsWith("/") && S(`The Matcher cannot resolve relative paths but received "${y}". Unless you directly called \`matcher.resolve("${y}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`), f = n.find((_) => _.re.test(y)), f && (p = f.parse(y), N = f.record.name);
    else {
      if (f = h.name ? s.get(h.name) : n.find((_) => _.re.test(h.path)), !f)
        throw ee(1, {
          location: a,
          currentLocation: h
        });
      N = f.record.name, p = P({}, h.params, a.params), y = f.stringify(p);
    }
    const R = [];
    let b = f;
    for (; b; )
      R.unshift(b.record), b = b.parent;
    return {
      name: N,
      path: y,
      params: p,
      matched: R,
      meta: ps(R)
    };
  }
  return t.forEach((a) => o(a)), { addRoute: o, resolve: u, removeRoute: i, getRoutes: c, getRecordMatcher: r };
}
function hs(t, e) {
  const n = {};
  for (const s of e)
    s in t && (n[s] = t[s]);
  return n;
}
function fs(t) {
  return {
    path: t.path,
    redirect: t.redirect,
    name: t.name,
    meta: t.meta || {},
    aliasOf: void 0,
    beforeEnter: t.beforeEnter,
    props: ds(t),
    children: t.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in t ? t.components || null : t.component && { default: t.component }
  };
}
function ds(t) {
  const e = {}, n = t.props || !1;
  if ("component" in t)
    e.default = n;
  else
    for (const s in t.components)
      e[s] = typeof n == "boolean" ? n : n[s];
  return e;
}
function mt(t) {
  for (; t; ) {
    if (t.record.aliasOf)
      return !0;
    t = t.parent;
  }
  return !1;
}
function ps(t) {
  return t.reduce((e, n) => P(e, n.meta), {});
}
function gt(t, e) {
  const n = {};
  for (const s in t)
    n[s] = s in e ? e[s] : t[s];
  return n;
}
function Ve(t, e) {
  return t.name === e.name && t.optional === e.optional && t.repeatable === e.repeatable;
}
function ms(t, e) {
  for (const n of t.keys)
    if (!n.optional && !e.keys.find(Ve.bind(null, n)))
      return S(`Alias "${e.record.path}" and the original record: "${t.record.path}" should have the exact same param named "${n.name}"`);
  for (const n of e.keys)
    if (!n.optional && !t.keys.find(Ve.bind(null, n)))
      return S(`Alias "${e.record.path}" and the original record: "${t.record.path}" should have the exact same param named "${n.name}"`);
}
function gs(t, e) {
  e && e.record.name && !t.name && !t.path && S(`The route named "${String(e.record.name)}" has a child without a name and an empty path. Using that name won't render the empty path child so you probably want to move the name to the child instead. If this is intentional, add a name to the child route to remove the warning.`);
}
function ys(t, e) {
  for (const n of e.keys)
    if (!t.keys.find(Ve.bind(null, n)))
      return S(`Absolute path "${t.record.path}" should have the exact same param named "${n.name}" as its parent "${e.record.path}".`);
}
function Vt(t, e) {
  return e.children.some((n) => n === t || Vt(t, n));
}
const Lt = /#/g, vs = /&/g, Es = /\//g, bs = /=/g, Os = /\?/g, Ht = /\+/g, Ts = /%5B/g, _s = /%5D/g, Ut = /%5E/g, Ss = /%60/g, Ft = /%7B/g, Rs = /%7C/g, Gt = /%7D/g, ws = /%20/g;
function Fe(t) {
  return encodeURI("" + t).replace(Rs, "|").replace(Ts, "[").replace(_s, "]");
}
function Ps(t) {
  return Fe(t).replace(Ft, "{").replace(Gt, "}").replace(Ut, "^");
}
function Le(t) {
  return Fe(t).replace(Ht, "%2B").replace(ws, "+").replace(Lt, "%23").replace(vs, "%26").replace(Ss, "`").replace(Ft, "{").replace(Gt, "}").replace(Ut, "^");
}
function Ns(t) {
  return Le(t).replace(bs, "%3D");
}
function Cs(t) {
  return Fe(t).replace(Lt, "%23").replace(Os, "%3F");
}
function Is(t) {
  return t == null ? "" : Cs(t).replace(Es, "%2F");
}
function le(t) {
  try {
    return decodeURIComponent("" + t);
  } catch {
    process.env.NODE_ENV !== "production" && S(`Error decoding "${t}". Using original value`);
  }
  return "" + t;
}
function As(t) {
  const e = {};
  if (t === "" || t === "?")
    return e;
  const s = (t[0] === "?" ? t.slice(1) : t).split("&");
  for (let r = 0; r < s.length; ++r) {
    const o = s[r].replace(Ht, " "), i = o.indexOf("="), c = le(i < 0 ? o : o.slice(0, i)), l = i < 0 ? null : le(o.slice(i + 1));
    if (c in e) {
      let u = e[c];
      D(u) || (u = e[c] = [u]), u.push(l);
    } else
      e[c] = l;
  }
  return e;
}
function yt(t) {
  let e = "";
  for (let n in t) {
    const s = t[n];
    if (n = Ns(n), s == null) {
      s !== void 0 && (e += (e.length ? "&" : "") + n);
      continue;
    }
    (D(s) ? s.map((o) => o && Le(o)) : [s && Le(s)]).forEach((o) => {
      o !== void 0 && (e += (e.length ? "&" : "") + n, o != null && (e += "=" + o));
    });
  }
  return e;
}
function ks(t) {
  const e = {};
  for (const n in t) {
    const s = t[n];
    s !== void 0 && (e[n] = D(s) ? s.map((r) => r == null ? null : "" + r) : s == null ? s : "" + s);
  }
  return e;
}
const xs = Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : ""), vt = Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : ""), Ge = Symbol(process.env.NODE_ENV !== "production" ? "router" : ""), Yt = Symbol(process.env.NODE_ENV !== "production" ? "route location" : ""), He = Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
function se() {
  let t = [];
  function e(s) {
    return t.push(s), () => {
      const r = t.indexOf(s);
      r > -1 && t.splice(r, 1);
    };
  }
  function n() {
    t = [];
  }
  return {
    add: e,
    list: () => t,
    reset: n
  };
}
function B(t, e, n, s, r) {
  const o = s && (s.enterCallbacks[r] = s.enterCallbacks[r] || []);
  return () => new Promise((i, c) => {
    const l = (h) => {
      h === !1 ? c(ee(4, {
        from: n,
        to: e
      })) : h instanceof Error ? c(h) : Qn(h) ? c(ee(2, {
        from: e,
        to: h
      })) : (o && s.enterCallbacks[r] === o && typeof h == "function" && o.push(h), i());
    }, u = t.call(s && s.instances[r], e, n, process.env.NODE_ENV !== "production" ? Ds(l, e, n) : l);
    let a = Promise.resolve(u);
    if (t.length < 3 && (a = a.then(l)), process.env.NODE_ENV !== "production" && t.length > 2) {
      const h = `The "next" callback was never called inside of ${t.name ? '"' + t.name + '"' : ""}:
${t.toString()}
. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;
      if (typeof u == "object" && "then" in u)
        a = a.then((f) => l._called ? f : (S(h), Promise.reject(new Error("Invalid navigation guard"))));
      else if (u !== void 0 && !l._called) {
        S(h), c(new Error("Invalid navigation guard"));
        return;
      }
    }
    a.catch((h) => c(h));
  });
}
function Ds(t, e, n) {
  let s = 0;
  return function() {
    s++ === 1 && S(`The "next" callback was called more than once in one navigation guard when going from "${n.fullPath}" to "${e.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`), t._called = !0, s === 1 && t.apply(null, arguments);
  };
}
function Ie(t, e, n, s) {
  const r = [];
  for (const o of t) {
    process.env.NODE_ENV !== "production" && !o.components && !o.children.length && S(`Record with path "${o.path}" is either missing a "component(s)" or "children" property.`);
    for (const i in o.components) {
      let c = o.components[i];
      if (process.env.NODE_ENV !== "production") {
        if (!c || typeof c != "object" && typeof c != "function")
          throw S(`Component "${i}" in record with path "${o.path}" is not a valid component. Received "${String(c)}".`), new Error("Invalid route component");
        if ("then" in c) {
          S(`Component "${i}" in record with path "${o.path}" is a Promise instead of a function that returns a Promise. Did you write "import('./MyPage.vue')" instead of "() => import('./MyPage.vue')" ? This will break in production if not fixed.`);
          const l = c;
          c = () => l;
        } else
          c.__asyncLoader && !c.__warnedDefineAsync && (c.__warnedDefineAsync = !0, S(`Component "${i}" in record with path "${o.path}" is defined using "defineAsyncComponent()". Write "() => import('./MyPage.vue')" instead of "defineAsyncComponent(() => import('./MyPage.vue'))".`));
      }
      if (!(e !== "beforeRouteEnter" && !o.instances[i]))
        if (js(c)) {
          const u = (c.__vccOpts || c)[e];
          u && r.push(B(u, n, s, o, i));
        } else {
          let l = c();
          process.env.NODE_ENV !== "production" && !("catch" in l) && (S(`Component "${i}" in record with path "${o.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`), l = Promise.resolve(l)), r.push(() => l.then((u) => {
            if (!u)
              return Promise.reject(new Error(`Couldn't resolve component "${i}" at "${o.path}"`));
            const a = Dn(u) ? u.default : u;
            o.components[i] = a;
            const f = (a.__vccOpts || a)[e];
            return f && B(f, n, s, o, i)();
          }));
        }
    }
  }
  return r;
}
function js(t) {
  return typeof t == "object" || "displayName" in t || "props" in t || "__vccOpts" in t;
}
function Et(t) {
  const e = ce(Ge), n = ce(Yt), s = $(() => e.resolve(ie(t.to))), r = $(() => {
    const { matched: l } = s.value, { length: u } = l, a = l[u - 1], h = n.matched;
    if (!a || !h.length)
      return -1;
    const f = h.findIndex(z.bind(null, a));
    if (f > -1)
      return f;
    const p = bt(l[u - 2]);
    return u > 1 && bt(a) === p && h[h.length - 1].path !== p ? h.findIndex(z.bind(null, l[u - 2])) : f;
  }), o = $(() => r.value > -1 && Ls(n.params, s.value.params)), i = $(() => r.value > -1 && r.value === n.matched.length - 1 && jt(n.params, s.value.params));
  function c(l = {}) {
    return Vs(l) ? e[ie(t.replace) ? "replace" : "push"](
      ie(t.to)
    ).catch(oe) : Promise.resolve();
  }
  if ((process.env.NODE_ENV !== "production" || !1) && U) {
    const l = Pt();
    if (l) {
      const u = {
        route: s.value,
        isActive: o.value,
        isExactActive: i.value
      };
      l.__vrl_devtools = l.__vrl_devtools || [], l.__vrl_devtools.push(u), rn(() => {
        u.route = s.value, u.isActive = o.value, u.isExactActive = i.value;
      }, { flush: "post" });
    }
  }
  return {
    route: s,
    href: $(() => s.value.href),
    isActive: o,
    isExactActive: i,
    navigate: c
  };
}
const Ms = /* @__PURE__ */ St({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: !0
    },
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink: Et,
  setup(t, { slots: e }) {
    const n = _t(Et(t)), { options: s } = ce(Ge), r = $(() => ({
      [Ot(t.activeClass, s.linkActiveClass, "router-link-active")]: n.isActive,
      [Ot(t.exactActiveClass, s.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
    }));
    return () => {
      const o = e.default && e.default(n);
      return t.custom ? o : Rt("a", {
        "aria-current": n.isExactActive ? t.ariaCurrentValue : null,
        href: n.href,
        onClick: n.navigate,
        class: r.value
      }, o);
    };
  }
}), $s = Ms;
function Vs(t) {
  if (!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey) && !t.defaultPrevented && !(t.button !== void 0 && t.button !== 0)) {
    if (t.currentTarget && t.currentTarget.getAttribute) {
      const e = t.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(e))
        return;
    }
    return t.preventDefault && t.preventDefault(), !0;
  }
}
function Ls(t, e) {
  for (const n in e) {
    const s = e[n], r = t[n];
    if (typeof s == "string") {
      if (s !== r)
        return !1;
    } else if (!D(r) || r.length !== s.length || s.some((o, i) => o !== r[i]))
      return !1;
  }
  return !0;
}
function bt(t) {
  return t ? t.aliasOf ? t.aliasOf.path : t.path : "";
}
const Ot = (t, e, n) => t != null ? t : e != null ? e : n, Hs = /* @__PURE__ */ St({
  name: "RouterView",
  inheritAttrs: !1,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  compatConfig: { MODE: 3 },
  setup(t, { attrs: e, slots: n }) {
    process.env.NODE_ENV !== "production" && Fs();
    const s = ce(He), r = $(() => t.route || s.value), o = ce(vt, 0), i = $(() => {
      let u = ie(o);
      const { matched: a } = r.value;
      let h;
      for (; (h = a[u]) && !h.components; )
        u++;
      return u;
    }), c = $(() => r.value.matched[i.value]);
    _e(vt, $(() => i.value + 1)), _e(xs, c), _e(He, r);
    const l = sn();
    return wt(() => [l.value, c.value, t.name], ([u, a, h], [f, p, y]) => {
      a && (a.instances[h] = u, p && p !== a && u && u === f && (a.leaveGuards.size || (a.leaveGuards = p.leaveGuards), a.updateGuards.size || (a.updateGuards = p.updateGuards))), u && a && (!p || !z(a, p) || !f) && (a.enterCallbacks[h] || []).forEach((N) => N(u));
    }, { flush: "post" }), () => {
      const u = r.value, a = t.name, h = c.value, f = h && h.components[a];
      if (!f)
        return Tt(n.default, { Component: f, route: u });
      const p = h.props[a], y = p ? p === !0 ? u.params : typeof p == "function" ? p(u) : p : null, R = Rt(f, P({}, y, e, {
        onVnodeUnmounted: (b) => {
          b.component.isUnmounted && (h.instances[a] = null);
        },
        ref: l
      }));
      if ((process.env.NODE_ENV !== "production" || !1) && U && R.ref) {
        const b = {
          depth: i.value,
          name: h.name,
          path: h.path,
          meta: h.meta
        };
        (D(R.ref) ? R.ref.map((A) => A.i) : [R.ref.i]).forEach((A) => {
          A.__vrv_devtools = b;
        });
      }
      return Tt(n.default, { Component: R, route: u }) || R;
    };
  }
});
function Tt(t, e) {
  if (!t)
    return null;
  const n = t(e);
  return n.length === 1 ? n[0] : n;
}
const Us = Hs;
function Fs() {
  const t = Pt(), e = t.parent && t.parent.type.name;
  if (e && (e === "KeepAlive" || e.includes("Transition"))) {
    const n = e === "KeepAlive" ? "keep-alive" : "transition";
    S(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.
Use slot props instead:

<router-view v-slot="{ Component }">
  <${n}>
    <component :is="Component" />
  </${n}>
</router-view>`);
  }
}
function re(t, e) {
  const n = P({}, t, {
    matched: t.matched.map((s) => Qs(s, ["instances", "children", "aliasOf"]))
  });
  return {
    _custom: {
      type: null,
      readOnly: !0,
      display: t.fullPath,
      tooltip: e,
      value: n
    }
  };
}
function de(t) {
  return {
    _custom: {
      display: t
    }
  };
}
let Gs = 0;
function Ys(t, e, n) {
  if (e.__hasDevtools)
    return;
  e.__hasDevtools = !0;
  const s = Gs++;
  xn({
    id: "org.vuejs.router" + (s ? "." + s : ""),
    label: "Vue Router",
    packageName: "vue-router",
    homepage: "https://router.vuejs.org",
    logo: "https://router.vuejs.org/logo.png",
    componentStateTypes: ["Routing"],
    app: t
  }, (r) => {
    typeof r.now != "function" && console.warn("[Vue Router]: You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."), r.on.inspectComponent((a, h) => {
      a.instanceData && a.instanceData.state.push({
        type: "Routing",
        key: "$route",
        editable: !1,
        value: re(e.currentRoute.value, "Current Route")
      });
    }), r.on.visitComponentTree(({ treeNode: a, componentInstance: h }) => {
      if (h.__vrv_devtools) {
        const f = h.__vrv_devtools;
        a.tags.push({
          label: (f.name ? `${f.name.toString()}: ` : "") + f.path,
          textColor: 0,
          tooltip: "This component is rendered by &lt;router-view&gt;",
          backgroundColor: Bt
        });
      }
      D(h.__vrl_devtools) && (h.__devtoolsApi = r, h.__vrl_devtools.forEach((f) => {
        let p = Wt, y = "";
        f.isExactActive ? (p = Kt, y = "This is exactly active") : f.isActive && (p = zt, y = "This link is active"), a.tags.push({
          label: f.route.path,
          textColor: 0,
          tooltip: y,
          backgroundColor: p
        });
      }));
    }), wt(e.currentRoute, () => {
      l(), r.notifyComponentUpdate(), r.sendInspectorTree(c), r.sendInspectorState(c);
    });
    const o = "router:navigations:" + s;
    r.addTimelineLayer({
      id: o,
      label: `Router${s ? " " + s : ""} Navigations`,
      color: 4237508
    }), e.onError((a, h) => {
      r.addTimelineEvent({
        layerId: o,
        event: {
          title: "Error during Navigation",
          subtitle: h.fullPath,
          logType: "error",
          time: r.now(),
          data: { error: a },
          groupId: h.meta.__navigationId
        }
      });
    });
    let i = 0;
    e.beforeEach((a, h) => {
      const f = {
        guard: de("beforeEach"),
        from: re(h, "Current Location during this navigation"),
        to: re(a, "Target location")
      };
      Object.defineProperty(a.meta, "__navigationId", {
        value: i++
      }), r.addTimelineEvent({
        layerId: o,
        event: {
          time: r.now(),
          title: "Start of navigation",
          subtitle: a.fullPath,
          data: f,
          groupId: a.meta.__navigationId
        }
      });
    }), e.afterEach((a, h, f) => {
      const p = {
        guard: de("afterEach")
      };
      f ? (p.failure = {
        _custom: {
          type: Error,
          readOnly: !0,
          display: f ? f.message : "",
          tooltip: "Navigation Failure",
          value: f
        }
      }, p.status = de("\u274C")) : p.status = de("\u2705"), p.from = re(h, "Current Location during this navigation"), p.to = re(a, "Target location"), r.addTimelineEvent({
        layerId: o,
        event: {
          title: "End of navigation",
          subtitle: a.fullPath,
          time: r.now(),
          data: p,
          logType: f ? "warning" : "default",
          groupId: a.meta.__navigationId
        }
      });
    });
    const c = "router-inspector:" + s;
    r.addInspector({
      id: c,
      label: "Routes" + (s ? " " + s : ""),
      icon: "book",
      treeFilterPlaceholder: "Search routes"
    });
    function l() {
      if (!u)
        return;
      const a = u;
      let h = n.getRoutes().filter((f) => !f.parent);
      h.forEach(Qt), a.filter && (h = h.filter((f) => Ue(f, a.filter.toLowerCase()))), h.forEach((f) => Xt(f, e.currentRoute.value)), a.rootNodes = h.map(qt);
    }
    let u;
    r.on.getInspectorTree((a) => {
      u = a, a.app === t && a.inspectorId === c && l();
    }), r.on.getInspectorState((a) => {
      if (a.app === t && a.inspectorId === c) {
        const f = n.getRoutes().find((p) => p.record.__vd_id === a.nodeId);
        f && (a.state = {
          options: zs(f)
        });
      }
    }), r.sendInspectorTree(c), r.sendInspectorState(c);
  });
}
function Bs(t) {
  return t.optional ? t.repeatable ? "*" : "?" : t.repeatable ? "+" : "";
}
function zs(t) {
  const { record: e } = t, n = [
    { editable: !1, key: "path", value: e.path }
  ];
  return e.name != null && n.push({
    editable: !1,
    key: "name",
    value: e.name
  }), n.push({ editable: !1, key: "regexp", value: t.re }), t.keys.length && n.push({
    editable: !1,
    key: "keys",
    value: {
      _custom: {
        type: null,
        readOnly: !0,
        display: t.keys.map((s) => `${s.name}${Bs(s)}`).join(" "),
        tooltip: "Param keys",
        value: t.keys
      }
    }
  }), e.redirect != null && n.push({
    editable: !1,
    key: "redirect",
    value: e.redirect
  }), t.alias.length && n.push({
    editable: !1,
    key: "aliases",
    value: t.alias.map((s) => s.record.path)
  }), Object.keys(t.record.meta).length && n.push({
    editable: !1,
    key: "meta",
    value: t.record.meta
  }), n.push({
    key: "score",
    editable: !1,
    value: {
      _custom: {
        type: null,
        readOnly: !0,
        display: t.score.map((s) => s.join(", ")).join(" | "),
        tooltip: "Score used to sort routes",
        value: t.score
      }
    }
  }), n;
}
const Bt = 15485081, zt = 2450411, Kt = 8702998, Ks = 2282478, Wt = 16486972, Ws = 6710886;
function qt(t) {
  const e = [], { record: n } = t;
  n.name != null && e.push({
    label: String(n.name),
    textColor: 0,
    backgroundColor: Ks
  }), n.aliasOf && e.push({
    label: "alias",
    textColor: 0,
    backgroundColor: Wt
  }), t.__vd_match && e.push({
    label: "matches",
    textColor: 0,
    backgroundColor: Bt
  }), t.__vd_exactActive && e.push({
    label: "exact",
    textColor: 0,
    backgroundColor: Kt
  }), t.__vd_active && e.push({
    label: "active",
    textColor: 0,
    backgroundColor: zt
  }), n.redirect && e.push({
    label: typeof n.redirect == "string" ? `redirect: ${n.redirect}` : "redirects",
    textColor: 16777215,
    backgroundColor: Ws
  });
  let s = n.__vd_id;
  return s == null && (s = String(qs++), n.__vd_id = s), {
    id: s,
    label: n.path,
    tags: e,
    children: t.children.map(qt)
  };
}
let qs = 0;
const Xs = /^\/(.*)\/([a-z]*)$/;
function Xt(t, e) {
  const n = e.matched.length && z(e.matched[e.matched.length - 1], t.record);
  t.__vd_exactActive = t.__vd_active = n, n || (t.__vd_active = e.matched.some((s) => z(s, t.record))), t.children.forEach((s) => Xt(s, e));
}
function Qt(t) {
  t.__vd_match = !1, t.children.forEach(Qt);
}
function Ue(t, e) {
  const n = String(t.re).match(Xs);
  if (t.__vd_match = !1, !n || n.length < 3)
    return !1;
  if (new RegExp(n[1].replace(/\$$/, ""), n[2]).test(e))
    return t.children.forEach((i) => Ue(i, e)), t.record.path !== "/" || e === "/" ? (t.__vd_match = t.re.test(e), !0) : !1;
  const r = t.record.path.toLowerCase(), o = le(r);
  return !e.startsWith("/") && (o.includes(e) || r.includes(e)) || o.startsWith(e) || r.startsWith(e) || t.record.name && String(t.record.name).includes(e) ? !0 : t.children.some((i) => Ue(i, e));
}
function Qs(t, e) {
  const n = {};
  for (const s in t)
    e.includes(s) || (n[s] = t[s]);
  return n;
}
function Js(t) {
  const e = ls(t.routes, t), n = t.parseQuery || As, s = t.stringifyQuery || yt, r = t.history;
  if (process.env.NODE_ENV !== "production" && !r)
    throw new Error('Provide the "history" option when calling "createRouter()": https://next.router.vuejs.org/api/#history.');
  const o = se(), i = se(), c = se(), l = tn(G);
  let u = G;
  U && t.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
  const a = Ne.bind(null, (d) => "" + d), h = Ne.bind(null, Is), f = Ne.bind(null, le);
  function p(d, g) {
    let m, v;
    return $t(d) ? (m = e.getRecordMatcher(d), v = g) : v = d, e.addRoute(v, m);
  }
  function y(d) {
    const g = e.getRecordMatcher(d);
    g ? e.removeRoute(g) : process.env.NODE_ENV !== "production" && S(`Cannot remove non-existent route "${String(d)}"`);
  }
  function N() {
    return e.getRoutes().map((d) => d.record);
  }
  function R(d) {
    return !!e.getRecordMatcher(d);
  }
  function b(d, g) {
    if (g = P({}, g || l.value), typeof d == "string") {
      const T = Ce(n, d, g.path), C = e.resolve({ path: T.path }, g), W = r.createHref(T.fullPath);
      return process.env.NODE_ENV !== "production" && (W.startsWith("//") ? S(`Location "${d}" resolved to "${W}". A resolved location cannot start with multiple slashes.`) : C.matched.length || S(`No match found for location with path "${d}"`)), P(T, C, {
        params: f(C.params),
        hash: le(T.hash),
        redirectedFrom: void 0,
        href: W
      });
    }
    let m;
    if ("path" in d)
      process.env.NODE_ENV !== "production" && "params" in d && !("name" in d) && Object.keys(d.params).length && S(`Path "${d.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`), m = P({}, d, {
        path: Ce(n, d.path, g.path).path
      });
    else {
      const T = P({}, d.params);
      for (const C in T)
        T[C] == null && delete T[C];
      m = P({}, d, {
        params: h(d.params)
      }), g.params = h(g.params);
    }
    const v = e.resolve(m, g), w = d.hash || "";
    process.env.NODE_ENV !== "production" && w && !w.startsWith("#") && S(`A \`hash\` should always start with the character "#". Replace "${w}" with "#${w}".`), v.params = a(f(v.params));
    const k = $n(s, P({}, d, {
      hash: Ps(w),
      path: v.path
    })), O = r.createHref(k);
    return process.env.NODE_ENV !== "production" && (O.startsWith("//") ? S(`Location "${d}" resolved to "${O}". A resolved location cannot start with multiple slashes.`) : v.matched.length || S(`No match found for location with path "${"path" in d ? d.path : d}"`)), P({
      fullPath: k,
      hash: w,
      query: s === yt ? ks(d.query) : d.query || {}
    }, v, {
      redirectedFrom: void 0,
      href: O
    });
  }
  function _(d) {
    return typeof d == "string" ? Ce(n, d, l.value.path) : P({}, d);
  }
  function A(d, g) {
    if (u !== d)
      return ee(8, {
        from: g,
        to: d
      });
  }
  function j(d) {
    return te(d);
  }
  function K(d) {
    return j(P(_(d), { replace: !0 }));
  }
  function L(d) {
    const g = d.matched[d.matched.length - 1];
    if (g && g.redirect) {
      const { redirect: m } = g;
      let v = typeof m == "function" ? m(d) : m;
      if (typeof v == "string" && (v = v.includes("?") || v.includes("#") ? v = _(v) : { path: v }, v.params = {}), process.env.NODE_ENV !== "production" && !("path" in v) && !("name" in v))
        throw S(`Invalid redirect found:
${JSON.stringify(v, null, 2)}
 when navigating to "${d.fullPath}". A redirect must contain a name or path. This will break in production.`), new Error("Invalid redirect");
      return P({
        query: d.query,
        hash: d.hash,
        params: "path" in v ? {} : d.params
      }, v);
    }
  }
  function te(d, g) {
    const m = u = b(d), v = l.value, w = d.state, k = d.force, O = d.replace === !0, T = L(m);
    if (T)
      return te(
        P(_(T), {
          state: w,
          force: k,
          replace: O
        }),
        g || m
      );
    const C = m;
    C.redirectedFrom = g;
    let W;
    return !k && ct(s, v, m) && (W = ee(16, { to: C, from: v }), We(
      v,
      v,
      !0,
      !1
    )), (W ? Promise.resolve(W) : Ye(C, v)).catch((x) => H(x) ? H(x, 2) ? x : Ee(x) : ve(x, C, v)).then((x) => {
      if (x) {
        if (H(x, 2))
          return process.env.NODE_ENV !== "production" && ct(s, b(x.to), C) && g && (g._count = g._count ? g._count + 1 : 1) > 10 ? (S(`Detected an infinite redirection in a navigation guard when going from "${v.fullPath}" to "${C.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`), Promise.reject(new Error("Infinite redirect in navigation guard"))) : te(
            P({
              replace: O
            }, _(x.to), {
              state: w,
              force: k
            }),
            g || C
          );
      } else
        x = ze(C, v, !0, O, w);
      return Be(C, v, x), x;
    });
  }
  function Jt(d, g) {
    const m = A(d, g);
    return m ? Promise.reject(m) : Promise.resolve();
  }
  function Ye(d, g) {
    let m;
    const [v, w, k] = Zs(d, g);
    m = Ie(v.reverse(), "beforeRouteLeave", d, g);
    for (const T of v)
      T.leaveGuards.forEach((C) => {
        m.push(B(C, d, g));
      });
    const O = Jt.bind(null, d, g);
    return m.push(O), Z(m).then(() => {
      m = [];
      for (const T of o.list())
        m.push(B(T, d, g));
      return m.push(O), Z(m);
    }).then(() => {
      m = Ie(w, "beforeRouteUpdate", d, g);
      for (const T of w)
        T.updateGuards.forEach((C) => {
          m.push(B(C, d, g));
        });
      return m.push(O), Z(m);
    }).then(() => {
      m = [];
      for (const T of d.matched)
        if (T.beforeEnter && !g.matched.includes(T))
          if (D(T.beforeEnter))
            for (const C of T.beforeEnter)
              m.push(B(C, d, g));
          else
            m.push(B(T.beforeEnter, d, g));
      return m.push(O), Z(m);
    }).then(() => (d.matched.forEach((T) => T.enterCallbacks = {}), m = Ie(k, "beforeRouteEnter", d, g), m.push(O), Z(m))).then(() => {
      m = [];
      for (const T of i.list())
        m.push(B(T, d, g));
      return m.push(O), Z(m);
    }).catch((T) => H(T, 8) ? T : Promise.reject(T));
  }
  function Be(d, g, m) {
    for (const v of c.list())
      v(d, g, m);
  }
  function ze(d, g, m, v, w) {
    const k = A(d, g);
    if (k)
      return k;
    const O = g === G, T = U ? history.state : {};
    m && (v || O ? r.replace(d.fullPath, P({
      scroll: O && T && T.scroll
    }, w)) : r.push(d.fullPath, w)), l.value = d, We(d, g, m, O), Ee();
  }
  let ne;
  function Zt() {
    ne || (ne = r.listen((d, g, m) => {
      if (!qe.listening)
        return;
      const v = b(d), w = L(v);
      if (w) {
        te(P(w, { replace: !0 }), v).catch(oe);
        return;
      }
      u = v;
      const k = l.value;
      U && Bn(lt(k.fullPath, m.delta), ge()), Ye(v, k).catch((O) => H(O, 12) ? O : H(O, 2) ? (te(
        O.to,
        v
      ).then((T) => {
        H(T, 20) && !m.delta && m.type === ue.pop && r.go(-1, !1);
      }).catch(oe), Promise.reject()) : (m.delta && r.go(-m.delta, !1), ve(O, v, k))).then((O) => {
        O = O || ze(
          v,
          k,
          !1
        ), O && (m.delta && !H(O, 8) ? r.go(-m.delta, !1) : m.type === ue.pop && H(O, 20) && r.go(-1, !1)), Be(v, k, O);
      }).catch(oe);
    }));
  }
  let ye = se(), Ke = se(), he;
  function ve(d, g, m) {
    Ee(d);
    const v = Ke.list();
    return v.length ? v.forEach((w) => w(d, g, m)) : (process.env.NODE_ENV !== "production" && S("uncaught error during route navigation:"), console.error(d)), Promise.reject(d);
  }
  function en() {
    return he && l.value !== G ? Promise.resolve() : new Promise((d, g) => {
      ye.add([d, g]);
    });
  }
  function Ee(d) {
    return he || (he = !d, Zt(), ye.list().forEach(([g, m]) => d ? m(d) : g()), ye.reset()), d;
  }
  function We(d, g, m, v) {
    const { scrollBehavior: w } = t;
    if (!U || !w)
      return Promise.resolve();
    const k = !m && zn(lt(d.fullPath, 0)) || (v || !m) && history.state && history.state.scroll || null;
    return nn().then(() => w(d, g, k)).then((O) => O && Yn(O)).catch((O) => ve(O, d, g));
  }
  const be = (d) => r.go(d);
  let Oe;
  const Te = /* @__PURE__ */ new Set(), qe = {
    currentRoute: l,
    listening: !0,
    addRoute: p,
    removeRoute: y,
    hasRoute: R,
    getRoutes: N,
    resolve: b,
    options: t,
    push: j,
    replace: K,
    go: be,
    back: () => be(-1),
    forward: () => be(1),
    beforeEach: o.add,
    beforeResolve: i.add,
    afterEach: c.add,
    onError: Ke.add,
    isReady: en,
    install(d) {
      const g = this;
      d.component("RouterLink", $s), d.component("RouterView", Us), d.config.globalProperties.$router = g, Object.defineProperty(d.config.globalProperties, "$route", {
        enumerable: !0,
        get: () => ie(l)
      }), U && !Oe && l.value === G && (Oe = !0, j(r.location).catch((w) => {
        process.env.NODE_ENV !== "production" && S("Unexpected error when starting the router:", w);
      }));
      const m = {};
      for (const w in G)
        m[w] = $(() => l.value[w]);
      d.provide(Ge, g), d.provide(Yt, _t(m)), d.provide(He, l);
      const v = d.unmount;
      Te.add(d), d.unmount = function() {
        Te.delete(d), Te.size < 1 && (u = G, ne && ne(), ne = null, l.value = G, Oe = !1, he = !1), v();
      }, (process.env.NODE_ENV !== "production" || !1) && U && Ys(d, g, e);
    }
  };
  return qe;
}
function Z(t) {
  return t.reduce((e, n) => e.then(() => n()), Promise.resolve());
}
function Zs(t, e) {
  const n = [], s = [], r = [], o = Math.max(e.matched.length, t.matched.length);
  for (let i = 0; i < o; i++) {
    const c = e.matched[i];
    c && (t.matched.find((u) => z(u, c)) ? s.push(c) : n.push(c));
    const l = t.matched[i];
    l && (e.matched.find((u) => z(u, l)) || r.push(l));
  }
  return [n, s, r];
}
const er = [
  {
    path: "/",
    component: {
      template: "<div><br>Login</div>"
    },
    props: !0
  },
  {
    path: "/home",
    component: "<div><h1>HOME</h1></div>",
    props: !0
  },
  {
    path: "/404",
    component: { template: "<h1>404</h1>" }
  },
  {
    path: "/:table",
    component: "<div><h1>TABLE</h1></div>"
  },
  {
    path: "/:table/:id",
    component: "<div><h1>FORM</h1></div>"
  }
], tr = Js({
  history: Xn(),
  routes: er
});
class nr {
  constructor(e = void 0) {
    e === void 0 || import(resolve(e)).then((n) => {
      console.log(n);
    });
  }
  loadRoutes() {
  }
  loadEvents() {
  }
  loadClient() {
  }
  loadCustomComponents() {
  }
}
function sr(t, e) {
  const n = Tn(r), s = Rn(n);
  t.use(s), t.use(tr);
  const r = new nr();
}
const ir = {
  install: sr
};
export {
  ir as default
};
