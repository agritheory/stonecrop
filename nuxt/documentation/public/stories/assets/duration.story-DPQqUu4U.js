import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, au as createBaseVNode, az as createTextVNode, aA as toDisplayString, av as defineComponent, ay as ref, aD as Aa } from "./vendor-BFYlYCwc.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "duration.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const durationMs = ref(0);
    const __returned__ = { durationMs, get ADuration() {
      return Aa;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { style: { "margin-top": "1rem", "font-size": "0.9em" } };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { title: "ADuration" }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Default (edit mode)" }, {
        default: withCtx(() => [
          createVNode($setup["ADuration"], {
            modelValue: $setup.durationMs,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.durationMs = $event),
            label: "Task Duration"
          }, null, 8, ["modelValue"]),
          createBaseVNode("p", _hoisted_1, [
            _cache[2] || (_cache[2] = createTextVNode(
              " v-model value: ",
              -1
              /* CACHED */
            )),
            createBaseVNode(
              "strong",
              null,
              toDisplayString($setup.durationMs) + " ms",
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Military time + seconds" }, {
        default: withCtx(() => [
          createVNode($setup["ADuration"], {
            modelValue: $setup.durationMs,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.durationMs = $event),
            label: "Shift Duration",
            "allow-military-time": true,
            "use-seconds": true
          }, null, 8, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Display mode (pre-saved value)" }, {
        default: withCtx(() => [
          createVNode($setup["ADuration"], {
            "model-value": 9e6,
            label: "Meeting Duration",
            mode: "display"
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Read mode" }, {
        default: withCtx(() => [
          createVNode($setup["ADuration"], {
            "model-value": 3661e3,
            label: "Session Duration",
            mode: "read"
          })
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "aform/duration.story.vue";
const duration_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/dell/StoneCrop/stonecrop/examples/aform/duration.story.vue"]]);
export {
  duration_story as default
};
