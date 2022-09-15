import { shallowRef, unref, computed, reactive, nextTick, defineComponent, inject, h, provide, ref, watch, getCurrentInstance, watchEffect, effectScope, openBlock, createElementBlock, createElementVNode, toDisplayString, renderSlot, createVNode, Fragment, renderList, createBlock, withCtx, normalizeStyle, withDirectives, resolveDynamicComponent, vShow, createCommentVNode, createTextVNode, onMounted, onBeforeUnmount, getCurrentScope, onScopeDispose, mergeProps, normalizeClass, resolveDirective, vModelText, resolveComponent } from "vue";
function getDevtoolsGlobalHook() {
  return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function getTarget() {
  return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
}
const isProxyAvailable = typeof Proxy === "function";
const HOOK_SETUP = "devtools-plugin:setup";
const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
let supported;
let perf;
function isPerformanceSupported() {
  var _a2;
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else if (typeof global !== "undefined" && ((_a2 = global.perf_hooks) === null || _a2 === void 0 ? void 0 : _a2.performance)) {
    supported = true;
    perf = global.perf_hooks.performance;
  } else {
    supported = false;
  }
  return supported;
}
function now() {
  return isPerformanceSupported() ? perf.now() : Date.now();
}
class ApiProxy {
  constructor(plugin, hook) {
    this.target = null;
    this.targetQueue = [];
    this.onQueue = [];
    this.plugin = plugin;
    this.hook = hook;
    const defaultSettings = {};
    if (plugin.settings) {
      for (const id in plugin.settings) {
        const item = plugin.settings[id];
        defaultSettings[id] = item.defaultValue;
      }
    }
    const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
    let currentSettings = Object.assign({}, defaultSettings);
    try {
      const raw = localStorage.getItem(localSettingsSaveId);
      const data = JSON.parse(raw);
      Object.assign(currentSettings, data);
    } catch (e) {
    }
    this.fallbacks = {
      getSettings() {
        return currentSettings;
      },
      setSettings(value) {
        try {
          localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
        } catch (e) {
        }
        currentSettings = value;
      },
      now() {
        return now();
      }
    };
    if (hook) {
      hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
        if (pluginId === this.plugin.id) {
          this.fallbacks.setSettings(value);
        }
      });
    }
    this.proxiedOn = new Proxy({}, {
      get: (_target, prop) => {
        if (this.target) {
          return this.target.on[prop];
        } else {
          return (...args) => {
            this.onQueue.push({
              method: prop,
              args
            });
          };
        }
      }
    });
    this.proxiedTarget = new Proxy({}, {
      get: (_target, prop) => {
        if (this.target) {
          return this.target[prop];
        } else if (prop === "on") {
          return this.proxiedOn;
        } else if (Object.keys(this.fallbacks).includes(prop)) {
          return (...args) => {
            this.targetQueue.push({
              method: prop,
              args,
              resolve: () => {
              }
            });
            return this.fallbacks[prop](...args);
          };
        } else {
          return (...args) => {
            return new Promise((resolve) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve
              });
            });
          };
        }
      }
    });
  }
  async setRealTarget(target) {
    this.target = target;
    for (const item of this.onQueue) {
      this.target.on[item.method](...item.args);
    }
    for (const item of this.targetQueue) {
      item.resolve(await this.target[item.method](...item.args));
    }
  }
}
function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
  const descriptor = pluginDescriptor;
  const target = getTarget();
  const hook = getDevtoolsGlobalHook();
  const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
  if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
    hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
  } else {
    const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
    const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
    list.push({
      pluginDescriptor: descriptor,
      setupFn,
      proxy
    });
    if (proxy)
      setupFn(proxy.proxiedTarget);
  }
}
/*!
  * vue-router v4.0.10
  * (c) 2021 Eduardo San Martin Morote
  * @license MIT
  */
const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
const PolySymbol = (name) => hasSymbol ? Symbol(process.env.NODE_ENV !== "production" ? "[vue-router]: " + name : name) : (process.env.NODE_ENV !== "production" ? "[vue-router]: " : "_vr_") + name;
const matchedRouteKey = /* @__PURE__ */ PolySymbol(process.env.NODE_ENV !== "production" ? "router view location matched" : "rvlm");
const viewDepthKey = /* @__PURE__ */ PolySymbol(process.env.NODE_ENV !== "production" ? "router view depth" : "rvd");
const routerKey = /* @__PURE__ */ PolySymbol(process.env.NODE_ENV !== "production" ? "router" : "r");
const routeLocationKey = /* @__PURE__ */ PolySymbol(process.env.NODE_ENV !== "production" ? "route location" : "rl");
const routerViewLocationKey = /* @__PURE__ */ PolySymbol(process.env.NODE_ENV !== "production" ? "router view location" : "rvl");
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
let noop$1 = () => {
};
function warn(msg) {
  const args = Array.from(arguments).slice(1);
  console.warn.apply(console, ["[Vue Router warn]: " + msg].concat(args));
}
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
  if (process.env.NODE_ENV !== "production" && !from.startsWith("/")) {
    warn(`Cannot resolve a relative location without an absolute path. Trying to resolve "${to}" from "${from}". It should look like "/${from}".`);
    return to;
  }
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
    if (process.env.NODE_ENV !== "production" && typeof position.el === "string") {
      if (!isIdSelector || !document.getElementById(position.el.slice(1))) {
        try {
          let foundEl = document.querySelector(position.el);
          if (isIdSelector && foundEl) {
            warn(`The selector "${position.el}" should be passed as "el: document.querySelector('${position.el}')" because it starts with "#".`);
            return;
          }
        } catch (err) {
          warn(`The selector "${position.el}" is invalid. If you are using an id selector, make sure to escape it. You can find more information about escaping characters in selectors at https://mathiasbynens.be/notes/css-escapes or use CSS.escape (https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape).`);
          return;
        }
      }
    }
    const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el) {
      process.env.NODE_ENV !== "production" && warn(`Couldn't find element using selector "${position.el}" returned by scrollBehavior.`);
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
      const index = listeners.indexOf(callback);
      if (index > -1)
        listeners.splice(index, 1);
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
      if (process.env.NODE_ENV !== "production") {
        warn("Error with push/replace State", err);
      } else {
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
    if (process.env.NODE_ENV !== "production" && !history2.state) {
      warn(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:

history.replaceState(history.state, '', url)

You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`);
    }
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
const NavigationFailureSymbol = /* @__PURE__ */ PolySymbol(process.env.NODE_ENV !== "production" ? "navigation failure" : "nf");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
const ErrorTypeMessages = {
  [1]({ location: location2, currentLocation }) {
    return `No match for
 ${JSON.stringify(location2)}${currentLocation ? "\nwhile being at\n" + JSON.stringify(currentLocation) : ""}`;
  },
  [2]({ from, to }) {
    return `Redirected from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`;
  },
  [4]({ from, to }) {
    return `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`;
  },
  [8]({ from, to }) {
    return `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`;
  },
  [16]({ from, to }) {
    return `Avoided redundant navigation to current location: "${from.fullPath}".`;
  }
};
function createRouterError(type, params) {
  if (process.env.NODE_ENV !== "production" || false) {
    return assign(new Error(ErrorTypeMessages[type](params)), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  } else {
    return assign(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const propertiesToLog = ["params", "query", "hash"];
function stringifyRoute(to) {
  if (typeof to === "string")
    return to;
  if ("path" in to)
    return to.path;
  const location2 = {};
  for (const key of propertiesToLog) {
    if (key in to)
      location2[key] = to[key];
  }
  return JSON.stringify(location2, null, 2);
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
  function stringify2(params) {
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
    stringify: stringify2
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
    throw new Error(process.env.NODE_ENV !== "production" ? `Route paths should start with a "/": "${path}" should be "/${path}".` : `Invalid path "${path}"`);
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
  if (process.env.NODE_ENV !== "production") {
    const existingKeys = /* @__PURE__ */ new Set();
    for (const key of parser.keys) {
      if (existingKeys.has(key.name))
        warn(`Found duplicated params with name "${key.name}" for path "${record.path}". Only the last one will be available on "$route.params".`);
      existingKeys.add(key.name);
    }
  }
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
      if (process.env.NODE_ENV !== "production" && normalizedRecord.path === "*") {
        throw new Error('Catch all routes ("*") must now be defined using a param with a custom regexp.\nSee more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.');
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (process.env.NODE_ENV !== "production" && parent && path[0] === "/")
        checkMissingParamsInAbsolutePath(matcher, parent);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
        if (process.env.NODE_ENV !== "production") {
          checkSameParams(originalRecord, matcher);
        }
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
    } : noop$1;
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
      let index = matchers.indexOf(matcherRef);
      if (index > -1) {
        matchers.splice(index, 1);
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
  function resolve(location2, currentLocation) {
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
      if (process.env.NODE_ENV !== "production" && !path.startsWith("/")) {
        warn(`The Matcher cannot resolve relative paths but received "${path}". Unless you directly called \`matcher.resolve("${path}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/vue-router-next.`);
      }
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
  return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
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
function isSameParam(a, b) {
  return a.name === b.name && a.optional === b.optional && a.repeatable === b.repeatable;
}
function checkSameParams(a, b) {
  for (let key of a.keys) {
    if (!key.optional && !b.keys.find(isSameParam.bind(null, key)))
      return warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" should have the exact same param named "${key.name}"`);
  }
  for (let key of b.keys) {
    if (!key.optional && !a.keys.find(isSameParam.bind(null, key)))
      return warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" should have the exact same param named "${key.name}"`);
  }
}
function checkMissingParamsInAbsolutePath(record, parent) {
  for (let key of parent.keys) {
    if (!record.keys.find(isSameParam.bind(null, key)))
      return warn(`Absolute path "${record.record.path}" should have the exact same param named "${key.name}" as its parent "${parent.record.path}".`);
  }
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
    process.env.NODE_ENV !== "production" && warn(`Error decoding "${text}". Using original value`);
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
  return () => new Promise((resolve, reject) => {
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
        resolve();
      }
    };
    const guardReturn = guard.call(record && record.instances[name], to, from, process.env.NODE_ENV !== "production" ? canOnlyBeCalledOnce(next, to, from) : next);
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    if (process.env.NODE_ENV !== "production" && guard.length > 2) {
      const message = `The "next" callback was never called inside of ${guard.name ? '"' + guard.name + '"' : ""}:
${guard.toString()}
. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;
      if (typeof guardReturn === "object" && "then" in guardReturn) {
        guardCall = guardCall.then((resolvedValue) => {
          if (!next._called) {
            warn(message);
            return Promise.reject(new Error("Invalid navigation guard"));
          }
          return resolvedValue;
        });
      } else if (guardReturn !== void 0) {
        if (!next._called) {
          warn(message);
          reject(new Error("Invalid navigation guard"));
          return;
        }
      }
    }
    guardCall.catch((err) => reject(err));
  });
}
function canOnlyBeCalledOnce(next, to, from) {
  let called = 0;
  return function() {
    if (called++ === 1)
      warn(`The "next" callback was called more than once in one navigation guard when going from "${from.fullPath}" to "${to.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`);
    next._called = true;
    if (called === 1)
      next.apply(null, arguments);
  };
}
function extractComponentsGuards(matched, guardType, to, from) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (process.env.NODE_ENV !== "production") {
        if (!rawComponent || typeof rawComponent !== "object" && typeof rawComponent !== "function") {
          warn(`Component "${name}" in record with path "${record.path}" is not a valid component. Received "${String(rawComponent)}".`);
          throw new Error("Invalid route component");
        } else if ("then" in rawComponent) {
          warn(`Component "${name}" in record with path "${record.path}" is a Promise instead of a function that returns a Promise. Did you write "import('./MyPage.vue')" instead of "() => import('./MyPage.vue')" ? This will break in production if not fixed.`);
          let promise = rawComponent;
          rawComponent = () => promise;
        } else if (rawComponent.__asyncLoader && !rawComponent.__warnedDefineAsync) {
          rawComponent.__warnedDefineAsync = true;
          warn(`Component "${name}" in record with path "${record.path}" is defined using "defineAsyncComponent()". Write "() => import('./MyPage.vue')" instead of "defineAsyncComponent(() => import('./MyPage.vue'))".`);
        }
      }
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        let options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
      } else {
        let componentPromise = rawComponent();
        if (process.env.NODE_ENV !== "production" && !("catch" in componentPromise)) {
          warn(`Component "${name}" in record with path "${record.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`);
          componentPromise = Promise.resolve(componentPromise);
        }
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
    let index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index > -1)
      return index;
    let parentRecordPath = getOriginalPath(matched[length - 2]);
    return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index;
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      return router2[unref(props.replace) ? "replace" : "push"](unref(props.to)).catch(noop$1);
    }
    return Promise.resolve();
  }
  if ((process.env.NODE_ENV !== "production" || false) && isBrowser) {
    const instance = getCurrentInstance();
    if (instance) {
      const linkContextDevtools = {
        route: route.value,
        isActive: isActive.value,
        isExactActive: isExactActive.value
      };
      instance.__vrl_devtools = instance.__vrl_devtools || [];
      instance.__vrl_devtools.push(linkContextDevtools);
      watchEffect(() => {
        linkContextDevtools.route = route.value;
        linkContextDevtools.isActive = isActive.value;
        linkContextDevtools.isExactActive = isExactActive.value;
      }, { flush: "post" });
    }
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
    process.env.NODE_ENV !== "production" && warnDeprecatedUsage();
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
function warnDeprecatedUsage() {
  const instance = getCurrentInstance();
  const parentName = instance.parent && instance.parent.type.name;
  if (parentName && (parentName === "KeepAlive" || parentName.includes("Transition"))) {
    const comp = parentName === "KeepAlive" ? "keep-alive" : "transition";
    warn(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.
Use slot props instead:

<router-view v-slot="{ Component }">
  <${comp}>
    <component :is="Component" />
  </${comp}>
</router-view>`);
  }
}
function formatRouteLocation(routeLocation, tooltip) {
  const copy = assign({}, routeLocation, {
    matched: routeLocation.matched.map((matched) => omit(matched, ["instances", "children", "aliasOf"]))
  });
  return {
    _custom: {
      type: null,
      readOnly: true,
      display: routeLocation.fullPath,
      tooltip,
      value: copy
    }
  };
}
function formatDisplay(display) {
  return {
    _custom: {
      display
    }
  };
}
let routerId = 0;
function addDevtools(app, router2, matcher) {
  if (router2.__hasDevtools)
    return;
  router2.__hasDevtools = true;
  const id = routerId++;
  setupDevtoolsPlugin({
    id: "org.vuejs.router" + (id ? "." + id : ""),
    label: "Vue Router",
    packageName: "vue-router",
    homepage: "https://next.router.vuejs.org/",
    logo: "https://vuejs.org/images/icons/favicon-96x96.png",
    componentStateTypes: ["Routing"],
    app
  }, (api) => {
    api.on.inspectComponent((payload, ctx) => {
      if (payload.instanceData) {
        payload.instanceData.state.push({
          type: "Routing",
          key: "$route",
          editable: false,
          value: formatRouteLocation(router2.currentRoute.value, "Current Route")
        });
      }
    });
    api.on.visitComponentTree(({ treeNode: node, componentInstance }) => {
      if (Array.isArray(componentInstance.__vrl_devtools)) {
        componentInstance.__devtoolsApi = api;
        componentInstance.__vrl_devtools.forEach((devtoolsData) => {
          let backgroundColor = ORANGE_400;
          let tooltip = "";
          if (devtoolsData.isExactActive) {
            backgroundColor = LIME_500;
            tooltip = "This is exactly active";
          } else if (devtoolsData.isActive) {
            backgroundColor = BLUE_600;
            tooltip = "This link is active";
          }
          node.tags.push({
            label: devtoolsData.route.path,
            textColor: 0,
            tooltip,
            backgroundColor
          });
        });
      }
    });
    watch(router2.currentRoute, () => {
      refreshRoutesView();
      api.notifyComponentUpdate();
      api.sendInspectorTree(routerInspectorId);
      api.sendInspectorState(routerInspectorId);
    });
    const navigationsLayerId = "router:navigations:" + id;
    api.addTimelineLayer({
      id: navigationsLayerId,
      label: `Router${id ? " " + id : ""} Navigations`,
      color: 4237508
    });
    router2.onError((error, to) => {
      api.addTimelineEvent({
        layerId: navigationsLayerId,
        event: {
          title: "Error during Navigation",
          subtitle: to.fullPath,
          logType: "error",
          time: Date.now(),
          data: { error },
          groupId: to.meta.__navigationId
        }
      });
    });
    let navigationId = 0;
    router2.beforeEach((to, from) => {
      const data = {
        guard: formatDisplay("beforeEach"),
        from: formatRouteLocation(from, "Current Location during this navigation"),
        to: formatRouteLocation(to, "Target location")
      };
      Object.defineProperty(to.meta, "__navigationId", {
        value: navigationId++
      });
      api.addTimelineEvent({
        layerId: navigationsLayerId,
        event: {
          time: Date.now(),
          title: "Start of navigation",
          subtitle: to.fullPath,
          data,
          groupId: to.meta.__navigationId
        }
      });
    });
    router2.afterEach((to, from, failure) => {
      const data = {
        guard: formatDisplay("afterEach")
      };
      if (failure) {
        data.failure = {
          _custom: {
            type: Error,
            readOnly: true,
            display: failure ? failure.message : "",
            tooltip: "Navigation Failure",
            value: failure
          }
        };
        data.status = formatDisplay("\u274C");
      } else {
        data.status = formatDisplay("\u2705");
      }
      data.from = formatRouteLocation(from, "Current Location during this navigation");
      data.to = formatRouteLocation(to, "Target location");
      api.addTimelineEvent({
        layerId: navigationsLayerId,
        event: {
          title: "End of navigation",
          subtitle: to.fullPath,
          time: Date.now(),
          data,
          logType: failure ? "warning" : "default",
          groupId: to.meta.__navigationId
        }
      });
    });
    const routerInspectorId = "router-inspector:" + id;
    api.addInspector({
      id: routerInspectorId,
      label: "Routes" + (id ? " " + id : ""),
      icon: "book",
      treeFilterPlaceholder: "Search routes"
    });
    function refreshRoutesView() {
      if (!activeRoutesPayload)
        return;
      const payload = activeRoutesPayload;
      let routes2 = matcher.getRoutes().filter((route) => !route.parent);
      routes2.forEach(resetMatchStateOnRouteRecord);
      if (payload.filter) {
        routes2 = routes2.filter((route) => isRouteMatching(route, payload.filter.toLowerCase()));
      }
      routes2.forEach((route) => markRouteRecordActive(route, router2.currentRoute.value));
      payload.rootNodes = routes2.map(formatRouteRecordForInspector);
    }
    let activeRoutesPayload;
    api.on.getInspectorTree((payload) => {
      activeRoutesPayload = payload;
      if (payload.app === app && payload.inspectorId === routerInspectorId) {
        refreshRoutesView();
      }
    });
    api.on.getInspectorState((payload) => {
      if (payload.app === app && payload.inspectorId === routerInspectorId) {
        const routes2 = matcher.getRoutes();
        const route = routes2.find((route2) => route2.record.__vd_id === payload.nodeId);
        if (route) {
          payload.state = {
            options: formatRouteRecordMatcherForStateInspector(route)
          };
        }
      }
    });
    api.sendInspectorTree(routerInspectorId);
    api.sendInspectorState(routerInspectorId);
  });
}
function modifierForKey(key) {
  if (key.optional) {
    return key.repeatable ? "*" : "?";
  } else {
    return key.repeatable ? "+" : "";
  }
}
function formatRouteRecordMatcherForStateInspector(route) {
  const { record } = route;
  const fields = [
    { editable: false, key: "path", value: record.path }
  ];
  if (record.name != null) {
    fields.push({
      editable: false,
      key: "name",
      value: record.name
    });
  }
  fields.push({ editable: false, key: "regexp", value: route.re });
  if (route.keys.length) {
    fields.push({
      editable: false,
      key: "keys",
      value: {
        _custom: {
          type: null,
          readOnly: true,
          display: route.keys.map((key) => `${key.name}${modifierForKey(key)}`).join(" "),
          tooltip: "Param keys",
          value: route.keys
        }
      }
    });
  }
  if (record.redirect != null) {
    fields.push({
      editable: false,
      key: "redirect",
      value: record.redirect
    });
  }
  if (route.alias.length) {
    fields.push({
      editable: false,
      key: "aliases",
      value: route.alias.map((alias) => alias.record.path)
    });
  }
  fields.push({
    key: "score",
    editable: false,
    value: {
      _custom: {
        type: null,
        readOnly: true,
        display: route.score.map((score) => score.join(", ")).join(" | "),
        tooltip: "Score used to sort routes",
        value: route.score
      }
    }
  });
  return fields;
}
const PINK_500 = 15485081;
const BLUE_600 = 2450411;
const LIME_500 = 8702998;
const CYAN_400 = 2282478;
const ORANGE_400 = 16486972;
const DARK = 6710886;
function formatRouteRecordForInspector(route) {
  const tags = [];
  const { record } = route;
  if (record.name != null) {
    tags.push({
      label: String(record.name),
      textColor: 0,
      backgroundColor: CYAN_400
    });
  }
  if (record.aliasOf) {
    tags.push({
      label: "alias",
      textColor: 0,
      backgroundColor: ORANGE_400
    });
  }
  if (route.__vd_match) {
    tags.push({
      label: "matches",
      textColor: 0,
      backgroundColor: PINK_500
    });
  }
  if (route.__vd_exactActive) {
    tags.push({
      label: "exact",
      textColor: 0,
      backgroundColor: LIME_500
    });
  }
  if (route.__vd_active) {
    tags.push({
      label: "active",
      textColor: 0,
      backgroundColor: BLUE_600
    });
  }
  if (record.redirect) {
    tags.push({
      label: "redirect: " + (typeof record.redirect === "string" ? record.redirect : "Object"),
      textColor: 16777215,
      backgroundColor: DARK
    });
  }
  let id = record.__vd_id;
  if (id == null) {
    id = String(routeRecordId++);
    record.__vd_id = id;
  }
  return {
    id,
    label: record.path,
    tags,
    children: route.children.map(formatRouteRecordForInspector)
  };
}
let routeRecordId = 0;
const EXTRACT_REGEXP_RE = /^\/(.*)\/([a-z]*)$/;
function markRouteRecordActive(route, currentRoute) {
  const isExactActive = currentRoute.matched.length && isSameRouteRecord(currentRoute.matched[currentRoute.matched.length - 1], route.record);
  route.__vd_exactActive = route.__vd_active = isExactActive;
  if (!isExactActive) {
    route.__vd_active = currentRoute.matched.some((match) => isSameRouteRecord(match, route.record));
  }
  route.children.forEach((childRoute) => markRouteRecordActive(childRoute, currentRoute));
}
function resetMatchStateOnRouteRecord(route) {
  route.__vd_match = false;
  route.children.forEach(resetMatchStateOnRouteRecord);
}
function isRouteMatching(route, filter) {
  const found = String(route.re).match(EXTRACT_REGEXP_RE);
  route.__vd_match = false;
  if (!found || found.length < 3) {
    return false;
  }
  const nonEndingRE = new RegExp(found[1].replace(/\$$/, ""), found[2]);
  if (nonEndingRE.test(filter)) {
    route.children.forEach((child) => isRouteMatching(child, filter));
    if (route.record.path !== "/" || filter === "/") {
      route.__vd_match = route.re.test(filter);
      return true;
    }
    return false;
  }
  const path = route.record.path.toLowerCase();
  const decodedPath = decode(path);
  if (!filter.startsWith("/") && (decodedPath.includes(filter) || path.includes(filter)))
    return true;
  if (decodedPath.startsWith(filter) || path.startsWith(filter))
    return true;
  if (route.record.name && String(route.record.name).includes(filter))
    return true;
  return route.children.some((child) => isRouteMatching(child, filter));
}
function omit(obj, keys) {
  const ret = {};
  for (let key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
}
function createRouter(options) {
  const matcher = createRouterMatcher(options.routes, options);
  let parseQuery$1 = options.parseQuery || parseQuery;
  let stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  let routerHistory = options.history;
  if (process.env.NODE_ENV !== "production" && !routerHistory)
    throw new Error('Provide the "history" option when calling "createRouter()": https://next.router.vuejs.org/api/#history.');
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
    } else if (process.env.NODE_ENV !== "production") {
      warn(`Cannot remove non-existent route "${String(name)}"`);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }
  function resolve(rawLocation, currentLocation) {
    currentLocation = assign({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      let locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      let matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      let href2 = routerHistory.createHref(locationNormalized.fullPath);
      if (process.env.NODE_ENV !== "production") {
        if (href2.startsWith("//"))
          warn(`Location "${rawLocation}" resolved to "${href2}". A resolved location cannot start with multiple slashes.`);
        else if (!matchedRoute2.matched.length) {
          warn(`No match found for location with path "${rawLocation}"`);
        }
      }
      return assign(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if ("path" in rawLocation) {
      if (process.env.NODE_ENV !== "production" && "params" in rawLocation && !("name" in rawLocation) && Object.keys(rawLocation.params).length) {
        warn(`Path "${rawLocation.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`);
      }
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
    if (process.env.NODE_ENV !== "production" && hash && !hash.startsWith("#")) {
      warn(`A \`hash\` should always start with the character "#". Replace "${hash}" with "#${hash}".`);
    }
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    let href = routerHistory.createHref(fullPath);
    if (process.env.NODE_ENV !== "production") {
      if (href.startsWith("//")) {
        warn(`Location "${rawLocation}" resolved to "${href}". A resolved location cannot start with multiple slashes.`);
      } else if (!matchedRoute.matched.length) {
        warn(`No match found for location with path "${"path" in rawLocation ? rawLocation.path : rawLocation}"`);
      }
    }
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
      if (process.env.NODE_ENV !== "production" && !("path" in newTargetLocation) && !("name" in newTargetLocation)) {
        warn(`Invalid redirect found:
${JSON.stringify(newTargetLocation, null, 2)}
 when navigating to "${to.fullPath}". A redirect must contain a name or path. This will break in production.`);
        throw new Error("Invalid redirect");
      }
      return assign({
        query: to.query,
        hash: to.hash,
        params: to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve(to);
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
          if (process.env.NODE_ENV !== "production" && isSameRouteLocation(stringifyQuery$1, resolve(failure2.to), toLocation) && redirectedFrom && (redirectedFrom._count = redirectedFrom._count ? redirectedFrom._count + 1 : 1) > 10) {
            warn(`Detected an infinite redirection in a navigation guard when going from "${from.fullPath}" to "${toLocation.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`);
            return Promise.reject(new Error("Infinite redirect in navigation guard"));
          }
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
      let toLocation = resolve(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop$1);
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
          }).catch(noop$1);
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
      }).catch(noop$1);
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
      if (process.env.NODE_ENV !== "production") {
        warn("uncaught error during route navigation:");
      }
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve2, reject) => {
      readyHandlers.add([resolve2, reject]);
    });
  }
  function markAsReady(err) {
    if (ready)
      return;
    ready = true;
    setupListeners();
    readyHandlers.list().forEach(([resolve2, reject]) => err ? reject(err) : resolve2());
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
    resolve,
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
          if (process.env.NODE_ENV !== "production")
            warn("Unexpected error when starting the router:", err);
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
      if ((process.env.NODE_ENV !== "production" || false) && isBrowser) {
        addDevtools(app, router3, matcher);
      }
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
var _a$2;
const isClient$2 = typeof window !== "undefined";
isClient$2 && ((_a$2 = window == null ? void 0 : window.navigator) == null ? void 0 : _a$2.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function createGlobalState(stateFactory) {
  let initialized = false;
  let state;
  const scope = effectScope(true);
  return () => {
    if (!initialized) {
      state = scope.run(stateFactory);
      initialized = true;
    }
    return state;
  };
}
const useStonecrop = createGlobalState(() => {
  return { ...new Stonecrop$1() };
});
class Stonecrop$1 {
  constructor(schema, events, hooks, value) {
    if (Stonecrop$1._root) {
      return Stonecrop$1._root;
    }
    Stonecrop$1._root = this;
    this.name = "Stonecrop";
    this.schema = schema;
    this.events = events;
    this.hooks = hooks;
  }
}
const _hoisted_1$4 = { id: "home" };
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "Home",
  setup(__props) {
    let state = useStonecrop();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$4, [
        createElementVNode("pre", null, toDisplayString(unref(state)), 1)
      ]);
    };
  }
});
const Records = () => import("./Records.8b9a7a5b.mjs");
const Doctype$2 = () => Promise.resolve().then(() => Doctype$1);
const routes = [
  { path: "/", component: _sfc_main$6, meta: { transition: "slide-up" } },
  { path: "/:records", component: Records, meta: { transition: "slide-up" } },
  { path: "/:records/:record", component: Doctype$2, meta: { transition: "slide-up" } }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});
var _a$1;
const isClient$1 = typeof window !== "undefined";
const isString = (val) => typeof val === "string";
const noop = () => {
};
isClient$1 && ((_a$1 = window == null ? void 0 : window.navigator) == null ? void 0 : _a$1.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function identity$1(arg) {
  return arg;
}
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function unrefElement(elRef) {
  var _a2;
  const plain = resolveUnref(elRef);
  return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
}
const defaultWindow = isClient$1 ? window : void 0;
function useEventListener(...args) {
  let target;
  let event;
  let listener;
  let options;
  if (isString(args[0])) {
    [event, listener, options] = args;
    target = defaultWindow;
  } else {
    [target, event, listener, options] = args;
  }
  if (!target)
    return noop;
  let cleanup = noop;
  const stopWatch = watch(() => unrefElement(target), (el) => {
    cleanup();
    if (!el)
      return;
    el.addEventListener(event, listener, options);
    cleanup = () => {
      el.removeEventListener(event, listener, options);
      cleanup = noop;
    };
  }, { immediate: true, flush: "post" });
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
const _global$1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey$1 = "__vueuse_ssr_handlers__";
_global$1[globalKey$1] = _global$1[globalKey$1] || {};
_global$1[globalKey$1];
function useElementVisibility(element, { window: window2 = defaultWindow, scrollTarget } = {}) {
  const elementIsVisible = ref(false);
  const testBounding = () => {
    if (!window2)
      return;
    const document2 = window2.document;
    const el = unrefElement(element);
    if (!el) {
      elementIsVisible.value = false;
    } else {
      const rect = el.getBoundingClientRect();
      elementIsVisible.value = rect.top <= (window2.innerHeight || document2.documentElement.clientHeight) && rect.left <= (window2.innerWidth || document2.documentElement.clientWidth) && rect.bottom >= 0 && rect.right >= 0;
    }
  };
  watch(() => unrefElement(element), () => testBounding(), { immediate: true, flush: "post" });
  if (window2) {
    useEventListener(scrollTarget || window2, "scroll", testBounding, {
      capture: false,
      passive: true
    });
  }
  return elementIsVisible;
}
var SwipeDirection$1;
(function(SwipeDirection2) {
  SwipeDirection2["UP"] = "UP";
  SwipeDirection2["RIGHT"] = "RIGHT";
  SwipeDirection2["DOWN"] = "DOWN";
  SwipeDirection2["LEFT"] = "LEFT";
  SwipeDirection2["NONE"] = "NONE";
})(SwipeDirection$1 || (SwipeDirection$1 = {}));
var __defProp$1 = Object.defineProperty;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
const _TransitionPresets$1 = {
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
__spreadValues$1({
  linear: identity$1
}, _TransitionPresets$1);
const isVisible = (element) => {
  let isVisible2 = useElementVisibility(element).value;
  isVisible2 = isVisible2 && element.offsetHeight > 0;
  return isVisible2;
};
const isFocusable = (element) => {
  return element.tabIndex >= 0;
};
const getUpCell = (event) => {
  const $target = event.target;
  return _getUpCell($target);
};
const _getUpCell = (element) => {
  var _a2;
  let $upCell;
  if (element instanceof HTMLTableCellElement) {
    const $prevRow = (_a2 = element.parentElement) == null ? void 0 : _a2.previousElementSibling;
    if ($prevRow) {
      const $prevRowCells = Array.from($prevRow.children);
      const $prevCell = $prevRowCells[element.cellIndex];
      if ($prevCell) {
        $upCell = $prevCell;
      }
    }
  }
  if ($upCell && (!isFocusable($upCell) || !isVisible($upCell))) {
    return _getUpCell($upCell);
  }
  return $upCell;
};
const getTopCell = (event) => {
  var _a2;
  const $target = event.target;
  let $topCell;
  if ($target instanceof HTMLTableCellElement) {
    const $table = (_a2 = $target.parentElement) == null ? void 0 : _a2.parentElement;
    if ($table) {
      const $firstRow = $table.firstElementChild;
      const $navCell = $firstRow.children[$target.cellIndex];
      if ($navCell) {
        $topCell = $navCell;
      }
    }
  }
  if ($topCell && (!isFocusable($topCell) || !isVisible($topCell))) {
    return _getDownCell($topCell);
  }
  return $topCell;
};
const getDownCell = (event) => {
  const $target = event.target;
  return _getDownCell($target);
};
const _getDownCell = (element) => {
  var _a2;
  let $downCell;
  if (element instanceof HTMLTableCellElement) {
    const $nextRow = (_a2 = element.parentElement) == null ? void 0 : _a2.nextElementSibling;
    if ($nextRow) {
      const $nextRowCells = Array.from($nextRow.children);
      const $nextCell = $nextRowCells[element.cellIndex];
      if ($nextCell) {
        $downCell = $nextCell;
      }
    }
  }
  if ($downCell && (!isFocusable($downCell) || !isVisible($downCell))) {
    return _getDownCell($downCell);
  }
  return $downCell;
};
const getBottomCell = (event) => {
  var _a2;
  const $target = event.target;
  let $bottomCell;
  if ($target instanceof HTMLTableCellElement) {
    const $table = (_a2 = $target.parentElement) == null ? void 0 : _a2.parentElement;
    if ($table) {
      const $lastRow = $table.lastElementChild;
      const $navCell = $lastRow.children[$target.cellIndex];
      if ($navCell) {
        $bottomCell = $navCell;
      }
    }
  }
  if ($bottomCell && (!isFocusable($bottomCell) || !isVisible($bottomCell))) {
    return _getUpCell($bottomCell);
  }
  return $bottomCell;
};
const getPrevCell = (event) => {
  const $target = event.target;
  return _getPrevCell($target);
};
const _getPrevCell = (element) => {
  var _a2;
  let $prevCell;
  if (element.previousElementSibling) {
    $prevCell = element.previousElementSibling;
  } else {
    const $prevRow = (_a2 = element.parentElement) == null ? void 0 : _a2.previousElementSibling;
    $prevCell = $prevRow == null ? void 0 : $prevRow.lastElementChild;
  }
  if ($prevCell && (!isFocusable($prevCell) || !isVisible($prevCell))) {
    return _getPrevCell($prevCell);
  }
  return $prevCell;
};
const getNextCell = (event) => {
  const $target = event.target;
  return _getNextCell($target);
};
const _getNextCell = (element) => {
  var _a2;
  let $nextCell;
  if (element.nextElementSibling) {
    $nextCell = element.nextElementSibling;
  } else {
    const $nextRow = (_a2 = element.parentElement) == null ? void 0 : _a2.nextElementSibling;
    $nextCell = $nextRow == null ? void 0 : $nextRow.firstElementChild;
  }
  if ($nextCell && (!isFocusable($nextCell) || !isVisible($nextCell))) {
    return _getNextCell($nextCell);
  }
  return $nextCell;
};
const getFirstCell = (event) => {
  const $target = event.target;
  const $parent = $target.parentElement;
  const $firstCell = $parent.firstElementChild;
  if ($firstCell && (!isFocusable($firstCell) || !isVisible($firstCell))) {
    return _getNextCell($firstCell);
  }
  return $firstCell;
};
const getLastCell = (event) => {
  const $target = event.target;
  const $parent = $target.parentElement;
  const $lastCell = $parent.lastElementChild;
  if ($lastCell && (!isFocusable($lastCell) || !isVisible($lastCell))) {
    return _getPrevCell($lastCell);
  }
  return $lastCell;
};
const modifierKeys = ["alt", "control", "shift", "meta"];
const eventKeyMap = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
};
const defaultKeypressHandlers = {
  "keydown.up": (event) => {
    const $upCell = getUpCell(event);
    if ($upCell) {
      event.preventDefault();
      event.stopPropagation();
      $upCell.focus();
    }
  },
  "keydown.down": (event) => {
    const $downCell = getDownCell(event);
    if ($downCell) {
      event.preventDefault();
      event.stopPropagation();
      $downCell.focus();
    }
  },
  "keydown.left": (event) => {
    const $prevCell = getPrevCell(event);
    event.preventDefault();
    event.stopPropagation();
    if ($prevCell) {
      $prevCell.focus();
    }
  },
  "keydown.right": (event) => {
    const $nextCell = getNextCell(event);
    event.preventDefault();
    event.stopPropagation();
    if ($nextCell) {
      $nextCell.focus();
    }
  },
  "keydown.control.up": (event) => {
    const $topCell = getTopCell(event);
    if ($topCell) {
      event.preventDefault();
      event.stopPropagation();
      $topCell.focus();
    }
  },
  "keydown.control.down": (event) => {
    const $bottomCell = getBottomCell(event);
    if ($bottomCell) {
      event.preventDefault();
      event.stopPropagation();
      $bottomCell.focus();
    }
  },
  "keydown.control.left": (event) => {
    const $firstCell = getFirstCell(event);
    if ($firstCell) {
      event.preventDefault();
      event.stopPropagation();
      $firstCell.focus();
    }
  },
  "keydown.control.right": (event) => {
    const $lastCell = getLastCell(event);
    if ($lastCell) {
      event.preventDefault();
      event.stopPropagation();
      $lastCell.focus();
    }
  },
  "keydown.end": (event) => {
    const $lastCell = getLastCell(event);
    if ($lastCell) {
      event.preventDefault();
      event.stopPropagation();
      $lastCell.focus();
    }
  },
  "keydown.enter": (event) => {
    const $target = event.target;
    if ($target instanceof HTMLTableCellElement) {
      event.preventDefault();
      event.stopPropagation();
      const $downCell = getDownCell(event);
      if ($downCell) {
        $downCell.focus();
      }
    }
  },
  "keydown.shift.enter": (event) => {
    const $target = event.target;
    if ($target instanceof HTMLTableCellElement) {
      event.preventDefault();
      event.stopPropagation();
      const $upCell = getUpCell(event);
      if ($upCell) {
        $upCell.focus();
      }
    }
  },
  "keydown.home": (event) => {
    const $firstCell = getFirstCell(event);
    if ($firstCell) {
      event.preventDefault();
      event.stopPropagation();
      $firstCell.focus();
    }
  },
  "keydown.tab": (event) => {
    const $nextCell = getNextCell(event);
    if ($nextCell) {
      event.preventDefault();
      event.stopPropagation();
      $nextCell.focus();
    }
  },
  "keydown.shift.tab": (event) => {
    const $prevCell = getPrevCell(event);
    if ($prevCell) {
      event.preventDefault();
      event.stopPropagation();
      $prevCell.focus();
    }
  }
};
function useKeyboardNav(options) {
  const getSelectors = (option) => {
    let $parent = null;
    if (option.parent) {
      if (typeof option.parent === "string") {
        $parent = document.querySelector(option.parent);
      } else if (option.parent instanceof Element) {
        $parent = option.parent;
      } else {
        $parent = option.parent.value;
      }
    }
    let selectors = [];
    if (option.selectors) {
      if (typeof option.selectors === "string") {
        selectors = $parent ? Array.from($parent.querySelectorAll(option.selectors)) : Array.from(document.querySelectorAll(option.selectors));
      } else if (option.selectors instanceof Element) {
        selectors.push(option.selectors);
      } else {
        if (Array.isArray(option.selectors.value)) {
          for (const element of option.selectors.value) {
            if (element instanceof Element) {
              selectors.push(element);
            } else {
              selectors.push(element.$el);
            }
          }
        } else {
          selectors.push(option.selectors.value);
        }
      }
    } else {
      const $children = Array.from($parent.children);
      selectors = $children.filter((selector) => {
        return isFocusable(selector) && isVisible(selector);
      });
    }
    return selectors;
  };
  const getEventListener = (option) => {
    return (event) => {
      const activeKey = eventKeyMap[event.key] || event.key.toLowerCase();
      if (modifierKeys.includes(activeKey))
        return;
      const handlers = option.handlers || defaultKeypressHandlers;
      for (const key of Object.keys(handlers)) {
        const [eventType, ...keys] = key.split(".");
        if (eventType !== "keydown") {
          continue;
        }
        if (keys.includes(activeKey)) {
          const listener = handlers[key];
          const hasModifier = keys.filter((key2) => modifierKeys.includes(key2));
          const isModifierActive = modifierKeys.some((key2) => {
            const modifierKey = key2.charAt(0).toUpperCase() + key2.slice(1);
            return event.getModifierState(modifierKey);
          });
          if (hasModifier.length > 0) {
            if (isModifierActive) {
              for (const modifier of modifierKeys) {
                if (keys.includes(modifier)) {
                  const modifierKey = modifier.charAt(0).toUpperCase() + modifier.slice(1);
                  if (event.getModifierState(modifierKey)) {
                    listener(event);
                  }
                }
              }
            }
          } else {
            if (!isModifierActive) {
              listener(event);
            }
          }
        }
      }
    };
  };
  onMounted(() => {
    for (const option of options) {
      const selectors = getSelectors(option);
      for (const selector of selectors) {
        selector.addEventListener("keydown", getEventListener(option));
      }
    }
  });
  onBeforeUnmount(() => {
    for (const option of options) {
      const selectors = getSelectors(option);
      for (const selector of selectors) {
        selector.removeEventListener("keydown", getEventListener(option));
      }
    }
  });
}
const _hoisted_1$2 = ["data-colindex", "data-rowindex", "data-editable", "contenteditable"];
const _sfc_main$4$1 = /* @__PURE__ */ defineComponent({
  __name: "ACell",
  props: {
    colIndex: null,
    rowIndex: null,
    tableid: null
  },
  setup(__props) {
    var _a2;
    const props = __props;
    const tableData = inject(props.tableid);
    const cell = ref(null);
    let cellModified = ref(false);
    const displayValue = computed(() => {
      const data = tableData.cellData(props.colIndex, props.rowIndex);
      if (tableData.columns[props.colIndex].format) {
        const format = tableData.columns[props.colIndex].format;
        if (typeof format === "function") {
          return format(data);
        } else if (typeof format === "string") {
          const formatFn = Function(`"use strict";return (${format})`)();
          return formatFn(data);
        } else {
          return data;
        }
      } else {
        return data;
      }
    });
    const handleInput = () => {
      if (tableData.columns[props.colIndex].mask)
        ;
      if (tableData.columns[props.colIndex].component) {
        const domRect = cell.value.getBoundingClientRect();
        tableData.modal.visible = true;
        tableData.modal.colIndex = props.colIndex;
        tableData.modal.rowIndex = props.rowIndex;
        tableData.modal.parent = cell.value;
        tableData.modal.top = domRect.top + domRect.height;
        tableData.modal.left = domRect.left;
        tableData.modal.width = cellWidth.value;
        tableData.modal.component = tableData.columns[props.colIndex].component;
      }
    };
    useKeyboardNav([
      {
        selectors: cell,
        handlers: {
          ...defaultKeypressHandlers,
          ...{
            "keydown.f2": handleInput,
            "keydown.alt.up": handleInput,
            "keydown.alt.down": handleInput,
            "keydown.alt.left": handleInput,
            "keydown.alt.right": handleInput
          }
        }
      }
    ]);
    const textAlign = computed(() => {
      return tableData.columns[props.colIndex].align || "center";
    });
    const cellWidth = computed(() => {
      return tableData.columns[props.colIndex].width || "40ch";
    });
    let currentData = "";
    const onFocus = () => {
      if (cell.value) {
        currentData = cell.value.innerText;
      }
    };
    const onChange = () => {
      if (cell.value) {
        if (cell.value.innerHTML !== currentData) {
          currentData = cell.value.innerText;
          cell.value.dispatchEvent(new Event("change"));
          cellModified.value = true;
        }
      }
    };
    const getIndent = (colKey, indent) => {
      if (indent && colKey === 0 && indent > 0) {
        return `${indent}ch`;
      } else {
        return "inherit";
      }
    };
    const cellStyle = {
      textAlign: textAlign.value,
      width: cellWidth.value,
      backgroundColor: !cellModified.value ? "inherit" : "var(--cell-modified-color)",
      fontWeight: !cellModified.value ? "inherit" : "bold",
      paddingLeft: getIndent(props.colIndex, (_a2 = tableData.display[props.rowIndex]) == null ? void 0 : _a2.indent)
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("td", {
        ref_key: "cell",
        ref: cell,
        "data-colindex": __props.colIndex,
        "data-rowindex": __props.rowIndex,
        "data-editable": unref(tableData).columns[__props.colIndex].edit,
        contenteditable: unref(tableData).columns[__props.colIndex].edit,
        tabindex: 0,
        spellcheck: false,
        style: cellStyle,
        onFocus,
        onPaste: onChange,
        onBlur: onChange,
        onInput: onChange,
        onClick: handleInput
      }, toDisplayString(unref(displayValue)), 41, _hoisted_1$2);
    };
  }
});
const _export_sfc$2 = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const ACell = /* @__PURE__ */ _export_sfc$2(_sfc_main$4$1, [["__scopeId", "data-v-c8072902"]]);
const _sfc_main$3$1 = /* @__PURE__ */ defineComponent({
  __name: "ARow",
  props: {
    row: null,
    rowIndex: null,
    tableid: null
  },
  setup(__props) {
    const props = __props;
    const tableData = inject(props.tableid);
    const numberedRowStyle = {
      backgroundColor: "var(--brand-color)",
      borderColor: "var(--header-border-color)",
      color: "var(--header-text-color)",
      fontWeight: "bold",
      textAlign: "center",
      userSelect: "none",
      width: tableData.numberedRowWidth.value
    };
    const treeRowStyle = {
      backgroundColor: "var(--brand-color)",
      borderColor: "var(--header-border-color)",
      color: "var(--header-text-color)",
      fontWeight: "bold",
      textAlign: "center",
      userSelect: "none",
      width: "2ch"
    };
    const getRowExpandSymbol = () => {
      if (!tableData.config.treeView) {
        return "";
      }
      if (tableData.display[props.rowIndex].isRoot) {
        if (tableData.display[props.rowIndex].childrenOpen) {
          return "-";
        } else {
          return "+";
        }
      }
      if (tableData.display[props.rowIndex].isParent) {
        if (tableData.display[props.rowIndex].childrenOpen) {
          return "-";
        } else {
          return "+";
        }
      } else {
        return "";
      }
    };
    const rowVisible = () => {
      if (!tableData.config.treeView) {
        return true;
      }
      return tableData.display[props.rowIndex].isRoot || tableData.display[props.rowIndex].open;
    };
    const toggleRowExpand = (rowIndex) => {
      tableData.toggleRowExpand(rowIndex);
    };
    return (_ctx, _cache) => {
      return withDirectives((openBlock(), createElementBlock("tr", null, [
        unref(tableData).config.numberedRows ? (openBlock(), createElementBlock("td", {
          key: 0,
          id: "row-index",
          tabIndex: -1,
          style: numberedRowStyle
        }, toDisplayString(__props.rowIndex + 1), 1)) : createCommentVNode("", true),
        unref(tableData).config.treeView ? (openBlock(), createElementBlock("td", {
          key: 1,
          id: "row-index",
          tabIndex: -1,
          style: treeRowStyle,
          onClick: _cache[0] || (_cache[0] = ($event) => toggleRowExpand(__props.rowIndex))
        }, toDisplayString(getRowExpandSymbol()), 1)) : createCommentVNode("", true),
        !unref(tableData).config.numberedRows && !unref(tableData).config.treeView ? renderSlot(_ctx.$slots, "indexCell", { key: 2 }) : createCommentVNode("", true),
        renderSlot(_ctx.$slots, "default")
      ], 512)), [
        [vShow, rowVisible()]
      ]);
    };
  }
});
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== "undefined" && typeof msCrypto.getRandomValues === "function" && msCrypto.getRandomValues.bind(msCrypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
const REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
function validate(uuid) {
  return typeof uuid === "string" && REGEX.test(uuid);
}
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).substr(1));
}
function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  if (!validate(uuid)) {
    throw TypeError("Stringified UUID is invalid");
  }
  return uuid;
}
function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return stringify(rnds);
}
class TableDataStore {
  constructor(id, columns, rows, config, table, display) {
    this.id = id || v4();
    this.rows = rows;
    this.columns = reactive(columns);
    this.config = reactive(config);
    this.table = table || reactive(this.createTableObject());
    this.display = this.createDisplayObject(display);
    this.modal = reactive({ visible: false });
  }
  createTableObject() {
    const table = {};
    for (const [colIndex, column] of this.columns.entries()) {
      for (const [rowIndex, row] of this.rows.entries()) {
        table[`${colIndex}:${rowIndex}`] = row[column.name];
      }
    }
    return table;
  }
  createDisplayObject(display) {
    const defaultDisplay = [Object.assign({}, { modified: false })];
    if (display) {
      if ("0:0" in display) {
        return display;
      }
    }
    const parents = /* @__PURE__ */ new Set();
    for (let rowIndex = this.rows.length - 1; rowIndex >= 0; rowIndex--) {
      const row = this.rows[rowIndex];
      if (row.parent) {
        parents.add(row.parent);
      }
      defaultDisplay[rowIndex] = {
        childrenOpen: false,
        indent: row.indent || null,
        isParent: parents.has(rowIndex),
        isRoot: row.parent === null || row.parent === void 0,
        modified: false,
        open: row.parent === null || row.parent === void 0,
        parent: row.parent
      };
    }
    return reactive(defaultDisplay);
  }
  get zeroColumn() {
    return this.config.numberedRows || this.config.treeView;
  }
  get numberedRowWidth() {
    return computed(() => {
      return String(Math.ceil(this.rows.length / 100) + 1) + "ch";
    });
  }
  cellData(colIndex, rowIndex) {
    return this.table[`${colIndex}:${rowIndex}`];
  }
  setCellData(rowIndex, colIndex, value) {
    if (this.table[`${colIndex}:${rowIndex}`] !== value) {
      this.display[rowIndex].modified = true;
    }
    this.table[`${colIndex}:${rowIndex}`] = value;
    return this.table[`${colIndex}:${rowIndex}`];
  }
  toggleRowExpand(rowIndex) {
    if (!this.config.treeView) {
      return;
    }
    this.display[rowIndex].childrenOpen = !this.display[rowIndex].childrenOpen;
    for (let index = this.rows.length - 1; index >= 0; index--) {
      if (this.display[index].parent === rowIndex) {
        this.display[index].open = !this.display[index].open;
        if (this.display[index].childrenOpen) {
          this.toggleRowExpand(index);
        }
      }
    }
  }
}
const _sfc_main$2$1 = defineComponent({
  name: "ATableHeader",
  props: {
    columns: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      default: () => new Object()
    },
    tableid: {
      type: String
    }
  },
  setup(props) {
    const tableData = inject(props.tableid);
    return { tableData };
  }
});
const _hoisted_1$1$1 = { key: 0 };
const _hoisted_2$1 = { tabindex: "-1" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.columns.length ? (openBlock(), createElementBlock("thead", _hoisted_1$1$1, [
    createElementVNode("tr", _hoisted_2$1, [
      _ctx.tableData.zeroColumn ? (openBlock(), createElementBlock("th", {
        key: 0,
        style: normalizeStyle({ minWidth: _ctx.tableData.numberedRowWidth.value })
      }, null, 4)) : createCommentVNode("", true),
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.columns, (column, colKey) => {
        var _a2;
        return openBlock(), createElementBlock("th", {
          key: colKey,
          tabindex: "-1",
          style: normalizeStyle({
            textAlign: ((_a2 = column.align) == null ? void 0 : _a2.toLowerCase()) || "center",
            minWidth: column.width || "40ch"
          })
        }, [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createTextVNode(toDisplayString(column.label || String.fromCharCode(colKey + 97).toUpperCase()), 1)
          ], true)
        ], 4);
      }), 128))
    ])
  ])) : createCommentVNode("", true);
}
const ATableHeader = /* @__PURE__ */ _export_sfc$2(_sfc_main$2$1, [["render", _sfc_render$2], ["__scopeId", "data-v-80fa6b2a"]]);
const _sfc_main$1$1 = /* @__PURE__ */ defineComponent({
  __name: "ATableModal",
  props: {
    colIndex: null,
    rowIndex: null,
    tableid: null
  },
  setup(__props) {
    const props = __props;
    inject(props.tableid);
    const handleInput = (event) => {
      event.stopPropagation();
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref: "amodal",
        class: "amodal",
        tabindex: "-1",
        onClick: handleInput,
        onInput: handleInput
      }, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 544);
    };
  }
});
const ATableModal = /* @__PURE__ */ _export_sfc$2(_sfc_main$1$1, [["__scopeId", "data-v-1bd2b677"]]);
const _hoisted_1$3 = { class: "atable" };
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ATable",
  props: {
    id: null,
    columns: null,
    rows: { default: () => [] },
    config: { default: () => new Object() },
    tableid: null
  },
  setup(__props) {
    const props = __props;
    let tableData = new TableDataStore(props.id, props.columns, props.rows, props.config);
    provide(tableData.id, tableData);
    const clickOutside = (event) => {
      var _a2;
      if (!((_a2 = tableData.modal.parent) == null ? void 0 : _a2.contains(event.target))) {
        if (tableData.modal.visible) {
          tableData.modal.visible = false;
        }
      }
    };
    window.addEventListener("click", clickOutside);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (tableData.modal.visible) {
          tableData.modal.visible = false;
          const $parent = tableData.modal.parent;
          if ($parent) {
            void nextTick().then(() => {
              const rowIndex = $parent.dataset.rowindex;
              const colIndex = $parent.dataset.colindex;
              const $parentCell = document.querySelectorAll(`[data-rowindex='${rowIndex}'][data-colindex='${colIndex}']`);
              if ($parentCell) {
                $parentCell[0].focus();
              }
            });
          }
        }
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("table", _hoisted_1$3, [
        renderSlot(_ctx.$slots, "tableheader", {}, () => [
          createVNode(ATableHeader, {
            columns: unref(tableData).columns,
            config: unref(tableData).config,
            tableid: unref(tableData).id
          }, null, 8, ["columns", "config", "tableid"])
        ], true),
        createElementVNode("tbody", null, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(tableData).rows, (row, rowIndex) => {
            return openBlock(), createBlock(_sfc_main$3$1, {
              key: row.id || unref(v4)(),
              row,
              rowIndex,
              tableid: unref(tableData).id
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(tableData).columns, (col, colIndex) => {
                  var _a2;
                  return openBlock(), createBlock(ACell, {
                    key: colIndex,
                    tableid: unref(tableData).id,
                    col,
                    spellcheck: "false",
                    rowIndex,
                    colIndex: colIndex + (unref(tableData).zeroColumn ? 0 : -1),
                    style: normalizeStyle({
                      textAlign: ((_a2 = col == null ? void 0 : col.align) == null ? void 0 : _a2.toLowerCase()) || "center",
                      minWidth: (col == null ? void 0 : col.width) || "40ch"
                    })
                  }, null, 8, ["tableid", "col", "rowIndex", "colIndex", "style"]);
                }), 128))
              ]),
              _: 2
            }, 1032, ["row", "rowIndex", "tableid"]);
          }), 128))
        ]),
        renderSlot(_ctx.$slots, "footer", {}, void 0, true),
        withDirectives(createVNode(ATableModal, {
          colIndex: unref(tableData).modal.colIndex,
          rowIndex: unref(tableData).modal.rowIndex,
          tableid: unref(tableData).id,
          style: normalizeStyle({
            left: unref(tableData).modal.left + "px",
            top: unref(tableData).modal.top + "px",
            maxWidth: unref(tableData).modal.width + "px"
          })
        }, {
          default: withCtx(() => [
            (openBlock(), createBlock(resolveDynamicComponent(unref(tableData).modal.component), {
              key: `${unref(tableData).modal.rowIndex}:${unref(tableData).modal.colIndex}`,
              colIndex: unref(tableData).modal.colIndex,
              rowIndex: unref(tableData).modal.rowIndex,
              tableid: unref(tableData).id
            }, null, 8, ["colIndex", "rowIndex", "tableid"]))
          ]),
          _: 1
        }, 8, ["colIndex", "rowIndex", "tableid", "style"]), [
          [vShow, unref(tableData).modal.visible]
        ])
      ]);
    };
  }
});
const ATable = /* @__PURE__ */ _export_sfc$2(_sfc_main$5, [["__scopeId", "data-v-5c0ccd5d"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Records",
  setup(__props) {
    const data = [
      { subject: "First To Do" },
      { subject: "Second To Do" },
      { subject: "Third To Do" },
      { subject: "Fourth To Do" }
    ];
    const records = reactive({
      rows: data,
      columns: [
        {
          label: "Subject",
          name: "subject",
          type: "Data",
          align: "left",
          edit: false,
          width: "35ch"
        }
      ],
      config: { numberedRows: true, treeView: false }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ATable), {
        columns: records.columns,
        rows: records.rows,
        config: records.config
      }, null, 8, ["columns", "rows", "config"]);
    };
  }
});
defineComponent({
  name: "AComboBox",
  props: ["event", "cellData", "tableID"]
});
const _export_sfc$1 = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
var _a;
const isClient = typeof window !== "undefined";
isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function identity(arg) {
  return arg;
}
const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey = "__vueuse_ssr_handlers__";
_global[globalKey] = _global[globalKey] || {};
_global[globalKey];
var SwipeDirection;
(function(SwipeDirection2) {
  SwipeDirection2["UP"] = "UP";
  SwipeDirection2["RIGHT"] = "RIGHT";
  SwipeDirection2["DOWN"] = "DOWN";
  SwipeDirection2["LEFT"] = "LEFT";
  SwipeDirection2["NONE"] = "NONE";
})(SwipeDirection || (SwipeDirection = {}));
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const _TransitionPresets = {
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
__spreadValues({
  linear: identity
}, _TransitionPresets);
const _sfc_main$4 = defineComponent({
  name: "AForm",
  props: {
    schema: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    formId: {
      type: Number
    }
  },
  setup(props) {
    const formData = ref(props.data || {});
    const componentProps = (componentObj) => {
      let propsToPass = {};
      for (const [key, value] of Object.entries(componentObj)) {
        if (!["component", "fieldtype"].includes(key)) {
          propsToPass[key] = value;
        }
      }
      return propsToPass;
    };
    return { formData, componentProps };
  }
});
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("form", null, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.schema, (componentObj, key) => {
      return openBlock(), createBlock(resolveDynamicComponent(componentObj.component), mergeProps({
        key,
        schema: componentObj
      }, _ctx.componentProps(componentObj), {
        value: _ctx.formData[componentObj.fieldname]
      }), null, 16, ["schema", "value"]);
    }), 128))
  ]);
}
const AForm = /* @__PURE__ */ _export_sfc$1(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-56233342"]]);
const _sfc_main$3 = defineComponent({
  props: {
    collapsed: {
      type: Boolean,
      required: true
    }
  }
});
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", {
    class: normalizeClass(["collapse-button", _ctx.collapsed ? "rotated" : "unrotated"])
  }, "\xD7", 2);
}
const CollapseButton = /* @__PURE__ */ _export_sfc$1(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-5f720483"]]);
defineComponent({
  name: "AFieldset",
  components: { AForm, CollapseButton },
  props: {
    schema: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    collapsible: {
      type: Boolean
    },
    value: { required: false }
  },
  setup(props) {
    const formData = ref(props.data || []);
    let collapsed = ref(false);
    let collapsible = ref(props.collapsible);
    function toggleCollapse(e) {
      e.preventDefault();
      if (!collapsible.value) {
        return;
      }
      collapsed.value = !collapsed.value;
    }
    return { formData, collapsed, toggleCollapse };
  }
});
defineComponent({
  name: "ANumericInput",
  props: {
    value: { required: false },
    required: {
      type: Boolean
    },
    label: {
      type: String,
      required: true
    },
    readOnly: {
      type: Boolean
    },
    uuid: {
      type: String
    },
    validation: {
      type: Object,
      default: () => ({ errorMessage: "&nbsp;" })
    }
  },
  setup(props, context) {
    const amount = ref("");
    const update = (event) => {
      const value = event.target.value;
      context.emit("update:value", value);
    };
    return { amount, update };
  }
});
const NAMED_MASKS = {
  date: "##/##/####",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
function extractMaskFn(mask) {
  try {
    return Function(`"use strict";return (${mask})`)();
  } catch (error) {
  }
}
function getMask(binding) {
  var _a2;
  let mask = binding.value;
  if (mask) {
    const maskFn = extractMaskFn(mask);
    if (maskFn) {
      const locale = binding.instance["locale"];
      mask = maskFn(locale);
    }
  } else {
    const schema = binding.instance["schema"];
    const fieldType = (_a2 = schema.fieldtype) == null ? void 0 : _a2.toLowerCase();
    if (fieldType && NAMED_MASKS[fieldType]) {
      mask = NAMED_MASKS[fieldType];
    }
  }
  return mask;
}
function unmaskInput(input, maskToken) {
  if (!maskToken) {
    maskToken = "#";
  }
  let unmaskedInput = input;
  const maskChars = [maskToken, "/", "-", "(", ")", " "];
  for (const char of maskChars) {
    unmaskedInput = unmaskedInput.replaceAll(char, "");
  }
  return unmaskedInput;
}
function fillMask(input, mask, maskToken) {
  if (!maskToken) {
    maskToken = "#";
  }
  let replacement = mask;
  for (const inputChar of input) {
    const replaceIndex = replacement.indexOf(maskToken);
    if (replaceIndex !== -1) {
      const prefix = replacement.substring(0, replaceIndex);
      const suffix = replacement.substring(replaceIndex + 1);
      replacement = prefix + inputChar + suffix;
    }
  }
  return replacement.slice(0, mask.length);
}
function useStringMask(el, binding) {
  const mask = getMask(binding);
  if (!mask)
    return;
  const maskToken = "#";
  const inputText = el.value;
  const unmaskedInput = unmaskInput(inputText, maskToken);
  if (unmaskedInput) {
    const replacement = fillMask(unmaskedInput, mask, maskToken);
    if (binding.instance["maskFilled"]) {
      binding.instance["maskFilled"] = !replacement.includes(maskToken);
    }
    el.value = replacement;
  } else {
    el.value = mask;
  }
}
const _sfc_main$1 = defineComponent({
  name: "ATextInput",
  props: {
    schema: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    value: {
      type: null
    },
    mask: {
      type: String
    },
    required: {
      type: Boolean
    },
    readOnly: {
      type: Boolean
    },
    uuid: {
      type: String
    },
    validation: {
      type: Object,
      default: () => ({ errorMessage: "&nbsp;" })
    }
  },
  setup(props, context) {
    const inputText = ref(props.value);
    const maskFilled = ref(false);
    const locale = inject("locale", "");
    const update = (event) => {
      const value = event.target.value;
      context.emit("update:value", value);
    };
    return { inputText, locale, maskFilled, update };
  },
  directives: {
    mask: useStringMask
  }
});
const _hoisted_1$1 = ["id", "disabled", "maxlength", "required"];
const _hoisted_2 = ["for"];
const _hoisted_3 = ["innerHTML"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_mask = resolveDirective("mask");
  return openBlock(), createElementBlock("div", null, [
    withDirectives(createElementVNode("input", {
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.inputText = $event),
      id: _ctx.uuid,
      disabled: _ctx.readOnly,
      maxlength: _ctx.mask ? _ctx.maskFilled && _ctx.mask.length : void 0,
      required: _ctx.required,
      onInput: _cache[1] || (_cache[1] = (...args) => _ctx.update && _ctx.update(...args))
    }, null, 40, _hoisted_1$1), [
      [vModelText, _ctx.inputText],
      [_directive_mask, _ctx.mask]
    ]),
    createElementVNode("label", { for: _ctx.uuid }, toDisplayString(_ctx.label), 9, _hoisted_2),
    withDirectives(createElementVNode("p", {
      innerHTML: _ctx.validation.errorMessage
    }, null, 8, _hoisted_3), [
      [vShow, _ctx.validation.errorMessage]
    ])
  ]);
}
const ATextInput = /* @__PURE__ */ _export_sfc$1(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-58bab3b3"]]);
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = defineComponent({
  name: "Doctype",
  components: {
    AForm
  },
  setup(props) {
    const basic_form_schema = [
      {
        fieldname: "first_name",
        component: ATextInput,
        label: "First Name"
      },
      {
        fieldname: "last_name",
        component: ATextInput,
        label: "Last Name"
      },
      {
        fieldname: "date",
        fieldtype: "Date",
        component: ATextInput,
        label: "Date"
      },
      {
        fieldname: "phone",
        fieldtype: "Phone",
        component: ATextInput,
        label: "Phone",
        mask: "(locale) => { if (locale === 'en-US') { return '(###) ###-####' } else if (locale === 'en-IN') { return '####-######'} }"
      }
    ];
    let data = reactive([
      {
        first_name: "John",
        last_name: "Doe",
        date: 1662506721254,
        phone: "18005551234"
      }
    ]);
    let id = ref(123456);
    const formKey = ref(0);
    return { basic_form_schema, data, id, formKey };
  }
});
const _hoisted_1 = /* @__PURE__ */ createElementVNode("h3", null, "Doctype", -1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_AForm = resolveComponent("AForm");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createElementVNode("pre", null, toDisplayString(), 1),
    (openBlock(), createBlock(_component_AForm, {
      class: "aform-main",
      schema: _ctx.basic_form_schema,
      data: _ctx.data,
      formId: _ctx.id,
      key: _ctx.formKey
    }, null, 8, ["schema", "data", "formId"]))
  ]);
}
const Doctype = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
const Doctype$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Doctype
}, Symbol.toStringTag, { value: "Module" }));
class Registry {
  constructor(router2, schemaLoader = void 0) {
    if (Registry._root) {
      return Registry._root;
    }
    Registry._root = this;
    this.name = "Registry";
    this.router = router2;
    this.schemaLoader = schemaLoader;
    this.registry = {};
  }
  loadDoctypeSchema(doctype) {
    if (doctype.schemaLoader) {
      return doctype.schemaLoader();
    }
    return this.schemaLoader(doctype.doctype);
  }
  addDoctype(doctype) {
    if (!(doctype.doctype in Object.keys(this.registry))) {
      this.registry[doctype.doctype] = doctype;
    }
    if (!this.router.hasRoute(doctype.slug)) {
      this.router.addRoute({
        path: `/${doctype.slug}`,
        name: doctype.slug,
        component: doctype.schema.recordsComponent || _sfc_main$2
      });
      this.router.addRoute({ path: `/${doctype.slug}:id`, component: doctype.schema.component || Doctype });
    }
  }
}
const Stonecrop = {
  install: (app, options) => {
    app.use(router);
    app.config.globalProperties.$registry = new Registry(router, options.schemaLoader);
  }
};
export {
  Stonecrop as S,
  _sfc_main$2 as _
};