import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, au as createBaseVNode, az as createTextVNode, aA as toDisplayString, av as defineComponent, ay as ref, aB as Pa } from "./vendor-BFYlYCwc.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "daterange.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const dateRange = ref({ start_date: null, end_date: null });
    const __returned__ = { dateRange, get ADateRange() {
      return Pa;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { style: { "min-height": "400px", "padding": "20px" } };
const _hoisted_2 = { style: { "margin-top": "1rem", "font-size": "0.9em" } };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { title: "ADateRange" }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Default (edit mode)" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["ADateRange"], {
              modelValue: $setup.dateRange,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.dateRange = $event),
              label: "Date Range"
            }, null, 8, ["modelValue"])
          ]),
          createBaseVNode("p", _hoisted_2, [
            _cache[1] || (_cache[1] = createTextVNode(
              " v-model: ",
              -1
              /* CACHED */
            )),
            createBaseVNode(
              "strong",
              null,
              toDisplayString(JSON.stringify($setup.dateRange)),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Read mode" }, {
        default: withCtx(() => [
          createVNode($setup["ADateRange"], {
            "model-value": { start_date: "2026-01-01", end_date: "2026-01-31" },
            label: "Date Range",
            mode: "read"
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Display mode" }, {
        default: withCtx(() => [
          createVNode($setup["ADateRange"], {
            "model-value": { start_date: "2026-01-01", end_date: "2026-01-31" },
            label: "Date Range",
            mode: "display"
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
_sfc_main.__file = "aform/daterange.story.vue";
const daterange_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/dell/StoneCrop/stonecrop/examples/aform/daterange.story.vue"]]);
export {
  daterange_story as default
};
