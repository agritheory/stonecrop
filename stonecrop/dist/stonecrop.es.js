import { shallowRef, unref, computed, reactive, nextTick, defineComponent, inject, h, provide, ref, watch } from "vue";
const ENVIRONMENT$1 = (() => {
  let env;
  try {
    env = "production";
  } catch (_a) {
    env = "development";
  }
  return env;
})();
const IS_PROXY = Symbol("IS_PROXY");
const PATH = Symbol("PATH");
const VALUE = Symbol("VALUE");
const PROXY_TREE = Symbol("PROXY_TREE");
const isPlainObject = (value) => {
  return String(value) === "[object Object]" && value.constructor.name === "Object";
};
const arrayMutations = /* @__PURE__ */ new Set([
  "push",
  "shift",
  "pop",
  "unshift",
  "splice",
  "reverse",
  "sort",
  "copyWithin"
]);
const getValue = (proxyOrValue) => proxyOrValue && proxyOrValue[IS_PROXY] ? proxyOrValue[VALUE] : proxyOrValue;
const isClass = (value) => typeof value === "object" && value !== null && !Array.isArray(value) && value.constructor.name !== "Object" && Object.isExtensible(value);
const shouldProxy = (value) => {
  return value !== void 0 && (!isClass(value) || isClass(value) && !(value instanceof Date) && !(value instanceof Map) && !(value instanceof Set));
};
class Proxifier {
  constructor(tree) {
    this.tree = tree;
    this.CACHED_PROXY = Symbol("CACHED_PROXY");
    this.delimiter = tree.master.options.delimiter;
    this.ssr = Boolean(tree.master.options.ssr);
  }
  concat(path, prop) {
    return path ? path + this.delimiter + prop : prop;
  }
  ensureMutationTrackingIsEnabled(path) {
    if (ENVIRONMENT$1 === "production")
      return;
    if (this.tree.master.options.devmode && !this.tree.canMutate()) {
      throw new Error(`proxy-state-tree - You are mutating the path "${path}", but it is not allowed. The following could have happened:
        
        - The mutation is explicitly being blocket
        - You are passing state to a 3rd party tool trying to manipulate the state
        - You are running asynchronous code and forgot to "await" its execution
        `);
    }
  }
  isDefaultProxifier() {
    return this.tree.proxifier === this.tree.master.proxifier;
  }
  ensureValueDosntExistInStateTreeElsewhere(value) {
    if (ENVIRONMENT$1 === "production")
      return;
    if (value && value[IS_PROXY] === true) {
      throw new Error(`proxy-state-tree - You are trying to insert a value that already exists in the state tree on path "${value[PATH]}"`);
    }
    return value;
  }
  trackPath(path) {
    if (!this.tree.canTrack()) {
      return;
    }
    if (this.isDefaultProxifier()) {
      const trackStateTree = this.tree.master.currentTree;
      if (!trackStateTree) {
        return;
      }
      trackStateTree.addTrackingPath(path);
    } else {
      this.tree.addTrackingPath(path);
    }
  }
  getTrackingTree() {
    if (this.tree.master.currentTree && this.isDefaultProxifier()) {
      return this.tree.master.currentTree;
    }
    if (!this.tree.canTrack()) {
      return null;
    }
    if (this.tree.canTrack()) {
      return this.tree;
    }
    return null;
  }
  getMutationTree() {
    return this.tree.master.mutationTree || this.tree;
  }
  isProxyCached(value, path) {
    return value[this.CACHED_PROXY] && String(value[this.CACHED_PROXY][PATH]) === String(path);
  }
  createArrayProxy(value, path) {
    if (!this.ssr && this.isProxyCached(value, path)) {
      return value[this.CACHED_PROXY];
    }
    const proxifier = this;
    const proxy = new Proxy(value, {
      get(target, prop) {
        if (prop === IS_PROXY)
          return true;
        if (prop === PATH)
          return path;
        if (prop === VALUE)
          return value;
        if (prop === "indexOf") {
          return (searchTerm, offset) => value.indexOf(getValue(searchTerm), getValue(offset));
        }
        if (prop === "length" || typeof target[prop] === "function" && !arrayMutations.has(String(prop)) || typeof prop === "symbol") {
          return target[prop];
        }
        const trackingTree = proxifier.getTrackingTree();
        const nestedPath = proxifier.concat(path, prop);
        const currentTree = trackingTree || proxifier.tree;
        trackingTree && trackingTree.proxifier.trackPath(nestedPath);
        currentTree.trackPathListeners.forEach((cb) => cb(nestedPath));
        const method = String(prop);
        if (arrayMutations.has(method)) {
          return (...args) => {
            const mutationTree = proxifier.getMutationTree();
            let result;
            if (ENVIRONMENT$1 === "production") {
              result = target[prop](...args);
            } else {
              result = target[prop](...args.map((arg) => /* @__PURE__ */ proxifier.ensureValueDosntExistInStateTreeElsewhere(arg)));
            }
            mutationTree.addMutation({
              method,
              path,
              delimiter: proxifier.delimiter,
              args,
              hasChangedValue: true
            });
            return result;
          };
        }
        if (shouldProxy(target[prop])) {
          return proxifier.proxify(target[prop], nestedPath);
        }
        return target[prop];
      },
      set(target, prop, value2) {
        const nestedPath = proxifier.concat(path, prop);
        const mutationTree = proxifier.getMutationTree();
        const result = Reflect.set(target, prop, value2);
        mutationTree.addMutation({
          method: "set",
          path: nestedPath,
          args: [value2],
          delimiter: proxifier.delimiter,
          hasChangedValue: true
        });
        return result;
      }
    });
    if (!this.ssr) {
      Object.defineProperty(value, this.CACHED_PROXY, {
        value: proxy,
        configurable: true
      });
    }
    return proxy;
  }
  createObjectProxy(object, path) {
    if (!this.ssr && this.isProxyCached(object, path)) {
      return object[this.CACHED_PROXY];
    }
    const proxifier = this;
    const proxy = new Proxy(object, {
      get(target, prop) {
        if (prop === IS_PROXY)
          return true;
        if (prop === PATH)
          return path;
        if (prop === VALUE)
          return object;
        if (prop === PROXY_TREE)
          return proxifier.tree;
        if (typeof prop === "symbol" || prop in Object.prototype)
          return target[prop];
        const descriptor = Object.getOwnPropertyDescriptor(target, prop) || Object.getPrototypeOf(target) && Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), prop);
        if (descriptor && "get" in descriptor) {
          const value = descriptor.get.call(proxy);
          if (proxifier.tree.master.options.devmode && proxifier.tree.master.options.onGetter) {
            proxifier.tree.master.options.onGetter(proxifier.concat(path, prop), value);
          }
          return value;
        }
        const trackingTree = proxifier.getTrackingTree();
        const targetValue = target[prop];
        const nestedPath = proxifier.concat(path, prop);
        const currentTree = trackingTree || proxifier.tree;
        if (typeof targetValue === "function") {
          if (proxifier.tree.master.options.onGetFunction) {
            return proxifier.tree.master.options.onGetFunction(trackingTree || proxifier.tree, nestedPath, target, prop);
          }
          return isClass(target) ? targetValue : targetValue.call(target, proxifier.tree, nestedPath);
        } else {
          currentTree.trackPathListeners.forEach((cb) => cb(nestedPath));
          trackingTree && trackingTree.proxifier.trackPath(nestedPath);
        }
        if (shouldProxy(targetValue)) {
          return proxifier.proxify(targetValue, nestedPath);
        }
        return targetValue;
      },
      set(target, prop, value) {
        const nestedPath = proxifier.concat(path, prop);
        let objectChangePath;
        if (!(prop in target)) {
          objectChangePath = path;
        }
        const mutationTree = proxifier.getMutationTree();
        const existingValue = target[prop];
        if (typeof value === "function" && proxifier.tree.master.options.onSetFunction) {
          value = proxifier.tree.master.options.onSetFunction(proxifier.getTrackingTree() || proxifier.tree, nestedPath, target, prop, value);
        }
        const hasChangedValue = existingValue !== value;
        const result = Reflect.set(target, prop, value);
        mutationTree.addMutation({
          method: "set",
          path: nestedPath,
          args: [value],
          delimiter: proxifier.delimiter,
          hasChangedValue
        }, objectChangePath);
        return result;
      },
      deleteProperty(target, prop) {
        const nestedPath = proxifier.concat(path, prop);
        let objectChangePath;
        if (prop in target) {
          objectChangePath = path;
        }
        const mutationTree = proxifier.getMutationTree();
        delete target[prop];
        mutationTree.addMutation({
          method: "unset",
          path: nestedPath,
          args: [],
          delimiter: proxifier.delimiter,
          hasChangedValue: true
        }, objectChangePath);
        return true;
      }
    });
    if (!this.ssr) {
      Object.defineProperty(object, this.CACHED_PROXY, {
        value: proxy,
        configurable: true
      });
    }
    return proxy;
  }
  proxify(value, path) {
    if (value) {
      const isUnmatchingProxy = value[IS_PROXY] && (String(value[PATH]) !== String(path) || value[VALUE][this.CACHED_PROXY] !== value);
      if (isUnmatchingProxy) {
        return this.proxify(value[VALUE], path);
      } else if (value[IS_PROXY]) {
        return value;
      } else if (Array.isArray(value)) {
        return this.createArrayProxy(value, path);
      } else if (isPlainObject(value) || isClass(value)) {
        return this.createObjectProxy(value, path);
      }
    }
    return value;
  }
}
class MutationTree {
  constructor(master, proxifier) {
    this.mutationCallbacks = [];
    this.mutations = [];
    this.objectChanges = /* @__PURE__ */ new Set();
    this.isTracking = false;
    this.isBlocking = false;
    this.trackPathListeners = [];
    this.isTracking = true;
    this.master = master;
    this.proxifier = proxifier || new Proxifier(this);
    this.state = this.proxifier.proxify(master.sourceState, "");
  }
  trackPaths() {
    const paths = /* @__PURE__ */ new Set();
    const listener = (path) => {
      paths.add(path);
    };
    this.trackPathListeners.push(listener);
    return () => {
      this.trackPathListeners.splice(this.trackPathListeners.indexOf(listener), 1);
      return paths;
    };
  }
  getMutations() {
    const mutations = this.mutations.slice();
    this.mutations.length = 0;
    return mutations;
  }
  getObjectChanges() {
    const objectChanges = /* @__PURE__ */ new Set([...this.objectChanges]);
    this.objectChanges.clear();
    return objectChanges;
  }
  addMutation(mutation, objectChangePath) {
    const currentFlushId = this.master.currentFlushId;
    this.mutations.push(mutation);
    if (objectChangePath) {
      this.objectChanges.add(objectChangePath);
    }
    for (const cb of this.master.mutationCallbacks) {
      cb(mutation, new Set(objectChangePath ? [mutation.path, objectChangePath] : [mutation.path]), currentFlushId);
    }
    for (const callback of this.mutationCallbacks) {
      callback(mutation, new Set(objectChangePath ? [mutation.path, objectChangePath] : [mutation.path]), currentFlushId);
    }
  }
  flush(isAsync = false) {
    return this.master.flush(this, isAsync);
  }
  onMutation(callback) {
    this.mutationCallbacks.push(callback);
  }
  canMutate() {
    return this.isTracking && !this.isBlocking;
  }
  canTrack() {
    return false;
  }
  blockMutations() {
    this.isBlocking = true;
  }
  enableMutations() {
    this.isBlocking = false;
  }
  dispose() {
    this.isTracking = false;
    this.mutationCallbacks.length = 0;
    this.proxifier = this.master.proxifier;
    return this;
  }
}
class TrackStateTree {
  constructor(master) {
    this.pathDependencies = /* @__PURE__ */ new Set();
    this.shouldTrack = false;
    this.trackPathListeners = [];
    this.master = master;
    this.proxifier = master.proxifier;
    this.state = master.state;
  }
  trackPaths() {
    const paths = /* @__PURE__ */ new Set();
    const listener = (path) => {
      paths.add(path);
    };
    this.trackPathListeners.push(listener);
    return () => {
      this.trackPathListeners.splice(this.trackPathListeners.indexOf(listener), 1);
      return paths;
    };
  }
  canMutate() {
    return false;
  }
  canTrack() {
    return true;
  }
  addTrackingPath(path) {
    if (!this.shouldTrack) {
      return;
    }
    this.pathDependencies.add(path);
    if (this.callback) {
      this.master.addPathDependency(path, this.callback);
    }
  }
  track(cb) {
    this.master.changeTrackStateTree(this);
    this.shouldTrack = true;
    this.clearTracking();
    if (cb) {
      this.callback = (...args) => {
        if (!this.callback) {
          return;
        }
        cb(...args);
      };
    }
    return this;
  }
  clearTracking() {
    if (this.callback) {
      for (const path of this.pathDependencies) {
        this.master.removePathDependency(path, this.callback);
      }
    }
    this.pathDependencies.clear();
  }
  stopTracking() {
    this.shouldTrack = false;
  }
  trackScope(scope, cb) {
    const previousPreviousTree = this.master.previousTree;
    const previousCurrentTree = this.master.currentTree;
    this.master.currentTree = this;
    this.track(cb);
    const result = scope(this);
    this.master.currentTree = previousCurrentTree;
    this.master.previousTree = previousPreviousTree;
    this.stopTracking();
    return result;
  }
  dispose() {
    if (!this.callback) {
      this.pathDependencies.clear();
      return this;
    }
    this.clearTracking();
    this.callback = null;
    this.proxifier = this.master.proxifier;
    if (this.master.currentTree === this) {
      this.master.currentTree = null;
    }
    return this;
  }
}
class ProxyStateTree {
  constructor(state, options = {}) {
    this.cache = {
      mutationTree: [],
      trackStateTree: []
    };
    this.flushCallbacks = [];
    this.mutationCallbacks = [];
    this.currentFlushId = 0;
    this.pathDependencies = {};
    if (typeof options.devmode === "undefined") {
      options.devmode = true;
    }
    if (!options.delimiter) {
      options.delimiter = ".";
    }
    this.master = this;
    this.sourceState = state;
    this.options = options;
    this.createTrackStateProxifier();
  }
  createTrackStateProxifier() {
    const trackStateTree = new TrackStateTree(this);
    this.proxifier = trackStateTree.proxifier = new Proxifier(trackStateTree);
    this.state = trackStateTree.state = this.proxifier.proxify(this.sourceState, "");
  }
  getMutationTree() {
    if (!this.options.devmode) {
      return this.mutationTree = this.mutationTree || new MutationTree(this, this.proxifier);
    }
    const tree = this.cache.mutationTree.pop() || new MutationTree(this);
    return tree;
  }
  getTrackStateTree() {
    return this.cache.trackStateTree.pop() || new TrackStateTree(this);
  }
  getTrackStateTreeWithProxifier() {
    const tree = this.getTrackStateTree();
    if (this.options.ssr) {
      tree.state = this.sourceState;
    } else {
      tree.proxifier = new Proxifier(tree);
      tree.state = tree.proxifier.proxify(this.sourceState, "");
    }
    return tree;
  }
  changeTrackStateTree(tree) {
    this.previousTree = this.currentTree;
    this.currentTree = tree;
  }
  disposeTree(tree) {
    if (tree instanceof MutationTree) {
      this.cache.mutationTree.push(tree.dispose());
    } else if (tree instanceof TrackStateTree) {
      this.cache.trackStateTree.push(tree.dispose());
    }
  }
  onMutation(callback) {
    this.mutationCallbacks.push(callback);
    return () => {
      this.mutationCallbacks.splice(this.mutationCallbacks.indexOf(callback), 1);
    };
  }
  forceFlush() {
    const emptyMutations = [];
    const emptyPaths = [];
    for (const key in this.pathDependencies) {
      const callbacks = this.pathDependencies[key];
      callbacks.forEach((callback) => {
        callback(emptyMutations, emptyPaths, this.currentFlushId++, false);
      });
    }
  }
  flush(trees, isAsync = false) {
    let changes;
    if (Array.isArray(trees)) {
      changes = trees.reduce((aggr, tree) => ({
        mutations: aggr.mutations.concat(tree.getMutations()),
        objectChanges: /* @__PURE__ */ new Set([
          ...aggr.objectChanges,
          ...tree.getObjectChanges()
        ])
      }), {
        mutations: [],
        objectChanges: /* @__PURE__ */ new Set()
      });
    } else {
      changes = {
        mutations: trees.getMutations(),
        objectChanges: trees.getObjectChanges()
      };
    }
    if (!changes.mutations.length && !changes.objectChanges.size) {
      return {
        mutations: [],
        flushId: null
      };
    }
    const paths = /* @__PURE__ */ new Set();
    const pathCallbacksToCall = /* @__PURE__ */ new Set();
    const flushId = this.currentFlushId++;
    for (const objectChange of changes.objectChanges) {
      if (this.pathDependencies[objectChange]) {
        paths.add(objectChange);
      }
    }
    for (const mutation of changes.mutations) {
      if (mutation.hasChangedValue) {
        paths.add(mutation.path);
      }
    }
    const sortedPaths = Array.from(paths).sort();
    for (const path of sortedPaths) {
      if (this.pathDependencies[path]) {
        for (const callback of this.pathDependencies[path]) {
          pathCallbacksToCall.add(callback);
        }
      }
    }
    for (const callback of pathCallbacksToCall) {
      callback(changes.mutations, sortedPaths, flushId, isAsync);
    }
    const flushCallbacks = this.flushCallbacks.slice();
    for (const callback of flushCallbacks) {
      if (this.flushCallbacks.includes(callback)) {
        callback(changes.mutations, sortedPaths, flushId, isAsync);
      }
    }
    paths.clear();
    pathCallbacksToCall.clear();
    return {
      mutations: changes.mutations,
      flushId
    };
  }
  onFlush(callback) {
    this.flushCallbacks.push(callback);
    return () => this.flushCallbacks.splice(this.flushCallbacks.indexOf(callback), 1);
  }
  rescope(value, tree) {
    return value && value[IS_PROXY] ? tree.proxifier.proxify(value[VALUE], value[PATH]) : value;
  }
  addPathDependency(path, callback) {
    if (!this.pathDependencies[path]) {
      this.pathDependencies[path] = /* @__PURE__ */ new Set();
    }
    this.pathDependencies[path].add(callback);
  }
  removePathDependency(path, callback) {
    this.pathDependencies[path].delete(callback);
    if (!this.pathDependencies[path].size) {
      delete this.pathDependencies[path];
    }
  }
  toJSON() {
    return this.sourceState;
  }
}
var EventType;
(function(EventType2) {
  EventType2["ACTION_START"] = "action:start";
  EventType2["ACTION_END"] = "action:end";
  EventType2["OPERATOR_START"] = "operator:start";
  EventType2["OPERATOR_END"] = "operator:end";
  EventType2["OPERATOR_ASYNC"] = "operator:async";
  EventType2["MUTATIONS"] = "mutations";
  EventType2["EFFECT"] = "effect";
  EventType2["DERIVED"] = "derived";
  EventType2["DERIVED_DIRTY"] = "derived:dirty";
  EventType2["COMPONENT_ADD"] = "component:add";
  EventType2["COMPONENT_UPDATE"] = "component:update";
  EventType2["COMPONENT_REMOVE"] = "component:remove";
  EventType2["GETTER"] = "getter";
})(EventType || (EventType = {}));
const IS_DERIVED = Symbol("IS_DERIVED");
const IS_DERIVED_CONSTRUCTOR = Symbol("IS_DERIVED_CONSTRUCTOR");
class Derived {
  constructor(cb) {
    this.cb = cb;
    this.isDirty = true;
    this.updateCount = 0;
    const boundEvaluate = this.evaluate.bind(this);
    boundEvaluate[IS_DERIVED] = true;
    return boundEvaluate;
  }
  runScope(tree, path) {
    const parent = path.slice(0, path.length - 1).reduce((curr, key) => curr[key], tree.state);
    return this.cb(parent, tree.state);
  }
  evaluate(eventHub, tree, proxyStateTree, path) {
    if (!this.disposeOnMutation) {
      this.disposeOnMutation = proxyStateTree.onMutation((_, paths, flushId) => {
        if (typeof path.reduce((aggr, key) => aggr && aggr[key], proxyStateTree.sourceState) !== "function") {
          this.disposeOnMutation();
          return;
        }
        if (this.isDirty) {
          return;
        }
        for (const mutationPath of paths) {
          if (this.paths.has(mutationPath)) {
            this.isDirty = true;
            eventHub.emitAsync(EventType.DERIVED_DIRTY, {
              derivedPath: path,
              path: mutationPath,
              flushId
            });
            return;
          }
        }
      });
    }
    if (this.isDirty || this.previousProxifier !== tree.proxifier) {
      const getPaths = tree.trackPaths();
      this.value = this.runScope(tree, path);
      this.isDirty = false;
      this.paths = getPaths();
    }
    if (tree instanceof TrackStateTree) {
      for (const path2 of this.paths) {
        tree.addTrackingPath(path2);
        tree.trackPathListeners.forEach((cb) => cb(path2));
      }
    }
    this.previousProxifier = tree.proxifier;
    if (this.value && this.value[IS_PROXY]) {
      return proxyStateTree.rescope(this.value, tree);
    }
    return this.value;
  }
}
var EventEmitter = function() {
  function EventEmitter2() {
    this.events = /* @__PURE__ */ new Map();
  }
  EventEmitter2.prototype.emit = function(event, msg) {
    var listeners = this.events.get(event) || [];
    for (var i = listeners.length - 1; i >= 0; i--) {
      var listener = listeners[i];
      listener.cb(msg);
      if (listener.once) {
        listeners.splice(i, 1);
      }
    }
  };
  EventEmitter2.prototype.emitAsync = function(event, msg) {
    var listeners = this.events.get(event) || [];
    setTimeout(function() {
      for (var i = listeners.length - 1; i >= 0; i--) {
        var listener = listeners[i];
        listener.cb(msg);
        if (listener.once) {
          listeners.splice(i, 1);
        }
      }
    });
  };
  EventEmitter2.prototype.on = function(event, cb) {
    this.addListener(event, cb, false);
  };
  EventEmitter2.prototype.once = function(event, cb) {
    this.addListener(event, cb, true);
  };
  EventEmitter2.prototype.addListener = function(event, cb, once) {
    var listeners = this.events.get(event) || [];
    listeners.push({
      once,
      cb
    });
    this.events.set(event, listeners);
  };
  return EventEmitter2;
}();
var toString = Object.prototype.toString;
var isPlainObj = function(x) {
  var prototype;
  return toString.call(x) === "[object Object]" && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function rehydrateState(target, source, classes = {}) {
  if (!target || !source) {
    throw new Error(`You have to pass a "target" and "source" object to rehydrate`);
  }
  Object.keys(source).forEach((key) => {
    const value = source[key];
    const classInstance = classes[key];
    if (typeof classInstance === "function" && Array.isArray(target[key])) {
      target[key] = source[key].map((value2) => classInstance(value2));
    } else if (typeof classInstance === "function" && typeof target[key] === "object" && target[key] !== null && target[key].constructor.name === "Object") {
      target[key] = Object.keys(source[key]).reduce((aggr, subKey) => {
        aggr[subKey] = classInstance(source[key][subKey]);
        return aggr;
      }, {});
    } else if (typeof classInstance === "function") {
      target[key] = classInstance(source[key]);
    } else if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      if (!target[key])
        target[key] = {};
      rehydrateState(target[key], source[key], classes[key]);
    } else {
      target[key] = source[key];
    }
  });
}
const SERIALIZE = Symbol("SERIALIZE");
const rehydrate = (state, source, classes = {}) => {
  if (Array.isArray(source)) {
    const mutations = source;
    mutations.forEach((mutation) => {
      const pathArray = mutation.path.split(mutation.delimiter);
      const key = pathArray.pop();
      const target = pathArray.reduce((aggr, key2) => aggr[key2], state);
      const classInstance = pathArray.reduce((aggr, key2) => aggr && aggr[key2], classes);
      if (mutation.method === "set") {
        if (typeof classInstance === "function" && Array.isArray(mutation.args[0])) {
          target[key] = mutation.args[0].map((arg) => classInstance(arg));
        } else if (typeof classInstance === "function") {
          target[key] = classInstance(mutation.args[0]);
        } else {
          target[key] = mutation.args[0];
        }
      } else if (mutation.method === "unset") {
        delete target[key];
      } else {
        target[key][mutation.method].apply(target[key], typeof classInstance === "function" ? mutation.args.map((arg) => {
          return typeof arg === "object" && arg !== null ? classInstance(arg) : arg;
        }) : mutation.args);
      }
    });
  } else {
    rehydrateState(state, source, classes);
  }
};
class Devtools {
  constructor(name) {
    this.safeClassNames = /* @__PURE__ */ new Set();
    this.unsafeClassNames = /* @__PURE__ */ new Set();
    this.circularReferenceCache = [];
    this.buffer = [];
    this.serializer = Promise.resolve();
    this.isConnected = false;
    this.doReconnect = false;
    this.hasWarnedReconnect = false;
    this.reconnectInterval = 1e4;
    this.connect = (host, onMessage) => {
      host = host || "localhost:3031";
      this.ws = new WebSocket(`ws://${host}?name=${this.name}`);
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.appName !== this.name) {
          return;
        }
        onMessage(data);
      };
      this.ws.onopen = () => {
        this.isConnected = true;
        this.flushBuffer();
      };
      this.ws.onerror = () => {
        console.error(`OVERMIND DEVTOOLS: Not able to connect. You are trying to connect to "${host}", but there was no devtool there. Try the following:
        
          - Make sure you are running the latest version of the devtools, using "npx overmind-devtools@latest" or install latest extension for VSCode
          - Close the current tab and open a new one
          - Make sure the correct port is configured in the devtools
        `);
      };
      this.ws.onclose = () => {
        this.isConnected = false;
        if (this.doReconnect && !this.hasWarnedReconnect) {
          console.warn("Debugger application is not running on selected port... will reconnect automatically behind the scenes");
          this.hasWarnedReconnect = true;
        }
        if (this.doReconnect) {
          this.reconnect(host, onMessage);
        }
      };
    };
    this.sendMessage = (payload) => {
      if (!this.isConnected) {
        this.buffer.push(payload);
        return;
      }
      this.ws.send(`{"appName":"${this.name}","message":${payload}}`);
    };
    this.flushBuffer = () => __awaiter(this, void 0, void 0, function* () {
      this.buffer.forEach((payload) => {
        this.sendMessage(payload);
      });
      this.buffer.length = 0;
    });
    this.name = typeof location !== "undefined" && location.search.includes("OVERMIND_DEVTOOL") ? name + " (Overmind Devtool)" : name;
  }
  reconnect(host, onMessage) {
    setTimeout(() => this.connect(host, onMessage), this.reconnectInterval);
  }
  send(message) {
    const safeClassNames = this.safeClassNames;
    const unsafeClassNames = this.unsafeClassNames;
    const circularReferenceCache = this.circularReferenceCache;
    this.sendMessage(JSON.stringify(message, function(_, value) {
      if (typeof value === "function") {
        return "[Function]";
      }
      if (this.__CLASS__) {
        return value;
      }
      if (value && value[SERIALIZE]) {
        return {
          __CLASS__: true,
          name: value.constructor.name,
          value
        };
      }
      if (typeof value === "object" && value !== null && !Array.isArray(value) && value.constructor && value.constructor.name !== "Object") {
        if (circularReferenceCache.includes(value)) {
          return `[CIRCULAR REFERENCE: ${value.constructor.name}]`;
        }
        circularReferenceCache.push(value);
        if (!safeClassNames.has(value.constructor.name) && !unsafeClassNames.has(value.constructor.name)) {
          try {
            JSON.stringify(value);
            safeClassNames.add(value.constructor.name);
          } catch (_a) {
            unsafeClassNames.add(value.constructor.name);
          }
        }
        if (safeClassNames.has(value.constructor.name)) {
          return {
            __CLASS__: true,
            name: value.constructor.name,
            value
          };
        } else {
          return `[${value.constructor.name || "NOT SERIALIZABLE"}]`;
        }
      }
      return value;
    }));
    circularReferenceCache.length = 0;
  }
}
function isObject(value) {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}
let hasWarnedConstructor = false;
let currentEffectId = 0;
const ORIGIN_TARGET = Symbol("ORIGIN_TARGET");
function proxifyEffects(effects, cb, path = "") {
  if (!isObject(effects) && !(typeof effects === "function")) {
    return effects;
  }
  return new Proxy(effects, {
    apply(target, thisArg, agumentsList) {
      const effectId = currentEffectId++;
      const name = path.split(".");
      const method = name.pop();
      return cb({
        func: target.bind(thisArg ? thisArg[ORIGIN_TARGET] : void 0),
        effectId,
        name: name.join("."),
        method,
        args: agumentsList
      });
    },
    construct(Target, args) {
      if (!hasWarnedConstructor) {
        console.warn(`EFFECTS - It is highly recommended to create a custom effect, exposing a method that deals with the instantiation of "${path}". It improves readability and debugability of your app`);
        hasWarnedConstructor = true;
      }
      return new Target(...args);
    },
    get(target, prop) {
      if (prop === ORIGIN_TARGET) {
        return target;
      }
      return proxifyEffects(target[prop], cb, path ? path + "." + prop.toString() : prop.toString());
    }
  });
}
const createOnInitialize = () => {
  return ({ actions }, instance) => {
    const initializers = getActionsByName("onInitializeOvermind", actions);
    return Promise.all(initializers.map((initialize) => initialize(instance)));
  };
};
const ENVIRONMENT = (() => {
  let env;
  try {
    env = "production";
  } catch (_a) {
    console.warn("Overmind was unable to determine the NODE_ENV, which means it will run in DEVELOPMENT mode. If this is a production app, please configure your build tool to define NODE_ENV");
    env = "development";
  }
  return env;
})();
const IS_TEST = ENVIRONMENT === "test";
const IS_OPERATOR = Symbol("operator");
const ORIGINAL_ACTIONS = Symbol("origina_actions");
const EXECUTION = Symbol("execution");
const MODE_DEFAULT = Symbol("MODE_DEFAULT");
const MODE_TEST = Symbol("MODE_TEST");
const MODE_SSR = Symbol("MODE_SSR");
class MockedEventEmitter {
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
function isPromise(maybePromise) {
  return maybePromise instanceof Promise || maybePromise && typeof maybePromise.then === "function" && typeof maybePromise.catch === "function";
}
function processState(state) {
  return Object.keys(state).reduce((aggr, key) => {
    if (key === "__esModule") {
      return aggr;
    }
    const originalDescriptor = Object.getOwnPropertyDescriptor(state, key);
    if (originalDescriptor && "get" in originalDescriptor) {
      Object.defineProperty(aggr, key, originalDescriptor);
      return aggr;
    }
    const value = state[key];
    if (isPlainObj(value)) {
      aggr[key] = processState(value);
    } else {
      Object.defineProperty(aggr, key, originalDescriptor);
    }
    return aggr;
  }, isPlainObj(state) ? {} : state);
}
const getChangeMutationsDelimiter = ".";
function getChangeMutations(stateA, stateB, path = [], mutations = []) {
  const stateAKeys = Object.keys(stateA);
  const stateBKeys = Object.keys(stateB);
  stateAKeys.forEach((key) => {
    if (!stateBKeys.includes(key)) {
      mutations.push({
        delimiter: getChangeMutationsDelimiter,
        args: [],
        path: path.concat(key).join("."),
        hasChangedValue: false,
        method: "unset"
      });
    }
  });
  stateBKeys.forEach((key) => {
    if (isPlainObj(stateA[key]) && isPlainObj(stateB[key])) {
      getChangeMutations(stateA[key], stateB[key], path.concat(key), mutations);
    } else if (stateA[key] !== stateB[key]) {
      mutations.push({
        delimiter: getChangeMutationsDelimiter,
        args: [stateB[key]],
        path: path.concat(key).join("."),
        hasChangedValue: false,
        method: "set"
      });
    }
  });
  return mutations;
}
function getActionsByName(name, actions = {}, currentPath = []) {
  return Object.keys(actions).reduce((aggr, key) => {
    if (typeof actions[key] === "function" && key === name) {
      return aggr.concat(actions[key]);
    }
    return aggr.concat(getActionsByName(name, actions[key], currentPath.concat(key)));
  }, []);
}
function getActionPaths(actions = {}, currentPath = []) {
  return Object.keys(actions).reduce((aggr, key) => {
    if (typeof actions[key] === "function") {
      return aggr.concat(currentPath.concat(key).join("."));
    }
    return aggr.concat(getActionPaths(actions[key], currentPath.concat(key)));
  }, []);
}
function createActionsProxy(actions, cb) {
  return new Proxy(actions, {
    get(target, prop) {
      if (prop === ORIGINAL_ACTIONS) {
        return actions;
      }
      if (typeof target[prop] === "function") {
        return cb(target[prop]);
      }
      if (!target[prop]) {
        return void 0;
      }
      return createActionsProxy(target[prop], cb);
    }
  });
}
const hotReloadingCache = {};
class Overmind {
  constructor(configuration, options = {}, mode = {
    mode: MODE_DEFAULT
  }) {
    this.actionReferences = {};
    this.nextExecutionId = 0;
    this.reydrateMutationsForHotReloading = [];
    this.isStrict = false;
    this.reaction = (stateCallback, updateCallback, options2 = {}) => {
      let disposer;
      if (options2.nested) {
        const value = stateCallback(this.state);
        if (!value || !value[IS_PROXY]) {
          throw new Error('You have to return an object or array from the Overmind state when using a "nested" reaction');
        }
        const path = value[PATH];
        disposer = this.addFlushListener((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.path.startsWith(path)) {
              updateCallback(path ? path.split(this.delimiter).reduce((aggr, key) => aggr[key], this.state) : this.state);
            }
          });
        });
      } else {
        const tree = this.proxyStateTreeInstance.getTrackStateTree();
        let returnValue;
        const updateReaction = () => {
          tree.trackScope(() => returnValue = stateCallback(tree.state), () => {
            updateReaction();
            updateCallback(returnValue);
          });
        };
        updateReaction();
        disposer = () => {
          tree.dispose();
        };
      }
      if (options2.immediate) {
        updateCallback(stateCallback(this.state));
      }
      return disposer;
    };
    this.addMutationListener = (cb) => {
      return this.proxyStateTreeInstance.onMutation(cb);
    };
    this.addFlushListener = (cb) => {
      return this.proxyStateTreeInstance.onFlush(cb);
    };
    const name = options.name || "OvermindApp";
    const devEnv = options.devEnv || "development";
    const isNode = typeof process !== "undefined" && process.title && process.title.includes("node");
    this.delimiter = options.delimiter || ".";
    this.isStrict = Boolean(options.strict);
    if (ENVIRONMENT === devEnv && mode.mode === MODE_DEFAULT && options.hotReloading !== false && !isNode) {
      if (hotReloadingCache[name]) {
        return hotReloadingCache[name].reconfigure(configuration);
      } else {
        hotReloadingCache[name] = this;
      }
    }
    const eventHub = mode.mode === MODE_SSR ? new MockedEventEmitter() : new EventEmitter();
    const proxyStateTreeInstance = this.createProxyStateTree(configuration, eventHub, mode.mode === MODE_TEST || ENVIRONMENT === devEnv, mode.mode === MODE_SSR);
    this.originalConfiguration = configuration;
    this.state = proxyStateTreeInstance.state;
    this.effects = configuration.effects || {};
    this.proxyStateTreeInstance = proxyStateTreeInstance;
    this.eventHub = eventHub;
    this.mode = mode;
    this.actions = this.getActions(configuration.actions);
    if (mode.mode === MODE_SSR) {
      return;
    }
    if (ENVIRONMENT === devEnv && mode.mode === MODE_DEFAULT && typeof window !== "undefined") {
      let warning = "OVERMIND: You are running in DEVELOPMENT mode.";
      if (options.logProxies !== true) {
        const originalConsoleLog = console.log;
        console.log = (...args) => originalConsoleLog.apply(console, args.map((arg) => arg && arg[IS_PROXY] ? arg[VALUE] : arg));
        warning += '\n\n - To improve debugging experience "console.log" will NOT log proxies from Overmind, but the actual value. Please see docs to turn off this behaviour';
      }
      if (options.devtools || typeof location !== "undefined" && location.hostname === "localhost" && options.devtools !== false) {
        const host = options.devtools === true ? "localhost:3031" : options.devtools;
        const name2 = options.name ? options.name : typeof document === "undefined" ? "NoName" : document.title || "NoName";
        this.initializeDevtools(host, name2, eventHub, proxyStateTreeInstance.sourceState, configuration.actions);
      } else if (options.devtools !== false) {
        warning += "\n\n - You are not running on localhost. You will have to manually define the devtools option to connect";
      }
      if (!IS_TEST) {
        console.warn(warning);
      }
    }
    if (ENVIRONMENT === "production" && mode.mode === MODE_DEFAULT) {
      eventHub.on(EventType.OPERATOR_ASYNC, (execution) => {
        if (!execution.parentExecution || !execution.parentExecution.isRunning) {
          proxyStateTreeInstance.getMutationTree().flush(true);
        }
      });
      eventHub.on(EventType.ACTION_END, (execution) => {
        if (!execution.parentExecution || !execution.parentExecution.isRunning)
          proxyStateTreeInstance.getMutationTree().flush();
      });
      let nextTick2;
      const flushTree = () => {
        proxyStateTreeInstance.getMutationTree().flush(true);
      };
      this.proxyStateTreeInstance.onMutation(() => {
        nextTick2 && clearTimeout(nextTick2);
        nextTick2 = setTimeout(flushTree, 0);
      });
    } else if (mode.mode === MODE_DEFAULT || mode.mode === MODE_TEST) {
      if (ENVIRONMENT === "test" || this.devtools && options.hotReloading !== false) {
        eventHub.on(EventType.MUTATIONS, (execution) => {
          this.reydrateMutationsForHotReloading = this.reydrateMutationsForHotReloading.concat(execution.mutations);
        });
      }
      eventHub.on(EventType.OPERATOR_ASYNC, (execution) => {
        if (!execution.parentExecution || !execution.parentExecution.isRunning) {
          const flushData = execution.flush(true);
          if (this.devtools && flushData.mutations.length) {
            this.devtools.send({
              type: "flush",
              data: Object.assign(Object.assign({}, execution), flushData)
            });
          }
        }
      });
      eventHub.on(EventType.ACTION_END, (execution) => {
        if (!execution.parentExecution || !execution.parentExecution.isRunning) {
          const flushData = execution.flush();
          if (this.devtools && flushData.mutations.length) {
            this.devtools.send({
              type: "flush",
              data: Object.assign(Object.assign({}, execution), flushData)
            });
          }
        }
      });
    }
    if (mode.mode === MODE_DEFAULT) {
      const onInitialize = this.createAction("onInitialize", createOnInitialize());
      this.initialized = Promise.resolve(onInitialize(this));
    } else {
      this.initialized = Promise.resolve(null);
    }
  }
  createProxyStateTree(configuration, eventHub, devmode, ssr) {
    const proxyStateTreeInstance = new ProxyStateTree(this.getState(configuration), {
      devmode: devmode && !ssr,
      ssr,
      delimiter: this.delimiter,
      onSetFunction: (tree, path, target, prop, func) => {
        if (func[IS_DERIVED_CONSTRUCTOR]) {
          return new Derived(func);
        }
        return func;
      },
      onGetFunction: (tree, path, target, prop) => {
        const func = target[prop];
        if (func[IS_DERIVED]) {
          return func(eventHub, tree, proxyStateTreeInstance, path.split(this.delimiter));
        }
        if (func[IS_DERIVED_CONSTRUCTOR]) {
          const derived2 = new Derived(func);
          target[prop] = derived2;
          return derived2(eventHub, tree, proxyStateTreeInstance, path.split(this.delimiter));
        }
        return func;
      },
      onGetter: devmode ? (path, value) => {
        this.eventHub.emitAsync(EventType.GETTER, {
          path,
          value
        });
      } : void 0
    });
    return proxyStateTreeInstance;
  }
  createExecution(name, action, parentExecution) {
    const namespacePath = name.split(".");
    namespacePath.pop();
    if (ENVIRONMENT === "production") {
      return {
        [EXECUTION]: true,
        parentExecution,
        namespacePath,
        actionName: name,
        getMutationTree: () => {
          return this.proxyStateTreeInstance.getMutationTree();
        },
        getTrackStateTree: () => {
          return this.proxyStateTreeInstance.getTrackStateTree();
        },
        emit: this.eventHub.emit.bind(this.eventHub)
      };
    }
    const mutationTrees = [];
    const execution = {
      [EXECUTION]: true,
      namespacePath,
      actionId: name,
      executionId: this.nextExecutionId++,
      actionName: name,
      operatorId: 0,
      isRunning: true,
      parentExecution,
      path: [],
      emit: this.eventHub.emit.bind(this.eventHub),
      send: this.devtools ? this.devtools.send.bind(this.devtools) : () => {
      },
      trackEffects: this.trackEffects.bind(this, this.effects),
      getNextOperatorId: (() => {
        let currentOperatorId = 0;
        return () => ++currentOperatorId;
      })(),
      flush: parentExecution ? parentExecution.flush : (isAsync) => {
        return this.proxyStateTreeInstance.flush(mutationTrees, isAsync);
      },
      getMutationTree: parentExecution ? parentExecution.getMutationTree : () => {
        const mutationTree = this.proxyStateTreeInstance.getMutationTree();
        mutationTrees.push(mutationTree);
        return mutationTree;
      },
      getTrackStateTree: () => {
        return this.proxyStateTreeInstance.getTrackStateTree();
      },
      onFlush: (cb) => {
        return this.proxyStateTreeInstance.onFlush(cb);
      },
      scopeValue: (value, tree) => {
        return this.scopeValue(value, tree);
      }
    };
    return execution;
  }
  createContext(execution, tree) {
    return {
      state: tree.state,
      actions: createActionsProxy(this.actions, (action) => {
        return (value) => action(value, execution.isRunning ? execution : null);
      }),
      execution,
      proxyStateTree: this.proxyStateTreeInstance,
      effects: this.trackEffects(this.effects, execution),
      addNamespace: this.addNamespace.bind(this),
      reaction: this.reaction.bind(this),
      addMutationListener: this.addMutationListener.bind(this),
      addFlushListener: this.addFlushListener.bind(this)
    };
  }
  addNamespace(configuration, path, existingState) {
    const state = existingState || this.state;
    const namespaceKey = path.pop();
    if (configuration.state) {
      const stateTarget = path.reduce((aggr, key) => aggr[key], state);
      stateTarget[namespaceKey] = processState(configuration.state);
    }
    if (configuration.actions) {
      const actionsTarget = path.reduce((aggr, key) => aggr[key], this.actions);
      actionsTarget[namespaceKey] = this.getActions(configuration.actions);
    }
    if (configuration.effects) {
      const effectsTarget = path.reduce((aggr, key) => aggr[key], this.effects);
      effectsTarget[namespaceKey] = configuration.effects;
    }
  }
  scopeValue(value, tree) {
    if (!value) {
      return value;
    }
    if (value[IS_PROXY]) {
      return this.proxyStateTreeInstance.rescope(value, tree);
    } else if (isPlainObj(value)) {
      return Object.assign({}, ...Object.keys(value).map((key) => ({
        [key]: this.proxyStateTreeInstance.rescope(value[key], tree)
      })));
    } else {
      return value;
    }
  }
  addExecutionMutation(mutation) {
    this.mutations.push(mutation);
  }
  createAction(name, originalAction) {
    this.actionReferences[name] = originalAction;
    const actionFunc = (value, boundExecution) => {
      const action = this.actionReferences[name];
      boundExecution = boundExecution && boundExecution[EXECUTION] ? boundExecution : void 0;
      if (ENVIRONMENT === "production" || action[IS_OPERATOR] || this.mode.mode === MODE_SSR) {
        const execution = this.createExecution(name, action, boundExecution);
        this.eventHub.emit(EventType.ACTION_START, Object.assign(Object.assign({}, execution), { value }));
        if (action[IS_OPERATOR]) {
          return new Promise((resolve2, reject) => {
            action(null, Object.assign(Object.assign({}, this.createContext(execution, this.proxyStateTreeInstance)), { value }), (err, finalContext) => {
              execution.isRunning = false;
              finalContext && this.eventHub.emit(EventType.ACTION_END, Object.assign(Object.assign({}, finalContext.execution), { operatorId: finalContext.execution.operatorId - 1 }));
              if (err)
                reject(err);
              else {
                resolve2(finalContext.value);
              }
            });
          });
        } else {
          const mutationTree = execution.getMutationTree();
          if (this.isStrict) {
            mutationTree.blockMutations();
          }
          const returnValue = action(this.createContext(execution, mutationTree), value);
          this.eventHub.emit(EventType.ACTION_END, execution);
          return returnValue;
        }
      } else {
        const execution = Object.assign(Object.assign({}, this.createExecution(name, action, boundExecution)), { operatorId: 0, type: "action" });
        this.eventHub.emit(EventType.ACTION_START, Object.assign(Object.assign({}, execution), { value }));
        this.eventHub.emit(EventType.OPERATOR_START, execution);
        const mutationTree = execution.getMutationTree();
        if (this.isStrict) {
          mutationTree.blockMutations();
        }
        mutationTree.onMutation((mutation) => {
          this.eventHub.emit(EventType.MUTATIONS, Object.assign(Object.assign({}, execution), { mutations: [mutation] }));
        });
        const scopedValue = this.scopeValue(value, mutationTree);
        const context = this.createContext(execution, mutationTree);
        try {
          let pendingFlush;
          mutationTree.onMutation((mutation) => {
            if (pendingFlush) {
              clearTimeout(pendingFlush);
            }
            if (this.mode.mode === MODE_TEST) {
              this.addExecutionMutation(mutation);
            } else if (this.mode.mode === MODE_DEFAULT) {
              pendingFlush = setTimeout(() => {
                pendingFlush = null;
                const flushData = execution.flush(true);
                if (this.devtools && flushData.mutations.length) {
                  this.devtools.send({
                    type: "flush",
                    data: Object.assign(Object.assign(Object.assign({}, execution), flushData), { mutations: flushData.mutations })
                  });
                }
              });
            }
          });
          let result = action(context, scopedValue);
          if (isPromise(result)) {
            this.eventHub.emit(EventType.OPERATOR_ASYNC, execution);
            result = result.then((promiseResult) => {
              execution.isRunning = false;
              if (!boundExecution) {
                mutationTree.dispose();
              }
              this.eventHub.emit(EventType.OPERATOR_END, Object.assign(Object.assign({}, execution), { isAsync: true, result: void 0 }));
              this.eventHub.emit(EventType.ACTION_END, execution);
              return promiseResult;
            }).catch((error) => {
              execution.isRunning = false;
              if (!boundExecution) {
                mutationTree.dispose();
              }
              this.eventHub.emit(EventType.OPERATOR_END, Object.assign(Object.assign({}, execution), { isAsync: true, result: void 0, error: error.message }));
              this.eventHub.emit(EventType.ACTION_END, execution);
              throw error;
            });
          } else {
            execution.isRunning = false;
            if (!boundExecution) {
              mutationTree.dispose();
            }
            this.eventHub.emit(EventType.OPERATOR_END, Object.assign(Object.assign({}, execution), { isAsync: false, result: void 0 }));
            this.eventHub.emit(EventType.ACTION_END, execution);
          }
          return result;
        } catch (err) {
          this.eventHub.emit(EventType.OPERATOR_END, Object.assign(Object.assign({}, execution), { isAsync: false, result: void 0, error: err.message }));
          this.eventHub.emit(EventType.ACTION_END, execution);
          throw err;
        }
      }
    };
    return actionFunc;
  }
  trackEffects(effects = {}, execution) {
    if (ENVIRONMENT === "production") {
      return effects;
    }
    return proxifyEffects(this.effects, (effect) => {
      let result;
      try {
        if (this.mode.mode === MODE_TEST) {
          const mode = this.mode;
          result = mode.options.effectsCallback(effect);
        } else {
          this.eventHub.emit(EventType.EFFECT, Object.assign(Object.assign(Object.assign({}, execution), effect), { args: effect.args, isPending: true, error: false }));
          result = effect.func.apply(this, effect.args);
        }
      } catch (error) {
        this.eventHub.emit(EventType.EFFECT, Object.assign(Object.assign(Object.assign({}, execution), effect), { args: effect.args, isPending: false, error: error.message }));
        throw error;
      }
      if (isPromise(result)) {
        this.eventHub.emit(EventType.EFFECT, Object.assign(Object.assign(Object.assign({}, execution), effect), { args: effect.args, isPending: true, error: false }));
        return result.then((promisedResult) => {
          this.eventHub.emit(EventType.EFFECT, Object.assign(Object.assign(Object.assign({}, execution), effect), { args: effect.args, result: promisedResult, isPending: false, error: false }));
          return promisedResult;
        }).catch((error) => {
          this.eventHub.emit(EventType.EFFECT, Object.assign(Object.assign(Object.assign({}, execution), effect), { args: effect.args, isPending: false, error: error && error.message }));
          throw error;
        });
      }
      this.eventHub.emit(EventType.EFFECT, Object.assign(Object.assign(Object.assign({}, execution), effect), { args: effect.args, result, isPending: false, error: false }));
      return result;
    });
  }
  initializeDevtools(host, name, eventHub, initialState, actions) {
    if (ENVIRONMENT === "production")
      return;
    const devtools = new Devtools(name);
    devtools.connect(host, (message) => {
      switch (message.type) {
        case "refresh": {
          location.reload();
          break;
        }
        case "executeAction": {
          const action = message.data.name.split(".").reduce((aggr, key) => aggr[key], this.actions);
          message.data.payload ? action(JSON.parse(message.data.payload)) : action();
          break;
        }
        case "mutation": {
          const tree = this.proxyStateTreeInstance.getMutationTree();
          const path = message.data.path.slice();
          const value = JSON.parse(`{ "value": ${message.data.value} }`).value;
          const key = path.pop();
          const state = path.reduce((aggr, key2) => aggr[key2], tree.state);
          state[key] = value;
          tree.flush(true);
          tree.dispose();
          this.devtools.send({
            type: "state",
            data: {
              path: message.data.path,
              value
            }
          });
          break;
        }
      }
    });
    for (const type in EventType) {
      eventHub.on(EventType[type], ((eventType) => (data) => {
        devtools.send({
          type: EventType[type],
          data
        });
        if (eventType === EventType.MUTATIONS) {
          data.mutations.forEach((mutation) => {
            const value = mutation.path.split(this.delimiter).reduce((aggr, key) => aggr[key], this.proxyStateTreeInstance.state);
            if (isPlainObj(value)) {
              Object.keys(value).forEach((key) => value[key]);
            } else if (Array.isArray(value)) {
              value.forEach((item) => {
                if (isPlainObj(item)) {
                  Object.keys(item).forEach((key) => item[key]);
                }
              });
            }
          });
        }
        if (eventType === EventType.DERIVED_DIRTY) {
          data.derivedPath.reduce((aggr, key) => aggr[key], this.proxyStateTreeInstance.state);
        }
      })(EventType[type]));
    }
    devtools.send({
      type: "init",
      data: {
        state: this.proxyStateTreeInstance.state,
        actions: getActionPaths(actions),
        delimiter: this.delimiter
      }
    });
    this.devtools = devtools;
  }
  getState(configuration) {
    let state = {};
    if (configuration.state) {
      state = processState(configuration.state);
    }
    return state;
  }
  getActions(actions = {}, path = []) {
    return Object.keys(actions).reduce((aggr, name) => {
      if (typeof actions[name] === "function") {
        const action = this.createAction(path.concat(name).join("."), actions[name]);
        action.displayName = path.concat(name).join(".");
        return Object.assign(aggr, {
          [name]: action
        });
      }
      return Object.assign(aggr, {
        [name]: this.getActions(actions[name], path.concat(name))
      });
    }, {});
  }
  updateActions(actions = {}, path = []) {
    Object.keys(actions).forEach((name) => {
      if (typeof actions[name] === "function") {
        const actionName = path.concat(name).join(".");
        if (this.actionReferences[actionName]) {
          this.actionReferences[actionName] = actions[name];
        } else {
          const target = path.reduce((aggr, key) => {
            if (!aggr[key]) {
              aggr[key] = {};
            }
            return aggr[key];
          }, this.actions);
          target[name] = this.createAction(actionName, actions[name]);
          target[name].displayName = path.concat(name).join(".");
        }
      } else {
        this.updateActions(actions[name], path.concat(name));
      }
    }, {});
  }
  getTrackStateTree() {
    return this.proxyStateTreeInstance.getTrackStateTree();
  }
  getMutationTree() {
    return this.proxyStateTreeInstance.getMutationTree();
  }
  reconfigure(configuration) {
    const changeMutations = getChangeMutations(this.originalConfiguration.state, configuration.state || {});
    this.updateActions(configuration.actions);
    this.effects = configuration.effects || {};
    const mutationTree = this.proxyStateTreeInstance.getMutationTree();
    rehydrate(mutationTree.state, changeMutations);
    this.reydrateMutationsForHotReloading.forEach((mutation) => {
      try {
        rehydrate(mutationTree.state, [mutation]);
      } catch (error) {
      }
    });
    mutationTree.flush();
    mutationTree.dispose();
    if (this.devtools) {
      this.devtools.send({
        type: "re_init",
        data: {
          state: this.state,
          actions: getActionPaths(configuration.actions)
        }
      });
    }
    return this;
  }
}
const derived = (cb) => {
  cb[IS_DERIVED_CONSTRUCTOR] = true;
  return cb;
};
function createOvermind(config, options) {
  return new Overmind(config, options, { mode: MODE_DEFAULT });
}
const OVERMIND = Symbol("OVERMIND");
const IS_PRODUCTION = ENVIRONMENT === "production";
let nextComponentId = 0;
function createMixin(overmind, propsCallback, trackPropsCallback = false) {
  const componentId = nextComponentId++;
  let componentInstanceId = 0;
  return Object.assign(Object.assign({
    beforeCreate() {
      if (overmind.mode.mode === MODE_SSR) {
        this.overmind = {
          state: overmind.state,
          actions: overmind.actions,
          effects: overmind.effects,
          addMutationListener: overmind.addMutationListener,
          reaction: overmind.reaction
        };
        if (propsCallback) {
          Object.assign(this, propsCallback({
            state: overmind.state,
            actions: overmind.actions,
            effects: overmind.effects
          }));
        }
      } else {
        this[OVERMIND] = {
          tree: overmind.proxyStateTreeInstance.getTrackStateTree(),
          componentInstanceId: componentInstanceId++,
          onUpdate: (mutations, paths, flushId) => {
            this[OVERMIND].currentFlushId = flushId;
            this[OVERMIND].isUpdating = true;
            this.$forceUpdate();
          },
          isUpdating: false
        };
        this.overmind = {
          state: this[OVERMIND].tree.state,
          actions: overmind.actions,
          effects: overmind.effects,
          addMutationListener: overmind.addMutationListener,
          reaction: overmind.reaction
        };
        this[OVERMIND].tree.track(this[OVERMIND].onUpdate);
        if (propsCallback) {
          Object.assign(this, propsCallback({
            state: this[OVERMIND].tree.state,
            actions: overmind.actions,
            effects: overmind.effects
          }));
        }
      }
    },
    beforeUpdate() {
      if (overmind.mode.mode === MODE_SSR)
        return;
      this[OVERMIND].tree.track(this[OVERMIND].onUpdate);
      if (propsCallback && trackPropsCallback) {
        Object.assign(this, propsCallback({
          state: this[OVERMIND].tree.state,
          actions: overmind.actions,
          effects: overmind.effects
        }));
      }
    }
  }, IS_PRODUCTION ? {
    updated() {
      this[OVERMIND].tree.stopTracking();
    }
  } : {
    mounted() {
      if (overmind.mode.mode === MODE_SSR)
        return;
      overmind.eventHub.emitAsync(EventType.COMPONENT_ADD, {
        componentId,
        componentInstanceId: this[OVERMIND].componentInstanceId,
        name: this.$options.name || "",
        paths: Array.from(this[OVERMIND].tree.pathDependencies)
      });
    },
    updated() {
      if (overmind.mode.mode === MODE_SSR)
        return;
      this[OVERMIND].tree.stopTracking();
      if (this[OVERMIND].isUpdating) {
        overmind.eventHub.emitAsync(EventType.COMPONENT_UPDATE, {
          componentId,
          componentInstanceId: this[OVERMIND].componentInstanceId,
          name: this.$options.name || "",
          flushId: this[OVERMIND].currentFlushId,
          paths: Array.from(this[OVERMIND].tree.pathDependencies)
        });
        this[OVERMIND].isUpdating = false;
      }
    }
  }), { beforeDestroy() {
    if (overmind.mode.mode === MODE_SSR)
      return;
    overmind.proxyStateTreeInstance.disposeTree(this[OVERMIND].tree);
    if (IS_PRODUCTION) {
      return;
    }
    overmind.eventHub.emitAsync(EventType.COMPONENT_REMOVE, {
      componentId,
      componentInstanceId: this[OVERMIND].componentInstanceId,
      name: this.$options.name || ""
    });
  } });
}
const createPlugin = (overmind) => ({
  install(Vue, propsCallback = ({ state, actions, effects }) => ({
    state,
    actions,
    effects
  })) {
    Vue.mixin(createMixin(overmind, propsCallback));
  }
});
({
  user: {
    adaptor: "http",
    server: "",
    username: "",
    token: ""
  },
  route: {
    view: "login",
    module: "",
    doctype: "",
    document: "",
    breadcrumbs: derived((state, rootState) => {
      let crumbs = [];
      if (rootState.route.view == "login") {
        return crumbs;
      }
      if (rootState.route.doctype) {
        crumbs.push({
          title: rootState.route.doctype,
          to: `/${rootState.route.doctype}`
        });
      }
      if (rootState.route.document) {
        crumbs.push({
          title: rootState.route.document,
          to: `/${rootState.route.doctype}/${rootState.route.document}`
        });
      }
      return crumbs;
    })
  },
  meta: {},
  data: {}
});
/*!
  * vue-router v4.0.10
  * (c) 2021 Eduardo San Martin Morote
  * @license MIT
  */
const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
const PolySymbol = (name) => hasSymbol ? Symbol(name) : "_vr_" + name;
const matchedRouteKey = /* @__PURE__ */ PolySymbol("rvlm");
const viewDepthKey = /* @__PURE__ */ PolySymbol("rvd");
const routerKey = /* @__PURE__ */ PolySymbol("r");
const routeLocationKey = /* @__PURE__ */ PolySymbol("rl");
const routerViewLocationKey = /* @__PURE__ */ PolySymbol("rvl");
const isBrowser = typeof window !== "undefined";
function isESModule(obj) {
  return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === "Module";
}
const assign = Object.assign;
function applyToParams(fn, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value);
  }
  return newParams;
}
let noop = () => {
};
const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
function parseURL(parseQuery2, location2, currentLocation = "/") {
  let path, query = {}, searchString = "", hash = "";
  const searchPos = location2.indexOf("?");
  const hashPos = location2.indexOf("#", searchPos > -1 ? searchPos : 0);
  if (searchPos > -1) {
    path = location2.slice(0, searchPos);
    searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location2.slice(0, hashPos);
    hash = location2.slice(hashPos, location2.length);
  }
  path = resolveRelativePath(path != null ? path : location2, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash,
    path,
    query,
    hash
  };
}
function stringifyURL(stringifyQuery2, location2) {
  let query = location2.query ? stringifyQuery2(location2.query) : "";
  return location2.path + (query && "?") + query + (location2.hash || "");
}
function stripBase(pathname, base) {
  if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
    return pathname;
  return pathname.slice(base.length) || "/";
}
function isSameRouteLocation(stringifyQuery2, a, b) {
  let aLastIndex = a.matched.length - 1;
  let bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length)
    return false;
  for (let key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue(a, b) {
  return Array.isArray(a) ? isEquivalentArray(a, b) : Array.isArray(b) ? isEquivalentArray(b, a) : a === b;
}
function isEquivalentArray(a, b) {
  return Array.isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (position === 1 || segment === ".")
      continue;
    if (segment === "..")
      position--;
    else
      break;
  }
  return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
}
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
function normalizeBase(base) {
  if (!base) {
    if (isBrowser) {
      const baseEl = document.querySelector("base");
      base = baseEl && baseEl.getAttribute("href") || "/";
      base = base.replace(/^\w+:\/\/[^\/]+/, "");
    } else {
      base = "/";
    }
  }
  if (base[0] !== "/" && base[0] !== "#")
    base = "/" + base;
  return removeTrailingSlash(base);
}
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location2) {
  return base.replace(BEFORE_HASH_RE, "#") + location2;
}
function getElementPosition(el, offset) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    behavior: offset.behavior,
    left: elRect.left - docRect.left - (offset.left || 0),
    top: elRect.top - docRect.top - (offset.top || 0)
  };
}
const computeScrollPosition = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function scrollToPosition(position) {
  let scrollToOptions;
  if ("el" in position) {
    let positionEl = position.el;
    const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
    const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el) {
      return;
    }
    scrollToOptions = getElementPosition(el, position);
  } else {
    scrollToOptions = position;
  }
  if ("scrollBehavior" in document.documentElement.style)
    window.scrollTo(scrollToOptions);
  else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.pageXOffset, scrollToOptions.top != null ? scrollToOptions.top : window.pageYOffset);
  }
}
function getScrollKey(path, delta) {
  const position = history.state ? history.state.position - delta : -1;
  return position + path;
}
const scrollPositions = /* @__PURE__ */ new Map();
function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);
  scrollPositions.delete(key);
  return scroll;
}
let createBaseLocation = () => location.protocol + "//" + location.host;
function createCurrentLocation(base, location2) {
  const { pathname, search, hash } = location2;
  const hashPos = base.indexOf("#");
  if (hashPos > -1) {
    let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
    let pathFromHash = hash.slice(slicePos);
    if (pathFromHash[0] !== "/")
      pathFromHash = "/" + pathFromHash;
    return stripBase(pathFromHash, "");
  }
  const path = stripBase(pathname, base);
  return path + search + hash;
}
function useHistoryListeners(base, historyState, currentLocation, replace) {
  let listeners = [];
  let teardowns = [];
  let pauseState = null;
  const popStateHandler = ({ state }) => {
    const to = createCurrentLocation(base, location);
    const from = currentLocation.value;
    const fromState = historyState.value;
    let delta = 0;
    if (state) {
      currentLocation.value = to;
      historyState.value = state;
      if (pauseState && pauseState === from) {
        pauseState = null;
        return;
      }
      delta = fromState ? state.position - fromState.position : 0;
    } else {
      replace(to);
    }
    listeners.forEach((listener) => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
      });
    });
  };
  function pauseListeners() {
    pauseState = currentLocation.value;
  }
  function listen(callback) {
    listeners.push(callback);
    const teardown = () => {
      const index2 = listeners.indexOf(callback);
      if (index2 > -1)
        listeners.splice(index2, 1);
    };
    teardowns.push(teardown);
    return teardown;
  }
  function beforeUnloadListener() {
    const { history: history2 } = window;
    if (!history2.state)
      return;
    history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
  }
  function destroy() {
    for (const teardown of teardowns)
      teardown();
    teardowns = [];
    window.removeEventListener("popstate", popStateHandler);
    window.removeEventListener("beforeunload", beforeUnloadListener);
  }
  window.addEventListener("popstate", popStateHandler);
  window.addEventListener("beforeunload", beforeUnloadListener);
  return {
    pauseListeners,
    listen,
    destroy
  };
}
function buildState(back, current, forward, replaced = false, computeScroll = false) {
  return {
    back,
    current,
    forward,
    replaced,
    position: window.history.length,
    scroll: computeScroll ? computeScrollPosition() : null
  };
}
function useHistoryStateNavigation(base) {
  const { history: history2, location: location2 } = window;
  let currentLocation = {
    value: createCurrentLocation(base, location2)
  };
  let historyState = { value: history2.state };
  if (!historyState.value) {
    changeLocation(currentLocation.value, {
      back: null,
      current: currentLocation.value,
      forward: null,
      position: history2.length - 1,
      replaced: true,
      scroll: null
    }, true);
  }
  function changeLocation(to, state, replace2) {
    const hashIndex = base.indexOf("#");
    const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
    try {
      history2[replace2 ? "replaceState" : "pushState"](state, "", url);
      historyState.value = state;
    } catch (err) {
      {
        console.error(err);
      }
      location2[replace2 ? "replace" : "assign"](url);
    }
  }
  function replace(to, data) {
    const state = assign({}, history2.state, buildState(historyState.value.back, to, historyState.value.forward, true), data, { position: historyState.value.position });
    changeLocation(to, state, true);
    currentLocation.value = to;
  }
  function push(to, data) {
    const currentState = assign({}, historyState.value, history2.state, {
      forward: to,
      scroll: computeScrollPosition()
    });
    changeLocation(currentState.current, currentState, true);
    const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
    changeLocation(to, state, false);
    currentLocation.value = to;
  }
  return {
    location: currentLocation,
    state: historyState,
    push,
    replace
  };
}
function createWebHistory(base) {
  base = normalizeBase(base);
  const historyNavigation = useHistoryStateNavigation(base);
  const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
  function go(delta, triggerListeners = true) {
    if (!triggerListeners)
      historyListeners.pauseListeners();
    history.go(delta);
  }
  const routerHistory = assign({
    location: "",
    base,
    go,
    createHref: createHref.bind(null, base)
  }, historyNavigation, historyListeners);
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => historyNavigation.location.value
  });
  Object.defineProperty(routerHistory, "state", {
    enumerable: true,
    get: () => historyNavigation.state.value
  });
  return routerHistory;
}
function isRouteLocation(route) {
  return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
  return typeof name === "string" || typeof name === "symbol";
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
const NavigationFailureSymbol = /* @__PURE__ */ PolySymbol("nf");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type, params) {
  {
    return assign(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  let score = [];
  let pattern = options.start ? "^" : "";
  const keys = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [90];
    if (options.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001;
  }
  if (!options.strict)
    pattern += "/?";
  if (options.end)
    pattern += "$";
  else if (options.strict)
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options.sensitive ? "" : "i");
  function parse(path) {
    const match = path.match(re);
    const params = {};
    if (!match)
      return null;
    for (let i = 1; i < match.length; i++) {
      const value = match[i] || "";
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (Array.isArray(param) && !repeatable)
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          const text = Array.isArray(param) ? param.join("/") : param;
          if (!text) {
            if (optional) {
              if (segment.length < 2) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text;
        }
      }
    }
    return path;
  }
  return {
    re,
    score,
    keys,
    parse,
    stringify
  };
}
function compareScoreArray(a, b) {
  let i = 0;
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i];
    if (diff)
      return diff;
    i++;
  }
  if (a.length < b.length) {
    return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a, b) {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]);
    if (comp)
      return comp;
    i++;
  }
  return bScore.length - aScore.length;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i = 0;
  let char;
  let buffer = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer = "";
  }
  function addCharToBuffer() {
    buffer += char;
  }
  while (i < path.length) {
    char = path[i++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher = assign(parser, {
    record,
    parent,
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher);
  }
  return matcher;
}
function createRouterMatcher(routes2, globalOptions) {
  const matchers = [];
  const matcherMap = /* @__PURE__ */ new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }
  function addRoute(record, parent, originalRecord) {
    let isRootAdd = !originalRecord;
    let mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record);
    const normalizedRecords = [
      mainNormalizedRecord
    ];
    if ("alias" in record) {
      const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases) {
        normalizedRecords.push(assign({}, mainNormalizedRecord, {
          components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
          path: alias,
          aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
        }));
      }
    }
    let matcher;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      let { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        let parentPath = parent.record.path;
        let connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
      } else {
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher)
          originalMatcher.alias.push(matcher);
        if (isRootAdd && record.name && !isAliasRecord(matcher))
          removeRoute(record.name);
      }
      if ("children" in mainNormalizedRecord) {
        let children = mainNormalizedRecord.children;
        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
        }
      }
      originalRecord = originalRecord || matcher;
      insertMatcher(matcher);
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      let index2 = matchers.indexOf(matcherRef);
      if (index2 > -1) {
        matchers.splice(index2, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes() {
    return matchers;
  }
  function insertMatcher(matcher) {
    let i = 0;
    while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0)
      i++;
    matchers.splice(i, 0, matcher);
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher);
  }
  function resolve2(location2, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name;
    if ("name" in location2 && location2.name) {
      matcher = matcherMap.get(location2.name);
      if (!matcher)
        throw createRouterError(1, {
          location: location2
        });
      name = matcher.record.name;
      params = assign(paramsFromLocation(currentLocation.params, matcher.keys.filter((k) => !k.optional).map((k) => k.name)), location2.params);
      path = matcher.stringify(params);
    } else if ("path" in location2) {
      path = location2.path;
      matcher = matchers.find((m) => m.re.test(path));
      if (matcher) {
        params = matcher.parse(path);
        name = matcher.record.name;
      }
    } else {
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher)
        throw createRouterError(1, {
          location: location2,
          currentLocation
        });
      name = matcher.record.name;
      params = assign({}, currentLocation.params, location2.params);
      path = matcher.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes2.forEach((route) => addRoute(route));
  return { addRoute, resolve: resolve2, removeRoute, getRoutes, getRecordMatcher };
}
function paramsFromLocation(params, keys) {
  let newParams = {};
  for (let key of keys) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  return {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: void 0,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in record ? record.components || {} : { default: record.component }
  };
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (let name in record.components)
      propsObject[name] = typeof props === "boolean" ? props : props[name];
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
function mergeOptions(defaults, partialOptions) {
  let options = {};
  for (let key in defaults) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
  }
  return options;
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text) {
  return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text) {
  return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text) {
  return encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
  try {
    return decodeURIComponent("" + text);
  } catch (err) {
  }
  return "" + text;
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(PLUS_RE, " ");
    let eqPos = searchParam.indexOf("=");
    let key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    let value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!Array.isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    let values = Array.isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (let key in query) {
    let value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = Array.isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
function useCallbacks() {
  let handlers = [];
  function add(handler) {
    handlers.push(handler);
    return () => {
      const i = handlers.indexOf(handler);
      if (i > -1)
        handlers.splice(i, 1);
    };
  }
  function reset() {
    handlers = [];
  }
  return {
    add,
    list: () => handlers,
    reset
  };
}
function guardToPromiseFn(guard, to, from, record, name) {
  const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve2, reject) => {
    const next = (valid) => {
      if (valid === false)
        reject(createRouterError(4, {
          from,
          to
        }));
      else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2, {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function")
          enterCallbackArray.push(valid);
        resolve2();
      }
    };
    const guardReturn = guard.call(record && record.instances[name], to, from, next);
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        let options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.components[name] = resolvedComponent;
          let options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name)();
        }));
      }
    }
  }
  return guards;
}
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function useLink(props) {
  const router2 = inject(routerKey);
  const currentRoute = inject(routeLocationKey);
  const route = computed(() => router2.resolve(unref(props.to)));
  const activeRecordIndex = computed(() => {
    let { matched } = route.value;
    let { length } = matched;
    const routeMatched = matched[length - 1];
    let currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    let index2 = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index2 > -1)
      return index2;
    let parentRecordPath = getOriginalPath(matched[length - 2]);
    return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index2;
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      return router2[unref(props.replace) ? "replace" : "push"](unref(props.to)).catch(noop);
    }
    return Promise.resolve();
  }
  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
const RouterLinkImpl = /* @__PURE__ */ defineComponent({
  name: "RouterLink",
  props: {
    to: {
      type: [String, Object],
      required: true
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
  useLink,
  setup(props, { slots }) {
    const link = reactive(useLink(props));
    const { options } = inject(routerKey);
    const elClass = computed(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && slots.default(link);
      return props.custom ? children : h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    return;
  if (e.defaultPrevented)
    return;
  if (e.button !== void 0 && e.button !== 0)
    return;
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target))
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
  return true;
}
function includesParams(outer, inner) {
  for (let key in inner) {
    let innerValue = inner[key];
    let outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!Array.isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
        return false;
    }
  }
  return true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ defineComponent({
  name: "RouterView",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  setup(props, { attrs, slots }) {
    const injectedRoute = inject(routerViewLocationKey);
    const routeToDisplay = computed(() => props.route || injectedRoute.value);
    const depth = inject(viewDepthKey, 0);
    const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth]);
    provide(viewDepthKey, depth + 1);
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);
    const viewRef = ref();
    watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name] = instance;
        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
      }
    }, { flush: "post" });
    return () => {
      const route = routeToDisplay.value;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[props.name];
      const currentName = props.name;
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route });
      }
      const routePropsOption = matchedRoute.props[props.name];
      const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = h(ViewComponent, assign({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      return normalizeSlot(slots.default, { Component: component, route }) || component;
    };
  }
});
function normalizeSlot(slot, data) {
  if (!slot)
    return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function createRouter(options) {
  const matcher = createRouterMatcher(options.routes, options);
  let parseQuery$1 = options.parseQuery || parseQuery;
  let stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  let routerHistory = options.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = applyToParams.bind(null, decode);
  function addRoute(parentOrRoute, route) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route;
    } else {
      record = parentOrRoute;
    }
    return matcher.addRoute(record, parent);
  }
  function removeRoute(name) {
    let recordMatcher = matcher.getRecordMatcher(name);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }
  function resolve2(rawLocation, currentLocation) {
    currentLocation = assign({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      let locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      let matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      let href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if ("path" in rawLocation) {
      matcherLocation = assign({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      matcherLocation = assign({}, rawLocation, {
        params: encodeParams(rawLocation.params)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    let matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    let href = routerHistory.createHref(fullPath);
    return assign({
      fullPath,
      hash,
      query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace(to) {
    return push(assign(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
        newTargetLocation.params = {};
      }
      return assign({
        query: to.query,
        hash: to.hash,
        params: to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve2(to);
    const from = currentRoute.value;
    const data = to.state;
    const force = to.force;
    const replace2 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
        state: data,
        force,
        replace: replace2
      }), redirectedFrom || targetLocation);
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll(from, from, true, false);
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? error : triggerError(error, toLocation, from)).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(failure2, 2)) {
          return pushWithRedirect(assign(locationAsObject(failure2.to), {
            state: data,
            force,
            replace: replace2
          }), redirectedFrom || toLocation);
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of to.matched) {
        if (record.beforeEnter && !from.matched.includes(record)) {
          if (Array.isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    for (const guard of afterGuards.list())
      guard(to, from, failure);
  }
  function finalizeNavigation(toLocation, from, isPush, replace2, data) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state;
    if (isPush) {
      if (replace2 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign({
          scroll: isFirstNavigation && state && state.scroll
        }, data));
      else
        routerHistory.push(toLocation.fullPath, data);
    }
    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      let toLocation = resolve2(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(error, 4 | 8)) {
          return error;
        }
        if (isNavigationFailure(error, 2)) {
          pushWithRedirect(error.to, toLocation).then((failure) => {
            if (isNavigationFailure(failure, 4 | 16) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop);
          return Promise.reject();
        }
        if (info.delta)
          routerHistory.go(-info.delta, false);
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(toLocation, from, false);
        if (failure) {
          if (info.delta) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop);
    });
  }
  let readyHandlers = useCallbacks();
  let errorHandlers = useCallbacks();
  let ready;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorHandlers.list();
    if (list.length) {
      list.forEach((handler) => handler(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve3, reject) => {
      readyHandlers.add([resolve3, reject]);
    });
  }
  function markAsReady(err) {
    if (ready)
      return;
    ready = true;
    setupListeners();
    readyHandlers.list().forEach(([resolve3, reject]) => err ? reject(err) : resolve3());
    readyHandlers.reset();
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options;
    if (!isBrowser || !scrollBehavior)
      return Promise.resolve();
    let scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
  }
  const go = (delta) => routerHistory.go(delta);
  let started;
  const installedApps = /* @__PURE__ */ new Set();
  const router2 = {
    currentRoute,
    addRoute,
    removeRoute,
    hasRoute,
    getRoutes,
    resolve: resolve2,
    options,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorHandlers.add,
    isReady,
    install(app) {
      const router3 = this;
      app.component("RouterLink", RouterLink);
      app.component("RouterView", RouterView);
      app.config.globalProperties.$router = router3;
      Object.defineProperty(app.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute)
      });
      if (isBrowser && !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        started = true;
        push(routerHistory.location).catch((err) => {
        });
      }
      const reactiveRoute = {};
      for (let key in START_LOCATION_NORMALIZED) {
        reactiveRoute[key] = computed(() => currentRoute.value[key]);
      }
      app.provide(routerKey, router3);
      app.provide(routeLocationKey, reactive(reactiveRoute));
      app.provide(routerViewLocationKey, currentRoute);
      let unmountApp = app.unmount;
      installedApps.add(app);
      app.unmount = function() {
        installedApps.delete(app);
        if (installedApps.size < 1) {
          removeHistoryListener();
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready = false;
        }
        unmountApp();
      };
    }
  };
  return router2;
}
function runGuardQueue(guards) {
  return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
const routes = [
  {
    path: "/",
    component: {
      template: "<div><br>Login</div>"
    },
    props: true
  },
  {
    path: "/home",
    component: "<div><h1>HOME</h1></div>",
    props: true
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
];
const router = createRouter({
  history: createWebHistory(),
  routes
});
class StonecropConfigLoader {
  constructor(configPath = void 0) {
    if (configPath === void 0)
      ;
    else {
      import(resolve(configPath)).then((config) => {
        console.log(config);
      });
    }
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
function install(app, options) {
  const overmind = createOvermind(config);
  const OvermindPlugin = createPlugin(overmind);
  app.use(OvermindPlugin);
  app.use(router);
  const config = new StonecropConfigLoader();
}
var index = {
  install
};
export { index as default };
