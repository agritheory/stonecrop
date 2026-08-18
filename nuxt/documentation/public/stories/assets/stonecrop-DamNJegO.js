import { aI as defineStore, ay as ref, ax as computed, aG as watch, aw as reactive, aJ as shallowRef, aK as toValue, aL as onMounted, aM as nextTick, aN as readonly, aO as getCurrentInstance, aP as toRef, aQ as customRef, aR as unref } from "./vendor-BFYlYCwc.js";
const Di = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Ci = Object.prototype.toString, qi = (e) => Ci.call(e) === "[object Object]", Tn = () => {
};
function Ni(...e) {
  if (e.length !== 1) return toRef(...e);
  const t = e[0];
  return typeof t == "function" ? readonly(customRef(() => ({
    get: t,
    set: Tn
  }))) : ref(t);
}
function Pi(e, t) {
  function r(...n) {
    return new Promise((i, o) => {
      Promise.resolve(e(() => t.apply(this, n), {
        fn: t,
        thisArg: this,
        args: n
      })).then(i).catch(o);
    });
  }
  return r;
}
const Ln = (e) => e();
function Fi(e = Ln, t = {}) {
  const { initialState: r = "active" } = t, n = Ni(r === "active");
  function i() {
    n.value = false;
  }
  function o() {
    n.value = true;
  }
  const s = (...a) => {
    n.value && e(...a);
  };
  return {
    isActive: readonly(n),
    pause: i,
    resume: o,
    eventFilter: s
  };
}
function nr(e) {
  return Array.isArray(e) ? e : [e];
}
function ji(e) {
  return getCurrentInstance();
}
function Bi(e, t, r = {}) {
  const { eventFilter: n = Ln, ...i } = r;
  return watch(e, Pi(n, t), i);
}
function xi(e, t, r = {}) {
  const { eventFilter: n, initialState: i = "active", ...o } = r, { eventFilter: s, pause: a, resume: u, isActive: c } = Fi(n, { initialState: i });
  return {
    stop: Bi(e, t, {
      ...o,
      eventFilter: s
    }),
    pause: a,
    resume: u,
    isActive: c
  };
}
function Ui(e, t = true, r) {
  ji() ? onMounted(e, r) : t ? e() : nextTick(e);
}
function Wi(e, t, r) {
  return watch(e, t, {
    ...r,
    immediate: true
  });
}
const Nt = Di ? window : void 0;
function Ki(e) {
  var t;
  const r = toValue(e);
  return (t = r?.$el) !== null && t !== void 0 ? t : r;
}
function Wt(...e) {
  const t = (n, i, o, s) => (n.addEventListener(i, o, s), () => n.removeEventListener(i, o, s)), r = computed(() => {
    const n = nr(toValue(e[0])).filter((i) => i != null);
    return n.every((i) => typeof i != "string") ? n : void 0;
  });
  return Wi(() => {
    var n, i;
    return [
      (n = (i = r.value) === null || i === void 0 ? void 0 : i.map((o) => Ki(o))) !== null && n !== void 0 ? n : [Nt].filter((o) => o != null),
      nr(toValue(r.value ? e[1] : e[0])),
      nr(unref(r.value ? e[2] : e[1])),
      toValue(r.value ? e[3] : e[2])
    ];
  }, ([n, i, o, s], a, u) => {
    if (!n?.length || !i?.length || !o?.length) return;
    const c = qi(s) ? { ...s } : s, f = n.flatMap((h) => i.flatMap((l) => o.map((g) => t(h, l, g, c))));
    u(() => {
      f.forEach((h) => h());
    });
  }, { flush: "post" });
}
const De = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Ce = "__vueuse_ssr_handlers__", Hi = /* @__PURE__ */ Vi();
function Vi() {
  return Ce in De || (De[Ce] = De[Ce] || {}), De[Ce];
}
function Yi(e, t) {
  return Hi[e] || t;
}
function Ji(e) {
  return e == null ? "any" : e instanceof Set ? "set" : e instanceof Map ? "map" : e instanceof Date ? "date" : typeof e == "boolean" ? "boolean" : typeof e == "string" ? "string" : typeof e == "object" ? "object" : Number.isNaN(e) ? "any" : "number";
}
const Gi = {
  boolean: {
    read: (e) => e === "true",
    write: (e) => String(e)
  },
  object: {
    read: (e) => JSON.parse(e),
    write: (e) => JSON.stringify(e)
  },
  number: {
    read: (e) => Number.parseFloat(e),
    write: (e) => String(e)
  },
  any: {
    read: (e) => e,
    write: (e) => String(e)
  },
  string: {
    read: (e) => e,
    write: (e) => String(e)
  },
  map: {
    read: (e) => new Map(JSON.parse(e)),
    write: (e) => JSON.stringify(Array.from(e.entries()))
  },
  set: {
    read: (e) => new Set(JSON.parse(e)),
    write: (e) => JSON.stringify(Array.from(e))
  },
  date: {
    read: (e) => new Date(e),
    write: (e) => e.toISOString()
  }
}, Qr = "vueuse-storage";
function Zi(e, t, r, n = {}) {
  var i;
  const { flush: o = "pre", deep: s = true, listenToStorageChanges: a = true, writeDefaults: u = true, mergeDefaults: c = false, shallow: f, window: h = Nt, eventFilter: l, onError: g = (I) => {
    console.error(I);
  }, initOnMounted: p } = n, d = (f ? shallowRef : ref)(t), S = computed(() => toValue(e));
  if (!r) try {
    r = Yi("getDefaultStorage", () => Nt?.localStorage)();
  } catch (I) {
    g(I);
  }
  if (!r) return d;
  const R = toValue(t), b = Ji(R), w = (i = n.serializer) !== null && i !== void 0 ? i : Gi[b], { pause: K, resume: k } = xi(d, (I) => ae(I), {
    flush: o,
    deep: s,
    eventFilter: l
  });
  watch(S, () => wt(), { flush: o });
  let $ = false;
  const H = (I) => {
    p && !$ || wt(I);
  }, J = (I) => {
    p && !$ || ce(I);
  };
  h && a && (r instanceof Storage ? Wt(h, "storage", H, { passive: true }) : Wt(h, Qr, J)), p ? Ui(() => {
    $ = true, wt();
  }) : wt();
  function W(I, F) {
    if (h) {
      const Q = {
        key: S.value,
        oldValue: I,
        newValue: F,
        storageArea: r
      };
      h.dispatchEvent(r instanceof Storage ? new StorageEvent("storage", Q) : new CustomEvent(Qr, { detail: Q }));
    }
  }
  function ae(I) {
    try {
      const F = r.getItem(S.value);
      if (I == null)
        W(F, null), r.removeItem(S.value);
      else {
        const Q = w.write(I);
        F !== Q && (r.setItem(S.value, Q), W(F, Q));
      }
    } catch (F) {
      g(F);
    }
  }
  function ue(I) {
    const F = I ? I.newValue : r.getItem(S.value);
    if (F == null)
      return u && R != null && r.setItem(S.value, w.write(R)), R;
    if (!I && c) {
      const Q = w.read(F);
      return typeof c == "function" ? c(Q, R) : b === "object" && !Array.isArray(Q) ? {
        ...R,
        ...Q
      } : Q;
    } else return typeof F != "string" ? F : w.read(F);
  }
  function wt(I) {
    if (!(I && I.storageArea !== r)) {
      if (I && I.key == null) {
        d.value = R;
        return;
      }
      if (!(I && I.key !== S.value)) {
        K();
        try {
          const F = w.write(d.value);
          (I === void 0 || I?.newValue !== F) && (d.value = ue(I));
        } catch (F) {
          g(F);
        } finally {
          I ? nextTick(k) : k();
        }
      }
    }
  }
  function ce(I) {
    wt(I.detail);
  }
  return d;
}
function Xi(e, t, r = {}) {
  const { window: n = Nt } = r;
  return Zi(e, t, n?.localStorage, r);
}
function ir() {
  return typeof crypto < "u" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
function qe(e) {
  const t = {
    type: e.type,
    clientId: e.clientId,
    timestamp: e.timestamp.toISOString()
  };
  return e.operation && (t.operation = {
    ...e.operation,
    timestamp: e.operation.timestamp.toISOString()
  }), e.operations && (t.operations = e.operations.map((r) => ({
    ...r,
    timestamp: r.timestamp.toISOString()
  }))), t;
}
function eo(e) {
  const t = {
    type: e.type,
    clientId: e.clientId,
    timestamp: new Date(e.timestamp)
  };
  return e.operation && (t.operation = {
    ...e.operation,
    timestamp: new Date(e.operation.timestamp)
  }), e.operations && (t.operations = e.operations.map((r) => ({
    ...r,
    timestamp: new Date(r.timestamp)
  }))), t;
}
const Ie = defineStore("hst-operation-log", () => {
  const e = ref({
    maxOperations: 100,
    enableCrossTabSync: true,
    autoSyncInterval: 3e4,
    enablePersistence: false,
    persistenceKeyPrefix: "stonecrop-ops"
  }), t = ref([]), r = ref(-1), n = ref(ir()), i = ref(false), o = ref([]), s = computed(() => r.value < 0 ? false : t.value[r.value]?.reversible ?? false), a = computed(() => r.value < t.value.length - 1), u = computed(() => {
    let _ = 0;
    for (let v = r.value; v >= 0 && t.value[v]?.reversible; v--)
      _++;
    return _;
  }), c = computed(() => t.value.length - 1 - r.value), f = computed(
    () => ({
      canUndo: s.value,
      canRedo: a.value,
      undoCount: u.value,
      redoCount: c.value,
      currentIndex: r.value
    })
  );
  function h(_) {
    e.value = { ...e.value, ..._ }, e.value.enablePersistence && (Q(), xt()), e.value.enableCrossTabSync && ae();
  }
  function l(_, v = "user") {
    const y = {
      ..._,
      id: ir(),
      timestamp: /* @__PURE__ */ new Date(),
      source: v,
      userId: e.value.userId
    };
    if (e.value.operationFilter && !e.value.operationFilter(y))
      return y.id;
    if (i.value && o.value.length > 0)
      return o.value[o.value.length - 1].operations.push(y), y.id;
    if (r.value < t.value.length - 1 && (t.value = t.value.slice(0, r.value + 1)), t.value.push(y), r.value++, e.value.maxOperations && t.value.length > e.value.maxOperations) {
      const x = t.value.length - e.value.maxOperations;
      t.value = t.value.slice(x), r.value -= x;
    }
    return e.value.enableCrossTabSync && ue(y), y.id;
  }
  function g() {
    i.value = true, o.value.push({
      id: ir(),
      operations: []
    });
  }
  function p(_) {
    if (!i.value || o.value.length === 0)
      return null;
    const v = o.value.pop(), y = v.operations;
    if (y.length === 0)
      return o.value.length === 0 && (i.value = false), null;
    const x = v.id, it = y.every((E) => E.reversible), m = {
      id: x,
      type: "batch",
      path: "",
      // Batch doesn't have a single path
      fieldname: "",
      beforeValue: null,
      afterValue: null,
      doctype: y[0]?.doctype || "",
      timestamp: /* @__PURE__ */ new Date(),
      source: "user",
      reversible: it,
      irreversibleReason: it ? void 0 : "Contains irreversible operations",
      descendantOperationIds: y.map((E) => E.id),
      metadata: { description: _ }
    };
    return y.forEach((E) => {
      E.ancestorOperationId = x;
    }), o.value.length > 0 ? o.value[o.value.length - 1].operations.push(m) : (t.value.push(...y, m), r.value = t.value.length - 1), e.value.enableCrossTabSync && wt(y, m), o.value.length === 0 && (i.value = false), x;
  }
  function d() {
    o.value = [], i.value = false;
  }
  function S(_) {
    if (!s.value) return false;
    const v = t.value[r.value];
    if (!v.reversible)
      return typeof console < "u" && v.irreversibleReason && console.warn("Cannot undo irreversible operation:", v.irreversibleReason), false;
    try {
      if (v.type === "batch" && v.descendantOperationIds)
        for (let y = v.descendantOperationIds.length - 1; y >= 0; y--) {
          const x = v.descendantOperationIds[y], it = t.value.find((m) => m.id === x);
          it && b(it, _);
        }
      else
        b(v, _);
      return r.value--, e.value.enableCrossTabSync && ce(v), true;
    } catch (y) {
      return typeof console < "u" && console.error("Undo failed:", y), false;
    }
  }
  function R(_) {
    if (!a.value) return false;
    const v = t.value[r.value + 1];
    try {
      if (v.type === "batch" && v.descendantOperationIds)
        for (const y of v.descendantOperationIds) {
          const x = t.value.find((it) => it.id === y);
          x && w(x, _);
        }
      else
        w(v, _);
      return r.value++, e.value.enableCrossTabSync && I(v), true;
    } catch (y) {
      return typeof console < "u" && console.error("Redo failed:", y), false;
    }
  }
  function b(_, v) {
    (_.type === "set" || _.type === "delete") && v && typeof v.set == "function" && v.set(_.path, _.beforeValue, "undo");
  }
  function w(_, v) {
    (_.type === "set" || _.type === "delete") && v && typeof v.set == "function" && v.set(_.path, _.afterValue, "redo");
  }
  function K() {
    const _ = t.value.filter((y) => y.reversible).length, v = t.value.map((y) => y.timestamp);
    return {
      operations: [...t.value],
      currentIndex: r.value,
      totalOperations: t.value.length,
      reversibleOperations: _,
      irreversibleOperations: t.value.length - _,
      oldestOperation: v.length > 0 ? new Date(Math.min(...v.map((y) => y.getTime()))) : void 0,
      newestOperation: v.length > 0 ? new Date(Math.max(...v.map((y) => y.getTime()))) : void 0
    };
  }
  function k() {
    t.value = [], r.value = -1;
  }
  function $(_, v) {
    return t.value.filter((y) => y.doctype === _ && (v === void 0 || y.recordId === v));
  }
  function H(_, v) {
    const y = t.value.find((x) => x.id === _);
    y && (y.reversible = false, y.irreversibleReason = v);
  }
  function J(_, v, y, x = "success", it) {
    const m = {
      type: "action",
      path: y && y.length > 0 ? `${_}.${y[0]}` : _,
      fieldname: "",
      beforeValue: null,
      afterValue: null,
      doctype: _,
      recordId: y && y.length > 0 ? y[0] : void 0,
      reversible: false,
      // Actions are typically not reversible
      actionName: v,
      actionRecordIds: y,
      actionResult: x,
      actionError: it
    };
    return l(m);
  }
  let W = null;
  function ae() {
    typeof window > "u" || !window.BroadcastChannel || (W = new BroadcastChannel("stonecrop-operation-log"), W.addEventListener("message", (_) => {
      const v = _.data;
      if (!v || typeof v != "object") return;
      const y = eo(v);
      y.clientId !== n.value && (y.type === "operation" && y.operation ? (t.value.push({ ...y.operation, source: "sync" }), r.value = t.value.length - 1) : y.type === "operation" && y.operations && (t.value.push(...y.operations.map((x) => ({ ...x, source: "sync" }))), r.value = t.value.length - 1));
    }));
  }
  function ue(_) {
    if (!W) return;
    const v = {
      type: "operation",
      operation: _,
      clientId: n.value,
      timestamp: /* @__PURE__ */ new Date()
    };
    W.postMessage(qe(v));
  }
  function wt(_, v) {
    if (!W) return;
    const y = {
      type: "operation",
      operations: [..._, v],
      clientId: n.value,
      timestamp: /* @__PURE__ */ new Date()
    };
    W.postMessage(qe(y));
  }
  function ce(_) {
    if (!W) return;
    const v = {
      type: "undo",
      operation: _,
      clientId: n.value,
      timestamp: /* @__PURE__ */ new Date()
    };
    W.postMessage(qe(v));
  }
  function I(_) {
    if (!W) return;
    const v = {
      type: "redo",
      operation: _,
      clientId: n.value,
      timestamp: /* @__PURE__ */ new Date()
    };
    W.postMessage(qe(v));
  }
  const F = Xi("stonecrop-operations", null, {
    serializer: {
      read: (_) => {
        try {
          return JSON.parse(_);
        } catch {
          return null;
        }
      },
      write: (_) => _ ? JSON.stringify(_) : ""
    }
  });
  function Q() {
    if (!(typeof window > "u"))
      try {
        const _ = F.value;
        _ && Array.isArray(_.operations) && (t.value = _.operations.map((v) => ({
          ...v,
          timestamp: new Date(v.timestamp)
        })), r.value = _.currentIndex ?? -1);
      } catch (_) {
        typeof console < "u" && console.error("Failed to load operations from persistence:", _);
      }
  }
  function fe() {
    if (!(typeof window > "u"))
      try {
        F.value = {
          operations: t.value.map((_) => ({
            ..._,
            timestamp: _.timestamp.toISOString()
          })),
          currentIndex: r.value
        };
      } catch (_) {
        typeof console < "u" && console.error("Failed to save operations to persistence:", _);
      }
  }
  function xt() {
    watch(
      [t, r],
      () => {
        e.value.enablePersistence && fe();
      },
      { deep: true }
    );
  }
  return {
    // State
    operations: t,
    currentIndex: r,
    config: e,
    clientId: n,
    undoRedoState: f,
    // Computed
    canUndo: s,
    canRedo: a,
    undoCount: u,
    redoCount: c,
    // Methods
    configure: h,
    addOperation: l,
    startBatch: g,
    commitBatch: p,
    cancelBatch: d,
    undo: S,
    redo: R,
    clear: k,
    getOperationsFor: $,
    getSnapshot: K,
    markIrreversible: H,
    logAction: J
  };
});
class _e {
  /**
   * The root FieldTriggerEngine instance
   */
  static _root;
  options;
  doctypeActions = /* @__PURE__ */ new Map();
  // doctype -> action/field -> functions
  doctypeTransitions = /* @__PURE__ */ new Map();
  // doctype -> transition -> functions
  fieldRollbackConfig = /* @__PURE__ */ new Map();
  // doctype -> field -> rollback enabled
  globalActions = /* @__PURE__ */ new Map();
  // action name -> function
  globalTransitionActions = /* @__PURE__ */ new Map();
  // transition action name -> function
  /**
   * Creates a new FieldTriggerEngine instance (singleton pattern)
   * @param options - Configuration options for the field trigger engine
   */
  constructor(t = {}) {
    if (_e._root)
      return _e._root;
    _e._root = this, this.options = {
      defaultTimeout: t.defaultTimeout ?? 5e3,
      debug: t.debug ?? false,
      enableRollback: t.enableRollback ?? true,
      errorHandler: t.errorHandler
    };
  }
  /**
   * Register a global action function
   * @param name - The name of the action
   * @param fn - The action function
   */
  registerAction(t, r) {
    this.globalActions.set(t, r);
  }
  /**
   * Look up a registered action function by name.
   * Returns `undefined` if the action has not been registered.
   * @param name - The action name
   */
  getAction(t) {
    return this.globalActions.get(t);
  }
  /**
   * Register a global XState transition action function
   * @param name - The name of the transition action
   * @param fn - The transition action function
   */
  registerTransitionAction(t, r) {
    this.globalTransitionActions.set(t, r);
  }
  /**
   * Configure rollback behavior for a specific field trigger
   * @param doctype - The doctype name
   * @param fieldname - The field name
   * @param enableRollback - Whether to enable rollback
   */
  setFieldRollback(t, r, n) {
    this.fieldRollbackConfig.has(t) || this.fieldRollbackConfig.set(t, /* @__PURE__ */ new Map()), this.fieldRollbackConfig.get(t).set(r, n);
  }
  /**
   * Get rollback configuration for a specific field trigger
   */
  getFieldRollback(t, r) {
    return this.fieldRollbackConfig.get(t)?.get(r);
  }
  /**
   * Register actions from a doctype - both regular actions and field triggers
   * Separates XState transitions (uppercase) from field triggers (lowercase)
   * @param doctype - The doctype name
   * @param actions - The actions to register (supports Immutable Map, Map, or plain object)
   */
  registerDoctypeActions(t, r) {
    if (!r) return;
    const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = r;
    if (typeof o.entrySeq == "function")
      o.entrySeq().forEach(([s, a]) => {
        this.categorizeAction(s, a, n, i);
      });
    else if (r instanceof Map)
      for (const [s, a] of r)
        this.categorizeAction(s, a, n, i);
    else r && typeof r == "object" && Object.entries(r).forEach(([s, a]) => {
      this.categorizeAction(s, a, n, i);
    });
    this.doctypeActions.set(t, n), this.doctypeTransitions.set(t, i);
  }
  /**
   * Categorize an action as either a field trigger or XState transition
   * Uses uppercase convention: UPPERCASE = transition, lowercase/mixed = field trigger
   */
  categorizeAction(t, r, n, i) {
    this.isTransitionKey(t) ? i.set(t, r) : n.set(t, r);
  }
  /**
   * Determine if a key represents an XState transition
   * Transitions are identified by being all uppercase
   */
  isTransitionKey(t) {
    return /^[A-Z0-9_]+$/.test(t) && t.length > 0;
  }
  /**
   * Execute field triggers for a changed field
   * @param context - The field change context
   * @param options - Execution options (timeout and enableRollback)
   */
  async executeFieldTriggers(t, r = {}) {
    const { doctype: n, fieldname: i } = t, o = this.findFieldTriggers(n, i);
    if (o.length === 0)
      return {
        path: t.path,
        actionResults: [],
        totalExecutionTime: 0,
        allSucceeded: true,
        stoppedOnError: false,
        rolledBack: false
      };
    const s = performance.now(), a = [];
    let u = false, c = false, f;
    const h = this.getFieldRollback(n, i), l = r.enableRollback ?? h ?? this.options.enableRollback;
    l && t.store && (f = this.captureSnapshot(t));
    for (const S of o)
      try {
        const R = await this.executeAction(S, t, r.timeout);
        if (a.push(R), !R.success) {
          u = true;
          break;
        }
      } catch (R) {
        const w = {
          success: false,
          error: R instanceof Error ? R : new Error(String(R)),
          executionTime: 0,
          action: S
        };
        a.push(w), u = true;
        break;
      }
    if (l && u && f && t.store)
      try {
        this.restoreSnapshot(t, f), c = true;
      } catch (S) {
        console.error("[FieldTriggers] Rollback failed:", S);
      }
    const g = performance.now() - s, p = a.filter((S) => !S.success && S.error != null);
    if (p.length > 0 && this.options.errorHandler)
      for (const S of p)
        try {
          S.error && this.options.errorHandler(S.error, t, S.action);
        } catch (R) {
          console.error("[FieldTriggers] Error in global error handler:", R);
        }
    return {
      path: t.path,
      actionResults: a,
      totalExecutionTime: g,
      allSucceeded: a.every((S) => S.success),
      stoppedOnError: u,
      rolledBack: c,
      snapshot: this.options.debug && l ? f : void 0
      // Only include snapshot in debug mode if rollback is enabled
    };
  }
  /**
   * Execute XState transition actions
   * Similar to field triggers but specifically for FSM state transitions
   * @param context - The transition change context
   * @param options - Execution options (timeout)
   */
  async executeTransitionActions(t, r = {}) {
    const { doctype: n, transition: i } = t, o = this.findTransitionActions(n, i);
    if (o.length === 0)
      return [];
    const s = [];
    for (const u of o)
      try {
        const c = await this.executeTransitionAction(u, t, r.timeout);
        if (s.push(c), !c.success)
          break;
      } catch (c) {
        const h = {
          success: false,
          error: c instanceof Error ? c : new Error(String(c)),
          executionTime: 0,
          action: u,
          transition: i
        };
        s.push(h);
        break;
      }
    const a = s.filter((u) => !u.success);
    if (a.length > 0 && this.options.errorHandler)
      for (const u of a)
        try {
          u.error && this.options.errorHandler(u.error, t, u.action);
        } catch (c) {
          console.error("[FieldTriggers] Error in global error handler:", c);
        }
    return s;
  }
  /**
   * Find transition actions for a specific doctype and transition
   */
  findTransitionActions(t, r) {
    const n = this.doctypeTransitions.get(t);
    return n ? n.get(r) || [] : [];
  }
  /**
   * Execute a single transition action by name
   */
  async executeTransitionAction(t, r, n) {
    const i = performance.now(), o = n ?? this.options.defaultTimeout;
    try {
      let s = this.globalTransitionActions.get(t);
      if (!s) {
        const u = this.globalActions.get(t);
        u && (s = u);
      }
      if (!s)
        throw new Error(`Transition action "${t}" not found in registry`);
      return await this.executeWithTimeout(s, r, o), {
        success: true,
        executionTime: performance.now() - i,
        action: t,
        transition: r.transition
      };
    } catch (s) {
      const a = performance.now() - i;
      return {
        success: false,
        error: s instanceof Error ? s : new Error(String(s)),
        executionTime: a,
        action: t,
        transition: r.transition
      };
    }
  }
  /**
   * Find field triggers for a specific doctype and field
   * Field triggers are identified by keys that look like field paths (contain dots or match field names)
   */
  findFieldTriggers(t, r) {
    const n = this.doctypeActions.get(t);
    if (!n) return [];
    const i = [];
    for (const [o, s] of n)
      this.isFieldTriggerKey(o, r) && i.push(...s);
    return i;
  }
  /**
   * Determine if an action key represents a field trigger
   * Field triggers can be:
   * - Exact field name match: "emailAddress"
   * - Wildcard patterns: "emailAddress.*", "*.is_primary"
   * - Nested field paths: "address.street", "contact.email"
   */
  isFieldTriggerKey(t, r) {
    return t === r ? true : t.includes(".") ? this.matchFieldPattern(t, r) : t.includes("*") ? this.matchFieldPattern(t, r) : false;
  }
  /**
   * Match a field pattern against a field name
   * Supports wildcards (*) for dynamic segments
   */
  matchFieldPattern(t, r) {
    const n = t.split("."), i = r.split(".");
    if (n.length !== i.length)
      return false;
    for (let o = 0; o < n.length; o++) {
      const s = n[o], a = i[o];
      if (s !== "*" && s !== a)
        return false;
    }
    return true;
  }
  /**
   * Execute a single action by name
   */
  async executeAction(t, r, n) {
    const i = performance.now(), o = n ?? this.options.defaultTimeout;
    try {
      const s = this.globalActions.get(t);
      if (!s)
        throw new Error(`Action "${t}" not found in registry`);
      return await this.executeWithTimeout(s, r, o), {
        success: true,
        executionTime: performance.now() - i,
        action: t
      };
    } catch (s) {
      const a = performance.now() - i;
      return {
        success: false,
        error: s instanceof Error ? s : new Error(String(s)),
        executionTime: a,
        action: t
      };
    }
  }
  /**
   * Execute a function with timeout
   */
  async executeWithTimeout(t, r, n) {
    return new Promise((i, o) => {
      const s = setTimeout(() => {
        o(new Error(`Action timeout after ${n}ms`));
      }, n);
      Promise.resolve(t(r)).then((a) => {
        clearTimeout(s), i(a);
      }).catch((a) => {
        clearTimeout(s), o(a instanceof Error ? a : new Error(String(a)));
      });
    });
  }
  /**
   * Capture a snapshot of the record state before executing actions
   * This creates a deep copy of the record data for potential rollback
   */
  captureSnapshot(t) {
    if (!(!t.store || !t.doctype || !t.recordId))
      try {
        const r = `${t.doctype}.${t.recordId}`, n = t.store.get(r);
        return !n || typeof n != "object" ? void 0 : JSON.parse(JSON.stringify(n));
      } catch (r) {
        this.options.debug && console.warn("[FieldTriggers] Failed to capture snapshot:", r);
        return;
      }
  }
  /**
   * Restore a previously captured snapshot
   * This reverts the record to its state before actions were executed
   */
  restoreSnapshot(t, r) {
    if (!(!t.store || !t.doctype || !t.recordId || !r))
      try {
        const n = `${t.doctype}.${t.recordId}`;
        t.store.set(n, r), this.options.debug && console.log(`[FieldTriggers] Rolled back ${n} to previous state`);
      } catch (n) {
        throw console.error("[FieldTriggers] Failed to restore snapshot:", n), n;
      }
  }
}
function bt(e) {
  return new _e(e);
}
function tn() {
  try {
    return Ie();
  } catch {
    return null;
  }
}
class Kt {
  static instance;
  /**
   * Gets the singleton instance of HST
   * @returns The HST singleton instance
   */
  static getInstance() {
    return Kt.instance || (Kt.instance = new Kt()), Kt.instance;
  }
  /**
   * Gets the global registry instance
   * @returns The global registry object or undefined if not found
   */
  getRegistry() {
    if (typeof globalThis < "u") {
      const t = globalThis.Registry?._root;
      if (t)
        return t;
    }
    if (typeof window < "u") {
      const t = window.Registry?._root;
      if (t)
        return t;
    }
    if (typeof global < "u" && global) {
      const t = global.Registry?._root;
      if (t)
        return t;
    }
  }
  /**
   * Helper method to get doctype metadata from the registry
   * @param doctype - The name of the doctype to retrieve metadata for
   * @returns The doctype metadata object or undefined if not found
   */
  getDoctypeMeta(t) {
    const r = this.getRegistry();
    if (r && typeof r == "object" && "registry" in r)
      return r.registry[t];
  }
}
class Ue {
  target;
  ancestorPath;
  rootNode;
  doctype;
  hst;
  constructor(t, r, n = "", i = null) {
    return this.target = t, this.ancestorPath = n, this.rootNode = i || this, this.doctype = r, this.hst = Kt.getInstance(), new Proxy(this, {
      get(o, s) {
        if (s in o) return Reflect.get(o, s);
        const a = String(s);
        return o.getNode(a);
      },
      set(o, s, a) {
        const u = String(s);
        return o.set(u, a), true;
      }
    });
  }
  get(t) {
    return this.resolveValue(t);
  }
  // Method to get a tree-wrapped node for navigation
  getNode(t) {
    const r = this.resolvePath(t), n = this.resolveValue(t), i = r.split(".");
    let o = this.doctype;
    return this.doctype === "StonecropStore" && i.length >= 1 && (o = i[0]), typeof n == "object" && n !== null && !this.isPrimitive(n) ? new Ue(n, o, r, this.rootNode) : new Ue(n, o, r, this.rootNode);
  }
  set(t, r, n = "user") {
    const i = this.resolvePath(t);
    if (i === void 0) {
      console.warn("HST.set: resolved path is undefined, skipping operation");
      return;
    }
    const o = this.has(t) ? this.get(t) : void 0;
    if (n !== "undo" && n !== "redo") {
      const s = tn();
      if (s && typeof s.addOperation == "function") {
        const a = i.split("."), u = this.doctype === "StonecropStore" && a.length >= 1 ? a[0] : this.doctype, c = a.length >= 2 ? a[1] : void 0, f = a.slice(2).join(".") || a[a.length - 1], l = r === void 0 && o !== void 0 ? "delete" : "set";
        s.addOperation(
          {
            type: l,
            path: i,
            fieldname: f,
            beforeValue: o,
            afterValue: r,
            doctype: u,
            recordId: c,
            reversible: true
            // Default to reversible, can be changed by field triggers
          },
          n
        );
      }
    }
    this.updateValue(t, r), this.triggerFieldActions(i, o, r);
  }
  has(t) {
    try {
      if (t === "")
        return true;
      const r = this.parsePath(t);
      let n = this.target;
      for (let i = 0; i < r.length; i++) {
        const o = r[i];
        if (n == null)
          return false;
        if (i === r.length - 1)
          return this.isImmutable(n) ? n.has(o) : this.isPiniaStore(n) && n.$state && o in n.$state || o in n;
        n = this.getProperty(n, o);
      }
      return false;
    } catch {
      return false;
    }
  }
  // Tree navigation methods
  getAncestor() {
    if (!this.ancestorPath) return null;
    const r = this.ancestorPath.split(".").slice(0, -1).join(".");
    return r === "" ? this.rootNode : this.rootNode.getNode(r);
  }
  getRoot() {
    return this.rootNode;
  }
  getPath() {
    return this.ancestorPath;
  }
  getDepth() {
    return this.ancestorPath ? this.ancestorPath.split(".").length : 0;
  }
  getBreadcrumbs() {
    return this.ancestorPath ? this.ancestorPath.split(".") : [];
  }
  /**
   * Trigger an XState transition with optional context data
   */
  async triggerTransition(t, r) {
    const n = bt(), i = this.ancestorPath.split(".");
    let o = this.doctype, s;
    this.doctype === "StonecropStore" && i.length >= 1 && (o = i[0]), i.length >= 2 && (s = i[1]);
    const a = {
      path: this.ancestorPath,
      fieldname: "",
      // No specific field for transitions
      beforeValue: void 0,
      afterValue: void 0,
      operation: "set",
      doctype: o,
      recordId: s,
      timestamp: /* @__PURE__ */ new Date(),
      store: this.rootNode || void 0,
      transition: t,
      currentState: r?.currentState,
      targetState: r?.targetState,
      fsmContext: r?.fsmContext
    }, u = tn();
    return u && typeof u.addOperation == "function" && u.addOperation(
      {
        type: "transition",
        path: this.ancestorPath,
        fieldname: t,
        beforeValue: r?.currentState,
        afterValue: r?.targetState,
        doctype: o,
        recordId: s,
        reversible: false,
        // FSM transitions are generally not reversible
        metadata: {
          transition: t,
          currentState: r?.currentState,
          targetState: r?.targetState,
          fsmContext: r?.fsmContext
        }
      },
      "user"
    ), await n.executeTransitionActions(a);
  }
  // Private helper methods
  resolvePath(t) {
    return t === "" ? this.ancestorPath ?? "" : this.ancestorPath ? `${this.ancestorPath}.${t}` : t;
  }
  resolveValue(t) {
    if (t === "")
      return this.target;
    const r = this.parsePath(t);
    let n = this.target;
    for (const i of r) {
      if (n == null)
        return;
      n = this.getProperty(n, i);
    }
    return n;
  }
  updateValue(t, r) {
    if (t === "")
      throw new Error("Cannot set value on empty path");
    const n = this.parsePath(t), i = n.pop();
    let o = this.target;
    for (const s of n)
      if (o = this.getProperty(o, s), o == null)
        throw new Error(`Cannot set property on null/undefined path: ${t}`);
    this.setProperty(o, i, r);
  }
  getProperty(t, r) {
    return this.isImmutable(t) ? t.get(r) : this.isVueReactive(t) ? t[r] : this.isPiniaStore(t) ? t.$state?.[r] ?? t[r] : t[r];
  }
  setProperty(t, r, n) {
    if (this.isImmutable(t))
      throw new Error("Cannot directly mutate immutable objects. Use immutable update methods instead.");
    if (this.isPiniaStore(t)) {
      t.$patch ? t.$patch({ [r]: n }) : t[r] = n;
      return;
    }
    t[r] = n;
  }
  async triggerFieldActions(t, r, n) {
    try {
      if (!t || typeof t != "string" || Object.is(r, n))
        return;
      const i = t.split(".");
      if (i.length < 3)
        return;
      const o = bt(), s = i.slice(2).join(".") || i[i.length - 1];
      let a = this.doctype;
      this.doctype === "StonecropStore" && i.length >= 1 && (a = i[0]);
      let u;
      i.length >= 2 && (u = i[1]);
      const c = {
        path: t,
        fieldname: s,
        beforeValue: r,
        afterValue: n,
        operation: "set",
        doctype: a,
        recordId: u,
        timestamp: /* @__PURE__ */ new Date(),
        store: this.rootNode || void 0
        // Pass the root store for snapshot/rollback capabilities
      };
      await o.executeFieldTriggers(c);
    } catch (i) {
      i instanceof Error && console.warn("Field trigger error:", i.message);
    }
  }
  isVueReactive(t) {
    return t && typeof t == "object" && "__v_isReactive" in t && t.__v_isReactive === true;
  }
  isPiniaStore(t) {
    return t && typeof t == "object" && ("$state" in t || "$patch" in t || "$id" in t);
  }
  isImmutable(t) {
    if (!t || typeof t != "object")
      return false;
    const r = "get" in t && typeof t.get == "function", n = "set" in t && typeof t.set == "function", i = "has" in t && typeof t.has == "function", o = "__ownerID" in t || "_map" in t || "_list" in t || "_origin" in t || "_capacity" in t || "_defaultValues" in t || "_tail" in t || "_root" in t || "size" in t && r && n;
    let s;
    try {
      const u = t;
      if ("constructor" in u && u.constructor && typeof u.constructor == "object" && "name" in u.constructor) {
        const c = u.constructor.name;
        s = typeof c == "string" ? c : void 0;
      }
    } catch {
      s = void 0;
    }
    const a = s && (s.includes("Map") || s.includes("List") || s.includes("Set") || s.includes("Stack") || s.includes("Seq")) && (r || n);
    return !!(r && n && i && o || r && n && a);
  }
  isPrimitive(t) {
    return t == null || typeof t == "string" || typeof t == "number" || typeof t == "boolean" || typeof t == "function" || typeof t == "symbol" || typeof t == "bigint";
  }
  /**
   * Parse a path string into segments, handling both dot notation and array bracket notation
   * @param path - The path string to parse (e.g., "order.456.line_items[0].product")
   * @returns Array of path segments (e.g., ['order', '456', 'line_items', '0', 'product'])
   */
  parsePath(t) {
    return t ? t.replace(/\[(\d+)\]/g, ".$1").split(".").filter((n) => n.length > 0) : [];
  }
}
function ro(e, t) {
  return new Ue(e, t, "", null);
}
class At {
  /**
   * Singleton instance of Stonecrop. Only one Stonecrop instance can exist
   * per application, ensuring consistent HST state and registry access.
   * Subsequent constructor calls return this instance instead of creating new ones.
   * @internal
   */
  static _root;
  /** The HST store instance for reactive state management */
  hstStore;
  _operationLogStore;
  _operationLogConfig;
  _client;
  /** The registry instance containing all doctype definitions */
  registry;
  /**
   * Creates a new Stonecrop instance with HST integration (singleton pattern)
   * @param registry - The Registry instance containing doctype definitions
   * @param operationLogConfig - Optional configuration for the operation log
   * @param options - Options including the data client (can be set later via setClient)
   */
  constructor(t, r, n) {
    if (At._root)
      return At._root;
    At._root = this, this.registry = t, this._operationLogConfig = r, this._client = n?.client, this.initializeHSTStore(), this.setupRegistrySync();
  }
  /**
   * Set the data client for fetching doctype metadata and records.
   * Use this for deferred configuration in Nuxt/Vue plugin setups.
   *
   * @param client - DataClient implementation (e.g., StonecropClient from \@stonecrop/graphql-client)
   *
   * @example
   * ```ts
   * const { setClient } = useStonecropRegistry()
   * const client = new StonecropClient({ endpoint: '/graphql' })
   * setClient(client)
   * ```
   */
  setClient(t) {
    this._client = t;
  }
  /**
   * Get the current data client
   * @returns The DataClient instance or undefined if not set
   */
  getClient() {
    return this._client;
  }
  /**
   * Get the operation log store (lazy initialization)
   * @internal
   */
  getOperationLogStore() {
    return this._operationLogStore || (this._operationLogStore = Ie(), this._operationLogConfig && this._operationLogStore.configure(this._operationLogConfig)), this._operationLogStore;
  }
  /**
   * Initialize the HST store structure
   */
  initializeHSTStore() {
    const t = {};
    Object.keys(this.registry.registry).forEach((r) => {
      t[r] = {};
    }), this.hstStore = ro(reactive(t), "StonecropStore");
  }
  /**
   * Setup automatic sync with Registry when doctypes are added
   */
  setupRegistrySync() {
    const t = this.registry.addDoctype.bind(this.registry);
    this.registry.addDoctype = (r) => {
      t(r), this.hstStore.has(r.slug) || this.hstStore.set(r.slug, {});
    };
  }
  /**
   * Get records hash for a doctype
   * @param doctype - The doctype to get records for
   * @returns HST node containing records hash
   */
  records(t) {
    const r = typeof t == "string" ? t : t.slug;
    return this.ensureDoctypeExists(r), this.hstStore.getNode(r);
  }
  /**
   * Add a record to the store
   * @param doctype - The doctype
   * @param recordId - The record ID
   * @param recordData - The record data
   */
  addRecord(t, r, n) {
    const i = typeof t == "string" ? t : t.slug;
    this.ensureDoctypeExists(i), this.hstStore.set(`${i}.${r}`, n);
  }
  /**
   * Get a specific record
   * @param doctype - The doctype
   * @param recordId - The record ID
   * @returns HST node for the record or undefined
   */
  getRecordById(t, r) {
    const n = typeof t == "string" ? t : t.slug;
    if (this.ensureDoctypeExists(n), !(!this.hstStore.has(`${n}.${r}`) || this.hstStore.get(`${n}.${r}`) === void 0))
      return this.hstStore.getNode(`${n}.${r}`);
  }
  /**
   * Remove a record from the store
   * @param doctype - The doctype
   * @param recordId - The record ID
   */
  removeRecord(t, r) {
    const n = typeof t == "string" ? t : t.slug;
    this.ensureDoctypeExists(n), this.hstStore.has(`${n}.${r}`) && this.hstStore.set(`${n}.${r}`, void 0);
  }
  /**
   * Get all record IDs for a doctype
   * @param doctype - The doctype
   * @returns Array of record IDs
   */
  getRecordIds(t) {
    const r = typeof t == "string" ? t : t.slug;
    this.ensureDoctypeExists(r);
    const n = this.hstStore.get(r);
    return !n || typeof n != "object" ? [] : Object.keys(n).filter((i) => n[i] !== void 0);
  }
  /**
   * Clear all records for a doctype
   * @param doctype - The doctype
   */
  clearRecords(t) {
    const r = typeof t == "string" ? t : t.slug;
    this.ensureDoctypeExists(r), this.getRecordIds(r).forEach((i) => {
      this.hstStore.set(`${r}.${i}`, void 0);
    });
  }
  /**
   * Setup method for doctype initialization
   * @param doctype - The doctype to setup
   */
  setup(t) {
    this.ensureDoctypeExists(t.slug);
  }
  /**
   * Run action on doctype
   * Executes the action and logs it to the operation log for audit tracking
   * @param doctype - The doctype
   * @param action - The action to run
   * @param args - Action arguments (typically record IDs)
   */
  runAction(t, r, n) {
    const o = this.registry.registry[t.slug]?.actions?.get(r), s = Array.isArray(n) ? n.filter((l) => typeof l == "string") : void 0, a = s?.[0], u = a ? this.isWorkflowReady(t, a) : { ready: true };
    if (!u.ready)
      throw this.getOperationLogStore().logAction(
        t.doctype,
        r,
        s,
        "failure",
        `BLOCKED: missing data for links: ${u.blockedLinks?.join(", ")}`
      ), new Error(`Workflow blocked: missing data for links: ${u.blockedLinks?.join(", ")}`);
    const c = this.getOperationLogStore();
    let f = "success", h;
    try {
      if (o && o.length > 0) {
        const l = bt();
        o.forEach((g) => {
          try {
            const p = l.getAction(g);
            if (!p) throw new Error(`Action "${g}" is not registered in FieldTriggerEngine`);
            const d = {
              path: `${t.slug}.${s?.[0] ?? ""}`,
              fieldname: r,
              beforeValue: void 0,
              afterValue: n,
              operation: "set",
              doctype: t.doctype,
              recordId: a,
              timestamp: /* @__PURE__ */ new Date()
            };
            p(d);
          } catch (p) {
            throw f = "failure", h = p instanceof Error ? p.message : "Unknown error", p;
          }
        });
      }
    } catch {
    } finally {
      c.logAction(t.doctype, r, s, f, h);
    }
  }
  /**
   * Get the effective blockWorkflows value for a link.
   * Returns true if blockWorkflows is explicitly true, or if it's absent and fetch method is 'sync'.
   * @param link - The link declaration
   * @returns Whether workflows should be blocked until this link is loaded
   */
  getEffectiveBlockWorkflows(t) {
    return t.blockWorkflows !== void 0 ? t.blockWorkflows : t.fetch?.method === "sync";
  }
  /**
   * Check if workflow actions are ready to run (all required link data is loaded).
   * A link's data is considered loaded if it exists in HST at `slug.recordId.linkname`.
   * @param doctype - The doctype to check
   * @param recordId - The record ID
   * @returns Object with `ready: true` if all blocked links are loaded, or `ready: false` with `blockedLinks` array
   */
  isWorkflowReady(t, r) {
    if (r === "new")
      return { ready: true };
    const n = this.registry.getDescendantLinks(t.slug), i = [];
    for (const o of n)
      if (this.getEffectiveBlockWorkflows(o)) {
        const s = `${t.slug}.${r}.${o.fieldname}`;
        this.hstStore.has(s) || i.push(o.fieldname);
      }
    return i.length > 0 ? { ready: false, blockedLinks: i } : { ready: true };
  }
  /**
   * Get records from server using the configured data client.
   * @param doctype - The doctype
   * @throws Error if no data client has been configured
   */
  async getRecords(t) {
    if (!this._client)
      throw new Error(
        "No data client configured. Call setClient() with a DataClient implementation (e.g., StonecropClient from @stonecrop/graphql-client) before fetching records."
      );
    (await this._client.getRecords(t)).forEach((n) => {
      n.id && this.addRecord(t, n.id, n);
    });
  }
  /**
   * Get single record from server using the configured data client.
   * @param doctype - The doctype slug string or Doctype object
   * @param recordId - The record ID
   * @throws Error if no data client has been configured
   * @throws Error if a slug string is given and no matching doctype is found in the registry
   */
  async getRecord(t, r) {
    if (!this._client)
      throw new Error(
        "No data client configured. Call setClient() with a DataClient implementation (e.g., StonecropClient from @stonecrop/graphql-client) before fetching records."
      );
    const n = typeof t == "string" ? this.registry.getDoctype(t) : t;
    if (!n)
      throw new Error(`Doctype not found: ${typeof t == "string" ? t : t.slug}`);
    const i = await this._client.getRecord(n, r);
    i?.record && this.addRecord(n, r, i.record);
  }
  /**
   * Dispatch an action to the server via the configured data client.
   * All state changes flow through this single mutation endpoint.
   *
   * @param doctype - The doctype
   * @param action - Action name to execute (e.g., 'SUBMIT', 'APPROVE', 'save')
   * @param args - Action arguments (typically record ID and/or form data)
   * @returns Action result with success status, response data, and any error
   * @throws Error if no data client has been configured
   */
  async dispatchAction(t, r, n) {
    if (!this._client)
      throw new Error(
        "No data client configured. Call setClient() with a DataClient implementation (e.g., StonecropClient from @stonecrop/graphql-client) before dispatching actions."
      );
    return this._client.runAction(t, r, n);
  }
  /**
   * Ensure doctype section exists in HST store
   * @param slug - The doctype slug
   */
  ensureDoctypeExists(t) {
    this.hstStore.has(t) || this.hstStore.set(t, {});
  }
  /**
   * Get doctype metadata from the registry
   * @param context - The route context
   * @returns The doctype metadata
   */
  async getMeta(t) {
    if (!this.registry.getMeta)
      throw new Error("No getMeta function provided to Registry");
    return await this.registry.getMeta(t);
  }
  /**
   * Get the root HST store node for advanced usage
   * @returns Root HST node
   */
  getStore() {
    return this.hstStore;
  }
  /**
   * Determine the current workflow state for a record.
   *
   * Reads the record's `status` field from the HST store. If the field is absent or
   * empty the doctype's declared `workflow.initial` state is used as the fallback,
   * giving callers a reliable state name without having to duplicate that logic.
   *
   * @param doctype - The doctype slug or Doctype instance
   * @param recordId - The record identifier
   * @returns The current state name, or an empty string if the doctype has no workflow
   *
   * @public
   */
  getRecordState(t, r) {
    const n = typeof t == "string" ? t : t.slug, i = this.registry.getDoctype(n);
    if (!i?.workflow) return "";
    const s = this.getRecordById(n, r)?.get("status"), a = i.workflow;
    let u;
    return Array.isArray(a.states) ? u = a.states[0] ?? "" : u = typeof a.initial == "string" ? a.initial : Object.keys(a.states ?? {})[0] ?? "", s || u;
  }
  /**
   * Collect a record payload with all nested doctype fields from HST
   * @param doctype - The doctype metadata
   * @param recordId - The record ID to collect
   * @returns The complete record payload ready for API submission
   * @public
   */
  collectRecordPayload(t, r) {
    const n = `${t.slug}.${r}`, o = { ...this.hstStore.get(n) || {} };
    if (t.links)
      for (const [s, a] of Object.entries(t.links)) {
        const u = `${n}.${s}`;
        if (a.cardinality === "noneOrMany" || a.cardinality === "atLeastOne") {
          const f = this.hstStore.get(u);
          Array.isArray(f) && (o[s] = f);
        } else {
          const f = this.registry.getDoctype(a.target);
          f?.links ? o[s] = this.collectNestedData(u, f) : o[s] = this.hstStore.get(u) || {};
        }
      }
    return o;
  }
  /**
   * Scaffold empty descendant records from defaults for all descendant links.
   *
   * Initializes all scalar and link fields at their HST paths with default values.
   * For new records, call this after setting up the doctype to ensure all paths exist.
   *
   * @param path - HST path (e.g., "customer.new")
   * @param doctype - The doctype to initialize
   * @public
   */
  initializeNestedData(t, r) {
    const n = r.slug;
    this.ensureDoctypeExists(n);
    const i = this.registry.resolveSchema(r), o = this.registry.initializeRecord(i);
    this.hstStore.get(t) || this.hstStore.set(t, {}, "system");
    for (const [a, u] of Object.entries(o))
      this.hstStore.set(`${t}.${a}`, u, "system");
  }
  /**
   * Fetch a record and its nested data from the server.
   *
   * Calls `_client.getRecord()` with nested sub-selections and stores each scalar field at its own HST path
   * (`slug.recordId.fieldname`), descendants at the link-level path (`slug.recordId.linkname`).
   *
   * @param path - HST path (e.g., "recipe.r1")
   * @param doctype - The doctype to fetch
   * @param recordId - Record ID to fetch
   * @param options - Query options (includeNested to control which links are fetched)
   * @throws Error with code `"CLIENT_REQUIRED"` if no data client is configured
   * @throws Error with code `"RECORD_NOT_FOUND"` if the server returns null
   * @public
   */
  async fetchNestedData(t, r, n, i) {
    if (!this._client)
      throw en(
        "No data client configured. Call setClient() with a DataClient implementation (e.g., StonecropClient from @stonecrop/graphql-client) before fetching records.",
        "CLIENT_REQUIRED"
      );
    const o = await this._client.getRecord({ name: r.doctype }, n, {
      includeNested: i?.includeNested ?? true
    });
    if (!o?.record)
      throw en(`Record not found: ${r.doctype} ${n}`, "RECORD_NOT_FOUND");
    const s = r.slug;
    this.ensureDoctypeExists(s), this.hstStore.get(`${s}.${n}`) || this.hstStore.set(`${s}.${n}`, {}, "system");
    for (const [u, c] of Object.entries(o.record))
      this.hstStore.set(`${s}.${n}.${u}`, c, "system");
  }
  /**
   * Recursively collect nested data from HST
   * @param basePath - The base path in HST (e.g., "customer.123.address")
   * @param doctype - The doctype whose links drive the recursive traversal
   * @returns The collected data object
   */
  collectNestedData(t, r) {
    const i = { ...this.hstStore.get(t) || {} };
    if (!r.links) return i;
    for (const [o, s] of Object.entries(r.links)) {
      const a = `${t}.${o}`;
      if (s.cardinality === "noneOrMany" || s.cardinality === "atLeastOne") {
        const c = this.hstStore.get(a);
        Array.isArray(c) && (i[o] = c);
      } else {
        const c = this.registry.getDoctype(s.target);
        c?.links ? i[o] = this.collectNestedData(a, c) : i[o] = this.hstStore.get(a) || {};
      }
    }
    return i;
  }
}
function en(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var We = "@@__IMMUTABLE_INDEXED__@@";
function pt(e) {
  return !!(e && // @ts-expect-error: maybeIndexed is typed as `{}`, need to change in 6.0 to `maybeIndexed && typeof maybeIndexed === 'object' && IS_INDEXED_SYMBOL in maybeIndexed`
  e[We]);
}
var Ke = "@@__IMMUTABLE_KEYED__@@";
function N(e) {
  return !!(e && // @ts-expect-error: maybeKeyed is typed as `{}`, need to change in 6.0 to `maybeKeyed && typeof maybeKeyed === 'object' && IS_KEYED_SYMBOL in maybeKeyed`
  e[Ke]);
}
function Or(e) {
  return N(e) || pt(e);
}
var Cn = "@@__IMMUTABLE_ITERABLE__@@";
function ct(e) {
  return !!(e && // @ts-expect-error: maybeCollection is typed as `{}`, need to change in 6.0 to `maybeCollection && typeof maybeCollection === 'object' && IS_COLLECTION_SYMBOL in maybeCollection`
  e[Cn]);
}
var Z = function(t) {
  return ct(t) ? t : nt(t);
}, dt = /* @__PURE__ */ (function(e) {
  function t(r) {
    return N(r) ? r : Dt(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
})(Z), Pt = /* @__PURE__ */ (function(e) {
  function t(r) {
    return pt(r) ? r : gt(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
})(Z), ee = /* @__PURE__ */ (function(e) {
  function t(r) {
    return ct(r) && !Or(r) ? r : ie(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
})(Z);
Z.Keyed = dt;
Z.Indexed = Pt;
Z.Set = ee;
var re = 0, ft = 1, ht = 2, pr = typeof Symbol == "function" && Symbol.iterator, qn = "@@iterator", Ye = pr || qn, M = function(t) {
  this.next = t;
};
M.prototype.toString = function() {
  return "[Iterator]";
};
M.KEYS = re;
M.VALUES = ft;
M.ENTRIES = ht;
M.prototype.inspect = M.prototype.toSource = function() {
  return this.toString();
};
M.prototype[Ye] = function() {
  return this;
};
function P(e, t, r, n) {
  var i = e === re ? t : e === ft ? r : [t, r];
  return n ? n.value = i : n = {
    // @ts-expect-error ensure value is not undefined
    value: i,
    done: false
  }, n;
}
function et() {
  return { value: void 0, done: true };
}
function Nn(e) {
  return Array.isArray(e) ? true : !!Je(e);
}
function rn(e) {
  return !!(e && // @ts-expect-error: maybeIterator is typed as `{}`
  typeof e.next == "function");
}
function dr(e) {
  var t = Je(e);
  return t && t.call(e);
}
function Je(e) {
  var t = e && // @ts-expect-error: maybeIterator is typed as `{}`
  (pr && e[pr] || // @ts-expect-error: maybeIterator is typed as `{}`
  e[qn]);
  if (typeof t == "function")
    return t;
}
function io(e) {
  var t = Je(e);
  return t && t === e.entries;
}
function oo(e) {
  var t = Je(e);
  return t && t === e.keys;
}
var Ae = "delete", T = 5, at = 1 << T, tt = at - 1, A = {};
function gr() {
  return { value: false };
}
function lt(e) {
  e && (e.value = true);
}
function Er() {
}
function Ht(e) {
  return e.size === void 0 && (e.size = e.__iterate(Pn)), e.size;
}
function $t(e, t) {
  if (typeof t != "number") {
    var r = t >>> 0;
    if ("" + r !== t || r === 4294967295)
      return NaN;
    t = r;
  }
  return t < 0 ? Ht(e) + t : t;
}
function Pn() {
  return true;
}
function Ge(e, t, r) {
  return (e === 0 && !jn(e) || r !== void 0 && e <= -r) && (t === void 0 || r !== void 0 && t >= r);
}
function ke(e, t) {
  return Fn(e, t, 0);
}
function Ze(e, t) {
  return Fn(e, t, t);
}
function Fn(e, t, r) {
  return e === void 0 ? r : jn(e) ? t === 1 / 0 ? t : Math.max(0, t + e) | 0 : t === void 0 || t === e ? e : Math.min(t, e) | 0;
}
function jn(e) {
  return e < 0 || e === 0 && 1 / e === -1 / 0;
}
var Bn = "@@__IMMUTABLE_RECORD__@@";
function Ft(e) {
  return !!(e && // @ts-expect-error: maybeRecord is typed as `{}`, need to change in 6.0 to `maybeRecord && typeof maybeRecord === 'object' && IS_RECORD_SYMBOL in maybeRecord`
  e[Bn]);
}
function mt(e) {
  return ct(e) || Ft(e);
}
var zt = "@@__IMMUTABLE_ORDERED__@@";
function yt(e) {
  return !!(e && // @ts-expect-error: maybeOrdered is typed as `{}`, need to change in 6.0 to `maybeOrdered && typeof maybeOrdered === 'object' && IS_ORDERED_SYMBOL in maybeOrdered`
  e[zt]);
}
var xn = "@@__IMMUTABLE_SEQ__@@";
function Rr(e) {
  return !!(e && // @ts-expect-error: maybeSeq is typed as `{}`, need to change in 6.0 to `maybeSeq && typeof maybeSeq === 'object' && MAYBE_SEQ_SYMBOL in maybeSeq`
  e[xn]);
}
var ne = Object.prototype.hasOwnProperty;
function Un(e) {
  return Array.isArray(e) || typeof e == "string" ? true : e && typeof e == "object" && // @ts-expect-error check that `'length' in value &&`
  Number.isInteger(e.length) && // @ts-expect-error check that `'length' in value &&`
  e.length >= 0 && // @ts-expect-error check that `'length' in value &&`
  (e.length === 0 ? (
    // Only {length: 0} is considered Array-like.
    Object.keys(e).length === 1
  ) : (
    // An object is only Array-like if it has a property where the last value
    // in the array-like may be found (which could be undefined).
    // @ts-expect-error check that `'length' in value &&`
    e.hasOwnProperty(e.length - 1)
  ));
}
var nt = /* @__PURE__ */ (function(e) {
  function t(r) {
    return r == null ? Ar() : mt(r) ? r.toSeq() : ao(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toSeq = function() {
    return this;
  }, t.prototype.toString = function() {
    return this.__toString("Seq {", "}");
  }, t.prototype.cacheResult = function() {
    return !this._cache && this.__iterateUncached && (this._cache = this.entrySeq().toArray(), this.size = this._cache.length), this;
  }, t.prototype.__iterate = function(n, i) {
    var o = this._cache;
    if (o) {
      for (var s = o.length, a = 0; a !== s; ) {
        var u = o[i ? s - ++a : a++];
        if (n(u[1], u[0], this) === false)
          break;
      }
      return a;
    }
    return this.__iterateUncached(n, i);
  }, t.prototype.__iterator = function(n, i) {
    var o = this._cache;
    if (o) {
      var s = o.length, a = 0;
      return new M(function() {
        if (a === s)
          return et();
        var u = o[i ? s - ++a : a++];
        return P(n, u[0], u[1]);
      });
    }
    return this.__iteratorUncached(n, i);
  }, t;
})(Z), Dt = /* @__PURE__ */ (function(e) {
  function t(r) {
    return r == null ? Ar().toKeyedSeq() : ct(r) ? N(r) ? r.toSeq() : r.fromEntrySeq() : Ft(r) ? r.toSeq() : kr(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toKeyedSeq = function() {
    return this;
  }, t;
})(nt), gt = /* @__PURE__ */ (function(e) {
  function t(r) {
    return r == null ? Ar() : ct(r) ? N(r) ? r.entrySeq() : r.toIndexedSeq() : Ft(r) ? r.toSeq().entrySeq() : Wn(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return t(arguments);
  }, t.prototype.toIndexedSeq = function() {
    return this;
  }, t.prototype.toString = function() {
    return this.__toString("Seq [", "]");
  }, t;
})(nt), ie = /* @__PURE__ */ (function(e) {
  function t(r) {
    return (ct(r) && !Or(r) ? r : gt(r)).toSetSeq();
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return t(arguments);
  }, t.prototype.toSetSeq = function() {
    return this;
  }, t;
})(nt);
nt.isSeq = Rr;
nt.Keyed = Dt;
nt.Set = ie;
nt.Indexed = gt;
nt.prototype[xn] = true;
var Vt = /* @__PURE__ */ (function(e) {
  function t(r) {
    this._array = r, this.size = r.length;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(n, i) {
    return this.has(n) ? this._array[$t(this, n)] : i;
  }, t.prototype.__iterate = function(n, i) {
    for (var o = this._array, s = o.length, a = 0; a !== s; ) {
      var u = i ? s - ++a : a++;
      if (n(o[u], u, this) === false)
        break;
    }
    return a;
  }, t.prototype.__iterator = function(n, i) {
    var o = this._array, s = o.length, a = 0;
    return new M(function() {
      if (a === s)
        return et();
      var u = i ? s - ++a : a++;
      return P(n, u, o[u]);
    });
  }, t;
})(gt), Ir = /* @__PURE__ */ (function(e) {
  function t(r) {
    var n = Object.keys(r).concat(
      Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(r) : []
    );
    this._object = r, this._keys = n, this.size = n.length;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(n, i) {
    return i !== void 0 && !this.has(n) ? i : this._object[n];
  }, t.prototype.has = function(n) {
    return ne.call(this._object, n);
  }, t.prototype.__iterate = function(n, i) {
    for (var o = this._object, s = this._keys, a = s.length, u = 0; u !== a; ) {
      var c = s[i ? a - ++u : u++];
      if (n(o[c], c, this) === false)
        break;
    }
    return u;
  }, t.prototype.__iterator = function(n, i) {
    var o = this._object, s = this._keys, a = s.length, u = 0;
    return new M(function() {
      if (u === a)
        return et();
      var c = s[i ? a - ++u : u++];
      return P(n, c, o[c]);
    });
  }, t;
})(Dt);
Ir.prototype[zt] = true;
var so = /* @__PURE__ */ (function(e) {
  function t(r) {
    this._collection = r, this.size = r.length || r.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.__iterateUncached = function(n, i) {
    if (i)
      return this.cacheResult().__iterate(n, i);
    var o = this._collection, s = dr(o), a = 0;
    if (rn(s))
      for (var u; !(u = s.next()).done && n(u.value, a++, this) !== false; )
        ;
    return a;
  }, t.prototype.__iteratorUncached = function(n, i) {
    if (i)
      return this.cacheResult().__iterator(n, i);
    var o = this._collection, s = dr(o);
    if (!rn(s))
      return new M(et);
    var a = 0;
    return new M(function() {
      var u = s.next();
      return u.done ? u : P(n, a++, u.value);
    });
  }, t;
})(gt), nn;
function Ar() {
  return nn || (nn = new Vt([]));
}
function kr(e) {
  var t = Mr(e);
  if (t)
    return t.fromEntrySeq();
  if (typeof e == "object")
    return new Ir(e);
  throw new TypeError(
    "Expected Array or collection object of [k, v] entries, or keyed object: " + e
  );
}
function Wn(e) {
  var t = Mr(e);
  if (t)
    return t;
  throw new TypeError(
    "Expected Array or collection object of values: " + e
  );
}
function ao(e) {
  var t = Mr(e);
  if (t)
    return io(e) ? t.fromEntrySeq() : oo(e) ? t.toSetSeq() : t;
  if (typeof e == "object")
    return new Ir(e);
  throw new TypeError(
    "Expected Array or collection object of values, or keyed object: " + e
  );
}
function Mr(e) {
  return Un(e) ? new Vt(e) : Nn(e) ? new so(e) : void 0;
}
function Me() {
  return this.__ensureOwner();
}
function $e() {
  return this.__ownerID ? this : this.__ensureOwner(new Er());
}
var le = typeof Math.imul == "function" && Math.imul(4294967295, 2) === -2 ? Math.imul : function(t, r) {
  t |= 0, r |= 0;
  var n = t & 65535, i = r & 65535;
  return n * i + ((t >>> 16) * i + n * (r >>> 16) << 16 >>> 0) | 0;
};
function Xe(e) {
  return e >>> 1 & 1073741824 | e & 3221225471;
}
var uo = Object.prototype.valueOf;
function ot(e) {
  if (e == null)
    return on(e);
  if (typeof e.hashCode == "function")
    return Xe(e.hashCode(e));
  var t = go(e);
  if (t == null)
    return on(t);
  switch (typeof t) {
    case "boolean":
      return t ? 1108378657 : 1108378656;
    case "number":
      return co(t);
    case "string":
      return t.length > _o ? fo(t) : _r(t);
    case "object":
    case "function":
      return lo(t);
    case "symbol":
      return ho(t);
    default:
      if (typeof t.toString == "function")
        return _r(t.toString());
      throw new Error("Value type " + typeof t + " cannot be hashed.");
  }
}
function on(e) {
  return e === null ? 1108378658 : (
    /* undefined */
    1108378659
  );
}
function co(e) {
  if (e !== e || e === 1 / 0)
    return 0;
  var t = e | 0;
  for (t !== e && (t ^= e * 4294967295); e > 4294967295; )
    e /= 4294967295, t ^= e;
  return Xe(t);
}
function fo(e) {
  var t = ur[e];
  return t === void 0 && (t = _r(e), ar === vo && (ar = 0, ur = {}), ar++, ur[e] = t), t;
}
function _r(e) {
  for (var t = 0, r = 0; r < e.length; r++)
    t = 31 * t + e.charCodeAt(r) | 0;
  return Xe(t);
}
function ho(e) {
  var t = un[e];
  return t !== void 0 || (t = Kn(), un[e] = t), t;
}
function lo(e) {
  var t;
  if (vr && (t = yr.get(e), t !== void 0) || (t = e[qt], t !== void 0) || !an && (t = e.propertyIsEnumerable && e.propertyIsEnumerable[qt], t !== void 0 || (t = po(e), t !== void 0)))
    return t;
  if (t = Kn(), vr)
    yr.set(e, t);
  else {
    if (sn !== void 0 && sn(e) === false)
      throw new Error("Non-extensible objects are not allowed as keys.");
    if (an)
      Object.defineProperty(e, qt, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: t
      });
    else if (e.propertyIsEnumerable !== void 0 && e.propertyIsEnumerable === e.constructor.prototype.propertyIsEnumerable)
      e.propertyIsEnumerable = function() {
        return this.constructor.prototype.propertyIsEnumerable.apply(
          this,
          // eslint-disable-next-line prefer-rest-params
          arguments
        );
      }, e.propertyIsEnumerable[qt] = t;
    else if (e.nodeType !== void 0)
      e[qt] = t;
    else
      throw new Error("Unable to set a non-enumerable property on object.");
  }
  return t;
}
var sn = Object.isExtensible, an = (function() {
  try {
    return Object.defineProperty({}, "@", {}), true;
  } catch {
    return false;
  }
})();
function po(e) {
  if (e && e.nodeType > 0)
    switch (e.nodeType) {
      case 1:
        return e.uniqueID;
      case 9:
        return e.documentElement && e.documentElement.uniqueID;
    }
}
function go(e) {
  return e.valueOf !== uo && typeof e.valueOf == "function" ? (
    // @ts-expect-error weird the "obj" parameter as `valueOf` should not have a parameter
    e.valueOf(e)
  ) : e;
}
function Kn() {
  var e = ++sr;
  return sr & 1073741824 && (sr = 0), e;
}
var vr = typeof WeakMap == "function", yr;
vr && (yr = /* @__PURE__ */ new WeakMap());
var un = /* @__PURE__ */ Object.create(null), sr = 0, qt = "__immutablehash__";
typeof Symbol == "function" && (qt = Symbol(qt));
var _o = 16, vo = 255, ar = 0, ur = {}, Qe = /* @__PURE__ */ (function(e) {
  function t(r, n) {
    this._iter = r, this._useKeys = n, this.size = r.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(n, i) {
    return this._iter.get(n, i);
  }, t.prototype.has = function(n) {
    return this._iter.has(n);
  }, t.prototype.valueSeq = function() {
    return this._iter.valueSeq();
  }, t.prototype.reverse = function() {
    var n = this, i = $r(this, true);
    return this._useKeys || (i.valueSeq = function() {
      return n._iter.toSeq().reverse();
    }), i;
  }, t.prototype.map = function(n, i) {
    var o = this, s = Gn(this, n, i);
    return this._useKeys || (s.valueSeq = function() {
      return o._iter.toSeq().map(n, i);
    }), s;
  }, t.prototype.__iterate = function(n, i) {
    var o = this;
    return this._iter.__iterate(function(s, a) {
      return n(s, a, o);
    }, i);
  }, t.prototype.__iterator = function(n, i) {
    return this._iter.__iterator(n, i);
  }, t;
})(Dt);
Qe.prototype[zt] = true;
var Hn = /* @__PURE__ */ (function(e) {
  function t(r) {
    this._iter = r, this.size = r.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.includes = function(n) {
    return this._iter.includes(n);
  }, t.prototype.__iterate = function(n, i) {
    var o = this, s = 0;
    return i && Ht(this), this._iter.__iterate(
      function(a) {
        return n(a, i ? o.size - ++s : s++, o);
      },
      i
    );
  }, t.prototype.__iterator = function(n, i) {
    var o = this, s = this._iter.__iterator(ft, i), a = 0;
    return i && Ht(this), new M(function() {
      var u = s.next();
      return u.done ? u : P(
        n,
        i ? o.size - ++a : a++,
        u.value,
        u
      );
    });
  }, t;
})(gt), Vn = /* @__PURE__ */ (function(e) {
  function t(r) {
    this._iter = r, this.size = r.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.has = function(n) {
    return this._iter.includes(n);
  }, t.prototype.__iterate = function(n, i) {
    var o = this;
    return this._iter.__iterate(function(s) {
      return n(s, s, o);
    }, i);
  }, t.prototype.__iterator = function(n, i) {
    var o = this._iter.__iterator(ft, i);
    return new M(function() {
      var s = o.next();
      return s.done ? s : P(n, s.value, s.value, s);
    });
  }, t;
})(ie), Yn = /* @__PURE__ */ (function(e) {
  function t(r) {
    this._iter = r, this.size = r.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.entrySeq = function() {
    return this._iter.toSeq();
  }, t.prototype.__iterate = function(n, i) {
    var o = this;
    return this._iter.__iterate(function(s) {
      if (s) {
        fn(s);
        var a = ct(s);
        return n(
          a ? s.get(1) : s[1],
          a ? s.get(0) : s[0],
          o
        );
      }
    }, i);
  }, t.prototype.__iterator = function(n, i) {
    var o = this._iter.__iterator(ft, i);
    return new M(function() {
      for (; ; ) {
        var s = o.next();
        if (s.done)
          return s;
        var a = s.value;
        if (a) {
          fn(a);
          var u = ct(a);
          return P(
            n,
            u ? a.get(0) : a[0],
            u ? a.get(1) : a[1],
            s
          );
        }
      }
    });
  }, t;
})(Dt);
Hn.prototype.cacheResult = Qe.prototype.cacheResult = Vn.prototype.cacheResult = Yn.prototype.cacheResult = Lr;
function Jn(e) {
  var t = St(e);
  return t._iter = e, t.size = e.size, t.flip = function() {
    return e;
  }, t.reverse = function() {
    var r = e.reverse.apply(this);
    return r.flip = function() {
      return e.reverse();
    }, r;
  }, t.has = function(r) {
    return e.includes(r);
  }, t.includes = function(r) {
    return e.has(r);
  }, t.cacheResult = Lr, t.__iterateUncached = function(r, n) {
    var i = this;
    return e.__iterate(function(o, s) {
      return r(s, o, i) !== false;
    }, n);
  }, t.__iteratorUncached = function(r, n) {
    if (r === ht) {
      var i = e.__iterator(r, n);
      return new M(function() {
        var o = i.next();
        if (!o.done) {
          var s = o.value[0];
          o.value[0] = o.value[1], o.value[1] = s;
        }
        return o;
      });
    }
    return e.__iterator(
      r === ft ? re : ft,
      n
    );
  }, t;
}
function Gn(e, t, r) {
  var n = St(e);
  return n.size = e.size, n.has = function(i) {
    return e.has(i);
  }, n.get = function(i, o) {
    var s = e.get(i, A);
    return s === A ? o : t.call(r, s, i, e);
  }, n.__iterateUncached = function(i, o) {
    var s = this;
    return e.__iterate(
      function(a, u, c) {
        return i(t.call(r, a, u, c), u, s) !== false;
      },
      o
    );
  }, n.__iteratorUncached = function(i, o) {
    var s = e.__iterator(ht, o);
    return new M(function() {
      var a = s.next();
      if (a.done)
        return a;
      var u = a.value, c = u[0];
      return P(
        i,
        c,
        t.call(r, u[1], c, e),
        a
      );
    });
  }, n;
}
function $r(e, t) {
  var r = this, n = St(e);
  return n._iter = e, n.size = e.size, n.reverse = function() {
    return e;
  }, e.flip && (n.flip = function() {
    var i = Jn(e);
    return i.reverse = function() {
      return e.flip();
    }, i;
  }), n.get = function(i, o) {
    return e.get(t ? i : -1 - i, o);
  }, n.has = function(i) {
    return e.has(t ? i : -1 - i);
  }, n.includes = function(i) {
    return e.includes(i);
  }, n.cacheResult = Lr, n.__iterate = function(i, o) {
    var s = this, a = 0;
    return o && Ht(e), e.__iterate(
      function(u, c) {
        return i(u, t ? c : o ? s.size - ++a : a++, s);
      },
      !o
    );
  }, n.__iterator = function(i, o) {
    var s = 0;
    o && Ht(e);
    var a = e.__iterator(ht, !o);
    return new M(function() {
      var u = a.next();
      if (u.done)
        return u;
      var c = u.value;
      return P(
        i,
        t ? c[0] : o ? r.size - ++s : s++,
        c[1],
        u
      );
    });
  }, n;
}
function Zn(e, t, r, n) {
  var i = St(e);
  return n && (i.has = function(o) {
    var s = e.get(o, A);
    return s !== A && !!t.call(r, s, o, e);
  }, i.get = function(o, s) {
    var a = e.get(o, A);
    return a !== A && t.call(r, a, o, e) ? a : s;
  }), i.__iterateUncached = function(o, s) {
    var a = this, u = 0;
    return e.__iterate(function(c, f, h) {
      if (t.call(r, c, f, h))
        return u++, o(c, n ? f : u - 1, a);
    }, s), u;
  }, i.__iteratorUncached = function(o, s) {
    var a = e.__iterator(ht, s), u = 0;
    return new M(function() {
      for (; ; ) {
        var c = a.next();
        if (c.done)
          return c;
        var f = c.value, h = f[0], l = f[1];
        if (t.call(r, l, h, e))
          return P(o, n ? h : u++, l, c);
      }
    });
  }, i;
}
function yo(e, t, r) {
  var n = Lt().asMutable();
  return e.__iterate(function(i, o) {
    n.update(t.call(r, i, o, e), 0, function(s) {
      return s + 1;
    });
  }), n.asImmutable();
}
function mo(e, t, r) {
  var n = N(e), i = (yt(e) ? Et() : Lt()).asMutable();
  e.__iterate(function(s, a) {
    i.update(
      t.call(r, s, a, e),
      function(u) {
        return u = u || [], u.push(n ? [a, s] : s), u;
      }
    );
  });
  var o = Tr(e);
  return i.map(function(s) {
    return z(e, o(s));
  }).asImmutable();
}
function So(e, t, r) {
  var n = N(e), i = [[], []];
  e.__iterate(function(s, a) {
    i[t.call(r, s, a, e) ? 1 : 0].push(
      n ? [a, s] : s
    );
  });
  var o = Tr(e);
  return i.map(function(s) {
    return z(e, o(s));
  });
}
function zr(e, t, r, n) {
  var i = e.size;
  if (Ge(t, r, i))
    return e;
  if (typeof i > "u" && (t < 0 || r < 0))
    return zr(e.toSeq().cacheResult(), t, r, n);
  var o = ke(t, i), s = Ze(r, i), a = s - o, u;
  a === a && (u = a < 0 ? 0 : a);
  var c = St(e);
  return c.size = u === 0 ? u : e.size && u || void 0, !n && Rr(e) && u >= 0 && (c.get = function(f, h) {
    return f = $t(this, f), f >= 0 && f < u ? e.get(f + o, h) : h;
  }), c.__iterateUncached = function(f, h) {
    var l = this;
    if (u === 0)
      return 0;
    if (h)
      return this.cacheResult().__iterate(f, h);
    var g = 0, p = true, d = 0;
    return e.__iterate(function(S, R) {
      if (!(p && (p = g++ < o)))
        return d++, f(S, n ? R : d - 1, l) !== false && d !== u;
    }), d;
  }, c.__iteratorUncached = function(f, h) {
    if (u !== 0 && h)
      return this.cacheResult().__iterator(f, h);
    if (u === 0)
      return new M(et);
    var l = e.__iterator(f, h), g = 0, p = 0;
    return new M(function() {
      for (; g++ < o; )
        l.next();
      if (++p > u)
        return et();
      var d = l.next();
      return n || f === ft || d.done ? d : f === re ? P(f, p - 1, void 0, d) : P(f, p - 1, d.value[1], d);
    });
  }, c;
}
function wo(e, t, r) {
  var n = St(e);
  return n.__iterateUncached = function(i, o) {
    var s = this;
    if (o)
      return this.cacheResult().__iterate(i, o);
    var a = 0;
    return e.__iterate(
      function(u, c, f) {
        return t.call(r, u, c, f) && ++a && i(u, c, s);
      }
    ), a;
  }, n.__iteratorUncached = function(i, o) {
    var s = this;
    if (o)
      return this.cacheResult().__iterator(i, o);
    var a = e.__iterator(ht, o), u = true;
    return new M(function() {
      if (!u)
        return et();
      var c = a.next();
      if (c.done)
        return c;
      var f = c.value, h = f[0], l = f[1];
      return t.call(r, l, h, s) ? i === ht ? c : P(i, h, l, c) : (u = false, et());
    });
  }, n;
}
function Xn(e, t, r, n) {
  var i = St(e);
  return i.__iterateUncached = function(o, s) {
    var a = this;
    if (s)
      return this.cacheResult().__iterate(o, s);
    var u = true, c = 0;
    return e.__iterate(function(f, h, l) {
      if (!(u && (u = t.call(r, f, h, l))))
        return c++, o(f, n ? h : c - 1, a);
    }), c;
  }, i.__iteratorUncached = function(o, s) {
    var a = this;
    if (s)
      return this.cacheResult().__iterator(o, s);
    var u = e.__iterator(ht, s), c = true, f = 0;
    return new M(function() {
      var h, l, g;
      do {
        if (h = u.next(), h.done)
          return n || o === ft ? h : o === re ? P(o, f++, void 0, h) : P(o, f++, h.value[1], h);
        var p = h.value;
        l = p[0], g = p[1], c && (c = t.call(r, g, l, a));
      } while (c);
      return o === ht ? h : P(o, l, g, h);
    });
  }, i;
}
var bo = /* @__PURE__ */ (function(e) {
  function t(r) {
    this._wrappedIterables = r.flatMap(function(n) {
      return n._wrappedIterables ? n._wrappedIterables : [n];
    }), this.size = this._wrappedIterables.reduce(function(n, i) {
      if (n !== void 0) {
        var o = i.size;
        if (o !== void 0)
          return n + o;
      }
    }, 0), this[Ke] = this._wrappedIterables[0][Ke], this[We] = this._wrappedIterables[0][We], this[zt] = this._wrappedIterables[0][zt];
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.__iterateUncached = function(n, i) {
    if (this._wrappedIterables.length !== 0) {
      if (i)
        return this.cacheResult().__iterate(n, i);
      for (var o = 0, s = N(this), a = s ? ht : ft, u = this._wrappedIterables[o].__iterator(
        a,
        i
      ), c = true, f = 0; c; ) {
        for (var h = u.next(); h.done; ) {
          if (o++, o === this._wrappedIterables.length)
            return f;
          u = this._wrappedIterables[o].__iterator(
            a,
            i
          ), h = u.next();
        }
        var l = s ? n(h.value[1], h.value[0], this) : n(h.value, f, this);
        c = l !== false, f++;
      }
      return f;
    }
  }, t.prototype.__iteratorUncached = function(n, i) {
    var o = this;
    if (this._wrappedIterables.length === 0)
      return new M(et);
    if (i)
      return this.cacheResult().__iterator(n, i);
    var s = 0, a = this._wrappedIterables[s].__iterator(
      n,
      i
    );
    return new M(function() {
      for (var u = a.next(); u.done; ) {
        if (s++, s === o._wrappedIterables.length)
          return u;
        a = o._wrappedIterables[s].__iterator(
          n,
          i
        ), u = a.next();
      }
      return u;
    });
  }, t;
})(nt);
function Oo(e, t) {
  var r = N(e), n = [e].concat(t).map(function(o) {
    return ct(o) ? r && (o = dt(o)) : o = r ? kr(o) : Wn(Array.isArray(o) ? o : [o]), o;
  }).filter(function(o) {
    return o.size !== 0;
  });
  if (n.length === 0)
    return e;
  if (n.length === 1) {
    var i = n[0];
    if (i === e || r && N(i) || pt(e) && pt(i))
      return i;
  }
  return new bo(n);
}
function Qn(e, t, r) {
  var n = St(e);
  return n.__iterateUncached = function(i, o) {
    if (o)
      return this.cacheResult().__iterate(i, o);
    var s = 0, a = false;
    function u(c, f) {
      c.__iterate(function(h, l) {
        return (!t || f < t) && ct(h) ? u(h, f + 1) : (s++, i(h, r ? l : s - 1, n) === false && (a = true)), !a;
      }, o);
    }
    return u(e, 0), s;
  }, n.__iteratorUncached = function(i, o) {
    if (o)
      return this.cacheResult().__iterator(i, o);
    var s = e.__iterator(i, o), a = [], u = 0;
    return new M(function() {
      for (; s; ) {
        var c = s.next();
        if (c.done !== false) {
          s = a.pop();
          continue;
        }
        var f = c.value;
        if (i === ht && (f = f[1]), (!t || a.length < t) && ct(f))
          a.push(s), s = f.__iterator(i, o);
        else
          return r ? c : P(i, u++, f, c);
      }
      return et();
    });
  }, n;
}
function Eo(e, t, r) {
  var n = Tr(e);
  return e.toSeq().map(function(i, o) {
    return n(t.call(r, i, o, e));
  }).flatten(true);
}
function Ro(e, t) {
  var r = St(e);
  return r.size = e.size && e.size * 2 - 1, r.__iterateUncached = function(n, i) {
    var o = this, s = 0;
    return e.__iterate(
      function(a) {
        return (!s || n(t, s++, o) !== false) && n(a, s++, o) !== false;
      },
      i
    ), s;
  }, r.__iteratorUncached = function(n, i) {
    var o = e.__iterator(ft, i), s = 0, a;
    return new M(function() {
      return (!a || s % 2) && (a = o.next(), a.done) ? a : s % 2 ? P(n, s++, t) : P(n, s++, a.value, a);
    });
  }, r;
}
function Yt(e, t, r) {
  t || (t = ti);
  var n = N(e), i = 0, o = e.toSeq().map(function(s, a) {
    return [a, s, i++, r ? r(s, a, e) : s];
  }).valueSeq().toArray();
  return o.sort(function(s, a) {
    return t(s[3], a[3]) || s[2] - a[2];
  }).forEach(
    n ? function(s, a) {
      o[a].length = 2;
    } : function(s, a) {
      o[a] = s[1];
    }
  ), n ? Dt(o) : pt(e) ? gt(o) : ie(o);
}
function Ne(e, t, r) {
  if (t || (t = ti), r) {
    var n = e.toSeq().map(function(i, o) {
      return [i, r(i, o, e)];
    }).reduce(function(i, o) {
      return cn(t, i[1], o[1]) ? o : i;
    });
    return n && n[0];
  }
  return e.reduce(function(i, o) {
    return cn(t, i, o) ? o : i;
  });
}
function cn(e, t, r) {
  var n = e(r, t);
  return n === 0 && r !== t && (r == null || r !== r) || n > 0;
}
function Pe(e, t, r, n) {
  var i = St(e), o = new Vt(r).map(function(s) {
    return s.size;
  });
  return i.size = n ? o.max() : o.min(), i.__iterate = function(s, a) {
    for (var u = this.__iterator(ft, a), c, f = 0; !(c = u.next()).done && s(c.value, f++, this) !== false; )
      ;
    return f;
  }, i.__iteratorUncached = function(s, a) {
    var u = r.map(
      function(h) {
        return h = Z(h), dr(a ? h.reverse() : h);
      }
    ), c = 0, f = false;
    return new M(function() {
      var h;
      return f || (h = u.map(function(l) {
        return l.next();
      }), f = n ? h.every(function(l) {
        return l.done;
      }) : h.some(function(l) {
        return l.done;
      })), f ? et() : P(
        s,
        c++,
        t.apply(
          null,
          h.map(function(l) {
            return l.value;
          })
        )
      );
    });
  }, i;
}
function z(e, t) {
  return e === t ? e : Rr(e) ? t : e.constructor(t);
}
function fn(e) {
  if (e !== Object(e))
    throw new TypeError("Expected [K, V] tuple: " + e);
}
function Tr(e) {
  return N(e) ? dt : pt(e) ? Pt : ee;
}
function St(e) {
  return Object.create(
    (N(e) ? Dt : pt(e) ? gt : ie).prototype
  );
}
function Lr() {
  return this._iter.cacheResult ? (this._iter.cacheResult(), this.size = this._iter.size, this) : nt.prototype.cacheResult.call(this);
}
function ti(e, t) {
  return e === void 0 && t === void 0 ? 0 : e === void 0 ? 1 : t === void 0 ? -1 : e > t ? 1 : e < t ? -1 : 0;
}
function hn(e) {
  return !!(e && // @ts-expect-error: maybeValue is typed as `{}`
  typeof e.equals == "function" && // @ts-expect-error: maybeValue is typed as `{}`
  typeof e.hashCode == "function");
}
function ut(e, t) {
  if (e === t || e !== e && t !== t)
    return true;
  if (!e || !t)
    return false;
  if (typeof e.valueOf == "function" && typeof t.valueOf == "function") {
    if (e = e.valueOf(), t = t.valueOf(), e === t || e !== e && t !== t)
      return true;
    if (!e || !t)
      return false;
  }
  return !!(hn(e) && hn(t) && e.equals(t));
}
function ei(e, t, r, n) {
  return oe(
    // @ts-expect-error Index signature for type string is missing in type V[]
    e,
    [t],
    r,
    n
  );
}
function ri() {
  for (var e = [], t = arguments.length; t--; ) e[t] = arguments[t];
  return ii(this, e);
}
function ni(e) {
  for (var t = [], r = arguments.length - 1; r-- > 0; ) t[r] = arguments[r + 1];
  if (typeof e != "function")
    throw new TypeError("Invalid merger function: " + e);
  return ii(this, t, e);
}
function ii(e, t, r) {
  for (var n = [], i = 0; i < t.length; i++) {
    var o = dt(t[i]);
    o.size !== 0 && n.push(o);
  }
  return n.length === 0 ? e : e.toSeq().size === 0 && !e.__ownerID && n.length === 1 ? Ft(e) ? e : e.constructor(n[0]) : e.withMutations(function(s) {
    for (var a = r ? function(c, f) {
      ei(
        s,
        f,
        A,
        function(h) {
          return h === A ? c : r(h, c, f);
        }
      );
    } : function(c, f) {
      s.set(f, c);
    }, u = 0; u < n.length; u++)
      n[u].forEach(a);
  });
}
var Io = Object.prototype.toString;
function Ao(e) {
  if (!e || typeof e != "object" || Io.call(e) !== "[object Object]")
    return false;
  var t = Object.getPrototypeOf(e);
  if (t === null)
    return true;
  for (var r = t, n = Object.getPrototypeOf(t); n !== null; )
    r = n, n = Object.getPrototypeOf(r);
  return r === t;
}
function Tt(e) {
  return typeof e == "object" && (mt(e) || Array.isArray(e) || Ao(e));
}
function _t(e, t) {
  t = t || 0;
  for (var r = Math.max(0, e.length - t), n = new Array(r), i = 0; i < r; i++)
    n[i] = e[i + t];
  return n;
}
function He(e) {
  if (Array.isArray(e))
    return _t(e);
  var t = {};
  for (var r in e)
    ne.call(e, r) && (t[r] = e[r]);
  return t;
}
function Dr(e, t, r) {
  return Cr(e, t, ko(r));
}
function Cr(e, t, r) {
  if (!Tt(e))
    throw new TypeError(
      "Cannot merge into non-data-structure value: " + e
    );
  if (mt(e))
    return typeof r == "function" && e.mergeWith ? e.mergeWith.apply(e, [r].concat(t)) : e.merge ? e.merge.apply(e, t) : e.concat.apply(e, t);
  for (var n = Array.isArray(e), i = e, o = n ? Pt : dt, s = n ? function(u) {
    i === e && (i = He(i)), i.push(u);
  } : function(u, c) {
    var f = ne.call(i, c), h = f && r ? r(i[c], u, c) : u;
    (!f || h !== i[c]) && (i === e && (i = He(i)), i[c] = h);
  }, a = 0; a < t.length; a++)
    o(t[a]).forEach(s);
  return i;
}
function ko(e) {
  function t(r, n, i) {
    return Tt(r) && Tt(n) && Mo(r, n) ? Cr(r, [n], t) : e ? e(r, n, i) : n;
  }
  return t;
}
function Mo(e, t) {
  var r = nt(e), n = nt(t);
  return pt(r) === pt(n) && N(r) === N(n);
}
function oi() {
  for (var e = [], t = arguments.length; t--; ) e[t] = arguments[t];
  return Dr(this, e);
}
function si(e) {
  for (var t = [], r = arguments.length - 1; r-- > 0; ) t[r] = arguments[r + 1];
  return Dr(this, t, e);
}
function qr(e) {
  for (var t = [], r = arguments.length - 1; r-- > 0; ) t[r] = arguments[r + 1];
  return oe(
    this,
    e,
    vt(),
    function(n) {
      return Dr(n, t);
    }
  );
}
function Nr(e) {
  for (var t = [], r = arguments.length - 1; r-- > 0; ) t[r] = arguments[r + 1];
  return oe(this, e, vt(), function(n) {
    return Cr(n, t);
  });
}
function $o(e, t, r) {
  return oe(e, t, A, function() {
    return r;
  });
}
function Pr(e, t) {
  return $o(this, e, t);
}
function Fr(e, t, r) {
  return arguments.length === 1 ? e(this) : ei(this, e, t, r);
}
function jr(e, t, r) {
  return oe(this, e, t, r);
}
function Br() {
  return this.__altered;
}
function ze(e) {
  var t = this.asMutable();
  return e(t), t.wasAltered() ? t.__ensureOwner(this.__ownerID) : this;
}
var ai = "@@__IMMUTABLE_MAP__@@";
function xr(e) {
  return !!(e && // @ts-expect-error: maybeMap is typed as `{}`, need to change in 6.0 to `maybeMap && typeof maybeMap === 'object' && IS_MAP_SYMBOL in maybeMap`
  e[ai]);
}
function ve(e, t) {
  if (!e)
    throw new Error(t);
}
function st(e) {
  ve(e !== 1 / 0, "Cannot perform this action with an infinite size.");
}
var Lt = /* @__PURE__ */ (function(e) {
  function t(r) {
    return r == null ? vt() : xr(r) && !yt(r) ? r : vt().withMutations(function(n) {
      var i = e(r);
      st(i.size), i.forEach(function(o, s) {
        return n.set(s, o);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.__toString("Map {", "}");
  }, t.prototype.get = function(n, i) {
    return this._root ? this._root.get(0, void 0, n, i) : i;
  }, t.prototype.set = function(n, i) {
    return dn(this, n, i);
  }, t.prototype.remove = function(n) {
    return dn(this, n, A);
  }, t.prototype.deleteAll = function(n) {
    var i = Z(n);
    return i.size === 0 ? this : this.withMutations(function(o) {
      i.forEach(function(s) {
        return o.remove(s);
      });
    });
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._root = null, this.__hash = void 0, this.__altered = true, this) : vt();
  }, t.prototype.sort = function(n) {
    return Et(Yt(this, n));
  }, t.prototype.sortBy = function(n, i) {
    return Et(Yt(this, i, n));
  }, t.prototype.map = function(n, i) {
    var o = this;
    return this.withMutations(function(s) {
      s.forEach(function(a, u) {
        s.set(u, n.call(i, a, u, o));
      });
    });
  }, t.prototype.__iterator = function(n, i) {
    return new zo(this, n, i);
  }, t.prototype.__iterate = function(n, i) {
    var o = this, s = 0;
    return this._root && this._root.iterate(function(a) {
      return s++, n(a[1], a[0], o);
    }, i), s;
  }, t.prototype.__ensureOwner = function(n) {
    return n === this.__ownerID ? this : n ? Ur(this.size, this._root, n, this.__hash) : this.size === 0 ? vt() : (this.__ownerID = n, this.__altered = false, this);
  }, t;
})(dt);
Lt.isMap = xr;
var q = Lt.prototype;
q[ai] = true;
q[Ae] = q.remove;
q.removeAll = q.deleteAll;
q.setIn = Pr;
q.removeIn = q.deleteIn = Hr;
q.update = Fr;
q.updateIn = jr;
q.merge = q.concat = ri;
q.mergeWith = ni;
q.mergeDeep = oi;
q.mergeDeepWith = si;
q.mergeIn = Nr;
q.mergeDeepIn = qr;
q.withMutations = ze;
q.wasAltered = Br;
q.asImmutable = Me;
q["@@transducer/init"] = q.asMutable = $e;
q["@@transducer/step"] = function(e, t) {
  return e.set(t[0], t[1]);
};
q["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
var Se = function(t, r) {
  this.ownerID = t, this.entries = r;
};
Se.prototype.get = function(t, r, n, i) {
  for (var o = this.entries, s = 0, a = o.length; s < a; s++)
    if (ut(n, o[s][0]))
      return o[s][1];
  return i;
};
Se.prototype.update = function(t, r, n, i, o, s, a) {
  for (var u = o === A, c = this.entries, f = 0, h = c.length; f < h && !ut(i, c[f][0]); f++)
    ;
  var l = f < h;
  if (l ? c[f][1] === o : u)
    return this;
  if (lt(a), (u || !l) && lt(s), !(u && c.length === 1)) {
    if (!l && !u && c.length >= No)
      return To(t, c, i, o);
    var g = t && t === this.ownerID, p = g ? c : _t(c);
    return l ? u ? f === h - 1 ? p.pop() : p[f] = p.pop() : p[f] = [i, o] : p.push([i, o]), g ? (this.entries = p, this) : new Se(t, p);
  }
};
var Jt = function(t, r, n) {
  this.ownerID = t, this.bitmap = r, this.nodes = n;
};
Jt.prototype.get = function(t, r, n, i) {
  r === void 0 && (r = ot(n));
  var o = 1 << ((t === 0 ? r : r >>> t) & tt), s = this.bitmap;
  return (s & o) === 0 ? i : this.nodes[ui(s & o - 1)].get(
    t + T,
    r,
    n,
    i
  );
};
Jt.prototype.update = function(t, r, n, i, o, s, a) {
  n === void 0 && (n = ot(i));
  var u = (r === 0 ? n : n >>> r) & tt, c = 1 << u, f = this.bitmap, h = (f & c) !== 0;
  if (!h && o === A)
    return this;
  var l = ui(f & c - 1), g = this.nodes, p = h ? g[l] : void 0, d = Wr(
    p,
    t,
    r + T,
    n,
    i,
    o,
    s,
    a
  );
  if (d === p)
    return this;
  if (!h && d && g.length >= Po)
    return Do(t, g, f, u, d);
  if (h && !d && g.length === 2 && gn(g[l ^ 1]))
    return g[l ^ 1];
  if (h && d && g.length === 1 && gn(d))
    return d;
  var S = t && t === this.ownerID, R = h ? d ? f : f ^ c : f | c, b = h ? d ? ci(g, l, d, S) : qo(g, l, S) : Co(g, l, d, S);
  return S ? (this.bitmap = R, this.nodes = b, this) : new Jt(t, R, b);
};
var we = function(t, r, n) {
  this.ownerID = t, this.count = r, this.nodes = n;
};
we.prototype.get = function(t, r, n, i) {
  r === void 0 && (r = ot(n));
  var o = (t === 0 ? r : r >>> t) & tt, s = this.nodes[o];
  return s ? s.get(t + T, r, n, i) : i;
};
we.prototype.update = function(t, r, n, i, o, s, a) {
  n === void 0 && (n = ot(i));
  var u = (r === 0 ? n : n >>> r) & tt, c = o === A, f = this.nodes, h = f[u];
  if (c && !h)
    return this;
  var l = Wr(
    h,
    t,
    r + T,
    n,
    i,
    o,
    s,
    a
  );
  if (l === h)
    return this;
  var g = this.count;
  if (!h)
    g++;
  else if (!l && (g--, g < Fo))
    return Lo(t, f, g, u);
  var p = t && t === this.ownerID, d = ci(f, u, l, p);
  return p ? (this.count = g, this.nodes = d, this) : new we(t, g, d);
};
var Gt = function(t, r, n) {
  this.ownerID = t, this.keyHash = r, this.entries = n;
};
Gt.prototype.get = function(t, r, n, i) {
  for (var o = this.entries, s = 0, a = o.length; s < a; s++)
    if (ut(n, o[s][0]))
      return o[s][1];
  return i;
};
Gt.prototype.update = function(t, r, n, i, o, s, a) {
  n === void 0 && (n = ot(i));
  var u = o === A;
  if (n !== this.keyHash)
    return u ? this : (lt(a), lt(s), Kr(this, t, r, n, [i, o]));
  for (var c = this.entries, f = 0, h = c.length; f < h && !ut(i, c[f][0]); f++)
    ;
  var l = f < h;
  if (l ? c[f][1] === o : u)
    return this;
  if (lt(a), (u || !l) && lt(s), u && h === 2)
    return new Ot(t, this.keyHash, c[f ^ 1]);
  var g = t && t === this.ownerID, p = g ? c : _t(c);
  return l ? u ? f === h - 1 ? p.pop() : p[f] = p.pop() : p[f] = [i, o] : p.push([i, o]), g ? (this.entries = p, this) : new Gt(t, this.keyHash, p);
};
var Ot = function(t, r, n) {
  this.ownerID = t, this.keyHash = r, this.entry = n;
};
Ot.prototype.get = function(t, r, n, i) {
  return ut(n, this.entry[0]) ? this.entry[1] : i;
};
Ot.prototype.update = function(t, r, n, i, o, s, a) {
  var u = o === A, c = ut(i, this.entry[0]);
  if (c ? o === this.entry[1] : u)
    return this;
  if (lt(a), u) {
    lt(s);
    return;
  }
  return c ? t && t === this.ownerID ? (this.entry[1] = o, this) : new Ot(t, this.keyHash, [i, o]) : (lt(s), Kr(this, t, r, ot(i), [i, o]));
};
Se.prototype.iterate = Gt.prototype.iterate = function(e, t) {
  for (var r = this.entries, n = 0, i = r.length - 1; n <= i; n++)
    if (e(r[t ? i - n : n]) === false)
      return false;
};
Jt.prototype.iterate = we.prototype.iterate = function(e, t) {
  for (var r = this.nodes, n = 0, i = r.length - 1; n <= i; n++) {
    var o = r[t ? i - n : n];
    if (o && o.iterate(e, t) === false)
      return false;
  }
};
Ot.prototype.iterate = function(e, t) {
  return e(this.entry);
};
var zo = /* @__PURE__ */ (function(e) {
  function t(r, n, i) {
    this._type = n, this._reverse = i, this._stack = r._root && ln(r._root);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.next = function() {
    for (var n = this._type, i = this._stack; i; ) {
      var o = i.node, s = i.index++, a = void 0;
      if (o.entry) {
        if (s === 0)
          return cr(n, o.entry);
      } else if (o.entries) {
        if (a = o.entries.length - 1, s <= a)
          return cr(
            n,
            o.entries[this._reverse ? a - s : s]
          );
      } else if (a = o.nodes.length - 1, s <= a) {
        var u = o.nodes[this._reverse ? a - s : s];
        if (u) {
          if (u.entry)
            return cr(n, u.entry);
          i = this._stack = ln(u, i);
        }
        continue;
      }
      i = this._stack = this._stack.__prev;
    }
    return et();
  }, t;
})(M);
function cr(e, t) {
  return P(e, t[0], t[1]);
}
function ln(e, t) {
  return {
    node: e,
    index: 0,
    __prev: t
  };
}
function Ur(e, t, r, n) {
  var i = Object.create(q);
  return i.size = e, i._root = t, i.__ownerID = r, i.__hash = n, i.__altered = false, i;
}
var pn;
function vt() {
  return pn || (pn = Ur(0));
}
function dn(e, t, r) {
  var n, i;
  if (e._root) {
    var o = gr(), s = gr();
    if (n = Wr(
      e._root,
      e.__ownerID,
      0,
      void 0,
      t,
      r,
      o,
      s
    ), !s.value)
      return e;
    i = e.size + (o.value ? r === A ? -1 : 1 : 0);
  } else {
    if (r === A)
      return e;
    i = 1, n = new Se(e.__ownerID, [[t, r]]);
  }
  return e.__ownerID ? (e.size = i, e._root = n, e.__hash = void 0, e.__altered = true, e) : n ? Ur(i, n) : vt();
}
function Wr(e, t, r, n, i, o, s, a) {
  return e ? e.update(
    t,
    r,
    n,
    i,
    o,
    s,
    a
  ) : o === A ? e : (lt(a), lt(s), new Ot(t, n, [i, o]));
}
function gn(e) {
  return e.constructor === Ot || e.constructor === Gt;
}
function Kr(e, t, r, n, i) {
  if (e.keyHash === n)
    return new Gt(t, n, [e.entry, i]);
  var o = (r === 0 ? e.keyHash : e.keyHash >>> r) & tt, s = (r === 0 ? n : n >>> r) & tt, a, u = o === s ? [Kr(e, t, r + T, n, i)] : (a = new Ot(t, n, i), o < s ? [e, a] : [a, e]);
  return new Jt(t, 1 << o | 1 << s, u);
}
function To(e, t, r, n) {
  e || (e = new Er());
  for (var i = new Ot(e, ot(r), [r, n]), o = 0; o < t.length; o++) {
    var s = t[o];
    i = i.update(e, 0, void 0, s[0], s[1]);
  }
  return i;
}
function Lo(e, t, r, n) {
  for (var i = 0, o = 0, s = new Array(r), a = 0, u = 1, c = t.length; a < c; a++, u <<= 1) {
    var f = t[a];
    f !== void 0 && a !== n && (i |= u, s[o++] = f);
  }
  return new Jt(e, i, s);
}
function Do(e, t, r, n, i) {
  for (var o = 0, s = new Array(at), a = 0; r !== 0; a++, r >>>= 1)
    s[a] = r & 1 ? t[o++] : void 0;
  return s[n] = i, new we(e, o + 1, s);
}
function ui(e) {
  return e -= e >> 1 & 1431655765, e = (e & 858993459) + (e >> 2 & 858993459), e = e + (e >> 4) & 252645135, e += e >> 8, e += e >> 16, e & 127;
}
function ci(e, t, r, n) {
  var i = n ? e : _t(e);
  return i[t] = r, i;
}
function Co(e, t, r, n) {
  var i = e.length + 1;
  if (n && t + 1 === i)
    return e[t] = r, e;
  for (var o = new Array(i), s = 0, a = 0; a < i; a++)
    a === t ? (o[a] = r, s = -1) : o[a] = e[a + s];
  return o;
}
function qo(e, t, r) {
  var n = e.length - 1;
  if (r && t === n)
    return e.pop(), e;
  for (var i = new Array(n), o = 0, s = 0; s < n; s++)
    s === t && (o = 1), i[s] = e[s + o];
  return i;
}
var No = at / 4, Po = at / 2, Fo = at / 4;
function fi(e) {
  if (Un(e) && typeof e != "string")
    return e;
  if (yt(e))
    return e.toArray();
  throw new TypeError("Invalid keyPath: expected Ordered Collection or Array: " + e);
}
function be(e) {
  try {
    return typeof e == "string" ? JSON.stringify(e) : String(e);
  } catch {
    return JSON.stringify(e);
  }
}
function jo(e, t) {
  return mt(e) ? (
    // @ts-expect-error key might be a number or symbol, which is not handled be Record key type
    e.has(t)
  ) : (
    // @ts-expect-error key might be anything else than PropertyKey, and will return false in that case but runtime is OK
    Tt(e) && ne.call(e, t)
  );
}
function hi(e, t, r) {
  return mt(e) ? e.get(t, r) : jo(e, t) ? (
    // @ts-expect-error weird "get" here,
    typeof e.get == "function" ? (
      // @ts-expect-error weird "get" here,
      e.get(t)
    ) : (
      // @ts-expect-error key is unknown here,
      e[t]
    )
  ) : r;
}
function Bo(e, t) {
  if (!Tt(e))
    throw new TypeError("Cannot update non-data-structure value: " + e);
  if (mt(e)) {
    if (!e.remove)
      throw new TypeError("Cannot update immutable value without .remove() method: " + e);
    return e.remove(t);
  }
  if (!ne.call(e, t))
    return e;
  var r = He(e);
  return Array.isArray(r) ? r.splice(t, 1) : delete r[t], r;
}
function xo(e, t, r) {
  if (!Tt(e))
    throw new TypeError("Cannot update non-data-structure value: " + e);
  if (mt(e)) {
    if (!e.set)
      throw new TypeError("Cannot update immutable value without .set() method: " + e);
    return e.set(t, r);
  }
  if (ne.call(e, t) && r === e[t])
    return e;
  var n = He(e);
  return n[t] = r, n;
}
function oe(e, t, r, n) {
  n || (n = r, r = void 0);
  var i = li(
    mt(e),
    // @ts-expect-error type issues with Record and mixed types
    e,
    fi(t),
    0,
    r,
    n
  );
  return i === A ? r : i;
}
function li(e, t, r, n, i, o) {
  var s = t === A;
  if (n === r.length) {
    var a = s ? i : t, u = o(a);
    return u === a ? t : u;
  }
  if (!s && !Tt(t))
    throw new TypeError("Cannot update within non-data-structure value in path [" + Array.from(r).slice(0, n).map(be) + "]: " + t);
  var c = r[n], f = s ? A : hi(t, c, A), h = li(
    f === A ? e : mt(f),
    // @ts-expect-error mixed type
    f,
    r,
    n + 1,
    i,
    o
  );
  return h === f ? t : h === A ? Bo(t, c) : xo(s ? e ? vt() : {} : t, c, h);
}
function Uo(e, t) {
  return oe(e, t, function() {
    return A;
  });
}
function Hr(e) {
  return Uo(this, e);
}
var pi = "@@__IMMUTABLE_LIST__@@";
function di(e) {
  return !!(e && // @ts-expect-error: maybeList is typed as `{}`, need to change in 6.0 to `maybeList && typeof maybeList === 'object' && IS_LIST_SYMBOL in maybeList`
  e[pi]);
}
var Zt = /* @__PURE__ */ (function(e) {
  function t(r) {
    var n = Be();
    if (r == null)
      return n;
    if (di(r))
      return r;
    var i = e(r), o = i.size;
    return o === 0 ? n : (st(o), o > 0 && o < at ? Oe(0, o, T, null, new kt(i.toArray())) : n.withMutations(function(s) {
      s.setSize(o), i.forEach(function(a, u) {
        return s.set(u, a);
      });
    }));
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("List [", "]");
  }, t.prototype.get = function(n, i) {
    if (n = $t(this, n), n >= 0 && n < this.size) {
      n += this._origin;
      var o = gi(this, n);
      return o && o.array[n & tt];
    }
    return i;
  }, t.prototype.set = function(n, i) {
    return Wo(this, n, i);
  }, t.prototype.remove = function(n) {
    return this.has(n) ? n === 0 ? this.shift() : n === this.size - 1 ? this.pop() : this.splice(n, 1) : this;
  }, t.prototype.insert = function(n, i) {
    return this.splice(n, 0, i);
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = this._origin = this._capacity = 0, this._level = T, this._root = this._tail = this.__hash = void 0, this.__altered = true, this) : Be();
  }, t.prototype.push = function() {
    var n = arguments, i = this.size;
    return this.withMutations(function(o) {
      Rt(o, 0, i + n.length);
      for (var s = 0; s < n.length; s++)
        o.set(i + s, n[s]);
    });
  }, t.prototype.pop = function() {
    return Rt(this, 0, -1);
  }, t.prototype.unshift = function() {
    var n = arguments;
    return this.withMutations(function(i) {
      Rt(i, -n.length);
      for (var o = 0; o < n.length; o++)
        i.set(o, n[o]);
    });
  }, t.prototype.shift = function() {
    return Rt(this, 1);
  }, t.prototype.shuffle = function(n) {
    return n === void 0 && (n = Math.random), this.withMutations(function(i) {
      for (var o = i.size, s, a; o; )
        s = Math.floor(n() * o--), a = i.get(s), i.set(s, i.get(o)), i.set(o, a);
    });
  }, t.prototype.concat = function() {
    for (var n = arguments, i = [], o = 0; o < arguments.length; o++) {
      var s = n[o], a = e(
        typeof s != "string" && Nn(s) ? s : [s]
      );
      a.size !== 0 && i.push(a);
    }
    return i.length === 0 ? this : this.size === 0 && !this.__ownerID && i.length === 1 ? this.constructor(i[0]) : this.withMutations(function(u) {
      i.forEach(function(c) {
        return c.forEach(function(f) {
          return u.push(f);
        });
      });
    });
  }, t.prototype.setSize = function(n) {
    return Rt(this, 0, n);
  }, t.prototype.map = function(n, i) {
    var o = this;
    return this.withMutations(function(s) {
      for (var a = 0; a < o.size; a++)
        s.set(a, n.call(i, s.get(a), a, o));
    });
  }, t.prototype.slice = function(n, i) {
    var o = this.size;
    return Ge(n, i, o) ? this : Rt(
      this,
      ke(n, o),
      Ze(i, o)
    );
  }, t.prototype.__iterator = function(n, i) {
    var o = i ? this.size : 0, s = _n(this, i);
    return new M(function() {
      var a = s();
      return a === ye ? et() : P(n, i ? --o : o++, a);
    });
  }, t.prototype.__iterate = function(n, i) {
    for (var o = i ? this.size : 0, s = _n(this, i), a; (a = s()) !== ye && n(a, i ? --o : o++, this) !== false; )
      ;
    return o;
  }, t.prototype.__ensureOwner = function(n) {
    return n === this.__ownerID ? this : n ? Oe(
      this._origin,
      this._capacity,
      this._level,
      this._root,
      this._tail,
      n,
      this.__hash
    ) : this.size === 0 ? Be() : (this.__ownerID = n, this.__altered = false, this);
  }, t;
})(Pt);
Zt.isList = di;
var U = Zt.prototype;
U[pi] = true;
U[Ae] = U.remove;
U.merge = U.concat;
U.setIn = Pr;
U.deleteIn = U.removeIn = Hr;
U.update = Fr;
U.updateIn = jr;
U.mergeIn = Nr;
U.mergeDeepIn = qr;
U.withMutations = ze;
U.wasAltered = Br;
U.asImmutable = Me;
U["@@transducer/init"] = U.asMutable = $e;
U["@@transducer/step"] = function(e, t) {
  return e.push(t);
};
U["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
var kt = function(t, r) {
  this.array = t, this.ownerID = r;
};
kt.prototype.removeBefore = function(t, r, n) {
  if ((n & (1 << r + T) - 1) === 0 || this.array.length === 0)
    return this;
  var i = n >>> r & tt;
  if (i >= this.array.length)
    return new kt([], t);
  var o = i === 0, s;
  if (r > 0) {
    var a = this.array[i];
    if (s = a && a.removeBefore(t, r - T, n), s === a && o)
      return this;
  }
  if (o && !s)
    return this;
  var u = Xt(this, t);
  if (!o)
    for (var c = 0; c < i; c++)
      u.array[c] = void 0;
  return s && (u.array[i] = s), u;
};
kt.prototype.removeAfter = function(t, r, n) {
  if (n === (r ? 1 << r + T : at) || this.array.length === 0)
    return this;
  var i = n - 1 >>> r & tt;
  if (i >= this.array.length)
    return this;
  var o;
  if (r > 0) {
    var s = this.array[i];
    if (o = s && s.removeAfter(t, r - T, n), o === s && i === this.array.length - 1)
      return this;
  }
  var a = Xt(this, t);
  return a.array.splice(i + 1), o && (a.array[i] = o), a;
};
var ye = {};
function _n(e, t) {
  var r = e._origin, n = e._capacity, i = Ee(n), o = e._tail;
  return s(e._root, e._level, 0);
  function s(c, f, h) {
    return f === 0 ? a(c, h) : u(c, f, h);
  }
  function a(c, f) {
    var h = f === i ? o && o.array : c && c.array, l = f > r ? 0 : r - f, g = n - f;
    return g > at && (g = at), function() {
      if (l === g)
        return ye;
      var p = t ? --g : l++;
      return h && h[p];
    };
  }
  function u(c, f, h) {
    var l, g = c && c.array, p = h > r ? 0 : r - h >> f, d = (n - h >> f) + 1;
    return d > at && (d = at), function() {
      for (; ; ) {
        if (l) {
          var S = l();
          if (S !== ye)
            return S;
          l = null;
        }
        if (p === d)
          return ye;
        var R = t ? --d : p++;
        l = s(
          g && g[R],
          f - T,
          h + (R << f)
        );
      }
    };
  }
}
function Oe(e, t, r, n, i, o, s) {
  var a = Object.create(U);
  return a.size = t - e, a._origin = e, a._capacity = t, a._level = r, a._root = n, a._tail = i, a.__ownerID = o, a.__hash = s, a.__altered = false, a;
}
function Be() {
  return Oe(0, 0, T);
}
function Wo(e, t, r) {
  if (t = $t(e, t), t !== t)
    return e;
  if (t >= e.size || t < 0)
    return e.withMutations(function(s) {
      t < 0 ? Rt(s, t).set(0, r) : Rt(s, 0, t + 1).set(t, r);
    });
  t += e._origin;
  var n = e._tail, i = e._root, o = gr();
  return t >= Ee(e._capacity) ? n = mr(n, e.__ownerID, 0, t, r, o) : i = mr(
    i,
    e.__ownerID,
    e._level,
    t,
    r,
    o
  ), o.value ? e.__ownerID ? (e._root = i, e._tail = n, e.__hash = void 0, e.__altered = true, e) : Oe(e._origin, e._capacity, e._level, i, n) : e;
}
function mr(e, t, r, n, i, o) {
  var s = n >>> r & tt, a = e && s < e.array.length;
  if (!a && i === void 0)
    return e;
  var u;
  if (r > 0) {
    var c = e && e.array[s], f = mr(
      c,
      t,
      r - T,
      n,
      i,
      o
    );
    return f === c ? e : (u = Xt(e, t), u.array[s] = f, u);
  }
  return a && e.array[s] === i ? e : (o && lt(o), u = Xt(e, t), i === void 0 && s === u.array.length - 1 ? u.array.pop() : u.array[s] = i, u);
}
function Xt(e, t) {
  return t && e && t === e.ownerID ? e : new kt(e ? e.array.slice() : [], t);
}
function gi(e, t) {
  if (t >= Ee(e._capacity))
    return e._tail;
  if (t < 1 << e._level + T) {
    for (var r = e._root, n = e._level; r && n > 0; )
      r = r.array[t >>> n & tt], n -= T;
    return r;
  }
}
function Rt(e, t, r) {
  t !== void 0 && (t |= 0), r !== void 0 && (r |= 0);
  var n = e.__ownerID || new Er(), i = e._origin, o = e._capacity, s = i + t, a = r === void 0 ? o : r < 0 ? o + r : i + r;
  if (s === i && a === o)
    return e;
  if (s >= a)
    return e.clear();
  for (var u = e._level, c = e._root, f = 0; s + f < 0; )
    c = new kt(
      c && c.array.length ? [void 0, c] : [],
      n
    ), u += T, f += 1 << u;
  f && (s += f, i += f, a += f, o += f);
  for (var h = Ee(o), l = Ee(a); l >= 1 << u + T; )
    c = new kt(
      c && c.array.length ? [c] : [],
      n
    ), u += T;
  var g = e._tail, p = l < h ? gi(e, a - 1) : l > h ? new kt([], n) : g;
  if (g && l > h && s < o && g.array.length) {
    c = Xt(c, n);
    for (var d = c, S = u; S > T; S -= T) {
      var R = h >>> S & tt;
      d = d.array[R] = Xt(d.array[R], n);
    }
    d.array[h >>> T & tt] = g;
  }
  if (a < o && (p = p && p.removeAfter(n, 0, a)), s >= l)
    s -= l, a -= l, u = T, c = null, p = p && p.removeBefore(n, 0, s);
  else if (s > i || l < h) {
    for (f = 0; c; ) {
      var b = s >>> u & tt;
      if (b !== l >>> u & tt)
        break;
      b && (f += (1 << u) * b), u -= T, c = c.array[b];
    }
    c && s > i && (c = c.removeBefore(n, u, s - f)), c && l < h && (c = c.removeAfter(
      n,
      u,
      l - f
    )), f && (s -= f, a -= f);
  }
  return e.__ownerID ? (e.size = a - s, e._origin = s, e._capacity = a, e._level = u, e._root = c, e._tail = p, e.__hash = void 0, e.__altered = true, e) : Oe(s, a, u, c, p);
}
function Ee(e) {
  return e < at ? 0 : e - 1 >>> T << T;
}
function _i(e) {
  return xr(e) && yt(e);
}
var Et = /* @__PURE__ */ (function(e) {
  function t(r) {
    return r == null ? pe() : _i(r) ? r : pe().withMutations(function(n) {
      var i = dt(r);
      st(i.size), i.forEach(function(o, s) {
        return n.set(s, o);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("OrderedMap {", "}");
  }, t.prototype.get = function(n, i) {
    var o = this._map.get(n);
    return o !== void 0 ? this._list.get(o)[1] : i;
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._map.clear(), this._list.clear(), this.__altered = true, this) : pe();
  }, t.prototype.set = function(n, i) {
    return yn(this, n, i);
  }, t.prototype.remove = function(n) {
    return yn(this, n, A);
  }, t.prototype.__iterate = function(n, i) {
    var o = this;
    return this._list.__iterate(
      function(s) {
        return s && n(s[1], s[0], o);
      },
      i
    );
  }, t.prototype.__iterator = function(n, i) {
    return this._list.fromEntrySeq().__iterator(n, i);
  }, t.prototype.__ensureOwner = function(n) {
    if (n === this.__ownerID)
      return this;
    var i = this._map.__ensureOwner(n), o = this._list.__ensureOwner(n);
    return n ? Vr(i, o, n, this.__hash) : this.size === 0 ? pe() : (this.__ownerID = n, this.__altered = false, this._map = i, this._list = o, this);
  }, t;
})(Lt);
Et.isOrderedMap = _i;
Et.prototype[zt] = true;
Et.prototype[Ae] = Et.prototype.remove;
function Vr(e, t, r, n) {
  var i = Object.create(Et.prototype);
  return i.size = e ? e.size : 0, i._map = e, i._list = t, i.__ownerID = r, i.__hash = n, i.__altered = false, i;
}
var vn;
function pe() {
  return vn || (vn = Vr(vt(), Be()));
}
function yn(e, t, r) {
  var n = e._map, i = e._list, o = n.get(t), s = o !== void 0, a, u;
  if (r === A) {
    if (!s)
      return e;
    i.size >= at && i.size >= n.size * 2 ? (u = i.filter(function(c, f) {
      return c !== void 0 && o !== f;
    }), a = u.toKeyedSeq().map(function(c) {
      return c[0];
    }).flip().toMap(), e.__ownerID && (a.__ownerID = u.__ownerID = e.__ownerID)) : (a = n.remove(t), u = o === i.size - 1 ? i.pop() : i.set(o, void 0));
  } else if (s) {
    if (r === i.get(o)[1])
      return e;
    a = n, u = i.set(o, [t, r]);
  } else
    a = n.set(t, i.size), u = i.set(i.size, [t, r]);
  return e.__ownerID ? (e.size = a.size, e._map = a, e._list = u, e.__hash = void 0, e.__altered = true, e) : Vr(a, u);
}
var vi = "@@__IMMUTABLE_STACK__@@";
function Sr(e) {
  return !!(e && // @ts-expect-error: maybeStack is typed as `{}`, need to change in 6.0 to `maybeStack && typeof maybeStack === 'object' && MAYBE_STACK_SYMBOL in maybeStack`
  e[vi]);
}
var Yr = /* @__PURE__ */ (function(e) {
  function t(r) {
    return r == null ? Fe() : Sr(r) ? r : Fe().pushAll(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("Stack [", "]");
  }, t.prototype.get = function(n, i) {
    var o = this._head;
    for (n = $t(this, n); o && n--; )
      o = o.next;
    return o ? o.value : i;
  }, t.prototype.peek = function() {
    return this._head && this._head.value;
  }, t.prototype.push = function() {
    var n = arguments;
    if (arguments.length === 0)
      return this;
    for (var i = this.size + arguments.length, o = this._head, s = arguments.length - 1; s >= 0; s--)
      o = {
        value: n[s],
        next: o
      };
    return this.__ownerID ? (this.size = i, this._head = o, this.__hash = void 0, this.__altered = true, this) : de(i, o);
  }, t.prototype.pushAll = function(n) {
    if (n = e(n), n.size === 0)
      return this;
    if (this.size === 0 && Sr(n))
      return n;
    st(n.size);
    var i = this.size, o = this._head;
    return n.__iterate(
      function(s) {
        i++, o = {
          value: s,
          next: o
        };
      },
      /* reverse */
      true
    ), this.__ownerID ? (this.size = i, this._head = o, this.__hash = void 0, this.__altered = true, this) : de(i, o);
  }, t.prototype.pop = function() {
    return this.slice(1);
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._head = void 0, this.__hash = void 0, this.__altered = true, this) : Fe();
  }, t.prototype.slice = function(n, i) {
    if (Ge(n, i, this.size))
      return this;
    var o = ke(n, this.size), s = Ze(i, this.size);
    if (s !== this.size)
      return e.prototype.slice.call(this, n, i);
    for (var a = this.size - o, u = this._head; o--; )
      u = u.next;
    return this.__ownerID ? (this.size = a, this._head = u, this.__hash = void 0, this.__altered = true, this) : de(a, u);
  }, t.prototype.__ensureOwner = function(n) {
    return n === this.__ownerID ? this : n ? de(this.size, this._head, n, this.__hash) : this.size === 0 ? Fe() : (this.__ownerID = n, this.__altered = false, this);
  }, t.prototype.__iterate = function(n, i) {
    var o = this;
    if (i)
      return new Vt(this.toArray()).__iterate(
        function(u, c) {
          return n(u, c, o);
        },
        i
      );
    for (var s = 0, a = this._head; a && n(a.value, s++, this) !== false; )
      a = a.next;
    return s;
  }, t.prototype.__iterator = function(n, i) {
    if (i)
      return new Vt(this.toArray()).__iterator(n, i);
    var o = 0, s = this._head;
    return new M(function() {
      if (s) {
        var a = s.value;
        return s = s.next, P(n, o++, a);
      }
      return et();
    });
  }, t;
})(Pt);
Yr.isStack = Sr;
var rt = Yr.prototype;
rt[vi] = true;
rt.shift = rt.pop;
rt.unshift = rt.push;
rt.unshiftAll = rt.pushAll;
rt.withMutations = ze;
rt.wasAltered = Br;
rt.asImmutable = Me;
rt["@@transducer/init"] = rt.asMutable = $e;
rt["@@transducer/step"] = function(e, t) {
  return e.unshift(t);
};
rt["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
function de(e, t, r, n) {
  var i = Object.create(rt);
  return i.size = e, i._head = t, i.__ownerID = r, i.__hash = n, i.__altered = false, i;
}
var mn;
function Fe() {
  return mn || (mn = de(0));
}
function Sn(e, t, r, n, i, o) {
  return st(e.size), e.__iterate(function(s, a, u) {
    i ? (i = false, r = s) : r = t.call(n, r, s, a, u);
  }, o), r;
}
function Ko(e, t) {
  return t;
}
function Ho(e, t) {
  return [t, e];
}
function fr(e) {
  return function() {
    for (var t = [], r = arguments.length; r--; ) t[r] = arguments[r];
    return !e.apply(this, t);
  };
}
function wn(e) {
  return function() {
    for (var t = [], r = arguments.length; r--; ) t[r] = arguments[r];
    return -e.apply(this, t);
  };
}
function bn(e, t) {
  return e < t ? 1 : e > t ? -1 : 0;
}
function yi(e, t) {
  if (e === t)
    return true;
  if (!ct(t) || // @ts-expect-error size should exists on Collection
  e.size !== void 0 && t.size !== void 0 && e.size !== t.size || // @ts-expect-error __hash exists on Collection
  e.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  t.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  e.__hash !== t.__hash || N(e) !== N(t) || pt(e) !== pt(t) || // @ts-expect-error Range extends Collection, which implements [Symbol.iterator], so it is valid
  yt(e) !== yt(t))
    return false;
  if (e.size === 0 && t.size === 0)
    return true;
  var r = !Or(e);
  if (yt(e)) {
    var n = e.entries();
    return t.every(function(u, c) {
      var f = n.next().value;
      return f && ut(f[1], u) && (r || ut(f[0], c));
    }) && n.next().done;
  }
  var i = false;
  if (e.size === void 0)
    if (t.size === void 0)
      typeof e.cacheResult == "function" && e.cacheResult();
    else {
      i = true;
      var o = e;
      e = t, t = o;
    }
  var s = true, a = (
    // @ts-expect-error b is Range | Repeat | Collection<unknown, unknown> as it may have been flipped, and __iterate is valid
    t.__iterate(function(u, c) {
      if (r ? (
        // @ts-expect-error has exists on Collection
        !e.has(u)
      ) : i ? (
        // @ts-expect-error type of `get` does not "catch" the version with `notSetValue`
        !ut(u, e.get(c, A))
      ) : (
        // @ts-expect-error type of `get` does not "catch" the version with `notSetValue`
        !ut(e.get(c, A), u)
      ))
        return s = false, false;
    })
  );
  return s && // @ts-expect-error size should exists on Collection
  e.size === a;
}
var Vo = /* @__PURE__ */ (function(e) {
  function t(r, n, i) {
    if (i === void 0 && (i = 1), !(this instanceof t))
      return new t(r, n, i);
    if (ve(i !== 0, "Cannot step a Range by 0"), ve(
      r !== void 0,
      "You must define a start value when using Range"
    ), ve(
      n !== void 0,
      "You must define an end value when using Range"
    ), i = Math.abs(i), n < r && (i = -i), this._start = r, this._end = n, this._step = i, this.size = Math.max(0, Math.ceil((n - r) / i - 1) + 1), this.size === 0) {
      if (hr)
        return hr;
      hr = this;
    }
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.size === 0 ? "Range []" : "Range [ " + this._start + "..." + this._end + (this._step !== 1 ? " by " + this._step : "") + " ]";
  }, t.prototype.get = function(n, i) {
    return this.has(n) ? this._start + $t(this, n) * this._step : i;
  }, t.prototype.includes = function(n) {
    var i = (n - this._start) / this._step;
    return i >= 0 && i < this.size && i === Math.floor(i);
  }, t.prototype.slice = function(n, i) {
    return Ge(n, i, this.size) ? this : (n = ke(n, this.size), i = Ze(i, this.size), i <= n ? new t(0, 0) : new t(
      this.get(n, this._end),
      this.get(i, this._end),
      this._step
    ));
  }, t.prototype.indexOf = function(n) {
    var i = n - this._start;
    if (i % this._step === 0) {
      var o = i / this._step;
      if (o >= 0 && o < this.size)
        return o;
    }
    return -1;
  }, t.prototype.lastIndexOf = function(n) {
    return this.indexOf(n);
  }, t.prototype.__iterate = function(n, i) {
    for (var o = this.size, s = this._step, a = i ? this._start + (o - 1) * s : this._start, u = 0; u !== o && n(a, i ? o - ++u : u++, this) !== false; )
      a += i ? -s : s;
    return u;
  }, t.prototype.__iterator = function(n, i) {
    var o = this.size, s = this._step, a = i ? this._start + (o - 1) * s : this._start, u = 0;
    return new M(function() {
      if (u === o)
        return et();
      var c = a;
      return a += i ? -s : s, P(n, i ? o - ++u : u++, c);
    });
  }, t.prototype.equals = function(n) {
    return n instanceof t ? this._start === n._start && this._end === n._end && this._step === n._step : yi(this, n);
  }, t;
})(gt), hr, mi = "@@__IMMUTABLE_SET__@@";
function Jr(e) {
  return !!(e && // @ts-expect-error: maybeSet is typed as `{}`,  need to change in 6.0 to `maybeSeq && typeof maybeSet === 'object' && MAYBE_SET_SYMBOL in maybeSet`
  e[mi]);
}
var tr = /* @__PURE__ */ (function(e) {
  function t(r) {
    return r == null ? ge() : Jr(r) && !yt(r) ? r : ge().withMutations(function(n) {
      var i = e(r);
      st(i.size), i.forEach(function(o) {
        return n.add(o);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.fromKeys = function(n) {
    return this(dt(n).keySeq());
  }, t.intersect = function(n) {
    return n = Z(n).toArray(), n.length ? Y.intersect.apply(t(n.pop()), n) : ge();
  }, t.union = function(n) {
    return n = Z(n).toArray(), n.length ? Y.union.apply(t(n.pop()), n) : ge();
  }, t.prototype.toString = function() {
    return this.__toString("Set {", "}");
  }, t.prototype.has = function(n) {
    return this._map.has(n);
  }, t.prototype.add = function(n) {
    return je(this, this._map.set(n, n));
  }, t.prototype.remove = function(n) {
    return je(this, this._map.remove(n));
  }, t.prototype.clear = function() {
    return je(this, this._map.clear());
  }, t.prototype.map = function(n, i) {
    var o = this, s = false, a = je(
      this,
      this._map.mapEntries(function(u) {
        var c = u[1], f = n.call(i, c, c, o);
        return f !== c && (s = true), [f, f];
      }, i)
    );
    return s ? a : this;
  }, t.prototype.union = function() {
    for (var n = [], i = arguments.length; i--; ) n[i] = arguments[i];
    return n = n.filter(function(o) {
      return o.size !== 0;
    }), n.length === 0 ? this : this.size === 0 && !this.__ownerID && n.length === 1 ? this.constructor(n[0]) : this.withMutations(function(o) {
      for (var s = 0; s < n.length; s++)
        typeof n[s] == "string" ? o.add(n[s]) : e(n[s]).forEach(function(a) {
          return o.add(a);
        });
    });
  }, t.prototype.intersect = function() {
    for (var n = [], i = arguments.length; i--; ) n[i] = arguments[i];
    if (n.length === 0)
      return this;
    n = n.map(function(s) {
      return e(s);
    });
    var o = [];
    return this.forEach(function(s) {
      n.every(function(a) {
        return a.includes(s);
      }) || o.push(s);
    }), this.withMutations(function(s) {
      o.forEach(function(a) {
        s.remove(a);
      });
    });
  }, t.prototype.subtract = function() {
    for (var n = [], i = arguments.length; i--; ) n[i] = arguments[i];
    if (n.length === 0)
      return this;
    n = n.map(function(s) {
      return e(s);
    });
    var o = [];
    return this.forEach(function(s) {
      n.some(function(a) {
        return a.includes(s);
      }) && o.push(s);
    }), this.withMutations(function(s) {
      o.forEach(function(a) {
        s.remove(a);
      });
    });
  }, t.prototype.sort = function(n) {
    return Re(Yt(this, n));
  }, t.prototype.sortBy = function(n, i) {
    return Re(Yt(this, i, n));
  }, t.prototype.wasAltered = function() {
    return this._map.wasAltered();
  }, t.prototype.__iterate = function(n, i) {
    var o = this;
    return this._map.__iterate(function(s) {
      return n(s, s, o);
    }, i);
  }, t.prototype.__iterator = function(n, i) {
    return this._map.__iterator(n, i);
  }, t.prototype.__ensureOwner = function(n) {
    if (n === this.__ownerID)
      return this;
    var i = this._map.__ensureOwner(n);
    return n ? this.__make(i, n) : this.size === 0 ? this.__empty() : (this.__ownerID = n, this._map = i, this);
  }, t;
})(ee);
tr.isSet = Jr;
var Y = tr.prototype;
Y[mi] = true;
Y[Ae] = Y.remove;
Y.merge = Y.concat = Y.union;
Y.withMutations = ze;
Y.asImmutable = Me;
Y["@@transducer/init"] = Y.asMutable = $e;
Y["@@transducer/step"] = function(e, t) {
  return e.add(t);
};
Y["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
Y.__empty = ge;
Y.__make = Si;
function je(e, t) {
  return e.__ownerID ? (e.size = t.size, e._map = t, e) : t === e._map ? e : t.size === 0 ? e.__empty() : e.__make(t);
}
function Si(e, t) {
  var r = Object.create(Y);
  return r.size = e ? e.size : 0, r._map = e, r.__ownerID = t, r;
}
var On;
function ge() {
  return On || (On = Si(vt()));
}
function wi(e, t, r) {
  for (var n = fi(t), i = 0; i !== n.length; )
    if (e = hi(e, n[i++], A), e === A)
      return r;
  return e;
}
function bi(e, t) {
  return wi(this, e, t);
}
function Yo(e, t) {
  return wi(e, t, A) !== A;
}
function Jo(e) {
  return Yo(this, e);
}
function Oi() {
  st(this.size);
  var e = {};
  return this.__iterate(function(t, r) {
    e[r] = t;
  }), e;
}
function Ve(e) {
  if (!e || typeof e != "object")
    return e;
  if (!ct(e)) {
    if (!Tt(e))
      return e;
    e = nt(e);
  }
  if (N(e)) {
    var t = {};
    return e.__iterate(function(n, i) {
      t[i] = Ve(n);
    }), t;
  }
  var r = [];
  return e.__iterate(function(n) {
    r.push(Ve(n));
  }), r;
}
function Go(e) {
  if (e.size === 1 / 0)
    return 0;
  var t = yt(e), r = N(e), n = t ? 1 : 0;
  return e.__iterate(r ? t ? function(i, o) {
    n = 31 * n + En(ot(i), ot(o)) | 0;
  } : function(i, o) {
    n = n + En(ot(i), ot(o)) | 0;
  } : t ? function(i) {
    n = 31 * n + ot(i) | 0;
  } : function(i) {
    n = n + ot(i) | 0;
  }), Zo(e.size, n);
}
function Zo(e, t) {
  return t = le(t, 3432918353), t = le(t << 15 | t >>> -15, 461845907), t = le(t << 13 | t >>> -13, 5), t = (t + 3864292196 | 0) ^ e, t = le(t ^ t >>> 16, 2246822507), t = le(t ^ t >>> 13, 3266489909), t = Xe(t ^ t >>> 16), t;
}
function En(e, t) {
  return e ^ t + 2654435769 + (e << 6) + (e >> 2) | 0;
}
function jt(e, t) {
  var r = function(n) {
    e.prototype[n] = t[n];
  };
  return Object.keys(t).forEach(r), Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(t).forEach(r), e;
}
Z.Iterator = M;
jt(Z, {
  // ### Conversion to other types
  toArray: function() {
    st(this.size);
    var t = new Array(this.size || 0), r = N(this), n = 0;
    return this.__iterate(function(i, o) {
      t[n++] = r ? [o, i] : i;
    }), t;
  },
  toIndexedSeq: function() {
    return new Hn(this);
  },
  toJS: function() {
    return Ve(this);
  },
  toKeyedSeq: function() {
    return new Qe(this, true);
  },
  toMap: function() {
    return Lt(this.toKeyedSeq());
  },
  toObject: Oi,
  toOrderedMap: function() {
    return Et(this.toKeyedSeq());
  },
  toOrderedSet: function() {
    return Re(N(this) ? this.valueSeq() : this);
  },
  toSet: function() {
    return tr(N(this) ? this.valueSeq() : this);
  },
  toSetSeq: function() {
    return new Vn(this);
  },
  toSeq: function() {
    return pt(this) ? this.toIndexedSeq() : N(this) ? this.toKeyedSeq() : this.toSetSeq();
  },
  toStack: function() {
    return Yr(N(this) ? this.valueSeq() : this);
  },
  toList: function() {
    return Zt(N(this) ? this.valueSeq() : this);
  },
  // ### Common JavaScript methods and properties
  toString: function() {
    return "[Collection]";
  },
  __toString: function(t, r) {
    return this.size === 0 ? t + r : t + " " + this.toSeq().map(this.__toStringMapper).join(", ") + " " + r;
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  concat: function() {
    for (var t = [], r = arguments.length; r--; ) t[r] = arguments[r];
    return z(this, Oo(this, t));
  },
  includes: function(t) {
    return this.some(function(r) {
      return ut(r, t);
    });
  },
  entries: function() {
    return this.__iterator(ht);
  },
  every: function(t, r) {
    st(this.size);
    var n = true;
    return this.__iterate(function(i, o, s) {
      if (!t.call(r, i, o, s))
        return n = false, false;
    }), n;
  },
  filter: function(t, r) {
    return z(this, Zn(this, t, r, true));
  },
  partition: function(t, r) {
    return So(this, t, r);
  },
  find: function(t, r, n) {
    var i = this.findEntry(t, r);
    return i ? i[1] : n;
  },
  forEach: function(t, r) {
    return st(this.size), this.__iterate(r ? t.bind(r) : t);
  },
  join: function(t) {
    st(this.size), t = t !== void 0 ? "" + t : ",";
    var r = "", n = true;
    return this.__iterate(function(i) {
      n ? n = false : r += t, r += i != null ? i.toString() : "";
    }), r;
  },
  keys: function() {
    return this.__iterator(re);
  },
  map: function(t, r) {
    return z(this, Gn(this, t, r));
  },
  reduce: function(t, r, n) {
    return Sn(
      this,
      t,
      r,
      n,
      arguments.length < 2,
      false
    );
  },
  reduceRight: function(t, r, n) {
    return Sn(
      this,
      t,
      r,
      n,
      arguments.length < 2,
      true
    );
  },
  reverse: function() {
    return z(this, $r(this, true));
  },
  slice: function(t, r) {
    return z(this, zr(this, t, r, true));
  },
  some: function(t, r) {
    st(this.size);
    var n = false;
    return this.__iterate(function(i, o, s) {
      if (t.call(r, i, o, s))
        return n = true, false;
    }), n;
  },
  sort: function(t) {
    return z(this, Yt(this, t));
  },
  values: function() {
    return this.__iterator(ft);
  },
  // ### More sequential methods
  butLast: function() {
    return this.slice(0, -1);
  },
  isEmpty: function() {
    return this.size !== void 0 ? this.size === 0 : !this.some(function() {
      return true;
    });
  },
  count: function(t, r) {
    return Ht(
      t ? this.toSeq().filter(t, r) : this
    );
  },
  countBy: function(t, r) {
    return yo(this, t, r);
  },
  equals: function(t) {
    return yi(this, t);
  },
  entrySeq: function() {
    var t = this;
    if (t._cache)
      return new Vt(t._cache);
    var r = t.toSeq().map(Ho).toIndexedSeq();
    return r.fromEntrySeq = function() {
      return t.toSeq();
    }, r;
  },
  filterNot: function(t, r) {
    return this.filter(fr(t), r);
  },
  findEntry: function(t, r, n) {
    var i = n;
    return this.__iterate(function(o, s, a) {
      if (t.call(r, o, s, a))
        return i = [s, o], false;
    }), i;
  },
  findKey: function(t, r) {
    var n = this.findEntry(t, r);
    return n && n[0];
  },
  findLast: function(t, r, n) {
    return this.toKeyedSeq().reverse().find(t, r, n);
  },
  findLastEntry: function(t, r, n) {
    return this.toKeyedSeq().reverse().findEntry(t, r, n);
  },
  findLastKey: function(t, r) {
    return this.toKeyedSeq().reverse().findKey(t, r);
  },
  first: function(t) {
    return this.find(Pn, null, t);
  },
  flatMap: function(t, r) {
    return z(this, Eo(this, t, r));
  },
  flatten: function(t) {
    return z(this, Qn(this, t, true));
  },
  fromEntrySeq: function() {
    return new Yn(this);
  },
  get: function(t, r) {
    return this.find(function(n, i) {
      return ut(i, t);
    }, void 0, r);
  },
  getIn: bi,
  groupBy: function(t, r) {
    return mo(this, t, r);
  },
  has: function(t) {
    return this.get(t, A) !== A;
  },
  hasIn: Jo,
  isSubset: function(t) {
    return t = typeof t.includes == "function" ? t : Z(t), this.every(function(r) {
      return t.includes(r);
    });
  },
  isSuperset: function(t) {
    return t = typeof t.isSubset == "function" ? t : Z(t), t.isSubset(this);
  },
  keyOf: function(t) {
    return this.findKey(function(r) {
      return ut(r, t);
    });
  },
  keySeq: function() {
    return this.toSeq().map(Ko).toIndexedSeq();
  },
  last: function(t) {
    return this.toSeq().reverse().first(t);
  },
  lastKeyOf: function(t) {
    return this.toKeyedSeq().reverse().keyOf(t);
  },
  max: function(t) {
    return Ne(this, t);
  },
  maxBy: function(t, r) {
    return Ne(this, r, t);
  },
  min: function(t) {
    return Ne(
      this,
      t ? wn(t) : bn
    );
  },
  minBy: function(t, r) {
    return Ne(
      this,
      r ? wn(r) : bn,
      t
    );
  },
  rest: function() {
    return this.slice(1);
  },
  skip: function(t) {
    return t === 0 ? this : this.slice(Math.max(0, t));
  },
  skipLast: function(t) {
    return t === 0 ? this : this.slice(0, -Math.max(0, t));
  },
  skipWhile: function(t, r) {
    return z(this, Xn(this, t, r, true));
  },
  skipUntil: function(t, r) {
    return this.skipWhile(fr(t), r);
  },
  sortBy: function(t, r) {
    return z(this, Yt(this, r, t));
  },
  take: function(t) {
    return this.slice(0, Math.max(0, t));
  },
  takeLast: function(t) {
    return this.slice(-Math.max(0, t));
  },
  takeWhile: function(t, r) {
    return z(this, wo(this, t, r));
  },
  takeUntil: function(t, r) {
    return this.takeWhile(fr(t), r);
  },
  update: function(t) {
    return t(this);
  },
  valueSeq: function() {
    return this.toIndexedSeq();
  },
  // ### Hashable Object
  hashCode: function() {
    return this.__hash || (this.__hash = Go(this));
  }
  // ### Internal
  // abstract __iterate(fn, reverse)
  // abstract __iterator(type, reverse)
});
var X = Z.prototype;
X[Cn] = true;
X[Ye] = X.values;
X.toJSON = X.toArray;
X.__toStringMapper = be;
X.inspect = X.toSource = function() {
  return this.toString();
};
X.chain = X.flatMap;
X.contains = X.includes;
jt(dt, {
  // ### More sequential methods
  flip: function() {
    return z(this, Jn(this));
  },
  mapEntries: function(t, r) {
    var n = this, i = 0;
    return z(
      this,
      this.toSeq().map(function(o, s) {
        return t.call(r, [s, o], i++, n);
      }).fromEntrySeq()
    );
  },
  mapKeys: function(t, r) {
    var n = this;
    return z(
      this,
      this.toSeq().flip().map(function(i, o) {
        return t.call(r, i, o, n);
      }).flip()
    );
  }
});
var Te = dt.prototype;
Te[Ke] = true;
Te[Ye] = X.entries;
Te.toJSON = Oi;
Te.__toStringMapper = function(e, t) {
  return be(t) + ": " + be(e);
};
jt(Pt, {
  // ### Conversion to other types
  toKeyedSeq: function() {
    return new Qe(this, false);
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  filter: function(t, r) {
    return z(this, Zn(this, t, r, false));
  },
  findIndex: function(t, r) {
    var n = this.findEntry(t, r);
    return n ? n[0] : -1;
  },
  indexOf: function(t) {
    var r = this.keyOf(t);
    return r === void 0 ? -1 : r;
  },
  lastIndexOf: function(t) {
    var r = this.lastKeyOf(t);
    return r === void 0 ? -1 : r;
  },
  reverse: function() {
    return z(this, $r(this, false));
  },
  slice: function(t, r) {
    return z(this, zr(this, t, r, false));
  },
  splice: function(t, r) {
    var n = arguments.length;
    if (r = Math.max(r || 0, 0), n === 0 || n === 2 && !r)
      return this;
    t = ke(t, t < 0 ? this.count() : this.size);
    var i = this.slice(0, t);
    return z(
      this,
      n === 1 ? i : i.concat(_t(arguments, 2), this.slice(t + r))
    );
  },
  // ### More collection methods
  findLastIndex: function(t, r) {
    var n = this.findLastEntry(t, r);
    return n ? n[0] : -1;
  },
  first: function(t) {
    return this.get(0, t);
  },
  flatten: function(t) {
    return z(this, Qn(this, t, false));
  },
  get: function(t, r) {
    return t = $t(this, t), t < 0 || this.size === 1 / 0 || this.size !== void 0 && t > this.size ? r : this.find(function(n, i) {
      return i === t;
    }, void 0, r);
  },
  has: function(t) {
    return t = $t(this, t), t >= 0 && (this.size !== void 0 ? this.size === 1 / 0 || t < this.size : this.indexOf(t) !== -1);
  },
  interpose: function(t) {
    return z(this, Ro(this, t));
  },
  interleave: function() {
    var t = [this].concat(_t(arguments)), r = Pe(this.toSeq(), gt.of, t), n = r.flatten(true);
    return r.size && (n.size = r.size * t.length), z(this, n);
  },
  keySeq: function() {
    return Vo(0, this.size);
  },
  last: function(t) {
    return this.get(-1, t);
  },
  skipWhile: function(t, r) {
    return z(this, Xn(this, t, r, false));
  },
  zip: function() {
    var t = [this].concat(_t(arguments));
    return z(this, Pe(this, Rn, t));
  },
  zipAll: function() {
    var t = [this].concat(_t(arguments));
    return z(this, Pe(this, Rn, t, true));
  },
  zipWith: function(t) {
    var r = _t(arguments);
    return r[0] = this, z(this, Pe(this, t, r));
  }
});
var se = Pt.prototype;
se[We] = true;
se[zt] = true;
jt(ee, {
  // ### ES6 Collection methods (ES6 Array and Map)
  get: function(t, r) {
    return this.has(t) ? t : r;
  },
  includes: function(t) {
    return this.has(t);
  },
  // ### More sequential methods
  keySeq: function() {
    return this.valueSeq();
  }
});
var Qt = ee.prototype;
Qt.has = X.includes;
Qt.contains = Qt.includes;
Qt.keys = Qt.values;
jt(Dt, Te);
jt(gt, se);
jt(ie, Qt);
function Rn() {
  return _t(arguments);
}
function Ei(e) {
  return Jr(e) && yt(e);
}
var Re = /* @__PURE__ */ (function(e) {
  function t(r) {
    return r == null ? wr() : Ei(r) ? r : wr().withMutations(function(n) {
      var i = ee(r);
      st(i.size), i.forEach(function(o) {
        return n.add(o);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.fromKeys = function(n) {
    return this(dt(n).keySeq());
  }, t.prototype.toString = function() {
    return this.__toString("OrderedSet {", "}");
  }, t;
})(tr);
Re.isOrderedSet = Ei;
var Bt = Re.prototype;
Bt[zt] = true;
Bt.zip = se.zip;
Bt.zipWith = se.zipWith;
Bt.zipAll = se.zipAll;
Bt.__empty = wr;
Bt.__make = Ri;
function Ri(e, t) {
  var r = Object.create(Bt);
  return r.size = e ? e.size : 0, r._map = e, r.__ownerID = t, r;
}
var In;
function wr() {
  return In || (In = Ri(pe()));
}
function Xo(e) {
  if (Ft(e))
    throw new Error(
      "Can not call `Record` with an immutable Record as default values. Use a plain javascript object instead."
    );
  if (mt(e))
    throw new Error(
      "Can not call `Record` with an immutable Collection as default values. Use a plain javascript object instead."
    );
  if (e === null || typeof e != "object")
    throw new Error(
      "Can not call `Record` with a non-object as default values. Use a plain javascript object instead."
    );
}
var V = function(t, r) {
  var n;
  Xo(t);
  var i = function(a) {
    var u = this;
    if (a instanceof i)
      return a;
    if (!(this instanceof i))
      return new i(a);
    if (!n) {
      n = true;
      var c = Object.keys(t), f = o._indices = {};
      o._name = r, o._keys = c, o._defaultValues = t;
      for (var h = 0; h < c.length; h++) {
        var l = c[h];
        f[l] = h, o[l] ? typeof console == "object" && console.warn && console.warn(
          "Cannot define " + Zr(this) + ' with property "' + l + '" since that property name is part of the Record API.'
        ) : Qo(o, l);
      }
    }
    return this.__ownerID = void 0, this._values = Zt().withMutations(function(g) {
      g.setSize(u._keys.length), dt(a).forEach(function(p, d) {
        g.set(u._indices[d], p === u._defaultValues[d] ? void 0 : p);
      });
    }), this;
  }, o = i.prototype = Object.create(C);
  return o.constructor = i, r && (i.displayName = r), i;
};
V.prototype.toString = function() {
  for (var t = Zr(this) + " { ", r = this._keys, n, i = 0, o = r.length; i !== o; i++)
    n = r[i], t += (i ? ", " : "") + n + ": " + be(this.get(n));
  return t + " }";
};
V.prototype.equals = function(t) {
  return this === t || Ft(t) && te(this).equals(te(t));
};
V.prototype.hashCode = function() {
  return te(this).hashCode();
};
V.prototype.has = function(t) {
  return this._indices.hasOwnProperty(t);
};
V.prototype.get = function(t, r) {
  if (!this.has(t))
    return r;
  var n = this._indices[t], i = this._values.get(n);
  return i === void 0 ? this._defaultValues[t] : i;
};
V.prototype.set = function(t, r) {
  if (this.has(t)) {
    var n = this._values.set(
      this._indices[t],
      r === this._defaultValues[t] ? void 0 : r
    );
    if (n !== this._values && !this.__ownerID)
      return Gr(this, n);
  }
  return this;
};
V.prototype.remove = function(t) {
  return this.set(t);
};
V.prototype.clear = function() {
  var t = this._values.clear().setSize(this._keys.length);
  return this.__ownerID ? this : Gr(this, t);
};
V.prototype.wasAltered = function() {
  return this._values.wasAltered();
};
V.prototype.toSeq = function() {
  return te(this);
};
V.prototype.toJS = function() {
  return Ve(this);
};
V.prototype.entries = function() {
  return this.__iterator(ht);
};
V.prototype.__iterator = function(t, r) {
  return te(this).__iterator(t, r);
};
V.prototype.__iterate = function(t, r) {
  return te(this).__iterate(t, r);
};
V.prototype.__ensureOwner = function(t) {
  if (t === this.__ownerID)
    return this;
  var r = this._values.__ensureOwner(t);
  return t ? Gr(this, r, t) : (this.__ownerID = t, this._values = r, this);
};
V.isRecord = Ft;
V.getDescriptiveName = Zr;
var C = V.prototype;
C[Bn] = true;
C[Ae] = C.remove;
C.deleteIn = C.removeIn = Hr;
C.getIn = bi;
C.hasIn = X.hasIn;
C.merge = ri;
C.mergeWith = ni;
C.mergeIn = Nr;
C.mergeDeep = oi;
C.mergeDeepWith = si;
C.mergeDeepIn = qr;
C.setIn = Pr;
C.update = Fr;
C.updateIn = jr;
C.withMutations = ze;
C.asMutable = $e;
C.asImmutable = Me;
C[Ye] = C.entries;
C.toJSON = C.toObject = X.toObject;
C.inspect = C.toSource = function() {
  return this.toString();
};
function Gr(e, t, r) {
  var n = Object.create(Object.getPrototypeOf(e));
  return n._values = t, n.__ownerID = r, n;
}
function Zr(e) {
  return e.constructor.displayName || e.constructor.name || "Record";
}
function te(e) {
  return kr(e._keys.map(function(t) {
    return [t, e.get(t)];
  }));
}
function Qo(e, t) {
  try {
    Object.defineProperty(e, t, {
      get: function() {
        return this.get(t);
      },
      set: function(r) {
        ve(this.__ownerID, "Cannot set on an immutable record."), this.set(t, r);
      }
    });
  } catch {
  }
}
class Ii {
  /**
   * The doctype name
   * @public
   * @readonly
   */
  doctype;
  /**
   * Alias for doctype (for DoctypeLike interface compatibility)
   * @public
   * @readonly
   */
  get name() {
    return this.doctype;
  }
  /**
   * The doctype schema
   * @public
   * @readonly
   */
  schema;
  /**
   * The doctype workflow
   * @public
   * @readonly
   */
  workflow;
  /**
   * The doctype actions and field triggers
   * @public
   * @readonly
   */
  actions;
  /**
   * The doctype component
   * @public
   * @readonly
   */
  component;
  /**
   * Relationship links to other doctypes
   * @public
   * @readonly
   */
  links;
  /**
   * Creates a new Doctype instance
   * @param doctype - The doctype name
   * @param schema - The doctype schema definition
   * @param workflow - The doctype workflow configuration (XState machine)
   * @param actions - The doctype actions and field triggers
   * @param component - Optional Vue component for rendering the doctype
   * @param links - Optional relationship links to other doctypes
   */
  constructor(t, r, n, i, o, s) {
    this.doctype = t, this.schema = r, this.workflow = n, this.actions = i, this.component = o, this.links = s;
  }
  /**
   * Creates a Doctype instance from a plain configuration object.
   * Handles conversion of arrays to Immutable.js collections internally.
   *
   * This is the recommended way to create a Doctype from API responses
   * or configuration files, as it encapsulates the Immutable.js construction
   * that the framework uses internally.
   *
   * @param config - Plain object with doctype configuration (typically from API response)
   * @returns A new Doctype instance with Immutable.js collections
   *
   * @example
   * ```ts
   * // From an API response
   * const response = await client.getMeta({ doctype: 'plan' })
   * const doctype = Doctype.fromObject(response)
   * registry.addDoctype(doctype)
   * ```
   *
   * @example
   * ```ts
   * // From a configuration object
   * const planDoctype = Doctype.fromObject({
   *   name: 'Plan',
   *   fields: [
   *     { fieldname: 'title', label: 'Title', fieldtype: 'Data' },
   *     { fieldname: 'status', label: 'Status', fieldtype: 'Data' },
   *   ],
   *   workflow: {
   *     id: 'plan',
   *     initial: 'draft',
   *     states: { draft: {}, submitted: {} }
   *   }
   * })
   * ```
   *
   * @public
   */
  static fromObject(t) {
    const r = t.fields ? Zt(t.fields) : Zt(), n = t.actions ? Lt(t.actions) : Lt();
    return new Ii(t.name, r, t.workflow, n, void 0, t.links);
  }
  /**
   * Returns the schema as a plain array for use with components that expect
   * plain JavaScript arrays (e.g., AForm, ATable).
   *
   * @returns Array of schema fields
   *
   * @example
   * ```ts
   * const schemaArray = doctype.getSchemaArray()
   * // Use with AForm
   * <AForm :schema="schemaArray" v-model:data="formData" />
   * ```
   *
   * @public
   */
  getSchemaArray() {
    return this.schema ? this.schema.toArray() : [];
  }
  /**
   * Returns the actions as a plain object for use with components that expect
   * plain JavaScript objects.
   *
   * @returns Object mapping action names to field trigger arrays
   *
   * @public
   */
  getActionsObject() {
    return this.actions ? this.actions.toObject() : {};
  }
  /**
   * Returns the transitions available from a given workflow state, derived from the
   * doctype's workflow configuration. Supports both XState format and WorkflowMeta format.
   *
   * @param currentState - The state name to read transitions from
   * @returns Array of transition descriptors with `name` and `targetState`
   *
   * @example
   * ```ts
   * const transitions = doctype.getAvailableTransitions('draft')
   * // [{ name: 'SUBMIT', targetState: 'submitted' }]
   * ```
   *
   * @public
   */
  getAvailableTransitions(t) {
    const r = this.workflow;
    if (!r) return [];
    if (Array.isArray(r.states)) {
      if (!r.states.includes(t)) return [];
      const s = r.actions;
      return s ? Object.entries(s).filter(([, a]) => {
        const u = a.allowedStates;
        return !u || u.length === 0 ? true : u.includes(t);
      }).map(([a]) => ({
        name: a,
        // WorkflowMeta doesn't define target states - transitions are handled server-side
        targetState: t
      })) : [];
    }
    const n = r.states;
    if (!n) return [];
    const i = n[t];
    return i?.on ? Object.entries(i.on).map(([o, s]) => ({
      name: o,
      targetState: typeof s == "string" ? s : "unknown"
    })) : [];
  }
  /**
   * Returns metadata for a specific action, if available.
   * Only works with WorkflowMeta format; returns undefined for XState format.
   *
   * @param actionName - The action name to get metadata for
   * @returns Action metadata or undefined
   *
   * @example
   * ```ts
   * const actionMeta = doctype.getActionMeta('submit')
   * // { label: 'Submit', handler: 'plan:submit', allowedStates: ['draft'] }
   * ```
   *
   * @public
   */
  getActionMeta(t) {
    const r = this.workflow;
    return !r || !Array.isArray(r.states) ? void 0 : r.actions?.[t];
  }
  /**
   * Converts the registered doctype string to a slug (kebab-case). The following conversions are made:
   * - It replaces camelCase and PascalCase with kebab-case strings
   * - It replaces spaces and underscores with hyphens
   * - It converts the string to lowercase
   *
   * @returns The slugified doctype string
   *
   * @example
   * ```ts
   * const doctype = new Doctype('TaskItem', schema, workflow, actions)
   * console.log(doctype.slug) // 'task-item'
   * ```
   *
   * @public
   */
  get slug() {
    return this.doctype.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
  }
}
class me {
  /**
   * The root Registry instance
   */
  static _root;
  /**
   * The name of the Registry instance
   *
   * @defaultValue 'Registry'
   */
  name = "Registry";
  /**
   * The registry property contains a collection of doctypes
   *
   * @defaultValue `{}`
   * @see {@link Doctype}
   */
  registry = {};
  /**
   * Reverse index: backlink fieldname → list of \{ doctype slug, link fieldname \}.
   * Multiple doctypes can declare a link with the same backlink name, so each key
   * maps to an array. Built at schema load time for O(1) ancestor lookups.
   *
   * @defaultValue `new Map()`
   * @internal
   */
  _ancestorIndex = /* @__PURE__ */ new Map();
  /**
   * Whether the ancestor index needs rebuilding
   *
   * @defaultValue `true`
   * @internal
   */
  _ancestorIndexDirty = true;
  /**
   * The Vue router instance
   * @see {@link https://router.vuejs.org/}
   */
  router;
  /**
   * Creates a new Registry instance (singleton pattern)
   * @param router - Optional Vue router instance for route management
   * @param getMeta - Optional function to fetch doctype metadata from an API
   */
  constructor(t, r) {
    if (me._root)
      return me._root;
    me._root = this, this.router = t, this.getMeta = r;
  }
  /**
   * The getMeta function fetches doctype metadata from an API based on route context
   * @see {@link Doctype}
   */
  getMeta;
  /**
   * Get doctype metadata
   * @param doctype - The doctype to fetch metadata for
   * @returns The doctype metadata
   * @see {@link Doctype}
   */
  addDoctype(t) {
    t.slug in this.registry || (this.registry[t.slug] = t, this._ancestorIndexDirty = true);
    const r = bt();
    r.registerDoctypeActions(t.doctype, t.actions), t.slug !== t.doctype && r.registerDoctypeActions(t.slug, t.actions), t.component && this.router && !this.router.hasRoute(t.doctype) && this.router.addRoute({
      path: `/${t.slug}`,
      name: t.slug,
      component: t.component
    });
  }
  /**
   * Resolve nested Doctype fields in a schema by embedding child schemas inline.
   *
   * Accepts a Doctype and extracts `fields` and `links` internally.
   * Fields array contains both scalar fields and link fields (with fieldtype: 'Link').
   * Render order is determined by the order of fields in the fields array.
   *
   * For each link field:
   * - Looks up the corresponding link declaration in `links` by fieldname
   * - `cardinality: 'noneOrMany'` or `'atLeastOne'`: auto-derives `columns` from the target's schema,
   *   sets `component` to `link.component ?? 'ATable'`, `config: { view: 'list' }`.
   * - `cardinality: 'one'` or `'atMostOne'`: embeds the target schema as the entry's
   *   `schema` property, sets `component` to `link.component ?? 'AForm'`.
   *
   * Recurses for deeply nested doctypes. Circular references are protected against.
   * Returns a new array — does not mutate the original.
   *
   * @param doctype - The doctype to resolve
   * @param visited - Internal — set of already-visited doctype slugs for cycle detection
   * @returns A new schema array with nested links resolved
   *
   * @public
   */
  resolveSchema(t, r) {
    const n = r ?? /* @__PURE__ */ new Set(), i = t.slug;
    if (n.has(i))
      return t.schema ? Array.isArray(t.schema) ? t.schema : Array.from(t.schema) : [];
    n.add(i);
    const o = t.schema ? Array.isArray(t.schema) ? t.schema : Array.from(t.schema) : [], s = /* @__PURE__ */ new Map();
    if (t.links)
      for (const [u, c] of Object.entries(t.links)) {
        const f = c.fieldname ?? u;
        s.set(f, c);
      }
    const a = [];
    for (const u of o)
      if ("fieldtype" in u && u.fieldtype === "Link") {
        const c = s.get(u.fieldname);
        if (!c) {
          const S = typeof u.options == "string" ? u.options : void 0;
          S === void 0 && console.warn(
            `[Stonecrop] Link field "${u.fieldname}" has no \`options\` or corresponding \`links\` declaration. AFormLink will be created without a \`doctype\` prop, so navigation will not work. Add \`"options": "<doctype-slug>"\` to the field definition.`
          );
          const { doctype: R, ...b } = u;
          a.push({
            ...b,
            component: b.component || "AFormLink",
            ...S !== void 0 ? { doctype: S } : {}
          });
          continue;
        }
        const f = this.registry[c.target];
        if (!f) {
          a.push({ ...u });
          continue;
        }
        const h = this.resolveSchema(f, n), {
          fieldtype: l,
          options: g,
          cardinality: p,
          ...d
        } = u;
        c.cardinality === "noneOrMany" || c.cardinality === "atLeastOne" ? a.push(
          this.buildTableConfig(
            { ...d, label: d.label || u.fieldname },
            h,
            c.component
          )
        ) : a.push({
          ...d,
          label: d.label || u.fieldname,
          component: c.component || d.component || "AForm",
          schema: h
        });
      } else if ("schema" in u && Array.isArray(u.schema)) {
        const c = this.resolveFields(u.schema, s, n);
        a.push({ ...u, schema: c });
      } else
        a.push({ ...u });
    return n.delete(i), a;
  }
  /**
   * Recursively resolve a flat fields array using the provided link context.
   * Used by resolveSchema to handle fieldset children.
   * @internal
   */
  resolveFields(t, r, n) {
    const i = [];
    for (const o of t)
      if ("fieldtype" in o && o.fieldtype === "Link") {
        const s = r.get(o.fieldname);
        if (!s) {
          i.push({ ...o });
          continue;
        }
        const a = this.registry[s.target];
        if (!a) {
          i.push({ ...o });
          continue;
        }
        const u = this.resolveSchema(a, new Set(n)), {
          fieldtype: c,
          options: f,
          cardinality: h,
          ...l
        } = o;
        s.cardinality === "noneOrMany" || s.cardinality === "atLeastOne" ? i.push(
          this.buildTableConfig(
            { ...l, label: l.label || o.fieldname },
            u,
            s.component
          )
        ) : i.push({
          ...l,
          label: l.label || o.fieldname,
          component: s.component || l.component || "AForm",
          schema: u
        });
      } else "schema" in o && Array.isArray(o.schema) ? i.push({ ...o, schema: this.resolveFields(o.schema, r, n) }) : i.push({ ...o });
    return i;
  }
  /**
   * Build an ATable configuration from a field and child schema.
   * Data-model properties from the source field are preserved via the spread `field` argument.
   * @internal
   */
  buildTableConfig(t, r, n) {
    const i = {
      ...t,
      fieldname: t.fieldname,
      component: n || t.component || "ATable",
      kind: "table",
      schema: r,
      config: t.config
    };
    return i.config || (i.config = { view: "list" }), i;
  }
  /**
   * Initialize a new record with default values based on a schema.
   *
   * @remarks
   * Creates a plain object with keys from the schema's fieldnames and default values
   * derived from each field's `fieldtype`:
   * - Data, Text → `''`
   * - Check → `false`
   * - Int, Float, Decimal, Currency, Quantity → `0`
   * - JSON → `{}`
   * - Doctype with `cardinality: 'noneOrMany'` or `'atLeastOne'` → `[]`
   * - Doctype without `cardinality` or `cardinality: 'one'` → recursively initializes nested record
   * - All others → `null`
   *
   * For Doctype fields with a resolved `schema` array (cardinality: 'one'), recursively
   * initializes the nested record.
   *
   * @param schema - The schema array to derive defaults from
   * @returns A plain object with default values for each field
   *
   * @example
   * ```ts
   * const defaults = registry.initializeRecord(addressSchema)
   * // { street: '', city: '', state: '', zip_code: '' }
   * ```
   *
   * @public
   */
  initializeRecord(t) {
    const r = {};
    return t.forEach((n) => {
      const i = "fieldtype" in n ? n.fieldtype : "Data", o = "cardinality" in n ? n.cardinality : void 0;
      if (o === "noneOrMany" || o === "atLeastOne") {
        r[n.fieldname] = [];
        return;
      }
      if ("kind" in n && n.kind === "table") {
        r[n.fieldname] = [];
        return;
      }
      if ("schema" in n && Array.isArray(n.schema)) {
        r[n.fieldname] = this.initializeRecord(n.schema);
        return;
      }
      switch (i) {
        case "Data":
        case "Text":
        case "Code":
          r[n.fieldname] = "";
          break;
        case "Check":
          r[n.fieldname] = false;
          break;
        case "Int":
        case "Float":
        case "Decimal":
        case "Currency":
        case "Quantity":
          r[n.fieldname] = 0;
          break;
        case "JSON":
          r[n.fieldname] = {};
          break;
        default:
          r[n.fieldname] = null;
      }
    }), r;
  }
  /**
   * Get a registered doctype by slug
   * @param slug - The doctype slug to look up
   * @returns The Doctype instance if found, or undefined
   * @public
   */
  getDoctype(t) {
    return this.registry[t];
  }
  /**
   * Get all links declared on a doctype.
   *
   * @param doctypeSlug - The doctype slug to get links for
   * @returns Array of link declarations with fieldname, or empty array if none
   *
   * @example
   * ```ts
   * const links = registry.getDescendantLinks('recipe')
   * // [{ fieldname: 'tasks', target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' }]
   * ```
   *
   * @public
   */
  getDescendantLinks(t) {
    const r = this.registry[t];
    return r?.links ? Object.entries(r.links).map(([n, i]) => ({
      ...i,
      fieldname: n
    })) : [];
  }
  /**
   * Get links on other doctypes that target the given doctype.
   *
   * @param doctypeSlug - The doctype slug to find ancestor links for
   * @returns Array of link declarations with fieldname and declaring doctype slug, or empty array
   *
   * @example
   * ```ts
   * const ancestors = registry.getAncestorLinks('recipe-task')
   * // [{ fieldname: 'tasks', target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe', doctype: 'recipe' }]
   * ```
   *
   * @public
   */
  getAncestorLinks(t) {
    this._ensureAncestorIndex();
    const r = [];
    for (const [n, i] of this._ancestorIndex)
      for (const { slug: o, fieldname: s } of i) {
        const a = this.registry[o];
        if (!a?.links) continue;
        const u = a.links[s];
        u?.target === t && r.push({
          ...u,
          fieldname: s,
          doctype: o
        });
      }
    return r;
  }
  /**
   * Ensure the ancestor index is up to date
   * @internal
   */
  _ensureAncestorIndex() {
    if (this._ancestorIndexDirty) {
      this._ancestorIndexDirty = false, this._ancestorIndex.clear();
      for (const [t, r] of Object.entries(this.registry))
        if (r.links) {
          for (const [n, i] of Object.entries(r.links))
            if (i.backlink) {
              const o = this._ancestorIndex.get(i.backlink);
              o ? o.push({ slug: t, fieldname: n }) : this._ancestorIndex.set(i.backlink, [{ slug: t, fieldname: n }]);
            }
        }
    }
  }
  // TODO: should we allow clearing the registry at all?
  // clear() {
  // 	this.registry = {}
  // 	if (this.router) {
  // 		const routes = this.router.getRoutes()
  // 		for (const route of routes) {
  // 			if (route.name) {
  // 				this.router.removeRoute(route.name)
  // 			}
  // 		}
  // 	}
  // }
}
export {
  At as A,
  Ii as I,
  me as m
};
