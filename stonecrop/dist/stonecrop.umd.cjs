(function(global2, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("vue")) : typeof define === "function" && define.amd ? define(["exports", "vue"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2["@agritheory/stonecrop"] = {}, global2.Vue));
})(this, function(exports2, vue) {
  "use strict";
  let Stonecrop$1 = class Stonecrop2 {
    /**
     * @constructor
     * @param {Registry} registry - The immutable registry
     * @param {ReturnType<typeof useDataStore>} store - The mutable Pinia store
     * @param {Schema} [schema] - (optional) The Stonecrop schema
     * @param {ImmutableDoctype['workflow']} [workflow] - (optional) The Stonecrop workflow
     * @param {ImmutableDoctype['actions']} [actions] - (optional) The Stonecrop actions
     * @returns {Stonecrop} The Stonecrop instance
     */
    constructor(registry, store, schema, workflow, actions) {
      this.name = "Stonecrop";
      if (Stonecrop2._root) {
        return Stonecrop2._root;
      }
      Stonecrop2._root = this;
      this.registry = registry;
      this.store = store;
      this.schema = schema;
      this.workflow = workflow;
      this.actions = actions;
    }
    /**
     * @method setup
     * @param {Doctype} doctype - The doctype to setup
     * @returns {void}
     * @description Sets up the Stonecrop instance with the given doctype
     * @example
     * const doctype = await registry.doctypeLoader('Task')
     * stonecrop.setup(doctype)
     */
    setup(doctype) {
      this.getMeta(doctype);
      this.getWorkflow(doctype);
      this.getActions(doctype);
    }
    /**
     * @method getMeta
     * @param {Doctype} doctype - The doctype to get meta for
     * @returns {void}
     * @description Gets the meta for the given doctype
     * @example
     * const doctype = await registry.doctypeLoader('Task')
     * stonecrop.getMeta(doctype)
     */
    getMeta(doctype) {
      this.schema = { doctype: doctype.doctype, schema: doctype.schema };
    }
    /**
     * @method getWorkflow
     * @param {Doctype} doctype - The doctype to get workflow for
     * @returns {void}
     * @description Gets the workflow for the given doctype
     * @example
     * const doctype = await registry.doctypeLoader('Task')
     * stonecrop.getWorkflow(doctype)
     */
    getWorkflow(doctype) {
      const doctypeRegistry = this.registry.registry[doctype.slug];
      this.workflow = doctypeRegistry.workflow;
    }
    /**
     * @method getActions
     * @param {Doctype} doctype - The doctype to get actions for
     * @returns {void}
     * @description Gets the actions for the given doctype
     * @example
     * const doctype = await registry.doctypeLoader('Task')
     * stonecrop.getActions(doctype)
     */
    getActions(doctype) {
      const doctypeRegistry = this.registry.registry[doctype.slug];
      this.actions = doctypeRegistry.actions;
    }
    /**
     * @method getRecords
     * @param {Doctype} doctype - The doctype to get records for
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
    async getRecords(doctype, filters) {
      this.store.$patch({ records: [] });
      const records = await fetch(`/${doctype.slug}`, filters);
      const data = await records.json();
      this.store.$patch({ records: data });
    }
    /**
     * @method getRecord
     * @param {Doctype} doctype - The doctype to get record for
     * @param {string} id - The id of the record to get
     * @returns {Promise<void>}
     * @description Gets the record for the given doctype and id
     * @example
     * const doctype = await registry.doctypeLoader('Task')
     * await stonecrop.getRecord(doctype, 'TASK-00001')
     */
    async getRecord(doctype, id) {
      this.store.$patch({ record: {} });
      const record = await fetch(`/${doctype.slug}/${id}`);
      const data = await record.json();
      this.store.$patch({ record: data });
    }
    /**
     * @method runAction
     * @param {Doctype} doctype - The doctype to run action for
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
    runAction(doctype, action, id) {
      const doctypeRegistry = this.registry.registry[doctype.slug];
      const actions = doctypeRegistry.actions.get(action);
      const { initialState } = this.workflow;
      this.workflow.transition(initialState, { type: action });
      if (actions.length > 0) {
        actions.forEach((action2) => {
          const actionFn = new Function(action2);
          actionFn(id);
        });
      }
    }
  };
  var isVue2 = false;
  function set(target, key, val) {
    if (Array.isArray(target)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val;
    }
    target[key] = val;
    return val;
  }
  function del(target, key) {
    if (Array.isArray(target)) {
      target.splice(key, 1);
      return;
    }
    delete target[key];
  }
  function getDevtoolsGlobalHook$1() {
    return getTarget$1().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget$1() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  }
  const isProxyAvailable$1 = typeof Proxy === "function";
  const HOOK_SETUP$1 = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET$1 = "plugin:settings:set";
  let supported$1;
  let perf$1;
  function isPerformanceSupported$1() {
    var _a;
    if (supported$1 !== void 0) {
      return supported$1;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported$1 = true;
      perf$1 = window.performance;
    } else if (typeof global !== "undefined" && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
      supported$1 = true;
      perf$1 = global.perf_hooks.performance;
    } else {
      supported$1 = false;
    }
    return supported$1;
  }
  function now$2() {
    return isPerformanceSupported$1() ? perf$1.now() : Date.now();
  }
  let ApiProxy$1 = class ApiProxy {
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
          return now$2();
        }
      };
      if (hook) {
        hook.on(HOOK_PLUGIN_SETTINGS_SET$1, (pluginId, value) => {
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
  };
  function setupDevtoolsPlugin$1(pluginDescriptor, setupFn) {
    const descriptor = pluginDescriptor;
    const target = getTarget$1();
    const hook = getDevtoolsGlobalHook$1();
    const enableProxy = isProxyAvailable$1 && descriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP$1, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy$1(descriptor, hook) : null;
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
    * pinia v2.0.33
    * (c) 2023 Eduardo San Martin Morote
    * @license MIT
    */
  let activePinia;
  const setActivePinia = (pinia2) => activePinia = pinia2;
  const piniaSymbol = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
    /* istanbul ignore next */
    Symbol()
  );
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  const IS_CLIENT = typeof window !== "undefined";
  const USE_DEVTOOLS = (process.env.NODE_ENV !== "production" || false) && !(process.env.NODE_ENV === "test") && IS_CLIENT;
  const _global = /* @__PURE__ */ (() => typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null })();
  function bom(blob, { autoBom = false } = {}) {
    if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
    }
    return blob;
  }
  function download(url, name, opts) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = function() {
      saveAs(xhr.response, name, opts);
    };
    xhr.onerror = function() {
      console.error("could not download file");
    };
    xhr.send();
  }
  function corsEnabled(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    try {
      xhr.send();
    } catch (e) {
    }
    return xhr.status >= 200 && xhr.status <= 299;
  }
  function click(node) {
    try {
      node.dispatchEvent(new MouseEvent("click"));
    } catch (e) {
      const evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
      node.dispatchEvent(evt);
    }
  }
  const _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
  const isMacOSWebView = /* @__PURE__ */ (() => /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent))();
  const saveAs = !IS_CLIENT ? () => {
  } : (
    // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
    typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : (
      // Use msSaveOrOpenBlob as a second approach
      "msSaveOrOpenBlob" in _navigator ? msSaveAs : (
        // Fallback to using FileReader and a popup
        fileSaverSaveAs
      )
    )
  );
  function downloadSaveAs(blob, name = "download", opts) {
    const a = document.createElement("a");
    a.download = name;
    a.rel = "noopener";
    if (typeof blob === "string") {
      a.href = blob;
      if (a.origin !== location.origin) {
        if (corsEnabled(a.href)) {
          download(blob, name, opts);
        } else {
          a.target = "_blank";
          click(a);
        }
      } else {
        click(a);
      }
    } else {
      a.href = URL.createObjectURL(blob);
      setTimeout(function() {
        URL.revokeObjectURL(a.href);
      }, 4e4);
      setTimeout(function() {
        click(a);
      }, 0);
    }
  }
  function msSaveAs(blob, name = "download", opts) {
    if (typeof blob === "string") {
      if (corsEnabled(blob)) {
        download(blob, name, opts);
      } else {
        const a = document.createElement("a");
        a.href = blob;
        a.target = "_blank";
        setTimeout(function() {
          click(a);
        });
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name);
    }
  }
  function fileSaverSaveAs(blob, name, opts, popup) {
    popup = popup || open("", "_blank");
    if (popup) {
      popup.document.title = popup.document.body.innerText = "downloading...";
    }
    if (typeof blob === "string")
      return download(blob, name, opts);
    const force = blob.type === "application/octet-stream";
    const isSafari = /constructor/i.test(String(_global.HTMLElement)) || "safari" in _global;
    const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
    if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onloadend = function() {
        let url = reader.result;
        if (typeof url !== "string") {
          popup = null;
          throw new Error("Wrong reader.result type");
        }
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
        if (popup) {
          popup.location.href = url;
        } else {
          location.assign(url);
        }
        popup = null;
      };
      reader.readAsDataURL(blob);
    } else {
      const url = URL.createObjectURL(blob);
      if (popup)
        popup.location.assign(url);
      else
        location.href = url;
      popup = null;
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 4e4);
    }
  }
  function toastMessage(message, type2) {
    const piniaMessage = "🍍 " + message;
    if (typeof __VUE_DEVTOOLS_TOAST__ === "function") {
      __VUE_DEVTOOLS_TOAST__(piniaMessage, type2);
    } else if (type2 === "error") {
      console.error(piniaMessage);
    } else if (type2 === "warn") {
      console.warn(piniaMessage);
    } else {
      console.log(piniaMessage);
    }
  }
  function isPinia(o) {
    return "_a" in o && "install" in o;
  }
  function checkClipboardAccess() {
    if (!("clipboard" in navigator)) {
      toastMessage(`Your browser doesn't support the Clipboard API`, "error");
      return true;
    }
  }
  function checkNotFocusedError(error) {
    if (error instanceof Error && error.message.toLowerCase().includes("document is not focused")) {
      toastMessage('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn");
      return true;
    }
    return false;
  }
  async function actionGlobalCopyState(pinia2) {
    if (checkClipboardAccess())
      return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(pinia2.state.value));
      toastMessage("Global state copied to clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to serialize the state. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalPasteState(pinia2) {
    if (checkClipboardAccess())
      return;
    try {
      pinia2.state.value = JSON.parse(await navigator.clipboard.readText());
      toastMessage("Global state pasted from clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to deserialize the state from clipboard. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalSaveState(pinia2) {
    try {
      saveAs(new Blob([JSON.stringify(pinia2.state.value)], {
        type: "text/plain;charset=utf-8"
      }), "pinia-state.json");
    } catch (error) {
      toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  let fileInput;
  function getFileOpener() {
    if (!fileInput) {
      fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
    }
    function openFile() {
      return new Promise((resolve, reject) => {
        fileInput.onchange = async () => {
          const files = fileInput.files;
          if (!files)
            return resolve(null);
          const file = files.item(0);
          if (!file)
            return resolve(null);
          return resolve({ text: await file.text(), file });
        };
        fileInput.oncancel = () => resolve(null);
        fileInput.onerror = reject;
        fileInput.click();
      });
    }
    return openFile;
  }
  async function actionGlobalOpenStateFile(pinia2) {
    try {
      const open2 = await getFileOpener();
      const result = await open2();
      if (!result)
        return;
      const { text, file } = result;
      pinia2.state.value = JSON.parse(text);
      toastMessage(`Global state imported from "${file.name}".`);
    } catch (error) {
      toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  function formatDisplay$1(display) {
    return {
      _custom: {
        display
      }
    };
  }
  const PINIA_ROOT_LABEL = "🍍 Pinia (root)";
  const PINIA_ROOT_ID = "_root";
  function formatStoreForInspectorTree(store) {
    return isPinia(store) ? {
      id: PINIA_ROOT_ID,
      label: PINIA_ROOT_LABEL
    } : {
      id: store.$id,
      label: store.$id
    };
  }
  function formatStoreForInspectorState(store) {
    if (isPinia(store)) {
      const storeNames = Array.from(store._s.keys());
      const storeMap = store._s;
      const state2 = {
        state: storeNames.map((storeId) => ({
          editable: true,
          key: storeId,
          value: store.state.value[storeId]
        })),
        getters: storeNames.filter((id) => storeMap.get(id)._getters).map((id) => {
          const store2 = storeMap.get(id);
          return {
            editable: false,
            key: id,
            value: store2._getters.reduce((getters, key) => {
              getters[key] = store2[key];
              return getters;
            }, {})
          };
        })
      };
      return state2;
    }
    const state = {
      state: Object.keys(store.$state).map((key) => ({
        editable: true,
        key,
        value: store.$state[key]
      }))
    };
    if (store._getters && store._getters.length) {
      state.getters = store._getters.map((getterName) => ({
        editable: false,
        key: getterName,
        value: store[getterName]
      }));
    }
    if (store._customProperties.size) {
      state.customProperties = Array.from(store._customProperties).map((key) => ({
        editable: true,
        key,
        value: store[key]
      }));
    }
    return state;
  }
  function formatEventData(events) {
    if (!events)
      return {};
    if (Array.isArray(events)) {
      return events.reduce((data, event) => {
        data.keys.push(event.key);
        data.operations.push(event.type);
        data.oldValue[event.key] = event.oldValue;
        data.newValue[event.key] = event.newValue;
        return data;
      }, {
        oldValue: {},
        keys: [],
        operations: [],
        newValue: {}
      });
    } else {
      return {
        operation: formatDisplay$1(events.type),
        key: formatDisplay$1(events.key),
        oldValue: events.oldValue,
        newValue: events.newValue
      };
    }
  }
  function formatMutationType(type2) {
    switch (type2) {
      case MutationType.direct:
        return "mutation";
      case MutationType.patchFunction:
        return "$patch";
      case MutationType.patchObject:
        return "$patch";
      default:
        return "unknown";
    }
  }
  let isTimelineActive = true;
  const componentStateTypes = [];
  const MUTATIONS_LAYER_ID = "pinia:mutations";
  const INSPECTOR_ID = "pinia";
  const { assign: assign$1 } = Object;
  const getStoreType = (id) => "🍍 " + id;
  function registerPiniaDevtools(app, pinia2) {
    setupDevtoolsPlugin$1({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app
    }, (api) => {
      if (typeof api.now !== "function") {
        toastMessage("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.");
      }
      api.addTimelineLayer({
        id: MUTATIONS_LAYER_ID,
        label: `Pinia 🍍`,
        color: 15064968
      });
      api.addInspector({
        id: INSPECTOR_ID,
        label: "Pinia 🍍",
        icon: "storage",
        treeFilterPlaceholder: "Search stores",
        actions: [
          {
            icon: "content_copy",
            action: () => {
              actionGlobalCopyState(pinia2);
            },
            tooltip: "Serialize and copy the state"
          },
          {
            icon: "content_paste",
            action: async () => {
              await actionGlobalPasteState(pinia2);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Replace the state with the content of your clipboard"
          },
          {
            icon: "save",
            action: () => {
              actionGlobalSaveState(pinia2);
            },
            tooltip: "Save the state as a JSON file"
          },
          {
            icon: "folder_open",
            action: async () => {
              await actionGlobalOpenStateFile(pinia2);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Import the state from a JSON file"
          }
        ],
        nodeActions: [
          {
            icon: "restore",
            tooltip: "Reset the state (option store only)",
            action: (nodeId) => {
              const store = pinia2._s.get(nodeId);
              if (!store) {
                toastMessage(`Cannot reset "${nodeId}" store because it wasn't found.`, "warn");
              } else if (!store._isOptionsAPI) {
                toastMessage(`Cannot reset "${nodeId}" store because it's a setup store.`, "warn");
              } else {
                store.$reset();
                toastMessage(`Store "${nodeId}" reset.`);
              }
            }
          }
        ]
      });
      api.on.inspectComponent((payload, ctx) => {
        const proxy = payload.componentInstance && payload.componentInstance.proxy;
        if (proxy && proxy._pStores) {
          const piniaStores = payload.componentInstance.proxy._pStores;
          Object.values(piniaStores).forEach((store) => {
            payload.instanceData.state.push({
              type: getStoreType(store.$id),
              key: "state",
              editable: true,
              value: store._isOptionsAPI ? {
                _custom: {
                  value: vue.toRaw(store.$state),
                  actions: [
                    {
                      icon: "restore",
                      tooltip: "Reset the state of this store",
                      action: () => store.$reset()
                    }
                  ]
                }
              } : (
                // NOTE: workaround to unwrap transferred refs
                Object.keys(store.$state).reduce((state, key) => {
                  state[key] = store.$state[key];
                  return state;
                }, {})
              )
            });
            if (store._getters && store._getters.length) {
              payload.instanceData.state.push({
                type: getStoreType(store.$id),
                key: "getters",
                editable: false,
                value: store._getters.reduce((getters, key) => {
                  try {
                    getters[key] = store[key];
                  } catch (error) {
                    getters[key] = error;
                  }
                  return getters;
                }, {})
              });
            }
          });
        }
      });
      api.on.getInspectorTree((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          let stores = [pinia2];
          stores = stores.concat(Array.from(pinia2._s.values()));
          payload.rootNodes = (payload.filter ? stores.filter((store) => "$id" in store ? store.$id.toLowerCase().includes(payload.filter.toLowerCase()) : PINIA_ROOT_LABEL.toLowerCase().includes(payload.filter.toLowerCase())) : stores).map(formatStoreForInspectorTree);
        }
      });
      api.on.getInspectorState((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia2 : pinia2._s.get(payload.nodeId);
          if (!inspectedStore) {
            return;
          }
          if (inspectedStore) {
            payload.state = formatStoreForInspectorState(inspectedStore);
          }
        }
      });
      api.on.editInspectorState((payload, ctx) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia2 : pinia2._s.get(payload.nodeId);
          if (!inspectedStore) {
            return toastMessage(`store "${payload.nodeId}" not found`, "error");
          }
          const { path } = payload;
          if (!isPinia(inspectedStore)) {
            if (path.length !== 1 || !inspectedStore._customProperties.has(path[0]) || path[0] in inspectedStore.$state) {
              path.unshift("$state");
            }
          } else {
            path.unshift("state");
          }
          isTimelineActive = false;
          payload.set(inspectedStore, path, payload.state.value);
          isTimelineActive = true;
        }
      });
      api.on.editComponentState((payload) => {
        if (payload.type.startsWith("🍍")) {
          const storeId = payload.type.replace(/^🍍\s*/, "");
          const store = pinia2._s.get(storeId);
          if (!store) {
            return toastMessage(`store "${storeId}" not found`, "error");
          }
          const { path } = payload;
          if (path[0] !== "state") {
            return toastMessage(`Invalid path for store "${storeId}":
${path}
Only state can be modified.`);
          }
          path[0] = "$state";
          isTimelineActive = false;
          payload.set(store, path, payload.state.value);
          isTimelineActive = true;
        }
      });
    });
  }
  function addStoreToDevtools(app, store) {
    if (!componentStateTypes.includes(getStoreType(store.$id))) {
      componentStateTypes.push(getStoreType(store.$id));
    }
    setupDevtoolsPlugin$1({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app,
      settings: {
        logStoreChanges: {
          label: "Notify about new/deleted stores",
          type: "boolean",
          defaultValue: true
        }
        // useEmojis: {
        //   label: 'Use emojis in messages ⚡️',
        //   type: 'boolean',
        //   defaultValue: true,
        // },
      }
    }, (api) => {
      const now2 = typeof api.now === "function" ? api.now.bind(api) : Date.now;
      store.$onAction(({ after, onError, name, args }) => {
        const groupId = runningActionId++;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🛫 " + name,
            subtitle: "start",
            data: {
              store: formatDisplay$1(store.$id),
              action: formatDisplay$1(name),
              args
            },
            groupId
          }
        });
        after((result) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              title: "🛬 " + name,
              subtitle: "end",
              data: {
                store: formatDisplay$1(store.$id),
                action: formatDisplay$1(name),
                args,
                result
              },
              groupId
            }
          });
        });
        onError((error) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              logType: "error",
              title: "💥 " + name,
              subtitle: "end",
              data: {
                store: formatDisplay$1(store.$id),
                action: formatDisplay$1(name),
                args,
                error
              },
              groupId
            }
          });
        });
      }, true);
      store._customProperties.forEach((name) => {
        vue.watch(() => vue.unref(store[name]), (newValue, oldValue) => {
          api.notifyComponentUpdate();
          api.sendInspectorState(INSPECTOR_ID);
          if (isTimelineActive) {
            api.addTimelineEvent({
              layerId: MUTATIONS_LAYER_ID,
              event: {
                time: now2(),
                title: "Change",
                subtitle: name,
                data: {
                  newValue,
                  oldValue
                },
                groupId: activeAction
              }
            });
          }
        }, { deep: true });
      });
      store.$subscribe(({ events, type: type2 }, state) => {
        api.notifyComponentUpdate();
        api.sendInspectorState(INSPECTOR_ID);
        if (!isTimelineActive)
          return;
        const eventData = {
          time: now2(),
          title: formatMutationType(type2),
          data: assign$1({ store: formatDisplay$1(store.$id) }, formatEventData(events)),
          groupId: activeAction
        };
        activeAction = void 0;
        if (type2 === MutationType.patchFunction) {
          eventData.subtitle = "⤵️";
        } else if (type2 === MutationType.patchObject) {
          eventData.subtitle = "🧩";
        } else if (events && !Array.isArray(events)) {
          eventData.subtitle = events.type;
        }
        if (events) {
          eventData.data["rawEvent(s)"] = {
            _custom: {
              display: "DebuggerEvent",
              type: "object",
              tooltip: "raw DebuggerEvent[]",
              value: events
            }
          };
        }
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: eventData
        });
      }, { detached: true, flush: "sync" });
      const hotUpdate = store._hotUpdate;
      store._hotUpdate = vue.markRaw((newStore) => {
        hotUpdate(newStore);
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🔥 " + store.$id,
            subtitle: "HMR update",
            data: {
              store: formatDisplay$1(store.$id),
              info: formatDisplay$1(`HMR update`)
            }
          }
        });
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
      });
      const { $dispose } = store;
      store.$dispose = () => {
        $dispose();
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
        api.getSettings().logStoreChanges && toastMessage(`Disposed "${store.$id}" store 🗑`);
      };
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
      api.getSettings().logStoreChanges && toastMessage(`"${store.$id}" store installed 🆕`);
    });
  }
  let runningActionId = 0;
  let activeAction;
  function patchActionForGrouping(store, actionNames) {
    const actions = actionNames.reduce((storeActions, actionName) => {
      storeActions[actionName] = vue.toRaw(store)[actionName];
      return storeActions;
    }, {});
    for (const actionName in actions) {
      store[actionName] = function() {
        const _actionId = runningActionId;
        const trackedStore = new Proxy(store, {
          get(...args) {
            activeAction = _actionId;
            return Reflect.get(...args);
          },
          set(...args) {
            activeAction = _actionId;
            return Reflect.set(...args);
          }
        });
        return actions[actionName].apply(trackedStore, arguments);
      };
    }
  }
  function devtoolsPlugin({ app, store, options }) {
    if (store.$id.startsWith("__hot:")) {
      return;
    }
    if (options.state) {
      store._isOptionsAPI = true;
    }
    if (typeof options.state === "function") {
      patchActionForGrouping(
        // @ts-expect-error: can cast the store...
        store,
        Object.keys(options.actions)
      );
      const originalHotUpdate = store._hotUpdate;
      vue.toRaw(store)._hotUpdate = function(newStore) {
        originalHotUpdate.apply(this, arguments);
        patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions));
      };
    }
    addStoreToDevtools(
      app,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      store
    );
  }
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia2 = vue.markRaw({
      install(app) {
        setActivePinia(pinia2);
        {
          pinia2._a = app;
          app.provide(piniaSymbol, pinia2);
          app.config.globalProperties.$pinia = pinia2;
          if (USE_DEVTOOLS) {
            registerPiniaDevtools(app, pinia2);
          }
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    if (USE_DEVTOOLS && typeof Proxy !== "undefined") {
      pinia2.use(devtoolsPlugin);
    }
    return pinia2;
  }
  function patchObject(newState, oldState) {
    for (const key in oldState) {
      const subPatch = oldState[key];
      if (!(key in newState)) {
        continue;
      }
      const targetValue = newState[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        newState[key] = patchObject(targetValue, subPatch);
      } else {
        {
          newState[key] = subPatch;
        }
      }
    }
    return newState;
  }
  const noop$1 = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && vue.getCurrentScope()) {
      vue.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    }
    if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
    /* istanbul ignore next */
    Symbol()
  );
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign: assign$2 } = Object;
  function isComputed(o) {
    return !!(vue.isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia2, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia2.state.value[id];
    let store;
    function setup() {
      if (!initialState && (!(process.env.NODE_ENV !== "production") || !hot)) {
        {
          pinia2.state.value[id] = state ? state() : {};
        }
      }
      const localState = process.env.NODE_ENV !== "production" && hot ? (
        // use ref() to unwrap refs inside state TODO: check if this is still necessary
        vue.toRefs(vue.ref(state ? state() : {}).value)
      ) : vue.toRefs(pinia2.state.value[id]);
      return assign$2(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        if (process.env.NODE_ENV !== "production" && name in localState) {
          console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`);
        }
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia2);
          const store2 = pinia2._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia2, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia2, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign$2({ actions: {} }, options);
    if (process.env.NODE_ENV !== "production" && !pinia2._e.active) {
      throw new Error("Pinia destroyed");
    }
    const $subscribeOptions = {
      deep: true
      // flush: 'post',
    };
    if (process.env.NODE_ENV !== "production" && !isVue2) {
      $subscribeOptions.onTrigger = (event) => {
        if (isListening) {
          debuggerEvents = event;
        } else if (isListening == false && !store._hotUpdating) {
          if (Array.isArray(debuggerEvents)) {
            debuggerEvents.push(event);
          } else {
            console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.");
          }
        }
      };
    }
    let isListening;
    let isSyncListening;
    let subscriptions = vue.markRaw([]);
    let actionSubscriptions = vue.markRaw([]);
    let debuggerEvents;
    const initialState = pinia2.state.value[$id];
    if (!isOptionsStore && !initialState && (!(process.env.NODE_ENV !== "production") || !hot)) {
      {
        pinia2.state.value[$id] = {};
      }
    }
    const hotState = vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      if (process.env.NODE_ENV !== "production") {
        debuggerEvents = [];
      }
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia2.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia2.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia2.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign$2($state, newState);
      });
    } : (
      /* istanbul ignore next */
      process.env.NODE_ENV !== "production" ? () => {
        throw new Error(`🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
      } : noop$1
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia2._s.delete($id);
    }
    function wrapAction(name, action) {
      return function() {
        setActivePinia(pinia2);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name,
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = action.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
    }
    const _hmrPayload = /* @__PURE__ */ vue.markRaw({
      actions: {},
      getters: {},
      state: [],
      hotState
    });
    const partialStore = {
      _p: pinia2,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia2.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign$2({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(process.env.NODE_ENV !== "production" || USE_DEVTOOLS ? assign$2(
      {
        _hmrPayload,
        _customProperties: vue.markRaw(/* @__PURE__ */ new Set())
        // devtools custom properties
      },
      partialStore
      // must be added later
      // setupStore
    ) : partialStore);
    pinia2._s.set($id, store);
    const setupStore = pinia2._e.run(() => {
      scope = vue.effectScope();
      return scope.run(() => setup());
    });
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (process.env.NODE_ENV !== "production" && hot) {
          set(hotState.value, key, vue.toRef(setupStore, key));
        } else if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia2.state.value[$id][key] = prop;
          }
        }
        if (process.env.NODE_ENV !== "production") {
          _hmrPayload.state.push(key);
        }
      } else if (typeof prop === "function") {
        const actionValue = process.env.NODE_ENV !== "production" && hot ? prop : wrapAction(key, prop);
        {
          setupStore[key] = actionValue;
        }
        if (process.env.NODE_ENV !== "production") {
          _hmrPayload.actions[key] = prop;
        }
        optionsForPlugin.actions[key] = prop;
      } else if (process.env.NODE_ENV !== "production") {
        if (isComputed(prop)) {
          _hmrPayload.getters[key] = isOptionsStore ? (
            // @ts-expect-error
            options.getters[key]
          ) : prop;
          if (IS_CLIENT) {
            const getters = setupStore._getters || // @ts-expect-error: same
            (setupStore._getters = vue.markRaw([]));
            getters.push(key);
          }
        }
      }
    }
    {
      assign$2(store, setupStore);
      assign$2(vue.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => process.env.NODE_ENV !== "production" && hot ? hotState.value : pinia2.state.value[$id],
      set: (state) => {
        if (process.env.NODE_ENV !== "production" && hot) {
          throw new Error("cannot set hotState");
        }
        $patch(($state) => {
          assign$2($state, state);
        });
      }
    });
    if (process.env.NODE_ENV !== "production") {
      store._hotUpdate = vue.markRaw((newStore) => {
        store._hotUpdating = true;
        newStore._hmrPayload.state.forEach((stateKey) => {
          if (stateKey in store.$state) {
            const newStateTarget = newStore.$state[stateKey];
            const oldStateSource = store.$state[stateKey];
            if (typeof newStateTarget === "object" && isPlainObject(newStateTarget) && isPlainObject(oldStateSource)) {
              patchObject(newStateTarget, oldStateSource);
            } else {
              newStore.$state[stateKey] = oldStateSource;
            }
          }
          set(store, stateKey, vue.toRef(newStore.$state, stateKey));
        });
        Object.keys(store.$state).forEach((stateKey) => {
          if (!(stateKey in newStore.$state)) {
            del(store, stateKey);
          }
        });
        isListening = false;
        isSyncListening = false;
        pinia2.state.value[$id] = vue.toRef(newStore._hmrPayload, "hotState");
        isSyncListening = true;
        vue.nextTick().then(() => {
          isListening = true;
        });
        for (const actionName in newStore._hmrPayload.actions) {
          const action = newStore[actionName];
          set(store, actionName, wrapAction(actionName, action));
        }
        for (const getterName in newStore._hmrPayload.getters) {
          const getter = newStore._hmrPayload.getters[getterName];
          const getterValue = isOptionsStore ? (
            // special handling of options api
            vue.computed(() => {
              setActivePinia(pinia2);
              return getter.call(store, store);
            })
          ) : getter;
          set(store, getterName, getterValue);
        }
        Object.keys(store._hmrPayload.getters).forEach((key) => {
          if (!(key in newStore._hmrPayload.getters)) {
            del(store, key);
          }
        });
        Object.keys(store._hmrPayload.actions).forEach((key) => {
          if (!(key in newStore._hmrPayload.actions)) {
            del(store, key);
          }
        });
        store._hmrPayload = newStore._hmrPayload;
        store._getters = newStore._getters;
        store._hotUpdating = false;
      });
    }
    if (USE_DEVTOOLS) {
      const nonEnumerable = {
        writable: true,
        configurable: true,
        // avoid warning on devtools trying to display this property
        enumerable: false
      };
      ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p) => {
        Object.defineProperty(store, p, assign$2({ value: store[p] }, nonEnumerable));
      });
    }
    pinia2._p.forEach((extender) => {
      if (USE_DEVTOOLS) {
        const extensions = scope.run(() => extender({
          store,
          app: pinia2._a,
          pinia: pinia2,
          options: optionsForPlugin
        }));
        Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
        assign$2(store, extensions);
      } else {
        assign$2(store, scope.run(() => extender({
          store,
          app: pinia2._a,
          pinia: pinia2,
          options: optionsForPlugin
        })));
      }
    });
    if (process.env.NODE_ENV !== "production" && store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
      console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
    }
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
    }
    function useStore(pinia2, hot) {
      const currentInstance = vue.getCurrentInstance();
      pinia2 = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      (process.env.NODE_ENV === "test" && activePinia && activePinia._testing ? null : pinia2) || currentInstance && vue.inject(piniaSymbol, null);
      if (pinia2)
        setActivePinia(pinia2);
      if (process.env.NODE_ENV !== "production" && !activePinia) {
        throw new Error(`[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?
	const pinia = createPinia()
	app.use(pinia)
This will fail in production.`);
      }
      pinia2 = activePinia;
      if (!pinia2._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia2);
        } else {
          createOptionsStore(id, options, pinia2);
        }
        if (process.env.NODE_ENV !== "production") {
          useStore._pinia = pinia2;
        }
      }
      const store = pinia2._s.get(id);
      if (process.env.NODE_ENV !== "production" && hot) {
        const hotId = "__hot:" + id;
        const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia2, true) : createOptionsStore(hotId, assign$2({}, options), pinia2, true);
        hot._hotUpdate(newStore);
        delete pinia2.state.value[hotId];
        pinia2._s.delete(hotId);
      }
      if (process.env.NODE_ENV !== "production" && IS_CLIENT && currentInstance && currentInstance.proxy && // avoid adding stores that are just built for hot module replacement
      !hot) {
        const vm = currentInstance.proxy;
        const cache = "_pStores" in vm ? vm._pStores : vm._pStores = {};
        cache[id] = store;
      }
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  const useDataStore = defineStore("data", () => {
    const records = vue.ref([]);
    const record = vue.ref({});
    return { records, record };
  });
  function useStonecrop(registry) {
    if (!registry) {
      registry = vue.inject("$registry");
    }
    const store = useDataStore();
    const stonecrop = vue.ref(new Stonecrop$1(registry, store));
    const isReady = vue.ref(false);
    vue.onBeforeMount(async () => {
      var _a, _b;
      const route = registry.router.currentRoute.value;
      const doctypeSlug = (_a = route.params.records) == null ? void 0 : _a.toString().toLowerCase();
      const recordId = (_b = route.params.record) == null ? void 0 : _b.toString().toLowerCase();
      if (!doctypeSlug && !recordId) {
        return;
      }
      const doctype = await registry.doctypeLoader(doctypeSlug);
      registry.addDoctype(doctype);
      stonecrop.value.setup(doctype);
      if (doctypeSlug) {
        if (recordId) {
          await stonecrop.value.getRecord(doctype, recordId);
        } else {
          await stonecrop.value.getRecords(doctype);
        }
      }
      stonecrop.value.runAction(doctype, "LOAD", recordId ? [recordId] : void 0);
      isReady.value = true;
    });
    return { stonecrop, isReady };
  }
  class Doctype {
    constructor(doctype, schema, workflow, actions, component) {
      this.doctype = doctype;
      this.schema = schema;
      this.workflow = workflow;
      this.actions = actions;
      this.component = component;
    }
    get slug() {
      return this.doctype.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
    }
    get __typename() {
      return this.doctype;
    }
  }
  class Registry {
    constructor(router2, doctypeLoader = void 0) {
      if (Registry._root) {
        return Registry._root;
      }
      Registry._root = this;
      this.name = "Registry";
      this.router = router2;
      this.registry = {};
      this.doctypeLoader = doctypeLoader;
    }
    addDoctype(doctype) {
      if (!(doctype.doctype in Object.keys(this.registry))) {
        this.registry[doctype.slug] = doctype;
      }
      if (!this.router.hasRoute(doctype.doctype)) {
        this.router.addRoute({
          path: `/${doctype.slug}`,
          name: doctype.slug,
          component: doctype.component
        });
      }
    }
  }
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
    var _a;
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else if (typeof global !== "undefined" && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
      supported = true;
      perf = global.perf_hooks.performance;
    } else {
      supported = false;
    }
    return supported;
  }
  function now$1() {
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
          return now$1();
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
    * vue-router v4.1.6
    * (c) 2022 Eduardo San Martin Morote
    * @license MIT
    */
  const isBrowser = typeof window !== "undefined";
  function isESModule(obj) {
    return obj.__esModule || obj[Symbol.toStringTag] === "Module";
  }
  const assign = Object.assign;
  function applyToParams(fn, params) {
    const newParams = {};
    for (const key in params) {
      const value = params[key];
      newParams[key] = isArray(value) ? value.map(fn) : fn(value);
    }
    return newParams;
  }
  const noop = () => {
  };
  const isArray = Array.isArray;
  function warn(msg) {
    const args = Array.from(arguments).slice(1);
    console.warn.apply(console, ["[Vue Router warn]: " + msg].concat(args));
  }
  const TRAILING_SLASH_RE = /\/$/;
  const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
  function parseURL(parseQuery2, location2, currentLocation = "/") {
    let path, query = {}, searchString = "", hash = "";
    const hashPos = location2.indexOf("#");
    let searchPos = location2.indexOf("?");
    if (hashPos < searchPos && hashPos >= 0) {
      searchPos = -1;
    }
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
    const query = location2.query ? stringifyQuery2(location2.query) : "";
    return location2.path + (query && "?") + query + (location2.hash || "");
  }
  function stripBase(pathname, base) {
    if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
      return pathname;
    return pathname.slice(base.length) || "/";
  }
  function isSameRouteLocation(stringifyQuery2, a, b) {
    const aLastIndex = a.matched.length - 1;
    const bLastIndex = b.matched.length - 1;
    return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
  }
  function isSameRouteRecord(a, b) {
    return (a.aliasOf || a) === (b.aliasOf || b);
  }
  function isSameRouteLocationParams(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length)
      return false;
    for (const key in a) {
      if (!isSameRouteLocationParamsValue(a[key], b[key]))
        return false;
    }
    return true;
  }
  function isSameRouteLocationParamsValue(a, b) {
    return isArray(a) ? isEquivalentArray(a, b) : isArray(b) ? isEquivalentArray(b, a) : a === b;
  }
  function isEquivalentArray(a, b) {
    return isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
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
      if (segment === ".")
        continue;
      if (segment === "..") {
        if (position > 1)
          position--;
      } else
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
      const positionEl = position.el;
      const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
      if (process.env.NODE_ENV !== "production" && typeof position.el === "string") {
        if (!isIdSelector || !document.getElementById(position.el.slice(1))) {
          try {
            const foundEl = document.querySelector(position.el);
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
    const currentLocation = {
      value: createCurrentLocation(base, location2)
    };
    const historyState = { value: history2.state };
    if (!historyState.value) {
      changeLocation(currentLocation.value, {
        back: null,
        current: currentLocation.value,
        forward: null,
        // the length is off by one, we need to decrease it
        position: history2.length - 1,
        replaced: true,
        // don't add a scroll as the user may have an anchor, and we want
        // scrollBehavior to be triggered without a saved position
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
      const state = assign({}, history2.state, buildState(
        historyState.value.back,
        // keep back and forward entries but override current position
        to,
        historyState.value.forward,
        true
      ), data, { position: historyState.value.position });
      changeLocation(to, state, true);
      currentLocation.value = to;
    }
    function push(to, data) {
      const currentState = assign(
        {},
        // use current history state to gracefully handle a wrong call to
        // history.replaceState
        // https://github.com/vuejs/router/issues/366
        historyState.value,
        history2.state,
        {
          forward: to,
          scroll: computeScrollPosition()
        }
      );
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
      // it's overridden right after
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
  const NavigationFailureSymbol = Symbol(process.env.NODE_ENV !== "production" ? "navigation failure" : "");
  var NavigationFailureType;
  (function(NavigationFailureType2) {
    NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
    NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
    NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
  })(NavigationFailureType || (NavigationFailureType = {}));
  const ErrorTypeMessages = {
    [
      1
      /* ErrorTypes.MATCHER_NOT_FOUND */
    ]({ location: location2, currentLocation }) {
      return `No match for
 ${JSON.stringify(location2)}${currentLocation ? "\nwhile being at\n" + JSON.stringify(currentLocation) : ""}`;
    },
    [
      2
      /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
    ]({ from, to }) {
      return `Redirected from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`;
    },
    [
      4
      /* ErrorTypes.NAVIGATION_ABORTED */
    ]({ from, to }) {
      return `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`;
    },
    [
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ]({ from, to }) {
      return `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`;
    },
    [
      16
      /* ErrorTypes.NAVIGATION_DUPLICATED */
    ]({ from, to }) {
      return `Avoided redundant navigation to current location: "${from.fullPath}".`;
    }
  };
  function createRouterError(type2, params) {
    if (process.env.NODE_ENV !== "production" || false) {
      return assign(new Error(ErrorTypeMessages[type2](params)), {
        type: type2,
        [NavigationFailureSymbol]: true
      }, params);
    } else {
      return assign(new Error(), {
        type: type2,
        [NavigationFailureSymbol]: true
      }, params);
    }
  }
  function isNavigationFailure(error, type2) {
    return error instanceof Error && NavigationFailureSymbol in error && (type2 == null || !!(error.type & type2));
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
    const score = [];
    let pattern = options.start ? "^" : "";
    const keys = [];
    for (const segment of segments) {
      const segmentScores = segment.length ? [] : [
        90
        /* PathScore.Root */
      ];
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
            subPattern = // avoid an optional / if there are more segments e.g. /:p?-static
            // or /:p?-:p2
            optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
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
    function parse2(path) {
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
            if (isArray(param) && !repeatable) {
              throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
            }
            const text = isArray(param) ? param.join("/") : param;
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
      return path || "/";
    }
    return {
      re,
      score,
      keys,
      parse: parse2,
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
    if (Math.abs(bScore.length - aScore.length) === 1) {
      if (isLastScoreNegative(aScore))
        return 1;
      if (isLastScoreNegative(bScore))
        return -1;
    }
    return bScore.length - aScore.length;
  }
  function isLastScoreNegative(score) {
    const last = score[score.length - 1];
    return score.length > 0 && last[last.length - 1] < 0;
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
      // these needs to be populated by the parent
      children: [],
      alias: []
    });
    if (parent) {
      if (!matcher.record.aliasOf === !parent.record.aliasOf)
        parent.children.push(matcher);
    }
    return matcher;
  }
  function createRouterMatcher(routes, globalOptions) {
    const matchers = [];
    const matcherMap = /* @__PURE__ */ new Map();
    globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
    function getRecordMatcher(name) {
      return matcherMap.get(name);
    }
    function addRoute(record, parent, originalRecord) {
      const isRootAdd = !originalRecord;
      const mainNormalizedRecord = normalizeRouteRecord(record);
      if (process.env.NODE_ENV !== "production") {
        checkChildMissingNameWithEmptyPath(mainNormalizedRecord, parent);
      }
      mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
      const options = mergeOptions(globalOptions, record);
      const normalizedRecords = [
        mainNormalizedRecord
      ];
      if ("alias" in record) {
        const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
        for (const alias of aliases) {
          normalizedRecords.push(assign({}, mainNormalizedRecord, {
            // this allows us to hold a copy of the `components` option
            // so that async components cache is hold on the original record
            components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
            path: alias,
            // we might be the child of an alias
            aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
            // the aliases are always of the same kind as the original since they
            // are defined on the same record
          }));
        }
      }
      let matcher;
      let originalMatcher;
      for (const normalizedRecord of normalizedRecords) {
        const { path } = normalizedRecord;
        if (parent && path[0] !== "/") {
          const parentPath = parent.record.path;
          const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
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
        if (mainNormalizedRecord.children) {
          const children = mainNormalizedRecord.children;
          for (let i = 0; i < children.length; i++) {
            addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
          }
        }
        originalRecord = originalRecord || matcher;
        if (matcher.record.components && Object.keys(matcher.record.components).length || matcher.record.name || matcher.record.redirect) {
          insertMatcher(matcher);
        }
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
        const index = matchers.indexOf(matcherRef);
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
      while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0 && // Adding children with empty path should still appear before the parent
      // https://github.com/vuejs/router/issues/1124
      (matcher.record.path !== matchers[i].record.path || !isRecordChildOf(matcher, matchers[i])))
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
        if (process.env.NODE_ENV !== "production") {
          const invalidParams = Object.keys(location2.params || {}).filter((paramName) => !matcher.keys.find((k) => k.name === paramName));
          if (invalidParams.length) {
            warn(`Discarded invalid param(s) "${invalidParams.join('", "')}" when navigating. See https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22 for more details.`);
          }
        }
        name = matcher.record.name;
        params = assign(
          // paramsFromLocation is a new object
          paramsFromLocation(
            currentLocation.params,
            // only keep params that exist in the resolved location
            // TODO: only keep optional params coming from a parent record
            matcher.keys.filter((k) => !k.optional).map((k) => k.name)
          ),
          // discard any existing params in the current location that do not exist here
          // #1497 this ensures better active/exact matching
          location2.params && paramsFromLocation(location2.params, matcher.keys.map((k) => k.name))
        );
        path = matcher.stringify(params);
      } else if ("path" in location2) {
        path = location2.path;
        if (process.env.NODE_ENV !== "production" && !path.startsWith("/")) {
          warn(`The Matcher cannot resolve relative paths but received "${path}". Unless you directly called \`matcher.resolve("${path}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`);
        }
        matcher = matchers.find((m2) => m2.re.test(path));
        if (matcher) {
          params = matcher.parse(path);
          name = matcher.record.name;
        }
      } else {
        matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m2) => m2.re.test(currentLocation.path));
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
    routes.forEach((route) => addRoute(route));
    return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
  }
  function paramsFromLocation(params, keys) {
    const newParams = {};
    for (const key of keys) {
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
      components: "components" in record ? record.components || null : record.component && { default: record.component }
    };
  }
  function normalizeRecordProps(record) {
    const propsObject = {};
    const props = record.props || false;
    if ("component" in record) {
      propsObject.default = props;
    } else {
      for (const name in record.components)
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
    const options = {};
    for (const key in defaults) {
      options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
    }
    return options;
  }
  function isSameParam(a, b) {
    return a.name === b.name && a.optional === b.optional && a.repeatable === b.repeatable;
  }
  function checkSameParams(a, b) {
    for (const key of a.keys) {
      if (!key.optional && !b.keys.find(isSameParam.bind(null, key)))
        return warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" must have the exact same param named "${key.name}"`);
    }
    for (const key of b.keys) {
      if (!key.optional && !a.keys.find(isSameParam.bind(null, key)))
        return warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" must have the exact same param named "${key.name}"`);
    }
  }
  function checkChildMissingNameWithEmptyPath(mainNormalizedRecord, parent) {
    if (parent && parent.record.name && !mainNormalizedRecord.name && !mainNormalizedRecord.path) {
      warn(`The route named "${String(parent.record.name)}" has a child without a name and an empty path. Using that name won't render the empty path child so you probably want to move the name to the child instead. If this is intentional, add a name to the child route to remove the warning.`);
    }
  }
  function checkMissingParamsInAbsolutePath(record, parent) {
    for (const key of parent.keys) {
      if (!record.keys.find(isSameParam.bind(null, key)))
        return warn(`Absolute path "${record.record.path}" must have the exact same param named "${key.name}" as its parent "${parent.record.path}".`);
    }
  }
  function isRecordChildOf(record, parent) {
    return parent.children.some((child) => child === record || isRecordChildOf(record, child));
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
    return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
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
      const eqPos = searchParam.indexOf("=");
      const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
      const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
      if (key in query) {
        let currentValue = query[key];
        if (!isArray(currentValue)) {
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
      const values = isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
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
    for (const key in query) {
      const value = query[key];
      if (value !== void 0) {
        normalizedQuery[key] = isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
      }
    }
    return normalizedQuery;
  }
  const matchedRouteKey = Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : "");
  const viewDepthKey = Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : "");
  const routerKey = Symbol(process.env.NODE_ENV !== "production" ? "router" : "");
  const routeLocationKey = Symbol(process.env.NODE_ENV !== "production" ? "route location" : "");
  const routerViewLocationKey = Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
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
    const enterCallbackArray = record && // name is defined if record is because of the function overload
    (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
    return () => new Promise((resolve, reject) => {
      const next = (valid) => {
        if (valid === false) {
          reject(createRouterError(4, {
            from,
            to
          }));
        } else if (valid instanceof Error) {
          reject(valid);
        } else if (isRouteLocation(valid)) {
          reject(createRouterError(2, {
            from: to,
            to: valid
          }));
        } else {
          if (enterCallbackArray && // since enterCallbackArray is truthy, both record and name also are
          record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") {
            enterCallbackArray.push(valid);
          }
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
      if (process.env.NODE_ENV !== "production" && !record.components && !record.children.length) {
        warn(`Record with path "${record.path}" is either missing a "component(s)" or "children" property.`);
      }
      for (const name in record.components) {
        let rawComponent = record.components[name];
        if (process.env.NODE_ENV !== "production") {
          if (!rawComponent || typeof rawComponent !== "object" && typeof rawComponent !== "function") {
            warn(`Component "${name}" in record with path "${record.path}" is not a valid component. Received "${String(rawComponent)}".`);
            throw new Error("Invalid route component");
          } else if ("then" in rawComponent) {
            warn(`Component "${name}" in record with path "${record.path}" is a Promise instead of a function that returns a Promise. Did you write "import('./MyPage.vue')" instead of "() => import('./MyPage.vue')" ? This will break in production if not fixed.`);
            const promise = rawComponent;
            rawComponent = () => promise;
          } else if (rawComponent.__asyncLoader && // warn only once per component
          !rawComponent.__warnedDefineAsync) {
            rawComponent.__warnedDefineAsync = true;
            warn(`Component "${name}" in record with path "${record.path}" is defined using "defineAsyncComponent()". Write "() => import('./MyPage.vue')" instead of "defineAsyncComponent(() => import('./MyPage.vue'))".`);
          }
        }
        if (guardType !== "beforeRouteEnter" && !record.instances[name])
          continue;
        if (isRouteComponent(rawComponent)) {
          const options = rawComponent.__vccOpts || rawComponent;
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
            const options = resolvedComponent.__vccOpts || resolvedComponent;
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
    const router2 = vue.inject(routerKey);
    const currentRoute = vue.inject(routeLocationKey);
    const route = vue.computed(() => router2.resolve(vue.unref(props.to)));
    const activeRecordIndex = vue.computed(() => {
      const { matched } = route.value;
      const { length } = matched;
      const routeMatched = matched[length - 1];
      const currentMatched = currentRoute.matched;
      if (!routeMatched || !currentMatched.length)
        return -1;
      const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
      if (index > -1)
        return index;
      const parentRecordPath = getOriginalPath(matched[length - 2]);
      return (
        // we are dealing with nested routes
        length > 1 && // if the parent and matched route have the same path, this link is
        // referring to the empty child. Or we currently are on a different
        // child of the same parent
        getOriginalPath(routeMatched) === parentRecordPath && // avoid comparing the child with its parent
        currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index
      );
    });
    const isActive = vue.computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
    const isExactActive = vue.computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
    function navigate(e = {}) {
      if (guardEvent(e)) {
        return router2[vue.unref(props.replace) ? "replace" : "push"](
          vue.unref(props.to)
          // avoid uncaught errors are they are logged anyway
        ).catch(noop);
      }
      return Promise.resolve();
    }
    if ((process.env.NODE_ENV !== "production" || false) && isBrowser) {
      const instance = vue.getCurrentInstance();
      if (instance) {
        const linkContextDevtools = {
          route: route.value,
          isActive: isActive.value,
          isExactActive: isExactActive.value
        };
        instance.__vrl_devtools = instance.__vrl_devtools || [];
        instance.__vrl_devtools.push(linkContextDevtools);
        vue.watchEffect(() => {
          linkContextDevtools.route = route.value;
          linkContextDevtools.isActive = isActive.value;
          linkContextDevtools.isExactActive = isExactActive.value;
        }, { flush: "post" });
      }
    }
    return {
      route,
      href: vue.computed(() => route.value.href),
      isActive,
      isExactActive,
      navigate
    };
  }
  const RouterLinkImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterLink",
    compatConfig: { MODE: 3 },
    props: {
      to: {
        type: [String, Object],
        required: true
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
    useLink,
    setup(props, { slots }) {
      const link = vue.reactive(useLink(props));
      const { options } = vue.inject(routerKey);
      const elClass = vue.computed(() => ({
        [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
        // [getLinkClass(
        //   props.inactiveClass,
        //   options.linkInactiveClass,
        //   'router-link-inactive'
        // )]: !link.isExactActive,
        [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
      }));
      return () => {
        const children = slots.default && slots.default(link);
        return props.custom ? children : vue.h("a", {
          "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
          href: link.href,
          // this would override user added attrs but Vue will still add
          // the listener, so we end up triggering both
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
    for (const key in inner) {
      const innerValue = inner[key];
      const outerValue = outer[key];
      if (typeof innerValue === "string") {
        if (innerValue !== outerValue)
          return false;
      } else {
        if (!isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
          return false;
      }
    }
    return true;
  }
  function getOriginalPath(record) {
    return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
  }
  const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
  const RouterViewImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterView",
    // #674 we manually inherit them
    inheritAttrs: false,
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
    setup(props, { attrs, slots }) {
      process.env.NODE_ENV !== "production" && warnDeprecatedUsage();
      const injectedRoute = vue.inject(routerViewLocationKey);
      const routeToDisplay = vue.computed(() => props.route || injectedRoute.value);
      const injectedDepth = vue.inject(viewDepthKey, 0);
      const depth = vue.computed(() => {
        let initialDepth = vue.unref(injectedDepth);
        const { matched } = routeToDisplay.value;
        let matchedRoute;
        while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
          initialDepth++;
        }
        return initialDepth;
      });
      const matchedRouteRef = vue.computed(() => routeToDisplay.value.matched[depth.value]);
      vue.provide(viewDepthKey, vue.computed(() => depth.value + 1));
      vue.provide(matchedRouteKey, matchedRouteRef);
      vue.provide(routerViewLocationKey, routeToDisplay);
      const viewRef = vue.ref();
      vue.watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
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
        if (instance && to && // if there is no instance but to and from are the same this might be
        // the first visit
        (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
          (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
        }
      }, { flush: "post" });
      return () => {
        const route = routeToDisplay.value;
        const currentName = props.name;
        const matchedRoute = matchedRouteRef.value;
        const ViewComponent = matchedRoute && matchedRoute.components[currentName];
        if (!ViewComponent) {
          return normalizeSlot(slots.default, { Component: ViewComponent, route });
        }
        const routePropsOption = matchedRoute.props[currentName];
        const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
        const onVnodeUnmounted = (vnode) => {
          if (vnode.component.isUnmounted) {
            matchedRoute.instances[currentName] = null;
          }
        };
        const component = vue.h(ViewComponent, assign({}, routeProps, attrs, {
          onVnodeUnmounted,
          ref: viewRef
        }));
        if ((process.env.NODE_ENV !== "production" || false) && isBrowser && component.ref) {
          const info = {
            depth: depth.value,
            name: matchedRoute.name,
            path: matchedRoute.path,
            meta: matchedRoute.meta
          };
          const internalInstances = isArray(component.ref) ? component.ref.map((r) => r.i) : [component.ref.i];
          internalInstances.forEach((instance) => {
            instance.__vrv_devtools = info;
          });
        }
        return (
          // pass the vnode to the slot as a prop.
          // h and <component :is="..."> both accept vnodes
          normalizeSlot(slots.default, { Component: component, route }) || component
        );
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
    const instance = vue.getCurrentInstance();
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
      // remove variables that can contain vue instances
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
      homepage: "https://router.vuejs.org",
      logo: "https://router.vuejs.org/logo.png",
      componentStateTypes: ["Routing"],
      app
    }, (api) => {
      if (typeof api.now !== "function") {
        console.warn("[Vue Router]: You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.");
      }
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
        if (componentInstance.__vrv_devtools) {
          const info = componentInstance.__vrv_devtools;
          node.tags.push({
            label: (info.name ? `${info.name.toString()}: ` : "") + info.path,
            textColor: 0,
            tooltip: "This component is rendered by &lt;router-view&gt;",
            backgroundColor: PINK_500
          });
        }
        if (isArray(componentInstance.__vrl_devtools)) {
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
      vue.watch(router2.currentRoute, () => {
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
            time: api.now(),
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
            time: api.now(),
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
          data.status = formatDisplay("❌");
        } else {
          data.status = formatDisplay("✅");
        }
        data.from = formatRouteLocation(from, "Current Location during this navigation");
        data.to = formatRouteLocation(to, "Target location");
        api.addTimelineEvent({
          layerId: navigationsLayerId,
          event: {
            title: "End of navigation",
            subtitle: to.fullPath,
            time: api.now(),
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
        let routes = matcher.getRoutes().filter((route) => !route.parent);
        routes.forEach(resetMatchStateOnRouteRecord);
        if (payload.filter) {
          routes = routes.filter((route) => (
            // save matches state based on the payload
            isRouteMatching(route, payload.filter.toLowerCase())
          ));
        }
        routes.forEach((route) => markRouteRecordActive(route, router2.currentRoute.value));
        payload.rootNodes = routes.map(formatRouteRecordForInspector);
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
          const routes = matcher.getRoutes();
          const route = routes.find((route2) => route2.record.__vd_id === payload.nodeId);
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
    if (Object.keys(route.record.meta).length) {
      fields.push({
        editable: false,
        key: "meta",
        value: route.record.meta
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
        label: typeof record.redirect === "string" ? `redirect: ${record.redirect}` : "redirects",
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
    for (const key in obj) {
      if (!keys.includes(key)) {
        ret[key] = obj[key];
      }
    }
    return ret;
  }
  function createRouter(options) {
    const matcher = createRouterMatcher(options.routes, options);
    const parseQuery$1 = options.parseQuery || parseQuery;
    const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
    const routerHistory = options.history;
    if (process.env.NODE_ENV !== "production" && !routerHistory)
      throw new Error('Provide the "history" option when calling "createRouter()": https://next.router.vuejs.org/api/#history.');
    const beforeGuards = useCallbacks();
    const beforeResolveGuards = useCallbacks();
    const afterGuards = useCallbacks();
    const currentRoute = vue.shallowRef(START_LOCATION_NORMALIZED);
    let pendingLocation = START_LOCATION_NORMALIZED;
    if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
    const encodeParams = applyToParams.bind(null, encodeParam);
    const decodeParams = (
      // @ts-expect-error: intentionally avoid the type check
      applyToParams.bind(null, decode)
    );
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
      const recordMatcher = matcher.getRecordMatcher(name);
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
        const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
        const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
        const href2 = routerHistory.createHref(locationNormalized.fullPath);
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
        if (process.env.NODE_ENV !== "production" && "params" in rawLocation && !("name" in rawLocation) && // @ts-expect-error: the type is never
        Object.keys(rawLocation.params).length) {
          warn(`Path "${// @ts-expect-error: the type is never
          rawLocation.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`);
        }
        matcherLocation = assign({}, rawLocation, {
          path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
        });
      } else {
        const targetParams = assign({}, rawLocation.params);
        for (const key in targetParams) {
          if (targetParams[key] == null) {
            delete targetParams[key];
          }
        }
        matcherLocation = assign({}, rawLocation, {
          params: encodeParams(rawLocation.params)
        });
        currentLocation.params = encodeParams(currentLocation.params);
      }
      const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
      const hash = rawLocation.hash || "";
      if (process.env.NODE_ENV !== "production" && hash && !hash.startsWith("#")) {
        warn(`A \`hash\` should always start with the character "#". Replace "${hash}" with "#${hash}".`);
      }
      matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
      const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
        hash: encodeHash(hash),
        path: matchedRoute.path
      }));
      const href = routerHistory.createHref(fullPath);
      if (process.env.NODE_ENV !== "production") {
        if (href.startsWith("//")) {
          warn(`Location "${rawLocation}" resolved to "${href}". A resolved location cannot start with multiple slashes.`);
        } else if (!matchedRoute.matched.length) {
          warn(`No match found for location with path "${"path" in rawLocation ? rawLocation.path : rawLocation}"`);
        }
      }
      return assign({
        fullPath,
        // keep the hash encoded so fullPath is effectively path + encodedQuery +
        // hash
        hash,
        query: (
          // if the user is using a custom query lib like qs, we might have
          // nested objects, so we keep the query as is, meaning it can contain
          // numbers at `$route.query`, but at the point, the user will have to
          // use their own type anyway.
          // https://github.com/vuejs/router/issues/328#issuecomment-649481567
          stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
        )
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
          newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : (
            // force empty params
            { path: newTargetLocation }
          );
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
          // avoid transferring params if the redirect has a path
          params: "path" in newTargetLocation ? {} : to.params
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
        return pushWithRedirect(
          assign(locationAsObject(shouldRedirect), {
            state: typeof shouldRedirect === "object" ? assign({}, data, shouldRedirect.state) : data,
            force,
            replace: replace2
          }),
          // keep original redirectedFrom if it exists
          redirectedFrom || targetLocation
        );
      const toLocation = targetLocation;
      toLocation.redirectedFrom = redirectedFrom;
      let failure;
      if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
        failure = createRouterError(16, { to: toLocation, from });
        handleScroll(
          from,
          from,
          // this is a push, the only way for it to be triggered from a
          // history.listen is with a redirect, which makes it become a push
          true,
          // This cannot be the first navigation because the initial location
          // cannot be manually navigated to
          false
        );
      }
      return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? (
        // navigation redirects still mark the router as ready
        isNavigationFailure(
          error,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        ) ? error : markAsReady(error)
      ) : (
        // reject any unknown error
        triggerError(error, toLocation, from)
      )).then((failure2) => {
        if (failure2) {
          if (isNavigationFailure(
            failure2,
            2
            /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
          )) {
            if (process.env.NODE_ENV !== "production" && // we are redirecting to the same location we were already at
            isSameRouteLocation(stringifyQuery$1, resolve(failure2.to), toLocation) && // and we have done it a couple of times
            redirectedFrom && // @ts-expect-error: added only in dev
            (redirectedFrom._count = redirectedFrom._count ? (
              // @ts-expect-error
              redirectedFrom._count + 1
            ) : 1) > 10) {
              warn(`Detected an infinite redirection in a navigation guard when going from "${from.fullPath}" to "${toLocation.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`);
              return Promise.reject(new Error("Infinite redirect in navigation guard"));
            }
            return pushWithRedirect(
              // keep options
              assign({
                // preserve an existing replacement but allow the redirect to override it
                replace: replace2
              }, locationAsObject(failure2.to), {
                state: typeof failure2.to === "object" ? assign({}, data, failure2.to.state) : data,
                force
              }),
              // preserve the original redirectedFrom if any
              redirectedFrom || toLocation
            );
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
            if (isArray(record.beforeEnter)) {
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
      }).catch((err) => isNavigationFailure(
        err,
        8
        /* ErrorTypes.NAVIGATION_CANCELLED */
      ) ? err : Promise.reject(err));
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
      if (removeHistoryListener)
        return;
      removeHistoryListener = routerHistory.listen((to, _from, info) => {
        if (!router2.listening)
          return;
        const toLocation = resolve(to);
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
          if (isNavigationFailure(
            error,
            4 | 8
            /* ErrorTypes.NAVIGATION_CANCELLED */
          )) {
            return error;
          }
          if (isNavigationFailure(
            error,
            2
            /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
          )) {
            pushWithRedirect(
              error.to,
              toLocation
              // avoid an uncaught rejection, let push call triggerError
            ).then((failure) => {
              if (isNavigationFailure(
                failure,
                4 | 16
                /* ErrorTypes.NAVIGATION_DUPLICATED */
              ) && !info.delta && info.type === NavigationType.pop) {
                routerHistory.go(-1, false);
              }
            }).catch(noop);
            return Promise.reject();
          }
          if (info.delta) {
            routerHistory.go(-info.delta, false);
          }
          return triggerError(error, toLocation, from);
        }).then((failure) => {
          failure = failure || finalizeNavigation(
            // after navigation, all matched components are resolved
            toLocation,
            from,
            false
          );
          if (failure) {
            if (info.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
            // entry while a different route is displayed
            !isNavigationFailure(
              failure,
              8
              /* ErrorTypes.NAVIGATION_CANCELLED */
            )) {
              routerHistory.go(-info.delta, false);
            } else if (info.type === NavigationType.pop && isNavigationFailure(
              failure,
              4 | 16
              /* ErrorTypes.NAVIGATION_DUPLICATED */
            )) {
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
      if (!ready) {
        ready = !err;
        setupListeners();
        readyHandlers.list().forEach(([resolve2, reject]) => err ? reject(err) : resolve2());
        readyHandlers.reset();
      }
      return err;
    }
    function handleScroll(to, from, isPush, isFirstNavigation) {
      const { scrollBehavior } = options;
      if (!isBrowser || !scrollBehavior)
        return Promise.resolve();
      const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
      return vue.nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
    }
    const go = (delta) => routerHistory.go(delta);
    let started;
    const installedApps = /* @__PURE__ */ new Set();
    const router2 = {
      currentRoute,
      listening: true,
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
          get: () => vue.unref(currentRoute)
        });
        if (isBrowser && // used for the initial navigation client side to avoid pushing
        // multiple times when the router is used in multiple apps
        !started && currentRoute.value === START_LOCATION_NORMALIZED) {
          started = true;
          push(routerHistory.location).catch((err) => {
            if (process.env.NODE_ENV !== "production")
              warn("Unexpected error when starting the router:", err);
          });
        }
        const reactiveRoute = {};
        for (const key in START_LOCATION_NORMALIZED) {
          reactiveRoute[key] = vue.computed(() => currentRoute.value[key]);
        }
        app.provide(routerKey, router3);
        app.provide(routeLocationKey, vue.reactive(reactiveRoute));
        app.provide(routerViewLocationKey, currentRoute);
        const unmountApp = app.unmount;
        installedApps.add(app);
        app.unmount = function() {
          installedApps.delete(app);
          if (installedApps.size < 1) {
            pendingLocation = START_LOCATION_NORMALIZED;
            removeHistoryListener && removeHistoryListener();
            removeHistoryListener = null;
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
  const router = createRouter({
    history: createWebHistory(),
    routes: []
  });
  function isPromise(obj) {
    return obj && typeof obj.then === "function";
  }
  Promise.resolve(false);
  Promise.resolve(true);
  var PROMISE_RESOLVED_VOID = Promise.resolve();
  function sleep(time, resolveWith) {
    if (!time)
      time = 0;
    return new Promise(function(res) {
      return setTimeout(function() {
        return res(resolveWith);
      }, time);
    });
  }
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function randomToken() {
    return Math.random().toString(36).substring(2);
  }
  var lastMs = 0;
  var additional = 0;
  function microSeconds$4() {
    var ms = new Date().getTime();
    if (ms === lastMs) {
      additional++;
      return ms * 1e3 + additional;
    } else {
      lastMs = ms;
      additional = 0;
      return ms * 1e3;
    }
  }
  var microSeconds$3 = microSeconds$4;
  var type$3 = "native";
  function create$3(channelName) {
    var state = {
      messagesCallback: null,
      bc: new BroadcastChannel(channelName),
      subFns: []
      // subscriberFunctions
    };
    state.bc.onmessage = function(msg) {
      if (state.messagesCallback) {
        state.messagesCallback(msg.data);
      }
    };
    return state;
  }
  function close$3(channelState) {
    channelState.bc.close();
    channelState.subFns = [];
  }
  function postMessage$3(channelState, messageJson) {
    try {
      channelState.bc.postMessage(messageJson, false);
      return PROMISE_RESOLVED_VOID;
    } catch (err) {
      return Promise.reject(err);
    }
  }
  function onMessage$3(channelState, fn) {
    channelState.messagesCallback = fn;
  }
  function canBeUsed$3() {
    if (typeof window === "undefined") {
      return false;
    }
    if (typeof BroadcastChannel === "function") {
      if (BroadcastChannel._pubkey) {
        throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
      }
      return true;
    } else {
      return false;
    }
  }
  function averageResponseTime$3() {
    return 150;
  }
  var NativeMethod = {
    create: create$3,
    close: close$3,
    onMessage: onMessage$3,
    postMessage: postMessage$3,
    canBeUsed: canBeUsed$3,
    type: type$3,
    averageResponseTime: averageResponseTime$3,
    microSeconds: microSeconds$3
  };
  var ObliviousSet = (
    /** @class */
    function() {
      function ObliviousSet2(ttl) {
        this.ttl = ttl;
        this.map = /* @__PURE__ */ new Map();
        this._to = false;
      }
      ObliviousSet2.prototype.has = function(value) {
        return this.map.has(value);
      };
      ObliviousSet2.prototype.add = function(value) {
        var _this = this;
        this.map.set(value, now());
        if (!this._to) {
          this._to = true;
          setTimeout(function() {
            _this._to = false;
            removeTooOldValues(_this);
          }, 0);
        }
      };
      ObliviousSet2.prototype.clear = function() {
        this.map.clear();
      };
      return ObliviousSet2;
    }()
  );
  function removeTooOldValues(obliviousSet) {
    var olderThen = now() - obliviousSet.ttl;
    var iterator = obliviousSet.map[Symbol.iterator]();
    while (true) {
      var next = iterator.next().value;
      if (!next) {
        return;
      }
      var value = next[0];
      var time = next[1];
      if (time < olderThen) {
        obliviousSet.map.delete(value);
      } else {
        return;
      }
    }
  }
  function now() {
    return new Date().getTime();
  }
  function fillOptionsWithDefaults() {
    var originalOptions = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var options = JSON.parse(JSON.stringify(originalOptions));
    if (typeof options.webWorkerSupport === "undefined")
      options.webWorkerSupport = true;
    if (!options.idb)
      options.idb = {};
    if (!options.idb.ttl)
      options.idb.ttl = 1e3 * 45;
    if (!options.idb.fallbackInterval)
      options.idb.fallbackInterval = 150;
    if (originalOptions.idb && typeof originalOptions.idb.onclose === "function")
      options.idb.onclose = originalOptions.idb.onclose;
    if (!options.localstorage)
      options.localstorage = {};
    if (!options.localstorage.removeTimeout)
      options.localstorage.removeTimeout = 1e3 * 60;
    if (originalOptions.methods)
      options.methods = originalOptions.methods;
    if (!options.node)
      options.node = {};
    if (!options.node.ttl)
      options.node.ttl = 1e3 * 60 * 2;
    if (!options.node.maxParallelWrites)
      options.node.maxParallelWrites = 2048;
    if (typeof options.node.useFastPath === "undefined")
      options.node.useFastPath = true;
    return options;
  }
  var microSeconds$2 = microSeconds$4;
  var DB_PREFIX = "pubkey.broadcast-channel-0-";
  var OBJECT_STORE_ID = "messages";
  var TRANSACTION_SETTINGS = {
    durability: "relaxed"
  };
  var type$2 = "idb";
  function getIdb() {
    if (typeof indexedDB !== "undefined")
      return indexedDB;
    if (typeof window !== "undefined") {
      if (typeof window.mozIndexedDB !== "undefined")
        return window.mozIndexedDB;
      if (typeof window.webkitIndexedDB !== "undefined")
        return window.webkitIndexedDB;
      if (typeof window.msIndexedDB !== "undefined")
        return window.msIndexedDB;
    }
    return false;
  }
  function commitIndexedDBTransaction(tx) {
    if (tx.commit) {
      tx.commit();
    }
  }
  function createDatabase(channelName) {
    var IndexedDB = getIdb();
    var dbName = DB_PREFIX + channelName;
    var openRequest = IndexedDB.open(dbName);
    openRequest.onupgradeneeded = function(ev) {
      var db = ev.target.result;
      db.createObjectStore(OBJECT_STORE_ID, {
        keyPath: "id",
        autoIncrement: true
      });
    };
    return new Promise(function(res, rej) {
      openRequest.onerror = function(ev) {
        return rej(ev);
      };
      openRequest.onsuccess = function() {
        res(openRequest.result);
      };
    });
  }
  function writeMessage(db, readerUuid, messageJson) {
    var time = new Date().getTime();
    var writeObject = {
      uuid: readerUuid,
      time,
      data: messageJson
    };
    var tx = db.transaction([OBJECT_STORE_ID], "readwrite", TRANSACTION_SETTINGS);
    return new Promise(function(res, rej) {
      tx.oncomplete = function() {
        return res();
      };
      tx.onerror = function(ev) {
        return rej(ev);
      };
      var objectStore = tx.objectStore(OBJECT_STORE_ID);
      objectStore.add(writeObject);
      commitIndexedDBTransaction(tx);
    });
  }
  function getMessagesHigherThan(db, lastCursorId) {
    var tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
    var objectStore = tx.objectStore(OBJECT_STORE_ID);
    var ret = [];
    var keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
    if (objectStore.getAll) {
      var getAllRequest = objectStore.getAll(keyRangeValue);
      return new Promise(function(res, rej) {
        getAllRequest.onerror = function(err) {
          return rej(err);
        };
        getAllRequest.onsuccess = function(e) {
          res(e.target.result);
        };
      });
    }
    function openCursor() {
      try {
        keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
        return objectStore.openCursor(keyRangeValue);
      } catch (e) {
        return objectStore.openCursor();
      }
    }
    return new Promise(function(res, rej) {
      var openCursorRequest = openCursor();
      openCursorRequest.onerror = function(err) {
        return rej(err);
      };
      openCursorRequest.onsuccess = function(ev) {
        var cursor = ev.target.result;
        if (cursor) {
          if (cursor.value.id < lastCursorId + 1) {
            cursor["continue"](lastCursorId + 1);
          } else {
            ret.push(cursor.value);
            cursor["continue"]();
          }
        } else {
          commitIndexedDBTransaction(tx);
          res(ret);
        }
      };
    });
  }
  function removeMessagesById(channelState, ids) {
    if (channelState.closed) {
      return Promise.resolve([]);
    }
    var tx = channelState.db.transaction(OBJECT_STORE_ID, "readwrite", TRANSACTION_SETTINGS);
    var objectStore = tx.objectStore(OBJECT_STORE_ID);
    return Promise.all(ids.map(function(id) {
      var deleteRequest = objectStore["delete"](id);
      return new Promise(function(res) {
        deleteRequest.onsuccess = function() {
          return res();
        };
      });
    }));
  }
  function getOldMessages(db, ttl) {
    var olderThen = new Date().getTime() - ttl;
    var tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
    var objectStore = tx.objectStore(OBJECT_STORE_ID);
    var ret = [];
    return new Promise(function(res) {
      objectStore.openCursor().onsuccess = function(ev) {
        var cursor = ev.target.result;
        if (cursor) {
          var msgObk = cursor.value;
          if (msgObk.time < olderThen) {
            ret.push(msgObk);
            cursor["continue"]();
          } else {
            commitIndexedDBTransaction(tx);
            res(ret);
          }
        } else {
          res(ret);
        }
      };
    });
  }
  function cleanOldMessages(channelState) {
    return getOldMessages(channelState.db, channelState.options.idb.ttl).then(function(tooOld) {
      return removeMessagesById(channelState, tooOld.map(function(msg) {
        return msg.id;
      }));
    });
  }
  function create$2(channelName, options) {
    options = fillOptionsWithDefaults(options);
    return createDatabase(channelName).then(function(db) {
      var state = {
        closed: false,
        lastCursorId: 0,
        channelName,
        options,
        uuid: randomToken(),
        /**
         * emittedMessagesIds
         * contains all messages that have been emitted before
         * @type {ObliviousSet}
         */
        eMIs: new ObliviousSet(options.idb.ttl * 2),
        // ensures we do not read messages in parallel
        writeBlockPromise: PROMISE_RESOLVED_VOID,
        messagesCallback: null,
        readQueuePromises: [],
        db
      };
      db.onclose = function() {
        state.closed = true;
        if (options.idb.onclose)
          options.idb.onclose();
      };
      _readLoop(state);
      return state;
    });
  }
  function _readLoop(state) {
    if (state.closed)
      return;
    readNewMessages(state).then(function() {
      return sleep(state.options.idb.fallbackInterval);
    }).then(function() {
      return _readLoop(state);
    });
  }
  function _filterMessage(msgObj, state) {
    if (msgObj.uuid === state.uuid)
      return false;
    if (state.eMIs.has(msgObj.id))
      return false;
    if (msgObj.data.time < state.messagesCallbackTime)
      return false;
    return true;
  }
  function readNewMessages(state) {
    if (state.closed)
      return PROMISE_RESOLVED_VOID;
    if (!state.messagesCallback)
      return PROMISE_RESOLVED_VOID;
    return getMessagesHigherThan(state.db, state.lastCursorId).then(function(newerMessages) {
      var useMessages = newerMessages.filter(function(msgObj) {
        return !!msgObj;
      }).map(function(msgObj) {
        if (msgObj.id > state.lastCursorId) {
          state.lastCursorId = msgObj.id;
        }
        return msgObj;
      }).filter(function(msgObj) {
        return _filterMessage(msgObj, state);
      }).sort(function(msgObjA, msgObjB) {
        return msgObjA.time - msgObjB.time;
      });
      useMessages.forEach(function(msgObj) {
        if (state.messagesCallback) {
          state.eMIs.add(msgObj.id);
          state.messagesCallback(msgObj.data);
        }
      });
      return PROMISE_RESOLVED_VOID;
    });
  }
  function close$2(channelState) {
    channelState.closed = true;
    channelState.db.close();
  }
  function postMessage$2(channelState, messageJson) {
    channelState.writeBlockPromise = channelState.writeBlockPromise.then(function() {
      return writeMessage(channelState.db, channelState.uuid, messageJson);
    }).then(function() {
      if (randomInt(0, 10) === 0) {
        cleanOldMessages(channelState);
      }
    });
    return channelState.writeBlockPromise;
  }
  function onMessage$2(channelState, fn, time) {
    channelState.messagesCallbackTime = time;
    channelState.messagesCallback = fn;
    readNewMessages(channelState);
  }
  function canBeUsed$2() {
    return !!getIdb();
  }
  function averageResponseTime$2(options) {
    return options.idb.fallbackInterval * 2;
  }
  var IndexedDBMethod = {
    create: create$2,
    close: close$2,
    onMessage: onMessage$2,
    postMessage: postMessage$2,
    canBeUsed: canBeUsed$2,
    type: type$2,
    averageResponseTime: averageResponseTime$2,
    microSeconds: microSeconds$2
  };
  var microSeconds$1 = microSeconds$4;
  var KEY_PREFIX = "pubkey.broadcastChannel-";
  var type$1 = "localstorage";
  function getLocalStorage() {
    var localStorage2;
    if (typeof window === "undefined")
      return null;
    try {
      localStorage2 = window.localStorage;
      localStorage2 = window["ie8-eventlistener/storage"] || window.localStorage;
    } catch (e) {
    }
    return localStorage2;
  }
  function storageKey(channelName) {
    return KEY_PREFIX + channelName;
  }
  function postMessage$1(channelState, messageJson) {
    return new Promise(function(res) {
      sleep().then(function() {
        var key = storageKey(channelState.channelName);
        var writeObj = {
          token: randomToken(),
          time: new Date().getTime(),
          data: messageJson,
          uuid: channelState.uuid
        };
        var value = JSON.stringify(writeObj);
        getLocalStorage().setItem(key, value);
        var ev = document.createEvent("Event");
        ev.initEvent("storage", true, true);
        ev.key = key;
        ev.newValue = value;
        window.dispatchEvent(ev);
        res();
      });
    });
  }
  function addStorageEventListener(channelName, fn) {
    var key = storageKey(channelName);
    var listener = function listener2(ev) {
      if (ev.key === key) {
        fn(JSON.parse(ev.newValue));
      }
    };
    window.addEventListener("storage", listener);
    return listener;
  }
  function removeStorageEventListener(listener) {
    window.removeEventListener("storage", listener);
  }
  function create$1(channelName, options) {
    options = fillOptionsWithDefaults(options);
    if (!canBeUsed$1()) {
      throw new Error("BroadcastChannel: localstorage cannot be used");
    }
    var uuid = randomToken();
    var eMIs = new ObliviousSet(options.localstorage.removeTimeout);
    var state = {
      channelName,
      uuid,
      eMIs
      // emittedMessagesIds
    };
    state.listener = addStorageEventListener(channelName, function(msgObj) {
      if (!state.messagesCallback)
        return;
      if (msgObj.uuid === uuid)
        return;
      if (!msgObj.token || eMIs.has(msgObj.token))
        return;
      if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime)
        return;
      eMIs.add(msgObj.token);
      state.messagesCallback(msgObj.data);
    });
    return state;
  }
  function close$1(channelState) {
    removeStorageEventListener(channelState.listener);
  }
  function onMessage$1(channelState, fn, time) {
    channelState.messagesCallbackTime = time;
    channelState.messagesCallback = fn;
  }
  function canBeUsed$1() {
    var ls = getLocalStorage();
    if (!ls)
      return false;
    try {
      var key = "__broadcastchannel_check";
      ls.setItem(key, "works");
      ls.removeItem(key);
    } catch (e) {
      return false;
    }
    return true;
  }
  function averageResponseTime$1() {
    var defaultTime = 120;
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      return defaultTime * 2;
    }
    return defaultTime;
  }
  var LocalstorageMethod = {
    create: create$1,
    close: close$1,
    onMessage: onMessage$1,
    postMessage: postMessage$1,
    canBeUsed: canBeUsed$1,
    type: type$1,
    averageResponseTime: averageResponseTime$1,
    microSeconds: microSeconds$1
  };
  var microSeconds = microSeconds$4;
  var type = "simulate";
  var SIMULATE_CHANNELS = /* @__PURE__ */ new Set();
  function create(channelName) {
    var state = {
      name: channelName,
      messagesCallback: null
    };
    SIMULATE_CHANNELS.add(state);
    return state;
  }
  function close(channelState) {
    SIMULATE_CHANNELS["delete"](channelState);
  }
  function postMessage(channelState, messageJson) {
    return new Promise(function(res) {
      return setTimeout(function() {
        var channelArray = Array.from(SIMULATE_CHANNELS);
        channelArray.filter(function(channel) {
          return channel.name === channelState.name;
        }).filter(function(channel) {
          return channel !== channelState;
        }).filter(function(channel) {
          return !!channel.messagesCallback;
        }).forEach(function(channel) {
          return channel.messagesCallback(messageJson);
        });
        res();
      }, 5);
    });
  }
  function onMessage(channelState, fn) {
    channelState.messagesCallback = fn;
  }
  function canBeUsed() {
    return true;
  }
  function averageResponseTime() {
    return 5;
  }
  var SimulateMethod = {
    create,
    close,
    onMessage,
    postMessage,
    canBeUsed,
    type,
    averageResponseTime,
    microSeconds
  };
  var METHODS = [
    NativeMethod,
    // fastest
    IndexedDBMethod,
    LocalstorageMethod
  ];
  function chooseMethod(options) {
    var chooseMethods = [].concat(options.methods, METHODS).filter(Boolean);
    if (options.type) {
      if (options.type === "simulate") {
        return SimulateMethod;
      }
      var ret = chooseMethods.find(function(m2) {
        return m2.type === options.type;
      });
      if (!ret)
        throw new Error("method-type " + options.type + " not found");
      else
        return ret;
    }
    if (!options.webWorkerSupport) {
      chooseMethods = chooseMethods.filter(function(m2) {
        return m2.type !== "idb";
      });
    }
    var useMethod = chooseMethods.find(function(method) {
      return method.canBeUsed();
    });
    if (!useMethod)
      throw new Error("No usable method found in " + JSON.stringify(METHODS.map(function(m2) {
        return m2.type;
      })));
    else
      return useMethod;
  }
  var OPEN_BROADCAST_CHANNELS = /* @__PURE__ */ new Set();
  var lastId = 0;
  var BroadcastChannel$1 = function BroadcastChannel2(name, options) {
    this.id = lastId++;
    OPEN_BROADCAST_CHANNELS.add(this);
    this.name = name;
    if (ENFORCED_OPTIONS) {
      options = ENFORCED_OPTIONS;
    }
    this.options = fillOptionsWithDefaults(options);
    this.method = chooseMethod(this.options);
    this._iL = false;
    this._onML = null;
    this._addEL = {
      message: [],
      internal: []
    };
    this._uMP = /* @__PURE__ */ new Set();
    this._befC = [];
    this._prepP = null;
    _prepareChannel(this);
  };
  BroadcastChannel$1._pubkey = true;
  var ENFORCED_OPTIONS;
  BroadcastChannel$1.prototype = {
    postMessage: function postMessage2(msg) {
      if (this.closed) {
        throw new Error("BroadcastChannel.postMessage(): Cannot post message after channel has closed " + /**
         * In the past when this error appeared, it was really hard to debug.
         * So now we log the msg together with the error so it at least
         * gives some clue about where in your application this happens.
         */
        JSON.stringify(msg));
      }
      return _post(this, "message", msg);
    },
    postInternal: function postInternal(msg) {
      return _post(this, "internal", msg);
    },
    set onmessage(fn) {
      var time = this.method.microSeconds();
      var listenObj = {
        time,
        fn
      };
      _removeListenerObject(this, "message", this._onML);
      if (fn && typeof fn === "function") {
        this._onML = listenObj;
        _addListenerObject(this, "message", listenObj);
      } else {
        this._onML = null;
      }
    },
    addEventListener: function addEventListener(type2, fn) {
      var time = this.method.microSeconds();
      var listenObj = {
        time,
        fn
      };
      _addListenerObject(this, type2, listenObj);
    },
    removeEventListener: function removeEventListener(type2, fn) {
      var obj = this._addEL[type2].find(function(obj2) {
        return obj2.fn === fn;
      });
      _removeListenerObject(this, type2, obj);
    },
    close: function close2() {
      var _this = this;
      if (this.closed) {
        return;
      }
      OPEN_BROADCAST_CHANNELS["delete"](this);
      this.closed = true;
      var awaitPrepare = this._prepP ? this._prepP : PROMISE_RESOLVED_VOID;
      this._onML = null;
      this._addEL.message = [];
      return awaitPrepare.then(function() {
        return Promise.all(Array.from(_this._uMP));
      }).then(function() {
        return Promise.all(_this._befC.map(function(fn) {
          return fn();
        }));
      }).then(function() {
        return _this.method.close(_this._state);
      });
    },
    get type() {
      return this.method.type;
    },
    get isClosed() {
      return this.closed;
    }
  };
  function _post(broadcastChannel, type2, msg) {
    var time = broadcastChannel.method.microSeconds();
    var msgObj = {
      time,
      type: type2,
      data: msg
    };
    var awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : PROMISE_RESOLVED_VOID;
    return awaitPrepare.then(function() {
      var sendPromise = broadcastChannel.method.postMessage(broadcastChannel._state, msgObj);
      broadcastChannel._uMP.add(sendPromise);
      sendPromise["catch"]().then(function() {
        return broadcastChannel._uMP["delete"](sendPromise);
      });
      return sendPromise;
    });
  }
  function _prepareChannel(channel) {
    var maybePromise = channel.method.create(channel.name, channel.options);
    if (isPromise(maybePromise)) {
      channel._prepP = maybePromise;
      maybePromise.then(function(s) {
        channel._state = s;
      });
    } else {
      channel._state = maybePromise;
    }
  }
  function _hasMessageListeners(channel) {
    if (channel._addEL.message.length > 0)
      return true;
    if (channel._addEL.internal.length > 0)
      return true;
    return false;
  }
  function _addListenerObject(channel, type2, obj) {
    channel._addEL[type2].push(obj);
    _startListening(channel);
  }
  function _removeListenerObject(channel, type2, obj) {
    channel._addEL[type2] = channel._addEL[type2].filter(function(o) {
      return o !== obj;
    });
    _stopListening(channel);
  }
  function _startListening(channel) {
    if (!channel._iL && _hasMessageListeners(channel)) {
      var listenerFn = function listenerFn2(msgObj) {
        channel._addEL[msgObj.type].forEach(function(listenerObject) {
          var hundredMsInMicro = 100 * 1e3;
          var minMessageTime = listenerObject.time - hundredMsInMicro;
          if (msgObj.time >= minMessageTime) {
            listenerObject.fn(msgObj.data);
          }
        });
      };
      var time = channel.method.microSeconds();
      if (channel._prepP) {
        channel._prepP.then(function() {
          channel._iL = true;
          channel.method.onMessage(channel._state, listenerFn, time);
        });
      } else {
        channel._iL = true;
        channel.method.onMessage(channel._state, listenerFn, time);
      }
    }
  }
  function _stopListening(channel) {
    if (channel._iL && !_hasMessageListeners(channel)) {
      channel._iL = false;
      var time = channel.method.microSeconds();
      channel.method.onMessage(channel._state, null, time);
    }
  }
  const escaped = {
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
  class DevalueError extends Error {
    /**
     * @param {string} message
     * @param {string[]} keys
     */
    constructor(message, keys) {
      super(message);
      this.name = "DevalueError";
      this.path = keys.join("");
    }
  }
  function is_primitive(thing) {
    return Object(thing) !== thing;
  }
  const object_proto_names = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
  function is_plain_object(thing) {
    const proto = Object.getPrototypeOf(thing);
    return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
  }
  function get_type(thing) {
    return Object.prototype.toString.call(thing).slice(8, -1);
  }
  function stringify_string(str) {
    let result = '"';
    for (let i = 0; i < str.length; i += 1) {
      const char = str.charAt(i);
      const code = char.charCodeAt(0);
      if (char === '"') {
        result += '\\"';
      } else if (char in escaped) {
        result += escaped[char];
      } else if (code <= 31) {
        result += `\\u${code.toString(16).toUpperCase().padStart(4, "0")}`;
      } else if (code >= 55296 && code <= 57343) {
        const next = str.charCodeAt(i + 1);
        if (code <= 56319 && next >= 56320 && next <= 57343) {
          result += char + str[++i];
        } else {
          result += `\\u${code.toString(16).toUpperCase()}`;
        }
      } else {
        result += char;
      }
    }
    result += '"';
    return result;
  }
  const UNDEFINED = -1;
  const HOLE = -2;
  const NAN = -3;
  const POSITIVE_INFINITY = -4;
  const NEGATIVE_INFINITY = -5;
  const NEGATIVE_ZERO = -6;
  function parse(serialized, revivers) {
    return unflatten(JSON.parse(serialized), revivers);
  }
  function unflatten(parsed, revivers) {
    if (typeof parsed === "number")
      return hydrate(parsed, true);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Invalid input");
    }
    const values = (
      /** @type {any[]} */
      parsed
    );
    const hydrated = Array(values.length);
    function hydrate(index, standalone = false) {
      if (index === UNDEFINED)
        return void 0;
      if (index === NAN)
        return NaN;
      if (index === POSITIVE_INFINITY)
        return Infinity;
      if (index === NEGATIVE_INFINITY)
        return -Infinity;
      if (index === NEGATIVE_ZERO)
        return -0;
      if (standalone)
        throw new Error(`Invalid input`);
      if (index in hydrated)
        return hydrated[index];
      const value = values[index];
      if (!value || typeof value !== "object") {
        hydrated[index] = value;
      } else if (Array.isArray(value)) {
        if (typeof value[0] === "string") {
          const type2 = value[0];
          const reviver = revivers == null ? void 0 : revivers[type2];
          if (reviver) {
            return hydrated[index] = reviver(hydrate(value[1]));
          }
          switch (type2) {
            case "Date":
              hydrated[index] = new Date(value[1]);
              break;
            case "Set":
              const set2 = /* @__PURE__ */ new Set();
              hydrated[index] = set2;
              for (let i = 1; i < value.length; i += 1) {
                set2.add(hydrate(value[i]));
              }
              break;
            case "Map":
              const map = /* @__PURE__ */ new Map();
              hydrated[index] = map;
              for (let i = 1; i < value.length; i += 2) {
                map.set(hydrate(value[i]), hydrate(value[i + 1]));
              }
              break;
            case "RegExp":
              hydrated[index] = new RegExp(value[1], value[2]);
              break;
            case "Object":
              hydrated[index] = Object(value[1]);
              break;
            case "BigInt":
              hydrated[index] = BigInt(value[1]);
              break;
            case "null":
              const obj = /* @__PURE__ */ Object.create(null);
              hydrated[index] = obj;
              for (let i = 1; i < value.length; i += 2) {
                obj[value[i]] = hydrate(value[i + 1]);
              }
              break;
            default:
              throw new Error(`Unknown type ${type2}`);
          }
        } else {
          const array = new Array(value.length);
          hydrated[index] = array;
          for (let i = 0; i < value.length; i += 1) {
            const n = value[i];
            if (n === HOLE)
              continue;
            array[i] = hydrate(n);
          }
        }
      } else {
        const object = {};
        hydrated[index] = object;
        for (const key in value) {
          const n = value[key];
          object[key] = hydrate(n);
        }
      }
      return hydrated[index];
    }
    return hydrate(0);
  }
  function stringify(value, reducers) {
    const stringified = [];
    const indexes = /* @__PURE__ */ new Map();
    const custom = [];
    for (const key in reducers) {
      custom.push({ key, fn: reducers[key] });
    }
    const keys = [];
    let p = 0;
    function flatten(thing) {
      if (typeof thing === "function") {
        throw new DevalueError(`Cannot stringify a function`, keys);
      }
      if (indexes.has(thing))
        return indexes.get(thing);
      if (thing === void 0)
        return UNDEFINED;
      if (Number.isNaN(thing))
        return NAN;
      if (thing === Infinity)
        return POSITIVE_INFINITY;
      if (thing === -Infinity)
        return NEGATIVE_INFINITY;
      if (thing === 0 && 1 / thing < 0)
        return NEGATIVE_ZERO;
      const index2 = p++;
      indexes.set(thing, index2);
      for (const { key, fn } of custom) {
        const value2 = fn(thing);
        if (value2) {
          stringified[index2] = `["${key}",${flatten(value2)}]`;
          return index2;
        }
      }
      let str = "";
      if (is_primitive(thing)) {
        str = stringify_primitive(thing);
      } else {
        const type2 = get_type(thing);
        switch (type2) {
          case "Number":
          case "String":
          case "Boolean":
            str = `["Object",${stringify_primitive(thing)}]`;
            break;
          case "BigInt":
            str = `["BigInt",${thing}]`;
            break;
          case "Date":
            str = `["Date","${thing.toISOString()}"]`;
            break;
          case "RegExp":
            const { source, flags } = thing;
            str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
            break;
          case "Array":
            str = "[";
            for (let i = 0; i < thing.length; i += 1) {
              if (i > 0)
                str += ",";
              if (i in thing) {
                keys.push(`[${i}]`);
                str += flatten(thing[i]);
                keys.pop();
              } else {
                str += HOLE;
              }
            }
            str += "]";
            break;
          case "Set":
            str = '["Set"';
            for (const value2 of thing) {
              str += `,${flatten(value2)}`;
            }
            str += "]";
            break;
          case "Map":
            str = '["Map"';
            for (const [key, value2] of thing) {
              keys.push(
                `.get(${is_primitive(key) ? stringify_primitive(key) : "..."})`
              );
              str += `,${flatten(key)},${flatten(value2)}`;
            }
            str += "]";
            break;
          default:
            if (!is_plain_object(thing)) {
              throw new DevalueError(
                `Cannot stringify arbitrary non-POJOs`,
                keys
              );
            }
            if (Object.getOwnPropertySymbols(thing).length > 0) {
              throw new DevalueError(
                `Cannot stringify POJOs with symbolic keys`,
                keys
              );
            }
            if (Object.getPrototypeOf(thing) === null) {
              str = '["null"';
              for (const key in thing) {
                keys.push(`.${key}`);
                str += `,${stringify_string(key)},${flatten(thing[key])}`;
                keys.pop();
              }
              str += "]";
            } else {
              str = "{";
              let started = false;
              for (const key in thing) {
                if (started)
                  str += ",";
                started = true;
                keys.push(`.${key}`);
                str += `${stringify_string(key)}:${flatten(thing[key])}`;
                keys.pop();
              }
              str += "}";
            }
        }
      }
      stringified[index2] = str;
      return index2;
    }
    const index = flatten(value);
    if (index < 0)
      return `${index}`;
    return `[${stringified.join(",")}]`;
  }
  function stringify_primitive(thing) {
    const type2 = typeof thing;
    if (type2 === "string")
      return stringify_string(thing);
    if (thing instanceof String)
      return stringify_string(thing.toString());
    if (thing === void 0)
      return UNDEFINED.toString();
    if (thing === 0 && 1 / thing < 0)
      return NEGATIVE_ZERO.toString();
    if (type2 === "bigint")
      return `["BigInt","${thing}"]`;
    return String(thing);
  }
  function m(t, a, { initialize: d, type: r }) {
    let o = `${a.$id}-${t.toString()}`, n = new BroadcastChannel$1(o, { type: r }), l = false, e = 0;
    vue.watch(() => a[t], (i) => {
      l || (e = Date.now(), n.postMessage({ timestamp: e, state: parse(stringify(i)) })), l = false;
    }, { deep: true }), n.onmessage = (i) => {
      if (i === void 0) {
        n.postMessage({ timestamp: e, state: parse(stringify(a[t])) });
        return;
      }
      i.timestamp <= e || (l = true, e = i.timestamp, a[t] = i.state);
    };
    let u = () => n.postMessage(void 0), p = () => n.close();
    return d && u(), { sync: u, unshare: p };
  }
  var h = (t, a) => Object.keys(a).includes(t), g = ({ initialize: t = true, enable: a = true, type: d }) => ({ store: r, options: o }) => {
    var _a, _b;
    let n = ((_a = o == null ? void 0 : o.share) == null ? void 0 : _a.enable) ?? a, l = ((_b = o == null ? void 0 : o.share) == null ? void 0 : _b.omit) ?? [];
    !n || Object.keys(r.$state).forEach((e) => {
      var _a2;
      l.includes(e) || !h(e, r.$state) || m(e, r, { initialize: ((_a2 = o == null ? void 0 : o.share) == null ? void 0 : _a2.initialize) ?? t, type: d });
    });
  };
  const pinia = createPinia();
  pinia.use(
    g({
      enable: true,
      initialize: true
    })
  );
  const Stonecrop = {
    install: (app, options) => {
      const appRouter = options.router || router;
      app.use(appRouter);
      app.use(pinia);
      app.provide("$registry", new Registry(appRouter, options.doctypeLoader));
      for (const [tag, component] of Object.entries(options.components)) {
        app.component(tag, component);
      }
    }
  };
  exports2.Doctype = Doctype;
  exports2.Registry = Registry;
  exports2.Stonecrop = Stonecrop;
  exports2.useStonecrop = useStonecrop;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
