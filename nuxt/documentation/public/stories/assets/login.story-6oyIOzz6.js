import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode } from "./vendor-BFYlYCwc.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {};
function _sfc_render(_ctx, _cache) {
  const _component_Login = resolveComponent("Login");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, null, {
    default: withCtx(() => [
      createVNode(_component_Login)
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "aform/login.story.vue";
const login_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/dell/StoneCrop/stonecrop/examples/aform/login.story.vue"]]);
export {
  login_story as default
};
