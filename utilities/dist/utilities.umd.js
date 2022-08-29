(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["@sedum/utilities"] = {}));
})(this, function(exports2) {
  "use strict";
  function useKeyboardNav(element, handlers) {
    for (const [event, config] of Object.entries(handlers)) {
      if (config.default !== true) {
        if (config.listener) {
          element.addEventListener(event, config.listener, config.options);
        } else {
          throw new Error(`Missing listener for event: '${event}'`);
        }
      }
    }
  }
  function install(app) {
  }
  exports2.install = install;
  exports2.useKeyboardNav = useKeyboardNav;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});
