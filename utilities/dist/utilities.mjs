import { onMounted, onUnmounted } from "vue";
function useKeyboardNav(options) {
  onMounted(() => {
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
  onUnmounted(() => {
  });
}
function install(app) {
}
export {
  install,
  useKeyboardNav
};
