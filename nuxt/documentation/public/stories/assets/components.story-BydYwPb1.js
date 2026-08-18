import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, az as createTextVNode, au as createBaseVNode, av as defineComponent, aw as reactive } from "./vendor-BFYlYCwc.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "components.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const workOrder = reactive({
      complete: false
    });
    const displayOptions = reactive({
      displayColor: "--sc-segmented-display-background",
      textColor: "--sc-segmented-display-color",
      displayInput: 0,
      decimalPlaces: 2
    });
    const __returned__ = { workOrder, displayOptions };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { style: { "display": "flex", "flex-direction": "row", "gap": "1rem", "justify-content": "space-between" } };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BeamHeading = resolveComponent("BeamHeading");
  const _component_ItemCount = resolveComponent("ItemCount");
  const _component_SplitColumn = resolveComponent("SplitColumn");
  const _component_Variant = resolveComponent("Variant");
  const _component_BeamArrow = resolveComponent("BeamArrow");
  const _component_BeamBtn = resolveComponent("BeamBtn");
  const _component_BeamProgress = resolveComponent("BeamProgress");
  const _component_HstText = resolveComponent("HstText");
  const _component_HstNumber = resolveComponent("HstNumber");
  const _component_SegmentedDisplay = resolveComponent("SegmentedDisplay");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { title: "components" }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "split column" }, {
        default: withCtx(() => [
          createVNode(_component_SplitColumn, { "align-items": "flex-start" }, {
            left: withCtx(() => [
              createVNode(_component_BeamHeading, null, {
                default: withCtx(() => [..._cache[4] || (_cache[4] = [
                  createTextVNode(
                    " WO#2024-01-00001 ",
                    -1
                    /* CACHED */
                  ),
                  createBaseVNode(
                    "span",
                    { class: "beam--normal" },
                    "Ambrosia Pie",
                    -1
                    /* CACHED */
                  )
                ])]),
                _: 1
                /* STABLE */
              }),
              _cache[5] || (_cache[5] = createBaseVNode(
                "p",
                { class: "beam_copy" },
                " Sapien lobortis cupidatat quis viverra ipsam perspiciatis montes dicta nascetur sit debitis vitae eget, officia doloribus modi nullam. ",
                -1
                /* CACHED */
              ))
            ]),
            right: withCtx(() => [
              createVNode(_component_ItemCount, {
                denominator: "10",
                "model-value": "5"
              })
            ]),
            _: 1
            /* STABLE */
          }),
          _cache[8] || (_cache[8] = createBaseVNode(
            "hr",
            null,
            null,
            -1
            /* CACHED */
          )),
          createVNode(_component_SplitColumn, null, {
            left: withCtx(() => [..._cache[6] || (_cache[6] = [
              createBaseVNode(
                "p",
                { class: "beam_copy" },
                " Sapien lobortis cupidatat quis viverra ipsam perspiciatis montes dicta nascetur sit debitis vitae eget, officia doloribus modi nullam. ",
                -1
                /* CACHED */
              )
            ])]),
            right: withCtx(() => [..._cache[7] || (_cache[7] = [
              createBaseVNode(
                "p",
                {
                  class: "beam_copy",
                  style: { "text-align": "left" }
                },
                " Sapien lobortis cupidatat quis viverra ipsam perspiciatis montes dicta nascetur sit debitis vitae eget, officia doloribus modi nullam. ",
                -1
                /* CACHED */
              )
            ])]),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "arrow" }, {
        default: withCtx(() => [
          createVNode(_component_BeamArrow),
          _cache[11] || (_cache[11] = createBaseVNode(
            "hr",
            null,
            null,
            -1
            /* CACHED */
          )),
          createBaseVNode("div", _hoisted_1, [
            _cache[9] || (_cache[9] = createBaseVNode(
              "p",
              {
                class: "beam_copy",
                style: { "flex-basis": "100%" }
              },
              " Luctus condimentum repudiandae! Ex enim quas quis metus faucibus felis hic sodales natoque sapiente anim posuere aliquip, cupidatat, modi rem! ",
              -1
              /* CACHED */
            )),
            createVNode(_component_BeamArrow, { style: { "flex-basis": "100%" } }),
            _cache[10] || (_cache[10] = createBaseVNode(
              "p",
              {
                class: "beam_copy",
                style: { "flex-basis": "100%" }
              },
              " Luctus condimentum repudiandae! Ex enim quas quis metus faucibus felis hic sodales natoque sapiente anim posuere aliquip, cupidatat, modi rem! ",
              -1
              /* CACHED */
            ))
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "text elements" }, {
        default: withCtx(() => [
          createVNode(_component_BeamHeading, null, {
            default: withCtx(() => [..._cache[12] || (_cache[12] = [
              createTextVNode(
                " This is the Beam Heading. ",
                -1
                /* CACHED */
              ),
              createBaseVNode(
                "span",
                { class: "beam--normal" },
                "And this should not be bold.",
                -1
                /* CACHED */
              )
            ])]),
            _: 1
            /* STABLE */
          }),
          _cache[13] || (_cache[13] = createBaseVNode(
            "p",
            { class: "beam_copy" },
            [
              createTextVNode("This is standard copy. "),
              createBaseVNode("span", { class: "beam--bold" }, "And this is bold.")
            ],
            -1
            /* CACHED */
          )),
          _cache[14] || (_cache[14] = createBaseVNode(
            "p",
            { class: "beam_copy beam--alert" },
            "This is an alert!",
            -1
            /* CACHED */
          )),
          _cache[15] || (_cache[15] = createBaseVNode(
            "p",
            { class: "beam_copy" },
            " Here is long text. Luctus condimentum repudiandae! Ex enim quas quis metus faucibus felis hic sodales natoque sapiente anim posuere aliquip, cupidatat, modi rem! Adipisci conubia quaerat sint? Consequat dolores nam impedit id pariatur earum ultricies hic, consequatur qui! Nemo! Donec sagittis a! Accumsan! Aperiam impedit, quidem elit aut, facere, minim dignissim conubia blanditiis doloribus ex montes vitae exercitation. ",
            -1
            /* CACHED */
          ))
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "button" }, {
        default: withCtx(() => [
          createVNode(_component_BeamBtn, null, {
            default: withCtx(() => [..._cache[16] || (_cache[16] = [
              createTextVNode(
                "Click",
                -1
                /* CACHED */
              )
            ])]),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "progress block" }, {
        default: withCtx(() => [
          createVNode(_component_BeamProgress, {
            complete: $setup.workOrder.complete
          }, null, 8, ["complete"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Segmented Display" }, {
        controls: withCtx(() => [
          createVNode(_component_HstText, {
            modelValue: $setup.displayOptions.displayColor,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.displayOptions.displayColor = $event),
            title: "Display Background Color"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstText, {
            modelValue: $setup.displayOptions.textColor,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.displayOptions.textColor = $event),
            title: "Display Text Color"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstNumber, {
            modelValue: $setup.displayOptions.displayInput,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.displayOptions.displayInput = $event),
            title: "Display Number Input"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstNumber, {
            modelValue: $setup.displayOptions.decimalPlaces,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.displayOptions.decimalPlaces = $event),
            step: 1,
            title: "Decimal Places"
          }, null, 8, ["modelValue"])
        ]),
        default: withCtx(() => [
          createVNode(_component_SegmentedDisplay, {
            "display-color": $setup.displayOptions.displayColor,
            "text-color": $setup.displayOptions.textColor,
            "display-input": $setup.displayOptions.displayInput,
            "decimal-places": $setup.displayOptions.decimalPlaces
          }, null, 8, ["display-color", "text-color", "display-input", "decimal-places"])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "beam/components.story.vue";
const components_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/dell/StoneCrop/stonecrop/examples/beam/components.story.vue"]]);
export {
  components_story as default
};
