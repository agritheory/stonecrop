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
export {
  install,
  useKeyboardNav
};
