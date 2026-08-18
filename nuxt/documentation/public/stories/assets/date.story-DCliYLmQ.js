import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, au as createBaseVNode, av as defineComponent, aw as reactive, ax as computed, ay as ref } from "./vendor-BFYlYCwc.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "date.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const start = ref(/* @__PURE__ */ new Date());
    const state = reactive({
      selected: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      start: null,
      end: null,
      time: null,
      militaryTime: false,
      dateField: null
    });
    const handleDate = (data) => {
      state.selected = data.selected.toLocaleDateString();
      state.start = data.start != null ? data.start.toLocaleDateString() : null;
      state.end = data.end != null ? data.end.toLocaleDateString() : null;
    };
    const handleTime = (data) => {
      state.time = data;
    };
    const formattedTime = computed(() => {
      if (state.time == null) return "";
      return [state.time.hours, state.time.minutes, state.time.seconds].join(":") + state.time.meridiem;
    });
    const __returned__ = { start, state, handleDate, handleTime, formattedTime };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { style: { "width": "fit-content" } };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_HstText = resolveComponent("HstText");
  const _component_HstCheckbox = resolveComponent("HstCheckbox");
  const _component_ADateTime = resolveComponent("ADateTime");
  const _component_Variant = resolveComponent("Variant");
  const _component_ADatePicker = resolveComponent("ADatePicker");
  const _component_ADate = resolveComponent("ADate");
  const _component_ADateSelection = resolveComponent("ADateSelection");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { title: "ADate" }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Time Picker" }, {
        controls: withCtx(() => [
          createVNode(_component_HstText, {
            modelValue: $setup.formattedTime,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formattedTime = $event),
            title: "Time"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstCheckbox, {
            onClick: _cache[1] || (_cache[1] = () => $setup.state.militaryTime = !$setup.state.militaryTime),
            modelValue: $setup.state.militaryTime,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.state.militaryTime = $event),
            title: "Military Time"
          }, null, 8, ["modelValue"])
        ]),
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode(_component_ADateTime, {
              ref: "time-date",
              onGetTime: $setup.handleTime,
              allowMilitaryTime: $setup.state.militaryTime,
              "use-seconds": true
            }, null, 8, ["allowMilitaryTime"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Date Picker" }, {
        controls: withCtx(() => [
          createVNode(_component_HstText, {
            modelValue: $setup.state.selected,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.state.selected = $event),
            title: "Selected Date"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstText, {
            modelValue: $setup.state.start,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.state.start = $event),
            title: "Start Date"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstText, {
            modelValue: $setup.state.end,
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.state.end = $event),
            title: "End Date"
          }, null, 8, ["modelValue"])
        ]),
        default: withCtx(() => [
          createVNode(_component_ADatePicker, { onGetDate: $setup.handleDate })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Date Input with Picker" }, {
        default: withCtx(() => [
          createVNode(_component_ADate, {
            label: "Date",
            value: $setup.state.dateField
          }, null, 8, ["value"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Date Selection (Date Picker and Time)" }, {
        controls: withCtx(() => [
          createVNode(_component_HstText, {
            modelValue: $setup.state.selected,
            "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.state.selected = $event),
            title: "Selected Date"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstText, {
            modelValue: $setup.state.start,
            "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.state.start = $event),
            title: "Start Date"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstText, {
            modelValue: $setup.state.end,
            "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.state.end = $event),
            title: "End Date"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstText, {
            modelValue: $setup.formattedTime,
            "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.formattedTime = $event),
            title: "Time"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstCheckbox, {
            onClick: _cache[10] || (_cache[10] = () => $setup.state.militaryTime = !$setup.state.militaryTime),
            modelValue: $setup.state.militaryTime,
            "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $setup.state.militaryTime = $event),
            title: "Military Time"
          }, null, 8, ["modelValue"])
        ]),
        default: withCtx(() => [
          createVNode(_component_ADateSelection, {
            onGetDate: $setup.handleDate,
            onGetTime: $setup.handleTime
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
_sfc_main.__file = "aform/date.story.vue";
const date_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/dell/StoneCrop/stonecrop/examples/aform/date.story.vue"]]);
export {
  date_story as default
};
