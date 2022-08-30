(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("vue")) : typeof define === "function" && define.amd ? define(["exports", "vue"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["@sedum/utilities"] = {}, global.Vue));
})(this, function(exports2, vue) {
  "use strict";
  function useKeyboardNav(options) {
    vue.onMounted(() => {
      for (const [event, config] of Object.entries(options.handlers)) {
        if (config.default !== true) {
          if (!config.listener) {
            throw new Error(`Missing listener for event: '${event}'`);
          }
          const elements = [];
          if (Array.isArray(options.elements.value)) {
            for (const element of options.elements.value) {
              if (element instanceof Element) {
                elements.push(element);
              } else {
                elements.push(element.$el);
              }
            }
          } else {
            elements.push(options.elements.value);
          }
          for (const element of elements) {
            element.addEventListener(event, config.listener, config.options);
          }
        }
      }
    });
    vue.onUnmounted(() => {
    });
  }
  function install(app) {
  }
  exports2.install = install;
  exports2.useKeyboardNav = useKeyboardNav;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});
